/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The AWS::Elasticsearch::Domain resource creates an Amazon OpenSearch Service domain.
 *
 * > The `AWS::Elasticsearch::Domain` resource is being replaced by the [AWS::OpenSearchService::Domain](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html) resource. While the legacy Elasticsearch resource and options are still supported, we recommend modifying your existing Cloudformation templates to use the new OpenSearch Service resource, which supports both OpenSearch and legacy Elasticsearch. For instructions to upgrade domains defined within CloudFormation from Elasticsearch to OpenSearch, see [Remarks](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#aws-resource-opensearchservice-domain--remarks) .
 *
 * @cloudformationResource AWS::Elasticsearch::Domain
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html
 */
export class CfnDomain extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Elasticsearch::Domain";

  /**
   * Build a CfnDomain from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDomain {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDomainPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDomain(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the domain, such as `arn:aws:es:us-west-2:123456789012:domain/mystack-elasti-1ab2cdefghij` . This returned value is the same as the one returned by `AWS::Elasticsearch::Domain.DomainArn` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The domain-specific endpoint that's used for requests to the OpenSearch APIs, such as `search-mystack-elasti-1ab2cdefghij-ab1c2deckoyb3hofw7wpqa3cm.us-west-1.es.amazonaws.com` .
   *
   * @cloudformationAttribute DomainEndpoint
   */
  public readonly attrDomainEndpoint: string;

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * An AWS Identity and Access Management ( IAM ) policy document that specifies who can access the OpenSearch Service domain and their permissions.
   */
  public accessPolicies?: any | cdk.IResolvable;

  /**
   * Additional options to specify for the OpenSearch Service domain.
   */
  public advancedOptions?: cdk.IResolvable | Record<string, string>;

  /**
   * Specifies options for fine-grained access control.
   */
  public advancedSecurityOptions?: CfnDomain.AdvancedSecurityOptionsInputProperty | cdk.IResolvable;

  /**
   * Configures OpenSearch Service to use Amazon Cognito authentication for OpenSearch Dashboards.
   */
  public cognitoOptions?: CfnDomain.CognitoOptionsProperty | cdk.IResolvable;

  public domainArn?: string;

  /**
   * Specifies additional options for the domain endpoint, such as whether to require HTTPS for all traffic or whether to use a custom endpoint rather than the default endpoint.
   */
  public domainEndpointOptions?: CfnDomain.DomainEndpointOptionsProperty | cdk.IResolvable;

  /**
   * A name for the OpenSearch Service domain.
   */
  public domainName?: string;

  /**
   * The configurations of Amazon Elastic Block Store (Amazon EBS) volumes that are attached to data nodes in the OpenSearch Service domain.
   */
  public ebsOptions?: CfnDomain.EBSOptionsProperty | cdk.IResolvable;

  /**
   * ElasticsearchClusterConfig is a property of the AWS::Elasticsearch::Domain resource that configures the cluster of an Amazon OpenSearch Service domain.
   */
  public elasticsearchClusterConfig?: CfnDomain.ElasticsearchClusterConfigProperty | cdk.IResolvable;

  /**
   * The version of Elasticsearch to use, such as 2.3. If not specified, 1.5 is used as the default. For information about the versions that OpenSearch Service supports, see [Supported versions of OpenSearch and Elasticsearch](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/what-is.html#choosing-version) in the *Amazon OpenSearch Service Developer Guide* .
   */
  public elasticsearchVersion?: string;

  /**
   * Whether the domain should encrypt data at rest, and if so, the AWS Key Management Service key to use.
   */
  public encryptionAtRestOptions?: CfnDomain.EncryptionAtRestOptionsProperty | cdk.IResolvable;

  /**
   * An object with one or more of the following keys: `SEARCH_SLOW_LOGS` , `ES_APPLICATION_LOGS` , `INDEX_SLOW_LOGS` , `AUDIT_LOGS` , depending on the types of logs you want to publish.
   */
  public logPublishingOptions?: cdk.IResolvable | Record<string, cdk.IResolvable | CfnDomain.LogPublishingOptionProperty>;

  /**
   * Specifies whether node-to-node encryption is enabled.
   */
  public nodeToNodeEncryptionOptions?: cdk.IResolvable | CfnDomain.NodeToNodeEncryptionOptionsProperty;

  /**
   * *DEPRECATED* .
   */
  public snapshotOptions?: cdk.IResolvable | CfnDomain.SnapshotOptionsProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An arbitrary set of tags (key–value pairs) to associate with the OpenSearch Service domain.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The virtual private cloud (VPC) configuration for the OpenSearch Service domain.
   */
  public vpcOptions?: cdk.IResolvable | CfnDomain.VPCOptionsProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDomainProps = {}) {
    super(scope, id, {
      "type": CfnDomain.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrDomainEndpoint = cdk.Token.asString(this.getAtt("DomainEndpoint", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.accessPolicies = props.accessPolicies;
    this.advancedOptions = props.advancedOptions;
    this.advancedSecurityOptions = props.advancedSecurityOptions;
    this.cognitoOptions = props.cognitoOptions;
    this.domainArn = props.domainArn;
    this.domainEndpointOptions = props.domainEndpointOptions;
    this.domainName = props.domainName;
    this.ebsOptions = props.ebsOptions;
    this.elasticsearchClusterConfig = props.elasticsearchClusterConfig;
    this.elasticsearchVersion = props.elasticsearchVersion;
    this.encryptionAtRestOptions = props.encryptionAtRestOptions;
    this.logPublishingOptions = props.logPublishingOptions;
    this.nodeToNodeEncryptionOptions = props.nodeToNodeEncryptionOptions;
    this.snapshotOptions = props.snapshotOptions;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Elasticsearch::Domain", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.vpcOptions = props.vpcOptions;
    if ((this.node.scope != null && cdk.Resource.isResource(this.node.scope))) {
      this.node.addValidation({
        "validate": () => ((this.cfnOptions.deletionPolicy === undefined) ? ["'AWS::Elasticsearch::Domain' is a stateful resource type, and you must specify a Removal Policy for it. Call 'resource.applyRemovalPolicy()'."] : [])
      });
    }
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accessPolicies": this.accessPolicies,
      "advancedOptions": this.advancedOptions,
      "advancedSecurityOptions": this.advancedSecurityOptions,
      "cognitoOptions": this.cognitoOptions,
      "domainArn": this.domainArn,
      "domainEndpointOptions": this.domainEndpointOptions,
      "domainName": this.domainName,
      "ebsOptions": this.ebsOptions,
      "elasticsearchClusterConfig": this.elasticsearchClusterConfig,
      "elasticsearchVersion": this.elasticsearchVersion,
      "encryptionAtRestOptions": this.encryptionAtRestOptions,
      "logPublishingOptions": this.logPublishingOptions,
      "nodeToNodeEncryptionOptions": this.nodeToNodeEncryptionOptions,
      "snapshotOptions": this.snapshotOptions,
      "tags": this.tags.renderTags(),
      "vpcOptions": this.vpcOptions
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDomain.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDomainPropsToCloudFormation(props);
  }
}

export namespace CfnDomain {
  /**
   * Specifies options for fine-grained access control.
   *
   * > The `AWS::Elasticsearch::Domain` resource is being replaced by the [AWS::OpenSearchService::Domain](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html) resource. While the legacy Elasticsearch resource and options are still supported, we recommend modifying your existing Cloudformation templates to use the new OpenSearch Service resource, which supports both OpenSearch and Elasticsearch. For more information about the service rename, see [New resource types](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/rename.html#rename-resource) in the *Amazon OpenSearch Service Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-advancedsecurityoptionsinput.html
   */
  export interface AdvancedSecurityOptionsInputProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-advancedsecurityoptionsinput.html#cfn-elasticsearch-domain-advancedsecurityoptionsinput-anonymousauthenabled
     */
    readonly anonymousAuthEnabled?: boolean | cdk.IResolvable;

    /**
     * True to enable fine-grained access control.
     *
     * You must also enable encryption of data at rest and node-to-node encryption.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-advancedsecurityoptionsinput.html#cfn-elasticsearch-domain-advancedsecurityoptionsinput-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * True to enable the internal user database.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-advancedsecurityoptionsinput.html#cfn-elasticsearch-domain-advancedsecurityoptionsinput-internaluserdatabaseenabled
     */
    readonly internalUserDatabaseEnabled?: boolean | cdk.IResolvable;

    /**
     * Specifies information about the master user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-advancedsecurityoptionsinput.html#cfn-elasticsearch-domain-advancedsecurityoptionsinput-masteruseroptions
     */
    readonly masterUserOptions?: cdk.IResolvable | CfnDomain.MasterUserOptionsProperty;
  }

  /**
   * Specifies information about the master user. Required if you enabled the internal user database.
   *
   * > The `AWS::Elasticsearch::Domain` resource is being replaced by the [AWS::OpenSearchService::Domain](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html) resource. While the legacy Elasticsearch resource and options are still supported, we recommend modifying your existing Cloudformation templates to use the new OpenSearch Service resource, which supports both OpenSearch and Elasticsearch. For more information about the service rename, see [New resource types](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/rename.html#rename-resource) in the *Amazon OpenSearch Service Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-masteruseroptions.html
   */
  export interface MasterUserOptionsProperty {
    /**
     * ARN for the master user.
     *
     * Only specify if `InternalUserDatabaseEnabled` is false in `AdvancedSecurityOptions` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-masteruseroptions.html#cfn-elasticsearch-domain-masteruseroptions-masteruserarn
     */
    readonly masterUserArn?: string;

    /**
     * Username for the master user.
     *
     * Only specify if `InternalUserDatabaseEnabled` is true in `AdvancedSecurityOptions` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-masteruseroptions.html#cfn-elasticsearch-domain-masteruseroptions-masterusername
     */
    readonly masterUserName?: string;

    /**
     * Password for the master user.
     *
     * Only specify if `InternalUserDatabaseEnabled` is true in `AdvancedSecurityOptions` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-masteruseroptions.html#cfn-elasticsearch-domain-masteruseroptions-masteruserpassword
     */
    readonly masterUserPassword?: string;
  }

  /**
   * Configures OpenSearch Service to use Amazon Cognito authentication for OpenSearch Dashboards.
   *
   * > The `AWS::Elasticsearch::Domain` resource is being replaced by the [AWS::OpenSearchService::Domain](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html) resource. While the legacy Elasticsearch resource and options are still supported, we recommend modifying your existing Cloudformation templates to use the new OpenSearch Service resource, which supports both OpenSearch and Elasticsearch. For more information about the service rename, see [New resource types](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/rename.html#rename-resource) in the *Amazon OpenSearch Service Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-cognitooptions.html
   */
  export interface CognitoOptionsProperty {
    /**
     * Whether to enable or disable Amazon Cognito authentication for OpenSearch Dashboards.
     *
     * See [Amazon Cognito authentication for OpenSearch Dashboards](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/cognito-auth.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-cognitooptions.html#cfn-elasticsearch-domain-cognitooptions-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * The Amazon Cognito identity pool ID that you want OpenSearch Service to use for OpenSearch Dashboards authentication.
     *
     * Required if you enable Cognito authentication.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-cognitooptions.html#cfn-elasticsearch-domain-cognitooptions-identitypoolid
     */
    readonly identityPoolId?: string;

    /**
     * The `AmazonESCognitoAccess` role that allows OpenSearch Service to configure your user pool and identity pool.
     *
     * Required if you enable Cognito authentication.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-cognitooptions.html#cfn-elasticsearch-domain-cognitooptions-rolearn
     */
    readonly roleArn?: string;

    /**
     * The Amazon Cognito user pool ID that you want OpenSearch Service to use for OpenSearch Dashboards authentication.
     *
     * Required if you enable Cognito authentication.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-cognitooptions.html#cfn-elasticsearch-domain-cognitooptions-userpoolid
     */
    readonly userPoolId?: string;
  }

  /**
   * Specifies additional options for the domain endpoint, such as whether to require HTTPS for all traffic or whether to use a custom endpoint rather than the default endpoint.
   *
   * > The `AWS::Elasticsearch::Domain` resource is being replaced by the [AWS::OpenSearchService::Domain](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html) resource. While the legacy Elasticsearch resource and options are still supported, we recommend modifying your existing Cloudformation templates to use the new OpenSearch Service resource, which supports both OpenSearch and Elasticsearch. For more information about the service rename, see [New resource types](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/rename.html#rename-resource) in the *Amazon OpenSearch Service Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-domainendpointoptions.html
   */
  export interface DomainEndpointOptionsProperty {
    /**
     * The fully qualified URL for your custom endpoint.
     *
     * Required if you enabled a custom endpoint for the domain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-domainendpointoptions.html#cfn-elasticsearch-domain-domainendpointoptions-customendpoint
     */
    readonly customEndpoint?: string;

    /**
     * The AWS Certificate Manager ARN for your domain's SSL/TLS certificate.
     *
     * Required if you enabled a custom endpoint for the domain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-domainendpointoptions.html#cfn-elasticsearch-domain-domainendpointoptions-customendpointcertificatearn
     */
    readonly customEndpointCertificateArn?: string;

    /**
     * True to enable a custom endpoint for the domain.
     *
     * If enabled, you must also provide values for `CustomEndpoint` and `CustomEndpointCertificateArn` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-domainendpointoptions.html#cfn-elasticsearch-domain-domainendpointoptions-customendpointenabled
     */
    readonly customEndpointEnabled?: boolean | cdk.IResolvable;

    /**
     * True to require that all traffic to the domain arrive over HTTPS.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-domainendpointoptions.html#cfn-elasticsearch-domain-domainendpointoptions-enforcehttps
     */
    readonly enforceHttps?: boolean | cdk.IResolvable;

    /**
     * The minimum TLS version required for traffic to the domain. Valid values are TLS 1.3 (recommended) or 1.2:.
     *
     * - `Policy-Min-TLS-1-0-2019-07`
     * - `Policy-Min-TLS-1-2-2019-07`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-domainendpointoptions.html#cfn-elasticsearch-domain-domainendpointoptions-tlssecuritypolicy
     */
    readonly tlsSecurityPolicy?: string;
  }

  /**
   * The configurations of Amazon Elastic Block Store (Amazon EBS) volumes that are attached to data nodes in the OpenSearch Service domain.
   *
   * For more information, see [EBS volume size limits](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/limits.html#ebsresource) in the *Amazon OpenSearch Service Developer Guide* .
   *
   * > The `AWS::Elasticsearch::Domain` resource is being replaced by the [AWS::OpenSearchService::Domain](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html) resource. While the legacy Elasticsearch resource and options are still supported, we recommend modifying your existing Cloudformation templates to use the new OpenSearch Service resource, which supports both OpenSearch and Elasticsearch. For more information about the service rename, see [New resource types](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/rename.html#rename-resource) in the *Amazon OpenSearch Service Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-ebsoptions.html
   */
  export interface EBSOptionsProperty {
    /**
     * Specifies whether Amazon EBS volumes are attached to data nodes in the OpenSearch Service domain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-ebsoptions.html#cfn-elasticsearch-domain-ebsoptions-ebsenabled
     */
    readonly ebsEnabled?: boolean | cdk.IResolvable;

    /**
     * The number of I/O operations per second (IOPS) that the volume supports.
     *
     * This property applies only to provisioned IOPS EBS volume types.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-ebsoptions.html#cfn-elasticsearch-domain-ebsoptions-iops
     */
    readonly iops?: number;

    /**
     * The size (in GiB) of the EBS volume for each data node.
     *
     * The minimum and maximum size of an EBS volume depends on the EBS volume type and the instance type to which it is attached. For more information, see [EBS volume size limits](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/limits.html#ebsresource) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-ebsoptions.html#cfn-elasticsearch-domain-ebsoptions-volumesize
     */
    readonly volumeSize?: number;

    /**
     * The EBS volume type to use with the OpenSearch Service domain, such as standard, gp2, or io1.
     *
     * For more information about each type, see [Amazon EBS volume types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html) in the *Amazon EC2 User Guide for Linux Instances* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-ebsoptions.html#cfn-elasticsearch-domain-ebsoptions-volumetype
     */
    readonly volumeType?: string;
  }

  /**
   * The cluster configuration for the OpenSearch Service domain.
   *
   * You can specify options such as the instance type and the number of instances. For more information, see [Creating and managing Amazon OpenSearch Service domains](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/createupdatedomains.html) in the *Amazon OpenSearch Service Developer Guide* .
   *
   * > The `AWS::Elasticsearch::Domain` resource is being replaced by the [AWS::OpenSearchService::Domain](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html) resource. While the legacy Elasticsearch resource and options are still supported, we recommend modifying your existing Cloudformation templates to use the new OpenSearch Service resource, which supports both OpenSearch and Elasticsearch. For more information about the service rename, see [New resource types](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/rename.html#rename-resource) in the *Amazon OpenSearch Service Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html
   */
  export interface ElasticsearchClusterConfigProperty {
    /**
     * Specifies cold storage options for the domain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticsearchclusterconfig-coldstorageoptions
     */
    readonly coldStorageOptions?: CfnDomain.ColdStorageOptionsProperty | cdk.IResolvable;

    /**
     * The number of instances to use for the master node.
     *
     * If you specify this property, you must specify true for the DedicatedMasterEnabled property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticsearchclusterconfig-dedicatedmastercount
     */
    readonly dedicatedMasterCount?: number;

    /**
     * Indicates whether to use a dedicated master node for the OpenSearch Service domain.
     *
     * A dedicated master node is a cluster node that performs cluster management tasks, but doesn't hold data or respond to data upload requests. Dedicated master nodes offload cluster management tasks to increase the stability of your search clusters. See [Dedicated master nodes in Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/managedomains-dedicatedmasternodes.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticsearchclusterconfig-dedicatedmasterenabled
     */
    readonly dedicatedMasterEnabled?: boolean | cdk.IResolvable;

    /**
     * The hardware configuration of the computer that hosts the dedicated master node, such as `m3.medium.elasticsearch` . If you specify this property, you must specify true for the `DedicatedMasterEnabled` property. For valid values, see [Supported instance types in Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/supported-instance-types.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticsearchclusterconfig-dedicatedmastertype
     */
    readonly dedicatedMasterType?: string;

    /**
     * The number of data nodes (instances) to use in the OpenSearch Service domain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticsearchclusterconfig-instancecount
     */
    readonly instanceCount?: number;

    /**
     * The instance type for your data nodes, such as `m3.medium.elasticsearch` . For valid values, see [Supported instance types in Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/supported-instance-types.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticsearchclusterconfig-instancetype
     */
    readonly instanceType?: string;

    /**
     * The number of warm nodes in the cluster.
     *
     * Required if you enable warm storage.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticsearchclusterconfig-warmcount
     */
    readonly warmCount?: number;

    /**
     * Whether to enable warm storage for the cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticsearchclusterconfig-warmenabled
     */
    readonly warmEnabled?: boolean | cdk.IResolvable;

    /**
     * The instance type for the cluster's warm nodes.
     *
     * Required if you enable warm storage.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticsearchclusterconfig-warmtype
     */
    readonly warmType?: string;

    /**
     * Specifies zone awareness configuration options.
     *
     * Only use if `ZoneAwarenessEnabled` is `true` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticsearchclusterconfig-zoneawarenessconfig
     */
    readonly zoneAwarenessConfig?: cdk.IResolvable | CfnDomain.ZoneAwarenessConfigProperty;

    /**
     * Indicates whether to enable zone awareness for the OpenSearch Service domain.
     *
     * When you enable zone awareness, OpenSearch Service allocates the nodes and replica index shards that belong to a cluster across two Availability Zones (AZs) in the same region to prevent data loss and minimize downtime in the event of node or data center failure. Don't enable zone awareness if your cluster has no replica index shards or is a single-node cluster. For more information, see [Configuring a multi-AZ domain in Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/managedomains-multiaz.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-elasticsearchclusterconfig.html#cfn-elasticsearch-domain-elasticsearchclusterconfig-zoneawarenessenabled
     */
    readonly zoneAwarenessEnabled?: boolean | cdk.IResolvable;
  }

  /**
   * Specifies options for cold storage. For more information, see [Cold storage for Amazon Elasticsearch Service](https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/cold-storage.html) .
   *
   * > The `AWS::Elasticsearch::Domain` resource is being replaced by the [AWS::OpenSearchService::Domain](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html) resource. While the legacy Elasticsearch resource and options are still supported, we recommend modifying your existing Cloudformation templates to use the new OpenSearch Service resource, which supports both OpenSearch and Elasticsearch. For more information about the service rename, see [New resource types](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/rename.html#rename-resource) in the *Amazon OpenSearch Service Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-coldstorageoptions.html
   */
  export interface ColdStorageOptionsProperty {
    /**
     * Whether to enable or disable cold storage on the domain.
     *
     * You must enable UltraWarm storage in order to enable cold storage.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-coldstorageoptions.html#cfn-elasticsearch-domain-coldstorageoptions-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;
  }

  /**
   * Specifies zone awareness configuration options. Only use if `ZoneAwarenessEnabled` is `true` .
   *
   * > The `AWS::Elasticsearch::Domain` resource is being replaced by the [AWS::OpenSearchService::Domain](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html) resource. While the legacy Elasticsearch resource and options are still supported, we recommend modifying your existing Cloudformation templates to use the new OpenSearch Service resource, which supports both OpenSearch and Elasticsearch. For more information about the service rename, see [New resource types](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/rename.html#rename-resource) in the *Amazon OpenSearch Service Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-zoneawarenessconfig.html
   */
  export interface ZoneAwarenessConfigProperty {
    /**
     * If you enabled multiple Availability Zones (AZs), the number of AZs that you want the domain to use.
     *
     * Valid values are `2` and `3` . Default is 2.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-zoneawarenessconfig.html#cfn-elasticsearch-domain-zoneawarenessconfig-availabilityzonecount
     */
    readonly availabilityZoneCount?: number;
  }

  /**
   * Whether the domain should encrypt data at rest, and if so, the AWS Key Management Service key to use.
   *
   * > The `AWS::Elasticsearch::Domain` resource is being replaced by the [AWS::OpenSearchService::Domain](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html) resource. While the legacy Elasticsearch resource and options are still supported, we recommend modifying your existing Cloudformation templates to use the new OpenSearch Service resource, which supports both OpenSearch and Elasticsearch. For more information about the service rename, see [New resource types](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/rename.html#rename-resource) in the *Amazon OpenSearch Service Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-encryptionatrestoptions.html
   */
  export interface EncryptionAtRestOptionsProperty {
    /**
     * Specify `true` to enable encryption at rest.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-encryptionatrestoptions.html#cfn-elasticsearch-domain-encryptionatrestoptions-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * The KMS key ID.
     *
     * Takes the form `1a2a3a4-1a2a-3a4a-5a6a-1a2a3a4a5a6a` . Required if you enable encryption at rest.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-encryptionatrestoptions.html#cfn-elasticsearch-domain-encryptionatrestoptions-kmskeyid
     */
    readonly kmsKeyId?: string;
  }

  /**
   * > The `AWS::Elasticsearch::Domain` resource is being replaced by the [AWS::OpenSearchService::Domain](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html) resource. While the legacy Elasticsearch resource and options are still supported, we recommend modifying your existing Cloudformation templates to use the new OpenSearch Service resource, which supports both OpenSearch and Elasticsearch. For more information about the service rename, see [New resource types](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/rename.html#rename-resource) in the *Amazon OpenSearch Service Developer Guide* .
   *
   * Specifies whether the OpenSearch Service domain publishes the Elasticsearch application, search slow logs, or index slow logs to Amazon CloudWatch. Each option must be an object of name `SEARCH_SLOW_LOGS` , `ES_APPLICATION_LOGS` , `INDEX_SLOW_LOGS` , or `AUDIT_LOGS` depending on the type of logs you want to publish.
   *
   * If you enable a slow log, you still have to enable the *collection* of slow logs using the Configuration API. To learn more, see [Enabling log publishing ( AWS CLI)](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/createdomain-configure-slow-logs.html#createdomain-configure-slow-logs-cli) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-logpublishingoption.html
   */
  export interface LogPublishingOptionProperty {
    /**
     * Specifies the CloudWatch log group to publish to.
     *
     * Required if you enable log publishing for the domain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-logpublishingoption.html#cfn-elasticsearch-domain-logpublishingoption-cloudwatchlogsloggrouparn
     */
    readonly cloudWatchLogsLogGroupArn?: string;

    /**
     * If `true` , enables the publishing of logs to CloudWatch.
     *
     * Default: `false` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-logpublishingoption.html#cfn-elasticsearch-domain-logpublishingoption-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;
  }

  /**
   * Specifies whether node-to-node encryption is enabled.
   *
   * > The `AWS::Elasticsearch::Domain` resource is being replaced by the [AWS::OpenSearchService::Domain](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html) resource. While the legacy Elasticsearch resource and options are still supported, we recommend modifying your existing Cloudformation templates to use the new OpenSearch Service resource, which supports both OpenSearch and Elasticsearch. For more information about the service rename, see [New resource types](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/rename.html#rename-resource) in the *Amazon OpenSearch Service Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-nodetonodeencryptionoptions.html
   */
  export interface NodeToNodeEncryptionOptionsProperty {
    /**
     * Specifies whether node-to-node encryption is enabled, as a Boolean.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-nodetonodeencryptionoptions.html#cfn-elasticsearch-domain-nodetonodeencryptionoptions-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;
  }

  /**
   * > The `AWS::Elasticsearch::Domain` resource is being replaced by the [AWS::OpenSearchService::Domain](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html) resource. While the legacy Elasticsearch resource and options are still supported, we recommend modifying your existing Cloudformation templates to use the new OpenSearch Service resource, which supports both OpenSearch and Elasticsearch. For more information about the service rename, see [New resource types](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/rename.html#rename-resource) in the *Amazon OpenSearch Service Developer Guide* .
   *
   * *DEPRECATED* . For domains running Elasticsearch 5.3 and later, OpenSearch Service takes hourly automated snapshots, making this setting irrelevant. For domains running earlier versions of Elasticsearch, OpenSearch Service takes daily automated snapshots.
   *
   * The automated snapshot configuration for the OpenSearch Service domain indices.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-snapshotoptions.html
   */
  export interface SnapshotOptionsProperty {
    /**
     * The hour in UTC during which the service takes an automated daily snapshot of the indices in the OpenSearch Service domain.
     *
     * For example, if you specify 0, OpenSearch Service takes an automated snapshot everyday between midnight and 1 am. You can specify a value between 0 and 23.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-snapshotoptions.html#cfn-elasticsearch-domain-snapshotoptions-automatedsnapshotstarthour
     */
    readonly automatedSnapshotStartHour?: number;
  }

  /**
   * The virtual private cloud (VPC) configuration for the OpenSearch Service domain.
   *
   * For more information, see [Launching your Amazon OpenSearch Service domains using a VPC](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/vpc.html) in the *Amazon OpenSearch Service Developer Guide* .
   *
   * > The `AWS::Elasticsearch::Domain` resource is being replaced by the [AWS::OpenSearchService::Domain](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html) resource. While the legacy Elasticsearch resource and options are still supported, we recommend modifying your existing Cloudformation templates to use the new OpenSearch Service resource, which supports both OpenSearch and Elasticsearch. For more information about the service rename, see [New resource types](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/rename.html#rename-resource) in the *Amazon OpenSearch Service Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-vpcoptions.html
   */
  export interface VPCOptionsProperty {
    /**
     * The list of security group IDs that are associated with the VPC endpoints for the domain.
     *
     * If you don't provide a security group ID, OpenSearch Service uses the default security group for the VPC. To learn more, see [Security groups for your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html) in the *Amazon VPC User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-vpcoptions.html#cfn-elasticsearch-domain-vpcoptions-securitygroupids
     */
    readonly securityGroupIds?: Array<string>;

    /**
     * Provide one subnet ID for each Availability Zone that your domain uses.
     *
     * For example, you must specify three subnet IDs for a three Availability Zone domain. To learn more, see [VPCs and subnets](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Subnets.html) in the *Amazon VPC User Guide* .
     *
     * Required if you're creating your domain inside a VPC.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticsearch-domain-vpcoptions.html#cfn-elasticsearch-domain-vpcoptions-subnetids
     */
    readonly subnetIds?: Array<string>;
  }
}

/**
 * Properties for defining a `CfnDomain`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html
 */
export interface CfnDomainProps {
  /**
   * An AWS Identity and Access Management ( IAM ) policy document that specifies who can access the OpenSearch Service domain and their permissions.
   *
   * For more information, see [Configuring access policies](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/ac.html#ac-creating) in the *Amazon OpenSearch Service Developer Guid* e.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-accesspolicies
   */
  readonly accessPolicies?: any | cdk.IResolvable;

  /**
   * Additional options to specify for the OpenSearch Service domain.
   *
   * For more information, see [Advanced cluster parameters](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/createupdatedomains.html#createdomain-configure-advanced-options) in the *Amazon OpenSearch Service Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-advancedoptions
   */
  readonly advancedOptions?: cdk.IResolvable | Record<string, string>;

  /**
   * Specifies options for fine-grained access control.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-advancedsecurityoptions
   */
  readonly advancedSecurityOptions?: CfnDomain.AdvancedSecurityOptionsInputProperty | cdk.IResolvable;

  /**
   * Configures OpenSearch Service to use Amazon Cognito authentication for OpenSearch Dashboards.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-cognitooptions
   */
  readonly cognitoOptions?: CfnDomain.CognitoOptionsProperty | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-domainarn
   */
  readonly domainArn?: string;

  /**
   * Specifies additional options for the domain endpoint, such as whether to require HTTPS for all traffic or whether to use a custom endpoint rather than the default endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-domainendpointoptions
   */
  readonly domainEndpointOptions?: CfnDomain.DomainEndpointOptionsProperty | cdk.IResolvable;

  /**
   * A name for the OpenSearch Service domain.
   *
   * For valid values, see the [DomainName](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/configuration-api.html#configuration-api-datatypes-domainname) data type in the *Amazon OpenSearch Service Developer Guide* . If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the domain name. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
   *
   * > If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-domainname
   */
  readonly domainName?: string;

  /**
   * The configurations of Amazon Elastic Block Store (Amazon EBS) volumes that are attached to data nodes in the OpenSearch Service domain.
   *
   * For more information, see [EBS volume size limits](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/limits.html#ebsresource) in the *Amazon OpenSearch Service Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-ebsoptions
   */
  readonly ebsOptions?: CfnDomain.EBSOptionsProperty | cdk.IResolvable;

  /**
   * ElasticsearchClusterConfig is a property of the AWS::Elasticsearch::Domain resource that configures the cluster of an Amazon OpenSearch Service domain.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-elasticsearchclusterconfig
   */
  readonly elasticsearchClusterConfig?: CfnDomain.ElasticsearchClusterConfigProperty | cdk.IResolvable;

  /**
   * The version of Elasticsearch to use, such as 2.3. If not specified, 1.5 is used as the default. For information about the versions that OpenSearch Service supports, see [Supported versions of OpenSearch and Elasticsearch](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/what-is.html#choosing-version) in the *Amazon OpenSearch Service Developer Guide* .
   *
   * If you set the [EnableVersionUpgrade](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatepolicy.html#cfn-attributes-updatepolicy-upgradeopensearchdomain) update policy to `true` , you can update `ElasticsearchVersion` without interruption. When `EnableVersionUpgrade` is set to `false` , or is not specified, updating `ElasticsearchVersion` results in [replacement](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-replacement) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-elasticsearchversion
   */
  readonly elasticsearchVersion?: string;

  /**
   * Whether the domain should encrypt data at rest, and if so, the AWS Key Management Service key to use.
   *
   * See [Encryption of data at rest for Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/encryption-at-rest.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-encryptionatrestoptions
   */
  readonly encryptionAtRestOptions?: CfnDomain.EncryptionAtRestOptionsProperty | cdk.IResolvable;

  /**
   * An object with one or more of the following keys: `SEARCH_SLOW_LOGS` , `ES_APPLICATION_LOGS` , `INDEX_SLOW_LOGS` , `AUDIT_LOGS` , depending on the types of logs you want to publish.
   *
   * Each key needs a valid `LogPublishingOption` value.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-logpublishingoptions
   */
  readonly logPublishingOptions?: cdk.IResolvable | Record<string, cdk.IResolvable | CfnDomain.LogPublishingOptionProperty>;

  /**
   * Specifies whether node-to-node encryption is enabled.
   *
   * See [Node-to-node encryption for Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/ntn.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-nodetonodeencryptionoptions
   */
  readonly nodeToNodeEncryptionOptions?: cdk.IResolvable | CfnDomain.NodeToNodeEncryptionOptionsProperty;

  /**
   * *DEPRECATED* .
   *
   * The automated snapshot configuration for the OpenSearch Service domain indices.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-snapshotoptions
   */
  readonly snapshotOptions?: cdk.IResolvable | CfnDomain.SnapshotOptionsProperty;

  /**
   * An arbitrary set of tags (key–value pairs) to associate with the OpenSearch Service domain.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The virtual private cloud (VPC) configuration for the OpenSearch Service domain.
   *
   * For more information, see [Launching your Amazon OpenSearch Service domains within a VPC](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/vpc.html) in the *Amazon OpenSearch Service Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticsearch-domain.html#cfn-elasticsearch-domain-vpcoptions
   */
  readonly vpcOptions?: cdk.IResolvable | CfnDomain.VPCOptionsProperty;
}

/**
 * Determine whether the given properties match those of a `MasterUserOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `MasterUserOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainMasterUserOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("masterUserArn", cdk.validateString)(properties.masterUserArn));
  errors.collect(cdk.propertyValidator("masterUserName", cdk.validateString)(properties.masterUserName));
  errors.collect(cdk.propertyValidator("masterUserPassword", cdk.validateString)(properties.masterUserPassword));
  return errors.wrap("supplied properties not correct for \"MasterUserOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainMasterUserOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainMasterUserOptionsPropertyValidator(properties).assertSuccess();
  return {
    "MasterUserARN": cdk.stringToCloudFormation(properties.masterUserArn),
    "MasterUserName": cdk.stringToCloudFormation(properties.masterUserName),
    "MasterUserPassword": cdk.stringToCloudFormation(properties.masterUserPassword)
  };
}

// @ts-ignore TS6133
function CfnDomainMasterUserOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDomain.MasterUserOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.MasterUserOptionsProperty>();
  ret.addPropertyResult("masterUserArn", "MasterUserARN", (properties.MasterUserARN != null ? cfn_parse.FromCloudFormation.getString(properties.MasterUserARN) : undefined));
  ret.addPropertyResult("masterUserName", "MasterUserName", (properties.MasterUserName != null ? cfn_parse.FromCloudFormation.getString(properties.MasterUserName) : undefined));
  ret.addPropertyResult("masterUserPassword", "MasterUserPassword", (properties.MasterUserPassword != null ? cfn_parse.FromCloudFormation.getString(properties.MasterUserPassword) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AdvancedSecurityOptionsInputProperty`
 *
 * @param properties - the TypeScript properties of a `AdvancedSecurityOptionsInputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainAdvancedSecurityOptionsInputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("anonymousAuthEnabled", cdk.validateBoolean)(properties.anonymousAuthEnabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("internalUserDatabaseEnabled", cdk.validateBoolean)(properties.internalUserDatabaseEnabled));
  errors.collect(cdk.propertyValidator("masterUserOptions", CfnDomainMasterUserOptionsPropertyValidator)(properties.masterUserOptions));
  return errors.wrap("supplied properties not correct for \"AdvancedSecurityOptionsInputProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainAdvancedSecurityOptionsInputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainAdvancedSecurityOptionsInputPropertyValidator(properties).assertSuccess();
  return {
    "AnonymousAuthEnabled": cdk.booleanToCloudFormation(properties.anonymousAuthEnabled),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "InternalUserDatabaseEnabled": cdk.booleanToCloudFormation(properties.internalUserDatabaseEnabled),
    "MasterUserOptions": convertCfnDomainMasterUserOptionsPropertyToCloudFormation(properties.masterUserOptions)
  };
}

// @ts-ignore TS6133
function CfnDomainAdvancedSecurityOptionsInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomain.AdvancedSecurityOptionsInputProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.AdvancedSecurityOptionsInputProperty>();
  ret.addPropertyResult("anonymousAuthEnabled", "AnonymousAuthEnabled", (properties.AnonymousAuthEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AnonymousAuthEnabled) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("internalUserDatabaseEnabled", "InternalUserDatabaseEnabled", (properties.InternalUserDatabaseEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.InternalUserDatabaseEnabled) : undefined));
  ret.addPropertyResult("masterUserOptions", "MasterUserOptions", (properties.MasterUserOptions != null ? CfnDomainMasterUserOptionsPropertyFromCloudFormation(properties.MasterUserOptions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CognitoOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `CognitoOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainCognitoOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("identityPoolId", cdk.validateString)(properties.identityPoolId));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("userPoolId", cdk.validateString)(properties.userPoolId));
  return errors.wrap("supplied properties not correct for \"CognitoOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainCognitoOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainCognitoOptionsPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "IdentityPoolId": cdk.stringToCloudFormation(properties.identityPoolId),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "UserPoolId": cdk.stringToCloudFormation(properties.userPoolId)
  };
}

// @ts-ignore TS6133
function CfnDomainCognitoOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomain.CognitoOptionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.CognitoOptionsProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("identityPoolId", "IdentityPoolId", (properties.IdentityPoolId != null ? cfn_parse.FromCloudFormation.getString(properties.IdentityPoolId) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("userPoolId", "UserPoolId", (properties.UserPoolId != null ? cfn_parse.FromCloudFormation.getString(properties.UserPoolId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DomainEndpointOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `DomainEndpointOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainDomainEndpointOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customEndpoint", cdk.validateString)(properties.customEndpoint));
  errors.collect(cdk.propertyValidator("customEndpointCertificateArn", cdk.validateString)(properties.customEndpointCertificateArn));
  errors.collect(cdk.propertyValidator("customEndpointEnabled", cdk.validateBoolean)(properties.customEndpointEnabled));
  errors.collect(cdk.propertyValidator("enforceHttps", cdk.validateBoolean)(properties.enforceHttps));
  errors.collect(cdk.propertyValidator("tlsSecurityPolicy", cdk.validateString)(properties.tlsSecurityPolicy));
  return errors.wrap("supplied properties not correct for \"DomainEndpointOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainDomainEndpointOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainDomainEndpointOptionsPropertyValidator(properties).assertSuccess();
  return {
    "CustomEndpoint": cdk.stringToCloudFormation(properties.customEndpoint),
    "CustomEndpointCertificateArn": cdk.stringToCloudFormation(properties.customEndpointCertificateArn),
    "CustomEndpointEnabled": cdk.booleanToCloudFormation(properties.customEndpointEnabled),
    "EnforceHTTPS": cdk.booleanToCloudFormation(properties.enforceHttps),
    "TLSSecurityPolicy": cdk.stringToCloudFormation(properties.tlsSecurityPolicy)
  };
}

// @ts-ignore TS6133
function CfnDomainDomainEndpointOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomain.DomainEndpointOptionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.DomainEndpointOptionsProperty>();
  ret.addPropertyResult("customEndpoint", "CustomEndpoint", (properties.CustomEndpoint != null ? cfn_parse.FromCloudFormation.getString(properties.CustomEndpoint) : undefined));
  ret.addPropertyResult("customEndpointCertificateArn", "CustomEndpointCertificateArn", (properties.CustomEndpointCertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.CustomEndpointCertificateArn) : undefined));
  ret.addPropertyResult("customEndpointEnabled", "CustomEndpointEnabled", (properties.CustomEndpointEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CustomEndpointEnabled) : undefined));
  ret.addPropertyResult("enforceHttps", "EnforceHTTPS", (properties.EnforceHTTPS != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnforceHTTPS) : undefined));
  ret.addPropertyResult("tlsSecurityPolicy", "TLSSecurityPolicy", (properties.TLSSecurityPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.TLSSecurityPolicy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EBSOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `EBSOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainEBSOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ebsEnabled", cdk.validateBoolean)(properties.ebsEnabled));
  errors.collect(cdk.propertyValidator("iops", cdk.validateNumber)(properties.iops));
  errors.collect(cdk.propertyValidator("volumeSize", cdk.validateNumber)(properties.volumeSize));
  errors.collect(cdk.propertyValidator("volumeType", cdk.validateString)(properties.volumeType));
  return errors.wrap("supplied properties not correct for \"EBSOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainEBSOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainEBSOptionsPropertyValidator(properties).assertSuccess();
  return {
    "EBSEnabled": cdk.booleanToCloudFormation(properties.ebsEnabled),
    "Iops": cdk.numberToCloudFormation(properties.iops),
    "VolumeSize": cdk.numberToCloudFormation(properties.volumeSize),
    "VolumeType": cdk.stringToCloudFormation(properties.volumeType)
  };
}

// @ts-ignore TS6133
function CfnDomainEBSOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomain.EBSOptionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.EBSOptionsProperty>();
  ret.addPropertyResult("ebsEnabled", "EBSEnabled", (properties.EBSEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EBSEnabled) : undefined));
  ret.addPropertyResult("iops", "Iops", (properties.Iops != null ? cfn_parse.FromCloudFormation.getNumber(properties.Iops) : undefined));
  ret.addPropertyResult("volumeSize", "VolumeSize", (properties.VolumeSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.VolumeSize) : undefined));
  ret.addPropertyResult("volumeType", "VolumeType", (properties.VolumeType != null ? cfn_parse.FromCloudFormation.getString(properties.VolumeType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ColdStorageOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `ColdStorageOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainColdStorageOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  return errors.wrap("supplied properties not correct for \"ColdStorageOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainColdStorageOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainColdStorageOptionsPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled)
  };
}

// @ts-ignore TS6133
function CfnDomainColdStorageOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomain.ColdStorageOptionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.ColdStorageOptionsProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ZoneAwarenessConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ZoneAwarenessConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainZoneAwarenessConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("availabilityZoneCount", cdk.validateNumber)(properties.availabilityZoneCount));
  return errors.wrap("supplied properties not correct for \"ZoneAwarenessConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainZoneAwarenessConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainZoneAwarenessConfigPropertyValidator(properties).assertSuccess();
  return {
    "AvailabilityZoneCount": cdk.numberToCloudFormation(properties.availabilityZoneCount)
  };
}

// @ts-ignore TS6133
function CfnDomainZoneAwarenessConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDomain.ZoneAwarenessConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.ZoneAwarenessConfigProperty>();
  ret.addPropertyResult("availabilityZoneCount", "AvailabilityZoneCount", (properties.AvailabilityZoneCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.AvailabilityZoneCount) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ElasticsearchClusterConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ElasticsearchClusterConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainElasticsearchClusterConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("coldStorageOptions", CfnDomainColdStorageOptionsPropertyValidator)(properties.coldStorageOptions));
  errors.collect(cdk.propertyValidator("dedicatedMasterCount", cdk.validateNumber)(properties.dedicatedMasterCount));
  errors.collect(cdk.propertyValidator("dedicatedMasterEnabled", cdk.validateBoolean)(properties.dedicatedMasterEnabled));
  errors.collect(cdk.propertyValidator("dedicatedMasterType", cdk.validateString)(properties.dedicatedMasterType));
  errors.collect(cdk.propertyValidator("instanceCount", cdk.validateNumber)(properties.instanceCount));
  errors.collect(cdk.propertyValidator("instanceType", cdk.validateString)(properties.instanceType));
  errors.collect(cdk.propertyValidator("warmCount", cdk.validateNumber)(properties.warmCount));
  errors.collect(cdk.propertyValidator("warmEnabled", cdk.validateBoolean)(properties.warmEnabled));
  errors.collect(cdk.propertyValidator("warmType", cdk.validateString)(properties.warmType));
  errors.collect(cdk.propertyValidator("zoneAwarenessConfig", CfnDomainZoneAwarenessConfigPropertyValidator)(properties.zoneAwarenessConfig));
  errors.collect(cdk.propertyValidator("zoneAwarenessEnabled", cdk.validateBoolean)(properties.zoneAwarenessEnabled));
  return errors.wrap("supplied properties not correct for \"ElasticsearchClusterConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainElasticsearchClusterConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainElasticsearchClusterConfigPropertyValidator(properties).assertSuccess();
  return {
    "ColdStorageOptions": convertCfnDomainColdStorageOptionsPropertyToCloudFormation(properties.coldStorageOptions),
    "DedicatedMasterCount": cdk.numberToCloudFormation(properties.dedicatedMasterCount),
    "DedicatedMasterEnabled": cdk.booleanToCloudFormation(properties.dedicatedMasterEnabled),
    "DedicatedMasterType": cdk.stringToCloudFormation(properties.dedicatedMasterType),
    "InstanceCount": cdk.numberToCloudFormation(properties.instanceCount),
    "InstanceType": cdk.stringToCloudFormation(properties.instanceType),
    "WarmCount": cdk.numberToCloudFormation(properties.warmCount),
    "WarmEnabled": cdk.booleanToCloudFormation(properties.warmEnabled),
    "WarmType": cdk.stringToCloudFormation(properties.warmType),
    "ZoneAwarenessConfig": convertCfnDomainZoneAwarenessConfigPropertyToCloudFormation(properties.zoneAwarenessConfig),
    "ZoneAwarenessEnabled": cdk.booleanToCloudFormation(properties.zoneAwarenessEnabled)
  };
}

// @ts-ignore TS6133
function CfnDomainElasticsearchClusterConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomain.ElasticsearchClusterConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.ElasticsearchClusterConfigProperty>();
  ret.addPropertyResult("coldStorageOptions", "ColdStorageOptions", (properties.ColdStorageOptions != null ? CfnDomainColdStorageOptionsPropertyFromCloudFormation(properties.ColdStorageOptions) : undefined));
  ret.addPropertyResult("dedicatedMasterCount", "DedicatedMasterCount", (properties.DedicatedMasterCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.DedicatedMasterCount) : undefined));
  ret.addPropertyResult("dedicatedMasterEnabled", "DedicatedMasterEnabled", (properties.DedicatedMasterEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DedicatedMasterEnabled) : undefined));
  ret.addPropertyResult("dedicatedMasterType", "DedicatedMasterType", (properties.DedicatedMasterType != null ? cfn_parse.FromCloudFormation.getString(properties.DedicatedMasterType) : undefined));
  ret.addPropertyResult("instanceCount", "InstanceCount", (properties.InstanceCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.InstanceCount) : undefined));
  ret.addPropertyResult("instanceType", "InstanceType", (properties.InstanceType != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceType) : undefined));
  ret.addPropertyResult("warmCount", "WarmCount", (properties.WarmCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.WarmCount) : undefined));
  ret.addPropertyResult("warmEnabled", "WarmEnabled", (properties.WarmEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.WarmEnabled) : undefined));
  ret.addPropertyResult("warmType", "WarmType", (properties.WarmType != null ? cfn_parse.FromCloudFormation.getString(properties.WarmType) : undefined));
  ret.addPropertyResult("zoneAwarenessConfig", "ZoneAwarenessConfig", (properties.ZoneAwarenessConfig != null ? CfnDomainZoneAwarenessConfigPropertyFromCloudFormation(properties.ZoneAwarenessConfig) : undefined));
  ret.addPropertyResult("zoneAwarenessEnabled", "ZoneAwarenessEnabled", (properties.ZoneAwarenessEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ZoneAwarenessEnabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EncryptionAtRestOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionAtRestOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainEncryptionAtRestOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  return errors.wrap("supplied properties not correct for \"EncryptionAtRestOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainEncryptionAtRestOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainEncryptionAtRestOptionsPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId)
  };
}

// @ts-ignore TS6133
function CfnDomainEncryptionAtRestOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomain.EncryptionAtRestOptionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.EncryptionAtRestOptionsProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LogPublishingOptionProperty`
 *
 * @param properties - the TypeScript properties of a `LogPublishingOptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainLogPublishingOptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cloudWatchLogsLogGroupArn", cdk.validateString)(properties.cloudWatchLogsLogGroupArn));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  return errors.wrap("supplied properties not correct for \"LogPublishingOptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainLogPublishingOptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainLogPublishingOptionPropertyValidator(properties).assertSuccess();
  return {
    "CloudWatchLogsLogGroupArn": cdk.stringToCloudFormation(properties.cloudWatchLogsLogGroupArn),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled)
  };
}

// @ts-ignore TS6133
function CfnDomainLogPublishingOptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDomain.LogPublishingOptionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.LogPublishingOptionProperty>();
  ret.addPropertyResult("cloudWatchLogsLogGroupArn", "CloudWatchLogsLogGroupArn", (properties.CloudWatchLogsLogGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.CloudWatchLogsLogGroupArn) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NodeToNodeEncryptionOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `NodeToNodeEncryptionOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainNodeToNodeEncryptionOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  return errors.wrap("supplied properties not correct for \"NodeToNodeEncryptionOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainNodeToNodeEncryptionOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainNodeToNodeEncryptionOptionsPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled)
  };
}

// @ts-ignore TS6133
function CfnDomainNodeToNodeEncryptionOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDomain.NodeToNodeEncryptionOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.NodeToNodeEncryptionOptionsProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SnapshotOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `SnapshotOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainSnapshotOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("automatedSnapshotStartHour", cdk.validateNumber)(properties.automatedSnapshotStartHour));
  return errors.wrap("supplied properties not correct for \"SnapshotOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainSnapshotOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainSnapshotOptionsPropertyValidator(properties).assertSuccess();
  return {
    "AutomatedSnapshotStartHour": cdk.numberToCloudFormation(properties.automatedSnapshotStartHour)
  };
}

// @ts-ignore TS6133
function CfnDomainSnapshotOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDomain.SnapshotOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.SnapshotOptionsProperty>();
  ret.addPropertyResult("automatedSnapshotStartHour", "AutomatedSnapshotStartHour", (properties.AutomatedSnapshotStartHour != null ? cfn_parse.FromCloudFormation.getNumber(properties.AutomatedSnapshotStartHour) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VPCOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `VPCOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainVPCOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  return errors.wrap("supplied properties not correct for \"VPCOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainVPCOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainVPCOptionsPropertyValidator(properties).assertSuccess();
  return {
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds)
  };
}

// @ts-ignore TS6133
function CfnDomainVPCOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDomain.VPCOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.VPCOptionsProperty>();
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDomainProps`
 *
 * @param properties - the TypeScript properties of a `CfnDomainProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessPolicies", cdk.validateObject)(properties.accessPolicies));
  errors.collect(cdk.propertyValidator("advancedOptions", cdk.hashValidator(cdk.validateString))(properties.advancedOptions));
  errors.collect(cdk.propertyValidator("advancedSecurityOptions", CfnDomainAdvancedSecurityOptionsInputPropertyValidator)(properties.advancedSecurityOptions));
  errors.collect(cdk.propertyValidator("cognitoOptions", CfnDomainCognitoOptionsPropertyValidator)(properties.cognitoOptions));
  errors.collect(cdk.propertyValidator("domainArn", cdk.validateString)(properties.domainArn));
  errors.collect(cdk.propertyValidator("domainEndpointOptions", CfnDomainDomainEndpointOptionsPropertyValidator)(properties.domainEndpointOptions));
  errors.collect(cdk.propertyValidator("domainName", cdk.validateString)(properties.domainName));
  errors.collect(cdk.propertyValidator("ebsOptions", CfnDomainEBSOptionsPropertyValidator)(properties.ebsOptions));
  errors.collect(cdk.propertyValidator("elasticsearchClusterConfig", CfnDomainElasticsearchClusterConfigPropertyValidator)(properties.elasticsearchClusterConfig));
  errors.collect(cdk.propertyValidator("elasticsearchVersion", cdk.validateString)(properties.elasticsearchVersion));
  errors.collect(cdk.propertyValidator("encryptionAtRestOptions", CfnDomainEncryptionAtRestOptionsPropertyValidator)(properties.encryptionAtRestOptions));
  errors.collect(cdk.propertyValidator("logPublishingOptions", cdk.hashValidator(CfnDomainLogPublishingOptionPropertyValidator))(properties.logPublishingOptions));
  errors.collect(cdk.propertyValidator("nodeToNodeEncryptionOptions", CfnDomainNodeToNodeEncryptionOptionsPropertyValidator)(properties.nodeToNodeEncryptionOptions));
  errors.collect(cdk.propertyValidator("snapshotOptions", CfnDomainSnapshotOptionsPropertyValidator)(properties.snapshotOptions));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("vpcOptions", CfnDomainVPCOptionsPropertyValidator)(properties.vpcOptions));
  return errors.wrap("supplied properties not correct for \"CfnDomainProps\"");
}

// @ts-ignore TS6133
function convertCfnDomainPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainPropsValidator(properties).assertSuccess();
  return {
    "AccessPolicies": cdk.objectToCloudFormation(properties.accessPolicies),
    "AdvancedOptions": cdk.hashMapper(cdk.stringToCloudFormation)(properties.advancedOptions),
    "AdvancedSecurityOptions": convertCfnDomainAdvancedSecurityOptionsInputPropertyToCloudFormation(properties.advancedSecurityOptions),
    "CognitoOptions": convertCfnDomainCognitoOptionsPropertyToCloudFormation(properties.cognitoOptions),
    "DomainArn": cdk.stringToCloudFormation(properties.domainArn),
    "DomainEndpointOptions": convertCfnDomainDomainEndpointOptionsPropertyToCloudFormation(properties.domainEndpointOptions),
    "DomainName": cdk.stringToCloudFormation(properties.domainName),
    "EBSOptions": convertCfnDomainEBSOptionsPropertyToCloudFormation(properties.ebsOptions),
    "ElasticsearchClusterConfig": convertCfnDomainElasticsearchClusterConfigPropertyToCloudFormation(properties.elasticsearchClusterConfig),
    "ElasticsearchVersion": cdk.stringToCloudFormation(properties.elasticsearchVersion),
    "EncryptionAtRestOptions": convertCfnDomainEncryptionAtRestOptionsPropertyToCloudFormation(properties.encryptionAtRestOptions),
    "LogPublishingOptions": cdk.hashMapper(convertCfnDomainLogPublishingOptionPropertyToCloudFormation)(properties.logPublishingOptions),
    "NodeToNodeEncryptionOptions": convertCfnDomainNodeToNodeEncryptionOptionsPropertyToCloudFormation(properties.nodeToNodeEncryptionOptions),
    "SnapshotOptions": convertCfnDomainSnapshotOptionsPropertyToCloudFormation(properties.snapshotOptions),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VPCOptions": convertCfnDomainVPCOptionsPropertyToCloudFormation(properties.vpcOptions)
  };
}

// @ts-ignore TS6133
function CfnDomainPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomainProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomainProps>();
  ret.addPropertyResult("accessPolicies", "AccessPolicies", (properties.AccessPolicies != null ? cfn_parse.FromCloudFormation.getAny(properties.AccessPolicies) : undefined));
  ret.addPropertyResult("advancedOptions", "AdvancedOptions", (properties.AdvancedOptions != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.AdvancedOptions) : undefined));
  ret.addPropertyResult("advancedSecurityOptions", "AdvancedSecurityOptions", (properties.AdvancedSecurityOptions != null ? CfnDomainAdvancedSecurityOptionsInputPropertyFromCloudFormation(properties.AdvancedSecurityOptions) : undefined));
  ret.addPropertyResult("cognitoOptions", "CognitoOptions", (properties.CognitoOptions != null ? CfnDomainCognitoOptionsPropertyFromCloudFormation(properties.CognitoOptions) : undefined));
  ret.addPropertyResult("domainArn", "DomainArn", (properties.DomainArn != null ? cfn_parse.FromCloudFormation.getString(properties.DomainArn) : undefined));
  ret.addPropertyResult("domainEndpointOptions", "DomainEndpointOptions", (properties.DomainEndpointOptions != null ? CfnDomainDomainEndpointOptionsPropertyFromCloudFormation(properties.DomainEndpointOptions) : undefined));
  ret.addPropertyResult("domainName", "DomainName", (properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined));
  ret.addPropertyResult("ebsOptions", "EBSOptions", (properties.EBSOptions != null ? CfnDomainEBSOptionsPropertyFromCloudFormation(properties.EBSOptions) : undefined));
  ret.addPropertyResult("elasticsearchClusterConfig", "ElasticsearchClusterConfig", (properties.ElasticsearchClusterConfig != null ? CfnDomainElasticsearchClusterConfigPropertyFromCloudFormation(properties.ElasticsearchClusterConfig) : undefined));
  ret.addPropertyResult("elasticsearchVersion", "ElasticsearchVersion", (properties.ElasticsearchVersion != null ? cfn_parse.FromCloudFormation.getString(properties.ElasticsearchVersion) : undefined));
  ret.addPropertyResult("encryptionAtRestOptions", "EncryptionAtRestOptions", (properties.EncryptionAtRestOptions != null ? CfnDomainEncryptionAtRestOptionsPropertyFromCloudFormation(properties.EncryptionAtRestOptions) : undefined));
  ret.addPropertyResult("logPublishingOptions", "LogPublishingOptions", (properties.LogPublishingOptions != null ? cfn_parse.FromCloudFormation.getMap(CfnDomainLogPublishingOptionPropertyFromCloudFormation)(properties.LogPublishingOptions) : undefined));
  ret.addPropertyResult("nodeToNodeEncryptionOptions", "NodeToNodeEncryptionOptions", (properties.NodeToNodeEncryptionOptions != null ? CfnDomainNodeToNodeEncryptionOptionsPropertyFromCloudFormation(properties.NodeToNodeEncryptionOptions) : undefined));
  ret.addPropertyResult("snapshotOptions", "SnapshotOptions", (properties.SnapshotOptions != null ? CfnDomainSnapshotOptionsPropertyFromCloudFormation(properties.SnapshotOptions) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("vpcOptions", "VPCOptions", (properties.VPCOptions != null ? CfnDomainVPCOptionsPropertyFromCloudFormation(properties.VPCOptions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}