# Additional APIs Needed - Future Enhancements

This document tracks additional API endpoints that may be needed as the application grows.

## 🔄 Currently Missing but May Be Needed

### Case Management
- [ ] `POST /api/cases/:id/payment` - Record payment received
- [ ] `POST /api/cases/:id/dispute` - File dispute
- [ ] `POST /api/cases/:id/settlement` - Propose settlement
- [ ] `GET /api/cases/:id/documents` - Get case documents
- [ ] `POST /api/cases/:id/documents` - Upload document
- [ ] `POST /api/cases/bulk-assign` - Bulk assign cases
- [ ] `DELETE /api/cases/:id` - Delete/archive case
- [ ] `POST /api/cases/:id/notes` - Add case notes

### Agency Management  
- [ ] `POST /api/agencies` - Create new agency
- [ ] `PUT /api/agencies/:id` - Update agency details
- [ ] `DELETE /api/agencies/:id` - Remove agency
- [ ] `GET /api/agencies/:id/performance` - Detailed performance metrics
- [ ] `POST /api/agencies/:id/suspend` - Suspend agency
- [ ] `POST /api/agencies/:id/activate` - Reactivate agency

### Customer Management
- [ ] `POST /api/customers` - Create new customer
- [ ] `PUT /api/customers/:id` - Update customer details
- [ ] `DELETE /api/customers/:id` - Delete customer
- [ ] `GET /api/customers/:id/payment-history` - Payment history
- [ ] `POST /api/customers/:id/contact-info` - Update contact info

### Reports & Analytics
- [ ] `GET /api/reports/recovery-by-period` - Recovery by date range
- [ ] `GET /api/reports/aging-analysis` - Detailed aging analysis
- [ ] `GET /api/reports/agency-comparison` - Compare agencies
- [ ] `GET /api/reports/export/csv` - Export data to CSV
- [ ] `GET /api/reports/export/pdf` - Generate PDF reports

### Actions & Tasks
- [ ] `POST /api/actions` - Create new action
- [ ] `PUT /api/actions/:id` - Update action
- [ ] `POST /api/actions/:id/complete` - Mark action complete
- [ ] `DELETE /api/actions/:id` - Delete action
- [ ] `GET /api/actions/overdue` - Get overdue actions

### Notifications
- [ ] `GET /api/notifications` - Get all notifications
- [ ] `PUT /api/notifications/:id/read` - Mark as read
- [ ] `POST /api/notifications/settings` - Update notification preferences
- [ ] `DELETE /api/notifications/:id` - Dismiss notification

### Audit & Compliance
- [ ] `GET /api/audit-logs` - Get audit trail
- [ ] `GET /api/audit-logs/:id` - Get specific audit log
- [ ] `POST /api/compliance/report` - Generate compliance report

### User Management (Admin)
- [ ] `GET /api/users` - List all users
- [ ] `POST /api/users` - Create new user
- [ ] `PUT /api/users/:id` - Update user
- [ ] `DELETE /api/users/:id` - Delete user
- [ ] `POST /api/users/:id/reset-password` - Reset password
- [ ] `PUT /api/users/:id/role` - Change user role

### Settings & Configuration
- [ ] `GET /api/settings` - Get system settings
- [ ] `PUT /api/settings` - Update settings
- [ ] `GET /api/settings/auto-assign-rules` - Get auto-assign rules
- [ ] `PUT /api/settings/auto-assign-rules` - Update rules

---

## ✅ Already Implemented

### Authentication ✅
- [x] `POST /api/auth/login`
- [x] `POST /api/auth/logout`
- [x] `GET /api/auth/me`
- [x] `POST /api/auth/refresh`

### Cases ✅
- [x] `GET /api/cases`
- [x] `GET /api/cases/:id`
- [x] `POST /api/cases`
- [x] `PUT /api/cases/:id`
- [x] `PUT /api/cases/:id/assign`
- [x] `GET /api/cases/:id/timeline`
- [x] `POST /api/cases/:id/email`
- [x] `POST /api/cases/:id/call`

### Agencies ✅
- [x] `GET /api/agencies`
- [x] `GET /api/agencies/:id`
- [x] `GET /api/agencies/:id/cases`

### Customers ✅
- [x] `GET /api/customers`
- [x] `GET /api/customers/:id`
- [x] `GET /api/customers/:id/cases`

### Dashboard ✅
- [x] `GET /api/dashboard/stats`
- [x] `GET /api/stats/recovery`
- [x] `GET /api/performance/agencies`

### Actions ✅
- [x] `GET /api/actions/pending`

---

## 🎯 Priority Recommendations

### High Priority (Implement Next)
1. **Case Documents** - Upload/view documents
2. **Payment Recording** - Track payments received
3. **Notifications** - Real-time user notifications
4. **Bulk Operations** - Bulk assign, bulk update

### Medium Priority
1. **Reports** - Generate various reports
2. **Agency CRUD** - Full agency management
3. **Customer CRUD** - Full customer management
4. **Action Management** - Create/update actions

### Low Priority
1. **Advanced Analytics** - Complex reports
2. **User Management** - Admin user controls
3. **Settings** - System configuration
4. **Audit Logs** - Detailed audit trail

---

## 🔌 How to Add New APIs

When adding a new API endpoint:

1. **Backend:**
   - Add route to appropriate file in `backend/routes/`
   - Update database models if needed
   - Test endpoint with Postman/curl

2. **Frontend:**
   - Add function to appropriate service file
   - Add TypeScript types/interfaces
   - Update pages to use new endpoint

3. **Documentation:**
   - Add to backend API documentation
   - Update integration report
   - Add usage examples

---

## 📝 Notes

- All API endpoints should follow RESTful conventions
- Use proper HTTP methods (GET, POST, PUT, DELETE)
- Return consistent JSON response formats
- Include proper error messages
- Add authentication where needed
- Log all actions for audit trail

---

**Last Updated:** January 7, 2026  
**Status:** Planning Document  
**Next Review:** After implementing high-priority APIs
