import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, AlertCircle, Shield, Brain, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { mineReflectionPatterns, generatePersonalChecklist } from '../../utils/psychologicalAnalysis';

const PersonalizedChecklist = ({ trades, onAllChecked }) => {
  const [checklist, setChecklist] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [isPersonalized, setIsPersonalized] = useState(false);

  useEffect(() => {
    if (trades && trades.length > 10) { // Need enough data for personalization
      const patterns = mineReflectionPatterns(trades);
      const personalChecklist = generatePersonalChecklist(patterns);
      setChecklist(personalChecklist);
      setIsPersonalized(true);
    } else {
      // Default checklist for new users
      setChecklist(getDefaultChecklist());
      setIsPersonalized(false);
    }
  }, [trades]);

  useEffect(() => {
    // Check if all critical items are checked
    const criticalItems = checklist.filter(item => item.importance === 'critical');
    const allCriticalChecked = criticalItems.every(item => checkedItems[item.id]);
    
    if (onAllChecked) {
      onAllChecked(allCriticalChecked);
    }
  }, [checkedItems, checklist, onAllChecked]);

  const getDefaultChecklist = () => [
    {
      id: 'emotion_neutral',
      text: 'Bin ich emotional neutral und nicht im FOMO/Angst-Modus?',
      category: 'Psychologie',
      importance: 'critical'
    },
    {
      id: 'clear_setup',
      text: 'Ist mein Setup klar definiert und bestätigt?',
      category: 'Analyse',
      importance: 'critical'
    },
    {
      id: 'risk_defined',
      text: 'Ist mein Risiko klar definiert (Stop Loss gesetzt)?',
      category: 'Risk Management',
      importance: 'critical'
    },
    {
      id: 'position_size',
      text: 'Ist meine Position Size angemessen (max 2% Risiko)?',
      category: 'Risk Management',
      importance: 'high'
    },
    {
      id: 'exit_plan',
      text: 'Habe ich einen klaren Exit-Plan?',
      category: 'Strategie',
      importance: 'high'
    },
    {
      id: 'market_trend',
      text: 'Trade ich mit dem übergeordneten Trend?',
      category: 'Markt',
      importance: 'medium'
    }
  ];

  const handleCheck = (itemId) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const getImportanceIcon = (importance) => {
    switch (importance) {
      case 'critical':
        return <AlertCircle className="text-red-500" size={16} />;
      case 'high':
        return <Shield className="text-orange-500" size={16} />;
      default:
        return null;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Psychologie':
        return <Brain className="text-purple-500" size={16} />;
      case 'Erfolgs-Check':
        return <TrendingUp className="text-green-500" size={16} />;
      default:
        return null;
    }
  };

  const completionRate = (Object.keys(checkedItems).filter(key => checkedItems[key]).length / checklist.length * 100) || 0;
  const criticalItems = checklist.filter(item => item.importance === 'critical');
  const allCriticalChecked = criticalItems.every(item => checkedItems[item.id]);

  return (
    <Card className={allCriticalChecked ? 'border-green-300' : ''}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium flex items-center">
            {isPersonalized && <span className="text-purple-500 mr-2">✨</span>}
            {isPersonalized ? 'Deine persönliche Checkliste' : 'Pre-Trade Checkliste'}
          </h3>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-500">
              {Math.round(completionRate)}% complete
            </div>
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${
                  allCriticalChecked ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>

        {isPersonalized && (
          <div className="mb-3 p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-xs text-purple-700 dark:text-purple-300">
            Diese Checkliste wurde basierend auf deinen {trades.length} Trades personalisiert
          </div>
        )}

        <div className="space-y-3">
          {/* Critical Items First */}
          {criticalItems.map(item => (
            <div 
              key={item.id}
              className={`flex items-start space-x-2 p-2 rounded-lg border ${
                checkedItems[item.id] 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}
            >
              <button
                onClick={() => handleCheck(item.id)}
                className="mt-0.5 flex-shrink-0"
              >
                {checkedItems[item.id] ? (
                  <CheckCircle2 className="text-green-600" size={20} />
                ) : (
                  <Circle className="text-gray-400" size={20} />
                )}
              </button>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  {getImportanceIcon(item.importance)}
                  {getCategoryIcon(item.category)}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {item.category}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${
                  checkedItems[item.id] ? 'line-through text-gray-500' : 'text-gray-800 dark:text-gray-200'
                }`}>
                  {item.text}
                </p>
              </div>
            </div>
          ))}

          {/* Other Items */}
          {checklist.filter(item => item.importance !== 'critical').map(item => (
            <div 
              key={item.id}
              className={`flex items-start space-x-2 p-2 rounded-lg ${
                item.positive 
                  ? 'bg-green-50 dark:bg-green-900/20' 
                  : checkedItems[item.id]
                    ? 'bg-gray-50 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <button
                onClick={() => handleCheck(item.id)}
                className="mt-0.5 flex-shrink-0"
              >
                {checkedItems[item.id] ? (
                  <CheckCircle2 className="text-green-600" size={20} />
                ) : (
                  <Circle className="text-gray-400" size={20} />
                )}
              </button>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  {getImportanceIcon(item.importance)}
                  {getCategoryIcon(item.category)}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {item.category}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${
                  checkedItems[item.id] ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {!allCriticalChecked && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center">
              <AlertCircle className="mr-2" size={16} />
              Alle kritischen Punkte müssen abgehakt sein bevor du tradest!
            </p>
          </div>
        )}

        {allCriticalChecked && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-800 dark:text-green-200 flex items-center">
              <CheckCircle2 className="mr-2" size={16} />
              Alle kritischen Checks bestanden - Du bist bereit zu traden!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalizedChecklist;