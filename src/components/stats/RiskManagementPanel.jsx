import React, { useMemo } from 'react';
import { Card, CardContent } from '../ui/card';
import { Shield, BarChart2, TrendingDown } from 'lucide-react';
import RiskRewardComparisonChart from '../charts/RiskRewardComparisonChart';
import StopLossAdherenceChart from '../charts/StopLossAdherenceChart';
import DrawdownAnalysisChart from '../charts/DrawdownAnalysisChart';
import { calculateRiskRewardComparison, calculateStopLossAdherence, calculateDrawdownAnalysis } from '../../utils/riskAnalysisUtils';

const RiskManagementPanel = ({ trades }) => {
  // Calculate risk management metrics
  const riskRewardData = useMemo(() => 
    calculateRiskRewardComparison(trades), [trades]);
    
  const stopLossData = useMemo(() => 
    calculateStopLossAdherence(trades), [trades]);
    
  const drawdownData = useMemo(() => 
    calculateDrawdownAnalysis(trades), [trades]);
  
  // Check if we have any valid data to show
  const hasValidData = trades && trades.length > 0;
  
  if (!hasValidData) {
    return (
      <Card>
        <CardContent className="p-4">
          <h3 className="text-xl font-medium mb-4">Erweiterte Risikomanagement-Analyse</h3>
          <p className="text-gray-500 text-center py-8">
            Keine Trades vorhanden für eine Risikomanagement-Analyse.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Count trades with stop loss and take profit for insight
  const tradesWithStopLoss = trades.filter(t => t.stopLoss && !isNaN(parseFloat(t.stopLoss))).length;
  const tradesWithTakeProfit = trades.filter(t => t.takeProfit && !isNaN(parseFloat(t.takeProfit))).length;
  const tradesWithBoth = trades.filter(t => 
    t.stopLoss && !isNaN(parseFloat(t.stopLoss)) && 
    t.takeProfit && !isNaN(parseFloat(t.takeProfit))
  ).length;
  
  const percentWithStopLoss = Math.round((tradesWithStopLoss / trades.length) * 100);
  const percentWithTakeProfit = Math.round((tradesWithTakeProfit / trades.length) * 100);
  const percentWithBoth = Math.round((tradesWithBoth / trades.length) * 100);

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-xl font-medium mb-4">Erweiterte Risikomanagement-Analyse</h3>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-2">
            Diese Analyse untersucht dein Risikomanagement in drei Dimensionen: Die Einhaltung deiner geplanten Risiko-Ertrags-Verhältnisse,
            die Disziplin bei Stop-Loss-Orders und die Analyse von Drawdowns mit Erholungszeiten.
          </p>
          
          <div className="bg-blue-50 p-3 rounded-md text-blue-800 mb-4">
            <p className="font-medium flex items-center">
              <Shield size={18} className="mr-2" />
              Risikomanagement-Übersicht
            </p>
            <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
              <div>
                <p>Stop-Loss gesetzt:</p>
                <p className="font-medium">{tradesWithStopLoss} Trades ({percentWithStopLoss}%)</p>
              </div>
              <div>
                <p>Take-Profit gesetzt:</p>
                <p className="font-medium">{tradesWithTakeProfit} Trades ({percentWithTakeProfit}%)</p>
              </div>
              <div>
                <p>Vollständige RM-Strategie:</p>
                <p className="font-medium">{tradesWithBoth} Trades ({percentWithBoth}%)</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Risk-Reward Comparison */}
        <div className="mb-6">
          <div className="flex items-center text-lg font-medium mb-2">
            <BarChart2 size={20} className="mr-2 text-blue-600" />
            Risiko-Ertrags-Verhältnis Analyse
          </div>
          <RiskRewardComparisonChart comparisonData={riskRewardData.comparisonData} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Stop Loss Adherence */}
          <div>
            <div className="flex items-center text-lg font-medium mb-2">
              <Shield size={20} className="mr-2 text-blue-600" />
              Stop-Loss Einhaltung
            </div>
            <StopLossAdherenceChart stopLossStats={stopLossData} />
          </div>
          
          {/* Drawdown Analysis */}
          <div>
            <div className="flex items-center text-lg font-medium mb-2">
              <TrendingDown size={20} className="mr-2 text-blue-600" />
              Drawdown-Analyse
            </div>
            <DrawdownAnalysisChart drawdownData={drawdownData} />
          </div>
        </div>
        
        {/* Overall Risk Management Assessment */}
        <div className="p-4 bg-gray-50 rounded-md text-sm">
          <h4 className="font-medium mb-2">Gesamtbewertung deines Risikomanagements:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <span className="font-medium">Risk-Reward Planung:</span> {
                riskRewardData.overestimationPercentage > 70 
                  ? 'Deutliche Tendenz zur Überschätzung. Arbeite an realistischeren Zielen.'
                  : riskRewardData.overestimationPercentage > 50
                    ? 'Moderate Überschätzung. Überprüfe deine Zielsetzung.'
                    : 'Gute realistische Einschätzung deines Risk-Reward Verhältnisses.'
              }
            </li>
            <li>
              <span className="font-medium">Stop-Loss Disziplin:</span> {
                stopLossData.adherencePercentage < 20
                  ? 'Ausgezeichnete Disziplin bei der Einhaltung deiner Stop-Loss-Orders.'
                  : stopLossData.adherencePercentage < 40
                    ? 'Gute Stop-Loss-Disziplin mit Potenzial für Verbesserungen.'
                    : 'Verbesserungsbedürftige Stop-Loss-Disziplin. Arbeite an deiner Handelsdisziplin.'
              }
            </li>
            <li>
              <span className="font-medium">Drawdown-Management:</span> {
                drawdownData.maxDrawdownPercentage < 25
                  ? 'Effektive Begrenzung deiner Drawdowns, was auf gutes Risikomanagement hindeutet.'
                  : drawdownData.maxDrawdownPercentage < 50
                    ? 'Moderate Drawdowns. Achte auf Positionsgrößen und Diversifikation.'
                    : 'Große Drawdowns, die auf Verbesserungspotenzial im Risikomanagement hindeuten.'
              }
            </li>
            <li>
              <span className="font-medium">Verbesserungsvorschlag:</span> {
                percentWithBoth < 50
                  ? 'Setze für mehr Trades sowohl Stop-Loss als auch Take-Profit, um dein Risikomanagement zu verbessern.'
                  : stopLossData.adherencePercentage > 40
                    ? 'Arbeite an deiner Disziplin, gesetzte Stop-Loss-Levels einzuhalten.'
                    : riskRewardData.overestimationPercentage > 60
                      ? 'Setze realistischere Risk-Reward-Ziele, um deine Planungsgenauigkeit zu verbessern.'
                      : 'Halte deine guten Risikomanagement-Praktiken bei. Fokussiere auf Konsistenz.'
              }
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskManagementPanel;