// Export all chart components with React.memo for performance optimization
import React from 'react';

// Import all chart components
import EquityChartBase from './EquityChart';
import AssetPerformanceChartBase from './AssetPerformanceChart';
import ConvictionPerformanceChartBase from './ConvictionPerformanceChart';
import DurationPerformanceChartBase from './DurationPerformanceChart';
import EmotionAnalysisPanelBase from './EmotionAnalysisPanel';
import EmotionPerformanceChartBase from './EmotionPerformanceChart';
import EmotionTransitionChartBase from './EmotionTransitionChart';
import HourlyPerformanceHeatmapBase from './HourlyPerformanceHeatmap';
import PlanFollowedChartBase from './PlanFollowedChart';
import TradeTypePerformanceChartBase from './TradeTypePerformanceChart';
import WeekdayPerformanceChartBase from './WeekdayPerformanceChart';
import StopLossAdherenceChartBase from './StopLossAdherenceChart';
import DrawdownAnalysisChartBase from './DrawdownAnalysisChart';
import RiskRewardComparisonChartBase from './RiskRewardComparisonChart';
import ExpectedValuePerformanceChartBase from './ExpectedValuePerformanceChart';

// Export memoized versions
export const EquityChart = React.memo(EquityChartBase);
export const AssetPerformanceChart = React.memo(AssetPerformanceChartBase);
export const ConvictionPerformanceChart = React.memo(ConvictionPerformanceChartBase);
export const DurationPerformanceChart = React.memo(DurationPerformanceChartBase);
export const EmotionAnalysisPanel = React.memo(EmotionAnalysisPanelBase);
export const EmotionPerformanceChart = React.memo(EmotionPerformanceChartBase);
export const EmotionTransitionChart = React.memo(EmotionTransitionChartBase);
export const HourlyPerformanceHeatmap = React.memo(HourlyPerformanceHeatmapBase);
export const PlanFollowedChart = React.memo(PlanFollowedChartBase);
export const TradeTypePerformanceChart = React.memo(TradeTypePerformanceChartBase);
export const WeekdayPerformanceChart = React.memo(WeekdayPerformanceChartBase);
export const StopLossAdherenceChart = React.memo(StopLossAdherenceChartBase);
export const DrawdownAnalysisChart = React.memo(DrawdownAnalysisChartBase);
export const RiskRewardComparisonChart = React.memo(RiskRewardComparisonChartBase);
export const ExpectedValuePerformanceChart = React.memo(ExpectedValuePerformanceChartBase);