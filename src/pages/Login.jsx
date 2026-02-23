import React, { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const login = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/auth/login", form);

            // Store data exactly as it appeared in your Postman result
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role);
            localStorage.setItem("userId", res.data.userId);

            const userRole = res.data.role;

            if (userRole === "ADMIN") {
                navigate("/admin");
            } else if (userRole === "IT_STAFF") {
                // This ensures IT Staff goes to their specific dashboard
                navigate("/it-staff");
            } else {
                // Default for EMPLOYEE / USER
                navigate("/user");
            }
        } catch (err) {
            setError("Invalid username or password");
        }
    };

    return (

        <div className="login-container">

            <div className="login-card">

                <h1 className="login-title">Sphere-D</h1>

                <p className="login-subtitle">
                    Asset & Seat Booking System
                </p>

                <form onSubmit={login}>

                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    {error && (
                        <p className="error">{error}</p>
                    )}

                    <button type="submit">
                        Login
                    </button>

                </form>

                {/*<p className="signup-text">

                    Don't have account?

                    <Link to="/signup"> Signup</Link>

                </p>*/}

            </div>

        </div>
    );
}

export default Login;
