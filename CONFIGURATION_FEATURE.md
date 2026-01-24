# Configuration Management Feature

## Overview
The Configuration Management feature allows administrators to dynamically configure system settings through the Admin panel without modifying code.

## Features

### 1. Table Configuration
- Set the number of tables available in the restaurant
- Tables are dynamically generated in dropdown menus across the application
- Preview of all available tables in the configuration page

### 2. Database Configuration
- View and update the MongoDB connection string
- Note: Changing the database connection requires a server restart

## How to Use

### Accessing Configuration
1. Navigate to the Admin panel
2. Click on the "Configuration" tab
3. The configuration page will display all available settings

### Updating Settings
1. Modify the desired configuration values
2. Click "Save Configuration"
3. A success message will appear confirming the changes
4. For database changes, restart the server

### Initial Setup
Run the initialization script to set up default configurations:
```bash
npm run init-config
```

## API Endpoints

### Get All Configurations
```
GET /api/config
```
Returns all configuration key-value pairs as an object.

### Get Specific Configuration
```
GET /api/config/:key
```
Returns a specific configuration by key.

### Update Configuration
```
PUT /api/config/:key
```
Body:
```json
{
  "value": "new_value",
  "description": "Configuration description"
}
```

### Delete Configuration
```
DELETE /api/config/:key
```

## Using Configuration in Components

Import the `useConfig` hook:
```javascript
import { useConfig } from '../../hooks/useConfig';

const MyComponent = () => {
  const { config, getTableOptions, loading } = useConfig();
  
  // Get table options
  const tables = getTableOptions();
  
  // Use configuration
  console.log('Number of tables:', config.numberOfTables);
};
```

## Files Created/Modified

### Backend
- `server/model/Config.js` - Configuration model
- `server/controllers/configController.js` - Configuration controller
- `server/routers/configRouter.js` - Configuration routes
- `server/init-config.js` - Initialization script
- `server/server.js` - Added config routes

### Frontend
- `client/src/Admin/Configuration/Configuration.jsx` - Configuration UI component
- `client/src/Admin/Configuration/Configuration.css` - Configuration styles
- `client/src/hooks/useConfig.js` - Custom hook for configuration
- `client/src/Admin/index.jsx` - Added Configuration tab
- `client/src/components/Payment/Payment.js` - Updated to use dynamic tables

## Configuration Keys

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `numberOfTables` | Number | 10 | Number of tables in the restaurant |
| `dbConnectionString` | String | mongodb://localhost:27017/restaurant-pos | MongoDB connection string |

## Notes

- All configuration changes are stored in the MongoDB database
- The table configuration updates are reflected immediately in the UI
- Database connection string changes require a server restart
- Default configurations are automatically created on first run of init-config
