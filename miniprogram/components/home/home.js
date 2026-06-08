const { fetchUserProfile, updateUserProfile, uploadProfileCover } = require("../../api/userProfile");
const { fetchMyOngoingActivityPosts, fetchPendingReviews } = require("../../api/activity");
const { fetchReviewTasks } = require("../../api/review");
const { fetchNotificationUnreadCount } = require("../../api/notification");

Component({
  data: {
    rowH: "160rpx",
    halfRowH: "80rpx",
    twoRowH: "320rpx",
    threeRowH: "480rpx",
    sevenHalfRowH: "1200rpx",

    profile: {
      coverUrl: "https://dummyimage.com/1200x800/2b2b2b/ffffff.png&text=Cover",
      avatarUrl: "https://dummyimage.com/300x300/ffffff/111111.png&text=Avatar",
      name: "MeetFun User",
      userId: "",
      motto: "来吧，让我认识更多有趣的人",
      tags: [],
      stats: {
        myEvents: 0,
        ongoing: 0,
        likes: 0
      }
    },
    profileLoading: false,
    showEditProfile: false,
    editProfileSaving: false,
    editMotto: "",
    editTags: ["", "", ""],
    unreadNotificationCount: 0,
    hasUnreadNotifications: false,
    pendingReviewCount: 0,
    showMoreMenu: false,

    outer2Tabs: [
      { key: "ongoing", label: "活动中" },
      { key: "review", label: "待评价" }
    ],
    outer2TabValue: "ongoing",
    outer2Loading: false,
    reviewTasksLoading: false,
    outer2ReviewTabs: [
      { key: "event", label: "评价活动" },
      { key: "member", label: "评价成员" }
    ],
    outer2ReviewTabValue: "event",

    outer2Posts: [],

    reviewEventPosts: [],
    reviewMemberPosts: []
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

      this.loadProfile();
      this.loadMyOngoingActivities();
      this.loadPendingReviewCount();
      this.loadReviewTasks();
      this.loadNotificationUnreadCount();
    }
  },

  methods: {
    noop() {},

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

    loadProfile() {
      if (this.data.profileLoading) return;
      this.setData({ profileLoading: true });

      fetchUserProfile()
        .then((profile) => {
          this.setData({ profile });
        })
        .catch((err) => {
          console.error("[profile load failed]", err);
        })
        .finally(() => {
          this.setData({ profileLoading: false });
        });
    },

    loadMyOngoingActivities() {
      if (this.data.outer2Loading) return;
      this.setData({ outer2Loading: true });

      fetchMyOngoingActivityPosts({
        page: 1,
        pageSize: 30
      })
        .then((res) => {
          this.setData({
            outer2Posts: res.list || []
          });
        })
        .catch((err) => {
          console.error("[my ongoing activities load failed]", err);
          this.setData({
            outer2Posts: []
          });
        })
        .finally(() => {
          this.setData({ outer2Loading: false });
        });
    },

    loadPendingReviewCount() {
      fetchPendingReviews()
        .then((items) => {
          this.setData({
            pendingReviewCount: (items || []).length
          });
        })
        .catch((err) => {
          console.error("[pending review count load failed]", err);
          this.setData({ pendingReviewCount: 0 });
        });
    },

    loadReviewTasks(mode) {
      if (this.data.reviewTasksLoading) return;

      const requestMode = mode || "";
      this.setData({ reviewTasksLoading: true });

      fetchReviewTasks({ mode: requestMode })
        .then((items) => {
          const tasks = items || [];
          const nextData = {};

          if (!requestMode || requestMode === "activity") {
            nextData.reviewEventPosts = tasks.filter((item) => item.mode === "activity");
          }
          if (!requestMode || requestMode === "member") {
            nextData.reviewMemberPosts = tasks.filter((item) => item.mode === "member");
          }

          this.setData(nextData);
        })
        .catch((err) => {
          console.error("[review tasks load failed]", err);
          const nextData = {};
          if (!requestMode || requestMode === "activity") {
            nextData.reviewEventPosts = [];
          }
          if (!requestMode || requestMode === "member") {
            nextData.reviewMemberPosts = [];
          }
          this.setData(nextData);
        })
        .finally(() => {
          this.setData({ reviewTasksLoading: false });
        });
    },

    loadNotificationUnreadCount() {
      fetchNotificationUnreadCount()
        .then((count) => {
          this.setData({
            unreadNotificationCount: count,
            hasUnreadNotifications: count > 0
          });
        })
        .catch((err) => {
          console.error("[notification unread count load failed]", err);
          this.setData({
            unreadNotificationCount: 0,
            hasUnreadNotifications: false
          });
        });
    },

    updateNotificationUnreadCount(count) {
      const unreadCount = Number(count) || 0;
      this.setData({
        unreadNotificationCount: unreadCount,
        hasUnreadNotifications: unreadCount > 0
      });
    },

    onTapMore() {
      this.setData({ showMoreMenu: true });
    },

    onCloseMoreMenu() {
      this.setData({ showMoreMenu: false });
    },

    onTapReport() {
      wx.showToast({
        title: "举报功能待接入",
        icon: "none"
      });
    },

    onTapFeedback() {
      wx.showToast({
        title: "意见箱待接入",
        icon: "none"
      });
    },

    onTapNotifications() {
      this.triggerEvent("opennotifications");
    },

    onEditProfile() {
      const tags = (this.data.profile.tags || []).slice(0, 3);
      while (tags.length < 3) tags.push("");

      this.setData({
        showEditProfile: true,
        editMotto: this.data.profile.motto || "",
        editTags: tags
      });
    },

    onCloseEditProfile() {
      if (this.data.editProfileSaving) return;
      this.setData({ showEditProfile: false });
    },

    onEditMottoInput(e) {
      this.setData({ editMotto: (e.detail && e.detail.value) || "" });
    },

    onEditTagInput(e) {
      const index = Number(e.currentTarget.dataset.index);
      const value = (e.detail && e.detail.value) || "";
      const editTags = this.data.editTags.slice();
      editTags[index] = value;
      this.setData({ editTags });
    },

    onChooseCover() {
      if (this.data.editProfileSaving) return;

      wx.chooseMedia({
        count: 1,
        mediaType: ["image"],
        sourceType: ["album", "camera"],
        success: (res) => {
          const file = res.tempFiles && res.tempFiles[0];
          const filePath = file && file.tempFilePath;
          if (!filePath) return;

          this.setData({ editProfileSaving: true });
          wx.showLoading({ title: "上传中...", mask: true });

          uploadProfileCover(filePath)
            .then((coverUrl) => {
              this.setData({
                profile: {
                  ...this.data.profile,
                  coverUrl
                }
              });
            })
            .catch((err) => {
              wx.showToast({
                title: err.message || "上传失败",
                icon: "none"
              });
            })
            .finally(() => {
              wx.hideLoading();
              this.setData({ editProfileSaving: false });
            });
        }
      });
    },

    onSaveEditProfile() {
      if (this.data.editProfileSaving) return;

      const tags = (this.data.editTags || [])
        .map((tag) => (tag || "").trim())
        .filter(Boolean);

      if (tags.length > 3) {
        wx.showToast({ title: "标签最多 3 个", icon: "none" });
        return;
      }
      if (tags.some((tag) => tag.length > 10)) {
        wx.showToast({ title: "每个标签最多 10 个字", icon: "none" });
        return;
      }

      this.setData({ editProfileSaving: true });

      updateUserProfile({
        motto: this.data.editMotto,
        tags
      })
        .then((profile) => {
          this.setData({
            profile,
            showEditProfile: false
          });
        })
        .catch((err) => {
          wx.showToast({
            title: err.message || "保存失败",
            icon: "none"
          });
        })
        .finally(() => {
          this.setData({ editProfileSaving: false });
        });
    },

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

    onTapPendingReview() {
      this.triggerEvent("openpendingreview");
    },

    onOuter2TabChange(e) {
      const value = e && e.detail ? e.detail.value : "";
      if (!value) return;
      this.setData({ outer2TabValue: value });
      if (value === "ongoing") {
        this.loadMyOngoingActivities();
      } else if (value === "review") {
        this.loadReviewTasks(this.data.outer2ReviewTabValue === "member" ? "member" : "activity");
      }
    },

    onOuter2ReviewTabChange(e) {
      const value = e && e.detail ? e.detail.value : "";
      if (!value) return;
      this.setData({ outer2ReviewTabValue: value });
      this.loadReviewTasks(value === "member" ? "member" : "activity");
    },

    onTapReviewEventItem(e) {
      const id = e.currentTarget.dataset.id;
      const item = this.data.reviewEventPosts.find((v) => v._id === id);
      if (!item) return;

      this.triggerEvent("openreviewrate", {
        mode: "activity",
        itemTitle: item.title,
        itemId: item._id,
        activityId: item.activityId,
        targetId: item.targetId
      });
    },

    onTapReviewMemberItem(e) {
      const id = e.currentTarget.dataset.id;
      const item = this.data.reviewMemberPosts.find((v) => v._id === id);
      if (!item) return;

      this.triggerEvent("openreviewrate", {
        mode: "member",
        itemTitle: item.name,
        itemId: item._id,
        activityId: item.activityId,
        targetId: item.targetId
      });
    },

    markReviewCompleted(detail) {
      const itemId = detail && detail.itemId;
      const activityId = detail && detail.activityId;
      const targetId = detail && detail.targetId;

      if (detail && detail.mode === "member") {
        this.setData({
          reviewMemberPosts: this.data.reviewMemberPosts.filter((item) => {
            if (itemId && item._id === itemId) return false;
            return !(String(item.activityId) === String(activityId) && String(item.targetId) === String(targetId));
          })
        });
        return;
      }

      this.setData({
        reviewEventPosts: this.data.reviewEventPosts.filter((item) => {
          if (itemId && item._id === itemId) return false;
          return String(item.activityId) !== String(activityId);
        })
      });
    }
  }
});
