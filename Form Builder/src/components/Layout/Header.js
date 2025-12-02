import React, { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, Eye, Edit, Save, Loader, Check } from 'lucide-react';
import { Button } from '../UI';
import { useSaveForm } from '../../hooks/useSaveForm';
import './Header.css';

export const Header = ({ hasPendingUpdates, isFormRoute }) => {
  const location = useLocation();
  const { formId } = useParams();
  const { saveForm, isSaving, lastSaved } = useSaveForm();
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const isEditMode = location.pathname.includes('/edit');
  const isPreviewMode = location.pathname.includes('/preview');

  const handleSave = async () => {
    if (!formId) return;
    
    try {
      await saveForm(formId);
      setSaveSuccess(true);
      
      // Reset success indicator after 2 seconds
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to save form:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          {isFormRoute && (
            <Link to="/" className="back-button">
              <ArrowLeft size={20} />
              Dashboard
            </Link>
          )}
        </div>

        <div className="header-center">
          {isFormRoute && (
            <div className="header-status">
              <h1 className="header-title">
                {isPreviewMode ? 'Preview Mode' : 'Edit Mode'}
              </h1>
              {lastSaved && !isSaving && (
                <span className="last-saved">
                  Last saved: {new Date(lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="header-right">
          {isFormRoute && (
            <div className="header-actions">
              {isSaving && (
                <div className="saving-indicator">
                  <Loader size={16} className="spinner" />
                  <span>Saving...</span>
                </div>
              )}
              
              {saveSuccess && (
                <div className="save-success">
                  <Check size={16} />
                  <span>Saved!</span>
                </div>
              )}
              
              {isEditMode ? (
                <Link to={`/form/${formId}/preview`}>
                  <Button variant="outline">
                    <Eye size={16} />
                    Preview
                  </Button>
                </Link>
              ) : (
                <Link to={`/form/${formId}/edit`}>
                  <Button variant="outline">
                    <Edit size={16} />
                    Edit
                  </Button>
                </Link>
              )}
              
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className={saveSuccess ? 'save-success-btn' : ''}
              >
                {isSaving ? <Loader size={16} className="spinner" /> : <Save size={16} />}
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};