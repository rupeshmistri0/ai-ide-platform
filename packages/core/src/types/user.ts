export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface User {
  id: string;
  email: string;
  name: string;
  fullName?: string;
  avatarUrl?: string;
  role: UserRole;
  isActive?: boolean;
  isSuperuser?: boolean;
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface UserCreateDTO {
  email: string;
  password: string;
  fullName?: string;
  avatarUrl?: string;
  role?: UserRole;
}

export interface UserUpdateDTO {
  email?: string;
  fullName?: string;
  avatarUrl?: string;
  password?: string;
}
