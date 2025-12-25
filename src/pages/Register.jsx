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
        <h2>用戶註冊</h2>
        <div>
          <label>帳號: </label>
          <input
            type="text"
            value={formData.account}
            onChange={(e) =>
              setFormData({ ...formData, account: e.target.value })
            }
            required
          />
        </div>
        <br />
        <div>
          <label>密碼: </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
        </div>
        <br />
        <div>
          <label>確認密碼: </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            required
          />
        </div>
        <hr style={{ margin: "20px 0", border: "0.5px solid #eee" }} />
        <button type="submit">確認註冊</button>
      </form>
    </div>
  );
};

export default Register;
