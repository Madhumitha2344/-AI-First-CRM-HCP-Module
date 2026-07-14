import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchHCPs = createAsyncThunk(
  'hcps/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/hcp/');
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.detail || e.message);
    }
  }
);

export const createHCP = createAsyncThunk(
  'hcps/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/hcp/', data);
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.detail || e.message);
    }
  }
);

const hcpSlice = createSlice({
  name: 'hcps',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHCPs.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchHCPs.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchHCPs.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createHCP.fulfilled, (state, action) => { state.list.unshift(action.payload); })
      .addCase(createHCP.rejected, (state, action) => { state.error = action.payload; });
  },
});

export default hcpSlice.reducer;
