// Batch 2: 20 more situations. Loaded after scenarios.js; entries carry their own hit data.
(function () {
  var OF = ["LF", "LCF", "RCF", "RF"];
  var OWN = { LF: "LF", LCF: "LCF", RCF: "RCF", RF: "RF" };
  var DEEP = { LF: "deepLF", LCF: "deepLCF", RCF: "deepRCF", RF: "deepRF" };
  var INF_OWN = { P: "toP", "1B": "to1B", "2B": "2B", SS: "toSS", "3B": "to3B" };

  Object.assign(window.SPOTS, {
    toP: [100, 128], foulBack: [118, 190], foul1B: [160, 132], shallowR: [132, 74], shallowL: [70, 76],
    holeL: [66, 118], slow3B: [70, 146],
    deepLF: [52, 34], deepLCF: [84, 22], deepRCF: [116, 22], deepRF: [148, 34]
  });

  var NEW = [
    // ---------------- PITCHER ----------------
    {
      id: "p-comebacker-line", positions: ["P"], title: "Line drive right back at you",
      sit: { outs: 2, runners: [], score: "Up 2", inning: "5th" },
      pre: {
        q: "Two outs, nobody on. A hard hitter is up. What should be true as your pitch finishes?",
        opts: ["You land balanced and square to the plate with your glove up, ready to field",
               "You turn away and watch the flight of the ball",
               "You step toward first base before the ball is hit"],
        a: 0,
        why: "Your follow-through leaves you the closest fielder to the batter. Finish balanced, facing the plate, glove up, so you can react to a ball hit back at you."
      },
      play: {
        ball: "A hard line drive comes straight back at you, about waist high.",
        hit: { type: "line", spot: "toP", label: "Line drive right back at the pitcher" },
        q: "What is your first priority?",
        opts: ["Protect yourself: glove up, turn your body, and cover your face. Catch it only if you safely can",
               "Try to catch it bare-handed",
               "Step toward the ball so you can catch it"],
        a: 0,
        why: "A softball off the bat reaches you in no time. Protect your head first. If you catch it, that's the out. If it drops, pick it up and throw to first. Never risk an injury for one out."
      }
    },
    {
      id: "p-two-outs-r3", positions: ["P"], title: "Two outs, runner on third: take the out",
      sit: { outs: 2, runners: [3], score: "Tied", inning: "6th" },
      pre: {
        q: "Two outs, runner on third, tied. A ground ball back to the mound would end the inning. What do you know before the pitch?",
        opts: ["If the batter is thrown out at first for the third out, the run doesn't count",
               "You must tag the runner on third",
               "The run counts no matter what"],
        a: 0,
        why: "With two outs, if the batter-runner is put out at first before the runner on third crosses the plate, no run scores. A sure out at first ends the inning."
      },
      play: {
        ball: "A soft ground ball comes back to the mound. The runner on third breaks for home.",
        hit: { type: "ground", spot: "toP", label: "Ground ball back to the pitcher" },
        q: "Where do you throw?",
        opts: ["First base for the third out", "Home to get the runner", "Hold the ball and look at the runner"],
        a: 0,
        why: "The third out at first ends the inning and the run can't count. Don't look at the runner or throw home. Field it cleanly, set your feet and throw to first."
      }
    },

    // ---------------- CATCHER ----------------
    {
      id: "c-foul-pop", positions: ["C"], title: "Foul pop-up behind the plate",
      sit: { outs: 2, runners: [], score: "Tied", inning: "4th" },
      pre: {
        q: "Two outs. A pop-up goes straight up behind the plate. What is the first thing you do?",
        opts: ["Find the ball first, and pull off your mask (if you wear one) and toss it clear of the play",
               "Keep your head down and wait for the ball to come down",
               "Look to the dugout for help"],
        a: 0,
        why: "You need your full field of view. Find the ball first, then get the mask out of the way so you don't trip on it."
      },
      play: {
        ball: "A high foul pop-up drifts behind the plate toward the backstop.",
        hit: { type: "pop", spot: "foulBack", label: "Foul pop-up behind home plate" },
        q: "How do you get under it?",
        opts: ["Track it, run to where it will land, and be ready for it to curve back toward the field",
               "Run straight back to the backstop and wait",
               "Stay at the plate and reach up"],
        a: 0,
        why: "Pop-ups behind the plate carry backspin and tend to curve back toward the field. Get under it, catch it with two hands, and stay aware of the backstop."
      }
    },
    {
      id: "c-bases-loaded-plate", positions: ["C"], title: "Bases loaded: step on the plate, then first",
      sit: { outs: 1, runners: [1, 2, 3], score: "Up 1", inning: "7th" },
      pre: {
        q: "Bases loaded, 1 out. Every runner is forced. If the ball is hit on the ground to the left side, what is your job at the plate?",
        opts: ["Get to the plate, one foot on it, ready to catch and then throw to first",
               "Block the runner coming from third",
               "Stay behind the plate and wait for a throw to tag"],
        a: 0,
        why: "Every runner is forced, so nobody needs to be tagged. Touch the plate with one foot to retire the runner from third, catch the throw, then step off and throw to first for the double play."
      },
      play: {
        ball: "A sharp ground ball goes right at the third baseman. He fires home.",
        hit: { type: "ground", spot: "to3B", label: "Hard ground ball to third base" },
        q: "What do you do with the throw?",
        opts: ["Step on the plate for the force, then throw to first for the double play if there's time",
               "Tag the runner coming from third",
               "Throw back to third base"],
        a: 0,
        why: "It's a force at home. Catch the ball, touch the plate, then get your balance and throw to first. If the throw is poor, take the sure out at the plate."
      }
    },

    // ---------------- FIRST BASE ----------------
    {
      id: "1b-take-throw", positions: ["1B"], title: "Take the throw at first",
      sit: { outs: 1, runners: [], score: "Down 2", inning: "4th" },
      pre: {
        q: "Nobody on, 1 out. On a ground ball to another infielder, where do you go?",
        opts: ["Straight to first base: find the bag with your foot and face the thrower with your glove out",
               "Stay back to guard the line",
               "Wait for a call from the catcher"],
        a: 0,
        why: "With nobody forcing at another base, your job on any infield grounder is first base. Get to the bag early, find it with your foot, then turn and give a target."
      },
      play: {
        ball: "A ground ball to the second baseman, who sets and throws. The throw is a little wide to your right.",
        hit: { type: "ground", spot: "2B", label: "Ground ball to second base" },
        q: "What do you do?",
        opts: ["Stretch to catch it while keeping your foot on the bag. If it's too wide, leave the bag and catch it",
               "Leave the bag and run to the ball every time",
               "Let it go by"],
        a: 0,
        why: "Catching the ball comes first. Keep your foot on the bag when you can and stretch toward the throw. If it's too wide to reach, leave the bag, catch it, then try for the tag."
      }
    },
    {
      id: "1b-foul-pop", positions: ["1B"], title: "Foul pop-up down the first-base line",
      sit: { outs: 2, runners: [2], score: "Down 1", inning: "7th" },
      pre: {
        q: "Two outs, runner on second, down by 1 in the last inning. A foul pop-up goes up near the first-base dugout. What do you do first?",
        opts: ["Find the ball and the fence, then go for it. A caught foul ball is the third out",
               "Let it drop, it's foul",
               "Yell for the catcher and stay put"],
        a: 0,
        why: "A caught foul ball is still an out, and here it ends the game. Locate the ball, and know where the fence or dugout rail is, then make the catch."
      },
      play: {
        ball: "The pop-up is drifting toward the dugout fence in foul ground.",
        hit: { type: "pop", spot: "foul1B", label: "Foul pop-up near the first-base dugout" },
        q: "As you near the fence, what do you do?",
        opts: ["Keep your eyes on the ball, reach up with your glove and feel for the fence with your free hand",
               "Stop short and let it fall",
               "Turn around and look for the fence"],
        a: 0,
        why: "Slow down as you approach and use your free hand to feel for the fence. Eyes stay on the ball. A safe catch wins the game. Stopping short gives up the out."
      }
    },

    // ---------------- SECOND BASE ----------------
    {
      id: "2b-r2-sure-out", positions: ["2B"], title: "Runner on second, ball to the right side: take the out",
      sit: { outs: 0, runners: [2], score: "Down 1", inning: "5th" },
      pre: {
        q: "Runner on second, nobody out. A ground ball to the right side would let the runner move up to third. What's the plan?",
        opts: ["Field it and take the sure out at first, even if the runner moves to third",
               "Throw to third every time",
               "Hold the ball and look the runner back every time"],
        a: 0,
        why: "With nobody out, an out at first is worth it even if the runner reaches third. Don't throw to third unless the runner stops and you have a clear play."
      },
      play: {
        ball: "A ground ball is hit to you, the second baseman. The runner from second is heading to third.",
        hit: { type: "ground", spot: "2B", label: "Ground ball to second base" },
        q: "What do you do?",
        opts: ["Throw to first for the out", "Throw to third", "Chase the runner and tag him"],
        a: 0,
        why: "Take the sure out at first. The runner is moving anyway, and a throw to third would be late and risky."
      }
    },

    // ---------------- INFIELD SHARED ----------------
    {
      id: "inf-shallow-fly-priority", positions: ["2B", "SS", "3B"], title: "Shallow fly: who has priority?",
      sit: { outs: 1, runners: [], score: "Tied", inning: "3rd" },
      pre: {
        q: "Nobody on, 1 out. A fly ball drops into shallow outfield where infielders and outfielders can both reach it. Who has priority?",
        opts: ["The outfielder running in has priority over the infielder going back",
               "The infielder always has priority",
               "Whoever is faster"],
        a: 0,
        why: "The player running in sees the ball better and can catch it moving forward. The outfielder takes priority over an infielder going back."
      },
      play: {
        ball: "A fly ball drops short behind the infield. You are running back for it, and you hear the outfielder yell 'I got it!'.",
        hit: { type: "fly", spot: "shallowL", label: "Shallow fly ball behind the infield", byPos: { "2B": "shallowR", SS: "shallowL", "3B": "shallowL" } },
        q: "What do you do?",
        opts: ["Pull up, clear out of the way, and let the outfielder take it",
               "Keep going, you were there first",
               "Stop and watch"],
        a: 0,
        why: "Once the outfielder calls it, the infielder pulls up and clears. Collisions cause injuries and dropped balls. Stay close in case it pops out."
      }
    },

    // ---------------- SHORTSTOP ----------------
    {
      id: "ss-deep-hole", positions: ["SS"], title: "Deep in the hole",
      sit: { outs: 2, runners: [], score: "Up 1", inning: "6th" },
      pre: {
        q: "Two outs, nobody on. A strong right-handed pull hitter steps in. How do you adjust?",
        opts: ["Shade a step or two toward third base and play a little deeper",
               "Move toward second base",
               "Stay in exactly the same spot for every batter"],
        a: 0,
        why: "A right-handed pull hitter is more likely to hit toward the third-base side. Adjusting your position to the batter turns hard hits into outs."
      },
      play: {
        ball: "A hard grounder is hit deep in the hole between you and third base.",
        hit: { type: "ground", spot: "holeL", label: "Hard ground ball deep in the hole" },
        q: "What is the best way to field and throw it?",
        opts: ["Get in front of it or backhand it, plant your back foot, and make a strong throw to first",
               "Rush a throw off balance",
               "Let the third baseman take it"],
        a: 0,
        why: "Your first job is stopping the ball. Get your body in line, set your feet, and throw with your whole body. Two outs means a rushed throw isn't worth the risk."
      }
    },
    {
      id: "ss-line-drive-double", positions: ["SS"], title: "Line drive with runners on: double up",
      sit: { outs: 0, runners: [1, 2], score: "Down 1", inning: "6th" },
      pre: {
        q: "Runners on first and second, nobody out. A line drive is caught. What else can you get besides the batter?",
        opts: ["A runner who left early and hasn't returned to the base: step on or throw to that base",
               "Nothing, only the batter is out",
               "A force out on every runner"],
        a: 0,
        why: "On a caught fly or line drive, runners must return to (or tag up at) their base. A runner who left early can be doubled off by stepping on or throwing to that base."
      },
      play: {
        ball: "You catch a line drive. The runner on second took a few steps off the bag, heading for third.",
        hit: { type: "line", spot: "toSS", label: "Line drive right at shortstop" },
        q: "What do you do?",
        opts: ["Step on second or throw to it before the runner gets back, then check the runner at first",
               "Throw to first",
               "Flip the ball to the pitcher"],
        a: 0,
        why: "Check the closest runner first. If the runner on second is off the bag, step on it or throw to it, then look at first. That is a double play."
      }
    },

    // ---------------- THIRD BASE ----------------
    {
      id: "3b-slow-roller", positions: ["3B"], title: "Slow roller: charge it",
      sit: { outs: 1, runners: [], score: "Tied", inning: "3rd" },
      pre: {
        q: "Nobody on, 1 out. This batter tends to chop the ball. What is your readiness?",
        opts: ["Normal depth, on your toes, ready to charge as soon as the ball is hit",
               "Way back on the outfield grass",
               "Standing on third base"],
        a: 0,
        why: "Weak choppers are about speed. Stay on your toes and read the ball off the bat so you can attack it immediately."
      },
      play: {
        ball: "A weak, slow roller dribbles toward the grass in front of you.",
        hit: { type: "ground", spot: "slow3B", label: "Slow ground ball in front of third base" },
        q: "How do you handle it?",
        opts: ["Charge hard, field it on the run, and throw to first. Use your bare hand only if it has stopped rolling",
               "Wait for it to stop rolling",
               "Let the pitcher take it"],
        a: 0,
        why: "Go get it. Field on the run, plant and throw. A quick, accurate throw beats a perfect one that's late."
      }
    },
    {
      id: "3b-r1r2-force", positions: ["3B"], title: "Runners on first and second: step on third",
      sit: { outs: 0, runners: [1, 2], score: "Up 1", inning: "6th" },
      pre: {
        q: "Runners on first and second, nobody out. If a ground ball is hit to you, what are the forces?",
        opts: ["Third, second and first: both runners and the batter must move",
               "Only first base",
               "There are no forces, you have to tag"],
        a: 0,
        why: "With runners on first and second, both runners are forced to move, so third and second are force plays. The batter is forced at first."
      },
      play: {
        ball: "A hard ground ball is hit right at you. Both runners are running.",
        hit: { type: "ground", spot: "to3B", label: "Hard ground ball to third base" },
        q: "What do you do?",
        opts: ["Step on third for the force, then throw to second or first for the double play",
               "Throw to second only",
               "Tag the runner from second"],
        a: 0,
        why: "Step on third for the force, then throw to second or first for the second out. If you bobble the ball, take the sure out at third."
      }
    },

    // ---------------- INFIELD SHARED: situational ----------------
    {
      id: "inf-two-outs-r1", positions: ["P", "1B", "2B", "SS", "3B"], title: "Two outs: just get an out",
      sit: { outs: 2, runners: [1], score: "Tied", inning: "5th" },
      pre: {
        q: "Two outs, runner on first. A ground ball is hit to you. What's the plan?",
        opts: ["Take the easiest, surest out, since any out ends the inning",
               "Always go for the double play",
               "Always throw to second"],
        a: 0,
        why: "With two outs, any force out ends the inning. Don't force a double play. Take the surest out, usually the one closest to you."
      },
      play: {
        ball: "A ground ball is hit to you. The runner is going to second.",
        hit: { type: "ground", spot: "toSS", label: "Ground ball to you", byPos: INF_OWN },
        q: "Where do you throw?",
        opts: ["To whichever out is surest: first or the force at second, whichever you reach easily",
               "Always to second base",
               "Tag the runner"],
        a: 0,
        why: "Any force out ends the inning, so go with the easiest, most certain one. A routine throw to first is often the best choice."
      }
    },
    {
      id: "inf-back-r3-sure-out", positions: ["1B", "2B", "SS", "3B"], title: "Infield back, runner on third: take the sure out",
      sit: { outs: 0, runners: [3], score: "Up 3", inning: "3rd" },
      pre: {
        q: "Runner on third, nobody out, up by 3 in the 3rd. Where do you play?",
        opts: ["Back at normal depth: trade the run for the out",
               "Infield in to stop every run",
               "Way back on the outfield grass"],
        a: 0,
        why: "Early in the game with a lead, outs matter more than one run. Normal depth keeps your range and the double play."
      },
      play: {
        ball: "A ground ball is hit to you. The runner on third breaks for home.",
        hit: { type: "ground", spot: "toSS", label: "Ground ball to you", byPos: { "1B": "to1B", "2B": "2B", SS: "toSS", "3B": "to3B" } },
        q: "What do you do?",
        opts: ["Take the sure out at first and let the run score",
               "Throw home",
               "Hold the ball"],
        a: 0,
        why: "Take the out. It's early and you're ahead. Giving up one run for a sure out beats risking a bad throw or a close play at the plate."
      }
    },

    // ---------------- OUTFIELD (shared across LF, LCF, RCF, RF) ----------------
    {
      id: "of-over-head", positions: OF, title: "Fly ball over your head",
      sit: { outs: 1, runners: [1], score: "Up 2", inning: "5th" },
      pre: {
        q: "Runner on first, 1 out, up by 2. A power hitter is up. How do you set up?",
        opts: ["A few steps deeper than normal, so nothing goes over your head",
               "Shallow, to catch the singles",
               "Same spot as for a weak hitter"],
        a: 0,
        why: "Play deeper for power hitters and when you have a lead. A single is better than a double, and you can always run in on a ball in front of you."
      },
      play: {
        ball: "The ball is hit over your head.",
        hit: { type: "fly", spot: "deepLF", label: "Fly ball over your head", byPos: DEEP },
        q: "What is your first move?",
        opts: ["Drop-step, turn and run to where the ball is going, then look back for it",
               "Backpedal and watch it",
               "Wait for it to land"],
        a: 0,
        why: "Backpedaling is too slow. Open up with a drop step, run to the spot with your head turned, then find the ball."
      }
    },
    {
      id: "of-sun-wind", positions: OF, title: "Fly ball into the sun",
      sit: { outs: 0, runners: [], score: "Down 1", inning: "4th" },
      pre: {
        q: "Before the inning starts, what should you check as an outfielder?",
        opts: ["Where the sun is, which way the wind is blowing, and the ground and fence conditions",
               "The scoreboard",
               "The other team's lineup only"],
        a: 0,
        why: "Know where the sun is and which way the wind blows. Check the ground for holes, and where the fence is, before the first pitch."
      },
      play: {
        ball: "The first batter hits a high fly ball straight into the sun.",
        hit: { type: "fly", spot: "LF", label: "High fly ball into the sun", byPos: OWN },
        q: "What do you do?",
        opts: ["Block the sun with your glove, line up so the ball is just beside the sun, and call for it early",
               "Stare straight at the ball and the sun",
               "Give up on it"],
        a: 0,
        why: "Use your glove to shade your eyes and move so the ball sits just beside the sun. A cap and sunglasses help. Call it early so a teammate with a better view can take it."
      }
    },
    {
      id: "of-single-r1-hold", positions: OF, title: "Single with a runner on first: keep the batter at first",
      sit: { outs: 1, runners: [1], score: "Up 2", inning: "6th" },
      pre: {
        q: "Runner on first, 1 out, up by 2. A single is hit your way. What's the plan?",
        opts: ["Get the ball in cleanly and make an accurate throw, stopping extra bases",
               "Always throw to third",
               "Hold the ball and wait"],
        a: 0,
        why: "Up by 2 with a runner on first, the goal is to stop extra bases. Field cleanly and throw to where there's a play."
      },
      play: {
        ball: "A single comes to you. The runner from first will clearly make third.",
        hit: { type: "line", spot: "LF", label: "Line drive single to your area", byPos: OWN },
        q: "What do you do?",
        opts: ["Hit the cutoff man so the batter-runner can't take second",
               "Throw to third anyway",
               "Throw home"],
        a: 0,
        why: "The runner will be safe at third. If you throw to third, the batter-runner takes second for free. Hit the cutoff man so he can hold the batter at first."
      }
    },
    {
      id: "of-back-up-neighbour", positions: OF, title: "Back up your neighbour",
      sit: { outs: 0, runners: [], score: "Tied", inning: "2nd" },
      pre: {
        q: "Nobody on, nobody out. A ground ball is hit toward the outfielder next to you. What is your job?",
        opts: ["Back them up, in line behind the ball",
               "Stay put",
               "Run in toward the infield"],
        a: 0,
        why: "Every ball hit to an outfielder needs a backup in case it gets by. Be behind them and in line with the ball."
      },
      play: {
        ball: "A ground ball rolls toward the outfielder next to you and takes a bad hop.",
        hit: { type: "ground", spot: "LCF", label: "Ground ball to your neighbour in the outfield", byPos: { LF: "LCF", LCF: "LF", RCF: "RF", RF: "RCF" } },
        q: "What do you do?",
        opts: ["Be in position behind them to stop the ball that gets by and throw it in",
               "Watch what happens",
               "Call for the ball and stay still"],
        a: 0,
        why: "Backing up keeps a single from becoming a triple. Sprint to a spot behind them, in line with the ball, and get it in quickly."
      }
    },
    {
      id: "of-tag-up-second", positions: OF, title: "Tag-up from second base",
      sit: { outs: 0, runners: [2], score: "Tied", inning: "7th" },
      pre: {
        q: "Runner on second, nobody out, tied in the 7th. A deep fly ball comes your way. How do you play it?",
        opts: ["Catch it with your momentum going toward third base, ready to throw",
               "Catch it flat-footed and take your time",
               "Let it drop"],
        a: 0,
        why: "Get behind the ball so you can step into the throw. A deep fly means the runner will tag and go to third, so be ready for a strong throw."
      },
      play: {
        ball: "You catch the deep fly ball. The runner on second tags up and takes off for third.",
        hit: { type: "fly", spot: "deepLF", label: "Deep fly ball, runner tagging", byPos: DEEP },
        q: "Where do you throw?",
        opts: ["Third base, low and on a line, to the infielder lined up as the cutoff",
               "Second base",
               "Home"],
        a: 0,
        why: "Throw ahead of the runner to third, low and on a line, so the cutoff man can catch it or let it through."
      }
    },
    {
      id: "of-single-empty-batter", positions: OF, title: "Single with nobody on: don't give up second",
      sit: { outs: 1, runners: [], score: "Down 1", inning: "6th" },
      pre: {
        q: "Nobody on, 1 out. A single is hit to the outfield. What is your priority?",
        opts: ["Get the ball in quickly and keep the batter-runner at first",
               "Throw to home",
               "Take your time, nobody is on"],
        a: 0,
        why: "A lazy throw turns a single into a double. Get the ball in fast and keep the batter at first."
      },
      play: {
        ball: "A ground-ball single comes to you. The batter-runner rounds first and looks at you.",
        hit: { type: "ground", spot: "LF", label: "Ground ball single to your area", byPos: OWN },
        q: "What do you do?",
        opts: ["Charge it, field it with two hands, throw to second if he commits, otherwise hit the cutoff man",
               "Throw to second no matter what",
               "Hold the ball and walk it in"],
        a: 0,
        why: "Charge and get the ball in with both hands. Throw to second if he commits to it. If not, hit the cutoff man and keep it in front of you."
      }
    }
  ];

  NEW.forEach(function (s) { window.SCENARIOS.push(s); });
})();
