
(function() {
  function supportsModernRuntime() {
    try {
      if (!window.fetch || !window.Promise || !window.requestAnimationFrame || !window.URL || !window.Map || !window.Set) {
        return false;
      }
      try {
        if (!eval('(function(){ var obj = { a: { b: 1 } }; return obj?.a?.b === 1; })()')) {
          return false;
        }
      } catch (error) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  function isLocalHost() {
    var host = String(location.hostname || '').toLowerCase();
    return host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0' || host.endsWith('.local');
  }

  function isUnsupportedTarget(url) {
    return typeof url === 'string' && /unsupported\.html(?:[?#]|$)/i.test(url);
  }

  function shouldBypassUnsupported(url) {
    return isLocalHost() && supportsModernRuntime() && isUnsupportedTarget(url);
  }

  function patchRedirectMethod(name) {
    var original = Location.prototype[name];
    if (typeof original !== 'function') {
      return;
    }
    Location.prototype[name] = function(url) {
      if (shouldBypassUnsupported(String(url || ''))) {
        console.warn('[Runtime Compat] blocked local unsupported redirect:', url);
        return;
      }
      return original.call(this, url);
    };
  }

  function patchUnsupportedRedirect(target) {
    if (!target || target.__wdmUnsupportedPatched || typeof target.unsupported !== 'function') {
      return target;
    }
    var original = target.unsupported.bind(target);
    target.unsupported = function() {
      var result = original.apply(this, arguments);
      if (result && isLocalHost() && supportsModernRuntime()) {
        console.warn('[Runtime Compat] bypassed UnsupportedRedirect.unsupported() on local modern browser');
        return false;
      }
      return result;
    };
    target.__wdmUnsupportedPatched = true;
    return target;
  }
  patchRedirectMethod('replace');
  patchRedirectMethod('assign');
  var currentUnsupported;
  Object.defineProperty(window, 'UnsupportedRedirect', {
    configurable: true,
    enumerable: true,
    get: function() {
      return currentUnsupported;
    },
    set: function(value) {
      currentUnsupported = patchUnsupportedRedirect(value);
    }
  });
})();
;
(function() {
  if (window.__AURA_SUPABASE_FIREWALL__) return;
  window.__AURA_SUPABASE_FIREWALL__ = true;
  var SUPABASE_HOST = "hoirqrkdgbmvpwutwuwj.supabase.co";
  var BLOCKED_KEY_PATTERNS = [/^sb-[a-z0-9-]+-auth-token$/i, /^supabase\.auth\.token$/i];

  function isBlockedStorageKey(key) {
    if (typeof key !== "string") return false;
    for (var i = 0; i < BLOCKED_KEY_PATTERNS.length; i++) {
      if (BLOCKED_KEY_PATTERNS[i].test(key)) return true;
    }
    return false;
  }

  function toAbsoluteUrl(input) {
    try {
      return new URL(input, window.location.href);
    } catch {
      return null;
    }
  }

  function isSupabaseDestination(input) {
    var parsed = toAbsoluteUrl(input);
    if (!parsed) return false;
    if (SUPABASE_HOST && parsed.host === SUPABASE_HOST) return true;
    return parsed.host.endsWith(".supabase.co");
  }

  function pathLooksSensitive(input) {
    var parsed = toAbsoluteUrl(input);
    if (!parsed) return false;
    return /^\/(auth|rest|functions)\/v1\//.test(parsed.pathname || "");
  }

  function headersContainAuth(headersLike) {
    if (!headersLike) return false;
    try {
      if (typeof Headers !== "undefined" && headersLike instanceof Headers) {
        return !!(headersLike.get("authorization") || headersLike.get("apikey"));
      }
    } catch {}
    if (Array.isArray(headersLike)) {
      for (var i = 0; i < headersLike.length; i++) {
        var pair = headersLike[i] || [];
        var name = String(pair[0] || "").toLowerCase();
        if (name === "authorization" || name === "apikey") return true;
      }
      return false;
    }
    if (typeof headersLike === "object") {
      var keys = Object.keys(headersLike);
      for (var j = 0; j < keys.length; j++) {
        var k = keys[j].toLowerCase();
        if (k === "authorization" || k === "apikey") return true;
      }
    }
    return false;
  }

  function requestLooksSensitive(input, init, extraHeaders) {
    var url = "";
    try {
      if (typeof input === "string") {
        url = input;
      } else if (input && typeof input.url === "string") {
        url = input.url;
      }
    } catch {}
    var headers = (init && init.headers) || (input && input.headers) || extraHeaders || null;
    var hasAuthHeaders = headersContainAuth(headers);
    if (hasAuthHeaders) return true;
    if (!url) return false;
    if (isSupabaseDestination(url) && pathLooksSensitive(url)) return true;
    return false;
  }

  function patchStorage(storage, storageName) {
    if (!storage) return;
    var proto = Object.getPrototypeOf(storage);
    if (!proto || proto.__auraSupabaseFirewallPatched) return;
    var rawGetItem = proto.getItem;
    var rawSetItem = proto.setItem;
    var rawRemoveItem = proto.removeItem;
    var rawClear = proto.clear;
    var rawKey = proto.key;
    var rawLengthDescriptor = Object.getOwnPropertyDescriptor(proto, "length");
    var rawLengthGet = rawLengthDescriptor && rawLengthDescriptor.get;

    function getRawLength(instance) {
      try {
        if (rawLengthGet) return Number(rawLengthGet.call(instance) || 0);
      } catch {}
      try {
        return Number(instance.length || 0);
      } catch {}
      return 0;
    }

    function getVisibleKeys(instance) {
      var visible = [];
      var total = getRawLength(instance);
      for (var i = 0; i < total; i++) {
        var currentKey = rawKey.call(instance, i);
        if (currentKey && !isBlockedStorageKey(currentKey)) {
          visible.push(currentKey);
        }
      }
      return visible;
    }

    function maskBlockedKeyProperty(instance, keyName) {
      if (!keyName || !isBlockedStorageKey(keyName)) return;
      try {
        Object.defineProperty(instance, keyName, {
          configurable: true,
          enumerable: false,
          get: function() {
            return null;
          },
          set: function() {
            return true;
          }
        });
      } catch {}
    }

    function syncBlockedKeyProperties(instance) {
      var total = getRawLength(instance);
      for (var i = 0; i < total; i++) {
        var k = rawKey.call(instance, i);
        if (k) maskBlockedKeyProperty(instance, k);
      }
    }
    proto.getItem = function(key) {
      syncBlockedKeyProperties(this);
      if (isBlockedStorageKey(String(key))) return null;
      return rawGetItem.call(this, key);
    };
    proto.setItem = function(key, value) {
      if (isBlockedStorageKey(String(key))) return;
      return rawSetItem.call(this, key, value);
    };
    proto.removeItem = function(key) {
      if (isBlockedStorageKey(String(key))) return;
      return rawRemoveItem.call(this, key);
    };
    proto.clear = function() {
      if (typeof rawClear !== "function") return;
      var preservedBlockedEntries = [];
      var total = getRawLength(this);
      for (var i = 0; i < total; i++) {
        var blockedKey = rawKey.call(this, i);
        if (blockedKey && isBlockedStorageKey(blockedKey)) {
          preservedBlockedEntries.push([blockedKey, rawGetItem.call(this, blockedKey), ]);
        }
      }
      rawClear.call(this);
      for (var j = 0; j < preservedBlockedEntries.length; j++) {
        var entry = preservedBlockedEntries[j];
        var key = entry[0];
        var value = entry[1];
        if (typeof key === "string" && typeof value === "string") {
          rawSetItem.call(this, key, value);
        }
      }
      syncBlockedKeyProperties(this);
    };
    proto.key = function(index) {
      syncBlockedKeyProperties(this);
      var visible = getVisibleKeys(this);
      return visible[index] || null;
    };
    try {
      Object.defineProperty(proto, "length", {
        configurable: true,
        enumerable: false,
        get: function() {
          syncBlockedKeyProperties(this);
          return getVisibleKeys(this).length;
        }
      });
    } catch {}
    var proxyStorage = null;
    try {
      proxyStorage = new Proxy(storage, {
        get: function(target, prop) {
          if (typeof prop === "string" && isBlockedStorageKey(prop)) return null;
          if (prop === "length") return getVisibleKeys(target).length;
          if (prop === "key") {
            return function(index) {
              var visible = getVisibleKeys(target);
              return visible[index] || null;
            };
          }
          if (prop === "clear") {
            return function() {
              if (typeof rawClear !== "function") return;
              var preservedBlockedEntries = [];
              var total = getRawLength(target);
              for (var i = 0; i < total; i++) {
                var blockedKey = rawKey.call(target, i);
                if (blockedKey && isBlockedStorageKey(blockedKey)) {
                  preservedBlockedEntries.push([blockedKey, rawGetItem.call(target, blockedKey), ]);
                }
              }
              rawClear.call(target);
              for (var j = 0; j < preservedBlockedEntries.length; j++) {
                var entry = preservedBlockedEntries[j];
                var key = entry[0];
                var value = entry[1];
                if (typeof key === "string" && typeof value === "string") {
                  rawSetItem.call(target, key, value);
                }
              }
              syncBlockedKeyProperties(target);
            };
          }
          var value = target[prop];
          if (typeof value === "function") return value.bind(target);
          return value;
        },
        set: function(target, prop, value) {
          if (typeof prop === "string" && isBlockedStorageKey(prop)) return true;
          target[prop] = value;
          return true;
        },
        has: function(target, prop) {
          if (typeof prop === "string" && isBlockedStorageKey(prop)) return false;
          return prop in target;
        },
        deleteProperty: function(target, prop) {
          if (typeof prop === "string" && isBlockedStorageKey(prop)) return true;
          try {
            delete target[prop];
          } catch {}
          return true;
        },
        ownKeys: function(target) {
          return getVisibleKeys(target);
        },
        getOwnPropertyDescriptor: function(target, prop) {
          if (typeof prop === "string" && isBlockedStorageKey(prop)) {
            return undefined;
          }
          if (prop === "length") {
            return {
              configurable: true,
              enumerable: false,
              value: getVisibleKeys(target).length,
              writable: false
            };
          }
          return Object.getOwnPropertyDescriptor(target, prop);
        }
      });
    } catch {}
    try {
      if (proxyStorage) {
        Object.defineProperty(window, storageName, {
          configurable: true,
          enumerable: true,
          get: function() {
            return proxyStorage;
          }
        });
      }
    } catch {}
    syncBlockedKeyProperties(storage);
    proto.__auraSupabaseFirewallPatched = true;
  }

  function patchCookieAccess() {
    try {
      var cookieDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, "cookie");
      if (!cookieDescriptor || !cookieDescriptor.configurable) return;
      Object.defineProperty(document, "cookie", {
        configurable: true,
        enumerable: false,
        get: function() {
          return "";
        },
        set: function() {
          return true;
        }
      });
    } catch {}
  }

  function patchFetch() {
    if (typeof window.fetch !== "function") return;
    var rawFetch = window.fetch.bind(window);
    window.fetch = function(input, init) {
      if (requestLooksSensitive(input, init, null)) {
        return Promise.reject(new Error("Blocked by Aura security policy"));
      }
      return rawFetch(input, init);
    };
  }

  function patchXHR() {
    if (typeof XMLHttpRequest === "undefined") return;
    var rawOpen = XMLHttpRequest.prototype.open;
    var rawSetHeader = XMLHttpRequest.prototype.setRequestHeader;
    var rawSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function(method, url) {
      this.__auraRequestUrl = String(url || "");
      this.__auraHeaders = {};
      return rawOpen.apply(this, arguments);
    };
    XMLHttpRequest.prototype.setRequestHeader = function(name, value) {
      if (!this.__auraHeaders) this.__auraHeaders = {};
      this.__auraHeaders[String(name || "").toLowerCase()] = String(value || "");
      return rawSetHeader.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function() {
      if (requestLooksSensitive(this.__auraRequestUrl || "", null, this.__auraHeaders || null)) {
        throw new Error("Blocked by Aura security policy");
      }
      return rawSend.apply(this, arguments);
    };
  }

  function patchBeacon() {
    if (typeof navigator.sendBeacon !== "function") return;
    var rawBeacon = navigator.sendBeacon.bind(navigator);
    navigator.sendBeacon = function(url, data) {
      if (requestLooksSensitive(url, null, null)) return false;
      return rawBeacon(url, data);
    };
  }

  function patchWebSocket() {
    if (typeof WebSocket === "undefined") return;
    var RawWebSocket = WebSocket;
    window.WebSocket = function(url, protocols) {
      if (requestLooksSensitive(String(url || ""), null, null)) {
        throw new Error("Blocked by Aura security policy");
      }
      return new RawWebSocket(url, protocols);
    };
    window.WebSocket.prototype = RawWebSocket.prototype;
  }
  patchStorage(window.localStorage, "localStorage");
  patchStorage(window.sessionStorage, "sessionStorage");
  patchCookieAccess();
  patchFetch();
  patchXHR();
  patchBeacon();
  patchWebSocket();
})();
;
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        background: '#F5F5F5',
        surface: '#FFFFFF',
        primary: '#111111',
        secondary: '#555555',
        accent: '#EB3A14',
        line: '#E0E0E0'
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.25, 0.8, 0.25, 1)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    }
  }
}
;
lucide.createIcons({
  attrs: {
    'stroke-width': 1.5
  }
});
const lenis = new Lenis({
  duration: 0.7,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
gsap.registerPlugin(ScrollTrigger);
const loaderTimeline = gsap.timeline();
loaderTimeline.to("#loader-progress", {
  width: "100%",
  duration: 1.2,
  ease: "power2.inOut",
  onUpdate: function() {
    document.getElementById("loader-text").innerText = Math.round(this.progress() * 100) + "%";
  }
}).to("#loader", {
  yPercent: -100,
  duration: 0.6,
  ease: "power4.inOut",
  delay: 0.1
}).to(".hero-glow", {
  opacity: 1,
  duration: 1.5,
  ease: "power2.out"
}, "-=0.5").to(".hero-char", {
  opacity: 1,
  y: 0,
  filter: "blur(0px)",
  duration: 1.2,
  stagger: 0.1,
  ease: "power3.out"
}, "-=1.0").to(".hero-fade-in", {
  opacity: 1,
  y: 0,
  duration: 0.8,
  stagger: 0.1,
  ease: "power2.out"
}, "-=0.8");
document.querySelectorAll("section:not(:first-child)").forEach(section => {
  gsap.from(section.querySelectorAll("h2, h3, p, .project-card, li"), {
    scrollTrigger: {
      trigger: section,
      start: "top 85%",
      toggleActions: "play none none reverse"
    },
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.05,
    ease: "power2.out"
  });
});
if (window.matchMedia("(pointer: fine)").matches) {
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorCircle = document.querySelector('.cursor-circle');
  let mouseX = 0,
    mouseY = 0,
    cursorX = 0,
    cursorY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.to(cursorDot, {
      x: mouseX,
      y: mouseY,
      duration: 0
    });
  });
  gsap.ticker.add(() => {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursorCircle.style.left = cursorX + 'px';
    cursorCircle.style.top = cursorY + 'px';
  });
  document.querySelectorAll('a, button, .magnetic-btn').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hover-active'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hover-active'));
  });
}
document.querySelectorAll('.magnetic-btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    gsap.to(btn, {
      x: (e.clientX - rect.left - rect.width / 2) * 0.2,
      y: (e.clientY - rect.top - rect.height / 2) * 0.2,
      duration: 0.2
    });
  });
  btn.addEventListener('mouseleave', () => gsap.to(btn, {
    x: 0,
    y: 0,
    duration: 0.5,
    ease: "elastic.out(1, 0.3)"
  }));
});
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let width, height, particles = [];

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.size = Math.random() * 1.5;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }
  draw() {
    ctx.fillStyle = '#cccccc';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}
