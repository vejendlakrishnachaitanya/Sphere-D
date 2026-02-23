import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api.jsx";

const PAGE_SIZE = 5;

const ITStaffDashboard = () => {

    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination state
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

        }
        catch (err) {

            console.error("Error fetching requests", err);
            setLoading(false);

        }

    };

    const handleLogout = () => {

        localStorage.clear();
        navigate("/");

    };

    const handleApprove = async (id) => {

        try {

            await API.put(`/requests/${id}/approve`);

            alert("Request Approved!");

            loadRequests();

        }
        catch {

            alert("Failed to approve request.");

        }

    };

    const handleAssign = async (id) => {

        try {

            await API.put(`/requests/${id}/assign`);

            alert("Asset marked as Assigned!");

            loadRequests();

        }
        catch {

            alert("Failed to assign request.");

        }

    };

    if (loading)
        return (
            <div style={{ padding: "40px", textAlign: "center" }}>
                Loading IT Queue...
            </div>
        );

    // Pagination logic
    const totalPages = Math.ceil(requests.length / PAGE_SIZE);

    const paginatedRequests =
        requests.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

    return (

        <div style={styles.pageWrapper}>


            {/* PROFESSIONAL TOP NAV */}

            <header style={styles.topNav}>

                <div style={styles.brand}>

                    <h2 style={styles.logo}>
                        Sphere-D
                        <span style={styles.portalTag}>
                            IT Portal
                        </span>
                    </h2>

                </div>


                <div style={styles.navActions}>

                    <button
                        onClick={() => navigate("/it-staff/history")}
                        style={styles.historyBtn}
                    >
                        📜 View History
                    </button>


                    <button
                        onClick={handleLogout}
                        style={styles.logoutBtn}
                    >
                        Logout
                    </button>

                </div>

            </header>



            {/* MAIN CONTENT */}

            <main style={styles.container}>

                <div style={styles.headerRow}>

                    <div style={styles.titleSection}>

                        <h1 style={styles.mainTitle}>
                            Pending Approvals
                        </h1>

                        <p style={styles.subTitle}>
                            Manage active requests (Page {page + 1})
                        </p>

                    </div>

                </div>


                {/* TABLE */}

                <table style={styles.table}>

                    <thead>

                    <tr style={styles.tableHeader}>

                        <th>Employee</th>

                        <th>Asset Type</th>

                        <th>Status</th>

                        <th>Action</th>

                    </tr>

                    </thead>


                    <tbody>

                    {paginatedRequests.length > 0 ? (

                        paginatedRequests.map(req => (

                            <tr key={req.id} style={styles.row}>

                                <td>
                                    {req.user?.name || "Unknown User"}
                                </td>


                                <td>
                                    {req.itemType}
                                </td>


                                <td>

                                    <span style={styles.statusBadge(req.status)}>
                                        {req.status}
                                    </span>

                                </td>


                                <td>

                                    {req.status === "SUBMITTED" && (

                                        <button
                                            onClick={() => handleApprove(req.id)}
                                            style={styles.approveBtn}
                                        >
                                            Approve
                                        </button>

                                    )}


                                    {req.status === "APPROVED" && (

                                        <button
                                            onClick={() => handleAssign(req.id)}
                                            style={styles.assignBtn}
                                        >
                                            Confirm Assignment
                                        </button>

                                    )}

                                </td>

                            </tr>

                        ))

                    ) : (

                        <tr>

                            <td colSpan="4" style={styles.emptyRow}>

                                No pending requests found.

                            </td>

                        </tr>

                    )}

                    </tbody>

                </table>



                {/* PAGINATION */}

                {totalPages > 0 && (

                    <div style={styles.pagination}>

                        <button
                            disabled={page === 0}
                            onClick={() => setPage(page - 1)}
                            style={styles.pageBtn}
                        >
                            Previous
                        </button>


                        <span style={styles.pageInfo}>

                            Page {page + 1} of {totalPages}

                        </span>


                        <button
                            disabled={page === totalPages - 1}
                            onClick={() => setPage(page + 1)}
                            style={styles.pageBtn}
                        >
                            Next
                        </button>

                    </div>

                )}

            </main>

        </div>

    );

};



/* STYLES */

const styles = {

    pageWrapper: {

        minHeight: "100vh",
        backgroundColor: "#f4f7fa",
        fontFamily: "'Inter', sans-serif"

    },


    topNav: {

        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 40px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #e2e8f0"

    },


    logo: {

        margin: 0,
        color: "#2c3e50"

    },


    portalTag: {

        marginLeft: "10px",
        fontSize: "12px",
        color: "#4e73df",
        border: "1px solid #4e73df",
        padding: "2px 6px",
        borderRadius: "4px"

    },


    navActions: {

        display: "flex",
        gap: "15px"

    },


    historyBtn: {

        padding: "8px 16px",
        border: "1px solid #4e73df",
        color: "#4e73df",
        borderRadius: "6px",
        cursor: "pointer",
        background: "white",
        fontWeight: "bold"

    },


    logoutBtn: {

        padding: "8px 16px",
        background: "#e74c3c",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold"

    },


    container: {

        padding: "40px",
        maxWidth: "1200px",
        margin: "0 auto"

    },


    headerRow: {

        marginBottom: "20px"

    },


    mainTitle: {

        margin: 0,
        fontSize: "28px",
        color: "#1e293b"

    },


    subTitle: {

        margin: 0,
        color: "#64748b",
        fontSize: "14px"

    },


    table: {

        width: "100%",
        background: "#fff",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px rgba(0,0,0,0.05)"

    },


    tableHeader: {

        background: "#f8fafc",
        textAlign: "left"

    },


    row: {

        borderTop: "1px solid #f1f5f9"

    },


    emptyRow: {

        padding: "40px",
        textAlign: "center",
        color: "#94a3b8"

    },


    statusBadge: (status) => ({

        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "bold",
        background:
            status === "SUBMITTED" ? "#fef9c3" : "#dcfce7",
        color:
            status === "SUBMITTED" ? "#854d0e" : "#166534"

    }),


    approveBtn: {

        background: "#1cc88a",
        color: "white",
        border: "none",
        padding: "8px 14px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold"

    },


    assignBtn: {

        background: "#4e73df",
        color: "white",
        border: "none",
        padding: "8px 14px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold"

    },


    pagination: {

        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "15px",
        marginTop: "25px"

    },


    pageBtn: {

        padding: "8px 16px",
        background: "#eef2ff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
        color: "#3730a3"

    },


    pageInfo: {

        fontSize: "14px",
        fontWeight: "bold",
        color: "#475569"

    }

};

export default ITStaffDashboard;