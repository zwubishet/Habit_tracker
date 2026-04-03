# Habit Tracker Application

A full-stack habit tracking web application built with React, TypeScript, Tailwind CSS, and Supabase. Track your daily habits, build streaks, and monitor your progress with beautiful visualizations.

## Features

### Authentication
- User registration with name, email, and password
- Secure login with JWT-based authentication
- Session management with automatic token refresh
- Protected routes and data access

### Habit Management
- Create habits with title, description, and frequency (daily/weekly)
- Set optional reminder times for each habit
- Update and delete habits
- View all your habits in an organized dashboard

### Habit Tracking
- Mark habits as completed for each day
- Visual calendar showing last 7 days of activity
- Prevent duplicate completions for the same day
- Track completion history over time

### Streak System
- Calculate current streak automatically
- Track longest streak achieved
- Visual streak indicators with flame icons
- Streak resets if habit is missed

### Progress Tracking
- Completion percentage for each habit
- Weekly progress statistics
- Monthly completion counts
- Total points gamification system (10 points per completion)
- Overall statistics dashboard

### User Experience
- Dark mode support with toggle
- Responsive design for mobile, tablet, and desktop
- Clean, modern UI with smooth transitions
- Loading states and error handling
- Confirmation dialogs for destructive actions

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons

### Backend
- **Supabase** (PostgreSQL database)
- **Supabase Auth** for authentication
- **Row Level Security** (RLS) for data protection

### Database Schema

#### Habits Table
- id (uuid, primary key)
- user_id (uuid, foreign key to auth.users)
- title (text)
- description (text)
- frequency (daily/weekly)
- reminder_time (time)
- created_at (timestamptz)
- updated_at (timestamptz)

#### Habit Logs Table
- id (uuid, primary key)
- habit_id (uuid, foreign key to habits)
- user_id (uuid, foreign key to auth.users)
- date (date)
- completed (boolean)
- created_at (timestamptz)
- Unique constraint on (habit_id, date)

## Project Structure

```
src/
├── components/
│   ├── HabitCard.tsx           # Individual habit card with streak and completion
│   ├── CreateHabitModal.tsx    # Modal for creating new habits
│   └── StatsOverview.tsx       # Dashboard statistics overview
├── contexts/
│   └── AuthContext.tsx         # Authentication state management
├── lib/
│   ├── supabase.ts            # Supabase client configuration
│   └── database.types.ts       # TypeScript types for database
├── pages/
│   ├── Auth.tsx               # Login/Registration page
│   └── Dashboard.tsx          # Main dashboard with habits
├── App.tsx                     # Main app component with routing
├── main.tsx                    # App entry point
└── index.css                   # Global styles and Tailwind imports
```

## Key Features Explained

### Streak Calculation
The streak calculation algorithm:
1. Sorts completion logs by date (newest first)
2. Counts consecutive days of completion
3. Resets if a day is missed
4. Tracks both current and longest streak

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Authentication required for all operations
- Secure password hashing handled by Supabase Auth

### Gamification
- Points system: 10 points per habit completion
- Visual streak indicators
- Completion percentage tracking
- Weekly and monthly statistics

### Dark Mode
- System-wide dark mode toggle
- Persistent state during session
- Tailwind dark mode classes
- Smooth transitions between themes

## Future Enhancements

Potential features to add:
- Push notifications for reminders
- Social features (share achievements)
- Custom themes and colors
- Export data to CSV/PDF
- Advanced analytics and charts
- Habit categories and tags
- Weekly/monthly goals
- Achievements and badges system
- Calendar view with monthly overview
- Habit templates library

## Development

The application is ready for development and can be extended with additional features. All core functionality is implemented and tested.

### Adding New Features

1. **Database changes**: Create new migrations using the Supabase migration tool
2. **API endpoints**: Add Edge Functions if needed for complex logic
3. **Components**: Follow the existing component structure
4. **Types**: Update database.types.ts when schema changes

## Security Best Practices

- All database operations use RLS policies
- User data is isolated and secure
- No SQL injection vulnerabilities
- Authentication tokens are handled securely
- No sensitive data in client code

## Production Ready

This application is production-ready with:
- TypeScript for type safety
- Proper error handling
- Loading states
- Responsive design
- Optimized builds
- Security best practices
- Clean code architecture

Start building better habits today!
