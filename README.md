# YunoAlertas

YunoAlertas is a comprehensive monitoring and analytics dashboard designed to track payment processing health, detect anomalies, and manage incidents in real-time. It provides actionable insights into provider performance, merchant status, and transaction trends.

## 🚀 Features

### 📊 Analytics Dashboard
- **Real-time Metrics**: Track total providers, critical error rates, and transaction volumes.
- **Interactive Charts**: Visualize error rate trends and transaction volumes over time.
- **Detailed Status Tables**: Monitor individual provider and merchant performance with color-coded severity badges.
- **Filtering**: Filter data by country (MX, BR, CO, US) and time window (24h, 48h, 7d).
- **Auto-Refresh**: Data automatically updates every 60 seconds.

### 🚨 Alerts Management
- **Centralized Alerts Feed**: View and manage system alerts with severity levels (Critical, High, Medium, Low).
- **AI-Powered Analysis**: Detailed alert insights including:
  - Root Cause Hypothesis
  - Impact Summary
  - Recommended Actions
  - Estimated Resolution Time
- **Status Workflow**: Track alerts through Active, Investigating, and Resolved states.

### 🔍 Anomalies & Incidents
- **Anomaly Detection**: Identify unusual patterns in transaction flows.
- **Incident Tracking**: Manage confirmed system incidents and their resolution progress.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn UI
- **State Management**: React Query (TanStack Query)
- **Visualization**: Recharts
- **Icons**: Lucide React
- **Authentication**: Clerk
- **HTTP Client**: Axios
- **Date Handling**: date-fns

## 📦 Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd YunoAlertas
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
   VITE_API_BASE_URL=http://localhost:8000/api
   VITE_API_TIMEOUT=15000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
src/
├── api/            # API client and endpoint definitions
├── components/     # Reusable UI components
│   ├── alerts/     # Alert-specific components
│   ├── dashboard/  # Dashboard widgets
│   ├── layout/     # Sidebar, Layout wrappers
│   └── ui/         # Shadcn UI primitives
├── hooks/          # Custom React hooks (useAnalytics, useAlerts)
├── lib/            # Utilities (cn, formatters)
├── pages/          # Main page views (Analytics, Alerts, etc.)
└── App.tsx         # Main application entry and routing
```

## 📜 Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the project for production
- `npm run preview`: Preview the production build locally
- `npm run lint`: Run ESLint to check for code quality issues

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
