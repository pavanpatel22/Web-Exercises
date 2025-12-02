import React, { useState, useRef } from 'react';
import { Modal, Button } from './UI';
import { Download, Upload, Database, RefreshCw } from 'lucide-react';
import { formPersistence } from '../utils/formPersistence';

export const SettingsModal = ({ isOpen, onClose }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const fileInputRef = useRef(null);

  const handleExport = () => {
    formPersistence.exportForms();
    onClose();
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsImporting(true);
    setImportStatus(null);

    try {
      const result = await formPersistence.importForms(file);
      setImportStatus({
        type: 'success',
        message: `Successfully imported ${result.importedCount} forms`,
      });
      
      // Reload page to reflect imported forms
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      setImportStatus({
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all forms? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const stats = formPersistence.getSaveStats();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Settings & Data Management"
      size="lg"
    >
      <div className="settings-content">
        <div className="settings-section">
          <h3 className="settings-section-title">
            <Database size={20} />
            Storage Statistics
          </h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Total Forms</span>
              <span className="stat-value">{stats.totalForms}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Last Save</span>
              <span className="stat-value">
                {stats.lastSave > new Date(0) 
                  ? stats.lastSave.toLocaleTimeString()
                  : 'Never'}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Versions</span>
              <span className="stat-value">{stats.totalVersions}</span>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3 className="settings-section-title">
            <Download size={20} />
            Export Data
          </h3>
          <p className="settings-description">
            Export all your forms as a JSON file for backup or transfer.
          </p>
          <Button onClick={handleExport} variant="outline">
            <Download size={16} />
            Export All Forms
          </Button>
        </div>

        <div className="settings-section">
          <h3 className="settings-section-title">
            <Upload size={20} />
            Import Data
          </h3>
          <p className="settings-description">
            Import forms from a JSON backup file.
          </p>
          
          {importStatus && (
            <div className={`import-status ${importStatus.type}`}>
              {importStatus.message}
            </div>
          )}
          
          <div className="import-actions">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json"
              style={{ display: 'none' }}
              disabled={isImporting}
            />
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              disabled={isImporting}
            >
              {isImporting ? (
                <>
                  <RefreshCw size={16} className="spinner" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Choose File
                </>
              )}
            </Button>
            
            <div className="file-requirements">
              <small>File must be a valid JSON export from Form Builder</small>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3 className="settings-section-title">Danger Zone</h3>
          <p className="settings-description warning">
            These actions cannot be undone. Please proceed with caution.
          </p>
          <Button onClick={handleClearAll} variant="danger">
            Clear All Data
          </Button>
        </div>
      </div>

      <Modal.Footer>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};