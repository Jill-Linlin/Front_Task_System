import { useEffect, useState, useMemo } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import ProfileDrawer from "../components/ProfileDrawer";

const Task = () => {
  const [tasks, SetTasks] = useState([]);
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "work",
    description: "",
    limited: "",
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  //刷新頁面
  const fetchTasks = async () => {
    try {
      const response = await axiosClient.get("/tasks/check");
      SetTasks(response.data);
    } catch (error) {
      if (error.response?.status === 401) navigate("/login");
    }
  };
  const fetchUserData = async () => {
    try {
      const response = await axiosClient.get("/users/userdata"); // 假設這是你獲取當前使用者的 API
      if (response.status === 200) {
        // 💡 這裡最關鍵：優先顯示 name，如果 name 是空的才顯示 account
        const displayName = response.data.name || response.data.account;
        setUserName(displayName);
      }
    } catch (error) {
      console.error("抓取使用者資料失敗", error);
    }
  };

  //filter
  const [filterStatus, setFilterStatus] = useState("全部"); // 預設顯示全部

  // 過濾後的清單 (用於渲染列表)
  const filteredTasks = useMemo(() => {
    const now = new Date();

    return tasks.filter((task) => {
      if (filterStatus === "全部") return true;
      if (filterStatus === "已完成") return task.completed;
      if (filterStatus === "未完成") return !task.completed;
      if (filterStatus === "已過期") {
        // 判斷：未完成 且 截止日期早於現在
        return !task.completed && new Date(task.dueDate) < now;
      }
      return true;
    });
  }, [tasks, filterStatus]);

  //重置
  const resetForm = () => {
    setIsEditModal(false);
    setEditingTaskId(null);
    setFormData({ title: "", limited: "", category: "Work", description: "" });
  };

  //第一次載入
  useEffect(() => {
    fetchTasks();
    fetchUserData();
  }, [navigate]);

  //登出
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const [isEditModal, setIsEditModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  //編輯紐觸發
  const handleEditClick = (task) => {
    setIsEditModal(true);
    setEditingTaskId(task.id);
    setFormData({
      title: task.title,
      limited: task.limited || "",
      category: task.category || "work",
      description: task.description || "",
    });
    setIsModalOpen(true);
  };
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  //垃圾桶觸發
  const handleDeleteClick = (task) => {
    setIsDeleteModal(true);
    setDeletingTaskId(task.id);
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosClient.delete(`/tasks/${deletingTaskId}`);
      console.log("Deleted Success");
      setIsDeleteModal(false);
      fetchTasks();
    } catch (error) {
      console.error("Deleted Defeat");
    }
  };

  //創建或更新
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("標題不得為空!");
      return;
    }
    console.log("正在發送 PUT 請求至:", `/tasks/${editingTaskId}`);
    console.log("送出的資料內容:", formData);
    try {
      if (isEditModal) {
        await axiosClient.put(`/tasks/${editingTaskId}`, formData);
        console.log("update success");
      } else {
        await axiosClient.post("/tasks/create", formData);
        console.log("add task success");
      }
      setIsModalOpen(false); //關閉視窗
      resetForm();
      fetchTasks();
    } catch (error) {
      console.error("新增失敗", error);
    }
  };

  //checkBox
  const handleToggleComplete = async (task) => {
    const newStatus = !task.completed;
    const updateData = { ...task, completed: newStatus };
    try {
      await axiosClient.put(`/tasks/${task.id}`, updateData);
      fetchTasks();
      console.log("update Success");
    } catch (error) {
      console.error("Completed Defeat", error);
    }
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, percent };
  }, [tasks]); // 只有當 tasks 陣列改變時才會重新計算

  return (
    <div style={containerStyle}>
      {/* --- 固定工具列 --- */}
      <nav style={navbarStyle}>
        <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
          📋 Task Management System{" "}
        </div>
        <div style={navRightStyle}>
          <span>👤 {userName}</span>
          <button style={editBtnStyle} onClick={() => setIsProfileOpen(true)}>
            帳號編輯
          </button>
          <button style={logoutBtnStyle} onClick={handleLogout}>
            登出
          </button>
        </div>
      </nav>
      {/* --- 任務清單--- */}
      <main style={mainStyle}>
        <div className="filter-buttons" style={styles.filterContainer}>
          {["全部", "未完成", "已完成", "已過期"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                ...styles.filterBtn,
                backgroundColor:
                  filterStatus === status ? "#4f46e5" : "#2d323e",
                color: filterStatus === status ? "#fff" : "#a1a1aa",
              }}
            >
              {status}
            </button>
          ))}
        </div>
        <div style={headerSectionStyle}>
          <h2>我的任務清單</h2>
          <button style={addBtnStyle} onClick={() => setIsModalOpen(true)}>
            ➕ 新增任務
          </button>
        </div>
        <div style={listContainerStyle}>
          {Array.isArray(filteredTasks) && filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div key={task.id} style={taskCardStyle}>
                {/* 左側：標題與詳細資訊 */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed === true}
                      onChange={() => handleToggleComplete(task)}
                      style={{ cursor: "pointer" }}
                    />
                    <span
                      style={{
                        textDecoration: task.completed
                          ? "line-through"
                          : "none",
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                    >
                      {task.title}
                    </span>
                  </div>

                  {/* 這裡新增：到期時間與類別標籤 */}
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#b6c2cf",
                      marginLeft: "25px",
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <span>⏱️ {task.limited ? task.limited : "無期限"}</span>
                    <span
                      style={{
                        backgroundColor: "rgba(255,255,255,0.1)",
                        padding: "1px 6px",
                        borderRadius: "4px",
                        border: "1px solid rgba(255,255,255,0.2)",
                      }}
                    >
                      🏷️ {task.category || "未分類"}
                    </span>
                  </div>
                </div>

                {/* 右側：操作按鈕 */}
                <div style={{ display: "flex", gap: "5px" }}>
                  <button
                    style={actionBtnStyle}
                    onClick={() => handleEditClick(task)} // 之後可以改成開啟編輯彈窗
                  >
                    ✏️ 編輯
                  </button>
                  <button
                    style={{ ...actionBtnStyle, color: "#ff6b6b" }}
                    onClick={() => handleDeleteClick(task)}
                  >
                    🗑️刪除
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", color: "#666" }}>
              目前沒有任務，快去建立一個吧！
            </p>
          )}
        </div>
      </main>

      {/* --- 彈窗視窗 (Modal) --- */}
      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modleContentStyle}>
            <h3 style={{ color: "white", marginButtom: "20px" }}>
              Task Detail
            </h3>
            <form onSubmit={handleSubmit} style={formStyle}>
              <label style={labelStyle}>標題 (必填)*</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="要做甚麼呢?"
                style={inputStyle}
                required
              />
              <label style={labelStyle}>到期時間</label>
              <input
                type="date"
                name="limited"
                value={formData.limited || ""}
                onChange={handleInputChange}
                style={inputStyle}
              />
              <label style={labelStyle}>類別</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={inputStyle}
              >
                <option value={"work"}>工作</option>
                <option value={"life"}>生活</option>
                <option value={"learn"}>學習</option>
              </select>

              <label style={labelStyle}></label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="更多細節..."
                style={{ ...inputStyle, height: "80px" }}
              />
              <div style={{ display: "flex", gap: "10px", margin: "10px" }}>
                <button type="submit" style={saveBtnStyle}>
                  SAVE
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingTaskId(null);
                  }}
                  style={cancelBtnStyle}
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 刪除確認彈窗 */}
      {isDeleteModal && (
        <div style={modalOverlayStyle}>
          <div
            style={{
              ...modleContentStyle,
              maxWidth: "400px",
              textAlign: "center",
            }}
          >
            <h3 style={{ color: "white", marginBottom: "15px" }}>
              ⚠️ 確定要刪除嗎？
            </h3>
            <p style={{ color: "#b6c2cf", marginBottom: "20px" }}>
              此動作無法復原，該任務將永久從清單中移除。
            </p>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                style={{ ...saveBtnStyle, backgroundColor: "#ff6b6b" }}
                onClick={handleConfirmDelete}
              >
                確認刪除
              </button>
              <button
                style={cancelBtnStyle}
                onClick={() => {
                  setIsDeleteModal(false);
                  setDeletingTaskId(null);
                }}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 右側滑出抽屜 */}
      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        setUserName={setUserName}
        totalTasks={stats.total}
        completionRate={stats.percent}
      />
    </div>
  );
};

