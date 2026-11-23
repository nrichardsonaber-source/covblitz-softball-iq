// Scenario library for the Softball Situational Awareness app (slow-pitch, 10 fielders).
// Each scenario has a PRE-PLAY call (before the pitch) and an IN-PLAY decision (ball is hit).
// `a` is the index of the correct option. Add more scenarios by copying an entry.
// sit.runners: array of bases occupied, e.g. [1,3] = runners on first and third.

window.POSITIONS = [
  { id: "P",   name: "Pitcher" },
  { id: "C",   name: "Catcher" },
  { id: "1B",  name: "First Base" },
  { id: "2B",  name: "Second Base" },
  { id: "SS",  name: "Shortstop" },
  { id: "3B",  name: "Third Base" },
  { id: "LF",  name: "Left Field" },
  { id: "LCF", name: "Left-Center Field" },
  { id: "RCF", name: "Right-Center Field" },
  { id: "RF",  name: "Right Field" }
];

window.SCENARIOS = [
  // ---------- SHARED: pop-up / infield fly ----------
  {
    id: "pop-infield-fly",
    positions: ["P", "C", "1B", "2B", "SS", "3B"],
    title: "Infield fly",
    sit: { outs: 1, runners: [1, 2], score: "Tied", inning: "5th" },
    pre: {
      q: "Runners on 1st and 2nd, 1 out. A pop-up on the infield is hit. What rule do you need to be thinking about before the pitch?",
      opts: [
        "Infield fly rule: the batter is out on a catchable pop-up, so the runners are not forced",
        "Nothing special. Every pop-up is the same",
        "Drop it on purpose to get a double play"
      ],
      a: 0,
      why: "With fewer than 2 outs and runners on 1st and 2nd (or loaded), a catchable infield pop-up is an automatic out for the batter. It stops fielders getting a cheap double play by dropping it. Runners can still advance at their own risk."
    },
    play: {
      ball: "High pop-up between you, the shortstop and the third baseman.",
      q: "Who takes it, and what do you do?",
      opts: [
        "Nobody calls it, everyone drifts in and hopes",
        "Call it loudly ('Mine! Mine!') early. The player with the best angle (usually the shortstop over the third baseman) takes it. The others peel off and stay clear",
        "Wait until the last second, then call it"
      ],
      a: 1,
      why: "Call it early and loud, and repeat it. Priority is to the player with the best read. In the infield that is normally the shortstop over the third baseman and second baseman, and infielders over the catcher. An outfielder running in has priority over an infielder because they see the ball coming toward them. Everyone else clears out and eyes the runners."
    }
  },

  // ---------- PITCHER ----------
  {
    id: "p-cover1",
    positions: ["P"],
    title: "Cover first on a ball to the right side",
    sit: { outs: 0, runners: [], score: "Down 1", inning: "6th" },
    pre: {
      q: "Nobody on, nobody out. After you deliver the pitch, what is your job if the ball is hit on the ground to the right side?",
      opts: [
        "Stay on the mound and watch",
        "Break toward first base to cover it if the first baseman has to go get the ball",
        "Back up third base"
      ],
      a: 1,
      why: "A pitcher who finishes the pitch is the 5th infielder. On any ground ball to the first baseman's side, the first baseman may be pulled off the bag, and the pitcher must be on the way to first."
    },
    play: {
      ball: "Grounder hits the first baseman's glove side. He ranges well off the bag and fields it.",
      q: "What do you do?",
      opts: [
        "Sprint to the bag, run the inside of the foul line, take the toss and step on the bag",
        "Yell for the first baseman to run it himself",
        "Stand at the mound and wait for the throw"
      ],
      a: 0,
      why: "Run to the bag on a path that gets you there early, give the first baseman a target, and catch the toss in stride. Step on the inside corner of the bag and avoid the runner. Take the toss and keep moving."
    }
  },
  {
    id: "p-backup",
    positions: ["P"],
    title: "Back up home or third",
    sit: { outs: 1, runners: [2], score: "Tied", inning: "7th" },
    pre: {
      q: "Runner on 2nd, 1 out, tied. A base hit to the outfield looks likely. Where do you head after the pitch if the ball is hit to the outfield?",
      opts: [
        "Toward the dugout",
        "Toward the base the throw is going to: home or third, positioned behind it in line with the throw to back it up",
        "Stay on the mound"
      ],
      a: 1,
      why: "Pitchers back up the base where the throw is going. Overthrows are what turn a single into a 2-run inning. Be 15 to 20 feet behind the base on the line of the throw."
    },
    play: {
      ball: "Single to left field. The runner is rounding third and the throw is coming home.",
      q: "Where do you go?",
      opts: [
        "Behind home plate in line with the throw, to back up any overthrow or relay",
        "Back up first base",
        "Walk toward the cutoff man"
      ],
      a: 0,
      why: "With a throw to the plate, you back up home. You can also read the play: if the throw is cut, the cutoff man may need a target to throw to another base."
    }
  },

  // ---------- CATCHER ----------
  {
    id: "c-set-plate",
    positions: ["C"],
    title: "Setting up for a play at the plate",
    sit: { outs: 1, runners: [3], score: "Up 1", inning: "7th" },
    pre: {
      q: "Runner on third, 1 out, up by 1. A base hit would tie it. Where should you set up if the ball is hit to the outfield and there is a play at the plate?",
      opts: [
        "In front of the plate, in fair territory, giving the fielder a clear target in line with the throw",
        "Behind the plate, with your back to the field",
        "Sit on the foul line and wait for the call"
      ],
      a: 0,
      why: "Set up in front of the plate in line with the throw, giving a clear target. Follow your league's rules on blocking the plate and contact. Stay low, and give the runner a path to the plate when possible. Safety first."
    },
    play: {
      ball: "Single to left. The runner on third is going and the throw is coming in on a line.",
      q: "What do you do with the throw?",
      opts: [
        "Catch it, find the runner and tag them. Do not block their path to the plate",
        "Let it go by and wait for the next throw",
        "Run out to meet the ball"
      ],
      a: 0,
      why: "Receive the throw with two hands, keep your eyes on it, and make the tag with the ball in your glove or bare hand. Know your league's home plate rules. If the throw is off line, put safety first and take the out you can get."
    }
  },
  {
    id: "c-cut-call",
    positions: ["C"],
    title: "Calling the cutoff",
    sit: { outs: 0, runners: [2], score: "Tied", inning: "4th" },
    pre: {
      q: "Runner on second, 0 out. You are the only one who can see the whole field when the ball is hit. What is your role on a throw home?",
      opts: [
        "Nothing, the cutoff man decides",
        "Direct traffic: yell 'cut' to have the cutoff man take it, 'let it go' to let it through, or 'cut three' / 'cut two' to send it to a base",
        "Run toward the pitcher"
      ],
      a: 1,
      why: "The catcher sees the whole play and is the voice of the defense on throws home. Call early and loud: 'Cut!' (take it, and I'll give you a target), 'Let it go!' (it's on line, I have a play), or 'Cut three!' / 'Cut two!' (take it and throw to that base)."
    },
    play: {
      ball: "Single to right. The runner from second is going to score easily, and the batter-runner is heading for second on the throw.",
      q: "You have no play at the plate. What is the call?",
      opts: [
        "'Let it go!' so the throw comes all the way home",
        "'Cut two!' so the cutoff man catches it and throws to second to stop the batter-runner",
        "No call, just catch it"
      ],
      a: 1,
      why: "If you have no play at the plate, take the throw to a base where you do. Cutting it and throwing to second keeps the batter-runner from taking an extra base for free."
    }
  },

  // ---------- FIRST BASE ----------
  {
    id: "1b-dp",
    positions: ["1B"],
    title: "Ground ball to you with a runner on first",
    sit: { outs: 0, runners: [1], score: "Up 2", inning: "3rd" },
    pre: {
      q: "Runner on first, nobody out. You are holding the runner on or playing behind them. What is your plan if a ground ball is hit right to you?",
      opts: [
        "Always step on first for the sure out",
        "Look for the double play: throw to second to start 3-6-3 if the shortstop gets there in time, otherwise take the out at first",
        "Throw to third"
      ],
      a: 1,
      why: "With a force at second and nobody out, the double play is the best outcome. If you step on first, the force at second is gone (the batter-runner is out), so the throw to second must come first. Take the sure out when the DP is not there."
    },
    play: {
      ball: "A hard grounder is hit right at you. The runner on first has taken off.",
      q: "What do you do?",
      opts: [
        "Throw to second for the force, then get the return throw at first",
        "Step on first and walk the ball in",
        "Hold the ball and look at the runner"
      ],
      a: 0,
      why: "Field it clean, find the shortstop at second (do not throw it into the runner), and throw to the bag. Then hustle back to first to receive the return throw. If you bobble it, take the sure out at first."
    }
  },
  {
    id: "1b-cutoff-home",
    positions: ["1B"],
    title: "Cutoff on throws from right",
    sit: { outs: 1, runners: [2], score: "Tied", inning: "6th" },
    pre: {
      q: "Runner on second, 1 out. A single to right field is hit. Where is your spot as the first baseman?",
      opts: [
        "Behind first base",
        "On the line between the right fielder and home plate, 30 to 50 feet in front of the plate, as the cutoff",
        "Stay out of the way"
      ],
      a: 1,
      why: "On throws home from the right side, the first baseman is normally the cutoff man. Line up between the outfielder and the plate, with hands up as a target, and listen for the call from the catcher."
    },
    play: {
      ball: "Single to right. The throw is on its way and you hear 'Cut!' from the catcher.",
      q: "What do you do?",
      opts: [
        "Catch it and throw home",
        "Catch the ball, turn and look at the batter-runner and throw to the base the catcher calls",
        "Let it go by"
      ],
      a: 1,
      why: "'Cut!' means catch it. Then follow the catcher's call: 'Cut two' means throw to second, 'Cut three' means throw to third. Quickly turn and throw to the call."
    }
  },

  // ---------- SECOND BASE ----------
  {
    id: "2b-dp",
    positions: ["2B"],
    title: "Turning two from second base",
    sit: { outs: 0, runners: [1], score: "Down 1", inning: "5th" },
    pre: {
      q: "Runner on first, nobody out. Which depth do you play?",
      opts: [
        "Double play depth: a step or two closer to second, ready to get to the bag",
        "Back on the grass",
        "Right behind the runner"
      ],
      a: 0,
      why: "At double play depth you are closer to the bag so you can arrive early. Normal depth is fine when the batter is slow or the run matters more than the out."
    },
    play: {
      ball: "A hard ground ball is hit to your left, to the shortstop. You are covering second.",
      q: "What do you do?",
      opts: [
        "Get to the bag, catch the throw, touch second and fire to first",
        "Stay in position",
        "Cover first"
      ],
      a: 0,
      why: "Get to the bag early, show a target, catch it and touch the bag, then throw to first. Keep your feet in the right place and avoid the runner. If the throw is bad, take the out."
    }
  },
  {
    id: "2b-relay-gap",
    positions: ["2B"],
    title: "Relay on a ball to right-center",
    sit: { outs: 1, runners: [1], score: "Tied", inning: "6th" },
    pre: {
      q: "Runner on first, 1 out. A ball is hit in the gap in right-center. What is your job?",
      opts: [
        "Go out as the relay man, line up between the outfielder and the target base",
        "Stay on the bag",
        "Back up first"
      ],
      a: 0,
      why: "The second baseman is the relay man on balls to the right side. Go out, put your hands up, and line up with the target base. Listen to the call."
    },
    play: {
      ball: "The ball bounces by the right-center fielder. The runner is heading for third.",
      q: "What do you do?",
      opts: [
        "Catch the throw and fire to the base the call says",
        "Wait at second for a throw",
        "Run toward the ball"
      ],
      a: 0,
      why: "Take the throw and make a strong, accurate throw to the target. Quick transfer, step and throw. The relay is about speed and accuracy."
    }
  },

  // ---------- SHORTSTOP ----------
  {
    id: "ss-dp",
    positions: ["SS"],
    title: "Starting the double play",
    sit: { outs: 0, runners: [1], score: "Up 1", inning: "4th" },
    pre: {
      q: "Runner on first, nobody out. Who covers second if the ball is hit to the right side, and who covers if it's hit to the left?",
      opts: [
        "The shortstop covers second on balls to the right side, and the second baseman covers on balls to the left",
        "The shortstop always covers",
        "Nobody covers"
      ],
      a: 0,
      why: "A simple rule: the player who is farther from the ball covers. Agree on it before the pitch and give a quick signal with the glove over the mouth: closed mouth means 'I cover', open means 'you cover'."
    },
    play: {
      ball: "A hard grounder is hit straight at you. The runner is going.",
      q: "What do you do?",
      opts: [
        "Field it, flip or throw to the second baseman covering for the force, then on to first",
        "Throw to first for the sure out",
        "Tag the runner"
      ],
      a: 0,
      why: "With a force at second you can get two. Field cleanly, find the covering player, and make a firm underhand flip or a throw. Go for the sure out if you bobble the ball."
    }
  },
  {
    id: "ss-relay-gap",
    positions: ["SS"],
    title: "Relay home from the left-center gap",
    sit: { outs: 2, runners: [2], score: "Down 2", inning: "7th" },
    pre: {
      q: "Runner on second, 2 outs, down by 2 in the last inning. A ball is hit in the left-center gap. Where do you go?",
      opts: [
        "Out onto the grass as the relay man, lined up with home plate, hands up",
        "Stay on second base",
        "Cover first"
      ],
      a: 0,
      why: "The shortstop is the relay man on balls to the left side. With the run at the plate, line up between the outfielder and home plate and listen for the catcher's call."
    },
    play: {
      ball: "The ball gets by the left-center fielder and rolls to the wall. The runner from second is already rounding third.",
      q: "The throw comes in. What do you do?",
      opts: [
        "Catch it, turn and fire home, or cut it if the catcher calls 'Cut'",
        "Wait at second",
        "Run toward the ball"
      ],
      a: 0,
      why: "Speed and accuracy matter most. Catch it, turn with a strong step and throw home. Follow the catcher's call: cut it for another base, or let it go."
    }
  },

  // ---------- THIRD BASE ----------
  {
    id: "3b-infield-in",
    positions: ["3B"],
    title: "Infield in, runner on third",
    sit: { outs: 1, runners: [3], score: "Tied", inning: "7th" },
    pre: {
      q: "Runner on third, 1 out, tied game in the 7th. Where is the infield?",
      opts: [
        "In, to cut off the run at the plate",
        "Back at double play depth",
        "It does not matter"
      ],
      a: 0,
      why: "With the winning or go-ahead run on third in a late inning, play the infield in. You trade range for a chance to throw the runner out at the plate. Earlier in the game, play for the out and give up the run."
    },
    play: {
      ball: "A grounder is hit right at you. The runner on third breaks for home.",
      q: "What do you do?",
      opts: [
        "Throw home to the catcher",
        "Throw to first for the out",
        "Hold the ball"
      ],
      a: 0,
      why: "If the runner breaks on contact, throw home. If the runner holds, take the sure out at first. Read the runner first, then decide."
    }
  },
  {
    id: "3b-cutoff-home",
    positions: ["3B"],
    title: "Be the cutoff man on a throw from left",
    sit: { outs: 0, runners: [2], score: "Down 1", inning: "4th" },
    pre: {
      q: "Runner on second, nobody out, down by 1. A ground ball is hit through the left side into the outfield. Where do you go?",
      opts: [
        "Out onto the line between the left fielder and home plate, hands up, as the cutoff man",
        "Stay on third base and wait for the throw",
        "Chase the ball into the outfield"
      ],
      a: 0,
      why: "On throws home from the left side, the third baseman is the cutoff man. Line up between the outfielder and the plate with your hands up, and listen to the catcher."
    },
    play: {
      ball: "Ground-ball single to left. The runner from second is scoring easily, and the batter-runner is rounding first. The throw is coming in and the catcher yells 'Cut two!'.",
      q: "What do you do?",
      opts: [
        "Catch it, turn and throw to second to hold the batter-runner at first",
        "Let it go through to the plate",
        "Throw home anyway"
      ],
      a: 0,
      why: "'Cut two' means catch the throw and send it to second. The run can't be stopped, so keep the batter-runner from taking second for free."
    }
  },

  // ---------- OUTFIELD ----------
  {
    id: "of-call-gap",
    positions: ["LF", "LCF", "RCF", "RF"],
    title: "Fly ball between two outfielders",
    sit: { outs: 2, runners: [], score: "Tied", inning: "5th" },
    pre: {
      q: "Two outs, nobody on. A fly ball is hit between you and the next outfielder. What do you do before it arrives?",
      opts: [
        "Wait and see if the other player calls it",
        "Call it loud and early. 'I got it!'. The center fielder has priority over the corner outfielders",
        "Run away"
      ],
      a: 1,
      why: "Outfielders collide when nobody calls it. Call early and repeat. Priority: center over corners, and the player moving in over the player moving back. Anyone who hears 'I got it' backs off."
    },
    play: {
      ball: "A fly ball drops into the gap. You and the next outfielder both go for it.",
      q: "You hear 'I got it!' from the other fielder. What do you do?",
      opts: [
        "Peel off and back them up",
        "Keep going for the ball",
        "Stop and watch"
      ],
      a: 0,
      why: "If you hear the call, back them up. Run behind them in case the ball bounces off the glove. The backup prevents extra bases."
    }
  },
  {
    id: "lf-home",
    positions: ["LF"],
    title: "Throw home from left",
    sit: { outs: 1, runners: [2], score: "Tied", inning: "7th" },
    pre: {
      q: "Runner on second, 1 out, tied. A single to left is hit. What is your mindset as the left fielder?",
      opts: [
        "Charge it, field it on the run, and get the ball in",
        "Wait for the ball to come to you",
        "Throw it as hard as you can without looking"
      ],
      a: 0,
      why: "Charge hard, field the ball under control, and throw through. The run matters: do not rush a sloppy throw."
    },
    play: {
      ball: "Single to left. The runner is rounding third and heading home.",
      q: "Where do you throw?",
      opts: [
        "Through to home on a line, aiming at the cutoff man's head height, and listen for the cut or let-go call",
        "To second base",
        "To third base"
      ],
      a: 0,
      why: "Throw on a line, at the cutoff man's head, so he can catch it or let it through. A throw on a line or a one-hop is better than a high arc."
    }
  },
  {
    id: "lcf-gap-relay",
    positions: ["LCF"],
    title: "Gap ball and relay",
    sit: { outs: 0, runners: [1], score: "Down 1", inning: "6th" },
    pre: {
      q: "Runner on first, nobody out. What do you do if a ball is hit over your head?",
      opts: [
        "Turn and run it down, then get it to the relay man (the shortstop)",
        "Wait for the ball to stop",
        "Throw it from the wall"
      ],
      a: 0,
      why: "Turn and run to the spot, get the ball, and hit the relay man. Do not try to throw all the way."
    },
    play: {
      ball: "The ball rolls to the wall in left-center. The shortstop is lined up.",
      q: "Where do you throw?",
      opts: [
        "At the shortstop's chest, as fast as you can",
        "Over his head",
        "To the pitcher"
      ],
      a: 0,
      why: "Hit the relay man chest-high with a strong throw. He gets it to the base."
    }
  },
  {
    id: "rcf-tag-up",
    positions: ["RCF"],
    title: "Fly ball with a runner tagging",
    sit: { outs: 1, runners: [3], score: "Tied", inning: "7th" },
    pre: {
      q: "Runner on third, 1 out. A fly ball is hit your way. How do you set up?",
      opts: [
        "Get behind the ball and catch it moving toward home",
        "Catch it flat-footed",
        "Camp under it"
      ],
      a: 0,
      why: "Get behind the ball so you can move forward into the throw. Momentum gives you more on the throw home."
    },
    play: {
      ball: "You catch the fly ball. The runner on third tags and goes.",
      q: "Where do you throw?",
      opts: [
        "Home, on a line, low and on target to the cutoff or catcher",
        "To second",
        "Hold the ball"
      ],
      a: 0,
      why: "Throw through to home on a low line. A one-hop throw is easy for the catcher to handle."
    }
  },
  {
    id: "rf-late-lead",
    positions: ["RF"],
    title: "Protect a late lead",
    sit: { outs: 1, runners: [], score: "Up 1", inning: "7th" },
    pre: {
      q: "Up by 1 in the last inning, nobody on, 1 out. How deep do you play?",
      opts: [
        "Deep, so nothing gets over your head",
        "Shallow, to catch singles",
        "It does not matter"
      ],
      a: 0,
      why: "Protect the lead. Play deeper and prevent extra-base hits. A single is fine, a double is not."
    },
    play: {
      ball: "A line drive is hit to you on a bounce. Nobody is on.",
      q: "What do you do?",
      opts: [
        "Get in front of it, keep it in front of you, and throw to the cutoff",
        "Reach with one hand and hope",
        "Try to throw out the batter at first"
      ],
      a: 0,
      why: "Keep the ball in front, and make a safe throw. Do not take a risk that lets the runner take extra bases."
    }
  }
];

