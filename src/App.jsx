import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import Task from "./pages/Task";

function App() {
  return (
    <AuthProvider>
      {" "}
      {/*第一層啟動全域大腦，讓裡面都可以取用Token*/}
      <BrowserRouter>
        {" "}
        {/*第二層啟動瀏覽器監聽器，負責切換網址不刷新*/}
        <Routes>
          {/*第三層:像Java 的switch-case,決定網址是哪一個頁面*/}

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          {/* 受保護的內部空間 */}
          <Route
            path="/tasks" // 建議路徑改為 /tasks
            element={
              <ProtectedRoute>
                <Task /> {/* 2. 把剛剛刻好的任務頁面放進來 */}
              </ProtectedRoute>
            }
          />

          {/* 3. 自動導向：訪問首頁 "/" 時，自動帶去 /tasks */}
          <Route path="/" element={<Navigate to="/tasks" />} />
          {/* 防呆：找不到網頁時導回 /tasks (會被 ProtectedRoute 檢查) */}
          <Route path="*" element={<Navigate to="/tasks" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;
