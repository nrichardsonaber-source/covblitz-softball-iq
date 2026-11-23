// Run with: node check-scenarios.js   Checks every scenario file for errors and repeats.
const fs = require("fs"), path = require("path");
global.window = {};
const files = ["scenarios.js"].concat(fs.readdirSync(__dirname).filter(f => /^scenarios-batch\d+\.js$/.test(f)).sort());
files.forEach(f => { new Function("window", fs.readFileSync(path.join(__dirname, f), "utf8")).call(null, window); });
const S = window.SCENARIOS, P = window.POSITIONS.map(p => p.id);
let problems = 0; const bad = m => { problems++; console.log("PROBLEM:", m); };
const norm = t => t.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(w => w.length > 2);
const jac = (a, b) => { const A = new Set(a), B = new Set(b); let i = 0; A.forEach(x => B.has(x) && i++); return i / (A.size + B.size - i); };
const seen = { id: {}, title: {}, pre: {}, ball: {}, sig: {} };
S.forEach(s => {
  if (seen.id[s.id]) bad("duplicate id " + s.id); seen.id[s.id] = 1;
  const t = s.title.toLowerCase(); if (seen.title[t]) bad("duplicate title " + s.title); seen.title[t] = 1;
  if (seen.pre[s.pre.q]) bad("duplicate pre question " + s.id); seen.pre[s.pre.q] = 1;
  if (seen.ball[s.play.ball]) bad("duplicate ball text " + s.id); seen.ball[s.play.ball] = 1;
  ["pre", "play"].forEach(k => { const x = s[k]; if (!(x.a >= 0 && x.a < x.opts.length)) bad("bad answer index " + s.id + " " + k); if (new Set(x.opts).size !== x.opts.length) bad("repeated options " + s.id + " " + k); });
  s.positions.forEach(p => P.includes(p) || bad("unknown position " + p + " in " + s.id));
  const h = s.play.hit; if (!h) return bad("no hit data " + s.id);
  const keys = [h.spot].concat(Object.values(h.byPos || {}));
  keys.forEach(k => window.SPOTS[k] || bad("unknown spot " + k + " in " + s.id));
  // same game state + same kind of hit + same where, for an overlapping position = a repeat
  s.positions.forEach(p => {
    const spot = (h.byPos && h.byPos[p]) || h.spot;
    const sig = [p, s.sit.outs, s.sit.runners.join(""), h.type, spot].join("|");
    if (seen.sig[sig]) bad("same situation for " + p + ": " + seen.sig[sig] + " and " + s.id); else seen.sig[sig] = s.id;
  });
});
// wording similarity between any two scenarios
for (let i = 0; i < S.length; i++) for (let j = i + 1; j < S.length; j++) {
  const a = S[i], b = S[j];
  const ta = norm(a.title + " " + a.pre.q + " " + a.play.ball), tb = norm(b.title + " " + b.pre.q + " " + b.play.ball);
  const sim = jac(ta, tb); if (sim > 0.5) bad("very similar wording (" + sim.toFixed(2) + "): " + a.id + " vs " + b.id);
}
console.log("files:", files.join(", "));
console.log("scenarios:", S.length);
console.log("per position:", P.map(p => p + "=" + S.filter(s => s.positions.includes(p)).length).join(" "));
console.log(problems ? problems + " problem(s)" : "No repeats or errors found.");
process.exit(problems ? 1 : 0);
