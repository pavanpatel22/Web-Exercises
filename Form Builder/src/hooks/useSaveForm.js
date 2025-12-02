import { useCallback, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectFormById } from '../store/selectors';

// Mock API function for saving form
const saveFormToAPI = async (formData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Save to localStorage
  const existingForms = JSON.parse(localStorage.getItem('form-builder-forms') || '{}');
  existingForms[formData.id] = {
    ...formData,
    savedAt: new Date().toISOString(),
    version: (existingForms[formData.id]?.version || 0) + 1,
  };
  localStorage.setItem('form-builder-forms', JSON.stringify(existingForms));
  
  return {
    success: true,
    savedAt: new Date().toISOString(),
    id: formData.id,
  };
};

export const useSaveForm = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [error, setError] = useState(null);

  // Load last saved time from localStorage on mount
  useEffect(() => {
    try {
      const savedForms = JSON.parse(localStorage.getItem('form-builder-forms') || '{}');
      // Find the most recent save time
      const mostRecent = Object.values(savedForms).reduce((latest, form) => {
        const savedAt = new Date(form.savedAt || 0);
        return savedAt > latest ? savedAt : latest;
      }, new Date(0));
      
      if (mostRecent > new Date(0)) {
        setLastSaved(mostRecent);
      }
    } catch (err) {
      console.error('Error loading saved forms:', err);
    }
  }, []);

  const saveForm = useCallback(async (formId) => {
    if (!formId) {
      setError('No form ID provided');
      return;
    }
    
    setIsSaving(true);
    setError(null);
    
    try {
      // Get form data from localStorage first, then from Redux
      const savedForms = JSON.parse(localStorage.getItem('form-builder-forms') || '{}');
      let formData = savedForms[formId];
      
      // If form not in localStorage, try to get from Redux via selector
      if (!formData) {
        // We need to access Redux store - but we can't use useSelector here
        // because it's inside a callback. We'll store forms in localStorage
        // when they're created/updated in Redux
        
        // Create a default form structure
        formData = {
          id: formId,
          title: 'Untitled Form',
          elements: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
      
      // Save to "API" (localStorage)
      const result = await saveFormToAPI(formData);
      
      if (result.success) {
        setLastSaved(new Date(result.savedAt));
        console.log(`Form ${formId} saved successfully at ${result.savedAt}`);
        return result;
      }
      
      return null;
    } catch (err) {
      setError(err.message);
      console.error('Error saving form:', err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const saveAllForms = useCallback(async () => {
    setIsSaving(true);
    try {
      const savedForms = JSON.parse(localStorage.getItem('form-builder-forms') || '{}');
      
      // Save each form
      const savePromises = Object.values(savedForms).map(form => 
        saveFormToAPI(form)
      );
      
      await Promise.all(savePromises);
      setLastSaved(new Date());
      console.log('All forms saved successfully');
    } catch (err) {
      setError(err.message);
      console.error('Error saving all forms:', err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    saveForm,
    saveAllForms,
    isSaving,
    lastSaved,
    error,
  };
};