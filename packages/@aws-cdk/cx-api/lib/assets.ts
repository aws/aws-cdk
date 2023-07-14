/**
 * If this is set in the context, the aws:asset:xxx metadata entries will not be
 * added to the template. This is used, for example, when we run integrationt
 * tests.
 */
export const ASSET_RESOURCE_METADATA_ENABLED_CONTEXT = 'aws:cdk:enable-asset-metadata';

/**
 * Metadata added to the CloudFormation template entries that map local assets
 * to resources.
 */
export const ASSET_RESOURCE_METADATA_PATH_KEY = 'aws:asset:path';
export const ASSET_RESOURCE_METADATA_DOCKERFILE_PATH_KEY = 'aws:asset:dockerfile-path';
export const ASSET_RESOURCE_METADATA_DOCKER_BUILD_ARGS_KEY = 'aws:asset:docker-build-args';
export const ASSET_RESOURCE_METADATA_DOCKER_BUILD_SECRETS_KEY = 'aws:asset:docker-build-secrets';
export const ASSET_RESOURCE_METADATA_DOCKER_BUILD_TARGET_KEY = 'aws:asset:docker-build-target';
export const ASSET_RESOURCE_METADATA_PROPERTY_KEY = 'aws:asset:property';
export const ASSET_RESOURCE_METADATA_IS_BUNDLED_KEY = 'aws:asset:is-bundled';
export const ASSET_RESOURCE_METADATA_DOCKER_OUTPUTS_KEY = 'aws:asset:docker-outputs';
export const ASSET_RESOURCE_METADATA_DOCKER_CACHE_FROM_KEY = 'aws:asset:docker-cache-from';
export const ASSET_RESOURCE_METADATA_DOCKER_CACHE_TO_KEY = 'aws:asset:docker-cache-to';

/**
 * Separator string that separates the prefix separator from the object key separator.
 *
 * Asset keys will look like:
 *
 *    /assets/MyConstruct12345678/||abcdef12345.zip
 *
 * This allows us to encode both the prefix and the full location in a single
 * CloudFormation Template Parameter.
 */
export const ASSET_PREFIX_SEPARATOR = '||';
