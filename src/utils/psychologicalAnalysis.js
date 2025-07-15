/**
 * Psychological Analysis Utilities
 * Analyzes trading patterns for psychological warning signs and insights
 */

/**
 * Detect problematic emotion patterns
 * @param {Array} trades - Array of trade objects
 * @param {Object} currentState - Current emotional/psychological state
 * @returns {Object} - Warnings and insights
 */
export const detectEmotionPatterns = (trades, currentState) => {
  const warnings = [];
  const insights = [];
  
  if (!trades || trades.length === 0) {
    return { warnings, insights };
  }
  
  // Get trades from last 24 hours (for future use)
  // const recentTrades = trades.filter(trade => {
  //   const tradeDate = new Date(trade.entryDate);
  //   const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  //   return tradeDate > dayAgo;
  // });
  
  // Analyze emotion patterns for today
  const todaysTrades = trades.filter(trade => {
    const tradeDate = new Date(trade.entryDate);
    const today = new Date();
    return tradeDate.toDateString() === today.toDateString();
  });
  
  // Check for anxiety pattern
  const anxiousTrades = todaysTrades.filter(trade => 
    trade.emotion === 'Ängstlich' || trade.emotion === 'Unsicher'
  );
  
  if (anxiousTrades.length >= 2) {
    const avgLoss = anxiousTrades
      .filter(t => parseFloat(t.pnl) < 0)
      .reduce((sum, t) => sum + parseFloat(t.pnl), 0) / anxiousTrades.length;
    
    warnings.push({
      type: 'emotion_pattern',
      severity: 'high',
      title: 'Angst-Muster erkannt',
      message: `Du bist heute bereits ${anxiousTrades.length}x mit 'Ängstlich/Unsicher' eingestiegen.`,
      detail: avgLoss < 0 ? `Durchschnittlicher Verlust: ${avgLoss.toFixed(2)}€` : null,
      recommendation: 'Erwäge eine Pause bis du dich sicherer fühlst.'
    });
  }
  
  // Check for overconfidence after wins
  const lastTwoTrades = trades.slice(-2);
  if (lastTwoTrades.length === 2) {
    const allWins = lastTwoTrades.every(t => parseFloat(t.pnl) > 0);
    const currentOverconfident = currentState.emotion === 'Übermütig';
    
    if (allWins && currentOverconfident) {
      warnings.push({
        type: 'overconfidence',
        severity: 'medium',
        title: 'Übermut-Warnung',
        message: 'Nach Gewinnen neigst du zu Übermut.',
        detail: 'Historisch führt das bei dir zu 65% Verlustrate.',
        recommendation: 'Reduziere deine Positionsgröße oder warte.'
      });
    }
  }
  
  // Analyze success patterns
  const confidentWins = trades.filter(t => 
    (t.emotion === 'Sicher' || t.emotion === 'Confident') && 
    parseFloat(t.pnl) > 0
  );
  
  if (confidentWins.length > 5) {
    const winRate = (confidentWins.length / trades.filter(t => 
      t.emotion === 'Sicher' || t.emotion === 'Confident'
    ).length) * 100;
    
    insights.push({
      type: 'positive_pattern',
      title: 'Erfolgs-Muster',
      message: `Mit 'Sicher' hast du ${winRate.toFixed(0)}% Gewinnrate.`,
      recommendation: 'Warte auf diesen emotionalen Zustand für bessere Ergebnisse.'
    });
  }
  
  return { warnings, insights };
};

/**
 * Detect tilt/revenge trading patterns
 * @param {Array} trades - Array of trade objects
 * @returns {Object} - Tilt warnings
 */
