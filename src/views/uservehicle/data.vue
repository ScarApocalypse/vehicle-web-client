<template>
  <div class="dashboard-editor-container">
    <div class="filter-container">
      <el-date-picker
        ref="dataPickerRef"
        v-model="date"
        type="month"
        placeholder="选择月份"
        class="filter-item"
        :editable="false"
        value-format="yyyy-MM"
        @change="getChartData"
      />
      <el-button
        id="vehiclelistBtn"
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        style="margin-left:10px"
        @click="getChartData"
      >
        查询
      </el-button>
    </div>
    <el-row :gutter="8">
      <el-col :xs="24" :sm="24" :lg="6">
        <div class="chart-wrapper">
          <speed :chart-data="speed" />
        </div>
        <!-- <box-card /> -->
        <Course :total-course="totalCourse" />
      </el-col>
      <el-col :xs="24" :sm="24" :lg="18">
        <div class="chart-wrapper">
          <pie-chart :chart-data="alarmData" />
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
      date: '2018-02'
    }
  },
  computed: {},
  watch: {},
  created() {
    this.id = +this.$store.getters.username
  },
  mounted() {
    this.id && this.getChartData()
    this.$EventBus.$on('navSearch', query => {
      if (!query) return
      this.$router.push(`/vehicle/data/${query}`)
    })
  },
  methods: {
    getChartData() {
      getAlarmMsg({ id: +this.id, date: this.date.split('-').join('') }).then(
        response => {
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
        }
      )
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
