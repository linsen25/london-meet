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
import com.londonmeet.server.security.LoginUser;

public interface ActivityService {

    ActivityPostVO createActivity(ActivityCreateRequest request, LoginUser loginUser);

    ActivityPageVO listActivities(ActivityQueryRequest request);

    ActivityPageVO searchActivities(ActivitySearchRequest request);

    ActivityDetailVO getActivityDetail(Long id, LoginUser loginUser);

    ActivityRegistrationVO applyActivity(Long id, LoginUser loginUser);

    ActivityRegistrationVO joinGroup(Long id, LoginUser loginUser);

    ActivityLikeVO updateLike(Long id, ActivityLikeRequest request);
}
