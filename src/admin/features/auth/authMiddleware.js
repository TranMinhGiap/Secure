// import Cookies from 'js-cookie';
// import { fetchUser } from './authSlice';

// export const authMiddleware = (store) => (next) => (action) => {
//   let result;

//   // Nếu là login (setAuth)
//   if (action.type === 'auth/setAuth') {
//     const token = action.payload;
//     if (token) {
//       Cookies.set('token', token, { expires: 1, sameSite: 'strict' });
//     }
//   }

//   // Cho reducer cập nhật state
//   result = next(action);

//   // Sau khi reducer chạy xong → gọi fetchUser
//   if (action.type === 'auth/setAuth') {
//     store.dispatch(fetchUser());
//   }

//   // Nếu logout
//   if (action.type === 'auth/logout') {
//     Cookies.remove('token');
//   }

//   return result;
// };

import Cookies from 'js-cookie';
import { fetchUser } from './authSlice';

export const authMiddleware = (store) => (next) => (action) => {
  let result = next(action);

  if (action.type === 'auth/setAuth') {
    const token = action.payload;
    if (token) {
      Cookies.set('token', token, { expires: 1, sameSite: 'strict' });
      store.dispatch(fetchUser());
    }
  }

  if (action.type === 'auth/logout') {
    Cookies.remove('token');
  }

  return result;
};