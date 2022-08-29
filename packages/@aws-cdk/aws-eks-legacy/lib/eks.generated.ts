// Copyright 2012-2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2022-07-20T17:41:03.913Z","fingerprint":"lvuTd8rSdr608TiizuwCnwBY0tEcTOnHR2nODIlWrMo="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnAddon`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html
 */
export interface CfnAddonProps {

    /**
     * The name of the add-on.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-addonname
     */
    readonly addonName: string;

    /**
     * The name of the cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-clustername
     */
    readonly clusterName: string;

    /**
     * The version of the add-on.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-addonversion
     */
    readonly addonVersion?: string;

    /**
     * How to resolve parameter value conflicts when migrating an existing add-on to an Amazon EKS add-on.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-resolveconflicts
     */
    readonly resolveConflicts?: string;

    /**
     * The Amazon Resource Name (ARN) of an existing IAM role to bind to the add-on's service account. The role must be assigned the IAM permissions required by the add-on. If you don't specify an existing IAM role, then the add-on uses the permissions assigned to the node IAM role. For more information, see [Amazon EKS node IAM role](https://docs.aws.amazon.com/eks/latest/userguide/create-node-role.html) in the *Amazon EKS User Guide* .
     *
     * > To specify an existing IAM role, you must have an IAM OpenID Connect (OIDC) provider created for your cluster. For more information, see [Enabling IAM roles for service accounts on your cluster](https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html) in the *Amazon EKS User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-serviceaccountrolearn
     */
    readonly serviceAccountRoleArn?: string;

