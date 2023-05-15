import { Stack } from 'aws-cdk-lib';
import { IStagingResources, IStagingResourcesFactory, ObtainStagingResourcesContext } from './staging-stack';
/**
 * Wraps another IStagingResources factory, and caches the result on a per-environment basis.
 */
export declare class PerEnvironmentStagingFactory implements IStagingResourcesFactory {
    private readonly wrapped;
    constructor(wrapped: IStagingResourcesFactory);
    obtainStagingResources(stack: Stack, context: ObtainStagingResourcesContext): IStagingResources;
}
