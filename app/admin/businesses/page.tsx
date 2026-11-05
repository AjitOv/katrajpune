"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  MapPin,
  Phone,
  MessageCircle,
  Filter,
  Check,
  X,
  Star,
  ShieldCheck,
  CreditCard,
  Building2,
} from "lucide-react"

interface BusinessRecord {
  id?: string
  slug: string
  name: string
  category: string
  locality: string
  address: string
  phone: string | null
  whatsapp: string | null
  email: string | null
  website: string | null
  description: string | null
  logo_url: string | null
  photos: string[]
  latitude: number
  longitude: number
  location_verified: boolean
  featured?: boolean
  status: "approved" | "pending" | "rejected"
  payment_status?: "unpaid" | "pending" | "paid" | "refunded"
  payment_id?: string | null
  created_at?: string
  updated_at?: string
}

function AdminBusinessesContent() {
  const searchParams = useSearchParams()
  const initialAction = searchParams.get("action")
  const filterStatusParam = searchParams.get("status") || "all"
  const filterPaymentParam = searchParams.get("payment_status") || "all"

  const [businesses, setBusinesses] = useState<BusinessRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState(filterStatusParam)
  const [paymentFilter, setPaymentFilter] = useState(filterPaymentParam)
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [localityFilter, setLocalityFilter] = useState("all")

  // Modal State
  const [showModal, setShowModal] = useState(initialAction === "add")
  const [editingBusiness, setEditingBusiness] = useState<BusinessRecord | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<BusinessRecord | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [modalError, setModalError] = useState<string | null>(null)
  const [authError, setAuthError] = useState(false)

  // Form State
  const [formData, setFormData] = useState<BusinessRecord>({
    slug: "",
    name: "",
    category: "shopping",
    locality: "Katraj Chowk",
    address: "",
    phone: "",
    whatsapp: "",
    email: "",
    website: "",
    description: "",
    logo_url: "",
    photos: [],
    latitude: 18.452936,
    longitude: 73.855301,
    location_verified: true,
    featured: false,
    status: "approved",
    payment_status: "unpaid",
  })

  useEffect(() => {
    loadBusinesses()
  }, [])

  async function loadBusinesses() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/businesses")
      if (res.status === 401 || res.status === 403) {
        setAuthError(true)
        return
      }
      if (res.ok) {
        setAuthError(false)
        const data = await res.json()
        setBusinesses(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Filtered List
  const filteredList = useMemo(() => {
    return businesses.filter((b) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matches =
          b.name?.toLowerCase().includes(q) ||
          b.slug?.toLowerCase().includes(q) ||
          b.phone?.includes(q) ||
          b.whatsapp?.includes(q) ||
          b.address?.toLowerCase().includes(q)
        if (!matches) return false
      }
      if (statusFilter !== "all" && b.status !== statusFilter) return false
      if (paymentFilter !== "all" && b.payment_status !== paymentFilter) return false
      if (categoryFilter !== "all" && b.category !== categoryFilter) return false
      if (localityFilter !== "all" && b.locality !== localityFilter) return false
      return true
    })
  }, [businesses, searchQuery, statusFilter, paymentFilter, categoryFilter, localityFilter])

  // Open Create Modal
  function handleOpenCreate() {
    setEditingBusiness(null)
    setModalError(null)
    setFormData({
      slug: "",
      name: "",
      category: "shopping",
      locality: "Katraj Chowk",
      address: "",
      phone: "",
      whatsapp: "",
      email: "",
      website: "",
      description: "",
      logo_url: "",
      photos: [],
      latitude: 18.452936,
      longitude: 73.855301,
      location_verified: true,
      featured: false,
      status: "approved",
      payment_status: "paid",
    })
    setShowModal(true)
  }

  // Open Edit Modal
  function handleOpenEdit(b: BusinessRecord) {
    setEditingBusiness(b)
    setModalError(null)
    setFormData({
      ...b,
      email: b.email || "",
      website: b.website || "",
      description: b.description || "",
      logo_url: b.logo_url || "",
      photos: b.photos || [],
      featured: b.featured ?? false,
      payment_status: b.payment_status || "unpaid",
    })
    setShowModal(true)
  }

  // Generate slug automatically when typing name if not editing
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (!editingBusiness) {
      const generated = `${val} ${formData.locality || "Katraj"}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
      setFormData((prev) => ({ ...prev, name: val, slug: generated }))
    } else {
      setFormData((prev) => ({ ...prev, name: val }))
    }
  }

  // Save (Create or Update)
  async function handleSaveBusiness(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setAlertMessage(null)
    setModalError(null)

    try {
      const isEdit = !!editingBusiness
      const url = isEdit
        ? `/api/admin/businesses?id=${editingBusiness.id || ""}&slug=${editingBusiness.slug}`
        : "/api/admin/businesses"
      const method = isEdit ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Save failed. Please verify all inputs.")
      }

      setAlertMessage(isEdit ? `Updated "${formData.name}"` : `Added "${formData.name}" successfully!`)
      setShowModal(false)
      loadBusinesses()
    } catch (err: any) {
      setModalError(err?.message || "Failed to save business.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Quick Status Toggle (Approve / Reject)
  async function handleStatusChange(b: BusinessRecord, nextStatus: "approved" | "rejected") {
    try {
      const res = await fetch(`/api/admin/businesses?id=${b.id || ""}&slug=${b.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      })
      if (res.ok) {
        setBusinesses((prev) =>
          prev.map((item) => (item.slug === b.slug ? { ...item, status: nextStatus } : item))
        )
        setAlertMessage(`Marked "${b.name}" as ${nextStatus}`)
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Confirm Delete
  async function handleDeleteConfirmed() {
    if (!deleteConfirm) return
    const b = deleteConfirm
    try {
      const res = await fetch(`/api/admin/businesses?id=${b.id || ""}&slug=${b.slug}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setBusinesses((prev) => prev.filter((item) => item.slug !== b.slug))
        setAlertMessage(`Deleted "${b.name}"`)
        setDeleteConfirm(null)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy">Business Listings Management</h1>
          <p className="text-xs text-gray-500">
            Total indexed: {businesses.length} businesses. Showing {filteredList.length} matching.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-navy hover:bg-blue text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Business</span>
        </button>
      </div>

      {authError && (
        <div className="p-4 bg-amber-50 border border-amber-300 text-amber-900 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div>
            <p className="font-bold text-sm">🔒 Admin Session Required</p>
            <p className="text-xs text-amber-800">
              You are currently viewing offline/cached data. Please sign in to your authorized administrator account to add or modify listings.
            </p>
          </div>
          <Link
            href="/admin/login"
            className="inline-flex items-center justify-center px-4 py-2 bg-navy hover:bg-blue text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap"
          >
            Sign In to Admin Console →
          </Link>
        </div>
      )}

      {alertMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between">
          <span>{alertMessage}</span>
          <button onClick={() => setAlertMessage(null)} className="text-emerald-600 hover:text-emerald-900">
            ✕
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-navy/10 p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by business name, phone, whatsapp, or address..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-navy/20 text-xs focus:outline-none focus:border-orange"
            />
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-navy/20 text-xs focus:outline-none focus:border-orange bg-white"
          >
            <option value="all">Status: All</option>
            <option value="approved">Status: Approved</option>
            <option value="pending">Status: Pending</option>
            <option value="rejected">Status: Rejected</option>
          </select>

          {/* Payment Status Dropdown */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-navy/20 text-xs focus:outline-none focus:border-orange bg-white"
          >
            <option value="all">Payment: All</option>
            <option value="paid">Payment: Paid (₹350)</option>
            <option value="pending">Payment: Pending</option>
            <option value="unpaid">Payment: Unpaid</option>
          </select>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-navy/20 text-xs focus:outline-none focus:border-orange bg-white"
          >
            <option value="all">Category: All</option>
            <option value="restaurants">Restaurants</option>
            <option value="shopping">Shopping</option>
            <option value="healthcare">Healthcare</option>
            <option value="education">Education</option>
            <option value="home_services">Home Services</option>
            <option value="automotive">Automotive</option>
            <option value="fitness">Fitness</option>
            <option value="professional_services">Professional Services</option>
          </select>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-navy/10 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500">Loading listings database...</div>
        ) : filteredList.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <p className="text-sm font-bold text-navy">No businesses match the selected filters.</p>
            <p className="text-xs text-gray-400">Try clearing search terms or selecting "All" statuses.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy/5 text-navy/70 uppercase tracking-wider font-bold border-b border-navy/10">
                <tr>
                  <th className="p-3.5">Business &amp; Locality</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Contact &amp; WhatsApp</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Payment</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/5">
                {filteredList.slice(0, 100).map((b) => (
                  <tr key={b.slug} className="hover:bg-navy/[0.02] transition-colors">
                    <td className="p-3.5 max-w-xs">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/business/${b.slug}`}
                            target="_blank"
                            className="font-bold text-navy hover:text-orange flex items-center gap-1"
                          >
                            <span>{b.name}</span>
                            <ExternalLink className="w-3 h-3 text-gray-400" />
                          </Link>
                          {b.featured && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                              ★ Featured
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 truncate mt-0.5">
                          {b.locality || "Katraj"} • {b.address}
                        </p>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="capitalize font-medium text-navy/80">
                        {b.category?.replace(/_/g, " ")}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div className="space-y-0.5 text-[11px]">
                        {b.whatsapp && (
                          <span className="flex items-center gap-1 text-emerald-700 font-medium">
                            <MessageCircle className="w-3 h-3 text-emerald-500" />
                            {b.whatsapp}
                          </span>
                        )}
                        {b.phone && b.phone !== b.whatsapp && (
                          <span className="flex items-center gap-1 text-gray-600">
                            <Phone className="w-3 h-3 text-gray-400" />
                            {b.phone}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="space-y-0.5 text-[11px]">
                        <span className="font-mono text-gray-500">
                          {b.latitude?.toFixed(4)}, {b.longitude?.toFixed(4)}
                        </span>
                        <div>
                          {b.location_verified ? (
                            <span className="text-emerald-600 font-bold text-[10px]">✓ Verified</span>
                          ) : (
                            <span className="text-gray-400 text-[10px]">Unverified</span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          b.payment_status === "paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : b.payment_status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <CreditCard className="w-2.5 h-2.5" />
                        <span>{b.payment_status || "unpaid"}</span>
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          b.status === "approved"
                            ? "bg-blue-100 text-blue-800"
                            : b.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {b.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleStatusChange(b, "approved")}
                              title="Approve Listing"
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(b, "rejected")}
                              title="Reject Listing"
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleOpenEdit(b)}
                          title="Edit Details"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-blue hover:bg-blue/5 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(b)}
                          title="Delete Listing"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit / Create Business Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full overflow-hidden border border-navy/10 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-navy p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">
                  {editingBusiness ? `Edit: ${editingBusiness.name}` : "Add New Business Listing"}
                </h3>
                <p className="text-[11px] text-white/70">
                  Update directory data, contact channels, location coordinates and moderation state.
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-white/70 hover:text-white font-bold text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBusiness} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleNameChange}
                    className="w-full px-3 py-2 rounded-xl border border-navy/20 focus:outline-none focus:border-orange"
                  />
                </div>

                <div>
                  <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                    URL Slug (Preserve for SEO) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-navy/20 focus:outline-none focus:border-orange font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-navy/20 focus:outline-none focus:border-orange bg-white"
                  >
                    <option value="restaurants">Restaurants</option>
                    <option value="shopping">Shopping</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                    <option value="home_services">Home Services</option>
                    <option value="automotive">Automotive</option>
                    <option value="fitness">Fitness</option>
                    <option value="professional_services">Professional Services</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                    Locality in Katraj
                  </label>
                  <input
                    type="text"
                    value={formData.locality || ""}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    placeholder="e.g. Bharati Vidyapeeth, Katraj Chowk"
                    className="w-full px-3 py-2 rounded-xl border border-navy/20 focus:outline-none focus:border-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                  Full Address
                </label>
                <input
                  type="text"
                  value={formData.address || ""}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Shop No., Landmark, Katraj, Pune 411046"
                  className="w-full px-3 py-2 rounded-xl border border-navy/20 focus:outline-none focus:border-orange"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsapp || ""}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl border border-navy/20 focus:outline-none focus:border-orange"
                  />
                </div>

                <div>
                  <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                    Calling Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl border border-navy/20 focus:outline-none focus:border-orange"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="store@example.com"
                    className="w-full px-3 py-2 rounded-xl border border-navy/20 focus:outline-none focus:border-orange"
                  />
                </div>

                <div>
                  <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={formData.website || ""}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 rounded-xl border border-navy/20 focus:outline-none focus:border-orange"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    required
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-navy/20 focus:outline-none focus:border-orange font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    required
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-navy/20 focus:outline-none focus:border-orange font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                  Logo / Photo URL
                </label>
                <input
                  type="url"
                  value={formData.logo_url || ""}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  placeholder="https://lh3.googleusercontent.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-navy/20 focus:outline-none focus:border-orange"
                />
              </div>

              <div>
                <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-navy/20 focus:outline-none focus:border-orange"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-navy/10">
                <div>
                  <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                    Listing Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-navy/20 focus:outline-none focus:border-orange bg-white"
                  >
                    <option value="approved">Approved (Live)</option>
                    <option value="pending">Pending Review</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                    Payment Status
                  </label>
                  <select
                    value={formData.payment_status}
                    onChange={(e) => setFormData({ ...formData, payment_status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-navy/20 focus:outline-none focus:border-orange bg-white"
                  >
                    <option value="paid">Paid (₹350 Verified)</option>
                    <option value="pending">Pending Payment</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.location_verified}
                    onChange={(e) => setFormData({ ...formData, location_verified: e.target.checked })}
                    className="rounded text-orange focus:ring-orange"
                  />
                  <span className="font-bold text-navy">Location Verified Checkmark</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded text-orange focus:ring-orange"
                  />
                  <span className="font-bold text-navy">Featured / Premium Listing</span>
                </label>
              </div>

              {modalError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold flex items-start gap-2">
                  <span className="text-base leading-none">⚠️</span>
                  <span>{modalError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-navy/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-navy/20 text-navy font-bold hover:bg-navy/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-navy hover:bg-blue text-white font-bold disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : editingBusiness ? "Save Changes" : "Create Business"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-sm w-full p-6 space-y-4 border border-rose-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-black text-navy text-base">Delete Listing?</h3>
              <p className="text-xs text-gray-500">
                Are you sure you want to permanently delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 rounded-xl border border-navy/20 text-navy font-bold text-xs hover:bg-navy/5"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminBusinessesPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading listings console...</div>}>
      <AdminBusinessesContent />
    </Suspense>
  )
}
