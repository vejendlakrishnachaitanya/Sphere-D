import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api.jsx";

const AdminUserManagement = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        name: "", username: "", password: "", department: "", role: "EMPLOYEE"
    });

    // Get user role for dashboard redirection
    const role = localStorage.getItem("role");

    const loadUsers = () => {
        API.get("/users").then(res => setUsers(res.data));
    };

    useEffect(() => { loadUsers(); }, []);

    // Handle logout
    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    // Handle return to dashboard based on role
    const returnToDashboard = () => {
        if (role === "ADMIN") navigate("/admin");
        else if (role === "IT_STAFF") navigate("/it-staff");
        else navigate("/user");
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await API.post("/auth/signup", formData);
            alert("New staff member registered!");
            setFormData({ name: "", username: "", password: "", department: "", role: "EMPLOYEE" });
            loadUsers();
        } catch (err) {
            alert("Error creating user. Username might be taken.");
        }
    };

    return (
        <div style={styles.mainWrapper}>
            {/* Added Top Navigation Header */}
            <div style={styles.topHeader}>
                <h2 style={{ margin: 0 }}>Staff Management</h2>
                <div style={styles.buttonGroup}>
                    <button onClick={returnToDashboard} style={styles.dashboardBtn}>
                        Return to Dashboard
                    </button>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        Logout
                    </button>
                </div>
            </div>

            <div style={styles.container}>
                {/* Left side: Creation Form */}
                <div style={styles.formSection}>
                    <h3>Register Staff</h3>
                    <form onSubmit={handleCreateUser}>
                        <input style={styles.input} placeholder="Full Name" value={formData.name} required onChange={e => setFormData({...formData, name: e.target.value})} />
                        <input style={styles.input} placeholder="Username" value={formData.username} required onChange={e => setFormData({...formData, username: e.target.value})} />
                        <input style={styles.input} type="password" placeholder="Temporary Password" value={formData.password} required onChange={e => setFormData({...formData, password: e.target.value})} />
                        <input style={styles.input} placeholder="Department" value={formData.department} required onChange={e => setFormData({...formData, department: e.target.value})} />
                        <select style={styles.input} value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                            <option value="EMPLOYEE">Employee</option>
                            <option value="IT_STAFF">IT Staff</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                        <button type="submit" style={styles.submitBtn}>Add to System</button>
                    </form>
                </div>

                {/* Right side: User Table */}
                <div style={styles.listSection}>
                    <h3>Staff Directory</h3>
                    <table style={styles.table}>
                        <thead>
                        <tr style={styles.headerRow}>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Dept.</th>
                            <th>Username</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map(u => (
                            <tr key={u.id} style={styles.row}>
                                <td>{u.name}</td>
                                <td><span style={styles.badge(u.role)}>{u.role}</span></td>
                                <td>{u.department}</td>
                                <td>{u.username}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const styles = {
    mainWrapper: { padding: "20px", background: "#fdfdfd", minHeight: "100vh" },
    topHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        padding: "10px 20px",
        background: "white",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
    },
    buttonGroup: { display: "flex", gap: "10px" },
    dashboardBtn: { padding: "10px 15px", background: "#1cc88a", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" },
    logoutBtn: { padding: "10px 15px", background: "#e74c3c", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" },
    container: { display: "flex", gap: "30px" },
    formSection: { flex: "1", background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", height: "fit-content" },
    listSection: { flex: "2", background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" },
    input: { width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ddd", boxSizing: "border-box" },
    submitBtn: { width: "100%", padding: "12px", background: "#4e73df", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" },
    table: { width: "100%", borderCollapse: "collapse" },
    headerRow: { textAlign: "left", background: "#f8f9fc", borderBottom: "2px solid #e3e6f0" },
    row: { borderBottom: "1px solid #eee" },
    badge: (role) => ({
        padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "bold",
        background: role === "ADMIN" ? "#ffeeba" : role === "IT_STAFF" ? "#d1ecf1" : "#d4edda",
        color: role === "ADMIN" ? "#856404" : role === "IT_STAFF" ? "#0c5460" : "#155724"
    })
};

export default AdminUserManagement;