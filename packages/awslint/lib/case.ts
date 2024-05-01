import * as changeCase from 'change-case';

function cachedTransform(transform: (x: string) => string): (x: string) => string {
  const CACHE = new Map<string, string>();
  return (x) => {
    const prev = CACHE.get(x);
    if (prev) {
      return prev;
    }

    const transformed = transform(x);
    CACHE.set(x, transformed);
    return transformed;
  };
}

export const camelize = cachedTransform((x: string) => changeCase.camelCase(x));
export const pascalize = cachedTransform((x: string) => changeCase.pascalCase(x));
