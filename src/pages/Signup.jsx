import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {

    const navigate = useNavigate();

    const [data, setData] = useState({
        name: "",
        username: "",
        password: "",
        department: "",
        role: "EMPLOYEE"
    });

    const [error, setError] = useState("");

    const signup = async (e) => {

        e.preventDefault();

        setError("");

        try {

            const response = await fetch("http://localhost:8080/api/auth/signup", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    name: data.name,

                    username: data.username,

                    password: data.password,

                    department: data.department,

                    role: data.role,

                    type: "INTERNAL"

                })

            });

            if (!response.ok) {

                const err = await response.json();

                throw new Error(err.error || "Signup failed");

            }

            alert("Signup successful");

            navigate("/");

        } catch (err) {

            setError(err.message);

        }

    };

    return (

        <div style={styles.container}>

            <form style={styles.card} onSubmit={signup}>

                <h2 style={styles.title}>Sphere-D</h2>

                <p style={styles.subtitle}>Create your account</p>

                <input
                    type="text"
                    placeholder="Full Name"
                    required
                    style={styles.input}
                    onChange={(e) =>
                        setData({ ...data, name: e.target.value })
                    }
                />

                <input
                    type="text"
                    placeholder="Username"
                    required
                    style={styles.input}
                    onChange={(e) =>
                        setData({ ...data, username: e.target.value })
                    }
                />

                <input
                    type="password"
                    placeholder="Password"
                    required
                    style={styles.input}
                    onChange={(e) =>
                        setData({ ...data, password: e.target.value })
                    }
                />

                <input
                    type="text"
                    placeholder="Department"
                    required
                    style={styles.input}
                    onChange={(e) =>
                        setData({ ...data, department: e.target.value })
                    }
                />

                <select
                    style={styles.input}
                    value={data.role}
                    onChange={(e) =>
                        setData({ ...data, role: e.target.value })
                    }
                >

                    <option value="EMPLOYEE">Employee</option>

                    {/*<option value="ADMIN">Admin</option>*/}

                    <option value="IT_STAFF">IT Staff</option>

                </select>

                {error && (
                    <p style={styles.error}>{error}</p>
                )}

                <button type="submit" style={styles.button}>
                    Signup
                </button>

                <p style={styles.linkText}>
                    Already have account?{" "}
                    <Link to="/">Login</Link>
                </p>

            </form>

        </div>

    );

}

const styles = {

    container: {

        height: "100vh",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        background:
            "linear-gradient(135deg, #667eea, #764ba2)"

    },

    card: {

        background: "white",

        padding: "40px",

        borderRadius: "10px",

        width: "350px",

        boxShadow:
            "0 10px 25px rgba(0,0,0,0.2)",

        textAlign: "center"

    },

    title: {

        marginBottom: "5px"

    },

    subtitle: {

        marginBottom: "20px",

        color: "gray"

    },

    input: {

        width: "100%",

        padding: "10px",

        marginBottom: "15px",

        borderRadius: "5px",

        border: "1px solid #ccc",

        fontSize: "14px"

    },

    button: {

        width: "100%",

        padding: "10px",

        background:
            "linear-gradient(135deg, #667eea, #764ba2)",

        color: "white",

        border: "none",

        borderRadius: "5px",

        fontSize: "16px",

        cursor: "pointer"

    },

    linkText: {

        marginTop: "15px"

    },

    error: {

        color: "red",

        marginBottom: "10px"

    }

};

export default Signup;
