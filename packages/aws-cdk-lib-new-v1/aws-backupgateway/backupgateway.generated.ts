/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Represents the hypervisor's permissions to which the gateway will connect.
 *
 * A hypervisor is hardware, software, or firmware that creates and manages virtual machines, and allocates resources to them.
 *
 * @cloudformationResource AWS::BackupGateway::Hypervisor
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backupgateway-hypervisor.html
 */
export class CfnHypervisor extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::BackupGateway::Hypervisor";

  /**
   * Build a CfnHypervisor from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnHypervisor {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnHypervisorPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnHypervisor(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns `HypervisorArn` , an Amazon Resource Name (ARN) that uniquely identifies a Hypervisor. For example: `arn:aws:backup-gateway:us-east-1:123456789012:hypervisor/hype-1234D67D`
   *
   * @cloudformationAttribute HypervisorArn
   */
  public readonly attrHypervisorArn: string;

  /**
   * The server host of the hypervisor.
   */
  public host?: string;

  /**
   * The Amazon Resource Name (ARN) of the AWS Key Management Service used to encrypt the hypervisor.
   */
  public kmsKeyArn?: string;

  /**
   * The Amazon Resource Name (ARN) of the group of gateways within the requested log.
   */
  public logGroupArn?: string;

  /**
   * The name of the hypervisor.
   */
  public name?: string;

  /**
   * The password for the hypervisor.
   */
  public password?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags of the hypervisor configuration to import.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The username for the hypervisor.
   */
  public username?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnHypervisorProps = {}) {
    super(scope, id, {
      "type": CfnHypervisor.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrHypervisorArn = cdk.Token.asString(this.getAtt("HypervisorArn", cdk.ResolutionTypeHint.STRING));
    this.host = props.host;
    this.kmsKeyArn = props.kmsKeyArn;
    this.logGroupArn = props.logGroupArn;
    this.name = props.name;
    this.password = props.password;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::BackupGateway::Hypervisor", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.username = props.username;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "host": this.host,
      "kmsKeyArn": this.kmsKeyArn,
      "logGroupArn": this.logGroupArn,
      "name": this.name,
      "password": this.password,
      "tags": this.tags.renderTags(),
      "username": this.username
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnHypervisor.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnHypervisorPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnHypervisor`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backupgateway-hypervisor.html
 */
export interface CfnHypervisorProps {
  /**
   * The server host of the hypervisor.
   *
   * This can be either an IP address or a fully-qualified domain name (FQDN).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backupgateway-hypervisor.html#cfn-backupgateway-hypervisor-host
   */
  readonly host?: string;

  /**
   * The Amazon Resource Name (ARN) of the AWS Key Management Service used to encrypt the hypervisor.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backupgateway-hypervisor.html#cfn-backupgateway-hypervisor-kmskeyarn
   */
  readonly kmsKeyArn?: string;

  /**
   * The Amazon Resource Name (ARN) of the group of gateways within the requested log.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backupgateway-hypervisor.html#cfn-backupgateway-hypervisor-loggrouparn
   */
  readonly logGroupArn?: string;

  /**
   * The name of the hypervisor.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backupgateway-hypervisor.html#cfn-backupgateway-hypervisor-name
   */
  readonly name?: string;

  /**
   * The password for the hypervisor.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backupgateway-hypervisor.html#cfn-backupgateway-hypervisor-password
   */
  readonly password?: string;

  /**
   * The tags of the hypervisor configuration to import.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backupgateway-hypervisor.html#cfn-backupgateway-hypervisor-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The username for the hypervisor.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-backupgateway-hypervisor.html#cfn-backupgateway-hypervisor-username
   */
  readonly username?: string;
}

/**
 * Determine whether the given properties match those of a `CfnHypervisorProps`
 *
 * @param properties - the TypeScript properties of a `CfnHypervisorProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnHypervisorPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("host", cdk.validateString)(properties.host));
  errors.collect(cdk.propertyValidator("kmsKeyArn", cdk.validateString)(properties.kmsKeyArn));
  errors.collect(cdk.propertyValidator("logGroupArn", cdk.validateString)(properties.logGroupArn));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("password", cdk.validateString)(properties.password));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("username", cdk.validateString)(properties.username));
  return errors.wrap("supplied properties not correct for \"CfnHypervisorProps\"");
}

// @ts-ignore TS6133
function convertCfnHypervisorPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnHypervisorPropsValidator(properties).assertSuccess();
  return {
    "Host": cdk.stringToCloudFormation(properties.host),
    "KmsKeyArn": cdk.stringToCloudFormation(properties.kmsKeyArn),
    "LogGroupArn": cdk.stringToCloudFormation(properties.logGroupArn),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Password": cdk.stringToCloudFormation(properties.password),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Username": cdk.stringToCloudFormation(properties.username)
  };
}

// @ts-ignore TS6133
function CfnHypervisorPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnHypervisorProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnHypervisorProps>();
  ret.addPropertyResult("host", "Host", (properties.Host != null ? cfn_parse.FromCloudFormation.getString(properties.Host) : undefined));
  ret.addPropertyResult("kmsKeyArn", "KmsKeyArn", (properties.KmsKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyArn) : undefined));
  ret.addPropertyResult("logGroupArn", "LogGroupArn", (properties.LogGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroupArn) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("password", "Password", (properties.Password != null ? cfn_parse.FromCloudFormation.getString(properties.Password) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("username", "Username", (properties.Username != null ? cfn_parse.FromCloudFormation.getString(properties.Username) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}