import { configureStore } from '@reduxjs/toolkit';
import interactionReducer from './interactionSlice';
import hcpReducer from './hcpSlice';
import chatReducer from './chatSlice';

export const store = configureStore({
  reducer: {
    interactions: interactionReducer,
    hcps: hcpReducer,
    chat: chatReducer,
  },
});
