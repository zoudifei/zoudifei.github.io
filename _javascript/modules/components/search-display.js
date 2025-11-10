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
export function displaySearch() {
  const $input = $('#search-input');
  const $form = $input.closest('form');

  // 点击搜索图标聚焦输入框
  $('#search-trigger').on('click', function () {
    MobileSearchBar.on();
    $input.trigger('focus');
  });

  // 取消按钮逻辑
  $('#search-cancel').on('click', function () {
    MobileSearchBar.off();
    $input.val('');
  });

  // 回车提交表单（确保覆盖所有提交场景）
  $input.on('keypress', function(e) {
    if (e.which === 13) {
      e.preventDefault();
      $form.submit();
    }
  });

  // 点击搜索图标提交（如果有图标点击事件）
  $form.find('i.fa-search').parent().on('click', function(e) {
    e.preventDefault();
    $form.submit();
  });
}
