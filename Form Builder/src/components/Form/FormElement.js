import React, { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Settings } from 'lucide-react';
import { useUIState } from '../../contexts/UIStateContext';
import { useFormActions } from '../../contexts/FormActionsContext';
import { ElementEditor } from './ElementEditor';
import './FormElement.css';

const FormElementComponent = memo(({ element, onDelete, index }) => {
  const { selectedElementId, setSelectedElementId } = useUIState();
  const { updateElement } = useFormActions();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isSelected = selectedElementId === element.id;

  const handleInputChange = (field, value) => {
    updateElement(element.id, { [field]: value });
  };

  const renderElementPreview = () => {
    const commonProps = {
      placeholder: element.placeholder,
      required: element.required,
      className: 'element-preview-input',
    };

    switch (element.type) {
      case 'text':
        return <input type="text" {...commonProps} />;
      
      case 'textarea':
        return <textarea rows={3} {...commonProps} />;
      
      case 'select':
        return (
          <select {...commonProps}>
            {element.options?.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      case 'radio':
        return (
          <div className="radio-options">
            {element.options?.map((option, idx) => (
              <label key={idx} className="radio-option">
                <input type="radio" name={element.id} value={option} />
                {option}
              </label>
            ))}
          </div>
        );
      
      case 'date':
        return <input type="date" {...commonProps} />;
      
      default:
        return <input type="text" {...commonProps} />;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`form-element ${isSelected ? 'form-element-selected' : ''} ${
        isDragging ? 'form-element-dragging' : ''
      }`}
    >
      <div className="element-header">
        <div className="element-drag-handle" {...attributes} {...listeners}>
          <GripVertical size={16} />
        </div>
        
        <span className="element-type-badge">
          {element.type}
        </span>
        
        <div className="element-actions">
          <button
            className="element-action-btn"
            onClick={() => setSelectedElementId(
              isSelected ? null : element.id
            )}
          >
            <Settings size={16} />
          </button>
          
          <button
            className="element-action-btn element-action-delete"
            onClick={onDelete}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="element-content">
        <label className="element-label">
          {element.label}
          {element.required && <span className="required-asterisk">*</span>}
        </label>
        
        {renderElementPreview()}
      </div>

      {isSelected && (
        <ElementEditor
          element={element}
          onUpdate={handleInputChange}
        />
      )}
    </div>
  );
});

FormElementComponent.displayName = 'FormElement';

export const FormElement = FormElementComponent;