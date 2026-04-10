package com.smartcampus.model;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class Comment {
    private String id;
    private String content;
    private String authorEmail;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}