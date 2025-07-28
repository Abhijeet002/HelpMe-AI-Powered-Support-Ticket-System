// src/lib/redux/store.ts

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import userReducer from '@/lib/redux/slices/userSlice';
import authReducer from '@/lib/redux/slices/authSlice'; 

// 1. Combine all reducers
const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer
});

// 2. Persist configuration
const persistConfig = {
  key: 'root',
  version: 1,
  storage
};

// 3. Wrap the root reducer with persist
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Configure store with middleware adjustments
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }),
  devTools: process.env.NODE_ENV !== 'production'
});

// 5. Persistor instance
export const persistor = persistStore(store);

// 6. Type definitions
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
