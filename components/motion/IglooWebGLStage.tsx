"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * IglooWebGLStage — Obsidian, Champagne-Pearl & Velvet Rose Caustic Light Stage
 * Designed specifically for two goals:
 * 1. Maximum typographic contrast: Deep obsidian-espresso base (#070609) so white
 *    and champagne-coral typography reads with crystal clarity.
 * 2. True optical glassmorphism: Sculpted, high-contrast ribbons of champagne gold,
 *    soft rose quartz, and velvet merlot pass behind .glass-card and .glass-pill
 *    surfaces so backdrop-filter blur visibly refracts luminous light forms.
 */
export function IglooWebGLStage() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: false,
        antialias: false,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    const isMobile = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 0.65 : 0.85);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
    };

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision mediump float;
      varying vec2 vUv;
      uniform float uTime;
      uniform float uScroll;
      uniform vec2 uMouse;
      uniform vec2 uResolution;

      // Sculpted liquid caustic ribbon function (polynomial fast-path, zero pow/sqrt)
      float causticRibbon(vec2 p, float t) {
        vec2 q = p;
        q.x += 0.28 * sin(p.y * 2.3 + t * 0.42);
        q.y += 0.24 * cos(p.x * 2.1 - t * 0.36);
        float w1 = sin(q.x * 2.8 + q.y * 1.9 + t * 0.5);
        float w2 = cos(q.x * 1.7 - q.y * 2.6 - t * 0.38);
        float ridge = clamp(1.0 - abs(w1 * 0.55 + w2 * 0.45), 0.0, 1.0);
        float r2 = ridge * ridge;
        return r2 * ridge;
      }

      void main() {
        vec2 uv = vUv;
        float aspect = uResolution.x / max(uResolution.y, 1.0);
        vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
        vec2 m = (uMouse - 0.5) * vec2(aspect, 1.0);

        float t = uTime * 0.48 + uScroll * 2.6;

        // Two intersecting silk-light caustic ribbons
        float r1 = causticRibbon(p * 1.15 - m * 0.22, t);
        float r2 = causticRibbon(p * 1.55 + vec2(0.35, -0.25) + m * 0.15, -t * 0.75);

        // Localized studio light orbs that drift with scroll depth
        vec2 d1 = p - vec2(
          sin(t * 0.32) * 0.28 + m.x * 0.22,
          cos(t * 0.25) * 0.18 - m.y * 0.22
        );
        vec2 d2 = p - vec2(
          -0.38 * aspect + cos(uScroll * 3.14159) * 0.22,
          0.24 - sin(uScroll * 3.14159) * 0.28
        );
        vec2 d3 = p - vec2(
          0.36 * aspect - sin(uScroll * 2.4) * 0.2,
          -0.26 + cos(uScroll * 2.4) * 0.22
        );

        float orb1 = exp(-dot(d1, d1) * 2.8);
        float orb2 = exp(-dot(d2, d2) * 3.6);
        float orb3 = exp(-dot(d3, d3) * 3.4);

        // Deep Obsidian night base for 100% crisp text legibility
        vec3 obsidian = vec3(0.027, 0.022, 0.031);      // #070608
        vec3 velvetPlum = vec3(0.18, 0.045, 0.095);     // #2e0b18
        vec3 roseQuartz = vec3(0.76, 0.22, 0.35);       // #c23859
        vec3 champagneGold = vec3(0.96, 0.72, 0.56);    // #f5b88f

        vec3 col = obsidian;

        // Soft ambient plum underglow
        col = mix(col, velvetPlum, clamp(orb1 * 0.65 + orb2 * 0.55 + orb3 * 0.45, 0.0, 0.85));

        // Sculpted rose-quartz silk folds
        float roseMask = r1 * (0.42 + 0.58 * orb1) + orb2 * 0.32;
        col = mix(col, roseQuartz, clamp(roseMask * 0.52, 0.0, 0.55));

        // Crisp champagne-gold caustic highlights for glass refraction
        float champagneMask = r2 * (0.35 + 0.65 * (orb1 + orb3 * 0.6)) + (r1 * r1) * 0.25;
        col += champagneGold * champagneMask * 0.24;

        // Gentle edge vignette to frame the editorial layout
        vec2 vp = p * vec2(0.78, 0.92);
        float vignette = smoothstep(2.1, 0.05, dot(vp, vp));
        col *= mix(0.68, 1.0, vignette);

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      depthWrite: false,
      depthTest: false,
    });

    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    let targetScroll = 0;
    let currentScroll = 0;
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;
    let currentMouseX = 0.5;
    let currentMouseY = 0.5;

    const onScroll = () => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      targetScroll = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    };

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX / Math.max(1, window.innerWidth);
      targetMouseY = e.clientY / Math.max(1, window.innerHeight);
    };

    const onResize = () => {
      const mobileNow = window.innerWidth < 768;
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, mobileNow ? 0.65 : 0.85)
      );
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    onScroll();

    let rafId = 0;
    const startTime = performance.now();

    const animate = () => {
      rafId = window.requestAnimationFrame(animate);
      if (document.hidden) return;

      const elapsed = (performance.now() - startTime) * 0.001;
      currentScroll += (targetScroll - currentScroll) * 0.065;
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      uniforms.uTime.value = reducedMotion ? 0 : elapsed;
      uniforms.uScroll.value = currentScroll;
      uniforms.uMouse.value.set(currentMouseX, currentMouseY);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    />
  );
}
