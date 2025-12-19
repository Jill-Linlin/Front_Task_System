//定義變數儲存Token
const TOKEN_KEY = "jwt_token";

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};
export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
