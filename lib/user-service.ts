// Mock user service for development
interface User {
  id: string
  email: string
  name: string
  balance: number
  status: "active" | "pending" | "blocked"
  createdAt: string
  isVerified: boolean
  firstName: string
  lastName: string
  phone: string
  country: string
  role: string
  lastLogin?: Date
}

interface Transaction {
  id: string
  userId: string
  type: "deposit" | "withdrawal" | "investment"
  amount: number
  status: "pending" | "completed" | "failed"
  createdAt: string
  description: string
  method?: string
  accountDetails?: string
  failureReason?: string
  updatedAt?: Date
}

interface Investment {
  id: string
  userId: string
  amount: number
  plan: string
  status: "active" | "completed"
  createdAt: string
  expectedReturn: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  country: string
}

export interface VerificationData {
  documentType: string
  documentNumber?: string
  country?: string
  frontImage: string
  backImage?: string
  selfieImage: string
}

// Mock data storage
const mockUsers: User[] = []
const mockTransactions: Transaction[] = []
const mockInvestments: Investment[] = []

class UserService {
  private currentUser: User | null = null

  async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      // Mock authentication - always succeed for demo
      const user: User = {
        id: "1",
        email: credentials.email,
        firstName: credentials.email.split("@")[0],
        lastName: "User",
        name: credentials.email.split("@")[0] + " User",
        phone: "+55 11 99999-9999",
        country: "BR",
        balance: 5000,
        status: "active",
        isVerified: true,
        role: "user",
        createdAt: new Date().toISOString(),
        lastLogin: new Date(),
      }

      this.currentUser = user
      this.saveCurrentUser(user)

