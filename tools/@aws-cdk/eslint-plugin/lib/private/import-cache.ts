import * as crypto from 'crypto';

export interface ImportCacheKey {
  readonly fileName: string;
  readonly typeName: string;
}

// `node` is a type from @typescript-eslint/typescript-estree, but using 'any' for now
// since it's incompatible with eslint.Rule namespace. Waiting for better compatibility in
// https://github.com/typescript-eslint/typescript-eslint/tree/1765a178e456b152bd48192eb5db7e8541e2adf2/packages/experimental-utils#note
export type Node = any;

export interface ImportCacheRecord extends ImportCacheKey {
  readonly importNode: Node;
  readonly localName: string
}

export class ImportCache {
  private records: { [key: string]: ImportCacheRecord } = {};

  public record(record: ImportCacheRecord): void {
    const key: ImportCacheKey = {
      fileName: record.fileName,
      typeName: record.typeName,
    };
    this.records[hashed(key)] = record;
  }
  
  public find(key: ImportCacheKey): ImportCacheRecord | undefined {
    return this.records[hashed(key)];
  }

  public get imports(): ImportCacheRecord[] {
    return Object.values(this.records);
  }
}

function hashed(key: {}): string {
  const hash = crypto.createHash('md5');
  hash.update(JSON.stringify(key));
  return hash.digest('hex');
}