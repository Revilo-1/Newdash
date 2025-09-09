export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  status: UserStatus
  permissions: Permission[]
  createdAt: Date
  lastLogin?: Date
  avatar?: string
  department?: string
  phone?: string
  notes?: string
}

export type UserRole = 'admin' | 'manager' | 'user' | 'viewer'

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending'

export interface Permission {
  id: string
  name: string
  description: string
  category: PermissionCategory
}

export type PermissionCategory = 'dashboard' | 'tasks' | 'health' | 'users' | 'settings' | 'reports'

export interface CreateUserData {
  email: string
  name: string
  role: UserRole
  permissions: string[]
  department?: string
  phone?: string
  notes?: string
}

export interface UpdateUserData {
  name?: string
  role?: UserRole
  status?: UserStatus
  permissions?: string[]
  department?: string
  phone?: string
  notes?: string
}