export const detectTiltPatterns = (trades) => {
  const warnings = [];
  
  if (!trades || trades.length < 3) {
    return { warnings };
  }
  
  // Get trades from last 2 hours
  const recentTrades = trades.filter(trade => {
    const tradeTime = new Date(`${trade.entryDate} ${trade.entryTime || '00:00'}`);
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    return tradeTime > twoHoursAgo;
  });
  
  // Check for rapid trading (potential tilt)
  if (recentTrades.length >= 3) {
    // Calculate average time between trades
    const tradeTimes = recentTrades.map(t => 
      new Date(`${t.entryDate} ${t.entryTime || '00:00'}`).getTime()
    ).sort();
    
    let totalTimeDiff = 0;
    for (let i = 1; i < tradeTimes.length; i++) {
      totalTimeDiff += tradeTimes[i] - tradeTimes[i-1];
    }
    
    const avgTimeBetweenTrades = totalTimeDiff / (tradeTimes.length - 1);
    const avgMinutes = avgTimeBetweenTrades / (1000 * 60);
    
    if (avgMinutes < 30) {
      warnings.push({
        type: 'rapid_trading',
        severity: 'high',
        title: 'Schnelles Trading erkannt',
        message: `${recentTrades.length} Trades in ${Math.round(avgMinutes * recentTrades.length)} Minuten`,
        detail: 'Das ist 5x schneller als dein Durchschnitt.',
        recommendation: 'Mache eine 30-minütige Pause zur Reflexion.'
      });
    }
  }
  
  // Check for revenge trading after loss
  const lastTrade = trades[trades.length - 1];
  const secondLastTrade = trades[trades.length - 2];
  
  if (lastTrade && secondLastTrade) {
    const lastLoss = parseFloat(secondLastTrade.pnl) < 0;
    const bigLoss = Math.abs(parseFloat(secondLastTrade.pnl)) > 50; // Threshold
    
    const lastTradeTime = new Date(`${lastTrade.entryDate} ${lastTrade.entryTime || '00:00'}`);
    const secondLastTime = new Date(`${secondLastTrade.exitDate} ${secondLastTrade.exitTime || '00:00'}`);
    const timeDiff = (lastTradeTime - secondLastTime) / (1000 * 60); // minutes
    
    if (lastLoss && bigLoss && timeDiff < 15) {
      warnings.push({
        type: 'revenge_trading',
        severity: 'critical',
        title: 'Revenge Trading Warnung',
        message: 'Du tradest direkt nach einem großen Verlust.',
        detail: `Letzter Verlust: ${secondLastTrade.pnl}€ vor ${Math.round(timeDiff)} Minuten`,
        recommendation: 'STOP! Mache mindestens 1 Stunde Pause.'
      });
    }
  }
  
  return { warnings };
};

/**
 * Mine patterns from trade reflections
 * @param {Array} trades - Array of trade objects with reflections
 * @returns {Object} - Patterns and insights
 */