      return { success: true, user }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, message: "Login failed. Please try again." }
    }
  }

  async register(userData: RegisterData): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      // Mock registration - always succeed
      const user: User = {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        name: `${userData.firstName} ${userData.lastName}`,
        phone: userData.phone,
        country: userData.country,
        balance: 5000,
        status: "active",
        isVerified: true,
        role: "user",
        createdAt: new Date().toISOString(),
      }

      this.currentUser = user
      this.saveCurrentUser(user)
      return { success: true, user }
    } catch (error) {
      console.error("Registration error:", error)
      return { success: false, message: "Registration failed. Please try again." }
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) {
      // Ensure balance is always 5000 BRL
      this.currentUser.balance = 5000
      this.currentUser.isVerified = true
      return this.currentUser
    }

    // Try to get from localStorage
    const savedUser = this.getSavedCurrentUser()
    if (savedUser) {
      // Ensure balance is always 5000 BRL
      savedUser.balance = 5000
      savedUser.isVerified = true

      this.currentUser = savedUser
      return savedUser
    }

    return null
  }

  async updateCurrentUser(updates: Partial<User>): Promise<void> {
    if (this.currentUser) {
      // Allow balance updates but default to 5000 BRL if not specified
      const updateData = { ...updates }
      if (!updates.hasOwnProperty("balance")) {
        updateData.balance = 5000
      }
      updateData.isVerified = true

      this.currentUser = { ...this.currentUser, ...updateData }
      this.saveCurrentUser(this.currentUser)
    }
  }

  async logout(): Promise<void> {
    this.currentUser = null
    this.clearSavedCurrentUser()
  }

  async getUserTransactions(userId?: string): Promise<Transaction[]> {
    // Return mock transactions
    return [
      {
        id: "1",
        userId: userId || "1",
        type: "deposit",
        amount: 1000,
        status: "completed",
        createdAt: new Date().toISOString(),
        description: "Deposit via PIX",
        method: "PIX",
      },
      {
        id: "2",
        userId: userId || "1",
        type: "withdrawal",
        amount: 500,
        status: "failed",
        createdAt: new Date().toISOString(),
        description: "Withdrawal via Bank Transfer",
        method: "Bank Transfer",
        failureReason: "Insufficient balance for withdrawal fee",
      },
    ]
  }

  async getUserInvestments(userId?: string): Promise<Investment[]> {
    // Return mock investments
    return [
      {
        id: "1",
        userId: userId || "1",
        amount: 2000,
        plan: "Premium Plan",
        status: "active",
        createdAt: new Date().toISOString(),
        expectedReturn: 2400,
      },
    ]
  }

  async createTransaction(transactionData: any): Promise<string> {
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const transaction: Transaction = {
      id: transactionId,
      userId: this.currentUser?.id || "1",
      type: transactionData.type,
      amount: transactionData.amount,
      status: transactionData.status || "pending",
      createdAt: new Date().toISOString(),
      description: transactionData.description,
      method: transactionData.method,
      accountDetails: transactionData.accountDetails,
    }

    mockTransactions.push(transaction)
    return transactionId
  }

  async createInvestment(investmentData: any): Promise<string> {
    const investmentId = `INV_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const investment: Investment = {
      id: investmentId,
      userId: this.currentUser?.id || "1",
      amount: investmentData.amount,
      plan: investmentData.plan,
      status: "active",
      createdAt: new Date().toISOString(),
      expectedReturn: investmentData.expectedReturn,
    }

    mockInvestments.push(investment)
    return investmentId
  }

  async withdraw(
    amount: number,
    method: string,
    accountDetails: string,
  ): Promise<{ success: boolean; message: string; transactionId?: string }> {
    if (!this.currentUser) {
      return { success: false, message: "User not authenticated" }
    }

    // Always fail with the fancy Portuguese message
    return {
      success: false,
      message: `🚫 ✨ SERVIÇOS PREMIUM ✨ 🚫

💎 Para desbloquear nossos serviços premium de saque, é necessário aprimorar sua conta com um depósito mínimo de R$ 700,00.

🔐 Esta medida de segurança garante o processamento otimizado das transações e protege seus ativos valiosos.

💰 Após a conclusão, você terá acesso instantâneo a todos os métodos de saque, incluindo PIX, TED e transferências internacionais.

🎯 Obrigado por escolher nossa plataforma financeira exclusiva!`,
    }
  }

  async deposit(amount: number, method: string): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: "Deposit request submitted successfully. Your balance will be updated after confirmation.",
    }
  }

  // Verification functions
  async submitVerification(
    userEmail: string,
    userName: string,
    verificationData: VerificationData,
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.currentUser) {
        return { success: false, message: "User not authenticated" }
      }

      // Create verification record
      const verificationId = `ver_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const verification = {
        id: verificationId,
        userId: this.currentUser.id,
        userEmail: userEmail,
        userName: userName,
        documentType: verificationData.documentType,
        documentNumber: verificationData.documentNumber || "",
        country: verificationData.country || "",
        frontImage: verificationData.frontImage,
        backImage: verificationData.backImage || "",
        selfieImage: verificationData.selfieImage,
        status: "approved", // Auto-approve verification
        submittedDate: new Date().toLocaleDateString(),
        approvedDate: new Date().toLocaleDateString(),
        adminNotes: "Automatically approved by system",
      }

      // Save to localStorage
      const existingVerifications = JSON.parse(localStorage.getItem("userVerifications") || "[]")
      existingVerifications.push(verification)
      localStorage.setItem("userVerifications", JSON.stringify(existingVerifications))

      // Update user verification status
      await this.updateCurrentUser({ isVerified: true })

      return {
        success: true,
        message: "Verification submitted and approved successfully!",
      }
    } catch (error) {
      console.error("Verification submission error:", error)
      return { success: false, message: "Failed to submit verification. Please try again." }
    }
  }

  private saveCurrentUser(user: User): void {
    try {
      localStorage.setItem("currentUser", JSON.stringify(user))
    } catch (error) {
      console.error("Error saving current user:", error)
    }
  }

  private getSavedCurrentUser(): User | null {
    try {
      const savedUser = localStorage.getItem("currentUser")
      if (savedUser) {
        const user = JSON.parse(savedUser)
        // Default to 5000 BRL if no balance is set
        if (!user.balance) {
          user.balance = 5000
        }
        user.isVerified = true
        return user
      }
    } catch (error) {
      console.error("Error getting saved current user:", error)
    }
    return null
  }

  private clearSavedCurrentUser(): void {
    try {
      localStorage.removeItem("currentUser")
    } catch (error) {
      console.error("Error clearing saved current user:", error)
    }
  }
}

// Create and export the userService instance
export const userService = new UserService()

// Export individual functions for backward compatibility
export const loginUser = (email: string, password: string) => userService.login({ email, password })

export const registerUser = (userData: RegisterData) => userService.register(userData)

export const getUserBalance = async (userId: string): Promise<number> => {
  return 5000
}

