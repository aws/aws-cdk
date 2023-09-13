import * as zlib from 'zlib';
import text from './parameter-types-base64.json';

export interface TypeCoercionMap {
  [service: string]: {
    [action: string]: string[]
  }
}

export interface TypeCoercionGroup {
  uint8ArrayParameters: TypeCoercionMap,
  numberParameters: TypeCoercionMap,
}

export async function typeCoercionMap(): Promise<TypeCoercionGroup> {
  const buffer = Buffer.from(text, 'base64');
  return new Promise((resolve, reject) => {
    zlib.gunzip(buffer, (gunzipError: Error | null, uncompressedData: Buffer) => {
      if (gunzipError != null) {
        reject(gunzipError);
      } else {
        resolve(JSON.parse(uncompressedData.toString()));
      }
    });
  });
}
