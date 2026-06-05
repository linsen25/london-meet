const echarts = require("../ec-canvas/echarts");

function buildRingSeries(items) {
  const baseRadius = 72;
  const gap = 12;

  return items.map((item, index) => {
    const outer = `${baseRadius - index * gap}%`;
    const inner = `${baseRadius - index * gap - 7}%`;
    const percent = Math.max(0, Math.min(100, (item.value / 5) * 100));

    return {
      type: "pie",
      silent: true,
      z: 2,
      radius: [inner, outer],
      center: ["50%", "42%"],
      startAngle: 90,
      clockwise: true,
      label: { show: false },
      labelLine: { show: false },
      data: [
        {
          value: percent,
          itemStyle: {
            color: item.color,
            borderRadius: 999
          }
        },
        {
          value: 100 - percent,
          itemStyle: {
            color: "rgba(255,255,255,0.10)"
          }
        }
      ]
    };
  });
}

function getOption(title, items, average) {
  return {
    backgroundColor: "transparent",
    animation: true,
    series: buildRingSeries(items),
    graphic: [
      {
        type: "text",
        z: 10,
        left: "center",
        top: "33%",
        style: {
          text: average > 0 ? `${average.toFixed(1)} / 5` : "待评分",
          fill: "#FFFFFF",
          fontSize: 26,
          fontWeight: "700"
        }
      },
      {
        type: "text",
        left: "center",
        top: "43%",
        style: {
          text:"综合评分",
          fill: "rgba(255,255,255,0.72)",
          fontSize: 12
        }
      }
    ]
  };
}

Component({
  properties: {
    // activity | member
    mode: {
      type: String,
      value: "activity"
    },
    itemTitle: {
      type: String,
      value: "评分"
    }
  },

  data: {
    ec: {
      onInit: null
    },

    chart: null,

    activityItems: [
      { key: "experience", label: "活动体验", value: 0, color: "#07C160" },
      { key: "organization", label: "组织安排", value: 0, color: "#3B82F6" },
      { key: "atmosphere", label: "氛围互动", value: 0, color: "#A855F7" },
      { key: "match", label: "活动匹配度", value: 0, color: "#F59E0B" }
    ],

    memberItems: [
      { key: "punctual", label: "准时履约", value: 0, color: "#07C160" },
      { key: "communication", label: "沟通配合", value: 0, color: "#3B82F6" },
      { key: "performance", label: "活动表现", value: 0, color: "#F59E0B" }
    ]
  },

  lifetimes: {
    attached() {
      this.setData({
        ec: {
          onInit: this.initChart.bind(this)
        }
      });
    }
  },

  methods: {
    getCurrentItems() {
      return this.data.mode === "member"
        ? this.data.memberItems
        : this.data.activityItems;
    },

    getAverage(items) {
      if (!items.length) return 0;
      const sum = items.reduce((acc, cur) => acc + Number(cur.value || 0), 0);
      return sum / items.length;
    },

    initChart(canvas, width, height, dpr) {
      const chart = echarts.init(canvas, null, {
        width,
        height,
        devicePixelRatio: dpr
      });

      canvas.setChart(chart);
      this.chart = chart;
      this.refreshChart();
      return chart;
    },

    refreshChart() {
      if (!this.chart) return;

      const items = this.getCurrentItems();
      const avg = this.getAverage(items);

      this.chart.setOption(
        getOption(this.properties.itemTitle, items, avg),
        true
      );
    },

    onBack() {
      this.triggerEvent("close");
    },

    onRateChange(e) {
      const index = e.currentTarget.dataset.index;
      const value = Number(e.detail);
      const field =
        this.data.mode === "member"
          ? `memberItems[${index}].value`
          : `activityItems[${index}].value`;

      this.setData(
        {
          [field]: value
        },
        () => {
          this.refreshChart();
        }
      );
    },

    onSubmit() {
      const items = this.getCurrentItems();
      const average = this.getAverage(items);

      this.triggerEvent("submit", {
        mode: this.data.mode,
        title: this.properties.itemTitle,
        average,
        items
      });
    }
  },

  observers: {
    mode() {
      this.refreshChart();
    },
    itemTitle() {
      this.refreshChart();
    }
  }
});