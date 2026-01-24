const Config = require("../model/Config");

// @desc    Get all configurations
// @route   GET /api/config
// @access  Public
const getConfigs = async (req, res) => {
  try {
    const configs = await Config.find({});
    
    // Convert to key-value object for easier frontend use
    const configObject = configs.reduce((acc, config) => {
      acc[config.key] = config.value;
      return acc;
    }, {});
    
    res.json(configObject);
  } catch (error) {
    console.error('Error fetching configs:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a specific configuration
// @route   GET /api/config/:key
// @access  Public
const getConfigByKey = async (req, res) => {
  try {
    const config = await Config.findOne({ key: req.params.key });
    
    if (!config) {
      return res.status(404).json({ message: "Configuration not found" });
    }
    
    res.json({ key: config.key, value: config.value });
  } catch (error) {
    console.error('Error fetching config:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update or create a configuration
// @route   PUT /api/config/:key
// @access  Admin
const updateConfig = async (req, res) => {
  try {
    const { value, description } = req.body;
    
    const config = await Config.findOneAndUpdate(
      { key: req.params.key },
      { 
        value, 
        description: description || "",
      },
      { 
        new: true, 
        upsert: true, // Create if doesn't exist
        runValidators: true,
      }
    );
    
    res.json({ 
      key: config.key, 
      value: config.value,
      message: "Configuration updated successfully" 
    });
  } catch (error) {
    console.error('Error updating config:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a configuration
// @route   DELETE /api/config/:key
// @access  Admin
const deleteConfig = async (req, res) => {
  try {
    const config = await Config.findOneAndDelete({ key: req.params.key });
    
    if (!config) {
      return res.status(404).json({ message: "Configuration not found" });
    }
    
    res.json({ message: "Configuration deleted successfully" });
  } catch (error) {
    console.error('Error deleting config:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getConfigs,
  getConfigByKey,
  updateConfig,
  deleteConfig,
};
