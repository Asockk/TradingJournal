// src/components/favorites/FavoritesSelector.jsx
import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { loadFavorites } from '../../utils/templateUtils';

const FavoritesSelector = ({ category, onSelect, className = '' }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const favs = loadFavorites();
    setFavorites(favs[category] || []);
  }, [category]);

  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-1 items-center ${className}`}>
      <span className="text-xs font-medium text-gray-500 flex items-center mr-1">
        <Star size={12} className="mr-1 text-yellow-500" fill="currentColor" />
        Favoriten:
      </span>
      
      {favorites.map((item) => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          className="px-2 py-1 text-xs bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-md hover:bg-yellow-100 transition-colors"
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default FavoritesSelector;