layui.define(["element", "jquery"], function (exports) {
  var element = layui.element;
  var $ = layui.$;
  var layer = layui.layer; // 添加layer模块依赖

  var MODULE_NAME = "layout";
  var INSTANCE = "layui-layout-admin";

  // 构造函数模式
  function Layout(options) {
    this.config = $.extend(true, {}, Layout.defaultConfig, options);
    this.init();
  }
  // 默认配置（包含固定menuItems）
  Layout.defaultConfig = {
    logo: "/assets/images/logo.png",
    user: {
      name: "",
      id: "",
      img: "https://img01.yzcdn.cn/vant/cat.jpeg",
    },
    menuItems: [
      // 固定菜单配置
      {
        title: "首页",
        icon: "layui-icon-app",
        href: "home.html",
      },
      {
        title: "我的媒体",
        icon: "layui-icon-chart",
        href: "media.html",
      },
      { title: "我的广告位", icon: "layui-icon-user", href: "advplace.html" },
      {
        title: "数据报表",
        icon: "layui-icon-chart-screen",
        href: "report.html",
      },
    ],
  };

  // 原型方法
  Layout.prototype = {
    constructor: Layout,

    init: function () {
      this._createBaseStructure();
      this.renderHeader();
      this.renderSide();
      this.bindEvents(); // 绑定事件
      element.render("nav");
      return this;
    },

    _createBaseStructure: function () {
      if ($("." + INSTANCE).length > 0) return;

      var structure = [
        '<div class="layui-layout ' + INSTANCE + '">',
        '<div class="layui-header"></div>',
        '<div class="layui-side">',
        '<div class="layui-side-scroll">',
        '<ul class="layui-nav layui-nav-tree"></ul>',
        "</div>",
        "</div>",
        '<div class="layui-body"></div>',
      ].join("");

      $("body").prepend(structure);
    },

    renderHeader: function () {
      var config = this.config;
      var headerHtml = [
        '<div class="admin-logo">',
        '<img src="' + config.logo + '">',
        "</div>",
        '<ul class="layui-nav layui-layout-right">',
        '<li class="layui-nav-item">',
        '<a href="javascript:;">',
        '<img src="' + config.user.img + '" class="layui-nav-img">',
        config.user.name,
        "</a>",
        '<dl class="layui-nav-child">',
        '<dd><a href="javascript:;" id="logout-btn"><i class="layui-icon layui-icon-logout"></i> 退出</a></dd>',
        "</dl>",
        "</li>",
        "</ul>",
      ].join("");

      $("." + INSTANCE + " .layui-header").html(headerHtml);
    },

    renderSide: function () {
      var activeIndex = this.config.activeIndex;
      var menuItems = this.config.menuItems;
      var menuHtml = menuItems
        .map(function (item, index) {
          return [
            '<li class="layui-nav-item' +
              (index === activeIndex ? " layui-this" : "") +
              '">',
            '<a href="' + (item.href || "#") + '">',
            item.icon
              ? '<i class="layui-icon ' + item.icon + ' left-menu-icon"></i>'
              : "",
            item.title,
            "</a>",
            "</li>",
          ].join("");
        })
        .join("");

      $("." + INSTANCE + " .layui-nav-tree").html(menuHtml);
    },

    // 绑定事件方法
    bindEvents: function () {
      var that = this;

      // 退出按钮点击事件
      $(document).on("click", "#logout-btn", function () {
        layer.confirm(
          "确定要退出登录吗？",
          {
            icon: 3,
            title: "提示",
          },
          function (index) {
            // 关闭确认框
            layer.close(index);

            // 执行退出操作（这里需要根据实际业务逻辑实现）
            that.doLogout();
          }
        );
      });
    },

    // 退出操作方法（需要根据实际业务逻辑实现）
    doLogout: function () {
      // 示例：跳转到index页面
      window.location.href = "/index.html";

      // 如果使用token认证，可能需要清除本地存储的token
      // localStorage.removeItem('token');
    },
  };

  exports(MODULE_NAME, function (options) {
    return new Layout(options);
  });
});
