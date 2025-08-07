'use client';

import dynamic from 'next/dynamic';

// Dynamically import the dashboard component to avoid SSR issues with charts
const BuildingDashboard = dynamic(() => import('@/components/BuildingDashboard'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '1.2rem',
      color: '#839496' // Solarized base0 color
    }}>
      Loading Dashboard...
    </div>
  )
});

export default function Home() {
  return <BuildingDashboard />;
} 