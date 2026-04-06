import React from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, AreaChart, Area 
} from 'recharts';

const weeklyData = [
  { day: 'Mon', completion: 60 },
  { day: 'Tue', completion: 80 },
  { day: 'Wed', completion: 45 },
  { day: 'Thu', completion: 90 },
  { day: 'Fri', completion: 100 },
  { day: 'Sat', completion: 70 },
  { day: 'Sun', completion: 85 },
];

const habitComparison = [
  { name: 'Water', count: 28 },
  { name: 'Gym', count: 15 },
  { name: 'Meditation', count: 22 },
  { name: 'Reading', count: 10 },
];

const stats = [
  { label: 'Weekly Completion', value: '84%', color: '#0070f3' },
  { label: 'Current Streak', value: '12 Days', color: '#00C49F' },
  { label: 'Best Streak', value: '25 Days', color: '#FFBB28' }
];

const COLORS = ['#0070f3', '#00C49F', '#FFBB28', '#FF8042'];

const Analytics = () => {
  return (
    <div style={{ padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1a1a1a', marginBottom: '24px' }}>Performance Analytics</h2>
      
      {/* Top Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {stats.map(stat => (
          <div key={stat.label} style={{ padding: '24px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.025em', marginBottom: '8px' }}>{stat.label}</p>
            <p style={{ fontSize: '2rem', fontWeight: '800', color: stat.color, margin: 0 }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '25px', marginBottom: '25px' }}>
        
        {/* Weekly Area Chart */}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <h4 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>Weekly Trend</h4>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0070f3" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0070f3" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis hide />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Area type="monotone" dataKey="completion" stroke="#0070f3" strokeWidth={3} fillOpacity={1} fill="url(#colorComp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Comparison Bar Chart */}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <h4 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>Habit Volume</h4>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={habitComparison}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                  {habitComparison.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity Heatmap Section */}
      <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#1e293b' }}>Consistency Heatmap</h4>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {/* Generating 56 mock "days" (8 weeks) */}
          {[...Array(56)].map((_, i) => {
            const opacity = Math.random(); // Simulated data
            return (
              <div 
                key={i} 
                title={`Level: ${Math.floor(opacity * 100)}%`}
                style={{ 
                  width: '14px', 
                  height: '14px', 
                  backgroundColor: `rgba(0, 112, 243, ${opacity > 0.2 ? opacity : 0.1})`, 
                  borderRadius: '2px',
                  cursor: 'pointer'
                }} 
              />
            );
          })}
        </div>
        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#94a3b8' }}>
          <span>Less</span>
          <div style={{ width: '10px', height: '10px', backgroundColor: 'rgba(0, 112, 243, 0.1)' }}></div>
          <div style={{ width: '10px', height: '10px', backgroundColor: 'rgba(0, 112, 243, 0.5)' }}></div>
          <div style={{ width: '10px', height: '10px', backgroundColor: 'rgba(0, 112, 243, 1)' }}></div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default Analytics;