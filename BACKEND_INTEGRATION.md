# Backend Integration Checklist

This document outlines all the changes needed to integrate the frontend with a backend API.

## Current Implementation Status

### ✅ Completed (Phase 1: Foundation)
- [x] API service layer (`src/services/api.ts`) with axios instance
- [x] Authentication service (`src/services/authService.ts`) with all endpoints
- [x] Zustand state management (authStore, uiStore)
- [x] Protected routes with authentication guards
- [x] Login page with role selection UI
- [x] Toast notification system (top-center, slide-down animation)
- [x] Role-based navigation and routing
- [x] State persistence via localStorage
- [x] Request/response interceptors for token management
- [x] Automatic token refresh on 401 errors

### 🚧 In Progress (Phase 2: Integration)
- [ ] Replace mock login with real email/password form
- [ ] Create remaining service files (caseService, agencyService, etc.)
- [ ] Replace mock data with API calls in all pages
- [ ] Add loading states and error handling

### 📋 Planned (Phase 3: Polish)
- [ ] React Query integration for caching
- [ ] WebSocket for real-time updates
- [ ] File upload functionality
- [ ] Advanced filtering and pagination
- [ ] Comprehensive error handling

---

## 1. Mock Data to Replace

### Location: `src/data/mockData.ts`

All mock data currently lives in this file and needs to be replaced with API calls:

- **Cases** (`mockCases[]`) - Collection of case data
- **Timeline Events** (`mockTimelineData`) - Email and event history per case
- **Agencies** (`agencies[]`) - Collection agency information
- **Customers** (`customers[]`) - Customer/debtor information
- **Dashboard Stats** (`dashboardStats`) - Aggregate statistics

## 2. Required API Endpoints

### Authentication ✅ (Service Layer Complete)
**File:** `src/services/authService.ts`

- `POST /auth/login` - User login ✅ Implemented
- `POST /auth/logout` - User logout ✅ Implemented
- `GET /auth/me` - Get current user info ✅ Implemented
- `POST /auth/refresh` - Refresh token ✅ Implemented

**Types Defined:**
```typescript
interface LoginCredentials { email: string; password: string }
interface User { id: string; email: string; name: string; role: 'fedex' | 'dca' }
interface AuthResponse { user: User; token: string }
```

**Integration Needed:**
- Update Login page to use real form with email/password
- Replace mock role selection with actual login form
- Connect authStore.login() to authService.login()

### Cases 🚧 (Needs Service Creation)
**Create:** `src/services/caseService.ts`

- `GET /api/cases` - Get all cases (with pagination, filters)
- `GET /api/cases/:id` - Get single case details
- `POST /api/cases` - Create new case
- `PUT /api/cases/:id` - Update case
- `DELETE /api/cases/:id` - Delete case
- `GET /api/cases/:id/timeline` - Get case timeline/history

### Agencies 🚧 (Needs Service Creation)
**Create:** `src/services/agencyService.ts`

- `GET /api/agencies` - Get all agencies
- `GET /api/agencies/:id` - Get agency details
- `POST /api/agencies` - Create agency
- `PUT /api/agencies/:id` - Update agency
- `GET /api/agencies/:id/cases` - Get cases assigned to agency

### Customers 🚧 (Needs Service Creation)
**Create:** `src/services/customerService.ts`

- `GET /api/customers` - Get all customers (with search, filters)
- `GET /api/customers/:id` - Get customer details
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `GET /api/customers/:id/cases` - Get customer's cases

### Dashboard & Stats 🚧 (Needs Service Creation)
**Create:** `src/services/dashboardService.ts`

- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/stats/recovery` - Get recovery statistics
- `GET /api/performance/agencies` - Get agency performance data

### Actions 🚧 (Needs Service Creation)
**Create:** `src/services/actionService.ts`

- `GET /api/actions/pending` - Get pending actions for DCA agent
- `POST /api/cases/:id/email` - Send email
- `POST /api/cases/:id/call` - Log a call
- `POST /api/cases/:id/payment` - Record payment
- `PUT /api/cases/:id/assign` - Assign case to agency

### Audit Logs 🚧 (Needs Service Creation)
**Create:** `src/services/auditService.ts`

- `GET /api/audit-logs` - Get audit log entries

## 3. Files Requiring Changes

### Authentication & Role Management ✅

**File:** `src/App.tsx` ✅ Updated
- ✅ Replaced hardcoded state with Zustand authStore
- ✅ Added ProtectedRoutes component with authentication guard
- ✅ Implemented role-based route protection
- ✅ Added Login route

```typescript
// Implemented:
function ProtectedRoutes() {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  const role = user?.role || 'fedex'
  // ... role-based routing
}
```

**File:** `src/components/Layout.tsx` ✅ Updated
- ✅ Integrated with Zustand authStore
- ✅ Uses user role from store
- ✅ Passes switchRole function to Sidebar

**File:** `src/pages/Login.tsx` ✅ Created
- ✅ Beautiful role selection UI
- ✅ Integrated with authStore.login()
- 🚧 Needs real email/password form

**File:** `src/stores/authStore.ts` ✅ Created
- ✅ Zustand store with persist middleware
- ✅ Login/logout/switchRole actions
- ✅ localStorage persistence
- 🚧 Currently uses mock data, needs to call authService

**File:** `src/stores/uiStore.ts` ✅ Created
- ✅ Toast notification management
- ✅ Sidebar collapse state
- ✅ Auto-dismiss with configurable duration

### API Service Layer ✅

**File:** `src/services/api.ts` ✅ Created
- ✅ Base axios instance configured
- ✅ Environment variable support (VITE_API_BASE_URL)
- ✅ Request interceptor for auth headers
- ✅ Response interceptor for 401 handling
- ✅ Automatic token refresh on expired tokens

```typescript
// Configured with:
- baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
- Authorization header injection from localStorage
- Automatic redirect to /login on 401
```

**File:** `src/services/authService.ts` ✅ Created
- ✅ login(credentials): Promise<AuthResponse>
- ✅ logout(): Promise<void>
- ✅ getCurrentUser(): Promise<User>
- ✅ refreshToken(): Promise<{ token: string }>
- ✅ All functions include JSDoc comments
- ✅ TypeScript interfaces defined
- ✅ Token management in localStorage

**Files to Create:** 🚧
- `src/services/caseService.ts` - Case-related API calls
- `src/services/agencyService.ts` - Agency-related API calls
- `src/services/customerService.ts` - Customer-related API calls
- `src/services/dashboardService.ts` - Dashboard data API calls
- `src/services/actionService.ts` - Actions and pending items
- `src/services/auditService.ts` - Audit log API calls

### State Management ✅

**Zustand Stores (Already Created):**
- ✅ `src/stores/authStore.ts` - Authentication state
- ✅ `src/stores/uiStore.ts` - UI state (toast, sidebar)
- ✅ `src/stores/index.ts` - Barrel exports

**No Context API needed** - Using Zustand instead (simpler, less boilerplate)

**Hooks (If needed for complex logic):**
- Could create `useAuth()` wrapper around authStore
- Could create `useCases()` for case data fetching with React Query

### Page-Level Changes

#### Dashboard (`src/pages/Dashboard.tsx`) 🚧
- Replace `mockCases` with caseService.getAll()
- Replace `dashboardStats` with dashboardService.getStats()
- Add loading states
- Add error handling
- Implement real-time data refresh

#### Case Allocation (`src/pages/CaseAllocation.tsx`) 🚧
- Replace `mockCases` with caseService.getAll()
- Implement actual case assignment via caseService.assign()
- Add success/error toast notifications (already have Toast component)

#### Case Detail (`src/pages/CaseDetail.tsx`) 🚧 Partially Updated
- ✅ Toast notifications integrated for reassign and email actions
- Replace `mockCases.find()` with caseService.getById(id)
- Replace `mockTimelineData` with caseService.getTimeline(id)
- Implement actual email sending via actionService.sendEmail()
- Implement actual call scheduling via actionService.logCall()
- Add loading/error states

#### Agencies (`src/pages/Agencies.tsx`) 🚧
- Replace `agencies` with agencyService.getAll()
- Add pagination for large datasets
- Implement server-side search/filtering

#### Agency Detail (`src/pages/AgencyDetail.tsx`) 🚧
- Replace `agencies.find()` with agencyService.getById(id)
- Replace filtered cases with agencyService.getCases(id)

#### Customers (`src/pages/Customers.tsx`) 🚧
- Replace `customers` with customerService.getAll()
- Implement server-side search/filtering
- Add pagination

#### Customer Detail (`src/pages/CustomerDetail.tsx`) 🚧
- Replace `customers.find()` with customerService.getById(id)
- Replace filtered cases with customerService.getCases(id)

#### My Cases (`src/pages/MyCases.tsx`) 🚧
- Replace filtered `mockCases` with caseService.getAll({ assignedTo: currentUser.id })

#### Pending Actions (`src/pages/PendingActions.tsx`) 🚧
- Replace hardcoded actions with actionService.getPending()
- Add action completion API calls

#### Recovery Stats (`src/pages/RecoveryStats.tsx`) 🚧
- Replace mock stats with dashboardService.getRecoveryStats()

#### Agency Performance (`src/pages/AgencyPerformance.tsx`) 🚧
- Replace mock data with dashboardService.getAgencyPerformance()

#### Audit Logs (`src/pages/AuditLogs.tsx`) 🚧
- Replace mock logs with auditService.getAll()
- Add pagination
- Add real-time log streaming (optional)

### Components

#### Sidebar (`src/components/Sidebar.tsx`) ✅ Updated
- ✅ Integrated with authStore
- ✅ Displays user from store
- ✅ Role switcher connected (for dev/demo, can remove later)
- Consider fetching additional user details if needed

#### Navbar (`src/components/Navbar.tsx`) 🚧
- Implement actual search functionality with API
- Connect notification bell to real notifications
- Update user profile section with real data

#### Toast (`src/components/Toast.tsx`) ✅ Created
- ✅ Beautiful toast notifications at top-center
- ✅ Success, error, info, warning types
- ✅ Auto-dismiss with configurable duration
- ✅ Smooth slide-down animation
- ✅ Already integrated in CaseDetail.tsx

## 4. Environment Configuration

### Required Files

**File:** `.env.local` (Create this file)
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
```

