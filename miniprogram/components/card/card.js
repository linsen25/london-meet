const FALLBACK_COVER = "https://dummyimage.com/600x800/3a3a3a/ffffff.png&text=cover";
const FALLBACK_AVATAR = "https://dummyimage.com/100x100/555555/ffffff.png&text=U";

function toCount(value) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
}

Component({
  properties: {
    data: {
      type: Object,
      value: {}
    }
  },

  data: {
    coverSrc: FALLBACK_COVER,
    coverLoaded: false,
    avatarSrc: FALLBACK_AVATAR,
    displayTitle: "",
    progressPct: -1,
    innerLiked: false,
    innerLikeCount: 0
  },

  observers: {
    "data": function(value) {
      this.syncCardData(value || {});
    }
  },

  lifetimes: {
    attached() {
      this.syncCardData(this.data.data || {});
    }
  },

  methods: {
    syncCardData(card) {
      const coverSrc = card.coverUrl || FALLBACK_COVER;
      const coverChanged = coverSrc !== this.data.coverSrc;

      this.setData({
        coverSrc,
        coverLoaded: coverChanged ? false : this.data.coverLoaded,
        avatarSrc: card.avatarUrl || FALLBACK_AVATAR,
        displayTitle: card.title || "未命名活动",
        progressPct: this.resolveProgressPct(card),
        innerLiked: !!card.liked,
        innerLikeCount: toCount(card.likeCount)
      });
    },

    onCoverLoad() {
      this.setData({ coverLoaded: true });
    },

    onCoverError() {
      if (this.data.coverSrc === FALLBACK_COVER) {
        this.setData({ coverLoaded: true });
        return;
      }

      this.setData({
        coverSrc: FALLBACK_COVER,
        coverLoaded: false
      });
    },

    resolveProgressPct(card) {
      const raw = card.progressPct == null ? card.progressPercent : card.progressPct;
      const n = Number(raw);
      if (!Number.isFinite(n) || n < 0) return -1;
      return Math.max(0, Math.min(100, Math.round(n)));
    },

    onTap() {
      const d = this.data.data || {};
      const id = d._id || d.id;
      if (!id) return;

      this.triggerEvent("tapcard", { id });
    },

    onLikeTap() {
      const d = this.data.data || {};
      const id = d._id || d.id;
      const liked = !this.data.innerLiked;
      const likeCount = Math.max(0, this.data.innerLikeCount + (liked ? 1 : -1));

      this.setData({
        innerLiked: liked,
        innerLikeCount: likeCount
      });

      this.triggerEvent("likechange", {
        id,
        liked,
        likeCount
      });
    }
  }
});
