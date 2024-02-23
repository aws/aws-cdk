/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The AWS::OpenSearchService::Domain resource creates an Amazon OpenSearch Service domain.
 *
 * @cloudformationResource AWS::OpenSearchService::Domain
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html
 */
export class CfnDomain extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::OpenSearchService::Domain";

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
   * @cloudformationAttribute AdvancedSecurityOptions.AnonymousAuthDisableDate
   */
  public readonly attrAdvancedSecurityOptionsAnonymousAuthDisableDate: string;

  /**
   * The Amazon Resource Name (ARN) of the CloudFormation stack.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The domain-specific endpoint used for requests to the OpenSearch APIs, such as `search-mystack-1ab2cdefghij-ab1c2deckoyb3hofw7wpqa3cm.us-west-1.es.amazonaws.com` .
   *
   * @cloudformationAttribute DomainEndpoint
   */
  public readonly attrDomainEndpoint: string;

  /**
   * The key-value pair that exists if the OpenSearch Service domain uses VPC endpoints. Example `key, value` : `'vpc','vpc-endpoint-h2dsd34efgyghrtguk5gt6j2foh4.us-east-1.es.amazonaws.com'` .
   *
   * @cloudformationAttribute DomainEndpoints
   */
  public readonly attrDomainEndpoints: cdk.IResolvable;

  /**
   * If `IPAddressType` to set to `dualstack` , a version 2 domain endpoint is provisioned. This endpoint functions like a normal endpoint, except that it works with both IPv4 and IPv6 IP addresses. Normal endpoints work only with IPv4 IP addresses.
   *
   * @cloudformationAttribute DomainEndpointV2
   */
  public readonly attrDomainEndpointV2: string;

  /**
   * The resource ID. For example, `123456789012/my-domain` .
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The current status of the service software for a domain.
   *
   * @cloudformationAttribute ServiceSoftwareOptions
   */
  public readonly attrServiceSoftwareOptions: cdk.IResolvable;

  /**
   * @cloudformationAttribute ServiceSoftwareOptions.AutomatedUpdateDate
   */
  public readonly attrServiceSoftwareOptionsAutomatedUpdateDate: string;

  /**
   * @cloudformationAttribute ServiceSoftwareOptions.Cancellable
   */
  public readonly attrServiceSoftwareOptionsCancellable: cdk.IResolvable;

  /**
   * @cloudformationAttribute ServiceSoftwareOptions.CurrentVersion
   */
  public readonly attrServiceSoftwareOptionsCurrentVersion: string;

  /**
   * @cloudformationAttribute ServiceSoftwareOptions.Description
   */
  public readonly attrServiceSoftwareOptionsDescription: string;

  /**
   * @cloudformationAttribute ServiceSoftwareOptions.NewVersion
   */
  public readonly attrServiceSoftwareOptionsNewVersion: string;

  /**
   * @cloudformationAttribute ServiceSoftwareOptions.OptionalDeployment
   */
  public readonly attrServiceSoftwareOptionsOptionalDeployment: cdk.IResolvable;

  /**
   * @cloudformationAttribute ServiceSoftwareOptions.UpdateAvailable
   */
  public readonly attrServiceSoftwareOptionsUpdateAvailable: cdk.IResolvable;

  /**
   * @cloudformationAttribute ServiceSoftwareOptions.UpdateStatus
   */
  public readonly attrServiceSoftwareOptionsUpdateStatus: string;

  /**
   * An AWS Identity and Access Management ( IAM ) policy document that specifies who can access the OpenSearch Service domain and their permissions.
   */
  public accessPolicies?: any | cdk.IResolvable;

  /**
   * Additional options to specify for the OpenSearch Service domain.
   */
  public advancedOptions?: cdk.IResolvable | Record<string, string>;

  /**
   * Specifies options for fine-grained access control and SAML authentication.
   */
  public advancedSecurityOptions?: CfnDomain.AdvancedSecurityOptionsInputProperty | cdk.IResolvable;

  /**
   * Container for the cluster configuration of a domain.
   */
  public clusterConfig?: CfnDomain.ClusterConfigProperty | cdk.IResolvable;

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
   * Whether the domain should encrypt data at rest, and if so, the AWS KMS key to use.
   */
  public encryptionAtRestOptions?: CfnDomain.EncryptionAtRestOptionsProperty | cdk.IResolvable;

  /**
   * The version of OpenSearch to use.
   */
  public engineVersion?: string;

  /**
   * Choose either dual stack or IPv4 as your IP address type.
   */
  public ipAddressType?: string;

  /**
   * An object with one or more of the following keys: `SEARCH_SLOW_LOGS` , `ES_APPLICATION_LOGS` , `INDEX_SLOW_LOGS` , `AUDIT_LOGS` , depending on the types of logs you want to publish.
   */
  public logPublishingOptions?: cdk.IResolvable | Record<string, cdk.IResolvable | CfnDomain.LogPublishingOptionProperty>;

  /**
   * Specifies whether node-to-node encryption is enabled.
   */
  public nodeToNodeEncryptionOptions?: cdk.IResolvable | CfnDomain.NodeToNodeEncryptionOptionsProperty;

  /**
   * Options for a domain's off-peak window, during which OpenSearch Service can perform mandatory configuration changes on the domain.
   */
  public offPeakWindowOptions?: cdk.IResolvable | CfnDomain.OffPeakWindowOptionsProperty;

  /**
   * *DEPRECATED* .
   */
  public snapshotOptions?: cdk.IResolvable | CfnDomain.SnapshotOptionsProperty;

  /**
   * Service software update options for the domain.
   */
  public softwareUpdateOptions?: cdk.IResolvable | CfnDomain.SoftwareUpdateOptionsProperty;

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

    this.attrAdvancedSecurityOptionsAnonymousAuthDisableDate = cdk.Token.asString(this.getAtt("AdvancedSecurityOptions.AnonymousAuthDisableDate", cdk.ResolutionTypeHint.STRING));
    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrDomainEndpoint = cdk.Token.asString(this.getAtt("DomainEndpoint", cdk.ResolutionTypeHint.STRING));
    this.attrDomainEndpoints = this.getAtt("DomainEndpoints");
    this.attrDomainEndpointV2 = cdk.Token.asString(this.getAtt("DomainEndpointV2", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrServiceSoftwareOptions = this.getAtt("ServiceSoftwareOptions");
    this.attrServiceSoftwareOptionsAutomatedUpdateDate = cdk.Token.asString(this.getAtt("ServiceSoftwareOptions.AutomatedUpdateDate", cdk.ResolutionTypeHint.STRING));
    this.attrServiceSoftwareOptionsCancellable = this.getAtt("ServiceSoftwareOptions.Cancellable");
    this.attrServiceSoftwareOptionsCurrentVersion = cdk.Token.asString(this.getAtt("ServiceSoftwareOptions.CurrentVersion", cdk.ResolutionTypeHint.STRING));
    this.attrServiceSoftwareOptionsDescription = cdk.Token.asString(this.getAtt("ServiceSoftwareOptions.Description", cdk.ResolutionTypeHint.STRING));
    this.attrServiceSoftwareOptionsNewVersion = cdk.Token.asString(this.getAtt("ServiceSoftwareOptions.NewVersion", cdk.ResolutionTypeHint.STRING));
    this.attrServiceSoftwareOptionsOptionalDeployment = this.getAtt("ServiceSoftwareOptions.OptionalDeployment");
    this.attrServiceSoftwareOptionsUpdateAvailable = this.getAtt("ServiceSoftwareOptions.UpdateAvailable");
    this.attrServiceSoftwareOptionsUpdateStatus = cdk.Token.asString(this.getAtt("ServiceSoftwareOptions.UpdateStatus", cdk.ResolutionTypeHint.STRING));
    this.accessPolicies = props.accessPolicies;
    this.advancedOptions = props.advancedOptions;
    this.advancedSecurityOptions = props.advancedSecurityOptions;
    this.clusterConfig = props.clusterConfig;
    this.cognitoOptions = props.cognitoOptions;
    this.domainArn = props.domainArn;
    this.domainEndpointOptions = props.domainEndpointOptions;
    this.domainName = props.domainName;
    this.ebsOptions = props.ebsOptions;
    this.encryptionAtRestOptions = props.encryptionAtRestOptions;
    this.engineVersion = props.engineVersion;
    this.ipAddressType = props.ipAddressType;
    this.logPublishingOptions = props.logPublishingOptions;
    this.nodeToNodeEncryptionOptions = props.nodeToNodeEncryptionOptions;
    this.offPeakWindowOptions = props.offPeakWindowOptions;
    this.snapshotOptions = props.snapshotOptions;
    this.softwareUpdateOptions = props.softwareUpdateOptions;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::OpenSearchService::Domain", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.vpcOptions = props.vpcOptions;
    if ((this.node.scope != null && cdk.Resource.isResource(this.node.scope))) {
      this.node.addValidation({
        "validate": () => ((this.cfnOptions.deletionPolicy === undefined) ? ["'AWS::OpenSearchService::Domain' is a stateful resource type, and you must specify a Removal Policy for it. Call 'resource.applyRemovalPolicy()'."] : [])
      });
    }
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accessPolicies": this.accessPolicies,
      "advancedOptions": this.advancedOptions,
      "advancedSecurityOptions": this.advancedSecurityOptions,
      "clusterConfig": this.clusterConfig,
      "cognitoOptions": this.cognitoOptions,
      "domainArn": this.domainArn,
      "domainEndpointOptions": this.domainEndpointOptions,
      "domainName": this.domainName,
      "ebsOptions": this.ebsOptions,
      "encryptionAtRestOptions": this.encryptionAtRestOptions,
      "engineVersion": this.engineVersion,
      "ipAddressType": this.ipAddressType,
      "logPublishingOptions": this.logPublishingOptions,
      "nodeToNodeEncryptionOptions": this.nodeToNodeEncryptionOptions,
      "offPeakWindowOptions": this.offPeakWindowOptions,
      "snapshotOptions": this.snapshotOptions,
      "softwareUpdateOptions": this.softwareUpdateOptions,
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
   * Options for configuring service software updates for a domain.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-softwareupdateoptions.html
   */
  export interface SoftwareUpdateOptionsProperty {
    /**
     * Specifies whether automatic service software updates are enabled for the domain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-softwareupdateoptions.html#cfn-opensearchservice-domain-softwareupdateoptions-autosoftwareupdateenabled
     */
    readonly autoSoftwareUpdateEnabled?: boolean | cdk.IResolvable;
  }

  /**
   * Specifies whether the OpenSearch Service domain publishes application, search slow logs, or index slow logs to Amazon CloudWatch.
   *
   * Each option must be an object of name `SEARCH_SLOW_LOGS` , `ES_APPLICATION_LOGS` , `INDEX_SLOW_LOGS` , or `AUDIT_LOGS` depending on the type of logs you want to publish. For the full syntax, see the [examples](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#aws-resource-opensearchservice-domain--examples) .
   *
   * Before you enable log publishing, you need to create a CloudWatch log group and provide OpenSearch Service the correct permissions to write to it. To learn more, see [Enabling log publishing ( AWS CloudFormation)](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/createdomain-configure-slow-logs.html#createdomain-configure-slow-logs-cfn) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-logpublishingoption.html
   */
  export interface LogPublishingOptionProperty {
    /**
     * Specifies the CloudWatch log group to publish to.
     *
     * Required if you enable log publishing.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-logpublishingoption.html#cfn-opensearchservice-domain-logpublishingoption-cloudwatchlogsloggrouparn
     */
    readonly cloudWatchLogsLogGroupArn?: string;

    /**
     * If `true` , enables the publishing of logs to CloudWatch.
     *
     * Default: `false` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-logpublishingoption.html#cfn-opensearchservice-domain-logpublishingoption-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;
  }

  /**
   * *DEPRECATED* .
   *
   * This setting is only relevant to domains running legacy Elasticsearch OSS versions earlier than 5.3. It does not apply to OpenSearch domains.
   *
   * The automated snapshot configuration for the OpenSearch Service domain indexes.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-snapshotoptions.html
   */
  export interface SnapshotOptionsProperty {
    /**
     * The hour in UTC during which the service takes an automated daily snapshot of the indexes in the OpenSearch Service domain.
     *
     * For example, if you specify 0, OpenSearch Service takes an automated snapshot everyday between midnight and 1 am. You can specify a value between 0 and 23.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-snapshotoptions.html#cfn-opensearchservice-domain-snapshotoptions-automatedsnapshotstarthour
     */
    readonly automatedSnapshotStartHour?: number;
  }

  /**
   * The virtual private cloud (VPC) configuration for the OpenSearch Service domain.
   *
   * For more information, see [Launching your Amazon OpenSearch Service domains using a VPC](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/vpc.html) in the *Amazon OpenSearch Service Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-vpcoptions.html
   */
  export interface VPCOptionsProperty {
    /**
     * The list of security group IDs that are associated with the VPC endpoints for the domain.
     *
     * If you don't provide a security group ID, OpenSearch Service uses the default security group for the VPC. To learn more, see [Security groups for your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html) in the *Amazon VPC User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-vpcoptions.html#cfn-opensearchservice-domain-vpcoptions-securitygroupids
     */
    readonly securityGroupIds?: Array<string>;

    /**
     * Provide one subnet ID for each Availability Zone that your domain uses.
     *
     * For example, you must specify three subnet IDs for a three-AZ domain. To learn more, see [VPCs and subnets](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Subnets.html) in the *Amazon VPC User Guide* .
     *
     * If you specify more than one subnet, you must also configure `ZoneAwarenessEnabled` and `ZoneAwarenessConfig` within [ClusterConfig](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-clusterconfig.html) , otherwise you'll see the error "You must specify exactly one subnet" during template creation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-vpcoptions.html#cfn-opensearchservice-domain-vpcoptions-subnetids
     */
    readonly subnetIds?: Array<string>;
  }

  /**
   * Specifies options for node-to-node encryption.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-nodetonodeencryptionoptions.html
   */
  export interface NodeToNodeEncryptionOptionsProperty {
    /**
     * Specifies to enable or disable node-to-node encryption on the domain.
     *
     * Required if you enable fine-grained access control in [AdvancedSecurityOptionsInput](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-advancedsecurityoptionsinput.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-nodetonodeencryptionoptions.html#cfn-opensearchservice-domain-nodetonodeencryptionoptions-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;
  }

  /**
   * Specifies additional options for the domain endpoint, such as whether to require HTTPS for all traffic or whether to use a custom endpoint rather than the default endpoint.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-domainendpointoptions.html
   */
  export interface DomainEndpointOptionsProperty {
    /**
     * The fully qualified URL for your custom endpoint.
     *
     * Required if you enabled a custom endpoint for the domain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-domainendpointoptions.html#cfn-opensearchservice-domain-domainendpointoptions-customendpoint
     */
    readonly customEndpoint?: string;

    /**
     * The AWS Certificate Manager ARN for your domain's SSL/TLS certificate.
     *
     * Required if you enabled a custom endpoint for the domain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-domainendpointoptions.html#cfn-opensearchservice-domain-domainendpointoptions-customendpointcertificatearn
     */
    readonly customEndpointCertificateArn?: string;

    /**
     * True to enable a custom endpoint for the domain.
     *
     * If enabled, you must also provide values for `CustomEndpoint` and `CustomEndpointCertificateArn` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-domainendpointoptions.html#cfn-opensearchservice-domain-domainendpointoptions-customendpointenabled
     */
    readonly customEndpointEnabled?: boolean | cdk.IResolvable;

    /**
     * True to require that all traffic to the domain arrive over HTTPS.
     *
     * Required if you enable fine-grained access control in [AdvancedSecurityOptions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-advancedsecurityoptionsinput.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-domainendpointoptions.html#cfn-opensearchservice-domain-domainendpointoptions-enforcehttps
     */
    readonly enforceHttps?: boolean | cdk.IResolvable;

    /**
     * The minimum TLS version required for traffic to the domain. Valid values are TLS 1.3 (recommended) or 1.2:.
     *
     * - `Policy-Min-TLS-1-0-2019-07`
     * - `Policy-Min-TLS-1-2-2019-07`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-domainendpointoptions.html#cfn-opensearchservice-domain-domainendpointoptions-tlssecuritypolicy
     */
    readonly tlsSecurityPolicy?: string;
  }

  /**
   * Configures OpenSearch Service to use Amazon Cognito authentication for OpenSearch Dashboards.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-cognitooptions.html
   */
  export interface CognitoOptionsProperty {
    /**
     * Whether to enable or disable Amazon Cognito authentication for OpenSearch Dashboards.
     *
     * See [Amazon Cognito authentication for OpenSearch Dashboards](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/cognito-auth.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-cognitooptions.html#cfn-opensearchservice-domain-cognitooptions-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * The Amazon Cognito identity pool ID that you want OpenSearch Service to use for OpenSearch Dashboards authentication.
     *
     * Required if you enabled Cognito Authentication for OpenSearch Dashboards.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-cognitooptions.html#cfn-opensearchservice-domain-cognitooptions-identitypoolid
     */
    readonly identityPoolId?: string;

    /**
     * The `AmazonOpenSearchServiceCognitoAccess` role that allows OpenSearch Service to configure your user pool and identity pool.
     *
     * Required if you enabled Cognito Authentication for OpenSearch Dashboards.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-cognitooptions.html#cfn-opensearchservice-domain-cognitooptions-rolearn
     */
    readonly roleArn?: string;

    /**
     * The Amazon Cognito user pool ID that you want OpenSearch Service to use for OpenSearch Dashboards authentication.
     *
     * Required if you enabled Cognito Authentication for OpenSearch Dashboards.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-cognitooptions.html#cfn-opensearchservice-domain-cognitooptions-userpoolid
     */
    readonly userPoolId?: string;
  }

  /**
   * Specifies options for fine-grained access control.
   *
   * If you specify advanced security options, you must also enable node-to-node encryption ( [NodeToNodeEncryptionOptions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-nodetonodeencryptionoptions.html) ) and encryption at rest ( [EncryptionAtRestOptions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-encryptionatrestoptions.html) ). You must also enable `EnforceHTTPS` within [DomainEndpointOptions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-domainendpointoptions.html) , which requires HTTPS for all traffic to the domain.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-advancedsecurityoptionsinput.html
   */
  export interface AdvancedSecurityOptionsInputProperty {
    /**
     * Date and time when the migration period will be disabled.
     *
     * Only necessary when [enabling fine-grained access control on an existing domain](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/fgac.html#fgac-enabling-existing) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-advancedsecurityoptionsinput.html#cfn-opensearchservice-domain-advancedsecurityoptionsinput-anonymousauthdisabledate
     */
    readonly anonymousAuthDisableDate?: string;

    /**
     * True to enable a 30-day migration period during which administrators can create role mappings.
     *
     * Only necessary when [enabling fine-grained access control on an existing domain](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/fgac.html#fgac-enabling-existing) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-advancedsecurityoptionsinput.html#cfn-opensearchservice-domain-advancedsecurityoptionsinput-anonymousauthenabled
     */
    readonly anonymousAuthEnabled?: boolean | cdk.IResolvable;

    /**
     * True to enable fine-grained access control.
     *
     * You must also enable encryption of data at rest and node-to-node encryption. See [Fine-grained access control in Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/fgac.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-advancedsecurityoptionsinput.html#cfn-opensearchservice-domain-advancedsecurityoptionsinput-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * True to enable the internal user database.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-advancedsecurityoptionsinput.html#cfn-opensearchservice-domain-advancedsecurityoptionsinput-internaluserdatabaseenabled
     */
    readonly internalUserDatabaseEnabled?: boolean | cdk.IResolvable;

    /**
     * Specifies information about the master user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-advancedsecurityoptionsinput.html#cfn-opensearchservice-domain-advancedsecurityoptionsinput-masteruseroptions
     */
    readonly masterUserOptions?: cdk.IResolvable | CfnDomain.MasterUserOptionsProperty;

    /**
     * Container for information about the SAML configuration for OpenSearch Dashboards.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-advancedsecurityoptionsinput.html#cfn-opensearchservice-domain-advancedsecurityoptionsinput-samloptions
     */
    readonly samlOptions?: cdk.IResolvable | CfnDomain.SAMLOptionsProperty;
  }

  /**
   * Container for information about the SAML configuration for OpenSearch Dashboards.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-samloptions.html
   */
  export interface SAMLOptionsProperty {
    /**
     * True to enable SAML authentication for a domain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-samloptions.html#cfn-opensearchservice-domain-samloptions-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * The SAML Identity Provider's information.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-samloptions.html#cfn-opensearchservice-domain-samloptions-idp
     */
    readonly idp?: CfnDomain.IdpProperty | cdk.IResolvable;

    /**
     * The backend role that the SAML master user is mapped to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-samloptions.html#cfn-opensearchservice-domain-samloptions-masterbackendrole
     */
    readonly masterBackendRole?: string;

    /**
     * The SAML master user name, which is stored in the domain's internal user database.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-samloptions.html#cfn-opensearchservice-domain-samloptions-masterusername
     */
    readonly masterUserName?: string;

    /**
     * Element of the SAML assertion to use for backend roles.
     *
     * Default is `roles` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-samloptions.html#cfn-opensearchservice-domain-samloptions-roleskey
     */
    readonly rolesKey?: string;

    /**
     * The duration, in minutes, after which a user session becomes inactive.
     *
     * Acceptable values are between 1 and 1440, and the default value is 60.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-samloptions.html#cfn-opensearchservice-domain-samloptions-sessiontimeoutminutes
     */
    readonly sessionTimeoutMinutes?: number;

    /**
     * Element of the SAML assertion to use for the user name.
     *
     * Default is `NameID` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-samloptions.html#cfn-opensearchservice-domain-samloptions-subjectkey
     */
    readonly subjectKey?: string;
  }

  /**
   * The SAML Identity Provider's information.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-idp.html
   */
  export interface IdpProperty {
    /**
     * The unique entity ID of the application in the SAML identity provider.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-idp.html#cfn-opensearchservice-domain-idp-entityid
     */
    readonly entityId: string;

    /**
     * The metadata of the SAML application, in XML format.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-idp.html#cfn-opensearchservice-domain-idp-metadatacontent
     */
    readonly metadataContent: string;
  }

  /**
   * Specifies information about the master user.
   *
   * Required if if `InternalUserDatabaseEnabled` is true in [AdvancedSecurityOptions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-advancedsecurityoptionsinput.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-masteruseroptions.html
   */
  export interface MasterUserOptionsProperty {
    /**
     * Amazon Resource Name (ARN) for the master user.
     *
     * The ARN can point to an IAM user or role. This property is required for Amazon Cognito to work, and it must match the role configured for Cognito. Only specify if `InternalUserDatabaseEnabled` is false in [AdvancedSecurityOptionsInput](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-advancedsecurityoptionsinput.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-masteruseroptions.html#cfn-opensearchservice-domain-masteruseroptions-masteruserarn
     */
    readonly masterUserArn?: string;

    /**
     * Username for the master user. Only specify if `InternalUserDatabaseEnabled` is true in [AdvancedSecurityOptionsInput](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-advancedsecurityoptionsinput.html) .
     *
     * If you don't want to specify this value directly within the template, you can use a [dynamic reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html) instead.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-masteruseroptions.html#cfn-opensearchservice-domain-masteruseroptions-masterusername
     */
    readonly masterUserName?: string;

    /**
     * Password for the master user. Only specify if `InternalUserDatabaseEnabled` is true in [AdvancedSecurityOptionsInput](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-advancedsecurityoptionsinput.html) .
     *
     * If you don't want to specify this value directly within the template, you can use a [dynamic reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html) instead.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-masteruseroptions.html#cfn-opensearchservice-domain-masteruseroptions-masteruserpassword
     */
    readonly masterUserPassword?: string;
  }

  /**
   * The configurations of Amazon Elastic Block Store (Amazon EBS) volumes that are attached to data nodes in the OpenSearch Service domain.
   *
   * For more information, see [EBS volume size limits](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/limits.html#ebsresource) in the *Amazon OpenSearch Service Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-ebsoptions.html
   */
  export interface EBSOptionsProperty {
    /**
     * Specifies whether Amazon EBS volumes are attached to data nodes in the OpenSearch Service domain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-ebsoptions.html#cfn-opensearchservice-domain-ebsoptions-ebsenabled
     */
    readonly ebsEnabled?: boolean | cdk.IResolvable;

    /**
     * The number of I/O operations per second (IOPS) that the volume supports.
     *
     * This property applies only to the `gp3` and provisioned IOPS EBS volume types.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-ebsoptions.html#cfn-opensearchservice-domain-ebsoptions-iops
     */
    readonly iops?: number;

    /**
     * The throughput (in MiB/s) of the EBS volumes attached to data nodes.
     *
     * Applies only to the `gp3` volume type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-ebsoptions.html#cfn-opensearchservice-domain-ebsoptions-throughput
     */
    readonly throughput?: number;

    /**
     * The size (in GiB) of the EBS volume for each data node.
     *
     * The minimum and maximum size of an EBS volume depends on the EBS volume type and the instance type to which it is attached. For more information, see [EBS volume size limits](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/limits.html#ebsresource) in the *Amazon OpenSearch Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-ebsoptions.html#cfn-opensearchservice-domain-ebsoptions-volumesize
     */
    readonly volumeSize?: number;

    /**
     * The EBS volume type to use with the OpenSearch Service domain.
     *
     * If you choose `gp3` , you must also specify values for `Iops` and `Throughput` . For more information about each type, see [Amazon EBS volume types](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html) in the *Amazon EC2 User Guide for Linux Instances* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-ebsoptions.html#cfn-opensearchservice-domain-ebsoptions-volumetype
     */
    readonly volumeType?: string;
  }

  /**
   * Whether the domain should encrypt data at rest, and if so, the AWS Key Management Service key to use.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-encryptionatrestoptions.html
   */
  export interface EncryptionAtRestOptionsProperty {
    /**
     * Specify `true` to enable encryption at rest. Required if you enable fine-grained access control in [AdvancedSecurityOptionsInput](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-advancedsecurityoptionsinput.html) .
     *
     * If no encryption at rest options were initially specified in the template, updating this property by adding it causes no interruption. However, if you change this property after it's already been set within a template, the domain is deleted and recreated in order to modify the property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-encryptionatrestoptions.html#cfn-opensearchservice-domain-encryptionatrestoptions-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * The KMS key ID. Takes the form `1a2a3a4-1a2a-3a4a-5a6a-1a2a3a4a5a6a` . Required if you enable encryption at rest.
     *
     * You can also use `keyAlias` as a value.
     *
     * If no encryption at rest options were initially specified in the template, updating this property by adding it causes no interruption. However, if you change this property after it's already been set within a template, the domain is deleted and recreated in order to modify the property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-encryptionatrestoptions.html#cfn-opensearchservice-domain-encryptionatrestoptions-kmskeyid
     */
    readonly kmsKeyId?: string;
  }

  /**
   * Off-peak window settings for the domain.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-offpeakwindowoptions.html
   */
  export interface OffPeakWindowOptionsProperty {
    /**
     * Specifies whether off-peak window settings are enabled for the domain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-offpeakwindowoptions.html#cfn-opensearchservice-domain-offpeakwindowoptions-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * Off-peak window settings for the domain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-offpeakwindowoptions.html#cfn-opensearchservice-domain-offpeakwindowoptions-offpeakwindow
     */
    readonly offPeakWindow?: cdk.IResolvable | CfnDomain.OffPeakWindowProperty;
  }

  /**
   * A custom 10-hour, low-traffic window during which OpenSearch Service can perform mandatory configuration changes on the domain.
   *
   * These actions can include scheduled service software updates and blue/green Auto-Tune enhancements. OpenSearch Service will schedule these actions during the window that you specify. If you don't specify a window start time, it defaults to 10:00 P.M. local time.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-offpeakwindow.html
   */
  export interface OffPeakWindowProperty {
    /**
     * The desired start time for an off-peak maintenance window.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-offpeakwindow.html#cfn-opensearchservice-domain-offpeakwindow-windowstarttime
     */
    readonly windowStartTime?: cdk.IResolvable | CfnDomain.WindowStartTimeProperty;
  }

  /**
   * A custom start time for the off-peak window, in Coordinated Universal Time (UTC).
   *
   * The window length will always be 10 hours, so you can't specify an end time. For example, if you specify 11:00 P.M. UTC as a start time, the end time will automatically be set to 9:00 A.M.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-windowstarttime.html
   */
  export interface WindowStartTimeProperty {
    /**
     * The start hour of the window in Coordinated Universal Time (UTC), using 24-hour time.
     *
     * For example, 17 refers to 5:00 P.M. UTC. The minimum value is 0 and the maximum value is 23.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-windowstarttime.html#cfn-opensearchservice-domain-windowstarttime-hours
     */
    readonly hours: number;

    /**
     * The start minute of the window, in UTC.
     *
     * The minimum value is 0 and the maximum value is 59.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-windowstarttime.html#cfn-opensearchservice-domain-windowstarttime-minutes
     */
    readonly minutes: number;
  }

  /**
   * The cluster configuration for the OpenSearch Service domain.
   *
   * You can specify options such as the instance type and the number of instances. For more information, see [Creating and managing Amazon OpenSearch Service domains](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/createupdatedomains.html) in the *Amazon OpenSearch Service Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-clusterconfig.html
   */
  export interface ClusterConfigProperty {
    /**
     * The number of instances to use for the master node.
     *
     * If you specify this property, you must specify `true` for the `DedicatedMasterEnabled` property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-clusterconfig.html#cfn-opensearchservice-domain-clusterconfig-dedicatedmastercount
     */
    readonly dedicatedMasterCount?: number;

    /**
     * Indicates whether to use a dedicated master node for the OpenSearch Service domain.
     *
     * A dedicated master node is a cluster node that performs cluster management tasks, but doesn't hold data or respond to data upload requests. Dedicated master nodes offload cluster management tasks to increase the stability of your search clusters. See [Dedicated master nodes in Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/managedomains-dedicatedmasternodes.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-clusterconfig.html#cfn-opensearchservice-domain-clusterconfig-dedicatedmasterenabled
     */
    readonly dedicatedMasterEnabled?: boolean | cdk.IResolvable;

    /**
     * The hardware configuration of the computer that hosts the dedicated master node, such as `m3.medium.search` . If you specify this property, you must specify `true` for the `DedicatedMasterEnabled` property. For valid values, see [Supported instance types in Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/supported-instance-types.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-clusterconfig.html#cfn-opensearchservice-domain-clusterconfig-dedicatedmastertype
     */
    readonly dedicatedMasterType?: string;

    /**
     * The number of data nodes (instances) to use in the OpenSearch Service domain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-clusterconfig.html#cfn-opensearchservice-domain-clusterconfig-instancecount
     */
    readonly instanceCount?: number;

    /**
     * The instance type for your data nodes, such as `m3.medium.search` . For valid values, see [Supported instance types in Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/supported-instance-types.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-clusterconfig.html#cfn-opensearchservice-domain-clusterconfig-instancetype
     */
    readonly instanceType?: string;

    /**
     * Indicates whether Multi-AZ with Standby deployment option is enabled.
     *
     * For more information, see [Multi-AZ with Standby](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/managedomains-multiaz.html#managedomains-za-standby) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-clusterconfig.html#cfn-opensearchservice-domain-clusterconfig-multiazwithstandbyenabled
     */
    readonly multiAzWithStandbyEnabled?: boolean | cdk.IResolvable;

    /**
     * The number of warm nodes in the cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-clusterconfig.html#cfn-opensearchservice-domain-clusterconfig-warmcount
     */
    readonly warmCount?: number;

    /**
     * Whether to enable UltraWarm storage for the cluster.
     *
     * See [UltraWarm storage for Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/ultrawarm.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-clusterconfig.html#cfn-opensearchservice-domain-clusterconfig-warmenabled
     */
    readonly warmEnabled?: boolean | cdk.IResolvable;

    /**
     * The instance type for the cluster's warm nodes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-clusterconfig.html#cfn-opensearchservice-domain-clusterconfig-warmtype
     */
    readonly warmType?: string;

    /**
     * Specifies zone awareness configuration options.
     *
     * Only use if `ZoneAwarenessEnabled` is `true` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-clusterconfig.html#cfn-opensearchservice-domain-clusterconfig-zoneawarenessconfig
     */
    readonly zoneAwarenessConfig?: cdk.IResolvable | CfnDomain.ZoneAwarenessConfigProperty;

    /**
     * Indicates whether to enable zone awareness for the OpenSearch Service domain.
     *
     * When you enable zone awareness, OpenSearch Service allocates the nodes and replica index shards that belong to a cluster across two Availability Zones (AZs) in the same region to prevent data loss and minimize downtime in the event of node or data center failure. Don't enable zone awareness if your cluster has no replica index shards or is a single-node cluster. For more information, see [Configuring a multi-AZ domain in Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/managedomains-multiaz.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-clusterconfig.html#cfn-opensearchservice-domain-clusterconfig-zoneawarenessenabled
     */
    readonly zoneAwarenessEnabled?: boolean | cdk.IResolvable;
  }

  /**
   * Specifies zone awareness configuration options.
   *
   * Only use if `ZoneAwarenessEnabled` is `true` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-zoneawarenessconfig.html
   */
  export interface ZoneAwarenessConfigProperty {
    /**
     * If you enabled multiple Availability Zones (AZs), the number of AZs that you want the domain to use.
     *
     * Valid values are `2` and `3` . Default is 2.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-zoneawarenessconfig.html#cfn-opensearchservice-domain-zoneawarenessconfig-availabilityzonecount
     */
    readonly availabilityZoneCount?: number;
  }

  /**
   * The current status of the service software for an Amazon OpenSearch Service domain.
   *
   * For more information, see [Service software updates in Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/service-software.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-servicesoftwareoptions.html
   */
  export interface ServiceSoftwareOptionsProperty {
    /**
     * The timestamp, in Epoch time, until which you can manually request a service software update.
     *
     * After this date, we automatically update your service software.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-servicesoftwareoptions.html#cfn-opensearchservice-domain-servicesoftwareoptions-automatedupdatedate
     */
    readonly automatedUpdateDate?: string;

    /**
     * True if you're able to cancel your service software version update.
     *
     * False if you can't cancel your service software update.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-servicesoftwareoptions.html#cfn-opensearchservice-domain-servicesoftwareoptions-cancellable
     */
    readonly cancellable?: boolean | cdk.IResolvable;

    /**
     * The current service software version present on the domain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-servicesoftwareoptions.html#cfn-opensearchservice-domain-servicesoftwareoptions-currentversion
     */
    readonly currentVersion?: string;

    /**
     * A description of the service software update status.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-servicesoftwareoptions.html#cfn-opensearchservice-domain-servicesoftwareoptions-description
     */
    readonly description?: string;

    /**
     * The new service software version, if one is available.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-servicesoftwareoptions.html#cfn-opensearchservice-domain-servicesoftwareoptions-newversion
     */
    readonly newVersion?: string;

    /**
     * True if a service software is never automatically updated.
     *
     * False if a service software is automatically updated after the automated update date.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-servicesoftwareoptions.html#cfn-opensearchservice-domain-servicesoftwareoptions-optionaldeployment
     */
    readonly optionalDeployment?: boolean | cdk.IResolvable;

    /**
     * True if you're able to update your service software version.
     *
     * False if you can't update your service software version.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-servicesoftwareoptions.html#cfn-opensearchservice-domain-servicesoftwareoptions-updateavailable
     */
    readonly updateAvailable?: boolean | cdk.IResolvable;

    /**
     * The status of your service software update.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-servicesoftwareoptions.html#cfn-opensearchservice-domain-servicesoftwareoptions-updatestatus
     */
    readonly updateStatus?: string;
  }
}

/**
 * Properties for defining a `CfnDomain`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html
 */
export interface CfnDomainProps {
  /**
   * An AWS Identity and Access Management ( IAM ) policy document that specifies who can access the OpenSearch Service domain and their permissions.
   *
   * For more information, see [Configuring access policies](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/ac.html#ac-creating) in the *Amazon OpenSearch Service Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-accesspolicies
   */
  readonly accessPolicies?: any | cdk.IResolvable;

  /**
   * Additional options to specify for the OpenSearch Service domain.
   *
   * For more information, see [AdvancedOptions](https://docs.aws.amazon.com/opensearch-service/latest/APIReference/API_CreateDomain.html#API_CreateDomain_RequestBody) in the OpenSearch Service API reference.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-advancedoptions
   */
  readonly advancedOptions?: cdk.IResolvable | Record<string, string>;

  /**
   * Specifies options for fine-grained access control and SAML authentication.
   *
   * If you specify advanced security options, you must also enable node-to-node encryption ( [NodeToNodeEncryptionOptions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-nodetonodeencryptionoptions.html) ) and encryption at rest ( [EncryptionAtRestOptions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-encryptionatrestoptions.html) ). You must also enable `EnforceHTTPS` within [DomainEndpointOptions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opensearchservice-domain-domainendpointoptions.html) , which requires HTTPS for all traffic to the domain.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-advancedsecurityoptions
   */
  readonly advancedSecurityOptions?: CfnDomain.AdvancedSecurityOptionsInputProperty | cdk.IResolvable;

  /**
   * Container for the cluster configuration of a domain.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-clusterconfig
   */
  readonly clusterConfig?: CfnDomain.ClusterConfigProperty | cdk.IResolvable;

  /**
   * Configures OpenSearch Service to use Amazon Cognito authentication for OpenSearch Dashboards.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-cognitooptions
   */
  readonly cognitoOptions?: CfnDomain.CognitoOptionsProperty | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-domainarn
   */
  readonly domainArn?: string;

  /**
   * Specifies additional options for the domain endpoint, such as whether to require HTTPS for all traffic or whether to use a custom endpoint rather than the default endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-domainendpointoptions
   */
  readonly domainEndpointOptions?: CfnDomain.DomainEndpointOptionsProperty | cdk.IResolvable;

  /**
   * A name for the OpenSearch Service domain.
   *
   * The name must have a minimum length of 3 and a maximum length of 28. If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the domain name. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
   *
   * Required when creating a new domain.
   *
   * > If you specify a name, you can't perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-domainname
   */
  readonly domainName?: string;

  /**
   * The configurations of Amazon Elastic Block Store (Amazon EBS) volumes that are attached to data nodes in the OpenSearch Service domain.
   *
   * For more information, see [EBS volume size limits](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/limits.html#ebsresource) in the *Amazon OpenSearch Service Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-ebsoptions
   */
  readonly ebsOptions?: CfnDomain.EBSOptionsProperty | cdk.IResolvable;

  /**
   * Whether the domain should encrypt data at rest, and if so, the AWS KMS key to use.
   *
   * See [Encryption of data at rest for Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/encryption-at-rest.html) .
   *
   * If no encryption at rest options were initially specified in the template, updating this property by adding it causes no interruption. However, if you change this property after it's already been set within a template, the domain is deleted and recreated in order to modify the property.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-encryptionatrestoptions
   */
  readonly encryptionAtRestOptions?: CfnDomain.EncryptionAtRestOptionsProperty | cdk.IResolvable;

  /**
   * The version of OpenSearch to use.
   *
   * The value must be in the format `OpenSearch_X.Y` or `Elasticsearch_X.Y` . If not specified, the latest version of OpenSearch is used. For information about the versions that OpenSearch Service supports, see [Supported versions of OpenSearch and Elasticsearch](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/what-is.html#choosing-version) in the *Amazon OpenSearch Service Developer Guide* .
   *
   * If you set the [EnableVersionUpgrade](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatepolicy.html#cfn-attributes-updatepolicy-upgradeopensearchdomain) update policy to `true` , you can update `EngineVersion` without interruption. When `EnableVersionUpgrade` is set to `false` , or is not specified, updating `EngineVersion` results in [replacement](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-replacement) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-engineversion
   */
  readonly engineVersion?: string;

  /**
   * Choose either dual stack or IPv4 as your IP address type.
   *
   * Dual stack allows you to share domain resources across IPv4 and IPv6 address types, and is the recommended option. If you set your IP address type to dual stack, you can't change your address type later.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-ipaddresstype
   */
  readonly ipAddressType?: string;

  /**
   * An object with one or more of the following keys: `SEARCH_SLOW_LOGS` , `ES_APPLICATION_LOGS` , `INDEX_SLOW_LOGS` , `AUDIT_LOGS` , depending on the types of logs you want to publish.
   *
   * Each key needs a valid `LogPublishingOption` value. For the full syntax, see the [examples](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#aws-resource-opensearchservice-domain--examples) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-logpublishingoptions
   */
  readonly logPublishingOptions?: cdk.IResolvable | Record<string, cdk.IResolvable | CfnDomain.LogPublishingOptionProperty>;

  /**
   * Specifies whether node-to-node encryption is enabled.
   *
   * See [Node-to-node encryption for Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/ntn.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-nodetonodeencryptionoptions
   */
  readonly nodeToNodeEncryptionOptions?: cdk.IResolvable | CfnDomain.NodeToNodeEncryptionOptionsProperty;

  /**
   * Options for a domain's off-peak window, during which OpenSearch Service can perform mandatory configuration changes on the domain.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-offpeakwindowoptions
   */
  readonly offPeakWindowOptions?: cdk.IResolvable | CfnDomain.OffPeakWindowOptionsProperty;

  /**
   * *DEPRECATED* .
   *
   * The automated snapshot configuration for the OpenSearch Service domain indexes.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-snapshotoptions
   */
  readonly snapshotOptions?: cdk.IResolvable | CfnDomain.SnapshotOptionsProperty;

  /**
   * Service software update options for the domain.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-softwareupdateoptions
   */
  readonly softwareUpdateOptions?: cdk.IResolvable | CfnDomain.SoftwareUpdateOptionsProperty;

  /**
   * An arbitrary set of tags (key–value pairs) to associate with the OpenSearch Service domain.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The virtual private cloud (VPC) configuration for the OpenSearch Service domain.
   *
   * For more information, see [Launching your Amazon OpenSearch Service domains within a VPC](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/vpc.html) in the *Amazon OpenSearch Service Developer Guide* .
   *
   * If you remove this entity altogether, along with its associated properties, it causes a replacement. You might encounter this scenario if you're updating your security configuration from a VPC to a public endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opensearchservice-domain.html#cfn-opensearchservice-domain-vpcoptions
   */
  readonly vpcOptions?: cdk.IResolvable | CfnDomain.VPCOptionsProperty;
}

/**
 * Determine whether the given properties match those of a `SoftwareUpdateOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `SoftwareUpdateOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainSoftwareUpdateOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoSoftwareUpdateEnabled", cdk.validateBoolean)(properties.autoSoftwareUpdateEnabled));
  return errors.wrap("supplied properties not correct for \"SoftwareUpdateOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainSoftwareUpdateOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainSoftwareUpdateOptionsPropertyValidator(properties).assertSuccess();
  return {
    "AutoSoftwareUpdateEnabled": cdk.booleanToCloudFormation(properties.autoSoftwareUpdateEnabled)
  };
}

// @ts-ignore TS6133
function CfnDomainSoftwareUpdateOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDomain.SoftwareUpdateOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.SoftwareUpdateOptionsProperty>();
  ret.addPropertyResult("autoSoftwareUpdateEnabled", "AutoSoftwareUpdateEnabled", (properties.AutoSoftwareUpdateEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoSoftwareUpdateEnabled) : undefined));
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
 * Determine whether the given properties match those of a `IdpProperty`
 *
 * @param properties - the TypeScript properties of a `IdpProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainIdpPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("entityId", cdk.requiredValidator)(properties.entityId));
  errors.collect(cdk.propertyValidator("entityId", cdk.validateString)(properties.entityId));
  errors.collect(cdk.propertyValidator("metadataContent", cdk.requiredValidator)(properties.metadataContent));
  errors.collect(cdk.propertyValidator("metadataContent", cdk.validateString)(properties.metadataContent));
  return errors.wrap("supplied properties not correct for \"IdpProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainIdpPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainIdpPropertyValidator(properties).assertSuccess();
  return {
    "EntityId": cdk.stringToCloudFormation(properties.entityId),
    "MetadataContent": cdk.stringToCloudFormation(properties.metadataContent)
  };
}

// @ts-ignore TS6133
function CfnDomainIdpPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomain.IdpProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.IdpProperty>();
  ret.addPropertyResult("entityId", "EntityId", (properties.EntityId != null ? cfn_parse.FromCloudFormation.getString(properties.EntityId) : undefined));
  ret.addPropertyResult("metadataContent", "MetadataContent", (properties.MetadataContent != null ? cfn_parse.FromCloudFormation.getString(properties.MetadataContent) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SAMLOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `SAMLOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainSAMLOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("idp", CfnDomainIdpPropertyValidator)(properties.idp));
  errors.collect(cdk.propertyValidator("masterBackendRole", cdk.validateString)(properties.masterBackendRole));
  errors.collect(cdk.propertyValidator("masterUserName", cdk.validateString)(properties.masterUserName));
  errors.collect(cdk.propertyValidator("rolesKey", cdk.validateString)(properties.rolesKey));
  errors.collect(cdk.propertyValidator("sessionTimeoutMinutes", cdk.validateNumber)(properties.sessionTimeoutMinutes));
  errors.collect(cdk.propertyValidator("subjectKey", cdk.validateString)(properties.subjectKey));
  return errors.wrap("supplied properties not correct for \"SAMLOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainSAMLOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainSAMLOptionsPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "Idp": convertCfnDomainIdpPropertyToCloudFormation(properties.idp),
    "MasterBackendRole": cdk.stringToCloudFormation(properties.masterBackendRole),
    "MasterUserName": cdk.stringToCloudFormation(properties.masterUserName),
    "RolesKey": cdk.stringToCloudFormation(properties.rolesKey),
    "SessionTimeoutMinutes": cdk.numberToCloudFormation(properties.sessionTimeoutMinutes),
    "SubjectKey": cdk.stringToCloudFormation(properties.subjectKey)
  };
}

// @ts-ignore TS6133
function CfnDomainSAMLOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDomain.SAMLOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.SAMLOptionsProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("idp", "Idp", (properties.Idp != null ? CfnDomainIdpPropertyFromCloudFormation(properties.Idp) : undefined));
  ret.addPropertyResult("masterBackendRole", "MasterBackendRole", (properties.MasterBackendRole != null ? cfn_parse.FromCloudFormation.getString(properties.MasterBackendRole) : undefined));
  ret.addPropertyResult("masterUserName", "MasterUserName", (properties.MasterUserName != null ? cfn_parse.FromCloudFormation.getString(properties.MasterUserName) : undefined));
  ret.addPropertyResult("rolesKey", "RolesKey", (properties.RolesKey != null ? cfn_parse.FromCloudFormation.getString(properties.RolesKey) : undefined));
  ret.addPropertyResult("sessionTimeoutMinutes", "SessionTimeoutMinutes", (properties.SessionTimeoutMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.SessionTimeoutMinutes) : undefined));
  ret.addPropertyResult("subjectKey", "SubjectKey", (properties.SubjectKey != null ? cfn_parse.FromCloudFormation.getString(properties.SubjectKey) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
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
  errors.collect(cdk.propertyValidator("anonymousAuthDisableDate", cdk.validateString)(properties.anonymousAuthDisableDate));
  errors.collect(cdk.propertyValidator("anonymousAuthEnabled", cdk.validateBoolean)(properties.anonymousAuthEnabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("internalUserDatabaseEnabled", cdk.validateBoolean)(properties.internalUserDatabaseEnabled));
  errors.collect(cdk.propertyValidator("masterUserOptions", CfnDomainMasterUserOptionsPropertyValidator)(properties.masterUserOptions));
  errors.collect(cdk.propertyValidator("samlOptions", CfnDomainSAMLOptionsPropertyValidator)(properties.samlOptions));
  return errors.wrap("supplied properties not correct for \"AdvancedSecurityOptionsInputProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainAdvancedSecurityOptionsInputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainAdvancedSecurityOptionsInputPropertyValidator(properties).assertSuccess();
  return {
    "AnonymousAuthDisableDate": cdk.stringToCloudFormation(properties.anonymousAuthDisableDate),
    "AnonymousAuthEnabled": cdk.booleanToCloudFormation(properties.anonymousAuthEnabled),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "InternalUserDatabaseEnabled": cdk.booleanToCloudFormation(properties.internalUserDatabaseEnabled),
    "MasterUserOptions": convertCfnDomainMasterUserOptionsPropertyToCloudFormation(properties.masterUserOptions),
    "SAMLOptions": convertCfnDomainSAMLOptionsPropertyToCloudFormation(properties.samlOptions)
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
  ret.addPropertyResult("anonymousAuthDisableDate", "AnonymousAuthDisableDate", (properties.AnonymousAuthDisableDate != null ? cfn_parse.FromCloudFormation.getString(properties.AnonymousAuthDisableDate) : undefined));
  ret.addPropertyResult("anonymousAuthEnabled", "AnonymousAuthEnabled", (properties.AnonymousAuthEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AnonymousAuthEnabled) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("internalUserDatabaseEnabled", "InternalUserDatabaseEnabled", (properties.InternalUserDatabaseEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.InternalUserDatabaseEnabled) : undefined));
  ret.addPropertyResult("masterUserOptions", "MasterUserOptions", (properties.MasterUserOptions != null ? CfnDomainMasterUserOptionsPropertyFromCloudFormation(properties.MasterUserOptions) : undefined));
  ret.addPropertyResult("samlOptions", "SAMLOptions", (properties.SAMLOptions != null ? CfnDomainSAMLOptionsPropertyFromCloudFormation(properties.SAMLOptions) : undefined));
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
  errors.collect(cdk.propertyValidator("throughput", cdk.validateNumber)(properties.throughput));
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
    "Throughput": cdk.numberToCloudFormation(properties.throughput),
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
  ret.addPropertyResult("throughput", "Throughput", (properties.Throughput != null ? cfn_parse.FromCloudFormation.getNumber(properties.Throughput) : undefined));
  ret.addPropertyResult("volumeSize", "VolumeSize", (properties.VolumeSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.VolumeSize) : undefined));
  ret.addPropertyResult("volumeType", "VolumeType", (properties.VolumeType != null ? cfn_parse.FromCloudFormation.getString(properties.VolumeType) : undefined));
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
 * Determine whether the given properties match those of a `WindowStartTimeProperty`
 *
 * @param properties - the TypeScript properties of a `WindowStartTimeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainWindowStartTimePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("hours", cdk.requiredValidator)(properties.hours));
  errors.collect(cdk.propertyValidator("hours", cdk.validateNumber)(properties.hours));
  errors.collect(cdk.propertyValidator("minutes", cdk.requiredValidator)(properties.minutes));
  errors.collect(cdk.propertyValidator("minutes", cdk.validateNumber)(properties.minutes));
  return errors.wrap("supplied properties not correct for \"WindowStartTimeProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainWindowStartTimePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainWindowStartTimePropertyValidator(properties).assertSuccess();
  return {
    "Hours": cdk.numberToCloudFormation(properties.hours),
    "Minutes": cdk.numberToCloudFormation(properties.minutes)
  };
}

// @ts-ignore TS6133
function CfnDomainWindowStartTimePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDomain.WindowStartTimeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.WindowStartTimeProperty>();
  ret.addPropertyResult("hours", "Hours", (properties.Hours != null ? cfn_parse.FromCloudFormation.getNumber(properties.Hours) : undefined));
  ret.addPropertyResult("minutes", "Minutes", (properties.Minutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.Minutes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OffPeakWindowProperty`
 *
 * @param properties - the TypeScript properties of a `OffPeakWindowProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainOffPeakWindowPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("windowStartTime", CfnDomainWindowStartTimePropertyValidator)(properties.windowStartTime));
  return errors.wrap("supplied properties not correct for \"OffPeakWindowProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainOffPeakWindowPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainOffPeakWindowPropertyValidator(properties).assertSuccess();
  return {
    "WindowStartTime": convertCfnDomainWindowStartTimePropertyToCloudFormation(properties.windowStartTime)
  };
}

// @ts-ignore TS6133
function CfnDomainOffPeakWindowPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDomain.OffPeakWindowProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.OffPeakWindowProperty>();
  ret.addPropertyResult("windowStartTime", "WindowStartTime", (properties.WindowStartTime != null ? CfnDomainWindowStartTimePropertyFromCloudFormation(properties.WindowStartTime) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OffPeakWindowOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `OffPeakWindowOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainOffPeakWindowOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("offPeakWindow", CfnDomainOffPeakWindowPropertyValidator)(properties.offPeakWindow));
  return errors.wrap("supplied properties not correct for \"OffPeakWindowOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainOffPeakWindowOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainOffPeakWindowOptionsPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "OffPeakWindow": convertCfnDomainOffPeakWindowPropertyToCloudFormation(properties.offPeakWindow)
  };
}

// @ts-ignore TS6133
function CfnDomainOffPeakWindowOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDomain.OffPeakWindowOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.OffPeakWindowOptionsProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("offPeakWindow", "OffPeakWindow", (properties.OffPeakWindow != null ? CfnDomainOffPeakWindowPropertyFromCloudFormation(properties.OffPeakWindow) : undefined));
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
 * Determine whether the given properties match those of a `ClusterConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ClusterConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainClusterConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dedicatedMasterCount", cdk.validateNumber)(properties.dedicatedMasterCount));
  errors.collect(cdk.propertyValidator("dedicatedMasterEnabled", cdk.validateBoolean)(properties.dedicatedMasterEnabled));
  errors.collect(cdk.propertyValidator("dedicatedMasterType", cdk.validateString)(properties.dedicatedMasterType));
  errors.collect(cdk.propertyValidator("instanceCount", cdk.validateNumber)(properties.instanceCount));
  errors.collect(cdk.propertyValidator("instanceType", cdk.validateString)(properties.instanceType));
  errors.collect(cdk.propertyValidator("multiAzWithStandbyEnabled", cdk.validateBoolean)(properties.multiAzWithStandbyEnabled));
  errors.collect(cdk.propertyValidator("warmCount", cdk.validateNumber)(properties.warmCount));
  errors.collect(cdk.propertyValidator("warmEnabled", cdk.validateBoolean)(properties.warmEnabled));
  errors.collect(cdk.propertyValidator("warmType", cdk.validateString)(properties.warmType));
  errors.collect(cdk.propertyValidator("zoneAwarenessConfig", CfnDomainZoneAwarenessConfigPropertyValidator)(properties.zoneAwarenessConfig));
  errors.collect(cdk.propertyValidator("zoneAwarenessEnabled", cdk.validateBoolean)(properties.zoneAwarenessEnabled));
  return errors.wrap("supplied properties not correct for \"ClusterConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainClusterConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainClusterConfigPropertyValidator(properties).assertSuccess();
  return {
    "DedicatedMasterCount": cdk.numberToCloudFormation(properties.dedicatedMasterCount),
    "DedicatedMasterEnabled": cdk.booleanToCloudFormation(properties.dedicatedMasterEnabled),
    "DedicatedMasterType": cdk.stringToCloudFormation(properties.dedicatedMasterType),
    "InstanceCount": cdk.numberToCloudFormation(properties.instanceCount),
    "InstanceType": cdk.stringToCloudFormation(properties.instanceType),
    "MultiAZWithStandbyEnabled": cdk.booleanToCloudFormation(properties.multiAzWithStandbyEnabled),
    "WarmCount": cdk.numberToCloudFormation(properties.warmCount),
    "WarmEnabled": cdk.booleanToCloudFormation(properties.warmEnabled),
    "WarmType": cdk.stringToCloudFormation(properties.warmType),
    "ZoneAwarenessConfig": convertCfnDomainZoneAwarenessConfigPropertyToCloudFormation(properties.zoneAwarenessConfig),
    "ZoneAwarenessEnabled": cdk.booleanToCloudFormation(properties.zoneAwarenessEnabled)
  };
}

// @ts-ignore TS6133
function CfnDomainClusterConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomain.ClusterConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.ClusterConfigProperty>();
  ret.addPropertyResult("dedicatedMasterCount", "DedicatedMasterCount", (properties.DedicatedMasterCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.DedicatedMasterCount) : undefined));
  ret.addPropertyResult("dedicatedMasterEnabled", "DedicatedMasterEnabled", (properties.DedicatedMasterEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DedicatedMasterEnabled) : undefined));
  ret.addPropertyResult("dedicatedMasterType", "DedicatedMasterType", (properties.DedicatedMasterType != null ? cfn_parse.FromCloudFormation.getString(properties.DedicatedMasterType) : undefined));
  ret.addPropertyResult("instanceCount", "InstanceCount", (properties.InstanceCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.InstanceCount) : undefined));
  ret.addPropertyResult("instanceType", "InstanceType", (properties.InstanceType != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceType) : undefined));
  ret.addPropertyResult("multiAzWithStandbyEnabled", "MultiAZWithStandbyEnabled", (properties.MultiAZWithStandbyEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.MultiAZWithStandbyEnabled) : undefined));
  ret.addPropertyResult("warmCount", "WarmCount", (properties.WarmCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.WarmCount) : undefined));
  ret.addPropertyResult("warmEnabled", "WarmEnabled", (properties.WarmEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.WarmEnabled) : undefined));
  ret.addPropertyResult("warmType", "WarmType", (properties.WarmType != null ? cfn_parse.FromCloudFormation.getString(properties.WarmType) : undefined));
  ret.addPropertyResult("zoneAwarenessConfig", "ZoneAwarenessConfig", (properties.ZoneAwarenessConfig != null ? CfnDomainZoneAwarenessConfigPropertyFromCloudFormation(properties.ZoneAwarenessConfig) : undefined));
  ret.addPropertyResult("zoneAwarenessEnabled", "ZoneAwarenessEnabled", (properties.ZoneAwarenessEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ZoneAwarenessEnabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ServiceSoftwareOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `ServiceSoftwareOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainServiceSoftwareOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("automatedUpdateDate", cdk.validateString)(properties.automatedUpdateDate));
  errors.collect(cdk.propertyValidator("cancellable", cdk.validateBoolean)(properties.cancellable));
  errors.collect(cdk.propertyValidator("currentVersion", cdk.validateString)(properties.currentVersion));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("newVersion", cdk.validateString)(properties.newVersion));
  errors.collect(cdk.propertyValidator("optionalDeployment", cdk.validateBoolean)(properties.optionalDeployment));
  errors.collect(cdk.propertyValidator("updateAvailable", cdk.validateBoolean)(properties.updateAvailable));
  errors.collect(cdk.propertyValidator("updateStatus", cdk.validateString)(properties.updateStatus));
  return errors.wrap("supplied properties not correct for \"ServiceSoftwareOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDomainServiceSoftwareOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainServiceSoftwareOptionsPropertyValidator(properties).assertSuccess();
  return {
    "AutomatedUpdateDate": cdk.stringToCloudFormation(properties.automatedUpdateDate),
    "Cancellable": cdk.booleanToCloudFormation(properties.cancellable),
    "CurrentVersion": cdk.stringToCloudFormation(properties.currentVersion),
    "Description": cdk.stringToCloudFormation(properties.description),
    "NewVersion": cdk.stringToCloudFormation(properties.newVersion),
    "OptionalDeployment": cdk.booleanToCloudFormation(properties.optionalDeployment),
    "UpdateAvailable": cdk.booleanToCloudFormation(properties.updateAvailable),
    "UpdateStatus": cdk.stringToCloudFormation(properties.updateStatus)
  };
}

// @ts-ignore TS6133
function CfnDomainServiceSoftwareOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDomain.ServiceSoftwareOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomain.ServiceSoftwareOptionsProperty>();
  ret.addPropertyResult("automatedUpdateDate", "AutomatedUpdateDate", (properties.AutomatedUpdateDate != null ? cfn_parse.FromCloudFormation.getString(properties.AutomatedUpdateDate) : undefined));
  ret.addPropertyResult("cancellable", "Cancellable", (properties.Cancellable != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Cancellable) : undefined));
  ret.addPropertyResult("currentVersion", "CurrentVersion", (properties.CurrentVersion != null ? cfn_parse.FromCloudFormation.getString(properties.CurrentVersion) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("newVersion", "NewVersion", (properties.NewVersion != null ? cfn_parse.FromCloudFormation.getString(properties.NewVersion) : undefined));
  ret.addPropertyResult("optionalDeployment", "OptionalDeployment", (properties.OptionalDeployment != null ? cfn_parse.FromCloudFormation.getBoolean(properties.OptionalDeployment) : undefined));
  ret.addPropertyResult("updateAvailable", "UpdateAvailable", (properties.UpdateAvailable != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UpdateAvailable) : undefined));
  ret.addPropertyResult("updateStatus", "UpdateStatus", (properties.UpdateStatus != null ? cfn_parse.FromCloudFormation.getString(properties.UpdateStatus) : undefined));
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
  errors.collect(cdk.propertyValidator("clusterConfig", CfnDomainClusterConfigPropertyValidator)(properties.clusterConfig));
  errors.collect(cdk.propertyValidator("cognitoOptions", CfnDomainCognitoOptionsPropertyValidator)(properties.cognitoOptions));
  errors.collect(cdk.propertyValidator("domainArn", cdk.validateString)(properties.domainArn));
  errors.collect(cdk.propertyValidator("domainEndpointOptions", CfnDomainDomainEndpointOptionsPropertyValidator)(properties.domainEndpointOptions));
  errors.collect(cdk.propertyValidator("domainName", cdk.validateString)(properties.domainName));
  errors.collect(cdk.propertyValidator("ebsOptions", CfnDomainEBSOptionsPropertyValidator)(properties.ebsOptions));
  errors.collect(cdk.propertyValidator("encryptionAtRestOptions", CfnDomainEncryptionAtRestOptionsPropertyValidator)(properties.encryptionAtRestOptions));
  errors.collect(cdk.propertyValidator("engineVersion", cdk.validateString)(properties.engineVersion));
  errors.collect(cdk.propertyValidator("ipAddressType", cdk.validateString)(properties.ipAddressType));
  errors.collect(cdk.propertyValidator("logPublishingOptions", cdk.hashValidator(CfnDomainLogPublishingOptionPropertyValidator))(properties.logPublishingOptions));
  errors.collect(cdk.propertyValidator("nodeToNodeEncryptionOptions", CfnDomainNodeToNodeEncryptionOptionsPropertyValidator)(properties.nodeToNodeEncryptionOptions));
  errors.collect(cdk.propertyValidator("offPeakWindowOptions", CfnDomainOffPeakWindowOptionsPropertyValidator)(properties.offPeakWindowOptions));
  errors.collect(cdk.propertyValidator("snapshotOptions", CfnDomainSnapshotOptionsPropertyValidator)(properties.snapshotOptions));
  errors.collect(cdk.propertyValidator("softwareUpdateOptions", CfnDomainSoftwareUpdateOptionsPropertyValidator)(properties.softwareUpdateOptions));
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
    "ClusterConfig": convertCfnDomainClusterConfigPropertyToCloudFormation(properties.clusterConfig),
    "CognitoOptions": convertCfnDomainCognitoOptionsPropertyToCloudFormation(properties.cognitoOptions),
    "DomainArn": cdk.stringToCloudFormation(properties.domainArn),
    "DomainEndpointOptions": convertCfnDomainDomainEndpointOptionsPropertyToCloudFormation(properties.domainEndpointOptions),
    "DomainName": cdk.stringToCloudFormation(properties.domainName),
    "EBSOptions": convertCfnDomainEBSOptionsPropertyToCloudFormation(properties.ebsOptions),
    "EncryptionAtRestOptions": convertCfnDomainEncryptionAtRestOptionsPropertyToCloudFormation(properties.encryptionAtRestOptions),
    "EngineVersion": cdk.stringToCloudFormation(properties.engineVersion),
    "IPAddressType": cdk.stringToCloudFormation(properties.ipAddressType),
    "LogPublishingOptions": cdk.hashMapper(convertCfnDomainLogPublishingOptionPropertyToCloudFormation)(properties.logPublishingOptions),
    "NodeToNodeEncryptionOptions": convertCfnDomainNodeToNodeEncryptionOptionsPropertyToCloudFormation(properties.nodeToNodeEncryptionOptions),
    "OffPeakWindowOptions": convertCfnDomainOffPeakWindowOptionsPropertyToCloudFormation(properties.offPeakWindowOptions),
    "SnapshotOptions": convertCfnDomainSnapshotOptionsPropertyToCloudFormation(properties.snapshotOptions),
    "SoftwareUpdateOptions": convertCfnDomainSoftwareUpdateOptionsPropertyToCloudFormation(properties.softwareUpdateOptions),
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
  ret.addPropertyResult("clusterConfig", "ClusterConfig", (properties.ClusterConfig != null ? CfnDomainClusterConfigPropertyFromCloudFormation(properties.ClusterConfig) : undefined));
  ret.addPropertyResult("cognitoOptions", "CognitoOptions", (properties.CognitoOptions != null ? CfnDomainCognitoOptionsPropertyFromCloudFormation(properties.CognitoOptions) : undefined));
  ret.addPropertyResult("domainArn", "DomainArn", (properties.DomainArn != null ? cfn_parse.FromCloudFormation.getString(properties.DomainArn) : undefined));
  ret.addPropertyResult("domainEndpointOptions", "DomainEndpointOptions", (properties.DomainEndpointOptions != null ? CfnDomainDomainEndpointOptionsPropertyFromCloudFormation(properties.DomainEndpointOptions) : undefined));
  ret.addPropertyResult("domainName", "DomainName", (properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined));
  ret.addPropertyResult("ebsOptions", "EBSOptions", (properties.EBSOptions != null ? CfnDomainEBSOptionsPropertyFromCloudFormation(properties.EBSOptions) : undefined));
  ret.addPropertyResult("encryptionAtRestOptions", "EncryptionAtRestOptions", (properties.EncryptionAtRestOptions != null ? CfnDomainEncryptionAtRestOptionsPropertyFromCloudFormation(properties.EncryptionAtRestOptions) : undefined));
  ret.addPropertyResult("engineVersion", "EngineVersion", (properties.EngineVersion != null ? cfn_parse.FromCloudFormation.getString(properties.EngineVersion) : undefined));
  ret.addPropertyResult("ipAddressType", "IPAddressType", (properties.IPAddressType != null ? cfn_parse.FromCloudFormation.getString(properties.IPAddressType) : undefined));
  ret.addPropertyResult("logPublishingOptions", "LogPublishingOptions", (properties.LogPublishingOptions != null ? cfn_parse.FromCloudFormation.getMap(CfnDomainLogPublishingOptionPropertyFromCloudFormation)(properties.LogPublishingOptions) : undefined));
  ret.addPropertyResult("nodeToNodeEncryptionOptions", "NodeToNodeEncryptionOptions", (properties.NodeToNodeEncryptionOptions != null ? CfnDomainNodeToNodeEncryptionOptionsPropertyFromCloudFormation(properties.NodeToNodeEncryptionOptions) : undefined));
  ret.addPropertyResult("offPeakWindowOptions", "OffPeakWindowOptions", (properties.OffPeakWindowOptions != null ? CfnDomainOffPeakWindowOptionsPropertyFromCloudFormation(properties.OffPeakWindowOptions) : undefined));
  ret.addPropertyResult("snapshotOptions", "SnapshotOptions", (properties.SnapshotOptions != null ? CfnDomainSnapshotOptionsPropertyFromCloudFormation(properties.SnapshotOptions) : undefined));
  ret.addPropertyResult("softwareUpdateOptions", "SoftwareUpdateOptions", (properties.SoftwareUpdateOptions != null ? CfnDomainSoftwareUpdateOptionsPropertyFromCloudFormation(properties.SoftwareUpdateOptions) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("vpcOptions", "VPCOptions", (properties.VPCOptions != null ? CfnDomainVPCOptionsPropertyFromCloudFormation(properties.VPCOptions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}