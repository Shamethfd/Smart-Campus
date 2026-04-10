package com.smartcampus.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Document(collection = "tickets")
public class Ticket {

    @Id
    private String id;

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 10, message = "Description must be at least 10 characters")
    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Priority is required")
    private String priority;

    private String status = "OPEN";

    private String resourceId;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Reporter email is required")
    @Email(message = "Reporter email must be a valid email address")
    private String reportedBy;

    private String assignedTo;

    private String preferredContact;
    private String rejectionReason;
    private String resolutionNotes;

    @Size(max = 3, message = "Maximum 3 image attachments allowed")
    private List<String> imageUrls = new ArrayList<>();
    private List<Comment> comments = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
