import React, { createContext, useContext, useMemo, useState } from 'react';

const UIStateContext = createContext();

export const useUIState = () => {
  const context = useContext(UIStateContext);
  if (!context) {
    throw new Error('useUIState must be used within a UIStateProvider');
  }
  return context;
};

export const UIStateProvider = ({ children }) => {
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toolbarVisible, setToolbarVisible] = useState(true);

  const value = useMemo(() => ({
    selectedElementId,
    setSelectedElementId,
    sidebarOpen,
    setSidebarOpen,
    toolbarVisible,
    setToolbarVisible,
  }), [selectedElementId, sidebarOpen, toolbarVisible]);

  return (
    <UIStateContext.Provider value={value}>
      {children}
    </UIStateContext.Provider>
  );
};