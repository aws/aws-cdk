function _aws_cdk_aws_ecr_assets_NetworkMode(p) {
}
function _aws_cdk_aws_ecr_assets_Platform(p) {
}
function _aws_cdk_aws_ecr_assets_DockerImageAssetInvalidationOptions(p) {
}
function _aws_cdk_aws_ecr_assets_DockerCacheOption(p) {
}
function _aws_cdk_aws_ecr_assets_DockerImageAssetOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.cacheFrom != null)
            for (const o of p.cacheFrom)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecr_assets_DockerCacheOption(o);
        if (!visitedObjects.has(p.cacheTo))
            _aws_cdk_aws_ecr_assets_DockerCacheOption(p.cacheTo);
        if (!visitedObjects.has(p.invalidation))
            _aws_cdk_aws_ecr_assets_DockerImageAssetInvalidationOptions(p.invalidation);
        if (!visitedObjects.has(p.networkMode))
            _aws_cdk_aws_ecr_assets_NetworkMode(p.networkMode);
        if (!visitedObjects.has(p.platform))
            _aws_cdk_aws_ecr_assets_Platform(p.platform);
        if ("repositoryName" in p)
            print("@aws-cdk/aws-ecr-assets.DockerImageAssetOptions#repositoryName", "to control the location of docker image assets, please override\n`Stack.addDockerImageAsset`. this feature will be removed in future\nreleases.");
        if ("follow" in p)
            print("@aws-cdk/assets.CopyOptions#follow", "use `followSymlinks` instead");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecr_assets_DockerImageAssetProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.cacheFrom != null)
            for (const o of p.cacheFrom)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_ecr_assets_DockerCacheOption(o);
        if (!visitedObjects.has(p.cacheTo))
            _aws_cdk_aws_ecr_assets_DockerCacheOption(p.cacheTo);
        if (!visitedObjects.has(p.invalidation))
            _aws_cdk_aws_ecr_assets_DockerImageAssetInvalidationOptions(p.invalidation);
        if (!visitedObjects.has(p.networkMode))
            _aws_cdk_aws_ecr_assets_NetworkMode(p.networkMode);
        if (!visitedObjects.has(p.platform))
            _aws_cdk_aws_ecr_assets_Platform(p.platform);
        if ("repositoryName" in p)
            print("@aws-cdk/aws-ecr-assets.DockerImageAssetOptions#repositoryName", "to control the location of docker image assets, please override\n`Stack.addDockerImageAsset`. this feature will be removed in future\nreleases.");
        if ("follow" in p)
            print("@aws-cdk/assets.CopyOptions#follow", "use `followSymlinks` instead");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_ecr_assets_DockerImageAsset(p) {
}
function _aws_cdk_aws_ecr_assets_TarballImageAssetProps(p) {
}
function _aws_cdk_aws_ecr_assets_TarballImageAsset(p) {
}
function print(name, deprecationMessage) {
    const deprecated = process.env.JSII_DEPRECATED;
    const deprecationMode = ["warn", "fail", "quiet"].includes(deprecated) ? deprecated : "warn";
    const message = `${name} is deprecated.\n  ${deprecationMessage.trim()}\n  This API will be removed in the next major release.`;
    switch (deprecationMode) {
        case "fail":
            throw new DeprecationError(message);
        case "warn":
            console.warn("[WARNING]", message);
            break;
    }
}
function getPropertyDescriptor(obj, prop) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
    if (descriptor) {
        return descriptor;
    }
    const proto = Object.getPrototypeOf(obj);
    const prototypeDescriptor = proto && getPropertyDescriptor(proto, prop);
    if (prototypeDescriptor) {
        return prototypeDescriptor;
    }
    return {};
}
const visitedObjects = new Set();
class DeprecationError extends Error {
    constructor(...args) {
        super(...args);
        Object.defineProperty(this, "name", {
            configurable: false,
            enumerable: true,
            value: "DeprecationError",
            writable: false,
        });
    }
}
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_ecr_assets_NetworkMode, _aws_cdk_aws_ecr_assets_Platform, _aws_cdk_aws_ecr_assets_DockerImageAssetInvalidationOptions, _aws_cdk_aws_ecr_assets_DockerCacheOption, _aws_cdk_aws_ecr_assets_DockerImageAssetOptions, _aws_cdk_aws_ecr_assets_DockerImageAssetProps, _aws_cdk_aws_ecr_assets_DockerImageAsset, _aws_cdk_aws_ecr_assets_TarballImageAssetProps, _aws_cdk_aws_ecr_assets_TarballImageAsset };
