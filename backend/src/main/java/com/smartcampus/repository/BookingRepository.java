package com.smartcampus.repository;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import com.smartcampus.model.Booking;
import com.smartcampus.model.BookingStatus;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    // Find all bookings for a user
    List<Booking> findByUserId(String userId);

    // Find all bookings for a resource on a specific date
    List<Booking> findByResourceIdAndBookingDate(String resourceId, LocalDate bookingDate);

    // Find all pending bookings
    List<Booking> findByStatus(BookingStatus status);

    // Find all bookings for a resource (excluding cancelled)
    @Query("{ 'resourceId': ?0, 'status': { $ne: 'CANCELLED' } }")
    List<Booking> findActiveBookingsByResourceId(String resourceId);

    // Find all bookings for resource on date (excluding cancelled) - for conflict detection
    @Query("{ 'resourceId': ?0, 'bookingDate': ?1, 'status': { $ne: 'CANCELLED' } }")
    List<Booking> findBookingsForResourceOnDate(String resourceId, LocalDate bookingDate);

    // Find all bookings within a date range
    List<Booking> findByBookingDateBetween(LocalDate startDate, LocalDate endDate);
}
