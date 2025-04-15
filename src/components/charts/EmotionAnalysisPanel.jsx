import React from 'react';
import EmotionPerformanceChart from './EmotionPerformanceChart';
import EmotionTransitionChart from './EmotionTransitionChart';
import { Card, CardContent } from '../ui/card';
import { 
  calculatePreEmotionPerformance, 
  calculatePostEmotionPerformance,
  calculateEmotionTransitionPerformance,
  getPreEmotionInsights,
  getPostEmotionInsights,
  getEmotionTransitionInsights
} from '../../utils/emotionStatsUtils';

/**
 * Main component that combines all emotion analysis charts
 * @param {Array} trades - Array of trade objects
 */
const EmotionAnalysisPanel = ({ trades }) => {
  // Skip processing if no trades
  if (!trades || trades.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <h3 className="text-xl font-medium mb-4">Psychologische Analyse</h3>
          <p className="text-gray-500 text-center py-12">
            Keine Trades vorhanden für eine psychologische Analyse.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Calculate emotion performance data
  const preEmotionData = calculatePreEmotionPerformance(trades);
  const preEmotionInsights = getPreEmotionInsights(preEmotionData);
  
  const postEmotionData = calculatePostEmotionPerformance(trades);
  const postEmotionInsights = getPostEmotionInsights(postEmotionData);
  
  const transitionData = calculateEmotionTransitionPerformance(trades);
  const transitionInsights = getEmotionTransitionInsights(transitionData);
  
  // Check if we have enough data for analysis
  const hasPreEmotionData = preEmotionData.some(d => d.count > 0);
  const hasPostEmotionData = postEmotionData.some(d => d.count > 0);
  const hasTransitionData = transitionData.length > 0;
  
  if (!hasPreEmotionData && !hasPostEmotionData) {
    return (
      <Card>
        <CardContent className="p-4">
          <h3 className="text-xl font-medium mb-4">Psychologische Analyse</h3>
          <div className="bg-blue-50 p-4 rounded-md text-blue-800 mb-4">
            <p>Die psychologische Analyse erfordert, dass du deine emotionalen Zustände bei Trades erfasst.</p>
            <p className="mt-2">Beginne damit, bei deinen nächsten Trades die Emotionsfelder auszufüllen, um wertvolle Erkenntnisse über den Zusammenhang zwischen deinen Emotionen und deiner Trading-Performance zu gewinnen.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-xl font-medium mb-4">Psychologische Analyse</h3>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-2">
            Diese Analyse zeigt den Zusammenhang zwischen deinen emotionalen Zuständen und deiner Trading-Performance. 
            Erkenne Muster, in denen bestimmte Gefühle mit besseren oder schlechteren Ergebnissen korrelieren.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {hasPreEmotionData && (
            <EmotionPerformanceChart 
              emotionData={preEmotionData} 
              insights={preEmotionInsights}
              title="Performance nach emotionalem Zustand vor dem Trade"
              isPreEmotion={true}
            />
          )}
          
          {hasPostEmotionData && (
            <EmotionPerformanceChart 
              emotionData={postEmotionData} 
              insights={postEmotionInsights}
              title="Performance nach emotionalem Zustand nach dem Trade"
              isPreEmotion={false}
            />
          )}
        </div>
        
        {hasTransitionData && (
          <EmotionTransitionChart 
            transitionData={transitionData}
            insights={transitionInsights}
          />
        )}
        
        <div className="mt-4 p-4 bg-gray-50 rounded-md text-sm text-gray-600">
          <h4 className="font-medium mb-2">Wie nutzt du diese Analyse?</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Identifiziere emotionale Zustände, in denen du besonders gut oder schlecht tradest</li>
            <li>Erkenne, ob bestimmte emotionale Veränderungen während eines Trades mit besseren Ergebnissen korrelieren</li>
            <li>Verwende diese Informationen, um deine Selbstwahrnehmung zu verbessern und dein Trading zu stabilisieren</li>
            <li>Überlege, ob du in bestimmten emotionalen Zuständen besser keine Trades eröffnen solltest</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionAnalysisPanel;