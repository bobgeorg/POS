const mongoose = require('mongoose');
const Config = require('./model/Config');
const connectDB = require('./config/db');

const initializeDefaultConfigs = async () => {
  try {
    await connectDB();
    
    console.log('Initializing default configurations...');
    
    // Check if configurations already exist
    const existingConfigs = await Config.find({});
    
    if (existingConfigs.length === 0) {
      // Create default configurations
      await Config.create([
        {
          key: 'numberOfTables',
          value: 10,
          description: 'Number of tables available in the restaurant',
        },
        {
          key: 'dbConnectionString',
          value: 'mongodb://localhost:27017/restaurant-pos',
          description: 'MongoDB connection string',
        },
      ]);
      
      console.log('✅ Default configurations created successfully!');
    } else {
      console.log('ℹ️  Configurations already exist. Skipping initialization.');
      
      // Update missing configs if needed
      const configKeys = existingConfigs.map(c => c.key);
      
      if (!configKeys.includes('numberOfTables')) {
        await Config.create({
          key: 'numberOfTables',
          value: 10,
          description: 'Number of tables available in the restaurant',
        });
        console.log('✅ Added numberOfTables configuration');
      }
      
      if (!configKeys.includes('dbConnectionString')) {
        await Config.create({
          key: 'dbConnectionString',
          value: 'mongodb://localhost:27017/restaurant-pos',
          description: 'MongoDB connection string',
        });
        console.log('✅ Added dbConnectionString configuration');
      }
    }
    
    console.log('\n📋 Current configurations:');
    const allConfigs = await Config.find({});
    allConfigs.forEach(config => {
      console.log(`  ${config.key}: ${config.value}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing configurations:', error);
    process.exit(1);
  }
};

initializeDefaultConfigs();
