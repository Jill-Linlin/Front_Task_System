import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthticated } = useAuth(); //引用AuthContext的useAuth.isAuthticated

  if (!isAuthticated) {
    return <Navigate to="/login" replace />; //如果isAuthticated為false則留在login頁面
  }

  return children; //為true則回傳App.jsx中的children區塊
};
export default ProtectedRoute; //定義ProtectedRoute為預設
