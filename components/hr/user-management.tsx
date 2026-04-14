"use client"

import { useState, useEffect } from "react"
import { UserPlus, Pencil, X, Check, Eye, EyeOff, KeyRound } from "lucide-react"
import type { User, Role, Department } from "@/lib/types"
import { MOCK_USERS, fetchUsersFromDb, createUserOnDb, patchUserOnDb } from "@/lib/data"
import { ROLE_HIERARCHY } from "@/lib/permissions"
import { cn } from "@/lib/utils"

const DEPARTMENTS: Department[] = ["ENGINEERING", "FINANCE", "OPERATIONS", "MARKETING", "HR"]

const ROLE_COLORS: Record<Role, string> = {
  EMPLOYEE:        "bg-yellow-50 text-yellow-800 border-yellow-300",
  HR_COORDINATOR:  "bg-blue-50 text-blue-700 border-blue-200",
  HR_SPECIALIST:   "bg-purple-50 text-purple-700 border-purple-200",
  HR_MANAGER:      "bg-green-50 text-green-700 border-green-200",
  SYSTEM_ADMIN:    "bg-orange-50 text-orange-700 border-orange-200",
  SPECIAL_OFFICER: "bg-rose-50 text-rose-700 border-rose-200",
}

const EMPTY_FORM = { name: "", email: "", role: "EMPLOYEE" as Role, department: "ENGINEERING" as Department, password: "" }

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editForm, setEditForm] = useState<Partial<User>>({})
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [resetPassword, setResetPassword] = useState<string>("")
  const [showResetPw, setShowResetPw] = useState(false)

  useEffect(() => {
    fetchUsersFromDb()
      .then((data) => { if (Array.isArray(data) && data.length > 0) setUsers(data) })
      .catch(() => {})
  }, [])

  function startEdit(user: User) {
    setEditingId(user.id)
    setEditForm({ name: user.name, email: user.email, role: user.role, department: user.department })
    setResetPassword("")
    setShowResetPw(false)
  }

  async function saveEdit(userId: string) {
    setSaving(true)
    const payload: Record<string, string> = { ...editForm as Record<string, string> }
    if (resetPassword.trim()) payload.password = resetPassword.trim()
    await patchUserOnDb(userId, payload)
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, ...editForm } : u))
    setSaving(false)
    setEditingId(null)
    setResetPassword("")
    setShowResetPw(false)
  }

  async function addUser() {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) return
    setSaving(true)
    const avatar = form.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    const { password, ...rest } = form
    const newUser = await createUserOnDb({ ...rest, avatar, password })
    if (newUser) {
      setUsers((prev) => [...prev, newUser])
    } else {
      setUsers((prev) => [...prev, { ...rest, avatar, id: `u${Date.now()}` }])
    }
    setForm(EMPTY_FORM)
    setShowAdd(false)
    setSaving(false)
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{users.length} users</span>
        </div>
        <button
          onClick={() => { setShowAdd((v) => !v); setForm(EMPTY_FORM) }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg font-medium transition-colors"
        >
          <UserPlus className="h-3.5 w-3.5" /> Add User
        </button>
      </div>

      {/* Add User Form */}
      {showAdd && (
        <div className="bg-white rounded-2xl border border-yellow-200 shadow-sm p-4 space-y-3">
          <p className="text-sm font-medium text-gray-700">New User</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="rounded-lg border border-yellow-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="rounded-lg border border-yellow-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Role }))}
              className="rounded-lg border border-yellow-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {ROLE_HIERARCHY.map((r) => <option key={r} value={r}>{r.replace(/_/g, " ")}</option>)}
            </select>
            <select
              value={form.department}
              onChange={(e) => setForm((f) => ({ ...f, department: e.target.value as Department }))}
              className="rounded-lg border border-yellow-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <div className="relative sm:col-span-2">
              <input
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="w-full rounded-lg border border-yellow-200 px-3 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg">Cancel</button>
            <button
              onClick={addUser}
              disabled={saving || !form.name.trim() || !form.email.trim() || !form.password.trim()}
              className="px-3 py-1.5 text-xs bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg font-medium disabled:opacity-50"
            >
              {saving ? "Saving…" : "Add User"}
            </button>
          </div>
        </div>
      )}

      {/* User List */}
      <div className="space-y-2">
        {users.map((user) => (
          <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-yellow-200 hover:border-yellow-300 hover:shadow-sm transition-all">
            <div className="h-9 w-9 rounded-full bg-yellow-400 flex items-center justify-center text-sm font-bold text-white shrink-0">
              {user.avatar}
            </div>

            {editingId === user.id ? (
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  value={editForm.name ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                  className="rounded-lg border border-yellow-200 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <input
                  value={editForm.email ?? ""}
                  onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                  className="rounded-lg border border-yellow-200 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <select
                  value={editForm.role ?? user.role}
                  onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value as Role }))}
                  className="rounded-lg border border-yellow-200 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  {ROLE_HIERARCHY.map((r) => <option key={r} value={r}>{r.replace(/_/g, " ")}</option>)}
                </select>
                <select
                  value={editForm.department ?? user.department}
                  onChange={(e) => setEditForm((f) => ({ ...f, department: e.target.value as Department }))}
                  className="rounded-lg border border-yellow-200 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <div className="relative sm:col-span-2">
                  <button type="button" onClick={() => setShowResetPw((v) => !v)}
                    className="flex items-center gap-1.5 text-xs text-yellow-600 hover:text-yellow-700 font-medium mb-1">
                    <KeyRound className="h-3.5 w-3.5" />
                    {showResetPw ? "Cancel reset" : "Reset password"}
                  </button>
                  {showResetPw && (
                    <div className="relative">
                      <input
                        placeholder="New password"
                        type={showPassword ? "text" : "password"}
                        value={resetPassword}
                        onChange={(e) => setResetPassword(e.target.value)}
                        className="w-full rounded-lg border border-yellow-200 px-2 py-1 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                      <button type="button" onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-400">{user.email} · {user.department}</p>
              </div>
            )}

            <div className="flex items-center gap-2 shrink-0">
              {editingId !== user.id && (
                <span className={cn("text-xs px-2 py-0.5 rounded-lg border font-medium", ROLE_COLORS[user.role])}>
                  {user.role.replace(/_/g, " ")}
                </span>
              )}
              {editingId === user.id ? (
                <>
                  <button onClick={() => saveEdit(user.id)} disabled={saving} className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-colors">
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </>
              ) : (
                <button onClick={() => startEdit(user)} className="p-1.5 rounded-lg hover:bg-yellow-50 text-gray-400 hover:text-yellow-600 transition-colors">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
