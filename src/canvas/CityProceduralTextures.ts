/**
 * @file clients/portfolio/src/canvas/CityProceduralTextures.ts
 * @description Procedural HTML5 Canvas PBR texture synthesizer for Night City architecture,
 * road asphalt, sidewalks, curtain-wall skyscrapers, retail storefronts, and holographic ring ads.
 * Eliminates flat/untextured surfaces with zero external asset network requests.
 */

import * as THREE from 'three';

function createRepeatingTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
  isColor = true
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    draw(ctx, width, height);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.flipY = false; // Align with glTF 2.0 UV origin (top-left) exported by Blender
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  if (isColor) {
    tex.colorSpace = THREE.SRGBColorSpace;
  }
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

function buildAsphaltTexture(): THREE.CanvasTexture {
  return createRepeatingTexture(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#1d2026';
    ctx.fillRect(0, 0, w, h);

    // Deterministic pseudo-random mineral aggregate noise
    let seed = 42;
    const rand = (): number => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    for (let i = 0; i < 14000; i++) {
      const x = rand() * w;
      const y = rand() * h;
      const v = Math.floor(24 + rand() * 32);
      ctx.fillStyle = `rgb(${v}, ${v + 2}, ${v + 5})`;
      ctx.fillRect(x, y, 2, 2);
    }

    // Subtle weathered asphalt tar seams
    ctx.strokeStyle = 'rgba(12, 14, 18, 0.55)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 6; i++) {
      const y = (i / 6) * h + rand() * 35;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(w * 0.3, y + 12, w * 0.7, y - 10, w, y + 4);
      ctx.stroke();
    }
  });
}

function buildSidewalkTexture(): THREE.CanvasTexture {
  return createRepeatingTexture(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#474c54';
    ctx.fillRect(0, 0, w, h);

    const tiles = 4;
    const step = w / tiles;
    for (let gx = 0; gx < tiles; gx++) {
      for (let gy = 0; gy < tiles; gy++) {
        const shade = ((gx + gy) % 2 === 0 ? 70 : 76);
        ctx.fillStyle = `rgb(${shade}, ${shade + 4}, ${shade + 9})`;
        ctx.fillRect(gx * step + 2, gy * step + 2, step - 4, step - 4);
      }
    }

    // Expansion joint dark grooves
    ctx.strokeStyle = '#252930';
    ctx.lineWidth = 3;
    for (let i = 0; i <= tiles; i++) {
      const pos = i * step;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, h);
      ctx.moveTo(0, pos);
      ctx.lineTo(w, pos);
      ctx.stroke();
    }
  });
}

function buildCurtainGlassTexture(): THREE.CanvasTexture {
  return createRepeatingTexture(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#09111c';
    ctx.fillRect(0, 0, w, h);

    const cols = 8;
    const rows = 12;
    const cw = w / cols;
    const rh = h / rows;

    let seed = 109;
    const rand = (): number => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const roll = rand();
        if (roll > 0.78) {
          ctx.fillStyle = roll > 0.90 ? '#1b4965' : '#2a3b4c';
        } else if (roll < 0.09) {
          ctx.fillStyle = '#6b4226'; // Warm dim interior glow
        } else {
          ctx.fillStyle = '#0d1929';
        }
        ctx.fillRect(c * cw + 4, r * rh + 4, cw - 8, rh - 8);
      }
    }

    // Dark bronze/graphite structural transoms & mullions
    ctx.strokeStyle = '#181c24';
    ctx.lineWidth = 4;
    for (let c = 0; c <= cols; c++) {
      ctx.beginPath();
      ctx.moveTo(c * cw, 0);
      ctx.lineTo(c * cw, h);
      ctx.stroke();
    }
    ctx.lineWidth = 5;
    for (let r = 0; r <= rows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * rh);
      ctx.lineTo(w, r * rh);
      ctx.stroke();
    }
  });
}

function buildTerracottaPanelTexture(): THREE.CanvasTexture {
  return createRepeatingTexture(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#6d2518';
    ctx.fillRect(0, 0, w, h);

    const rows = 8;
    const rh = h / rows;
    for (let r = 0; r < rows; r++) {
      const y = r * rh;
      ctx.fillStyle = r % 2 === 0 ? '#7a2c1d' : '#5e1e13';
      ctx.fillRect(0, y + 2, w, rh - 4);

      // Architectural louvered vents & window slots
      ctx.fillStyle = '#1e1c21';
      for (let x = 24; x < w - 32; x += 96) {
        ctx.fillRect(x, y + 12, 64, rh - 24);
        ctx.fillStyle = '#2d3542';
        ctx.fillRect(x + 4, y + 16, 56, rh - 32);
        ctx.fillStyle = '#1e1c21';
      }
    }

    ctx.strokeStyle = '#38120c';
    ctx.lineWidth = 4;
    for (let x = 0; x <= w; x += 128) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
  });
}

