/* ============================================================================
 * hero-orb.js — interactive particle sphere in the hero's right column
 * ----------------------------------------------------------------------------
 * Ported from the ai-marketing template's first-fold object: a THREE.Points
 * cloud over an IcosahedronGeometry, displaced along its normals by 3D simplex
 * noise (it breathes), with a mouse "push" in Z near the cursor. Adapted here
 * to live inside the #hero-orb container (not full-screen) and to take its
 * colours from our design tokens (--ink + a neutral stone tone — no off-palette
 * blue). Pauses on tab hide; renders a single static frame for reduced-motion.
 * ========================================================================== */

(function () {
  "use strict";

  var container = document.getElementById("hero-orb");
  if (!container || typeof window.THREE === "undefined") return;
  var THREE = window.THREE;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function token(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }
  var INK = token("--ink", "#0a0a0a");
  var TONE = token("--stone-500", "#6b6760"); // tonal variation, on-palette

  // ---- shaders (vertex copied from the template; fragment tweaked so the
  //      second mix colour is a uniform fed from our palette) ----
  var vert =
    "uniform float uTime; uniform float uDistortion; uniform float uSize; uniform vec2 uMouse; varying float vNoise;" +
    "vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}" +
    "vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}" +
    "vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}" +
    "vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}" +
    "float snoise(vec3 v){const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);" +
    "vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;" +
    "vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);vec3 x1=x0-i1+1.0*C.xxx;vec3 x2=x0-i2+2.0*C.xxx;" +
    "vec3 x3=x0-1.0+3.0*C.xxx;i=mod289(i);vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));" +
    "float n_=1.0/7.0;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);" +
    "vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);" +
    "vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;" +
    "vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);" +
    "vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;" +
    "vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;" +
    "return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}" +
    "void main(){vec3 pos=position;float noise=snoise(vec3(pos.x*0.5+uTime*0.15,pos.y*0.5,pos.z*0.5));vNoise=noise;" +
    "vec3 newPos=pos+(normal*noise*uDistortion);float dist=distance(uMouse*10.0,newPos.xy);float interaction=smoothstep(6.0,0.0,dist);" +
    "newPos.z+=interaction*1.5;vec4 mvPosition=modelViewMatrix*vec4(newPos,1.0);gl_Position=projectionMatrix*mvPosition;" +
    "gl_PointSize=uSize*(20.0/-mvPosition.z);}";

  var frag =
    "uniform vec3 uColor; uniform vec3 uColor2; varying float vNoise;" +
    "void main(){vec2 center=gl_PointCoord-vec2(0.5);float dist=length(center);if(dist>0.45)discard;" +
    "vec3 finalColor=mix(uColor,uColor2,vNoise*0.5+0.5);gl_FragColor=vec4(finalColor,1.0);}";

  var w0 = container.clientWidth || 1;
  var h0 = container.clientHeight || 1;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, w0 / h0, 0.1, 100);
  camera.position.set(0, 0, 20);

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w0, h0);
  container.appendChild(renderer.domElement);

  var group = new THREE.Group();
  scene.add(group);

  var geometry = new THREE.IcosahedronGeometry(7, 40);
  var uniforms = {
    uTime: { value: 0 },
    uDistortion: { value: 0.15 },
    uSize: { value: 1.6 },
    uColor: { value: new THREE.Color(INK) },
    uColor2: { value: new THREE.Color(TONE) },
    uMouse: { value: new THREE.Vector2(0, 0) }
  };
  var material = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    uniforms: uniforms,
    transparent: true,
    blending: THREE.NormalBlending
  });
  group.add(new THREE.Points(geometry, material));

  // Scale the sphere (radius 7) so it always fits the container's shorter axis.
  function fit() {
    var W = container.clientWidth, H = container.clientHeight;
    if (!W || !H) return;
    renderer.setSize(W, H);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    var visH = 2 * camera.position.z * Math.tan((45 * Math.PI / 180) / 2);
    var visW = visH * (W / H);
    group.scale.setScalar(Math.min(visH, visW) / 14 * 0.92);
  }
  if (window.ResizeObserver) {
    new ResizeObserver(fit).observe(container);
  } else {
    window.addEventListener("resize", fit);
  }
  fit();

  // Cursor push — normalised relative to the container so it reacts when the
  // pointer is over the sphere.
  var tmx = 0, tmy = 0;
  window.addEventListener("mousemove", function (e) {
    var r = container.getBoundingClientRect();
    if (!r.width || !r.height) return;
    tmx = ((e.clientX - r.left) / r.width) * 2 - 1;
    tmy = -(((e.clientY - r.top) / r.height) * 2 - 1);
  }, { passive: true });

  var time = 0, rafId = null;
  function loop() {
    rafId = requestAnimationFrame(loop);
    if (!container.clientWidth) return; // hidden (e.g. mobile): skip the work
    time += 0.005;
    group.rotation.y = time * 0.1;
    uniforms.uTime.value = time;
    uniforms.uMouse.value.x += (tmx - uniforms.uMouse.value.x) * 0.05;
    uniforms.uMouse.value.y += (tmy - uniforms.uMouse.value.y) * 0.05;
    renderer.render(scene, camera);
  }

  if (reduce) {
    renderer.render(scene, camera); // single static frame
  } else {
    loop();
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      } else if (!rafId) {
        loop();
      }
    });
  }
})();
