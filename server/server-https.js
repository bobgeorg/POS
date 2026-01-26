const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const os = require('os');
const connectDB = require('./config/db');
const productRouter = require('./routers/product');
const typeProductRouter = require('./routers/typeProduct');
const orderRoutes = require('./routers/orderRoutes');
const orderManagementRoutes = require('./routers/orderManagementRouter');
const configRoutes = require('./routers/configRouter');

const app = express();

app.use('/profile', productRouter);

connectDB();
app.use(cors());
app.use(express.json());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

// Serve static images from client public folder
app.use('/image', express.static(path.join(__dirname, '../client/public/image')));

app.use('/api/product/', productRouter);
app.use('/api/typeproduct/', typeProductRouter);
app.use('/api/orders', orderRoutes);
app.use('/ordermanagement', orderManagementRoutes);
app.use('/api/config', configRoutes);

// Serve React app from build folder
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

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

const PORT = process.env.PORT || 5000;
const HTTPS_PORT = process.env.HTTPS_PORT || 5443;
const networkIP = getNetworkIP();

// Check if SSL certificate files exist
const sslKeyPath = path.join(__dirname, 'server.key');
const sslCertPath = path.join(__dirname, 'server.cert');

if (fs.existsSync(sslKeyPath) && fs.existsSync(sslCertPath)) {
  // HTTPS Server Configuration
  const httpsOptions = {
    key: fs.readFileSync(sslKeyPath),
    cert: fs.readFileSync(sslCertPath)
  };

  // Create HTTPS server
  https.createServer(httpsOptions, app).listen(HTTPS_PORT, '0.0.0.0', () => {
    console.log(`✓ HTTPS Server is running at https://localhost:${HTTPS_PORT}`);
    console.log(`✓ Access from network at https://${networkIP}:${HTTPS_PORT}`);
    console.log(`\nFor mobile devices, update client/.env with:`);
    console.log(`REACT_APP_API_URL=https://${networkIP}:${HTTPS_PORT}`);
    console.log(`\nNote: You may need to accept the self-signed certificate warning in your browser.`);
  });
} else {
  console.error('SSL certificate files not found!');
  console.error('Please generate SSL certificates first. See HTTPS_SETUP.md for instructions.');
  process.exit(1);
}
