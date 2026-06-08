package com.londonmeet.pojo.vo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PendingReviewVO {

    private Long registrationId;

    private Long activityId;

    private Long userId;

    private String activityTitle;

    private String nickname;

    private String avatarUrl;

    private Double overallRating;

    private Double timelinessRating;

    private Integer reviewCount;

    private Long appliedAt;
}
