const express = require('express');
const os = require('os');

const app = express();

// Function to get the network IP address
const getNetworkIP = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (loopback) and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
};

app.get('/', (req, res) => {
  res.send('Test server is working!');
});

const PORT = 5000;
const networkIP = getNetworkIP();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running at http://localhost:${PORT}`);
  console.log(`Access from network at http://${networkIP}:${PORT}`);
});
