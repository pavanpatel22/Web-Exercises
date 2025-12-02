import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  addFormElement, 
  updateFormElement, 
  deleteFormElement,
  setOptimisticUpdate,
  clearOptimisticUpdate,
} from '../store/slices/formBuilderSlice';
import { selectActiveFormId } from '../store/selectors';

const FormActionsContext = createContext();

export const useFormActions = () => {
  const context = useContext(FormActionsContext);
  if (!context) {
    throw new Error('useFormActions must be used within a FormActionsProvider');
  }
  return context;
};

export const FormActionsProvider = ({ children }) => {
  const dispatch = useDispatch();
  const activeFormId = useSelector(selectActiveFormId);

  const addElement = useCallback((elementType) => {
    if (!activeFormId) return;

    const element = {
      type: elementType,
      label: `New ${elementType}`,
      required: false,
      placeholder: '',
      options: elementType === 'select' || elementType === 'radio' ? ['Option 1'] : undefined,
    };

    const updateId = `update-${Date.now()}`;
    
    // Optimistic update
    dispatch(setOptimisticUpdate({
      id: updateId,
      type: 'ADD_ELEMENT',
      element,
    }));

    dispatch(addFormElement({ formId: activeFormId, element }));

    // Simulate API call and clear optimistic update
    setTimeout(() => {
      dispatch(clearOptimisticUpdate(updateId));
    }, 1000);
  }, [activeFormId, dispatch]);

  const updateElement = useCallback((elementId, updates) => {
    if (!activeFormId) return;

    const updateId = `update-${Date.now()}`;
    
    dispatch(setOptimisticUpdate({
      id: updateId,
      type: 'UPDATE_ELEMENT',
      elementId,
      updates,
    }));

    dispatch(updateFormElement({ 
      formId: activeFormId, 
      elementId, 
      updates 
    }));

    setTimeout(() => {
      dispatch(clearOptimisticUpdate(updateId));
    }, 1000);
  }, [activeFormId, dispatch]);

  const removeElement = useCallback((elementId) => {
    if (!activeFormId) return;

    const updateId = `update-${Date.now()}`;
    
    dispatch(setOptimisticUpdate({
      id: updateId,
      type: 'DELETE_ELEMENT',
      elementId,
    }));

    dispatch(deleteFormElement({ 
      formId: activeFormId, 
      elementId 
    }));

    setTimeout(() => {
      dispatch(clearOptimisticUpdate(updateId));
    }, 1000);
  }, [activeFormId, dispatch]);

  const value = useMemo(() => ({
    addElement,
    updateElement,
    removeElement,
  }), [addElement, updateElement, removeElement]);

  return (
    <FormActionsContext.Provider value={value}>
      {children}
    </FormActionsContext.Provider>
  );
};