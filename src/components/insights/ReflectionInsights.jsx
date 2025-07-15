import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Target, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { mineReflectionPatterns } from '../../utils/psychologicalAnalysis';

const ReflectionInsights = ({ trades }) => {
  const [patterns, setPatterns] = useState(null);
  const [expandedSection, setExpandedSection] = useState('mistakes');

  useEffect(() => {
    if (trades && trades.length > 0) {
      const minedPatterns = mineReflectionPatterns(trades);
      setPatterns(minedPatterns);
    }
  }, [trades]);

  if (!patterns || (patterns.commonMistakes.length === 0 && patterns.successFactors.length === 0)) {
    return (
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-2">Reflexions-Analyse</h3>
          <p className="text-gray-500 text-sm">
            Füge mehr Trade-Reflexionen hinzu, um Muster zu erkennen.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getCategoryIcon = (category) => {
    const icons = {
      timing: '⏰',
      emotion: '🧠',
      analysis: '📊',
      risk: '⚠️',
      plan: '📋'
    };
    return icons[category] || '📌';
  };

  const getCategoryLabel = (category) => {
    const labels = {
      timing: 'Timing',
      emotion: 'Emotionen',
      analysis: 'Analyse',
      risk: 'Risk Management',
      plan: 'Trading Plan'
    };
    return labels[category] || category;
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Lightbulb className="mr-2 text-yellow-500" size={20} />
          Reflexions-Analyse
        </h3>

        {/* Common Mistakes */}
        {patterns.commonMistakes.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setExpandedSection(expandedSection === 'mistakes' ? '' : 'mistakes')}
              className="w-full flex items-center justify-between mb-3 text-left"
            >
              <h4 className="font-medium text-red-700 flex items-center">
                <TrendingDown className="mr-2" size={18} />
                Häufige Fehler-Muster ({patterns.commonMistakes.length})
              </h4>
              {expandedSection === 'mistakes' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {expandedSection === 'mistakes' && (
              <div className="space-y-3">
                {patterns.commonMistakes.map((mistake, index) => (
                  <div key={index} className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{getCategoryIcon(mistake.category)}</span>
                        <div>
                          <h5 className="font-medium text-gray-800 dark:text-gray-200">
                            {getCategoryLabel(mistake.category)}
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            In {mistake.percentage}% deiner Verlust-Trades erwähnt
                            <span className="ml-2 text-xs bg-red-200 dark:bg-red-800 px-2 py-0.5 rounded">
                              {mistake.frequency}x
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {mistake.examples.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Beispiele:</p>
                        {mistake.examples.map((example, idx) => (
                          <div key={idx} className="text-xs bg-white dark:bg-gray-800 p-2 rounded border border-red-100 dark:border-red-900">
                            <p className="text-gray-700 dark:text-gray-300 italic">"{example.text}"</p>
                            <p className="text-gray-500 dark:text-gray-500 mt-1">
                              {example.date} • Verlust: {example.pnl}€
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Success Factors */}
        {patterns.successFactors.length > 0 && (
          <div>
            <button
              onClick={() => setExpandedSection(expandedSection === 'success' ? '' : 'success')}
              className="w-full flex items-center justify-between mb-3 text-left"
            >
              <h4 className="font-medium text-green-700 flex items-center">
                <TrendingUp className="mr-2" size={18} />
                Erfolgs-Faktoren ({patterns.successFactors.length})
              </h4>
              {expandedSection === 'success' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {expandedSection === 'success' && (
              <div className="space-y-3">
                {patterns.successFactors.map((factor, index) => (
                  <div key={index} className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{getCategoryIcon(factor.category)}</span>
                        <div>
                          <h5 className="font-medium text-gray-800 dark:text-gray-200">
                            {getCategoryLabel(factor.category)}
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            In {factor.percentage}% deiner Gewinn-Trades erwähnt
                            <span className="ml-2 text-xs bg-green-200 dark:bg-green-800 px-2 py-0.5 rounded">
                              {factor.frequency}x
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {factor.examples.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Beispiele:</p>
                        {factor.examples.map((example, idx) => (
                          <div key={idx} className="text-xs bg-white dark:bg-gray-800 p-2 rounded border border-green-100 dark:border-green-900">
                            <p className="text-gray-700 dark:text-gray-300 italic">"{example.text}"</p>
                            <p className="text-gray-500 dark:text-gray-500 mt-1">
                              {example.date} • Gewinn: +{example.pnl}€
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Items */}
        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h5 className="font-medium text-blue-800 dark:text-blue-200 flex items-center mb-2">
            <Target className="mr-2" size={16} />
            Empfohlene Maßnahmen
          </h5>
          <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
            {patterns.commonMistakes.slice(0, 2).map((mistake, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>Fokus auf {getCategoryLabel(mistake.category)}: Vermeide die Fehler in {mistake.frequency} Trades</span>
              </li>
            ))}
            {patterns.successFactors.slice(0, 2).map((factor, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>Verstärke {getCategoryLabel(factor.category)}: Erfolgsfaktor in {factor.percentage}% der Gewinne</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReflectionInsights;