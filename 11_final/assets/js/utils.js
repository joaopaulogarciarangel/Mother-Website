(function() {
  var h = location.hostname || "";
  var main = ["aura.build", "aura.page", "aurachat.io", "localhost", "netlify.app", "vercel.app", ];
  var isMain = main.some(function(d) {
    return h === d || h.endsWith("." + d);
  });
  var remove = false;
  if (isMain) {
    var parts = h.split(".");
    var isLocal = h.endsWith(".localhost");
    var isPreview = h.endsWith(".netlify.app") || h.endsWith(".vercel.app");
    var sub = parts.length > 2 ? parts[0] : isLocal && parts.length === 2 ? parts[0] : "";
    remove = ((sub && !isPreview) || (sub && isLocal)) && sub.toLowerCase() !== "www";
  } else {
    remove = true;
  }
  if (remove) {
    var els = document.querySelectorAll("[data-static-seo]");
    for (var i = 0; i < els.length; i++)
      els[i].parentNode.removeChild(els[i]);
  }
})();
