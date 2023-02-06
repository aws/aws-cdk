/**
 * Routines for corking stdout and stderr
 */
import * as stream from 'stream';

export class MemoryStream extends stream.Writable {
  private parts = new Array<Buffer>();

  public _write(chunk: Buffer, _encoding: string, callback: (error?: Error | null) => void): void {
    this.parts.push(chunk);
    callback();
  }

  public buffer() {
    return Buffer.concat(this.parts);
  }

  public clear() {
    this.parts.splice(0, this.parts.length);
  }

  public async flushTo(strm: NodeJS.WritableStream) {
    const flushed = strm.write(this.buffer());
    if (!flushed) {
      return new Promise(ok => strm.once('drain', ok));
    }
  }

  public toString() {
    return this.buffer().toString();
  }
}
