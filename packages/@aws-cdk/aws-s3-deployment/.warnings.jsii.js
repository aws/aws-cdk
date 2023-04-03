function _aws_cdk_aws_s3_deployment_BucketDeploymentProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.sources != null)
            for (const o of p.sources)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_s3_deployment_ISource(o);
        if (p.cacheControl != null)
            for (const o of p.cacheControl)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_s3_deployment_CacheControl(o);
        if (!visitedObjects.has(p.metadata))
            _aws_cdk_aws_s3_deployment_UserDefinedObjectMetadata(p.metadata);
        if (!visitedObjects.has(p.serverSideEncryption))
            _aws_cdk_aws_s3_deployment_ServerSideEncryption(p.serverSideEncryption);
        if (!visitedObjects.has(p.storageClass))
            _aws_cdk_aws_s3_deployment_StorageClass(p.storageClass);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_s3_deployment_BucketDeployment(p) {
}
function _aws_cdk_aws_s3_deployment_CacheControl(p) {
}
function _aws_cdk_aws_s3_deployment_ServerSideEncryption(p) {
}
function _aws_cdk_aws_s3_deployment_StorageClass(p) {
}
function _aws_cdk_aws_s3_deployment_Expires(p) {
}
function _aws_cdk_aws_s3_deployment_UserDefinedObjectMetadata(p) {
}
function _aws_cdk_aws_s3_deployment_SourceConfig(p) {
}
function _aws_cdk_aws_s3_deployment_DeploymentSourceContext(p) {
}
function _aws_cdk_aws_s3_deployment_ISource(p) {
}
function _aws_cdk_aws_s3_deployment_Source(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_s3_deployment_BucketDeploymentProps, _aws_cdk_aws_s3_deployment_BucketDeployment, _aws_cdk_aws_s3_deployment_CacheControl, _aws_cdk_aws_s3_deployment_ServerSideEncryption, _aws_cdk_aws_s3_deployment_StorageClass, _aws_cdk_aws_s3_deployment_Expires, _aws_cdk_aws_s3_deployment_UserDefinedObjectMetadata, _aws_cdk_aws_s3_deployment_SourceConfig, _aws_cdk_aws_s3_deployment_DeploymentSourceContext, _aws_cdk_aws_s3_deployment_ISource, _aws_cdk_aws_s3_deployment_Source };
