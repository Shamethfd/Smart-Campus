package com.smartcampus.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "tickets")
public class Ticket {

    @Id
    private String id;

    private String title;
    private String description;
    private String category;
    private String priority;
    private String status = "OPEN";

    private String resourceId;
    private String location;

    private String reportedBy;
    private String assignedTo;

    private String preferredContact;
    private String rejectionReason;
    private String resolutionNotes;

    private List<String> imageUrls = new ArrayList<>();
    private List<Comment> comments = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}