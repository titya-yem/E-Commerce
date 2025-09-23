export interface User {
  _id: string;
  userName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
}

export interface getMe {
  id?: string;
  _id?: string;
  userName: string;
  email: string;
  isActive: boolean;
  role: string;
}