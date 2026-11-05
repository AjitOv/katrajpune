"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Play,
  Pause,
  Trash2,
  Edit,
  ExternalLink,
  Eye,
  MousePointerClick,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"

interface AdCampaign {
  id: string
  name: string
  advertiser_name: string
  image_url: string
  destination_url: string
  placement: string
  start_date: string
  end_date: string
  priority: number
  status: "active" | "paused" | "scheduled" | "ended"
  notes?: string
  impressions_count: number
  clicks_count: number
}

const PLACEMENT_LABELS: Record<string, string> = {
  homepage_top: "1. Homepage Top Banner",
  homepage_promo: "2. Homepage Promotional Section",
  directory_between: "3. Between Directory Listings",
  category_banner: "4. Category Page Banner",
  business_profile: "5. Business Profile Banner",
  sponsored_listing: "6. Sponsored Business Listing",
}

export default function AdminAdsPage() {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<AdCampaign | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    advertiser_name: "",
    image_url: "",
    destination_url: "",
    placement: "homepage_top",
    start_date: new Date().toISOString().slice(0, 10),
    end_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    priority: 1,
    status: "active",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    loadCampaigns()
  }, [])

  async function loadCampaigns() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/ads")
      if (res.ok) {
        const data = await res.json()
        setCampaigns(data || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function handleOpenCreate() {
    setEditingCampaign(null)
    setFormData({
      name: "",
      advertiser_name: "",
      image_url: "",
      destination_url: "",
      placement: "homepage_top",
      start_date: new Date().toISOString().slice(0, 10),
      end_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      priority: 1,
      status: "active",
      notes: "",
    })
    setShowModal(true)
  }

  function handleOpenEdit(c: AdCampaign) {
    setEditingCampaign(c)
    setFormData({
      name: c.name,
      advertiser_name: c.advertiser_name,
      image_url: c.image_url,
      destination_url: c.destination_url,
      placement: c.placement,
      start_date: c.start_date,
      end_date: c.end_date,
      priority: c.priority,
      status: c.status,
      notes: c.notes || "",
    })
    setShowModal(true)
  }

  async function handleSaveCampaign(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const url = editingCampaign ? `/api/admin/ads?id=${editingCampaign.id}` : "/api/admin/ads"
      const method = editingCampaign ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Save failed")

      setMessage(editingCampaign ? "Campaign updated successfully" : "Campaign created successfully")
      setShowModal(false)
      loadCampaigns()
    } catch (err: any) {
      setMessage(`Error: ${err?.message || "Failed to save"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleToggleStatus(c: AdCampaign) {
    const nextStatus = c.status === "active" ? "paused" : "active"
    try {
      const res = await fetch(`/api/admin/ads?id=${c.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      })
      if (res.ok) {
        setCampaigns((prev) =>
          prev.map((item) => (item.id === c.id ? { ...item, status: nextStatus } : item))
        )
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function handleDelete(c: AdCampaign) {
    if (!confirm(`Are you sure you want to delete campaign "${c.name}"?`)) return

    try {
      const res = await fetch(`/api/admin/ads?id=${c.id}`, { method: "DELETE" })
      if (res.ok) {
        setCampaigns((prev) => prev.filter((item) => item.id !== c.id))
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy">Advertising Campaigns</h1>
          <p className="text-xs text-gray-500">
            Manage sponsored banners, placements, scheduling, and view performance metrics.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-navy hover:bg-blue text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Ad Campaign</span>
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
          {message}
        </div>
      )}

      {/* Campaigns Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-navy/10 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500">Loading ad campaigns...</div>
        ) : campaigns.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm font-bold text-navy">No ad campaigns found.</p>
            <p className="text-xs text-gray-500">Create your first ad campaign to promote local businesses across KatrajPune.</p>
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-orange hover:underline pt-2"
            >
              <Plus className="w-4 h-4" /> Create first campaign
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy/5 text-navy/70 uppercase tracking-wider font-bold border-b border-navy/10">
                <tr>
                  <th className="p-3.5">Campaign &amp; Advertiser</th>
                  <th className="p-3.5">Placement</th>
                  <th className="p-3.5">Dates</th>
                  <th className="p-3.5">Performance</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/5">
                {campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-navy/[0.02] transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={c.image_url}
                          alt={c.name}
                          className="w-12 h-8 rounded-lg object-cover bg-gray-100 border border-navy/10"
                        />
                        <div>
                          <p className="font-bold text-navy">{c.name}</p>
                          <p className="text-[11px] text-gray-500">{c.advertiser_name}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="font-medium text-navy/80">
                        {PLACEMENT_LABELS[c.placement] || c.placement}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <p className="text-[11px] font-mono text-gray-600">
                        {c.start_date} → {c.end_date}
                      </p>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-3 text-[11px]">
                        <span className="flex items-center gap-1 text-gray-600" title="Impressions">
                          <Eye className="w-3.5 h-3.5 text-blue-500" />
                          <span>{c.impressions_count || 0}</span>
                        </span>
                        <span className="flex items-center gap-1 text-gray-600" title="Clicks">
                          <MousePointerClick className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{c.clicks_count || 0}</span>
                        </span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          c.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : c.status === "paused"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            c.status === "active" ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        />
                        {c.status}
                      </span>
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleStatus(c)}
                          title={c.status === "active" ? "Pause Campaign" : "Activate Campaign"}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-navy hover:bg-navy/5"
                        >
                          {c.status === "active" ? (
                            <Pause className="w-4 h-4 text-amber-600" />
                          ) : (
                            <Play className="w-4 h-4 text-emerald-600" />
                          )}
                        </button>
                        <button
                          onClick={() => handleOpenEdit(c)}
                          title="Edit Campaign"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-blue hover:bg-blue/5"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c)}
                          title="Delete Campaign"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50"
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

      {/* Create / Edit Campaign Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full overflow-hidden border border-navy/10 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-navy p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">
                  {editingCampaign ? "Edit Campaign" : "Create New Ad Campaign"}
                </h3>
                <p className="text-[11px] text-white/70">
                  Target Katraj audience with responsive sponsored placements.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/70 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCampaign} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                  Campaign Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Diwali Sweet Box 20% Off"
                  className="w-full px-3 py-2 rounded-xl border border-navy/20 focus:outline-none focus:border-orange"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                    Advertiser Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.advertiser_name}
                    onChange={(e) => setFormData({ ...formData, advertiser_name: e.target.value })}
                    placeholder="e.g. Shreeji Sweets"
                    className="w-full px-3 py-2 rounded-xl border border-navy/20 focus:outline-none focus:border-orange"
                  />
                </div>

                <div>
                  <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                    Placement *
                  </label>
                  <select
                    value={formData.placement}
                    onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-navy/20 focus:outline-none focus:border-orange bg-white"
                  >
                    <option value="homepage_top">1. Homepage Top Banner</option>
                    <option value="homepage_promo">2. Homepage Promotional Section</option>
                    <option value="directory_between">3. Between Directory Listings</option>
                    <option value="category_banner">4. Category Page Banner</option>
                    <option value="business_profile">5. Business Profile Banner</option>
                    <option value="sponsored_listing">6. Sponsored Business Listing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                  Banner Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/banner.jpg"
                  className="w-full px-3 py-2 rounded-xl border border-navy/20 focus:outline-none focus:border-orange"
                />
                {formData.image_url && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-navy/10 max-h-24 bg-gray-100">
                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                  Destination URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.destination_url}
                  onChange={(e) => setFormData({ ...formData, destination_url: e.target.value })}
                  placeholder="https://wa.me/919876543210 or website link"
                  className="w-full px-3 py-2 rounded-xl border border-navy/20 focus:outline-none focus:border-orange"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-navy/20 focus:outline-none focus:border-orange"
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-navy/20 focus:outline-none focus:border-orange"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                    Display Priority (1-10)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl border border-navy/20 focus:outline-none focus:border-orange"
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-navy/20 focus:outline-none focus:border-orange bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="ended">Ended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                  Internal Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Notes about client payment, contact, or campaign goals..."
                  className="w-full px-3 py-2 rounded-xl border border-navy/20 focus:outline-none focus:border-orange"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-navy/10">
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
                  {isSubmitting ? "Saving..." : editingCampaign ? "Save Changes" : "Create Campaign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