    /**
     * The metadata that you apply to the add-on to assist with categorization and organization. Each tag consists of a key and an optional value, both of which you define. Add-on tags do not propagate to any other resources associated with the cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnAddonProps`
 *
 * @param properties - the TypeScript properties of a `CfnAddonProps`
 *
 * @returns the result of the validation.
 */
function CfnAddonPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('addonName', cdk.requiredValidator)(properties.addonName));
    errors.collect(cdk.propertyValidator('addonName', cdk.validateString)(properties.addonName));
    errors.collect(cdk.propertyValidator('addonVersion', cdk.validateString)(properties.addonVersion));
    errors.collect(cdk.propertyValidator('clusterName', cdk.requiredValidator)(properties.clusterName));
    errors.collect(cdk.propertyValidator('clusterName', cdk.validateString)(properties.clusterName));
    errors.collect(cdk.propertyValidator('resolveConflicts', cdk.validateString)(properties.resolveConflicts));
    errors.collect(cdk.propertyValidator('serviceAccountRoleArn', cdk.validateString)(properties.serviceAccountRoleArn));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnAddonProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EKS::Addon` resource
 *
 * @param properties - the TypeScript properties of a `CfnAddonProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EKS::Addon` resource.
 */
// @ts-ignore TS6133
function cfnAddonPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnAddonPropsValidator(properties).assertSuccess();
    return {
        AddonName: cdk.stringToCloudFormation(properties.addonName),
        ClusterName: cdk.stringToCloudFormation(properties.clusterName),
        AddonVersion: cdk.stringToCloudFormation(properties.addonVersion),
        ResolveConflicts: cdk.stringToCloudFormation(properties.resolveConflicts),
        ServiceAccountRoleArn: cdk.stringToCloudFormation(properties.serviceAccountRoleArn),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnAddonPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAddonProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAddonProps>();
    ret.addPropertyResult('addonName', 'AddonName', cfn_parse.FromCloudFormation.getString(properties.AddonName));
    ret.addPropertyResult('clusterName', 'ClusterName', cfn_parse.FromCloudFormation.getString(properties.ClusterName));
    ret.addPropertyResult('addonVersion', 'AddonVersion', properties.AddonVersion != null ? cfn_parse.FromCloudFormation.getString(properties.AddonVersion) : undefined);
    ret.addPropertyResult('resolveConflicts', 'ResolveConflicts', properties.ResolveConflicts != null ? cfn_parse.FromCloudFormation.getString(properties.ResolveConflicts) : undefined);
    ret.addPropertyResult('serviceAccountRoleArn', 'ServiceAccountRoleArn', properties.ServiceAccountRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceAccountRoleArn) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::EKS::Addon`
 *
 * Creates an Amazon EKS add-on.
 *
 * Amazon EKS add-ons help to automate the provisioning and lifecycle management of common operational software for Amazon EKS clusters. Amazon EKS add-ons require clusters running version 1.18 or later because Amazon EKS add-ons rely on the Server-side Apply Kubernetes feature, which is only available in Kubernetes 1.18 and later. For more information, see [Amazon EKS add-ons](https://docs.aws.amazon.com/eks/latest/userguide/eks-add-ons.html) in the *Amazon EKS User Guide* .
 *
 * @cloudformationResource AWS::EKS::Addon
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html
 */
export class CfnAddon extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::EKS::Addon";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAddon {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnAddonPropsFromCloudFormation(resourceProperties);
        const ret = new CfnAddon(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the add-on, such as `arn:aws:eks:us-west-2:111122223333:addon/1-19/vpc-cni/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The name of the add-on.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-addonname
     */
    public addonName: string;

    /**
     * The name of the cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-clustername
     */
    public clusterName: string;

    /**
     * The version of the add-on.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-addonversion
     */
    public addonVersion: string | undefined;

    /**
     * How to resolve parameter value conflicts when migrating an existing add-on to an Amazon EKS add-on.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-resolveconflicts
     */
    public resolveConflicts: string | undefined;

    /**
     * The Amazon Resource Name (ARN) of an existing IAM role to bind to the add-on's service account. The role must be assigned the IAM permissions required by the add-on. If you don't specify an existing IAM role, then the add-on uses the permissions assigned to the node IAM role. For more information, see [Amazon EKS node IAM role](https://docs.aws.amazon.com/eks/latest/userguide/create-node-role.html) in the *Amazon EKS User Guide* .
     *
     * > To specify an existing IAM role, you must have an IAM OpenID Connect (OIDC) provider created for your cluster. For more information, see [Enabling IAM roles for service accounts on your cluster](https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html) in the *Amazon EKS User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-serviceaccountrolearn
     */
    public serviceAccountRoleArn: string | undefined;

    /**
     * The metadata that you apply to the add-on to assist with categorization and organization. Each tag consists of a key and an optional value, both of which you define. Add-on tags do not propagate to any other resources associated with the cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::EKS::Addon`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAddonProps) {
        super(scope, id, { type: CfnAddon.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'addonName', this);
        cdk.requireProperty(props, 'clusterName', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn'));

        this.addonName = props.addonName;
        this.clusterName = props.clusterName;
        this.addonVersion = props.addonVersion;
        this.resolveConflicts = props.resolveConflicts;
        this.serviceAccountRoleArn = props.serviceAccountRoleArn;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::EKS::Addon", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAddon.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            addonName: this.addonName,
            clusterName: this.clusterName,
            addonVersion: this.addonVersion,
            resolveConflicts: this.resolveConflicts,
            serviceAccountRoleArn: this.serviceAccountRoleArn,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnAddonPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnCluster`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html
 */
export interface CfnClusterProps {

    /**
     * The VPC configuration that's used by the cluster control plane. Amazon EKS VPC resources have specific requirements to work properly with Kubernetes. For more information, see [Cluster VPC Considerations](https://docs.aws.amazon.com/eks/latest/userguide/network_reqs.html) and [Cluster Security Group Considerations](https://docs.aws.amazon.com/eks/latest/userguide/sec-group-reqs.html) in the *Amazon EKS User Guide* . You must specify at least two subnets. You can specify up to five security groups, but we recommend that you use a dedicated security group for your cluster control plane.
     *
     * > Updates require replacement of the `SecurityGroupIds` and `SubnetIds` sub-properties.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-resourcesvpcconfig
     */
    readonly resourcesVpcConfig: CfnCluster.ResourcesVpcConfigProperty | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the IAM role that provides permissions for the Kubernetes control plane to make calls to AWS API operations on your behalf. For more information, see [Amazon EKS Service IAM Role](https://docs.aws.amazon.com/eks/latest/userguide/service_IAM_role.html) in the **Amazon EKS User Guide** .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-rolearn
     */
    readonly roleArn: string;

    /**
     * The encryption configuration for the cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-encryptionconfig
     */
    readonly encryptionConfig?: Array<CfnCluster.EncryptionConfigProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The Kubernetes network configuration for the cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-kubernetesnetworkconfig
     */
    readonly kubernetesNetworkConfig?: CfnCluster.KubernetesNetworkConfigProperty | cdk.IResolvable;

    /**
     * The logging configuration for your cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-logging
     */
    readonly logging?: CfnCluster.LoggingProperty | cdk.IResolvable;

    /**
     * The unique name to give to your cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-name
     */
    readonly name?: string;

    /**
     * The metadata that you apply to the cluster to assist with categorization and organization. Each tag consists of a key and an optional value, both of which you define. Cluster tags don't propagate to any other resources associated with the cluster.
     *
     * > You must have the `eks:TagResource` and `eks:UntagResource` permissions in your IAM user or IAM role used to manage the CloudFormation stack. If you don't have these permissions, there might be unexpected behavior with stack-level tags propagating to the resource during resource creation and update.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The desired Kubernetes version for your cluster. If you don't specify a value here, the latest version available in Amazon EKS is used.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-version
     */
    readonly version?: string;
}

/**
 * Determine whether the given properties match those of a `CfnClusterProps`
 *
 * @param properties - the TypeScript properties of a `CfnClusterProps`
 *
 * @returns the result of the validation.
 */
function CfnClusterPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('encryptionConfig', cdk.listValidator(CfnCluster_EncryptionConfigPropertyValidator))(properties.encryptionConfig));
    errors.collect(cdk.propertyValidator('kubernetesNetworkConfig', CfnCluster_KubernetesNetworkConfigPropertyValidator)(properties.kubernetesNetworkConfig));
    errors.collect(cdk.propertyValidator('logging', CfnCluster_LoggingPropertyValidator)(properties.logging));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('resourcesVpcConfig', cdk.requiredValidator)(properties.resourcesVpcConfig));
    errors.collect(cdk.propertyValidator('resourcesVpcConfig', CfnCluster_ResourcesVpcConfigPropertyValidator)(properties.resourcesVpcConfig));
    errors.collect(cdk.propertyValidator('roleArn', cdk.requiredValidator)(properties.roleArn));
    errors.collect(cdk.propertyValidator('roleArn', cdk.validateString)(properties.roleArn));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('version', cdk.validateString)(properties.version));
    return errors.wrap('supplied properties not correct for "CfnClusterProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EKS::Cluster` resource
 *
 * @param properties - the TypeScript properties of a `CfnClusterProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EKS::Cluster` resource.
 */
// @ts-ignore TS6133
function cfnClusterPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnClusterPropsValidator(properties).assertSuccess();
    return {
        ResourcesVpcConfig: cfnClusterResourcesVpcConfigPropertyToCloudFormation(properties.resourcesVpcConfig),
        RoleArn: cdk.stringToCloudFormation(properties.roleArn),
        EncryptionConfig: cdk.listMapper(cfnClusterEncryptionConfigPropertyToCloudFormation)(properties.encryptionConfig),
        KubernetesNetworkConfig: cfnClusterKubernetesNetworkConfigPropertyToCloudFormation(properties.kubernetesNetworkConfig),
        Logging: cfnClusterLoggingPropertyToCloudFormation(properties.logging),
        Name: cdk.stringToCloudFormation(properties.name),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        Version: cdk.stringToCloudFormation(properties.version),
    };
}

// @ts-ignore TS6133
function CfnClusterPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnClusterProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnClusterProps>();
    ret.addPropertyResult('resourcesVpcConfig', 'ResourcesVpcConfig', CfnClusterResourcesVpcConfigPropertyFromCloudFormation(properties.ResourcesVpcConfig));
    ret.addPropertyResult('roleArn', 'RoleArn', cfn_parse.FromCloudFormation.getString(properties.RoleArn));
    ret.addPropertyResult('encryptionConfig', 'EncryptionConfig', properties.EncryptionConfig != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterEncryptionConfigPropertyFromCloudFormation)(properties.EncryptionConfig) : undefined);
    ret.addPropertyResult('kubernetesNetworkConfig', 'KubernetesNetworkConfig', properties.KubernetesNetworkConfig != null ? CfnClusterKubernetesNetworkConfigPropertyFromCloudFormation(properties.KubernetesNetworkConfig) : undefined);
    ret.addPropertyResult('logging', 'Logging', properties.Logging != null ? CfnClusterLoggingPropertyFromCloudFormation(properties.Logging) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('version', 'Version', properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::EKS::Cluster`
 *
 * Creates an Amazon EKS control plane.
 *
 * The Amazon EKS control plane consists of control plane instances that run the Kubernetes software, such as `etcd` and the API server. The control plane runs in an account managed by AWS , and the Kubernetes API is exposed by the Amazon EKS API server endpoint. Each Amazon EKS cluster control plane is single tenant and unique. It runs on its own set of Amazon EC2 instances.
 *
 * The cluster control plane is provisioned across multiple Availability Zones and fronted by an Elastic Load Balancing Network Load Balancer. Amazon EKS also provisions elastic network interfaces in your VPC subnets to provide connectivity from the control plane instances to the nodes (for example, to support `kubectl exec` , `logs` , and `proxy` data flows).
 *
 * Amazon EKS nodes run in your AWS account and connect to your cluster's control plane over the Kubernetes API server endpoint and a certificate file that is created for your cluster.
 *
 * In most cases, it takes several minutes to create a cluster. After you create an Amazon EKS cluster, you must configure your Kubernetes tooling to communicate with the API server and launch nodes into your cluster. For more information, see [Managing Cluster Authentication](https://docs.aws.amazon.com/eks/latest/userguide/managing-auth.html) and [Launching Amazon EKS nodes](https://docs.aws.amazon.com/eks/latest/userguide/launch-workers.html) in the *Amazon EKS User Guide* .
 *
 * @cloudformationResource AWS::EKS::Cluster
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html
 */
export class CfnCluster extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::EKS::Cluster";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCluster {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnClusterPropsFromCloudFormation(resourceProperties);
        const ret = new CfnCluster(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the cluster, such as `arn:aws:eks:us-west-2:666666666666:cluster/prod` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The `certificate-authority-data` for your cluster.
     * @cloudformationAttribute CertificateAuthorityData
     */
    public readonly attrCertificateAuthorityData: string;

    /**
     * The cluster security group that was created by Amazon EKS for the cluster. Managed node groups use this security group for control plane to data plane communication.
     *
     * This parameter is only returned by Amazon EKS clusters that support managed node groups. For more information, see [Managed node groups](https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html) in the *Amazon EKS User Guide* .
     * @cloudformationAttribute ClusterSecurityGroupId
     */
    public readonly attrClusterSecurityGroupId: string;

    /**
     * Amazon Resource Name (ARN) or alias of the customer master key (CMK).
     * @cloudformationAttribute EncryptionConfigKeyArn
     */
    public readonly attrEncryptionConfigKeyArn: string;

    /**
     * The endpoint for your Kubernetes API server, such as `https://5E1D0CEXAMPLEA591B746AFC5AB30262.yl4.us-west-2.eks.amazonaws.com` .
     * @cloudformationAttribute Endpoint
     */
    public readonly attrEndpoint: string;

    /**
     * The CIDR block that Kubernetes Service IP addresses are assigned from if you created a 1.21 or later cluster with version 1.10.1 or later of the Amazon VPC CNI add-on and specified `ipv6` for *ipFamily* when you created the cluster. Kubernetes assigns Service addresses from the unique local address range ( `fc00::/7` ) because you can't specify a custom IPv6 CIDR block when you create the cluster.
     * @cloudformationAttribute KubernetesNetworkConfig.ServiceIpv6Cidr
     */
    public readonly attrKubernetesNetworkConfigServiceIpv6Cidr: string;

    /**
     * The issuer URL for the OIDC identity provider.
     * @cloudformationAttribute OpenIdConnectIssuerUrl
     */
    public readonly attrOpenIdConnectIssuerUrl: string;

    /**
     * The VPC configuration that's used by the cluster control plane. Amazon EKS VPC resources have specific requirements to work properly with Kubernetes. For more information, see [Cluster VPC Considerations](https://docs.aws.amazon.com/eks/latest/userguide/network_reqs.html) and [Cluster Security Group Considerations](https://docs.aws.amazon.com/eks/latest/userguide/sec-group-reqs.html) in the *Amazon EKS User Guide* . You must specify at least two subnets. You can specify up to five security groups, but we recommend that you use a dedicated security group for your cluster control plane.
     *
     * > Updates require replacement of the `SecurityGroupIds` and `SubnetIds` sub-properties.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-resourcesvpcconfig
     */
    public resourcesVpcConfig: CfnCluster.ResourcesVpcConfigProperty | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the IAM role that provides permissions for the Kubernetes control plane to make calls to AWS API operations on your behalf. For more information, see [Amazon EKS Service IAM Role](https://docs.aws.amazon.com/eks/latest/userguide/service_IAM_role.html) in the **Amazon EKS User Guide** .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-rolearn
     */
    public roleArn: string;

    /**
     * The encryption configuration for the cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-encryptionconfig
     */
    public encryptionConfig: Array<CfnCluster.EncryptionConfigProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The Kubernetes network configuration for the cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-kubernetesnetworkconfig
     */
    public kubernetesNetworkConfig: CfnCluster.KubernetesNetworkConfigProperty | cdk.IResolvable | undefined;

    /**
     * The logging configuration for your cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-logging
     */
    public logging: CfnCluster.LoggingProperty | cdk.IResolvable | undefined;

    /**
     * The unique name to give to your cluster.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-name
     */
    public name: string | undefined;

    /**
     * The metadata that you apply to the cluster to assist with categorization and organization. Each tag consists of a key and an optional value, both of which you define. Cluster tags don't propagate to any other resources associated with the cluster.
     *
     * > You must have the `eks:TagResource` and `eks:UntagResource` permissions in your IAM user or IAM role used to manage the CloudFormation stack. If you don't have these permissions, there might be unexpected behavior with stack-level tags propagating to the resource during resource creation and update.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The desired Kubernetes version for your cluster. If you don't specify a value here, the latest version available in Amazon EKS is used.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-version
     */
    public version: string | undefined;

    /**
     * Create a new `AWS::EKS::Cluster`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnClusterProps) {
        super(scope, id, { type: CfnCluster.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'resourcesVpcConfig', this);
        cdk.requireProperty(props, 'roleArn', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn'));
        this.attrCertificateAuthorityData = cdk.Token.asString(this.getAtt('CertificateAuthorityData'));
        this.attrClusterSecurityGroupId = cdk.Token.asString(this.getAtt('ClusterSecurityGroupId'));
        this.attrEncryptionConfigKeyArn = cdk.Token.asString(this.getAtt('EncryptionConfigKeyArn'));
        this.attrEndpoint = cdk.Token.asString(this.getAtt('Endpoint'));
        this.attrKubernetesNetworkConfigServiceIpv6Cidr = cdk.Token.asString(this.getAtt('KubernetesNetworkConfig.ServiceIpv6Cidr'));
        this.attrOpenIdConnectIssuerUrl = cdk.Token.asString(this.getAtt('OpenIdConnectIssuerUrl'));

        this.resourcesVpcConfig = props.resourcesVpcConfig;
        this.roleArn = props.roleArn;
        this.encryptionConfig = props.encryptionConfig;
        this.kubernetesNetworkConfig = props.kubernetesNetworkConfig;
        this.logging = props.logging;
        this.name = props.name;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::EKS::Cluster", props.tags, { tagPropertyName: 'tags' });
        this.version = props.version;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnCluster.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            resourcesVpcConfig: this.resourcesVpcConfig,
            roleArn: this.roleArn,
            encryptionConfig: this.encryptionConfig,
            kubernetesNetworkConfig: this.kubernetesNetworkConfig,
            logging: this.logging,
            name: this.name,
            tags: this.tags.renderTags(),
            version: this.version,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnClusterPropsToCloudFormation(props);
    }
}

export namespace CfnCluster {
    /**
     * The cluster control plane logging configuration for your cluster.
     *
     * > When updating a resource, you must include this `ClusterLogging` property if the previous CloudFormation template of the resource had it.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-clusterlogging.html
     */
    export interface ClusterLoggingProperty {
        /**
         * The enabled control plane logs for your cluster. All log types are disabled if the array is empty.
         *
         * > When updating a resource, you must include this `EnabledTypes` property if the previous CloudFormation template of the resource had it.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-clusterlogging.html#cfn-eks-cluster-clusterlogging-enabledtypes
         */
        readonly enabledTypes?: Array<CfnCluster.LoggingTypeConfigProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `ClusterLoggingProperty`
 *
 * @param properties - the TypeScript properties of a `ClusterLoggingProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_ClusterLoggingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('enabledTypes', cdk.listValidator(CfnCluster_LoggingTypeConfigPropertyValidator))(properties.enabledTypes));
    return errors.wrap('supplied properties not correct for "ClusterLoggingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EKS::Cluster.ClusterLogging` resource
 *
 * @param properties - the TypeScript properties of a `ClusterLoggingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EKS::Cluster.ClusterLogging` resource.
 */
// @ts-ignore TS6133
function cfnClusterClusterLoggingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_ClusterLoggingPropertyValidator(properties).assertSuccess();
    return {
        EnabledTypes: cdk.listMapper(cfnClusterLoggingTypeConfigPropertyToCloudFormation)(properties.enabledTypes),
    };
}

// @ts-ignore TS6133
function CfnClusterClusterLoggingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.ClusterLoggingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ClusterLoggingProperty>();
    ret.addPropertyResult('enabledTypes', 'EnabledTypes', properties.EnabledTypes != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterLoggingTypeConfigPropertyFromCloudFormation)(properties.EnabledTypes) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * The encryption configuration for the cluster.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-encryptionconfig.html
     */
    export interface EncryptionConfigProperty {
        /**
         * The encryption provider for the cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-encryptionconfig.html#cfn-eks-cluster-encryptionconfig-provider
         */
        readonly provider?: CfnCluster.ProviderProperty | cdk.IResolvable;
        /**
         * Specifies the resources to be encrypted. The only supported value is "secrets".
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-encryptionconfig.html#cfn-eks-cluster-encryptionconfig-resources
         */
        readonly resources?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `EncryptionConfigProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_EncryptionConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('provider', CfnCluster_ProviderPropertyValidator)(properties.provider));
    errors.collect(cdk.propertyValidator('resources', cdk.listValidator(cdk.validateString))(properties.resources));
    return errors.wrap('supplied properties not correct for "EncryptionConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EKS::Cluster.EncryptionConfig` resource
 *
 * @param properties - the TypeScript properties of a `EncryptionConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EKS::Cluster.EncryptionConfig` resource.
 */
// @ts-ignore TS6133
function cfnClusterEncryptionConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_EncryptionConfigPropertyValidator(properties).assertSuccess();
    return {
        Provider: cfnClusterProviderPropertyToCloudFormation(properties.provider),
        Resources: cdk.listMapper(cdk.stringToCloudFormation)(properties.resources),
    };
}

// @ts-ignore TS6133
function CfnClusterEncryptionConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.EncryptionConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.EncryptionConfigProperty>();
    ret.addPropertyResult('provider', 'Provider', properties.Provider != null ? CfnClusterProviderPropertyFromCloudFormation(properties.Provider) : undefined);
    ret.addPropertyResult('resources', 'Resources', properties.Resources != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Resources) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * The Kubernetes network configuration for the cluster.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-kubernetesnetworkconfig.html
     */
    export interface KubernetesNetworkConfigProperty {
        /**
         * Specify which IP family is used to assign Kubernetes pod and service IP addresses. If you don't specify a value, `ipv4` is used by default. You can only specify an IP family when you create a cluster and can't change this value once the cluster is created. If you specify `ipv6` , the VPC and subnets that you specify for cluster creation must have both IPv4 and IPv6 CIDR blocks assigned to them. You can't specify `ipv6` for clusters in China Regions.
         *
         * You can only specify `ipv6` for 1.21 and later clusters that use version 1.10.1 or later of the Amazon VPC CNI add-on. If you specify `ipv6` , then ensure that your VPC meets the requirements listed in the considerations listed in [Assigning IPv6 addresses to pods and services](https://docs.aws.amazon.com/eks/latest/userguide/cni-ipv6.html) in the Amazon EKS User Guide. Kubernetes assigns services IPv6 addresses from the unique local address range (fc00::/7). You can't specify a custom IPv6 CIDR block. Pod addresses are assigned from the subnet's IPv6 CIDR.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-kubernetesnetworkconfig.html#cfn-eks-cluster-kubernetesnetworkconfig-ipfamily
         */
        readonly ipFamily?: string;
        /**
         * Don't specify a value if you select `ipv6` for *ipFamily* . The CIDR block to assign Kubernetes service IP addresses from. If you don't specify a block, Kubernetes assigns addresses from either the 10.100.0.0/16 or 172.20.0.0/16 CIDR blocks. We recommend that you specify a block that does not overlap with resources in other networks that are peered or connected to your VPC. The block must meet the following requirements:
         *
         * - Within one of the following private IP address blocks: 10.0.0.0/8, 172.16.0.0/12, or 192.168.0.0/16.
         * - Doesn't overlap with any CIDR block assigned to the VPC that you selected for VPC.
         * - Between /24 and /12.
         *
         * > You can only specify a custom CIDR block when you create a cluster and can't change this value once the cluster is created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-kubernetesnetworkconfig.html#cfn-eks-cluster-kubernetesnetworkconfig-serviceipv4cidr
         */
        readonly serviceIpv4Cidr?: string;
        /**
         * The CIDR block that Kubernetes pod and service IP addresses are assigned from if you created a 1.21 or later cluster with version 1.10.1 or later of the Amazon VPC CNI add-on and specified `ipv6` for *ipFamily* when you created the cluster. Kubernetes assigns service addresses from the unique local address range ( `fc00::/7` ) because you can't specify a custom IPv6 CIDR block when you create the cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-kubernetesnetworkconfig.html#cfn-eks-cluster-kubernetesnetworkconfig-serviceipv6cidr
         */
        readonly serviceIpv6Cidr?: string;
    }
}

/**
 * Determine whether the given properties match those of a `KubernetesNetworkConfigProperty`
 *
 * @param properties - the TypeScript properties of a `KubernetesNetworkConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_KubernetesNetworkConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('ipFamily', cdk.validateString)(properties.ipFamily));
    errors.collect(cdk.propertyValidator('serviceIpv4Cidr', cdk.validateString)(properties.serviceIpv4Cidr));
    errors.collect(cdk.propertyValidator('serviceIpv6Cidr', cdk.validateString)(properties.serviceIpv6Cidr));
    return errors.wrap('supplied properties not correct for "KubernetesNetworkConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EKS::Cluster.KubernetesNetworkConfig` resource
 *
 * @param properties - the TypeScript properties of a `KubernetesNetworkConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EKS::Cluster.KubernetesNetworkConfig` resource.
 */
// @ts-ignore TS6133
function cfnClusterKubernetesNetworkConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_KubernetesNetworkConfigPropertyValidator(properties).assertSuccess();
    return {
        IpFamily: cdk.stringToCloudFormation(properties.ipFamily),
        ServiceIpv4Cidr: cdk.stringToCloudFormation(properties.serviceIpv4Cidr),
        ServiceIpv6Cidr: cdk.stringToCloudFormation(properties.serviceIpv6Cidr),
    };
}

// @ts-ignore TS6133
function CfnClusterKubernetesNetworkConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.KubernetesNetworkConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.KubernetesNetworkConfigProperty>();
    ret.addPropertyResult('ipFamily', 'IpFamily', properties.IpFamily != null ? cfn_parse.FromCloudFormation.getString(properties.IpFamily) : undefined);
    ret.addPropertyResult('serviceIpv4Cidr', 'ServiceIpv4Cidr', properties.ServiceIpv4Cidr != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceIpv4Cidr) : undefined);
    ret.addPropertyResult('serviceIpv6Cidr', 'ServiceIpv6Cidr', properties.ServiceIpv6Cidr != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceIpv6Cidr) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * Enable or disable exporting the Kubernetes control plane logs for your cluster to CloudWatch Logs. By default, cluster control plane logs aren't exported to CloudWatch Logs. For more information, see [Amazon EKS Cluster control plane logs](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html) in the **Amazon EKS User Guide** .
     *
     * > When updating a resource, you must include this `Logging` property if the previous CloudFormation template of the resource had it. > CloudWatch Logs ingestion, archive storage, and data scanning rates apply to exported control plane logs. For more information, see [CloudWatch Pricing](https://docs.aws.amazon.com/cloudwatch/pricing/) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-logging.html
     */
    export interface LoggingProperty {
        /**
         * The cluster control plane logging configuration for your cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-logging.html#cfn-eks-cluster-logging-clusterlogging
         */
        readonly clusterLogging?: CfnCluster.ClusterLoggingProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `LoggingProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_LoggingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('clusterLogging', CfnCluster_ClusterLoggingPropertyValidator)(properties.clusterLogging));
    return errors.wrap('supplied properties not correct for "LoggingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EKS::Cluster.Logging` resource
 *
 * @param properties - the TypeScript properties of a `LoggingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EKS::Cluster.Logging` resource.
 */
// @ts-ignore TS6133
function cfnClusterLoggingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_LoggingPropertyValidator(properties).assertSuccess();
    return {
        ClusterLogging: cfnClusterClusterLoggingPropertyToCloudFormation(properties.clusterLogging),
    };
}

// @ts-ignore TS6133
function CfnClusterLoggingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.LoggingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.LoggingProperty>();
    ret.addPropertyResult('clusterLogging', 'ClusterLogging', properties.ClusterLogging != null ? CfnClusterClusterLoggingPropertyFromCloudFormation(properties.ClusterLogging) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * The enabled logging type. For a list of the valid logging types, see the [`types` property of `LogSetup`](https://docs.aws.amazon.com/eks/latest/APIReference/API_LogSetup.html#AmazonEKS-Type-LogSetup-types) in the *Amazon EKS API Reference* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-loggingtypeconfig.html
     */
    export interface LoggingTypeConfigProperty {
        /**
         * The name of the log type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-loggingtypeconfig.html#cfn-eks-cluster-loggingtypeconfig-type
         */
        readonly type?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LoggingTypeConfigProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingTypeConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_LoggingTypeConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "LoggingTypeConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EKS::Cluster.LoggingTypeConfig` resource
 *
 * @param properties - the TypeScript properties of a `LoggingTypeConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EKS::Cluster.LoggingTypeConfig` resource.
 */
// @ts-ignore TS6133
function cfnClusterLoggingTypeConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_LoggingTypeConfigPropertyValidator(properties).assertSuccess();
    return {
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnClusterLoggingTypeConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.LoggingTypeConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.LoggingTypeConfigProperty>();
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * Identifies the AWS Key Management Service ( AWS KMS ) key used to encrypt the secrets.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-provider.html
     */
    export interface ProviderProperty {
        /**
         * Amazon Resource Name (ARN) or alias of the KMS key. The KMS key must be symmetric, created in the same region as the cluster, and if the KMS key was created in a different account, the user must have access to the KMS key. For more information, see [Allowing Users in Other Accounts to Use a KMS key](https://docs.aws.amazon.com/kms/latest/developerguide/key-policy-modifying-external-accounts.html) in the *AWS Key Management Service Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-provider.html#cfn-eks-cluster-provider-keyarn
         */
        readonly keyArn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ProviderProperty`
 *
 * @param properties - the TypeScript properties of a `ProviderProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_ProviderPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('keyArn', cdk.validateString)(properties.keyArn));
    return errors.wrap('supplied properties not correct for "ProviderProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EKS::Cluster.Provider` resource
 *
 * @param properties - the TypeScript properties of a `ProviderProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EKS::Cluster.Provider` resource.
 */
// @ts-ignore TS6133
function cfnClusterProviderPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_ProviderPropertyValidator(properties).assertSuccess();
    return {
        KeyArn: cdk.stringToCloudFormation(properties.keyArn),
    };
}

// @ts-ignore TS6133
function CfnClusterProviderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.ProviderProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ProviderProperty>();
    ret.addPropertyResult('keyArn', 'KeyArn', properties.KeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KeyArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnCluster {
    /**
     * An object representing the VPC configuration to use for an Amazon EKS cluster.
     *
     * > When updating a resource, you must include these properties if the previous CloudFormation template of the resource had them:
     * >
     * > - `EndpointPublicAccess`
     * > - `EndpointPrivateAccess`
     * > - `PublicAccessCidrs`
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-resourcesvpcconfig.html
     */
    export interface ResourcesVpcConfigProperty {
        /**
         * Set this value to `true` to enable private access for your cluster's Kubernetes API server endpoint. If you enable private access, Kubernetes API requests from within your cluster's VPC use the private VPC endpoint. The default value for this parameter is `false` , which disables private access for your Kubernetes API server. If you disable private access and you have nodes or AWS Fargate pods in the cluster, then ensure that `publicAccessCidrs` includes the necessary CIDR blocks for communication with the nodes or Fargate pods. For more information, see [Amazon EKS cluster endpoint access control](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html) in the **Amazon EKS User Guide** .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-resourcesvpcconfig.html#cfn-eks-cluster-resourcesvpcconfig-endpointprivateaccess
         */
        readonly endpointPrivateAccess?: boolean | cdk.IResolvable;
        /**
         * Set this value to `false` to disable public access to your cluster's Kubernetes API server endpoint. If you disable public access, your cluster's Kubernetes API server can only receive requests from within the cluster VPC. The default value for this parameter is `true` , which enables public access for your Kubernetes API server. For more information, see [Amazon EKS cluster endpoint access control](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html) in the **Amazon EKS User Guide** .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-resourcesvpcconfig.html#cfn-eks-cluster-resourcesvpcconfig-endpointpublicaccess
         */
        readonly endpointPublicAccess?: boolean | cdk.IResolvable;
        /**
         * The CIDR blocks that are allowed access to your cluster's public Kubernetes API server endpoint. Communication to the endpoint from addresses outside of the CIDR blocks that you specify is denied. The default value is `0.0.0.0/0` . If you've disabled private endpoint access and you have nodes or AWS Fargate pods in the cluster, then ensure that you specify the necessary CIDR blocks. For more information, see [Amazon EKS cluster endpoint access control](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html) in the **Amazon EKS User Guide** .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-resourcesvpcconfig.html#cfn-eks-cluster-resourcesvpcconfig-publicaccesscidrs
         */
        readonly publicAccessCidrs?: string[];
        /**
         * Specify one or more security groups for the cross-account elastic network interfaces that Amazon EKS creates to use that allow communication between your nodes and the Kubernetes control plane. If you don't specify any security groups, then familiarize yourself with the difference between Amazon EKS defaults for clusters deployed with Kubernetes:
         *
         * - 1.14 Amazon EKS platform version `eks.2` and earlier
         * - 1.14 Amazon EKS platform version `eks.3` and later
         *
         * For more information, see [Amazon EKS security group considerations](https://docs.aws.amazon.com/eks/latest/userguide/sec-group-reqs.html) in the **Amazon EKS User Guide** .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-resourcesvpcconfig.html#cfn-eks-cluster-resourcesvpcconfig-securitygroupids
         */
        readonly securityGroupIds?: string[];
        /**
         * Specify subnets for your Amazon EKS nodes. Amazon EKS creates cross-account elastic network interfaces in these subnets to allow communication between your nodes and the Kubernetes control plane.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-resourcesvpcconfig.html#cfn-eks-cluster-resourcesvpcconfig-subnetids
         */
        readonly subnetIds: string[];
    }
}

/**
 * Determine whether the given properties match those of a `ResourcesVpcConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ResourcesVpcConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnCluster_ResourcesVpcConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('endpointPrivateAccess', cdk.validateBoolean)(properties.endpointPrivateAccess));
    errors.collect(cdk.propertyValidator('endpointPublicAccess', cdk.validateBoolean)(properties.endpointPublicAccess));
    errors.collect(cdk.propertyValidator('publicAccessCidrs', cdk.listValidator(cdk.validateString))(properties.publicAccessCidrs));
    errors.collect(cdk.propertyValidator('securityGroupIds', cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
    errors.collect(cdk.propertyValidator('subnetIds', cdk.requiredValidator)(properties.subnetIds));
    errors.collect(cdk.propertyValidator('subnetIds', cdk.listValidator(cdk.validateString))(properties.subnetIds));
    return errors.wrap('supplied properties not correct for "ResourcesVpcConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EKS::Cluster.ResourcesVpcConfig` resource
 *
 * @param properties - the TypeScript properties of a `ResourcesVpcConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EKS::Cluster.ResourcesVpcConfig` resource.
 */
// @ts-ignore TS6133
function cfnClusterResourcesVpcConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCluster_ResourcesVpcConfigPropertyValidator(properties).assertSuccess();
    return {
        EndpointPrivateAccess: cdk.booleanToCloudFormation(properties.endpointPrivateAccess),
        EndpointPublicAccess: cdk.booleanToCloudFormation(properties.endpointPublicAccess),
        PublicAccessCidrs: cdk.listMapper(cdk.stringToCloudFormation)(properties.publicAccessCidrs),
        SecurityGroupIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
        SubnetIds: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
    };
}

// @ts-ignore TS6133
function CfnClusterResourcesVpcConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.ResourcesVpcConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ResourcesVpcConfigProperty>();
    ret.addPropertyResult('endpointPrivateAccess', 'EndpointPrivateAccess', properties.EndpointPrivateAccess != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EndpointPrivateAccess) : undefined);
    ret.addPropertyResult('endpointPublicAccess', 'EndpointPublicAccess', properties.EndpointPublicAccess != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EndpointPublicAccess) : undefined);
    ret.addPropertyResult('publicAccessCidrs', 'PublicAccessCidrs', properties.PublicAccessCidrs != null ? cfn_parse.FromCloudFormation.getStringArray(properties.PublicAccessCidrs) : undefined);
    ret.addPropertyResult('securityGroupIds', 'SecurityGroupIds', properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SecurityGroupIds) : undefined);
    ret.addPropertyResult('subnetIds', 'SubnetIds', cfn_parse.FromCloudFormation.getStringArray(properties.SubnetIds));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnFargateProfile`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html
 */
export interface CfnFargateProfileProps {

    /**
     * The name of the Amazon EKS cluster to apply the Fargate profile to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-clustername
     */
    readonly clusterName: string;

    /**
     * The Amazon Resource Name (ARN) of the pod execution role to use for pods that match the selectors in the Fargate profile. The pod execution role allows Fargate infrastructure to register with your cluster as a node, and it provides read access to Amazon ECR image repositories. For more information, see [Pod Execution Role](https://docs.aws.amazon.com/eks/latest/userguide/pod-execution-role.html) in the *Amazon EKS User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-podexecutionrolearn
     */
    readonly podExecutionRoleArn: string;

    /**
     * The selectors to match for pods to use this Fargate profile. Each selector must have an associated namespace. Optionally, you can also specify labels for a namespace. You may specify up to five selectors in a Fargate profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-selectors
     */
    readonly selectors: Array<CfnFargateProfile.SelectorProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of the Fargate profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-fargateprofilename
     */
    readonly fargateProfileName?: string;

    /**
     * The IDs of subnets to launch your pods into. At this time, pods running on Fargate are not assigned public IP addresses, so only private subnets (with no direct route to an Internet Gateway) are accepted for this parameter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-subnets
     */
    readonly subnets?: string[];

    /**
     * The metadata to apply to the Fargate profile to assist with categorization and organization. Each tag consists of a key and an optional value. You define both. Fargate profile tags do not propagate to any other resources associated with the Fargate profile, such as the pods that are scheduled with it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnFargateProfileProps`
 *
 * @param properties - the TypeScript properties of a `CfnFargateProfileProps`
 *
 * @returns the result of the validation.
 */
function CfnFargateProfilePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('clusterName', cdk.requiredValidator)(properties.clusterName));
    errors.collect(cdk.propertyValidator('clusterName', cdk.validateString)(properties.clusterName));
    errors.collect(cdk.propertyValidator('fargateProfileName', cdk.validateString)(properties.fargateProfileName));
    errors.collect(cdk.propertyValidator('podExecutionRoleArn', cdk.requiredValidator)(properties.podExecutionRoleArn));
    errors.collect(cdk.propertyValidator('podExecutionRoleArn', cdk.validateString)(properties.podExecutionRoleArn));
    errors.collect(cdk.propertyValidator('selectors', cdk.requiredValidator)(properties.selectors));
    errors.collect(cdk.propertyValidator('selectors', cdk.listValidator(CfnFargateProfile_SelectorPropertyValidator))(properties.selectors));
    errors.collect(cdk.propertyValidator('subnets', cdk.listValidator(cdk.validateString))(properties.subnets));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnFargateProfileProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EKS::FargateProfile` resource
 *
 * @param properties - the TypeScript properties of a `CfnFargateProfileProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EKS::FargateProfile` resource.
 */
// @ts-ignore TS6133
function cfnFargateProfilePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFargateProfilePropsValidator(properties).assertSuccess();
    return {
        ClusterName: cdk.stringToCloudFormation(properties.clusterName),
        PodExecutionRoleArn: cdk.stringToCloudFormation(properties.podExecutionRoleArn),
        Selectors: cdk.listMapper(cfnFargateProfileSelectorPropertyToCloudFormation)(properties.selectors),
        FargateProfileName: cdk.stringToCloudFormation(properties.fargateProfileName),
        Subnets: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnets),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnFargateProfilePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFargateProfileProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFargateProfileProps>();
    ret.addPropertyResult('clusterName', 'ClusterName', cfn_parse.FromCloudFormation.getString(properties.ClusterName));
    ret.addPropertyResult('podExecutionRoleArn', 'PodExecutionRoleArn', cfn_parse.FromCloudFormation.getString(properties.PodExecutionRoleArn));
    ret.addPropertyResult('selectors', 'Selectors', cfn_parse.FromCloudFormation.getArray(CfnFargateProfileSelectorPropertyFromCloudFormation)(properties.Selectors));
    ret.addPropertyResult('fargateProfileName', 'FargateProfileName', properties.FargateProfileName != null ? cfn_parse.FromCloudFormation.getString(properties.FargateProfileName) : undefined);
    ret.addPropertyResult('subnets', 'Subnets', properties.Subnets != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Subnets) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::EKS::FargateProfile`
 *
 * Creates an AWS Fargate profile for your Amazon EKS cluster. You must have at least one Fargate profile in a cluster to be able to run pods on Fargate.
 *
 * The Fargate profile allows an administrator to declare which pods run on Fargate and specify which pods run on which Fargate profile. This declaration is done through the profile’s selectors. Each profile can have up to five selectors that contain a namespace and labels. A namespace is required for every selector. The label field consists of multiple optional key-value pairs. Pods that match the selectors are scheduled on Fargate. If a to-be-scheduled pod matches any of the selectors in the Fargate profile, then that pod is run on Fargate.
 *
 * When you create a Fargate profile, you must specify a pod execution role to use with the pods that are scheduled with the profile. This role is added to the cluster's Kubernetes [Role Based Access Control](https://docs.aws.amazon.com/https://kubernetes.io/docs/admin/authorization/rbac/) (RBAC) for authorization so that the `kubelet` that is running on the Fargate infrastructure can register with your Amazon EKS cluster so that it can appear in your cluster as a node. The pod execution role also provides IAM permissions to the Fargate infrastructure to allow read access to Amazon ECR image repositories. For more information, see [Pod Execution Role](https://docs.aws.amazon.com/eks/latest/userguide/pod-execution-role.html) in the *Amazon EKS User Guide* .
 *
 * Fargate profiles are immutable. However, you can create a new updated profile to replace an existing profile and then delete the original after the updated profile has finished creating.
 *
 * If any Fargate profiles in a cluster are in the `DELETING` status, you must wait for that Fargate profile to finish deleting before you can create any other profiles in that cluster.
 *
 * For more information, see [AWS Fargate Profile](https://docs.aws.amazon.com/eks/latest/userguide/fargate-profile.html) in the *Amazon EKS User Guide* .
 *
 * @cloudformationResource AWS::EKS::FargateProfile
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html
 */
export class CfnFargateProfile extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::EKS::FargateProfile";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFargateProfile {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnFargateProfilePropsFromCloudFormation(resourceProperties);
        const ret = new CfnFargateProfile(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the cluster, such as `arn:aws:eks:us-west-2:666666666666:fargateprofile/myCluster/myFargateProfile/1cb1a11a-1dc1-1d11-cf11-1111f11fa111` .
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The name of the Amazon EKS cluster to apply the Fargate profile to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-clustername
     */
    public clusterName: string;

    /**
     * The Amazon Resource Name (ARN) of the pod execution role to use for pods that match the selectors in the Fargate profile. The pod execution role allows Fargate infrastructure to register with your cluster as a node, and it provides read access to Amazon ECR image repositories. For more information, see [Pod Execution Role](https://docs.aws.amazon.com/eks/latest/userguide/pod-execution-role.html) in the *Amazon EKS User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-podexecutionrolearn
     */
    public podExecutionRoleArn: string;

    /**
     * The selectors to match for pods to use this Fargate profile. Each selector must have an associated namespace. Optionally, you can also specify labels for a namespace. You may specify up to five selectors in a Fargate profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-selectors
     */
    public selectors: Array<CfnFargateProfile.SelectorProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of the Fargate profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-fargateprofilename
     */
    public fargateProfileName: string | undefined;

    /**
     * The IDs of subnets to launch your pods into. At this time, pods running on Fargate are not assigned public IP addresses, so only private subnets (with no direct route to an Internet Gateway) are accepted for this parameter.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-subnets
     */
    public subnets: string[] | undefined;

    /**
     * The metadata to apply to the Fargate profile to assist with categorization and organization. Each tag consists of a key and an optional value. You define both. Fargate profile tags do not propagate to any other resources associated with the Fargate profile, such as the pods that are scheduled with it.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::EKS::FargateProfile`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnFargateProfileProps) {
        super(scope, id, { type: CfnFargateProfile.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'clusterName', this);
        cdk.requireProperty(props, 'podExecutionRoleArn', this);
        cdk.requireProperty(props, 'selectors', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn'));

        this.clusterName = props.clusterName;
        this.podExecutionRoleArn = props.podExecutionRoleArn;
        this.selectors = props.selectors;
        this.fargateProfileName = props.fargateProfileName;
        this.subnets = props.subnets;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::EKS::FargateProfile", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnFargateProfile.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            clusterName: this.clusterName,
            podExecutionRoleArn: this.podExecutionRoleArn,
            selectors: this.selectors,
            fargateProfileName: this.fargateProfileName,
            subnets: this.subnets,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnFargateProfilePropsToCloudFormation(props);
    }
}

export namespace CfnFargateProfile {
    /**
     * A key-value pair.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-fargateprofile-label.html
     */
    export interface LabelProperty {
        /**
         * Enter a key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-fargateprofile-label.html#cfn-eks-fargateprofile-label-key
         */
        readonly key: string;
        /**
         * Enter a value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-fargateprofile-label.html#cfn-eks-fargateprofile-label-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `LabelProperty`
 *
 * @param properties - the TypeScript properties of a `LabelProperty`
 *
 * @returns the result of the validation.
 */
function CfnFargateProfile_LabelPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "LabelProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EKS::FargateProfile.Label` resource
 *
 * @param properties - the TypeScript properties of a `LabelProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EKS::FargateProfile.Label` resource.
 */
// @ts-ignore TS6133
function cfnFargateProfileLabelPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFargateProfile_LabelPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnFargateProfileLabelPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFargateProfile.LabelProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFargateProfile.LabelProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnFargateProfile {
    /**
     * An object representing an AWS Fargate profile selector.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-fargateprofile-selector.html
     */
    export interface SelectorProperty {
        /**
         * The Kubernetes labels that the selector should match. A pod must contain all of the labels that are specified in the selector for it to be considered a match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-fargateprofile-selector.html#cfn-eks-fargateprofile-selector-labels
         */
        readonly labels?: Array<CfnFargateProfile.LabelProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The Kubernetes namespace that the selector should match.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-fargateprofile-selector.html#cfn-eks-fargateprofile-selector-namespace
         */
        readonly namespace: string;
    }
}

/**
 * Determine whether the given properties match those of a `SelectorProperty`
 *
 * @param properties - the TypeScript properties of a `SelectorProperty`
 *
 * @returns the result of the validation.
 */
function CfnFargateProfile_SelectorPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('labels', cdk.listValidator(CfnFargateProfile_LabelPropertyValidator))(properties.labels));
    errors.collect(cdk.propertyValidator('namespace', cdk.requiredValidator)(properties.namespace));
    errors.collect(cdk.propertyValidator('namespace', cdk.validateString)(properties.namespace));
    return errors.wrap('supplied properties not correct for "SelectorProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EKS::FargateProfile.Selector` resource
 *
 * @param properties - the TypeScript properties of a `SelectorProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EKS::FargateProfile.Selector` resource.
 */
// @ts-ignore TS6133
function cfnFargateProfileSelectorPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnFargateProfile_SelectorPropertyValidator(properties).assertSuccess();
    return {
        Labels: cdk.listMapper(cfnFargateProfileLabelPropertyToCloudFormation)(properties.labels),
        Namespace: cdk.stringToCloudFormation(properties.namespace),
    };
}

// @ts-ignore TS6133
function CfnFargateProfileSelectorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFargateProfile.SelectorProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFargateProfile.SelectorProperty>();
    ret.addPropertyResult('labels', 'Labels', properties.Labels != null ? cfn_parse.FromCloudFormation.getArray(CfnFargateProfileLabelPropertyFromCloudFormation)(properties.Labels) : undefined);
    ret.addPropertyResult('namespace', 'Namespace', cfn_parse.FromCloudFormation.getString(properties.Namespace));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnIdentityProviderConfig`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-identityproviderconfig.html
 */
export interface CfnIdentityProviderConfigProps {

    /**
     * The cluster that the configuration is associated to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-identityproviderconfig.html#cfn-eks-identityproviderconfig-clustername
     */
    readonly clusterName: string;

    /**
     * The type of the identity provider configuration. The only type available is `oidc` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-identityproviderconfig.html#cfn-eks-identityproviderconfig-type
     */
    readonly type: string;

    /**
     * The name of the configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-identityproviderconfig.html#cfn-eks-identityproviderconfig-identityproviderconfigname
     */
    readonly identityProviderConfigName?: string;

    /**
     * An object that represents an OpenID Connect (OIDC) identity provider configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-identityproviderconfig.html#cfn-eks-identityproviderconfig-oidc
     */
    readonly oidc?: CfnIdentityProviderConfig.OidcIdentityProviderConfigProperty | cdk.IResolvable;

    /**
     * The metadata to apply to the provider configuration to assist with categorization and organization. Each tag consists of a key and an optional value. You define both.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-identityproviderconfig.html#cfn-eks-identityproviderconfig-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnIdentityProviderConfigProps`
 *
 * @param properties - the TypeScript properties of a `CfnIdentityProviderConfigProps`
 *
 * @returns the result of the validation.
 */
function CfnIdentityProviderConfigPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('clusterName', cdk.requiredValidator)(properties.clusterName));
    errors.collect(cdk.propertyValidator('clusterName', cdk.validateString)(properties.clusterName));
    errors.collect(cdk.propertyValidator('identityProviderConfigName', cdk.validateString)(properties.identityProviderConfigName));
    errors.collect(cdk.propertyValidator('oidc', CfnIdentityProviderConfig_OidcIdentityProviderConfigPropertyValidator)(properties.oidc));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "CfnIdentityProviderConfigProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EKS::IdentityProviderConfig` resource
 *
 * @param properties - the TypeScript properties of a `CfnIdentityProviderConfigProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EKS::IdentityProviderConfig` resource.
 */
// @ts-ignore TS6133
function cfnIdentityProviderConfigPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnIdentityProviderConfigPropsValidator(properties).assertSuccess();
    return {
        ClusterName: cdk.stringToCloudFormation(properties.clusterName),
        Type: cdk.stringToCloudFormation(properties.type),
        IdentityProviderConfigName: cdk.stringToCloudFormation(properties.identityProviderConfigName),
        Oidc: cfnIdentityProviderConfigOidcIdentityProviderConfigPropertyToCloudFormation(properties.oidc),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnIdentityProviderConfigPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIdentityProviderConfigProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIdentityProviderConfigProps>();
    ret.addPropertyResult('clusterName', 'ClusterName', cfn_parse.FromCloudFormation.getString(properties.ClusterName));
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('identityProviderConfigName', 'IdentityProviderConfigName', properties.IdentityProviderConfigName != null ? cfn_parse.FromCloudFormation.getString(properties.IdentityProviderConfigName) : undefined);
    ret.addPropertyResult('oidc', 'Oidc', properties.Oidc != null ? CfnIdentityProviderConfigOidcIdentityProviderConfigPropertyFromCloudFormation(properties.Oidc) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::EKS::IdentityProviderConfig`
 *
 * Associate an identity provider configuration to a cluster.
 *
 * If you want to authenticate identities using an identity provider, you can create an identity provider configuration and associate it to your cluster. After configuring authentication to your cluster you can create Kubernetes `roles` and `clusterroles` to assign permissions to the roles, and then bind the roles to the identities using Kubernetes `rolebindings` and `clusterrolebindings` . For more information see [Using RBAC Authorization](https://docs.aws.amazon.com/https://kubernetes.io/docs/reference/access-authn-authz/rbac/) in the Kubernetes documentation.
 *
 * @cloudformationResource AWS::EKS::IdentityProviderConfig
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-identityproviderconfig.html
 */
export class CfnIdentityProviderConfig extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::EKS::IdentityProviderConfig";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnIdentityProviderConfig {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnIdentityProviderConfigPropsFromCloudFormation(resourceProperties);
        const ret = new CfnIdentityProviderConfig(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) associated with the identity provider config.
     * @cloudformationAttribute IdentityProviderConfigArn
     */
    public readonly attrIdentityProviderConfigArn: string;

    /**
     * The cluster that the configuration is associated to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-identityproviderconfig.html#cfn-eks-identityproviderconfig-clustername
     */
    public clusterName: string;

    /**
     * The type of the identity provider configuration. The only type available is `oidc` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-identityproviderconfig.html#cfn-eks-identityproviderconfig-type
     */
    public type: string;

    /**
     * The name of the configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-identityproviderconfig.html#cfn-eks-identityproviderconfig-identityproviderconfigname
     */
    public identityProviderConfigName: string | undefined;

    /**
     * An object that represents an OpenID Connect (OIDC) identity provider configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-identityproviderconfig.html#cfn-eks-identityproviderconfig-oidc
     */
    public oidc: CfnIdentityProviderConfig.OidcIdentityProviderConfigProperty | cdk.IResolvable | undefined;

    /**
     * The metadata to apply to the provider configuration to assist with categorization and organization. Each tag consists of a key and an optional value. You define both.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-identityproviderconfig.html#cfn-eks-identityproviderconfig-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::EKS::IdentityProviderConfig`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnIdentityProviderConfigProps) {
        super(scope, id, { type: CfnIdentityProviderConfig.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'clusterName', this);
        cdk.requireProperty(props, 'type', this);
        this.attrIdentityProviderConfigArn = cdk.Token.asString(this.getAtt('IdentityProviderConfigArn'));

        this.clusterName = props.clusterName;
        this.type = props.type;
        this.identityProviderConfigName = props.identityProviderConfigName;
        this.oidc = props.oidc;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::EKS::IdentityProviderConfig", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnIdentityProviderConfig.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            clusterName: this.clusterName,
            type: this.type,
            identityProviderConfigName: this.identityProviderConfigName,
            oidc: this.oidc,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnIdentityProviderConfigPropsToCloudFormation(props);
    }
}

export namespace CfnIdentityProviderConfig {
    /**
     * An object that represents the configuration for an OpenID Connect (OIDC) identity provider.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-identityproviderconfig-oidcidentityproviderconfig.html
     */
    export interface OidcIdentityProviderConfigProperty {
        /**
         * This is also known as *audience* . The ID of the client application that makes authentication requests to the OIDC identity provider.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-identityproviderconfig-oidcidentityproviderconfig.html#cfn-eks-identityproviderconfig-oidcidentityproviderconfig-clientid
         */
        readonly clientId: string;
        /**
         * The JSON web token (JWT) claim that the provider uses to return your groups.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-identityproviderconfig-oidcidentityproviderconfig.html#cfn-eks-identityproviderconfig-oidcidentityproviderconfig-groupsclaim
         */
        readonly groupsClaim?: string;
        /**
         * The prefix that is prepended to group claims to prevent clashes with existing names (such as `system:` groups). For example, the value `oidc:` creates group names like `oidc:engineering` and `oidc:infra` . The prefix can't contain `system:`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-identityproviderconfig-oidcidentityproviderconfig.html#cfn-eks-identityproviderconfig-oidcidentityproviderconfig-groupsprefix
         */
        readonly groupsPrefix?: string;
        /**
         * The URL of the OIDC identity provider that allows the API server to discover public signing keys for verifying tokens.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-identityproviderconfig-oidcidentityproviderconfig.html#cfn-eks-identityproviderconfig-oidcidentityproviderconfig-issuerurl
         */
        readonly issuerUrl: string;
        /**
         * The key-value pairs that describe required claims in the identity token. If set, each claim is verified to be present in the token with a matching value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-identityproviderconfig-oidcidentityproviderconfig.html#cfn-eks-identityproviderconfig-oidcidentityproviderconfig-requiredclaims
         */
        readonly requiredClaims?: Array<CfnIdentityProviderConfig.RequiredClaimProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The JSON Web token (JWT) claim that is used as the username.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-identityproviderconfig-oidcidentityproviderconfig.html#cfn-eks-identityproviderconfig-oidcidentityproviderconfig-usernameclaim
         */
        readonly usernameClaim?: string;
        /**
         * The prefix that is prepended to username claims to prevent clashes with existing names. The prefix can't contain `system:`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-identityproviderconfig-oidcidentityproviderconfig.html#cfn-eks-identityproviderconfig-oidcidentityproviderconfig-usernameprefix
         */
        readonly usernamePrefix?: string;
    }
}

/**
 * Determine whether the given properties match those of a `OidcIdentityProviderConfigProperty`
 *
 * @param properties - the TypeScript properties of a `OidcIdentityProviderConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnIdentityProviderConfig_OidcIdentityProviderConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('clientId', cdk.requiredValidator)(properties.clientId));
    errors.collect(cdk.propertyValidator('clientId', cdk.validateString)(properties.clientId));
    errors.collect(cdk.propertyValidator('groupsClaim', cdk.validateString)(properties.groupsClaim));
    errors.collect(cdk.propertyValidator('groupsPrefix', cdk.validateString)(properties.groupsPrefix));
    errors.collect(cdk.propertyValidator('issuerUrl', cdk.requiredValidator)(properties.issuerUrl));
    errors.collect(cdk.propertyValidator('issuerUrl', cdk.validateString)(properties.issuerUrl));
    errors.collect(cdk.propertyValidator('requiredClaims', cdk.listValidator(CfnIdentityProviderConfig_RequiredClaimPropertyValidator))(properties.requiredClaims));
    errors.collect(cdk.propertyValidator('usernameClaim', cdk.validateString)(properties.usernameClaim));
    errors.collect(cdk.propertyValidator('usernamePrefix', cdk.validateString)(properties.usernamePrefix));
    return errors.wrap('supplied properties not correct for "OidcIdentityProviderConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EKS::IdentityProviderConfig.OidcIdentityProviderConfig` resource
 *
 * @param properties - the TypeScript properties of a `OidcIdentityProviderConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EKS::IdentityProviderConfig.OidcIdentityProviderConfig` resource.
 */
// @ts-ignore TS6133
function cfnIdentityProviderConfigOidcIdentityProviderConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnIdentityProviderConfig_OidcIdentityProviderConfigPropertyValidator(properties).assertSuccess();
    return {
        ClientId: cdk.stringToCloudFormation(properties.clientId),
        GroupsClaim: cdk.stringToCloudFormation(properties.groupsClaim),
        GroupsPrefix: cdk.stringToCloudFormation(properties.groupsPrefix),
        IssuerUrl: cdk.stringToCloudFormation(properties.issuerUrl),
        RequiredClaims: cdk.listMapper(cfnIdentityProviderConfigRequiredClaimPropertyToCloudFormation)(properties.requiredClaims),
        UsernameClaim: cdk.stringToCloudFormation(properties.usernameClaim),
        UsernamePrefix: cdk.stringToCloudFormation(properties.usernamePrefix),
    };
}

// @ts-ignore TS6133
function CfnIdentityProviderConfigOidcIdentityProviderConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIdentityProviderConfig.OidcIdentityProviderConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIdentityProviderConfig.OidcIdentityProviderConfigProperty>();
    ret.addPropertyResult('clientId', 'ClientId', cfn_parse.FromCloudFormation.getString(properties.ClientId));
    ret.addPropertyResult('groupsClaim', 'GroupsClaim', properties.GroupsClaim != null ? cfn_parse.FromCloudFormation.getString(properties.GroupsClaim) : undefined);
    ret.addPropertyResult('groupsPrefix', 'GroupsPrefix', properties.GroupsPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.GroupsPrefix) : undefined);
    ret.addPropertyResult('issuerUrl', 'IssuerUrl', cfn_parse.FromCloudFormation.getString(properties.IssuerUrl));
    ret.addPropertyResult('requiredClaims', 'RequiredClaims', properties.RequiredClaims != null ? cfn_parse.FromCloudFormation.getArray(CfnIdentityProviderConfigRequiredClaimPropertyFromCloudFormation)(properties.RequiredClaims) : undefined);
    ret.addPropertyResult('usernameClaim', 'UsernameClaim', properties.UsernameClaim != null ? cfn_parse.FromCloudFormation.getString(properties.UsernameClaim) : undefined);
    ret.addPropertyResult('usernamePrefix', 'UsernamePrefix', properties.UsernamePrefix != null ? cfn_parse.FromCloudFormation.getString(properties.UsernamePrefix) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnIdentityProviderConfig {
    /**
     * A key-value pair that describes a required claim in the identity token. If set, each claim is verified to be present in the token with a matching value.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-identityproviderconfig-requiredclaim.html
     */
    export interface RequiredClaimProperty {
        /**
         * The key to match from the token.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-identityproviderconfig-requiredclaim.html#cfn-eks-identityproviderconfig-requiredclaim-key
         */
        readonly key: string;
        /**
         * The value for the key from the token.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-identityproviderconfig-requiredclaim.html#cfn-eks-identityproviderconfig-requiredclaim-value
         */
        readonly value: string;
    }
}

/**
 * Determine whether the given properties match those of a `RequiredClaimProperty`
 *
 * @param properties - the TypeScript properties of a `RequiredClaimProperty`
 *
 * @returns the result of the validation.
 */
function CfnIdentityProviderConfig_RequiredClaimPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.requiredValidator)(properties.key));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.requiredValidator)(properties.value));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "RequiredClaimProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EKS::IdentityProviderConfig.RequiredClaim` resource
 *
 * @param properties - the TypeScript properties of a `RequiredClaimProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EKS::IdentityProviderConfig.RequiredClaim` resource.
 */
