export type UserRole = 'admin' | 'user';

export type SOKStatus = 'rejected' | 'approved' | 'manual_review' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthUser extends User {
  password: string;
}

export interface Counterparty {
  id: string;
  name: string;
  inn: string;
  type: 'organization' | 'individual';
  status: 'active' | 'inactive' | 'blocked';
  sokStatus: SOKStatus;
  legalAddress: string;
  actualAddress: string;
  phone: string;
  email: string;
  director: string;
  createdAt: string;
  updatedAt: string;
  sourceSystem: '1C' | 'SAP' | 'СЭД';
}

export interface ActionHistory {
  id: string;
  action: 'created' | 'updated' | 'sent_to_sok' | 'status_changed';
  timestamp: string;
  userId: string;
  userName: string;
  description: string;
  sourceSystem?: string;
}

export interface RolePermissions {
  canView: boolean;
  canExport: boolean;
  canManageUsers: boolean;
}

export const rolePermissionsMap: Record<UserRole, RolePermissions> = {
  admin: {
    canView: true,
    canExport: true,
    canManageUsers: true,
  },
  user: {
    canView: true,
    canExport: true,
    canManageUsers: false,
  },
};