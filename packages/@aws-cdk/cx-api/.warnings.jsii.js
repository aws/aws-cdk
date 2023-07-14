function _aws_cdk_cx_api_VpcSubnetGroupType(p) {
}
function _aws_cdk_cx_api_VpcSubnet(p) {
}
function _aws_cdk_cx_api_VpcSubnetGroup(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.subnets != null)
            for (const o of p.subnets)
                if (!visitedObjects.has(o))
                    _aws_cdk_cx_api_VpcSubnet(o);
        if (!visitedObjects.has(p.type))
            _aws_cdk_cx_api_VpcSubnetGroupType(p.type);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_cx_api_VpcContextResponse(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.subnetGroups != null)
            for (const o of p.subnetGroups)
                if (!visitedObjects.has(o))
                    _aws_cdk_cx_api_VpcSubnetGroup(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_cx_api_LoadBalancerIpAddressType(p) {
}
function _aws_cdk_cx_api_LoadBalancerContextResponse(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.ipAddressType))
            _aws_cdk_cx_api_LoadBalancerIpAddressType(p.ipAddressType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_cx_api_LoadBalancerListenerContextResponse(p) {
}
function _aws_cdk_cx_api_EndpointServiceAvailabilityZonesContextQuery(p) {
}
function _aws_cdk_cx_api_SecurityGroupContextResponse(p) {
}
function _aws_cdk_cx_api_KeyContextResponse(p) {
}
function _aws_cdk_cx_api_AwsCloudFormationStackProperties(p) {
}
function _aws_cdk_cx_api_CloudArtifact(p) {
}
function _aws_cdk_cx_api_AssetManifestArtifact(p) {
}
function _aws_cdk_cx_api_CloudFormationStackArtifact(p) {
}
function _aws_cdk_cx_api_TreeCloudArtifact(p) {
}
function _aws_cdk_cx_api_NestedCloudAssemblyArtifact(p) {
}
function _aws_cdk_cx_api_CloudAssembly(p) {
}
function _aws_cdk_cx_api_CloudAssemblyBuilderProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.parentBuilder))
            _aws_cdk_cx_api_CloudAssemblyBuilder(p.parentBuilder);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_cx_api_CloudAssemblyBuilder(p) {
}
function _aws_cdk_cx_api_RuntimeInfo(p) {
}
function _aws_cdk_cx_api_MetadataEntry(p) {
}
function _aws_cdk_cx_api_MissingContext(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("key" in p)
            print("@aws-cdk/cx-api.MissingContext#key", "moved to package 'cloud-assembly-schema'");
        if ("props" in p)
            print("@aws-cdk/cx-api.MissingContext#props", "moved to package 'cloud-assembly-schema'");
        if ("provider" in p)
            print("@aws-cdk/cx-api.MissingContext#provider", "moved to package 'cloud-assembly-schema'");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_cx_api_AssemblyBuildOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("runtimeInfo" in p)
            print("@aws-cdk/cx-api.AssemblyBuildOptions#runtimeInfo", "All template modifications that should result from this should\nhave already been inserted into the template.");
        if (!visitedObjects.has(p.runtimeInfo))
            _aws_cdk_cx_api_RuntimeInfo(p.runtimeInfo);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_cx_api_Environment(p) {
}
function _aws_cdk_cx_api_EnvironmentUtils(p) {
}
function _aws_cdk_cx_api_SynthesisMessageLevel(p) {
}
function _aws_cdk_cx_api_MetadataEntryResult(p) {
}
function _aws_cdk_cx_api_SynthesisMessage(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.level))
            _aws_cdk_cx_api_SynthesisMessageLevel(p.level);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_cx_api_EnvironmentPlaceholders(p) {
}
function _aws_cdk_cx_api_EnvironmentPlaceholderValues(p) {
}
function _aws_cdk_cx_api_IEnvironmentPlaceholderProvider(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_cx_api_VpcSubnetGroupType, _aws_cdk_cx_api_VpcSubnet, _aws_cdk_cx_api_VpcSubnetGroup, _aws_cdk_cx_api_VpcContextResponse, _aws_cdk_cx_api_LoadBalancerIpAddressType, _aws_cdk_cx_api_LoadBalancerContextResponse, _aws_cdk_cx_api_LoadBalancerListenerContextResponse, _aws_cdk_cx_api_EndpointServiceAvailabilityZonesContextQuery, _aws_cdk_cx_api_SecurityGroupContextResponse, _aws_cdk_cx_api_KeyContextResponse, _aws_cdk_cx_api_AwsCloudFormationStackProperties, _aws_cdk_cx_api_CloudArtifact, _aws_cdk_cx_api_AssetManifestArtifact, _aws_cdk_cx_api_CloudFormationStackArtifact, _aws_cdk_cx_api_TreeCloudArtifact, _aws_cdk_cx_api_NestedCloudAssemblyArtifact, _aws_cdk_cx_api_CloudAssembly, _aws_cdk_cx_api_CloudAssemblyBuilderProps, _aws_cdk_cx_api_CloudAssemblyBuilder, _aws_cdk_cx_api_RuntimeInfo, _aws_cdk_cx_api_MetadataEntry, _aws_cdk_cx_api_MissingContext, _aws_cdk_cx_api_AssemblyBuildOptions, _aws_cdk_cx_api_Environment, _aws_cdk_cx_api_EnvironmentUtils, _aws_cdk_cx_api_SynthesisMessageLevel, _aws_cdk_cx_api_MetadataEntryResult, _aws_cdk_cx_api_SynthesisMessage, _aws_cdk_cx_api_EnvironmentPlaceholders, _aws_cdk_cx_api_EnvironmentPlaceholderValues, _aws_cdk_cx_api_IEnvironmentPlaceholderProvider };
