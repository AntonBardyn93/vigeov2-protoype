(function (global) {
  const F = (q, a, follow) => ({ q, a, follow: follow || [] });

  const tafelChips = [
    F("What’s tonight’s episode about?", "Tonight the table takes the day’s paper: Dolly Parton, the hottest Belgian summer on record, and Gert catching Theo Francken’s climate post. Nicole Van Lipzig from KU Leuven sits for the heat. If you only want the row, skip to the climate block.", [
      { id: "tafel-climate", q: "Did Gert really back Francken on the climate?", a: "He said he understood the post. Van Lipzig’s graphs did not. That’s the show: the day’s row, live, and Gert doesn’t pretend he’s a scientist." },
      { id: "tafel-catch", q: "Can I watch it without the whole hour?", a: "Yes — Play keeps the night. Last night if you want the conversation people are still having. A week-old episode is already stale. That’s the point of a daily table." }
    ]),
    F("Who are tonight’s guests?", "Jade Mintjens talking her new Play show, Little Kim and Christophe Vekeman for Dolly, Nicole Van Lipzig on the summer. Tafelspringers: Hannes Heynderickx, Nora Gharib, Peter Van de Veire. That’s a Tuesday table — Wednesday will be a different paper.", [
      { id: "tafel-ruben", q: "Who’s in the chair this season?", a: "Gert most nights, Tine when he’s off, and Ruben Van Gucht took the chair as third host this season. Six guests, live from De Zuiderkroon, Monday to Thursday at 20:00 on Play." },
      { id: "tafel-live", q: "Do I need to watch it live?", a: "Live is the sport. Play has last night if you missed 20:00. Don’t start a Thursday episode on Saturday and expect it to feel current." }
    ]),
    F("Which recent episodes are worth catching up on?", "Last night, if you want the conversation the house is still having — Francken and the heat are still warm. Monday’s opener if you missed Ruben taking the chair. Anything older than that is a different paper.", [
      { id: "tafel-week", q: "Is there a weekly recap if I missed the table?", a: "De Tafel van de Week stitches the best rows. Fine if you want the hits. Not the same as sitting last night when Francken and the heat were still warm." },
      { id: "tafel-sofa", q: "Can we talk over this?", a: "That’s the one. People argue with the table. Zeg Eens Euh if you wanted a game after. Familie if the room wanted the daily soap instead." }
    ])
  ];

  const familieChips = [
    F("What did I miss this week?", "Victor is still gone and Mathias is tearing Mechelen apart — that’s the season opener, an extra-long Monday. Erik walked into the Jan & Alleman asking for Peter Van den Bossche. Hanne came back without Gaston. Three fires, 25 minutes a night.", [
      { id: "fam-monday", q: "So I should start at the long episode?", a: "Yes. That’s the hook of week one. VTM GO has it. Don’t dip into Thursday and wonder who Erik is." },
      { id: "fam-miss", q: "What if I miss two nights?", a: "VTM GO+ has the week from Saturday. Otherwise the pub will recap louder than a title card. It’s a soap — that’s the deal." }
    ]),
    F("Can I just start now, or do I need backstory?", "Start now. It’s a daily — 25 minutes, Mechelen, the holding and the pub. You don’t need 1991. You need this week’s Victor and whoever just walked into the Jan & Alleman.", [
      { id: "fam-week", q: "What’s this week actually about besides Victor?", a: "Erik walked into the Jan & Alleman asking for Peter Van den Bossche. Flashbacks with Gunther Levi start filling why. Hanne came back without Gaston. That’s three fires, 25 minutes a night." },
      { id: "fam-thuis", q: "Thuis or Familie if I only have one daily?", a: "Familie if you want VTM and a kidnapping week. Thuis if you already chip at VRT MAX. Same length. Different village." }
    ]),
    F("Who are the main characters right now?", "The Van den Bossches, as always — Mathias hunting Victor, Hanne back at the pub on her own. The new face is Erik (Bert Haelvoet), asking after Peter. Gunther Levi turns up in the flashbacks, not resurrected.", [
      { id: "fam-hanne", q: "Is Hanne really back without Gaston?", a: "She walked into the Jan & Alleman alone. That’s the question the pub is asking. Daily, so you’ll get the answer this week, not in a binge." },
      { id: "fam-peter", q: "Do I need to remember Peter Van den Bossche?", a: "You’ll feel him. Gunther Levi is in the flashbacks, not resurrected. If the name is completely gone, start Monday and let the pub tell you." }
    ])
  ];

  const jadeChips = [
    F("Which episode should I start with?", "Episode one, traffic. Files on the Brussels Ring, years of werken, the autokeuring, e-steps and fatbikes. Toby Alderweireld and Bart De Wever sit next to a vuurspuwer named Flor. It opens there because that’s the national sport.", [
      { id: "jade-theme", q: "Is every episode a different Belgian gripe?", a: "Yes. One theme a week. Traffic was the opener because that’s the national sport. Next week will be another cliché we all pretend we invented." },
      { id: "jade-guests", q: "Is it only famous people complaining?", a: "No. That’s the joke. Premier and a zeemermin. Jade went looking for àlle Belgen — the clip is the room saying it out loud." }
    ]),
    F("Can I watch episodes in any order?", "Any order. One theme a week, closed each time — traffic this week, another cliché next. Nothing carries over except Jade. Thursday on Play, about 40 minutes.", [
      { id: "jade-plan", q: "Is this on VRT MAX?", a: "Play. The logo on the card is Play, not VRT MAX. VTM GO if you wanted Familie or Agnew instead." },
      { id: "jade-when", q: "How long is an episode?", a: "About 40 minutes, Thursday. Short enough for a weeknight, and there’s nothing to keep up with." }
    ]),
    F("What kind of humour is it?", "The Geubels format with a different mouth. Belgians, unfiltered, one theme, and the joke is that the premier and a zeemermin have the same complaint. Sofa laugh — people will talk over it and that’s fine.", [
      { id: "jade-who", q: "Who even is Jade Mintjens?", a: "Sidekick from De Ideale Wereld, first time carrying a show. Episode one even opens on Belgians going ‘who the fuck is Jade Mintjens?’ That’s the bit. Thursday, Play." },
      { id: "jade-geubels", q: "Did Geubels sign off on this?", a: "He gave the blessing. She said she’s a different generation and a different angle. You’ll hear that in the traffic episode — e-steps and fatbikes weren’t a 2013 complaint." }
    ])
  ];

  const zegChips = [
    F("Is it fun to watch with kids?", "Mostly. It’s words, not Agnew — a buzzer and four Vlamingen failing in public. Skip if the forbidden word that night is the problem, and you won’t know until they’re in it.", [
      { id: "zeg-kids", q: "What age does this actually work for?", a: "Old enough to enjoy someone losing. The game is clean; the panel is not always. It’s words, not Agnew." },
      { id: "zeg-tonight", q: "Can I put this on after De Tafel?", a: "That’s the night Play built. Table at 20:00, Zeg Eens Euh after 22:00, Monday to Thursday." }
    ]),
    F("Can we play along at home?", "That’s half the point. Pick a forbidden word, one minute on the clock, and see who cracks first — you don’t need anything else. Viktor Verhulst started talking like a robot to dodge ‘euh’; Ruth said she’d steal the trick.", [
      { id: "zeg-open", q: "Was the first night actually funny?", a: "Viktor started talking like a robot to dodge ‘euh’. Ruth said she’d steal the trick. That’s the show in thirty seconds." },
      { id: "zeg-panel", q: "Who’s on the panel this week?", a: "It changes every night. Opening week: Ruth Beeckmans, Viktor Verhulst, Erik Van Looy, Céline Van Ouytsel — then Ruben Van Gucht, Lynn Van den Broeck, Metejoor, Toby Alderweireld." }
    ]),
    F("How does the game work?", "One minute of talking. No ‘euh’, no hesitation, no forbidden word. Four Vlamingen, a buzzer, and James Cooke in Gert’s old chair. ~40 minutes on Play, Monday to Thursday.", [
      { id: "zeg-gert", q: "Why isn’t Gert hosting if it’s his game?", a: "He’s at De Tafel at 20:00. James takes 22:10. You can do both on a Monday — news, then the word fight." },
      { id: "zeg-old", q: "Do I need the old VRT episodes first?", a: "No. The game is the game. The 90s is nostalgia, not homework. Some old nights are on VRT MAX after Margriet — that’s a different sit." }
    ])
  ];

  const axelChips = [
    F("Where does he go this season?", "Season two opens in Trumpland — the Mexican border, a blocked van, then dinner with the Trumpettes in Palm Springs and a Latino owner serving a ‘Trumborrito’. After that he leaves the border for Sedona: aliens, implants, Bigfoot, and the QAnon shaman.", [
      { id: "axel-trump", q: "So it’s a Trump show?", a: "America. Trump is in the room because the country is. Axel’s line is don’t idolize it — landscapes yes, the rest is a warning. Tuesday, Play, about an hour." },
      { id: "axel-s2", q: "What did they actually film at the border?", a: "A man blocked the van and screamed them off. Then Palm Springs: Toni Holt Kramer, champagne, kitsch, unconditional Trump. Then Sammy’s Mexican Grill and the burrito named after the president." }
    ]),
    F("Do I need to have seen season 1?", "No. Each episode is a new pocket of America. Season one was the first look; this one is louder and more split. Start at Welcome to Trumpland if you want the week people are talking about.", [
      { id: "axel-sedona", q: "Is the alien episode the weird one?", a: "That’s episode two — Sedona, magnetic chips, a woman who says she has alien children, UFO spotting, Jacob Chansley in the horns, and a Bigfoot hunt. Trumpland is the political one. Sedona is the fever." },
      { id: "axel-length", q: "Is this a weeknight?", a: "About an hour, Tuesday. Heavier than Zeg Eens Euh, lighter than sitting Agnew. Fine after De Tafel if the room can take America." }
    ]),
    F("Show me more travel shows like this", "Nothing else in the house travels this way — he sits with people, and the joke is Flemish disbelief, not a prank. Closest in tone is Jade en de Belgen: the same eye, pointed at Belgians instead of Americans.", [
      { id: "axel-sofa", q: "Can we talk over this?", a: "Yes — that’s half the point. People will argue with Palm Springs. De Tafel if you wanted last night’s Belgian news instead of someone else’s country." },
      { id: "axel-more", q: "What’s closest in my plan?", a: "Jade en de Belgen on Play, Thursday. Same disbelief, shorter night, Belgians in the chair. De Tafel if you want the day’s news instead of a road trip." }
    ])
  ];

  const agnewChips = [
    F("Is this his newest show?", "This is Wake Me Up When It’s Over — the lockdown show, two years in his own head, then the Stadsschouwburg. 150.000 tickets, then the stream. It’s the one people still quote.", [
      { id: "agnew-bits", q: "What’s the bit people still repeat?", a: "Sherlock the horny dwergpoedel, the deelsteps, and the Leopold II turn. The gender passage is the one that splits a sofa. You’ll know which room you’re in." },
      { id: "agnew-clip", q: "Is the clip the whole joke?", a: "The clip is the door. The show is two hours of Agnew after two years in the house. If the clip already feels long, don’t start the night." }
    ]),
    F("How rough does the language get?", "Rough. R-rated Antwerp, and he doesn’t pad the landing — lockdown, BLM, gender, Leopold II, and the dog. Not the night if anyone wanted soft Flemish.", [
      { id: "agnew-woke", q: "Is this the woke-bashing one?", a: "He goes there — lockdown, BLM, gender, the lot. It’s also the dog and the avocado elite. If the room only hears the culture-war reel, pick another night." },
      { id: "agnew-kids", q: "House still up?", a: "No. R-rated Antwerp. Barbie or Zeg Eens Euh if someone small is still in the doorway." }
    ]),
    F("What other stand-up specials can I watch?", "In your plan, this is the stand-up. Zeg Eens Euh if you want Flemish funny that ends after 40 minutes, Jade en de Belgen for Belgians roasting the Ring instead of one man roasting the decade.", [
      { id: "agnew-long", q: "Two hours forty-three — is that a weeknight?", a: "No. A Friday, or a split you will feel. Zeg Eens Euh if you wanted a Flemish laugh that ends. This is a zaalshow — press play and sit." },
      { id: "agnew-app", q: "VTM GO or Streamz — which app actually has it?", a: "Both carry the registration. The logo on this card is VTM GO. It’s a zaalshow, not a series — press play, sit, done." }
    ])
  ];

  function item(base, clip, extra) {
    const poster = base.poster;
    return Object.assign({
      id: base.id,
      title: base.title,
      syn: base.syn,
      kind: base.kind,
      length: base.length,
      provider: base.provider,
      logo: base.logo,
      youtube: clip,
      start: 0,
      backdrop: poster,
      poster,
      qs: base.chips
    }, extra || {});
  }

  const catalog = {
    tafel: {
      id: "tafel", title: "De Tafel van Gert", syn: "The day, chewed over. One hour.",
      kind: "Talk", length: "Daily · ~60m",
      provider: "Play", logo: "play-logo.png",
      poster: "posters/tafel-gert.jpg", still: "stills/tafel-gert-card.jpg",
      seasons: ["Daily"],
      about: "Live table, Monday to Thursday, Play. Six guests on the day’s news from De Zuiderkroon. Last night was Dolly, the hottest Belgian summer, and Gert on Francken’s climate post. Not a format you binge — the conversation people are still having.",
      chips: tafelChips
    },
    familie: {
      id: "familie", title: "Familie", syn: "Daily soap, easy to fall back into",
      kind: "Series", length: "Daily · ~25m",
      provider: "VTM GO", logo: "vtm-go-logo.png",
      poster: "posters/familie.jpg", still: "stills/familie-card.jpg",
      seasons: ["Daily"],
      about: "The VTM daily — Van den Bossche, the Jan & Alleman, 25 minutes. New season opened on Victor’s kidnapping and a stranger asking for Peter. You don’t need 1991. You need this week.",
      chips: familieChips
    },
    jade: {
      id: "jade", title: "Jade en de Belgen", syn: "Belgian clichés, tested weekly",
      kind: "Series", length: "Weekly · ~40m",
      provider: "Play", logo: "play-logo.png",
      poster: "posters/jade-belgen.jpg", still: "stills/jade-card.jpg",
      seasons: ["S1"],
      about: "Jade Mintjens takes the Geubels format and points it at àlle Belgen. Episode one is traffic — the Ring, fatbikes, the keuring — with Toby Alderweireld next to a vuurspuwer. Thursday, Play.",
      chips: jadeChips
    },
    zegeuh: {
      id: "zegeuh", title: "Zeg Eens Euh", syn: "One minute of talking, zero euh",
      kind: "Game", length: "Daily · ~40m",
      provider: "Play", logo: "play-logo.png",
      poster: "posters/zeg-eens-euh.jpg", still: "stills/zegeuh-card.jpg",
      seasons: ["2026"],
      about: "The word fight is back. James Cooke in Gert’s old chair. Four Vlamingen, one minute, no euh, no forbidden word. Monday to Thursday on Play, after De Tafel.",
      chips: zegChips
    },
    axel: {
      id: "axel", title: "Axel Terug Naar Amerika", syn: "Travel doc, one region per episode",
      kind: "Series", length: "S2 · ~65m",
      provider: "Play", logo: "play-logo.png",
      poster: "posters/axel-amerika.jpg", still: "stills/axel-card.jpg",
      seasons: ["S1", "S2"],
      about: "Axel Daeseleire back in a louder America. Season two opens in Trumpland — border rage, Palm Springs Trumpettes, a Trumborrito — then Sedona for aliens and the QAnon shaman. Tuesday, Play.",
      chips: axelChips
    },
    agnew: {
      id: "agnew", title: "Alex Agnew", syn: "Stand-up, sharp, no filter",
      kind: "Stand-up", length: "2h 43",
      provider: "VTM GO", logo: "vtm-go-logo.png",
      poster: "posters/alex-agnew.jpg", still: "stills/agnew-card.jpg",
      seasons: ["Special"],
      about: "Wake Me Up When It’s Over — two years in his own head, then the Stadsschouwburg. Deelsteps, the avocado elite, Sherlock the dwergpoedel, Leopold II. 2h 43 on VTM GO. A night, not a clip.",
      chips: agnewChips
    }
  };

  const feed = [
    item(catalog.tafel, "tafel-gert-1"),
    item(catalog.familie, "familie-1"),
    item(catalog.zegeuh, "zeg-eens-euh-1"),
    item(catalog.jade, "jade-belgen"),
    item(catalog.axel, "axel-amerika"),
    item(catalog.agnew, "alex-agnew")
  ];

  const laneLead = [
    item(catalog.tafel, "tafel-gert-1"),
    item(catalog.familie, "familie-1"),
    item(catalog.zegeuh, "zeg-eens-euh-1"),
    item(catalog.axel, "axel-amerika"),
    item(catalog.jade, "jade-belgen"),
    item(catalog.agnew, "alex-agnew")
  ];

  const search = {
    tafel: { title: catalog.tafel.title, provider: "Play", logo: catalog.tafel.logo, poster: catalog.tafel.poster, syn: catalog.tafel.syn, kind: catalog.tafel.kind },
    familie: { title: catalog.familie.title, provider: "VTM GO", logo: catalog.familie.logo, poster: catalog.familie.poster, syn: catalog.familie.syn, kind: catalog.familie.kind },
    jade: { title: catalog.jade.title, provider: "Play", logo: catalog.jade.logo, poster: catalog.jade.poster, syn: catalog.jade.syn, kind: catalog.jade.kind },
    zegeuh: { title: catalog.zegeuh.title, provider: "Play", logo: catalog.zegeuh.logo, poster: catalog.zegeuh.poster, syn: catalog.zegeuh.syn, kind: catalog.zegeuh.kind },
    axel: { title: catalog.axel.title, provider: "Play", logo: catalog.axel.logo, poster: catalog.axel.poster, syn: catalog.axel.syn, kind: catalog.axel.kind },
    agnew: { title: catalog.agnew.title, provider: "VTM GO", logo: catalog.agnew.logo, poster: catalog.agnew.poster, syn: catalog.agnew.syn, kind: catalog.agnew.kind }
  };

  function stuffRow(id, extra) {
    const t = catalog[id];
    return Object.assign({
      id: t.id,
      title: t.title,
      kind: t.kind === "Stand-up" ? "Film" : t.kind === "Talk" || t.kind === "Game" ? "Series" : t.kind,
      length: t.length,
      mins: id === "agnew" ? 163 : id === "axel" ? 65 : id === "tafel" ? 60 : id === "jade" ? 40 : 25,
      provider: t.provider,
      logo: t.logo,
      poster: t.poster,
      still: t.still,
      fallback: t.poster,
      tags: extra.tags,
      progress: extra.progress,
      continue: extra.continue,
      ep: extra.ep
    }, extra.more || {});
  }

  const stuff = [
    stuffRow("tafel", { tags: ["easy", "friends", "leaving"], progress: .74, continue: true, ep: "Last night" }),
    stuffRow("familie", { tags: ["easy", "leaving", "friends"], progress: .61, continue: true, ep: "Daily" }),
    stuffRow("zegeuh", { tags: ["easy", "friends", "short"], progress: .22, continue: true, ep: "Tonight" }),
    stuffRow("jade", { tags: ["easy", "friends", "friday"] }),
    stuffRow("axel", { tags: ["friday", "acclaimed", "friends"] }),
    stuffRow("agnew", { tags: ["friday", "short", "friends"], more: { kind: "Film" } })
  ];

  const aliases = {
    detafelvangert: "tafel",
    detafel: "tafel",
    tafelvangert: "tafel",
    gert: "tafel",
    familie: "familie",
    jadeendebelgen: "jade",
    jade: "jade",
    alexagnew: "agnew",
    wakemeupwhenitsover: "agnew",
    agnew: "agnew",
    zegeenseuh: "zegeuh",
    zegeuh: "zegeuh",
    axelterugnaaramerika: "axel",
    axelinamerika: "axel",
    axel: "axel"
  };

  global.FlemishTitles = {
    catalog,
    feed,
    laneLead,
    search,
    stuff,
    aliases,
    ids: ["tafel", "familie", "jade", "zegeuh", "axel", "agnew"]
  };
})(window);
