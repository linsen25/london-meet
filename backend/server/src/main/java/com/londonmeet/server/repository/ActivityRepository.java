package com.londonmeet.server.repository;

import com.londonmeet.pojo.entity.Activity;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Optional;

public interface ActivityRepository extends JpaRepository<Activity, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select a from Activity a where a.id = :id")
    Optional<Activity> findLockedById(@Param("id") Long id);

    Page<Activity> findByStatusAndEndAtAfterAndEndAtBefore(
            String status,
            LocalDateTime endAtAfter,
            LocalDateTime endAtBefore,
            Pageable pageable
    );

    @Query("""
            select a
            from Activity a
            where a.status = :status
              and a.endAt > :now
              and (:keyword is null or lower(a.title) like lower(concat('%', :keyword, '%')))
              and (:hasTagFilter = false or a.tagId in :tagIds)
            """)
    Page<Activity> searchPublishedActivities(
            @Param("status") String status,
            @Param("now") LocalDateTime now,
            @Param("keyword") String keyword,
            @Param("hasTagFilter") boolean hasTagFilter,
            @Param("tagIds") java.util.Collection<Long> tagIds,
            Pageable pageable
    );

    long deleteByEndAtBefore(LocalDateTime expiredBefore);

    long countByCreatorUserId(Long creatorUserId);

    long countByCreatorUserIdAndStatusAndStartAtLessThanEqualAndEndAtAfter(
            Long creatorUserId,
            String status,
            LocalDateTime startAt,
            LocalDateTime endAt
    );

    @Query("select coalesce(sum(a.likeCount), 0) from Activity a where a.creatorUserId = :creatorUserId")
    long sumLikeCountByCreatorUserId(@Param("creatorUserId") Long creatorUserId);

    @Query("""
            select distinct a
            from Activity a
            left join ActivityRegistration r on r.activityId = a.id
            where a.status = :status
              and a.endAt > :now
              and (
                    a.creatorUserId = :userId
                    or (r.userId = :userId and r.status in :registrationStatuses)
                  )
            """)
    Page<Activity> findRelatedOngoingActivities(
            @Param("userId") Long userId,
            @Param("status") String status,
            @Param("now") LocalDateTime now,
            @Param("registrationStatuses") Collection<String> registrationStatuses,
            Pageable pageable
    );

    @Query("""
            select distinct a
            from Activity a
            left join ActivityRegistration r on r.activityId = a.id
            where a.status = :status
              and a.endAt <= :now
              and (
                    a.creatorUserId = :userId
                    or (r.userId = :userId and r.status in :registrationStatuses)
                  )
            order by a.endAt desc
            """)
    java.util.List<Activity> findRelatedEndedActivities(
            @Param("userId") Long userId,
            @Param("status") String status,
            @Param("now") LocalDateTime now,
            @Param("registrationStatuses") Collection<String> registrationStatuses
    );
}
