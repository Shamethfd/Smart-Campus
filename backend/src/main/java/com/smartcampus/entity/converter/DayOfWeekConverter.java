package com.smartcampus.entity.converter;

import com.smartcampus.entity.enums.DayOfWeek;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Converter
public class DayOfWeekConverter implements AttributeConverter<List<DayOfWeek>, byte[]> {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public byte[] convertToDatabaseColumn(List<DayOfWeek> attribute) {
        if (attribute == null || attribute.isEmpty()) {
            return "[]".getBytes(StandardCharsets.UTF_8);
        }
        try {
            return objectMapper.writeValueAsString(attribute).getBytes(StandardCharsets.UTF_8);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting days of week to JSON", e);
        }
    }

    @Override
    public List<DayOfWeek> convertToEntityAttribute(byte[] dbData) {
        if (dbData == null || dbData.length == 0) {
            return List.of();
        }

        String value = new String(dbData, StandardCharsets.UTF_8).trim();
        try {
            if (value.startsWith("[")) {
                List<String> rawValues = objectMapper.readValue(value, new TypeReference<List<String>>() {});
                return rawValues.stream()
                        .map(this::toDayOfWeek)
                        .filter(day -> day != null)
                        .collect(Collectors.toList());
            }
        } catch (JsonProcessingException e) {
            // Fall back to legacy comma-separated format.
        }

        return Arrays.stream(value.split(","))
                .map(this::toDayOfWeek)
                .filter(day -> day != null)
                .collect(Collectors.toCollection(ArrayList::new));
    }

    private DayOfWeek toDayOfWeek(String rawValue) {
        if (rawValue == null) {
            return null;
        }

        String normalized = rawValue.trim().replace("\"", "").toUpperCase(Locale.ROOT);
        if (normalized.isEmpty()) {
            return null;
        }

        if (normalized.length() > 3) {
            normalized = normalized.substring(0, 3);
        }

        try {
            return DayOfWeek.valueOf(normalized);
        } catch (IllegalArgumentException ex) {
            return null;
        }
    }
}
