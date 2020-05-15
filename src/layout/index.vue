<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container" />
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
      <el-dialog
        title="修改密码"
        :visible.sync="dialogVisible"
        width="50%"
        @close="modifyPWFormDialogClosed"
      >
        <el-form
          ref="modifyPWFormRefs"
          :model="passwordForm"
          :rules="modifyPWRules"
          label-width="70px"
        >
          <el-form-item label="账号">
            <el-input v-model="passwordForm.username" disabled />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="passwordForm.newPassword" />
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="modifyPassword">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'

import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
import { modifyPW } from '../api/user'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView
  },
  mixins: [ResizeMixin],
  data() {
    const validateNewPassword = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error('密码不能小于4位'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      passwordForm: { username: '', newPassword: '' },
      modifyPWRules: {
        newPassword: [
          { required: true, trigger: 'change', validator: validateNewPassword }
        ]
      }
    }
  },
  created() {
    this.passwordForm.username = this.$store.getters.username
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  mounted() {
    this.$EventBus.$on('modifyPassword', () => {
      console.log('modifyPassword')
      this.dialogVisible = true
    })
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    modifyPassword() {
      this.$refs.modifyPWFormRefs.validate(valid => {
        if (!valid) {
          return this.$message.error('请输入符合要求的密码')
        }
        modifyPW(this.passwordForm).then(async res => {
          console.log(res)
          if (res.code !== 0) {
            return this.$message.error('修改密码失败')
          }
          this.$message.success('修改密码成功,请重新登录')
          await this.$store.dispatch('user/logout')
          this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        })
      })
    },
    modifyPWFormDialogClosed() {
      console.log('closed')
      this.passwordForm.newPassword = ''
      this.$refs.modifyPWFormRefs.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
