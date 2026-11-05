"use client"

import { useState } from "react"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const err = await res.json()
        setError(err.error || "Login failed")
        return
      }

      window.location.href = "/owner/dashboard"
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
            <h2 className="text-2xl font-bold text-navy mt-4">Welcome back</h2>
            <p className="text-gray-600 mt-2">Sign in to manage your business listings</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
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
                className="w-full px-4 py-2.5 rounded-lg border border-navy/10 bg-white text-navy focus:outline-none focus:ring-2 focus:ring-navy transition-all"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-navy text-white text-sm font-semibold rounded-xl hover:bg-blue transition-colors disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <a href="/auth/signup" className="text-blue hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  )
}
