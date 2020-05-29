<template>
  <div v-loading="loading" class="dashboard-editor-container">
    <!-- <github-corner class="github-corner" /> -->

    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
        <template slot="title">
          <i class="header-icon el-icon-info" />
          {{
            title.replace('-0', '年').replace('-', '年') + '月数据'
          }}(面板数据24小时更新一次)
        </template>
        <div class="datePickerContainer">
          <el-date-picker
            v-model="pos_time"
            type="month"
            placeholder="选择日期时间"
            :editable="false"
            value-format="yyyy-MM"
            default-value="2018-02"
            :clearable="false"
            @change="handleChange"
          />
          <el-button
            class="filter-item"
            type="primary"
            style="margin-left:10px"
            @click="handleUpdateDash"
          >
            更新数据
          </el-button>
        </div>
      </el-collapse-item>
    </el-collapse>
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

import { getDashInfo, updateDash } from '../../../api/vehicle'

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
      alarmNum: 0,
      activeNames: '',
      pos_time: '2018-02',
      title: ''
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
      getDashInfo(this.pos_time).then(response => {
        const { dashInfo, chartData } = response.data

        this.title = `${this.pos_time}`
        if (dashInfo.length > 0) {
          this.gpsinfoNum = +dashInfo[0].gps_num
          this.vehicleNum = +dashInfo[0].vehicle_num
          this.alarmNum = +dashInfo[0].alarm_num
        } else {
          this.gpsinfoNum = 0
          this.vehicleNum = 0
          this.alarmNum = 0
        }

        for (const key in lineChartData) {
          lineChartData[key].data = []
          lineChartData[key].day = []
        }
        if (chartData.length > 0) {
          chartData.forEach(item => {
            lineChartData.gpsChartData.data.push(item.gps)
            lineChartData.gpsChartData.day.push(item.day)
          })
          chartData.forEach(item => {
            lineChartData.vehicleChartData.data.push(item.vehicle)
            lineChartData.vehicleChartData.day.push(item.day)
          })
          chartData.forEach(item => {
            lineChartData.alarmChartData.data.push(item.alarm)
            lineChartData.alarmChartData.day.push(item.day)
          })
        }

        this.loading = false
      })
    },
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    handleChange() {
      this.getDashMsg()
    },
    handleUpdateDash() {
      this.loading = true
      updateDash({ date: this.pos_time })
        .then(res => {
          if (res.code === 0) {
            this.$message.success('更新面板数据成功')
            this.getDashMsg()
            this.loading = false
          }
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
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
.datePickerContainer,
.header-icon {
  padding-left: 15px !important;
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
