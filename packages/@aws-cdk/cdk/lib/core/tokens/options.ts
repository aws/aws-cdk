import { Token } from "./token";

/**
 * Function used to preprocess Tokens before resolving
 */
export type CollectFunc = (token: Token) => void;

/**
 * Global options for resolve()
 *
 * Because there are many independent calls to resolve(), some losing context,
 * we cannot simply pass through options at each individual call. Instead,
 * we configure global context at the stack synthesis level.
 */
export class ResolveConfiguration {
  private readonly options = new Array<ResolveOptions>();

  public push(options: ResolveOptions): IOptionsContext {
    this.options.push(options);

    return {
      pop: () => {
        if (this.options.length === 0 || this.options[this.options.length - 1] !== options) {
          throw new Error('ResolveConfiguration push/pop mismatch');
        }
        this.options.pop();
      }
    };
  }

  public get collect(): CollectFunc | undefined {
    for (let i = this.options.length - 1; i >= 0; i--) {
      const ret = this.options[i].collect;
      if (ret !== undefined) { return ret; }
    }
    return undefined;
  }
}

interface IOptionsContext {
  pop(): void;
}

interface ResolveOptions {
  /**
   * What function to use to preprocess Tokens before resolving them
   */
  collect?: CollectFunc;
}

const glob = global as any;

/**
 * Singleton instance of resolver options
 */
export const RESOLVE_OPTIONS: ResolveConfiguration = glob.__cdkResolveOptions = glob.__cdkResolveOptions || new ResolveConfiguration();
