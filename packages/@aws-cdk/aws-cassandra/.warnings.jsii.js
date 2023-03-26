function _aws_cdk_aws_cassandra_CfnKeyspaceProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cassandra_CfnKeyspace(p) {
}
function _aws_cdk_aws_cassandra_CfnTableProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cassandra_CfnTable(p) {
}
function _aws_cdk_aws_cassandra_CfnTable_BillingModeProperty(p) {
}
function _aws_cdk_aws_cassandra_CfnTable_ClusteringKeyColumnProperty(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.column))
            _aws_cdk_aws_cassandra_CfnTable_ColumnProperty(p.column);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_cassandra_CfnTable_ColumnProperty(p) {
}
function _aws_cdk_aws_cassandra_CfnTable_EncryptionSpecificationProperty(p) {
}
function _aws_cdk_aws_cassandra_CfnTable_ProvisionedThroughputProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_cassandra_CfnKeyspaceProps, _aws_cdk_aws_cassandra_CfnKeyspace, _aws_cdk_aws_cassandra_CfnTableProps, _aws_cdk_aws_cassandra_CfnTable, _aws_cdk_aws_cassandra_CfnTable_BillingModeProperty, _aws_cdk_aws_cassandra_CfnTable_ClusteringKeyColumnProperty, _aws_cdk_aws_cassandra_CfnTable_ColumnProperty, _aws_cdk_aws_cassandra_CfnTable_EncryptionSpecificationProperty, _aws_cdk_aws_cassandra_CfnTable_ProvisionedThroughputProperty };