// @ts-ignore TS6133
function cfnIdentityProviderConfigRequiredClaimPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnIdentityProviderConfig_RequiredClaimPropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnIdentityProviderConfigRequiredClaimPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIdentityProviderConfig.RequiredClaimProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIdentityProviderConfig.RequiredClaimProperty>();
    ret.addPropertyResult('key', 'Key', cfn_parse.FromCloudFormation.getString(properties.Key));
    ret.addPropertyResult('value', 'Value', cfn_parse.FromCloudFormation.getString(properties.Value));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnNodegroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html
 */
export interface CfnNodegroupProps {

    /**
     * The name of the cluster to create the node group in.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-clustername
     */
    readonly clusterName: string;

    /**
     * The Amazon Resource Name (ARN) of the IAM role to associate with your node group. The Amazon EKS worker node `kubelet` daemon makes calls to AWS APIs on your behalf. Nodes receive permissions for these API calls through an IAM instance profile and associated policies. Before you can launch nodes and register them into a cluster, you must create an IAM role for those nodes to use when they are launched. For more information, see [Amazon EKS node IAM role](https://docs.aws.amazon.com/eks/latest/userguide/create-node-role.html) in the **Amazon EKS User Guide** . If you specify `launchTemplate` , then don't specify [`IamInstanceProfile`](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_IamInstanceProfile.html) in your launch template, or the node group deployment will fail. For more information about using launch templates with Amazon EKS, see [Launch template support](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html) in the *Amazon EKS User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-noderole
     */
    readonly nodeRole: string;

