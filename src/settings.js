module.exports = {
  title: '货运物流报警监控平台',

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  // 设置面板显示和隐藏
  showSettings: false,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  // 固定搜索框
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  // 侧边栏logo
  sidebarLogo: false,

  /** 错误日志
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production'
}
