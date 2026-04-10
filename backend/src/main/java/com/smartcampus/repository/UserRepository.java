package com.smartcampus.repository;

import com.smartcampus.model.User;
import com.smartcampus.enums.Role;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

/**
 * Repository interface for User MongoDB operations.
 * Spring Data MongoDB auto-generates the implementation at runtime.
 *
 * Member 4 - Auth & Role Management
 */
@Repository
public interface UserRepository extends MongoRepository<User, String> {

    /**
     * Find a user by their email address.
     * Used during OAuth login to check if user already exists.
     */
    Optional<User> findByEmail(String email);

    /**
     * Case-insensitive match for login (OAuth may store mixed-case emails).
     */
    Optional<User> findByEmailIgnoreCase(String email);

    /**
     * Check if a user with the given email exists.
     * Used to decide whether to create a new user or update existing.
     */
    boolean existsByEmail(String email);

    /**
     * Find all users with the given role.
     * Used to fan out admin notifications.
     */
    List<User> findByRole(Role role);
}
