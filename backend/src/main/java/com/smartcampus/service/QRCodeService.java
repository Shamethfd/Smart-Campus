package com.smartcampus.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;

@Service
@Slf4j
public class QRCodeService {

    public String generateQRCode(String text, int width, int height) throws WriterException, IOException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);
        
        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        
        byte[] pngData = pngOutputStream.toByteArray();
        return Base64.getEncoder().encodeToString(pngData);
    }

    public String generateResourceQRCode(Long resourceId, String resourceName, String qrCode) {
        String qrText = String.format("Resource ID: %d\nName: %s\nQR: %s", resourceId, resourceName, qrCode);
        try {
            return generateQRCode(qrText, 300, 300);
        } catch (WriterException | IOException e) {
            log.error("Error generating QR code for resource: {}", resourceId, e);
            throw new RuntimeException("Failed to generate QR code", e);
        }
    }
}
