"use client"

import { useState } from "react"
import {
  FileText, Plus, Search, X, ChevronRight,
  Monitor, Users, Building2, Zap, Tag
} from "lucide-react"
import { cn } from "@/lib/utils"

interface TicketTemplate {
  id: string
  name: string
  description: string
  category: string
  priority: "LOW" | "MEDIUM" | "HIGH"
  title: string
  content: string
  tags: string[]
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "IT Support": <Monitor className="h-4 w-4" />,
  "HR":         <Users className="h-4 w-4" />,
  "Facilities": <Building2 className="h-4 w-4" />,
  "General":    <Zap className="h-4 w-4" />,
}

const PRIORITY_STYLES = {
  HIGH:   { pill: "bg-red-50 text-red-700 border-red-200",         dot: "bg-red-500",    header: "from-red-400 to-red-500" },
  MEDIUM: { pill: "bg-yellow-50 text-yellow-700 border-yellow-300", dot: "bg-yellow-500", header: "from-yellow-400 to-yellow-500" },
  LOW:    { pill: "bg-green-50 text-green-700 border-green-200",    dot: "bg-green-500",  header: "from-green-400 to-green-500" },
}

const defaultTemplates: TicketTemplate[] = [
  {
    id: "1",
    name: "Password Reset",
    description: "Request to reset user password",
    category: "IT Support",
    priority: "MEDIUM",
    title: "Password Reset Request",
    content: "I need assistance resetting my password. I am unable to access my account.\n\nPlease provide the following information:\n- Username/Email: \n- Last successful login: \n- Error message (if any): ",
    tags: ["password", "login", "access"],
  },
  {
    id: "2",
    name: "Software Installation",
    description: "Request to install new software",
    category: "IT Support",
    priority: "LOW",
    title: "Software Installation Request",
    content: "I need the following software installed on my computer:\n\nSoftware Name: \nVersion: \nPurpose: \nUrgency: \n\nAdditional requirements or notes: ",
    tags: ["software", "installation", "tools"],
  },
  {
    id: "3",
    name: "Hardware Issue",
    description: "Report hardware malfunction",
    category: "IT Support",
    priority: "HIGH",
    title: "Hardware Issue Report",
    content: "I am experiencing issues with the following hardware:\n\nDevice: \nIssue Description: \nWhen did this start: \nSteps to reproduce: \nImpact on work: \n\nTroubleshooting steps already tried: ",
    tags: ["hardware", "malfunction", "urgent"],
  },
  {
    id: "4",
    name: "Leave Request",
    description: "Request for time off",
    category: "HR",
    priority: "MEDIUM",
    title: "Leave Request",
    content: "I am requesting time off for the following:\n\nType of Leave: \nStart Date: \nEnd Date: \nNumber of Days: \nReason: \n\nContact during leave: \nWork coverage plan: ",
    tags: ["leave", "vacation", "hr"],
  },
  {
    id: "5",
    name: "Office Supplies",
    description: "Request for office supplies",
    category: "Facilities",
    priority: "LOW",
    title: "Office Supplies Request",
    content: "I need the following office supplies:\n\nItems needed:\n- \n- \n- \n\nQuantity for each: \nUrgency: \nDelivery location: \n\nJustification: ",
    tags: ["supplies", "office", "facilities"],
  },
  {
    id: "6",
    name: "Training Request",
    description: "Request for training or certification",
    category: "HR",
    priority: "MEDIUM",
    title: "Training Request",
    content: "I would like to request training for:\n\nTraining Topic/Course: \nProvider: \nDuration: \nCost (if known): \n\nBusiness justification: \nExpected outcomes: \nTimeline preference: ",
    tags: ["training", "development", "hr"],
  },
]

const EMPTY_FORM: Partial<TicketTemplate> = {
  name: "", description: "", category: "", priority: "MEDIUM", title: "", content: "", tags: [],
}

interface TicketTemplatesProps {
  onUseTemplate: (template: TicketTemplate) => void
}

