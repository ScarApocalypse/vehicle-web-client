<template>
  <div v-loading="loading" class="dashboard-editor-container">
    <div class="filter-container">
      <el-input
        v-show="$route.params.date === 'search'"
        v-model="listQuery.vehicle_id"
        placeholder="车辆ID"
        style="width:200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      />
      <el-date-picker
        ref="dataPickerRef"
        v-model="listQuery.date"
        type="month"
        placeholder="选择月份"
        class="filter-item"
        :editable="false"
        value-format="yyyy-MM"
        default-value="2018-02"
        :clearable="false"
        @change="handleFilter"
      />
      <el-button
        id="vehiclelistBtn"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        style="margin-left:10px"
        @click="handleFilter"
      >
        查询
      </el-button>
    </div>

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
      loading: false,
      listQuery: {
        date: '2018-02',
        vehicle_id: ''
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.id = this.$route.params.id + ''
    this.date = this.$route.params.date + ''
    this.listQuery.vehicle_id = this.$route.query.id
    this.listQuery.date = `${this.date.substring(0, 4)}-${this.date.substring(
      4,
      6
    )}`
  },
  mounted() {
    this.id && this.getChartData()

    // this.$EventBus.$on('dataSearch', query => {
    //   console.log(this.$route.params.id)
    //   // if (+this.$route.params.id) {
    //   //   this.getChartData()
    //   //   return
    //   // }
    //   this.id = +query
    //   this.id && this.getChartData()
    //   if (!query) return
    //   // this.$router.push(`/vehicle/data/${query}`)
    // })
  },
  methods: {
    getChartData() {
      const _this = this
      this.loading = true
      console.log(this.$route.query)

      if (this.$route.params.date === 'search') {
        this.id = this.$route.query.id
        this.date = this.$route.query.date
      }

      console.log(this.id)
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
    },
    handleFilter() {
      console.log(1111)
      this.listQuery.vehicle_id && (this.id = this.listQuery.vehicle_id)
      this.date = this.listQuery.date.split('-').join('')
      this.$router.push({
        query: { date: this.date, id: this.id }
      })
      this.getChartData()
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
