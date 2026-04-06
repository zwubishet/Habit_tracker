import React, { useState } from 'react';

const Habits = () => {
  const [habits, setHabits] = useState([
    { id: 1, name: 'Drink 2L Water', completed: false },
    { id: 2, name: 'Morning Meditation', completed: true },
  ]);

  const toggleHabit = (id) => {
    setHabits(habits.map(h => 
      h.id === id ? { ...h, completed: !h.completed } : h
    ));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>My Daily Habits</h2>
      <div style={{ marginTop: '20px' }}>
        {habits.map(habit => (
          <div key={habit.id} style={{
            display: 'flex', 
            alignItems: 'center', 
            padding: '12px', 
            borderBottom: '1px solid #eee'
          }}>
            <input 
              type="checkbox" 
              checked={habit.completed} 
              onChange={() => toggleHabit(habit.id)}
              style={{ marginRight: '15px', transform: 'scale(1.2)' }}
            />
            <span style={{ textDecoration: habit.completed ? 'line-through' : 'none', color: habit.completed ? '#888' : '#333' }}>
              {habit.name}
            </span>
          </div>
        ))}
      </div>
      <button style={{ marginTop: '20px', padding: '10px 15px', borderRadius: '8px', background: '#0070f3', color: 'white', border: 'none' }}>
        + Add New Habit
      </button>
    </div>
  );
};

export default Habits;