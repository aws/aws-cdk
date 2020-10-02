import * as crypto from 'crypto';

export class RecordCache<K extends {}, V> {
  private records: { [key: string]: V } = {};

  public pushRecord(key: K, value: V): void {
    this.records[hashed(key)] = value;
  }
  
  public getRecord(key: K): V | undefined {
    return this.records[hashed(key)];
  }
}

function hashed(key: {}): string {
  const hash = crypto.createHash('md5');
  hash.update(JSON.stringify(key));
  return hash.digest('hex');
}