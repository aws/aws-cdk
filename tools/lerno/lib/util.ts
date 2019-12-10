import cp = require('child_process');

export function partition<A>(xs: A[], pred: (x: A) => boolean): [A[], A[]] {
  const ayes: A[] = [];
  const noes: A[] = [];

  for (const x of xs) {
    if (pred(x)) {
      ayes.push(x);
    } else {
      noes.push(x);
    }
  }

  return [ayes, noes];
}

export async function resolveMap<A>(xs: Record<string, Promise<A>>): Promise<Record<string, A>> {
  const keys = Object.keys(xs);
  const values = await Promise.all(keys.map(k => xs[k]));

  const ret: Record<string, A> = {};
  for (let i = 0; i < keys.length; i++) {
    ret[keys[i]] = values[i];
  }
  return ret;
}

export async function asyncMapValues<A, B>(xs: Record<string, A>, fn: (x: A, key: string) => Promise<B>): Promise<Record<string, B>> {
  const ret: Record<string, Promise<B>> = {};
  for (const [key, value] of Object.entries(xs)) {
    ret[key] = fn(value, key);
  }
  return resolveMap(ret);
}

export function sortedEntries<A>(xs: Record<string, A>): Array<[string, A]> {
  const es = Object.entries(xs);
  es.sort((a, b) => a[0].localeCompare(b[0]));
  return es;
}

export function sorted<A>(xs: A[]): A[] {
  xs.sort();
  return xs;
}

export async function spawnAndWait(cmdLine: string[], options: cp.SpawnOptions) {
  return new Promise((ok, ko) => {
    const stderr: string[] = [];
    const stdout: string[] = [];

    const proc = cp.spawn(cmdLine[0], cmdLine.slice(1), {
      ...options,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    proc.on('error', ko);
    proc.stderr.on('data', message => {
      stderr.push(message.toString('utf-8'));
    });
    proc.stdout.on('data', message => {
      stdout.push(message.toString('utf-8'));
    });
    proc.on('close', (code) => {
      if (code === 0) {
        ok();
      } else {
        ko(new Error(`Subprocess exited with code ${code}:\n${[...stdout, ...stderr].join('')}`));
      }
    });
  });
}

export class Latch {
  private readonly queuedPromises = new Array<() => void>();

  constructor(private n: number) {
  }

  public async withLatch<A>(block: () => Promise<A>): Promise<A> {
    await this.acquire();
    try {
      return await block();
    } finally {
      this.release();
    }
  }

  public acquire(): Promise<void> {
    if (this.n > 0) {
      this.n -= 1;
      return Promise.resolve();
    } else {
      return new Promise(ok => {
        this.queuedPromises.push(ok);
      });
    }
  }

  public release() {
    if (this.queuedPromises.length > 0) {
      const prom = this.queuedPromises.shift()!;
      prom();
    } else {
      this.n += 1;
    }
  }
}

export async function asyncFilter<A>(xs: A[], fn: (x: A) => Promise<boolean>): Promise<A[]> {
  const ret: A[] = [];
  for (const x of xs) {
    if (await fn(x)) {
      ret.push(x);
    }
  }
  return ret;
}