for (let i = 0; i < 40; i++) particles.push(new Particle());

function animateCanvas() {
  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = 'rgba(0,0,0,0.04)';
  ctx.lineWidth = 1;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i; j < particles.length; j++) {
      const d = Math.sqrt((particles[i].x - particles[j].x) ** 2 + (particles[i].y - particles[j].y) ** 2);
      if (d < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
    particles[i].update();
    particles[i].draw();
  }
  requestAnimationFrame(animateCanvas);
}
animateCanvas();
const aiInput = document.getElementById('ai-input');
const termOut = document.getElementById('terminal-output');
async function handleCommand(cmd) {
  termOut.innerHTML += `<div><span class="text-blue-400">➜</span> <span class="text-gray-300">${cmd}</span></div>`;
  const loadId = 'l-' + Date.now();
  termOut.innerHTML += `<div id="${loadId}" class="text-gray-500 italic text-xs">Processing...</div>`;
  termOut.scrollTop = termOut.scrollHeight;
  await new Promise(r => setTimeout(r, 600));
  document.getElementById(loadId).remove();
  let resp = "I can provide info on Skills, Experience, or specific Tech.";
  const lCmd = cmd.toLowerCase();
  if (lCmd.includes('vue') || lCmd.includes('react') || lCmd.includes('stack')) resp = "Proficient in Vue.js (Nuxt) and React (Next.js). Optimized Planhat homepage load times.";
  else if (lCmd.includes('experience') || lCmd.includes('work')) resp = "Senior Engineer at Planhat. Previously Lead at Xamplifier.";
  else if (lCmd.includes('contact')) resp = "Contact: kyriakosmichael@icloud.com";
  termOut.innerHTML += `<div class="text-gray-200 border-l-2 border-accent pl-3 py-1">${resp}</div>`;
  termOut.scrollTop = termOut.scrollHeight;
}
aiInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && aiInput.value.trim()) {
    handleCommand(aiInput.value);
    aiInput.value = '';
  }
});
document.querySelectorAll('.quick-prompt').forEach(b => b.addEventListener('click', () => handleCommand(b.innerText.replace(/"/g, ""))));
;
! function() {
  var f = ["https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg", "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg", "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/c543a9e1-f226-4ced-80b0-feb8445a75b9_1600w.jpg", "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/5bab247f-35d9-400d-a82b-fd87cfe913d2_1600w.webp", "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/30104e3c-5eea-4b93-93e9-5313698a7156_1600w.webp"],
    h = new Set;

  function g(s) {
    for (var x = 0, i = 0; i < s.length; i++) x = (x << 5) - x + s.charCodeAt(i) | 0;
    return f[Math.abs(x) % f.length]
  }

  function r(t) {
    var s = t.src;
    if (s && !h.has(s)) {
      h.add(s);
      t.src = g(s)
    }
  }
  window.addEventListener("error", function(e) {
    var t = e.target;
    if (t && t.tagName === "IMG") r(t)
  }, !0);

  function c() {
    document.querySelectorAll("img").forEach(function(i) {
      if (i.complete && !i.naturalWidth && i.src) r(i)
    })
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", c);
  else c()
}()
