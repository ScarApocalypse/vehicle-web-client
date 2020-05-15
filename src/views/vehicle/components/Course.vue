<template>
  <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
    <div class="card-panel-icon-wrapper icon-message">
      <svg-icon icon-class="car" class-name="card-panel-icon" />
    </div>
    <div class="card-panel-description">
      <div class="card-panel-text">
        总里程
      </div>
      <count-to
        :start-val="0"
        :end-val="totalCourse / 1000"
        :duration="2600"
        class="card-panel-num"
      />
      <span class="card-panel-text">
        km
      </span>
    </div>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: { CountTo },
  props: {
    totalCourse: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.card-panel {
  margin-bottom: 10px;

  height: 108px;
  cursor: pointer;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  color: #666;
  background: #fff;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.05);

  // &:hover {
  //   .card-panel-icon-wrapper {
  //     color: #fff;
  //   }

  //   .icon-people {
  //     background: #40c9c6;
  //   }

  //   .icon-message {
  //     background: #36a3f7;
  //   }

  //   .icon-money {
  //     background: #f4516c;
  //   }

  //   .icon-shopping {
  //     background: #34bfa3;
  //   }
  // }

  .card-panel-icon-wrapper {
    float: left;
    margin: 14px 0 0 14px;
    padding: 16px;
    transition: all 0.38s ease-out;
    border-radius: 6px;
  }

  .card-panel-icon {
    float: left;
    font-size: 68px;
  }

  .card-panel-description {
    float: right;
    font-weight: bold;
    margin: 26px;
    margin-left: 0px;

    .card-panel-text {
      line-height: 18px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 16px;
      margin-bottom: 12px;
    }

    .card-panel-num {
      font-size: 20px;
    }
  }
}

@media (max-width: 550px) {
  .card-panel {
    height: 100px;
    margin-bottom: 10px;
  }
  .card-panel-description {
    // display: block;
    text-align: center;
  }

  .card-panel-icon-wrapper {
    // float: none !important;
    // width: 100%;
    // height: 100%;
    // margin: 0 !important;

    .svg-icon {
      // display: block;
      // margin: 14px auto !important;
      float: none !important;
      font-size: 60px;
    }
  }
}
</style>
