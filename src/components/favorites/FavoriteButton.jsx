// src/components/favorites/FavoriteButton.jsx
import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { toggleFavorite, isFavorite } from '../../utils/templateUtils';

const FavoriteButton = ({ category, item, onChange, size = 16 }) => {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(isFavorite(category, item));
  }, [category, item]);

  const handleToggle = () => {
    const updatedFavorites = toggleFavorite(category, item);
    setIsFav(!isFav);
    
    if (onChange) {
      onChange(updatedFavorites);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-1 rounded-full transition-colors ${
        isFav ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-gray-500'
      }`}
      title={isFav ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
    >
      <Star 
        size={size} 
        fill={isFav ? 'currentColor' : 'none'} 
      />
    </button>
  );
};

export default FavoriteButton;