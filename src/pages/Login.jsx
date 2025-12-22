import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../api/axiosClient";

const Login = () => {
  const [username, setUsername] = useState("");
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
        username,
        password,
      });

      //response會有token
      const token = response.data.token;
      login(token);

      navigate("/");
    } catch (error) {
      alert("帳號或密碼錯誤!");
    }
  };

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}
    >
      <form
        onSubmit={handleSubmit}
        style={{ border: "1px soild #ccc", padding: "20px" }}
      >
        <h2>系統登入</h2>
        <div>
          <label>帳號: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
      </form>
    </div>
  );
};

export default Login;
