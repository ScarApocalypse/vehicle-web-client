<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input
        v-model="listQuery.vehicle_id"
        placeholder="车辆ID"
        style="width:200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      /> -->
      <el-select
        v-model="listQuery.alarm_type"
        placeholder="报警类型"
        clearable
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="(item, index) in alarmCategory"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-date-picker
        ref="dataPickerRef"
        v-model="listQuery.date"
        :type="switchStatus ? 'month' : 'date'"
        placeholder="选择日期"
        class="filter-item"
        :editable="false"
        value-format="yyyy-MM-dd"
        default-value="2018-02"
        @change="handleFilter"
      />

      <el-switch
        v-model="switchStatus"
        active-text="按月"
        inactive-text="按日"
        class="filter-item"
        @change="switchChange"
      />
      <el-checkbox
        v-model="listQuery.showAlarmOnly"
        class="filter-item"
        style="margin-left:5px"
        @change="handleFilter"
      >
        只显示报警信息
      </el-checkbox>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      highlight-current-row
      style="width:100%"
      :default-sort="defaultSort"
      @sort-change="sortChange"
    >
      <!-- <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        fit
      /> -->
      <el-table-column
        label="时间"
        prop="pos_time"
        align="center"
        min-width="120"
        sortable="custom"
      >
        <template slot-scope="{ row: { pos_time } }">
          {{ pos_time.replace('000Z', '').replace('T', ' ') }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="车辆ID" align="center" prop="vehicle_id" /> -->
      <el-table-column label="消息类型" align="center" prop="command_id">
        <template slot-scope="{ row: { command_id } }">
          {{ alarm[command_id].name }}
        </template>
      </el-table-column>
      <el-table-column label="报警类型" align="center">
        <template slot-scope="{ row: { command_id, alarm_type } }">
          {{ alarm[command_id][alarm_type] }}
        </template>
      </el-table-column>
      <el-table-column label="速度(km/h)" align="center">
        <template slot-scope="{ row: { move_speed } }">
          {{ move_speed }}
        </template>
      </el-table-column>

      <el-table-column label="总里程(m)" align="center">
        <template slot-scope="{ row: { total_course } }">
          {{ total_course }}
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="refresh"
    />
  </div>
</template>

<script>
import Pagination from '../../components/Pagination/index'
import waves from '../../directive/waves/waves'
import { getCategory, deleteBook } from '../../api/book'
import { listVehicle } from '../../api/vehicle'
import { parseTime } from '../../utils'
import alarm from '../../utils/constant'
export default {
  components: { Pagination },
  directives: { waves },
  filters: {
    valueFilter(value) {
      return value || '无'
    },
    timeFilter(time) {
      return time ? parseTime(time, '{y}-{m}-{d} {h}:{i}') : '无'
    }
  },
  props: {},
  data() {
    return {
      tableKey: 0,
      listLoading: true,
      listQuery: {},
      showCover: true,
      categoryList: [],
      list: [],
      total: 0,
      defaultSort: {},
      alarm,
      tableHeight: 0,
      alarmCategory: [],
      switchStatus: true,
      day: '01'
    }
  },
  computed: {},
  watch: {},
  created() {
    this.parseQuery()
    window.addEventListener('resize', this.getTableHeight())
    this.getTableHeight()
    this.getAlarmCategory()

    console.log(this.$store.getters.username)
  },
  mounted() {
    // this.getCategoryList()
    this.getList()

    window.onresize = this.getTableHeight()
  },
  beforeRouteUpdate(to, from, next) {
    if (to.path === from.path) {
      const newQuery = Object.assign({}, to.query)
      const oldQuery = Object.assign({}, from.query)
      if (JSON.stringify(newQuery) !== JSON.stringify(oldQuery)) {
        this.getList()
      }
    }
    next()
  },
  methods: {
    getAlarmCategory() {
      const alarmType = alarm[209]
      for (const key in alarmType) {
        if (key === 'name') continue
        const obj = {}
        obj.value = key
        obj.label = alarmType[key]
        this.alarmCategory.push(obj)
      }
      console.dir(this.alarmCategory)
    },
    getTableHeight() {
      this.tableHeight = window.innerHeight - 250
      this.refresh()
    },
    parseQuery() {
      const query = Object.assign({}, this.$route.query)
      let sort = '+pos_time'
      var listQuery = {
        page: 1,
        pageSize: 20,
        sort,
        vehicle_id: '',
        alarm_type: '',
        showAlarmOnly: false,
        date: '2018-02'
      }
      if (query) {
        query.page && (query.page = +query.page)
        query.pageSize && (query.pageSize = +query.pageSize)
        query.sort && (sort = query.sort)
      }
      const sortSymbol = sort[0]
      this.defaultSort = {
        prop: 'pos_time',
        order: sortSymbol === '+' ? 'ascending' : 'descending'
      }
      if (query.showAlarmOnly === 'true') {
        query.showAlarmOnly = true
      } else {
        query.showAlarmOnly = false
      }
      this.listQuery = { ...listQuery, ...query }
    },
    getCategoryList() {
      getCategory().then(response => {
        this.categoryList = response.data
      })
    },
    wrapperKeyword(key, value) {
      function highlight(value) {
        return `<span style="color:#1890ff">${value}</span>`
      }
      if (!this.listQuery[key]) {
        return value
      } else {
        return value.replace(new RegExp(this.listQuery[key], 'ig'), value =>
          highlight(value)
        )
      }
    },
    getList() {
      this.listLoading = true
      // listBook(this.listQuery).then(response => {
      //   const { list, count } = response.data
      //   this.list = list
      //   this.total = count
      //   this.listLoading = false
      //   this.list.forEach(book => {
      //     book.titleWrapper = this.wrapperKeyword('title', book.title)
      //     book.authorWrapper = this.wrapperKeyword('author', book.author)
      //   })
      // })
      listVehicle(this.listQuery).then(response => {
        const { list, count } = response.data
        this.list = list
        this.total = count
        this.listLoading = false
      })
    },
    sortChange(data) {
      const { prop, order } = data
      this.sortBy(prop, order)
    },
    sortBy(prop, order) {
      if (order === 'ascending') {
        this.listQuery.sort = `+${prop}`
      } else {
        this.listQuery.sort = `-${prop}`
      }
      this.handleFilter()
    },
    refresh() {
      console.log(this.listQuery)
      this.listQuery.vehicle_id = +this.$store.getters.username
      this.$router.push({
        path: '/uservehicle/list',
        query: this.listQuery
      })
      // this.getList()
    },
    handleFilter() {
      // this.getList()
      this.listQuery.page = 1
      this.refresh()
    },
    handleCreate() {
      this.$router.push('/book/create')
    },
    handleUpdate(row) {
      console.log(row)

      const query = {
        vehicle_id: row.vehicle_id
      }
      this.listQuery = query
      this.refresh()
      // this.$router.push(`/book/edit/${row.fileName}`)
    },
    handleDelete(row) {
      this.$confirm('此操作将将永久删除电子书，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBook(row.fileName).then(response => {
          this.$notify({
            title: '成功',
            message: response.msg || '删除成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      })
    },
    watchAlarmMsg(row) {
      this.$router.push(`/vehicle/data/${row.vehicle_id}`)
    },
    changeShowCover(value) {
      this.showCover = value
    },
    switchChange(status) {
      const arr = this.$refs.dataPickerRef.value.split('-')

      if (status) {
        arr[2] && (this.day = arr[2])
        this.listQuery.date = `${arr[0]}-${arr[1]}`
      } else {
        this.listQuery.date = `${arr[0]}-${arr[1]}-${this.day}`
      }
      this.handleFilter()
    }
  }
}
</script>

<style scoped lang="scss">
.filter-container {
}
</style>
