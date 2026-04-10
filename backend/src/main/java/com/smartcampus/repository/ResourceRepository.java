package com.smartcampus.repository;

import com.smartcampus.entity.Resource;
import com.smartcampus.entity.enums.Building;
import com.smartcampus.entity.enums.ResourceStatus;
import com.smartcampus.entity.enums.ResourceType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    Optional<Resource> findByNameAndBuilding(String name, Building building);

    List<Resource> findByBuildingAndType(Building building, ResourceType type);

    List<Resource> findByBuildingAndStatusNot(Building building, ResourceStatus status);

    @Query("SELECT r FROM Resource r WHERE " +
           "(:name IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:building IS NULL OR r.building = :building) AND " +
           "(:type IS NULL OR r.type = :type) AND " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:minCapacity IS NULL OR r.capacity >= :minCapacity) AND " +
           "(:maxCapacity IS NULL OR r.capacity <= :maxCapacity)")
    Page<Resource> findByFilters(@Param("name") String name,
                                @Param("building") Building building,
                                @Param("type") ResourceType type,
                                @Param("status") ResourceStatus status,
                                @Param("minCapacity") Integer minCapacity,
                                @Param("maxCapacity") Integer maxCapacity,
                                Pageable pageable);

    @Query("SELECT r FROM Resource r WHERE r.building = :building AND r.type = :type AND " +
           "((r.availableFrom <= :endTime AND r.availableTo >= :startTime)) AND " +
           "r.status != 'DELETED'")
    List<Resource> findConflictingResources(@Param("building") Building building,
                                            @Param("type") ResourceType type,
                                            @Param("startTime") LocalTime startTime,
                                            @Param("endTime") LocalTime endTime);

    @Query("SELECT COUNT(r) FROM Resource r WHERE r.building = :building AND r.status = :status")
    Long countByBuildingAndStatus(@Param("building") Building building, @Param("status") ResourceStatus status);

    @Query("SELECT r.type, COUNT(r) FROM Resource r WHERE r.status != 'DELETED' GROUP BY r.type")
    List<Object[]> countByType();

    @Query("SELECT r.building, COUNT(r) FROM Resource r WHERE r.status != 'DELETED' GROUP BY r.building")
    List<Object[]> countByBuilding();

    List<Resource> findByStatusNot(ResourceStatus status);

    List<Resource> findByBuilding(Building building);

    Optional<Resource> findByQrCode(String qrCode);
}
