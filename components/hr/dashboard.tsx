"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import {
  Ticket, BarChart2, Shield, Users, Plus,
  Lock, Bell, Menu, X,
  AlertTriangle, Clock, UserX, CheckCircle2, LogOut, ArrowLeft, UserCircle, Calendar, FileText, UserPlus
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useAuth } from "./auth-context"
import { getTickets, getAuditLogs, fetchTicketsFromDb, fetchAuditLogsFromDb, checkAndEscalateTickets, MOCK_USERS } from "@/lib/data"
import { hasPermission, ROLE_PERMISSIONS, filterTicketsForUser } from "@/lib/permissions"
import { TicketList } from "./ticket-list"
import { TicketDetail } from "./ticket-detail"
import { CreateTicketForm } from "./create-ticket"
import { Analytics } from "./analytics"
import { AuditLogViewer } from "./audit-log"
import { RoleManagement } from "./role-management"
import { UserManagement } from "./user-management"
import { ProfilePage } from "./profile"
import TicketTemplates from "./ticket-templates"
import { EmployeeDirectory } from "./employee-directory"
import type { Ticket as TicketType, Role } from "@/lib/types"

type View = "tickets" | "analytics" | "audit" | "roles" | "users" | "profile" | "directory" | "templates"

const ROLE_COLORS: Record<Role, string> = {
  EMPLOYEE:        "bg-yellow-50 text-yellow-800 border-yellow-300",
  HR_COORDINATOR:  "bg-blue-50 text-blue-700 border-blue-200",
  HR_SPECIALIST:   "bg-purple-50 text-purple-700 border-purple-200",
  HR_MANAGER:      "bg-green-50 text-green-700 border-green-200",
  SYSTEM_ADMIN:    "bg-orange-50 text-orange-700 border-orange-200",
  SPECIAL_OFFICER: "bg-rose-50 text-rose-700 border-rose-200",
}

const ROLE_BADGE_SOLID: Record<Role, string> = {
  EMPLOYEE:        "bg-yellow-500",
  HR_COORDINATOR:  "bg-blue-500",
  HR_SPECIALIST:   "bg-purple-500",
  HR_MANAGER:      "bg-green-500",
  SYSTEM_ADMIN:    "bg-orange-500",
  SPECIAL_OFFICER: "bg-rose-500",
}

