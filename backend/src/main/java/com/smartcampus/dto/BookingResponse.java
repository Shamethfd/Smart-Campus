package com.smartcampus.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import com.smartcampus.model.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private String id;

    private String userId;
    
    private String userName;

    private String resourceId;

    private String resourceName;

    private String resourceType;

    private LocalDate bookingDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private BookingStatus status;

    private String notes;

    private Long createdAt;

    private Long updatedAt;

    private String adminNotes;
}
