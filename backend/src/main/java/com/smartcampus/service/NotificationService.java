package com.smartcampus.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.smartcampus.model.Notification;
import com.smartcampus.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public void createNotification(String userEmail, String message, String type, String ticketId) {
        Notification notification = new Notification();
        notification.setUserEmail(userEmail);
        notification.setMessage(message);
        notification.setType(type);
        notification.setTicketId(ticketId);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }

    public List<Notification> getMyNotifications(String userEmail) {
        return notificationRepository.findByUserEmailOrderByCreatedAtDesc(userEmail);
    }

    public long getUnreadCount(String userEmail) {
        return notificationRepository.countByUserEmailAndRead(userEmail, false);
    }

    public Notification markAsRead(String id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found: " + id));
        n.setRead(true);
        return notificationRepository.save(n);
    }

    public void markAllAsRead(String userEmail) {
        List<Notification> unread = notificationRepository.findByUserEmailAndRead(userEmail, false);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }
}