/**
 * ============================================
 * Component: Activity（Main 左屏）
 * 职责：
 * - 仅负责 Activity UI
 * - 不处理全局切屏手势（由 pages/index 统一管理）
 *
 * 事件协议（由 Index 接收）：
 * - search   -> 打开 Search 页
 * - settings -> 打开左侧 Settings 面板
 * - openpost -> (可选) 点击卡片抛出 {id} 给父级
 * ============================================
 */
const { fetchActivityPosts, updateActivityLike } = require('../../api/activity');

const now = Date.now();
const day = 24 * 60 * 60 * 1000;

Component({
  data: {
    // 先用 mock，后面你接数据库/云函数只替换这里
    posts: [
      {
        _id: 'a1',
        title: '活动帖子 1（示例）延长延长延长',
        authorName: 'Alice',
        likeCount: 12,
        coverUrl: 'https://dummyimage.com/600x800/ddd/111.png&text=cover',
        avatarUrl: 'https://dummyimage.com/100x100/ddd/111.png&text=A',
        startAt: now - day * 2,
        endAt: now + day * 5,
        progressGif: ''
      },
      {
        _id: 'a2',
        title: '活动帖子 2（示例）',
        authorName: 'Bob',
        likeCount: 34,
        coverUrl: 'https://dummyimage.com/600x800/ddd/111.png&text=cover',
        avatarUrl: 'https://dummyimage.com/100x100/ddd/111.png&text=B',
        startAt: now - day * 1,
        endAt: now + day * 4,
        progressGif: ''
      },
      {
        _id: 'a3',
        title: '活动帖子 3（示例）',
        authorName: 'Cindy',
        likeCount: 56,
        coverUrl: 'https://dummyimage.com/600x800/ddd/111.png&text=cover',
        avatarUrl: 'https://dummyimage.com/100x100/ddd/111.png&text=C',
        startAt: now - day * 3,
        endAt: now + day * 2,
        progressGif: ''
      },
      {
        _id: 'a4',
        title: '活动帖子 4（示例）',
        authorName: 'David',
        likeCount: 78,
        coverUrl: 'https://dummyimage.com/600x800/ddd/111.png&text=cover',
        avatarUrl: 'https://dummyimage.com/100x100/ddd/111.png&text=D',
        startAt: now - day * 2,
        endAt: now + day * 1,
        progressGif: ''
      },
      {
        _id: 'a5',
        title: '活动帖子 5（示例）',
        authorName: 'Evan',
        likeCount: 90,
        coverUrl: 'https://dummyimage.com/600x800/ddd/111.png&text=cover',
        avatarUrl: 'https://dummyimage.com/100x100/ddd/111.png&text=E',
        startAt: now - day * 4,
        endAt: now + day * 6,
        progressGif: ''
      },
      {
        _id: 'a6',
        title: '活动帖子 6（示例）',
        authorName: 'Fiona',
        likeCount: 21,
        coverUrl: 'https://dummyimage.com/600x800/ddd/111.png&text=cover',
        avatarUrl: 'https://dummyimage.com/100x100/ddd/111.png&text=F',
        startAt: now - day * 1,
        endAt: now + day * 3,
        progressGif: ''
      },
      {
        _id: 'a7',
        title: '活动帖子 7（示例）延长延长延长延长延长延长延长延长延长延长延长延长',
        authorName: 'Gina',
        likeCount: 43,
        coverUrl: 'https://dummyimage.com/600x800/ddd/111.png&text=cover',
        avatarUrl: 'https://dummyimage.com/100x100/ddd/111.png&text=G',
        startAt: now - day * 2,
        endAt: now + day * 7,
        progressGif: ''
      },
      {
        _id: 'a8',
        title: '活动帖子 8（示例）',
        authorName: 'Henry',
        likeCount: 65,
        coverUrl: 'https://dummyimage.com/600x800/ddd/111.png&text=cover',
        avatarUrl: 'https://dummyimage.com/100x100/ddd/111.png&text=H',
        startAt: now - day * 5,
        endAt: now + day * 2,
        progressGif: ''
      },
      {
        _id: 'a9',
        title: '活动帖子 9（示例）',
        authorName: 'Iris',
        likeCount: 87,
        coverUrl: 'https://dummyimage.com/600x800/ddd/111.png&text=cover',
        avatarUrl: 'https://dummyimage.com/100x100/ddd/111.png&text=I',
        startAt: now - day * 3,
        endAt: now + day * 5,
        progressGif: ''
      },
      {
        _id: 'a10',
        title: '活动帖子 10（示例）',
        authorName: 'Jack',
        likeCount: 109,
        coverUrl: 'https://dummyimage.com/600x800/ddd/111.png&text=cover',
        avatarUrl: 'https://dummyimage.com/100x100/ddd/111.png&text=J',
        startAt: now - day * 2,
        endAt: now + day * 4,
        progressGif: ''
      }
    ],
    navOptions: [
      { key: 'day', label: '本日' },
      { key: 'week', label: '本周' },
      { key: 'month', label: '本月' }
    ],
    navValue: 'day',
    loading: false,
    refreshing: false,
    requestError: ''
  },

  lifetimes: {
    attached() {
      this.loadActivityPosts({
        range: this.data.navValue,
        refresh: true,
        source: 'init'
      });
    }
  },

  methods: {
    onSearchTap() {
      this.triggerEvent('search');
    },

    onNavChange(e) {
      const value = e && e.detail ? e.detail.value : '';
      if (!value) return;
      if (value === this.data.navValue && this.data.loading) return;

      this.setData({ navValue: value });
      this.loadActivityPosts({
        range: value,
        refresh: true,
        source: 'tab'
      });
    },

    onRefresh() {
      this.loadActivityPosts({
        range: this.data.navValue,
        refresh: true,
        source: 'pull'
      });
    },

    loadActivityPosts(options) {
      const { range, refresh, source } = options || {};
      const targetRange = range || this.data.navValue || 'day';

      this.setData({
        loading: true,
        refreshing: !!refresh,
        requestError: ''
      });

      // TODO(api): 这里请求活动页瀑布流。
      // source=init 首次进入；source=tab 切换本日/本周/本月；source=pull 下拉刷新。
      // 当前策略：切换和下拉都重新请求。后面如需缓存，可按 range 做本地缓存，
      // 但下拉刷新建议始终 refresh=true，强制向后端取最新数据。
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
        console.error('[activity posts request failed]', source, targetRange, err);
        this.setData({
          loading: false,
          refreshing: false,
          requestError: '活动加载失败'
        });
        wx.showToast({
          title: '活动加载失败',
          icon: 'none'
        });
      });
    },

    onTapCard(e) {
      const id = e.detail && e.detail.id;
      if (!id) return;
      this.triggerEvent('openpost', { id });
    },

    onLikeChange(e) {
      const detail = e.detail || {};
      const id = detail.id;
      if (!id) return;

      const posts = (this.data.posts || []).map((item) => {
        if (item._id !== id && item.id !== id) return item;
        return {
          ...item,
          liked: detail.liked,
          likeCount: detail.likeCount
        };
      });

      this.setData({ posts });
      this.triggerEvent('likechange', detail);

      // TODO(api): 这里请求点赞/取消点赞，后端应返回最终 liked 和 likeCount。
      // 当前先乐观更新 UI，失败时只提示；接后端后可按返回值校准本地 posts。
      updateActivityLike({
        id,
        liked: detail.liked
      }).catch((err) => {
        console.error('[activity like request failed]', id, err);
        wx.showToast({
          title: '点赞同步失败',
          icon: 'none'
        });
      });
    }
  }
});
