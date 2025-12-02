import React, { memo } from 'react';
import { Switch, TextInput, Button } from '../UI';
import { Plus, Minus } from 'lucide-react';
import './ElementEditor.css';

export const ElementEditor = memo(({ element, onUpdate }) => {
  const handleAddOption = () => {
    const currentOptions = element.options || [];
    onUpdate('options', [...currentOptions, `Option ${currentOptions.length + 1}`]);
  };

  const handleRemoveOption = (index) => {
    const newOptions = element.options.filter((_, i) => i !== index);
    onUpdate('options', newOptions);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...element.options];
    newOptions[index] = value;
    onUpdate('options', newOptions);
  };

  const hasOptions = element.type === 'select' || element.type === 'radio';

  return (
    <div className="element-editor">
      <h4 className="editor-title">Element Settings</h4>
      
      <div className="editor-fields">
        <TextInput
          label="Label"
          value={element.label}
          onChange={(value) => onUpdate('label', value)}
          placeholder="Enter field label"
        />
        
        <TextInput
          label="Placeholder"
          value={element.placeholder || ''}
          onChange={(value) => onUpdate('placeholder', value)}
          placeholder="Enter placeholder text"
        />
        
        <div className="editor-field">
          <label className="editor-label">
            <Switch
              checked={element.required}
              onChange={(checked) => onUpdate('required', checked)}
            />
            <span>Required Field</span>
          </label>
        </div>

        {hasOptions && (
          <div className="editor-field">
            <label className="editor-label">Options</label>
            <div className="options-list">
              {element.options?.map((option, index) => (
                <div key={index} className="option-item">
                  <TextInput
                    value={option}
                    onChange={(value) => handleOptionChange(index, value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveOption(index)}
                    disabled={element.options.length <= 1}
                  >
                    <Minus size={16} />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddOption}
              className="add-option-btn"
            >
              <Plus size={16} />
              Add Option
            </Button>
          </div>
        )}
      </div>
    </div>
  );
});

ElementEditor.displayName = 'ElementEditor';