<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.username"
        placeholder="账号"
        style="width:200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      />
      <el-button
        id="vehiclelistBtn"
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        style="margin-left:10px"
        @click="showAddAccountDialog = true"
      >
        新增
      </el-button>
      <el-button
        id="vehiclelistBtn"
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        style="margin-left:10px"
        @click="handleFilter"
      >
        查询
      </el-button>
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
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="100"
      />
      <el-table-column label="账号" align="center" prop="username" />
      <el-table-column label="角色" align="center" prop="role">
        <template slot-scope="{ row: { role } }">
          <el-tag :type="role | roleStyle" size="large">{{
            role | roleFilter
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="toUpdateAccount(row)"
          />
          <el-button
            type="text"
            icon="el-icon-delete"
            @click="toDeleteAccount(row)"
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

    <el-dialog
      :title="isAdd ? '添加账号' : '修改账号'"
      :visible.sync="showAddAccountDialog"
      width="50%"
      @close="handleAddAccountClose"
    >
      <el-form
        ref="addAccountFormRef"
        :rules="addAccountFormRules"
        :model="addAccountForm"
        label-width="80px"
      >
        <el-form-item label="账号" prop="username">
          <el-input
            v-model="addAccountForm.username"
            placeholder="请输入账号/车辆ID"
            :disabled="!isAdd"
            clearable
          />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select
            v-model="addAccountForm.role"
            placeholder="请选择角色"
            clearable
            class="filter-item"
            style="width:100%;"
          >
            <el-option
              v-for="(item, index) in roles"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="!isAdd" label="重置密码" prop="role">
          <el-switch v-model="addAccountForm.reset" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddAccountDialog = false">取 消</el-button>
        <el-button
          v-loading="dialogLoading"
          type="primary"
          @click="toAddAccount"
        >
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '../../components/Pagination/index'
import waves from '../../directive/waves/waves'

import {
  listAccount,
  addAccount,
  deleteAccount,
  updateAccount
} from '../../api/account'

export default {
  components: { Pagination },
  directives: { waves },
  filters: {
    valueFilter(value) {
      return value || '无'
    },
    roleStyle(value) {
      return value === 'administrator' ? 'danger' : 'warning'
    },
    roleFilter(value) {
      return value === 'administrator' ? '管理员' : '普通用户'
    }
  },
  props: {},
  data() {
    return {
      total: 0,
      tableKey: 0,
      roles: [
        {
          value: 'administrator',
          label: '管理员'
        },
        {
          value: 'user',
          label: '普通用户'
        }
      ],
      listLoading: false,
      listQuery: {},
      list: [],
      showAddAccountDialog: false,
      addAccountForm: {
        id: 0,
        username: '',
        role: 'user',
        reset: false
      },
      dialogLoading: false,
      addAccountFormRules: {
        username: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        role: [{ required: true, message: '角色不能为空', trigger: 'blur' }]
      },
      isAdd: true
    }
  },
  computed: {},
  watch: {},
  created() {
    this.parseQuery()
  },
  mounted() {
    this.getList()
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
    parseQuery() {
      const query = Object.assign({}, this.$route.query)
      let sort = '+id'
      const listQuery = {
        page: 1,
        pageSize: 20,
        sort,
        username: ''
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
    getList() {
      this.listLoading = true
      listAccount(this.listQuery).then(response => {
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
        path: '/account/list',
        query: this.listQuery
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.refresh()
    },
    handleAddAccountClose() {
      this.$refs.addAccountFormRef.resetFields()
      this.addAccountForm.username = ''
      this.addAccountForm.role = 'user'
      this.isAdd = true
    },
    toAddAccount() {
      this.$refs.addAccountFormRef.validate(valid => {
        if (!valid) return
        this.dialogLoading = true
        if (this.isAdd) {
          addAccount(this.addAccountForm)
            .then(res => {
              console.log(res)
              if (res.code === 0) {
                this.$message.success('添加账号成功')
                this.getList()
                this.showAddAccountDialog = false
              }
              this.dialogLoading = false
            })
            .catch(res => {
              this.dialogLoading = false
            })
        } else {
          updateAccount(this.addAccountForm)
            .then(res => {
              if (res.code === 0) {
                this.$message.success('修改账号数据成功')
                this.getList()
                this.showAddAccountDialog = false
              }
              this.dialogLoading = false
            })
            .catch(res => {
              this.dialogLoading = false
            })
        }
      })
    },
    async toDeleteAccount({ id }) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该账号, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      deleteAccount(id).then(res => {
        if (res.code === 0) {
          this.$message.success('删除成功')
          this.getList()
        }
      })
    },
    toUpdateAccount(row) {
      this.isAdd = false
      this.showAddAccountDialog = true
      this.addAccountForm.username = row.username
      this.addAccountForm.id = row.id
      this.addAccountForm.role = row.role
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
