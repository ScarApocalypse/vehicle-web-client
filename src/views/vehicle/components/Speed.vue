<template>
  <div :class="className" :style="{ height: '300px', width: width }" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '400px'
    },
    chartData: {
      type: Number,
      default: NaN
    },
    vehicleId: {
      type: String,
      default: ''
    },
    date: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  watch: {
    chartData(newVal, oldVal) {
      this.$nextTick(() => {
        this.initChart()
      })
    },
    vehicleId() {
      this.$nextTick(() => {
        this.initChart()
      })
    }
  },

  mounted() {},
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        title: {
          text: `车辆id:${this.vehicleId || 'NaN'}`,
          subtext: `${this.date.substring(0, 4)}年${+this.date.substring(
            4,
            6
          )}月平均速度`,
          left: 'center'
        },
        tooltip: {
          formatter: '{a} <br/>{b} {c}km/h'
        },
        toolbox: {
          feature: {
            // restore: {},
            saveAsImage: {}
          }
        },
        series: [
          {
            name: '平均速度',
            type: 'gauge',
            detail: {
              formatter: '{value}km/h',
              textStyle: {
                fontSize: 14
              }
            },
            max: 120,
            splitNumber: 12,
            center: ['50%', '60%'],
            data: [{ value: this.chartData.toFixed(0) }],
            animationDuration: 3600
          }
        ]
      })
    },
    getDataName(arr) {
      const newArr = [...arr]
      newArr.forEach((item, index) => {
        newArr[index] = item.name
      })
      return newArr
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-book {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
