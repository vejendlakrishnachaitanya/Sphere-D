import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api.jsx";

const ITStaffHistory = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const recordsPerPage = 5;

    useEffect(() => {
        loadHistory(0);
    }, []);

    const loadHistory = async (page) => {
        try {
            setLoading(true);
            // Fetch from the specific history endpoint
            const res = await API.get(`/requests/history/paged?page=${page}&size=${recordsPerPage}`);

            // Spring Data Page object returns data in 'content'
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
            <header style={styles.topNav}>
                <div style={styles.brand}>
                    <h2 style={styles.logo}>Sphere-D <span style={styles.portalTag}>History Archive</span></h2>
                </div>
                <div style={styles.navActions}>
                    <button onClick={() => navigate("/it-staff")} style={styles.backNavBtn}>← Back to Queue</button>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                </div>
            </header>

            <main style={styles.container}>
                <div style={styles.dashboardHeader}>
                    <h1 style={styles.mainTitle}>Fulfillment History</h1>
                    <p style={styles.subTitle}>Records of processed asset requests.</p>
                </div>

                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                        <tr style={styles.tableHeader}>
                            <th style={styles.th}>Employee</th>
                            <th style={styles.th}>Asset Type</th>
                            <th style={styles.th}>Date</th>
                            <th style={styles.th}>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {history.length > 0 ? history.map(req => (
                            <tr key={req.id} style={styles.row}>
                                <td style={styles.td}>{req.user?.name || "System User"}</td>
                                <td style={styles.td}>{req.itemType}</td>
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
                        )) : (
                            <tr><td colSpan="4" style={styles.emptyState}>No completed records found.</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div style={styles.paginationRow}>
                        <button disabled={currentPage === 0} onClick={() => loadHistory(currentPage - 1)} style={styles.pageBtn}>Prev</button>
                        <span style={styles.pageInfo}>Page {currentPage + 1} of {totalPages}</span>
                        <button disabled={currentPage === totalPages - 1} onClick={() => loadHistory(currentPage + 1)} style={styles.pageBtn}>Next</button>
                    </div>
                )}
            </main>
        </div>
    );
};

const styles = {
    pageWrapper: { minHeight: "100vh", backgroundColor: "#f4f7fa", fontFamily: "sans-serif" },
    topNav: { display: "flex", justifyContent: "space-between", padding: "15px 40px", backgroundColor: "#fff", borderBottom: "1px solid #e2e8f0" },
    logo: { margin: 0, color: "#2c3e50" },
    portalTag: { marginLeft: "10px", fontSize: "12px", color: "#4e73df", border: "1px solid #4e73df", padding: "2px 6px", borderRadius: "4px" },
    navActions: { display: "flex", gap: "15px" },
    backNavBtn: { padding: "8px 16px", border: "1px solid #4e73df", color: "#4e73df", borderRadius: "6px", cursor: "pointer", background: "white" },
    logoutBtn: { padding: "8px 16px", background: "#e74c3c", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
    container: { padding: "40px", maxWidth: "1200px", margin: "0 auto" },
    dashboardHeader: { marginBottom: "30px" },
    mainTitle: { margin: 0, fontSize: "26px" },
    subTitle: { color: "#64748b", fontSize: "14px" },
    tableContainer: { backgroundColor: "white", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", overflow: "hidden" },
    table: { width: "100%", borderCollapse: "collapse" },
    tableHeader: { backgroundColor: "#f8fafc", textAlign: "left" },
    th: { padding: "15px", borderBottom: "1px solid #e2e8f0" },
    td: { padding: "15px", borderBottom: "1px solid #f1f5f9" },
    statusBadge: { padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" },
    paginationRow: { display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", marginTop: "30px" },
    pageBtn: { padding: "8px 20px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer" },
    pageInfo: { fontSize: "14px", color: "#718096" },
    loader: { textAlign: "center", padding: "100px", color: "#4e73df", fontWeight: "bold" },
    emptyState: { padding: "60px", textAlign: "center", color: "#94a3b8" }
};

export default ITStaffHistory;