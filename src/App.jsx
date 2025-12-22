import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

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

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div>
                  <h1>登入成功</h1>
                  <p>這是一個受保護的內部空間。</p>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;
