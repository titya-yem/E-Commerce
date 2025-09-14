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
  _id: string;
  userName: string;
  email: string;
  password: string;
  isActive: boolean;
  role: string;
}