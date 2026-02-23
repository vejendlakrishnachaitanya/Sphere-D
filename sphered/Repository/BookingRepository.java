package com.fareye.sphered.Repository;

import com.fareye.sphered.Entity.Booking;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.asset.id = :assetId AND b.bookingDate = :date")
    long countByAssetAndDate(@Param("assetId") Long assetId, @Param("date") LocalDate date);

    // This method now uses Pessimistic Locking to prevent concurrent reads of the same seats
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b.seatNo FROM Booking b WHERE b.asset.id = :assetId AND b.bookingDate = :date")
    List<String> findBookedSeatsLocked(@Param("assetId") Long assetId, @Param("date") LocalDate date);

    @Query("SELECT b.seatNo FROM Booking b WHERE b.asset.id = :assetId AND b.bookingDate = :date")
    List<String> findBookedSeats(@Param("assetId") Long assetId, @Param("date") LocalDate date);
}