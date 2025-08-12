"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Home,
  Wallet,
  History,
  LifeBuoy,
  LogOut,
  ArrowLeft,
  CreditCard,
  Smartphone,
  Building2,
  AlertCircle,
  CheckCircle,
  Clock,
  FileCheck,
  Bitcoin,
  DollarSign,
  X,
  Star,
  Shield,
  Zap,
  Crown,
} from "lucide-react"
import { userService } from "@/lib/user-service"

const cryptocurrencies = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    network: "Bitcoin Network",
    minWithdrawal: 0.001,
    fee: 0.0005,
    icon: "₿",
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    network: "Ethereum Network",
    minWithdrawal: 0.01,
    fee: 0.005,
    icon: "Ξ",
  },
  {
    name: "Tether",
    symbol: "USDT",
    network: "ERC-20 / TRC-20",
    minWithdrawal: 10,
    fee: 1,
    icon: "₮",
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    network: "ERC-20",
    minWithdrawal: 10,
    fee: 1,
    icon: "$",
  },
  {
    name: "Binance Coin",
    symbol: "BNB",
    network: "BSC Network",
    minWithdrawal: 0.01,
    fee: 0.001,
    icon: "B",
  },
  {
    name: "Cardano",
    symbol: "ADA",
    network: "Cardano Network",
    minWithdrawal: 10,
    fee: 1,
    icon: "₳",
  },
  {
    name: "Solana",
    symbol: "SOL",
    network: "Solana Network",
    minWithdrawal: 0.1,
    fee: 0.01,
    icon: "◎",
  },
  {
    name: "Polygon",
    symbol: "MATIC",
    network: "Polygon Network",
    minWithdrawal: 1,
    fee: 0.1,
    icon: "⬟",
  },
]

