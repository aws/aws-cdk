/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::DataSync::Agent` resource activates an AWS DataSync agent that you've deployed for storage discovery or data transfers.
 *
 * The activation process associates the agent with your AWS account .
 *
 * For more information, see the following topics in the *AWS DataSync User Guide* :
 *
 * - [DataSync agent requirements](https://docs.aws.amazon.com/datasync/latest/userguide/agent-requirements.html)
 * - [DataSync network requirements](https://docs.aws.amazon.com/datasync/latest/userguide/datasync-network.html)
 * - [Create a DataSync agent](https://docs.aws.amazon.com/datasync/latest/userguide/configure-agent.html)
 *
 * @cloudformationResource AWS::DataSync::Agent
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-agent.html
 */
export class CfnAgent extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DataSync::Agent";

  /**
   * Build a CfnAgent from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAgent {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAgentPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAgent(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the agent. Use the `ListAgents` operation to return a list of agents for your account and AWS Region .
   *
   * @cloudformationAttribute AgentArn
   */
  public readonly attrAgentArn: string;

  /**
   * The type of endpoint that your agent is connected to. If the endpoint is a VPC endpoint, the agent is not accessible over the public internet.
   *
   * @cloudformationAttribute EndpointType
   */
  public readonly attrEndpointType: string;

  /**
   * Specifies your DataSync agent's activation key.
   */
  public activationKey?: string;

  /**
   * Specifies a name for your agent.
   */
  public agentName?: string;

  /**
   * The Amazon Resource Names (ARNs) of the security groups used to protect your data transfer task subnets.
   */
  public securityGroupArns?: Array<string>;

  /**
   * Specifies the ARN of the subnet where you want to run your DataSync task when using a VPC endpoint.
   */
  public subnetArns?: Array<string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Specifies labels that help you categorize, filter, and search for your AWS resources.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The ID of the virtual private cloud (VPC) endpoint that the agent has access to.
   */
  public vpcEndpointId?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAgentProps = {}) {
    super(scope, id, {
      "type": CfnAgent.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrAgentArn = cdk.Token.asString(this.getAtt("AgentArn", cdk.ResolutionTypeHint.STRING));
    this.attrEndpointType = cdk.Token.asString(this.getAtt("EndpointType", cdk.ResolutionTypeHint.STRING));
    this.activationKey = props.activationKey;
    this.agentName = props.agentName;
    this.securityGroupArns = props.securityGroupArns;
    this.subnetArns = props.subnetArns;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DataSync::Agent", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.vpcEndpointId = props.vpcEndpointId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "activationKey": this.activationKey,
      "agentName": this.agentName,
      "securityGroupArns": this.securityGroupArns,
      "subnetArns": this.subnetArns,
      "tags": this.tags.renderTags(),
      "vpcEndpointId": this.vpcEndpointId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAgent.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAgentPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnAgent`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-agent.html
 */
export interface CfnAgentProps {
  /**
   * Specifies your DataSync agent's activation key.
   *
   * If you don't have an activation key, see [Activate your agent](https://docs.aws.amazon.com/datasync/latest/userguide/activate-agent.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-agent.html#cfn-datasync-agent-activationkey
   */
  readonly activationKey?: string;

  /**
   * Specifies a name for your agent.
   *
   * You can see this name in the DataSync console.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-agent.html#cfn-datasync-agent-agentname
   */
  readonly agentName?: string;

  /**
   * The Amazon Resource Names (ARNs) of the security groups used to protect your data transfer task subnets.
   *
   * See [SecurityGroupArns](https://docs.aws.amazon.com/datasync/latest/userguide/API_Ec2Config.html#DataSync-Type-Ec2Config-SecurityGroupArns) .
   *
   * *Pattern* : `^arn:(aws|aws-cn|aws-us-gov|aws-iso|aws-iso-b):ec2:[a-z\-0-9]*:[0-9]{12}:security-group/.*$`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-agent.html#cfn-datasync-agent-securitygrouparns
   */
  readonly securityGroupArns?: Array<string>;

  /**
   * Specifies the ARN of the subnet where you want to run your DataSync task when using a VPC endpoint.
   *
   * This is the subnet where DataSync creates and manages the [network interfaces](https://docs.aws.amazon.com/datasync/latest/userguide/datasync-network.html#required-network-interfaces) for your transfer. You can only specify one ARN.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-agent.html#cfn-datasync-agent-subnetarns
   */
  readonly subnetArns?: Array<string>;

  /**
   * Specifies labels that help you categorize, filter, and search for your AWS resources.
   *
   * We recommend creating at least one tag for your agent.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-agent.html#cfn-datasync-agent-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The ID of the virtual private cloud (VPC) endpoint that the agent has access to.
   *
   * This is the client-side VPC endpoint, powered by AWS PrivateLink . If you don't have an AWS PrivateLink VPC endpoint, see [AWS PrivateLink and VPC endpoints](https://docs.aws.amazon.com//vpc/latest/userguide/endpoint-services-overview.html) in the *Amazon VPC User Guide* .
   *
   * For more information about activating your agent in a private network based on a VPC, see [Using AWS DataSync in a Virtual Private Cloud](https://docs.aws.amazon.com/datasync/latest/userguide/datasync-in-vpc.html) in the *AWS DataSync User Guide.*
   *
   * A VPC endpoint ID looks like this: `vpce-01234d5aff67890e1` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-agent.html#cfn-datasync-agent-vpcendpointid
   */
  readonly vpcEndpointId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnAgentProps`
 *
 * @param properties - the TypeScript properties of a `CfnAgentProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAgentPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("activationKey", cdk.validateString)(properties.activationKey));
  errors.collect(cdk.propertyValidator("agentName", cdk.validateString)(properties.agentName));
  errors.collect(cdk.propertyValidator("securityGroupArns", cdk.listValidator(cdk.validateString))(properties.securityGroupArns));
  errors.collect(cdk.propertyValidator("subnetArns", cdk.listValidator(cdk.validateString))(properties.subnetArns));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("vpcEndpointId", cdk.validateString)(properties.vpcEndpointId));
  return errors.wrap("supplied properties not correct for \"CfnAgentProps\"");
}

// @ts-ignore TS6133
function convertCfnAgentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAgentPropsValidator(properties).assertSuccess();
  return {
    "ActivationKey": cdk.stringToCloudFormation(properties.activationKey),
    "AgentName": cdk.stringToCloudFormation(properties.agentName),
    "SecurityGroupArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupArns),
    "SubnetArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetArns),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VpcEndpointId": cdk.stringToCloudFormation(properties.vpcEndpointId)
  };
}

