// src/components/templates/TemplateModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Save, Edit, Trash2, Copy, Check, AlertCircle } from 'lucide-react';
import { loadTemplates, addTemplate, updateTemplate, deleteTemplate, extractTemplateFromTrade } from '../../utils/templateUtils';

const TemplateModal = ({ isOpen, onClose, onApplyTemplate, currentTrade = null }) => {
  const [templates, setTemplates] = useState([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Load templates on initial render
  useEffect(() => {
    if (isOpen) {
      setTemplates(loadTemplates());
      
      // If we have a current trade and showing the modal, we might be saving a new template
      if (currentTrade && !showSaveForm) {
        setShowSaveForm(true);
      } else {
        setShowSaveForm(false);
      }
      
      // Reset state
      setName('');
      setEditingId(null);
      setError('');
      setSuccessMessage('');
    }
  }, [isOpen, currentTrade]);

  if (!isOpen) return null;
  
  const handleSaveTemplate = () => {
    if (!name.trim()) {
      setError('Bitte gib einen Namen für die Vorlage ein.');
      return;
    }
    
    // Extract template data from current trade
    const templateData = extractTemplateFromTrade(currentTrade);
    
    // Check if name already exists
    const nameExists = templates.some(t => 
      t.name.toLowerCase() === name.toLowerCase() && t.id !== editingId
    );
    
    if (nameExists) {
      setError('Eine Vorlage mit diesem Namen existiert bereits.');
      return;
    }
    
    if (editingId) {
      // Update existing template
      const updatedTemplates = updateTemplate(editingId, { name, data: templateData });
      setTemplates(updatedTemplates);
      setSuccessMessage('Vorlage erfolgreich aktualisiert!');
    } else {
      // Add new template
      const updatedTemplates = addTemplate({ name, data: templateData });
      setTemplates(updatedTemplates);
      setSuccessMessage('Vorlage erfolgreich gespeichert!');
    }
    
    // Reset form
    setName('');
    setEditingId(null);
    setShowSaveForm(false);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  const handleEditTemplate = (template) => {
    setName(template.name);
    setEditingId(template.id);
    setShowSaveForm(true);
  };
  
  const handleDeleteTemplate = (id) => {
    if (window.confirm('Bist du sicher, dass du diese Vorlage löschen möchtest?')) {
      const updatedTemplates = deleteTemplate(id);
      setTemplates(updatedTemplates);
    }
  };
  
  const handleApplyTemplate = (template) => {
    onApplyTemplate(template.data);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black/30 backdrop-blur-sm flex justify-center items-start pt-10">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            {showSaveForm ? 'Vorlage speichern' : 'Vorlagen verwalten'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4">
          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
              <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          
          {/* Success message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-start">
              <Check size={20} className="mr-2 mt-0.5 flex-shrink-0" />
              <p>{successMessage}</p>
            </div>
          )}
          
          {showSaveForm ? (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vorlagenname
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="z.B. BTC Breakout Long"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowSaveForm(false);
                    setName('');
                    setEditingId(null);
                    setError('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleSaveTemplate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-1"
                >
                  <Save size={16} />
                  {editingId ? 'Aktualisieren' : 'Speichern'}
                </button>
              </div>
            </div>
          ) : (
            <div>
              {templates.length > 0 ? (
                <div className="max-h-80 overflow-y-auto">
                  {templates.map((template) => (
                    <div 
                      key={template.id} 
                      className="mb-2 p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{template.name}</h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApplyTemplate(template)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Vorlage anwenden"
                          >
                            <Copy size={18} />
                          </button>
                          <button
                            onClick={() => handleEditTemplate(template)}
                            className="text-gray-600 hover:text-gray-800"
                            title="Vorlage bearbeiten"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Vorlage löschen"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        {template.data.asset} {template.data.position} 
                        {template.data.tradeType ? ` • ${template.data.tradeType}` : ''}
                        {template.data.leverage > 1 ? ` • ${template.data.leverage}x` : ''}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>Du hast noch keine Vorlagen gespeichert.</p>
                  {currentTrade && (
                    <button
                      onClick={() => setShowSaveForm(true)}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md"
                    >
                      Aktuelle Einstellungen als Vorlage speichern
                    </button>
                  )}
                </div>
              )}
              
              {currentTrade && templates.length > 0 && (
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => setShowSaveForm(true)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Aktuelle Einstellungen als Vorlage speichern
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateModal;