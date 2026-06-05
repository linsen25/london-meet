const { request } = require("../utils/request");

const ACTIVITY_ENDPOINTS = {
  create: "/v1/activities",
  list: "/v1/activities",
  detail: "/v1/activities/:id",
  apply: "/v1/activities/:id/apply",
  joinGroup: "/v1/activities/:id/join-group",
  like: "/v1/activities/:id/like"
};

function normalizePost(raw) {
  const post = raw || {};

  return {
    _id: post._id || post.id,
    title: post.title || "",
    authorName: post.authorName || "",
    coverUrl: post.coverUrl || "",
    avatarUrl: post.avatarUrl || "",
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

function normalizeActivityDetail(raw) {
  const detail = raw || {};
  const images = Array.isArray(detail.imageUrls) ? detail.imageUrls.filter(Boolean) : [];

  return {
    id: detail.id,
    title: detail.title || "",
    content: detail.content || "",
    authorName: detail.authorName || "",
    coverUrl: detail.coverUrl || "",
    imageUrls: images.length ? images : (detail.coverUrl ? [detail.coverUrl] : []),
    startAt: Number(detail.startAt) || 0,
    endAt: Number(detail.endAt) || 0,
    joinedCount: Number(detail.joinedCount) || 0,
    totalCount: Number(detail.totalCount) || 0,
    full: !!detail.full,
    locationText: detail.locationText || "",
    mapImageUrl: detail.mapImageUrl || "",
    inviteQrUrl: detail.inviteQrUrl || "",
    registrationStatus: detail.registrationStatus || "",
    noticeCode: detail.noticeCode == null ? null : Number(detail.noticeCode)
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
  createActivity,
  fetchActivityDetail,
  fetchActivityPosts,
  joinActivityGroup,
  updateActivityLike
};
