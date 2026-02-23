import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const AssetManagement = () => {
    const navigate = useNavigate();
    const [assets, setAssets] = useState([]);
    // State to store statistics fetched from the backend
    const [stats, setStats] = useState({
        totalAssets: 0,
        availableAssets: 0,
        assignedAssets: 0,
        brokenAssets: 0
    });
    const [form, setForm] = useState({ serialNumber: "", assetType: "SEAT", totalItems: 0, status: "AVAILABLE" });

    const role = localStorage.getItem("role");

    useEffect(() => {
        loadAssets();
        loadStats(); // Fetch stats on component load
    }, []);

    const loadAssets = () => {
        // Calls AssetController.getActiveAssets()
        API.get("/assets").then(res => setAssets(res.data));
    };

    const loadStats = () => {
        // Calls AssetController.getAssetStats()
        API.get("/assets/stats")
            .then(res => setStats(res.data))
            .catch(err => console.error("Error loading stats:", err));
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const returnToDashboard = () => {
        if (role === "ADMIN") navigate("/admin");
        else if (role === "IT_STAFF") navigate("/it-staff");
        else navigate("/user");
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            // Calls AssetController.createAsset()
            await API.post("/assets", form);
            alert("Asset added successfully!");
            setForm({ serialNumber: "", assetType: "SEAT", totalItems: 0, status: "AVAILABLE" });
            loadAssets();
            loadStats(); // Refresh table stats after adding
        } catch (err) { alert("Error adding asset"); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this asset?")) {
            // Calls AssetController.softDelete()
            await API.delete(`/assets/${id}`);
            loadAssets();
            loadStats(); // Refresh table stats after deleting
        }
    };

    return (
        <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
            <div style={styles.topHeader}>
                <h2 style={{ margin: 0 }}>Asset Inventory & Management</h2>
                <div style={styles.buttonGroup}>
                    <button onClick={returnToDashboard} style={styles.dashboardBtn}>
                        Return to Dashboard
                    </button>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        Logout
                    </button>
                </div>
            </div>

            {/* --- Asset Statistics Table Section --- */}
            <div style={styles.statsSection}>
                <h3 style={styles.subTitle}>Inventory Overview</h3>
                <table style={styles.statsTable}>
                    <thead>
                    <tr>
                        <th style={styles.th}>Asset Metric</th>
                        <th style={styles.th}>Count</th>
                        <th style={styles.th}>System Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td style={styles.td}>Total Active Assets</td>
                        <td style={{ ...styles.td, fontWeight: 'bold' }}>{stats.totalAssets}</td>
                        <td style={styles.td}>All items currently in inventory</td>
                    </tr>
                    <tr>
                        <td style={styles.td}>Available for Use</td>
                        <td style={{ ...styles.td, color: '#1cc88a', fontWeight: 'bold' }}>{stats.availableAssets}</td>
                        <td style={styles.td}>Ready to be assigned to staff</td>
                    </tr>
                    <tr>
                        <td style={styles.td}>Assigned to Staff</td>
                        <td style={{ ...styles.td, color: '#4e73df', fontWeight: 'bold' }}>{stats.assignedAssets}</td>
                        <td style={styles.td}>Currently in possession of employees</td>
                    </tr>
                    <tr>
                        <td style={styles.td}>Broken / Maintenance</td>
                        <td style={{ ...styles.td, color: '#e74c3c', fontWeight: 'bold' }}>{stats.brokenAssets}</td>
                        <td style={styles.td}>Items requiring IT attention</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: "40px" }}>
                <h3 style={styles.subTitle}>Register New Asset</h3>
                <form onSubmit={handleAdd} style={styles.formInline}>
                    <input
                        style={styles.input}
                        placeholder="Serial Number"
                        value={form.serialNumber}
                        onChange={e => setForm({...form, serialNumber: e.target.value})}
                        required
                    />
                    <select style={styles.input} value={form.assetType} onChange={e => setForm({...form, assetType: e.target.value})}>
                        <option value="SEAT">Office Seat Layout</option>
                        <option value="LAPTOP">Laptop</option>
                        <option value="MONITOR">Monitor</option>
                        <option value="KEYBOARD">Keyboard</option>
                    </select>
                    <input
                        style={styles.input}
                        type="number"
                        placeholder="Total Items/Seats"
                        value={form.totalItems}
                        onChange={e => setForm({...form, totalItems: e.target.value})}
                        required
                    />
                    <button type="submit" style={styles.addBtn}>Add Asset</button>
                </form>
            </div>

            <h3 style={styles.subTitle}>Existing Inventory</h3>
            <div style={{ display: "grid", gap: "20px" }}>
                {assets.map(asset => (
                    <div key={asset.id} style={styles.assetCard}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h3 style={{ margin: 0 }}>
                                {asset.assetType}
                                <span style={{ fontWeight: "normal", color: "#666", marginLeft: "10px" }}>
                                    (SN: {asset.serialNumber})
                                </span>
                            </h3>
                            <button onClick={() => handleDelete(asset.id)} style={styles.deleteBtn}>Delete Asset</button>
                        </div>

                        {asset.assetType === "SEAT" && (
                            <div style={{ marginTop: "15px" }}>
                                <strong style={{ color: "#4e73df" }}>Configured Seat Layout:</strong>
                                <div style={styles.seatGrid}>
                                    {[...Array(parseInt(asset.totalItems))].map((_, i) => (
                                        <div key={i} style={styles.seat}>{i + 1}</div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    topHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        paddingBottom: "15px",
        borderBottom: "2px solid #f1f5f9"
    },
    buttonGroup: { display: "flex", gap: "10px" },
    dashboardBtn: { padding: "10px 18px", background: "#4e73df", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
    logoutBtn: { padding: "10px 18px", background: "#e74c3c", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
    subTitle: { color: "#2d3748", marginBottom: "15px", fontSize: "1.2rem", fontWeight: "600" },
    statsSection: {
        background: "#ffffff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        border: "1px solid #e2e8f0",
        marginBottom: "30px"
    },
    statsTable: { width: "100%", borderCollapse: "collapse" },
    th: { textAlign: "left", padding: "12px", background: "#f8fafc", borderBottom: "2px solid #e2e8f0", color: "#64748b", fontSize: "14px" },
    td: { padding: "12px", borderBottom: "1px solid #edf2f7", color: "#4a5568", fontSize: "14px" },
    formInline: { display: "flex", gap: "10px", marginBottom: "30px", flexWrap: "wrap", alignItems: "center" },
    input: { padding: "10px", borderRadius: "4px", border: "1px solid #ddd", fontSize: "14px" },
    addBtn: { padding: "10px 20px", background: "#1cc88a", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
    assetCard: { border: "1px solid #e3e6f0", padding: "20px", borderRadius: "12px", background: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" },
    deleteBtn: { padding: "8px 15px", background: "#fff", color: "#e74c3c", border: "1px solid #e74c3c", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
    seatGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(45px, 1fr))", gap: "8px", marginTop: "12px" },
    seat: { padding: "8px 5px", background: "#f8f9fc", textAlign: "center", border: "1px solid #e3e6f0", fontSize: "12px", borderRadius: "4px", color: "#4e73df", fontWeight: "bold" }
};

export default AssetManagement;