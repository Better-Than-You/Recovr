# AI-Driven DCA Management & Recovery Platform (FedEx Case Study)

A high-fidelity frontend prototype for a Debt Collection Agency (DCA) management system with enterprise-grade design, built with React, TypeScript, and Tailwind CSS.

## 🎯 Overview

This platform provides comprehensive debt collection management with two distinct role-based views:
- **FedEx Admin**: Global oversight, case allocation, and agency performance monitoring
- **DCA Agent**: Assigned cases management, recovery tracking, and action items

## 🚀 Tech Stack

- **Framework**: React 19 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom shadcn/ui-inspired components (Radix UI patterns)
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Routing**: React Router v7

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Features

### FedEx Admin Views

#### 1. Global Dashboard (`/`)
- **KPI Cards**: Total Outstanding, Recovery Rate, Active Agencies, Avg. Recovery Time
- **Charts**: 
  - Monthly recovery trend (Line chart)
  - Aging bucket distribution (Bar chart)
- **Agency Performance Ranking**: Top performers with scores and metrics

#### 2. Case Allocation (`/case-allocation`)
- **Interactive DataTable**: Sortable columns, filtering, bulk selection
- **AI Priority Score**: Recovery probability indicators with color-coded badges
- **Bulk Actions**: Assign multiple cases to agencies simultaneously
- **Advanced Filters**: Status-based filtering with search functionality

#### 3. Agency Performance (`/agency-performance`)
- **Performance Comparison**: Side-by-side agency metrics
- **Recovery Charts**: Visual comparison of total recovered amounts
- **Detailed Cards**: Per-agency statistics with performance badges

#### 4. Audit Logs (`/audit-logs`)
- **Complete Activity Trail**: All system actions with timestamps
- **Categorized Events**: Assignments, status changes, communications, system events
- **User Tracking**: Shows which user performed each action

### DCA Agent Views

#### 1. My Assigned Cases (`/my-cases`)
- **Case Portfolio**: All cases assigned to the agent's agency
- **Summary Cards**: Total assigned, total value, urgent cases
- **Quick Actions**: Direct access to case details

#### 2. Pending Actions (`/pending-actions`)
- **Action Items**: Prioritized list of tasks requiring attention
- **Priority Badges**: Urgent, High, Medium, Low indicators
- **Time Tracking**: Due dates and overdue warnings

#### 3. Recovery Stats (`/recovery-stats`)
- **Performance Metrics**: Total recovered, recovery rate, resolution time
- **Trend Analysis**: Monthly recovery performance charts
- **Target vs Actual**: Progress bars showing quarterly goals
- **Aging Distribution**: Cases breakdown by days overdue

### Shared Features

#### Case Timeline (`/case/:caseId`)
**The Beautiful Timeline** - High Priority Feature
- **Thread-Style Design**: Vertical timeline with connector lines
- **Three-Party Communication**: Color-coded events (FedEx, DCA, Customer)
- **Event Types**: Emails, calls, status changes, payments, legal notices
- **Rich Metadata**: Email subjects, amounts, status transitions
- **Visual Hierarchy**: Icons, badges, and timestamps for easy scanning

## 🎨 Design Language

### Minimalist Aesthetic
- Clean white/light-gray background
- Slate and zinc color palettes from Tailwind
- Emphasis on clarity over color
- Generous whitespace and clear typography

### Interactive Elements
- Skeleton loaders for data fetching states
- Hover effects on interactive elements
- Smooth transitions and animations
- Responsive design for all screen sizes

### Typography
- Large, clear headings (text-3xl font-bold)
- Muted text for secondary information (text-slate-500)
- Font weights strategically used for hierarchy
- Monospace fonts for IDs and technical data

## 📊 Mock Data

The application includes comprehensive mock data:

### Cases (`mockData.ts`)
- **10 dummy cases** with realistic data:
  - Case IDs, customer names, account numbers
  - Outstanding amounts ranging from $12,300 to $89,500
  - Aging days from 32 to 165
  - AI recovery probabilities (0.38 to 0.94)
  - Status (pending, assigned, in_progress, legal)

### Timeline Events
- **Detailed timelines** for featured cases:
  - Multi-party communication history
  - Email exchanges with subjects
  - Status change tracking
  - Payment updates and legal notices

### Agencies
- **3 collection agencies** with performance data:
  - Performance scores (0.79 to 0.92)
  - Total recovered amounts
  - Active case counts

## 🧩 Component Structure

```
src/
├── components/
│   ├── ui/                  # Base UI components
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── table.tsx
│   ├── Layout.tsx           # Main layout wrapper
│   └── Sidebar.tsx          # Navigation with role switcher
│
├── pages/
│   ├── Dashboard.tsx        # FedEx global dashboard
│   ├── CaseAllocation.tsx   # Case assignment table
│   ├── CaseDetail.tsx       # Individual case with timeline
│   ├── AgencyPerformance.tsx# Agency metrics
│   ├── AuditLogs.tsx        # System activity log
│   ├── MyCases.tsx          # DCA assigned cases
│   ├── PendingActions.tsx   # DCA action items
│   └── RecoveryStats.tsx    # DCA performance stats
│
├── data/
│   └── mockData.ts          # All mock data and types
│
└── lib/
    └── utils.ts             # Utility functions (cn)
```

## 🎭 Role Switching

The application features a role switcher in the sidebar that allows instant switching between:
- **FedEx Admin**: Access to global oversight features
- **DCA Agent**: Access to case management features

Navigation automatically filters based on the current role, showing only relevant menu items.

## 🔍 Key Interactions

### Case Allocation Table
- Click column headers to sort
- Use checkboxes for bulk selection
- Filter by status using dropdown
- Search cases by name/ID
- Click "View Details" to see case timeline

### Case Timeline
- Scroll through chronological events
- View color-coded actors (FedEx = blue, DCA = purple, Customer = green)
- Expand metadata sections for details
- See email subjects and amounts inline

### Charts and Visualizations
- Hover over chart elements for detailed tooltips
- Compare multiple metrics visually
- Track trends over 6-month periods

## 🎯 Future Enhancements

Potential additions for a production system:
- Real-time updates via WebSockets
- Advanced search and filtering
- Export functionality for reports
- Email/SMS integration for communications
- Document management system
- Payment processing integration
- Advanced analytics and ML predictions

## 📝 Code Quality

- **TypeScript**: Full type safety across the application
- **ESLint**: Configured with React best practices
- **Component Composition**: Reusable, maintainable components
- **Semantic HTML**: Accessible markup structure
- **Responsive Design**: Mobile-first approach with Tailwind

## 🎨 Color Palette

```
Primary: Blue (hsl(221.2, 83.2%, 53.3%))
Secondary: Slate (hsl(210, 40%, 96.1%))
Success: Green (#10b981)
Warning: Yellow/Orange (#f59e0b)
Destructive: Red (#ef4444)
Muted: Slate 500 (#64748b)
```

## 🔧 Configuration Files

- `tailwind.config.js`: Tailwind CSS configuration with custom theme
- `tsconfig.json`: TypeScript configuration with path aliases
- `vite.config.ts`: Vite build configuration with path resolution
- `eslint.config.js`: ESLint rules and settings

## 📄 License

MIT License - Free to use for educational and commercial purposes.

## 👨‍💻 Development

Built as a high-fidelity prototype demonstrating:
- Enterprise UI/UX patterns
- Complex data visualization
- Role-based access control
- Timeline/communication tracking
- Performance analytics

Perfect for showcasing modern React development practices and component architecture.
