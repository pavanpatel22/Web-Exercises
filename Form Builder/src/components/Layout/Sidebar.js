import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Square, 
  Type, 
  List, 
  ToggleLeft,
  Calendar,
} from 'lucide-react';
import { selectAllForms } from '../../store/selectors';
import './Sidebar.css';

const formElements = [
  { type: 'text', label: 'Text Input', icon: Type },
  { type: 'textarea', label: 'Text Area', icon: Square },
  { type: 'select', label: 'Dropdown', icon: List },
  { type: 'radio', label: 'Radio Group', icon: ToggleLeft },
  { type: 'date', label: 'Date Picker', icon: Calendar },
];

export const Sidebar = ({ onAddElement, isOpen }) => {
  const forms = useSelector(selectAllForms);
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-title">Navigation</h3>
        <nav className="sidebar-nav">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `sidebar-nav-item ${isActive ? 'sidebar-nav-item-active' : ''}`
            }
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">Your Forms</h3>
        <div className="forms-list">
          {forms.map((form) => (
            <NavLink
              key={form.id}
              to={`/form/${form.id}/edit`}
              className={({ isActive }) =>
                `forms-list-item ${isActive ? 'forms-list-item-active' : ''}`
              }
            >
              <div className="form-item-content">
                <span className="form-title">{form.title}</span>
                <span className="form-meta">
                  {form.elements?.length || 0} elements
                </span>
              </div>
            </NavLink>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">Form Elements</h3>
        <div className="elements-grid">
          {formElements.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              className="element-card"
              onClick={() => onAddElement(type)}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};