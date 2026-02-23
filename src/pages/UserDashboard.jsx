import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api.jsx";

const PAGE_SIZE = 5;

// Sub-component defined at the top to avoid ReferenceErrors
const Pagination = ({ page, totalPages, setPage }) => {
    if (totalPages <= 1) return null;

    return (
        <div style={styles.pagination}>
            <button
                style={styles.pageBtn}
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
            >
                ◀ Prev
            </button>

            <span style={styles.pageText}>
                Page {page + 1} of {totalPages}
            </span>

            <button
                style={styles.pageBtn}
                disabled={page === totalPages - 1}
                onClick={() => setPage(page + 1)}
            >
                Next ▶
            </button>
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

    // Pagination states for client-side sections
    const [bookingPage, setBookingPage] = useState(0);
    const [assetPage, setAssetPage] = useState(0);

    // Server-side pagination state for requests
    const [requestPage, setRequestPage] = useState(0);
    const [totalRequestPages, setTotalRequestPages] = useState(0);

    const userId = localStorage.getItem("userId");

    const fetchDashboardData = async () => {
        if (!userId) { navigate("/"); return; }

        try {
            setLoading(true);

            // Fetch Profile
            const userRes = await API.get(`/users/${userId}`);
            setUser(userRes.data);

            // Fetch Bookings (Client-side pagination)
            const bookingRes = await API.get(`/bookings/user/${userId}`);
            setBookings(bookingRes.data);

            // Fetch Active Hardware (Client-side pagination)
            const assetRes = await API.get(`/assets/user/${userId}`);
            setMyAssets(assetRes.data);

            setLoading(false);
        } catch (err) {
            console.error("Dashboard Sync Error:", err);
            setLoading(false);
        }
    };

    // Dedicated fetch for Requests to support backend pagination
    const fetchPagedRequests = async (page) => {
        try {
            const requestRes = await API.get(`/requests/user/${userId}/paged?page=${page}&size=${PAGE_SIZE}`);
            // Spring Data Page returns data in 'content'
            setRequests(requestRes.data.content);
            setTotalRequestPages(requestRes.data.totalPages);
        } catch (err) {
            console.error("Error fetching paged requests:", err);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [userId, navigate]);

    // Re-fetch requests whenever the requestPage changes
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

    // CLIENT-SIDE PAGINATION LOGIC (for Bookings and Assets)
    const paginatedBookings = bookings.slice(
        bookingPage * PAGE_SIZE,
        bookingPage * PAGE_SIZE + PAGE_SIZE
    );
    const paginatedAssets = myAssets.slice(
        assetPage * PAGE_SIZE,
        assetPage * PAGE_SIZE + PAGE_SIZE
    );

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

            <div style={styles.grid}>
                {/* BOOKINGS section */}
                <section style={styles.section}>
                    <h3 style={styles.sectionTitle}>📅 My Seat Bookings</h3>
                    <div style={styles.scrollArea}>
                        {paginatedBookings.length > 0 ? paginatedBookings.map(b => (
                            <div key={b.id} style={styles.card}>
                                <div style={styles.cardMain}>
                                    <span style={styles.boldText}>Seat #{b.seatNo}</span>
                                    <span style={styles.subText}>Date: {b.bookingDate}</span>
                                </div>
                                <span style={styles.statusBadge("BOOKED")}>Confirmed</span>
                            </div>
                        )) : <p style={styles.emptyText}>No active bookings found.</p>}
                    </div>
                    <Pagination page={bookingPage} totalPages={totalBookingPages} setPage={setBookingPage} />
                </section>

                {/* ASSETS section */}My
                <section style={styles.section}>
                    <h3 style={styles.sectionTitle}>💻 My Hardware</h3>
                    <div style={styles.scrollArea}>
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
                    </div>
                    <Pagination page={assetPage} totalPages={totalAssetPages} setPage={setAssetPage} />
                </section>

                {/* REQUESTS SECTION: Uses server-side paged data */}
                <section style={styles.section}>
                    <h3 style={styles.sectionTitle}>📦 Asset Request Status</h3>
                    <div style={styles.scrollArea}>
                        {requests.length > 0 ? requests.map(r => (
                            <div key={r.id} style={styles.card}>
                                <div style={styles.cardMain}>
                                    <span style={styles.boldText}>{r.itemType}</span>
                                    <span style={styles.subText}>Requested: {r.requestedDate || r.createdAt}</span>
                                </div>
                                <span style={styles.statusBadge(r.status)}>{r.status}</span>
                            </div>
                        )) : <p style={styles.emptyText}>No requests found on this page.</p>}
                    </div>

                    <Pagination
                        page={requestPage}
                        totalPages={totalRequestPages}
                        setPage={setRequestPage}
                    />
                </section>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: "40px", maxWidth: "1200px", margin: "0 auto", fontFamily: "'Inter', sans-serif", backgroundColor: "#f8fafc", minHeight: "100vh" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
    headerInfo: { display: "flex", flexDirection: "column", gap: "5px" },
    welcomeText: { fontSize: "28px", color: "#1e293b", margin: 0, fontWeight: "bold" },
    deptBadge: { padding: "4px 12px", background: "#e2e8f0", borderRadius: "15px", fontSize: "12px", color: "#64748b", fontWeight: "bold", width: "fit-content" },
    quickActions: { display: "flex", gap: "10px" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "30px" },
    section: { background: "white", padding: "24px", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", border: "1px solid #f1f5f9" },
    sectionTitle: { fontSize: "18px", color: "#334155", marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px", fontWeight: "600" },
    scrollArea: { maxHeight: "400px", overflowY: "auto" },
    card: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "#f8fafc", borderRadius: "12px", marginBottom: "12px", border: "1px solid #e2e8f0" },
    cardMain: { display: "flex", flexDirection: "column", gap: "2px" },
    boldText: { fontWeight: "bold", fontSize: "16px", color: "#475569", display: "block" },
    subText: { fontSize: "12px", color: "#94a3b8" },
    emptyText: { textAlign: "center", color: "#94a3b8", padding: "40px", fontSize: "14px" },
    actionBtn: { padding: "10px 20px", background: "#4e73df", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
    actionBtnSecondary: { padding: "10px 20px", background: "#1cc88a", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
    logoutBtn: { padding: "10px 20px", background: "#34495e", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
    brokenBtn: { padding: "6px 12px", background: "white", color: "#e74c3c", border: "1px solid #e74c3c", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" },
    pagination: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        marginTop: "10px"
    },
    pageBtn: {
        padding: "5px 12px",
        borderRadius: "6px",
        border: "1px solid #cbd5e1",
        background: "white",
        cursor: "pointer"
    },
    pageText: {
        fontSize: "12px",
        fontWeight: "bold"
    },
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
        return {
            padding: "4px 10px",
            borderRadius: "6px",
            fontSize: "11px",
            fontWeight: "bold",
            backgroundColor: style.bg,
            color: style.text
        };
    },
    loader: {
        textAlign: "center",
        paddingTop: "100px",
        fontSize: "20px",
        color: "#4e73df"
    }
};

export default UserDashboard;