import React, { useState } from "react";
import API from "../api/api.jsx";

const BookSeat = () => {

    const [seat, setSeat] = useState("");

    const book = async () => {

        await API.post("/bookings", {

            seatNo: seat,

            bookingDate: "2026-02-20"
        });

        alert("Booked");
    };

    return (

        <div>

            <h2>Book Seat</h2>

            <input
                placeholder="Seat Number"
                onChange={(e) => setSeat(e.target.value)}
            />

            <button onClick={book}>
                Book
            </button>

        </div>
    );
};

export default BookSeat;
