package com.londonmeet.server.repository;

import com.londonmeet.pojo.entity.Activity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface ActivityRepository extends JpaRepository<Activity, Long> {

    Page<Activity> findByStatusAndStartAtBeforeAndEndAtAfter(
            String status,
            LocalDateTime rangeEndExclusive,
            LocalDateTime rangeStartInclusive,
            Pageable pageable
    );
}
