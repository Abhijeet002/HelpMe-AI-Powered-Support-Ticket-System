// client\src\slice\userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserState = {
  userInfo: {
    username: string;
    email: string;
    role: 'user' | 'admin' | 'agent';
    token: string;
  } | null;
};

const initialState: UserState = {
  userInfo: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserState['userInfo']>) => {
      state.userInfo = action.payload;
    },
    logout: (state) => {
      state.userInfo = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