    /**
     * The subnets to use for the Auto Scaling group that is created for your node group. If you specify `launchTemplate` , then don't specify [`SubnetId`](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateNetworkInterface.html) in your launch template, or the node group deployment will fail. For more information about using launch templates with Amazon EKS, see [Launch template support](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html) in the *Amazon EKS User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-subnets
     */
    readonly subnets: string[];

    /**
     * The AMI type for your node group. GPU instance types should use the `AL2_x86_64_GPU` AMI type. Non-GPU instances should use the `AL2_x86_64` AMI type. Arm instances should use the `AL2_ARM_64` AMI type. All types use the Amazon EKS optimized Amazon Linux 2 AMI. If you specify `launchTemplate` , and your launch template uses a custom AMI, then don't specify `amiType` , or the node group deployment will fail. For more information about using launch templates with Amazon EKS, see [Launch template support](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html) in the *Amazon EKS User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-amitype
     */
    readonly amiType?: string;

    /**
     * The capacity type of your managed node group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-capacitytype
     */
    readonly capacityType?: string;

    /**
     * The root device disk size (in GiB) for your node group instances. The default disk size is 20 GiB. If you specify `launchTemplate` , then don't specify `diskSize` , or the node group deployment will fail. For more information about using launch templates with Amazon EKS, see [Launch template support](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html) in the *Amazon EKS User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-disksize
     */
    readonly diskSize?: number;

