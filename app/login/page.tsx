"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, AlertCircle, User, X } from "lucide-react"
import { getSavedLogins, saveLogin, removeSavedLogin, type SavedLogin } from "@/lib/saved-logins"
import { useLanguage } from "@/components/language-provider"
import { userService } from "@/lib/user-service"

export default function LoginPage() {
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [savedLogins, setSavedLogins] = useState<SavedLogin[]>([])
  const [showSavedLogins, setShowSavedLogins] = useState(false)
  const router = useRouter()
  const { translations: t } = useLanguage()

  useEffect(() => {
    setMounted(true)
    // Load saved logins
    const saved = getSavedLogins()
    setSavedLogins(saved)
    setShowSavedLogins(saved.length > 0)

    // Check if user is already logged in
    checkCurrentUser()
  }, [])

  const checkCurrentUser = async () => {
    try {
      const currentUser = await userService.getCurrentUser()
      if (currentUser) {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error checking current user:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    setError("")
  }

  const handleSavedLoginClick = async (savedLogin: SavedLogin) => {
    setLoading(true)
    try {
      // For saved logins, we'll need the user to enter their password
      // This is a security measure since we don't store passwords
      setFormData((prev) => ({ ...prev, email: savedLogin.email }))
      setShowSavedLogins(false)
      setError("Please enter your password to continue")
    } catch (error) {
      setError("Login failed")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveSavedLogin = (email: string, e: React.MouseEvent) => {
    e.stopPropagation()
    removeSavedLogin(email)
    setSavedLogins(getSavedLogins())
    if (getSavedLogins().length === 0) {
      setShowSavedLogins(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await userService.login(formData)

      if (result.success && result.user) {
        // Save login if remember me is checked
        if (formData.rememberMe) {
          saveLogin(
            result.user.email,
            `${result.user.firstName} ${result.user.lastName}`,
            result.user.country || "Unknown",
          )
        }

        // Redirect to dashboard
        router.push("/dashboard")
      } else {
        setError(result.message || "Login failed")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#050e24] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center mb-4">
            <Image src="/logo.png" alt="MXTM Investment" width={48} height={48} />
            <span className="ml-2 text-white font-medium">MXTM INVESTMENT</span>
          </Link>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-gray-400">Enter your credentials to access your account</p>
        </div>

        <Card className="bg-[#0a1735] border-[#253256]">
          <CardHeader>
            <CardTitle className="text-white">Sign In</CardTitle>
            <CardDescription className="text-gray-300">Enter your email and password</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Saved Logins */}
            {showSavedLogins && savedLogins.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Saved Accounts</h3>
                <div className="space-y-2">
                  {savedLogins.map((savedLogin) => (
                    <div
                      key={savedLogin.id}
                      onClick={() => handleSavedLoginClick(savedLogin)}
                      className="flex items-center justify-between p-3 border border-[#253256] rounded-lg hover:border-[#f9a826] cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#f9a826] flex items-center justify-center">
                          <User className="h-5 w-5 text-black" />
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">{savedLogin.name}</p>
                          <p className="text-xs text-gray-400">{savedLogin.email}</p>
                          <p className="text-xs text-gray-500">{savedLogin.country}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleRemoveSavedLogin(savedLogin.email, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                      >
                        <X className="h-4 w-4 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <button onClick={() => setShowSavedLogins(false)} className="text-sm text-[#f9a826] hover:underline">
                    Use a different account
                  </button>
                </div>
              </div>
            )}

            {/* Login Form */}
            {(!showSavedLogins || savedLogins.length === 0) && (
              <>
                {error && (
                  <Alert className="mb-4 border-red-500 bg-red-500/10">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-500">{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-[#162040] border-[#253256] text-white"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="bg-[#162040] border-[#253256] text-white pr-10"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, rememberMe: checked as boolean }))
                      }
                    />
                    <Label htmlFor="rememberMe" className="text-sm text-gray-300">
                      Remember me
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#f9a826] hover:bg-[#f9a826]/90 text-black font-medium"
                    disabled={loading}
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>

                {savedLogins.length > 0 && (
                  <div className="mt-4 text-center">
                    <button onClick={() => setShowSavedLogins(true)} className="text-sm text-[#f9a826] hover:underline">
                      View saved accounts
                    </button>
                  </div>
                )}
              </>
            )}

            <div className="mt-6 text-center space-y-2">
              <Link href="/forgot-password" className="text-[#f9a826] hover:underline text-sm">
                Forgot your password?
              </Link>
              <p className="text-gray-400">
                Don't have an account?{" "}
                <Link href="/register" className="text-[#f9a826] hover:underline">
                  Register here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
