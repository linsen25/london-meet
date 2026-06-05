package com.londonmeet.server.service.impl;

import com.londonmeet.common.exception.BusinessException;
import com.londonmeet.pojo.dto.request.ActivityLikeRequest;
import com.londonmeet.pojo.dto.request.ActivityQueryRequest;
import com.londonmeet.pojo.entity.Activity;
import com.londonmeet.pojo.vo.ActivityLikeVO;
import com.londonmeet.pojo.vo.ActivityPageVO;
import com.londonmeet.pojo.vo.ActivityPostVO;
import com.londonmeet.server.repository.ActivityRepository;
import com.londonmeet.server.service.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityServiceImpl implements ActivityService {

    private static final String STATUS_PUBLISHED = "PUBLISHED";

    private final ActivityRepository activityRepository;

    @Override
    @Transactional(readOnly = true)
    public ActivityPageVO listActivities(ActivityQueryRequest request) {
        String range = normalizeRange(request.getRange());
        int page = normalizePage(request.getPage());
        int pageSize = normalizePageSize(request.getPageSize());

        LocalDate today = LocalDate.now();
        LocalDateTime rangeStart = today.atStartOfDay();
        LocalDateTime rangeEnd = switch (range) {
            case "week" -> today.plusWeeks(1).plusDays(1).atStartOfDay();
            case "month" -> today.plusMonths(1).plusDays(1).atStartOfDay();
            default -> today.plusDays(1).atStartOfDay();
        };

        Page<Activity> result = activityRepository.findByStatusAndStartAtBeforeAndEndAtAfter(
                STATUS_PUBLISHED,
                rangeEnd,
                rangeStart,
                PageRequest.of(page - 1, pageSize, Sort.by(Sort.Direction.DESC, "createdAt"))
        );

        List<ActivityPostVO> list = result.getContent().stream()
                .map(this::toPostVO)
                .toList();

        return ActivityPageVO.builder()
                .list(list)
                .page(page)
                .pageSize(pageSize)
                .hasMore(result.hasNext())
                .build();
    }

    @Override
    @Transactional
    public ActivityLikeVO updateLike(Long id, ActivityLikeRequest request) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Activity not found."));

        boolean liked = request != null && Boolean.TRUE.equals(request.getLiked());
        boolean wasLiked = Boolean.TRUE.equals(activity.getLiked());
        int likeCount = activity.getLikeCount() == null ? 0 : activity.getLikeCount();

        if (liked && !wasLiked) {
            likeCount += 1;
        } else if (!liked && wasLiked) {
            likeCount = Math.max(0, likeCount - 1);
        }

        activity.setLiked(liked);
        activity.setLikeCount(likeCount);

        Activity saved = activityRepository.save(activity);

        return ActivityLikeVO.builder()
                .id(saved.getId())
                .liked(saved.getLiked())
                .likeCount(saved.getLikeCount())
                .build();
    }

    private ActivityPostVO toPostVO(Activity activity) {
        return ActivityPostVO.builder()
                .id(activity.getId())
                .title(activity.getTitle())
                .authorName(activity.getAuthorName())
                .coverUrl(activity.getCoverUrl())
                .avatarUrl(activity.getAvatarUrl())
                .likeCount(activity.getLikeCount())
                .liked(activity.getLiked())
                .progressPct(calculateProgressPct(activity))
                .startAt(toEpochMillis(activity.getStartAt()))
                .endAt(toEpochMillis(activity.getEndAt()))
                .progressGif(activity.getProgressGif())
                .build();
    }

    private Integer calculateProgressPct(Activity activity) {
        long start = toEpochMillis(activity.getStartAt());
        long end = toEpochMillis(activity.getEndAt());
        long now = System.currentTimeMillis();

        if (end <= start) {
            return 100;
        }
        if (now <= start) {
            return 0;
        }
        if (now >= end) {
            return 100;
        }

        return (int) Math.round((now - start) * 100.0 / (end - start));
    }

    private Long toEpochMillis(LocalDateTime time) {
        if (time == null) {
            return null;
        }
        return time.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
    }

    private String normalizeRange(String range) {
        if (!StringUtils.hasText(range)) {
            return "day";
        }
        return switch (range) {
            case "week", "month" -> range;
            default -> "day";
        };
    }

    private int normalizePage(Integer page) {
        if (page == null || page < 1) {
            return 1;
        }
        return page;
    }

    private int normalizePageSize(Integer pageSize) {
        if (pageSize == null || pageSize < 1) {
            return 20;
        }
        return Math.min(pageSize, 50);
    }
}
