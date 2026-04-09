package com.smartcampus.model;

import java.time.LocalDate;
import java.time.LocalTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    private String id;

    private String userId;
    
    private String userName;

    private String resourceId;

    private String resourceName;

    private String resourceType; // ROOM, LAB, EQUIPMENT

    private LocalDate bookingDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private BookingStatus status; // PENDING, APPROVED, REJECTED, CANCELLED

    private String notes;

    private Long createdAt;

    private Long updatedAt;

    private String adminNotes;

    public Booking(String userId, String userName, String resourceId, String resourceName, 
                   String resourceType, LocalDate bookingDate, LocalTime startTime, LocalTime endTime) {
        this.userId = userId;
        this.userName = userName;
        this.resourceId = resourceId;
        this.resourceName = resourceName;
        this.resourceType = resourceType;
        this.bookingDate = bookingDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = BookingStatus.PENDING;
        this.createdAt = System.currentTimeMillis();
        this.updatedAt = System.currentTimeMillis();
    }
}
