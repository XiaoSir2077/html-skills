/* Research Report · 标准交互库
   依赖：components.css 的类名体系；原生 JS，无第三方库。
   自动能力：三问法导航平滑滚动、可折叠模块、待办勾选。 */
(function () {
  'use strict';

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* 三问法导航平滑滚动 */
  function bindSmoothScroll() {
    $all('.three-qs a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var target = $(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* 可折叠模块 */
  function bindCollapsible() {
    document.addEventListener('click', function (e) {
      var head = e.target.closest('.collapsible__head');
      if (head) { head.parentElement.classList.toggle('is-open'); }
    });
  }

  /* 待办勾选 */
  function bindTodo() {
    document.addEventListener('click', function (e) {
      var item = e.target.closest('.todo__item');
      if (item) { item.classList.toggle('is-done'); }
    });
  }

  function init() {
    bindSmoothScroll();
    bindCollapsible();
    bindTodo();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
