package com.londonmeet.server.controller.activity;

import com.londonmeet.common.response.ApiResponse;
import com.londonmeet.pojo.dto.request.ActivitySearchRequest;
import com.londonmeet.pojo.vo.ActivityPageVO;
import com.londonmeet.server.service.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/search")
@RequiredArgsConstructor
public class SearchController {

    private final ActivityService activityService;

    @GetMapping("/activities")
    public ApiResponse<ActivityPageVO> searchActivities(ActivitySearchRequest request) {
        return ApiResponse.success(activityService.searchActivities(request));
    }
}
