import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [view, setView] = useState("main");

    // Handle logout by clearing local storage and navigating to login
    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const styles = {
        container: { padding: "40px", maxWidth: "1200px", margin: "0 auto", fontFamily: "Arial, sans-serif" },
        header: { textAlign: "center", marginBottom: "40px" },
        // Top Bar style to hold the new buttons
        topBar: { display: "flex", justifyContent: "flex-end", gap: "10px", marginBottom: "20px" },
        grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "25px" },
        card: {
            padding: "25px", border: "1px solid #e0e0e0", borderRadius: "12px",
            textAlign: "center", cursor: "pointer", background: "#ffffff",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)", transition: "transform 0.2s"
        },
        icon: { fontSize: "40px", marginBottom: "15px" },
        backBtn: {
            padding: "10px 15px", cursor: "pointer",
            background: "#4e73df", color: "white", border: "none", borderRadius: "5px",
            fontWeight: "bold"
        },
        logoutBtn: {
            padding: "10px 15px", cursor: "pointer",
            background: "#e74c3c", color: "white", border: "none", borderRadius: "5px",
            fontWeight: "bold"
        },
        dashboardBtn: {
            padding: "10px 15px", cursor: "pointer",
            background: "#1cc88a", color: "white", border: "none", borderRadius: "5px",
            fontWeight: "bold"
        }
    };

    if (view === "staff") {
        return (
            <div style={styles.container}>
                <div style={styles.topBar}>
                    <button style={styles.dashboardBtn} onClick={() => setView("main")}>Return to Dashboard</button>
                    <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
                </div>
                <button style={{...styles.backBtn, marginBottom: "20px"}} onClick={() => setView("main")}>← Back</button>
                <div style={styles.header}>
                    <h1>Staff Management</h1>
                    <p>Manage Employee and IT Staff accounts.</p>
                </div>
                <div style={styles.grid}>
                    <div style={styles.card} onClick={() => navigate("/admin/users/create")}>
                        <div style={styles.icon}>👤➕</div>
                        <h3>Create User</h3>
                        <p>Register new staff members.</p>
                    </div>
                    <div style={styles.card} onClick={() => navigate("/admin/users/view")}>
                        <div style={styles.icon}>📋</div>
                        <h3>View Users</h3>
                        <p>Browse the full staff directory.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (view === "assets") {
        return (
            <div style={styles.container}>
                <div style={styles.topBar}>
                    <button style={styles.dashboardBtn} onClick={() => setView("main")}>Return to Dashboard</button>
                    <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
                </div>
                <button style={{...styles.backBtn, marginBottom: "20px"}} onClick={() => setView("main")}>← Back</button>
                <div style={styles.header}>
                    <h1>Asset & Booking Management</h1>
                    <p>Configure layouts and monitor real-time availability.</p>
                </div>
                <div style={styles.grid}>
                    <div style={styles.card} onClick={() => navigate("/admin/assets/create")}>
                        <div style={styles.icon}>➕</div>
                        <h3>Add New Asset</h3>
                        <p>Create new hardware or seat areas.</p>
                    </div>
                    <div style={styles.card} onClick={() => navigate("/admin/seats/configure")}>
                        <div style={styles.icon}>📅</div>
                        <h3>Configure Daily Seats</h3>
                        <p>Set seat capacity for specific days.</p>
                    </div>
                    <div style={styles.card} onClick={() => navigate("/admin/bookings/map")}>
                        <div style={styles.icon}>🗺️</div>
                        <h3>Live Booking Map</h3>
                        <p>View Red/Green status for any date.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Top Bar with Logout Button for the Main View */}
            <div style={styles.topBar}>
                <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
            </div>
            <div style={styles.header}>
                <h1>Admin Control Panel</h1>
                <p>Welcome to the Sphere-D Admin Hub.</p>
            </div>
            <div style={styles.grid}>
                <div style={styles.card} onClick={() => setView("staff")}>
                    <div style={styles.icon}>👥</div>
                    <h3>Staff Management</h3>
                    <p>Handle user accounts and registration.</p>
                </div>
                <div style={styles.card} onClick={() => setView("assets")}>
                    <div style={styles.icon}>🪑</div>
                    <h3>Asset & Seat Management</h3>
                    <p>Manage inventory and daily booking layouts.</p>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;