import React, { useState, useEffect } from "react";
import API from "../api/api";

const StaffManagement = () => {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ name: "", username: "", password: "", department: "", role: "EMPLOYEE" });

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = () => {
        // Calls UserController.getAllUsers()
        API.get("/users").then(res => setUsers(res.data));
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            // Uses AuthController.signup to ensure password hashing
            await API.post("/auth/signup", form);
            alert("Staff member created successfully!");
            setForm({ name: "", username: "", password: "", department: "", role: "EMPLOYEE" });
            loadUsers();
        } catch (err) {
            alert("Error: " + (err.response?.data?.error || "Registration failed"));
        }
    };

    return (
        <div style={{ padding: "30px" }}>
            <h2>Register New Staff Member</h2>
            <form onSubmit={handleCreate} style={styles.form}>
                <input placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                <input placeholder="Username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
                <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
                <input placeholder="Department" value={form.department} onChange={e => setForm({...form, department: e.target.value})} required />
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                    <option value="EMPLOYEE">Employee</option>
                    <option value="IT_STAFF">IT Staff</option>
                </select>
                <button type="submit" style={styles.button}>Register Staff</button>
            </form>

            <h3>Staff Directory</h3>
            <table border="1" cellPadding="10" width="100%" style={{ borderCollapse: "collapse" }}>
                <thead>
                <tr style={{ background: "#f5f5f5" }}>
                    <th>Name</th><th>Username</th><th>Role</th><th>Dept</th>
                </tr>
                </thead>
                <tbody>
                {users.map(u => (
                    <tr key={u.id}><td>{u.name}</td><td>{u.username}</td><td>{u.role}</td><td>{u.department}</td></tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

const styles = {
    form: { display: "grid", gap: "15px", maxWidth: "400px", marginBottom: "40px" },
    button: { padding: "10px", background: "#007bff", color: "white", border: "none", cursor: "pointer" }
};

export default StaffManagement;