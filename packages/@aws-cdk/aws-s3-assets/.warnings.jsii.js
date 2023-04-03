function _aws_cdk_aws_s3_assets_AssetOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.readers != null)
            for (const o of p.readers)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-iam/.warnings.jsii.js")._aws_cdk_aws_iam_IGrantable(o);
        if ("sourceHash" in p)
            print("@aws-cdk/aws-s3-assets.AssetOptions#sourceHash", "see `assetHash` and `assetHashType`");
        if ("follow" in p)
            print("@aws-cdk/assets.CopyOptions#follow", "use `followSymlinks` instead");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_s3_assets_AssetProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.readers != null)
            for (const o of p.readers)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-iam/.warnings.jsii.js")._aws_cdk_aws_iam_IGrantable(o);
        if ("sourceHash" in p)
            print("@aws-cdk/aws-s3-assets.AssetOptions#sourceHash", "see `assetHash` and `assetHashType`");
        if ("follow" in p)
            print("@aws-cdk/assets.CopyOptions#follow", "use `followSymlinks` instead");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_s3_assets_Asset(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_s3_assets_AssetOptions, _aws_cdk_aws_s3_assets_AssetProps, _aws_cdk_aws_s3_assets_Asset };
