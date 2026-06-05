const { fetchActivityPosts, updateActivityLike } = require("../../api/activity");

Component({
  data: {
    posts: [],
    navOptions: [
      { key: "day", label: "\u672c\u65e5" },
      { key: "week", label: "\u672c\u5468" },
      { key: "month", label: "\u672c\u6708" }
    ],
    navValue: "day",
    loading: false,
    refreshing: false,
    requestError: ""
  },

  lifetimes: {
    attached() {
      this.loadActivityPosts({
        range: this.data.navValue,
        refresh: true,
        source: "init"
      });
    }
  },

  methods: {
    onSearchTap() {
      this.triggerEvent("search");
    },

    onNavChange(e) {
      const value = e && e.detail ? e.detail.value : "";
      if (!value) return;
      if (value === this.data.navValue && this.data.loading) return;

      this.setData({ navValue: value });
      this.loadActivityPosts({
        range: value,
        refresh: true,
        source: "tab"
      });
    },

    onRefresh() {
      this.loadActivityPosts({
        range: this.data.navValue,
        refresh: true,
        source: "pull"
      });
    },

    loadActivityPosts(options) {
      const { range, refresh, source } = options || {};
      const targetRange = range || this.data.navValue || "day";

      this.setData({
        loading: true,
        refreshing: !!refresh,
        requestError: ""
      });

      return fetchActivityPosts({
        range: targetRange,
        page: 1,
        pageSize: 20,
        refresh: !!refresh
      }).then((res) => {
        this.setData({
          posts: res.list || [],
          loading: false,
          refreshing: false
        });
      }).catch((err) => {
        console.error("[activity posts request failed]", source, targetRange, err);
        this.setData({
          loading: false,
          refreshing: false,
          requestError: "\u6d3b\u52a8\u52a0\u8f7d\u5931\u8d25"
        });
        wx.showToast({
          title: "\u6d3b\u52a8\u52a0\u8f7d\u5931\u8d25",
          icon: "none"
        });
      });
    },

    onTapCard(e) {
      const id = e.detail && e.detail.id;
      if (!id) return;
      this.triggerEvent("openpost", { id });
    },

    onLikeChange(e) {
      const detail = e.detail || {};
      const id = detail.id;
      if (!id) return;

      const previousPosts = this.data.posts || [];
      const posts = previousPosts.map((item) => {
        if (item._id !== id && item.id !== id) return item;
        return {
          ...item,
          liked: detail.liked,
          likeCount: detail.likeCount
        };
      });

      this.setData({ posts });
      this.triggerEvent("likechange", detail);

      updateActivityLike({
        id,
        liked: detail.liked
      }).catch((err) => {
        console.error("[activity like request failed]", id, err);
        this.setData({ posts: previousPosts });
        wx.showToast({
          title: "\u70b9\u8d5e\u540c\u6b65\u5931\u8d25",
          icon: "none"
        });
      });
    }
  }
});
