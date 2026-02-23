import React, { useEffect, useState } from "react";
import API from "../api/api.jsx";

const ViewAssets = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Calls AssetController.getActiveAssets()
        API.get("/assets")
            .then(res => {
                setAssets(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching assets:", err);
                setLoading(false);
            });
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case "AVAILABLE": return { backgroundColor: "#d4edda", color: "#155724" };
            case "BROKEN": return { backgroundColor: "#f8d7da", color: "#721c24" };
            case "MAINTENANCE": return { backgroundColor: "#fff3cd", color: "#856404" };
            default: return { backgroundColor: "#e2e3e5", color: "#383d41" };
        }
    };

    if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Loading inventory...</div>;

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h2 style={styles.title}>Company Assets & Inventory</h2>
                <p style={styles.subtitle}>{assets.length} Active items in system</p>
            </header>

            <div style={styles.grid}>
                {assets.map(asset => (
                    <div key={asset.id} style={styles.card}>
                        <div style={styles.cardHeader}>
                            <span style={styles.typeTag}>{asset.assetType}</span>
                            <span style={{ ...styles.statusBadge, ...getStatusStyle(asset.status) }}>
                                {asset.status}
                            </span>
                        </div>

                        <div style={styles.cardBody}>
                            <h3 style={styles.serialText}>SN: {asset.serialNumber}</h3>
                            <div style={styles.details}>
                                <span>Capacity: <strong>{asset.totalItems} Units</strong></span>
                            </div>
                        </div>


                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: { padding: "40px", maxWidth: "1200px", margin: "0 auto", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
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
    typeTag: { fontSize: "12px", fontWeight: "bold", color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.5px" },
    statusBadge: { padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "bold" },
    cardBody: { padding: "20px", flex: 1 },
    serialText: { margin: "0 0 10px 0", fontSize: "18px", color: "#2d3748" },
    details: { color: "#4a5568", fontSize: "14px" },
    cardFooter: { padding: "15px", background: "#f8fafc", textAlign: "right" },
    actionBtn: {
        background: "#4e73df",
        color: "#white",
        border: "none",
        padding: "8px 16px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "bold"
    }
};

export default ViewAssets;