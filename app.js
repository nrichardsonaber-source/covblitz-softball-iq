(function () {
  "use strict";
  var app = document.getElementById("app");
  var titleEl = document.getElementById("title");
  var backBtn = document.getElementById("back");
  var trophyBtn = document.getElementById("trophy");
  var tabs = document.querySelectorAll(".tab");
  var CFG = window.CONFIG || {};
  var ROUND_LEN = 10;

  var state = { tab: "fielding", view: "home", pos: null, mode: null, queue: [], i: 0, stage: "pre",
                score: 0, streak: 0, right: 0, answered: 0, t0: 0, returnTo: null };

  // ---------- storage (safe if blocked) ----------
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  var stats = store.get("softball-stats", {});
  var profile = store.get("softball-profile", null); // { name, team }
  var pending = store.get("softball-pending", []);

  // ---------- helpers ----------
  function el(html) { var d = document.createElement("div"); d.innerHTML = html; return d.firstElementChild; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function shuffle(arr) { var a = arr.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function posName(id) { for (var i = 0; i < POSITIONS.length; i++) if (POSITIONS[i].id === id) return POSITIONS[i].name; return id; }
  function scenariosFor(pos) { return SCENARIOS.filter(function (s) { return s.positions.indexOf(pos) !== -1; }); }
  function setHeader(t, showBack) { titleEl.textContent = t; backBtn.hidden = !showBack; }
  function cleanTeam(t) { return String(t || "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 30); }

  // ---------- situations: live from the database, cached for offline ----------
  var SCN_KEY = "softball-scn-v1";
  function resolveSpot(v) {
    if (Array.isArray(v) && v.length === 2 && isFinite(v[0]) && isFinite(v[1])) return [Number(v[0]), Number(v[1])];
    return typeof v === "string" ? SPOTS[v] : undefined;
  }
  function posIds() { return POSITIONS.map(function (p) { return p.id; }); }
  function validStep(x, needBall) {
    return x && typeof x === "object" && typeof x.q === "string" && typeof x.why === "string" && Array.isArray(x.opts) &&
      x.opts.length >= 2 && x.opts.length <= 5 && x.opts.every(function (o) { return typeof o === "string"; }) &&
      Number.isInteger(x.a) && x.a >= 0 && x.a < x.opts.length && (!needBall || typeof x.ball === "string");
  }
  // A malformed row is skipped instead of breaking the app.
  function validScenario(s) {
    try {
      if (!s || typeof s.id !== "string" || typeof s.title !== "string") return false;
      var ids = posIds();
      if (!Array.isArray(s.positions) || !s.positions.length || !s.positions.every(function (p) { return ids.indexOf(p) !== -1; })) return false;
      var sit = s.sit;
      if (!sit || !Array.isArray(sit.runners) || !sit.runners.every(function (b) { return b === 1 || b === 2 || b === 3; })) return false;
      if (!(sit.outs >= 0 && sit.outs <= 2) || typeof sit.score !== "string" || typeof sit.inning !== "string") return false;
      if (!validStep(s.pre, false) || !validStep(s.play, true)) return false;
      var h = s.play.hit;
      if (!h || !TYPE_LABEL[h.type] || typeof h.label !== "string" || !resolveSpot(h.spot)) return false;
      if (h.byPos) { for (var k in h.byPos) { if (ids.indexOf(k) === -1 || !resolveSpot(h.byPos[k])) return false; } }
      return true;
    } catch (e) { return false; }
  }
  function useScenarios(list, persist) {
    if (!list.length) return false;
    window.SCENARIOS = list;
    if (persist) store.set(SCN_KEY, list);
    return true;
  }
  function syncScenarios() {
    if (!CFG.SUPABASE_URL || !navigator.onLine) return;
    fetch(CFG.SUPABASE_URL + "/rest/v1/scenarios?select=id,positions,title,sit,pre,play&active=eq.true&order=id", {
      headers: { "apikey": CFG.SUPABASE_KEY, "Authorization": "Bearer " + CFG.SUPABASE_KEY }
    }).then(function (r) { if (!r.ok) throw new Error("bad"); return r.json(); }).then(function (rows) {
      if (useScenarios((rows || []).filter(validScenario), true)) {
        if (state.view === "home") renderHome(); else if (state.view === "pos") renderPositionMenu();
      }
    }).catch(function () {});
  }

  // ---------- field drawing ----------
  var FIELDERS = { P: "P", C: "C", "1B": "1B", "2B": "2B", SS: "SS", "3B": "3B", LF: "LF", LCF: "LCF", RCF: "RCF", RF: "RF" };
  var TYPE_LABEL = { ground: "Ground ball", line: "Line drive", fly: "Fly ball", pop: "Pop-up" };

  function fieldSvg(sit, hit, pos) {
    var S = SPOTS, h = S.home;
    var o = '<svg class="field" viewBox="0 0 200 200" role="img" aria-label="Softball field">';
    o += '<defs><marker id="ah" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#fff"/></marker></defs>';
    o += '<path d="M100,172 L4,76 Q100,-50 196,76 Z" fill="#1f5a35" stroke="#fff" stroke-width="1.5"/>';
    o += '<polygon points="100,178 150,134 100,88 50,134" fill="#8a6a45" opacity=".55"/>';
    o += '<polygon points="100,172 138,134 100,96 62,134" fill="#2a7a47"/>';
    // bases and runners
    [[1, S.b1], [2, S.b2], [3, S.b3]].forEach(function (b) {
      var has = sit && sit.runners.indexOf(b[0]) !== -1, x = b[1][0], y = b[1][1];
      o += '<rect x="' + (x - 5) + '" y="' + (y - 5) + '" width="10" height="10" transform="rotate(45 ' + x + ' ' + y + ')" fill="' + (has ? "#facc15" : "#fff") + '"/>';
      if (has) o += '<circle cx="' + x + '" cy="' + (y + 11) + '" r="4.5" fill="#facc15" stroke="#7c5e00" stroke-width="1"/>';
    });
    o += '<polygon points="100,167 105,171 103,177 97,177 95,171" fill="#fff"/>';
    // hit path
    var end = null;
    if (hit) {
      var key = hit.byPos && hit.byPos[pos] ? hit.byPos[pos] : hit.spot;
      end = resolveSpot(key);
      var x0 = h[0], y0 = h[1] - 4, x1 = end[0], y1 = end[1];
      var mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
      if (hit.type === "fly") o += '<path d="M' + x0 + ',' + y0 + ' Q' + mx + ',' + (my - 42) + ' ' + x1 + ',' + y1 + '" fill="none" stroke="#fff" stroke-width="2" marker-end="url(#ah)"/>';
      else if (hit.type === "pop") o += '<path d="M' + x0 + ',' + y0 + ' Q' + (mx - 6) + ',' + (my - 62) + ' ' + x1 + ',' + y1 + '" fill="none" stroke="#fff" stroke-width="2" marker-end="url(#ah)"/>';
      else if (hit.type === "line") o += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + x1 + '" y2="' + y1 + '" stroke="#fff" stroke-width="2.5" marker-end="url(#ah)"/>';
      else o += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + x1 + '" y2="' + y1 + '" stroke="#fff" stroke-width="2.5" stroke-dasharray="1 5" stroke-linecap="round" marker-end="url(#ah)"/>';
      o += '<circle cx="' + x1 + '" cy="' + y1 + '" r="3.5" fill="#fff" stroke="#111" stroke-width="1"/>';
    }
    // fielders
    Object.keys(FIELDERS).forEach(function (id) {
      var p = S[id], me = id === pos;
      o += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (me ? 6.5 : 4.5) + '" fill="' + (me ? "#4ade80" : "#0b1410") + '" stroke="' + (me ? "#052e14" : "#9db3a5") + '" stroke-width="1.5"/>';
      o += '<text x="' + p[0] + '" y="' + (p[1] - (me ? 9 : 7)) + '" text-anchor="middle" font-size="' + (me ? 9 : 7) + '" font-weight="' + (me ? 700 : 400) + '" fill="#fff">' + id + '</text>';
    });
    return o + "</svg>";
  }

  function chipsHtml(sit) {
    var rn = sit.runners.length ? sit.runners.map(function (b) { return ["", "1st", "2nd", "3rd"][b]; }).join(", ") : "none";
    var dots = ""; for (var i = 0; i < 3; i++) dots += i < sit.outs ? "● " : "○ ";
    return '<div><span class="chip">' + esc(sit.inning) + ' inning</span><span class="chip">' + esc(sit.score) + '</span>' +
      '<span class="chip">Outs ' + dots + '</span><span class="chip">Runners: ' + rn + '</span></div>';
  }

  // ---------- scoring ----------
  function calcPoints(ok, secs) {
    if (!ok) { state.streak = 0; return 0; }
    state.streak++;
    var base = 10;
    var speed = secs <= 8 ? 5 : secs <= 15 ? 3 : secs <= 25 ? 1 : 0;
    var streak = Math.min(10, (state.streak - 1) * 2);
    return base + speed + streak;
  }

  // ---------- leaderboard sync ----------
  function api(path, body) {
    return fetch(CFG.SUPABASE_URL + path, {
      method: "POST",
      headers: { "apikey": CFG.SUPABASE_KEY, "Authorization": "Bearer " + CFG.SUPABASE_KEY, "Content-Type": "application/json", "Prefer": "return=minimal" },
      body: JSON.stringify(body)
    });
  }
  var flushing = false;
  function flush() {
    if (flushing || !pending.length || !CFG.SUPABASE_URL || !navigator.onLine) return;
    flushing = true;
    var batch = pending.slice(0, 50);
    var ok = false;
    api("/rest/v1/answers", batch).then(function (r) {
      if (r.ok || (r.status >= 400 && r.status < 500)) { ok = true; pending = pending.slice(batch.length); store.set("softball-pending", pending); } // 4xx = bad row, drop it
    }).catch(function () {}).then(function () { flushing = false; if (pending.length) setTimeout(flush, ok ? 300 : 5000); });
  }
  function record(row) {
    if (!profile) return;
    row.team = profile.team; row.player = profile.name;
    pending.push(row); store.set("softball-pending", pending); flush();
  }
  window.addEventListener("online", flush);

  // ---------- views ----------
  function renderHome() {
    state.view = "home"; setHeader("Softball IQ", false);
    app.innerHTML = "";
    if (state.tab !== "fielding") {
      app.appendChild(el('<div class="soon"><h2>' + (state.tab === "batting" ? "Batting" : "Base running") + '</h2><p>Coming next. Fielding is built first.</p></div>'));
      return;
    }
    var rnd = el('<button class="btn primary">🎲 Random position round (' + ROUND_LEN + ' situations)</button>');
    rnd.onclick = function () { withProfile(startRandom); };
    app.appendChild(rnd);
    app.appendChild(el("<h2>Or pick your position</h2>"));
    var grid = el('<div class="grid"></div>');
    POSITIONS.forEach(function (p) {
      var b = el('<button class="btn">' + esc(p.id) + '<small>' + esc(p.name) + ' &middot; ' + scenariosFor(p.id).length + ' situations</small></button>');
      b.onclick = function () { state.pos = p.id; renderPositionMenu(); };
      grid.appendChild(b);
    });
    app.appendChild(grid);
    app.appendChild(el('<div class="stats">' + (profile ? 'Playing as ' + esc(profile.name) + ' · team ' + esc(profile.team) : 'Tap 🏆 to join your team leaderboard') + '</div>'));
  }

  function renderPositionMenu() {
    state.view = "pos"; setHeader(posName(state.pos), true);
    app.innerHTML = "";
    app.appendChild(el("<h2>How do you want to use it?</h2>"));
    var q = el('<button class="btn primary">Quiz me</button>'); q.onclick = function () { withProfile(startPositionQuiz); };
    var r = el('<button class="btn">Game-day reference (cheat sheet)</button>'); r.onclick = renderReference;
    app.appendChild(q); app.appendChild(r);
  }

  // Ask for name + team once, but let people skip.
  function withProfile(next) {
    if (profile || state.skipProfile) return next();
    renderProfileForm(next);
  }

  function renderProfileForm(next) {
    state.view = "profile"; setHeader("Join your team", true);
    app.innerHTML = "";
    app.appendChild(el("<h2>Who's playing?</h2>"));
    app.appendChild(el('<p class="sub">Your name and team code put you on the leaderboard. Everyone on the team uses the same team code. No password or email.</p>'));
    var f = el('<div class="card"><label>Your name<input id="pn" maxlength="20" autocomplete="off" value="' + esc(profile ? profile.name : "") + '"></label>' +
      '<label>Team code<input id="pt" maxlength="30" autocomplete="off" autocapitalize="none" placeholder="e.g. coventry-sluggers" value="' + esc(profile ? profile.team : "") + '"></label>' +
      '<div class="err" id="pe"></div></div>');
    var save = el('<button class="btn primary">Save and continue</button>');
    var skip = el('<button class="btn">Play without the leaderboard</button>');
    save.onclick = function () {
      var name = f.querySelector("#pn").value.trim(), team = cleanTeam(f.querySelector("#pt").value);
      if (!name) { f.querySelector("#pe").textContent = "Enter your name."; return; }
      if (team.length < 3) { f.querySelector("#pe").textContent = "Team code needs at least 3 letters or numbers."; return; }
      profile = { name: name, team: team }; store.set("softball-profile", profile);
      next ? next() : renderLeaderboard();
    };
    skip.onclick = function () { state.skipProfile = true; if (next) next(); else renderHome(); };
    app.appendChild(f); app.appendChild(save); app.appendChild(skip);
  }

  // ---------- quiz ----------
  function resetRound() { state.score = 0; state.streak = 0; state.right = 0; state.answered = 0; state.i = 0; state.stage = "pre"; }

  function startPositionQuiz() {
    state.mode = "position"; resetRound();
    state.queue = shuffle(scenariosFor(state.pos)).map(function (s) { return { s: s, pos: state.pos }; });
    renderQuestion();
  }

  function startRandom() {
    state.mode = "random"; resetRound();
    var used = {}, q = [], guard = 0;
    while (q.length < ROUND_LEN && guard++ < 200) {
      var p = pick(POSITIONS).id, opts = scenariosFor(p).filter(function (s) { return !used[s.id + p]; });
      if (!opts.length) continue;
      var s = pick(opts); used[s.id + p] = 1; q.push({ s: s, pos: p });
    }
    state.queue = q; renderQuestion();
  }

  function renderQuestion() {
    state.view = "quiz";
    var item = state.queue[state.i];
    if (!item) return renderDone();
    var s = item.s, pos = item.pos, st = state.stage === "pre" ? s.pre : s.play;
    setHeader((state.mode === "random" ? "🎲 " : "") + posName(pos) + " · " + (state.i + 1) + "/" + state.queue.length, true);
    app.innerHTML = "";
    app.appendChild(el('<div class="scorebar"><span>Score <b>' + state.score + '</b></span><span>Streak <b>' + state.streak + '</b></span></div>'));
    if (state.mode === "random") app.appendChild(el('<div class="youare">You are the <b>' + esc(posName(pos)) + '</b> (' + esc(pos) + ')</div>'));
    app.appendChild(el('<div class="stage">' + (state.stage === "pre" ? "Step 1 · Before the pitch" : "Step 2 · Ball in play") + '</div>'));
    app.appendChild(el('<h2>' + esc(s.title) + '</h2>'));
    var hit = state.stage === "play" ? s.play.hit : null;
    app.appendChild(el(fieldSvg(s.sit, hit, pos)));
    if (hit) app.appendChild(el('<div class="hitlabel"><b>' + TYPE_LABEL[hit.type] + '</b> · ' + esc(hit.label) + '</div>'));
    app.appendChild(el(chipsHtml(s.sit)));
    if (state.stage === "play") app.appendChild(el('<p class="ball">' + esc(s.play.ball) + '</p>'));
    app.appendChild(el('<p>' + esc(st.q) + '</p>'));

    state.t0 = Date.now();
    var order = shuffle(st.opts.map(function (t, idx) { return { t: t, idx: idx }; }));
    var answered = false, holder = el("<div></div>");
    order.forEach(function (o) {
      var b = el('<button class="opt">' + esc(o.t) + '</button>');
      b.onclick = function () {
        if (answered) return; answered = true;
        var ok = o.idx === st.a, secs = (Date.now() - state.t0) / 1000;
        var pts = calcPoints(ok, secs);
        state.score += pts; state.answered++; if (ok) state.right++;
        var key = s.id + ":" + state.stage, rec = stats[key] || { right: 0, total: 0 };
        rec.total++; if (ok) rec.right++; stats[key] = rec; store.set("softball-stats", stats);
        record({ scenario_id: s.id, stage: state.stage, position: pos, mode: state.mode, correct: ok, points: pts });
        Array.prototype.forEach.call(holder.children, function (c, i) {
          c.disabled = true;
          if (order[i].idx === st.a) c.classList.add("correct"); else if (c === b) c.classList.add("wrong");
        });
        app.appendChild(el('<div class="why"><strong>' + (ok ? "Right! +" + pts + " pts" : "Not quite. +0") + '</strong> ' + esc(st.why) + '</div>'));
        var last = state.stage === "play" && state.i + 1 >= state.queue.length;
        var next = el('<button class="btn primary">' + (state.stage === "pre" ? "Ball is hit →" : (last ? "Finish round" : "Next situation →")) + '</button>');
        next.onclick = function () {
          if (state.stage === "pre") state.stage = "play"; else { state.stage = "pre"; state.i++; }
          renderQuestion(); window.scrollTo(0, 0);
        };
        app.appendChild(next);
        if (next.scrollIntoView) next.scrollIntoView({ block: "nearest", behavior: "smooth" });
      };
      holder.appendChild(b);
    });
    app.appendChild(holder);
  }

  function renderDone() {
    state.view = "done"; setHeader("Round complete", true);
    app.innerHTML = "";
    var pct = state.answered ? Math.round(100 * state.right / state.answered) : 0;
    app.appendChild(el('<div class="card big"><div class="bigscore">' + state.score + '</div><div>points</div><div class="sub">' + state.right + ' of ' + state.answered + ' right (' + pct + '%)</div></div>'));
    if (profile) app.appendChild(el('<p class="sub">Your best score on each situation counts toward the leaderboard, so replaying only helps if you beat your earlier answer.</p>'));
    var again = el('<button class="btn primary">Play again</button>');
    again.onclick = function () { state.mode === "random" ? startRandom() : startPositionQuiz(); };
    app.appendChild(again);
    if (profile) { var lb = el('<button class="btn">🏆 See the leaderboard</button>'); lb.onclick = renderLeaderboard; app.appendChild(lb); }
    var home = el('<button class="btn">Back to start</button>'); home.onclick = renderHome; app.appendChild(home);
  }

  // ---------- reference ----------
  function renderReference() {
    state.view = "ref"; setHeader(posName(state.pos) + " · cheat sheet", true);
    app.innerHTML = "";
    scenariosFor(state.pos).forEach(function (s) {
      var h = s.play.hit;
      app.appendChild(el('<details class="card"><summary>' + esc(s.title) + '</summary>' + chipsHtml(s.sit) +
        '<div class="k">Before the pitch</div><p>' + esc(s.pre.q) + '</p><p><strong>' + esc(s.pre.opts[s.pre.a]) + '</strong></p><p class="sub">' + esc(s.pre.why) + '</p>' +
        '<div class="k">Ball in play</div>' + fieldSvg(s.sit, h, state.pos) + '<div class="hitlabel"><b>' + TYPE_LABEL[h.type] + '</b> · ' + esc(h.label) + '</div>' +
        '<p class="ball">' + esc(s.play.ball) + '</p><p><strong>' + esc(s.play.opts[s.play.a]) + '</strong></p><p class="sub">' + esc(s.play.why) + '</p></details>'));
    });
  }

  // ---------- leaderboard ----------
  function renderLeaderboard(days) {
    if (!profile) return renderProfileForm(function () { renderLeaderboard(7); });
    if (typeof days !== "number" && days !== null) days = 7;
    state.view = "lb"; setHeader("🏆 " + profile.team, true);
    app.innerHTML = "";
    var tog = el('<div class="row"><button class="btn ' + (days === 7 ? "primary" : "") + '">This week</button><button class="btn ' + (days === null ? "primary" : "") + '">All time</button></div>');
    tog.children[0].onclick = function () { renderLeaderboard(7); };
    tog.children[1].onclick = function () { renderLeaderboard(null); };
    app.appendChild(tog);
    var box = el('<div class="card" style="margin-top:12px"><div class="sub">Loading…</div></div>');
    app.appendChild(box);
    var chg = el('<button class="btn">Change name or team (' + esc(profile.name) + ')</button>');
    chg.onclick = function () { renderProfileForm(function () { renderLeaderboard(days); }); };
    app.appendChild(chg);
    app.appendChild(el('<div class="stats">Points: 10 per right answer, up to +5 for speed and up to +10 for a streak. Only your best score on each situation counts.</div>'));
    flush();
    api("/rest/v1/rpc/leaderboard", { p_team: profile.team, p_days: days }).then(function (r) {
      if (!r.ok) throw new Error("bad");
      return r.json();
    }).then(function (rows) {
      if (!rows.length) { box.innerHTML = '<div class="sub">No scores yet. Play a round to get on the board.</div>'; return; }
      var h = '<table class="lb"><tr><th>#</th><th>Player</th><th>Pts</th><th>Acc</th></tr>';
      rows.forEach(function (r) {
        var me = r.player === profile.name;
        h += '<tr class="' + (me ? "me" : "") + '"><td>' + r.rank + '</td><td>' + esc(r.player) + '</td><td>' + r.points + '</td><td>' + r.accuracy + '%</td></tr>';
      });
      box.innerHTML = h + "</table>";
    }).catch(function () { box.innerHTML = '<div class="sub">Couldn’t load the leaderboard. Check your connection and try again.</div>'; });
  }

  // ---------- navigation ----------
  backBtn.onclick = function () {
    if (state.view === "quiz" || state.view === "done" || state.view === "ref") { state.mode === "random" && state.view !== "ref" ? renderHome() : (state.pos ? renderPositionMenu() : renderHome()); }
    else renderHome();
  };
  trophyBtn.onclick = function () { renderLeaderboard(7); };
  Array.prototype.forEach.call(tabs, function (t) {
    t.onclick = function () {
      state.tab = t.getAttribute("data-tab");
      Array.prototype.forEach.call(tabs, function (x) { x.classList.toggle("active", x === t); });
      renderHome();
    };
  });

  var cached = (store.get(SCN_KEY, []) || []).filter(validScenario);
  useScenarios(cached, false);
  renderHome(); flush(); syncScenarios();
  window.addEventListener("online", syncScenarios);
  if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) navigator.serviceWorker.register("sw.js").catch(function () {});
})();
