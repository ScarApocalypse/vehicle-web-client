<template>
  <el-table :data="chartData" style="width: 100%;padding-top: 15px;">
    <el-table-column label="报警类型">
      <template slot-scope="scope">
        {{ scope.row.name }}
      </template>
    </el-table-column>
    <el-table-column label="数据统计" width="195" align="center">
      <template slot-scope="scope">
        {{ scope.row.value }}次
      </template>
    </el-table-column>
    <!-- <el-table-column label="Status" width="100" align="center">
      <template slot-scope="{ row }">
        <el-tag :type="row.status | statusFilter">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column> -->
  </el-table>
</template>

<script>
import { transactionList } from '@/api/remote-search'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  props: {
    chartData: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      list: [{ order_no: 1, price: 2, status: 'pending' }]
    }
  },
  created() {
    // this.fetchData()
  },
  methods: {
    fetchData() {
      transactionList().then(response => {
        this.list = response.data.items.slice(0, 8)
      })
    }
  }
}
</script>
