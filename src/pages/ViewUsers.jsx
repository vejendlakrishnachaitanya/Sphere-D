import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api.jsx";

const ViewUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Calls UserController.getAllUsers()
        API.get("/users")
            .then(res => {
                setUsers(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching users:", err);
                setLoading(false);
            });
    }, []);

    const getRoleStyle = (role) => {
        switch (role) {
            case "ADMIN": return { backgroundColor: "#ffeeba", color: "#856404" };
            case "IT_STAFF": return { backgroundColor: "#d1ecf1", color: "#0c5460" };
            case "EMPLOYEE": return { backgroundColor: "#d4edda", color: "#155724" };
            default: return { backgroundColor: "#e2e3e5", color: "#383d41" };
        }
    };

    // Updated function to fetch and show assigned assets
    const handleViewDetails = async (user) => {
        try {
            // Fetch assets assigned to this specific user
            const assetRes = await API.get(`/assets/user/${user.id}`);
            const assets = assetRes.data;

            // Format asset list for the alert
            const assetList = assets.length > 0
                ? assets.map(a => `- ${a.assetType} (SN: ${a.serialNumber})`).join("\n")
                : "No assets assigned.";

            alert(`Detailed Profile for ${user.name}:\n\n` +
                `Username: ${user.username}\n` +
                `Role: ${user.role}\n` +
                `Department: ${user.department || 'N/A'}\n` +
                `Status: ${user.active ? 'Active Account' : 'Deactivated'}\n\n` +
                `ASSIGNED ASSETS:\n${assetList}`);
        } catch (err) {
            console.error("Error fetching user assets:", err);
            alert("Could not load asset details.");
        }
    };

    if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Loading staff directory...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.topBar}>
                <button style={styles.backBtn} onClick={() => navigate("/admin")}>
                    ← Back
                </button>
            </div>

            <header style={styles.header}>
                <h2 style={styles.title}>Staff Directory</h2>
                <p style={styles.subtitle}>{users.length} Registered staff members</p>
            </header>

            <div style={styles.grid}>
                {users.map(user => (
                    <div key={user.id} style={styles.card}>
                        <div style={styles.cardHeader}>
                            <span style={styles.deptTag}>{user.department || "No Dept"}</span>
                            <span style={{ ...styles.roleBadge, ...getRoleStyle(user.role) }}>
                                {user.role}
                            </span>
                        </div>

                        <div style={styles.cardBody}>
                            <h3 style={styles.nameText}>{user.name}</h3>
                            <div style={styles.details}>
                                <span>Username: <strong>@{user.username}</strong></span>
                            </div>
                        </div>

                        <div style={styles.cardFooter}>
                            <button
                                style={styles.actionBtn}
                                onClick={() => handleViewDetails(user)}
                            >
                                View Details & Assets
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: { padding: "40px", maxWidth: "1200px", margin: "0 auto", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
    topBar: {
        width: "100%",
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
    header: { marginBottom: "30px", borderBottom: "2px solid #eee", paddingBottom: "10px" },
    title: { margin: 0, color: "#2c3e50" },
    subtitle: { color: "#7f8c8d", marginTop: "5px" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px" },
    card: {
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
        overflow: "hidden",
        border: "1px solid #edf2f7",
        display: "flex",
        flexDirection: "column"
    },
    cardHeader: { padding: "15px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f1f1" },
    deptTag: { fontSize: "11px", fontWeight: "bold", color: "#718096", textTransform: "uppercase", letterSpacing: "0.5px" },
    roleBadge: { padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "bold" },
    cardBody: { padding: "20px", flex: 1 },
    nameText: { margin: "0 0 10px 0", fontSize: "18px", color: "#2d3748" },
    details: { color: "#4a5568", fontSize: "14px" },
    cardFooter: { padding: "15px", background: "#f8fafc", textAlign: "right" },
    actionBtn: {
        background: "#4e73df",
        color: "white",
        border: "none",
        padding: "8px 16px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "bold",
        transition: "background 0.2s"
    }
};

export default ViewUsers;