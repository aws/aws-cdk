"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeTypeForInstanceType = exports.NodeType = exports.EksOptimizedImage = exports.Cluster = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const path = require("path");
const autoscaling = require("@aws-cdk/aws-autoscaling");
const ec2 = require("@aws-cdk/aws-ec2");
const iam = require("@aws-cdk/aws-iam");
const lambda = require("@aws-cdk/aws-lambda");
const ssm = require("@aws-cdk/aws-ssm");
const core_1 = require("@aws-cdk/core");
const aws_auth_1 = require("./aws-auth");
const cluster_resource_1 = require("./cluster-resource");
const eks_generated_1 = require("./eks.generated");
const helm_chart_1 = require("./helm-chart");
const k8s_resource_1 = require("./k8s-resource");
const kubectl_layer_1 = require("./kubectl-layer");
const spot_interrupt_handler_1 = require("./spot-interrupt-handler");
const user_data_1 = require("./user-data");
// defaults are based on https://eksctl.io
const DEFAULT_CAPACITY_COUNT = 2;
const DEFAULT_CAPACITY_TYPE = ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.LARGE);
/**
 * A Cluster represents a managed Kubernetes Service (EKS)
 *
 * This is a fully managed cluster of API Servers (control-plane)
 * The user is still required to create the worker nodes.
 *
 * @resource AWS::EKS::Cluster
 */
class Cluster extends core_1.Resource {
    /**
     * Initiates an EKS Cluster with the supplied arguments
     *
     * @param scope a Construct, most likely a cdk.Stack created
     * @param name the name of the Construct to create
     * @param props properties in the IClusterProps interface
     */
    constructor(scope, id, props = {}) {
        super(scope, id, {
            physicalName: props.clusterName,
        });
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-eks-legacy.Cluster", "");
            jsiiDeprecationWarnings._aws_cdk_aws_eks_legacy_ClusterProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Cluster);
            }
            throw error;
        }
        core_1.Annotations.of(this).addWarning('The @aws-cdk/aws-eks-legacy module will no longer be released as part of the AWS CDK starting March 1st, 2020. Please refer to https://github.com/aws/aws-cdk/issues/5544 for upgrade instructions');
        const stack = core_1.Stack.of(this);
        this.vpc = props.vpc || new ec2.Vpc(this, 'DefaultVpc');
        this.version = props.version;
        this.tagSubnets();
        this.role = props.role || new iam.Role(this, 'ClusterRole', {
            assumedBy: new iam.ServicePrincipal('eks.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSClusterPolicy'),
                iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSServicePolicy'),
            ],
        });
        const securityGroup = props.securityGroup || new ec2.SecurityGroup(this, 'ControlPlaneSecurityGroup', {
            vpc: this.vpc,
            description: 'EKS Control Plane Security Group',
        });
        this.connections = new ec2.Connections({
            securityGroups: [securityGroup],
            defaultPort: ec2.Port.tcp(443),
        });
        // Get subnetIds for all selected subnets
        const placements = props.vpcSubnets || [{ subnetType: ec2.SubnetType.PUBLIC }, { subnetType: ec2.SubnetType.PRIVATE_WITH_NAT }];
        const subnetIds = [...new Set(Array().concat(...placements.map(s => this.vpc.selectSubnets(s).subnetIds)))];
        const clusterProps = {
            name: this.physicalName,
            roleArn: this.role.roleArn,
            version: props.version,
            resourcesVpcConfig: {
                securityGroupIds: [securityGroup.securityGroupId],
                subnetIds,
            },
        };
        let resource;
        this.kubectlEnabled = props.kubectlEnabled ?? true;
        if (this.kubectlEnabled) {
            resource = new cluster_resource_1.ClusterResource(this, 'Resource', clusterProps);
            this._defaultMastersRole = resource.creationRole;
        }
        else {
            resource = new eks_generated_1.CfnCluster(this, 'Resource', clusterProps);
        }
        this.clusterName = this.getResourceNameAttribute(resource.ref);
        this.clusterArn = this.getResourceArnAttribute(resource.attrArn, {
            service: 'eks',
            resource: 'cluster',
            resourceName: this.physicalName,
        });
        this.clusterEndpoint = resource.attrEndpoint;
        this.clusterCertificateAuthorityData = resource.attrCertificateAuthorityData;
        const updateConfigCommandPrefix = `aws eks update-kubeconfig --name ${this.clusterName}`;
        const getTokenCommandPrefix = `aws eks get-token --cluster-name ${this.clusterName}`;
        const commonCommandOptions = [`--region ${stack.region}`];
        if (props.outputClusterName) {
            new core_1.CfnOutput(this, 'ClusterName', { value: this.clusterName });
        }
        // we maintain a single manifest custom resource handler per cluster since
        // permissions and role are scoped. This will return `undefined` if kubectl
        // is not enabled for this cluster.
        this._k8sResourceHandler = this.createKubernetesResourceHandler();
        // map the IAM role to the `system:masters` group.
        if (props.mastersRole) {
            if (!this.kubectlEnabled) {
                throw new Error('Cannot specify a "masters" role if kubectl is disabled');
            }
            this.awsAuth.addMastersRole(props.mastersRole);
            if (props.outputMastersRoleArn) {
                new core_1.CfnOutput(this, 'MastersRoleArn', { value: props.mastersRole.roleArn });
            }
            commonCommandOptions.push(`--role-arn ${props.mastersRole.roleArn}`);
        }
        // allocate default capacity if non-zero (or default).
        const desiredCapacity = props.defaultCapacity ?? DEFAULT_CAPACITY_COUNT;
        if (desiredCapacity > 0) {
            const instanceType = props.defaultCapacityInstance || DEFAULT_CAPACITY_TYPE;
            this.defaultCapacity = this.addCapacity('DefaultCapacity', { instanceType, desiredCapacity });
        }
        const outputConfigCommand = props.outputConfigCommand ?? true;
        if (outputConfigCommand) {
            const postfix = commonCommandOptions.join(' ');
            new core_1.CfnOutput(this, 'ConfigCommand', { value: `${updateConfigCommandPrefix} ${postfix}` });
            new core_1.CfnOutput(this, 'GetTokenCommand', { value: `${getTokenCommandPrefix} ${postfix}` });
        }
    }
    /**
     * Import an existing cluster
     *
     * @param scope the construct scope, in most cases 'this'
     * @param id the id or name to import as
     * @param attrs the cluster properties to use for importing information
     */
    static fromClusterAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-eks-legacy.Cluster#fromClusterAttributes", "");
            jsiiDeprecationWarnings._aws_cdk_aws_eks_legacy_ClusterAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromClusterAttributes);
            }
            throw error;
        }
        return new ImportedCluster(scope, id, attrs);
    }
    /**
     * Add nodes to this EKS cluster
     *
     * The nodes will automatically be configured with the right VPC and AMI
     * for the instance type and Kubernetes version.
     *
     * Spot instances will be labeled `lifecycle=Ec2Spot` and tainted with `PreferNoSchedule`.
     * If kubectl is enabled, the
     * [spot interrupt handler](https://github.com/awslabs/ec2-spot-labs/tree/master/ec2-spot-eks-solution/spot-termination-handler)
     * daemon will be installed on all spot instances to handle
     * [EC2 Spot Instance Termination Notices](https://aws.amazon.com/blogs/aws/new-ec2-spot-instance-termination-notices/).
     */
    addCapacity(id, options) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-eks-legacy.Cluster#addCapacity", "");
            jsiiDeprecationWarnings._aws_cdk_aws_eks_legacy_CapacityOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addCapacity);
            }
            throw error;
        }
        const asg = new autoscaling.AutoScalingGroup(this, id, {
            ...options,
            vpc: this.vpc,
            machineImage: new EksOptimizedImage({
                nodeType: nodeTypeForInstanceType(options.instanceType),
                kubernetesVersion: this.version,
            }),
            updateType: options.updateType || autoscaling.UpdateType.ROLLING_UPDATE,
            instanceType: options.instanceType,
        });
        this.addAutoScalingGroup(asg, {
            mapRole: options.mapRole,
            bootstrapOptions: options.bootstrapOptions,
            bootstrapEnabled: options.bootstrapEnabled,
        });
        return asg;
    }
    /**
     * Add compute capacity to this EKS cluster in the form of an AutoScalingGroup
     *
     * The AutoScalingGroup must be running an EKS-optimized AMI containing the
     * /etc/eks/bootstrap.sh script. This method will configure Security Groups,
     * add the right policies to the instance role, apply the right tags, and add
     * the required user data to the instance's launch configuration.
     *
     * Spot instances will be labeled `lifecycle=Ec2Spot` and tainted with `PreferNoSchedule`.
     * If kubectl is enabled, the
     * [spot interrupt handler](https://github.com/awslabs/ec2-spot-labs/tree/master/ec2-spot-eks-solution/spot-termination-handler)
     * daemon will be installed on all spot instances to handle
     * [EC2 Spot Instance Termination Notices](https://aws.amazon.com/blogs/aws/new-ec2-spot-instance-termination-notices/).
     *
     * Prefer to use `addCapacity` if possible.
     *
     * @see https://docs.aws.amazon.com/eks/latest/userguide/launch-workers.html
     * @param autoScalingGroup [disable-awslint:ref-via-interface]
     * @param options options for adding auto scaling groups, like customizing the bootstrap script
     */
    addAutoScalingGroup(autoScalingGroup, options) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-eks-legacy.Cluster#addAutoScalingGroup", "");
            jsiiDeprecationWarnings._aws_cdk_aws_eks_legacy_AutoScalingGroupOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addAutoScalingGroup);
            }
            throw error;
        }
        // self rules
        autoScalingGroup.connections.allowInternally(ec2.Port.allTraffic());
        // Cluster to:nodes rules
        autoScalingGroup.connections.allowFrom(this, ec2.Port.tcp(443));
        autoScalingGroup.connections.allowFrom(this, ec2.Port.tcpRange(1025, 65535));
        // Allow HTTPS from Nodes to Cluster
        autoScalingGroup.connections.allowTo(this, ec2.Port.tcp(443));
        // Allow all node outbound traffic
        autoScalingGroup.connections.allowToAnyIpv4(ec2.Port.allTcp());
        autoScalingGroup.connections.allowToAnyIpv4(ec2.Port.allUdp());
        autoScalingGroup.connections.allowToAnyIpv4(ec2.Port.allIcmp());
        const bootstrapEnabled = options.bootstrapEnabled ?? true;
        if (options.bootstrapOptions && !bootstrapEnabled) {
            throw new Error('Cannot specify "bootstrapOptions" if "bootstrapEnabled" is false');
        }
        if (bootstrapEnabled) {
            const userData = user_data_1.renderUserData(this.clusterName, autoScalingGroup, options.bootstrapOptions);
            autoScalingGroup.addUserData(...userData);
        }
        autoScalingGroup.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSWorkerNodePolicy'));
        autoScalingGroup.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKS_CNI_Policy'));
        autoScalingGroup.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryReadOnly'));
        // EKS Required Tags
        core_1.Tags.of(autoScalingGroup).add(`kubernetes.io/cluster/${this.clusterName}`, 'owned', {
            applyToLaunchedInstances: true,
        });
        if (options.mapRole === true && !this.kubectlEnabled) {
            throw new Error('Cannot map instance IAM role to RBAC if kubectl is disabled for the cluster');
        }
        // do not attempt to map the role if `kubectl` is not enabled for this
        // cluster or if `mapRole` is set to false. By default this should happen.
        const mapRole = options.mapRole ?? true;
        if (mapRole && this.kubectlEnabled) {
            // see https://docs.aws.amazon.com/en_us/eks/latest/userguide/add-user-role.html
            this.awsAuth.addRoleMapping(autoScalingGroup.role, {
                username: 'system:node:{{EC2PrivateDNSName}}',
                groups: [
                    'system:bootstrappers',
                    'system:nodes',
                ],
            });
        }
        else {
            // since we are not mapping the instance role to RBAC, synthesize an
            // output so it can be pasted into `aws-auth-cm.yaml`
            new core_1.CfnOutput(autoScalingGroup, 'InstanceRoleARN', {
                value: autoScalingGroup.role.roleArn,
            });
        }
        // if this is an ASG with spot instances, install the spot interrupt handler (only if kubectl is enabled).
        if (autoScalingGroup.spotPrice && this.kubectlEnabled) {
            this.addResource('spot-interrupt-handler', ...spot_interrupt_handler_1.spotInterruptHandler());
        }
    }
    /**
     * Lazily creates the AwsAuth resource, which manages AWS authentication mapping.
     */
    get awsAuth() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-eks-legacy.Cluster#awsAuth", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, jsiiDeprecationWarnings.getPropertyDescriptor(this, "awsAuth").get);
            }
            throw error;
        }
        if (!this.kubectlEnabled) {
            throw new Error('Cannot define aws-auth mappings if kubectl is disabled');
        }
        if (!this._awsAuth) {
            this._awsAuth = new aws_auth_1.AwsAuth(this, 'AwsAuth', { cluster: this });
        }
        return this._awsAuth;
    }
    /**
     * Defines a Kubernetes resource in this cluster.
     *
     * The manifest will be applied/deleted using kubectl as needed.
     *
     * @param id logical id of this manifest
     * @param manifest a list of Kubernetes resource specifications
     * @returns a `KubernetesResource` object.
     * @throws If `kubectlEnabled` is `false`
     */
    addResource(id, ...manifest) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-eks-legacy.Cluster#addResource", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addResource);
            }
            throw error;
        }
        return new k8s_resource_1.KubernetesResource(this, `manifest-${id}`, { cluster: this, manifest });
    }
    /**
     * Defines a Helm chart in this cluster.
     *
     * @param id logical id of this chart.
     * @param options options of this chart.
     * @returns a `HelmChart` object
     * @throws If `kubectlEnabled` is `false`
     */
    addChart(id, options) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-eks-legacy.Cluster#addChart", "");
            jsiiDeprecationWarnings._aws_cdk_aws_eks_legacy_HelmChartOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addChart);
            }
            throw error;
        }
        return new helm_chart_1.HelmChart(this, `chart-${id}`, { cluster: this, ...options });
    }
    createKubernetesResourceHandler() {
        if (!this.kubectlEnabled) {
            return undefined;
        }
        return new lambda.Function(this, 'KubernetesResourceHandler', {
            code: lambda.Code.fromAsset(path.join(__dirname, 'k8s-resource')),
            runtime: lambda.Runtime.PYTHON_3_7,
            handler: 'index.handler',
            timeout: core_1.Duration.minutes(15),
            layers: [kubectl_layer_1.KubectlLayer.getOrCreate(this)],
            memorySize: 256,
            environment: {
                CLUSTER_NAME: this.clusterName,
            },
            // NOTE: we must use the default IAM role that's mapped to "system:masters"
            // as the execution role of this custom resource handler. This is the only
            // way to be able to interact with the cluster after it's been created.
            role: this._defaultMastersRole,
        });
    }
    /**
     * Opportunistically tag subnets with the required tags.
     *
     * If no subnets could be found (because this is an imported VPC), add a warning.
     *
     * @see https://docs.aws.amazon.com/eks/latest/userguide/network_reqs.html
     */
    tagSubnets() {
        const tagAllSubnets = (type, subnets, tag) => {
            for (const subnet of subnets) {
                // if this is not a concrete subnet, attach a construct warning
                if (!ec2.Subnet.isVpcSubnet(subnet)) {
                    // message (if token): "could not auto-tag public/private subnet with tag..."
                    // message (if not token): "count not auto-tag public/private subnet xxxxx with tag..."
                    const subnetID = core_1.Token.isUnresolved(subnet.subnetId) ? '' : ` ${subnet.subnetId}`;
                    core_1.Annotations.of(this).addWarning(`Could not auto-tag ${type} subnet${subnetID} with "${tag}=1", please remember to do this manually`);
                    continue;
                }
                core_1.Tags.of(subnet).add(tag, '1');
            }
        };
        // https://docs.aws.amazon.com/eks/latest/userguide/network_reqs.html
        tagAllSubnets('private', this.vpc.privateSubnets, 'kubernetes.io/role/internal-elb');
        tagAllSubnets('public', this.vpc.publicSubnets, 'kubernetes.io/role/elb');
    }
}
exports.Cluster = Cluster;
_a = JSII_RTTI_SYMBOL_1;
Cluster[_a] = { fqn: "@aws-cdk/aws-eks-legacy.Cluster", version: "0.0.0" };
/**
 * Import a cluster to use in another stack
 */
