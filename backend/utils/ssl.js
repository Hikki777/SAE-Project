const path = require('path');
const fs = require('fs-extra');
const { execSync } = require('child_process');

/**
 * Utility to manage self-signed SSL certificates for local HTTPS
 */
async function getSSLCertificates(saeDataDir, logger) {
  // Use SAE_DATA_DIR/certs if available (Electron), or backend/certs (Dev)
  const certsDir = saeDataDir 
    ? path.join(saeDataDir, 'certs') 
    : path.join(__dirname, '..', 'certs');
    
  const keyPath = path.join(certsDir, 'server.key');
  const certPath = path.join(certsDir, 'server.crt');

  // If certs already exist, return them
  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    try {
      return {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
      };
    } catch (err) {
      if (logger) logger.error({ err }, 'Error reading existing SSL certificates');
      return null;
    }
  }

  // Try to generate them
  if (logger) logger.info('SSL certificates not found. Attempting to generate self-signed certificates...');
  
  try {
    await fs.ensureDir(certsDir);

    // List of possible openssl paths on Windows
    const opensslPaths = [
      'openssl', // If in PATH
      'C:\\Program Files\\Git\\usr\\bin\\openssl.exe',
      'C:\\Program Files\\OpenSSL-Win64\\bin\\openssl.exe'
    ];

    let opensslCmd = null;
    for (const p of opensslPaths) {
      try {
        execSync(`"${p}" version`, { stdio: 'ignore' });
        opensslCmd = p;
        break;
      } catch (e) {
        // Continue
      }
    }

    if (!opensslCmd) {
      if (logger) logger.warn('OpenSSL not found. Cannot generate self-signed certificates automatically.');
      return null;
    }

    if (logger) logger.info({ path: opensslCmd }, 'Using OpenSSL to generate certificates');

    // Generate self-signed certificate (valid for 10 years)
    const cmd = `"${opensslCmd}" req -x509 -newkey rsa:2048 -keyout "${keyPath}" -out "${certPath}" -days 3650 -nodes -subj "/CN=localhost/O=SAE/OU=Development"`;
    
    execSync(cmd, { stdio: 'ignore' });

    if (logger) logger.info('Self-signed SSL certificates generated successfully');

    return {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath)
    };
  } catch (err) {
    if (logger) logger.error({ err }, 'Failed to generate SSL certificates');
    return null;
  }
}

module.exports = { getSSLCertificates };
