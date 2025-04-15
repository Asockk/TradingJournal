// src/components/form/EmotionSelector.jsx
import React from 'react';

const EmotionSelector = ({ value, onChange, type = 'pre', label }) => {
  // Emoji und Labels basierend auf Typ (pre-trade oder post-trade)
  const emotions = type === 'pre' 
    ? [
        { emoji: '😰', label: 'Ängstlich' },
        { emoji: '😟', label: 'Unsicher' },
        { emoji: '😐', label: 'Neutral' },
        { emoji: '🙂', label: 'Sicher' },
        { emoji: '😄', label: 'Übermütig' }
      ]
    : [
        { emoji: '😠', label: 'Frustriert' },
        { emoji: '😕', label: 'Unzufrieden' },
        { emoji: '😐', label: 'Neutral' },
        { emoji: '🙂', label: 'Zufrieden' },
        { emoji: '😁', label: 'Euphorisch' }
      ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label || `Emotionaler Zustand ${type === 'pre' ? '(vor Trade)' : '(nach Trade)'}`}
      </label>
      
      {/* Emoji-Anzeige über dem Schieberegler */}
      <div className="flex justify-between mb-1">
        {emotions.map((emotion, index) => (
          <div 
            key={index}
            className={`flex flex-col items-center cursor-pointer transition-all duration-200 ${
              value === index + 1 ? 'transform scale-125' : 'opacity-70'
            }`}
            onClick={() => onChange(index + 1)}
          >
            <span className="text-xl">{emotion.emoji}</span>
            <span className="text-xs mt-1 hidden sm:inline">{emotion.label}</span>
          </div>
        ))}
      </div>
      
      {/* Schieberegler */}
      <div className="mt-1 mb-2">
        <input
          type="range"
          min="1"
          max="5"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>
      
      {/* Mobile-freundliche Alternative mit Dropdown */}
      <div className="sm:hidden mt-2">
        <select 
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white"
        >
          {emotions.map((emotion, index) => (
            <option key={index} value={index + 1}>
              {emotion.emoji} {emotion.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default EmotionSelector;