# Getting Started with MyDashboard

## Quick Start Guide

### 1. Install Dependencies
```bash
cd /Users/xxx/Desktop/NewDash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

### 3. Open Your Browser
Navigate to: http://localhost:3000

### 4. Login with Demo Credentials
- **Email**: admin@mydashboard.com
- **Password**: password123

## What You'll See

### 🏠 Dashboard
- **Private Mode**: Personal tasks, goals, and life metrics
- **Work Mode**: Business metrics, sales data, and work tasks
- Toggle between modes using the switch in the header

### 📊 Key Features
- **KPI Cards**: Real-time metrics with trend indicators
- **Overview Charts**: Interactive line charts showing progress
- **Task Management**: Create, prioritize, and complete tasks
- **Calendar View**: Full calendar with event management
- **Modern Design**: Clean, minimalist interface

### 🎨 Design Features
- Responsive layout that works on all devices
- Light/dark mode toggle (coming soon)
- Smooth animations and transitions
- Professional color scheme

## Navigation

- **Dashboard**: Main overview page
- **Calendar**: Full calendar view with event management
- **Users**: User management (coming soon)
- **AI Integration**: AI features (coming soon)
- **API**: API management (coming soon)
- **Account Settings**: User preferences

## Customization

The dashboard automatically switches between Private and Work modes, showing different:
- KPI metrics
- Task categories
- Event types
- Chart data

## Next Steps

1. **Add Google Calendar Integration**:
   - Get Google Calendar API credentials
   - Add them to environment variables
   - Enable calendar sync

2. **Add Database**:
   - Set up Prisma with your preferred database
   - Migrate the schema
   - Enable persistent data storage

3. **Deploy**:
   - Push to GitHub
   - Deploy to Vercel, Netlify, or your preferred platform

## Troubleshooting

### Common Issues

**Port already in use**:
```bash
npm run dev -- -p 3001
```

**Dependencies not installing**:
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build errors**:
```bash
npm run build
```

## Support

If you encounter any issues, check the console for error messages or create an issue in the repository.

---

**Enjoy your new MyDashboard application! 🚀**
