import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api.jsx";

const UserBookSeat = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState("");
    const [availableSeats, setAvailableSeats] = useState([]);
    const [seatAssets, setSeatAssets] = useState([]);
    const [loading, setLoading] = useState(false);

    // Retrieve userId from localStorage (stored during login)
    const userId = localStorage.getItem("userId");

    // 1. Fetch all assets categorized as "SEAT" on component mount
    useEffect(() => {
        API.get("/assets").then(res => {
            const seats = res.data.filter(a => a.assetType === "SEAT");
            setSeatAssets(seats);
        });
    }, []);

    // 2. Automatically fetch availability when the date is picked
    useEffect(() => {
        if (selectedDate && seatAssets.length > 0) {
            fetchGlobalAvailability();
        }
    }, [selectedDate, seatAssets]);

    const fetchGlobalAvailability = async () => {
        setLoading(true);
        try {
            const allAvailable = [];
            // Check available seats for every "SEAT" area for the chosen date
            for (const asset of seatAssets) {
                const res = await API.get(`/bookings/available?assetId=${asset.id}&date=${selectedDate}`);
                const seatsWithDetails = res.data.map(seatNo => ({
                    seatNo,
                    assetId: asset.id,
                    areaName: asset.serialNumber // Using serialNumber as the display name
                }));
                allAvailable.push(...seatsWithDetails);
            }
            setAvailableSeats(allAvailable);
        } catch (err) {
            console.error("Error fetching seat availability", err);
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async (seat) => {
        try {
            // Sends parameters to BookingController.createBooking
            await API.post(`/bookings?userId=${userId}&assetId=${seat.assetId}&seatNo=${seat.seatNo}&date=${selectedDate}`);
            alert(`Success! Seat ${seat.seatNo} reserved for ${selectedDate}.`);
            fetchGlobalAvailability(); // Refresh list
        } catch (err) {
            alert(err.response?.data?.error || "Booking failed");
        }
    };

    return (
        <div style={styles.container}>
            {/* Standardized Back Button */}
            <div style={styles.topBar}>
                <button style={styles.backBtn} onClick={() => navigate("/user")}>
                    ← Back
                </button>
            </div>

            <header style={styles.header}>
                <h2 style={styles.title}>Workspace Booking</h2>
                <p style={styles.subtitle}>Select a date to see available seats across all office areas.</p>
            </header>

            <div style={styles.datePickerContainer}>
                <label style={styles.label}>Select Date: </label>
                <input
                    type="date"
                    style={styles.dateInput}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]} // Prevent past bookings
                />
            </div>

            {loading ? <p style={styles.loadingText}>Searching for free seats...</p> : (
                <div style={styles.grid}>
                    {availableSeats.length > 0 ? availableSeats.map((seat) => (
                        <div
                            key={`${seat.assetId}-${seat.seatNo}`}
                            style={styles.seatCard}
                            onClick={() => handleBooking(seat)}
                        >
                            <span style={styles.areaTag}>{seat.areaName}</span>
                            <span style={styles.seatLabel}>Seat {seat.seatNo}</span>
                            <div style={styles.statusText}>Available</div>
                        </div>
                    )) : selectedDate && <p style={styles.emptyText}>No seats available for the selected date.</p>}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { padding: "40px", maxWidth: "1200px", margin: "0 auto", fontFamily: "'Inter', sans-serif" },
    topBar: {
        width: "100%",
        display: "flex",
        justifyContent: "flex-start",
        marginBottom: "20px"
    },
    backBtn: {
        padding: "10px 15px",
        cursor: "pointer",
        background: "#4e73df", // Theme primary blue
        color: "white",
        border: "none",
        borderRadius: "5px",
        fontWeight: "bold"
    },
    header: { marginBottom: "30px", borderBottom: "1px solid #eee", paddingBottom: "10px" },
    title: { margin: 0, color: "#2c3e50" },
    subtitle: { color: "#7f8c8d", marginTop: "5px" },
    datePickerContainer: { marginBottom: "30px", background: "#f8f9fc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" },
    label: { fontWeight: "bold", color: "#4a5568" },
    dateInput: { padding: "10px", borderRadius: "6px", border: "1px solid #ddd", marginLeft: "10px", outline: "none" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "20px" },
    seatCard: {
        padding: "20px", background: "#d4edda", border: "1px solid #c3e6cb",
        borderRadius: "12px", textAlign: "center", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
    },
    areaTag: { display: "block", fontSize: "10px", color: "#155724", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px" },
    seatLabel: { display: "block", fontSize: "18px", fontWeight: "bold", color: "#155724", marginTop: "5px" },
    statusText: { marginTop: "10px", fontSize: "12px", color: "#155724", fontStyle: "italic" },
    loadingText: { textAlign: "center", color: "#4e73df", fontWeight: "bold" },
    emptyText: { textAlign: "center", color: "#e74c3c", padding: "20px" }
};

export default UserBookSeat;