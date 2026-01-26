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

// Load environment variables from root .env if it exists
const rootEnvPath = path.join(__dirname, '.env');
if (fs.existsSync(rootEnvPath)) {
  require('dotenv').config({ path: rootEnvPath });
}

const networkIP = getNetworkIP();
const USE_HTTPS = process.env.USE_HTTPS === 'true';
const PORT = USE_HTTPS ? (process.env.HTTPS_PORT || 5443) : (process.env.PORT || 5000);
const PROTOCOL = USE_HTTPS ? 'https' : 'http';
const envPath = path.join(__dirname, 'client', '.env');

// Update or create .env file
const envContent = `REACT_APP_API_URL=${PROTOCOL}://${networkIP}:${PORT}\n`;

fs.writeFileSync(envPath, envContent);

console.log(`✓ Updated ${envPath}`);
console.log(`  REACT_APP_API_URL=${PROTOCOL}://${networkIP}:${PORT}`);
console.log(`\nYour mobile devices can now access the app at: ${PROTOCOL}://${networkIP}:3000`);
if (USE_HTTPS) {
  console.log(`  Note: You'll need to accept the self-signed certificate warning on each device.`);
}
