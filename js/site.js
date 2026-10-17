/* 小林由幸のホームページ  小さな仕掛け
   Web拍手 / マウスキラキラ / 研究おみくじ
   どれも閲覧者のブラウザの中だけで動き、管理人やどこかのサーバーには何も送りません。 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function load(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function save(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* 保存できない環境では何もしない */ }
  }

  /* ---------- 背景アニメ（ベンゼンと鳩）の ON / OFF。全ページ共通で覚えておく ---------- */
  var root = document.documentElement;
  var bgStill = load('yk-bg') === 'off';
  if (bgStill) { root.classList.add('bg-still'); }
  var bgBtn = document.getElementById('bg-btn');
  if (bgBtn) {
    var bgRow = document.getElementById('bg-row');
    if (reduceMotion) {
      if (bgRow) { bgRow.hidden = true; }
    } else {
      var renderBg = function () {
        bgBtn.textContent = bgStill ? '背景アニメ：OFF' : '背景アニメ：ON';
        bgBtn.setAttribute('aria-pressed', bgStill ? 'false' : 'true');
      };
      renderBg();
      bgBtn.addEventListener('click', function () {
        bgStill = !bgStill;
        root.classList.toggle('bg-still', bgStill);
        save('yk-bg', bgStill ? 'off' : 'on');
        renderBg();
      });
    }
  }

  /* ---------- アクセスカウンター（GoatCounter の合計を平成風の7けたで表示） ----------
     数が取れないとき（集計前・広告ブロックなど）は、最初から書いてある「1 mol 人目」のまま */
  var gcCount = document.getElementById('gc-count');
  var gcNote = document.getElementById('gc-note');
  if (gcCount && gcNote && window.fetch) {
    fetch('https://yoshiyukikobayashi.goatcounter.com/counter/TOTAL.json')
      .then(function (r) {
        if (!r.ok) { throw new Error('HTTP ' + r.status); }
        return r.json();
      })
      .then(function (d) {
        var n = parseInt(String(d && d.count).replace(/[^0-9]/g, ''), 10);
        if (!(n > 0)) { throw new Error('no count'); }
        var s = String(n);
        while (s.length < 7) { s = '0' + s; }
        gcCount.textContent = s;
        var mol = n / 6.02214076e23;
        var exp = Math.floor(Math.log(mol) / Math.LN10);
        var mant = (mol / Math.pow(10, exp)).toFixed(2);
        gcNote.innerHTML = '※モルに換算すると ' + mant + '×10<sup>−' + Math.abs(exp) +
          '</sup> mol です。1 mol（6.02×10<sup>23</sup>人）まで、あと少し……ではありません。数字は数時間おきに更新されます。';
      })
      .catch(function () { /* そのまま */ });
  }

  /* ---------- Web拍手 ---------- */
  var clapBtn = document.getElementById('clap-btn');
  var clapMsg = document.getElementById('clap-msg');
  if (clapBtn && clapMsg) {
    clapBtn.addEventListener('click', function () {
      var n = parseInt(load('yk-clap') || '0', 10);
      if (isNaN(n)) { n = 0; }
      n += 1;
      save('yk-clap', String(n));
      clapMsg.textContent = '拍手ありがとうございます！(^^) これで' + n +
        '回目です。※この拍手は管理人に届かない仕組みです。お気持ちだけいただきます。';
    });
  }

  /* ---------- マウスキラキラ（マウスのある画面だけ） ---------- */
  var kiraBtn = document.getElementById('kira-btn');
  if (kiraBtn) {
    var finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    var kiraRow = document.getElementById('kira-row');
    if (!finePointer || reduceMotion) {
      if (kiraRow) { kiraRow.hidden = true; }
    } else {
      var kiraOn = load('yk-kira') === '1';
      var renderKira = function () {
        kiraBtn.textContent = kiraOn ? 'マウスキラキラ：ON' : 'マウスキラキラ：OFF';
        kiraBtn.setAttribute('aria-pressed', kiraOn ? 'true' : 'false');
      };
      renderKira();
      kiraBtn.addEventListener('click', function () {
        kiraOn = !kiraOn;
        save('yk-kira', kiraOn ? '1' : '0');
        renderKira();
      });
      var stars = ['☆', '★', '✧', '・'];
      var last = 0;
      document.addEventListener('mousemove', function (e) {
        if (!kiraOn) { return; }
        var now = Date.now();
        if (now - last < 45) { return; }
        last = now;
        var s = document.createElement('span');
        s.className = 'kira';
        s.setAttribute('aria-hidden', 'true');
        s.textContent = stars[Math.floor(Math.random() * stars.length)];
        s.style.left = e.clientX + 'px';
        s.style.top = e.clientY + 'px';
        s.style.color = 'hsl(' + Math.floor(Math.random() * 360) + ', 90%, 55%)';
        document.body.appendChild(s);
        window.setTimeout(function () { s.remove(); }, 800);
      });
    }
  }

  /* ---------- 研究おみくじ ---------- */
  var omikujiBtn = document.getElementById('omikuji-btn');
  if (omikujiBtn) {
    var box = document.getElementById('omikuji-box');
    var fortune = document.getElementById('omikuji-fortune');
    var text = document.getElementById('omikuji-text');
    var lucky = document.getElementById('omikuji-lucky');
    var results = [
      { f: '大吉', t: '投稿した論文が一発でアクセプト。今日は帰りにケーキを買いましょう。', l: 'ORCID' },
      { f: '中吉', t: '査読の結果は Minor revision。ゴールはすぐそこです。', l: '付箋' },
      { f: '小吉', t: '共著者からの返信が、その日のうちに届きます。', l: '共有カレンダー' },
      { f: '吉', t: '解析のコードが、エラーなしで最後まで動きます。', l: 'コーヒー' },
      { f: '末吉', t: 'データの前処理が、見積もりの2倍の時間で終わります（いつもは3倍）。', l: '正規表現' },
      { f: '凶', t: 'Reviewer 2 があらわれます(^^; 深呼吸してから返事を書きましょう。', l: 'ていねい語' },
      { f: '大凶', t: '保存する前にソフトが落ちます。こまめに保存しましょう。', l: 'Ctrl + S' }
    ];
    var lastIndex = -1;
    omikujiBtn.addEventListener('click', function () {
      var i = Math.floor(Math.random() * results.length);
      if (i === lastIndex) { i = (i + 1) % results.length; }
      lastIndex = i;
      var r = results[i];
      fortune.textContent = r.f;
      text.textContent = r.t;
      lucky.textContent = 'ラッキーアイテム：' + r.l;
      omikujiBtn.textContent = 'もう一度引く';
      if (!reduceMotion && box) {
        box.classList.remove('shake');
        void box.offsetWidth;
        box.classList.add('shake');
      }
    });
  }
})();
