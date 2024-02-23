/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates an Amazon EKS add-on.
 *
 * Amazon EKS add-ons help to automate the provisioning and lifecycle management of common operational software for Amazon EKS clusters. For more information, see [Amazon EKS add-ons](https://docs.aws.amazon.com/eks/latest/userguide/eks-add-ons.html) in the *Amazon EKS User Guide* .
 *
 * @cloudformationResource AWS::EKS::Addon
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html
 */
export class CfnAddon extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::EKS::Addon";

  /**
   * Build a CfnAddon from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAddon(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the add-on, such as `arn:aws:eks:us-west-2:111122223333:addon/1-19/vpc-cni/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The name of the add-on.
   */
  public addonName: string;

  /**
   * The version of the add-on.
   */
  public addonVersion?: string;

  /**
   * The name of your cluster.
   */
  public clusterName: string;

  /**
   * The configuration values that you provided.
   */
  public configurationValues?: string;

  /**
   * Specifying this option preserves the add-on software on your cluster but Amazon EKS stops managing any settings for the add-on.
   */
  public preserveOnDelete?: boolean | cdk.IResolvable;

  /**
   * How to resolve field value conflicts for an Amazon EKS add-on.
   */
  public resolveConflicts?: string;

  /**
   * The Amazon Resource Name (ARN) of an existing IAM role to bind to the add-on's service account.
   */
  public serviceAccountRoleArn?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The metadata that you apply to the add-on to assist with categorization and organization.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAddonProps) {
    super(scope, id, {
      "type": CfnAddon.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "addonName", this);
    cdk.requireProperty(props, "clusterName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.addonName = props.addonName;
    this.addonVersion = props.addonVersion;
    this.clusterName = props.clusterName;
    this.configurationValues = props.configurationValues;
    this.preserveOnDelete = props.preserveOnDelete;
    this.resolveConflicts = props.resolveConflicts;
    this.serviceAccountRoleArn = props.serviceAccountRoleArn;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::EKS::Addon", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "addonName": this.addonName,
      "addonVersion": this.addonVersion,
      "clusterName": this.clusterName,
      "configurationValues": this.configurationValues,
      "preserveOnDelete": this.preserveOnDelete,
      "resolveConflicts": this.resolveConflicts,
      "serviceAccountRoleArn": this.serviceAccountRoleArn,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAddon.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAddonPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnAddon`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html
 */
export interface CfnAddonProps {
  /**
   * The name of the add-on.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-addonname
   */
  readonly addonName: string;

  /**
   * The version of the add-on.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-addonversion
   */
  readonly addonVersion?: string;

  /**
   * The name of your cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-clustername
   */
  readonly clusterName: string;

  /**
   * The configuration values that you provided.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-configurationvalues
   */
  readonly configurationValues?: string;

  /**
   * Specifying this option preserves the add-on software on your cluster but Amazon EKS stops managing any settings for the add-on.
   *
   * If an IAM account is associated with the add-on, it isn't removed.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-preserveondelete
   */
  readonly preserveOnDelete?: boolean | cdk.IResolvable;

  /**
   * How to resolve field value conflicts for an Amazon EKS add-on.
   *
   * Conflicts are handled based on the value you choose:
   *
   * - *None* – If the self-managed version of the add-on is installed on your cluster, Amazon EKS doesn't change the value. Creation of the add-on might fail.
   * - *Overwrite* – If the self-managed version of the add-on is installed on your cluster and the Amazon EKS default value is different than the existing value, Amazon EKS changes the value to the Amazon EKS default value.
   * - *Preserve* – This is similar to the NONE option. If the self-managed version of the add-on is installed on your cluster Amazon EKS doesn't change the add-on resource properties. Creation of the add-on might fail if conflicts are detected. This option works differently during the update operation. For more information, see [UpdateAddon](https://docs.aws.amazon.com/eks/latest/APIReference/API_UpdateAddon.html) .
   *
   * If you don't currently have the self-managed version of the add-on installed on your cluster, the Amazon EKS add-on is installed. Amazon EKS sets all values to default values, regardless of the option that you specify.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-resolveconflicts
   */
  readonly resolveConflicts?: string;

  /**
   * The Amazon Resource Name (ARN) of an existing IAM role to bind to the add-on's service account.
   *
   * The role must be assigned the IAM permissions required by the add-on. If you don't specify an existing IAM role, then the add-on uses the permissions assigned to the node IAM role. For more information, see [Amazon EKS node IAM role](https://docs.aws.amazon.com/eks/latest/userguide/create-node-role.html) in the *Amazon EKS User Guide* .
   *
   * > To specify an existing IAM role, you must have an IAM OpenID Connect (OIDC) provider created for your cluster. For more information, see [Enabling IAM roles for service accounts on your cluster](https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html) in the *Amazon EKS User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-serviceaccountrolearn
   */
  readonly serviceAccountRoleArn?: string;

  /**
   * The metadata that you apply to the add-on to assist with categorization and organization.
   *
   * Each tag consists of a key and an optional value, both of which you define. Add-on tags do not propagate to any other resources associated with the cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnAddonProps`
 *
 * @param properties - the TypeScript properties of a `CfnAddonProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAddonPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("addonName", cdk.requiredValidator)(properties.addonName));
  errors.collect(cdk.propertyValidator("addonName", cdk.validateString)(properties.addonName));
  errors.collect(cdk.propertyValidator("addonVersion", cdk.validateString)(properties.addonVersion));
  errors.collect(cdk.propertyValidator("clusterName", cdk.requiredValidator)(properties.clusterName));
  errors.collect(cdk.propertyValidator("clusterName", cdk.validateString)(properties.clusterName));
  errors.collect(cdk.propertyValidator("configurationValues", cdk.validateString)(properties.configurationValues));
  errors.collect(cdk.propertyValidator("preserveOnDelete", cdk.validateBoolean)(properties.preserveOnDelete));
  errors.collect(cdk.propertyValidator("resolveConflicts", cdk.validateString)(properties.resolveConflicts));
  errors.collect(cdk.propertyValidator("serviceAccountRoleArn", cdk.validateString)(properties.serviceAccountRoleArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnAddonProps\"");
}

// @ts-ignore TS6133
function convertCfnAddonPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAddonPropsValidator(properties).assertSuccess();
  return {
    "AddonName": cdk.stringToCloudFormation(properties.addonName),
    "AddonVersion": cdk.stringToCloudFormation(properties.addonVersion),
    "ClusterName": cdk.stringToCloudFormation(properties.clusterName),
    "ConfigurationValues": cdk.stringToCloudFormation(properties.configurationValues),
    "PreserveOnDelete": cdk.booleanToCloudFormation(properties.preserveOnDelete),
    "ResolveConflicts": cdk.stringToCloudFormation(properties.resolveConflicts),
    "ServiceAccountRoleArn": cdk.stringToCloudFormation(properties.serviceAccountRoleArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnAddonPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAddonProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAddonProps>();
  ret.addPropertyResult("addonName", "AddonName", (properties.AddonName != null ? cfn_parse.FromCloudFormation.getString(properties.AddonName) : undefined));
  ret.addPropertyResult("addonVersion", "AddonVersion", (properties.AddonVersion != null ? cfn_parse.FromCloudFormation.getString(properties.AddonVersion) : undefined));
  ret.addPropertyResult("clusterName", "ClusterName", (properties.ClusterName != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterName) : undefined));
  ret.addPropertyResult("configurationValues", "ConfigurationValues", (properties.ConfigurationValues != null ? cfn_parse.FromCloudFormation.getString(properties.ConfigurationValues) : undefined));
  ret.addPropertyResult("preserveOnDelete", "PreserveOnDelete", (properties.PreserveOnDelete != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PreserveOnDelete) : undefined));
  ret.addPropertyResult("resolveConflicts", "ResolveConflicts", (properties.ResolveConflicts != null ? cfn_parse.FromCloudFormation.getString(properties.ResolveConflicts) : undefined));
  ret.addPropertyResult("serviceAccountRoleArn", "ServiceAccountRoleArn", (properties.ServiceAccountRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceAccountRoleArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates an Amazon EKS control plane.
 *
 * The Amazon EKS control plane consists of control plane instances that run the Kubernetes software, such as `etcd` and the API server. The control plane runs in an account managed by AWS , and the Kubernetes API is exposed by the Amazon EKS API server endpoint. Each Amazon EKS cluster control plane is single tenant and unique. It runs on its own set of Amazon EC2 instances.
 *
 * The cluster control plane is provisioned across multiple Availability Zones and fronted by an Elastic Load Balancing Network Load Balancer. Amazon EKS also provisions elastic network interfaces in your VPC subnets to provide connectivity from the control plane instances to the nodes (for example, to support `kubectl exec` , `logs` , and `proxy` data flows).
 *
 * Amazon EKS nodes run in your AWS account and connect to your cluster's control plane over the Kubernetes API server endpoint and a certificate file that is created for your cluster.
 *
 * You can use the `endpointPublicAccess` and `endpointPrivateAccess` parameters to enable or disable public and private access to your cluster's Kubernetes API server endpoint. By default, public access is enabled, and private access is disabled. For more information, see [Amazon EKS Cluster Endpoint Access Control](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html) in the **Amazon EKS User Guide** .
 *
 * You can use the `logging` parameter to enable or disable exporting the Kubernetes control plane logs for your cluster to CloudWatch Logs. By default, cluster control plane logs aren't exported to CloudWatch Logs. For more information, see [Amazon EKS Cluster Control Plane Logs](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html) in the **Amazon EKS User Guide** .
 *
 * > CloudWatch Logs ingestion, archive storage, and data scanning rates apply to exported control plane logs. For more information, see [CloudWatch Pricing](https://docs.aws.amazon.com/cloudwatch/pricing/) .
 *
 * In most cases, it takes several minutes to create a cluster. After you create an Amazon EKS cluster, you must configure your Kubernetes tooling to communicate with the API server and launch nodes into your cluster. For more information, see [Managing Cluster Authentication](https://docs.aws.amazon.com/eks/latest/userguide/managing-auth.html) and [Launching Amazon EKS nodes](https://docs.aws.amazon.com/eks/latest/userguide/launch-workers.html) in the *Amazon EKS User Guide* .
 *
 * @cloudformationResource AWS::EKS::Cluster
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html
 */
export class CfnCluster extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::EKS::Cluster";

  /**
   * Build a CfnCluster from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCluster(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the cluster, such as `arn:aws:eks:us-west-2:666666666666:cluster/prod` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The `certificate-authority-data` for your cluster.
   *
   * @cloudformationAttribute CertificateAuthorityData
   */
  public readonly attrCertificateAuthorityData: string;

  /**
   * The cluster security group that was created by Amazon EKS for the cluster. Managed node groups use this security group for control plane to data plane communication.
   *
   * This parameter is only returned by Amazon EKS clusters that support managed node groups. For more information, see [Managed node groups](https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html) in the *Amazon EKS User Guide* .
   *
   * @cloudformationAttribute ClusterSecurityGroupId
   */
  public readonly attrClusterSecurityGroupId: string;

  /**
   * Amazon Resource Name (ARN) or alias of the customer master key (CMK).
   *
   * @cloudformationAttribute EncryptionConfigKeyArn
   */
  public readonly attrEncryptionConfigKeyArn: string;

  /**
   * The endpoint for your Kubernetes API server, such as `https://5E1D0CEXAMPLEA591B746AFC5AB30262.yl4.us-west-2.eks.amazonaws.com` .
   *
   * @cloudformationAttribute Endpoint
   */
  public readonly attrEndpoint: string;

  /**
   * The ID of your local Amazon EKS cluster on an AWS Outpost. This property isn't available for an Amazon EKS cluster on the AWS cloud.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The CIDR block to assign Kubernetes service IP addresses from.
   *
   * @cloudformationAttribute KubernetesNetworkConfig.ServiceIpv6Cidr
   */
  public readonly attrKubernetesNetworkConfigServiceIpv6Cidr: string;

  /**
   * The issuer URL for the OIDC identity provider of the cluster, such as `https://oidc.eks.us-west-2.amazonaws.com/id/EXAMPLED539D4633E53DE1B716D3041E` . If you need to remove `https://` from this output value, you can include the following code in your template.
   *
   * `!Select [1, !Split ["//", !GetAtt EKSCluster.OpenIdConnectIssuerUrl]]`
   *
   * @cloudformationAttribute OpenIdConnectIssuerUrl
   */
  public readonly attrOpenIdConnectIssuerUrl: string;

  /**
   * The access configuration for the cluster.
   */
  public accessConfig?: CfnCluster.AccessConfigProperty | cdk.IResolvable;

  /**
   * The encryption configuration for the cluster.
   */
  public encryptionConfig?: Array<CfnCluster.EncryptionConfigProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The Kubernetes network configuration for the cluster.
   */
  public kubernetesNetworkConfig?: cdk.IResolvable | CfnCluster.KubernetesNetworkConfigProperty;

  /**
   * The logging configuration for your cluster.
   */
  public logging?: cdk.IResolvable | CfnCluster.LoggingProperty;

  /**
   * The unique name to give to your cluster.
   */
  public name?: string;

  /**
   * An object representing the configuration of your local Amazon EKS cluster on an AWS Outpost.
   */
  public outpostConfig?: cdk.IResolvable | CfnCluster.OutpostConfigProperty;

  /**
   * The VPC configuration that's used by the cluster control plane.
   */
  public resourcesVpcConfig: cdk.IResolvable | CfnCluster.ResourcesVpcConfigProperty;

  /**
   * The Amazon Resource Name (ARN) of the IAM role that provides permissions for the Kubernetes control plane to make calls to AWS API operations on your behalf.
   */
  public roleArn: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The metadata that you apply to the cluster to assist with categorization and organization.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The desired Kubernetes version for your cluster.
   */
  public version?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnClusterProps) {
    super(scope, id, {
      "type": CfnCluster.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "resourcesVpcConfig", this);
    cdk.requireProperty(props, "roleArn", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCertificateAuthorityData = cdk.Token.asString(this.getAtt("CertificateAuthorityData", cdk.ResolutionTypeHint.STRING));
    this.attrClusterSecurityGroupId = cdk.Token.asString(this.getAtt("ClusterSecurityGroupId", cdk.ResolutionTypeHint.STRING));
    this.attrEncryptionConfigKeyArn = cdk.Token.asString(this.getAtt("EncryptionConfigKeyArn", cdk.ResolutionTypeHint.STRING));
    this.attrEndpoint = cdk.Token.asString(this.getAtt("Endpoint", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrKubernetesNetworkConfigServiceIpv6Cidr = cdk.Token.asString(this.getAtt("KubernetesNetworkConfig.ServiceIpv6Cidr", cdk.ResolutionTypeHint.STRING));
    this.attrOpenIdConnectIssuerUrl = cdk.Token.asString(this.getAtt("OpenIdConnectIssuerUrl", cdk.ResolutionTypeHint.STRING));
    this.accessConfig = props.accessConfig;
    this.encryptionConfig = props.encryptionConfig;
    this.kubernetesNetworkConfig = props.kubernetesNetworkConfig;
    this.logging = props.logging;
    this.name = props.name;
    this.outpostConfig = props.outpostConfig;
    this.resourcesVpcConfig = props.resourcesVpcConfig;
    this.roleArn = props.roleArn;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::EKS::Cluster", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.version = props.version;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accessConfig": this.accessConfig,
      "encryptionConfig": this.encryptionConfig,
      "kubernetesNetworkConfig": this.kubernetesNetworkConfig,
      "logging": this.logging,
      "name": this.name,
      "outpostConfig": this.outpostConfig,
      "resourcesVpcConfig": this.resourcesVpcConfig,
      "roleArn": this.roleArn,
      "tags": this.tags.renderTags(),
      "version": this.version
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCluster.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnClusterPropsToCloudFormation(props);
  }
}

export namespace CfnCluster {
  /**
   * Enable or disable exporting the Kubernetes control plane logs for your cluster to CloudWatch Logs.
   *
   * By default, cluster control plane logs aren't exported to CloudWatch Logs. For more information, see [Amazon EKS Cluster control plane logs](https://docs.aws.amazon.com/eks/latest/userguide/control-plane-logs.html) in the **Amazon EKS User Guide** .
   *
   * > When updating a resource, you must include this `Logging` property if the previous CloudFormation template of the resource had it. > CloudWatch Logs ingestion, archive storage, and data scanning rates apply to exported control plane logs. For more information, see [CloudWatch Pricing](https://docs.aws.amazon.com/cloudwatch/pricing/) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-logging.html
   */
  export interface LoggingProperty {
    /**
     * The cluster control plane logging configuration for your cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-logging.html#cfn-eks-cluster-logging-clusterlogging
     */
    readonly clusterLogging?: CfnCluster.ClusterLoggingProperty | cdk.IResolvable;
  }

  /**
   * The cluster control plane logging configuration for your cluster.
   *
   * > When updating a resource, you must include this `ClusterLogging` property if the previous CloudFormation template of the resource had it.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-clusterlogging.html
   */
  export interface ClusterLoggingProperty {
    /**
     * The enabled control plane logs for your cluster. All log types are disabled if the array is empty.
     *
     * > When updating a resource, you must include this `EnabledTypes` property if the previous CloudFormation template of the resource had it.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-clusterlogging.html#cfn-eks-cluster-clusterlogging-enabledtypes
     */
    readonly enabledTypes?: Array<cdk.IResolvable | CfnCluster.LoggingTypeConfigProperty> | cdk.IResolvable;
  }

  /**
   * The enabled logging type.
   *
   * For a list of the valid logging types, see the [`types` property of `LogSetup`](https://docs.aws.amazon.com/eks/latest/APIReference/API_LogSetup.html#AmazonEKS-Type-LogSetup-types) in the *Amazon EKS API Reference* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-loggingtypeconfig.html
   */
  export interface LoggingTypeConfigProperty {
    /**
     * The name of the log type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-loggingtypeconfig.html#cfn-eks-cluster-loggingtypeconfig-type
     */
    readonly type?: string;
  }

  /**
   * The configuration of your local Amazon EKS cluster on an AWS Outpost.
   *
   * Before creating a cluster on an Outpost, review [Creating a local cluster on an Outpost](https://docs.aws.amazon.com/eks/latest/userguide/eks-outposts-local-cluster-create.html) in the *Amazon EKS User Guide* . This API isn't available for Amazon EKS clusters on the AWS cloud.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-outpostconfig.html
   */
  export interface OutpostConfigProperty {
    /**
     * The Amazon EC2 instance type that you want to use for your local Amazon EKS cluster on Outposts.
     *
     * Choose an instance type based on the number of nodes that your cluster will have. For more information, see [Capacity considerations](https://docs.aws.amazon.com/eks/latest/userguide/eks-outposts-capacity-considerations.html) in the *Amazon EKS User Guide* .
     *
     * The instance type that you specify is used for all Kubernetes control plane instances. The instance type can't be changed after cluster creation. The control plane is not automatically scaled by Amazon EKS.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-outpostconfig.html#cfn-eks-cluster-outpostconfig-controlplaneinstancetype
     */
    readonly controlPlaneInstanceType: string;

    /**
     * An object representing the placement configuration for all the control plane instances of your local Amazon EKS cluster on an AWS Outpost.
     *
     * For more information, see [Capacity considerations](https://docs.aws.amazon.com/eks/latest/userguide/eks-outposts-capacity-considerations.html) in the *Amazon EKS User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-outpostconfig.html#cfn-eks-cluster-outpostconfig-controlplaneplacement
     */
    readonly controlPlanePlacement?: CfnCluster.ControlPlanePlacementProperty | cdk.IResolvable;

    /**
     * The ARN of the Outpost that you want to use for your local Amazon EKS cluster on Outposts.
     *
     * Only a single Outpost ARN is supported.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-outpostconfig.html#cfn-eks-cluster-outpostconfig-outpostarns
     */
    readonly outpostArns: Array<string>;
  }

  /**
   * The placement configuration for all the control plane instances of your local Amazon EKS cluster on an AWS Outpost.
   *
   * For more information, see [Capacity considerations](https://docs.aws.amazon.com/eks/latest/userguide/eks-outposts-capacity-considerations.html) in the Amazon EKS User Guide.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-controlplaneplacement.html
   */
  export interface ControlPlanePlacementProperty {
    /**
     * The name of the placement group for the Kubernetes control plane instances.
     *
     * This property is only used for a local cluster on an AWS Outpost.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-controlplaneplacement.html#cfn-eks-cluster-controlplaneplacement-groupname
     */
    readonly groupName?: string;
  }

  /**
   * The encryption configuration for the cluster.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-encryptionconfig.html
   */
  export interface EncryptionConfigProperty {
    /**
     * The encryption provider for the cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-encryptionconfig.html#cfn-eks-cluster-encryptionconfig-provider
     */
    readonly provider?: cdk.IResolvable | CfnCluster.ProviderProperty;

    /**
     * Specifies the resources to be encrypted.
     *
     * The only supported value is `secrets` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-encryptionconfig.html#cfn-eks-cluster-encryptionconfig-resources
     */
    readonly resources?: Array<string>;
  }

  /**
   * Identifies the AWS Key Management Service ( AWS KMS ) key used to encrypt the secrets.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-provider.html
   */
  export interface ProviderProperty {
    /**
     * Amazon Resource Name (ARN) or alias of the KMS key.
     *
     * The KMS key must be symmetric and created in the same AWS Region as the cluster. If the KMS key was created in a different account, the [IAM principal](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_terms-and-concepts.html) must have access to the KMS key. For more information, see [Allowing users in other accounts to use a KMS key](https://docs.aws.amazon.com/kms/latest/developerguide/key-policy-modifying-external-accounts.html) in the *AWS Key Management Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-provider.html#cfn-eks-cluster-provider-keyarn
     */
    readonly keyArn?: string;
  }

  /**
   * The Kubernetes network configuration for the cluster.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-kubernetesnetworkconfig.html
   */
  export interface KubernetesNetworkConfigProperty {
    /**
     * Specify which IP family is used to assign Kubernetes pod and service IP addresses.
     *
     * If you don't specify a value, `ipv4` is used by default. You can only specify an IP family when you create a cluster and can't change this value once the cluster is created. If you specify `ipv6` , the VPC and subnets that you specify for cluster creation must have both `IPv4` and `IPv6` CIDR blocks assigned to them. You can't specify `ipv6` for clusters in China Regions.
     *
     * You can only specify `ipv6` for `1.21` and later clusters that use version `1.10.1` or later of the Amazon VPC CNI add-on. If you specify `ipv6` , then ensure that your VPC meets the requirements listed in the considerations listed in [Assigning IPv6 addresses to pods and services](https://docs.aws.amazon.com/eks/latest/userguide/cni-ipv6.html) in the Amazon EKS User Guide. Kubernetes assigns services `IPv6` addresses from the unique local address range `(fc00::/7)` . You can't specify a custom `IPv6` CIDR block. Pod addresses are assigned from the subnet's `IPv6` CIDR.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-kubernetesnetworkconfig.html#cfn-eks-cluster-kubernetesnetworkconfig-ipfamily
     */
    readonly ipFamily?: string;

    /**
     * Don't specify a value if you select `ipv6` for *ipFamily* .
     *
     * The CIDR block to assign Kubernetes service IP addresses from. If you don't specify a block, Kubernetes assigns addresses from either the `10.100.0.0/16` or `172.20.0.0/16` CIDR blocks. We recommend that you specify a block that does not overlap with resources in other networks that are peered or connected to your VPC. The block must meet the following requirements:
     *
     * - Within one of the following private IP address blocks: `10.0.0.0/8` , `172.16.0.0/12` , or `192.168.0.0/16` .
     * - Doesn't overlap with any CIDR block assigned to the VPC that you selected for VPC.
     * - Between `/24` and `/12` .
     *
     * > You can only specify a custom CIDR block when you create a cluster. You can't change this value after the cluster is created.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-kubernetesnetworkconfig.html#cfn-eks-cluster-kubernetesnetworkconfig-serviceipv4cidr
     */
    readonly serviceIpv4Cidr?: string;

    /**
     * The CIDR block that Kubernetes pod and service IP addresses are assigned from if you created a 1.21 or later cluster with version 1.10.1 or later of the Amazon VPC CNI add-on and specified `ipv6` for *ipFamily* when you created the cluster. Kubernetes assigns service addresses from the unique local address range ( `fc00::/7` ) because you can't specify a custom IPv6 CIDR block when you create the cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-kubernetesnetworkconfig.html#cfn-eks-cluster-kubernetesnetworkconfig-serviceipv6cidr
     */
    readonly serviceIpv6Cidr?: string;
  }

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
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-resourcesvpcconfig.html
   */
  export interface ResourcesVpcConfigProperty {
    /**
     * Set this value to `true` to enable private access for your cluster's Kubernetes API server endpoint.
     *
     * If you enable private access, Kubernetes API requests from within your cluster's VPC use the private VPC endpoint. The default value for this parameter is `false` , which disables private access for your Kubernetes API server. If you disable private access and you have nodes or AWS Fargate pods in the cluster, then ensure that `publicAccessCidrs` includes the necessary CIDR blocks for communication with the nodes or Fargate pods. For more information, see [Amazon EKS cluster endpoint access control](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html) in the **Amazon EKS User Guide** .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-resourcesvpcconfig.html#cfn-eks-cluster-resourcesvpcconfig-endpointprivateaccess
     */
    readonly endpointPrivateAccess?: boolean | cdk.IResolvable;

    /**
     * Set this value to `false` to disable public access to your cluster's Kubernetes API server endpoint.
     *
     * If you disable public access, your cluster's Kubernetes API server can only receive requests from within the cluster VPC. The default value for this parameter is `true` , which enables public access for your Kubernetes API server. For more information, see [Amazon EKS cluster endpoint access control](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html) in the **Amazon EKS User Guide** .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-resourcesvpcconfig.html#cfn-eks-cluster-resourcesvpcconfig-endpointpublicaccess
     */
    readonly endpointPublicAccess?: boolean | cdk.IResolvable;

    /**
     * The CIDR blocks that are allowed access to your cluster's public Kubernetes API server endpoint.
     *
     * Communication to the endpoint from addresses outside of the CIDR blocks that you specify is denied. The default value is `0.0.0.0/0` . If you've disabled private endpoint access, make sure that you specify the necessary CIDR blocks for every node and AWS Fargate `Pod` in the cluster. For more information, see [Amazon EKS cluster endpoint access control](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html) in the **Amazon EKS User Guide** .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-resourcesvpcconfig.html#cfn-eks-cluster-resourcesvpcconfig-publicaccesscidrs
     */
    readonly publicAccessCidrs?: Array<string>;

    /**
     * Specify one or more security groups for the cross-account elastic network interfaces that Amazon EKS creates to use that allow communication between your nodes and the Kubernetes control plane.
     *
     * If you don't specify any security groups, then familiarize yourself with the difference between Amazon EKS defaults for clusters deployed with Kubernetes. For more information, see [Amazon EKS security group considerations](https://docs.aws.amazon.com/eks/latest/userguide/sec-group-reqs.html) in the **Amazon EKS User Guide** .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-resourcesvpcconfig.html#cfn-eks-cluster-resourcesvpcconfig-securitygroupids
     */
    readonly securityGroupIds?: Array<string>;

    /**
     * Specify subnets for your Amazon EKS nodes.
     *
     * Amazon EKS creates cross-account elastic network interfaces in these subnets to allow communication between your nodes and the Kubernetes control plane.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-resourcesvpcconfig.html#cfn-eks-cluster-resourcesvpcconfig-subnetids
     */
    readonly subnetIds: Array<string>;
  }

  /**
   * The access configuration for the cluster.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-accessconfig.html
   */
  export interface AccessConfigProperty {
    /**
     * The desired authentication mode for the cluster.
     *
     * If you create a cluster by using the EKS API, AWS SDKs, or AWS CloudFormation , the default is `CONFIG_MAP` . If you create the cluster by using the AWS Management Console , the default value is `API_AND_CONFIG_MAP` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-accessconfig.html#cfn-eks-cluster-accessconfig-authenticationmode
     */
    readonly authenticationMode?: string;

    /**
     * Specifies whether or not the cluster creator IAM principal was set as a cluster admin access entry during cluster creation time.
     *
     * The default value is `true` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-accessconfig.html#cfn-eks-cluster-accessconfig-bootstrapclustercreatoradminpermissions
     */
    readonly bootstrapClusterCreatorAdminPermissions?: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnCluster`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html
 */
export interface CfnClusterProps {
  /**
   * The access configuration for the cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-accessconfig
   */
  readonly accessConfig?: CfnCluster.AccessConfigProperty | cdk.IResolvable;

  /**
   * The encryption configuration for the cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-encryptionconfig
   */
  readonly encryptionConfig?: Array<CfnCluster.EncryptionConfigProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The Kubernetes network configuration for the cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-kubernetesnetworkconfig
   */
  readonly kubernetesNetworkConfig?: cdk.IResolvable | CfnCluster.KubernetesNetworkConfigProperty;

  /**
   * The logging configuration for your cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-logging
   */
  readonly logging?: cdk.IResolvable | CfnCluster.LoggingProperty;

  /**
   * The unique name to give to your cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-name
   */
  readonly name?: string;

  /**
   * An object representing the configuration of your local Amazon EKS cluster on an AWS Outpost.
   *
   * This object isn't available for clusters on the AWS cloud.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-outpostconfig
   */
  readonly outpostConfig?: cdk.IResolvable | CfnCluster.OutpostConfigProperty;

  /**
   * The VPC configuration that's used by the cluster control plane.
   *
   * Amazon EKS VPC resources have specific requirements to work properly with Kubernetes. For more information, see [Cluster VPC Considerations](https://docs.aws.amazon.com/eks/latest/userguide/network_reqs.html) and [Cluster Security Group Considerations](https://docs.aws.amazon.com/eks/latest/userguide/sec-group-reqs.html) in the *Amazon EKS User Guide* . You must specify at least two subnets. You can specify up to five security groups, but we recommend that you use a dedicated security group for your cluster control plane.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-resourcesvpcconfig
   */
  readonly resourcesVpcConfig: cdk.IResolvable | CfnCluster.ResourcesVpcConfigProperty;

  /**
   * The Amazon Resource Name (ARN) of the IAM role that provides permissions for the Kubernetes control plane to make calls to AWS API operations on your behalf.
   *
   * For more information, see [Amazon EKS Service IAM Role](https://docs.aws.amazon.com/eks/latest/userguide/service_IAM_role.html) in the **Amazon EKS User Guide** .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-rolearn
   */
  readonly roleArn: string;

  /**
   * The metadata that you apply to the cluster to assist with categorization and organization.
   *
   * Each tag consists of a key and an optional value, both of which you define. Cluster tags don't propagate to any other resources associated with the cluster.
   *
   * > You must have the `eks:TagResource` and `eks:UntagResource` permissions for your [IAM principal](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_terms-and-concepts.html) to manage the AWS CloudFormation stack. If you don't have these permissions, there might be unexpected behavior with stack-level tags propagating to the resource during resource creation and update.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The desired Kubernetes version for your cluster.
   *
   * If you don't specify a value here, the default version available in Amazon EKS is used.
   *
   * > The default version might not be the latest version available.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-version
   */
  readonly version?: string;
}

/**
 * Determine whether the given properties match those of a `LoggingTypeConfigProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingTypeConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterLoggingTypeConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"LoggingTypeConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterLoggingTypeConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterLoggingTypeConfigPropertyValidator(properties).assertSuccess();
  return {
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnClusterLoggingTypeConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.LoggingTypeConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.LoggingTypeConfigProperty>();
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ClusterLoggingProperty`
 *
 * @param properties - the TypeScript properties of a `ClusterLoggingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterClusterLoggingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabledTypes", cdk.listValidator(CfnClusterLoggingTypeConfigPropertyValidator))(properties.enabledTypes));
  return errors.wrap("supplied properties not correct for \"ClusterLoggingProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterClusterLoggingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterClusterLoggingPropertyValidator(properties).assertSuccess();
  return {
    "EnabledTypes": cdk.listMapper(convertCfnClusterLoggingTypeConfigPropertyToCloudFormation)(properties.enabledTypes)
  };
}

// @ts-ignore TS6133
function CfnClusterClusterLoggingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.ClusterLoggingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ClusterLoggingProperty>();
  ret.addPropertyResult("enabledTypes", "EnabledTypes", (properties.EnabledTypes != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterLoggingTypeConfigPropertyFromCloudFormation)(properties.EnabledTypes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LoggingProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterLoggingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clusterLogging", CfnClusterClusterLoggingPropertyValidator)(properties.clusterLogging));
  return errors.wrap("supplied properties not correct for \"LoggingProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterLoggingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterLoggingPropertyValidator(properties).assertSuccess();
  return {
    "ClusterLogging": convertCfnClusterClusterLoggingPropertyToCloudFormation(properties.clusterLogging)
  };
}

// @ts-ignore TS6133
function CfnClusterLoggingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.LoggingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.LoggingProperty>();
  ret.addPropertyResult("clusterLogging", "ClusterLogging", (properties.ClusterLogging != null ? CfnClusterClusterLoggingPropertyFromCloudFormation(properties.ClusterLogging) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ControlPlanePlacementProperty`
 *
 * @param properties - the TypeScript properties of a `ControlPlanePlacementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterControlPlanePlacementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("groupName", cdk.validateString)(properties.groupName));
  return errors.wrap("supplied properties not correct for \"ControlPlanePlacementProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterControlPlanePlacementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterControlPlanePlacementPropertyValidator(properties).assertSuccess();
  return {
    "GroupName": cdk.stringToCloudFormation(properties.groupName)
  };
}

// @ts-ignore TS6133
function CfnClusterControlPlanePlacementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.ControlPlanePlacementProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ControlPlanePlacementProperty>();
  ret.addPropertyResult("groupName", "GroupName", (properties.GroupName != null ? cfn_parse.FromCloudFormation.getString(properties.GroupName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OutpostConfigProperty`
 *
 * @param properties - the TypeScript properties of a `OutpostConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterOutpostConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("controlPlaneInstanceType", cdk.requiredValidator)(properties.controlPlaneInstanceType));
  errors.collect(cdk.propertyValidator("controlPlaneInstanceType", cdk.validateString)(properties.controlPlaneInstanceType));
  errors.collect(cdk.propertyValidator("controlPlanePlacement", CfnClusterControlPlanePlacementPropertyValidator)(properties.controlPlanePlacement));
  errors.collect(cdk.propertyValidator("outpostArns", cdk.requiredValidator)(properties.outpostArns));
  errors.collect(cdk.propertyValidator("outpostArns", cdk.listValidator(cdk.validateString))(properties.outpostArns));
  return errors.wrap("supplied properties not correct for \"OutpostConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterOutpostConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterOutpostConfigPropertyValidator(properties).assertSuccess();
  return {
    "ControlPlaneInstanceType": cdk.stringToCloudFormation(properties.controlPlaneInstanceType),
    "ControlPlanePlacement": convertCfnClusterControlPlanePlacementPropertyToCloudFormation(properties.controlPlanePlacement),
    "OutpostArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.outpostArns)
  };
}

// @ts-ignore TS6133
function CfnClusterOutpostConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.OutpostConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.OutpostConfigProperty>();
  ret.addPropertyResult("controlPlaneInstanceType", "ControlPlaneInstanceType", (properties.ControlPlaneInstanceType != null ? cfn_parse.FromCloudFormation.getString(properties.ControlPlaneInstanceType) : undefined));
  ret.addPropertyResult("controlPlanePlacement", "ControlPlanePlacement", (properties.ControlPlanePlacement != null ? CfnClusterControlPlanePlacementPropertyFromCloudFormation(properties.ControlPlanePlacement) : undefined));
  ret.addPropertyResult("outpostArns", "OutpostArns", (properties.OutpostArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.OutpostArns) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ProviderProperty`
 *
 * @param properties - the TypeScript properties of a `ProviderProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterProviderPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("keyArn", cdk.validateString)(properties.keyArn));
  return errors.wrap("supplied properties not correct for \"ProviderProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterProviderPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterProviderPropertyValidator(properties).assertSuccess();
  return {
    "KeyArn": cdk.stringToCloudFormation(properties.keyArn)
  };
}

// @ts-ignore TS6133
function CfnClusterProviderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.ProviderProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ProviderProperty>();
  ret.addPropertyResult("keyArn", "KeyArn", (properties.KeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KeyArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EncryptionConfigProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterEncryptionConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("provider", CfnClusterProviderPropertyValidator)(properties.provider));
  errors.collect(cdk.propertyValidator("resources", cdk.listValidator(cdk.validateString))(properties.resources));
  return errors.wrap("supplied properties not correct for \"EncryptionConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterEncryptionConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterEncryptionConfigPropertyValidator(properties).assertSuccess();
  return {
    "Provider": convertCfnClusterProviderPropertyToCloudFormation(properties.provider),
    "Resources": cdk.listMapper(cdk.stringToCloudFormation)(properties.resources)
  };
}

// @ts-ignore TS6133
function CfnClusterEncryptionConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.EncryptionConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.EncryptionConfigProperty>();
  ret.addPropertyResult("provider", "Provider", (properties.Provider != null ? CfnClusterProviderPropertyFromCloudFormation(properties.Provider) : undefined));
  ret.addPropertyResult("resources", "Resources", (properties.Resources != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Resources) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `KubernetesNetworkConfigProperty`
 *
 * @param properties - the TypeScript properties of a `KubernetesNetworkConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterKubernetesNetworkConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ipFamily", cdk.validateString)(properties.ipFamily));
  errors.collect(cdk.propertyValidator("serviceIpv4Cidr", cdk.validateString)(properties.serviceIpv4Cidr));
  errors.collect(cdk.propertyValidator("serviceIpv6Cidr", cdk.validateString)(properties.serviceIpv6Cidr));
  return errors.wrap("supplied properties not correct for \"KubernetesNetworkConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterKubernetesNetworkConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterKubernetesNetworkConfigPropertyValidator(properties).assertSuccess();
  return {
    "IpFamily": cdk.stringToCloudFormation(properties.ipFamily),
    "ServiceIpv4Cidr": cdk.stringToCloudFormation(properties.serviceIpv4Cidr),
    "ServiceIpv6Cidr": cdk.stringToCloudFormation(properties.serviceIpv6Cidr)
  };
}

// @ts-ignore TS6133
function CfnClusterKubernetesNetworkConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.KubernetesNetworkConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.KubernetesNetworkConfigProperty>();
  ret.addPropertyResult("ipFamily", "IpFamily", (properties.IpFamily != null ? cfn_parse.FromCloudFormation.getString(properties.IpFamily) : undefined));
  ret.addPropertyResult("serviceIpv4Cidr", "ServiceIpv4Cidr", (properties.ServiceIpv4Cidr != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceIpv4Cidr) : undefined));
  ret.addPropertyResult("serviceIpv6Cidr", "ServiceIpv6Cidr", (properties.ServiceIpv6Cidr != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceIpv6Cidr) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResourcesVpcConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ResourcesVpcConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterResourcesVpcConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("endpointPrivateAccess", cdk.validateBoolean)(properties.endpointPrivateAccess));
  errors.collect(cdk.propertyValidator("endpointPublicAccess", cdk.validateBoolean)(properties.endpointPublicAccess));
  errors.collect(cdk.propertyValidator("publicAccessCidrs", cdk.listValidator(cdk.validateString))(properties.publicAccessCidrs));
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.requiredValidator)(properties.subnetIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  return errors.wrap("supplied properties not correct for \"ResourcesVpcConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterResourcesVpcConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterResourcesVpcConfigPropertyValidator(properties).assertSuccess();
  return {
    "EndpointPrivateAccess": cdk.booleanToCloudFormation(properties.endpointPrivateAccess),
    "EndpointPublicAccess": cdk.booleanToCloudFormation(properties.endpointPublicAccess),
    "PublicAccessCidrs": cdk.listMapper(cdk.stringToCloudFormation)(properties.publicAccessCidrs),
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds)
  };
}

// @ts-ignore TS6133
function CfnClusterResourcesVpcConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCluster.ResourcesVpcConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.ResourcesVpcConfigProperty>();
  ret.addPropertyResult("endpointPrivateAccess", "EndpointPrivateAccess", (properties.EndpointPrivateAccess != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EndpointPrivateAccess) : undefined));
  ret.addPropertyResult("endpointPublicAccess", "EndpointPublicAccess", (properties.EndpointPublicAccess != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EndpointPublicAccess) : undefined));
  ret.addPropertyResult("publicAccessCidrs", "PublicAccessCidrs", (properties.PublicAccessCidrs != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.PublicAccessCidrs) : undefined));
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AccessConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AccessConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterAccessConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authenticationMode", cdk.validateString)(properties.authenticationMode));
  errors.collect(cdk.propertyValidator("bootstrapClusterCreatorAdminPermissions", cdk.validateBoolean)(properties.bootstrapClusterCreatorAdminPermissions));
  return errors.wrap("supplied properties not correct for \"AccessConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnClusterAccessConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterAccessConfigPropertyValidator(properties).assertSuccess();
  return {
    "AuthenticationMode": cdk.stringToCloudFormation(properties.authenticationMode),
    "BootstrapClusterCreatorAdminPermissions": cdk.booleanToCloudFormation(properties.bootstrapClusterCreatorAdminPermissions)
  };
}

// @ts-ignore TS6133
function CfnClusterAccessConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCluster.AccessConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCluster.AccessConfigProperty>();
  ret.addPropertyResult("authenticationMode", "AuthenticationMode", (properties.AuthenticationMode != null ? cfn_parse.FromCloudFormation.getString(properties.AuthenticationMode) : undefined));
  ret.addPropertyResult("bootstrapClusterCreatorAdminPermissions", "BootstrapClusterCreatorAdminPermissions", (properties.BootstrapClusterCreatorAdminPermissions != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BootstrapClusterCreatorAdminPermissions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnClusterProps`
 *
 * @param properties - the TypeScript properties of a `CfnClusterProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnClusterPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessConfig", CfnClusterAccessConfigPropertyValidator)(properties.accessConfig));
  errors.collect(cdk.propertyValidator("encryptionConfig", cdk.listValidator(CfnClusterEncryptionConfigPropertyValidator))(properties.encryptionConfig));
  errors.collect(cdk.propertyValidator("kubernetesNetworkConfig", CfnClusterKubernetesNetworkConfigPropertyValidator)(properties.kubernetesNetworkConfig));
  errors.collect(cdk.propertyValidator("logging", CfnClusterLoggingPropertyValidator)(properties.logging));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("outpostConfig", CfnClusterOutpostConfigPropertyValidator)(properties.outpostConfig));
  errors.collect(cdk.propertyValidator("resourcesVpcConfig", cdk.requiredValidator)(properties.resourcesVpcConfig));
  errors.collect(cdk.propertyValidator("resourcesVpcConfig", CfnClusterResourcesVpcConfigPropertyValidator)(properties.resourcesVpcConfig));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"CfnClusterProps\"");
}

// @ts-ignore TS6133
function convertCfnClusterPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnClusterPropsValidator(properties).assertSuccess();
  return {
    "AccessConfig": convertCfnClusterAccessConfigPropertyToCloudFormation(properties.accessConfig),
    "EncryptionConfig": cdk.listMapper(convertCfnClusterEncryptionConfigPropertyToCloudFormation)(properties.encryptionConfig),
    "KubernetesNetworkConfig": convertCfnClusterKubernetesNetworkConfigPropertyToCloudFormation(properties.kubernetesNetworkConfig),
    "Logging": convertCfnClusterLoggingPropertyToCloudFormation(properties.logging),
    "Name": cdk.stringToCloudFormation(properties.name),
    "OutpostConfig": convertCfnClusterOutpostConfigPropertyToCloudFormation(properties.outpostConfig),
    "ResourcesVpcConfig": convertCfnClusterResourcesVpcConfigPropertyToCloudFormation(properties.resourcesVpcConfig),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnClusterPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnClusterProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnClusterProps>();
  ret.addPropertyResult("accessConfig", "AccessConfig", (properties.AccessConfig != null ? CfnClusterAccessConfigPropertyFromCloudFormation(properties.AccessConfig) : undefined));
  ret.addPropertyResult("encryptionConfig", "EncryptionConfig", (properties.EncryptionConfig != null ? cfn_parse.FromCloudFormation.getArray(CfnClusterEncryptionConfigPropertyFromCloudFormation)(properties.EncryptionConfig) : undefined));
  ret.addPropertyResult("kubernetesNetworkConfig", "KubernetesNetworkConfig", (properties.KubernetesNetworkConfig != null ? CfnClusterKubernetesNetworkConfigPropertyFromCloudFormation(properties.KubernetesNetworkConfig) : undefined));
  ret.addPropertyResult("logging", "Logging", (properties.Logging != null ? CfnClusterLoggingPropertyFromCloudFormation(properties.Logging) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("outpostConfig", "OutpostConfig", (properties.OutpostConfig != null ? CfnClusterOutpostConfigPropertyFromCloudFormation(properties.OutpostConfig) : undefined));
  ret.addPropertyResult("resourcesVpcConfig", "ResourcesVpcConfig", (properties.ResourcesVpcConfig != null ? CfnClusterResourcesVpcConfigPropertyFromCloudFormation(properties.ResourcesVpcConfig) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates an AWS Fargate profile for your Amazon EKS cluster.
 *
 * You must have at least one Fargate profile in a cluster to be able to run pods on Fargate.
 *
 * The Fargate profile allows an administrator to declare which pods run on Fargate and specify which pods run on which Fargate profile. This declaration is done through the profile’s selectors. Each profile can have up to five selectors that contain a namespace and labels. A namespace is required for every selector. The label field consists of multiple optional key-value pairs. Pods that match the selectors are scheduled on Fargate. If a to-be-scheduled pod matches any of the selectors in the Fargate profile, then that pod is run on Fargate.
 *
 * When you create a Fargate profile, you must specify a pod execution role to use with the pods that are scheduled with the profile. This role is added to the cluster's Kubernetes [Role Based Access Control](https://docs.aws.amazon.com/https://kubernetes.io/docs/reference/access-authn-authz/rbac/) (RBAC) for authorization so that the `kubelet` that is running on the Fargate infrastructure can register with your Amazon EKS cluster so that it can appear in your cluster as a node. The pod execution role also provides IAM permissions to the Fargate infrastructure to allow read access to Amazon ECR image repositories. For more information, see [Pod Execution Role](https://docs.aws.amazon.com/eks/latest/userguide/pod-execution-role.html) in the *Amazon EKS User Guide* .
 *
 * Fargate profiles are immutable. However, you can create a new updated profile to replace an existing profile and then delete the original after the updated profile has finished creating.
 *
 * If any Fargate profiles in a cluster are in the `DELETING` status, you must wait for that Fargate profile to finish deleting before you can create any other profiles in that cluster.
 *
 * For more information, see [AWS Fargate profile](https://docs.aws.amazon.com/eks/latest/userguide/fargate-profile.html) in the *Amazon EKS User Guide* .
 *
 * @cloudformationResource AWS::EKS::FargateProfile
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html
 */
export class CfnFargateProfile extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::EKS::FargateProfile";

  /**
   * Build a CfnFargateProfile from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnFargateProfile(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the cluster, such as `arn:aws:eks:us-west-2:666666666666:fargateprofile/myCluster/myFargateProfile/1cb1a11a-1dc1-1d11-cf11-1111f11fa111` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The name of your cluster.
   */
  public clusterName: string;

  /**
   * The name of the Fargate profile.
   */
  public fargateProfileName?: string;

  /**
   * The Amazon Resource Name (ARN) of the `Pod` execution role to use for a `Pod` that matches the selectors in the Fargate profile.
   */
  public podExecutionRoleArn: string;

  /**
   * The selectors to match for a `Pod` to use this Fargate profile.
   */
  public selectors: Array<cdk.IResolvable | CfnFargateProfile.SelectorProperty> | cdk.IResolvable;

  /**
   * The IDs of subnets to launch a `Pod` into.
   */
  public subnets?: Array<string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Metadata that assists with categorization and organization.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnFargateProfileProps) {
    super(scope, id, {
      "type": CfnFargateProfile.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "clusterName", this);
    cdk.requireProperty(props, "podExecutionRoleArn", this);
    cdk.requireProperty(props, "selectors", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.clusterName = props.clusterName;
    this.fargateProfileName = props.fargateProfileName;
    this.podExecutionRoleArn = props.podExecutionRoleArn;
    this.selectors = props.selectors;
    this.subnets = props.subnets;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::EKS::FargateProfile", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "clusterName": this.clusterName,
      "fargateProfileName": this.fargateProfileName,
      "podExecutionRoleArn": this.podExecutionRoleArn,
      "selectors": this.selectors,
      "subnets": this.subnets,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnFargateProfile.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnFargateProfilePropsToCloudFormation(props);
  }
}

export namespace CfnFargateProfile {
  /**
   * An object representing an AWS Fargate profile selector.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-fargateprofile-selector.html
   */
  export interface SelectorProperty {
    /**
     * The Kubernetes labels that the selector should match.
     *
     * A pod must contain all of the labels that are specified in the selector for it to be considered a match.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-fargateprofile-selector.html#cfn-eks-fargateprofile-selector-labels
     */
    readonly labels?: Array<cdk.IResolvable | CfnFargateProfile.LabelProperty> | cdk.IResolvable;

    /**
     * The Kubernetes `namespace` that the selector should match.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-fargateprofile-selector.html#cfn-eks-fargateprofile-selector-namespace
     */
    readonly namespace: string;
  }

  /**
   * A key-value pair.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-fargateprofile-label.html
   */
  export interface LabelProperty {
    /**
     * Enter a key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-fargateprofile-label.html#cfn-eks-fargateprofile-label-key
     */
    readonly key: string;

    /**
     * Enter a value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-fargateprofile-label.html#cfn-eks-fargateprofile-label-value
     */
    readonly value: string;
  }
}

/**
 * Properties for defining a `CfnFargateProfile`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html
 */
export interface CfnFargateProfileProps {
  /**
   * The name of your cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-clustername
   */
  readonly clusterName: string;

  /**
   * The name of the Fargate profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-fargateprofilename
   */
  readonly fargateProfileName?: string;

  /**
   * The Amazon Resource Name (ARN) of the `Pod` execution role to use for a `Pod` that matches the selectors in the Fargate profile.
   *
   * The `Pod` execution role allows Fargate infrastructure to register with your cluster as a node, and it provides read access to Amazon ECR image repositories. For more information, see [`Pod` execution role](https://docs.aws.amazon.com/eks/latest/userguide/pod-execution-role.html) in the *Amazon EKS User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-podexecutionrolearn
   */
  readonly podExecutionRoleArn: string;

  /**
   * The selectors to match for a `Pod` to use this Fargate profile.
   *
   * Each selector must have an associated Kubernetes `namespace` . Optionally, you can also specify `labels` for a `namespace` . You may specify up to five selectors in a Fargate profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-selectors
   */
  readonly selectors: Array<cdk.IResolvable | CfnFargateProfile.SelectorProperty> | cdk.IResolvable;

  /**
   * The IDs of subnets to launch a `Pod` into.
   *
   * A `Pod` running on Fargate isn't assigned a public IP address, so only private subnets (with no direct route to an Internet Gateway) are accepted for this parameter.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-subnets
   */
  readonly subnets?: Array<string>;

  /**
   * Metadata that assists with categorization and organization.
   *
   * Each tag consists of a key and an optional value. You define both. Tags don't propagate to any other cluster or AWS resources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `LabelProperty`
 *
 * @param properties - the TypeScript properties of a `LabelProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFargateProfileLabelPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"LabelProperty\"");
}

// @ts-ignore TS6133
function convertCfnFargateProfileLabelPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFargateProfileLabelPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnFargateProfileLabelPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFargateProfile.LabelProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFargateProfile.LabelProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SelectorProperty`
 *
 * @param properties - the TypeScript properties of a `SelectorProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFargateProfileSelectorPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("labels", cdk.listValidator(CfnFargateProfileLabelPropertyValidator))(properties.labels));
  errors.collect(cdk.propertyValidator("namespace", cdk.requiredValidator)(properties.namespace));
  errors.collect(cdk.propertyValidator("namespace", cdk.validateString)(properties.namespace));
  return errors.wrap("supplied properties not correct for \"SelectorProperty\"");
}

// @ts-ignore TS6133
function convertCfnFargateProfileSelectorPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFargateProfileSelectorPropertyValidator(properties).assertSuccess();
  return {
    "Labels": cdk.listMapper(convertCfnFargateProfileLabelPropertyToCloudFormation)(properties.labels),
    "Namespace": cdk.stringToCloudFormation(properties.namespace)
  };
}

// @ts-ignore TS6133
function CfnFargateProfileSelectorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFargateProfile.SelectorProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFargateProfile.SelectorProperty>();
  ret.addPropertyResult("labels", "Labels", (properties.Labels != null ? cfn_parse.FromCloudFormation.getArray(CfnFargateProfileLabelPropertyFromCloudFormation)(properties.Labels) : undefined));
  ret.addPropertyResult("namespace", "Namespace", (properties.Namespace != null ? cfn_parse.FromCloudFormation.getString(properties.Namespace) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnFargateProfileProps`
 *
 * @param properties - the TypeScript properties of a `CfnFargateProfileProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFargateProfilePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clusterName", cdk.requiredValidator)(properties.clusterName));
  errors.collect(cdk.propertyValidator("clusterName", cdk.validateString)(properties.clusterName));
  errors.collect(cdk.propertyValidator("fargateProfileName", cdk.validateString)(properties.fargateProfileName));
  errors.collect(cdk.propertyValidator("podExecutionRoleArn", cdk.requiredValidator)(properties.podExecutionRoleArn));
  errors.collect(cdk.propertyValidator("podExecutionRoleArn", cdk.validateString)(properties.podExecutionRoleArn));
  errors.collect(cdk.propertyValidator("selectors", cdk.requiredValidator)(properties.selectors));
  errors.collect(cdk.propertyValidator("selectors", cdk.listValidator(CfnFargateProfileSelectorPropertyValidator))(properties.selectors));
  errors.collect(cdk.propertyValidator("subnets", cdk.listValidator(cdk.validateString))(properties.subnets));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnFargateProfileProps\"");
}

// @ts-ignore TS6133
function convertCfnFargateProfilePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFargateProfilePropsValidator(properties).assertSuccess();
  return {
    "ClusterName": cdk.stringToCloudFormation(properties.clusterName),
    "FargateProfileName": cdk.stringToCloudFormation(properties.fargateProfileName),
    "PodExecutionRoleArn": cdk.stringToCloudFormation(properties.podExecutionRoleArn),
    "Selectors": cdk.listMapper(convertCfnFargateProfileSelectorPropertyToCloudFormation)(properties.selectors),
    "Subnets": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnets),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnFargateProfilePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFargateProfileProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFargateProfileProps>();
  ret.addPropertyResult("clusterName", "ClusterName", (properties.ClusterName != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterName) : undefined));
  ret.addPropertyResult("fargateProfileName", "FargateProfileName", (properties.FargateProfileName != null ? cfn_parse.FromCloudFormation.getString(properties.FargateProfileName) : undefined));
  ret.addPropertyResult("podExecutionRoleArn", "PodExecutionRoleArn", (properties.PodExecutionRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.PodExecutionRoleArn) : undefined));
  ret.addPropertyResult("selectors", "Selectors", (properties.Selectors != null ? cfn_parse.FromCloudFormation.getArray(CfnFargateProfileSelectorPropertyFromCloudFormation)(properties.Selectors) : undefined));
  ret.addPropertyResult("subnets", "Subnets", (properties.Subnets != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Subnets) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Associates an identity provider configuration to a cluster.
 *
 * If you want to authenticate identities using an identity provider, you can create an identity provider configuration and associate it to your cluster. After configuring authentication to your cluster you can create Kubernetes `Role` and `ClusterRole` objects, assign permissions to them, and then bind them to the identities using Kubernetes `RoleBinding` and `ClusterRoleBinding` objects. For more information see [Using RBAC Authorization](https://docs.aws.amazon.com/https://kubernetes.io/docs/reference/access-authn-authz/rbac/) in the Kubernetes documentation.
 *
 * @cloudformationResource AWS::EKS::IdentityProviderConfig
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-identityproviderconfig.html
 */
export class CfnIdentityProviderConfig extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::EKS::IdentityProviderConfig";

  /**
   * Build a CfnIdentityProviderConfig from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnIdentityProviderConfig(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) associated with the identity provider config.
   *
   * @cloudformationAttribute IdentityProviderConfigArn
   */
  public readonly attrIdentityProviderConfigArn: string;

  /**
   * The name of your cluster.
   */
  public clusterName: string;

  /**
   * The name of the configuration.
   */
  public identityProviderConfigName?: string;

  /**
   * An object representing an OpenID Connect (OIDC) identity provider configuration.
   */
  public oidc?: cdk.IResolvable | CfnIdentityProviderConfig.OidcIdentityProviderConfigProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Metadata that assists with categorization and organization.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The type of the identity provider configuration.
   */
  public type: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnIdentityProviderConfigProps) {
    super(scope, id, {
      "type": CfnIdentityProviderConfig.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "clusterName", this);
    cdk.requireProperty(props, "type", this);

    this.attrIdentityProviderConfigArn = cdk.Token.asString(this.getAtt("IdentityProviderConfigArn", cdk.ResolutionTypeHint.STRING));
    this.clusterName = props.clusterName;
    this.identityProviderConfigName = props.identityProviderConfigName;
    this.oidc = props.oidc;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::EKS::IdentityProviderConfig", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.type = props.type;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "clusterName": this.clusterName,
      "identityProviderConfigName": this.identityProviderConfigName,
      "oidc": this.oidc,
      "tags": this.tags.renderTags(),
      "type": this.type
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnIdentityProviderConfig.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnIdentityProviderConfigPropsToCloudFormation(props);
  }
}

export namespace CfnIdentityProviderConfig {
  /**
   * An object representing the configuration for an OpenID Connect (OIDC) identity provider.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-identityproviderconfig-oidcidentityproviderconfig.html
   */
  export interface OidcIdentityProviderConfigProperty {
    /**
     * This is also known as *audience* .
     *
     * The ID of the client application that makes authentication requests to the OIDC identity provider.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-identityproviderconfig-oidcidentityproviderconfig.html#cfn-eks-identityproviderconfig-oidcidentityproviderconfig-clientid
     */
    readonly clientId: string;

    /**
     * The JSON web token (JWT) claim that the provider uses to return your groups.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-identityproviderconfig-oidcidentityproviderconfig.html#cfn-eks-identityproviderconfig-oidcidentityproviderconfig-groupsclaim
     */
    readonly groupsClaim?: string;

    /**
     * The prefix that is prepended to group claims to prevent clashes with existing names (such as `system:` groups).
     *
     * For example, the value `oidc:` creates group names like `oidc:engineering` and `oidc:infra` . The prefix can't contain `system:`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-identityproviderconfig-oidcidentityproviderconfig.html#cfn-eks-identityproviderconfig-oidcidentityproviderconfig-groupsprefix
     */
    readonly groupsPrefix?: string;

    /**
     * The URL of the OIDC identity provider that allows the API server to discover public signing keys for verifying tokens.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-identityproviderconfig-oidcidentityproviderconfig.html#cfn-eks-identityproviderconfig-oidcidentityproviderconfig-issuerurl
     */
    readonly issuerUrl: string;

    /**
     * The key-value pairs that describe required claims in the identity token.
     *
     * If set, each claim is verified to be present in the token with a matching value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-identityproviderconfig-oidcidentityproviderconfig.html#cfn-eks-identityproviderconfig-oidcidentityproviderconfig-requiredclaims
     */
    readonly requiredClaims?: Array<cdk.IResolvable | CfnIdentityProviderConfig.RequiredClaimProperty> | cdk.IResolvable;

    /**
     * The JSON Web token (JWT) claim that is used as the username.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-identityproviderconfig-oidcidentityproviderconfig.html#cfn-eks-identityproviderconfig-oidcidentityproviderconfig-usernameclaim
     */
    readonly usernameClaim?: string;

    /**
     * The prefix that is prepended to username claims to prevent clashes with existing names.
     *
     * The prefix can't contain `system:`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-identityproviderconfig-oidcidentityproviderconfig.html#cfn-eks-identityproviderconfig-oidcidentityproviderconfig-usernameprefix
     */
    readonly usernamePrefix?: string;
  }

  /**
   * A key-value pair that describes a required claim in the identity token.
   *
   * If set, each claim is verified to be present in the token with a matching value.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-identityproviderconfig-requiredclaim.html
   */
  export interface RequiredClaimProperty {
    /**
     * The key to match from the token.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-identityproviderconfig-requiredclaim.html#cfn-eks-identityproviderconfig-requiredclaim-key
     */
    readonly key: string;

    /**
     * The value for the key from the token.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-identityproviderconfig-requiredclaim.html#cfn-eks-identityproviderconfig-requiredclaim-value
     */
    readonly value: string;
  }
}

/**
 * Properties for defining a `CfnIdentityProviderConfig`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-identityproviderconfig.html
 */
export interface CfnIdentityProviderConfigProps {
  /**
   * The name of your cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-identityproviderconfig.html#cfn-eks-identityproviderconfig-clustername
   */
  readonly clusterName: string;

  /**
   * The name of the configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-identityproviderconfig.html#cfn-eks-identityproviderconfig-identityproviderconfigname
   */
  readonly identityProviderConfigName?: string;

  /**
   * An object representing an OpenID Connect (OIDC) identity provider configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-identityproviderconfig.html#cfn-eks-identityproviderconfig-oidc
   */
  readonly oidc?: cdk.IResolvable | CfnIdentityProviderConfig.OidcIdentityProviderConfigProperty;

  /**
   * Metadata that assists with categorization and organization.
   *
   * Each tag consists of a key and an optional value. You define both. Tags don't propagate to any other cluster or AWS resources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-identityproviderconfig.html#cfn-eks-identityproviderconfig-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The type of the identity provider configuration.
   *
   * The only type available is `oidc` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-identityproviderconfig.html#cfn-eks-identityproviderconfig-type
   */
  readonly type: string;
}

/**
 * Determine whether the given properties match those of a `RequiredClaimProperty`
 *
 * @param properties - the TypeScript properties of a `RequiredClaimProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIdentityProviderConfigRequiredClaimPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"RequiredClaimProperty\"");
}

// @ts-ignore TS6133
function convertCfnIdentityProviderConfigRequiredClaimPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIdentityProviderConfigRequiredClaimPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnIdentityProviderConfigRequiredClaimPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnIdentityProviderConfig.RequiredClaimProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIdentityProviderConfig.RequiredClaimProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OidcIdentityProviderConfigProperty`
 *
 * @param properties - the TypeScript properties of a `OidcIdentityProviderConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIdentityProviderConfigOidcIdentityProviderConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clientId", cdk.requiredValidator)(properties.clientId));
  errors.collect(cdk.propertyValidator("clientId", cdk.validateString)(properties.clientId));
  errors.collect(cdk.propertyValidator("groupsClaim", cdk.validateString)(properties.groupsClaim));
  errors.collect(cdk.propertyValidator("groupsPrefix", cdk.validateString)(properties.groupsPrefix));
  errors.collect(cdk.propertyValidator("issuerUrl", cdk.requiredValidator)(properties.issuerUrl));
  errors.collect(cdk.propertyValidator("issuerUrl", cdk.validateString)(properties.issuerUrl));
  errors.collect(cdk.propertyValidator("requiredClaims", cdk.listValidator(CfnIdentityProviderConfigRequiredClaimPropertyValidator))(properties.requiredClaims));
  errors.collect(cdk.propertyValidator("usernameClaim", cdk.validateString)(properties.usernameClaim));
  errors.collect(cdk.propertyValidator("usernamePrefix", cdk.validateString)(properties.usernamePrefix));
  return errors.wrap("supplied properties not correct for \"OidcIdentityProviderConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnIdentityProviderConfigOidcIdentityProviderConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIdentityProviderConfigOidcIdentityProviderConfigPropertyValidator(properties).assertSuccess();
  return {
    "ClientId": cdk.stringToCloudFormation(properties.clientId),
    "GroupsClaim": cdk.stringToCloudFormation(properties.groupsClaim),
    "GroupsPrefix": cdk.stringToCloudFormation(properties.groupsPrefix),
    "IssuerUrl": cdk.stringToCloudFormation(properties.issuerUrl),
    "RequiredClaims": cdk.listMapper(convertCfnIdentityProviderConfigRequiredClaimPropertyToCloudFormation)(properties.requiredClaims),
    "UsernameClaim": cdk.stringToCloudFormation(properties.usernameClaim),
    "UsernamePrefix": cdk.stringToCloudFormation(properties.usernamePrefix)
  };
}

// @ts-ignore TS6133
function CfnIdentityProviderConfigOidcIdentityProviderConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnIdentityProviderConfig.OidcIdentityProviderConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIdentityProviderConfig.OidcIdentityProviderConfigProperty>();
  ret.addPropertyResult("clientId", "ClientId", (properties.ClientId != null ? cfn_parse.FromCloudFormation.getString(properties.ClientId) : undefined));
  ret.addPropertyResult("groupsClaim", "GroupsClaim", (properties.GroupsClaim != null ? cfn_parse.FromCloudFormation.getString(properties.GroupsClaim) : undefined));
  ret.addPropertyResult("groupsPrefix", "GroupsPrefix", (properties.GroupsPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.GroupsPrefix) : undefined));
  ret.addPropertyResult("issuerUrl", "IssuerUrl", (properties.IssuerUrl != null ? cfn_parse.FromCloudFormation.getString(properties.IssuerUrl) : undefined));
  ret.addPropertyResult("requiredClaims", "RequiredClaims", (properties.RequiredClaims != null ? cfn_parse.FromCloudFormation.getArray(CfnIdentityProviderConfigRequiredClaimPropertyFromCloudFormation)(properties.RequiredClaims) : undefined));
  ret.addPropertyResult("usernameClaim", "UsernameClaim", (properties.UsernameClaim != null ? cfn_parse.FromCloudFormation.getString(properties.UsernameClaim) : undefined));
  ret.addPropertyResult("usernamePrefix", "UsernamePrefix", (properties.UsernamePrefix != null ? cfn_parse.FromCloudFormation.getString(properties.UsernamePrefix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnIdentityProviderConfigProps`
 *
 * @param properties - the TypeScript properties of a `CfnIdentityProviderConfigProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIdentityProviderConfigPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clusterName", cdk.requiredValidator)(properties.clusterName));
  errors.collect(cdk.propertyValidator("clusterName", cdk.validateString)(properties.clusterName));
  errors.collect(cdk.propertyValidator("identityProviderConfigName", cdk.validateString)(properties.identityProviderConfigName));
  errors.collect(cdk.propertyValidator("oidc", CfnIdentityProviderConfigOidcIdentityProviderConfigPropertyValidator)(properties.oidc));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CfnIdentityProviderConfigProps\"");
}

// @ts-ignore TS6133
function convertCfnIdentityProviderConfigPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIdentityProviderConfigPropsValidator(properties).assertSuccess();
  return {
    "ClusterName": cdk.stringToCloudFormation(properties.clusterName),
    "IdentityProviderConfigName": cdk.stringToCloudFormation(properties.identityProviderConfigName),
    "Oidc": convertCfnIdentityProviderConfigOidcIdentityProviderConfigPropertyToCloudFormation(properties.oidc),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnIdentityProviderConfigPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIdentityProviderConfigProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIdentityProviderConfigProps>();
  ret.addPropertyResult("clusterName", "ClusterName", (properties.ClusterName != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterName) : undefined));
  ret.addPropertyResult("identityProviderConfigName", "IdentityProviderConfigName", (properties.IdentityProviderConfigName != null ? cfn_parse.FromCloudFormation.getString(properties.IdentityProviderConfigName) : undefined));
  ret.addPropertyResult("oidc", "Oidc", (properties.Oidc != null ? CfnIdentityProviderConfigOidcIdentityProviderConfigPropertyFromCloudFormation(properties.Oidc) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a managed node group for an Amazon EKS cluster.
 *
 * You can only create a node group for your cluster that is equal to the current Kubernetes version for the cluster. All node groups are created with the latest AMI release version for the respective minor Kubernetes version of the cluster, unless you deploy a custom AMI using a launch template. For more information about using launch templates, see [Launch template support](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html) .
 *
 * An Amazon EKS managed node group is an Amazon EC2 Auto Scaling group and associated Amazon EC2 instances that are managed by AWS for an Amazon EKS cluster. For more information, see [Managed node groups](https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html) in the *Amazon EKS User Guide* .
 *
 * > Windows AMI types are only supported for commercial AWS Regions that support Windows on Amazon EKS.
 *
 * @cloudformationResource AWS::EKS::Nodegroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html
 */
export class CfnNodegroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::EKS::Nodegroup";

  /**
   * Build a CfnNodegroup from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnNodegroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) associated with the managed node group.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The name of your cluster.
   *
   * @cloudformationAttribute ClusterName
   */
  public readonly attrClusterName: string;

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The name associated with an Amazon EKS managed node group.
   *
   * @cloudformationAttribute NodegroupName
   */
  public readonly attrNodegroupName: string;

  /**
   * The AMI type for your node group.
   */
  public amiType?: string;

  /**
   * The capacity type of your managed node group.
   */
  public capacityType?: string;

  /**
   * The name of your cluster.
   */
  public clusterName: string;

  /**
   * The root device disk size (in GiB) for your node group instances.
   */
  public diskSize?: number;

  /**
   * Force the update if any `Pod` on the existing node group can't be drained due to a `Pod` disruption budget issue.
   */
  public forceUpdateEnabled?: boolean | cdk.IResolvable;

  /**
   * Specify the instance types for a node group.
   */
  public instanceTypes?: Array<string>;

  /**
   * The Kubernetes `labels` applied to the nodes in the node group.
   */
  public labels?: cdk.IResolvable | Record<string, string>;

  /**
   * An object representing a node group's launch template specification.
   */
  public launchTemplate?: cdk.IResolvable | CfnNodegroup.LaunchTemplateSpecificationProperty;

  /**
   * The unique name to give your node group.
   */
  public nodegroupName?: string;

  /**
   * The Amazon Resource Name (ARN) of the IAM role to associate with your node group.
   */
  public nodeRole: string;

  /**
   * The AMI version of the Amazon EKS optimized AMI to use with your node group (for example, `1.14.7- *YYYYMMDD*` ). By default, the latest available AMI version for the node group's current Kubernetes version is used. For more information, see [Amazon EKS optimized Linux AMI Versions](https://docs.aws.amazon.com/eks/latest/userguide/eks-linux-ami-versions.html) in the *Amazon EKS User Guide* .
   */
  public releaseVersion?: string;

  /**
   * The remote access configuration to use with your node group.
   */
  public remoteAccess?: cdk.IResolvable | CfnNodegroup.RemoteAccessProperty;

  /**
   * The scaling configuration details for the Auto Scaling group that is created for your node group.
   */
  public scalingConfig?: cdk.IResolvable | CfnNodegroup.ScalingConfigProperty;

  /**
   * The subnets to use for the Auto Scaling group that is created for your node group.
   */
  public subnets: Array<string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Metadata that assists with categorization and organization.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * The Kubernetes taints to be applied to the nodes in the node group when they are created.
   */
  public taints?: Array<cdk.IResolvable | CfnNodegroup.TaintProperty> | cdk.IResolvable;

  /**
   * The node group update configuration.
   */
  public updateConfig?: cdk.IResolvable | CfnNodegroup.UpdateConfigProperty;

  /**
   * The Kubernetes version to use for your managed nodes.
   */
  public version?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnNodegroupProps) {
    super(scope, id, {
      "type": CfnNodegroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "clusterName", this);
    cdk.requireProperty(props, "nodeRole", this);
    cdk.requireProperty(props, "subnets", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrClusterName = cdk.Token.asString(this.getAtt("ClusterName", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrNodegroupName = cdk.Token.asString(this.getAtt("NodegroupName", cdk.ResolutionTypeHint.STRING));
    this.amiType = props.amiType;
    this.capacityType = props.capacityType;
    this.clusterName = props.clusterName;
    this.diskSize = props.diskSize;
    this.forceUpdateEnabled = props.forceUpdateEnabled;
    this.instanceTypes = props.instanceTypes;
    this.labels = props.labels;
    this.launchTemplate = props.launchTemplate;
    this.nodegroupName = props.nodegroupName;
    this.nodeRole = props.nodeRole;
    this.releaseVersion = props.releaseVersion;
    this.remoteAccess = props.remoteAccess;
    this.scalingConfig = props.scalingConfig;
    this.subnets = props.subnets;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::EKS::Nodegroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.taints = props.taints;
    this.updateConfig = props.updateConfig;
    this.version = props.version;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "amiType": this.amiType,
      "capacityType": this.capacityType,
      "clusterName": this.clusterName,
      "diskSize": this.diskSize,
      "forceUpdateEnabled": this.forceUpdateEnabled,
      "instanceTypes": this.instanceTypes,
      "labels": this.labels,
      "launchTemplate": this.launchTemplate,
      "nodegroupName": this.nodegroupName,
      "nodeRole": this.nodeRole,
      "releaseVersion": this.releaseVersion,
      "remoteAccess": this.remoteAccess,
      "scalingConfig": this.scalingConfig,
      "subnets": this.subnets,
      "tags": this.tags.renderTags(),
      "taints": this.taints,
      "updateConfig": this.updateConfig,
      "version": this.version
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnNodegroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnNodegroupPropsToCloudFormation(props);
  }
}

export namespace CfnNodegroup {
  /**
   * The update configuration for the node group.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-updateconfig.html
   */
  export interface UpdateConfigProperty {
    /**
     * The maximum number of nodes unavailable at once during a version update.
     *
     * Nodes are updated in parallel. This value or `maxUnavailablePercentage` is required to have a value.The maximum number is 100.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-updateconfig.html#cfn-eks-nodegroup-updateconfig-maxunavailable
     */
    readonly maxUnavailable?: number;

    /**
     * The maximum percentage of nodes unavailable during a version update.
     *
     * This percentage of nodes are updated in parallel, up to 100 nodes at once. This value or `maxUnavailable` is required to have a value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-updateconfig.html#cfn-eks-nodegroup-updateconfig-maxunavailablepercentage
     */
    readonly maxUnavailablePercentage?: number;
  }

  /**
   * An object representing the scaling configuration details for the Auto Scaling group that is associated with your node group.
   *
   * When creating a node group, you must specify all or none of the properties. When updating a node group, you can specify any or none of the properties.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-scalingconfig.html
   */
  export interface ScalingConfigProperty {
    /**
     * The current number of nodes that the managed node group should maintain.
     *
     * > If you use the Kubernetes [Cluster Autoscaler](https://docs.aws.amazon.com/https://github.com/kubernetes/autoscaler#kubernetes-autoscaler) , you shouldn't change the `desiredSize` value directly, as this can cause the Cluster Autoscaler to suddenly scale up or scale down.
     *
     * Whenever this parameter changes, the number of worker nodes in the node group is updated to the specified size. If this parameter is given a value that is smaller than the current number of running worker nodes, the necessary number of worker nodes are terminated to match the given value. When using CloudFormation, no action occurs if you remove this parameter from your CFN template.
     *
     * This parameter can be different from `minSize` in some cases, such as when starting with extra hosts for testing. This parameter can also be different when you want to start with an estimated number of needed hosts, but let the Cluster Autoscaler reduce the number if there are too many. When the Cluster Autoscaler is used, the `desiredSize` parameter is altered by the Cluster Autoscaler (but can be out-of-date for short periods of time). the Cluster Autoscaler doesn't scale a managed node group lower than `minSize` or higher than `maxSize` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-scalingconfig.html#cfn-eks-nodegroup-scalingconfig-desiredsize
     */
    readonly desiredSize?: number;

    /**
     * The maximum number of nodes that the managed node group can scale out to.
     *
     * For information about the maximum number that you can specify, see [Amazon EKS service quotas](https://docs.aws.amazon.com/eks/latest/userguide/service-quotas.html) in the *Amazon EKS User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-scalingconfig.html#cfn-eks-nodegroup-scalingconfig-maxsize
     */
    readonly maxSize?: number;

    /**
     * The minimum number of nodes that the managed node group can scale in to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-scalingconfig.html#cfn-eks-nodegroup-scalingconfig-minsize
     */
    readonly minSize?: number;
  }

  /**
   * A property that allows a node to repel a `Pod` .
   *
   * For more information, see [Node taints on managed node groups](https://docs.aws.amazon.com/eks/latest/userguide/node-taints-managed-node-groups.html) in the *Amazon EKS User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-taint.html
   */
  export interface TaintProperty {
    /**
     * The effect of the taint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-taint.html#cfn-eks-nodegroup-taint-effect
     */
    readonly effect?: string;

    /**
     * The key of the taint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-taint.html#cfn-eks-nodegroup-taint-key
     */
    readonly key?: string;

    /**
     * The value of the taint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-taint.html#cfn-eks-nodegroup-taint-value
     */
    readonly value?: string;
  }

  /**
   * An object representing a node group launch template specification.
   *
   * The launch template can't include [`SubnetId`](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateNetworkInterface.html) , [`IamInstanceProfile`](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_IamInstanceProfile.html) , [`RequestSpotInstances`](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_RequestSpotInstances.html) , [`HibernationOptions`](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_HibernationOptionsRequest.html) , or [`TerminateInstances`](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_TerminateInstances.html) , or the node group deployment or update will fail. For more information about launch templates, see [`CreateLaunchTemplate`](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateLaunchTemplate.html) in the Amazon EC2 API Reference. For more information about using launch templates with Amazon EKS, see [Launch template support](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html) in the *Amazon EKS User Guide* .
   *
   * You must specify either the launch template ID or the launch template name in the request, but not both.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-launchtemplatespecification.html
   */
  export interface LaunchTemplateSpecificationProperty {
    /**
     * The ID of the launch template.
     *
     * You must specify either the launch template ID or the launch template name in the request, but not both.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-launchtemplatespecification.html#cfn-eks-nodegroup-launchtemplatespecification-id
     */
    readonly id?: string;

    /**
     * The name of the launch template.
     *
     * You must specify either the launch template name or the launch template ID in the request, but not both.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-launchtemplatespecification.html#cfn-eks-nodegroup-launchtemplatespecification-name
     */
    readonly name?: string;

    /**
     * The version number of the launch template to use.
     *
     * If no version is specified, then the template's default version is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-launchtemplatespecification.html#cfn-eks-nodegroup-launchtemplatespecification-version
     */
    readonly version?: string;
  }

  /**
   * An object representing the remote access configuration for the managed node group.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-remoteaccess.html
   */
  export interface RemoteAccessProperty {
    /**
     * The Amazon EC2 SSH key name that provides access for SSH communication with the nodes in the managed node group.
     *
     * For more information, see [Amazon EC2 key pairs and Linux instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html) in the *Amazon Elastic Compute Cloud User Guide for Linux Instances* . For Windows, an Amazon EC2 SSH key is used to obtain the RDP password. For more information, see [Amazon EC2 key pairs and Windows instances](https://docs.aws.amazon.com/AWSEC2/latest/WindowsGuide/ec2-key-pairs.html) in the *Amazon Elastic Compute Cloud User Guide for Windows Instances* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-remoteaccess.html#cfn-eks-nodegroup-remoteaccess-ec2sshkey
     */
    readonly ec2SshKey: string;

    /**
     * The security group IDs that are allowed SSH access (port 22) to the nodes.
     *
     * For Windows, the port is 3389. If you specify an Amazon EC2 SSH key but don't specify a source security group when you create a managed node group, then the port on the nodes is opened to the internet ( `0.0.0.0/0` ). For more information, see [Security Groups for Your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html) in the *Amazon Virtual Private Cloud User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-remoteaccess.html#cfn-eks-nodegroup-remoteaccess-sourcesecuritygroups
     */
    readonly sourceSecurityGroups?: Array<string>;
  }
}

/**
 * Properties for defining a `CfnNodegroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html
 */
export interface CfnNodegroupProps {
  /**
   * The AMI type for your node group.
   *
   * If you specify `launchTemplate` , and your launch template uses a custom AMI, then don't specify `amiType` , or the node group deployment will fail. If your launch template uses a Windows custom AMI, then add `eks:kube-proxy-windows` to your Windows nodes `rolearn` in the `aws-auth` `ConfigMap` . For more information about using launch templates with Amazon EKS, see [Launch template support](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html) in the *Amazon EKS User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-amitype
   */
  readonly amiType?: string;

  /**
   * The capacity type of your managed node group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-capacitytype
   */
  readonly capacityType?: string;

  /**
   * The name of your cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-clustername
   */
  readonly clusterName: string;

  /**
   * The root device disk size (in GiB) for your node group instances.
   *
   * The default disk size is 20 GiB for Linux and Bottlerocket. The default disk size is 50 GiB for Windows. If you specify `launchTemplate` , then don't specify `diskSize` , or the node group deployment will fail. For more information about using launch templates with Amazon EKS, see [Launch template support](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html) in the *Amazon EKS User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-disksize
   */
  readonly diskSize?: number;

  /**
   * Force the update if any `Pod` on the existing node group can't be drained due to a `Pod` disruption budget issue.
   *
   * If an update fails because all Pods can't be drained, you can force the update after it fails to terminate the old node whether or not any `Pod` is running on the node.
   *
   * @default - false
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-forceupdateenabled
   */
  readonly forceUpdateEnabled?: boolean | cdk.IResolvable;

  /**
   * Specify the instance types for a node group.
   *
   * If you specify a GPU instance type, make sure to also specify an applicable GPU AMI type with the `amiType` parameter. If you specify `launchTemplate` , then you can specify zero or one instance type in your launch template *or* you can specify 0-20 instance types for `instanceTypes` . If however, you specify an instance type in your launch template *and* specify any `instanceTypes` , the node group deployment will fail. If you don't specify an instance type in a launch template or for `instanceTypes` , then `t3.medium` is used, by default. If you specify `Spot` for `capacityType` , then we recommend specifying multiple values for `instanceTypes` . For more information, see [Managed node group capacity types](https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html#managed-node-group-capacity-types) and [Launch template support](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html) in the *Amazon EKS User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-instancetypes
   */
  readonly instanceTypes?: Array<string>;

  /**
   * The Kubernetes `labels` applied to the nodes in the node group.
   *
   * > Only `labels` that are applied with the Amazon EKS API are shown here. There may be other Kubernetes `labels` applied to the nodes in this group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-labels
   */
  readonly labels?: cdk.IResolvable | Record<string, string>;

  /**
   * An object representing a node group's launch template specification.
   *
   * If specified, then do not specify `instanceTypes` , `diskSize` , or `remoteAccess` and make sure that the launch template meets the requirements in `launchTemplateSpecification` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-launchtemplate
   */
  readonly launchTemplate?: cdk.IResolvable | CfnNodegroup.LaunchTemplateSpecificationProperty;

  /**
   * The unique name to give your node group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-nodegroupname
   */
  readonly nodegroupName?: string;

  /**
   * The Amazon Resource Name (ARN) of the IAM role to associate with your node group.
   *
   * The Amazon EKS worker node `kubelet` daemon makes calls to AWS APIs on your behalf. Nodes receive permissions for these API calls through an IAM instance profile and associated policies. Before you can launch nodes and register them into a cluster, you must create an IAM role for those nodes to use when they are launched. For more information, see [Amazon EKS node IAM role](https://docs.aws.amazon.com/eks/latest/userguide/create-node-role.html) in the **Amazon EKS User Guide** . If you specify `launchTemplate` , then don't specify `[IamInstanceProfile](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_IamInstanceProfile.html)` in your launch template, or the node group deployment will fail. For more information about using launch templates with Amazon EKS, see [Launch template support](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html) in the *Amazon EKS User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-noderole
   */
  readonly nodeRole: string;

  /**
   * The AMI version of the Amazon EKS optimized AMI to use with your node group (for example, `1.14.7- *YYYYMMDD*` ). By default, the latest available AMI version for the node group's current Kubernetes version is used. For more information, see [Amazon EKS optimized Linux AMI Versions](https://docs.aws.amazon.com/eks/latest/userguide/eks-linux-ami-versions.html) in the *Amazon EKS User Guide* .
   *
   * > Changing this value triggers an update of the node group if one is available. You can't update other properties at the same time as updating `Release Version` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-releaseversion
   */
  readonly releaseVersion?: string;

  /**
   * The remote access configuration to use with your node group.
   *
   * For Linux, the protocol is SSH. For Windows, the protocol is RDP. If you specify `launchTemplate` , then don't specify `remoteAccess` , or the node group deployment will fail. For more information about using launch templates with Amazon EKS, see [Launch template support](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html) in the *Amazon EKS User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-remoteaccess
   */
  readonly remoteAccess?: cdk.IResolvable | CfnNodegroup.RemoteAccessProperty;

  /**
   * The scaling configuration details for the Auto Scaling group that is created for your node group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-scalingconfig
   */
  readonly scalingConfig?: cdk.IResolvable | CfnNodegroup.ScalingConfigProperty;

  /**
   * The subnets to use for the Auto Scaling group that is created for your node group.
   *
   * If you specify `launchTemplate` , then don't specify `[SubnetId](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateNetworkInterface.html)` in your launch template, or the node group deployment will fail. For more information about using launch templates with Amazon EKS, see [Launch template support](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html) in the *Amazon EKS User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-subnets
   */
  readonly subnets: Array<string>;

  /**
   * Metadata that assists with categorization and organization.
   *
   * Each tag consists of a key and an optional value. You define both. Tags don't propagate to any other cluster or AWS resources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * The Kubernetes taints to be applied to the nodes in the node group when they are created.
   *
   * Effect is one of `No_Schedule` , `Prefer_No_Schedule` , or `No_Execute` . Kubernetes taints can be used together with tolerations to control how workloads are scheduled to your nodes. For more information, see [Node taints on managed node groups](https://docs.aws.amazon.com/eks/latest/userguide/node-taints-managed-node-groups.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-taints
   */
  readonly taints?: Array<cdk.IResolvable | CfnNodegroup.TaintProperty> | cdk.IResolvable;

  /**
   * The node group update configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-updateconfig
   */
  readonly updateConfig?: cdk.IResolvable | CfnNodegroup.UpdateConfigProperty;

  /**
   * The Kubernetes version to use for your managed nodes.
   *
   * By default, the Kubernetes version of the cluster is used, and this is the only accepted specified value. If you specify `launchTemplate` , and your launch template uses a custom AMI, then don't specify `version` , or the node group deployment will fail. For more information about using launch templates with Amazon EKS, see [Launch template support](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html) in the *Amazon EKS User Guide* .
   *
   * > You can't update other properties at the same time as updating `Version` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-version
   */
  readonly version?: string;
}

/**
 * Determine whether the given properties match those of a `UpdateConfigProperty`
 *
 * @param properties - the TypeScript properties of a `UpdateConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnNodegroupUpdateConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxUnavailable", cdk.validateNumber)(properties.maxUnavailable));
  errors.collect(cdk.propertyValidator("maxUnavailablePercentage", cdk.validateNumber)(properties.maxUnavailablePercentage));
  return errors.wrap("supplied properties not correct for \"UpdateConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnNodegroupUpdateConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnNodegroupUpdateConfigPropertyValidator(properties).assertSuccess();
  return {
    "MaxUnavailable": cdk.numberToCloudFormation(properties.maxUnavailable),
    "MaxUnavailablePercentage": cdk.numberToCloudFormation(properties.maxUnavailablePercentage)
  };
}

// @ts-ignore TS6133
function CfnNodegroupUpdateConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnNodegroup.UpdateConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNodegroup.UpdateConfigProperty>();
  ret.addPropertyResult("maxUnavailable", "MaxUnavailable", (properties.MaxUnavailable != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxUnavailable) : undefined));
  ret.addPropertyResult("maxUnavailablePercentage", "MaxUnavailablePercentage", (properties.MaxUnavailablePercentage != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxUnavailablePercentage) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScalingConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ScalingConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnNodegroupScalingConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("desiredSize", cdk.validateNumber)(properties.desiredSize));
  errors.collect(cdk.propertyValidator("maxSize", cdk.validateNumber)(properties.maxSize));
  errors.collect(cdk.propertyValidator("minSize", cdk.validateNumber)(properties.minSize));
  return errors.wrap("supplied properties not correct for \"ScalingConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnNodegroupScalingConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnNodegroupScalingConfigPropertyValidator(properties).assertSuccess();
  return {
    "DesiredSize": cdk.numberToCloudFormation(properties.desiredSize),
    "MaxSize": cdk.numberToCloudFormation(properties.maxSize),
    "MinSize": cdk.numberToCloudFormation(properties.minSize)
  };
}

// @ts-ignore TS6133
function CfnNodegroupScalingConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnNodegroup.ScalingConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNodegroup.ScalingConfigProperty>();
  ret.addPropertyResult("desiredSize", "DesiredSize", (properties.DesiredSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.DesiredSize) : undefined));
  ret.addPropertyResult("maxSize", "MaxSize", (properties.MaxSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxSize) : undefined));
  ret.addPropertyResult("minSize", "MinSize", (properties.MinSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinSize) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TaintProperty`
 *
 * @param properties - the TypeScript properties of a `TaintProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnNodegroupTaintPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("effect", cdk.validateString)(properties.effect));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"TaintProperty\"");
}

// @ts-ignore TS6133
function convertCfnNodegroupTaintPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnNodegroupTaintPropertyValidator(properties).assertSuccess();
  return {
    "Effect": cdk.stringToCloudFormation(properties.effect),
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnNodegroupTaintPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnNodegroup.TaintProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNodegroup.TaintProperty>();
  ret.addPropertyResult("effect", "Effect", (properties.Effect != null ? cfn_parse.FromCloudFormation.getString(properties.Effect) : undefined));
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LaunchTemplateSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `LaunchTemplateSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnNodegroupLaunchTemplateSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"LaunchTemplateSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnNodegroupLaunchTemplateSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnNodegroupLaunchTemplateSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "Id": cdk.stringToCloudFormation(properties.id),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnNodegroupLaunchTemplateSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnNodegroup.LaunchTemplateSpecificationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNodegroup.LaunchTemplateSpecificationProperty>();
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RemoteAccessProperty`
 *
 * @param properties - the TypeScript properties of a `RemoteAccessProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnNodegroupRemoteAccessPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ec2SshKey", cdk.requiredValidator)(properties.ec2SshKey));
  errors.collect(cdk.propertyValidator("ec2SshKey", cdk.validateString)(properties.ec2SshKey));
  errors.collect(cdk.propertyValidator("sourceSecurityGroups", cdk.listValidator(cdk.validateString))(properties.sourceSecurityGroups));
  return errors.wrap("supplied properties not correct for \"RemoteAccessProperty\"");
}

// @ts-ignore TS6133
function convertCfnNodegroupRemoteAccessPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnNodegroupRemoteAccessPropertyValidator(properties).assertSuccess();
  return {
    "Ec2SshKey": cdk.stringToCloudFormation(properties.ec2SshKey),
    "SourceSecurityGroups": cdk.listMapper(cdk.stringToCloudFormation)(properties.sourceSecurityGroups)
  };
}

// @ts-ignore TS6133
function CfnNodegroupRemoteAccessPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnNodegroup.RemoteAccessProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNodegroup.RemoteAccessProperty>();
  ret.addPropertyResult("ec2SshKey", "Ec2SshKey", (properties.Ec2SshKey != null ? cfn_parse.FromCloudFormation.getString(properties.Ec2SshKey) : undefined));
  ret.addPropertyResult("sourceSecurityGroups", "SourceSecurityGroups", (properties.SourceSecurityGroups != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SourceSecurityGroups) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnNodegroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnNodegroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnNodegroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("amiType", cdk.validateString)(properties.amiType));
  errors.collect(cdk.propertyValidator("capacityType", cdk.validateString)(properties.capacityType));
  errors.collect(cdk.propertyValidator("clusterName", cdk.requiredValidator)(properties.clusterName));
  errors.collect(cdk.propertyValidator("clusterName", cdk.validateString)(properties.clusterName));
  errors.collect(cdk.propertyValidator("diskSize", cdk.validateNumber)(properties.diskSize));
  errors.collect(cdk.propertyValidator("forceUpdateEnabled", cdk.validateBoolean)(properties.forceUpdateEnabled));
  errors.collect(cdk.propertyValidator("instanceTypes", cdk.listValidator(cdk.validateString))(properties.instanceTypes));
  errors.collect(cdk.propertyValidator("labels", cdk.hashValidator(cdk.validateString))(properties.labels));
  errors.collect(cdk.propertyValidator("launchTemplate", CfnNodegroupLaunchTemplateSpecificationPropertyValidator)(properties.launchTemplate));
  errors.collect(cdk.propertyValidator("nodeRole", cdk.requiredValidator)(properties.nodeRole));
  errors.collect(cdk.propertyValidator("nodeRole", cdk.validateString)(properties.nodeRole));
  errors.collect(cdk.propertyValidator("nodegroupName", cdk.validateString)(properties.nodegroupName));
  errors.collect(cdk.propertyValidator("releaseVersion", cdk.validateString)(properties.releaseVersion));
  errors.collect(cdk.propertyValidator("remoteAccess", CfnNodegroupRemoteAccessPropertyValidator)(properties.remoteAccess));
  errors.collect(cdk.propertyValidator("scalingConfig", CfnNodegroupScalingConfigPropertyValidator)(properties.scalingConfig));
  errors.collect(cdk.propertyValidator("subnets", cdk.requiredValidator)(properties.subnets));
  errors.collect(cdk.propertyValidator("subnets", cdk.listValidator(cdk.validateString))(properties.subnets));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("taints", cdk.listValidator(CfnNodegroupTaintPropertyValidator))(properties.taints));
  errors.collect(cdk.propertyValidator("updateConfig", CfnNodegroupUpdateConfigPropertyValidator)(properties.updateConfig));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"CfnNodegroupProps\"");
}

// @ts-ignore TS6133
function convertCfnNodegroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnNodegroupPropsValidator(properties).assertSuccess();
  return {
    "AmiType": cdk.stringToCloudFormation(properties.amiType),
    "CapacityType": cdk.stringToCloudFormation(properties.capacityType),
    "ClusterName": cdk.stringToCloudFormation(properties.clusterName),
    "DiskSize": cdk.numberToCloudFormation(properties.diskSize),
    "ForceUpdateEnabled": cdk.booleanToCloudFormation(properties.forceUpdateEnabled),
    "InstanceTypes": cdk.listMapper(cdk.stringToCloudFormation)(properties.instanceTypes),
    "Labels": cdk.hashMapper(cdk.stringToCloudFormation)(properties.labels),
    "LaunchTemplate": convertCfnNodegroupLaunchTemplateSpecificationPropertyToCloudFormation(properties.launchTemplate),
    "NodeRole": cdk.stringToCloudFormation(properties.nodeRole),
    "NodegroupName": cdk.stringToCloudFormation(properties.nodegroupName),
    "ReleaseVersion": cdk.stringToCloudFormation(properties.releaseVersion),
    "RemoteAccess": convertCfnNodegroupRemoteAccessPropertyToCloudFormation(properties.remoteAccess),
    "ScalingConfig": convertCfnNodegroupScalingConfigPropertyToCloudFormation(properties.scalingConfig),
    "Subnets": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnets),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "Taints": cdk.listMapper(convertCfnNodegroupTaintPropertyToCloudFormation)(properties.taints),
    "UpdateConfig": convertCfnNodegroupUpdateConfigPropertyToCloudFormation(properties.updateConfig),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnNodegroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnNodegroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNodegroupProps>();
  ret.addPropertyResult("amiType", "AmiType", (properties.AmiType != null ? cfn_parse.FromCloudFormation.getString(properties.AmiType) : undefined));
  ret.addPropertyResult("capacityType", "CapacityType", (properties.CapacityType != null ? cfn_parse.FromCloudFormation.getString(properties.CapacityType) : undefined));
  ret.addPropertyResult("clusterName", "ClusterName", (properties.ClusterName != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterName) : undefined));
  ret.addPropertyResult("diskSize", "DiskSize", (properties.DiskSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.DiskSize) : undefined));
  ret.addPropertyResult("forceUpdateEnabled", "ForceUpdateEnabled", (properties.ForceUpdateEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ForceUpdateEnabled) : undefined));
  ret.addPropertyResult("instanceTypes", "InstanceTypes", (properties.InstanceTypes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.InstanceTypes) : undefined));
  ret.addPropertyResult("labels", "Labels", (properties.Labels != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Labels) : undefined));
  ret.addPropertyResult("launchTemplate", "LaunchTemplate", (properties.LaunchTemplate != null ? CfnNodegroupLaunchTemplateSpecificationPropertyFromCloudFormation(properties.LaunchTemplate) : undefined));
  ret.addPropertyResult("nodegroupName", "NodegroupName", (properties.NodegroupName != null ? cfn_parse.FromCloudFormation.getString(properties.NodegroupName) : undefined));
  ret.addPropertyResult("nodeRole", "NodeRole", (properties.NodeRole != null ? cfn_parse.FromCloudFormation.getString(properties.NodeRole) : undefined));
  ret.addPropertyResult("releaseVersion", "ReleaseVersion", (properties.ReleaseVersion != null ? cfn_parse.FromCloudFormation.getString(properties.ReleaseVersion) : undefined));
  ret.addPropertyResult("remoteAccess", "RemoteAccess", (properties.RemoteAccess != null ? CfnNodegroupRemoteAccessPropertyFromCloudFormation(properties.RemoteAccess) : undefined));
  ret.addPropertyResult("scalingConfig", "ScalingConfig", (properties.ScalingConfig != null ? CfnNodegroupScalingConfigPropertyFromCloudFormation(properties.ScalingConfig) : undefined));
  ret.addPropertyResult("subnets", "Subnets", (properties.Subnets != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Subnets) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("taints", "Taints", (properties.Taints != null ? cfn_parse.FromCloudFormation.getArray(CfnNodegroupTaintPropertyFromCloudFormation)(properties.Taints) : undefined));
  ret.addPropertyResult("updateConfig", "UpdateConfig", (properties.UpdateConfig != null ? CfnNodegroupUpdateConfigPropertyFromCloudFormation(properties.UpdateConfig) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates an access entry.
 *
 * An access entry allows an IAM principal to access your cluster. Access entries can replace the need to maintain entries in the `aws-auth` `ConfigMap` for authentication. You have the following options for authorizing an IAM principal to access Kubernetes objects on your cluster: Kubernetes role-based access control (RBAC), Amazon EKS, or both. Kubernetes RBAC authorization requires you to create and manage Kubernetes `Role` , `ClusterRole` , `RoleBinding` , and `ClusterRoleBinding` objects, in addition to managing access entries. If you use Amazon EKS authorization exclusively, you don't need to create and manage Kubernetes `Role` , `ClusterRole` , `RoleBinding` , and `ClusterRoleBinding` objects.
 *
 * For more information about access entries, see [Access entries](https://docs.aws.amazon.com/eks/latest/userguide/access-entries.html) in the *Amazon EKS User Guide* .
 *
 * @cloudformationResource AWS::EKS::AccessEntry
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-accessentry.html
 */
export class CfnAccessEntry extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::EKS::AccessEntry";

  /**
   * Build a CfnAccessEntry from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAccessEntry {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAccessEntryPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAccessEntry(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the access entry.
   *
   * @cloudformationAttribute AccessEntryArn
   */
  public readonly attrAccessEntryArn: string;

  /**
   * The access policies to associate to the access entry.
   */
  public accessPolicies?: Array<CfnAccessEntry.AccessPolicyProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The name of your cluster.
   */
  public clusterName: string;

  /**
   * The value for `name` that you've specified for `kind: Group` as a `subject` in a Kubernetes `RoleBinding` or `ClusterRoleBinding` object.
   */
  public kubernetesGroups?: Array<string>;

  /**
   * The ARN of the IAM principal for the `AccessEntry` .
   */
  public principalArn: string;

  /**
   * Metadata that assists with categorization and organization.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * The type of the new access entry. Valid values are `Standard` , `FARGATE_LINUX` , `EC2_LINUX` , and `EC2_WINDOWS` .
   */
  public type?: string;

  /**
   * The username to authenticate to Kubernetes with.
   */
  public username?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAccessEntryProps) {
    super(scope, id, {
      "type": CfnAccessEntry.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "clusterName", this);
    cdk.requireProperty(props, "principalArn", this);

    this.attrAccessEntryArn = cdk.Token.asString(this.getAtt("AccessEntryArn", cdk.ResolutionTypeHint.STRING));
    this.accessPolicies = props.accessPolicies;
    this.clusterName = props.clusterName;
    this.kubernetesGroups = props.kubernetesGroups;
    this.principalArn = props.principalArn;
    this.tags = props.tags;
    this.type = props.type;
    this.username = props.username;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accessPolicies": this.accessPolicies,
      "clusterName": this.clusterName,
      "kubernetesGroups": this.kubernetesGroups,
      "principalArn": this.principalArn,
      "tags": this.tags,
      "type": this.type,
      "username": this.username
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAccessEntry.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAccessEntryPropsToCloudFormation(props);
  }
}

export namespace CfnAccessEntry {
  /**
   * An access policy includes permissions that allow Amazon EKS to authorize an IAM principal to work with Kubernetes objects on your cluster.
   *
   * The policies are managed by Amazon EKS, but they're not IAM policies. You can't view the permissions in the policies using the API. The permissions for many of the policies are similar to the Kubernetes `cluster-admin` , `admin` , `edit` , and `view` cluster roles. For more information about these cluster roles, see [User-facing roles](https://docs.aws.amazon.com/https://kubernetes.io/docs/reference/access-authn-authz/rbac/#user-facing-roles) in the Kubernetes documentation. To view the contents of the policies, see [Access policy permissions](https://docs.aws.amazon.com/eks/latest/userguide/access-policies.html#access-policy-permissions) in the *Amazon EKS User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-accessentry-accesspolicy.html
   */
  export interface AccessPolicyProperty {
    /**
     * The scope of an `AccessPolicy` that's associated to an `AccessEntry` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-accessentry-accesspolicy.html#cfn-eks-accessentry-accesspolicy-accessscope
     */
    readonly accessScope: CfnAccessEntry.AccessScopeProperty | cdk.IResolvable;

    /**
     * The ARN of the access policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-accessentry-accesspolicy.html#cfn-eks-accessentry-accesspolicy-policyarn
     */
    readonly policyArn: string;
  }

  /**
   * The scope of an `AccessPolicy` that's associated to an `AccessEntry` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-accessentry-accessscope.html
   */
  export interface AccessScopeProperty {
    /**
     * A Kubernetes `namespace` that an access policy is scoped to.
     *
     * A value is required if you specified `namespace` for `Type` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-accessentry-accessscope.html#cfn-eks-accessentry-accessscope-namespaces
     */
    readonly namespaces?: Array<string>;

    /**
     * The scope type of an access policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-accessentry-accessscope.html#cfn-eks-accessentry-accessscope-type
     */
    readonly type: string;
  }
}

/**
 * Properties for defining a `CfnAccessEntry`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-accessentry.html
 */
export interface CfnAccessEntryProps {
  /**
   * The access policies to associate to the access entry.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-accessentry.html#cfn-eks-accessentry-accesspolicies
   */
  readonly accessPolicies?: Array<CfnAccessEntry.AccessPolicyProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The name of your cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-accessentry.html#cfn-eks-accessentry-clustername
   */
  readonly clusterName: string;

  /**
   * The value for `name` that you've specified for `kind: Group` as a `subject` in a Kubernetes `RoleBinding` or `ClusterRoleBinding` object.
   *
   * Amazon EKS doesn't confirm that the value for `name` exists in any bindings on your cluster. You can specify one or more names.
   *
   * Kubernetes authorizes the `principalArn` of the access entry to access any cluster objects that you've specified in a Kubernetes `Role` or `ClusterRole` object that is also specified in a binding's `roleRef` . For more information about creating Kubernetes `RoleBinding` , `ClusterRoleBinding` , `Role` , or `ClusterRole` objects, see [Using RBAC Authorization in the Kubernetes documentation](https://docs.aws.amazon.com/https://kubernetes.io/docs/reference/access-authn-authz/rbac/) .
   *
   * If you want Amazon EKS to authorize the `principalArn` (instead of, or in addition to Kubernetes authorizing the `principalArn` ), you can associate one or more access policies to the access entry using `AssociateAccessPolicy` . If you associate any access policies, the `principalARN` has all permissions assigned in the associated access policies and all permissions in any Kubernetes `Role` or `ClusterRole` objects that the group names are bound to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-accessentry.html#cfn-eks-accessentry-kubernetesgroups
   */
  readonly kubernetesGroups?: Array<string>;

  /**
   * The ARN of the IAM principal for the `AccessEntry` .
   *
   * You can specify one ARN for each access entry. You can't specify the same ARN in more than one access entry. This value can't be changed after access entry creation.
   *
   * The valid principals differ depending on the type of the access entry in the `type` field. The only valid ARN is IAM roles for the types of access entries for nodes: `` `` . You can use every IAM principal type for `STANDARD` access entries. You can't use the STS session principal type with access entries because this is a temporary principal for each session and not a permanent identity that can be assigned permissions.
   *
   * [IAM best practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#bp-users-federation-idp) recommend using IAM roles with temporary credentials, rather than IAM users with long-term credentials.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-accessentry.html#cfn-eks-accessentry-principalarn
   */
  readonly principalArn: string;

  /**
   * Metadata that assists with categorization and organization.
   *
   * Each tag consists of a key and an optional value. You define both. Tags don't propagate to any other cluster or AWS resources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-accessentry.html#cfn-eks-accessentry-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The type of the new access entry. Valid values are `Standard` , `FARGATE_LINUX` , `EC2_LINUX` , and `EC2_WINDOWS` .
   *
   * If the `principalArn` is for an IAM role that's used for self-managed Amazon EC2 nodes, specify `EC2_LINUX` or `EC2_WINDOWS` . Amazon EKS grants the necessary permissions to the node for you. If the `principalArn` is for any other purpose, specify `STANDARD` . If you don't specify a value, Amazon EKS sets the value to `STANDARD` . It's unnecessary to create access entries for IAM roles used with Fargate profiles or managed Amazon EC2 nodes, because Amazon EKS creates entries in the `aws-auth` `ConfigMap` for the roles. You can't change this value once you've created the access entry.
   *
   * If you set the value to `EC2_LINUX` or `EC2_WINDOWS` , you can't specify values for `kubernetesGroups` , or associate an `AccessPolicy` to the access entry.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-accessentry.html#cfn-eks-accessentry-type
   */
  readonly type?: string;

  /**
   * The username to authenticate to Kubernetes with.
   *
   * We recommend not specifying a username and letting Amazon EKS specify it for you. For more information about the value Amazon EKS specifies for you, or constraints before specifying your own username, see [Creating access entries](https://docs.aws.amazon.com/eks/latest/userguide/access-entries.html#creating-access-entries) in the *Amazon EKS User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-accessentry.html#cfn-eks-accessentry-username
   */
  readonly username?: string;
}

/**
 * Determine whether the given properties match those of a `AccessScopeProperty`
 *
 * @param properties - the TypeScript properties of a `AccessScopeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessEntryAccessScopePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("namespaces", cdk.listValidator(cdk.validateString))(properties.namespaces));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"AccessScopeProperty\"");
}

// @ts-ignore TS6133
function convertCfnAccessEntryAccessScopePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessEntryAccessScopePropertyValidator(properties).assertSuccess();
  return {
    "Namespaces": cdk.listMapper(cdk.stringToCloudFormation)(properties.namespaces),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnAccessEntryAccessScopePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessEntry.AccessScopeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessEntry.AccessScopeProperty>();
  ret.addPropertyResult("namespaces", "Namespaces", (properties.Namespaces != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Namespaces) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AccessPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `AccessPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessEntryAccessPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessScope", cdk.requiredValidator)(properties.accessScope));
  errors.collect(cdk.propertyValidator("accessScope", CfnAccessEntryAccessScopePropertyValidator)(properties.accessScope));
  errors.collect(cdk.propertyValidator("policyArn", cdk.requiredValidator)(properties.policyArn));
  errors.collect(cdk.propertyValidator("policyArn", cdk.validateString)(properties.policyArn));
  return errors.wrap("supplied properties not correct for \"AccessPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnAccessEntryAccessPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessEntryAccessPolicyPropertyValidator(properties).assertSuccess();
  return {
    "AccessScope": convertCfnAccessEntryAccessScopePropertyToCloudFormation(properties.accessScope),
    "PolicyArn": cdk.stringToCloudFormation(properties.policyArn)
  };
}

// @ts-ignore TS6133
function CfnAccessEntryAccessPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessEntry.AccessPolicyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessEntry.AccessPolicyProperty>();
  ret.addPropertyResult("accessScope", "AccessScope", (properties.AccessScope != null ? CfnAccessEntryAccessScopePropertyFromCloudFormation(properties.AccessScope) : undefined));
  ret.addPropertyResult("policyArn", "PolicyArn", (properties.PolicyArn != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnAccessEntryProps`
 *
 * @param properties - the TypeScript properties of a `CfnAccessEntryProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccessEntryPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessPolicies", cdk.listValidator(CfnAccessEntryAccessPolicyPropertyValidator))(properties.accessPolicies));
  errors.collect(cdk.propertyValidator("clusterName", cdk.requiredValidator)(properties.clusterName));
  errors.collect(cdk.propertyValidator("clusterName", cdk.validateString)(properties.clusterName));
  errors.collect(cdk.propertyValidator("kubernetesGroups", cdk.listValidator(cdk.validateString))(properties.kubernetesGroups));
  errors.collect(cdk.propertyValidator("principalArn", cdk.requiredValidator)(properties.principalArn));
  errors.collect(cdk.propertyValidator("principalArn", cdk.validateString)(properties.principalArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("username", cdk.validateString)(properties.username));
  return errors.wrap("supplied properties not correct for \"CfnAccessEntryProps\"");
}

// @ts-ignore TS6133
function convertCfnAccessEntryPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccessEntryPropsValidator(properties).assertSuccess();
  return {
    "AccessPolicies": cdk.listMapper(convertCfnAccessEntryAccessPolicyPropertyToCloudFormation)(properties.accessPolicies),
    "ClusterName": cdk.stringToCloudFormation(properties.clusterName),
    "KubernetesGroups": cdk.listMapper(cdk.stringToCloudFormation)(properties.kubernetesGroups),
    "PrincipalArn": cdk.stringToCloudFormation(properties.principalArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Type": cdk.stringToCloudFormation(properties.type),
    "Username": cdk.stringToCloudFormation(properties.username)
  };
}

// @ts-ignore TS6133
function CfnAccessEntryPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccessEntryProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccessEntryProps>();
  ret.addPropertyResult("accessPolicies", "AccessPolicies", (properties.AccessPolicies != null ? cfn_parse.FromCloudFormation.getArray(CfnAccessEntryAccessPolicyPropertyFromCloudFormation)(properties.AccessPolicies) : undefined));
  ret.addPropertyResult("clusterName", "ClusterName", (properties.ClusterName != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterName) : undefined));
  ret.addPropertyResult("kubernetesGroups", "KubernetesGroups", (properties.KubernetesGroups != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.KubernetesGroups) : undefined));
  ret.addPropertyResult("principalArn", "PrincipalArn", (properties.PrincipalArn != null ? cfn_parse.FromCloudFormation.getString(properties.PrincipalArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("username", "Username", (properties.Username != null ? cfn_parse.FromCloudFormation.getString(properties.Username) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Amazon EKS Pod Identity associations provide the ability to manage credentials for your applications, similar to the way that Amazon EC2 instance profiles provide credentials to Amazon EC2 instances.
 *
 * @cloudformationResource AWS::EKS::PodIdentityAssociation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-podidentityassociation.html
 */
export class CfnPodIdentityAssociation extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::EKS::PodIdentityAssociation";

  /**
   * Build a CfnPodIdentityAssociation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPodIdentityAssociation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPodIdentityAssociationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPodIdentityAssociation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the association.
   *
   * @cloudformationAttribute AssociationArn
   */
  public readonly attrAssociationArn: string;

  /**
   * The ID of the association.
   *
   * @cloudformationAttribute AssociationId
   */
  public readonly attrAssociationId: string;

  /**
   * The name of the cluster that the association is in.
   */
  public clusterName: string;

  /**
   * The name of the Kubernetes namespace inside the cluster to create the association in.
   */
  public namespace: string;

  /**
   * The Amazon Resource Name (ARN) of the IAM role to associate with the service account.
   */
  public roleArn: string;

  /**
   * The name of the Kubernetes service account inside the cluster to associate the IAM credentials with.
   */
  public serviceAccount: string;

  /**
   * Metadata that assists with categorization and organization.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPodIdentityAssociationProps) {
    super(scope, id, {
      "type": CfnPodIdentityAssociation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "clusterName", this);
    cdk.requireProperty(props, "namespace", this);
    cdk.requireProperty(props, "roleArn", this);
    cdk.requireProperty(props, "serviceAccount", this);

    this.attrAssociationArn = cdk.Token.asString(this.getAtt("AssociationArn", cdk.ResolutionTypeHint.STRING));
    this.attrAssociationId = cdk.Token.asString(this.getAtt("AssociationId", cdk.ResolutionTypeHint.STRING));
    this.clusterName = props.clusterName;
    this.namespace = props.namespace;
    this.roleArn = props.roleArn;
    this.serviceAccount = props.serviceAccount;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "clusterName": this.clusterName,
      "namespace": this.namespace,
      "roleArn": this.roleArn,
      "serviceAccount": this.serviceAccount,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPodIdentityAssociation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPodIdentityAssociationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnPodIdentityAssociation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-podidentityassociation.html
 */
export interface CfnPodIdentityAssociationProps {
  /**
   * The name of the cluster that the association is in.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-podidentityassociation.html#cfn-eks-podidentityassociation-clustername
   */
  readonly clusterName: string;

  /**
   * The name of the Kubernetes namespace inside the cluster to create the association in.
   *
   * The service account and the pods that use the service account must be in this namespace.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-podidentityassociation.html#cfn-eks-podidentityassociation-namespace
   */
  readonly namespace: string;

  /**
   * The Amazon Resource Name (ARN) of the IAM role to associate with the service account.
   *
   * The EKS Pod Identity agent manages credentials to assume this role for applications in the containers in the pods that use this service account.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-podidentityassociation.html#cfn-eks-podidentityassociation-rolearn
   */
  readonly roleArn: string;

  /**
   * The name of the Kubernetes service account inside the cluster to associate the IAM credentials with.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-podidentityassociation.html#cfn-eks-podidentityassociation-serviceaccount
   */
  readonly serviceAccount: string;

  /**
   * Metadata that assists with categorization and organization.
   *
   * Each tag consists of a key and an optional value. You define both. Tags don't propagate to any other cluster or AWS resources.
   *
   * The following basic restrictions apply to tags:
   *
   * - Maximum number of tags per resource – 50
   * - For each resource, each tag key must be unique, and each tag key can have only one value.
   * - Maximum key length – 128 Unicode characters in UTF-8
   * - Maximum value length – 256 Unicode characters in UTF-8
   * - If your tagging schema is used across multiple services and resources, remember that other services may have restrictions on allowed characters. Generally allowed characters are: letters, numbers, and spaces representable in UTF-8, and the following characters: + - = . _ : / @.
   * - Tag keys and values are case-sensitive.
   * - Do not use `aws:` , `AWS:` , or any upper or lowercase combination of such as a prefix for either keys or values as it is reserved for AWS use. You cannot edit or delete tag keys or values with this prefix. Tags with this prefix do not count against your tags per resource limit.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-podidentityassociation.html#cfn-eks-podidentityassociation-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnPodIdentityAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnPodIdentityAssociationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPodIdentityAssociationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clusterName", cdk.requiredValidator)(properties.clusterName));
  errors.collect(cdk.propertyValidator("clusterName", cdk.validateString)(properties.clusterName));
  errors.collect(cdk.propertyValidator("namespace", cdk.requiredValidator)(properties.namespace));
  errors.collect(cdk.propertyValidator("namespace", cdk.validateString)(properties.namespace));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("serviceAccount", cdk.requiredValidator)(properties.serviceAccount));
  errors.collect(cdk.propertyValidator("serviceAccount", cdk.validateString)(properties.serviceAccount));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnPodIdentityAssociationProps\"");
}

// @ts-ignore TS6133
function convertCfnPodIdentityAssociationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPodIdentityAssociationPropsValidator(properties).assertSuccess();
  return {
    "ClusterName": cdk.stringToCloudFormation(properties.clusterName),
    "Namespace": cdk.stringToCloudFormation(properties.namespace),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "ServiceAccount": cdk.stringToCloudFormation(properties.serviceAccount),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnPodIdentityAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPodIdentityAssociationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPodIdentityAssociationProps>();
  ret.addPropertyResult("clusterName", "ClusterName", (properties.ClusterName != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterName) : undefined));
  ret.addPropertyResult("namespace", "Namespace", (properties.Namespace != null ? cfn_parse.FromCloudFormation.getString(properties.Namespace) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("serviceAccount", "ServiceAccount", (properties.ServiceAccount != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceAccount) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}