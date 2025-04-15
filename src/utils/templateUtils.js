// src/utils/templateUtils.js
const TEMPLATES_STORAGE_KEY = 'trading-journal-templates';
const FAVORITES_STORAGE_KEY = 'trading-journal-favorites';

/**
 * Load templates from local storage
 * @returns {Array} Array of template objects or empty array if none found
 */
export const loadTemplates = () => {
  const storedData = localStorage.getItem(TEMPLATES_STORAGE_KEY);
  return storedData ? JSON.parse(storedData) : [];
};

/**
 * Save templates to local storage
 * @param {Array} templates - Array of template objects
 */
export const saveTemplates = (templates) => {
  localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
};

/**
 * Add a new template
 * @param {Object} template - Template object
 * @param {string} template.name - Template name
 * @param {Object} template.data - Template data
 * @returns {Array} Updated templates array
 */
export const addTemplate = (template) => {
  const templates = loadTemplates();
  const newTemplate = {
    ...template,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  
  templates.push(newTemplate);
  saveTemplates(templates);
  return templates;
};

/**
 * Update an existing template
 * @param {string} id - Template ID
 * @param {Object} updatedTemplate - Updated template data
 * @returns {Array} Updated templates array
 */
export const updateTemplate = (id, updatedTemplate) => {
  const templates = loadTemplates();
  const index = templates.findIndex(t => t.id === id);
  
  if (index !== -1) {
    templates[index] = {
      ...templates[index],
      ...updatedTemplate,
      updatedAt: new Date().toISOString()
    };
    saveTemplates(templates);
  }
  
  return templates;
};

/**
 * Delete a template
 * @param {string} id - Template ID
 * @returns {Array} Updated templates array
 */
export const deleteTemplate = (id) => {
  const templates = loadTemplates();
  const filteredTemplates = templates.filter(t => t.id !== id);
  
  saveTemplates(filteredTemplates);
  return filteredTemplates;
};

/**
 * Load favorites from local storage
 * @returns {Object} Object with asset, assetClass, and strategy favorites
 */
export const loadFavorites = () => {
  const storedData = localStorage.getItem(FAVORITES_STORAGE_KEY);
  return storedData ? JSON.parse(storedData) : {
    assets: [],
    assetClasses: [],
    tradeTypes: []
  };
};

/**
 * Save favorites to local storage
 * @param {Object} favorites - Favorites object
 */
export const saveFavorites = (favorites) => {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
};

/**
 * Toggle an item in a favorites category
 * @param {string} category - Category name ('assets', 'assetClasses', 'tradeTypes')
 * @param {string} item - Item to toggle
 * @returns {Object} Updated favorites object
 */
export const toggleFavorite = (category, item) => {
  const favorites = loadFavorites();
  
  if (!favorites[category]) {
    favorites[category] = [];
  }
  
  const index = favorites[category].indexOf(item);
  
  if (index === -1) {
    favorites[category].push(item);
  } else {
    favorites[category].splice(index, 1);
  }
  
  saveFavorites(favorites);
  return favorites;
};

/**
 * Check if an item is in favorites
 * @param {string} category - Category name ('assets', 'assetClasses', 'tradeTypes')
 * @param {string} item - Item to check
 * @returns {boolean} True if item is a favorite
 */
export const isFavorite = (category, item) => {
  const favorites = loadFavorites();
  return favorites[category] && favorites[category].includes(item);
};

/**
 * Extract template base from trade data (without personal details, IDs, etc.)
 * @param {Object} trade - Trade object
 * @returns {Object} Template base
 */
export const extractTemplateFromTrade = (trade) => {
  // Exclude fields that shouldn't be part of a template
  const {
    id, entryDate, entryTime, exitDate, exitTime, 
    pnl, actualRiskReward, duration, ...templateBase
  } = trade;
  
  return templateBase;
};