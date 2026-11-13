const fs = require("fs");
const { PNG } = require("pngjs");

const srcPath = "avatar.png";
const outPath = "avatar-pop.png";

const png = PNG.sync.read(fs.readFileSync(srcPath));
const { width: size, height, data } = png;
if (size !== height) {
  console.warn("expected square", size, height);
}
const cx = (size - 1) / 2;
const cy = (size - 1) / 2;
const maxR = size * 0.5;

const lum = (i) => 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];

// 1) punch outside + rim
for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    const dist = Math.hypot(x - cx, y - cy);
    const i = (y * size + x) << 2;
    if (dist > maxR * 0.9) data[i + 3] = 0;
  }
}

function flood(threshold, protectR) {
  const visited = new Uint8Array(size * size);
  const stack = [];
  const enqueue = (x, y) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    const p = y * size + x;
    if (visited[p]) return;
    visited[p] = 1;
    const dist = Math.hypot(x - cx, y - cy);
    if (dist < protectR) return;
    const i = p << 2;
    if (data[i + 3] < 8) return;
    if (lum(i) < threshold) stack.push(p);
  };
  for (let a = 0; a < 1200; a++) {
    const rad = (a / 1200) * Math.PI * 2;
    enqueue(
      Math.round(cx + Math.cos(rad) * maxR * 0.85),
      Math.round(cy + Math.sin(rad) * maxR * 0.85)
    );
  }
  while (stack.length) {
    const p = stack.pop();
    const i = p << 2;
    data[i + 3] = 0;
    const x = p % size;
    const y = (p / size) | 0;
    enqueue(x + 1, y);
    enqueue(x - 1, y);
    enqueue(x, y + 1);
    enqueue(x, y - 1);
  }
}

// Flat near-black plate only. Textured marble, even in shadow, stays.
for (let y = 2; y < size - 2; y++) {
  for (let x = 2; x < size - 2; x++) {
    const i = (y * size + x) << 2;
    if (data[i + 3] < 8) continue;
    const L = lum(i);
    if (L > 36) continue;
    let min = 255;
    let max = 0;
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const j = ((y + dy) * size + (x + dx)) << 2;
        const v = lum(j);
        if (v < min) min = v;
        if (v > max) max = v;
      }
    }
    if (max - min < 14) data[i + 3] = 0;
  }
}

for (let i = 0; i < data.length; i += 4) {
  if (data[i + 3] < 12) continue;
  data[i] = Math.min(255, data[i] * 1.2 + 16);
  data[i + 1] = Math.min(255, data[i + 1] * 1.2 + 16);
  data[i + 2] = Math.min(255, data[i + 2] * 1.16 + 14);
}

fs.writeFileSync(outPath, PNG.sync.write(png));
console.log("wrote", outPath);
