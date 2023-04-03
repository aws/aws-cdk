"use strict";
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MachineImageType = exports.DefaultCapacityType = exports.CoreDnsComputeType = exports.CpuArch = exports.NodeType = exports.EksOptimizedImage = exports.Cluster = exports.ClusterLoggingTypes = exports.KubernetesVersion = exports.EndpointAccess = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const fs = require("fs");
const path = require("path");
const autoscaling = require("@aws-cdk/aws-autoscaling");
const ec2 = require("@aws-cdk/aws-ec2");
const iam = require("@aws-cdk/aws-iam");
const ssm = require("@aws-cdk/aws-ssm");
const core_1 = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const semver = require("semver");
const YAML = require("yaml");
const alb_controller_1 = require("./alb-controller");
const aws_auth_1 = require("./aws-auth");
const cluster_resource_1 = require("./cluster-resource");
const fargate_profile_1 = require("./fargate-profile");
const helm_chart_1 = require("./helm-chart");
const instance_types_1 = require("./instance-types");
const k8s_manifest_1 = require("./k8s-manifest");
const k8s_object_value_1 = require("./k8s-object-value");
const k8s_patch_1 = require("./k8s-patch");
const kubectl_provider_1 = require("./kubectl-provider");
const managed_nodegroup_1 = require("./managed-nodegroup");
const oidc_provider_1 = require("./oidc-provider");
const bottlerocket_1 = require("./private/bottlerocket");
const service_account_1 = require("./service-account");
const user_data_1 = require("./user-data");
// defaults are based on https://eksctl.io
const DEFAULT_CAPACITY_COUNT = 2;
const DEFAULT_CAPACITY_TYPE = ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.LARGE);
/**
 * Endpoint access characteristics.
 */
class EndpointAccess {
    constructor(
    /**
     * Configuration properties.
     *
     * @internal
     */
    _config) {
        this._config = _config;
        if (!_config.publicAccess && _config.publicCidrs && _config.publicCidrs.length > 0) {
            throw new Error('CIDR blocks can only be configured when public access is enabled');
        }
    }
    /**
     * Restrict public access to specific CIDR blocks.
     * If public access is disabled, this method will result in an error.
     *
     * @param cidr CIDR blocks.
     */
    onlyFrom(...cidr) {
        if (!this._config.privateAccess) {
            // when private access is disabled, we can't restric public
            // access since it will render the kubectl provider unusable.
            throw new Error('Cannot restric public access to endpoint when private access is disabled. Use PUBLIC_AND_PRIVATE.onlyFrom() instead.');
        }
        return new EndpointAccess({
            ...this._config,
            // override CIDR
            publicCidrs: cidr,
        });
    }
}
exports.EndpointAccess = EndpointAccess;
_a = JSII_RTTI_SYMBOL_1;
EndpointAccess[_a] = { fqn: "@aws-cdk/aws-eks.EndpointAccess", version: "0.0.0" };
/**
 * The cluster endpoint is accessible from outside of your VPC.
 * Worker node traffic will leave your VPC to connect to the endpoint.
 *
 * By default, the endpoint is exposed to all adresses. You can optionally limit the CIDR blocks that can access the public endpoint using the `PUBLIC.onlyFrom` method.
 * If you limit access to specific CIDR blocks, you must ensure that the CIDR blocks that you
 * specify include the addresses that worker nodes and Fargate pods (if you use them)
 * access the public endpoint from.
 *
 * @param cidr The CIDR blocks.
 */
EndpointAccess.PUBLIC = new EndpointAccess({ privateAccess: false, publicAccess: true });
/**
 * The cluster endpoint is only accessible through your VPC.
 * Worker node traffic to the endpoint will stay within your VPC.
 */
EndpointAccess.PRIVATE = new EndpointAccess({ privateAccess: true, publicAccess: false });
/**
 * The cluster endpoint is accessible from outside of your VPC.
 * Worker node traffic to the endpoint will stay within your VPC.
 *
 * By default, the endpoint is exposed to all adresses. You can optionally limit the CIDR blocks that can access the public endpoint using the `PUBLIC_AND_PRIVATE.onlyFrom` method.
 * If you limit access to specific CIDR blocks, you must ensure that the CIDR blocks that you
 * specify include the addresses that worker nodes and Fargate pods (if you use them)
 * access the public endpoint from.
 *
 * @param cidr The CIDR blocks.
 */
EndpointAccess.PUBLIC_AND_PRIVATE = new EndpointAccess({ privateAccess: true, publicAccess: true });
/**
 * Kubernetes cluster version
 * @see https://docs.aws.amazon.com/eks/latest/userguide/kubernetes-versions.html#kubernetes-release-calendar
 */
class KubernetesVersion {
    /**
     *
     * @param version cluster version number
     */
    constructor(version) {
        this.version = version;
    }
    /**
     * Custom cluster version
     * @param version custom version number
     */
    static of(version) { return new KubernetesVersion(version); }
}
exports.KubernetesVersion = KubernetesVersion;
_b = JSII_RTTI_SYMBOL_1;
KubernetesVersion[_b] = { fqn: "@aws-cdk/aws-eks.KubernetesVersion", version: "0.0.0" };
/**
 * Kubernetes version 1.14
 * @deprecated Use newer version of EKS
 */
KubernetesVersion.V1_14 = KubernetesVersion.of('1.14');
/**
 * Kubernetes version 1.15
 * @deprecated Use newer version of EKS
 */
KubernetesVersion.V1_15 = KubernetesVersion.of('1.15');
/**
 * Kubernetes version 1.16
 * @deprecated Use newer version of EKS
 */
KubernetesVersion.V1_16 = KubernetesVersion.of('1.16');
/**
 * Kubernetes version 1.17
 * @deprecated Use newer version of EKS
 */
KubernetesVersion.V1_17 = KubernetesVersion.of('1.17');
/**
 * Kubernetes version 1.18
 * @deprecated Use newer version of EKS
 */
KubernetesVersion.V1_18 = KubernetesVersion.of('1.18');
/**
 * Kubernetes version 1.19
 * @deprecated Use newer version of EKS
 */
KubernetesVersion.V1_19 = KubernetesVersion.of('1.19');
/**
 * Kubernetes version 1.20
 * @deprecated Use newer version of EKS
 */
KubernetesVersion.V1_20 = KubernetesVersion.of('1.20');
/**
 * Kubernetes version 1.21
 */
KubernetesVersion.V1_21 = KubernetesVersion.of('1.21');
/**
 * Kubernetes version 1.22
 *
 * When creating a `Cluster` with this version, you need to also specify the
 * `kubectlLayer` property with a `KubectlV22Layer` from
 * `@aws-cdk/lambda-layer-kubectl-v22`.
 */
KubernetesVersion.V1_22 = KubernetesVersion.of('1.22');
/**
 * Kubernetes version 1.23
 *
 * When creating a `Cluster` with this version, you need to also specify the
 * `kubectlLayer` property with a `KubectlV23Layer` from
 * `@aws-cdk/lambda-layer-kubectl-v23`.
 */
KubernetesVersion.V1_23 = KubernetesVersion.of('1.23');
/**
 * Kubernetes version 1.24
 *
 * When creating a `Cluster` with this version, you need to also specify the
 * `kubectlLayer` property with a `KubectlV24Layer` from
 * `@aws-cdk/lambda-layer-kubectl-v24`.
 */
KubernetesVersion.V1_24 = KubernetesVersion.of('1.24');
/**
 * Kubernetes version 1.25
 *
 * When creating a `Cluster` with this version, you need to also specify the
 * `kubectlLayer` property with a `KubectlV25Layer` from
 * `@aws-cdk/lambda-layer-kubectl-v25`.
 */
KubernetesVersion.V1_25 = KubernetesVersion.of('1.25');
/**
 * EKS cluster logging types
 */
var ClusterLoggingTypes;
(function (ClusterLoggingTypes) {
    /**
     * Logs pertaining to API requests to the cluster.
     */
    ClusterLoggingTypes["API"] = "api";
    /**
     * Logs pertaining to cluster access via the Kubernetes API.
     */
    ClusterLoggingTypes["AUDIT"] = "audit";
    /**
     * Logs pertaining to authentication requests into the cluster.
     */
    ClusterLoggingTypes["AUTHENTICATOR"] = "authenticator";
    /**
     * Logs pertaining to state of cluster controllers.
     */
    ClusterLoggingTypes["CONTROLLER_MANAGER"] = "controllerManager";
    /**
     * Logs pertaining to scheduling decisions.
     */
    ClusterLoggingTypes["SCHEDULER"] = "scheduler";
})(ClusterLoggingTypes = exports.ClusterLoggingTypes || (exports.ClusterLoggingTypes = {}));
class ClusterBase extends core_1.Resource {
    /**
     * Defines a Kubernetes resource in this cluster.
     *
     * The manifest will be applied/deleted using kubectl as needed.
     *
     * @param id logical id of this manifest
     * @param manifest a list of Kubernetes resource specifications
     * @returns a `KubernetesResource` object.
     */
    addManifest(id, ...manifest) {
        return new k8s_manifest_1.KubernetesManifest(this, `manifest-${id}`, { cluster: this, manifest });
    }
    /**
     * Defines a Helm chart in this cluster.
     *
     * @param id logical id of this chart.
     * @param options options of this chart.
     * @returns a `HelmChart` construct
     */
    addHelmChart(id, options) {
        return new helm_chart_1.HelmChart(this, `chart-${id}`, { cluster: this, ...options });
    }
    /**
     * Defines a CDK8s chart in this cluster.
     *
     * @param id logical id of this chart.
     * @param chart the cdk8s chart.
     * @returns a `KubernetesManifest` construct representing the chart.
     */
    addCdk8sChart(id, chart, options = {}) {
        const cdk8sChart = chart;
        // see https://github.com/awslabs/cdk8s/blob/master/packages/cdk8s/src/chart.ts#L84
        if (typeof cdk8sChart.toJson !== 'function') {
            throw new Error(`Invalid cdk8s chart. Must contain a 'toJson' method, but found ${typeof cdk8sChart.toJson}`);
        }
        const manifest = new k8s_manifest_1.KubernetesManifest(this, id, {
            cluster: this,
            manifest: cdk8sChart.toJson(),
            ...options,
        });
        return manifest;
    }
    addServiceAccount(id, options = {}) {
        return new service_account_1.ServiceAccount(this, id, {
            ...options,
            cluster: this,
        });
    }
    /**
     * Installs the AWS spot instance interrupt handler on the cluster if it's not
     * already added.
     */
    addSpotInterruptHandler() {
        if (!this._spotInterruptHandler) {
            this._spotInterruptHandler = this.addHelmChart('spot-interrupt-handler', {
                chart: 'aws-node-termination-handler',
                version: '0.18.0',
                repository: 'https://aws.github.io/eks-charts',
                namespace: 'kube-system',
                values: {
                    nodeSelector: {
                        lifecycle: user_data_1.LifecycleLabel.SPOT,
                    },
                },
            });
        }
        return this._spotInterruptHandler;
    }
    /**
     * Connect capacity in the form of an existing AutoScalingGroup to the EKS cluster.
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
     * Prefer to use `addAutoScalingGroupCapacity` if possible.
     *
     * @see https://docs.aws.amazon.com/eks/latest/userguide/launch-workers.html
     * @param autoScalingGroup [disable-awslint:ref-via-interface]
     * @param options options for adding auto scaling groups, like customizing the bootstrap script
     */
    connectAutoScalingGroupCapacity(autoScalingGroup, options) {
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
        // allow traffic to/from managed node groups (eks attaches this security group to the managed nodes)
        autoScalingGroup.addSecurityGroup(this.clusterSecurityGroup);
        const bootstrapEnabled = options.bootstrapEnabled ?? true;
        if (options.bootstrapOptions && !bootstrapEnabled) {
            throw new Error('Cannot specify "bootstrapOptions" if "bootstrapEnabled" is false');
        }
        if (bootstrapEnabled) {
            const userData = options.machineImageType === MachineImageType.BOTTLEROCKET ?
                user_data_1.renderBottlerocketUserData(this) :
                user_data_1.renderAmazonLinuxUserData(this, autoScalingGroup, options.bootstrapOptions);
            autoScalingGroup.addUserData(...userData);
        }
        autoScalingGroup.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSWorkerNodePolicy'));
        autoScalingGroup.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKS_CNI_Policy'));
        autoScalingGroup.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryReadOnly'));
        // EKS Required Tags
        // https://docs.aws.amazon.com/eks/latest/userguide/worker.html
        core_1.Tags.of(autoScalingGroup).add(`kubernetes.io/cluster/${this.clusterName}`, 'owned', {
            applyToLaunchedInstances: true,
            // exclude security groups to avoid multiple "owned" security groups.
            // (the cluster security group already has this tag)
            excludeResourceTypes: ['AWS::EC2::SecurityGroup'],
        });
        // do not attempt to map the role if `kubectl` is not enabled for this
        // cluster or if `mapRole` is set to false. By default this should happen.
        let mapRole = options.mapRole ?? true;
        if (mapRole && !(this instanceof Cluster)) {
            // do the mapping...
            core_1.Annotations.of(autoScalingGroup).addWarning('Auto-mapping aws-auth role for imported cluster is not supported, please map role manually');
            mapRole = false;
        }
        if (mapRole) {
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
        const addSpotInterruptHandler = options.spotInterruptHandler ?? true;
        // if this is an ASG with spot instances, install the spot interrupt handler (only if kubectl is enabled).
        if (autoScalingGroup.spotPrice && addSpotInterruptHandler) {
            this.addSpotInterruptHandler();
        }
        if (this instanceof Cluster && this.albController) {
            // the controller runs on the worker nodes so they cannot
            // be deleted before the controller.
            constructs_1.Node.of(this.albController).addDependency(autoScalingGroup);
        }
    }
}
;
/**
 * A Cluster represents a managed Kubernetes Service (EKS)
 *
 * This is a fully managed cluster of API Servers (control-plane)
 * The user is still required to create the worker nodes.
 */
class Cluster extends ClusterBase {
    /**
     * Initiates an EKS Cluster with the supplied arguments
     *
     * @param scope a Construct, most likely a cdk.Stack created
     * @param id the id of the Construct to create
     * @param props properties in the IClusterProps interface
     */
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props.clusterName,
        });
        /**
         * If the cluster has one (or more) FargateProfiles associated, this array
         * will hold a reference to each.
         */
        this._fargateProfiles = [];
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_eks_ClusterProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Cluster);
            }
            throw error;
        }
        const stack = core_1.Stack.of(this);
        this.prune = props.prune ?? true;
        this.vpc = props.vpc || new ec2.Vpc(this, 'DefaultVpc');
        const kubectlVersion = new semver.SemVer(`${props.version.version}.0`);
        if (semver.gte(kubectlVersion, '1.22.0') && !props.kubectlLayer) {
            core_1.Annotations.of(this).addWarning(`You created a cluster with Kubernetes Version ${props.version.version} without specifying the kubectlLayer property. This may cause failures as the kubectl version provided with aws-cdk-lib is 1.20, which is only guaranteed to be compatible with Kubernetes versions 1.19-1.21. Please provide a kubectlLayer from @aws-cdk/lambda-layer-kubectl-v${kubectlVersion.minor}.`);
        }
        ;
        this.version = props.version;
        this.kubectlLambdaRole = props.kubectlLambdaRole ? props.kubectlLambdaRole : undefined;
        this.tagSubnets();
        // this is the role used by EKS when interacting with AWS resources
        this.role = props.role || new iam.Role(this, 'Role', {
            assumedBy: new iam.ServicePrincipal('eks.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSClusterPolicy'),
            ],
        });
        const securityGroup = props.securityGroup || new ec2.SecurityGroup(this, 'ControlPlaneSecurityGroup', {
            vpc: this.vpc,
            description: 'EKS Control Plane Security Group',
        });
        this.vpcSubnets = props.vpcSubnets ?? [{ subnetType: ec2.SubnetType.PUBLIC }, { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS }];
        const selectedSubnetIdsPerGroup = this.vpcSubnets.map(s => this.vpc.selectSubnets(s).subnetIds);
        if (selectedSubnetIdsPerGroup.some(core_1.Token.isUnresolved) && selectedSubnetIdsPerGroup.length > 1) {
            throw new Error('eks.Cluster: cannot select multiple subnet groups from a VPC imported from list tokens with unknown length. Select only one subnet group, pass a length to Fn.split, or switch to Vpc.fromLookup.');
        }
        // Get subnetIds for all selected subnets
        const subnetIds = Array.from(new Set(flatten(selectedSubnetIdsPerGroup)));
        this.logging = props.clusterLogging ? {
            clusterLogging: [
                {
                    enabled: true,
                    types: Object.values(props.clusterLogging),
                },
            ],
        } : undefined;
        this.endpointAccess = props.endpointAccess ?? EndpointAccess.PUBLIC_AND_PRIVATE;
        this.kubectlEnvironment = props.kubectlEnvironment;
        this.kubectlLayer = props.kubectlLayer;
        this.awscliLayer = props.awscliLayer;
        this.kubectlMemory = props.kubectlMemory;
        this.onEventLayer = props.onEventLayer;
        this.clusterHandlerSecurityGroup = props.clusterHandlerSecurityGroup;
        const privateSubnets = this.selectPrivateSubnets().slice(0, 16);
        const publicAccessDisabled = !this.endpointAccess._config.publicAccess;
        const publicAccessRestricted = !publicAccessDisabled
            && this.endpointAccess._config.publicCidrs
            && this.endpointAccess._config.publicCidrs.length !== 0;
        // validate endpoint access configuration
        if (privateSubnets.length === 0 && publicAccessDisabled) {
            // no private subnets and no public access at all, no good.
            throw new Error('Vpc must contain private subnets when public endpoint access is disabled');
        }
        if (privateSubnets.length === 0 && publicAccessRestricted) {
            // no private subnets and public access is restricted, no good.
            throw new Error('Vpc must contain private subnets when public endpoint access is restricted');
        }
        const placeClusterHandlerInVpc = props.placeClusterHandlerInVpc ?? false;
        if (placeClusterHandlerInVpc && privateSubnets.length === 0) {
            throw new Error('Cannot place cluster handler in the VPC since no private subnets could be selected');
        }
        if (props.clusterHandlerSecurityGroup && !placeClusterHandlerInVpc) {
            throw new Error('Cannot specify clusterHandlerSecurityGroup without placeClusterHandlerInVpc set to true');
        }
        const resource = this._clusterResource = new cluster_resource_1.ClusterResource(this, 'Resource', {
            name: this.physicalName,
            environment: props.clusterHandlerEnvironment,
            roleArn: this.role.roleArn,
            version: props.version.version,
            resourcesVpcConfig: {
                securityGroupIds: [securityGroup.securityGroupId],
                subnetIds,
            },
            ...(props.secretsEncryptionKey ? {
                encryptionConfig: [{
                        provider: {
                            keyArn: props.secretsEncryptionKey.keyArn,
                        },
                        resources: ['secrets'],
                    }],
            } : {}),
            kubernetesNetworkConfig: props.serviceIpv4Cidr ? {
                serviceIpv4Cidr: props.serviceIpv4Cidr,
            } : undefined,
            endpointPrivateAccess: this.endpointAccess._config.privateAccess,
            endpointPublicAccess: this.endpointAccess._config.publicAccess,
            publicAccessCidrs: this.endpointAccess._config.publicCidrs,
            secretsEncryptionKey: props.secretsEncryptionKey,
            vpc: this.vpc,
            subnets: placeClusterHandlerInVpc ? privateSubnets : undefined,
            clusterHandlerSecurityGroup: this.clusterHandlerSecurityGroup,
            onEventLayer: this.onEventLayer,
            tags: props.tags,
            logging: this.logging,
        });
        if (this.endpointAccess._config.privateAccess && privateSubnets.length !== 0) {
            // when private access is enabled and the vpc has private subnets, lets connect
            // the provider to the vpc so that it will work even when restricting public access.
            // validate VPC properties according to: https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html
            if (this.vpc instanceof ec2.Vpc && !(this.vpc.dnsHostnamesEnabled && this.vpc.dnsSupportEnabled)) {
                throw new Error('Private endpoint access requires the VPC to have DNS support and DNS hostnames enabled. Use `enableDnsHostnames: true` and `enableDnsSupport: true` when creating the VPC.');
            }
            this.kubectlPrivateSubnets = privateSubnets;
            // the vpc must exist in order to properly delete the cluster (since we run `kubectl delete`).
            // this ensures that.
            this._clusterResource.node.addDependency(this.vpc);
        }
        this.adminRole = resource.adminRole;
        // we use an SSM parameter as a barrier because it's free and fast.
        this._kubectlReadyBarrier = new core_1.CfnResource(this, 'KubectlReadyBarrier', {
            type: 'AWS::SSM::Parameter',
            properties: {
                Type: 'String',
                Value: 'aws:cdk:eks:kubectl-ready',
            },
        });
        // add the cluster resource itself as a dependency of the barrier
        this._kubectlReadyBarrier.node.addDependency(this._clusterResource);
        this.clusterName = this.getResourceNameAttribute(resource.ref);
        this.clusterArn = this.getResourceArnAttribute(resource.attrArn, cluster_resource_1.clusterArnComponents(this.physicalName));
        this.clusterEndpoint = resource.attrEndpoint;
        this.clusterCertificateAuthorityData = resource.attrCertificateAuthorityData;
        this.clusterSecurityGroupId = resource.attrClusterSecurityGroupId;
        this.clusterEncryptionConfigKeyArn = resource.attrEncryptionConfigKeyArn;
        this.clusterSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(this, 'ClusterSecurityGroup', this.clusterSecurityGroupId);
        this.connections = new ec2.Connections({
            securityGroups: [this.clusterSecurityGroup, securityGroup],
            defaultPort: ec2.Port.tcp(443),
        });
        // we can use the cluster security group since its already attached to the cluster
        // and configured to allow connections from itself.
        this.kubectlSecurityGroup = this.clusterSecurityGroup;
        // use the cluster creation role to issue kubectl commands against the cluster because when the
        // cluster is first created, that's the only role that has "system:masters" permissions
        this.kubectlRole = this.adminRole;
        this._kubectlResourceProvider = this.defineKubectlProvider();
        const updateConfigCommandPrefix = `aws eks update-kubeconfig --name ${this.clusterName}`;
        const getTokenCommandPrefix = `aws eks get-token --cluster-name ${this.clusterName}`;
        const commonCommandOptions = [`--region ${stack.region}`];
        if (props.outputClusterName) {
            new core_1.CfnOutput(this, 'ClusterName', { value: this.clusterName });
        }
        // if an explicit role is not configured, define a masters role that can
        // be assumed by anyone in the account (with sts:AssumeRole permissions of
        // course)
        const mastersRole = props.mastersRole ?? new iam.Role(this, 'MastersRole', {
            assumedBy: new iam.AccountRootPrincipal(),
        });
        // map the IAM role to the `system:masters` group.
        this.awsAuth.addMastersRole(mastersRole);
        if (props.outputMastersRoleArn) {
            new core_1.CfnOutput(this, 'MastersRoleArn', { value: mastersRole.roleArn });
        }
        commonCommandOptions.push(`--role-arn ${mastersRole.roleArn}`);
        if (props.albController) {
            this.albController = alb_controller_1.AlbController.create(this, { ...props.albController, cluster: this });
        }
        // allocate default capacity if non-zero (or default).
        const minCapacity = props.defaultCapacity ?? DEFAULT_CAPACITY_COUNT;
        if (minCapacity > 0) {
            const instanceType = props.defaultCapacityInstance || DEFAULT_CAPACITY_TYPE;
            this.defaultCapacity = props.defaultCapacityType === DefaultCapacityType.EC2 ?
                this.addAutoScalingGroupCapacity('DefaultCapacity', { instanceType, minCapacity }) : undefined;
            this.defaultNodegroup = props.defaultCapacityType !== DefaultCapacityType.EC2 ?
                this.addNodegroupCapacity('DefaultCapacity', { instanceTypes: [instanceType], minSize: minCapacity }) : undefined;
        }
        const outputConfigCommand = props.outputConfigCommand ?? true;
        if (outputConfigCommand) {
            const postfix = commonCommandOptions.join(' ');
            new core_1.CfnOutput(this, 'ConfigCommand', { value: `${updateConfigCommandPrefix} ${postfix}` });
            new core_1.CfnOutput(this, 'GetTokenCommand', { value: `${getTokenCommandPrefix} ${postfix}` });
        }
        this.defineCoreDnsComputeType(props.coreDnsComputeType ?? CoreDnsComputeType.EC2);
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
            jsiiDeprecationWarnings._aws_cdk_aws_eks_ClusterAttributes(attrs);
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
     * Fetch the load balancer address of a service of type 'LoadBalancer'.
     *
     * @param serviceName The name of the service.
     * @param options Additional operation options.
     */
    getServiceLoadBalancerAddress(serviceName, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_eks_ServiceLoadBalancerAddressOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.getServiceLoadBalancerAddress);
            }
            throw error;
        }
        const loadBalancerAddress = new k8s_object_value_1.KubernetesObjectValue(this, `${serviceName}LoadBalancerAddress`, {
            cluster: this,
            objectType: 'service',
            objectName: serviceName,
            objectNamespace: options.namespace,
            jsonPath: '.status.loadBalancer.ingress[0].hostname',
            timeout: options.timeout,
        });
        return loadBalancerAddress.value;
    }
    /**
     * Fetch the load balancer address of an ingress backed by a load balancer.
     *
     * @param ingressName The name of the ingress.
     * @param options Additional operation options.
     */
    getIngressLoadBalancerAddress(ingressName, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_eks_IngressLoadBalancerAddressOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.getIngressLoadBalancerAddress);
            }
            throw error;
        }
        const loadBalancerAddress = new k8s_object_value_1.KubernetesObjectValue(this, `${ingressName}LoadBalancerAddress`, {
            cluster: this,
            objectType: 'ingress',
            objectName: ingressName,
            objectNamespace: options.namespace,
            jsonPath: '.status.loadBalancer.ingress[0].hostname',
            timeout: options.timeout,
        });
        return loadBalancerAddress.value;
    }
    /**
     * Add nodes to this EKS cluster
     *
     * The nodes will automatically be configured with the right VPC and AMI
     * for the instance type and Kubernetes version.
     *
     * Note that if you specify `updateType: RollingUpdate` or `updateType: ReplacingUpdate`, your nodes might be replaced at deploy
     * time without notice in case the recommended AMI for your machine image type has been updated by AWS.
     * The default behavior for `updateType` is `None`, which means only new instances will be launched using the new AMI.
     *
     * Spot instances will be labeled `lifecycle=Ec2Spot` and tainted with `PreferNoSchedule`.
     * In addition, the [spot interrupt handler](https://github.com/awslabs/ec2-spot-labs/tree/master/ec2-spot-eks-solution/spot-termination-handler)
     * daemon will be installed on all spot instances to handle
     * [EC2 Spot Instance Termination Notices](https://aws.amazon.com/blogs/aws/new-ec2-spot-instance-termination-notices/).
     */
    addAutoScalingGroupCapacity(id, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_eks_AutoScalingGroupCapacityOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addAutoScalingGroupCapacity);
            }
            throw error;
        }
        if (options.machineImageType === MachineImageType.BOTTLEROCKET && options.bootstrapOptions !== undefined) {
            throw new Error('bootstrapOptions is not supported for Bottlerocket');
        }
        const asg = new autoscaling.AutoScalingGroup(this, id, {
            ...options,
            vpc: this.vpc,
            machineImage: options.machineImageType === MachineImageType.BOTTLEROCKET ?
                new bottlerocket_1.BottleRocketImage({
                    kubernetesVersion: this.version.version,
                }) :
                new EksOptimizedImage({
                    nodeType: nodeTypeForInstanceType(options.instanceType),
                    cpuArch: cpuArchForInstanceType(options.instanceType),
                    kubernetesVersion: this.version.version,
                }),
        });
        this.connectAutoScalingGroupCapacity(asg, {
            mapRole: options.mapRole,
            bootstrapOptions: options.bootstrapOptions,
            bootstrapEnabled: options.bootstrapEnabled,
            machineImageType: options.machineImageType,
            spotInterruptHandler: options.spotInterruptHandler,
        });
        if (nodeTypeForInstanceType(options.instanceType) === NodeType.INFERENTIA) {
            this.addNeuronDevicePlugin();
        }
        return asg;
    }
    /**
     * Add managed nodegroup to this Amazon EKS cluster
     *
     * This method will create a new managed nodegroup and add into the capacity.
     *
     * @see https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html
     * @param id The ID of the nodegroup
     * @param options options for creating a new nodegroup
     */
    addNodegroupCapacity(id, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_eks_NodegroupOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addNodegroupCapacity);
            }
            throw error;
        }
        return new managed_nodegroup_1.Nodegroup(this, `Nodegroup${id}`, {
            cluster: this,
            ...options,
        });
    }
    /**
     * Lazily creates the AwsAuth resource, which manages AWS authentication mapping.
     */
    get awsAuth() {
        if (!this._awsAuth) {
            this._awsAuth = new aws_auth_1.AwsAuth(this, 'AwsAuth', { cluster: this });
        }
        return this._awsAuth;
    }
    /**
     * If this cluster is kubectl-enabled, returns the OpenID Connect issuer url.
     * This is because the values is only be retrieved by the API and not exposed
     * by CloudFormation. If this cluster is not kubectl-enabled (i.e. uses the
     * stock `CfnCluster`), this is `undefined`.
     * @attribute
     */
    get clusterOpenIdConnectIssuerUrl() {
        return this._clusterResource.attrOpenIdConnectIssuerUrl;
    }
    /**
     * If this cluster is kubectl-enabled, returns the OpenID Connect issuer.
     * This is because the values is only be retrieved by the API and not exposed
     * by CloudFormation. If this cluster is not kubectl-enabled (i.e. uses the
     * stock `CfnCluster`), this is `undefined`.
     * @attribute
     */
    get clusterOpenIdConnectIssuer() {
        return this._clusterResource.attrOpenIdConnectIssuer;
    }
    /**
     * An `OpenIdConnectProvider` resource associated with this cluster, and which can be used
     * to link this cluster to AWS IAM.
     *
     * A provider will only be defined if this property is accessed (lazy initialization).
     */
    get openIdConnectProvider() {
        if (!this._openIdConnectProvider) {
            this._openIdConnectProvider = new oidc_provider_1.OpenIdConnectProvider(this, 'OpenIdConnectProvider', {
                url: this.clusterOpenIdConnectIssuerUrl,
            });
        }
        return this._openIdConnectProvider;
    }
    /**
     * Adds a Fargate profile to this cluster.
     * @see https://docs.aws.amazon.com/eks/latest/userguide/fargate-profile.html
     *
     * @param id the id of this profile
     * @param options profile options
     */
    addFargateProfile(id, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_eks_FargateProfileOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addFargateProfile);
            }
            throw error;
        }
        return new fargate_profile_1.FargateProfile(this, `fargate-profile-${id}`, {
            ...options,
            cluster: this,
        });
    }
    /**
     * Internal API used by `FargateProfile` to keep inventory of Fargate profiles associated with
     * this cluster, for the sake of ensuring the profiles are created sequentially.
     *
     * @returns the list of FargateProfiles attached to this cluster, including the one just attached.
     * @internal
     */
    _attachFargateProfile(fargateProfile) {
        this._fargateProfiles.push(fargateProfile);
        // add all profiles as a dependency of the "kubectl-ready" barrier because all kubectl-
        // resources can only be deployed after all fargate profiles are created.
        this._kubectlReadyBarrier.node.addDependency(fargateProfile);
        return this._fargateProfiles;
    }
    /**
     * Adds a resource scope that requires `kubectl` to this cluster and returns
     * the `KubectlProvider` which is the custom resource provider that should be
     * used as the resource provider.
     *
     * Called from `HelmResource` and `KubernetesResource`
     *
     * @param resourceScope the construct scope in which kubectl resources are defined.
     *
     * @internal
     */
    _attachKubectlResourceScope(resourceScope) {
        constructs_1.Node.of(resourceScope).addDependency(this._kubectlReadyBarrier);
        return this._kubectlResourceProvider;
    }
    defineKubectlProvider() {
        const uid = '@aws-cdk/aws-eks.KubectlProvider';
        // since we can't have the provider connect to multiple networks, and we
        // wanted to avoid resource tear down, we decided for now that we will only
        // support a single EKS cluster per CFN stack.
        if (this.stack.node.tryFindChild(uid)) {
            throw new Error('Only a single EKS cluster can be defined within a CloudFormation stack');
        }
        return new kubectl_provider_1.KubectlProvider(this.stack, uid, { cluster: this });
    }
    selectPrivateSubnets() {
        const privateSubnets = [];
        const vpcPrivateSubnetIds = this.vpc.privateSubnets.map(s => s.subnetId);
        const vpcPublicSubnetIds = this.vpc.publicSubnets.map(s => s.subnetId);
        for (const placement of this.vpcSubnets) {
            for (const subnet of this.vpc.selectSubnets(placement).subnets) {
                if (vpcPrivateSubnetIds.includes(subnet.subnetId)) {
                    // definitely private, take it.
                    privateSubnets.push(subnet);
                    continue;
                }
                if (vpcPublicSubnetIds.includes(subnet.subnetId)) {
                    // definitely public, skip it.
                    continue;
                }
                // neither public and nor private - what is it then? this means its a subnet instance that was explicitly passed
                // in the subnet selection. since ISubnet doesn't contain information on type, we have to assume its private and let it
                // fail at deploy time :\ (its better than filtering it out and preventing a possibly successful deployment)
                privateSubnets.push(subnet);
            }
        }
        return privateSubnets;
    }
    /**
     * Installs the Neuron device plugin on the cluster if it's not
     * already added.
     */
    addNeuronDevicePlugin() {
        if (!this._neuronDevicePlugin) {
            const fileContents = fs.readFileSync(path.join(__dirname, 'addons/neuron-device-plugin.yaml'), 'utf8');
            const sanitized = YAML.parse(fileContents);
            this._neuronDevicePlugin = this.addManifest('NeuronDevicePlugin', sanitized);
        }
        return this._neuronDevicePlugin;
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
                    const subnetID = core_1.Token.isUnresolved(subnet.subnetId) || core_1.Token.isUnresolved([subnet.subnetId]) ? '' : ` ${subnet.subnetId}`;
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
    /**
     * Patches the CoreDNS deployment configuration and sets the "eks.amazonaws.com/compute-type"
     * annotation to either "ec2" or "fargate". Note that if "ec2" is selected, the resource is
     * omitted/removed, since the cluster is created with the "ec2" compute type by default.
     */
    defineCoreDnsComputeType(type) {
        // ec2 is the "built in" compute type of the cluster so if this is the
        // requested type we can simply omit the resource. since the resource's
        // `restorePatch` is configured to restore the value to "ec2" this means
        // that deletion of the resource will change to "ec2" as well.
        if (type === CoreDnsComputeType.EC2) {
            return;
        }
        // this is the json patch we merge into the resource based off of:
        // https://docs.aws.amazon.com/eks/latest/userguide/fargate-getting-started.html#fargate-gs-coredns
        const renderPatch = (computeType) => ({
            spec: {
                template: {
                    metadata: {
                        annotations: {
                            'eks.amazonaws.com/compute-type': computeType,
                        },
                    },
                },
            },
        });
        new k8s_patch_1.KubernetesPatch(this, 'CoreDnsComputeTypePatch', {
            cluster: this,
            resourceName: 'deployment/coredns',
            resourceNamespace: 'kube-system',
            applyPatch: renderPatch(CoreDnsComputeType.FARGATE),
            restorePatch: renderPatch(CoreDnsComputeType.EC2),
        });
    }
}
exports.Cluster = Cluster;
_c = JSII_RTTI_SYMBOL_1;
Cluster[_c] = { fqn: "@aws-cdk/aws-eks.Cluster", version: "0.0.0" };
/**
 * Import a cluster to use in another stack
 */
class ImportedCluster extends ClusterBase {
    constructor(scope, id, props) {
        super(scope, id);
        this.props = props;
        this.connections = new ec2.Connections();
        this.clusterName = props.clusterName;
        this.clusterArn = this.stack.formatArn(cluster_resource_1.clusterArnComponents(props.clusterName));
        this.kubectlRole = props.kubectlRoleArn ? iam.Role.fromRoleArn(this, 'KubectlRole', props.kubectlRoleArn) : undefined;
        this.kubectlLambdaRole = props.kubectlLambdaRole;
        this.kubectlSecurityGroup = props.kubectlSecurityGroupId ? ec2.SecurityGroup.fromSecurityGroupId(this, 'KubectlSecurityGroup', props.kubectlSecurityGroupId) : undefined;
        this.kubectlEnvironment = props.kubectlEnvironment;
        this.kubectlPrivateSubnets = props.kubectlPrivateSubnetIds ? props.kubectlPrivateSubnetIds.map((subnetid, index) => ec2.Subnet.fromSubnetId(this, `KubectlSubnet${index}`, subnetid)) : undefined;
        this.kubectlLayer = props.kubectlLayer;
        this.awscliLayer = props.awscliLayer;
        this.kubectlMemory = props.kubectlMemory;
        this.clusterHandlerSecurityGroup = props.clusterHandlerSecurityGroupId ? ec2.SecurityGroup.fromSecurityGroupId(this, 'ClusterHandlerSecurityGroup', props.clusterHandlerSecurityGroupId) : undefined;
        this.kubectlProvider = props.kubectlProvider;
        this.onEventLayer = props.onEventLayer;
        this.prune = props.prune ?? true;
        let i = 1;
        for (const sgid of props.securityGroupIds ?? []) {
            this.connections.addSecurityGroup(ec2.SecurityGroup.fromSecurityGroupId(this, `SecurityGroup${i}`, sgid));
            i++;
        }
        if (props.clusterSecurityGroupId) {
            this._clusterSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(this, 'ClusterSecurityGroup', this.clusterSecurityGroupId);
            this.connections.addSecurityGroup(this._clusterSecurityGroup);
        }
    }
    get vpc() {
        if (!this.props.vpc) {
            throw new Error('"vpc" is not defined for this imported cluster');
        }
        return this.props.vpc;
    }
    get clusterSecurityGroup() {
        if (!this._clusterSecurityGroup) {
            throw new Error('"clusterSecurityGroup" is not defined for this imported cluster');
        }
        return this._clusterSecurityGroup;
    }
    get clusterSecurityGroupId() {
        if (!this.props.clusterSecurityGroupId) {
            throw new Error('"clusterSecurityGroupId" is not defined for this imported cluster');
        }
        return this.props.clusterSecurityGroupId;
    }
    get clusterEndpoint() {
        if (!this.props.clusterEndpoint) {
            throw new Error('"clusterEndpoint" is not defined for this imported cluster');
        }
        return this.props.clusterEndpoint;
    }
    get clusterCertificateAuthorityData() {
        if (!this.props.clusterCertificateAuthorityData) {
            throw new Error('"clusterCertificateAuthorityData" is not defined for this imported cluster');
        }
        return this.props.clusterCertificateAuthorityData;
    }
    get clusterEncryptionConfigKeyArn() {
        if (!this.props.clusterEncryptionConfigKeyArn) {
            throw new Error('"clusterEncryptionConfigKeyArn" is not defined for this imported cluster');
        }
        return this.props.clusterEncryptionConfigKeyArn;
    }
    get openIdConnectProvider() {
        if (!this.props.openIdConnectProvider) {
            throw new Error('"openIdConnectProvider" is not defined for this imported cluster');
        }
        return this.props.openIdConnectProvider;
    }
    get awsAuth() {
        throw new Error('"awsAuth" is not supported on imported clusters');
    }
}
/**
 * Construct an Amazon Linux 2 image from the latest EKS Optimized AMI published in SSM
 */
