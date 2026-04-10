package com.smartcampus.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.smartcampus.dto.BookingRequest;
import com.smartcampus.dto.BookingResponse;
import com.smartcampus.entity.Resource;
import com.smartcampus.entity.enums.DayOfWeek;
import com.smartcampus.entity.enums.ResourceStatus;
import com.smartcampus.exception.BookingException;
import com.smartcampus.model.Booking;
import com.smartcampus.model.BookingStatus;
import com.smartcampus.repository.BookingRepository;
import com.smartcampus.repository.ResourceRepository;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.enums.Role;
import com.smartcampus.enums.NotificationType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    /**
     * Create a new booking with conflict prevention
     */
    @Transactional
    public BookingResponse createBooking(BookingRequest request, String userId, String userName) {
        log.info("Creating booking for user {} on resource {}", userId, request.getResourceId());

        // Validate request
        validateBookingRequest(request);

        // Must be an admin-created resource (exists in SQL)
        Long resourcePk;
        try {
            resourcePk = Long.parseLong(request.getResourceId());
        } catch (Exception e) {
            throw new BookingException("Invalid resourceId. Please select a resource from the list.");
        }

        Resource resource = resourceRepository.findById(resourcePk)
            .orElseThrow(() -> new BookingException("Resource not found. Please select an available resource."));

        // Only WORKING resources can be booked
        if (resource.getStatus() != null && resource.getStatus() != ResourceStatus.WORKING) {
            throw new BookingException("This resource is not available for booking right now.");
        }

        // Validate date/day & time within resource availability
        DayOfWeek day = DayOfWeek.valueOf(request.getBookingDate().getDayOfWeek().name().substring(0, 3));
        if (resource.getAvailableDays() != null && !resource.getAvailableDays().isEmpty()
            && !resource.getAvailableDays().contains(day)) {
            throw new BookingException("This resource is not available on the selected day.");
        }

        if (resource.getAvailableFrom() != null && resource.getAvailableTo() != null) {
            if (request.getStartTime().isBefore(resource.getAvailableFrom())
                || request.getEndTime().isAfter(resource.getAvailableTo())) {
                throw new BookingException("Selected time is outside resource availability hours.");
            }
        }

        // Enforce advance booking limit (days)
        if (resource.getAdvanceBookingLimit() != null) {
            LocalDate maxDate = LocalDate.now().plusDays(resource.getAdvanceBookingLimit());
            if (request.getBookingDate().isAfter(maxDate)) {
                throw new BookingException("Selected date exceeds advance booking limit for this resource.");
            }
        }

        // Enforce minimum notice (hours) when booking is today
        if (resource.getMinimumNoticeHours() != null && request.getBookingDate().isEqual(LocalDate.now())) {
            LocalTime minStart = LocalTime.now().plusHours(resource.getMinimumNoticeHours());
            if (request.getStartTime().isBefore(minStart)) {
                throw new BookingException("Selected time does not meet the minimum notice period.");
            }
        }

        // Check for conflicts
        List<Booking> conflictingBookings = findConflictingBookings(
            request.getResourceId(),
            request.getBookingDate(),
            request.getStartTime(),
            request.getEndTime()
        );

        if (!conflictingBookings.isEmpty()) {
            log.warn("Booking conflict detected for resource {} on {}", 
                     request.getResourceId(), request.getBookingDate());
            throw new BookingException("Resource is already booked for the requested time slot");
        }

        // Create new booking
        Booking booking = new Booking(
            userId,
            userName,
            String.valueOf(resource.getId()),
            resource.getName(),
            resource.getType() != null ? resource.getType().name() : request.getResourceType(),
            request.getBookingDate(),
            request.getStartTime(),
            request.getEndTime()
        );
        booking.setNotes(request.getNotes());

        Booking savedBooking = bookingRepository.save(booking);
        log.info("Booking created successfully with ID: {}", savedBooking.getId());

        notifyAdmins(
            "New Booking Request",
            userName + " created a booking request for " + savedBooking.getResourceName(),
            NotificationType.BOOKING,
            savedBooking.getId()
        );

        return toResponse(savedBooking);
    }

    /**
     * Get all bookings for a user
     */
    public List<BookingResponse> getUserBookings(String userId) {
        log.info("Fetching bookings for user: {}", userId);
        return bookingRepository.findByUserId(userId)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    /**
     * Get all bookings (admin view)
     */
    public List<BookingResponse> getAllBookings() {
        log.info("Fetching all bookings");
        return bookingRepository.findAll()
            .stream()
            .map(this::toResponse)
            .toList();
    }

    /**
     * Get bookings by status
     */
    public List<BookingResponse> getBookingsByStatus(BookingStatus status) {
        log.info("Fetching bookings with status: {}", status);
        return bookingRepository.findByStatus(status)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    /**
     * Get a specific booking by ID
     */
    public BookingResponse getBookingById(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new BookingException("Booking not found with ID: " + bookingId));
        return toResponse(booking);
    }

    /**
     * Approve a booking (admin only)
     */
    @Transactional
    public BookingResponse approveBooking(String bookingId, String adminNotes) {
        log.info("Approving booking with ID: {}", bookingId);
        
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new BookingException("Booking not found with ID: " + bookingId));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BookingException("Only PENDING bookings can be approved");
        }

        booking.setStatus(BookingStatus.APPROVED);
        booking.setUpdatedAt(System.currentTimeMillis());
        booking.setAdminNotes(adminNotes);

        Booking updatedBooking = bookingRepository.save(booking);
        log.info("Booking {} approved successfully", bookingId);

        return toResponse(updatedBooking);
    }

    /**
     * Reject a booking (admin only)
     */
    @Transactional
    public BookingResponse rejectBooking(String bookingId, String adminNotes) {
        log.info("Rejecting booking with ID: {}", bookingId);
        
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new BookingException("Booking not found with ID: " + bookingId));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BookingException("Only PENDING bookings can be rejected");
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking.setUpdatedAt(System.currentTimeMillis());
        booking.setAdminNotes(adminNotes);

        Booking updatedBooking = bookingRepository.save(booking);
        log.info("Booking {} rejected successfully", bookingId);

        return toResponse(updatedBooking);
    }

    /**
     * Cancel a booking (user only - only APPROVED bookings)
     */
    @Transactional
    public BookingResponse cancelBooking(String bookingId) {
        log.info("Cancelling booking with ID: {}", bookingId);
        
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new BookingException("Booking not found with ID: " + bookingId));

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new BookingException("Only APPROVED bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(System.currentTimeMillis());

        Booking updatedBooking = bookingRepository.save(booking);
        log.info("Booking {} cancelled successfully", bookingId);

        return toResponse(updatedBooking);
    }

    /**
     * Get bookings for a resource on a specific date
     */
    public List<BookingResponse> getBookingsForResourceOnDate(String resourceId, LocalDate date) {
        log.info("Fetching bookings for resource {} on date {}", resourceId, date);
        return bookingRepository.findByResourceIdAndBookingDate(resourceId, date)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    /**
     * Get active (non-cancelled) bookings on a date (for availability UI)
     */
    public List<BookingResponse> getBookingsOnDate(LocalDate date) {
        return bookingRepository.findBookingsOnDate(date).stream().map(this::toResponse).toList();
    }

    /**
     * Check for time slot conflicts (internal method)
     */
    private List<Booking> findConflictingBookings(String resourceId, LocalDate date,
                                                   LocalTime startTime,
                                                   LocalTime endTime) {
        List<Booking> bookingsOnDate = bookingRepository.findBookingsForResourceOnDate(resourceId, date);

        return bookingsOnDate.stream()
            .filter(booking -> hasTimeConflict(booking, startTime, endTime))
            .toList();
    }

    /**
     * Check if two time ranges overlap
     */
    private boolean hasTimeConflict(Booking existing,
                                    LocalTime newStart,
                                    LocalTime newEnd) {
        // Overlap if newStart < existingEnd AND newEnd > existingStart
        return newStart.isBefore(existing.getEndTime()) && newEnd.isAfter(existing.getStartTime());
    }

    /**
     * Validate booking request
     */
    private void validateBookingRequest(BookingRequest request) {
        if (request.getResourceId() == null || request.getResourceId().isEmpty()) {
            throw new BookingException("Resource ID is required");
        }
        if (request.getBookingDate() == null) {
            throw new BookingException("Booking date is required");
        }
        if (request.getStartTime() == null || request.getEndTime() == null) {
            throw new BookingException("Start time and end time are required");
        }
        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new BookingException("Start time must be before end time");
        }
        if (request.getBookingDate().isBefore(LocalDate.now())) {
            throw new BookingException("Cannot book for past dates");
        }
    }

    /**
     * Convert Booking entity to BookingResponse DTO
     */
    private BookingResponse toResponse(Booking booking) {
        return new BookingResponse(
            booking.getId(),
            booking.getUserId(),
            booking.getUserName(),
            booking.getResourceId(),
            booking.getResourceName(),
            booking.getResourceType(),
            booking.getBookingDate(),
            booking.getStartTime(),
            booking.getEndTime(),
            booking.getStatus(),
            booking.getNotes(),
            booking.getCreatedAt(),
            booking.getUpdatedAt(),
            booking.getAdminNotes()
        );
    }

    private void notifyAdmins(String title, String message, NotificationType type, String relatedEntityId) {
        List<String> adminIds = userRepository.findByRole(com.smartcampus.enums.Role.ADMIN)
            .stream()
            .map(com.smartcampus.model.User::getId)
            .filter(id -> id != null && !id.isBlank())
            .toList();

        for (String adminId : adminIds) {
            notificationService.createNotification(adminId, title, message, type, relatedEntityId);
        }
    }
}
