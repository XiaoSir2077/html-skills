/* ============================================================
   Deep Notes · 标准交互库 v1
   依赖：components.css 的类名体系；原生 JS，无第三方库。
   用法：整段内联到输出 HTML 底部 <script> 中，
        自动能力（目录滚动 / 自测展开 / 矩阵按钮）无需手写代码；
        重交互（计分题 / 雷达图 / 滑块实验）在页面脚本里调用 DN.* 。
   命名空间：window.DN
   ============================================================ */
(function () {
  'use strict';

  var DN = {};

  /* ---------- 工具 ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function cssVar(name) {
    return getComputedStyle(document.body).getPropertyValue(name).trim();
  }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  /* ============================================================
     1. 目录平滑滚动（自动）
     用法：.toc 内 <a href="#sec-id">，自动绑定，无需手写。
     ============================================================ */
  function bindSmoothScroll() {
    $all('.toc a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var target = $(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ============================================================
     2. 自测题点击展开（自动，事件委托）
     用法：<div class="quiz-item"><div class="quiz-item__q">问题</div>
                <div class="quiz-item__a">答案解析</div></div>
     无需任何 onclick。
     ============================================================ */
  function bindQuizItems() {
    document.addEventListener('click', function (e) {
      var item = e.target.closest('.quiz-item');
      if (item) item.classList.toggle('open');
    });
  }

  /* ============================================================
     3. 计分选择题  DN.scoredQuiz(container, questions, opts)
     ----------------------------------------------------------------
     container : 选择器或元素，内部渲染题目（如 <div id="my-quiz">）
     questions : [{
                   q: '题干',
                   options: [{ text: '选项A', ok: true }, { text: '选项B' }],
                   explain: '本题解析（答完显示）'
                 }]
     opts      : { verdict: function(score, total){ return '评语 HTML'; } }
                 不传则使用默认评语。
     交互：点选后立即锁定该题，正确绿 / 错误红并标出正确项，
          展开解析；全部答完显示总分与评语。
     ============================================================ */
  DN.scoredQuiz = function (container, questions, opts) {
    opts = opts || {};
    var root = typeof container === 'string' ? $(container) : container;
    if (!root) return;
    root.classList.add('quiz-multi');

    var answered = 0, score = 0;

    questions.forEach(function (item, qi) {
      var box = el('div', 'mq-item');
      box.appendChild(el('div', 'mq-q', (qi + 1) + '. ' + item.q));

      var optsWrap = el('div', 'mq-opts');
      item.options.forEach(function (opt) {
        var btn = el('button', 'mq-opt', opt.text);
        btn.type = 'button';
        btn.addEventListener('click', function () {
          if (box.dataset.done) return;
          box.dataset.done = '1';
          answered++;
          if (opt.ok) score++;
          $all('.mq-opt', optsWrap).forEach(function (b) {
            b.disabled = true;
            var data = b._dnOpt;
            if (data.ok) b.classList.add('is-correct');
          });
          if (!opt.ok) btn.classList.add('is-wrong');
          var explain = box.querySelector('.mq-explain');
          explain.classList.add('show');
          if (answered === questions.length) {
            var scoreBox = root.querySelector('.mq-score') || el('div', 'mq-score');
            scoreBox.innerHTML = opts.verdict
              ? opts.verdict(score, questions.length)
              : '得分：' + score + ' / ' + questions.length;
            if (!scoreBox.parentNode) root.appendChild(scoreBox);
          }
        });
        btn._dnOpt = opt;
        optsWrap.appendChild(btn);
      });

      box.appendChild(optsWrap);
      box.appendChild(el('div', 'mq-explain', item.explain || ''));
      root.appendChild(box);
    });
    root.appendChild(el('div', 'mq-score'));
  };

  /* ============================================================
     4. 雷达图  DN.radar(canvas, config)
     ----------------------------------------------------------------
     canvas  : canvas 元素或选择器
     config  : {
                 labels: ['维度一', '维度二', ...],   // 3~8 个
                 values: [4, 2.5, ...],              // 与 labels 等长，0~max
                 max: 5,                             // 满分刻度，默认 5
                 levels: 4                           // 背景网格层数，默认 4
               }
     自适应：按 CSS 宽度 × devicePixelRatio 渲染，高分屏不糊；
            窗口 resize 自动重绘。配色全部取当前主题 CSS 变量。
     ============================================================ */
  DN.radar = function (canvas, config) {
    canvas = typeof canvas === 'string' ? $(canvas) : canvas;
    if (!canvas) return;
    var labels = config.labels, values = config.values;
    var max = config.max || 5, levels = config.levels || 4;
    var ctx = canvas.getContext('2d');

    function draw() {
      var dpr = window.devicePixelRatio || 1;
      var W = canvas.clientWidth || 500;
      var H = Math.max(320, Math.min(460, W * 0.82));
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      var cx = W / 2, cy = H / 2;
      var radius = Math.min(W, H) / 2 - 56;
      var n = labels.length;
      var accent = cssVar('--accent') || '#8B5CF6';
      var accent2 = cssVar('--accent-2') || '#A78BFA';
      var border = cssVar('--border') || '#334155';
      var muted = cssVar('--muted') || '#94A3B8';
      var text2 = cssVar('--text-2') || '#D1D5DB';

      function point(i, r) {
        var ang = -Math.PI / 2 + (Math.PI * 2 * i) / n;
        return [cx + Math.cos(ang) * r, cy + Math.sin(ang) * r];
      }

      // 背景网格多边形
      ctx.strokeStyle = border;
      ctx.lineWidth = 1;
      for (var lv = 1; lv <= levels; lv++) {
        ctx.beginPath();
        for (var i = 0; i < n; i++) {
          var p = point(i, radius * lv / levels);
          i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]);
        }
        ctx.closePath();
        ctx.stroke();
      }
      // 轴线
      for (var j = 0; j < n; j++) {
        var ep = point(j, radius);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(ep[0], ep[1]);
        ctx.stroke();
      }
      // 轴标签
      ctx.fillStyle = text2;
      ctx.font = '13px -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (var k = 0; k < n; k++) {
        var lp = point(k, radius + 30);
        ctx.fillText(labels[k], lp[0], lp[1]);
      }
      // 数据多边形
      ctx.beginPath();
      values.forEach(function (v, idx) {
        var dp = point(idx, radius * Math.max(0, Math.min(v, max)) / max);
        idx === 0 ? ctx.moveTo(dp[0], dp[1]) : ctx.lineTo(dp[0], dp[1]);
      });
      ctx.closePath();
      ctx.fillStyle = accent;
      ctx.globalAlpha = 0.22;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = accent2;
      ctx.lineWidth = 2;
      ctx.stroke();
      // 数据点
      values.forEach(function (v, idx) {
        var dp = point(idx, radius * Math.max(0, Math.min(v, max)) / max);
        ctx.beginPath();
        ctx.arc(dp[0], dp[1], 4, 0, Math.PI * 2);
        ctx.fillStyle = accent2;
        ctx.fill();
      });
    }

    draw();
    if (!canvas._dnRadarBound) {
      canvas._dnRadarBound = true;
      window.addEventListener('resize', draw);
    }
  };

  /* ============================================================
     5. 滑块实验  DN.sliders(container, config)
     ----------------------------------------------------------------
     container : 选择器或元素（函数会为其加 .slider-demo 类）
     config    : {
                   title: '实验标题',
                   sliders: [{ key:'a', label:'维度A', min:0, max:5,
                               step:1, value:3, unit:'分' }],
                   compute: function(vals){
                     // vals.a 为当前值；返回结果区 HTML（可为多段）
                     return '当前总分：<b>' + vals.a + '</b>';
                   }
                 }
     ============================================================ */
  DN.sliders = function (container, config) {
    var root = typeof container === 'string' ? $(container) : container;
    if (!root) return;
    root.classList.add('slider-demo');
    if (config.title) root.appendChild(el('div', 'slider-demo__title', config.title));

    var values = {};
    var rows = {};

    config.sliders.forEach(function (s) {
      values[s.key] = s.value;
      var row = el('div', 'slider-demo__row');
      var label = el('span', '', s.label);
      label.style.minWidth = '96px';
      label.style.fontSize = '13px';
      label.style.color = cssVar('--text-2') || '#D1D5DB';
      var input = document.createElement('input');
      input.type = 'range';
      input.min = s.min; input.max = s.max;
      input.step = s.step || 1; input.value = s.value;
      var valBox = el('span', 'slider-demo__value');
      function fmt() { valBox.textContent = s.value + (s.unit != null ? s.unit : ''); }
      fmt();
      input.addEventListener('input', function () {
        values[s.key] = Number(input.value);
        fmt();
        result.innerHTML = config.compute(values);
      });
      row.appendChild(label);
      row.appendChild(input);
      row.appendChild(valBox);
      root.appendChild(row);
      rows[s.key] = row;
    });

    var result = el('div', 'slider-demo__result');
    result.innerHTML = config.compute(values);
    root.appendChild(result);
  };

  /* ============================================================
     6. 矩阵 / 博弈表高亮
     ----------------------------------------------------------------
     HTML：
       <div class="matrix" id="payoff">
         <div class="matrix__row">
           <div class="matrix__cell matrix__cell--head"></div>
           <div class="matrix__cell matrix__cell--head">对手合作</div>
           <div class="matrix__cell matrix__cell--head">对手背叛</div>
         </div>
         <div class="matrix__row">
           <div class="matrix__cell matrix__cell--dim">我合作</div>
           <div class="matrix__cell" data-r="0" data-c="0">+3,+3</div>
           <div class="matrix__cell" data-r="0" data-c="1">-2,+5</div>
         </div>
         ...
       </div>
     方式 A（自动，推荐）：按钮加声明式属性
       <button class="btn" data-matrix="payoff" data-pick="r0">我合作</button>
       data-pick 取值："r0" 高亮整行 / "c1" 高亮整列 / "0,1" 高亮单格
     方式 B（脚本）：DN.matrix.highlight('#payoff', { r: 0 })
                     DN.matrix.clear('#payoff')
     ============================================================ */
  DN.matrix = {
    clear: function (container) {
      var root = typeof container === 'string' ? $(container) : container;
      if (!root) return;
      $all('.matrix__cell.is-hl', root).forEach(function (c) { c.classList.remove('is-hl'); });
    },
    highlight: function (container, pick) {
      var root = typeof container === 'string' ? $(container) : container;
      if (!root) return;
      DN.matrix.clear(root);
      $all('.matrix__cell[data-r]', root).forEach(function (cell) {
        var r = Number(cell.dataset.r), c = Number(cell.dataset.c);
        var hit = false;
        if (pick.r != null && pick.c != null) hit = (r === pick.r && c === pick.c);
        else if (pick.r != null) hit = (r === pick.r);
        else if (pick.c != null) hit = (c === pick.c);
        if (hit) cell.classList.add('is-hl');
      });
    }
  };

  function bindMatrixButtons() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-matrix][data-pick]');
      if (!btn) return;
      var pick = btn.dataset.pick;
      var target = pick.charAt(0) === 'r' ? { r: Number(pick.slice(1)) }
        : pick.charAt(0) === 'c' ? { c: Number(pick.slice(1)) }
        : { r: Number(pick.split(',')[0]), c: Number(pick.split(',')[1]) };
      DN.matrix.highlight('#' + btn.dataset.matrix, target);
    });
  }

  /* ---------- 自动初始化 ---------- */
  function init() {
    bindSmoothScroll();
    bindQuizItems();
    bindMatrixButtons();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.DN = DN;
})();
