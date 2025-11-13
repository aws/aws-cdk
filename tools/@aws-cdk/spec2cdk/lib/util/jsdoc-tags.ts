import { DocsSpec, Stability } from '@cdklabs/typewriter';

/**
 * Compute stability taking into account deprecation status.
 */
export function stability(isDeprecated: boolean = false, defaultStability: Stability = Stability.External): Stability {
  if (isDeprecated) {
    return Stability.Deprecated;
  }
  return defaultStability;
}

/**
 * Returns deprecation props if deprecated.
 */
export function maybeDeprecated(deprecationNotice?: string, defaultStability: Stability = Stability.External): Pick<DocsSpec, 'deprecated' | 'stability'> {
  if (deprecationNotice) {
    return {
      deprecated: deprecationNotice,
      stability: stability(Boolean(deprecationNotice), defaultStability),
    };
  }

  return {};
}
