(function (global) {
  const F = (q, a, follow) => ({ q, a, follow: follow || [] });

  const tafelChips = [
    F("What did they talk about yesterday at De Tafel?", "The table is yesterday’s news, not a format. Last night it was Dolly Parton, the hottest Belgian summer on record, and Gert catching Theo Francken’s climate post. Nicole Van Lipzig from KU Leuven sat for the heat. If you only want the row, skip to the climate block.", [
      { id: "tafel-who", q: "Who was actually at the table?", a: "Jade Mintjens talking her new Play show, Little Kim and Christophe Vekeman for Dolly, Nicole Van Lipzig on the summer. Tafelspringers: Hannes Heynderickx, Nora Gharib, Peter Van de Veire. That’s a Tuesday table — Wednesday will be a different paper." },
      { id: "tafel-climate", q: "Did Gert really back Francken on the climate?", a: "He said he understood the post. Van Lipzig’s graphs did not. That’s the show: the day’s row, live, and Gert doesn’t pretend he’s a scientist." },
      { id: "tafel-catch", q: "Can I watch last night without the whole hour?", a: "Yes — Play keeps the night. Last night if you want the conversation people are still having. A week-old episode is already stale. That’s the point of a daily table." }
    ]),
    F("Is this still Gert, or is Tine hosting now?", "Both. Gert most nights, Tine when he’s off, and Ruben Van Gucht is taking the chair this season. The table stays the same — six guests, live from De Zuiderkroon, Monday to Thursday at 20:00 on Play.", [
      { id: "tafel-ruben", q: "So Ruben Van Gucht is presenting De Tafel?", a: "From this season, yes — third host, not a guest. Gert and Tine stay. If you wanted only Verhulst, check the night. The conversation is still the day’s news." },
      { id: "tafel-live", q: "Do I need to watch it live?", a: "Live is the sport. Play has last night if you missed 20:00. Don’t start a Thursday episode on Saturday and expect it to feel current." }
    ]),
    F("Any night, or do I need last night?", "Any night works — it’s the news of that day. Last night if you want the conversation the house is still having. Monday to Thursday, about an hour, Play.", [
      { id: "tafel-week", q: "Is there a weekly recap if I missed the table?", a: "De Tafel van de Week stitches the best rows. Fine if you want the hits. Not the same as sitting last night when Francken and the heat were still warm." },
      { id: "tafel-sofa", q: "Can we talk over this?", a: "That’s the one. People argue with the table. Zeg Eens Euh if you wanted a game after. Familie if the room wanted the daily soap instead." }
    ])
  ];

  const familieChips = [
    F("Did they find Victor, or is Mathias still looking?", "The new season opened on the kidnapping — Victor gone, Mathias tearing Mechelen apart. Extra-long Monday. If you left before the summer, start there. You’ll know in twenty minutes if you’re back in.", [
      { id: "fam-monday", q: "So I should start at the long episode?", a: "Yes. That’s the hook of week one. VTM GO has it. Don’t dip into Thursday and wonder who Erik is." },
      { id: "fam-week", q: "What’s this week actually about besides Victor?", a: "Erik walked into the Jan & Alleman asking for Peter Van den Bossche. Flashbacks with Gunther Levi start filling why. Hanne came back without Gaston. That’s three fires, 25 minutes a night." }
    ]),
    F("Who is this Erik asking after Peter?", "New face, old ghost. Erik (Bert Haelvoet) came in asking for Peter. Then Ludo. Then the flashbacks. The Van den Bossches are carrying a past they thought was closed — not a recap you can skip.", [
      { id: "fam-hanne", q: "Is Hanne really back without Gaston?", a: "She walked into the Jan & Alleman alone. That’s the question the pub is asking. Daily, so you’ll get the answer this week, not in a binge." },
      { id: "fam-peter", q: "Do I need to remember Peter Van den Bossche?", a: "You’ll feel him. Gunther Levi is in the flashbacks, not resurrected. If the name is completely gone, start Monday and let the pub tell you." }
    ]),
    F("Can I jump in after 35 seasons?", "Yes. It’s a daily — 25 minutes, Mechelen, the holding and the pub. You don’t need 1991. You need this week’s Victor and whoever just walked into the Jan & Alleman. Thuis if you wanted the other daily, on VRT MAX.", [
      { id: "fam-thuis", q: "Thuis or Familie if I only have one daily?", a: "Familie if you want VTM and a kidnapping week. Thuis if you already chip at VRT MAX. Same length. Different village." },
      { id: "fam-miss", q: "What if I miss two nights?", a: "VTM GO+ has the week from Saturday. Otherwise the pub will recap louder than a title card. It’s a soap — that’s the deal." }
    ])
  ];

  const jadeChips = [
    F("Is this just Geubels en de Belgen with a new host?", "The format, yes — Belgians, unfiltered, one theme. The voice is Jade Mintjens, not Philippe. First episode is traffic: the Ring, fatbikes, the keuring. If you wanted Geubels, this isn’t a rerun.", [
      { id: "jade-who", q: "Who even is Jade Mintjens?", a: "Sidekick from De Ideale Wereld, first time carrying a show. Episode one even opens on Belgians going ‘who the fuck is Jade Mintjens?’ That’s the bit. Thursday, Play." },
      { id: "jade-geubels", q: "Did Geubels sign off on this?", a: "He gave the blessing. She said she’s a different generation and a different angle. You’ll hear that in the traffic episode — e-steps and fatbikes weren’t a 2013 complaint." }
    ]),
    F("What did they actually take on in episode one?", "Traffic. Files on the Brussels Ring, years of werken, the autokeuring, e-steps and fatbikes. Toby Alderweireld and Bart De Wever sit next to a vuurspuwer named Flor. Famous and not, same complaint.", [
      { id: "jade-theme", q: "Is every episode a different Belgian gripe?", a: "Yes. One theme a week. Traffic was the opener because that’s the national sport. Next week will be another cliché we all pretend we invented." },
      { id: "jade-guests", q: "Is it only famous people complaining?", a: "No. That’s the joke. Premier and a zeemermin. Jade went looking for àlle Belgen — the clip is the room saying it out loud." }
    ]),
    F("A sofa laugh, or do I need to sit still?", "Sofa. People will talk over it and that’s fine. Thursday on Play. Zeg Eens Euh if you wanted a game the same night. De Tafel if you wanted the news with a grin, not a roast of the Ring.", [
      { id: "jade-plan", q: "Is this on VRT MAX?", a: "Play. The logo on the card is Play, not VRT MAX. VTM GO if you wanted Familie or Agnew instead." }
    ])
  ];

  const zegChips = [
    F("Is James Cooke as host as good as Gert used to be?", "Different chair. Gert invented it in ’92; James has the 2026 revival. Same game: one minute, no ‘euh’, no forbidden word, four Vlamingen with a buzzer. Ruth Beeckmans, Viktor Verhulst, Erik Van Looy and Céline Van Ouytsel opened the week.", [
      { id: "zeg-gert", q: "Why isn’t Gert hosting if it’s his game?", a: "He’s at De Tafel at 20:00. James takes 22:10. You can do both on a Monday — news, then the word fight." },
      { id: "zeg-open", q: "Was the first night actually funny?", a: "Viktor started talking like a robot to dodge ‘euh’. Ruth said she’d steal the trick. That’s the show in thirty seconds." }
    ]),
    F("Who’s on the panel this week?", "It changes every night. Opening week: Ruth, Viktor, Erik Van Looy, Céline — then Ruben Van Gucht, Lynn Van den Broeck, Metejoor, Toby Alderweireld. You don’t need the 90s panel. You need tonight’s forbidden word.", [
      { id: "zeg-tonight", q: "Can I put this on after De Tafel?", a: "That’s the night Play built. Table at 20:00, Zeg Eens Euh after 22:00, Monday to Thursday." },
      { id: "zeg-old", q: "Do I need the old VRT episodes first?", a: "No. The game is the game. The 90s is nostalgia, not homework. Some old nights are on VRT MAX after Margriet — that’s a different sit." }
    ]),
    F("Can we shout at this, or is it a quiet game?", "Shout. Buzzer, forbidden word, people in the room picking a side. ~40 minutes, Play. Agnew if you wanted one man talking for two hours. This is four people failing in public.", [
      { id: "zeg-kids", q: "Fine if kids are still up?", a: "Mostly. It’s words, not Agnew. Skip if the forbidden word that night is the problem — you won’t know until they’re in it." }
    ])
  ];

  const axelChips = [
    F("What’s he doing back in America this season?", "Season two opened in Trumpland — Mexican border, a blocked van, then dinner with the Trumpettes in Palm Springs and a Latino owner serving a ‘Trumborrito’. Next up he leaves the border for Sedona: aliens, implants, Bigfoot, and the QAnon shaman.", [
      { id: "axel-trump", q: "So it’s a Trump show?", a: "America. Trump is in the room because the country is. Axel’s line is don’t idolize it — landscapes yes, the rest is a warning. Tuesday, Play, about an hour." },
      { id: "axel-s2", q: "What did they actually film at the border?", a: "A man blocked the van and screamed them off. Then Palm Springs: Toni Holt Kramer, champagne, kitsch, unconditional Trump. Then Sammy’s Mexican Grill and the burrito named after the president." }
    ]),
    F("Can I start at season two?", "Yes. Each episode is a new pocket of America. Season one was the first look; this one is louder and more split. Start at Welcome to Trumpland if you want the week people are talking about.", [
      { id: "axel-sedona", q: "Is the alien episode the weird one?", a: "That’s episode two — Sedona, magnetic chips, a woman who says she has alien children, UFO spotting, Jacob Chansley in the horns, and a Bigfoot hunt. Trumpland is the political one. Sedona is the fever." },
      { id: "axel-length", q: "Is this a weeknight?", a: "About an hour, Tuesday. Heavier than Zeg Eens Euh, lighter than sitting Agnew. Fine after De Tafel if the room can take America." }
    ]),
    F("Reportage, or is he just winding Americans up?", "He sits with them. The joke is Flemish disbelief, not a prank show. You’ll know in the Trumpette dinner whether that’s your night. Play, not VTM GO.", [
      { id: "axel-sofa", q: "Can we talk over this?", a: "Yes — that’s half the point. People will argue with Palm Springs. De Tafel if you wanted last night’s Belgian news instead of someone else’s country." }
    ])
  ];

  const agnewChips = [
    F("Is this the lockdown show everyone still quotes?", "That’s the one. Two years in his own head: deelsteppers, the avocado elite, Sherlock the dwergpoedel, Leopold II, and the gender bit that made the room go quiet. 2h 43. A night, not a clip.", [
      { id: "agnew-long", q: "Two hours forty-three — is that a weeknight?", a: "No. A Friday, or a split you will feel. Zeg Eens Euh if you wanted a Flemish laugh that ends. This is a zaalshow — press play and sit." },
      { id: "agnew-bits", q: "What’s the bit people still repeat?", a: "Sherlock the horny dwergpoedel, the deelsteps, and the Leopold II turn. The gender passage is the one that splits a sofa. You’ll know which room you’re in." }
    ]),
    F("Too sharp for this room?", "He doesn’t pad the landing. Fine if this sofa likes Agnew. Not fine if anyone wanted soft Flemish. Zeg Eens Euh if you wanted a laugh you can talk over. Jade if you wanted Belgians roasting the Ring instead of one man roasting the decade.", [
      { id: "agnew-woke", q: "Is this the woke-bashing one?", a: "He goes there — lockdown, BLM, gender, the lot. It’s also the dog and the avocado elite. If the room only hears the culture-war reel, pick another night." },
      { id: "agnew-kids", q: "House still up?", a: "No. R-rated Antwerp. Barbie or Zeg Eens Euh if someone small is still in the doorway." }
    ]),
    F("VTM GO or Streamz — which app actually has it?", "Both carry the registration. The logo on this card is VTM GO. It’s a zaalshow, not a series — 150.000 tickets, Stadsschouwburg, then the stream. Press play, sit, done.", [
      { id: "agnew-clip", q: "Is the clip the whole joke?", a: "The clip is the door. The show is two hours of Agnew after two years in the house. If the clip already feels long, don’t start the night." }
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
      id: "tafel", title: "De Tafel van Gert", syn: "News. Table. Last night.",
      kind: "Talk", length: "Daily · ~60m",
      provider: "Play", logo: "play-logo.png",
      poster: "posters/tafel-gert.jpg", still: "stills/tafel-gert-card.jpg",
      seasons: ["Daily"],
      about: "Live table, Monday to Thursday, Play. Six guests on the day’s news from De Zuiderkroon. Last night was Dolly, the hottest Belgian summer, and Gert on Francken’s climate post. Not a format you binge — the conversation people are still having.",
      chips: tafelChips
    },
    familie: {
      id: "familie", title: "Familie", syn: "Daily. Mechelen. This week.",
      kind: "Series", length: "Daily · ~25m",
      provider: "VTM GO", logo: "vtm-go-logo.png",
      poster: "posters/familie.jpg", still: "stills/familie-card.jpg",
      seasons: ["Daily"],
      about: "The VTM daily — Van den Bossche, the Jan & Alleman, 25 minutes. New season opened on Victor’s kidnapping and a stranger asking for Peter. You don’t need 1991. You need this week.",
      chips: familieChips
    },
    jade: {
      id: "jade", title: "Jade en de Belgen", syn: "Belgians. Clichés. Traffic.",
      kind: "Series", length: "Weekly · ~40m",
      provider: "Play", logo: "play-logo.png",
      poster: "posters/jade-belgen.jpg", still: "stills/jade-card.jpg",
      seasons: ["S1"],
      about: "Jade Mintjens takes the Geubels format and points it at àlle Belgen. Episode one is traffic — the Ring, fatbikes, the keuring — with Toby Alderweireld next to a vuurspuwer. Thursday, Play.",
      chips: jadeChips
    },
    zegeuh: {
      id: "zegeuh", title: "Zeg Eens Euh", syn: "One minute. No euh. Buzzer.",
      kind: "Game", length: "Daily · ~40m",
      provider: "Play", logo: "play-logo.png",
      poster: "posters/zeg-eens-euh.jpg", still: "stills/zegeuh-card.jpg",
      seasons: ["2026"],
      about: "The word fight is back. James Cooke in Gert’s old chair. Four Vlamingen, one minute, no euh, no forbidden word. Monday to Thursday on Play, after De Tafel.",
      chips: zegChips
    },
    axel: {
      id: "axel", title: "Axel Terug Naar Amerika", syn: "Border. Trumpettes. Sedona.",
      kind: "Series", length: "S2 · ~65m",
      provider: "Play", logo: "play-logo.png",
      poster: "posters/axel-amerika.jpg", still: "stills/axel-card.jpg",
      seasons: ["S1", "S2"],
      about: "Axel Daeseleire back in a louder America. Season two opens in Trumpland — border rage, Palm Springs Trumpettes, a Trumborrito — then Sedona for aliens and the QAnon shaman. Tuesday, Play.",
      chips: axelChips
    },
    agnew: {
      id: "agnew", title: "Alex Agnew", syn: "Lockdown. Deelsteps. Sherlock.",
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
    item(catalog.agnew, "alex-agnew"),
    item(catalog.tafel, "tafel-gert-2", { syn: "Dolly. Heat. Francken." }),
    item(catalog.familie, "familie-2", { syn: "Victor. Erik. The pub." }),
    item(catalog.zegeuh, "zeg-eens-euh-2", { syn: "James. Buzzer. Tonight." }),
    item(catalog.familie, "familie-3", { syn: "Hanne. Peter. Week one." })
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
