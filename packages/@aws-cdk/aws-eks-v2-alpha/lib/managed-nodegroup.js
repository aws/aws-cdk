"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nodegroup = exports.TaintEffect = exports.CapacityType = exports.NodegroupAmiType = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const aws_ec2_1 = require("aws-cdk-lib/aws-ec2");
const aws_eks_1 = require("aws-cdk-lib/aws-eks");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const core_1 = require("aws-cdk-lib/core");
const metadata_resource_1 = require("aws-cdk-lib/core/lib/metadata-resource");
const prop_injectable_1 = require("aws-cdk-lib/core/lib/prop-injectable");
const cxapi = require("aws-cdk-lib/cx-api");
const constructs_1 = require("constructs");
const cluster_1 = require("./cluster");
const nodegroup_1 = require("./private/nodegroup");
/**
 * The AMI type for your node group.
 *
 * GPU instance types should use the `AL2_x86_64_GPU` AMI type, which uses the
 * Amazon EKS-optimized Linux AMI with GPU support or the `BOTTLEROCKET_ARM_64_NVIDIA` or `BOTTLEROCKET_X86_64_NVIDIA`
 * AMI types, which uses the Amazon EKS-optimized Linux AMI with Nvidia-GPU support.
 *
 * Non-GPU instances should use the `AL2_x86_64` AMI type, which uses the Amazon EKS-optimized Linux AMI.
 */
var NodegroupAmiType;
(function (NodegroupAmiType) {
    /**
     * Amazon Linux 2 (x86-64)
     */
    NodegroupAmiType["AL2_X86_64"] = "AL2_x86_64";
    /**
     * Amazon Linux 2 with GPU support
     */
    NodegroupAmiType["AL2_X86_64_GPU"] = "AL2_x86_64_GPU";
    /**
     * Amazon Linux 2 (ARM-64)
     */
    NodegroupAmiType["AL2_ARM_64"] = "AL2_ARM_64";
    /**
     *  Bottlerocket Linux (ARM-64)
     */
    NodegroupAmiType["BOTTLEROCKET_ARM_64"] = "BOTTLEROCKET_ARM_64";
    /**
     * Bottlerocket (x86-64)
     */
    NodegroupAmiType["BOTTLEROCKET_X86_64"] = "BOTTLEROCKET_x86_64";
    /**
     *  Bottlerocket Linux with Nvidia-GPU support (ARM-64)
     */
    NodegroupAmiType["BOTTLEROCKET_ARM_64_NVIDIA"] = "BOTTLEROCKET_ARM_64_NVIDIA";
    /**
     * Bottlerocket with Nvidia-GPU support (x86-64)
     */
    NodegroupAmiType["BOTTLEROCKET_X86_64_NVIDIA"] = "BOTTLEROCKET_x86_64_NVIDIA";
    /**
     * Bottlerocket Linux (ARM-64) with FIPS enabled
     */
    NodegroupAmiType["BOTTLEROCKET_ARM_64_FIPS"] = "BOTTLEROCKET_ARM_64_FIPS";
    /**
     * Bottlerocket (x86-64) with FIPS enabled
     */
    NodegroupAmiType["BOTTLEROCKET_X86_64_FIPS"] = "BOTTLEROCKET_x86_64_FIPS";
    /**
     * Windows Core 2019 (x86-64)
     */
    NodegroupAmiType["WINDOWS_CORE_2019_X86_64"] = "WINDOWS_CORE_2019_x86_64";
    /**
     * Windows Core 2022 (x86-64)
     */
    NodegroupAmiType["WINDOWS_CORE_2022_X86_64"] = "WINDOWS_CORE_2022_x86_64";
    /**
     * Windows Full 2019 (x86-64)
     */
    NodegroupAmiType["WINDOWS_FULL_2019_X86_64"] = "WINDOWS_FULL_2019_x86_64";
    /**
     * Windows Full 2022 (x86-64)
     */
    NodegroupAmiType["WINDOWS_FULL_2022_X86_64"] = "WINDOWS_FULL_2022_x86_64";
    /**
     * Amazon Linux 2023 (x86-64)
     */
    NodegroupAmiType["AL2023_X86_64_STANDARD"] = "AL2023_x86_64_STANDARD";
    /**
     * Amazon Linux 2023 with AWS Neuron drivers (x86-64)
     */
    NodegroupAmiType["AL2023_X86_64_NEURON"] = "AL2023_x86_64_NEURON";
    /**
     * Amazon Linux 2023 with NVIDIA drivers (x86-64)
     */
    NodegroupAmiType["AL2023_X86_64_NVIDIA"] = "AL2023_x86_64_NVIDIA";
    /**
     * Amazon Linux 2023 with NVIDIA drivers (ARM-64)
     */
    NodegroupAmiType["AL2023_ARM_64_NVIDIA"] = "AL2023_ARM_64_NVIDIA";
    /**
     * Amazon Linux 2023 (ARM-64)
     */
    NodegroupAmiType["AL2023_ARM_64_STANDARD"] = "AL2023_ARM_64_STANDARD";
})(NodegroupAmiType || (exports.NodegroupAmiType = NodegroupAmiType = {}));
/**
 * Capacity type of the managed node group
 */
var CapacityType;
(function (CapacityType) {
    /**
     * spot instances
     */
    CapacityType["SPOT"] = "SPOT";
    /**
     * on-demand instances
     */
    CapacityType["ON_DEMAND"] = "ON_DEMAND";
    /**
     * capacity block instances
     */
    CapacityType["CAPACITY_BLOCK"] = "CAPACITY_BLOCK";
})(CapacityType || (exports.CapacityType = CapacityType = {}));
/**
 * Effect types of kubernetes node taint.
 *
 * Note: These values are specifically for AWS EKS NodeGroups and use the AWS API format.
 * When using AWS CLI or API, taint effects must be NO_SCHEDULE, PREFER_NO_SCHEDULE, or NO_EXECUTE.
 * When using Kubernetes directly or kubectl, taint effects must be NoSchedule, PreferNoSchedule, or NoExecute.
 *
 * For Kubernetes manifests (like Karpenter NodePools), use string literals with PascalCase format:
 * - 'NoSchedule' instead of TaintEffect.NO_SCHEDULE
 * - 'PreferNoSchedule' instead of TaintEffect.PREFER_NO_SCHEDULE
 * - 'NoExecute' instead of TaintEffect.NO_EXECUTE
 *
 * @see https://docs.aws.amazon.com/eks/latest/userguide/node-taints-managed-node-groups.html
 */
var TaintEffect;
(function (TaintEffect) {
    /**
     * NoSchedule
     */
    TaintEffect["NO_SCHEDULE"] = "NO_SCHEDULE";
    /**
     * PreferNoSchedule
     */
    TaintEffect["PREFER_NO_SCHEDULE"] = "PREFER_NO_SCHEDULE";
    /**
     * NoExecute
     */
    TaintEffect["NO_EXECUTE"] = "NO_EXECUTE";
})(TaintEffect || (exports.TaintEffect = TaintEffect = {}));
/**
 * The Nodegroup resource class
 * @resource AWS::EKS::Nodegroup
 */
