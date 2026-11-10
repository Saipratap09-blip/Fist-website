import fs from 'node:fs';
import zlib from 'node:zlib';

function createSolidPNG(width: number, height: number, r: number, g: number, b: number, a = 255) {
  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth
  ihdr.writeUInt8(6, 9); // RGBA
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Raw image data with scanline filters (filter byte 0 per line)
  const lineLength = 1 + width * 4;
  const rawData = Buffer.alloc(height * lineLength);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.42;

  for (let y = 0; y < height; y++) {
    const lineOffset = y * lineLength;
    rawData[lineOffset] = 0; // Filter type None
    for (let x = 0; x < width; x++) {
      const pxOffset = lineOffset + 1 + x * 4;
      
      // Indigo to Pink gradient with rounded icon aesthetic
      const t = (x + y) / (width + height);
      const pr = Math.round(79 * (1 - t) + 236 * t);
      const pg = Math.round(70 * (1 - t) + 72 * t);
      const pb = Math.round(229 * (1 - t) + 153 * t);

      // Distance from center
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Subtle white inner envelope shape
      const inEnv = Math.abs(dx) < width * 0.28 && Math.abs(dy) < height * 0.2;

      if (inEnv) {
        rawData[pxOffset] = 255;
        rawData[pxOffset + 1] = 255;
        rawData[pxOffset + 2] = 255;
        rawData[pxOffset + 3] = 255;
      } else {
        rawData[pxOffset] = pr;
        rawData[pxOffset + 1] = pg;
        rawData[pxOffset + 2] = pb;
        rawData[pxOffset + 3] = a;
      }
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type: string, data: Buffer) {
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const crc = crc32(chunk.subarray(4, 8 + len));
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

// CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf: Buffer) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public', { recursive: true });
}

fs.writeFileSync('./public/pwa-192x192.png', createSolidPNG(192, 192, 99, 102, 241));
fs.writeFileSync('./public/pwa-512x512.png', createSolidPNG(512, 512, 99, 102, 241));
fs.writeFileSync('./public/pwa-maskable-512x512.png', createSolidPNG(512, 512, 99, 102, 241));
fs.writeFileSync('./public/apple-touch-icon.png', createSolidPNG(180, 180, 99, 102, 241));
console.log('PWA PNG Icons successfully generated!');
