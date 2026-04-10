package com.smartcampus.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
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
import org.springframework.web.multipart.MultipartFile;

import com.smartcampus.model.Ticket;
import com.smartcampus.service.TicketService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Validated
public class TicketController {

    private final TicketService ticketService;

    // POST /api/tickets — returns 201 Created
    @PostMapping
    public ResponseEntity<Ticket> createTicket(@Valid @RequestBody Ticket ticket) {
        String email = ticket.getReportedBy() != null ? ticket.getReportedBy() : "anonymous";
        return ResponseEntity.status(HttpStatus.CREATED)
                .cacheControl(CacheControl.noStore())
                .body(ticketService.createTicket(ticket, email));
    }

    // GET /api/tickets — Cache-Control: no-store (stateless / fresh data)
    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(ticketService.getAllTickets());
    }

    // GET /api/tickets/my?email=xxx
    @GetMapping("/my")
    public ResponseEntity<List<Ticket>> getMyTickets(@RequestParam String email) {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(ticketService.getMyTickets(email));
    }

    // GET /api/tickets/{id} — returns 404 when not found (handled via TicketNotFoundException)
    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicket(@PathVariable String id) {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(ticketService.getTicketById(id));
    }

    // PUT /api/tickets/{id}/status
    @PutMapping("/{id}/status")
    public ResponseEntity<Ticket> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(ticketService.updateStatus(
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
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(ticketService.assignTechnician(id, body.get("technicianEmail")));
    }

    // POST /api/tickets/{id}/images — upload up to 3 images (multipart)
    @PostMapping("/{id}/images")
    public ResponseEntity<Ticket> uploadImages(
            @PathVariable String id,
            @RequestParam("files") List<MultipartFile> files) throws IOException {

        if (files.size() > 3) {
            return ResponseEntity.badRequest().build();
        }

        // Validate each file is an image
        for (MultipartFile file : files) {
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().build();
            }
        }

        // Save files to uploads directory
        Path uploadDir = Paths.get("uploads");
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        List<String> urls = new java.util.ArrayList<>();
        for (MultipartFile file : files) {
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path dest = uploadDir.resolve(filename);
            Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);
            urls.add("/uploads/" + filename);
        }

        Ticket updated = ticketService.addImageUrls(id, urls);
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(updated);
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

    // DELETE /api/tickets/{ticketId}/comments/{commentId} — returns 204 No Content
    @DeleteMapping("/{ticketId}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable String ticketId,
            @PathVariable String commentId,
            @RequestParam(required = false, defaultValue = "anonymous") String email) {
        ticketService.deleteComment(ticketId, commentId, email);
        return ResponseEntity.noContent().build();
    }

    // DELETE /api/tickets/{id} — returns 204 No Content
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable String id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }
}
