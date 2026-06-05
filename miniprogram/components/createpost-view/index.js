const FIXED_TAGS = [
  { id: 1, name: "摄影" },
  { id: 2, name: "运动" },
  { id: 3, name: "学习" },
  { id: 4, name: "美食" },
  { id: 5, name: "旅行" },
  { id: 6, name: "社交" },
  { id: 7, name: "音乐" },
  { id: 8, name: "健身" },
  { id: 9, name: "露营" },
  { id: 10, name: "桌游" },
  { id: 11, name: "电影" },
  { id: 12, name: "跑步" }
];

function buildTagList(selectedMap) {
  const map = selectedMap || {};
  return FIXED_TAGS.map((tag) => ({
    ...tag,
    selected: !!map[tag.id]
  }));
}

Component({
  data: {
    fileList: [],
    previewImages: [],
    hasImages: false,
    maxCount: 4,
    maxSize: 5 * 1024 * 1024,

    title: "",
    content: "",
    lastTitle: "",
    lastContent: "",
    titleFocus: false,
    contentFocus: false,
    titleMaxChars: 30,
    contentMaxChars: 400,
    titleMaxLines: 2,
    contentMaxLines: 12,

    tagIds: [],
    tagsDisplay: "请选择活动标签",
    showTagPicker: false,
    tagMax: 10,
    allTags: FIXED_TAGS,
    filteredTags: buildTagList({}),
    selectedTags: [],
    selectedTagMap: {},

    recruitCount: "",
    recruitDisplay: "请选择人数",
    showRecruitPicker: false,
    recruitColumns: [],

    startTime: "",
    endTime: "",
    startTimeDisplay: "请选择开始时间",
    endTimeDisplay: "请选择结束时间",
    showTimePicker: false,
    activeTimeField: "",
    timePickerTitle: "选择时间",
    timeColumns: [],

    inviteFileList: [],
    inviteDisplay: "请上传群二维码（可选）",

    locationText: "",
    locationDisplay: "",
    mapImageUrl: "",
    locationDebounceTimer: null,

    showCalendar: false,
    dateRange: null,
    dateText: "请选择开始和结束日期",
    minDate: 0,
    maxDate: 0
  },

  lifetimes: {
    attached() {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const max = today + 30 * 24 * 60 * 60 * 1000;
      const recruitColumns = [];

      for (let i = 1; i <= 50; i++) {
        recruitColumns.push(`${i}人`);
      }
      recruitColumns.push("不限");

      const hourColumns = [];
      for (let i = 1; i <= 12; i++) {
        hourColumns.push(String(i).padStart(2, "0"));
      }

      const minuteColumns = [];
      for (let i = 0; i < 60; i++) {
        minuteColumns.push(String(i).padStart(2, "0"));
      }

      this.setData({
        minDate: today,
        maxDate: max,
        recruitColumns,
        timeColumns: [
          { values: hourColumns },
          { values: minuteColumns },
          { values: ["AM", "PM"] }
        ]
      });
    },

    detached() {
      if (this.locationDebounceTimer) clearTimeout(this.locationDebounceTimer);
    }
  },

  methods: {
    onBackTap() {
      this.triggerEvent("close");
    },

    _syncPreviewImages() {
      const previewImages = (this.data.fileList || [])
        .filter((item) => !!item.url)
        .map((item) => ({ url: item.url }));

      this.setData({
        previewImages,
        hasImages: previewImages.length > 0
      });
    },

    beforeRead(e) {
      const detail = (e && e.detail) || {};
      const files = Array.isArray(detail.file) ? detail.file : [detail.file];
      const ok = files.every((file) => String((file && file.type) || "").includes("image"));

      if (typeof detail.callback === "function") detail.callback(ok);
      if (!ok) wx.showToast({ title: "只允许上传图片", icon: "none" });
    },

    afterRead(e) {
      const detail = (e && e.detail) || {};
      const files = Array.isArray(detail.file) ? detail.file : [detail.file];
      const fileList = this.data.fileList || [];
      const remain = (this.data.maxCount || 4) - fileList.length;
      const picked = files.slice(0, Math.max(0, remain));

      const appended = picked.map((file) => ({
        url: file.url,
        name: file.name || "",
        type: "image",
        status: "done"
      }));

      this.setData({ fileList: fileList.concat(appended) }, () => this._syncPreviewImages());

      if (files.length > remain) {
        wx.showToast({ title: `最多只能选 ${this.data.maxCount} 张`, icon: "none" });
      }
    },

    onDelete(e) {
      const index = Number(e && e.detail ? e.detail.index : -1);
      if (index < 0) return;

      const list = (this.data.fileList || []).slice();
      list.splice(index, 1);
      this.setData({ fileList: list }, () => this._syncPreviewImages());
    },

    onOversize() {
      wx.showToast({ title: "图片太大了", icon: "none" });
    },

    onTitleLineChange(e) {
      const lines = e.detail.lineCount || 1;
      this.setData(lines > this.data.titleMaxLines ? { title: this.data.lastTitle } : { lastTitle: this.data.title });
    },

    onContentLineChange(e) {
      const lines = e.detail.lineCount || 1;
      this.setData(lines > this.data.contentMaxLines ? { content: this.data.lastContent } : { lastContent: this.data.content });
    },

    focusTitle() {
      this.setData({ titleFocus: true, contentFocus: false });
    },

    focusContent() {
      this.setData({ titleFocus: false, contentFocus: true });
    },

    onTitleInput(e) {
      this.setData({ title: e.detail.value || "" });
    },

    onContentInput(e) {
      this.setData({ content: e.detail.value || "" });
    },

    onInviteAfterRead(e) {
      const detail = (e && e.detail) || {};
      const files = Array.isArray(detail.file) ? detail.file : [detail.file];
      const first = files[0];
      if (!first) return;

      this.setData({
        inviteFileList: [{
          url: first.url,
          name: first.name || "",
          type: "image",
          status: "done"
        }],
        inviteDisplay: "已上传群二维码"
      });
    },

    onInviteDelete() {
      this.setData({
        inviteFileList: [],
        inviteDisplay: "请上传群二维码（可选）"
      });
    },

    onTapRecruitRow() {
      this.setData({ showRecruitPicker: true });
    },

    onCloseRecruitPicker() {
      this.setData({ showRecruitPicker: false });
    },

    onConfirmRecruitPicker(event) {
      const value = event.detail.value || "";
      this.setData({
        recruitCount: value,
        recruitDisplay: value || "请选择人数",
        showRecruitPicker: false
      });
    },

    onTapStartTimeRow() {
      this.setData({
        showTimePicker: true,
        activeTimeField: "start",
        timePickerTitle: "选择开始时间"
      });
    },

    onTapEndTimeRow() {
      this.setData({
        showTimePicker: true,
        activeTimeField: "end",
        timePickerTitle: "选择结束时间"
      });
    },

    onCloseTimePicker() {
      this.setData({ showTimePicker: false, activeTimeField: "" });
    },

    onConfirmTimePicker(event) {
      const value = this._parsePickerValue(event);
      if (!value) {
        this.onCloseTimePicker();
        return;
      }

      const [hour, minute, period] = value;
      const timeText = `${hour}:${minute} ${period}`;
      const field = this.data.activeTimeField;
      const next = { showTimePicker: false, activeTimeField: "" };

      if (field === "start") {
        next.startTime = timeText;
        next.startTimeDisplay = timeText;
      } else if (field === "end") {
        next.endTime = timeText;
        next.endTimeDisplay = timeText;
      }

      this.setData(next);
    },

    _parsePickerValue(event) {
      const detail = (event && event.detail) || {};
      const raw = Array.isArray(detail.value) ? detail.value : [];
      if (!raw.length) return null;

      const value = raw.map((item) => {
        if (item && typeof item === "object") {
          return item.name || item.text || item.value || "";
        }
        return item;
      });

      return value.length >= 3 ? value.slice(0, 3) : null;
    },

    onOpenTagPicker() {
      this.setData({
        showTagPicker: true,
        filteredTags: buildTagList(this.data.selectedTagMap)
      });
    },

    onCloseTagPicker() {
      this.setData({
        showTagPicker: false,
        filteredTags: buildTagList(this.data.selectedTagMap)
      });
    },

    onToggleTag(e) {
      const id = Number(e && e.currentTarget && e.currentTarget.dataset ? e.currentTarget.dataset.id : 0);
      if (!id) return;

      const all = this.data.allTags || [];
      const tag = all.find((item) => item.id === id);
      if (!tag) return;

      const map = { ...(this.data.selectedTagMap || {}) };
      const ids = (this.data.tagIds || []).slice();
      const selected = (this.data.selectedTags || []).slice();
      const max = this.data.tagMax || 10;

      if (map[id]) {
        delete map[id];
        const idIndex = ids.indexOf(id);
        if (idIndex >= 0) ids.splice(idIndex, 1);
        const tagIndex = selected.findIndex((item) => item.id === id);
        if (tagIndex >= 0) selected.splice(tagIndex, 1);
      } else {
        if (ids.length >= max) {
          wx.showToast({ title: `最多选择 ${max} 个标签`, icon: "none" });
          return;
        }
        map[id] = true;
        ids.push(id);
        selected.push(tag);
      }

      this.setData({
        tagIds: ids,
        selectedTags: selected,
        selectedTagMap: map,
        filteredTags: buildTagList(map)
      });
    },

    onClearTags() {
      this.setData({
        tagIds: [],
        selectedTags: [],
        selectedTagMap: {},
        filteredTags: buildTagList({}),
        tagsDisplay: "请选择活动标签"
      });
    },

    onConfirmTags() {
      const names = (this.data.selectedTags || []).map((item) => item.name);
      this.setData({
        tagsDisplay: names.length ? names.join(" ") : "请选择活动标签"
      });
      this.onCloseTagPicker();
    },

    onOpenCalendar() {
      this.setData({ showCalendar: true });
    },

    onCloseCalendar() {
      this.setData({ showCalendar: false });
    },

    onConfirmCalendar(e) {
      const detail = e && e.detail;
      let start = null;
      let end = null;

      if (Array.isArray(detail) && detail.length >= 2) {
        start = detail[0];
        end = detail[1];
      } else if (detail && detail.start && detail.end) {
        start = detail.start;
        end = detail.end;
      }

      if (!start || !end) {
        this.setData({ showCalendar: false });
        return;
      }

      this.setData({
        showCalendar: false,
        dateRange: [start, end],
        dateText: `${this._fmtDate(start)} - ${this._fmtDate(end)}`
      });
    },

    _fmtDate(ts) {
      const d = new Date(ts);
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${mm}/${dd}`;
    },

    _sanitizeLocationText(value) {
      return String(value || "").trim();
    },

    _normalizeMapLocation(value) {
      return String(value || "").replace(/\s+/g, " ").trim();
    },

    _buildStaticMapUrl(value) {
      const location = this._normalizeMapLocation(this._sanitizeLocationText(value));
      if (!location) return;

      wx.request({
        url: "https://api.maplemeet.ca/api/map/static",
        method: "GET",
        data: { address: location },
        success: (res) => {
          if (res.data && res.data.imageUrl) {
            this.setData({ mapImageUrl: res.data.imageUrl });
          }
        },
        fail: (err) => {
          console.error("Map Request Error", err);
          wx.showToast({ title: "地图加载失败", icon: "none" });
        }
      });
    },

    onLocationInput(e) {
      const value = (e.detail && e.detail.value) || "";
      this.setData({ locationText: value, locationDisplay: value });

      if (this.locationDebounceTimer) clearTimeout(this.locationDebounceTimer);
      this.locationDebounceTimer = setTimeout(() => this._buildStaticMapUrl(value), 1000);
    },

    onPasteLocation() {
      wx.getClipboardData({
        success: (res) => {
          const text = res.data || "";
          this.setData({ locationText: text, locationDisplay: text });
          this._buildStaticMapUrl(text);
        }
      });
    },

    onPickLocation() {
      if (!wx.chooseLocation) return;

      wx.chooseLocation({
        success: (res) => {
          const text = res && (res.name || res.address) ? (res.name || res.address) : "已选择位置";
          this.setData({ locationText: text, locationDisplay: text });
          this._buildStaticMapUrl(text);
        },
        fail: () => {
          if (!this.data.locationText) {
            this.setData({ locationText: "", locationDisplay: "", mapImageUrl: "" });
          }
        }
      });
    },

    onSubmit() {
      wx.showToast({ title: "创建活动（示例）", icon: "none" });
    }
  }
});
