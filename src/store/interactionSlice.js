import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchInteractions = createAsyncThunk(
  'interactions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/interaction/');
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.detail || e.message);
    }
  }
);

export const createInteraction = createAsyncThunk(
  'interactions/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/interaction/', data);
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.detail || e.message);
    }
  }
);

export const updateInteraction = createAsyncThunk(
  'interactions/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/interaction/${id}`, data);
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.detail || e.message);
    }
  }
);

export const deleteInteraction = createAsyncThunk(
  'interactions/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/interaction/${id}`);
      return id;
    } catch (e) {
      return rejectWithValue(e.response?.data?.detail || e.message);
    }
  }
);

const interactionSlice = createSlice({
  name: 'interactions',
  initialState: { list: [], loading: false, error: null, selected: null },
  reducers: {
    setSelected: (state, action) => { state.selected = action.payload; },
    clearError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInteractions.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchInteractions.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchInteractions.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(createInteraction.fulfilled, (state, action) => { state.list.unshift(action.payload); })
      .addCase(createInteraction.rejected, (state, action) => { state.error = action.payload; })

      .addCase(updateInteraction.fulfilled, (state, action) => {
        const idx = state.list.findIndex(i => i.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })

      .addCase(deleteInteraction.fulfilled, (state, action) => {
        state.list = state.list.filter(i => i.id !== action.payload);
      });
  },
});

export const { setSelected, clearError } = interactionSlice.actions;
export default interactionSlice.reducer;
