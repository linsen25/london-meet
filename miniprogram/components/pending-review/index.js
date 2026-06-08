const {
  approveActivityRegistration,
  fetchPendingReviews,
  rejectActivityRegistration
} = require("../../api/activity");

Component({
  lifetimes: {
    attached() {
      this.loadPendingReviews();
    }
  },

  data: {
    reviewers: [],
    loading: false,
    actingId: null
  },

  methods: {
    onBack() {
      this.triggerEvent("close");
    },

    loadPendingReviews() {
      this.setData({ loading: true });

      fetchPendingReviews()
        .then((reviewers) => {
          this.setData({
            reviewers: reviewers || []
          });
        })
        .catch((err) => {
          wx.showToast({
            title: (err && err.message) || "待审核列表加载失败",
            icon: "none"
          });
        })
        .finally(() => {
          this.setData({ loading: false });
        });
    },

    onApprove(e) {
      const id = e.currentTarget.dataset.id;
      if (!id || this.data.actingId) return;

      wx.showModal({
        title: "确认通过审核？",
        content: "通过后，该成员将可以加入群聊。",
        confirmText: "通过",
        cancelText: "取消",
        success: (res) => {
          if (res.confirm) {
            this.reviewRegistration(id, approveActivityRegistration, "已通过");
          }
        }
      });
    },

    onReject(e) {
      const id = e.currentTarget.dataset.id;
      if (!id || this.data.actingId) return;

      wx.showModal({
        title: "确认拒绝报名？",
        content: "拒绝后，该成员将无法加入该活动群聊。",
        confirmText: "拒绝",
        confirmColor: "#FF3B30",
        cancelText: "取消",
        success: (res) => {
          if (res.confirm) {
            this.reviewRegistration(id, rejectActivityRegistration, "已拒绝");
          }
        }
      });
    },

    reviewRegistration(id, action, successText) {
      this.setData({ actingId: id });

      action(id)
        .then(() => {
          this.setData({
            reviewers: this.data.reviewers.filter((item) => String(item.registrationId) !== String(id))
          });
          wx.showToast({
            title: successText,
            icon: "none"
          });
        })
        .catch((err) => {
          wx.showToast({
            title: (err && err.message) || "操作失败",
            icon: "none"
          });
        })
        .finally(() => {
          this.setData({ actingId: null });
        });
    }
  }
});
