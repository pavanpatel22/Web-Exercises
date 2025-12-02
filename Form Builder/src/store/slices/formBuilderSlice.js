import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  forms: {},
  activeFormId: null,
  optimisticUpdates: [],
  isLoading: false,
};

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    setActiveForm: (state, action) => {
      state.activeFormId = action.payload;
    },
    
    createForm: (state, action) => {
      const { id, title } = action.payload;
      state.forms[id] = {
        id,
        title,
        elements: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.activeFormId = id;
    },
    
    updateFormTitle: (state, action) => {
      const { formId, title } = action.payload;
      if (state.forms[formId]) {
        state.forms[formId].title = title;
        state.forms[formId].updatedAt = new Date().toISOString();
      }
    },
    
    addFormElement: (state, action) => {
      const { formId, element } = action.payload;
      if (state.forms[formId]) {
        state.forms[formId].elements.push({
          ...element,
          id: `element-${Date.now()}`,
        });
        state.forms[formId].updatedAt = new Date().toISOString();
      }
    },
    
    updateFormElement: (state, action) => {
      const { formId, elementId, updates } = action.payload;
      const form = state.forms[formId];
      if (form) {
        const elementIndex = form.elements.findIndex(el => el.id === elementId);
        if (elementIndex !== -1) {
          form.elements[elementIndex] = {
            ...form.elements[elementIndex],
            ...updates,
          };
          form.updatedAt = new Date().toISOString();
        }
      }
    },
    
    reorderFormElements: (state, action) => {
      const { formId, startIndex, endIndex } = action.payload;
      const form = state.forms[formId];
      if (form) {
        const [removed] = form.elements.splice(startIndex, 1);
        form.elements.splice(endIndex, 0, removed);
        form.updatedAt = new Date().toISOString();
      }
    },
    
    deleteFormElement: (state, action) => {
      const { formId, elementId } = action.payload;
      const form = state.forms[formId];
      if (form) {
        form.elements = form.elements.filter(el => el.id !== elementId);
        form.updatedAt = new Date().toISOString();
      }
    },
    
    setOptimisticUpdate: (state, action) => {
      state.optimisticUpdates.push(action.payload);
    },
    
    clearOptimisticUpdate: (state, action) => {
      state.optimisticUpdates = state.optimisticUpdates.filter(
        update => update.id !== action.payload
      );
    },
    
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setActiveForm,
  createForm,
  updateFormTitle,
  addFormElement,
  updateFormElement,
  reorderFormElements,
  deleteFormElement,
  setOptimisticUpdate,
  clearOptimisticUpdate,
  setLoading,
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;