    /**
     * Force the update if the existing node group's pods are unable to be drained due to a pod disruption budget issue. If an update fails because pods could not be drained, you can force the update after it fails to terminate the old node whether or not any pods are running on the node.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-forceupdateenabled
     */
    readonly forceUpdateEnabled?: boolean | cdk.IResolvable;

    /**
     * Specify the instance types for a node group. If you specify a GPU instance type, be sure to specify `AL2_x86_64_GPU` with the `amiType` parameter. If you specify `launchTemplate` , then you can specify zero or one instance type in your launch template *or* you can specify 0-20 instance types for `instanceTypes` . If however, you specify an instance type in your launch template *and* specify any `instanceTypes` , the node group deployment will fail. If you don't specify an instance type in a launch template or for `instanceTypes` , then `t3.medium` is used, by default. If you specify `Spot` for `capacityType` , then we recommend specifying multiple values for `instanceTypes` . For more information, see [Managed node group capacity types](https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html#managed-node-group-capacity-types) and [Launch template support](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html) in the *Amazon EKS User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-instancetypes
     */
    readonly instanceTypes?: string[];

    /**
     * The Kubernetes labels to be applied to the nodes in the node group when they are created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-labels
     */
    readonly labels?: any | cdk.IResolvable;

    /**
     * An object representing a node group's launch template specification. If specified, then do not specify `instanceTypes` , `diskSize` , or `remoteAccess` and make sure that the launch template meets the requirements in `launchTemplateSpecification` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-launchtemplate
     */
    readonly launchTemplate?: CfnNodegroup.LaunchTemplateSpecificationProperty | cdk.IResolvable;

