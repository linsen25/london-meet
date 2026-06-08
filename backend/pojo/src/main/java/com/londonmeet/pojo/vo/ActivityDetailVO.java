package com.londonmeet.pojo.vo;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ActivityDetailVO {

    private Long id;

    private String title;

    private String content;

    private String authorName;

    private String coverUrl;

    private List<String> imageUrls;

    private Long startAt;

    private Long endAt;

    private Integer joinedCount;

    private Integer totalCount;

    private Boolean full;

    private Boolean isCreator;

    private String locationText;

    private String mapImageUrl;

    private String inviteQrUrl;

    private String registrationStatus;

    private Integer noticeCode;
}
