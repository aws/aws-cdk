function _aws_cdk_aws_dms_CfnCertificateProps(p) {
}
function _aws_cdk_aws_dms_CfnCertificate(p) {
}
function _aws_cdk_aws_dms_CfnEndpointProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.docDbSettings))
            _aws_cdk_aws_dms_CfnEndpoint_DocDbSettingsProperty(p.docDbSettings);
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_dms_CfnEndpoint(p) {
}
function _aws_cdk_aws_dms_CfnEndpoint_DocDbSettingsProperty(p) {
}
function _aws_cdk_aws_dms_CfnEndpoint_DynamoDbSettingsProperty(p) {
}
function _aws_cdk_aws_dms_CfnEndpoint_ElasticsearchSettingsProperty(p) {
}
function _aws_cdk_aws_dms_CfnEndpoint_GcpMySQLSettingsProperty(p) {
}
function _aws_cdk_aws_dms_CfnEndpoint_IbmDb2SettingsProperty(p) {
}
function _aws_cdk_aws_dms_CfnEndpoint_KafkaSettingsProperty(p) {
}
function _aws_cdk_aws_dms_CfnEndpoint_KinesisSettingsProperty(p) {
}
function _aws_cdk_aws_dms_CfnEndpoint_MicrosoftSqlServerSettingsProperty(p) {
}
function _aws_cdk_aws_dms_CfnEndpoint_MongoDbSettingsProperty(p) {
}
function _aws_cdk_aws_dms_CfnEndpoint_MySqlSettingsProperty(p) {
}
function _aws_cdk_aws_dms_CfnEndpoint_NeptuneSettingsProperty(p) {
}
function _aws_cdk_aws_dms_CfnEndpoint_OracleSettingsProperty(p) {
}
function _aws_cdk_aws_dms_CfnEndpoint_PostgreSqlSettingsProperty(p) {
}
function _aws_cdk_aws_dms_CfnEndpoint_RedisSettingsProperty(p) {
}
function _aws_cdk_aws_dms_CfnEndpoint_RedshiftSettingsProperty(p) {
}
function _aws_cdk_aws_dms_CfnEndpoint_S3SettingsProperty(p) {
}
function _aws_cdk_aws_dms_CfnEndpoint_SybaseSettingsProperty(p) {
}
function _aws_cdk_aws_dms_CfnEventSubscriptionProps(p) {
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
function _aws_cdk_aws_dms_CfnEventSubscription(p) {
}
function _aws_cdk_aws_dms_CfnReplicationInstanceProps(p) {
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
function _aws_cdk_aws_dms_CfnReplicationInstance(p) {
}
function _aws_cdk_aws_dms_CfnReplicationSubnetGroupProps(p) {
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
function _aws_cdk_aws_dms_CfnReplicationSubnetGroup(p) {
}
function _aws_cdk_aws_dms_CfnReplicationTaskProps(p) {
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
function _aws_cdk_aws_dms_CfnReplicationTask(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_dms_CfnCertificateProps, _aws_cdk_aws_dms_CfnCertificate, _aws_cdk_aws_dms_CfnEndpointProps, _aws_cdk_aws_dms_CfnEndpoint, _aws_cdk_aws_dms_CfnEndpoint_DocDbSettingsProperty, _aws_cdk_aws_dms_CfnEndpoint_DynamoDbSettingsProperty, _aws_cdk_aws_dms_CfnEndpoint_ElasticsearchSettingsProperty, _aws_cdk_aws_dms_CfnEndpoint_GcpMySQLSettingsProperty, _aws_cdk_aws_dms_CfnEndpoint_IbmDb2SettingsProperty, _aws_cdk_aws_dms_CfnEndpoint_KafkaSettingsProperty, _aws_cdk_aws_dms_CfnEndpoint_KinesisSettingsProperty, _aws_cdk_aws_dms_CfnEndpoint_MicrosoftSqlServerSettingsProperty, _aws_cdk_aws_dms_CfnEndpoint_MongoDbSettingsProperty, _aws_cdk_aws_dms_CfnEndpoint_MySqlSettingsProperty, _aws_cdk_aws_dms_CfnEndpoint_NeptuneSettingsProperty, _aws_cdk_aws_dms_CfnEndpoint_OracleSettingsProperty, _aws_cdk_aws_dms_CfnEndpoint_PostgreSqlSettingsProperty, _aws_cdk_aws_dms_CfnEndpoint_RedisSettingsProperty, _aws_cdk_aws_dms_CfnEndpoint_RedshiftSettingsProperty, _aws_cdk_aws_dms_CfnEndpoint_S3SettingsProperty, _aws_cdk_aws_dms_CfnEndpoint_SybaseSettingsProperty, _aws_cdk_aws_dms_CfnEventSubscriptionProps, _aws_cdk_aws_dms_CfnEventSubscription, _aws_cdk_aws_dms_CfnReplicationInstanceProps, _aws_cdk_aws_dms_CfnReplicationInstance, _aws_cdk_aws_dms_CfnReplicationSubnetGroupProps, _aws_cdk_aws_dms_CfnReplicationSubnetGroup, _aws_cdk_aws_dms_CfnReplicationTaskProps, _aws_cdk_aws_dms_CfnReplicationTask };
