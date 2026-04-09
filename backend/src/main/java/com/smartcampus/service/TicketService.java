package com.smartcampus.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.smartcampus.model.Comment;
import com.smartcampus.model.Ticket;
import com.smartcampus.repository.TicketRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final NotificationService notificationService;

    public Ticket createTicket(Ticket ticket, String userEmail) {
        ticket.setReportedBy(userEmail);
        ticket.setStatus("OPEN");
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public List<Ticket> getMyTickets(String userEmail) {
        return ticketRepository.findByReportedBy(userEmail);
    }

    public Ticket getTicketById(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + id));
    }

    public Ticket updateStatus(String id, String status, String reason, String resolutionNotes) {
        Ticket ticket = getTicketById(id);
        String oldStatus = ticket.getStatus();
        ticket.setStatus(status);
        ticket.setUpdatedAt(LocalDateTime.now());
        if (reason != null && !reason.isBlank()) ticket.setRejectionReason(reason);
        if (resolutionNotes != null && !resolutionNotes.isBlank()) ticket.setResolutionNotes(resolutionNotes);
        Ticket saved = ticketRepository.save(ticket);
        notificationService.createNotification(
                ticket.getReportedBy(),
                "Your ticket '" + ticket.getTitle() + "' status changed from " + oldStatus + " to " + status,
                "TICKET_STATUS", id
        );
        return saved;
    }

    public Ticket assignTechnician(String id, String technicianEmail) {
        Ticket ticket = getTicketById(id);
        ticket.setAssignedTo(technicianEmail);
        ticket.setStatus("IN_PROGRESS");
        ticket.setUpdatedAt(LocalDateTime.now());
        Ticket saved = ticketRepository.save(ticket);
        notificationService.createNotification(
                ticket.getReportedBy(),
                "A technician has been assigned to your ticket: " + ticket.getTitle(),
                "TICKET_ASSIGNED", id
        );
        return saved;
    }

    public Ticket addComment(String ticketId, String content, String authorEmail) {
        Ticket ticket = getTicketById(ticketId);
        Comment comment = new Comment();
        comment.setId(UUID.randomUUID().toString());
        comment.setContent(content);
        comment.setAuthorEmail(authorEmail);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());
        ticket.getComments().add(comment);
        ticket.setUpdatedAt(LocalDateTime.now());
        Ticket saved = ticketRepository.save(ticket);
        if (!authorEmail.equals(ticket.getReportedBy())) {
            notificationService.createNotification(
                    ticket.getReportedBy(),
                    "New comment on your ticket: " + ticket.getTitle(),
                    "COMMENT_ADDED", ticketId
            );
        }
        return saved;
    }

    public Ticket editComment(String ticketId, String commentId, String newContent, String userEmail) {
        Ticket ticket = getTicketById(ticketId);
        ticket.getComments().stream()
                .filter(c -> c.getId().equals(commentId) && c.getAuthorEmail().equals(userEmail))
                .findFirst()
                .ifPresent(c -> {
                    c.setContent(newContent);
                    c.setUpdatedAt(LocalDateTime.now());
                });
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    public Ticket deleteComment(String ticketId, String commentId, String userEmail) {
        Ticket ticket = getTicketById(ticketId);
        ticket.getComments().removeIf(c ->
                c.getId().equals(commentId) && c.getAuthorEmail().equals(userEmail));
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    public void deleteTicket(String id) {
        ticketRepository.deleteById(id);
    }
}