"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Wallet,
  History,
  LifeBuoy,
  LogOut,
  TrendingUp,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  FileCheck,
  Bell,
  Settings,
  Eye,
  EyeOff,
} from "lucide-react"
import { userService } from "@/lib/user-service"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState<any[]>([])
  const [investments, setInvestments] = useState<any[]>([])
  const [showBalance, setShowBalance] = useState(true)

  useEffect(() => {
    const loadUserData = async () => {
      const currentUser = await userService.getCurrentUser()
      if (!currentUser) {
        router.push("/login")
        return
      }

      setUser(currentUser)

      // Load transactions and investments
      const userTransactions = await userService.getUserTransactions()
      const userInvestments = await userService.getUserInvestments()

      setTransactions(userTransactions.slice(0, 5)) // Show last 5 transactions
      setInvestments(userInvestments.slice(0, 3)) // Show last 3 investments
      setLoading(false)
    }

    loadUserData()

    // Listen for balance updates
    const handleBalanceUpdate = (event: any) => {
      if (event.detail && event.detail.balance) {
        setUser((prevUser: any) => ({
          ...prevUser,
          balance: event.detail.balance,
        }))
      }
    }

    window.addEventListener("balanceUpdated", handleBalanceUpdate)
    return () => window.removeEventListener("balanceUpdated", handleBalanceUpdate)
  }, [router])

  const handleLogout = async () => {
    await userService.logout()
    router.push("/login")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownRight className="h-4 w-4 text-green-400" />
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4 text-red-400" />
      case "investment":
        return <TrendingUp className="h-4 w-4 text-blue-400" />
      default:
        return <Activity className="h-4 w-4 text-gray-400" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050e24] flex items-center justify-center">
        <div className="text-white">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050e24] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a1735] text-white hidden md:block">
        <div className="p-4 border-b border-[#253256]">
          <Link href="/" className="flex items-center">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image src="/logo.png" alt="MXTM Investment" fill className="object-cover" />
            </div>
            <span className="ml-2 font-medium">MXTM INVESTMENT</span>
          </Link>
        </div>

        <div className="p-4">
          <div className="flex items-center mb-8">
            <div className="bg-[#162040] h-10 w-10 rounded-full flex items-center justify-center mr-3">
              <span className="text-[#0066ff] font-bold">{user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}</span>
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name || "User"}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>

          <nav>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="flex items-center p-2 rounded-md bg-[#162040] text-white">
                  <Home className="mr-3 h-5 w-5" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/deposit"
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
                >
                  <Wallet className="mr-3 h-5 w-5" />
                  Deposit
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/withdraw"
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
                >
                  <Wallet className="mr-3 h-5 w-5" />
                  Withdraw
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/investments"
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
                >
                  <Wallet className="mr-3 h-5 w-5" />
                  Investments
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/history"
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
                >
                  <History className="mr-3 h-5 w-5" />
                  History
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/verification"
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
                >
                  <FileCheck className="mr-3 h-5 w-5" />
                  Verification
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/support"
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
                >
                  <LifeBuoy className="mr-3 h-5 w-5" />
                  Support
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white w-full text-left"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#0a1735] z-10 border-b border-[#253256]">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image src="/logo.png" alt="MXTM Investment" fill className="object-cover" />
            </div>
            <span className="ml-2 font-medium text-white text-sm">MXTM</span>
          </Link>
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-white mr-4" />
            <button onClick={handleLogout}>
              <LogOut className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 pt-20 md:pt-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name || "User"}!</h1>
              <p className="text-gray-400">Here's what's happening with your investments today.</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                {user?.isVerified ? "Verified" : "Unverified"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="border-[#253256] text-white hover:bg-[#162040] bg-transparent"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Balance Card */}
            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <button onClick={() => setShowBalance(!showBalance)} className="text-gray-400 hover:text-white">
                  {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#f9a826]">
                  {showBalance ? formatCurrency(user?.balance || 0) : "••••••"}
                </div>
                <p className="text-xs text-gray-400">Available for withdrawal</p>
              </CardContent>
            </Card>

            {/* Total Invested */}
            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(investments.reduce((sum, inv) => sum + inv.amount, 0))}
                </div>
                <p className="text-xs text-green-400">+12.5% from last month</p>
              </CardContent>
            </Card>

            {/* Total Profit */}
            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
                <DollarSign className="h-4 w-4 text-[#f9a826]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">
                  {formatCurrency(investments.reduce((sum, inv) => sum + (inv.profit || 0), 0))}
                </div>
                <p className="text-xs text-gray-400">Lifetime earnings</p>
              </CardContent>
            </Card>

            {/* Active Investments */}
            <Card className="bg-[#0a1735] border-[#253256] text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Investments</CardTitle>
                <Activity className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{investments.filter((inv) => inv.status === "active").length}</div>
                <p className="text-xs text-gray-400">Currently running</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Transactions */}
            <div className="lg:col-span-2">
              <Card className="bg-[#0a1735] border-[#253256] text-white">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Recent Transactions
                    <Link href="/dashboard/history" className="text-sm text-[#f9a826] hover:underline">
                      View All
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {transactions.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No transactions yet</p>
                      <p className="text-sm">Start by making a deposit or investment</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {transactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 border border-[#253256] rounded-lg hover:bg-[#162040] transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            {getTransactionIcon(transaction.type)}
                            <div>
                              <p className="text-sm font-medium">{transaction.description}</p>
                              <p className="text-xs text-gray-400">{formatDate(transaction.createdAt)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {transaction.type === "deposit" ? "+" : "-"}
                              {formatCurrency(transaction.amount)}
                            </p>
                            <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              {/* Quick Actions Card */}
              <Card className="bg-[#0a1735] border-[#253256] text-white">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your account with these quick actions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/dashboard/deposit">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                      <ArrowDownRight className="h-4 w-4 mr-2" />
                      Deposit Funds
                    </Button>
                  </Link>
                  <Link href="/dashboard/withdraw">
                    <Button className="w-full bg-[#f9a826] hover:bg-[#f9a826]/90 text-black">
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      Withdraw Funds
                    </Button>
                  </Link>
                  <Link href="/dashboard/investments">
                    <Button
                      variant="outline"
                      className="w-full border-[#253256] text-white hover:bg-[#162040] bg-transparent"
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Investments
                    </Button>
                  </Link>
                  <Link href="/dashboard/verification">
                    <Button
                      variant="outline"
                      className="w-full border-[#253256] text-white hover:bg-[#162040] bg-transparent"
                    >
                      <FileCheck className="h-4 w-4 mr-2" />
                      Account Verification
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Investment Performance */}
              <Card className="bg-[#0a1735] border-[#253256] text-white">
                <CardHeader>
                  <CardTitle>Investment Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  {investments.length === 0 ? (
                    <div className="text-center py-4 text-gray-400">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No investments yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {investments.map((investment) => (
                        <div
                          key={investment.id}
                          className="flex items-center justify-between p-3 border border-[#253256] rounded"
                        >
                          <div>
                            <p className="text-sm font-medium">{investment.plan}</p>
                            <p className="text-xs text-gray-400">{formatCurrency(investment.amount)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-green-400">+{investment.returnRate}%</p>
                            <Badge className={getStatusColor(investment.status)}>{investment.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Account Status */}
              <Card className="bg-[#0a1735] border-[#253256] text-white">
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Verification Status</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Verified</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Account Type</span>
                    <span className="text-sm text-white">Premium</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Member Since</span>
                    <span className="text-sm text-white">{new Date(user?.createdAt || Date.now()).getFullYear()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Minimum Balance</span>
                    <span className="text-sm text-yellow-400">700 BRL</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
