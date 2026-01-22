import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const Register = () => {
  const [formData, setFormData] = useState({
    account: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  /** @param {React.FormEvent} e */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password != formData.confirmPassword) {
      alert("密碼不一致,請重新輸入");
      return; //密碼不對直接斷開
    }

    try {
      const response = await axiosClient.post("/users/register", formData); //Java端只有account password兩欄confirmPassword直接被忽略

      if (response.status === 200 || response.status === 201) {
        alert("Register Success");
        navigate("/login");
      }
    } catch (error) {
      console.error("register error", error);
      alert(error.response?.data?.message || "Register Failed");
    }
  };
  return (
    <div
      style={{
        display: "flex", // 啟用 Flex 佈局
        justifyContent: "center", // 水平居中
        alignItems: "center", // 垂直居中
        minHeight: "100vh", // 關鍵：高度至少要等於 100% 視窗高度
        width: "100vw", // 寬度撐滿視窗
        backgroundColor: "#1a1a1a", // 配合你截圖的深色背景
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          border: "1px solid #ccc",
          padding: "40px", // 增加內邊距讓框框大一點
          borderRadius: "8px", // 加一點圓角比較好看
          backgroundColor: "#242424", // 表單背景稍微亮一點點
          color: "white", // 文字變白色
          width: "350px", // 固定一個寬度
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>用戶註冊</h2>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block" }}>帳號: </label>
          <input
            type="text"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            value={formData.account}
            onChange={(e) =>
              setFormData({ ...formData, account: e.target.value })
            }
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block" }}>密碼: </label>
          <input
            type="password"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block" }}>確認密碼: </label>
          <input
            type="password"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            cursor: "pointer",
            backgroundColor: "#4a4a4a",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          確認註冊
        </button>
      </form>
    </div>
  );
};

export default Register;