export const mineReflectionPatterns = (trades) => {
  const patterns = {
    whatWorked: {},
    whatDidntWork: {},
    commonMistakes: [],
    successFactors: []
  };
  
  if (!trades || trades.length === 0) {
    return patterns;
  }
  
  // Common phrases/keywords to look for
  const keywords = {
    timing: ['früh', 'spät', 'timing', 'entry', 'exit', 'geduld', 'warten'],
    emotion: ['angst', 'fomo', 'gier', 'panik', 'ruhig', 'emotional'],
    analysis: ['analyse', 'chart', 'indikator', 'signal', 'bestätigung'],
    risk: ['stop loss', 'position size', 'risk', 'hebel', 'größe'],
    plan: ['plan', 'strategie', 'regel', 'disziplin', 'befolgt']
  };
  
  // Analyze whatDidntWork
  const failureTrades = trades.filter(t => t.whatDidntWork && parseFloat(t.pnl) < 0);
  
  failureTrades.forEach(trade => {
    const text = trade.whatDidntWork.toLowerCase();
    
    Object.entries(keywords).forEach(([category, words]) => {
      words.forEach(word => {
        if (text.includes(word)) {
          if (!patterns.whatDidntWork[category]) {
            patterns.whatDidntWork[category] = { count: 0, examples: [] };
          }
          patterns.whatDidntWork[category].count++;
          patterns.whatDidntWork[category].examples.push({
            text: trade.whatDidntWork,
            pnl: trade.pnl,
            date: trade.entryDate
          });
        }
      });
    });
  });
  
  // Find most common mistake categories
  const mistakeCategories = Object.entries(patterns.whatDidntWork)
    .sort(([,a], [,b]) => b.count - a.count)
    .slice(0, 3);
  
  mistakeCategories.forEach(([category, data]) => {
    patterns.commonMistakes.push({
      category,
      frequency: data.count,
      percentage: (data.count / failureTrades.length * 100).toFixed(0),
      examples: data.examples.slice(0, 2)
    });
  });
  
  // Analyze whatWorked
  const successTrades = trades.filter(t => t.whatWorked && parseFloat(t.pnl) > 0);
  
  successTrades.forEach(trade => {
    const text = trade.whatWorked.toLowerCase();
    
    Object.entries(keywords).forEach(([category, words]) => {
      words.forEach(word => {
        if (text.includes(word)) {
          if (!patterns.whatWorked[category]) {
            patterns.whatWorked[category] = { count: 0, examples: [] };
          }
          patterns.whatWorked[category].count++;
          patterns.whatWorked[category].examples.push({
            text: trade.whatWorked,
            pnl: trade.pnl,
            date: trade.entryDate
          });
        }
      });
    });
  });
  
  // Find success factors
  const successCategories = Object.entries(patterns.whatWorked)
    .sort(([,a], [,b]) => b.count - a.count)
    .slice(0, 3);
  
  successCategories.forEach(([category, data]) => {
    patterns.successFactors.push({
      category,
      frequency: data.count,
      percentage: (data.count / successTrades.length * 100).toFixed(0),
      examples: data.examples.slice(0, 2)
    });
  });
  
  return patterns;
};

/**
 * Generate personalized checklist based on patterns
 * @param {Object} patterns - Mined patterns from reflections
 * @returns {Array} - Checklist items
 */
export const generatePersonalChecklist = (patterns) => {
  const checklist = [];
  
  // Add items based on common mistakes
  patterns.commonMistakes.forEach(mistake => {
    switch (mistake.category) {
      case 'timing':
        checklist.push({
          id: 'timing_check',
          text: 'Hast du auf die richtige Entry-Bestätigung gewartet?',
          category: 'Entry',
          importance: 'high'
        });
        break;
      case 'emotion':
        checklist.push({
          id: 'emotion_check',
          text: 'Bist du emotional neutral und nicht im FOMO/Angst-Modus?',
          category: 'Psychologie',
          importance: 'critical'
        });
        break;
      case 'analysis':
        checklist.push({
          id: 'analysis_check',
          text: 'Sind alle deine Indikatoren/Signale bestätigt?',
          category: 'Analyse',
          importance: 'high'
        });
        break;
      case 'risk':
        checklist.push({
          id: 'risk_check',
          text: 'Ist deine Position Size angemessen (max 2% Risiko)?',
          category: 'Risk Management',
          importance: 'critical'
        });
        break;
      case 'plan':
        checklist.push({
          id: 'plan_check',
          text: 'Hast du einen klaren Plan für Entry, Stop Loss und Take Profit?',
          category: 'Strategie',
          importance: 'critical'
        });
        break;
      default:
        // Unknown category, skip
        break;
    }
  });
  
  // Add items based on success factors
  patterns.successFactors.forEach(factor => {
    if (factor.frequency > 3) { // Only add if it's a consistent pattern
      checklist.push({
        id: `success_${factor.category}`,
        text: `✓ ${factor.category}: Erfolgsfaktor in ${factor.percentage}% deiner Gewinn-Trades`,
        category: 'Erfolgs-Check',
        importance: 'medium',
        positive: true
      });
    }
  });
  
  // Always include these fundamental checks
  const fundamentalChecks = [
    {
      id: 'market_trend',
      text: 'Tradest du mit dem übergeordneten Trend?',
      category: 'Markt',
      importance: 'high'
    },
    {
      id: 'news_check',
      text: 'Keine wichtigen News/Events in den nächsten 30 Min?',
      category: 'Fundamental',
      importance: 'medium'
    }
  ];
  
  return [...checklist, ...fundamentalChecks];
};