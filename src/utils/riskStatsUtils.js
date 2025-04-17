// src/utils/riskStatsUtils.js
/**
 * Calculate risk-reward ratio comparison between expected and actual
 * @param {Array} trades - Array of trade objects
 * @returns {Object} - Comparison data
 */
export const calculateRiskRewardComparison = (trades) => {
  // Filter trades with both expected and actual RR data
  const tradesWithRR = trades.filter(trade => 
    trade.entryRiskReward && 
    trade.actualRiskReward && 
    !isNaN(parseFloat(trade.entryRiskReward)) && 
    !isNaN(parseFloat(trade.actualRiskReward))
  );
  
  if (tradesWithRR.length === 0) {
    return null;
  }
  
  // Calculate averages
  const avgExpectedRR = tradesWithRR.reduce((sum, trade) => 
    sum + parseFloat(trade.entryRiskReward), 0) / tradesWithRR.length;
    
  const avgActualRR = tradesWithRR.reduce((sum, trade) => 
    sum + parseFloat(trade.actualRiskReward), 0) / tradesWithRR.length;
  
  // Categorize trades
  const categories = {
    betterThanExpected: [],
    asExpected: [],
    worseThanExpected: [],
    stoppedOut: [] // Trades where stop loss was hit
  };
  
  tradesWithRR.forEach(trade => {
    const expectedRR = parseFloat(trade.entryRiskReward);
    const actualRR = parseFloat(trade.actualRiskReward);
    const pnl = parseFloat(trade.pnl || 0);
    
    // Create a simplified trade object for analysis
    const tradeData = {
      id: trade.id,
      asset: trade.asset,
      expectedRR,
      actualRR,
      difference: actualRR - expectedRR,
      pnl
    };
    
    // Categorize the trade
    if (pnl < 0 && actualRR <= -0.8) {
      // Stop loss was likely hit (80% or more of risk was realized)
      categories.stoppedOut.push(tradeData);
    } else if (Math.abs(actualRR - expectedRR) <= 0.2) {
      // Within 20% of expected (close enough to "as expected")
      categories.asExpected.push(tradeData);
    } else if (actualRR > expectedRR) {
      // Better than expected
      categories.betterThanExpected.push(tradeData);
    } else {
      // Worse than expected
      categories.worseThanExpected.push(tradeData);
    }
  });
  
  // Create distribution data for chart
  const totalTrades = tradesWithRR.length;
  const distribution = [
    {
      category: 'Besser als erwartet',
      count: categories.betterThanExpected.length,
      percentage: (categories.betterThanExpected.length / totalTrades) * 100,
      avgExpected: categories.betterThanExpected.length > 0 
        ? categories.betterThanExpected.reduce((sum, t) => sum + t.expectedRR, 0) / categories.betterThanExpected.length 
        : 0,
      avgActual: categories.betterThanExpected.length > 0 
        ? categories.betterThanExpected.reduce((sum, t) => sum + t.actualRR, 0) / categories.betterThanExpected.length 
        : 0,
      averageDifference: categories.betterThanExpected.length > 0 
        ? categories.betterThanExpected.reduce((sum, t) => sum + t.difference, 0) / categories.betterThanExpected.length 
        : 0
    },
    {
      category: 'Wie erwartet',
      count: categories.asExpected.length,
      percentage: (categories.asExpected.length / totalTrades) * 100,
      avgExpected: categories.asExpected.length > 0 
        ? categories.asExpected.reduce((sum, t) => sum + t.expectedRR, 0) / categories.asExpected.length 
        : 0,
      avgActual: categories.asExpected.length > 0 
        ? categories.asExpected.reduce((sum, t) => sum + t.actualRR, 0) / categories.asExpected.length 
        : 0,
      averageDifference: categories.asExpected.length > 0 
        ? categories.asExpected.reduce((sum, t) => sum + t.difference, 0) / categories.asExpected.length 
        : 0
    },
    {
      category: 'Schlechter als erwartet',
      count: categories.worseThanExpected.length,
      percentage: (categories.worseThanExpected.length / totalTrades) * 100,
      avgExpected: categories.worseThanExpected.length > 0 
        ? categories.worseThanExpected.reduce((sum, t) => sum + t.expectedRR, 0) / categories.worseThanExpected.length 
        : 0,
      avgActual: categories.worseThanExpected.length > 0 
        ? categories.worseThanExpected.reduce((sum, t) => sum + t.actualRR, 0) / categories.worseThanExpected.length 
        : 0,
      averageDifference: categories.worseThanExpected.length > 0 
        ? categories.worseThanExpected.reduce((sum, t) => sum + t.difference, 0) / categories.worseThanExpected.length 
        : 0
    },
    {
      category: 'Stop Loss gerissen',
      count: categories.stoppedOut.length,
      percentage: (categories.stoppedOut.length / totalTrades) * 100,
      avgExpected: categories.stoppedOut.length > 0 
        ? categories.stoppedOut.reduce((sum, t) => sum + t.expectedRR, 0) / categories.stoppedOut.length 
        : 0,
      avgActual: categories.stoppedOut.length > 0 
        ? categories.stoppedOut.reduce((sum, t) => sum + t.actualRR, 0) / categories.stoppedOut.length 
        : 0,
      averageDifference: categories.stoppedOut.length > 0 
        ? categories.stoppedOut.reduce((sum, t) => sum + t.difference, 0) / categories.stoppedOut.length 
        : 0
    }
  ];
  
  return {
    distribution,
    averages: {
      expectedRR: avgExpectedRR,
      actualRR: avgActualRR
    },
    categories: {
      betterCount: categories.betterThanExpected.length,
      asExpectedCount: categories.asExpected.length,
      worseCount: categories.worseThanExpected.length,
      stoppedOutCount: categories.stoppedOut.length,
      betterPercentage: (categories.betterThanExpected.length / totalTrades) * 100,
      asExpectedPercentage: (categories.asExpected.length / totalTrades) * 100,
      worsePercentage: (categories.worseThanExpected.length / totalTrades) * 100,
      stoppedOutPercentage: (categories.stoppedOut.length / totalTrades) * 100
    }
  };
};

