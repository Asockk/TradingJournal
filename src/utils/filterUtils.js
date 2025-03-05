/**
 * Filter trades based on filter criteria
 * @param {Array} trades - Array of trade objects to filter
 * @param {Object} filters - Filter criteria
 * @returns {Array} - Filtered trades
 */
export const filterTrades = (trades, filters) => {
  return trades.filter(trade => {
    // Asset filter (case-insensitive substring match)
    const assetMatch = !filters.asset || 
      trade.asset.toLowerCase().includes(filters.asset.toLowerCase());
    
    // Position filter (exact match)
    const positionMatch = !filters.position || 
      trade.position === filters.position;
    
    // Asset class filter (exact match)
    const assetClassMatch = !filters.assetClass || 
      trade.assetClass === filters.assetClass;
    
    // Date range filters
    const dateFromMatch = !filters.dateFrom || 
      new Date(trade.entryDate) >= new Date(filters.dateFrom);
    const dateToMatch = !filters.dateTo || 
      new Date(trade.entryDate) <= new Date(filters.dateTo);
    
    // Conviction range filter
    const convictionMatch = 
      parseInt(trade.conviction) >= filters.minConviction && 
      parseInt(trade.conviction) <= filters.maxConviction;
    
    // Profit/Loss filters
    const profitMatch = !filters.profitOnly || 
      (trade.pnl && parseFloat(trade.pnl) > 0);
    const lossMatch = !filters.lossOnly || 
      (trade.pnl && parseFloat(trade.pnl) < 0);
      
    // Alpha Trader: Trade-Typ Filter
    const tradeTypeMatch = !filters.tradeType || 
      trade.tradeType === filters.tradeType;
      
    // Alpha Trader: Marktbedingung Filter
    const marketConditionMatch = !filters.marketCondition || 
      trade.marketCondition === filters.marketCondition;
      
    // Alpha Trader: Plan befolgt Filter
    const followedPlanMatch = !filters.followedPlan || 
      (filters.followedPlan === 'true' ? trade.followedPlan === true : 
       filters.followedPlan === 'false' ? trade.followedPlan === false : true);
    
    return assetMatch && positionMatch && assetClassMatch && 
           dateFromMatch && dateToMatch && convictionMatch &&
           profitMatch && lossMatch && tradeTypeMatch && 
           marketConditionMatch && followedPlanMatch;
  });
};