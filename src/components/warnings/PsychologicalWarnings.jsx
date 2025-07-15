import React, { useEffect, useState } from 'react';
import { AlertTriangle, AlertCircle, Info, X, Coffee, Brain } from 'lucide-react';
import { detectEmotionPatterns, detectTiltPatterns } from '../../utils/psychologicalAnalysis';

const PsychologicalWarnings = ({ trades, currentEmotion, onDismiss }) => {
  const [warnings, setWarnings] = useState([]);
  const [insights, setInsights] = useState([]);
  const [dismissed, setDismissed] = useState([]);

  useEffect(() => {
    if (!trades || trades.length === 0) return;

    // Detect emotion patterns
    const emotionAnalysis = detectEmotionPatterns(trades, { emotion: currentEmotion });
    
    // Detect tilt patterns
    const tiltAnalysis = detectTiltPatterns(trades);
    
    // Combine all warnings
    const allWarnings = [
      ...emotionAnalysis.warnings,
      ...tiltAnalysis.warnings
    ].filter(w => !dismissed.includes(w.title));
    
    setWarnings(allWarnings);
    setInsights(emotionAnalysis.insights);
  }, [trades, currentEmotion, dismissed]);

  const handleDismiss = (warningTitle) => {
    setDismissed([...dismissed, warningTitle]);
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="text-red-600" size={20} />;
      case 'high':
        return <AlertCircle className="text-orange-500" size={20} />;
      case 'medium':
        return <Info className="text-yellow-500" size={20} />;
      default:
        return <Info className="text-blue-500" size={20} />;
    }
  };

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'critical':
        return 'border-red-300 bg-red-50';
      case 'high':
        return 'border-orange-300 bg-orange-50';
      case 'medium':
        return 'border-yellow-300 bg-yellow-50';
      default:
        return 'border-blue-300 bg-blue-50';
    }
  };

  if (warnings.length === 0 && insights.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mb-4">
      {/* Critical and High Warnings */}
      {warnings.filter(w => w.severity === 'critical' || w.severity === 'high').map((warning, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg border-2 ${getSeverityClass(warning.severity)} relative`}
        >
          <button
            onClick={() => handleDismiss(warning.title)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
          
          <div className="flex items-start space-x-3">
            {getSeverityIcon(warning.severity)}
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 flex items-center">
                {warning.title}
                {warning.type === 'revenge_trading' && <Coffee className="ml-2" size={16} />}
                {warning.type === 'emotion_pattern' && <Brain className="ml-2" size={16} />}
              </h4>
              <p className="text-gray-700 mt-1">{warning.message}</p>
              {warning.detail && (
                <p className="text-sm text-gray-600 mt-1">{warning.detail}</p>
              )}
              <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                <p className="text-sm font-medium text-gray-800">
                  💡 Empfehlung: {warning.recommendation}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Medium Warnings */}
      {warnings.filter(w => w.severity === 'medium').map((warning, index) => (
        <div
          key={index}
          className={`p-3 rounded-lg border ${getSeverityClass(warning.severity)} relative`}
        >
          <button
            onClick={() => handleDismiss(warning.title)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <X size={14} />
          </button>
          
          <div className="flex items-start space-x-2">
            {getSeverityIcon(warning.severity)}
            <div className="flex-1">
              <h5 className="font-medium text-gray-800 text-sm">{warning.title}</h5>
              <p className="text-sm text-gray-600 mt-1">{warning.message}</p>
              {warning.recommendation && (
                <p className="text-xs text-gray-500 mt-1">→ {warning.recommendation}</p>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Positive Insights */}
      {insights.map((insight, index) => (
        <div
          key={index}
          className="p-3 rounded-lg border border-green-300 bg-green-50"
        >
          <div className="flex items-start space-x-2">
            <div className="text-green-600">✓</div>
            <div className="flex-1">
              <h5 className="font-medium text-green-800 text-sm">{insight.title}</h5>
              <p className="text-sm text-green-700 mt-1">{insight.message}</p>
              {insight.recommendation && (
                <p className="text-xs text-green-600 mt-1">→ {insight.recommendation}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PsychologicalWarnings;