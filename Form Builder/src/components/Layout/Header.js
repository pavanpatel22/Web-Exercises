import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, Eye, Edit, Save, Loader } from 'lucide-react';
import { Button } from '../UI';
import './Header.css';

export const Header = ({ hasPendingUpdates, isFormRoute }) => {
  const location = useLocation();
  const { formId } = useParams();
  
  const isEditMode = location.pathname.includes('/edit');
  const isPreviewMode = location.pathname.includes('/preview');

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
            <h1 className="header-title">
              {isPreviewMode ? 'Preview Mode' : 'Edit Mode'}
            </h1>
          )}
        </div>

        <div className="header-right">
          {isFormRoute && (
            <div className="header-actions">
              {hasPendingUpdates && (
                <div className="saving-indicator">
                  <Loader size={16} className="spinner" />
                  <span>Saving...</span>
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
              
              <Button>
                <Save size={16} />
                Save
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};