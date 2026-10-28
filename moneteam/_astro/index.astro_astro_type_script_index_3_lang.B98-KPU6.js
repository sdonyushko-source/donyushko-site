var e={triangle:`float shape(vec2 p) { return sdTri(p, .6) - .1; }`,code:`float shape(vec2 p) {
    vec2 q = p - vec2(-.95, 0.);
    float lt = min(sdSeg(q, vec2(.2, .38), vec2(-.18, 0.)), sdSeg(q, vec2(-.18, 0.), vec2(.2, -.38)));
    q = p - vec2(.95, 0.);
    float gt = min(sdSeg(q, vec2(-.2, .38), vec2(.18, 0.)), sdSeg(q, vec2(.18, 0.), vec2(-.2, -.38)));
    float sl = sdSeg(p, vec2(-.15, -.44), vec2(.15, .44));
    return min(min(lt, gt), sl) - .14;
  }`};function t(t,r){return n(r,e.triangle,{x:-.42,y:.5})}function n(e,t,n,r={}){let i=1-(r.calm??0),a=`
precision highp float;
varying vec2 v;
uniform vec2 uRes;      // canvas size in px
uniform float uTime;
uniform vec2 uTilt;     // rotation around x and y, radians
uniform vec2 uMouse;    // pointer, same -1..1 space as v
uniform float uHover;   // 0..1, eased like the reference
uniform float uWobble;  // how much the edge wobbles at rest
uniform float uLight;   // look: 0 = glowing shape on a dark page, 1 = dark shape, 2 = light glass, for a light page

vec3 hash33(vec3 p3) {
  p3 = fract(p3 * vec3(.1031, .11369, .13787));
  p3 += dot(p3, p3.yxz + 19.19);
  return -1. + 2. * fract(vec3(p3.x + p3.y, p3.x + p3.z, p3.y + p3.z) * p3.zyx);
}
float snoise3(vec3 p) {
  const float K1 = .333333333, K2 = .166666667;
  vec3 i = floor(p + (p.x + p.y + p.z) * K1);
  vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
  vec3 e = step(vec3(0.), d0 - d0.yzx);
  vec3 i1 = e * (1. - e.zxy), i2 = 1. - e.zxy * (1. - e);
  vec3 d1 = d0 - (i1 - K2), d2 = d0 - (i2 - K1), d3 = d0 - .5;
  vec4 h = max(.6 - vec4(dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)), 0.);
  vec4 n = h * h * h * h * vec4(dot(d0, hash33(i)), dot(d1, hash33(i + i1)), dot(d2, hash33(i + i2)), dot(d3, hash33(i + 1.)));
  return dot(vec4(31.316), n);
}

// Rounded triangle pointing down (the M-One logo triangle)
float sdTri(vec2 p, float r) {
  p.y = -p.y;
  const float k = 1.7320508;
  p.x = abs(p.x) - r;
  p.y = p.y + r / k;
  if (p.x + k * p.y > 0.) p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.;
  p.x -= clamp(p.x, -2. * r, 0.);
  return -length(p) * sign(p.y);
}
float sdSeg(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0., 1.)); }
__SHAPE__

mat3 rot(vec2 t) {
  float cx = cos(t.x), sx = sin(t.x), cy = cos(t.y), sy = sin(t.y);
  mat3 rx = mat3(1., 0., 0., 0., cx, sx, 0., -sx, cx);
  mat3 ry = mat3(cy, 0., -sy, 0., 1., 0., sy, 0., cy);
  return ry * rx;
}
// Where a screen point lands on the turned plane of the triangle
vec2 toPlane(vec2 uv, mat3 R) {
  vec3 ro = vec3(0., 0., -3.2), rd = normalize(vec3(uv, 2.4));
  vec3 N = R * vec3(0., 0., 1.), U = R * vec3(1., 0., 0.), V = R * vec3(0., 1., 0.);
  vec3 h = ro + rd * (-dot(ro, N) / dot(rd, N));
  return vec2(dot(h, U), dot(h, V));
}

void main() {
  vec2 asp = vec2(uRes.x / uRes.y, 1.);
  vec2 uv = v * asp;
  vec2 m = uMouse * asp;

  // The reference's repulsion field, scaled to the triangle (its sphere radius .8 -> our triangle ~.6 on screen):
  // inside radius .52 every point samples from closer to the cursor, so the picture is pushed away from it
  vec2 fromMouse = uv - m;
  float dist = length(fromMouse);
  float repulsion = (1. - smoothstep(0., .52, dist)) * uHover;
  if (dist > .001) uv -= fromMouse / dist * repulsion * .26;

  mat3 R = rot(uTilt);
  vec2 p = toPlane(uv, R);

  // Living edge: the outline wobbles slowly with noise, like the reference's ring
  float n0 = snoise3(vec3(p * .65, uTime * .35)) * .5 + .5;
  float d = shape(p) + (n0 - .5) * uWobble;

  vec2 e = vec2(.003, 0.);
  vec2 nrm = normalize(vec2(shape(p + e.xy) - shape(p - e.xy), shape(p + e.yx) - shape(p - e.yx)) + 1e-6);
  float ang = atan(nrm.y, nrm.x);

  // Rim colour shifts between two blues around the edge; a white light runs around it
  float cl = cos(ang + uTime * .8) * .5 + .5;
  vec3 colBase = mix(vec3(.24, .42, 1.), vec3(.55, .66, 1.), cl);
  float a = uTime * -.4;
  vec2 L = vec2(cos(a), sin(a));
  float lightRun = pow(max(dot(nrm, L), 0.), 3.);

  float px = 1.6 / uRes.y;
  float body = smoothstep(px, -px, d);
  // Soft wide glow on both sides of the edge (reference: 1/(1+dist*10)), faded inside like its innerFade
  float glow = 1. / (1. + abs(d) * 22.);
  glow *= mix(smoothstep(-.22, -.02, d), 1., step(0., d));
  glow *= 1. - smoothstep(.0, .35, d);
  float line = exp(-abs(d) / .006);

  vec3 bodyCol = vec3(.012, .016, .035) + vec3(.015, .025, .07) * (1. - length(p));
  vec3 rimCol = colBase * (glow * .9 + line * .6) + vec3(1.) * lightRun * (line * 1.4 + glow * .7);
  vec3 col = bodyCol * body + rimCol;
  float alpha = clamp(body + glow * .9 + line + lightRun * glow, 0., 1.);
  if (uLight > 1.5) {
    // Light glass: a see-through white body tinted blue towards the edge, a bright white edge where the light runs,
    // a pale blue edge elsewhere, and a soft shadow outside so it stands off the light page
    float edgeIn = smoothstep(-.16, 0., d) * body;
    vec3 glassCol = mix(vec3(1.), vec3(.82, .87, 1.), edgeIn);
    float glassA = body * (.5 + .25 * edgeIn);
    float rimA = clamp(line * (.55 + .45 * lightRun) + glow * .12 * lightRun, 0., 1.);
    vec3 rimC = mix(vec3(.62, .70, 1.), vec3(1.), lightRun);
    float shadowA = (1. - body) * .10 * exp(-max(d, 0.) / .06);
    col = vec3(0.) + glassCol * glassA;
    alpha = shadowA * (1. - glassA) + glassA;
    col = rimC * rimA + col * (1. - rimA);
    alpha = rimA + alpha * (1. - rimA);
  } else if (uLight > .5) {
    // Light page: a dark body with a blue edge; the running light turns the edge pale blue
    vec3 inkCol = vec3(.043, .051, .075) + vec3(.02, .03, .07) * (1. - length(p));
    float rimA = clamp(line * .95 + glow * .22, 0., 1.);
    vec3 rimC = mix(vec3(.10, .25, .91), vec3(.56, .64, 1.), lightRun);
    col = rimC * rimA + inkCol * body * (1. - rimA);
    alpha = rimA + body * (1. - rimA);
  }
  gl_FragColor = vec4(col, alpha);
}`.replace(`__SHAPE__`,t),o=e.getContext(`webgl`,{premultipliedAlpha:!0,alpha:!0,antialias:!0});if(!o)return!1;let s=(e,t)=>{let n=o.createShader(e);return o.shaderSource(n,t),o.compileShader(n),o.getShaderParameter(n,o.COMPILE_STATUS)?n:(console.warn(o.getShaderInfoLog(n)),null)},c=s(o.VERTEX_SHADER,`attribute vec2 a; varying vec2 v; void main(){ v = a; gl_Position = vec4(a, 0., 1.); }`),l=s(o.FRAGMENT_SHADER,a);if(!c||!l)return!1;let u=o.createProgram();if(o.attachShader(u,c),o.attachShader(u,l),o.linkProgram(u),!o.getProgramParameter(u,o.LINK_STATUS))return!1;o.useProgram(u);let d=o.createBuffer();o.bindBuffer(o.ARRAY_BUFFER,d),o.bufferData(o.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),o.STATIC_DRAW);let f=o.getAttribLocation(u,`a`);o.enableVertexAttribArray(f),o.vertexAttribPointer(f,2,o.FLOAT,!1,0,0);let p=e=>o.getUniformLocation(u,e),m=p(`uRes`),h=p(`uTime`),g=p(`uTilt`),_=p(`uMouse`),v=p(`uHover`),y=p(`uWobble`),b=p(`uLight`);o.enable(o.BLEND),o.blendFunc(o.ONE,o.ONE_MINUS_SRC_ALPHA);let x=()=>{let t=Math.min(1.5,devicePixelRatio||1),n=e.getBoundingClientRect();e.width=Math.max(1,Math.round(n.width*t)),e.height=Math.max(1,Math.round(n.height*t)),o.viewport(0,0,e.width,e.height)};x(),addEventListener(`resize`,x);let S=0,C=0,w=0,T=0,E=0,D=0,O=0,k=0;matchMedia(`(pointer: fine)`).matches&&(addEventListener(`pointermove`,t=>{let n=e.getBoundingClientRect();S=(t.clientX-n.left)/n.width*2-1,C=-((t.clientY-n.top)/n.height*2-1),D=+(Math.abs(S)<=1&&Math.abs(C)<=1)},{passive:!0}),document.addEventListener(`pointerleave`,()=>{D=0}));let A=matchMedia(`(prefers-reduced-motion: reduce)`).matches,j=performance.now(),M=0,N=t=>{M=0;let a=A?0:(t-j)/1e3;w+=(S-w)*.08,T+=(C-T)*.08,E+=(D-E)*.06,O+=(n.x+Math.sin(a*.31)*.06*i-O)*.06,k+=(n.y+Math.sin(a*.23)*.08*i-k)*.06,o.clearColor(0,0,0,0),o.clear(o.COLOR_BUFFER_BIT),o.uniform2f(m,e.width,e.height),o.uniform1f(h,a),o.uniform2f(g,O,k),o.uniform2f(_,w,T),o.uniform1f(v,E),o.uniform1f(y,.06*i),o.uniform1f(b,r.look===`glass`?2:+(r.look===`dark`)),o.drawArrays(o.TRIANGLE_STRIP,0,4),P&&(M=requestAnimationFrame(N))},P=!0,F=()=>{!M&&P&&(M=requestAnimationFrame(N))};return new IntersectionObserver(([e])=>{P=e.isIntersecting,F()}).observe(e),F(),!0}var r=document.querySelector(`[data-orb]`);if(r){let e=r.querySelector(`.orb-gl`);e&&t(r,e)?r.classList.add(`gl-on`):e?.remove()}var i=r?.closest(`.hero`);if(r&&i&&matchMedia(`(pointer: fine)`).matches&&!matchMedia(`(prefers-reduced-motion: reduce)`).matches){let e=r.querySelector(`.orb`),t=0,n=0,a=0,o=0,s=-45,c=-45,l=0,u=()=>{a+=(t-a)*.08,o+=(n-o)*.08;let i=s-c;i=(i+540)%360-180,c+=i*.1,r.style.setProperty(`--rx`,(-a*22).toFixed(1)+`px`),r.style.setProperty(`--ry`,(-o*14).toFixed(1)+`px`),e.style.setProperty(`--lx`,(38+a*30).toFixed(1)+`%`),e.style.setProperty(`--ly`,(32+o*30).toFixed(1)+`%`),r.style.setProperty(`--la`,c.toFixed(1)+`deg`),l=Math.abs(t-a)+Math.abs(n-o)+Math.abs(i)>.002?requestAnimationFrame(u):0},d=()=>{l||=requestAnimationFrame(u)};i.addEventListener(`pointermove`,e=>{let i=r.getBoundingClientRect(),a=i.left+i.width/2,o=i.top+i.height/2;t=Math.max(-1,Math.min(1,(e.clientX-a)/(innerWidth/2))),n=Math.max(-1,Math.min(1,(e.clientY-o)/(innerHeight/2))),s=Math.atan2(e.clientY-o,e.clientX-a)*180/Math.PI+90,d()}),i.addEventListener(`pointerleave`,()=>{t=0,n=0,s=-45,d()}),e.style.setProperty(`--lx`,`38%`),e.style.setProperty(`--ly`,`32%`)}