package com.smartcampus.controller;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smartcampus.dto.BookingRequest;
import com.smartcampus.dto.BookingResponse;
import com.smartcampus.model.BookingStatus;
import com.smartcampus.service.BookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
@Slf4j
public class BookingController {

    private final BookingService bookingService;

    /**
     * Helpful index route (avoids "No static resource" for browser GET).
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> index() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("service", "smart-campus-api");
        response.put("basePath", "/api/v1/bookings");
        response.put("hint", "Use POST /api/v1/bookings to create a booking.");
        response.put("endpoints", List.of(
                "POST   /api/v1/bookings",
                "GET    /api/v1/bookings/my-bookings",
                "GET    /api/v1/bookings/{bookingId}",
                "GET    /api/v1/bookings/resource/{resourceId}/date?date=YYYY-MM-DD",
                "GET    /api/v1/bookings/admin/all",
                "GET    /api/v1/bookings/admin/status/{status}",
                "PUT    /api/v1/bookings/{bookingId}/approve?notes=...",
                "PUT    /api/v1/bookings/{bookingId}/reject?notes=...",
                "DELETE /api/v1/bookings/{bookingId}/cancel"
        ));
        return ResponseEntity.ok(response);
    }

    /**
     * Create a new booking
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createBooking(
            @RequestBody BookingRequest request,
            Authentication authentication) {
        
        String userId = authentication != null ? authentication.getName() : "demo-user";
        String userName = authentication != null ? String.valueOf(authentication.getPrincipal()) : "Demo User";

        log.info("Creating booking request for user: {}", userId);
        
        BookingResponse booking = bookingService.createBooking(request, userId, userName);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", "Booking created successfully");
        response.put("data", booking);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get user's own bookings
     */
    @GetMapping("/my-bookings")
    public ResponseEntity<Map<String, Object>> getUserBookings(
            Authentication authentication) {
        
        String userId = authentication != null ? authentication.getName() : "demo-user";
        log.info("Fetching bookings for user: {}", userId);

        List<BookingResponse> bookings = bookingService.getUserBookings(userId);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("count", bookings.size());
        response.put("data", bookings);

        return ResponseEntity.ok(response);
    }

    /**
     * Get a specific booking by ID
     */
    @GetMapping("/{bookingId}")
    public ResponseEntity<Map<String, Object>> getBookingById(
            @PathVariable String bookingId) {
        
        log.info("Fetching booking with ID: {}", bookingId);

        BookingResponse booking = bookingService.getBookingById(bookingId);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("data", booking);

        return ResponseEntity.ok(response);
    }

    /**
     * Get all bookings for a resource on a specific date
     */
    @GetMapping("/resource/{resourceId}/date")
    public ResponseEntity<Map<String, Object>> getResourceBookingsByDate(
            @PathVariable String resourceId,
            @RequestParam LocalDate date) {
        
        log.info("Fetching bookings for resource {} on date {}", resourceId, date);

        List<BookingResponse> bookings = bookingService.getBookingsForResourceOnDate(resourceId, date);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("count", bookings.size());
        response.put("data", bookings);

        return ResponseEntity.ok(response);
    }

    /**
     * Get active bookings for a specific date (used for availability UI)
     */
    @GetMapping("/date")
    public ResponseEntity<Map<String, Object>> getBookingsOnDate(@RequestParam LocalDate date) {
        List<BookingResponse> bookings = bookingService.getBookingsOnDate(date);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("count", bookings.size());
        response.put("data", bookings);
        return ResponseEntity.ok(response);
    }

    /**
     * Admin: Get all bookings
     */
    @GetMapping("/admin/all")
    public ResponseEntity<Map<String, Object>> getAllBookings() {
        log.info("Admin fetching all bookings");

        List<BookingResponse> bookings = bookingService.getAllBookings();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("count", bookings.size());
        response.put("data", bookings);

        return ResponseEntity.ok(response);
    }

    /**
     * Admin: Get bookings by status
     */
    @GetMapping("/admin/status/{status}")
    public ResponseEntity<Map<String, Object>> getBookingsByStatus(
            @PathVariable BookingStatus status) {
        
        log.info("Admin fetching bookings with status: {}", status);

        List<BookingResponse> bookings = bookingService.getBookingsByStatus(status);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("count", bookings.size());
        response.put("data", bookings);

        return ResponseEntity.ok(response);
    }

    /**
     * Admin: Approve a booking
     */
    @PutMapping("/{bookingId}/approve")
    public ResponseEntity<Map<String, Object>> approveBooking(
            @PathVariable String bookingId,
            @RequestParam(required = false) String notes) {
        
        log.info("Admin approving booking: {}", bookingId);

        BookingResponse booking = bookingService.approveBooking(bookingId, notes);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", "Booking approved successfully");
        response.put("data", booking);

        return ResponseEntity.ok(response);
    }

    /**
     * Admin: Reject a booking
     */
    @PutMapping("/{bookingId}/reject")
    public ResponseEntity<Map<String, Object>> rejectBooking(
            @PathVariable String bookingId,
            @RequestParam(required = false) String notes) {
        
        log.info("Admin rejecting booking: {}", bookingId);

        BookingResponse booking = bookingService.rejectBooking(bookingId, notes);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", "Booking rejected successfully");
        response.put("data", booking);

        return ResponseEntity.ok(response);
    }

    /**
     * User: Cancel an approved booking
     */
    @DeleteMapping("/{bookingId}/cancel")
    public ResponseEntity<Map<String, Object>> cancelBooking(
            @PathVariable String bookingId,
            Authentication authentication) {
        
        String userId = authentication != null ? authentication.getName() : "demo-user";
        log.info("User {} cancelling booking: {}", userId, bookingId);

        BookingResponse booking = bookingService.cancelBooking(bookingId);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", "Booking cancelled successfully");
        response.put("data", booking);

        return ResponseEntity.ok(response);
    }
}
