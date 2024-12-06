/*
 * @Author: iowen
 * @Author URI: https://www.iowen.cn/
 * @Date: 2023-02-01 00:01:43
 * @LastEditors: iowen
 * @LastEditTime: 2024-11-03 18:21:23
 * @FilePath: /onenav/assets/js/require.js
 * @Description: 模块加载器
 */

(function (global) {
  var loadedScripts = {}; 
  var config = {   
    baseUrl: '',
    urlArgs: '',
    paths: {}
  };

  // 初始化 require 模块
  var require = {
    config: function (options) {
      config = Object.assign(config, options);
    },

    // 检查是否是绝对 URL
    isAbsoluteUrl: function (url) {
      return /^(https?:)?\/\//.test(url);
    },

    loadScript: function (url, callback) {
      if (loadedScripts[url]) {
        callback(true);
        return;
      }

      var script = document.createElement('script');
      script.src = url;
      script.onload = function () {
        loadedScripts[url] = true;
        callback(true);
      };
      script.onerror = function () {
        callback(false);
        console.error('Error loading script:', url);
      };
      document.head.appendChild(script);
    },

    // 加载单个或多个 URL，数组情况
    loadScriptsArray: function (urls, callback, errorCallback) {
      var index = 0;

      function tryLoadNext() {
        if (index >= urls.length) {
          callback();
          return;
        }

        require.loadScript(urls[index], function (success) {
          if (!success) {
            errorCallback && errorCallback(urls[index]);
          } else {
            index++;
            tryLoadNext();
          }
        });
      }

      tryLoadNext();
    },

    load: function (deps, callback) {
      if (typeof deps === 'string') {
        deps = [deps];
      }

      var loadedCount = 0;
      var totalDeps = deps.length;

      function onLoad() {
        loadedCount++;
        if (loadedCount === totalDeps && typeof callback === 'function') {
          callback();
        }
      }

      deps.forEach(function (dep) {
        var path = config.paths[dep] ? config.paths[dep] : dep;
        var urls;

        if (Array.isArray(path)) {
          urls = path;
        } else {
          urls = [path];
        }

        urls = urls.map(function (url) {
          if (!require.isAbsoluteUrl(url)) {
            url = [config.baseUrl + '/' + url + '.js'];  // 拼接 baseUrl
          }
          if (config.urlArgs) {
            return url + (url.indexOf('?') === -1 ? '?' : '&') + config.urlArgs;
          }
          return url;
        });

        require.loadScriptsArray(urls, onLoad, function (failedUrl) {
          console.error('Failed to load dependency:', dep, 'URL:', failedUrl); // 输出详细错误信息
        });
      });
    }
  };

  global.ioRequire = function (deps, callback) {
    require.load(deps, callback);
  };

  global.ioRequire.config = require.config;

})(window);

// 示例配置
ioRequire.config({
  baseUrl: 'theme/js',
  urlArgs: 'ver=' + IO.version,
  paths: {
    'jquery': "jquery.min",
    'main': 'main',
    'lazyload': 'lazyload.min',
    'captcha': 'captcha',
    'comments': [IO.homeUrl + '/wp-includes/js/comment-reply.min.js', 'comments-ajax'],
    'sticky-sidebar': 'theia-sticky-sidebar',
    'slidercaptcha': 'longbow.slidercaptcha' + IO.minAssets,
    'color-thief': 'color-thief.umd',
    'fancybox': 'jquery.fancybox.min',
    'echarts': ['echarts.min', 'sites-chart'],
    'pay': '/iopay/assets/js/pay.js',
    'new-post': ['new-post'],
    'weather': '//widget.seniverse.com/widget/chameleon.js',
    'weather-v2': '//cdn.sencdn.com/widget2/static/js/bundle.js?t=' + parseInt((new Date().getTime() / 100000000).toString(), 10),
    'swiper': 'swiper-bundle.min',
  }
});

$(".panel-body.single img").each(function () {
  var $img = $(this);

  // 如果图片不是 wp-smiley 并且没有被包裹在 <a> 中
  if (!$img.hasClass('unfancybox') && !$img.hasClass('wp-smiley') && !$img.parent().is('a')) {
    var imgSrc = IO.lazyload === '1' ? $img.data('src') : $img.attr('src');
    var caption = $img.attr('alt') || ''; 

    $img.wrap(`<a class='js' href='${imgSrc}' data-fancybox='images' data-caption='${caption}'></a>`);
  }
  if (IO.lazyload === '1' && $img.data('src') && !$img.hasClass('lazy')) {
    $img.addClass('lazy');
  }
});


//ioRequire(['lazyload','main']);
//ioRequire('main');
ioRequire('lazyload', function () {
  ioRequire('main');
});
