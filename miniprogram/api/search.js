const { request } = require("../utils/request");

const USE_MOCK = true;
const day = 24 * 60 * 60 * 1000;

const SEARCH_ENDPOINTS = {
  activities: "/v1/search/activities"
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

function mockSearchPosts(params) {
  const { keyword = "", tags = [] } = params || {};
  const now = Date.now();
  const label = [keyword, ...tags].filter(Boolean).join("-") || "search";

  return Array.from({ length: 8 }).map((_, index) => {
    const n = index + 1;
    return normalizePost({
      _id: `search-${label}-${n}`,
      title: `搜索结果 ${n}：${label}`,
      authorName: `User ${n}`,
      likeCount: 18 + n * 5,
      liked: false,
      progressPct: Math.max(10, 92 - n * 9),
      coverUrl: `https://dummyimage.com/600x800/3a3a3a/ffffff.png&text=${encodeURIComponent(label)}-${n}`,
      avatarUrl: `https://dummyimage.com/100x100/555555/ffffff.png&text=${n}`,
      startAt: now - day * n,
      endAt: now + day * (9 - n),
      progressGif: ""
    });
  });
}

function searchActivities(params) {
  const { keyword = "", tags = [], page = 1, pageSize = 20 } = params || {};

  if (USE_MOCK) {
    return Promise.resolve({
      list: mockSearchPosts({ keyword, tags }),
      page,
      pageSize,
      hasMore: false
    });
  }

  // TODO(api): 请求搜索活动结果。
  // GET /v1/search/activities?keyword=xxx&tags=摄影,桌游&page=1&pageSize=20
  // 请求参数：keyword 输入框文字；tags 热点标签数组。
  // 返回建议：{ list, page, pageSize, hasMore }
  // list 单项字段同活动瀑布流：_id,title,coverUrl,avatarUrl,likeCount,liked,progressPct,startAt,endAt
  return request({
    url: SEARCH_ENDPOINTS.activities,
    method: "GET",
    data: {
      keyword,
      tags,
      page,
      pageSize
    }
  }).then((res) => ({
    ...res,
    list: (res.list || []).map(normalizePost)
  }));
}

module.exports = {
  SEARCH_ENDPOINTS,
  searchActivities
};
