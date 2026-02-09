export * from './legacy-moved';

// The modules below define values that the CLI can pass to the CDK framework
// to control its behavior.
export * from './cxapi';
export * from './features';
export * from './app';

/**
 * Metadata key for Docker build contexts.
 */
export const ASSET_RESOURCE_METADATA_DOCKER_BUILD_CONTEXTS_KEY = 'aws:asset:docker-build-contexts';
