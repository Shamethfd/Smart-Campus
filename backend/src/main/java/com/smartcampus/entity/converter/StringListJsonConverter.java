package com.smartcampus.entity.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Converter
public class StringListJsonConverter implements AttributeConverter<List<String>, byte[]> {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public byte[] convertToDatabaseColumn(List<String> attribute) {
        try {
            return objectMapper.writeValueAsString(attribute == null ? List.of() : attribute)
                    .getBytes(StandardCharsets.UTF_8);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting string list to JSON", e);
        }
    }

    @Override
    public List<String> convertToEntityAttribute(byte[] dbData) {
        if (dbData == null || dbData.length == 0) {
            return List.of();
        }
        try {
            String value = new String(dbData, StandardCharsets.UTF_8).trim();
            if (value.isEmpty()) {
                return List.of();
            }
            return objectMapper.readValue(value, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            throw new RuntimeException("Error converting JSON to string list", e);
        }
    }
}

