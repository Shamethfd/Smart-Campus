package com.smartcampus.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smartcampus.model.Notification;
import com.smartcampus.service.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private final NotificationService notificationService;

    // GET /api/notifications?email=xxx
    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications(
            @RequestParam(required = false, defaultValue = "anonymous") String email) {
        return ResponseEntity.ok(notificationService.getMyNotifications(email));
    }

    // GET /api/notifications/unread-count?email=xxx
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @RequestParam(required = false, defaultValue = "anonymous") String email) {
        return ResponseEntity.ok(Map.of("count", notificationService.getUnreadCount(email)));
    }

    // PUT /api/notifications/{id}/read
    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable String id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    // PUT /api/notifications/read-all?email=xxx
    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(
            @RequestParam(required = false, defaultValue = "anonymous") String email) {
        notificationService.markAllAsRead(email);
        return ResponseEntity.ok().build();
    }
}