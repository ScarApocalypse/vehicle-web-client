<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        id="vehiclelistBtn"
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        style="margin-left:10px"
        @click="showAddGpsInfoDialog = true"
      >
        新增
      </el-button>
      <el-input
        v-model="listQuery.vehicle_id"
        placeholder="车辆ID"
        style="width:200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      />
      <!-- <el-input
        v-model="listQuery.author"
        placeholder="作者"
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
        :value-format="switchStatus ? 'yyyy-MM' : 'yyyy-MM-dd'"
        default-value="2018-02"
        @change="datePickerChange"
      />

      <el-switch
        v-model="switchStatus"
        active-text="按月"
        inactive-text="按日"
        class="filter-item"
        @change="switchChange"
      />
      <!-- <el-button
        id="vehiclelistBtn"
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        style="margin-left:10px"
        @click="handleFilter"
      >
        查询
      </el-button> -->
      <!-- <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        style="margin-left:5px"
        @click="handleCreate"
      >
        新增
      </el-button> -->
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
      :height="tableHeight"
      @sort-change="sortChange"
    >
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        fit
      />

      <el-table-column label="车辆ID" align="center" prop="vehicle_id" />
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

      <el-table-column
        label="时间"
        prop="local_time"
        align="center"
        min-width="120"
      >
        <template slot-scope="{ row: { pos_time } }">
          {{ pos_time.replace('000Z', '').replace('T', ' ') }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="{ row }">
          <el-tooltip
            :content="
              `筛选出车辆ID为${row.vehicle_id}
            的gps信息`
            "
            effect="dark"
            placement="bottom"
          >
            <el-button
              type="text"
              icon="el-icon-search"
              @click="handleUpdate(row)"
            />
          </el-tooltip>
          <el-tooltip
            :content="`查看车辆ID为${row.vehicle_id}的报警统计信息`"
            effect="dark"
            placement="top"
          >
            <el-button
              type="text"
              icon="el-icon-s-comment"
              @click="watchAlarmMsg(row)"
            />
          </el-tooltip>

          <!-- <el-button
            type="text"
            icon="el-icon-delete"
            style="color:#f56c6c"
            @click="handleDelete(row)"
          /> -->
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

    <el-dialog
      title="添加车辆Gps信息"
      :visible.sync="showAddGpsInfoDialog"
      width="50%"
      @close="handleAddGpsClose"
    >
      <el-form ref="form" :model="addGpsForm" label-width="80px">
        <el-form-item label="车辆ID">
          <el-input
            v-model="addGpsForm.vehicle_id"
            placeholder="车辆ID"
            clearable
          />
        </el-form-item>
        <el-form-item label="命令类型">
          <el-select
            v-model="addGpsForm.command_id"
            placeholder="请选择命令类型"
            clearable
            class="filter-item"
            style="width:100%;"
            @change="commandTypeChange"
          >
            <el-option
              v-for="(item, index) in commandCategory"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="详细类型">
          <el-select
            v-model="addGpsForm.alarm_type"
            placeholder="请选择详细类型"
            clearable
            class="filter-item"
            style="width:100%;"
          >
            <el-option
              v-for="(item, index) in detailCategory"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="速度">
          <el-input v-model="addGpsForm.move_speed" placeholder="请输入内容">
            <template slot="append">
              km/h
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="总里程">
          <el-input v-model="addGpsForm.total_course" placeholder="请输入内容">
            <template slot="append">
              m
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="gps时间">
          <el-date-picker
            v-model="addGpsForm.pos_time"
            type="datetime"
            placeholder="选择日期时间"
            style="width:100%;"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddGpsInfoDialog = false">取 消</el-button>
        <el-button type="primary" @click="toAddGpsInfo">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '../../components/Pagination/index'
import waves from '../../directive/waves/waves'
import { getCategory, deleteBook } from '../../api/book'
import { listVehicle, addGpsInfo } from '../../api/vehicle'
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
      day: '01',
      showAddGpsInfoDialog: false,
      commandCategory: [],
      detailCategory: [],
      addGpsForm: {
        vehicle_id: '',
        command_id: '',
        alarm_type: '',
        pos_time: '',
        move_speed: '',
        total_course: ''
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.parseQuery()
    window.addEventListener('resize', this.getTableHeight())
    this.getTableHeight()
    this.getAlarmCategory()
    this.getCommandCategory()
    console.log(this.$store.getters.username)
  },
  mounted() {
    // this.getCategoryList()
    this.getList()
    this.$EventBus.$on('listSearch', query => {
      // this.listQuery.vehicle_id = query

      // this.handleFilter()
      this.$router.push({
        path: `/vehicle/data/${query}`
      })
    })
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
    handleAddGpsClose() {
      for (const key in this.addGpsForm) {
        this.addGpsForm[key] = ''
      }
    },
    commandTypeChange(value) {
      const type = alarm[value]
      this.addGpsForm.alarm_type = ''
      this.detailCategory = []
      for (const key in type) {
        if (key === 'name') continue
        const obj = {}
        obj.value = key
        obj.label = type[key]
        this.detailCategory.push(obj)
      }
    },
    getCommandCategory() {
      for (const key in alarm) {
        const obj = {}
        obj.value = key
        obj.label = alarm[key].name
        this.commandCategory.push(obj)
      }
    },
    getAlarmCategory() {
      const alarmType = alarm[209]
      for (const key in alarmType) {
        if (key === 'name') continue
        const obj = {}
        obj.value = key
        obj.label = alarmType[key]
        this.alarmCategory.push(obj)
      }
    },
    getTableHeight() {
      this.tableHeight = window.innerHeight - 250
      this.refresh()
    },
    parseQuery() {
      const query = Object.assign({}, this.$route.query)
      let sort = '+id'
      const listQuery = {
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
      const sortColumn = sort.slice(1, sort.length)
      this.defaultSort = {
        prop: sortColumn,
        order: sortSymbol === '+' ? 'ascending' : 'descending'
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
      this.$router.push({
        path: '/vehicle/list',
        query: this.listQuery
      })
      // this.getList()
    },
    handleFilter() {
      console.log(1111)
      // this.getList()
      this.listQuery.page = 1
      this.refresh()
    },
    handleCreate() {
      this.$router.push('/book/create')
    },
    handleUpdate(row) {
      console.log(row)

      this.listQuery.vehicle_id = row.vehicle_id
      this.listQuery.page = 1
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
    changeShowAlarm(value) {
      // this.showAlarmOnly = value
    },
    switchChange(status) {
      const arr = this.$refs.dataPickerRef.value.split('-')

      if (status) {
        this.listQuery.date = `${arr[0]}-${arr[1]}`
      } else {
        this.listQuery.date = `${arr[0]}-${arr[1]}-${this.day}`
      }
      this.handleFilter()
    },
    datePickerChange(value) {
      console.log(this.$refs.dataPickerRef.value)
      const arr = value.split('-')
      if (this.switchStatus) {
        this.listQuery.date = `${arr[0]}-${arr[1]}`
      }
      this.handleFilter()
    },
    toAddGpsInfo() {
      console.log(this.addGpsForm)
      addGpsInfo(this.addGpsForm).then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.filter-container {
  // display: none;
}
@media (max-width: 1024px) {
  .filter-container {
    // display: block;
  }
}
</style>
