"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Shield, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      })

      if (error) {
        throw error
      }

      const user = data.user
      const role = user?.user_metadata?.role || user?.app_metadata?.role
      const userEmail = (user?.email || "").toLowerCase()

      const isWhitelisted =
        userEmail === "ovhalajit@gmail.com" ||
        (process.env.NEXT_PUBLIC_ADMIN_EMAIL && userEmail === process.env.NEXT_PUBLIC_ADMIN_EMAIL.toLowerCase())

      if (role !== "admin" && !isWhitelisted) {
        await supabase.auth.signOut()
        throw new Error("Access denied: You do not have administrator privileges for KatrajPune.")
      }

      router.push("/admin/dashboard")
      router.refresh()
    } catch (err: any) {
      console.error("Login failed:", err)
      setErrorMsg(err?.message || "Invalid email or password.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c1b2d] via-navy to-[#17324F] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Logo / Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <span className="text-2xl">📍</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tracking-widest text-white/70 uppercase">katraj</span>
              <span className="w-1.5 h-1.5 rounded-full bg-orange" />
              <span className="text-2xl font-bold text-white">pune</span>
            </div>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-orange text-xs font-bold uppercase tracking-wider border border-white/15">
            <Shield className="w-3.5 h-3.5" />
            <span>Administrator Console</span>
          </div>
        </div>

        {/* Login Box */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-white/20 space-y-6">
          <div>
            <h1 className="text-xl font-black text-navy">Admin Sign In</h1>
            <p className="text-xs text-gray-500 mt-1">
              Enter your authorized KatrajPune administrative credentials to access the moderation console.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@katrajpune.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-navy/20 text-sm focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-navy/20 text-sm focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy hover:bg-blue text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-navy/10 text-center">
            <Link href="/" className="text-xs font-medium text-gray-500 hover:text-navy">
              ← Return to Public Homepage
            </Link>
          </div>
        </div>

        <p className="text-center text-[11px] text-white/50">
          Strict access control enforced. All administrative actions are recorded in the immutable audit log.
        </p>
      </div>
    </div>
  )
}
