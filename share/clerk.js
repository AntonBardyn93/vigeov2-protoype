window.alforaLoadClerk = function(publishableKey){
  function hostFromKey(key){
    try {
      return atob(String(key).split("_").slice(2).join("_")).replace(/\$+$/, "");
    } catch (err) {
      return "";
    }
  }

  function waitForClerk(){
    return new Promise(function(resolve, reject){
      var tries = 0;
      (function tick(){
        if (window.Clerk) return resolve(window.Clerk);
        if (tries++ > 40) return reject(new Error("Could not load sign-in."));
        setTimeout(tick, 50);
      })();
    });
  }

  if (window.Clerk) {
    return Promise.resolve(typeof window.Clerk === "function" ? new window.Clerk(publishableKey) : window.Clerk)
      .then(function(instance){
        return instance.load ? instance.load({ publishableKey: publishableKey }).then(function(){ return instance; }) : instance;
      });
  }

  var host = hostFromKey(publishableKey);
  if (!host) return Promise.reject(new Error("Could not load sign-in."));

  return new Promise(function(resolve, reject){
    var script = document.createElement("script");
    script.src = "https://" + host + "/npm/@clerk/clerk-js@5/dist/clerk.browser.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-clerk-publishable-key", publishableKey);
    script.onload = resolve;
    script.onerror = function(){ reject(new Error("Could not load sign-in.")); };
    document.head.appendChild(script);
  }).then(waitForClerk).then(function(Clerk){
    var instance = typeof Clerk === "function" ? new Clerk(publishableKey) : Clerk;
    if (!instance || typeof instance.load !== "function") {
      throw new Error("Could not load sign-in.");
    }
    return instance.load({ publishableKey: publishableKey }).then(function(){ return instance; });
  });
};
