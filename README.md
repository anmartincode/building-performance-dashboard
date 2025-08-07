# Building Performance Dashboard

An AI-Powered Building Management Dashboard built with **Next.js** and **Material UI**.

## 🚀 Features

- **Real-time Building Monitoring**: Track energy consumption, HVAC efficiency, lighting, and occupancy across multiple buildings
- **AI-Powered Anomaly Detection**: Advanced machine learning algorithms detect unusual patterns in building data
- **Predictive Analytics**: LSTM-based forecasting for energy consumption and system performance
- **Interactive Building Layout**: Visual representation of building locations with anomaly indicators
- **Comprehensive Reporting**: Export detailed performance reports to Excel
- **Responsive Design**: Modern Material UI interface that works on all devices
- **Real-time Notifications**: Configurable alerts for critical events

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18
- **UI Framework**: Material UI (MUI) v5
- **Charts**: Recharts
- **Data Processing**: Advanced ML models (LSTM, Random Forest, K-means clustering)
- **Export**: XLSX for Excel report generation
- **Icons**: Material Icons and Lucide React

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd building-performance-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.js          # Root layout with Material UI theme
│   └── page.js            # Main dashboard page
├── components/            # React components
│   └── BuildingDashboard.js  # Main dashboard component
├── utils/                 # Utility functions
│   └── api.js            # API service functions
└── styles/               # Global styles (if needed)
```

## 🎯 Key Components

### BuildingDashboard
The main dashboard component featuring:
- **Stats Cards**: Real-time metrics for energy, HVAC, lighting, and occupancy
- **Interactive Charts**: Line charts for performance trends and pie charts for energy distribution
- **Anomaly Detection**: Visual indicators for detected issues with severity levels
- **Building Layout**: Interactive map showing building locations and anomaly status
- **Settings Panel**: Configurable thresholds and notification preferences

### Material UI Integration
- **Theme Provider**: Custom Material UI theme with building-specific color palette
- **Responsive Grid**: Adaptive layout that works on desktop, tablet, and mobile
- **Modern Components**: Cards, dialogs, snackbars, and form controls
- **Icon Integration**: Material Icons for consistent visual language

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ENABLE_SYNTHETIC_DATA=true
```

### Building Configuration
Modify building settings in `src/components/BuildingDashboard.js`:

```javascript
const buildingMapping = {
  'building_a': 'Building A',
  'building_b': 'Building B', 
  'building_c': 'Building C',
  'building_d': 'Building D'
};
```

## 📊 Data Sources

The dashboard supports multiple data sources:

1. **Real API Integration**: Connect to your building management system APIs
2. **Synthetic Data**: Built-in data generation for testing and demonstration
3. **CSV Import**: Upload historical data files
4. **Real-time Sensors**: IoT device integration

## 🤖 AI Features

### Anomaly Detection
- **Energy Spikes**: Detect unusual energy consumption patterns
- **Temperature Anomalies**: Identify HVAC system issues
- **Occupancy Patterns**: Monitor unusual building usage

### Predictive Analytics
- **LSTM Forecasting**: 7-day energy consumption predictions
- **Trend Analysis**: Identify long-term performance patterns
- **Confidence Scoring**: Measure prediction reliability

### Clustering Analysis
- **K-means Clustering**: Group similar building performance patterns
- **Pattern Recognition**: Identify operational modes
- **Optimization Insights**: Suggest efficiency improvements

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:
- **Desktop**: Full-featured interface with all charts and controls
- **Tablet**: Adaptive layout with touch-friendly controls
- **Mobile**: Streamlined interface with essential features

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- Docker containers

## 🔒 Security

- **Client-side Only**: No sensitive data stored on the server
- **API Security**: Secure API endpoints with authentication
- **Data Privacy**: Local data processing for sensitive information

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the component examples in `/src/components`

## 🔄 Migration from Bootstrap

This project has been migrated from Bootstrap to Material UI with the following improvements:

### UI Framework Changes
- **Bootstrap 5** → **Material UI v5**
- **Create React App** → **Next.js 14**
- **CDN Dependencies** → **NPM Packages**

### Component Migrations
- `btn` classes → Material UI `Button` components
- `card` classes → Material UI `Card` components
- `container` classes → Material UI `Container` components
- `row/col` classes → Material UI `Grid` system
- Bootstrap modals → Material UI `Dialog` components
- Bootstrap alerts → Material UI `Alert` components

### Benefits of Migration
- **Better Performance**: Next.js optimization and Material UI tree-shaking
- **Modern Design**: Material Design principles and consistent theming
- **Type Safety**: Better TypeScript support and component props
- **Accessibility**: Built-in ARIA support and keyboard navigation
- **Customization**: Flexible theming system with design tokens