/**
 * Calculate stop loss adherence statistics
 * @param {Array} trades - Array of trade objects
 * @returns {Object} - Adherence data
 */
export const calculateStopLossAdherence = (trades) => {
  // Filter trades with defined stop loss and exit price
  const tradesWithStopLoss = trades.filter(trade => 
    trade.stopLoss && 
    trade.exitPrice && 
    !isNaN(parseFloat(trade.stopLoss)) && 
    !isNaN(parseFloat(trade.exitPrice))
  );
  
  if (tradesWithStopLoss.length === 0) {
    return null;
  }
  
  // Categorize trades
  const categories = {
    respected: [], // Exit at or near stop loss
    partiallyRespected: [], // Exit worse than stop loss but not drastically
    ignored: [] // Exit significantly worse than stop loss
  };
  
  tradesWithStopLoss.forEach(trade => {
    const stopLoss = parseFloat(trade.stopLoss);
    const entryPrice = parseFloat(trade.entryPrice);
    const exitPrice = parseFloat(trade.exitPrice);
    const pnl = parseFloat(trade.pnl || 0);
    const position = trade.position; // Long or Short
    
    // Only analyze losing trades (winning trades don't hit stop losses)
    if (pnl >= 0) return;
    
    // Calculate how close the exit was to the stop loss
    // For long positions: stop loss is below entry
    // For short positions: stop loss is above entry
    const stopDistance = position === 'Long' 
      ? Math.abs(entryPrice - stopLoss) 
      : Math.abs(stopLoss - entryPrice);
    
    const exitDistance = position === 'Long' 
      ? Math.abs(entryPrice - exitPrice) 
      : Math.abs(exitPrice - entryPrice);
    
    const adherenceRatio = stopDistance > 0 ? exitDistance / stopDistance : 0;
    
    const tradeData = {
      id: trade.id,
      asset: trade.asset,
      position,
      entryPrice,
      stopLoss,
      exitPrice,
      pnl,
      adherenceRatio
    };
    
    // Categorize based on how close the exit was to the stop loss
    if (adherenceRatio <= 1.1) { // Within 10% of stop
      categories.respected.push(tradeData);
    } else if (adherenceRatio <= 1.5) { // Within 50% of stop
      categories.partiallyRespected.push(tradeData);
    } else {
      categories.ignored.push(tradeData);
    }
  });
  
  // Count losing trades with stop loss
  const losingTrades = tradesWithStopLoss.filter(trade => parseFloat(trade.pnl || 0) < 0);
  
  // Create data for pie chart
  const totalLosingTrades = losingTrades.length;
  const data = [
    {
      name: 'Respektiert',
      value: categories.respected.length,
      percentage: (categories.respected.length / totalLosingTrades) * 100,
      description: 'Stop Loss wurde eingehalten oder nahezu eingehalten'
    },
    {
      name: 'Teilweise respektiert',
      value: categories.partiallyRespected.length,
      percentage: (categories.partiallyRespected.length / totalLosingTrades) * 100,
      description: 'Exit schlechter als Stop Loss, aber noch akzeptabel'
    },
    {
      name: 'Ignoriert',
      value: categories.ignored.length,
      percentage: (categories.ignored.length / totalLosingTrades) * 100,
      description: 'Stop Loss deutlich überschritten'
    }
  ];
  
  // Generate insights
  let mainInsight = '';
  let description = `Von ${totalLosingTrades} verlustbringenden Trades wurden ${categories.respected.length} (${(categories.respected.length / totalLosingTrades * 100).toFixed(1)}%) mit eingehaltenem Stop Loss beendet.`;
  
  if (categories.ignored.length > 0.3 * totalLosingTrades) {
    mainInsight = 'Deine Stop Losses werden häufig ignoriert, was zu größeren Verlusten führen kann. Überlege, eine automatisierte Stop Loss-Strategie zu implementieren oder deine psychologische Disziplin zu verbessern.';
  } else if (categories.respected.length > 0.7 * totalLosingTrades) {
    mainInsight = 'Du hältst deine Stop Losses gut ein, was auf eine starke Risikodisziplin hindeutet. Fokussiere dich nun darauf, deine Gewinner länger laufen zu lassen.';
  } else {
    mainInsight = 'Verbessere deine Stop Loss-Disziplin, indem du klare Regeln für das Auslösen von Stops definierst und stets einhältst.';
  }
  
  return {
    data,
    insights: {
      respectedPercentage: (categories.respected.length / totalLosingTrades) * 100,
      partialPercentage: (categories.partiallyRespected.length / totalLosingTrades) * 100,
      ignoredPercentage: (categories.ignored.length / totalLosingTrades) * 100,
      description,
      mainInsight
    }
  };
};

