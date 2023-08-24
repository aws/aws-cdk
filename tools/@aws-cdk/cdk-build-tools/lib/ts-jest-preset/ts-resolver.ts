import type { ResolverOptions } from 'jest-resolve';

/**
 * Resolver that prefers `.ts` file to a `.js` file if both are present
 */
function resolver(p: string, options: ResolverOptions): string {
  const defaultResolve = options.defaultResolver;

  // eslint-disable-next-line no-console
  console.log(p, options);

  const defaultResolution = defaultResolve(p, options);

  let preferredResolution: string | undefined;
  if (defaultResolution.endsWith('.js')) {
    preferredResolution = tryResolve(p.replace(/\.js$/, '.ts'));
  }
  // eslint-disable-next-line no-console
  console.log(preferredResolution, defaultResolution);
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

module.exports = resolver;