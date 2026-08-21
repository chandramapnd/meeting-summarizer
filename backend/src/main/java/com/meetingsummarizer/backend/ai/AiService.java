package com.meetingsummarizer.backend.ai;

import com.meetingsummarizer.backend.ai.dto.SummarizeRequest;
import com.meetingsummarizer.backend.ai.dto.SummarizeResponse;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

@Service
public class AiService {

    private final RestClient restClient;

    public AiService() {
        this.restClient = RestClient.builder()
                .baseUrl("http://localhost:8000")
                .build();
    }

    // Audio → Transcript
    public String transcribeAudio(byte[] audioBytes, String filename) {

        ByteArrayResource audioResource = new ByteArrayResource(audioBytes) {

            @Override
            public String getFilename() {
                return filename;
            }
        };

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

        body.add("file", audioResource);

        return restClient
                .post()
                .uri("/transcribe")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(body)
                .retrieve()
                .body(TranscriptionResponse.class)
                .getTranscript();
    }

    // Transcript → Summary
    public SummarizeResponse summarize(String transcript) {

        SummarizeRequest request =
                new SummarizeRequest(transcript);

        return restClient
                .post()
                .uri("/summarize")
                .body(request)
                .retrieve()
                .body(SummarizeResponse.class);
    }

    // Response returned by FastAPI /transcribe
    public static class TranscriptionResponse {

        private String filename;
        private String transcript;

        public TranscriptionResponse() {
        }

        public String getFilename() {
            return filename;
        }

        public void setFilename(String filename) {
            this.filename = filename;
        }

        public String getTranscript() {
            return transcript;
        }

        public void setTranscript(String transcript) {
            this.transcript = transcript;
        }
    }
}