<template>
  <div :class="className" :style="{ height: height, width: width }" />
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
      default: '420px'
    },
    chartData: {
      type: Array,
      default: function() {
        return []
      }
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
        toolbox: {
          feature: {
            // restore: {},
            saveAsImage: {}
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: this.getDataName(this.chartData)
        },
        series: [
          {
            name: '报警统计',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '50%'],
            data: this.chartData,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
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
