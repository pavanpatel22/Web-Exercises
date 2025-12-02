import { createSelector } from 'reselect';

// Base selectors
const selectFormBuilder = (state) => state.formBuilder;
const selectForms = (state) => state.formBuilder.forms;
const selectActiveFormId = (state) => state.formBuilder.activeFormId;
const selectOptimisticUpdates = (state) => state.formBuilder.optimisticUpdates;

// Memoized selectors
export const selectActiveForm = createSelector(
  [selectForms, selectActiveFormId],
  (forms, activeFormId) => (activeFormId ? forms[activeFormId] : null)
);

export const selectAllForms = createSelector(
  [selectForms],
  (forms) => Object.values(forms)
);

export const selectFormElements = createSelector(
  [selectActiveForm],
  (activeForm) => activeForm?.elements || []
);

export const selectFormById = createSelector(
  [selectForms, (_, formId) => formId],
  (forms, formId) => forms[formId]
);

export const selectHasPendingUpdates = createSelector(
  [selectOptimisticUpdates],
  (updates) => updates.length > 0
);

export const selectFormStats = createSelector(
  [selectActiveForm],
  (form) => {
    if (!form) return null;
    
    const elements = form.elements || [];
    const requiredCount = elements.filter(el => el.required).length;
    const fieldTypes = elements.reduce((acc, el) => {
      acc[el.type] = (acc[el.type] || 0) + 1;
      return acc;
    }, {});

    return {
      totalElements: elements.length,
      requiredCount,
      fieldTypes,
    };
  }
);

// Export base selectors too
export { selectActiveFormId, selectOptimisticUpdates };