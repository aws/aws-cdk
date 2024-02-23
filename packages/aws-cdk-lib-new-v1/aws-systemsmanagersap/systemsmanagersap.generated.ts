/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * An SAP application registered with AWS Systems Manager for SAP.
 *
 * @cloudformationResource AWS::SystemsManagerSAP::Application
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-systemsmanagersap-application.html
 */
export class CfnApplication extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SystemsManagerSAP::Application";

  /**
   * Build a CfnApplication from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApplication {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnApplicationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnApplication(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name of the SAP application.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The ID of the application.
   */
  public applicationId: string;

  /**
   * The type of the application.
   */
  public applicationType: string;

  /**
   * The credentials of the SAP application.
   */
  public credentials?: Array<CfnApplication.CredentialProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The Amazon EC2 instances on which your SAP application is running.
   */
  public instances?: Array<string>;

  /**
   * The SAP instance number of the application.
   */
  public sapInstanceNumber?: string;

  /**
   * The System ID of the application.
   */
  public sid?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags on the application.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnApplicationProps) {
    super(scope, id, {
      "type": CfnApplication.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "applicationId", this);
    cdk.requireProperty(props, "applicationType", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.applicationId = props.applicationId;
    this.applicationType = props.applicationType;
    this.credentials = props.credentials;
    this.instances = props.instances;
    this.sapInstanceNumber = props.sapInstanceNumber;
    this.sid = props.sid;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::SystemsManagerSAP::Application", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "applicationId": this.applicationId,
      "applicationType": this.applicationType,
      "credentials": this.credentials,
      "instances": this.instances,
      "sapInstanceNumber": this.sapInstanceNumber,
      "sid": this.sid,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnApplication.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnApplicationPropsToCloudFormation(props);
  }
}

export namespace CfnApplication {
  /**
   * The credentials of your SAP application.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-systemsmanagersap-application-credential.html
   */
  export interface CredentialProperty {
    /**
     * The type of the application credentials.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-systemsmanagersap-application-credential.html#cfn-systemsmanagersap-application-credential-credentialtype
     */
    readonly credentialType?: string;

    /**
     * The name of the SAP HANA database.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-systemsmanagersap-application-credential.html#cfn-systemsmanagersap-application-credential-databasename
     */
    readonly databaseName?: string;

    /**
     * The secret ID created in AWS Secrets Manager to store the credentials of the SAP application.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-systemsmanagersap-application-credential.html#cfn-systemsmanagersap-application-credential-secretid
     */
    readonly secretId?: string;
  }
}

/**
 * Properties for defining a `CfnApplication`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-systemsmanagersap-application.html
 */
export interface CfnApplicationProps {
  /**
   * The ID of the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-systemsmanagersap-application.html#cfn-systemsmanagersap-application-applicationid
   */
  readonly applicationId: string;

  /**
   * The type of the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-systemsmanagersap-application.html#cfn-systemsmanagersap-application-applicationtype
   */
  readonly applicationType: string;

  /**
   * The credentials of the SAP application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-systemsmanagersap-application.html#cfn-systemsmanagersap-application-credentials
   */
  readonly credentials?: Array<CfnApplication.CredentialProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The Amazon EC2 instances on which your SAP application is running.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-systemsmanagersap-application.html#cfn-systemsmanagersap-application-instances
   */
  readonly instances?: Array<string>;

  /**
   * The SAP instance number of the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-systemsmanagersap-application.html#cfn-systemsmanagersap-application-sapinstancenumber
   */
  readonly sapInstanceNumber?: string;

  /**
   * The System ID of the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-systemsmanagersap-application.html#cfn-systemsmanagersap-application-sid
   */
  readonly sid?: string;

  /**
   * The tags on the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-systemsmanagersap-application.html#cfn-systemsmanagersap-application-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CredentialProperty`
 *
 * @param properties - the TypeScript properties of a `CredentialProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationCredentialPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("credentialType", cdk.validateString)(properties.credentialType));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("secretId", cdk.validateString)(properties.secretId));
  return errors.wrap("supplied properties not correct for \"CredentialProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationCredentialPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationCredentialPropertyValidator(properties).assertSuccess();
  return {
    "CredentialType": cdk.stringToCloudFormation(properties.credentialType),
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "SecretId": cdk.stringToCloudFormation(properties.secretId)
  };
}

// @ts-ignore TS6133
function CfnApplicationCredentialPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.CredentialProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.CredentialProperty>();
  ret.addPropertyResult("credentialType", "CredentialType", (properties.CredentialType != null ? cfn_parse.FromCloudFormation.getString(properties.CredentialType) : undefined));
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("secretId", "SecretId", (properties.SecretId != null ? cfn_parse.FromCloudFormation.getString(properties.SecretId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnApplicationProps`
 *
 * @param properties - the TypeScript properties of a `CfnApplicationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationId", cdk.requiredValidator)(properties.applicationId));
  errors.collect(cdk.propertyValidator("applicationId", cdk.validateString)(properties.applicationId));
  errors.collect(cdk.propertyValidator("applicationType", cdk.requiredValidator)(properties.applicationType));
  errors.collect(cdk.propertyValidator("applicationType", cdk.validateString)(properties.applicationType));
  errors.collect(cdk.propertyValidator("credentials", cdk.listValidator(CfnApplicationCredentialPropertyValidator))(properties.credentials));
  errors.collect(cdk.propertyValidator("instances", cdk.listValidator(cdk.validateString))(properties.instances));
  errors.collect(cdk.propertyValidator("sapInstanceNumber", cdk.validateString)(properties.sapInstanceNumber));
  errors.collect(cdk.propertyValidator("sid", cdk.validateString)(properties.sid));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnApplicationProps\"");
}

// @ts-ignore TS6133
function convertCfnApplicationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationPropsValidator(properties).assertSuccess();
  return {
    "ApplicationId": cdk.stringToCloudFormation(properties.applicationId),
    "ApplicationType": cdk.stringToCloudFormation(properties.applicationType),
    "Credentials": cdk.listMapper(convertCfnApplicationCredentialPropertyToCloudFormation)(properties.credentials),
    "Instances": cdk.listMapper(cdk.stringToCloudFormation)(properties.instances),
    "SapInstanceNumber": cdk.stringToCloudFormation(properties.sapInstanceNumber),
    "Sid": cdk.stringToCloudFormation(properties.sid),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnApplicationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationProps>();
  ret.addPropertyResult("applicationId", "ApplicationId", (properties.ApplicationId != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationId) : undefined));
  ret.addPropertyResult("applicationType", "ApplicationType", (properties.ApplicationType != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationType) : undefined));
  ret.addPropertyResult("credentials", "Credentials", (properties.Credentials != null ? cfn_parse.FromCloudFormation.getArray(CfnApplicationCredentialPropertyFromCloudFormation)(properties.Credentials) : undefined));
  ret.addPropertyResult("instances", "Instances", (properties.Instances != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Instances) : undefined));
  ret.addPropertyResult("sapInstanceNumber", "SapInstanceNumber", (properties.SapInstanceNumber != null ? cfn_parse.FromCloudFormation.getString(properties.SapInstanceNumber) : undefined));
  ret.addPropertyResult("sid", "Sid", (properties.Sid != null ? cfn_parse.FromCloudFormation.getString(properties.Sid) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}