import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../admin/features/auth/authSlice';
import { authMiddleware } from '../admin/features/auth/authMiddleware';
import { fetchUser } from '../admin/features/auth/authSlice';
import Cookies from 'js-cookie';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),
});

const token = Cookies.get('token');
if (token) {
  store.dispatch(fetchUser());
}
