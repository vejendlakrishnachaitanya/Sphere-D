package com.fareye.sphered.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(
        name = "bookings",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id", "booking_date"}),
                @UniqueConstraint(columnNames = {"seat_no", "booking_date"})
        }
)
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @Column(name = "seat_no", nullable = false)
    private String seatNo;

    @Column(name = "booking_date", nullable = false)
    private LocalDate bookingDate;

    private String status;
    private Integer availableSeats;

    public Booking() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Asset getAsset() { return asset; }
    public void setAsset(Asset asset) { this.asset = asset; }

    public String getSeatNo() { return seatNo; }
    public void setSeatNo(String seatNo) { this.seatNo = seatNo; }

    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getAvailableSeats() { return availableSeats; }
    public void setAvailableSeats(Integer availableSeats) { this.availableSeats = availableSeats; }
}
