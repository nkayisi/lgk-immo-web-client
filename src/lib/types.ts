export type User = {
  id: string
  email: string
  name?: string | null
  image?: string | null
  emailVerified: boolean
  createdAt: string
}

export type Session = {
  id: string
  expiresAt: string
  ipAddress?: string | null
  userAgent?: string | null
  createdAt: string
}

export type AuthContextType = {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<void>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}
