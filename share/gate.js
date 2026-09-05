(function(){
  if (/\/access\.html$/.test(location.pathname)) return;
  document.documentElement.classList.add("alfora-gate-pending");

  function fail(){
    var next = location.pathname + location.search;
    location.replace("/access.html" + (next && next !== "/" ? "?next=" + encodeURIComponent(next) : ""));
  }

  function pass(){
    document.documentElement.classList.remove("alfora-gate-pending");
  }

  function loadScript(src){
    return new Promise(function(resolve, reject){
      var script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  loadScript("/auth-config.js")
    .then(function(){ return loadScript("/clerk.js"); })
    .then(function(){
      var auth = window.ALFORA_AUTH || {};
      var key = auth.publishableKey;
      var emails = (auth.emails || []).map(function(email){ return String(email).toLowerCase(); });
      if (!key) return fail();
      return window.alforaLoadClerk(key).then(function(clerk){
        var email = clerk.user && clerk.user.primaryEmailAddress && clerk.user.primaryEmailAddress.emailAddress;
        if (email && emails.indexOf(String(email).toLowerCase()) !== -1) pass();
        else fail();
      });
    })
    .catch(fail);
})();
