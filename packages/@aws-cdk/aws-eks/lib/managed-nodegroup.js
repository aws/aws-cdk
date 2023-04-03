"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nodegroup = exports.TaintEffect = exports.CapacityType = exports.NodegroupAmiType = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const aws_ec2_1 = require("@aws-cdk/aws-ec2");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const cluster_1 = require("./cluster");
const eks_generated_1 = require("./eks.generated");
/**
 * The AMI type for your node group. GPU instance types should use the `AL2_x86_64_GPU` AMI type, which uses the
 * Amazon EKS-optimized Linux AMI with GPU support. Non-GPU instances should use the `AL2_x86_64` AMI type, which
 * uses the Amazon EKS-optimized Linux AMI.
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
     *  Bottlerocket Linux(ARM-64)
     */
    NodegroupAmiType["BOTTLEROCKET_ARM_64"] = "BOTTLEROCKET_ARM_64";
    /**
     * Bottlerocket(x86-64)
     */
    NodegroupAmiType["BOTTLEROCKET_X86_64"] = "BOTTLEROCKET_x86_64";
})(NodegroupAmiType = exports.NodegroupAmiType || (exports.NodegroupAmiType = {}));
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
})(CapacityType = exports.CapacityType || (exports.CapacityType = {}));
/**
 * Effect types of kubernetes node taint.
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
})(TaintEffect = exports.TaintEffect || (exports.TaintEffect = {}));
/**
 * The Nodegroup resource class
 */