// --- CSS Styles (放在同個檔案下方即可) ---

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  width: "100vw",
  backgroundColor: "#10191f", // Trello 灰底
  overflow: "hidden",
};

const navbarStyle = {
  height: "50px",
  backgroundColor: "#026aa7", // Trello 藍
  color: "white",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 20px",
  flexShrink: 0,
};

const navRightStyle = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
};

const mainStyle = {
  flex: 1,
  padding: "20px",
  overflowY: "auto", // 只有清單區域會滾動
};

const headerSectionStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  maxWidth: "800px",
  margin: "0 auto 20px auto",
};

const listContainerStyle = {
  maxWidth: "800px",
  margin: "0 auto",
};

const taskCardStyle = {
  backgroundColor: "#2c3e50",
  borderRadius: "8px",
  padding: "12px",
  marginBottom: "16px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.12)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const editBtnStyle = {
  backgroundColor: "rgba(255,255,255,0.2)",
  border: "none",
  color: "white",
  padding: "5px 10px",
  borderRadius: "3px",
  cursor: "pointer",
};

const logoutBtnStyle = {
  backgroundColor: "#123deb",
  border: "none",
  padding: "5px 10px",
  borderRadius: "3px",
  cursor: "pointer",
};

const addBtnStyle = {
  backgroundColor: "#5aac44", // Trello 綠
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "3px",
  cursor: "pointer",
  fontWeight: "bold",
};

