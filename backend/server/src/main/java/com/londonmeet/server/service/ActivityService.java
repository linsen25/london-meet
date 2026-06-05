package com.londonmeet.server.service;

import com.londonmeet.pojo.dto.request.ActivityLikeRequest;
import com.londonmeet.pojo.dto.request.ActivityQueryRequest;
import com.londonmeet.pojo.vo.ActivityLikeVO;
import com.londonmeet.pojo.vo.ActivityPageVO;

public interface ActivityService {

    ActivityPageVO listActivities(ActivityQueryRequest request);

    ActivityLikeVO updateLike(Long id, ActivityLikeRequest request);
}