export default function TicketTemplates({ onUseTemplate }: TicketTemplatesProps) {
  const [templates, setTemplates] = useState<TicketTemplate[]>(defaultTemplates)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [preview, setPreview] = useState<TicketTemplate | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState<Partial<TicketTemplate>>(EMPTY_FORM)
  const [tagInput, setTagInput] = useState("")

  const categories = ["All", ...Array.from(new Set(templates.map((t) => t.category)))]

  const filtered = templates.filter((t) => {
    const q = search.toLowerCase()
    const matchSearch = !q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags.some((tag) => tag.includes(q))
    const matchCat = categoryFilter === "All" || t.category === categoryFilter
    return matchSearch && matchCat
  })

  function handleCreate() {
    if (!form.name || !form.title || !form.content) return
    const t: TicketTemplate = {
      id: Date.now().toString(),
      name: form.name,
      description: form.description || "",
      category: form.category || "General",
      priority: (form.priority as TicketTemplate["priority"]) || "MEDIUM",
      title: form.title,
      content: form.content,
      tags: form.tags || [],
    }
    setTemplates((prev) => [...prev, t])
    setForm(EMPTY_FORM)
    setTagInput("")
    setShowCreate(false)
  }

  function closeCreate() {
    setShowCreate(false)
    setForm(EMPTY_FORM)
    setTagInput("")
  }

  function addTag() {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !(form.tags ?? []).includes(tag)) {
      setForm((f) => ({ ...f, tags: [...(f.tags ?? []), tag] }))
    }
    setTagInput("")
  }

  function removeTag(tag: string) {
    setForm((f) => ({ ...f, tags: (f.tags ?? []).filter((t) => t !== tag) }))
  }

  const inputCls = "w-full rounded-xl border border-yellow-200 bg-yellow-50 px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-colors"

  return (
    <div className="p-6 space-y-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-sm">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Ticket Templates</h2>
            <p className="text-xs text-gray-400">{templates.length} templates · pick one to get started fast</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-semibold transition-colors shadow-sm"
        >
          <Plus className="h-3.5 w-3.5" /> New Template
        </button>
      </div>

      {/* ── Search + Category Filter ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-yellow-200 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                "flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border font-medium transition-colors",
                categoryFilter === cat
                  ? "bg-yellow-400 border-yellow-500 text-white shadow-sm"
                  : "bg-white border-yellow-200 text-gray-500 hover:border-yellow-400 hover:text-gray-700"
              )}
            >
              {CATEGORY_ICONS[cat] ?? <Tag className="h-3.5 w-3.5" />}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total",         value: templates.length,                                    color: "text-gray-700",   bg: "bg-white" },
          { label: "High Priority", value: templates.filter((t) => t.priority === "HIGH").length, color: "text-red-600",    bg: "bg-red-50" },
          { label: "Showing",       value: filtered.length,                                     color: "text-yellow-700", bg: "bg-yellow-50" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={cn("rounded-xl border border-yellow-200 p-3 text-center shadow-sm", bg)}>
            <p className={cn("text-xl font-bold", color)}>{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Template Grid ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <FileText className="h-10 w-10 mb-3 opacity-30" />
          <p className="text-sm font-medium">No templates found</p>
          <p className="text-xs mt-1">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((template) => {
            const ps = PRIORITY_STYLES[template.priority]
            const icon = CATEGORY_ICONS[template.category] ?? <Tag className="h-4 w-4" />
            return (
              <div
                key={template.id}
                className="group bg-white rounded-2xl border border-yellow-200 hover:border-yellow-400 hover:shadow-md transition-all duration-150 flex flex-col overflow-hidden"
              >
                <div className="h-1 w-full bg-gradient-to-r from-yellow-300 to-yellow-500" />
                <div className="p-4 flex flex-col flex-1 gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-8 w-8 rounded-lg bg-yellow-50 border border-yellow-200 flex items-center justify-center text-yellow-600 shrink-0">
                        {icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{template.name}</p>
                        <p className="text-xs text-gray-400 truncate">{template.category}</p>
                      </div>
                    </div>
                    <span className={cn("text-xs px-2 py-0.5 rounded-lg border font-semibold shrink-0 flex items-center gap-1", ps.pill)}>
                      <span className={cn("h-1.5 w-1.5 rounded-full", ps.dot)} />
                      {template.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{template.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {template.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-700 font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-auto pt-1">
                    <button
                      onClick={() => setPreview(template)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-yellow-200 text-xs font-semibold text-gray-600 hover:bg-yellow-50 hover:border-yellow-300 transition-colors"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => onUseTemplate(template)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-semibold transition-colors shadow-sm"
                    >
                      Use <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Preview Modal ── */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-yellow-200 flex flex-col overflow-hidden">
            <div className={cn("flex items-center justify-between px-5 py-4 rounded-t-2xl bg-gradient-to-r", PRIORITY_STYLES[preview.priority].header)}>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-white" />
                <span className="text-sm font-bold text-white">{preview.name}</span>
              </div>
              <button onClick={() => setPreview(null)} className="text-white/70 hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto max-h-[70vh]">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn("text-xs px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1.5", PRIORITY_STYLES[preview.priority].pill)}>
                  <span className={cn("h-1.5 w-1.5 rounded-full", PRIORITY_STYLES[preview.priority].dot)} />
                  {preview.priority}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-700 font-semibold">
                  {preview.category}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Default Title</p>
                <p className="text-sm font-semibold text-gray-800 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2.5">
                  {preview.title}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Content Template</p>
                <pre className="text-xs text-gray-700 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-3 whitespace-pre-wrap font-sans leading-relaxed max-h-48 overflow-y-auto">
                  {preview.content}
                </pre>
              </div>
              {preview.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {preview.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-700 font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setPreview(null)}
                  className="flex-1 py-2.5 rounded-xl border-2 border-yellow-200 text-sm font-semibold text-gray-600 hover:bg-yellow-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => { onUseTemplate(preview); setPreview(null) }}
                  className="flex-1 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-white text-sm font-bold transition-colors shadow-sm"
                >
                  Use This Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Create Template Modal ── */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-yellow-200 flex flex-col overflow-hidden max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-t-2xl shrink-0">
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-white" />
                <span className="text-sm font-bold text-white">New Template</span>
              </div>
              <button onClick={closeCreate} className="text-white/70 hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 overflow-y-auto flex-1">

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Name <span className="text-red-400">*</span></label>
                  <input
                    value={form.name || ""}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g., Password Reset"
                    className={inputCls}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Category</label>
                  <input
                    value={form.category || ""}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    placeholder="e.g., IT Support"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Description</label>
                <input
                  value={form.description || ""}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description"
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Priority</label>
                  <div className="flex gap-1.5">
                    {(["LOW", "MEDIUM", "HIGH"] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, priority: p }))}
                        className={cn(
                          "flex-1 py-2 rounded-xl border text-xs font-bold transition-colors",
                          form.priority === p
                            ? PRIORITY_STYLES[p].pill
                            : "border-yellow-200 bg-yellow-50 text-gray-400 hover:border-yellow-300 hover:text-gray-600"
                        )}
                      >
                        {p[0] + p.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Default Title <span className="text-red-400">*</span></label>
                  <input
                    value={form.title || ""}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Ticket title"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Content <span className="text-red-400">*</span></label>
                <textarea
                  value={form.content || ""}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  placeholder="Template body with placeholders..."
                  rows={5}
                  className={cn(inputCls, "resize-none")}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Tags</label>
                <div className="flex gap-2">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="Add tag + Enter"
                    className={inputCls}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-3 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-white text-xs font-bold transition-colors shrink-0"
                  >
                    Add
                  </button>
                </div>
                {(form.tags ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(form.tags ?? []).map((tag) => (
                      <span key={tag} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-700 font-medium">
                        #{tag}
                        <button onClick={() => removeTag(tag)} className="text-yellow-400 hover:text-red-500 transition-colors">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={closeCreate}
                  className="flex-1 py-2.5 rounded-xl border-2 border-yellow-200 text-sm font-semibold text-gray-600 hover:bg-yellow-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!form.name || !form.title || !form.content}
                  className="flex-1 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors shadow-sm"
                >
                  Create Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