let Nodegroup = (() => {
    let _classDecorators = [prop_injectable_1.propertyInjectable];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = core_1.Resource;
    var Nodegroup = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            Nodegroup = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static [JSII_RTTI_SYMBOL_1] = { fqn: "@aws-cdk/aws-eks-v2-alpha.Nodegroup", version: "0.0.0" };
        /** Uniquely identifies this class. */
        static PROPERTY_INJECTION_ID = '@aws-cdk.aws-eks-v2-alpha.Nodegroup';
        /**
         * Import the Nodegroup from attributes
         */
        static fromNodegroupName(scope, id, nodegroupName) {
            class Import extends core_1.Resource {
                nodegroupName = nodegroupName;
            }
            return new Import(scope, id);
        }
        /**
         * ARN of the nodegroup
         *
         * @attribute
         */
        nodegroupArn;
        /**
         * Nodegroup name
         *
         * @attribute
         */
        nodegroupName;
        /**
         * the Amazon EKS cluster resource
         *
         * @attribute ClusterName
         */
        cluster;
        /**
         * IAM role of the instance profile for the nodegroup
         */
        role;
        desiredSize;
        maxSize;
        minSize;
        constructor(scope, id, props) {
            super(scope, id, {
                physicalName: props.nodegroupName,
            });
            try {
                jsiiDeprecationWarnings._aws_cdk_aws_eks_v2_alpha_NodegroupProps(props);
            }
            catch (error) {
                if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                    Error.captureStackTrace(error, Nodegroup);
                }
                throw error;
            }
            // Enhanced CDK Analytics Telemetry
            (0, metadata_resource_1.addConstructMetadata)(this, props);
            this.cluster = props.cluster;
            this.desiredSize = props.desiredSize ?? props.minSize ?? 2;
            this.maxSize = props.maxSize ?? this.desiredSize;
            this.minSize = props.minSize ?? 1;
            (0, core_1.withResolved)(this.desiredSize, this.maxSize, (desired, max) => {
                if (desired === undefined) {
                    return;
                }
                if (desired > max) {
                    throw new Error(`Desired capacity ${desired} can't be greater than max size ${max}`);
                }
            });
            (0, core_1.withResolved)(this.desiredSize, this.minSize, (desired, min) => {
                if (desired === undefined) {
                    return;
                }
                if (desired < min) {
                    throw new Error(`Minimum capacity ${min} can't be greater than desired size ${desired}`);
                }
            });
            if (props.launchTemplateSpec && props.diskSize) {
                // see - https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html
                // and https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-disksize
                throw new Error('diskSize must be specified within the launch template');
            }
            if (props.instanceType && props.instanceTypes) {
                throw new Error('"instanceType is deprecated, please use "instanceTypes" only.');
            }
            if (props.instanceType) {
                core_1.Annotations.of(this).addWarningV2('@aws-cdk/aws-eks:managedNodeGroupDeprecatedInstanceType', '"instanceType" is deprecated and will be removed in the next major version. please use "instanceTypes" instead');
            }
            const instanceTypes = props.instanceTypes ?? (props.instanceType ? [props.instanceType] : undefined);
            let possibleAmiTypes = [];
            if (instanceTypes && instanceTypes.length > 0) {
                /**
                 * if the user explicitly configured instance types, we can't caculate the expected ami type as we support
                 * Amazon Linux 2, Bottlerocket, and Windows now. However we can check:
                 *
                 * 1. instance types of different CPU architectures are not mixed(e.g. X86 with ARM).
                 * 2. user-specified amiType should be included in `possibleAmiTypes`.
                 */
                possibleAmiTypes = getPossibleAmiTypes(instanceTypes);
                // if the user explicitly configured an ami type, make sure it's included in the possibleAmiTypes
                if (props.amiType && !possibleAmiTypes.includes(props.amiType)) {
                    throw new Error(`The specified AMI does not match the instance types architecture, either specify one of ${possibleAmiTypes.join(', ').toUpperCase()} or don't specify any`);
                }
                // if the user explicitly configured a Windows ami type, make sure the instanceType is allowed
                if (props.amiType && windowsAmiTypes.includes(props.amiType) &&
                    instanceTypes.filter(isWindowsSupportedInstanceType).length < instanceTypes.length) {
                    throw new Error('The specified instanceType does not support Windows workloads. '
                        + 'Amazon EC2 instance types C3, C4, D2, I2, M4 (excluding m4.16xlarge), M6a.x, and '
                        + 'R3 instances aren\'t supported for Windows workloads.');
                }
            }
            if (!props.nodeRole) {
                const ngRole = new aws_iam_1.Role(this, 'NodeGroupRole', {
                    assumedBy: new aws_iam_1.ServicePrincipal('ec2.amazonaws.com'),
                });
                ngRole.addManagedPolicy(aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSWorkerNodePolicy'));
                ngRole.addManagedPolicy(aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKS_CNI_Policy'));
                ngRole.addManagedPolicy(aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryReadOnly'));
                // Grant additional IPv6 networking permissions if running in IPv6
                // https://docs.aws.amazon.com/eks/latest/userguide/cni-iam-role.html
                if (props.cluster.ipFamily == cluster_1.IpFamily.IP_V6) {
                    ngRole.addToPrincipalPolicy(new aws_iam_1.PolicyStatement({
                        // eslint-disable-next-line @cdklabs/no-literal-partition
                        resources: ['arn:aws:ec2:*:*:network-interface/*'],
                        actions: [
                            'ec2:AssignIpv6Addresses',
                            'ec2:UnassignIpv6Addresses',
                        ],
                    }));
                }
                this.role = ngRole;
            }
            else {
                this.role = props.nodeRole;
            }
            this.validateUpdateConfig(props.maxUnavailable, props.maxUnavailablePercentage);
            const resource = new aws_eks_1.CfnNodegroup(this, 'Resource', {
                clusterName: this.cluster.clusterName,
                nodegroupName: props.nodegroupName,
                nodeRole: this.role.roleArn,
                subnets: this.cluster.vpc.selectSubnets(props.subnets).subnetIds,
                /**
                 * Case 1: If launchTemplate is explicitly specified with custom AMI, we cannot specify amiType, or the node group deployment will fail.
                 * As we don't know if the custom AMI is specified in the lauchTemplate, we just use props.amiType.
                 *
                 * Case 2: If launchTemplate is not specified, we try to determine amiType from the instanceTypes and it could be either AL2 or Bottlerocket.
                 * To avoid breaking changes, we use possibleAmiTypes[0] if amiType is undefined and make sure AL2 is always the first element in possibleAmiTypes
                 * as AL2 is previously the `expectedAmi` and this avoids breaking changes.
                 *
                 * That being said, users now either have to explicitly specify correct amiType or just leave it undefined.
                 */
                amiType: props.launchTemplateSpec ? props.amiType : (props.amiType ?? possibleAmiTypes[0]),
                capacityType: props.capacityType ? props.capacityType.valueOf() : undefined,
                diskSize: props.diskSize,
                forceUpdateEnabled: props.forceUpdate ?? true,
                // note that we don't check if a launch template is configured here (even though it might configure instance types as well)
                // because this doesn't have a default value, meaning the user had to explicitly configure this.
                instanceTypes: instanceTypes?.map(t => t.toString()),
                labels: props.labels,
                taints: props.taints,
                launchTemplate: props.launchTemplateSpec,
                releaseVersion: props.releaseVersion,
                remoteAccess: props.remoteAccess ? {
                    ec2SshKey: props.remoteAccess.sshKeyName,
                    sourceSecurityGroups: props.remoteAccess.sourceSecurityGroups ?
                        props.remoteAccess.sourceSecurityGroups.map(m => m.securityGroupId) : undefined,
                } : undefined,
                scalingConfig: {
                    desiredSize: this.desiredSize,
                    maxSize: this.maxSize,
                    minSize: this.minSize,
                },
                tags: props.tags,
                updateConfig: props.maxUnavailable || props.maxUnavailablePercentage ? {
                    maxUnavailable: props.maxUnavailable,
                    maxUnavailablePercentage: props.maxUnavailablePercentage,
                } : undefined,
                nodeRepairConfig: props.enableNodeAutoRepair ? {
                    enabled: props.enableNodeAutoRepair,
                } : undefined,
            });
            if (this.cluster instanceof cluster_1.Cluster) {
                // the controller runs on the worker nodes so they cannot
                // be deleted before the controller.
                if (this.cluster.albController) {
                    constructs_1.Node.of(this.cluster.albController).addDependency(this);
                }
            }
            this.nodegroupArn = this.getResourceArnAttribute(resource.attrArn, {
                service: 'eks',
                resource: 'nodegroup',
                resourceName: this.physicalName,
            });
            if (core_1.FeatureFlags.of(this).isEnabled(cxapi.EKS_NODEGROUP_NAME)) {
                this.nodegroupName = this.getResourceNameAttribute(resource.attrNodegroupName);
            }
            else {
                this.nodegroupName = this.getResourceNameAttribute(resource.ref);
            }
        }
        validateUpdateConfig(maxUnavailable, maxUnavailablePercentage) {
            if (!maxUnavailable && !maxUnavailablePercentage)
                return;
            if (maxUnavailable && maxUnavailablePercentage) {
                throw new Error('maxUnavailable and maxUnavailablePercentage are not allowed to be defined together');
            }
            if (maxUnavailablePercentage && (maxUnavailablePercentage < 1 || maxUnavailablePercentage > 100)) {
                throw new Error(`maxUnavailablePercentage must be between 1 and 100, got ${maxUnavailablePercentage}`);
            }
            if (maxUnavailable) {
                if (maxUnavailable > this.maxSize) {
                    throw new Error(`maxUnavailable must be lower than maxSize (${this.maxSize}), got ${maxUnavailable}`);
                }
                if (maxUnavailable < 1 || maxUnavailable > 100) {
                    throw new Error(`maxUnavailable must be between 1 and 100, got ${maxUnavailable}`);
                }
            }
        }
        static {
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return Nodegroup = _classThis;
})();
exports.Nodegroup = Nodegroup;
/**
 * AMI types of different architectures. Make sure AL2 is always the first element, which will be the default
 * AmiType if amiType and launchTemplateSpec are both undefined.
 */
const arm64AmiTypes = [
    NodegroupAmiType.AL2_ARM_64,
    NodegroupAmiType.AL2023_ARM_64_STANDARD,
    NodegroupAmiType.BOTTLEROCKET_ARM_64,
];
const x8664AmiTypes = [
    NodegroupAmiType.AL2_X86_64,
    NodegroupAmiType.AL2023_X86_64_STANDARD,
    NodegroupAmiType.BOTTLEROCKET_X86_64,
    NodegroupAmiType.WINDOWS_CORE_2019_X86_64,
    NodegroupAmiType.WINDOWS_CORE_2022_X86_64,
    NodegroupAmiType.WINDOWS_FULL_2019_X86_64,
    NodegroupAmiType.WINDOWS_FULL_2022_X86_64,
];
const windowsAmiTypes = [
    NodegroupAmiType.WINDOWS_CORE_2019_X86_64,
    NodegroupAmiType.WINDOWS_CORE_2022_X86_64,
    NodegroupAmiType.WINDOWS_FULL_2019_X86_64,
    NodegroupAmiType.WINDOWS_FULL_2022_X86_64,
];
const gpuAmiTypes = [
    NodegroupAmiType.AL2_X86_64_GPU,
    NodegroupAmiType.AL2023_X86_64_NEURON,
    NodegroupAmiType.AL2023_X86_64_NVIDIA,
    NodegroupAmiType.AL2023_ARM_64_NVIDIA,
    NodegroupAmiType.BOTTLEROCKET_X86_64_NVIDIA,
    NodegroupAmiType.BOTTLEROCKET_ARM_64_NVIDIA,
];
/**
 * This function check if the instanceType is supported by Windows AMI.
 * https://docs.aws.amazon.com/eks/latest/userguide/windows-support.html
 * @param instanceType The EC2 instance type
 */
function isWindowsSupportedInstanceType(instanceType) {
    // compare instanceType to forbidden InstanceTypes for Windows. Add exception for m6a.16xlarge.
    // NOTE: i2 instance class is not present in the InstanceClass enum.
    const forbiddenInstanceClasses = [aws_ec2_1.InstanceClass.C3, aws_ec2_1.InstanceClass.C4, aws_ec2_1.InstanceClass.D2, aws_ec2_1.InstanceClass.M4,
        aws_ec2_1.InstanceClass.M6A, aws_ec2_1.InstanceClass.R3];
    return instanceType.toString() === aws_ec2_1.InstanceType.of(aws_ec2_1.InstanceClass.M4, aws_ec2_1.InstanceSize.XLARGE16).toString() ||
        forbiddenInstanceClasses.every((c) => !instanceType.sameInstanceClassAs(aws_ec2_1.InstanceType.of(c, aws_ec2_1.InstanceSize.LARGE)) && !instanceType.toString().match(/^i2/));
}
/**
 * This function examines the CPU architecture of every instance type and determines
 * what AMI types are compatible for all of them. it either throws or produces an array of possible AMI types because
 * instance types of different CPU architectures are not supported.
 * @param instanceTypes The instance types
 * @returns NodegroupAmiType[]
 */
function getPossibleAmiTypes(instanceTypes) {
    function typeToArch(instanceType) {
        return (0, nodegroup_1.isGpuInstanceType)(instanceType) ? 'GPU' : instanceType.architecture;
    }
    const archAmiMap = new Map([
        [aws_ec2_1.InstanceArchitecture.ARM_64, arm64AmiTypes],
        [aws_ec2_1.InstanceArchitecture.X86_64, x8664AmiTypes],
        ['GPU', gpuAmiTypes],
    ]);
    const architectures = new Set(instanceTypes.map(typeToArch));
    if (architectures.size === 0) { // protective code, the current implementation will never result in this.
        throw new Error(`Cannot determine any ami type compatible with instance types: ${instanceTypes.map(i => i.toString()).join(', ')}`);
    }
    if (architectures.size > 1) {
        throw new Error('instanceTypes of different architectures is not allowed');
    }
    return archAmiMap.get(Array.from(architectures)[0]);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFuYWdlZC1ub2RlZ3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYW5hZ2VkLW5vZGVncm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpREFBdUk7QUFDdkksaURBQW1EO0FBQ25ELGlEQUFvRztBQUNwRywyQ0FBZ0c7QUFDaEcsOEVBQThFO0FBQzlFLDBFQUEwRTtBQUMxRSw0Q0FBNEM7QUFDNUMsMkNBQTZDO0FBQzdDLHVDQUF3RDtBQUN4RCxtREFBd0Q7QUFheEQ7Ozs7Ozs7O0dBUUc7QUFDSCxJQUFZLGdCQXlFWDtBQXpFRCxXQUFZLGdCQUFnQjtJQUMxQjs7T0FFRztJQUNILDZDQUF5QixDQUFBO0lBQ3pCOztPQUVHO0lBQ0gscURBQWlDLENBQUE7SUFDakM7O09BRUc7SUFDSCw2Q0FBeUIsQ0FBQTtJQUN6Qjs7T0FFRztJQUNILCtEQUEyQyxDQUFBO0lBQzNDOztPQUVHO0lBQ0gsK0RBQTJDLENBQUE7SUFDM0M7O09BRUc7SUFDSCw2RUFBeUQsQ0FBQTtJQUN6RDs7T0FFRztJQUNILDZFQUF5RCxDQUFBO0lBQ3pEOztPQUVHO0lBQ0gseUVBQXFELENBQUE7SUFDckQ7O09BRUc7SUFDSCx5RUFBcUQsQ0FBQTtJQUNyRDs7T0FFRztJQUNILHlFQUFxRCxDQUFBO0lBQ3JEOztPQUVHO0lBQ0gseUVBQXFELENBQUE7SUFDckQ7O09BRUc7SUFDSCx5RUFBcUQsQ0FBQTtJQUNyRDs7T0FFRztJQUNILHlFQUFxRCxDQUFBO0lBQ3JEOztPQUVHO0lBQ0gscUVBQWlELENBQUE7SUFDakQ7O09BRUc7SUFDSCxpRUFBNkMsQ0FBQTtJQUM3Qzs7T0FFRztJQUNILGlFQUE2QyxDQUFBO0lBQzdDOztPQUVHO0lBQ0gsaUVBQTZDLENBQUE7SUFDN0M7O09BRUc7SUFDSCxxRUFBaUQsQ0FBQTtBQUNuRCxDQUFDLEVBekVXLGdCQUFnQixnQ0FBaEIsZ0JBQWdCLFFB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TUFBTSxFQUFFLGFBQWEsQ0FBQztRQUM1QyxDQUFDLDhCQUFvQixDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUM7UUFDNUMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDO0tBQ3JCLENBQUMsQ0FBQztJQUNILE1BQU0sYUFBYSxHQUF5QixJQUFJLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFFbkYsSUFBSSxhQUFhLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMseUVBQXlFO1FBQ3ZHLE1BQU0sSUFBSSxLQUFLLENBQUMsaUVBQWlFLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3RJLENBQUM7SUFFRCxJQUFJLGFBQWEsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUM7UUFDM0IsTUFBTSxJQUFJLEtBQUssQ0FBQyx5REFBeUQsQ0FBQyxDQUFDO0lBQzdFLENBQUM7SUFFRCxPQUFPLFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBRSxDQUFDO0FBQ3ZELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbnN0YW5jZVR5cGUsIElTZWN1cml0eUdyb3VwLCBTdWJuZXRTZWxlY3Rpb24sIEluc3RhbmNlQXJjaGl0ZWN0dXJlLCBJbnN0YW5jZUNsYXNzLCBJbnN0YW5jZVNpemUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCB7IENmbk5vZGVncm91cCB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1la3MnO1xuaW1wb3J0IHsgSVJvbGUsIE1hbmFnZWRQb2xpY3ksIFBvbGljeVN0YXRlbWVudCwgUm9sZSwgU2VydmljZVByaW5jaXBhbCB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0IHsgSVJlc291cmNlLCBSZXNvdXJjZSwgQW5ub3RhdGlvbnMsIHdpdGhSZXNvbHZlZCwgRmVhdHVyZUZsYWdzIH0gZnJvbSAnYXdzLWNkay1saWIvY29yZSc7XG5pbXBvcnQgeyBhZGRDb25zdHJ1Y3RNZXRhZGF0YSB9IGZyb20gJ2F3cy1jZGstbGliL2NvcmUvbGliL21ldGFkYXRhLXJlc291cmNlJztcbmltcG9ydCB7IHByb3BlcnR5SW5qZWN0YWJsZSB9IGZyb20gJ2F3cy1jZGstbGliL2NvcmUvbGliL3Byb3AtaW5qZWN0YWJsZSc7XG5pbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdhd3MtY2RrLWxpYi9jeC1hcGknO1xuaW1wb3J0IHsgQ29uc3RydWN0LCBOb2RlIH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDbHVzdGVyLCBJQ2x1c3RlciwgSXBGYW1pbHkgfSBmcm9tICcuL2NsdXN0ZXInO1xuaW1wb3J0IHsgaXNHcHVJbnN0YW5jZVR5cGUgfSBmcm9tICcuL3ByaXZhdGUvbm9kZWdyb3VwJztcblxuLyoqXG4gKiBOb2RlR3JvdXAgaW50ZXJmYWNlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSU5vZGVncm91cCBleHRlbmRzIElSZXNvdXJjZSB7XG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoZSBub2RlZ3JvdXBcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgbm9kZWdyb3VwTmFtZTogc3RyaW5nO1xufVxuXG4vKipcbiAqIFRoZSBBTUkgdHlwZSBmb3IgeW91ciBub2RlIGdyb3VwLlxuICpcbiAqIEdQVSBpbnN0YW5jZSB0eXBlcyBzaG91bGQgdXNlIHRoZSBgQUwyX3g4Nl82NF9HUFVgIEFNSSB0eXBlLCB3aGljaCB1c2VzIHRoZVxuICogQW1hem9uIEVLUy1vcHRpbWl6ZWQgTGludXggQU1JIHdpdGggR1BVIHN1cHBvcnQgb3IgdGhlIGBCT1RUTEVST0NLRVRfQVJNXzY0X05WSURJQWAgb3IgYEJPVFRMRVJPQ0tFVF9YODZfNjRfTlZJRElBYFxuICogQU1JIHR5cGVzLCB3aGljaCB1c2VzIHRoZSBBbWF6b24gRUtTLW9wdGltaXplZCBMaW51eCBBTUkgd2l0aCBOdmlkaWEtR1BVIHN1cHBvcnQuXG4gKlxuICogTm9uLUdQVSBpbnN0YW5jZXMgc2hvdWxkIHVzZSB0aGUgYEFMMl94ODZfNjRgIEFNSSB0eXBlLCB3aGljaCB1c2VzIHRoZSBBbWF6b24gRUtTLW9wdGltaXplZCBMaW51eCBBTUkuXG4gKi9cbmV4cG9ydCBlbnVtIE5vZGVncm91cEFtaVR5cGUge1xuICAvKipcbiAgICogQW1hem9uIExpbnV4IDIgKHg4Ni02NClcbiAgICovXG4gIEFMMl9YODZfNjQgPSAnQUwyX3g4Nl82NCcsXG4gIC8qKlxuICAgKiBBbWF6b24gTGludXggMiB3aXRoIEdQVSBzdXBwb3J0XG4gICAqL1xuICBBTDJfWDg2XzY0X0dQVSA9ICdBTDJfeDg2XzY0X0dQVScsXG4gIC8qKlxuICAgKiBBbWF6b24gTGludXggMiAoQVJNLTY0KVxuICAgKi9cbiAgQUwyX0FSTV82NCA9ICdBTDJfQVJNXzY0JyxcbiAgLyoqXG4gICAqICBCb3R0bGVyb2NrZXQgTGludXggKEFSTS02NClcbiAgICovXG4gIEJPVFRMRVJPQ0tFVF9BUk1fNjQgPSAnQk9UVExFUk9DS0VUX0FSTV82NCcsXG4gIC8qKlxuICAgKiBCb3R0bGVyb2NrZXQgKHg4Ni02NClcbiAgICovXG4gIEJPVFRMRVJPQ0tFVF9YODZfNjQgPSAnQk9UVExFUk9DS0VUX3g4Nl82NCcsXG4gIC8qKlxuICAgKiAgQm90dGxlcm9ja2V0IExpbnV4IHdpdGggTnZpZGlhLUdQVSBzdXBwb3J0IChBUk0tNjQpXG4gICAqL1xuICBCT1RUTEVST0NLRVRfQVJNXzY0X05WSURJQSA9ICdCT1RUTEVST0NLRVRfQVJNXzY0X05WSURJQScsXG4gIC8qKlxuICAgKiBCb3R0bGVyb2NrZXQgd2l0aCBOdmlkaWEtR1BVIHN1cHBvcnQgKHg4Ni02NClcbiAgICovXG4gIEJPVFRMRVJPQ0tFVF9YODZfNjRfTlZJRElBID0gJ0JPVFRMRVJPQ0tFVF94ODZfNjRfTlZJRElBJyxcbiAgLyoqXG4gICAqIEJvdHRsZXJvY2tldCBMaW51eCAoQVJNLTY0KSB3aXRoIEZJUFMgZW5hYmxlZFxuICAgKi9cbiAgQk9UVExFUk9DS0VUX0FSTV82NF9GSVBTID0gJ0JPVFRMRVJPQ0tFVF9BUk1fNjRfRklQUycsXG4gIC8qKlxuICAgKiBCb3R0bGVyb2NrZXQgKHg4Ni02NCkgd2l0aCBGSVBTIGVuYWJsZWRcbiAgICovXG4gIEJPVFRMRVJPQ0tFVF9YODZfNjRfRklQUyA9ICdCT1RUTEVST0NLRVRfeDg2XzY0X0ZJUFMnLFxuICAvKipcbiAgICogV2luZG93cyBDb3JlIDIwMTkgKHg4Ni02NClcbiAgICovXG4gIFdJTkRPV1NfQ09SRV8yMDE5X1g4Nl82NCA9ICdXSU5ET1dTX0NPUkVfMjAxOV94ODZfNjQnLFxuICAvKipcbiAgICogV2luZG93cyBDb3JlIDIwMjIgKHg4Ni02NClcbiAgICovXG4gIFdJTkRPV1NfQ09SRV8yMDIyX1g4Nl82NCA9ICdXSU5ET1dTX0NPUkVfMjAyMl94ODZfNjQnLFxuICAvKipcbiAgICogV2luZG93cyBGdWxsIDIwMTkgKHg4Ni02NClcbiAgICovXG4gIFdJTkRPV1NfRlVMTF8yMDE5X1g4Nl82NCA9ICdXSU5ET1dTX0ZVTExfMjAxOV94ODZfNjQnLFxuICAvKipcbiAgICogV2luZG93cyBGdWxsIDIwMjIgKHg4Ni02NClcbiAgICovXG4gIFdJTkRPV1NfRlVMTF8yMDIyX1g4Nl82NCA9ICdXSU5ET1dTX0ZVTExfMjAyMl94ODZfNjQnLFxuICAvKipcbiAgICogQW1hem9uIExpbnV4IDIwMjMgKHg4Ni02NClcbiAgICovXG4gIEFMMjAyM19YODZfNjRfU1RBTkRBUkQgPSAnQUwyMDIzX3g4Nl82NF9TVEFOREFSRCcsXG4gIC8qKlxuICAgKiBBbWF6b24gTGludXggMjAyMyB3aXRoIEFXUyBOZXVyb24gZHJpdmVycyAoeDg2LTY0KVxuICAgKi9cbiAgQUwyMDIzX1g4Nl82NF9ORVVST04gPSAnQUwyMDIzX3g4Nl82NF9ORVVST04nLFxuICAvKipcbiAgICogQW1hem9uIExpbnV4IDIwMjMgd2l0aCBOVklESUEgZHJpdmVycyAoeDg2LTY0KVxuICAgKi9cbiAgQUwyMDIzX1g4Nl82NF9OVklESUEgPSAnQUwyMDIzX3g4Nl82NF9OVklESUEnLFxuICAvKipcbiAgICogQW1hem9uIExpbnV4IDIwMjMgd2l0aCBOVklESUEgZHJpdmVycyAoQVJNLTY0KVxuICAgKi9cbiAgQUwyMDIzX0FSTV82NF9OVklESUEgPSAnQUwyMDIzX0FSTV82NF9OVklESUEnLFxuICAvKipcbiAgICogQW1hem9uIExpbnV4IDIwMjMgKEFSTS02NClcbiAgICovXG4gIEFMMjAyM19BUk1fNjRfU1RBTkRBUkQgPSAnQUwyMDIzX0FSTV82NF9TVEFOREFSRCcsXG59XG5cbi8qKlxuICogQ2FwYWNpdHkgdHlwZSBvZiB0aGUgbWFuYWdlZCBub2RlIGdyb3VwXG4gKi9cbmV4cG9ydCBlbnVtIENhcGFjaXR5VHlwZSB7XG4gIC8qKlxuICAgKiBzcG90IGluc3RhbmNlc1xuICAgKi9cbiAgU1BPVCA9ICdTUE9UJyxcbiAgLyoqXG4gICAqIG9uLWRlbWFuZCBpbnN0YW5jZXNcbiAgICovXG4gIE9OX0RFTUFORCA9ICdPTl9ERU1BTkQnLFxuICAvKipcbiAgICogY2FwYWNpdHkgYmxvY2sgaW5zdGFuY2VzXG4gICAqL1xuICBDQVBBQ0lUWV9CTE9DSyA9ICdDQVBBQ0lUWV9CTE9DSycsXG59XG5cbi8qKlxuICogVGhlIHJlbW90ZSBhY2Nlc3MgKFNTSCkgY29uZmlndXJhdGlvbiB0byB1c2Ugd2l0aCB5b3VyIG5vZGUgZ3JvdXAuXG4gKlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1la3Mtbm9kZWdyb3VwLXJlbW90ZWFjY2Vzcy5odG1sXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTm9kZWdyb3VwUmVtb3RlQWNjZXNzIHtcbiAgLyoqXG4gICAqIFRoZSBBbWF6b24gRUMyIFNTSCBrZXkgdGhhdCBwcm92aWRlcyBhY2Nlc3MgZm9yIFNTSCBjb21tdW5pY2F0aW9uIHdpdGggdGhlIHdvcmtlciBub2RlcyBpbiB0aGUgbWFuYWdlZCBub2RlIGdyb3VwLlxuICAgKi9cbiAgcmVhZG9ubHkgc3NoS2V5TmFtZTogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIHNlY3VyaXR5IGdyb3VwcyB0aGF0IGFyZSBhbGxvd2VkIFNTSCBhY2Nlc3MgKHBvcnQgMjIpIHRvIHRoZSB3b3JrZXIgbm9kZXMuIElmIHlvdSBzcGVjaWZ5IGFuIEFtYXpvbiBFQzIgU1NIXG4gICAqIGtleSBidXQgZG8gbm90IHNwZWNpZnkgYSBzb3VyY2Ugc2VjdXJpdHkgZ3JvdXAgd2hlbiB5b3UgY3JlYXRlIGEgbWFuYWdlZCBub2RlIGdyb3VwLCB0aGVuIHBvcnQgMjIgb24gdGhlIHdvcmtlclxuICAgKiBub2RlcyBpcyBvcGVuZWQgdG8gdGhlIGludGVybmV0ICgwLjAuMC4wLzApLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHBvcnQgMjIgb24gdGhlIHdvcmtlciBub2RlcyBpcyBvcGVuZWQgdG8gdGhlIGludGVybmV0ICgwLjAuMC4wLzApXG4gICAqL1xuICByZWFkb25seSBzb3VyY2VTZWN1cml0eUdyb3Vwcz86IElTZWN1cml0eUdyb3VwW107XG59XG5cbi8qKlxuICogTGF1bmNoIHRlbXBsYXRlIHByb3BlcnR5IHNwZWNpZmljYXRpb25cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMYXVuY2hUZW1wbGF0ZVNwZWMge1xuICAvKipcbiAgICogVGhlIExhdW5jaCB0ZW1wbGF0ZSBJRFxuICAgKi9cbiAgcmVhZG9ubHkgaWQ6IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBsYXVuY2ggdGVtcGxhdGUgdmVyc2lvbiB0byBiZSB1c2VkIChvcHRpb25hbCkuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdGhlIGRlZmF1bHQgdmVyc2lvbiBvZiB0aGUgbGF1bmNoIHRlbXBsYXRlXG4gICAqL1xuICByZWFkb25seSB2ZXJzaW9uPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIEVmZmVjdCB0eXBlcyBvZiBrdWJlcm5ldGVzIG5vZGUgdGFpbnQuXG4gKlxuICogTm90ZTogVGhlc2UgdmFsdWVzIGFyZSBzcGVjaWZpY2FsbHkgZm9yIEFXUyBFS1MgTm9kZUdyb3VwcyBhbmQgdXNlIHRoZSBBV1MgQVBJIGZvcm1hdC5cbiAqIFdoZW4gdXNpbmcgQVdTIENMSSBvciBBUEksIHRhaW50IGVmZmVjdHMgbXVzdCBiZSBOT19TQ0hFRFVMRSwgUFJFRkVSX05PX1NDSEVEVUxFLCBvciBOT19FWEVDVVRFLlxuICogV2hlbiB1c2luZyBLdWJlcm5ldGVzIGRpcmVjdGx5IG9yIGt1YmVjdGwsIHRhaW50IGVmZmVjdHMgbXVzdCBiZSBOb1NjaGVkdWxlLCBQcmVmZXJOb1NjaGVkdWxlLCBvciBOb0V4ZWN1dGUuXG4gKlxuICogRm9yIEt1YmVybmV0ZXMgbWFuaWZlc3RzIChsaWtlIEthcnBlbnRlciBOb2RlUG9vbHMpLCB1c2Ugc3RyaW5nIGxpdGVyYWxzIHdpdGggUGFzY2FsQ2FzZSBmb3JtYXQ6XG4gKiAtICdOb1NjaGVkdWxlJyBpbnN0ZWFkIG9mIFRhaW50RWZmZWN0Lk5PX1NDSEVEVUxFXG4gKiAtICdQcmVmZXJOb1NjaGVkdWxlJyBpbnN0ZWFkIG9mIFRhaW50RWZmZWN0LlBSRUZFUl9OT19TQ0hFRFVMRVxuICogLSAnTm9FeGVjdXRlJyBpbnN0ZWFkIG9mIFRhaW50RWZmZWN0Lk5PX0VYRUNVVEVcbiAqXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9la3MvbGF0ZXN0L3VzZXJndWlkZS9ub2RlLXRhaW50cy1tYW5hZ2VkLW5vZGUtZ3JvdXBzLmh0bWxcbiAqL1xuZXhwb3J0IGVudW0gVGFpbnRFZmZlY3Qge1xuICAvKipcbiAgICogTm9TY2hlZHVsZVxuICAgKi9cbiAgTk9fU0NIRURVTEUgPSAnTk9fU0NIRURVTEUnLFxuICAvKipcbiAgICogUHJlZmVyTm9TY2hlZHVsZVxuICAgKi9cbiAgUFJFRkVSX05PX1NDSEVEVUxFID0gJ1BSRUZFUl9OT19TQ0hFRFVMRScsXG4gIC8qKlxuICAgKiBOb0V4ZWN1dGVcbiAgICovXG4gIE5PX0VYRUNVVEUgPSAnTk9fRVhFQ1VURScsXG59XG5cbi8qKlxuICogVGFpbnQgaW50ZXJmYWNlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGFpbnRTcGVjIHtcbiAgLyoqXG4gICAqIEVmZmVjdCB0eXBlXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgZWZmZWN0PzogVGFpbnRFZmZlY3Q7XG4gIC8qKlxuICAgKiBUYWludCBrZXlcbiAgICpcbiAgICogQGRlZmF1bHQgLSBOb25lXG4gICAqL1xuICByZWFkb25seSBrZXk/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUYWludCB2YWx1ZVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vbmVcbiAgICovXG4gIHJlYWRvbmx5IHZhbHVlPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFRoZSBOb2RlZ3JvdXAgT3B0aW9ucyBmb3IgYWRkTm9kZUdyb3VwKCkgbWV0aG9kXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTm9kZWdyb3VwT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoZSBOb2RlZ3JvdXBcbiAgICpcbiAgICogQGRlZmF1bHQgLSByZXNvdXJjZSBJRFxuICAgKi9cbiAgcmVhZG9ubHkgbm9kZWdyb3VwTmFtZT86IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBzdWJuZXRzIHRvIHVzZSBmb3IgdGhlIEF1dG8gU2NhbGluZyBncm91cCB0aGF0IGlzIGNyZWF0ZWQgZm9yIHlvdXIgbm9kZSBncm91cC4gQnkgc3BlY2lmeWluZyB0aGVcbiAgICogU3VibmV0U2VsZWN0aW9uLCB0aGUgc2VsZWN0ZWQgc3VibmV0cyB3aWxsIGF1dG9tYXRpY2FsbHkgYXBwbHkgcmVxdWlyZWQgdGFncyBpLmUuXG4gICAqIGBrdWJlcm5ldGVzLmlvL2NsdXN0ZXIvQ0xVU1RFUl9OQU1FYCB3aXRoIGEgdmFsdWUgb2YgYHNoYXJlZGAsIHdoZXJlIGBDTFVTVEVSX05BTUVgIGlzIHJlcGxhY2VkIHdpdGhcbiAgICogdGhlIG5hbWUgb2YgeW91ciBjbHVzdGVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHByaXZhdGUgc3VibmV0c1xuICAgKi9cbiAgcmVhZG9ubHkgc3VibmV0cz86IFN1Ym5ldFNlbGVjdGlvbjtcbiAgLyoqXG4gICAqIFRoZSBBTUkgdHlwZSBmb3IgeW91ciBub2RlIGdyb3VwLiBJZiB5b3UgZXhwbGljaXRseSBzcGVjaWZ5IHRoZSBsYXVuY2hUZW1wbGF0ZSB3aXRoIGN1c3RvbSBBTUksIGRvIG5vdCBzcGVjaWZ5IHRoaXMgcHJvcGVydHksIG9yXG4gICAqIHRoZSBub2RlIGdyb3VwIGRlcGxveW1lbnQgd2lsbCBmYWlsLiBJbiBvdGhlciBjYXNlcywgeW91IHdpbGwgbmVlZCB0byBzcGVjaWZ5IGNvcnJlY3QgYW1pVHlwZSBmb3IgdGhlIG5vZGVncm91cC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBhdXRvLWRldGVybWluZWQgZnJvbSB0aGUgaW5zdGFuY2VUeXBlcyBwcm9wZXJ0eSB3aGVuIGxhdW5jaFRlbXBsYXRlU3BlYyBwcm9wZXJ0eSBpcyBub3Qgc3BlY2lmaWVkXG4gICAqL1xuICByZWFkb25seSBhbWlUeXBlPzogTm9kZWdyb3VwQW1pVHlwZTtcbiAgLyoqXG4gICAqIFRoZSByb290IGRldmljZSBkaXNrIHNpemUgKGluIEdpQikgZm9yIHlvdXIgbm9kZSBncm91cCBpbnN0YW5jZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IDIwXG4gICAqL1xuICByZWFkb25seSBkaXNrU2l6ZT86IG51bWJlcjtcbiAgLyoqXG4gICAqIFRoZSBjdXJyZW50IG51bWJlciBvZiB3b3JrZXIgbm9kZXMgdGhhdCB0aGUgbWFuYWdlZCBub2RlIGdyb3VwIHNob3VsZCBtYWludGFpbi4gSWYgbm90IHNwZWNpZmllZCxcbiAgICogdGhlIG5vZGV3Z3JvdXAgd2lsbCBpbml0aWFsbHkgY3JlYXRlIGBtaW5TaXplYCBpbnN0YW5jZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IDJcbiAgICovXG4gIHJlYWRvbmx5IGRlc2lyZWRTaXplPzogbnVtYmVyO1xuICAvKipcbiAgICogVGhlIG1heGltdW0gbnVtYmVyIG9mIHdvcmtlciBub2RlcyB0aGF0IHRoZSBtYW5hZ2VkIG5vZGUgZ3JvdXAgY2FuIHNjYWxlIG91dCB0by4gTWFuYWdlZCBub2RlIGdyb3VwcyBjYW4gc3VwcG9ydCB1cCB0byAxMDAgbm9kZXMgYnkgZGVmYXVsdC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBzYW1lIGFzIGRlc2lyZWRTaXplIHByb3BlcnR5XG4gICAqL1xuICByZWFkb25seSBtYXhTaXplPzogbnVtYmVyO1xuICAvKipcbiAgICogVGhlIG1pbmltdW0gbnVtYmVyIG9mIHdvcmtlciBub2RlcyB0aGF0IHRoZSBtYW5hZ2VkIG5vZGUgZ3JvdXAgY2FuIHNjYWxlIGluIHRvLiBUaGlzIG51bWJlciBtdXN0IGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB6ZXJvLlxuICAgKlxuICAgKiBAZGVmYXVsdCAxXG4gICAqL1xuICByZWFkb25seSBtaW5TaXplPzogbnVtYmVyO1xuICAvKipcbiAgICogRm9yY2UgdGhlIHVwZGF0ZSBpZiB0aGUgZXhpc3Rpbmcgbm9kZSBncm91cCdzIHBvZHMgYXJlIHVuYWJsZSB0byBiZSBkcmFpbmVkIGR1ZSB0byBhIHBvZCBkaXNydXB0aW9uIGJ1ZGdldCBpc3N1ZS5cbiAgICogSWYgYW4gdXBkYXRlIGZhaWxzIGJlY2F1c2UgcG9kcyBjb3VsZCBub3QgYmUgZHJhaW5lZCwgeW91IGNhbiBmb3JjZSB0aGUgdXBkYXRlIGFmdGVyIGl0IGZhaWxzIHRvIHRlcm1pbmF0ZSB0aGUgb2xkXG4gICAqIG5vZGUgd2hldGhlciBvciBub3QgYW55IHBvZHMgYXJlXG4gICAqIHJ1bm5pbmcgb24gdGhlIG5vZGUuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IGZvcmNlVXBkYXRlPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFRoZSBpbnN0YW5jZSB0eXBlIHRvIHVzZSBmb3IgeW91ciBub2RlIGdyb3VwLiBDdXJyZW50bHksIHlvdSBjYW4gc3BlY2lmeSBhIHNpbmdsZSBpbnN0YW5jZSB0eXBlIGZvciBhIG5vZGUgZ3JvdXAuXG4gICAqIFRoZSBkZWZhdWx0IHZhbHVlIGZvciB0aGlzIHBhcmFtZXRlciBpcyBgdDMubWVkaXVtYC4gSWYgeW91IGNob29zZSBhIEdQVSBpbnN0YW5jZSB0eXBlLCBiZSBzdXJlIHRvIHNwZWNpZnkgdGhlXG4gICAqIGBBTDJfeDg2XzY0X0dQVWAsIGBCT1RUTEVST0NLRVRfQVJNXzY0X05WSURJQWAsIG9yIGBCT1RUTEVST0NLRVRfeDg2XzY0X05WSURJQWAgd2l0aCB0aGUgYW1pVHlwZSBwYXJhbWV0ZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IHQzLm1lZGl1bVxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGluc3RhbmNlVHlwZXNgIGluc3RlYWQuXG4gICAqL1xuICByZWFkb25seSBpbnN0YW5jZVR5cGU/OiBJbnN0YW5jZVR5cGU7XG4gIC8qKlxuICAgKiBUaGUgaW5zdGFuY2UgdHlwZXMgdG8gdXNlIGZvciB5b3VyIG5vZGUgZ3JvdXAuXG4gICAqIEBkZWZhdWx0IHQzLm1lZGl1bSB3aWxsIGJlIHVzZWQgYWNjb3JkaW5nIHRvIHRoZSBjbG91ZGZvcm1hdGlvbiBkb2N1bWVudC5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZWtzLW5vZGVncm91cC5odG1sI2Nmbi1la3Mtbm9kZWdyb3VwLWluc3RhbmNldHlwZXNcbiAgICovXG4gIHJlYWRvbmx5IGluc3RhbmNlVHlwZXM/OiBJbnN0YW5jZVR5cGVbXTtcbiAgLyoqXG4gICAqIFRoZSBLdWJlcm5ldGVzIGxhYmVscyB0byBiZSBhcHBsaWVkIHRvIHRoZSBub2RlcyBpbiB0aGUgbm9kZSBncm91cCB3aGVuIHRoZXkgYXJlIGNyZWF0ZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgbGFiZWxzPzogeyBbbmFtZTogc3RyaW5nXTogc3RyaW5nIH07XG4gIC8qKlxuICAgKiBUaGUgS3ViZXJuZXRlcyB0YWludHMgdG8gYmUgYXBwbGllZCB0byB0aGUgbm9kZXMgaW4gdGhlIG5vZGUgZ3JvdXAgd2hlbiB0aGV5IGFyZSBjcmVhdGVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vbmVcbiAgICovXG4gIHJlYWRvbmx5IHRhaW50cz86IFRhaW50U3BlY1tdO1xuICAvKipcbiAgICogVGhlIElBTSByb2xlIHRvIGFzc29jaWF0ZSB3aXRoIHlvdXIgbm9kZSBncm91cC4gVGhlIEFtYXpvbiBFS1Mgd29ya2VyIG5vZGUga3ViZWxldCBkYWVtb25cbiAgICogbWFrZXMgY2FsbHMgdG8gQVdTIEFQSXMgb24geW91ciBiZWhhbGYuIFdvcmtlciBub2RlcyByZWNlaXZlIHBlcm1pc3Npb25zIGZvciB0aGVzZSBBUEkgY2FsbHMgdGhyb3VnaFxuICAgKiBhbiBJQU0gaW5zdGFuY2UgcHJvZmlsZSBhbmQgYXNzb2NpYXRlZCBwb2xpY2llcy4gQmVmb3JlIHlvdSBjYW4gbGF1bmNoIHdvcmtlciBub2RlcyBhbmQgcmVnaXN0ZXIgdGhlbVxuICAgKiBpbnRvIGEgY2x1c3RlciwgeW91IG11c3QgY3JlYXRlIGFuIElBTSByb2xlIGZvciB0aG9zZSB3b3JrZXIgbm9kZXMgdG8gdXNlIHdoZW4gdGhleSBhcmUgbGF1bmNoZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm9uZS4gQXV0by1nZW5lcmF0ZWQgaWYgbm90IHNwZWNpZmllZC5cbiAgICovXG4gIHJlYWRvbmx5IG5vZGVSb2xlPzogSVJvbGU7XG4gIC8qKlxuICAgKiBUaGUgQU1JIHZlcnNpb24gb2YgdGhlIEFtYXpvbiBFS1Mtb3B0aW1pemVkIEFNSSB0byB1c2Ugd2l0aCB5b3VyIG5vZGUgZ3JvdXAgKGZvciBleGFtcGxlLCBgMS4xNC43LVlZWVlNTUREYCkuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gVGhlIGxhdGVzdCBhdmFpbGFibGUgQU1JIHZlcnNpb24gZm9yIHRoZSBub2RlIGdyb3VwJ3MgY3VycmVudCBLdWJlcm5ldGVzIHZlcnNpb24gaXMgdXNlZC5cbiAgICovXG4gIHJlYWRvbmx5IHJlbGVhc2VWZXJzaW9uPzogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIHJlbW90ZSBhY2Nlc3MgKFNTSCkgY29uZmlndXJhdGlvbiB0byB1c2Ugd2l0aCB5b3VyIG5vZGUgZ3JvdXAuIERpc2FibGVkIGJ5IGRlZmF1bHQsIGhvd2V2ZXIsIGlmIHlvdVxuICAgKiBzcGVjaWZ5IGFuIEFtYXpvbiBFQzIgU1NIIGtleSBidXQgZG8gbm90IHNwZWNpZnkgYSBzb3VyY2Ugc2VjdXJpdHkgZ3JvdXAgd2hlbiB5b3UgY3JlYXRlIGEgbWFuYWdlZCBub2RlIGdyb3VwLFxuICAgKiB0aGVuIHBvcnQgMjIgb24gdGhlIHdvcmtlciBub2RlcyBpcyBvcGVuZWQgdG8gdGhlIGludGVybmV0ICgwLjAuMC4wLzApXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gZGlzYWJsZWRcbiAgICovXG4gIHJlYWRvbmx5IHJlbW90ZUFjY2Vzcz86IE5vZGVncm91cFJlbW90ZUFjY2VzcztcbiAgLyoqXG4gICAqIFRoZSBtZXRhZGF0YSB0byBhcHBseSB0byB0aGUgbm9kZSBncm91cCB0byBhc3Npc3Qgd2l0aCBjYXRlZ29yaXphdGlvbiBhbmQgb3JnYW5pemF0aW9uLiBFYWNoIHRhZyBjb25zaXN0cyBvZlxuICAgKiBhIGtleSBhbmQgYW4gb3B0aW9uYWwgdmFsdWUsIGJvdGggb2Ygd2hpY2ggeW91IGRlZmluZS4gTm9kZSBncm91cCB0YWdzIGRvIG5vdCBwcm9wYWdhdGUgdG8gYW55IG90aGVyIHJlc291cmNlc1xuICAgKiBhc3NvY2lhdGVkIHdpdGggdGhlIG5vZGUgZ3JvdXAsIHN1Y2ggYXMgdGhlIEFtYXpvbiBFQzIgaW5zdGFuY2VzIG9yIHN1Ym5ldHMuXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vbmVcbiAgICovXG4gIHJlYWRvbmx5IHRhZ3M/OiB7IFtuYW1lOiBzdHJpbmddOiBzdHJpbmcgfTtcbiAgLyoqXG4gICAqIExhdW5jaCB0ZW1wbGF0ZSBzcGVjaWZpY2F0aW9uIHVzZWQgZm9yIHRoZSBub2RlZ3JvdXBcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZWtzL2xhdGVzdC91c2VyZ3VpZGUvbGF1bmNoLXRlbXBsYXRlcy5odG1sXG4gICAqIEBkZWZhdWx0IC0gbm8gbGF1bmNoIHRlbXBsYXRlXG4gICAqL1xuICByZWFkb25seSBsYXVuY2hUZW1wbGF0ZVNwZWM/OiBMYXVuY2hUZW1wbGF0ZVNwZWM7XG4gIC8qKlxuICAgKiBUaGUgY2FwYWNpdHkgdHlwZSBvZiB0aGUgbm9kZWdyb3VwLlxuICAgKlxuICAgKiBAZGVmYXVsdCBDYXBhY2l0eVR5cGUuT05fREVNQU5EXG4gICAqL1xuICByZWFkb25seSBjYXBhY2l0eVR5cGU/OiBDYXBhY2l0eVR5cGU7XG5cbiAgLyoqXG4gICAqIFRoZSBtYXhpbXVtIG51bWJlciBvZiBub2RlcyB1bmF2YWlsYWJsZSBhdCBvbmNlIGR1cmluZyBhIHZlcnNpb24gdXBkYXRlLlxuICAgKiBOb2RlcyB3aWxsIGJlIHVwZGF0ZWQgaW4gcGFyYWxsZWwuIFRoZSBtYXhpbXVtIG51bWJlciBpcyAxMDAuXG4gICAqXG4gICAqIFRoaXMgdmFsdWUgb3IgYG1heFVuYXZhaWxhYmxlUGVyY2VudGFnZWAgaXMgcmVxdWlyZWQgdG8gaGF2ZSBhIHZhbHVlIGZvciBjdXN0b20gdXBkYXRlIGNvbmZpZ3VyYXRpb25zIHRvIGJlIGFwcGxpZWQuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZWtzLW5vZGVncm91cC11cGRhdGVjb25maWcuaHRtbCNjZm4tZWtzLW5vZGVncm91cC11cGRhdGVjb25maWctbWF4dW5hdmFpbGFibGVcbiAgICogQGRlZmF1bHQgMVxuICAgKi9cbiAgcmVhZG9ubHkgbWF4VW5hdmFpbGFibGU/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBtYXhpbXVtIHBlcmNlbnRhZ2Ugb2Ygbm9kZXMgdW5hdmFpbGFibGUgZHVyaW5nIGEgdmVyc2lvbiB1cGRhdGUuXG4gICAqIFRoaXMgcGVyY2VudGFnZSBvZiBub2RlcyB3aWxsIGJlIHVwZGF0ZWQgaW4gcGFyYWxsZWwsIHVwIHRvIDEwMCBub2RlcyBhdCBvbmNlLlxuICAgKlxuICAgKiBUaGlzIHZhbHVlIG9yIGBtYXhVbmF2YWlsYWJsZWAgaXMgcmVxdWlyZWQgdG8gaGF2ZSBhIHZhbHVlIGZvciBjdXN0b20gdXBkYXRlIGNvbmZpZ3VyYXRpb25zIHRvIGJlIGFwcGxpZWQuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZWtzLW5vZGVncm91cC11cGRhdGVjb25maWcuaHRtbCNjZm4tZWtzLW5vZGVncm91cC11cGRhdGVjb25maWctbWF4dW5hdmFpbGFibGVwZXJjZW50YWdlXG4gICAqIEBkZWZhdWx0IHVuZGVmaW5lZCAtIG5vZGUgZ3JvdXBzIHdpbGwgdXBkYXRlIGluc3RhbmNlcyBvbmUgYXQgYSB0aW1lXG4gICAqL1xuICByZWFkb25seSBtYXhVbmF2YWlsYWJsZVBlcmNlbnRhZ2U/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyB3aGV0aGVyIHRvIGVuYWJsZSBub2RlIGF1dG8gcmVwYWlyIGZvciB0aGUgbm9kZSBncm91cC4gTm9kZSBhdXRvIHJlcGFpciBpcyBkaXNhYmxlZCBieSBkZWZhdWx0LlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9la3MvbGF0ZXN0L3VzZXJndWlkZS9ub2RlLWhlYWx0aC5odG1sI25vZGUtYXV0by1yZXBhaXJcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGVuYWJsZU5vZGVBdXRvUmVwYWlyPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBOb2RlR3JvdXAgcHJvcGVydGllcyBpbnRlcmZhY2VcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOb2RlZ3JvdXBQcm9wcyBleHRlbmRzIE5vZGVncm91cE9wdGlvbnMge1xuICAvKipcbiAgICogQ2x1c3RlciByZXNvdXJjZVxuICAgKi9cbiAgcmVhZG9ubHkgY2x1c3RlcjogSUNsdXN0ZXI7XG59XG5cbi8qKlxuICogVGhlIE5vZGVncm91cCByZXNvdXJjZSBjbGFzc1xuICogQHJlc291cmNlIEFXUzo6RUtTOjpOb2RlZ3JvdXBcbiAqL1xuQHByb3BlcnR5SW5qZWN0YWJsZVxuZXhwb3J0IGNsYXNzIE5vZGVncm91cCBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSU5vZGVncm91cCB7XG4gIC8qKiBVbmlxdWVseSBpZGVudGlmaWVzIHRoaXMgY2xhc3MuICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUFJPUEVSVFlfSU5KRUNUSU9OX0lEOiBzdHJpbmcgPSAnQGF3cy1jZGsuYXdzLWVrcy12Mi1hbHBoYS5Ob2RlZ3JvdXAnO1xuXG4gIC8qKlxuICAgKiBJbXBvcnQgdGhlIE5vZGVncm91cCBmcm9tIGF0dHJpYnV0ZXNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbU5vZGVncm91cE5hbWUoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgbm9kZWdyb3VwTmFtZTogc3RyaW5nKTogSU5vZGVncm91cCB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJTm9kZWdyb3VwIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBub2RlZ3JvdXBOYW1lID0gbm9kZWdyb3VwTmFtZTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkKTtcbiAgfVxuICAvKipcbiAgICogQVJOIG9mIHRoZSBub2RlZ3JvdXBcbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IG5vZGVncm91cEFybjogc3RyaW5nO1xuICAvKipcbiAgICogTm9kZWdyb3VwIG5hbWVcbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IG5vZGVncm91cE5hbWU6IHN0cmluZztcbiAgLyoqXG4gICAqIHRoZSBBbWF6b24gRUtTIGNsdXN0ZXIgcmVzb3VyY2VcbiAgICpcbiAgICogQGF0dHJpYnV0ZSBDbHVzdGVyTmFtZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNsdXN0ZXI6IElDbHVzdGVyO1xuICAvKipcbiAgICogSUFNIHJvbGUgb2YgdGhlIGluc3RhbmNlIHByb2ZpbGUgZm9yIHRoZSBub2RlZ3JvdXBcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSByb2xlOiBJUm9sZTtcblxuICBwcml2YXRlIHJlYWRvbmx5IGRlc2lyZWRTaXplOiBudW1iZXI7XG4gIHByaXZhdGUgcmVhZG9ubHkgbWF4U2l6ZTogbnVtYmVyO1xuICBwcml2YXRlIHJlYWRvbmx5IG1pblNpemU6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTm9kZWdyb3VwUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHMubm9kZWdyb3VwTmFtZSxcbiAgICB9KTtcbiAgICAvLyBFbmhhbmNlZCBDREsgQW5hbHl0aWNzIFRlbGVtZXRyeVxuICAgIGFkZENvbnN0cnVjdE1ldGFkYXRhKHRoaXMsIHByb3BzKTtcblxuICAgIHRoaXMuY2x1c3RlciA9IHByb3BzLmNsdXN0ZXI7XG5cbiAgICB0aGlzLmRlc2lyZWRTaXplID0gcHJvcHMuZGVzaXJlZFNpemUgPz8gcHJvcHMubWluU2l6ZSA/PyAyO1xuICAgIHRoaXMubWF4U2l6ZSA9IHByb3BzLm1heFNpemUgPz8gdGhpcy5kZXNpcmVkU2l6ZTtcbiAgICB0aGlzLm1pblNpemUgPSBwcm9wcy5taW5TaXplID8/IDE7XG5cbiAgICB3aXRoUmVzb2x2ZWQodGhpcy5kZXNpcmVkU2l6ZSwgdGhpcy5tYXhTaXplLCAoZGVzaXJlZCwgbWF4KSA9PiB7XG4gICAgICBpZiAoZGVzaXJlZCA9PT0gdW5kZWZpbmVkKSB7cmV0dXJuIDt9XG4gICAgICBpZiAoZGVzaXJlZCA+IG1heCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYERlc2lyZWQgY2FwYWNpdHkgJHtkZXNpcmVkfSBjYW4ndCBiZSBncmVhdGVyIHRoYW4gbWF4IHNpemUgJHttYXh9YCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB3aXRoUmVzb2x2ZWQodGhpcy5kZXNpcmVkU2l6ZSwgdGhpcy5taW5TaXplLCAoZGVzaXJlZCwgbWluKSA9PiB7XG4gICAgICBpZiAoZGVzaXJlZCA9PT0gdW5kZWZpbmVkKSB7cmV0dXJuIDt9XG4gICAgICBpZiAoZGVzaXJlZCA8IG1pbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE1pbmltdW0gY2FwYWNpdHkgJHttaW59IGNhbid0IGJlIGdyZWF0ZXIgdGhhbiBkZXNpcmVkIHNpemUgJHtkZXNpcmVkfWApO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHByb3BzLmxhdW5jaFRlbXBsYXRlU3BlYyAmJiBwcm9wcy5kaXNrU2l6ZSkge1xuICAgICAgLy8gc2VlIC0gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Vrcy9sYXRlc3QvdXNlcmd1aWRlL2xhdW5jaC10ZW1wbGF0ZXMuaHRtbFxuICAgICAgLy8gYW5kIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1la3Mtbm9kZWdyb3VwLmh0bWwjY2ZuLWVrcy1ub2RlZ3JvdXAtZGlza3NpemVcbiAgICAgIHRocm93IG5ldyBFcnJvcignZGlza1NpemUgbXVzdCBiZSBzcGVjaWZpZWQgd2l0aGluIHRoZSBsYXVuY2ggdGVtcGxhdGUnKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMuaW5zdGFuY2VUeXBlICYmIHByb3BzLmluc3RhbmNlVHlwZXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignXCJpbnN0YW5jZVR5cGUgaXMgZGVwcmVjYXRlZCwgcGxlYXNlIHVzZSBcImluc3RhbmNlVHlwZXNcIiBvbmx5LicpO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5pbnN0YW5jZVR5cGUpIHtcbiAgICAgIEFubm90YXRpb25zLm9mKHRoaXMpLmFkZFdhcm5pbmdWMignQGF3cy1jZGsvYXdzLWVrczptYW5hZ2VkTm9kZUdyb3VwRGVwcmVjYXRlZEluc3RhbmNlVHlwZScsICdcImluc3RhbmNlVHlwZVwiIGlzIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgbmV4dCBtYWpvciB2ZXJzaW9uLiBwbGVhc2UgdXNlIFwiaW5zdGFuY2VUeXBlc1wiIGluc3RlYWQnKTtcbiAgICB9XG4gICAgY29uc3QgaW5zdGFuY2VUeXBlcyA9IHByb3BzLmluc3RhbmNlVHlwZXMgPz8gKHByb3BzLmluc3RhbmNlVHlwZSA/IFtwcm9wcy5pbnN0YW5jZVR5cGVdIDogdW5kZWZpbmVkKTtcbiAgICBsZXQgcG9zc2libGVBbWlUeXBlczogTm9kZWdyb3VwQW1pVHlwZVtdID0gW107XG5cbiAgICBpZiAoaW5zdGFuY2VUeXBlcyAmJiBpbnN0YW5jZVR5cGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIC8qKlxuICAgICAgICogaWYgdGhlIHVzZXIgZXhwbGljaXRseSBjb25maWd1cmVkIGluc3RhbmNlIHR5cGVzLCB3ZSBjYW4ndCBjYWN1bGF0ZSB0aGUgZXhwZWN0ZWQgYW1pIHR5cGUgYXMgd2Ugc3VwcG9ydFxuICAgICAgICogQW1hem9uIExpbnV4IDIsIEJvdHRsZXJvY2tldCwgYW5kIFdpbmRvd3Mgbm93LiBIb3dldmVyIHdlIGNhbiBjaGVjazpcbiAgICAgICAqXG4gICAgICAgKiAxLiBpbnN0YW5jZSB0eXBlcyBvZiBkaWZmZXJlbnQgQ1BVIGFyY2hpdGVjdHVyZXMgYXJlIG5vdCBtaXhlZChlLmcuIFg4NiB3aXRoIEFSTSkuXG4gICAgICAgKiAyLiB1c2VyLXNwZWNpZmllZCBhbWlUeXBlIHNob3VsZCBiZSBpbmNsdWRlZCBpbiBgcG9zc2libGVBbWlUeXBlc2AuXG4gICAgICAgKi9cbiAgICAgIHBvc3NpYmxlQW1pVHlwZXMgPSBnZXRQb3NzaWJsZUFtaVR5cGVzKGluc3RhbmNlVHlwZXMpO1xuXG4gICAgICAvLyBpZiB0aGUgdXNlciBleHBsaWNpdGx5IGNvbmZpZ3VyZWQgYW4gYW1pIHR5cGUsIG1ha2Ugc3VyZSBpdCdzIGluY2x1ZGVkIGluIHRoZSBwb3NzaWJsZUFtaVR5cGVzXG4gICAgICBpZiAocHJvcHMuYW1pVHlwZSAmJiAhcG9zc2libGVBbWlUeXBlcy5pbmNsdWRlcyhwcm9wcy5hbWlUeXBlKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBzcGVjaWZpZWQgQU1JIGRvZXMgbm90IG1hdGNoIHRoZSBpbnN0YW5jZSB0eXBlcyBhcmNoaXRlY3R1cmUsIGVpdGhlciBzcGVjaWZ5IG9uZSBvZiAke3Bvc3NpYmxlQW1pVHlwZXMuam9pbignLCAnKS50b1VwcGVyQ2FzZSgpfSBvciBkb24ndCBzcGVjaWZ5IGFueWApO1xuICAgICAgfVxuXG4gICAgICAvLyBpZiB0aGUgdXNlciBleHBsaWNpdGx5IGNvbmZpZ3VyZWQgYSBXaW5kb3dzIGFtaSB0eXBlLCBtYWtlIHN1cmUgdGhlIGluc3RhbmNlVHlwZSBpcyBhbGxvd2VkXG4gICAgICBpZiAocHJvcHMuYW1pVHlwZSAmJiB3aW5kb3dzQW1pVHlwZXMuaW5jbHVkZXMocHJvcHMuYW1pVHlwZSkgJiZcbiAgICAgIGluc3RhbmNlVHlwZXMuZmlsdGVyKGlzV2luZG93c1N1cHBvcnRlZEluc3RhbmNlVHlwZSkubGVuZ3RoIDwgaW5zdGFuY2VUeXBlcy5sZW5ndGgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgc3BlY2lmaWVkIGluc3RhbmNlVHlwZSBkb2VzIG5vdCBzdXBwb3J0IFdpbmRvd3Mgd29ya2xvYWRzLiAnXG4gICAgICAgICsgJ0FtYXpvbiBFQzIgaW5zdGFuY2UgdHlwZXMgQzMsIEM0LCBEMiwgSTIsIE00IChleGNsdWRpbmcgbTQuMTZ4bGFyZ2UpLCBNNmEueCwgYW5kICdcbiAgICAgICAgKyAnUjMgaW5zdGFuY2VzIGFyZW5cXCd0IHN1cHBvcnRlZCBmb3IgV2luZG93cyB3b3JrbG9hZHMuJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFwcm9wcy5ub2RlUm9sZSkge1xuICAgICAgY29uc3QgbmdSb2xlID0gbmV3IFJvbGUodGhpcywgJ05vZGVHcm91cFJvbGUnLCB7XG4gICAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ2VjMi5hbWF6b25hd3MuY29tJyksXG4gICAgICB9KTtcblxuICAgICAgbmdSb2xlLmFkZE1hbmFnZWRQb2xpY3koTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ0FtYXpvbkVLU1dvcmtlck5vZGVQb2xpY3knKSk7XG4gICAgICBuZ1JvbGUuYWRkTWFuYWdlZFBvbGljeShNYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnQW1hem9uRUtTX0NOSV9Qb2xpY3knKSk7XG4gICAgICBuZ1JvbGUuYWRkTWFuYWdlZFBvbGljeShNYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnQW1hem9uRUMyQ29udGFpbmVyUmVnaXN0cnlSZWFkT25seScpKTtcblxuICAgICAgLy8gR3JhbnQgYWRkaXRpb25hbCBJUHY2IG5ldHdvcmtpbmcgcGVybWlzc2lvbnMgaWYgcnVubmluZyBpbiBJUHY2XG4gICAgICAvLyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZWtzL2xhdGVzdC91c2VyZ3VpZGUvY25pLWlhbS1yb2xlLmh0bWxcbiAgICAgIGlmIChwcm9wcy5jbHVzdGVyLmlwRmFtaWx5ID09IElwRmFtaWx5LklQX1Y2KSB7XG4gICAgICAgIG5nUm9sZS5hZGRUb1ByaW5jaXBhbFBvbGljeShuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQGNka2xhYnMvbm8tbGl0ZXJhbC1wYXJ0aXRpb25cbiAgICAgICAgICByZXNvdXJjZXM6IFsnYXJuOmF3czplYzI6KjoqOm5ldHdvcmstaW50ZXJmYWNlLyonXSxcbiAgICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgICAnZWMyOkFzc2lnbklwdjZBZGRyZXNzZXMnLFxuICAgICAgICAgICAgJ2VjMjpVbmFzc2lnbklwdjZBZGRyZXNzZXMnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucm9sZSA9IG5nUm9sZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yb2xlID0gcHJvcHMubm9kZVJvbGU7XG4gICAgfVxuXG4gICAgdGhpcy52YWxpZGF0ZVVwZGF0ZUNvbmZpZyhwcm9wcy5tYXhVbmF2YWlsYWJsZSwgcHJvcHMubWF4VW5hdmFpbGFibGVQZXJjZW50YWdlKTtcblxuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IENmbk5vZGVncm91cCh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBjbHVzdGVyTmFtZTogdGhpcy5jbHVzdGVyLmNsdXN0ZXJOYW1lLFxuICAgICAgbm9kZWdyb3VwTmFtZTogcHJvcHMubm9kZWdyb3VwTmFtZSxcbiAgICAgIG5vZGVSb2xlOiB0aGlzLnJvbGUucm9sZUFybixcbiAgICAgIHN1Ym5ldHM6IHRoaXMuY2x1c3Rlci52cGMuc2VsZWN0U3VibmV0cyhwcm9wcy5zdWJuZXRzKS5zdWJuZXRJZHMsXG4gICAgICAvKipcbiAgICAgICAqIENhc2UgMTogSWYgbGF1bmNoVGVtcGxhdGUgaXMgZXhwbGljaXRseSBzcGVjaWZpZWQgd2l0aCBjdXN0b20gQU1JLCB3ZSBjYW5ub3Qgc3BlY2lmeSBhbWlUeXBlLCBvciB0aGUgbm9kZSBncm91cCBkZXBsb3ltZW50IHdpbGwgZmFpbC5cbiAgICAgICAqIEFzIHdlIGRvbid0IGtub3cgaWYgdGhlIGN1c3RvbSBBTUkgaXMgc3BlY2lmaWVkIGluIHRoZSBsYXVjaFRlbXBsYXRlLCB3ZSBqdXN0IHVzZSBwcm9wcy5hbWlUeXBlLlxuICAgICAgICpcbiAgICAgICAqIENhc2UgMjogSWYgbGF1bmNoVGVtcGxhdGUgaXMgbm90IHNwZWNpZmllZCwgd2UgdHJ5IHRvIGRldGVybWluZSBhbWlUeXBlIGZyb20gdGhlIGluc3RhbmNlVHlwZXMgYW5kIGl0IGNvdWxkIGJlIGVpdGhlciBBTDIgb3IgQm90dGxlcm9ja2V0LlxuICAgICAgICogVG8gYXZvaWQgYnJlYWtpbmcgY2hhbmdlcywgd2UgdXNlIHBvc3NpYmxlQW1pVHlwZXNbMF0gaWYgYW1pVHlwZSBpcyB1bmRlZmluZWQgYW5kIG1ha2Ugc3VyZSBBTDIgaXMgYWx3YXlzIHRoZSBmaXJzdCBlbGVtZW50IGluIHBvc3NpYmxlQW1pVHlwZXNcbiAgICAgICAqIGFzIEFMMiBpcyBwcmV2aW91c2x5IHRoZSBgZXhwZWN0ZWRBbWlgIGFuZCB0aGlzIGF2b2lkcyBicmVha2luZyBjaGFuZ2VzLlxuICAgICAgICpcbiAgICAgICAqIFRoYXQgYmVpbmcgc2FpZCwgdXNlcnMgbm93IGVpdGhlciBoYXZlIHRvIGV4cGxpY2l0bHkgc3BlY2lmeSBjb3JyZWN0IGFtaVR5cGUgb3IganVzdCBsZWF2ZSBpdCB1bmRlZmluZWQuXG4gICAgICAgKi9cbiAgICAgIGFtaVR5cGU6IHByb3BzLmxhdW5jaFRlbXBsYXRlU3BlYyA/IHByb3BzLmFtaVR5cGUgOiAocHJvcHMuYW1pVHlwZSA/PyBwb3NzaWJsZUFtaVR5cGVzWzBdKSxcbiAgICAgIGNhcGFjaXR5VHlwZTogcHJvcHMuY2FwYWNpdHlUeXBlID8gcHJvcHMuY2FwYWNpdHlUeXBlLnZhbHVlT2YoKSA6IHVuZGVmaW5lZCxcbiAgICAgIGRpc2tTaXplOiBwcm9wcy5kaXNrU2l6ZSxcbiAgICAgIGZvcmNlVXBkYXRlRW5hYmxlZDogcHJvcHMuZm9yY2VVcGRhdGUgPz8gdHJ1ZSxcblxuICAgICAgLy8gbm90ZSB0aGF0IHdlIGRvbid0IGNoZWNrIGlmIGEgbGF1bmNoIHRlbXBsYXRlIGlzIGNvbmZpZ3VyZWQgaGVyZSAoZXZlbiB0aG91Z2ggaXQgbWlnaHQgY29uZmlndXJlIGluc3RhbmNlIHR5cGVzIGFzIHdlbGwpXG4gICAgICAvLyBiZWNhdXNlIHRoaXMgZG9lc24ndCBoYXZlIGEgZGVmYXVsdCB2YWx1ZSwgbWVhbmluZyB0aGUgdXNlciBoYWQgdG8gZXhwbGljaXRseSBjb25maWd1cmUgdGhpcy5cbiAgICAgIGluc3RhbmNlVHlwZXM6IGluc3RhbmNlVHlwZXM/Lm1hcCh0ID0+IHQudG9TdHJpbmcoKSksXG4gICAgICBsYWJlbHM6IHByb3BzLmxhYmVscyxcbiAgICAgIHRhaW50czogcHJvcHMudGFpbnRzLFxuICAgICAgbGF1bmNoVGVtcGxhdGU6IHByb3BzLmxhdW5jaFRlbXBsYXRlU3BlYyxcbiAgICAgIHJlbGVhc2VWZXJzaW9uOiBwcm9wcy5yZWxlYXNlVmVyc2lvbixcbiAgICAgIHJlbW90ZUFjY2VzczogcHJvcHMucmVtb3RlQWNjZXNzID8ge1xuICAgICAgICBlYzJTc2hLZXk6IHByb3BzLnJlbW90ZUFjY2Vzcy5zc2hLZXlOYW1lLFxuICAgICAgICBzb3VyY2VTZWN1cml0eUdyb3VwczogcHJvcHMucmVtb3RlQWNjZXNzLnNvdXJjZVNlY3VyaXR5R3JvdXBzID9cbiAgICAgICAgICBwcm9wcy5yZW1vdGVBY2Nlc3Muc291cmNlU2VjdXJpdHlHcm91cHMubWFwKG0gPT4gbS5zZWN1cml0eUdyb3VwSWQpIDogdW5kZWZpbmVkLFxuICAgICAgfSA6IHVuZGVmaW5lZCxcbiAgICAgIHNjYWxpbmdDb25maWc6IHtcbiAgICAgICAgZGVzaXJlZFNpemU6IHRoaXMuZGVzaXJlZFNpemUsXG4gICAgICAgIG1heFNpemU6IHRoaXMubWF4U2l6ZSxcbiAgICAgICAgbWluU2l6ZTogdGhpcy5taW5TaXplLFxuICAgICAgfSxcbiAgICAgIHRhZ3M6IHByb3BzLnRhZ3MsXG4gICAgICB1cGRhdGVDb25maWc6IHByb3BzLm1heFVuYXZhaWxhYmxlIHx8IHByb3BzLm1heFVuYXZhaWxhYmxlUGVyY2VudGFnZSA/IHtcbiAgICAgICAgbWF4VW5hdmFpbGFibGU6IHByb3BzLm1heFVuYXZhaWxhYmxlLFxuICAgICAgICBtYXhVbmF2YWlsYWJsZVBlcmNlbnRhZ2U6IHByb3BzLm1heFVuYXZhaWxhYmxlUGVyY2VudGFnZSxcbiAgICAgIH0gOiB1bmRlZmluZWQsXG4gICAgICBub2RlUmVwYWlyQ29uZmlnOiBwcm9wcy5lbmFibGVOb2RlQXV0b1JlcGFpciA/IHtcbiAgICAgICAgZW5hYmxlZDogcHJvcHMuZW5hYmxlTm9kZUF1dG9SZXBhaXIsXG4gICAgICB9IDogdW5kZWZpbmVkLFxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuY2x1c3RlciBpbnN0YW5jZW9mIENsdXN0ZXIpIHtcbiAgICAgIC8vIHRoZSBjb250cm9sbGVyIHJ1bnMgb24gdGhlIHdvcmtlciBub2RlcyBzbyB0aGV5IGNhbm5vdFxuICAgICAgLy8gYmUgZGVsZXRlZCBiZWZvcmUgdGhlIGNvbnRyb2xsZXIuXG4gICAgICBpZiAodGhpcy5jbHVzdGVyLmFsYkNvbnRyb2xsZXIpIHtcbiAgICAgICAgTm9kZS5vZih0aGlzLmNsdXN0ZXIuYWxiQ29udHJvbGxlcikuYWRkRGVwZW5kZW5jeSh0aGlzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLm5vZGVncm91cEFybiA9IHRoaXMuZ2V0UmVzb3VyY2VBcm5BdHRyaWJ1dGUocmVzb3VyY2UuYXR0ckFybiwge1xuICAgICAgc2VydmljZTogJ2VrcycsXG4gICAgICByZXNvdXJjZTogJ25vZGVncm91cCcsXG4gICAgICByZXNvdXJjZU5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgIH0pO1xuXG4gICAgaWYgKEZlYXR1cmVGbGFncy5vZih0aGlzKS5pc0VuYWJsZWQoY3hhcGkuRUtTX05PREVHUk9VUF9OQU1FKSkge1xuICAgICAgdGhpcy5ub2RlZ3JvdXBOYW1lID0gdGhpcy5nZXRSZXNvdXJjZU5hbWVBdHRyaWJ1dGUocmVzb3VyY2UuYXR0ck5vZGVncm91cE5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm5vZGVncm91cE5hbWUgPSB0aGlzLmdldFJlc291cmNlTmFtZUF0dHJpYnV0ZShyZXNvdXJjZS5yZWYpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdmFsaWRhdGVVcGRhdGVDb25maWcobWF4VW5hdmFpbGFibGU/OiBudW1iZXIsIG1heFVuYXZhaWxhYmxlUGVyY2VudGFnZT86IG51bWJlcikge1xuICAgIGlmICghbWF4VW5hdmFpbGFibGUgJiYgIW1heFVuYXZhaWxhYmxlUGVyY2VudGFnZSkgcmV0dXJuO1xuICAgIGlmIChtYXhVbmF2YWlsYWJsZSAmJiBtYXhVbmF2YWlsYWJsZVBlcmNlbnRhZ2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbWF4VW5hdmFpbGFibGUgYW5kIG1heFVuYXZhaWxhYmxlUGVyY2VudGFnZSBhcmUgbm90IGFsbG93ZWQgdG8gYmUgZGVmaW5lZCB0b2dldGhlcicpO1xuICAgIH1cbiAgICBpZiAobWF4VW5hdmFpbGFibGVQZXJjZW50YWdlICYmIChtYXhVbmF2YWlsYWJsZVBlcmNlbnRhZ2UgPCAxIHx8IG1heFVuYXZhaWxhYmxlUGVyY2VudGFnZSA+IDEwMCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgbWF4VW5hdmFpbGFibGVQZXJjZW50YWdlIG11c3QgYmUgYmV0d2VlbiAxIGFuZCAxMDAsIGdvdCAke21heFVuYXZhaWxhYmxlUGVyY2VudGFnZX1gKTtcbiAgICB9XG4gICAgaWYgKG1heFVuYXZhaWxhYmxlKSB7XG4gICAgICBpZiAobWF4VW5hdmFpbGFibGUgPiB0aGlzLm1heFNpemUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBtYXhVbmF2YWlsYWJsZSBtdXN0IGJlIGxvd2VyIHRoYW4gbWF4U2l6ZSAoJHt0aGlzLm1heFNpemV9KSwgZ290ICR7bWF4VW5hdmFpbGFibGV9YCk7XG4gICAgICB9XG4gICAgICBpZiAobWF4VW5hdmFpbGFibGUgPCAxIHx8IG1heFVuYXZhaWxhYmxlID4gMTAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgbWF4VW5hdmFpbGFibGUgbXVzdCBiZSBiZXR3ZWVuIDEgYW5kIDEwMCwgZ290ICR7bWF4VW5hdmFpbGFibGV9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQU1JIHR5cGVzIG9mIGRpZmZlcmVudCBhcmNoaXRlY3R1cmVzLiBNYWtlIHN1cmUgQUwyIGlzIGFsd2F5cyB0aGUgZmlyc3QgZWxlbWVudCwgd2hpY2ggd2lsbCBiZSB0aGUgZGVmYXVsdFxuICogQW1pVHlwZSBpZiBhbWlUeXBlIGFuZCBsYXVuY2hUZW1wbGF0ZVNwZWMgYXJlIGJvdGggdW5kZWZpbmVkLlxuICovXG5jb25zdCBhcm02NEFtaVR5cGVzOiBOb2RlZ3JvdXBBbWlUeXBlW10gPSBbXG4gIE5vZGVncm91cEFtaVR5cGUuQUwyX0FSTV82NCxcbiAgTm9kZWdyb3VwQW1pVHlwZS5BTDIwMjNfQVJNXzY0X1NUQU5EQVJELFxuICBOb2RlZ3JvdXBBbWlUeXBlLkJPVFRMRVJPQ0tFVF9BUk1fNjQsXG5dO1xuY29uc3QgeDg2NjRBbWlUeXBlczogTm9kZWdyb3VwQW1pVHlwZVtdID0gW1xuICBOb2RlZ3JvdXBBbWlUeXBlLkFMMl9YODZfNjQsXG4gIE5vZGVncm91cEFtaVR5cGUuQUwyMDIzX1g4Nl82NF9TVEFOREFSRCxcbiAgTm9kZWdyb3VwQW1pVHlwZS5CT1RUTEVST0NLRVRfWDg2XzY0LFxuICBOb2RlZ3JvdXBBbWlUeXBlLldJTkRPV1NfQ09SRV8yMDE5X1g4Nl82NCxcbiAgTm9kZWdyb3VwQW1pVHlwZS5XSU5ET1dTX0NPUkVfMjAyMl9YODZfNjQsXG4gIE5vZGVncm91cEFtaVR5cGUuV0lORE9XU19GVUxMXzIwMTlfWDg2XzY0LFxuICBOb2RlZ3JvdXBBbWlUeXBlLldJTkRPV1NfRlVMTF8yMDIyX1g4Nl82NCxcbl07XG5jb25zdCB3aW5kb3dzQW1pVHlwZXM6IE5vZGVncm91cEFtaVR5cGVbXSA9IFtcbiAgTm9kZWdyb3VwQW1pVHlwZS5XSU5ET1dTX0NPUkVfMjAxOV9YODZfNjQsXG4gIE5vZGVncm91cEFtaVR5cGUuV0lORE9XU19DT1JFXzIwMjJfWDg2XzY0LFxuICBOb2RlZ3JvdXBBbWlUeXBlLldJTkRPV1NfRlVMTF8yMDE5X1g4Nl82NCxcbiAgTm9kZWdyb3VwQW1pVHlwZS5XSU5ET1dTX0ZVTExfMjAyMl9YODZfNjQsXG5dO1xuY29uc3QgZ3B1QW1pVHlwZXM6IE5vZGVncm91cEFtaVR5cGVbXSA9IFtcbiAgTm9kZWdyb3VwQW1pVHlwZS5BTDJfWDg2XzY0X0dQVSxcbiAgTm9kZWdyb3VwQW1pVHlwZS5BTDIwMjNfWDg2XzY0X05FVVJPTixcbiAgTm9kZWdyb3VwQW1pVHlwZS5BTDIwMjNfWDg2XzY0X05WSURJQSxcbiAgTm9kZWdyb3VwQW1pVHlwZS5BTDIwMjNfQVJNXzY0X05WSURJQSxcbiAgTm9kZWdyb3VwQW1pVHlwZS5CT1RUTEVST0NLRVRfWDg2XzY0X05WSURJQSxcbiAgTm9kZWdyb3VwQW1pVHlwZS5CT1RUTEVST0NLRVRfQVJNXzY0X05WSURJQSxcbl07XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBjaGVjayBpZiB0aGUgaW5zdGFuY2VUeXBlIGlzIHN1cHBvcnRlZCBieSBXaW5kb3dzIEFNSS5cbiAqIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9la3MvbGF0ZXN0L3VzZXJndWlkZS93aW5kb3dzLXN1cHBvcnQuaHRtbFxuICogQHBhcmFtIGluc3RhbmNlVHlwZSBUaGUgRUMyIGluc3RhbmNlIHR5cGVcbiAqL1xuZnVuY3Rpb24gaXNXaW5kb3dzU3VwcG9ydGVkSW5zdGFuY2VUeXBlKGluc3RhbmNlVHlwZTogSW5zdGFuY2VUeXBlKTogYm9vbGVhbiB7XG4gIC8vIGNvbXBhcmUgaW5zdGFuY2VUeXBlIHRvIGZvcmJpZGRlbiBJbnN0YW5jZVR5cGVzIGZvciBXaW5kb3dzLiBBZGQgZXhjZXB0aW9uIGZvciBtNmEuMTZ4bGFyZ2UuXG4gIC8vIE5PVEU6IGkyIGluc3RhbmNlIGNsYXNzIGlzIG5vdCBwcmVzZW50IGluIHRoZSBJbnN0YW5jZUNsYXNzIGVudW0uXG4gIGNvbnN0IGZvcmJpZGRlbkluc3RhbmNlQ2xhc3NlczogSW5zdGFuY2VDbGFzc1tdID0gW0luc3RhbmNlQ2xhc3MuQzMsIEluc3RhbmNlQ2xhc3MuQzQsIEluc3RhbmNlQ2xhc3MuRDIsIEluc3RhbmNlQ2xhc3MuTTQsXG4gICAgSW5zdGFuY2VDbGFzcy5NNkEsIEluc3RhbmNlQ2xhc3MuUjNdO1xuICByZXR1cm4gaW5zdGFuY2VUeXBlLnRvU3RyaW5nKCkgPT09IEluc3RhbmNlVHlwZS5vZihJbnN0YW5jZUNsYXNzLk00LCBJbnN0YW5jZVNpemUuWExBUkdFMTYpLnRvU3RyaW5nKCkgfHxcbiAgICBmb3JiaWRkZW5JbnN0YW5jZUNsYXNzZXMuZXZlcnkoKGMpID0+ICFpbnN0YW5jZVR5cGUuc2FtZUluc3RhbmNlQ2xhc3NBcyhJbnN0YW5jZVR5cGUub2YoYywgSW5zdGFuY2VTaXplLkxBUkdFKSkgJiYgIWluc3RhbmNlVHlwZS50b1N0cmluZygpLm1hdGNoKC9eaTIvKSk7XG59XG5cbnR5cGUgQW1pQXJjaGl0ZWN0dXJlID0gSW5zdGFuY2VBcmNoaXRlY3R1cmUgfCAnR1BVJztcbi8qKlxuICogVGhpcyBmdW5jdGlvbiBleGFtaW5lcyB0aGUgQ1BVIGFyY2hpdGVjdHVyZSBvZiBldmVyeSBpbnN0YW5jZSB0eXBlIGFuZCBkZXRlcm1pbmVzXG4gKiB3aGF0IEFNSSB0eXBlcyBhcmUgY29tcGF0aWJsZSBmb3IgYWxsIG9mIHRoZW0uIGl0IGVpdGhlciB0aHJvd3Mgb3IgcHJvZHVjZXMgYW4gYXJyYXkgb2YgcG9zc2libGUgQU1JIHR5cGVzIGJlY2F1c2VcbiAqIGluc3RhbmNlIHR5cGVzIG9mIGRpZmZlcmVudCBDUFUgYXJjaGl0ZWN0dXJlcyBhcmUgbm90IHN1cHBvcnRlZC5cbiAqIEBwYXJhbSBpbnN0YW5jZVR5cGVzIFRoZSBpbnN0YW5jZSB0eXBlc1xuICogQHJldHVybnMgTm9kZWdyb3VwQW1pVHlwZVtdXG4gKi9cbmZ1bmN0aW9uIGdldFBvc3NpYmxlQW1pVHlwZXMoaW5zdGFuY2VUeXBlczogSW5zdGFuY2VUeXBlW10pOiBOb2RlZ3JvdXBBbWlUeXBlW10ge1xuICBmdW5jdGlvbiB0eXBlVG9BcmNoKGluc3RhbmNlVHlwZTogSW5zdGFuY2VUeXBlKTogQW1pQXJjaGl0ZWN0dXJlIHtcbiAgICByZXR1cm4gaXNHcHVJbnN0YW5jZVR5cGUoaW5zdGFuY2VUeXBlKSA/ICdHUFUnIDogaW5zdGFuY2VUeXBlLmFyY2hpdGVjdHVyZTtcbiAgfVxuICBjb25zdCBhcmNoQW1pTWFwID0gbmV3IE1hcDxBbWlBcmNoaXRlY3R1cmUsIE5vZGVncm91cEFtaVR5cGVbXT4oW1xuICAgIFtJbnN0YW5jZUFyY2hpdGVjdHVyZS5BUk1fNjQsIGFybTY0QW1pVHlwZXNdLFxuICAgIFtJbnN0YW5jZUFyY2hpdGVjdHVyZS5YODZfNjQsIHg4NjY0QW1pVHlwZXNdLFxuICAgIFsnR1BVJywgZ3B1QW1pVHlwZXNdLFxuICBdKTtcbiAgY29uc3QgYXJjaGl0ZWN0dXJlczogU2V0PEFtaUFyY2hpdGVjdHVyZT4gPSBuZXcgU2V0KGluc3RhbmNlVHlwZXMubWFwKHR5cGVUb0FyY2gpKTtcblxuICBpZiAoYXJjaGl0ZWN0dXJlcy5zaXplID09PSAwKSB7IC8vIHByb3RlY3RpdmUgY29kZSwgdGhlIGN1cnJlbnQgaW1wbGVtZW50YXRpb24gd2lsbCBuZXZlciByZXN1bHQgaW4gdGhpcy5cbiAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBkZXRlcm1pbmUgYW55IGFtaSB0eXBlIGNvbXBhdGlibGUgd2l0aCBpbnN0YW5jZSB0eXBlczogJHtpbnN0YW5jZVR5cGVzLm1hcChpID0+IGkudG9TdHJpbmcoKSkuam9pbignLCAnKX1gKTtcbiAgfVxuXG4gIGlmIChhcmNoaXRlY3R1cmVzLnNpemUgPiAxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbnN0YW5jZVR5cGVzIG9mIGRpZmZlcmVudCBhcmNoaXRlY3R1cmVzIGlzIG5vdCBhbGxvd2VkJyk7XG4gIH1cblxuICByZXR1cm4gYXJjaEFtaU1hcC5nZXQoQXJyYXkuZnJvbShhcmNoaXRlY3R1cmVzKVswXSkhO1xufVxuIl19