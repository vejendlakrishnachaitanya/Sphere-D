package com.fareye.sphered.Controller;

import com.fareye.sphered.Entity.Booking;
import com.fareye.sphered.Repository.BookingRepository;
import com.fareye.sphered.Service.BookingService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin("*")
public class BookingController {

    private final BookingService bookingService;
    private final BookingRepository bookingRepository;

    public BookingController(BookingService bookingService, BookingRepository bookingRepository) {
        this.bookingService = bookingService;
        this.bookingRepository = bookingRepository;
    }

    // REQUIRED: Endpoint for the User Dashboard
    @GetMapping("/user/{userId}")
    public List<Booking> getUserBookings(@PathVariable Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    @PostMapping
    public Booking createBooking(
            @RequestParam Long userId,
            @RequestParam Long assetId,
            @RequestParam String seatNo,
            @RequestParam String date) {
        return bookingService.createBooking(userId, assetId, seatNo, LocalDate.parse(date));
    }

    @GetMapping("/available")
    public List<String> getAvailableSeats(
            @RequestParam Long assetId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return bookingService.getAvailableSeats(assetId, date);
    }

    @GetMapping("/booked")
    public List<String> getBookedSeats(
            @RequestParam Long assetId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return bookingService.getBookedSeats(assetId, date);
    }
}