import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const register = () => {
  const [formData, setFormData] = useState({
    account: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  /** @param {React.FormEvent} e */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password != confirmPassword) {
      alert("密碼不一致,請重新輸入");
    }

    try {
      const response = await axiosClient.post("/users/register", formData);

      if (response.status === 200 || response === 201) {
        alert("Register Success");
        navigate("/login");
      }
    } catch (error) {
      console.error("register error", error);
      alert(error.response?.data?.message);
    }
  };
};

export default register;
