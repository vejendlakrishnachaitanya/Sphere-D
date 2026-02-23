package com.fareye.sphered.Service.Impl;

import com.fareye.sphered.Entity.Asset;
import com.fareye.sphered.Entity.Booking;
import com.fareye.sphered.Entity.User;
import com.fareye.sphered.Repository.AssetRepository;
import com.fareye.sphered.Repository.BookingRepository;
import com.fareye.sphered.Repository.UserRepository;
import com.fareye.sphered.Service.BookingService;
import com.fareye.sphered.exception.BadRequestException;
import com.fareye.sphered.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final AssetRepository assetRepository;
    private final UserRepository userRepository;

    public BookingServiceImpl(BookingRepository bookingRepository,
                              AssetRepository assetRepository,
                              UserRepository userRepository) {

        this.bookingRepository = bookingRepository;
        this.assetRepository = assetRepository;
        this.userRepository = userRepository;
    }
    @Override
    @Transactional // CRITICAL: To hold the PESSIMISTIC_WRITE lock
    public Booking createBooking(Long userId, Long assetId, String seatNo, LocalDate bookingDate) {
        // 1. Validate user existence
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // 2. Validate asset existence
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + assetId));

        // 3. RULE: Check if this user already has ANY booking for this specific date
        List<Booking> userBookings = bookingRepository.findByUserId(userId);
        boolean alreadyHasBooking = userBookings.stream()
                .anyMatch(b -> b.getBookingDate().equals(bookingDate));

        if (alreadyHasBooking) {
            throw new BadRequestException("Booking denied: You have already booked a seat for " + bookingDate);
        }

        // 4. PESSIMISTIC LOCK: Block other threads while checking seat availability for this date
        List<String> bookedSeats = bookingRepository.findBookedSeatsLocked(assetId, bookingDate);

        if (bookedSeats.contains(seatNo)) {
            throw new BadRequestException("Seat " + seatNo + " is already booked.");
        }

        // 5. Create and save the new booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setAsset(asset);
        booking.setSeatNo(seatNo);
        booking.setBookingDate(bookingDate);
        booking.setStatus("BOOKED");

        return bookingRepository.save(booking);
    }

    @Override
    public long getRemainingSeats(Long assetId,
                                  LocalDate bookingDate) {

        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Asset not found with id: " + assetId));

        long bookedCount =
                bookingRepository.countByAssetAndDate(assetId, bookingDate);

        return asset.getTotalItems() - bookedCount;
    }

    @Override
    public List<String> getAvailableSeats(Long assetId,
                                          LocalDate bookingDate) {

        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Asset not found with id: " + assetId));

        List<String> bookedSeats =
                bookingRepository.findBookedSeats(assetId, bookingDate);

        // Generate seat numbers from 1 to totalSeats
        return IntStream.rangeClosed(1, (int) asset.getTotalItems())
                .mapToObj(String::valueOf)
                .filter(seat -> !bookedSeats.contains(seat))
                .collect(Collectors.toList());
    }
    @Override
    public List<String> getBookedSeats(Long assetId, LocalDate bookingDate) {

        // validate asset exists
        assetRepository.findById(assetId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Asset not found with id: " + assetId));

        return bookingRepository.findBookedSeats(assetId, bookingDate);
    }

}
