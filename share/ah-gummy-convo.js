(function (global) {
  const star = '<img class="star" src="star.svg" alt="" aria-hidden="true">';
  const reduceDefault = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function textOf(item) {
    if (!item) return "";
    const a = item.a;
    return typeof a === "function" ? a() : String(a || "");
  }
  function flatten(bank) {
    const out = [];
    (bank || []).forEach(item => {
      out.push(item);
      (item.follow || []).forEach(f => {
        if (f && f.id) out.push({ ...f, parent: item.id, topic: f.topic || item.topic, who: f.who || item.who, titles: f.titles || item.titles });
      });
    });
    return out;
  }

  function create(opts) {
    const phone = opts.phone;
    const sheet = opts.sheet;
    const reduceMotion = opts.reduceMotion ?? reduceDefault;
    let bank = opts.bank || [];
    let getStarters = opts.starters || (() => bank.slice(0, 3));
    const placeholder = opts.placeholder || "Ask anything…";
    const hello = opts.hello || "Ask about what’s on this screen — or go somewhere else entirely.";
    let streamT = 0;
    let voiceT = 0;
    let except = null;
    let last = null;
    let history = [];
    let drag = null;

    const thread = () => sheet.querySelector(".ask-thread");
    const startersEl = () => sheet.querySelector(".ask-starters");
    const host = () => sheet.querySelector("[data-qconvo-ask]") || sheet.querySelector(".qconvo");
    const panel = () => sheet.querySelector(".csheet-panel");
    const inp = () => sheet.querySelector(".ask-freeq");
    const helloEl = () => sheet.querySelector("[data-csheet-hello]");

    function find(id) {
      return flatten(bank).find(x => x.id === id) || bank.find(x => x.id === id);
    }
    function setBank(next) { bank = next || []; }
    function setStarters(fn) { getStarters = fn; }

    function streamText(text, el, done) {
      clearInterval(streamT);
      const plain = String(text);
      if (reduceMotion) { el.textContent = plain; done && done(); return; }
      el.textContent = "";
      const cur = document.createElement("span");
      cur.className = "cursor";
      cur.textContent = "▍";
      el.appendChild(cur);
      let i = 0;
      streamT = setInterval(() => {
        i += Math.max(1, Math.round(plain.length / 52));
        el.textContent = plain.slice(0, i);
        if (i < plain.length) el.appendChild(cur);
        if (i >= plain.length) {
          clearInterval(streamT);
          el.textContent = plain;
          done && done();
        }
        el.parentElement && (el.parentElement.scrollTop = el.parentElement.scrollHeight);
      }, 18);
    }

    function seed(q) {
      const th = thread();
      if (!th) return null;
      const b = document.createElement("div");
      b.className = "qbubble";
      b.textContent = q;
      const an = document.createElement("div");
      an.className = "ansr";
      th.appendChild(b);
      th.appendChild(an);
      th.parentElement.scrollTop = th.parentElement.scrollHeight;
      return an;
    }

    function collectStarters(exceptId) {
      const skip = new Set([exceptId, last && last.id].filter(Boolean));
      const seen = new Set();
      const out = [];
      const push = (items, allowAsked) => {
        (items || []).forEach(x => {
          if (out.length >= 3) return;
          if (!x || !x.id || !x.q) return;
          if (seen.has(x.id) || skip.has(x.id)) return;
          if (!allowAsked && history.includes(x.id)) return;
          seen.add(x.id);
          out.push(x);
        });
      };
      push(last && last.follow);
      if (last && last.parent) push((find(last.parent) || {}).follow);
      const starters = typeof getStarters === "function" ? getStarters(last) : [];
      push(starters);
      push(bank);
      push(flatten(bank));
      if (out.length < 3) {
        push(starters, true);
        push(bank, true);
        push(flatten(bank), true);
      }
      return out.slice(0, 3);
    }

    function renderStarters(exceptId) {
      const row = startersEl();
      if (!row) return;
      except = exceptId ?? except;
      const list = collectStarters(except);
      row.innerHTML = list.map(item =>
        `<button class="qchip" type="button" data-ask-q="${esc(item.id)}">${esc(item.q)}</button>`
      ).join("");
      row.classList.toggle("hid", list.length === 0);
      const label = sheet.querySelector(".label-mini");
      if (label) label.textContent = last ? "You could also ask" : "You could ask";
    }

    function bindComposer() {
      const row = host()?.querySelector(".askinput");
      const field = inp();
      const send = sheet.querySelector("[data-ask-send]");
      if (!field || !send) return;
      if (placeholder) field.placeholder = placeholder;
      const sync = () => {
        const ready = field.value.trim().length > 0;
        send.classList.toggle("is-idle", !ready);
        send.classList.toggle("is-ready", ready);
        send.disabled = !ready;
        row?.classList.toggle("is-typed", ready && !row.classList.contains("is-rec"));
      };
      field.oninput = sync;
      field.onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); askText(); } };
      sync();
    }

    function setTalking(on) {
      sheet.classList.toggle("is-talking", !!on);
    }

    function run(item, spoken) {
      if (!item) return;
      last = item;
      history.push(item.id);
      except = item.id;
      setTalking(true);
      const q = spoken || item.q;
      const an = seed(q);
      const row = startersEl();
      row?.classList.add("hid");
      streamText(textOf(item), an, () => {
        row?.classList.remove("hid");
        renderStarters(item.id);
        an.parentElement && (an.parentElement.scrollTop = an.parentElement.scrollHeight);
      });
    }

    function matchText(raw) {
      const q = String(raw || "").toLowerCase();
      const all = flatten(bank);
      const inLast = last ? (last.follow || []).concat(last) : [];
      const pool = inLast.concat(all);
      const scored = pool.map(item => {
        const hay = `${item.q} ${(item.keys || "")} ${(item.titles || []).join(" ")} ${item.who || ""}`.toLowerCase();
        let n = 0;
        q.split(/\s+/).forEach(w => { if (w.length > 2 && hay.includes(w)) n += 1; });
        if (last && (item.parent === last.id || item.id === last.id)) n += 2;
        if (last && /she|her|him|he|that one|the second|this one/.test(q) && (item.who || item.parent)) n += 2;
        return { item, n };
      }).sort((a, b) => b.n - a.n);
      if (scored[0] && scored[0].n >= 2) return scored[0].item;
      if (last && /she|her/.test(q) && last.who) {
        const more = all.find(x => x.who === last.who && x.id !== last.id);
        if (more) return more;
      }
      if (last && /darker|not really|something else|meant/.test(q)) {
        return last.follow && last.follow[0] ? last.follow[0] : last;
      }
      return {
        id: "free",
        q: raw,
        a: last
          ? `I can stay with this — ${last.q.replace(/\?$/, "")} — or we can go somewhere else. What should I use: the crime, the length, or what’s already in your plan?`
          : "Tell me the mood, the length, or what’s already on the sofa. I’ll keep it inside what you subscribe to unless you say otherwise.",
        follow: last && last.follow && last.follow.length ? last.follow : undefined,
        parent: last && last.parent
      };
    }

    function ask(id) {
      const item = find(id);
      if (item) run(item);
    }
    function askText(raw) {
      const field = inp();
      const q = (raw ?? field?.value ?? "").trim();
      if (!q) return;
      if (field) field.value = "";
      bindComposer();
      run(matchText(q), q);
    }

    function open(startId) {
      const th = thread();
      if (th) th.innerHTML = "";
      except = null;
      last = startId ? find(startId) : null;
      history = [];
      setTalking(!!startId);
      const hi = helloEl();
      if (hi) hi.textContent = typeof opts.hello === "function" ? opts.hello(last) : hello;
      bindComposer();
      renderStarters(null);
      startersEl()?.classList.remove("hid");
      phone.classList.add("is-ask");
      sheet.classList.add("is-on");
      sheet.setAttribute("aria-hidden", "false");
      if (typeof opts.onOpen === "function") opts.onOpen(startId);
      if (startId) {
        const item = find(startId);
        if (item) run(item);
      }
    }

    function stopVoice(commit) {
      const row = host()?.querySelector(".askinput");
      const mic = sheet.querySelector("[data-ask-mic]");
      clearTimeout(voiceT);
      voiceT = 0;
      row?.classList.remove("is-rec");
      mic?.classList.remove("is-rec");
      if (mic) mic.setAttribute("aria-label", "Ask with voice");
      if (commit) {
        const seedQ = last
          ? (last.follow && last.follow[0] ? last.follow[0].q : last.q)
          : (getStarters(null)[0] && getStarters(null)[0].q) || "What should I watch tonight?";
        askText(seedQ);
      } else bindComposer();
    }

    function toggleVoice() {
      const row = host()?.querySelector(".askinput");
      const mic = sheet.querySelector("[data-ask-mic]");
      if (!row || !mic) return;
      if (row.classList.contains("is-rec")) { stopVoice(true); return; }
      inp()?.blur();
      row.classList.add("is-rec");
      row.classList.remove("is-typed");
      mic.classList.add("is-rec");
      mic.setAttribute("aria-label", "Stop recording");
      voiceT = setTimeout(() => stopVoice(true), 2200);
    }

    function close() {
      clearInterval(streamT);
      stopVoice(false);
      phone.classList.remove("is-ask");
      sheet.classList.remove("is-on", "is-drag", "is-talking");
      sheet.setAttribute("aria-hidden", "true");
      const p = panel();
      if (p) p.style.transform = "";
      if (typeof opts.onClose === "function") opts.onClose();
    }

    function isOpen() { return sheet.classList.contains("is-on"); }

    sheet.addEventListener("click", e => {
      if (e.target.closest("[data-csheet-dismiss]")) { close(); return; }
      if (e.target.closest("[data-ask-send]")) { askText(); return; }
      if (e.target.closest("[data-ask-mic]")) { toggleVoice(); return; }
      const chip = e.target.closest("[data-ask-q]");
      if (chip) { ask(chip.dataset.askQ); return; }
    });

    const handle = sheet.querySelector(".csheet-handle");
    if (handle) {
      handle.addEventListener("pointerdown", e => {
        const p = panel();
        if (!p) return;
        drag = { y: e.clientY, id: e.pointerId };
        sheet.classList.add("is-drag");
        try { handle.setPointerCapture(e.pointerId); } catch (_) {}
      });
      handle.addEventListener("pointermove", e => {
        if (!drag || e.pointerId !== drag.id) return;
        const dy = Math.max(0, e.clientY - drag.y);
        const p = panel();
        if (p) p.style.transform = `translateY(${dy}px)`;
      });
      const end = e => {
        if (!drag || e.pointerId !== drag.id) return;
        const dy = Math.max(0, e.clientY - drag.y);
        drag = null;
        sheet.classList.remove("is-drag");
        const p = panel();
        if (p) p.style.transform = "";
        if (dy > 88 || dy < 8) close();
      };
      handle.addEventListener("pointerup", end);
      handle.addEventListener("pointercancel", end);
    }

    if (window.visualViewport) {
      const syncKb = () => {
        const vv = window.visualViewport;
        const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
        sheet.style.setProperty("--csheet-kb", kb > 40 ? `${kb}px` : "0px");
      };
      window.visualViewport.addEventListener("resize", syncKb);
      window.visualViewport.addEventListener("scroll", syncKb);
    }

    return { open, close, ask, askText, isOpen, setBank, setStarters, find };
  }

  function markup(placeholder) {
    return `<div class="csheet" data-csheet aria-hidden="true">
      <div class="csheet-scrim" data-csheet-dismiss></div>
      <div class="csheet-panel">
        <button class="csheet-handle" type="button" aria-label="Close conversation"><i></i></button>
        <div class="qconvo" data-qconvo-ask>
          <div class="qconvo-scroll">
            <p class="csheet-hello" data-csheet-hello></p>
            <div class="ask-thread"></div>
            <div class="ask-continue">
              <div class="label-mini">You could ask</div>
              <div class="ask-starters"></div>
            </div>
          </div>
          <div class="qconvo-foot">
            <div class="askinput">
              <input class="ask-freeq" type="text" placeholder="${esc(placeholder || "Ask anything…")}" autocomplete="off">
              <div class="ask-listen" aria-hidden="true"><span class="wave"><i></i><i></i><i></i><i></i><i></i></span><span>Listening…</span></div>
              <button class="ask-mic" type="button" data-ask-mic aria-label="Ask with voice">
                <svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6.5 11a5.5 5.5 0 0 0 11 0"/><path d="M12 16.5V21"/></svg>
              </button>
              <button type="button" class="is-idle" data-ask-send aria-label="Send" disabled>
                <svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }

  global.GummyConvo = { create, markup, esc };
})(window);
