const fs = require('fs');
const os = require('os');
const path = require('path');

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

const networkIP = getNetworkIP();
const PORT = process.env.PORT || 5000;
const envPath = path.join(__dirname, 'client', '.env');

// Update or create .env file
const envContent = `REACT_APP_API_URL=http://${networkIP}:${PORT}\n`;

fs.writeFileSync(envPath, envContent);

console.log(`✓ Updated ${envPath}`);
console.log(`  REACT_APP_API_URL=http://${networkIP}:${PORT}`);
console.log(`\nYour mobile devices can now access the app at: http://${networkIP}:3000`);
