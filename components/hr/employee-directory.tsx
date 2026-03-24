"use client"

import { useState } from "react"
import { Search, Users, Mail, Phone, MapPin, Calendar, UserCheck } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { MOCK_USERS } from "@/lib/data"
import type { User, Role } from "@/lib/types"

const ROLE_COLORS: Record<Role, string> = {
  EMPLOYEE:       "bg-yellow-50 text-yellow-800 border-yellow-300",
  HR_COORDINATOR: "bg-blue-50 text-blue-700 border-blue-200",
  HR_SPECIALIST:  "bg-purple-50 text-purple-700 border-purple-200",
  HR_MANAGER:     "bg-green-50 text-green-700 border-green-200",
  SYSTEM_ADMIN:   "bg-orange-50 text-orange-700 border-orange-200",
}

const DEPARTMENT_COLORS: Record<string, string> = {
  ENGINEERING: "bg-blue-50 text-blue-700 border-blue-200",
  FINANCE:     "bg-green-50 text-green-700 border-green-200",
  OPERATIONS:  "bg-purple-50 text-purple-700 border-purple-200",
  MARKETING:   "bg-pink-50 text-pink-700 border-pink-200",
  HR:          "bg-orange-50 text-orange-700 border-orange-200",
}

export function EmployeeDirectory() {
  const [search, setSearch] = useState("")
  const [deptFilter, setDeptFilter] = useState<string>("ALL")
  const [roleFilter, setRoleFilter] = useState<string>("ALL")

  const departments = Array.from(new Set(MOCK_USERS.map(u => u.department)))
  const roles = Array.from(new Set(MOCK_USERS.map(u => u.role)))

  const filtered = MOCK_USERS.filter((user) => {
    const matchSearch = search.trim() === "" ||
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.department.toLowerCase().includes(search.toLowerCase())
    const matchDept = deptFilter === "ALL" || user.department === deptFilter
    const matchRole = roleFilter === "ALL" || user.role === roleFilter
    return matchSearch && matchDept && matchRole
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-yellow-600" />
          <h2 className="text-lg font-bold text-gray-900">Employee Directory</h2>
        </div>
        <div className="text-sm text-gray-500">
          {filtered.length} of {MOCK_USERS.length} employees
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or department..."
            className="pl-9 bg-white border-yellow-200 text-gray-800 placeholder:text-gray-400 rounded-xl focus:ring-yellow-400"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
            <span>Department:</span>
          </div>
          <button
            onClick={() => setDeptFilter("ALL")}
            className={cn("text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors",
              deptFilter === "ALL" ? "bg-yellow-400 border-yellow-500 text-white" : "bg-white border-yellow-200 text-gray-500 hover:border-yellow-400 hover:text-gray-700")}
          >
            All
          </button>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setDeptFilter(dept)}
              className={cn("text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors",
                deptFilter === dept ? "bg-yellow-400 border-yellow-500 text-white" : "bg-white border-yellow-200 text-gray-500 hover:border-yellow-400 hover:text-gray-700")}
            >
              {dept}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
            <span>Role:</span>
          </div>
          <button
            onClick={() => setRoleFilter("ALL")}
            className={cn("text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors",
              roleFilter === "ALL" ? "bg-yellow-400 border-yellow-500 text-white" : "bg-white border-yellow-200 text-gray-500 hover:border-yellow-400 hover:text-gray-700")}
          >
            All
          </button>
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={cn("text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors",
                roleFilter === role ? "bg-yellow-400 border-yellow-500 text-white" : "bg-white border-yellow-200 text-gray-500 hover:border-yellow-400 hover:text-gray-700")}
            >
              {role.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-xl border border-yellow-200 p-4 hover:border-yellow-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-full bg-yellow-400 flex items-center justify-center text-lg font-bold text-white shrink-0">
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900 truncate">{user.name}</h3>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>

                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge className={cn("text-xs border", ROLE_COLORS[user.role])}>
                    {user.role.replace("_", " ")}
                  </Badge>
                  <Badge className={cn("text-xs border", DEPARTMENT_COLORS[user.department] || "bg-gray-50 text-gray-700 border-gray-200")}>
                    {user.department}
                  </Badge>
                </div>

                <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <UserCheck className="h-3 w-3" />
                    <span>ID: {user.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No employees found matching your criteria</p>
        </div>
      )}
    </div>
  )
}