import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const sendChatMessage = createAsyncThunk(
  'chat/send',
  async (message, { rejectWithValue }) => {
    try {
      const res = await api.post('/chat/', { message });
      return { userMessage: message, aiResponse: res.data };
    } catch (e) {
      return rejectWithValue(e.response?.data?.detail || e.message);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: { messages: [], loading: false, error: null },
  reducers: {
    clearChat: (state) => { state.messages = []; state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.messages.push({
          role: 'user',
          content: action.meta.arg,
          timestamp: new Date().toISOString()
        });
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({
          role: 'ai',
          content: action.payload.aiResponse.response,
          extracted_data: action.payload.aiResponse.extracted_data,
          action_taken: action.payload.aiResponse.action_taken,
          interaction_id: action.payload.aiResponse.interaction_id,
          timestamp: new Date().toISOString()
        });
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.messages.push({
          role: 'ai',
          content: `⚠️ Error: ${action.payload || 'Could not connect to backend.'}`,
          timestamp: new Date().toISOString()
        });
      });
  },
});

export const { clearChat } = chatSlice.actions;
export default chatSlice.reducer;
