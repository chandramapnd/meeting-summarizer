
package com.meetingsummarizer.backend.repository;

import com.meetingsummarizer.backend.entity.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {
}
