# HTTPS Setup Guide for Local Development

This guide explains how to enable HTTPS for local development of the POS system.

## Quick Start

### 1. Generate SSL Certificates (If Not Already Present)

You already have `server.cert` and `server.key` files in the `server/` directory. If you need to regenerate them, use one of these methods:

#### Method A: Using OpenSSL (Recommended)

```powershell
# Navigate to the server directory
cd server

# Generate self-signed certificate (valid for 365 days)
openssl req -nodes -new -x509 -keyout server.key -out server.cert -days 365
```

When prompted, you can press Enter to skip all fields or fill them as follows:
- Country Name: US
- State: Your State
- City: Your City
- Organization: POS Development
- Common Name: localhost (or your local IP address)

#### Method B: Using PowerShell (Windows)

```powershell
# Navigate to the server directory
cd server

# Create a self-signed certificate
$cert = New-SelfSignedCertificate -DnsName "localhost", "127.0.0.1" -CertStoreLocation "cert:\LocalMachine\My" -NotAfter (Get-Date).AddYears(1)

# Export the certificate
$pwd = ConvertTo-SecureString -String "password" -Force -AsPlainText
Export-PfxCertificate -Cert $cert -FilePath "server.pfx" -Password $pwd
```

Then convert to PEM format or use Node.js to read the PFX file.

#### Method C: Using mkcert (Easiest - Trusted by Browser)

```powershell
# Install mkcert using Chocolatey
choco install mkcert

# Or download from: https://github.com/FiloSottile/mkcert/releases

# Install local CA
mkcert -install

# Generate certificates
cd server
mkcert localhost 127.0.0.1 ::1 YOUR_LOCAL_IP

# Rename files
Rename-Item "localhost+3.pem" "server.cert"
Rename-Item "localhost+3-key.pem" "server.key"
```

### 2. Enable HTTPS in Your Application

#### Option A: Use Environment Variable (Recommended)

Create or update a `.env` file in the **root** directory:

```env
USE_HTTPS=true
HTTPS_PORT=5443
PORT=5000
```

**IMPORTANT**: After creating/updating the `.env` file, you MUST run the update-ip script to update the client configuration:

```bash
npm run update-ip
```

This will automatically update `client/.env` with the correct HTTPS URL. Then run your server:

```bash
npm run server
# or
npm start
```

#### Option B: Use Dedicated HTTPS Server File

```bash
# Navigate to server directory
cd server

# Run the HTTPS-only server
node server-https.js
```

### 3. Update Client Configuration

Update `client/.env` (create if it doesn't exist):

```env
# For HTTPS
REACT_APP_API_URL=https://localhost:5443

# Or for network access from mobile devices
# REACT_APP_API_URL=https://YOUR_LOCAL_IP:5443
```

Replace `YOUR_LOCAL_IP` with your actual network IP (shown in the server console when it starts).

### 4. Access Your Application

- **Local access**: https://localhost:5443
- **Network access**: https://YOUR_LOCAL_IP:5443

**Important**: When using self-signed certificates, you'll see a security warning in your browser. This is normal for local development.

#### Accepting the Certificate in Your Browser

**Chrome/Edge:**
1. Click "Advanced"
2. Click "Proceed to localhost (unsafe)"

**Firefox:**
1. Click "Advanced"
2. Click "Accept the Risk and Continue"

**Mobile Devices:**
1. Navigate to `https://YOUR_LOCAL_IP:5443` in your mobile browser
2. Accept the security warning
3. The certificate will be trusted for future visits

## Switching Between HTTP and HTTPS

### Use HTTP (Default)
Remove or set to false in `.env`:
```env
USE_HTTPS=false
```

### Use HTTPS
Set in `.env`:
```env
USE_HTTPS=true
```

## Package.json Scripts

Add these scripts to your `package.json` for convenience:

```json
{
  "scripts": {
    "start-https": "set USE_HTTPS=true && npm start",
    "server-https": "set USE_HTTPS=true && npm run server",
    "dev-https": "set USE_HTTPS=true && npm run dev"
  }
}
```

Usage:
```bash
npm run start-https
# or
npm run server-https
# or
npm run dev-https
```

## Troubleshooting

### Client Not Loading Data from Database (Mixed Content Issue)

**Problem**: When accessing the app through HTTPS, the client cannot load data from the database.

**Cause**: This happens when the client tries to make HTTP requests from an HTTPS page, or vice versa. The protocols must match.

**Solution**:
1. Ensure the root `.env` file has `USE_HTTPS=true`
2. Run `npm run update-ip` to update the client configuration
3. Verify `client/.env` has the correct HTTPS URL (e.g., `https://192.168.1.6:5443`)
4. Restart your server with `npm run server-https`
5. Clear your browser cache or do a hard refresh (Ctrl+Shift+R)

**Quick Fix**:
```powershell
# In the project root directory
npm run update-ip
npm run server-https
```

### Certificate Not Trusted Error

If you're getting certificate errors:

1. **Use mkcert** (easiest solution - creates trusted certificates)
2. **Manually trust the certificate**:
   - Windows: Import `server.cert` to "Trusted Root Certification Authorities"
   - Mac: Add certificate to Keychain and set to "Always Trust"
   - Linux: Copy to `/usr/local/share/ca-certificates/` and run `sudo update-ca-certificates`

### Port Already in Use

If port 5443 is already in use, change it in `.env`:
```env
HTTPS_PORT=5444
```

### Module Not Found Error

Make sure all dependencies are installed:
```bash
npm install
cd client && npm install
```

### ERR_SSL_PROTOCOL_ERROR

This usually means:
1. The server isn't actually running with HTTPS
2. You're trying to access HTTP URL when server is HTTPS
3. Certificate files are missing or corrupted

Check the server console output to confirm HTTPS is enabled.

### Mobile Device Can't Connect

1. Ensure your mobile device is on the same network
2. Check firewall settings aren't blocking the port
3. Use your computer's network IP address (not localhost)
4. Accept the certificate warning on the mobile device

## Production Deployment

**Important**: These self-signed certificates are for development only!

For production:
- Use a proper SSL certificate from a Certificate Authority (Let's Encrypt, etc.)
- Consider using a reverse proxy like Nginx
- Use services like Heroku, Vercel, or AWS which provide SSL automatically

## Security Notes

- Self-signed certificates provide encryption but not identity verification
- Don't commit your certificate files to version control (add to `.gitignore`)
- Regenerate certificates periodically
- Use environment variables for sensitive configuration

## Additional Resources

- [OpenSSL Documentation](https://www.openssl.org/docs/)
- [mkcert GitHub](https://github.com/FiloSottile/mkcert)
- [Node.js HTTPS Documentation](https://nodejs.org/api/https.html)
- [Let's Encrypt](https://letsencrypt.org/) - Free SSL certificates for production
