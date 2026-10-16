"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * IglooWebGLStage — Silky Volumetric Light & Caustic Refraction Shader Stage
 * Renders a smooth, organic, fluid-light field on the GPU that shifts with
 * scroll depth and pointer movement. Zero jagged wireframes or polygon edges—
 * designed specifically to make frosted glass surfaces (.glass-card, .glass-pill)
 * glow with deep obsidian, warm crimson, and rose-champagne caustics.
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

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
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
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform float uScroll;
      uniform vec2 uMouse;
      uniform vec2 uResolution;

      // Smooth 2D simplex-style trigonometric flow
      float silkWave(vec2 p, float t) {
        float v = 0.0;
        v += sin((p.x * 1.6 + t * 0.35) + cos(p.y * 1.4 - t * 0.25)) * 0.5;
        v += sin((p.y * 2.1 - t * 0.28) + sin(p.x * 1.9 + t * 0.32)) * 0.25;
        v += cos((p.x * 1.1 + p.y * 1.3) - t * 0.2) * 0.25;
        return v * 0.5 + 0.5;
      }

      void main() {
        vec2 uv = vUv;
        float aspect = uResolution.x / max(uResolution.y, 1.0);
        vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
        vec2 m = (uMouse - 0.5) * vec2(aspect, 1.0);

        float t = uTime * 0.55 + uScroll * 2.2;

        // Soft domain warping for liquid silk caustics
        vec2 q = p;
        q.x += sin(p.y * 2.2 + t * 0.4) * 0.18;
        q.y += cos(p.x * 2.0 - t * 0.35) * 0.18;

        float wave1 = silkWave(q * 1.35, t);
        float wave2 = silkWave(q * 2.1 - m * 0.45, -t * 0.7);
        float ribbon = smoothstep(0.22, 0.88, wave1 * 0.65 + wave2 * 0.35);

        // Center-weighted studio aura that breathes gently with scroll
        vec2 centerOffset = vec2(
          sin(uScroll * 3.14159) * 0.14 + m.x * 0.18,
          cos(uScroll * 2.0) * 0.08 - m.y * 0.18
        );
        float distCenter = length(p - centerOffset);
        float coreAura = exp(-distCenter * distCenter * 2.4);

        // Secondary soft ambient lobe
        vec2 lobePos = vec2(-0.35 * aspect, 0.25 - mod(uScroll * 0.6, 0.5));
        float distLobe = length(p - lobePos);
        float lobeAura = exp(-distLobe * distLobe * 3.2);

        // Studio palette: Deep Obsidian -> Velvet Burgundy -> Warm Rose Glow
        vec3 obsidian = vec3(0.031, 0.024, 0.028);     // #080607
        vec3 deepWine = vec3(0.165, 0.027, 0.067);     // #2a0711
        vec3 crimsonGlow = vec3(0.58, 0.075, 0.21);    // #941336
        vec3 roseChampagne = vec3(0.88, 0.32, 0.36);   // #e0525c

        vec3 col = obsidian;
        col = mix(col, deepWine, ribbon * 0.68 + lobeAura * 0.45);
        col = mix(col, crimsonGlow, coreAura * 0.52 + pow(ribbon, 2.4) * 0.24);
        col += roseChampagne * pow(coreAura, 2.6) * 0.16;

        // Subtle vignette so edges stay deep and editorial
        float vignette = smoothstep(1.35, 0.25, length(p * vec2(0.82, 0.95)));
        col *= mix(0.55, 1.0, vignette);

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
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    onScroll();

    let rafId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = window.requestAnimationFrame(animate);
      if (document.hidden) return;

      const elapsed = clock.getElapsedTime();
      currentScroll += (targetScroll - currentScroll) * 0.06;
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