class EksOptimizedImage {
    /**
     * Constructs a new instance of the EcsOptimizedAmi class.
     */
    constructor(props = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_eks_EksOptimizedImageProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, EksOptimizedImage);
            }
            throw error;
        }
        this.nodeType = props.nodeType ?? NodeType.STANDARD;
        this.cpuArch = props.cpuArch ?? CpuArch.X86_64;
        this.kubernetesVersion = props.kubernetesVersion ?? LATEST_KUBERNETES_VERSION;
        // set the SSM parameter name
        this.amiParameterName = `/aws/service/eks/optimized-ami/${this.kubernetesVersion}/`
            + (this.nodeType === NodeType.STANDARD ? this.cpuArch === CpuArch.X86_64 ?
                'amazon-linux-2/' : 'amazon-linux-2-arm64/' : '')
            + (this.nodeType === NodeType.GPU ? 'amazon-linux-2-gpu/' : '')
            + (this.nodeType === NodeType.INFERENTIA ? 'amazon-linux-2-gpu/' : '')
            + 'recommended/image_id';
    }
    /**
     * Return the correct image
     */
    getImage(scope) {
        const ami = ssm.StringParameter.valueForStringParameter(scope, this.amiParameterName);
        return {
            imageId: ami,
            osType: ec2.OperatingSystemType.LINUX,
            userData: ec2.UserData.forLinux(),
        };
    }
}
exports.EksOptimizedImage = EksOptimizedImage;
_d = JSII_RTTI_SYMBOL_1;
EksOptimizedImage[_d] = { fqn: "@aws-cdk/aws-eks.EksOptimizedImage", version: "0.0.0" };
// MAINTAINERS: use ./scripts/kube_bump.sh to update LATEST_KUBERNETES_VERSION
const LATEST_KUBERNETES_VERSION = '1.24';
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
    /**
     * Inferentia instances
     */
    NodeType["INFERENTIA"] = "INFERENTIA";
})(NodeType = exports.NodeType || (exports.NodeType = {}));
/**
 * CPU architecture
 */
var CpuArch;
(function (CpuArch) {
    /**
     * arm64 CPU type
     */
    CpuArch["ARM_64"] = "arm64";
    /**
     * x86_64 CPU type
     */
    CpuArch["X86_64"] = "x86_64";
})(CpuArch = exports.CpuArch || (exports.CpuArch = {}));
/**
 * The type of compute resources to use for CoreDNS.
 */
var CoreDnsComputeType;
(function (CoreDnsComputeType) {
    /**
     * Deploy CoreDNS on EC2 instances.
     */
    CoreDnsComputeType["EC2"] = "ec2";
    /**
     * Deploy CoreDNS on Fargate-managed instances.
     */
    CoreDnsComputeType["FARGATE"] = "fargate";
})(CoreDnsComputeType = exports.CoreDnsComputeType || (exports.CoreDnsComputeType = {}));
/**
 * The default capacity type for the cluster
 */
var DefaultCapacityType;
(function (DefaultCapacityType) {
    /**
     * managed node group
     */
    DefaultCapacityType[DefaultCapacityType["NODEGROUP"] = 0] = "NODEGROUP";
    /**
     * EC2 autoscaling group
     */
    DefaultCapacityType[DefaultCapacityType["EC2"] = 1] = "EC2";
})(DefaultCapacityType = exports.DefaultCapacityType || (exports.DefaultCapacityType = {}));
/**
 * The machine image type
 */
