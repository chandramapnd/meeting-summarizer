package com.meetingsummarizer.backend.service;

import com.meetingsummarizer.backend.ai.AiService;
import com.meetingsummarizer.backend.ai.dto.SummarizeResponse;
import com.meetingsummarizer.backend.entity.Meeting;
import com.meetingsummarizer.backend.repository.MeetingRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MeetingService {

    private final MeetingRepository meetingRepository;
    private final AiService aiService;

    public MeetingService(
            MeetingRepository meetingRepository,
            AiService aiService) {

        this.meetingRepository = meetingRepository;
        this.aiService = aiService;
    }

    public Meeting saveMeeting(Meeting meeting) {
        return meetingRepository.save(meeting);
    }

    public List<Meeting> getAllMeetings() {
        return meetingRepository.findAll();
    }

    public Optional<Meeting> getMeetingById(Long id) {
        return meetingRepository.findById(id);
    }

    public void deleteMeeting(Long id) {
        meetingRepository.deleteById(id);
    }

    public Meeting processMeeting(
            String title,
            MultipartFile audioFile) throws IOException {

        // 1. Read audio file
        byte[] audioBytes = audioFile.getBytes();

        // 2. Audio → Transcript
        String transcript = aiService.transcribeAudio(
                audioBytes,
                audioFile.getOriginalFilename()
        );

        // 3. Transcript → Summary + Decisions + Action Items
        SummarizeResponse aiResult =
                aiService.summarize(transcript);

        // 4. Create Meeting object
        Meeting meeting = new Meeting();

        meeting.setTitle(title);
        meeting.setAudioFileName(audioFile.getOriginalFilename());
        meeting.setTranscript(transcript);
        meeting.setSummary(aiResult.getSummary());
        meeting.setKeyDecisions(aiResult.getKeyDecisions());
        meeting.setActionItems(aiResult.getActionItems());
        meeting.setCreatedAt(LocalDateTime.now());

        // 5. Save to PostgreSQL
        return meetingRepository.save(meeting);
    }
}