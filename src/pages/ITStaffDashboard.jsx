import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api.jsx";

const PAGE_SIZE = 2; // Increased page size for better table utility

const ITStaffDashboard = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            const res = await API.get("/requests");
            const itRequests = res.data.filter(r =>
                r.status === "SUBMITTED" || r.status === "APPROVED"
            );
            setRequests(itRequests);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching requests", err);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const handleAction = async (id, endpoint, successMsg) => {
        try {
            await API.put(`/requests/${id}/${endpoint}`);
            alert(successMsg);
            loadRequests();
        } catch (err) {
            alert(err.response?.data?.error || "Action failed.");
        }
    };

    if (loading) return <div style={styles.loader}>Syncing IT Queue...</div>;

    const totalPages = Math.ceil(requests.length / PAGE_SIZE);
    const paginatedRequests = requests.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

    return (
        <div style={styles.pageWrapper}>
            <header style={styles.topNav}>
                <h2 style={styles.logo}>Sphere-D <span style={styles.portalTag}>IT Fulfillment</span></h2>
                <div style={styles.navActions}>
                    <button onClick={() => navigate("/it-staff/history")} style={styles.historyBtn}>📜 History</button>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                </div>
            </header>

            <main style={styles.container}>
                <div style={styles.headerRow}>
                    <h1 style={styles.mainTitle}>Active Fulfillment Queue</h1>
                    <p style={styles.subTitle}>Manage and process pending hardware requests.</p>
                </div>

                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                        <tr style={styles.tableHeader}>
                            <th style={styles.th}>Employee</th>
                            <th style={styles.th}>Department</th>
                            <th style={styles.th}>Item Type</th>
                            <th style={styles.th}>Quantity</th>
                            <th style={styles.th}>Requested Date</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedRequests.length > 0 ? (
                            paginatedRequests.map(req => (
                                <tr key={req.id} style={styles.tr}>
                                    <td style={styles.td}>
                                        <div style={styles.userCell}>
                                            <div style={styles.userAvatar}>{req.user?.name?.charAt(0) || "U"}</div>
                                            {req.user?.name || "Unknown User"}
                                        </div>
                                    </td>
                                    <td style={styles.td}>{req.user?.department || "General"}</td>
                                    <td style={styles.td}><span style={styles.itemTag}>{req.itemType}</span></td>
                                    <td style={styles.td}><strong>x{req.quantity || 1}</strong></td>
                                    <td style={styles.td}>{req.requestedDate || "N/A"}</td>
                                    <td style={styles.td}>
                                        <span style={styles.statusBadge(req.status)}>{req.status}</span>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={styles.actionCell}>
                                            {req.status === "SUBMITTED" ? (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(req.id, "approve", "Approved!")}
                                                        style={styles.approveBtn}
                                                    >Approve</button>
                                                    <button
                                                        onClick={() => handleAction(req.id, "reject", "Rejected.")}
                                                        style={styles.rejectBtn}
                                                    >Reject</button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => handleAction(req.id, "assign", "Assets Assigned!")}
                                                    style={styles.assignBtn}
                                                >Confirm Assignment</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={styles.emptyState}>No pending tasks in the queue.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div style={styles.pagination}>
                        <button disabled={page === 0} onClick={() => setPage(page - 1)} style={styles.pageBtn}>Prev</button>
                        <span style={styles.pageInfo}>Page {page + 1} of {totalPages}</span>
                        <button disabled={page === totalPages - 1} onClick={() => setPage(page + 1)} style={styles.pageBtn}>Next</button>
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
    historyBtn: { background: "#334155", color: "#fff", border: "none", padding: "7px 14px", borderRadius: "5px", cursor: "pointer", fontWeight: "600", fontSize: "13px" },
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
    userAvatar: { width: "28px", height: "28px", borderRadius: "50%", background: "#4f46e5", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" },
    itemTag: { background: "#eff6ff", color: "#1d4ed8", padding: "4px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "600" },
    statusBadge: (s) => ({ fontSize: "11px", fontWeight: "bold", padding: "4px 8px", borderRadius: "5px", background: s === "SUBMITTED" ? "#fef9c3" : "#dcfce7", color: s === "SUBMITTED" ? "#854d0e" : "#166534" }),
    actionCell: { display: "flex", gap: "8px" },
    approveBtn: { background: "#10b981", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "5px", fontSize: "12px", fontWeight: "600", cursor: "pointer" },
    rejectBtn: { background: "#fee2e2", color: "#ef4444", border: "none", padding: "6px 12px", borderRadius: "5px", fontSize: "12px", fontWeight: "600", cursor: "pointer" },
    assignBtn: { background: "#4f46e5", color: "#fff", border: "none", padding: "6px 16px", borderRadius: "5px", fontSize: "12px", fontWeight: "600", cursor: "pointer" },
    pagination: { display: "flex", justifyContent: "center", gap: "15px", marginTop: "30px", alignItems: "center" },
    pageBtn: { background: "#fff", border: "1px solid #e2e8f0", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "13px", color: "#475569" },
    pageInfo: { fontSize: "13px", fontWeight: "600", color: "#64748b" },
    loader: { textAlign: "center", paddingTop: "100px", color: "#4f46e5", fontWeight: "bold" },
    emptyState: { textAlign: "center", padding: "50px", color: "#94a3b8", fontSize: "14px" }
};

export default ITStaffDashboard;