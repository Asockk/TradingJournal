import React from 'react';
import { getFieldStyle } from '../../utils/formUtils';

const AnalysisTabContent = ({ currentTrade, handleInputChange, setCurrentTrade }) => {
  // Helper to check if trade is completed (has exitDate)
  const isTradeCompleted = !!currentTrade.exitDate;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center">
          <label className="text-sm font-medium text-gray-700 mr-2">
            Habe ich den Plan befolgt?
          </label>
          <div className="flex items-center space-x-4">
            <label className={`inline-flex items-center ${!isTradeCompleted ? 'opacity-50' : ''}`}>
              <input
                type="radio"
                name="followedPlan"
                checked={currentTrade.followedPlan === true}
                onChange={() => setCurrentTrade(prev => ({ ...prev, followedPlan: true }))}
                className="mr-1"
                disabled={!isTradeCompleted}
              />
              <span>Ja</span>
            </label>
            <label className={`inline-flex items-center ${!isTradeCompleted ? 'opacity-50' : ''}`}>
              <input
                type="radio"
                name="followedPlan"
                checked={currentTrade.followedPlan === false}
                onChange={() => setCurrentTrade(prev => ({ ...prev, followedPlan: false }))}
                className="mr-1"
                disabled={!isTradeCompleted}
              />
              <span>Nein</span>
            </label>
            {!isTradeCompleted && (
              <span className="text-xs text-amber-600 ml-2">
                Erst nach Trade-Abschluss verfügbar
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center">
          <label className="text-sm font-medium text-gray-700 mr-2">
            Würde ich diesen Trade wieder machen?
          </label>
          <div className="flex items-center space-x-4">
            <label className={`inline-flex items-center ${!isTradeCompleted ? 'opacity-50' : ''}`}>
              <input
                type="radio"
                name="wouldTakeAgain"
                checked={currentTrade.wouldTakeAgain === true}
                onChange={() => setCurrentTrade(prev => ({ ...prev, wouldTakeAgain: true }))}
                className="mr-1"
                disabled={!isTradeCompleted}
              />
              <span>Ja</span>
            </label>
            <label className={`inline-flex items-center ${!isTradeCompleted ? 'opacity-50' : ''}`}>
              <input
                type="radio"
                name="wouldTakeAgain"
                checked={currentTrade.wouldTakeAgain === false}
                onChange={() => setCurrentTrade(prev => ({ ...prev, wouldTakeAgain: false }))}
                className="mr-1"
                disabled={!isTradeCompleted}
              />
              <span>Nein</span>
            </label>
            {!isTradeCompleted && (
              <span className="text-xs text-amber-600 ml-2">
                Erst nach Trade-Abschluss verfügbar
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Was hat funktioniert?
          </label>
          <textarea
            name="whatWorked"
            value={currentTrade.whatWorked}
            onChange={handleInputChange}
            className={`w-full p-2 border border-gray-300 rounded-md ${!isTradeCompleted ? 'bg-gray-50' : ''}`}
            rows="2"
            placeholder={isTradeCompleted ? "Was hat bei diesem Trade gut funktioniert?" : "Verfügbar nach Trade-Abschluss"}
            disabled={!isTradeCompleted}
          ></textarea>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Was hat nicht funktioniert?
          </label>
          <textarea
            name="whatDidntWork"
            value={currentTrade.whatDidntWork}
            onChange={handleInputChange}
            className={`w-full p-2 border border-gray-300 rounded-md ${!isTradeCompleted ? 'bg-gray-50' : ''}`}
            rows="2"
            placeholder={isTradeCompleted ? "Was hat nicht funktioniert oder könnte verbessert werden?" : "Verfügbar nach Trade-Abschluss"}
            disabled={!isTradeCompleted}
          ></textarea>
        </div>
      </div>
      
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Reassessment-Triggers
        </label>
        <textarea
          name="reassessmentTriggers"
          value={currentTrade.reassessmentTriggers}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          rows="2"
          placeholder="Marktbedingungen, die zum Überdenken des Trades führen würden"
        ></textarea>
      </div>
      
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notizen nach Trade-Abschluss
        </label>
        <textarea
          name="notes"
          value={currentTrade.notes}
          onChange={handleInputChange}
          className={`w-full p-2 border border-gray-300 rounded-md ${!isTradeCompleted ? 'bg-gray-50' : ''}`}
          rows="3"
          placeholder={isTradeCompleted ? "Weitere Beobachtungen oder Learnings aus diesem Trade" : "Verfügbar nach Trade-Abschluss"}
          disabled={!isTradeCompleted}
        ></textarea>
      </div>
      
      {!isTradeCompleted && (
        <div className="mt-4 p-3 bg-amber-50 text-amber-700 rounded-md">
          <p className="text-sm">
            <strong>Hinweis:</strong> Einige Felder in dieser Analyse werden erst nach dem Abschluss des Trades (Setzen eines Exit-Datums) verfügbar sein.
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalysisTabContent;