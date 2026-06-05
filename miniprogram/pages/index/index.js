const { wechatLogin } = require("../../api/auth");

Page({
  data: {
    isLoggedIn: false,
    loginLoading: false,
    activeTab: "activity",
    showPendingReview: false,
    showReviewRate: false,
    reviewRateMode: "activity",
    reviewRateTitle: "",
    reviewRateItemId: "",
    showSearch: false,
    searchTranslateX: 0,
    searchTransition: "none",
    showPost: false,
    postId: "",
    postTranslateX: 0,
    postTransition: "none",
    showCreatePost: false,
    createPostTranslateX: 0,
    createPostTransition: "none"
  },

  _windowW: 375,
  _postTouchInSwiper: false,

  onLoad() {
    const info = wx.getSystemInfoSync();
    this._windowW = info.windowWidth || 375;

    const token = wx.getStorageSync("token");
    if (token) {
      this.setData({ isLoggedIn: true });
    }
  },

  onLogin() {
    if (this.data.loginLoading) return;

    console.log("[login] tap");
    this.setData({ loginLoading: true });
    wx.showLoading({
      title: "登录中...",
      mask: true
    });

    wx.login({
      success: (loginRes) => {
        console.log("[login] wx.login success", loginRes);
        const code = loginRes && loginRes.code;
        if (!code) {
          wx.hideLoading();
          wx.showToast({
            title: "微信登录失败",
            icon: "none"
          });
          this.setData({ loginLoading: false });
          return;
        }

        wechatLogin({ code })
          .then((user) => {
            console.log("[login] backend success", user);
            if (!user || !user.token) {
              throw new Error("登录响应缺少 token");
            }

            wx.setStorageSync("token", user.token);
            wx.setStorageSync("loginUser", user);
            wx.hideLoading();

            this.setData({
              isLoggedIn: true,
              loginLoading: false,
              activeTab: "activity"
            });
          })
          .catch((err) => {
            console.error("[wechat login failed]", err);
            wx.hideLoading();
            wx.showToast({
              title: err.message || "登录失败",
              icon: "none"
            });
            this.setData({ loginLoading: false });
          });
      },
      fail: (err) => {
        console.error("[wx.login failed]", err);
        wx.hideLoading();
        wx.showToast({
          title: "微信登录失败",
          icon: "none"
        });
        this.setData({ loginLoading: false });
      }
    });
  },

  onActivitySearch() {
    if (this.data.showSearch) return;
    this.onOpenSearch();
  },

  onTabActivity() {
    this.closeSearchImmediately();
    if (this.data.activeTab === "activity") return;
    this.setData({ activeTab: "activity" });
  },

  onTabHome() {
    this.closeSearchImmediately();
    if (this.data.activeTab === "home") return;
    this.setData({ activeTab: "home" });
  },

  onTabPlus() {
    this.closeSearchImmediately();
    if (this.data.showCreatePost) return;
    this.onOpenCreatePost();
  },

  onOpenPendingReview() {
    this.setData({ showPendingReview: true });
  },

  onClosePendingReview() {
    this.setData({ showPendingReview: false });
  },

  onOpenReviewRate(e) {
    const detail = e.detail || {};

    this.setData({
      showReviewRate: true,
      reviewRateMode: detail.mode || "activity",
      reviewRateTitle: detail.itemTitle || "",
      reviewRateItemId: detail.itemId || ""
    });
  },

  onCloseReviewRate() {
    this.setData({ showReviewRate: false });
  },

  onSubmitReviewRate(e) {
    console.log("评分提交：", e.detail);
    this.setData({ showReviewRate: false });
  },

  onOpenPost(e) {
    const id = e && e.detail ? e.detail.id : "";
    const W = this._windowW || 375;

    this.setData({
      showPost: true,
      postId: id,
      postTranslateX: W,
      postTransition: "none"
    });

    setTimeout(() => {
      this.setData({
        postTransition: "transform 260ms ease",
        postTranslateX: 0
      });
    }, 16);
  },

  onPostClose() {
    const W = this._windowW || 375;
    const D = 260;

    this.setData({
      postTransition: `transform ${D}ms ease`,
      postTranslateX: W
    });

    setTimeout(() => {
      this.setData({
        showPost: false,
        postId: "",
        postTranslateX: 0,
        postTransition: "none"
      });
    }, D);
  },

  onPostSwiperTouch(e) {
    const d = e && e.detail;
    this._postTouchInSwiper = !!(d && d.inSwiper);
  },

  onOpenCreatePost() {
    const W = this._windowW || 375;

    this.setData({
      showCreatePost: true,
      createPostTranslateX: W,
      createPostTransition: "none"
    });

    setTimeout(() => {
      this.setData({
        createPostTransition: "transform 260ms ease",
        createPostTranslateX: 0
      });
    }, 16);
  },

  onCreatePostClose() {
    const W = this._windowW || 375;
    const D = 260;

    this.setData({
      createPostTransition: `transform ${D}ms ease`,
      createPostTranslateX: W
    });

    setTimeout(() => {
      this.setData({
        showCreatePost: false,
        createPostTranslateX: 0,
        createPostTransition: "none"
      });
    }, D);
  },

  onOpenSearch() {
    const W = this._windowW || 375;

    this.setData({
      showSearch: true,
      searchTranslateX: W,
      searchTransition: "none"
    });

    setTimeout(() => {
      this.setData({
        searchTransition: "transform 260ms ease",
        searchTranslateX: 0
      });
    }, 16);
  },

  onCloseSearch() {
    const W = this._windowW || 375;
    const D = 260;

    this.setData({
      searchTransition: `transform ${D}ms ease`,
      searchTranslateX: W
    });

    setTimeout(() => {
      this.setData({
        showSearch: false,
        searchTranslateX: 0,
        searchTransition: "none"
      });
    }, D);
  },

  closeSearchImmediately() {
    if (!this.data.showSearch) return;
    this.setData({
      showSearch: false,
      searchTranslateX: 0,
      searchTransition: "none"
    });
  },
  
  onDoSearch(e) {
    const keyword = e.detail.keyword || "";
    console.log("搜索词：", keyword);
  }
});
