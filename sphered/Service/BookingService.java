package com.fareye.sphered.Service;

import com.fareye.sphered.Entity.Booking;

import java.time.LocalDate;
import java.util.List;

public interface BookingService {

    // Create a booking
    Booking createBooking(Long userId,
                          Long assetId,
                          String seatNo,
                          LocalDate bookingDate);

    // Get remaining seats
    long getRemainingSeats(Long assetId,
                           LocalDate bookingDate);

    // Get available seat numbers
    List<String> getAvailableSeats(Long assetId,
                                   LocalDate bookingDate);
    List<String> getBookedSeats(Long assetId, LocalDate bookingDate);

}
