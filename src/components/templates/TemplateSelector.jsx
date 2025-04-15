// src/components/templates/TemplateSelector.jsx
import React, { useState, useEffect } from 'react';
import { BookMarked, ChevronDown, ChevronUp } from 'lucide-react';
import { loadTemplates } from '../../utils/templateUtils';

const TemplateSelector = ({ onSelectTemplate, onManageTemplates }) => {
  const [templates, setTemplates] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setTemplates(loadTemplates());
  }, []);

  // If no templates, only show the manage button
  if (templates.length === 0) {
    return (
      <button
        type="button"
        onClick={onManageTemplates}
        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
      >
        <BookMarked size={16} />
        Vorlagen verwalten
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
      >
        <BookMarked size={16} />
        Vorlagen
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-20">
          <div className="max-h-64 overflow-y-auto">
            {templates.map((template) => (
              <button
                key={template.id}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 flex flex-col"
                onClick={() => {
                  onSelectTemplate(template.data);
                  setIsOpen(false);
                }}
              >
                <span className="font-medium">{template.name}</span>
                <span className="text-xs text-gray-500">
                  {template.data.asset} {template.data.position} 
                  {template.data.tradeType ? ` • ${template.data.tradeType}` : ''}
                </span>
              </button>
            ))}
          </div>
          <div className="border-t p-2">
            <button
              type="button"
              onClick={() => {
                onManageTemplates();
                setIsOpen(false);
              }}
              className="w-full text-left px-2 py-1 text-sm text-blue-600 rounded-md hover:bg-blue-50"
            >
              Vorlagen verwalten
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;