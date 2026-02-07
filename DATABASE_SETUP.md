# Database Setup - Quick Reference

This is a quick reference for setting up MongoDB for the Restaurant POS application.

## Option 1: Local MongoDB (Recommended for Development)

### Windows Installation

1. **Download MongoDB Community Server:**
   - Visit: https://www.mongodb.com/try/download/community
   - Select: Windows, MSI Package
   - Download and run installer

2. **Installation Options:**
   - Choose "Complete" installation
   - Install as Windows Service (recommended)
   - Default port: 27017

3. **Verify Installation:**
   ```cmd
   mongosh
   ```
   
   Should connect to: `mongodb://localhost:27017`

4. **Configure POS Application:**
   
   No configuration needed! The default connection string works:
   ```
   mongodb://localhost:27017/restaurant-pos
   ```

### MongoDB Service Management (Windows)

**Start MongoDB:**
```cmd
net start MongoDB
```

**Stop MongoDB:**
```cmd
net stop MongoDB
```

**Check Status:**
```cmd
sc query MongoDB
```

---

## Option 2: MongoDB Atlas (Cloud - Free Tier Available)

### Setup Steps

1. **Create Account:**
   - Visit: https://www.mongodb.com/cloud/atlas
   - Sign up for free account

2. **Create Cluster:**
   - Click "Build a Database"
   - Choose "Free" tier (M0)
   - Select cloud provider and region (closest to you)
   - Name your cluster (default: Cluster0)
   - Click "Create"

3. **Create Database User:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `posadmin` (or your choice)
   - Password: Generate secure password
   - User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP Address:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Option A: Click "Allow Access from Anywhere" (0.0.0.0/0) - easier but less secure
   - Option B: Add your current IP address - more secure
   - Click "Confirm"

5. **Get Connection String:**
   - Go to "Database" → "Clusters"
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Driver: Node.js, Version: 4.1 or later
   - Copy the connection string:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```

6. **Configure POS Application:**
   
   Edit `.env` file in root directory:
   ```env
   MONGO_URI=mongodb+srv://posadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/restaurant-pos?retryWrites=true&w=majority
   ```
   
   Replace:
   - `posadmin` - your database username
   - `YOUR_PASSWORD` - your database password
   - `cluster0.xxxxx` - your cluster address
   - `restaurant-pos` - database name (added to connection string)

---

## Connection String Examples

### Local MongoDB (No Authentication)
```
mongodb://localhost:27017/restaurant-pos
```

### Local MongoDB (With Authentication)
```
mongodb://username:password@localhost:27017/restaurant-pos
```

### MongoDB Atlas (Cloud)
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/restaurant-pos?retryWrites=true&w=majority
```

### Custom Port
```
mongodb://localhost:27018/restaurant-pos
```

---

## Testing Your Connection

### Method 1: Using mongosh (MongoDB Shell)

**Local MongoDB:**
```bash
mongosh "mongodb://localhost:27017/restaurant-pos"
```

**MongoDB Atlas:**
```bash
mongosh "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/restaurant-pos"
```

### Method 2: Using Node.js Test Script

Create `test-db.js`:
```javascript
const mongoose = require('mongoose');

const MONGO_URI = 'YOUR_CONNECTION_STRING_HERE';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connection successful!');
  console.log('Database:', mongoose.connection.name);
  console.log('Host:', mongoose.connection.host);
  mongoose.connection.close();
})
.catch((err) => {
  console.error('❌ MongoDB connection failed:', err.message);
});
```

Run:
```bash
node test-db.js
```

### Method 3: Start POS Application

Simply start the app and check the console:
```bash
npm start
```

Look for:
```
MongoDB Connected: localhost
Database Name: restaurant-pos
```

---

## Database Structure

Once connected, the POS application will create these collections:

| Collection | Description |
|------------|-------------|
| `configs` | Application configuration settings |
| `products` | Food and drink items |
| `typeproducts` | Product categories/types |
| `orders` | Customer orders |

---

## Common Issues & Solutions

