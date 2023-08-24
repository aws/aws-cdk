import type { ResolverOptions } from 'jest-resolve';

/**
 * Resolver that prefers `.ts` file to a `.js` file if both are present
 */
export default function resolver(p: string, options: ResolverOptions): string {
  const defaultResolve = options.defaultResolver;

  const defaultResolution = defaultResolve(p, options);

  let preferredResolution: string | undefined;
  if (defaultResolution.endsWith('.js')) {
    preferredResolution = tryResolve(p.replace(/\.js$/, '.ts'));
  }
  return preferredResolution ?? defaultResolution;

  /**
   * Use the default resolver, catching any exception that might be thrown
   */
  function tryResolve(x: string): string | undefined {
    try {
      return defaultResolve(x, options);
    } catch (e: any) {
      return undefined;
    }
  }
}