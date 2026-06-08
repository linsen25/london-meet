const { API_BASE_URL, request } = require("../utils/request");

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

const ACTIVITY_ENDPOINTS = {
  create: "/v1/activities",
  list: "/v1/activities",
  myOngoing: "/v1/activities/me/ongoing",
  pendingReview: "/v1/activities/pending-review",
  approveRegistration: "/v1/activities/registrations/:id/approve",
  rejectRegistration: "/v1/activities/registrations/:id/reject",
  detail: "/v1/activities/:id",
  apply: "/v1/activities/:id/apply",
  joinGroup: "/v1/activities/:id/join-group",
  like: "/v1/activities/:id/like"
};

function resolveAssetUrl(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (url.charAt(0) === "/") return `${API_ORIGIN}${url}`;
  return url;
}

function normalizePost(raw) {
  const post = raw || {};

  return {
    _id: post._id || post.id,
    title: post.title || "",
    authorName: post.authorName || "",
    coverUrl: resolveAssetUrl(post.coverUrl || ""),
    avatarUrl: resolveAssetUrl(post.avatarUrl || ""),
    likeCount: Number(post.likeCount) || 0,
    liked: !!post.liked,
    progressPct: post.progressPct == null ? post.progressPercent : post.progressPct,
    startAt: Number(post.startAt) || 0,
    endAt: Number(post.endAt) || 0,
    progressGif: post.progressGif || ""
  };
}

function fetchActivityPosts(params) {
  const { range = "day", page = 1, pageSize = 20, refresh = false } = params || {};

  return request({
    url: ACTIVITY_ENDPOINTS.list,
    method: "GET",
    data: {
      range,
      page,
      pageSize,
      refresh: refresh ? 1 : 0
    }
  }).then((res) => ({
    ...res,
    list: (res.list || []).map(normalizePost)
  }));
}

function fetchMyOngoingActivityPosts(params) {
  const { page = 1, pageSize = 20 } = params || {};

  return request({
    url: ACTIVITY_ENDPOINTS.myOngoing,
    method: "GET",
    data: {
      page,
      pageSize
    }
  }).then((res) => ({
    ...res,
    list: (res.list || []).map(normalizePost)
  }));
}

function normalizeActivityDetail(raw) {
  const detail = raw || {};
  const images = Array.isArray(detail.imageUrls) ? detail.imageUrls.filter(Boolean) : [];
  const coverUrl = resolveAssetUrl(detail.coverUrl || "");

  return {
    id: detail.id,
    title: detail.title || "",
    content: detail.content || "",
    authorName: detail.authorName || "",
    coverUrl,
    imageUrls: images.length ? images.map(resolveAssetUrl) : (coverUrl ? [coverUrl] : []),
    startAt: Number(detail.startAt) || 0,
    endAt: Number(detail.endAt) || 0,
    joinedCount: Number(detail.joinedCount) || 0,
    totalCount: Number(detail.totalCount) || 0,
    full: !!detail.full,
    locationText: detail.locationText || "",
    mapImageUrl: resolveAssetUrl(detail.mapImageUrl || ""),
    inviteQrUrl: resolveAssetUrl(detail.inviteQrUrl || ""),
    isCreator: !!detail.isCreator,
    registrationStatus: detail.registrationStatus || "",
    noticeCode: detail.noticeCode == null ? null : Number(detail.noticeCode)
  };
}

function normalizePendingReview(raw) {
  const item = raw || {};

  return {
    registrationId: item.registrationId,
    activityId: item.activityId,
    userId: item.userId,
    activityTitle: item.activityTitle || "",
    nickname: item.nickname || "MeetFun User",
    avatarUrl: resolveAssetUrl(item.avatarUrl || ""),
    overallRating: Number(item.overallRating) || 0,
    timelinessRating: Number(item.timelinessRating) || 0,
    reviewCount: Number(item.reviewCount) || 0,
    appliedAt: Number(item.appliedAt) || 0
  };
}

function fetchActivityDetail(id) {
  return request({
    url: ACTIVITY_ENDPOINTS.detail.replace(":id", id),
    method: "GET"
  }).then(normalizeActivityDetail);
}

function applyActivity(id) {
  return request({
    url: ACTIVITY_ENDPOINTS.apply.replace(":id", id),
    method: "POST"
  });
}

function joinActivityGroup(id) {
  return request({
    url: ACTIVITY_ENDPOINTS.joinGroup.replace(":id", id),
    method: "POST"
  });
}

function fetchPendingReviews() {
  return request({
    url: ACTIVITY_ENDPOINTS.pendingReview,
    method: "GET"
  }).then((res) => (res || []).map(normalizePendingReview));
}

function approveActivityRegistration(id) {
  return request({
    url: ACTIVITY_ENDPOINTS.approveRegistration.replace(":id", id),
    method: "POST"
  });
}

function rejectActivityRegistration(id) {
  return request({
    url: ACTIVITY_ENDPOINTS.rejectRegistration.replace(":id", id),
    method: "POST"
  });
}

function createActivity(payload) {
  return request({
    url: ACTIVITY_ENDPOINTS.create,
    method: "POST",
    data: payload || {}
  }).then(normalizePost);
}

function updateActivityLike(params) {
  const { id, liked } = params || {};

  return request({
    url: ACTIVITY_ENDPOINTS.like.replace(":id", id),
    method: "POST",
    data: { liked }
  });
}

module.exports = {
  ACTIVITY_ENDPOINTS,
  applyActivity,
  approveActivityRegistration,
  createActivity,
  fetchActivityDetail,
  fetchActivityPosts,
  fetchMyOngoingActivityPosts,
  fetchPendingReviews,
  joinActivityGroup,
  resolveAssetUrl,
  rejectActivityRegistration,
  updateActivityLike
};
