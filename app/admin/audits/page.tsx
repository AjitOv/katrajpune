"use client"

import { useState, useEffect } from "react"
import {
  Sparkles,
  Search,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  Clock,
  Globe,
  Building2,
  Phone,
  Mail,
} from "lucide-react"

interface AuditEnquiry {
  id: string
  business_name: string
  owner_name: string
  phone: string
  email: string | null
  website_url: string | null
  category: string | null
  status: "new" | "in_progress" | "completed" | "contacted"
  notes: string | null
  created_at: string
}

export default function AdminAuditsPage() {
  const [enquiries, setEnquiries] = useState<AuditEnquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    loadEnquiries()
  }, [])

  async function loadEnquiries() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/audits")
      if (res.ok) {
        const data = await res.json()
        setEnquiries(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(id: string, nextStatus: string) {
    try {
      const res = await fetch(`/api/admin/audits?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      })
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: nextStatus as any } : item))
        )
      }
    } catch (err) {
      console.error(err)
    }
  }

  const filtered = enquiries.filter(
    (e) =>
      e.business_name?.toLowerCase().includes(search.toLowerCase()) ||
      e.owner_name?.toLowerCase().includes(search.toLowerCase()) ||
      e.phone?.includes(search)
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Merchant Lead Generation</span>
          </div>
          <h1 className="text-2xl font-black text-navy">Free Zotoz AI Visibility Audit Leads</h1>
          <p className="text-xs text-gray-500">
            Local Katraj merchants who requested an AI Search audit report. Contact them on WhatsApp with their analysis.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl border border-navy/10 p-4 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search enquiries by business name, owner, or phone..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-navy/20 text-xs focus:outline-none focus:border-orange"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-navy/10 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500">Loading audit requests...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <p className="text-sm font-bold text-navy">No audit requests found.</p>
            <p className="text-xs text-gray-400">
              New submissions from <code className="bg-gray-100 px-1 py-0.5 rounded text-[11px]">/free-ai-audit</code> will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy/5 text-navy/70 uppercase tracking-wider font-bold border-b border-navy/10">
                <tr>
                  <th className="p-3.5">Business &amp; Category</th>
                  <th className="p-3.5">Owner Contact</th>
                  <th className="p-3.5">Website</th>
                  <th className="p-3.5">Requested Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/5">
                {filtered.map((enquiry) => {
                  const cleanPhone = enquiry.phone.replace(/[^0-9]/g, "")
                  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    `Hello ${enquiry.owner_name}, regarding your Free Zotoz AI Visibility Audit request for "${enquiry.business_name}" on KatrajPune...`
                  )}`

                  return (
                    <tr key={enquiry.id} className="hover:bg-navy/[0.02] transition-colors">
                      <td className="p-3.5">
                        <p className="font-bold text-navy text-sm">{enquiry.business_name}</p>
                        <p className="text-[11px] text-gray-500 capitalize">
                          {enquiry.category?.replace(/_/g, " ") || "General"}
                        </p>
                      </td>

                      <td className="p-3.5">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-navy">{enquiry.owner_name}</p>
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-emerald-700 font-bold hover:underline flex items-center gap-1"
                          >
                            <MessageCircle className="w-3 h-3 text-emerald-500" />
                            <span>{enquiry.phone}</span>
                          </a>
                          {enquiry.email && (
                            <p className="text-[10px] text-gray-400 flex items-center gap-1">
                              <Mail className="w-2.5 h-2.5" />
                              <span>{enquiry.email}</span>
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="p-3.5">
                        {enquiry.website_url ? (
                          <a
                            href={enquiry.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue hover:underline flex items-center gap-1 font-mono text-[11px]"
                          >
                            <Globe className="w-3 h-3" />
                            <span className="truncate max-w-[150px]">{enquiry.website_url}</span>
                          </a>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      <td className="p-3.5 text-[11px] text-gray-500 font-mono">
                        {new Date(enquiry.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="p-3.5">
                        <select
                          value={enquiry.status}
                          onChange={(e) => handleStatusChange(enquiry.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border ${
                            enquiry.status === "completed"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : enquiry.status === "in_progress"
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="contacted">Contacted</option>
                        </select>
                      </td>

                      <td className="p-3.5 text-right">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-sm transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Chat</span>
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