// ---------- WHERE AND HOW THE BALL IS HIT (drawn on the field in step 2) ----------
// type: ground | line | fly | pop.  spot: key into window.SPOTS (field coordinates).
// byPos lets a shared scenario show a different spot depending on who is playing.
window.HITS = {
  "pop-infield-fly":   { type: "pop",    spot: "popInf",  label: "Pop-up between 3B, SS and the mound" },
  "p-cover1":          { type: "ground", spot: "hole1B",  label: "Ground ball to the first baseman's glove side" },
  "p-backup":          { type: "line",   spot: "LF",      label: "Line drive single to left field" },
  "c-set-plate":       { type: "line",   spot: "LF",      label: "Line drive single to left field" },
  "c-cut-call":        { type: "line",   spot: "RF",      label: "Line drive single to right field" },
  "1b-dp":             { type: "ground", spot: "to1B",    label: "Hard ground ball right at first base" },
  "1b-cutoff-home":    { type: "ground", spot: "RF",      label: "Ground ball single through the right side" },
  "2b-dp":             { type: "ground", spot: "toSS",    label: "Hard ground ball to shortstop" },
  "2b-relay-gap":      { type: "line",   spot: "gapR",    label: "Line drive into the right-center gap" },
  "ss-dp":             { type: "ground", spot: "toSS",    label: "Hard ground ball right at shortstop" },
  "ss-relay-gap":      { type: "line",   spot: "wallL",   label: "Line drive into the left-center gap, rolling to the wall" },
  "3b-infield-in":     { type: "ground", spot: "to3B",    label: "Ground ball right at third base" },
  "3b-cutoff-home":    { type: "ground", spot: "LF",      label: "Ground ball single through the left side" },
  "of-call-gap":       { type: "fly",    spot: "gapL",    label: "Fly ball in the gap",
                         byPos: { LF: "gapL", LCF: "gapL", RCF: "gapR", RF: "gapR" } },
  "lf-home":           { type: "line",   spot: "LF",      label: "Line drive single to left field" },
  "lcf-gap-relay":     { type: "line",   spot: "wallL",   label: "Line drive over your head, rolling to the wall" },
  "rcf-tag-up":        { type: "fly",    spot: "RCF",     label: "Fly ball to right-center" },
  "rf-late-lead":      { type: "line",   spot: "RF",      label: "Line drive that bounces in front of you" }
};
window.SCENARIOS.forEach(function (s) { s.play.hit = window.HITS[s.id]; });

// Field coordinates (SVG viewBox 200 x 200, home plate at the bottom centre).
window.SPOTS = {
  home: [100, 172], b1: [138, 134], b2: [100, 96], b3: [62, 134],
  P: [100, 134], C: [100, 186], "1B": [142, 128], "2B": [124, 108], SS: [76, 108], "3B": [58, 128],
  LF: [46, 54], LCF: [80, 34], RCF: [120, 34], RF: [154, 54],
  to1B: [142, 128], toSS: [76, 108], to3B: [58, 128], hole1B: [150, 124],
  gapL: [62, 40], gapR: [138, 40], wallL: [62, 18], popInf: [82, 120],
  toP: [100, 128], foulBack: [118, 190], foul1B: [160, 132], shallowR: [132, 74], shallowL: [70, 76],
  holeL: [66, 118], slow3B: [70, 146],
  deepLF: [52, 34], deepLCF: [84, 22], deepRCF: [116, 22], deepRF: [148, 34]
};
// In the database, a spot can be a name above OR raw coordinates like [x, y] (0-200), so new
// hit locations never need an app update.
