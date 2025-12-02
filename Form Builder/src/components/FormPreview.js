import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectFormById } from '../store/selectors';
import './FormPreview.css';

export const FormPreview = () => {
  const { formId } = useParams();
  const form = useSelector(state => selectFormById(state, formId));

  if (!form) {
    return (
      <div className="form-preview">
        <div className="preview-empty">
          <h3>Form not found</h3>
        </div>
      </div>
    );
  }

  const renderFormElement = (element) => {
    const commonProps = {
      placeholder: element.placeholder,
      required: element.required,
      className: 'preview-field',
    };

    switch (element.type) {
      case 'text':
        return <input type="text" {...commonProps} />;
      
      case 'textarea':
        return <textarea rows={4} {...commonProps} />;
      
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Select an option</option>
            {element.options?.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      case 'radio':
        return (
          <div className="preview-radio-group">
            {element.options?.map((option, idx) => (
              <label key={idx} className="preview-radio-option">
                <input 
                  type="radio" 
                  name={element.id} 
                  value={option} 
                  required={element.required}
                />
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
    <div className="form-preview">
      <div className="preview-container">
        <div className="preview-header">
          <h1 className="preview-title">{form.title}</h1>
          <p className="preview-description">
            This is a preview of your form. Fill it out to test the functionality.
          </p>
        </div>

        <form className="preview-form">
          {form.elements?.map((element) => (
            <div key={element.id} className="preview-field-group">
              <label className="preview-field-label">
                {element.label}
                {element.required && <span className="required-asterisk">*</span>}
              </label>
              {renderFormElement(element)}
            </div>
          ))}
          
          {form.elements?.length > 0 && (
            <div className="preview-actions">
              <button type="submit" className="preview-submit-btn">
                Submit Form
              </button>
            </div>
          )}
        </form>

        {!form.elements?.length && (
          <div className="preview-empty">
            <h3>No form elements</h3>
            <p>Add some elements to your form in edit mode</p>
          </div>
        )}
      </div>
    </div>
  );
};