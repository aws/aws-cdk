function _aws_cdk_aws_logs_CrossAccountDestinationProps(p) {
}
function _aws_cdk_aws_logs_CrossAccountDestination(p) {
}
function _aws_cdk_aws_logs_ILogGroup(p) {
}
function _aws_cdk_aws_logs_RetentionDays(p) {
}
function _aws_cdk_aws_logs_LogGroupProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.retention))
            _aws_cdk_aws_logs_RetentionDays(p.retention);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_logs_LogGroup(p) {
}
function _aws_cdk_aws_logs_StreamOptions(p) {
}
function _aws_cdk_aws_logs_SubscriptionFilterOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.destination))
            _aws_cdk_aws_logs_ILogSubscriptionDestination(p.destination);
        if (!visitedObjects.has(p.filterPattern))
            _aws_cdk_aws_logs_IFilterPattern(p.filterPattern);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_logs_MetricFilterOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.filterPattern))
            _aws_cdk_aws_logs_IFilterPattern(p.filterPattern);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_logs_ILogStream(p) {
}
function _aws_cdk_aws_logs_LogStreamProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.logGroup))
            _aws_cdk_aws_logs_ILogGroup(p.logGroup);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_logs_LogStream(p) {
}
function _aws_cdk_aws_logs_MetricFilterProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.logGroup))
            _aws_cdk_aws_logs_ILogGroup(p.logGroup);
        if (!visitedObjects.has(p.filterPattern))
            _aws_cdk_aws_logs_IFilterPattern(p.filterPattern);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_logs_MetricFilter(p) {
}
function _aws_cdk_aws_logs_IFilterPattern(p) {
}
function _aws_cdk_aws_logs_JsonPattern(p) {
}
function _aws_cdk_aws_logs_FilterPattern(p) {
}
function _aws_cdk_aws_logs_SpaceDelimitedTextPattern(p) {
}
function _aws_cdk_aws_logs_ColumnRestriction(p) {
}
function _aws_cdk_aws_logs_ILogSubscriptionDestination(p) {
}
function _aws_cdk_aws_logs_LogSubscriptionDestinationConfig(p) {
}
function _aws_cdk_aws_logs_SubscriptionFilterProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.logGroup))
            _aws_cdk_aws_logs_ILogGroup(p.logGroup);
        if (!visitedObjects.has(p.destination))
            _aws_cdk_aws_logs_ILogSubscriptionDestination(p.destination);
        if (!visitedObjects.has(p.filterPattern))
            _aws_cdk_aws_logs_IFilterPattern(p.filterPattern);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_logs_SubscriptionFilter(p) {
}
function _aws_cdk_aws_logs_LogRetentionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.retention))
            _aws_cdk_aws_logs_RetentionDays(p.retention);
        if (!visitedObjects.has(p.logRetentionRetryOptions))
            _aws_cdk_aws_logs_LogRetentionRetryOptions(p.logRetentionRetryOptions);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_logs_LogRetentionRetryOptions(p) {
}
function _aws_cdk_aws_logs_LogRetention(p) {
}
function _aws_cdk_aws_logs_ResourcePolicyProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.policyStatements != null)
            for (const o of p.policyStatements)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-iam/.warnings.jsii.js")._aws_cdk_aws_iam_PolicyStatement(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_logs_ResourcePolicy(p) {
}
function _aws_cdk_aws_logs_QueryStringProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("filter" in p)
            print("@aws-cdk/aws-logs.QueryStringProps#filter", "Use `filterStatements` instead");
        if ("parse" in p)
            print("@aws-cdk/aws-logs.QueryStringProps#parse", "Use `parseStatements` instead");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_logs_QueryString(p) {
}
function _aws_cdk_aws_logs_QueryDefinitionProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.queryString))
            _aws_cdk_aws_logs_QueryString(p.queryString);
        if (p.logGroups != null)
            for (const o of p.logGroups)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_logs_ILogGroup(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_logs_QueryDefinition(p) {
}
function _aws_cdk_aws_logs_CfnDestinationProps(p) {
}
function _aws_cdk_aws_logs_CfnDestination(p) {
}
function _aws_cdk_aws_logs_CfnLogGroupProps(p) {
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
function _aws_cdk_aws_logs_CfnLogGroup(p) {
}
function _aws_cdk_aws_logs_CfnLogStreamProps(p) {
}
function _aws_cdk_aws_logs_CfnLogStream(p) {
}
function _aws_cdk_aws_logs_CfnMetricFilterProps(p) {
}
function _aws_cdk_aws_logs_CfnMetricFilter(p) {
}
function _aws_cdk_aws_logs_CfnMetricFilter_DimensionProperty(p) {
}
function _aws_cdk_aws_logs_CfnMetricFilter_MetricTransformationProperty(p) {
}
function _aws_cdk_aws_logs_CfnQueryDefinitionProps(p) {
}
function _aws_cdk_aws_logs_CfnQueryDefinition(p) {
}
function _aws_cdk_aws_logs_CfnResourcePolicyProps(p) {
}
function _aws_cdk_aws_logs_CfnResourcePolicy(p) {
}
function _aws_cdk_aws_logs_CfnSubscriptionFilterProps(p) {
}
function _aws_cdk_aws_logs_CfnSubscriptionFilter(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_logs_CrossAccountDestinationProps, _aws_cdk_aws_logs_CrossAccountDestination, _aws_cdk_aws_logs_ILogGroup, _aws_cdk_aws_logs_RetentionDays, _aws_cdk_aws_logs_LogGroupProps, _aws_cdk_aws_logs_LogGroup, _aws_cdk_aws_logs_StreamOptions, _aws_cdk_aws_logs_SubscriptionFilterOptions, _aws_cdk_aws_logs_MetricFilterOptions, _aws_cdk_aws_logs_ILogStream, _aws_cdk_aws_logs_LogStreamProps, _aws_cdk_aws_logs_LogStream, _aws_cdk_aws_logs_MetricFilterProps, _aws_cdk_aws_logs_MetricFilter, _aws_cdk_aws_logs_IFilterPattern, _aws_cdk_aws_logs_JsonPattern, _aws_cdk_aws_logs_FilterPattern, _aws_cdk_aws_logs_SpaceDelimitedTextPattern, _aws_cdk_aws_logs_ColumnRestriction, _aws_cdk_aws_logs_ILogSubscriptionDestination, _aws_cdk_aws_logs_LogSubscriptionDestinationConfig, _aws_cdk_aws_logs_SubscriptionFilterProps, _aws_cdk_aws_logs_SubscriptionFilter, _aws_cdk_aws_logs_LogRetentionProps, _aws_cdk_aws_logs_LogRetentionRetryOptions, _aws_cdk_aws_logs_LogRetention, _aws_cdk_aws_logs_ResourcePolicyProps, _aws_cdk_aws_logs_ResourcePolicy, _aws_cdk_aws_logs_QueryStringProps, _aws_cdk_aws_logs_QueryString, _aws_cdk_aws_logs_QueryDefinitionProps, _aws_cdk_aws_logs_QueryDefinition, _aws_cdk_aws_logs_CfnDestinationProps, _aws_cdk_aws_logs_CfnDestination, _aws_cdk_aws_logs_CfnLogGroupProps, _aws_cdk_aws_logs_CfnLogGroup, _aws_cdk_aws_logs_CfnLogStreamProps, _aws_cdk_aws_logs_CfnLogStream, _aws_cdk_aws_logs_CfnMetricFilterProps, _aws_cdk_aws_logs_CfnMetricFilter, _aws_cdk_aws_logs_CfnMetricFilter_DimensionProperty, _aws_cdk_aws_logs_CfnMetricFilter_MetricTransformationProperty, _aws_cdk_aws_logs_CfnQueryDefinitionProps, _aws_cdk_aws_logs_CfnQueryDefinition, _aws_cdk_aws_logs_CfnResourcePolicyProps, _aws_cdk_aws_logs_CfnResourcePolicy, _aws_cdk_aws_logs_CfnSubscriptionFilterProps, _aws_cdk_aws_logs_CfnSubscriptionFilter };
