"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MachineImageType = exports.DefaultCapacityType = exports.CoreDnsComputeType = exports.CpuArch = exports.NodeType = exports.EksOptimizedImage = exports.Cluster = exports.IpFamily = exports.ClusterLoggingTypes = exports.KubernetesVersion = exports.EndpointAccess = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const fs = require("fs");
const path = require("path");
const autoscaling = require("aws-cdk-lib/aws-autoscaling");
const ec2 = require("aws-cdk-lib/aws-ec2");
const aws_eks_1 = require("aws-cdk-lib/aws-eks");
const iam = require("aws-cdk-lib/aws-iam");
const ssm = require("aws-cdk-lib/aws-ssm");
const core_1 = require("aws-cdk-lib/core");
const metadata_resource_1 = require("aws-cdk-lib/core/lib/metadata-resource");
const prop_injectable_1 = require("aws-cdk-lib/core/lib/prop-injectable");
const constructs_1 = require("constructs");
const YAML = require("yaml");
const access_entry_1 = require("./access-entry");
const addon_1 = require("./addon");
const alb_controller_1 = require("./alb-controller");
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
    _config;
    static [JSII_RTTI_SYMBOL_1] = { fqn: "@aws-cdk/aws-eks-v2-alpha.EndpointAccess", version: "0.0.0" };
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
    static PUBLIC = new EndpointAccess({ privateAccess: false, publicAccess: true });
    /**
     * The cluster endpoint is only accessible through your VPC.
     * Worker node traffic to the endpoint will stay within your VPC.
     */
    static PRIVATE = new EndpointAccess({ privateAccess: true, publicAccess: false });
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
    static PUBLIC_AND_PRIVATE = new EndpointAccess({ privateAccess: true, publicAccess: true });
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
/**
 * Kubernetes cluster version
 * @see https://docs.aws.amazon.com/eks/latest/userguide/kubernetes-versions.html#kubernetes-release-calendar
 */
class KubernetesVersion {
    version;
    static [JSII_RTTI_SYMBOL_1] = { fqn: "@aws-cdk/aws-eks-v2-alpha.KubernetesVersion", version: "0.0.0" };
    /**
     * Kubernetes version 1.25
     *
     * When creating a `Cluster` with this version, you need to also specify the
     * `kubectlLayer` property with a `KubectlV25Layer` from
     * `@aws-cdk/lambda-layer-kubectl-v25`.
     */
    static V1_25 = KubernetesVersion.of('1.25');
    /**
     * Kubernetes version 1.26
     *
     * When creating a `Cluster` with this version, you need to also specify the
     * `kubectlLayer` property with a `KubectlV26Layer` from
     * `@aws-cdk/lambda-layer-kubectl-v26`.
     */
    static V1_26 = KubernetesVersion.of('1.26');
    /**
     * Kubernetes version 1.27
     *
     * When creating a `Cluster` with this version, you need to also specify the
     * `kubectlLayer` property with a `KubectlV27Layer` from
     * `@aws-cdk/lambda-layer-kubectl-v27`.
     */
    static V1_27 = KubernetesVersion.of('1.27');
    /**
     * Kubernetes version 1.28
     *
     * When creating a `Cluster` with this version, you need to also specify the
     * `kubectlLayer` property with a `KubectlV28Layer` from
     * `@aws-cdk/lambda-layer-kubectl-v28`.
     */
    static V1_28 = KubernetesVersion.of('1.28');
    /**
     * Kubernetes version 1.29
     *
     * When creating a `Cluster` with this version, you need to also specify the
     * `kubectlLayer` property with a `KubectlV29Layer` from
     * `@aws-cdk/lambda-layer-kubectl-v29`.
     */
    static V1_29 = KubernetesVersion.of('1.29');
    /**
     * Kubernetes version 1.30
     *
     * When creating a `Cluster` with this version, you need to also specify the
     * `kubectlLayer` property with a `KubectlV30Layer` from
     * `@aws-cdk/lambda-layer-kubectl-v30`.
     */
    static V1_30 = KubernetesVersion.of('1.30');
    /**
     * Kubernetes version 1.31
     *
     * When creating a `Cluster` with this version, you need to also specify the
     * `kubectlLayer` property with a `KubectlV31Layer` from
     * `@aws-cdk/lambda-layer-kubectl-v31`.
     */
    static V1_31 = KubernetesVersion.of('1.31');
    /**
     * Kubernetes version 1.32
     *
     * When creating a `Cluster` with this version, you need to also specify the
     * `kubectlLayer` property with a `KubectlV32Layer` from
     * `@aws-cdk/lambda-layer-kubectl-v32`.
     */
    static V1_32 = KubernetesVersion.of('1.32');
    /**
     * Kubernetes version 1.33
     *
     * When creating a `Cluster` with this version, you need to also specify the
     * `kubectlLayer` property with a `KubectlV33Layer` from
     * `@aws-cdk/lambda-layer-kubectl-v33`.
     */
    static V1_33 = KubernetesVersion.of('1.33');
    /**
     * Kubernetes version 1.34
     *
     * When creating a `Cluster` with this version, you need to also specify the
     * `kubectlLayer` property with a `KubectlV34Layer` from
     * `@aws-cdk/lambda-layer-kubectl-v34`.
     */
    static V1_34 = KubernetesVersion.of('1.34');
    /**
     * Custom cluster version
     * @param version custom version number
     */
    static of(version) { return new KubernetesVersion(version); }
    /**
     *
     * @param version cluster version number
     */
    constructor(version) {
        this.version = version;
    }
}
exports.KubernetesVersion = KubernetesVersion;
// Shared definition with packages/@aws-cdk/custom-resource-handlers/test/aws-eks/compare-log.test.ts
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
})(ClusterLoggingTypes || (exports.ClusterLoggingTypes = ClusterLoggingTypes = {}));
/**
 * EKS cluster IP family.
 */
var IpFamily;
(function (IpFamily) {
    /**
     * Use IPv4 for pods and services in your cluster.
     */
    IpFamily["IP_V4"] = "ipv4";
    /**
     * Use IPv6 for pods and services in your cluster.
     */
    IpFamily["IP_V6"] = "ipv6";
})(IpFamily || (exports.IpFamily = IpFamily = {}));
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
     * Connect capacity in the form of an existing AutoScalingGroup to the EKS cluster.
     *
     * The AutoScalingGroup must be running an EKS-optimized AMI containing the
     * /etc/eks/bootstrap.sh script. This method will configure Security Groups,
     * add the right policies to the instance role, apply the right tags, and add
     * the required user data to the instance's launch configuration.
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
                (0, user_data_1.renderBottlerocketUserData)(this) :
                (0, user_data_1.renderAmazonLinuxUserData)(this, autoScalingGroup, options.bootstrapOptions);
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
        // since we are not mapping the instance role to RBAC, synthesize an
        // output so it can be pasted into `aws-auth-cm.yaml`
        new core_1.CfnOutput(autoScalingGroup, 'InstanceRoleARN', {
            value: autoScalingGroup.role.roleArn,
        });
        if (this instanceof Cluster && this.albController) {
            // the controller runs on the worker nodes so they cannot
            // be deleted before the controller.
            constructs_1.Node.of(this.albController).addDependency(autoScalingGroup);
        }
    }
}
/**
 * A Cluster represents a managed Kubernetes Service (EKS)
 *
 * This is a fully managed cluster of API Servers (control-plane)
 * The user is still required to create the worker nodes.
 * @resource AWS::EKS::Cluster
 */
