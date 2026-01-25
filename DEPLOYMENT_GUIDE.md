# Restaurant POS Deployment Guide

This guide will help you deploy the Restaurant POS application to a client computer for production use.

## Prerequisites

The client computer must have:
1. **Node.js** (version 14 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** (version 4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
3. **Git** (optional, for cloning) - [Download](https://git-scm.com/)

## Deployment Options

### Option 1: Simple Local Deployment (Recommended for Single Computer)

This option runs the app on one computer that acts as both server and client.

#### Step 1: Install MongoDB
1. Download and install MongoDB Community Server
2. During installation, select "Run service as Network Service user"
3. Keep default port 27017
4. MongoDB Compass (GUI) will be installed automatically

#### Step 2: Copy Application Files
1. Copy the entire POS folder to the client computer
   - Recommended location: `C:\POS` or `C:\Program Files\RestaurantPOS`
2. Or clone from git: `git clone <your-repository-url>`

#### Step 3: Install Dependencies
Open Command Prompt or PowerShell as Administrator and run:

```bash
cd C:\POS
npm install

cd client
npm install
cd ..
```

#### Step 4: Initialize Configuration
```bash
npm run init-config
```

This creates default configurations in the database (10 tables, etc.)

#### Step 5: Build the React Frontend
```bash
npm run build-client
```

This creates an optimized production build in `client/build` folder.

#### Step 6: Start the Application
```bash
npm start
```

The app will be available at:
- Main interface: `http://localhost:5000`
- Admin panel: `http://localhost:5000/admin`

#### Step 7: Create Desktop Shortcut (Optional)
Create a batch file `start-pos.bat`:

```batch
@echo off
cd C:\POS
start "" "http://localhost:5000"
npm start
```

Right-click → Send to → Desktop (create shortcut)

---

### Option 2: Network Deployment (Server + Multiple Clients)

This option allows multiple devices (tablets, phones, computers) to access the POS from one central server.

#### On the Server Computer:

**Step 1-5:** Same as Option 1 above

**Step 6:** Configure Network Access

Edit `server/server.js` (already configured to listen on 0.0.0.0)

**Step 7:** Configure Windows Firewall
Open PowerShell as Administrator:

```powershell
New-NetFirewallRule -DisplayName "Restaurant POS" -Direction Inbound -Protocol TCP -LocalPort 5000 -Action Allow
```

**Step 8:** Find Server IP Address
```bash
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

**Step 9:** Start the Server
```bash
npm start
```

#### On Client Devices:

**For Browsers (Tablets/Phones/Computers):**
Simply open a web browser and navigate to:
- Main app: `http://[SERVER-IP]:5000`
- Admin: `http://[SERVER-IP]:5000/admin`

Example: `http://192.168.1.100:5000`

**Create Bookmarks:**
- On tablets/phones: "Add to Home Screen" for app-like experience
- On computers: Bookmark the URLs

---

### Option 3: Production Deployment with Process Manager

For a more robust production setup that automatically restarts on crashes.

#### Install PM2 (Process Manager)
```bash
npm install -g pm2
```

#### Create PM2 Configuration
Create `ecosystem.config.js` in the root folder:

```javascript
module.exports = {
  apps: [{
    name: 'restaurant-pos',
    script: 'server/server.js',
    cwd: __dirname,
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};
```

#### Start with PM2
```bash
cd C:\POS
npm run build-client
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### PM2 Commands
- Check status: `pm2 status`
- View logs: `pm2 logs`
- Restart: `pm2 restart restaurant-pos`
- Stop: `pm2 stop restaurant-pos`

---

## Windows Service Setup (Auto-start on Boot)

### Using NSSM (Non-Sucking Service Manager)

#### Step 1: Install NSSM
1. Download from [nssm.cc](https://nssm.cc/download)
2. Extract to `C:\nssm`

#### Step 2: Create Windows Service
Open Command Prompt as Administrator:

```bash
C:\nssm\nssm.exe install RestaurantPOS "C:\Program Files\nodejs\node.exe" "C:\POS\server\server.js"
C:\nssm\nssm.exe set RestaurantPOS AppDirectory "C:\POS"
C:\nssm\nssm.exe set RestaurantPOS DisplayName "Restaurant POS System"
C:\nssm\nssm.exe set RestaurantPOS Description "Restaurant Point of Sale System"
C:\nssm\nssm.exe set RestaurantPOS Start SERVICE_AUTO_START
```

#### Step 3: Start Service
```bash
net start RestaurantPOS
```

The app will now automatically start when Windows boots.

#### Service Management
- Start: `net start RestaurantPOS`
- Stop: `net stop RestaurantPOS`
- Remove: `C:\nssm\nssm.exe remove RestaurantPOS confirm`

---

## Database Backup & Restore

### Backup Database
```bash
mongodump --db restaurant-pos --out C:\Backups\pos-backup
```

### Restore Database
```bash
mongorestore --db restaurant-pos C:\Backups\pos-backup\restaurant-pos
```

### Automated Daily Backup (Windows Task Scheduler)
Create `backup-db.bat`:

```batch
@echo off
set BACKUP_DIR=C:\Backups\POS\%date:~-4,4%-%date:~-10,2%-%date:~-7,2%
mongodump --db restaurant-pos --out "%BACKUP_DIR%"
```

Create a Scheduled Task:
1. Open Task Scheduler
2. Create Basic Task → Name: "POS Database Backup"
3. Trigger: Daily at 2:00 AM
4. Action: Start Program → `C:\POS\backup-db.bat`

---

## Configuration

### Change Number of Tables
1. Open browser: `http://localhost:5000/admin`
2. Go to Configuration tab
3. Update "Number of Tables"
4. Click "Save Configuration"

### Change Database Connection
1. Admin → Configuration → Database Configuration
2. Update connection string
3. Restart server

---

## Troubleshooting

### Port 5000 Already in Use
Change port in `server/server.js`:
```javascript
const PORT = process.env.PORT || 5001; // Change to 5001
```

### MongoDB Connection Failed
1. Check if MongoDB service is running:
   - Windows Services → MongoDB Server
2. Verify connection string in Configuration

### Cannot Access from Other Devices
1. Check firewall settings
2. Ensure devices are on same network
3. Verify server IP address hasn't changed

### Build Errors
If `npm run build-client` fails:
```bash
cd client
set NODE_OPTIONS=--openssl-legacy-provider
npm run build
```

---

## Security Recommendations

### For Production Use:

1. **Change Default Port**
   ```javascript
   const PORT = process.env.PORT || 8080;
   ```

2. **Add Authentication** (for admin panel)
   - Consider adding login system
   - Use environment variables for secrets

3. **Use HTTPS** (for network deployment)
   - Install SSL certificate
   - Configure Express to use HTTPS

4. **Restrict Database Access**
   - Configure MongoDB to require authentication
   - Create specific database user for the app

5. **Regular Backups**
   - Set up automated daily backups
   - Store backups on external drive or cloud

---

## Performance Tips

1. **Keep MongoDB running as a service**
2. **Regular database maintenance:**
   ```bash
   mongo restaurant-pos --eval "db.runCommand({ compact: 'orders' })"
   ```
3. **Clear old orders periodically** (through Admin panel or database)
4. **Monitor disk space** for logs and uploads folder

---

## Quick Start Checklist

- [ ] Install Node.js
- [ ] Install MongoDB
- [ ] Copy application files
- [ ] Run `npm install` in root and client folders
- [ ] Run `npm run init-config`
- [ ] Run `npm run build-client`
- [ ] Configure firewall (for network deployment)
- [ ] Start application: `npm start`
- [ ] Test: Open `http://localhost:5000`
- [ ] Configure tables in Admin panel
- [ ] Set up Windows Service (optional)
- [ ] Set up automated backups (optional)

---

## Support

For issues or questions:
1. Check logs in server console
2. Check MongoDB logs
3. Review error messages in browser console (F12)

---

## Updates & Maintenance

### To Update the Application:
1. Stop the service/application
2. Backup database
3. Pull latest code or copy new files
4. Run `npm install` (if dependencies changed)
5. Run `npm run build-client`
6. Restart application
7. Test functionality

---

**Note:** For the simplest deployment, use **Option 1** on a single computer. For restaurants needing multiple access points (kitchen display, multiple cashiers, mobile ordering), use **Option 2** with network deployment.
