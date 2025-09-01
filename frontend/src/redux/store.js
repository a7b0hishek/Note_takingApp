import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import notesReducer from './notesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: notesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;
