import { Stack } from 'aws-cdk-lib';
import { AppScopedGlobal } from './private/app-global';
import { IStagingStack, IStagingStackFactory, ObtainStagingResourcesContext } from './staging-stack';

/**
 * Per-environment cache
 *
 * This is a global because we might have multiple instances of this class
 * in the app, but we want to cache across all of them.
 */
const ENVIRONMENT_CACHE = new AppScopedGlobal(() => new Map<string, IStagingStack>());

/**
 * Wraps another IStagingStack factory, and caches the result on a per-environment basis
 */
export class PerEnvironmenStagingFactory implements IStagingStackFactory {
  constructor(private readonly wrapped: IStagingStackFactory) { }

  public obtainStagingResources(stack: Stack, context: ObtainStagingResourcesContext): IStagingStack {
    const cacheKey = context.environmentString;

    const cache = ENVIRONMENT_CACHE.for(stack);
    const existing = cache.get(cacheKey);
    if (existing) {
      return existing;
    }

    const result = this.wrapped.obtainStagingResources(stack, context);
    cache.set(cacheKey, result);
    return result;
  }
}