/**
 * Calculate drawdown analysis
 * @param {Array} trades - Array of trade objects sorted by date
 * @returns {Object} - Drawdown analysis data
 */
export const calculateDrawdownAnalysis = (trades) => {
  if (!trades.length) return null;
  
  // Sort trades by date
  const sortedTrades = [...trades].sort((a, b) => 
    new Date(a.entryDate) - new Date(b.entryDate)
  );
  
  // Create equity curve
  const equityCurve = [];
  let runningTotal = 0;
  let peakValue = 0;
  let inDrawdown = false;
  let currentDrawdown = null;
  const drawdowns = [];
  
  sortedTrades.forEach((trade, index) => {
    const pnl = parseFloat(trade.pnl || 0);
    const date = trade.exitDate || trade.entryDate;
    runningTotal += pnl;
    
    equityCurve.push({
      date,
      value: runningTotal,
      trade: trade.asset,
      pnl
    });
    
    // Track drawdowns
    if (runningTotal > peakValue) {
      // New equity peak
      peakValue = runningTotal;
      
      // If we were in a drawdown, it's now over
      if (inDrawdown) {
        currentDrawdown.endDate = date;
        currentDrawdown.endValue = runningTotal;
        currentDrawdown.recoveryDays = calculateDaysBetween(
          currentDrawdown.lowestPointDate, 
          date
        );
        currentDrawdown.totalDays = calculateDaysBetween(
          currentDrawdown.startDate, 
          date
        );
        
        drawdowns.push(currentDrawdown);
        inDrawdown = false;
        currentDrawdown = null;
      }
    } else if (runningTotal < peakValue) {
      const drawdownAmount = peakValue - runningTotal;
      const drawdownPercentage = (drawdownAmount / peakValue) * 100;
      
      if (!inDrawdown) {
        // Start of a new drawdown
        inDrawdown = true;
        currentDrawdown = {
          startDate: date,
          startValue: runningTotal,
          peakValue,
          lowestPointDate: date,
          lowestValue: runningTotal,
          depth: drawdownAmount,
          depthPercentage: drawdownPercentage,
          durationDays: 0,
          recoveryDays: 0,
          totalDays: 0
        };
      } else {
        // Update current drawdown if this is a new low
        if (runningTotal < currentDrawdown.lowestValue) {
          currentDrawdown.lowestValue = runningTotal;
          currentDrawdown.lowestPointDate = date;
          currentDrawdown.depth = peakValue - runningTotal;
          currentDrawdown.depthPercentage = (currentDrawdown.depth / peakValue) * 100;
        }
        
        // Update duration
        currentDrawdown.durationDays = calculateDaysBetween(
          currentDrawdown.startDate, 
          date
        );
      }
    }
  });
  
  // If we're still in a drawdown at the end, add it
  if (inDrawdown) {
    currentDrawdown.endDate = null; // Still ongoing
    currentDrawdown.endValue = runningTotal;
    currentDrawdown.totalDays = calculateDaysBetween(
      currentDrawdown.startDate, 
      sortedTrades[sortedTrades.length - 1].exitDate || sortedTrades[sortedTrades.length - 1].entryDate
    );
    
    drawdowns.push(currentDrawdown);
  }
  
  // Calculate aggregate statistics
  const maxDrawdown = drawdowns.reduce((max, dd) => 
    dd.depthPercentage > max.depthPercentage ? dd : max, 
    { depthPercentage: 0 }
  );
  
  const totalDepthPercentage = drawdowns.reduce((sum, dd) => sum + dd.depthPercentage, 0);
  const avgDrawdownPercentage = drawdowns.length > 0 ? totalDepthPercentage / drawdowns.length : 0;
  
  const totalDuration = drawdowns.reduce((sum, dd) => sum + dd.durationDays, 0);
  const avgDrawdownDuration = drawdowns.length > 0 ? totalDuration / drawdowns.length : 0;
  
  const completedDrawdowns = drawdowns.filter(dd => dd.endDate);
  const totalRecoveryDays = completedDrawdowns.reduce((sum, dd) => sum + dd.recoveryDays, 0);
  const avgRecoveryDays = completedDrawdowns.length > 0 ? totalRecoveryDays / completedDrawdowns.length : 0;
  
  // Generate insights summary
  let summary = '';
  if (drawdowns.length === 0) {
    summary = 'Keine Drawdowns in diesem Zeitraum.';
  } else {
    summary = `Du hattest ${drawdowns.length} Drawdowns mit einer durchschnittlichen Tiefe von ${avgDrawdownPercentage.toFixed(1)}% und einer durchschnittlichen Dauer von ${Math.round(avgDrawdownDuration)} Tagen. Die durchschnittliche Erholungszeit beträgt ${Math.round(avgRecoveryDays)} Tage.`;
    
    if (maxDrawdown.depthPercentage > 20) {
      summary += ' Dein maximaler Drawdown ist signifikant. Überlege, dein Risikomanagement zu überprüfen.';
    }
  }
  
  return {
    equityCurve,
    drawdowns,
    insights: {
      maxDrawdownPercentage: maxDrawdown.depthPercentage,
      maxDrawdownDuration: maxDrawdown.durationDays,
      maxDrawdownRecovery: maxDrawdown.recoveryDays,
      avgDrawdownPercentage,
      avgDrawdownDuration: Math.round(avgDrawdownDuration),
      avgRecoveryDays: Math.round(avgRecoveryDays),
      summary
    }
  };
};

/**
 * Calculate days between two dates
 * @param {string} startDate - Start date string
 * @param {string} endDate - End date string
 * @returns {number} - Number of days
 */
const calculateDaysBetween = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};