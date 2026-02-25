import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api"; // Your axios instance

const StaffRegistration = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        username: "",
        password: "",
        department: "",
        role: "EMPLOYEE" // Default role
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Calls AuthController.signup to hash passwords
            await API.post("/auth/signup", form);
            alert("Staff member registered successfully!");
            navigate("/admin");
        } catch (err) {
            alert(err.response?.data?.error || "Registration failed");
        }
    };

    return (
        <div style={styles.container}>
            {/* Simple Back Button */}
            <div style={styles.topBar}>
                <button style={styles.backBtn} onClick={() => navigate("/admin")}>
                    ← Back
                </button>
            </div>

            <div style={styles.card}>
                <h2>Register New Staff</h2>
                <form onSubmit={handleSubmit}>
                    <input style={styles.input} placeholder="Full Name" onChange={e => setForm({...form, name: e.target.value})} required />
                    <input style={styles.input} placeholder="Username" onChange={e => setForm({...form, username: e.target.value})} required />
                    <input style={styles.input} type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} required />
                    <input style={styles.input} placeholder="Department" onChange={e => setForm({...form, department: e.target.value})} required />
                    <select style={styles.input} value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                        <option value="EMPLOYEE">Employee</option>
                        <option value="IT_STAFF">IT Staff</option>
                    </select>
                    <button type="submit" style={styles.button}>Register Staff</button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: "40px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    topBar: {
        width: "100%",
        maxWidth: "400px", // Align with card width
        display: "flex",
        justifyContent: "flex-start",
        marginBottom: "20px"
    },
    backBtn: {
        padding: "10px 15px",
        cursor: "pointer",
        background: "#4e73df",
        color: "white",
        border: "none",
        borderRadius: "5px",
        fontWeight: "bold"
    },
    card: {
        padding: "30px",
        border: "1px solid #ddd",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "400px",
        background: "white",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        textAlign: "center"
    },
    input: {
        width: "100%",
        padding: "12px",
        marginBottom: "15px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        boxSizing: "border-box"
    },
    button: {
        width: "100%",
        padding: "12px",
        background: "#4e73df",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "16px"
    }
};

export default StaffRegistration;