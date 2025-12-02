// Form persistence utility with auto-save capability

const STORAGE_KEY = 'form-builder-forms';
const AUTO_SAVE_DELAY = 3000; // 3 seconds

class FormPersistence {
  constructor() {
    this.autoSaveTimer = null;
    this.listeners = new Set();
  }

  // Load all forms from storage
  loadAllForms() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error loading forms from storage:', error);
      return {};
    }
  }

  // Load a specific form
  loadForm(formId) {
    const forms = this.loadAllForms();
    return forms[formId] || null;
  }

  // Save a form
  saveForm(formId, formData) {
    try {
      const forms = this.loadAllForms();
      forms[formId] = {
        ...formData,
        id: formId,
        savedAt: new Date().toISOString(),
        version: (forms[formId]?.version || 0) + 1,
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
      
      // Notify listeners
      this.notifyListeners(formId, forms[formId]);
      
      return {
        success: true,
        savedAt: forms[formId].savedAt,
        version: forms[formId].version,
      };
    } catch (error) {
      console.error('Error saving form:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Delete a form
  deleteForm(formId) {
    try {
      const forms = this.loadAllForms();
      delete forms[formId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
      
      this.notifyListeners(formId, null);
      return { success: true };
    } catch (error) {
      console.error('Error deleting form:', error);
      return { success: false, error: error.message };
    }
  }

  // Export forms to JSON file
  exportForms() {
    const forms = this.loadAllForms();
    const dataStr = JSON.stringify(forms, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `forms-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Import forms from JSON file
  importForms(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const importedForms = JSON.parse(event.target.result);
          const existingForms = this.loadAllForms();
          
          // Merge imported forms with existing forms
          const mergedForms = { ...existingForms, ...importedForms };
          
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedForms));
          
          // Notify about all imported forms
          Object.keys(importedForms).forEach(formId => {
            this.notifyListeners(formId, importedForms[formId]);
          });
          
          resolve({
            success: true,
            importedCount: Object.keys(importedForms).length,
          });
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  }

  // Auto-save functionality
  scheduleAutoSave(formId, formData) {
    if (this.autoSaveTimer) {
      clearTimeout(this.autoSaveTimer);
    }
    
    this.autoSaveTimer = setTimeout(() => {
      this.saveForm(formId, formData);
      this.autoSaveTimer = null;
    }, AUTO_SAVE_DELAY);
  }

  // Cancel pending auto-save
  cancelAutoSave() {
    if (this.autoSaveTimer) {
      clearTimeout(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  // Add listener for save events
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Notify all listeners
  notifyListeners(formId, formData) {
    this.listeners.forEach(callback => {
      try {
        callback(formId, formData);
      } catch (error) {
        console.error('Error in save listener:', error);
      }
    });
  }

  // Get save statistics
  getSaveStats() {
    const forms = this.loadAllForms();
    const formIds = Object.keys(forms);
    
    return {
      totalForms: formIds.length,
      lastSave: formIds.reduce((latest, formId) => {
        const savedAt = new Date(forms[formId]?.savedAt || 0);
        return savedAt > latest ? savedAt : latest;
      }, new Date(0)),
      totalVersions: formIds.reduce((sum, formId) => sum + (forms[formId]?.version || 0), 0),
    };
  }
}

// Create singleton instance
export const formPersistence = new FormPersistence();