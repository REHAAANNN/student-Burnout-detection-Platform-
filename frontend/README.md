# Burnout Guard - Student Wellness & Burnout Detection Platform

A professional, modern React frontend for detecting and managing student burnout through AI-powered wellness recommendations.

## Tech Stack

- **React 19** - UI Framework
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Data visualization
- **React Hook Form** - Form management
- **Zustand** - State management
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **React Hot Toast** - Notifications

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/
│   │   ├── common/     # Reusable common components
│   │   ├── ui/         # UI primitives (Button, Input, etc.)
│   │   ├── dashboard/  # Dashboard-specific components
│   │   └── layout/     # Layout components (Navbar, Sidebar, etc.)
│   ├── pages/          # Page components
│   │   ├── auth/       # Login, Register
│   │   ├── onboarding/ # Onboarding flow
│   │   ├── dashboard/  # Main dashboard
│   │   ├── journal/    # Journal entries
│   │   └── recommendations/ # Recommendations
│   ├── routes/         # Routing configuration
│   ├── services/       # API services
│   ├── hooks/          # Custom hooks
│   ├── store/          # Zustand stores
│   ├── context/        # React context
│   ├── constants/      # App constants
│   ├── utils/          # Utility functions
│   ├── styles/         # Global styles
│   ├── App.jsx         # Root component
│   └── main.jsx        # Entry point
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```

## Installation

```bash
cd frontend
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The application will open at `http://localhost:5173`

## Building

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Features

### Authentication
- User login and registration
- Form validation
- Password visibility toggle
- Loading states and error handling

### Onboarding Flow
1. **Mood Check** - Select current mood
2. **Stressor Selection** - Choose stress contributors
3. **Adaptive Assessment** - Dynamic questionnaire

### Dashboard
- **Summary Cards** - Burnout score, risk level, mood, main stressor
- **Burnout Trend Graph** - Weekly progression chart
- **Recommendations** - Actionable wellness tips
- **Burnout Drivers** - Stress source breakdown
- **Journal Preview** - Recent entries
- **Support Resources** - Help and counseling links

### Journal
- Write and save entries
- Character counter
- View recent entries

### Recommendations
- Personalized wellness tips
- Study habits
- Sleep improvement
- Stress management

## Theming

The application includes dark mode support and uses a professional wellness-focused color palette:

- **Primary**: Indigo/Violet
- **Secondary**: Emerald
- **Status Colors**: Green (Low), Amber (Moderate), Red (High)

## Environment Variables

Create a `.env` file:

```
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Burnout Guard
VITE_APP_ENV=development
```

## State Management

Uses Zustand for global state:
- Authentication state
- User profile
- Assessment data
- UI preferences

## API Services

Mock services implemented for:
- Authentication
- Assessments
- Dashboard data
- Journal entries
- Recommendations

Ready to integrate with backend API by updating service layer.

## Components

### UI Components
- Button, Input, Card, Modal, Badge
- TextArea, Select, MultiSelect
- Custom form elements

### Common Components
- Loader, ErrorMessage, EmptyState

### Layout
- Navbar, Sidebar, Footer, DashboardLayout

### Dashboard Components
- BurnoutScoreCard, RiskLevelCard, MoodCard
- StressorCard, TrendChart, RecommendationsCard
- BurnoutDriversCard, JournalPreviewCard, SupportResourcesCard

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Code splitting via React Router
- Image optimization
- CSS minification
- JavaScript minification
- Lazy loading of routes

## Accessibility

- ARIA labels
- Semantic HTML
- Keyboard navigation
- Color contrast compliance
- Form validation messages

## License

MIT

## Support

For issues and feature requests, please contact the development team.
