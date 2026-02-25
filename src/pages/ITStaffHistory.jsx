import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api.jsx";

const PAGE_SIZE = 8; // Optimal size for history tables

const ITStaffHistory = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        loadHistory(0);
    }, []);

    const loadHistory = async (page) => {
        try {
            setLoading(true);
            const res = await API.get(`/requests/history/paged?page=${page}&size=${PAGE_SIZE}`);
            setHistory(res.data.content);
            setTotalPages(res.data.totalPages);
            setCurrentPage(res.data.number);
        } catch (err) {
            console.error("Error fetching history:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    if (loading) return <div style={styles.loader}>Loading History Archive...</div>;

    return (
        <div style={styles.pageWrapper}>
            {/* TOP NAVIGATION */}
            <header style={styles.topNav}>
                <h2 style={styles.logo}>Sphere-D <span style={styles.portalTag}>History Archive</span></h2>
                <div style={styles.navActions}>
                    <button onClick={() => navigate("/it-staff")} style={styles.backNavBtn}>← Back to Queue</button>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                </div>
            </header>

            <main style={styles.container}>
                <div style={styles.headerRow}>
                    <h1 style={styles.mainTitle}>Fulfillment History</h1>
                    <p style={styles.subTitle}>Audit trail of processed and completed asset requests.</p>
                </div>

                {/* HISTORY TABLE */}
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                        <tr style={styles.tableHeader}>
                            <th style={styles.th}>Employee</th>
                            <th style={styles.th}>Department</th>
                            <th style={styles.th}>Item Type</th>
                            <th style={styles.th}>Quantity</th>
                            <th style={styles.th}>Request Date</th>
                            <th style={styles.th}>Final Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {history.length > 0 ? (
                            history.map(req => (
                                <tr key={req.id} style={styles.tr}>
                                    <td style={styles.td}>
                                        <div style={styles.userCell}>
                                            <div style={styles.userAvatar}>{req.user?.name?.charAt(0) || "U"}</div>
                                            {req.user?.name || "System User"}
                                        </div>
                                    </td>
                                    <td style={styles.td}>{req.user?.department || "General"}</td>
                                    <td style={styles.td}><span style={styles.itemTag}>{req.itemType}</span></td>
                                    <td style={styles.td}><strong>x {req.quantity || 1}</strong></td>
                                    <td style={styles.td}>{req.requestedDate || "N/A"}</td>
                                    <td style={styles.td}>
                                            <span style={{
                                                ...styles.statusBadge,
                                                backgroundColor: req.status === "REJECTED" ? "#fee2e2" : "#e0e7ff",
                                                color: req.status === "REJECTED" ? "#991b1b" : "#3730a3"
                                            }}>
                                                {req.status}
                                            </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={styles.emptyState}>No completed records found.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div style={styles.paginationRow}>
                        <button
                            disabled={currentPage === 0}
                            onClick={() => loadHistory(currentPage - 1)}
                            style={styles.pageBtn}
                        >Prev</button>
                        <span style={styles.pageInfo}>Page {currentPage + 1} of {totalPages}</span>
                        <button
                            disabled={currentPage === totalPages - 1}
                            onClick={() => loadHistory(currentPage + 1)}
                            style={styles.pageBtn}
                        >Next</button>
                    </div>
                )}
            </main>
        </div>
    );
};

const styles = {
    pageWrapper: { minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "'Inter', sans-serif" },
    topNav: { display: "flex", justifyContent: "space-between", padding: "12px 50px", backgroundColor: "#1e293b", color: "#fff", alignItems: 'center' },
    logo: { margin: 0, fontSize: "20px" },
    portalTag: { fontSize: "11px", border: "1px solid #38bdf8", color: "#38bdf8", padding: "1px 6px", borderRadius: "4px", marginLeft: "8px" },
    navActions: { display: "flex", gap: "10px" },
    backNavBtn: { background: "#334155", color: "#fff", border: "none", padding: "7px 14px", borderRadius: "5px", cursor: "pointer", fontWeight: "600", fontSize: "13px" },
    logoutBtn: { background: "#ef4444", color: "#fff", border: "none", padding: "7px 14px", borderRadius: "5px", cursor: "pointer", fontWeight: "600", fontSize: "13px" },
    container: { padding: "40px 50px" },
    headerRow: { marginBottom: "25px" },
    mainTitle: { fontSize: "24px", color: "#0f172a", margin: 0 },
    subTitle: { color: "#64748b", marginTop: "4px", fontSize: "14px" },
    tableContainer: { background: "#fff", borderRadius: "10px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" },
    table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
    tableHeader: { backgroundColor: "#f1f5f9", borderBottom: "2px solid #e2e8f0" },
    th: { padding: "14px 16px", fontSize: "13px", fontWeight: "600", color: "#475569", textTransform: "uppercase", letterSpacing: "0.025em" },
    tr: { borderBottom: "1px solid #f1f5f9", transition: "background 0.2s" },
    td: { padding: "14px 16px", fontSize: "14px", color: "#334155", verticalAlign: "middle" },
    userCell: { display: "flex", alignItems: "center", gap: "10px", fontWeight: "500" },
    userAvatar: { width: "28px", height: "28px", borderRadius: "50%", background: "#6366f1", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" },
    itemTag: { background: "#eff6ff", color: "#1d4ed8", padding: "4px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "600" },
    statusBadge: { padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" },
    paginationRow: { display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", marginTop: "40px" },
    pageBtn: { background: "#fff", border: "1px solid #e2e8f0", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", color: "#475569" },
    pageInfo: { fontSize: "13px", fontWeight: "600", color: "#64748b" },
    loader: { textAlign: "center", padding: "100px", color: "#4f46e5", fontWeight: "bold" },
    emptyState: { textAlign: "center", padding: "50px", color: "#94a3b8", fontSize: "14px" }
};

export default ITStaffHistory;