    /**
     * The unique name to give your node group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-nodegroupname
     */
    readonly nodegroupName?: string;

    /**
     * The AMI version of the Amazon EKS optimized AMI to use with your node group (for example, `1.14.7- *YYYYMMDD*` ). By default, the latest available AMI version for the node group's current Kubernetes version is used. For more information, see [Amazon EKS optimized Linux AMI Versions](https://docs.aws.amazon.com/eks/latest/userguide/eks-linux-ami-versions.html) in the *Amazon EKS User Guide* .
     *
     * > Changing this value triggers an update of the node group if one is available. However, only the latest available AMI release version is valid as an input. You cannot roll back to a previous AMI release version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-releaseversion
     */
    readonly releaseVersion?: string;

    /**
     * The remote access (SSH) configuration to use with your node group. If you specify `launchTemplate` , then don't specify `remoteAccess` , or the node group deployment will fail. For more information about using launch templates with Amazon EKS, see [Launch template support](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html) in the *Amazon EKS User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-remoteaccess
     */
    readonly remoteAccess?: CfnNodegroup.RemoteAccessProperty | cdk.IResolvable;

    /**
     * The scaling configuration details for the Auto Scaling group that is created for your node group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-scalingconfig
     */
    readonly scalingConfig?: CfnNodegroup.ScalingConfigProperty | cdk.IResolvable;

    /**
     * The metadata to apply to the node group to assist with categorization and organization. Each tag consists of a key and an optional value. You define both. Node group tags do not propagate to any other resources associated with the node group, such as the Amazon EC2 instances or subnets.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-tags
     */
    readonly tags?: any;

    /**
     * The Kubernetes taints to be applied to the nodes in the node group when they are created. Effect is one of `No_Schedule` , `Prefer_No_Schedule` , or `No_Execute` . Kubernetes taints can be used together with tolerations to control how workloads are scheduled to your nodes. For more information, see [Node taints on managed node groups](https://docs.aws.amazon.com/eks/latest/userguide/node-taints-managed-node-groups.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-taints
     */
    readonly taints?: Array<CfnNodegroup.TaintProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The node group update configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-updateconfig
     */
    readonly updateConfig?: CfnNodegroup.UpdateConfigProperty | cdk.IResolvable;

    /**
     * The Kubernetes version to use for your managed nodes. By default, the Kubernetes version of the cluster is used, and this is the only accepted specified value. If you specify `launchTemplate` , and your launch template uses a custom AMI, then don't specify `version` , or the node group deployment will fail. For more information about using launch templates with Amazon EKS, see [Launch template support](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html) in the *Amazon EKS User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-version
     */
    readonly version?: string;
}

/**
 * Determine whether the given properties match those of a `CfnNodegroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnNodegroupProps`
 *
 * @returns the result of the validation.
 */
function CfnNodegroupPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('amiType', cdk.validateString)(properties.amiType));
    errors.collect(cdk.propertyValidator('capacityType', cdk.validateString)(properties.capacityType));
    errors.collect(cdk.propertyValidator('clusterName', cdk.requiredValidator)(properties.clusterName));
    errors.collect(cdk.propertyValidator('clusterName', cdk.validateString)(properties.clusterName));
    errors.collect(cdk.propertyValidator('diskSize', cdk.validateNumber)(properties.diskSize));
    errors.collect(cdk.propertyValidator('forceUpdateEnabled', cdk.validateBoolean)(properties.forceUpdateEnabled));
    errors.collect(cdk.propertyValidator('instanceTypes', cdk.listValidator(cdk.validateString))(properties.instanceTypes));
    errors.collect(cdk.propertyValidator('labels', cdk.validateObject)(properties.labels));
    errors.collect(cdk.propertyValidator('launchTemplate', CfnNodegroup_LaunchTemplateSpecificationPropertyValidator)(properties.launchTemplate));
    errors.collect(cdk.propertyValidator('nodeRole', cdk.requiredValidator)(properties.nodeRole));
    errors.collect(cdk.propertyValidator('nodeRole', cdk.validateString)(properties.nodeRole));
    errors.collect(cdk.propertyValidator('nodegroupName', cdk.validateString)(properties.nodegroupName));
    errors.collect(cdk.propertyValidator('releaseVersion', cdk.validateString)(properties.releaseVersion));
    errors.collect(cdk.propertyValidator('remoteAccess', CfnNodegroup_RemoteAccessPropertyValidator)(properties.remoteAccess));
    errors.collect(cdk.propertyValidator('scalingConfig', CfnNodegroup_ScalingConfigPropertyValidator)(properties.scalingConfig));
    errors.collect(cdk.propertyValidator('subnets', cdk.requiredValidator)(properties.subnets));
    errors.collect(cdk.propertyValidator('subnets', cdk.listValidator(cdk.validateString))(properties.subnets));
    errors.collect(cdk.propertyValidator('tags', cdk.validateObject)(properties.tags));
    errors.collect(cdk.propertyValidator('taints', cdk.listValidator(CfnNodegroup_TaintPropertyValidator))(properties.taints));
    errors.collect(cdk.propertyValidator('updateConfig', CfnNodegroup_UpdateConfigPropertyValidator)(properties.updateConfig));
    errors.collect(cdk.propertyValidator('version', cdk.validateString)(properties.version));
    return errors.wrap('supplied properties not correct for "CfnNodegroupProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EKS::Nodegroup` resource
 *
 * @param properties - the TypeScript properties of a `CfnNodegroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EKS::Nodegroup` resource.
 */
// @ts-ignore TS6133
function cfnNodegroupPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnNodegroupPropsValidator(properties).assertSuccess();
    return {
        ClusterName: cdk.stringToCloudFormation(properties.clusterName),
        NodeRole: cdk.stringToCloudFormation(properties.nodeRole),
        Subnets: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnets),
        AmiType: cdk.stringToCloudFormation(properties.amiType),
        CapacityType: cdk.stringToCloudFormation(properties.capacityType),
        DiskSize: cdk.numberToCloudFormation(properties.diskSize),
        ForceUpdateEnabled: cdk.booleanToCloudFormation(properties.forceUpdateEnabled),
        InstanceTypes: cdk.listMapper(cdk.stringToCloudFormation)(properties.instanceTypes),
        Labels: cdk.objectToCloudFormation(properties.labels),
        LaunchTemplate: cfnNodegroupLaunchTemplateSpecificationPropertyToCloudFormation(properties.launchTemplate),
        NodegroupName: cdk.stringToCloudFormation(properties.nodegroupName),
        ReleaseVersion: cdk.stringToCloudFormation(properties.releaseVersion),
        RemoteAccess: cfnNodegroupRemoteAccessPropertyToCloudFormation(properties.remoteAccess),
        ScalingConfig: cfnNodegroupScalingConfigPropertyToCloudFormation(properties.scalingConfig),
        Tags: cdk.objectToCloudFormation(properties.tags),
        Taints: cdk.listMapper(cfnNodegroupTaintPropertyToCloudFormation)(properties.taints),
        UpdateConfig: cfnNodegroupUpdateConfigPropertyToCloudFormation(properties.updateConfig),
        Version: cdk.stringToCloudFormation(properties.version),
    };
}