class ImportedCluster extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        this.connections = new ec2.Connections();
        this.vpc = ec2.Vpc.fromVpcAttributes(this, 'VPC', props.vpc);
        this.clusterName = props.clusterName;
        this.clusterEndpoint = props.clusterEndpoint;
        this.clusterArn = props.clusterArn;
        this.clusterCertificateAuthorityData = props.clusterCertificateAuthorityData;
        let i = 1;
        for (const sgProps of props.securityGroups) {
            this.connections.addSecurityGroup(ec2.SecurityGroup.fromSecurityGroupId(this, `SecurityGroup${i}`, sgProps.securityGroupId));
            i++;
        }
    }
}
/**
 * Construct an Amazon Linux 2 image from the latest EKS Optimized AMI published in SSM
 */
class EksOptimizedImage {
    /**
     * Constructs a new instance of the EcsOptimizedAmi class.
     */
    constructor(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-eks-legacy.EksOptimizedImage", "");
            jsiiDeprecationWarnings._aws_cdk_aws_eks_legacy_EksOptimizedImageProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, EksOptimizedImage);
            }
            throw error;
        }
        this.nodeType = props && props.nodeType;
        this.kubernetesVersion = props && props.kubernetesVersion || LATEST_KUBERNETES_VERSION;
        // set the SSM parameter name
        this.amiParameterName = `/aws/service/eks/optimized-ami/${this.kubernetesVersion}/`
            + (this.nodeType === NodeType.STANDARD ? 'amazon-linux-2/' : '')
            + (this.nodeType === NodeType.GPU ? 'amazon-linux2-gpu/' : '')
            + 'recommended/image_id';
    }
    /**
     * Return the correct image
     */
    getImage(scope) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-eks-legacy.EksOptimizedImage#getImage", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.getImage);
            }
            throw error;
        }
        const ami = ssm.StringParameter.valueForStringParameter(scope, this.amiParameterName);
        return {
            imageId: ami,
            osType: ec2.OperatingSystemType.LINUX,
            userData: ec2.UserData.forLinux(),
        };
    }
}
exports.EksOptimizedImage = EksOptimizedImage;
_b = JSII_RTTI_SYMBOL_1;
EksOptimizedImage[_b] = { fqn: "@aws-cdk/aws-eks-legacy.EksOptimizedImage", version: "0.0.0" };
// MAINTAINERS: use ./scripts/kube_bump.sh to update LATEST_KUBERNETES_VERSION
const LATEST_KUBERNETES_VERSION = '1.14';
/**
 * Whether the worker nodes should support GPU or just standard instances
 */
