<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=TicketSolved%20HRMS&fontSize=50&fontColor=fff&animation=twinkling&fontAlignY=35&desc=Built%20by%20LionXcode&descAlignY=55&descSize=20" width="100%"/>

<br/>

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1000&color=F5A623&center=true&vCenter=true&width=600&lines=HR+Ticket+Management+System;Role-Based+Access+Control;Real-Time+Notifications;MongoDB+%2B+Next.js+%2B+Express;Built+with+%E2%9D%A4%EF%B8%8F+by+LionXcode)](https://git.io/typing-svg)

<br/>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.2.6-black?style=for-the-badge&logo=next.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white"/>
  <img src="https://img.shields.io/badge/MongoDB-5-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Type-Final%20Year%20Project-F5A623?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Made%20by-LionXcode-FF6B6B?style=for-the-badge"/>
</p>

</div>

---

<div align="center">

## 🦁 About LionXcode

</div>

> **LionXcode** is a freelance development brand delivering high-quality, production-ready web applications. This project was built as **paid work** for a final year college student — crafted with full attention to detail, clean architecture, and real-world deployment.

<div align="center">

```
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   🦁  LionXcode  —  Code That Roars                     ║
║                                                          ║
║   Freelance · Full Stack · Production Ready              ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

</div>

---

<div align="center">

## 🎯 Project Overview

</div>

**TicketSolved** is a complete **HR Ticket Management System** built for a final year college project. It features a full role-based access system, real-time notifications, analytics dashboard, and MongoDB persistence — deployed live on Vercel.

<div align="center">

```mermaid
graph TD
    A[👤 Employee] -->|Creates Ticket| B[🎫 Ticket System]
    B -->|Assigns| C[👩‍💼 HR Coordinator]
    C -->|Escalates| D[🧑‍💼 HR Specialist]
    D -->|Reports to| E[👔 HR Manager]
    E -->|Oversees| F[🔧 System Admin]
    B -->|Stores| G[(🍃 MongoDB)]
    B -->|Notifies| H[🔔 Notifications]
    B -->|Tracks| I[📊 Analytics]
```

</div>

---

<div align="center">

## ✨ Features

</div>

<table align="center">
<tr>
<td align="center" width="33%">

### 🔐 Auth & Roles
- 5-tier role hierarchy
- Row-level security
- Sensitive category privacy wall
- Permission-based UI rendering

</td>
<td align="center" width="33%">

### 🎫 Ticket Management
- Create, assign, update, delete
- Status workflow tracking
- Internal notes (HR only)
- File attachments support

</td>
<td align="center" width="33%">

### 📊 Analytics
- Department-wise summary
- Priority & status charts
- HR team workload view
- Export: CSV, PDF, Print

</td>
</tr>
<tr>
<td align="center" width="33%">

### 🔔 Notifications
- Role-filtered bell alerts
- Unread count badge
- Click-to-navigate
- Mark all as read

</td>
<td align="center" width="33%">

### 📋 Templates
- 6 default ticket templates
- Custom template creation
- Preview before use
- Tag-based filtering

</td>
<td align="center" width="33%">

### 🏢 Directory
- Employee search & filter
- Department & role filters
- Contact info display
- 15 mock employees

</td>
</tr>
</table>

---

<div align="center">

## 🛠️ Tech Stack — Frontend

</div>

```yaml
Framework:    Next.js 15.2.6 (App Router)
Language:     TypeScript 5
Styling:      Tailwind CSS 3 + shadcn/ui
Animation:    Framer Motion
Icons:        Lucide React
Database:     MongoDB (via API routes)
PDF Export:   jsPDF + jsPDF-AutoTable
Deployment:   Vercel
```

---

<div align="center">

## 👥 Roles & Credentials

</div>

| Role | Username | Password |
|------|----------|----------|
| 👤 Employee | `alice.johnson` | `alice123` |
| 👤 Employee | `bob.martinez` | `bob123` |
| 👩‍💼 HR Coordinator | `carol.white` | `carol123` |
| 🧑‍💼 HR Specialist | `david.lee` | `david123` |
| 👔 HR Manager | `eva.chen` | `eva123` |
| 🔧 System Admin | `frank.admin` | `frank123` |

---

<div align="center">

## 🚀 Getting Started

</div>

```bash
# Clone the repository
git clone https://github.com/acelion55/HRMS_FRONTEND.git
cd HRMS_FRONTEND

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your MONGODB_URI and NEXT_PUBLIC_BACKEND_URL

# Run development server
npm run dev
```

---

<div align="center">

## 📁 Project Structure

</div>

```
front/
├── app/
│   ├── api/
│   │   ├── tickets/          # Ticket CRUD API routes
│   │   └── audit-logs/       # Audit log API routes
│   ├── layout.tsx
│   └── page.tsx              # Main app entry
├── components/
│   ├── hr/
│   │   ├── dashboard.tsx     # Main dashboard
│   │   ├── ticket-list.tsx   # Ticket list panel
│   │   ├── ticket-detail.tsx # Ticket detail panel
│   │   ├── analytics.tsx     # Charts & reports
│   │   ├── audit-log.tsx     # Audit trail
│   │   ├── role-management.tsx
│   │   ├── employee-directory.tsx
│   │   ├── ticket-templates.tsx
│   │   └── profile.tsx
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── data.ts               # Mock data + in-memory store
│   ├── types.ts              # TypeScript types
│   ├── permissions.ts        # RBAC logic
│   └── mongodb.ts            # DB connection
└── DOCUMENTATION.md
```

---

<div align="center">

## 🌐 Live Demo

<a href="https://ticketsolved-5m4c4xxv7-lionxcodes-projects.vercel.app">
  <img src="https://img.shields.io/badge/🚀%20Live%20Demo-Visit%20Now-F5A623?style=for-the-badge"/>
</a>

<br/><br/>

---

## 🦁 Built by LionXcode

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=footer&animation=twinkling" width="100%"/>

*This project was delivered as paid freelance work for a final year college student.*
*Clean code. Real deployment. Production quality.*

**LionXcode — Code That Roars 🦁**

</div>
