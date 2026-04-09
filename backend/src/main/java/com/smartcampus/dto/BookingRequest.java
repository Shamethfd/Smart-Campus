package com.smartcampus.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {

    private String resourceId;

    private String resourceName;

    private String resourceType;

    private LocalDate bookingDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private String notes;
}
