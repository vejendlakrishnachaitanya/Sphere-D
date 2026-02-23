import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api.jsx";

const AssetRequest = () => {
    const navigate = useNavigate();
    const [itemType, setItemType] = useState("LAPTOP");
    const [requestedDate, setRequestedDate] = useState("");
    const [hasBooking, setHasBooking] = useState(true);
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");

    useEffect(() => {
        if (requestedDate) {
            checkBookingStatus();
        }
    }, [requestedDate]);

    const checkBookingStatus = async () => {
        try {
            const res = await API.get(`/bookings/user/${userId}`);
            const bookingExists = res.data.some(b => b.bookingDate === requestedDate);
            setHasBooking(bookingExists);
        } catch (err) {
            console.error("Error verifying booking:", err);
        }
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!hasBooking) {
            alert("Action Denied: You do not have a seat booked for this date.");
            return;
        }

        try {
            const draftRes = await API.post(
                `/requests/draft?userId=${userId}&itemType=${itemType}&requestedDate=${requestedDate}`
            );
            await API.put(`/requests/${draftRes.data.id}/submit`);
            alert("Request sent successfully!");
            returnToDashboard();
        } catch (err) {
            alert(err.response?.data?.error || "Error submitting request.");
        }
    };

    return (
        <div style={styles.mainWrapper}>
            <div style={styles.topHeader}>
                <h2 style={{ margin: 0 }}>Request Asset</h2>
                <div style={styles.buttonGroup}>
                    <button onClick={returnToDashboard} style={styles.dashboardBtn}>Return to Dashboard</button>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                </div>
            </div>

            <div style={styles.container}>
                <div style={styles.card}>
                    <h2 style={styles.title}>New Request</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Asset Type:</label>
                            <select style={styles.input} value={itemType} onChange={(e) => setItemType(e.target.value)}>
                                <option value="LAPTOP">Laptop</option>
                                <option value="MONITOR">Monitor</option>
                                <option value="KEYBOARD">Keyboard</option>
                            </select>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Requested Date:</label>
                            <input
                                type="date"
                                style={{ ...styles.input, borderColor: hasBooking ? "#cbd5e0" : "#e74c3c" }}
                                value={requestedDate}
                                onChange={(e) => setRequestedDate(e.target.value)}
                                min={new Date().toISOString().split("T")[0]}
                                required
                            />
                            {!hasBooking && requestedDate && (
                                <p style={{ color: "#e74c3c", fontSize: "12px", marginTop: "5px" }}>
                                    ⚠️ No seat booking found for this date.
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            style={{ ...styles.button, opacity: hasBooking ? 1 : 0.6, cursor: hasBooking ? "pointer" : "not-allowed" }}
                            disabled={!hasBooking}
                        >
                            Submit Request
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const styles = {
    mainWrapper: { padding: "20px", background: "#fdfdfd", minHeight: "100vh" },
    topHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", background: "white", padding: "10px 20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" },
    buttonGroup: { display: "flex", gap: "10px" },
    dashboardBtn: { padding: "10px 15px", background: "#1cc88a", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" },
    logoutBtn: { padding: "10px 15px", background: "#e74c3c", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" },
    container: { display: "flex", justifyContent: "center" },
    card: { width: "100%", maxWidth: "500px", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", background: "#fff" },
    title: { textAlign: "center", color: "#2c3e50", marginBottom: "25px" },
    formGroup: { marginBottom: "20px" },
    label: { display: "block", marginBottom: "8px", fontWeight: "bold", color: "#4a5568" },
    input: { width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #cbd5e0", boxSizing: "border-box" },
    button: { width: "100%", padding: "12px", background: "#4e73df", color: "white", border: "none", borderRadius: "6px", fontWeight: "bold", fontSize: "16px", marginTop: "10px" }
};

export default AssetRequest;