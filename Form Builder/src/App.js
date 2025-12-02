import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { UIStateProvider } from './contexts/UIStateContext';
import { FormActionsProvider } from './contexts/FormActionsContext';
import { Dashboard } from './components/Dashboard';
import { FormCanvas } from './components/Form/FormCanvas';
import { FormPreview } from './components/FormPreview';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { useFormActions } from './contexts/FormActionsContext';
import { selectHasPendingUpdates, selectAllForms } from './store/selectors';
import { setLoading } from './store/slices/formBuilderSlice';
import './App.css';

const AppContent = () => {
  const location = useLocation();
  const { addElement } = useFormActions();
  const dispatch = useDispatch();
  const hasPendingUpdates = useSelector(selectHasPendingUpdates);
  const forms = useSelector(selectAllForms);
  const isFormRoute = location.pathname.includes('/form/');

  // Save forms to localStorage whenever Redux state changes
  useEffect(() => {
    const saveFormsToStorage = () => {
      try {
        const formsObject = forms.reduce((acc, form) => {
          acc[form.id] = form;
          return acc;
        }, {});
        
        const existingForms = JSON.parse(localStorage.getItem('form-builder-forms') || '{}');
        const mergedForms = { ...existingForms, ...formsObject };
        localStorage.setItem('form-builder-forms', JSON.stringify(mergedForms));
      } catch (error) {
        console.error('Error saving forms to storage:', error);
      }
    };

    saveFormsToStorage();
  }, [forms]);

  return (
    <div className="app">
      {isFormRoute && <Sidebar onAddElement={addElement} isOpen={true} />}
      
      <div className={isFormRoute ? "app-main-with-sidebar" : "app-main"}>
        <Header 
          hasPendingUpdates={hasPendingUpdates}
          isFormRoute={isFormRoute}
        />
        
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/form/:formId/edit" element={<FormCanvas />} />
            <Route path="/form/:formId/preview" element={<FormPreview />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <UIStateProvider>
      <FormActionsProvider>
        <AppContent />
      </FormActionsProvider>
    </UIStateProvider>
  );
}

export default App;