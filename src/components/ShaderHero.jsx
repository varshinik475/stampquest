import { useEffect, useRef, useState } from 'react';

const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// Aurora bands are built from moving sine fields, then softened into luminous color.
const fragmentShaderSource = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;

  void main() {
    // Centered, aspect-correct coordinates keep the bands circular on phones and desktops.
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
    vec2 mouse = (u_mouse - 0.5 * u_resolution.xy) / u_resolution.y;
    float t = u_time * 0.18;

    // Two low-frequency waves create the slow, silk-like aurora motion.
    float waveA = sin(uv.x * 2.2 + t + uv.y * 1.7 + mouse.x * 1.8);
    float waveB = sin(uv.x * 3.1 - t * 1.3 - uv.y * 2.5 + mouse.y * 1.4);
    float ribbon = smoothstep(0.12, 0.82, waveA * 0.42 + waveB * 0.3 + 0.46);

    // A soft radial glow keeps the center behind the headline calm and legible.
    float vignette = 1.0 - smoothstep(0.15, 1.15, length(uv * vec2(0.82, 0.72)));
    vec3 deep = vec3(0.025, 0.11, 0.16);
    vec3 sea = vec3(0.03, 0.43, 0.42);
    vec3 coral = vec3(0.86, 0.28, 0.18);
    vec3 color = mix(deep, sea, ribbon * 0.8);
    color = mix(color, coral, pow(ribbon, 3.0) * 0.38);
    color += vec3(0.04, 0.12, 0.11) * vignette;

    // Fine grain prevents large flat gradients from banding on compressed displays.
    float grain = fract(sin(dot(gl_FragCoord.xy + u_time, vec2(12.9898, 78.233))) * 43758.5453);
    color += (grain - 0.5) * 0.018;
    gl_FragColor = vec4(color, 1.0);
  }
`;

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  if (!vertex || !fragment) return null;
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
}

export default function ShaderHero({ children }) {
  const canvasRef = useRef(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setFallback(true);
      return undefined;
    }

    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    const program = gl && createProgram(gl);
    if (!gl || !program) {
      setFallback(true);
      return undefined;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');
    const mouse = { x: 0, y: 0 };
    let frame;
    let startedAt = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };
    const onPointerMove = (event) => {
      const bounds = canvas.getBoundingClientRect();
      mouse.x = (event.clientX - bounds.left) * (canvas.width / bounds.width);
      mouse.y = canvas.height - (event.clientY - bounds.top) * (canvas.height / bounds.height);
    };
    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
      } else {
        startedAt = performance.now() - (performance.now() - startedAt);
        frame = requestAnimationFrame(render);
      }
    };
    const render = (now) => {
      if (document.hidden) return;
      resize();
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      gl.uniform1f(timeLocation, now - startedAt);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2f(mouseLocation, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      frame = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize);
    canvas.addEventListener('pointermove', onPointerMove);
    document.addEventListener('visibilitychange', onVisibilityChange);
    resize();
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <section className={`shader-hero ${fallback ? 'shader-hero--fallback' : ''}`} aria-labelledby="home-hero-title">
      {!fallback && <canvas ref={canvasRef} className="shader-hero__canvas" aria-hidden="true" />}
      <div className="shader-hero__veil" aria-hidden="true" />
      <div className="shader-hero__content">{children}</div>
    </section>
  );
}

export { fragmentShaderSource };
