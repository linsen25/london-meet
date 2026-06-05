package com.londonmeet.server.controller.activity;

import com.londonmeet.common.response.ApiResponse;
import com.londonmeet.pojo.dto.request.ActivityLikeRequest;
import com.londonmeet.pojo.dto.request.ActivityQueryRequest;
import com.londonmeet.pojo.vo.ActivityLikeVO;
import com.londonmeet.pojo.vo.ActivityPageVO;
import com.londonmeet.server.service.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @GetMapping
    public ApiResponse<ActivityPageVO> listActivities(ActivityQueryRequest request) {
        return ApiResponse.success(activityService.listActivities(request));
    }

    @PostMapping("/{id}/like")
    public ApiResponse<ActivityLikeVO> updateLike(
            @PathVariable Long id,
            @RequestBody ActivityLikeRequest request
    ) {
        return ApiResponse.success(activityService.updateLike(id, request));
    }
}
