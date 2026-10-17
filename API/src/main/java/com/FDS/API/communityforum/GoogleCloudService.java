package com.FDS.API.communityforum;

import java.io.FileInputStream;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

import jakarta.annotation.PostConstruct;

@Service
public class GoogleCloudService {
    private Storage storage;
    private boolean isGcsAvailable;

    public GoogleCloudService() {
        this.storage = null; // initialising as null since json config file might be missing
        this.isGcsAvailable = true;
    }

    @PostConstruct
    public void init() {
        try {
            GoogleCredentials credentials = GoogleCredentials.fromStream(
                new FileInputStream("API/src/main/resources/secrets/service-account-key.json") // credentials load from this json file
            );

            this.storage = StorageOptions.newBuilder()
                .setCredentials(credentials)
                .build()
                .getService();

        } catch (Exception e) {
            // this is likely to happen when json is invalid
            System.err.println("\n\nERROR: Failed to initialise Google Cloud Storage: " + e.getMessage() + "\n");
            e.printStackTrace();
            this.isGcsAvailable = false;
        }
    }

    public String uploadImage(MultipartFile file, String fileNamePrefix) {
        if (!isGcsAvailable) {
            throw new RuntimeException("Google Cloud Storage is not configured correctly.");
        }

        final String bucketName = "cs2001-food-waste-proj";
        try {
            String fileName = fileNamePrefix + "-" + UUID.randomUUID().toString();
            
            // upload to GCS
            BlobId blobId = BlobId.of(bucketName, fileName);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                .setContentType(file.getContentType())
                .build();
            
            storage.create(blobInfo, file.getBytes());
            
            String publicUrl = String.format("https://storage.googleapis.com/%s/%s", bucketName, fileName);
            
            return publicUrl;
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload image to GCS: " + e.getMessage());
        }
    }

    public boolean isGcsAvailable() {
        return this.isGcsAvailable;
    }
}