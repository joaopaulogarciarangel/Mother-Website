
(async function() {
  const resourceMap = {
    "https://solutions-engineer-69.aura.build/": "/assets/resource_835b058d2ed1.html",
    "/assets/css/index-Cd1qAdOZ.css": "/assets/css/index-Cd1qAdOZ.css",
    "assets/css2_2832c0ff631d.css?family=Inter:wght@300;400;500;600;700&display=swap": "/assets/css/style_005.css",
    "/assets/js/iconify-icon.min_3.js": "/assets/js/iconify-icon.min_3.js",
    "assets/css2_86e10c4bcbd4.css?family=Geist:wght@300;400;500;600;700&display=swap": "/assets/css/style_009.css",
    "assets/css2_a96e0b8e2ae8.css?family=Inter:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap": "/assets/css/style_011.css",
    "assets/css2_7c036bf64204.css?family=Playfair+Display:wght@400;500;600;700;900&family=Instrument+Serif:wght@400;500;600;700&family=Merriweather:wght@300;400;700;900&family=Bricolage+Grotesque:wght@300;400;500;600;700&display=swap": "/assets/css/style_008.css",
    "assets/css2_065636c75ff4.css?family=PT+Serif:wght@400;700&family=Geist+Mono:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap": "/assets/css/style_001.css",
    "assets/css2_b15cefb7a911.css?family=Manrope:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&family=Work+Sans:wght@300;400;500;600;700;800&display=swap": "/assets/css/style_012.css",
    "assets/css2_25c50a26b0e7.css?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=IBM+Plex+Serif:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@300;400;500;600;700&display=swap": "/assets/css/style_004.css",
    "assets/css2_d9767196dba3.css?family=Quicksand:wght@300;400;500;600;700&family=Nunito:wght@300;400;500;600;700;800&display=swap": "/assets/css/style_014.css",
    "assets/css2_149e88973286.css?family=Google+Sans:wght@400;500;600;700&family=Syne:wght@400;500;600;700;800&family=Urbanist:wght@300;400;500;600;700;800&family=Sora:wght@300;400;500;600;700;800&display=swap": "/assets/css/style_002.css",
    "assets/css2_43ad50e768d6.css?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Aboreto&family=Gloock&family=Marcellus&family=Cardo:wght@400;700&family=Bodoni+Moda:opsz,wght@6..96,400..900&display=swap": "/assets/css/style_006.css",
    "assets/css2_c0153609a9b5.css?family=Anton&family=Bebas+Neue&family=Archivo+Black&family=League+Gothic&family=Fredoka:wght@300;400;500;600;700&display=swap": "/assets/css/style_013.css",
    "assets/css2_1a03f4e124ec.css?family=Chewy&family=Foldit:wght@400;500;600;700&family=Oi&family=Honk&family=Nabla&display=swap": "/assets/css/style_003.css",
    "assets/css2_d9d3478dd921.css?family=DM+Serif+Display&family=Fraunces:opsz,wght@9..144,300..900&family=Lora:wght@400;500;600;700&family=GFS+Didot&family=Libre+Baskerville:wght@400;700&display=swap": "/assets/css/style_015.css",
    "assets/css2_79f2b1dad288.css?family=Newsreader:opsz,wght@6..72,400..800&family=Google+Sans+Flex:wght@400;500;600;700&family=Oswald:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap": "/assets/css/style_007.css",
    "/assets/js/index-DL7-oXj8.js": "/assets/js/index-DL7-oXj8.js",
    "/assets/data/data_001.json": "/assets/data/data_001.json",
    "assets/shared_react_projects_7112574ea8d6.json?select=*&slug=ilike.solutions-engineer-69": "/assets/data/data_010.json",
    "assets/get_public_shared_react_project_by_slug_a4310a9361c8.json": "/assets/data/data_005.json",
    "assets/shared_react_projects_2afee3dc2a1d.json?select=*&custom_domain=ilike.solutions-engineer-69.aura.build": "/assets/data/data_009.json",
    "assets/get_public_shared_react_proje_8a9221f134_dcbf27afc956.json": "/assets/data/data_004.json",
    "assets/shared_react_projects_cd6eedc34e6c.json?select=*&custom_domain=ilike.aura.build": "/assets/data/data_011.json",
    "assets/shared_code_2776a740403e.json?select=*&slug=ilike.solutions-engineer-69": "/assets/data/data_007.json",
    "assets/shared_code_83fd6d7a6699.json?select=slug%2Ccreated_at&user_id=eq.97334d4f-e3f2-4358-abc9-e122c93ca182&order=created_at.desc": "/assets/data/data_008.json",
    "assets/public_author_profiles_3e1cd6d86f62.json?select=id%2Cfull_name%2Cavatar_url%2Cbio%2Cslug%2Ccreated_at%2Cviews%2Cis_featured%2Cwebsite%2Clocation%2Cis_pro&id=in.%2897334d4f-e3f2-4358-abc9-e122c93ca182%29": "/assets/data/data_006.json",
    "/assets/js/iconify-icon.min_3.js": "/assets/js/iconify-icon.min_3.js",
    "/assets/js/gsap.min.js": "/assets/js/gsap.min.js",
    "assets/css2_943627264c01.css?family=Inter:wght@400;500&display=swap": "/assets/css/style_010.css",
    "/assets/js/ScrollTrigger.min.js": "/assets/js/ScrollTrigger.min.js",
    "/assets/js/three.min_2.js": "/assets/js/three.min_2.js",
    "/assets/other/3.4.17": "/assets/other/3.4.17",
    "assets/get_public_share_project_context_1846a115af32.json": "/assets/data/data_003.json",
    "/assets/images/img_004.png": "/assets/images/img_004.png",
    "/assets/fonts/font_001.woff2": "/assets/fonts/font_001.woff2",
    "/assets/images/img_003.png": "/assets/images/img_003.png",
    "assets/solutions-engineer-69_4b7f0c9a0a83.jpg?t=1779789523916": "/assets/images/img_002.jpg",
    "/assets/data/data_021.json?icons=hamburger-menu-linear": "/assets/data/data_021.json",
    "/assets/data/data_018.json?icons=alt-arrow-right-linear": "/assets/data/data_018.json",
    "/assets/data/data_013.json?icons=database-linear": "/assets/data/data_013.json",
    "assets/get_public_share_page_content_245c07ef86f8.json": "/assets/data/data_002.json",
    "/assets/data/data_014.json?icons=cpu-bolt-linear": "/assets/data/data_014.json",
    "/assets/data/data_017.json?icons=cloud-water-linear%2Ccpu-linear%2Cgraph-up-linear%2Cprogramming-linear%2Cwaterdrops-linear": "/assets/data/data_017.json",
    "https://www.google.com/pagead/1p-user-list/17731977471/?random=1779908112378&cv=11&fst=1779904800000&bg=ffffff&guid=ON&async=1&en=gtag.config&gtm=45je65q0v9218448198za200zd9218448198xec&gcd=13l3l3l3l1l1&dma=0&tag_exp=0~115938465~115938469&u_w=1920&u_h=1080&url=https%3A%2F%2Fsolutions-engineer-69.aura.build%2F&rcb=2&frm=1&tiba=Brandon%20See%20-%20Solutions%20Engineer&hn=www.googleadservices.com&npa=0&pscdl=noapi&uaa=&uab=&uafvl=&uamb=0&uam=&uap=&uapv=&uaw=0&data=event%3Dgtag.config&rfmt=3&fmt=3&is_vtc=1&cid=CAQS0wEABaugfeZWtV-cCVoEpd0Zv-GLjgu365sx1O5yaS_uQRG7Yqq1K2FLYr1Zj5B0GOQ545my8gMatYKVum0QoLm4lDJXr3YPSHmcmQKMjYyepb_nYuK_b3sfZnJKMnKbiq-fp_t20XWmMtbASKhcVWn-S5gsTmxXIBmKs0Y6IyQHBTEFNJLbQoJzQQxxYTBbGsr_TXyBDWIm65o9zuJj6wHBcFG43Jw1LMSt8stG6vXsT3k-0iQ9VGlcKBfdEfnAljMbHkqGvbO_6n2ZDytSAF6BoZhm&random=2866583893&rmt_tld=0&ipr=y": "/assets/images/img_001.gif",
    "/assets/data/data_015.json?icons=arrow-right-linear%2Ccode-square-linear%2Clightbulb-bolt-linear%2Cserver-square-linear%2Cusers-group-two-rounded-linear": "/assets/data/data_015.json",
    "/assets/data/data_018.json?icons=alt-arrow-right-linear": "/assets/data/data_019.json",
    "/assets/data/data_013.json?icons=database-linear": "/assets/data/data_020.json",
    "/assets/data/data_014.json?icons=cpu-bolt-linear": "/assets/data/data_012.json",
    "/assets/data/data_017.json?icons=cloud-water-linear%2Ccpu-linear%2Cgraph-up-linear%2Cprogramming-linear%2Cwaterdrops-linear": "/assets/data/data_016.json",
    "/assets/js/unicornStudio.umd_4.js": "/assets/js/unicornStudio.umd_4.js",
    "/assets/js/unicornStudio.umd_4.js": "/assets/js/unicornStudio.umd_4.js",
    "/assets/js/unicornStudio.umd_3.js": "/assets/js/unicornStudio.umd_3.js",
    "/assets/js/unicornStudio.umd_2.js": "/assets/js/unicornStudio.umd_2.js",
    "/assets/js/FxFilter.js": "/assets/js/FxFilter.js",
    "/assets/fonts/CompressaPRO-GX.woff2": "/assets/fonts/CompressaPRO-GX.woff2",
    "/assets/js/lucide.js": "/assets/js/lucide.js",
    "/assets/js/script_005.js": "/assets/js/script_005.js",
    "/assets/js/script.js": "/assets/js/script.js",
    "/assets/js/iconify-icon.min_2.js": "/assets/js/iconify-icon.min_2.js",
    "/assets/other/robots.txt": "/assets/other/robots.txt",
    "/assets/icons/logo-aura.svg": "/assets/icons/logo-aura.svg",
    "/assets/js/three.min_2.js": "/assets/js/three.min_2.js",
    "/assets/js/iconify.min.js": "/assets/js/iconify.min.js",
    "/assets/js/promotekit.js": "/assets/js/promotekit.js",
    "/assets/js/index-C10IcqE6.js": "/assets/js/index-C10IcqE6.js",
    "/assets/js/script_004.js": "/assets/js/script_004.js",
    "/assets/js/index-CxfwGqyQ.js": "/assets/js/index-CxfwGqyQ.js",
    "/assets/js/script_001.js": "/assets/js/script_001.js",
    "/assets/js/jszip.min-Dwq1A4A1.js": "/assets/js/jszip.min-Dwq1A4A1.js",
    "/assets/js/script_006.js": "/assets/js/script_006.js",
    "/assets/js/script_002.js": "/assets/js/script_002.js",
    "/assets/js/script_003.js": "/assets/js/script_003.js",
    "/assets/images/web01.png": "/assets/images/web01.png",
    "/assets/images/screenshot02.jpg": "/assets/images/screenshot02.jpg",
    "/assets/images/avatar-ray.jpg": "/assets/images/avatar-ray.jpg",
    "/assets/images/avatar-greg.jpg": "/assets/images/avatar-greg.jpg",
    "/assets/images/avatar-peter.jpg": "/assets/images/avatar-peter.jpg",
    "/assets/images/logo-unicorn.jpg": "/assets/images/logo-unicorn.jpg",
    "/assets/images/logo-spline.jpg": "/assets/images/logo-spline.jpg",
    "/assets/images/avatar-meng.jpg": "/assets/images/avatar-meng.jpg",
    "/assets/images/faisal.jpg": "/assets/images/faisal.jpg",
    "/assets/images/samp-man.jpg": "/assets/images/samp-man.jpg",
    "/assets/images/martin.jpg": "/assets/images/martin.jpg",
    "/assets/images/joyjeet.jpg": "/assets/images/joyjeet.jpg",
    "/assets/images/logo-aura-128-light.png": "/assets/images/logo-aura-128-light.png",
    "/assets/images/logo-aura-128-dark.png": "/assets/images/logo-aura-128-dark.png",
    "/assets/images/share-preview.jpg": "/assets/images/share-preview.jpg",
    "/assets/images/share-preview-pricing.jpg": "/assets/images/share-preview-pricing.jpg",
    "/assets/images/share-preview-templates.jpg": "/assets/images/share-preview-templates.jpg",
    "/assets/images/share-preview-learn.jpg": "/assets/images/share-preview-learn.jpg",
    "/assets/images/share-preview-components.jpg": "/assets/images/share-preview-components.jpg",
    "/assets/images/share-preview-assets.jpg": "/assets/images/share-preview-assets.jpg",
    "/assets/images/share-preview-changelog.jpg": "/assets/images/share-preview-changelog.jpg",
    "/assets/icons/logo-aura.svg": "/assets/icons/logo-aura_2.svg",
    "/assets/icons/logo-aura-gray.svg": "/assets/icons/logo-aura-gray.svg",
    "/assets/images/unicorn_matcap_default.webp": "/assets/images/unicorn_matcap_default.webp",
    "https://cdn.tailwindcss.com/": "/assets/js/script_008.js"
  };
  const basenameIndex = {};
  const originalBasenameIndex = {};
  const localStemIndex = {};
  const originalStemIndex = {};
  const EXTENSION_FAMILIES = [
    ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'],
    ['.mp4', '.webm', '.mov', '.m4v', '.ogv'],
    ['.mp3', '.wav', '.ogg', '.m4a', '.aac'],
    ['.woff', '.woff2', '.ttf', '.otf', '.eot'],
  ];

  function splitBasenameParts(filename) {
    const clean = String(filename || '').split('?')[0].split('#')[0];
    const dotIndex = clean.lastIndexOf('.');
    if (dotIndex <= 0) return {
      basename: clean,
      stem: clean,
      ext: ''
    };
    return {
      basename: clean,
      stem: clean.slice(0, dotIndex),
      ext: clean.slice(dotIndex).toLowerCase(),
    };
  }

  function stemCandidates(stem) {
    const candidates = [];
    if (stem) candidates.push(stem);
    for (const separator of ['.', '-']) {
      if (stem && stem.includes(separator)) {
        const prefix = stem.split(separator, 1)[0];
        if (prefix && !candidates.includes(prefix)) {
          candidates.push(prefix);
        }
      }
    }
    return candidates;
  }

  function getExtensionFamily(ext) {
    for (const family of EXTENSION_FAMILIES) {
      if (family.includes(ext)) return family;
    }
    return null;
  }

  function areCompatibleExtensions(left, right) {
    if (!left || !right) return false;
    if (left === right) return true;
    const family = getExtensionFamily(left);
    return !!family && family.includes(right);
  }

  function pushStemIndex(index, basename, localPath) {
    const parts = splitBasenameParts(basename);
    if (!parts.stem || !parts.ext) return;
    for (const candidateStem of stemCandidates(parts.stem)) {
      if (!index[candidateStem]) index[candidateStem] = [];
      index[candidateStem].push({
        basename: parts.basename,
        ext: parts.ext,
        localPath
      });
    }
  }

  function findEquivalentBasenameMatch(basename, index, withLeadingSlash) {
    const requested = splitBasenameParts(basename);
    if (!requested.stem || !requested.ext) return null;
    const compatible = [];
    const seen = new Set();
    for (const candidateStem of stemCandidates(requested.stem)) {
      const candidates = index[candidateStem] || [];
      for (const candidate of candidates) {
        if (!areCompatibleExtensions(requested.ext, candidate.ext)) continue;
        const key = `${candidate.localPath}::${candidate.ext}`;
        if (seen.has(key)) continue;
        seen.add(key);
        compatible.push(candidate);
      }
    }
    if (compatible.length !== 1) return null;
    const match = compatible[0].localPath;
    return withLeadingSlash ? '/' + match : match;
  }
  Object.entries(resourceMap).forEach(([originalUrl, localPath]) => {
    const normalizedLocalPath = String(localPath || '').replace(/^\/+/, '');
    if (normalizedLocalPath.startsWith('assets/')) {
      const localBasename = normalizedLocalPath.split('/').pop();
      if (!basenameIndex[localBasename]) basenameIndex[localBasename] = [];
      basenameIndex[localBasename].push(normalizedLocalPath);
      pushStemIndex(localStemIndex, localBasename, normalizedLocalPath);
    }
    try {
      const origBasename = originalUrl.split('/').pop().split('?')[0];
      if (origBasename) {
        if (!originalBasenameIndex[origBasename]) originalBasenameIndex[origBasename] = [];
        originalBasenameIndex[origBasename].push(localPath);
        pushStemIndex(originalStemIndex, origBasename, normalizedLocalPath || localPath);
      }
    } catch (e) {}
  });

  function normalizeUrl(url, baseUrl) {
    if (!url) return url;
    if (typeof url === 'object' && url.url) url = url.url;
    if (url.startsWith('data:') || url.startsWith('blob:')) return url;
    try {
      return new URL(url, baseUrl || window.location.href).href;
    } catch (e) {
      return url;
    }
  }

  function resolveRelativePath(url, referrer) {
    if (!url.startsWith('./') && !url.startsWith('../')) return null;
    try {
      const referrerUrl = new URL(referrer || window.location.href);
      const referrerDir = referrerUrl.pathname.substring(0, referrerUrl.pathname.lastIndexOf('/') + 1);
      const resolved = new URL(url, window.location.origin + referrerDir).pathname;
      const basename = resolved.split('/').pop();
      if (basenameIndex[basename]) {
        if (basenameIndex[basename].length === 1) return '/' + basenameIndex[basename][0];
        const referrerPath = referrer.replace(window.location.origin, '');
        for (const candidate of basenameIndex[basename]) {
          if (referrerPath.includes('assets/') && candidate.includes(basename)) {
            return '/' + candidate;
          }
        }
        return '/' + basenameIndex[basename][0];
      }
      if (originalBasenameIndex[basename] && originalBasenameIndex[basename].length === 1) {
        return originalBasenameIndex[basename][0];
      }
      const originalStemMatch = findEquivalentBasenameMatch(basename, originalStemIndex, false);
      if (originalStemMatch) return originalStemMatch;
      const localStemMatch = findEquivalentBasenameMatch(basename, localStemIndex, true);
      if (localStemMatch) return localStemMatch;
    } catch (e) {
      console.warn('[Fetch Interceptor] Relative path resolution failed:', url, e);
    }
    return null;
  }

  function getLocalPath(url, referrer) {
    const rawUrl = typeof url === 'string' ? url : (url && typeof url === 'object' && url.url ? url.url : String(url || ''));
    if (rawUrl.startsWith('./') || rawUrl.startsWith('../')) {
      const resolved = resolveRelativePath(rawUrl, referrer);
      if (resolved) return resolved;
    }
    const normalized = normalizeUrl(rawUrl, referrer);
    if (resourceMap[normalized]) return resourceMap[normalized];
    const withoutProtocol = normalized.replace(/^https?:/, '');
    if (resourceMap[withoutProtocol]) return resourceMap[withoutProtocol];
    try {
      const basename = normalized.split('/').pop().split('?')[0];
      if (basename) {
        if (originalBasenameIndex[basename] && originalBasenameIndex[basename].length === 1) {
          return originalBasenameIndex[basename][0];
        }
        if (basenameIndex[basename] && basenameIndex[basename].length === 1) {
          return '/' + basenameIndex[basename][0];
        }
        const originalStemMatch = findEquivalentBasenameMatch(basename, originalStemIndex, false);
        if (originalStemMatch) {
          return originalStemMatch;
        }
        const localStemMatch = findEquivalentBasenameMatch(basename, localStemIndex, true);
        if (localStemMatch) {
          return localStemMatch;
        }
      }
    } catch (e) {}
    return null;
  }

  function isExternalCDN(url) {
    try {
      const urlObj = new URL(normalizeUrl(url, window.location.href), window.location.href);
      if (urlObj.origin !== window.location.origin) {
        const hostname = urlObj.hostname.toLowerCase();
        const cdnMarkers = ['.b-cdn.', 'cdn.', '.cloudfront.', '.akamai', '.fastly.'];
        return cdnMarkers.some(marker => hostname.includes(marker));
      }
    } catch (e) {}
    return false;
  }

  function isExternal(url) {
    try {
      const urlObj = new URL(normalizeUrl(url, window.location.href), window.location.href);
      return urlObj.origin !== window.location.origin;
    } catch (e) {
      return false;
    }
  }

  function isTrackingEndpoint(url) {
    try {
      const urlObj = new URL(normalizeUrl(url, window.location.href), window.location.href);
      const hostname = urlObj.hostname.toLowerCase();
      const path = (urlObj.pathname || '').toLowerCase();
      const combined = `${hostname}${path}`;
      const markers = ['monorail', 'api/collect', '/collect', 'web-pixels', 'webpixels', 'web-pixel', '/pixel', 'pixel.', 'shopifycloud/web-pixels-manager', 'hotjar', 'klaviyo', 'cookiebot', 'consentcdn', ];
      return markers.some(marker => combined.includes(marker));
    } catch (e) {
      return false;
    }
  }

  function buildMockResponse(url, method) {
    let mockData = {};
    if ((method || 'GET').toUpperCase() === 'GET' && String(url).includes('/rest/')) {
      mockData = [];
    }
    return new Response(JSON.stringify(mockData), {
      status: 200,
      statusText: 'OK (Mocked)',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  function toComparableUrl(url) {
    if (!url) return '';
    try {
      return new URL(url, window.location.href).href;
    } catch (e) {
      return String(url);
    }
  }

  function comparableCandidates(urls) {
    const candidates = new Set();
    for (const url of urls) {
      if (!url) continue;
      const comparable = toComparableUrl(url);
      if (comparable) candidates.add(comparable);
      const localPath = getLocalPath(url, window.location.href);
      const comparableLocal = toComparableUrl(localPath);
      if (comparableLocal) candidates.add(comparableLocal);
    }
    candidates.delete('');
    return candidates;
  }

  function hasExistingAsset(tagName, attrName, urls) {
    const targetUrls = Array.isArray(urls) ? urls : [urls];
    const comparableTargets = comparableCandidates(targetUrls);
    if (!comparableTargets.size) return false;
    const elements = tagName === 'script' ? Array.from(document.scripts || []) : Array.from(document.querySelectorAll(tagName));
    return elements.some((element) => {
      const currentValue = element.getAttribute(attrName) || element[attrName] || '';
      if (!currentValue) return false;
      const currentComparable = toComparableUrl(currentValue);
      if (currentComparable && comparableTargets.has(currentComparable)) {
        return true;
      }
      const currentLocalPath = getLocalPath(currentValue, window.location.href);
      const currentComparableLocal = toComparableUrl(currentLocalPath);
      return currentComparableLocal && comparableTargets.has(currentComparableLocal);
    });
  }

  function neutralizeDuplicateNode(node, kind, url) {
    node.setAttribute('data-interceptor-duplicate', 'true');
    if (kind === 'script') {
      node.type = 'application/json';
    } else if (kind === 'link') {
      node.setAttribute('data-interceptor-disabled', 'true');
      setTimeout(() => {
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
      }, 0);
    }
    setTimeout(() => {
      try {
        node.dispatchEvent(new Event('load'));
      } catch (e) {}
    }, 0);
    console.log('[DOM Interceptor] = Duplicate', kind, url);
    return node;
  }

  function isFrameworkChunkScript(url) {
    if (!url) return false;
    const value = String(url);
    return (value.includes('/_next/static/chunks/') || value.includes('/_next/static/chunks/app/') || value.includes('/assets/js/script_'));
  }
  const originalSetAttribute = Element.prototype.setAttribute;

  function toBrowserPath(localPath) {
    if (!localPath) return localPath;
    if (localPath.startsWith('/') || localPath.startsWith('data:') || localPath.startsWith('blob:') || localPath.startsWith('http://') || localPath.startsWith('https://') || localPath.startsWith('//')) {
      return localPath;
    }
    return '/' + localPath;
  }

  function encodeBrowserUrl(value) {
    if (!value || value.startsWith('data:') || value.startsWith('blob:')) {
      return value;
    }
    return value.replace(/ /g, '%20').replace(/,/g, '%2C');
  }

  function rewriteSrcsetValue(srcset, referrer) {
    if (!srcset) return srcset;
    return srcset.split(',').map((part) => {
      const trimmed = part.trim();
      if (!trimmed) return trimmed;
      const match = trimmed.match(/^(\S+)(?:\s+(.+))?$/);
      if (!match) return trimmed;
      const originalUrl = match[1];
      const descriptor = match[2] || '';
      const localPath = getLocalPath(originalUrl, referrer);
      const rewrittenUrl = localPath && localPath !== originalUrl ? encodeBrowserUrl(toBrowserPath(localPath)) : encodeBrowserUrl(originalUrl);
      return descriptor ? `${rewrittenUrl} ${descriptor}` : rewrittenUrl;
    }).join(', ');
  }

  function rewriteMediaAttributeValue(tagName, attrName, value, referrer) {
    if (!value || typeof value !== 'string') return value;
    if (attrName === 'srcset') {
      return rewriteSrcsetValue(value, referrer);
    }
    const localPath = getLocalPath(value, referrer);
    if (localPath && localPath !== value) {
      return toBrowserPath(localPath);
    }
    return value;
  }

  function localizeMediaElement(node, referrer) {
    if (!node || !node.tagName) return node;
    const tagName = node.tagName.toLowerCase();
    if (!['img', 'source', 'video', 'audio', 'track'].includes(tagName)) {
      return node;
    }
    const mediaAttrs = ['src', 'srcset', 'poster'];
    for (const attrName of mediaAttrs) {
      const currentValue = node.getAttribute(attrName);
      if (!currentValue) continue;
      const rewrittenValue = rewriteMediaAttributeValue(tagName, attrName, currentValue, referrer || window.location.href);
      if (rewrittenValue && rewrittenValue !== currentValue) {
        originalSetAttribute.call(node, attrName, rewrittenValue);
        console.log('[DOM Interceptor] ✓', tagName, currentValue, '->', rewrittenValue);
      }
    }
    return node;
  }

  function localizeMediaTree(root, referrer) {
    if (!root || root.nodeType !== Node.ELEMENT_NODE) return;
    localizeMediaElement(root, referrer);
    if (typeof root.querySelectorAll !== 'function') return;
    root.querySelectorAll('img, source, video, audio, track').forEach((element) => {
      localizeMediaElement(element, referrer);
    });
  }

  function rewriteDynamicElement(node) {
    if (!node || !node.tagName) return node;
    const tagName = node.tagName.toLowerCase();
    if (['img', 'source', 'video', 'audio', 'track'].includes(tagName)) {
      return localizeMediaElement(node, window.location.href);
    }
    if (tagName === 'script') {
      const originalSrc = node.getAttribute('src') || node.src;
      if (!originalSrc) return node;
      const localPath = getLocalPath(originalSrc, window.location.href);
      const targetSrc = localPath || originalSrc;
      const allowFrameworkDuplicate = (isFrameworkChunkScript(originalSrc) || isFrameworkChunkScript(targetSrc));
      if (!allowFrameworkDuplicate && hasExistingAsset('script', 'src', [originalSrc, targetSrc])) {
        return neutralizeDuplicateNode(node, 'script', targetSrc);
      }
      if (localPath && localPath !== originalSrc) {
        node.setAttribute('src', localPath);
        console.log('[DOM Interceptor] \u2713 script', originalSrc, '->', localPath);
        return node;
      }
      if (isTrackingEndpoint(originalSrc) || (isExternal(originalSrc) && isExternalCDN(originalSrc))) {
        node.removeAttribute('src');
        node.type = 'application/json';
        console.warn('[DOM Interceptor] \u2717 Blocked dynamic script:', originalSrc);
      }
      return node;
    }
    if (tagName === 'link') {
      const rel = (node.getAttribute('rel') || '').toLowerCase();
      if (!rel || !['preload', 'prefetch', 'modulepreload', 'stylesheet'].some(value => rel.includes(value))) {
        return node;
      }
      const originalHref = node.getAttribute('href') || node.href;
      if (!originalHref) return node;
      const localPath = getLocalPath(originalHref, window.location.href);
      const targetHref = localPath || originalHref;
      if (hasExistingAsset('link', 'href', [originalHref, targetHref])) {
        return neutralizeDuplicateNode(node, 'link', targetHref);
      }
      if (localPath && localPath !== originalHref) {
        node.setAttribute('href', localPath);
        console.log('[DOM Interceptor] \u2713 link', originalHref, '->', localPath);
        return node;
      }
    }
    return node;
  }
  const originalAppendChild = Node.prototype.appendChild;
  Node.prototype.appendChild = function(node) {
    return originalAppendChild.call(this, rewriteDynamicElement(node));
  };
  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function(node, referenceNode) {
    return originalInsertBefore.call(this, rewriteDynamicElement(node), referenceNode);
  };
  const originalReplaceChild = Node.prototype.replaceChild;
  Node.prototype.replaceChild = function(newChild, oldChild) {
    return originalReplaceChild.call(this, rewriteDynamicElement(newChild), oldChild);
  };
  Element.prototype.setAttribute = function(name, value) {
    if (this && this.tagName && typeof name === 'string') {
      const tagName = this.tagName.toLowerCase();
      const attrName = name.toLowerCase();
      if (['img', 'source', 'video', 'audio', 'track'].includes(tagName) && ['src', 'srcset', 'poster'].includes(attrName)) {
        const rewrittenValue = rewriteMediaAttributeValue(tagName, attrName, String(value), window.location.href);
        return originalSetAttribute.call(this, name, rewrittenValue);
      }
    }
    return originalSetAttribute.call(this, name, value);
  };

  function patchMediaProperty(proto, propertyName) {
    if (!proto) return;
    const descriptor = Object.getOwnPropertyDescriptor(proto, propertyName);
    if (!descriptor || typeof descriptor.set !== 'function') return;
    Object.defineProperty(proto, propertyName, {
      configurable: true,
      enumerable: descriptor.enumerable,
      get: descriptor.get ? function() {
        return descriptor.get.call(this);
      } : undefined,
      set: function(value) {
        const tagName = this.tagName ? this.tagName.toLowerCase() : '';
        const rewrittenValue = rewriteMediaAttributeValue(tagName, propertyName.toLowerCase(), String(value), window.location.href);
        return descriptor.set.call(this, rewrittenValue);
      },
    });
  }
  patchMediaProperty(window.HTMLImageElement && window.HTMLImageElement.prototype, 'src');
  patchMediaProperty(window.HTMLImageElement && window.HTMLImageElement.prototype, 'srcset');
  patchMediaProperty(window.HTMLSourceElement && window.HTMLSourceElement.prototype, 'src');
  patchMediaProperty(window.HTMLSourceElement && window.HTMLSourceElement.prototype, 'srcset');
  patchMediaProperty(window.HTMLVideoElement && window.HTMLVideoElement.prototype, 'poster');
  patchMediaProperty(window.HTMLMediaElement && window.HTMLMediaElement.prototype, 'src');

  function observeMediaMutations() {
    const root = document.documentElement || document;
    if (!root || typeof MutationObserver === 'undefined') return;
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes') {
          localizeMediaElement(mutation.target, window.location.href);
          continue;
        }
        mutation.addedNodes.forEach((node) => {
          localizeMediaTree(node, window.location.href);
        });
      }
    });
    observer.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['src', 'srcset', 'poster'],
    });
  }

  function installMediaLocalization() {
    localizeMediaTree(document.documentElement, window.location.href);
    observeMediaMutations();
  }
  const revealFallbackSeenAt = new WeakMap();

  function isNearViewport(element) {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    return rect.bottom >= -viewportHeight * 0.15 && rect.top <= viewportHeight * 1.15;
  }

  function releaseStaleRevealState() {
    if (!document.documentElement.classList.contains('sr')) return;
    const now = performance.now();
    document.querySelectorAll('[data-reveal]').forEach((element) => {
      if (!isNearViewport(element)) {
        revealFallbackSeenAt.delete(element);
        return;
      }
      const styles = getComputedStyle(element);
      const isHidden = styles.visibility === 'hidden' || Number(styles.opacity || '1') <= 0.01;
      if (!isHidden) {
        revealFallbackSeenAt.delete(element);
        return;
      }
      const firstSeenAt = revealFallbackSeenAt.get(element);
      if (typeof firstSeenAt !== 'number') {
        revealFallbackSeenAt.set(element, now);
        return;
      }
      if (now - firstSeenAt < 1800) {
        return;
      }
      element.style.visibility = 'visible';
      element.style.opacity = '1';
      element.removeAttribute('data-reveal');
      element.setAttribute('data-interceptor-reveal-fallback', 'true');
      revealFallbackSeenAt.delete(element);
      console.log('[DOM Interceptor] ✓ reveal fallback', element.tagName.toLowerCase(), element.className || element.id || '');
    });
  }
  let revealFallbackRaf = 0;

  function scheduleRevealFallback() {
    if (revealFallbackRaf) return;
    revealFallbackRaf = requestAnimationFrame(() => {
      revealFallbackRaf = 0;
      releaseStaleRevealState();
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      installMediaLocalization();
      scheduleRevealFallback();
    }, {
      once: true
    });
  } else {
    installMediaLocalization();
    scheduleRevealFallback();
  }
  window.addEventListener('scroll', scheduleRevealFallback, {
    passive: true
  });
  window.addEventListener('resize', scheduleRevealFallback);
  window.addEventListener('load', () => {
    scheduleRevealFallback();
    setTimeout(scheduleRevealFallback, 1500);
    setTimeout(scheduleRevealFallback, 4000);
  });
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    const referrer = (options && options.referrer) || document.currentScript?.src || window.location.href;
    const method = (options && options.method) || 'GET';
    const localPath = getLocalPath(url, referrer);
    if (localPath) {
      console.log('[Fetch Interceptor] \u2713', url, '->', localPath);
      return originalFetch(localPath, options);
    }
    if (isTrackingEndpoint(url)) {
      console.warn('[Fetch Interceptor] \u2717 Blocked tracking call:', url);
      return Promise.resolve(buildMockResponse(url, method));
    }
    if (isExternal(url)) {
      console.warn('[Fetch Interceptor] \u2717 Blocked external leak:', url);
      return Promise.resolve(buildMockResponse(url, method));
    }
    return originalFetch(url, options);
  };
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function(method, url, ...args) {
    const referrer = document.currentScript?.src || window.location.href;
    const localPath = getLocalPath(url, referrer);
    this._interceptedUrl = url;
    this._hasLocalMapping = !!localPath;
    if (localPath) {
      console.log('[XHR Interceptor] \u2713', url, '->', localPath);
      return originalOpen.call(this, method, localPath, ...args);
    }
    return originalOpen.call(this, method, url, ...args);
  };
  XMLHttpRequest.prototype.send = function(...args) {
    if (this._interceptedUrl && !this._hasLocalMapping && (isTrackingEndpoint(this._interceptedUrl) || isExternal(this._interceptedUrl))) {
      if (isTrackingEndpoint(this._interceptedUrl)) {
        console.warn('[XHR Interceptor] \u2717 Blocked tracking call:', this._interceptedUrl);
      } else {
        console.warn('[XHR Interceptor] \u2717 Blocked external leak:', this._interceptedUrl);
      }
      Object.defineProperty(this, 'status', {
        value: 200,
        writable: false
      });
      Object.defineProperty(this, 'statusText', {
        value: 'OK (Mocked)',
        writable: false
      });
      Object.defineProperty(this, 'responseText', {
        value: this._interceptedUrl.includes('/rest/') ? '[]' : '{}',
        writable: false
      });
      Object.defineProperty(this, 'response', {
        value: this._interceptedUrl.includes('/rest/') ? '[]' : '{}',
        writable: false
      });
      Object.defineProperty(this, 'readyState', {
        value: 4,
        writable: false
      });
      setTimeout(() => {
        if (this.onload) this.onload({
          type: 'load',
          target: this
        });
        if (this.onreadystatechange) this.onreadystatechange({
          type: 'readystatechange',
          target: this
        });
      }, 0);
      return;
    }
    return originalSend.apply(this, args);
  };
  console.log('[Fetch Interceptor] Installed with', Object.keys(resourceMap).length, 'mappings');
  console.log('[Fetch Interceptor] Basename index:', Object.keys(basenameIndex).length, 'files');
})();
