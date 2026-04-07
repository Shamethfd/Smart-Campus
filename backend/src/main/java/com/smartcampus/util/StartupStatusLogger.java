package com.smartcampus.util;

import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class StartupStatusLogger {

    private static final Logger log = LoggerFactory.getLogger(StartupStatusLogger.class);

    private final MongoTemplate mongoTemplate;
    private final Environment environment;

    public StartupStatusLogger(MongoTemplate mongoTemplate, Environment environment) {
        this.mongoTemplate = mongoTemplate;
        this.environment = environment;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        String port = environment.getProperty("server.port", "8080");

        log.info("Server started successfully on port {}", port);

        try {
            mongoTemplate.getDb().runCommand(new Document("ping", 1));
            log.info("MongoDB connected successfully");
        } catch (Exception ex) {
            log.error("MongoDB connection failed: {}", ex.getMessage());
        }
    }
}