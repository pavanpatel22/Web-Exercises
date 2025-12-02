import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Plus, FileText, Clock, BarChart3 } from 'lucide-react';
import { createForm } from '../store/slices/formBuilderSlice';
import { selectAllForms, selectFormStats } from '../store/selectors';
import { Button } from './UI';
import './Dashboard.css';

export const Dashboard = () => {
  const dispatch = useDispatch();
  const forms = useSelector(selectAllForms);
  const stats = useSelector(selectFormStats);

  const handleCreateForm = () => {
    const formId = `form-${Date.now()}`;
    dispatch(createForm({
      id: formId,
      title: 'Untitled Form',
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title-section">
          <h1 className="dashboard-title">Form Builder</h1>
          <p className="dashboard-subtitle">
            Create and manage your forms with our drag-and-drop builder
          </p>
        </div>
        
        <Button onClick={handleCreateForm} className="create-form-btn">
          <Plus size={20} />
          Create New Form
        </Button>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FileText size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalElements}</div>
              <div className="stat-label">Total Elements</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <BarChart3 size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.requiredCount}</div>
              <div className="stat-label">Required Fields</div>
            </div>
          </div>
        </div>
      )}

      <div className="forms-section">
        <h2 className="section-title">Your Forms</h2>
        
        {forms.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} className="empty-icon" />
            <h3>No forms yet</h3>
            <p>Create your first form to get started</p>
            <Button onClick={handleCreateForm}>
              <Plus size={20} />
              Create Form
            </Button>
          </div>
        ) : (
          <div className="forms-grid">
            {forms.map((form) => (
              <Link
                key={form.id}
                to={`/form/${form.id}/edit`}
                className="form-card"
              >
                <div className="form-card-header">
                  <FileText size={20} className="form-card-icon" />
                  <h3 className="form-card-title">{form.title}</h3>
                </div>
                
                <div className="form-card-stats">
                  <span className="form-stat">
                    {form.elements?.length || 0} elements
                  </span>
                </div>
                
                <div className="form-card-footer">
                  <div className="form-actions">
                    <Link
                      to={`/form/${form.id}/edit`}
                      className="form-action-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/form/${form.id}/preview`}
                      className="form-action-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Preview
                    </Link>
                  </div>
                  
                  <div className="form-date">
                    <Clock size={14} />
                    {formatDate(form.updatedAt)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};