// @ts-ignore TS6133
function CfnAgentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAgentProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAgentProps>();
  ret.addPropertyResult("activationKey", "ActivationKey", (properties.ActivationKey != null ? cfn_parse.FromCloudFormation.getString(properties.ActivationKey) : undefined));
  ret.addPropertyResult("agentName", "AgentName", (properties.AgentName != null ? cfn_parse.FromCloudFormation.getString(properties.AgentName) : undefined));
  ret.addPropertyResult("securityGroupArns", "SecurityGroupArns", (properties.SecurityGroupArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupArns) : undefined));
  ret.addPropertyResult("subnetArns", "SubnetArns", (properties.SubnetArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetArns) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("vpcEndpointId", "VpcEndpointId", (properties.VpcEndpointId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcEndpointId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a transfer *location* for a Microsoft Azure Blob Storage container.
 *
 * AWS DataSync can use this location as a transfer source or destination.
 *
 * Before you begin, make sure you know [how DataSync accesses Azure Blob Storage](https://docs.aws.amazon.com/datasync/latest/userguide/creating-azure-blob-location.html#azure-blob-access) and works with [access tiers](https://docs.aws.amazon.com/datasync/latest/userguide/creating-azure-blob-location.html#azure-blob-access-tiers) and [blob types](https://docs.aws.amazon.com/datasync/latest/userguide/creating-azure-blob-location.html#blob-types) . You also need a [DataSync agent](https://docs.aws.amazon.com/datasync/latest/userguide/creating-azure-blob-location.html#azure-blob-creating-agent) that can connect to your container.
 *
 * @cloudformationResource AWS::DataSync::LocationAzureBlob
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationazureblob.html
 */
export class CfnLocationAzureBlob extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DataSync::LocationAzureBlob";

  /**
   * Build a CfnLocationAzureBlob from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLocationAzureBlob {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLocationAzureBlobPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLocationAzureBlob(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the Azure Blob Storage transfer location that you created.
   *
   * @cloudformationAttribute LocationArn
   */
  public readonly attrLocationArn: string;

  /**
   * The URI of the Azure Blob Storage transfer location that you created.
   *
   * @cloudformationAttribute LocationUri
   */
  public readonly attrLocationUri: string;

  /**
   * Specifies the Amazon Resource Name (ARN) of the DataSync agent that can connect with your Azure Blob Storage container.
   */
  public agentArns: Array<string>;

  /**
   * Specifies the access tier that you want your objects or files transferred into.
   */
  public azureAccessTier?: string;

  /**
   * Specifies the authentication method DataSync uses to access your Azure Blob Storage.
   */
  public azureBlobAuthenticationType: string;

  /**
   * Specifies the URL of the Azure Blob Storage container involved in your transfer.
   */
  public azureBlobContainerUrl?: string;

  /**
   * Specifies the SAS configuration that allows DataSync to access your Azure Blob Storage.
   */
  public azureBlobSasConfiguration?: CfnLocationAzureBlob.AzureBlobSasConfigurationProperty | cdk.IResolvable;

  /**
   * Specifies the type of blob that you want your objects or files to be when transferring them into Azure Blob Storage.
   */
  public azureBlobType?: string;

  /**
   * Specifies path segments if you want to limit your transfer to a virtual directory in your container (for example, `/my/images` ).
   */
  public subdirectory?: string;

  /**
   * Specifies labels that help you categorize, filter, and search for your AWS resources.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLocationAzureBlobProps) {
    super(scope, id, {
      "type": CfnLocationAzureBlob.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "agentArns", this);
    cdk.requireProperty(props, "azureBlobAuthenticationType", this);

    this.attrLocationArn = cdk.Token.asString(this.getAtt("LocationArn", cdk.ResolutionTypeHint.STRING));
    this.attrLocationUri = cdk.Token.asString(this.getAtt("LocationUri", cdk.ResolutionTypeHint.STRING));
    this.agentArns = props.agentArns;
    this.azureAccessTier = props.azureAccessTier;
    this.azureBlobAuthenticationType = props.azureBlobAuthenticationType;
    this.azureBlobContainerUrl = props.azureBlobContainerUrl;
    this.azureBlobSasConfiguration = props.azureBlobSasConfiguration;
    this.azureBlobType = props.azureBlobType;
    this.subdirectory = props.subdirectory;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "agentArns": this.agentArns,
      "azureAccessTier": this.azureAccessTier,
      "azureBlobAuthenticationType": this.azureBlobAuthenticationType,
      "azureBlobContainerUrl": this.azureBlobContainerUrl,
      "azureBlobSasConfiguration": this.azureBlobSasConfiguration,
      "azureBlobType": this.azureBlobType,
      "subdirectory": this.subdirectory,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLocationAzureBlob.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLocationAzureBlobPropsToCloudFormation(props);
  }
}

export namespace CfnLocationAzureBlob {
  /**
   * The shared access signature (SAS) configuration that allows AWS DataSync to access your Microsoft Azure Blob Storage.
   *
   * For more information, see [SAS tokens](https://docs.aws.amazon.com/datasync/latest/userguide/creating-azure-blob-location.html#azure-blob-sas-tokens) for accessing your Azure Blob Storage.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationazureblob-azureblobsasconfiguration.html
   */
  export interface AzureBlobSasConfigurationProperty {
    /**
     * Specifies a SAS token that provides permissions to access your Azure Blob Storage.
     *
     * The token is part of the SAS URI string that comes after the storage resource URI and a question mark. A token looks something like this:
     *
     * `sp=r&st=2023-12-20T14:54:52Z&se=2023-12-20T22:54:52Z&spr=https&sv=2021-06-08&sr=c&sig=aBBKDWQvyuVcTPH9EBp%2FXTI9E%2F%2Fmq171%2BZU178wcwqU%3D`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationazureblob-azureblobsasconfiguration.html#cfn-datasync-locationazureblob-azureblobsasconfiguration-azureblobsastoken
     */
    readonly azureBlobSasToken: string;
  }
}

/**
 * Properties for defining a `CfnLocationAzureBlob`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationazureblob.html
 */
export interface CfnLocationAzureBlobProps {
  /**
   * Specifies the Amazon Resource Name (ARN) of the DataSync agent that can connect with your Azure Blob Storage container.
   *
   * You can specify more than one agent. For more information, see [Using multiple agents for your transfer](https://docs.aws.amazon.com/datasync/latest/userguide/multiple-agents.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationazureblob.html#cfn-datasync-locationazureblob-agentarns
   */
  readonly agentArns: Array<string>;

  /**
   * Specifies the access tier that you want your objects or files transferred into.
   *
   * This only applies when using the location as a transfer destination. For more information, see [Access tiers](https://docs.aws.amazon.com/datasync/latest/userguide/creating-azure-blob-location.html#azure-blob-access-tiers) .
   *
   * @default - "HOT"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationazureblob.html#cfn-datasync-locationazureblob-azureaccesstier
   */
  readonly azureAccessTier?: string;

  /**
   * Specifies the authentication method DataSync uses to access your Azure Blob Storage.
   *
   * DataSync can access blob storage using a shared access signature (SAS).
   *
   * @default - "SAS"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationazureblob.html#cfn-datasync-locationazureblob-azureblobauthenticationtype
   */
  readonly azureBlobAuthenticationType: string;

  /**
   * Specifies the URL of the Azure Blob Storage container involved in your transfer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationazureblob.html#cfn-datasync-locationazureblob-azureblobcontainerurl
   */
  readonly azureBlobContainerUrl?: string;

  /**
   * Specifies the SAS configuration that allows DataSync to access your Azure Blob Storage.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationazureblob.html#cfn-datasync-locationazureblob-azureblobsasconfiguration
   */
  readonly azureBlobSasConfiguration?: CfnLocationAzureBlob.AzureBlobSasConfigurationProperty | cdk.IResolvable;

  /**
   * Specifies the type of blob that you want your objects or files to be when transferring them into Azure Blob Storage.
   *
   * Currently, DataSync only supports moving data into Azure Blob Storage as block blobs. For more information on blob types, see the [Azure Blob Storage documentation](https://docs.aws.amazon.com/https://learn.microsoft.com/en-us/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs) .
   *
   * @default - "BLOCK"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationazureblob.html#cfn-datasync-locationazureblob-azureblobtype
   */
  readonly azureBlobType?: string;

  /**
   * Specifies path segments if you want to limit your transfer to a virtual directory in your container (for example, `/my/images` ).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationazureblob.html#cfn-datasync-locationazureblob-subdirectory
   */
  readonly subdirectory?: string;

  /**
   * Specifies labels that help you categorize, filter, and search for your AWS resources.
   *
   * We recommend creating at least a name tag for your transfer location.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationazureblob.html#cfn-datasync-locationazureblob-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `AzureBlobSasConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AzureBlobSasConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLocationAzureBlobAzureBlobSasConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("azureBlobSasToken", cdk.requiredValidator)(properties.azureBlobSasToken));
  errors.collect(cdk.propertyValidator("azureBlobSasToken", cdk.validateString)(properties.azureBlobSasToken));
  return errors.wrap("supplied properties not correct for \"AzureBlobSasConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnLocationAzureBlobAzureBlobSasConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLocationAzureBlobAzureBlobSasConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AzureBlobSasToken": cdk.stringToCloudFormation(properties.azureBlobSasToken)
  };
}

// @ts-ignore TS6133
function CfnLocationAzureBlobAzureBlobSasConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationAzureBlob.AzureBlobSasConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationAzureBlob.AzureBlobSasConfigurationProperty>();
  ret.addPropertyResult("azureBlobSasToken", "AzureBlobSasToken", (properties.AzureBlobSasToken != null ? cfn_parse.FromCloudFormation.getString(properties.AzureBlobSasToken) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnLocationAzureBlobProps`
 *
 * @param properties - the TypeScript properties of a `CfnLocationAzureBlobProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLocationAzureBlobPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("agentArns", cdk.requiredValidator)(properties.agentArns));
  errors.collect(cdk.propertyValidator("agentArns", cdk.listValidator(cdk.validateString))(properties.agentArns));
  errors.collect(cdk.propertyValidator("azureAccessTier", cdk.validateString)(properties.azureAccessTier));
  errors.collect(cdk.propertyValidator("azureBlobAuthenticationType", cdk.requiredValidator)(properties.azureBlobAuthenticationType));
  errors.collect(cdk.propertyValidator("azureBlobAuthenticationType", cdk.validateString)(properties.azureBlobAuthenticationType));
  errors.collect(cdk.propertyValidator("azureBlobContainerUrl", cdk.validateString)(properties.azureBlobContainerUrl));
  errors.collect(cdk.propertyValidator("azureBlobSasConfiguration", CfnLocationAzureBlobAzureBlobSasConfigurationPropertyValidator)(properties.azureBlobSasConfiguration));
  errors.collect(cdk.propertyValidator("azureBlobType", cdk.validateString)(properties.azureBlobType));
  errors.collect(cdk.propertyValidator("subdirectory", cdk.validateString)(properties.subdirectory));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnLocationAzureBlobProps\"");
}

// @ts-ignore TS6133
function convertCfnLocationAzureBlobPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLocationAzureBlobPropsValidator(properties).assertSuccess();
  return {
    "AgentArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.agentArns),
    "AzureAccessTier": cdk.stringToCloudFormation(properties.azureAccessTier),
    "AzureBlobAuthenticationType": cdk.stringToCloudFormation(properties.azureBlobAuthenticationType),
    "AzureBlobContainerUrl": cdk.stringToCloudFormation(properties.azureBlobContainerUrl),
    "AzureBlobSasConfiguration": convertCfnLocationAzureBlobAzureBlobSasConfigurationPropertyToCloudFormation(properties.azureBlobSasConfiguration),
    "AzureBlobType": cdk.stringToCloudFormation(properties.azureBlobType),
    "Subdirectory": cdk.stringToCloudFormation(properties.subdirectory),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnLocationAzureBlobPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationAzureBlobProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationAzureBlobProps>();
  ret.addPropertyResult("agentArns", "AgentArns", (properties.AgentArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AgentArns) : undefined));
  ret.addPropertyResult("azureAccessTier", "AzureAccessTier", (properties.AzureAccessTier != null ? cfn_parse.FromCloudFormation.getString(properties.AzureAccessTier) : undefined));
  ret.addPropertyResult("azureBlobAuthenticationType", "AzureBlobAuthenticationType", (properties.AzureBlobAuthenticationType != null ? cfn_parse.FromCloudFormation.getString(properties.AzureBlobAuthenticationType) : undefined));
  ret.addPropertyResult("azureBlobContainerUrl", "AzureBlobContainerUrl", (properties.AzureBlobContainerUrl != null ? cfn_parse.FromCloudFormation.getString(properties.AzureBlobContainerUrl) : undefined));
  ret.addPropertyResult("azureBlobSasConfiguration", "AzureBlobSasConfiguration", (properties.AzureBlobSasConfiguration != null ? CfnLocationAzureBlobAzureBlobSasConfigurationPropertyFromCloudFormation(properties.AzureBlobSasConfiguration) : undefined));
  ret.addPropertyResult("azureBlobType", "AzureBlobType", (properties.AzureBlobType != null ? cfn_parse.FromCloudFormation.getString(properties.AzureBlobType) : undefined));
  ret.addPropertyResult("subdirectory", "Subdirectory", (properties.Subdirectory != null ? cfn_parse.FromCloudFormation.getString(properties.Subdirectory) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::DataSync::LocationEFS` resource creates an endpoint for an Amazon EFS file system.
 *
 * AWS DataSync can access this endpoint as a source or destination location.
 *
 * @cloudformationResource AWS::DataSync::LocationEFS
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationefs.html
 */
export class CfnLocationEFS extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DataSync::LocationEFS";

  /**
   * Build a CfnLocationEFS from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLocationEFS {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLocationEFSPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLocationEFS(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the Amazon EFS file system.
   *
   * @cloudformationAttribute LocationArn
   */
  public readonly attrLocationArn: string;

  /**
   * The URI of the Amazon EFS file system.
   *
   * @cloudformationAttribute LocationUri
   */
  public readonly attrLocationUri: string;

  /**
   * Specifies the Amazon Resource Name (ARN) of the access point that DataSync uses to access the Amazon EFS file system.
   */
  public accessPointArn?: string;

  /**
   * Specifies the subnet and security groups DataSync uses to access your Amazon EFS file system.
   */
  public ec2Config: CfnLocationEFS.Ec2ConfigProperty | cdk.IResolvable;

  /**
   * Specifies the ARN for the Amazon EFS file system.
   */
  public efsFilesystemArn?: string;

  /**
   * Specifies an AWS Identity and Access Management (IAM) role that DataSync assumes when mounting the Amazon EFS file system.
   */
  public fileSystemAccessRoleArn?: string;

  /**
   * Specifies whether you want DataSync to use Transport Layer Security (TLS) 1.2 encryption when it copies data to or from the Amazon EFS file system.
   */
  public inTransitEncryption?: string;

  /**
   * Specifies a mount path for your Amazon EFS file system.
   */
  public subdirectory?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Specifies the key-value pair that represents a tag that you want to add to the resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLocationEFSProps) {
    super(scope, id, {
      "type": CfnLocationEFS.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "ec2Config", this);

    this.attrLocationArn = cdk.Token.asString(this.getAtt("LocationArn", cdk.ResolutionTypeHint.STRING));
    this.attrLocationUri = cdk.Token.asString(this.getAtt("LocationUri", cdk.ResolutionTypeHint.STRING));
    this.accessPointArn = props.accessPointArn;
    this.ec2Config = props.ec2Config;
    this.efsFilesystemArn = props.efsFilesystemArn;
    this.fileSystemAccessRoleArn = props.fileSystemAccessRoleArn;
    this.inTransitEncryption = props.inTransitEncryption;
    this.subdirectory = props.subdirectory;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DataSync::LocationEFS", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accessPointArn": this.accessPointArn,
      "ec2Config": this.ec2Config,
      "efsFilesystemArn": this.efsFilesystemArn,
      "fileSystemAccessRoleArn": this.fileSystemAccessRoleArn,
      "inTransitEncryption": this.inTransitEncryption,
      "subdirectory": this.subdirectory,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLocationEFS.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLocationEFSPropsToCloudFormation(props);
  }
}

export namespace CfnLocationEFS {
  /**
   * The subnet and security groups that AWS DataSync uses to access your Amazon EFS file system.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationefs-ec2config.html
   */
  export interface Ec2ConfigProperty {
    /**
     * Specifies the Amazon Resource Names (ARNs) of the security groups associated with an Amazon EFS file system's mount target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationefs-ec2config.html#cfn-datasync-locationefs-ec2config-securitygrouparns
     */
    readonly securityGroupArns: Array<string>;

    /**
     * Specifies the ARN of a subnet where DataSync creates the [network interfaces](https://docs.aws.amazon.com/datasync/latest/userguide/datasync-network.html#required-network-interfaces) for managing traffic during your transfer.
     *
     * The subnet must be located:
     *
     * - In the same virtual private cloud (VPC) as the Amazon EFS file system.
     * - In the same Availability Zone as at least one mount target for the Amazon EFS file system.
     *
     * > You don't need to specify a subnet that includes a file system mount target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationefs-ec2config.html#cfn-datasync-locationefs-ec2config-subnetarn
     */
    readonly subnetArn: string;
  }
}

/**
 * Properties for defining a `CfnLocationEFS`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationefs.html
 */
export interface CfnLocationEFSProps {
  /**
   * Specifies the Amazon Resource Name (ARN) of the access point that DataSync uses to access the Amazon EFS file system.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationefs.html#cfn-datasync-locationefs-accesspointarn
   */
  readonly accessPointArn?: string;

  /**
   * Specifies the subnet and security groups DataSync uses to access your Amazon EFS file system.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationefs.html#cfn-datasync-locationefs-ec2config
   */
  readonly ec2Config: CfnLocationEFS.Ec2ConfigProperty | cdk.IResolvable;

  /**
   * Specifies the ARN for the Amazon EFS file system.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationefs.html#cfn-datasync-locationefs-efsfilesystemarn
   */
  readonly efsFilesystemArn?: string;

  /**
   * Specifies an AWS Identity and Access Management (IAM) role that DataSync assumes when mounting the Amazon EFS file system.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationefs.html#cfn-datasync-locationefs-filesystemaccessrolearn
   */
  readonly fileSystemAccessRoleArn?: string;

  /**
   * Specifies whether you want DataSync to use Transport Layer Security (TLS) 1.2 encryption when it copies data to or from the Amazon EFS file system.
   *
   * If you specify an access point using `AccessPointArn` or an IAM role using `FileSystemAccessRoleArn` , you must set this parameter to `TLS1_2` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationefs.html#cfn-datasync-locationefs-intransitencryption
   */
  readonly inTransitEncryption?: string;

  /**
   * Specifies a mount path for your Amazon EFS file system.
   *
   * This is where DataSync reads or writes data (depending on if this is a source or destination location). By default, DataSync uses the root directory, but you can also include subdirectories.
   *
   * > You must specify a value with forward slashes (for example, `/path/to/folder` ).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationefs.html#cfn-datasync-locationefs-subdirectory
   */
  readonly subdirectory?: string;

  /**
   * Specifies the key-value pair that represents a tag that you want to add to the resource.
   *
   * The value can be an empty string. This value helps you manage, filter, and search for your resources. We recommend that you create a name tag for your location.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationefs.html#cfn-datasync-locationefs-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `Ec2ConfigProperty`
 *
 * @param properties - the TypeScript properties of a `Ec2ConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLocationEFSEc2ConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("securityGroupArns", cdk.requiredValidator)(properties.securityGroupArns));
  errors.collect(cdk.propertyValidator("securityGroupArns", cdk.listValidator(cdk.validateString))(properties.securityGroupArns));
  errors.collect(cdk.propertyValidator("subnetArn", cdk.requiredValidator)(properties.subnetArn));
  errors.collect(cdk.propertyValidator("subnetArn", cdk.validateString)(properties.subnetArn));
  return errors.wrap("supplied properties not correct for \"Ec2ConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnLocationEFSEc2ConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLocationEFSEc2ConfigPropertyValidator(properties).assertSuccess();
  return {
    "SecurityGroupArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupArns),
    "SubnetArn": cdk.stringToCloudFormation(properties.subnetArn)
  };
}

// @ts-ignore TS6133
function CfnLocationEFSEc2ConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationEFS.Ec2ConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationEFS.Ec2ConfigProperty>();
  ret.addPropertyResult("securityGroupArns", "SecurityGroupArns", (properties.SecurityGroupArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupArns) : undefined));
  ret.addPropertyResult("subnetArn", "SubnetArn", (properties.SubnetArn != null ? cfn_parse.FromCloudFormation.getString(properties.SubnetArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnLocationEFSProps`
 *
 * @param properties - the TypeScript properties of a `CfnLocationEFSProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLocationEFSPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessPointArn", cdk.validateString)(properties.accessPointArn));
  errors.collect(cdk.propertyValidator("ec2Config", cdk.requiredValidator)(properties.ec2Config));
  errors.collect(cdk.propertyValidator("ec2Config", CfnLocationEFSEc2ConfigPropertyValidator)(properties.ec2Config));
  errors.collect(cdk.propertyValidator("efsFilesystemArn", cdk.validateString)(properties.efsFilesystemArn));
  errors.collect(cdk.propertyValidator("fileSystemAccessRoleArn", cdk.validateString)(properties.fileSystemAccessRoleArn));
  errors.collect(cdk.propertyValidator("inTransitEncryption", cdk.validateString)(properties.inTransitEncryption));
  errors.collect(cdk.propertyValidator("subdirectory", cdk.validateString)(properties.subdirectory));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnLocationEFSProps\"");
}

// @ts-ignore TS6133
function convertCfnLocationEFSPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLocationEFSPropsValidator(properties).assertSuccess();
  return {
    "AccessPointArn": cdk.stringToCloudFormation(properties.accessPointArn),
    "Ec2Config": convertCfnLocationEFSEc2ConfigPropertyToCloudFormation(properties.ec2Config),
    "EfsFilesystemArn": cdk.stringToCloudFormation(properties.efsFilesystemArn),
    "FileSystemAccessRoleArn": cdk.stringToCloudFormation(properties.fileSystemAccessRoleArn),
    "InTransitEncryption": cdk.stringToCloudFormation(properties.inTransitEncryption),
    "Subdirectory": cdk.stringToCloudFormation(properties.subdirectory),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnLocationEFSPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationEFSProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationEFSProps>();
  ret.addPropertyResult("accessPointArn", "AccessPointArn", (properties.AccessPointArn != null ? cfn_parse.FromCloudFormation.getString(properties.AccessPointArn) : undefined));
  ret.addPropertyResult("ec2Config", "Ec2Config", (properties.Ec2Config != null ? CfnLocationEFSEc2ConfigPropertyFromCloudFormation(properties.Ec2Config) : undefined));
  ret.addPropertyResult("efsFilesystemArn", "EfsFilesystemArn", (properties.EfsFilesystemArn != null ? cfn_parse.FromCloudFormation.getString(properties.EfsFilesystemArn) : undefined));
  ret.addPropertyResult("fileSystemAccessRoleArn", "FileSystemAccessRoleArn", (properties.FileSystemAccessRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.FileSystemAccessRoleArn) : undefined));
  ret.addPropertyResult("inTransitEncryption", "InTransitEncryption", (properties.InTransitEncryption != null ? cfn_parse.FromCloudFormation.getString(properties.InTransitEncryption) : undefined));
  ret.addPropertyResult("subdirectory", "Subdirectory", (properties.Subdirectory != null ? cfn_parse.FromCloudFormation.getString(properties.Subdirectory) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::DataSync::LocationFSxLustre` resource specifies an endpoint for an Amazon FSx for Lustre file system.
 *
 * @cloudformationResource AWS::DataSync::LocationFSxLustre
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxlustre.html
 */
export class CfnLocationFSxLustre extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DataSync::LocationFSxLustre";

  /**
   * Build a CfnLocationFSxLustre from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLocationFSxLustre {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLocationFSxLustrePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLocationFSxLustre(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the specified FSx for Lustre file system location.
   *
   * @cloudformationAttribute LocationArn
   */
  public readonly attrLocationArn: string;

  /**
   * The URI of the specified FSx for Lustre file system location.
   *
   * @cloudformationAttribute LocationUri
   */
  public readonly attrLocationUri: string;

  /**
   * The Amazon Resource Name (ARN) for the FSx for Lustre file system.
   */
  public fsxFilesystemArn?: string;

  /**
   * The ARNs of the security groups that are used to configure the FSx for Lustre file system.
   */
  public securityGroupArns: Array<string>;

  /**
   * A subdirectory in the location's path.
   */
  public subdirectory?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The key-value pair that represents a tag that you want to add to the resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLocationFSxLustreProps) {
    super(scope, id, {
      "type": CfnLocationFSxLustre.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "securityGroupArns", this);

    this.attrLocationArn = cdk.Token.asString(this.getAtt("LocationArn", cdk.ResolutionTypeHint.STRING));
    this.attrLocationUri = cdk.Token.asString(this.getAtt("LocationUri", cdk.ResolutionTypeHint.STRING));
    this.fsxFilesystemArn = props.fsxFilesystemArn;
    this.securityGroupArns = props.securityGroupArns;
    this.subdirectory = props.subdirectory;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DataSync::LocationFSxLustre", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "fsxFilesystemArn": this.fsxFilesystemArn,
      "securityGroupArns": this.securityGroupArns,
      "subdirectory": this.subdirectory,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLocationFSxLustre.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLocationFSxLustrePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnLocationFSxLustre`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxlustre.html
 */
export interface CfnLocationFSxLustreProps {
  /**
   * The Amazon Resource Name (ARN) for the FSx for Lustre file system.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxlustre.html#cfn-datasync-locationfsxlustre-fsxfilesystemarn
   */
  readonly fsxFilesystemArn?: string;

  /**
   * The ARNs of the security groups that are used to configure the FSx for Lustre file system.
   *
   * *Pattern* : `^arn:(aws|aws-cn|aws-us-gov|aws-iso|aws-iso-b):ec2:[a-z\-0-9]*:[0-9]{12}:security-group/.*$`
   *
   * *Length constraints* : Maximum length of 128.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxlustre.html#cfn-datasync-locationfsxlustre-securitygrouparns
   */
  readonly securityGroupArns: Array<string>;

  /**
   * A subdirectory in the location's path.
   *
   * This subdirectory in the FSx for Lustre file system is used to read data from the FSx for Lustre source location or write data to the FSx for Lustre destination.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxlustre.html#cfn-datasync-locationfsxlustre-subdirectory
   */
  readonly subdirectory?: string;

  /**
   * The key-value pair that represents a tag that you want to add to the resource.
   *
   * The value can be an empty string. This value helps you manage, filter, and search for your resources. We recommend that you create a name tag for your location.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxlustre.html#cfn-datasync-locationfsxlustre-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnLocationFSxLustreProps`
 *
 * @param properties - the TypeScript properties of a `CfnLocationFSxLustreProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLocationFSxLustrePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fsxFilesystemArn", cdk.validateString)(properties.fsxFilesystemArn));
  errors.collect(cdk.propertyValidator("securityGroupArns", cdk.requiredValidator)(properties.securityGroupArns));
  errors.collect(cdk.propertyValidator("securityGroupArns", cdk.listValidator(cdk.validateString))(properties.securityGroupArns));
  errors.collect(cdk.propertyValidator("subdirectory", cdk.validateString)(properties.subdirectory));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnLocationFSxLustreProps\"");
}

// @ts-ignore TS6133
function convertCfnLocationFSxLustrePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLocationFSxLustrePropsValidator(properties).assertSuccess();
  return {
    "FsxFilesystemArn": cdk.stringToCloudFormation(properties.fsxFilesystemArn),
    "SecurityGroupArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupArns),
    "Subdirectory": cdk.stringToCloudFormation(properties.subdirectory),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnLocationFSxLustrePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationFSxLustreProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationFSxLustreProps>();
  ret.addPropertyResult("fsxFilesystemArn", "FsxFilesystemArn", (properties.FsxFilesystemArn != null ? cfn_parse.FromCloudFormation.getString(properties.FsxFilesystemArn) : undefined));
  ret.addPropertyResult("securityGroupArns", "SecurityGroupArns", (properties.SecurityGroupArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupArns) : undefined));
  ret.addPropertyResult("subdirectory", "Subdirectory", (properties.Subdirectory != null ? cfn_parse.FromCloudFormation.getString(properties.Subdirectory) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::DataSync::LocationFSxONTAP` resource creates an endpoint for an Amazon FSx for NetApp ONTAP file system.
 *
 * AWS DataSync can access this endpoint as a source or destination location.
 *
 * @cloudformationResource AWS::DataSync::LocationFSxONTAP
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxontap.html
 */
export class CfnLocationFSxONTAP extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DataSync::LocationFSxONTAP";

  /**
   * Build a CfnLocationFSxONTAP from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLocationFSxONTAP {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLocationFSxONTAPPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLocationFSxONTAP(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the FSx for ONTAP file system in the specified location.
   *
   * @cloudformationAttribute FsxFilesystemArn
   */
  public readonly attrFsxFilesystemArn: string;

  /**
   * The ARN of the specified location.
   *
   * @cloudformationAttribute LocationArn
   */
  public readonly attrLocationArn: string;

  /**
   * The URI of the specified location.
   *
   * @cloudformationAttribute LocationUri
   */
  public readonly attrLocationUri: string;

  /**
   * Specifies the data transfer protocol that DataSync uses to access your Amazon FSx file system.
   */
  public protocol?: cdk.IResolvable | CfnLocationFSxONTAP.ProtocolProperty;

  /**
   * Specifies the Amazon Resource Names (ARNs) of the security groups that DataSync can use to access your FSx for ONTAP file system.
   */
  public securityGroupArns: Array<string>;

  /**
   * Specifies the ARN of the storage virtual machine (SVM) in your file system where you want to copy data to or from.
   */
  public storageVirtualMachineArn: string;

  /**
   * Specifies a path to the file share in the SVM where you'll copy your data.
   */
  public subdirectory?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Specifies labels that help you categorize, filter, and search for your AWS resources.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLocationFSxONTAPProps) {
    super(scope, id, {
      "type": CfnLocationFSxONTAP.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "securityGroupArns", this);
    cdk.requireProperty(props, "storageVirtualMachineArn", this);

    this.attrFsxFilesystemArn = cdk.Token.asString(this.getAtt("FsxFilesystemArn", cdk.ResolutionTypeHint.STRING));
    this.attrLocationArn = cdk.Token.asString(this.getAtt("LocationArn", cdk.ResolutionTypeHint.STRING));
    this.attrLocationUri = cdk.Token.asString(this.getAtt("LocationUri", cdk.ResolutionTypeHint.STRING));
    this.protocol = props.protocol;
    this.securityGroupArns = props.securityGroupArns;
    this.storageVirtualMachineArn = props.storageVirtualMachineArn;
    this.subdirectory = props.subdirectory;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DataSync::LocationFSxONTAP", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "protocol": this.protocol,
      "securityGroupArns": this.securityGroupArns,
      "storageVirtualMachineArn": this.storageVirtualMachineArn,
      "subdirectory": this.subdirectory,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLocationFSxONTAP.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLocationFSxONTAPPropsToCloudFormation(props);
  }
}

export namespace CfnLocationFSxONTAP {
  /**
   * Specifies the data transfer protocol that AWS DataSync uses to access your Amazon FSx file system.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxontap-protocol.html
   */
  export interface ProtocolProperty {
    /**
     * Specifies the Network File System (NFS) protocol configuration that DataSync uses to access your FSx for ONTAP file system's storage virtual machine (SVM).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxontap-protocol.html#cfn-datasync-locationfsxontap-protocol-nfs
     */
    readonly nfs?: cdk.IResolvable | CfnLocationFSxONTAP.NFSProperty;

    /**
     * Specifies the Server Message Block (SMB) protocol configuration that DataSync uses to access your FSx for ONTAP file system's SVM.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxontap-protocol.html#cfn-datasync-locationfsxontap-protocol-smb
     */
    readonly smb?: cdk.IResolvable | CfnLocationFSxONTAP.SMBProperty;
  }

  /**
   * Specifies the Server Message Block (SMB) protocol configuration that AWS DataSync uses to access a storage virtual machine (SVM) on your Amazon FSx for NetApp ONTAP file system.
   *
   * For more information, see [Accessing FSx for ONTAP file systems](https://docs.aws.amazon.com/datasync/latest/userguide/create-ontap-location.html#create-ontap-location-access) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxontap-smb.html
   */
  export interface SMBProperty {
    /**
     * Specifies the fully qualified domain name (FQDN) of the Microsoft Active Directory that your storage virtual machine (SVM) belongs to.
     *
     * If you have multiple domains in your environment, configuring this setting makes sure that DataSync connects to the right SVM.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxontap-smb.html#cfn-datasync-locationfsxontap-smb-domain
     */
    readonly domain?: string;

    /**
     * Specifies how DataSync can access a location using the SMB protocol.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxontap-smb.html#cfn-datasync-locationfsxontap-smb-mountoptions
     */
    readonly mountOptions: cdk.IResolvable | CfnLocationFSxONTAP.SmbMountOptionsProperty;

    /**
     * Specifies the password of a user who has permission to access your SVM.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxontap-smb.html#cfn-datasync-locationfsxontap-smb-password
     */
    readonly password: string;

    /**
     * Specifies a user name that can mount the location and access the files, folders, and metadata that you need in the SVM.
     *
     * If you provide a user in your Active Directory, note the following:
     *
     * - If you're using AWS Directory Service for Microsoft Active Directory , the user must be a member of the AWS Delegated FSx Administrators group.
     * - If you're using a self-managed Active Directory, the user must be a member of either the Domain Admins group or a custom group that you specified for file system administration when you created your file system.
     *
     * Make sure that the user has the permissions it needs to copy the data you want:
     *
     * - `SE_TCB_NAME` : Required to set object ownership and file metadata. With this privilege, you also can copy NTFS discretionary access lists (DACLs).
     * - `SE_SECURITY_NAME` : May be needed to copy NTFS system access control lists (SACLs). This operation specifically requires the Windows privilege, which is granted to members of the Domain Admins group. If you configure your task to copy SACLs, make sure that the user has the required privileges. For information about copying SACLs, see [Ownership and permissions-related options](https://docs.aws.amazon.com/datasync/latest/userguide/create-task.html#configure-ownership-and-permissions) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxontap-smb.html#cfn-datasync-locationfsxontap-smb-user
     */
    readonly user: string;
  }

  /**
   * Specifies the version of the Server Message Block (SMB) protocol that AWS DataSync uses to access an SMB file server.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxontap-smbmountoptions.html
   */
  export interface SmbMountOptionsProperty {
    /**
     * By default, DataSync automatically chooses an SMB protocol version based on negotiation with your SMB file server.
     *
     * You also can configure DataSync to use a specific SMB version, but we recommend doing this only if DataSync has trouble negotiating with the SMB file server automatically.
     *
     * These are the following options for configuring the SMB version:
     *
     * - `AUTOMATIC` (default): DataSync and the SMB file server negotiate the highest version of SMB that they mutually support between 2.1 and 3.1.1.
     *
     * This is the recommended option. If you instead choose a specific version that your file server doesn't support, you may get an `Operation Not Supported` error.
     * - `SMB3` : Restricts the protocol negotiation to only SMB version 3.0.2.
     * - `SMB2` : Restricts the protocol negotiation to only SMB version 2.1.
     * - `SMB2_0` : Restricts the protocol negotiation to only SMB version 2.0.
     * - `SMB1` : Restricts the protocol negotiation to only SMB version 1.0.
     *
     * > The `SMB1` option isn't available when [creating an Amazon FSx for NetApp ONTAP location](https://docs.aws.amazon.com/datasync/latest/userguide/API_CreateLocationFsxOntap.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxontap-smbmountoptions.html#cfn-datasync-locationfsxontap-smbmountoptions-version
     */
    readonly version?: string;
  }

  /**
   * Specifies the Network File System (NFS) protocol configuration that AWS DataSync uses to access a storage virtual machine (SVM) on your Amazon FSx for NetApp ONTAP file system.
   *
   * For more information, see [Accessing FSx for ONTAP file systems](https://docs.aws.amazon.com/datasync/latest/userguide/create-ontap-location.html#create-ontap-location-access) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxontap-nfs.html
   */
  export interface NFSProperty {
    /**
     * Specifies how DataSync can access a location using the NFS protocol.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxontap-nfs.html#cfn-datasync-locationfsxontap-nfs-mountoptions
     */
    readonly mountOptions: cdk.IResolvable | CfnLocationFSxONTAP.NfsMountOptionsProperty;
  }

  /**
   * Specifies how DataSync can access a location using the NFS protocol.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxontap-nfsmountoptions.html
   */
  export interface NfsMountOptionsProperty {
    /**
     * Specifies the NFS version that you want DataSync to use when mounting your NFS share.
     *
     * If the server refuses to use the version specified, the task fails.
     *
     * You can specify the following options:
     *
     * - `AUTOMATIC` (default): DataSync chooses NFS version 4.1.
     * - `NFS3` : Stateless protocol version that allows for asynchronous writes on the server.
     * - `NFSv4_0` : Stateful, firewall-friendly protocol version that supports delegations and pseudo file systems.
     * - `NFSv4_1` : Stateful protocol version that supports sessions, directory delegations, and parallel data processing. NFS version 4.1 also includes all features available in version 4.0.
     *
     * > DataSync currently only supports NFS version 3 with Amazon FSx for NetApp ONTAP locations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxontap-nfsmountoptions.html#cfn-datasync-locationfsxontap-nfsmountoptions-version
     */
    readonly version?: string;
  }
}

/**
 * Properties for defining a `CfnLocationFSxONTAP`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxontap.html
 */
export interface CfnLocationFSxONTAPProps {
  /**
   * Specifies the data transfer protocol that DataSync uses to access your Amazon FSx file system.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxontap.html#cfn-datasync-locationfsxontap-protocol
   */
  readonly protocol?: cdk.IResolvable | CfnLocationFSxONTAP.ProtocolProperty;

  /**
   * Specifies the Amazon Resource Names (ARNs) of the security groups that DataSync can use to access your FSx for ONTAP file system.
   *
   * You must configure the security groups to allow outbound traffic on the following ports (depending on the protocol that you're using):
   *
   * - *Network File System (NFS)* : TCP ports 111, 635, and 2049
   * - *Server Message Block (SMB)* : TCP port 445
   *
   * Your file system's security groups must also allow inbound traffic on the same port.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxontap.html#cfn-datasync-locationfsxontap-securitygrouparns
   */
  readonly securityGroupArns: Array<string>;

  /**
   * Specifies the ARN of the storage virtual machine (SVM) in your file system where you want to copy data to or from.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxontap.html#cfn-datasync-locationfsxontap-storagevirtualmachinearn
   */
  readonly storageVirtualMachineArn: string;

  /**
   * Specifies a path to the file share in the SVM where you'll copy your data.
   *
   * You can specify a junction path (also known as a mount point), qtree path (for NFS file shares), or share name (for SMB file shares). For example, your mount path might be `/vol1` , `/vol1/tree1` , or `/share1` .
   *
   * > Don't specify a junction path in the SVM's root volume. For more information, see [Managing FSx for ONTAP storage virtual machines](https://docs.aws.amazon.com/fsx/latest/ONTAPGuide/managing-svms.html) in the *Amazon FSx for NetApp ONTAP User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxontap.html#cfn-datasync-locationfsxontap-subdirectory
   */
  readonly subdirectory?: string;

  /**
   * Specifies labels that help you categorize, filter, and search for your AWS resources.
   *
   * We recommend creating at least a name tag for your location.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxontap.html#cfn-datasync-locationfsxontap-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `SmbMountOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `SmbMountOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLocationFSxONTAPSmbMountOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"SmbMountOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnLocationFSxONTAPSmbMountOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLocationFSxONTAPSmbMountOptionsPropertyValidator(properties).assertSuccess();
  return {
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnLocationFSxONTAPSmbMountOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLocationFSxONTAP.SmbMountOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationFSxONTAP.SmbMountOptionsProperty>();
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SMBProperty`
 *
 * @param properties - the TypeScript properties of a `SMBProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLocationFSxONTAPSMBPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("domain", cdk.validateString)(properties.domain));
  errors.collect(cdk.propertyValidator("mountOptions", cdk.requiredValidator)(properties.mountOptions));
  errors.collect(cdk.propertyValidator("mountOptions", CfnLocationFSxONTAPSmbMountOptionsPropertyValidator)(properties.mountOptions));
  errors.collect(cdk.propertyValidator("password", cdk.requiredValidator)(properties.password));
  errors.collect(cdk.propertyValidator("password", cdk.validateString)(properties.password));
  errors.collect(cdk.propertyValidator("user", cdk.requiredValidator)(properties.user));
  errors.collect(cdk.propertyValidator("user", cdk.validateString)(properties.user));
  return errors.wrap("supplied properties not correct for \"SMBProperty\"");
}

// @ts-ignore TS6133
function convertCfnLocationFSxONTAPSMBPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLocationFSxONTAPSMBPropertyValidator(properties).assertSuccess();
  return {
    "Domain": cdk.stringToCloudFormation(properties.domain),
    "MountOptions": convertCfnLocationFSxONTAPSmbMountOptionsPropertyToCloudFormation(properties.mountOptions),
    "Password": cdk.stringToCloudFormation(properties.password),
    "User": cdk.stringToCloudFormation(properties.user)
  };
}

// @ts-ignore TS6133
function CfnLocationFSxONTAPSMBPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLocationFSxONTAP.SMBProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationFSxONTAP.SMBProperty>();
  ret.addPropertyResult("domain", "Domain", (properties.Domain != null ? cfn_parse.FromCloudFormation.getString(properties.Domain) : undefined));
  ret.addPropertyResult("mountOptions", "MountOptions", (properties.MountOptions != null ? CfnLocationFSxONTAPSmbMountOptionsPropertyFromCloudFormation(properties.MountOptions) : undefined));
  ret.addPropertyResult("password", "Password", (properties.Password != null ? cfn_parse.FromCloudFormation.getString(properties.Password) : undefined));
  ret.addPropertyResult("user", "User", (properties.User != null ? cfn_parse.FromCloudFormation.getString(properties.User) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NfsMountOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `NfsMountOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLocationFSxONTAPNfsMountOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"NfsMountOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnLocationFSxONTAPNfsMountOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLocationFSxONTAPNfsMountOptionsPropertyValidator(properties).assertSuccess();
  return {
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnLocationFSxONTAPNfsMountOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLocationFSxONTAP.NfsMountOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationFSxONTAP.NfsMountOptionsProperty>();
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NFSProperty`
 *
 * @param properties - the TypeScript properties of a `NFSProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLocationFSxONTAPNFSPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("mountOptions", cdk.requiredValidator)(properties.mountOptions));
  errors.collect(cdk.propertyValidator("mountOptions", CfnLocationFSxONTAPNfsMountOptionsPropertyValidator)(properties.mountOptions));
  return errors.wrap("supplied properties not correct for \"NFSProperty\"");
}

// @ts-ignore TS6133
function convertCfnLocationFSxONTAPNFSPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLocationFSxONTAPNFSPropertyValidator(properties).assertSuccess();
  return {
    "MountOptions": convertCfnLocationFSxONTAPNfsMountOptionsPropertyToCloudFormation(properties.mountOptions)
  };
}

// @ts-ignore TS6133
function CfnLocationFSxONTAPNFSPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLocationFSxONTAP.NFSProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationFSxONTAP.NFSProperty>();
  ret.addPropertyResult("mountOptions", "MountOptions", (properties.MountOptions != null ? CfnLocationFSxONTAPNfsMountOptionsPropertyFromCloudFormation(properties.MountOptions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ProtocolProperty`
 *
 * @param properties - the TypeScript properties of a `ProtocolProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLocationFSxONTAPProtocolPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("nfs", CfnLocationFSxONTAPNFSPropertyValidator)(properties.nfs));
  errors.collect(cdk.propertyValidator("smb", CfnLocationFSxONTAPSMBPropertyValidator)(properties.smb));
  return errors.wrap("supplied properties not correct for \"ProtocolProperty\"");
}

// @ts-ignore TS6133
function convertCfnLocationFSxONTAPProtocolPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLocationFSxONTAPProtocolPropertyValidator(properties).assertSuccess();
  return {
    "NFS": convertCfnLocationFSxONTAPNFSPropertyToCloudFormation(properties.nfs),
    "SMB": convertCfnLocationFSxONTAPSMBPropertyToCloudFormation(properties.smb)
  };
}

// @ts-ignore TS6133
function CfnLocationFSxONTAPProtocolPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLocationFSxONTAP.ProtocolProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationFSxONTAP.ProtocolProperty>();
  ret.addPropertyResult("nfs", "NFS", (properties.NFS != null ? CfnLocationFSxONTAPNFSPropertyFromCloudFormation(properties.NFS) : undefined));
  ret.addPropertyResult("smb", "SMB", (properties.SMB != null ? CfnLocationFSxONTAPSMBPropertyFromCloudFormation(properties.SMB) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnLocationFSxONTAPProps`
 *
 * @param properties - the TypeScript properties of a `CfnLocationFSxONTAPProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLocationFSxONTAPPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("protocol", CfnLocationFSxONTAPProtocolPropertyValidator)(properties.protocol));
  errors.collect(cdk.propertyValidator("securityGroupArns", cdk.requiredValidator)(properties.securityGroupArns));
  errors.collect(cdk.propertyValidator("securityGroupArns", cdk.listValidator(cdk.validateString))(properties.securityGroupArns));
  errors.collect(cdk.propertyValidator("storageVirtualMachineArn", cdk.requiredValidator)(properties.storageVirtualMachineArn));
  errors.collect(cdk.propertyValidator("storageVirtualMachineArn", cdk.validateString)(properties.storageVirtualMachineArn));
  errors.collect(cdk.propertyValidator("subdirectory", cdk.validateString)(properties.subdirectory));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnLocationFSxONTAPProps\"");
}

// @ts-ignore TS6133
function convertCfnLocationFSxONTAPPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLocationFSxONTAPPropsValidator(properties).assertSuccess();
  return {
    "Protocol": convertCfnLocationFSxONTAPProtocolPropertyToCloudFormation(properties.protocol),
    "SecurityGroupArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupArns),
    "StorageVirtualMachineArn": cdk.stringToCloudFormation(properties.storageVirtualMachineArn),
    "Subdirectory": cdk.stringToCloudFormation(properties.subdirectory),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnLocationFSxONTAPPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationFSxONTAPProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationFSxONTAPProps>();
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? CfnLocationFSxONTAPProtocolPropertyFromCloudFormation(properties.Protocol) : undefined));
  ret.addPropertyResult("securityGroupArns", "SecurityGroupArns", (properties.SecurityGroupArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupArns) : undefined));
  ret.addPropertyResult("storageVirtualMachineArn", "StorageVirtualMachineArn", (properties.StorageVirtualMachineArn != null ? cfn_parse.FromCloudFormation.getString(properties.StorageVirtualMachineArn) : undefined));
  ret.addPropertyResult("subdirectory", "Subdirectory", (properties.Subdirectory != null ? cfn_parse.FromCloudFormation.getString(properties.Subdirectory) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::DataSync::LocationFSxOpenZFS` resource specifies an endpoint for an Amazon FSx for OpenZFS file system.
 *
 * @cloudformationResource AWS::DataSync::LocationFSxOpenZFS
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxopenzfs.html
 */
export class CfnLocationFSxOpenZFS extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DataSync::LocationFSxOpenZFS";

  /**
   * Build a CfnLocationFSxOpenZFS from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLocationFSxOpenZFS {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLocationFSxOpenZFSPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLocationFSxOpenZFS(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the specified FSx for OpenZFS file system location.
   *
   * @cloudformationAttribute LocationArn
   */
  public readonly attrLocationArn: string;

  /**
   * The URI of the specified FSx for OpenZFS file system location.
   *
   * @cloudformationAttribute LocationUri
   */
  public readonly attrLocationUri: string;

  /**
   * The Amazon Resource Name (ARN) of the FSx for OpenZFS file system.
   */
  public fsxFilesystemArn?: string;

  /**
   * The type of protocol that AWS DataSync uses to access your file system.
   */
  public protocol: cdk.IResolvable | CfnLocationFSxOpenZFS.ProtocolProperty;

  /**
   * The ARNs of the security groups that are used to configure the FSx for OpenZFS file system.
   */
  public securityGroupArns: Array<string>;

  /**
   * A subdirectory in the location's path that must begin with `/fsx` .
   */
  public subdirectory?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The key-value pair that represents a tag that you want to add to the resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLocationFSxOpenZFSProps) {
    super(scope, id, {
      "type": CfnLocationFSxOpenZFS.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "protocol", this);
    cdk.requireProperty(props, "securityGroupArns", this);

    this.attrLocationArn = cdk.Token.asString(this.getAtt("LocationArn", cdk.ResolutionTypeHint.STRING));
    this.attrLocationUri = cdk.Token.asString(this.getAtt("LocationUri", cdk.ResolutionTypeHint.STRING));
    this.fsxFilesystemArn = props.fsxFilesystemArn;
    this.protocol = props.protocol;
    this.securityGroupArns = props.securityGroupArns;
    this.subdirectory = props.subdirectory;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DataSync::LocationFSxOpenZFS", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "fsxFilesystemArn": this.fsxFilesystemArn,
      "protocol": this.protocol,
      "securityGroupArns": this.securityGroupArns,
      "subdirectory": this.subdirectory,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLocationFSxOpenZFS.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLocationFSxOpenZFSPropsToCloudFormation(props);
  }
}

export namespace CfnLocationFSxOpenZFS {
  /**
   * Represents the protocol that AWS DataSync uses to access your Amazon FSx for OpenZFS file system.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxopenzfs-protocol.html
   */
  export interface ProtocolProperty {
    /**
     * Represents the Network File System (NFS) protocol that DataSync uses to access your FSx for OpenZFS file system.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxopenzfs-protocol.html#cfn-datasync-locationfsxopenzfs-protocol-nfs
     */
    readonly nfs?: cdk.IResolvable | CfnLocationFSxOpenZFS.NFSProperty;
  }

  /**
   * Represents the Network File System (NFS) protocol that AWS DataSync uses to access your Amazon FSx for OpenZFS file system.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxopenzfs-nfs.html
   */
  export interface NFSProperty {
    /**
     * Represents the mount options that are available for DataSync to access an NFS location.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxopenzfs-nfs.html#cfn-datasync-locationfsxopenzfs-nfs-mountoptions
     */
    readonly mountOptions: cdk.IResolvable | CfnLocationFSxOpenZFS.MountOptionsProperty;
  }

  /**
   * Represents the mount options that are available for DataSync to access a Network File System (NFS) location.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxopenzfs-mountoptions.html
   */
  export interface MountOptionsProperty {
    /**
     * The specific NFS version that you want DataSync to use to mount your NFS share.
     *
     * If the server refuses to use the version specified, the sync will fail. If you don't specify a version, DataSync defaults to `AUTOMATIC` . That is, DataSync automatically selects a version based on negotiation with the NFS server.
     *
     * You can specify the following NFS versions:
     *
     * - *[NFSv3](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc1813)* : Stateless protocol version that allows for asynchronous writes on the server.
     * - *[NFSv4.0](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc3530)* : Stateful, firewall-friendly protocol version that supports delegations and pseudo file systems.
     * - *[NFSv4.1](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc5661)* : Stateful protocol version that supports sessions, directory delegations, and parallel data processing. Version 4.1 also includes all features available in version 4.0.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationfsxopenzfs-mountoptions.html#cfn-datasync-locationfsxopenzfs-mountoptions-version
     */
    readonly version?: string;
  }
}

/**
 * Properties for defining a `CfnLocationFSxOpenZFS`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxopenzfs.html
 */
export interface CfnLocationFSxOpenZFSProps {
  /**
   * The Amazon Resource Name (ARN) of the FSx for OpenZFS file system.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxopenzfs.html#cfn-datasync-locationfsxopenzfs-fsxfilesystemarn
   */
  readonly fsxFilesystemArn?: string;

  /**
   * The type of protocol that AWS DataSync uses to access your file system.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxopenzfs.html#cfn-datasync-locationfsxopenzfs-protocol
   */
  readonly protocol: cdk.IResolvable | CfnLocationFSxOpenZFS.ProtocolProperty;

  /**
   * The ARNs of the security groups that are used to configure the FSx for OpenZFS file system.
   *
   * *Pattern* : `^arn:(aws|aws-cn|aws-us-gov|aws-iso|aws-iso-b):ec2:[a-z\-0-9]*:[0-9]{12}:security-group/.*$`
   *
   * *Length constraints* : Maximum length of 128.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxopenzfs.html#cfn-datasync-locationfsxopenzfs-securitygrouparns
   */
  readonly securityGroupArns: Array<string>;

  /**
   * A subdirectory in the location's path that must begin with `/fsx` .
   *
   * DataSync uses this subdirectory to read or write data (depending on whether the file system is a source or destination location).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxopenzfs.html#cfn-datasync-locationfsxopenzfs-subdirectory
   */
  readonly subdirectory?: string;

  /**
   * The key-value pair that represents a tag that you want to add to the resource.
   *
   * The value can be an empty string. This value helps you manage, filter, and search for your resources. We recommend that you create a name tag for your location.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxopenzfs.html#cfn-datasync-locationfsxopenzfs-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `MountOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `MountOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLocationFSxOpenZFSMountOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"MountOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnLocationFSxOpenZFSMountOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLocationFSxOpenZFSMountOptionsPropertyValidator(properties).assertSuccess();
  return {
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnLocationFSxOpenZFSMountOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLocationFSxOpenZFS.MountOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationFSxOpenZFS.MountOptionsProperty>();
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NFSProperty`
 *
 * @param properties - the TypeScript properties of a `NFSProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLocationFSxOpenZFSNFSPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("mountOptions", cdk.requiredValidator)(properties.mountOptions));
  errors.collect(cdk.propertyValidator("mountOptions", CfnLocationFSxOpenZFSMountOptionsPropertyValidator)(properties.mountOptions));
  return errors.wrap("supplied properties not correct for \"NFSProperty\"");
}

// @ts-ignore TS6133
function convertCfnLocationFSxOpenZFSNFSPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLocationFSxOpenZFSNFSPropertyValidator(properties).assertSuccess();
  return {
    "MountOptions": convertCfnLocationFSxOpenZFSMountOptionsPropertyToCloudFormation(properties.mountOptions)
  };
}

// @ts-ignore TS6133
function CfnLocationFSxOpenZFSNFSPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLocationFSxOpenZFS.NFSProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationFSxOpenZFS.NFSProperty>();
  ret.addPropertyResult("mountOptions", "MountOptions", (properties.MountOptions != null ? CfnLocationFSxOpenZFSMountOptionsPropertyFromCloudFormation(properties.MountOptions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ProtocolProperty`
 *
 * @param properties - the TypeScript properties of a `ProtocolProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLocationFSxOpenZFSProtocolPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("nfs", CfnLocationFSxOpenZFSNFSPropertyValidator)(properties.nfs));
  return errors.wrap("supplied properties not correct for \"ProtocolProperty\"");
}

// @ts-ignore TS6133
function convertCfnLocationFSxOpenZFSProtocolPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLocationFSxOpenZFSProtocolPropertyValidator(properties).assertSuccess();
  return {
    "NFS": convertCfnLocationFSxOpenZFSNFSPropertyToCloudFormation(properties.nfs)
  };
}

// @ts-ignore TS6133
function CfnLocationFSxOpenZFSProtocolPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLocationFSxOpenZFS.ProtocolProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationFSxOpenZFS.ProtocolProperty>();
  ret.addPropertyResult("nfs", "NFS", (properties.NFS != null ? CfnLocationFSxOpenZFSNFSPropertyFromCloudFormation(properties.NFS) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnLocationFSxOpenZFSProps`
 *
 * @param properties - the TypeScript properties of a `CfnLocationFSxOpenZFSProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLocationFSxOpenZFSPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fsxFilesystemArn", cdk.validateString)(properties.fsxFilesystemArn));
  errors.collect(cdk.propertyValidator("protocol", cdk.requiredValidator)(properties.protocol));
  errors.collect(cdk.propertyValidator("protocol", CfnLocationFSxOpenZFSProtocolPropertyValidator)(properties.protocol));
  errors.collect(cdk.propertyValidator("securityGroupArns", cdk.requiredValidator)(properties.securityGroupArns));
  errors.collect(cdk.propertyValidator("securityGroupArns", cdk.listValidator(cdk.validateString))(properties.securityGroupArns));
  errors.collect(cdk.propertyValidator("subdirectory", cdk.validateString)(properties.subdirectory));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnLocationFSxOpenZFSProps\"");
}

// @ts-ignore TS6133
function convertCfnLocationFSxOpenZFSPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLocationFSxOpenZFSPropsValidator(properties).assertSuccess();
  return {
    "FsxFilesystemArn": cdk.stringToCloudFormation(properties.fsxFilesystemArn),
    "Protocol": convertCfnLocationFSxOpenZFSProtocolPropertyToCloudFormation(properties.protocol),
    "SecurityGroupArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupArns),
    "Subdirectory": cdk.stringToCloudFormation(properties.subdirectory),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnLocationFSxOpenZFSPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationFSxOpenZFSProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationFSxOpenZFSProps>();
  ret.addPropertyResult("fsxFilesystemArn", "FsxFilesystemArn", (properties.FsxFilesystemArn != null ? cfn_parse.FromCloudFormation.getString(properties.FsxFilesystemArn) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? CfnLocationFSxOpenZFSProtocolPropertyFromCloudFormation(properties.Protocol) : undefined));
  ret.addPropertyResult("securityGroupArns", "SecurityGroupArns", (properties.SecurityGroupArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupArns) : undefined));
  ret.addPropertyResult("subdirectory", "Subdirectory", (properties.Subdirectory != null ? cfn_parse.FromCloudFormation.getString(properties.Subdirectory) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::DataSync::LocationFSxWindows` resource specifies an endpoint for an Amazon FSx for Windows Server file system.
 *
 * @cloudformationResource AWS::DataSync::LocationFSxWindows
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxwindows.html
 */
export class CfnLocationFSxWindows extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DataSync::LocationFSxWindows";

  /**
   * Build a CfnLocationFSxWindows from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLocationFSxWindows {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLocationFSxWindowsPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLocationFSxWindows(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the specified FSx for Windows Server file system location.
   *
   * @cloudformationAttribute LocationArn
   */
  public readonly attrLocationArn: string;

  /**
   * The URI of the specified FSx for Windows Server file system location.
   *
   * @cloudformationAttribute LocationUri
   */
  public readonly attrLocationUri: string;

  /**
   * Specifies the name of the Microsoft Active Directory domain that the FSx for Windows File Server file system belongs to.
   */
  public domain?: string;

  /**
   * Specifies the Amazon Resource Name (ARN) for the FSx for Windows File Server file system.
   */
  public fsxFilesystemArn?: string;

  /**
   * Specifies the password of the user with the permissions to mount and access the files, folders, and file metadata in your FSx for Windows File Server file system.
   */
  public password?: string;

  /**
   * The Amazon Resource Names (ARNs) of the security groups that are used to configure the FSx for Windows File Server file system.
   */
  public securityGroupArns: Array<string>;

  /**
   * Specifies a mount path for your file system using forward slashes.
   */
  public subdirectory?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Specifies labels that help you categorize, filter, and search for your AWS resources.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The user who has the permissions to access files and folders in the FSx for Windows File Server file system.
   */
  public user: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLocationFSxWindowsProps) {
    super(scope, id, {
      "type": CfnLocationFSxWindows.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "securityGroupArns", this);
    cdk.requireProperty(props, "user", this);

    this.attrLocationArn = cdk.Token.asString(this.getAtt("LocationArn", cdk.ResolutionTypeHint.STRING));
    this.attrLocationUri = cdk.Token.asString(this.getAtt("LocationUri", cdk.ResolutionTypeHint.STRING));
    this.domain = props.domain;
    this.fsxFilesystemArn = props.fsxFilesystemArn;
    this.password = props.password;
    this.securityGroupArns = props.securityGroupArns;
    this.subdirectory = props.subdirectory;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DataSync::LocationFSxWindows", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.user = props.user;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "domain": this.domain,
      "fsxFilesystemArn": this.fsxFilesystemArn,
      "password": this.password,
      "securityGroupArns": this.securityGroupArns,
      "subdirectory": this.subdirectory,
      "tags": this.tags.renderTags(),
      "user": this.user
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLocationFSxWindows.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLocationFSxWindowsPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnLocationFSxWindows`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxwindows.html
 */
export interface CfnLocationFSxWindowsProps {
  /**
   * Specifies the name of the Microsoft Active Directory domain that the FSx for Windows File Server file system belongs to.
   *
   * If you have multiple Active Directory domains in your environment, configuring this parameter makes sure that DataSync connects to the right file system.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxwindows.html#cfn-datasync-locationfsxwindows-domain
   */
  readonly domain?: string;

  /**
   * Specifies the Amazon Resource Name (ARN) for the FSx for Windows File Server file system.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxwindows.html#cfn-datasync-locationfsxwindows-fsxfilesystemarn
   */
  readonly fsxFilesystemArn?: string;

  /**
   * Specifies the password of the user with the permissions to mount and access the files, folders, and file metadata in your FSx for Windows File Server file system.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxwindows.html#cfn-datasync-locationfsxwindows-password
   */
  readonly password?: string;

  /**
   * The Amazon Resource Names (ARNs) of the security groups that are used to configure the FSx for Windows File Server file system.
   *
   * *Pattern* : `^arn:(aws|aws-cn|aws-us-gov|aws-iso|aws-iso-b):ec2:[a-z\-0-9]*:[0-9]{12}:security-group/.*$`
   *
   * *Length constraints* : Maximum length of 128.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxwindows.html#cfn-datasync-locationfsxwindows-securitygrouparns
   */
  readonly securityGroupArns: Array<string>;

  /**
   * Specifies a mount path for your file system using forward slashes.
   *
   * This is where DataSync reads or writes data (depending on if this is a source or destination location).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxwindows.html#cfn-datasync-locationfsxwindows-subdirectory
   */
  readonly subdirectory?: string;

  /**
   * Specifies labels that help you categorize, filter, and search for your AWS resources.
   *
   * We recommend creating at least a name tag for your location.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxwindows.html#cfn-datasync-locationfsxwindows-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The user who has the permissions to access files and folders in the FSx for Windows File Server file system.
   *
   * For information about choosing a user name that ensures sufficient permissions to files, folders, and metadata, see [user](https://docs.aws.amazon.com/datasync/latest/userguide/create-fsx-location.html#FSxWuser) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationfsxwindows.html#cfn-datasync-locationfsxwindows-user
   */
  readonly user: string;
}

/**
 * Determine whether the given properties match those of a `CfnLocationFSxWindowsProps`
 *
 * @param properties - the TypeScript properties of a `CfnLocationFSxWindowsProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLocationFSxWindowsPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("domain", cdk.validateString)(properties.domain));
  errors.collect(cdk.propertyValidator("fsxFilesystemArn", cdk.validateString)(properties.fsxFilesystemArn));
  errors.collect(cdk.propertyValidator("password", cdk.validateString)(properties.password));
  errors.collect(cdk.propertyValidator("securityGroupArns", cdk.requiredValidator)(properties.securityGroupArns));
  errors.collect(cdk.propertyValidator("securityGroupArns", cdk.listValidator(cdk.validateString))(properties.securityGroupArns));
  errors.collect(cdk.propertyValidator("subdirectory", cdk.validateString)(properties.subdirectory));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("user", cdk.requiredValidator)(properties.user));
  errors.collect(cdk.propertyValidator("user", cdk.validateString)(properties.user));
  return errors.wrap("supplied properties not correct for \"CfnLocationFSxWindowsProps\"");
}

// @ts-ignore TS6133
function convertCfnLocationFSxWindowsPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLocationFSxWindowsPropsValidator(properties).assertSuccess();
  return {
    "Domain": cdk.stringToCloudFormation(properties.domain),
    "FsxFilesystemArn": cdk.stringToCloudFormation(properties.fsxFilesystemArn),
    "Password": cdk.stringToCloudFormation(properties.password),
    "SecurityGroupArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupArns),
    "Subdirectory": cdk.stringToCloudFormation(properties.subdirectory),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "User": cdk.stringToCloudFormation(properties.user)
  };
}

// @ts-ignore TS6133
function CfnLocationFSxWindowsPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationFSxWindowsProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationFSxWindowsProps>();
  ret.addPropertyResult("domain", "Domain", (properties.Domain != null ? cfn_parse.FromCloudFormation.getString(properties.Domain) : undefined));
  ret.addPropertyResult("fsxFilesystemArn", "FsxFilesystemArn", (properties.FsxFilesystemArn != null ? cfn_parse.FromCloudFormation.getString(properties.FsxFilesystemArn) : undefined));
  ret.addPropertyResult("password", "Password", (properties.Password != null ? cfn_parse.FromCloudFormation.getString(properties.Password) : undefined));
  ret.addPropertyResult("securityGroupArns", "SecurityGroupArns", (properties.SecurityGroupArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupArns) : undefined));
  ret.addPropertyResult("subdirectory", "Subdirectory", (properties.Subdirectory != null ? cfn_parse.FromCloudFormation.getString(properties.Subdirectory) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("user", "User", (properties.User != null ? cfn_parse.FromCloudFormation.getString(properties.User) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::DataSync::LocationHDFS` resource specifies an endpoint for a Hadoop Distributed File System (HDFS).
 *
 * @cloudformationResource AWS::DataSync::LocationHDFS
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html
 */
export class CfnLocationHDFS extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DataSync::LocationHDFS";

  /**
   * Build a CfnLocationHDFS from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLocationHDFS {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLocationHDFSPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLocationHDFS(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the HDFS cluster location to describe.
   *
   * @cloudformationAttribute LocationArn
   */
  public readonly attrLocationArn: string;

  /**
   * The URI of the HDFS cluster location.
   *
   * @cloudformationAttribute LocationUri
   */
  public readonly attrLocationUri: string;

  /**
   * The Amazon Resource Names (ARNs) of the agents that are used to connect to the HDFS cluster.
   */
  public agentArns: Array<string>;

  /**
   * The authentication mode used to determine identity of user.
   */
  public authenticationType: string;

  /**
   * The size of data blocks to write into the HDFS cluster.
   */
  public blockSize?: number;

  /**
   * The Kerberos key table (keytab) that contains mappings between the defined Kerberos principal and the encrypted keys.
   */
  public kerberosKeytab?: string;

  /**
   * The `krb5.conf` file that contains the Kerberos configuration information. You can load the `krb5.conf` by providing a string of the file's contents or an Amazon S3 presigned URL of the file. If `KERBEROS` is specified for `AuthType` , this value is required.
   */
  public kerberosKrb5Conf?: string;

  /**
   * The Kerberos principal with access to the files and folders on the HDFS cluster.
   */
  public kerberosPrincipal?: string;

  /**
   * The URI of the HDFS cluster's Key Management Server (KMS).
   */
  public kmsKeyProviderUri?: string;

  /**
   * The NameNode that manages the HDFS namespace.
   */
  public nameNodes: Array<cdk.IResolvable | CfnLocationHDFS.NameNodeProperty> | cdk.IResolvable;

  /**
   * The Quality of Protection (QOP) configuration specifies the Remote Procedure Call (RPC) and data transfer protection settings configured on the Hadoop Distributed File System (HDFS) cluster.
   */
  public qopConfiguration?: cdk.IResolvable | CfnLocationHDFS.QopConfigurationProperty;

  /**
   * The number of DataNodes to replicate the data to when writing to the HDFS cluster.
   */
  public replicationFactor?: number;

  /**
   * The user name used to identify the client on the host operating system.
   */
  public simpleUser?: string;

  /**
   * A subdirectory in the HDFS cluster.
   */
  public subdirectory?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The key-value pair that represents the tag that you want to add to the location.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLocationHDFSProps) {
    super(scope, id, {
      "type": CfnLocationHDFS.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "agentArns", this);
    cdk.requireProperty(props, "authenticationType", this);
    cdk.requireProperty(props, "nameNodes", this);

    this.attrLocationArn = cdk.Token.asString(this.getAtt("LocationArn", cdk.ResolutionTypeHint.STRING));
    this.attrLocationUri = cdk.Token.asString(this.getAtt("LocationUri", cdk.ResolutionTypeHint.STRING));
    this.agentArns = props.agentArns;
    this.authenticationType = props.authenticationType;
    this.blockSize = props.blockSize;
    this.kerberosKeytab = props.kerberosKeytab;
    this.kerberosKrb5Conf = props.kerberosKrb5Conf;
    this.kerberosPrincipal = props.kerberosPrincipal;
    this.kmsKeyProviderUri = props.kmsKeyProviderUri;
    this.nameNodes = props.nameNodes;
    this.qopConfiguration = props.qopConfiguration;
    this.replicationFactor = props.replicationFactor;
    this.simpleUser = props.simpleUser;
    this.subdirectory = props.subdirectory;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DataSync::LocationHDFS", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "agentArns": this.agentArns,
      "authenticationType": this.authenticationType,
      "blockSize": this.blockSize,
      "kerberosKeytab": this.kerberosKeytab,
      "kerberosKrb5Conf": this.kerberosKrb5Conf,
      "kerberosPrincipal": this.kerberosPrincipal,
      "kmsKeyProviderUri": this.kmsKeyProviderUri,
      "nameNodes": this.nameNodes,
      "qopConfiguration": this.qopConfiguration,
      "replicationFactor": this.replicationFactor,
      "simpleUser": this.simpleUser,
      "subdirectory": this.subdirectory,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLocationHDFS.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLocationHDFSPropsToCloudFormation(props);
  }
}

export namespace CfnLocationHDFS {
  /**
   * The Quality of Protection (QOP) configuration specifies the Remote Procedure Call (RPC) and data transfer privacy settings configured on the Hadoop Distributed File System (HDFS) cluster.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationhdfs-qopconfiguration.html
   */
  export interface QopConfigurationProperty {
    /**
     * The data transfer protection setting configured on the HDFS cluster.
     *
     * This setting corresponds to your `dfs.data.transfer.protection` setting in the `hdfs-site.xml` file on your Hadoop cluster.
     *
     * @default - "PRIVACY"
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationhdfs-qopconfiguration.html#cfn-datasync-locationhdfs-qopconfiguration-datatransferprotection
     */
    readonly dataTransferProtection?: string;

    /**
     * The Remote Procedure Call (RPC) protection setting configured on the HDFS cluster.
     *
     * This setting corresponds to your `hadoop.rpc.protection` setting in your `core-site.xml` file on your Hadoop cluster.
     *
     * @default - "PRIVACY"
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationhdfs-qopconfiguration.html#cfn-datasync-locationhdfs-qopconfiguration-rpcprotection
     */
    readonly rpcProtection?: string;
  }

  /**
   * The NameNode of the Hadoop Distributed File System (HDFS).
   *
   * The NameNode manages the file system's namespace and performs operations such as opening, closing, and renaming files and directories. The NameNode also contains the information to map blocks of data to the DataNodes.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationhdfs-namenode.html
   */
  export interface NameNodeProperty {
    /**
     * The hostname of the NameNode in the HDFS cluster.
     *
     * This value is the IP address or Domain Name Service (DNS) name of the NameNode. An agent that's installed on-premises uses this hostname to communicate with the NameNode in the network.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationhdfs-namenode.html#cfn-datasync-locationhdfs-namenode-hostname
     */
    readonly hostname: string;

    /**
     * The port that the NameNode uses to listen to client requests.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationhdfs-namenode.html#cfn-datasync-locationhdfs-namenode-port
     */
    readonly port: number;
  }
}

/**
 * Properties for defining a `CfnLocationHDFS`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html
 */
export interface CfnLocationHDFSProps {
  /**
   * The Amazon Resource Names (ARNs) of the agents that are used to connect to the HDFS cluster.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-agentarns
   */
  readonly agentArns: Array<string>;

  /**
   * The authentication mode used to determine identity of user.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-authenticationtype
   */
  readonly authenticationType: string;

  /**
   * The size of data blocks to write into the HDFS cluster.
   *
   * The block size must be a multiple of 512 bytes. The default block size is 128 mebibytes (MiB).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-blocksize
   */
  readonly blockSize?: number;

  /**
   * The Kerberos key table (keytab) that contains mappings between the defined Kerberos principal and the encrypted keys.
   *
   * Provide the base64-encoded file text. If `KERBEROS` is specified for `AuthType` , this value is required.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-kerberoskeytab
   */
  readonly kerberosKeytab?: string;

  /**
   * The `krb5.conf` file that contains the Kerberos configuration information. You can load the `krb5.conf` by providing a string of the file's contents or an Amazon S3 presigned URL of the file. If `KERBEROS` is specified for `AuthType` , this value is required.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-kerberoskrb5conf
   */
  readonly kerberosKrb5Conf?: string;

  /**
   * The Kerberos principal with access to the files and folders on the HDFS cluster.
   *
   * > If `KERBEROS` is specified for `AuthenticationType` , this parameter is required.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-kerberosprincipal
   */
  readonly kerberosPrincipal?: string;

  /**
   * The URI of the HDFS cluster's Key Management Server (KMS).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-kmskeyprovideruri
   */
  readonly kmsKeyProviderUri?: string;

  /**
   * The NameNode that manages the HDFS namespace.
   *
   * The NameNode performs operations such as opening, closing, and renaming files and directories. The NameNode contains the information to map blocks of data to the DataNodes. You can use only one NameNode.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-namenodes
   */
  readonly nameNodes: Array<cdk.IResolvable | CfnLocationHDFS.NameNodeProperty> | cdk.IResolvable;

  /**
   * The Quality of Protection (QOP) configuration specifies the Remote Procedure Call (RPC) and data transfer protection settings configured on the Hadoop Distributed File System (HDFS) cluster.
   *
   * If `QopConfiguration` isn't specified, `RpcProtection` and `DataTransferProtection` default to `PRIVACY` . If you set `RpcProtection` or `DataTransferProtection` , the other parameter assumes the same value.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-qopconfiguration
   */
  readonly qopConfiguration?: cdk.IResolvable | CfnLocationHDFS.QopConfigurationProperty;

  /**
   * The number of DataNodes to replicate the data to when writing to the HDFS cluster.
   *
   * By default, data is replicated to three DataNodes.
   *
   * @default - 3
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-replicationfactor
   */
  readonly replicationFactor?: number;

  /**
   * The user name used to identify the client on the host operating system.
   *
   * > If `SIMPLE` is specified for `AuthenticationType` , this parameter is required.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-simpleuser
   */
  readonly simpleUser?: string;

  /**
   * A subdirectory in the HDFS cluster.
   *
   * This subdirectory is used to read data from or write data to the HDFS cluster. If the subdirectory isn't specified, it will default to `/` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-subdirectory
   */
  readonly subdirectory?: string;

  /**
   * The key-value pair that represents the tag that you want to add to the location.
   *
   * The value can be an empty string. We recommend using tags to name your resources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationhdfs.html#cfn-datasync-locationhdfs-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `QopConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `QopConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLocationHDFSQopConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataTransferProtection", cdk.validateString)(properties.dataTransferProtection));
  errors.collect(cdk.propertyValidator("rpcProtection", cdk.validateString)(properties.rpcProtection));
  return errors.wrap("supplied properties not correct for \"QopConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnLocationHDFSQopConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLocationHDFSQopConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "DataTransferProtection": cdk.stringToCloudFormation(properties.dataTransferProtection),
    "RpcProtection": cdk.stringToCloudFormation(properties.rpcProtection)
  };
}

// @ts-ignore TS6133
function CfnLocationHDFSQopConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLocationHDFS.QopConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationHDFS.QopConfigurationProperty>();
  ret.addPropertyResult("dataTransferProtection", "DataTransferProtection", (properties.DataTransferProtection != null ? cfn_parse.FromCloudFormation.getString(properties.DataTransferProtection) : undefined));
  ret.addPropertyResult("rpcProtection", "RpcProtection", (properties.RpcProtection != null ? cfn_parse.FromCloudFormation.getString(properties.RpcProtection) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NameNodeProperty`
 *
 * @param properties - the TypeScript properties of a `NameNodeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLocationHDFSNameNodePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("hostname", cdk.requiredValidator)(properties.hostname));
  errors.collect(cdk.propertyValidator("hostname", cdk.validateString)(properties.hostname));
  errors.collect(cdk.propertyValidator("port", cdk.requiredValidator)(properties.port));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  return errors.wrap("supplied properties not correct for \"NameNodeProperty\"");
}

// @ts-ignore TS6133
function convertCfnLocationHDFSNameNodePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLocationHDFSNameNodePropertyValidator(properties).assertSuccess();
  return {
    "Hostname": cdk.stringToCloudFormation(properties.hostname),
    "Port": cdk.numberToCloudFormation(properties.port)
  };
}

// @ts-ignore TS6133
function CfnLocationHDFSNameNodePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLocationHDFS.NameNodeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationHDFS.NameNodeProperty>();
  ret.addPropertyResult("hostname", "Hostname", (properties.Hostname != null ? cfn_parse.FromCloudFormation.getString(properties.Hostname) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnLocationHDFSProps`
 *
 * @param properties - the TypeScript properties of a `CfnLocationHDFSProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLocationHDFSPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("agentArns", cdk.requiredValidator)(properties.agentArns));
  errors.collect(cdk.propertyValidator("agentArns", cdk.listValidator(cdk.validateString))(properties.agentArns));
  errors.collect(cdk.propertyValidator("authenticationType", cdk.requiredValidator)(properties.authenticationType));
  errors.collect(cdk.propertyValidator("authenticationType", cdk.validateString)(properties.authenticationType));
  errors.collect(cdk.propertyValidator("blockSize", cdk.validateNumber)(properties.blockSize));
  errors.collect(cdk.propertyValidator("kerberosKeytab", cdk.validateString)(properties.kerberosKeytab));
  errors.collect(cdk.propertyValidator("kerberosKrb5Conf", cdk.validateString)(properties.kerberosKrb5Conf));
  errors.collect(cdk.propertyValidator("kerberosPrincipal", cdk.validateString)(properties.kerberosPrincipal));
  errors.collect(cdk.propertyValidator("kmsKeyProviderUri", cdk.validateString)(properties.kmsKeyProviderUri));
  errors.collect(cdk.propertyValidator("nameNodes", cdk.requiredValidator)(properties.nameNodes));
  errors.collect(cdk.propertyValidator("nameNodes", cdk.listValidator(CfnLocationHDFSNameNodePropertyValidator))(properties.nameNodes));
  errors.collect(cdk.propertyValidator("qopConfiguration", CfnLocationHDFSQopConfigurationPropertyValidator)(properties.qopConfiguration));
  errors.collect(cdk.propertyValidator("replicationFactor", cdk.validateNumber)(properties.replicationFactor));
  errors.collect(cdk.propertyValidator("simpleUser", cdk.validateString)(properties.simpleUser));
  errors.collect(cdk.propertyValidator("subdirectory", cdk.validateString)(properties.subdirectory));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnLocationHDFSProps\"");
}

// @ts-ignore TS6133
function convertCfnLocationHDFSPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLocationHDFSPropsValidator(properties).assertSuccess();
  return {
    "AgentArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.agentArns),
    "AuthenticationType": cdk.stringToCloudFormation(properties.authenticationType),
    "BlockSize": cdk.numberToCloudFormation(properties.blockSize),
    "KerberosKeytab": cdk.stringToCloudFormation(properties.kerberosKeytab),
    "KerberosKrb5Conf": cdk.stringToCloudFormation(properties.kerberosKrb5Conf),
    "KerberosPrincipal": cdk.stringToCloudFormation(properties.kerberosPrincipal),
    "KmsKeyProviderUri": cdk.stringToCloudFormation(properties.kmsKeyProviderUri),
    "NameNodes": cdk.listMapper(convertCfnLocationHDFSNameNodePropertyToCloudFormation)(properties.nameNodes),
    "QopConfiguration": convertCfnLocationHDFSQopConfigurationPropertyToCloudFormation(properties.qopConfiguration),
    "ReplicationFactor": cdk.numberToCloudFormation(properties.replicationFactor),
    "SimpleUser": cdk.stringToCloudFormation(properties.simpleUser),
    "Subdirectory": cdk.stringToCloudFormation(properties.subdirectory),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnLocationHDFSPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationHDFSProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationHDFSProps>();
  ret.addPropertyResult("agentArns", "AgentArns", (properties.AgentArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AgentArns) : undefined));
  ret.addPropertyResult("authenticationType", "AuthenticationType", (properties.AuthenticationType != null ? cfn_parse.FromCloudFormation.getString(properties.AuthenticationType) : undefined));
  ret.addPropertyResult("blockSize", "BlockSize", (properties.BlockSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.BlockSize) : undefined));
  ret.addPropertyResult("kerberosKeytab", "KerberosKeytab", (properties.KerberosKeytab != null ? cfn_parse.FromCloudFormation.getString(properties.KerberosKeytab) : undefined));
  ret.addPropertyResult("kerberosKrb5Conf", "KerberosKrb5Conf", (properties.KerberosKrb5Conf != null ? cfn_parse.FromCloudFormation.getString(properties.KerberosKrb5Conf) : undefined));
  ret.addPropertyResult("kerberosPrincipal", "KerberosPrincipal", (properties.KerberosPrincipal != null ? cfn_parse.FromCloudFormation.getString(properties.KerberosPrincipal) : undefined));
  ret.addPropertyResult("kmsKeyProviderUri", "KmsKeyProviderUri", (properties.KmsKeyProviderUri != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyProviderUri) : undefined));
  ret.addPropertyResult("nameNodes", "NameNodes", (properties.NameNodes != null ? cfn_parse.FromCloudFormation.getArray(CfnLocationHDFSNameNodePropertyFromCloudFormation)(properties.NameNodes) : undefined));
  ret.addPropertyResult("qopConfiguration", "QopConfiguration", (properties.QopConfiguration != null ? CfnLocationHDFSQopConfigurationPropertyFromCloudFormation(properties.QopConfiguration) : undefined));
  ret.addPropertyResult("replicationFactor", "ReplicationFactor", (properties.ReplicationFactor != null ? cfn_parse.FromCloudFormation.getNumber(properties.ReplicationFactor) : undefined));
  ret.addPropertyResult("simpleUser", "SimpleUser", (properties.SimpleUser != null ? cfn_parse.FromCloudFormation.getString(properties.SimpleUser) : undefined));
  ret.addPropertyResult("subdirectory", "Subdirectory", (properties.Subdirectory != null ? cfn_parse.FromCloudFormation.getString(properties.Subdirectory) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::DataSync::LocationNFS` resource specifies a Network File System (NFS) file server that AWS DataSync can use as a transfer source or destination.
 *
 * @cloudformationResource AWS::DataSync::LocationNFS
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationnfs.html
 */
export class CfnLocationNFS extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DataSync::LocationNFS";

  /**
   * Build a CfnLocationNFS from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLocationNFS {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLocationNFSPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLocationNFS(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the NFS location that you created.
   *
   * @cloudformationAttribute LocationArn
   */
  public readonly attrLocationArn: string;

  /**
   * The URI of the NFS location that you created.
   *
   * @cloudformationAttribute LocationUri
   */
  public readonly attrLocationUri: string;

  /**
   * Specifies the options that DataSync can use to mount your NFS file server.
   */
  public mountOptions?: cdk.IResolvable | CfnLocationNFS.MountOptionsProperty;

  /**
   * Specifies the Amazon Resource Name (ARN) of the DataSync agent that want to connect to your NFS file server.
   */
  public onPremConfig: cdk.IResolvable | CfnLocationNFS.OnPremConfigProperty;

  /**
   * Specifies the Domain Name System (DNS) name or IP version 4 address of the NFS file server that your DataSync agent connects to.
   */
  public serverHostname?: string;

  /**
   * Specifies the export path in your NFS file server that you want DataSync to mount.
   */
  public subdirectory?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Specifies labels that help you categorize, filter, and search for your AWS resources.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLocationNFSProps) {
    super(scope, id, {
      "type": CfnLocationNFS.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "onPremConfig", this);

    this.attrLocationArn = cdk.Token.asString(this.getAtt("LocationArn", cdk.ResolutionTypeHint.STRING));
    this.attrLocationUri = cdk.Token.asString(this.getAtt("LocationUri", cdk.ResolutionTypeHint.STRING));
    this.mountOptions = props.mountOptions;
    this.onPremConfig = props.onPremConfig;
    this.serverHostname = props.serverHostname;
    this.subdirectory = props.subdirectory;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DataSync::LocationNFS", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "mountOptions": this.mountOptions,
      "onPremConfig": this.onPremConfig,
      "serverHostname": this.serverHostname,
      "subdirectory": this.subdirectory,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLocationNFS.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLocationNFSPropsToCloudFormation(props);
  }
}

export namespace CfnLocationNFS {
  /**
   * Specifies the options that DataSync can use to mount your NFS file server.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationnfs-mountoptions.html
   */
  export interface MountOptionsProperty {
    /**
     * Specifies the NFS version that you want DataSync to use when mounting your NFS share.
     *
     * If the server refuses to use the version specified, the task fails.
     *
     * You can specify the following options:
     *
     * - `AUTOMATIC` (default): DataSync chooses NFS version 4.1.
     * - `NFS3` : Stateless protocol version that allows for asynchronous writes on the server.
     * - `NFSv4_0` : Stateful, firewall-friendly protocol version that supports delegations and pseudo file systems.
     * - `NFSv4_1` : Stateful protocol version that supports sessions, directory delegations, and parallel data processing. NFS version 4.1 also includes all features available in version 4.0.
     *
     * > DataSync currently only supports NFS version 3 with Amazon FSx for NetApp ONTAP locations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationnfs-mountoptions.html#cfn-datasync-locationnfs-mountoptions-version
     */
    readonly version?: string;
  }

  /**
   * The AWS DataSync agents that are connecting to a Network File System (NFS) location.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationnfs-onpremconfig.html
   */
  export interface OnPremConfigProperty {
    /**
     * The Amazon Resource Names (ARNs) of the agents connecting to a transfer location.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationnfs-onpremconfig.html#cfn-datasync-locationnfs-onpremconfig-agentarns
     */
    readonly agentArns: Array<string>;
  }
}

/**
 * Properties for defining a `CfnLocationNFS`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationnfs.html
 */
export interface CfnLocationNFSProps {
  /**
   * Specifies the options that DataSync can use to mount your NFS file server.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationnfs.html#cfn-datasync-locationnfs-mountoptions
   */
  readonly mountOptions?: cdk.IResolvable | CfnLocationNFS.MountOptionsProperty;

  /**
   * Specifies the Amazon Resource Name (ARN) of the DataSync agent that want to connect to your NFS file server.
   *
   * You can specify more than one agent. For more information, see [Using multiple agents for transfers](https://docs.aws.amazon.com/datasync/latest/userguide/multiple-agents.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationnfs.html#cfn-datasync-locationnfs-onpremconfig
   */
  readonly onPremConfig: cdk.IResolvable | CfnLocationNFS.OnPremConfigProperty;

  /**
   * Specifies the Domain Name System (DNS) name or IP version 4 address of the NFS file server that your DataSync agent connects to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationnfs.html#cfn-datasync-locationnfs-serverhostname
   */
  readonly serverHostname?: string;

  /**
   * Specifies the export path in your NFS file server that you want DataSync to mount.
   *
   * This path (or a subdirectory of the path) is where DataSync transfers data to or from. For information on configuring an export for DataSync, see [Accessing NFS file servers](https://docs.aws.amazon.com/datasync/latest/userguide/create-nfs-location.html#accessing-nfs) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationnfs.html#cfn-datasync-locationnfs-subdirectory
   */
  readonly subdirectory?: string;

  /**
   * Specifies labels that help you categorize, filter, and search for your AWS resources.
   *
   * We recommend creating at least a name tag for your location.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationnfs.html#cfn-datasync-locationnfs-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `MountOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `MountOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLocationNFSMountOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"MountOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnLocationNFSMountOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLocationNFSMountOptionsPropertyValidator(properties).assertSuccess();
  return {
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnLocationNFSMountOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLocationNFS.MountOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationNFS.MountOptionsProperty>();
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OnPremConfigProperty`
 *
 * @param properties - the TypeScript properties of a `OnPremConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLocationNFSOnPremConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("agentArns", cdk.requiredValidator)(properties.agentArns));
  errors.collect(cdk.propertyValidator("agentArns", cdk.listValidator(cdk.validateString))(properties.agentArns));
  return errors.wrap("supplied properties not correct for \"OnPremConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnLocationNFSOnPremConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLocationNFSOnPremConfigPropertyValidator(properties).assertSuccess();
  return {
    "AgentArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.agentArns)
  };
}

// @ts-ignore TS6133
function CfnLocationNFSOnPremConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLocationNFS.OnPremConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationNFS.OnPremConfigProperty>();
  ret.addPropertyResult("agentArns", "AgentArns", (properties.AgentArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AgentArns) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnLocationNFSProps`
 *
 * @param properties - the TypeScript properties of a `CfnLocationNFSProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLocationNFSPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("mountOptions", CfnLocationNFSMountOptionsPropertyValidator)(properties.mountOptions));
  errors.collect(cdk.propertyValidator("onPremConfig", cdk.requiredValidator)(properties.onPremConfig));
  errors.collect(cdk.propertyValidator("onPremConfig", CfnLocationNFSOnPremConfigPropertyValidator)(properties.onPremConfig));
  errors.collect(cdk.propertyValidator("serverHostname", cdk.validateString)(properties.serverHostname));
  errors.collect(cdk.propertyValidator("subdirectory", cdk.validateString)(properties.subdirectory));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnLocationNFSProps\"");
}

// @ts-ignore TS6133
function convertCfnLocationNFSPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLocationNFSPropsValidator(properties).assertSuccess();
  return {
    "MountOptions": convertCfnLocationNFSMountOptionsPropertyToCloudFormation(properties.mountOptions),
    "OnPremConfig": convertCfnLocationNFSOnPremConfigPropertyToCloudFormation(properties.onPremConfig),
    "ServerHostname": cdk.stringToCloudFormation(properties.serverHostname),
    "Subdirectory": cdk.stringToCloudFormation(properties.subdirectory),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnLocationNFSPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationNFSProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationNFSProps>();
  ret.addPropertyResult("mountOptions", "MountOptions", (properties.MountOptions != null ? CfnLocationNFSMountOptionsPropertyFromCloudFormation(properties.MountOptions) : undefined));
  ret.addPropertyResult("onPremConfig", "OnPremConfig", (properties.OnPremConfig != null ? CfnLocationNFSOnPremConfigPropertyFromCloudFormation(properties.OnPremConfig) : undefined));
  ret.addPropertyResult("serverHostname", "ServerHostname", (properties.ServerHostname != null ? cfn_parse.FromCloudFormation.getString(properties.ServerHostname) : undefined));
  ret.addPropertyResult("subdirectory", "Subdirectory", (properties.Subdirectory != null ? cfn_parse.FromCloudFormation.getString(properties.Subdirectory) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::DataSync::LocationObjectStorage` resource specifies an endpoint for a self-managed object storage bucket.
 *
 * For more information about self-managed object storage locations, see [Creating a Location for Object Storage](https://docs.aws.amazon.com/datasync/latest/userguide/create-object-location.html) .
 *
 * @cloudformationResource AWS::DataSync::LocationObjectStorage
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationobjectstorage.html
 */
export class CfnLocationObjectStorage extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DataSync::LocationObjectStorage";

  /**
   * Build a CfnLocationObjectStorage from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLocationObjectStorage {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLocationObjectStoragePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLocationObjectStorage(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the specified object storage location.
   *
   * @cloudformationAttribute LocationArn
   */
  public readonly attrLocationArn: string;

  /**
   * The URI of the specified object storage location.
   *
   * @cloudformationAttribute LocationUri
   */
  public readonly attrLocationUri: string;

  /**
   * Specifies the access key (for example, a user name) if credentials are required to authenticate with the object storage server.
   */
  public accessKey?: string;

  /**
   * Specifies the Amazon Resource Names (ARNs) of the DataSync agents that can securely connect with your location.
   */
  public agentArns: Array<string>;

  /**
   * Specifies the name of the object storage bucket involved in the transfer.
   */
  public bucketName?: string;

  /**
   * Specifies the secret key (for example, a password) if credentials are required to authenticate with the object storage server.
   */
  public secretKey?: string;

  /**
   * Specifies a file with the certificates that are used to sign the object storage server's certificate (for example, `file:///home/user/.ssh/storage_sys_certificate.pem` ). The file you specify must include the following:.
   */
  public serverCertificate?: string;

  /**
   * Specifies the domain name or IP address of the object storage server.
   */
  public serverHostname?: string;

  /**
   * Specifies the port that your object storage server accepts inbound network traffic on (for example, port 443).
   */
  public serverPort?: number;

  /**
   * Specifies the protocol that your object storage server uses to communicate.
   */
  public serverProtocol?: string;

  /**
   * Specifies the object prefix for your object storage server.
   */
  public subdirectory?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Specifies the key-value pair that represents a tag that you want to add to the resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLocationObjectStorageProps) {
    super(scope, id, {
      "type": CfnLocationObjectStorage.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "agentArns", this);

    this.attrLocationArn = cdk.Token.asString(this.getAtt("LocationArn", cdk.ResolutionTypeHint.STRING));
    this.attrLocationUri = cdk.Token.asString(this.getAtt("LocationUri", cdk.ResolutionTypeHint.STRING));
    this.accessKey = props.accessKey;
    this.agentArns = props.agentArns;
    this.bucketName = props.bucketName;
    this.secretKey = props.secretKey;
    this.serverCertificate = props.serverCertificate;
    this.serverHostname = props.serverHostname;
    this.serverPort = props.serverPort;
    this.serverProtocol = props.serverProtocol;
    this.subdirectory = props.subdirectory;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DataSync::LocationObjectStorage", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accessKey": this.accessKey,
      "agentArns": this.agentArns,
      "bucketName": this.bucketName,
      "secretKey": this.secretKey,
      "serverCertificate": this.serverCertificate,
      "serverHostname": this.serverHostname,
      "serverPort": this.serverPort,
      "serverProtocol": this.serverProtocol,
      "subdirectory": this.subdirectory,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLocationObjectStorage.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLocationObjectStoragePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnLocationObjectStorage`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationobjectstorage.html
 */
export interface CfnLocationObjectStorageProps {
  /**
   * Specifies the access key (for example, a user name) if credentials are required to authenticate with the object storage server.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationobjectstorage.html#cfn-datasync-locationobjectstorage-accesskey
   */
  readonly accessKey?: string;

  /**
   * Specifies the Amazon Resource Names (ARNs) of the DataSync agents that can securely connect with your location.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationobjectstorage.html#cfn-datasync-locationobjectstorage-agentarns
   */
  readonly agentArns: Array<string>;

  /**
   * Specifies the name of the object storage bucket involved in the transfer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationobjectstorage.html#cfn-datasync-locationobjectstorage-bucketname
   */
  readonly bucketName?: string;

  /**
   * Specifies the secret key (for example, a password) if credentials are required to authenticate with the object storage server.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationobjectstorage.html#cfn-datasync-locationobjectstorage-secretkey
   */
  readonly secretKey?: string;

  /**
   * Specifies a file with the certificates that are used to sign the object storage server's certificate (for example, `file:///home/user/.ssh/storage_sys_certificate.pem` ). The file you specify must include the following:.
   *
   * - The certificate of the signing certificate authority (CA)
   * - Any intermediate certificates
   * - base64 encoding
   * - A `.pem` extension
   *
   * The file can be up to 32768 bytes (before base64 encoding).
   *
   * To use this parameter, configure `ServerProtocol` to `HTTPS` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationobjectstorage.html#cfn-datasync-locationobjectstorage-servercertificate
   */
  readonly serverCertificate?: string;

  /**
   * Specifies the domain name or IP address of the object storage server.
   *
   * A DataSync agent uses this hostname to mount the object storage server in a network.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationobjectstorage.html#cfn-datasync-locationobjectstorage-serverhostname
   */
  readonly serverHostname?: string;

  /**
   * Specifies the port that your object storage server accepts inbound network traffic on (for example, port 443).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationobjectstorage.html#cfn-datasync-locationobjectstorage-serverport
   */
  readonly serverPort?: number;

  /**
   * Specifies the protocol that your object storage server uses to communicate.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationobjectstorage.html#cfn-datasync-locationobjectstorage-serverprotocol
   */
  readonly serverProtocol?: string;

  /**
   * Specifies the object prefix for your object storage server.
   *
   * If this is a source location, DataSync only copies objects with this prefix. If this is a destination location, DataSync writes all objects with this prefix.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationobjectstorage.html#cfn-datasync-locationobjectstorage-subdirectory
   */
  readonly subdirectory?: string;

  /**
   * Specifies the key-value pair that represents a tag that you want to add to the resource.
   *
   * Tags can help you manage, filter, and search for your resources. We recommend creating a name tag for your location.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationobjectstorage.html#cfn-datasync-locationobjectstorage-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnLocationObjectStorageProps`
 *
 * @param properties - the TypeScript properties of a `CfnLocationObjectStorageProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLocationObjectStoragePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessKey", cdk.validateString)(properties.accessKey));
  errors.collect(cdk.propertyValidator("agentArns", cdk.requiredValidator)(properties.agentArns));
  errors.collect(cdk.propertyValidator("agentArns", cdk.listValidator(cdk.validateString))(properties.agentArns));
  errors.collect(cdk.propertyValidator("bucketName", cdk.validateString)(properties.bucketName));
  errors.collect(cdk.propertyValidator("secretKey", cdk.validateString)(properties.secretKey));
  errors.collect(cdk.propertyValidator("serverCertificate", cdk.validateString)(properties.serverCertificate));
  errors.collect(cdk.propertyValidator("serverHostname", cdk.validateString)(properties.serverHostname));
  errors.collect(cdk.propertyValidator("serverPort", cdk.validateNumber)(properties.serverPort));
  errors.collect(cdk.propertyValidator("serverProtocol", cdk.validateString)(properties.serverProtocol));
  errors.collect(cdk.propertyValidator("subdirectory", cdk.validateString)(properties.subdirectory));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnLocationObjectStorageProps\"");
}

// @ts-ignore TS6133
function convertCfnLocationObjectStoragePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLocationObjectStoragePropsValidator(properties).assertSuccess();
  return {
    "AccessKey": cdk.stringToCloudFormation(properties.accessKey),
    "AgentArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.agentArns),
    "BucketName": cdk.stringToCloudFormation(properties.bucketName),
    "SecretKey": cdk.stringToCloudFormation(properties.secretKey),
    "ServerCertificate": cdk.stringToCloudFormation(properties.serverCertificate),
    "ServerHostname": cdk.stringToCloudFormation(properties.serverHostname),
    "ServerPort": cdk.numberToCloudFormation(properties.serverPort),
    "ServerProtocol": cdk.stringToCloudFormation(properties.serverProtocol),
    "Subdirectory": cdk.stringToCloudFormation(properties.subdirectory),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnLocationObjectStoragePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationObjectStorageProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationObjectStorageProps>();
  ret.addPropertyResult("accessKey", "AccessKey", (properties.AccessKey != null ? cfn_parse.FromCloudFormation.getString(properties.AccessKey) : undefined));
  ret.addPropertyResult("agentArns", "AgentArns", (properties.AgentArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AgentArns) : undefined));
  ret.addPropertyResult("bucketName", "BucketName", (properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined));
  ret.addPropertyResult("secretKey", "SecretKey", (properties.SecretKey != null ? cfn_parse.FromCloudFormation.getString(properties.SecretKey) : undefined));
  ret.addPropertyResult("serverCertificate", "ServerCertificate", (properties.ServerCertificate != null ? cfn_parse.FromCloudFormation.getString(properties.ServerCertificate) : undefined));
  ret.addPropertyResult("serverHostname", "ServerHostname", (properties.ServerHostname != null ? cfn_parse.FromCloudFormation.getString(properties.ServerHostname) : undefined));
  ret.addPropertyResult("serverPort", "ServerPort", (properties.ServerPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.ServerPort) : undefined));
  ret.addPropertyResult("serverProtocol", "ServerProtocol", (properties.ServerProtocol != null ? cfn_parse.FromCloudFormation.getString(properties.ServerProtocol) : undefined));
  ret.addPropertyResult("subdirectory", "Subdirectory", (properties.Subdirectory != null ? cfn_parse.FromCloudFormation.getString(properties.Subdirectory) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::DataSync::LocationS3` resource specifies an endpoint for an Amazon S3 bucket.
 *
 * For more information, see [Create an Amazon S3 location](https://docs.aws.amazon.com/datasync/latest/userguide/create-locations-cli.html#create-location-s3-cli) in the *AWS DataSync User Guide* .
 *
 * @cloudformationResource AWS::DataSync::LocationS3
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locations3.html
 */
export class CfnLocationS3 extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DataSync::LocationS3";

  /**
   * Build a CfnLocationS3 from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLocationS3 {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLocationS3PropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLocationS3(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the specified Amazon S3 location.
   *
   * @cloudformationAttribute LocationArn
   */
  public readonly attrLocationArn: string;

  /**
   * The URI of the specified Amazon S3 location.
   *
   * @cloudformationAttribute LocationUri
   */
  public readonly attrLocationUri: string;

  /**
   * The ARN of the Amazon S3 bucket.
   */
  public s3BucketArn?: string;

  /**
   * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role that is used to access an Amazon S3 bucket.
   */
  public s3Config: cdk.IResolvable | CfnLocationS3.S3ConfigProperty;

  /**
   * The Amazon S3 storage class that you want to store your files in when this location is used as a task destination.
   */
  public s3StorageClass?: string;

  /**
   * A subdirectory in the Amazon S3 bucket.
   */
  public subdirectory?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The key-value pair that represents the tag that you want to add to the location.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLocationS3Props) {
    super(scope, id, {
      "type": CfnLocationS3.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "s3Config", this);

    this.attrLocationArn = cdk.Token.asString(this.getAtt("LocationArn", cdk.ResolutionTypeHint.STRING));
    this.attrLocationUri = cdk.Token.asString(this.getAtt("LocationUri", cdk.ResolutionTypeHint.STRING));
    this.s3BucketArn = props.s3BucketArn;
    this.s3Config = props.s3Config;
    this.s3StorageClass = props.s3StorageClass;
    this.subdirectory = props.subdirectory;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DataSync::LocationS3", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "s3BucketArn": this.s3BucketArn,
      "s3Config": this.s3Config,
      "s3StorageClass": this.s3StorageClass,
      "subdirectory": this.subdirectory,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLocationS3.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLocationS3PropsToCloudFormation(props);
  }
}

export namespace CfnLocationS3 {
  /**
   * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role used to access an Amazon S3 bucket.
   *
   * For detailed information about using such a role, see [Creating a Location for Amazon S3](https://docs.aws.amazon.com/datasync/latest/userguide/create-s3-location.html) in the *AWS DataSync User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locations3-s3config.html
   */
  export interface S3ConfigProperty {
    /**
     * The ARN of the IAM role for accessing the S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locations3-s3config.html#cfn-datasync-locations3-s3config-bucketaccessrolearn
     */
    readonly bucketAccessRoleArn: string;
  }
}

/**
 * Properties for defining a `CfnLocationS3`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locations3.html
 */
export interface CfnLocationS3Props {
  /**
   * The ARN of the Amazon S3 bucket.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locations3.html#cfn-datasync-locations3-s3bucketarn
   */
  readonly s3BucketArn?: string;

  /**
   * The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role that is used to access an Amazon S3 bucket.
   *
   * For detailed information about using such a role, see [Creating a Location for Amazon S3](https://docs.aws.amazon.com/datasync/latest/userguide/working-with-locations.html#create-s3-location) in the *AWS DataSync User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locations3.html#cfn-datasync-locations3-s3config
   */
  readonly s3Config: cdk.IResolvable | CfnLocationS3.S3ConfigProperty;

  /**
   * The Amazon S3 storage class that you want to store your files in when this location is used as a task destination.
   *
   * For buckets in AWS Regions , the storage class defaults to S3 Standard.
   *
   * For more information about S3 storage classes, see [Amazon S3 Storage Classes](https://docs.aws.amazon.com/s3/storage-classes/) . Some storage classes have behaviors that can affect your S3 storage costs. For detailed information, see [Considerations When Working with Amazon S3 Storage Classes in DataSync](https://docs.aws.amazon.com/datasync/latest/userguide/create-s3-location.html#using-storage-classes) .
   *
   * @default - "STANDARD"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locations3.html#cfn-datasync-locations3-s3storageclass
   */
  readonly s3StorageClass?: string;

  /**
   * A subdirectory in the Amazon S3 bucket.
   *
   * This subdirectory in Amazon S3 is used to read data from the S3 source location or write data to the S3 destination.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locations3.html#cfn-datasync-locations3-subdirectory
   */
  readonly subdirectory?: string;

  /**
   * The key-value pair that represents the tag that you want to add to the location.
   *
   * The value can be an empty string. We recommend using tags to name your resources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locations3.html#cfn-datasync-locations3-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `S3ConfigProperty`
 *
 * @param properties - the TypeScript properties of a `S3ConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLocationS3S3ConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketAccessRoleArn", cdk.requiredValidator)(properties.bucketAccessRoleArn));
  errors.collect(cdk.propertyValidator("bucketAccessRoleArn", cdk.validateString)(properties.bucketAccessRoleArn));
  return errors.wrap("supplied properties not correct for \"S3ConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnLocationS3S3ConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLocationS3S3ConfigPropertyValidator(properties).assertSuccess();
  return {
    "BucketAccessRoleArn": cdk.stringToCloudFormation(properties.bucketAccessRoleArn)
  };
}

// @ts-ignore TS6133
function CfnLocationS3S3ConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLocationS3.S3ConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationS3.S3ConfigProperty>();
  ret.addPropertyResult("bucketAccessRoleArn", "BucketAccessRoleArn", (properties.BucketAccessRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.BucketAccessRoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnLocationS3Props`
 *
 * @param properties - the TypeScript properties of a `CfnLocationS3Props`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLocationS3PropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("s3BucketArn", cdk.validateString)(properties.s3BucketArn));
  errors.collect(cdk.propertyValidator("s3Config", cdk.requiredValidator)(properties.s3Config));
  errors.collect(cdk.propertyValidator("s3Config", CfnLocationS3S3ConfigPropertyValidator)(properties.s3Config));
  errors.collect(cdk.propertyValidator("s3StorageClass", cdk.validateString)(properties.s3StorageClass));
  errors.collect(cdk.propertyValidator("subdirectory", cdk.validateString)(properties.subdirectory));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnLocationS3Props\"");
}

// @ts-ignore TS6133
function convertCfnLocationS3PropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLocationS3PropsValidator(properties).assertSuccess();
  return {
    "S3BucketArn": cdk.stringToCloudFormation(properties.s3BucketArn),
    "S3Config": convertCfnLocationS3S3ConfigPropertyToCloudFormation(properties.s3Config),
    "S3StorageClass": cdk.stringToCloudFormation(properties.s3StorageClass),
    "Subdirectory": cdk.stringToCloudFormation(properties.subdirectory),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnLocationS3PropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationS3Props | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationS3Props>();
  ret.addPropertyResult("s3BucketArn", "S3BucketArn", (properties.S3BucketArn != null ? cfn_parse.FromCloudFormation.getString(properties.S3BucketArn) : undefined));
  ret.addPropertyResult("s3Config", "S3Config", (properties.S3Config != null ? CfnLocationS3S3ConfigPropertyFromCloudFormation(properties.S3Config) : undefined));
  ret.addPropertyResult("s3StorageClass", "S3StorageClass", (properties.S3StorageClass != null ? cfn_parse.FromCloudFormation.getString(properties.S3StorageClass) : undefined));
  ret.addPropertyResult("subdirectory", "Subdirectory", (properties.Subdirectory != null ? cfn_parse.FromCloudFormation.getString(properties.Subdirectory) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::DataSync::LocationSMB` resource specifies a Server Message Block (SMB) location.
 *
 * @cloudformationResource AWS::DataSync::LocationSMB
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationsmb.html
 */
export class CfnLocationSMB extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DataSync::LocationSMB";

  /**
   * Build a CfnLocationSMB from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLocationSMB {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLocationSMBPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLocationSMB(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the specified SMB file system.
   *
   * @cloudformationAttribute LocationArn
   */
  public readonly attrLocationArn: string;

  /**
   * The URI of the specified SMB location.
   *
   * @cloudformationAttribute LocationUri
   */
  public readonly attrLocationUri: string;

  /**
   * The Amazon Resource Names (ARNs) of agents to use for a Server Message Block (SMB) location.
   */
  public agentArns: Array<string>;

  /**
   * Specifies the name of the Active Directory domain that your SMB file server belongs to.
   */
  public domain?: string;

  /**
   * Specifies the version of the SMB protocol that DataSync uses to access your SMB file server.
   */
  public mountOptions?: cdk.IResolvable | CfnLocationSMB.MountOptionsProperty;

  /**
   * The password of the user who can mount the share and has the permissions to access files and folders in the SMB share.
   */
  public password?: string;

  /**
   * Specifies the Domain Name Service (DNS) name or IP address of the SMB file server that your DataSync agent will mount.
   */
  public serverHostname?: string;

  /**
   * The subdirectory in the SMB file system that is used to read data from the SMB source location or write data to the SMB destination.
   */
  public subdirectory?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Specifies labels that help you categorize, filter, and search for your AWS resources.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The user who can mount the share and has the permissions to access files and folders in the SMB share.
   */
  public user: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLocationSMBProps) {
    super(scope, id, {
      "type": CfnLocationSMB.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "agentArns", this);
    cdk.requireProperty(props, "user", this);

    this.attrLocationArn = cdk.Token.asString(this.getAtt("LocationArn", cdk.ResolutionTypeHint.STRING));
    this.attrLocationUri = cdk.Token.asString(this.getAtt("LocationUri", cdk.ResolutionTypeHint.STRING));
    this.agentArns = props.agentArns;
    this.domain = props.domain;
    this.mountOptions = props.mountOptions;
    this.password = props.password;
    this.serverHostname = props.serverHostname;
    this.subdirectory = props.subdirectory;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DataSync::LocationSMB", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.user = props.user;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "agentArns": this.agentArns,
      "domain": this.domain,
      "mountOptions": this.mountOptions,
      "password": this.password,
      "serverHostname": this.serverHostname,
      "subdirectory": this.subdirectory,
      "tags": this.tags.renderTags(),
      "user": this.user
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLocationSMB.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLocationSMBPropsToCloudFormation(props);
  }
}

export namespace CfnLocationSMB {
  /**
   * Specifies the version of the SMB protocol that DataSync uses to access your SMB file server.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationsmb-mountoptions.html
   */
  export interface MountOptionsProperty {
    /**
     * By default, DataSync automatically chooses an SMB protocol version based on negotiation with your SMB file server.
     *
     * You also can configure DataSync to use a specific SMB version, but we recommend doing this only if DataSync has trouble negotiating with the SMB file server automatically.
     *
     * These are the following options for configuring the SMB version:
     *
     * - `AUTOMATIC` (default): DataSync and the SMB file server negotiate the highest version of SMB that they mutually support between 2.1 and 3.1.1.
     *
     * This is the recommended option. If you instead choose a specific version that your file server doesn't support, you may get an `Operation Not Supported` error.
     * - `SMB3` : Restricts the protocol negotiation to only SMB version 3.0.2.
     * - `SMB2` : Restricts the protocol negotiation to only SMB version 2.1.
     * - `SMB2_0` : Restricts the protocol negotiation to only SMB version 2.0.
     * - `SMB1` : Restricts the protocol negotiation to only SMB version 1.0.
     *
     * > The `SMB1` option isn't available when [creating an Amazon FSx for NetApp ONTAP location](https://docs.aws.amazon.com/datasync/latest/userguide/API_CreateLocationFsxOntap.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-locationsmb-mountoptions.html#cfn-datasync-locationsmb-mountoptions-version
     */
    readonly version?: string;
  }
}

/**
 * Properties for defining a `CfnLocationSMB`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationsmb.html
 */
export interface CfnLocationSMBProps {
  /**
   * The Amazon Resource Names (ARNs) of agents to use for a Server Message Block (SMB) location.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationsmb.html#cfn-datasync-locationsmb-agentarns
   */
  readonly agentArns: Array<string>;

  /**
   * Specifies the name of the Active Directory domain that your SMB file server belongs to.
   *
   * If you have multiple Active Directory domains in your environment, configuring this parameter makes sure that DataSync connects to the right file server.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationsmb.html#cfn-datasync-locationsmb-domain
   */
  readonly domain?: string;

  /**
   * Specifies the version of the SMB protocol that DataSync uses to access your SMB file server.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationsmb.html#cfn-datasync-locationsmb-mountoptions
   */
  readonly mountOptions?: cdk.IResolvable | CfnLocationSMB.MountOptionsProperty;

  /**
   * The password of the user who can mount the share and has the permissions to access files and folders in the SMB share.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationsmb.html#cfn-datasync-locationsmb-password
   */
  readonly password?: string;

  /**
   * Specifies the Domain Name Service (DNS) name or IP address of the SMB file server that your DataSync agent will mount.
   *
   * > You can't specify an IP version 6 (IPv6) address.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationsmb.html#cfn-datasync-locationsmb-serverhostname
   */
  readonly serverHostname?: string;

  /**
   * The subdirectory in the SMB file system that is used to read data from the SMB source location or write data to the SMB destination.
   *
   * The SMB path should be a path that's exported by the SMB server, or a subdirectory of that path. The path should be such that it can be mounted by other SMB clients in your network.
   *
   * > `Subdirectory` must be specified with forward slashes. For example, `/path/to/folder` .
   *
   * To transfer all the data in the folder you specified, DataSync must have permissions to mount the SMB share, as well as to access all the data in that share. To ensure this, either make sure that the user name and password specified belongs to the user who can mount the share, and who has the appropriate permissions for all of the files and directories that you want DataSync to access, or use credentials of a member of the Backup Operators group to mount the share. Doing either one enables the agent to access the data. For the agent to access directories, you must additionally enable all execute access.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationsmb.html#cfn-datasync-locationsmb-subdirectory
   */
  readonly subdirectory?: string;

  /**
   * Specifies labels that help you categorize, filter, and search for your AWS resources.
   *
   * We recommend creating at least a name tag for your location.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationsmb.html#cfn-datasync-locationsmb-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The user who can mount the share and has the permissions to access files and folders in the SMB share.
   *
   * For information about choosing a user name that ensures sufficient permissions to files, folders, and metadata, see [user](https://docs.aws.amazon.com/datasync/latest/userguide/create-smb-location.html#SMBuser) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-locationsmb.html#cfn-datasync-locationsmb-user
   */
  readonly user: string;
}

/**
 * Determine whether the given properties match those of a `MountOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `MountOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLocationSMBMountOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"MountOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnLocationSMBMountOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLocationSMBMountOptionsPropertyValidator(properties).assertSuccess();
  return {
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnLocationSMBMountOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLocationSMB.MountOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationSMB.MountOptionsProperty>();
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnLocationSMBProps`
 *
 * @param properties - the TypeScript properties of a `CfnLocationSMBProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLocationSMBPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("agentArns", cdk.requiredValidator)(properties.agentArns));
  errors.collect(cdk.propertyValidator("agentArns", cdk.listValidator(cdk.validateString))(properties.agentArns));
  errors.collect(cdk.propertyValidator("domain", cdk.validateString)(properties.domain));
  errors.collect(cdk.propertyValidator("mountOptions", CfnLocationSMBMountOptionsPropertyValidator)(properties.mountOptions));
  errors.collect(cdk.propertyValidator("password", cdk.validateString)(properties.password));
  errors.collect(cdk.propertyValidator("serverHostname", cdk.validateString)(properties.serverHostname));
  errors.collect(cdk.propertyValidator("subdirectory", cdk.validateString)(properties.subdirectory));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("user", cdk.requiredValidator)(properties.user));
  errors.collect(cdk.propertyValidator("user", cdk.validateString)(properties.user));
  return errors.wrap("supplied properties not correct for \"CfnLocationSMBProps\"");
}

// @ts-ignore TS6133
function convertCfnLocationSMBPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLocationSMBPropsValidator(properties).assertSuccess();
  return {
    "AgentArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.agentArns),
    "Domain": cdk.stringToCloudFormation(properties.domain),
    "MountOptions": convertCfnLocationSMBMountOptionsPropertyToCloudFormation(properties.mountOptions),
    "Password": cdk.stringToCloudFormation(properties.password),
    "ServerHostname": cdk.stringToCloudFormation(properties.serverHostname),
    "Subdirectory": cdk.stringToCloudFormation(properties.subdirectory),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "User": cdk.stringToCloudFormation(properties.user)
  };
}

// @ts-ignore TS6133
function CfnLocationSMBPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLocationSMBProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLocationSMBProps>();
  ret.addPropertyResult("agentArns", "AgentArns", (properties.AgentArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AgentArns) : undefined));
  ret.addPropertyResult("domain", "Domain", (properties.Domain != null ? cfn_parse.FromCloudFormation.getString(properties.Domain) : undefined));
  ret.addPropertyResult("mountOptions", "MountOptions", (properties.MountOptions != null ? CfnLocationSMBMountOptionsPropertyFromCloudFormation(properties.MountOptions) : undefined));
  ret.addPropertyResult("password", "Password", (properties.Password != null ? cfn_parse.FromCloudFormation.getString(properties.Password) : undefined));
  ret.addPropertyResult("serverHostname", "ServerHostname", (properties.ServerHostname != null ? cfn_parse.FromCloudFormation.getString(properties.ServerHostname) : undefined));
  ret.addPropertyResult("subdirectory", "Subdirectory", (properties.Subdirectory != null ? cfn_parse.FromCloudFormation.getString(properties.Subdirectory) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("user", "User", (properties.User != null ? cfn_parse.FromCloudFormation.getString(properties.User) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::DataSync::StorageSystem` resource creates an AWS resource for an on-premises storage system that you want DataSync Discovery to collect information about.
 *
 * For more information, see [discovering your storage with DataSync Discovery.](https://docs.aws.amazon.com/datasync/latest/userguide/understanding-your-storage.html)
 *
 * @cloudformationResource AWS::DataSync::StorageSystem
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-storagesystem.html
 */
export class CfnStorageSystem extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DataSync::StorageSystem";

  /**
   * Build a CfnStorageSystem from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStorageSystem {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnStorageSystemPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnStorageSystem(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Indicates whether your DataSync agent can connect to your on-premises storage system.
   *
   * @cloudformationAttribute ConnectivityStatus
   */
  public readonly attrConnectivityStatus: string;

  /**
   * The ARN of the secret that stores your on-premises storage system's credentials. DataSync Discovery stores these credentials in [AWS Secrets Manager](https://docs.aws.amazon.com/datasync/latest/userguide/discovery-configure-storage.html#discovery-add-storage) .
   *
   * @cloudformationAttribute SecretsManagerArn
   */
  public readonly attrSecretsManagerArn: string;

  /**
   * The ARN of the on-premises storage system that you're using with DataSync Discovery.
   *
   * @cloudformationAttribute StorageSystemArn
   */
  public readonly attrStorageSystemArn: string;

  /**
   * Specifies the Amazon Resource Name (ARN) of the DataSync agent that connects to and reads from your on-premises storage system's management interface.
   */
  public agentArns: Array<string>;

  /**
   * Specifies the ARN of the Amazon CloudWatch log group for monitoring and logging discovery job events.
   */
  public cloudWatchLogGroupArn?: string;

  /**
   * Specifies a familiar name for your on-premises storage system.
   */
  public name?: string;

  /**
   * Specifies the server name and network port required to connect with the management interface of your on-premises storage system.
   */
  public serverConfiguration: cdk.IResolvable | CfnStorageSystem.ServerConfigurationProperty;

  /**
   * Specifies the user name and password for accessing your on-premises storage system's management interface.
   */
  public serverCredentials?: cdk.IResolvable | CfnStorageSystem.ServerCredentialsProperty;

  /**
   * Specifies the type of on-premises storage system that you want DataSync Discovery to collect information about.
   */
  public systemType: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Specifies labels that help you categorize, filter, and search for your AWS resources.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnStorageSystemProps) {
    super(scope, id, {
      "type": CfnStorageSystem.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "agentArns", this);
    cdk.requireProperty(props, "serverConfiguration", this);
    cdk.requireProperty(props, "systemType", this);

    this.attrConnectivityStatus = cdk.Token.asString(this.getAtt("ConnectivityStatus", cdk.ResolutionTypeHint.STRING));
    this.attrSecretsManagerArn = cdk.Token.asString(this.getAtt("SecretsManagerArn", cdk.ResolutionTypeHint.STRING));
    this.attrStorageSystemArn = cdk.Token.asString(this.getAtt("StorageSystemArn", cdk.ResolutionTypeHint.STRING));
    this.agentArns = props.agentArns;
    this.cloudWatchLogGroupArn = props.cloudWatchLogGroupArn;
    this.name = props.name;
    this.serverConfiguration = props.serverConfiguration;
    this.serverCredentials = props.serverCredentials;
    this.systemType = props.systemType;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DataSync::StorageSystem", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "agentArns": this.agentArns,
      "cloudWatchLogGroupArn": this.cloudWatchLogGroupArn,
      "name": this.name,
      "serverConfiguration": this.serverConfiguration,
      "serverCredentials": this.serverCredentials,
      "systemType": this.systemType,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnStorageSystem.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnStorageSystemPropsToCloudFormation(props);
  }
}

export namespace CfnStorageSystem {
  /**
   * The credentials that provide DataSync Discovery read access to your on-premises storage system's management interface.
   *
   * DataSync Discovery stores these credentials in [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html) . For more information, see [Accessing your on-premises storage system](https://docs.aws.amazon.com/datasync/latest/userguide/discovery-configure-storage.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-storagesystem-servercredentials.html
   */
  export interface ServerCredentialsProperty {
    /**
     * Specifies the password for your storage system's management interface.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-storagesystem-servercredentials.html#cfn-datasync-storagesystem-servercredentials-password
     */
    readonly password: string;

    /**
     * Specifies the user name for your storage system's management interface.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-storagesystem-servercredentials.html#cfn-datasync-storagesystem-servercredentials-username
     */
    readonly username: string;
  }

  /**
   * The network settings that DataSync Discovery uses to connect with your on-premises storage system's management interface.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-storagesystem-serverconfiguration.html
   */
  export interface ServerConfigurationProperty {
    /**
     * The domain name or IP address of your storage system's management interface.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-storagesystem-serverconfiguration.html#cfn-datasync-storagesystem-serverconfiguration-serverhostname
     */
    readonly serverHostname: string;

    /**
     * The network port for accessing the storage system's management interface.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-storagesystem-serverconfiguration.html#cfn-datasync-storagesystem-serverconfiguration-serverport
     */
    readonly serverPort?: number;
  }
}

/**
 * Properties for defining a `CfnStorageSystem`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-storagesystem.html
 */
export interface CfnStorageSystemProps {
  /**
   * Specifies the Amazon Resource Name (ARN) of the DataSync agent that connects to and reads from your on-premises storage system's management interface.
   *
   * You can only specify one ARN.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-storagesystem.html#cfn-datasync-storagesystem-agentarns
   */
  readonly agentArns: Array<string>;

  /**
   * Specifies the ARN of the Amazon CloudWatch log group for monitoring and logging discovery job events.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-storagesystem.html#cfn-datasync-storagesystem-cloudwatchloggrouparn
   */
  readonly cloudWatchLogGroupArn?: string;

  /**
   * Specifies a familiar name for your on-premises storage system.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-storagesystem.html#cfn-datasync-storagesystem-name
   */
  readonly name?: string;

  /**
   * Specifies the server name and network port required to connect with the management interface of your on-premises storage system.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-storagesystem.html#cfn-datasync-storagesystem-serverconfiguration
   */
  readonly serverConfiguration: cdk.IResolvable | CfnStorageSystem.ServerConfigurationProperty;

  /**
   * Specifies the user name and password for accessing your on-premises storage system's management interface.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-storagesystem.html#cfn-datasync-storagesystem-servercredentials
   */
  readonly serverCredentials?: cdk.IResolvable | CfnStorageSystem.ServerCredentialsProperty;

  /**
   * Specifies the type of on-premises storage system that you want DataSync Discovery to collect information about.
   *
   * > DataSync Discovery currently supports NetApp Fabric-Attached Storage (FAS) and All Flash FAS (AFF) systems running ONTAP 9.7 or later.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-storagesystem.html#cfn-datasync-storagesystem-systemtype
   */
  readonly systemType: string;

  /**
   * Specifies labels that help you categorize, filter, and search for your AWS resources.
   *
   * We recommend creating at least a name tag for your on-premises storage system.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-storagesystem.html#cfn-datasync-storagesystem-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `ServerCredentialsProperty`
 *
 * @param properties - the TypeScript properties of a `ServerCredentialsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStorageSystemServerCredentialsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("password", cdk.requiredValidator)(properties.password));
  errors.collect(cdk.propertyValidator("password", cdk.validateString)(properties.password));
  errors.collect(cdk.propertyValidator("username", cdk.requiredValidator)(properties.username));
  errors.collect(cdk.propertyValidator("username", cdk.validateString)(properties.username));
  return errors.wrap("supplied properties not correct for \"ServerCredentialsProperty\"");
}

// @ts-ignore TS6133
function convertCfnStorageSystemServerCredentialsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStorageSystemServerCredentialsPropertyValidator(properties).assertSuccess();
  return {
    "Password": cdk.stringToCloudFormation(properties.password),
    "Username": cdk.stringToCloudFormation(properties.username)
  };
}

// @ts-ignore TS6133
function CfnStorageSystemServerCredentialsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStorageSystem.ServerCredentialsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageSystem.ServerCredentialsProperty>();
  ret.addPropertyResult("password", "Password", (properties.Password != null ? cfn_parse.FromCloudFormation.getString(properties.Password) : undefined));
  ret.addPropertyResult("username", "Username", (properties.Username != null ? cfn_parse.FromCloudFormation.getString(properties.Username) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ServerConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ServerConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStorageSystemServerConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("serverHostname", cdk.requiredValidator)(properties.serverHostname));
  errors.collect(cdk.propertyValidator("serverHostname", cdk.validateString)(properties.serverHostname));
  errors.collect(cdk.propertyValidator("serverPort", cdk.validateNumber)(properties.serverPort));
  return errors.wrap("supplied properties not correct for \"ServerConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnStorageSystemServerConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStorageSystemServerConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ServerHostname": cdk.stringToCloudFormation(properties.serverHostname),
    "ServerPort": cdk.numberToCloudFormation(properties.serverPort)
  };
}

// @ts-ignore TS6133
function CfnStorageSystemServerConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStorageSystem.ServerConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageSystem.ServerConfigurationProperty>();
  ret.addPropertyResult("serverHostname", "ServerHostname", (properties.ServerHostname != null ? cfn_parse.FromCloudFormation.getString(properties.ServerHostname) : undefined));
  ret.addPropertyResult("serverPort", "ServerPort", (properties.ServerPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.ServerPort) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnStorageSystemProps`
 *
 * @param properties - the TypeScript properties of a `CfnStorageSystemProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStorageSystemPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("agentArns", cdk.requiredValidator)(properties.agentArns));
  errors.collect(cdk.propertyValidator("agentArns", cdk.listValidator(cdk.validateString))(properties.agentArns));
  errors.collect(cdk.propertyValidator("cloudWatchLogGroupArn", cdk.validateString)(properties.cloudWatchLogGroupArn));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("serverConfiguration", cdk.requiredValidator)(properties.serverConfiguration));
  errors.collect(cdk.propertyValidator("serverConfiguration", CfnStorageSystemServerConfigurationPropertyValidator)(properties.serverConfiguration));
  errors.collect(cdk.propertyValidator("serverCredentials", CfnStorageSystemServerCredentialsPropertyValidator)(properties.serverCredentials));
  errors.collect(cdk.propertyValidator("systemType", cdk.requiredValidator)(properties.systemType));
  errors.collect(cdk.propertyValidator("systemType", cdk.validateString)(properties.systemType));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnStorageSystemProps\"");
}

// @ts-ignore TS6133
function convertCfnStorageSystemPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStorageSystemPropsValidator(properties).assertSuccess();
  return {
    "AgentArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.agentArns),
    "CloudWatchLogGroupArn": cdk.stringToCloudFormation(properties.cloudWatchLogGroupArn),
    "Name": cdk.stringToCloudFormation(properties.name),
    "ServerConfiguration": convertCfnStorageSystemServerConfigurationPropertyToCloudFormation(properties.serverConfiguration),
    "ServerCredentials": convertCfnStorageSystemServerCredentialsPropertyToCloudFormation(properties.serverCredentials),
    "SystemType": cdk.stringToCloudFormation(properties.systemType),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnStorageSystemPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStorageSystemProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStorageSystemProps>();
  ret.addPropertyResult("agentArns", "AgentArns", (properties.AgentArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AgentArns) : undefined));
  ret.addPropertyResult("cloudWatchLogGroupArn", "CloudWatchLogGroupArn", (properties.CloudWatchLogGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.CloudWatchLogGroupArn) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("serverConfiguration", "ServerConfiguration", (properties.ServerConfiguration != null ? CfnStorageSystemServerConfigurationPropertyFromCloudFormation(properties.ServerConfiguration) : undefined));
  ret.addPropertyResult("serverCredentials", "ServerCredentials", (properties.ServerCredentials != null ? CfnStorageSystemServerCredentialsPropertyFromCloudFormation(properties.ServerCredentials) : undefined));
  ret.addPropertyResult("systemType", "SystemType", (properties.SystemType != null ? cfn_parse.FromCloudFormation.getString(properties.SystemType) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::DataSync::Task` resource specifies a task.
 *
 * A task is a set of two locations (source and destination) and a set of `Options` that you use to control the behavior of a task. If you don't specify `Options` when you create a task, AWS DataSync populates them with service defaults.
 *
 * @cloudformationResource AWS::DataSync::Task
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-task.html
 */
export class CfnTask extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DataSync::Task";

  /**
   * Build a CfnTask from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTask {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTaskPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTask(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARNs of the destination elastic network interfaces (ENIs) that were created for your subnet.
   *
   * @cloudformationAttribute DestinationNetworkInterfaceArns
   */
  public readonly attrDestinationNetworkInterfaceArns: Array<string>;

  /**
   * The ARNs of the source ENIs that were created for your subnet.
   *
   * @cloudformationAttribute SourceNetworkInterfaceArns
   */
  public readonly attrSourceNetworkInterfaceArns: Array<string>;

  /**
   * The status of the task that was described.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * The ARN of the task.
   *
   * @cloudformationAttribute TaskArn
   */
  public readonly attrTaskArn: string;

  /**
   * The Amazon Resource Name (ARN) of the Amazon CloudWatch log group that is used to monitor and log events in the task.
   */
  public cloudWatchLogGroupArn?: string;

  /**
   * The Amazon Resource Name (ARN) of an AWS storage resource's location.
   */
  public destinationLocationArn: string;

  /**
   * Specifies a list of filter rules that exclude specific data during your transfer.
   */
  public excludes?: Array<CfnTask.FilterRuleProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Specifies a list of filter rules that include specific data during your transfer.
   */
  public includes?: Array<CfnTask.FilterRuleProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The name of a task.
   */
  public name?: string;

  /**
   * Specifies the configuration options for a task. Some options include preserving file or object metadata and verifying data integrity.
   */
  public options?: cdk.IResolvable | CfnTask.OptionsProperty;

  /**
   * Specifies a schedule used to periodically transfer files from a source to a destination location.
   */
  public schedule?: cdk.IResolvable | CfnTask.TaskScheduleProperty;

  /**
   * The Amazon Resource Name (ARN) of the source location for the task.
   */
  public sourceLocationArn: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Specifies the tags that you want to apply to the Amazon Resource Name (ARN) representing the task.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * Specifies how you want to configure a task report, which provides detailed information about for your DataSync transfer.
   */
  public taskReportConfig?: cdk.IResolvable | CfnTask.TaskReportConfigProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTaskProps) {
    super(scope, id, {
      "type": CfnTask.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "destinationLocationArn", this);
    cdk.requireProperty(props, "sourceLocationArn", this);

    this.attrDestinationNetworkInterfaceArns = cdk.Token.asList(this.getAtt("DestinationNetworkInterfaceArns", cdk.ResolutionTypeHint.STRING_LIST));
    this.attrSourceNetworkInterfaceArns = cdk.Token.asList(this.getAtt("SourceNetworkInterfaceArns", cdk.ResolutionTypeHint.STRING_LIST));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.attrTaskArn = cdk.Token.asString(this.getAtt("TaskArn", cdk.ResolutionTypeHint.STRING));
    this.cloudWatchLogGroupArn = props.cloudWatchLogGroupArn;
    this.destinationLocationArn = props.destinationLocationArn;
    this.excludes = props.excludes;
    this.includes = props.includes;
    this.name = props.name;
    this.options = props.options;
    this.schedule = props.schedule;
    this.sourceLocationArn = props.sourceLocationArn;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DataSync::Task", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.taskReportConfig = props.taskReportConfig;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "cloudWatchLogGroupArn": this.cloudWatchLogGroupArn,
      "destinationLocationArn": this.destinationLocationArn,
      "excludes": this.excludes,
      "includes": this.includes,
      "name": this.name,
      "options": this.options,
      "schedule": this.schedule,
      "sourceLocationArn": this.sourceLocationArn,
      "tags": this.tags.renderTags(),
      "taskReportConfig": this.taskReportConfig
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTask.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTaskPropsToCloudFormation(props);
  }
}

export namespace CfnTask {
  /**
   * Specifies which files, folders, and objects to include or exclude when transferring files from source to destination.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-filterrule.html
   */
  export interface FilterRuleProperty {
    /**
     * The type of filter rule to apply.
     *
     * AWS DataSync only supports the SIMPLE_PATTERN rule type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-filterrule.html#cfn-datasync-task-filterrule-filtertype
     */
    readonly filterType?: string;

    /**
     * A single filter string that consists of the patterns to include or exclude.
     *
     * The patterns are delimited by "|" (that is, a pipe), for example: `/folder1|/folder2`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-filterrule.html#cfn-datasync-task-filterrule-value
     */
    readonly value?: string;
  }

  /**
   * Represents the options that are available to control the behavior of a [StartTaskExecution](https://docs.aws.amazon.com/datasync/latest/userguide/API_StartTaskExecution.html) operation. This behavior includes preserving metadata, such as user ID (UID), group ID (GID), and file permissions; overwriting files in the destination; data integrity verification; and so on.
   *
   * A task has a set of default options associated with it. If you don't specify an option in [StartTaskExecution](https://docs.aws.amazon.com/datasync/latest/userguide/API_StartTaskExecution.html) , the default value is used. You can override the default options on each task execution by specifying an overriding `Options` value to [StartTaskExecution](https://docs.aws.amazon.com/datasync/latest/userguide/API_StartTaskExecution.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-options.html
   */
  export interface OptionsProperty {
    /**
     * A file metadata value that shows the last time that a file was accessed (that is, when the file was read or written to).
     *
     * If you set `Atime` to `BEST_EFFORT` , AWS DataSync attempts to preserve the original `Atime` attribute on all source files (that is, the version before the PREPARING phase). However, `Atime` 's behavior is not fully standard across platforms, so AWS DataSync can only do this on a best-effort basis.
     *
     * Default value: `BEST_EFFORT`
     *
     * `BEST_EFFORT` : Attempt to preserve the per-file `Atime` value (recommended).
     *
     * `NONE` : Ignore `Atime` .
     *
     * > If `Atime` is set to `BEST_EFFORT` , `Mtime` must be set to `PRESERVE` .
     * >
     * > If `Atime` is set to `NONE` , `Mtime` must also be `NONE` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-options.html#cfn-datasync-task-options-atime
     */
    readonly atime?: string;

    /**
     * A value that limits the bandwidth used by AWS DataSync .
     *
     * For example, if you want AWS DataSync to use a maximum of 1 MB, set this value to `1048576` (=1024*1024).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-options.html#cfn-datasync-task-options-bytespersecond
     */
    readonly bytesPerSecond?: number;

    /**
     * The group ID (GID) of the file's owners.
     *
     * Default value: `INT_VALUE`
     *
     * `INT_VALUE` : Preserve the integer value of the user ID (UID) and group ID (GID) (recommended).
     *
     * `NAME` : Currently not supported.
     *
     * `NONE` : Ignore the UID and GID.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-options.html#cfn-datasync-task-options-gid
     */
    readonly gid?: string;

    /**
     * Specifies the type of logs that DataSync publishes to a Amazon CloudWatch Logs log group.
     *
     * To specify the log group, see [CloudWatchLogGroupArn](https://docs.aws.amazon.com/datasync/latest/userguide/API_CreateTask.html#DataSync-CreateTask-request-CloudWatchLogGroupArn) .
     *
     * - `BASIC` - Publishes logs with only basic information (such as transfer errors).
     * - `TRANSFER` - Publishes logs for all files or objects that your DataSync task transfers and performs data-integrity checks on.
     * - `OFF` - No logs are published.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-options.html#cfn-datasync-task-options-loglevel
     */
    readonly logLevel?: string;

    /**
     * A value that indicates the last time that a file was modified (that is, a file was written to) before the PREPARING phase.
     *
     * This option is required for cases when you need to run the same task more than one time.
     *
     * Default value: `PRESERVE`
     *
     * `PRESERVE` : Preserve original `Mtime` (recommended)
     *
     * `NONE` : Ignore `Mtime` .
     *
     * > If `Mtime` is set to `PRESERVE` , `Atime` must be set to `BEST_EFFORT` .
     * >
     * > If `Mtime` is set to `NONE` , `Atime` must also be set to `NONE` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-options.html#cfn-datasync-task-options-mtime
     */
    readonly mtime?: string;

    /**
     * Specifies whether you want DataSync to `PRESERVE` object tags (default behavior) when transferring between object storage systems.
     *
     * If you want your DataSync task to ignore object tags, specify the `NONE` value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-options.html#cfn-datasync-task-options-objecttags
     */
    readonly objectTags?: string;

    /**
     * Specifies whether DataSync should modify or preserve data at the destination location.
     *
     * - `ALWAYS` (default) - DataSync modifies data in the destination location when source data (including metadata) has changed.
     *
     * If DataSync overwrites objects, you might incur additional charges for certain Amazon S3 storage classes (for example, for retrieval or early deletion). For more information, see [Storage class considerations with Amazon S3 transfers](https://docs.aws.amazon.com/datasync/latest/userguide/create-s3-location.html#using-storage-classes) .
     * - `NEVER` - DataSync doesn't overwrite data in the destination location even if the source data has changed. You can use this option to protect against overwriting changes made to files or objects in the destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-options.html#cfn-datasync-task-options-overwritemode
     */
    readonly overwriteMode?: string;

    /**
     * A value that determines which users or groups can access a file for a specific purpose, such as reading, writing, or execution of the file.
     *
     * This option should be set only for Network File System (NFS), Amazon EFS, and Amazon S3 locations. For more information about what metadata is copied by DataSync, see [Metadata Copied by DataSync](https://docs.aws.amazon.com/datasync/latest/userguide/special-files.html#metadata-copied) .
     *
     * Default value: `PRESERVE`
     *
     * `PRESERVE` : Preserve POSIX-style permissions (recommended).
     *
     * `NONE` : Ignore permissions.
     *
     * > AWS DataSync can preserve extant permissions of a source location.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-options.html#cfn-datasync-task-options-posixpermissions
     */
    readonly posixPermissions?: string;

    /**
     * A value that specifies whether files in the destination that don't exist in the source file system are preserved.
     *
     * This option can affect your storage costs. If your task deletes objects, you might incur minimum storage duration charges for certain storage classes. For detailed information, see [Considerations when working with Amazon S3 storage classes in DataSync](https://docs.aws.amazon.com/datasync/latest/userguide/create-s3-location.html#using-storage-classes) in the *AWS DataSync User Guide* .
     *
     * Default value: `PRESERVE`
     *
     * `PRESERVE` : Ignore destination files that aren't present in the source (recommended).
     *
     * `REMOVE` : Delete destination files that aren't present in the source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-options.html#cfn-datasync-task-options-preservedeletedfiles
     */
    readonly preserveDeletedFiles?: string;

    /**
     * A value that determines whether AWS DataSync should preserve the metadata of block and character devices in the source file system, and re-create the files with that device name and metadata on the destination.
     *
     * DataSync does not copy the contents of such devices, only the name and metadata.
     *
     * > AWS DataSync can't sync the actual contents of such devices, because they are nonterminal and don't return an end-of-file (EOF) marker.
     *
     * Default value: `NONE`
     *
     * `NONE` : Ignore special devices (recommended).
     *
     * `PRESERVE` : Preserve character and block device metadata. This option isn't currently supported for Amazon EFS.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-options.html#cfn-datasync-task-options-preservedevices
     */
    readonly preserveDevices?: string;

    /**
     * A value that determines which components of the SMB security descriptor are copied from source to destination objects.
     *
     * This value is only used for transfers between SMB and Amazon FSx for Windows File Server locations, or between two Amazon FSx for Windows File Server locations. For more information about how DataSync handles metadata, see [How DataSync Handles Metadata and Special Files](https://docs.aws.amazon.com/datasync/latest/userguide/special-files.html) .
     *
     * Default value: `OWNER_DACL`
     *
     * `OWNER_DACL` : For each copied object, DataSync copies the following metadata:
     *
     * - Object owner.
     * - NTFS discretionary access control lists (DACLs), which determine whether to grant access to an object.
     *
     * When you use option, DataSync does NOT copy the NTFS system access control lists (SACLs), which are used by administrators to log attempts to access a secured object.
     *
     * `OWNER_DACL_SACL` : For each copied object, DataSync copies the following metadata:
     *
     * - Object owner.
     * - NTFS discretionary access control lists (DACLs), which determine whether to grant access to an object.
     * - NTFS system access control lists (SACLs), which are used by administrators to log attempts to access a secured object.
     *
     * Copying SACLs requires granting additional permissions to the Windows user that DataSync uses to access your SMB location. For information about choosing a user that ensures sufficient permissions to files, folders, and metadata, see [user](https://docs.aws.amazon.com/datasync/latest/userguide/create-smb-location.html#SMBuser) .
     *
     * `NONE` : None of the SMB security descriptor components are copied. Destination objects are owned by the user that was provided for accessing the destination location. DACLs and SACLs are set based on the destination server’s configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-options.html#cfn-datasync-task-options-securitydescriptorcopyflags
     */
    readonly securityDescriptorCopyFlags?: string;

    /**
     * Specifies whether your transfer tasks should be put into a queue during certain scenarios when [running multiple tasks](https://docs.aws.amazon.com/datasync/latest/userguide/run-task.html#running-multiple-tasks) . This is `ENABLED` by default.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-options.html#cfn-datasync-task-options-taskqueueing
     */
    readonly taskQueueing?: string;

    /**
     * A value that determines whether DataSync transfers only the data and metadata that differ between the source and the destination location, or whether DataSync transfers all the content from the source, without comparing it to the destination location.
     *
     * `CHANGED` : DataSync copies only data or metadata that is new or different from the source location to the destination location.
     *
     * `ALL` : DataSync copies all source location content to the destination, without comparing it to existing content on the destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-options.html#cfn-datasync-task-options-transfermode
     */
    readonly transferMode?: string;

    /**
     * The user ID (UID) of the file's owner.
     *
     * Default value: `INT_VALUE`
     *
     * `INT_VALUE` : Preserve the integer value of the UID and group ID (GID) (recommended).
     *
     * `NAME` : Currently not supported
     *
     * `NONE` : Ignore the UID and GID.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-options.html#cfn-datasync-task-options-uid
     */
    readonly uid?: string;

    /**
     * A value that determines whether a data integrity verification is performed at the end of a task execution after all data and metadata have been transferred.
     *
     * For more information, see [Configure task settings](https://docs.aws.amazon.com/datasync/latest/userguide/create-task.html) .
     *
     * Default value: `POINT_IN_TIME_CONSISTENT`
     *
     * `ONLY_FILES_TRANSFERRED` (recommended): Perform verification only on files that were transferred.
     *
     * `POINT_IN_TIME_CONSISTENT` : Scan the entire source and entire destination at the end of the transfer to verify that the source and destination are fully synchronized. This option isn't supported when transferring to S3 Glacier or S3 Glacier Deep Archive storage classes.
     *
     * `NONE` : No additional verification is done at the end of the transfer, but all data transmissions are integrity-checked with checksum verification during the transfer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-options.html#cfn-datasync-task-options-verifymode
     */
    readonly verifyMode?: string;
  }

  /**
   * Specifies the schedule you want your task to use for repeated executions.
   *
   * For more information, see [Schedule Expressions for Rules](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-taskschedule.html
   */
  export interface TaskScheduleProperty {
    /**
     * A cron expression that specifies when AWS DataSync initiates a scheduled transfer from a source to a destination location.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-taskschedule.html#cfn-datasync-task-taskschedule-scheduleexpression
     */
    readonly scheduleExpression: string;
  }

  /**
   * Specifies how you want to configure a task report, which provides detailed information about for your AWS DataSync transfer.
   *
   * For more information, see [Task reports](https://docs.aws.amazon.com/datasync/latest/userguide/task-reports.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-taskreportconfig.html
   */
  export interface TaskReportConfigProperty {
    /**
     * Specifies the Amazon S3 bucket where DataSync uploads your task report.
     *
     * For more information, see [Task reports](https://docs.aws.amazon.com/datasync/latest/userguide/task-reports.html#task-report-access) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-taskreportconfig.html#cfn-datasync-task-taskreportconfig-destination
     */
    readonly destination: CfnTask.DestinationProperty | cdk.IResolvable;

    /**
     * Specifies whether your task report includes the new version of each object transferred into an S3 bucket.
     *
     * This only applies if you [enable versioning on your bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/manage-versioning-examples.html) . Keep in mind that setting this to `INCLUDE` can increase the duration of your task execution.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-taskreportconfig.html#cfn-datasync-task-taskreportconfig-objectversionids
     */
    readonly objectVersionIds?: string;

    /**
     * Specifies the type of task report that you want:.
     *
     * - `SUMMARY_ONLY` : Provides necessary details about your task, including the number of files, objects, and directories transferred and transfer duration.
     * - `STANDARD` : Provides complete details about your task, including a full list of files, objects, and directories that were transferred, skipped, verified, and more.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-taskreportconfig.html#cfn-datasync-task-taskreportconfig-outputtype
     */
    readonly outputType: string;

    /**
     * Customizes the reporting level for aspects of your task report.
     *
     * For example, your report might generally only include errors, but you could specify that you want a list of successes and errors just for the files that DataSync attempted to delete in your destination location.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-taskreportconfig.html#cfn-datasync-task-taskreportconfig-overrides
     */
    readonly overrides?: cdk.IResolvable | CfnTask.OverridesProperty;

    /**
     * Specifies whether you want your task report to include only what went wrong with your transfer or a list of what succeeded and didn't.
     *
     * - `ERRORS_ONLY` : A report shows what DataSync was unable to transfer, skip, verify, and delete.
     * - `SUCCESSES_AND_ERRORS` : A report shows what DataSync was able and unable to transfer, skip, verify, and delete.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-taskreportconfig.html#cfn-datasync-task-taskreportconfig-reportlevel
     */
    readonly reportLevel?: string;
  }

  /**
   * Specifies where DataSync uploads your [task report](https://docs.aws.amazon.com/datasync/latest/userguide/task-reports.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-destination.html
   */
  export interface DestinationProperty {
    /**
     * Specifies the Amazon S3 bucket where DataSync uploads your task report.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-destination.html#cfn-datasync-task-destination-s3
     */
    readonly s3?: cdk.IResolvable | CfnTask.S3Property;
  }

  /**
   * Specifies the Amazon S3 bucket where DataSync uploads your [task report](https://docs.aws.amazon.com/datasync/latest/userguide/task-reports.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-s3.html
   */
  export interface S3Property {
    /**
     * Specifies the Amazon Resource Name (ARN) of the IAM policy that allows DataSync to upload a task report to your S3 bucket.
     *
     * For more information, see [Allowing DataSync to upload a task report to an Amazon S3 bucket](https://docs.aws.amazon.com/datasync/latest/userguide/creating-task-reports.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-s3.html#cfn-datasync-task-s3-bucketaccessrolearn
     */
    readonly bucketAccessRoleArn?: string;

    /**
     * Specifies the ARN of the S3 bucket where DataSync uploads your report.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-s3.html#cfn-datasync-task-s3-s3bucketarn
     */
    readonly s3BucketArn?: string;

    /**
     * Specifies a bucket prefix for your report.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-s3.html#cfn-datasync-task-s3-subdirectory
     */
    readonly subdirectory?: string;
  }

  /**
   * Customizes the reporting level for aspects of your task report.
   *
   * For example, your report might generally only include errors, but you could specify that you want a list of successes and errors just for the files that DataSync attempted to delete in your destination location.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-overrides.html
   */
  export interface OverridesProperty {
    /**
     * Specifies the level of reporting for the files, objects, and directories that DataSync attempted to delete in your destination location.
     *
     * This only applies if you [configure your task](https://docs.aws.amazon.com/datasync/latest/userguide/configure-metadata.html) to delete data in the destination that isn't in the source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-overrides.html#cfn-datasync-task-overrides-deleted
     */
    readonly deleted?: CfnTask.DeletedProperty | cdk.IResolvable;

    /**
     * Specifies the level of reporting for the files, objects, and directories that DataSync attempted to skip during your transfer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-overrides.html#cfn-datasync-task-overrides-skipped
     */
    readonly skipped?: cdk.IResolvable | CfnTask.SkippedProperty;

    /**
     * Specifies the level of reporting for the files, objects, and directories that DataSync attempted to transfer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-overrides.html#cfn-datasync-task-overrides-transferred
     */
    readonly transferred?: cdk.IResolvable | CfnTask.TransferredProperty;

    /**
     * Specifies the level of reporting for the files, objects, and directories that DataSync attempted to verify during your transfer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-overrides.html#cfn-datasync-task-overrides-verified
     */
    readonly verified?: cdk.IResolvable | CfnTask.VerifiedProperty;
  }

  /**
   * The reporting level for the verified section of your DataSync task report.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-verified.html
   */
  export interface VerifiedProperty {
    /**
     * Specifies whether you want your task report to include only what went wrong with your transfer or a list of what succeeded and didn't.
     *
     * - `ERRORS_ONLY` : A report shows what DataSync was unable to verify.
     * - `SUCCESSES_AND_ERRORS` : A report shows what DataSync was able and unable to verify.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-verified.html#cfn-datasync-task-verified-reportlevel
     */
    readonly reportLevel?: string;
  }

  /**
   * The reporting level for the skipped section of your DataSync task report.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-skipped.html
   */
  export interface SkippedProperty {
    /**
     * Specifies whether you want your task report to include only what went wrong with your transfer or a list of what succeeded and didn't.
     *
     * - `ERRORS_ONLY` : A report shows what DataSync was unable to skip.
     * - `SUCCESSES_AND_ERRORS` : A report shows what DataSync was able and unable to skip.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-skipped.html#cfn-datasync-task-skipped-reportlevel
     */
    readonly reportLevel?: string;
  }

  /**
   * The reporting level for the transferred section of your DataSync task report.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-transferred.html
   */
  export interface TransferredProperty {
    /**
     * Specifies whether you want your task report to include only what went wrong with your transfer or a list of what succeeded and didn't.
     *
     * - `ERRORS_ONLY` : A report shows what DataSync was unable to transfer.
     * - `SUCCESSES_AND_ERRORS` : A report shows what DataSync was able and unable to transfer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-transferred.html#cfn-datasync-task-transferred-reportlevel
     */
    readonly reportLevel?: string;
  }

  /**
   * The reporting level for the deleted section of your DataSync task report.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-deleted.html
   */
  export interface DeletedProperty {
    /**
     * Specifies whether you want your task report to include only what went wrong with your transfer or a list of what succeeded and didn't.
     *
     * - `ERRORS_ONLY` : A report shows what DataSync was unable to delete.
     * - `SUCCESSES_AND_ERRORS` : A report shows what DataSync was able and unable to delete.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-datasync-task-deleted.html#cfn-datasync-task-deleted-reportlevel
     */
    readonly reportLevel?: string;
  }
}

/**
 * Properties for defining a `CfnTask`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-task.html
 */
export interface CfnTaskProps {
  /**
   * The Amazon Resource Name (ARN) of the Amazon CloudWatch log group that is used to monitor and log events in the task.
   *
   * For more information about how to use CloudWatch Logs with DataSync, see [Monitoring Your Task](https://docs.aws.amazon.com/datasync/latest/userguide/monitor-datasync.html#cloudwatchlogs) in the *AWS DataSync User Guide.*
   *
   * For more information about these groups, see [Working with Log Groups and Log Streams](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html) in the *Amazon CloudWatch Logs User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-task.html#cfn-datasync-task-cloudwatchloggrouparn
   */
  readonly cloudWatchLogGroupArn?: string;

  /**
   * The Amazon Resource Name (ARN) of an AWS storage resource's location.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-task.html#cfn-datasync-task-destinationlocationarn
   */
  readonly destinationLocationArn: string;

  /**
   * Specifies a list of filter rules that exclude specific data during your transfer.
   *
   * For more information and examples, see [Filtering data transferred by DataSync](https://docs.aws.amazon.com/datasync/latest/userguide/filtering.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-task.html#cfn-datasync-task-excludes
   */
  readonly excludes?: Array<CfnTask.FilterRuleProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Specifies a list of filter rules that include specific data during your transfer.
   *
   * For more information and examples, see [Filtering data transferred by DataSync](https://docs.aws.amazon.com/datasync/latest/userguide/filtering.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-task.html#cfn-datasync-task-includes
   */
  readonly includes?: Array<CfnTask.FilterRuleProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The name of a task.
   *
   * This value is a text reference that is used to identify the task in the console.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-task.html#cfn-datasync-task-name
   */
  readonly name?: string;

  /**
   * Specifies the configuration options for a task. Some options include preserving file or object metadata and verifying data integrity.
   *
   * You can also override these options before starting an individual run of a task (also known as a *task execution* ). For more information, see [StartTaskExecution](https://docs.aws.amazon.com/datasync/latest/userguide/API_StartTaskExecution.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-task.html#cfn-datasync-task-options
   */
  readonly options?: cdk.IResolvable | CfnTask.OptionsProperty;

  /**
   * Specifies a schedule used to periodically transfer files from a source to a destination location.
   *
   * The schedule should be specified in UTC time. For more information, see [Scheduling your task](https://docs.aws.amazon.com/datasync/latest/userguide/task-scheduling.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-task.html#cfn-datasync-task-schedule
   */
  readonly schedule?: cdk.IResolvable | CfnTask.TaskScheduleProperty;

  /**
   * The Amazon Resource Name (ARN) of the source location for the task.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-task.html#cfn-datasync-task-sourcelocationarn
   */
  readonly sourceLocationArn: string;

  /**
   * Specifies the tags that you want to apply to the Amazon Resource Name (ARN) representing the task.
   *
   * *Tags* are key-value pairs that help you manage, filter, and search for your DataSync resources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-task.html#cfn-datasync-task-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * Specifies how you want to configure a task report, which provides detailed information about for your DataSync transfer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datasync-task.html#cfn-datasync-task-taskreportconfig
   */
  readonly taskReportConfig?: cdk.IResolvable | CfnTask.TaskReportConfigProperty;
}

/**
 * Determine whether the given properties match those of a `FilterRuleProperty`
 *
 * @param properties - the TypeScript properties of a `FilterRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskFilterRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("filterType", cdk.validateString)(properties.filterType));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"FilterRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskFilterRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskFilterRulePropertyValidator(properties).assertSuccess();
  return {
    "FilterType": cdk.stringToCloudFormation(properties.filterType),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnTaskFilterRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTask.FilterRuleProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTask.FilterRuleProperty>();
  ret.addPropertyResult("filterType", "FilterType", (properties.FilterType != null ? cfn_parse.FromCloudFormation.getString(properties.FilterType) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OptionsProperty`
 *
 * @param properties - the TypeScript properties of a `OptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("atime", cdk.validateString)(properties.atime));
  errors.collect(cdk.propertyValidator("bytesPerSecond", cdk.validateNumber)(properties.bytesPerSecond));
  errors.collect(cdk.propertyValidator("gid", cdk.validateString)(properties.gid));
  errors.collect(cdk.propertyValidator("logLevel", cdk.validateString)(properties.logLevel));
  errors.collect(cdk.propertyValidator("mtime", cdk.validateString)(properties.mtime));
  errors.collect(cdk.propertyValidator("objectTags", cdk.validateString)(properties.objectTags));
  errors.collect(cdk.propertyValidator("overwriteMode", cdk.validateString)(properties.overwriteMode));
  errors.collect(cdk.propertyValidator("posixPermissions", cdk.validateString)(properties.posixPermissions));
  errors.collect(cdk.propertyValidator("preserveDeletedFiles", cdk.validateString)(properties.preserveDeletedFiles));
  errors.collect(cdk.propertyValidator("preserveDevices", cdk.validateString)(properties.preserveDevices));
  errors.collect(cdk.propertyValidator("securityDescriptorCopyFlags", cdk.validateString)(properties.securityDescriptorCopyFlags));
  errors.collect(cdk.propertyValidator("taskQueueing", cdk.validateString)(properties.taskQueueing));
  errors.collect(cdk.propertyValidator("transferMode", cdk.validateString)(properties.transferMode));
  errors.collect(cdk.propertyValidator("uid", cdk.validateString)(properties.uid));
  errors.collect(cdk.propertyValidator("verifyMode", cdk.validateString)(properties.verifyMode));
  return errors.wrap("supplied properties not correct for \"OptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskOptionsPropertyValidator(properties).assertSuccess();
  return {
    "Atime": cdk.stringToCloudFormation(properties.atime),
    "BytesPerSecond": cdk.numberToCloudFormation(properties.bytesPerSecond),
    "Gid": cdk.stringToCloudFormation(properties.gid),
    "LogLevel": cdk.stringToCloudFormation(properties.logLevel),
    "Mtime": cdk.stringToCloudFormation(properties.mtime),
    "ObjectTags": cdk.stringToCloudFormation(properties.objectTags),
    "OverwriteMode": cdk.stringToCloudFormation(properties.overwriteMode),
    "PosixPermissions": cdk.stringToCloudFormation(properties.posixPermissions),
    "PreserveDeletedFiles": cdk.stringToCloudFormation(properties.preserveDeletedFiles),
    "PreserveDevices": cdk.stringToCloudFormation(properties.preserveDevices),
    "SecurityDescriptorCopyFlags": cdk.stringToCloudFormation(properties.securityDescriptorCopyFlags),
    "TaskQueueing": cdk.stringToCloudFormation(properties.taskQueueing),
    "TransferMode": cdk.stringToCloudFormation(properties.transferMode),
    "Uid": cdk.stringToCloudFormation(properties.uid),
    "VerifyMode": cdk.stringToCloudFormation(properties.verifyMode)
  };
}

// @ts-ignore TS6133
function CfnTaskOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTask.OptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTask.OptionsProperty>();
  ret.addPropertyResult("atime", "Atime", (properties.Atime != null ? cfn_parse.FromCloudFormation.getString(properties.Atime) : undefined));
  ret.addPropertyResult("bytesPerSecond", "BytesPerSecond", (properties.BytesPerSecond != null ? cfn_parse.FromCloudFormation.getNumber(properties.BytesPerSecond) : undefined));
  ret.addPropertyResult("gid", "Gid", (properties.Gid != null ? cfn_parse.FromCloudFormation.getString(properties.Gid) : undefined));
  ret.addPropertyResult("logLevel", "LogLevel", (properties.LogLevel != null ? cfn_parse.FromCloudFormation.getString(properties.LogLevel) : undefined));
  ret.addPropertyResult("mtime", "Mtime", (properties.Mtime != null ? cfn_parse.FromCloudFormation.getString(properties.Mtime) : undefined));
  ret.addPropertyResult("objectTags", "ObjectTags", (properties.ObjectTags != null ? cfn_parse.FromCloudFormation.getString(properties.ObjectTags) : undefined));
  ret.addPropertyResult("overwriteMode", "OverwriteMode", (properties.OverwriteMode != null ? cfn_parse.FromCloudFormation.getString(properties.OverwriteMode) : undefined));
  ret.addPropertyResult("posixPermissions", "PosixPermissions", (properties.PosixPermissions != null ? cfn_parse.FromCloudFormation.getString(properties.PosixPermissions) : undefined));
  ret.addPropertyResult("preserveDeletedFiles", "PreserveDeletedFiles", (properties.PreserveDeletedFiles != null ? cfn_parse.FromCloudFormation.getString(properties.PreserveDeletedFiles) : undefined));
  ret.addPropertyResult("preserveDevices", "PreserveDevices", (properties.PreserveDevices != null ? cfn_parse.FromCloudFormation.getString(properties.PreserveDevices) : undefined));
  ret.addPropertyResult("securityDescriptorCopyFlags", "SecurityDescriptorCopyFlags", (properties.SecurityDescriptorCopyFlags != null ? cfn_parse.FromCloudFormation.getString(properties.SecurityDescriptorCopyFlags) : undefined));
  ret.addPropertyResult("taskQueueing", "TaskQueueing", (properties.TaskQueueing != null ? cfn_parse.FromCloudFormation.getString(properties.TaskQueueing) : undefined));
  ret.addPropertyResult("transferMode", "TransferMode", (properties.TransferMode != null ? cfn_parse.FromCloudFormation.getString(properties.TransferMode) : undefined));
  ret.addPropertyResult("uid", "Uid", (properties.Uid != null ? cfn_parse.FromCloudFormation.getString(properties.Uid) : undefined));
  ret.addPropertyResult("verifyMode", "VerifyMode", (properties.VerifyMode != null ? cfn_parse.FromCloudFormation.getString(properties.VerifyMode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TaskScheduleProperty`
 *
 * @param properties - the TypeScript properties of a `TaskScheduleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskTaskSchedulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("scheduleExpression", cdk.requiredValidator)(properties.scheduleExpression));
  errors.collect(cdk.propertyValidator("scheduleExpression", cdk.validateString)(properties.scheduleExpression));
  return errors.wrap("supplied properties not correct for \"TaskScheduleProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskTaskSchedulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskTaskSchedulePropertyValidator(properties).assertSuccess();
  return {
    "ScheduleExpression": cdk.stringToCloudFormation(properties.scheduleExpression)
  };
}

// @ts-ignore TS6133
function CfnTaskTaskSchedulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTask.TaskScheduleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTask.TaskScheduleProperty>();
  ret.addPropertyResult("scheduleExpression", "ScheduleExpression", (properties.ScheduleExpression != null ? cfn_parse.FromCloudFormation.getString(properties.ScheduleExpression) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3Property`
 *
 * @param properties - the TypeScript properties of a `S3Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskS3PropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketAccessRoleArn", cdk.validateString)(properties.bucketAccessRoleArn));
  errors.collect(cdk.propertyValidator("s3BucketArn", cdk.validateString)(properties.s3BucketArn));
  errors.collect(cdk.propertyValidator("subdirectory", cdk.validateString)(properties.subdirectory));
  return errors.wrap("supplied properties not correct for \"S3Property\"");
}

// @ts-ignore TS6133
function convertCfnTaskS3PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskS3PropertyValidator(properties).assertSuccess();
  return {
    "BucketAccessRoleArn": cdk.stringToCloudFormation(properties.bucketAccessRoleArn),
    "S3BucketArn": cdk.stringToCloudFormation(properties.s3BucketArn),
    "Subdirectory": cdk.stringToCloudFormation(properties.subdirectory)
  };
}

// @ts-ignore TS6133
function CfnTaskS3PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTask.S3Property> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTask.S3Property>();
  ret.addPropertyResult("bucketAccessRoleArn", "BucketAccessRoleArn", (properties.BucketAccessRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.BucketAccessRoleArn) : undefined));
  ret.addPropertyResult("s3BucketArn", "S3BucketArn", (properties.S3BucketArn != null ? cfn_parse.FromCloudFormation.getString(properties.S3BucketArn) : undefined));
  ret.addPropertyResult("subdirectory", "Subdirectory", (properties.Subdirectory != null ? cfn_parse.FromCloudFormation.getString(properties.Subdirectory) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DestinationProperty`
 *
 * @param properties - the TypeScript properties of a `DestinationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDestinationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("s3", CfnTaskS3PropertyValidator)(properties.s3));
  return errors.wrap("supplied properties not correct for \"DestinationProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDestinationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDestinationPropertyValidator(properties).assertSuccess();
  return {
    "S3": convertCfnTaskS3PropertyToCloudFormation(properties.s3)
  };
}

// @ts-ignore TS6133
function CfnTaskDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTask.DestinationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTask.DestinationProperty>();
  ret.addPropertyResult("s3", "S3", (properties.S3 != null ? CfnTaskS3PropertyFromCloudFormation(properties.S3) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VerifiedProperty`
 *
 * @param properties - the TypeScript properties of a `VerifiedProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskVerifiedPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("reportLevel", cdk.validateString)(properties.reportLevel));
  return errors.wrap("supplied properties not correct for \"VerifiedProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskVerifiedPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskVerifiedPropertyValidator(properties).assertSuccess();
  return {
    "ReportLevel": cdk.stringToCloudFormation(properties.reportLevel)
  };
}

// @ts-ignore TS6133
function CfnTaskVerifiedPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTask.VerifiedProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTask.VerifiedProperty>();
  ret.addPropertyResult("reportLevel", "ReportLevel", (properties.ReportLevel != null ? cfn_parse.FromCloudFormation.getString(properties.ReportLevel) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SkippedProperty`
 *
 * @param properties - the TypeScript properties of a `SkippedProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskSkippedPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("reportLevel", cdk.validateString)(properties.reportLevel));
  return errors.wrap("supplied properties not correct for \"SkippedProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskSkippedPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskSkippedPropertyValidator(properties).assertSuccess();
  return {
    "ReportLevel": cdk.stringToCloudFormation(properties.reportLevel)
  };
}

// @ts-ignore TS6133
function CfnTaskSkippedPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTask.SkippedProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTask.SkippedProperty>();
  ret.addPropertyResult("reportLevel", "ReportLevel", (properties.ReportLevel != null ? cfn_parse.FromCloudFormation.getString(properties.ReportLevel) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TransferredProperty`
 *
 * @param properties - the TypeScript properties of a `TransferredProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskTransferredPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("reportLevel", cdk.validateString)(properties.reportLevel));
  return errors.wrap("supplied properties not correct for \"TransferredProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskTransferredPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskTransferredPropertyValidator(properties).assertSuccess();
  return {
    "ReportLevel": cdk.stringToCloudFormation(properties.reportLevel)
  };
}

// @ts-ignore TS6133
function CfnTaskTransferredPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTask.TransferredProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTask.TransferredProperty>();
  ret.addPropertyResult("reportLevel", "ReportLevel", (properties.ReportLevel != null ? cfn_parse.FromCloudFormation.getString(properties.ReportLevel) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeletedProperty`
 *
 * @param properties - the TypeScript properties of a `DeletedProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskDeletedPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("reportLevel", cdk.validateString)(properties.reportLevel));
  return errors.wrap("supplied properties not correct for \"DeletedProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskDeletedPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskDeletedPropertyValidator(properties).assertSuccess();
  return {
    "ReportLevel": cdk.stringToCloudFormation(properties.reportLevel)
  };
}

// @ts-ignore TS6133
function CfnTaskDeletedPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTask.DeletedProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTask.DeletedProperty>();
  ret.addPropertyResult("reportLevel", "ReportLevel", (properties.ReportLevel != null ? cfn_parse.FromCloudFormation.getString(properties.ReportLevel) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OverridesProperty`
 *
 * @param properties - the TypeScript properties of a `OverridesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskOverridesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deleted", CfnTaskDeletedPropertyValidator)(properties.deleted));
  errors.collect(cdk.propertyValidator("skipped", CfnTaskSkippedPropertyValidator)(properties.skipped));
  errors.collect(cdk.propertyValidator("transferred", CfnTaskTransferredPropertyValidator)(properties.transferred));
  errors.collect(cdk.propertyValidator("verified", CfnTaskVerifiedPropertyValidator)(properties.verified));
  return errors.wrap("supplied properties not correct for \"OverridesProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskOverridesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskOverridesPropertyValidator(properties).assertSuccess();
  return {
    "Deleted": convertCfnTaskDeletedPropertyToCloudFormation(properties.deleted),
    "Skipped": convertCfnTaskSkippedPropertyToCloudFormation(properties.skipped),
    "Transferred": convertCfnTaskTransferredPropertyToCloudFormation(properties.transferred),
    "Verified": convertCfnTaskVerifiedPropertyToCloudFormation(properties.verified)
  };
}

// @ts-ignore TS6133
function CfnTaskOverridesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTask.OverridesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTask.OverridesProperty>();
  ret.addPropertyResult("deleted", "Deleted", (properties.Deleted != null ? CfnTaskDeletedPropertyFromCloudFormation(properties.Deleted) : undefined));
  ret.addPropertyResult("skipped", "Skipped", (properties.Skipped != null ? CfnTaskSkippedPropertyFromCloudFormation(properties.Skipped) : undefined));
  ret.addPropertyResult("transferred", "Transferred", (properties.Transferred != null ? CfnTaskTransferredPropertyFromCloudFormation(properties.Transferred) : undefined));
  ret.addPropertyResult("verified", "Verified", (properties.Verified != null ? CfnTaskVerifiedPropertyFromCloudFormation(properties.Verified) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TaskReportConfigProperty`
 *
 * @param properties - the TypeScript properties of a `TaskReportConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskTaskReportConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destination", cdk.requiredValidator)(properties.destination));
  errors.collect(cdk.propertyValidator("destination", CfnTaskDestinationPropertyValidator)(properties.destination));
  errors.collect(cdk.propertyValidator("objectVersionIds", cdk.validateString)(properties.objectVersionIds));
  errors.collect(cdk.propertyValidator("outputType", cdk.requiredValidator)(properties.outputType));
  errors.collect(cdk.propertyValidator("outputType", cdk.validateString)(properties.outputType));
  errors.collect(cdk.propertyValidator("overrides", CfnTaskOverridesPropertyValidator)(properties.overrides));
  errors.collect(cdk.propertyValidator("reportLevel", cdk.validateString)(properties.reportLevel));
  return errors.wrap("supplied properties not correct for \"TaskReportConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskTaskReportConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskTaskReportConfigPropertyValidator(properties).assertSuccess();
  return {
    "Destination": convertCfnTaskDestinationPropertyToCloudFormation(properties.destination),
    "ObjectVersionIds": cdk.stringToCloudFormation(properties.objectVersionIds),
    "OutputType": cdk.stringToCloudFormation(properties.outputType),
    "Overrides": convertCfnTaskOverridesPropertyToCloudFormation(properties.overrides),
    "ReportLevel": cdk.stringToCloudFormation(properties.reportLevel)
  };
}

// @ts-ignore TS6133
function CfnTaskTaskReportConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTask.TaskReportConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTask.TaskReportConfigProperty>();
  ret.addPropertyResult("destination", "Destination", (properties.Destination != null ? CfnTaskDestinationPropertyFromCloudFormation(properties.Destination) : undefined));
  ret.addPropertyResult("objectVersionIds", "ObjectVersionIds", (properties.ObjectVersionIds != null ? cfn_parse.FromCloudFormation.getString(properties.ObjectVersionIds) : undefined));
  ret.addPropertyResult("outputType", "OutputType", (properties.OutputType != null ? cfn_parse.FromCloudFormation.getString(properties.OutputType) : undefined));
  ret.addPropertyResult("overrides", "Overrides", (properties.Overrides != null ? CfnTaskOverridesPropertyFromCloudFormation(properties.Overrides) : undefined));
  ret.addPropertyResult("reportLevel", "ReportLevel", (properties.ReportLevel != null ? cfn_parse.FromCloudFormation.getString(properties.ReportLevel) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnTaskProps`
 *
 * @param properties - the TypeScript properties of a `CfnTaskProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cloudWatchLogGroupArn", cdk.validateString)(properties.cloudWatchLogGroupArn));
  errors.collect(cdk.propertyValidator("destinationLocationArn", cdk.requiredValidator)(properties.destinationLocationArn));
  errors.collect(cdk.propertyValidator("destinationLocationArn", cdk.validateString)(properties.destinationLocationArn));
  errors.collect(cdk.propertyValidator("excludes", cdk.listValidator(CfnTaskFilterRulePropertyValidator))(properties.excludes));
  errors.collect(cdk.propertyValidator("includes", cdk.listValidator(CfnTaskFilterRulePropertyValidator))(properties.includes));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("options", CfnTaskOptionsPropertyValidator)(properties.options));
  errors.collect(cdk.propertyValidator("schedule", CfnTaskTaskSchedulePropertyValidator)(properties.schedule));
  errors.collect(cdk.propertyValidator("sourceLocationArn", cdk.requiredValidator)(properties.sourceLocationArn));
  errors.collect(cdk.propertyValidator("sourceLocationArn", cdk.validateString)(properties.sourceLocationArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("taskReportConfig", CfnTaskTaskReportConfigPropertyValidator)(properties.taskReportConfig));
  return errors.wrap("supplied properties not correct for \"CfnTaskProps\"");
}

// @ts-ignore TS6133
function convertCfnTaskPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskPropsValidator(properties).assertSuccess();
  return {
    "CloudWatchLogGroupArn": cdk.stringToCloudFormation(properties.cloudWatchLogGroupArn),
    "DestinationLocationArn": cdk.stringToCloudFormation(properties.destinationLocationArn),
    "Excludes": cdk.listMapper(convertCfnTaskFilterRulePropertyToCloudFormation)(properties.excludes),
    "Includes": cdk.listMapper(convertCfnTaskFilterRulePropertyToCloudFormation)(properties.includes),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Options": convertCfnTaskOptionsPropertyToCloudFormation(properties.options),
    "Schedule": convertCfnTaskTaskSchedulePropertyToCloudFormation(properties.schedule),
    "SourceLocationArn": cdk.stringToCloudFormation(properties.sourceLocationArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TaskReportConfig": convertCfnTaskTaskReportConfigPropertyToCloudFormation(properties.taskReportConfig)
  };
}

// @ts-ignore TS6133
function CfnTaskPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskProps>();
  ret.addPropertyResult("cloudWatchLogGroupArn", "CloudWatchLogGroupArn", (properties.CloudWatchLogGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.CloudWatchLogGroupArn) : undefined));
  ret.addPropertyResult("destinationLocationArn", "DestinationLocationArn", (properties.DestinationLocationArn != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationLocationArn) : undefined));
  ret.addPropertyResult("excludes", "Excludes", (properties.Excludes != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskFilterRulePropertyFromCloudFormation)(properties.Excludes) : undefined));
  ret.addPropertyResult("includes", "Includes", (properties.Includes != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskFilterRulePropertyFromCloudFormation)(properties.Includes) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("options", "Options", (properties.Options != null ? CfnTaskOptionsPropertyFromCloudFormation(properties.Options) : undefined));
  ret.addPropertyResult("schedule", "Schedule", (properties.Schedule != null ? CfnTaskTaskSchedulePropertyFromCloudFormation(properties.Schedule) : undefined));
  ret.addPropertyResult("sourceLocationArn", "SourceLocationArn", (properties.SourceLocationArn != null ? cfn_parse.FromCloudFormation.getString(properties.SourceLocationArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("taskReportConfig", "TaskReportConfig", (properties.TaskReportConfig != null ? CfnTaskTaskReportConfigPropertyFromCloudFormation(properties.TaskReportConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}