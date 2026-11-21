import sharp from 'sharp';
import {decodePhoto} from './decode-photo.mjs';

// Synthetic pixels only. No files, accounts, model calls or outgoing messages.
const bytes = await sharp({create: {
  width: 32, height: 24, channels: 3, background: '#2468ac'
}}).png().toBuffer();
const result = await decodePhoto({mimetype: 'image/png', data: bytes.toString('base64')});
console.log(JSON.stringify({format: result.format, width: result.width, height: result.height}));