const actionBtnStyle = {
  border: "none",
  backgroundColor: "#54678f",
  padding: "5px 8px",
  borderRadius: "3px",
  cursor: "pointer",
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.7)", // 背景變暗
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 2000,
};

const modleContentStyle = {
  backgroundColor: "#22272b", // 深色底
  padding: "30px",
  borderRadius: "12px",
  width: "90%",
  maxWidth: "400px",
  border: "1px solid white",
};

const formStyle = { display: "flex", flexDirection: "column", gap: "10px" };

const labelStyle = { color: "#b6c2cf", fontSize: "14px", fontWeight: "bold" };

const inputStyle = {
  padding: "10px",
  borderRadius: "4px",
  border: "1px solid #444",
  backgroundColor: "#1d2125",
  color: "white",
};

const saveBtnStyle = {
  backgroundColor: "#5aac44",
  color: "white",
  border: "none",
  padding: "10px",
  borderRadius: "4px",
  cursor: "pointer",
  flex: 1,
  display: "flex", // 使用 Flex 佈局
  justifyContent: "center", // 水平居中
  alignItems: "center", // 垂直居中
  textAlign: "center", // 保險起見加上文字居中
};

const cancelBtnStyle = {
  backgroundColor: "#ee1e16",
  color: "#b6c2cf",
  border: "none",
  cursor: "pointer",
  flex: 1,
  display: "flex", // 使用 Flex 佈局
  justifyContent: "center", // 水平居中
  alignItems: "center", // 垂直居中
  textAlign: "center", // 保險起見加上文字居中
};

//filter
const styles = {
  filterContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    padding: "10px 0",
    // --- 加入以下兩行來控制位置 ---
    maxWidth: "800px", // 這裡的數值要跟你的 listContainerStyle 寬度一致
    margin: "0 auto", // 這會讓過濾器跟清單一樣水平置中
    width: "100%", // 確保在小螢幕上能撐開
    justifyContent: "flex-start",
  },
  filterBtn: {
    padding: "8px 16px",
    borderRadius: "20px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.3s ease",
    fontWeight: "500",
    // 讓按鈕不要因為 Flex 容器被拉伸
    flexShrink: 0,
  },
};

export default Task;
