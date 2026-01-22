import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  // 直接從本機存取，最保險
  const token = localStorage.getItem("token");

  if (!token || token === "undefined") {
    return <Navigate to="/login" replace />;
  }

  return children; //為true則回傳App.jsx中的children區塊
};
export default ProtectedRoute; //定義ProtectedRoute為預設