export default function WithdrawPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [amount, setAmount] = useState("")
  const [method, setMethod] = useState("")
  const [selectedCrypto, setSelectedCrypto] = useState("")
  const [accountDetails, setAccountDetails] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [bankName, setBankName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [routingNumber, setRoutingNumber] = useState("")
  const [swiftCode, setSwiftCode] = useState("")
  const [paypalEmail, setPaypalEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [processing, setProcessing] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showFancyErrorModal, setShowFancyErrorModal] = useState(false)
  const [transactionId, setTransactionId] = useState("")
  const [brazilianBankCode, setBrazilianBankCode] = useState("")
  const [brazilianAgency, setBrazilianAgency] = useState("")
  const [brazilianAccount, setBrazilianAccount] = useState("")
  const [brazilianAccountType, setBrazilianAccountType] = useState("")
  const [brazilianCpf, setBrazilianCpf] = useState("")
  const [pixKey, setPixKey] = useState("")

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await userService.getCurrentUser()
      if (!currentUser) {
        router.push("/login")
        return
      }
      setUser(currentUser)
      setLoading(false)
    }

    loadUser()

    // Listen for balance updates
    const handleBalanceUpdate = (event: any) => {
      if (event.detail && event.detail.balance) {
        setUser((prevUser: any) => ({
          ...prevUser,
          balance: event.detail.balance,
        }))
        setSuccess("Withdrawal processing failed. Funds have been returned to your account.")
        setTimeout(() => setSuccess(""), 5000)
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

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "bank_transfer":
        return <Building2 className="h-5 w-5" />
      case "cryptocurrency":
        return <Bitcoin className="h-5 w-5" />
      case "paypal":
        return <CreditCard className="h-5 w-5" />
      case "mobile_money":
        return <Smartphone className="h-5 w-5" />
      default:
        return <Wallet className="h-5 w-5" />
    }
  }

  const getSelectedCryptoDetails = () => {
    return cryptocurrencies.find((crypto) => crypto.symbol === selectedCrypto)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setProcessing(true)

    if (!amount || !method) {
      setError("Please fill in all required fields")
      setProcessing(false)
      return
    }

    const withdrawalAmount = Number.parseFloat(amount)
    if (withdrawalAmount <= 0) {
      setError("Please enter a valid amount")
      setProcessing(false)
      return
    }

    if (withdrawalAmount > user.balance) {
      setError("Insufficient balance")
      setProcessing(false)
      return
    }

    // Validate method-specific fields
    if (method === "cryptocurrency") {
      if (!selectedCrypto) {
        setError("Please select a cryptocurrency")
        setProcessing(false)
        return
      }
      if (!walletAddress) {
        setError("Please enter wallet address")
        setProcessing(false)
        return
      }

      const cryptoDetails = getSelectedCryptoDetails()
      if (cryptoDetails && withdrawalAmount < cryptoDetails.minWithdrawal * 100) {
        // Convert to BRL equivalent (rough estimate)
        setError(`Minimum withdrawal amount is R$${(cryptoDetails.minWithdrawal * 100).toFixed(2)}`)
        setProcessing(false)
        return
      }
    }

    let details = ""
    switch (method) {
      case "bank_transfer":
        if (!bankName || !accountNumber) {
          setError("Please fill in all bank details")
          setProcessing(false)
          return
        }
        details = `Bank: ${bankName}, Account: ${accountNumber}, Routing: ${routingNumber}, SWIFT: ${swiftCode}`
        break
      case "cryptocurrency":
        const cryptoDetails = getSelectedCryptoDetails()
        details = `${cryptoDetails?.name} (${selectedCrypto}) - Wallet: ${walletAddress}`
        break
      case "paypal":
        if (!paypalEmail) {
          setError("Please enter PayPal email")
          setProcessing(false)
          return
        }
        details = `PayPal: ${paypalEmail}`
        break
      case "mobile_money":
        if (!phoneNumber) {
          setError("Please enter phone number")
          setProcessing(false)
          return
        }
        details = `Mobile Money: ${phoneNumber}`
        break
      case "brazilian_bank":
        if (!brazilianBankCode || !brazilianAgency || !brazilianAccount || !brazilianAccountType || !brazilianCpf) {
          setError("Please fill in all required Brazilian bank details")
          setProcessing(false)
          return
        }
        details = `Brazilian Bank: ${brazilianBankCode}, Agency: ${brazilianAgency}, Account: ${brazilianAccount} (${brazilianAccountType}), CPF/CNPJ: ${brazilianCpf}${pixKey ? `, PIX: ${pixKey}` : ""}`
        break
      default:
        details = accountDetails
    }

    try {
      const result = await userService.withdraw(withdrawalAmount, method, details)

      if (result.success) {
        setTransactionId(result.transactionId || "")
        setShowSuccessModal(true)

        // Update user balance immediately
        const updatedUser = await userService.getCurrentUser()
        if (updatedUser) {
          setUser(updatedUser)
        }

        // Reset form
        setAmount("")
        setMethod("")
        setSelectedCrypto("")
        setAccountDetails("")
        setWalletAddress("")
        setBankName("")
        setAccountNumber("")
        setRoutingNumber("")
        setSwiftCode("")
        setPaypalEmail("")
        setPhoneNumber("")
        setBrazilianBankCode("")
        setBrazilianAgency("")
        setBrazilianAccount("")
        setBrazilianAccountType("")
        setBrazilianCpf("")
        setPixKey("")
      } else {
        // Show fancy full-screen error modal instead of regular error
        setShowFancyErrorModal(true)
      }
    } catch (error) {
      console.error("Withdrawal error:", error)
      setShowFancyErrorModal(true)
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050e24] flex items-center justify-center">
        <div className="text-white">Loading withdrawal page...</div>
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
                <Link
                  href="/dashboard"
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
                >
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
                <Link href="/dashboard/withdraw" className="flex items-center p-2 rounded-md bg-[#162040] text-white">
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
            <Link href="/dashboard" className="mr-4">
              <Home className="h-5 w-5 text-white" />
            </Link>
            <button onClick={handleLogout}>
              <LogOut className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 pt-20 md:pt-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-6">
            <Link href="/dashboard" className="mr-4 text-gray-400 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Withdraw Funds</h1>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 bg-green-500/10 border-green-500 text-green-500">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Withdrawal Form */}
            <div className="lg:col-span-2">
              <Card className="bg-[#0a1735] border-[#253256] text-white">
                <CardHeader>
                  <CardTitle>Withdrawal Request</CardTitle>
                  <CardDescription className="text-gray-400">
                    Enter your withdrawal details below. Processing may take up to 5 minutes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount (BRL)</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="Enter amount"
                          className="bg-[#162040] border-[#253256] text-white"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          min="1"
                          max={user?.balance || 0}
                          step="0.01"
                        />
                        <p className="text-xs text-gray-400">Available: {formatCurrency(user?.balance || 0)}</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="method">Withdrawal Method</Label>
                        <Select value={method} onValueChange={setMethod}>
                          <SelectTrigger id="method" className="bg-[#162040] border-[#253256] text-white">
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0a1735] border-[#253256] text-white">
                            <SelectItem value="bank_transfer">
                              <div className="flex items-center">
                                <Building2 className="h-4 w-4 mr-2" />
                                Bank Transfer
                              </div>
                            </SelectItem>
                            <SelectItem value="cryptocurrency">
                              <div className="flex items-center">
                                <Bitcoin className="h-4 w-4 mr-2" />
                                Cryptocurrency
                              </div>
                            </SelectItem>
                            <SelectItem value="paypal">
                              <div className="flex items-center">
                                <CreditCard className="h-4 w-4 mr-2" />
                                PayPal
                              </div>
                            </SelectItem>
                            <SelectItem value="mobile_money">
                              <div className="flex items-center">
                                <Smartphone className="h-4 w-4 mr-2" />
                                Mobile Money
                              </div>
                            </SelectItem>
                            <SelectItem value="brazilian_bank">
                              <div className="flex items-center">
                                <Building2 className="h-4 w-4 mr-2" />
                                Brazilian Bank (PIX/TED)
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Cryptocurrency Selection */}
                    {method === "cryptocurrency" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="crypto">Select Cryptocurrency</Label>
                          <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                            <SelectTrigger id="crypto" className="bg-[#162040] border-[#253256] text-white">
                              <SelectValue placeholder="Choose cryptocurrency" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0a1735] border-[#253256] text-white">
                              {cryptocurrencies.map((crypto) => (
                                <SelectItem key={crypto.symbol} value={crypto.symbol}>
                                  <div className="flex items-center">
                                    <span className="mr-2 font-mono">{crypto.icon}</span>
                                    {crypto.name} ({crypto.symbol})
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {selectedCrypto && (
                          <div className="bg-[#162040] p-4 rounded-md">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-400">Network</p>
                                <p>{getSelectedCryptoDetails()?.network}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Network Fee</p>
                                <p>
                                  {getSelectedCryptoDetails()?.fee} {selectedCrypto}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-400">Min Withdrawal</p>
                                <p>R${((getSelectedCryptoDetails()?.minWithdrawal || 0) * 100).toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Processing Time</p>
                                <p>5-30 minutes</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="wallet">Wallet Address</Label>
                          <Textarea
                            id="wallet"
                            placeholder={`Enter your ${selectedCrypto || "cryptocurrency"} wallet address`}
                            className="bg-[#162040] border-[#253256] text-white min-h-[80px]"
                            value={walletAddress}
                            onChange={(e) => setWalletAddress(e.target.value)}
                          />
                          <p className="text-xs text-red-400">
                            ⚠️ Please ensure the wallet address is correct. Incorrect addresses may result in permanent
                            loss of funds.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Bank Transfer Details */}
                    {method === "bank_transfer" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="bank-name">Bank Name</Label>
                            <Input
                              id="bank-name"
                              placeholder="Enter bank name"
                              className="bg-[#162040] border-[#253256] text-white"
                              value={bankName}
                              onChange={(e) => setBankName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="account-number">Account Number</Label>
                            <Input
                              id="account-number"
                              placeholder="Enter account number"
                              className="bg-[#162040] border-[#253256] text-white"
                              value={accountNumber}
                              onChange={(e) => setAccountNumber(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="routing-number">Routing Number (Optional)</Label>
                            <Input
                              id="routing-number"
                              placeholder="Enter routing number"
                              className="bg-[#162040] border-[#253256] text-white"
                              value={routingNumber}
                              onChange={(e) => setRoutingNumber(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="swift-code">SWIFT Code (Optional)</Label>
                            <Input
                              id="swift-code"
                              placeholder="Enter SWIFT code"
                              className="bg-[#162040] border-[#253256] text-white"
                              value={swiftCode}
                              onChange={(e) => setSwiftCode(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Brazilian Bank Details */}
                    {method === "brazilian_bank" && (
                      <div className="space-y-4">
                        <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-md mb-4">
                          <p className="text-blue-400 text-sm">
                            🇧🇷 Complete your Brazilian bank details for PIX or TED transfer
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="bank-code">Bank Code (Código do Banco)</Label>
                            <Select value={brazilianBankCode} onValueChange={setBrazilianBankCode}>
                              <SelectTrigger className="bg-[#162040] border-[#253256] text-white">
                                <SelectValue placeholder="Select bank" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#0a1735] border-[#253256] text-white">
                                <SelectItem value="001">001 - Banco do Brasil</SelectItem>
                                <SelectItem value="104">104 - Caixa Econômica Federal</SelectItem>
                                <SelectItem value="237">237 - Bradesco</SelectItem>
                                <SelectItem value="341">341 - Itaú</SelectItem>
                                <SelectItem value="033">033 - Santander</SelectItem>
                                <SelectItem value="260">260 - Nu Pagamentos (Nubank)</SelectItem>
                                <SelectItem value="323">323 - Mercado Pago</SelectItem>
                                <SelectItem value="290">290 - PagSeguro</SelectItem>
                                <SelectItem value="077">077 - Banco Inter</SelectItem>
                                <SelectItem value="212">212 - Banco Original</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="agency">Agency (Agência)</Label>
                            <Input
                              id="agency"
                              placeholder="Enter agency number"
                              className="bg-[#162040] border-[#253256] text-white"
                              value={brazilianAgency}
                              onChange={(e) => setBrazilianAgency(e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="account">Account Number (Conta)</Label>
                            <Input
                              id="account"
                              placeholder="Enter account number"
                              className="bg-[#162040] border-[#253256] text-white"
                              value={brazilianAccount}
                              onChange={(e) => setBrazilianAccount(e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="account-type">Account Type (Tipo de Conta)</Label>
                            <Select value={brazilianAccountType} onValueChange={setBrazilianAccountType}>
                              <SelectTrigger className="bg-[#162040] border-[#253256] text-white">
                                <SelectValue placeholder="Select account type" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#0a1735] border-[#253256] text-white">
                                <SelectItem value="corrente">Conta Corrente</SelectItem>
                                <SelectItem value="poupanca">Conta Poupança</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="cpf">CPF/CNPJ</Label>
                            <Input
                              id="cpf"
                              placeholder="Enter CPF or CNPJ"
                              className="bg-[#162040] border-[#253256] text-white"
                              value={brazilianCpf}
                              onChange={(e) => setBrazilianCpf(e.target.value)}
                            />
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="pix-key">PIX Key (Optional)</Label>
                            <Input
                              id="pix-key"
                              placeholder="Enter PIX key (CPF, email, phone, or random key)"
                              className="bg-[#162040] border-[#253256] text-white"
                              value={pixKey}
                              onChange={(e) => setPixKey(e.target.value)}
                            />
                            <p className="text-xs text-gray-400">
                              If provided, withdrawal will be processed via PIX (faster). Otherwise, TED will be used.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PayPal Details */}
                    {method === "paypal" && (
                      <div className="space-y-2">
                        <Label htmlFor="paypal-email">PayPal Email</Label>
                        <Input
                          id="paypal-email"
                          type="email"
                          placeholder="Enter PayPal email address"
                          className="bg-[#162040] border-[#253256] text-white"
                          value={paypalEmail}
                          onChange={(e) => setPaypalEmail(e.target.value)}
                        />
                      </div>
                    )}

                    {/* Mobile Money Details */}
                    {method === "mobile_money" && (
                      <div className="space-y-2">
                        <Label htmlFor="phone-number">Phone Number</Label>
                        <Input
                          id="phone-number"
                          placeholder="Enter mobile money phone number"
                          className="bg-[#162040] border-[#253256] text-white"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                      </div>
                    )}

                    {/* Warning Alert */}
                    <Alert className="bg-red-500/10 border-red-500/30 text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Important Notice</AlertTitle>
                      <AlertDescription>
                        You need to maintain a minimum balance of <strong>700 BRL</strong> to process withdrawals. If
                        your balance is below this amount, you will need to top up before withdrawing.
                      </AlertDescription>
                    </Alert>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        className="w-full bg-[#f9a826] hover:bg-[#f9a826]/90 text-black"
                        disabled={processing}
                      >
                        {processing ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                            Processing Withdrawal...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            {getMethodIcon(method)}
                            <span className="ml-2">Submit Withdrawal Request</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Information */}
            <div className="space-y-6">
              {/* Balance Card */}
              <Card className="bg-[#0a1735] border-[#253256] text-white">
                <CardHeader>
                  <CardTitle className="text-lg">Available Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#f9a826]">{formatCurrency(user?.balance || 0)}</div>
                  <p className="text-sm text-gray-400 mt-2">Ready for withdrawal</p>
                  <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-md">
                    <p className="text-yellow-400 text-sm">
                      <strong>Minimum Required:</strong> 700 BRL
                    </p>
                    <p className="text-xs text-gray-400 mt-1">You must maintain this balance to process withdrawals</p>
                  </div>
                </CardContent>
              </Card>

              {/* Cryptocurrency Info */}
              {method === "cryptocurrency" && (
                <Card className="bg-[#0a1735] border-[#253256] text-white">
                  <CardHeader>
                    <CardTitle className="text-lg">Supported Cryptocurrencies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {cryptocurrencies.map((crypto) => (
                        <div
                          key={crypto.symbol}
                          className={`flex items-center justify-between p-2 rounded ${
                            selectedCrypto === crypto.symbol ? "bg-[#f9a826]/10 border border-[#f9a826]/20" : ""
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="mr-2 font-mono text-[#f9a826]">{crypto.icon}</span>
                            <div>
                              <p className="text-sm font-medium">{crypto.symbol}</p>
                              <p className="text-xs text-gray-400">{crypto.network}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400">Fee: {crypto.fee}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Processing Info */}
              <Card className="bg-[#0a1735] border-[#253256] text-white">
                <CardHeader>
                  <CardTitle className="text-lg">Processing Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-[#f9a826] mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Processing Time</p>
                        <p className="text-xs text-gray-400">Withdrawals are processed within 5 minutes</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <DollarSign className="h-5 w-5 text-[#f9a826] mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Minimum Balance</p>
                        <p className="text-xs text-gray-400">700 BRL required to process withdrawals</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-[#f9a826] mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Security</p>
                        <p className="text-xs text-gray-400">All withdrawals are secured with advanced encryption</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Fancy Full-Screen Error Modal */}
      {showFancyErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-sm">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23ffffff fillOpacity=0.05%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          </div>

          {/* Modal Content */}
          <div className="relative z-10 max-w-2xl mx-4 p-8 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setShowFancyErrorModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>

            {/* Header with Crown */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mb-6 animate-pulse">
                <Crown className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
                SERVIÇOS PREMIUM
              </h2>
              <div className="flex items-center justify-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current animate-pulse"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>

            {/* Main Message */}
            <div className="text-center space-y-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-blue-500/30">
                <Shield className="h-12 w-12 text-blue-400 mx-auto mb-4 animate-bounce" />
                <h3 className="text-2xl font-bold text-white mb-3">🚫 SAQUE TEMPORARIAMENTE INDISPONÍVEL</h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Para desbloquear nossos <span className="text-yellow-400 font-bold">serviços premium de saque</span>,
                  é necessário aprimorar sua conta com um depósito mínimo de{" "}
                  <span className="text-green-400 font-bold text-xl">R$ 700,00</span>.
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-500/30">
                <Zap className="h-12 w-12 text-green-400 mx-auto mb-4 animate-pulse" />
                <p className="text-gray-300 text-lg leading-relaxed">
                  🔐 Esta medida de segurança garante o processamento otimizado das transações e protege seus{" "}
                  <span className="text-blue-400 font-bold">ativos valiosos</span>.
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <Bitcoin className="h-8 w-8 text-orange-400 animate-spin" style={{ animationDuration: "3s" }} />
                  <Building2 className="h-8 w-8 text-blue-400 animate-pulse" />
                  <CreditCard className="h-8 w-8 text-green-400 animate-bounce" />
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">
                  💰 Após a conclusão, você terá acesso instantâneo a todos os métodos de saque, incluindo{" "}
                  <span className="text-yellow-400 font-bold">PIX, TED e transferências internacionais</span>.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl p-4 border border-indigo-500/30 mb-6">
                <p className="text-gray-300 text-lg">
                  🎯 Obrigado por escolher nossa{" "}
                  <span className="text-purple-400 font-bold">plataforma financeira exclusiva</span>!
                </p>
              </div>

              <Button
                onClick={() => setShowFancyErrorModal(false)}
                className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                ✨ ENTENDI - FAZER DEPÓSITO ✨
              </Button>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-20 w-4 h-4 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
          <div className="absolute top-40 right-32 w-3 h-3 bg-blue-400 rounded-full animate-pulse opacity-75"></div>
          <div className="absolute bottom-32 left-40 w-5 h-5 bg-purple-400 rounded-full animate-bounce opacity-75"></div>
          <div className="absolute bottom-20 right-20 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-75"></div>
        </div>
      )}

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="bg-[#0a1735] border-[#253256] text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              Withdrawal Submitted Successfully
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Your withdrawal request has been submitted and is being processed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-[#162040] p-4 rounded-md">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Transaction ID</p>
                  <p className="font-mono">{transactionId}</p>
                </div>
                <div>
                  <p className="text-gray-400">Amount</p>
                  <p>{formatCurrency(Number.parseFloat(amount) || 0)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Method</p>
                  <p className="capitalize">{method?.replace("_", " ")}</p>
                </div>
                <div>
                  <p className="text-gray-400">Status</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-500">
                    <Clock className="h-3 w-3 mr-1" />
                    Processing
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-md">
              <p className="text-blue-400 text-sm">
                💡 Your withdrawal is being processed. You can track its status in your transaction history.
              </p>
            </div>
            <Button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-[#f9a826] hover:bg-[#f9a826]/90 text-black"
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
