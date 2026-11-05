"use client"

import { useState } from "react"

export default function SignupPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const fullName = formData.get("fullName") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      })

      if (!res.ok) {
        const err = await res.json()
        setError(err.error || "Signup failed")
        return
      }

      window.location.href = "/auth/login?registered=1"
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-navy/10 p-8">
          <div className="text-center mb-8">
            <span className="text-[10px] font-bold tracking-widest text-navy/60 uppercase">katrajpune</span>
            <span className="w-1 h-1 rounded-full bg-orange mx-auto mt-2"></span>
            <h2 className="text-2xl font-bold text-navy mt-4">Create account</h2>
            <p className="text-gray-600 mt-2">Join as a business owner</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Full name</label>
              <input
                type="text"
                name="fullName"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-navy/10 bg-white text-navy focus:outline-none focus:ring-2 focus:ring-navy transition-all"
                placeholder="Ramesh Kumar"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-navy/10 bg-white text-navy focus:outline-none focus:ring-2 focus:ring-navy transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                className="w-full px-4 py-2.5 rounded-lg border border-navy/10 bg-white text-navy focus:outline-none focus:ring-2 focus:ring-navy transition-all"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-navy text-white text-sm font-semibold rounded-xl hover:bg-blue transition-colors disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <a href="/auth/login" className="text-blue hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  )
}
