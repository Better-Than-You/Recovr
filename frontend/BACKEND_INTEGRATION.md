# Backend Integration Checklist

This document outlines all the changes needed to integrate the frontend with a backend API.

## 1. Mock Data to Replace

### Location: `src/data/mockData.ts`

All mock data currently lives in this file and needs to be replaced with API calls:

- **Cases** (`mockCases[]`) - Collection of case data
- **Timeline Events** (`mockTimelineData`) - Email and event history per case
- **Agencies** (`agencies[]`) - Collection agency information
- **Customers** (`customers[]`) - Customer/debtor information
- **Dashboard Stats** (`dashboardStats`) - Aggregate statistics

## 2. Required API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/refresh` - Refresh token

### Cases
- `GET /api/cases` - Get all cases (with pagination, filters)
- `GET /api/cases/:id` - Get single case details
- `POST /api/cases` - Create new case
- `PUT /api/cases/:id` - Update case
- `DELETE /api/cases/:id` - Delete case
- `GET /api/cases/:id/timeline` - Get case timeline/history

### Agencies
- `GET /api/agencies` - Get all agencies
- `GET /api/agencies/:id` - Get agency details
- `POST /api/agencies` - Create agency
- `PUT /api/agencies/:id` - Update agency
- `GET /api/agencies/:id/cases` - Get cases assigned to agency

### Customers
- `GET /api/customers` - Get all customers (with search, filters)
- `GET /api/customers/:id` - Get customer details
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `GET /api/customers/:id/cases` - Get customer's cases

### Dashboard & Stats
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/stats/recovery` - Get recovery statistics
- `GET /api/performance/agencies` - Get agency performance data

### Actions
- `GET /api/actions/pending` - Get pending actions for DCA agent
- `POST /api/cases/:id/email` - Send email
- `POST /api/cases/:id/call` - Log a call
- `POST /api/cases/:id/payment` - Record payment
- `PUT /api/cases/:id/assign` - Assign case to agency

### Audit Logs
- `GET /api/audit-logs` - Get audit log entries

## 3. Files Requiring Changes

### Authentication & Role Management

**File:** `src/App.tsx`
- Replace hardcoded `currentRole` state with actual user role from backend
- Add authentication wrapper/guard
- Implement role-based route protection

```typescript
// Current:
const [currentRole, setCurrentRole] = useState<Role>('fedex')

// Needs to be:
const { user, role } = useAuth() // from auth context
```

### API Service Layer

**Create:** `src/services/api.ts`
- Base API configuration (axios/fetch)
- Request/response interceptors
- Error handling
- Authentication headers

**Create:** `src/services/`
- `caseService.ts` - Case-related API calls
- `agencyService.ts` - Agency-related API calls
- `customerService.ts` - Customer-related API calls
- `authService.ts` - Authentication API calls
- `dashboardService.ts` - Dashboard data API calls

### State Management

**Create:** `src/contexts/AuthContext.tsx`
- User authentication state
- Login/logout functions
- Token management
- Role management

**Create:** `src/hooks/`
- `useAuth.ts` - Authentication hook
- `useCases.ts` - Cases data fetching
- `useAgencies.ts` - Agencies data fetching
- `useCustomers.ts` - Customers data fetching

### Page-Level Changes

#### Dashboard (`src/pages/Dashboard.tsx`)
- Replace `mockCases` with API call
- Replace `dashboardStats` with API call
- Add loading states
- Add error handling
- Implement real-time data refresh

#### Case Allocation (`src/pages/CaseAllocation.tsx`)
- Replace `mockCases` with API call
- Implement actual case assignment API
- Add success/error notifications

#### Case Detail (`src/pages/CaseDetail.tsx`)
- Replace `mockCases.find()` with `GET /api/cases/:id`
- Replace `mockTimelineData` with `GET /api/cases/:id/timeline`
- Implement actual email sending
- Implement actual call scheduling
- Add loading/error states

#### Agencies (`src/pages/Agencies.tsx`)
- Replace `agencies` with `GET /api/agencies`
- Add pagination for large datasets
- Implement server-side search/filtering

#### Agency Detail (`src/pages/AgencyDetail.tsx`)
- Replace `agencies.find()` with `GET /api/agencies/:id`
- Replace filtered cases with `GET /api/agencies/:id/cases`

#### Customers (`src/pages/Customers.tsx`)
- Replace `customers` with `GET /api/customers`
- Implement server-side search/filtering
- Add pagination

#### Customer Detail (`src/pages/CustomerDetail.tsx`)
- Replace `customers.find()` with `GET /api/customers/:id`
- Replace filtered cases with `GET /api/customers/:id/cases`

#### My Cases (`src/pages/MyCases.tsx`)
- Replace filtered `mockCases` with `GET /api/cases?assignedTo=currentUser`

#### Pending Actions (`src/pages/PendingActions.tsx`)
- Replace hardcoded actions with `GET /api/actions/pending`
- Add action completion API calls

#### Recovery Stats (`src/pages/RecoveryStats.tsx`)
- Replace mock stats with `GET /api/stats/recovery`

#### Agency Performance (`src/pages/AgencyPerformance.tsx`)
- Replace mock data with `GET /api/performance/agencies`

#### Audit Logs (`src/pages/AuditLogs.tsx`)
- Replace mock logs with `GET /api/audit-logs`
- Add pagination
- Add real-time log streaming (optional)

### Sidebar (`src/components/Sidebar.tsx`)
- Update role switcher to reflect actual user role (remove if not needed)
- Fetch user info from backend
- Update user display info

### Navbar (`src/components/Navbar.tsx`)
- Implement actual search functionality with API
- Connect notification bell to real notifications
- Update user profile section with real data

## 4. Environment Configuration

**Create:** `.env.local`
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
```

