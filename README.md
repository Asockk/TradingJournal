# Trading Journal

A modern, secure and minimalist web application for tracking and analyzing your trading activities. Built with React and TailwindCSS, this trading journal focuses on helping traders log, analyze, and improve their trading performance through detailed metrics and visualizations.

## Features

### 📝 Comprehensive Trade Logging
- Capture detailed entry and exit information
- Track position sizes, leverage, and conviction levels
- Document your rationale and post-trade notes
- Support for various asset classes (Crypto, Stocks, Forex, Commodities)

### 📊 Advanced Analytics
- Win rate calculation and visualization
- Risk/reward ratio analysis
- Drawdown tracking
- Asset-specific performance metrics
- Equity curve visualization

### 🔍 Powerful Filtering
- Filter trades by asset, type, date range, and more
- Focus on winning or losing trades
- Analyze performance by conviction level

### 💾 Data Management
- Import and export data as CSV
- All data stored locally for maximum privacy
- No external servers or cloud storage

### 📱 Responsive Design
- Fully responsive layout that works on all devices
- Modern, clean interface built with TailwindCSS
- Optimized for both desktop and mobile use

## Technology Stack

- **Frontend**: React, TailwindCSS
- **Data Visualization**: Recharts
- **Data Processing**: PapaParse (CSV), Lodash
- **Icons**: Lucide React
- **Storage**: Local browser storage (no backend required)

## Project Structure

```
src/
├── components/
│   ├── charts/
│   │   ├── AssetPerformanceChart.jsx
│   │   └── EquityChart.jsx
│   ├── stats/
│   │   ├── AssetPerformanceTable.jsx
│   │   └── StatisticsCards.jsx
│   ├── FilterPanel.jsx
│   ├── Header.jsx
│   ├── StatisticsPanel.jsx
│   ├── TradeForm.jsx
│   └── TradeTable.jsx
├── utils/
│   ├── calculations.js
│   ├── constants.js
│   ├── csvUtils.js
│   ├── filterUtils.js
│   ├── statsCalculations.js
│   ├── storageUtils.js
│   └── styleUtils.js
├── App.js
└── index.js
```

## Getting Started

### Prerequisites

- Node.js (v14 or later recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/trading-journal.git
   cd trading-journal
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
# or
yarn build
```

The build files will be created in the `build/` directory.

## Usage Guide

### Adding Your First Trade

1. Click the "New Trade" button
2. Fill in the entry details section (required fields are marked)
3. Add your initial risk/reward assessment and rationale
4. If the trade is complete, fill in the exit details
5. Click "Save" to add the trade to your journal

### Importing Existing Trades

1. Prepare a CSV file with your trade data
   - The CSV should include columns that match the application's fields
   - At minimum, include: asset, entryDate, entryPrice, position, and positionSize
2. Click the import icon in the header
3. Select your CSV file
4. Verify your trades appear in the table

### Analyzing Your Performance

1. Navigate to the "Statistics" tab
2. View your overall metrics in the KPI cards
3. Analyze the equity curve to see your performance over time
4. Check the asset performance chart to identify your strongest assets
5. Use the details table to see per-asset statistics

### Filtering Trades

1. Click the "Filter" button
2. Select your desired filter criteria
3. The trade table will update to show only matching trades
4. Statistics will also update to reflect only the filtered trades
5. Click "Reset Filters" to return to viewing all trades

## Security and Privacy

This application stores all data locally in your browser's localStorage. No data is sent to any external servers or stored in the cloud. This design provides several benefits:

- Complete privacy - your trading data never leaves your device
- No internet connection required after initial loading
- No account creation or login needed
- Easy to backup data via the export function

To back up your data, simply use the export function regularly and store the CSV files securely.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

---

**Disclaimer**: This application is intended for personal trade tracking and analysis only. It is not financial advice, and the developers are not responsible for any trading losses incurred while using this tool.