import { createContext, useContext, useState } from "react";
import { removeAuthToken } from "../utils/auth";

const AuthContext=createContext(null);//建立空白資料庫

//建立AuthProvider組件，直接使用children
export const AuthProvider=({children})=>{
    const [isAuthenticated,setIsAuthenticated]=useState(!!getAuthToken());

    //login 時要將token存進去，並將狀態改為true
    const login=(token)=>{
        setAuthToken(token);
        setIsAuthenticated(true);
    };
    //logout 時要將token刪除，並將狀態改為false
    const logout=()=>{
        removeAuthToken();
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{isAuthenticated,login,logout}}>
            {children}
        </AuthContext.Provider>
    );
};
//建立簡單hook讓其他頁面可以簡單使用AuthContext
export const useAuth=()=>useContext(AuthContext);
