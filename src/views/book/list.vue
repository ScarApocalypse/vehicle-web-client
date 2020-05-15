<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="书名"
        style="width:200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      />
      <el-input
        v-model="listQuery.author"
        placeholder="作者"
        style="width:200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      />
      <el-select
        v-model="listQuery.category"
        placeholder="分类"
        clearable
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="(item, index) in categoryList"
          :key="index"
          :label="item.label + '(' + item.num + ')'"
          :value="item.label"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        style="margin-left:10px"
        @click="handleFilter"
      >
        查询
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        style="margin-left:5px"
        @click="handleCreate"
      >
        新增
      </el-button>
      <el-checkbox
        v-model="showCover"
        class="filter-item"
        style="margin-left:5px"
        @change="changeShowCover"
      >
        显示封面
      </el-checkbox>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width:100%"
      :default-sort="defaultSort"
      @sort-change="sortChange"
    >
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
      />
      <el-table-column label="书名" align="center" width="150">
        <template slot-scope="{ row: { titleWrapper } }">
          <span v-html="titleWrapper" />
        </template>
      </el-table-column>
      <el-table-column label="作者" align="center" width="150">
        <template slot-scope="{ row: { authorWrapper } }">
          <span v-html="authorWrapper" />
        </template>
      </el-table-column>
      <el-table-column
        label="出版社"
        prop="publisher"
        width="150"
        align="center"
      />
      <el-table-column
        label="分类"
        prop="categoryText"
        width="100"
        align="center"
      />
      <el-table-column label="语言" prop="language" align="center" />
      <el-table-column
        v-if="showCover"
        label="封面"
        align="center"
        min-width="150"
      >
        <template slot-scope="{ row: { cover } }">
          <a :href="cover" target="_blank">
            <img :src="cover" alt="" style="width:120px;height:180px;" />
          </a>
        </template>
      </el-table-column>
      <el-table-column
        label="文件名"
        prop="fileName"
        align="center"
        width="100"
      />
      <el-table-column
        label="文件路径"
        prop="filePath"
        align="center"
        width="100"
      >
        <template slot-scope="{ row: { filePath } }">
          <span>{{ filePath | valueFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="封面路径"
        prop="coverPath"
        align="center"
        width="100"
      >
        <template slot-scope="{ row: { coverPath } }">
          <span>{{ coverPath | valueFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="解压路径"
        prop="unzipPath"
        align="center"
        width="100"
      >
        <template slot-scope="{ row: { unzipPath } }">
          <span>{{ unzipPath | valueFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="上传人"
        prop="createUser"
        align="center"
        width="100"
      >
        <template slot-scope="{ row: { createUser } }">
          <span>{{ createUser | valueFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="上传时间"
        prop="createDt"
        align="center"
        width="100"
      >
        <template slot-scope="{ row: { createDt } }">
          <span>{{ createDt | timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120" fixed="right">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(row)"
          />
          <el-button
            type="text"
            icon="el-icon-delete"
            style="color:#f56c6c"
            @click="handleDelete(row)"
          />
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
import { getCategory, listBook, deleteBook } from '../../api/book'
import { parseTime } from '../../utils'

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
      defaultSort: {}
    }
  },
  computed: {},
  watch: {},
  created() {
    this.parseQuery()
  },
  mounted() {
    this.getCategoryList()
    this.getList()
  },
  beforeRouteUpdate(to, from, next) {
    console.log(to, from)
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
    parseQuery() {
      const query = Object.assign({}, this.$route.query)
      let sort = '+id'
      const listQuery = {
        page: 1,
        pageSize: 20,
        sort
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
      listBook(this.listQuery).then(response => {
        const { list, count } = response.data
        this.list = list
        this.total = count
        this.listLoading = false
        this.list.forEach(book => {
          book.titleWrapper = this.wrapperKeyword('title', book.title)
          book.authorWrapper = this.wrapperKeyword('author', book.author)
        })
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
      this.$router.push({
        path: '/book/list',
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
      this.$router.push(`/book/edit/${row.fileName}`)
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
    changeShowCover(value) {
      this.showCover = value
    }
  }
}
</script>

<style scoped lang="scss"></style>
