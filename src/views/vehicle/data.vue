<template>
  <div v-loading="loading" class="dashboard-editor-container">
    <el-row v-if="!id">
      <aside class="chart-wrapper" style="padding-bottom:10px;">
        请在右上角输入车辆ID进行数据查询
      </aside>
    </el-row>

    <el-row :gutter="8">
      <el-col :xs="24" :sm="24" :lg="6">
        <div class="chart-wrapper">
          <speed :chart-data="speed" :vehicle-id="id" :date="date" />
        </div>
        <!-- <box-card /> -->
        <Course :total-course="totalCourse" />
      </el-col>
      <el-col :xs="24" :sm="24" :lg="18">
        <div class="chart-wrapper">
          <pie-chart :chart-data="alarmData" :vehicle-id="id" :date="date" />
        </div>
      </el-col>
    </el-row>

    <transaction-table :chart-data="alarmData" />
  </div>
</template>

<script>
import PieChart from './components/PieChart'
import TransactionTable from './components/TransactionTable'
// import BoxCard from './components/BoxCard'
import Speed from './components/Speed'
// import CountTo from 'vue-count-to'
import Course from './components/Course'
import { getAlarmMsg } from '../../api/vehicle'
import alarm from '../../utils/constant'

export default {
  components: {
    PieChart,
    TransactionTable,

    Speed,
    // CountTo,
    Course
  },
  props: {},
  data() {
    return {
      id: 0,
      alarmData: [],
      speed: 0,
      totalCourse: 0,
      loading: false
    }
  },
  computed: {},
  watch: {},
  created() {
    this.id = this.$route.params.id + ''
    this.date = this.$route.params.date + ''
  },
  mounted() {
    this.id && this.getChartData()

    this.$EventBus.$on('dataSearch', query => {
      console.log(this.$route.params.id)
      // if (+this.$route.params.id) {
      //   this.getChartData()
      //   return
      // }
      this.id = +query
      this.id && this.getChartData()
      if (!query) return
      // this.$router.push(`/vehicle/data/${query}`)
    })
  },
  methods: {
    getChartData() {
      const _this = this
      this.loading = true
      getAlarmMsg({ id: this.id, date: this.date }).then(response => {
        const {
          data: { alarm: alarmSum, speed, total_course }
        } = response
        const temp = []
        alarmSum.forEach((item, index) => {
          const obj = {}
          obj.value = item.num
          obj.name = alarm[209][item.alarm_type]
          temp.push(obj)
        })
        this.speed = speed
        this.alarmData = temp
        this.totalCourse = total_course
        _this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  min-height: 800px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 10px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
