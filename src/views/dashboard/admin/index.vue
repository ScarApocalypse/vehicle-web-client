<template>
  <div v-loading="loading" class="dashboard-editor-container">
    <!-- <github-corner class="github-corner" /> -->

    <panel-group
      :gpsinfo-num="gpsinfoNum"
      :vehicle-num="vehicleNum"
      :alarm-num="alarmNum"
      @handleSetLineChartData="handleSetLineChartData"
    />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <!-- <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col
        :xs="{ span: 24 }"
        :sm="{ span: 12 }"
        :md="{ span: 12 }"
        :lg="{ span: 6 }"
        :xl="{ span: 6 }"
        style="margin-bottom:30px;"
      >
        <todo-list />
      </el-col>
      <el-col
        :xs="{ span: 24 }"
        :sm="{ span: 12 }"
        :md="{ span: 12 }"
        :lg="{ span: 6 }"
        :xl="{ span: 6 }"
        style="margin-bottom:30px;"
      >
        <box-card />
      </el-col>
    </el-row>

    <div class="chart-wrapper">
      <pie-chart />
    </div>
    <transaction-table /> -->
  </div>
</template>

<script>
// import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
// import RaddarChart from './components/RaddarChart'
// import PieChart from './components/PieChart'
// import BarChart from './components/BarChart'
// import TransactionTable from './components/TransactionTable'
// import TodoList from './components/TodoList'
// import BoxCard from './components/BoxCard'

import { getDashInfo } from '../../../api/vehicle'

var lineChartData = {
  gpsChartData: {
    name: 'gps记录',
    data: [],
    day: [],
    color: '#36a3f7'
  },
  vehicleChartData: {
    name: '车辆数',
    data: [],
    day: [],
    color: '#40c9c6'
  },
  alarmChartData: {
    name: '报警记录',
    data: [],
    day: [],
    color: '#f4516c'
  },
  shoppings: {
    data: [],
    day: []
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    // GithubCorner,
    PanelGroup,
    LineChart
    // RaddarChart,
    // PieChart,
    // BarChart,
    // TransactionTable,
    // TodoList,
    // BoxCard
  },
  data() {
    return {
      loading: false,
      lineChartData: lineChartData.gpsChartData,

      gpsinfoNum: 0,
      vehicleNum: 0,
      alarmNum: 0
    }
  },

  watch: {
    $route(to, from) {
      console.log(to, from)
      if (to.name === 'Dashboard') {
        this.getDashMsg()
      }
    }
  },
  mounted() {
    this.getDashMsg()
  },
  methods: {
    getDashMsg() {
      this.loading = true
      getDashInfo().then(response => {
        console.log(response)
        const {
          gpsinfoCount,
          vehicleCount,
          alarmCount,
          gpsChartData,
          alarmChartData,
          vehicleChartData
        } = response.data
        this.gpsinfoNum = +gpsinfoCount
        this.vehicleNum = +vehicleCount
        this.alarmNum = +alarmCount
        for (const key in lineChartData) {
          lineChartData[key].data = []
          lineChartData[key].day = []
        }
        gpsChartData.forEach(item => {
          lineChartData.gpsChartData.data.push(item.num)
          lineChartData.gpsChartData.day.push(item.day)
        })
        vehicleChartData.forEach(item => {
          lineChartData.vehicleChartData.data.push(item.num)
          lineChartData.vehicleChartData.day.push(item.day)
        })
        alarmChartData.forEach(item => {
          lineChartData.alarmChartData.data.push(item.num)
          lineChartData.alarmChartData.day.push(item.day)
        })
        this.loading = false
      })
    },
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
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
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
