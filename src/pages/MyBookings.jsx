import React, { useEffect, useState } from "react";
import API from "../api/api.jsx";

const MyBookings = () => {

    const [bookings, setBookings] = useState([]);

    useEffect(() => {

        API.get("/bookings/my")
            .then(res => setBookings(res.data));

    }, []);

    return (

        <div>

            <h2>My Bookings</h2>

            {bookings.map(b => (

                <div key={b.id}>

                    Seat: {b.seatNo} — Date: {b.bookingDate}

                </div>

            ))}

        </div>
    );
};

export default MyBookings;
