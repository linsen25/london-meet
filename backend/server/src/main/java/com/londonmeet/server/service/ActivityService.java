package com.londonmeet.server.service;

import com.londonmeet.pojo.dto.request.ActivityLikeRequest;
import com.londonmeet.pojo.dto.request.ActivityCreateRequest;
import com.londonmeet.pojo.dto.request.ActivityQueryRequest;
import com.londonmeet.pojo.dto.request.ActivitySearchRequest;
import com.londonmeet.pojo.vo.ActivityDetailVO;
import com.londonmeet.pojo.vo.ActivityLikeVO;
import com.londonmeet.pojo.vo.ActivityPageVO;
import com.londonmeet.pojo.vo.ActivityPostVO;
import com.londonmeet.pojo.vo.ActivityRegistrationVO;
import com.londonmeet.pojo.vo.PendingReviewVO;
import com.londonmeet.server.security.LoginUser;

import java.util.List;

public interface ActivityService {

    ActivityPostVO createActivity(ActivityCreateRequest request, LoginUser loginUser);

    ActivityPageVO listActivities(ActivityQueryRequest request);

    ActivityPageVO listMyOngoingActivities(ActivityQueryRequest request, LoginUser loginUser);

    ActivityPageVO searchActivities(ActivitySearchRequest request);

    List<PendingReviewVO> listPendingReviews(LoginUser loginUser);

    ActivityDetailVO getActivityDetail(Long id, LoginUser loginUser);

    ActivityRegistrationVO applyActivity(Long id, LoginUser loginUser);

    ActivityRegistrationVO joinGroup(Long id, LoginUser loginUser);

    ActivityRegistrationVO approveRegistration(Long registrationId, LoginUser loginUser);

    ActivityRegistrationVO rejectRegistration(Long registrationId, LoginUser loginUser);

    ActivityLikeVO updateLike(Long id, ActivityLikeRequest request);
}