**File:** `.env.production` (For production deployment)
```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_API_TIMEOUT=30000
```

**File:** `.env.example` (For documentation)
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
```

**Already Configured:**
- ✅ `src/services/api.ts` reads from `import.meta.env.VITE_API_BASE_URL`
- ✅ Falls back to `http://localhost:3000/api` if not set

**Optional:** `vite.config.ts` proxy configuration
```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})
```

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
- ✅ Toast notification system created (src/components/Toast.tsx)
- ✅ Basic error handling in API interceptors
- 🚧 Create error boundary component
- 🚧 Add user-friendly error messages for each API call
- 🚧 Add retry logic for failed requests

**Using Toast Notifications:**
```typescript
import { useUIStore } from '@/stores'

const showToast = useUIStore(state => state.showToast)

// Success
showToast('Case assigned successfully', 'success')

// Error
showToast('Failed to load data', 'error')

// Info
showToast('Email composer opened', 'info')

// Warning
showToast('Please review the changes', 'warning')
```

### Loading States
- 🚧 Add skeleton loaders for all data-fetching components
- 🚧 Add loading spinners for buttons/actions
- 🚧 Implement optimistic UI updates

### Caching & Performance
- ✅ React Query already installed (`@tanstack/react-query`)
- 🚧 Implement React Query for data fetching
- 🚧 Add request caching
- 🚧 Add request deduplication
- 🚧 Implement pagination and infinite scroll

**React Query Setup Example:**
```typescript
import { useQuery } from '@tanstack/react-query'
import { caseService } from '@/services/caseService'

function Dashboard() {
  const { data: cases, isLoading, error } = useQuery({
    queryKey: ['cases'],
    queryFn: caseService.getAll
  })
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return <div>{/* render cases */}</div>
}
```

### Real-time Updates
- 🚧 WebSocket connection for live updates
- 🚧 Real-time notifications
- 🚧 Live case status updates
- 🚧 Live timeline event updates

### Form Validation
- 🚧 Add validation for all forms
- 🚧 Client-side validation
- 🚧 Server-side error display

### File Uploads
- 🚧 Implement document upload for cases
- 🚧 Add attachment support for emails

## 7. Security Considerations

### Authentication ✅ Partially Implemented
- ✅ Token storage in localStorage
- ✅ Authorization headers in API interceptors
- ✅ Automatic token refresh on 401 responses
- ✅ Automatic redirect to login on auth failure
- 🚧 Consider httpOnly cookies for token storage (more secure than localStorage)
- 🚧 Implement CSRF protection
- 🚧 Add token expiration handling

### Authorization
- ✅ Role-based routing implemented
- 🚧 Role-based access control (RBAC) for UI elements
- 🚧 Feature flags per role
- 🚧 API endpoint authorization verification

### Data Security
- 🚧 Sanitize user inputs
- 🚧 Implement CSRF protection
- 🚧 Add rate limiting awareness
- 🚧 Secure sensitive data display (PII)

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

### Phase 1: Setup ✅ COMPLETED
- ✅ Set up API service layer (`src/services/api.ts`)
- ✅ Create authentication service (`src/services/authService.ts`)
- ✅ Create Zustand stores (authStore, uiStore)
- ✅ Set up environment variables support

### Phase 2: Authentication ✅ MOSTLY COMPLETED
- ✅ Implement route guards (ProtectedRoutes)
- ✅ Update role management with Zustand
- ✅ Create login page with UI
- ✅ Implement toast notification system
- 🚧 Update login page to use email/password form
- 🚧 Connect authStore.login() to authService.login()
- 🚧 Test authentication flow end-to-end