let Cluster = (() => {
    let _classDecorators = [prop_injectable_1.propertyInjectable];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = ClusterBase;
    let _instanceExtraInitializers = [];
    let _grantAccess_decorators;
    let _grantClusterAdmin_decorators;
    let _getServiceLoadBalancerAddress_decorators;
    let _getIngressLoadBalancerAddress_decorators;
    let _addAutoScalingGroupCapacity_decorators;
    let _addNodegroupCapacity_decorators;
    let _addFargateProfile_decorators;
    var Cluster = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _grantAccess_decorators = [(0, metadata_resource_1.MethodMetadata)()];
            _grantClusterAdmin_decorators = [(0, metadata_resource_1.MethodMetadata)()];
            _getServiceLoadBalancerAddress_decorators = [(0, metadata_resource_1.MethodMetadata)()];
            _getIngressLoadBalancerAddress_decorators = [(0, metadata_resource_1.MethodMetadata)()];
            _addAutoScalingGroupCapacity_decorators = [(0, metadata_resource_1.MethodMetadata)()];
            _addNodegroupCapacity_decorators = [(0, metadata_resource_1.MethodMetadata)()];
            _addFargateProfile_decorators = [(0, metadata_resource_1.MethodMetadata)()];
            __esDecorate(this, null, _grantAccess_decorators, { kind: "method", name: "grantAccess", static: false, private: false, access: { has: obj => "grantAccess" in obj, get: obj => obj.grantAccess }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _grantClusterAdmin_decorators, { kind: "method", name: "grantClusterAdmin", static: false, private: false, access: { has: obj => "grantClusterAdmin" in obj, get: obj => obj.grantClusterAdmin }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getServiceLoadBalancerAddress_decorators, { kind: "method", name: "getServiceLoadBalancerAddress", static: false, private: false, access: { has: obj => "getServiceLoadBalancerAddress" in obj, get: obj => obj.getServiceLoadBalancerAddress }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _getIngressLoadBalancerAddress_decorators, { kind: "method", name: "getIngressLoadBalancerAddress", static: false, private: false, access: { has: obj => "getIngressLoadBalancerAddress" in obj, get: obj => obj.getIngressLoadBalancerAddress }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _addAutoScalingGroupCapacity_decorators, { kind: "method", name: "addAutoScalingGroupCapacity", static: false, private: false, access: { has: obj => "addAutoScalingGroupCapacity" in obj, get: obj => obj.addAutoScalingGroupCapacity }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _addNodegroupCapacity_decorators, { kind: "method", name: "addNodegroupCapacity", static: false, private: false, access: { has: obj => "addNodegroupCapacity" in obj, get: obj => obj.addNodegroupCapacity }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _addFargateProfile_decorators, { kind: "method", name: "addFargateProfile", static: false, private: false, access: { has: obj => "addFargateProfile" in obj, get: obj => obj.addFargateProfile }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            Cluster = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static [JSII_RTTI_SYMBOL_1] = { fqn: "@aws-cdk/aws-eks-v2-alpha.Cluster", version: "0.0.0" };
        /** Uniquely identifies this class. */
        static PROPERTY_INJECTION_ID = '@aws-cdk.aws-eks-v2-alpha.Cluster';
        /**
         * Import an existing cluster
         *
         * @param scope the construct scope, in most cases 'this'
         * @param id the id or name to import as
         * @param attrs the cluster properties to use for importing information
         */
        static fromClusterAttributes(scope, id, attrs) {
            try {
                jsiiDeprecationWarnings._aws_cdk_aws_eks_v2_alpha_ClusterAttributes(attrs);
            }
            catch (error) {
                if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                    Error.captureStackTrace(error, this.fromClusterAttributes);
                }
                throw error;
            }
            return new ImportedCluster(scope, id, attrs);
        }
        accessEntries = (__runInitializers(this, _instanceExtraInitializers), new Map());
        /**
         * The VPC in which this Cluster was created
         */
        vpc;
        /**
         * The Name of the created EKS Cluster
         */
        clusterName;
        /**
         * The AWS generated ARN for the Cluster resource
         *
         * For example, `arn:aws:eks:us-west-2:666666666666:cluster/prod`
         */
        clusterArn;
        /**
         * The endpoint URL for the Cluster
         *
         * This is the URL inside the kubeconfig file to use with kubectl
         *
         * For example, `https://5E1D0CEXAMPLEA591B746AFC5AB30262.yl4.us-west-2.eks.amazonaws.com`
         */
        clusterEndpoint;
        /**
         * The certificate-authority-data for your cluster.
         */
        clusterCertificateAuthorityData;
        /**
         * The id of the cluster security group that was created by Amazon EKS for the cluster.
         */
        clusterSecurityGroupId;
        /**
         * The cluster security group that was created by Amazon EKS for the cluster.
         */
        clusterSecurityGroup;
        /**
         * Amazon Resource Name (ARN) or alias of the customer master key (CMK).
         */
        clusterEncryptionConfigKeyArn;
        /**
         * Manages connection rules (Security Group Rules) for the cluster
         *
         * @type {ec2.Connections}
         * @memberof Cluster
         */
        connections;
        /**
         * IAM role assumed by the EKS Control Plane
         */
        role;
        /**
         * The auto scaling group that hosts the default capacity for this cluster.
         * This will be `undefined` if the `defaultCapacityType` is not `EC2` or
         * `defaultCapacityType` is `EC2` but default capacity is set to 0.
         */
        defaultCapacity;
        /**
         * The node group that hosts the default capacity for this cluster.
         * This will be `undefined` if the `defaultCapacityType` is `EC2` or
         * `defaultCapacityType` is `NODEGROUP` but default capacity is set to 0.
         */
        defaultNodegroup;
        /**
         * Specify which IP family is used to assign Kubernetes pod and service IP addresses.
         *
         * @default IpFamily.IP_V4
         * @see https://docs.aws.amazon.com/eks/latest/APIReference/API_KubernetesNetworkConfigRequest.html#AmazonEKS-Type-KubernetesNetworkConfigRequest-ipFamily
         */
        ipFamily;
        /**
         * If the cluster has one (or more) FargateProfiles associated, this array
         * will hold a reference to each.
         */
        _fargateProfiles = [];
        /**
         * an Open ID Connect Provider instance
         */
        _openIdConnectProvider;
        /**
         * an EKS Pod Identity Agent instance
         */
        _eksPodIdentityAgent;
        /**
         * Determines if Kubernetes resources can be pruned automatically.
         */
        prune;
        /**
         * The ALB Controller construct defined for this cluster.
         * Will be undefined if `albController` wasn't configured.
         */
        albController;
        _clusterResource;
        _neuronDevicePlugin;
        endpointAccess;
        vpcSubnets;
        version;
        // TODO: revisit logging format
        logging;
        /**
         * A dummy CloudFormation resource that is used as a wait barrier which
         * represents that the cluster is ready to receive "kubectl" commands.
         *
         * Specifically, all fargate profiles are automatically added as a dependency
         * of this barrier, which means that it will only be "signaled" when all
         * fargate profiles have been successfully created.
         *
         * When kubectl resources call `_attachKubectlResourceScope()`, this resource
         * is added as their dependency which implies that they can only be deployed
         * after the cluster is ready.
         */
        _kubectlReadyBarrier;
        _kubectlProviderOptions;
        _kubectlProvider;
        _clusterAdminAccess;
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
            try {
                jsiiDeprecationWarnings._aws_cdk_aws_eks_v2_alpha_ClusterProps(props);
            }
            catch (error) {
                if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                    Error.captureStackTrace(error, Cluster);
                }
                throw error;
            }
            // Enhanced CDK Analytics Telemetry
            (0, metadata_resource_1.addConstructMetadata)(this, props);
            this.prune = props.prune ?? true;
            this.vpc = props.vpc || new ec2.Vpc(this, 'DefaultVpc');
            this.version = props.version;
            this._kubectlProviderOptions = props.kubectlProviderOptions;
            this.tagSubnets();
            // this is the role used by EKS when interacting with AWS resources
            this.role = props.role || new iam.Role(this, 'Role', {
                assumedBy: new iam.ServicePrincipal('eks.amazonaws.com'),
                managedPolicies: [
                    iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSClusterPolicy'),
                ],
            });
            // validate all automode relevant configurations
            const autoModeEnabled = this.isValidAutoModeConfig(props);
            if (autoModeEnabled) {
                // attach required managed policy for the cluster role in EKS Auto Mode
                // see - https://docs.aws.amazon.com/eks/latest/userguide/auto-cluster-iam-role.html
                ['AmazonEKSComputePolicy',
                    'AmazonEKSBlockStoragePolicy',
                    'AmazonEKSLoadBalancingPolicy',
                    'AmazonEKSNetworkingPolicy'].forEach((policyName) => {
                    this.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName(policyName));
                });
                // sts:TagSession is required for EKS Auto Mode or when using EKS Pod Identity features.
                // see https://docs.aws.amazon.com/eks/latest/userguide/pod-id-role.html
                // https://docs.aws.amazon.com/eks/latest/userguide/automode-get-started-cli.html#_create_an_eks_auto_mode_cluster_iam_role
                if (this.role instanceof iam.Role) {
                    this.role.assumeRolePolicy?.addStatements(new iam.PolicyStatement({
                        effect: iam.Effect.ALLOW,
                        principals: [new iam.ServicePrincipal('eks.amazonaws.com')],
                        actions: ['sts:TagSession'],
                    }));
                }
            }
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
                clusterLogging: {
                    enabledTypes: props.clusterLogging.map((type) => ({ type })),
                },
            } : undefined;
            this.endpointAccess = props.endpointAccess ?? EndpointAccess.PUBLIC_AND_PRIVATE;
            this.ipFamily = props.ipFamily ?? IpFamily.IP_V4;
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
            if (props.serviceIpv4Cidr && props.ipFamily == IpFamily.IP_V6) {
                throw new Error('Cannot specify serviceIpv4Cidr with ipFamily equal to IpFamily.IP_V6');
            }
            const resource = this._clusterResource = new aws_eks_1.CfnCluster(this, 'Resource', {
                name: this.physicalName,
                roleArn: this.role.roleArn,
                version: props.version.version,
                accessConfig: {
                    authenticationMode: 'API',
                    bootstrapClusterCreatorAdminPermissions: props.bootstrapClusterCreatorAdminPermissions,
                },
                computeConfig: {
                    enabled: autoModeEnabled,
                    // If the computeConfig enabled flag is set to false when creating a cluster with Auto Mode,
                    // the request must not include values for the nodeRoleArn or nodePools fields.
                    // Also, if nodePools is empty, nodeRoleArn should not be included to prevent deployment failures
                    nodePools: !autoModeEnabled ? undefined : props.compute?.nodePools ?? ['system', 'general-purpose'],
                    nodeRoleArn: !autoModeEnabled || (props.compute?.nodePools && props.compute.nodePools.length === 0) ?
                        undefined :
                        props.compute?.nodeRole?.roleArn ?? this.addNodePoolRole(`${id}nodePoolRole`).roleArn,
                },
                storageConfig: {
                    blockStorage: {
                        enabled: autoModeEnabled,
                    },
                },
                kubernetesNetworkConfig: {
                    ipFamily: this.ipFamily,
                    serviceIpv4Cidr: props.serviceIpv4Cidr,
                    elasticLoadBalancing: {
                        enabled: autoModeEnabled,
                    },
                },
                resourcesVpcConfig: {
                    securityGroupIds: [securityGroup.securityGroupId],
                    subnetIds,
                    endpointPrivateAccess: this.endpointAccess._config.privateAccess,
                    endpointPublicAccess: this.endpointAccess._config.publicAccess,
                    publicAccessCidrs: this.endpointAccess._config.publicCidrs,
                },
                ...(props.secretsEncryptionKey ? {
                    encryptionConfig: [{
                            provider: {
                                keyArn: props.secretsEncryptionKey.keyRef.keyArn,
                            },
                            resources: ['secrets'],
                        }],
                } : {}),
                tags: Object.keys(props.tags ?? {}).map(k => ({ key: k, value: props.tags[k] })),
                logging: this.logging,
            });
            let kubectlSubnets = this._kubectlProviderOptions?.privateSubnets;
            if (this.endpointAccess._config.privateAccess && privateSubnets.length !== 0) {
                // when private access is enabled and the vpc has private subnets, lets connect
                // the provider to the vpc so that it will work even when restricting public access.
                // validate VPC properties according to: https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html
                if (this.vpc instanceof ec2.Vpc && !(this.vpc.dnsHostnamesEnabled && this.vpc.dnsSupportEnabled)) {
                    throw new Error('Private endpoint access requires the VPC to have DNS support and DNS hostnames enabled. Use `enableDnsHostnames: true` and `enableDnsSupport: true` when creating the VPC.');
                }
                kubectlSubnets = privateSubnets;
                // the vpc must exist in order to properly delete the cluster (since we run `kubectl delete`).
                // this ensures that.
                this._clusterResource.node.addDependency(this.vpc);
            }
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
            this.clusterArn = this.getResourceArnAttribute(resource.attrArn, clusterArnComponents(this.physicalName));
            this.clusterEndpoint = resource.attrEndpoint;
            this.clusterCertificateAuthorityData = resource.attrCertificateAuthorityData;
            this.clusterSecurityGroupId = resource.attrClusterSecurityGroupId;
            this.clusterEncryptionConfigKeyArn = resource.attrEncryptionConfigKeyArn;
            this.clusterSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(this, 'ClusterSecurityGroup', this.clusterSecurityGroupId);
            this.connections = new ec2.Connections({
                securityGroups: [this.clusterSecurityGroup, securityGroup],
                defaultPort: ec2.Port.tcp(443), // Control Plane has an HTTPS API
            });
            const stack = core_1.Stack.of(this);
            const updateConfigCommandPrefix = `aws eks update-kubeconfig --name ${this.clusterName}`;
            const getTokenCommandPrefix = `aws eks get-token --cluster-name ${this.clusterName}`;
            const commonCommandOptions = [`--region ${stack.region}`];
            if (props.kubectlProviderOptions) {
                this._kubectlProvider = new kubectl_provider_1.KubectlProvider(this, 'KubectlProvider', {
                    cluster: this,
                    role: this._kubectlProviderOptions?.role,
                    awscliLayer: this._kubectlProviderOptions?.awscliLayer,
                    kubectlLayer: this._kubectlProviderOptions.kubectlLayer,
                    environment: this._kubectlProviderOptions?.environment,
                    memory: this._kubectlProviderOptions?.memory,
                    privateSubnets: kubectlSubnets,
                });
                // give the handler role admin access to the cluster
                // so it can deploy/query any resource.
                this._clusterAdminAccess = this.grantClusterAdmin('ClusterAdminRoleAccess', this._kubectlProvider?.role.roleArn);
            }
            // do not create a masters role if one is not provided. Trusting the accountRootPrincipal() is too permissive.
            if (props.mastersRole) {
                const mastersRole = props.mastersRole;
                this.grantAccess('mastersRoleAccess', props.mastersRole.roleArn, [
                    access_entry_1.AccessPolicy.fromAccessPolicyName('AmazonEKSClusterAdminPolicy', {
                        accessScopeType: access_entry_1.AccessScopeType.CLUSTER,
                    }),
                ]);
                commonCommandOptions.push(`--role-arn ${mastersRole.roleArn}`);
            }
            if (props.albController) {
                this.albController = alb_controller_1.AlbController.create(this, { ...props.albController, cluster: this });
            }
            // if any of defaultCapacity* properties are set, we need a default capacity(nodegroup)
            if (props.defaultCapacity !== undefined ||
                props.defaultCapacityType !== undefined ||
                props.defaultCapacityInstance !== undefined) {
                const minCapacity = props.defaultCapacity ?? DEFAULT_CAPACITY_COUNT;
                if (minCapacity > 0) {
                    const instanceType = props.defaultCapacityInstance || DEFAULT_CAPACITY_TYPE;
                    // If defaultCapacityType is undefined, use AUTOMODE as the default
                    const capacityType = props.defaultCapacityType ?? DefaultCapacityType.AUTOMODE;
                    // Only create EC2 or Nodegroup capacity if not using AUTOMODE
                    if (capacityType === DefaultCapacityType.EC2) {
                        this.defaultCapacity = this.addAutoScalingGroupCapacity('DefaultCapacity', { instanceType, minCapacity });
                    }
                    else if (capacityType === DefaultCapacityType.NODEGROUP) {
                        this.defaultNodegroup = this.addNodegroupCapacity('DefaultCapacity', { instanceTypes: [instanceType], minSize: minCapacity });
                    }
                    // For AUTOMODE, we don't create any explicit capacity as it's managed by EKS
                }
            }
            // ensure FARGATE still applies here
            if (props.coreDnsComputeType === CoreDnsComputeType.FARGATE) {
                this.defineCoreDnsComputeType(CoreDnsComputeType.FARGATE);
            }
            const outputConfigCommand = (props.outputConfigCommand ?? true) && props.mastersRole;
            if (outputConfigCommand) {
                const postfix = commonCommandOptions.join(' ');
                new core_1.CfnOutput(this, 'ConfigCommand', { value: `${updateConfigCommandPrefix} ${postfix}` });
                new core_1.CfnOutput(this, 'GetTokenCommand', { value: `${getTokenCommandPrefix} ${postfix}` });
            }
        }
        /**
         * Grants the specified IAM principal access to the EKS cluster based on the provided access policies.
         *
         * This method creates an `AccessEntry` construct that grants the specified IAM principal the access permissions
         * defined by the provided `IAccessPolicy` array. This allows the IAM principal to perform the actions permitted
         * by the access policies within the EKS cluster.
         * [disable-awslint:no-grants]
         *
         * @param id - The ID of the `AccessEntry` construct to be created.
         * @param principal - The IAM principal (role or user) to be granted access to the EKS cluster.
         * @param accessPolicies - An array of `IAccessPolicy` objects that define the access permissions to be granted to the IAM principal.
         */
        grantAccess(id, principal, accessPolicies) {
            this.addToAccessEntry(id, principal, accessPolicies);
        }
        /**
         * Grants the specified IAM principal cluster admin access to the EKS cluster.
         *
         * This method creates an `AccessEntry` construct that grants the specified IAM principal the cluster admin
         * access permissions. This allows the IAM principal to perform the actions permitted
         * by the cluster admin acces.
         * [disable-awslint:no-grants]
         *
         * @param id - The ID of the `AccessEntry` construct to be created.
         * @param principal - The IAM principal (role or user) to be granted access to the EKS cluster.
         * @returns the access entry construct
         */
        grantClusterAdmin(id, principal) {
            const newEntry = new access_entry_1.AccessEntry(this, id, {
                principal,
                cluster: this,
                accessPolicies: [
                    access_entry_1.AccessPolicy.fromAccessPolicyName('AmazonEKSClusterAdminPolicy', {
                        accessScopeType: access_entry_1.AccessScopeType.CLUSTER,
                    }),
                ],
            });
            this.accessEntries.set(principal, newEntry);
            return newEntry;
        }
        /**
         * Fetch the load balancer address of a service of type 'LoadBalancer'.
         *
         * @param serviceName The name of the service.
         * @param options Additional operation options.
         */
        getServiceLoadBalancerAddress(serviceName, options = {}) {
            try {
                jsiiDeprecationWarnings._aws_cdk_aws_eks_v2_alpha_ServiceLoadBalancerAddressOptions(options);
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
                jsiiDeprecationWarnings._aws_cdk_aws_eks_v2_alpha_IngressLoadBalancerAddressOptions(options);
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
         */
        addAutoScalingGroupCapacity(id, options) {
            try {
                jsiiDeprecationWarnings._aws_cdk_aws_eks_v2_alpha_AutoScalingGroupCapacityOptions(options);
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
                bootstrapOptions: options.bootstrapOptions,
                bootstrapEnabled: options.bootstrapEnabled,
                machineImageType: options.machineImageType,
            });
            if (nodeTypeForInstanceType(options.instanceType) === NodeType.INFERENTIA ||
                nodeTypeForInstanceType(options.instanceType) === NodeType.TRAINIUM) {
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
                jsiiDeprecationWarnings._aws_cdk_aws_eks_v2_alpha_NodegroupOptions(options);
            }
            catch (error) {
                if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                    Error.captureStackTrace(error, this.addNodegroupCapacity);
                }
                throw error;
            }
            const hasInferentiaOrTrainiumInstanceType = [
                options?.instanceType,
                ...options?.instanceTypes ?? [],
            ].some(i => i && (nodeTypeForInstanceType(i) === NodeType.INFERENTIA ||
                nodeTypeForInstanceType(i) === NodeType.TRAINIUM));
            if (hasInferentiaOrTrainiumInstanceType) {
                this.addNeuronDevicePlugin();
            }
            return new managed_nodegroup_1.Nodegroup(this, `Nodegroup${id}`, {
                cluster: this,
                ...options,
            });
        }
        /**
         * If this cluster is kubectl-enabled, returns the OpenID Connect issuer url.
         * If this cluster is not kubectl-enabled (i.e. uses the
         * stock `CfnCluster`), this is `undefined`.
         * @attribute
         */
        get clusterOpenIdConnectIssuerUrl() {
            return this._clusterResource.attrOpenIdConnectIssuerUrl;
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
        get kubectlProvider() {
            return this._kubectlProvider;
        }
        /**
         * Retrieves the EKS Pod Identity Agent addon for the EKS cluster.
         *
         * The EKS Pod Identity Agent is responsible for managing the temporary credentials
         * used by pods in the cluster to access AWS resources. It runs as a DaemonSet on
         * each node and provides the necessary credentials to the pods based on their
         * associated service account.
         *
         */
        get eksPodIdentityAgent() {
            if (!this._eksPodIdentityAgent) {
                this._eksPodIdentityAgent = new addon_1.Addon(this, 'EksPodIdentityAgentAddon', {
                    cluster: this,
                    addonName: 'eks-pod-identity-agent',
                });
            }
            return this._eksPodIdentityAgent;
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
                jsiiDeprecationWarnings._aws_cdk_aws_eks_v2_alpha_FargateProfileOptions(options);
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
         * validate all autoMode relevant configurations to ensure they are correct and throw
         * errors if they are not.
         *
         * @param props ClusterProps
         *
         */
        isValidAutoModeConfig(props) {
            const autoModeEnabled = props.defaultCapacityType === undefined || props.defaultCapacityType == DefaultCapacityType.AUTOMODE;
            // if using AUTOMODE
            if (autoModeEnabled) {
                // When using AUTOMODE, nodePools values are case-sensitive and must be general-purpose and/or system
                if (props.compute?.nodePools) {
                    const validNodePools = ['general-purpose', 'system'];
                    const invalidPools = props.compute.nodePools.filter(pool => !validNodePools.includes(pool));
                    if (invalidPools.length > 0) {
                        throw new Error(`Invalid node pool values: ${invalidPools.join(', ')}. Valid values are: ${validNodePools.join(', ')}`);
                    }
                }
                // When using AUTOMODE, defaultCapacity and defaultCapacityInstance cannot be specified
                if (props.defaultCapacity !== undefined || props.defaultCapacityInstance !== undefined) {
                    throw new Error('Cannot specify defaultCapacity or defaultCapacityInstance when using Auto Mode. Auto Mode manages compute resources automatically.');
                }
            }
            else {
                // if NOT using AUTOMODE
                if (props.compute) {
                    // When not using AUTOMODE, compute must be undefined
                    throw new Error('Cannot specify compute without using DefaultCapacityType.AUTOMODE');
                }
            }
            return autoModeEnabled;
        }
        addNodePoolRole(id) {
            const role = new iam.Role(this, id, {
                assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
                // to be able to access the AWSLoadBalancerController
                managedPolicies: [
                    // see https://docs.aws.amazon.com/eks/latest/userguide/automode-get-started-cli.html#auto-mode-create-roles
                    iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSWorkerNodePolicy'),
                    iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryReadOnly'),
                ],
            });
            return role;
        }
        /**
         * Adds an access entry to the cluster's access entries map.
         *
         * If an entry already exists for the given principal, it adds the provided access policies to the existing entry.
         * If no entry exists for the given principal, it creates a new access entry with the provided access policies.
         *
         * @param principal - The principal (e.g., IAM user or role) for which the access entry is being added.
         * @param policies - An array of access policies to be associated with the principal.
         *
         * @throws {Error} If the uniqueName generated for the new access entry is not unique.
         *
         * @returns {void}
         */
        addToAccessEntry(id, principal, policies) {
            const entry = this.accessEntries.get(principal);
            if (entry) {
                entry.addAccessPolicies(policies);
            }
            else {
                const newEntry = new access_entry_1.AccessEntry(this, id, {
                    principal,
                    cluster: this,
                    accessPolicies: policies,
                });
                this.accessEntries.set(principal, newEntry);
            }
        }
        /**
         * Adds a resource scope that requires `kubectl` to this cluster and returns
         *
         * @internal
         */
        _dependOnKubectlBarrier(resource) {
            resource.node.addDependency(this._kubectlReadyBarrier);
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
                const fileContents = fs.readFileSync(path.join(__dirname, 'addons', 'neuron-device-plugin.yaml'), 'utf8');
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
                        core_1.Annotations.of(this).addWarningV2('@aws-cdk/aws-eks:clusterMustManuallyTagSubnet', `Could not auto-tag ${type} subnet${subnetID} with "${tag}=1", please remember to do this manually`);
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
            const k8sPatch = new k8s_patch_1.KubernetesPatch(this, 'CoreDnsComputeTypePatch', {
                cluster: this,
                resourceName: 'deployment/coredns',
                resourceNamespace: 'kube-system',
                applyPatch: renderPatch(CoreDnsComputeType.FARGATE),
                restorePatch: renderPatch(CoreDnsComputeType.EC2),
            });
            // In Patch deletion, it needs to apply the restore patch to the cluster
            // So the cluster admin access can only be deleted after the patch
            if (this._clusterAdminAccess) {
                k8sPatch.node.addDependency(this._clusterAdminAccess);
            }
        }
        static {
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return Cluster = _classThis;
})();
exports.Cluster = Cluster;
/**
 * Import a cluster to use in another stack
 */
let ImportedCluster = (() => {
    let _classDecorators = [prop_injectable_1.propertyInjectable];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = ClusterBase;
    var ImportedCluster = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ImportedCluster = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        props;
        /** Uniquely identifies this class. */
        static PROPERTY_INJECTION_ID = '@aws-cdk.aws-eks-v2-alpha.ImportedCluster';
        clusterName;
        clusterArn;
        connections = new ec2.Connections();
        ipFamily;
        prune;
        kubectlProvider;
        // so that `clusterSecurityGroup` on `ICluster` can be configured without optionality, avoiding users from having
        // to null check on an instance of `Cluster`, which will always have this configured.
        _clusterSecurityGroup;
        constructor(scope, id, props) {
            super(scope, id);
            this.props = props;
            // Enhanced CDK Analytics Telemetry
            (0, metadata_resource_1.addConstructMetadata)(this, props);
            this.clusterName = props.clusterName;
            this.clusterArn = this.stack.formatArn(clusterArnComponents(props.clusterName));
            this.ipFamily = props.ipFamily;
            this.kubectlProvider = props.kubectlProvider;
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
        static {
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return ImportedCluster = _classThis;
})();
/**
 * Construct an Amazon Linux 2 image from the latest EKS Optimized AMI published in SSM
 */
class EksOptimizedImage {
    static [JSII_RTTI_SYMBOL_1] = { fqn: "@aws-cdk/aws-eks-v2-alpha.EksOptimizedImage", version: "0.0.0" };
    nodeType;
    cpuArch;
    kubernetesVersion;
    amiParameterName;
    /**
     * Constructs a new instance of the EcsOptimizedAmi class.
     */
    constructor(props = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_eks_v2_alpha_EksOptimizedImageProps(props);
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
            + (this.nodeType === NodeType.TRAINIUM ? 'amazon-linux-2-gpu/' : '')
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
    /**
     * Trainium instances
     */
    NodeType["TRAINIUM"] = "TRAINIUM";
})(NodeType || (exports.NodeType = NodeType = {}));
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
})(CpuArch || (exports.CpuArch = CpuArch = {}));
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
})(CoreDnsComputeType || (exports.CoreDnsComputeType = CoreDnsComputeType = {}));
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
    /**
     * Auto Mode
     */
    DefaultCapacityType[DefaultCapacityType["AUTOMODE"] = 2] = "AUTOMODE";
})(DefaultCapacityType || (exports.DefaultCapacityType = DefaultCapacityType = {}));
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
})(MachineImageType || (exports.MachineImageType = MachineImageType = {}));
function nodeTypeForInstanceType(instanceType) {
    if (instance_types_1.INSTANCE_TYPES.gpu.includes(instanceType.toString().substring(0, 2))) {
        return NodeType.GPU;
    }
    else if (instance_types_1.INSTANCE_TYPES.inferentia.includes(instanceType.toString().substring(0, 4))) {
        return NodeType.INFERENTIA;
    }
    else if (instance_types_1.INSTANCE_TYPES.trainium.includes(instanceType.toString().substring(0, 4))) {
        return NodeType.TRAINIUM;
    }
    return NodeType.STANDARD;
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
function clusterArnComponents(clusterName) {
    return {
        service: 'eks',
        resource: 'cluster',
        resourceName: clusterName,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2x1c3Rlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsdXN0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3QiwyREFBMkQ7QUFDM0QsMkNBQTJDO0FBQzNDLGlEQUFpRDtBQUNqRCwyQ0FBMkM7QUFFM0MsMkNBQTJDO0FBQzNDLDJDQUF5STtBQUN6SSw4RUFBOEY7QUFDOUYsMEVBQTBFO0FBQzFFLDJDQUE2QztBQUM3Qyw2QkFBNkI7QUFDN0IsaURBQXlHO0FBQ3pHLG1DQUF3QztBQUN4QyxxREFBdUU7QUFDdkUsdURBQTBFO0FBQzFFLDZDQUEyRDtBQUMzRCxxREFBa0Q7QUFDbEQsaURBQStFO0FBQy9FLHlEQUEyRDtBQUMzRCwyQ0FBOEM7QUFDOUMseURBQStGO0FBQy9GLDJEQUFrRTtBQUNsRSxtREFBd0Q7QUFDeEQseURBQTJEO0FBQzNELHVEQUEwRTtBQUMxRSwyQ0FBb0Y7QUFFcEYsMENBQTBDO0FBQzFDLE1BQU0sc0JBQXNCLEdBQUcsQ0FBQyxDQUFDO0FBQ2pDLE1BQU0scUJBQXFCLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQWlhaEc7O0dBRUc7QUFDSCxNQUFhLGNBQWM7SUF1Q1A7O0lBdENsQjs7Ozs7Ozs7OztPQVVHO0lBQ0ksTUFBTSxDQUFVLE1BQU0sR0FBRyxJQUFJLGNBQWMsQ0FBQyxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFFakc7OztPQUdHO0lBQ0ksTUFBTSxDQUFVLE9BQU8sR0FBRyxJQUFJLGNBQWMsQ0FBQyxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxD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Q0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDMUYsT0FBTyxDQUFDLE1BQU0sQ0FBQztBQUN2QixDQUFDO0FBRUQsU0FBUyxPQUFPLENBQUksR0FBVTtJQUM1QixPQUFPLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNqRCxDQUFDO0FBRUQsU0FBUyxvQkFBb0IsQ0FBQyxXQUFtQjtJQUMvQyxPQUFPO1FBQ0wsT0FBTyxFQUFFLEtBQUs7UUFDZCxRQUFRLEVBQUUsU0FBUztRQUNuQixZQUFZLEVBQUUsV0FBVztLQUMxQixDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBhdXRvc2NhbGluZyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYXV0b3NjYWxpbmcnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0IHsgQ2ZuQ2x1c3RlciB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1la3MnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMga21zIGZyb20gJ2F3cy1jZGstbGliL2F3cy1rbXMnO1xuaW1wb3J0ICogYXMgc3NtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zc20nO1xuaW1wb3J0IHsgQW5ub3RhdGlvbnMsIENmbk91dHB1dCwgQ2ZuUmVzb3VyY2UsIElSZXNvdXJjZSwgUmVzb3VyY2UsIFRhZ3MsIFRva2VuLCBEdXJhdGlvbiwgQXJuQ29tcG9uZW50cywgU3RhY2sgfSBmcm9tICdhd3MtY2RrLWxpYi9jb3JlJztcbmltcG9ydCB7IE1ldGhvZE1ldGFkYXRhLCBhZGRDb25zdHJ1Y3RNZXRhZGF0YSB9IGZyb20gJ2F3cy1jZGstbGliL2NvcmUvbGliL21ldGFkYXRhLXJlc291cmNlJztcbmltcG9ydCB7IHByb3BlcnR5SW5qZWN0YWJsZSB9IGZyb20gJ2F3cy1jZGstbGliL2NvcmUvbGliL3Byb3AtaW5qZWN0YWJsZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QsIE5vZGUgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIFlBTUwgZnJvbSAneWFtbCc7XG5pbXBvcnQgeyBJQWNjZXNzUG9saWN5LCBJQWNjZXNzRW50cnksIEFjY2Vzc0VudHJ5LCBBY2Nlc3NQb2xpY3ksIEFjY2Vzc1Njb3BlVHlwZSB9IGZyb20gJy4vYWNjZXNzLWVudHJ5JztcbmltcG9ydCB7IElBZGRvbiwgQWRkb24gfSBmcm9tICcuL2FkZG9uJztcbmltcG9ydCB7IEFsYkNvbnRyb2xsZXIsIEFsYkNvbnRyb2xsZXJPcHRpb25zIH0gZnJvbSAnLi9hbGItY29udHJvbGxlcic7XG5pbXBvcnQgeyBGYXJnYXRlUHJvZmlsZSwgRmFyZ2F0ZVByb2ZpbGVPcHRpb25zIH0gZnJvbSAnLi9mYXJnYXRlLXByb2ZpbGUnO1xuaW1wb3J0IHsgSGVsbUNoYXJ0LCBIZWxtQ2hhcnRPcHRpb25zIH0gZnJvbSAnLi9oZWxtLWNoYXJ0JztcbmltcG9ydCB7IElOU1RBTkNFX1RZUEVTIH0gZnJvbSAnLi9pbnN0YW5jZS10eXBlcyc7XG5pbXBvcnQgeyBLdWJlcm5ldGVzTWFuaWZlc3QsIEt1YmVybmV0ZXNNYW5pZmVzdE9wdGlvbnMgfSBmcm9tICcuL2s4cy1tYW5pZmVzdCc7XG5pbXBvcnQgeyBLdWJlcm5ldGVzT2JqZWN0VmFsdWUgfSBmcm9tICcuL2s4cy1vYmplY3QtdmFsdWUnO1xuaW1wb3J0IHsgS3ViZXJuZXRlc1BhdGNoIH0gZnJvbSAnLi9rOHMtcGF0Y2gnO1xuaW1wb3J0IHsgSUt1YmVjdGxQcm92aWRlciwgS3ViZWN0bFByb3ZpZGVyLCBLdWJlY3RsUHJvdmlkZXJPcHRpb25zIH0gZnJvbSAnLi9rdWJlY3RsLXByb3ZpZGVyJztcbmltcG9ydCB7IE5vZGVncm91cCwgTm9kZWdyb3VwT3B0aW9ucyB9IGZyb20gJy4vbWFuYWdlZC1ub2RlZ3JvdXAnO1xuaW1wb3J0IHsgT3BlbklkQ29ubmVjdFByb3ZpZGVyIH0gZnJvbSAnLi9vaWRjLXByb3ZpZGVyJztcbmltcG9ydCB7IEJvdHRsZVJvY2tldEltYWdlIH0gZnJvbSAnLi9wcml2YXRlL2JvdHRsZXJvY2tldCc7XG5pbXBvcnQgeyBTZXJ2aWNlQWNjb3VudCwgU2VydmljZUFjY291bnRPcHRpb25zIH0gZnJvbSAnLi9zZXJ2aWNlLWFjY291bnQnO1xuaW1wb3J0IHsgcmVuZGVyQW1hem9uTGludXhVc2VyRGF0YSwgcmVuZGVyQm90dGxlcm9ja2V0VXNlckRhdGEgfSBmcm9tICcuL3VzZXItZGF0YSc7XG5cbi8vIGRlZmF1bHRzIGFyZSBiYXNlZCBvbiBodHRwczovL2Vrc2N0bC5pb1xuY29uc3QgREVGQVVMVF9DQVBBQ0lUWV9DT1VOVCA9IDI7XG5jb25zdCBERUZBVUxUX0NBUEFDSVRZX1RZUEUgPSBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLk01LCBlYzIuSW5zdGFuY2VTaXplLkxBUkdFKTtcblxuLyoqXG4gKiBBbiBFS1MgY2x1c3RlclxuICovXG5leHBvcnQgaW50ZXJmYWNlIElDbHVzdGVyIGV4dGVuZHMgSVJlc291cmNlLCBlYzIuSUNvbm5lY3RhYmxlIHtcbiAgLyoqXG4gICAqIFRoZSBWUEMgaW4gd2hpY2ggdGhpcyBDbHVzdGVyIHdhcyBjcmVhdGVkXG4gICAqL1xuICByZWFkb25seSB2cGM6IGVjMi5JVnBjO1xuXG4gIC8qKlxuICAgKiBUaGUgcGh5c2ljYWwgbmFtZSBvZiB0aGUgQ2x1c3RlclxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBjbHVzdGVyTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgdW5pcXVlIEFSTiBhc3NpZ25lZCB0byB0aGUgc2VydmljZSBieSBBV1NcbiAgICogaW4gdGhlIGZvcm0gb2YgYXJuOmF3czpla3M6XG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGNsdXN0ZXJBcm46IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEFQSSBTZXJ2ZXIgZW5kcG9pbnQgVVJMXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGNsdXN0ZXJFbmRwb2ludDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgY2VydGlmaWNhdGUtYXV0aG9yaXR5LWRhdGEgZm9yIHlvdXIgY2x1c3Rlci5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgY2x1c3RlckNlcnRpZmljYXRlQXV0aG9yaXR5RGF0YTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgaWQgb2YgdGhlIGNsdXN0ZXIgc2VjdXJpdHkgZ3JvdXAgdGhhdCB3YXMgY3JlYXRlZCBieSBBbWF6b24gRUtTIGZvciB0aGUgY2x1c3Rlci5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgY2x1c3RlclNlY3VyaXR5R3JvdXBJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgY2x1c3RlciBzZWN1cml0eSBncm91cCB0aGF0IHdhcyBjcmVhdGVkIGJ5IEFtYXpvbiBFS1MgZm9yIHRoZSBjbHVzdGVyLlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBjbHVzdGVyU2VjdXJpdHlHcm91cDogZWMyLklTZWN1cml0eUdyb3VwO1xuXG4gIC8qKlxuICAgKiBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKSBvciBhbGlhcyBvZiB0aGUgY3VzdG9tZXIgbWFzdGVyIGtleSAoQ01LKS5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgY2x1c3RlckVuY3J5cHRpb25Db25maWdLZXlBcm46IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIE9wZW4gSUQgQ29ubmVjdCBQcm92aWRlciBvZiB0aGUgY2x1c3RlciB1c2VkIHRvIGNvbmZpZ3VyZSBTZXJ2aWNlIEFjY291bnRzLlxuICAgKi9cbiAgcmVhZG9ubHkgb3BlbklkQ29ubmVjdFByb3ZpZGVyOiBpYW0uSU9wZW5JZENvbm5lY3RQcm92aWRlcjtcblxuICAvKipcbiAgICogVGhlIEVLUyBQb2QgSWRlbnRpdHkgQWdlbnQgYWRkb24gZm9yIHRoZSBFS1MgY2x1c3Rlci5cbiAgICpcbiAgICogVGhlIEVLUyBQb2QgSWRlbnRpdHkgQWdlbnQgaXMgcmVzcG9uc2libGUgZm9yIG1hbmFnaW5nIHRoZSB0ZW1wb3JhcnkgY3JlZGVudGlhbHNcbiAgICogdXNlZCBieSBwb2RzIGluIHRoZSBjbHVzdGVyIHRvIGFjY2VzcyBBV1MgcmVzb3VyY2VzLiBJdCBydW5zIGFzIGEgRGFlbW9uU2V0IG9uXG4gICAqIGVhY2ggbm9kZSBhbmQgcHJvdmlkZXMgdGhlIG5lY2Vzc2FyeSBjcmVkZW50aWFscyB0byB0aGUgcG9kcyBiYXNlZCBvbiB0aGVpclxuICAgKiBhc3NvY2lhdGVkIHNlcnZpY2UgYWNjb3VudC5cbiAgICpcbiAgICogVGhpcyBwcm9wZXJ0eSByZXR1cm5zIHRoZSBgQ2ZuQWRkb25gIHJlc291cmNlIHJlcHJlc2VudGluZyB0aGUgRUtTIFBvZCBJZGVudGl0eVxuICAgKiBBZ2VudCBhZGRvbi4gSWYgdGhlIGFkZG9uIGhhcyBub3QgYmVlbiBjcmVhdGVkIHlldCwgaXQgd2lsbCBiZSBjcmVhdGVkIGFuZFxuICAgKiByZXR1cm5lZC5cbiAgICovXG4gIHJlYWRvbmx5IGVrc1BvZElkZW50aXR5QWdlbnQ/OiBJQWRkb247XG5cbiAgLyoqXG4gICAqIFNwZWNpZnkgd2hpY2ggSVAgZmFtaWx5IGlzIHVzZWQgdG8gYXNzaWduIEt1YmVybmV0ZXMgcG9kIGFuZCBzZXJ2aWNlIElQIGFkZHJlc3Nlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBJcEZhbWlseS5JUF9WNFxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9la3MvbGF0ZXN0L0FQSVJlZmVyZW5jZS9BUElfS3ViZXJuZXRlc05ldHdvcmtDb25maWdSZXF1ZXN0Lmh0bWwjQW1hem9uRUtTLVR5cGUtS3ViZXJuZXRlc05ldHdvcmtDb25maWdSZXF1ZXN0LWlwRmFtaWx5XG4gICAqL1xuICByZWFkb25seSBpcEZhbWlseT86IElwRmFtaWx5O1xuXG4gIC8qKlxuICAgKiBPcHRpb25zIGZvciBjcmVhdGluZyB0aGUga3ViZWN0bCBwcm92aWRlciAtIGEgbGFtYmRhIGZ1bmN0aW9uIHRoYXQgZXhlY3V0ZXMgYGt1YmVjdGxgIGFuZCBgaGVsbWBcbiAgICogYWdhaW5zdCB0aGUgY2x1c3Rlci4gSWYgZGVmaW5lZCwgYGt1YmVjdGxMYXllcmAgaXMgYSByZXF1aXJlZCBwcm9wZXJ0eS5cbiAgICpcbiAgICogSWYgbm90IGRlZmluZWQsIGt1YmVjdGwgcHJvdmlkZXIgd2lsbCBub3QgYmUgY3JlYXRlZCBieSBkZWZhdWx0LlxuICAgKi9cbiAgcmVhZG9ubHkga3ViZWN0bFByb3ZpZGVyT3B0aW9ucz86IEt1YmVjdGxQcm92aWRlck9wdGlvbnM7XG5cbiAgLyoqXG4gICAqIEt1YmVjdGwgUHJvdmlkZXIgZm9yIGlzc3Vpbmcga3ViZWN0bCBjb21tYW5kcyBhZ2FpbnN0IGl0XG4gICAqXG4gICAqIElmIG5vdCBkZWZpbmVkLCBhIGRlZmF1bHQgcHJvdmlkZXIgd2lsbCBiZSB1c2VkXG4gICAqL1xuICByZWFkb25seSBrdWJlY3RsUHJvdmlkZXI/OiBJS3ViZWN0bFByb3ZpZGVyO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgd2hldGhlciBLdWJlcm5ldGVzIHJlc291cmNlcyBjYW4gYmUgYXV0b21hdGljYWxseSBwcnVuZWQuIFdoZW5cbiAgICogdGhpcyBpcyBlbmFibGVkIChkZWZhdWx0KSwgcHJ1bmUgbGFiZWxzIHdpbGwgYmUgYWxsb2NhdGVkIGFuZCBpbmplY3RlZCB0b1xuICAgKiBlYWNoIHJlc291cmNlLiBUaGVzZSBsYWJlbHMgd2lsbCB0aGVuIGJlIHVzZWQgd2hlbiBpc3N1aW5nIHRoZSBga3ViZWN0bFxuICAgKiBhcHBseWAgb3BlcmF0aW9uIHdpdGggdGhlIGAtLXBydW5lYCBzd2l0Y2guXG4gICAqL1xuICByZWFkb25seSBwcnVuZTogYm9vbGVhbjtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBzZXJ2aWNlIGFjY291bnQgd2l0aCBjb3JyZXNwb25kaW5nIElBTSBSb2xlIChJUlNBKS5cbiAgICpcbiAgICogQHBhcmFtIGlkIGxvZ2ljYWwgaWQgb2Ygc2VydmljZSBhY2NvdW50XG4gICAqIEBwYXJhbSBvcHRpb25zIHNlcnZpY2UgYWNjb3VudCBvcHRpb25zXG4gICAqL1xuICBhZGRTZXJ2aWNlQWNjb3VudChpZDogc3RyaW5nLCBvcHRpb25zPzogU2VydmljZUFjY291bnRPcHRpb25zKTogU2VydmljZUFjY291bnQ7XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYSBLdWJlcm5ldGVzIHJlc291cmNlIGluIHRoaXMgY2x1c3Rlci5cbiAgICpcbiAgICogVGhlIG1hbmlmZXN0IHdpbGwgYmUgYXBwbGllZC9kZWxldGVkIHVzaW5nIGt1YmVjdGwgYXMgbmVlZGVkLlxuICAgKlxuICAgKiBAcGFyYW0gaWQgbG9naWNhbCBpZCBvZiB0aGlzIG1hbmlmZXN0XG4gICAqIEBwYXJhbSBtYW5pZmVzdCBhIGxpc3Qgb2YgS3ViZXJuZXRlcyByZXNvdXJjZSBzcGVjaWZpY2F0aW9uc1xuICAgKiBAcmV0dXJucyBhIGBLdWJlcm5ldGVzTWFuaWZlc3RgIG9iamVjdC5cbiAgICovXG4gIGFkZE1hbmlmZXN0KGlkOiBzdHJpbmcsIC4uLm1hbmlmZXN0OiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10pOiBLdWJlcm5ldGVzTWFuaWZlc3Q7XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYSBIZWxtIGNoYXJ0IGluIHRoaXMgY2x1c3Rlci5cbiAgICpcbiAgICogQHBhcmFtIGlkIGxvZ2ljYWwgaWQgb2YgdGhpcyBjaGFydC5cbiAgICogQHBhcmFtIG9wdGlvbnMgb3B0aW9ucyBvZiB0aGlzIGNoYXJ0LlxuICAgKiBAcmV0dXJucyBhIGBIZWxtQ2hhcnRgIGNvbnN0cnVjdFxuICAgKi9cbiAgYWRkSGVsbUNoYXJ0KGlkOiBzdHJpbmcsIG9wdGlvbnM6IEhlbG1DaGFydE9wdGlvbnMpOiBIZWxtQ2hhcnQ7XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYSBDREs4cyBjaGFydCBpbiB0aGlzIGNsdXN0ZXIuXG4gICAqXG4gICAqIEBwYXJhbSBpZCBsb2dpY2FsIGlkIG9mIHRoaXMgY2hhcnQuXG4gICAqIEBwYXJhbSBjaGFydCB0aGUgY2RrOHMgY2hhcnQuXG4gICAqIEByZXR1cm5zIGEgYEt1YmVybmV0ZXNNYW5pZmVzdGAgY29uc3RydWN0IHJlcHJlc2VudGluZyB0aGUgY2hhcnQuXG4gICAqL1xuICBhZGRDZGs4c0NoYXJ0KGlkOiBzdHJpbmcsIGNoYXJ0OiBDb25zdHJ1Y3QsIG9wdGlvbnM/OiBLdWJlcm5ldGVzTWFuaWZlc3RPcHRpb25zKTogS3ViZXJuZXRlc01hbmlmZXN0O1xuXG4gIC8qKlxuICAgKiBDb25uZWN0IGNhcGFjaXR5IGluIHRoZSBmb3JtIG9mIGFuIGV4aXN0aW5nIEF1dG9TY2FsaW5nR3JvdXAgdG8gdGhlIEVLUyBjbHVzdGVyLlxuICAgKlxuICAgKiBUaGUgQXV0b1NjYWxpbmdHcm91cCBtdXN0IGJlIHJ1bm5pbmcgYW4gRUtTLW9wdGltaXplZCBBTUkgY29udGFpbmluZyB0aGVcbiAgICogL2V0Yy9la3MvYm9vdHN0cmFwLnNoIHNjcmlwdC4gVGhpcyBtZXRob2Qgd2lsbCBjb25maWd1cmUgU2VjdXJpdHkgR3JvdXBzLFxuICAgKiBhZGQgdGhlIHJpZ2h0IHBvbGljaWVzIHRvIHRoZSBpbnN0YW5jZSByb2xlLCBhcHBseSB0aGUgcmlnaHQgdGFncywgYW5kIGFkZFxuICAgKiB0aGUgcmVxdWlyZWQgdXNlciBkYXRhIHRvIHRoZSBpbnN0YW5jZSdzIGxhdW5jaCBjb25maWd1cmF0aW9uLlxuICAgKlxuICAgKiBQcmVmZXIgdG8gdXNlIGBhZGRBdXRvU2NhbGluZ0dyb3VwQ2FwYWNpdHlgIGlmIHBvc3NpYmxlLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9la3MvbGF0ZXN0L3VzZXJndWlkZS9sYXVuY2gtd29ya2Vycy5odG1sXG4gICAqIEBwYXJhbSBhdXRvU2NhbGluZ0dyb3VwIFtkaXNhYmxlLWF3c2xpbnQ6cmVmLXZpYS1pbnRlcmZhY2VdXG4gICAqIEBwYXJhbSBvcHRpb25zIG9wdGlvbnMgZm9yIGFkZGluZyBhdXRvIHNjYWxpbmcgZ3JvdXBzLCBsaWtlIGN1c3RvbWl6aW5nIHRoZSBib290c3RyYXAgc2NyaXB0XG4gICAqL1xuICBjb25uZWN0QXV0b1NjYWxpbmdHcm91cENhcGFjaXR5KGF1dG9TY2FsaW5nR3JvdXA6IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAsIG9wdGlvbnM6IEF1dG9TY2FsaW5nR3JvdXBPcHRpb25zKTogdm9pZDtcbn1cblxuLyoqXG4gKiBBdHRyaWJ1dGVzIGZvciBFS1MgY2x1c3RlcnMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2x1c3RlckF0dHJpYnV0ZXMge1xuICAvKipcbiAgICogVGhlIFZQQyBpbiB3aGljaCB0aGlzIENsdXN0ZXIgd2FzIGNyZWF0ZWRcbiAgICogQGRlZmF1bHQgLSBpZiBub3Qgc3BlY2lmaWVkIGBjbHVzdGVyLnZwY2Agd2lsbCB0aHJvdyBhbiBlcnJvclxuICAgKi9cbiAgcmVhZG9ubHkgdnBjPzogZWMyLklWcGM7XG5cbiAgLyoqXG4gICAqIFRoZSBwaHlzaWNhbCBuYW1lIG9mIHRoZSBDbHVzdGVyXG4gICAqL1xuICByZWFkb25seSBjbHVzdGVyTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQVBJIFNlcnZlciBlbmRwb2ludCBVUkxcbiAgICogQGRlZmF1bHQgLSBpZiBub3Qgc3BlY2lmaWVkIGBjbHVzdGVyLmNsdXN0ZXJFbmRwb2ludGAgd2lsbCB0aHJvdyBhbiBlcnJvci5cbiAgICovXG4gIHJlYWRvbmx5IGNsdXN0ZXJFbmRwb2ludD86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGNlcnRpZmljYXRlLWF1dGhvcml0eS1kYXRhIGZvciB5b3VyIGNsdXN0ZXIuXG4gICAqIEBkZWZhdWx0IC0gaWYgbm90IHNwZWNpZmllZCBgY2x1c3Rlci5jbHVzdGVyQ2VydGlmaWNhdGVBdXRob3JpdHlEYXRhYCB3aWxsXG4gICAqIHRocm93IGFuIGVycm9yXG4gICAqL1xuICByZWFkb25seSBjbHVzdGVyQ2VydGlmaWNhdGVBdXRob3JpdHlEYXRhPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgY2x1c3RlciBzZWN1cml0eSBncm91cCB0aGF0IHdhcyBjcmVhdGVkIGJ5IEFtYXpvbiBFS1MgZm9yIHRoZSBjbHVzdGVyLlxuICAgKiBAZGVmYXVsdCAtIGlmIG5vdCBzcGVjaWZpZWQgYGNsdXN0ZXIuY2x1c3RlclNlY3VyaXR5R3JvdXBJZGAgd2lsbCB0aHJvdyBhblxuICAgKiBlcnJvclxuICAgKi9cbiAgcmVhZG9ubHkgY2x1c3RlclNlY3VyaXR5R3JvdXBJZD86IHN0cmluZztcblxuICAvKipcbiAgICogQW1hem9uIFJlc291cmNlIE5hbWUgKEFSTikgb3IgYWxpYXMgb2YgdGhlIGN1c3RvbWVyIG1hc3RlciBrZXkgKENNSykuXG4gICAqIEBkZWZhdWx0IC0gaWYgbm90IHNwZWNpZmllZCBgY2x1c3Rlci5jbHVzdGVyRW5jcnlwdGlvbkNvbmZpZ0tleUFybmAgd2lsbFxuICAgKiB0aHJvdyBhbiBlcnJvclxuICAgKi9cbiAgcmVhZG9ubHkgY2x1c3RlckVuY3J5cHRpb25Db25maWdLZXlBcm4/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFNwZWNpZnkgd2hpY2ggSVAgZmFtaWx5IGlzIHVzZWQgdG8gYXNzaWduIEt1YmVybmV0ZXMgcG9kIGFuZCBzZXJ2aWNlIElQIGFkZHJlc3Nlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBJcEZhbWlseS5JUF9WNFxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9la3MvbGF0ZXN0L0FQSVJlZmVyZW5jZS9BUElfS3ViZXJuZXRlc05ldHdvcmtDb25maWdSZXF1ZXN0Lmh0bWwjQW1hem9uRUtTLVR5cGUtS3ViZXJuZXRlc05ldHdvcmtDb25maWdSZXF1ZXN0LWlwRmFtaWx5XG4gICAqL1xuICByZWFkb25seSBpcEZhbWlseT86IElwRmFtaWx5O1xuXG4gIC8qKlxuICAgKiBBZGRpdGlvbmFsIHNlY3VyaXR5IGdyb3VwcyBhc3NvY2lhdGVkIHdpdGggdGhpcyBjbHVzdGVyLlxuICAgKiBAZGVmYXVsdCAtIGlmIG5vdCBzcGVjaWZpZWQsIG5vIGFkZGl0aW9uYWwgc2VjdXJpdHkgZ3JvdXBzIHdpbGwgYmVcbiAgICogY29uc2lkZXJlZCBpbiBgY2x1c3Rlci5jb25uZWN0aW9uc2AuXG4gICAqL1xuICByZWFkb25seSBzZWN1cml0eUdyb3VwSWRzPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIEFuIE9wZW4gSUQgQ29ubmVjdCBwcm92aWRlciBmb3IgdGhpcyBjbHVzdGVyIHRoYXQgY2FuIGJlIHVzZWQgdG8gY29uZmlndXJlIHNlcnZpY2UgYWNjb3VudHMuXG4gICAqIFlvdSBjYW4gZWl0aGVyIGltcG9ydCBhbiBleGlzdGluZyBwcm92aWRlciB1c2luZyBgaWFtLk9wZW5JZENvbm5lY3RQcm92aWRlci5mcm9tUHJvdmlkZXJBcm5gLFxuICAgKiBvciBjcmVhdGUgYSBuZXcgcHJvdmlkZXIgdXNpbmcgYG5ldyBla3MuT3BlbklkQ29ubmVjdFByb3ZpZGVyYFxuICAgKiBAZGVmYXVsdCAtIGlmIG5vdCBzcGVjaWZpZWQgYGNsdXN0ZXIub3BlbklkQ29ubmVjdFByb3ZpZGVyYCBhbmQgYGNsdXN0ZXIuYWRkU2VydmljZUFjY291bnRgIHdpbGwgdGhyb3cgYW4gZXJyb3IuXG4gICAqL1xuICByZWFkb25seSBvcGVuSWRDb25uZWN0UHJvdmlkZXI/OiBpYW0uSU9wZW5JZENvbm5lY3RQcm92aWRlcjtcblxuICAvKipcbiAgICogS3ViZWN0bFByb3ZpZGVyIGZvciBpc3N1aW5nIGt1YmVjdGwgY29tbWFuZHMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRGVmYXVsdCBDREsgcHJvdmlkZXJcbiAgICovXG4gIHJlYWRvbmx5IGt1YmVjdGxQcm92aWRlcj86IElLdWJlY3RsUHJvdmlkZXI7XG5cbiAgLyoqXG4gICAqIE9wdGlvbnMgZm9yIGNyZWF0aW5nIHRoZSBrdWJlY3RsIHByb3ZpZGVyIC0gYSBsYW1iZGEgZnVuY3Rpb24gdGhhdCBleGVjdXRlcyBga3ViZWN0bGAgYW5kIGBoZWxtYFxuICAgKiBhZ2FpbnN0IHRoZSBjbHVzdGVyLiBJZiBkZWZpbmVkLCBga3ViZWN0bExheWVyYCBpcyBhIHJlcXVpcmVkIHByb3BlcnR5LlxuICAgKlxuICAgKiBJZiBub3QgZGVmaW5lZCwga3ViZWN0bCBwcm92aWRlciB3aWxsIG5vdCBiZSBjcmVhdGVkIGJ5IGRlZmF1bHQuXG4gICAqL1xuICByZWFkb25seSBrdWJlY3RsUHJvdmlkZXJPcHRpb25zPzogS3ViZWN0bFByb3ZpZGVyT3B0aW9ucztcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgS3ViZXJuZXRlcyByZXNvdXJjZXMgYWRkZWQgdGhyb3VnaCBgYWRkTWFuaWZlc3QoKWAgY2FuIGJlXG4gICAqIGF1dG9tYXRpY2FsbHkgcHJ1bmVkLiBXaGVuIHRoaXMgaXMgZW5hYmxlZCAoZGVmYXVsdCksIHBydW5lIGxhYmVscyB3aWxsIGJlXG4gICAqIGFsbG9jYXRlZCBhbmQgaW5qZWN0ZWQgdG8gZWFjaCByZXNvdXJjZS4gVGhlc2UgbGFiZWxzIHdpbGwgdGhlbiBiZSB1c2VkXG4gICAqIHdoZW4gaXNzdWluZyB0aGUgYGt1YmVjdGwgYXBwbHlgIG9wZXJhdGlvbiB3aXRoIHRoZSBgLS1wcnVuZWAgc3dpdGNoLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBwcnVuZT86IGJvb2xlYW47XG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgY29uZmlndXJpbmcgYW4gRUtTIGNsdXN0ZXIuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2x1c3RlckNvbW1vbk9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIFZQQyBpbiB3aGljaCB0byBjcmVhdGUgdGhlIENsdXN0ZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gYSBWUEMgd2l0aCBkZWZhdWx0IGNvbmZpZ3VyYXRpb24gd2lsbCBiZSBjcmVhdGVkIGFuZCBjYW4gYmUgYWNjZXNzZWQgdGhyb3VnaCBgY2x1c3Rlci52cGNgLlxuICAgKi9cbiAgcmVhZG9ubHkgdnBjPzogZWMyLklWcGM7XG5cbiAgLyoqXG4gICAqIFdoZXJlIHRvIHBsYWNlIEVLUyBDb250cm9sIFBsYW5lIEVOSXNcbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIHRvIG9ubHkgc2VsZWN0IHByaXZhdGUgc3VibmV0cywgc3VwcGx5IHRoZSBmb2xsb3dpbmc6XG4gICAqXG4gICAqIGB2cGNTdWJuZXRzOiBbeyBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTIH1dYFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEFsbCBwdWJsaWMgYW5kIHByaXZhdGUgc3VibmV0c1xuICAgKi9cbiAgcmVhZG9ubHkgdnBjU3VibmV0cz86IGVjMi5TdWJuZXRTZWxlY3Rpb25bXTtcblxuICAvKipcbiAgICogUm9sZSB0aGF0IHByb3ZpZGVzIHBlcm1pc3Npb25zIGZvciB0aGUgS3ViZXJuZXRlcyBjb250cm9sIHBsYW5lIHRvIG1ha2UgY2FsbHMgdG8gQVdTIEFQSSBvcGVyYXRpb25zIG9uIHlvdXIgYmVoYWxmLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEEgcm9sZSBpcyBhdXRvbWF0aWNhbGx5IGNyZWF0ZWQgZm9yIHlvdVxuICAgKi9cbiAgcmVhZG9ubHkgcm9sZT86IGlhbS5JUm9sZTtcblxuICAvKipcbiAgICogTmFtZSBmb3IgdGhlIGNsdXN0ZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQXV0b21hdGljYWxseSBnZW5lcmF0ZWQgbmFtZVxuICAgKi9cbiAgcmVhZG9ubHkgY2x1c3Rlck5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFNlY3VyaXR5IEdyb3VwIHRvIHVzZSBmb3IgQ29udHJvbCBQbGFuZSBFTklzXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQSBzZWN1cml0eSBncm91cCBpcyBhdXRvbWF0aWNhbGx5IGNyZWF0ZWRcbiAgICovXG4gIHJlYWRvbmx5IHNlY3VyaXR5R3JvdXA/OiBlYzIuSVNlY3VyaXR5R3JvdXA7XG5cbiAgLyoqXG4gICAqIFRoZSBLdWJlcm5ldGVzIHZlcnNpb24gdG8gcnVuIGluIHRoZSBjbHVzdGVyXG4gICAqL1xuICByZWFkb25seSB2ZXJzaW9uOiBLdWJlcm5ldGVzVmVyc2lvbjtcblxuICAvKipcbiAgICogQW4gSUFNIHJvbGUgdGhhdCB3aWxsIGJlIGFkZGVkIHRvIHRoZSBgc3lzdGVtOm1hc3RlcnNgIEt1YmVybmV0ZXMgUkJBQ1xuICAgKiBncm91cC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2t1YmVybmV0ZXMuaW8vZG9jcy9yZWZlcmVuY2UvYWNjZXNzLWF1dGhuLWF1dGh6L3JiYWMvI2RlZmF1bHQtcm9sZXMtYW5kLXJvbGUtYmluZGluZ3NcbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBtYXN0ZXJzIHJvbGUuXG4gICAqL1xuICByZWFkb25seSBtYXN0ZXJzUm9sZT86IGlhbS5JUm9sZTtcblxuICAvKipcbiAgICogQ29udHJvbHMgdGhlIFwiZWtzLmFtYXpvbmF3cy5jb20vY29tcHV0ZS10eXBlXCIgYW5ub3RhdGlvbiBpbiB0aGUgQ29yZUROU1xuICAgKiBjb25maWd1cmF0aW9uIG9uIHlvdXIgY2x1c3RlciB0byBkZXRlcm1pbmUgd2hpY2ggY29tcHV0ZSB0eXBlIHRvIHVzZVxuICAgKiBmb3IgQ29yZUROUy5cbiAgICpcbiAgICogQGRlZmF1bHQgQ29yZURuc0NvbXB1dGVUeXBlLkVDMiAoZm9yIGBGYXJnYXRlQ2x1c3RlcmAgdGhlIGRlZmF1bHQgaXMgRkFSR0FURSlcbiAgICovXG4gIHJlYWRvbmx5IGNvcmVEbnNDb21wdXRlVHlwZT86IENvcmVEbnNDb21wdXRlVHlwZTtcblxuICAvKipcbiAgICogQ29uZmlndXJlIGFjY2VzcyB0byB0aGUgS3ViZXJuZXRlcyBBUEkgc2VydmVyIGVuZHBvaW50Li5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZWtzL2xhdGVzdC91c2VyZ3VpZGUvY2x1c3Rlci1lbmRwb2ludC5odG1sXG4gICAqXG4gICAqIEBkZWZhdWx0IEVuZHBvaW50QWNjZXNzLlBVQkxJQ19BTkRfUFJJVkFURVxuICAgKi9cbiAgcmVhZG9ubHkgZW5kcG9pbnRBY2Nlc3M/OiBFbmRwb2ludEFjY2VzcztcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgS3ViZXJuZXRlcyByZXNvdXJjZXMgYWRkZWQgdGhyb3VnaCBgYWRkTWFuaWZlc3QoKWAgY2FuIGJlXG4gICAqIGF1dG9tYXRpY2FsbHkgcHJ1bmVkLiBXaGVuIHRoaXMgaXMgZW5hYmxlZCAoZGVmYXVsdCksIHBydW5lIGxhYmVscyB3aWxsIGJlXG4gICAqIGFsbG9jYXRlZCBhbmQgaW5qZWN0ZWQgdG8gZWFjaCByZXNvdXJjZS4gVGhlc2UgbGFiZWxzIHdpbGwgdGhlbiBiZSB1c2VkXG4gICAqIHdoZW4gaXNzdWluZyB0aGUgYGt1YmVjdGwgYXBwbHlgIG9wZXJhdGlvbiB3aXRoIHRoZSBgLS1wcnVuZWAgc3dpdGNoLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBwcnVuZT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEtNUyBzZWNyZXQgZm9yIGVudmVsb3BlIGVuY3J5cHRpb24gZm9yIEt1YmVybmV0ZXMgc2VjcmV0cy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBCeSBkZWZhdWx0LCBLdWJlcm5ldGVzIHN0b3JlcyBhbGwgc2VjcmV0IG9iamVjdCBkYXRhIHdpdGhpbiBldGNkIGFuZFxuICAgKiAgICAgICAgICAgIGFsbCBldGNkIHZvbHVtZXMgdXNlZCBieSBBbWF6b24gRUtTIGFyZSBlbmNyeXB0ZWQgYXQgdGhlIGRpc2stbGV2ZWxcbiAgICogICAgICAgICAgICB1c2luZyBBV1MtTWFuYWdlZCBlbmNyeXB0aW9uIGtleXMuXG4gICAqL1xuICByZWFkb25seSBzZWNyZXRzRW5jcnlwdGlvbktleT86IGttcy5JS2V5UmVmO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZ5IHdoaWNoIElQIGZhbWlseSBpcyB1c2VkIHRvIGFzc2lnbiBLdWJlcm5ldGVzIHBvZCBhbmQgc2VydmljZSBJUCBhZGRyZXNzZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IElwRmFtaWx5LklQX1Y0XG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Vrcy9sYXRlc3QvQVBJUmVmZXJlbmNlL0FQSV9LdWJlcm5ldGVzTmV0d29ya0NvbmZpZ1JlcXVlc3QuaHRtbCNBbWF6b25FS1MtVHlwZS1LdWJlcm5ldGVzTmV0d29ya0NvbmZpZ1JlcXVlc3QtaXBGYW1pbHlcbiAgICovXG4gIHJlYWRvbmx5IGlwRmFtaWx5PzogSXBGYW1pbHk7XG5cbiAgLyoqXG4gICAqIFRoZSBDSURSIGJsb2NrIHRvIGFzc2lnbiBLdWJlcm5ldGVzIHNlcnZpY2UgSVAgYWRkcmVzc2VzIGZyb20uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gS3ViZXJuZXRlcyBhc3NpZ25zIGFkZHJlc3NlcyBmcm9tIGVpdGhlciB0aGVcbiAgICogICAgICAgICAgICAxMC4xMDAuMC4wLzE2IG9yIDE3Mi4yMC4wLjAvMTYgQ0lEUiBibG9ja3NcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZWtzL2xhdGVzdC9BUElSZWZlcmVuY2UvQVBJX0t1YmVybmV0ZXNOZXR3b3JrQ29uZmlnUmVxdWVzdC5odG1sI0FtYXpvbkVLUy1UeXBlLUt1YmVybmV0ZXNOZXR3b3JrQ29uZmlnUmVxdWVzdC1zZXJ2aWNlSXB2NENpZHJcbiAgICovXG4gIHJlYWRvbmx5IHNlcnZpY2VJcHY0Q2lkcj86IHN0cmluZztcblxuICAvKipcbiAgICogSW5zdGFsbCB0aGUgQVdTIExvYWQgQmFsYW5jZXIgQ29udHJvbGxlciBvbnRvIHRoZSBjbHVzdGVyLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8va3ViZXJuZXRlcy1zaWdzLmdpdGh1Yi5pby9hd3MtbG9hZC1iYWxhbmNlci1jb250cm9sbGVyXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gVGhlIGNvbnRyb2xsZXIgaXMgbm90IGluc3RhbGxlZC5cbiAgICovXG4gIHJlYWRvbmx5IGFsYkNvbnRyb2xsZXI/OiBBbGJDb250cm9sbGVyT3B0aW9ucztcblxuICAvKipcbiAgICogVGhlIGNsdXN0ZXIgbG9nIHR5cGVzIHdoaWNoIHlvdSB3YW50IHRvIGVuYWJsZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBub25lXG4gICAqL1xuICByZWFkb25seSBjbHVzdGVyTG9nZ2luZz86IENsdXN0ZXJMb2dnaW5nVHlwZXNbXTtcblxuICAvKipcbiAgICogVGhlIHRhZ3MgYXNzaWduZWQgdG8gdGhlIEVLUyBjbHVzdGVyXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgdGFncz86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH07XG5cbiAgLyoqXG4gICAqIE9wdGlvbnMgZm9yIGNyZWF0aW5nIHRoZSBrdWJlY3RsIHByb3ZpZGVyIC0gYSBsYW1iZGEgZnVuY3Rpb24gdGhhdCBleGVjdXRlcyBga3ViZWN0bGAgYW5kIGBoZWxtYFxuICAgKiBhZ2FpbnN0IHRoZSBjbHVzdGVyLiBJZiBkZWZpbmVkLCBga3ViZWN0bExheWVyYCBpcyBhIHJlcXVpcmVkIHByb3BlcnR5LlxuICAgKlxuICAgKiBJZiBub3QgZGVmaW5lZCwga3ViZWN0bCBwcm92aWRlciB3aWxsIG5vdCBiZSBjcmVhdGVkIGJ5IGRlZmF1bHQuXG4gICAqL1xuICByZWFkb25seSBrdWJlY3RsUHJvdmlkZXJPcHRpb25zPzogS3ViZWN0bFByb3ZpZGVyT3B0aW9ucztcbn1cblxuLyoqXG4gKiBHcm91cCBhY2Nlc3MgY29uZmlndXJhdGlvbiB0b2dldGhlci5cbiAqL1xuaW50ZXJmYWNlIEVuZHBvaW50QWNjZXNzQ29uZmlnIHtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIGlmIHByaXZhdGUgYWNjZXNzIGlzIGVuYWJsZWQuXG4gICAqL1xuICByZWFkb25seSBwcml2YXRlQWNjZXNzOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgaWYgcHVibGljIGFjY2VzcyBpcyBlbmFibGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgcHVibGljQWNjZXNzOiBib29sZWFuO1xuICAvKipcbiAgICogUHVibGljIGFjY2VzcyBpcyBhbGxvd2VkIG9ubHkgZnJvbSB0aGVzZSBDSURSIGJsb2Nrcy5cbiAgICogQW4gZW1wdHkgYXJyYXkgbWVhbnMgYWNjZXNzIGlzIG9wZW4gdG8gYW55IGFkZHJlc3MuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gcmVzdHJpY3Rpb25zLlxuICAgKi9cbiAgcmVhZG9ubHkgcHVibGljQ2lkcnM/OiBzdHJpbmdbXTtcblxufVxuXG4vKipcbiAqIEVuZHBvaW50IGFjY2VzcyBjaGFyYWN0ZXJpc3RpY3MuXG4gKi9cbmV4cG9ydCBjbGFzcyBFbmRwb2ludEFjY2VzcyB7XG4gIC8qKlxuICAgKiBUaGUgY2x1c3RlciBlbmRwb2ludCBpcyBhY2Nlc3NpYmxlIGZyb20gb3V0c2lkZSBvZiB5b3VyIFZQQy5cbiAgICogV29ya2VyIG5vZGUgdHJhZmZpYyB3aWxsIGxlYXZlIHlvdXIgVlBDIHRvIGNvbm5lY3QgdG8gdGhlIGVuZHBvaW50LlxuICAgKlxuICAgKiBCeSBkZWZhdWx0LCB0aGUgZW5kcG9pbnQgaXMgZXhwb3NlZCB0byBhbGwgYWRyZXNzZXMuIFlvdSBjYW4gb3B0aW9uYWxseSBsaW1pdCB0aGUgQ0lEUiBibG9ja3MgdGhhdCBjYW4gYWNjZXNzIHRoZSBwdWJsaWMgZW5kcG9pbnQgdXNpbmcgdGhlIGBQVUJMSUMub25seUZyb21gIG1ldGhvZC5cbiAgICogSWYgeW91IGxpbWl0IGFjY2VzcyB0byBzcGVjaWZpYyBDSURSIGJsb2NrcywgeW91IG11c3QgZW5zdXJlIHRoYXQgdGhlIENJRFIgYmxvY2tzIHRoYXQgeW91XG4gICAqIHNwZWNpZnkgaW5jbHVkZSB0aGUgYWRkcmVzc2VzIHRoYXQgd29ya2VyIG5vZGVzIGFuZCBGYXJnYXRlIHBvZHMgKGlmIHlvdSB1c2UgdGhlbSlcbiAgICogYWNjZXNzIHRoZSBwdWJsaWMgZW5kcG9pbnQgZnJvbS5cbiAgICpcbiAgICogQHBhcmFtIGNpZHIgVGhlIENJRFIgYmxvY2tzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBQVUJMSUMgPSBuZXcgRW5kcG9pbnRBY2Nlc3MoeyBwcml2YXRlQWNjZXNzOiBmYWxzZSwgcHVibGljQWNjZXNzOiB0cnVlIH0pO1xuXG4gIC8qKlxuICAgKiBUaGUgY2x1c3RlciBlbmRwb2ludCBpcyBvbmx5IGFjY2Vzc2libGUgdGhyb3VnaCB5b3VyIFZQQy5cbiAgICogV29ya2VyIG5vZGUgdHJhZmZpYyB0byB0aGUgZW5kcG9pbnQgd2lsbCBzdGF5IHdpdGhpbiB5b3VyIFZQQy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUFJJVkFURSA9IG5ldyBFbmRwb2ludEFjY2Vzcyh7IHByaXZhdGVBY2Nlc3M6IHRydWUsIHB1YmxpY0FjY2VzczogZmFsc2UgfSk7XG5cbiAgLyoqXG4gICAqIFRoZSBjbHVzdGVyIGVuZHBvaW50IGlzIGFjY2Vzc2libGUgZnJvbSBvdXRzaWRlIG9mIHlvdXIgVlBDLlxuICAgKiBXb3JrZXIgbm9kZSB0cmFmZmljIHRvIHRoZSBlbmRwb2ludCB3aWxsIHN0YXkgd2l0aGluIHlvdXIgVlBDLlxuICAgKlxuICAgKiBCeSBkZWZhdWx0LCB0aGUgZW5kcG9pbnQgaXMgZXhwb3NlZCB0byBhbGwgYWRyZXNzZXMuIFlvdSBjYW4gb3B0aW9uYWxseSBsaW1pdCB0aGUgQ0lEUiBibG9ja3MgdGhhdCBjYW4gYWNjZXNzIHRoZSBwdWJsaWMgZW5kcG9pbnQgdXNpbmcgdGhlIGBQVUJMSUNfQU5EX1BSSVZBVEUub25seUZyb21gIG1ldGhvZC5cbiAgICogSWYgeW91IGxpbWl0IGFjY2VzcyB0byBzcGVjaWZpYyBDSURSIGJsb2NrcywgeW91IG11c3QgZW5zdXJlIHRoYXQgdGhlIENJRFIgYmxvY2tzIHRoYXQgeW91XG4gICAqIHNwZWNpZnkgaW5jbHVkZSB0aGUgYWRkcmVzc2VzIHRoYXQgd29ya2VyIG5vZGVzIGFuZCBGYXJnYXRlIHBvZHMgKGlmIHlvdSB1c2UgdGhlbSlcbiAgICogYWNjZXNzIHRoZSBwdWJsaWMgZW5kcG9pbnQgZnJvbS5cbiAgICpcbiAgICogQHBhcmFtIGNpZHIgVGhlIENJRFIgYmxvY2tzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBQVUJMSUNfQU5EX1BSSVZBVEUgPSBuZXcgRW5kcG9pbnRBY2Nlc3MoeyBwcml2YXRlQWNjZXNzOiB0cnVlLCBwdWJsaWNBY2Nlc3M6IHRydWUgfSk7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihcbiAgICAvKipcbiAgICAgKiBDb25maWd1cmF0aW9uIHByb3BlcnRpZXMuXG4gICAgICpcbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgX2NvbmZpZzogRW5kcG9pbnRBY2Nlc3NDb25maWcpIHtcbiAgICBpZiAoIV9jb25maWcucHVibGljQWNjZXNzICYmIF9jb25maWcucHVibGljQ2lkcnMgJiYgX2NvbmZpZy5wdWJsaWNDaWRycy5sZW5ndGggPiAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NJRFIgYmxvY2tzIGNhbiBvbmx5IGJlIGNvbmZpZ3VyZWQgd2hlbiBwdWJsaWMgYWNjZXNzIGlzIGVuYWJsZWQnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVzdHJpY3QgcHVibGljIGFjY2VzcyB0byBzcGVjaWZpYyBDSURSIGJsb2Nrcy5cbiAgICogSWYgcHVibGljIGFjY2VzcyBpcyBkaXNhYmxlZCwgdGhpcyBtZXRob2Qgd2lsbCByZXN1bHQgaW4gYW4gZXJyb3IuXG4gICAqXG4gICAqIEBwYXJhbSBjaWRyIENJRFIgYmxvY2tzLlxuICAgKi9cbiAgcHVibGljIG9ubHlGcm9tKC4uLmNpZHI6IHN0cmluZ1tdKSB7XG4gICAgaWYgKCF0aGlzLl9jb25maWcucHJpdmF0ZUFjY2Vzcykge1xuICAgICAgLy8gd2hlbiBwcml2YXRlIGFjY2VzcyBpcyBkaXNhYmxlZCwgd2UgY2FuJ3QgcmVzdHJpYyBwdWJsaWNcbiAgICAgIC8vIGFjY2VzcyBzaW5jZSBpdCB3aWxsIHJlbmRlciB0aGUga3ViZWN0bCBwcm92aWRlciB1bnVzYWJsZS5cbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHJlc3RyaWMgcHVibGljIGFjY2VzcyB0byBlbmRwb2ludCB3aGVuIHByaXZhdGUgYWNjZXNzIGlzIGRpc2FibGVkLiBVc2UgUFVCTElDX0FORF9QUklWQVRFLm9ubHlGcm9tKCkgaW5zdGVhZC4nKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBFbmRwb2ludEFjY2Vzcyh7XG4gICAgICAuLi50aGlzLl9jb25maWcsXG4gICAgICAvLyBvdmVycmlkZSBDSURSXG4gICAgICBwdWJsaWNDaWRyczogY2lkcixcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGNvbmZpZ3VyaW5nIEVLUyBBdXRvIE1vZGUgY29tcHV0ZSBzZXR0aW5ncy5cbiAqIFdoZW4gZW5hYmxlZCwgRUtTIHdpbGwgYXV0b21hdGljYWxseSBtYW5hZ2UgY29tcHV0ZSByZXNvdXJjZXMgbGlrZSBub2RlIGdyb3VwcyBhbmQgRmFyZ2F0ZSBwcm9maWxlcy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb21wdXRlQ29uZmlnIHtcbiAgLyoqXG4gICAqIE5hbWVzIG9mIG5vZGVQb29scyB0byBpbmNsdWRlIGluIEF1dG8gTW9kZS5cbiAgICogWW91IGNhbm5vdCBtb2RpZnkgdGhlIGJ1aWx0IGluIHN5c3RlbSBhbmQgZ2VuZXJhbC1wdXJwb3NlIG5vZGUgcG9vbHMuIFlvdSBjYW4gb25seSBlbmFibGUgb3IgZGlzYWJsZSB0aGVtLlxuICAgKiBOb2RlIHBvb2wgdmFsdWVzIGFyZSBjYXNlLXNlbnNpdGl2ZSBhbmQgbXVzdCBiZSBgZ2VuZXJhbC1wdXJwb3NlYCBhbmQvb3IgYHN5c3RlbWAuXG4gICAqXG4gICAqIEBzZWUgLSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZWtzL2xhdGVzdC91c2VyZ3VpZGUvY3JlYXRlLW5vZGUtcG9vbC5odG1sXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gWydzeXN0ZW0nLCAnZ2VuZXJhbC1wdXJwb3NlJ11cbiAgICovXG4gIHJlYWRvbmx5IG5vZGVQb29scz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBJQU0gcm9sZSBmb3IgdGhlIG5vZGVQb29scy5cbiAgICpcbiAgICogQHNlZSAtIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9la3MvbGF0ZXN0L3VzZXJndWlkZS9jcmVhdGUtbm9kZS1yb2xlLmh0bWxcbiAgICpcbiAgICogQGRlZmF1bHQgLSBnZW5lcmF0ZWQgYnkgdGhlIENES1xuICAgKi9cbiAgcmVhZG9ubHkgbm9kZVJvbGU/OiBpYW0uSVJvbGU7XG5cbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBjb25maWd1cmluZyBhIHN0YW5kYXJkIEVLUyBjbHVzdGVyIChub24tRmFyZ2F0ZSlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDbHVzdGVyUHJvcHMgZXh0ZW5kcyBDbHVzdGVyQ29tbW9uT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBDb25maWd1cmF0aW9uIGZvciBjb21wdXRlIHNldHRpbmdzIGluIEF1dG8gTW9kZS5cbiAgICogV2hlbiBlbmFibGVkLCBFS1Mgd2lsbCBhdXRvbWF0aWNhbGx5IG1hbmFnZSBjb21wdXRlIHJlc291cmNlcy5cbiAgICogQGRlZmF1bHQgLSBBdXRvIE1vZGUgY29tcHV0ZSBkaXNhYmxlZFxuICAgKi9cbiAgcmVhZG9ubHkgY29tcHV0ZT86IENvbXB1dGVDb25maWc7XG5cbiAgLyoqXG4gICAqIE51bWJlciBvZiBpbnN0YW5jZXMgdG8gYWxsb2NhdGUgYXMgYW4gaW5pdGlhbCBjYXBhY2l0eSBmb3IgdGhpcyBjbHVzdGVyLlxuICAgKiBJbnN0YW5jZSB0eXBlIGNhbiBiZSBjb25maWd1cmVkIHRocm91Z2ggYGRlZmF1bHRDYXBhY2l0eUluc3RhbmNlVHlwZWAsXG4gICAqIHdoaWNoIGRlZmF1bHRzIHRvIGBtNS5sYXJnZWAuXG4gICAqXG4gICAqIFVzZSBgY2x1c3Rlci5hZGRBdXRvU2NhbGluZ0dyb3VwQ2FwYWNpdHlgIHRvIGFkZCBhZGRpdGlvbmFsIGN1c3RvbWl6ZWQgY2FwYWNpdHkuIFNldCB0aGlzXG4gICAqIHRvIGAwYCBpcyB5b3Ugd2lzaCB0byBhdm9pZCB0aGUgaW5pdGlhbCBjYXBhY2l0eSBhbGxvY2F0aW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCAyXG4gICAqL1xuICByZWFkb25seSBkZWZhdWx0Q2FwYWNpdHk/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBpbnN0YW5jZSB0eXBlIHRvIHVzZSBmb3IgdGhlIGRlZmF1bHQgY2FwYWNpdHkuIFRoaXMgd2lsbCBvbmx5IGJlIHRha2VuXG4gICAqIGludG8gYWNjb3VudCBpZiBgZGVmYXVsdENhcGFjaXR5YCBpcyA+IDAuXG4gICAqXG4gICAqIEBkZWZhdWx0IG01LmxhcmdlXG4gICAqL1xuICByZWFkb25seSBkZWZhdWx0Q2FwYWNpdHlJbnN0YW5jZT86IGVjMi5JbnN0YW5jZVR5cGU7XG5cbiAgLyoqXG4gICAqIFRoZSBkZWZhdWx0IGNhcGFjaXR5IHR5cGUgZm9yIHRoZSBjbHVzdGVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCBBVVRPTU9ERVxuICAgKi9cbiAgcmVhZG9ubHkgZGVmYXVsdENhcGFjaXR5VHlwZT86IERlZmF1bHRDYXBhY2l0eVR5cGU7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgb3Igbm90IElBTSBwcmluY2lwYWwgb2YgdGhlIGNsdXN0ZXIgY3JlYXRvciB3YXMgc2V0IGFzIGEgY2x1c3RlciBhZG1pbiBhY2Nlc3MgZW50cnlcbiAgICogZHVyaW5nIGNsdXN0ZXIgY3JlYXRpb24gdGltZS5cbiAgICpcbiAgICogQ2hhbmdpbmcgdGhpcyB2YWx1ZSBhZnRlciB0aGUgY2x1c3RlciBoYXMgYmVlbiBjcmVhdGVkIHdpbGwgcmVzdWx0IGluIHRoZSBjbHVzdGVyIGJlaW5nIHJlcGxhY2VkLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBib290c3RyYXBDbHVzdGVyQ3JlYXRvckFkbWluUGVybWlzc2lvbnM/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYSBDbG91ZEZvcm1hdGlvbiBvdXRwdXQgd2l0aCB0aGUgYGF3cyBla3NcbiAgICogdXBkYXRlLWt1YmVjb25maWdgIGNvbW1hbmQgd2lsbCBiZSBzeW50aGVzaXplZC4gVGhpcyBjb21tYW5kIHdpbGwgaW5jbHVkZVxuICAgKiB0aGUgY2x1c3RlciBuYW1lIGFuZCwgaWYgYXBwbGljYWJsZSwgdGhlIEFSTiBvZiB0aGUgbWFzdGVycyBJQU0gcm9sZS5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgb3V0cHV0Q29uZmlnQ29tbWFuZD86IGJvb2xlYW47XG59XG5cbi8qKlxuICogS3ViZXJuZXRlcyBjbHVzdGVyIHZlcnNpb25cbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Vrcy9sYXRlc3QvdXNlcmd1aWRlL2t1YmVybmV0ZXMtdmVyc2lvbnMuaHRtbCNrdWJlcm5ldGVzLXJlbGVhc2UtY2FsZW5kYXJcbiAqL1xuZXhwb3J0IGNsYXNzIEt1YmVybmV0ZXNWZXJzaW9uIHtcbiAgLyoqXG4gICAqIEt1YmVybmV0ZXMgdmVyc2lvbiAxLjI1XG4gICAqXG4gICAqIFdoZW4gY3JlYXRpbmcgYSBgQ2x1c3RlcmAgd2l0aCB0aGlzIHZlcnNpb24sIHlvdSBuZWVkIHRvIGFsc28gc3BlY2lmeSB0aGVcbiAgICogYGt1YmVjdGxMYXllcmAgcHJvcGVydHkgd2l0aCBhIGBLdWJlY3RsVjI1TGF5ZXJgIGZyb21cbiAgICogYEBhd3MtY2RrL2xhbWJkYS1sYXllci1rdWJlY3RsLXYyNWAuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFYxXzI1ID0gS3ViZXJuZXRlc1ZlcnNpb24ub2YoJzEuMjUnKTtcblxuICAvKipcbiAgICogS3ViZXJuZXRlcyB2ZXJzaW9uIDEuMjZcbiAgICpcbiAgICogV2hlbiBjcmVhdGluZyBhIGBDbHVzdGVyYCB3aXRoIHRoaXMgdmVyc2lvbiwgeW91IG5lZWQgdG8gYWxzbyBzcGVjaWZ5IHRoZVxuICAgKiBga3ViZWN0bExheWVyYCBwcm9wZXJ0eSB3aXRoIGEgYEt1YmVjdGxWMjZMYXllcmAgZnJvbVxuICAgKiBgQGF3cy1jZGsvbGFtYmRhLWxheWVyLWt1YmVjdGwtdjI2YC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVjFfMjYgPSBLdWJlcm5ldGVzVmVyc2lvbi5vZignMS4yNicpO1xuXG4gIC8qKlxuICAgKiBLdWJlcm5ldGVzIHZlcnNpb24gMS4yN1xuICAgKlxuICAgKiBXaGVuIGNyZWF0aW5nIGEgYENsdXN0ZXJgIHdpdGggdGhpcyB2ZXJzaW9uLCB5b3UgbmVlZCB0byBhbHNvIHNwZWNpZnkgdGhlXG4gICAqIGBrdWJlY3RsTGF5ZXJgIHByb3BlcnR5IHdpdGggYSBgS3ViZWN0bFYyN0xheWVyYCBmcm9tXG4gICAqIGBAYXdzLWNkay9sYW1iZGEtbGF5ZXIta3ViZWN0bC12MjdgLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBWMV8yNyA9IEt1YmVybmV0ZXNWZXJzaW9uLm9mKCcxLjI3Jyk7XG5cbiAgLyoqXG4gICAqIEt1YmVybmV0ZXMgdmVyc2lvbiAxLjI4XG4gICAqXG4gICAqIFdoZW4gY3JlYXRpbmcgYSBgQ2x1c3RlcmAgd2l0aCB0aGlzIHZlcnNpb24sIHlvdSBuZWVkIHRvIGFsc28gc3BlY2lmeSB0aGVcbiAgICogYGt1YmVjdGxMYXllcmAgcHJvcGVydHkgd2l0aCBhIGBLdWJlY3RsVjI4TGF5ZXJgIGZyb21cbiAgICogYEBhd3MtY2RrL2xhbWJkYS1sYXllci1rdWJlY3RsLXYyOGAuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFYxXzI4ID0gS3ViZXJuZXRlc1ZlcnNpb24ub2YoJzEuMjgnKTtcblxuICAvKipcbiAgICogS3ViZXJuZXRlcyB2ZXJzaW9uIDEuMjlcbiAgICpcbiAgICogV2hlbiBjcmVhdGluZyBhIGBDbHVzdGVyYCB3aXRoIHRoaXMgdmVyc2lvbiwgeW91IG5lZWQgdG8gYWxzbyBzcGVjaWZ5IHRoZVxuICAgKiBga3ViZWN0bExheWVyYCBwcm9wZXJ0eSB3aXRoIGEgYEt1YmVjdGxWMjlMYXllcmAgZnJvbVxuICAgKiBgQGF3cy1jZGsvbGFtYmRhLWxheWVyLWt1YmVjdGwtdjI5YC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVjFfMjkgPSBLdWJlcm5ldGVzVmVyc2lvbi5vZignMS4yOScpO1xuXG4gIC8qKlxuICAgKiBLdWJlcm5ldGVzIHZlcnNpb24gMS4zMFxuICAgKlxuICAgKiBXaGVuIGNyZWF0aW5nIGEgYENsdXN0ZXJgIHdpdGggdGhpcyB2ZXJzaW9uLCB5b3UgbmVlZCB0byBhbHNvIHNwZWNpZnkgdGhlXG4gICAqIGBrdWJlY3RsTGF5ZXJgIHByb3BlcnR5IHdpdGggYSBgS3ViZWN0bFYzMExheWVyYCBmcm9tXG4gICAqIGBAYXdzLWNkay9sYW1iZGEtbGF5ZXIta3ViZWN0bC12MzBgLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBWMV8zMCA9IEt1YmVybmV0ZXNWZXJzaW9uLm9mKCcxLjMwJyk7XG5cbiAgLyoqXG4gICAqIEt1YmVybmV0ZXMgdmVyc2lvbiAxLjMxXG4gICAqXG4gICAqIFdoZW4gY3JlYXRpbmcgYSBgQ2x1c3RlcmAgd2l0aCB0aGlzIHZlcnNpb24sIHlvdSBuZWVkIHRvIGFsc28gc3BlY2lmeSB0aGVcbiAgICogYGt1YmVjdGxMYXllcmAgcHJvcGVydHkgd2l0aCBhIGBLdWJlY3RsVjMxTGF5ZXJgIGZyb21cbiAgICogYEBhd3MtY2RrL2xhbWJkYS1sYXllci1rdWJlY3RsLXYzMWAuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFYxXzMxID0gS3ViZXJuZXRlc1ZlcnNpb24ub2YoJzEuMzEnKTtcblxuICAvKipcbiAgICogS3ViZXJuZXRlcyB2ZXJzaW9uIDEuMzJcbiAgICpcbiAgICogV2hlbiBjcmVhdGluZyBhIGBDbHVzdGVyYCB3aXRoIHRoaXMgdmVyc2lvbiwgeW91IG5lZWQgdG8gYWxzbyBzcGVjaWZ5IHRoZVxuICAgKiBga3ViZWN0bExheWVyYCBwcm9wZXJ0eSB3aXRoIGEgYEt1YmVjdGxWMzJMYXllcmAgZnJvbVxuICAgKiBgQGF3cy1jZGsvbGFtYmRhLWxheWVyLWt1YmVjdGwtdjMyYC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVjFfMzIgPSBLdWJlcm5ldGVzVmVyc2lvbi5vZignMS4zMicpO1xuXG4gIC8qKlxuICAgKiBLdWJlcm5ldGVzIHZlcnNpb24gMS4zM1xuICAgKlxuICAgKiBXaGVuIGNyZWF0aW5nIGEgYENsdXN0ZXJgIHdpdGggdGhpcyB2ZXJzaW9uLCB5b3UgbmVlZCB0byBhbHNvIHNwZWNpZnkgdGhlXG4gICAqIGBrdWJlY3RsTGF5ZXJgIHByb3BlcnR5IHdpdGggYSBgS3ViZWN0bFYzM0xheWVyYCBmcm9tXG4gICAqIGBAYXdzLWNkay9sYW1iZGEtbGF5ZXIta3ViZWN0bC12MzNgLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBWMV8zMyA9IEt1YmVybmV0ZXNWZXJzaW9uLm9mKCcxLjMzJyk7XG5cbiAgLyoqXG4gICAqIEt1YmVybmV0ZXMgdmVyc2lvbiAxLjM0XG4gICAqXG4gICAqIFdoZW4gY3JlYXRpbmcgYSBgQ2x1c3RlcmAgd2l0aCB0aGlzIHZlcnNpb24sIHlvdSBuZWVkIHRvIGFsc28gc3BlY2lmeSB0aGVcbiAgICogYGt1YmVjdGxMYXllcmAgcHJvcGVydHkgd2l0aCBhIGBLdWJlY3RsVjM0TGF5ZXJgIGZyb21cbiAgICogYEBhd3MtY2RrL2xhbWJkYS1sYXllci1rdWJlY3RsLXYzNGAuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFYxXzM0ID0gS3ViZXJuZXRlc1ZlcnNpb24ub2YoJzEuMzQnKTtcblxuICAvKipcbiAgICogQ3VzdG9tIGNsdXN0ZXIgdmVyc2lvblxuICAgKiBAcGFyYW0gdmVyc2lvbiBjdXN0b20gdmVyc2lvbiBudW1iZXJcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgb2YodmVyc2lvbjogc3RyaW5nKSB7IHJldHVybiBuZXcgS3ViZXJuZXRlc1ZlcnNpb24odmVyc2lvbik7IH1cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB2ZXJzaW9uIGNsdXN0ZXIgdmVyc2lvbiBudW1iZXJcbiAgICovXG4gIHByaXZhdGUgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHZlcnNpb246IHN0cmluZykgeyB9XG59XG5cbi8vIFNoYXJlZCBkZWZpbml0aW9uIHdpdGggcGFja2FnZXMvQGF3cy1jZGsvY3VzdG9tLXJlc291cmNlLWhhbmRsZXJzL3Rlc3QvYXdzLWVrcy9jb21wYXJlLWxvZy50ZXN0LnRzXG4vKipcbiAqIEVLUyBjbHVzdGVyIGxvZ2dpbmcgdHlwZXNcbiAqL1xuZXhwb3J0IGVudW0gQ2x1c3RlckxvZ2dpbmdUeXBlcyB7XG4gIC8qKlxuICAgKiBMb2dzIHBlcnRhaW5pbmcgdG8gQVBJIHJlcXVlc3RzIHRvIHRoZSBjbHVzdGVyLlxuICAgKi9cbiAgQVBJID0gJ2FwaScsXG4gIC8qKlxuICAgKiBMb2dzIHBlcnRhaW5pbmcgdG8gY2x1c3RlciBhY2Nlc3MgdmlhIHRoZSBLdWJlcm5ldGVzIEFQSS5cbiAgICovXG4gIEFVRElUID0gJ2F1ZGl0JyxcbiAgLyoqXG4gICAqIExvZ3MgcGVydGFpbmluZyB0byBhdXRoZW50aWNhdGlvbiByZXF1ZXN0cyBpbnRvIHRoZSBjbHVzdGVyLlxuICAgKi9cbiAgQVVUSEVOVElDQVRPUiA9ICdhdXRoZW50aWNhdG9yJyxcbiAgLyoqXG4gICAqIExvZ3MgcGVydGFpbmluZyB0byBzdGF0ZSBvZiBjbHVzdGVyIGNvbnRyb2xsZXJzLlxuICAgKi9cbiAgQ09OVFJPTExFUl9NQU5BR0VSID0gJ2NvbnRyb2xsZXJNYW5hZ2VyJyxcbiAgLyoqXG4gICAqIExvZ3MgcGVydGFpbmluZyB0byBzY2hlZHVsaW5nIGRlY2lzaW9ucy5cbiAgICovXG4gIFNDSEVEVUxFUiA9ICdzY2hlZHVsZXInLFxufVxuXG4vKipcbiAqIEVLUyBjbHVzdGVyIElQIGZhbWlseS5cbiAqL1xuZXhwb3J0IGVudW0gSXBGYW1pbHkge1xuICAvKipcbiAgICogVXNlIElQdjQgZm9yIHBvZHMgYW5kIHNlcnZpY2VzIGluIHlvdXIgY2x1c3Rlci5cbiAgICovXG4gIElQX1Y0ID0gJ2lwdjQnLFxuICAvKipcbiAgICogVXNlIElQdjYgZm9yIHBvZHMgYW5kIHNlcnZpY2VzIGluIHlvdXIgY2x1c3Rlci5cbiAgICovXG4gIElQX1Y2ID0gJ2lwdjYnLFxufVxuXG5hYnN0cmFjdCBjbGFzcyBDbHVzdGVyQmFzZSBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSUNsdXN0ZXIge1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgY29ubmVjdGlvbnM6IGVjMi5Db25uZWN0aW9ucztcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IHZwYzogZWMyLklWcGM7XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBjbHVzdGVyTmFtZTogc3RyaW5nO1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgY2x1c3RlckFybjogc3RyaW5nO1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgY2x1c3RlckVuZHBvaW50OiBzdHJpbmc7XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBjbHVzdGVyQ2VydGlmaWNhdGVBdXRob3JpdHlEYXRhOiBzdHJpbmc7XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBjbHVzdGVyU2VjdXJpdHlHcm91cElkOiBzdHJpbmc7XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBjbHVzdGVyU2VjdXJpdHlHcm91cDogZWMyLklTZWN1cml0eUdyb3VwO1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgY2x1c3RlckVuY3J5cHRpb25Db25maWdLZXlBcm46IHN0cmluZztcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGlwRmFtaWx5PzogSXBGYW1pbHk7XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBwcnVuZTogYm9vbGVhbjtcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IG9wZW5JZENvbm5lY3RQcm92aWRlcjogaWFtLklPcGVuSWRDb25uZWN0UHJvdmlkZXI7XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYSBLdWJlcm5ldGVzIHJlc291cmNlIGluIHRoaXMgY2x1c3Rlci5cbiAgICpcbiAgICogVGhlIG1hbmlmZXN0IHdpbGwgYmUgYXBwbGllZC9kZWxldGVkIHVzaW5nIGt1YmVjdGwgYXMgbmVlZGVkLlxuICAgKlxuICAgKiBAcGFyYW0gaWQgbG9naWNhbCBpZCBvZiB0aGlzIG1hbmlmZXN0XG4gICAqIEBwYXJhbSBtYW5pZmVzdCBhIGxpc3Qgb2YgS3ViZXJuZXRlcyByZXNvdXJjZSBzcGVjaWZpY2F0aW9uc1xuICAgKiBAcmV0dXJucyBhIGBLdWJlcm5ldGVzUmVzb3VyY2VgIG9iamVjdC5cbiAgICovXG4gIHB1YmxpYyBhZGRNYW5pZmVzdChpZDogc3RyaW5nLCAuLi5tYW5pZmVzdDogUmVjb3JkPHN0cmluZywgYW55PltdKTogS3ViZXJuZXRlc01hbmlmZXN0IHtcbiAgICByZXR1cm4gbmV3IEt1YmVybmV0ZXNNYW5pZmVzdCh0aGlzLCBgbWFuaWZlc3QtJHtpZH1gLCB7IGNsdXN0ZXI6IHRoaXMsIG1hbmlmZXN0IH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYSBIZWxtIGNoYXJ0IGluIHRoaXMgY2x1c3Rlci5cbiAgICpcbiAgICogQHBhcmFtIGlkIGxvZ2ljYWwgaWQgb2YgdGhpcyBjaGFydC5cbiAgICogQHBhcmFtIG9wdGlvbnMgb3B0aW9ucyBvZiB0aGlzIGNoYXJ0LlxuICAgKiBAcmV0dXJucyBhIGBIZWxtQ2hhcnRgIGNvbnN0cnVjdFxuICAgKi9cbiAgcHVibGljIGFkZEhlbG1DaGFydChpZDogc3RyaW5nLCBvcHRpb25zOiBIZWxtQ2hhcnRPcHRpb25zKTogSGVsbUNoYXJ0IHtcbiAgICByZXR1cm4gbmV3IEhlbG1DaGFydCh0aGlzLCBgY2hhcnQtJHtpZH1gLCB7IGNsdXN0ZXI6IHRoaXMsIC4uLm9wdGlvbnMgfSk7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lcyBhIENESzhzIGNoYXJ0IGluIHRoaXMgY2x1c3Rlci5cbiAgICpcbiAgICogQHBhcmFtIGlkIGxvZ2ljYWwgaWQgb2YgdGhpcyBjaGFydC5cbiAgICogQHBhcmFtIGNoYXJ0IHRoZSBjZGs4cyBjaGFydC5cbiAgICogQHJldHVybnMgYSBgS3ViZXJuZXRlc01hbmlmZXN0YCBjb25zdHJ1Y3QgcmVwcmVzZW50aW5nIHRoZSBjaGFydC5cbiAgICovXG4gIHB1YmxpYyBhZGRDZGs4c0NoYXJ0KGlkOiBzdHJpbmcsIGNoYXJ0OiBDb25zdHJ1Y3QsIG9wdGlvbnM6IEt1YmVybmV0ZXNNYW5pZmVzdE9wdGlvbnMgPSB7fSk6IEt1YmVybmV0ZXNNYW5pZmVzdCB7XG4gICAgY29uc3QgY2RrOHNDaGFydCA9IGNoYXJ0IGFzIGFueTtcblxuICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9jZGs4cy9ibG9iL21hc3Rlci9wYWNrYWdlcy9jZGs4cy9zcmMvY2hhcnQudHMjTDg0XG4gICAgaWYgKHR5cGVvZiBjZGs4c0NoYXJ0LnRvSnNvbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNkazhzIGNoYXJ0LiBNdXN0IGNvbnRhaW4gYSAndG9Kc29uJyBtZXRob2QsIGJ1dCBmb3VuZCAke3R5cGVvZiBjZGs4c0NoYXJ0LnRvSnNvbn1gKTtcbiAgICB9XG5cbiAgICBjb25zdCBtYW5pZmVzdCA9IG5ldyBLdWJlcm5ldGVzTWFuaWZlc3QodGhpcywgaWQsIHtcbiAgICAgIGNsdXN0ZXI6IHRoaXMsXG4gICAgICBtYW5pZmVzdDogY2RrOHNDaGFydC50b0pzb24oKSxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gbWFuaWZlc3Q7XG4gIH1cblxuICBwdWJsaWMgYWRkU2VydmljZUFjY291bnQoaWQ6IHN0cmluZywgb3B0aW9uczogU2VydmljZUFjY291bnRPcHRpb25zID0ge30pOiBTZXJ2aWNlQWNjb3VudCB7XG4gICAgcmV0dXJuIG5ldyBTZXJ2aWNlQWNjb3VudCh0aGlzLCBpZCwge1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIGNsdXN0ZXI6IHRoaXMsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ29ubmVjdCBjYXBhY2l0eSBpbiB0aGUgZm9ybSBvZiBhbiBleGlzdGluZyBBdXRvU2NhbGluZ0dyb3VwIHRvIHRoZSBFS1MgY2x1c3Rlci5cbiAgICpcbiAgICogVGhlIEF1dG9TY2FsaW5nR3JvdXAgbXVzdCBiZSBydW5uaW5nIGFuIEVLUy1vcHRpbWl6ZWQgQU1JIGNvbnRhaW5pbmcgdGhlXG4gICAqIC9ldGMvZWtzL2Jvb3RzdHJhcC5zaCBzY3JpcHQuIFRoaXMgbWV0aG9kIHdpbGwgY29uZmlndXJlIFNlY3VyaXR5IEdyb3VwcyxcbiAgICogYWRkIHRoZSByaWdodCBwb2xpY2llcyB0byB0aGUgaW5zdGFuY2Ugcm9sZSwgYXBwbHkgdGhlIHJpZ2h0IHRhZ3MsIGFuZCBhZGRcbiAgICogdGhlIHJlcXVpcmVkIHVzZXIgZGF0YSB0byB0aGUgaW5zdGFuY2UncyBsYXVuY2ggY29uZmlndXJhdGlvbi5cbiAgICpcbiAgICogUHJlZmVyIHRvIHVzZSBgYWRkQXV0b1NjYWxpbmdHcm91cENhcGFjaXR5YCBpZiBwb3NzaWJsZS5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZWtzL2xhdGVzdC91c2VyZ3VpZGUvbGF1bmNoLXdvcmtlcnMuaHRtbFxuICAgKiBAcGFyYW0gYXV0b1NjYWxpbmdHcm91cCBbZGlzYWJsZS1hd3NsaW50OnJlZi12aWEtaW50ZXJmYWNlXVxuICAgKiBAcGFyYW0gb3B0aW9ucyBvcHRpb25zIGZvciBhZGRpbmcgYXV0byBzY2FsaW5nIGdyb3VwcywgbGlrZSBjdXN0b21pemluZyB0aGUgYm9vdHN0cmFwIHNjcmlwdFxuICAgKi9cbiAgcHVibGljIGNvbm5lY3RBdXRvU2NhbGluZ0dyb3VwQ2FwYWNpdHkoYXV0b1NjYWxpbmdHcm91cDogYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cCwgb3B0aW9uczogQXV0b1NjYWxpbmdHcm91cE9wdGlvbnMpIHtcbiAgICAvLyBzZWxmIHJ1bGVzXG4gICAgYXV0b1NjYWxpbmdHcm91cC5jb25uZWN0aW9ucy5hbGxvd0ludGVybmFsbHkoZWMyLlBvcnQuYWxsVHJhZmZpYygpKTtcblxuICAgIC8vIENsdXN0ZXIgdG86bm9kZXMgcnVsZXNcbiAgICBhdXRvU2NhbGluZ0dyb3VwLmNvbm5lY3Rpb25zLmFsbG93RnJvbSh0aGlzLCBlYzIuUG9ydC50Y3AoNDQzKSk7XG4gICAgYXV0b1NjYWxpbmdHcm91cC5jb25uZWN0aW9ucy5hbGxvd0Zyb20odGhpcywgZWMyLlBvcnQudGNwUmFuZ2UoMTAyNSwgNjU1MzUpKTtcblxuICAgIC8vIEFsbG93IEhUVFBTIGZyb20gTm9kZXMgdG8gQ2x1c3RlclxuICAgIGF1dG9TY2FsaW5nR3JvdXAuY29ubmVjdGlvbnMuYWxsb3dUbyh0aGlzLCBlYzIuUG9ydC50Y3AoNDQzKSk7XG5cbiAgICAvLyBBbGxvdyBhbGwgbm9kZSBvdXRib3VuZCB0cmFmZmljXG4gICAgYXV0b1NjYWxpbmdHcm91cC5jb25uZWN0aW9ucy5hbGxvd1RvQW55SXB2NChlYzIuUG9ydC5hbGxUY3AoKSk7XG4gICAgYXV0b1NjYWxpbmdHcm91cC5jb25uZWN0aW9ucy5hbGxvd1RvQW55SXB2NChlYzIuUG9ydC5hbGxVZHAoKSk7XG4gICAgYXV0b1NjYWxpbmdHcm91cC5jb25uZWN0aW9ucy5hbGxvd1RvQW55SXB2NChlYzIuUG9ydC5hbGxJY21wKCkpO1xuXG4gICAgLy8gYWxsb3cgdHJhZmZpYyB0by9mcm9tIG1hbmFnZWQgbm9kZSBncm91cHMgKGVrcyBhdHRhY2hlcyB0aGlzIHNlY3VyaXR5IGdyb3VwIHRvIHRoZSBtYW5hZ2VkIG5vZGVzKVxuICAgIGF1dG9TY2FsaW5nR3JvdXAuYWRkU2VjdXJpdHlHcm91cCh0aGlzLmNsdXN0ZXJTZWN1cml0eUdyb3VwKTtcblxuICAgIGNvbnN0IGJvb3RzdHJhcEVuYWJsZWQgPSBvcHRpb25zLmJvb3RzdHJhcEVuYWJsZWQgPz8gdHJ1ZTtcbiAgICBpZiAob3B0aW9ucy5ib290c3RyYXBPcHRpb25zICYmICFib290c3RyYXBFbmFibGVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBzcGVjaWZ5IFwiYm9vdHN0cmFwT3B0aW9uc1wiIGlmIFwiYm9vdHN0cmFwRW5hYmxlZFwiIGlzIGZhbHNlJyk7XG4gICAgfVxuXG4gICAgaWYgKGJvb3RzdHJhcEVuYWJsZWQpIHtcbiAgICAgIGNvbnN0IHVzZXJEYXRhID0gb3B0aW9ucy5tYWNoaW5lSW1hZ2VUeXBlID09PSBNYWNoaW5lSW1hZ2VUeXBlLkJPVFRMRVJPQ0tFVCA/XG4gICAgICAgIHJlbmRlckJvdHRsZXJvY2tldFVzZXJEYXRhKHRoaXMpIDpcbiAgICAgICAgcmVuZGVyQW1hem9uTGludXhVc2VyRGF0YSh0aGlzLCBhdXRvU2NhbGluZ0dyb3VwLCBvcHRpb25zLmJvb3RzdHJhcE9wdGlvbnMpO1xuICAgICAgYXV0b1NjYWxpbmdHcm91cC5hZGRVc2VyRGF0YSguLi51c2VyRGF0YSk7XG4gICAgfVxuXG4gICAgYXV0b1NjYWxpbmdHcm91cC5yb2xlLmFkZE1hbmFnZWRQb2xpY3koaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdBbWF6b25FS1NXb3JrZXJOb2RlUG9saWN5JykpO1xuICAgIGF1dG9TY2FsaW5nR3JvdXAucm9sZS5hZGRNYW5hZ2VkUG9saWN5KGlhbS5NYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnQW1hem9uRUtTX0NOSV9Qb2xpY3knKSk7XG4gICAgYXV0b1NjYWxpbmdHcm91cC5yb2xlLmFkZE1hbmFnZWRQb2xpY3koaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdBbWF6b25FQzJDb250YWluZXJSZWdpc3RyeVJlYWRPbmx5JykpO1xuXG4gICAgLy8gRUtTIFJlcXVpcmVkIFRhZ3NcbiAgICAvLyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZWtzL2xhdGVzdC91c2VyZ3VpZGUvd29ya2VyLmh0bWxcbiAgICBUYWdzLm9mKGF1dG9TY2FsaW5nR3JvdXApLmFkZChga3ViZXJuZXRlcy5pby9jbHVzdGVyLyR7dGhpcy5jbHVzdGVyTmFtZX1gLCAnb3duZWQnLCB7XG4gICAgICBhcHBseVRvTGF1bmNoZWRJbnN0YW5jZXM6IHRydWUsXG4gICAgICAvLyBleGNsdWRlIHNlY3VyaXR5IGdyb3VwcyB0byBhdm9pZCBtdWx0aXBsZSBcIm93bmVkXCIgc2VjdXJpdHkgZ3JvdXBzLlxuICAgICAgLy8gKHRoZSBjbHVzdGVyIHNlY3VyaXR5IGdyb3VwIGFscmVhZHkgaGFzIHRoaXMgdGFnKVxuICAgICAgZXhjbHVkZVJlc291cmNlVHlwZXM6IFsnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXAnXSxcbiAgICB9KTtcblxuICAgIC8vIHNpbmNlIHdlIGFyZSBub3QgbWFwcGluZyB0aGUgaW5zdGFuY2Ugcm9sZSB0byBSQkFDLCBzeW50aGVzaXplIGFuXG4gICAgLy8gb3V0cHV0IHNvIGl0IGNhbiBiZSBwYXN0ZWQgaW50byBgYXdzLWF1dGgtY20ueWFtbGBcbiAgICBuZXcgQ2ZuT3V0cHV0KGF1dG9TY2FsaW5nR3JvdXAsICdJbnN0YW5jZVJvbGVBUk4nLCB7XG4gICAgICB2YWx1ZTogYXV0b1NjYWxpbmdHcm91cC5yb2xlLnJvbGVBcm4sXG4gICAgfSk7XG5cbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mIENsdXN0ZXIgJiYgdGhpcy5hbGJDb250cm9sbGVyKSB7XG4gICAgICAvLyB0aGUgY29udHJvbGxlciBydW5zIG9uIHRoZSB3b3JrZXIgbm9kZXMgc28gdGhleSBjYW5ub3RcbiAgICAgIC8vIGJlIGRlbGV0ZWQgYmVmb3JlIHRoZSBjb250cm9sbGVyLlxuICAgICAgTm9kZS5vZih0aGlzLmFsYkNvbnRyb2xsZXIpLmFkZERlcGVuZGVuY3koYXV0b1NjYWxpbmdHcm91cCk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgZmV0Y2hpbmcgYSBTZXJ2aWNlTG9hZEJhbGFuY2VyQWRkcmVzcy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTZXJ2aWNlTG9hZEJhbGFuY2VyQWRkcmVzc09wdGlvbnMge1xuXG4gIC8qKlxuICAgKiBUaW1lb3V0IGZvciB3YWl0aW5nIG9uIHRoZSBsb2FkIGJhbGFuY2VyIGFkZHJlc3MuXG4gICAqXG4gICAqIEBkZWZhdWx0IER1cmF0aW9uLm1pbnV0ZXMoNSlcbiAgICovXG4gIHJlYWRvbmx5IHRpbWVvdXQ/OiBEdXJhdGlvbjtcblxuICAvKipcbiAgICogVGhlIG5hbWVzcGFjZSB0aGUgc2VydmljZSBiZWxvbmdzIHRvLlxuICAgKlxuICAgKiBAZGVmYXVsdCAnZGVmYXVsdCdcbiAgICovXG4gIHJlYWRvbmx5IG5hbWVzcGFjZT86IHN0cmluZztcblxufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGZldGNoaW5nIGFuIEluZ3Jlc3NMb2FkQmFsYW5jZXJBZGRyZXNzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEluZ3Jlc3NMb2FkQmFsYW5jZXJBZGRyZXNzT3B0aW9ucyBleHRlbmRzIFNlcnZpY2VMb2FkQmFsYW5jZXJBZGRyZXNzT3B0aW9ucyB7fVxuXG4vKipcbiAqIEEgQ2x1c3RlciByZXByZXNlbnRzIGEgbWFuYWdlZCBLdWJlcm5ldGVzIFNlcnZpY2UgKEVLUylcbiAqXG4gKiBUaGlzIGlzIGEgZnVsbHkgbWFuYWdlZCBjbHVzdGVyIG9mIEFQSSBTZXJ2ZXJzIChjb250cm9sLXBsYW5lKVxuICogVGhlIHVzZXIgaXMgc3RpbGwgcmVxdWlyZWQgdG8gY3JlYXRlIHRoZSB3b3JrZXIgbm9kZXMuXG4gKiBAcmVzb3VyY2UgQVdTOjpFS1M6OkNsdXN0ZXJcbiAqL1xuQHByb3BlcnR5SW5qZWN0YWJsZVxuZXhwb3J0IGNsYXNzIENsdXN0ZXIgZXh0ZW5kcyBDbHVzdGVyQmFzZSB7XG4gIC8qKiBVbmlxdWVseSBpZGVudGlmaWVzIHRoaXMgY2xhc3MuICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUFJPUEVSVFlfSU5KRUNUSU9OX0lEOiBzdHJpbmcgPSAnQGF3cy1jZGsuYXdzLWVrcy12Mi1hbHBoYS5DbHVzdGVyJztcblxuICAvKipcbiAgICogSW1wb3J0IGFuIGV4aXN0aW5nIGNsdXN0ZXJcbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIHRoZSBjb25zdHJ1Y3Qgc2NvcGUsIGluIG1vc3QgY2FzZXMgJ3RoaXMnXG4gICAqIEBwYXJhbSBpZCB0aGUgaWQgb3IgbmFtZSB0byBpbXBvcnQgYXNcbiAgICogQHBhcmFtIGF0dHJzIHRoZSBjbHVzdGVyIHByb3BlcnRpZXMgdG8gdXNlIGZvciBpbXBvcnRpbmcgaW5mb3JtYXRpb25cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUNsdXN0ZXJBdHRyaWJ1dGVzKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGF0dHJzOiBDbHVzdGVyQXR0cmlidXRlcyk6IElDbHVzdGVyIHtcbiAgICByZXR1cm4gbmV3IEltcG9ydGVkQ2x1c3RlcihzY29wZSwgaWQsIGF0dHJzKTtcbiAgfVxuXG4gIHByaXZhdGUgYWNjZXNzRW50cmllczogTWFwPHN0cmluZywgSUFjY2Vzc0VudHJ5PiA9IG5ldyBNYXAoKTtcblxuICAvKipcbiAgICogVGhlIFZQQyBpbiB3aGljaCB0aGlzIENsdXN0ZXIgd2FzIGNyZWF0ZWRcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB2cGM6IGVjMi5JVnBjO1xuXG4gIC8qKlxuICAgKiBUaGUgTmFtZSBvZiB0aGUgY3JlYXRlZCBFS1MgQ2x1c3RlclxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNsdXN0ZXJOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBBV1MgZ2VuZXJhdGVkIEFSTiBmb3IgdGhlIENsdXN0ZXIgcmVzb3VyY2VcbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIGBhcm46YXdzOmVrczp1cy13ZXN0LTI6NjY2NjY2NjY2NjY2OmNsdXN0ZXIvcHJvZGBcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBjbHVzdGVyQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBlbmRwb2ludCBVUkwgZm9yIHRoZSBDbHVzdGVyXG4gICAqXG4gICAqIFRoaXMgaXMgdGhlIFVSTCBpbnNpZGUgdGhlIGt1YmVjb25maWcgZmlsZSB0byB1c2Ugd2l0aCBrdWJlY3RsXG4gICAqXG4gICAqIEZvciBleGFtcGxlLCBgaHR0cHM6Ly81RTFEMENFWEFNUExFQTU5MUI3NDZBRkM1QUIzMDI2Mi55bDQudXMtd2VzdC0yLmVrcy5hbWF6b25hd3MuY29tYFxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNsdXN0ZXJFbmRwb2ludDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgY2VydGlmaWNhdGUtYXV0aG9yaXR5LWRhdGEgZm9yIHlvdXIgY2x1c3Rlci5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBjbHVzdGVyQ2VydGlmaWNhdGVBdXRob3JpdHlEYXRhOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBpZCBvZiB0aGUgY2x1c3RlciBzZWN1cml0eSBncm91cCB0aGF0IHdhcyBjcmVhdGVkIGJ5IEFtYXpvbiBFS1MgZm9yIHRoZSBjbHVzdGVyLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNsdXN0ZXJTZWN1cml0eUdyb3VwSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGNsdXN0ZXIgc2VjdXJpdHkgZ3JvdXAgdGhhdCB3YXMgY3JlYXRlZCBieSBBbWF6b24gRUtTIGZvciB0aGUgY2x1c3Rlci5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBjbHVzdGVyU2VjdXJpdHlHcm91cDogZWMyLklTZWN1cml0eUdyb3VwO1xuXG4gIC8qKlxuICAgKiBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKSBvciBhbGlhcyBvZiB0aGUgY3VzdG9tZXIgbWFzdGVyIGtleSAoQ01LKS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBjbHVzdGVyRW5jcnlwdGlvbkNvbmZpZ0tleUFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBNYW5hZ2VzIGNvbm5lY3Rpb24gcnVsZXMgKFNlY3VyaXR5IEdyb3VwIFJ1bGVzKSBmb3IgdGhlIGNsdXN0ZXJcbiAgICpcbiAgICogQHR5cGUge2VjMi5Db25uZWN0aW9uc31cbiAgICogQG1lbWJlcm9mIENsdXN0ZXJcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBjb25uZWN0aW9uczogZWMyLkNvbm5lY3Rpb25zO1xuXG4gIC8qKlxuICAgKiBJQU0gcm9sZSBhc3N1bWVkIGJ5IHRoZSBFS1MgQ29udHJvbCBQbGFuZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHJvbGU6IGlhbS5JUm9sZTtcblxuICAvKipcbiAgICogVGhlIGF1dG8gc2NhbGluZyBncm91cCB0aGF0IGhvc3RzIHRoZSBkZWZhdWx0IGNhcGFjaXR5IGZvciB0aGlzIGNsdXN0ZXIuXG4gICAqIFRoaXMgd2lsbCBiZSBgdW5kZWZpbmVkYCBpZiB0aGUgYGRlZmF1bHRDYXBhY2l0eVR5cGVgIGlzIG5vdCBgRUMyYCBvclxuICAgKiBgZGVmYXVsdENhcGFjaXR5VHlwZWAgaXMgYEVDMmAgYnV0IGRlZmF1bHQgY2FwYWNpdHkgaXMgc2V0IHRvIDAuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZGVmYXVsdENhcGFjaXR5PzogYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cDtcblxuICAvKipcbiAgICogVGhlIG5vZGUgZ3JvdXAgdGhhdCBob3N0cyB0aGUgZGVmYXVsdCBjYXBhY2l0eSBmb3IgdGhpcyBjbHVzdGVyLlxuICAgKiBUaGlzIHdpbGwgYmUgYHVuZGVmaW5lZGAgaWYgdGhlIGBkZWZhdWx0Q2FwYWNpdHlUeXBlYCBpcyBgRUMyYCBvclxuICAgKiBgZGVmYXVsdENhcGFjaXR5VHlwZWAgaXMgYE5PREVHUk9VUGAgYnV0IGRlZmF1bHQgY2FwYWNpdHkgaXMgc2V0IHRvIDAuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZGVmYXVsdE5vZGVncm91cD86IE5vZGVncm91cDtcblxuICAvKipcbiAgICogU3BlY2lmeSB3aGljaCBJUCBmYW1pbHkgaXMgdXNlZCB0byBhc3NpZ24gS3ViZXJuZXRlcyBwb2QgYW5kIHNlcnZpY2UgSVAgYWRkcmVzc2VzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBJcEZhbWlseS5JUF9WNFxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9la3MvbGF0ZXN0L0FQSVJlZmVyZW5jZS9BUElfS3ViZXJuZXRlc05ldHdvcmtDb25maWdSZXF1ZXN0Lmh0bWwjQW1hem9uRUtTLVR5cGUtS3ViZXJuZXRlc05ldHdvcmtDb25maWdSZXF1ZXN0LWlwRmFtaWx5XG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgaXBGYW1pbHk/OiBJcEZhbWlseTtcblxuICAvKipcbiAgICogSWYgdGhlIGNsdXN0ZXIgaGFzIG9uZSAob3IgbW9yZSkgRmFyZ2F0ZVByb2ZpbGVzIGFzc29jaWF0ZWQsIHRoaXMgYXJyYXlcbiAgICogd2lsbCBob2xkIGEgcmVmZXJlbmNlIHRvIGVhY2guXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9mYXJnYXRlUHJvZmlsZXM6IEZhcmdhdGVQcm9maWxlW10gPSBbXTtcblxuICAvKipcbiAgICogYW4gT3BlbiBJRCBDb25uZWN0IFByb3ZpZGVyIGluc3RhbmNlXG4gICAqL1xuICBwcml2YXRlIF9vcGVuSWRDb25uZWN0UHJvdmlkZXI/OiBpYW0uSU9wZW5JZENvbm5lY3RQcm92aWRlcjtcblxuICAvKipcbiAgICogYW4gRUtTIFBvZCBJZGVudGl0eSBBZ2VudCBpbnN0YW5jZVxuICAgKi9cbiAgcHJpdmF0ZSBfZWtzUG9kSWRlbnRpdHlBZ2VudD86IElBZGRvbjtcblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiBLdWJlcm5ldGVzIHJlc291cmNlcyBjYW4gYmUgcHJ1bmVkIGF1dG9tYXRpY2FsbHkuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcHJ1bmU6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBBTEIgQ29udHJvbGxlciBjb25zdHJ1Y3QgZGVmaW5lZCBmb3IgdGhpcyBjbHVzdGVyLlxuICAgKiBXaWxsIGJlIHVuZGVmaW5lZCBpZiBgYWxiQ29udHJvbGxlcmAgd2Fzbid0IGNvbmZpZ3VyZWQuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgYWxiQ29udHJvbGxlcj86IEFsYkNvbnRyb2xsZXI7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBfY2x1c3RlclJlc291cmNlOiBDZm5DbHVzdGVyO1xuXG4gIHByaXZhdGUgX25ldXJvbkRldmljZVBsdWdpbj86IEt1YmVybmV0ZXNNYW5pZmVzdDtcblxuICBwcml2YXRlIHJlYWRvbmx5IGVuZHBvaW50QWNjZXNzOiBFbmRwb2ludEFjY2VzcztcblxuICBwcml2YXRlIHJlYWRvbmx5IHZwY1N1Ym5ldHM6IGVjMi5TdWJuZXRTZWxlY3Rpb25bXTtcblxuICBwcml2YXRlIHJlYWRvbmx5IHZlcnNpb246IEt1YmVybmV0ZXNWZXJzaW9uO1xuXG4gIC8vIFRPRE86IHJldmlzaXQgbG9nZ2luZyBmb3JtYXRcbiAgcHJpdmF0ZSByZWFkb25seSBsb2dnaW5nPzogeyBba2V5OiBzdHJpbmddOiB7IFtrZXk6c3RyaW5nXTogYW55fSB9O1xuXG4gIC8qKlxuICAgKiBBIGR1bW15IENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHRoYXQgaXMgdXNlZCBhcyBhIHdhaXQgYmFycmllciB3aGljaFxuICAgKiByZXByZXNlbnRzIHRoYXQgdGhlIGNsdXN0ZXIgaXMgcmVhZHkgdG8gcmVjZWl2ZSBcImt1YmVjdGxcIiBjb21tYW5kcy5cbiAgICpcbiAgICogU3BlY2lmaWNhbGx5LCBhbGwgZmFyZ2F0ZSBwcm9maWxlcyBhcmUgYXV0b21hdGljYWxseSBhZGRlZCBhcyBhIGRlcGVuZGVuY3lcbiAgICogb2YgdGhpcyBiYXJyaWVyLCB3aGljaCBtZWFucyB0aGF0IGl0IHdpbGwgb25seSBiZSBcInNpZ25hbGVkXCIgd2hlbiBhbGxcbiAgICogZmFyZ2F0ZSBwcm9maWxlcyBoYXZlIGJlZW4gc3VjY2Vzc2Z1bGx5IGNyZWF0ZWQuXG4gICAqXG4gICAqIFdoZW4ga3ViZWN0bCByZXNvdXJjZXMgY2FsbCBgX2F0dGFjaEt1YmVjdGxSZXNvdXJjZVNjb3BlKClgLCB0aGlzIHJlc291cmNlXG4gICAqIGlzIGFkZGVkIGFzIHRoZWlyIGRlcGVuZGVuY3kgd2hpY2ggaW1wbGllcyB0aGF0IHRoZXkgY2FuIG9ubHkgYmUgZGVwbG95ZWRcbiAgICogYWZ0ZXIgdGhlIGNsdXN0ZXIgaXMgcmVhZHkuXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9rdWJlY3RsUmVhZHlCYXJyaWVyOiBDZm5SZXNvdXJjZTtcblxuICBwcml2YXRlIHJlYWRvbmx5IF9rdWJlY3RsUHJvdmlkZXJPcHRpb25zPzogS3ViZWN0bFByb3ZpZGVyT3B0aW9ucztcblxuICBwcml2YXRlIHJlYWRvbmx5IF9rdWJlY3RsUHJvdmlkZXI/OiBJS3ViZWN0bFByb3ZpZGVyO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgX2NsdXN0ZXJBZG1pbkFjY2Vzcz86IEFjY2Vzc0VudHJ5O1xuXG4gIC8qKlxuICAgKiBJbml0aWF0ZXMgYW4gRUtTIENsdXN0ZXIgd2l0aCB0aGUgc3VwcGxpZWQgYXJndW1lbnRzXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSBhIENvbnN0cnVjdCwgbW9zdCBsaWtlbHkgYSBjZGsuU3RhY2sgY3JlYXRlZFxuICAgKiBAcGFyYW0gaWQgdGhlIGlkIG9mIHRoZSBDb25zdHJ1Y3QgdG8gY3JlYXRlXG4gICAqIEBwYXJhbSBwcm9wcyBwcm9wZXJ0aWVzIGluIHRoZSBJQ2x1c3RlclByb3BzIGludGVyZmFjZVxuICAgKi9cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENsdXN0ZXJQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgcGh5c2ljYWxOYW1lOiBwcm9wcy5jbHVzdGVyTmFtZSxcbiAgICB9KTtcbiAgICAvLyBFbmhhbmNlZCBDREsgQW5hbHl0aWNzIFRlbGVtZXRyeVxuICAgIGFkZENvbnN0cnVjdE1ldGFkYXRhKHRoaXMsIHByb3BzKTtcblxuICAgIHRoaXMucHJ1bmUgPSBwcm9wcy5wcnVuZSA/PyB0cnVlO1xuICAgIHRoaXMudnBjID0gcHJvcHMudnBjIHx8IG5ldyBlYzIuVnBjKHRoaXMsICdEZWZhdWx0VnBjJyk7XG4gICAgdGhpcy52ZXJzaW9uID0gcHJvcHMudmVyc2lvbjtcblxuICAgIHRoaXMuX2t1YmVjdGxQcm92aWRlck9wdGlvbnMgPSBwcm9wcy5rdWJlY3RsUHJvdmlkZXJPcHRpb25zO1xuXG4gICAgdGhpcy50YWdTdWJuZXRzKCk7XG5cbiAgICAvLyB0aGlzIGlzIHRoZSByb2xlIHVzZWQgYnkgRUtTIHdoZW4gaW50ZXJhY3Rpbmcgd2l0aCBBV1MgcmVzb3VyY2VzXG4gICAgdGhpcy5yb2xlID0gcHJvcHMucm9sZSB8fCBuZXcgaWFtLlJvbGUodGhpcywgJ1JvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnZWtzLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgIG1hbmFnZWRQb2xpY2llczogW1xuICAgICAgICBpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ0FtYXpvbkVLU0NsdXN0ZXJQb2xpY3knKSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICAvLyB2YWxpZGF0ZSBhbGwgYXV0b21vZGUgcmVsZXZhbnQgY29uZmlndXJhdGlvbnNcbiAgICBjb25zdCBhdXRvTW9kZUVuYWJsZWQgPSB0aGlzLmlzVmFsaWRBdXRvTW9kZUNvbmZpZyhwcm9wcyk7XG5cbiAgICBpZiAoYXV0b01vZGVFbmFibGVkKSB7XG4gICAgICAvLyBhdHRhY2ggcmVxdWlyZWQgbWFuYWdlZCBwb2xpY3kgZm9yIHRoZSBjbHVzdGVyIHJvbGUgaW4gRUtTIEF1dG8gTW9kZVxuICAgICAgLy8gc2VlIC0gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Vrcy9sYXRlc3QvdXNlcmd1aWRlL2F1dG8tY2x1c3Rlci1pYW0tcm9sZS5odG1sXG4gICAgICBbJ0FtYXpvbkVLU0NvbXB1dGVQb2xpY3knLFxuICAgICAgICAnQW1hem9uRUtTQmxvY2tTdG9yYWdlUG9saWN5JyxcbiAgICAgICAgJ0FtYXpvbkVLU0xvYWRCYWxhbmNpbmdQb2xpY3knLFxuICAgICAgICAnQW1hem9uRUtTTmV0d29ya2luZ1BvbGljeSddLmZvckVhY2goKHBvbGljeU5hbWUpID0+IHtcbiAgICAgICAgdGhpcy5yb2xlLmFkZE1hbmFnZWRQb2xpY3koaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKHBvbGljeU5hbWUpKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBzdHM6VGFnU2Vzc2lvbiBpcyByZXF1aXJlZCBmb3IgRUtTIEF1dG8gTW9kZSBvciB3aGVuIHVzaW5nIEVLUyBQb2QgSWRlbnRpdHkgZmVhdHVyZXMuXG4gICAgICAvLyBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Vrcy9sYXRlc3QvdXNlcmd1aWRlL3BvZC1pZC1yb2xlLmh0bWxcbiAgICAgIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9la3MvbGF0ZXN0L3VzZXJndWlkZS9hdXRvbW9kZS1nZXQtc3RhcnRlZC1jbGkuaHRtbCNfY3JlYXRlX2FuX2Vrc19hdXRvX21vZGVfY2x1c3Rlcl9pYW1fcm9sZVxuICAgICAgaWYgKHRoaXMucm9sZSBpbnN0YW5jZW9mIGlhbS5Sb2xlKSB7XG4gICAgICAgIHRoaXMucm9sZS5hc3N1bWVSb2xlUG9saWN5Py5hZGRTdGF0ZW1lbnRzKFxuICAgICAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgICAgICAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2Vrcy5hbWF6b25hd3MuY29tJyldLFxuICAgICAgICAgICAgYWN0aW9uczogWydzdHM6VGFnU2Vzc2lvbiddLFxuICAgICAgICAgIH0pLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHNlY3VyaXR5R3JvdXAgPSBwcm9wcy5zZWN1cml0eUdyb3VwIHx8IG5ldyBlYzIuU2VjdXJpdHlHcm91cCh0aGlzLCAnQ29udHJvbFBsYW5lU2VjdXJpdHlHcm91cCcsIHtcbiAgICAgIHZwYzogdGhpcy52cGMsXG4gICAgICBkZXNjcmlwdGlvbjogJ0VLUyBDb250cm9sIFBsYW5lIFNlY3VyaXR5IEdyb3VwJyxcbiAgICB9KTtcblxuICAgIHRoaXMudnBjU3VibmV0cyA9IHByb3BzLnZwY1N1Ym5ldHMgPz8gW3sgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFVCTElDIH0sIHsgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUyB9XTtcblxuICAgIGNvbnN0IHNlbGVjdGVkU3VibmV0SWRzUGVyR3JvdXAgPSB0aGlzLnZwY1N1Ym5ldHMubWFwKHMgPT4gdGhpcy52cGMuc2VsZWN0U3VibmV0cyhzKS5zdWJuZXRJZHMpO1xuICAgIGlmIChzZWxlY3RlZFN1Ym5ldElkc1Blckdyb3VwLnNvbWUoVG9rZW4uaXNVbnJlc29sdmVkKSAmJiBzZWxlY3RlZFN1Ym5ldElkc1Blckdyb3VwLmxlbmd0aCA+IDEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignZWtzLkNsdXN0ZXI6IGNhbm5vdCBzZWxlY3QgbXVsdGlwbGUgc3VibmV0IGdyb3VwcyBmcm9tIGEgVlBDIGltcG9ydGVkIGZyb20gbGlzdCB0b2tlbnMgd2l0aCB1bmtub3duIGxlbmd0aC4gU2VsZWN0IG9ubHkgb25lIHN1Ym5ldCBncm91cCwgcGFzcyBhIGxlbmd0aCB0byBGbi5zcGxpdCwgb3Igc3dpdGNoIHRvIFZwYy5mcm9tTG9va3VwLicpO1xuICAgIH1cblxuICAgIC8vIEdldCBzdWJuZXRJZHMgZm9yIGFsbCBzZWxlY3RlZCBzdWJuZXRzXG4gICAgY29uc3Qgc3VibmV0SWRzID0gQXJyYXkuZnJvbShuZXcgU2V0KGZsYXR0ZW4oc2VsZWN0ZWRTdWJuZXRJZHNQZXJHcm91cCkpKTtcblxuICAgIHRoaXMubG9nZ2luZyA9IHByb3BzLmNsdXN0ZXJMb2dnaW5nID8ge1xuICAgICAgY2x1c3RlckxvZ2dpbmc6IHtcbiAgICAgICAgZW5hYmxlZFR5cGVzOiBwcm9wcy5jbHVzdGVyTG9nZ2luZy5tYXAoKHR5cGUpID0+ICh7IHR5cGUgfSkpLFxuICAgICAgfSxcbiAgICB9IDogdW5kZWZpbmVkO1xuXG4gICAgdGhpcy5lbmRwb2ludEFjY2VzcyA9IHByb3BzLmVuZHBvaW50QWNjZXNzID8/IEVuZHBvaW50QWNjZXNzLlBVQkxJQ19BTkRfUFJJVkFURTtcbiAgICB0aGlzLmlwRmFtaWx5ID0gcHJvcHMuaXBGYW1pbHkgPz8gSXBGYW1pbHkuSVBfVjQ7XG5cbiAgICBjb25zdCBwcml2YXRlU3VibmV0cyA9IHRoaXMuc2VsZWN0UHJpdmF0ZVN1Ym5ldHMoKS5zbGljZSgwLCAxNik7XG4gICAgY29uc3QgcHVibGljQWNjZXNzRGlzYWJsZWQgPSAhdGhpcy5lbmRwb2ludEFjY2Vzcy5fY29uZmlnLnB1YmxpY0FjY2VzcztcbiAgICBjb25zdCBwdWJsaWNBY2Nlc3NSZXN0cmljdGVkID0gIXB1YmxpY0FjY2Vzc0Rpc2FibGVkXG4gICAgICAmJiB0aGlzLmVuZHBvaW50QWNjZXNzLl9jb25maWcucHVibGljQ2lkcnNcbiAgICAgICYmIHRoaXMuZW5kcG9pbnRBY2Nlc3MuX2NvbmZpZy5wdWJsaWNDaWRycy5sZW5ndGggIT09IDA7XG5cbiAgICAvLyB2YWxpZGF0ZSBlbmRwb2ludCBhY2Nlc3MgY29uZmlndXJhdGlvblxuXG4gICAgaWYgKHByaXZhdGVTdWJuZXRzLmxlbmd0aCA9PT0gMCAmJiBwdWJsaWNBY2Nlc3NEaXNhYmxlZCkge1xuICAgICAgLy8gbm8gcHJpdmF0ZSBzdWJuZXRzIGFuZCBubyBwdWJsaWMgYWNjZXNzIGF0IGFsbCwgbm8gZ29vZC5cbiAgICAgIHRocm93IG5ldyBFcnJvcignVnBjIG11c3QgY29udGFpbiBwcml2YXRlIHN1Ym5ldHMgd2hlbiBwdWJsaWMgZW5kcG9pbnQgYWNjZXNzIGlzIGRpc2FibGVkJyk7XG4gICAgfVxuXG4gICAgaWYgKHByaXZhdGVTdWJuZXRzLmxlbmd0aCA9PT0gMCAmJiBwdWJsaWNBY2Nlc3NSZXN0cmljdGVkKSB7XG4gICAgICAvLyBubyBwcml2YXRlIHN1Ym5ldHMgYW5kIHB1YmxpYyBhY2Nlc3MgaXMgcmVzdHJpY3RlZCwgbm8gZ29vZC5cbiAgICAgIHRocm93IG5ldyBFcnJvcignVnBjIG11c3QgY29udGFpbiBwcml2YXRlIHN1Ym5ldHMgd2hlbiBwdWJsaWMgZW5kcG9pbnQgYWNjZXNzIGlzIHJlc3RyaWN0ZWQnKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMuc2VydmljZUlwdjRDaWRyICYmIHByb3BzLmlwRmFtaWx5ID09IElwRmFtaWx5LklQX1Y2KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBzcGVjaWZ5IHNlcnZpY2VJcHY0Q2lkciB3aXRoIGlwRmFtaWx5IGVxdWFsIHRvIElwRmFtaWx5LklQX1Y2Jyk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzb3VyY2UgPSB0aGlzLl9jbHVzdGVyUmVzb3VyY2UgPSBuZXcgQ2ZuQ2x1c3Rlcih0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBuYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgIHJvbGVBcm46IHRoaXMucm9sZS5yb2xlQXJuLFxuICAgICAgdmVyc2lvbjogcHJvcHMudmVyc2lvbi52ZXJzaW9uLFxuICAgICAgYWNjZXNzQ29uZmlnOiB7XG4gICAgICAgIGF1dGhlbnRpY2F0aW9uTW9kZTogJ0FQSScsXG4gICAgICAgIGJvb3RzdHJhcENsdXN0ZXJDcmVhdG9yQWRtaW5QZXJtaXNzaW9uczogcHJvcHMuYm9vdHN0cmFwQ2x1c3RlckNyZWF0b3JBZG1pblBlcm1pc3Npb25zLFxuICAgICAgfSxcbiAgICAgIGNvbXB1dGVDb25maWc6IHtcbiAgICAgICAgZW5hYmxlZDogYXV0b01vZGVFbmFibGVkLFxuICAgICAgICAvLyBJZiB0aGUgY29tcHV0ZUNvbmZpZyBlbmFibGVkIGZsYWcgaXMgc2V0IHRvIGZhbHNlIHdoZW4gY3JlYXRpbmcgYSBjbHVzdGVyIHdpdGggQXV0byBNb2RlLFxuICAgICAgICAvLyB0aGUgcmVxdWVzdCBtdXN0IG5vdCBpbmNsdWRlIHZhbHVlcyBmb3IgdGhlIG5vZGVSb2xlQXJuIG9yIG5vZGVQb29scyBmaWVsZHMuXG4gICAgICAgIC8vIEFsc28sIGlmIG5vZGVQb29scyBpcyBlbXB0eSwgbm9kZVJvbGVBcm4gc2hvdWxkIG5vdCBiZSBpbmNsdWRlZCB0byBwcmV2ZW50IGRlcGxveW1lbnQgZmFpbHVyZXNcbiAgICAgICAgbm9kZVBvb2xzOiAhYXV0b01vZGVFbmFibGVkID8gdW5kZWZpbmVkIDogcHJvcHMuY29tcHV0ZT8ubm9kZVBvb2xzID8/IFsnc3lzdGVtJywgJ2dlbmVyYWwtcHVycG9zZSddLFxuICAgICAgICBub2RlUm9sZUFybjogIWF1dG9Nb2RlRW5hYmxlZCB8fCAocHJvcHMuY29tcHV0ZT8ubm9kZVBvb2xzICYmIHByb3BzLmNvbXB1dGUubm9kZVBvb2xzLmxlbmd0aCA9PT0gMCkgP1xuICAgICAgICAgIHVuZGVmaW5lZCA6XG4gICAgICAgICAgcHJvcHMuY29tcHV0ZT8ubm9kZVJvbGU/LnJvbGVBcm4gPz8gdGhpcy5hZGROb2RlUG9vbFJvbGUoYCR7aWR9bm9kZVBvb2xSb2xlYCkucm9sZUFybixcbiAgICAgIH0sXG4gICAgICBzdG9yYWdlQ29uZmlnOiB7XG4gICAgICAgIGJsb2NrU3RvcmFnZToge1xuICAgICAgICAgIGVuYWJsZWQ6IGF1dG9Nb2RlRW5hYmxlZCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBrdWJlcm5ldGVzTmV0d29ya0NvbmZpZzoge1xuICAgICAgICBpcEZhbWlseTogdGhpcy5pcEZhbWlseSxcbiAgICAgICAgc2VydmljZUlwdjRDaWRyOiBwcm9wcy5zZXJ2aWNlSXB2NENpZHIsXG4gICAgICAgIGVsYXN0aWNMb2FkQmFsYW5jaW5nOiB7XG4gICAgICAgICAgZW5hYmxlZDogYXV0b01vZGVFbmFibGVkLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHJlc291cmNlc1ZwY0NvbmZpZzoge1xuICAgICAgICBzZWN1cml0eUdyb3VwSWRzOiBbc2VjdXJpdHlHcm91cC5zZWN1cml0eUdyb3VwSWRdLFxuICAgICAgICBzdWJuZXRJZHMsXG4gICAgICAgIGVuZHBvaW50UHJpdmF0ZUFjY2VzczogdGhpcy5lbmRwb2ludEFjY2Vzcy5fY29uZmlnLnByaXZhdGVBY2Nlc3MsXG4gICAgICAgIGVuZHBvaW50UHVibGljQWNjZXNzOiB0aGlzLmVuZHBvaW50QWNjZXNzLl9jb25maWcucHVibGljQWNjZXNzLFxuICAgICAgICBwdWJsaWNBY2Nlc3NDaWRyczogdGhpcy5lbmRwb2ludEFjY2Vzcy5fY29uZmlnLnB1YmxpY0NpZHJzLFxuICAgICAgfSxcbiAgICAgIC4uLihwcm9wcy5zZWNyZXRzRW5jcnlwdGlvbktleSA/IHtcbiAgICAgICAgZW5jcnlwdGlvbkNvbmZpZzogW3tcbiAgICAgICAgICBwcm92aWRlcjoge1xuICAgICAgICAgICAga2V5QXJuOiBwcm9wcy5zZWNyZXRzRW5jcnlwdGlvbktleS5rZXlSZWYua2V5QXJuLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVzb3VyY2VzOiBbJ3NlY3JldHMnXSxcbiAgICAgICAgfV0sXG4gICAgICB9IDoge30pLFxuICAgICAgdGFnczogT2JqZWN0LmtleXMocHJvcHMudGFncyA/PyB7fSkubWFwKGsgPT4gKHsga2V5OiBrLCB2YWx1ZTogcHJvcHMudGFncyFba10gfSkpLFxuICAgICAgbG9nZ2luZzogdGhpcy5sb2dnaW5nLFxuICAgIH0pO1xuXG4gICAgbGV0IGt1YmVjdGxTdWJuZXRzID0gdGhpcy5fa3ViZWN0bFByb3ZpZGVyT3B0aW9ucz8ucHJpdmF0ZVN1Ym5ldHM7XG5cbiAgICBpZiAodGhpcy5lbmRwb2ludEFjY2Vzcy5fY29uZmlnLnByaXZhdGVBY2Nlc3MgJiYgcHJpdmF0ZVN1Ym5ldHMubGVuZ3RoICE9PSAwKSB7XG4gICAgICAvLyB3aGVuIHByaXZhdGUgYWNjZXNzIGlzIGVuYWJsZWQgYW5kIHRoZSB2cGMgaGFzIHByaXZhdGUgc3VibmV0cywgbGV0cyBjb25uZWN0XG4gICAgICAvLyB0aGUgcHJvdmlkZXIgdG8gdGhlIHZwYyBzbyB0aGF0IGl0IHdpbGwgd29yayBldmVuIHdoZW4gcmVzdHJpY3RpbmcgcHVibGljIGFjY2Vzcy5cblxuICAgICAgLy8gdmFsaWRhdGUgVlBDIHByb3BlcnRpZXMgYWNjb3JkaW5nIHRvOiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZWtzL2xhdGVzdC91c2VyZ3VpZGUvY2x1c3Rlci1lbmRwb2ludC5odG1sXG4gICAgICBpZiAodGhpcy52cGMgaW5zdGFuY2VvZiBlYzIuVnBjICYmICEodGhpcy52cGMuZG5zSG9zdG5hbWVzRW5hYmxlZCAmJiB0aGlzLnZwYy5kbnNTdXBwb3J0RW5hYmxlZCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcml2YXRlIGVuZHBvaW50IGFjY2VzcyByZXF1aXJlcyB0aGUgVlBDIHRvIGhhdmUgRE5TIHN1cHBvcnQgYW5kIEROUyBob3N0bmFtZXMgZW5hYmxlZC4gVXNlIGBlbmFibGVEbnNIb3N0bmFtZXM6IHRydWVgIGFuZCBgZW5hYmxlRG5zU3VwcG9ydDogdHJ1ZWAgd2hlbiBjcmVhdGluZyB0aGUgVlBDLicpO1xuICAgICAgfVxuXG4gICAgICBrdWJlY3RsU3VibmV0cyA9IHByaXZhdGVTdWJuZXRzO1xuXG4gICAgICAvLyB0aGUgdnBjIG11c3QgZXhpc3QgaW4gb3JkZXIgdG8gcHJvcGVybHkgZGVsZXRlIHRoZSBjbHVzdGVyIChzaW5jZSB3ZSBydW4gYGt1YmVjdGwgZGVsZXRlYCkuXG4gICAgICAvLyB0aGlzIGVuc3VyZXMgdGhhdC5cbiAgICAgIHRoaXMuX2NsdXN0ZXJSZXNvdXJjZS5ub2RlLmFkZERlcGVuZGVuY3kodGhpcy52cGMpO1xuICAgIH1cblxuICAgIC8vIHdlIHVzZSBhbiBTU00gcGFyYW1ldGVyIGFzIGEgYmFycmllciBiZWNhdXNlIGl0J3MgZnJlZSBhbmQgZmFzdC5cbiAgICB0aGlzLl9rdWJlY3RsUmVhZHlCYXJyaWVyID0gbmV3IENmblJlc291cmNlKHRoaXMsICdLdWJlY3RsUmVhZHlCYXJyaWVyJywge1xuICAgICAgdHlwZTogJ0FXUzo6U1NNOjpQYXJhbWV0ZXInLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBUeXBlOiAnU3RyaW5nJyxcbiAgICAgICAgVmFsdWU6ICdhd3M6Y2RrOmVrczprdWJlY3RsLXJlYWR5JyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBhZGQgdGhlIGNsdXN0ZXIgcmVzb3VyY2UgaXRzZWxmIGFzIGEgZGVwZW5kZW5jeSBvZiB0aGUgYmFycmllclxuICAgIHRoaXMuX2t1YmVjdGxSZWFkeUJhcnJpZXIubm9kZS5hZGREZXBlbmRlbmN5KHRoaXMuX2NsdXN0ZXJSZXNvdXJjZSk7XG5cbiAgICB0aGlzLmNsdXN0ZXJOYW1lID0gdGhpcy5nZXRSZXNvdXJjZU5hbWVBdHRyaWJ1dGUocmVzb3VyY2UucmVmKTtcbiAgICB0aGlzLmNsdXN0ZXJBcm4gPSB0aGlzLmdldFJlc291cmNlQXJuQXR0cmlidXRlKHJlc291cmNlLmF0dHJBcm4sIGNsdXN0ZXJBcm5Db21wb25lbnRzKHRoaXMucGh5c2ljYWxOYW1lKSk7XG5cbiAgICB0aGlzLmNsdXN0ZXJFbmRwb2ludCA9IHJlc291cmNlLmF0dHJFbmRwb2ludDtcbiAgICB0aGlzLmNsdXN0ZXJDZXJ0aWZpY2F0ZUF1dGhvcml0eURhdGEgPSByZXNvdXJjZS5hdHRyQ2VydGlmaWNhdGVBdXRob3JpdHlEYXRhO1xuICAgIHRoaXMuY2x1c3RlclNlY3VyaXR5R3JvdXBJZCA9IHJlc291cmNlLmF0dHJDbHVzdGVyU2VjdXJpdHlHcm91cElkO1xuICAgIHRoaXMuY2x1c3RlckVuY3J5cHRpb25Db25maWdLZXlBcm4gPSByZXNvdXJjZS5hdHRyRW5jcnlwdGlvbkNvbmZpZ0tleUFybjtcblxuICAgIHRoaXMuY2x1c3RlclNlY3VyaXR5R3JvdXAgPSBlYzIuU2VjdXJpdHlHcm91cC5mcm9tU2VjdXJpdHlHcm91cElkKHRoaXMsICdDbHVzdGVyU2VjdXJpdHlHcm91cCcsIHRoaXMuY2x1c3RlclNlY3VyaXR5R3JvdXBJZCk7XG5cbiAgICB0aGlzLmNvbm5lY3Rpb25zID0gbmV3IGVjMi5Db25uZWN0aW9ucyh7XG4gICAgICBzZWN1cml0eUdyb3VwczogW3RoaXMuY2x1c3RlclNlY3VyaXR5R3JvdXAsIHNlY3VyaXR5R3JvdXBdLFxuICAgICAgZGVmYXVsdFBvcnQ6IGVjMi5Qb3J0LnRjcCg0NDMpLCAvLyBDb250cm9sIFBsYW5lIGhhcyBhbiBIVFRQUyBBUElcbiAgICB9KTtcblxuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2YodGhpcyk7XG4gICAgY29uc3QgdXBkYXRlQ29uZmlnQ29tbWFuZFByZWZpeCA9IGBhd3MgZWtzIHVwZGF0ZS1rdWJlY29uZmlnIC0tbmFtZSAke3RoaXMuY2x1c3Rlck5hbWV9YDtcbiAgICBjb25zdCBnZXRUb2tlbkNvbW1hbmRQcmVmaXggPSBgYXdzIGVrcyBnZXQtdG9rZW4gLS1jbHVzdGVyLW5hbWUgJHt0aGlzLmNsdXN0ZXJOYW1lfWA7XG4gICAgY29uc3QgY29tbW9uQ29tbWFuZE9wdGlvbnMgPSBbYC0tcmVnaW9uICR7c3RhY2sucmVnaW9ufWBdO1xuXG4gICAgaWYgKHByb3BzLmt1YmVjdGxQcm92aWRlck9wdGlvbnMpIHtcbiAgICAgIHRoaXMuX2t1YmVjdGxQcm92aWRlciA9IG5ldyBLdWJlY3RsUHJvdmlkZXIodGhpcywgJ0t1YmVjdGxQcm92aWRlcicsIHtcbiAgICAgICAgY2x1c3RlcjogdGhpcyxcbiAgICAgICAgcm9sZTogdGhpcy5fa3ViZWN0bFByb3ZpZGVyT3B0aW9ucz8ucm9sZSxcbiAgICAgICAgYXdzY2xpTGF5ZXI6IHRoaXMuX2t1YmVjdGxQcm92aWRlck9wdGlvbnM/LmF3c2NsaUxheWVyLFxuICAgICAgICBrdWJlY3RsTGF5ZXI6IHRoaXMuX2t1YmVjdGxQcm92aWRlck9wdGlvbnMhLmt1YmVjdGxMYXllcixcbiAgICAgICAgZW52aXJvbm1lbnQ6IHRoaXMuX2t1YmVjdGxQcm92aWRlck9wdGlvbnM/LmVudmlyb25tZW50LFxuICAgICAgICBtZW1vcnk6IHRoaXMuX2t1YmVjdGxQcm92aWRlck9wdGlvbnM/Lm1lbW9yeSxcbiAgICAgICAgcHJpdmF0ZVN1Ym5ldHM6IGt1YmVjdGxTdWJuZXRzLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIGdpdmUgdGhlIGhhbmRsZXIgcm9sZSBhZG1pbiBhY2Nlc3MgdG8gdGhlIGNsdXN0ZXJcbiAgICAgIC8vIHNvIGl0IGNhbiBkZXBsb3kvcXVlcnkgYW55IHJlc291cmNlLlxuICAgICAgdGhpcy5fY2x1c3RlckFkbWluQWNjZXNzID0gdGhpcy5ncmFudENsdXN0ZXJBZG1pbignQ2x1c3RlckFkbWluUm9sZUFjY2VzcycsIHRoaXMuX2t1YmVjdGxQcm92aWRlcj8ucm9sZSEucm9sZUFybik7XG4gICAgfVxuXG4gICAgLy8gZG8gbm90IGNyZWF0ZSBhIG1hc3RlcnMgcm9sZSBpZiBvbmUgaXMgbm90IHByb3ZpZGVkLiBUcnVzdGluZyB0aGUgYWNjb3VudFJvb3RQcmluY2lwYWwoKSBpcyB0b28gcGVybWlzc2l2ZS5cbiAgICBpZiAocHJvcHMubWFzdGVyc1JvbGUpIHtcbiAgICAgIGNvbnN0IG1hc3RlcnNSb2xlID0gcHJvcHMubWFzdGVyc1JvbGU7XG4gICAgICB0aGlzLmdyYW50QWNjZXNzKCdtYXN0ZXJzUm9sZUFjY2VzcycsIHByb3BzLm1hc3RlcnNSb2xlLnJvbGVBcm4sIFtcbiAgICAgICAgQWNjZXNzUG9saWN5LmZyb21BY2Nlc3NQb2xpY3lOYW1lKCdBbWF6b25FS1NDbHVzdGVyQWRtaW5Qb2xpY3knLCB7XG4gICAgICAgICAgYWNjZXNzU2NvcGVUeXBlOiBBY2Nlc3NTY29wZVR5cGUuQ0xVU1RFUixcbiAgICAgICAgfSksXG4gICAgICBdKTtcblxuICAgICAgY29tbW9uQ29tbWFuZE9wdGlvbnMucHVzaChgLS1yb2xlLWFybiAke21hc3RlcnNSb2xlLnJvbGVBcm59YCk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmFsYkNvbnRyb2xsZXIpIHtcbiAgICAgIHRoaXMuYWxiQ29udHJvbGxlciA9IEFsYkNvbnRyb2xsZXIuY3JlYXRlKHRoaXMsIHsgLi4ucHJvcHMuYWxiQ29udHJvbGxlciwgY2x1c3RlcjogdGhpcyB9KTtcbiAgICB9XG5cbiAgICAvLyBpZiBhbnkgb2YgZGVmYXVsdENhcGFjaXR5KiBwcm9wZXJ0aWVzIGFyZSBzZXQsIHdlIG5lZWQgYSBkZWZhdWx0IGNhcGFjaXR5KG5vZGVncm91cClcbiAgICBpZiAocHJvcHMuZGVmYXVsdENhcGFjaXR5ICE9PSB1bmRlZmluZWQgfHxcbiAgICAgICAgcHJvcHMuZGVmYXVsdENhcGFjaXR5VHlwZSAhPT0gdW5kZWZpbmVkIHx8XG4gICAgICAgIHByb3BzLmRlZmF1bHRDYXBhY2l0eUluc3RhbmNlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IG1pbkNhcGFjaXR5ID0gcHJvcHMuZGVmYXVsdENhcGFjaXR5ID8/IERFRkFVTFRfQ0FQQUNJVFlfQ09VTlQ7XG4gICAgICBpZiAobWluQ2FwYWNpdHkgPiAwKSB7XG4gICAgICAgIGNvbnN0IGluc3RhbmNlVHlwZSA9IHByb3BzLmRlZmF1bHRDYXBhY2l0eUluc3RhbmNlIHx8IERFRkFVTFRfQ0FQQUNJVFlfVFlQRTtcbiAgICAgICAgLy8gSWYgZGVmYXVsdENhcGFjaXR5VHlwZSBpcyB1bmRlZmluZWQsIHVzZSBBVVRPTU9ERSBhcyB0aGUgZGVmYXVsdFxuICAgICAgICBjb25zdCBjYXBhY2l0eVR5cGUgPSBwcm9wcy5kZWZhdWx0Q2FwYWNpdHlUeXBlID8/IERlZmF1bHRDYXBhY2l0eVR5cGUuQVVUT01PREU7XG5cbiAgICAgICAgLy8gT25seSBjcmVhdGUgRUMyIG9yIE5vZGVncm91cCBjYXBhY2l0eSBpZiBub3QgdXNpbmcgQVVUT01PREVcbiAgICAgICAgaWYgKGNhcGFjaXR5VHlwZSA9PT0gRGVmYXVsdENhcGFjaXR5VHlwZS5FQzIpIHtcbiAgICAgICAgICB0aGlzLmRlZmF1bHRDYXBhY2l0eSA9IHRoaXMuYWRkQXV0b1NjYWxpbmdHcm91cENhcGFjaXR5KCdEZWZhdWx0Q2FwYWNpdHknLCB7IGluc3RhbmNlVHlwZSwgbWluQ2FwYWNpdHkgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY2FwYWNpdHlUeXBlID09PSBEZWZhdWx0Q2FwYWNpdHlUeXBlLk5PREVHUk9VUCkge1xuICAgICAgICAgIHRoaXMuZGVmYXVsdE5vZGVncm91cCA9IHRoaXMuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ0RlZmF1bHRDYXBhY2l0eScsIHsgaW5zdGFuY2VUeXBlczogW2luc3RhbmNlVHlwZV0sIG1pblNpemU6IG1pbkNhcGFjaXR5IH0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIEZvciBBVVRPTU9ERSwgd2UgZG9uJ3QgY3JlYXRlIGFueSBleHBsaWNpdCBjYXBhY2l0eSBhcyBpdCdzIG1hbmFnZWQgYnkgRUtTXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZW5zdXJlIEZBUkdBVEUgc3RpbGwgYXBwbGllcyBoZXJlXG4gICAgaWYgKHByb3BzLmNvcmVEbnNDb21wdXRlVHlwZSA9PT0gQ29yZURuc0NvbXB1dGVUeXBlLkZBUkdBVEUpIHtcbiAgICAgIHRoaXMuZGVmaW5lQ29yZURuc0NvbXB1dGVUeXBlKENvcmVEbnNDb21wdXRlVHlwZS5GQVJHQVRFKTtcbiAgICB9XG5cbiAgICBjb25zdCBvdXRwdXRDb25maWdDb21tYW5kID0gKHByb3BzLm91dHB1dENvbmZpZ0NvbW1hbmQgPz8gdHJ1ZSkgJiYgcHJvcHMubWFzdGVyc1JvbGU7XG4gICAgaWYgKG91dHB1dENvbmZpZ0NvbW1hbmQpIHtcbiAgICAgIGNvbnN0IHBvc3RmaXggPSBjb21tb25Db21tYW5kT3B0aW9ucy5qb2luKCcgJyk7XG4gICAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdDb25maWdDb21tYW5kJywgeyB2YWx1ZTogYCR7dXBkYXRlQ29uZmlnQ29tbWFuZFByZWZpeH0gJHtwb3N0Zml4fWAgfSk7XG4gICAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdHZXRUb2tlbkNvbW1hbmQnLCB7IHZhbHVlOiBgJHtnZXRUb2tlbkNvbW1hbmRQcmVmaXh9ICR7cG9zdGZpeH1gIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHcmFudHMgdGhlIHNwZWNpZmllZCBJQU0gcHJpbmNpcGFsIGFjY2VzcyB0byB0aGUgRUtTIGNsdXN0ZXIgYmFzZWQgb24gdGhlIHByb3ZpZGVkIGFjY2VzcyBwb2xpY2llcy5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgY3JlYXRlcyBhbiBgQWNjZXNzRW50cnlgIGNvbnN0cnVjdCB0aGF0IGdyYW50cyB0aGUgc3BlY2lmaWVkIElBTSBwcmluY2lwYWwgdGhlIGFjY2VzcyBwZXJtaXNzaW9uc1xuICAgKiBkZWZpbmVkIGJ5IHRoZSBwcm92aWRlZCBgSUFjY2Vzc1BvbGljeWAgYXJyYXkuIFRoaXMgYWxsb3dzIHRoZSBJQU0gcHJpbmNpcGFsIHRvIHBlcmZvcm0gdGhlIGFjdGlvbnMgcGVybWl0dGVkXG4gICAqIGJ5IHRoZSBhY2Nlc3MgcG9saWNpZXMgd2l0aGluIHRoZSBFS1MgY2x1c3Rlci5cbiAgICogW2Rpc2FibGUtYXdzbGludDpuby1ncmFudHNdXG4gICAqXG4gICAqIEBwYXJhbSBpZCAtIFRoZSBJRCBvZiB0aGUgYEFjY2Vzc0VudHJ5YCBjb25zdHJ1Y3QgdG8gYmUgY3JlYXRlZC5cbiAgICogQHBhcmFtIHByaW5jaXBhbCAtIFRoZSBJQU0gcHJpbmNpcGFsIChyb2xlIG9yIHVzZXIpIHRvIGJlIGdyYW50ZWQgYWNjZXNzIHRvIHRoZSBFS1MgY2x1c3Rlci5cbiAgICogQHBhcmFtIGFjY2Vzc1BvbGljaWVzIC0gQW4gYXJyYXkgb2YgYElBY2Nlc3NQb2xpY3lgIG9iamVjdHMgdGhhdCBkZWZpbmUgdGhlIGFjY2VzcyBwZXJtaXNzaW9ucyB0byBiZSBncmFudGVkIHRvIHRoZSBJQU0gcHJpbmNpcGFsLlxuICAgKi9cbiAgQE1ldGhvZE1ldGFkYXRhKClcbiAgcHVibGljIGdyYW50QWNjZXNzKGlkOiBzdHJpbmcsIHByaW5jaXBhbDogc3RyaW5nLCBhY2Nlc3NQb2xpY2llczogSUFjY2Vzc1BvbGljeVtdKSB7XG4gICAgdGhpcy5hZGRUb0FjY2Vzc0VudHJ5KGlkLCBwcmluY2lwYWwsIGFjY2Vzc1BvbGljaWVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHcmFudHMgdGhlIHNwZWNpZmllZCBJQU0gcHJpbmNpcGFsIGNsdXN0ZXIgYWRtaW4gYWNjZXNzIHRvIHRoZSBFS1MgY2x1c3Rlci5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgY3JlYXRlcyBhbiBgQWNjZXNzRW50cnlgIGNvbnN0cnVjdCB0aGF0IGdyYW50cyB0aGUgc3BlY2lmaWVkIElBTSBwcmluY2lwYWwgdGhlIGNsdXN0ZXIgYWRtaW5cbiAgICogYWNjZXNzIHBlcm1pc3Npb25zLiBUaGlzIGFsbG93cyB0aGUgSUFNIHByaW5jaXBhbCB0byBwZXJmb3JtIHRoZSBhY3Rpb25zIHBlcm1pdHRlZFxuICAgKiBieSB0aGUgY2x1c3RlciBhZG1pbiBhY2Nlcy5cbiAgICogW2Rpc2FibGUtYXdzbGludDpuby1ncmFudHNdXG4gICAqXG4gICAqIEBwYXJhbSBpZCAtIFRoZSBJRCBvZiB0aGUgYEFjY2Vzc0VudHJ5YCBjb25zdHJ1Y3QgdG8gYmUgY3JlYXRlZC5cbiAgICogQHBhcmFtIHByaW5jaXBhbCAtIFRoZSBJQU0gcHJpbmNpcGFsIChyb2xlIG9yIHVzZXIpIHRvIGJlIGdyYW50ZWQgYWNjZXNzIHRvIHRoZSBFS1MgY2x1c3Rlci5cbiAgICogQHJldHVybnMgdGhlIGFjY2VzcyBlbnRyeSBjb25zdHJ1Y3RcbiAgICovXG4gIEBNZXRob2RNZXRhZGF0YSgpXG4gIHB1YmxpYyBncmFudENsdXN0ZXJBZG1pbihpZDogc3RyaW5nLCBwcmluY2lwYWw6IHN0cmluZyk6IEFjY2Vzc0VudHJ5IHtcbiAgICBjb25zdCBuZXdFbnRyeSA9IG5ldyBBY2Nlc3NFbnRyeSh0aGlzLCBpZCwge1xuICAgICAgcHJpbmNpcGFsLFxuICAgICAgY2x1c3RlcjogdGhpcyxcbiAgICAgIGFjY2Vzc1BvbGljaWVzOiBbXG4gICAgICAgIEFjY2Vzc1BvbGljeS5mcm9tQWNjZXNzUG9saWN5TmFtZSgnQW1hem9uRUtTQ2x1c3RlckFkbWluUG9saWN5Jywge1xuICAgICAgICAgIGFjY2Vzc1Njb3BlVHlwZTogQWNjZXNzU2NvcGVUeXBlLkNMVVNURVIsXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KTtcbiAgICB0aGlzLmFjY2Vzc0VudHJpZXMuc2V0KHByaW5jaXBhbCwgbmV3RW50cnkpO1xuICAgIHJldHVybiBuZXdFbnRyeTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGZXRjaCB0aGUgbG9hZCBiYWxhbmNlciBhZGRyZXNzIG9mIGEgc2VydmljZSBvZiB0eXBlICdMb2FkQmFsYW5jZXInLlxuICAgKlxuICAgKiBAcGFyYW0gc2VydmljZU5hbWUgVGhlIG5hbWUgb2YgdGhlIHNlcnZpY2UuXG4gICAqIEBwYXJhbSBvcHRpb25zIEFkZGl0aW9uYWwgb3BlcmF0aW9uIG9wdGlvbnMuXG4gICAqL1xuICBATWV0aG9kTWV0YWRhdGEoKVxuICBwdWJsaWMgZ2V0U2VydmljZUxvYWRCYWxhbmNlckFkZHJlc3Moc2VydmljZU5hbWU6IHN0cmluZywgb3B0aW9uczogU2VydmljZUxvYWRCYWxhbmNlckFkZHJlc3NPcHRpb25zID0ge30pOiBzdHJpbmcge1xuICAgIGNvbnN0IGxvYWRCYWxhbmNlckFkZHJlc3MgPSBuZXcgS3ViZXJuZXRlc09iamVjdFZhbHVlKHRoaXMsIGAke3NlcnZpY2VOYW1lfUxvYWRCYWxhbmNlckFkZHJlc3NgLCB7XG4gICAgICBjbHVzdGVyOiB0aGlzLFxuICAgICAgb2JqZWN0VHlwZTogJ3NlcnZpY2UnLFxuICAgICAgb2JqZWN0TmFtZTogc2VydmljZU5hbWUsXG4gICAgICBvYmplY3ROYW1lc3BhY2U6IG9wdGlvbnMubmFtZXNwYWNlLFxuICAgICAganNvblBhdGg6ICcuc3RhdHVzLmxvYWRCYWxhbmNlci5pbmdyZXNzWzBdLmhvc3RuYW1lJyxcbiAgICAgIHRpbWVvdXQ6IG9wdGlvbnMudGltZW91dCxcbiAgICB9KTtcblxuICAgIHJldHVybiBsb2FkQmFsYW5jZXJBZGRyZXNzLnZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEZldGNoIHRoZSBsb2FkIGJhbGFuY2VyIGFkZHJlc3Mgb2YgYW4gaW5ncmVzcyBiYWNrZWQgYnkgYSBsb2FkIGJhbGFuY2VyLlxuICAgKlxuICAgKiBAcGFyYW0gaW5ncmVzc05hbWUgVGhlIG5hbWUgb2YgdGhlIGluZ3Jlc3MuXG4gICAqIEBwYXJhbSBvcHRpb25zIEFkZGl0aW9uYWwgb3BlcmF0aW9uIG9wdGlvbnMuXG4gICAqL1xuICBATWV0aG9kTWV0YWRhdGEoKVxuICBwdWJsaWMgZ2V0SW5ncmVzc0xvYWRCYWxhbmNlckFkZHJlc3MoaW5ncmVzc05hbWU6IHN0cmluZywgb3B0aW9uczogSW5ncmVzc0xvYWRCYWxhbmNlckFkZHJlc3NPcHRpb25zID0ge30pOiBzdHJpbmcge1xuICAgIGNvbnN0IGxvYWRCYWxhbmNlckFkZHJlc3MgPSBuZXcgS3ViZXJuZXRlc09iamVjdFZhbHVlKHRoaXMsIGAke2luZ3Jlc3NOYW1lfUxvYWRCYWxhbmNlckFkZHJlc3NgLCB7XG4gICAgICBjbHVzdGVyOiB0aGlzLFxuICAgICAgb2JqZWN0VHlwZTogJ2luZ3Jlc3MnLFxuICAgICAgb2JqZWN0TmFtZTogaW5ncmVzc05hbWUsXG4gICAgICBvYmplY3ROYW1lc3BhY2U6IG9wdGlvbnMubmFtZXNwYWNlLFxuICAgICAganNvblBhdGg6ICcuc3RhdHVzLmxvYWRCYWxhbmNlci5pbmdyZXNzWzBdLmhvc3RuYW1lJyxcbiAgICAgIHRpbWVvdXQ6IG9wdGlvbnMudGltZW91dCxcbiAgICB9KTtcblxuICAgIHJldHVybiBsb2FkQmFsYW5jZXJBZGRyZXNzLnZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBub2RlcyB0byB0aGlzIEVLUyBjbHVzdGVyXG4gICAqXG4gICAqIFRoZSBub2RlcyB3aWxsIGF1dG9tYXRpY2FsbHkgYmUgY29uZmlndXJlZCB3aXRoIHRoZSByaWdodCBWUEMgYW5kIEFNSVxuICAgKiBmb3IgdGhlIGluc3RhbmNlIHR5cGUgYW5kIEt1YmVybmV0ZXMgdmVyc2lvbi5cbiAgICpcbiAgICogTm90ZSB0aGF0IGlmIHlvdSBzcGVjaWZ5IGB1cGRhdGVUeXBlOiBSb2xsaW5nVXBkYXRlYCBvciBgdXBkYXRlVHlwZTogUmVwbGFjaW5nVXBkYXRlYCwgeW91ciBub2RlcyBtaWdodCBiZSByZXBsYWNlZCBhdCBkZXBsb3lcbiAgICogdGltZSB3aXRob3V0IG5vdGljZSBpbiBjYXNlIHRoZSByZWNvbW1lbmRlZCBBTUkgZm9yIHlvdXIgbWFjaGluZSBpbWFnZSB0eXBlIGhhcyBiZWVuIHVwZGF0ZWQgYnkgQVdTLlxuICAgKiBUaGUgZGVmYXVsdCBiZWhhdmlvciBmb3IgYHVwZGF0ZVR5cGVgIGlzIGBOb25lYCwgd2hpY2ggbWVhbnMgb25seSBuZXcgaW5zdGFuY2VzIHdpbGwgYmUgbGF1bmNoZWQgdXNpbmcgdGhlIG5ldyBBTUkuXG4gICAqXG4gICAqL1xuICBATWV0aG9kTWV0YWRhdGEoKVxuICBwdWJsaWMgYWRkQXV0b1NjYWxpbmdHcm91cENhcGFjaXR5KGlkOiBzdHJpbmcsIG9wdGlvbnM6IEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eU9wdGlvbnMpOiBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwIHtcbiAgICBpZiAob3B0aW9ucy5tYWNoaW5lSW1hZ2VUeXBlID09PSBNYWNoaW5lSW1hZ2VUeXBlLkJPVFRMRVJPQ0tFVCAmJiBvcHRpb25zLmJvb3RzdHJhcE9wdGlvbnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdib290c3RyYXBPcHRpb25zIGlzIG5vdCBzdXBwb3J0ZWQgZm9yIEJvdHRsZXJvY2tldCcpO1xuICAgIH1cbiAgICBjb25zdCBhc2cgPSBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cCh0aGlzLCBpZCwge1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIHZwYzogdGhpcy52cGMsXG4gICAgICBtYWNoaW5lSW1hZ2U6IG9wdGlvbnMubWFjaGluZUltYWdlVHlwZSA9PT0gTWFjaGluZUltYWdlVHlwZS5CT1RUTEVST0NLRVQgP1xuICAgICAgICBuZXcgQm90dGxlUm9ja2V0SW1hZ2Uoe1xuICAgICAgICAgIGt1YmVybmV0ZXNWZXJzaW9uOiB0aGlzLnZlcnNpb24udmVyc2lvbixcbiAgICAgICAgfSkgOlxuICAgICAgICBuZXcgRWtzT3B0aW1pemVkSW1hZ2Uoe1xuICAgICAgICAgIG5vZGVUeXBlOiBub2RlVHlwZUZvckluc3RhbmNlVHlwZShvcHRpb25zLmluc3RhbmNlVHlwZSksXG4gICAgICAgICAgY3B1QXJjaDogY3B1QXJjaEZvckluc3RhbmNlVHlwZShvcHRpb25zLmluc3RhbmNlVHlwZSksXG4gICAgICAgICAga3ViZXJuZXRlc1ZlcnNpb246IHRoaXMudmVyc2lvbi52ZXJzaW9uLFxuICAgICAgICB9KSxcbiAgICB9KTtcblxuICAgIHRoaXMuY29ubmVjdEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eShhc2csIHtcbiAgICAgIGJvb3RzdHJhcE9wdGlvbnM6IG9wdGlvbnMuYm9vdHN0cmFwT3B0aW9ucyxcbiAgICAgIGJvb3RzdHJhcEVuYWJsZWQ6IG9wdGlvbnMuYm9vdHN0cmFwRW5hYmxlZCxcbiAgICAgIG1hY2hpbmVJbWFnZVR5cGU6IG9wdGlvbnMubWFjaGluZUltYWdlVHlwZSxcbiAgICB9KTtcblxuICAgIGlmIChub2RlVHlwZUZvckluc3RhbmNlVHlwZShvcHRpb25zLmluc3RhbmNlVHlwZSkgPT09IE5vZGVUeXBlLklORkVSRU5USUEgfHxcbiAgICAgIG5vZGVUeXBlRm9ySW5zdGFuY2VUeXBlKG9wdGlvbnMuaW5zdGFuY2VUeXBlKSA9PT0gTm9kZVR5cGUuVFJBSU5JVU0pIHtcbiAgICAgIHRoaXMuYWRkTmV1cm9uRGV2aWNlUGx1Z2luKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFzZztcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgbWFuYWdlZCBub2RlZ3JvdXAgdG8gdGhpcyBBbWF6b24gRUtTIGNsdXN0ZXJcbiAgICpcbiAgICogVGhpcyBtZXRob2Qgd2lsbCBjcmVhdGUgYSBuZXcgbWFuYWdlZCBub2RlZ3JvdXAgYW5kIGFkZCBpbnRvIHRoZSBjYXBhY2l0eS5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZWtzL2xhdGVzdC91c2VyZ3VpZGUvbWFuYWdlZC1ub2RlLWdyb3Vwcy5odG1sXG4gICAqIEBwYXJhbSBpZCBUaGUgSUQgb2YgdGhlIG5vZGVncm91cFxuICAgKiBAcGFyYW0gb3B0aW9ucyBvcHRpb25zIGZvciBjcmVhdGluZyBhIG5ldyBub2RlZ3JvdXBcbiAgICovXG4gIEBNZXRob2RNZXRhZGF0YSgpXG4gIHB1YmxpYyBhZGROb2RlZ3JvdXBDYXBhY2l0eShpZDogc3RyaW5nLCBvcHRpb25zPzogTm9kZWdyb3VwT3B0aW9ucyk6IE5vZGVncm91cCB7XG4gICAgY29uc3QgaGFzSW5mZXJlbnRpYU9yVHJhaW5pdW1JbnN0YW5jZVR5cGUgPSBbXG4gICAgICBvcHRpb25zPy5pbnN0YW5jZVR5cGUsXG4gICAgICAuLi5vcHRpb25zPy5pbnN0YW5jZVR5cGVzID8/IFtdLFxuICAgIF0uc29tZShpID0+IGkgJiYgKG5vZGVUeXBlRm9ySW5zdGFuY2VUeXBlKGkpID09PSBOb2RlVHlwZS5JTkZFUkVOVElBIHx8XG4gICAgICBub2RlVHlwZUZvckluc3RhbmNlVHlwZShpKSA9PT0gTm9kZVR5cGUuVFJBSU5JVU0pKTtcblxuICAgIGlmIChoYXNJbmZlcmVudGlhT3JUcmFpbml1bUluc3RhbmNlVHlwZSkge1xuICAgICAgdGhpcy5hZGROZXVyb25EZXZpY2VQbHVnaW4oKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBOb2RlZ3JvdXAodGhpcywgYE5vZGVncm91cCR7aWR9YCwge1xuICAgICAgY2x1c3RlcjogdGhpcyxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSWYgdGhpcyBjbHVzdGVyIGlzIGt1YmVjdGwtZW5hYmxlZCwgcmV0dXJucyB0aGUgT3BlbklEIENvbm5lY3QgaXNzdWVyIHVybC5cbiAgICogSWYgdGhpcyBjbHVzdGVyIGlzIG5vdCBrdWJlY3RsLWVuYWJsZWQgKGkuZS4gdXNlcyB0aGVcbiAgICogc3RvY2sgYENmbkNsdXN0ZXJgKSwgdGhpcyBpcyBgdW5kZWZpbmVkYC5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIGdldCBjbHVzdGVyT3BlbklkQ29ubmVjdElzc3VlclVybCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9jbHVzdGVyUmVzb3VyY2UuYXR0ck9wZW5JZENvbm5lY3RJc3N1ZXJVcmw7XG4gIH1cblxuICAvKipcbiAgICogQW4gYE9wZW5JZENvbm5lY3RQcm92aWRlcmAgcmVzb3VyY2UgYXNzb2NpYXRlZCB3aXRoIHRoaXMgY2x1c3RlciwgYW5kIHdoaWNoIGNhbiBiZSB1c2VkXG4gICAqIHRvIGxpbmsgdGhpcyBjbHVzdGVyIHRvIEFXUyBJQU0uXG4gICAqXG4gICAqIEEgcHJvdmlkZXIgd2lsbCBvbmx5IGJlIGRlZmluZWQgaWYgdGhpcyBwcm9wZXJ0eSBpcyBhY2Nlc3NlZCAobGF6eSBpbml0aWFsaXphdGlvbikuXG4gICAqL1xuICBwdWJsaWMgZ2V0IG9wZW5JZENvbm5lY3RQcm92aWRlcigpIHtcbiAgICBpZiAoIXRoaXMuX29wZW5JZENvbm5lY3RQcm92aWRlcikge1xuICAgICAgdGhpcy5fb3BlbklkQ29ubmVjdFByb3ZpZGVyID0gbmV3IE9wZW5JZENvbm5lY3RQcm92aWRlcih0aGlzLCAnT3BlbklkQ29ubmVjdFByb3ZpZGVyJywge1xuICAgICAgICB1cmw6IHRoaXMuY2x1c3Rlck9wZW5JZENvbm5lY3RJc3N1ZXJVcmwsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fb3BlbklkQ29ubmVjdFByb3ZpZGVyO1xuICB9XG5cbiAgcHVibGljIGdldCBrdWJlY3RsUHJvdmlkZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2t1YmVjdGxQcm92aWRlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgdGhlIEVLUyBQb2QgSWRlbnRpdHkgQWdlbnQgYWRkb24gZm9yIHRoZSBFS1MgY2x1c3Rlci5cbiAgICpcbiAgICogVGhlIEVLUyBQb2QgSWRlbnRpdHkgQWdlbnQgaXMgcmVzcG9uc2libGUgZm9yIG1hbmFnaW5nIHRoZSB0ZW1wb3JhcnkgY3JlZGVudGlhbHNcbiAgICogdXNlZCBieSBwb2RzIGluIHRoZSBjbHVzdGVyIHRvIGFjY2VzcyBBV1MgcmVzb3VyY2VzLiBJdCBydW5zIGFzIGEgRGFlbW9uU2V0IG9uXG4gICAqIGVhY2ggbm9kZSBhbmQgcHJvdmlkZXMgdGhlIG5lY2Vzc2FyeSBjcmVkZW50aWFscyB0byB0aGUgcG9kcyBiYXNlZCBvbiB0aGVpclxuICAgKiBhc3NvY2lhdGVkIHNlcnZpY2UgYWNjb3VudC5cbiAgICpcbiAgICovXG4gIHB1YmxpYyBnZXQgZWtzUG9kSWRlbnRpdHlBZ2VudCgpOiBJQWRkb24gfCB1bmRlZmluZWQge1xuICAgIGlmICghdGhpcy5fZWtzUG9kSWRlbnRpdHlBZ2VudCkge1xuICAgICAgdGhpcy5fZWtzUG9kSWRlbnRpdHlBZ2VudCA9IG5ldyBBZGRvbih0aGlzLCAnRWtzUG9kSWRlbnRpdHlBZ2VudEFkZG9uJywge1xuICAgICAgICBjbHVzdGVyOiB0aGlzLFxuICAgICAgICBhZGRvbk5hbWU6ICdla3MtcG9kLWlkZW50aXR5LWFnZW50JyxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9la3NQb2RJZGVudGl0eUFnZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBGYXJnYXRlIHByb2ZpbGUgdG8gdGhpcyBjbHVzdGVyLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9la3MvbGF0ZXN0L3VzZXJndWlkZS9mYXJnYXRlLXByb2ZpbGUuaHRtbFxuICAgKlxuICAgKiBAcGFyYW0gaWQgdGhlIGlkIG9mIHRoaXMgcHJvZmlsZVxuICAgKiBAcGFyYW0gb3B0aW9ucyBwcm9maWxlIG9wdGlvbnNcbiAgICovXG4gIEBNZXRob2RNZXRhZGF0YSgpXG4gIHB1YmxpYyBhZGRGYXJnYXRlUHJvZmlsZShpZDogc3RyaW5nLCBvcHRpb25zOiBGYXJnYXRlUHJvZmlsZU9wdGlvbnMpIHtcbiAgICByZXR1cm4gbmV3IEZhcmdhdGVQcm9maWxlKHRoaXMsIGBmYXJnYXRlLXByb2ZpbGUtJHtpZH1gLCB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgY2x1c3RlcjogdGhpcyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcm5hbCBBUEkgdXNlZCBieSBgRmFyZ2F0ZVByb2ZpbGVgIHRvIGtlZXAgaW52ZW50b3J5IG9mIEZhcmdhdGUgcHJvZmlsZXMgYXNzb2NpYXRlZCB3aXRoXG4gICAqIHRoaXMgY2x1c3RlciwgZm9yIHRoZSBzYWtlIG9mIGVuc3VyaW5nIHRoZSBwcm9maWxlcyBhcmUgY3JlYXRlZCBzZXF1ZW50aWFsbHkuXG4gICAqXG4gICAqIEByZXR1cm5zIHRoZSBsaXN0IG9mIEZhcmdhdGVQcm9maWxlcyBhdHRhY2hlZCB0byB0aGlzIGNsdXN0ZXIsIGluY2x1ZGluZyB0aGUgb25lIGp1c3QgYXR0YWNoZWQuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIF9hdHRhY2hGYXJnYXRlUHJvZmlsZShmYXJnYXRlUHJvZmlsZTogRmFyZ2F0ZVByb2ZpbGUpOiBGYXJnYXRlUHJvZmlsZVtdIHtcbiAgICB0aGlzLl9mYXJnYXRlUHJvZmlsZXMucHVzaChmYXJnYXRlUHJvZmlsZSk7XG5cbiAgICAvLyBhZGQgYWxsIHByb2ZpbGVzIGFzIGEgZGVwZW5kZW5jeSBvZiB0aGUgXCJrdWJlY3RsLXJlYWR5XCIgYmFycmllciBiZWNhdXNlIGFsbCBrdWJlY3RsLVxuICAgIC8vIHJlc291cmNlcyBjYW4gb25seSBiZSBkZXBsb3llZCBhZnRlciBhbGwgZmFyZ2F0ZSBwcm9maWxlcyBhcmUgY3JlYXRlZC5cbiAgICB0aGlzLl9rdWJlY3RsUmVhZHlCYXJyaWVyLm5vZGUuYWRkRGVwZW5kZW5jeShmYXJnYXRlUHJvZmlsZSk7XG5cbiAgICByZXR1cm4gdGhpcy5fZmFyZ2F0ZVByb2ZpbGVzO1xuICB9XG5cbiAgLyoqXG4gICAqIHZhbGlkYXRlIGFsbCBhdXRvTW9kZSByZWxldmFudCBjb25maWd1cmF0aW9ucyB0byBlbnN1cmUgdGhleSBhcmUgY29ycmVjdCBhbmQgdGhyb3dcbiAgICogZXJyb3JzIGlmIHRoZXkgYXJlIG5vdC5cbiAgICpcbiAgICogQHBhcmFtIHByb3BzIENsdXN0ZXJQcm9wc1xuICAgKlxuICAgKi9cbiAgcHJpdmF0ZSBpc1ZhbGlkQXV0b01vZGVDb25maWcocHJvcHM6IENsdXN0ZXJQcm9wcyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGF1dG9Nb2RlRW5hYmxlZCA9IHByb3BzLmRlZmF1bHRDYXBhY2l0eVR5cGUgPT09IHVuZGVmaW5lZCB8fCBwcm9wcy5kZWZhdWx0Q2FwYWNpdHlUeXBlID09IERlZmF1bHRDYXBhY2l0eVR5cGUuQVVUT01PREU7XG4gICAgLy8gaWYgdXNpbmcgQVVUT01PREVcbiAgICBpZiAoYXV0b01vZGVFbmFibGVkKSB7XG4gICAgICAvLyBXaGVuIHVzaW5nIEFVVE9NT0RFLCBub2RlUG9vbHMgdmFsdWVzIGFyZSBjYXNlLXNlbnNpdGl2ZSBhbmQgbXVzdCBiZSBnZW5lcmFsLXB1cnBvc2UgYW5kL29yIHN5c3RlbVxuICAgICAgaWYgKHByb3BzLmNvbXB1dGU/Lm5vZGVQb29scykge1xuICAgICAgICBjb25zdCB2YWxpZE5vZGVQb29scyA9IFsnZ2VuZXJhbC1wdXJwb3NlJywgJ3N5c3RlbSddO1xuICAgICAgICBjb25zdCBpbnZhbGlkUG9vbHMgPSBwcm9wcy5jb21wdXRlLm5vZGVQb29scy5maWx0ZXIocG9vbCA9PiAhdmFsaWROb2RlUG9vbHMuaW5jbHVkZXMocG9vbCkpO1xuICAgICAgICBpZiAoaW52YWxpZFBvb2xzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgbm9kZSBwb29sIHZhbHVlczogJHtpbnZhbGlkUG9vbHMuam9pbignLCAnKX0uIFZhbGlkIHZhbHVlcyBhcmU6ICR7dmFsaWROb2RlUG9vbHMuam9pbignLCAnKX1gKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBXaGVuIHVzaW5nIEFVVE9NT0RFLCBkZWZhdWx0Q2FwYWNpdHkgYW5kIGRlZmF1bHRDYXBhY2l0eUluc3RhbmNlIGNhbm5vdCBiZSBzcGVjaWZpZWRcbiAgICAgIGlmIChwcm9wcy5kZWZhdWx0Q2FwYWNpdHkgIT09IHVuZGVmaW5lZCB8fCBwcm9wcy5kZWZhdWx0Q2FwYWNpdHlJbnN0YW5jZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHNwZWNpZnkgZGVmYXVsdENhcGFjaXR5IG9yIGRlZmF1bHRDYXBhY2l0eUluc3RhbmNlIHdoZW4gdXNpbmcgQXV0byBNb2RlLiBBdXRvIE1vZGUgbWFuYWdlcyBjb21wdXRlIHJlc291cmNlcyBhdXRvbWF0aWNhbGx5LicpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBpZiBOT1QgdXNpbmcgQVVUT01PREVcbiAgICAgIGlmIChwcm9wcy5jb21wdXRlKSB7XG4gICAgICAgIC8vIFdoZW4gbm90IHVzaW5nIEFVVE9NT0RFLCBjb21wdXRlIG11c3QgYmUgdW5kZWZpbmVkXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHNwZWNpZnkgY29tcHV0ZSB3aXRob3V0IHVzaW5nIERlZmF1bHRDYXBhY2l0eVR5cGUuQVVUT01PREUnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYXV0b01vZGVFbmFibGVkO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGROb2RlUG9vbFJvbGUoaWQ6IHN0cmluZyk6IGlhbS5Sb2xlIHtcbiAgICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsIGlkLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnZWMyLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgIC8vIHRvIGJlIGFibGUgdG8gYWNjZXNzIHRoZSBBV1NMb2FkQmFsYW5jZXJDb250cm9sbGVyXG4gICAgICBtYW5hZ2VkUG9saWNpZXM6IFtcbiAgICAgICAgLy8gc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9la3MvbGF0ZXN0L3VzZXJndWlkZS9hdXRvbW9kZS1nZXQtc3RhcnRlZC1jbGkuaHRtbCNhdXRvLW1vZGUtY3JlYXRlLXJvbGVzXG4gICAgICAgIGlhbS5NYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnQW1hem9uRUtTV29ya2VyTm9kZVBvbGljeScpLFxuICAgICAgICBpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ0FtYXpvbkVDMkNvbnRhaW5lclJlZ2lzdHJ5UmVhZE9ubHknKSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICByZXR1cm4gcm9sZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIGFjY2VzcyBlbnRyeSB0byB0aGUgY2x1c3RlcidzIGFjY2VzcyBlbnRyaWVzIG1hcC5cbiAgICpcbiAgICogSWYgYW4gZW50cnkgYWxyZWFkeSBleGlzdHMgZm9yIHRoZSBnaXZlbiBwcmluY2lwYWwsIGl0IGFkZHMgdGhlIHByb3ZpZGVkIGFjY2VzcyBwb2xpY2llcyB0byB0aGUgZXhpc3RpbmcgZW50cnkuXG4gICAqIElmIG5vIGVudHJ5IGV4aXN0cyBmb3IgdGhlIGdpdmVuIHByaW5jaXBhbCwgaXQgY3JlYXRlcyBhIG5ldyBhY2Nlc3MgZW50cnkgd2l0aCB0aGUgcHJvdmlkZWQgYWNjZXNzIHBvbGljaWVzLlxuICAgKlxuICAgKiBAcGFyYW0gcHJpbmNpcGFsIC0gVGhlIHByaW5jaXBhbCAoZS5nLiwgSUFNIHVzZXIgb3Igcm9sZSkgZm9yIHdoaWNoIHRoZSBhY2Nlc3MgZW50cnkgaXMgYmVpbmcgYWRkZWQuXG4gICAqIEBwYXJhbSBwb2xpY2llcyAtIEFuIGFycmF5IG9mIGFjY2VzcyBwb2xpY2llcyB0byBiZSBhc3NvY2lhdGVkIHdpdGggdGhlIHByaW5jaXBhbC5cbiAgICpcbiAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSB1bmlxdWVOYW1lIGdlbmVyYXRlZCBmb3IgdGhlIG5ldyBhY2Nlc3MgZW50cnkgaXMgbm90IHVuaXF1ZS5cbiAgICpcbiAgICogQHJldHVybnMge3ZvaWR9XG4gICAqL1xuICBwcml2YXRlIGFkZFRvQWNjZXNzRW50cnkoaWQ6IHN0cmluZywgcHJpbmNpcGFsOiBzdHJpbmcsIHBvbGljaWVzOiBJQWNjZXNzUG9saWN5W10pIHtcbiAgICBjb25zdCBlbnRyeSA9IHRoaXMuYWNjZXNzRW50cmllcy5nZXQocHJpbmNpcGFsKTtcbiAgICBpZiAoZW50cnkpIHtcbiAgICAgIChlbnRyeSBhcyBBY2Nlc3NFbnRyeSkuYWRkQWNjZXNzUG9saWNpZXMocG9saWNpZXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBuZXdFbnRyeSA9IG5ldyBBY2Nlc3NFbnRyeSh0aGlzLCBpZCwge1xuICAgICAgICBwcmluY2lwYWwsXG4gICAgICAgIGNsdXN0ZXI6IHRoaXMsXG4gICAgICAgIGFjY2Vzc1BvbGljaWVzOiBwb2xpY2llcyxcbiAgICAgIH0pO1xuICAgICAgdGhpcy5hY2Nlc3NFbnRyaWVzLnNldChwcmluY2lwYWwsIG5ld0VudHJ5KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHJlc291cmNlIHNjb3BlIHRoYXQgcmVxdWlyZXMgYGt1YmVjdGxgIHRvIHRoaXMgY2x1c3RlciBhbmQgcmV0dXJuc1xuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBfZGVwZW5kT25LdWJlY3RsQmFycmllcihyZXNvdXJjZTogQ29uc3RydWN0KSB7XG4gICAgcmVzb3VyY2Uubm9kZS5hZGREZXBlbmRlbmN5KHRoaXMuX2t1YmVjdGxSZWFkeUJhcnJpZXIpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZWxlY3RQcml2YXRlU3VibmV0cygpOiBlYzIuSVN1Ym5ldFtdIHtcbiAgICBjb25zdCBwcml2YXRlU3VibmV0czogZWMyLklTdWJuZXRbXSA9IFtdO1xuICAgIGNvbnN0IHZwY1ByaXZhdGVTdWJuZXRJZHMgPSB0aGlzLnZwYy5wcml2YXRlU3VibmV0cy5tYXAocyA9PiBzLnN1Ym5ldElkKTtcbiAgICBjb25zdCB2cGNQdWJsaWNTdWJuZXRJZHMgPSB0aGlzLnZwYy5wdWJsaWNTdWJuZXRzLm1hcChzID0+IHMuc3VibmV0SWQpO1xuXG4gICAgZm9yIChjb25zdCBwbGFjZW1lbnQgb2YgdGhpcy52cGNTdWJuZXRzKSB7XG4gICAgICBmb3IgKGNvbnN0IHN1Ym5ldCBvZiB0aGlzLnZwYy5zZWxlY3RTdWJuZXRzKHBsYWNlbWVudCkuc3VibmV0cykge1xuICAgICAgICBpZiAodnBjUHJpdmF0ZVN1Ym5ldElkcy5pbmNsdWRlcyhzdWJuZXQuc3VibmV0SWQpKSB7XG4gICAgICAgICAgLy8gZGVmaW5pdGVseSBwcml2YXRlLCB0YWtlIGl0LlxuICAgICAgICAgIHByaXZhdGVTdWJuZXRzLnB1c2goc3VibmV0KTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2cGNQdWJsaWNTdWJuZXRJZHMuaW5jbHVkZXMoc3VibmV0LnN1Ym5ldElkKSkge1xuICAgICAgICAgIC8vIGRlZmluaXRlbHkgcHVibGljLCBza2lwIGl0LlxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbmVpdGhlciBwdWJsaWMgYW5kIG5vciBwcml2YXRlIC0gd2hhdCBpcyBpdCB0aGVuPyB0aGlzIG1lYW5zIGl0cyBhIHN1Ym5ldCBpbnN0YW5jZSB0aGF0IHdhcyBleHBsaWNpdGx5IHBhc3NlZFxuICAgICAgICAvLyBpbiB0aGUgc3VibmV0IHNlbGVjdGlvbi4gc2luY2UgSVN1Ym5ldCBkb2Vzbid0IGNvbnRhaW4gaW5mb3JtYXRpb24gb24gdHlwZSwgd2UgaGF2ZSB0byBhc3N1bWUgaXRzIHByaXZhdGUgYW5kIGxldCBpdFxuICAgICAgICAvLyBmYWlsIGF0IGRlcGxveSB0aW1lIDpcXCAoaXRzIGJldHRlciB0aGFuIGZpbHRlcmluZyBpdCBvdXQgYW5kIHByZXZlbnRpbmcgYSBwb3NzaWJseSBzdWNjZXNzZnVsIGRlcGxveW1lbnQpXG4gICAgICAgIHByaXZhdGVTdWJuZXRzLnB1c2goc3VibmV0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcHJpdmF0ZVN1Ym5ldHM7XG4gIH1cblxuICAvKipcbiAgICogSW5zdGFsbHMgdGhlIE5ldXJvbiBkZXZpY2UgcGx1Z2luIG9uIHRoZSBjbHVzdGVyIGlmIGl0J3Mgbm90XG4gICAqIGFscmVhZHkgYWRkZWQuXG4gICAqL1xuICBwcml2YXRlIGFkZE5ldXJvbkRldmljZVBsdWdpbigpIHtcbiAgICBpZiAoIXRoaXMuX25ldXJvbkRldmljZVBsdWdpbikge1xuICAgICAgY29uc3QgZmlsZUNvbnRlbnRzID0gZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbihfX2Rpcm5hbWUsICdhZGRvbnMnLCAnbmV1cm9uLWRldmljZS1wbHVnaW4ueWFtbCcpLCAndXRmOCcpO1xuICAgICAgY29uc3Qgc2FuaXRpemVkID0gWUFNTC5wYXJzZShmaWxlQ29udGVudHMpO1xuICAgICAgdGhpcy5fbmV1cm9uRGV2aWNlUGx1Z2luID0gdGhpcy5hZGRNYW5pZmVzdCgnTmV1cm9uRGV2aWNlUGx1Z2luJywgc2FuaXRpemVkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fbmV1cm9uRGV2aWNlUGx1Z2luO1xuICB9XG5cbiAgLyoqXG4gICAqIE9wcG9ydHVuaXN0aWNhbGx5IHRhZyBzdWJuZXRzIHdpdGggdGhlIHJlcXVpcmVkIHRhZ3MuXG4gICAqXG4gICAqIElmIG5vIHN1Ym5ldHMgY291bGQgYmUgZm91bmQgKGJlY2F1c2UgdGhpcyBpcyBhbiBpbXBvcnRlZCBWUEMpLCBhZGQgYSB3YXJuaW5nLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9la3MvbGF0ZXN0L3VzZXJndWlkZS9uZXR3b3JrX3JlcXMuaHRtbFxuICAgKi9cbiAgcHJpdmF0ZSB0YWdTdWJuZXRzKCkge1xuICAgIGNvbnN0IHRhZ0FsbFN1Ym5ldHMgPSAodHlwZTogc3RyaW5nLCBzdWJuZXRzOiBlYzIuSVN1Ym5ldFtdLCB0YWc6IHN0cmluZykgPT4ge1xuICAgICAgZm9yIChjb25zdCBzdWJuZXQgb2Ygc3VibmV0cykge1xuICAgICAgICAvLyBpZiB0aGlzIGlzIG5vdCBhIGNvbmNyZXRlIHN1Ym5ldCwgYXR0YWNoIGEgY29uc3RydWN0IHdhcm5pbmdcbiAgICAgICAgaWYgKCFlYzIuU3VibmV0LmlzVnBjU3VibmV0KHN1Ym5ldCkpIHtcbiAgICAgICAgICAvLyBtZXNzYWdlIChpZiB0b2tlbik6IFwiY291bGQgbm90IGF1dG8tdGFnIHB1YmxpYy9wcml2YXRlIHN1Ym5ldCB3aXRoIHRhZy4uLlwiXG4gICAgICAgICAgLy8gbWVzc2FnZSAoaWYgbm90IHRva2VuKTogXCJjb3VudCBub3QgYXV0by10YWcgcHVibGljL3ByaXZhdGUgc3VibmV0IHh4eHh4IHdpdGggdGFnLi4uXCJcbiAgICAgICAgICBjb25zdCBzdWJuZXRJRCA9IFRva2VuLmlzVW5yZXNvbHZlZChzdWJuZXQuc3VibmV0SWQpIHx8IFRva2VuLmlzVW5yZXNvbHZlZChbc3VibmV0LnN1Ym5ldElkXSkgPyAnJyA6IGAgJHtzdWJuZXQuc3VibmV0SWR9YDtcbiAgICAgICAgICBBbm5vdGF0aW9ucy5vZih0aGlzKS5hZGRXYXJuaW5nVjIoJ0Bhd3MtY2RrL2F3cy1la3M6Y2x1c3Rlck11c3RNYW51YWxseVRhZ1N1Ym5ldCcsIGBDb3VsZCBub3QgYXV0by10YWcgJHt0eXBlfSBzdWJuZXQke3N1Ym5ldElEfSB3aXRoIFwiJHt0YWd9PTFcIiwgcGxlYXNlIHJlbWVtYmVyIHRvIGRvIHRoaXMgbWFudWFsbHlgKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIFRhZ3Mub2Yoc3VibmV0KS5hZGQodGFnLCAnMScpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZWtzL2xhdGVzdC91c2VyZ3VpZGUvbmV0d29ya19yZXFzLmh0bWxcbiAgICB0YWdBbGxTdWJuZXRzKCdwcml2YXRlJywgdGhpcy52cGMucHJpdmF0ZVN1Ym5ldHMsICdrdWJlcm5ldGVzLmlvL3JvbGUvaW50ZXJuYWwtZWxiJyk7XG4gICAgdGFnQWxsU3VibmV0cygncHVibGljJywgdGhpcy52cGMucHVibGljU3VibmV0cywgJ2t1YmVybmV0ZXMuaW8vcm9sZS9lbGInKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXRjaGVzIHRoZSBDb3JlRE5TIGRlcGxveW1lbnQgY29uZmlndXJhdGlvbiBhbmQgc2V0cyB0aGUgXCJla3MuYW1hem9uYXdzLmNvbS9jb21wdXRlLXR5cGVcIlxuICAgKiBhbm5vdGF0aW9uIHRvIGVpdGhlciBcImVjMlwiIG9yIFwiZmFyZ2F0ZVwiLiBOb3RlIHRoYXQgaWYgXCJlYzJcIiBpcyBzZWxlY3RlZCwgdGhlIHJlc291cmNlIGlzXG4gICAqIG9taXR0ZWQvcmVtb3ZlZCwgc2luY2UgdGhlIGNsdXN0ZXIgaXMgY3JlYXRlZCB3aXRoIHRoZSBcImVjMlwiIGNvbXB1dGUgdHlwZSBieSBkZWZhdWx0LlxuICAgKi9cbiAgcHJpdmF0ZSBkZWZpbmVDb3JlRG5zQ29tcHV0ZVR5cGUodHlwZTogQ29yZURuc0NvbXB1dGVUeXBlKSB7XG4gICAgLy8gZWMyIGlzIHRoZSBcImJ1aWx0IGluXCIgY29tcHV0ZSB0eXBlIG9mIHRoZSBjbHVzdGVyIHNvIGlmIHRoaXMgaXMgdGhlXG4gICAgLy8gcmVxdWVzdGVkIHR5cGUgd2UgY2FuIHNpbXBseSBvbWl0IHRoZSByZXNvdXJjZS4gc2luY2UgdGhlIHJlc291cmNlJ3NcbiAgICAvLyBgcmVzdG9yZVBhdGNoYCBpcyBjb25maWd1cmVkIHRvIHJlc3RvcmUgdGhlIHZhbHVlIHRvIFwiZWMyXCIgdGhpcyBtZWFuc1xuICAgIC8vIHRoYXQgZGVsZXRpb24gb2YgdGhlIHJlc291cmNlIHdpbGwgY2hhbmdlIHRvIFwiZWMyXCIgYXMgd2VsbC5cbiAgICBpZiAodHlwZSA9PT0gQ29yZURuc0NvbXB1dGVUeXBlLkVDMikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHRoaXMgaXMgdGhlIGpzb24gcGF0Y2ggd2UgbWVyZ2UgaW50byB0aGUgcmVzb3VyY2UgYmFzZWQgb2ZmIG9mOlxuICAgIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9la3MvbGF0ZXN0L3VzZXJndWlkZS9mYXJnYXRlLWdldHRpbmctc3RhcnRlZC5odG1sI2ZhcmdhdGUtZ3MtY29yZWRuc1xuICAgIGNvbnN0IHJlbmRlclBhdGNoID0gKGNvbXB1dGVUeXBlOiBDb3JlRG5zQ29tcHV0ZVR5cGUpID0+ICh7XG4gICAgICBzcGVjOiB7XG4gICAgICAgIHRlbXBsYXRlOiB7XG4gICAgICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgICAgIGFubm90YXRpb25zOiB7XG4gICAgICAgICAgICAgICdla3MuYW1hem9uYXdzLmNvbS9jb21wdXRlLXR5cGUnOiBjb21wdXRlVHlwZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBrOHNQYXRjaCA9IG5ldyBLdWJlcm5ldGVzUGF0Y2godGhpcywgJ0NvcmVEbnNDb21wdXRlVHlwZVBhdGNoJywge1xuICAgICAgY2x1c3RlcjogdGhpcyxcbiAgICAgIHJlc291cmNlTmFtZTogJ2RlcGxveW1lbnQvY29yZWRucycsXG4gICAgICByZXNvdXJjZU5hbWVzcGFjZTogJ2t1YmUtc3lzdGVtJyxcbiAgICAgIGFwcGx5UGF0Y2g6IHJlbmRlclBhdGNoKENvcmVEbnNDb21wdXRlVHlwZS5GQVJHQVRFKSxcbiAgICAgIHJlc3RvcmVQYXRjaDogcmVuZGVyUGF0Y2goQ29yZURuc0NvbXB1dGVUeXBlLkVDMiksXG4gICAgfSk7XG5cbiAgICAvLyBJbiBQYXRjaCBkZWxldGlvbiwgaXQgbmVlZHMgdG8gYXBwbHkgdGhlIHJlc3RvcmUgcGF0Y2ggdG8gdGhlIGNsdXN0ZXJcbiAgICAvLyBTbyB0aGUgY2x1c3RlciBhZG1pbiBhY2Nlc3MgY2FuIG9ubHkgYmUgZGVsZXRlZCBhZnRlciB0aGUgcGF0Y2hcbiAgICBpZiAodGhpcy5fY2x1c3RlckFkbWluQWNjZXNzKSB7XG4gICAgICBrOHNQYXRjaC5ub2RlLmFkZERlcGVuZGVuY3kodGhpcy5fY2x1c3RlckFkbWluQWNjZXNzKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciBhZGRpbmcgd29ya2VyIG5vZGVzXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXV0b1NjYWxpbmdHcm91cENhcGFjaXR5T3B0aW9ucyBleHRlbmRzIGF1dG9zY2FsaW5nLkNvbW1vbkF1dG9TY2FsaW5nR3JvdXBQcm9wcyB7XG4gIC8qKlxuICAgKiBJbnN0YW5jZSB0eXBlIG9mIHRoZSBpbnN0YW5jZXMgdG8gc3RhcnRcbiAgICovXG4gIHJlYWRvbmx5IGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZTtcblxuICAvKipcbiAgICogQ29uZmlndXJlcyB0aGUgRUMyIHVzZXItZGF0YSBzY3JpcHQgZm9yIGluc3RhbmNlcyBpbiB0aGlzIGF1dG9zY2FsaW5nIGdyb3VwXG4gICAqIHRvIGJvb3RzdHJhcCB0aGUgbm9kZSAoaW52b2tlIGAvZXRjL2Vrcy9ib290c3RyYXAuc2hgKSBhbmQgYXNzb2NpYXRlIGl0XG4gICAqIHdpdGggdGhlIEVLUyBjbHVzdGVyLlxuICAgKlxuICAgKiBJZiB5b3Ugd2lzaCB0byBwcm92aWRlIGEgY3VzdG9tIHVzZXIgZGF0YSBzY3JpcHQsIHNldCB0aGlzIHRvIGBmYWxzZWAgYW5kXG4gICAqIG1hbnVhbGx5IGludm9rZSBgYXV0b3NjYWxpbmdHcm91cC5hZGRVc2VyRGF0YSgpYC5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgYm9vdHN0cmFwRW5hYmxlZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEVLUyBub2RlIGJvb3RzdHJhcHBpbmcgb3B0aW9ucy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBub25lXG4gICAqL1xuICByZWFkb25seSBib290c3RyYXBPcHRpb25zPzogQm9vdHN0cmFwT3B0aW9ucztcblxuICAvKipcbiAgICogTWFjaGluZSBpbWFnZSB0eXBlXG4gICAqXG4gICAqIEBkZWZhdWx0IE1hY2hpbmVJbWFnZVR5cGUuQU1BWk9OX0xJTlVYXzJcbiAgICovXG4gIHJlYWRvbmx5IG1hY2hpbmVJbWFnZVR5cGU/OiBNYWNoaW5lSW1hZ2VUeXBlO1xufVxuXG4vKipcbiAqIEVLUyBub2RlIGJvb3RzdHJhcHBpbmcgb3B0aW9ucy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBCb290c3RyYXBPcHRpb25zIHtcbiAgLyoqXG4gICAqIFNldHMgYC0tbWF4LXBvZHNgIGZvciB0aGUga3ViZWxldCBiYXNlZCBvbiB0aGUgY2FwYWNpdHkgb2YgdGhlIEVDMiBpbnN0YW5jZS5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgdXNlTWF4UG9kcz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFJlc3RvcmVzIHRoZSBkb2NrZXIgZGVmYXVsdCBicmlkZ2UgbmV0d29yay5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGVuYWJsZURvY2tlckJyaWRnZT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIE51bWJlciBvZiByZXRyeSBhdHRlbXB0cyBmb3IgQVdTIEFQSSBjYWxsIChEZXNjcmliZUNsdXN0ZXIpLlxuICAgKlxuICAgKiBAZGVmYXVsdCAzXG4gICAqL1xuICByZWFkb25seSBhd3NBcGlSZXRyeUF0dGVtcHRzPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgY29udGVudHMgb2YgdGhlIGAvZXRjL2RvY2tlci9kYWVtb24uanNvbmAgZmlsZS4gVXNlZnVsIGlmIHlvdSB3YW50IGFcbiAgICogY3VzdG9tIGNvbmZpZyBkaWZmZXJpbmcgZnJvbSB0aGUgZGVmYXVsdCBvbmUgaW4gdGhlIEVLUyBBTUkuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgZG9ja2VyQ29uZmlnSnNvbj86IHN0cmluZztcblxuICAvKipcbiAgICogT3ZlcnJpZGVzIHRoZSBJUCBhZGRyZXNzIHRvIHVzZSBmb3IgRE5TIHF1ZXJpZXMgd2l0aGluIHRoZVxuICAgKiBjbHVzdGVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIDEwLjEwMC4wLjEwIG9yIDE3Mi4yMC4wLjEwIGJhc2VkIG9uIHRoZSBJUFxuICAgKiBhZGRyZXNzIG9mIHRoZSBwcmltYXJ5IGludGVyZmFjZS5cbiAgICovXG4gIHJlYWRvbmx5IGRuc0NsdXN0ZXJJcD86IHN0cmluZztcblxuICAvKipcbiAgICogRXh0cmEgYXJndW1lbnRzIHRvIGFkZCB0byB0aGUga3ViZWxldC4gVXNlZnVsIGZvciBhZGRpbmcgbGFiZWxzIG9yIHRhaW50cy5cbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIGAtLW5vZGUtbGFiZWxzIGZvbz1iYXIsZ29vPWZhcmAuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkga3ViZWxldEV4dHJhQXJncz86IHN0cmluZztcblxuICAvKipcbiAgICogQWRkaXRpb25hbCBjb21tYW5kIGxpbmUgYXJndW1lbnRzIHRvIHBhc3MgdG8gdGhlIGAvZXRjL2Vrcy9ib290c3RyYXAuc2hgXG4gICAqIGNvbW1hbmQuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2F3c2xhYnMvYW1hem9uLWVrcy1hbWkvYmxvYi9tYXN0ZXIvZmlsZXMvYm9vdHN0cmFwLnNoXG4gICAqIEBkZWZhdWx0IC0gbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgYWRkaXRpb25hbEFyZ3M/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgYWRkaW5nIGFuIEF1dG9TY2FsaW5nR3JvdXAgYXMgY2FwYWNpdHlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBdXRvU2NhbGluZ0dyb3VwT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBDb25maWd1cmVzIHRoZSBFQzIgdXNlci1kYXRhIHNjcmlwdCBmb3IgaW5zdGFuY2VzIGluIHRoaXMgYXV0b3NjYWxpbmcgZ3JvdXBcbiAgICogdG8gYm9vdHN0cmFwIHRoZSBub2RlIChpbnZva2UgYC9ldGMvZWtzL2Jvb3RzdHJhcC5zaGApIGFuZCBhc3NvY2lhdGUgaXRcbiAgICogd2l0aCB0aGUgRUtTIGNsdXN0ZXIuXG4gICAqXG4gICAqIElmIHlvdSB3aXNoIHRvIHByb3ZpZGUgYSBjdXN0b20gdXNlciBkYXRhIHNjcmlwdCwgc2V0IHRoaXMgdG8gYGZhbHNlYCBhbmRcbiAgICogbWFudWFsbHkgaW52b2tlIGBhdXRvc2NhbGluZ0dyb3VwLmFkZFVzZXJEYXRhKClgLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBib290c3RyYXBFbmFibGVkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQWxsb3dzIG9wdGlvbnMgZm9yIG5vZGUgYm9vdHN0cmFwcGluZyB0aHJvdWdoIEVDMiB1c2VyIGRhdGEuXG4gICAqIEBkZWZhdWx0IC0gZGVmYXVsdCBvcHRpb25zXG4gICAqL1xuICByZWFkb25seSBib290c3RyYXBPcHRpb25zPzogQm9vdHN0cmFwT3B0aW9ucztcblxuICAvKipcbiAgICogQWxsb3cgb3B0aW9ucyB0byBzcGVjaWZ5IGRpZmZlcmVudCBtYWNoaW5lIGltYWdlIHR5cGVcbiAgICpcbiAgICogQGRlZmF1bHQgTWFjaGluZUltYWdlVHlwZS5BTUFaT05fTElOVVhfMlxuICAgKi9cbiAgcmVhZG9ubHkgbWFjaGluZUltYWdlVHlwZT86IE1hY2hpbmVJbWFnZVR5cGU7XG59XG5cbi8qKlxuICogSW1wb3J0IGEgY2x1c3RlciB0byB1c2UgaW4gYW5vdGhlciBzdGFja1xuICovXG5AcHJvcGVydHlJbmplY3RhYmxlXG5jbGFzcyBJbXBvcnRlZENsdXN0ZXIgZXh0ZW5kcyBDbHVzdGVyQmFzZSB7XG4gIC8qKiBVbmlxdWVseSBpZGVudGlmaWVzIHRoaXMgY2xhc3MuICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUFJPUEVSVFlfSU5KRUNUSU9OX0lEOiBzdHJpbmcgPSAnQGF3cy1jZGsuYXdzLWVrcy12Mi1hbHBoYS5JbXBvcnRlZENsdXN0ZXInO1xuICBwdWJsaWMgcmVhZG9ubHkgY2x1c3Rlck5hbWU6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IGNsdXN0ZXJBcm46IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IGNvbm5lY3Rpb25zID0gbmV3IGVjMi5Db25uZWN0aW9ucygpO1xuICBwdWJsaWMgcmVhZG9ubHkgaXBGYW1pbHk/OiBJcEZhbWlseTtcbiAgcHVibGljIHJlYWRvbmx5IHBydW5lOiBib29sZWFuO1xuICBwdWJsaWMgcmVhZG9ubHkga3ViZWN0bFByb3ZpZGVyPzogSUt1YmVjdGxQcm92aWRlcjtcblxuICAvLyBzbyB0aGF0IGBjbHVzdGVyU2VjdXJpdHlHcm91cGAgb24gYElDbHVzdGVyYCBjYW4gYmUgY29uZmlndXJlZCB3aXRob3V0IG9wdGlvbmFsaXR5LCBhdm9pZGluZyB1c2VycyBmcm9tIGhhdmluZ1xuICAvLyB0byBudWxsIGNoZWNrIG9uIGFuIGluc3RhbmNlIG9mIGBDbHVzdGVyYCwgd2hpY2ggd2lsbCBhbHdheXMgaGF2ZSB0aGlzIGNvbmZpZ3VyZWQuXG4gIHByaXZhdGUgcmVhZG9ubHkgX2NsdXN0ZXJTZWN1cml0eUdyb3VwPzogZWMyLklTZWN1cml0eUdyb3VwO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByaXZhdGUgcmVhZG9ubHkgcHJvcHM6IENsdXN0ZXJBdHRyaWJ1dGVzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcbiAgICAvLyBFbmhhbmNlZCBDREsgQW5hbHl0aWNzIFRlbGVtZXRyeVxuICAgIGFkZENvbnN0cnVjdE1ldGFkYXRhKHRoaXMsIHByb3BzKTtcblxuICAgIHRoaXMuY2x1c3Rlck5hbWUgPSBwcm9wcy5jbHVzdGVyTmFtZTtcbiAgICB0aGlzLmNsdXN0ZXJBcm4gPSB0aGlzLnN0YWNrLmZvcm1hdEFybihjbHVzdGVyQXJuQ29tcG9uZW50cyhwcm9wcy5jbHVzdGVyTmFtZSkpO1xuICAgIHRoaXMuaXBGYW1pbHkgPSBwcm9wcy5pcEZhbWlseTtcbiAgICB0aGlzLmt1YmVjdGxQcm92aWRlciA9IHByb3BzLmt1YmVjdGxQcm92aWRlcjtcbiAgICB0aGlzLnBydW5lID0gcHJvcHMucHJ1bmUgPz8gdHJ1ZTtcblxuICAgIGxldCBpID0gMTtcbiAgICBmb3IgKGNvbnN0IHNnaWQgb2YgcHJvcHMuc2VjdXJpdHlHcm91cElkcyA/PyBbXSkge1xuICAgICAgdGhpcy5jb25uZWN0aW9ucy5hZGRTZWN1cml0eUdyb3VwKGVjMi5TZWN1cml0eUdyb3VwLmZyb21TZWN1cml0eUdyb3VwSWQodGhpcywgYFNlY3VyaXR5R3JvdXAke2l9YCwgc2dpZCkpO1xuICAgICAgaSsrO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5jbHVzdGVyU2VjdXJpdHlHcm91cElkKSB7XG4gICAgICB0aGlzLl9jbHVzdGVyU2VjdXJpdHlHcm91cCA9IGVjMi5TZWN1cml0eUdyb3VwLmZyb21TZWN1cml0eUdyb3VwSWQodGhpcywgJ0NsdXN0ZXJTZWN1cml0eUdyb3VwJywgdGhpcy5jbHVzdGVyU2VjdXJpdHlHcm91cElkKTtcbiAgICAgIHRoaXMuY29ubmVjdGlvbnMuYWRkU2VjdXJpdHlHcm91cCh0aGlzLl9jbHVzdGVyU2VjdXJpdHlHcm91cCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldCB2cGMoKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLnZwYykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdcInZwY1wiIGlzIG5vdCBkZWZpbmVkIGZvciB0aGlzIGltcG9ydGVkIGNsdXN0ZXInKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucHJvcHMudnBjO1xuICB9XG5cbiAgcHVibGljIGdldCBjbHVzdGVyU2VjdXJpdHlHcm91cCgpOiBlYzIuSVNlY3VyaXR5R3JvdXAge1xuICAgIGlmICghdGhpcy5fY2x1c3RlclNlY3VyaXR5R3JvdXApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignXCJjbHVzdGVyU2VjdXJpdHlHcm91cFwiIGlzIG5vdCBkZWZpbmVkIGZvciB0aGlzIGltcG9ydGVkIGNsdXN0ZXInKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2NsdXN0ZXJTZWN1cml0eUdyb3VwO1xuICB9XG5cbiAgcHVibGljIGdldCBjbHVzdGVyU2VjdXJpdHlHcm91cElkKCk6IHN0cmluZyB7XG4gICAgaWYgKCF0aGlzLnByb3BzLmNsdXN0ZXJTZWN1cml0eUdyb3VwSWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignXCJjbHVzdGVyU2VjdXJpdHlHcm91cElkXCIgaXMgbm90IGRlZmluZWQgZm9yIHRoaXMgaW1wb3J0ZWQgY2x1c3RlcicpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wcm9wcy5jbHVzdGVyU2VjdXJpdHlHcm91cElkO1xuICB9XG5cbiAgcHVibGljIGdldCBjbHVzdGVyRW5kcG9pbnQoKTogc3RyaW5nIHtcbiAgICBpZiAoIXRoaXMucHJvcHMuY2x1c3RlckVuZHBvaW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wiY2x1c3RlckVuZHBvaW50XCIgaXMgbm90IGRlZmluZWQgZm9yIHRoaXMgaW1wb3J0ZWQgY2x1c3RlcicpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wcm9wcy5jbHVzdGVyRW5kcG9pbnQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGNsdXN0ZXJDZXJ0aWZpY2F0ZUF1dGhvcml0eURhdGEoKTogc3RyaW5nIHtcbiAgICBpZiAoIXRoaXMucHJvcHMuY2x1c3RlckNlcnRpZmljYXRlQXV0aG9yaXR5RGF0YSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdcImNsdXN0ZXJDZXJ0aWZpY2F0ZUF1dGhvcml0eURhdGFcIiBpcyBub3QgZGVmaW5lZCBmb3IgdGhpcyBpbXBvcnRlZCBjbHVzdGVyJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnByb3BzLmNsdXN0ZXJDZXJ0aWZpY2F0ZUF1dGhvcml0eURhdGE7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGNsdXN0ZXJFbmNyeXB0aW9uQ29uZmlnS2V5QXJuKCk6IHN0cmluZyB7XG4gICAgaWYgKCF0aGlzLnByb3BzLmNsdXN0ZXJFbmNyeXB0aW9uQ29uZmlnS2V5QXJuKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wiY2x1c3RlckVuY3J5cHRpb25Db25maWdLZXlBcm5cIiBpcyBub3QgZGVmaW5lZCBmb3IgdGhpcyBpbXBvcnRlZCBjbHVzdGVyJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnByb3BzLmNsdXN0ZXJFbmNyeXB0aW9uQ29uZmlnS2V5QXJuO1xuICB9XG5cbiAgcHVibGljIGdldCBvcGVuSWRDb25uZWN0UHJvdmlkZXIoKTogaWFtLklPcGVuSWRDb25uZWN0UHJvdmlkZXIge1xuICAgIGlmICghdGhpcy5wcm9wcy5vcGVuSWRDb25uZWN0UHJvdmlkZXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignXCJvcGVuSWRDb25uZWN0UHJvdmlkZXJcIiBpcyBub3QgZGVmaW5lZCBmb3IgdGhpcyBpbXBvcnRlZCBjbHVzdGVyJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnByb3BzLm9wZW5JZENvbm5lY3RQcm92aWRlcjtcbiAgfVxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIEVrc09wdGltaXplZEltYWdlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRWtzT3B0aW1pemVkSW1hZ2VQcm9wcyB7XG4gIC8qKlxuICAgKiBXaGF0IGluc3RhbmNlIHR5cGUgdG8gcmV0cmlldmUgdGhlIGltYWdlIGZvciAoc3RhbmRhcmQgb3IgR1BVLW9wdGltaXplZClcbiAgICpcbiAgICogQGRlZmF1bHQgTm9kZVR5cGUuU1RBTkRBUkRcbiAgICovXG4gIHJlYWRvbmx5IG5vZGVUeXBlPzogTm9kZVR5cGU7XG5cbiAgLyoqXG4gICAqIFdoYXQgY3B1IGFyY2hpdGVjdHVyZSB0byByZXRyaWV2ZSB0aGUgaW1hZ2UgZm9yIChhcm02NCBvciB4ODZfNjQpXG4gICAqXG4gICAqIEBkZWZhdWx0IENwdUFyY2guWDg2XzY0XG4gICAqL1xuICByZWFkb25seSBjcHVBcmNoPzogQ3B1QXJjaDtcblxuICAvKipcbiAgICogVGhlIEt1YmVybmV0ZXMgdmVyc2lvbiB0byB1c2VcbiAgICpcbiAgICogQGRlZmF1bHQgLSBUaGUgbGF0ZXN0IHZlcnNpb25cbiAgICovXG4gIHJlYWRvbmx5IGt1YmVybmV0ZXNWZXJzaW9uPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIENvbnN0cnVjdCBhbiBBbWF6b24gTGludXggMiBpbWFnZSBmcm9tIHRoZSBsYXRlc3QgRUtTIE9wdGltaXplZCBBTUkgcHVibGlzaGVkIGluIFNTTVxuICovXG5leHBvcnQgY2xhc3MgRWtzT3B0aW1pemVkSW1hZ2UgaW1wbGVtZW50cyBlYzIuSU1hY2hpbmVJbWFnZSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgbm9kZVR5cGU/OiBOb2RlVHlwZTtcbiAgcHJpdmF0ZSByZWFkb25seSBjcHVBcmNoPzogQ3B1QXJjaDtcbiAgcHJpdmF0ZSByZWFkb25seSBrdWJlcm5ldGVzVmVyc2lvbj86IHN0cmluZztcbiAgcHJpdmF0ZSByZWFkb25seSBhbWlQYXJhbWV0ZXJOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIEVjc09wdGltaXplZEFtaSBjbGFzcy5cbiAgICovXG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihwcm9wczogRWtzT3B0aW1pemVkSW1hZ2VQcm9wcyA9IHt9KSB7XG4gICAgdGhpcy5ub2RlVHlwZSA9IHByb3BzLm5vZGVUeXBlID8/IE5vZGVUeXBlLlNUQU5EQVJEO1xuICAgIHRoaXMuY3B1QXJjaCA9IHByb3BzLmNwdUFyY2ggPz8gQ3B1QXJjaC5YODZfNjQ7XG4gICAgdGhpcy5rdWJlcm5ldGVzVmVyc2lvbiA9IHByb3BzLmt1YmVybmV0ZXNWZXJzaW9uID8/IExBVEVTVF9LVUJFUk5FVEVTX1ZFUlNJT047XG5cbiAgICAvLyBzZXQgdGhlIFNTTSBwYXJhbWV0ZXIgbmFtZVxuICAgIHRoaXMuYW1pUGFyYW1ldGVyTmFtZSA9IGAvYXdzL3NlcnZpY2UvZWtzL29wdGltaXplZC1hbWkvJHt0aGlzLmt1YmVybmV0ZXNWZXJzaW9ufS9gXG4gICAgICArICh0aGlzLm5vZGVUeXBlID09PSBOb2RlVHlwZS5TVEFOREFSRCA/IHRoaXMuY3B1QXJjaCA9PT0gQ3B1QXJjaC5YODZfNjQgP1xuICAgICAgICAnYW1hem9uLWxpbnV4LTIvJyA6ICdhbWF6b24tbGludXgtMi1hcm02NC8nIDogJycpXG4gICAgICArICh0aGlzLm5vZGVUeXBlID09PSBOb2RlVHlwZS5HUFUgPyAnYW1hem9uLWxpbnV4LTItZ3B1LycgOiAnJylcbiAgICAgICsgKHRoaXMubm9kZVR5cGUgPT09IE5vZGVUeXBlLklORkVSRU5USUEgPyAnYW1hem9uLWxpbnV4LTItZ3B1LycgOiAnJylcbiAgICAgICsgKHRoaXMubm9kZVR5cGUgPT09IE5vZGVUeXBlLlRSQUlOSVVNID8gJ2FtYXpvbi1saW51eC0yLWdwdS8nIDogJycpXG4gICAgICArICdyZWNvbW1lbmRlZC9pbWFnZV9pZCc7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBjb3JyZWN0IGltYWdlXG4gICAqL1xuICBwdWJsaWMgZ2V0SW1hZ2Uoc2NvcGU6IENvbnN0cnVjdCk6IGVjMi5NYWNoaW5lSW1hZ2VDb25maWcge1xuICAgIGNvbnN0IGFtaSA9IHNzbS5TdHJpbmdQYXJhbWV0ZXIudmFsdWVGb3JTdHJpbmdQYXJhbWV0ZXIoc2NvcGUsIHRoaXMuYW1pUGFyYW1ldGVyTmFtZSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGltYWdlSWQ6IGFtaSxcbiAgICAgIG9zVHlwZTogZWMyLk9wZXJhdGluZ1N5c3RlbVR5cGUuTElOVVgsXG4gICAgICB1c2VyRGF0YTogZWMyLlVzZXJEYXRhLmZvckxpbnV4KCksXG4gICAgfTtcbiAgfVxufVxuXG4vLyBNQUlOVEFJTkVSUzogdXNlIC4vc2NyaXB0cy9rdWJlX2J1bXAuc2ggdG8gdXBkYXRlIExBVEVTVF9LVUJFUk5FVEVTX1ZFUlNJT05cbmNvbnN0IExBVEVTVF9LVUJFUk5FVEVTX1ZFUlNJT04gPSAnMS4yNCc7XG5cbi8qKlxuICogV2hldGhlciB0aGUgd29ya2VyIG5vZGVzIHNob3VsZCBzdXBwb3J0IEdQVSBvciBqdXN0IHN0YW5kYXJkIGluc3RhbmNlc1xuICovXG5leHBvcnQgZW51bSBOb2RlVHlwZSB7XG4gIC8qKlxuICAgKiBTdGFuZGFyZCBpbnN0YW5jZXNcbiAgICovXG4gIFNUQU5EQVJEID0gJ1N0YW5kYXJkJyxcblxuICAvKipcbiAgICogR1BVIGluc3RhbmNlc1xuICAgKi9cbiAgR1BVID0gJ0dQVScsXG5cbiAgLyoqXG4gICAqIEluZmVyZW50aWEgaW5zdGFuY2VzXG4gICAqL1xuICBJTkZFUkVOVElBID0gJ0lORkVSRU5USUEnLFxuXG4gIC8qKlxuICAgKiBUcmFpbml1bSBpbnN0YW5jZXNcbiAgICovXG4gIFRSQUlOSVVNID0gJ1RSQUlOSVVNJyxcbn1cblxuLyoqXG4gKiBDUFUgYXJjaGl0ZWN0dXJlXG4gKi9cbmV4cG9ydCBlbnVtIENwdUFyY2gge1xuICAvKipcbiAgICogYXJtNjQgQ1BVIHR5cGVcbiAgICovXG4gIEFSTV82NCA9ICdhcm02NCcsXG5cbiAgLyoqXG4gICAqIHg4Nl82NCBDUFUgdHlwZVxuICAgKi9cbiAgWDg2XzY0ID0gJ3g4Nl82NCcsXG59XG5cbi8qKlxuICogVGhlIHR5cGUgb2YgY29tcHV0ZSByZXNvdXJjZXMgdG8gdXNlIGZvciBDb3JlRE5TLlxuICovXG5leHBvcnQgZW51bSBDb3JlRG5zQ29tcHV0ZVR5cGUge1xuICAvKipcbiAgICogRGVwbG95IENvcmVETlMgb24gRUMyIGluc3RhbmNlcy5cbiAgICovXG4gIEVDMiA9ICdlYzInLFxuXG4gIC8qKlxuICAgKiBEZXBsb3kgQ29yZUROUyBvbiBGYXJnYXRlLW1hbmFnZWQgaW5zdGFuY2VzLlxuICAgKi9cbiAgRkFSR0FURSA9ICdmYXJnYXRlJyxcbn1cblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBjYXBhY2l0eSB0eXBlIGZvciB0aGUgY2x1c3RlclxuICovXG5leHBvcnQgZW51bSBEZWZhdWx0Q2FwYWNpdHlUeXBlIHtcbiAgLyoqXG4gICAqIG1hbmFnZWQgbm9kZSBncm91cFxuICAgKi9cbiAgTk9ERUdST1VQLFxuICAvKipcbiAgICogRUMyIGF1dG9zY2FsaW5nIGdyb3VwXG4gICAqL1xuICBFQzIsXG4gIC8qKlxuICAgKiBBdXRvIE1vZGVcbiAgICovXG4gIEFVVE9NT0RFLFxufVxuXG4vKipcbiAqIFRoZSBtYWNoaW5lIGltYWdlIHR5cGVcbiAqL1xuZXhwb3J0IGVudW0gTWFjaGluZUltYWdlVHlwZSB7XG4gIC8qKlxuICAgKiBBbWF6b24gRUtTLW9wdGltaXplZCBMaW51eCBBTUlcbiAgICovXG4gIEFNQVpPTl9MSU5VWF8yLFxuICAvKipcbiAgICogQm90dGxlcm9ja2V0IEFNSVxuICAgKi9cbiAgQk9UVExFUk9DS0VULFxufVxuXG5mdW5jdGlvbiBub2RlVHlwZUZvckluc3RhbmNlVHlwZShpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUpIHtcbiAgaWYgKElOU1RBTkNFX1RZUEVTLmdwdS5pbmNsdWRlcyhpbnN0YW5jZVR5cGUudG9TdHJpbmcoKS5zdWJzdHJpbmcoMCwgMikpKSB7XG4gICAgcmV0dXJuIE5vZGVUeXBlLkdQVTtcbiAgfSBlbHNlIGlmIChJTlNUQU5DRV9UWVBFUy5pbmZlcmVudGlhLmluY2x1ZGVzKGluc3RhbmNlVHlwZS50b1N0cmluZygpLnN1YnN0cmluZygwLCA0KSkpIHtcbiAgICByZXR1cm4gTm9kZVR5cGUuSU5GRVJFTlRJQTtcbiAgfSBlbHNlIGlmIChJTlNUQU5DRV9UWVBFUy50cmFpbml1bS5pbmNsdWRlcyhpbnN0YW5jZVR5cGUudG9TdHJpbmcoKS5zdWJzdHJpbmcoMCwgNCkpKSB7XG4gICAgcmV0dXJuIE5vZGVUeXBlLlRSQUlOSVVNO1xuICB9XG4gIHJldHVybiBOb2RlVHlwZS5TVEFOREFSRDtcbn1cblxuZnVuY3Rpb24gY3B1QXJjaEZvckluc3RhbmNlVHlwZShpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUpIHtcbiAgcmV0dXJuIElOU1RBTkNFX1RZUEVTLmdyYXZpdG9uMi5pbmNsdWRlcyhpbnN0YW5jZVR5cGUudG9TdHJpbmcoKS5zdWJzdHJpbmcoMCwgMykpID8gQ3B1QXJjaC5BUk1fNjQgOlxuICAgIElOU1RBTkNFX1RZUEVTLmdyYXZpdG9uMy5pbmNsdWRlcyhpbnN0YW5jZVR5cGUudG9TdHJpbmcoKS5zdWJzdHJpbmcoMCwgMykpID8gQ3B1QXJjaC5BUk1fNjQgOlxuICAgICAgSU5TVEFOQ0VfVFlQRVMuZ3Jhdml0b24uaW5jbHVkZXMoaW5zdGFuY2VUeXBlLnRvU3RyaW5nKCkuc3Vic3RyaW5nKDAsIDIpKSA/IENwdUFyY2guQVJNXzY0IDpcbiAgICAgICAgQ3B1QXJjaC5YODZfNjQ7XG59XG5cbmZ1bmN0aW9uIGZsYXR0ZW48QT4oeHNzOiBBW11bXSk6IEFbXSB7XG4gIHJldHVybiBBcnJheS5wcm90b3R5cGUuY29uY2F0LmNhbGwoW10sIC4uLnhzcyk7XG59XG5cbmZ1bmN0aW9uIGNsdXN0ZXJBcm5Db21wb25lbnRzKGNsdXN0ZXJOYW1lOiBzdHJpbmcpOiBBcm5Db21wb25lbnRzIHtcbiAgcmV0dXJuIHtcbiAgICBzZXJ2aWNlOiAnZWtzJyxcbiAgICByZXNvdXJjZTogJ2NsdXN0ZXInLFxuICAgIHJlc291cmNlTmFtZTogY2x1c3Rlck5hbWUsXG4gIH07XG59XG4iXX0=