export function HRDashboard({ onBack }: { onBack?: () => void } = {}) {
  const { currentUser, logout } = useAuth()
  if (!currentUser) return null

  const [view, setView] = useState<View>("tickets")
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [tick, setTick] = useState(0)
  const [tickets, setTickets] = useState<TicketType[]>(getTickets())
  const [auditLogs, setAuditLogs] = useState(getAuditLogs())

  const refresh = useCallback(async () => {
    setTick((n) => n + 1)
    try {
      const data = await fetchTicketsFromDb()
      if (Array.isArray(data)) setTickets(data)
    } catch (error) {
      console.error("Failed to refresh tickets", error)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    fetchTicketsFromDb()
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setTickets(data)
      })
      .catch((error) => console.error("Unable to fetch tickets from DB", error))

    fetchAuditLogsFromDb()
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setAuditLogs(data)
      })
      .catch((error) => console.error("Unable to fetch audit logs from DB", error))

    // Check for ticket escalations every 5 minutes
    const escalationInterval = setInterval(() => {
      if (!cancelled) {
        const escalated = checkAndEscalateTickets()
        if (escalated.length > 0) {
          console.log(`Escalated ${escalated.length} tickets`)
          refresh()
        }
      }
    }, 5 * 60 * 1000) // 5 minutes

    return () => {
      cancelled = true
      clearInterval(escalationInterval)
    }
  }, [tick])

  const liveSelectedTicket = selectedTicket
    ? tickets.find((t) => t.id === selectedTicket.id) ?? null
    : null

  const canCreateTicket = hasPermission(currentUser.role, "CREATE_TICKET")
  const canViewAnalytics = hasPermission(currentUser.role, "VIEW_ANALYTICS")
  const canViewAuditLogs = hasPermission(currentUser.role, "VIEW_AUDIT_LOGS")
  const canManageRoles = hasPermission(currentUser.role, "MANAGE_ROLES")
  const canManageUsers = hasPermission(currentUser.role, "MANAGE_USERS")

  const navItems = [
    { id: "tickets" as View,   label: "Tickets",         icon: <Ticket className="h-4 w-4" />,         show: true },
    { id: "directory" as View, label: "Directory",       icon: <Users className="h-4 w-4" />,          show: true },
    { id: "templates" as View, label: "Templates",       icon: <FileText className="h-4 w-4" />,       show: true },
    { id: "analytics" as View, label: "Analytics",       icon: <BarChart2 className="h-4 w-4" />,      show: canViewAnalytics },
    { id: "audit" as View,     label: "Audit Log",       icon: <Shield className="h-4 w-4" />,         show: canViewAuditLogs },
    { id: "roles" as View,     label: "Role Management", icon: <Users className="h-4 w-4" />,          show: canManageRoles },
    { id: "users" as View,     label: "Users",           icon: <UserPlus className="h-4 w-4" />,        show: canManageUsers },
    { id: "profile" as View,   label: "My Profile",      icon: <UserCircle className="h-4 w-4" />,     show: true },
  ].filter((n) => n.show)

  const openTickets = filterTicketsForUser(currentUser, tickets).filter((t) => !t.deletedAt && t.status === "OPEN").length

  // ── Notifications ──────────────────────────────────────────────────────────
  const [showNotifications, setShowNotifications] = useState(false)
  const [readIds, setReadIds] = useState<Set<string>>(new Set())
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setShowNotifications(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const notifications = (() => {
    const items: { id: string; icon: React.ReactNode; color: string; title: string; body: string; ticketId?: string }[] = []
    const vis = tickets.filter((t) => !t.deletedAt)
    if (currentUser.role === "EMPLOYEE") {
      vis.filter((t) => t.creatorId === currentUser.id).forEach((t) => {
        if (t.status === "RESOLVED") items.push({ id: `r-${t.id}`, icon: <CheckCircle2 className="h-4 w-4" />, color: "text-green-600", title: "Ticket Resolved", body: t.title, ticketId: t.id })
        else if (t.status === "IN_PROGRESS") items.push({ id: `ip-${t.id}`, icon: <Clock className="h-4 w-4" />, color: "text-amber-600", title: "In Progress", body: t.title, ticketId: t.id })
      })
    }
    if (["HR_COORDINATOR", "HR_SPECIALIST"].includes(currentUser.role)) {
      vis.filter((t) => !t.assigneeId && t.status === "OPEN").forEach((t) =>
        items.push({ id: `ua-${t.id}`, icon: <UserX className="h-4 w-4" />, color: "text-blue-600", title: "Unassigned Ticket", body: t.title, ticketId: t.id }))
      vis.filter((t) => t.assigneeId === currentUser.id && t.status === "OPEN").forEach((t) =>
        items.push({ id: `mn-${t.id}`, icon: <Ticket className="h-4 w-4" />, color: "text-purple-600", title: "Assigned to You", body: t.title, ticketId: t.id }))
    }
    if (["HR_MANAGER", "SYSTEM_ADMIN"].includes(currentUser.role)) {
      vis.filter((t) => t.priority === "CRITICAL" && t.status === "OPEN").forEach((t) =>
        items.push({ id: `cr-${t.id}`, icon: <AlertTriangle className="h-4 w-4" />, color: "text-red-600", title: "Critical Open", body: t.title, ticketId: t.id }))
      vis.filter((t) => !t.assigneeId && t.status === "OPEN").forEach((t) =>
        items.push({ id: `ua-${t.id}`, icon: <UserX className="h-4 w-4" />, color: "text-amber-600", title: "Unassigned Ticket", body: t.title, ticketId: t.id }))
    }
    return items
  })()

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length

  function handleNotifClick(n: typeof notifications[0]) {
    setReadIds((prev) => new Set([...prev, n.id]))
    if (n.ticketId) {
      const t = tickets.find((tk) => tk.id === n.ticketId)
      if (t) { setSelectedTicket(t); setView("tickets") }
    }
    setShowNotifications(false)
  }

  return (
    <div className="flex bg-yellow-50 text-gray-900" style={{ height: '100dvh', overflow: 'hidden' }}>

      {/* Mobile overlay */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setShowMobileSidebar(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-52 flex flex-col bg-white border-r border-yellow-200 shadow-sm transition-transform duration-300 md:relative md:translate-x-0",
        showMobileSidebar ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-yellow-100">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-sm">
              <Ticket className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">HR Tickets</p>
              <p className="text-xs text-gray-400">Management System</p>
            </div>
          </div>
          <button className="md:hidden text-gray-400 hover:text-gray-700" onClick={() => setShowMobileSidebar(false)}>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Current user info */}
        <div className="p-3 border-b border-yellow-100">
          <div className="flex items-center gap-2.5 px-2.5 py-2">
            <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0", ROLE_BADGE_SOLID[currentUser.role])}>
              {currentUser.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{currentUser.name}</p>
              <span className={cn("text-xs px-1.5 py-0.5 rounded-md border inline-block mt-0.5 font-medium", ROLE_COLORS[currentUser.role])}>
                {currentUser.role.replace(/_/g, " ")}
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {onBack && (
            <button onClick={() => { setShowMobileSidebar(false); onBack() }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors border text-gray-500 hover:bg-yellow-50 hover:text-gray-800 border-transparent md:hidden">
              <ArrowLeft className="h-4 w-4" /> Home
            </button>
          )}
          {navItems.map((item) => (
            <button key={item.id} onClick={() => { setView(item.id); setShowMobileSidebar(false) }}
              className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors border",
                view === item.id
                  ? "bg-yellow-400 text-white border-yellow-500 shadow-sm"
                  : "text-gray-500 hover:bg-yellow-50 hover:text-gray-800 border-transparent"
              )}>
              {item.icon}
              {item.label}
              {item.id === "tickets" && openTickets > 0 && (
                <span className="ml-auto text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">{openTickets}</span>
              )}
            </button>
          ))}
        </nav>

        {/* New ticket */}
        {canCreateTicket && (
          <div className="p-3 border-t border-yellow-100">
            <button onClick={() => setShowCreate(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-white text-sm font-semibold transition-colors shadow-sm">
              <Plus className="h-4 w-4" /> New Ticket
            </button>
          </div>
        )}

        {/* Logout */}
        <div className="p-3 border-t border-yellow-100 shrink-0">
          <button onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 text-sm font-medium transition-colors">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0" style={{ minHeight: 0, overflow: 'hidden' }}>
        {/* Header */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-yellow-200 bg-white shadow-sm shrink-0">
          <button className="md:hidden text-gray-400 hover:text-gray-700" onClick={() => setShowMobileSidebar(true)}>
            <Menu className="h-5 w-5" />
          </button>
          {onBack && (
            <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors">
              <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Home</span>
            </button>
          )}
          <h1 className="text-sm font-bold text-gray-800">
            {view === "tickets" ? "Support Tickets" : view === "analytics" ? "Analytics" : view === "audit" ? "Audit Log" : view === "roles" ? "Role Management" : view === "users" ? "Users" : "My Profile"}
          </h1>
          <div className="ml-auto flex items-center gap-3">
            {/* Quick Actions */}
            <div className="hidden md:flex items-center gap-1">
              {canCreateTicket && (
                <button onClick={() => setShowCreate(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg font-medium transition-colors">
                  <Plus className="h-3 w-3" /> New Ticket
                </button>
              )}
              {canViewAnalytics && (
                <button onClick={() => setView("analytics")}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white hover:bg-yellow-50 text-gray-700 border border-yellow-200 rounded-lg font-medium transition-colors">
                  <BarChart2 className="h-3 w-3" /> Analytics
                </button>
              )}
            </div>

            {/* Bell */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => setShowNotifications((v) => !v)}
                className="relative p-1.5 rounded-xl hover:bg-yellow-50 transition-colors">
                <Bell className={cn("h-5 w-5", unreadCount > 0 ? "text-yellow-600" : "text-gray-400")} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {showNotifications && (
                  <motion.div initial={{ opacity: 0, y: 6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.97 }} transition={{ duration: 0.15 }}
                    className="absolute right-0 top-10 z-50 w-80 bg-white border border-yellow-200 rounded-2xl shadow-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-yellow-100">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-semibold text-gray-800">Notifications</span>
                        {unreadCount > 0 && <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
                      </div>
                      {unreadCount > 0 && (
                        <button onClick={() => setReadIds(new Set(notifications.map((n) => n.id)))} className="text-xs text-yellow-600 hover:text-yellow-700 font-medium">
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-yellow-50">
                      {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                          <Bell className="h-7 w-7 mb-2 opacity-30" />
                          <p className="text-sm">No notifications</p>
                        </div>
                      ) : notifications.map((n) => {
                        const isUnread = !readIds.has(n.id)
                        return (
                          <button key={n.id} onClick={() => handleNotifClick(n)}
                            className={cn("w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-yellow-50 transition-colors", isUnread && "bg-yellow-50/60")}>
                            <div className={cn("mt-0.5 shrink-0", n.color)}>{n.icon}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-semibold text-gray-700">{n.title}</p>
                                {isUnread && <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 shrink-0" />}
                              </div>
                              <p className="text-xs text-gray-400 truncate mt-0.5">{n.body}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                    {notifications.length > 0 && (
                      <div className="px-4 py-2 border-t border-yellow-100 bg-yellow-50">
                        <p className="text-xs text-gray-400 text-center">{notifications.length} notification{notifications.length !== 1 ? "s" : ""} · role-filtered</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <span className={cn("text-xs px-2 py-1 rounded-lg border font-medium hidden sm:inline-block", ROLE_COLORS[currentUser.role])}>
              {currentUser.role.replace(/_/g, " ")}
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div key={view} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }} className="h-full flex flex-col">

              {view === "tickets" && (
                <div className="flex h-full min-h-0">
                  <div className={cn("flex flex-col border-r border-yellow-200 bg-white shrink-0 min-h-0",
                    liveSelectedTicket ? "hidden md:flex md:w-80 lg:w-96" : "flex w-full md:w-80 lg:w-96")}>
                    <TicketList key={tick} tickets={tickets} selectedId={liveSelectedTicket?.id ?? null} onSelect={(t) => { setSelectedTicket(t); setShowMobileSidebar(false) }} />
                  </div>
                  <div className={cn("flex-1 min-h-0 bg-yellow-50", liveSelectedTicket ? "flex flex-col" : "hidden md:flex md:flex-col")}>
                    {liveSelectedTicket ? (
                      <>
                        <div className="md:hidden flex items-center px-4 py-2 border-b border-yellow-200 bg-white shrink-0">
                          <button onClick={() => setSelectedTicket(null)} className="text-xs text-yellow-600 hover:text-yellow-700 font-medium">← Back to list</button>
                        </div>
                        <TicketDetail key={liveSelectedTicket.id + tick} ticket={liveSelectedTicket} onUpdate={refresh} onDelete={() => { setSelectedTicket(null); refresh() }} />
                      </>
                    ) : (
                      <div className="flex flex-col h-full overflow-y-auto">
                        {/* Welcome Section */}
                        <div className="p-6 bg-white border-b border-yellow-200">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h2 className="text-lg font-bold text-gray-900">Welcome back, {currentUser.name}!</h2>
                              <p className="text-sm text-gray-500">Here's what's happening today</p>
                            </div>
                            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="h-4 w-4" />
                              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                          </div>

                          {/* Quick Stats */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                              <div className="text-2xl font-bold text-yellow-700">{openTickets}</div>
                              <div className="text-xs text-gray-600">Open Tickets</div>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <div className="text-2xl font-bold text-blue-700">{tickets.filter(t => !t.deletedAt && t.assigneeId === currentUser.id).length}</div>
                              <div className="text-xs text-gray-600">My Tickets</div>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <div className="text-2xl font-bold text-green-700">{tickets.filter(t => !t.deletedAt && ["RESOLVED", "CLOSED"].includes(t.status)).length}</div>
                              <div className="text-xs text-gray-600">Resolved</div>
                            </div>
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                              <div className="text-2xl font-bold text-purple-700">{MOCK_USERS.length}</div>
                              <div className="text-xs text-gray-600">Team Members</div>
                            </div>
                          </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="flex-1 p-6">
                          <h3 className="text-sm font-bold text-gray-900 mb-3">Recent Activity</h3>
                          <div className="space-y-2">
                            {tickets.filter(t => !t.deletedAt).slice(0, 5).map((ticket) => (
                              <button
                                key={ticket.id}
                                onClick={() => { setSelectedTicket(ticket); setShowMobileSidebar(false) }}
                                className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-yellow-50 transition-colors border border-yellow-100"
                              >
                                <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold",
                                  ticket.status === "OPEN" ? "bg-blue-500 text-white" :
                                  ticket.status === "IN_PROGRESS" ? "bg-amber-500 text-white" :
                                  ticket.status === "RESOLVED" ? "bg-green-500 text-white" :
                                  "bg-gray-500 text-white")}>
                                  {ticket.creatorName.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{ticket.title}</p>
                                  <p className="text-xs text-gray-500">{ticket.creatorName} · {ticket.status.replace("_", " ")}</p>
                                </div>
                              </button>
                            ))}
                          </div>

                          {/* Quick Actions */}
                          <div className="mt-6">
                            <h3 className="text-sm font-bold text-gray-900 mb-3">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                onClick={() => setShowCreate(true)}
                                className="flex items-center gap-2 p-3 bg-white border border-yellow-200 rounded-lg hover:bg-yellow-50 transition-colors"
                              >
                                <Plus className="h-4 w-4 text-yellow-600" />
                                <span className="text-sm font-medium text-gray-900">New Ticket</span>
                              </button>
                              <button
                                onClick={() => setView("templates")}
                                className="flex items-center gap-2 p-3 bg-white border border-yellow-200 rounded-lg hover:bg-yellow-50 transition-colors"
                              >
                                <FileText className="h-4 w-4 text-yellow-600" />
                                <span className="text-sm font-medium text-gray-900">Use Template</span>
                              </button>
                              <button
                                onClick={() => setView("directory")}
                                className="flex items-center gap-2 p-3 bg-white border border-yellow-200 rounded-lg hover:bg-yellow-50 transition-colors"
                              >
                                <Users className="h-4 w-4 text-yellow-600" />
                                <span className="text-sm font-medium text-gray-900">Find Employee</span>
                              </button>
                              <button
                                onClick={() => setView("profile")}
                                className="flex items-center gap-2 p-3 bg-white border border-yellow-200 rounded-lg hover:bg-yellow-50 transition-colors"
                              >
                                <UserCircle className="h-4 w-4 text-yellow-600" />
                                <span className="text-sm font-medium text-gray-900">My Profile</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {view === "directory" && (
                <div className="flex-1 min-h-0 overflow-y-auto bg-yellow-50">
                  <EmployeeDirectory />
                </div>
              )}

              {view === "analytics" && (
                <div className="flex-1 min-h-0 overflow-y-auto bg-yellow-50">
                  <Analytics key={tick} tickets={tickets} />
                </div>
              )}
              {view === "audit" && (
                <div className="flex-1 min-h-0 overflow-y-auto bg-yellow-50">
                  <AuditLogViewer key={tick} logs={auditLogs} />
                </div>
              )}
              {view === "roles" && (
                <div className="flex-1 min-h-0 overflow-y-auto bg-yellow-50">
                  <RoleManagement />
                </div>
              )}
              {view === "users" && (
                <div className="flex-1 min-h-0 overflow-y-auto bg-yellow-50">
                  <UserManagement />
                </div>
              )}
              {view === "profile" && (
                <div className="flex-1 min-h-0 overflow-y-auto bg-yellow-50">
                  <ProfilePage key={tick} tickets={tickets} onSelectTicket={(t) => { setSelectedTicket(t); setView("tickets") }} />
                </div>
              )}

              {view === "templates" && (
                <div className="flex-1 min-h-0 overflow-y-auto bg-yellow-50">
                  <TicketTemplates onUseTemplate={(template) => {
                    setSelectedTemplate(template)
                    setShowCreate(true)
                  }} />
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {showCreate && (
        <CreateTicketForm 
          onClose={() => { setShowCreate(false); setSelectedTemplate(null) }} 
          onCreated={(t) => { refresh(); setSelectedTicket(t); setSelectedTemplate(null) }}
          template={selectedTemplate}
        />
      )}
    </div>
  )
}
