/**
 * ============================================
 * Component: Home（Main 右屏）
 * - 只负责 Home UI
 * - 不处理全局切屏手势（由 pages/index 统一管理）
 *
 * 事件协议（由 Index 接收）：
 * - passthroughstart/move/end -> 手势透传
 * - openpost -> 点击卡片抛出 {id}
 * ============================================
 */

const now = Date.now();
const day = 24 * 60 * 60 * 1000;

Component({
  data: {
    // 8行规则（稳定版）
    rowH: "160rpx",
    halfRowH: "80rpx",
    twoRowH: "320rpx",
    threeRowH: "480rpx",
    sevenHalfRowH: "1200rpx",
    

    // ✅ 小红书式 Profile（先用假数据占位）
    profile: {
      coverUrl: "https://dummyimage.com/1200x800/2b2b2b/ffffff.png&text=Cover",
      avatarUrl: "https://dummyimage.com/300x300/ffffff/111111.png&text=Avatar",
      name: "森森",
      redId: "794640446",
      motto: "来吧让我多认识些有意思的 people",
      age: 21,
      region: "加拿大 ON",
      stats: {
        myEvents: 12,
        ongoing: 3,
        likes: 99
      }
    },
    reviewPosts: [
      {
        _id: "r1",
        title: "羽毛球局",
        avatarUrl: "https://dummyimage.com/100x100/ddd/111.png&text=A",
        startText: "2026-03-06 18:00",
        endText: "2026-03-06 20:00"
      },
      {
        _id: "r2",
        title: "咖啡聊天",
        avatarUrl: "https://dummyimage.com/100x100/ddd/111.png&text=B",
        startText: "2026-03-07 14:00",
        endText: "2026-03-07 16:00"
      },
      {
        _id: "r3",
        title: "剧本杀组局",
        avatarUrl: "https://dummyimage.com/100x100/ddd/111.png&text=C",
        startText: "2026-03-08 19:30",
        endText: "2026-03-08 23:00"
      }
    ],

    // 保留你原本数据结构（示例）
    posts: [
      {
        _id: "p1",
        title: "主页帖子 1（示例）",
        authorName: "Alice",
        likeCount: 12,
        coverUrl: "https://dummyimage.com/600x800/ddd/111.png&text=cover",
        avatarUrl: "https://dummyimage.com/100x100/ddd/111.png&text=A",
        startAt: now - day * 2,
        endAt: now + day * 5,
        progressGif: ""
      }
    ],

    // ========== Outer2：Segment + 瀑布流（按 Activity 的数据结构）==========
    outer2Tabs: [
      { key: "ongoing", label: "活动中" },
      { key: "review", label: "待评价" }
    ],
    outer2TabValue: "ongoing",

    // ✅直接用 Activity 的 mock（一模一样）
    outer2Posts: [
      {
        _id: "a1",
        title: "活动帖子 1（示例）延长延长延长",
        authorName: "Alice",
        likeCount: 12,
        coverUrl: "https://dummyimage.com/600x800/ddd/111.png&text=cover",
        avatarUrl: "https://dummyimage.com/100x100/ddd/111.png&text=A",
        startAt: now - day * 2,
        endAt: now + day * 5,
        progressGif: ""
      },
      {
        _id: "a2",
        title: "活动帖子 2（示例）",
        authorName: "Bob",
        likeCount: 34,
        coverUrl: "https://dummyimage.com/600x800/ddd/111.png&text=cover",
        avatarUrl: "https://dummyimage.com/100x100/ddd/111.png&text=B",
        startAt: now - day * 1,
        endAt: now + day * 4,
        progressGif: ""
      },
      {
        _id: "a3",
        title: "活动帖子 3（示例）",
        authorName: "Cindy",
        likeCount: 56,
        coverUrl: "https://dummyimage.com/600x800/ddd/111.png&text=cover",
        avatarUrl: "https://dummyimage.com/100x100/ddd/111.png&text=C",
        startAt: now - day * 3,
        endAt: now + day * 2,
        progressGif: ""
      },
      {
        _id: "a4",
        title: "活动帖子 4（示例）",
        authorName: "David",
        likeCount: 78,
        coverUrl: "https://dummyimage.com/600x800/ddd/111.png&text=cover",
        avatarUrl: "https://dummyimage.com/100x100/ddd/111.png&text=D",
        startAt: now - day * 2,
        endAt: now + day * 1,
        progressGif: ""
      },
      {
        _id: "a5",
        title: "活动帖子 5（示例）",
        authorName: "Evan",
        likeCount: 90,
        coverUrl: "https://dummyimage.com/600x800/ddd/111.png&text=cover",
        avatarUrl: "https://dummyimage.com/100x100/ddd/111.png&text=E",
        startAt: now - day * 4,
        endAt: now + day * 6,
        progressGif: ""
      },
      {
        _id: "a6",
        title: "活动帖子 6（示例）",
        authorName: "Fiona",
        likeCount: 21,
        coverUrl: "https://dummyimage.com/600x800/ddd/111.png&text=cover",
        avatarUrl: "https://dummyimage.com/100x100/ddd/111.png&text=F",
        startAt: now - day * 1,
        endAt: now + day * 3,
        progressGif: ""
      },
      {
        _id: "a7",
        title: "活动帖子 7（示例）活动帖子 7（示例）活动帖子 7（示例）活动帖子 7（示例）活动帖子 7（示例）活动帖子 7（示例）",
        authorName: "Gina",
        likeCount: 43,
        coverUrl: "https://dummyimage.com/600x800/ddd/111.png&text=cover",
        avatarUrl: "https://dummyimage.com/100x100/ddd/111.png&text=G",
        startAt: now - day * 2,
        endAt: now + day * 7,
        progressGif: ""
      },
      {
        _id: "a8",
        title: "活动帖子 8（示例）",
        authorName: "Henry",
        likeCount: 65,
        coverUrl: "https://dummyimage.com/600x800/ddd/111.png&text=cover",
        avatarUrl: "https://dummyimage.com/100x100/ddd/111.png&text=H",
        startAt: now - day * 5,
        endAt: now + day * 2,
        progressGif: ""
      },
      {
        _id: "a9",
        title: "活动帖子 9（示例）",
        authorName: "Iris",
        likeCount: 87,
        coverUrl: "https://dummyimage.com/600x800/ddd/111.png&text=cover",
        avatarUrl: "https://dummyimage.com/100x100/ddd/111.png&text=I",
        startAt: now - day * 3,
        endAt: now + day * 5,
        progressGif: ""
      },
      {
        _id: "a10",
        title: "活动帖子 10（示例）",
        authorName: "Jack",
        likeCount: 109,
        coverUrl: "https://dummyimage.com/600x800/ddd/111.png&text=cover",
        avatarUrl: "https://dummyimage.com/100x100/ddd/111.png&text=J",
        startAt: now - day * 2,
        endAt: now + day * 4,
        progressGif: ""
      }
    ],
    outer2ReviewTabs: [
      { key: "event", label: "评价活动" },
      { key: "member", label: "评价成员" }
    ],
    outer2ReviewTabValue: "event",
    
    reviewEventPosts: [
      {
        _id: "re1",
        title: "羽毛球局",
        avatarUrl: "https://dummyimage.com/100x100/ddd/111.png&text=E1",
        startText: "2026-03-06 18:00",
        endText: "2026-03-06 20:00"
      },
      {
        _id: "re2",
        title: "咖啡聊天",
        avatarUrl: "https://dummyimage.com/100x100/ddd/111.png&text=E2",
        startText: "2026-03-07 14:00",
        endText: "2026-03-07 16:00"
      }
    ],
    
    reviewMemberPosts: [
      {
        _id: "rm1",
        name: "Alice",
        avatarUrl: "https://dummyimage.com/100x100/ddd/111.png&text=A",
        scoreText: "综合评分：88/100",
        speedText: "时效评分：92/100"
      },
      {
        _id: "rm2",
        name: "Bob",
        avatarUrl: "https://dummyimage.com/100x100/ddd/111.png&text=B",
        scoreText: "综合评分：76/100",
        speedText: "时效评分：85/100"
      }
    ]
  },

  lifetimes: {
    attached() {
      const info = wx.getSystemInfoSync();
      const rpxPerPx = 750 / info.windowWidth;
      const rowPx = info.windowHeight / 8;
      const rowRpx = rowPx * rpxPerPx;

      this.setData({
        rowH: `${rowRpx.toFixed(2)}rpx`,
        halfRowH: `${(rowRpx / 2).toFixed(2)}rpx`,
        twoRowH: `${(rowRpx * 2).toFixed(2)}rpx`,
        threeRowH: `${(rowRpx * 3).toFixed(2)}rpx`,
        sevenHalfRowH: `${(rowRpx * 7.5).toFixed(2)}rpx`
      });
    }
  },

  methods: {
    // ===== 透传触摸（保留）=====
    passTouchStart(e) {
      this.triggerEvent("passthroughstart", e);
    },
    passTouchMove(e) {
      this.triggerEvent("passthroughmove", e);
    },
    passTouchEnd(e) {
      this.triggerEvent("passthroughend", e);
    },
    passTouchCancel(e) {
      this.triggerEvent("passthroughend", e);
    },
    onTapReviewItem(e) {
      const id = e.currentTarget.dataset.id;
      console.log("tap review item:", id);
      // 你之后要跳详情/评价页，就在这里写
    },

    // ===== 打开帖子（保留）=====
    onTapCard(e) {
      const id = e.detail && e.detail.id;
      if (!id) return;
      this.triggerEvent("openpost", { id });
    },

    onOuter2LikeChange(e) {
      const detail = e.detail || {};
      const id = detail.id;
      if (!id) return;

      const outer2Posts = (this.data.outer2Posts || []).map((item) => {
        if (item._id !== id && item.id !== id) return item;
        return {
          ...item,
          liked: detail.liked,
          likeCount: detail.likeCount
        };
      });

      this.setData({ outer2Posts });
      this.triggerEvent("likechange", detail);
    },

    // ===== 头图：更多（先占位，不做逻辑）=====
    onTapMore() {
      console.log("tap: more");
    },

    // ===== Edit Profile（先占位，不做逻辑）=====
    onEditProfile() {
      console.log("tap: edit profile");
    },

    // ===== 下面三块点击（保留）=====
    onTapTag() {
      console.log("tap: tag");
    },
    onTapPendingReview() {
      this.triggerEvent("openpendingreview");
    },
    onTapDesc() {
      console.log("tap: desc");
    },
    onTapCredit() {
      console.log("tap: credit");
    },

    // ===== Outer2 Segment 切换（保留）=====
    onOuter2TabChange(e) {
      const value = e && e.detail ? e.detail.value : "";
      if (!value) return;
      this.setData({ outer2TabValue: value });

      // 你后续要切换不同列表，就在这换 outer2Posts
      // 现在先不动数据，保证 UI 正常
    },
    onOuter2ReviewTabChange(e) {
      const value = e && e.detail ? e.detail.value : "";
      if (!value) return;
      this.setData({ outer2ReviewTabValue: value });
    },
    
    onTapReviewEventItem(e) {
      const id = e.currentTarget.dataset.id;
      const item = this.data.reviewEventPosts.find(v => v._id === id);
      if (!item) return;
    
      this.triggerEvent("openreviewrate", {
        mode: "activity",
        itemTitle: item.title,
        itemId: item._id
      });
    },
    
    onTapReviewMemberItem(e) {
      const id = e.currentTarget.dataset.id;
      const item = this.data.reviewMemberPosts.find(v => v._id === id);
      if (!item) return;
    
      this.triggerEvent("openreviewrate", {
        mode: "member",
        itemTitle: item.name,
        itemId: item._id
      });
    },
  }
});
