# Restaurant POS - Complete Setup Guide

This guide will help you set up and run the Restaurant POS application from scratch.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start (Automated Setup)](#quick-start-automated-setup)
- [Manual Setup](#manual-setup)
- [Database Configuration](#database-configuration)
- [Running the Application](#running-the-application)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, make sure you have the following installed on your system:

### 1. Node.js (v14 or higher)
- **Download:** https://nodejs.org/
- **Verify installation:**
  ```bash
  node --version
  npm --version
  ```

### 2. MongoDB (v4.4 or higher)
- **Option A - Local MongoDB:**
  - **Windows:** Download from https://www.mongodb.com/try/download/community
  - **Installation Guide:** https://docs.mongodb.com/manual/installation/
  - Default connection: `mongodb://localhost:27017`

- **Option B - MongoDB Atlas (Cloud):**
  - Create free account at https://www.mongodb.com/cloud/atlas
  - Create a cluster and get connection string

- **Verify MongoDB is running:**
  ```bash
  # Windows (in Command Prompt)
  net start MongoDB
  
  # Or check with mongosh (MongoDB Shell)
  mongosh
  ```

### 3. Git (Optional, for cloning)
- **Download:** https://git-scm.com/downloads

---

## Quick Start (Automated Setup)

### For Windows Users:

1. **Extract or clone the POS folder** to your desired location

2. **Run the setup script:**
   ```bash
   setup.bat
   ```
   This will:
   - Check for Node.js and MongoDB
   - Install all dependencies (server + client)
   - Initialize configuration
   - Build the client application

3. **Start the application:**
   ```bash
   start-pos.bat
   ```

4. **Access the application:**
   - Open browser: http://localhost:5000
   - Admin panel: http://localhost:5000/admin

---

## Manual Setup

If the automated setup doesn't work or you prefer manual setup:

### Step 1: Install Dependencies

**Install server dependencies:**
```bash
npm install
```

**Install client dependencies:**
```bash
cd client
npm install
cd ..
```

### Step 2: Environment Configuration

**Create environment files:**

1. **Root `.env` file** (copy from `.env.example`):
   ```bash
   copy .env.example .env
   ```
   
   Edit `.env`:
   ```env
   # HTTP/HTTPS Configuration
   USE_HTTPS=false
   HTTPS_PORT=5443
   PORT=5000
   ```

2. **Client `.env` file** (`client/.env`):
   ```bash
   cd client
   echo REACT_APP_API_URL=http://localhost:5000 > .env
   cd ..
   ```

### Step 3: Database Configuration

**Choose your database option:**

#### Option A: Local MongoDB

Edit `server/config/db.js`:
```javascript
const MONGO_URI = "mongodb://localhost:27017/restaurant-pos";
```

**Make sure MongoDB is running:**
```bash
# Windows Service
net start MongoDB

# Or run manually
mongod --dbpath C:\data\db
```

#### Option B: MongoDB Atlas (Cloud)

1. **Create a MongoDB Atlas account:**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a free cluster
   - Create a database user
   - Whitelist your IP address (or use 0.0.0.0/0 for all IPs)

2. **Get connection string:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

3. **Update `server/config/db.js`:**
   ```javascript
   const MONGO_URI = "mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/restaurant-pos?retryWrites=true&w=majority";
   ```
   Replace:
   - `<username>` with your database username
   - `<password>` with your database password
   - `cluster0.xxxxx` with your cluster address

### Step 4: Initialize Configuration

**Initialize app configuration in database:**
```bash
npm run init-config
```

This creates default configuration settings in the database.

### Step 5: Seed Sample Data (Optional)

**To populate the database with sample products:**
```bash
cd server
node seed.js
cd ..
```

### Step 6: Build Client Application

**Build the React client:**
```bash
cd client
npm run build
cd ..
```

Or use the root command:
```bash
npm run build-client
```

---

## Running the Application

### Development Mode

**Start server and client separately:**

Terminal 1 (Server):
```bash
npm run server
```

Terminal 2 (Client):
```bash
npm run client
```

Or start both together:
```bash
npm run dev
```

### Production Mode

**Start with built client:**
```bash
npm start
```

Or use the batch file (Windows):
```bash
start-pos.bat
```

### HTTPS Mode (Local Development)

1. **Enable HTTPS in `.env`:**
   ```env
   USE_HTTPS=true
   HTTPS_PORT=5443
   ```

2. **Generate SSL certificates:**
   ```bash
   cd server
   openssl req -x509 -newkey rsa:4096 -keyout server.key -out server.cert -days 365 -nodes
   cd ..
   ```

3. **Start with HTTPS:**
   ```bash
   npm run start-https
   ```
   Or:
   ```bash
   start-pos-https.bat
   ```

4. **Access at:** https://localhost:5443
   - Accept the self-signed certificate warning

See [HTTPS_SETUP.md](HTTPS_SETUP.md) for detailed HTTPS configuration.

---

## Application URLs

### HTTP Mode (Default)
- **Main Application:** http://localhost:5000
- **Admin Panel:** http://localhost:5000/admin
- **Orders View:** http://localhost:5000/orders

### HTTPS Mode
- **Main Application:** https://localhost:5443
- **Admin Panel:** https://localhost:5443/admin
- **Orders View:** https://localhost:5443/orders

### Network Access (Other Devices)
Replace `localhost` with your computer's IP address:
- Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
- Example: http://192.168.1.9:5000

**Update client configuration for network access:**
```bash
npm run update-ip
```

---

## Database Configuration Details

### Connection String Format

**Local MongoDB:**
```
mongodb://localhost:27017/restaurant-pos
```

**MongoDB with Authentication:**
```
mongodb://username:password@localhost:27017/restaurant-pos
```

**MongoDB Atlas:**
```
mongodb+srv://username:password@cluster.xxxxx.mongodb.net/restaurant-pos?retryWrites=true&w=majority
```

### Database Structure

The application uses the following collections:
- `configs` - Application configuration settings
- `products` - Food/drink items
- `typeproducts` - Product categories
- `orders` - Customer orders

### Resetting the Database

**Drop all collections:**
```bash
mongosh
use restaurant-pos
db.dropDatabase()
exit
```

Then re-run:
```bash
npm run init-config
cd server
node seed.js
```

### Backup and Restore

**Backup database:**
```bash
backup-db.bat
```

**Restore database:**
```bash
restore-db.bat
```

---

## Troubleshooting

### Issue: "MongoDB connection failed"

**Solutions:**
1. **Check if MongoDB is running:**
   ```bash
   net start MongoDB
   ```

2. **Verify connection string in `server/config/db.js`**

3. **For MongoDB Atlas:**
   - Ensure IP is whitelisted
   - Check username/password are correct
   - Verify cluster is active

### Issue: "Port 5000 is already in use"

**Solutions:**
1. **Kill process using port 5000:**
   ```bash
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

2. **Change port in `.env`:**
   ```env
   PORT=5001
   ```

3. **Update client API URL:**
   ```bash
   npm run update-ip
   cd client
   npm run build
   ```

### Issue: "Cannot find module 'xyz'"

**Solution:**
```bash
npm install
cd client
npm install
cd ..
```

### Issue: "Client not loading data"

**Solutions:**
1. **Check API URL in `client/.env`:**
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

2. **Rebuild client:**
   ```bash
   cd client
   npm run build
   cd ..
   ```

3. **Clear browser cache or use incognito mode**

### Issue: "SSL certificate error in HTTPS mode"

**Solutions:**
1. **Accept certificate warning in browser** (for development)

2. **Regenerate certificates:**
   ```bash
   cd server
   del server.key
   del server.cert
   openssl req -x509 -newkey rsa:4096 -keyout server.key -out server.cert -days 365 -nodes
   cd ..
   ```

### Issue: "React app shows old data after update"

**Solutions:**
1. **Clear client build and rebuild:**
   ```bash
   cd client
   rmdir /s /q build
   npm run build
   cd ..
   ```

2. **Hard refresh browser:** `Ctrl + Shift + R` or `Ctrl + F5`

### Issue: "Images not displaying"

**Solutions:**
1. **Ensure `server/uploads/` directory exists:**
   ```bash
   mkdir server\uploads
   ```

2. **Check image URLs in database match file paths**

3. **Re-upload images through admin panel**

---

## Package Scripts Reference

### Root Package Scripts
```json
"start": "node server/server.js",
"server": "nodemon server/server.js",
"client": "cd client && npm start",
"dev": "concurrently \"npm run server\" \"npm run client\"",
"build-client": "cd client && npm run build",
"init-config": "node server/init-config.js",
"update-ip": "node update-ip.js",
"start-https": "npm run update-ip && node server/server-https.js",
"server-https": "nodemon server/server-https.js",
"dev-https": "concurrently \"npm run server-https\" \"npm run client\""
```

### Client Package Scripts
```json
"start": "react-scripts start",
"build": "react-scripts build",
"test": "react-scripts test",
"eject": "react-scripts eject"
```

---

## Next Steps

After successful setup:

1. **Access Admin Panel:** http://localhost:5000/admin
   - Add food items and categories
   - Configure restaurant settings

2. **Access Orders Panel:** http://localhost:5000/orders
   - View and manage customer orders

3. **Test on Mobile Devices:**
   - Get your computer's IP address: `ipconfig`
   - Access from mobile: http://YOUR_IP:5000

4. **Production Deployment:**
   - See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for deployment instructions

---

## Additional Resources

- **Configuration Features:** [CONFIGURATION_FEATURE.md](CONFIGURATION_FEATURE.md)
- **HTTPS Setup Guide:** [HTTPS_SETUP.md](HTTPS_SETUP.md)
- **Deployment Guide:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **GitHub Repository:** https://github.com/andrewquang512/POS

---

## Support

For issues and questions:
1. Check this setup guide
2. Review troubleshooting section
3. Check existing documentation files
4. Search for similar issues on GitHub

---

**Happy Coding! 🍔🍕**
