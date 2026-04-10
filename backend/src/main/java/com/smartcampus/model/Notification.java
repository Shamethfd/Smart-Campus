package com.smartcampus.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    private String userEmail;
    private String message;
    private String type;
    private String ticketId;
    private boolean read = false;
    private LocalDateTime createdAt = LocalDateTime.now();
}