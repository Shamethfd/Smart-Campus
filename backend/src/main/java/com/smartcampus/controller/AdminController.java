package com.smartcampus.controller;

import com.smartcampus.entity.Resource;
import com.smartcampus.service.QRCodeService;
import com.smartcampus.service.ResourceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/smart-admin")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class AdminController {

    private final ResourceService resourceService;
    private final QRCodeService qrCodeService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = resourceService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/qr/batch")
    public ResponseEntity<Map<String, Object>> getBatchQR(@RequestParam List<Long> ids) {
        Map<String, Object> qrCodes = Map.of();
        for (Long id : ids) {
            Resource resource = resourceService.getResourceById(id);
            String qrCode = qrCodeService.generateResourceQRCode(resource.getId(), resource.getName(), resource.getQrCode());
            qrCodes.put(id.toString(), qrCode);
        }
        return ResponseEntity.ok(qrCodes);
    }

    @GetMapping("/qr/{id}")
    public ResponseEntity<Map<String, String>> getResourceQR(@PathVariable Long id) {
        Resource resource = resourceService.getResourceById(id);
        String qrCode = qrCodeService.generateResourceQRCode(resource.getId(), resource.getName(), resource.getQrCode());
        return ResponseEntity.ok(Map.of("qrCode", qrCode, "name", resource.getName()));
    }

    @PostMapping("/maintenance/schedule")
    public ResponseEntity<String> scheduleMaintenance(@RequestBody Map<String, Object> request) {
        // This will integrate with Member 2 and 4 APIs
        log.info("Scheduling maintenance: {}", request);
        return ResponseEntity.ok("Maintenance scheduled successfully");
    }

    @GetMapping("/export")
    public ResponseEntity<String> exportData(@RequestParam String format, @RequestParam String reportType) {
        // This will generate PDF/Excel reports
        log.info("Exporting {} report in {} format", reportType, format);
        return ResponseEntity.ok("Export started");
    }
}
