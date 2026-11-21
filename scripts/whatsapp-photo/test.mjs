import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {decodePhoto, PHOTO_MAX_BYTES} from './decode-photo.mjs';

const generated = async (format, width = 8, height = 6) => sharp({create: {
  width, height, channels: 3, background: '#2468ac'
}})[format]().toBuffer();
const media = (bytes, format = 'png') => ({data: bytes.toString('base64'), mimetype: `image/${format}`});
for (const format of ['png', 'jpeg']) test(`fully decodes synthetic ${format}`, async () => {
  const bytes = await generated(format);
  const result = await decodePhoto(media(bytes, format));
  assert.equal(result.format, format);
  assert.equal(result.width, 8);
  assert.equal(result.height, 6);
  assert.deepEqual(result.bytes, bytes);
});
test('rejects unavailable input', async () => {
  await assert.rejects(decodePhoto(undefined), /PHOTO_UNAVAILABLE/);
});
test('rejects noncanonical base64', async () => {
  await assert.rejects(decodePhoto({data: '???', mimetype: 'image/png'}), /PHOTO_INVALID_BASE64/);
});
test('rejects oversized encoded input before decoding', async () => {
  await assert.rejects(decodePhoto({data: 'A'.repeat(4 * Math.ceil(PHOTO_MAX_BYTES / 3) + 4)}), /PHOTO_BYTE_LIMIT/);
});
test('rejects mismatched MIME and unsupported bytes', async () => {
  await assert.rejects(decodePhoto(media(await generated('png'), 'jpeg')), /PHOTO_FORMAT_REJECTED/);
  await assert.rejects(decodePhoto(media(Buffer.from('synthetic text'))), /PHOTO_FORMAT_REJECTED/);
});
test('rejects truncation and checksum corruption', async () => {
  const bytes = await generated('png');
  await assert.rejects(decodePhoto(media(bytes.subarray(0, -1))), /PHOTO_CORRUPT/);
  const corrupt = Buffer.from(bytes); corrupt[29] ^= 1;
  await assert.rejects(decodePhoto(media(corrupt)), /PHOTO_CORRUPT/);
});
test('rejects excessive dimensions', async () => {
  await assert.rejects(decodePhoto(media(await generated('png', 8193, 1))), /PHOTO_PIXEL_LIMIT/);
});
test('rejects excessive pixels', async () => {
  await assert.rejects(decodePhoto(media(await generated('png', 4001, 4000))), /PHOTO_PIXEL_LIMIT/);
});
