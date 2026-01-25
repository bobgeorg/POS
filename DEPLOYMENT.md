# Quick Deployment Instructions

## For Client Computer Deployment

### Prerequisites
1. **Install Node.js**: https://nodejs.org/ (Download LTS version)
2. **Install MongoDB**: https://www.mongodb.com/try/download/community

### Automated Setup (Easiest)

1. **Copy** the entire POS folder to client computer
2. **Double-click** `setup.bat`
3. **Wait** for installation to complete
4. **Run** `start-pos.bat` to start the application
5. **Open browser** to http://localhost:5000

### Manual Setup

```bash
# 1. Install dependencies
npm install
cd client
npm install
cd ..

# 2. Initialize database config
npm run init-config

# 3. Build frontend
npm run build-client

# 4. Start application
npm start
```

### For Network Deployment (Multiple Devices)

1. Complete setup on server computer
2. Open Windows Firewall:
   ```powershell
   New-NetFirewallRule -DisplayName "POS" -Direction Inbound -Protocol TCP -LocalPort 5000 -Action Allow
   ```
3. Find server IP: `ipconfig` (look for IPv4 Address)
4. On other devices, open: `http://[SERVER-IP]:5000`

### Files Included

- `setup.bat` - Automated installation
- `start-pos.bat` - Start the application
- `backup-db.bat` - Backup database
- `restore-db.bat` - Restore database
- `ecosystem.config.js` - PM2 configuration (optional)
- `DEPLOYMENT_GUIDE.md` - Complete deployment guide

### Default Configuration

- **Port**: 5000
- **Tables**: 10 (configurable in Admin → Configuration)
- **Database**: mongodb://localhost:27017/restaurant-pos

### Admin Panel

Access at: http://localhost:5000/admin

Features:
- Product Management
- Order Management  
- System Configuration (Tables, Database)

### Troubleshooting

**Can't connect to database:**
- Make sure MongoDB service is running
- Check Windows Services → MongoDB Server

**Port already in use:**
- Close other applications using port 5000
- Or change port in `server/server.js`

**Build errors:**
- Run as Administrator
- Check internet connection (npm downloads packages)

### Support

See `DEPLOYMENT_GUIDE.md` for complete documentation including:
- Windows Service setup
- Process manager (PM2)
- Automated backups
- Security recommendations
- Performance tips

### Quick Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start application |
| `npm run init-config` | Initialize configuration |
| `npm run build-client` | Build frontend |
| `start-pos.bat` | Quick start |
| `backup-db.bat` | Backup database |

---

**For detailed instructions, see DEPLOYMENT_GUIDE.md**