var MachineImageType;
(function (MachineImageType) {
    /**
     * Amazon EKS-optimized Linux AMI
     */
    MachineImageType[MachineImageType["AMAZON_LINUX_2"] = 0] = "AMAZON_LINUX_2";
    /**
     * Bottlerocket AMI
     */
    MachineImageType[MachineImageType["BOTTLEROCKET"] = 1] = "BOTTLEROCKET";
})(MachineImageType = exports.MachineImageType || (exports.MachineImageType = {}));
function nodeTypeForInstanceType(instanceType) {
    return instance_types_1.INSTANCE_TYPES.gpu.includes(instanceType.toString().substring(0, 2)) ? NodeType.GPU :
        instance_types_1.INSTANCE_TYPES.inferentia.includes(instanceType.toString().substring(0, 4)) ? NodeType.INFERENTIA :
            NodeType.STANDARD;
}
function cpuArchForInstanceType(instanceType) {
    return instance_types_1.INSTANCE_TYPES.graviton2.includes(instanceType.toString().substring(0, 3)) ? CpuArch.ARM_64 :
        instance_types_1.INSTANCE_TYPES.graviton3.includes(instanceType.toString().substring(0, 3)) ? CpuArch.ARM_64 :
            instance_types_1.INSTANCE_TYPES.graviton.includes(instanceType.toString().substring(0, 2)) ? CpuArch.ARM_64 :
                CpuArch.X86_64;
}
function flatten(xss) {
    return Array.prototype.concat.call([], ...xss);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2x1c3Rlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsdXN0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3Qix3REFBd0Q7QUFDeEQsd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUd4Qyx3Q0FBd0M7QUFDeEMsd0NBQTZIO0FBQzdILDJDQUE2QztBQUM3QyxpQ0FBaUM7QUFDakMsNkJBQTZCO0FBQzdCLHFEQUF1RTtBQUN2RSx5Q0FBcUM7QUFDckMseURBQTJFO0FBQzNFLHVEQUEwRTtBQUMxRSw2Q0FBMkQ7QUFDM0QscURBQWtEO0FBQ2xELGlEQUErRTtBQUMvRSx5REFBMkQ7QUFDM0QsMkNBQThDO0FBQzlDLHlEQUF1RTtBQUN2RSwyREFBa0U7QUFDbEUsbURBQXdEO0FBQ3hELHlEQUEyRDtBQUMzRCx1REFBMEU7QUFDMUUsMkNBQW9HO0FBRXBHLDBDQUEwQztBQUMxQyxNQUFNLHNCQUFzQixHQUFHLENBQUMsQ0FBQztBQUNqQyxNQUFNLHFCQUFxQixHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7QUE0b0JoRzs7R0FFRztBQUNILE1BQWEsY0FBYztJQWtDekI7SUFDRTs7OztPQUlHO0lBQ2EsT0FBNkI7UUFBN0IsWUFBTyxHQUFQLE9BQU8sQ0FBc0I7UUFDN0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLElBQUksT0FBTyxDQUFDLFdBQVcsSUFBSSxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDbEYsTUFBTSxJQUFJLEtBQUssQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDO1NBQ3JGO0tBQ0Y7SUFHRDs7Ozs7T0FLRztJQUNJLFFBQVEsQ0FBQyxHQUFHLElBQWM7UUFDL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFO1lBQy9CLDJEQUEyRDtZQUMzRCw2REFBNkQ7WUFDN0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxzSEFBc0gsQ0FBQyxDQUFDO1NBQ3pJO1FBQ0QsT0FBTyxJQUFJLGNBQWMsQ0FBQztZQUN4QixHQUFHLElBQUksQ0FBQyxPQUFPO1lBQ2YsZ0JBQWdCO1lBQ2hCLFdBQVcsRUFBRSxJQUFJO1NBQ2xCLENBQUMsQ0FBQztLQUNKOztBQWhFSCx3Q0FpRUM7OztBQS9EQzs7Ozs7Ozs7OztHQVVHO0FBQ29CLHFCQUFNLEdBQUcsSUFBSSxjQUFjLENBQUMsRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBRWpHOzs7R0FHRztBQUNvQixzQkFBTyxHQUFHLElBQUksY0FBYyxDQUFDLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUVsRzs7Ozs7Ozs7OztHQVVHO0FBQ29CLGlDQUFrQixHQUFHLElBQUksY0FBYyxDQUFDLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQWtGOUc7OztHQUdHO0FBQ0gsTUFBYSxpQkFBaUI7SUF5RjVCOzs7T0FHRztJQUNILFlBQW9DLE9BQWU7UUFBZixZQUFPLEdBQVAsT0FBTyxDQUFRO0tBQUs7SUFUeEQ7OztPQUdHO0lBQ0ksTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFlLElBQUksT0FBTyxJQUFJLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUU7O0FBeEY5RSw4Q0E4RkM7OztBQTdGQzs7O0dBR0c7QUFDb0IsdUJBQUssR0FBRyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFNUQ7OztHQUdHO0FBQ29CLHVCQUFLLEdBQUcsaUJBQWlCLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRTVEOzs7R0FHRztBQUNvQix1QkFBSyxHQUFHLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUU1RDs7O0dBR0c7QUFDb0IsdUJBQUssR0FBRyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFNUQ7OztHQUdHO0FBQ29CLHVCQUFLLEdBQUcsaUJBQWlCLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRTVEOzs7R0FHRztBQUNvQix1QkFBSyxHQUFHLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUU1RDs7O0dBR0c7QUFDb0IsdUJBQUssR0FBRyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFNUQ7O0dBRUc7QUFDb0IsdUJBQUssR0FBRyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFNUQ7Ozs7OztHQU1HO0FBQ29CLHVCQUFLLEdBQUcsaUJBQWlCLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRTVEOzs7Ozs7R0FNRztBQUNvQix1QkFBSyxHQUFHLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUU1RDs7Ozs7O0dBTUc7QUFDb0IsdUJBQUssR0FBRyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFNUQ7Ozs7OztHQU1HO0FBQ29CLHVCQUFLLEdBQUcsaUJBQWlCLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBYzlEOztHQUVHO0FBQ0gsSUFBWSxtQkFxQlg7QUFyQkQsV0FBWSxtQkFBbUI7SUFDN0I7O09BRUc7SUFDSCxrQ0FBVyxDQUFBO0lBQ1g7O09BRUc7SUFDSCxzQ0FBZSxDQUFBO0lBQ2Y7O09BRUc7SUFDSCxzREFBK0IsQ0FBQTtJQUMvQjs7T0FFRztJQUNILCtEQUF3QyxDQUFBO0lBQ3hDOztPQUVHO0lBQ0gsOENBQXVCLENBQUE7QUFDekIsQ0FBQyxFQXJCVyxtQkFBbUIsR0FBbkIsMkJBQW1CLEtBQW5CLDJCQUFtQixRQXFCOUI7QUFFRCxNQUFlLFdBQVksU0FBUSxlQUFRO0lBOEJ6Qzs7Ozs7Ozs7T0FRRztJQUNJLFdBQVcsQ0FBQyxFQUFVLEVBQUUsR0FBRyxRQUErQjtRQUMvRCxPQUFPLElBQUksaUNBQWtCLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7S0FDcEY7SUFFRDs7Ozs7O09BTUc7SUFDSSxZQUFZLENBQUMsRUFBVSxFQUFFLE9BQXlCO1FBQ3ZELE9BQU8sSUFBSSxzQkFBUyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxHQUFHLE9BQU8sRUFBRSxDQUFDLENBQUM7S0FDMUU7SUFFRDs7Ozs7O09BTUc7SUFDSSxhQUFhLENBQUMsRUFBVSxFQUFFLEtBQWdCLEVBQUUsVUFBcUMsRUFBRTtRQUV4RixNQUFNLFVBQVUsR0FBRyxLQUFZLENBQUM7UUFFaEMsbUZBQW1GO1FBQ25GLElBQUksT0FBTyxVQUFVLENBQUMsTUFBTSxLQUFLLFVBQVUsRUFBRTtZQUMzQyxNQUFNLElBQUksS0FBSyxDQUFDLGtFQUFrRSxPQUFPLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1NBQy9HO1FBRUQsTUFBTSxRQUFRLEdBQUcsSUFBSSxpQ0FBa0IsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQ2hELE9BQU8sRUFBRSxJQUFJO1lBQ2IsUUFBUSxFQUFFLFVBQVUsQ0FBQyxNQUFNLEVBQUU7WUFDN0IsR0FBRyxPQUFPO1NBQ1gsQ0FBQyxDQUFDO1FBRUgsT0FBTyxRQUFRLENBQUM7S0FDakI7SUFFTSxpQkFBaUIsQ0FBQyxFQUFVLEVBQUUsVUFBaUMsRUFBRTtRQUN0RSxPQUFPLElBQUksZ0NBQWMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQ2xDLEdBQUcsT0FBTztZQUNWLE9BQU8sRUFBRSxJQUFJO1NBQ2QsQ0FBQyxDQUFDO0tBQ0o7SUFFRDs7O09BR0c7SUFDSyx1QkFBdUI7UUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRTtZQUMvQixJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyx3QkFBd0IsRUFBRTtnQkFDdkUsS0FBSyxFQUFFLDhCQUE4QjtnQkFDckMsT0FBTyxFQUFFLFFBQVE7Z0JBQ2pCLFVBQVUsRUFBRSxrQ0FBa0M7Z0JBQzlDLFNBQVMsRUFBRSxhQUFhO2dCQUN4QixNQUFNLEVBQUU7b0JBQ04sWUFBWSxFQUFFO3dCQUNaLFNBQVMsRUFBRSwwQkFBYyxDQUFDLElBQUk7cUJBQy9CO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxPQUFPLElBQUksQ0FBQyxxQkFBcUIsQ0FBQztLQUNuQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BbUJHO0lBQ0ksK0JBQStCLENBQUMsZ0JBQThDLEVBQUUsT0FBZ0M7UUFDckgsYUFBYTtRQUNiLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBRXBFLHlCQUF5QjtRQUN6QixnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2hFLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBRTdFLG9DQUFvQztRQUNwQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRTlELGtDQUFrQztRQUNsQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUMvRCxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUMvRCxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUVoRSxvR0FBb0c7UUFDcEcsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFFN0QsTUFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDO1FBQzFELElBQUksT0FBTyxDQUFDLGdCQUFnQixJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDakQsTUFBTSxJQUFJLEtBQUssQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDO1NBQ3JGO1FBRUQsSUFBSSxnQkFBZ0IsRUFBRTtZQUNwQixNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLEtBQUssZ0JBQWdCLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQzNFLHNDQUEwQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLHFDQUF5QixDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUM5RSxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQztTQUMzQztRQUVELGdCQUFnQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDLDJCQUEyQixDQUFDLENBQUMsQ0FBQztRQUNoSCxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7UUFDM0csZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsb0NBQW9DLENBQUMsQ0FBQyxDQUFDO1FBRXpILG9CQUFvQjtRQUNwQiwrREFBK0Q7UUFDL0QsV0FBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRTtZQUNsRix3QkFBd0IsRUFBRSxJQUFJO1lBQzlCLHFFQUFxRTtZQUNyRSxvREFBb0Q7WUFDcEQsb0JBQW9CLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQztTQUNsRCxDQUFDLENBQUM7UUFFSCxzRUFBc0U7UUFDdEUsMEVBQTBFO1FBQzFFLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDO1FBQ3RDLElBQUksT0FBTyxJQUFJLENBQUMsQ0FBQyxJQUFJLFlBQVksT0FBTyxDQUFDLEVBQUU7WUFDekMsb0JBQW9CO1lBQ3BCLGtCQUFXLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLENBQUMsVUFBVSxDQUFDLDRGQUE0RixDQUFDLENBQUM7WUFDMUksT0FBTyxHQUFHLEtBQUssQ0FBQztTQUNqQjtRQUNELElBQUksT0FBTyxFQUFFO1lBQ1gsZ0ZBQWdGO1lBQ2hGLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRTtnQkFDakQsUUFBUSxFQUFFLG1DQUFtQztnQkFDN0MsTUFBTSxFQUFFO29CQUNOLHNCQUFzQjtvQkFDdEIsY0FBYztpQkFDZjthQUNGLENBQUMsQ0FBQztTQUNKO2FBQU07WUFDTCxvRUFBb0U7WUFDcEUscURBQXFEO1lBQ3JELElBQUksZ0JBQVMsQ0FBQyxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBRTtnQkFDakQsS0FBSyxFQUFFLGdCQUFnQixDQUFDLElBQUksQ0FBQyxPQUFPO2FBQ3JDLENBQUMsQ0FBQztTQUNKO1FBRUQsTUFBTSx1QkFBdUIsR0FBRyxPQUFPLENBQUMsb0JBQW9CLElBQUksSUFBSSxDQUFDO1FBQ3JFLDBHQUEwRztRQUMxRyxJQUFJLGdCQUFnQixDQUFDLFNBQVMsSUFBSSx1QkFBdUIsRUFBRTtZQUN6RCxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztTQUNoQztRQUVELElBQUksSUFBSSxZQUFZLE9BQU8sSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ2pELHlEQUF5RDtZQUN6RCxvQ0FBb0M7WUFDcEMsaUJBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1NBQzdEO0tBQ0Y7Q0FDRjtBQTBCOEYsQ0FBQztBQUVoRzs7Ozs7R0FLRztBQUNILE1BQWEsT0FBUSxTQUFRLFdBQVc7SUE2TnRDOzs7Ozs7T0FNRztJQUNILFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBbUI7UUFDM0QsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDZixZQUFZLEVBQUUsS0FBSyxDQUFDLFdBQVc7U0FDaEMsQ0FBQyxDQUFDO1FBcEdMOzs7V0FHRztRQUNjLHFCQUFnQixHQUFxQixFQUFFLENBQUM7Ozs7OzsrQ0F2STlDLE9BQU87Ozs7UUF5T2hCLE1BQU0sS0FBSyxHQUFHLFlBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFN0IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQztRQUNqQyxJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLElBQUksSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztRQUV4RCxNQUFNLGNBQWMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUM7UUFDdkUsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUU7WUFDL0Qsa0JBQVcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLGlEQUFpRCxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sb1JBQW9SLGNBQWMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1NBQ3BaO1FBQUEsQ0FBQztRQUNGLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUM3QixJQUFJLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUV2RixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFFbEIsbUVBQW1FO1FBQ25FLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTtZQUNuRCxTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CLENBQUM7WUFDeEQsZUFBZSxFQUFFO2dCQUNmLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsd0JBQXdCLENBQUM7YUFDckU7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLGFBQWEsR0FBRyxLQUFLLENBQUMsYUFBYSxJQUFJLElBQUksR0FBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsMkJBQTJCLEVBQUU7WUFDcEcsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO1lBQ2IsV0FBVyxFQUFFLGtDQUFrQztTQUNoRCxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLElBQUksQ0FBQyxFQUFFLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDO1FBRWxJLE1BQU0seUJBQXlCLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNoRyxJQUFJLHlCQUF5QixDQUFDLElBQUksQ0FBQyxZQUFLLENBQUMsWUFBWSxDQUFDLElBQUkseUJBQXlCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUM5RixNQUFNLElBQUksS0FBSyxDQUFDLG1NQUFtTSxDQUFDLENBQUM7U0FDdE47UUFFRCx5Q0FBeUM7UUFDekMsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFMUUsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUNwQyxjQUFjLEVBQUU7Z0JBQ2Q7b0JBQ0UsT0FBTyxFQUFFLElBQUk7b0JBQ2IsS0FBSyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQztpQkFDM0M7YUFDRjtTQUNGLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUVkLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDLGNBQWMsSUFBSSxjQUFjLENBQUMsa0JBQWtCLENBQUM7UUFDaEYsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQztRQUNuRCxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUM7UUFDdkMsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQztRQUV6QyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUM7UUFDdkMsSUFBSSxDQUFDLDJCQUEyQixHQUFHLEtBQUssQ0FBQywyQkFBMkIsQ0FBQztRQUVyRSxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2hFLE1BQU0sb0JBQW9CLEdBQUcsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUM7UUFDdkUsTUFBTSxzQkFBc0IsR0FBRyxDQUFDLG9CQUFvQjtlQUMvQyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxXQUFXO2VBQ3ZDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO1FBRTFELHlDQUF5QztRQUV6QyxJQUFJLGNBQWMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLG9CQUFvQixFQUFFO1lBQ3ZELDJEQUEyRDtZQUMzRCxNQUFNLElBQUksS0FBSyxDQUFDLDBFQUEwRSxDQUFDLENBQUM7U0FDN0Y7UUFFRCxJQUFJLGNBQWMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLHNCQUFzQixFQUFFO1lBQ3pELCtEQUErRDtZQUMvRCxNQUFNLElBQUksS0FBSyxDQUFDLDRFQUE0RSxDQUFDLENBQUM7U0FDL0Y7UUFFRCxNQUFNLHdCQUF3QixHQUFHLEtBQUssQ0FBQyx3QkFBd0IsSUFBSSxLQUFLLENBQUM7UUFFekUsSUFBSSx3QkFBd0IsSUFBSSxjQUFjLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUMzRCxNQUFNLElBQUksS0FBSyxDQUFDLG9GQUFvRixDQUFDLENBQUM7U0FDdkc7UUFFRCxJQUFJLEtBQUssQ0FBQywyQkFBMkIsSUFBSSxDQUFDLHdCQUF3QixFQUFFO1lBQ2xFLE1BQU0sSUFBSSxLQUFLLENBQUMseUZBQXlGLENBQUMsQ0FBQztTQUM1RztRQUVELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLGtDQUFlLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUM3RSxJQUFJLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDdkIsV0FBVyxFQUFFLEtBQUssQ0FBQyx5QkFBeUI7WUFDNUMsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTztZQUMxQixPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPO1lBQzlCLGtCQUFrQixFQUFFO2dCQUNsQixnQkFBZ0IsRUFBRSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUM7Z0JBQ2pELFNBQVM7YUFDVjtZQUNELEdBQUcsQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixnQkFBZ0IsRUFBRSxDQUFDO3dCQUNqQixRQUFRLEVBQUU7NEJBQ1IsTUFBTSxFQUFFLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNO3lCQUMxQzt3QkFDRCxTQUFTLEVBQUUsQ0FBQyxTQUFTLENBQUM7cUJBQ3ZCLENBQUM7YUFDSCxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDUCx1QkFBdUIsRUFBRSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztnQkFDL0MsZUFBZSxFQUFFLEtBQUssQ0FBQyxlQUFlO2FBQ3ZDLENBQUMsQ0FBQyxDQUFDLFNBQVM7WUFDYixxQkFBcUIsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxhQUFhO1lBQ2hFLG9CQUFvQixFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFlBQVk7WUFDOUQsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsV0FBVztZQUMxRCxvQkFBb0IsRUFBRSxLQUFLLENBQUMsb0JBQW9CO1lBQ2hELEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztZQUNiLE9BQU8sRUFBRSx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxTQUFTO1lBQzlELDJCQUEyQixFQUFFLElBQUksQ0FBQywyQkFBMkI7WUFDN0QsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO1lBQy9CLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtZQUNoQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87U0FDdEIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxhQUFhLElBQUksY0FBYyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFFNUUsK0VBQStFO1lBQy9FLG9GQUFvRjtZQUVwRiwrR0FBK0c7WUFDL0csSUFBSSxJQUFJLENBQUMsR0FBRyxZQUFZLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsbUJBQW1CLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO2dCQUNoRyxNQUFNLElBQUksS0FBSyxDQUFDLDRLQUE0SyxDQUFDLENBQUM7YUFDL0w7WUFFRCxJQUFJLENBQUMscUJBQXFCLEdBQUcsY0FBYyxDQUFDO1lBRTVDLDhGQUE4RjtZQUM5RixxQkFBcUI7WUFDckIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3BEO1FBRUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDO1FBRXBDLG1FQUFtRTtRQUNuRSxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxrQkFBVyxDQUFDLElBQUksRUFBRSxxQkFBcUIsRUFBRTtZQUN2RSxJQUFJLEVBQUUscUJBQXFCO1lBQzNCLFVBQVUsRUFBRTtnQkFDVixJQUFJLEVBQUUsUUFBUTtnQkFDZCxLQUFLLEVBQUUsMkJBQTJCO2FBQ25DO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsaUVBQWlFO1FBQ2pFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBRXBFLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvRCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLHVDQUFvQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBRTFHLElBQUksQ0FBQyxlQUFlLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQztRQUM3QyxJQUFJLENBQUMsK0JBQStCLEdBQUcsUUFBUSxDQUFDLDRCQUE0QixDQUFDO1FBQzdFLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxRQUFRLENBQUMsMEJBQTBCLENBQUM7UUFDbEUsSUFBSSxDQUFDLDZCQUE2QixHQUFHLFFBQVEsQ0FBQywwQkFBMEIsQ0FBQztRQUV6RSxJQUFJLENBQUMsb0JBQW9CLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFFN0gsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxXQUFXLENBQUM7WUFDckMsY0FBYyxFQUFFLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLGFBQWEsQ0FBQztZQUMxRCxXQUFXLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO1NBQy9CLENBQUMsQ0FBQztRQUVILGtGQUFrRjtRQUNsRixtREFBbUQ7UUFDbkQsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQztRQUV0RCwrRkFBK0Y7UUFDL0YsdUZBQXVGO1FBQ3ZGLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUVsQyxJQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFFN0QsTUFBTSx5QkFBeUIsR0FBRyxvQ0FBb0MsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3pGLE1BQU0scUJBQXFCLEdBQUcsb0NBQW9DLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyRixNQUFNLG9CQUFvQixHQUFHLENBQUMsWUFBWSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUUxRCxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsRUFBRTtZQUMzQixJQUFJLGdCQUFTLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztTQUNqRTtRQUVELHdFQUF3RTtRQUN4RSwwRUFBMEU7UUFDMUUsVUFBVTtRQUNWLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDekUsU0FBUyxFQUFFLElBQUksR0FBRyxDQUFDLG9CQUFvQixFQUFFO1NBQzFDLENBQUMsQ0FBQztRQUVILGtEQUFrRDtRQUNsRCxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUV6QyxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsRUFBRTtZQUM5QixJQUFJLGdCQUFTLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFLEVBQUUsS0FBSyxFQUFFLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1NBQ3ZFO1FBRUQsb0JBQW9CLENBQUMsSUFBSSxDQUFDLGNBQWMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFFL0QsSUFBSSxLQUFLLENBQUMsYUFBYSxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxhQUFhLEdBQUcsOEJBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsR0FBRyxLQUFLLENBQUMsYUFBYSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1NBQzVGO1FBRUQsc0RBQXNEO1FBQ3RELE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxlQUFlLElBQUksc0JBQXNCLENBQUM7UUFDcEUsSUFBSSxXQUFXLEdBQUcsQ0FBQyxFQUFFO1lBQ25CLE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyx1QkFBdUIsSUFBSSxxQkFBcUIsQ0FBQztZQUM1RSxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxtQkFBbUIsS0FBSyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDNUUsSUFBSSxDQUFDLDJCQUEyQixDQUFDLGlCQUFpQixFQUFFLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztZQUVqRyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLG1CQUFtQixLQUFLLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM3RSxJQUFJLENBQUMsb0JBQW9CLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxhQUFhLEVBQUUsQ0FBQyxZQUFZLENBQUMsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1NBQ3JIO1FBRUQsTUFBTSxtQkFBbUIsR0FBRyxLQUFLLENBQUMsbUJBQW1CLElBQUksSUFBSSxDQUFDO1FBQzlELElBQUksbUJBQW1CLEVBQUU7WUFDdkIsTUFBTSxPQUFPLEdBQUcsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQy9DLElBQUksZ0JBQVMsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcseUJBQXlCLElBQUksT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzNGLElBQUksZ0JBQVMsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxxQkFBcUIsSUFBSSxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDMUY7UUFFRCxJQUFJLENBQUMsd0JBQXdCLENBQUMsS0FBSyxDQUFDLGtCQUFrQixJQUFJLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBRW5GO0lBbmNEOzs7Ozs7T0FNRztJQUNJLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF3Qjs7Ozs7Ozs7OztRQUN4RixPQUFPLElBQUksZUFBZSxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDOUM7SUE0YkQ7Ozs7O09BS0c7SUFDSSw2QkFBNkIsQ0FBQyxXQUFtQixFQUFFLFVBQTZDLEVBQUU7Ozs7Ozs7Ozs7UUFFdkcsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLHdDQUFxQixDQUFDLElBQUksRUFBRSxHQUFHLFdBQVcscUJBQXFCLEVBQUU7WUFDL0YsT0FBTyxFQUFFLElBQUk7WUFDYixVQUFVLEVBQUUsU0FBUztZQUNyQixVQUFVLEVBQUUsV0FBVztZQUN2QixlQUFlLEVBQUUsT0FBTyxDQUFDLFNBQVM7WUFDbEMsUUFBUSxFQUFFLDBDQUEwQztZQUNwRCxPQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU87U0FDekIsQ0FBQyxDQUFDO1FBRUgsT0FBTyxtQkFBbUIsQ0FBQyxLQUFLLENBQUM7S0FFbEM7SUFFRDs7Ozs7T0FLRztJQUNJLDZCQUE2QixDQUFDLFdBQW1CLEVBQUUsVUFBNkMsRUFBRTs7Ozs7Ozs7OztRQUV2RyxNQUFNLG1CQUFtQixHQUFHLElBQUksd0NBQXFCLENBQUMsSUFBSSxFQUFFLEdBQUcsV0FBVyxxQkFBcUIsRUFBRTtZQUMvRixPQUFPLEVBQUUsSUFBSTtZQUNiLFVBQVUsRUFBRSxTQUFTO1lBQ3JCLFVBQVUsRUFBRSxXQUFXO1lBQ3ZCLGVBQWUsRUFBRSxPQUFPLENBQUMsU0FBUztZQUNsQyxRQUFRLEVBQUUsMENBQTBDO1lBQ3BELE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTztTQUN6QixDQUFDLENBQUM7UUFFSCxPQUFPLG1CQUFtQixDQUFDLEtBQUssQ0FBQztLQUVsQztJQUVEOzs7Ozs7Ozs7Ozs7OztPQWNHO0lBQ0ksMkJBQTJCLENBQUMsRUFBVSxFQUFFLE9BQXdDOzs7Ozs7Ozs7O1FBQ3JGLElBQUksT0FBTyxDQUFDLGdCQUFnQixLQUFLLGdCQUFnQixDQUFDLFlBQVksSUFBSSxPQUFPLENBQUMsZ0JBQWdCLEtBQUssU0FBUyxFQUFFO1lBQ3hHLE1BQU0sSUFBSSxLQUFLLENBQUMsb0RBQW9ELENBQUMsQ0FBQztTQUN2RTtRQUNELE1BQU0sR0FBRyxHQUFHLElBQUksV0FBVyxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxFQUFFLEVBQUU7WUFDckQsR0FBRyxPQUFPO1lBQ1YsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO1lBQ2IsWUFBWSxFQUFFLE9BQU8sQ0FBQyxnQkFBZ0IsS0FBSyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDeEUsSUFBSSxnQ0FBaUIsQ0FBQztvQkFDcEIsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPO2lCQUN4QyxDQUFDLENBQUMsQ0FBQztnQkFDSixJQUFJLGlCQUFpQixDQUFDO29CQUNwQixRQUFRLEVBQUUsdUJBQXVCLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQztvQkFDdkQsT0FBTyxFQUFFLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUM7b0JBQ3JELGlCQUFpQixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTztpQkFDeEMsQ0FBQztTQUNMLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQywrQkFBK0IsQ0FBQyxHQUFHLEVBQUU7WUFDeEMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPO1lBQ3hCLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxnQkFBZ0I7WUFDMUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLGdCQUFnQjtZQUMxQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsZ0JBQWdCO1lBQzFDLG9CQUFvQixFQUFFLE9BQU8sQ0FBQyxvQkFBb0I7U0FDbkQsQ0FBQyxDQUFDO1FBRUgsSUFBSSx1QkFBdUIsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEtBQUssUUFBUSxDQUFDLFVBQVUsRUFBRTtZQUN6RSxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztTQUM5QjtRQUVELE9BQU8sR0FBRyxDQUFDO0tBQ1o7SUFFRDs7Ozs7Ozs7T0FRRztJQUNJLG9CQUFvQixDQUFDLEVBQVUsRUFBRSxPQUEwQjs7Ozs7Ozs7OztRQUNoRSxPQUFPLElBQUksNkJBQVMsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLEVBQUUsRUFBRTtZQUMzQyxPQUFPLEVBQUUsSUFBSTtZQUNiLEdBQUcsT0FBTztTQUNYLENBQUMsQ0FBQztLQUNKO0lBRUQ7O09BRUc7SUFDSCxJQUFXLE9BQU87UUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLGtCQUFPLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1NBQ2pFO1FBRUQsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0tBQ3RCO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsSUFBVyw2QkFBNkI7UUFDdEMsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsMEJBQTBCLENBQUM7S0FDekQ7SUFFRDs7Ozs7O09BTUc7SUFDSCxJQUFXLDBCQUEwQjtRQUNuQyxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyx1QkFBdUIsQ0FBQztLQUN0RDtJQUVEOzs7OztPQUtHO0lBQ0gsSUFBVyxxQkFBcUI7UUFDOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRTtZQUNoQyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxxQ0FBcUIsQ0FBQyxJQUFJLEVBQUUsdUJBQXVCLEVBQUU7Z0JBQ3JGLEdBQUcsRUFBRSxJQUFJLENBQUMsNkJBQTZCO2FBQ3hDLENBQUMsQ0FBQztTQUNKO1FBRUQsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUM7S0FDcEM7SUFFRDs7Ozs7O09BTUc7SUFDSSxpQkFBaUIsQ0FBQyxFQUFVLEVBQUUsT0FBOEI7Ozs7Ozs7Ozs7UUFDakUsT0FBTyxJQUFJLGdDQUFjLENBQUMsSUFBSSxFQUFFLG1CQUFtQixFQUFFLEVBQUUsRUFBRTtZQUN2RCxHQUFHLE9BQU87WUFDVixPQUFPLEVBQUUsSUFBSTtTQUNkLENBQUMsQ0FBQztLQUNKO0lBRUQ7Ozs7OztPQU1HO0lBQ0kscUJBQXFCLENBQUMsY0FBOEI7UUFDekQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUUzQyx1RkFBdUY7UUFDdkYseUVBQXlFO1FBQ3pFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRTdELE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDO0tBQzlCO0lBRUQ7Ozs7Ozs7Ozs7T0FVRztJQUNJLDJCQUEyQixDQUFDLGFBQXdCO1FBQ3pELGlCQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUNoRSxPQUFPLElBQUksQ0FBQyx3QkFBd0IsQ0FBQztLQUN0QztJQUVPLHFCQUFxQjtRQUMzQixNQUFNLEdBQUcsR0FBRyxrQ0FBa0MsQ0FBQztRQUUvQyx3RUFBd0U7UUFDeEUsMkVBQTJFO1FBQzNFLDhDQUE4QztRQUM5QyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNyQyxNQUFNLElBQUksS0FBSyxDQUFDLHdFQUF3RSxDQUFDLENBQUM7U0FDM0Y7UUFFRCxPQUFPLElBQUksa0NBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0tBQ2hFO0lBRU8sb0JBQW9CO1FBQzFCLE1BQU0sY0FBYyxHQUFrQixFQUFFLENBQUM7UUFDekMsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDekUsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFdkUsS0FBSyxNQUFNLFNBQVMsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBRXZDLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxFQUFFO2dCQUU5RCxJQUFJLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUU7b0JBQ2pELCtCQUErQjtvQkFDL0IsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDNUIsU0FBUztpQkFDVjtnQkFFRCxJQUFJLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUU7b0JBQ2hELDhCQUE4QjtvQkFDOUIsU0FBUztpQkFDVjtnQkFFRCxnSEFBZ0g7Z0JBQ2hILHVIQUF1SDtnQkFDdkgsNEdBQTRHO2dCQUM1RyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQzdCO1NBRUY7UUFFRCxPQUFPLGNBQWMsQ0FBQztLQUN2QjtJQUVEOzs7T0FHRztJQUNLLHFCQUFxQjtRQUMzQixJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFO1lBQzdCLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsa0NBQWtDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUN2RyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzNDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLG9CQUFvQixFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQzlFO1FBRUQsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUM7S0FDakM7SUFFRDs7Ozs7O09BTUc7SUFDSyxVQUFVO1FBQ2hCLE1BQU0sYUFBYSxHQUFHLENBQUMsSUFBWSxFQUFFLE9BQXNCLEVBQUUsR0FBVyxFQUFFLEVBQUU7WUFDMUUsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7Z0JBQzVCLCtEQUErRDtnQkFDL0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFO29CQUNuQyw2RUFBNkU7b0JBQzdFLHVGQUF1RjtvQkFDdkYsTUFBTSxRQUFRLEdBQUcsWUFBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksWUFBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUMzSCxrQkFBVyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsc0JBQXNCLElBQUksVUFBVSxRQUFRLFVBQVUsR0FBRywwQ0FBMEMsQ0FBQyxDQUFDO29CQUNySSxTQUFTO2lCQUNWO2dCQUVELFdBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzthQUMvQjtRQUNILENBQUMsQ0FBQztRQUVGLHFFQUFxRTtRQUNyRSxhQUFhLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLGlDQUFpQyxDQUFDLENBQUM7UUFDckYsYUFBYSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO0tBQzNFO0lBRUQ7Ozs7T0FJRztJQUNLLHdCQUF3QixDQUFDLElBQXdCO1FBQ3ZELHNFQUFzRTtRQUN0RSx1RUFBdUU7UUFDdkUsd0VBQXdFO1FBQ3hFLDhEQUE4RDtRQUM5RCxJQUFJLElBQUksS0FBSyxrQkFBa0IsQ0FBQyxHQUFHLEVBQUU7WUFDbkMsT0FBTztTQUNSO1FBRUQsa0VBQWtFO1FBQ2xFLG1HQUFtRztRQUNuRyxNQUFNLFdBQVcsR0FBRyxDQUFDLFdBQStCLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDeEQsSUFBSSxFQUFFO2dCQUNKLFFBQVEsRUFBRTtvQkFDUixRQUFRLEVBQUU7d0JBQ1IsV0FBVyxFQUFFOzRCQUNYLGdDQUFnQyxFQUFFLFdBQVc7eUJBQzlDO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLDJCQUFlLENBQUMsSUFBSSxFQUFFLHlCQUF5QixFQUFFO1lBQ25ELE9BQU8sRUFBRSxJQUFJO1lBQ2IsWUFBWSxFQUFFLG9CQUFvQjtZQUNsQyxpQkFBaUIsRUFBRSxhQUFhO1lBQ2hDLFVBQVUsRUFBRSxXQUFXLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDO1lBQ25ELFlBQVksRUFBRSxXQUFXLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDO1NBQ2xELENBQUMsQ0FBQztLQUNKOztBQXp3QkgsMEJBMHdCQzs7O0FBc0tEOztHQUVHO0FBQ0gsTUFBTSxlQUFnQixTQUFRLFdBQVc7SUFxQnZDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQW1CLEtBQXdCO1FBQ2pGLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFEd0MsVUFBSyxHQUFMLEtBQUssQ0FBbUI7UUFsQm5FLGdCQUFXLEdBQUcsSUFBSSxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7UUFxQmxELElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztRQUNyQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLHVDQUFvQixDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQ2hGLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUN0SCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDO1FBQ2pELElBQUksQ0FBQyxvQkFBb0IsR0FBRyxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLHNCQUFzQixFQUFFLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDekssSUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQztRQUNuRCxJQUFJLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsdUJBQXVCLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLGdCQUFnQixLQUFLLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDbE0sSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztRQUNyQyxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUM7UUFDekMsSUFBSSxDQUFDLDJCQUEyQixHQUFHLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsNkJBQTZCLEVBQUUsS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUNyTSxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUM7UUFDN0MsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUM7UUFFakMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLENBQUMsZ0JBQWdCLElBQUksRUFBRSxFQUFFO1lBQy9DLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDMUcsQ0FBQyxFQUFFLENBQUM7U0FDTDtRQUVELElBQUksS0FBSyxDQUFDLHNCQUFzQixFQUFFO1lBQ2hDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxzQkFBc0IsRUFBRSxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUM5SCxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1NBQy9EO0tBQ0Y7SUFFRCxJQUFXLEdBQUc7UUFDWixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUU7WUFDbkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO1NBQ25FO1FBQ0QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztLQUN2QjtJQUVELElBQVcsb0JBQW9CO1FBQzdCLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUU7WUFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxpRUFBaUUsQ0FBQyxDQUFDO1NBQ3BGO1FBQ0QsT0FBTyxJQUFJLENBQUMscUJBQXFCLENBQUM7S0FDbkM7SUFFRCxJQUFXLHNCQUFzQjtRQUMvQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsRUFBRTtZQUN0QyxNQUFNLElBQUksS0FBSyxDQUFDLG1FQUFtRSxDQUFDLENBQUM7U0FDdEY7UUFDRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUM7S0FDMUM7SUFFRCxJQUFXLGVBQWU7UUFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFO1lBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsNERBQTRELENBQUMsQ0FBQztTQUMvRTtRQUNELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUM7S0FDbkM7SUFFRCxJQUFXLCtCQUErQjtRQUN4QyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQywrQkFBK0IsRUFBRTtZQUMvQyxNQUFNLElBQUksS0FBSyxDQUFDLDRFQUE0RSxDQUFDLENBQUM7U0FDL0Y7UUFDRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsK0JBQStCLENBQUM7S0FDbkQ7SUFFRCxJQUFXLDZCQUE2QjtRQUN0QyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRTtZQUM3QyxNQUFNLElBQUksS0FBSyxDQUFDLDBFQUEwRSxDQUFDLENBQUM7U0FDN0Y7UUFDRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsNkJBQTZCLENBQUM7S0FDakQ7SUFFRCxJQUFXLHFCQUFxQjtRQUM5QixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsRUFBRTtZQUNyQyxNQUFNLElBQUksS0FBSyxDQUFDLGtFQUFrRSxDQUFDLENBQUM7U0FDckY7UUFDRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUM7S0FDekM7SUFFRCxJQUFXLE9BQU87UUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO0tBQ3BFO0NBQ0Y7QUE0QkQ7O0dBRUc7QUFDSCxNQUFhLGlCQUFpQjtJQU01Qjs7T0FFRztJQUNILFlBQW1CLFFBQWdDLEVBQUU7Ozs7OzsrQ0FUMUMsaUJBQWlCOzs7O1FBVTFCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDO1FBQ3BELElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQy9DLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUMsaUJBQWlCLElBQUkseUJBQXlCLENBQUM7UUFFOUUsNkJBQTZCO1FBQzdCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxrQ0FBa0MsSUFBSSxDQUFDLGlCQUFpQixHQUFHO2NBQy9FLENBQUMsSUFBSSxDQUFDLFFBQVEsS0FBSyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxLQUFLLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDeEUsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7Y0FDakQsQ0FBQyxJQUFJLENBQUMsUUFBUSxLQUFLLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7Y0FDN0QsQ0FBQyxJQUFJLENBQUMsUUFBUSxLQUFLLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7Y0FDcEUsc0JBQXNCLENBQUM7S0FDNUI7SUFFRDs7T0FFRztJQUNJLFFBQVEsQ0FBQyxLQUFnQjtRQUM5QixNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLHVCQUF1QixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUN0RixPQUFPO1lBQ0wsT0FBTyxFQUFFLEdBQUc7WUFDWixNQUFNLEVBQUUsR0FBRyxDQUFDLG1CQUFtQixDQUFDLEtBQUs7WUFDckMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFO1NBQ2xDLENBQUM7S0FDSDs7QUFqQ0gsOENBa0NDOzs7QUFFRCw4RUFBOEU7QUFDOUUsTUFBTSx5QkFBeUIsR0FBRyxNQUFNLENBQUM7QUFFekM7O0dBRUc7QUFDSCxJQUFZLFFBZVg7QUFmRCxXQUFZLFFBQVE7SUFDbEI7O09BRUc7SUFDSCxpQ0FBcUIsQ0FBQTtJQUVyQjs7T0FFRztJQUNILHVCQUFXLENBQUE7SUFFWDs7T0FFRztJQUNILHFDQUF5QixDQUFBO0FBQzNCLENBQUMsRUFmVyxRQUFRLEdBQVIsZ0JBQVEsS0FBUixnQkFBUSxRQWVuQjtBQUVEOztHQUVHO0FBQ0gsSUFBWSxPQVVYO0FBVkQsV0FBWSxPQUFPO0lBQ2pCOztPQUVHO0lBQ0gsMkJBQWdCLENBQUE7SUFFaEI7O09BRUc7SUFDSCw0QkFBaUIsQ0FBQTtBQUNuQixDQUFDLEVBVlcsT0FBTyxHQUFQLGVBQU8sS0FBUCxlQUFPLFFBVWxCO0FBRUQ7O0dBRUc7QUFDSCxJQUFZLGtCQVVYO0FBVkQsV0FBWSxrQkFBa0I7SUFDNUI7O09BRUc7SUFDSCxpQ0FBVyxDQUFBO0lBRVg7O09BRUc7SUFDSCx5Q0FBbUIsQ0FBQTtBQUNyQixDQUFDLEVBVlcsa0JBQWtCLEdBQWxCLDBCQUFrQixLQUFsQiwwQkFBa0IsUUFVN0I7QUFFRDs7R0FFRztBQUNILElBQVksbUJBU1g7QUFURCxXQUFZLG1CQUFtQjtJQUM3Qjs7T0FFRztJQUNILHVFQUFTLENBQUE7SUFDVDs7T0FFRztJQUNILDJEQUFHLENBQUE7QUFDTCxDQUFDLEVBVFcsbUJBQW1CLEdBQW5CLDJCQUFtQixLQUFuQiwyQkFBbUIsUUFTOUI7QUFFRDs7R0FFRztBQUNILElBQVksZ0JBU1g7QUFURCxXQUFZLGdCQUFnQjtJQUMxQjs7T0FFRztJQUNILDJFQUFjLENBQUE7SUFDZDs7T0FFRztJQUNILHVFQUFZLENBQUE7QUFDZCxDQUFDLEVBVFcsZ0JBQWdCLEdBQWhCLHdCQUFnQixLQUFoQix3QkFBZ0IsUUFTM0I7QUFFRCxTQUFTLHVCQUF1QixDQUFDLFlBQThCO0lBQzdELE9BQU8sK0JBQWMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMxRiwrQkFBYyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ2pHLFFBQVEsQ0FBQyxRQUFRLENBQUM7QUFDeEIsQ0FBQztBQUVELFNBQVMsc0JBQXNCLENBQUMsWUFBOEI7SUFDNUQsT0FBTywrQkFBYyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2xHLCtCQUFjLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDM0YsK0JBQWMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDMUYsT0FBTyxDQUFDLE1BQU0sQ0FBQztBQUN2QixDQUFDO0FBRUQsU0FBUyxPQUFPLENBQUksR0FBVTtJQUM1QixPQUFPLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNqRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGF1dG9zY2FsaW5nIGZyb20gJ0Bhd3MtY2RrL2F3cy1hdXRvc2NhbGluZyc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBrbXMgZnJvbSAnQGF3cy1jZGsvYXdzLWttcyc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBzc20gZnJvbSAnQGF3cy1jZGsvYXdzLXNzbSc7XG5pbXBvcnQgeyBBbm5vdGF0aW9ucywgQ2ZuT3V0cHV0LCBDZm5SZXNvdXJjZSwgSVJlc291cmNlLCBSZXNvdXJjZSwgU3RhY2ssIFRhZ3MsIFRva2VuLCBEdXJhdGlvbiwgU2l6ZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0LCBOb2RlIH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBzZW12ZXIgZnJvbSAnc2VtdmVyJztcbmltcG9ydCAqIGFzIFlBTUwgZnJvbSAneWFtbCc7XG5pbXBvcnQgeyBBbGJDb250cm9sbGVyLCBBbGJDb250cm9sbGVyT3B0aW9ucyB9IGZyb20gJy4vYWxiLWNvbnRyb2xsZXInO1xuaW1wb3J0IHsgQXdzQXV0aCB9IGZyb20gJy4vYXdzLWF1dGgnO1xuaW1wb3J0IHsgQ2x1c3RlclJlc291cmNlLCBjbHVzdGVyQXJuQ29tcG9uZW50cyB9IGZyb20gJy4vY2x1c3Rlci1yZXNvdXJjZSc7XG5pbXBvcnQgeyBGYXJnYXRlUHJvZmlsZSwgRmFyZ2F0ZVByb2ZpbGVPcHRpb25zIH0gZnJvbSAnLi9mYXJnYXRlLXByb2ZpbGUnO1xuaW1wb3J0IHsgSGVsbUNoYXJ0LCBIZWxtQ2hhcnRPcHRpb25zIH0gZnJvbSAnLi9oZWxtLWNoYXJ0JztcbmltcG9ydCB7IElOU1RBTkNFX1RZUEVTIH0gZnJvbSAnLi9pbnN0YW5jZS10eXBlcyc7XG5pbXBvcnQgeyBLdWJlcm5ldGVzTWFuaWZlc3QsIEt1YmVybmV0ZXNNYW5pZmVzdE9wdGlvbnMgfSBmcm9tICcuL2s4cy1tYW5pZmVzdCc7XG5pbXBvcnQgeyBLdWJlcm5ldGVzT2JqZWN0VmFsdWUgfSBmcm9tICcuL2s4cy1vYmplY3QtdmFsdWUnO1xuaW1wb3J0IHsgS3ViZXJuZXRlc1BhdGNoIH0gZnJvbSAnLi9rOHMtcGF0Y2gnO1xuaW1wb3J0IHsgSUt1YmVjdGxQcm92aWRlciwgS3ViZWN0bFByb3ZpZGVyIH0gZnJvbSAnLi9rdWJlY3RsLXByb3ZpZGVyJztcbmltcG9ydCB7IE5vZGVncm91cCwgTm9kZWdyb3VwT3B0aW9ucyB9IGZyb20gJy4vbWFuYWdlZC1ub2RlZ3JvdXAnO1xuaW1wb3J0IHsgT3BlbklkQ29ubmVjdFByb3ZpZGVyIH0gZnJvbSAnLi9vaWRjLXByb3ZpZGVyJztcbmltcG9ydCB7IEJvdHRsZVJvY2tldEltYWdlIH0gZnJvbSAnLi9wcml2YXRlL2JvdHRsZXJvY2tldCc7XG5pbXBvcnQgeyBTZXJ2aWNlQWNjb3VudCwgU2VydmljZUFjY291bnRPcHRpb25zIH0gZnJvbSAnLi9zZXJ2aWNlLWFjY291bnQnO1xuaW1wb3J0IHsgTGlmZWN5Y2xlTGFiZWwsIHJlbmRlckFtYXpvbkxpbnV4VXNlckRhdGEsIHJlbmRlckJvdHRsZXJvY2tldFVzZXJEYXRhIH0gZnJvbSAnLi91c2VyLWRhdGEnO1xuXG4vLyBkZWZhdWx0cyBhcmUgYmFzZWQgb24gaHR0cHM6Ly9la3NjdGwuaW9cbmNvbnN0IERFRkFVTFRfQ0FQQUNJVFlfQ09VTlQgPSAyO1xuY29uc3QgREVGQVVMVF9DQVBBQ0lUWV9UWVBFID0gZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5NNSwgZWMyLkluc3RhbmNlU2l6ZS5MQVJHRSk7XG5cbi8qKlxuICogQW4gRUtTIGNsdXN0ZXJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJQ2x1c3RlciBleHRlbmRzIElSZXNvdXJjZSwgZWMyLklDb25uZWN0YWJsZSB7XG4gIC8qKlxuICAgKiBUaGUgVlBDIGluIHdoaWNoIHRoaXMgQ2x1c3RlciB3YXMgY3JlYXRlZFxuICAgKi9cbiAgcmVhZG9ubHkgdnBjOiBlYzIuSVZwYztcblxuICAvKipcbiAgICogVGhlIHBoeXNpY2FsIG5hbWUgb2YgdGhlIENsdXN0ZXJcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgY2x1c3Rlck5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHVuaXF1ZSBBUk4gYXNzaWduZWQgdG8gdGhlIHNlcnZpY2UgYnkgQVdTXG4gICAqIGluIHRoZSBmb3JtIG9mIGFybjphd3M6ZWtzOlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBjbHVzdGVyQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBBUEkgU2VydmVyIGVuZHBvaW50IFVSTFxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBjbHVzdGVyRW5kcG9pbnQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGNlcnRpZmljYXRlLWF1dGhvcml0eS1kYXRhIGZvciB5b3VyIGNsdXN0ZXIuXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGNsdXN0ZXJDZXJ0aWZpY2F0ZUF1dGhvcml0eURhdGE6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGlkIG9mIHRoZSBjbHVzdGVyIHNlY3VyaXR5IGdyb3VwIHRoYXQgd2FzIGNyZWF0ZWQgYnkgQW1hem9uIEVLUyBmb3IgdGhlIGNsdXN0ZXIuXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGNsdXN0ZXJTZWN1cml0eUdyb3VwSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGNsdXN0ZXIgc2VjdXJpdHkgZ3JvdXAgdGhhdCB3YXMgY3JlYXRlZCBieSBBbWF6b24gRUtTIGZvciB0aGUgY2x1c3Rlci5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgY2x1c3RlclNlY3VyaXR5R3JvdXA6IGVjMi5JU2VjdXJpdHlHcm91cDtcblxuICAvKipcbiAgICogQW1hem9uIFJlc291cmNlIE5hbWUgKEFSTikgb3IgYWxpYXMgb2YgdGhlIGN1c3RvbWVyIG1hc3RlciBrZXkgKENNSykuXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGNsdXN0ZXJFbmNyeXB0aW9uQ29uZmlnS2V5QXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBPcGVuIElEIENvbm5lY3QgUHJvdmlkZXIgb2YgdGhlIGNsdXN0ZXIgdXNlZCB0byBjb25maWd1cmUgU2VydmljZSBBY2NvdW50cy5cbiAgICovXG4gIHJlYWRvbmx5IG9wZW5JZENvbm5lY3RQcm92aWRlcjogaWFtLklPcGVuSWRDb25uZWN0UHJvdmlkZXI7XG5cbiAgLyoqXG4gICAqIEFuIElBTSByb2xlIHRoYXQgY2FuIHBlcmZvcm0ga3ViZWN0bCBvcGVyYXRpb25zIGFnYWluc3QgdGhpcyBjbHVzdGVyLlxuICAgKlxuICAgKiBUaGUgcm9sZSBzaG91bGQgYmUgbWFwcGVkIHRvIHRoZSBgc3lzdGVtOm1hc3RlcnNgIEt1YmVybmV0ZXMgUkJBQyByb2xlLlxuICAgKi9cbiAgcmVhZG9ubHkga3ViZWN0bFJvbGU/OiBpYW0uSVJvbGU7XG5cbiAgLyoqXG4gICAqIEN1c3RvbSBlbnZpcm9ubWVudCB2YXJpYWJsZXMgd2hlbiBydW5uaW5nIGBrdWJlY3RsYCBhZ2FpbnN0IHRoaXMgY2x1c3Rlci5cbiAgICovXG4gIHJlYWRvbmx5IGt1YmVjdGxFbnZpcm9ubWVudD86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH07XG5cbiAgLyoqXG4gICAqIEEgc2VjdXJpdHkgZ3JvdXAgdG8gdXNlIGZvciBga3ViZWN0bGAgZXhlY3V0aW9uLlxuICAgKlxuICAgKiBJZiB0aGlzIGlzIHVuZGVmaW5lZCwgdGhlIGs4cyBlbmRwb2ludCBpcyBleHBlY3RlZCB0byBiZSBhY2Nlc3NpYmxlXG4gICAqIHB1YmxpY2x5LlxuICAgKi9cbiAgcmVhZG9ubHkga3ViZWN0bFNlY3VyaXR5R3JvdXA/OiBlYzIuSVNlY3VyaXR5R3JvdXA7XG5cbiAgLyoqXG4gICAqIFN1Ym5ldHMgdG8gaG9zdCB0aGUgYGt1YmVjdGxgIGNvbXB1dGUgcmVzb3VyY2VzLlxuICAgKlxuICAgKiBJZiB0aGlzIGlzIHVuZGVmaW5lZCwgdGhlIGs4cyBlbmRwb2ludCBpcyBleHBlY3RlZCB0byBiZSBhY2Nlc3NpYmxlXG4gICAqIHB1YmxpY2x5LlxuICAgKi9cbiAgcmVhZG9ubHkga3ViZWN0bFByaXZhdGVTdWJuZXRzPzogZWMyLklTdWJuZXRbXTtcblxuICAvKipcbiAgICogQW4gSUFNIHJvbGUgdGhhdCBjYW4gcGVyZm9ybSBrdWJlY3RsIG9wZXJhdGlvbnMgYWdhaW5zdCB0aGlzIGNsdXN0ZXIuXG4gICAqXG4gICAqIFRoZSByb2xlIHNob3VsZCBiZSBtYXBwZWQgdG8gdGhlIGBzeXN0ZW06bWFzdGVyc2AgS3ViZXJuZXRlcyBSQkFDIHJvbGUuXG4gICAqXG4gICAqIFRoaXMgcm9sZSBpcyBkaXJlY3RseSBwYXNzZWQgdG8gdGhlIGxhbWJkYSBoYW5kbGVyIHRoYXQgc2VuZHMgS3ViZSBDdGwgY29tbWFuZHMgdG8gdGhlIGNsdXN0ZXIuXG4gICAqL1xuICByZWFkb25seSBrdWJlY3RsTGFtYmRhUm9sZT86IGlhbS5JUm9sZTtcblxuICAvKipcbiAgICogQW4gQVdTIExhbWJkYSBsYXllciB0aGF0IGluY2x1ZGVzIGBrdWJlY3RsYCBhbmQgYGhlbG1gXG4gICAqXG4gICAqIElmIG5vdCBkZWZpbmVkLCBhIGRlZmF1bHQgbGF5ZXIgd2lsbCBiZSB1c2VkIGNvbnRhaW5pbmcgS3ViZWN0bCAxLjIwIGFuZCBIZWxtIDMuOFxuICAgKi9cbiAgcmVhZG9ubHkga3ViZWN0bExheWVyPzogbGFtYmRhLklMYXllclZlcnNpb247XG5cbiAgLyoqXG4gICAqIEFuIEFXUyBMYW1iZGEgbGF5ZXIgdGhhdCBjb250YWlucyB0aGUgYGF3c2AgQ0xJLlxuICAgKlxuICAgKiBJZiBub3QgZGVmaW5lZCwgYSBkZWZhdWx0IGxheWVyIHdpbGwgYmUgdXNlZCBjb250YWluaW5nIHRoZSBBV1MgQ0xJIDEueC5cbiAgICovXG4gIHJlYWRvbmx5IGF3c2NsaUxheWVyPzogbGFtYmRhLklMYXllclZlcnNpb247XG5cbiAgLyoqXG4gICAqIEt1YmVjdGwgUHJvdmlkZXIgZm9yIGlzc3Vpbmcga3ViZWN0bCBjb21tYW5kcyBhZ2FpbnN0IGl0XG4gICAqXG4gICAqIElmIG5vdCBkZWZpbmVkLCBhIGRlZmF1bHQgcHJvdmlkZXIgd2lsbCBiZSB1c2VkXG4gICAqL1xuICByZWFkb25seSBrdWJlY3RsUHJvdmlkZXI/OiBJS3ViZWN0bFByb3ZpZGVyO1xuXG4gIC8qKlxuICAgKiBBbW91bnQgb2YgbWVtb3J5IHRvIGFsbG9jYXRlIHRvIHRoZSBwcm92aWRlcidzIGxhbWJkYSBmdW5jdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGt1YmVjdGxNZW1vcnk/OiBTaXplO1xuXG4gIC8qKlxuICAgKiBBIHNlY3VyaXR5IGdyb3VwIHRvIGFzc29jaWF0ZSB3aXRoIHRoZSBDbHVzdGVyIEhhbmRsZXIncyBMYW1iZGFzLlxuICAgKiBUaGUgQ2x1c3RlciBIYW5kbGVyJ3MgTGFtYmRhcyBhcmUgcmVzcG9uc2libGUgZm9yIGNhbGxpbmcgQVdTJ3MgRUtTIEFQSS5cbiAgICpcbiAgICogUmVxdWlyZXMgYHBsYWNlQ2x1c3RlckhhbmRsZXJJblZwY2AgdG8gYmUgc2V0IHRvIHRydWUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gc2VjdXJpdHkgZ3JvdXAuXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGNsdXN0ZXJIYW5kbGVyU2VjdXJpdHlHcm91cD86IGVjMi5JU2VjdXJpdHlHcm91cDtcblxuICAvKipcbiAgICogQW4gQVdTIExhbWJkYSBsYXllciB0aGF0IGluY2x1ZGVzIHRoZSBOUE0gZGVwZW5kZW5jeSBgcHJveHktYWdlbnRgLlxuICAgKlxuICAgKiBJZiBub3QgZGVmaW5lZCwgYSBkZWZhdWx0IGxheWVyIHdpbGwgYmUgdXNlZC5cbiAgICovXG4gIHJlYWRvbmx5IG9uRXZlbnRMYXllcj86IGxhbWJkYS5JTGF5ZXJWZXJzaW9uO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgd2hldGhlciBLdWJlcm5ldGVzIHJlc291cmNlcyBjYW4gYmUgYXV0b21hdGljYWxseSBwcnVuZWQuIFdoZW5cbiAgICogdGhpcyBpcyBlbmFibGVkIChkZWZhdWx0KSwgcHJ1bmUgbGFiZWxzIHdpbGwgYmUgYWxsb2NhdGVkIGFuZCBpbmplY3RlZCB0b1xuICAgKiBlYWNoIHJlc291cmNlLiBUaGVzZSBsYWJlbHMgd2lsbCB0aGVuIGJlIHVzZWQgd2hlbiBpc3N1aW5nIHRoZSBga3ViZWN0bFxuICAgKiBhcHBseWAgb3BlcmF0aW9uIHdpdGggdGhlIGAtLXBydW5lYCBzd2l0Y2guXG4gICAqL1xuICByZWFkb25seSBwcnVuZTogYm9vbGVhbjtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBzZXJ2aWNlIGFjY291bnQgd2l0aCBjb3JyZXNwb25kaW5nIElBTSBSb2xlIChJUlNBKS5cbiAgICpcbiAgICogQHBhcmFtIGlkIGxvZ2ljYWwgaWQgb2Ygc2VydmljZSBhY2NvdW50XG4gICAqIEBwYXJhbSBvcHRpb25zIHNlcnZpY2UgYWNjb3VudCBvcHRpb25zXG4gICAqL1xuICBhZGRTZXJ2aWNlQWNjb3VudChpZDogc3RyaW5nLCBvcHRpb25zPzogU2VydmljZUFjY291bnRPcHRpb25zKTogU2VydmljZUFjY291bnQ7XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYSBLdWJlcm5ldGVzIHJlc291cmNlIGluIHRoaXMgY2x1c3Rlci5cbiAgICpcbiAgICogVGhlIG1hbmlmZXN0IHdpbGwgYmUgYXBwbGllZC9kZWxldGVkIHVzaW5nIGt1YmVjdGwgYXMgbmVlZGVkLlxuICAgKlxuICAgKiBAcGFyYW0gaWQgbG9naWNhbCBpZCBvZiB0aGlzIG1hbmlmZXN0XG4gICAqIEBwYXJhbSBtYW5pZmVzdCBhIGxpc3Qgb2YgS3ViZXJuZXRlcyByZXNvdXJjZSBzcGVjaWZpY2F0aW9uc1xuICAgKiBAcmV0dXJucyBhIGBLdWJlcm5ldGVzTWFuaWZlc3RgIG9iamVjdC5cbiAgICovXG4gIGFkZE1hbmlmZXN0KGlkOiBzdHJpbmcsIC4uLm1hbmlmZXN0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10pOiBLdWJlcm5ldGVzTWFuaWZlc3Q7XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYSBIZWxtIGNoYXJ0IGluIHRoaXMgY2x1c3Rlci5cbiAgICpcbiAgICogQHBhcmFtIGlkIGxvZ2ljYWwgaWQgb2YgdGhpcyBjaGFydC5cbiAgICogQHBhcmFtIG9wdGlvbnMgb3B0aW9ucyBvZiB0aGlzIGNoYXJ0LlxuICAgKiBAcmV0dXJucyBhIGBIZWxtQ2hhcnRgIGNvbnN0cnVjdFxuICAgKi9cbiAgYWRkSGVsbUNoYXJ0KGlkOiBzdHJpbmcsIG9wdGlvbnM6IEhlbG1DaGFydE9wdGlvbnMpOiBIZWxtQ2hhcnQ7XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYSBDREs4cyBjaGFydCBpbiB0aGlzIGNsdXN0ZXIuXG4gICAqXG4gICAqIEBwYXJhbSBpZCBsb2dpY2FsIGlkIG9mIHRoaXMgY2hhcnQuXG4gICAqIEBwYXJhbSBjaGFydCB0aGUgY2RrOHMgY2hhcnQuXG4gICAqIEByZXR1cm5zIGEgYEt1YmVybmV0ZXNNYW5pZmVzdGAgY29uc3RydWN0IHJlcHJlc2VudGluZyB0aGUgY2hhcnQuXG4gICAqL1xuICBhZGRDZGs4c0NoYXJ0KGlkOiBzdHJpbmcsIGNoYXJ0OiBDb25zdHJ1Y3QsIG9wdGlvbnM/OiBLdWJlcm5ldGVzTWFuaWZlc3RPcHRpb25zKTogS3ViZXJuZXRlc01hbmlmZXN0O1xuXG4gIC8qKlxuICAgKiBDb25uZWN0IGNhcGFjaXR5IGluIHRoZSBmb3JtIG9mIGFuIGV4aXN0aW5nIEF1dG9TY2FsaW5nR3JvdXAgdG8gdGhlIEVLUyBjbHVzdGVyLlxuICAgKlxuICAgKiBUaGUgQXV0b1NjYWxpbmdHcm91cCBtdXN0IGJlIHJ1bm5pbmcgYW4gRUtTLW9wdGltaXplZCBBTUkgY29udGFpbmluZyB0aGVcbiAgICogL2V0Yy9la3MvYm9vdHN0cmFwLnNoIHNjcmlwdC4gVGhpcyBtZXRob2Qgd2lsbCBjb25maWd1cmUgU2VjdXJpdHkgR3JvdXBzLFxuICAgKiBhZGQgdGhlIHJpZ2h0IHBvbGljaWVzIHRvIHRoZSBpbnN0YW5jZSByb2xlLCBhcHBseSB0aGUgcmlnaHQgdGFncywgYW5kIGFkZFxuICAgKiB0aGUgcmVxdWlyZWQgdXNlciBkYXRhIHRvIHRoZSBpbnN0YW5jZSdzIGxhdW5jaCBjb25maWd1cmF0aW9uLlxuICAgKlxuICAgKiBTcG90IGluc3RhbmNlcyB3aWxsIGJlIGxhYmVsZWQgYGxpZmVjeWNsZT1FYzJTcG90YCBhbmQgdGFpbnRlZCB3aXRoIGBQcmVmZXJOb1NjaGVkdWxlYC5cbiAgICogSWYga3ViZWN0bCBpcyBlbmFibGVkLCB0aGVcbiAgICogW3Nwb3QgaW50ZXJydXB0IGhhbmRsZXJdKGh0dHBzOi8vZ2l0aHViLmNvbS9hd3NsYWJzL2VjMi1zcG90LWxhYnMvdHJlZS9tYXN0ZXIvZWMyLXNwb3QtZWtzLXNvbHV0aW9uL3Nwb3QtdGVybWluYXRpb24taGFuZGxlcilcbiAgICogZGFlbW9uIHdpbGwgYmUgaW5zdGFsbGVkIG9uIGFsbCBzcG90IGluc3RhbmNlcyB0byBoYW5kbGVcbiAgICogW0VDMiBTcG90IEluc3RhbmNlIFRlcm1pbmF0aW9uIE5vdGljZXNdKGh0dHBzOi8vYXdzLmFtYXpvbi5jb20vYmxvZ3MvYXdzL25ldy1lYzItc3BvdC1pbnN0YW5jZS10ZXJtaW5hdGlvbi1ub3RpY2VzLykuXG4gICAqXG4gICAqIFByZWZlciB0byB1c2UgYGFkZEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eWAgaWYgcG9zc2libGUuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Vrcy9sYXRlc3QvdXNlcmd1aWRlL2xhdW5jaC13b3JrZXJzLmh0bWxcbiAgICogQHBhcmFtIGF1dG9TY2FsaW5nR3JvdXAgW2Rpc2FibGUtYXdzbGludDpyZWYtdmlhLWludGVyZmFjZV1cbiAgICogQHBhcmFtIG9wdGlvbnMgb3B0aW9ucyBmb3IgYWRkaW5nIGF1dG8gc2NhbGluZyBncm91cHMsIGxpa2UgY3VzdG9taXppbmcgdGhlIGJvb3RzdHJhcCBzY3JpcHRcbiAgICovXG4gIGNvbm5lY3RBdXRvU2NhbGluZ0dyb3VwQ2FwYWNpdHkoYXV0b1NjYWxpbmdHcm91cDogYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cCwgb3B0aW9uczogQXV0b1NjYWxpbmdHcm91cE9wdGlvbnMpOiB2b2lkO1xufVxuXG4vKipcbiAqIEF0dHJpYnV0ZXMgZm9yIEVLUyBjbHVzdGVycy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDbHVzdGVyQXR0cmlidXRlcyB7XG4gIC8qKlxuICAgKiBUaGUgVlBDIGluIHdoaWNoIHRoaXMgQ2x1c3RlciB3YXMgY3JlYXRlZFxuICAgKiBAZGVmYXVsdCAtIGlmIG5vdCBzcGVjaWZpZWQgYGNsdXN0ZXIudnBjYCB3aWxsIHRocm93IGFuIGVycm9yXG4gICAqL1xuICByZWFkb25seSB2cGM/OiBlYzIuSVZwYztcblxuICAvKipcbiAgICogVGhlIHBoeXNpY2FsIG5hbWUgb2YgdGhlIENsdXN0ZXJcbiAgICovXG4gIHJlYWRvbmx5IGNsdXN0ZXJOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBBUEkgU2VydmVyIGVuZHBvaW50IFVSTFxuICAgKiBAZGVmYXVsdCAtIGlmIG5vdCBzcGVjaWZpZWQgYGNsdXN0ZXIuY2x1c3RlckVuZHBvaW50YCB3aWxsIHRocm93IGFuIGVycm9yLlxuICAgKi9cbiAgcmVhZG9ubHkgY2x1c3RlckVuZHBvaW50Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgY2VydGlmaWNhdGUtYXV0aG9yaXR5LWRhdGEgZm9yIHlvdXIgY2x1c3Rlci5cbiAgICogQGRlZmF1bHQgLSBpZiBub3Qgc3BlY2lmaWVkIGBjbHVzdGVyLmNsdXN0ZXJDZXJ0aWZpY2F0ZUF1dGhvcml0eURhdGFgIHdpbGxcbiAgICogdGhyb3cgYW4gZXJyb3JcbiAgICovXG4gIHJlYWRvbmx5IGNsdXN0ZXJDZXJ0aWZpY2F0ZUF1dGhvcml0eURhdGE/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBjbHVzdGVyIHNlY3VyaXR5IGdyb3VwIHRoYXQgd2FzIGNyZWF0ZWQgYnkgQW1hem9uIEVLUyBmb3IgdGhlIGNsdXN0ZXIuXG4gICAqIEBkZWZhdWx0IC0gaWYgbm90IHNwZWNpZmllZCBgY2x1c3Rlci5jbHVzdGVyU2VjdXJpdHlHcm91cElkYCB3aWxsIHRocm93IGFuXG4gICAqIGVycm9yXG4gICAqL1xuICByZWFkb25seSBjbHVzdGVyU2VjdXJpdHlHcm91cElkPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKSBvciBhbGlhcyBvZiB0aGUgY3VzdG9tZXIgbWFzdGVyIGtleSAoQ01LKS5cbiAgICogQGRlZmF1bHQgLSBpZiBub3Qgc3BlY2lmaWVkIGBjbHVzdGVyLmNsdXN0ZXJFbmNyeXB0aW9uQ29uZmlnS2V5QXJuYCB3aWxsXG4gICAqIHRocm93IGFuIGVycm9yXG4gICAqL1xuICByZWFkb25seSBjbHVzdGVyRW5jcnlwdGlvbkNvbmZpZ0tleUFybj86IHN0cmluZztcblxuICAvKipcbiAgICogQWRkaXRpb25hbCBzZWN1cml0eSBncm91cHMgYXNzb2NpYXRlZCB3aXRoIHRoaXMgY2x1c3Rlci5cbiAgICogQGRlZmF1bHQgLSBpZiBub3Qgc3BlY2lmaWVkLCBubyBhZGRpdGlvbmFsIHNlY3VyaXR5IGdyb3VwcyB3aWxsIGJlXG4gICAqIGNvbnNpZGVyZWQgaW4gYGNsdXN0ZXIuY29ubmVjdGlvbnNgLlxuICAgKi9cbiAgcmVhZG9ubHkgc2VjdXJpdHlHcm91cElkcz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBBbiBJQU0gcm9sZSB3aXRoIGNsdXN0ZXIgYWRtaW5pc3RyYXRvciBhbmQgXCJzeXN0ZW06bWFzdGVyc1wiIHBlcm1pc3Npb25zLlxuICAgKiBAZGVmYXVsdCAtIGlmIG5vdCBzcGVjaWZpZWQsIGl0IG5vdCBiZSBwb3NzaWJsZSB0byBpc3N1ZSBga3ViZWN0bGAgY29tbWFuZHNcbiAgICogYWdhaW5zdCBhbiBpbXBvcnRlZCBjbHVzdGVyLlxuICAgKi9cbiAgcmVhZG9ubHkga3ViZWN0bFJvbGVBcm4/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEFuIElBTSByb2xlIHRoYXQgY2FuIHBlcmZvcm0ga3ViZWN0bCBvcGVyYXRpb25zIGFnYWluc3QgdGhpcyBjbHVzdGVyLlxuICAgKlxuICAgKiBUaGUgcm9sZSBzaG91bGQgYmUgbWFwcGVkIHRvIHRoZSBgc3lzdGVtOm1hc3RlcnNgIEt1YmVybmV0ZXMgUkJBQyByb2xlLlxuICAgKlxuICAgKiBUaGlzIHJvbGUgaXMgZGlyZWN0bHkgcGFzc2VkIHRvIHRoZSBsYW1iZGEgaGFuZGxlciB0aGF0IHNlbmRzIEt1YmUgQ3RsIGNvbW1hbmRzXG4gICAqIHRvIHRoZSBjbHVzdGVyLlxuICAgKiBAZGVmYXVsdCAtIGlmIG5vdCBzcGVjaWZpZWQsIHRoZSBkZWZhdWx0IHJvbGUgY3JlYXRlZCBieSBhIGxhbWJkYSBmdW5jdGlvbiB3aWxsXG4gICAqIGJlIHVzZWQuXG4gICAqL1xuICByZWFkb25seSBrdWJlY3RsTGFtYmRhUm9sZT86IGlhbS5JUm9sZTtcblxuICAvKipcbiAgICogRW52aXJvbm1lbnQgdmFyaWFibGVzIHRvIHVzZSB3aGVuIHJ1bm5pbmcgYGt1YmVjdGxgIGFnYWluc3QgdGhpcyBjbHVzdGVyLlxuICAgKiBAZGVmYXVsdCAtIG5vIGFkZGl0aW9uYWwgdmFyaWFibGVzXG4gICAqL1xuICByZWFkb25seSBrdWJlY3RsRW52aXJvbm1lbnQ/OiB7IFtuYW1lOiBzdHJpbmddOiBzdHJpbmcgfTtcblxuICAvKipcbiAgICogQSBzZWN1cml0eSBncm91cCB0byB1c2UgZm9yIGBrdWJlY3RsYCBleGVjdXRpb24uIElmIG5vdCBzcGVjaWZpZWQsIHRoZSBrOHNcbiAgICogZW5kcG9pbnQgaXMgZXhwZWN0ZWQgdG8gYmUgYWNjZXNzaWJsZSBwdWJsaWNseS5cbiAgICogQGRlZmF1bHQgLSBrOHMgZW5kcG9pbnQgaXMgZXhwZWN0ZWQgdG8gYmUgYWNjZXNzaWJsZSBwdWJsaWNseVxuICAgKi9cbiAgcmVhZG9ubHkga3ViZWN0bFNlY3VyaXR5R3JvdXBJZD86IHN0cmluZztcblxuICAvKipcbiAgICogU3VibmV0cyB0byBob3N0IHRoZSBga3ViZWN0bGAgY29tcHV0ZSByZXNvdXJjZXMuIElmIG5vdCBzcGVjaWZpZWQsIHRoZSBrOHNcbiAgICogZW5kcG9pbnQgaXMgZXhwZWN0ZWQgdG8gYmUgYWNjZXNzaWJsZSBwdWJsaWNseS5cbiAgICogQGRlZmF1bHQgLSBrOHMgZW5kcG9pbnQgaXMgZXhwZWN0ZWQgdG8gYmUgYWNjZXNzaWJsZSBwdWJsaWNseVxuICAgKi9cbiAgcmVhZG9ubHkga3ViZWN0bFByaXZhdGVTdWJuZXRJZHM/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogQW4gT3BlbiBJRCBDb25uZWN0IHByb3ZpZGVyIGZvciB0aGlzIGNsdXN0ZXIgdGhhdCBjYW4gYmUgdXNlZCB0byBjb25maWd1cmUgc2VydmljZSBhY2NvdW50cy5cbiAgICogWW91IGNhbiBlaXRoZXIgaW1wb3J0IGFuIGV4aXN0aW5nIHByb3ZpZGVyIHVzaW5nIGBpYW0uT3BlbklkQ29ubmVjdFByb3ZpZGVyLmZyb21Qcm92aWRlckFybmAsXG4gICAqIG9yIGNyZWF0ZSBhIG5ldyBwcm92aWRlciB1c2luZyBgbmV3IGVrcy5PcGVuSWRDb25uZWN0UHJvdmlkZXJgXG4gICAqIEBkZWZhdWx0IC0gaWYgbm90IHNwZWNpZmllZCBgY2x1c3Rlci5vcGVuSWRDb25uZWN0UHJvdmlkZXJgIGFuZCBgY2x1c3Rlci5hZGRTZXJ2aWNlQWNjb3VudGAgd2lsbCB0aHJvdyBhbiBlcnJvci5cbiAgICovXG4gIHJlYWRvbmx5IG9wZW5JZENvbm5lY3RQcm92aWRlcj86IGlhbS5JT3BlbklkQ29ubmVjdFByb3ZpZGVyO1xuXG4gIC8qKlxuICAgKiBBbiBBV1MgTGFtYmRhIExheWVyIHdoaWNoIGluY2x1ZGVzIGBrdWJlY3RsYCBhbmQgSGVsbS5cbiAgICpcbiAgICogVGhpcyBsYXllciBpcyB1c2VkIGJ5IHRoZSBrdWJlY3RsIGhhbmRsZXIgdG8gYXBwbHkgbWFuaWZlc3RzIGFuZCBpbnN0YWxsXG4gICAqIGhlbG0gY2hhcnRzLiBZb3UgbXVzdCBwaWNrIGFuIGFwcHJvcHJpYXRlIHJlbGVhc2VzIG9mIG9uZSBvZiB0aGVcbiAgICogYEBhd3MtY2RrL2xheWVyLWt1YmVjdGwtdlhYYCBwYWNrYWdlcywgdGhhdCB3b3JrcyB3aXRoIHRoZSB2ZXJzaW9uIG9mXG4gICAqIEt1YmVybmV0ZXMgeW91IGhhdmUgY2hvc2VuLiBJZiB5b3UgZG9uJ3Qgc3VwcGx5IHRoaXMgdmFsdWUgYGt1YmVjdGxgXG4gICAqIDEuMjAgd2lsbCBiZSB1c2VkLCBidXQgdGhhdCB2ZXJzaW9uIGlzIG1vc3QgbGlrZWx5IHRvbyBvbGQuXG4gICAqXG4gICAqIFRoZSBoYW5kbGVyIGV4cGVjdHMgdGhlIGxheWVyIHRvIGluY2x1ZGUgdGhlIGZvbGxvd2luZyBleGVjdXRhYmxlczpcbiAgICpcbiAgICogYGBgXG4gICAqIC9vcHQvaGVsbS9oZWxtXG4gICAqIC9vcHQva3ViZWN0bC9rdWJlY3RsXG4gICAqIGBgYFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGEgZGVmYXVsdCBsYXllciB3aXRoIEt1YmVjdGwgMS4yMCBhbmQgaGVsbSAzLjguXG4gICAqL1xuICByZWFkb25seSBrdWJlY3RsTGF5ZXI/OiBsYW1iZGEuSUxheWVyVmVyc2lvbjtcblxuICAvKipcbiAgICogQW4gQVdTIExhbWJkYSBsYXllciB0aGF0IGNvbnRhaW5zIHRoZSBgYXdzYCBDTEkuXG4gICAqXG4gICAqIFRoZSBoYW5kbGVyIGV4cGVjdHMgdGhlIGxheWVyIHRvIGluY2x1ZGUgdGhlIGZvbGxvd2luZyBleGVjdXRhYmxlczpcbiAgICpcbiAgICogYGBgXG4gICAqIC9vcHQvYXdzY2xpL2F3c1xuICAgKiBgYGBcbiAgICpcbiAgICogQGRlZmF1bHQgLSBhIGRlZmF1bHQgbGF5ZXIgd2l0aCB0aGUgQVdTIENMSSAxLnhcbiAgICovXG4gIHJlYWRvbmx5IGF3c2NsaUxheWVyPzogbGFtYmRhLklMYXllclZlcnNpb247XG5cbiAgLyoqXG4gICAqIEt1YmVjdGxQcm92aWRlciBmb3IgaXNzdWluZyBrdWJlY3RsIGNvbW1hbmRzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIERlZmF1bHQgQ0RLIHByb3ZpZGVyXG4gICAqL1xuICByZWFkb25seSBrdWJlY3RsUHJvdmlkZXI/OiBJS3ViZWN0bFByb3ZpZGVyO1xuXG4gIC8qKlxuICAgKiBBbW91bnQgb2YgbWVtb3J5IHRvIGFsbG9jYXRlIHRvIHRoZSBwcm92aWRlcidzIGxhbWJkYSBmdW5jdGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgU2l6ZS5naWJpYnl0ZXMoMSlcbiAgICovXG4gIHJlYWRvbmx5IGt1YmVjdGxNZW1vcnk/OiBTaXplO1xuXG4gIC8qKlxuICAgKiBBIHNlY3VyaXR5IGdyb3VwIGlkIHRvIGFzc29jaWF0ZSB3aXRoIHRoZSBDbHVzdGVyIEhhbmRsZXIncyBMYW1iZGFzLlxuICAgKiBUaGUgQ2x1c3RlciBIYW5kbGVyJ3MgTGFtYmRhcyBhcmUgcmVzcG9uc2libGUgZm9yIGNhbGxpbmcgQVdTJ3MgRUtTIEFQSS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBzZWN1cml0eSBncm91cC5cbiAgICovXG4gIHJlYWRvbmx5IGNsdXN0ZXJIYW5kbGVyU2VjdXJpdHlHcm91cElkPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBbiBBV1MgTGFtYmRhIExheWVyIHdoaWNoIGluY2x1ZGVzIHRoZSBOUE0gZGVwZW5kZW5jeSBgcHJveHktYWdlbnRgLiBUaGlzIGxheWVyXG4gICAqIGlzIHVzZWQgYnkgdGhlIG9uRXZlbnQgaGFuZGxlciB0byByb3V0ZSBBV1MgU0RLIHJlcXVlc3RzIHRocm91Z2ggYSBwcm94eS5cbiAgICpcbiAgICogVGhlIGhhbmRsZXIgZXhwZWN0cyB0aGUgbGF5ZXIgdG8gaW5jbHVkZSB0aGUgZm9sbG93aW5nIG5vZGVfbW9kdWxlczpcbiAgICpcbiAgICogICAgcHJveHktYWdlbnRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBhIGxheWVyIGJ1bmRsZWQgd2l0aCB0aGlzIG1vZHVsZS5cbiAgICovXG4gIHJlYWRvbmx5IG9uRXZlbnRMYXllcj86IGxhbWJkYS5JTGF5ZXJWZXJzaW9uO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgd2hldGhlciBLdWJlcm5ldGVzIHJlc291cmNlcyBhZGRlZCB0aHJvdWdoIGBhZGRNYW5pZmVzdCgpYCBjYW4gYmVcbiAgICogYXV0b21hdGljYWxseSBwcnVuZWQuIFdoZW4gdGhpcyBpcyBlbmFibGVkIChkZWZhdWx0KSwgcHJ1bmUgbGFiZWxzIHdpbGwgYmVcbiAgICogYWxsb2NhdGVkIGFuZCBpbmplY3RlZCB0byBlYWNoIHJlc291cmNlLiBUaGVzZSBsYWJlbHMgd2lsbCB0aGVuIGJlIHVzZWRcbiAgICogd2hlbiBpc3N1aW5nIHRoZSBga3ViZWN0bCBhcHBseWAgb3BlcmF0aW9uIHdpdGggdGhlIGAtLXBydW5lYCBzd2l0Y2guXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IHBydW5lPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciBjb25maWd1cmluZyBhbiBFS1MgY2x1c3Rlci5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb21tb25DbHVzdGVyT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgVlBDIGluIHdoaWNoIHRvIGNyZWF0ZSB0aGUgQ2x1c3Rlci5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBhIFZQQyB3aXRoIGRlZmF1bHQgY29uZmlndXJhdGlvbiB3aWxsIGJlIGNyZWF0ZWQgYW5kIGNhbiBiZSBhY2Nlc3NlZCB0aHJvdWdoIGBjbHVzdGVyLnZwY2AuXG4gICAqL1xuICByZWFkb25seSB2cGM/OiBlYzIuSVZwYztcblxuICAvKipcbiAgICogV2hlcmUgdG8gcGxhY2UgRUtTIENvbnRyb2wgUGxhbmUgRU5Jc1xuICAgKlxuICAgKiBJZiB5b3Ugd2FudCB0byBjcmVhdGUgcHVibGljIGxvYWQgYmFsYW5jZXJzLCB0aGlzIG11c3QgaW5jbHVkZSBwdWJsaWMgc3VibmV0cy5cbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIHRvIG9ubHkgc2VsZWN0IHByaXZhdGUgc3VibmV0cywgc3VwcGx5IHRoZSBmb2xsb3dpbmc6XG4gICAqXG4gICAqIGB2cGNTdWJuZXRzOiBbeyBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTIH1dYFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEFsbCBwdWJsaWMgYW5kIHByaXZhdGUgc3VibmV0c1xuICAgKi9cbiAgcmVhZG9ubHkgdnBjU3VibmV0cz86IGVjMi5TdWJuZXRTZWxlY3Rpb25bXTtcblxuICAvKipcbiAgICogUm9sZSB0aGF0IHByb3ZpZGVzIHBlcm1pc3Npb25zIGZvciB0aGUgS3ViZXJuZXRlcyBjb250cm9sIHBsYW5lIHRvIG1ha2UgY2FsbHMgdG8gQVdTIEFQSSBvcGVyYXRpb25zIG9uIHlvdXIgYmVoYWxmLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEEgcm9sZSBpcyBhdXRvbWF0aWNhbGx5IGNyZWF0ZWQgZm9yIHlvdVxuICAgKi9cbiAgcmVhZG9ubHkgcm9sZT86IGlhbS5JUm9sZTtcblxuICAvKipcbiAgICogTmFtZSBmb3IgdGhlIGNsdXN0ZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQXV0b21hdGljYWxseSBnZW5lcmF0ZWQgbmFtZVxuICAgKi9cbiAgcmVhZG9ubHkgY2x1c3Rlck5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFNlY3VyaXR5IEdyb3VwIHRvIHVzZSBmb3IgQ29udHJvbCBQbGFuZSBFTklzXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQSBzZWN1cml0eSBncm91cCBpcyBhdXRvbWF0aWNhbGx5IGNyZWF0ZWRcbiAgICovXG4gIHJlYWRvbmx5IHNlY3VyaXR5R3JvdXA/OiBlYzIuSVNlY3VyaXR5R3JvdXA7XG5cbiAgLyoqXG4gICAqIFRoZSBLdWJlcm5ldGVzIHZlcnNpb24gdG8gcnVuIGluIHRoZSBjbHVzdGVyXG4gICAqL1xuICByZWFkb25seSB2ZXJzaW9uOiBLdWJlcm5ldGVzVmVyc2lvbjtcblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGEgQ2xvdWRGb3JtYXRpb24gb3V0cHV0IHdpdGggdGhlIG5hbWUgb2YgdGhlIGNsdXN0ZXJcbiAgICogd2lsbCBiZSBzeW50aGVzaXplZC5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IG91dHB1dENsdXN0ZXJOYW1lPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIGEgQ2xvdWRGb3JtYXRpb24gb3V0cHV0IHdpdGggdGhlIGBhd3MgZWtzXG4gICAqIHVwZGF0ZS1rdWJlY29uZmlnYCBjb21tYW5kIHdpbGwgYmUgc3ludGhlc2l6ZWQuIFRoaXMgY29tbWFuZCB3aWxsIGluY2x1ZGVcbiAgICogdGhlIGNsdXN0ZXIgbmFtZSBhbmQsIGlmIGFwcGxpY2FibGUsIHRoZSBBUk4gb2YgdGhlIG1hc3RlcnMgSUFNIHJvbGUuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IG91dHB1dENvbmZpZ0NvbW1hbmQ/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIEVLUyBjbHVzdGVycy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDbHVzdGVyT3B0aW9ucyBleHRlbmRzIENvbW1vbkNsdXN0ZXJPcHRpb25zIHtcbiAgLyoqXG4gICAqIEFuIElBTSByb2xlIHRoYXQgd2lsbCBiZSBhZGRlZCB0byB0aGUgYHN5c3RlbTptYXN0ZXJzYCBLdWJlcm5ldGVzIFJCQUNcbiAgICogZ3JvdXAuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9rdWJlcm5ldGVzLmlvL2RvY3MvcmVmZXJlbmNlL2FjY2Vzcy1hdXRobi1hdXRoei9yYmFjLyNkZWZhdWx0LXJvbGVzLWFuZC1yb2xlLWJpbmRpbmdzXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gYSByb2xlIHRoYXQgYXNzdW1hYmxlIGJ5IGFueW9uZSB3aXRoIHBlcm1pc3Npb25zIGluIHRoZSBzYW1lXG4gICAqIGFjY291bnQgd2lsbCBhdXRvbWF0aWNhbGx5IGJlIGRlZmluZWRcbiAgICovXG4gIHJlYWRvbmx5IG1hc3RlcnNSb2xlPzogaWFtLklSb2xlO1xuXG4gIC8qKlxuICAgKiBDb250cm9scyB0aGUgXCJla3MuYW1hem9uYXdzLmNvbS9jb21wdXRlLXR5cGVcIiBhbm5vdGF0aW9uIGluIHRoZSBDb3JlRE5TXG4gICAqIGNvbmZpZ3VyYXRpb24gb24geW91ciBjbHVzdGVyIHRvIGRldGVybWluZSB3aGljaCBjb21wdXRlIHR5cGUgdG8gdXNlXG4gICAqIGZvciBDb3JlRE5TLlxuICAgKlxuICAgKiBAZGVmYXVsdCBDb3JlRG5zQ29tcHV0ZVR5cGUuRUMyIChmb3IgYEZhcmdhdGVDbHVzdGVyYCB0aGUgZGVmYXVsdCBpcyBGQVJHQVRFKVxuICAgKi9cbiAgcmVhZG9ubHkgY29yZURuc0NvbXB1dGVUeXBlPzogQ29yZURuc0NvbXB1dGVUeXBlO1xuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYSBDbG91ZEZvcm1hdGlvbiBvdXRwdXQgd2l0aCB0aGUgQVJOIG9mIHRoZSBcIm1hc3RlcnNcIlxuICAgKiBJQU0gcm9sZSB3aWxsIGJlIHN5bnRoZXNpemVkIChpZiBgbWFzdGVyc1JvbGVgIGlzIHNwZWNpZmllZCkuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBvdXRwdXRNYXN0ZXJzUm9sZUFybj86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZSBhY2Nlc3MgdG8gdGhlIEt1YmVybmV0ZXMgQVBJIHNlcnZlciBlbmRwb2ludC4uXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Vrcy9sYXRlc3QvdXNlcmd1aWRlL2NsdXN0ZXItZW5kcG9pbnQuaHRtbFxuICAgKlxuICAgKiBAZGVmYXVsdCBFbmRwb2ludEFjY2Vzcy5QVUJMSUNfQU5EX1BSSVZBVEVcbiAgICovXG4gIHJlYWRvbmx5IGVuZHBvaW50QWNjZXNzPzogRW5kcG9pbnRBY2Nlc3M7XG5cbiAgLyoqXG4gICAqIEVudmlyb25tZW50IHZhcmlhYmxlcyBmb3IgdGhlIGt1YmVjdGwgZXhlY3V0aW9uLiBPbmx5IHJlbGV2YW50IGZvciBrdWJlY3RsIGVuYWJsZWQgY2x1c3RlcnMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZW52aXJvbm1lbnQgdmFyaWFibGVzLlxuICAgKi9cbiAgcmVhZG9ubHkga3ViZWN0bEVudmlyb25tZW50PzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfTtcblxuICAvKipcbiAgICogQW4gQVdTIExhbWJkYSBMYXllciB3aGljaCBpbmNsdWRlcyBga3ViZWN0bGAgYW5kIEhlbG0uXG4gICAqXG4gICAqIFRoaXMgbGF5ZXIgaXMgdXNlZCBieSB0aGUga3ViZWN0bCBoYW5kbGVyIHRvIGFwcGx5IG1hbmlmZXN0cyBhbmQgaW5zdGFsbFxuICAgKiBoZWxtIGNoYXJ0cy4gWW91IG11c3QgcGljayBhbiBhcHByb3ByaWF0ZSByZWxlYXNlcyBvZiBvbmUgb2YgdGhlXG4gICAqIGBAYXdzLWNkay9sYXllci1rdWJlY3RsLXZYWGAgcGFja2FnZXMsIHRoYXQgd29ya3Mgd2l0aCB0aGUgdmVyc2lvbiBvZlxuICAgKiBLdWJlcm5ldGVzIHlvdSBoYXZlIGNob3Nlbi4gSWYgeW91IGRvbid0IHN1cHBseSB0aGlzIHZhbHVlIGBrdWJlY3RsYFxuICAgKiAxLjIwIHdpbGwgYmUgdXNlZCwgYnV0IHRoYXQgdmVyc2lvbiBpcyBtb3N0IGxpa2VseSB0b28gb2xkLlxuICAgKlxuICAgKiBUaGUgaGFuZGxlciBleHBlY3RzIHRoZSBsYXllciB0byBpbmNsdWRlIHRoZSBmb2xsb3dpbmcgZXhlY3V0YWJsZXM6XG4gICAqXG4gICAqIGBgYFxuICAgKiAvb3B0L2hlbG0vaGVsbVxuICAgKiAvb3B0L2t1YmVjdGwva3ViZWN0bFxuICAgKiBgYGBcbiAgICpcbiAgICogQGRlZmF1bHQgLSBhIGRlZmF1bHQgbGF5ZXIgd2l0aCBLdWJlY3RsIDEuMjAuXG4gICAqL1xuICByZWFkb25seSBrdWJlY3RsTGF5ZXI/OiBsYW1iZGEuSUxheWVyVmVyc2lvbjtcblxuICAvKipcbiAgICogQW4gQVdTIExhbWJkYSBsYXllciB0aGF0IGNvbnRhaW5zIHRoZSBgYXdzYCBDTEkuXG4gICAqXG4gICAqIFRoZSBoYW5kbGVyIGV4cGVjdHMgdGhlIGxheWVyIHRvIGluY2x1ZGUgdGhlIGZvbGxvd2luZyBleGVjdXRhYmxlczpcbiAgICpcbiAgICogYGBgXG4gICAqIC9vcHQvYXdzY2xpL2F3c1xuICAgKiBgYGBcbiAgICpcbiAgICogQGRlZmF1bHQgLSBhIGRlZmF1bHQgbGF5ZXIgd2l0aCB0aGUgQVdTIENMSSAxLnhcbiAgICovXG4gIHJlYWRvbmx5IGF3c2NsaUxheWVyPzogbGFtYmRhLklMYXllclZlcnNpb247XG5cbiAgLyoqXG4gICAqIEFtb3VudCBvZiBtZW1vcnkgdG8gYWxsb2NhdGUgdG8gdGhlIHByb3ZpZGVyJ3MgbGFtYmRhIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCBTaXplLmdpYmlieXRlcygxKVxuICAgKi9cbiAgcmVhZG9ubHkga3ViZWN0bE1lbW9yeT86IFNpemU7XG5cbiAgLyoqXG4gICAqIEN1c3RvbSBlbnZpcm9ubWVudCB2YXJpYWJsZXMgd2hlbiBpbnRlcmFjdGluZyB3aXRoIHRoZSBFS1MgZW5kcG9pbnQgdG8gbWFuYWdlIHRoZSBjbHVzdGVyIGxpZmVjeWNsZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBlbnZpcm9ubWVudCB2YXJpYWJsZXMuXG4gICAqL1xuICByZWFkb25seSBjbHVzdGVySGFuZGxlckVudmlyb25tZW50PzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfTtcblxuICAvKipcbiAgICogQSBzZWN1cml0eSBncm91cCB0byBhc3NvY2lhdGUgd2l0aCB0aGUgQ2x1c3RlciBIYW5kbGVyJ3MgTGFtYmRhcy5cbiAgICogVGhlIENsdXN0ZXIgSGFuZGxlcidzIExhbWJkYXMgYXJlIHJlc3BvbnNpYmxlIGZvciBjYWxsaW5nIEFXUydzIEVLUyBBUEkuXG4gICAqXG4gICAqIFJlcXVpcmVzIGBwbGFjZUNsdXN0ZXJIYW5kbGVySW5WcGNgIHRvIGJlIHNldCB0byB0cnVlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIHNlY3VyaXR5IGdyb3VwLlxuICAgKi9cbiAgcmVhZG9ubHkgY2x1c3RlckhhbmRsZXJTZWN1cml0eUdyb3VwPzogZWMyLklTZWN1cml0eUdyb3VwO1xuXG4gIC8qKlxuICAgKiBBbiBBV1MgTGFtYmRhIExheWVyIHdoaWNoIGluY2x1ZGVzIHRoZSBOUE0gZGVwZW5kZW5jeSBgcHJveHktYWdlbnRgLiBUaGlzIGxheWVyXG4gICAqIGlzIHVzZWQgYnkgdGhlIG9uRXZlbnQgaGFuZGxlciB0byByb3V0ZSBBV1MgU0RLIHJlcXVlc3RzIHRocm91Z2ggYSBwcm94eS5cbiAgICpcbiAgICogQnkgZGVmYXVsdCwgdGhlIHByb3ZpZGVyIHdpbGwgdXNlIHRoZSBsYXllciBpbmNsdWRlZCBpbiB0aGVcbiAgICogXCJhd3MtbGFtYmRhLWxheWVyLW5vZGUtcHJveHktYWdlbnRcIiBTQVIgYXBwbGljYXRpb24gd2hpY2ggaXMgYXZhaWxhYmxlIGluIGFsbFxuICAgKiBjb21tZXJjaWFsIHJlZ2lvbnMuXG4gICAqXG4gICAqIFRvIGRlcGxveSB0aGUgbGF5ZXIgbG9jYWxseSBkZWZpbmUgaXQgaW4geW91ciBhcHAgYXMgZm9sbG93czpcbiAgICpcbiAgICogYGBgdHNcbiAgICogY29uc3QgbGF5ZXIgPSBuZXcgbGFtYmRhLkxheWVyVmVyc2lvbih0aGlzLCAncHJveHktYWdlbnQtbGF5ZXInLCB7XG4gICAqICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KGAke19fZGlybmFtZX0vbGF5ZXIuemlwYCksXG4gICAqICAgY29tcGF0aWJsZVJ1bnRpbWVzOiBbbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1hdLFxuICAgKiB9KTtcbiAgICogYGBgXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gYSBsYXllciBidW5kbGVkIHdpdGggdGhpcyBtb2R1bGUuXG4gICAqL1xuICByZWFkb25seSBvbkV2ZW50TGF5ZXI/OiBsYW1iZGEuSUxheWVyVmVyc2lvbjtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgS3ViZXJuZXRlcyByZXNvdXJjZXMgYWRkZWQgdGhyb3VnaCBgYWRkTWFuaWZlc3QoKWAgY2FuIGJlXG4gICAqIGF1dG9tYXRpY2FsbHkgcHJ1bmVkLiBXaGVuIHRoaXMgaXMgZW5hYmxlZCAoZGVmYXVsdCksIHBydW5lIGxhYmVscyB3aWxsIGJlXG4gICAqIGFsbG9jYXRlZCBhbmQgaW5qZWN0ZWQgdG8gZWFjaCByZXNvdXJjZS4gVGhlc2UgbGFiZWxzIHdpbGwgdGhlbiBiZSB1c2VkXG4gICAqIHdoZW4gaXNzdWluZyB0aGUgYGt1YmVjdGwgYXBwbHlgIG9wZXJhdGlvbiB3aXRoIHRoZSBgLS1wcnVuZWAgc3dpdGNoLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBwcnVuZT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIElmIHNldCB0byB0cnVlLCB0aGUgY2x1c3RlciBoYW5kbGVyIGZ1bmN0aW9ucyB3aWxsIGJlIHBsYWNlZCBpbiB0aGUgcHJpdmF0ZSBzdWJuZXRzXG4gICAqIG9mIHRoZSBjbHVzdGVyIHZwYywgc3ViamVjdCB0byB0aGUgYHZwY1N1Ym5ldHNgIHNlbGVjdGlvbiBzdHJhdGVneS5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHBsYWNlQ2x1c3RlckhhbmRsZXJJblZwYz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEtNUyBzZWNyZXQgZm9yIGVudmVsb3BlIGVuY3J5cHRpb24gZm9yIEt1YmVybmV0ZXMgc2VjcmV0cy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBCeSBkZWZhdWx0LCBLdWJlcm5ldGVzIHN0b3JlcyBhbGwgc2VjcmV0IG9iamVjdCBkYXRhIHdpdGhpbiBldGNkIGFuZFxuICAgKiAgICAgICAgICAgIGFsbCBldGNkIHZvbHVtZXMgdXNlZCBieSBBbWF6b24gRUtTIGFyZSBlbmNyeXB0ZWQgYXQgdGhlIGRpc2stbGV2ZWxcbiAgICogICAgICAgICAgICB1c2luZyBBV1MtTWFuYWdlZCBlbmNyeXB0aW9uIGtleXMuXG4gICAqL1xuICByZWFkb25seSBzZWNyZXRzRW5jcnlwdGlvbktleT86IGttcy5JS2V5O1xuXG4gIC8qKlxuICAgKiBUaGUgQ0lEUiBibG9jayB0byBhc3NpZ24gS3ViZXJuZXRlcyBzZXJ2aWNlIElQIGFkZHJlc3NlcyBmcm9tLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEt1YmVybmV0ZXMgYXNzaWducyBhZGRyZXNzZXMgZnJvbSBlaXRoZXIgdGhlXG4gICAqICAgICAgICAgICAgMTAuMTAwLjAuMC8xNiBvciAxNzIuMjAuMC4wLzE2IENJRFIgYmxvY2tzXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Vrcy9sYXRlc3QvQVBJUmVmZXJlbmNlL0FQSV9LdWJlcm5ldGVzTmV0d29ya0NvbmZpZ1JlcXVlc3QuaHRtbCNBbWF6b25FS1MtVHlwZS1LdWJlcm5ldGVzTmV0d29ya0NvbmZpZ1JlcXVlc3Qtc2VydmljZUlwdjRDaWRyXG4gICAqL1xuICByZWFkb25seSBzZXJ2aWNlSXB2NENpZHI/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEluc3RhbGwgdGhlIEFXUyBMb2FkIEJhbGFuY2VyIENvbnRyb2xsZXIgb250byB0aGUgY2x1c3Rlci5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2t1YmVybmV0ZXMtc2lncy5naXRodWIuaW8vYXdzLWxvYWQtYmFsYW5jZXItY29udHJvbGxlclxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFRoZSBjb250cm9sbGVyIGlzIG5vdCBpbnN0YWxsZWQuXG4gICAqL1xuICByZWFkb25seSBhbGJDb250cm9sbGVyPzogQWxiQ29udHJvbGxlck9wdGlvbnM7XG4gIC8qKlxuICAgKiBUaGUgY2x1c3RlciBsb2cgdHlwZXMgd2hpY2ggeW91IHdhbnQgdG8gZW5hYmxlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IGNsdXN0ZXJMb2dnaW5nPzogQ2x1c3RlckxvZ2dpbmdUeXBlc1tdO1xufVxuXG4vKipcbiAqIEdyb3VwIGFjY2VzcyBjb25maWd1cmF0aW9uIHRvZ2V0aGVyLlxuICovXG5pbnRlcmZhY2UgRW5kcG9pbnRBY2Nlc3NDb25maWcge1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgaWYgcHJpdmF0ZSBhY2Nlc3MgaXMgZW5hYmxlZC5cbiAgICovXG4gIHJlYWRvbmx5IHByaXZhdGVBY2Nlc3M6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyBpZiBwdWJsaWMgYWNjZXNzIGlzIGVuYWJsZWQuXG4gICAqL1xuICByZWFkb25seSBwdWJsaWNBY2Nlc3M6IGJvb2xlYW47XG4gIC8qKlxuICAgKiBQdWJsaWMgYWNjZXNzIGlzIGFsbG93ZWQgb25seSBmcm9tIHRoZXNlIENJRFIgYmxvY2tzLlxuICAgKiBBbiBlbXB0eSBhcnJheSBtZWFucyBhY2Nlc3MgaXMgb3BlbiB0byBhbnkgYWRkcmVzcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyByZXN0cmljdGlvbnMuXG4gICAqL1xuICByZWFkb25seSBwdWJsaWNDaWRycz86IHN0cmluZ1tdO1xuXG59XG5cbi8qKlxuICogRW5kcG9pbnQgYWNjZXNzIGNoYXJhY3RlcmlzdGljcy5cbiAqL1xuZXhwb3J0IGNsYXNzIEVuZHBvaW50QWNjZXNzIHtcblxuICAvKipcbiAgICogVGhlIGNsdXN0ZXIgZW5kcG9pbnQgaXMgYWNjZXNzaWJsZSBmcm9tIG91dHNpZGUgb2YgeW91ciBWUEMuXG4gICAqIFdvcmtlciBub2RlIHRyYWZmaWMgd2lsbCBsZWF2ZSB5b3VyIFZQQyB0byBjb25uZWN0IHRvIHRoZSBlbmRwb2ludC5cbiAgICpcbiAgICogQnkgZGVmYXVsdCwgdGhlIGVuZHBvaW50IGlzIGV4cG9zZWQgdG8gYWxsIGFkcmVzc2VzLiBZb3UgY2FuIG9wdGlvbmFsbHkgbGltaXQgdGhlIENJRFIgYmxvY2tzIHRoYXQgY2FuIGFjY2VzcyB0aGUgcHVibGljIGVuZHBvaW50IHVzaW5nIHRoZSBgUFVCTElDLm9ubHlGcm9tYCBtZXRob2QuXG4gICAqIElmIHlvdSBsaW1pdCBhY2Nlc3MgdG8gc3BlY2lmaWMgQ0lEUiBibG9ja3MsIHlvdSBtdXN0IGVuc3VyZSB0aGF0IHRoZSBDSURSIGJsb2NrcyB0aGF0IHlvdVxuICAgKiBzcGVjaWZ5IGluY2x1ZGUgdGhlIGFkZHJlc3NlcyB0aGF0IHdvcmtlciBub2RlcyBhbmQgRmFyZ2F0ZSBwb2RzIChpZiB5b3UgdXNlIHRoZW0pXG4gICAqIGFjY2VzcyB0aGUgcHVibGljIGVuZHBvaW50IGZyb20uXG4gICAqXG4gICAqIEBwYXJhbSBjaWRyIFRoZSBDSURSIGJsb2Nrcy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUFVCTElDID0gbmV3IEVuZHBvaW50QWNjZXNzKHsgcHJpdmF0ZUFjY2VzczogZmFsc2UsIHB1YmxpY0FjY2VzczogdHJ1ZSB9KTtcblxuICAvKipcbiAgICogVGhlIGNsdXN0ZXIgZW5kcG9pbnQgaXMgb25seSBhY2Nlc3NpYmxlIHRocm91Z2ggeW91ciBWUEMuXG4gICAqIFdvcmtlciBub2RlIHRyYWZmaWMgdG8gdGhlIGVuZHBvaW50IHdpbGwgc3RheSB3aXRoaW4geW91ciBWUEMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFBSSVZBVEUgPSBuZXcgRW5kcG9pbnRBY2Nlc3MoeyBwcml2YXRlQWNjZXNzOiB0cnVlLCBwdWJsaWNBY2Nlc3M6IGZhbHNlIH0pO1xuXG4gIC8qKlxuICAgKiBUaGUgY2x1c3RlciBlbmRwb2ludCBpcyBhY2Nlc3NpYmxlIGZyb20gb3V0c2lkZSBvZiB5b3VyIFZQQy5cbiAgICogV29ya2VyIG5vZGUgdHJhZmZpYyB0byB0aGUgZW5kcG9pbnQgd2lsbCBzdGF5IHdpdGhpbiB5b3VyIFZQQy5cbiAgICpcbiAgICogQnkgZGVmYXVsdCwgdGhlIGVuZHBvaW50IGlzIGV4cG9zZWQgdG8gYWxsIGFkcmVzc2VzLiBZb3UgY2FuIG9wdGlvbmFsbHkgbGltaXQgdGhlIENJRFIgYmxvY2tzIHRoYXQgY2FuIGFjY2VzcyB0aGUgcHVibGljIGVuZHBvaW50IHVzaW5nIHRoZSBgUFVCTElDX0FORF9QUklWQVRFLm9ubHlGcm9tYCBtZXRob2QuXG4gICAqIElmIHlvdSBsaW1pdCBhY2Nlc3MgdG8gc3BlY2lmaWMgQ0lEUiBibG9ja3MsIHlvdSBtdXN0IGVuc3VyZSB0aGF0IHRoZSBDSURSIGJsb2NrcyB0aGF0IHlvdVxuICAgKiBzcGVjaWZ5IGluY2x1ZGUgdGhlIGFkZHJlc3NlcyB0aGF0IHdvcmtlciBub2RlcyBhbmQgRmFyZ2F0ZSBwb2RzIChpZiB5b3UgdXNlIHRoZW0pXG4gICAqIGFjY2VzcyB0aGUgcHVibGljIGVuZHBvaW50IGZyb20uXG4gICAqXG4gICAqIEBwYXJhbSBjaWRyIFRoZSBDSURSIGJsb2Nrcy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUFVCTElDX0FORF9QUklWQVRFID0gbmV3IEVuZHBvaW50QWNjZXNzKHsgcHJpdmF0ZUFjY2VzczogdHJ1ZSwgcHVibGljQWNjZXNzOiB0cnVlIH0pO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoXG4gICAgLyoqXG4gICAgICogQ29uZmlndXJhdGlvbiBwcm9wZXJ0aWVzLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IF9jb25maWc6IEVuZHBvaW50QWNjZXNzQ29uZmlnKSB7XG4gICAgaWYgKCFfY29uZmlnLnB1YmxpY0FjY2VzcyAmJiBfY29uZmlnLnB1YmxpY0NpZHJzICYmIF9jb25maWcucHVibGljQ2lkcnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDSURSIGJsb2NrcyBjYW4gb25seSBiZSBjb25maWd1cmVkIHdoZW4gcHVibGljIGFjY2VzcyBpcyBlbmFibGVkJyk7XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgICogUmVzdHJpY3QgcHVibGljIGFjY2VzcyB0byBzcGVjaWZpYyBDSURSIGJsb2Nrcy5cbiAgICogSWYgcHVibGljIGFjY2VzcyBpcyBkaXNhYmxlZCwgdGhpcyBtZXRob2Qgd2lsbCByZXN1bHQgaW4gYW4gZXJyb3IuXG4gICAqXG4gICAqIEBwYXJhbSBjaWRyIENJRFIgYmxvY2tzLlxuICAgKi9cbiAgcHVibGljIG9ubHlGcm9tKC4uLmNpZHI6IHN0cmluZ1tdKSB7XG4gICAgaWYgKCF0aGlzLl9jb25maWcucHJpdmF0ZUFjY2Vzcykge1xuICAgICAgLy8gd2hlbiBwcml2YXRlIGFjY2VzcyBpcyBkaXNhYmxlZCwgd2UgY2FuJ3QgcmVzdHJpYyBwdWJsaWNcbiAgICAgIC8vIGFjY2VzcyBzaW5jZSBpdCB3aWxsIHJlbmRlciB0aGUga3ViZWN0bCBwcm92aWRlciB1bnVzYWJsZS5cbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHJlc3RyaWMgcHVibGljIGFjY2VzcyB0byBlbmRwb2ludCB3aGVuIHByaXZhdGUgYWNjZXNzIGlzIGRpc2FibGVkLiBVc2UgUFVCTElDX0FORF9QUklWQVRFLm9ubHlGcm9tKCkgaW5zdGVhZC4nKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBFbmRwb2ludEFjY2Vzcyh7XG4gICAgICAuLi50aGlzLl9jb25maWcsXG4gICAgICAvLyBvdmVycmlkZSBDSURSXG4gICAgICBwdWJsaWNDaWRyczogY2lkcixcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIENvbW1vbiBjb25maWd1cmF0aW9uIHByb3BzIGZvciBFS1MgY2x1c3RlcnMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2x1c3RlclByb3BzIGV4dGVuZHMgQ2x1c3Rlck9wdGlvbnMge1xuXG4gIC8qKlxuICAgKiBOdW1iZXIgb2YgaW5zdGFuY2VzIHRvIGFsbG9jYXRlIGFzIGFuIGluaXRpYWwgY2FwYWNpdHkgZm9yIHRoaXMgY2x1c3Rlci5cbiAgICogSW5zdGFuY2UgdHlwZSBjYW4gYmUgY29uZmlndXJlZCB0aHJvdWdoIGBkZWZhdWx0Q2FwYWNpdHlJbnN0YW5jZVR5cGVgLFxuICAgKiB3aGljaCBkZWZhdWx0cyB0byBgbTUubGFyZ2VgLlxuICAgKlxuICAgKiBVc2UgYGNsdXN0ZXIuYWRkQXV0b1NjYWxpbmdHcm91cENhcGFjaXR5YCB0byBhZGQgYWRkaXRpb25hbCBjdXN0b21pemVkIGNhcGFjaXR5LiBTZXQgdGhpc1xuICAgKiB0byBgMGAgaXMgeW91IHdpc2ggdG8gYXZvaWQgdGhlIGluaXRpYWwgY2FwYWNpdHkgYWxsb2NhdGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgMlxuICAgKi9cbiAgcmVhZG9ubHkgZGVmYXVsdENhcGFjaXR5PzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgaW5zdGFuY2UgdHlwZSB0byB1c2UgZm9yIHRoZSBkZWZhdWx0IGNhcGFjaXR5LiBUaGlzIHdpbGwgb25seSBiZSB0YWtlblxuICAgKiBpbnRvIGFjY291bnQgaWYgYGRlZmF1bHRDYXBhY2l0eWAgaXMgPiAwLlxuICAgKlxuICAgKiBAZGVmYXVsdCBtNS5sYXJnZVxuICAgKi9cbiAgcmVhZG9ubHkgZGVmYXVsdENhcGFjaXR5SW5zdGFuY2U/OiBlYzIuSW5zdGFuY2VUeXBlO1xuXG4gIC8qKlxuICAgKiBUaGUgZGVmYXVsdCBjYXBhY2l0eSB0eXBlIGZvciB0aGUgY2x1c3Rlci5cbiAgICpcbiAgICogQGRlZmF1bHQgTk9ERUdST1VQXG4gICAqL1xuICByZWFkb25seSBkZWZhdWx0Q2FwYWNpdHlUeXBlPzogRGVmYXVsdENhcGFjaXR5VHlwZTtcblxuICAvKipcbiAgICogVGhlIElBTSByb2xlIHRvIHBhc3MgdG8gdGhlIEt1YmVjdGwgTGFtYmRhIEhhbmRsZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRGVmYXVsdCBMYW1iZGEgSUFNIEV4ZWN1dGlvbiBSb2xlXG4gICAqL1xuICByZWFkb25seSBrdWJlY3RsTGFtYmRhUm9sZT86IGlhbS5JUm9sZTtcblxuICAvKipcbiAgICogVGhlIHRhZ3MgYXNzaWduZWQgdG8gdGhlIEVLUyBjbHVzdGVyXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgdGFncz86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH07XG59XG5cbi8qKlxuICogS3ViZXJuZXRlcyBjbHVzdGVyIHZlcnNpb25cbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Vrcy9sYXRlc3QvdXNlcmd1aWRlL2t1YmVybmV0ZXMtdmVyc2lvbnMuaHRtbCNrdWJlcm5ldGVzLXJlbGVhc2UtY2FsZW5kYXJcbiAqL1xuZXhwb3J0IGNsYXNzIEt1YmVybmV0ZXNWZXJzaW9uIHtcbiAgLyoqXG4gICAqIEt1YmVybmV0ZXMgdmVyc2lvbiAxLjE0XG4gICAqIEBkZXByZWNhdGVkIFVzZSBuZXdlciB2ZXJzaW9uIG9mIEVLU1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBWMV8xNCA9IEt1YmVybmV0ZXNWZXJzaW9uLm9mKCcxLjE0Jyk7XG5cbiAgLyoqXG4gICAqIEt1YmVybmV0ZXMgdmVyc2lvbiAxLjE1XG4gICAqIEBkZXByZWNhdGVkIFVzZSBuZXdlciB2ZXJzaW9uIG9mIEVLU1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBWMV8xNSA9IEt1YmVybmV0ZXNWZXJzaW9uLm9mKCcxLjE1Jyk7XG5cbiAgLyoqXG4gICAqIEt1YmVybmV0ZXMgdmVyc2lvbiAxLjE2XG4gICAqIEBkZXByZWNhdGVkIFVzZSBuZXdlciB2ZXJzaW9uIG9mIEVLU1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBWMV8xNiA9IEt1YmVybmV0ZXNWZXJzaW9uLm9mKCcxLjE2Jyk7XG5cbiAgLyoqXG4gICAqIEt1YmVybmV0ZXMgdmVyc2lvbiAxLjE3XG4gICAqIEBkZXByZWNhdGVkIFVzZSBuZXdlciB2ZXJzaW9uIG9mIEVLU1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBWMV8xNyA9IEt1YmVybmV0ZXNWZXJzaW9uLm9mKCcxLjE3Jyk7XG5cbiAgLyoqXG4gICAqIEt1YmVybmV0ZXMgdmVyc2lvbiAxLjE4XG4gICAqIEBkZXByZWNhdGVkIFVzZSBuZXdlciB2ZXJzaW9uIG9mIEVLU1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBWMV8xOCA9IEt1YmVybmV0ZXNWZXJzaW9uLm9mKCcxLjE4Jyk7XG5cbiAgLyoqXG4gICAqIEt1YmVybmV0ZXMgdmVyc2lvbiAxLjE5XG4gICAqIEBkZXByZWNhdGVkIFVzZSBuZXdlciB2ZXJzaW9uIG9mIEVLU1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBWMV8xOSA9IEt1YmVybmV0ZXNWZXJzaW9uLm9mKCcxLjE5Jyk7XG5cbiAgLyoqXG4gICAqIEt1YmVybmV0ZXMgdmVyc2lvbiAxLjIwXG4gICAqIEBkZXByZWNhdGVkIFVzZSBuZXdlciB2ZXJzaW9uIG9mIEVLU1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBWMV8yMCA9IEt1YmVybmV0ZXNWZXJzaW9uLm9mKCcxLjIwJyk7XG5cbiAgLyoqXG4gICAqIEt1YmVybmV0ZXMgdmVyc2lvbiAxLjIxXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFYxXzIxID0gS3ViZXJuZXRlc1ZlcnNpb24ub2YoJzEuMjEnKTtcblxuICAvKipcbiAgICogS3ViZXJuZXRlcyB2ZXJzaW9uIDEuMjJcbiAgICpcbiAgICogV2hlbiBjcmVhdGluZyBhIGBDbHVzdGVyYCB3aXRoIHRoaXMgdmVyc2lvbiwgeW91IG5lZWQgdG8gYWxzbyBzcGVjaWZ5IHRoZVxuICAgKiBga3ViZWN0bExheWVyYCBwcm9wZXJ0eSB3aXRoIGEgYEt1YmVjdGxWMjJMYXllcmAgZnJvbVxuICAgKiBgQGF3cy1jZGsvbGFtYmRhLWxheWVyLWt1YmVjdGwtdjIyYC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVjFfMjIgPSBLdWJlcm5ldGVzVmVyc2lvbi5vZignMS4yMicpO1xuXG4gIC8qKlxuICAgKiBLdWJlcm5ldGVzIHZlcnNpb24gMS4yM1xuICAgKlxuICAgKiBXaGVuIGNyZWF0aW5nIGEgYENsdXN0ZXJgIHdpdGggdGhpcyB2ZXJzaW9uLCB5b3UgbmVlZCB0byBhbHNvIHNwZWNpZnkgdGhlXG4gICAqIGBrdWJlY3RsTGF5ZXJgIHByb3BlcnR5IHdpdGggYSBgS3ViZWN0bFYyM0xheWVyYCBmcm9tXG4gICAqIGBAYXdzLWNkay9sYW1iZGEtbGF5ZXIta3ViZWN0bC12MjNgLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBWMV8yMyA9IEt1YmVybmV0ZXNWZXJzaW9uLm9mKCcxLjIzJyk7XG5cbiAgLyoqXG4gICAqIEt1YmVybmV0ZXMgdmVyc2lvbiAxLjI0XG4gICAqXG4gICAqIFdoZW4gY3JlYXRpbmcgYSBgQ2x1c3RlcmAgd2l0aCB0aGlzIHZlcnNpb24sIHlvdSBuZWVkIHRvIGFsc28gc3BlY2lmeSB0aGVcbiAgICogYGt1YmVjdGxMYXllcmAgcHJvcGVydHkgd2l0aCBhIGBLdWJlY3RsVjI0TGF5ZXJgIGZyb21cbiAgICogYEBhd3MtY2RrL2xhbWJkYS1sYXllci1rdWJlY3RsLXYyNGAuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFYxXzI0ID0gS3ViZXJuZXRlc1ZlcnNpb24ub2YoJzEuMjQnKTtcblxuICAvKipcbiAgICogS3ViZXJuZXRlcyB2ZXJzaW9uIDEuMjVcbiAgICpcbiAgICogV2hlbiBjcmVhdGluZyBhIGBDbHVzdGVyYCB3aXRoIHRoaXMgdmVyc2lvbiwgeW91IG5lZWQgdG8gYWxzbyBzcGVjaWZ5IHRoZVxuICAgKiBga3ViZWN0bExheWVyYCBwcm9wZXJ0eSB3aXRoIGEgYEt1YmVjdGxWMjVMYXllcmAgZnJvbVxuICAgKiBgQGF3cy1jZGsvbGFtYmRhLWxheWVyLWt1YmVjdGwtdjI1YC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVjFfMjUgPSBLdWJlcm5ldGVzVmVyc2lvbi5vZignMS4yNScpO1xuXG4gIC8qKlxuICAgKiBDdXN0b20gY2x1c3RlciB2ZXJzaW9uXG4gICAqIEBwYXJhbSB2ZXJzaW9uIGN1c3RvbSB2ZXJzaW9uIG51bWJlclxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBvZih2ZXJzaW9uOiBzdHJpbmcpIHsgcmV0dXJuIG5ldyBLdWJlcm5ldGVzVmVyc2lvbih2ZXJzaW9uKTsgfVxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHZlcnNpb24gY2x1c3RlciB2ZXJzaW9uIG51bWJlclxuICAgKi9cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgdmVyc2lvbjogc3RyaW5nKSB7IH1cbn1cblxuLyoqXG4gKiBFS1MgY2x1c3RlciBsb2dnaW5nIHR5cGVzXG4gKi9cbmV4cG9ydCBlbnVtIENsdXN0ZXJMb2dnaW5nVHlwZXMge1xuICAvKipcbiAgICogTG9ncyBwZXJ0YWluaW5nIHRvIEFQSSByZXF1ZXN0cyB0byB0aGUgY2x1c3Rlci5cbiAgICovXG4gIEFQSSA9ICdhcGknLFxuICAvKipcbiAgICogTG9ncyBwZXJ0YWluaW5nIHRvIGNsdXN0ZXIgYWNjZXNzIHZpYSB0aGUgS3ViZXJuZXRlcyBBUEkuXG4gICAqL1xuICBBVURJVCA9ICdhdWRpdCcsXG4gIC8qKlxuICAgKiBMb2dzIHBlcnRhaW5pbmcgdG8gYXV0aGVudGljYXRpb24gcmVxdWVzdHMgaW50byB0aGUgY2x1c3Rlci5cbiAgICovXG4gIEFVVEhFTlRJQ0FUT1IgPSAnYXV0aGVudGljYXRvcicsXG4gIC8qKlxuICAgKiBMb2dzIHBlcnRhaW5pbmcgdG8gc3RhdGUgb2YgY2x1c3RlciBjb250cm9sbGVycy5cbiAgICovXG4gIENPTlRST0xMRVJfTUFOQUdFUiA9ICdjb250cm9sbGVyTWFuYWdlcicsXG4gIC8qKlxuICAgKiBMb2dzIHBlcnRhaW5pbmcgdG8gc2NoZWR1bGluZyBkZWNpc2lvbnMuXG4gICAqL1xuICBTQ0hFRFVMRVIgPSAnc2NoZWR1bGVyJyxcbn1cblxuYWJzdHJhY3QgY2xhc3MgQ2x1c3RlckJhc2UgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElDbHVzdGVyIHtcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGNvbm5lY3Rpb25zOiBlYzIuQ29ubmVjdGlvbnM7XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSB2cGM6IGVjMi5JVnBjO1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgY2x1c3Rlck5hbWU6IHN0cmluZztcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGNsdXN0ZXJBcm46IHN0cmluZztcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGNsdXN0ZXJFbmRwb2ludDogc3RyaW5nO1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgY2x1c3RlckNlcnRpZmljYXRlQXV0aG9yaXR5RGF0YTogc3RyaW5nO1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgY2x1c3RlclNlY3VyaXR5R3JvdXBJZDogc3RyaW5nO1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgY2x1c3RlclNlY3VyaXR5R3JvdXA6IGVjMi5JU2VjdXJpdHlHcm91cDtcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGNsdXN0ZXJFbmNyeXB0aW9uQ29uZmlnS2V5QXJuOiBzdHJpbmc7XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBrdWJlY3RsUm9sZT86IGlhbS5JUm9sZTtcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGt1YmVjdGxMYW1iZGFSb2xlPzogaWFtLklSb2xlO1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkga3ViZWN0bEVudmlyb25tZW50PzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfTtcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGt1YmVjdGxTZWN1cml0eUdyb3VwPzogZWMyLklTZWN1cml0eUdyb3VwO1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkga3ViZWN0bFByaXZhdGVTdWJuZXRzPzogZWMyLklTdWJuZXRbXTtcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGt1YmVjdGxNZW1vcnk/OiBTaXplO1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgY2x1c3RlckhhbmRsZXJTZWN1cml0eUdyb3VwPzogZWMyLklTZWN1cml0eUdyb3VwO1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgcHJ1bmU6IGJvb2xlYW47XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBvcGVuSWRDb25uZWN0UHJvdmlkZXI6IGlhbS5JT3BlbklkQ29ubmVjdFByb3ZpZGVyO1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgYXdzQXV0aDogQXdzQXV0aDtcblxuICBwcml2YXRlIF9zcG90SW50ZXJydXB0SGFuZGxlcj86IEhlbG1DaGFydDtcblxuICAvKipcbiAgICogTWFuYWdlcyB0aGUgYXdzLWF1dGggY29uZmlnIG1hcC5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcm90ZWN0ZWQgX2F3c0F1dGg/OiBBd3NBdXRoO1xuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGEgS3ViZXJuZXRlcyByZXNvdXJjZSBpbiB0aGlzIGNsdXN0ZXIuXG4gICAqXG4gICAqIFRoZSBtYW5pZmVzdCB3aWxsIGJlIGFwcGxpZWQvZGVsZXRlZCB1c2luZyBrdWJlY3RsIGFzIG5lZWRlZC5cbiAgICpcbiAgICogQHBhcmFtIGlkIGxvZ2ljYWwgaWQgb2YgdGhpcyBtYW5pZmVzdFxuICAgKiBAcGFyYW0gbWFuaWZlc3QgYSBsaXN0IG9mIEt1YmVybmV0ZXMgcmVzb3VyY2Ugc3BlY2lmaWNhdGlvbnNcbiAgICogQHJldHVybnMgYSBgS3ViZXJuZXRlc1Jlc291cmNlYCBvYmplY3QuXG4gICAqL1xuICBwdWJsaWMgYWRkTWFuaWZlc3QoaWQ6IHN0cmluZywgLi4ubWFuaWZlc3Q6IFJlY29yZDxzdHJpbmcsIGFueT5bXSk6IEt1YmVybmV0ZXNNYW5pZmVzdCB7XG4gICAgcmV0dXJuIG5ldyBLdWJlcm5ldGVzTWFuaWZlc3QodGhpcywgYG1hbmlmZXN0LSR7aWR9YCwgeyBjbHVzdGVyOiB0aGlzLCBtYW5pZmVzdCB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIGEgSGVsbSBjaGFydCBpbiB0aGlzIGNsdXN0ZXIuXG4gICAqXG4gICAqIEBwYXJhbSBpZCBsb2dpY2FsIGlkIG9mIHRoaXMgY2hhcnQuXG4gICAqIEBwYXJhbSBvcHRpb25zIG9wdGlvbnMgb2YgdGhpcyBjaGFydC5cbiAgICogQHJldHVybnMgYSBgSGVsbUNoYXJ0YCBjb25zdHJ1Y3RcbiAgICovXG4gIHB1YmxpYyBhZGRIZWxtQ2hhcnQoaWQ6IHN0cmluZywgb3B0aW9uczogSGVsbUNoYXJ0T3B0aW9ucyk6IEhlbG1DaGFydCB7XG4gICAgcmV0dXJuIG5ldyBIZWxtQ2hhcnQodGhpcywgYGNoYXJ0LSR7aWR9YCwgeyBjbHVzdGVyOiB0aGlzLCAuLi5vcHRpb25zIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYSBDREs4cyBjaGFydCBpbiB0aGlzIGNsdXN0ZXIuXG4gICAqXG4gICAqIEBwYXJhbSBpZCBsb2dpY2FsIGlkIG9mIHRoaXMgY2hhcnQuXG4gICAqIEBwYXJhbSBjaGFydCB0aGUgY2RrOHMgY2hhcnQuXG4gICAqIEByZXR1cm5zIGEgYEt1YmVybmV0ZXNNYW5pZmVzdGAgY29uc3RydWN0IHJlcHJlc2VudGluZyB0aGUgY2hhcnQuXG4gICAqL1xuICBwdWJsaWMgYWRkQ2RrOHNDaGFydChpZDogc3RyaW5nLCBjaGFydDogQ29uc3RydWN0LCBvcHRpb25zOiBLdWJlcm5ldGVzTWFuaWZlc3RPcHRpb25zID0ge30pOiBLdWJlcm5ldGVzTWFuaWZlc3Qge1xuXG4gICAgY29uc3QgY2RrOHNDaGFydCA9IGNoYXJ0IGFzIGFueTtcblxuICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9jZGs4cy9ibG9iL21hc3Rlci9wYWNrYWdlcy9jZGs4cy9zcmMvY2hhcnQudHMjTDg0XG4gICAgaWYgKHR5cGVvZiBjZGs4c0NoYXJ0LnRvSnNvbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNkazhzIGNoYXJ0LiBNdXN0IGNvbnRhaW4gYSAndG9Kc29uJyBtZXRob2QsIGJ1dCBmb3VuZCAke3R5cGVvZiBjZGs4c0NoYXJ0LnRvSnNvbn1gKTtcbiAgICB9XG5cbiAgICBjb25zdCBtYW5pZmVzdCA9IG5ldyBLdWJlcm5ldGVzTWFuaWZlc3QodGhpcywgaWQsIHtcbiAgICAgIGNsdXN0ZXI6IHRoaXMsXG4gICAgICBtYW5pZmVzdDogY2RrOHNDaGFydC50b0pzb24oKSxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gbWFuaWZlc3Q7XG4gIH1cblxuICBwdWJsaWMgYWRkU2VydmljZUFjY291bnQoaWQ6IHN0cmluZywgb3B0aW9uczogU2VydmljZUFjY291bnRPcHRpb25zID0ge30pOiBTZXJ2aWNlQWNjb3VudCB7XG4gICAgcmV0dXJuIG5ldyBTZXJ2aWNlQWNjb3VudCh0aGlzLCBpZCwge1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIGNsdXN0ZXI6IHRoaXMsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSW5zdGFsbHMgdGhlIEFXUyBzcG90IGluc3RhbmNlIGludGVycnVwdCBoYW5kbGVyIG9uIHRoZSBjbHVzdGVyIGlmIGl0J3Mgbm90XG4gICAqIGFscmVhZHkgYWRkZWQuXG4gICAqL1xuICBwcml2YXRlIGFkZFNwb3RJbnRlcnJ1cHRIYW5kbGVyKCkge1xuICAgIGlmICghdGhpcy5fc3BvdEludGVycnVwdEhhbmRsZXIpIHtcbiAgICAgIHRoaXMuX3Nwb3RJbnRlcnJ1cHRIYW5kbGVyID0gdGhpcy5hZGRIZWxtQ2hhcnQoJ3Nwb3QtaW50ZXJydXB0LWhhbmRsZXInLCB7XG4gICAgICAgIGNoYXJ0OiAnYXdzLW5vZGUtdGVybWluYXRpb24taGFuZGxlcicsXG4gICAgICAgIHZlcnNpb246ICcwLjE4LjAnLFxuICAgICAgICByZXBvc2l0b3J5OiAnaHR0cHM6Ly9hd3MuZ2l0aHViLmlvL2Vrcy1jaGFydHMnLFxuICAgICAgICBuYW1lc3BhY2U6ICdrdWJlLXN5c3RlbScsXG4gICAgICAgIHZhbHVlczoge1xuICAgICAgICAgIG5vZGVTZWxlY3Rvcjoge1xuICAgICAgICAgICAgbGlmZWN5Y2xlOiBMaWZlY3ljbGVMYWJlbC5TUE9ULFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fc3BvdEludGVycnVwdEhhbmRsZXI7XG4gIH1cblxuICAvKipcbiAgICogQ29ubmVjdCBjYXBhY2l0eSBpbiB0aGUgZm9ybSBvZiBhbiBleGlzdGluZyBBdXRvU2NhbGluZ0dyb3VwIHRvIHRoZSBFS1MgY2x1c3Rlci5cbiAgICpcbiAgICogVGhlIEF1dG9TY2FsaW5nR3JvdXAgbXVzdCBiZSBydW5uaW5nIGFuIEVLUy1vcHRpbWl6ZWQgQU1JIGNvbnRhaW5pbmcgdGhlXG4gICAqIC9ldGMvZWtzL2Jvb3RzdHJhcC5zaCBzY3JpcHQuIFRoaXMgbWV0aG9kIHdpbGwgY29uZmlndXJlIFNlY3VyaXR5IEdyb3VwcyxcbiAgICogYWRkIHRoZSByaWdodCBwb2xpY2llcyB0byB0aGUgaW5zdGFuY2Ugcm9sZSwgYXBwbHkgdGhlIHJpZ2h0IHRhZ3MsIGFuZCBhZGRcbiAgICogdGhlIHJlcXVpcmVkIHVzZXIgZGF0YSB0byB0aGUgaW5zdGFuY2UncyBsYXVuY2ggY29uZmlndXJhdGlvbi5cbiAgICpcbiAgICogU3BvdCBpbnN0YW5jZXMgd2lsbCBiZSBsYWJlbGVkIGBsaWZlY3ljbGU9RWMyU3BvdGAgYW5kIHRhaW50ZWQgd2l0aCBgUHJlZmVyTm9TY2hlZHVsZWAuXG4gICAqIElmIGt1YmVjdGwgaXMgZW5hYmxlZCwgdGhlXG4gICAqIFtzcG90IGludGVycnVwdCBoYW5kbGVyXShodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9lYzItc3BvdC1sYWJzL3RyZWUvbWFzdGVyL2VjMi1zcG90LWVrcy1zb2x1dGlvbi9zcG90LXRlcm1pbmF0aW9uLWhhbmRsZXIpXG4gICAqIGRhZW1vbiB3aWxsIGJlIGluc3RhbGxlZCBvbiBhbGwgc3BvdCBpbnN0YW5jZXMgdG8gaGFuZGxlXG4gICAqIFtFQzIgU3BvdCBJbnN0YW5jZSBUZXJtaW5hdGlvbiBOb3RpY2VzXShodHRwczovL2F3cy5hbWF6b24uY29tL2Jsb2dzL2F3cy9uZXctZWMyLXNwb3QtaW5zdGFuY2UtdGVybWluYXRpb24tbm90aWNlcy8pLlxuICAgKlxuICAgKiBQcmVmZXIgdG8gdXNlIGBhZGRBdXRvU2NhbGluZ0dyb3VwQ2FwYWNpdHlgIGlmIHBvc3NpYmxlLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9la3MvbGF0ZXN0L3VzZXJndWlkZS9sYXVuY2gtd29ya2Vycy5odG1sXG4gICAqIEBwYXJhbSBhdXRvU2NhbGluZ0dyb3VwIFtkaXNhYmxlLWF3c2xpbnQ6cmVmLXZpYS1pbnRlcmZhY2VdXG4gICAqIEBwYXJhbSBvcHRpb25zIG9wdGlvbnMgZm9yIGFkZGluZyBhdXRvIHNjYWxpbmcgZ3JvdXBzLCBsaWtlIGN1c3RvbWl6aW5nIHRoZSBib290c3RyYXAgc2NyaXB0XG4gICAqL1xuICBwdWJsaWMgY29ubmVjdEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eShhdXRvU2NhbGluZ0dyb3VwOiBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwLCBvcHRpb25zOiBBdXRvU2NhbGluZ0dyb3VwT3B0aW9ucykge1xuICAgIC8vIHNlbGYgcnVsZXNcbiAgICBhdXRvU2NhbGluZ0dyb3VwLmNvbm5lY3Rpb25zLmFsbG93SW50ZXJuYWxseShlYzIuUG9ydC5hbGxUcmFmZmljKCkpO1xuXG4gICAgLy8gQ2x1c3RlciB0bzpub2RlcyBydWxlc1xuICAgIGF1dG9TY2FsaW5nR3JvdXAuY29ubmVjdGlvbnMuYWxsb3dGcm9tKHRoaXMsIGVjMi5Qb3J0LnRjcCg0NDMpKTtcbiAgICBhdXRvU2NhbGluZ0dyb3VwLmNvbm5lY3Rpb25zLmFsbG93RnJvbSh0aGlzLCBlYzIuUG9ydC50Y3BSYW5nZSgxMDI1LCA2NTUzNSkpO1xuXG4gICAgLy8gQWxsb3cgSFRUUFMgZnJvbSBOb2RlcyB0byBDbHVzdGVyXG4gICAgYXV0b1NjYWxpbmdHcm91cC5jb25uZWN0aW9ucy5hbGxvd1RvKHRoaXMsIGVjMi5Qb3J0LnRjcCg0NDMpKTtcblxuICAgIC8vIEFsbG93IGFsbCBub2RlIG91dGJvdW5kIHRyYWZmaWNcbiAgICBhdXRvU2NhbGluZ0dyb3VwLmNvbm5lY3Rpb25zLmFsbG93VG9BbnlJcHY0KGVjMi5Qb3J0LmFsbFRjcCgpKTtcbiAgICBhdXRvU2NhbGluZ0dyb3VwLmNvbm5lY3Rpb25zLmFsbG93VG9BbnlJcHY0KGVjMi5Qb3J0LmFsbFVkcCgpKTtcbiAgICBhdXRvU2NhbGluZ0dyb3VwLmNvbm5lY3Rpb25zLmFsbG93VG9BbnlJcHY0KGVjMi5Qb3J0LmFsbEljbXAoKSk7XG5cbiAgICAvLyBhbGxvdyB0cmFmZmljIHRvL2Zyb20gbWFuYWdlZCBub2RlIGdyb3VwcyAoZWtzIGF0dGFjaGVzIHRoaXMgc2VjdXJpdHkgZ3JvdXAgdG8gdGhlIG1hbmFnZWQgbm9kZXMpXG4gICAgYXV0b1NjYWxpbmdHcm91cC5hZGRTZWN1cml0eUdyb3VwKHRoaXMuY2x1c3RlclNlY3VyaXR5R3JvdXApO1xuXG4gICAgY29uc3QgYm9vdHN0cmFwRW5hYmxlZCA9IG9wdGlvbnMuYm9vdHN0cmFwRW5hYmxlZCA/PyB0cnVlO1xuICAgIGlmIChvcHRpb25zLmJvb3RzdHJhcE9wdGlvbnMgJiYgIWJvb3RzdHJhcEVuYWJsZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHNwZWNpZnkgXCJib290c3RyYXBPcHRpb25zXCIgaWYgXCJib290c3RyYXBFbmFibGVkXCIgaXMgZmFsc2UnKTtcbiAgICB9XG5cbiAgICBpZiAoYm9vdHN0cmFwRW5hYmxlZCkge1xuICAgICAgY29uc3QgdXNlckRhdGEgPSBvcHRpb25zLm1hY2hpbmVJbWFnZVR5cGUgPT09IE1hY2hpbmVJbWFnZVR5cGUuQk9UVExFUk9DS0VUID9cbiAgICAgICAgcmVuZGVyQm90dGxlcm9ja2V0VXNlckRhdGEodGhpcykgOlxuICAgICAgICByZW5kZXJBbWF6b25MaW51eFVzZXJEYXRhKHRoaXMsIGF1dG9TY2FsaW5nR3JvdXAsIG9wdGlvbnMuYm9vdHN0cmFwT3B0aW9ucyk7XG4gICAgICBhdXRvU2NhbGluZ0dyb3VwLmFkZFVzZXJEYXRhKC4uLnVzZXJEYXRhKTtcbiAgICB9XG5cbiAgICBhdXRvU2NhbGluZ0dyb3VwLnJvbGUuYWRkTWFuYWdlZFBvbGljeShpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ0FtYXpvbkVLU1dvcmtlck5vZGVQb2xpY3knKSk7XG4gICAgYXV0b1NjYWxpbmdHcm91cC5yb2xlLmFkZE1hbmFnZWRQb2xpY3koaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdBbWF6b25FS1NfQ05JX1BvbGljeScpKTtcbiAgICBhdXRvU2NhbGluZ0dyb3VwLnJvbGUuYWRkTWFuYWdlZFBvbGljeShpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ0FtYXpvbkVDMkNvbnRhaW5lclJlZ2lzdHJ5UmVhZE9ubHknKSk7XG5cbiAgICAvLyBFS1MgUmVxdWlyZWQgVGFnc1xuICAgIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9la3MvbGF0ZXN0L3VzZXJndWlkZS93b3JrZXIuaHRtbFxuICAgIFRhZ3Mub2YoYXV0b1NjYWxpbmdHcm91cCkuYWRkKGBrdWJlcm5ldGVzLmlvL2NsdXN0ZXIvJHt0aGlzLmNsdXN0ZXJOYW1lfWAsICdvd25lZCcsIHtcbiAgICAgIGFwcGx5VG9MYXVuY2hlZEluc3RhbmNlczogdHJ1ZSxcbiAgICAgIC8vIGV4Y2x1ZGUgc2VjdXJpdHkgZ3JvdXBzIHRvIGF2b2lkIG11bHRpcGxlIFwib3duZWRcIiBzZWN1cml0eSBncm91cHMuXG4gICAgICAvLyAodGhlIGNsdXN0ZXIgc2VjdXJpdHkgZ3JvdXAgYWxyZWFkeSBoYXMgdGhpcyB0YWcpXG4gICAgICBleGNsdWRlUmVzb3VyY2VUeXBlczogWydBV1M6OkVDMjo6U2VjdXJpdHlHcm91cCddLFxuICAgIH0pO1xuXG4gICAgLy8gZG8gbm90IGF0dGVtcHQgdG8gbWFwIHRoZSByb2xlIGlmIGBrdWJlY3RsYCBpcyBub3QgZW5hYmxlZCBmb3IgdGhpc1xuICAgIC8vIGNsdXN0ZXIgb3IgaWYgYG1hcFJvbGVgIGlzIHNldCB0byBmYWxzZS4gQnkgZGVmYXVsdCB0aGlzIHNob3VsZCBoYXBwZW4uXG4gICAgbGV0IG1hcFJvbGUgPSBvcHRpb25zLm1hcFJvbGUgPz8gdHJ1ZTtcbiAgICBpZiAobWFwUm9sZSAmJiAhKHRoaXMgaW5zdGFuY2VvZiBDbHVzdGVyKSkge1xuICAgICAgLy8gZG8gdGhlIG1hcHBpbmcuLi5cbiAgICAgIEFubm90YXRpb25zLm9mKGF1dG9TY2FsaW5nR3JvdXApLmFkZFdhcm5pbmcoJ0F1dG8tbWFwcGluZyBhd3MtYXV0aCByb2xlIGZvciBpbXBvcnRlZCBjbHVzdGVyIGlzIG5vdCBzdXBwb3J0ZWQsIHBsZWFzZSBtYXAgcm9sZSBtYW51YWxseScpO1xuICAgICAgbWFwUm9sZSA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAobWFwUm9sZSkge1xuICAgICAgLy8gc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9lbl91cy9la3MvbGF0ZXN0L3VzZXJndWlkZS9hZGQtdXNlci1yb2xlLmh0bWxcbiAgICAgIHRoaXMuYXdzQXV0aC5hZGRSb2xlTWFwcGluZyhhdXRvU2NhbGluZ0dyb3VwLnJvbGUsIHtcbiAgICAgICAgdXNlcm5hbWU6ICdzeXN0ZW06bm9kZTp7e0VDMlByaXZhdGVETlNOYW1lfX0nLFxuICAgICAgICBncm91cHM6IFtcbiAgICAgICAgICAnc3lzdGVtOmJvb3RzdHJhcHBlcnMnLFxuICAgICAgICAgICdzeXN0ZW06bm9kZXMnLFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHNpbmNlIHdlIGFyZSBub3QgbWFwcGluZyB0aGUgaW5zdGFuY2Ugcm9sZSB0byBSQkFDLCBzeW50aGVzaXplIGFuXG4gICAgICAvLyBvdXRwdXQgc28gaXQgY2FuIGJlIHBhc3RlZCBpbnRvIGBhd3MtYXV0aC1jbS55YW1sYFxuICAgICAgbmV3IENmbk91dHB1dChhdXRvU2NhbGluZ0dyb3VwLCAnSW5zdGFuY2VSb2xlQVJOJywge1xuICAgICAgICB2YWx1ZTogYXV0b1NjYWxpbmdHcm91cC5yb2xlLnJvbGVBcm4sXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBhZGRTcG90SW50ZXJydXB0SGFuZGxlciA9IG9wdGlvbnMuc3BvdEludGVycnVwdEhhbmRsZXIgPz8gdHJ1ZTtcbiAgICAvLyBpZiB0aGlzIGlzIGFuIEFTRyB3aXRoIHNwb3QgaW5zdGFuY2VzLCBpbnN0YWxsIHRoZSBzcG90IGludGVycnVwdCBoYW5kbGVyIChvbmx5IGlmIGt1YmVjdGwgaXMgZW5hYmxlZCkuXG4gICAgaWYgKGF1dG9TY2FsaW5nR3JvdXAuc3BvdFByaWNlICYmIGFkZFNwb3RJbnRlcnJ1cHRIYW5kbGVyKSB7XG4gICAgICB0aGlzLmFkZFNwb3RJbnRlcnJ1cHRIYW5kbGVyKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBDbHVzdGVyICYmIHRoaXMuYWxiQ29udHJvbGxlcikge1xuICAgICAgLy8gdGhlIGNvbnRyb2xsZXIgcnVucyBvbiB0aGUgd29ya2VyIG5vZGVzIHNvIHRoZXkgY2Fubm90XG4gICAgICAvLyBiZSBkZWxldGVkIGJlZm9yZSB0aGUgY29udHJvbGxlci5cbiAgICAgIE5vZGUub2YodGhpcy5hbGJDb250cm9sbGVyKS5hZGREZXBlbmRlbmN5KGF1dG9TY2FsaW5nR3JvdXApO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGZldGNoaW5nIGEgU2VydmljZUxvYWRCYWxhbmNlckFkZHJlc3MuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2VydmljZUxvYWRCYWxhbmNlckFkZHJlc3NPcHRpb25zIHtcblxuICAvKipcbiAgICogVGltZW91dCBmb3Igd2FpdGluZyBvbiB0aGUgbG9hZCBiYWxhbmNlciBhZGRyZXNzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBEdXJhdGlvbi5taW51dGVzKDUpXG4gICAqL1xuICByZWFkb25seSB0aW1lb3V0PzogRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lc3BhY2UgdGhlIHNlcnZpY2UgYmVsb25ncyB0by5cbiAgICpcbiAgICogQGRlZmF1bHQgJ2RlZmF1bHQnXG4gICAqL1xuICByZWFkb25seSBuYW1lc3BhY2U/OiBzdHJpbmc7XG5cbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciBmZXRjaGluZyBhbiBJbmdyZXNzTG9hZEJhbGFuY2VyQWRkcmVzcy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJbmdyZXNzTG9hZEJhbGFuY2VyQWRkcmVzc09wdGlvbnMgZXh0ZW5kcyBTZXJ2aWNlTG9hZEJhbGFuY2VyQWRkcmVzc09wdGlvbnMge307XG5cbi8qKlxuICogQSBDbHVzdGVyIHJlcHJlc2VudHMgYSBtYW5hZ2VkIEt1YmVybmV0ZXMgU2VydmljZSAoRUtTKVxuICpcbiAqIFRoaXMgaXMgYSBmdWxseSBtYW5hZ2VkIGNsdXN0ZXIgb2YgQVBJIFNlcnZlcnMgKGNvbnRyb2wtcGxhbmUpXG4gKiBUaGUgdXNlciBpcyBzdGlsbCByZXF1aXJlZCB0byBjcmVhdGUgdGhlIHdvcmtlciBub2Rlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIENsdXN0ZXIgZXh0ZW5kcyBDbHVzdGVyQmFzZSB7XG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gZXhpc3RpbmcgY2x1c3RlclxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgdGhlIGNvbnN0cnVjdCBzY29wZSwgaW4gbW9zdCBjYXNlcyAndGhpcydcbiAgICogQHBhcmFtIGlkIHRoZSBpZCBvciBuYW1lIHRvIGltcG9ydCBhc1xuICAgKiBAcGFyYW0gYXR0cnMgdGhlIGNsdXN0ZXIgcHJvcGVydGllcyB0byB1c2UgZm9yIGltcG9ydGluZyBpbmZvcm1hdGlvblxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQ2x1c3RlckF0dHJpYnV0ZXMoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgYXR0cnM6IENsdXN0ZXJBdHRyaWJ1dGVzKTogSUNsdXN0ZXIge1xuICAgIHJldHVybiBuZXcgSW1wb3J0ZWRDbHVzdGVyKHNjb3BlLCBpZCwgYXR0cnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBWUEMgaW4gd2hpY2ggdGhpcyBDbHVzdGVyIHdhcyBjcmVhdGVkXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgdnBjOiBlYzIuSVZwYztcblxuICAvKipcbiAgICogVGhlIE5hbWUgb2YgdGhlIGNyZWF0ZWQgRUtTIENsdXN0ZXJcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBjbHVzdGVyTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQVdTIGdlbmVyYXRlZCBBUk4gZm9yIHRoZSBDbHVzdGVyIHJlc291cmNlXG4gICAqXG4gICAqIEZvciBleGFtcGxlLCBgYXJuOmF3czpla3M6dXMtd2VzdC0yOjY2NjY2NjY2NjY2NjpjbHVzdGVyL3Byb2RgXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgY2x1c3RlckFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZW5kcG9pbnQgVVJMIGZvciB0aGUgQ2x1c3RlclxuICAgKlxuICAgKiBUaGlzIGlzIHRoZSBVUkwgaW5zaWRlIHRoZSBrdWJlY29uZmlnIGZpbGUgdG8gdXNlIHdpdGgga3ViZWN0bFxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgYGh0dHBzOi8vNUUxRDBDRVhBTVBMRUE1OTFCNzQ2QUZDNUFCMzAyNjIueWw0LnVzLXdlc3QtMi5la3MuYW1hem9uYXdzLmNvbWBcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBjbHVzdGVyRW5kcG9pbnQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGNlcnRpZmljYXRlLWF1dGhvcml0eS1kYXRhIGZvciB5b3VyIGNsdXN0ZXIuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgY2x1c3RlckNlcnRpZmljYXRlQXV0aG9yaXR5RGF0YTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgaWQgb2YgdGhlIGNsdXN0ZXIgc2VjdXJpdHkgZ3JvdXAgdGhhdCB3YXMgY3JlYXRlZCBieSBBbWF6b24gRUtTIGZvciB0aGUgY2x1c3Rlci5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBjbHVzdGVyU2VjdXJpdHlHcm91cElkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBjbHVzdGVyIHNlY3VyaXR5IGdyb3VwIHRoYXQgd2FzIGNyZWF0ZWQgYnkgQW1hem9uIEVLUyBmb3IgdGhlIGNsdXN0ZXIuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgY2x1c3RlclNlY3VyaXR5R3JvdXA6IGVjMi5JU2VjdXJpdHlHcm91cDtcblxuICAvKipcbiAgICogQW1hem9uIFJlc291cmNlIE5hbWUgKEFSTikgb3IgYWxpYXMgb2YgdGhlIGN1c3RvbWVyIG1hc3RlciBrZXkgKENNSykuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgY2x1c3RlckVuY3J5cHRpb25Db25maWdLZXlBcm46IHN0cmluZztcblxuICAvKipcbiAgICogTWFuYWdlcyBjb25uZWN0aW9uIHJ1bGVzIChTZWN1cml0eSBHcm91cCBSdWxlcykgZm9yIHRoZSBjbHVzdGVyXG4gICAqXG4gICAqIEB0eXBlIHtlYzIuQ29ubmVjdGlvbnN9XG4gICAqIEBtZW1iZXJvZiBDbHVzdGVyXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgY29ubmVjdGlvbnM6IGVjMi5Db25uZWN0aW9ucztcblxuICAvKipcbiAgICogSUFNIHJvbGUgYXNzdW1lZCBieSB0aGUgRUtTIENvbnRyb2wgUGxhbmVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSByb2xlOiBpYW0uSVJvbGU7XG5cbiAgLyoqXG4gICAqIFRoZSBhdXRvIHNjYWxpbmcgZ3JvdXAgdGhhdCBob3N0cyB0aGUgZGVmYXVsdCBjYXBhY2l0eSBmb3IgdGhpcyBjbHVzdGVyLlxuICAgKiBUaGlzIHdpbGwgYmUgYHVuZGVmaW5lZGAgaWYgdGhlIGBkZWZhdWx0Q2FwYWNpdHlUeXBlYCBpcyBub3QgYEVDMmAgb3JcbiAgICogYGRlZmF1bHRDYXBhY2l0eVR5cGVgIGlzIGBFQzJgIGJ1dCBkZWZhdWx0IGNhcGFjaXR5IGlzIHNldCB0byAwLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGRlZmF1bHRDYXBhY2l0eT86IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXA7XG5cbiAgLyoqXG4gICAqIFRoZSBub2RlIGdyb3VwIHRoYXQgaG9zdHMgdGhlIGRlZmF1bHQgY2FwYWNpdHkgZm9yIHRoaXMgY2x1c3Rlci5cbiAgICogVGhpcyB3aWxsIGJlIGB1bmRlZmluZWRgIGlmIHRoZSBgZGVmYXVsdENhcGFjaXR5VHlwZWAgaXMgYEVDMmAgb3JcbiAgICogYGRlZmF1bHRDYXBhY2l0eVR5cGVgIGlzIGBOT0RFR1JPVVBgIGJ1dCBkZWZhdWx0IGNhcGFjaXR5IGlzIHNldCB0byAwLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGRlZmF1bHROb2RlZ3JvdXA/OiBOb2RlZ3JvdXA7XG5cbiAgLyoqXG4gICAqIEFuIElBTSByb2xlIHRoYXQgY2FuIHBlcmZvcm0ga3ViZWN0bCBvcGVyYXRpb25zIGFnYWluc3QgdGhpcyBjbHVzdGVyLlxuICAgKlxuICAgKiBUaGUgcm9sZSBzaG91bGQgYmUgbWFwcGVkIHRvIHRoZSBgc3lzdGVtOm1hc3RlcnNgIEt1YmVybmV0ZXMgUkJBQyByb2xlLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGt1YmVjdGxSb2xlPzogaWFtLklSb2xlO1xuXG4gIC8qKlxuICAgKiBBbiBJQU0gcm9sZSB0aGF0IGNhbiBwZXJmb3JtIGt1YmVjdGwgb3BlcmF0aW9ucyBhZ2FpbnN0IHRoaXMgY2x1c3Rlci5cbiAgICpcbiAgICogVGhlIHJvbGUgc2hvdWxkIGJlIG1hcHBlZCB0byB0aGUgYHN5c3RlbTptYXN0ZXJzYCBLdWJlcm5ldGVzIFJCQUMgcm9sZS5cbiAgICpcbiAgICogVGhpcyByb2xlIGlzIGRpcmVjdGx5IHBhc3NlZCB0byB0aGUgbGFtYmRhIGhhbmRsZXIgdGhhdCBzZW5kcyBLdWJlIEN0bCBjb21tYW5kcyB0byB0aGUgY2x1c3Rlci5cbiAgICogQGRlZmF1bHQgLSBpZiBub3Qgc3BlY2lmaWVkLCB0aGUgZGVmYXVsdCByb2xlIGNyZWF0ZWQgYnkgYSBsYW1iZGEgZnVuY3Rpb24gd2lsbFxuICAgKiBiZSB1c2VkLlxuICAgKi9cblxuICBwdWJsaWMgcmVhZG9ubHkga3ViZWN0bExhbWJkYVJvbGU/OiBpYW0uSVJvbGU7XG5cbiAgLyoqXG4gICAqIEN1c3RvbSBlbnZpcm9ubWVudCB2YXJpYWJsZXMgd2hlbiBydW5uaW5nIGBrdWJlY3RsYCBhZ2FpbnN0IHRoaXMgY2x1c3Rlci5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBrdWJlY3RsRW52aXJvbm1lbnQ/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9O1xuXG4gIC8qKlxuICAgKiBBIHNlY3VyaXR5IGdyb3VwIHRvIHVzZSBmb3IgYGt1YmVjdGxgIGV4ZWN1dGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBJZiBub3Qgc3BlY2lmaWVkLCB0aGUgazhzIGVuZHBvaW50IGlzIGV4cGVjdGVkIHRvIGJlIGFjY2Vzc2libGVcbiAgICogcHVibGljbHkuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkga3ViZWN0bFNlY3VyaXR5R3JvdXA/OiBlYzIuSVNlY3VyaXR5R3JvdXA7XG5cbiAgLyoqXG4gICAqIFN1Ym5ldHMgdG8gaG9zdCB0aGUgYGt1YmVjdGxgIGNvbXB1dGUgcmVzb3VyY2VzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIElmIG5vdCBzcGVjaWZpZWQsIHRoZSBrOHMgZW5kcG9pbnQgaXMgZXhwZWN0ZWQgdG8gYmUgYWNjZXNzaWJsZVxuICAgKiBwdWJsaWNseS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBrdWJlY3RsUHJpdmF0ZVN1Ym5ldHM/OiBlYzIuSVN1Ym5ldFtdO1xuXG4gIC8qKlxuICAgKiBBbiBJQU0gcm9sZSB3aXRoIGFkbWluaXN0cmF0aXZlIHBlcm1pc3Npb25zIHRvIGNyZWF0ZSBvciB1cGRhdGUgdGhlXG4gICAqIGNsdXN0ZXIuIFRoaXMgcm9sZSBhbHNvIGhhcyBgc3lzdGVtczptYXN0ZXJgIHBlcm1pc3Npb25zLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGFkbWluUm9sZTogaWFtLlJvbGU7XG5cbiAgLyoqXG4gICAqIElmIHRoZSBjbHVzdGVyIGhhcyBvbmUgKG9yIG1vcmUpIEZhcmdhdGVQcm9maWxlcyBhc3NvY2lhdGVkLCB0aGlzIGFycmF5XG4gICAqIHdpbGwgaG9sZCBhIHJlZmVyZW5jZSB0byBlYWNoLlxuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfZmFyZ2F0ZVByb2ZpbGVzOiBGYXJnYXRlUHJvZmlsZVtdID0gW107XG5cbiAgLyoqXG4gICAqIGFuIE9wZW4gSUQgQ29ubmVjdCBQcm92aWRlciBpbnN0YW5jZVxuICAgKi9cbiAgcHJpdmF0ZSBfb3BlbklkQ29ubmVjdFByb3ZpZGVyPzogaWFtLklPcGVuSWRDb25uZWN0UHJvdmlkZXI7XG5cbiAgLyoqXG4gICAqIEFuIEFXUyBMYW1iZGEgbGF5ZXIgdGhhdCBpbmNsdWRlcyBga3ViZWN0bGAgYW5kIGBoZWxtYFxuICAgKlxuICAgKiBJZiBub3QgZGVmaW5lZCwgYSBkZWZhdWx0IGxheWVyIHdpbGwgYmUgdXNlZCBjb250YWluaW5nIEt1YmVjdGwgMS4yMCBhbmQgSGVsbSAzLjhcbiAgICovXG4gIHJlYWRvbmx5IGt1YmVjdGxMYXllcj86IGxhbWJkYS5JTGF5ZXJWZXJzaW9uO1xuXG4gIC8qKlxuICAgKiBBbiBBV1MgTGFtYmRhIGxheWVyIHRoYXQgY29udGFpbnMgdGhlIGBhd3NgIENMSS5cbiAgICpcbiAgICogSWYgbm90IGRlZmluZWQsIGEgZGVmYXVsdCBsYXllciB3aWxsIGJlIHVzZWQgY29udGFpbmluZyB0aGUgQVdTIENMSSAxLnguXG4gICAqL1xuICByZWFkb25seSBhd3NjbGlMYXllcj86IGxhbWJkYS5JTGF5ZXJWZXJzaW9uO1xuXG4gIC8qKlxuICAgKiBUaGUgYW1vdW50IG9mIG1lbW9yeSBhbGxvY2F0ZWQgdG8gdGhlIGt1YmVjdGwgcHJvdmlkZXIncyBsYW1iZGEgZnVuY3Rpb24uXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkga3ViZWN0bE1lbW9yeT86IFNpemU7XG5cbiAgLyoqXG4gICAqIEEgc2VjdXJpdHkgZ3JvdXAgdG8gYXNzb2NpYXRlIHdpdGggdGhlIENsdXN0ZXIgSGFuZGxlcidzIExhbWJkYXMuXG4gICAqIFRoZSBDbHVzdGVyIEhhbmRsZXIncyBMYW1iZGFzIGFyZSByZXNwb25zaWJsZSBmb3IgY2FsbGluZyBBV1MncyBFS1MgQVBJLlxuICAgKlxuICAgKiBSZXF1aXJlcyBgcGxhY2VDbHVzdGVySGFuZGxlckluVnBjYCB0byBiZSBzZXQgdG8gdHJ1ZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBzZWN1cml0eSBncm91cC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBjbHVzdGVySGFuZGxlclNlY3VyaXR5R3JvdXA/OiBlYzIuSVNlY3VyaXR5R3JvdXA7XG5cbiAgLyoqXG4gICAqIFRoZSBBV1MgTGFtYmRhIGxheWVyIHRoYXQgY29udGFpbnMgdGhlIE5QTSBkZXBlbmRlbmN5IGBwcm94eS1hZ2VudGAuIElmXG4gICAqIHVuZGVmaW5lZCwgYSBTQVIgYXBwIHRoYXQgY29udGFpbnMgdGhpcyBsYXllciB3aWxsIGJlIHVzZWQuXG4gICAqL1xuICByZWFkb25seSBvbkV2ZW50TGF5ZXI/OiBsYW1iZGEuSUxheWVyVmVyc2lvbjtcblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiBLdWJlcm5ldGVzIHJlc291cmNlcyBjYW4gYmUgcHJ1bmVkIGF1dG9tYXRpY2FsbHkuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcHJ1bmU6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBBTEIgQ29udHJvbGxlciBjb25zdHJ1Y3QgZGVmaW5lZCBmb3IgdGhpcyBjbHVzdGVyLlxuICAgKiBXaWxsIGJlIHVuZGVmaW5lZCBpZiBgYWxiQ29udHJvbGxlcmAgd2Fzbid0IGNvbmZpZ3VyZWQuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgYWxiQ29udHJvbGxlcj86IEFsYkNvbnRyb2xsZXI7XG5cbiAgLyoqXG4gICAqIElmIHRoaXMgY2x1c3RlciBpcyBrdWJlY3RsLWVuYWJsZWQsIHJldHVybnMgdGhlIGBDbHVzdGVyUmVzb3VyY2VgIG9iamVjdFxuICAgKiB0aGF0IG1hbmFnZXMgaXQuIElmIHRoaXMgY2x1c3RlciBpcyBub3Qga3ViZWN0bC1lbmFibGVkIChpLmUuIHVzZXMgdGhlXG4gICAqIHN0b2NrIGBDZm5DbHVzdGVyYCksIHRoaXMgaXMgYHVuZGVmaW5lZGAuXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9jbHVzdGVyUmVzb3VyY2U6IENsdXN0ZXJSZXNvdXJjZTtcblxuICBwcml2YXRlIF9uZXVyb25EZXZpY2VQbHVnaW4/OiBLdWJlcm5ldGVzTWFuaWZlc3Q7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBlbmRwb2ludEFjY2VzczogRW5kcG9pbnRBY2Nlc3M7XG5cbiAgcHJpdmF0ZSByZWFkb25seSB2cGNTdWJuZXRzOiBlYzIuU3VibmV0U2VsZWN0aW9uW107XG5cbiAgcHJpdmF0ZSByZWFkb25seSB2ZXJzaW9uOiBLdWJlcm5ldGVzVmVyc2lvbjtcblxuICBwcml2YXRlIHJlYWRvbmx5IGxvZ2dpbmc/OiB7IFtrZXk6IHN0cmluZ106IFsgeyBba2V5OiBzdHJpbmddOiBhbnkgfSBdIH07XG5cbiAgLyoqXG4gICAqIEEgZHVtbXkgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgdGhhdCBpcyB1c2VkIGFzIGEgd2FpdCBiYXJyaWVyIHdoaWNoXG4gICAqIHJlcHJlc2VudHMgdGhhdCB0aGUgY2x1c3RlciBpcyByZWFkeSB0byByZWNlaXZlIFwia3ViZWN0bFwiIGNvbW1hbmRzLlxuICAgKlxuICAgKiBTcGVjaWZpY2FsbHksIGFsbCBmYXJnYXRlIHByb2ZpbGVzIGFyZSBhdXRvbWF0aWNhbGx5IGFkZGVkIGFzIGEgZGVwZW5kZW5jeVxuICAgKiBvZiB0aGlzIGJhcnJpZXIsIHdoaWNoIG1lYW5zIHRoYXQgaXQgd2lsbCBvbmx5IGJlIFwic2lnbmFsZWRcIiB3aGVuIGFsbFxuICAgKiBmYXJnYXRlIHByb2ZpbGVzIGhhdmUgYmVlbiBzdWNjZXNzZnVsbHkgY3JlYXRlZC5cbiAgICpcbiAgICogV2hlbiBrdWJlY3RsIHJlc291cmNlcyBjYWxsIGBfYXR0YWNoS3ViZWN0bFJlc291cmNlU2NvcGUoKWAsIHRoaXMgcmVzb3VyY2VcbiAgICogaXMgYWRkZWQgYXMgdGhlaXIgZGVwZW5kZW5jeSB3aGljaCBpbXBsaWVzIHRoYXQgdGhleSBjYW4gb25seSBiZSBkZXBsb3llZFxuICAgKiBhZnRlciB0aGUgY2x1c3RlciBpcyByZWFkeS5cbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2t1YmVjdGxSZWFkeUJhcnJpZXI6IENmblJlc291cmNlO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgX2t1YmVjdGxSZXNvdXJjZVByb3ZpZGVyOiBLdWJlY3RsUHJvdmlkZXI7XG5cbiAgLyoqXG4gICAqIEluaXRpYXRlcyBhbiBFS1MgQ2x1c3RlciB3aXRoIHRoZSBzdXBwbGllZCBhcmd1bWVudHNcbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIGEgQ29uc3RydWN0LCBtb3N0IGxpa2VseSBhIGNkay5TdGFjayBjcmVhdGVkXG4gICAqIEBwYXJhbSBpZCB0aGUgaWQgb2YgdGhlIENvbnN0cnVjdCB0byBjcmVhdGVcbiAgICogQHBhcmFtIHByb3BzIHByb3BlcnRpZXMgaW4gdGhlIElDbHVzdGVyUHJvcHMgaW50ZXJmYWNlXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2x1c3RlclByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzLmNsdXN0ZXJOYW1lLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc3RhY2sgPSBTdGFjay5vZih0aGlzKTtcblxuICAgIHRoaXMucHJ1bmUgPSBwcm9wcy5wcnVuZSA/PyB0cnVlO1xuICAgIHRoaXMudnBjID0gcHJvcHMudnBjIHx8IG5ldyBlYzIuVnBjKHRoaXMsICdEZWZhdWx0VnBjJyk7XG5cbiAgICBjb25zdCBrdWJlY3RsVmVyc2lvbiA9IG5ldyBzZW12ZXIuU2VtVmVyKGAke3Byb3BzLnZlcnNpb24udmVyc2lvbn0uMGApO1xuICAgIGlmIChzZW12ZXIuZ3RlKGt1YmVjdGxWZXJzaW9uLCAnMS4yMi4wJykgJiYgIXByb3BzLmt1YmVjdGxMYXllcikge1xuICAgICAgQW5ub3RhdGlvbnMub2YodGhpcykuYWRkV2FybmluZyhgWW91IGNyZWF0ZWQgYSBjbHVzdGVyIHdpdGggS3ViZXJuZXRlcyBWZXJzaW9uICR7cHJvcHMudmVyc2lvbi52ZXJzaW9ufSB3aXRob3V0IHNwZWNpZnlpbmcgdGhlIGt1YmVjdGxMYXllciBwcm9wZXJ0eS4gVGhpcyBtYXkgY2F1c2UgZmFpbHVyZXMgYXMgdGhlIGt1YmVjdGwgdmVyc2lvbiBwcm92aWRlZCB3aXRoIGF3cy1jZGstbGliIGlzIDEuMjAsIHdoaWNoIGlzIG9ubHkgZ3VhcmFudGVlZCB0byBiZSBjb21wYXRpYmxlIHdpdGggS3ViZXJuZXRlcyB2ZXJzaW9ucyAxLjE5LTEuMjEuIFBsZWFzZSBwcm92aWRlIGEga3ViZWN0bExheWVyIGZyb20gQGF3cy1jZGsvbGFtYmRhLWxheWVyLWt1YmVjdGwtdiR7a3ViZWN0bFZlcnNpb24ubWlub3J9LmApO1xuICAgIH07XG4gICAgdGhpcy52ZXJzaW9uID0gcHJvcHMudmVyc2lvbjtcbiAgICB0aGlzLmt1YmVjdGxMYW1iZGFSb2xlID0gcHJvcHMua3ViZWN0bExhbWJkYVJvbGUgPyBwcm9wcy5rdWJlY3RsTGFtYmRhUm9sZSA6IHVuZGVmaW5lZDtcblxuICAgIHRoaXMudGFnU3VibmV0cygpO1xuXG4gICAgLy8gdGhpcyBpcyB0aGUgcm9sZSB1c2VkIGJ5IEVLUyB3aGVuIGludGVyYWN0aW5nIHdpdGggQVdTIHJlc291cmNlc1xuICAgIHRoaXMucm9sZSA9IHByb3BzLnJvbGUgfHwgbmV3IGlhbS5Sb2xlKHRoaXMsICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2Vrcy5hbWF6b25hd3MuY29tJyksXG4gICAgICBtYW5hZ2VkUG9saWNpZXM6IFtcbiAgICAgICAgaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdBbWF6b25FS1NDbHVzdGVyUG9saWN5JyksXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc2VjdXJpdHlHcm91cCA9IHByb3BzLnNlY3VyaXR5R3JvdXAgfHwgbmV3IGVjMi5TZWN1cml0eUdyb3VwKHRoaXMsICdDb250cm9sUGxhbmVTZWN1cml0eUdyb3VwJywge1xuICAgICAgdnBjOiB0aGlzLnZwYyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRUtTIENvbnRyb2wgUGxhbmUgU2VjdXJpdHkgR3JvdXAnLFxuICAgIH0pO1xuXG4gICAgdGhpcy52cGNTdWJuZXRzID0gcHJvcHMudnBjU3VibmV0cyA/PyBbeyBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QVUJMSUMgfSwgeyBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTIH1dO1xuXG4gICAgY29uc3Qgc2VsZWN0ZWRTdWJuZXRJZHNQZXJHcm91cCA9IHRoaXMudnBjU3VibmV0cy5tYXAocyA9PiB0aGlzLnZwYy5zZWxlY3RTdWJuZXRzKHMpLnN1Ym5ldElkcyk7XG4gICAgaWYgKHNlbGVjdGVkU3VibmV0SWRzUGVyR3JvdXAuc29tZShUb2tlbi5pc1VucmVzb2x2ZWQpICYmIHNlbGVjdGVkU3VibmV0SWRzUGVyR3JvdXAubGVuZ3RoID4gMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdla3MuQ2x1c3RlcjogY2Fubm90IHNlbGVjdCBtdWx0aXBsZSBzdWJuZXQgZ3JvdXBzIGZyb20gYSBWUEMgaW1wb3J0ZWQgZnJvbSBsaXN0IHRva2VucyB3aXRoIHVua25vd24gbGVuZ3RoLiBTZWxlY3Qgb25seSBvbmUgc3VibmV0IGdyb3VwLCBwYXNzIGEgbGVuZ3RoIHRvIEZuLnNwbGl0LCBvciBzd2l0Y2ggdG8gVnBjLmZyb21Mb29rdXAuJyk7XG4gICAgfVxuXG4gICAgLy8gR2V0IHN1Ym5ldElkcyBmb3IgYWxsIHNlbGVjdGVkIHN1Ym5ldHNcbiAgICBjb25zdCBzdWJuZXRJZHMgPSBBcnJheS5mcm9tKG5ldyBTZXQoZmxhdHRlbihzZWxlY3RlZFN1Ym5ldElkc1Blckdyb3VwKSkpO1xuXG4gICAgdGhpcy5sb2dnaW5nID0gcHJvcHMuY2x1c3RlckxvZ2dpbmcgPyB7XG4gICAgICBjbHVzdGVyTG9nZ2luZzogW1xuICAgICAgICB7XG4gICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICB0eXBlczogT2JqZWN0LnZhbHVlcyhwcm9wcy5jbHVzdGVyTG9nZ2luZyksXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0gOiB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLmVuZHBvaW50QWNjZXNzID0gcHJvcHMuZW5kcG9pbnRBY2Nlc3MgPz8gRW5kcG9pbnRBY2Nlc3MuUFVCTElDX0FORF9QUklWQVRFO1xuICAgIHRoaXMua3ViZWN0bEVudmlyb25tZW50ID0gcHJvcHMua3ViZWN0bEVudmlyb25tZW50O1xuICAgIHRoaXMua3ViZWN0bExheWVyID0gcHJvcHMua3ViZWN0bExheWVyO1xuICAgIHRoaXMuYXdzY2xpTGF5ZXIgPSBwcm9wcy5hd3NjbGlMYXllcjtcbiAgICB0aGlzLmt1YmVjdGxNZW1vcnkgPSBwcm9wcy5rdWJlY3RsTWVtb3J5O1xuXG4gICAgdGhpcy5vbkV2ZW50TGF5ZXIgPSBwcm9wcy5vbkV2ZW50TGF5ZXI7XG4gICAgdGhpcy5jbHVzdGVySGFuZGxlclNlY3VyaXR5R3JvdXAgPSBwcm9wcy5jbHVzdGVySGFuZGxlclNlY3VyaXR5R3JvdXA7XG5cbiAgICBjb25zdCBwcml2YXRlU3VibmV0cyA9IHRoaXMuc2VsZWN0UHJpdmF0ZVN1Ym5ldHMoKS5zbGljZSgwLCAxNik7XG4gICAgY29uc3QgcHVibGljQWNjZXNzRGlzYWJsZWQgPSAhdGhpcy5lbmRwb2ludEFjY2Vzcy5fY29uZmlnLnB1YmxpY0FjY2VzcztcbiAgICBjb25zdCBwdWJsaWNBY2Nlc3NSZXN0cmljdGVkID0gIXB1YmxpY0FjY2Vzc0Rpc2FibGVkXG4gICAgICAmJiB0aGlzLmVuZHBvaW50QWNjZXNzLl9jb25maWcucHVibGljQ2lkcnNcbiAgICAgICYmIHRoaXMuZW5kcG9pbnRBY2Nlc3MuX2NvbmZpZy5wdWJsaWNDaWRycy5sZW5ndGggIT09IDA7XG5cbiAgICAvLyB2YWxpZGF0ZSBlbmRwb2ludCBhY2Nlc3MgY29uZmlndXJhdGlvblxuXG4gICAgaWYgKHByaXZhdGVTdWJuZXRzLmxlbmd0aCA9PT0gMCAmJiBwdWJsaWNBY2Nlc3NEaXNhYmxlZCkge1xuICAgICAgLy8gbm8gcHJpdmF0ZSBzdWJuZXRzIGFuZCBubyBwdWJsaWMgYWNjZXNzIGF0IGFsbCwgbm8gZ29vZC5cbiAgICAgIHRocm93IG5ldyBFcnJvcignVnBjIG11c3QgY29udGFpbiBwcml2YXRlIHN1Ym5ldHMgd2hlbiBwdWJsaWMgZW5kcG9pbnQgYWNjZXNzIGlzIGRpc2FibGVkJyk7XG4gICAgfVxuXG4gICAgaWYgKHByaXZhdGVTdWJuZXRzLmxlbmd0aCA9PT0gMCAmJiBwdWJsaWNBY2Nlc3NSZXN0cmljdGVkKSB7XG4gICAgICAvLyBubyBwcml2YXRlIHN1Ym5ldHMgYW5kIHB1YmxpYyBhY2Nlc3MgaXMgcmVzdHJpY3RlZCwgbm8gZ29vZC5cbiAgICAgIHRocm93IG5ldyBFcnJvcignVnBjIG11c3QgY29udGFpbiBwcml2YXRlIHN1Ym5ldHMgd2hlbiBwdWJsaWMgZW5kcG9pbnQgYWNjZXNzIGlzIHJlc3RyaWN0ZWQnKTtcbiAgICB9XG5cbiAgICBjb25zdCBwbGFjZUNsdXN0ZXJIYW5kbGVySW5WcGMgPSBwcm9wcy5wbGFjZUNsdXN0ZXJIYW5kbGVySW5WcGMgPz8gZmFsc2U7XG5cbiAgICBpZiAocGxhY2VDbHVzdGVySGFuZGxlckluVnBjICYmIHByaXZhdGVTdWJuZXRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgcGxhY2UgY2x1c3RlciBoYW5kbGVyIGluIHRoZSBWUEMgc2luY2Ugbm8gcHJpdmF0ZSBzdWJuZXRzIGNvdWxkIGJlIHNlbGVjdGVkJyk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmNsdXN0ZXJIYW5kbGVyU2VjdXJpdHlHcm91cCAmJiAhcGxhY2VDbHVzdGVySGFuZGxlckluVnBjKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBzcGVjaWZ5IGNsdXN0ZXJIYW5kbGVyU2VjdXJpdHlHcm91cCB3aXRob3V0IHBsYWNlQ2x1c3RlckhhbmRsZXJJblZwYyBzZXQgdG8gdHJ1ZScpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc291cmNlID0gdGhpcy5fY2x1c3RlclJlc291cmNlID0gbmV3IENsdXN0ZXJSZXNvdXJjZSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBuYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgIGVudmlyb25tZW50OiBwcm9wcy5jbHVzdGVySGFuZGxlckVudmlyb25tZW50LFxuICAgICAgcm9sZUFybjogdGhpcy5yb2xlLnJvbGVBcm4sXG4gICAgICB2ZXJzaW9uOiBwcm9wcy52ZXJzaW9uLnZlcnNpb24sXG4gICAgICByZXNvdXJjZXNWcGNDb25maWc6IHtcbiAgICAgICAgc2VjdXJpdHlHcm91cElkczogW3NlY3VyaXR5R3JvdXAuc2VjdXJpdHlHcm91cElkXSxcbiAgICAgICAgc3VibmV0SWRzLFxuICAgICAgfSxcbiAgICAgIC4uLihwcm9wcy5zZWNyZXRzRW5jcnlwdGlvbktleSA/IHtcbiAgICAgICAgZW5jcnlwdGlvbkNvbmZpZzogW3tcbiAgICAgICAgICBwcm92aWRlcjoge1xuICAgICAgICAgICAga2V5QXJuOiBwcm9wcy5zZWNyZXRzRW5jcnlwdGlvbktleS5rZXlBcm4sXG4gICAgICAgICAgfSxcbiAgICAgICAgICByZXNvdXJjZXM6IFsnc2VjcmV0cyddLFxuICAgICAgICB9XSxcbiAgICAgIH0gOiB7fSksXG4gICAgICBrdWJlcm5ldGVzTmV0d29ya0NvbmZpZzogcHJvcHMuc2VydmljZUlwdjRDaWRyID8ge1xuICAgICAgICBzZXJ2aWNlSXB2NENpZHI6IHByb3BzLnNlcnZpY2VJcHY0Q2lkcixcbiAgICAgIH0gOiB1bmRlZmluZWQsXG4gICAgICBlbmRwb2ludFByaXZhdGVBY2Nlc3M6IHRoaXMuZW5kcG9pbnRBY2Nlc3MuX2NvbmZpZy5wcml2YXRlQWNjZXNzLFxuICAgICAgZW5kcG9pbnRQdWJsaWNBY2Nlc3M6IHRoaXMuZW5kcG9pbnRBY2Nlc3MuX2NvbmZpZy5wdWJsaWNBY2Nlc3MsXG4gICAgICBwdWJsaWNBY2Nlc3NDaWRyczogdGhpcy5lbmRwb2ludEFjY2Vzcy5fY29uZmlnLnB1YmxpY0NpZHJzLFxuICAgICAgc2VjcmV0c0VuY3J5cHRpb25LZXk6IHByb3BzLnNlY3JldHNFbmNyeXB0aW9uS2V5LFxuICAgICAgdnBjOiB0aGlzLnZwYyxcbiAgICAgIHN1Ym5ldHM6IHBsYWNlQ2x1c3RlckhhbmRsZXJJblZwYyA/IHByaXZhdGVTdWJuZXRzIDogdW5kZWZpbmVkLFxuICAgICAgY2x1c3RlckhhbmRsZXJTZWN1cml0eUdyb3VwOiB0aGlzLmNsdXN0ZXJIYW5kbGVyU2VjdXJpdHlHcm91cCxcbiAgICAgIG9uRXZlbnRMYXllcjogdGhpcy5vbkV2ZW50TGF5ZXIsXG4gICAgICB0YWdzOiBwcm9wcy50YWdzLFxuICAgICAgbG9nZ2luZzogdGhpcy5sb2dnaW5nLFxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuZW5kcG9pbnRBY2Nlc3MuX2NvbmZpZy5wcml2YXRlQWNjZXNzICYmIHByaXZhdGVTdWJuZXRzLmxlbmd0aCAhPT0gMCkge1xuXG4gICAgICAvLyB3aGVuIHByaXZhdGUgYWNjZXNzIGlzIGVuYWJsZWQgYW5kIHRoZSB2cGMgaGFzIHByaXZhdGUgc3VibmV0cywgbGV0cyBjb25uZWN0XG4gICAgICAvLyB0aGUgcHJvdmlkZXIgdG8gdGhlIHZwYyBzbyB0aGF0IGl0IHdpbGwgd29yayBldmVuIHdoZW4gcmVzdHJpY3RpbmcgcHVibGljIGFjY2Vzcy5cblxuICAgICAgLy8gdmFsaWRhdGUgVlBDIHByb3BlcnRpZXMgYWNjb3JkaW5nIHRvOiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZWtzL2xhdGVzdC91c2VyZ3VpZGUvY2x1c3Rlci1lbmRwb2ludC5odG1sXG4gICAgICBpZiAodGhpcy52cGMgaW5zdGFuY2VvZiBlYzIuVnBjICYmICEodGhpcy52cGMuZG5zSG9zdG5hbWVzRW5hYmxlZCAmJiB0aGlzLnZwYy5kbnNTdXBwb3J0RW5hYmxlZCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcml2YXRlIGVuZHBvaW50IGFjY2VzcyByZXF1aXJlcyB0aGUgVlBDIHRvIGhhdmUgRE5TIHN1cHBvcnQgYW5kIEROUyBob3N0bmFtZXMgZW5hYmxlZC4gVXNlIGBlbmFibGVEbnNIb3N0bmFtZXM6IHRydWVgIGFuZCBgZW5hYmxlRG5zU3VwcG9ydDogdHJ1ZWAgd2hlbiBjcmVhdGluZyB0aGUgVlBDLicpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmt1YmVjdGxQcml2YXRlU3VibmV0cyA9IHByaXZhdGVTdWJuZXRzO1xuXG4gICAgICAvLyB0aGUgdnBjIG11c3QgZXhpc3QgaW4gb3JkZXIgdG8gcHJvcGVybHkgZGVsZXRlIHRoZSBjbHVzdGVyIChzaW5jZSB3ZSBydW4gYGt1YmVjdGwgZGVsZXRlYCkuXG4gICAgICAvLyB0aGlzIGVuc3VyZXMgdGhhdC5cbiAgICAgIHRoaXMuX2NsdXN0ZXJSZXNvdXJjZS5ub2RlLmFkZERlcGVuZGVuY3kodGhpcy52cGMpO1xuICAgIH1cblxuICAgIHRoaXMuYWRtaW5Sb2xlID0gcmVzb3VyY2UuYWRtaW5Sb2xlO1xuXG4gICAgLy8gd2UgdXNlIGFuIFNTTSBwYXJhbWV0ZXIgYXMgYSBiYXJyaWVyIGJlY2F1c2UgaXQncyBmcmVlIGFuZCBmYXN0LlxuICAgIHRoaXMuX2t1YmVjdGxSZWFkeUJhcnJpZXIgPSBuZXcgQ2ZuUmVzb3VyY2UodGhpcywgJ0t1YmVjdGxSZWFkeUJhcnJpZXInLCB7XG4gICAgICB0eXBlOiAnQVdTOjpTU006OlBhcmFtZXRlcicsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIFR5cGU6ICdTdHJpbmcnLFxuICAgICAgICBWYWx1ZTogJ2F3czpjZGs6ZWtzOmt1YmVjdGwtcmVhZHknLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIGFkZCB0aGUgY2x1c3RlciByZXNvdXJjZSBpdHNlbGYgYXMgYSBkZXBlbmRlbmN5IG9mIHRoZSBiYXJyaWVyXG4gICAgdGhpcy5fa3ViZWN0bFJlYWR5QmFycmllci5ub2RlLmFkZERlcGVuZGVuY3kodGhpcy5fY2x1c3RlclJlc291cmNlKTtcblxuICAgIHRoaXMuY2x1c3Rlck5hbWUgPSB0aGlzLmdldFJlc291cmNlTmFtZUF0dHJpYnV0ZShyZXNvdXJjZS5yZWYpO1xuICAgIHRoaXMuY2x1c3RlckFybiA9IHRoaXMuZ2V0UmVzb3VyY2VBcm5BdHRyaWJ1dGUocmVzb3VyY2UuYXR0ckFybiwgY2x1c3RlckFybkNvbXBvbmVudHModGhpcy5waHlzaWNhbE5hbWUpKTtcblxuICAgIHRoaXMuY2x1c3RlckVuZHBvaW50ID0gcmVzb3VyY2UuYXR0ckVuZHBvaW50O1xuICAgIHRoaXMuY2x1c3RlckNlcnRpZmljYXRlQXV0aG9yaXR5RGF0YSA9IHJlc291cmNlLmF0dHJDZXJ0aWZpY2F0ZUF1dGhvcml0eURhdGE7XG4gICAgdGhpcy5jbHVzdGVyU2VjdXJpdHlHcm91cElkID0gcmVzb3VyY2UuYXR0ckNsdXN0ZXJTZWN1cml0eUdyb3VwSWQ7XG4gICAgdGhpcy5jbHVzdGVyRW5jcnlwdGlvbkNvbmZpZ0tleUFybiA9IHJlc291cmNlLmF0dHJFbmNyeXB0aW9uQ29uZmlnS2V5QXJuO1xuXG4gICAgdGhpcy5jbHVzdGVyU2VjdXJpdHlHcm91cCA9IGVjMi5TZWN1cml0eUdyb3VwLmZyb21TZWN1cml0eUdyb3VwSWQodGhpcywgJ0NsdXN0ZXJTZWN1cml0eUdyb3VwJywgdGhpcy5jbHVzdGVyU2VjdXJpdHlHcm91cElkKTtcblxuICAgIHRoaXMuY29ubmVjdGlvbnMgPSBuZXcgZWMyLkNvbm5lY3Rpb25zKHtcbiAgICAgIHNlY3VyaXR5R3JvdXBzOiBbdGhpcy5jbHVzdGVyU2VjdXJpdHlHcm91cCwgc2VjdXJpdHlHcm91cF0sXG4gICAgICBkZWZhdWx0UG9ydDogZWMyLlBvcnQudGNwKDQ0MyksIC8vIENvbnRyb2wgUGxhbmUgaGFzIGFuIEhUVFBTIEFQSVxuICAgIH0pO1xuXG4gICAgLy8gd2UgY2FuIHVzZSB0aGUgY2x1c3RlciBzZWN1cml0eSBncm91cCBzaW5jZSBpdHMgYWxyZWFkeSBhdHRhY2hlZCB0byB0aGUgY2x1c3RlclxuICAgIC8vIGFuZCBjb25maWd1cmVkIHRvIGFsbG93IGNvbm5lY3Rpb25zIGZyb20gaXRzZWxmLlxuICAgIHRoaXMua3ViZWN0bFNlY3VyaXR5R3JvdXAgPSB0aGlzLmNsdXN0ZXJTZWN1cml0eUdyb3VwO1xuXG4gICAgLy8gdXNlIHRoZSBjbHVzdGVyIGNyZWF0aW9uIHJvbGUgdG8gaXNzdWUga3ViZWN0bCBjb21tYW5kcyBhZ2FpbnN0IHRoZSBjbHVzdGVyIGJlY2F1c2Ugd2hlbiB0aGVcbiAgICAvLyBjbHVzdGVyIGlzIGZpcnN0IGNyZWF0ZWQsIHRoYXQncyB0aGUgb25seSByb2xlIHRoYXQgaGFzIFwic3lzdGVtOm1hc3RlcnNcIiBwZXJtaXNzaW9uc1xuICAgIHRoaXMua3ViZWN0bFJvbGUgPSB0aGlzLmFkbWluUm9sZTtcblxuICAgIHRoaXMuX2t1YmVjdGxSZXNvdXJjZVByb3ZpZGVyID0gdGhpcy5kZWZpbmVLdWJlY3RsUHJvdmlkZXIoKTtcblxuICAgIGNvbnN0IHVwZGF0ZUNvbmZpZ0NvbW1hbmRQcmVmaXggPSBgYXdzIGVrcyB1cGRhdGUta3ViZWNvbmZpZyAtLW5hbWUgJHt0aGlzLmNsdXN0ZXJOYW1lfWA7XG4gICAgY29uc3QgZ2V0VG9rZW5Db21tYW5kUHJlZml4ID0gYGF3cyBla3MgZ2V0LXRva2VuIC0tY2x1c3Rlci1uYW1lICR7dGhpcy5jbHVzdGVyTmFtZX1gO1xuICAgIGNvbnN0IGNvbW1vbkNvbW1hbmRPcHRpb25zID0gW2AtLXJlZ2lvbiAke3N0YWNrLnJlZ2lvbn1gXTtcblxuICAgIGlmIChwcm9wcy5vdXRwdXRDbHVzdGVyTmFtZSkge1xuICAgICAgbmV3IENmbk91dHB1dCh0aGlzLCAnQ2x1c3Rlck5hbWUnLCB7IHZhbHVlOiB0aGlzLmNsdXN0ZXJOYW1lIH0pO1xuICAgIH1cblxuICAgIC8vIGlmIGFuIGV4cGxpY2l0IHJvbGUgaXMgbm90IGNvbmZpZ3VyZWQsIGRlZmluZSBhIG1hc3RlcnMgcm9sZSB0aGF0IGNhblxuICAgIC8vIGJlIGFzc3VtZWQgYnkgYW55b25lIGluIHRoZSBhY2NvdW50ICh3aXRoIHN0czpBc3N1bWVSb2xlIHBlcm1pc3Npb25zIG9mXG4gICAgLy8gY291cnNlKVxuICAgIGNvbnN0IG1hc3RlcnNSb2xlID0gcHJvcHMubWFzdGVyc1JvbGUgPz8gbmV3IGlhbS5Sb2xlKHRoaXMsICdNYXN0ZXJzUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5BY2NvdW50Um9vdFByaW5jaXBhbCgpLFxuICAgIH0pO1xuXG4gICAgLy8gbWFwIHRoZSBJQU0gcm9sZSB0byB0aGUgYHN5c3RlbTptYXN0ZXJzYCBncm91cC5cbiAgICB0aGlzLmF3c0F1dGguYWRkTWFzdGVyc1JvbGUobWFzdGVyc1JvbGUpO1xuXG4gICAgaWYgKHByb3BzLm91dHB1dE1hc3RlcnNSb2xlQXJuKSB7XG4gICAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdNYXN0ZXJzUm9sZUFybicsIHsgdmFsdWU6IG1hc3RlcnNSb2xlLnJvbGVBcm4gfSk7XG4gICAgfVxuXG4gICAgY29tbW9uQ29tbWFuZE9wdGlvbnMucHVzaChgLS1yb2xlLWFybiAke21hc3RlcnNSb2xlLnJvbGVBcm59YCk7XG5cbiAgICBpZiAocHJvcHMuYWxiQ29udHJvbGxlcikge1xuICAgICAgdGhpcy5hbGJDb250cm9sbGVyID0gQWxiQ29udHJvbGxlci5jcmVhdGUodGhpcywgeyAuLi5wcm9wcy5hbGJDb250cm9sbGVyLCBjbHVzdGVyOiB0aGlzIH0pO1xuICAgIH1cblxuICAgIC8vIGFsbG9jYXRlIGRlZmF1bHQgY2FwYWNpdHkgaWYgbm9uLXplcm8gKG9yIGRlZmF1bHQpLlxuICAgIGNvbnN0IG1pbkNhcGFjaXR5ID0gcHJvcHMuZGVmYXVsdENhcGFjaXR5ID8/IERFRkFVTFRfQ0FQQUNJVFlfQ09VTlQ7XG4gICAgaWYgKG1pbkNhcGFjaXR5ID4gMCkge1xuICAgICAgY29uc3QgaW5zdGFuY2VUeXBlID0gcHJvcHMuZGVmYXVsdENhcGFjaXR5SW5zdGFuY2UgfHwgREVGQVVMVF9DQVBBQ0lUWV9UWVBFO1xuICAgICAgdGhpcy5kZWZhdWx0Q2FwYWNpdHkgPSBwcm9wcy5kZWZhdWx0Q2FwYWNpdHlUeXBlID09PSBEZWZhdWx0Q2FwYWNpdHlUeXBlLkVDMiA/XG4gICAgICAgIHRoaXMuYWRkQXV0b1NjYWxpbmdHcm91cENhcGFjaXR5KCdEZWZhdWx0Q2FwYWNpdHknLCB7IGluc3RhbmNlVHlwZSwgbWluQ2FwYWNpdHkgfSkgOiB1bmRlZmluZWQ7XG5cbiAgICAgIHRoaXMuZGVmYXVsdE5vZGVncm91cCA9IHByb3BzLmRlZmF1bHRDYXBhY2l0eVR5cGUgIT09IERlZmF1bHRDYXBhY2l0eVR5cGUuRUMyID9cbiAgICAgICAgdGhpcy5hZGROb2RlZ3JvdXBDYXBhY2l0eSgnRGVmYXVsdENhcGFjaXR5JywgeyBpbnN0YW5jZVR5cGVzOiBbaW5zdGFuY2VUeXBlXSwgbWluU2l6ZTogbWluQ2FwYWNpdHkgfSkgOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgY29uc3Qgb3V0cHV0Q29uZmlnQ29tbWFuZCA9IHByb3BzLm91dHB1dENvbmZpZ0NvbW1hbmQgPz8gdHJ1ZTtcbiAgICBpZiAob3V0cHV0Q29uZmlnQ29tbWFuZCkge1xuICAgICAgY29uc3QgcG9zdGZpeCA9IGNvbW1vbkNvbW1hbmRPcHRpb25zLmpvaW4oJyAnKTtcbiAgICAgIG5ldyBDZm5PdXRwdXQodGhpcywgJ0NvbmZpZ0NvbW1hbmQnLCB7IHZhbHVlOiBgJHt1cGRhdGVDb25maWdDb21tYW5kUHJlZml4fSAke3Bvc3RmaXh9YCB9KTtcbiAgICAgIG5ldyBDZm5PdXRwdXQodGhpcywgJ0dldFRva2VuQ29tbWFuZCcsIHsgdmFsdWU6IGAke2dldFRva2VuQ29tbWFuZFByZWZpeH0gJHtwb3N0Zml4fWAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5kZWZpbmVDb3JlRG5zQ29tcHV0ZVR5cGUocHJvcHMuY29yZURuc0NvbXB1dGVUeXBlID8/IENvcmVEbnNDb21wdXRlVHlwZS5FQzIpO1xuXG4gIH1cblxuICAvKipcbiAgICogRmV0Y2ggdGhlIGxvYWQgYmFsYW5jZXIgYWRkcmVzcyBvZiBhIHNlcnZpY2Ugb2YgdHlwZSAnTG9hZEJhbGFuY2VyJy5cbiAgICpcbiAgICogQHBhcmFtIHNlcnZpY2VOYW1lIFRoZSBuYW1lIG9mIHRoZSBzZXJ2aWNlLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBBZGRpdGlvbmFsIG9wZXJhdGlvbiBvcHRpb25zLlxuICAgKi9cbiAgcHVibGljIGdldFNlcnZpY2VMb2FkQmFsYW5jZXJBZGRyZXNzKHNlcnZpY2VOYW1lOiBzdHJpbmcsIG9wdGlvbnM6IFNlcnZpY2VMb2FkQmFsYW5jZXJBZGRyZXNzT3B0aW9ucyA9IHt9KTogc3RyaW5nIHtcblxuICAgIGNvbnN0IGxvYWRCYWxhbmNlckFkZHJlc3MgPSBuZXcgS3ViZXJuZXRlc09iamVjdFZhbHVlKHRoaXMsIGAke3NlcnZpY2VOYW1lfUxvYWRCYWxhbmNlckFkZHJlc3NgLCB7XG4gICAgICBjbHVzdGVyOiB0aGlzLFxuICAgICAgb2JqZWN0VHlwZTogJ3NlcnZpY2UnLFxuICAgICAgb2JqZWN0TmFtZTogc2VydmljZU5hbWUsXG4gICAgICBvYmplY3ROYW1lc3BhY2U6IG9wdGlvbnMubmFtZXNwYWNlLFxuICAgICAganNvblBhdGg6ICcuc3RhdHVzLmxvYWRCYWxhbmNlci5pbmdyZXNzWzBdLmhvc3RuYW1lJyxcbiAgICAgIHRpbWVvdXQ6IG9wdGlvbnMudGltZW91dCxcbiAgICB9KTtcblxuICAgIHJldHVybiBsb2FkQmFsYW5jZXJBZGRyZXNzLnZhbHVlO1xuXG4gIH1cblxuICAvKipcbiAgICogRmV0Y2ggdGhlIGxvYWQgYmFsYW5jZXIgYWRkcmVzcyBvZiBhbiBpbmdyZXNzIGJhY2tlZCBieSBhIGxvYWQgYmFsYW5jZXIuXG4gICAqXG4gICAqIEBwYXJhbSBpbmdyZXNzTmFtZSBUaGUgbmFtZSBvZiB0aGUgaW5ncmVzcy5cbiAgICogQHBhcmFtIG9wdGlvbnMgQWRkaXRpb25hbCBvcGVyYXRpb24gb3B0aW9ucy5cbiAgICovXG4gIHB1YmxpYyBnZXRJbmdyZXNzTG9hZEJhbGFuY2VyQWRkcmVzcyhpbmdyZXNzTmFtZTogc3RyaW5nLCBvcHRpb25zOiBJbmdyZXNzTG9hZEJhbGFuY2VyQWRkcmVzc09wdGlvbnMgPSB7fSk6IHN0cmluZyB7XG5cbiAgICBjb25zdCBsb2FkQmFsYW5jZXJBZGRyZXNzID0gbmV3IEt1YmVybmV0ZXNPYmplY3RWYWx1ZSh0aGlzLCBgJHtpbmdyZXNzTmFtZX1Mb2FkQmFsYW5jZXJBZGRyZXNzYCwge1xuICAgICAgY2x1c3RlcjogdGhpcyxcbiAgICAgIG9iamVjdFR5cGU6ICdpbmdyZXNzJyxcbiAgICAgIG9iamVjdE5hbWU6IGluZ3Jlc3NOYW1lLFxuICAgICAgb2JqZWN0TmFtZXNwYWNlOiBvcHRpb25zLm5hbWVzcGFjZSxcbiAgICAgIGpzb25QYXRoOiAnLnN0YXR1cy5sb2FkQmFsYW5jZXIuaW5ncmVzc1swXS5ob3N0bmFtZScsXG4gICAgICB0aW1lb3V0OiBvcHRpb25zLnRpbWVvdXQsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gbG9hZEJhbGFuY2VyQWRkcmVzcy52YWx1ZTtcblxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBub2RlcyB0byB0aGlzIEVLUyBjbHVzdGVyXG4gICAqXG4gICAqIFRoZSBub2RlcyB3aWxsIGF1dG9tYXRpY2FsbHkgYmUgY29uZmlndXJlZCB3aXRoIHRoZSByaWdodCBWUEMgYW5kIEFNSVxuICAgKiBmb3IgdGhlIGluc3RhbmNlIHR5cGUgYW5kIEt1YmVybmV0ZXMgdmVyc2lvbi5cbiAgICpcbiAgICogTm90ZSB0aGF0IGlmIHlvdSBzcGVjaWZ5IGB1cGRhdGVUeXBlOiBSb2xsaW5nVXBkYXRlYCBvciBgdXBkYXRlVHlwZTogUmVwbGFjaW5nVXBkYXRlYCwgeW91ciBub2RlcyBtaWdodCBiZSByZXBsYWNlZCBhdCBkZXBsb3lcbiAgICogdGltZSB3aXRob3V0IG5vdGljZSBpbiBjYXNlIHRoZSByZWNvbW1lbmRlZCBBTUkgZm9yIHlvdXIgbWFjaGluZSBpbWFnZSB0eXBlIGhhcyBiZWVuIHVwZGF0ZWQgYnkgQVdTLlxuICAgKiBUaGUgZGVmYXVsdCBiZWhhdmlvciBmb3IgYHVwZGF0ZVR5cGVgIGlzIGBOb25lYCwgd2hpY2ggbWVhbnMgb25seSBuZXcgaW5zdGFuY2VzIHdpbGwgYmUgbGF1bmNoZWQgdXNpbmcgdGhlIG5ldyBBTUkuXG4gICAqXG4gICAqIFNwb3QgaW5zdGFuY2VzIHdpbGwgYmUgbGFiZWxlZCBgbGlmZWN5Y2xlPUVjMlNwb3RgIGFuZCB0YWludGVkIHdpdGggYFByZWZlck5vU2NoZWR1bGVgLlxuICAgKiBJbiBhZGRpdGlvbiwgdGhlIFtzcG90IGludGVycnVwdCBoYW5kbGVyXShodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9lYzItc3BvdC1sYWJzL3RyZWUvbWFzdGVyL2VjMi1zcG90LWVrcy1zb2x1dGlvbi9zcG90LXRlcm1pbmF0aW9uLWhhbmRsZXIpXG4gICAqIGRhZW1vbiB3aWxsIGJlIGluc3RhbGxlZCBvbiBhbGwgc3BvdCBpbnN0YW5jZXMgdG8gaGFuZGxlXG4gICAqIFtFQzIgU3BvdCBJbnN0YW5jZSBUZXJtaW5hdGlvbiBOb3RpY2VzXShodHRwczovL2F3cy5hbWF6b24uY29tL2Jsb2dzL2F3cy9uZXctZWMyLXNwb3QtaW5zdGFuY2UtdGVybWluYXRpb24tbm90aWNlcy8pLlxuICAgKi9cbiAgcHVibGljIGFkZEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eShpZDogc3RyaW5nLCBvcHRpb25zOiBBdXRvU2NhbGluZ0dyb3VwQ2FwYWNpdHlPcHRpb25zKTogYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cCB7XG4gICAgaWYgKG9wdGlvbnMubWFjaGluZUltYWdlVHlwZSA9PT0gTWFjaGluZUltYWdlVHlwZS5CT1RUTEVST0NLRVQgJiYgb3B0aW9ucy5ib290c3RyYXBPcHRpb25zICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYm9vdHN0cmFwT3B0aW9ucyBpcyBub3Qgc3VwcG9ydGVkIGZvciBCb3R0bGVyb2NrZXQnKTtcbiAgICB9XG4gICAgY29uc3QgYXNnID0gbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAodGhpcywgaWQsIHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICB2cGM6IHRoaXMudnBjLFxuICAgICAgbWFjaGluZUltYWdlOiBvcHRpb25zLm1hY2hpbmVJbWFnZVR5cGUgPT09IE1hY2hpbmVJbWFnZVR5cGUuQk9UVExFUk9DS0VUID9cbiAgICAgICAgbmV3IEJvdHRsZVJvY2tldEltYWdlKHtcbiAgICAgICAgICBrdWJlcm5ldGVzVmVyc2lvbjogdGhpcy52ZXJzaW9uLnZlcnNpb24sXG4gICAgICAgIH0pIDpcbiAgICAgICAgbmV3IEVrc09wdGltaXplZEltYWdlKHtcbiAgICAgICAgICBub2RlVHlwZTogbm9kZVR5cGVGb3JJbnN0YW5jZVR5cGUob3B0aW9ucy5pbnN0YW5jZVR5cGUpLFxuICAgICAgICAgIGNwdUFyY2g6IGNwdUFyY2hGb3JJbnN0YW5jZVR5cGUob3B0aW9ucy5pbnN0YW5jZVR5cGUpLFxuICAgICAgICAgIGt1YmVybmV0ZXNWZXJzaW9uOiB0aGlzLnZlcnNpb24udmVyc2lvbixcbiAgICAgICAgfSksXG4gICAgfSk7XG5cbiAgICB0aGlzLmNvbm5lY3RBdXRvU2NhbGluZ0dyb3VwQ2FwYWNpdHkoYXNnLCB7XG4gICAgICBtYXBSb2xlOiBvcHRpb25zLm1hcFJvbGUsXG4gICAgICBib290c3RyYXBPcHRpb25zOiBvcHRpb25zLmJvb3RzdHJhcE9wdGlvbnMsXG4gICAgICBib290c3RyYXBFbmFibGVkOiBvcHRpb25zLmJvb3RzdHJhcEVuYWJsZWQsXG4gICAgICBtYWNoaW5lSW1hZ2VUeXBlOiBvcHRpb25zLm1hY2hpbmVJbWFnZVR5cGUsXG4gICAgICBzcG90SW50ZXJydXB0SGFuZGxlcjogb3B0aW9ucy5zcG90SW50ZXJydXB0SGFuZGxlcixcbiAgICB9KTtcblxuICAgIGlmIChub2RlVHlwZUZvckluc3RhbmNlVHlwZShvcHRpb25zLmluc3RhbmNlVHlwZSkgPT09IE5vZGVUeXBlLklORkVSRU5USUEpIHtcbiAgICAgIHRoaXMuYWRkTmV1cm9uRGV2aWNlUGx1Z2luKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFzZztcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgbWFuYWdlZCBub2RlZ3JvdXAgdG8gdGhpcyBBbWF6b24gRUtTIGNsdXN0ZXJcbiAgICpcbiAgICogVGhpcyBtZXRob2Qgd2lsbCBjcmVhdGUgYSBuZXcgbWFuYWdlZCBub2RlZ3JvdXAgYW5kIGFkZCBpbnRvIHRoZSBjYXBhY2l0eS5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZWtzL2xhdGVzdC91c2VyZ3VpZGUvbWFuYWdlZC1ub2RlLWdyb3Vwcy5odG1sXG4gICAqIEBwYXJhbSBpZCBUaGUgSUQgb2YgdGhlIG5vZGVncm91cFxuICAgKiBAcGFyYW0gb3B0aW9ucyBvcHRpb25zIGZvciBjcmVhdGluZyBhIG5ldyBub2RlZ3JvdXBcbiAgICovXG4gIHB1YmxpYyBhZGROb2RlZ3JvdXBDYXBhY2l0eShpZDogc3RyaW5nLCBvcHRpb25zPzogTm9kZWdyb3VwT3B0aW9ucyk6IE5vZGVncm91cCB7XG4gICAgcmV0dXJuIG5ldyBOb2RlZ3JvdXAodGhpcywgYE5vZGVncm91cCR7aWR9YCwge1xuICAgICAgY2x1c3RlcjogdGhpcyxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogTGF6aWx5IGNyZWF0ZXMgdGhlIEF3c0F1dGggcmVzb3VyY2UsIHdoaWNoIG1hbmFnZXMgQVdTIGF1dGhlbnRpY2F0aW9uIG1hcHBpbmcuXG4gICAqL1xuICBwdWJsaWMgZ2V0IGF3c0F1dGgoKSB7XG4gICAgaWYgKCF0aGlzLl9hd3NBdXRoKSB7XG4gICAgICB0aGlzLl9hd3NBdXRoID0gbmV3IEF3c0F1dGgodGhpcywgJ0F3c0F1dGgnLCB7IGNsdXN0ZXI6IHRoaXMgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2F3c0F1dGg7XG4gIH1cblxuICAvKipcbiAgICogSWYgdGhpcyBjbHVzdGVyIGlzIGt1YmVjdGwtZW5hYmxlZCwgcmV0dXJucyB0aGUgT3BlbklEIENvbm5lY3QgaXNzdWVyIHVybC5cbiAgICogVGhpcyBpcyBiZWNhdXNlIHRoZSB2YWx1ZXMgaXMgb25seSBiZSByZXRyaWV2ZWQgYnkgdGhlIEFQSSBhbmQgbm90IGV4cG9zZWRcbiAgICogYnkgQ2xvdWRGb3JtYXRpb24uIElmIHRoaXMgY2x1c3RlciBpcyBub3Qga3ViZWN0bC1lbmFibGVkIChpLmUuIHVzZXMgdGhlXG4gICAqIHN0b2NrIGBDZm5DbHVzdGVyYCksIHRoaXMgaXMgYHVuZGVmaW5lZGAuXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyBnZXQgY2x1c3Rlck9wZW5JZENvbm5lY3RJc3N1ZXJVcmwoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fY2x1c3RlclJlc291cmNlLmF0dHJPcGVuSWRDb25uZWN0SXNzdWVyVXJsO1xuICB9XG5cbiAgLyoqXG4gICAqIElmIHRoaXMgY2x1c3RlciBpcyBrdWJlY3RsLWVuYWJsZWQsIHJldHVybnMgdGhlIE9wZW5JRCBDb25uZWN0IGlzc3Vlci5cbiAgICogVGhpcyBpcyBiZWNhdXNlIHRoZSB2YWx1ZXMgaXMgb25seSBiZSByZXRyaWV2ZWQgYnkgdGhlIEFQSSBhbmQgbm90IGV4cG9zZWRcbiAgICogYnkgQ2xvdWRGb3JtYXRpb24uIElmIHRoaXMgY2x1c3RlciBpcyBub3Qga3ViZWN0bC1lbmFibGVkIChpLmUuIHVzZXMgdGhlXG4gICAqIHN0b2NrIGBDZm5DbHVzdGVyYCksIHRoaXMgaXMgYHVuZGVmaW5lZGAuXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyBnZXQgY2x1c3Rlck9wZW5JZENvbm5lY3RJc3N1ZXIoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fY2x1c3RlclJlc291cmNlLmF0dHJPcGVuSWRDb25uZWN0SXNzdWVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGBPcGVuSWRDb25uZWN0UHJvdmlkZXJgIHJlc291cmNlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGNsdXN0ZXIsIGFuZCB3aGljaCBjYW4gYmUgdXNlZFxuICAgKiB0byBsaW5rIHRoaXMgY2x1c3RlciB0byBBV1MgSUFNLlxuICAgKlxuICAgKiBBIHByb3ZpZGVyIHdpbGwgb25seSBiZSBkZWZpbmVkIGlmIHRoaXMgcHJvcGVydHkgaXMgYWNjZXNzZWQgKGxhenkgaW5pdGlhbGl6YXRpb24pLlxuICAgKi9cbiAgcHVibGljIGdldCBvcGVuSWRDb25uZWN0UHJvdmlkZXIoKSB7XG4gICAgaWYgKCF0aGlzLl9vcGVuSWRDb25uZWN0UHJvdmlkZXIpIHtcbiAgICAgIHRoaXMuX29wZW5JZENvbm5lY3RQcm92aWRlciA9IG5ldyBPcGVuSWRDb25uZWN0UHJvdmlkZXIodGhpcywgJ09wZW5JZENvbm5lY3RQcm92aWRlcicsIHtcbiAgICAgICAgdXJsOiB0aGlzLmNsdXN0ZXJPcGVuSWRDb25uZWN0SXNzdWVyVXJsLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX29wZW5JZENvbm5lY3RQcm92aWRlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgRmFyZ2F0ZSBwcm9maWxlIHRvIHRoaXMgY2x1c3Rlci5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZWtzL2xhdGVzdC91c2VyZ3VpZGUvZmFyZ2F0ZS1wcm9maWxlLmh0bWxcbiAgICpcbiAgICogQHBhcmFtIGlkIHRoZSBpZCBvZiB0aGlzIHByb2ZpbGVcbiAgICogQHBhcmFtIG9wdGlvbnMgcHJvZmlsZSBvcHRpb25zXG4gICAqL1xuICBwdWJsaWMgYWRkRmFyZ2F0ZVByb2ZpbGUoaWQ6IHN0cmluZywgb3B0aW9uczogRmFyZ2F0ZVByb2ZpbGVPcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBGYXJnYXRlUHJvZmlsZSh0aGlzLCBgZmFyZ2F0ZS1wcm9maWxlLSR7aWR9YCwge1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIGNsdXN0ZXI6IHRoaXMsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSW50ZXJuYWwgQVBJIHVzZWQgYnkgYEZhcmdhdGVQcm9maWxlYCB0byBrZWVwIGludmVudG9yeSBvZiBGYXJnYXRlIHByb2ZpbGVzIGFzc29jaWF0ZWQgd2l0aFxuICAgKiB0aGlzIGNsdXN0ZXIsIGZvciB0aGUgc2FrZSBvZiBlbnN1cmluZyB0aGUgcHJvZmlsZXMgYXJlIGNyZWF0ZWQgc2VxdWVudGlhbGx5LlxuICAgKlxuICAgKiBAcmV0dXJucyB0aGUgbGlzdCBvZiBGYXJnYXRlUHJvZmlsZXMgYXR0YWNoZWQgdG8gdGhpcyBjbHVzdGVyLCBpbmNsdWRpbmcgdGhlIG9uZSBqdXN0IGF0dGFjaGVkLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBfYXR0YWNoRmFyZ2F0ZVByb2ZpbGUoZmFyZ2F0ZVByb2ZpbGU6IEZhcmdhdGVQcm9maWxlKTogRmFyZ2F0ZVByb2ZpbGVbXSB7XG4gICAgdGhpcy5fZmFyZ2F0ZVByb2ZpbGVzLnB1c2goZmFyZ2F0ZVByb2ZpbGUpO1xuXG4gICAgLy8gYWRkIGFsbCBwcm9maWxlcyBhcyBhIGRlcGVuZGVuY3kgb2YgdGhlIFwia3ViZWN0bC1yZWFkeVwiIGJhcnJpZXIgYmVjYXVzZSBhbGwga3ViZWN0bC1cbiAgICAvLyByZXNvdXJjZXMgY2FuIG9ubHkgYmUgZGVwbG95ZWQgYWZ0ZXIgYWxsIGZhcmdhdGUgcHJvZmlsZXMgYXJlIGNyZWF0ZWQuXG4gICAgdGhpcy5fa3ViZWN0bFJlYWR5QmFycmllci5ub2RlLmFkZERlcGVuZGVuY3koZmFyZ2F0ZVByb2ZpbGUpO1xuXG4gICAgcmV0dXJuIHRoaXMuX2ZhcmdhdGVQcm9maWxlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgcmVzb3VyY2Ugc2NvcGUgdGhhdCByZXF1aXJlcyBga3ViZWN0bGAgdG8gdGhpcyBjbHVzdGVyIGFuZCByZXR1cm5zXG4gICAqIHRoZSBgS3ViZWN0bFByb3ZpZGVyYCB3aGljaCBpcyB0aGUgY3VzdG9tIHJlc291cmNlIHByb3ZpZGVyIHRoYXQgc2hvdWxkIGJlXG4gICAqIHVzZWQgYXMgdGhlIHJlc291cmNlIHByb3ZpZGVyLlxuICAgKlxuICAgKiBDYWxsZWQgZnJvbSBgSGVsbVJlc291cmNlYCBhbmQgYEt1YmVybmV0ZXNSZXNvdXJjZWBcbiAgICpcbiAgICogQHBhcmFtIHJlc291cmNlU2NvcGUgdGhlIGNvbnN0cnVjdCBzY29wZSBpbiB3aGljaCBrdWJlY3RsIHJlc291cmNlcyBhcmUgZGVmaW5lZC5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgX2F0dGFjaEt1YmVjdGxSZXNvdXJjZVNjb3BlKHJlc291cmNlU2NvcGU6IENvbnN0cnVjdCk6IEt1YmVjdGxQcm92aWRlciB7XG4gICAgTm9kZS5vZihyZXNvdXJjZVNjb3BlKS5hZGREZXBlbmRlbmN5KHRoaXMuX2t1YmVjdGxSZWFkeUJhcnJpZXIpO1xuICAgIHJldHVybiB0aGlzLl9rdWJlY3RsUmVzb3VyY2VQcm92aWRlcjtcbiAgfVxuXG4gIHByaXZhdGUgZGVmaW5lS3ViZWN0bFByb3ZpZGVyKCkge1xuICAgIGNvbnN0IHVpZCA9ICdAYXdzLWNkay9hd3MtZWtzLkt1YmVjdGxQcm92aWRlcic7XG5cbiAgICAvLyBzaW5jZSB3ZSBjYW4ndCBoYXZlIHRoZSBwcm92aWRlciBjb25uZWN0IHRvIG11bHRpcGxlIG5ldHdvcmtzLCBhbmQgd2VcbiAgICAvLyB3YW50ZWQgdG8gYXZvaWQgcmVzb3VyY2UgdGVhciBkb3duLCB3ZSBkZWNpZGVkIGZvciBub3cgdGhhdCB3ZSB3aWxsIG9ubHlcbiAgICAvLyBzdXBwb3J0IGEgc2luZ2xlIEVLUyBjbHVzdGVyIHBlciBDRk4gc3RhY2suXG4gICAgaWYgKHRoaXMuc3RhY2subm9kZS50cnlGaW5kQ2hpbGQodWlkKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdPbmx5IGEgc2luZ2xlIEVLUyBjbHVzdGVyIGNhbiBiZSBkZWZpbmVkIHdpdGhpbiBhIENsb3VkRm9ybWF0aW9uIHN0YWNrJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBLdWJlY3RsUHJvdmlkZXIodGhpcy5zdGFjaywgdWlkLCB7IGNsdXN0ZXI6IHRoaXMgfSk7XG4gIH1cblxuICBwcml2YXRlIHNlbGVjdFByaXZhdGVTdWJuZXRzKCk6IGVjMi5JU3VibmV0W10ge1xuICAgIGNvbnN0IHByaXZhdGVTdWJuZXRzOiBlYzIuSVN1Ym5ldFtdID0gW107XG4gICAgY29uc3QgdnBjUHJpdmF0ZVN1Ym5ldElkcyA9IHRoaXMudnBjLnByaXZhdGVTdWJuZXRzLm1hcChzID0+IHMuc3VibmV0SWQpO1xuICAgIGNvbnN0IHZwY1B1YmxpY1N1Ym5ldElkcyA9IHRoaXMudnBjLnB1YmxpY1N1Ym5ldHMubWFwKHMgPT4gcy5zdWJuZXRJZCk7XG5cbiAgICBmb3IgKGNvbnN0IHBsYWNlbWVudCBvZiB0aGlzLnZwY1N1Ym5ldHMpIHtcblxuICAgICAgZm9yIChjb25zdCBzdWJuZXQgb2YgdGhpcy52cGMuc2VsZWN0U3VibmV0cyhwbGFjZW1lbnQpLnN1Ym5ldHMpIHtcblxuICAgICAgICBpZiAodnBjUHJpdmF0ZVN1Ym5ldElkcy5pbmNsdWRlcyhzdWJuZXQuc3VibmV0SWQpKSB7XG4gICAgICAgICAgLy8gZGVmaW5pdGVseSBwcml2YXRlLCB0YWtlIGl0LlxuICAgICAgICAgIHByaXZhdGVTdWJuZXRzLnB1c2goc3VibmV0KTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2cGNQdWJsaWNTdWJuZXRJZHMuaW5jbHVkZXMoc3VibmV0LnN1Ym5ldElkKSkge1xuICAgICAgICAgIC8vIGRlZmluaXRlbHkgcHVibGljLCBza2lwIGl0LlxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbmVpdGhlciBwdWJsaWMgYW5kIG5vciBwcml2YXRlIC0gd2hhdCBpcyBpdCB0aGVuPyB0aGlzIG1lYW5zIGl0cyBhIHN1Ym5ldCBpbnN0YW5jZSB0aGF0IHdhcyBleHBsaWNpdGx5IHBhc3NlZFxuICAgICAgICAvLyBpbiB0aGUgc3VibmV0IHNlbGVjdGlvbi4gc2luY2UgSVN1Ym5ldCBkb2Vzbid0IGNvbnRhaW4gaW5mb3JtYXRpb24gb24gdHlwZSwgd2UgaGF2ZSB0byBhc3N1bWUgaXRzIHByaXZhdGUgYW5kIGxldCBpdFxuICAgICAgICAvLyBmYWlsIGF0IGRlcGxveSB0aW1lIDpcXCAoaXRzIGJldHRlciB0aGFuIGZpbHRlcmluZyBpdCBvdXQgYW5kIHByZXZlbnRpbmcgYSBwb3NzaWJseSBzdWNjZXNzZnVsIGRlcGxveW1lbnQpXG4gICAgICAgIHByaXZhdGVTdWJuZXRzLnB1c2goc3VibmV0KTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiBwcml2YXRlU3VibmV0cztcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnN0YWxscyB0aGUgTmV1cm9uIGRldmljZSBwbHVnaW4gb24gdGhlIGNsdXN0ZXIgaWYgaXQncyBub3RcbiAgICogYWxyZWFkeSBhZGRlZC5cbiAgICovXG4gIHByaXZhdGUgYWRkTmV1cm9uRGV2aWNlUGx1Z2luKCkge1xuICAgIGlmICghdGhpcy5fbmV1cm9uRGV2aWNlUGx1Z2luKSB7XG4gICAgICBjb25zdCBmaWxlQ29udGVudHMgPSBmcy5yZWFkRmlsZVN5bmMocGF0aC5qb2luKF9fZGlybmFtZSwgJ2FkZG9ucy9uZXVyb24tZGV2aWNlLXBsdWdpbi55YW1sJyksICd1dGY4Jyk7XG4gICAgICBjb25zdCBzYW5pdGl6ZWQgPSBZQU1MLnBhcnNlKGZpbGVDb250ZW50cyk7XG4gICAgICB0aGlzLl9uZXVyb25EZXZpY2VQbHVnaW4gPSB0aGlzLmFkZE1hbmlmZXN0KCdOZXVyb25EZXZpY2VQbHVnaW4nLCBzYW5pdGl6ZWQpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9uZXVyb25EZXZpY2VQbHVnaW47XG4gIH1cblxuICAvKipcbiAgICogT3Bwb3J0dW5pc3RpY2FsbHkgdGFnIHN1Ym5ldHMgd2l0aCB0aGUgcmVxdWlyZWQgdGFncy5cbiAgICpcbiAgICogSWYgbm8gc3VibmV0cyBjb3VsZCBiZSBmb3VuZCAoYmVjYXVzZSB0aGlzIGlzIGFuIGltcG9ydGVkIFZQQyksIGFkZCBhIHdhcm5pbmcuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Vrcy9sYXRlc3QvdXNlcmd1aWRlL25ldHdvcmtfcmVxcy5odG1sXG4gICAqL1xuICBwcml2YXRlIHRhZ1N1Ym5ldHMoKSB7XG4gICAgY29uc3QgdGFnQWxsU3VibmV0cyA9ICh0eXBlOiBzdHJpbmcsIHN1Ym5ldHM6IGVjMi5JU3VibmV0W10sIHRhZzogc3RyaW5nKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IHN1Ym5ldCBvZiBzdWJuZXRzKSB7XG4gICAgICAgIC8vIGlmIHRoaXMgaXMgbm90IGEgY29uY3JldGUgc3VibmV0LCBhdHRhY2ggYSBjb25zdHJ1Y3Qgd2FybmluZ1xuICAgICAgICBpZiAoIWVjMi5TdWJuZXQuaXNWcGNTdWJuZXQoc3VibmV0KSkge1xuICAgICAgICAgIC8vIG1lc3NhZ2UgKGlmIHRva2VuKTogXCJjb3VsZCBub3QgYXV0by10YWcgcHVibGljL3ByaXZhdGUgc3VibmV0IHdpdGggdGFnLi4uXCJcbiAgICAgICAgICAvLyBtZXNzYWdlIChpZiBub3QgdG9rZW4pOiBcImNvdW50IG5vdCBhdXRvLXRhZyBwdWJsaWMvcHJpdmF0ZSBzdWJuZXQgeHh4eHggd2l0aCB0YWcuLi5cIlxuICAgICAgICAgIGNvbnN0IHN1Ym5ldElEID0gVG9rZW4uaXNVbnJlc29sdmVkKHN1Ym5ldC5zdWJuZXRJZCkgfHwgVG9rZW4uaXNVbnJlc29sdmVkKFtzdWJuZXQuc3VibmV0SWRdKSA/ICcnIDogYCAke3N1Ym5ldC5zdWJuZXRJZH1gO1xuICAgICAgICAgIEFubm90YXRpb25zLm9mKHRoaXMpLmFkZFdhcm5pbmcoYENvdWxkIG5vdCBhdXRvLXRhZyAke3R5cGV9IHN1Ym5ldCR7c3VibmV0SUR9IHdpdGggXCIke3RhZ309MVwiLCBwbGVhc2UgcmVtZW1iZXIgdG8gZG8gdGhpcyBtYW51YWxseWApO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgVGFncy5vZihzdWJuZXQpLmFkZCh0YWcsICcxJyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9la3MvbGF0ZXN0L3VzZXJndWlkZS9uZXR3b3JrX3JlcXMuaHRtbFxuICAgIHRhZ0FsbFN1Ym5ldHMoJ3ByaXZhdGUnLCB0aGlzLnZwYy5wcml2YXRlU3VibmV0cywgJ2t1YmVybmV0ZXMuaW8vcm9sZS9pbnRlcm5hbC1lbGInKTtcbiAgICB0YWdBbGxTdWJuZXRzKCdwdWJsaWMnLCB0aGlzLnZwYy5wdWJsaWNTdWJuZXRzLCAna3ViZXJuZXRlcy5pby9yb2xlL2VsYicpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhdGNoZXMgdGhlIENvcmVETlMgZGVwbG95bWVudCBjb25maWd1cmF0aW9uIGFuZCBzZXRzIHRoZSBcImVrcy5hbWF6b25hd3MuY29tL2NvbXB1dGUtdHlwZVwiXG4gICAqIGFubm90YXRpb24gdG8gZWl0aGVyIFwiZWMyXCIgb3IgXCJmYXJnYXRlXCIuIE5vdGUgdGhhdCBpZiBcImVjMlwiIGlzIHNlbGVjdGVkLCB0aGUgcmVzb3VyY2UgaXNcbiAgICogb21pdHRlZC9yZW1vdmVkLCBzaW5jZSB0aGUgY2x1c3RlciBpcyBjcmVhdGVkIHdpdGggdGhlIFwiZWMyXCIgY29tcHV0ZSB0eXBlIGJ5IGRlZmF1bHQuXG4gICAqL1xuICBwcml2YXRlIGRlZmluZUNvcmVEbnNDb21wdXRlVHlwZSh0eXBlOiBDb3JlRG5zQ29tcHV0ZVR5cGUpIHtcbiAgICAvLyBlYzIgaXMgdGhlIFwiYnVpbHQgaW5cIiBjb21wdXRlIHR5cGUgb2YgdGhlIGNsdXN0ZXIgc28gaWYgdGhpcyBpcyB0aGVcbiAgICAvLyByZXF1ZXN0ZWQgdHlwZSB3ZSBjYW4gc2ltcGx5IG9taXQgdGhlIHJlc291cmNlLiBzaW5jZSB0aGUgcmVzb3VyY2Unc1xuICAgIC8vIGByZXN0b3JlUGF0Y2hgIGlzIGNvbmZpZ3VyZWQgdG8gcmVzdG9yZSB0aGUgdmFsdWUgdG8gXCJlYzJcIiB0aGlzIG1lYW5zXG4gICAgLy8gdGhhdCBkZWxldGlvbiBvZiB0aGUgcmVzb3VyY2Ugd2lsbCBjaGFuZ2UgdG8gXCJlYzJcIiBhcyB3ZWxsLlxuICAgIGlmICh0eXBlID09PSBDb3JlRG5zQ29tcHV0ZVR5cGUuRUMyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gdGhpcyBpcyB0aGUganNvbiBwYXRjaCB3ZSBtZXJnZSBpbnRvIHRoZSByZXNvdXJjZSBiYXNlZCBvZmYgb2Y6XG4gICAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Vrcy9sYXRlc3QvdXNlcmd1aWRlL2ZhcmdhdGUtZ2V0dGluZy1zdGFydGVkLmh0bWwjZmFyZ2F0ZS1ncy1jb3JlZG5zXG4gICAgY29uc3QgcmVuZGVyUGF0Y2ggPSAoY29tcHV0ZVR5cGU6IENvcmVEbnNDb21wdXRlVHlwZSkgPT4gKHtcbiAgICAgIHNwZWM6IHtcbiAgICAgICAgdGVtcGxhdGU6IHtcbiAgICAgICAgICBtZXRhZGF0YToge1xuICAgICAgICAgICAgYW5ub3RhdGlvbnM6IHtcbiAgICAgICAgICAgICAgJ2Vrcy5hbWF6b25hd3MuY29tL2NvbXB1dGUtdHlwZSc6IGNvbXB1dGVUeXBlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIG5ldyBLdWJlcm5ldGVzUGF0Y2godGhpcywgJ0NvcmVEbnNDb21wdXRlVHlwZVBhdGNoJywge1xuICAgICAgY2x1c3RlcjogdGhpcyxcbiAgICAgIHJlc291cmNlTmFtZTogJ2RlcGxveW1lbnQvY29yZWRucycsXG4gICAgICByZXNvdXJjZU5hbWVzcGFjZTogJ2t1YmUtc3lzdGVtJyxcbiAgICAgIGFwcGx5UGF0Y2g6IHJlbmRlclBhdGNoKENvcmVEbnNDb21wdXRlVHlwZS5GQVJHQVRFKSxcbiAgICAgIHJlc3RvcmVQYXRjaDogcmVuZGVyUGF0Y2goQ29yZURuc0NvbXB1dGVUeXBlLkVDMiksXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciBhZGRpbmcgd29ya2VyIG5vZGVzXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXV0b1NjYWxpbmdHcm91cENhcGFjaXR5T3B0aW9ucyBleHRlbmRzIGF1dG9zY2FsaW5nLkNvbW1vbkF1dG9TY2FsaW5nR3JvdXBQcm9wcyB7XG4gIC8qKlxuICAgKiBJbnN0YW5jZSB0eXBlIG9mIHRoZSBpbnN0YW5jZXMgdG8gc3RhcnRcbiAgICovXG4gIHJlYWRvbmx5IGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZTtcblxuICAvKipcbiAgICogV2lsbCBhdXRvbWF0aWNhbGx5IHVwZGF0ZSB0aGUgYXdzLWF1dGggQ29uZmlnTWFwIHRvIG1hcCB0aGUgSUFNIGluc3RhbmNlXG4gICAqIHJvbGUgdG8gUkJBQy5cbiAgICpcbiAgICogVGhpcyBjYW5ub3QgYmUgZXhwbGljaXRseSBzZXQgdG8gYHRydWVgIGlmIHRoZSBjbHVzdGVyIGhhcyBrdWJlY3RsIGRpc2FibGVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRydWUgaWYgdGhlIGNsdXN0ZXIgaGFzIGt1YmVjdGwgZW5hYmxlZCAod2hpY2ggaXMgdGhlIGRlZmF1bHQpLlxuICAgKi9cbiAgcmVhZG9ubHkgbWFwUm9sZT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZXMgdGhlIEVDMiB1c2VyLWRhdGEgc2NyaXB0IGZvciBpbnN0YW5jZXMgaW4gdGhpcyBhdXRvc2NhbGluZyBncm91cFxuICAgKiB0byBib290c3RyYXAgdGhlIG5vZGUgKGludm9rZSBgL2V0Yy9la3MvYm9vdHN0cmFwLnNoYCkgYW5kIGFzc29jaWF0ZSBpdFxuICAgKiB3aXRoIHRoZSBFS1MgY2x1c3Rlci5cbiAgICpcbiAgICogSWYgeW91IHdpc2ggdG8gcHJvdmlkZSBhIGN1c3RvbSB1c2VyIGRhdGEgc2NyaXB0LCBzZXQgdGhpcyB0byBgZmFsc2VgIGFuZFxuICAgKiBtYW51YWxseSBpbnZva2UgYGF1dG9zY2FsaW5nR3JvdXAuYWRkVXNlckRhdGEoKWAuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IGJvb3RzdHJhcEVuYWJsZWQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBFS1Mgbm9kZSBib290c3RyYXBwaW5nIG9wdGlvbnMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgYm9vdHN0cmFwT3B0aW9ucz86IEJvb3RzdHJhcE9wdGlvbnM7XG5cbiAgLyoqXG4gICAqIE1hY2hpbmUgaW1hZ2UgdHlwZVxuICAgKlxuICAgKiBAZGVmYXVsdCBNYWNoaW5lSW1hZ2VUeXBlLkFNQVpPTl9MSU5VWF8yXG4gICAqL1xuICByZWFkb25seSBtYWNoaW5lSW1hZ2VUeXBlPzogTWFjaGluZUltYWdlVHlwZTtcblxuICAvKipcbiAgICogSW5zdGFsbHMgdGhlIEFXUyBzcG90IGluc3RhbmNlIGludGVycnVwdCBoYW5kbGVyIG9uIHRoZSBjbHVzdGVyIGlmIGl0J3Mgbm90XG4gICAqIGFscmVhZHkgYWRkZWQuIE9ubHkgcmVsZXZhbnQgaWYgYHNwb3RQcmljZWAgaXMgdXNlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgc3BvdEludGVycnVwdEhhbmRsZXI/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIEVLUyBub2RlIGJvb3RzdHJhcHBpbmcgb3B0aW9ucy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBCb290c3RyYXBPcHRpb25zIHtcbiAgLyoqXG4gICAqIFNldHMgYC0tbWF4LXBvZHNgIGZvciB0aGUga3ViZWxldCBiYXNlZCBvbiB0aGUgY2FwYWNpdHkgb2YgdGhlIEVDMiBpbnN0YW5jZS5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgdXNlTWF4UG9kcz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFJlc3RvcmVzIHRoZSBkb2NrZXIgZGVmYXVsdCBicmlkZ2UgbmV0d29yay5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGVuYWJsZURvY2tlckJyaWRnZT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIE51bWJlciBvZiByZXRyeSBhdHRlbXB0cyBmb3IgQVdTIEFQSSBjYWxsIChEZXNjcmliZUNsdXN0ZXIpLlxuICAgKlxuICAgKiBAZGVmYXVsdCAzXG4gICAqL1xuICByZWFkb25seSBhd3NBcGlSZXRyeUF0dGVtcHRzPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgY29udGVudHMgb2YgdGhlIGAvZXRjL2RvY2tlci9kYWVtb24uanNvbmAgZmlsZS4gVXNlZnVsIGlmIHlvdSB3YW50IGFcbiAgICogY3VzdG9tIGNvbmZpZyBkaWZmZXJpbmcgZnJvbSB0aGUgZGVmYXVsdCBvbmUgaW4gdGhlIEVLUyBBTUkuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgZG9ja2VyQ29uZmlnSnNvbj86IHN0cmluZztcblxuICAvKipcblxuICAgKiBPdmVycmlkZXMgdGhlIElQIGFkZHJlc3MgdG8gdXNlIGZvciBETlMgcXVlcmllcyB3aXRoaW4gdGhlXG4gICAqIGNsdXN0ZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gMTAuMTAwLjAuMTAgb3IgMTcyLjIwLjAuMTAgYmFzZWQgb24gdGhlIElQXG4gICAqIGFkZHJlc3Mgb2YgdGhlIHByaW1hcnkgaW50ZXJmYWNlLlxuICAgKi9cbiAgcmVhZG9ubHkgZG5zQ2x1c3RlcklwPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBFeHRyYSBhcmd1bWVudHMgdG8gYWRkIHRvIHRoZSBrdWJlbGV0LiBVc2VmdWwgZm9yIGFkZGluZyBsYWJlbHMgb3IgdGFpbnRzLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgYC0tbm9kZS1sYWJlbHMgZm9vPWJhcixnb289ZmFyYC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBub25lXG4gICAqL1xuICByZWFkb25seSBrdWJlbGV0RXh0cmFBcmdzPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBZGRpdGlvbmFsIGNvbW1hbmQgbGluZSBhcmd1bWVudHMgdG8gcGFzcyB0byB0aGUgYC9ldGMvZWtzL2Jvb3RzdHJhcC5zaGBcbiAgICogY29tbWFuZC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9hbWF6b24tZWtzLWFtaS9ibG9iL21hc3Rlci9maWxlcy9ib290c3RyYXAuc2hcbiAgICogQGRlZmF1bHQgLSBub25lXG4gICAqL1xuICByZWFkb25seSBhZGRpdGlvbmFsQXJncz86IHN0cmluZztcbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciBhZGRpbmcgYW4gQXV0b1NjYWxpbmdHcm91cCBhcyBjYXBhY2l0eVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEF1dG9TY2FsaW5nR3JvdXBPcHRpb25zIHtcbiAgLyoqXG4gICAqIFdpbGwgYXV0b21hdGljYWxseSB1cGRhdGUgdGhlIGF3cy1hdXRoIENvbmZpZ01hcCB0byBtYXAgdGhlIElBTSBpbnN0YW5jZVxuICAgKiByb2xlIHRvIFJCQUMuXG4gICAqXG4gICAqIFRoaXMgY2Fubm90IGJlIGV4cGxpY2l0bHkgc2V0IHRvIGB0cnVlYCBpZiB0aGUgY2x1c3RlciBoYXMga3ViZWN0bCBkaXNhYmxlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSB0cnVlIGlmIHRoZSBjbHVzdGVyIGhhcyBrdWJlY3RsIGVuYWJsZWQgKHdoaWNoIGlzIHRoZSBkZWZhdWx0KS5cbiAgICovXG4gIHJlYWRvbmx5IG1hcFJvbGU/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBDb25maWd1cmVzIHRoZSBFQzIgdXNlci1kYXRhIHNjcmlwdCBmb3IgaW5zdGFuY2VzIGluIHRoaXMgYXV0b3NjYWxpbmcgZ3JvdXBcbiAgICogdG8gYm9vdHN0cmFwIHRoZSBub2RlIChpbnZva2UgYC9ldGMvZWtzL2Jvb3RzdHJhcC5zaGApIGFuZCBhc3NvY2lhdGUgaXRcbiAgICogd2l0aCB0aGUgRUtTIGNsdXN0ZXIuXG4gICAqXG4gICAqIElmIHlvdSB3aXNoIHRvIHByb3ZpZGUgYSBjdXN0b20gdXNlciBkYXRhIHNjcmlwdCwgc2V0IHRoaXMgdG8gYGZhbHNlYCBhbmRcbiAgICogbWFudWFsbHkgaW52b2tlIGBhdXRvc2NhbGluZ0dyb3VwLmFkZFVzZXJEYXRhKClgLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBib290c3RyYXBFbmFibGVkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQWxsb3dzIG9wdGlvbnMgZm9yIG5vZGUgYm9vdHN0cmFwcGluZyB0aHJvdWdoIEVDMiB1c2VyIGRhdGEuXG4gICAqIEBkZWZhdWx0IC0gZGVmYXVsdCBvcHRpb25zXG4gICAqL1xuICByZWFkb25seSBib290c3RyYXBPcHRpb25zPzogQm9vdHN0cmFwT3B0aW9ucztcblxuICAvKipcbiAgICogQWxsb3cgb3B0aW9ucyB0byBzcGVjaWZ5IGRpZmZlcmVudCBtYWNoaW5lIGltYWdlIHR5cGVcbiAgICpcbiAgICogQGRlZmF1bHQgTWFjaGluZUltYWdlVHlwZS5BTUFaT05fTElOVVhfMlxuICAgKi9cbiAgcmVhZG9ubHkgbWFjaGluZUltYWdlVHlwZT86IE1hY2hpbmVJbWFnZVR5cGU7XG5cbiAgLyoqXG4gICAqIEluc3RhbGxzIHRoZSBBV1Mgc3BvdCBpbnN0YW5jZSBpbnRlcnJ1cHQgaGFuZGxlciBvbiB0aGUgY2x1c3RlciBpZiBpdCdzIG5vdFxuICAgKiBhbHJlYWR5IGFkZGVkLiBPbmx5IHJlbGV2YW50IGlmIGBzcG90UHJpY2VgIGlzIGNvbmZpZ3VyZWQgb24gdGhlIGF1dG8tc2NhbGluZyBncm91cC5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgc3BvdEludGVycnVwdEhhbmRsZXI/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIEltcG9ydCBhIGNsdXN0ZXIgdG8gdXNlIGluIGFub3RoZXIgc3RhY2tcbiAqL1xuY2xhc3MgSW1wb3J0ZWRDbHVzdGVyIGV4dGVuZHMgQ2x1c3RlckJhc2Uge1xuICBwdWJsaWMgcmVhZG9ubHkgY2x1c3Rlck5hbWU6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IGNsdXN0ZXJBcm46IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IGNvbm5lY3Rpb25zID0gbmV3IGVjMi5Db25uZWN0aW9ucygpO1xuICBwdWJsaWMgcmVhZG9ubHkga3ViZWN0bFJvbGU/OiBpYW0uSVJvbGU7XG4gIHB1YmxpYyByZWFkb25seSBrdWJlY3RsTGFtYmRhUm9sZT86IGlhbS5JUm9sZTtcbiAgcHVibGljIHJlYWRvbmx5IGt1YmVjdGxFbnZpcm9ubWVudD86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nOyB9IHwgdW5kZWZpbmVkO1xuICBwdWJsaWMgcmVhZG9ubHkga3ViZWN0bFNlY3VyaXR5R3JvdXA/OiBlYzIuSVNlY3VyaXR5R3JvdXAgfCB1bmRlZmluZWQ7XG4gIHB1YmxpYyByZWFkb25seSBrdWJlY3RsUHJpdmF0ZVN1Ym5ldHM/OiBlYzIuSVN1Ym5ldFtdIHwgdW5kZWZpbmVkO1xuICBwdWJsaWMgcmVhZG9ubHkga3ViZWN0bExheWVyPzogbGFtYmRhLklMYXllclZlcnNpb247XG4gIHB1YmxpYyByZWFkb25seSBhd3NjbGlMYXllcj86IGxhbWJkYS5JTGF5ZXJWZXJzaW9uO1xuICBwdWJsaWMgcmVhZG9ubHkga3ViZWN0bFByb3ZpZGVyPzogSUt1YmVjdGxQcm92aWRlcjtcbiAgcHVibGljIHJlYWRvbmx5IG9uRXZlbnRMYXllcj86IGxhbWJkYS5JTGF5ZXJWZXJzaW9uO1xuICBwdWJsaWMgcmVhZG9ubHkga3ViZWN0bE1lbW9yeT86IFNpemU7XG4gIHB1YmxpYyByZWFkb25seSBjbHVzdGVySGFuZGxlclNlY3VyaXR5R3JvdXA/OiBlYzIuSVNlY3VyaXR5R3JvdXAgfCB1bmRlZmluZWQ7XG4gIHB1YmxpYyByZWFkb25seSBwcnVuZTogYm9vbGVhbjtcblxuICAvLyBzbyB0aGF0IGBjbHVzdGVyU2VjdXJpdHlHcm91cGAgb24gYElDbHVzdGVyYCBjYW4gYmUgY29uZmlndXJlZCB3aXRob3V0IG9wdGlvbmFsaXR5LCBhdm9pZGluZyB1c2VycyBmcm9tIGhhdmluZ1xuICAvLyB0byBudWxsIGNoZWNrIG9uIGFuIGluc3RhbmNlIG9mIGBDbHVzdGVyYCwgd2hpY2ggd2lsbCBhbHdheXMgaGF2ZSB0aGlzIGNvbmZpZ3VyZWQuXG4gIHByaXZhdGUgcmVhZG9ubHkgX2NsdXN0ZXJTZWN1cml0eUdyb3VwPzogZWMyLklTZWN1cml0eUdyb3VwO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByaXZhdGUgcmVhZG9ubHkgcHJvcHM6IENsdXN0ZXJBdHRyaWJ1dGVzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIHRoaXMuY2x1c3Rlck5hbWUgPSBwcm9wcy5jbHVzdGVyTmFtZTtcbiAgICB0aGlzLmNsdXN0ZXJBcm4gPSB0aGlzLnN0YWNrLmZvcm1hdEFybihjbHVzdGVyQXJuQ29tcG9uZW50cyhwcm9wcy5jbHVzdGVyTmFtZSkpO1xuICAgIHRoaXMua3ViZWN0bFJvbGUgPSBwcm9wcy5rdWJlY3RsUm9sZUFybiA/IGlhbS5Sb2xlLmZyb21Sb2xlQXJuKHRoaXMsICdLdWJlY3RsUm9sZScsIHByb3BzLmt1YmVjdGxSb2xlQXJuKSA6IHVuZGVmaW5lZDtcbiAgICB0aGlzLmt1YmVjdGxMYW1iZGFSb2xlID0gcHJvcHMua3ViZWN0bExhbWJkYVJvbGU7XG4gICAgdGhpcy5rdWJlY3RsU2VjdXJpdHlHcm91cCA9IHByb3BzLmt1YmVjdGxTZWN1cml0eUdyb3VwSWQgPyBlYzIuU2VjdXJpdHlHcm91cC5mcm9tU2VjdXJpdHlHcm91cElkKHRoaXMsICdLdWJlY3RsU2VjdXJpdHlHcm91cCcsIHByb3BzLmt1YmVjdGxTZWN1cml0eUdyb3VwSWQpIDogdW5kZWZpbmVkO1xuICAgIHRoaXMua3ViZWN0bEVudmlyb25tZW50ID0gcHJvcHMua3ViZWN0bEVudmlyb25tZW50O1xuICAgIHRoaXMua3ViZWN0bFByaXZhdGVTdWJuZXRzID0gcHJvcHMua3ViZWN0bFByaXZhdGVTdWJuZXRJZHMgPyBwcm9wcy5rdWJlY3RsUHJpdmF0ZVN1Ym5ldElkcy5tYXAoKHN1Ym5ldGlkLCBpbmRleCkgPT4gZWMyLlN1Ym5ldC5mcm9tU3VibmV0SWQodGhpcywgYEt1YmVjdGxTdWJuZXQke2luZGV4fWAsIHN1Ym5ldGlkKSkgOiB1bmRlZmluZWQ7XG4gICAgdGhpcy5rdWJlY3RsTGF5ZXIgPSBwcm9wcy5rdWJlY3RsTGF5ZXI7XG4gICAgdGhpcy5hd3NjbGlMYXllciA9IHByb3BzLmF3c2NsaUxheWVyO1xuICAgIHRoaXMua3ViZWN0bE1lbW9yeSA9IHByb3BzLmt1YmVjdGxNZW1vcnk7XG4gICAgdGhpcy5jbHVzdGVySGFuZGxlclNlY3VyaXR5R3JvdXAgPSBwcm9wcy5jbHVzdGVySGFuZGxlclNlY3VyaXR5R3JvdXBJZCA/IGVjMi5TZWN1cml0eUdyb3VwLmZyb21TZWN1cml0eUdyb3VwSWQodGhpcywgJ0NsdXN0ZXJIYW5kbGVyU2VjdXJpdHlHcm91cCcsIHByb3BzLmNsdXN0ZXJIYW5kbGVyU2VjdXJpdHlHcm91cElkKSA6IHVuZGVmaW5lZDtcbiAgICB0aGlzLmt1YmVjdGxQcm92aWRlciA9IHByb3BzLmt1YmVjdGxQcm92aWRlcjtcbiAgICB0aGlzLm9uRXZlbnRMYXllciA9IHByb3BzLm9uRXZlbnRMYXllcjtcbiAgICB0aGlzLnBydW5lID0gcHJvcHMucHJ1bmUgPz8gdHJ1ZTtcblxuICAgIGxldCBpID0gMTtcbiAgICBmb3IgKGNvbnN0IHNnaWQgb2YgcHJvcHMuc2VjdXJpdHlHcm91cElkcyA/PyBbXSkge1xuICAgICAgdGhpcy5jb25uZWN0aW9ucy5hZGRTZWN1cml0eUdyb3VwKGVjMi5TZWN1cml0eUdyb3VwLmZyb21TZWN1cml0eUdyb3VwSWQodGhpcywgYFNlY3VyaXR5R3JvdXAke2l9YCwgc2dpZCkpO1xuICAgICAgaSsrO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5jbHVzdGVyU2VjdXJpdHlHcm91cElkKSB7XG4gICAgICB0aGlzLl9jbHVzdGVyU2VjdXJpdHlHcm91cCA9IGVjMi5TZWN1cml0eUdyb3VwLmZyb21TZWN1cml0eUdyb3VwSWQodGhpcywgJ0NsdXN0ZXJTZWN1cml0eUdyb3VwJywgdGhpcy5jbHVzdGVyU2VjdXJpdHlHcm91cElkKTtcbiAgICAgIHRoaXMuY29ubmVjdGlvbnMuYWRkU2VjdXJpdHlHcm91cCh0aGlzLl9jbHVzdGVyU2VjdXJpdHlHcm91cCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldCB2cGMoKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLnZwYykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdcInZwY1wiIGlzIG5vdCBkZWZpbmVkIGZvciB0aGlzIGltcG9ydGVkIGNsdXN0ZXInKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucHJvcHMudnBjO1xuICB9XG5cbiAgcHVibGljIGdldCBjbHVzdGVyU2VjdXJpdHlHcm91cCgpOiBlYzIuSVNlY3VyaXR5R3JvdXAge1xuICAgIGlmICghdGhpcy5fY2x1c3RlclNlY3VyaXR5R3JvdXApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignXCJjbHVzdGVyU2VjdXJpdHlHcm91cFwiIGlzIG5vdCBkZWZpbmVkIGZvciB0aGlzIGltcG9ydGVkIGNsdXN0ZXInKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2NsdXN0ZXJTZWN1cml0eUdyb3VwO1xuICB9XG5cbiAgcHVibGljIGdldCBjbHVzdGVyU2VjdXJpdHlHcm91cElkKCk6IHN0cmluZyB7XG4gICAgaWYgKCF0aGlzLnByb3BzLmNsdXN0ZXJTZWN1cml0eUdyb3VwSWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignXCJjbHVzdGVyU2VjdXJpdHlHcm91cElkXCIgaXMgbm90IGRlZmluZWQgZm9yIHRoaXMgaW1wb3J0ZWQgY2x1c3RlcicpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wcm9wcy5jbHVzdGVyU2VjdXJpdHlHcm91cElkO1xuICB9XG5cbiAgcHVibGljIGdldCBjbHVzdGVyRW5kcG9pbnQoKTogc3RyaW5nIHtcbiAgICBpZiAoIXRoaXMucHJvcHMuY2x1c3RlckVuZHBvaW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wiY2x1c3RlckVuZHBvaW50XCIgaXMgbm90IGRlZmluZWQgZm9yIHRoaXMgaW1wb3J0ZWQgY2x1c3RlcicpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wcm9wcy5jbHVzdGVyRW5kcG9pbnQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGNsdXN0ZXJDZXJ0aWZpY2F0ZUF1dGhvcml0eURhdGEoKTogc3RyaW5nIHtcbiAgICBpZiAoIXRoaXMucHJvcHMuY2x1c3RlckNlcnRpZmljYXRlQXV0aG9yaXR5RGF0YSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdcImNsdXN0ZXJDZXJ0aWZpY2F0ZUF1dGhvcml0eURhdGFcIiBpcyBub3QgZGVmaW5lZCBmb3IgdGhpcyBpbXBvcnRlZCBjbHVzdGVyJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnByb3BzLmNsdXN0ZXJDZXJ0aWZpY2F0ZUF1dGhvcml0eURhdGE7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGNsdXN0ZXJFbmNyeXB0aW9uQ29uZmlnS2V5QXJuKCk6IHN0cmluZyB7XG4gICAgaWYgKCF0aGlzLnByb3BzLmNsdXN0ZXJFbmNyeXB0aW9uQ29uZmlnS2V5QXJuKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wiY2x1c3RlckVuY3J5cHRpb25Db25maWdLZXlBcm5cIiBpcyBub3QgZGVmaW5lZCBmb3IgdGhpcyBpbXBvcnRlZCBjbHVzdGVyJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnByb3BzLmNsdXN0ZXJFbmNyeXB0aW9uQ29uZmlnS2V5QXJuO1xuICB9XG5cbiAgcHVibGljIGdldCBvcGVuSWRDb25uZWN0UHJvdmlkZXIoKTogaWFtLklPcGVuSWRDb25uZWN0UHJvdmlkZXIge1xuICAgIGlmICghdGhpcy5wcm9wcy5vcGVuSWRDb25uZWN0UHJvdmlkZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignXCJvcGVuSWRDb25uZWN0UHJvdmlkZXJcIiBpcyBub3QgZGVmaW5lZCBmb3IgdGhpcyBpbXBvcnRlZCBjbHVzdGVyJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnByb3BzLm9wZW5JZENvbm5lY3RQcm92aWRlcjtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgYXdzQXV0aCgpOiBBd3NBdXRoIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1wiYXdzQXV0aFwiIGlzIG5vdCBzdXBwb3J0ZWQgb24gaW1wb3J0ZWQgY2x1c3RlcnMnKTtcbiAgfVxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIEVrc09wdGltaXplZEltYWdlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRWtzT3B0aW1pemVkSW1hZ2VQcm9wcyB7XG4gIC8qKlxuICAgKiBXaGF0IGluc3RhbmNlIHR5cGUgdG8gcmV0cmlldmUgdGhlIGltYWdlIGZvciAoc3RhbmRhcmQgb3IgR1BVLW9wdGltaXplZClcbiAgICpcbiAgICogQGRlZmF1bHQgTm9kZVR5cGUuU1RBTkRBUkRcbiAgICovXG4gIHJlYWRvbmx5IG5vZGVUeXBlPzogTm9kZVR5cGU7XG5cbiAgLyoqXG4gICAqIFdoYXQgY3B1IGFyY2hpdGVjdHVyZSB0byByZXRyaWV2ZSB0aGUgaW1hZ2UgZm9yIChhcm02NCBvciB4ODZfNjQpXG4gICAqXG4gICAqIEBkZWZhdWx0IENwdUFyY2guWDg2XzY0XG4gICAqL1xuICByZWFkb25seSBjcHVBcmNoPzogQ3B1QXJjaDtcblxuICAvKipcbiAgICogVGhlIEt1YmVybmV0ZXMgdmVyc2lvbiB0byB1c2VcbiAgICpcbiAgICogQGRlZmF1bHQgLSBUaGUgbGF0ZXN0IHZlcnNpb25cbiAgICovXG4gIHJlYWRvbmx5IGt1YmVybmV0ZXNWZXJzaW9uPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIENvbnN0cnVjdCBhbiBBbWF6b24gTGludXggMiBpbWFnZSBmcm9tIHRoZSBsYXRlc3QgRUtTIE9wdGltaXplZCBBTUkgcHVibGlzaGVkIGluIFNTTVxuICovXG5leHBvcnQgY2xhc3MgRWtzT3B0aW1pemVkSW1hZ2UgaW1wbGVtZW50cyBlYzIuSU1hY2hpbmVJbWFnZSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgbm9kZVR5cGU/OiBOb2RlVHlwZTtcbiAgcHJpdmF0ZSByZWFkb25seSBjcHVBcmNoPzogQ3B1QXJjaDtcbiAgcHJpdmF0ZSByZWFkb25seSBrdWJlcm5ldGVzVmVyc2lvbj86IHN0cmluZztcbiAgcHJpdmF0ZSByZWFkb25seSBhbWlQYXJhbWV0ZXJOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIEVjc09wdGltaXplZEFtaSBjbGFzcy5cbiAgICovXG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihwcm9wczogRWtzT3B0aW1pemVkSW1hZ2VQcm9wcyA9IHt9KSB7XG4gICAgdGhpcy5ub2RlVHlwZSA9IHByb3BzLm5vZGVUeXBlID8/IE5vZGVUeXBlLlNUQU5EQVJEO1xuICAgIHRoaXMuY3B1QXJjaCA9IHByb3BzLmNwdUFyY2ggPz8gQ3B1QXJjaC5YODZfNjQ7XG4gICAgdGhpcy5rdWJlcm5ldGVzVmVyc2lvbiA9IHByb3BzLmt1YmVybmV0ZXNWZXJzaW9uID8/IExBVEVTVF9LVUJFUk5FVEVTX1ZFUlNJT047XG5cbiAgICAvLyBzZXQgdGhlIFNTTSBwYXJhbWV0ZXIgbmFtZVxuICAgIHRoaXMuYW1pUGFyYW1ldGVyTmFtZSA9IGAvYXdzL3NlcnZpY2UvZWtzL29wdGltaXplZC1hbWkvJHt0aGlzLmt1YmVybmV0ZXNWZXJzaW9ufS9gXG4gICAgICArICh0aGlzLm5vZGVUeXBlID09PSBOb2RlVHlwZS5TVEFOREFSRCA/IHRoaXMuY3B1QXJjaCA9PT0gQ3B1QXJjaC5YODZfNjQgP1xuICAgICAgICAnYW1hem9uLWxpbnV4LTIvJyA6ICdhbWF6b24tbGludXgtMi1hcm02NC8nIDogJycpXG4gICAgICArICh0aGlzLm5vZGVUeXBlID09PSBOb2RlVHlwZS5HUFUgPyAnYW1hem9uLWxpbnV4LTItZ3B1LycgOiAnJylcbiAgICAgICsgKHRoaXMubm9kZVR5cGUgPT09IE5vZGVUeXBlLklORkVSRU5USUEgPyAnYW1hem9uLWxpbnV4LTItZ3B1LycgOiAnJylcbiAgICAgICsgJ3JlY29tbWVuZGVkL2ltYWdlX2lkJztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGNvcnJlY3QgaW1hZ2VcbiAgICovXG4gIHB1YmxpYyBnZXRJbWFnZShzY29wZTogQ29uc3RydWN0KTogZWMyLk1hY2hpbmVJbWFnZUNvbmZpZyB7XG4gICAgY29uc3QgYW1pID0gc3NtLlN0cmluZ1BhcmFtZXRlci52YWx1ZUZvclN0cmluZ1BhcmFtZXRlcihzY29wZSwgdGhpcy5hbWlQYXJhbWV0ZXJOYW1lKTtcbiAgICByZXR1cm4ge1xuICAgICAgaW1hZ2VJZDogYW1pLFxuICAgICAgb3NUeXBlOiBlYzIuT3BlcmF0aW5nU3lzdGVtVHlwZS5MSU5VWCxcbiAgICAgIHVzZXJEYXRhOiBlYzIuVXNlckRhdGEuZm9yTGludXgoKSxcbiAgICB9O1xuICB9XG59XG5cbi8vIE1BSU5UQUlORVJTOiB1c2UgLi9zY3JpcHRzL2t1YmVfYnVtcC5zaCB0byB1cGRhdGUgTEFURVNUX0tVQkVSTkVURVNfVkVSU0lPTlxuY29uc3QgTEFURVNUX0tVQkVSTkVURVNfVkVSU0lPTiA9ICcxLjI0JztcblxuLyoqXG4gKiBXaGV0aGVyIHRoZSB3b3JrZXIgbm9kZXMgc2hvdWxkIHN1cHBvcnQgR1BVIG9yIGp1c3Qgc3RhbmRhcmQgaW5zdGFuY2VzXG4gKi9cbmV4cG9ydCBlbnVtIE5vZGVUeXBlIHtcbiAgLyoqXG4gICAqIFN0YW5kYXJkIGluc3RhbmNlc1xuICAgKi9cbiAgU1RBTkRBUkQgPSAnU3RhbmRhcmQnLFxuXG4gIC8qKlxuICAgKiBHUFUgaW5zdGFuY2VzXG4gICAqL1xuICBHUFUgPSAnR1BVJyxcblxuICAvKipcbiAgICogSW5mZXJlbnRpYSBpbnN0YW5jZXNcbiAgICovXG4gIElORkVSRU5USUEgPSAnSU5GRVJFTlRJQScsXG59XG5cbi8qKlxuICogQ1BVIGFyY2hpdGVjdHVyZVxuICovXG5leHBvcnQgZW51bSBDcHVBcmNoIHtcbiAgLyoqXG4gICAqIGFybTY0IENQVSB0eXBlXG4gICAqL1xuICBBUk1fNjQgPSAnYXJtNjQnLFxuXG4gIC8qKlxuICAgKiB4ODZfNjQgQ1BVIHR5cGVcbiAgICovXG4gIFg4Nl82NCA9ICd4ODZfNjQnLFxufVxuXG4vKipcbiAqIFRoZSB0eXBlIG9mIGNvbXB1dGUgcmVzb3VyY2VzIHRvIHVzZSBmb3IgQ29yZUROUy5cbiAqL1xuZXhwb3J0IGVudW0gQ29yZURuc0NvbXB1dGVUeXBlIHtcbiAgLyoqXG4gICAqIERlcGxveSBDb3JlRE5TIG9uIEVDMiBpbnN0YW5jZXMuXG4gICAqL1xuICBFQzIgPSAnZWMyJyxcblxuICAvKipcbiAgICogRGVwbG95IENvcmVETlMgb24gRmFyZ2F0ZS1tYW5hZ2VkIGluc3RhbmNlcy5cbiAgICovXG4gIEZBUkdBVEUgPSAnZmFyZ2F0ZScsXG59XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgY2FwYWNpdHkgdHlwZSBmb3IgdGhlIGNsdXN0ZXJcbiAqL1xuZXhwb3J0IGVudW0gRGVmYXVsdENhcGFjaXR5VHlwZSB7XG4gIC8qKlxuICAgKiBtYW5hZ2VkIG5vZGUgZ3JvdXBcbiAgICovXG4gIE5PREVHUk9VUCxcbiAgLyoqXG4gICAqIEVDMiBhdXRvc2NhbGluZyBncm91cFxuICAgKi9cbiAgRUMyLFxufVxuXG4vKipcbiAqIFRoZSBtYWNoaW5lIGltYWdlIHR5cGVcbiAqL1xuZXhwb3J0IGVudW0gTWFjaGluZUltYWdlVHlwZSB7XG4gIC8qKlxuICAgKiBBbWF6b24gRUtTLW9wdGltaXplZCBMaW51eCBBTUlcbiAgICovXG4gIEFNQVpPTl9MSU5VWF8yLFxuICAvKipcbiAgICogQm90dGxlcm9ja2V0IEFNSVxuICAgKi9cbiAgQk9UVExFUk9DS0VULFxufVxuXG5mdW5jdGlvbiBub2RlVHlwZUZvckluc3RhbmNlVHlwZShpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUpIHtcbiAgcmV0dXJuIElOU1RBTkNFX1RZUEVTLmdwdS5pbmNsdWRlcyhpbnN0YW5jZVR5cGUudG9TdHJpbmcoKS5zdWJzdHJpbmcoMCwgMikpID8gTm9kZVR5cGUuR1BVIDpcbiAgICBJTlNUQU5DRV9UWVBFUy5pbmZlcmVudGlhLmluY2x1ZGVzKGluc3RhbmNlVHlwZS50b1N0cmluZygpLnN1YnN0cmluZygwLCA0KSkgPyBOb2RlVHlwZS5JTkZFUkVOVElBIDpcbiAgICAgIE5vZGVUeXBlLlNUQU5EQVJEO1xufVxuXG5mdW5jdGlvbiBjcHVBcmNoRm9ySW5zdGFuY2VUeXBlKGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZSkge1xuICByZXR1cm4gSU5TVEFOQ0VfVFlQRVMuZ3Jhdml0b24yLmluY2x1ZGVzKGluc3RhbmNlVHlwZS50b1N0cmluZygpLnN1YnN0cmluZygwLCAzKSkgPyBDcHVBcmNoLkFSTV82NCA6XG4gICAgSU5TVEFOQ0VfVFlQRVMuZ3Jhdml0b24zLmluY2x1ZGVzKGluc3RhbmNlVHlwZS50b1N0cmluZygpLnN1YnN0cmluZygwLCAzKSkgPyBDcHVBcmNoLkFSTV82NCA6XG4gICAgICBJTlNUQU5DRV9UWVBFUy5ncmF2aXRvbi5pbmNsdWRlcyhpbnN0YW5jZVR5cGUudG9TdHJpbmcoKS5zdWJzdHJpbmcoMCwgMikpID8gQ3B1QXJjaC5BUk1fNjQgOlxuICAgICAgICBDcHVBcmNoLlg4Nl82NDtcbn1cblxuZnVuY3Rpb24gZmxhdHRlbjxBPih4c3M6IEFbXVtdKTogQVtdIHtcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5jb25jYXQuY2FsbChbXSwgLi4ueHNzKTtcbn1cbiJdfQ==