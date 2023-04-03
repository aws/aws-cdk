function _aws_cdk_assets_IAsset(p) {
}
function _aws_cdk_assets_FollowMode(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        print("@aws-cdk/assets.FollowMode", "see `core.SymlinkFollowMode`");
        const ns = require("./lib/fs/follow-mode.js");
        if (Object.values(ns.FollowMode).filter(x => x === p).length > 1)
            return;
        if (p === ns.FollowMode.NEVER)
            print("@aws-cdk/assets.FollowMode#NEVER", "");
        if (p === ns.FollowMode.ALWAYS)
            print("@aws-cdk/assets.FollowMode#ALWAYS", "");
        if (p === ns.FollowMode.EXTERNAL)
            print("@aws-cdk/assets.FollowMode#EXTERNAL", "");
        if (p === ns.FollowMode.BLOCK_EXTERNAL)
            print("@aws-cdk/assets.FollowMode#BLOCK_EXTERNAL", "");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_assets_CopyOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("exclude" in p)
            print("@aws-cdk/assets.CopyOptions#exclude", "see `core.CopyOptions`");
        if ("follow" in p)
            print("@aws-cdk/assets.CopyOptions#follow", "use `followSymlinks` instead");
        if (!visitedObjects.has(p.follow))
            _aws_cdk_assets_FollowMode(p.follow);
        if ("ignoreMode" in p)
            print("@aws-cdk/assets.CopyOptions#ignoreMode", "see `core.CopyOptions`");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_assets_FingerprintOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("extraHash" in p)
            print("@aws-cdk/assets.FingerprintOptions#extraHash", "see `core.FingerprintOptions`");
        if ("exclude" in p)
            print("@aws-cdk/assets.CopyOptions#exclude", "see `core.CopyOptions`");
        if ("follow" in p)
            print("@aws-cdk/assets.CopyOptions#follow", "use `followSymlinks` instead");
        if (!visitedObjects.has(p.follow))
            _aws_cdk_assets_FollowMode(p.follow);
        if ("ignoreMode" in p)
            print("@aws-cdk/assets.CopyOptions#ignoreMode", "see `core.CopyOptions`");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_assets_StagingProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("sourcePath" in p)
            print("@aws-cdk/assets.StagingProps#sourcePath", "use `core.AssetStagingProps`");
        if ("extraHash" in p)
            print("@aws-cdk/assets.FingerprintOptions#extraHash", "see `core.FingerprintOptions`");
        if ("exclude" in p)
            print("@aws-cdk/assets.CopyOptions#exclude", "see `core.CopyOptions`");
        if ("follow" in p)
            print("@aws-cdk/assets.CopyOptions#follow", "use `followSymlinks` instead");
        if (!visitedObjects.has(p.follow))
            _aws_cdk_assets_FollowMode(p.follow);
        if ("ignoreMode" in p)
            print("@aws-cdk/assets.CopyOptions#ignoreMode", "see `core.CopyOptions`");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_assets_Staging(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_assets_IAsset, _aws_cdk_assets_FollowMode, _aws_cdk_assets_CopyOptions, _aws_cdk_assets_FingerprintOptions, _aws_cdk_assets_StagingProps, _aws_cdk_assets_Staging };
