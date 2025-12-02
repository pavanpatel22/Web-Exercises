import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { UIStateProvider } from './contexts/UIStateContext';
import { FormActionsProvider } from './contexts/FormActionsContext';
import { Dashboard } from './components/Dashboard';
import { FormCanvas } from './components/Form/FormCanvas';
import { FormPreview } from './components/FormPreview.js';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { useFormActions } from './contexts/FormActionsContext';
import { selectHasPendingUpdates } from './store/selectors';
import './App.css';

const AppContent = () => {
  const location = useLocation();
  const { addElement } = useFormActions();
  const hasPendingUpdates = useSelector(selectHasPendingUpdates);
  const isFormRoute = location.pathname.includes('/form/');

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