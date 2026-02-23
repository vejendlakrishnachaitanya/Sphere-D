import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const role = localStorage.getItem("role");

    // Do not show Navbar on Login or Signup pages
    if (location.pathname === "/" || location.pathname === "/signup") {
        return null;
    }

    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    const navStyle = {
        padding: "12px 30px",
        background: "#2c3e50",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
    };

    const linkStyle = { color: "white", textDecoration: "none", fontWeight: "500" };

    return (
        <nav style={navStyle}>
            <h2 style={{ margin: 0, letterSpacing: "1px" }}>Sphere-D</h2>
            <div style={{ display: "flex", gap: "25px", alignItems: "center" }}>

                {/* Admin Links */}
                {role === "ADMIN" && (
                    <>
                        <Link to="/admin" style={linkStyle}>Admin Panel</Link>
                        <Link to="/admin/users/view" style={linkStyle}>Staff</Link>
                        <Link to="/admin/bookings/map" style={linkStyle}>Live Map</Link>
                    </>
                )}

                {/* IT Staff Links */}
                {role === "IT_STAFF" && (
                    <>
                        <Link to="/it-staff" style={linkStyle}>Approval Queue</Link>
                        <Link to="/it-staff/history" style={linkStyle}>Assignment History</Link>
                        <Link to="/admin/assets/view" style={linkStyle}>Inventory</Link>
                    </>
                )}

                {/* Employee Links */}
                {role === "EMPLOYEE" && (
                    <>
                        <Link to="/user" style={linkStyle}>My Dashboard</Link>
                        <Link to="/book-seat" style={linkStyle}>Book Seat</Link>
                    </>
                )}

                <button
                    onClick={logout}
                    style={{
                        background: "#e74c3c",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        padding: "7px 15px",
                        borderRadius: "5px",
                        fontWeight: "bold"
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;