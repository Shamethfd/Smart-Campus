package com.smartcampus.controller;

import com.smartcampus.entity.Resource;
import com.smartcampus.entity.enums.Building;
import com.smartcampus.entity.enums.ResourceStatus;
import com.smartcampus.entity.enums.ResourceType;
import com.smartcampus.service.ResourceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class ResourceController {

    private final ResourceService resourceService;

    @GetMapping
    public ResponseEntity<Page<Resource>> getAllResources(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Building building,
            @RequestParam(required = false) ResourceType type,
            @RequestParam(required = false) ResourceStatus status,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) Integer maxCapacity,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<Resource> resources = resourceService.getAllResources(
                name, building, type, status, minCapacity, maxCapacity, pageable);
        
        return ResponseEntity.ok(resources);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResourceById(@PathVariable Long id) {
        Resource resource = resourceService.getResourceById(id);
        return ResponseEntity.ok(resource);
    }

    @PostMapping
    public ResponseEntity<Resource> createResource(@Valid @RequestBody Resource resource) {
        Resource createdResource = resourceService.createResource(resource);
        return ResponseEntity.status(201).body(createdResource);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resource> updateResource(@PathVariable Long id, @Valid @RequestBody Resource resource) {
        Resource updatedResource = resourceService.updateResource(id, resource);
        return ResponseEntity.ok(updatedResource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id, 
                                               @RequestParam(defaultValue = "false") boolean hard) {
        resourceService.deleteResource(id, hard);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/hard")
    public ResponseEntity<Void> hardDeleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id, true);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/qr/{qrCode}")
    public ResponseEntity<Resource> getResourceByQrCode(@PathVariable String qrCode) {
        Resource resource = resourceService.getResourceByQrCode(qrCode);
        return ResponseEntity.ok(resource);
    }

    @GetMapping("/check-conflict")
    public ResponseEntity<List<Resource>> checkConflict(
            @RequestParam Building building,
            @RequestParam ResourceType type,
            @RequestParam LocalTime from,
            @RequestParam LocalTime to) {
        List<Resource> conflicts = resourceService.checkConflicts(building, type, from, to);
        return ResponseEntity.ok(conflicts);
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<Resource>> bulkCreateResources(@Valid @RequestBody List<Resource> resources) {
        List<Resource> createdResources = resourceService.bulkCreateResources(resources);
        return ResponseEntity.status(201).body(createdResources);
    }

    @PutMapping("/bulk/status")
    public ResponseEntity<List<Resource>> bulkUpdateStatus(
            @RequestBody List<Long> ids,
            @RequestParam ResourceStatus status) {
        List<Resource> updatedResources = resourceService.bulkUpdateStatus(ids, status);
        return ResponseEntity.ok(updatedResources);
    }

    @PutMapping("/bulk/hours")
    public ResponseEntity<List<Resource>> bulkUpdateAvailableTime(
            @RequestParam Building building,
            @RequestParam LocalTime endTime) {
        List<Resource> updatedResources = resourceService.bulkUpdateAvailableTime(building, endTime);
        return ResponseEntity.ok(updatedResources);
    }

    @DeleteMapping("/bulk")
    public ResponseEntity<Void> bulkDeleteResources(
            @RequestBody List<Long> ids,
            @RequestParam(defaultValue = "false") boolean hard) {
        resourceService.bulkDeleteResources(ids, hard);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/compare")
    public ResponseEntity<List<Resource>> compareResources(@RequestParam List<Long> ids) {
        List<Resource> resources = resourceService.getResourcesForComparison(ids);
        return ResponseEntity.ok(resources);
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = resourceService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }
}
