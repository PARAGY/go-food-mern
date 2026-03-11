import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const loginUser = createAsyncThunk('user/login', async (credentials, thunkAPI) => {
  try {
    const response = await api.post('/users/login', credentials);
    if (response.data.success) {
      localStorage.setItem('authToken', response.data.authToken);
      return response.data;
    } else {
      return thunkAPI.rejectWithValue(response.data.message);
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const fetchProfile = createAsyncThunk('user/profile', async (_, thunkAPI) => {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue('Failed to fetch profile');
  }
});

const initialState = {
  userInfo: null,
  isAuthenticated: !!localStorage.getItem('authToken'),
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem('authToken');
      state.userInfo = null;
      state.isAuthenticated = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Profile
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.userInfo = action.payload;
      });
  }
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
