function _aws_cdk_aws_dynamodb_global_GlobalTableProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("regions" in p)
            print("@aws-cdk/aws-dynamodb-global.GlobalTableProps#regions", "");
        if ("tableName" in p)
            print("@aws-cdk/aws-dynamodb-global.GlobalTableProps#tableName", "");
        if ("serverSideEncryption" in p)
            print("@aws-cdk/aws-dynamodb.TableOptions#serverSideEncryption", "This property is deprecated. In order to obtain the same behavior as\nenabling this, set the `encryption` property to `TableEncryption.AWS_MANAGED` instead.");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_dynamodb_global_GlobalTable(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_dynamodb_global_GlobalTableProps, _aws_cdk_aws_dynamodb_global_GlobalTable };
