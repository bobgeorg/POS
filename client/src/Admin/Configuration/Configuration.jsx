import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-grid-system';
import { FiSettings, FiSave, FiRefreshCw } from 'react-icons/fi';
import { AiOutlineDatabase, AiOutlineTable } from 'react-icons/ai';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import './Configuration.css';

export default function Configuration() {
    const [config, setConfig] = useState({
        numberOfTables: 10,
        dbConnectionString: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // Fetch current configuration
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
        } catch (error) {
            console.error('Error fetching configuration:', error);
            showMessage('Error loading configuration', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (key, value) => {
        setConfig(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            
            // Save number of tables
            await axios.put(`${API_BASE_URL}/api/config/numberOfTables`, {
                value: parseInt(config.numberOfTables),
                description: 'Number of tables available in the restaurant',
            });

            // Save database connection string
            await axios.put(`${API_BASE_URL}/api/config/dbConnectionString`, {
                value: config.dbConnectionString,
                description: 'MongoDB connection string',
            });

            showMessage('Configuration saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving configuration:', error);
            showMessage('Error saving configuration', 'error');
        } finally {
            setSaving(false);
        }
    };

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => {
            setMessage({ text: '', type: '' });
        }, 3000);
    };

    const generateTableOptions = () => {
        return Array.from({ length: config.numberOfTables }, (_, i) => i + 1);
    };

    if (loading) {
        return (
            <div className="config-loading">
                <FiRefreshCw size={40} className="spinner" />
                <p>Loading configuration...</p>
            </div>
        );
    }

    return (
        <div className="configuration-container">
            <div className="panel-content">
                <Container className="grid" fluid>
                    <Row>
                        <Col lg={12}>
                            <h2><FiSettings className="iconManager"/> System Configuration</h2>
                        </Col>
                    </Row>
                </Container>
            </div>

            {message.text && (
                <div className={`config-message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="config-content">
                <div className="config-section">
                    <div className="config-card">
                        <div className="config-card-header">
                            <AiOutlineTable size={24} />
                            <h3>Table Configuration</h3>
                        </div>
                        <div className="config-card-body">
                            <div className="form-group">
                                <label htmlFor="numberOfTables">
                                    Number of Tables
                                    <span className="label-description">
                                        Set how many tables are available in your restaurant
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    id="numberOfTables"
                                    className="config-input"
                                    value={config.numberOfTables}
                                    onChange={(e) => handleInputChange('numberOfTables', e.target.value)}
                                    min="1"
                                    max="100"
                                />
                            </div>

                            <div className="table-preview">
                                <h4>Table Preview</h4>
                                <p className="preview-description">
                                    These tables will be available in the dropdown across the app:
                                </p>
                                <div className="table-chips">
                                    {generateTableOptions().map(tableNum => (
                                        <span key={tableNum} className="table-chip">
                                            Table {tableNum}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="config-card">
                        <div className="config-card-header">
                            <AiOutlineDatabase size={24} />
                            <h3>Database Configuration</h3>
                        </div>
                        <div className="config-card-body">
                            <div className="form-group">
                                <label htmlFor="dbConnectionString">
                                    MongoDB Connection String
                                    <span className="label-description">
                                        Update your database connection string (requires server restart)
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    id="dbConnectionString"
                                    className="config-input"
                                    value={config.dbConnectionString}
                                    onChange={(e) => handleInputChange('dbConnectionString', e.target.value)}
                                    placeholder="mongodb://localhost:27017/restaurant-pos"
                                />
                                <div className="config-warning">
                                    <strong>⚠️ Warning:</strong> Changing the database connection string requires 
                                    restarting the server to take effect. Make sure the connection string is correct 
                                    before saving.
                                </div>
                            </div>

                            <div className="db-info">
                                <h4>Current Connection</h4>
                                <p className="db-status">
                                    {config.dbConnectionString || 'Using default connection from server config'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="config-actions">
                    <button 
                        className="btn-config-save"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        <FiSave size={18} />
                        {saving ? 'Saving...' : 'Save Configuration'}
                    </button>
                    <button 
                        className="btn-config-reset"
                        onClick={fetchConfig}
                        disabled={saving}
                    >
                        <FiRefreshCw size={18} />
                        Reset Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
