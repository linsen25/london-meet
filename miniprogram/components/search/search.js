const { searchActivities } = require("../../api/search");

function buildTagMap(tags) {
  return (tags || []).reduce((map, tag) => {
    map[tag] = true;
    return map;
  }, {});
}

Component({
  data: {
    keyword: "",
    hotTags: ["摄影", "羽毛球", "桌游", "健身", "探店", "自习", "露营", "电影"],
    selectedTags: [],
    selectedTagsMap: {},
    showResult: false,
    searching: false,
    skeletonItems: [1, 2, 3, 4],
    resultPosts: []
  },

  methods: {
    onBackTap() {
      this.triggerEvent("close");
    },

    onInput(e) {
      this.setData({
        keyword: e.detail.value || ""
      });
    },

    onTagTap(e) {
      const tag = e.currentTarget.dataset.tag || "";
      if (!tag) return;

      const selected = this.data.selectedTags || [];
      const exists = selected.indexOf(tag) >= 0;
      const next = exists
        ? selected.filter((item) => item !== tag)
        : selected.concat(tag);

      this.setData({
        selectedTags: next,
        selectedTagsMap: buildTagMap(next)
      });
    },

    onSearchTap() {
      const keyword = (this.data.keyword || "").trim();
      const tags = this.data.selectedTags || [];

      this.setData({
        showResult: true,
        searching: true
      });

      // TODO(api): 这里请求搜索活动结果。
      // 请求参数：keyword=输入框文字；tags=已选热点标签数组。
      // 返回结果按活动瀑布流卡片字段渲染到 resultPosts。
      return searchActivities({
        keyword,
        tags,
        page: 1,
        pageSize: 20
      }).then((res) => {
        this.setData({
          resultPosts: res.list || [],
          searching: false
        });

        this.triggerEvent("search", { keyword, tags });
      }).catch((err) => {
        console.error("[search request failed]", err);
        this.setData({ searching: false });
        wx.showToast({
          title: "搜索失败",
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

      const resultPosts = (this.data.resultPosts || []).map((item) => {
        if (item._id !== id && item.id !== id) return item;
        return {
          ...item,
          liked: detail.liked,
          likeCount: detail.likeCount
        };
      });

      this.setData({ resultPosts });
      this.triggerEvent("likechange", detail);
    }
  }
});
