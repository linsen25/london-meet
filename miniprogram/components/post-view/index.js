const {
  applyActivity,
  fetchActivityDetail,
  joinActivityGroup
} = require("../../api/activity");

const FALLBACK_IMAGE = "https://dummyimage.com/600x400/ddd/333.png&text=IMG";
const FALLBACK_QR = "https://dummyimage.com/440x440/ddd/333.png&text=QR";

function pad(value) {
  return String(value).padStart(2, "0");
}

function formatDateParts(ts) {
  if (!ts) {
    return { date: "", time: "" };
  }

  const d = new Date(ts);
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`
  };
}

function buildRemainText(endAt) {
  const remain = Number(endAt) - Date.now();
  if (!Number.isFinite(remain) || remain <= 0) {
    return "已结束";
  }

  const totalHours = Math.floor(remain / (60 * 60 * 1000));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  if (days > 0) {
    return `还剩 ${days} 天 ${hours} 小时`;
  }
  return `还剩 ${Math.max(1, hours)} 小时`;
}

Component({
  properties: {
    postId: {
      type: String,
      value: "",
      observer(value) {
        if (value) {
          this.loadDetail(value);
        }
      }
    }
  },

  lifetimes: {
    attached() {
      if (this.data.postId) {
        this.loadDetail(this.data.postId);
      }
    },

    detached() {
      if (this._applyTimer) {
        clearTimeout(this._applyTimer);
      }
    }
  },

  data: {
    loading: false,
    applying: false,
    images: [FALLBACK_IMAGE],
    title: "",
    desc: "",
    address: "",
    joinedCount: 0,
    totalCount: 0,
    progressPct: -1,
    remainText: "",
    startAt: 0,
    endAt: 0,
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    registrationStatus: "",
    noticeCode: null,
    isFull: false,
    applyText: "报名",
    applyDisabled: false,
    applyBg: "#07C160",
    showGroupPopup: false,
    groupQrUrl: FALLBACK_QR,
    mapImgUrl: ""
  },

  methods: {
    loadDetail(id) {
      if (!id) return;

      this.setData({ loading: true });

      fetchActivityDetail(id)
        .then((detail) => {
          this.applyDetail(detail);
        })
        .catch((err) => {
          console.error("[activity detail request failed]", id, err);
          wx.showToast({
            title: (err && err.message) || "活动详情加载失败",
            icon: "none"
          });
        })
        .finally(() => {
          this.setData({ loading: false });
        });
    },

    applyDetail(detail) {
      const start = formatDateParts(detail.startAt);
      const end = formatDateParts(detail.endAt);
      const totalCount = Number(detail.totalCount) || 0;
      const joinedCount = Number(detail.joinedCount) || 0;

      this.setData({
        images: detail.imageUrls && detail.imageUrls.length ? detail.imageUrls : [FALLBACK_IMAGE],
        title: detail.title || "",
        desc: detail.content || "",
        address: detail.locationText || "",
        joinedCount,
        totalCount,
        progressPct: -1,
        remainText: buildRemainText(detail.endAt),
        startAt: detail.startAt || 0,
        endAt: detail.endAt || 0,
        startDate: start.date,
        startTime: start.time,
        endDate: end.date,
        endTime: end.time,
        registrationStatus: detail.registrationStatus || "",
        noticeCode: detail.noticeCode,
        isFull: !!detail.full,
        groupQrUrl: detail.inviteQrUrl || FALLBACK_QR,
        mapImgUrl: detail.mapImageUrl || ""
      }, () => this.syncApplyState());
    },

    syncApplyState() {
      const status = this.data.registrationStatus;
      const isFull = this.data.isFull;
      let applyText = "报名";
      let applyDisabled = false;
      let applyBg = "#07C160";

      if (status === "pending") {
        applyText = "审核中";
        applyDisabled = true;
        applyBg = "#8E8E93";
      } else if (status === "approved") {
        applyText = "加入群聊";
      } else if (status === "joined_group") {
        applyText = "已加入群聊";
      } else if (isFull) {
        applyText = "人员已满";
        applyDisabled = true;
        applyBg = "#8E8E93";
      }

      this.setData({
        applyText,
        applyDisabled,
        applyBg
      });
    },

    onBackTap() {
      this.triggerEvent("close");
    },

    onCopyAddress() {
      const text = this.data.address || "";
      if (!text) return;

      wx.setClipboardData({
        data: text,
        success: () => {
          wx.showToast({
            title: "已复制",
            icon: "none"
          });
        }
      });
    },

    onApply() {
      if (this.data.applyDisabled || this.data.applying) return;

      const status = this.data.registrationStatus;
      if (status === "approved" || status === "joined_group") {
        this.openGroupPopup();
        return;
      }

      const id = this.data.postId;
      if (!id) return;

      this.setData({ applying: true });
      applyActivity(id)
        .then((registration) => {
          this.setData({
            registrationStatus: registration.status || "pending",
            noticeCode: registration.noticeCode == null ? this.data.noticeCode : registration.noticeCode
          }, () => this.syncApplyState());
          wx.showToast({
            title: "已提交申请",
            icon: "none"
          });
        })
        .catch((err) => {
          wx.showToast({
            title: (err && err.message) || "报名失败",
            icon: "none"
          });
        })
        .finally(() => {
          this.setData({ applying: false });
        });
    },

    openGroupPopup() {
      const id = this.data.postId;
      this.setData({ showGroupPopup: true });

      if (!id || this.data.registrationStatus === "joined_group") {
        return;
      }

      joinActivityGroup(id)
        .then((registration) => {
          this.setData({
            registrationStatus: registration.status || "joined_group",
            noticeCode: registration.noticeCode == null ? this.data.noticeCode : registration.noticeCode
          }, () => this.syncApplyState());
        })
        .catch((err) => {
          console.error("[join activity group failed]", id, err);
        });
    },

    onCloseGroupPopup() {
      this.setData({
        showGroupPopup: false
      });
    },

    onPreviewMap() {
      const url = this.data.mapImgUrl;
      if (!url) return;

      wx.previewImage({
        urls: [url]
      });
    },

    onSwiperTouchStart() {
      this.triggerEvent("swipertouch", { inSwiper: true });
    },

    onSwiperTouchEnd() {
      this.triggerEvent("swipertouch", { inSwiper: false });
    }
  }
});
