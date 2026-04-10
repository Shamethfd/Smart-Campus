package com.smartcampus.entity;

import com.smartcampus.entity.enums.*;
import com.smartcampus.entity.converter.AccessibilityFeatureConverter;
import com.smartcampus.entity.converter.DayOfWeekConverter;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.persistence.PrePersist;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "resources")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Building building;

    @Column(nullable = false)
    private Integer floor;

    @Column(name = "room_number")
    private String roomNumber;

    @Column(nullable = false)
    private Integer capacity;

    @Column(name = "area_sq_ft")
    private Integer areaSqFt;

    @Column(name = "has_ac")
    private Boolean hasAC = false;

    @Column(name = "has_projector")
    private Boolean hasProjector = false;

    @Column(name = "has_whiteboard")
    private Boolean hasWhiteboard = false;

    @Column(name = "has_wifi")
    private Boolean hasWiFi = false;

    @Column(name = "accessibility_features")
    @Convert(converter = AccessibilityFeatureConverter.class)
    private List<AccessibilityFeature> accessibilityFeatures;

    @Column(name = "available_from", nullable = false)
    @JsonFormat(pattern = "HH:mm")
    private LocalTime availableFrom;

    @Column(name = "available_to", nullable = false)
    @JsonFormat(pattern = "HH:mm")
    private LocalTime availableTo;

    @Column(name = "available_days")
    @Convert(converter = DayOfWeekConverter.class)
    private List<DayOfWeek> availableDays;

    @Column(name = "advance_booking_limit")
    private Integer advanceBookingLimit = 30;

    @Column(name = "minimum_notice_hours")
    private Integer minimumNoticeHours = 2;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceStatus status = ResourceStatus.WORKING;

    @Column(name = "maintenance_end_date")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate maintenanceEndDate;

    @Column(name = "qr_code", unique = true)
    private String qrCode;

    @Column(name = "image_urls")
    @Convert(converter = com.smartcampus.entity.converter.StringListJsonConverter.class)
    private List<String> imageUrls;

    @Column(name = "virtual_tour_url")
    private String virtualTourUrl;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", updatable = false)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    @PrePersist
    private void generateQRCode() {
        if (qrCode == null || qrCode.isEmpty()) {
            qrCode = generateUniqueQRCode();
        }
    }

    private String generateUniqueQRCode() {
        String data = id + "|" + name + "|" + System.currentTimeMillis();
        return java.util.Base64.getEncoder().encodeToString(data.getBytes());
    }
}
