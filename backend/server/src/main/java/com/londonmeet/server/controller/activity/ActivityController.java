package com.londonmeet.server.controller.activity;

import com.londonmeet.common.response.ApiResponse;
import com.londonmeet.pojo.dto.request.ActivityCreateRequest;
import com.londonmeet.pojo.dto.request.ActivityLikeRequest;
import com.londonmeet.pojo.dto.request.ActivityQueryRequest;
import com.londonmeet.pojo.vo.ActivityDetailVO;
import com.londonmeet.pojo.vo.ActivityLikeVO;
import com.londonmeet.pojo.vo.ActivityPageVO;
import com.londonmeet.pojo.vo.ActivityPostVO;
import com.londonmeet.pojo.vo.ActivityRegistrationVO;
import com.londonmeet.pojo.vo.PendingReviewVO;
import com.londonmeet.server.security.LoginUser;
import com.londonmeet.server.service.ActivityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @PostMapping
    public ApiResponse<ActivityPostVO> createActivity(
            @Valid @RequestBody ActivityCreateRequest request,
            @AuthenticationPrincipal LoginUser loginUser
    ) {
        return ApiResponse.success(activityService.createActivity(request, loginUser));
    }

    @GetMapping
    public ApiResponse<ActivityPageVO> listActivities(ActivityQueryRequest request) {
        return ApiResponse.success(activityService.listActivities(request));
    }

    @GetMapping("/me/ongoing")
    public ApiResponse<ActivityPageVO> listMyOngoingActivities(
            ActivityQueryRequest request,
            @AuthenticationPrincipal LoginUser loginUser
    ) {
        return ApiResponse.success(activityService.listMyOngoingActivities(request, loginUser));
    }

    @GetMapping("/pending-review")
    public ApiResponse<List<PendingReviewVO>> listPendingReviews(
            @AuthenticationPrincipal LoginUser loginUser
    ) {
        return ApiResponse.success(activityService.listPendingReviews(loginUser));
    }

    @PostMapping("/registrations/{registrationId}/approve")
    public ApiResponse<ActivityRegistrationVO> approveRegistration(
            @PathVariable Long registrationId,
            @AuthenticationPrincipal LoginUser loginUser
    ) {
        return ApiResponse.success(activityService.approveRegistration(registrationId, loginUser));
    }

    @PostMapping("/registrations/{registrationId}/reject")
    public ApiResponse<ActivityRegistrationVO> rejectRegistration(
            @PathVariable Long registrationId,
            @AuthenticationPrincipal LoginUser loginUser
    ) {
        return ApiResponse.success(activityService.rejectRegistration(registrationId, loginUser));
    }

    @GetMapping("/{id}")
    public ApiResponse<ActivityDetailVO> getActivityDetail(
            @PathVariable Long id,
            @AuthenticationPrincipal LoginUser loginUser
    ) {
        return ApiResponse.success(activityService.getActivityDetail(id, loginUser));
    }

    @PostMapping("/{id}/apply")
    public ApiResponse<ActivityRegistrationVO> applyActivity(
            @PathVariable Long id,
            @AuthenticationPrincipal LoginUser loginUser
    ) {
        return ApiResponse.success(activityService.applyActivity(id, loginUser));
    }

    @PostMapping("/{id}/join-group")
    public ApiResponse<ActivityRegistrationVO> joinGroup(
            @PathVariable Long id,
            @AuthenticationPrincipal LoginUser loginUser
    ) {
        return ApiResponse.success(activityService.joinGroup(id, loginUser));
    }

    @PostMapping("/{id}/like")
    public ApiResponse<ActivityLikeVO> updateLike(
            @PathVariable Long id,
            @RequestBody ActivityLikeRequest request
    ) {
        return ApiResponse.success(activityService.updateLike(id, request));
    }
}
