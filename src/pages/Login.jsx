import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../api/axiosClient";

const Login = () => {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate(); //跳轉網址
  const { login } = useAuth();

  //async 標註這是非同步函式
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      //await 代表在這邊等一下
      //等axiosClient post回傳結果
      const response = await axiosClient.post("/users/login", {
        account: account,
        password: password,
      });

      //response會有token
      const token = response.data.accessToken;
      const userName = response.data.name || account;
      login(token);

      localStorage.setItem("token", token);
      localStorage.setItem("userName", userName);

      navigate("/tasks");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "帳號或密碼錯誤!";
      alert(errorMsg);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minheight: "100vh",
        width: "100vw",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          border: "1px solid #ccc",
          padding: "20px",
        }}
      >
        <h2>系統登入</h2>
        <div>
          <label>帳號: </label>
          <input
            type="text"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />
        </div>
        <br />
        <div>
          <label>密碼: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <br />
        <button type="submit">進入系統</button>

        <hr style={{ margin: "20px 0", border: "0.5px solid #eee" }} />

        <div style={{ textAlign: "center" }}>
          <span>還沒有帳號嗎？</span>
          <button
            type="button"
            onClick={() => navigate("/register")} // 點擊後切換網址到 /register
            style={{
              marginLeft: "10px",
              backgroundColor: "transparent",
              color: "#007bff",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            立即註冊
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
