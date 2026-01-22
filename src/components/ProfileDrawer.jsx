import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

const ProfileDrawer = ({
  isOpen,
  onClose,
  totalTasks,
  completionRate,
  currentUser = {},
  setUserName,
  fetchUserData,
}) => {
  // --- 表單狀態 ---
  const [formData, setFormData] = useState({
    name: "",
    sex: "MALE",
    birth: "",
    password: "",
    confirmPassword: "",
  });

  // 當抽屜打開或切換用戶時，初始化資料 (這部分可以根據你傳入的 currentUser 調整)
  useEffect(() => {
    const fetchUserData = async () => {
      if (isOpen) {
        try {
          const response = await axiosClient.get("/users/userdata");
          const user = response.data;
          setFormData({
            account: user.account,
            name: user.name || "",
            sex: user.sex || "",
            birth: user.birth || "",
            password: "",
            confirmPassword: "",
          });
        } catch (error) {
          console.error("無法取的用戶資料", error);
        }
      }
    };
    fetchUserData();
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("密碼輸入不一致");
      return;
    }
    console.log("提交更新:", formData);
    try {
      const response = await axiosClient.put("/users/update", formData);
      console.log("3. API 回傳結果:", response);
      if (response.status === 200) {
        alert("資料已儲存！");
        if (setUserName) {
          setUserName(formData.name);
        }
        if (typeof fetchUserData === "function") {
          fetchUserData();
        }
        onClose();
      }
    } catch (error) {
      console.error("update defeat", error);
      alert(error.response?.data?.message || "更新失敗");
    }
  };

  return (
    <>
      {/* 背景遮罩 (Overlay) - 點擊遮罩也可關閉 */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 9998,
          }}
        />
      )}

      {/* 抽屜主體 */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: isOpen ? 0 : "-450px",
          width: "400px",
          height: "100vh",
          backgroundColor: "#161922",
          boxShadow: "-10px 0 30px rgba(0,0,0,0.5)",
          transition: "right 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 9999,
          padding: "40px 30px",
          color: "white",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "24px", color: "#fff" }}>
            帳號設定
          </h2>
          <button onClick={onClose} style={styles.closeBtn}>
            ✕
          </button>
        </div>

        {/* --- 1. 數據統計區 (解決太空感) --- */}
        <div style={styles.statGrid}>
          <div style={styles.statBox}>
            <div style={styles.statLabel}>任務完成率</div>
            <div style={{ ...styles.statValue, color: "#646cff" }}>
              {completionRate}%
            </div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statLabel}>總任務數</div>
            <div style={styles.statValue}>{totalTasks}</div>
          </div>
        </div>

        {/* --- 2. 編輯表單 --- */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.sectionTitle}>基本資料</div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>姓名</label>
            <input
              style={styles.input}
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>性別</label>
            <select
              style={styles.input}
              name="sex"
              value={formData.sex || ""}
              onChange={handleChange}
            >
              <option value="MALE">男性</option>
              <option value="FEMALE">女性</option>
              <option value="OTHER">其他</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>生日</label>
            <input
              style={styles.input}
              type="date"
              name="birth"
              value={formData.birth || ""}
              onChange={handleChange}
            />
          </div>

          <div style={{ ...styles.sectionTitle, marginTop: "20px" }}>
            安全驗證
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>新密碼</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="若不修改請留空"
              onChange={handleChange}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>確認新密碼</label>
            <input
              style={styles.input}
              type="password"
              name="confirmPassword"
              placeholder="再次輸入新密碼"
              onChange={handleChange}
            />
          </div>

          <div style={{ marginTop: "auto", paddingTop: "30px" }}>
            <button type="submit" style={styles.saveBtn}>
              儲存修改
            </button>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              取消
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

// --- 樣式定義 ---
const styles = {
  closeBtn: {
    background: "none",
    border: "none",
    color: "#888",
    fontSize: "20px",
    cursor: "pointer",
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    marginBottom: "30px",
  },
  statBox: {
    backgroundColor: "#1f232d",
    padding: "15px",
    borderRadius: "12px",
    textAlign: "center",
    border: "1px solid #2d313e",
  },
  statLabel: { fontSize: "12px", color: "#848d97", marginBottom: "5px" },
  statValue: { fontSize: "22px", fontWeight: "bold" },
  sectionTitle: {
    fontSize: "14px",
    color: "#646cff",
    fontWeight: "bold",
    marginBottom: "15px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontSize: "13px", color: "#aaa" },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #2d313e",
    backgroundColor: "#0f111a",
    color: "white",
    outline: "none",
  },
  saveBtn: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#646cff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  cancelBtn: {
    width: "100%",
    padding: "10px",
    backgroundColor: "transparent",
    color: "#888",
    border: "none",
    cursor: "pointer",
  },
};

export default ProfileDrawer;
