package com.smartcampus.service;

import com.smartcampus.entity.Resource;
import com.smartcampus.entity.enums.Building;
import com.smartcampus.entity.enums.ResourceStatus;
import com.smartcampus.entity.enums.ResourceType;
import com.smartcampus.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalTime;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public Page<Resource> getAllResources(String name, Building building, ResourceType type, 
                                         ResourceStatus status, Integer minCapacity, Integer maxCapacity, 
                                         Pageable pageable) {
        return resourceRepository.findByFilters(name, building, type, status, minCapacity, maxCapacity, pageable);
    }

    public Resource getResourceById(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Resource not found with id: " + id));
    }

    public Resource createResource(Resource resource) {
        validateResource(resource);
        checkNameUniqueness(resource.getName(), resource.getBuilding());
        
        if (resource.getType() == ResourceType.EQUIPMENT) {
            resource.setCapacity(1);
            resource.setAreaSqFt(null);
        }
        
        Resource savedResource = resourceRepository.save(resource);
        log.info("Created resource: {}", savedResource.getName());
        return savedResource;
    }

    public Resource updateResource(Long id, Resource resource) {
        Resource existingResource = getResourceById(id);
        
        validateResource(resource);
        
        if (!existingResource.getName().equals(resource.getName()) || 
            !existingResource.getBuilding().equals(resource.getBuilding())) {
            checkNameUniqueness(resource.getName(), resource.getBuilding());
        }
        
        if (resource.getType() == ResourceType.EQUIPMENT) {
            resource.setCapacity(1);
            resource.setAreaSqFt(null);
        }
        
        resource.setId(id);
        resource.setQrCode(existingResource.getQrCode());
        Resource updatedResource = resourceRepository.save(resource);
        log.info("Updated resource: {}", updatedResource.getName());
        return updatedResource;
    }

    public void deleteResource(Long id, boolean hardDelete) {
        Resource resource = getResourceById(id);
        
        if (hardDelete) {
            resourceRepository.deleteById(id);
            log.info("Hard deleted resource: {}", resource.getName());
        } else {
            resource.setStatus(ResourceStatus.DELETED);
            resourceRepository.save(resource);
            log.info("Soft deleted resource: {}", resource.getName());
        }
    }

    public List<Resource> bulkCreateResources(List<Resource> resources) {
        for (Resource resource : resources) {
            validateResource(resource);
            if (resource.getType() == ResourceType.EQUIPMENT) {
                resource.setCapacity(1);
                resource.setAreaSqFt(null);
            }
        }
        
        List<Resource> savedResources = resourceRepository.saveAll(resources);
        log.info("Bulk created {} resources", savedResources.size());
        return savedResources;
    }

    public List<Resource> bulkUpdateStatus(List<Long> ids, ResourceStatus status) {
        List<Resource> resources = resourceRepository.findAllById(ids);
        resources.forEach(resource -> resource.setStatus(status));
        return resourceRepository.saveAll(resources);
    }

    public List<Resource> bulkUpdateAvailableTime(Building building, LocalTime newEndTime) {
        List<Resource> resources = resourceRepository.findByBuilding(building);
        
        for (Resource resource : resources) {
            if (resource.getAvailableTo().isAfter(newEndTime)) {
                resource.setAvailableTo(newEndTime);
            }
        }
        
        return resourceRepository.saveAll(resources);
    }

    public void bulkDeleteResources(List<Long> ids, boolean hardDelete) {
        if (hardDelete) {
            resourceRepository.deleteAllById(ids);
        } else {
            List<Resource> resources = resourceRepository.findAllById(ids);
            resources.forEach(resource -> resource.setStatus(ResourceStatus.DELETED));
            resourceRepository.saveAll(resources);
        }
    }

    public List<Resource> getResourcesForComparison(List<Long> ids) {
        return resourceRepository.findAllById(ids);
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = Map.of(
            "totalResources", resourceRepository.count(),
            "workingResources", resourceRepository.countByBuildingAndStatus(null, ResourceStatus.WORKING),
            "resourcesByType", resourceRepository.countByType(),
            "resourcesByBuilding", resourceRepository.countByBuilding()
        );
        return stats;
    }

    public List<Resource> checkConflicts(Building building, ResourceType type, LocalTime startTime, LocalTime endTime) {
        return resourceRepository.findConflictingResources(building, type, startTime, endTime);
    }

    public Resource getResourceByQrCode(String qrCode) {
        return resourceRepository.findByQrCode(qrCode)
                .orElseThrow(() -> new EntityNotFoundException("Resource not found with QR code: " + qrCode));
    }

    private void validateResource(Resource resource) {
        if (resource.getName() == null || resource.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Resource name is required");
        }
        
        if (resource.getName().length() < 3 || resource.getName().length() > 100) {
            throw new IllegalArgumentException("Resource name must be between 3 and 100 characters");
        }
        
        if (resource.getType() == null) {
            throw new IllegalArgumentException("Resource type is required");
        }
        
        if (resource.getBuilding() == null) {
            throw new IllegalArgumentException("Building is required");
        }
        
        if (resource.getFloor() == null || resource.getFloor() < 1 || resource.getFloor() > 10) {
            throw new IllegalArgumentException("Floor must be between 1 and 10");
        }
        
        if (resource.getCapacity() == null || resource.getCapacity() < 1 || resource.getCapacity() > 1000) {
            throw new IllegalArgumentException("Capacity must be between 1 and 1000");
        }
        
        if (resource.getAvailableFrom() == null || resource.getAvailableTo() == null) {
            throw new IllegalArgumentException("Available from and to times are required");
        }
        
        if (!resource.getAvailableFrom().isBefore(resource.getAvailableTo())) {
            throw new IllegalArgumentException("Available from time must be before available to time");
        }
        
        if (resource.getAvailableDays() == null || resource.getAvailableDays().isEmpty()) {
            throw new IllegalArgumentException("At least one available day must be selected");
        }
        
        if (resource.getAdvanceBookingLimit() != null && 
            (resource.getAdvanceBookingLimit() < 1 || resource.getAdvanceBookingLimit() > 90)) {
            throw new IllegalArgumentException("Advance booking limit must be between 1 and 90");
        }
        
        if (resource.getMinimumNoticeHours() != null && 
            (resource.getMinimumNoticeHours() < 0 || resource.getMinimumNoticeHours() > 48)) {
            throw new IllegalArgumentException("Minimum notice hours must be between 0 and 48");
        }
        
        if (resource.getStatus() == ResourceStatus.UNDER_MAINTENANCE && 
            (resource.getMaintenanceEndDate() == null || resource.getMaintenanceEndDate().isBefore(LocalDate.now()))) {
            throw new IllegalArgumentException("Maintenance end date must be in the future for under maintenance status");
        }
        
        if (resource.getAreaSqFt() != null && resource.getAreaSqFt() < 10) {
            throw new IllegalArgumentException("Area must be at least 10 sq ft");
        }
    }

    private void checkNameUniqueness(String name, Building building) {
        resourceRepository.findByNameAndBuilding(name, building)
                .ifPresent(resource -> {
                    throw new IllegalArgumentException("Resource with name '" + name + "' already exists in " + building);
                });
    }
}
