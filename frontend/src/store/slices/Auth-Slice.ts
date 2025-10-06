/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Define types
interface User {
  id: string;
  email: string;
  userName: string;
  role: "user" | "admin";
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
};

// Async Thunk - fetch auth status from backend
export const fetchAuthStatus = createAsyncThunk(
  "auth/fetchAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/auth/me", {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || {});
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAuthStatus.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.isAuthenticated;
        state.user = action.payload.user || null;
        state.loading = false;
      })
      .addCase(fetchAuthStatus.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
      });
  },
});

export const { logout, setAuth } = authSlice.actions;

export default authSlice.reducer;

// ✅ Export types so test can import them
export type { User, AuthState };
