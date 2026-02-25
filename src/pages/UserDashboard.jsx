import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api.jsx";

const PAGE_SIZE = 5;

// Shared Pagination Component
const Pagination = ({ page, totalPages, setPage }) => {
    if (totalPages <= 1) return null;
    return (
        <div style={styles.pagination}>
            <button style={styles.pageBtn} disabled={page === 0} onClick={() => setPage(page - 1)}>◀ Prev</button>
            <span style={styles.pageText}>Page {page + 1} of {totalPages}</span>
            <button style={styles.pageBtn} disabled={page === totalPages - 1} onClick={() => setPage(page + 1)}>Next ▶</button>
        </div>
    );
};

const UserDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [requests, setRequests] = useState([]);
    const [myAssets, setMyAssets] = useState([]);
    const [loading, setLoading] = useState(true);

    // Tab and Pagination State
    const [currentTab, setCurrentTab] = useState("bookings");
    const [bookingPage, setBookingPage] = useState(0);
    const [assetPage, setAssetPage] = useState(0);
    const [requestPage, setRequestPage] = useState(0);
    const [totalRequestPages, setTotalRequestPages] = useState(0);

    const userId = localStorage.getItem("userId");

    const fetchDashboardData = async () => {
        if (!userId) { navigate("/"); return; }
        try {
            setLoading(true);
            const userRes = await API.get(`/users/${userId}`);
            setUser(userRes.data);
            const bookingRes = await API.get(`/bookings/user/${userId}`);
            setBookings(bookingRes.data);
            const assetRes = await API.get(`/assets/user/${userId}`);
            setMyAssets(assetRes.data);
            setLoading(false);
        } catch (err) {
            console.error("Dashboard Sync Error:", err);
            setLoading(false);
        }
    };

    const fetchPagedRequests = async (page) => {
        try {
            const requestRes = await API.get(`/requests/user/${userId}/paged?page=${page}&size=${PAGE_SIZE}`);
            setRequests(requestRes.data.content);
            setTotalRequestPages(requestRes.data.totalPages);
        } catch (err) {
            console.error("Error fetching paged requests:", err);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [userId, navigate]);

    useEffect(() => {
        if (userId) fetchPagedRequests(requestPage);
    }, [userId, requestPage]);

    const handleReportBrokenAndReplace = async (assetId, assetType) => {
        if (window.confirm(`Report this ${assetType} as broken? A replacement request will be drafted automatically.`)) {
            try {
                await API.put(`/assets/${assetId}/broken/${userId}`);
                alert("Reported successfully. A new replacement request has been drafted.");
                fetchDashboardData();
                fetchPagedRequests(requestPage);
            } catch (err) {
                alert("Failed to report asset.");
            }
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    if (loading) return <div style={styles.loader}>Syncing...</div>;

    // Logic for client-side pagination
    const paginatedBookings = bookings.slice(bookingPage * PAGE_SIZE, (bookingPage + 1) * PAGE_SIZE);
    const paginatedAssets = myAssets.slice(assetPage * PAGE_SIZE, (assetPage + 1) * PAGE_SIZE);
    const totalBookingPages = Math.ceil(bookings.length / PAGE_SIZE);
    const totalAssetPages = Math.ceil(myAssets.length / PAGE_SIZE);

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.headerInfo}>
                    <h1 style={styles.welcomeText}>Welcome, {user?.name}</h1>
                    <span style={styles.deptBadge}>{user?.department || "General"} Dept</span>
                </div>
                <div style={styles.quickActions}>
                    <button style={styles.actionBtn} onClick={() => navigate('/book-seat')}>Book a Seat</button>
                    <button style={styles.actionBtnSecondary} onClick={() => navigate('/user/request-asset')}>Request Asset</button>
                    <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
                </div>
            </header>

            {/* Tabs Navigation */}
            <div style={styles.tabContainer}>
                <button style={currentTab === "bookings" ? styles.activeTab : styles.tab} onClick={() => setCurrentTab("bookings")}>📅 My Bookings</button>
                <button style={currentTab === "assets" ? styles.activeTab : styles.tab} onClick={() => setCurrentTab("assets")}>💻 My Hardware</button>
                <button style={currentTab === "requests" ? styles.activeTab : styles.tab} onClick={() => setCurrentTab("requests")}>📦 Request Status</button>
            </div>

            <div style={styles.tabContent}>
                {/* Bookings Tab */}
                {currentTab === "bookings" && (
                    <section style={styles.section}>
                        <h3 style={styles.sectionTitle}>My Seat Bookings</h3>
                        {paginatedBookings.length > 0 ? paginatedBookings.map(b => (
                            <div key={b.id} style={styles.card}>
                                <div style={styles.cardMain}>
                                    <span style={styles.boldText}>Seat #{b.seatNo}</span>
                                    <span style={styles.subText}>Date: {b.bookingDate}</span>
                                </div>
                                <span style={styles.statusBadge("BOOKED")}>Confirmed</span>
                            </div>
                        )) : <p style={styles.emptyText}>No active bookings found.</p>}
                        <Pagination page={bookingPage} totalPages={totalBookingPages} setPage={setBookingPage} />
                    </section>
                )}

                {/* Hardware Tab */}
                {currentTab === "assets" && (
                    <section style={styles.section}>
                        <h3 style={styles.sectionTitle}>My Hardware</h3>
                        {paginatedAssets.length > 0 ? paginatedAssets.map(a => (
                            <div key={a.id} style={{ ...styles.card, borderLeft: a.status === "BROKEN" ? "5px solid #e74c3c" : "1px solid #e2e8f0" }}>
                                <div style={styles.cardMain}>
                                    <span style={styles.boldText}>{a.assetType}</span>
                                    <span style={styles.subText}>SN: {a.serialNumber}</span>
                                    <span style={{ ...styles.subText, color: a.status === "BROKEN" ? "#e74c3c" : "#1cc88a", fontWeight: "bold", marginTop: "4px" }}>Status: {a.status}</span>
                                </div>
                                {a.status !== "BROKEN" ? (
                                    <button style={styles.brokenBtn} onClick={() => handleReportBrokenAndReplace(a.id, a.assetType)}>Report Broken</button>
                                ) : (
                                    <span style={styles.statusBadge("SUBMITTED")}>Replacement Pending</span>
                                )}
                            </div>
                        )) : <p style={styles.emptyText}>No hardware assigned yet.</p>}
                        <Pagination page={assetPage} totalPages={totalAssetPages} setPage={setAssetPage} />
                    </section>
                )}

                {/* Request Status Tab */}
                {currentTab === "requests" && (
                    <section style={styles.section}>
                        <h3 style={styles.sectionTitle}>Asset Request Status</h3>
                        {requests.length > 0 ? requests.map(r => (
                            <div key={r.id} style={styles.card}>
                                <div style={styles.cardMain}>
                                    <span style={styles.boldText}>{r.itemType} (Qty: {r.quantity || 1})</span>
                                    <span style={styles.subText}>Requested: {r.requestedDate || r.createdAt}</span>
                                </div>
                                <span style={styles.statusBadge(r.status)}>{r.status}</span>
                            </div>
                        )) : <p style={styles.emptyText}>No requests found.</p>}
                        <Pagination page={requestPage} totalPages={totalRequestPages} setPage={setRequestPage} />
                    </section>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: { padding: "40px", maxWidth: "900px", margin: "0 auto", fontFamily: "'Inter', sans-serif", backgroundColor: "#f8fafc", minHeight: "100vh" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
    headerInfo: { display: "flex", flexDirection: "column", gap: "5px" },
    welcomeText: { fontSize: "28px", color: "#1e293b", margin: 0, fontWeight: "bold" },
    deptBadge: { padding: "4px 12px", background: "#e2e8f0", borderRadius: "15px", fontSize: "12px", color: "#64748b", fontWeight: "bold", width: "fit-content" },
    quickActions: { display: "flex", gap: "10px" },
    tabContainer: { display: "flex", gap: "10px", marginBottom: "20px", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px" },
    tab: { padding: "10px 20px", border: "none", background: "none", cursor: "pointer", fontSize: "16px", color: "#64748b", fontWeight: "600" },
    activeTab: { padding: "10px 20px", border: "none", background: "white", cursor: "pointer", fontSize: "16px", color: "#4e73df", fontWeight: "bold", borderBottom: "3px solid #4e73df" },
    section: { background: "white", padding: "24px", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" },
    sectionTitle: { fontSize: "20px", color: "#334155", marginBottom: "20px", fontWeight: "700" },
    card: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "#f8fafc", borderRadius: "12px", marginBottom: "12px", border: "1px solid #e2e8f0" },
    cardMain: { display: "flex", flexDirection: "column", gap: "2px" },
    boldText: { fontWeight: "bold", fontSize: "16px", color: "#475569" },
    subText: { fontSize: "12px", color: "#94a3b8" },
    emptyText: { textAlign: "center", color: "#94a3b8", padding: "60px" },
    actionBtn: { padding: "10px 20px", background: "#4e73df", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
    actionBtnSecondary: { padding: "10px 20px", background: "#1cc88a", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
    logoutBtn: { padding: "10px 20px", background: "#34495e", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
    brokenBtn: { padding: "6px 12px", background: "white", color: "#e74c3c", border: "1px solid #e74c3c", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" },
    pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginTop: "20px" },
    pageBtn: { padding: "5px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "white", cursor: "pointer" },
    pageText: { fontSize: "12px", fontWeight: "bold" },
    statusBadge: (status) => {
        const colors = {
            BOOKED: { bg: "#dcfce7", text: "#166534" },
            APPROVED: { bg: "#dcfce7", text: "#166534" },
            SUBMITTED: { bg: "#fef9c3", text: "#854d0e" },
            ASSIGNED: { bg: "#e0e7ff", text: "#3730a3" },
            DRAFT: { bg: "#f1f5f9", text: "#475569" },
            REJECTED: { bg: "#fee2e2", text: "#991b1b" }
        };
        const style = colors[status] || { bg: "#f1f5f9", text: "#475569" };
        return { padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold", backgroundColor: style.bg, color: style.text };
    },
    loader: { textAlign: "center", paddingTop: "100px", fontSize: "20px", color: "#4e73df" }
};

export default UserDashboard;