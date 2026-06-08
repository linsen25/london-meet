package com.londonmeet.server.repository;

import com.londonmeet.pojo.entity.ActivityReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ActivityReviewRepository extends JpaRepository<ActivityReview, Long> {

    boolean existsByReviewerUserIdAndActivityIdAndTargetTypeAndTargetId(
            Long reviewerUserId,
            Long activityId,
            String targetType,
            Long targetId
    );

    Optional<ActivityReview> findByReviewerUserIdAndActivityIdAndTargetTypeAndTargetId(
            Long reviewerUserId,
            Long activityId,
            String targetType,
            Long targetId
    );

    int countByTargetTypeAndTargetId(String targetType, Long targetId);
}
