/* eslint-disable no-console */

export function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`The environment variable "${name}" is not defined`);
  }
  return value;
}

export function log(title: any, ...args: any[]) {
  console.log('[provider-framework]', title, ...args.map(x => typeof(x) === 'object' ? JSON.stringify(x, undefined, 2) : x));
}

export interface RetryOptions {
  /** How many retries (will at least try once) */
  readonly attempts: number;
  /** Sleep base, in ms */
  readonly sleep: number;
}

export function withRetries<A extends Array<any>, B>(options: RetryOptions, fn: (...xs: A) => Promise<B>): (...xs: A) => Promise<B> {
  return async (...xs: A) => {
    let attempts = options.attempts;
    let ms = options.sleep;
    while (true) {
      try {
        return await fn(...xs);
      } catch (e) {
        if (attempts-- <= 0) {
          throw e;
        }
        await sleep(Math.floor(Math.random() * ms));
        ms *= 2;
      }
    }
  };
}

async function sleep(ms: number): Promise<void> {
  return new Promise((ok) => setTimeout(ok, ms));
}