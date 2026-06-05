package com.londonmeet.pojo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "activities")
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false, length = 120)
    private String title;

    @Column(name = "author_name", nullable = false, length = 80)
    private String authorName;

    @Column(name = "cover_url", nullable = false, length = 500)
    private String coverUrl;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Column(name = "like_count", nullable = false)
    private Integer likeCount;

    @Column(name = "liked", nullable = false)
    private Boolean liked;

    @Column(name = "start_at", nullable = false)
    private LocalDateTime startAt;

    @Column(name = "end_at", nullable = false)
    private LocalDateTime endAt;

    @Column(name = "progress_gif", length = 500)
    private String progressGif;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (likeCount == null) {
            likeCount = 0;
        }
        if (liked == null) {
            liked = false;
        }
        if (status == null) {
            status = "PUBLISHED";
        }
        if (createdAt == null) {
            createdAt = now;
        }
        if (updatedAt == null) {
            updatedAt = now;
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
