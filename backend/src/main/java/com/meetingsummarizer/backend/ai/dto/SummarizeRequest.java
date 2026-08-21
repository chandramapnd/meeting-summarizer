package com.meetingsummarizer.backend.ai.dto;

public class SummarizeRequest {

    private String transcript;

    public SummarizeRequest() {
    }

    public SummarizeRequest(String transcript) {
        this.transcript = transcript;
    }

    public String getTranscript() {
        return transcript;
    }

    public void setTranscript(String transcript) {
        this.transcript = transcript;
    }
}