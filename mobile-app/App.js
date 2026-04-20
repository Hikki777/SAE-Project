import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Animated, Image, Vibration } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';
import NetInfo from '@react-native-community/netinfo';
import { StatusBar } from 'expo-status-bar';

import client, { updateBaseUrl, loadSavedUrl } from './src/api/client';
import offlineQueueService from './src/services/offlineQueue';

// Constantes de Estado
const VIEWS = {
  SETUP: 'SETUP',
  LOGIN: 'LOGIN',
  WAITING: 'WAITING',
  SCANNER: 'SCANNER'
};

export default function App() {
  const [currentView, setCurrentView] = useState(VIEWS.SETUP);
  const [permission, requestPermission] = useCameraPermissions();
  const [serverUrl, setServerUrl] = useState('');
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Equipo State
  const [equipoName, setEquipoName] = useState('Escáner Móvil');
  
  // App State
  const [socket, setSocket] = useState(null);
  const [equipoId, setEquipoId] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [lastScan, setLastScan] = useState(null);

  // Sonidos
  const [soundOk, setSoundOk] = useState();
  const [soundError, setSoundError] = useState();

  // Animaciones
  const scanAnim = new Animated.Value(0);

  useEffect(() => {
    loadSounds();
    checkExistingSetup();

    // Sincronizador de red
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
      if (state.isConnected) {
        syncPendingData();
      }
    });

    // Refresh pendientes local
    const interval = setInterval(async () => {
      const count = await offlineQueueService.getQueueCount();
      setPendingCount(count);
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
      if (soundOk) soundOk.unloadAsync();
      if (soundError) soundError.unloadAsync();
      if (socket) socket.disconnect();
    };
  }, []);

  const loadSounds = async () => {
    try {
       // Using short generic system sounds for enterprise feedback
       // (Fallback si no hay audio asset local es usar haptics o emitir silencioso,
       // pero la librería expo-av permite cargar URIs o Require)
       // Para este blank template usaremos silencioso hasta definir assets, pero preparamos la carga.
    } catch(e){}
  };

  const playBeep = async (success) => {
     if (success) {
       Vibration.vibrate(100); // Vibración corta = OK
       if (soundOk) await soundOk.replayAsync();
     } else {
       Vibration.vibrate([0, 100, 100, 100]); // Vibración doble = Error
       if (soundError) await soundError.replayAsync();
     }
  };

  const checkExistingSetup = async () => {
    const url = await loadSavedUrl();
    const token = await AsyncStorage.getItem('token');
    const qId = await AsyncStorage.getItem('equipoId');

    if (url) setServerUrl(url.replace('/api', ''));
    if (url && token && qId) {
      setEquipoId(qId);
      await connectSocket(url, token, qId);
    } else if (url) {
      setCurrentView(VIEWS.LOGIN);
    }
  };

  const syncPendingData = async () => {
    const count = await offlineQueueService.syncQueue();
    if (count > 0) {
      // alert or log
      const newCount = await offlineQueueService.getQueueCount();
      setPendingCount(newCount);
    }
  };

  const connectSocket = async (url, token, eId) => {
    try {
      const apiDest = url.endsWith('/api') ? url : `${url}/api`;
      const socketDest = url.replace('/api', '') + '/client';

      const newSocket = io(socketDest, {
        auth: { token, equipoId: eId }
      });

      newSocket.on('connect', () => {
        setIsOnline(true);
        // Iniciar Heartbeat
        setInterval(() => {
          newSocket.emit('heartbeat');
        }, 15000);
      });

      newSocket.on('approval-status', (data) => {
        if (data.aprobado) {
          setCurrentView(VIEWS.SCANNER);
        } else {
           setCurrentView(VIEWS.WAITING);
        }
      });

      // Validar Aprobación inicial mediante API REST
      try {
        const res = await client.get(`/institucion/equipos/${eId}`);
        if (res.data && res.data.aprobado) {
          setCurrentView(VIEWS.SCANNER);
        } else {
          setCurrentView(VIEWS.WAITING);
        }
      } catch(e) {
        setCurrentView(VIEWS.WAITING);
      }

      setSocket(newSocket);
    } catch(e) {
      setCurrentView(VIEWS.WAITING);
    }
  };

  const handleSetup = async () => {
    if (!serverUrl) return Alert.alert('Error', 'Debe ingresar IP/URL');
    // Save URL Setup
    const cleanUrl = serverUrl.startsWith('http') ? serverUrl : `http://${serverUrl}`;
    await updateBaseUrl(cleanUrl);
    setCurrentView(VIEWS.LOGIN);
  };
  
  const handleQRSetup = ({ data }) => {
    // Si escaneó el QR autogenerado por SAE Windows
    // Ej: SAE-CONFIG|http://192.168.1.15:58824
    if (data.startsWith('SAE-CONFIG|')) {
      const url = data.split('|')[1];
      setServerUrl(url);
      updateBaseUrl(url).then(() => setCurrentView(VIEWS.LOGIN));
      playBeep(true);
    }
  };

  const handleLogin = async () => {
    try {
      // 1. Auth Normal
      const loginRes = await client.post('/auth/login', { 
        email, password, keepSession: true 
      });
      const { token } = loginRes.data;
      await AsyncStorage.setItem('token', token);

      // 2. Registrar Equipo
      const eqpRes = await client.post('/institucion/equipos', {
        nombre: equipoName,
        mac_address: 'ANDROID-' + Math.floor(Math.random() * 10000)
      });
      
      const newEqId = eqpRes.data.id.toString();
      await AsyncStorage.setItem('equipoId', newEqId);
      setEquipoId(newEqId);

      // 3. Conectar y esperar
      await connectSocket(serverUrl, token, newEqId);
      setCurrentView(VIEWS.WAITING);
    } catch (e) {
      Alert.alert('Error de Conexión', e.response?.data?.message || e.message);
    }
  };

  const handleScanCarnet = async ({ data }) => {
    if (Date.now() - lastScan < 2500) return; // Prevent double scan trap (2.5s anti-bounce)
    setLastScan(Date.now());
    
    // Animation
    Animated.sequence([
      Animated.timing(scanAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.timing(scanAnim, { toValue: 0, duration: 200, useNativeDriver: true })
    ]).start();

    // Identificar entrada vs salida
    // Por simplicidad, este ejemplo asume la lógica del servidor de Auto-Detección
    const payload = {
      carnet: data,
      fecha: new Date().toISOString(),
      action: 'auto'
    };

    try {
      if (isOnline) {
        await client.post('/asistencias/scan', payload);
        playBeep(true);
      } else {
        await offlineQueueService.addToQueue('/asistencias/scan', 'POST', payload);
        playBeep(true);
        const newCount = await offlineQueueService.getQueueCount();
        setPendingCount(newCount);
      }
    } catch(e) {
      playBeep(false);
      Alert.alert('Escaneo Fallido', e.response?.data?.message || 'Error guardando');
    }
  };

  // ─── RENDERIZADO CONDICIONAL ─────────────────────────────────

  if (!permission) return <View />;
  if (!permission.granted && currentView !== VIEWS.SETUP && currentView !== VIEWS.LOGIN) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Se necesita permiso de cámara</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Conceder Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* HEADER GLOBAl */}
      <View style={styles.header}>
        <Text style={styles.headerText}>SAE Scanner</Text>
        <View style={[styles.statusDot, { backgroundColor: isOnline ? '#22c55e' : '#eab308' }]} />
      </View>

      {/* VISTA 1: SETUP (QR O MANUAL) */}
      {currentView === VIEWS.SETUP && (
        <View style={styles.card}>
          <Text style={styles.title}>Vincular Sistema</Text>
          <Text style={styles.subtitle}>Escanea el QR en "Equipos" de tu PC, o ingresa la IP.</Text>
          
          <View style={styles.qrContainer}>
            {permission?.granted ? (
              <CameraView
                style={styles.camera}
                onBarcodeScanned={handleQRSetup}
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
              />
            ) : (
               <TouchableOpacity style={styles.btnScanSetup} onPress={requestPermission}>
                 <Text style={styles.btnText}>Activar Cámara</Text>
               </TouchableOpacity>
            )}
          </View>

          <Text style={{textAlign: 'center', marginVertical: 10, color: '#666'}}>Ó MANUALMENTE</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Ej: http://192.168.1.15:58824"
            value={serverUrl}
            onChangeText={setServerUrl}
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.btn} onPress={handleSetup}>
            <Text style={styles.btnText}>Conectar Manual</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* VISTA 2: LOGIN */}
      {currentView === VIEWS.LOGIN && (
        <View style={styles.card}>
          <Text style={styles.title}>Login Operador</Text>
          <TextInput
             style={styles.input}
             placeholder="Correo Electrónico"
             value={email}
             onChangeText={setEmail}
             autoCapitalize="none"
          />
          <TextInput
             style={styles.input}
             placeholder="Contraseña"
             secureTextEntry
             value={password}
             onChangeText={setPassword}
          />
          <Text style={[styles.title, {fontSize:16, marginTop: 15}]}>Nombre del Dispositivo</Text>
          <TextInput
             style={styles.input}
             placeholder="Ej: Celular Patio Principal"
             value={equipoName}
             onChangeText={setEquipoName}
          />
          <TouchableOpacity style={styles.btn} onPress={handleLogin}>
            <Text style={styles.btnText}>Entrar y Registrar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* VISTA 3: WAITING APPROVAL */}
      {currentView === VIEWS.WAITING && (
        <View style={styles.card}>
          <Text style={[styles.title, {color:'#eab308'}]}>Esperando Autorización</Text>
          <Text style={styles.subtitle}>Tu dispositivo ha sido registrado pero requiere que un Administrador lo apruebe desde el Panel Principal de Windows para garantizar la seguridad médica.</Text>
          <Text style={[styles.title, {fontSize: 14, marginTop: 20}]}>La configuración se aplicará automáticamente en cuanto te aprueben por la red...</Text>
        </View>
      )}

      {/* VISTA 4: SCANNER PRINCIPAL */}
      {currentView === VIEWS.SCANNER && (
        <View style={styles.scannerWrapper}>
           <CameraView 
             style={StyleSheet.absoluteFillObject}
             onBarcodeScanned={handleScanCarnet}
           />
           <Animated.View style={[styles.scanOverlay, { opacity: scanAnim }]} />
           
           <View style={styles.overlayUI}>
              <View style={styles.topPill}>
                <Text style={styles.pillText}>{isOnline ? 'MODO EN LÍNEA' : 'MODO SIN CONEXIÓN'}</Text>
              </View>
              
              <View style={styles.hudFrame} />
              
              <View style={styles.bottomPill}>
                <Text style={styles.pillText}>Pendientes de sincronizar: {pendingCount}</Text>
              </View>
           </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', paddingTop: 40 },
  header: { flexDirection: 'row', padding: 20, alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1e293b' },
  headerText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  statusDot: { width: 12, height: 12, borderRadius: 6 },
  card: { backgroundColor: 'white', margin: 20, padding: 20, borderRadius: 10 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1e293b', marginBottom: 5 },
  subtitle: { fontSize: 13, color: '#64748b', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', padding: 12, borderRadius: 8, marginBottom: 15, fontSize: 16 },
  btn: { backgroundColor: '#8b1e1e', padding: 15, borderRadius: 8, alignItems: 'center' },
  btnScanSetup: { backgroundColor: '#0369a1', padding: 15, borderRadius: 8, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  qrContainer: { height: 200, width: '100%', borderRadius: 10, overflow: 'hidden', backgroundColor: '#e2e8f0', marginBottom: 10 },
  camera: { flex: 1 },
  text: { color: 'white', textAlign: 'center', fontSize: 18, margin: 20 },
  scannerWrapper: { flex: 1, backgroundColor: '#000' },
  scanOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(34, 197, 94, 0.4)' },
  overlayUI: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 40 },
  topPill: { backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  bottomPill: { backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  pillText: { color: 'white', fontWeight: 'bold' },
  hudFrame: { width: 250, height: 250, borderWidth: 4, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 20 }
});