function buildTealCladdingTexture(): THREE.CanvasTexture {
  return createRepeatingTexture(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#0e4c59';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#072a32';
    ctx.lineWidth = 4;
    for (let x = 0; x <= w; x += 128) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Subtle brushed steel vents & cyan technical trim
    ctx.fillStyle = '#136b7d';
    ctx.fillRect(24, 16, 80, 32);
    ctx.fillRect(280, 144, 80, 32);
    ctx.fillStyle = '#00d4ff';
    ctx.fillRect(16, 250, 96, 4);
  });
}

function buildStorefrontTexture(): THREE.CanvasTexture {
  return createRepeatingTexture(512, 256, (ctx, w, h) => {
    // Dark structural surround (NO blank white slab!)
    ctx.fillStyle = '#11151d';
    ctx.fillRect(0, 0, w, h);

    // Three glass retail bays with moody Cyberpunk interior counters & signage
    const bays = [
      { x: 16, bw: 148, accent: '#00e5ff', warm: '#f59e0b', title: 'CYBER MODS' },
      { x: 182, bw: 148, accent: '#ff007f', warm: '#ff5500', title: 'RAMEN BAR' },
      { x: 348, bw: 148, accent: '#fbbf24', warm: '#38bdf8', title: 'TECH SUPPLY' },
    ];

    for (const bay of bays) {
      ctx.fillStyle = '#0a0f18';
      ctx.fillRect(bay.x, 22, bay.bw, h - 40);

      // Warm lit depth interior backdrop
      const grad = ctx.createLinearGradient(bay.x, 40, bay.x, h - 40);
      grad.addColorStop(0, '#121a28');
      grad.addColorStop(0.65, '#1d2738');
      grad.addColorStop(1, bay.warm);
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = grad;
      ctx.fillRect(bay.x + 8, 56, bay.bw - 16, h - 82);
      ctx.globalAlpha = 1.0;

      // Glowing shop neon transom strip
      ctx.fillStyle = bay.accent;
      ctx.fillRect(bay.x + 6, 30, bay.bw - 12, 18);

      ctx.fillStyle = '#070a0f';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(bay.title, bay.x + bay.bw * 0.5, 43);

      // Steel window mullions
      ctx.strokeStyle = '#252c38';
      ctx.lineWidth = 3;
      ctx.strokeRect(bay.x + 2, 24, bay.bw - 4, h - 44);
    }
  });
}

function buildHolographicRingTexture(accentHex: string, secondaryHex: string, title: string): THREE.CanvasTexture {
  return createRepeatingTexture(512, 128, (ctx, w, h) => {
    ctx.fillStyle = '#090e18';
    ctx.fillRect(0, 0, w, h);

    // Vivid glowing horizontal bands + dark contrast bars (prevents ACES blow-out to white)
    ctx.fillStyle = accentHex;
    ctx.fillRect(0, 6, w, 10);
    ctx.fillRect(0, h - 16, w, 10);

    // Tech graphic panels
    ctx.fillStyle = secondaryHex;
    ctx.fillRect(16, 26, 12, h - 52);
    ctx.fillRect(272, 26, 12, h - 52);

    ctx.fillStyle = accentHex;
    ctx.font = 'bold 34px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, 44, h * 0.52);

    // Graphic equalizer bars
    for (let bx = 310; bx < w - 20; bx += 18) {
      const barH = 18 + ((bx * 7) % 42);
      ctx.fillStyle = bx % 36 === 0 ? secondaryHex : accentHex;
      ctx.fillRect(bx, (h - barH) * 0.5, 10, barH);
    }
  });
}

