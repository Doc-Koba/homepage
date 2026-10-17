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
        if (mant === '10.00') { mant = '1.00'; exp += 1; }   // 9.995 以上は繰り上げる（例：6020人目）
        gcNote.innerHTML = '※モルに換算すると ' + mant + '×10<sup>−' + Math.abs(exp) +
          '</sup> mol です。1 mol（6.02×10<sup>23</sup>人）まで、あと少し……ではありません。数字は数時間おきに更新されます。';
      })
      .catch(function () { /* そのまま */ });
  }

  /* ---------- 掲示板（BBS）：書き込みは見ている人のブラウザの中だけに保存する ---------- */
  var bbsForm = document.getElementById('bbs-form');
  if (bbsForm) {
    var bbsList = document.getElementById('bbs-local');
    var bbsStatus = document.getElementById('bbs-status');
    var delForm = document.getElementById('bbs-del');
    var delStatus = document.getElementById('bbs-del-status');
    var colors = ['ink', 'red', 'blue', 'green', 'purple', 'orange', 'pink'];
    var posts = [];
    try { posts = JSON.parse(load('yk-bbs') || '[]'); } catch (e) { posts = []; }
    if (!Array.isArray(posts)) { posts = []; }

    /* ページに載せてある書き込み（架空のもの・管理人が転載したもの）の番号の最大値と、投稿者・投稿日の行 */
    var FIXED_MAX = 0;
    var fixedMeta = {};
    var fixedList = document.getElementById('bbs-fixed');
    if (fixedList) {
      Array.prototype.forEach.call(fixedList.querySelectorAll('.bbs-no'), function (el) {
        var n = parseInt(el.textContent.replace(/[^0-9]/g, ''), 10);
        if (n > FIXED_MAX) { FIXED_MAX = n; }
      });
      Array.prototype.forEach.call(fixedList.querySelectorAll('.bbs-meta'), function (el) {
        fixedMeta[el.textContent] = true;
      });
    }
    /* ページに転載された書き込みはブラウザの中の控えから外し、番号が重なる書き込みは後ろへずらす */
    var bbsChanged = false;
    posts = posts.filter(function (p) {
      var keep = !!p && typeof p === 'object' && !fixedMeta['投稿者：' + p.name + '　投稿日：' + p.date];
      if (!keep) { bbsChanged = true; }
      return keep;
    });
    if (posts.some(function (p) { return !(p.no > FIXED_MAX); })) {
      posts.forEach(function (p, i) { p.no = FIXED_MAX + 1 + i; });
      bbsChanged = true;
    }

    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var fmtDate = function (d) {
      return d.getFullYear() + '/' + pad(d.getMonth() + 1) + '/' + pad(d.getDate()) +
        '(' + '日月火水木金土'.charAt(d.getDay()) + ') ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    };
    var hashKey = function (k) {   // 削除キーはそのまま保存しない
      var h = 5381;
      for (var i = 0; i < k.length; i++) { h = ((h * 33) ^ k.charCodeAt(i)) >>> 0; }
      return String(h);
    };
    var renderPosts = function () {
      bbsList.textContent = '';
      posts.slice().reverse().forEach(function (p) {
        var art = document.createElement('article');
        art.className = 'bbs-post';
        var head = document.createElement('p');
        head.className = 'bbs-head';
        var no = document.createElement('span');
        no.className = 'bbs-no';
        no.textContent = '[' + p.no + ']';
        var title = document.createElement('span');
        title.textContent = p.title || '（無題）';
        var tag = document.createElement('span');
        tag.className = 'bbs-mine-tag';
        tag.textContent = 'あなたのブラウザにだけ表示中';
        head.appendChild(no);
        head.appendChild(title);
        head.appendChild(tag);
        var meta = document.createElement('p');
        meta.className = 'bbs-meta';
        meta.textContent = '投稿者：' + p.name + '　投稿日：' + p.date;
        var body = document.createElement('div');
        body.className = 'bbs-body c-' + (colors.indexOf(p.color) >= 0 ? p.color : 'ink');
        String(p.msg).split('\n').forEach(function (line, i) {
          if (i) { body.appendChild(document.createElement('br')); }
          body.appendChild(document.createTextNode(line));
        });
        art.appendChild(head);
        art.appendChild(meta);
        art.appendChild(body);
        bbsList.appendChild(art);
      });
    };
    var savePosts = function () { save('yk-bbs', JSON.stringify(posts.slice(-30))); };
    if (bbsChanged) { savePosts(); }
    renderPosts();

    bbsForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('bbs-name').value.trim();
      var title = document.getElementById('bbs-title').value.trim();
      var msg = document.getElementById('bbs-msg').value.trim();
      var key = document.getElementById('bbs-key').value;
      var picked = bbsForm.querySelector('input[name="bbs-color"]:checked');
      if (!name || !msg) {
        bbsStatus.textContent = 'おなまえとメッセージを入れてください m(_ _)m';
        return;
      }
      var next = FIXED_MAX;
      posts.forEach(function (p) { if (p.no > next) { next = p.no; } });
      posts.push({
        no: next + 1, name: name.slice(0, 20), title: title.slice(0, 30), msg: msg.slice(0, 1000),
        color: picked ? picked.value : 'ink', key: key ? hashKey(key) : '', date: fmtDate(new Date())
      });
      savePosts();
      renderPosts();
      bbsForm.reset();
      bbsStatus.textContent = '書き込みました！(^^) ※あなたのブラウザにだけ表示されていて、管理人には届きません。';
    });

    if (delForm) {
      delForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var no = parseInt(document.getElementById('del-no').value, 10);
        var key = document.getElementById('del-key').value;
        if (!(no > 0)) { delStatus.textContent = '記事Noを数字で入れてください。'; return; }
        if (no <= FIXED_MAX) {
          delStatus.textContent = 'この記事は管理人の思い出なので、削除できません(^^;';
          return;
        }
        for (var i = 0; i < posts.length; i++) {
          if (posts[i].no === no) {
            if (!posts[i].key || posts[i].key !== hashKey(key)) {
              delStatus.textContent = '削除キーが違います。';
              return;
            }
            posts.splice(i, 1);
            savePosts();
            renderPosts();
            delForm.reset();
            delStatus.textContent = '記事No.' + no + ' を削除しました。';
            return;
          }
        }
        delStatus.textContent = 'その記事Noは見つかりませんでした。';
      });
    }
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
      { f: '凶', t: 'Reviewer 4 があらわれます(^^; 深呼吸してから返事を書きましょう。', l: 'ていねい語' },
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
