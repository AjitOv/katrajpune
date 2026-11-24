"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, Phone, MapPin, MessageCircle, Clock, CheckCircle2, Send, Building } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 600)
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12 text-navy">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange/10 text-orange text-xs font-bold uppercase tracking-wider">
            <Mail className="w-4 h-4" />
            <span>Get in Touch</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-navy tracking-tight">
            Contact KatrajPune
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Have questions about a listing, need assistance with your business verification, or want to report an inaccurate phone number? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Official Contact Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-navy/10 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-navy flex items-center gap-2">
                <Building className="w-5 h-5 text-orange" />
                Office &amp; Support Hub
              </h2>

              <div className="space-y-4 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-orange shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-navy">Physical Location:</p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Katraj Chowk, Pune-Satara Road,<br />
                      Katraj, Pune, Maharashtra 411046, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-navy">WhatsApp Support Hotline:</p>
                    <a
                      href="https://wa.me/917020888195"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-700 font-bold hover:underline block mt-0.5"
                    >
                      +91 70208 88195 (Fastest Response)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-navy">Official Email:</p>
                    <a
                      href="mailto:contact@katrajpune.com"
                      className="text-xs text-blue-700 font-bold hover:underline block mt-0.5"
                    >
                      contact@katrajpune.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-navy">Operational Hours:</p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Monday to Saturday: 9:30 AM – 7:00 PM IST<br />
                      Sunday: WhatsApp Emergency Support Only
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Action Box */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                <p className="text-xs font-bold text-emerald-950">Need Immediate Assistance?</p>
                <p className="text-[11px] text-emerald-800">
                  Our local support team in Katraj responds to WhatsApp queries within 30–60 minutes during business hours.
                </p>
                <a
                  href="https://wa.me/917020888195?text=Hello%20KatrajPune%20Support%2C%20I%20have%20an%20inquiry."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all text-center"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Start WhatsApp Chat</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-navy/10 shadow-sm space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-navy">Send an Inquiry</h2>
                <p className="text-xs text-gray-500">
                  We welcome feedback, business verification queries, and editorial corrections.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-950">Message Received!</h3>
                  <p className="text-xs text-emerald-800 max-w-sm mx-auto leading-relaxed">
                    Thank you for reaching out to KatrajPune.com. Our editorial desk will review your message and reply via email or WhatsApp within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({ name: "", email: "", phone: "", subject: "general", message: "" })
                    }}
                    className="text-xs font-bold text-emerald-800 underline pt-2 block mx-auto"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ramesh Patil"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-navy/20 text-sm focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-navy/20 text-sm focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-navy/20 text-sm focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                        Inquiry Topic *
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-navy/20 text-sm focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange bg-white"
                      >
                        <option value="general">General Question</option>
                        <option value="claim">Business Listing Verification (₹350 Plan)</option>
                        <option value="correction">Report Inaccurate Listing / Phone</option>
                        <option value="advertising">Advertising &amp; Commercial Partnerships</option>
                        <option value="feedback">Editorial Feedback / Feature Request</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please describe your question, business name, or details..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-navy/20 text-sm focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange hover:bg-orange/90 text-white font-extrabold text-sm py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Sending inquiry...</span>
                    ) : (
                      <>
                        <span>Submit Inquiry</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
