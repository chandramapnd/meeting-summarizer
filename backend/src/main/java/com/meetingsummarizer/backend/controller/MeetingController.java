package com.meetingsummarizer.backend.controller;

import com.meetingsummarizer.backend.entity.Meeting;
import com.meetingsummarizer.backend.service.MeetingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/meetings")
public class MeetingController {

    private final MeetingService meetingService;

    public MeetingController(MeetingService meetingService) {
        this.meetingService = meetingService;
    }

    // Create meeting manually
    @PostMapping
    public Meeting create(@RequestBody Meeting meeting) {
        return meetingService.saveMeeting(meeting);
    }

    // Get all meetings
    @GetMapping
    public List<Meeting> getAll() {
        return meetingService.getAllMeetings();
    }

    // Get meeting by ID
    @GetMapping("/{id}")
    public ResponseEntity<Meeting> getById(@PathVariable Long id) {

        return meetingService.getMeetingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete meeting
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        meetingService.deleteMeeting(id);

        return ResponseEntity.noContent().build();
    }

    // Upload audio → Transcribe → Summarize → Save
    @PostMapping("/process")
    public ResponseEntity<Meeting> processMeeting(
            @RequestParam("title") String title,
            @RequestParam("file") MultipartFile file) {

        try {

            Meeting meeting =
                    meetingService.processMeeting(title, file);

            return ResponseEntity.ok(meeting);

        } catch (IOException e) {

            return ResponseEntity
                    .badRequest()
                    .build();

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .build();
        }
    }
}