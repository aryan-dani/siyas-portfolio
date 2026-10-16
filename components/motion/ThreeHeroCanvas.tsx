"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;

  // Simplex-style hash noise for organic light falloff
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);

    vec2 p = uv;
    p.x *= aspect;

    vec2 mouse = uMouse;
    mouse.x *= aspect;

    // Studio key light center (slightly right of center like Tanish's studio backdrop, pulled by cursor)
    vec2 keyCenter = vec2(0.58 * aspect, 0.46) + (mouse - vec2(0.5 * aspect, 0.5)) * 0.16;
    float distKey = length(p - keyCenter);

    // Secondary warm rim light
    vec2 rimCenter = vec2(0.76 * aspect, 0.28) + vec2(sin(uTime * 0.4) * 0.06, cos(uTime * 0.35) * 0.05);
    float distRim = length(p - rimCenter);

    // Subtle organic wave modulation
    float n = noise(uv * 3.2 + vec2(uTime * 0.08, -uTime * 0.06)) * 0.08;

    float keyGlow = smoothstep(1.18, 0.0, distKey + n);
    float rimGlow = smoothstep(0.85, 0.0, distRim - n * 0.5);

    // Studio color palette: Deep Obsidian -> Rich Wine -> Electric Crimson -> Coral Rim
    vec3 colObsidian = vec3(0.045, 0.015, 0.025);
    vec3 colWine     = vec3(0.38, 0.04, 0.13);
    vec3 colCrimson  = vec3(0.88, 0.12, 0.27);
    vec3 colCoral    = vec3(1.0, 0.38, 0.30);

    vec3 color = mix(colObsidian, colWine, smoothstep(0.0, 0.55, keyGlow));
    color = mix(color, colCrimson, smoothstep(0.22, 0.85, keyGlow));
    color = mix(color, colCoral, pow(rimGlow, 1.65) * 0.62);

    // Subtle vignette on far left & bottom edges
    float vig = smoothstep(1.35, 0.25, length((uv - vec2(0.54, 0.48)) * vec2(1.15, 1.0)));
    color *= mix(0.45, 1.0, vig);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function ThreeHeroCanvas() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 1. Background Shader Scene (Orthographic full-screen quad)
    const bgScene = new THREE.Scene();
    const bgCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.55, 0.5) },
      uResolution: { value: new THREE.Vector2(width, height) },
    };

    const bgMat = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      depthWrite: false,
    });
    const bgQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMat);
    bgScene.add(bgQuad);

    // 2. Foreground 3D Perspective Scene (Floating Refractive Wireframe Rings & Studio Dust)
    const fgScene = new THREE.Scene();
    const fgCamera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    fgCamera.position.z = 7.5;

    const rigGroup = new THREE.Group();
    fgScene.add(rigGroup);

    // Outer architectural precision ring
    const ringGeo1 = new THREE.TorusGeometry(2.35, 0.008, 16, 140);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.16,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI * 0.32;
    ring1.rotation.y = -Math.PI * 0.14;
    rigGroup.add(ring1);

    // Second tilted orbital ring
    const ringGeo2 = new THREE.TorusGeometry(1.85, 0.006, 16, 120);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xff8a75,
      transparent: true,
      opacity: 0.22,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI * 0.28;
    ring2.rotation.y = Math.PI * 0.22;
    rigGroup.add(ring2);

    // Subtle floating studio bokeh / dust particles in 3D space
    const particleCount = 65;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 11;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    const particleMat = new THREE.PointsMaterial({
      color: 0xffe4e6,
      size: 0.032,
      transparent: true,
      opacity: 0.45,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    rigGroup.add(particles);

    const targetMouse = { x: 0.55, y: 0.5 };
    const currentMouse = { x: 0.55, y: 0.5 };

    const onMouseMove = (e: MouseEvent) => {
      targetMouse.x = e.clientX / Math.max(window.innerWidth, 1);
      targetMouse.y = 1.0 - e.clientY / Math.max(window.innerHeight, 1);
    };

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
      fgCamera.aspect = w / h;
      fgCamera.updateProjectionMatrix();
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("resize", onResize);

    renderer.autoClear = false;
    let rafId = 0;
    const startTime = performance.now();

    const animate = (now: number) => {
      rafId = requestAnimationFrame(animate);
      const elapsed = (now - startTime) * 0.001;

      currentMouse.x += (targetMouse.x - currentMouse.x) * 0.06;
      currentMouse.y += (targetMouse.y - currentMouse.y) * 0.06;

      uniforms.uTime.value = elapsed;
      uniforms.uMouse.value.set(currentMouse.x, currentMouse.y);

      // Smooth 3D rotation + cursor parallax on the orbital rig
      ring1.rotation.z = elapsed * 0.08;
      ring2.rotation.z = -elapsed * 0.11;
      particles.rotation.y = elapsed * 0.03;

      rigGroup.rotation.y = (currentMouse.x - 0.5) * 0.42;
      rigGroup.rotation.x = -(currentMouse.y - 0.5) * 0.32;

      renderer.clear();
      renderer.render(bgScene, bgCamera);
      renderer.clearDepth();
      renderer.render(fgScene, fgCamera);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      bgQuad.geometry.dispose();
      bgMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    />
  );
}
