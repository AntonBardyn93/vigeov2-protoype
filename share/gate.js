(function(){
  if (/\/access\.html$/.test(location.pathname)) return;
  document.documentElement.classList.add("alfora-gate-pending");
  fetch("/api/auth/session-check", { credentials: "same-origin" })
    .then(function(r){ return r.json().then(function(d){ return r.ok && d.ok; }); })
    .catch(function(){ return false; })
    .then(function(ok){
      if (ok) {
        document.documentElement.classList.remove("alfora-gate-pending");
        return;
      }
      var next = location.pathname + location.search;
      location.replace("/access.html" + (next && next !== "/" ? "?next=" + encodeURIComponent(next) : ""));
    });
})();
