import Cookies from 'js-cookie';
import { fetchUser } from './authSlice';

export const authMiddleware = (store) => (next) => (action) => {
  let result = next(action);

  if (action.type === 'auth/setAuth') {
    const token = action.payload;
    if (token) {
      Cookies.set('token', token, { expires: 15 / (24 * 60), sameSite: 'strict' });
      store.dispatch(fetchUser());
    }
  }

  if (action.type === 'auth/logout') {
    Cookies.remove('token');
  }

  return result;
};