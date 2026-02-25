import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api.jsx";

const AdminBookingMap = () => {
    const navigate = useNavigate();
    const [assets, setAssets] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [bookedSeats, setBookedSeats] = useState([]);
    const [totalSeats, setTotalSeats] = useState(0);

    // Get user role for redirection
    const role = localStorage.getItem("role");

    useEffect(() => {
        // Fetch only SEAT type assets
        API.get("/assets").then(res => {
            const seatAssets = res.data.filter(a => a.assetType === "SEAT");
            setAssets(seatAssets);
        });
    }, []);

    useEffect(() => {
        if (selectedAsset && selectedDate) {
            // Find total capacity for this asset
            const asset = assets.find(a => a.id == selectedAsset);
            setTotalSeats(asset ? asset.totalItems : 0);

            // Fetch booked seats for this specific date
            API.get(`/bookings/booked?assetId=${selectedAsset}&date=${selectedDate}`)
                .then(res => setBookedSeats(res.data));
        }
    }, [selectedAsset, selectedDate, assets]);

    // Handle logout
    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    // Handle return to dashboard based on role
    const returnToDashboard = () => {
        if (role === "ADMIN") navigate("/admin");
        else if (role === "IT_STAFF") navigate("/it-staff");
        else navigate("/user");
    };

    const renderGrid = () => {
        let grid = [];
        for (let i = 1; i <= totalSeats; i++) {
            const isBooked = bookedSeats.includes(i.toString());
            grid.push(
                <div key={i} style={{
                    ...styles.seat,
                    backgroundColor: isBooked ? "#f8d7da" : "#d4edda",
                    color: isBooked ? "#721c24" : "#155724",
                    border: `1px solid ${isBooked ? "#f5c6cb" : "#c3e6cb"}`
                }}>
                    {i}
                    <div style={{fontSize: '9px'}}>{isBooked ? "Booked" : "Free"}</div>
                </div>
            );
        }
        return grid;
    };

    return (
        <div style={styles.container}>
            {/* Added Header with Navigation Buttons */}
            <div style={styles.topHeader}>
                <h2>Live Seat Availability Map</h2>
                <div style={styles.buttonGroup}>
                    <button onClick={returnToDashboard} style={styles.dashboardBtn}>
                        Dashboard
                    </button>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        Logout
                    </button>
                </div>
            </div>

            <div style={styles.controls}>
                <select onChange={(e) => setSelectedAsset(e.target.value)} style={styles.input}>
                    <option value="">Select Area/Floor</option>
                    {assets.map(a => <option key={a.id} value={a.id}>{a.serialNumber}</option>)}
                </select>
                <input type="date" onChange={(e) => setSelectedDate(e.target.value)} style={styles.input} />
            </div>

            <div style={styles.legend}>
                <div style={{display:'flex', alignItems:'center', gap:'5px'}}>
                    <div style={{...styles.box, background:'#d4edda'}}></div> Available
                </div>
                <div style={{display:'flex', alignItems:'center', gap:'5px'}}>
                    <div style={{...styles.box, background:'#f8d7da'}}></div> Occupied
                </div>
            </div>

            <div style={styles.grid}>
                {selectedAsset && selectedDate ? renderGrid() : <p>Select an area and date to view the map.</p>}
            </div>
        </div>
    );
};

const styles = {
    container: { padding: "40px", maxWidth: "1200px", margin: "0 auto", fontFamily: "Arial" },
    topHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", borderBottom: "2px solid #f1f5f9", paddingBottom: "15px" },
    buttonGroup: { display: "flex", gap: "10px" },
    dashboardBtn: { padding: "8px 16px", background: "#4e73df", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
    logoutBtn: { padding: "8px 16px", background: "#e74c3c", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
    controls: { display: "flex", gap: "20px", marginBottom: "30px" },
    input: { padding: "10px", borderRadius: "5px", border: "1px solid #ddd", flex: 1 },
    legend: { display: "flex", gap: "20px", marginBottom: "20px", fontSize: "14px" },
    box: { width: "15px", height: "15px", borderRadius: "3px" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: "10px" },
    seat: {
        padding: "15px 5px", textAlign: "center", borderRadius: "8px",
        fontSize: "14px", fontWeight: "bold", display: "flex", flexDirection: "column", gap: "4px"
    }
};

export default AdminBookingMap;