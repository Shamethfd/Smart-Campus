package com.smartcampus.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smartcampus.model.Ticket;
import com.smartcampus.service.TicketService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TicketController {

    private final TicketService ticketService;

    // POST /api/tickets
    @PostMapping
    public ResponseEntity<Ticket> createTicket(@RequestBody Ticket ticket) {
        String email = ticket.getReportedBy() != null ? ticket.getReportedBy() : "anonymous";
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ticketService.createTicket(ticket, email));
    }

    // GET /api/tickets
    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    // GET /api/tickets/my?email=xxx
    @GetMapping("/my")
    public ResponseEntity<List<Ticket>> getMyTickets(@RequestParam String email) {
        return ResponseEntity.ok(ticketService.getMyTickets(email));
    }

    // GET /api/tickets/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicket(@PathVariable String id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    // PUT /api/tickets/{id}/status
    @PutMapping("/{id}/status")
    public ResponseEntity<Ticket> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ticketService.updateStatus(
                id,
                body.get("status"),
                body.get("reason"),
                body.get("resolutionNotes")
        ));
    }

    // PUT /api/tickets/{id}/assign
    @PutMapping("/{id}/assign")
    public ResponseEntity<Ticket> assignTechnician(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(
                ticketService.assignTechnician(id, body.get("technicianEmail")));
    }

    // POST /api/tickets/{id}/comments
    @PostMapping("/{id}/comments")
    public ResponseEntity<Ticket> addComment(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        String email = body.getOrDefault("authorEmail", "anonymous");
        return ResponseEntity.ok(ticketService.addComment(id, body.get("content"), email));
    }

    // PUT /api/tickets/{ticketId}/comments/{commentId}
    @PutMapping("/{ticketId}/comments/{commentId}")
    public ResponseEntity<Ticket> editComment(
            @PathVariable String ticketId,
            @PathVariable String commentId,
            @RequestBody Map<String, String> body) {
        String email = body.getOrDefault("authorEmail", "anonymous");
        return ResponseEntity.ok(
                ticketService.editComment(ticketId, commentId, body.get("content"), email));
    }

    // DELETE /api/tickets/{ticketId}/comments/{commentId}
    @DeleteMapping("/{ticketId}/comments/{commentId}")
    public ResponseEntity<Ticket> deleteComment(
            @PathVariable String ticketId,
            @PathVariable String commentId,
            @RequestParam(required = false, defaultValue = "anonymous") String email) {
        return ResponseEntity.ok(ticketService.deleteComment(ticketId, commentId, email));
    }

    // DELETE /api/tickets/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable String id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }
}