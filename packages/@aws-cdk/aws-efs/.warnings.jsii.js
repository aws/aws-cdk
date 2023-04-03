function _aws_cdk_aws_efs_IAccessPoint(p) {
}
function _aws_cdk_aws_efs_Acl(p) {
}
function _aws_cdk_aws_efs_PosixUser(p) {
}
function _aws_cdk_aws_efs_AccessPointOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.createAcl))
            _aws_cdk_aws_efs_Acl(p.createAcl);
        if (!visitedObjects.has(p.posixUser))
            _aws_cdk_aws_efs_PosixUser(p.posixUser);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_efs_AccessPointProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.fileSystem))
            _aws_cdk_aws_efs_IFileSystem(p.fileSystem);
        if (!visitedObjects.has(p.createAcl))
            _aws_cdk_aws_efs_Acl(p.createAcl);
        if (!visitedObjects.has(p.posixUser))
            _aws_cdk_aws_efs_PosixUser(p.posixUser);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_efs_AccessPointAttributes(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.fileSystem))
            _aws_cdk_aws_efs_IFileSystem(p.fileSystem);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_efs_AccessPoint(p) {
}
function _aws_cdk_aws_efs_LifecyclePolicy(p) {
}
function _aws_cdk_aws_efs_OutOfInfrequentAccessPolicy(p) {
}
function _aws_cdk_aws_efs_PerformanceMode(p) {
}
function _aws_cdk_aws_efs_ThroughputMode(p) {
}
function _aws_cdk_aws_efs_IFileSystem(p) {
}
function _aws_cdk_aws_efs_FileSystemProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.lifecyclePolicy))
            _aws_cdk_aws_efs_LifecyclePolicy(p.lifecyclePolicy);
        if (!visitedObjects.has(p.outOfInfrequentAccessPolicy))
            _aws_cdk_aws_efs_OutOfInfrequentAccessPolicy(p.outOfInfrequentAccessPolicy);
        if (!visitedObjects.has(p.performanceMode))
            _aws_cdk_aws_efs_PerformanceMode(p.performanceMode);
        if (!visitedObjects.has(p.throughputMode))
            _aws_cdk_aws_efs_ThroughputMode(p.throughputMode);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_efs_FileSystemAttributes(p) {
}
function _aws_cdk_aws_efs_FileSystem(p) {
}
function _aws_cdk_aws_efs_CfnAccessPointProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.accessPointTags != null)
            for (const o of p.accessPointTags)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_efs_CfnAccessPoint_AccessPointTagProperty(o);
        if (!visitedObjects.has(p.posixUser))
            _aws_cdk_aws_efs_CfnAccessPoint_PosixUserProperty(p.posixUser);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_efs_CfnAccessPoint(p) {
}
function _aws_cdk_aws_efs_CfnAccessPoint_AccessPointTagProperty(p) {
}
function _aws_cdk_aws_efs_CfnAccessPoint_CreationInfoProperty(p) {
}
function _aws_cdk_aws_efs_CfnAccessPoint_PosixUserProperty(p) {
}
function _aws_cdk_aws_efs_CfnAccessPoint_RootDirectoryProperty(p) {
}
function _aws_cdk_aws_efs_CfnFileSystemProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.fileSystemTags != null)
            for (const o of p.fileSystemTags)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_efs_CfnFileSystem_ElasticFileSystemTagProperty(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_efs_CfnFileSystem(p) {
}
function _aws_cdk_aws_efs_CfnFileSystem_BackupPolicyProperty(p) {
}
function _aws_cdk_aws_efs_CfnFileSystem_ElasticFileSystemTagProperty(p) {
}
function _aws_cdk_aws_efs_CfnFileSystem_LifecyclePolicyProperty(p) {
}
function _aws_cdk_aws_efs_CfnMountTargetProps(p) {
}
function _aws_cdk_aws_efs_CfnMountTarget(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_efs_IAccessPoint, _aws_cdk_aws_efs_Acl, _aws_cdk_aws_efs_PosixUser, _aws_cdk_aws_efs_AccessPointOptions, _aws_cdk_aws_efs_AccessPointProps, _aws_cdk_aws_efs_AccessPointAttributes, _aws_cdk_aws_efs_AccessPoint, _aws_cdk_aws_efs_LifecyclePolicy, _aws_cdk_aws_efs_OutOfInfrequentAccessPolicy, _aws_cdk_aws_efs_PerformanceMode, _aws_cdk_aws_efs_ThroughputMode, _aws_cdk_aws_efs_IFileSystem, _aws_cdk_aws_efs_FileSystemProps, _aws_cdk_aws_efs_FileSystemAttributes, _aws_cdk_aws_efs_FileSystem, _aws_cdk_aws_efs_CfnAccessPointProps, _aws_cdk_aws_efs_CfnAccessPoint, _aws_cdk_aws_efs_CfnAccessPoint_AccessPointTagProperty, _aws_cdk_aws_efs_CfnAccessPoint_CreationInfoProperty, _aws_cdk_aws_efs_CfnAccessPoint_PosixUserProperty, _aws_cdk_aws_efs_CfnAccessPoint_RootDirectoryProperty, _aws_cdk_aws_efs_CfnFileSystemProps, _aws_cdk_aws_efs_CfnFileSystem, _aws_cdk_aws_efs_CfnFileSystem_BackupPolicyProperty, _aws_cdk_aws_efs_CfnFileSystem_ElasticFileSystemTagProperty, _aws_cdk_aws_efs_CfnFileSystem_LifecyclePolicyProperty, _aws_cdk_aws_efs_CfnMountTargetProps, _aws_cdk_aws_efs_CfnMountTarget };