// @ts-ignore TS6133
function CfnNodegroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnNodegroupProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNodegroupProps>();
    ret.addPropertyResult('clusterName', 'ClusterName', cfn_parse.FromCloudFormation.getString(properties.ClusterName));
    ret.addPropertyResult('nodeRole', 'NodeRole', cfn_parse.FromCloudFormation.getString(properties.NodeRole));
    ret.addPropertyResult('subnets', 'Subnets', cfn_parse.FromCloudFormation.getStringArray(properties.Subnets));
    ret.addPropertyResult('amiType', 'AmiType', properties.AmiType != null ? cfn_parse.FromCloudFormation.getString(properties.AmiType) : undefined);
    ret.addPropertyResult('capacityType', 'CapacityType', properties.CapacityType != null ? cfn_parse.FromCloudFormation.getString(properties.CapacityType) : undefined);
    ret.addPropertyResult('diskSize', 'DiskSize', properties.DiskSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.DiskSize) : undefined);
    ret.addPropertyResult('forceUpdateEnabled', 'ForceUpdateEnabled', properties.ForceUpdateEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ForceUpdateEnabled) : undefined);
    ret.addPropertyResult('instanceTypes', 'InstanceTypes', properties.InstanceTypes != null ? cfn_parse.FromCloudFormation.getStringArray(properties.InstanceTypes) : undefined);
    ret.addPropertyResult('labels', 'Labels', properties.Labels != null ? cfn_parse.FromCloudFormation.getAny(properties.Labels) : undefined);
    ret.addPropertyResult('launchTemplate', 'LaunchTemplate', properties.LaunchTemplate != null ? CfnNodegroupLaunchTemplateSpecificationPropertyFromCloudFormation(properties.LaunchTemplate) : undefined);
    ret.addPropertyResult('nodegroupName', 'NodegroupName', properties.NodegroupName != null ? cfn_parse.FromCloudFormation.getString(properties.NodegroupName) : undefined);
    ret.addPropertyResult('releaseVersion', 'ReleaseVersion', properties.ReleaseVersion != null ? cfn_parse.FromCloudFormation.getString(properties.ReleaseVersion) : undefined);
    ret.addPropertyResult('remoteAccess', 'RemoteAccess', properties.RemoteAccess != null ? CfnNodegroupRemoteAccessPropertyFromCloudFormation(properties.RemoteAccess) : undefined);
    ret.addPropertyResult('scalingConfig', 'ScalingConfig', properties.ScalingConfig != null ? CfnNodegroupScalingConfigPropertyFromCloudFormation(properties.ScalingConfig) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined as any);
    ret.addPropertyResult('taints', 'Taints', properties.Taints != null ? cfn_parse.FromCloudFormation.getArray(CfnNodegroupTaintPropertyFromCloudFormation)(properties.Taints) : undefined);
    ret.addPropertyResult('updateConfig', 'UpdateConfig', properties.UpdateConfig != null ? CfnNodegroupUpdateConfigPropertyFromCloudFormation(properties.UpdateConfig) : undefined);
    ret.addPropertyResult('version', 'Version', properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::EKS::Nodegroup`
 *
 * Creates a managed node group for an Amazon EKS cluster. You can only create a node group for your cluster that is equal to the current Kubernetes version for the cluster. All node groups are created with the latest AMI release version for the respective minor Kubernetes version of the cluster, unless you deploy a custom AMI using a launch template. For more information about using launch templates, see [Launch template support](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html) .
 *
 * An Amazon EKS managed node group is an Amazon EC2 Auto Scaling group and associated Amazon EC2 instances that are managed by AWS for an Amazon EKS cluster. Each node group uses a version of the Amazon EKS optimized Amazon Linux 2 AMI. For more information, see [Managed Node Groups](https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html) in the *Amazon EKS User Guide* .
 *
 * @cloudformationResource AWS::EKS::Nodegroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html
 */
export class CfnNodegroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::EKS::Nodegroup";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnNodegroup {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnNodegroupPropsFromCloudFormation(resourceProperties);
        const ret = new CfnNodegroup(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) associated with the managed node group.
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The name of the cluster that the managed node group resides in.
     * @cloudformationAttribute ClusterName
     */
    public readonly attrClusterName: string;

    /**
     *
     * @cloudformationAttribute Id
     */
    public readonly attrId: string;

    /**
     * The name associated with an Amazon EKS managed node group.
     * @cloudformationAttribute NodegroupName
     */
    public readonly attrNodegroupName: string;

    /**
     * The name of the cluster to create the node group in.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-clustername
     */
    public clusterName: string;

    /**
     * The Amazon Resource Name (ARN) of the IAM role to associate with your node group. The Amazon EKS worker node `kubelet` daemon makes calls to AWS APIs on your behalf. Nodes receive permissions for these API calls through an IAM instance profile and associated policies. Before you can launch nodes and register them into a cluster, you must create an IAM role for those nodes to use when they are launched. For more information, see [Amazon EKS node IAM role](https://docs.aws.amazon.com/eks/latest/userguide/create-node-role.html) in the **Amazon EKS User Guide** . If you specify `launchTemplate` , then don't specify [`IamInstanceProfile`](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_IamInstanceProfile.html) in your launch template, or the node group deployment will fail. For more information about using launch templates with Amazon EKS, see [Launch template support](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html) in the *Amazon EKS User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-noderole
     */
    public nodeRole: string;

    /**
     * The subnets to use for the Auto Scaling group that is created for your node group. If you specify `launchTemplate` , then don't specify [`SubnetId`](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateNetworkInterface.html) in your launch template, or the node group deployment will fail. For more information about using launch templates with Amazon EKS, see [Launch template support](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html) in the *Amazon EKS User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-subnets
     */
    public subnets: string[];

    /**
     * The AMI type for your node group. GPU instance types should use the `AL2_x86_64_GPU` AMI type. Non-GPU instances should use the `AL2_x86_64` AMI type. Arm instances should use the `AL2_ARM_64` AMI type. All types use the Amazon EKS optimized Amazon Linux 2 AMI. If you specify `launchTemplate` , and your launch template uses a custom AMI, then don't specify `amiType` , or the node group deployment will fail. For more information about using launch templates with Amazon EKS, see [Launch template support](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html) in the *Amazon EKS User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-amitype
     */
    public amiType: string | undefined;

    /**
     * The capacity type of your managed node group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-capacitytype
     */
    public capacityType: string | undefined;

    /**
     * The root device disk size (in GiB) for your node group instances. The default disk size is 20 GiB. If you specify `launchTemplate` , then don't specify `diskSize` , or the node group deployment will fail. For more information about using launch templates with Amazon EKS, see [Launch template support](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html) in the *Amazon EKS User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-disksize
     */
    public diskSize: number | undefined;

    /**
     * Force the update if the existing node group's pods are unable to be drained due to a pod disruption budget issue. If an update fails because pods could not be drained, you can force the update after it fails to terminate the old node whether or not any pods are running on the node.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-forceupdateenabled
     */
    public forceUpdateEnabled: boolean | cdk.IResolvable | undefined;

    /**
     * Specify the instance types for a node group. If you specify a GPU instance type, be sure to specify `AL2_x86_64_GPU` with the `amiType` parameter. If you specify `launchTemplate` , then you can specify zero or one instance type in your launch template *or* you can specify 0-20 instance types for `instanceTypes` . If however, you specify an instance type in your launch template *and* specify any `instanceTypes` , the node group deployment will fail. If you don't specify an instance type in a launch template or for `instanceTypes` , then `t3.medium` is used, by default. If you specify `Spot` for `capacityType` , then we recommend specifying multiple values for `instanceTypes` . For more information, see [Managed node group capacity types](https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html#managed-node-group-capacity-types) and [Launch template support](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html) in the *Amazon EKS User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-instancetypes
     */
    public instanceTypes: string[] | undefined;

    /**
     * The Kubernetes labels to be applied to the nodes in the node group when they are created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-labels
     */
    public labels: any | cdk.IResolvable | undefined;

    /**
     * An object representing a node group's launch template specification. If specified, then do not specify `instanceTypes` , `diskSize` , or `remoteAccess` and make sure that the launch template meets the requirements in `launchTemplateSpecification` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-launchtemplate
     */
    public launchTemplate: CfnNodegroup.LaunchTemplateSpecificationProperty | cdk.IResolvable | undefined;

    /**
     * The unique name to give your node group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-nodegroupname
     */
    public nodegroupName: string | undefined;

    /**
     * The AMI version of the Amazon EKS optimized AMI to use with your node group (for example, `1.14.7- *YYYYMMDD*` ). By default, the latest available AMI version for the node group's current Kubernetes version is used. For more information, see [Amazon EKS optimized Linux AMI Versions](https://docs.aws.amazon.com/eks/latest/userguide/eks-linux-ami-versions.html) in the *Amazon EKS User Guide* .
     *
     * > Changing this value triggers an update of the node group if one is available. However, only the latest available AMI release version is valid as an input. You cannot roll back to a previous AMI release version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-releaseversion
     */
    public releaseVersion: string | undefined;

    /**
     * The remote access (SSH) configuration to use with your node group. If you specify `launchTemplate` , then don't specify `remoteAccess` , or the node group deployment will fail. For more information about using launch templates with Amazon EKS, see [Launch template support](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html) in the *Amazon EKS User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-remoteaccess
     */
    public remoteAccess: CfnNodegroup.RemoteAccessProperty | cdk.IResolvable | undefined;

    /**
     * The scaling configuration details for the Auto Scaling group that is created for your node group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-scalingconfig
     */
    public scalingConfig: CfnNodegroup.ScalingConfigProperty | cdk.IResolvable | undefined;

    /**
     * The metadata to apply to the node group to assist with categorization and organization. Each tag consists of a key and an optional value. You define both. Node group tags do not propagate to any other resources associated with the node group, such as the Amazon EC2 instances or subnets.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The Kubernetes taints to be applied to the nodes in the node group when they are created. Effect is one of `No_Schedule` , `Prefer_No_Schedule` , or `No_Execute` . Kubernetes taints can be used together with tolerations to control how workloads are scheduled to your nodes. For more information, see [Node taints on managed node groups](https://docs.aws.amazon.com/eks/latest/userguide/node-taints-managed-node-groups.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-taints
     */
    public taints: Array<CfnNodegroup.TaintProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The node group update configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-updateconfig
     */
    public updateConfig: CfnNodegroup.UpdateConfigProperty | cdk.IResolvable | undefined;

    /**
     * The Kubernetes version to use for your managed nodes. By default, the Kubernetes version of the cluster is used, and this is the only accepted specified value. If you specify `launchTemplate` , and your launch template uses a custom AMI, then don't specify `version` , or the node group deployment will fail. For more information about using launch templates with Amazon EKS, see [Launch template support](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html) in the *Amazon EKS User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-version
     */
    public version: string | undefined;

    /**
     * Create a new `AWS::EKS::Nodegroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnNodegroupProps) {
        super(scope, id, { type: CfnNodegroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'clusterName', this);
        cdk.requireProperty(props, 'nodeRole', this);
        cdk.requireProperty(props, 'subnets', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn'));
        this.attrClusterName = cdk.Token.asString(this.getAtt('ClusterName'));
        this.attrId = cdk.Token.asString(this.getAtt('Id'));
        this.attrNodegroupName = cdk.Token.asString(this.getAtt('NodegroupName'));

        this.clusterName = props.clusterName;
        this.nodeRole = props.nodeRole;
        this.subnets = props.subnets;
        this.amiType = props.amiType;
        this.capacityType = props.capacityType;
        this.diskSize = props.diskSize;
        this.forceUpdateEnabled = props.forceUpdateEnabled;
        this.instanceTypes = props.instanceTypes;
        this.labels = props.labels;
        this.launchTemplate = props.launchTemplate;
        this.nodegroupName = props.nodegroupName;
        this.releaseVersion = props.releaseVersion;
        this.remoteAccess = props.remoteAccess;
        this.scalingConfig = props.scalingConfig;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::EKS::Nodegroup", props.tags, { tagPropertyName: 'tags' });
        this.taints = props.taints;
        this.updateConfig = props.updateConfig;
        this.version = props.version;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnNodegroup.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            clusterName: this.clusterName,
            nodeRole: this.nodeRole,
            subnets: this.subnets,
            amiType: this.amiType,
            capacityType: this.capacityType,
            diskSize: this.diskSize,
            forceUpdateEnabled: this.forceUpdateEnabled,
            instanceTypes: this.instanceTypes,
            labels: this.labels,
            launchTemplate: this.launchTemplate,
            nodegroupName: this.nodegroupName,
            releaseVersion: this.releaseVersion,
            remoteAccess: this.remoteAccess,
            scalingConfig: this.scalingConfig,
            tags: this.tags.renderTags(),
            taints: this.taints,
            updateConfig: this.updateConfig,
            version: this.version,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnNodegroupPropsToCloudFormation(props);
    }
}

export namespace CfnNodegroup {
    /**
     * An object representing a node group launch template specification. The launch template cannot include [`SubnetId`](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateNetworkInterface.html) , [`IamInstanceProfile`](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_IamInstanceProfile.html) , [`RequestSpotInstances`](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_RequestSpotInstances.html) , [`HibernationOptions`](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_HibernationOptionsRequest.html) , or [`TerminateInstances`](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_TerminateInstances.html) , or the node group deployment or update will fail. For more information about launch templates, see [`CreateLaunchTemplate`](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateLaunchTemplate.html) in the Amazon EC2 API Reference. For more information about using launch templates with Amazon EKS, see [Launch template support](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html) in the *Amazon EKS User Guide* .
     *
     * Specify either `name` or `id` , but not both.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-launchtemplatespecification.html
     */
    export interface LaunchTemplateSpecificationProperty {
        /**
         * The ID of the launch template.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-launchtemplatespecification.html#cfn-eks-nodegroup-launchtemplatespecification-id
         */
        readonly id?: string;
        /**
         * The name of the launch template.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-launchtemplatespecification.html#cfn-eks-nodegroup-launchtemplatespecification-name
         */
        readonly name?: string;
        /**
         * The version of the launch template to use. If no version is specified, then the template's default version is used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-launchtemplatespecification.html#cfn-eks-nodegroup-launchtemplatespecification-version
         */
        readonly version?: string;
    }
}

/**
 * Determine whether the given properties match those of a `LaunchTemplateSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `LaunchTemplateSpecificationProperty`
 *
 * @returns the result of the validation.
 */
function CfnNodegroup_LaunchTemplateSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('version', cdk.validateString)(properties.version));
    return errors.wrap('supplied properties not correct for "LaunchTemplateSpecificationProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EKS::Nodegroup.LaunchTemplateSpecification` resource
 *
 * @param properties - the TypeScript properties of a `LaunchTemplateSpecificationProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EKS::Nodegroup.LaunchTemplateSpecification` resource.
 */
// @ts-ignore TS6133
function cfnNodegroupLaunchTemplateSpecificationPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnNodegroup_LaunchTemplateSpecificationPropertyValidator(properties).assertSuccess();
    return {
        Id: cdk.stringToCloudFormation(properties.id),
        Name: cdk.stringToCloudFormation(properties.name),
        Version: cdk.stringToCloudFormation(properties.version),
    };
}

