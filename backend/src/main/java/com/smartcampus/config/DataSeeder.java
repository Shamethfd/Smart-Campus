package com.smartcampus.config;

import com.smartcampus.enums.Role;
import com.smartcampus.model.User;
import com.smartcampus.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Instant;

/**
 * Seeds the database with sample users when the application starts.
 * This is useful for testing and demonstration during viva.
 *
 * IMPORTANT: This only runs in development. In production, remove or disable this.
 * It checks if users already exist before inserting to avoid duplicates.
 *
 * Seeds:
 * - An ADMIN user (admin@smartcampus.edu)
 * - A regular USER (student@smartcampus.edu)
 * - A TECHNICIAN (tech@smartcampus.edu)
 *
 * Member 4 - Sample Data
 */
@Configuration
public class DataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    @Bean
    public CommandLineRunner seedData(UserRepository userRepository) {
        return args -> {
            // Seed ADMIN user
            if (!userRepository.existsByEmail("admin@smartcampus.edu")) {
                User admin = new User(
                        null,
                        "Smart Campus Admin",
                        "admin@smartcampus.edu",
                        "https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff",
                        "GOOGLE",
                        Role.ADMIN,
                        true,
                        Instant.now(),
                        Instant.now()
                );
                userRepository.save(admin);
                logger.info("Seeded ADMIN user: admin@smartcampus.edu");
            }

            // Seed regular USER
            if (!userRepository.existsByEmail("student@smartcampus.edu")) {
                User student = new User(
                        null,
                        "John Student",
                        "student@smartcampus.edu",
                        "https://ui-avatars.com/api/?name=John+Student&background=10b981&color=fff",
                        "GOOGLE",
                        Role.USER,
                        true,
                        Instant.now(),
                        Instant.now()
                );
                userRepository.save(student);
                logger.info("Seeded USER: student@smartcampus.edu");
            }

            // Seed TECHNICIAN user
            if (!userRepository.existsByEmail("tech@smartcampus.edu")) {
                User technician = new User(
                        null,
                        "Jane Technician",
                        "tech@smartcampus.edu",
                        "https://ui-avatars.com/api/?name=Jane+Tech&background=f59e0b&color=fff",
                        "GOOGLE",
                        Role.TECHNICIAN,
                        true,
                        Instant.now(),
                        Instant.now()
                );
                userRepository.save(technician);
                logger.info("Seeded TECHNICIAN: tech@smartcampus.edu");
            }

            logger.info("Data seeding complete. Total users: {}", userRepository.count());
        };
    }
}
