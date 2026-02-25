import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api"; // Ensure this points to your axios instance

const CreateAsset = () => {
    const navigate = useNavigate();
    const [asset, setAsset] = useState({
        serialNumber: "",
        assetType: "SEAT", // Default value
        status: "AVAILABLE", // Default value
        totalItems: "0"
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAsset({
            ...asset,
            [name]: name === "totalItems" ? parseInt(value) || 0 : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            // This calls the @PostMapping in AssetController
            await API.post("/assets", asset);
            alert("Asset created successfully!");
            navigate("/admin"); // Redirect back to admin dashboard
        } catch (err) {
            setError(err.response?.data?.error || "Failed to create asset. Ensure Serial Number is unique.");
        }
    };

    return (
        <div style={styles.container}>
            {/* Simple Back Button added here */}
            <div style={styles.topBar}>
                <button style={styles.backBtn} onClick={() => navigate("/admin")}>
                    ← Back
                </button>
            </div>

            <div style={styles.card}>
                <h2 style={styles.title}>Create New Asset</h2>
                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label>Serial Number:</label>
                        <input
                            type="text"
                            name="serialNumber"
                            value={asset.serialNumber}
                            onChange={handleChange}
                            placeholder="Enter unique serial number"
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label>Asset Type:</label>
                        <select
                            name="assetType"
                            value={asset.assetType}
                            onChange={handleChange}
                            style={styles.input}
                        >
                            <option value="SEAT">Office Seat/Layout</option>
                            <option value="LAPTOP">Laptop</option>
                            <option value="MONITOR">Monitor</option>
                            <option value="KEYBOARD">Keyboard</option>
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label>Status:</label>
                        <select
                            name="status"
                            value={asset.status}
                            onChange={handleChange}
                            style={styles.input}
                        >
                            <option value="AVAILABLE">Available</option>
                            <option value="MAINTENANCE">Under Maintenance</option>
                            <option value="BROKEN">Broken</option>
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label>Total Items / Capacity:</label>
                        <input
                            type="number"
                            name="totalItems"
                            value={asset.totalItems}
                            onChange={handleChange}
                            placeholder="e.g., number of seats"
                            style={styles.input}
                            min="1"
                            required
                        />
                    </div>

                    {error && <p style={styles.error}>{error}</p>}

                    <div style={styles.buttonGroup}>
                        <button type="button" onClick={() => navigate("/admin")} style={styles.cancelBtn}>
                            Cancel
                        </button>
                        <button type="submit" style={styles.submitBtn}>
                            Save Asset
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "50px",
        backgroundColor: "#f4f7f6",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif"
    },
    topBar: {
        width: "100%",
        maxWidth: "500px",
        display: "flex",
        justifyContent: "flex-start",
        marginBottom: "20px"
    },
    backBtn: {
        padding: "10px 15px",
        cursor: "pointer",
        background: "#4e73df", // Standardized blue color
        color: "white",
        border: "none",
        borderRadius: "5px",
        fontWeight: "bold"
    },
    card: { background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", width: "100%", maxWidth: "500px" },
    title: { textAlign: "center", marginBottom: "25px", color: "#333" },
    formGroup: { marginBottom: "15px" },
    input: { width: "100%", padding: "12px", marginTop: "5px", borderRadius: "6px", border: "1px solid #ddd", boxSizing: "border-box" },
    buttonGroup: { display: "flex", justifyContent: "space-between", marginTop: "20px" },
    submitBtn: { padding: "10px 20px", background: "#4e73df", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
    cancelBtn: { padding: "10px 20px", background: "#858796", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
    error: { color: "red", fontSize: "14px", marginBottom: "10px" }
};

export default CreateAsset;