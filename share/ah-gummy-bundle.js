(function (global) {
  const PROVIDERS = ["HBO Max", "Streamz"];
  const FALLBACK = ["dune", "tlou", "barb", "zill", "twaalf", "penguin", "opp"];
  const reduceDefault = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function esc(s) {
    return String(s || "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function catalogOf(id) {
    const T = global.GummyTitle;
    if (!T) return null;
    if (T.catalog && T.catalog[id]) return T.catalog[id];
    return typeof T.lookup === "function" ? T.lookup(id) : null;
  }

  function unlockItems(added) {
    const seen = new Set();
    const out = [];
    function push(raw) {
      const item = raw && (raw.poster ? raw : catalogOf(raw.id || raw));
      if (!item || !item.poster || seen.has(item.id)) return;
      if (!PROVIDERS.includes(item.provider)) return;
      seen.add(item.id);
      out.push(item);
    }
    if (added) push(added);
    try {
      JSON.parse(localStorage.getItem("alfora-watchlist") || "[]").forEach(id => push(catalogOf(id)));
    } catch (_) {}
    FALLBACK.forEach(id => push(catalogOf(id)));
    return out.slice(0, 6);
  }

  function postersHTML(added) {
    const items = unlockItems(added);
    if (!items.length) return "";
    return items.map(item =>
      `<div class="gbundle-poster"><img src="${esc(item.poster)}" alt="${esc(item.title)}"></div>`
    ).join("");
  }

  function markup() {
    return `<div class="gbundle" data-gbundle aria-hidden="true">
      <div class="gbundle-scrim" data-gbundle-dismiss></div>
      <div class="gbundle-card" role="dialog" aria-modal="true" aria-labelledby="gbundle-title">
        <button class="gbundle-x" type="button" data-gbundle-dismiss aria-label="Close">
          <img src="ask-close.svg" alt="">
        </button>
        <div class="gbundle-hero">
          <div class="gbundle-giftwrap" aria-hidden="true">
            <span class="gbundle-star s1"></span>
            <span class="gbundle-star s2"></span>
            <img class="gbundle-gift" src="bundle-gift.png" alt="">
            <span class="gbundle-star s3"></span>
            <span class="gbundle-star s4"></span>
          </div>
          <h2 id="gbundle-title">Bundle up for your next watch</h2>
          <div class="gbundle-apps">
            <img class="hbo" src="hbo-max-new-logo.jpg" alt="HBO Max">
            <span class="plus">+</span>
            <img class="streamz" src="streamz-logo.jpg" alt="Streamz">
          </div>
          <p class="gbundle-sub">Most of your saved titles are on HBO Max and Streamz.</p>
        </div>
        <div class="gbundle-rule" aria-hidden="true"></div>
        <div class="gbundle-price">
          <span class="gbundle-was">€24,45</span>
          <span class="gbundle-now">€19,99</span>
          <span class="gbundle-save">Save €4,46</span>
        </div>
        <div class="gbundle-unlock">
          <p>What you’ll unlock</p>
          <div class="gbundle-rail" data-gbundle-rail></div>
        </div>
        <button class="gbundle-cta" type="button" data-gbundle-more>Learn more</button>
      </div>
    </div>`;
  }

  const hosts = new WeakMap();

  function goShop(phone) {
    const shop = phone.querySelector('[data-nav="shop"]');
    if (shop) { shop.click(); return; }
    if (window.parent && window.parent !== window) {
      const type = document.documentElement.classList.contains("is-app") ? "app-go" : "playground-go";
      window.parent.postMessage({ type, id: "gummy-shop", href: "ah-gummy-shop.html" }, "*");
      return;
    }
    const url = new URL("ah-gummy-shop.html", location.href);
    if (document.documentElement.classList.contains("is-app")) url.searchParams.set("app", "1");
    location.href = url.pathname + url.search;
  }

  function mount(phone, opts) {
    if (!phone) return null;
    if (hosts.has(phone)) {
      const api = hosts.get(phone);
      if (opts && opts.onLearnMore) api.onLearnMore = opts.onLearnMore;
      return api;
    }
    phone.insertAdjacentHTML("beforeend", markup());
    const root = phone.querySelector("[data-gbundle]");
    const rail = root.querySelector("[data-gbundle-rail]");
    const reduceMotion = (opts && opts.reduceMotion) ?? reduceDefault;
    let closeT = 0;
    const api = {
      onLearnMore: opts && opts.onLearnMore,
      isOpen() { return root.classList.contains("is-on"); },
      open(payload) {
        clearTimeout(closeT);
        rail.innerHTML = postersHTML(payload && payload.added);
        root.classList.add("is-on");
        root.setAttribute("aria-hidden", "false");
      },
      close() {
        if (!root.classList.contains("is-on")) return;
        root.classList.remove("is-on");
        root.setAttribute("aria-hidden", "true");
      }
    };
    root.addEventListener("click", e => {
      if (e.target.closest("[data-gbundle-more]")) {
        const more = api.onLearnMore;
        api.close();
        if (typeof more === "function") more();
        else goShop(phone);
        return;
      }
      if (e.target.closest("[data-gbundle-dismiss]")) api.close();
    });
    void reduceMotion;
    hosts.set(phone, api);
    return api;
  }

  function of(phone) {
    return (phone && hosts.get(phone)) || null;
  }

  global.GummyBundle = { mount, of, markup };
})(window);
