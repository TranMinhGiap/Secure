import Cookies from 'js-cookie';

const refreshToken = async (path) => {
  const API_SERVER = process.env.REACT_APP_API_URL;
  const url = API_SERVER + path;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Refresh token failed');
    }

    const { accessToken } = await response.json(); 

    if (!accessToken) {
      throw new Error("No access token returned");
    }
    
    Cookies.set('token', accessToken, {
      expires: 15 / (24 * 60),
      secure: true,
      sameSite: 'strict',
    });

    return accessToken;
  } catch (err) {
    Cookies.remove('token');
    throw err;
  }
};

export default refreshToken;