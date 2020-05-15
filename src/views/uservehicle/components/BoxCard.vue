<template>
  <el-card class="box-card-component" style="margin-left:8px;">
    <div slot="header" class="box-card-header">
      <img
        src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=4096746021,2976938005&fm=26&gp=0.jpg"
      />
    </div>
    <div style="position:relative;">
      <!-- <pan-thumb :image="avatar" class="panThumb" /> -->
      <!-- <mallki class-name="mallki-text" text="vue-element-admin" /> -->
      <div style="padding-top:35px;" class="progress-item">
        <span style="margin-bottom:5px;">平局速度:70km/h</span>
        <el-progress :percentage="percent" :show-text="false" />
      </div>
      <div class="progress-item">
        <span>总里程:30000km</span>
        <el-progress :percentage="18" :show-text="false" />
      </div>
      <div class="progress-item">
        <span>Css</span>
        <el-progress :percentage="12" />
      </div>
      <!-- <div class="progress-item">
        <span>ESLint</span>
        <el-progress :percentage="100" status="success" />
      </div> -->
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
// import PanThumb from '@/components/PanThumb'
// import Mallki from '@/components/TextHoverEffect/Mallki'

export default {
  components: {},

  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      statisticsData: {
        article_count: 1024,
        pageviews_count: 1024
      },
      percent: 0
    }
  },

  mounted() {
    var interval = setInterval(() => {
      this.percent++

      if (this.percent === 70) {
        clearInterval(interval)
      }
    }, 20)
  },
  computed: {
    ...mapGetters(['name', 'avatar', 'roles'])
  }
}
</script>

<style lang="scss">
.box-card-component {
  .el-card__header {
    padding: 0px !important;
  }
}
</style>
<style lang="scss" scoped>
.box-card-component {
  height: 400px;
  .box-card-header {
    position: relative;
    height: 220px;
    img {
      width: 100%;
      height: 100%;
      transition: all 0.2s linear;
      &:hover {
        transform: scale(1.1, 1.1);
        filter: contrast(130%);
      }
    }
  }
  .mallki-text {
    position: absolute;
    top: 0px;
    right: 0px;
    font-size: 20px;
    font-weight: bold;
  }
  // .panThumb {
  //   z-index: 100;
  //   height: 70px !important;
  //   width: 70px !important;
  //   position: absolute !important;
  //   top: -45px;
  //   left: 0px;
  //   border: 5px solid #ffffff;
  //   background-color: #fff;
  //   margin: auto;
  //   box-shadow: none !important;
  //   /deep/ .pan-info {
  //     box-shadow: none !important;
  //   }
  // }
  .progress-item {
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 14px;
  }
  @media only screen and (max-width: 1510px) {
    .mallki-text {
      display: none;
    }
  }
}
</style>
