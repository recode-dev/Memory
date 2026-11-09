const SHA256_K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];

const BLOCK_SIZE = 128;
const WORD_SIZE = 64;
const KEY_SIZE = 16;
const FILL_SIZE = 48;
const DIGEST_SIZE = 32;

const rotr = (x, n) => ((x >>> n) | (x << (32 - n))) >>> 0;

function compress(block) {
  const hv = new Int32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ]);
  const v = new Int32Array(8);
  const w = new Int32Array(64);
  for (let off = 0; off < block.length; off += WORD_SIZE) {
    for (let i = 0; i < 16; i++) {
      const j = off + (i << 2);
      w[i] = (block[j] << 24) | (block[j + 1] << 16) | (block[j + 2] << 8) | block[j + 3];
    }
    for (let i = 16; i < 64; i++) {
      const a = w[i - 15];
      const b = w[i - 2];
      const s0 = rotr(a, 7) ^ rotr(a, 18) ^ (a >>> 3);
      const s1 = rotr(b, 17) ^ rotr(b, 19) ^ (b >>> 10);
      w[i] = w[i - 16] + s0 + w[i - 7] + s1;
    }
    v.set(hv);
    for (let i = 0; i < 64; i++) {
      const s1 = rotr(v[4], 6) ^ rotr(v[4], 11) ^ rotr(v[4], 25);
      const ch = (v[4] & v[5]) ^ (~v[4] & v[6]);
      const t1 = v[7] + s1 + ch + SHA256_K[i] + w[i];
      const s0 = rotr(v[0], 2) ^ rotr(v[0], 13) ^ rotr(v[0], 22);
      const maj = (v[0] & v[1]) ^ (v[0] & v[2]) ^ (v[1] & v[2]);
      const t2 = s0 + maj;
      v[7] = v[6];
      v[6] = v[5];
      v[5] = v[4];
      v[4] = v[3] + t1;
      v[3] = v[2];
      v[2] = v[1];
      v[1] = v[0];
      v[0] = t1 + t2;
    }
    for (let i = 0; i < 8; i++) hv[i] += v[i];
  }
  const out = new Uint8Array(DIGEST_SIZE);
  for (let i = 0; i < 8; i++) {
    out[i * 4] = (hv[i] >>> 24) & 0xff;
    out[i * 4 + 1] = (hv[i] >>> 16) & 0xff;
    out[i * 4 + 2] = (hv[i] >>> 8) & 0xff;
    out[i * 4 + 3] = hv[i] & 0xff;
  }
  return out;
}

function padBlock(block, length) {
  block[length] = 0x80;
  new DataView(block.buffer).setUint32(BLOCK_SIZE - 4, length * 8);
}

export function inputToken(secrets, typeConst, snapshot) {
  const mixed = new Uint8Array(KEY_SIZE);
  const outerKey = new Uint8Array(KEY_SIZE);
  for (let i = 0; i < KEY_SIZE; i++) {
    mixed[i] = secrets.key16[i] ^ secrets.maskIn[i];
    outerKey[i] = secrets.key16[i] ^ secrets.maskOut[i];
  }
  const data = new Uint8Array(KEY_SIZE);
  for (let i = 0; i < KEY_SIZE; i++) data[i] = snapshot[(i + 4) & (KEY_SIZE - 1)];
  const inner = new Uint8Array(BLOCK_SIZE);
  const typeAt = KEY_SIZE + FILL_SIZE + KEY_SIZE;
  inner.set(mixed, 0);
  inner.fill(0x36, KEY_SIZE, KEY_SIZE + FILL_SIZE);
  inner.set(data, KEY_SIZE + FILL_SIZE);
  inner.set(typeConst, typeAt);
  padBlock(inner, typeAt + typeConst.length);
  const digest = compress(inner);
  const outer = new Uint8Array(BLOCK_SIZE);
  outer.set(outerKey, 0);
  outer.fill(0x5c, KEY_SIZE, KEY_SIZE + FILL_SIZE);
  outer.set(digest, KEY_SIZE + FILL_SIZE);
  padBlock(outer, KEY_SIZE + FILL_SIZE + DIGEST_SIZE);
  const token = compress(outer);
  const value = (token[0] | ((token[1] & 0x7f) << 8)) >>> 0;
  return value < 2 ? 1 : value;
}
