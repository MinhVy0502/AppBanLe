const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

function crc32(buf) {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    c = table[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeAndData = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData), 0);
  return Buffer.concat([len, typeAndData, crc]);
}

function createPng(width, height, drawPixel) {
  const sig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdr = makeChunk('IHDR', ihdrData);

  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0;
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawPixel(x, y, width, height);
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);
  const idat = makeChunk('IDAT', deflated);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

function pixelPainter(x, y, w, h) {
  const cr = w * 0.22;
  let inCorner = false;
  let cx = 0, cy = 0;
  if (x < cr && y < cr) { inCorner = true; cx = cr; cy = cr; }
  else if (x > w - cr && y < cr) { inCorner = true; cx = w - cr; cy = cr; }
  else if (x < cr && y > h - cr) { inCorner = true; cx = cr; cy = h - cr; }
  else if (x > w - cr && y > h - cr) { inCorner = true; cx = w - cr; cy = h - cr; }

  if (inCorner) {
    const dist = Math.hypot(x - cx, y - cy);
    if (dist > cr) return [0, 0, 0, 0];
  }

  // Base background: emerald gradient
  const progress = (x + y) / (w + h);
  let r = Math.round(16 + (5 - 16) * progress);
  let g = Math.round(185 + (150 - 185) * progress);
  let b = Math.round(129 + (105 - 129) * progress);

  // Normalized coordinates [0..1]
  const nx = x / w;
  const ny = y / h;

  // Shopping cart icon drawing:
  // Cart handle / top bar: y from 0.30 to 0.34, x from 0.25 to 0.35
  // Cart body: x 0.32 to 0.78, y 0.38 to 0.65
  // Wheels: cx1=0.42, cx2=0.68, cy=0.74, r=0.06
  const w1Dist = Math.hypot(nx - 0.42, ny - 0.74);
  const w2Dist = Math.hypot(nx - 0.68, ny - 0.74);
  if (w1Dist < 0.055 || w2Dist < 0.055) {
    return [255, 255, 255, 255];
  }

  // Cart frame lines
  if (nx >= 0.25 && nx <= 0.35 && Math.abs(ny - 0.30) < 0.02) return [255, 255, 255, 255];
  if (ny >= 0.30 && ny <= 0.65 && Math.abs((nx - 0.25) - (ny - 0.30) * 0.25) < 0.02) return [255, 255, 255, 255];
  if (ny >= 0.63 && ny <= 0.67 && nx >= 0.33 && nx <= 0.76) return [255, 255, 255, 255];
  if (nx >= 0.74 && nx <= 0.78 && ny >= 0.38 && ny <= 0.65) return [255, 255, 255, 255];
  if (ny >= 0.38 && ny <= 0.42 && nx >= 0.33 && nx <= 0.76) return [255, 255, 255, 255];

  // Barcode vertical stripes inside basket:
  if (ny >= 0.43 && ny <= 0.62) {
    const bars = [
      [0.38, 0.40],
      [0.43, 0.47],
      [0.50, 0.52],
      [0.55, 0.59],
      [0.62, 0.64],
      [0.67, 0.71]
    ];
    for (const [x1, x2] of bars) {
      if (nx >= x1 && nx <= x2) return [255, 255, 255, 255];
    }
  }

  return [r, g, b, 255];
}

const pubDir = path.join(__dirname, '..', 'frontend', 'public');
if (!fs.existsSync(pubDir)) {
  fs.mkdirSync(pubDir, { recursive: true });
}

fs.writeFileSync(path.join(pubDir, 'icon-192.png'), createPng(192, 192, pixelPainter));
fs.writeFileSync(path.join(pubDir, 'icon-512.png'), createPng(512, 512, pixelPainter));
console.log('Successfully generated icon-192.png and icon-512.png!');
