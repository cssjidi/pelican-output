
let isDarkMode = false

$(document).ready(function  () {
  //夜间模式
  document.on('click', '.switch-dark-mode', function (event) {
    // 切换模式
    $('html').toggleClass('io-black-mode');
    // 获取当前是否是黑暗模式
    isDarkMode = $('html').hasClass('io-black-mode');
    switchThemeMode(true);
  });
});


function switchThemeMode(isManual) {
    var $btn = $('.switch-dark-mode');
    var $modeIco = $btn.find(".mode-ico");
    var $tinymceBody = $("#post_content_ifr").contents().find('body');
  
    // 检查 TinyMCE body 是否存在
    if ($tinymceBody.length > 0) {
      // 根据当前模式设置 TinyMCE body 样式和 cookie
      if (isDarkMode) {
        $tinymceBody.addClass('io-black-mode');
      } else {
        $tinymceBody.removeClass('io-black-mode');
      }
    }
  
    // 如果手动切换，更新 cookie
    if (isManual) {
      $.cookie('io_night_mode', IO.isDarkMode ? 0 : 1);
    }
  
    // 更新按钮和图标的状态
    if ($btn.attr("data-original-title")) {
      $btn.attr("data-original-title", IO.isDarkMode ? IO.localize.lightMode : IO.localize.nightMode);
    } else {
      $btn.attr("title", IO.isDarkMode ? IO.localize.lightMode : IO.localize.nightMode);
    }
    $modeIco.removeClass(IO.isDarkMode ? "icon-night" : "icon-light")
      .addClass(IO.isDarkMode ? "icon-light" : "icon-night");
    switchSrc();
    var themeChangeEvent = new CustomEvent('themeModeChanged', {
      detail: { isDarkMode: IO.isDarkMode }
    });
    window.dispatchEvent(themeChangeEvent);
    // big-posts 对象触发自定义事件
    var $bigPosts = $('.big-posts');
    var jqThemeChangeEvent = $.Event('themeModeChanged');
    $bigPosts.trigger(jqThemeChangeEvent);
  }

  
/**
 * 切换图片的 src 属性
 */
function switchSrc() {
    $("img[switch-src]").each(function () {
      var $this = $(this);
      var src = $this.attr("data-src") || $this.attr("src");
      var switchSrc = $this.attr("switch-src");
  
      var isDark = JSON.parse($this.attr("is-dark").toLowerCase());
  
      if (isDark != IO.isDarkMode) {
        $this.attr("src", switchSrc).attr("switch-src", src)
          .removeAttr("data-src").attr("is-dark", !isDark);
      }
    });
  }