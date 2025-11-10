/**
 * This script make #search-result-wrapper switch to unloaded or shown automatically.
 */
const $btnSbTrigger = $('#sidebar-trigger');
const $btnSearchTrigger = $('#search-trigger');
const $btnCancel = $('#search-cancel');
const $content = $('#main-wrapper>.container>.row');
const $topbarTitle = $('#topbar-title');
const $search = $('search');
const $resultWrapper = $('#search-result-wrapper');
const $results = $('#search-results');
const $input = $('#search-input');
const $hints = $('#search-hints');
const $viewport = $('html,body');

// class names
const C_LOADED = 'loaded';
const C_UNLOADED = 'unloaded';
const C_FOCUS = 'input-focus';
const C_FLEX = 'd-flex';

class ScrollBlocker {
  static offset = 0;
  static resultVisible = false;

  static on() {
    ScrollBlocker.offset = window.scrollY;
    $viewport.scrollTop(0);
  }

  static off() {
    $viewport.scrollTop(ScrollBlocker.offset);
  }
}

/*--- Actions in mobile screens (Sidebar hidden) ---*/
class MobileSearchBar {
  static on() {
    $btnSbTrigger.addClass(C_UNLOADED);
    $topbarTitle.addClass(C_UNLOADED);
    $btnSearchTrigger.addClass(C_UNLOADED);
    $search.addClass(C_FLEX);
    $btnCancel.addClass(C_LOADED);
  }

  static off() {
    $btnCancel.removeClass(C_LOADED);
    $search.removeClass(C_FLEX);
    $btnSbTrigger.removeClass(C_UNLOADED);
    $topbarTitle.removeClass(C_UNLOADED);
    $btnSearchTrigger.removeClass(C_UNLOADED);
  }
}

class ResultSwitch {
  static on() {
    if (!ScrollBlocker.resultVisible) {
      // the block method must be called before $(#main-wrapper>.container) unloaded.
      ScrollBlocker.on();
      $resultWrapper.removeClass(C_UNLOADED);
      $content.addClass(C_UNLOADED);
      ScrollBlocker.resultVisible = true;
    }
  }

  static off() {
    if (ScrollBlocker.resultVisible) {
      $results.empty();
      if ($hints.hasClass(C_UNLOADED)) {
        $hints.removeClass(C_UNLOADED);
      }
      $resultWrapper.addClass(C_UNLOADED);
      $content.removeClass(C_UNLOADED);

      // now the release method must be called after $(#main-wrapper>.container) display
      ScrollBlocker.off();

      $input.val('');
      ScrollBlocker.resultVisible = false;
    }
  }
}

function isMobileView() {
  return $btnCancel.hasClass(C_LOADED);
}

// 更新 _javascript/modules/components/search-display.js
// 修改 _javascript/modules/components/search-display.js
export function displaySearch() {
  const $input = $('#search-input');
  const $form = $input.closest('form');
  const $searchCancel = $('#search-cancel');

  // 点击搜索图标仅聚焦输入框（移除原有 ResultSwitch.on()）
  $('#search-trigger').on('click', function () {
    MobileSearchBar.on();
    $input.trigger('focus');
  });

  // 取消按钮仅关闭搜索栏（移除原有 ResultSwitch.off()）
  $searchCancel.on('click', function () {
    MobileSearchBar.off();
    $input.val('');
  });

  // 保留基础交互
  $input.on('focus', () => $search.addClass(C_FOCUS));
  $input.on('focusout', () => $search.removeClass(C_FOCUS));

  // 回车提交表单（确保优先执行）
  $input.on('keypress', function(e) {
    if (e.which === 13) {
      e.preventDefault(); // 阻止默认行为
      $form.submit(); // 直接提交到百度
    }
  });

  // 点击搜索图标提交表单
  $search.find('.fa-search').parent().on('click', function(e) {
    e.preventDefault();
    $form.submit();
  });
}
