const axios = require('axios');

async function checkEndpoint() {
  try {
    console.log('Testing http://localhost:5000/api/health...');
    const health = await axios.get('http://localhost:5000/api/health');
    console.log('Health Status:', health.status);

    console.log('Testing http://localhost:5000/api/dashboard/stats...');
    const res = await axios.get('http://localhost:5000/api/dashboard/stats');
    console.log('Status:', res.status);
    console.log('Data:', JSON.stringify(res.data, null, 2));
    
    if (res.data.qrsGenerados !== undefined) {
      console.log('✅ qrsGenerados found:', res.data.qrsGenerados);
    } else {
      console.log('❌ qrsGenerados NOT found in response');
    }
  } catch (error) {
    console.error('Request failed:', error.message);
    if (error.response) {
      console.log('Response data:', error.response.data);
      console.log('Response status:', error.response.status);
    }
  }
}

checkEndpoint();