var NodeType;
(function (NodeType) {
    /**
     * Standard instances
     */
    NodeType["STANDARD"] = "Standard";
    /**
     * GPU instances
     */
    NodeType["GPU"] = "GPU";
})(NodeType = exports.NodeType || (exports.NodeType = {}));
const GPU_INSTANCETYPES = ['p2', 'p3', 'g4'];
function nodeTypeForInstanceType(instanceType) {
    return GPU_INSTANCETYPES.includes(instanceType.toString().substring(0, 2)) ? NodeType.GPU : NodeType.STANDARD;
}
exports.nodeTypeForInstanceType = nodeTypeForInstanceType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2x1c3Rlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsdXN0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNkJBQTZCO0FBQzdCLHdEQUF3RDtBQUN4RCx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLDhDQUE4QztBQUM5Qyx3Q0FBd0M7QUFDeEMsd0NBQTBHO0FBRTFHLHlDQUFxQztBQUNyQyx5REFBcUQ7QUFDckQsbURBQThEO0FBQzlELDZDQUEyRDtBQUMzRCxpREFBb0Q7QUFDcEQsbURBQStDO0FBQy9DLHFFQUFnRTtBQUNoRSwyQ0FBNkM7QUFFN0MsMENBQTBDO0FBQzFDLE1BQU0sc0JBQXNCLEdBQUcsQ0FBQyxDQUFDO0FBQ2pDLE1BQU0scUJBQXFCLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQWdOaEc7Ozs7Ozs7R0FPRztBQUNILE1BQWEsT0FBUSxTQUFRLGVBQVE7SUE0Rm5DOzs7Ozs7T0FNRztJQUNILFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsUUFBc0IsRUFBRztRQUNqRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUNmLFlBQVksRUFBRSxLQUFLLENBQUMsV0FBVztTQUNoQyxDQUFDLENBQUM7Ozs7Ozs7K0NBdEdNLE9BQU87Ozs7UUF3R2hCLGtCQUFXLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxvTUFBb00sQ0FBQyxDQUFDO1FBRXRPLE1BQU0sS0FBSyxHQUFHLFlBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFN0IsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxJQUFJLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDeEQsSUFBSSxD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QUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7QUFDaEgsQ0FBQztBQUZELDBEQUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGF1dG9zY2FsaW5nIGZyb20gJ0Bhd3MtY2RrL2F3cy1hdXRvc2NhbGluZyc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBzc20gZnJvbSAnQGF3cy1jZGsvYXdzLXNzbSc7XG5pbXBvcnQgeyBBbm5vdGF0aW9ucywgQ2ZuT3V0cHV0LCBEdXJhdGlvbiwgSVJlc291cmNlLCBSZXNvdXJjZSwgU3RhY2ssIFRva2VuLCBUYWdzIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEF3c0F1dGggfSBmcm9tICcuL2F3cy1hdXRoJztcbmltcG9ydCB7IENsdXN0ZXJSZXNvdXJjZSB9IGZyb20gJy4vY2x1c3Rlci1yZXNvdXJjZSc7XG5pbXBvcnQgeyBDZm5DbHVzdGVyLCBDZm5DbHVzdGVyUHJvcHMgfSBmcm9tICcuL2Vrcy5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgSGVsbUNoYXJ0LCBIZWxtQ2hhcnRPcHRpb25zIH0gZnJvbSAnLi9oZWxtLWNoYXJ0JztcbmltcG9ydCB7IEt1YmVybmV0ZXNSZXNvdXJjZSB9IGZyb20gJy4vazhzLXJlc291cmNlJztcbmltcG9ydCB7IEt1YmVjdGxMYXllciB9IGZyb20gJy4va3ViZWN0bC1sYXllcic7XG5pbXBvcnQgeyBzcG90SW50ZXJydXB0SGFuZGxlciB9IGZyb20gJy4vc3BvdC1pbnRlcnJ1cHQtaGFuZGxlcic7XG5pbXBvcnQgeyByZW5kZXJVc2VyRGF0YSB9IGZyb20gJy4vdXNlci1kYXRhJztcblxuLy8gZGVmYXVsdHMgYXJlIGJhc2VkIG9uIGh0dHBzOi8vZWtzY3RsLmlvXG5jb25zdCBERUZBVUxUX0NBUEFDSVRZX0NPVU5UID0gMjtcbmNvbnN0IERFRkFVTFRfQ0FQQUNJVFlfVFlQRSA9IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuTTUsIGVjMi5JbnN0YW5jZVNpemUuTEFSR0UpO1xuXG4vKipcbiAqIEFuIEVLUyBjbHVzdGVyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUNsdXN0ZXIgZXh0ZW5kcyBJUmVzb3VyY2UsIGVjMi5JQ29ubmVjdGFibGUge1xuICAvKipcbiAgICogVGhlIFZQQyBpbiB3aGljaCB0aGlzIENsdXN0ZXIgd2FzIGNyZWF0ZWRcbiAgICovXG4gIHJlYWRvbmx5IHZwYzogZWMyLklWcGM7XG5cbiAgLyoqXG4gICAqIFRoZSBwaHlzaWNhbCBuYW1lIG9mIHRoZSBDbHVzdGVyXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGNsdXN0ZXJOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB1bmlxdWUgQVJOIGFzc2lnbmVkIHRvIHRoZSBzZXJ2aWNlIGJ5IEFXU1xuICAgKiBpbiB0aGUgZm9ybSBvZiBhcm46YXdzOmVrczpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgY2x1c3RlckFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQVBJIFNlcnZlciBlbmRwb2ludCBVUkxcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgY2x1c3RlckVuZHBvaW50OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBjZXJ0aWZpY2F0ZS1hdXRob3JpdHktZGF0YSBmb3IgeW91ciBjbHVzdGVyLlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBjbHVzdGVyQ2VydGlmaWNhdGVBdXRob3JpdHlEYXRhOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2x1c3RlckF0dHJpYnV0ZXMge1xuICAvKipcbiAgICogVGhlIFZQQyBpbiB3aGljaCB0aGlzIENsdXN0ZXIgd2FzIGNyZWF0ZWRcbiAgICovXG4gIHJlYWRvbmx5IHZwYzogZWMyLklWcGM7XG5cbiAgLyoqXG4gICAqIFRoZSBwaHlzaWNhbCBuYW1lIG9mIHRoZSBDbHVzdGVyXG4gICAqL1xuICByZWFkb25seSBjbHVzdGVyTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgdW5pcXVlIEFSTiBhc3NpZ25lZCB0byB0aGUgc2VydmljZSBieSBBV1NcbiAgICogaW4gdGhlIGZvcm0gb2YgYXJuOmF3czpla3M6XG4gICAqL1xuICByZWFkb25seSBjbHVzdGVyQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBBUEkgU2VydmVyIGVuZHBvaW50IFVSTFxuICAgKi9cbiAgcmVhZG9ubHkgY2x1c3RlckVuZHBvaW50OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBjZXJ0aWZpY2F0ZS1hdXRob3JpdHktZGF0YSBmb3IgeW91ciBjbHVzdGVyLlxuICAgKi9cbiAgcmVhZG9ubHkgY2x1c3RlckNlcnRpZmljYXRlQXV0aG9yaXR5RGF0YTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgc2VjdXJpdHkgZ3JvdXBzIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGNsdXN0ZXIuXG4gICAqL1xuICByZWFkb25seSBzZWN1cml0eUdyb3VwczogZWMyLklTZWN1cml0eUdyb3VwW107XG59XG5cbi8qKlxuICogUHJvcGVydGllcyB0byBpbnN0YW50aWF0ZSB0aGUgQ2x1c3RlclxuICovXG5leHBvcnQgaW50ZXJmYWNlIENsdXN0ZXJQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgVlBDIGluIHdoaWNoIHRvIGNyZWF0ZSB0aGUgQ2x1c3RlclxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGEgVlBDIHdpdGggZGVmYXVsdCBjb25maWd1cmF0aW9uIHdpbGwgYmUgY3JlYXRlZCBhbmQgY2FuIGJlIGFjY2Vzc2VkIHRocm91Z2ggYGNsdXN0ZXIudnBjYC5cbiAgICovXG4gIHJlYWRvbmx5IHZwYz86IGVjMi5JVnBjO1xuXG4gIC8qKlxuICAgKiBXaGVyZSB0byBwbGFjZSBFS1MgQ29udHJvbCBQbGFuZSBFTklzXG4gICAqXG4gICAqIElmIHlvdSB3YW50IHRvIGNyZWF0ZSBwdWJsaWMgbG9hZCBiYWxhbmNlcnMsIHRoaXMgbXVzdCBpbmNsdWRlIHB1YmxpYyBzdWJuZXRzLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgdG8gb25seSBzZWxlY3QgcHJpdmF0ZSBzdWJuZXRzLCBzdXBwbHkgdGhlIGZvbGxvd2luZzpcbiAgICpcbiAgICogYGBgdHNcbiAgICogY29uc3QgdnBjU3VibmV0cyA9IFtcbiAgICogICB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9OQVQgfVxuICAgKiBdXG4gICAqIGBgYFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEFsbCBwdWJsaWMgYW5kIHByaXZhdGUgc3VibmV0c1xuICAgKi9cbiAgcmVhZG9ubHkgdnBjU3VibmV0cz86IGVjMi5TdWJuZXRTZWxlY3Rpb25bXTtcblxuICAvKipcbiAgICogUm9sZSB0aGF0IHByb3ZpZGVzIHBlcm1pc3Npb25zIGZvciB0aGUgS3ViZXJuZXRlcyBjb250cm9sIHBsYW5lIHRvIG1ha2UgY2FsbHMgdG8gQVdTIEFQSSBvcGVyYXRpb25zIG9uIHlvdXIgYmVoYWxmLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEEgcm9sZSBpcyBhdXRvbWF0aWNhbGx5IGNyZWF0ZWQgZm9yIHlvdVxuICAgKi9cbiAgcmVhZG9ubHkgcm9sZT86IGlhbS5JUm9sZTtcblxuICAvKipcbiAgICogTmFtZSBmb3IgdGhlIGNsdXN0ZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQXV0b21hdGljYWxseSBnZW5lcmF0ZWQgbmFtZVxuICAgKi9cbiAgcmVhZG9ubHkgY2x1c3Rlck5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFNlY3VyaXR5IEdyb3VwIHRvIHVzZSBmb3IgQ29udHJvbCBQbGFuZSBFTklzXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQSBzZWN1cml0eSBncm91cCBpcyBhdXRvbWF0aWNhbGx5IGNyZWF0ZWRcbiAgICovXG4gIHJlYWRvbmx5IHNlY3VyaXR5R3JvdXA/OiBlYzIuSVNlY3VyaXR5R3JvdXA7XG5cbiAgLyoqXG4gICAqIFRoZSBLdWJlcm5ldGVzIHZlcnNpb24gdG8gcnVuIGluIHRoZSBjbHVzdGVyXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gSWYgbm90IHN1cHBsaWVkLCB3aWxsIHVzZSBBbWF6b24gZGVmYXVsdCB2ZXJzaW9uXG4gICAqL1xuICByZWFkb25seSB2ZXJzaW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBbiBJQU0gcm9sZSB0aGF0IHdpbGwgYmUgYWRkZWQgdG8gdGhlIGBzeXN0ZW06bWFzdGVyc2AgS3ViZXJuZXRlcyBSQkFDXG4gICAqIGdyb3VwLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8va3ViZXJuZXRlcy5pby9kb2NzL3JlZmVyZW5jZS9hY2Nlc3MtYXV0aG4tYXV0aHovcmJhYy8jZGVmYXVsdC1yb2xlcy1hbmQtcm9sZS1iaW5kaW5nc1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIEJ5IGRlZmF1bHQsIGl0IHdpbGwgb25seSBwb3NzaWJsZSB0byB1cGRhdGUgdGhpcyBLdWJlcm5ldGVzXG4gICAqICAgICAgICAgICAgc3lzdGVtIGJ5IGFkZGluZyByZXNvdXJjZXMgdG8gdGhpcyBjbHVzdGVyIHZpYSBgYWRkUmVzb3VyY2VgIG9yXG4gICAqICAgICAgICAgICAgYnkgZGVmaW5pbmcgYEt1YmVybmV0ZXNSZXNvdXJjZWAgcmVzb3VyY2VzIGluIHlvdXIgQVdTIENESyBhcHAuXG4gICAqICAgICAgICAgICAgVXNlIHRoaXMgaWYgeW91IHdpc2ggdG8gZ3JhbnQgY2x1c3RlciBhZG1pbmlzdHJhdGlvbiBwcml2aWxlZ2VzXG4gICAqICAgICAgICAgICAgdG8gYW5vdGhlciByb2xlLlxuICAgKi9cbiAgcmVhZG9ubHkgbWFzdGVyc1JvbGU/OiBpYW0uSVJvbGU7XG5cbiAgLyoqXG4gICAqIEFsbG93cyBkZWZpbmluZyBga3ViZWN0cmxgLXJlbGF0ZWQgcmVzb3VyY2VzIG9uIHRoaXMgY2x1c3Rlci5cbiAgICpcbiAgICogSWYgdGhpcyBpcyBkaXNhYmxlZCwgaXQgd2lsbCBub3QgYmUgcG9zc2libGUgdG8gdXNlIHRoZSBmb2xsb3dpbmdcbiAgICogY2FwYWJpbGl0aWVzOlxuICAgKiAtIGBhZGRSZXNvdXJjZWBcbiAgICogLSBgYWRkUm9sZU1hcHBpbmdgXG4gICAqIC0gYGFkZFVzZXJNYXBwaW5nYFxuICAgKiAtIGBhZGRNYXN0ZXJzUm9sZWAgYW5kIGBwcm9wcy5tYXN0ZXJzUm9sZWBcbiAgICpcbiAgICogSWYgdGhpcyBpcyBkaXNhYmxlZCwgdGhlIGNsdXN0ZXIgY2FuIG9ubHkgYmUgbWFuYWdlZCBieSBpc3N1aW5nIGBrdWJlY3RsYFxuICAgKiBjb21tYW5kcyBmcm9tIGEgc2Vzc2lvbiB0aGF0IHVzZXMgdGhlIElBTSByb2xlL3VzZXIgdGhhdCBjcmVhdGVkIHRoZVxuICAgKiBhY2NvdW50LlxuICAgKlxuICAgKiBfTk9URV86IGNoYW5naW5nIHRoaXMgdmFsdWUgd2lsbCBkZXN0b3kgdGhlIGNsdXN0ZXIuIFRoaXMgaXMgYmVjYXVzZSBhXG4gICAqIG1hbmFnYWJsZSBjbHVzdGVyIG11c3QgYmUgY3JlYXRlZCB1c2luZyBhbiBBV1MgQ2xvdWRGb3JtYXRpb24gY3VzdG9tXG4gICAqIHJlc291cmNlIHdoaWNoIGV4ZWN1dGVzIHdpdGggYW4gSUFNIHJvbGUgb3duZWQgYnkgdGhlIENESyBhcHAuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWUgVGhlIGNsdXN0ZXIgY2FuIGJlIG1hbmFnZWQgYnkgdGhlIEFXUyBDREsgYXBwbGljYXRpb24uXG4gICAqL1xuICByZWFkb25seSBrdWJlY3RsRW5hYmxlZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIE51bWJlciBvZiBpbnN0YW5jZXMgdG8gYWxsb2NhdGUgYXMgYW4gaW5pdGlhbCBjYXBhY2l0eSBmb3IgdGhpcyBjbHVzdGVyLlxuICAgKiBJbnN0YW5jZSB0eXBlIGNhbiBiZSBjb25maWd1cmVkIHRocm91Z2ggYGRlZmF1bHRDYXBhY2l0eUluc3RhbmNlVHlwZWAsXG4gICAqIHdoaWNoIGRlZmF1bHRzIHRvIGBtNS5sYXJnZWAuXG4gICAqXG4gICAqIFVzZSBgY2x1c3Rlci5hZGRDYXBhY2l0eWAgdG8gYWRkIGFkZGl0aW9uYWwgY3VzdG9taXplZCBjYXBhY2l0eS4gU2V0IHRoaXNcbiAgICogdG8gYDBgIGlzIHlvdSB3aXNoIHRvIGF2b2lkIHRoZSBpbml0aWFsIGNhcGFjaXR5IGFsbG9jYXRpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IDJcbiAgICovXG4gIHJlYWRvbmx5IGRlZmF1bHRDYXBhY2l0eT86IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIGluc3RhbmNlIHR5cGUgdG8gdXNlIGZvciB0aGUgZGVmYXVsdCBjYXBhY2l0eS4gVGhpcyB3aWxsIG9ubHkgYmUgdGFrZW5cbiAgICogaW50byBhY2NvdW50IGlmIGBkZWZhdWx0Q2FwYWNpdHlgIGlzID4gMC5cbiAgICpcbiAgICogQGRlZmF1bHQgbTUubGFyZ2VcbiAgICovXG4gIHJlYWRvbmx5IGRlZmF1bHRDYXBhY2l0eUluc3RhbmNlPzogZWMyLkluc3RhbmNlVHlwZTtcblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGEgQ2xvdWRGb3JtYXRpb24gb3V0cHV0IHdpdGggdGhlIG5hbWUgb2YgdGhlIGNsdXN0ZXJcbiAgICogd2lsbCBiZSBzeW50aGVzaXplZC5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IG91dHB1dENsdXN0ZXJOYW1lPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGEgQ2xvdWRGb3JtYXRpb24gb3V0cHV0IHdpdGggdGhlIEFSTiBvZiB0aGUgXCJtYXN0ZXJzXCJcbiAgICogSUFNIHJvbGUgd2lsbCBiZSBzeW50aGVzaXplZCAoaWYgYG1hc3RlcnNSb2xlYCBpcyBzcGVjaWZpZWQpLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgb3V0cHV0TWFzdGVyc1JvbGVBcm4/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYSBDbG91ZEZvcm1hdGlvbiBvdXRwdXQgd2l0aCB0aGUgYGF3cyBla3NcbiAgICogdXBkYXRlLWt1YmVjb25maWdgIGNvbW1hbmQgd2lsbCBiZSBzeW50aGVzaXplZC4gVGhpcyBjb21tYW5kIHdpbGwgaW5jbHVkZVxuICAgKiB0aGUgY2x1c3RlciBuYW1lIGFuZCwgaWYgYXBwbGljYWJsZSwgdGhlIEFSTiBvZiB0aGUgbWFzdGVycyBJQU0gcm9sZS5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgb3V0cHV0Q29uZmlnQ29tbWFuZD86IGJvb2xlYW47XG59XG5cbi8qKlxuICogQSBDbHVzdGVyIHJlcHJlc2VudHMgYSBtYW5hZ2VkIEt1YmVybmV0ZXMgU2VydmljZSAoRUtTKVxuICpcbiAqIFRoaXMgaXMgYSBmdWxseSBtYW5hZ2VkIGNsdXN0ZXIgb2YgQVBJIFNlcnZlcnMgKGNvbnRyb2wtcGxhbmUpXG4gKiBUaGUgdXNlciBpcyBzdGlsbCByZXF1aXJlZCB0byBjcmVhdGUgdGhlIHdvcmtlciBub2Rlcy5cbiAqXG4gKiBAcmVzb3VyY2UgQVdTOjpFS1M6OkNsdXN0ZXJcbiAqL1xuZXhwb3J0IGNsYXNzIENsdXN0ZXIgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElDbHVzdGVyIHtcbiAgLyoqXG4gICAqIEltcG9ydCBhbiBleGlzdGluZyBjbHVzdGVyXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSB0aGUgY29uc3RydWN0IHNjb3BlLCBpbiBtb3N0IGNhc2VzICd0aGlzJ1xuICAgKiBAcGFyYW0gaWQgdGhlIGlkIG9yIG5hbWUgdG8gaW1wb3J0IGFzXG4gICAqIEBwYXJhbSBhdHRycyB0aGUgY2x1c3RlciBwcm9wZXJ0aWVzIHRvIHVzZSBmb3IgaW1wb3J0aW5nIGluZm9ybWF0aW9uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21DbHVzdGVyQXR0cmlidXRlcyhzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBhdHRyczogQ2x1c3RlckF0dHJpYnV0ZXMpOiBJQ2x1c3RlciB7XG4gICAgcmV0dXJuIG5ldyBJbXBvcnRlZENsdXN0ZXIoc2NvcGUsIGlkLCBhdHRycyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIFZQQyBpbiB3aGljaCB0aGlzIENsdXN0ZXIgd2FzIGNyZWF0ZWRcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB2cGM6IGVjMi5JVnBjO1xuXG4gIC8qKlxuICAgKiBUaGUgTmFtZSBvZiB0aGUgY3JlYXRlZCBFS1MgQ2x1c3RlclxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNsdXN0ZXJOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBBV1MgZ2VuZXJhdGVkIEFSTiBmb3IgdGhlIENsdXN0ZXIgcmVzb3VyY2VcbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIGBhcm46YXdzOmVrczp1cy13ZXN0LTI6NjY2NjY2NjY2NjY2OmNsdXN0ZXIvcHJvZGBcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBjbHVzdGVyQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBlbmRwb2ludCBVUkwgZm9yIHRoZSBDbHVzdGVyXG4gICAqXG4gICAqIFRoaXMgaXMgdGhlIFVSTCBpbnNpZGUgdGhlIGt1YmVjb25maWcgZmlsZSB0byB1c2Ugd2l0aCBrdWJlY3RsXG4gICAqXG4gICAqIEZvciBleGFtcGxlLCBgaHR0cHM6Ly81RTFEMENFWEFNUExFQTU5MUI3NDZBRkM1QUIzMDI2Mi55bDQudXMtd2VzdC0yLmVrcy5hbWF6b25hd3MuY29tYFxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNsdXN0ZXJFbmRwb2ludDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgY2VydGlmaWNhdGUtYXV0aG9yaXR5LWRhdGEgZm9yIHlvdXIgY2x1c3Rlci5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBjbHVzdGVyQ2VydGlmaWNhdGVBdXRob3JpdHlEYXRhOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIE1hbmFnZXMgY29ubmVjdGlvbiBydWxlcyAoU2VjdXJpdHkgR3JvdXAgUnVsZXMpIGZvciB0aGUgY2x1c3RlclxuICAgKlxuICAgKiBAdHlwZSB7ZWMyLkNvbm5lY3Rpb25zfVxuICAgKiBAbWVtYmVyb2YgQ2x1c3RlclxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNvbm5lY3Rpb25zOiBlYzIuQ29ubmVjdGlvbnM7XG5cbiAgLyoqXG4gICAqIElBTSByb2xlIGFzc3VtZWQgYnkgdGhlIEVLUyBDb250cm9sIFBsYW5lXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcm9sZTogaWFtLklSb2xlO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgaWYgYGt1YmVjdGxgIHJlbGF0ZWQgb3BlcmF0aW9ucyBjYW4gYmUgcGVyZm9ybWVkIG9uIHRoaXMgY2x1c3Rlci5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBrdWJlY3RsRW5hYmxlZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIENsb3VkRm9ybWF0aW9uIGN1c3RvbSByZXNvdXJjZSBoYW5kbGVyIHRoYXQgY2FuIGFwcGx5IEt1YmVybmV0ZXNcbiAgICogbWFuaWZlc3RzIHRvIHRoaXMgY2x1c3Rlci5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgX2s4c1Jlc291cmNlSGFuZGxlcj86IGxhbWJkYS5GdW5jdGlvbjtcblxuICAvKipcbiAgICogVGhlIGF1dG8gc2NhbGluZyBncm91cCB0aGF0IGhvc3RzIHRoZSBkZWZhdWx0IGNhcGFjaXR5IGZvciB0aGlzIGNsdXN0ZXIuXG4gICAqIFRoaXMgd2lsbCBiZSBgdW5kZWZpbmVkYCBpZiB0aGUgZGVmYXVsdCBjYXBhY2l0eSBpcyBzZXQgdG8gMC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBkZWZhdWx0Q2FwYWNpdHk/OiBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwO1xuXG4gIC8qKlxuICAgKiBUaGUgSUFNIHJvbGUgdGhhdCB3YXMgdXNlZCB0byBjcmVhdGUgdGhpcyBjbHVzdGVyLiBUaGlzIHJvbGUgaXNcbiAgICogYXV0b21hdGljYWxseSBhZGRlZCBieSBBbWF6b24gRUtTIHRvIHRoZSBgc3lzdGVtOm1hc3RlcnNgIFJCQUMgZ3JvdXAgb2YgdGhlXG4gICAqIGNsdXN0ZXIuIFVzZSBgYWRkTWFzdGVyc1JvbGVgIG9yIGBwcm9wcy5tYXN0ZXJzUm9sZWAgdG8gZGVmaW5lIGFkZGl0aW9uYWxcbiAgICogSUFNIHJvbGVzIGFzIGFkbWluaXN0cmF0b3JzLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBfZGVmYXVsdE1hc3RlcnNSb2xlPzogaWFtLklSb2xlO1xuXG4gIC8qKlxuICAgKiBNYW5hZ2VzIHRoZSBhd3MtYXV0aCBjb25maWcgbWFwLlxuICAgKi9cbiAgcHJpdmF0ZSBfYXdzQXV0aD86IEF3c0F1dGg7XG5cbiAgcHJpdmF0ZSByZWFkb25seSB2ZXJzaW9uOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEluaXRpYXRlcyBhbiBFS1MgQ2x1c3RlciB3aXRoIHRoZSBzdXBwbGllZCBhcmd1bWVudHNcbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIGEgQ29uc3RydWN0LCBtb3N0IGxpa2VseSBhIGNkay5TdGFjayBjcmVhdGVkXG4gICAqIEBwYXJhbSBuYW1lIHRoZSBuYW1lIG9mIHRoZSBDb25zdHJ1Y3QgdG8gY3JlYXRlXG4gICAqIEBwYXJhbSBwcm9wcyBwcm9wZXJ0aWVzIGluIHRoZSBJQ2x1c3RlclByb3BzIGludGVyZmFjZVxuICAgKi9cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENsdXN0ZXJQcm9wcyA9IHsgfSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgcGh5c2ljYWxOYW1lOiBwcm9wcy5jbHVzdGVyTmFtZSxcbiAgICB9KTtcblxuICAgIEFubm90YXRpb25zLm9mKHRoaXMpLmFkZFdhcm5pbmcoJ1RoZSBAYXdzLWNkay9hd3MtZWtzLWxlZ2FjeSBtb2R1bGUgd2lsbCBubyBsb25nZXIgYmUgcmVsZWFzZWQgYXMgcGFydCBvZiB0aGUgQVdTIENESyBzdGFydGluZyBNYXJjaCAxc3QsIDIwMjAuIFBsZWFzZSByZWZlciB0byBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1jZGsvaXNzdWVzLzU1NDQgZm9yIHVwZ3JhZGUgaW5zdHJ1Y3Rpb25zJyk7XG5cbiAgICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKHRoaXMpO1xuXG4gICAgdGhpcy52cGMgPSBwcm9wcy52cGMgfHwgbmV3IGVjMi5WcGModGhpcywgJ0RlZmF1bHRWcGMnKTtcbiAgICB0aGlzLnZlcnNpb24gPSBwcm9wcy52ZXJzaW9uO1xuXG4gICAgdGhpcy50YWdTdWJuZXRzKCk7XG5cbiAgICB0aGlzLnJvbGUgPSBwcm9wcy5yb2xlIHx8IG5ldyBpYW0uUm9sZSh0aGlzLCAnQ2x1c3RlclJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnZWtzLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgIG1hbmFnZWRQb2xpY2llczogW1xuICAgICAgICBpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ0FtYXpvbkVLU0NsdXN0ZXJQb2xpY3knKSxcbiAgICAgICAgaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdBbWF6b25FS1NTZXJ2aWNlUG9saWN5JyksXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc2VjdXJpdHlHcm91cCA9IHByb3BzLnNlY3VyaXR5R3JvdXAgfHwgbmV3IGVjMi5TZWN1cml0eUdyb3VwKHRoaXMsICdDb250cm9sUGxhbmVTZWN1cml0eUdyb3VwJywge1xuICAgICAgdnBjOiB0aGlzLnZwYyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRUtTIENvbnRyb2wgUGxhbmUgU2VjdXJpdHkgR3JvdXAnLFxuICAgIH0pO1xuXG4gICAgdGhpcy5jb25uZWN0aW9ucyA9IG5ldyBlYzIuQ29ubmVjdGlvbnMoe1xuICAgICAgc2VjdXJpdHlHcm91cHM6IFtzZWN1cml0eUdyb3VwXSxcbiAgICAgIGRlZmF1bHRQb3J0OiBlYzIuUG9ydC50Y3AoNDQzKSwgLy8gQ29udHJvbCBQbGFuZSBoYXMgYW4gSFRUUFMgQVBJXG4gICAgfSk7XG5cbiAgICAvLyBHZXQgc3VibmV0SWRzIGZvciBhbGwgc2VsZWN0ZWQgc3VibmV0c1xuICAgIGNvbnN0IHBsYWNlbWVudHMgPSBwcm9wcy52cGNTdWJuZXRzIHx8IFt7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBVQkxJQyB9LCB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9OQVQgfV07XG4gICAgY29uc3Qgc3VibmV0SWRzID0gWy4uLm5ldyBTZXQoQXJyYXkoKS5jb25jYXQoLi4ucGxhY2VtZW50cy5tYXAocyA9PiB0aGlzLnZwYy5zZWxlY3RTdWJuZXRzKHMpLnN1Ym5ldElkcykpKV07XG5cbiAgICBjb25zdCBjbHVzdGVyUHJvcHM6IENmbkNsdXN0ZXJQcm9wcyA9IHtcbiAgICAgIG5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgICAgcm9sZUFybjogdGhpcy5yb2xlLnJvbGVBcm4sXG4gICAgICB2ZXJzaW9uOiBwcm9wcy52ZXJzaW9uLFxuICAgICAgcmVzb3VyY2VzVnBjQ29uZmlnOiB7XG4gICAgICAgIHNlY3VyaXR5R3JvdXBJZHM6IFtzZWN1cml0eUdyb3VwLnNlY3VyaXR5R3JvdXBJZF0sXG4gICAgICAgIHN1Ym5ldElkcyxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIGxldCByZXNvdXJjZTtcbiAgICB0aGlzLmt1YmVjdGxFbmFibGVkID0gcHJvcHMua3ViZWN0bEVuYWJsZWQgPz8gdHJ1ZTtcbiAgICBpZiAodGhpcy5rdWJlY3RsRW5hYmxlZCkge1xuICAgICAgcmVzb3VyY2UgPSBuZXcgQ2x1c3RlclJlc291cmNlKHRoaXMsICdSZXNvdXJjZScsIGNsdXN0ZXJQcm9wcyk7XG4gICAgICB0aGlzLl9kZWZhdWx0TWFzdGVyc1JvbGUgPSByZXNvdXJjZS5jcmVhdGlvblJvbGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc291cmNlID0gbmV3IENmbkNsdXN0ZXIodGhpcywgJ1Jlc291cmNlJywgY2x1c3RlclByb3BzKTtcbiAgICB9XG5cbiAgICB0aGlzLmNsdXN0ZXJOYW1lID0gdGhpcy5nZXRSZXNvdXJjZU5hbWVBdHRyaWJ1dGUocmVzb3VyY2UucmVmKTtcbiAgICB0aGlzLmNsdXN0ZXJBcm4gPSB0aGlzLmdldFJlc291cmNlQXJuQXR0cmlidXRlKHJlc291cmNlLmF0dHJBcm4sIHtcbiAgICAgIHNlcnZpY2U6ICdla3MnLFxuICAgICAgcmVzb3VyY2U6ICdjbHVzdGVyJyxcbiAgICAgIHJlc291cmNlTmFtZTogdGhpcy5waHlzaWNhbE5hbWUsXG4gICAgfSk7XG5cbiAgICB0aGlzLmNsdXN0ZXJFbmRwb2ludCA9IHJlc291cmNlLmF0dHJFbmRwb2ludDtcbiAgICB0aGlzLmNsdXN0ZXJDZXJ0aWZpY2F0ZUF1dGhvcml0eURhdGEgPSByZXNvdXJjZS5hdHRyQ2VydGlmaWNhdGVBdXRob3JpdHlEYXRhO1xuXG4gICAgY29uc3QgdXBkYXRlQ29uZmlnQ29tbWFuZFByZWZpeCA9IGBhd3MgZWtzIHVwZGF0ZS1rdWJlY29uZmlnIC0tbmFtZSAke3RoaXMuY2x1c3Rlck5hbWV9YDtcbiAgICBjb25zdCBnZXRUb2tlbkNvbW1hbmRQcmVmaXggPSBgYXdzIGVrcyBnZXQtdG9rZW4gLS1jbHVzdGVyLW5hbWUgJHt0aGlzLmNsdXN0ZXJOYW1lfWA7XG4gICAgY29uc3QgY29tbW9uQ29tbWFuZE9wdGlvbnMgPSBbYC0tcmVnaW9uICR7c3RhY2sucmVnaW9ufWBdO1xuXG4gICAgaWYgKHByb3BzLm91dHB1dENsdXN0ZXJOYW1lKSB7XG4gICAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdDbHVzdGVyTmFtZScsIHsgdmFsdWU6IHRoaXMuY2x1c3Rlck5hbWUgfSk7XG4gICAgfVxuXG4gICAgLy8gd2UgbWFpbnRhaW4gYSBzaW5nbGUgbWFuaWZlc3QgY3VzdG9tIHJlc291cmNlIGhhbmRsZXIgcGVyIGNsdXN0ZXIgc2luY2VcbiAgICAvLyBwZXJtaXNzaW9ucyBhbmQgcm9sZSBhcmUgc2NvcGVkLiBUaGlzIHdpbGwgcmV0dXJuIGB1bmRlZmluZWRgIGlmIGt1YmVjdGxcbiAgICAvLyBpcyBub3QgZW5hYmxlZCBmb3IgdGhpcyBjbHVzdGVyLlxuICAgIHRoaXMuX2s4c1Jlc291cmNlSGFuZGxlciA9IHRoaXMuY3JlYXRlS3ViZXJuZXRlc1Jlc291cmNlSGFuZGxlcigpO1xuXG4gICAgLy8gbWFwIHRoZSBJQU0gcm9sZSB0byB0aGUgYHN5c3RlbTptYXN0ZXJzYCBncm91cC5cbiAgICBpZiAocHJvcHMubWFzdGVyc1JvbGUpIHtcbiAgICAgIGlmICghdGhpcy5rdWJlY3RsRW5hYmxlZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBzcGVjaWZ5IGEgXCJtYXN0ZXJzXCIgcm9sZSBpZiBrdWJlY3RsIGlzIGRpc2FibGVkJyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYXdzQXV0aC5hZGRNYXN0ZXJzUm9sZShwcm9wcy5tYXN0ZXJzUm9sZSk7XG5cbiAgICAgIGlmIChwcm9wcy5vdXRwdXRNYXN0ZXJzUm9sZUFybikge1xuICAgICAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdNYXN0ZXJzUm9sZUFybicsIHsgdmFsdWU6IHByb3BzLm1hc3RlcnNSb2xlLnJvbGVBcm4gfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbW1vbkNvbW1hbmRPcHRpb25zLnB1c2goYC0tcm9sZS1hcm4gJHtwcm9wcy5tYXN0ZXJzUm9sZS5yb2xlQXJufWApO1xuICAgIH1cblxuICAgIC8vIGFsbG9jYXRlIGRlZmF1bHQgY2FwYWNpdHkgaWYgbm9uLXplcm8gKG9yIGRlZmF1bHQpLlxuICAgIGNvbnN0IGRlc2lyZWRDYXBhY2l0eSA9IHByb3BzLmRlZmF1bHRDYXBhY2l0eSA/PyBERUZBVUxUX0NBUEFDSVRZX0NPVU5UO1xuICAgIGlmIChkZXNpcmVkQ2FwYWNpdHkgPiAwKSB7XG4gICAgICBjb25zdCBpbnN0YW5jZVR5cGUgPSBwcm9wcy5kZWZhdWx0Q2FwYWNpdHlJbnN0YW5jZSB8fCBERUZBVUxUX0NBUEFDSVRZX1RZUEU7XG4gICAgICB0aGlzLmRlZmF1bHRDYXBhY2l0eSA9IHRoaXMuYWRkQ2FwYWNpdHkoJ0RlZmF1bHRDYXBhY2l0eScsIHsgaW5zdGFuY2VUeXBlLCBkZXNpcmVkQ2FwYWNpdHkgfSk7XG4gICAgfVxuXG4gICAgY29uc3Qgb3V0cHV0Q29uZmlnQ29tbWFuZCA9IHByb3BzLm91dHB1dENvbmZpZ0NvbW1hbmQgPz8gdHJ1ZTtcbiAgICBpZiAob3V0cHV0Q29uZmlnQ29tbWFuZCkge1xuICAgICAgY29uc3QgcG9zdGZpeCA9IGNvbW1vbkNvbW1hbmRPcHRpb25zLmpvaW4oJyAnKTtcbiAgICAgIG5ldyBDZm5PdXRwdXQodGhpcywgJ0NvbmZpZ0NvbW1hbmQnLCB7IHZhbHVlOiBgJHt1cGRhdGVDb25maWdDb21tYW5kUHJlZml4fSAke3Bvc3RmaXh9YCB9KTtcbiAgICAgIG5ldyBDZm5PdXRwdXQodGhpcywgJ0dldFRva2VuQ29tbWFuZCcsIHsgdmFsdWU6IGAke2dldFRva2VuQ29tbWFuZFByZWZpeH0gJHtwb3N0Zml4fWAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBub2RlcyB0byB0aGlzIEVLUyBjbHVzdGVyXG4gICAqXG4gICAqIFRoZSBub2RlcyB3aWxsIGF1dG9tYXRpY2FsbHkgYmUgY29uZmlndXJlZCB3aXRoIHRoZSByaWdodCBWUEMgYW5kIEFNSVxuICAgKiBmb3IgdGhlIGluc3RhbmNlIHR5cGUgYW5kIEt1YmVybmV0ZXMgdmVyc2lvbi5cbiAgICpcbiAgICogU3BvdCBpbnN0YW5jZXMgd2lsbCBiZSBsYWJlbGVkIGBsaWZlY3ljbGU9RWMyU3BvdGAgYW5kIHRhaW50ZWQgd2l0aCBgUHJlZmVyTm9TY2hlZHVsZWAuXG4gICAqIElmIGt1YmVjdGwgaXMgZW5hYmxlZCwgdGhlXG4gICAqIFtzcG90IGludGVycnVwdCBoYW5kbGVyXShodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9lYzItc3BvdC1sYWJzL3RyZWUvbWFzdGVyL2VjMi1zcG90LWVrcy1zb2x1dGlvbi9zcG90LXRlcm1pbmF0aW9uLWhhbmRsZXIpXG4gICAqIGRhZW1vbiB3aWxsIGJlIGluc3RhbGxlZCBvbiBhbGwgc3BvdCBpbnN0YW5jZXMgdG8gaGFuZGxlXG4gICAqIFtFQzIgU3BvdCBJbnN0YW5jZSBUZXJtaW5hdGlvbiBOb3RpY2VzXShodHRwczovL2F3cy5hbWF6b24uY29tL2Jsb2dzL2F3cy9uZXctZWMyLXNwb3QtaW5zdGFuY2UtdGVybWluYXRpb24tbm90aWNlcy8pLlxuICAgKi9cbiAgcHVibGljIGFkZENhcGFjaXR5KGlkOiBzdHJpbmcsIG9wdGlvbnM6IENhcGFjaXR5T3B0aW9ucyk6IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAge1xuICAgIGNvbnN0IGFzZyA9IG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHRoaXMsIGlkLCB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgdnBjOiB0aGlzLnZwYyxcbiAgICAgIG1hY2hpbmVJbWFnZTogbmV3IEVrc09wdGltaXplZEltYWdlKHtcbiAgICAgICAgbm9kZVR5cGU6IG5vZGVUeXBlRm9ySW5zdGFuY2VUeXBlKG9wdGlvbnMuaW5zdGFuY2VUeXBlKSxcbiAgICAgICAga3ViZXJuZXRlc1ZlcnNpb246IHRoaXMudmVyc2lvbixcbiAgICAgIH0pLFxuICAgICAgdXBkYXRlVHlwZTogb3B0aW9ucy51cGRhdGVUeXBlIHx8IGF1dG9zY2FsaW5nLlVwZGF0ZVR5cGUuUk9MTElOR19VUERBVEUsXG4gICAgICBpbnN0YW5jZVR5cGU6IG9wdGlvbnMuaW5zdGFuY2VUeXBlLFxuICAgIH0pO1xuXG4gICAgdGhpcy5hZGRBdXRvU2NhbGluZ0dyb3VwKGFzZywge1xuICAgICAgbWFwUm9sZTogb3B0aW9ucy5tYXBSb2xlLFxuICAgICAgYm9vdHN0cmFwT3B0aW9uczogb3B0aW9ucy5ib290c3RyYXBPcHRpb25zLFxuICAgICAgYm9vdHN0cmFwRW5hYmxlZDogb3B0aW9ucy5ib290c3RyYXBFbmFibGVkLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGFzZztcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgY29tcHV0ZSBjYXBhY2l0eSB0byB0aGlzIEVLUyBjbHVzdGVyIGluIHRoZSBmb3JtIG9mIGFuIEF1dG9TY2FsaW5nR3JvdXBcbiAgICpcbiAgICogVGhlIEF1dG9TY2FsaW5nR3JvdXAgbXVzdCBiZSBydW5uaW5nIGFuIEVLUy1vcHRpbWl6ZWQgQU1JIGNvbnRhaW5pbmcgdGhlXG4gICAqIC9ldGMvZWtzL2Jvb3RzdHJhcC5zaCBzY3JpcHQuIFRoaXMgbWV0aG9kIHdpbGwgY29uZmlndXJlIFNlY3VyaXR5IEdyb3VwcyxcbiAgICogYWRkIHRoZSByaWdodCBwb2xpY2llcyB0byB0aGUgaW5zdGFuY2Ugcm9sZSwgYXBwbHkgdGhlIHJpZ2h0IHRhZ3MsIGFuZCBhZGRcbiAgICogdGhlIHJlcXVpcmVkIHVzZXIgZGF0YSB0byB0aGUgaW5zdGFuY2UncyBsYXVuY2ggY29uZmlndXJhdGlvbi5cbiAgICpcbiAgICogU3BvdCBpbnN0YW5jZXMgd2lsbCBiZSBsYWJlbGVkIGBsaWZlY3ljbGU9RWMyU3BvdGAgYW5kIHRhaW50ZWQgd2l0aCBgUHJlZmVyTm9TY2hlZHVsZWAuXG4gICAqIElmIGt1YmVjdGwgaXMgZW5hYmxlZCwgdGhlXG4gICAqIFtzcG90IGludGVycnVwdCBoYW5kbGVyXShodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9lYzItc3BvdC1sYWJzL3RyZWUvbWFzdGVyL2VjMi1zcG90LWVrcy1zb2x1dGlvbi9zcG90LXRlcm1pbmF0aW9uLWhhbmRsZXIpXG4gICAqIGRhZW1vbiB3aWxsIGJlIGluc3RhbGxlZCBvbiBhbGwgc3BvdCBpbnN0YW5jZXMgdG8gaGFuZGxlXG4gICAqIFtFQzIgU3BvdCBJbnN0YW5jZSBUZXJtaW5hdGlvbiBOb3RpY2VzXShodHRwczovL2F3cy5hbWF6b24uY29tL2Jsb2dzL2F3cy9uZXctZWMyLXNwb3QtaW5zdGFuY2UtdGVybWluYXRpb24tbm90aWNlcy8pLlxuICAgKlxuICAgKiBQcmVmZXIgdG8gdXNlIGBhZGRDYXBhY2l0eWAgaWYgcG9zc2libGUuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Vrcy9sYXRlc3QvdXNlcmd1aWRlL2xhdW5jaC13b3JrZXJzLmh0bWxcbiAgICogQHBhcmFtIGF1dG9TY2FsaW5nR3JvdXAgW2Rpc2FibGUtYXdzbGludDpyZWYtdmlhLWludGVyZmFjZV1cbiAgICogQHBhcmFtIG9wdGlvbnMgb3B0aW9ucyBmb3IgYWRkaW5nIGF1dG8gc2NhbGluZyBncm91cHMsIGxpa2UgY3VzdG9taXppbmcgdGhlIGJvb3RzdHJhcCBzY3JpcHRcbiAgICovXG4gIHB1YmxpYyBhZGRBdXRvU2NhbGluZ0dyb3VwKGF1dG9TY2FsaW5nR3JvdXA6IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAsIG9wdGlvbnM6IEF1dG9TY2FsaW5nR3JvdXBPcHRpb25zKSB7XG4gICAgLy8gc2VsZiBydWxlc1xuICAgIGF1dG9TY2FsaW5nR3JvdXAuY29ubmVjdGlvbnMuYWxsb3dJbnRlcm5hbGx5KGVjMi5Qb3J0LmFsbFRyYWZmaWMoKSk7XG5cbiAgICAvLyBDbHVzdGVyIHRvOm5vZGVzIHJ1bGVzXG4gICAgYXV0b1NjYWxpbmdHcm91cC5jb25uZWN0aW9ucy5hbGxvd0Zyb20odGhpcywgZWMyLlBvcnQudGNwKDQ0MykpO1xuICAgIGF1dG9TY2FsaW5nR3JvdXAuY29ubmVjdGlvbnMuYWxsb3dGcm9tKHRoaXMsIGVjMi5Qb3J0LnRjcFJhbmdlKDEwMjUsIDY1NTM1KSk7XG5cbiAgICAvLyBBbGxvdyBIVFRQUyBmcm9tIE5vZGVzIHRvIENsdXN0ZXJcbiAgICBhdXRvU2NhbGluZ0dyb3VwLmNvbm5lY3Rpb25zLmFsbG93VG8odGhpcywgZWMyLlBvcnQudGNwKDQ0MykpO1xuXG4gICAgLy8gQWxsb3cgYWxsIG5vZGUgb3V0Ym91bmQgdHJhZmZpY1xuICAgIGF1dG9TY2FsaW5nR3JvdXAuY29ubmVjdGlvbnMuYWxsb3dUb0FueUlwdjQoZWMyLlBvcnQuYWxsVGNwKCkpO1xuICAgIGF1dG9TY2FsaW5nR3JvdXAuY29ubmVjdGlvbnMuYWxsb3dUb0FueUlwdjQoZWMyLlBvcnQuYWxsVWRwKCkpO1xuICAgIGF1dG9TY2FsaW5nR3JvdXAuY29ubmVjdGlvbnMuYWxsb3dUb0FueUlwdjQoZWMyLlBvcnQuYWxsSWNtcCgpKTtcblxuICAgIGNvbnN0IGJvb3RzdHJhcEVuYWJsZWQgPSBvcHRpb25zLmJvb3RzdHJhcEVuYWJsZWQgPz8gdHJ1ZTtcbiAgICBpZiAob3B0aW9ucy5ib290c3RyYXBPcHRpb25zICYmICFib290c3RyYXBFbmFibGVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBzcGVjaWZ5IFwiYm9vdHN0cmFwT3B0aW9uc1wiIGlmIFwiYm9vdHN0cmFwRW5hYmxlZFwiIGlzIGZhbHNlJyk7XG4gICAgfVxuXG4gICAgaWYgKGJvb3RzdHJhcEVuYWJsZWQpIHtcbiAgICAgIGNvbnN0IHVzZXJEYXRhID0gcmVuZGVyVXNlckRhdGEodGhpcy5jbHVzdGVyTmFtZSwgYXV0b1NjYWxpbmdHcm91cCwgb3B0aW9ucy5ib290c3RyYXBPcHRpb25zKTtcbiAgICAgIGF1dG9TY2FsaW5nR3JvdXAuYWRkVXNlckRhdGEoLi4udXNlckRhdGEpO1xuICAgIH1cblxuICAgIGF1dG9TY2FsaW5nR3JvdXAucm9sZS5hZGRNYW5hZ2VkUG9saWN5KGlhbS5NYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnQW1hem9uRUtTV29ya2VyTm9kZVBvbGljeScpKTtcbiAgICBhdXRvU2NhbGluZ0dyb3VwLnJvbGUuYWRkTWFuYWdlZFBvbGljeShpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ0FtYXpvbkVLU19DTklfUG9saWN5JykpO1xuICAgIGF1dG9TY2FsaW5nR3JvdXAucm9sZS5hZGRNYW5hZ2VkUG9saWN5KGlhbS5NYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnQW1hem9uRUMyQ29udGFpbmVyUmVnaXN0cnlSZWFkT25seScpKTtcblxuICAgIC8vIEVLUyBSZXF1aXJlZCBUYWdzXG4gICAgVGFncy5vZihhdXRvU2NhbGluZ0dyb3VwKS5hZGQoYGt1YmVybmV0ZXMuaW8vY2x1c3Rlci8ke3RoaXMuY2x1c3Rlck5hbWV9YCwgJ293bmVkJywge1xuICAgICAgYXBwbHlUb0xhdW5jaGVkSW5zdGFuY2VzOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgaWYgKG9wdGlvbnMubWFwUm9sZSA9PT0gdHJ1ZSAmJiAhdGhpcy5rdWJlY3RsRW5hYmxlZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgbWFwIGluc3RhbmNlIElBTSByb2xlIHRvIFJCQUMgaWYga3ViZWN0bCBpcyBkaXNhYmxlZCBmb3IgdGhlIGNsdXN0ZXInKTtcbiAgICB9XG5cbiAgICAvLyBkbyBub3QgYXR0ZW1wdCB0byBtYXAgdGhlIHJvbGUgaWYgYGt1YmVjdGxgIGlzIG5vdCBlbmFibGVkIGZvciB0aGlzXG4gICAgLy8gY2x1c3RlciBvciBpZiBgbWFwUm9sZWAgaXMgc2V0IHRvIGZhbHNlLiBCeSBkZWZhdWx0IHRoaXMgc2hvdWxkIGhhcHBlbi5cbiAgICBjb25zdCBtYXBSb2xlID0gb3B0aW9ucy5tYXBSb2xlID8/IHRydWU7XG4gICAgaWYgKG1hcFJvbGUgJiYgdGhpcy5rdWJlY3RsRW5hYmxlZCkge1xuICAgICAgLy8gc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9lbl91cy9la3MvbGF0ZXN0L3VzZXJndWlkZS9hZGQtdXNlci1yb2xlLmh0bWxcbiAgICAgIHRoaXMuYXdzQXV0aC5hZGRSb2xlTWFwcGluZyhhdXRvU2NhbGluZ0dyb3VwLnJvbGUsIHtcbiAgICAgICAgdXNlcm5hbWU6ICdzeXN0ZW06bm9kZTp7e0VDMlByaXZhdGVETlNOYW1lfX0nLFxuICAgICAgICBncm91cHM6IFtcbiAgICAgICAgICAnc3lzdGVtOmJvb3RzdHJhcHBlcnMnLFxuICAgICAgICAgICdzeXN0ZW06bm9kZXMnLFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHNpbmNlIHdlIGFyZSBub3QgbWFwcGluZyB0aGUgaW5zdGFuY2Ugcm9sZSB0byBSQkFDLCBzeW50aGVzaXplIGFuXG4gICAgICAvLyBvdXRwdXQgc28gaXQgY2FuIGJlIHBhc3RlZCBpbnRvIGBhd3MtYXV0aC1jbS55YW1sYFxuICAgICAgbmV3IENmbk91dHB1dChhdXRvU2NhbGluZ0dyb3VwLCAnSW5zdGFuY2VSb2xlQVJOJywge1xuICAgICAgICB2YWx1ZTogYXV0b1NjYWxpbmdHcm91cC5yb2xlLnJvbGVBcm4sXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBpZiB0aGlzIGlzIGFuIEFTRyB3aXRoIHNwb3QgaW5zdGFuY2VzLCBpbnN0YWxsIHRoZSBzcG90IGludGVycnVwdCBoYW5kbGVyIChvbmx5IGlmIGt1YmVjdGwgaXMgZW5hYmxlZCkuXG4gICAgaWYgKGF1dG9TY2FsaW5nR3JvdXAuc3BvdFByaWNlICYmIHRoaXMua3ViZWN0bEVuYWJsZWQpIHtcbiAgICAgIHRoaXMuYWRkUmVzb3VyY2UoJ3Nwb3QtaW50ZXJydXB0LWhhbmRsZXInLCAuLi5zcG90SW50ZXJydXB0SGFuZGxlcigpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTGF6aWx5IGNyZWF0ZXMgdGhlIEF3c0F1dGggcmVzb3VyY2UsIHdoaWNoIG1hbmFnZXMgQVdTIGF1dGhlbnRpY2F0aW9uIG1hcHBpbmcuXG4gICAqL1xuICBwdWJsaWMgZ2V0IGF3c0F1dGgoKSB7XG4gICAgaWYgKCF0aGlzLmt1YmVjdGxFbmFibGVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBkZWZpbmUgYXdzLWF1dGggbWFwcGluZ3MgaWYga3ViZWN0bCBpcyBkaXNhYmxlZCcpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5fYXdzQXV0aCkge1xuICAgICAgdGhpcy5fYXdzQXV0aCA9IG5ldyBBd3NBdXRoKHRoaXMsICdBd3NBdXRoJywgeyBjbHVzdGVyOiB0aGlzIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9hd3NBdXRoO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYSBLdWJlcm5ldGVzIHJlc291cmNlIGluIHRoaXMgY2x1c3Rlci5cbiAgICpcbiAgICogVGhlIG1hbmlmZXN0IHdpbGwgYmUgYXBwbGllZC9kZWxldGVkIHVzaW5nIGt1YmVjdGwgYXMgbmVlZGVkLlxuICAgKlxuICAgKiBAcGFyYW0gaWQgbG9naWNhbCBpZCBvZiB0aGlzIG1hbmlmZXN0XG4gICAqIEBwYXJhbSBtYW5pZmVzdCBhIGxpc3Qgb2YgS3ViZXJuZXRlcyByZXNvdXJjZSBzcGVjaWZpY2F0aW9uc1xuICAgKiBAcmV0dXJucyBhIGBLdWJlcm5ldGVzUmVzb3VyY2VgIG9iamVjdC5cbiAgICogQHRocm93cyBJZiBga3ViZWN0bEVuYWJsZWRgIGlzIGBmYWxzZWBcbiAgICovXG4gIHB1YmxpYyBhZGRSZXNvdXJjZShpZDogc3RyaW5nLCAuLi5tYW5pZmVzdDogYW55W10pIHtcbiAgICByZXR1cm4gbmV3IEt1YmVybmV0ZXNSZXNvdXJjZSh0aGlzLCBgbWFuaWZlc3QtJHtpZH1gLCB7IGNsdXN0ZXI6IHRoaXMsIG1hbmlmZXN0IH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYSBIZWxtIGNoYXJ0IGluIHRoaXMgY2x1c3Rlci5cbiAgICpcbiAgICogQHBhcmFtIGlkIGxvZ2ljYWwgaWQgb2YgdGhpcyBjaGFydC5cbiAgICogQHBhcmFtIG9wdGlvbnMgb3B0aW9ucyBvZiB0aGlzIGNoYXJ0LlxuICAgKiBAcmV0dXJucyBhIGBIZWxtQ2hhcnRgIG9iamVjdFxuICAgKiBAdGhyb3dzIElmIGBrdWJlY3RsRW5hYmxlZGAgaXMgYGZhbHNlYFxuICAgKi9cbiAgcHVibGljIGFkZENoYXJ0KGlkOiBzdHJpbmcsIG9wdGlvbnM6IEhlbG1DaGFydE9wdGlvbnMpIHtcbiAgICByZXR1cm4gbmV3IEhlbG1DaGFydCh0aGlzLCBgY2hhcnQtJHtpZH1gLCB7IGNsdXN0ZXI6IHRoaXMsIC4uLm9wdGlvbnMgfSk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUt1YmVybmV0ZXNSZXNvdXJjZUhhbmRsZXIoKSB7XG4gICAgaWYgKCF0aGlzLmt1YmVjdGxFbmFibGVkKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdLdWJlcm5ldGVzUmVzb3VyY2VIYW5kbGVyJywge1xuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdrOHMtcmVzb3VyY2UnKSksXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5QWVRIT05fM183LFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgdGltZW91dDogRHVyYXRpb24ubWludXRlcygxNSksXG4gICAgICBsYXllcnM6IFtLdWJlY3RsTGF5ZXIuZ2V0T3JDcmVhdGUodGhpcyldLFxuICAgICAgbWVtb3J5U2l6ZTogMjU2LFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgQ0xVU1RFUl9OQU1FOiB0aGlzLmNsdXN0ZXJOYW1lLFxuICAgICAgfSxcblxuICAgICAgLy8gTk9URTogd2UgbXVzdCB1c2UgdGhlIGRlZmF1bHQgSUFNIHJvbGUgdGhhdCdzIG1hcHBlZCB0byBcInN5c3RlbTptYXN0ZXJzXCJcbiAgICAgIC8vIGFzIHRoZSBleGVjdXRpb24gcm9sZSBvZiB0aGlzIGN1c3RvbSByZXNvdXJjZSBoYW5kbGVyLiBUaGlzIGlzIHRoZSBvbmx5XG4gICAgICAvLyB3YXkgdG8gYmUgYWJsZSB0byBpbnRlcmFjdCB3aXRoIHRoZSBjbHVzdGVyIGFmdGVyIGl0J3MgYmVlbiBjcmVhdGVkLlxuICAgICAgcm9sZTogdGhpcy5fZGVmYXVsdE1hc3RlcnNSb2xlLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE9wcG9ydHVuaXN0aWNhbGx5IHRhZyBzdWJuZXRzIHdpdGggdGhlIHJlcXVpcmVkIHRhZ3MuXG4gICAqXG4gICAqIElmIG5vIHN1Ym5ldHMgY291bGQgYmUgZm91bmQgKGJlY2F1c2UgdGhpcyBpcyBhbiBpbXBvcnRlZCBWUEMpLCBhZGQgYSB3YXJuaW5nLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9la3MvbGF0ZXN0L3VzZXJndWlkZS9uZXR3b3JrX3JlcXMuaHRtbFxuICAgKi9cbiAgcHJpdmF0ZSB0YWdTdWJuZXRzKCkge1xuICAgIGNvbnN0IHRhZ0FsbFN1Ym5ldHMgPSAodHlwZTogc3RyaW5nLCBzdWJuZXRzOiBlYzIuSVN1Ym5ldFtdLCB0YWc6IHN0cmluZykgPT4ge1xuICAgICAgZm9yIChjb25zdCBzdWJuZXQgb2Ygc3VibmV0cykge1xuICAgICAgICAvLyBpZiB0aGlzIGlzIG5vdCBhIGNvbmNyZXRlIHN1Ym5ldCwgYXR0YWNoIGEgY29uc3RydWN0IHdhcm5pbmdcbiAgICAgICAgaWYgKCFlYzIuU3VibmV0LmlzVnBjU3VibmV0KHN1Ym5ldCkpIHtcbiAgICAgICAgICAvLyBtZXNzYWdlIChpZiB0b2tlbik6IFwiY291bGQgbm90IGF1dG8tdGFnIHB1YmxpYy9wcml2YXRlIHN1Ym5ldCB3aXRoIHRhZy4uLlwiXG4gICAgICAgICAgLy8gbWVzc2FnZSAoaWYgbm90IHRva2VuKTogXCJjb3VudCBub3QgYXV0by10YWcgcHVibGljL3ByaXZhdGUgc3VibmV0IHh4eHh4IHdpdGggdGFnLi4uXCJcbiAgICAgICAgICBjb25zdCBzdWJuZXRJRCA9IFRva2VuLmlzVW5yZXNvbHZlZChzdWJuZXQuc3VibmV0SWQpID8gJycgOiBgICR7c3VibmV0LnN1Ym5ldElkfWA7XG4gICAgICAgICAgQW5ub3RhdGlvbnMub2YodGhpcykuYWRkV2FybmluZyhgQ291bGQgbm90IGF1dG8tdGFnICR7dHlwZX0gc3VibmV0JHtzdWJuZXRJRH0gd2l0aCBcIiR7dGFnfT0xXCIsIHBsZWFzZSByZW1lbWJlciB0byBkbyB0aGlzIG1hbnVhbGx5YCk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBUYWdzLm9mKHN1Ym5ldCkuYWRkKHRhZywgJzEnKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Vrcy9sYXRlc3QvdXNlcmd1aWRlL25ldHdvcmtfcmVxcy5odG1sXG4gICAgdGFnQWxsU3VibmV0cygncHJpdmF0ZScsIHRoaXMudnBjLnByaXZhdGVTdWJuZXRzLCAna3ViZXJuZXRlcy5pby9yb2xlL2ludGVybmFsLWVsYicpO1xuICAgIHRhZ0FsbFN1Ym5ldHMoJ3B1YmxpYycsIHRoaXMudnBjLnB1YmxpY1N1Ym5ldHMsICdrdWJlcm5ldGVzLmlvL3JvbGUvZWxiJyk7XG4gIH1cbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciBhZGRpbmcgd29ya2VyIG5vZGVzXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2FwYWNpdHlPcHRpb25zIGV4dGVuZHMgYXV0b3NjYWxpbmcuQ29tbW9uQXV0b1NjYWxpbmdHcm91cFByb3BzIHtcbiAgLyoqXG4gICAqIEluc3RhbmNlIHR5cGUgb2YgdGhlIGluc3RhbmNlcyB0byBzdGFydFxuICAgKi9cbiAgcmVhZG9ubHkgaW5zdGFuY2VUeXBlOiBlYzIuSW5zdGFuY2VUeXBlO1xuXG4gIC8qKlxuICAgKiBXaWxsIGF1dG9tYXRpY2FsbHkgdXBkYXRlIHRoZSBhd3MtYXV0aCBDb25maWdNYXAgdG8gbWFwIHRoZSBJQU0gaW5zdGFuY2VcbiAgICogcm9sZSB0byBSQkFDLlxuICAgKlxuICAgKiBUaGlzIGNhbm5vdCBiZSBleHBsaWNpdGx5IHNldCB0byBgdHJ1ZWAgaWYgdGhlIGNsdXN0ZXIgaGFzIGt1YmVjdGwgZGlzYWJsZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdHJ1ZSBpZiB0aGUgY2x1c3RlciBoYXMga3ViZWN0bCBlbmFibGVkICh3aGljaCBpcyB0aGUgZGVmYXVsdCkuXG4gICAqL1xuICByZWFkb25seSBtYXBSb2xlPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQ29uZmlndXJlcyB0aGUgRUMyIHVzZXItZGF0YSBzY3JpcHQgZm9yIGluc3RhbmNlcyBpbiB0aGlzIGF1dG9zY2FsaW5nIGdyb3VwXG4gICAqIHRvIGJvb3RzdHJhcCB0aGUgbm9kZSAoaW52b2tlIGAvZXRjL2Vrcy9ib290c3RyYXAuc2hgKSBhbmQgYXNzb2NpYXRlIGl0XG4gICAqIHdpdGggdGhlIEVLUyBjbHVzdGVyLlxuICAgKlxuICAgKiBJZiB5b3Ugd2lzaCB0byBwcm92aWRlIGEgY3VzdG9tIHVzZXIgZGF0YSBzY3JpcHQsIHNldCB0aGlzIHRvIGBmYWxzZWAgYW5kXG4gICAqIG1hbnVhbGx5IGludm9rZSBgYXV0b3NjYWxpbmdHcm91cC5hZGRVc2VyRGF0YSgpYC5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgYm9vdHN0cmFwRW5hYmxlZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEVLUyBub2RlIGJvb3RzdHJhcHBpbmcgb3B0aW9ucy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBub25lXG4gICAqL1xuICByZWFkb25seSBib290c3RyYXBPcHRpb25zPzogQm9vdHN0cmFwT3B0aW9ucztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBCb290c3RyYXBPcHRpb25zIHtcbiAgLyoqXG4gICAqIFNldHMgYC0tbWF4LXBvZHNgIGZvciB0aGUga3ViZWxldCBiYXNlZCBvbiB0aGUgY2FwYWNpdHkgb2YgdGhlIEVDMiBpbnN0YW5jZS5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgdXNlTWF4UG9kcz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFJlc3RvcmVzIHRoZSBkb2NrZXIgZGVmYXVsdCBicmlkZ2UgbmV0d29yay5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGVuYWJsZURvY2tlckJyaWRnZT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIE51bWJlciBvZiByZXRyeSBhdHRlbXB0cyBmb3IgQVdTIEFQSSBjYWxsIChEZXNjcmliZUNsdXN0ZXIpLlxuICAgKlxuICAgKiBAZGVmYXVsdCAzXG4gICAqL1xuICByZWFkb25seSBhd3NBcGlSZXRyeUF0dGVtcHRzPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgY29udGVudHMgb2YgdGhlIGAvZXRjL2RvY2tlci9kYWVtb24uanNvbmAgZmlsZS4gVXNlZnVsIGlmIHlvdSB3YW50IGFcbiAgICogY3VzdG9tIGNvbmZpZyBkaWZmZXJpbmcgZnJvbSB0aGUgZGVmYXVsdCBvbmUgaW4gdGhlIEVLUyBBTUkuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgZG9ja2VyQ29uZmlnSnNvbj86IHN0cmluZztcblxuICAvKipcbiAgICogRXh0cmEgYXJndW1lbnRzIHRvIGFkZCB0byB0aGUga3ViZWxldC4gVXNlZnVsIGZvciBhZGRpbmcgbGFiZWxzIG9yIHRhaW50cy5cbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIGAtLW5vZGUtbGFiZWxzIGZvbz1iYXIsZ29vPWZhcmBcbiAgICogQGRlZmF1bHQgLSBub25lXG4gICAqL1xuICByZWFkb25seSBrdWJlbGV0RXh0cmFBcmdzPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBZGRpdGlvbmFsIGNvbW1hbmQgbGluZSBhcmd1bWVudHMgdG8gcGFzcyB0byB0aGUgYC9ldGMvZWtzL2Jvb3RzdHJhcC5zaGBcbiAgICogY29tbWFuZC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9hbWF6b24tZWtzLWFtaS9ibG9iL21hc3Rlci9maWxlcy9ib290c3RyYXAuc2hcbiAgICogQGRlZmF1bHQgLSBub25lXG4gICAqL1xuICByZWFkb25seSBhZGRpdGlvbmFsQXJncz86IHN0cmluZztcbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciBhZGRpbmcgYW4gQXV0b1NjYWxpbmdHcm91cCBhcyBjYXBhY2l0eVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEF1dG9TY2FsaW5nR3JvdXBPcHRpb25zIHtcbiAgLyoqXG4gICAqIFdpbGwgYXV0b21hdGljYWxseSB1cGRhdGUgdGhlIGF3cy1hdXRoIENvbmZpZ01hcCB0byBtYXAgdGhlIElBTSBpbnN0YW5jZVxuICAgKiByb2xlIHRvIFJCQUMuXG4gICAqXG4gICAqIFRoaXMgY2Fubm90IGJlIGV4cGxpY2l0bHkgc2V0IHRvIGB0cnVlYCBpZiB0aGUgY2x1c3RlciBoYXMga3ViZWN0bCBkaXNhYmxlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSB0cnVlIGlmIHRoZSBjbHVzdGVyIGhhcyBrdWJlY3RsIGVuYWJsZWQgKHdoaWNoIGlzIHRoZSBkZWZhdWx0KS5cbiAgICovXG4gIHJlYWRvbmx5IG1hcFJvbGU/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBDb25maWd1cmVzIHRoZSBFQzIgdXNlci1kYXRhIHNjcmlwdCBmb3IgaW5zdGFuY2VzIGluIHRoaXMgYXV0b3NjYWxpbmcgZ3JvdXBcbiAgICogdG8gYm9vdHN0cmFwIHRoZSBub2RlIChpbnZva2UgYC9ldGMvZWtzL2Jvb3RzdHJhcC5zaGApIGFuZCBhc3NvY2lhdGUgaXRcbiAgICogd2l0aCB0aGUgRUtTIGNsdXN0ZXIuXG4gICAqXG4gICAqIElmIHlvdSB3aXNoIHRvIHByb3ZpZGUgYSBjdXN0b20gdXNlciBkYXRhIHNjcmlwdCwgc2V0IHRoaXMgdG8gYGZhbHNlYCBhbmRcbiAgICogbWFudWFsbHkgaW52b2tlIGBhdXRvc2NhbGluZ0dyb3VwLmFkZFVzZXJEYXRhKClgLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBib290c3RyYXBFbmFibGVkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQWxsb3dzIG9wdGlvbnMgZm9yIG5vZGUgYm9vdHN0cmFwcGluZyB0aHJvdWdoIEVDMiB1c2VyIGRhdGEuXG4gICAqL1xuICByZWFkb25seSBib290c3RyYXBPcHRpb25zPzogQm9vdHN0cmFwT3B0aW9ucztcbn1cblxuLyoqXG4gKiBJbXBvcnQgYSBjbHVzdGVyIHRvIHVzZSBpbiBhbm90aGVyIHN0YWNrXG4gKi9cbmNsYXNzIEltcG9ydGVkQ2x1c3RlciBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSUNsdXN0ZXIge1xuICBwdWJsaWMgcmVhZG9ubHkgdnBjOiBlYzIuSVZwYztcbiAgcHVibGljIHJlYWRvbmx5IGNsdXN0ZXJDZXJ0aWZpY2F0ZUF1dGhvcml0eURhdGE6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IGNsdXN0ZXJOYW1lOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBjbHVzdGVyQXJuOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBjbHVzdGVyRW5kcG9pbnQ6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IGNvbm5lY3Rpb25zID0gbmV3IGVjMi5Db25uZWN0aW9ucygpO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDbHVzdGVyQXR0cmlidXRlcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICB0aGlzLnZwYyA9IGVjMi5WcGMuZnJvbVZwY0F0dHJpYnV0ZXModGhpcywgJ1ZQQycsIHByb3BzLnZwYyk7XG4gICAgdGhpcy5jbHVzdGVyTmFtZSA9IHByb3BzLmNsdXN0ZXJOYW1lO1xuICAgIHRoaXMuY2x1c3RlckVuZHBvaW50ID0gcHJvcHMuY2x1c3RlckVuZHBvaW50O1xuICAgIHRoaXMuY2x1c3RlckFybiA9IHByb3BzLmNsdXN0ZXJBcm47XG4gICAgdGhpcy5jbHVzdGVyQ2VydGlmaWNhdGVBdXRob3JpdHlEYXRhID0gcHJvcHMuY2x1c3RlckNlcnRpZmljYXRlQXV0aG9yaXR5RGF0YTtcblxuICAgIGxldCBpID0gMTtcbiAgICBmb3IgKGNvbnN0IHNnUHJvcHMgb2YgcHJvcHMuc2VjdXJpdHlHcm91cHMpIHtcbiAgICAgIHRoaXMuY29ubmVjdGlvbnMuYWRkU2VjdXJpdHlHcm91cChlYzIuU2VjdXJpdHlHcm91cC5mcm9tU2VjdXJpdHlHcm91cElkKHRoaXMsIGBTZWN1cml0eUdyb3VwJHtpfWAsIHNnUHJvcHMuc2VjdXJpdHlHcm91cElkKSk7XG4gICAgICBpKys7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgRWtzT3B0aW1pemVkSW1hZ2VcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFa3NPcHRpbWl6ZWRJbWFnZVByb3BzIHtcbiAgLyoqXG4gICAqIFdoYXQgaW5zdGFuY2UgdHlwZSB0byByZXRyaWV2ZSB0aGUgaW1hZ2UgZm9yIChzdGFuZGFyZCBvciBHUFUtb3B0aW1pemVkKVxuICAgKlxuICAgKiBAZGVmYXVsdCBOb2RlVHlwZS5TVEFOREFSRFxuICAgKi9cbiAgcmVhZG9ubHkgbm9kZVR5cGU/OiBOb2RlVHlwZTtcblxuICAvKipcbiAgICogVGhlIEt1YmVybmV0ZXMgdmVyc2lvbiB0byB1c2VcbiAgICpcbiAgICogQGRlZmF1bHQgLSBUaGUgbGF0ZXN0IHZlcnNpb25cbiAgICovXG4gIHJlYWRvbmx5IGt1YmVybmV0ZXNWZXJzaW9uPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIENvbnN0cnVjdCBhbiBBbWF6b24gTGludXggMiBpbWFnZSBmcm9tIHRoZSBsYXRlc3QgRUtTIE9wdGltaXplZCBBTUkgcHVibGlzaGVkIGluIFNTTVxuICovXG5leHBvcnQgY2xhc3MgRWtzT3B0aW1pemVkSW1hZ2UgaW1wbGVtZW50cyBlYzIuSU1hY2hpbmVJbWFnZSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgbm9kZVR5cGU/OiBOb2RlVHlwZTtcbiAgcHJpdmF0ZSByZWFkb25seSBrdWJlcm5ldGVzVmVyc2lvbj86IHN0cmluZztcblxuICBwcml2YXRlIHJlYWRvbmx5IGFtaVBhcmFtZXRlck5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogQ29uc3RydWN0cyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgRWNzT3B0aW1pemVkQW1pIGNsYXNzLlxuICAgKi9cbiAgcHVibGljIGNvbnN0cnVjdG9yKHByb3BzOiBFa3NPcHRpbWl6ZWRJbWFnZVByb3BzKSB7XG4gICAgdGhpcy5ub2RlVHlwZSA9IHByb3BzICYmIHByb3BzLm5vZGVUeXBlO1xuICAgIHRoaXMua3ViZXJuZXRlc1ZlcnNpb24gPSBwcm9wcyAmJiBwcm9wcy5rdWJlcm5ldGVzVmVyc2lvbiB8fCBMQVRFU1RfS1VCRVJORVRFU19WRVJTSU9OO1xuXG4gICAgLy8gc2V0IHRoZSBTU00gcGFyYW1ldGVyIG5hbWVcbiAgICB0aGlzLmFtaVBhcmFtZXRlck5hbWUgPSBgL2F3cy9zZXJ2aWNlL2Vrcy9vcHRpbWl6ZWQtYW1pLyR7dGhpcy5rdWJlcm5ldGVzVmVyc2lvbn0vYFxuICAgICAgKyAoIHRoaXMubm9kZVR5cGUgPT09IE5vZGVUeXBlLlNUQU5EQVJEID8gJ2FtYXpvbi1saW51eC0yLycgOiAnJyApXG4gICAgICArICggdGhpcy5ub2RlVHlwZSA9PT0gTm9kZVR5cGUuR1BVID8gJ2FtYXpvbi1saW51eDItZ3B1LycgOiAnJyApXG4gICAgICArICdyZWNvbW1lbmRlZC9pbWFnZV9pZCc7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBjb3JyZWN0IGltYWdlXG4gICAqL1xuICBwdWJsaWMgZ2V0SW1hZ2Uoc2NvcGU6IENvbnN0cnVjdCk6IGVjMi5NYWNoaW5lSW1hZ2VDb25maWcge1xuICAgIGNvbnN0IGFtaSA9IHNzbS5TdHJpbmdQYXJhbWV0ZXIudmFsdWVGb3JTdHJpbmdQYXJhbWV0ZXIoc2NvcGUsIHRoaXMuYW1pUGFyYW1ldGVyTmFtZSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGltYWdlSWQ6IGFtaSxcbiAgICAgIG9zVHlwZTogZWMyLk9wZXJhdGluZ1N5c3RlbVR5cGUuTElOVVgsXG4gICAgICB1c2VyRGF0YTogZWMyLlVzZXJEYXRhLmZvckxpbnV4KCksXG4gICAgfTtcbiAgfVxufVxuXG4vLyBNQUlOVEFJTkVSUzogdXNlIC4vc2NyaXB0cy9rdWJlX2J1bXAuc2ggdG8gdXBkYXRlIExBVEVTVF9LVUJFUk5FVEVTX1ZFUlNJT05cbmNvbnN0IExBVEVTVF9LVUJFUk5FVEVTX1ZFUlNJT04gPSAnMS4xNCc7XG5cbi8qKlxuICogV2hldGhlciB0aGUgd29ya2VyIG5vZGVzIHNob3VsZCBzdXBwb3J0IEdQVSBvciBqdXN0IHN0YW5kYXJkIGluc3RhbmNlc1xuICovXG5leHBvcnQgZW51bSBOb2RlVHlwZSB7XG4gIC8qKlxuICAgKiBTdGFuZGFyZCBpbnN0YW5jZXNcbiAgICovXG4gIFNUQU5EQVJEID0gJ1N0YW5kYXJkJyxcblxuICAvKipcbiAgICogR1BVIGluc3RhbmNlc1xuICAgKi9cbiAgR1BVID0gJ0dQVScsXG59XG5cbmNvbnN0IEdQVV9JTlNUQU5DRVRZUEVTID0gWydwMicsICdwMycsICdnNCddO1xuXG5leHBvcnQgZnVuY3Rpb24gbm9kZVR5cGVGb3JJbnN0YW5jZVR5cGUoaW5zdGFuY2VUeXBlOiBlYzIuSW5zdGFuY2VUeXBlKSB7XG4gIHJldHVybiBHUFVfSU5TVEFOQ0VUWVBFUy5pbmNsdWRlcyhpbnN0YW5jZVR5cGUudG9TdHJpbmcoKS5zdWJzdHJpbmcoMCwgMikpID8gTm9kZVR5cGUuR1BVIDogTm9kZVR5cGUuU1RBTkRBUkQ7XG59XG4iXX0=