import { EventEmitter } from 'events';

export type Output = ReadonlyArray<string>;
export type OutputCallback = (output: Output) => void;
export type NoOutputCallback = () => void;
export type Restore = () => void;

export interface Options {
  isTTY?: boolean;
}

export interface Inspector {
  output: Output;
  restore: Restore;
}

class TestStream {
  private _stream: NodeJS.WriteStream;
  private _options?: Options

  constructor(stream: NodeJS.WriteStream, options?: Options) {
    this._stream = stream;
    this._options = options;
  }

  inspect(): Inspector {
    let isTTY;
    if (this._options && this._options.isTTY !== undefined) {
      isTTY = this._options.isTTY;
    }

    const output: string[] = [];
    const stream = this._stream;
    const res: EventEmitter & Partial<Inspector> = new EventEmitter();

    const originalWrite = stream.write;
    stream.write = (string: string) => {
      output.push(string);
      return res.emit('data', string);
    };

    const originalIsTTY = stream.isTTY;
    if (isTTY === true) {
      stream.isTTY = isTTY;
    }

    res.output = output;
    res.restore = () => {
      stream.write = originalWrite;
      stream.isTTY = originalIsTTY;
    };
    return (res as Inspector);
  }

  inspectSync(fn: OutputCallback): Output {
    const inspect = this.inspect();
    try {
      fn(inspect.output);
    } finally {
      inspect.restore();
    }
    return inspect.output;
  }

}

export const stdout = new TestStream(process.stdout);
export const stderr = new TestStream(process.stderr);
