import React from 'react';

const Analytics = () => {
  // Mock data for visualization
  const stats = [
    { label: 'Weekly Completion', value: '84%' },
    { label: 'Current Streak', value: '12 Days' },
    { label: 'Best Streak', value: '25 Days' }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Performance Analytics</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1-1-1', gap: '20px', marginTop: '20px' }}>
        {stats.map(stat => (
          <div key={stat.label} style={{ padding: '20px', background: '#f9f9f9', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '5px' }}>{stat.label}</p>
            <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0070f3' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '40px' }}>
        <h3>Activity Heatmap</h3>
        <div style={{ height: '150px', background: '#eee', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
          [Chart Visualization Placeholder]
        </div>
      </div>
    </div>
  );
};

export default Analytics;