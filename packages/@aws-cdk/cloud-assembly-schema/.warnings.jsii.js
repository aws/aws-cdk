function _aws_cdk_cloud_assembly_schema_ArtifactType(p) {
}
function _aws_cdk_cloud_assembly_schema_RuntimeInfo(p) {
}
function _aws_cdk_cloud_assembly_schema_MissingContext(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.props))
            _aws_cdk_cloud_assembly_schema_AmiContextQuery(p.props);
        if (!visitedObjects.has(p.provider))
            _aws_cdk_cloud_assembly_schema_ContextProvider(p.provider);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_cloud_assembly_schema_ArtifactManifest(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.type))
            _aws_cdk_cloud_assembly_schema_ArtifactType(p.type);
        if (!visitedObjects.has(p.properties))
            _aws_cdk_cloud_assembly_schema_AwsCloudFormationStackProperties(p.properties);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_cloud_assembly_schema_AssemblyManifest(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.artifacts != null)
            for (const o of Object.values(p.artifacts))
                if (!visitedObjects.has(o))
                    _aws_cdk_cloud_assembly_schema_ArtifactManifest(o);
        if (p.missing != null)
            for (const o of p.missing)
                if (!visitedObjects.has(o))
                    _aws_cdk_cloud_assembly_schema_MissingContext(o);
        if (!visitedObjects.has(p.runtime))
            _aws_cdk_cloud_assembly_schema_RuntimeInfo(p.runtime);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_cloud_assembly_schema_FileAssetMetadataEntry(p) {
}
function _aws_cdk_cloud_assembly_schema_Tag(p) {
}
function _aws_cdk_cloud_assembly_schema_ContainerImageAssetCacheOption(p) {
}
function _aws_cdk_cloud_assembly_schema_ContainerImageAssetMetadataEntry(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.cacheFrom != null)
            for (const o of p.cacheFrom)
                if (!visitedObjects.has(o))
                    _aws_cdk_cloud_assembly_schema_ContainerImageAssetCacheOption(o);
        if (!visitedObjects.has(p.cacheTo))
            _aws_cdk_cloud_assembly_schema_ContainerImageAssetCacheOption(p.cacheTo);
        if ("imageNameParameter" in p)
            print("@aws-cdk/cloud-assembly-schema.ContainerImageAssetMetadataEntry#imageNameParameter", "specify `repositoryName` and `imageTag` instead, and then you\nknow where the image will go.");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_cloud_assembly_schema_ArtifactMetadataEntryType(p) {
}
function _aws_cdk_cloud_assembly_schema_MetadataEntry(p) {
}
function _aws_cdk_cloud_assembly_schema_BootstrapRole(p) {
}
function _aws_cdk_cloud_assembly_schema_AwsCloudFormationStackProperties(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.lookupRole))
            _aws_cdk_cloud_assembly_schema_BootstrapRole(p.lookupRole);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_cloud_assembly_schema_AssetManifestOptions(p) {
}
function _aws_cdk_cloud_assembly_schema_AssetManifestProperties(p) {
}
function _aws_cdk_cloud_assembly_schema_TreeArtifactProperties(p) {
}
function _aws_cdk_cloud_assembly_schema_NestedCloudAssemblyProperties(p) {
}
function _aws_cdk_cloud_assembly_schema_ContextProvider(p) {
}
function _aws_cdk_cloud_assembly_schema_AmiContextQuery(p) {
}
function _aws_cdk_cloud_assembly_schema_AvailabilityZonesContextQuery(p) {
}
function _aws_cdk_cloud_assembly_schema_HostedZoneContextQuery(p) {
}
function _aws_cdk_cloud_assembly_schema_SSMParameterContextQuery(p) {
}
function _aws_cdk_cloud_assembly_schema_VpcContextQuery(p) {
}
function _aws_cdk_cloud_assembly_schema_EndpointServiceAvailabilityZonesContextQuery(p) {
}
function _aws_cdk_cloud_assembly_schema_LoadBalancerType(p) {
}
function _aws_cdk_cloud_assembly_schema_LoadBalancerFilter(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.loadBalancerType))
            _aws_cdk_cloud_assembly_schema_LoadBalancerType(p.loadBalancerType);
        if (p.loadBalancerTags != null)
            for (const o of p.loadBalancerTags)
                if (!visitedObjects.has(o))
                    _aws_cdk_cloud_assembly_schema_Tag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_cloud_assembly_schema_LoadBalancerContextQuery(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.loadBalancerType))
            _aws_cdk_cloud_assembly_schema_LoadBalancerType(p.loadBalancerType);
        if (p.loadBalancerTags != null)
            for (const o of p.loadBalancerTags)
                if (!visitedObjects.has(o))
                    _aws_cdk_cloud_assembly_schema_Tag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_cloud_assembly_schema_LoadBalancerListenerProtocol(p) {
}
function _aws_cdk_cloud_assembly_schema_LoadBalancerListenerContextQuery(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.listenerProtocol))
            _aws_cdk_cloud_assembly_schema_LoadBalancerListenerProtocol(p.listenerProtocol);
        if (!visitedObjects.has(p.loadBalancerType))
            _aws_cdk_cloud_assembly_schema_LoadBalancerType(p.loadBalancerType);
        if (p.loadBalancerTags != null)
            for (const o of p.loadBalancerTags)
                if (!visitedObjects.has(o))
                    _aws_cdk_cloud_assembly_schema_Tag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_cloud_assembly_schema_SecurityGroupContextQuery(p) {
}
function _aws_cdk_cloud_assembly_schema_KeyContextQuery(p) {
}
function _aws_cdk_cloud_assembly_schema_PluginContextQuery(p) {
}
function _aws_cdk_cloud_assembly_schema_AssetManifest(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.dockerImages != null)
            for (const o of Object.values(p.dockerImages))
                if (!visitedObjects.has(o))
                    _aws_cdk_cloud_assembly_schema_DockerImageAsset(o);
        if (p.files != null)
            for (const o of Object.values(p.files))
                if (!visitedObjects.has(o))
                    _aws_cdk_cloud_assembly_schema_FileAsset(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_cloud_assembly_schema_DockerImageAsset(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.destinations != null)
            for (const o of Object.values(p.destinations))
                if (!visitedObjects.has(o))
                    _aws_cdk_cloud_assembly_schema_DockerImageDestination(o);
        if (!visitedObjects.has(p.source))
            _aws_cdk_cloud_assembly_schema_DockerImageSource(p.source);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_cloud_assembly_schema_DockerImageSource(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.cacheFrom != null)
            for (const o of p.cacheFrom)
                if (!visitedObjects.has(o))
                    _aws_cdk_cloud_assembly_schema_DockerCacheOption(o);
        if (!visitedObjects.has(p.cacheTo))
            _aws_cdk_cloud_assembly_schema_DockerCacheOption(p.cacheTo);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_cloud_assembly_schema_DockerImageDestination(p) {
}
function _aws_cdk_cloud_assembly_schema_DockerCacheOption(p) {
}
function _aws_cdk_cloud_assembly_schema_FileAsset(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.destinations != null)
            for (const o of Object.values(p.destinations))
                if (!visitedObjects.has(o))
                    _aws_cdk_cloud_assembly_schema_FileDestination(o);
        if (!visitedObjects.has(p.source))
            _aws_cdk_cloud_assembly_schema_FileSource(p.source);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_cloud_assembly_schema_FileAssetPackaging(p) {
}
function _aws_cdk_cloud_assembly_schema_FileSource(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.packaging))
            _aws_cdk_cloud_assembly_schema_FileAssetPackaging(p.packaging);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_cloud_assembly_schema_FileDestination(p) {
}
function _aws_cdk_cloud_assembly_schema_AwsDestination(p) {
}
function _aws_cdk_cloud_assembly_schema_LoadManifestOptions(p) {
}
function _aws_cdk_cloud_assembly_schema_Manifest(p) {
}
function _aws_cdk_cloud_assembly_schema_IntegManifest(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.testCases != null)
            for (const o of Object.values(p.testCases))
                if (!visitedObjects.has(o))
                    _aws_cdk_cloud_assembly_schema_TestCase(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_cloud_assembly_schema_RequireApproval(p) {
}
function _aws_cdk_cloud_assembly_schema_DefaultCdkOptions(p) {
}
function _aws_cdk_cloud_assembly_schema_DeployOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.requireApproval))
            _aws_cdk_cloud_assembly_schema_RequireApproval(p.requireApproval);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_cloud_assembly_schema_DestroyOptions(p) {
}
function _aws_cdk_cloud_assembly_schema_TestOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cdkCommandOptions))
            _aws_cdk_cloud_assembly_schema_CdkCommands(p.cdkCommandOptions);
        if (!visitedObjects.has(p.hooks))
            _aws_cdk_cloud_assembly_schema_Hooks(p.hooks);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_cloud_assembly_schema_TestCase(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.cdkCommandOptions))
            _aws_cdk_cloud_assembly_schema_CdkCommands(p.cdkCommandOptions);
        if (!visitedObjects.has(p.hooks))
            _aws_cdk_cloud_assembly_schema_Hooks(p.hooks);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_cloud_assembly_schema_Hooks(p) {
}
function _aws_cdk_cloud_assembly_schema_CdkCommand(p) {
}
function _aws_cdk_cloud_assembly_schema_DeployCommand(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.args))
            _aws_cdk_cloud_assembly_schema_DeployOptions(p.args);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_cloud_assembly_schema_DestroyCommand(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.args))
            _aws_cdk_cloud_assembly_schema_DestroyOptions(p.args);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_cloud_assembly_schema_CdkCommands(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.deploy))
            _aws_cdk_cloud_assembly_schema_DeployCommand(p.deploy);
        if (!visitedObjects.has(p.destroy))
            _aws_cdk_cloud_assembly_schema_DestroyCommand(p.destroy);
    }
    finally {
        visitedObjects.delete(p);
    }
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_cloud_assembly_schema_ArtifactType, _aws_cdk_cloud_assembly_schema_RuntimeInfo, _aws_cdk_cloud_assembly_schema_MissingContext, _aws_cdk_cloud_assembly_schema_ArtifactManifest, _aws_cdk_cloud_assembly_schema_AssemblyManifest, _aws_cdk_cloud_assembly_schema_FileAssetMetadataEntry, _aws_cdk_cloud_assembly_schema_Tag, _aws_cdk_cloud_assembly_schema_ContainerImageAssetCacheOption, _aws_cdk_cloud_assembly_schema_ContainerImageAssetMetadataEntry, _aws_cdk_cloud_assembly_schema_ArtifactMetadataEntryType, _aws_cdk_cloud_assembly_schema_MetadataEntry, _aws_cdk_cloud_assembly_schema_BootstrapRole, _aws_cdk_cloud_assembly_schema_AwsCloudFormationStackProperties, _aws_cdk_cloud_assembly_schema_AssetManifestOptions, _aws_cdk_cloud_assembly_schema_AssetManifestProperties, _aws_cdk_cloud_assembly_schema_TreeArtifactProperties, _aws_cdk_cloud_assembly_schema_NestedCloudAssemblyProperties, _aws_cdk_cloud_assembly_schema_ContextProvider, _aws_cdk_cloud_assembly_schema_AmiContextQuery, _aws_cdk_cloud_assembly_schema_AvailabilityZonesContextQuery, _aws_cdk_cloud_assembly_schema_HostedZoneContextQuery, _aws_cdk_cloud_assembly_schema_SSMParameterContextQuery, _aws_cdk_cloud_assembly_schema_VpcContextQuery, _aws_cdk_cloud_assembly_schema_EndpointServiceAvailabilityZonesContextQuery, _aws_cdk_cloud_assembly_schema_LoadBalancerType, _aws_cdk_cloud_assembly_schema_LoadBalancerFilter, _aws_cdk_cloud_assembly_schema_LoadBalancerContextQuery, _aws_cdk_cloud_assembly_schema_LoadBalancerListenerProtocol, _aws_cdk_cloud_assembly_schema_LoadBalancerListenerContextQuery, _aws_cdk_cloud_assembly_schema_SecurityGroupContextQuery, _aws_cdk_cloud_assembly_schema_KeyContextQuery, _aws_cdk_cloud_assembly_schema_PluginContextQuery, _aws_cdk_cloud_assembly_schema_AssetManifest, _aws_cdk_cloud_assembly_schema_DockerImageAsset, _aws_cdk_cloud_assembly_schema_DockerImageSource, _aws_cdk_cloud_assembly_schema_DockerImageDestination, _aws_cdk_cloud_assembly_schema_DockerCacheOption, _aws_cdk_cloud_assembly_schema_FileAsset, _aws_cdk_cloud_assembly_schema_FileAssetPackaging, _aws_cdk_cloud_assembly_schema_FileSource, _aws_cdk_cloud_assembly_schema_FileDestination, _aws_cdk_cloud_assembly_schema_AwsDestination, _aws_cdk_cloud_assembly_schema_LoadManifestOptions, _aws_cdk_cloud_assembly_schema_Manifest, _aws_cdk_cloud_assembly_schema_IntegManifest, _aws_cdk_cloud_assembly_schema_RequireApproval, _aws_cdk_cloud_assembly_schema_DefaultCdkOptions, _aws_cdk_cloud_assembly_schema_DeployOptions, _aws_cdk_cloud_assembly_schema_DestroyOptions, _aws_cdk_cloud_assembly_schema_TestOptions, _aws_cdk_cloud_assembly_schema_TestCase, _aws_cdk_cloud_assembly_schema_Hooks, _aws_cdk_cloud_assembly_schema_CdkCommand, _aws_cdk_cloud_assembly_schema_DeployCommand, _aws_cdk_cloud_assembly_schema_DestroyCommand, _aws_cdk_cloud_assembly_schema_CdkCommands };
