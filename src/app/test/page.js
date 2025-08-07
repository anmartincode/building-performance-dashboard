'use client';

import dynamic from 'next/dynamic';

const WebSocketTest = dynamic(() => import('@/components/WebSocketTest'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '50vh',
      fontSize: '1.2rem',
      color: '#666'
    }}>
      Loading WebSocket Test...
    </div>
  )
});

export default function TestPage() {
  return <WebSocketTest />;
} 