**Update:** `vite.config.ts`
- Add proxy configuration for API calls

## 5. TypeScript Interfaces

**Update:** All interfaces in `src/data/mockData.ts`
- Move to `src/types/` directory
- Add API response wrapper types
- Add pagination types
- Add error types

**Create:** `src/types/`
- `api.ts` - API response types
- `auth.ts` - Authentication types
- `case.ts` - Case-related types
- `agency.ts` - Agency types
- `customer.ts` - Customer types

## 6. Additional Features to Implement

### Error Handling
- Create error boundary component
- Implement toast/notification system
- Add user-friendly error messages
- Add retry logic for failed requests

### Loading States
- Add skeleton loaders for all data-fetching components
- Add loading spinners for buttons/actions
- Implement optimistic UI updates

### Caching & Performance
- Implement React Query or SWR for data fetching
- Add request caching
- Add request deduplication
- Implement pagination and infinite scroll

### Real-time Updates
- WebSocket connection for live updates
- Real-time notifications
- Live case status updates
- Live timeline event updates

### Form Validation
- Add validation for all forms
- Client-side validation
- Server-side error display

### File Uploads
- Implement document upload for cases
- Add attachment support for emails

## 7. Security Considerations

### Authentication
- Implement JWT token storage (httpOnly cookies recommended)
- Token refresh logic
- Logout on token expiration
- Secure route guards

### Authorization
- Role-based access control (RBAC)
- Feature flags per role
- API endpoint authorization

### Data Security
- Sanitize user inputs
- Implement CSRF protection
- Add rate limiting awareness
- Secure sensitive data display (PII)

## 8. Testing Requirements

### Unit Tests
- Test all service functions
- Test all custom hooks
- Test utility functions

### Integration Tests
- Test API integration
- Test authentication flow
- Test data fetching and caching

### E2E Tests
- Test critical user flows
- Test role-based access
- Test case management workflows

## 9. Deployment Considerations

### Environment Variables
- Set up production API URL
- Configure CORS settings
- Set up proper authentication domains

### Build Configuration
- Optimize bundle size
- Code splitting
- Lazy loading for routes

### Monitoring
- Add error tracking (Sentry, etc.)
- Add analytics
- Add performance monitoring

## 10. Migration Steps

1. **Phase 1: Setup**
   - Set up API service layer
   - Create authentication context
   - Set up environment variables

2. **Phase 2: Authentication**
   - Implement login/logout
   - Add route guards
   - Update role management

3. **Phase 3: Core Features**
   - Replace mock data with API calls (one page at a time)
   - Add loading/error states
   - Test thoroughly

4. **Phase 4: Advanced Features**
   - Implement real-time updates
   - Add notifications
   - Optimize performance

5. **Phase 5: Testing & Polish**
   - Comprehensive testing
   - Error handling improvements
   - UI/UX refinements

## 11. Quick Reference: Files to Modify

### High Priority
- [ ] `src/App.tsx` - Add auth wrapper
- [ ] `src/data/mockData.ts` - Remove/replace
- [ ] `src/pages/Dashboard.tsx` - API integration
- [ ] `src/pages/CaseDetail.tsx` - API integration
- [ ] `src/components/Sidebar.tsx` - User data from API

### Medium Priority
- [ ] All page components - Replace mock data
- [ ] `src/components/Navbar.tsx` - Search & notifications
- [ ] Add loading states everywhere

### Low Priority
- [ ] Optimize performance
- [ ] Add advanced features
- [ ] Polish UI/UX

## Notes
- Consider using React Query or SWR for data fetching
- Use TypeScript strictly for API contracts
- Implement proper error boundaries
- Add proper logging for debugging
- Keep mock data during development for testing
