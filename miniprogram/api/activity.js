const { request } = require("../utils/request");

const USE_MOCK = false;
const day = 24 * 60 * 60 * 1000;

const ACTIVITY_ENDPOINTS = {
  list: "/v1/activities",
  like: "/v1/activities/:id/like"
};

function normalizePost(raw) {
  return {
    _id: raw._id || raw.id,
    title: raw.title || "未命名活动",
    authorName: raw.authorName || "",
    coverUrl: raw.coverUrl || "",
    avatarUrl: raw.avatarUrl || "",
    likeCount: Number(raw.likeCount) || 0,
    liked: !!raw.liked,
    progressPct: raw.progressPct == null ? raw.progressPercent : raw.progressPct,
    startAt: Number(raw.startAt) || 0,
    endAt: Number(raw.endAt) || 0,
    progressGif: raw.progressGif || ""
  };
}

function mockPosts(range) {
  const now = Date.now();
  const rangeText = {
    day: "本日",
    week: "本周",
    month: "本月"
  }[range] || "活动";

  return Array.from({ length: 10 }).map((_, index) => {
    const n = index + 1;
    return normalizePost({
      _id: `${range}-${n}`,
      title: `${rangeText}活动帖子 ${n}（示例）`,
      authorName: `User ${n}`,
      likeCount: 10 + n * 7,
      liked: false,
      progressPct: Math.max(8, 100 - n * 8),
      coverUrl: `https://dummyimage.com/600x800/3a3a3a/ffffff.png&text=${rangeText}-${n}`,
      avatarUrl: `https://dummyimage.com/100x100/555555/ffffff.png&text=${n}`,
      startAt: now - day * n,
      endAt: now + day * (11 - n),
      progressGif: ""
    });
  });
}

function fetchActivityPosts(params) {
  const { range = "day", page = 1, pageSize = 20, refresh = false } = params || {};

  if (USE_MOCK) {
    return Promise.resolve({
      list: mockPosts(range),
      page,
      pageSize,
      hasMore: false
    });
  }

  // TODO(api): 请求活动瀑布流列表。
  // GET /v1/activities?range=day|week|month&page=1&pageSize=20&refresh=1
  // 返回建议：{ list, page, pageSize, hasMore }
  // list 单项字段：_id,title,coverUrl,avatarUrl,likeCount,liked,progressPct,startAt,endAt
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

function updateActivityLike(params) {
  const { id, liked } = params || {};

  if (USE_MOCK) {
    return Promise.resolve({ id, liked });
  }

  // TODO(api): 请求点赞/取消点赞。
  // POST /v1/activities/:id/like
  // body: { liked: true|false }
  // 返回建议：{ id, liked, likeCount }
  return request({
    url: ACTIVITY_ENDPOINTS.like.replace(":id", id),
    method: "POST",
    data: { liked }
  });
}

module.exports = {
  ACTIVITY_ENDPOINTS,
  fetchActivityPosts,
  updateActivityLike
};
