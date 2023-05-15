function _aws_cdk_app_staging_synthesizer_DefaultStagingStackOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.fileAssetPublishingRole))
            _aws_cdk_app_staging_synthesizer_BootstrapRole(p.fileAssetPublishingRole);
        if (!visitedObjects.has(p.imageAssetPublishingRole))
            _aws_cdk_app_staging_synthesizer_BootstrapRole(p.imageAssetPublishingRole);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_app_staging_synthesizer_DefaultStagingStackProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.fileAssetPublishingRole))
            _aws_cdk_app_staging_synthesizer_BootstrapRole(p.fileAssetPublishingRole);
        if (!visitedObjects.has(p.imageAssetPublishingRole))
            _aws_cdk_app_staging_synthesizer_BootstrapRole(p.imageAssetPublishingRole);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_app_staging_synthesizer_DefaultStagingStack(p) {
}
function _aws_cdk_app_staging_synthesizer_AppStagingSynthesizerOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.deploymentRoles))
            _aws_cdk_app_staging_synthesizer_BootstrapRoles(p.deploymentRoles);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_app_staging_synthesizer_DefaultResourcesOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.deploymentRoles))
            _aws_cdk_app_staging_synthesizer_BootstrapRoles(p.deploymentRoles);
        if (!visitedObjects.has(p.fileAssetPublishingRole))
            _aws_cdk_app_staging_synthesizer_BootstrapRole(p.fileAssetPublishingRole);
        if (!visitedObjects.has(p.imageAssetPublishingRole))
            _aws_cdk_app_staging_synthesizer_BootstrapRole(p.imageAssetPublishingRole);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_app_staging_synthesizer_CustomFactoryOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.factory))
            _aws_cdk_app_staging_synthesizer_IStagingStackFactory(p.factory);
        if (!visitedObjects.has(p.deploymentRoles))
            _aws_cdk_app_staging_synthesizer_BootstrapRoles(p.deploymentRoles);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_app_staging_synthesizer_CustomResourcesOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.resources))
            _aws_cdk_app_staging_synthesizer_IStagingStack(p.resources);
        if (!visitedObjects.has(p.deploymentRoles))
            _aws_cdk_app_staging_synthesizer_BootstrapRoles(p.deploymentRoles);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_app_staging_synthesizer_AppStagingSynthesizer(p) {
}
function _aws_cdk_app_staging_synthesizer_BootstrapRole(p) {
}
function _aws_cdk_app_staging_synthesizer_BootstrapRoles(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cloudFormationExecutionRole))
            _aws_cdk_app_staging_synthesizer_BootstrapRole(p.cloudFormationExecutionRole);
        if (!visitedObjects.has(p.deploymentRole))
            _aws_cdk_app_staging_synthesizer_BootstrapRole(p.deploymentRole);
        if (!visitedObjects.has(p.lookupRole))
            _aws_cdk_app_staging_synthesizer_BootstrapRole(p.lookupRole);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_app_staging_synthesizer_StagingRoles(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.dockerAssetPublishingRole))
            _aws_cdk_app_staging_synthesizer_BootstrapRole(p.dockerAssetPublishingRole);
        if (!visitedObjects.has(p.fileAssetPublishingRole))
            _aws_cdk_app_staging_synthesizer_BootstrapRole(p.fileAssetPublishingRole);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_app_staging_synthesizer_FileStagingLocation(p) {
}
function _aws_cdk_app_staging_synthesizer_ImageStagingLocation(p) {
}
function _aws_cdk_app_staging_synthesizer_IStagingStack(p) {
}
function _aws_cdk_app_staging_synthesizer_IStagingStackFactory(p) {
}
function _aws_cdk_app_staging_synthesizer_ObtainStagingResourcesContext(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_app_staging_synthesizer_DefaultStagingStackOptions, _aws_cdk_app_staging_synthesizer_DefaultStagingStackProps, _aws_cdk_app_staging_synthesizer_DefaultStagingStack, _aws_cdk_app_staging_synthesizer_AppStagingSynthesizerOptions, _aws_cdk_app_staging_synthesizer_DefaultResourcesOptions, _aws_cdk_app_staging_synthesizer_CustomFactoryOptions, _aws_cdk_app_staging_synthesizer_CustomResourcesOptions, _aws_cdk_app_staging_synthesizer_AppStagingSynthesizer, _aws_cdk_app_staging_synthesizer_BootstrapRole, _aws_cdk_app_staging_synthesizer_BootstrapRoles, _aws_cdk_app_staging_synthesizer_StagingRoles, _aws_cdk_app_staging_synthesizer_FileStagingLocation, _aws_cdk_app_staging_synthesizer_ImageStagingLocation, _aws_cdk_app_staging_synthesizer_IStagingStack, _aws_cdk_app_staging_synthesizer_IStagingStackFactory, _aws_cdk_app_staging_synthesizer_ObtainStagingResourcesContext };