// @ts-ignore TS6133
function CfnNodegroupLaunchTemplateSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnNodegroup.LaunchTemplateSpecificationProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNodegroup.LaunchTemplateSpecificationProperty>();
    ret.addPropertyResult('id', 'Id', properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('version', 'Version', properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnNodegroup {
    /**
     * An object representing the remote access configuration for the managed node group.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-remoteaccess.html
     */
    export interface RemoteAccessProperty {
        /**
         * The Amazon EC2 SSH key that provides access for SSH communication with the nodes in the managed node group. For more information, see [Amazon EC2 key pairs and Linux instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html) in the *Amazon Elastic Compute Cloud User Guide for Linux Instances* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-remoteaccess.html#cfn-eks-nodegroup-remoteaccess-ec2sshkey
         */
        readonly ec2SshKey: string;
        /**
         * The security groups that are allowed SSH access (port 22) to the nodes. If you specify an Amazon EC2 SSH key but do not specify a source security group when you create a managed node group, then port 22 on the nodes is opened to the internet (0.0.0.0/0). For more information, see [Security Groups for Your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html) in the *Amazon Virtual Private Cloud User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-remoteaccess.html#cfn-eks-nodegroup-remoteaccess-sourcesecuritygroups
         */
        readonly sourceSecurityGroups?: string[];
    }
}

/**
 * Determine whether the given properties match those of a `RemoteAccessProperty`
 *
 * @param properties - the TypeScript properties of a `RemoteAccessProperty`
 *
 * @returns the result of the validation.
 */
function CfnNodegroup_RemoteAccessPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('ec2SshKey', cdk.requiredValidator)(properties.ec2SshKey));
    errors.collect(cdk.propertyValidator('ec2SshKey', cdk.validateString)(properties.ec2SshKey));
    errors.collect(cdk.propertyValidator('sourceSecurityGroups', cdk.listValidator(cdk.validateString))(properties.sourceSecurityGroups));
    return errors.wrap('supplied properties not correct for "RemoteAccessProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EKS::Nodegroup.RemoteAccess` resource
 *
 * @param properties - the TypeScript properties of a `RemoteAccessProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EKS::Nodegroup.RemoteAccess` resource.
 */
// @ts-ignore TS6133
function cfnNodegroupRemoteAccessPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnNodegroup_RemoteAccessPropertyValidator(properties).assertSuccess();
    return {
        Ec2SshKey: cdk.stringToCloudFormation(properties.ec2SshKey),
        SourceSecurityGroups: cdk.listMapper(cdk.stringToCloudFormation)(properties.sourceSecurityGroups),
    };
}

// @ts-ignore TS6133
function CfnNodegroupRemoteAccessPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnNodegroup.RemoteAccessProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNodegroup.RemoteAccessProperty>();
    ret.addPropertyResult('ec2SshKey', 'Ec2SshKey', cfn_parse.FromCloudFormation.getString(properties.Ec2SshKey));
    ret.addPropertyResult('sourceSecurityGroups', 'SourceSecurityGroups', properties.SourceSecurityGroups != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SourceSecurityGroups) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnNodegroup {
    /**
     * An object representing the scaling configuration details for the Auto Scaling group that is associated with your node group. When creating a node group, you must specify all or none of the properties. When updating a node group, you can specify any or none of the properties.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-scalingconfig.html
     */
    export interface ScalingConfigProperty {
        /**
         * The current number of nodes that the managed node group should maintain.
         *
         * > If you use Cluster Autoscaler, you shouldn't change the desiredSize value directly, as this can cause the Cluster Autoscaler to suddenly scale up or scale down.
         *
         * Whenever this parameter changes, the number of worker nodes in the node group is updated to the specified size. If this parameter is given a value that is smaller than the current number of running worker nodes, the necessary number of worker nodes are terminated to match the given value. When using CloudFormation, no action occurs if you remove this parameter from your CFN template.
         *
         * This parameter can be different from minSize in some cases, such as when starting with extra hosts for testing. This parameter can also be different when you want to start with an estimated number of needed hosts, but let Cluster Autoscaler reduce the number if there are too many. When Cluster Autoscaler is used, the desiredSize parameter is altered by Cluster Autoscaler (but can be out-of-date for short periods of time). Cluster Autoscaler doesn't scale a managed node group lower than minSize or higher than maxSize.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-scalingconfig.html#cfn-eks-nodegroup-scalingconfig-desiredsize
         */
        readonly desiredSize?: number;
        /**
         * The maximum number of nodes that the managed node group can scale out to. For information about the maximum number that you can specify, see [Amazon EKS service quotas](https://docs.aws.amazon.com/eks/latest/userguide/service-quotas.html) in the *Amazon EKS User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-scalingconfig.html#cfn-eks-nodegroup-scalingconfig-maxsize
         */
        readonly maxSize?: number;
        /**
         * The minimum number of nodes that the managed node group can scale in to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-scalingconfig.html#cfn-eks-nodegroup-scalingconfig-minsize
         */
        readonly minSize?: number;
    }
}

/**
 * Determine whether the given properties match those of a `ScalingConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ScalingConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnNodegroup_ScalingConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('desiredSize', cdk.validateNumber)(properties.desiredSize));
    errors.collect(cdk.propertyValidator('maxSize', cdk.validateNumber)(properties.maxSize));
    errors.collect(cdk.propertyValidator('minSize', cdk.validateNumber)(properties.minSize));
    return errors.wrap('supplied properties not correct for "ScalingConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EKS::Nodegroup.ScalingConfig` resource
 *
 * @param properties - the TypeScript properties of a `ScalingConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EKS::Nodegroup.ScalingConfig` resource.
 */
// @ts-ignore TS6133
function cfnNodegroupScalingConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnNodegroup_ScalingConfigPropertyValidator(properties).assertSuccess();
    return {
        DesiredSize: cdk.numberToCloudFormation(properties.desiredSize),
        MaxSize: cdk.numberToCloudFormation(properties.maxSize),
        MinSize: cdk.numberToCloudFormation(properties.minSize),
    };
}

// @ts-ignore TS6133
function CfnNodegroupScalingConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnNodegroup.ScalingConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNodegroup.ScalingConfigProperty>();
    ret.addPropertyResult('desiredSize', 'DesiredSize', properties.DesiredSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.DesiredSize) : undefined);
    ret.addPropertyResult('maxSize', 'MaxSize', properties.MaxSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxSize) : undefined);
    ret.addPropertyResult('minSize', 'MinSize', properties.MinSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinSize) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnNodegroup {
    /**
     * A property that allows a node to repel a set of pods. For more information, see [Node taints on managed node groups](https://docs.aws.amazon.com/eks/latest/userguide/node-taints-managed-node-groups.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-taint.html
     */
    export interface TaintProperty {
        /**
         * The effect of the taint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-taint.html#cfn-eks-nodegroup-taint-effect
         */
        readonly effect?: string;
        /**
         * The key of the taint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-taint.html#cfn-eks-nodegroup-taint-key
         */
        readonly key?: string;
        /**
         * The value of the taint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-taint.html#cfn-eks-nodegroup-taint-value
         */
        readonly value?: string;
    }
}

/**
 * Determine whether the given properties match those of a `TaintProperty`
 *
 * @param properties - the TypeScript properties of a `TaintProperty`
 *
 * @returns the result of the validation.
 */
function CfnNodegroup_TaintPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('effect', cdk.validateString)(properties.effect));
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "TaintProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EKS::Nodegroup.Taint` resource
 *
 * @param properties - the TypeScript properties of a `TaintProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EKS::Nodegroup.Taint` resource.
 */
// @ts-ignore TS6133
function cfnNodegroupTaintPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnNodegroup_TaintPropertyValidator(properties).assertSuccess();
    return {
        Effect: cdk.stringToCloudFormation(properties.effect),
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnNodegroupTaintPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnNodegroup.TaintProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNodegroup.TaintProperty>();
    ret.addPropertyResult('effect', 'Effect', properties.Effect != null ? cfn_parse.FromCloudFormation.getString(properties.Effect) : undefined);
    ret.addPropertyResult('key', 'Key', properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnNodegroup {
    /**
     * The update configuration for the node group.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-updateconfig.html
     */
    export interface UpdateConfigProperty {
        /**
         * The maximum number of nodes unavailable at once during a version update. Nodes will be updated in parallel. This value or `maxUnavailablePercentage` is required to have a value.The maximum number is 100.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-updateconfig.html#cfn-eks-nodegroup-updateconfig-maxunavailable
         */
        readonly maxUnavailable?: number;
        /**
         * The maximum percentage of nodes unavailable during a version update. This percentage of nodes will be updated in parallel, up to 100 nodes at once. This value or `maxUnavailable` is required to have a value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-updateconfig.html#cfn-eks-nodegroup-updateconfig-maxunavailablepercentage
         */
        readonly maxUnavailablePercentage?: number;
    }
}

/**
 * Determine whether the given properties match those of a `UpdateConfigProperty`
 *
 * @param properties - the TypeScript properties of a `UpdateConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnNodegroup_UpdateConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('maxUnavailable', cdk.validateNumber)(properties.maxUnavailable));
    errors.collect(cdk.propertyValidator('maxUnavailablePercentage', cdk.validateNumber)(properties.maxUnavailablePercentage));
    return errors.wrap('supplied properties not correct for "UpdateConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::EKS::Nodegroup.UpdateConfig` resource
 *
 * @param properties - the TypeScript properties of a `UpdateConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::EKS::Nodegroup.UpdateConfig` resource.
 */
// @ts-ignore TS6133
function cfnNodegroupUpdateConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnNodegroup_UpdateConfigPropertyValidator(properties).assertSuccess();
    return {
        MaxUnavailable: cdk.numberToCloudFormation(properties.maxUnavailable),
        MaxUnavailablePercentage: cdk.numberToCloudFormation(properties.maxUnavailablePercentage),
    };
}

// @ts-ignore TS6133
function CfnNodegroupUpdateConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnNodegroup.UpdateConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNodegroup.UpdateConfigProperty>();
    ret.addPropertyResult('maxUnavailable', 'MaxUnavailable', properties.MaxUnavailable != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxUnavailable) : undefined);
    ret.addPropertyResult('maxUnavailablePercentage', 'MaxUnavailablePercentage', properties.MaxUnavailablePercentage != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxUnavailablePercentage) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