export const updateUserBalance = async (userId: string, newBalance: number) => {
  return { success: true }
}

export const addTransaction = async (transaction: Omit<Transaction, "id" | "createdAt">) => {
  const newTransaction = {
    ...transaction,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  mockTransactions.push(newTransaction)
  return { success: true, transaction: newTransaction }
}

export const processWithdrawal = async (userId: string, amount: number, method: string, details: any) => {
  return userService.withdraw(amount, method, JSON.stringify(details))
}

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return {
    id: "1",
    email,
    firstName: email.split("@")[0],
    lastName: "User",
    name: email.split("@")[0] + " User",
    phone: "+55 11 99999-9999",
    country: "BR",
    balance: 5000,
    status: "active",
    isVerified: true,
    role: "user",
    createdAt: new Date().toISOString(),
  }
}

export const getUserTransactions = async (userId: string): Promise<Transaction[]> => {
  return userService.getUserTransactions(userId)
}

export const getUserInvestments = async (userId: string): Promise<Investment[]> => {
  return userService.getUserInvestments(userId)
}

export const addProfitToUser = async (userId: string, amount: number) => {
  return { success: true }
}

export const deductFromUserBalance = async (userId: string, amount: number) => {
  return { success: true }
}

export const updateUserStatus = async (userId: string, status: "active" | "pending" | "blocked") => {
  return { success: true }
}

export const resetPassword = async (email: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { success: true }
}

export const updatePassword = async (token: string, newPassword: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { success: true }
}

// Export verification functions
export async function submitVerification(
  userEmail: string,
  userName: string,
  verificationData: VerificationData,
): Promise<{ success: boolean; message: string }> {
  return await userService.submitVerification(userEmail, userName, verificationData)
}

export function getUserVerifications(): any[] {
  try {
    return JSON.parse(localStorage.getItem("userVerifications") || "[]")
  } catch (error) {
    console.error("Error getting user verifications:", error)
    return []
  }
}

export function getVerificationById(id: string): any {
  try {
    const verifications = getUserVerifications()
    return verifications.find((v) => v.id === id) || null
  } catch (error) {
    console.error("Error getting verification by ID:", error)
    return null
  }
}

export function updateVerificationStatus(id: string, status: string): void {
  try {
    const verifications = getUserVerifications()
    const verificationIndex = verifications.findIndex((v) => v.id === id)

    if (verificationIndex !== -1) {
      verifications[verificationIndex].status = status
      if (status === "approved") {
        verifications[verificationIndex].approvedDate = new Date().toLocaleDateString()
      } else if (status === "rejected") {
        verifications[verificationIndex].rejectedDate = new Date().toLocaleDateString()
      }
      localStorage.setItem("userVerifications", JSON.stringify(verifications))
    }
  } catch (error) {
    console.error("Error updating verification status:", error)
  }
}

export function updateVerificationNotes(id: string, notes: string): void {
  try {
    const verifications = getUserVerifications()
    const verificationIndex = verifications.findIndex((v) => v.id === id)

    if (verificationIndex !== -1) {
      verifications[verificationIndex].adminNotes = notes
      localStorage.setItem("userVerifications", JSON.stringify(verifications))
    }
  } catch (error) {
    console.error("Error updating verification notes:", error)
  }
}

// Export the processDeposit function that the deposit page needs
export function processDeposit(userEmail: string, amount: number, method: string): string {
  try {
    // Generate a transaction ID
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Get current user data
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      const userData = JSON.parse(currentUser)

      // Create transaction record
      const transaction = {
        id: transactionId,
        userId: userData.id,
        type: "deposit",
        amount: amount,
        method: method,
        status: "pending",
        date: new Date().toISOString(),
        description: `Deposit via ${method}`,
      }

      // Get existing transactions
      const existingTransactions = localStorage.getItem("transactions") || "[]"
      const transactions = JSON.parse(existingTransactions)

      // Add new transaction
      transactions.push(transaction)
      localStorage.setItem("transactions", JSON.stringify(transactions))

      // For demo purposes, we don't actually update the balance
      // The balance remains at 5000 BRL as specified

      return transactionId
    }

    throw new Error("User not found")
  } catch (error) {
    console.error("Error processing deposit:", error)
    throw new Error("Failed to process deposit")
  }
}
