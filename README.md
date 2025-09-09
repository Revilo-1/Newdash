# LifeDash - Personal & Work Dashboard

A modern, minimalist Next.js dashboard application for managing your daily tasks, goals, and life organization.

## Features

- 🔐 **Authentication System** - Secure login with NextAuth.js
- 📊 **Dual Dashboard Views** - Toggle between Private and Work modes
- ✅ **Task Management** - Create, prioritize, and track tasks
- 📅 **Calendar Integration** - Full calendar view with Google Calendar sync
- 📈 **KPI Tracking** - Monitor key performance indicators
- 🎨 **Modern Design** - Clean, minimalist interface inspired by modern SaaS dashboards
- 📱 **Responsive** - Works perfectly on desktop and mobile

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Charts**: Recharts
- **Calendar**: React Big Calendar
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables** (optional for Google Calendar):
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Google Calendar API credentials:
   ```
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback/google
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Login

Use these credentials to test the application:
- **Email**: admin@lifedash.com
- **Password**: password123

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/login/        # Login page
│   ├── dashboard/         # Main dashboard
│   ├── calendar/          # Calendar view
│   └── api/auth/          # Authentication API routes
├── components/            # React components
│   ├── layout/           # Layout components (Sidebar, Header)
│   ├── dashboard/        # Dashboard-specific components
│   ├── calendar/         # Calendar components
│   └── providers/        # Context providers
├── lib/                  # Utility libraries
│   ├── auth.ts          # NextAuth configuration
│   └── google-calendar.ts # Google Calendar integration
└── types/               # TypeScript type definitions
```

## Features Overview

### Dashboard Views

**Private Dashboard**:
- Personal task tracking
- Life goals and wellness metrics
- Personal calendar events
- Health and wellness KPIs

**Work Dashboard**:
- Business metrics and revenue tracking
- Work task management
- Meeting and deadline tracking
- Sales performance indicators

### Task Management

- Create and manage tasks with priorities
- Mark tasks as completed
- Filter by status and priority
- Due date tracking

### Calendar Integration

- Full calendar view (month, week, day)
- Create and edit events
- Google Calendar sync (when configured)
- Color-coded event categories

### KPI Tracking

- Real-time metrics display
- Trend indicators with percentage changes
- Visual charts and graphs
- Customizable dashboard widgets

## Customization

### Adding New KPIs

Edit `src/components/dashboard/KPICards.tsx` to add new metrics:

```typescript
const newKPI: KPICard = {
  title: 'Your Metric',
  value: '123',
  change: '5%↑',
  changeType: 'increase',
  icon: YourIcon,
  color: 'text-blue-500',
  bgColor: 'bg-blue-500'
}
```

### Styling

The application uses Tailwind CSS. Customize colors and styling in:
- `tailwind.config.js` - Theme configuration
- `src/app/globals.css` - Global styles

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with one click

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support or questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js and Tailwind CSS