class Nodegroup extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props.nodegroupName,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_eks_NodegroupProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Nodegroup);
            }
            throw error;
        }
        this.cluster = props.cluster;
        this.desiredSize = props.desiredSize ?? props.minSize ?? 2;
        this.maxSize = props.maxSize ?? this.desiredSize;
        this.minSize = props.minSize ?? 1;
        core_1.withResolved(this.desiredSize, this.maxSize, (desired, max) => {
            if (desired === undefined) {
                return;
            }
            if (desired > max) {
                throw new Error(`Desired capacity ${desired} can't be greater than max size ${max}`);
            }
        });
        core_1.withResolved(this.desiredSize, this.minSize, (desired, min) => {
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
            core_1.Annotations.of(this).addWarning('"instanceType" is deprecated and will be removed in the next major version. please use "instanceTypes" instead');
        }
        const instanceTypes = props.instanceTypes ?? (props.instanceType ? [props.instanceType] : undefined);
        let possibleAmiTypes = [];
        if (instanceTypes && instanceTypes.length > 0) {
            /**
             * if the user explicitly configured instance types, we can't caculate the expected ami type as we support
             * Amazon Linux 2 and Bottlerocket now. However we can check:
             *
             * 1. instance types of different CPU architectures are not mixed(e.g. X86 with ARM).
             * 2. user-specified amiType should be included in `possibleAmiTypes`.
             */
            possibleAmiTypes = getPossibleAmiTypes(instanceTypes);
            // if the user explicitly configured an ami type, make sure it's included in the possibleAmiTypes
            if (props.amiType && !possibleAmiTypes.includes(props.amiType)) {
                throw new Error(`The specified AMI does not match the instance types architecture, either specify one of ${possibleAmiTypes} or don't specify any`);
            }
        }
        if (!props.nodeRole) {
            const ngRole = new aws_iam_1.Role(this, 'NodeGroupRole', {
                assumedBy: new aws_iam_1.ServicePrincipal('ec2.amazonaws.com'),
            });
            ngRole.addManagedPolicy(aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSWorkerNodePolicy'));
            ngRole.addManagedPolicy(aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKS_CNI_Policy'));
            ngRole.addManagedPolicy(aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryReadOnly'));
            this.role = ngRole;
        }
        else {
            this.role = props.nodeRole;
        }
        const resource = new eks_generated_1.CfnNodegroup(this, 'Resource', {
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
        });
        // managed nodegroups update the `aws-auth` on creation, but we still need to track
        // its state for consistency.
        if (this.cluster instanceof cluster_1.Cluster) {
            // see https://docs.aws.amazon.com/en_us/eks/latest/userguide/add-user-role.html
            this.cluster.awsAuth.addRoleMapping(this.role, {
                username: 'system:node:{{EC2PrivateDNSName}}',
                groups: [
                    'system:bootstrappers',
                    'system:nodes',
                ],
            });
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
        this.nodegroupName = this.getResourceNameAttribute(resource.ref);
    }
    /**
     * Import the Nodegroup from attributes
     */
    static fromNodegroupName(scope, id, nodegroupName) {
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.nodegroupName = nodegroupName;
            }
        }
        return new Import(scope, id);
    }
}
exports.Nodegroup = Nodegroup;
_a = JSII_RTTI_SYMBOL_1;
Nodegroup[_a] = { fqn: "@aws-cdk/aws-eks.Nodegroup", version: "0.0.0" };
/**
 * AMI types of different architectures. Make sure AL2 is always the first element, which will be the default
 * AmiType if amiType and launchTemplateSpec are both undefined.
 */
const arm64AmiTypes = [NodegroupAmiType.AL2_ARM_64, NodegroupAmiType.BOTTLEROCKET_ARM_64];
const x8664AmiTypes = [NodegroupAmiType.AL2_X86_64, NodegroupAmiType.BOTTLEROCKET_X86_64];
const gpuAmiTypes = [NodegroupAmiType.AL2_X86_64_GPU];
/**
 * This function check if the instanceType is GPU instance.
 * @param instanceType The EC2 instance type
 */
function isGpuInstanceType(instanceType) {
    // capture the family, generation, capabilities, and size portions of the instance type id
    const instanceTypeComponents = instanceType.toString().match(/^([a-z]+)(\d{1,2})([a-z]*)\.([a-z0-9]+)$/);
    if (instanceTypeComponents == null) {
        throw new Error('Malformed instance type identifier');
    }
    const family = instanceTypeComponents[1];
    return ['p', 'g', 'inf'].includes(family);
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
        return isGpuInstanceType(instanceType) ? 'GPU' : instanceType.architecture;
    }
    const archAmiMap = new Map([
        [aws_ec2_1.InstanceArchitecture.ARM_64, arm64AmiTypes],
        [aws_ec2_1.InstanceArchitecture.X86_64, x8664AmiTypes],
        ['GPU', gpuAmiTypes],
    ]);
    const architectures = new Set(instanceTypes.map(typeToArch));
    if (architectures.size === 0) { // protective code, the current implementation will never result in this.
        throw new Error(`Cannot determine any ami type comptaible with instance types: ${instanceTypes.map(i => i.toString).join(',')}`);
    }
    if (architectures.size > 1) {
        throw new Error('instanceTypes of different architectures is not allowed');
    }
    return archAmiMap.get(Array.from(architectures)[0]);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFuYWdlZC1ub2RlZ3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYW5hZ2VkLW5vZGVncm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw4Q0FBdUc7QUFDdkcsOENBQWdGO0FBQ2hGLHdDQUErRTtBQUMvRSwyQ0FBNkM7QUFDN0MsdUNBQThDO0FBQzlDLG1EQUErQztBQWEvQzs7OztHQUlHO0FBQ0gsSUFBWSxnQkFxQlg7QUFyQkQsV0FBWSxnQkFBZ0I7SUFDMUI7O09BRUc7SUFDSCw2Q0FBeUIsQ0FBQTtJQUN6Qjs7T0FFRztJQUNILHFEQUFpQyxDQUFBO0lBQ2pDOztPQUVHO0lBQ0gsNkNBQXlCLENBQUE7SUFDekI7O09BRUc7SUFDSCwrREFBMkMsQ0FBQTtJQUMzQzs7T0FFRztJQUNILCtEQUEyQyxDQUFBO0FBQzdDLENBQUMsRUFyQlcsZ0JBQWdCLEdBQWhCLHdCQUFnQixLQUFoQix3QkFBZ0IsUUFxQjNCO0FBRUQ7O0dBRUc7QUFDSCxJQUFZLFlBU1g7QUFURCxXQUFZLFlBQVk7SUFDdEI7O09BRUc7SUFDSCw2QkFBYSxDQUFBO0lBQ2I7O09BRUc7SUFDSCx1Q0FBdUIsQ0FBQTtBQUN6QixDQUFDLEVBVFcsWUFBWSxHQUFaLG9CQUFZLEtBQVosb0JBQVksUUFTdkI7QUFzQ0Q7O0dBRUc7QUFDSCxJQUFZLFdBYVg7QUFiRCxXQUFZLFdBQVc7SUFDckI7O09BRUc7SUFDSCwwQ0FBMkIsQ0FBQTtJQUMzQjs7T0FFRztJQUNILHdEQUF5QyxDQUFBO0lBQ3pDOztPQUVHO0lBQ0gsd0NBQXlCLENBQUE7QUFDM0IsQ0FBQyxFQWJXLFdBQVcsR0FBWCxtQkFBVyxLQUFYLG1CQUFXLFFBYXRCO0FBd0tEOztHQUVHO0FBQ0gsTUFBYSxTQUFVLFNBQVEsZUFBUTtJQXFDckMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFxQjtRQUM3RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUNmLFlBQVksRUFBRSxLQUFLLENBQUMsYUFBYTtTQUNsQyxDQUFDLENBQUM7Ozs7OzsrQ0F4Q00sU0FBUzs7OztRQTBDbEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBRTdCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsSUFBSSxLQUFLLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUNqRCxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDO1FBRWxDLG1CQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQzVELElBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtnQkFBQyxPQUFRO2FBQUM7WUFDckMsSUFBSSxPQUFPLEdBQUcsR0FBRyxFQUFFO2dCQUNqQixNQUFNLElBQUksS0FBSyxDQUFDLG9CQUFvQixPQUFPLG1DQUFtQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2FBQ3RGO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxtQkFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUM1RCxJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUU7Z0JBQUMsT0FBUTthQUFDO1lBQ3JDLElBQUksT0FBTyxHQUFHLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsR0FBRyx1Q0FBdUMsT0FBTyxFQUFFLENBQUMsQ0FBQzthQUMxRjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxLQUFLLENBQUMsa0JBQWtCLElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRTtZQUM5QywrRUFBK0U7WUFDL0UsZ0lBQWdJO1lBQ2hJLE1BQU0sSUFBSSxLQUFLLENBQUMsdURBQXVELENBQUMsQ0FBQztTQUMxRTtRQUVELElBQUksS0FBSyxDQUFDLFlBQVksSUFBSSxLQUFLLENBQUMsYUFBYSxFQUFFO1lBQzdDLE1BQU0sSUFBSSxLQUFLLENBQUMsK0RBQStELENBQUMsQ0FBQztTQUNsRjtRQUVELElBQUksS0FBSyxDQUFDLFlBQVksRUFBRTtZQUN0QixrQkFBVyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsZ0hBQWdILENBQUMsQ0FBQztTQUNuSjtRQUNELE1BQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxhQUFhLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDckcsSUFBSSxnQkFBZ0IsR0FBdUIsRUFBRSxDQUFDO1FBRTlDLElBQUksYUFBYSxJQUFJLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzdDOzs7Ozs7ZUFNRztZQUNILGdCQUFnQixHQUFHLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRXRELGlHQUFpRztZQUNqRyxJQUFJLEtBQUssQ0FBQyxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUM5RCxNQUFNLElBQUksS0FBSyxDQUFDLDJGQUEyRixnQkFBZ0IsdUJBQXVCLENBQUMsQ0FBQzthQUNySjtTQUNGO1FBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDbkIsTUFBTSxNQUFNLEdBQUcsSUFBSSxjQUFJLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtnQkFDN0MsU0FBUyxFQUFFLElBQUksMEJBQWdCLENBQUMsbUJBQW1CLENBQUM7YUFDckQsQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLGdCQUFnQixDQUFDLHVCQUFhLENBQUMsd0JBQXdCLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxDQUFDO1lBQzdGLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyx1QkFBYSxDQUFDLHdCQUF3QixDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQztZQUN4RixNQUFNLENBQUMsZ0JBQWdCLENBQUMsdUJBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDLENBQUM7WUFDdEcsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7U0FDcEI7YUFBTTtZQUNMLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztTQUM1QjtRQUVELE1BQU0sUUFBUSxHQUFHLElBQUksNEJBQVksQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ2xELFdBQVcsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDckMsYUFBYSxFQUFFLEtBQUssQ0FBQyxhQUFhO1lBQ2xDLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU87WUFDM0IsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUztZQUNoRTs7Ozs7Ozs7O2VBU0c7WUFDSCxPQUFPLEVBQUUsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUYsWUFBWSxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVM7WUFDM0UsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO1lBQ3hCLGtCQUFrQixFQUFFLEtBQUssQ0FBQyxXQUFXLElBQUksSUFBSTtZQUU3QywySEFBMkg7WUFDM0gsZ0dBQWdHO1lBQ2hHLGFBQWEsRUFBRSxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3BELE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTTtZQUNwQixNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU07WUFDcEIsY0FBYyxFQUFFLEtBQUssQ0FBQyxrQkFBa0I7WUFDeEMsY0FBYyxFQUFFLEtBQUssQ0FBQyxjQUFjO1lBQ3BDLFlBQVksRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDakMsU0FBUyxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsVUFBVTtnQkFDeEMsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO29CQUM3RCxLQUFLLENBQUMsWUFBWSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUzthQUNsRixDQUFDLENBQUMsQ0FBQyxTQUFTO1lBQ2IsYUFBYSxFQUFFO2dCQUNiLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVztnQkFDN0IsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO2dCQUNyQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87YUFDdEI7WUFDRCxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7U0FDakIsQ0FBQyxDQUFDO1FBRUgsbUZBQW1GO1FBQ25GLDZCQUE2QjtRQUM3QixJQUFJLElBQUksQ0FBQyxPQUFPLFlBQVksaUJBQU8sRUFBRTtZQUNuQyxnRkFBZ0Y7WUFDaEYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQzdDLFFBQVEsRUFBRSxtQ0FBbUM7Z0JBQzdDLE1BQU0sRUFBRTtvQkFDTixzQkFBc0I7b0JBQ3RCLGNBQWM7aUJBQ2Y7YUFDRixDQUFDLENBQUM7WUFFSCx5REFBeUQ7WUFDekQsb0NBQW9DO1lBQ3BDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUU7Z0JBQzlCLGlCQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3pEO1NBQ0Y7UUFFRCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFO1lBQ2pFLE9BQU8sRUFBRSxLQUFLO1lBQ2QsUUFBUSxFQUFFLFdBQVc7WUFDckIsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO1NBQ2hDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNsRTtJQTNLRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxhQUFxQjtRQUNqRixNQUFNLE1BQU8sU0FBUSxlQUFRO1lBQTdCOztnQkFDa0Isa0JBQWEsR0FBRyxhQUFhLENBQUM7WUFDaEQsQ0FBQztTQUFBO1FBQ0QsT0FBTyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDOUI7O0FBVEgsOEJBNktDOzs7QUFFRDs7O0dBR0c7QUFDSCxNQUFNLGFBQWEsR0FBdUIsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUM5RyxNQUFNLGFBQWEsR0FBdUIsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUM5RyxNQUFNLFdBQVcsR0FBdUIsQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUcxRTs7O0dBR0c7QUFDSCxTQUFTLGlCQUFpQixDQUFDLFlBQTBCO0lBQ25ELDBGQUEwRjtJQUMxRixNQUFNLHNCQUFzQixHQUFHLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUMsMENBQTBDLENBQUMsQ0FBQztJQUN6RyxJQUFJLHNCQUFzQixJQUFJLElBQUksRUFBRTtRQUNsQyxNQUFNLElBQUksS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7S0FDdkQ7SUFDRCxNQUFNLE1BQU0sR0FBRyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6QyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDNUMsQ0FBQztBQUdEOzs7Ozs7R0FNRztBQUNILFNBQVMsbUJBQW1CLENBQUMsYUFBNkI7SUFDeEQsU0FBUyxVQUFVLENBQUMsWUFBMEI7UUFDNUMsT0FBTyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDO0lBQzdFLENBQUM7SUFDRCxNQUFNLFVBQVUsR0FBRyxJQUFJLEdBQUcsQ0FBc0M7UUFDOUQsQ0FBQyw4QkFBb0IsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDO1FBQzVDLENBQUMsOEJBQW9CLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQztRQUM1QyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUM7S0FDckIsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxhQUFhLEdBQXlCLElBQUksR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUVuRixJQUFJLGFBQWEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFFLEVBQUUseUVBQXlFO1FBQ3ZHLE1BQU0sSUFBSSxLQUFLLENBQUMsaUVBQWlFLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUNsSTtJQUVELElBQUksYUFBYSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUU7UUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyx5REFBeUQsQ0FBQyxDQUFDO0tBQzVFO0lBRUQsT0FBTyxVQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQztBQUN2RCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5zdGFuY2VUeXBlLCBJU2VjdXJpdHlHcm91cCwgU3VibmV0U2VsZWN0aW9uLCBJbnN0YW5jZUFyY2hpdGVjdHVyZSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0IHsgSVJvbGUsIE1hbmFnZWRQb2xpY3ksIFJvbGUsIFNlcnZpY2VQcmluY2lwYWwgfSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IElSZXNvdXJjZSwgUmVzb3VyY2UsIEFubm90YXRpb25zLCB3aXRoUmVzb2x2ZWQgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCwgTm9kZSB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2x1c3RlciwgSUNsdXN0ZXIgfSBmcm9tICcuL2NsdXN0ZXInO1xuaW1wb3J0IHsgQ2ZuTm9kZWdyb3VwIH0gZnJvbSAnLi9la3MuZ2VuZXJhdGVkJztcblxuLyoqXG4gKiBOb2RlR3JvdXAgaW50ZXJmYWNlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSU5vZGVncm91cCBleHRlbmRzIElSZXNvdXJjZSB7XG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoZSBub2RlZ3JvdXBcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgbm9kZWdyb3VwTmFtZTogc3RyaW5nO1xufVxuXG4vKipcbiAqIFRoZSBBTUkgdHlwZSBmb3IgeW91ciBub2RlIGdyb3VwLiBHUFUgaW5zdGFuY2UgdHlwZXMgc2hvdWxkIHVzZSB0aGUgYEFMMl94ODZfNjRfR1BVYCBBTUkgdHlwZSwgd2hpY2ggdXNlcyB0aGVcbiAqIEFtYXpvbiBFS1Mtb3B0aW1pemVkIExpbnV4IEFNSSB3aXRoIEdQVSBzdXBwb3J0LiBOb24tR1BVIGluc3RhbmNlcyBzaG91bGQgdXNlIHRoZSBgQUwyX3g4Nl82NGAgQU1JIHR5cGUsIHdoaWNoXG4gKiB1c2VzIHRoZSBBbWF6b24gRUtTLW9wdGltaXplZCBMaW51eCBBTUkuXG4gKi9cbmV4cG9ydCBlbnVtIE5vZGVncm91cEFtaVR5cGUge1xuICAvKipcbiAgICogQW1hem9uIExpbnV4IDIgKHg4Ni02NClcbiAgICovXG4gIEFMMl9YODZfNjQgPSAnQUwyX3g4Nl82NCcsXG4gIC8qKlxuICAgKiBBbWF6b24gTGludXggMiB3aXRoIEdQVSBzdXBwb3J0XG4gICAqL1xuICBBTDJfWDg2XzY0X0dQVSA9ICdBTDJfeDg2XzY0X0dQVScsXG4gIC8qKlxuICAgKiBBbWF6b24gTGludXggMiAoQVJNLTY0KVxuICAgKi9cbiAgQUwyX0FSTV82NCA9ICdBTDJfQVJNXzY0JyxcbiAgLyoqXG4gICAqICBCb3R0bGVyb2NrZXQgTGludXgoQVJNLTY0KVxuICAgKi9cbiAgQk9UVExFUk9DS0VUX0FSTV82NCA9ICdCT1RUTEVST0NLRVRfQVJNXzY0JyxcbiAgLyoqXG4gICAqIEJvdHRsZXJvY2tldCh4ODYtNjQpXG4gICAqL1xuICBCT1RUTEVST0NLRVRfWDg2XzY0ID0gJ0JPVFRMRVJPQ0tFVF94ODZfNjQnLFxufVxuXG4vKipcbiAqIENhcGFjaXR5IHR5cGUgb2YgdGhlIG1hbmFnZWQgbm9kZSBncm91cFxuICovXG5leHBvcnQgZW51bSBDYXBhY2l0eVR5cGUge1xuICAvKipcbiAgICogc3BvdCBpbnN0YW5jZXNcbiAgICovXG4gIFNQT1QgPSAnU1BPVCcsXG4gIC8qKlxuICAgKiBvbi1kZW1hbmQgaW5zdGFuY2VzXG4gICAqL1xuICBPTl9ERU1BTkQgPSAnT05fREVNQU5EJ1xufVxuXG4vKipcbiAqIFRoZSByZW1vdGUgYWNjZXNzIChTU0gpIGNvbmZpZ3VyYXRpb24gdG8gdXNlIHdpdGggeW91ciBub2RlIGdyb3VwLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZWtzLW5vZGVncm91cC1yZW1vdGVhY2Nlc3MuaHRtbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5vZGVncm91cFJlbW90ZUFjY2VzcyB7XG4gIC8qKlxuICAgKiBUaGUgQW1hem9uIEVDMiBTU0gga2V5IHRoYXQgcHJvdmlkZXMgYWNjZXNzIGZvciBTU0ggY29tbXVuaWNhdGlvbiB3aXRoIHRoZSB3b3JrZXIgbm9kZXMgaW4gdGhlIG1hbmFnZWQgbm9kZSBncm91cC5cbiAgICovXG4gIHJlYWRvbmx5IHNzaEtleU5hbWU6IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBzZWN1cml0eSBncm91cHMgdGhhdCBhcmUgYWxsb3dlZCBTU0ggYWNjZXNzIChwb3J0IDIyKSB0byB0aGUgd29ya2VyIG5vZGVzLiBJZiB5b3Ugc3BlY2lmeSBhbiBBbWF6b24gRUMyIFNTSFxuICAgKiBrZXkgYnV0IGRvIG5vdCBzcGVjaWZ5IGEgc291cmNlIHNlY3VyaXR5IGdyb3VwIHdoZW4geW91IGNyZWF0ZSBhIG1hbmFnZWQgbm9kZSBncm91cCwgdGhlbiBwb3J0IDIyIG9uIHRoZSB3b3JrZXJcbiAgICogbm9kZXMgaXMgb3BlbmVkIHRvIHRoZSBpbnRlcm5ldCAoMC4wLjAuMC8wKS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBwb3J0IDIyIG9uIHRoZSB3b3JrZXIgbm9kZXMgaXMgb3BlbmVkIHRvIHRoZSBpbnRlcm5ldCAoMC4wLjAuMC8wKVxuICAgKi9cbiAgcmVhZG9ubHkgc291cmNlU2VjdXJpdHlHcm91cHM/OiBJU2VjdXJpdHlHcm91cFtdO1xufVxuXG4vKipcbiAqIExhdW5jaCB0ZW1wbGF0ZSBwcm9wZXJ0eSBzcGVjaWZpY2F0aW9uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTGF1bmNoVGVtcGxhdGVTcGVjIHtcbiAgLyoqXG4gICAqIFRoZSBMYXVuY2ggdGVtcGxhdGUgSURcbiAgICovXG4gIHJlYWRvbmx5IGlkOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgbGF1bmNoIHRlbXBsYXRlIHZlcnNpb24gdG8gYmUgdXNlZCAob3B0aW9uYWwpLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRoZSBkZWZhdWx0IHZlcnNpb24gb2YgdGhlIGxhdW5jaCB0ZW1wbGF0ZVxuICAgKi9cbiAgcmVhZG9ubHkgdmVyc2lvbj86IHN0cmluZztcbn1cblxuLyoqXG4gKiBFZmZlY3QgdHlwZXMgb2Yga3ViZXJuZXRlcyBub2RlIHRhaW50LlxuICovXG5leHBvcnQgZW51bSBUYWludEVmZmVjdCB7XG4gIC8qKlxuICAgKiBOb1NjaGVkdWxlXG4gICAqL1xuICBOT19TQ0hFRFVMRSA9ICdOT19TQ0hFRFVMRScsXG4gIC8qKlxuICAgKiBQcmVmZXJOb1NjaGVkdWxlXG4gICAqL1xuICBQUkVGRVJfTk9fU0NIRURVTEUgPSAnUFJFRkVSX05PX1NDSEVEVUxFJyxcbiAgLyoqXG4gICAqIE5vRXhlY3V0ZVxuICAgKi9cbiAgTk9fRVhFQ1VURSA9ICdOT19FWEVDVVRFJyxcbn1cblxuLyoqXG4gKiBUYWludCBpbnRlcmZhY2VcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBUYWludFNwZWMge1xuICAvKipcbiAgICogRWZmZWN0IHR5cGVcbiAgICpcbiAgICogQGRlZmF1bHQgLSBOb25lXG4gICAqL1xuICByZWFkb25seSBlZmZlY3Q/OiBUYWludEVmZmVjdDtcbiAgLyoqXG4gICAqIFRhaW50IGtleVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vbmVcbiAgICovXG4gIHJlYWRvbmx5IGtleT86IHN0cmluZztcbiAgLyoqXG4gICAqIFRhaW50IHZhbHVlXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgdmFsdWU/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogVGhlIE5vZGVncm91cCBPcHRpb25zIGZvciBhZGROb2RlR3JvdXAoKSBtZXRob2RcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOb2RlZ3JvdXBPcHRpb25zIHtcbiAgLyoqXG4gICAqIE5hbWUgb2YgdGhlIE5vZGVncm91cFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHJlc291cmNlIElEXG4gICAqL1xuICByZWFkb25seSBub2RlZ3JvdXBOYW1lPzogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIHN1Ym5ldHMgdG8gdXNlIGZvciB0aGUgQXV0byBTY2FsaW5nIGdyb3VwIHRoYXQgaXMgY3JlYXRlZCBmb3IgeW91ciBub2RlIGdyb3VwLiBCeSBzcGVjaWZ5aW5nIHRoZVxuICAgKiBTdWJuZXRTZWxlY3Rpb24sIHRoZSBzZWxlY3RlZCBzdWJuZXRzIHdpbGwgYXV0b21hdGljYWxseSBhcHBseSByZXF1aXJlZCB0YWdzIGkuZS5cbiAgICogYGt1YmVybmV0ZXMuaW8vY2x1c3Rlci9DTFVTVEVSX05BTUVgIHdpdGggYSB2YWx1ZSBvZiBgc2hhcmVkYCwgd2hlcmUgYENMVVNURVJfTkFNRWAgaXMgcmVwbGFjZWQgd2l0aFxuICAgKiB0aGUgbmFtZSBvZiB5b3VyIGNsdXN0ZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gcHJpdmF0ZSBzdWJuZXRzXG4gICAqL1xuICByZWFkb25seSBzdWJuZXRzPzogU3VibmV0U2VsZWN0aW9uO1xuICAvKipcbiAgICogVGhlIEFNSSB0eXBlIGZvciB5b3VyIG5vZGUgZ3JvdXAuIElmIHlvdSBleHBsaWNpdGx5IHNwZWNpZnkgdGhlIGxhdW5jaFRlbXBsYXRlIHdpdGggY3VzdG9tIEFNSSwgZG8gbm90IHNwZWNpZnkgdGhpcyBwcm9wZXJ0eSwgb3JcbiAgICogdGhlIG5vZGUgZ3JvdXAgZGVwbG95bWVudCB3aWxsIGZhaWwuIEluIG90aGVyIGNhc2VzLCB5b3Ugd2lsbCBuZWVkIHRvIHNwZWNpZnkgY29ycmVjdCBhbWlUeXBlIGZvciB0aGUgbm9kZWdyb3VwLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGF1dG8tZGV0ZXJtaW5lZCBmcm9tIHRoZSBpbnN0YW5jZVR5cGVzIHByb3BlcnR5IHdoZW4gbGF1bmNoVGVtcGxhdGVTcGVjIHByb3BlcnR5IGlzIG5vdCBzcGVjaWZpZWRcbiAgICovXG4gIHJlYWRvbmx5IGFtaVR5cGU/OiBOb2RlZ3JvdXBBbWlUeXBlO1xuICAvKipcbiAgICogVGhlIHJvb3QgZGV2aWNlIGRpc2sgc2l6ZSAoaW4gR2lCKSBmb3IgeW91ciBub2RlIGdyb3VwIGluc3RhbmNlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgMjBcbiAgICovXG4gIHJlYWRvbmx5IGRpc2tTaXplPzogbnVtYmVyO1xuICAvKipcbiAgICogVGhlIGN1cnJlbnQgbnVtYmVyIG9mIHdvcmtlciBub2RlcyB0aGF0IHRoZSBtYW5hZ2VkIG5vZGUgZ3JvdXAgc2hvdWxkIG1haW50YWluLiBJZiBub3Qgc3BlY2lmaWVkLFxuICAgKiB0aGUgbm9kZXdncm91cCB3aWxsIGluaXRpYWxseSBjcmVhdGUgYG1pblNpemVgIGluc3RhbmNlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgMlxuICAgKi9cbiAgcmVhZG9ubHkgZGVzaXJlZFNpemU/OiBudW1iZXI7XG4gIC8qKlxuICAgKiBUaGUgbWF4aW11bSBudW1iZXIgb2Ygd29ya2VyIG5vZGVzIHRoYXQgdGhlIG1hbmFnZWQgbm9kZSBncm91cCBjYW4gc2NhbGUgb3V0IHRvLiBNYW5hZ2VkIG5vZGUgZ3JvdXBzIGNhbiBzdXBwb3J0IHVwIHRvIDEwMCBub2RlcyBieSBkZWZhdWx0LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGRlc2lyZWRTaXplXG4gICAqL1xuICByZWFkb25seSBtYXhTaXplPzogbnVtYmVyO1xuICAvKipcbiAgICogVGhlIG1pbmltdW0gbnVtYmVyIG9mIHdvcmtlciBub2RlcyB0aGF0IHRoZSBtYW5hZ2VkIG5vZGUgZ3JvdXAgY2FuIHNjYWxlIGluIHRvLiBUaGlzIG51bWJlciBtdXN0IGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB6ZXJvLlxuICAgKlxuICAgKiBAZGVmYXVsdCAxXG4gICAqL1xuICByZWFkb25seSBtaW5TaXplPzogbnVtYmVyO1xuICAvKipcbiAgICogRm9yY2UgdGhlIHVwZGF0ZSBpZiB0aGUgZXhpc3Rpbmcgbm9kZSBncm91cCdzIHBvZHMgYXJlIHVuYWJsZSB0byBiZSBkcmFpbmVkIGR1ZSB0byBhIHBvZCBkaXNydXB0aW9uIGJ1ZGdldCBpc3N1ZS5cbiAgICogSWYgYW4gdXBkYXRlIGZhaWxzIGJlY2F1c2UgcG9kcyBjb3VsZCBub3QgYmUgZHJhaW5lZCwgeW91IGNhbiBmb3JjZSB0aGUgdXBkYXRlIGFmdGVyIGl0IGZhaWxzIHRvIHRlcm1pbmF0ZSB0aGUgb2xkXG4gICAqIG5vZGUgd2hldGhlciBvciBub3QgYW55IHBvZHMgYXJlXG4gICAqIHJ1bm5pbmcgb24gdGhlIG5vZGUuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IGZvcmNlVXBkYXRlPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFRoZSBpbnN0YW5jZSB0eXBlIHRvIHVzZSBmb3IgeW91ciBub2RlIGdyb3VwLiBDdXJyZW50bHksIHlvdSBjYW4gc3BlY2lmeSBhIHNpbmdsZSBpbnN0YW5jZSB0eXBlIGZvciBhIG5vZGUgZ3JvdXAuXG4gICAqIFRoZSBkZWZhdWx0IHZhbHVlIGZvciB0aGlzIHBhcmFtZXRlciBpcyBgdDMubWVkaXVtYC4gSWYgeW91IGNob29zZSBhIEdQVSBpbnN0YW5jZSB0eXBlLCBiZSBzdXJlIHRvIHNwZWNpZnkgdGhlXG4gICAqIGBBTDJfeDg2XzY0X0dQVWAgd2l0aCB0aGUgYW1pVHlwZSBwYXJhbWV0ZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IHQzLm1lZGl1bVxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGluc3RhbmNlVHlwZXNgIGluc3RlYWQuXG4gICAqL1xuICByZWFkb25seSBpbnN0YW5jZVR5cGU/OiBJbnN0YW5jZVR5cGU7XG4gIC8qKlxuICAgKiBUaGUgaW5zdGFuY2UgdHlwZXMgdG8gdXNlIGZvciB5b3VyIG5vZGUgZ3JvdXAuXG4gICAqIEBkZWZhdWx0IHQzLm1lZGl1bSB3aWxsIGJlIHVzZWQgYWNjb3JkaW5nIHRvIHRoZSBjbG91ZGZvcm1hdGlvbiBkb2N1bWVudC5cbiAgICogQHNlZSAtIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1la3Mtbm9kZWdyb3VwLmh0bWwjY2ZuLWVrcy1ub2RlZ3JvdXAtaW5zdGFuY2V0eXBlc1xuICAgKi9cbiAgcmVhZG9ubHkgaW5zdGFuY2VUeXBlcz86IEluc3RhbmNlVHlwZVtdO1xuICAvKipcbiAgICogVGhlIEt1YmVybmV0ZXMgbGFiZWxzIHRvIGJlIGFwcGxpZWQgdG8gdGhlIG5vZGVzIGluIHRoZSBub2RlIGdyb3VwIHdoZW4gdGhleSBhcmUgY3JlYXRlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBOb25lXG4gICAqL1xuICByZWFkb25seSBsYWJlbHM/OiB7IFtuYW1lOiBzdHJpbmddOiBzdHJpbmcgfTtcbiAgLyoqXG4gICAqIFRoZSBLdWJlcm5ldGVzIHRhaW50cyB0byBiZSBhcHBsaWVkIHRvIHRoZSBub2RlcyBpbiB0aGUgbm9kZSBncm91cCB3aGVuIHRoZXkgYXJlIGNyZWF0ZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgdGFpbnRzPzogVGFpbnRTcGVjW107XG4gIC8qKlxuICAgKiBUaGUgSUFNIHJvbGUgdG8gYXNzb2NpYXRlIHdpdGggeW91ciBub2RlIGdyb3VwLiBUaGUgQW1hem9uIEVLUyB3b3JrZXIgbm9kZSBrdWJlbGV0IGRhZW1vblxuICAgKiBtYWtlcyBjYWxscyB0byBBV1MgQVBJcyBvbiB5b3VyIGJlaGFsZi4gV29ya2VyIG5vZGVzIHJlY2VpdmUgcGVybWlzc2lvbnMgZm9yIHRoZXNlIEFQSSBjYWxscyB0aHJvdWdoXG4gICAqIGFuIElBTSBpbnN0YW5jZSBwcm9maWxlIGFuZCBhc3NvY2lhdGVkIHBvbGljaWVzLiBCZWZvcmUgeW91IGNhbiBsYXVuY2ggd29ya2VyIG5vZGVzIGFuZCByZWdpc3RlciB0aGVtXG4gICAqIGludG8gYSBjbHVzdGVyLCB5b3UgbXVzdCBjcmVhdGUgYW4gSUFNIHJvbGUgZm9yIHRob3NlIHdvcmtlciBub2RlcyB0byB1c2Ugd2hlbiB0aGV5IGFyZSBsYXVuY2hlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBOb25lLiBBdXRvLWdlbmVyYXRlZCBpZiBub3Qgc3BlY2lmaWVkLlxuICAgKi9cbiAgcmVhZG9ubHkgbm9kZVJvbGU/OiBJUm9sZTtcbiAgLyoqXG4gICAqIFRoZSBBTUkgdmVyc2lvbiBvZiB0aGUgQW1hem9uIEVLUy1vcHRpbWl6ZWQgQU1JIHRvIHVzZSB3aXRoIHlvdXIgbm9kZSBncm91cCAoZm9yIGV4YW1wbGUsIGAxLjE0LjctWVlZWU1NRERgKS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBUaGUgbGF0ZXN0IGF2YWlsYWJsZSBBTUkgdmVyc2lvbiBmb3IgdGhlIG5vZGUgZ3JvdXAncyBjdXJyZW50IEt1YmVybmV0ZXMgdmVyc2lvbiBpcyB1c2VkLlxuICAgKi9cbiAgcmVhZG9ubHkgcmVsZWFzZVZlcnNpb24/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgcmVtb3RlIGFjY2VzcyAoU1NIKSBjb25maWd1cmF0aW9uIHRvIHVzZSB3aXRoIHlvdXIgbm9kZSBncm91cC4gRGlzYWJsZWQgYnkgZGVmYXVsdCwgaG93ZXZlciwgaWYgeW91XG4gICAqIHNwZWNpZnkgYW4gQW1hem9uIEVDMiBTU0gga2V5IGJ1dCBkbyBub3Qgc3BlY2lmeSBhIHNvdXJjZSBzZWN1cml0eSBncm91cCB3aGVuIHlvdSBjcmVhdGUgYSBtYW5hZ2VkIG5vZGUgZ3JvdXAsXG4gICAqIHRoZW4gcG9ydCAyMiBvbiB0aGUgd29ya2VyIG5vZGVzIGlzIG9wZW5lZCB0byB0aGUgaW50ZXJuZXQgKDAuMC4wLjAvMClcbiAgICpcbiAgICogQGRlZmF1bHQgLSBkaXNhYmxlZFxuICAgKi9cbiAgcmVhZG9ubHkgcmVtb3RlQWNjZXNzPzogTm9kZWdyb3VwUmVtb3RlQWNjZXNzO1xuICAvKipcbiAgICogVGhlIG1ldGFkYXRhIHRvIGFwcGx5IHRvIHRoZSBub2RlIGdyb3VwIHRvIGFzc2lzdCB3aXRoIGNhdGVnb3JpemF0aW9uIGFuZCBvcmdhbml6YXRpb24uIEVhY2ggdGFnIGNvbnNpc3RzIG9mXG4gICAqIGEga2V5IGFuZCBhbiBvcHRpb25hbCB2YWx1ZSwgYm90aCBvZiB3aGljaCB5b3UgZGVmaW5lLiBOb2RlIGdyb3VwIHRhZ3MgZG8gbm90IHByb3BhZ2F0ZSB0byBhbnkgb3RoZXIgcmVzb3VyY2VzXG4gICAqIGFzc29jaWF0ZWQgd2l0aCB0aGUgbm9kZSBncm91cCwgc3VjaCBhcyB0aGUgQW1hem9uIEVDMiBpbnN0YW5jZXMgb3Igc3VibmV0cy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBOb25lXG4gICAqL1xuICByZWFkb25seSB0YWdzPzogeyBbbmFtZTogc3RyaW5nXTogc3RyaW5nIH07XG4gIC8qKlxuICAgKiBMYXVuY2ggdGVtcGxhdGUgc3BlY2lmaWNhdGlvbiB1c2VkIGZvciB0aGUgbm9kZWdyb3VwXG4gICAqIEBzZWUgLSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZWtzL2xhdGVzdC91c2VyZ3VpZGUvbGF1bmNoLXRlbXBsYXRlcy5odG1sXG4gICAqIEBkZWZhdWx0IC0gbm8gbGF1bmNoIHRlbXBsYXRlXG4gICAqL1xuICByZWFkb25seSBsYXVuY2hUZW1wbGF0ZVNwZWM/OiBMYXVuY2hUZW1wbGF0ZVNwZWM7XG4gIC8qKlxuICAgKiBUaGUgY2FwYWNpdHkgdHlwZSBvZiB0aGUgbm9kZWdyb3VwLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE9OX0RFTUFORFxuICAgKi9cbiAgcmVhZG9ubHkgY2FwYWNpdHlUeXBlPzogQ2FwYWNpdHlUeXBlO1xufVxuXG4vKipcbiAqIE5vZGVHcm91cCBwcm9wZXJ0aWVzIGludGVyZmFjZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5vZGVncm91cFByb3BzIGV4dGVuZHMgTm9kZWdyb3VwT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBDbHVzdGVyIHJlc291cmNlXG4gICAqL1xuICByZWFkb25seSBjbHVzdGVyOiBJQ2x1c3Rlcjtcbn1cblxuLyoqXG4gKiBUaGUgTm9kZWdyb3VwIHJlc291cmNlIGNsYXNzXG4gKi9cbmV4cG9ydCBjbGFzcyBOb2RlZ3JvdXAgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElOb2RlZ3JvdXAge1xuICAvKipcbiAgICogSW1wb3J0IHRoZSBOb2RlZ3JvdXAgZnJvbSBhdHRyaWJ1dGVzXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Ob2RlZ3JvdXBOYW1lKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIG5vZGVncm91cE5hbWU6IHN0cmluZyk6IElOb2RlZ3JvdXAge1xuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSU5vZGVncm91cCB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgbm9kZWdyb3VwTmFtZSA9IG5vZGVncm91cE5hbWU7XG4gICAgfVxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cbiAgLyoqXG4gICAqIEFSTiBvZiB0aGUgbm9kZWdyb3VwXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBub2RlZ3JvdXBBcm46IHN0cmluZztcbiAgLyoqXG4gICAqIE5vZGVncm91cCBuYW1lXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBub2RlZ3JvdXBOYW1lOiBzdHJpbmc7XG4gIC8qKlxuICAgKiB0aGUgQW1hem9uIEVLUyBjbHVzdGVyIHJlc291cmNlXG4gICAqXG4gICAqIEBhdHRyaWJ1dGUgQ2x1c3Rlck5hbWVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBjbHVzdGVyOiBJQ2x1c3RlcjtcbiAgLyoqXG4gICAqIElBTSByb2xlIG9mIHRoZSBpbnN0YW5jZSBwcm9maWxlIGZvciB0aGUgbm9kZWdyb3VwXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcm9sZTogSVJvbGU7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBkZXNpcmVkU2l6ZTogbnVtYmVyO1xuICBwcml2YXRlIHJlYWRvbmx5IG1heFNpemU6IG51bWJlcjtcbiAgcHJpdmF0ZSByZWFkb25seSBtaW5TaXplOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IE5vZGVncm91cFByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzLm5vZGVncm91cE5hbWUsXG4gICAgfSk7XG5cbiAgICB0aGlzLmNsdXN0ZXIgPSBwcm9wcy5jbHVzdGVyO1xuXG4gICAgdGhpcy5kZXNpcmVkU2l6ZSA9IHByb3BzLmRlc2lyZWRTaXplID8/IHByb3BzLm1pblNpemUgPz8gMjtcbiAgICB0aGlzLm1heFNpemUgPSBwcm9wcy5tYXhTaXplID8/IHRoaXMuZGVzaXJlZFNpemU7XG4gICAgdGhpcy5taW5TaXplID0gcHJvcHMubWluU2l6ZSA/PyAxO1xuXG4gICAgd2l0aFJlc29sdmVkKHRoaXMuZGVzaXJlZFNpemUsIHRoaXMubWF4U2l6ZSwgKGRlc2lyZWQsIG1heCkgPT4ge1xuICAgICAgaWYgKGRlc2lyZWQgPT09IHVuZGVmaW5lZCkge3JldHVybiA7fVxuICAgICAgaWYgKGRlc2lyZWQgPiBtYXgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBEZXNpcmVkIGNhcGFjaXR5ICR7ZGVzaXJlZH0gY2FuJ3QgYmUgZ3JlYXRlciB0aGFuIG1heCBzaXplICR7bWF4fWApO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgd2l0aFJlc29sdmVkKHRoaXMuZGVzaXJlZFNpemUsIHRoaXMubWluU2l6ZSwgKGRlc2lyZWQsIG1pbikgPT4ge1xuICAgICAgaWYgKGRlc2lyZWQgPT09IHVuZGVmaW5lZCkge3JldHVybiA7fVxuICAgICAgaWYgKGRlc2lyZWQgPCBtaW4pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBNaW5pbXVtIGNhcGFjaXR5ICR7bWlufSBjYW4ndCBiZSBncmVhdGVyIHRoYW4gZGVzaXJlZCBzaXplICR7ZGVzaXJlZH1gKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChwcm9wcy5sYXVuY2hUZW1wbGF0ZVNwZWMgJiYgcHJvcHMuZGlza1NpemUpIHtcbiAgICAgIC8vIHNlZSAtIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9la3MvbGF0ZXN0L3VzZXJndWlkZS9sYXVuY2gtdGVtcGxhdGVzLmh0bWxcbiAgICAgIC8vIGFuZCBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtZWtzLW5vZGVncm91cC5odG1sI2Nmbi1la3Mtbm9kZWdyb3VwLWRpc2tzaXplXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Rpc2tTaXplIG11c3QgYmUgc3BlY2lmaWVkIHdpdGhpbiB0aGUgbGF1bmNoIHRlbXBsYXRlJyk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmluc3RhbmNlVHlwZSAmJiBwcm9wcy5pbnN0YW5jZVR5cGVzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wiaW5zdGFuY2VUeXBlIGlzIGRlcHJlY2F0ZWQsIHBsZWFzZSB1c2UgXCJpbnN0YW5jZVR5cGVzXCIgb25seS4nKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMuaW5zdGFuY2VUeXBlKSB7XG4gICAgICBBbm5vdGF0aW9ucy5vZih0aGlzKS5hZGRXYXJuaW5nKCdcImluc3RhbmNlVHlwZVwiIGlzIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgbmV4dCBtYWpvciB2ZXJzaW9uLiBwbGVhc2UgdXNlIFwiaW5zdGFuY2VUeXBlc1wiIGluc3RlYWQnKTtcbiAgICB9XG4gICAgY29uc3QgaW5zdGFuY2VUeXBlcyA9IHByb3BzLmluc3RhbmNlVHlwZXMgPz8gKHByb3BzLmluc3RhbmNlVHlwZSA/IFtwcm9wcy5pbnN0YW5jZVR5cGVdIDogdW5kZWZpbmVkKTtcbiAgICBsZXQgcG9zc2libGVBbWlUeXBlczogTm9kZWdyb3VwQW1pVHlwZVtdID0gW107XG5cbiAgICBpZiAoaW5zdGFuY2VUeXBlcyAmJiBpbnN0YW5jZVR5cGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIC8qKlxuICAgICAgICogaWYgdGhlIHVzZXIgZXhwbGljaXRseSBjb25maWd1cmVkIGluc3RhbmNlIHR5cGVzLCB3ZSBjYW4ndCBjYWN1bGF0ZSB0aGUgZXhwZWN0ZWQgYW1pIHR5cGUgYXMgd2Ugc3VwcG9ydFxuICAgICAgICogQW1hem9uIExpbnV4IDIgYW5kIEJvdHRsZXJvY2tldCBub3cuIEhvd2V2ZXIgd2UgY2FuIGNoZWNrOlxuICAgICAgICpcbiAgICAgICAqIDEuIGluc3RhbmNlIHR5cGVzIG9mIGRpZmZlcmVudCBDUFUgYXJjaGl0ZWN0dXJlcyBhcmUgbm90IG1peGVkKGUuZy4gWDg2IHdpdGggQVJNKS5cbiAgICAgICAqIDIuIHVzZXItc3BlY2lmaWVkIGFtaVR5cGUgc2hvdWxkIGJlIGluY2x1ZGVkIGluIGBwb3NzaWJsZUFtaVR5cGVzYC5cbiAgICAgICAqL1xuICAgICAgcG9zc2libGVBbWlUeXBlcyA9IGdldFBvc3NpYmxlQW1pVHlwZXMoaW5zdGFuY2VUeXBlcyk7XG5cbiAgICAgIC8vIGlmIHRoZSB1c2VyIGV4cGxpY2l0bHkgY29uZmlndXJlZCBhbiBhbWkgdHlwZSwgbWFrZSBzdXJlIGl0J3MgaW5jbHVkZWQgaW4gdGhlIHBvc3NpYmxlQW1pVHlwZXNcbiAgICAgIGlmIChwcm9wcy5hbWlUeXBlICYmICFwb3NzaWJsZUFtaVR5cGVzLmluY2x1ZGVzKHByb3BzLmFtaVR5cGUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIHNwZWNpZmllZCBBTUkgZG9lcyBub3QgbWF0Y2ggdGhlIGluc3RhbmNlIHR5cGVzIGFyY2hpdGVjdHVyZSwgZWl0aGVyIHNwZWNpZnkgb25lIG9mICR7cG9zc2libGVBbWlUeXBlc30gb3IgZG9uJ3Qgc3BlY2lmeSBhbnlgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXByb3BzLm5vZGVSb2xlKSB7XG4gICAgICBjb25zdCBuZ1JvbGUgPSBuZXcgUm9sZSh0aGlzLCAnTm9kZUdyb3VwUm9sZScsIHtcbiAgICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnZWMyLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgIH0pO1xuXG4gICAgICBuZ1JvbGUuYWRkTWFuYWdlZFBvbGljeShNYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnQW1hem9uRUtTV29ya2VyTm9kZVBvbGljeScpKTtcbiAgICAgIG5nUm9sZS5hZGRNYW5hZ2VkUG9saWN5KE1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdBbWF6b25FS1NfQ05JX1BvbGljeScpKTtcbiAgICAgIG5nUm9sZS5hZGRNYW5hZ2VkUG9saWN5KE1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdBbWF6b25FQzJDb250YWluZXJSZWdpc3RyeVJlYWRPbmx5JykpO1xuICAgICAgdGhpcy5yb2xlID0gbmdSb2xlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJvbGUgPSBwcm9wcy5ub2RlUm9sZTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDZm5Ob2RlZ3JvdXAodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgY2x1c3Rlck5hbWU6IHRoaXMuY2x1c3Rlci5jbHVzdGVyTmFtZSxcbiAgICAgIG5vZGVncm91cE5hbWU6IHByb3BzLm5vZGVncm91cE5hbWUsXG4gICAgICBub2RlUm9sZTogdGhpcy5yb2xlLnJvbGVBcm4sXG4gICAgICBzdWJuZXRzOiB0aGlzLmNsdXN0ZXIudnBjLnNlbGVjdFN1Ym5ldHMocHJvcHMuc3VibmV0cykuc3VibmV0SWRzLFxuICAgICAgLyoqXG4gICAgICAgKiBDYXNlIDE6IElmIGxhdW5jaFRlbXBsYXRlIGlzIGV4cGxpY2l0bHkgc3BlY2lmaWVkIHdpdGggY3VzdG9tIEFNSSwgd2UgY2Fubm90IHNwZWNpZnkgYW1pVHlwZSwgb3IgdGhlIG5vZGUgZ3JvdXAgZGVwbG95bWVudCB3aWxsIGZhaWwuXG4gICAgICAgKiBBcyB3ZSBkb24ndCBrbm93IGlmIHRoZSBjdXN0b20gQU1JIGlzIHNwZWNpZmllZCBpbiB0aGUgbGF1Y2hUZW1wbGF0ZSwgd2UganVzdCB1c2UgcHJvcHMuYW1pVHlwZS5cbiAgICAgICAqXG4gICAgICAgKiBDYXNlIDI6IElmIGxhdW5jaFRlbXBsYXRlIGlzIG5vdCBzcGVjaWZpZWQsIHdlIHRyeSB0byBkZXRlcm1pbmUgYW1pVHlwZSBmcm9tIHRoZSBpbnN0YW5jZVR5cGVzIGFuZCBpdCBjb3VsZCBiZSBlaXRoZXIgQUwyIG9yIEJvdHRsZXJvY2tldC5cbiAgICAgICAqIFRvIGF2b2lkIGJyZWFraW5nIGNoYW5nZXMsIHdlIHVzZSBwb3NzaWJsZUFtaVR5cGVzWzBdIGlmIGFtaVR5cGUgaXMgdW5kZWZpbmVkIGFuZCBtYWtlIHN1cmUgQUwyIGlzIGFsd2F5cyB0aGUgZmlyc3QgZWxlbWVudCBpbiBwb3NzaWJsZUFtaVR5cGVzXG4gICAgICAgKiBhcyBBTDIgaXMgcHJldmlvdXNseSB0aGUgYGV4cGVjdGVkQW1pYCBhbmQgdGhpcyBhdm9pZHMgYnJlYWtpbmcgY2hhbmdlcy5cbiAgICAgICAqXG4gICAgICAgKiBUaGF0IGJlaW5nIHNhaWQsIHVzZXJzIG5vdyBlaXRoZXIgaGF2ZSB0byBleHBsaWNpdGx5IHNwZWNpZnkgY29ycmVjdCBhbWlUeXBlIG9yIGp1c3QgbGVhdmUgaXQgdW5kZWZpbmVkLlxuICAgICAgICovXG4gICAgICBhbWlUeXBlOiBwcm9wcy5sYXVuY2hUZW1wbGF0ZVNwZWMgPyBwcm9wcy5hbWlUeXBlIDogKHByb3BzLmFtaVR5cGUgPz8gcG9zc2libGVBbWlUeXBlc1swXSksXG4gICAgICBjYXBhY2l0eVR5cGU6IHByb3BzLmNhcGFjaXR5VHlwZSA/IHByb3BzLmNhcGFjaXR5VHlwZS52YWx1ZU9mKCkgOiB1bmRlZmluZWQsXG4gICAgICBkaXNrU2l6ZTogcHJvcHMuZGlza1NpemUsXG4gICAgICBmb3JjZVVwZGF0ZUVuYWJsZWQ6IHByb3BzLmZvcmNlVXBkYXRlID8/IHRydWUsXG5cbiAgICAgIC8vIG5vdGUgdGhhdCB3ZSBkb24ndCBjaGVjayBpZiBhIGxhdW5jaCB0ZW1wbGF0ZSBpcyBjb25maWd1cmVkIGhlcmUgKGV2ZW4gdGhvdWdoIGl0IG1pZ2h0IGNvbmZpZ3VyZSBpbnN0YW5jZSB0eXBlcyBhcyB3ZWxsKVxuICAgICAgLy8gYmVjYXVzZSB0aGlzIGRvZXNuJ3QgaGF2ZSBhIGRlZmF1bHQgdmFsdWUsIG1lYW5pbmcgdGhlIHVzZXIgaGFkIHRvIGV4cGxpY2l0bHkgY29uZmlndXJlIHRoaXMuXG4gICAgICBpbnN0YW5jZVR5cGVzOiBpbnN0YW5jZVR5cGVzPy5tYXAodCA9PiB0LnRvU3RyaW5nKCkpLFxuICAgICAgbGFiZWxzOiBwcm9wcy5sYWJlbHMsXG4gICAgICB0YWludHM6IHByb3BzLnRhaW50cyxcbiAgICAgIGxhdW5jaFRlbXBsYXRlOiBwcm9wcy5sYXVuY2hUZW1wbGF0ZVNwZWMsXG4gICAgICByZWxlYXNlVmVyc2lvbjogcHJvcHMucmVsZWFzZVZlcnNpb24sXG4gICAgICByZW1vdGVBY2Nlc3M6IHByb3BzLnJlbW90ZUFjY2VzcyA/IHtcbiAgICAgICAgZWMyU3NoS2V5OiBwcm9wcy5yZW1vdGVBY2Nlc3Muc3NoS2V5TmFtZSxcbiAgICAgICAgc291cmNlU2VjdXJpdHlHcm91cHM6IHByb3BzLnJlbW90ZUFjY2Vzcy5zb3VyY2VTZWN1cml0eUdyb3VwcyA/XG4gICAgICAgICAgcHJvcHMucmVtb3RlQWNjZXNzLnNvdXJjZVNlY3VyaXR5R3JvdXBzLm1hcChtID0+IG0uc2VjdXJpdHlHcm91cElkKSA6IHVuZGVmaW5lZCxcbiAgICAgIH0gOiB1bmRlZmluZWQsXG4gICAgICBzY2FsaW5nQ29uZmlnOiB7XG4gICAgICAgIGRlc2lyZWRTaXplOiB0aGlzLmRlc2lyZWRTaXplLFxuICAgICAgICBtYXhTaXplOiB0aGlzLm1heFNpemUsXG4gICAgICAgIG1pblNpemU6IHRoaXMubWluU2l6ZSxcbiAgICAgIH0sXG4gICAgICB0YWdzOiBwcm9wcy50YWdzLFxuICAgIH0pO1xuXG4gICAgLy8gbWFuYWdlZCBub2RlZ3JvdXBzIHVwZGF0ZSB0aGUgYGF3cy1hdXRoYCBvbiBjcmVhdGlvbiwgYnV0IHdlIHN0aWxsIG5lZWQgdG8gdHJhY2tcbiAgICAvLyBpdHMgc3RhdGUgZm9yIGNvbnNpc3RlbmN5LlxuICAgIGlmICh0aGlzLmNsdXN0ZXIgaW5zdGFuY2VvZiBDbHVzdGVyKSB7XG4gICAgICAvLyBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2VuX3VzL2Vrcy9sYXRlc3QvdXNlcmd1aWRlL2FkZC11c2VyLXJvbGUuaHRtbFxuICAgICAgdGhpcy5jbHVzdGVyLmF3c0F1dGguYWRkUm9sZU1hcHBpbmcodGhpcy5yb2xlLCB7XG4gICAgICAgIHVzZXJuYW1lOiAnc3lzdGVtOm5vZGU6e3tFQzJQcml2YXRlRE5TTmFtZX19JyxcbiAgICAgICAgZ3JvdXBzOiBbXG4gICAgICAgICAgJ3N5c3RlbTpib290c3RyYXBwZXJzJyxcbiAgICAgICAgICAnc3lzdGVtOm5vZGVzJyxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyB0aGUgY29udHJvbGxlciBydW5zIG9uIHRoZSB3b3JrZXIgbm9kZXMgc28gdGhleSBjYW5ub3RcbiAgICAgIC8vIGJlIGRlbGV0ZWQgYmVmb3JlIHRoZSBjb250cm9sbGVyLlxuICAgICAgaWYgKHRoaXMuY2x1c3Rlci5hbGJDb250cm9sbGVyKSB7XG4gICAgICAgIE5vZGUub2YodGhpcy5jbHVzdGVyLmFsYkNvbnRyb2xsZXIpLmFkZERlcGVuZGVuY3kodGhpcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5ub2RlZ3JvdXBBcm4gPSB0aGlzLmdldFJlc291cmNlQXJuQXR0cmlidXRlKHJlc291cmNlLmF0dHJBcm4sIHtcbiAgICAgIHNlcnZpY2U6ICdla3MnLFxuICAgICAgcmVzb3VyY2U6ICdub2RlZ3JvdXAnLFxuICAgICAgcmVzb3VyY2VOYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICB9KTtcbiAgICB0aGlzLm5vZGVncm91cE5hbWUgPSB0aGlzLmdldFJlc291cmNlTmFtZUF0dHJpYnV0ZShyZXNvdXJjZS5yZWYpO1xuICB9XG59XG5cbi8qKlxuICogQU1JIHR5cGVzIG9mIGRpZmZlcmVudCBhcmNoaXRlY3R1cmVzLiBNYWtlIHN1cmUgQUwyIGlzIGFsd2F5cyB0aGUgZmlyc3QgZWxlbWVudCwgd2hpY2ggd2lsbCBiZSB0aGUgZGVmYXVsdFxuICogQW1pVHlwZSBpZiBhbWlUeXBlIGFuZCBsYXVuY2hUZW1wbGF0ZVNwZWMgYXJlIGJvdGggdW5kZWZpbmVkLlxuICovXG5jb25zdCBhcm02NEFtaVR5cGVzOiBOb2RlZ3JvdXBBbWlUeXBlW10gPSBbTm9kZWdyb3VwQW1pVHlwZS5BTDJfQVJNXzY0LCBOb2RlZ3JvdXBBbWlUeXBlLkJPVFRMRVJPQ0tFVF9BUk1fNjRdO1xuY29uc3QgeDg2NjRBbWlUeXBlczogTm9kZWdyb3VwQW1pVHlwZVtdID0gW05vZGVncm91cEFtaVR5cGUuQUwyX1g4Nl82NCwgTm9kZWdyb3VwQW1pVHlwZS5CT1RUTEVST0NLRVRfWDg2XzY0XTtcbmNvbnN0IGdwdUFtaVR5cGVzOiBOb2RlZ3JvdXBBbWlUeXBlW10gPSBbTm9kZWdyb3VwQW1pVHlwZS5BTDJfWDg2XzY0X0dQVV07XG5cblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGNoZWNrIGlmIHRoZSBpbnN0YW5jZVR5cGUgaXMgR1BVIGluc3RhbmNlLlxuICogQHBhcmFtIGluc3RhbmNlVHlwZSBUaGUgRUMyIGluc3RhbmNlIHR5cGVcbiAqL1xuZnVuY3Rpb24gaXNHcHVJbnN0YW5jZVR5cGUoaW5zdGFuY2VUeXBlOiBJbnN0YW5jZVR5cGUpOiBib29sZWFuIHtcbiAgLy8gY2FwdHVyZSB0aGUgZmFtaWx5LCBnZW5lcmF0aW9uLCBjYXBhYmlsaXRpZXMsIGFuZCBzaXplIHBvcnRpb25zIG9mIHRoZSBpbnN0YW5jZSB0eXBlIGlkXG4gIGNvbnN0IGluc3RhbmNlVHlwZUNvbXBvbmVudHMgPSBpbnN0YW5jZVR5cGUudG9TdHJpbmcoKS5tYXRjaCgvXihbYS16XSspKFxcZHsxLDJ9KShbYS16XSopXFwuKFthLXowLTldKykkLyk7XG4gIGlmIChpbnN0YW5jZVR5cGVDb21wb25lbnRzID09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01hbGZvcm1lZCBpbnN0YW5jZSB0eXBlIGlkZW50aWZpZXInKTtcbiAgfVxuICBjb25zdCBmYW1pbHkgPSBpbnN0YW5jZVR5cGVDb21wb25lbnRzWzFdO1xuICByZXR1cm4gWydwJywgJ2cnLCAnaW5mJ10uaW5jbHVkZXMoZmFtaWx5KTtcbn1cblxudHlwZSBBbWlBcmNoaXRlY3R1cmUgPSBJbnN0YW5jZUFyY2hpdGVjdHVyZSB8ICdHUFUnO1xuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGV4YW1pbmVzIHRoZSBDUFUgYXJjaGl0ZWN0dXJlIG9mIGV2ZXJ5IGluc3RhbmNlIHR5cGUgYW5kIGRldGVybWluZXNcbiAqIHdoYXQgQU1JIHR5cGVzIGFyZSBjb21wYXRpYmxlIGZvciBhbGwgb2YgdGhlbS4gaXQgZWl0aGVyIHRocm93cyBvciBwcm9kdWNlcyBhbiBhcnJheSBvZiBwb3NzaWJsZSBBTUkgdHlwZXMgYmVjYXVzZVxuICogaW5zdGFuY2UgdHlwZXMgb2YgZGlmZmVyZW50IENQVSBhcmNoaXRlY3R1cmVzIGFyZSBub3Qgc3VwcG9ydGVkLlxuICogQHBhcmFtIGluc3RhbmNlVHlwZXMgVGhlIGluc3RhbmNlIHR5cGVzXG4gKiBAcmV0dXJucyBOb2RlZ3JvdXBBbWlUeXBlW11cbiAqL1xuZnVuY3Rpb24gZ2V0UG9zc2libGVBbWlUeXBlcyhpbnN0YW5jZVR5cGVzOiBJbnN0YW5jZVR5cGVbXSk6IE5vZGVncm91cEFtaVR5cGVbXSB7XG4gIGZ1bmN0aW9uIHR5cGVUb0FyY2goaW5zdGFuY2VUeXBlOiBJbnN0YW5jZVR5cGUpOiBBbWlBcmNoaXRlY3R1cmUge1xuICAgIHJldHVybiBpc0dwdUluc3RhbmNlVHlwZShpbnN0YW5jZVR5cGUpID8gJ0dQVScgOiBpbnN0YW5jZVR5cGUuYXJjaGl0ZWN0dXJlO1xuICB9XG4gIGNvbnN0IGFyY2hBbWlNYXAgPSBuZXcgTWFwPEFtaUFyY2hpdGVjdHVyZSwgTm9kZWdyb3VwQW1pVHlwZVtdPihbXG4gICAgW0luc3RhbmNlQXJjaGl0ZWN0dXJlLkFSTV82NCwgYXJtNjRBbWlUeXBlc10sXG4gICAgW0luc3RhbmNlQXJjaGl0ZWN0dXJlLlg4Nl82NCwgeDg2NjRBbWlUeXBlc10sXG4gICAgWydHUFUnLCBncHVBbWlUeXBlc10sXG4gIF0pO1xuICBjb25zdCBhcmNoaXRlY3R1cmVzOiBTZXQ8QW1pQXJjaGl0ZWN0dXJlPiA9IG5ldyBTZXQoaW5zdGFuY2VUeXBlcy5tYXAodHlwZVRvQXJjaCkpO1xuXG4gIGlmIChhcmNoaXRlY3R1cmVzLnNpemUgPT09IDApIHsgLy8gcHJvdGVjdGl2ZSBjb2RlLCB0aGUgY3VycmVudCBpbXBsZW1lbnRhdGlvbiB3aWxsIG5ldmVyIHJlc3VsdCBpbiB0aGlzLlxuICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGRldGVybWluZSBhbnkgYW1pIHR5cGUgY29tcHRhaWJsZSB3aXRoIGluc3RhbmNlIHR5cGVzOiAke2luc3RhbmNlVHlwZXMubWFwKGkgPT4gaS50b1N0cmluZykuam9pbignLCcpfWApO1xuICB9XG5cbiAgaWYgKGFyY2hpdGVjdHVyZXMuc2l6ZSA+IDEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2luc3RhbmNlVHlwZXMgb2YgZGlmZmVyZW50IGFyY2hpdGVjdHVyZXMgaXMgbm90IGFsbG93ZWQnKTtcbiAgfVxuXG4gIHJldHVybiBhcmNoQW1pTWFwLmdldChBcnJheS5mcm9tKGFyY2hpdGVjdHVyZXMpWzBdKSE7XG59XG4iXX0=