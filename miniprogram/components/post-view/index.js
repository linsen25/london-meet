Component({
  properties: {
    postId: {
      type: String,
      value: ''
    }
  },

  data: {
    images: [
      'https://dummyimage.com/600x400/ddd/333.png&text=IMG+1',
      'https://dummyimage.com/600x400/ddd/333.png&text=IMG+2',
      'https://dummyimage.com/600x400/ddd/333.png&text=IMG+3',
      'https://dummyimage.com/600x400/ddd/333.png&text=IMG+4'
    ],
    title: '活动标题（示例）',
    progressText: '进度：报名中（示例）',
    desc:
      '这里是活动表述（示例）。文字会自动换行，最多显示两行，超出会省略。你之后把内容换成真实数据即可。这里是活动表述（示例）。文字会自动换行，最多显示两行，超出会省略。你之后把内容换成真实数据即可。这里是活动表述（示例）。文字会自动换行，最多显示两行，超出会省略。你之后把内容换成真实数据即可。这里是活动表述（示例）。文字会自动换行，最多显示两行，超出会省略。你之后把内容换成真实数据即可。',
    address: '123 Example St, London, ON（示例）',
    joinedCount: 23,
    totalCount: 50,
    remainText: '还剩 2 天 18 小时',
    startAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    endAt: Date.now() + 3 * 24 * 60 * 60 * 1000,
    applyStage: 0,
    applyTexts: ['报名', '审核中', '加入群聊'],
    showGroupPopup: false,
    groupQrUrl: 'https://dummyimage.com/440x440/ddd/333.png&text=QR'
  },

  methods: {
    onBackTap() {
      this.triggerEvent('close');
    },

    onCopyAddress() {
      const text = this.data.address || '';
      wx.setClipboardData({
        data: text,
        success: () => {
          wx.showToast({ title: '已复制', icon: 'none' });
        }
      });
    },

    onDescInput(e) {
      this.setData({ desc: e.detail.value });
    },

    onApply() {
      const stage = this.data.applyStage || 0;
      if (stage === 0) {
        this.setData({ applyStage: 1 });
        if (this._applyTimer) {
          clearTimeout(this._applyTimer);
        }
        this._applyTimer = setTimeout(() => {
          this.setData({ applyStage: 2 });
        }, 2000);
        return;
      }
      if (stage === 1) {
        return;
      }
      this.setData({ showGroupPopup: true });
    },

    onCloseGroupPopup() {
      this.setData({ showGroupPopup: false });
    }
  }
});