### Issue: "Connection refused to localhost:27017"

**Cause:** MongoDB service is not running

**Solution:**
```bash
# Windows
net start MongoDB

# Or check services.msc and start MongoDB Server
```

### Issue: "Authentication failed"

**Cause:** Wrong username or password in connection string

**Solution:**
1. Verify credentials in MongoDB Atlas dashboard
2. Regenerate password if needed
3. Update `.env` file with correct credentials
4. Ensure password is URL-encoded if it contains special characters

### Issue: "Network timeout" with MongoDB Atlas

**Cause:** IP address not whitelisted

**Solution:**
1. Go to MongoDB Atlas → Network Access
2. Add current IP address or use 0.0.0.0/0 (allow from anywhere)
3. Wait 2-3 minutes for changes to propagate

### Issue: "Database not found"

**Don't worry!** MongoDB creates the database automatically when you first insert data.

Just run:
```bash
npm run init-config
```

This will create the database and initialize configuration.

---

## Switching Between Databases

### From Local to Atlas

1. **Backup local data** (optional):
   ```bash
   backup-db.bat
   ```

2. **Update `.env`:**
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/restaurant-pos
   ```

3. **Restart application:**
   ```bash
   npm start
   ```

4. **Initialize new database:**
   ```bash
   npm run init-config
   cd server
   node seed.js
   ```

### From Atlas to Local

1. **Update `.env`:**
   ```env
   MONGO_URI=mongodb://localhost:27017/restaurant-pos
   ```

2. **Ensure MongoDB is running:**
   ```bash
   net start MongoDB
   ```

3. **Restart application:**
   ```bash
   npm start
   ```

---

## Database Management Tools

### GUI Tools (Recommended)

1. **MongoDB Compass** (Official, Free)
   - Download: https://www.mongodb.com/products/compass
   - Best for beginners
   - Great visualization

2. **Studio 3T** (Feature-rich)
   - Download: https://studio3t.com/
   - Free trial, paid plans available
   - Advanced features

3. **Robo 3T** (Lightweight)
   - Download: https://robomongo.org/
   - Free and open-source
   - Simple interface

### Using MongoDB Compass

1. **Download and install** from https://www.mongodb.com/products/compass

2. **Connect:**
   - Paste your connection string
   - Click "Connect"

3. **View Database:**
   - Select "restaurant-pos" database
   - Explore collections
   - View/edit documents

---

## Security Best Practices

### For Local Development
- ✅ No authentication needed (localhost only)
- ✅ Use firewall to block external access

### For MongoDB Atlas
- ✅ Use strong passwords (20+ characters)
- ✅ Whitelist specific IP addresses
- ✅ Enable 2FA on MongoDB account
- ✅ Rotate passwords periodically
- ❌ Don't commit connection strings to Git
- ❌ Don't use "Allow Access from Anywhere" in production

### For Production
- ✅ Use environment variables for connection strings
- ✅ Enable MongoDB authentication
- ✅ Use SSL/TLS encryption
- ✅ Regular backups
- ✅ Monitor database access logs

---

## Environment Variables

Add to `.env` file:

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/restaurant-pos

# Optional: Database credentials (if using authentication)
DB_USER=username
DB_PASS=password
```

Then in `server/config/db.js`, use:
```javascript
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/restaurant-pos";
```

---

## Need Help?

1. **Check MongoDB is running:**
   ```bash
   net start MongoDB
   mongosh
   ```

2. **Check connection string** in `.env` file

3. **View application logs** when starting server

4. **Test connection** with mongosh:
   ```bash
   mongosh "YOUR_CONNECTION_STRING"
   ```

5. **Verify firewall** allows MongoDB port (27017)

---

## Next Steps

After successful database setup:

1. ✅ Run `npm run init-config` to create default configuration
2. ✅ Run `node server/seed.js` to add sample products (optional)
3. ✅ Start the application with `npm start`
4. ✅ Access admin panel to add your own products

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for complete application setup.

---

**Database Setup Complete! 🎉**
