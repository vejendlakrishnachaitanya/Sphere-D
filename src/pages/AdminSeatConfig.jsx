import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api.jsx";

const AdminSeatConfig = () => {
    const navigate = useNavigate();
    const [assets, setAssets] = useState([]);
    const [config, setConfig] = useState({ assetId: "", date: "", totalItems: 0 });

    useEffect(() => {
        // Fetch active assets to choose which area to configure
        API.get("/assets").then(res => setAssets(res.data));
    }, []);

    const handleUpdateLayout = async (e) => {
        e.preventDefault();
        try {
            // Update the asset items for the chosen layout
            await API.put(`/assets/${config.assetId}`, {
                totalItems: config.totalItems,
                // These fields are required by your updateAsset logic
                serialNumber: assets.find(a => a.id == config.assetId).serialNumber,
                assetType: "SEAT",
                status: "AVAILABLE"
            });
            alert(`Layout updated: ${config.totalItems} seats available for ${config.date}`);
            navigate("/admin");
        } catch (err) {
            alert("Error updating layout");
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
                <h2 style={styles.title}>Configure Seat Layout</h2>
                <form onSubmit={handleUpdateLayout}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Select Asset/Area:</label>
                        <select style={styles.input} onChange={e => setConfig({...config, assetId: e.target.value})} required>
                            <option value="">-- Select Area --</option>
                            {assets.filter(a => a.assetType === "SEAT").map(a => (
                                <option key={a.id} value={a.id}>{a.serialNumber}</option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Target Date:</label>
                        <input type="date" style={styles.input} onChange={e => setConfig({...config, date: e.target.value})} required />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Number of Seats to Open:</label>
                        <input type="number" style={styles.input} placeholder="e.g. 50"
                               onChange={e => setConfig({...config, totalItems: e.target.value})} required />
                    </div>

                    <button type="submit" style={styles.submitBtn}>Update Capacity</button>
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
        maxWidth: "500px", // Align with card width
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
        maxWidth: "500px",
        background: "white",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
    },
    title: { textAlign: "center", marginBottom: "25px", color: "#333" },
    formGroup: { marginBottom: "15px", display: "flex", flexDirection: "column" },
    label: { marginBottom: "5px", fontWeight: "bold", color: "#4a5568" },
    input: {
        width: "100%",
        padding: "12px",
        borderRadius: "6px",
        border: "1px solid #ddd",
        boxSizing: "border-box"
    },
    submitBtn: {
        width: "100%",
        padding: "12px",
        background: "#4e73df",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "16px",
        marginTop: "10px"
    }
};

export default AdminSeatConfig;