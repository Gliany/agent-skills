import {createRequire} from 'node:module';
import {crc32} from 'node:zlib';

export const PHOTO_MAX_BYTES=6*1024*1024;
export const PHOTO_MAX_PIXELS=16_000_000;
const pngMagic=Buffer.from('89504e470d0a1a0a','hex');
const pngEnd=Buffer.from('0000000049454e44ae426082','hex');
const require=createRequire(import.meta.url);

export async function decodePhoto(media){
  if(typeof media?.data!=='string'||!media.data.length)throw Error('PHOTO_UNAVAILABLE');
  if(media.data.length>4*Math.ceil(PHOTO_MAX_BYTES/3))throw Error('PHOTO_BYTE_LIMIT');
  const bytes=Buffer.from(media.data,'base64');
  if(bytes.length>PHOTO_MAX_BYTES)throw Error('PHOTO_BYTE_LIMIT');
  if(!bytes.length||bytes.toString('base64')!==media.data)throw Error('PHOTO_INVALID_BASE64');
  const jpeg=bytes[0]===255&&bytes[1]===216;
  const png=bytes.subarray(0,8).equals(pngMagic);
  const format=jpeg?'jpeg':png?'png':null;
  if(!format||media.mimetype!=='image/'+format)throw Error('PHOTO_FORMAT_REJECTED');
  if(jpeg&&!bytes.subarray(-2).equals(Buffer.from([255,217]))||
     png&&!bytes.subarray(-12).equals(pngEnd))throw Error('PHOTO_CORRUPT');
  if(png){
    for(let i=8;i<bytes.length;){
      if(i+12>bytes.length)throw Error('PHOTO_CORRUPT');
      const size=bytes.readUInt32BE(i),kind=bytes.toString('ascii',i+4,i+8);
      if(i+12+size>bytes.length)throw Error('PHOTO_CORRUPT');
      if(crc32(bytes.subarray(i+4,i+8+size))!==bytes.readUInt32BE(i+8+size))throw Error('PHOTO_CORRUPT');
      if(['acTL','fcTL','fdAT'].includes(kind))throw Error('PHOTO_FORMAT_REJECTED');
      if(kind==='IEND'&&i+12!==bytes.length)throw Error('PHOTO_CORRUPT');
      i+=12+size;
    }
  }
  let sharp;
  try{
    sharp=require('sharp');
  }catch{throw Error('PHOTO_DECODER_UNAVAILABLE');}
  const image=sharp(bytes,{limitInputPixels:PHOTO_MAX_PIXELS,failOn:'warning',sequentialRead:true});
  try{
    const {width,height,format:decodedFormat,pages}=await image.metadata();
    if(!width||!height||width>8192||height>8192||width*height>PHOTO_MAX_PIXELS)throw Error('PHOTO_PIXEL_LIMIT');
    if(decodedFormat!==format||(pages??1)!==1)throw Error('PHOTO_FORMAT_REJECTED');
    // Decode every pixel before submitting the original bytes.
    await image.raw().toBuffer();
    return {bytes,format,width,height};
  }catch(error){
    if(error.message.startsWith('PHOTO_'))throw error;
    if(/pixel limit/i.test(error.message))throw Error('PHOTO_PIXEL_LIMIT');
    throw Error('PHOTO_CORRUPT');
  }
}