function buildKioskPosterTexture(): THREE.CanvasTexture {
  return createRepeatingTexture(256, 512, (ctx, w, h) => {
    ctx.fillStyle = '#111318';
    ctx.fillRect(0, 0, w, h);

    // Night City signature yellow poster framing (Ref Image 2 right)
    ctx.fillStyle = '#eab308';
    ctx.fillRect(14, 14, w - 28, h - 28);

    ctx.fillStyle = '#141418';
    ctx.fillRect(26, 26, w - 52, 76);

    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CYBER-NET', w * 0.5, 72);

    // Bold graphic emblem
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(36, 128, w - 72, 180);
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(w * 0.5, 218, 56, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#111318';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('AI // SYSTEMS', w * 0.5, 360);
    ctx.font = 'bold 18px monospace';
    ctx.fillText('NAVEEN.PORTFOLIO', w * 0.5, 404);

    // Magenta bottom stripe
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(26, h - 72, w - 52, 32);
  });
}

export function applyCyberpunkCityTextures(cityRoot: THREE.Object3D): THREE.Texture[] {
  const createdTextures: THREE.Texture[] = [];
  const asphaltTex = buildAsphaltTexture();
  const sidewalkTex = buildSidewalkTexture();
  const glassTex = buildCurtainGlassTexture();
  const terracottaTex = buildTerracottaPanelTexture();
  const tealTex = buildTealCladdingTexture();
  const storefrontTex = buildStorefrontTexture();
  const kioskTex = buildKioskPosterTexture();

  const amberRingTex = buildHolographicRingTexture('#f59e0b', '#fbbf24', 'MILITECH // CLOUD');
  const magentaRingTex = buildHolographicRingTexture('#ec4899', '#06b6d4', 'ARASAKA // AI CORE');
  const cyanRingTex = buildHolographicRingTexture('#06b6d4', '#facc15', 'NAVEEN B // SYSTEMS');
  const goldRingTex = buildHolographicRingTexture('#eab308', '#f97316', 'KANG TAO // RAG');

  createdTextures.push(
    asphaltTex,
    sidewalkTex,
    glassTex,
    terracottaTex,
    tealTex,
    storefrontTex,
    kioskTex,
    amberRingTex,
    magentaRingTex,
    cyanRingTex,
    goldRingTex
  );

  const patchedMaterials = new Set<THREE.Material>();

  cityRoot.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const materials = Array.isArray(child.material) ? child.material : [child.material];

    for (const rawMat of materials) {
      if (!(rawMat instanceof THREE.MeshStandardMaterial)) continue;
      if (patchedMaterials.has(rawMat)) continue;
      patchedMaterials.add(rawMat);

      const name = rawMat.name || '';

      if (name.includes('M_Road_Asphalt')) {
        rawMat.map = asphaltTex;
        rawMat.color.set(0xffffff);
        rawMat.roughness = 0.78;
        rawMat.metalness = 0.04;
      } else if (name.includes('M_Sidewalk_Paver')) {
        rawMat.map = sidewalkTex;
        rawMat.color.set(0xffffff);
        rawMat.roughness = 0.85;
      } else if (name.includes('M_Glass_Dark_Reflective')) {
        rawMat.map = glassTex;
        rawMat.color.set(0xffffff);
        rawMat.emissive = new THREE.Color(0x16263b);
        rawMat.emissiveMap = glassTex;
        rawMat.emissiveIntensity = 0.8;
        rawMat.roughness = 0.18;
        rawMat.metalness = 0.55;
      } else if (name.includes('M_Terracotta_Facade')) {
        rawMat.map = terracottaTex;
        rawMat.color.set(0xffffff);
        rawMat.roughness = 0.62;
      } else if (name.includes('M_Cyberpunk_Teal_Metal')) {
        rawMat.map = tealTex;
        rawMat.color.set(0xffffff);
        rawMat.metalness = 0.55;
        rawMat.roughness = 0.36;
      } else if (name.includes('M_Storefront_Lit')) {
        rawMat.map = storefrontTex;
        rawMat.color.set(0xffffff);
        rawMat.emissive = new THREE.Color(0xffffff);
        rawMat.emissiveMap = storefrontTex;
        rawMat.emissiveIntensity = 1.4;
      } else if (name.includes('M_Kiosk_Poster_Yellow')) {
        rawMat.map = kioskTex;
        rawMat.color.set(0xffffff);
        rawMat.emissive = new THREE.Color(0xffffff);
        rawMat.emissiveMap = kioskTex;
        rawMat.emissiveIntensity = 1.5;
      } else if (name.includes('M_Neon_Amber')) {
        rawMat.map = amberRingTex;
        rawMat.emissive = new THREE.Color(0xffffff);
        rawMat.emissiveMap = amberRingTex;
        rawMat.emissiveIntensity = 2.0;
      } else if (name.includes('M_Neon_Magenta')) {
        rawMat.map = magentaRingTex;
        rawMat.emissive = new THREE.Color(0xffffff);
        rawMat.emissiveMap = magentaRingTex;
        rawMat.emissiveIntensity = 2.0;
      } else if (name.includes('M_Neon_Cyan')) {
        rawMat.map = cyanRingTex;
        rawMat.emissive = new THREE.Color(0xffffff);
        rawMat.emissiveMap = cyanRingTex;
        rawMat.emissiveIntensity = 2.0;
      } else if (name.includes('M_Neon_Gold')) {
        rawMat.map = goldRingTex;
        rawMat.emissive = new THREE.Color(0xffffff);
        rawMat.emissiveMap = goldRingTex;
        rawMat.emissiveIntensity = 2.0;
      }

      rawMat.needsUpdate = true;
    }
  });

  return createdTextures;
}
