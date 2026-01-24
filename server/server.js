const express = require('express');
const cors = require('cors');
const path = require('path');
const os = require('os');
const connectDB = require('./config/db');
const productRouter = require('./routers/product');
const typeProductRouter = require('./routers/typeProduct');
const orderRoutes = require('./routers/orderRoutes');
const orderManagementRoutes = require('./routers/orderManagementRouter');
// const fileUpload = require("express-fileupload");
const app = express();

app.use('/profile', productRouter);

connectDB();
app.use(cors());
app.use(express.json());
// app.use(fileUpload());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// app.use(fileupload());

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

// Serve static images from client public folder
app.use('/image', express.static(path.join(__dirname, '../client/public/image')));

app.use('/api/product/', productRouter);
app.use('/api/typeproduct/', typeProductRouter);
app.use('/api/orders', orderRoutes);
app.use('/ordermanagement', orderManagementRoutes);
// app.get("/", (req, res) => res.send("Hello all!"));

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
const networkIP = getNetworkIP();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log(`Access from network at http://${networkIP}:${PORT}`);
  console.log(`\nFor mobile devices, update client/.env with:`);
  console.log(`REACT_APP_API_URL=http://${networkIP}:${PORT}`);
});
