import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

export const useConfig = () => {
  const [config, setConfig] = useState({
    numberOfTables: 10, // Default value
    dbConnectionString: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/config`);
      setConfig({
        numberOfTables: response.data.numberOfTables || 10,
        dbConnectionString: response.data.dbConnectionString || '',
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching configuration:', err);
      setError(err);
      // Keep default values on error
    } finally {
      setLoading(false);
    }
  };

  const getTableOptions = () => {
    return Array.from({ length: config.numberOfTables }, (_, i) => i + 1);
  };

  return {
    config,
    loading,
    error,
    getTableOptions,
    refetch: fetchConfig,
  };
};