### Phase 3: Core Features 🚧 IN PROGRESS
- 🚧 Create service files (caseService, agencyService, etc.)
- 🚧 Replace mock data with API calls (one page at a time)
- 🚧 Add loading/error states to all pages
- 🚧 Add toast notifications for all user actions
- 🚧 Test thoroughly

**Recommended Order:**
1. Create caseService.ts
2. Update Dashboard.tsx
3. Update CaseDetail.tsx (partially done)
4. Update CaseAllocation.tsx
5. Create remaining services
6. Update remaining pages

### Phase 4: Advanced Features 📋 PLANNED
- 📋 Implement React Query for caching
- 📋 Implement real-time updates via WebSocket
- 📋 Add notifications system
- 📋 Optimize performance
- 📋 Add file uploads

### Phase 5: Testing & Polish 📋 PLANNED
- 📋 Comprehensive testing
- 📋 Error handling improvements
- 📋 UI/UX refinements
- 📋 Performance optimization
- 📋 Security audit

## 11. Quick Reference: Files to Modify

### ✅ Completed
- [x] `src/services/api.ts` - Base axios instance
- [x] `src/services/authService.ts` - Authentication API
- [x] `src/stores/authStore.ts` - Auth state management
- [x] `src/stores/uiStore.ts` - UI state (toast, sidebar)
- [x] `src/stores/index.ts` - Store exports
- [x] `src/App.tsx` - Protected routes and auth integration
- [x] `src/components/Layout.tsx` - Zustand integration
- [x] `src/components/Toast.tsx` - Toast notification system
- [x] `src/pages/Login.tsx` - Login page UI

### 🚧 High Priority (Next Steps)
- [ ] `src/pages/Login.tsx` - Add email/password form
- [ ] `src/stores/authStore.ts` - Connect to authService
- [ ] `src/services/caseService.ts` - Create service
- [ ] `src/pages/Dashboard.tsx` - API integration
- [ ] `src/pages/CaseDetail.tsx` - Complete API integration
- [ ] `src/pages/CaseAllocation.tsx` - API integration

### 🚧 Medium Priority
- [ ] `src/services/agencyService.ts` - Create service
- [ ] `src/services/customerService.ts` - Create service
- [ ] `src/services/dashboardService.ts` - Create service
- [ ] `src/services/actionService.ts` - Create service
- [ ] All page components - Replace mock data
- [ ] `src/components/Navbar.tsx` - Search & notifications
- [ ] Add loading states everywhere

### 📋 Low Priority
- [ ] Optimize performance with React Query
- [ ] Add advanced features (WebSocket, file upload)
- [ ] Polish UI/UX
- [ ] Add comprehensive error boundaries
- [ ] Implement caching strategies

## Notes

### Current State Summary
- ✅ **Foundation Complete**: API layer, auth service, state management all set up
- ✅ **Authentication Flow**: Protected routes, login page, token management working
- ✅ **UI Components**: Toast notifications, layout, navigation all integrated
- 🚧 **Mock Data**: Still using mockData.ts, needs to be replaced with API calls
- 🚧 **Services**: Only authService created, need caseService, agencyService, etc.

### Implementation Best Practices
- ✅ Using Zustand instead of Context API (simpler, better performance)
- ✅ Axios interceptors handle auth headers automatically
- ✅ Toast system ready for user feedback
- Consider using React Query for data fetching (already installed via @tanstack/react-query)
- Use TypeScript strictly for API contracts
- Implement proper error boundaries
- Add proper logging for debugging
- Keep mock data during development for testing

### Quick Start for Next Developer
1. **Create a service** (e.g., `src/services/caseService.ts`):
   ```typescript
   import api from './api'
   
   export const caseService = {
     getAll: () => api.get('/cases'),
     getById: (id: string) => api.get(`/cases/${id}`),
     // ... more methods
   }
   ```

2. **Update a page** to use the service:
   ```typescript
   import { caseService } from '@/services/caseService'
   import { useUIStore } from '@/stores'
   
   const showToast = useUIStore(state => state.showToast)
   
   try {
     const cases = await caseService.getAll()
     // use the data
   } catch (error) {
     showToast('Failed to load cases', 'error')
   }
   ```

3. **Add loading states**:
   ```typescript
   const [loading, setLoading] = useState(true)
   
   useEffect(() => {
     loadData()
   }, [])
   
   async function loadData() {
     setLoading(true)
     try {
       const data = await caseService.getAll()
       // set data
     } finally {
       setLoading(false)
     }
   }
   ```

### Installed Packages
- ✅ `zustand` - State management
- ✅ `axios` - HTTP client
- ✅ `@tanstack/react-query` - Data fetching/caching (not yet integrated)
- ✅ `react-router-dom` - Routing
- ✅ `lucide-react` - Icons
- ✅ `tailwindcss` - Styling
