# HR Ticket System — Documentation

## Overview
A role-based HR ticket management system. Users log in, raise support tickets, and HR staff manage, assign, and resolve them.

---

## Roles & Permissions

| Role | Permissions |
|---|---|
| **EMPLOYEE** | Create tickets, view own tickets, public comments |
| **HR_COORDINATOR** | + View all tickets, assign, update status, internal notes |
| **HR_SPECIALIST** | Same as HR_COORDINATOR |
| **HR_MANAGER** | + Delete tickets, view analytics, sensitive categories |
| **SYSTEM_ADMIN** | + Manage roles, view audit logs |

**Sensitive categories** (GRIEVANCE, MEDICAL) — visible to HR_MANAGER and SYSTEM_ADMIN only.

---

## Login Credentials

| Username | Password | Role |
|---|---|---|
| alice.johnson | alice123 | EMPLOYEE |
| bob.martinez | bob123 | EMPLOYEE |
| carol.white | carol123 | HR_COORDINATOR |
| david.lee | david123 | HR_SPECIALIST |
| eva.chen | eva123 | HR_MANAGER |
| frank.admin | frank123 | SYSTEM_ADMIN |

---

## Pages & Features

### 1. Login Page
- Username + password authentication
- Show/hide password toggle
- Error messages for wrong credentials

### 2. Home Screen
- 3 quick-action cards: **Create Task**, **Advanced**, **Usage Report**
- Shows logged-in user name, role badge, Sign Out button

### 3. Create Task (Simple Form)
- Full-page ticket creation with: Title, Description, Category, Priority, Department, Location, Project, Ticket Type (Bug/Service Request)
- Assign to any user (employees see HR only; HR sees all users with department shown)
- File attachments (images, PDF, Word, Excel)
- Sensitive category warning shown for GRIEVANCE/MEDICAL
- On submit: saves locally + syncs to DB, shows success screen

### 4. Usage Report
- Standalone analytics page accessible from Home Screen
- Charts: tickets by status, priority, top categories, HR team workload
- Department-wise table with Export CSV, PDF, Print, Share options
- Filter by department and status

### 5. Advanced Dashboard (Main App)
Sidebar navigation with role-filtered menu items:

#### Tickets View
- **Left panel**: ticket list with search, status filter, priority filter
- **Right panel**: welcome screen with stats (open, my tickets, resolved, team members) + recent activity + quick actions
- Selecting a ticket opens **Ticket Detail** in right panel

#### Ticket Detail
- Fixed layout: header (title, badges, status buttons) + tabs + scrollable content + pinned comment input
- **Comments tab**: original description, public comments, internal notes (HR only)
- **Details tab**: ticket metadata grid + assign-to section (for permitted roles)
- Status change buttons (role-permissioned)
- Export: CSV download, Print, Share (Web Share API / clipboard fallback)
- Soft delete (HR_MANAGER+)

#### Directory
- Search employees by name, email, department
- Filter by department and role
- Employee cards showing name, email, role badge, department badge

#### Templates
- 6 default templates: Password Reset, Software Installation, Hardware Issue, Leave Request, Office Supplies, Training Request
- Search and category filter
- Preview modal (shows title + content before using)
- "Use" button pre-fills the Create Ticket form
- Create custom templates with name, category, priority, title, content, tags

#### Analytics
- Charts view: status bars, priority bars, category bars, HR workload
- Table view: department-wise summary (Total, Open, In Progress, Resolved, Critical, Unassigned)
- Export: CSV, PDF (jsPDF + autoTable), Print, Share

#### Audit Log
- Full activity history: ticket created, status changed, assigned, comments, deletions, role changes
- Search by user/ticket/role, filter by action type

#### Role Management (SYSTEM_ADMIN only)
- List all users with current role
- Click role badge to open inline dropdown and change role
- Role change logged to audit log

#### My Profile
- Profile card: name, email, role, department, stats (created, assigned to me, resolved)
- **Assigned to Me** tab: tickets others assigned to you
- **My Tasks** tab: tickets you created and assigned to others

---

## Ticket Lifecycle
`OPEN` → `IN_PROGRESS` → `PENDING` → `RESOLVED` → `CLOSED`

- Auto-escalation runs every 5 minutes: LOW→MEDIUM after 7 days, MEDIUM→HIGH after 14 days, HIGH→CRITICAL after 21 days
- Deleted tickets are soft-deleted (hidden from list, visible to HR_MANAGER+)

## Notifications (Bell Icon)
- EMPLOYEE: notified when their ticket is resolved or in progress
- HR_COORDINATOR/SPECIALIST: unassigned tickets + tickets assigned to them
- HR_MANAGER/SYSTEM_ADMIN: critical open tickets + unassigned tickets
- Mark individual or all as read; click to navigate to ticket
