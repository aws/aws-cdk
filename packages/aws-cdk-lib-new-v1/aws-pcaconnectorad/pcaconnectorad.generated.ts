/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates a connector between AWS Private CA and an Active Directory.
 *
 * You must specify the private CA, directory ID, and security groups.
 *
 * @cloudformationResource AWS::PCAConnectorAD::Connector
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcaconnectorad-connector.html
 */
export class CfnConnector extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::PCAConnectorAD::Connector";

  /**
   * Build a CfnConnector from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConnector {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnConnectorPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnConnector(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) that was returned when you called [CreateConnector](https://docs.aws.amazon.com/pca-connector-ad/latest/APIReference/API_CreateConnector.html) .
   *
   * @cloudformationAttribute ConnectorArn
   */
  public readonly attrConnectorArn: string;

  /**
   * The Amazon Resource Name (ARN) of the certificate authority being used.
   */
  public certificateAuthorityArn: string;

  /**
   * The identifier of the Active Directory.
   */
  public directoryId: string;

  /**
   * Metadata assigned to a connector consisting of a key-value pair.
   */
  public tags?: Record<string, string>;

  /**
   * Information of the VPC and security group(s) used with the connector.
   */
  public vpcInformation: cdk.IResolvable | CfnConnector.VpcInformationProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnConnectorProps) {
    super(scope, id, {
      "type": CfnConnector.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "certificateAuthorityArn", this);
    cdk.requireProperty(props, "directoryId", this);
    cdk.requireProperty(props, "vpcInformation", this);

    this.attrConnectorArn = cdk.Token.asString(this.getAtt("ConnectorArn", cdk.ResolutionTypeHint.STRING));
    this.certificateAuthorityArn = props.certificateAuthorityArn;
    this.directoryId = props.directoryId;
    this.tags = props.tags;
    this.vpcInformation = props.vpcInformation;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "certificateAuthorityArn": this.certificateAuthorityArn,
      "directoryId": this.directoryId,
      "tags": this.tags,
      "vpcInformation": this.vpcInformation
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnConnector.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnConnectorPropsToCloudFormation(props);
  }
}

export namespace CfnConnector {
  /**
   * Information about your VPC and security groups used with the connector.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-connector-vpcinformation.html
   */
  export interface VpcInformationProperty {
    /**
     * The security groups used with the connector.
     *
     * You can use a maximum of 4 security groups with a connector.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-connector-vpcinformation.html#cfn-pcaconnectorad-connector-vpcinformation-securitygroupids
     */
    readonly securityGroupIds: Array<string>;
  }
}

/**
 * Properties for defining a `CfnConnector`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcaconnectorad-connector.html
 */
export interface CfnConnectorProps {
  /**
   * The Amazon Resource Name (ARN) of the certificate authority being used.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcaconnectorad-connector.html#cfn-pcaconnectorad-connector-certificateauthorityarn
   */
  readonly certificateAuthorityArn: string;

  /**
   * The identifier of the Active Directory.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcaconnectorad-connector.html#cfn-pcaconnectorad-connector-directoryid
   */
  readonly directoryId: string;

  /**
   * Metadata assigned to a connector consisting of a key-value pair.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcaconnectorad-connector.html#cfn-pcaconnectorad-connector-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * Information of the VPC and security group(s) used with the connector.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcaconnectorad-connector.html#cfn-pcaconnectorad-connector-vpcinformation
   */
  readonly vpcInformation: cdk.IResolvable | CfnConnector.VpcInformationProperty;
}

/**
 * Determine whether the given properties match those of a `VpcInformationProperty`
 *
 * @param properties - the TypeScript properties of a `VpcInformationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorVpcInformationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.requiredValidator)(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  return errors.wrap("supplied properties not correct for \"VpcInformationProperty\"");
}

// @ts-ignore TS6133
function convertCfnConnectorVpcInformationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorVpcInformationPropertyValidator(properties).assertSuccess();
  return {
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds)
  };
}

// @ts-ignore TS6133
function CfnConnectorVpcInformationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConnector.VpcInformationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnector.VpcInformationProperty>();
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnConnectorProps`
 *
 * @param properties - the TypeScript properties of a `CfnConnectorProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConnectorPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificateAuthorityArn", cdk.requiredValidator)(properties.certificateAuthorityArn));
  errors.collect(cdk.propertyValidator("certificateAuthorityArn", cdk.validateString)(properties.certificateAuthorityArn));
  errors.collect(cdk.propertyValidator("directoryId", cdk.requiredValidator)(properties.directoryId));
  errors.collect(cdk.propertyValidator("directoryId", cdk.validateString)(properties.directoryId));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("vpcInformation", cdk.requiredValidator)(properties.vpcInformation));
  errors.collect(cdk.propertyValidator("vpcInformation", CfnConnectorVpcInformationPropertyValidator)(properties.vpcInformation));
  return errors.wrap("supplied properties not correct for \"CfnConnectorProps\"");
}

// @ts-ignore TS6133
function convertCfnConnectorPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConnectorPropsValidator(properties).assertSuccess();
  return {
    "CertificateAuthorityArn": cdk.stringToCloudFormation(properties.certificateAuthorityArn),
    "DirectoryId": cdk.stringToCloudFormation(properties.directoryId),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "VpcInformation": convertCfnConnectorVpcInformationPropertyToCloudFormation(properties.vpcInformation)
  };
}

// @ts-ignore TS6133
function CfnConnectorPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConnectorProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConnectorProps>();
  ret.addPropertyResult("certificateAuthorityArn", "CertificateAuthorityArn", (properties.CertificateAuthorityArn != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateAuthorityArn) : undefined));
  ret.addPropertyResult("directoryId", "DirectoryId", (properties.DirectoryId != null ? cfn_parse.FromCloudFormation.getString(properties.DirectoryId) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("vpcInformation", "VpcInformation", (properties.VpcInformation != null ? CfnConnectorVpcInformationPropertyFromCloudFormation(properties.VpcInformation) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a directory registration that authorizes communication between AWS Private CA and an Active Directory.
 *
 * @cloudformationResource AWS::PCAConnectorAD::DirectoryRegistration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcaconnectorad-directoryregistration.html
 */
export class CfnDirectoryRegistration extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::PCAConnectorAD::DirectoryRegistration";

  /**
   * Build a CfnDirectoryRegistration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDirectoryRegistration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDirectoryRegistrationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDirectoryRegistration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) that was returned when you called [CreateDirectoryRegistration](https://docs.aws.amazon.com/pca-connector-ad/latest/APIReference/API_CreateDirectoryRegistration.html) .
   *
   * @cloudformationAttribute DirectoryRegistrationArn
   */
  public readonly attrDirectoryRegistrationArn: string;

  /**
   * The identifier of the Active Directory.
   */
  public directoryId: string;

  /**
   * Metadata assigned to a directory registration consisting of a key-value pair.
   */
  public tags?: Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDirectoryRegistrationProps) {
    super(scope, id, {
      "type": CfnDirectoryRegistration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "directoryId", this);

    this.attrDirectoryRegistrationArn = cdk.Token.asString(this.getAtt("DirectoryRegistrationArn", cdk.ResolutionTypeHint.STRING));
    this.directoryId = props.directoryId;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "directoryId": this.directoryId,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDirectoryRegistration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDirectoryRegistrationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnDirectoryRegistration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcaconnectorad-directoryregistration.html
 */
export interface CfnDirectoryRegistrationProps {
  /**
   * The identifier of the Active Directory.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcaconnectorad-directoryregistration.html#cfn-pcaconnectorad-directoryregistration-directoryid
   */
  readonly directoryId: string;

  /**
   * Metadata assigned to a directory registration consisting of a key-value pair.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcaconnectorad-directoryregistration.html#cfn-pcaconnectorad-directoryregistration-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `CfnDirectoryRegistrationProps`
 *
 * @param properties - the TypeScript properties of a `CfnDirectoryRegistrationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDirectoryRegistrationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("directoryId", cdk.requiredValidator)(properties.directoryId));
  errors.collect(cdk.propertyValidator("directoryId", cdk.validateString)(properties.directoryId));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDirectoryRegistrationProps\"");
}

// @ts-ignore TS6133
function convertCfnDirectoryRegistrationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDirectoryRegistrationPropsValidator(properties).assertSuccess();
  return {
    "DirectoryId": cdk.stringToCloudFormation(properties.directoryId),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDirectoryRegistrationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDirectoryRegistrationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDirectoryRegistrationProps>();
  ret.addPropertyResult("directoryId", "DirectoryId", (properties.DirectoryId != null ? cfn_parse.FromCloudFormation.getString(properties.DirectoryId) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a service principal name (SPN) for the service account in Active Directory.
 *
 * Kerberos authentication uses SPNs to associate a service instance with a service sign-in account.
 *
 * @cloudformationResource AWS::PCAConnectorAD::ServicePrincipalName
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcaconnectorad-serviceprincipalname.html
 */
export class CfnServicePrincipalName extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::PCAConnectorAD::ServicePrincipalName";

  /**
   * Build a CfnServicePrincipalName from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnServicePrincipalName {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnServicePrincipalNamePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnServicePrincipalName(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) that was returned when you called [CreateConnector.html](https://docs.aws.amazon.com/pca-connector-ad/latest/APIReference/API_CreateConnector.html) .
   */
  public connectorArn?: string;

  /**
   * The Amazon Resource Name (ARN) that was returned when you called [CreateDirectoryRegistration](https://docs.aws.amazon.com/pca-connector-ad/latest/APIReference/API_CreateDirectoryRegistration.html) .
   */
  public directoryRegistrationArn?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnServicePrincipalNameProps = {}) {
    super(scope, id, {
      "type": CfnServicePrincipalName.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.connectorArn = props.connectorArn;
    this.directoryRegistrationArn = props.directoryRegistrationArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "connectorArn": this.connectorArn,
      "directoryRegistrationArn": this.directoryRegistrationArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnServicePrincipalName.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnServicePrincipalNamePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnServicePrincipalName`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcaconnectorad-serviceprincipalname.html
 */
export interface CfnServicePrincipalNameProps {
  /**
   * The Amazon Resource Name (ARN) that was returned when you called [CreateConnector.html](https://docs.aws.amazon.com/pca-connector-ad/latest/APIReference/API_CreateConnector.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcaconnectorad-serviceprincipalname.html#cfn-pcaconnectorad-serviceprincipalname-connectorarn
   */
  readonly connectorArn?: string;

  /**
   * The Amazon Resource Name (ARN) that was returned when you called [CreateDirectoryRegistration](https://docs.aws.amazon.com/pca-connector-ad/latest/APIReference/API_CreateDirectoryRegistration.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcaconnectorad-serviceprincipalname.html#cfn-pcaconnectorad-serviceprincipalname-directoryregistrationarn
   */
  readonly directoryRegistrationArn?: string;
}

/**
 * Determine whether the given properties match those of a `CfnServicePrincipalNameProps`
 *
 * @param properties - the TypeScript properties of a `CfnServicePrincipalNameProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServicePrincipalNamePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectorArn", cdk.validateString)(properties.connectorArn));
  errors.collect(cdk.propertyValidator("directoryRegistrationArn", cdk.validateString)(properties.directoryRegistrationArn));
  return errors.wrap("supplied properties not correct for \"CfnServicePrincipalNameProps\"");
}

// @ts-ignore TS6133
function convertCfnServicePrincipalNamePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServicePrincipalNamePropsValidator(properties).assertSuccess();
  return {
    "ConnectorArn": cdk.stringToCloudFormation(properties.connectorArn),
    "DirectoryRegistrationArn": cdk.stringToCloudFormation(properties.directoryRegistrationArn)
  };
}

// @ts-ignore TS6133
function CfnServicePrincipalNamePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnServicePrincipalNameProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServicePrincipalNameProps>();
  ret.addPropertyResult("connectorArn", "ConnectorArn", (properties.ConnectorArn != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectorArn) : undefined));
  ret.addPropertyResult("directoryRegistrationArn", "DirectoryRegistrationArn", (properties.DirectoryRegistrationArn != null ? cfn_parse.FromCloudFormation.getString(properties.DirectoryRegistrationArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates an Active Directory compatible certificate template.
 *
 * The connectors issues certificates using these templates based on the requester’s Active Directory group membership.
 *
 * @cloudformationResource AWS::PCAConnectorAD::Template
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcaconnectorad-template.html
 */
export class CfnTemplate extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::PCAConnectorAD::Template";

  /**
   * Build a CfnTemplate from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTemplate {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTemplatePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTemplate(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) that was returned when you called [CreateTemplate](https://docs.aws.amazon.com/pca-connector-ad/latest/APIReference/API_CreateTemplate.html) .
   *
   * @cloudformationAttribute TemplateArn
   */
  public readonly attrTemplateArn: string;

  /**
   * The Amazon Resource Name (ARN) that was returned when you called [CreateConnector](https://docs.aws.amazon.com/pca-connector-ad/latest/APIReference/API_CreateConnector.html) .
   */
  public connectorArn: string;

  /**
   * Template configuration to define the information included in certificates.
   */
  public definition: cdk.IResolvable | CfnTemplate.TemplateDefinitionProperty;

  /**
   * Name of the templates.
   */
  public name: string;

  /**
   * This setting allows the major version of a template to be increased automatically.
   */
  public reenrollAllCertificateHolders?: boolean | cdk.IResolvable;

  /**
   * Metadata assigned to a template consisting of a key-value pair.
   */
  public tags?: Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTemplateProps) {
    super(scope, id, {
      "type": CfnTemplate.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "connectorArn", this);
    cdk.requireProperty(props, "definition", this);
    cdk.requireProperty(props, "name", this);

    this.attrTemplateArn = cdk.Token.asString(this.getAtt("TemplateArn", cdk.ResolutionTypeHint.STRING));
    this.connectorArn = props.connectorArn;
    this.definition = props.definition;
    this.name = props.name;
    this.reenrollAllCertificateHolders = props.reenrollAllCertificateHolders;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "connectorArn": this.connectorArn,
      "definition": this.definition,
      "name": this.name,
      "reenrollAllCertificateHolders": this.reenrollAllCertificateHolders,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTemplate.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTemplatePropsToCloudFormation(props);
  }
}

export namespace CfnTemplate {
  /**
   * Template configuration to define the information included in certificates.
   *
   * Define certificate validity and renewal periods, certificate request handling and enrollment options, key usage extensions, application policies, and cryptography settings.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-templatedefinition.html
   */
  export interface TemplateDefinitionProperty {
    /**
     * Template configuration to define the information included in certificates.
     *
     * Define certificate validity and renewal periods, certificate request handling and enrollment options, key usage extensions, application policies, and cryptography settings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-templatedefinition.html#cfn-pcaconnectorad-template-templatedefinition-templatev2
     */
    readonly templateV2?: cdk.IResolvable | CfnTemplate.TemplateV2Property;

    /**
     * Template configuration to define the information included in certificates.
     *
     * Define certificate validity and renewal periods, certificate request handling and enrollment options, key usage extensions, application policies, and cryptography settings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-templatedefinition.html#cfn-pcaconnectorad-template-templatedefinition-templatev3
     */
    readonly templateV3?: cdk.IResolvable | CfnTemplate.TemplateV3Property;

    /**
     * Template configuration to define the information included in certificates.
     *
     * Define certificate validity and renewal periods, certificate request handling and enrollment options, key usage extensions, application policies, and cryptography settings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-templatedefinition.html#cfn-pcaconnectorad-template-templatedefinition-templatev4
     */
    readonly templateV4?: cdk.IResolvable | CfnTemplate.TemplateV4Property;
  }

  /**
   * v4 template schema that can use either Legacy Cryptographic Providers or Key Storage Providers.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-templatev4.html
   */
  export interface TemplateV4Property {
    /**
     * Certificate validity describes the validity and renewal periods of a certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-templatev4.html#cfn-pcaconnectorad-template-templatev4-certificatevalidity
     */
    readonly certificateValidity: CfnTemplate.CertificateValidityProperty | cdk.IResolvable;

    /**
     * Enrollment flags describe the enrollment settings for certificates using the existing private key and deleting expired or revoked certificates.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-templatev4.html#cfn-pcaconnectorad-template-templatev4-enrollmentflags
     */
    readonly enrollmentFlags: CfnTemplate.EnrollmentFlagsV4Property | cdk.IResolvable;

    /**
     * Extensions describe the key usage extensions and application policies for a template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-templatev4.html#cfn-pcaconnectorad-template-templatev4-extensions
     */
    readonly extensions: CfnTemplate.ExtensionsV4Property | cdk.IResolvable;

    /**
     * General flags describe whether the template is used for computers or users and if the template can be used with autoenrollment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-templatev4.html#cfn-pcaconnectorad-template-templatev4-generalflags
     */
    readonly generalFlags: CfnTemplate.GeneralFlagsV4Property | cdk.IResolvable;

    /**
     * Specifies the hash algorithm used to hash the private key.
     *
     * Hash algorithm can only be specified when using Key Storage Providers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-templatev4.html#cfn-pcaconnectorad-template-templatev4-hashalgorithm
     */
    readonly hashAlgorithm?: string;

    /**
     * Private key attributes allow you to specify the minimal key length, key spec, key usage, and cryptographic providers for the private key of a certificate for v4 templates.
     *
     * V4 templates allow you to use either Key Storage Providers or Legacy Cryptographic Service Providers. You specify the cryptography provider category in private key flags.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-templatev4.html#cfn-pcaconnectorad-template-templatev4-privatekeyattributes
     */
    readonly privateKeyAttributes: cdk.IResolvable | CfnTemplate.PrivateKeyAttributesV4Property;

    /**
     * Private key flags for v4 templates specify the client compatibility, if the private key can be exported, if user input is required when using a private key, if an alternate signature algorithm should be used, and if certificates are renewed using the same private key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-templatev4.html#cfn-pcaconnectorad-template-templatev4-privatekeyflags
     */
    readonly privateKeyFlags: cdk.IResolvable | CfnTemplate.PrivateKeyFlagsV4Property;

    /**
     * Subject name flags describe the subject name and subject alternate name that is included in a certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-templatev4.html#cfn-pcaconnectorad-template-templatev4-subjectnameflags
     */
    readonly subjectNameFlags: cdk.IResolvable | CfnTemplate.SubjectNameFlagsV4Property;

    /**
     * List of templates in Active Directory that are superseded by this template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-templatev4.html#cfn-pcaconnectorad-template-templatev4-supersededtemplates
     */
    readonly supersededTemplates?: Array<string>;
  }

  /**
   * Information to include in the subject name and alternate subject name of the certificate.
   *
   * The subject name can be common name, directory path, DNS as common name, or left blank. You can optionally include email to the subject name for user templates. If you leave the subject name blank then you must set a subject alternate name. The subject alternate name (SAN) can include globally unique identifier (GUID), DNS, domain DNS, email, service principal name (SPN), and user principal name (UPN). You can leave the SAN blank. If you leave the SAN blank, then you must set a subject name.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-subjectnameflagsv4.html
   */
  export interface SubjectNameFlagsV4Property {
    /**
     * Include the common name in the subject name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-subjectnameflagsv4.html#cfn-pcaconnectorad-template-subjectnameflagsv4-requirecommonname
     */
    readonly requireCommonName?: boolean | cdk.IResolvable;

    /**
     * Include the directory path in the subject name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-subjectnameflagsv4.html#cfn-pcaconnectorad-template-subjectnameflagsv4-requiredirectorypath
     */
    readonly requireDirectoryPath?: boolean | cdk.IResolvable;

    /**
     * Include the DNS as common name in the subject name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-subjectnameflagsv4.html#cfn-pcaconnectorad-template-subjectnameflagsv4-requirednsascn
     */
    readonly requireDnsAsCn?: boolean | cdk.IResolvable;

    /**
     * Include the subject's email in the subject name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-subjectnameflagsv4.html#cfn-pcaconnectorad-template-subjectnameflagsv4-requireemail
     */
    readonly requireEmail?: boolean | cdk.IResolvable;

    /**
     * Include the globally unique identifier (GUID) in the subject alternate name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-subjectnameflagsv4.html#cfn-pcaconnectorad-template-subjectnameflagsv4-sanrequiredirectoryguid
     */
    readonly sanRequireDirectoryGuid?: boolean | cdk.IResolvable;

    /**
     * Include the DNS in the subject alternate name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-subjectnameflagsv4.html#cfn-pcaconnectorad-template-subjectnameflagsv4-sanrequiredns
     */
    readonly sanRequireDns?: boolean | cdk.IResolvable;

    /**
     * Include the domain DNS in the subject alternate name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-subjectnameflagsv4.html#cfn-pcaconnectorad-template-subjectnameflagsv4-sanrequiredomaindns
     */
    readonly sanRequireDomainDns?: boolean | cdk.IResolvable;

    /**
     * Include the subject's email in the subject alternate name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-subjectnameflagsv4.html#cfn-pcaconnectorad-template-subjectnameflagsv4-sanrequireemail
     */
    readonly sanRequireEmail?: boolean | cdk.IResolvable;

    /**
     * Include the service principal name (SPN) in the subject alternate name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-subjectnameflagsv4.html#cfn-pcaconnectorad-template-subjectnameflagsv4-sanrequirespn
     */
    readonly sanRequireSpn?: boolean | cdk.IResolvable;

    /**
     * Include the user principal name (UPN) in the subject alternate name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-subjectnameflagsv4.html#cfn-pcaconnectorad-template-subjectnameflagsv4-sanrequireupn
     */
    readonly sanRequireUpn?: boolean | cdk.IResolvable;
  }

  /**
   * Private key flags for v4 templates specify the client compatibility, if the private key can be exported, if user input is required when using a private key, if an alternate signature algorithm should be used, and if certificates are renewed using the same private key.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-privatekeyflagsv4.html
   */
  export interface PrivateKeyFlagsV4Property {
    /**
     * Defines the minimum client compatibility.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-privatekeyflagsv4.html#cfn-pcaconnectorad-template-privatekeyflagsv4-clientversion
     */
    readonly clientVersion: string;

    /**
     * Allows the private key to be exported.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-privatekeyflagsv4.html#cfn-pcaconnectorad-template-privatekeyflagsv4-exportablekey
     */
    readonly exportableKey?: boolean | cdk.IResolvable;

    /**
     * Requires the PKCS #1 v2.1 signature format for certificates. You should verify that your CA, objects, and applications can accept this signature format.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-privatekeyflagsv4.html#cfn-pcaconnectorad-template-privatekeyflagsv4-requirealternatesignaturealgorithm
     */
    readonly requireAlternateSignatureAlgorithm?: boolean | cdk.IResolvable;

    /**
     * Renew certificate using the same private key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-privatekeyflagsv4.html#cfn-pcaconnectorad-template-privatekeyflagsv4-requiresamekeyrenewal
     */
    readonly requireSameKeyRenewal?: boolean | cdk.IResolvable;

    /**
     * Require user input when using the private key for enrollment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-privatekeyflagsv4.html#cfn-pcaconnectorad-template-privatekeyflagsv4-strongkeyprotectionrequired
     */
    readonly strongKeyProtectionRequired?: boolean | cdk.IResolvable;

    /**
     * Specifies the cryptographic service provider category used to generate private keys.
     *
     * Set to TRUE to use Legacy Cryptographic Service Providers and FALSE to use Key Storage Providers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-privatekeyflagsv4.html#cfn-pcaconnectorad-template-privatekeyflagsv4-uselegacyprovider
     */
    readonly useLegacyProvider?: boolean | cdk.IResolvable;
  }

  /**
   * Defines the attributes of the private key.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-privatekeyattributesv4.html
   */
  export interface PrivateKeyAttributesV4Property {
    /**
     * Defines the algorithm used to generate the private key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-privatekeyattributesv4.html#cfn-pcaconnectorad-template-privatekeyattributesv4-algorithm
     */
    readonly algorithm?: string;

    /**
     * Defines the cryptographic providers used to generate the private key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-privatekeyattributesv4.html#cfn-pcaconnectorad-template-privatekeyattributesv4-cryptoproviders
     */
    readonly cryptoProviders?: Array<string>;

    /**
     * Defines the purpose of the private key.
     *
     * Set it to "KEY_EXCHANGE" or "SIGNATURE" value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-privatekeyattributesv4.html#cfn-pcaconnectorad-template-privatekeyattributesv4-keyspec
     */
    readonly keySpec: string;

    /**
     * The key usage property defines the purpose of the private key contained in the certificate.
     *
     * You can specify specific purposes using property flags or all by using property type ALL.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-privatekeyattributesv4.html#cfn-pcaconnectorad-template-privatekeyattributesv4-keyusageproperty
     */
    readonly keyUsageProperty?: cdk.IResolvable | CfnTemplate.KeyUsagePropertyProperty;

    /**
     * Set the minimum key length of the private key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-privatekeyattributesv4.html#cfn-pcaconnectorad-template-privatekeyattributesv4-minimalkeylength
     */
    readonly minimalKeyLength: number;
  }

  /**
   * The key usage property defines the purpose of the private key contained in the certificate.
   *
   * You can specify specific purposes using property flags or all by using property type ALL.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-keyusageproperty.html
   */
  export interface KeyUsagePropertyProperty {
    /**
     * You can specify key usage for encryption, key agreement, and signature.
     *
     * You can use property flags or property type but not both.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-keyusageproperty.html#cfn-pcaconnectorad-template-keyusageproperty-propertyflags
     */
    readonly propertyFlags?: cdk.IResolvable | CfnTemplate.KeyUsagePropertyFlagsProperty;

    /**
     * You can specify all key usages using property type ALL.
     *
     * You can use property type or property flags but not both.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-keyusageproperty.html#cfn-pcaconnectorad-template-keyusageproperty-propertytype
     */
    readonly propertyType?: string;
  }

  /**
   * Specifies key usage.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-keyusagepropertyflags.html
   */
  export interface KeyUsagePropertyFlagsProperty {
    /**
     * Allows key for encryption and decryption.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-keyusagepropertyflags.html#cfn-pcaconnectorad-template-keyusagepropertyflags-decrypt
     */
    readonly decrypt?: boolean | cdk.IResolvable;

    /**
     * Allows key exchange without encryption.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-keyusagepropertyflags.html#cfn-pcaconnectorad-template-keyusagepropertyflags-keyagreement
     */
    readonly keyAgreement?: boolean | cdk.IResolvable;

    /**
     * Allow key use for digital signature.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-keyusagepropertyflags.html#cfn-pcaconnectorad-template-keyusagepropertyflags-sign
     */
    readonly sign?: boolean | cdk.IResolvable;
  }

  /**
   * General flags for v4 template schema that defines if the template is for a machine or a user and if the template can be issued using autoenrollment.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-generalflagsv4.html
   */
  export interface GeneralFlagsV4Property {
    /**
     * Allows certificate issuance using autoenrollment.
     *
     * Set to TRUE to allow autoenrollment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-generalflagsv4.html#cfn-pcaconnectorad-template-generalflagsv4-autoenrollment
     */
    readonly autoEnrollment?: boolean | cdk.IResolvable;

    /**
     * Defines if the template is for machines or users.
     *
     * Set to TRUE if the template is for machines. Set to FALSE if the template is for users
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-generalflagsv4.html#cfn-pcaconnectorad-template-generalflagsv4-machinetype
     */
    readonly machineType?: boolean | cdk.IResolvable;
  }

  /**
   * Information describing the end of the validity period of the certificate.
   *
   * This parameter sets the “Not After” date for the certificate. Certificate validity is the period of time during which a certificate is valid. Validity can be expressed as an explicit date and time when the certificate expires, or as a span of time after issuance, stated in days, months, or years. For more information, see Validity in RFC 5280. This value is unaffected when ValidityNotBefore is also specified. For example, if Validity is set to 20 days in the future, the certificate will expire 20 days from issuance time regardless of the ValidityNotBefore value.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-certificatevalidity.html
   */
  export interface CertificateValidityProperty {
    /**
     * Renewal period is the period of time before certificate expiration when a new certificate will be requested.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-certificatevalidity.html#cfn-pcaconnectorad-template-certificatevalidity-renewalperiod
     */
    readonly renewalPeriod: cdk.IResolvable | CfnTemplate.ValidityPeriodProperty;

    /**
     * Information describing the end of the validity period of the certificate.
     *
     * This parameter sets the “Not After” date for the certificate. Certificate validity is the period of time during which a certificate is valid. Validity can be expressed as an explicit date and time when the certificate expires, or as a span of time after issuance, stated in days, months, or years. For more information, see Validity in RFC 5280. This value is unaffected when ValidityNotBefore is also specified. For example, if Validity is set to 20 days in the future, the certificate will expire 20 days from issuance time regardless of the ValidityNotBefore value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-certificatevalidity.html#cfn-pcaconnectorad-template-certificatevalidity-validityperiod
     */
    readonly validityPeriod: cdk.IResolvable | CfnTemplate.ValidityPeriodProperty;
  }

  /**
   * Information describing the end of the validity period of the certificate.
   *
   * This parameter sets the “Not After” date for the certificate. Certificate validity is the period of time during which a certificate is valid. Validity can be expressed as an explicit date and time when the certificate expires, or as a span of time after issuance, stated in hours, days, months, or years. For more information, see Validity in RFC 5280. This value is unaffected when ValidityNotBefore is also specified. For example, if Validity is set to 20 days in the future, the certificate will expire 20 days from issuance time regardless of the ValidityNotBefore value.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-validityperiod.html
   */
  export interface ValidityPeriodProperty {
    /**
     * The numeric value for the validity period.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-validityperiod.html#cfn-pcaconnectorad-template-validityperiod-period
     */
    readonly period: number;

    /**
     * The unit of time.
     *
     * You can select hours, days, weeks, months, and years.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-validityperiod.html#cfn-pcaconnectorad-template-validityperiod-periodtype
     */
    readonly periodType: string;
  }

  /**
   * Certificate extensions for v4 template schema.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-extensionsv4.html
   */
  export interface ExtensionsV4Property {
    /**
     * Application policies specify what the certificate is used for and its purpose.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-extensionsv4.html#cfn-pcaconnectorad-template-extensionsv4-applicationpolicies
     */
    readonly applicationPolicies?: CfnTemplate.ApplicationPoliciesProperty | cdk.IResolvable;

    /**
     * The key usage extension defines the purpose (e.g., encipherment, signature) of the key contained in the certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-extensionsv4.html#cfn-pcaconnectorad-template-extensionsv4-keyusage
     */
    readonly keyUsage: cdk.IResolvable | CfnTemplate.KeyUsageProperty;
  }

  /**
   * Application policies describe what the certificate can be used for.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-applicationpolicies.html
   */
  export interface ApplicationPoliciesProperty {
    /**
     * Marks the application policy extension as critical.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-applicationpolicies.html#cfn-pcaconnectorad-template-applicationpolicies-critical
     */
    readonly critical?: boolean | cdk.IResolvable;

    /**
     * Application policies describe what the certificate can be used for.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-applicationpolicies.html#cfn-pcaconnectorad-template-applicationpolicies-policies
     */
    readonly policies: Array<CfnTemplate.ApplicationPolicyProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * Application policies describe what the certificate can be used for.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-applicationpolicy.html
   */
  export interface ApplicationPolicyProperty {
    /**
     * The object identifier (OID) of an application policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-applicationpolicy.html#cfn-pcaconnectorad-template-applicationpolicy-policyobjectidentifier
     */
    readonly policyObjectIdentifier?: string;

    /**
     * The type of application policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-applicationpolicy.html#cfn-pcaconnectorad-template-applicationpolicy-policytype
     */
    readonly policyType?: string;
  }

  /**
   * The key usage extension defines the purpose (e.g., encipherment, signature) of the key contained in the certificate.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-keyusage.html
   */
  export interface KeyUsageProperty {
    /**
     * Sets the key usage extension to critical.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-keyusage.html#cfn-pcaconnectorad-template-keyusage-critical
     */
    readonly critical?: boolean | cdk.IResolvable;

    /**
     * The key usage flags represent the purpose (e.g., encipherment, signature) of the key contained in the certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-keyusage.html#cfn-pcaconnectorad-template-keyusage-usageflags
     */
    readonly usageFlags: cdk.IResolvable | CfnTemplate.KeyUsageFlagsProperty;
  }

  /**
   * The key usage flags represent the purpose (e.g., encipherment, signature) of the key contained in the certificate.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-keyusageflags.html
   */
  export interface KeyUsageFlagsProperty {
    /**
     * DataEncipherment is asserted when the subject public key is used for directly enciphering raw user data without the use of an intermediate symmetric cipher.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-keyusageflags.html#cfn-pcaconnectorad-template-keyusageflags-dataencipherment
     */
    readonly dataEncipherment?: boolean | cdk.IResolvable;

    /**
     * The digitalSignature is asserted when the subject public key is used for verifying digital signatures.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-keyusageflags.html#cfn-pcaconnectorad-template-keyusageflags-digitalsignature
     */
    readonly digitalSignature?: boolean | cdk.IResolvable;

    /**
     * KeyAgreement is asserted when the subject public key is used for key agreement.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-keyusageflags.html#cfn-pcaconnectorad-template-keyusageflags-keyagreement
     */
    readonly keyAgreement?: boolean | cdk.IResolvable;

    /**
     * KeyEncipherment is asserted when the subject public key is used for enciphering private or secret keys, i.e., for key transport.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-keyusageflags.html#cfn-pcaconnectorad-template-keyusageflags-keyencipherment
     */
    readonly keyEncipherment?: boolean | cdk.IResolvable;

    /**
     * NonRepudiation is asserted when the subject public key is used to verify digital signatures.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-keyusageflags.html#cfn-pcaconnectorad-template-keyusageflags-nonrepudiation
     */
    readonly nonRepudiation?: boolean | cdk.IResolvable;
  }

  /**
   * Template configurations for v4 template schema.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-enrollmentflagsv4.html
   */
  export interface EnrollmentFlagsV4Property {
    /**
     * Allow renewal using the same key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-enrollmentflagsv4.html#cfn-pcaconnectorad-template-enrollmentflagsv4-enablekeyreuseonnttokenkeysetstoragefull
     */
    readonly enableKeyReuseOnNtTokenKeysetStorageFull?: boolean | cdk.IResolvable;

    /**
     * Include symmetric algorithms allowed by the subject.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-enrollmentflagsv4.html#cfn-pcaconnectorad-template-enrollmentflagsv4-includesymmetricalgorithms
     */
    readonly includeSymmetricAlgorithms?: boolean | cdk.IResolvable;

    /**
     * This flag instructs the CA to not include the security extension szOID_NTDS_CA_SECURITY_EXT (OID:1.3.6.1.4.1.311.25.2), as specified in [MS-WCCE] sections 2.2.2.7.7.4 and 3.2.2.6.2.1.4.5.9, in the issued certificate. This addresses a Windows Kerberos elevation-of-privilege vulnerability.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-enrollmentflagsv4.html#cfn-pcaconnectorad-template-enrollmentflagsv4-nosecurityextension
     */
    readonly noSecurityExtension?: boolean | cdk.IResolvable;

    /**
     * Delete expired or revoked certificates instead of archiving them.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-enrollmentflagsv4.html#cfn-pcaconnectorad-template-enrollmentflagsv4-removeinvalidcertificatefrompersonalstore
     */
    readonly removeInvalidCertificateFromPersonalStore?: boolean | cdk.IResolvable;

    /**
     * Require user interaction when the subject is enrolled and the private key associated with the certificate is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-enrollmentflagsv4.html#cfn-pcaconnectorad-template-enrollmentflagsv4-userinteractionrequired
     */
    readonly userInteractionRequired?: boolean | cdk.IResolvable;
  }

  /**
   * v3 template schema that uses Key Storage Providers.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-templatev3.html
   */
  export interface TemplateV3Property {
    /**
     * Certificate validity describes the validity and renewal periods of a certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-templatev3.html#cfn-pcaconnectorad-template-templatev3-certificatevalidity
     */
    readonly certificateValidity: CfnTemplate.CertificateValidityProperty | cdk.IResolvable;

    /**
     * Enrollment flags describe the enrollment settings for certificates such as using the existing private key and deleting expired or revoked certificates.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-templatev3.html#cfn-pcaconnectorad-template-templatev3-enrollmentflags
     */
    readonly enrollmentFlags: CfnTemplate.EnrollmentFlagsV3Property | cdk.IResolvable;

    /**
     * Extensions describe the key usage extensions and application policies for a template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-templatev3.html#cfn-pcaconnectorad-template-templatev3-extensions
     */
    readonly extensions: CfnTemplate.ExtensionsV3Property | cdk.IResolvable;

    /**
     * General flags describe whether the template is used for computers or users and if the template can be used with autoenrollment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-templatev3.html#cfn-pcaconnectorad-template-templatev3-generalflags
     */
    readonly generalFlags: CfnTemplate.GeneralFlagsV3Property | cdk.IResolvable;

    /**
     * Specifies the hash algorithm used to hash the private key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-templatev3.html#cfn-pcaconnectorad-template-templatev3-hashalgorithm
     */
    readonly hashAlgorithm: string;

    /**
     * Private key attributes allow you to specify the algorithm, minimal key length, key spec, key usage, and cryptographic providers for the private key of a certificate for v3 templates.
     *
     * V3 templates allow you to use Key Storage Providers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-templatev3.html#cfn-pcaconnectorad-template-templatev3-privatekeyattributes
     */
    readonly privateKeyAttributes: cdk.IResolvable | CfnTemplate.PrivateKeyAttributesV3Property;

    /**
     * Private key flags for v3 templates specify the client compatibility, if the private key can be exported, if user input is required when using a private key, and if an alternate signature algorithm should be used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-templatev3.html#cfn-pcaconnectorad-template-templatev3-privatekeyflags
     */
    readonly privateKeyFlags: cdk.IResolvable | CfnTemplate.PrivateKeyFlagsV3Property;

    /**
     * Subject name flags describe the subject name and subject alternate name that is included in a certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-templatev3.html#cfn-pcaconnectorad-template-templatev3-subjectnameflags
     */
    readonly subjectNameFlags: cdk.IResolvable | CfnTemplate.SubjectNameFlagsV3Property;

    /**
     * List of templates in Active Directory that are superseded by this template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-templatev3.html#cfn-pcaconnectorad-template-templatev3-supersededtemplates
     */
    readonly supersededTemplates?: Array<string>;
  }

  /**
   * Information to include in the subject name and alternate subject name of the certificate.
   *
   * The subject name can be common name, directory path, DNS as common name, or left blank. You can optionally include email to the subject name for user templates. If you leave the subject name blank then you must set a subject alternate name. The subject alternate name (SAN) can include globally unique identifier (GUID), DNS, domain DNS, email, service principal name (SPN), and user principal name (UPN). You can leave the SAN blank. If you leave the SAN blank, then you must set a subject name.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-subjectnameflagsv3.html
   */
  export interface SubjectNameFlagsV3Property {
    /**
     * Include the common name in the subject name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-subjectnameflagsv3.html#cfn-pcaconnectorad-template-subjectnameflagsv3-requirecommonname
     */
    readonly requireCommonName?: boolean | cdk.IResolvable;

    /**
     * Include the directory path in the subject name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-subjectnameflagsv3.html#cfn-pcaconnectorad-template-subjectnameflagsv3-requiredirectorypath
     */
    readonly requireDirectoryPath?: boolean | cdk.IResolvable;

    /**
     * Include the DNS as common name in the subject name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-subjectnameflagsv3.html#cfn-pcaconnectorad-template-subjectnameflagsv3-requirednsascn
     */
    readonly requireDnsAsCn?: boolean | cdk.IResolvable;

    /**
     * Include the subject's email in the subject name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-subjectnameflagsv3.html#cfn-pcaconnectorad-template-subjectnameflagsv3-requireemail
     */
    readonly requireEmail?: boolean | cdk.IResolvable;

    /**
     * Include the globally unique identifier (GUID) in the subject alternate name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-subjectnameflagsv3.html#cfn-pcaconnectorad-template-subjectnameflagsv3-sanrequiredirectoryguid
     */
    readonly sanRequireDirectoryGuid?: boolean | cdk.IResolvable;

    /**
     * Include the DNS in the subject alternate name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-subjectnameflagsv3.html#cfn-pcaconnectorad-template-subjectnameflagsv3-sanrequiredns
     */
    readonly sanRequireDns?: boolean | cdk.IResolvable;

    /**
     * Include the domain DNS in the subject alternate name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-subjectnameflagsv3.html#cfn-pcaconnectorad-template-subjectnameflagsv3-sanrequiredomaindns
     */
    readonly sanRequireDomainDns?: boolean | cdk.IResolvable;

    /**
     * Include the subject's email in the subject alternate name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-subjectnameflagsv3.html#cfn-pcaconnectorad-template-subjectnameflagsv3-sanrequireemail
     */
    readonly sanRequireEmail?: boolean | cdk.IResolvable;

    /**
     * Include the service principal name (SPN) in the subject alternate name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-subjectnameflagsv3.html#cfn-pcaconnectorad-template-subjectnameflagsv3-sanrequirespn
     */
    readonly sanRequireSpn?: boolean | cdk.IResolvable;

    /**
     * Include the user principal name (UPN) in the subject alternate name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-subjectnameflagsv3.html#cfn-pcaconnectorad-template-subjectnameflagsv3-sanrequireupn
     */
    readonly sanRequireUpn?: boolean | cdk.IResolvable;
  }

  /**
   * Private key flags for v3 templates specify the client compatibility, if the private key can be exported, if user input is required when using a private key, and if an alternate signature algorithm should be used.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-privatekeyflagsv3.html
   */
  export interface PrivateKeyFlagsV3Property {
    /**
     * Defines the minimum client compatibility.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-privatekeyflagsv3.html#cfn-pcaconnectorad-template-privatekeyflagsv3-clientversion
     */
    readonly clientVersion: string;

    /**
     * Allows the private key to be exported.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-privatekeyflagsv3.html#cfn-pcaconnectorad-template-privatekeyflagsv3-exportablekey
     */
    readonly exportableKey?: boolean | cdk.IResolvable;

    /**
     * Reguires the PKCS #1 v2.1 signature format for certificates. You should verify that your CA, objects, and applications can accept this signature format.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-privatekeyflagsv3.html#cfn-pcaconnectorad-template-privatekeyflagsv3-requirealternatesignaturealgorithm
     */
    readonly requireAlternateSignatureAlgorithm?: boolean | cdk.IResolvable;

    /**
     * Requirer user input when using the private key for enrollment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-privatekeyflagsv3.html#cfn-pcaconnectorad-template-privatekeyflagsv3-strongkeyprotectionrequired
     */
    readonly strongKeyProtectionRequired?: boolean | cdk.IResolvable;
  }

  /**
   * Defines the attributes of the private key.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-privatekeyattributesv3.html
   */
  export interface PrivateKeyAttributesV3Property {
    /**
     * Defines the algorithm used to generate the private key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-privatekeyattributesv3.html#cfn-pcaconnectorad-template-privatekeyattributesv3-algorithm
     */
    readonly algorithm: string;

    /**
     * Defines the cryptographic providers used to generate the private key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-privatekeyattributesv3.html#cfn-pcaconnectorad-template-privatekeyattributesv3-cryptoproviders
     */
    readonly cryptoProviders?: Array<string>;

    /**
     * Defines the purpose of the private key.
     *
     * Set it to "KEY_EXCHANGE" or "SIGNATURE" value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-privatekeyattributesv3.html#cfn-pcaconnectorad-template-privatekeyattributesv3-keyspec
     */
    readonly keySpec: string;

    /**
     * The key usage property defines the purpose of the private key contained in the certificate.
     *
     * You can specify specific purposes using property flags or all by using property type ALL.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-privatekeyattributesv3.html#cfn-pcaconnectorad-template-privatekeyattributesv3-keyusageproperty
     */
    readonly keyUsageProperty: cdk.IResolvable | CfnTemplate.KeyUsagePropertyProperty;

    /**
     * Set the minimum key length of the private key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-privatekeyattributesv3.html#cfn-pcaconnectorad-template-privatekeyattributesv3-minimalkeylength
     */
    readonly minimalKeyLength: number;
  }

  /**
   * General flags for v3 template schema that defines if the template is for a machine or a user and if the template can be issued using autoenrollment.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-generalflagsv3.html
   */
  export interface GeneralFlagsV3Property {
    /**
     * Allows certificate issuance using autoenrollment.
     *
     * Set to TRUE to allow autoenrollment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-generalflagsv3.html#cfn-pcaconnectorad-template-generalflagsv3-autoenrollment
     */
    readonly autoEnrollment?: boolean | cdk.IResolvable;

    /**
     * Defines if the template is for machines or users.
     *
     * Set to TRUE if the template is for machines. Set to FALSE if the template is for users
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-generalflagsv3.html#cfn-pcaconnectorad-template-generalflagsv3-machinetype
     */
    readonly machineType?: boolean | cdk.IResolvable;
  }

  /**
   * Certificate extensions for v3 template schema.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-extensionsv3.html
   */
  export interface ExtensionsV3Property {
    /**
     * Application policies specify what the certificate is used for and its purpose.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-extensionsv3.html#cfn-pcaconnectorad-template-extensionsv3-applicationpolicies
     */
    readonly applicationPolicies?: CfnTemplate.ApplicationPoliciesProperty | cdk.IResolvable;

    /**
     * The key usage extension defines the purpose (e.g., encipherment, signature, certificate signing) of the key contained in the certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-extensionsv3.html#cfn-pcaconnectorad-template-extensionsv3-keyusage
     */
    readonly keyUsage: cdk.IResolvable | CfnTemplate.KeyUsageProperty;
  }

  /**
   * Template configurations for v3 template schema.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-enrollmentflagsv3.html
   */
  export interface EnrollmentFlagsV3Property {
    /**
     * Allow renewal using the same key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-enrollmentflagsv3.html#cfn-pcaconnectorad-template-enrollmentflagsv3-enablekeyreuseonnttokenkeysetstoragefull
     */
    readonly enableKeyReuseOnNtTokenKeysetStorageFull?: boolean | cdk.IResolvable;

    /**
     * Include symmetric algorithms allowed by the subject.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-enrollmentflagsv3.html#cfn-pcaconnectorad-template-enrollmentflagsv3-includesymmetricalgorithms
     */
    readonly includeSymmetricAlgorithms?: boolean | cdk.IResolvable;

    /**
     * This flag instructs the CA to not include the security extension szOID_NTDS_CA_SECURITY_EXT (OID:1.3.6.1.4.1.311.25.2), as specified in [MS-WCCE] sections 2.2.2.7.7.4 and 3.2.2.6.2.1.4.5.9, in the issued certificate. This addresses a Windows Kerberos elevation-of-privilege vulnerability.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-enrollmentflagsv3.html#cfn-pcaconnectorad-template-enrollmentflagsv3-nosecurityextension
     */
    readonly noSecurityExtension?: boolean | cdk.IResolvable;

    /**
     * Delete expired or revoked certificates instead of archiving them.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-enrollmentflagsv3.html#cfn-pcaconnectorad-template-enrollmentflagsv3-removeinvalidcertificatefrompersonalstore
     */
    readonly removeInvalidCertificateFromPersonalStore?: boolean | cdk.IResolvable;

    /**
     * Require user interaction when the subject is enrolled and the private key associated with the certificate is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-enrollmentflagsv3.html#cfn-pcaconnectorad-template-enrollmentflagsv3-userinteractionrequired
     */
    readonly userInteractionRequired?: boolean | cdk.IResolvable;
  }

  /**
   * v2 template schema that uses Legacy Cryptographic Providers.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-templatev2.html
   */
  export interface TemplateV2Property {
    /**
     * Certificate validity describes the validity and renewal periods of a certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-templatev2.html#cfn-pcaconnectorad-template-templatev2-certificatevalidity
     */
    readonly certificateValidity: CfnTemplate.CertificateValidityProperty | cdk.IResolvable;

    /**
     * Enrollment flags describe the enrollment settings for certificates such as using the existing private key and deleting expired or revoked certificates.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-templatev2.html#cfn-pcaconnectorad-template-templatev2-enrollmentflags
     */
    readonly enrollmentFlags: CfnTemplate.EnrollmentFlagsV2Property | cdk.IResolvable;

    /**
     * Extensions describe the key usage extensions and application policies for a template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-templatev2.html#cfn-pcaconnectorad-template-templatev2-extensions
     */
    readonly extensions: CfnTemplate.ExtensionsV2Property | cdk.IResolvable;

    /**
     * General flags describe whether the template is used for computers or users and if the template can be used with autoenrollment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-templatev2.html#cfn-pcaconnectorad-template-templatev2-generalflags
     */
    readonly generalFlags: CfnTemplate.GeneralFlagsV2Property | cdk.IResolvable;

    /**
     * Private key attributes allow you to specify the minimal key length, key spec, and cryptographic providers for the private key of a certificate for v2 templates.
     *
     * V2 templates allow you to use Legacy Cryptographic Service Providers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-templatev2.html#cfn-pcaconnectorad-template-templatev2-privatekeyattributes
     */
    readonly privateKeyAttributes: cdk.IResolvable | CfnTemplate.PrivateKeyAttributesV2Property;

    /**
     * Private key flags for v2 templates specify the client compatibility, if the private key can be exported, and if user input is required when using a private key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-templatev2.html#cfn-pcaconnectorad-template-templatev2-privatekeyflags
     */
    readonly privateKeyFlags: cdk.IResolvable | CfnTemplate.PrivateKeyFlagsV2Property;

    /**
     * Subject name flags describe the subject name and subject alternate name that is included in a certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-templatev2.html#cfn-pcaconnectorad-template-templatev2-subjectnameflags
     */
    readonly subjectNameFlags: cdk.IResolvable | CfnTemplate.SubjectNameFlagsV2Property;

    /**
     * List of templates in Active Directory that are superseded by this template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-templatev2.html#cfn-pcaconnectorad-template-templatev2-supersededtemplates
     */
    readonly supersededTemplates?: Array<string>;
  }

  /**
   * Information to include in the subject name and alternate subject name of the certificate.
   *
   * The subject name can be common name, directory path, DNS as common name, or left blank. You can optionally include email to the subject name for user templates. If you leave the subject name blank then you must set a subject alternate name. The subject alternate name (SAN) can include globally unique identifier (GUID), DNS, domain DNS, email, service principal name (SPN), and user principal name (UPN). You can leave the SAN blank. If you leave the SAN blank, then you must set a subject name.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-subjectnameflagsv2.html
   */
  export interface SubjectNameFlagsV2Property {
    /**
     * Include the common name in the subject name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-subjectnameflagsv2.html#cfn-pcaconnectorad-template-subjectnameflagsv2-requirecommonname
     */
    readonly requireCommonName?: boolean | cdk.IResolvable;

    /**
     * Include the directory path in the subject name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-subjectnameflagsv2.html#cfn-pcaconnectorad-template-subjectnameflagsv2-requiredirectorypath
     */
    readonly requireDirectoryPath?: boolean | cdk.IResolvable;

    /**
     * Include the DNS as common name in the subject name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-subjectnameflagsv2.html#cfn-pcaconnectorad-template-subjectnameflagsv2-requirednsascn
     */
    readonly requireDnsAsCn?: boolean | cdk.IResolvable;

    /**
     * Include the subject's email in the subject name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-subjectnameflagsv2.html#cfn-pcaconnectorad-template-subjectnameflagsv2-requireemail
     */
    readonly requireEmail?: boolean | cdk.IResolvable;

    /**
     * Include the globally unique identifier (GUID) in the subject alternate name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-subjectnameflagsv2.html#cfn-pcaconnectorad-template-subjectnameflagsv2-sanrequiredirectoryguid
     */
    readonly sanRequireDirectoryGuid?: boolean | cdk.IResolvable;

    /**
     * Include the DNS in the subject alternate name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-subjectnameflagsv2.html#cfn-pcaconnectorad-template-subjectnameflagsv2-sanrequiredns
     */
    readonly sanRequireDns?: boolean | cdk.IResolvable;

    /**
     * Include the domain DNS in the subject alternate name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-subjectnameflagsv2.html#cfn-pcaconnectorad-template-subjectnameflagsv2-sanrequiredomaindns
     */
    readonly sanRequireDomainDns?: boolean | cdk.IResolvable;

    /**
     * Include the subject's email in the subject alternate name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-subjectnameflagsv2.html#cfn-pcaconnectorad-template-subjectnameflagsv2-sanrequireemail
     */
    readonly sanRequireEmail?: boolean | cdk.IResolvable;

    /**
     * Include the service principal name (SPN) in the subject alternate name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-subjectnameflagsv2.html#cfn-pcaconnectorad-template-subjectnameflagsv2-sanrequirespn
     */
    readonly sanRequireSpn?: boolean | cdk.IResolvable;

    /**
     * Include the user principal name (UPN) in the subject alternate name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-subjectnameflagsv2.html#cfn-pcaconnectorad-template-subjectnameflagsv2-sanrequireupn
     */
    readonly sanRequireUpn?: boolean | cdk.IResolvable;
  }

  /**
   * Private key flags for v2 templates specify the client compatibility, if the private key can be exported, and if user input is required when using a private key.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-privatekeyflagsv2.html
   */
  export interface PrivateKeyFlagsV2Property {
    /**
     * Defines the minimum client compatibility.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-privatekeyflagsv2.html#cfn-pcaconnectorad-template-privatekeyflagsv2-clientversion
     */
    readonly clientVersion: string;

    /**
     * Allows the private key to be exported.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-privatekeyflagsv2.html#cfn-pcaconnectorad-template-privatekeyflagsv2-exportablekey
     */
    readonly exportableKey?: boolean | cdk.IResolvable;

    /**
     * Require user input when using the private key for enrollment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-privatekeyflagsv2.html#cfn-pcaconnectorad-template-privatekeyflagsv2-strongkeyprotectionrequired
     */
    readonly strongKeyProtectionRequired?: boolean | cdk.IResolvable;
  }

  /**
   * Defines the attributes of the private key.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-privatekeyattributesv2.html
   */
  export interface PrivateKeyAttributesV2Property {
    /**
     * Defines the cryptographic providers used to generate the private key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-privatekeyattributesv2.html#cfn-pcaconnectorad-template-privatekeyattributesv2-cryptoproviders
     */
    readonly cryptoProviders?: Array<string>;

    /**
     * Defines the purpose of the private key.
     *
     * Set it to "KEY_EXCHANGE" or "SIGNATURE" value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-privatekeyattributesv2.html#cfn-pcaconnectorad-template-privatekeyattributesv2-keyspec
     */
    readonly keySpec: string;

    /**
     * Set the minimum key length of the private key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-privatekeyattributesv2.html#cfn-pcaconnectorad-template-privatekeyattributesv2-minimalkeylength
     */
    readonly minimalKeyLength: number;
  }

  /**
   * General flags for v2 template schema that defines if the template is for a machine or a user and if the template can be issued using autoenrollment.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-generalflagsv2.html
   */
  export interface GeneralFlagsV2Property {
    /**
     * Allows certificate issuance using autoenrollment.
     *
     * Set to TRUE to allow autoenrollment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-generalflagsv2.html#cfn-pcaconnectorad-template-generalflagsv2-autoenrollment
     */
    readonly autoEnrollment?: boolean | cdk.IResolvable;

    /**
     * Defines if the template is for machines or users.
     *
     * Set to TRUE if the template is for machines. Set to FALSE if the template is for users.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-generalflagsv2.html#cfn-pcaconnectorad-template-generalflagsv2-machinetype
     */
    readonly machineType?: boolean | cdk.IResolvable;
  }

  /**
   * Certificate extensions for v2 template schema.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-extensionsv2.html
   */
  export interface ExtensionsV2Property {
    /**
     * Application policies specify what the certificate is used for and its purpose.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-extensionsv2.html#cfn-pcaconnectorad-template-extensionsv2-applicationpolicies
     */
    readonly applicationPolicies?: CfnTemplate.ApplicationPoliciesProperty | cdk.IResolvable;

    /**
     * The key usage extension defines the purpose (e.g., encipherment, signature, certificate signing) of the key contained in the certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-extensionsv2.html#cfn-pcaconnectorad-template-extensionsv2-keyusage
     */
    readonly keyUsage: cdk.IResolvable | CfnTemplate.KeyUsageProperty;
  }

  /**
   * Template configurations for v2 template schema.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-enrollmentflagsv2.html
   */
  export interface EnrollmentFlagsV2Property {
    /**
     * Allow renewal using the same key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-enrollmentflagsv2.html#cfn-pcaconnectorad-template-enrollmentflagsv2-enablekeyreuseonnttokenkeysetstoragefull
     */
    readonly enableKeyReuseOnNtTokenKeysetStorageFull?: boolean | cdk.IResolvable;

    /**
     * Include symmetric algorithms allowed by the subject.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-enrollmentflagsv2.html#cfn-pcaconnectorad-template-enrollmentflagsv2-includesymmetricalgorithms
     */
    readonly includeSymmetricAlgorithms?: boolean | cdk.IResolvable;

    /**
     * This flag instructs the CA to not include the security extension szOID_NTDS_CA_SECURITY_EXT (OID:1.3.6.1.4.1.311.25.2), as specified in [MS-WCCE] sections 2.2.2.7.7.4 and 3.2.2.6.2.1.4.5.9, in the issued certificate. This addresses a Windows Kerberos elevation-of-privilege vulnerability.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-enrollmentflagsv2.html#cfn-pcaconnectorad-template-enrollmentflagsv2-nosecurityextension
     */
    readonly noSecurityExtension?: boolean | cdk.IResolvable;

    /**
     * Delete expired or revoked certificates instead of archiving them.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-enrollmentflagsv2.html#cfn-pcaconnectorad-template-enrollmentflagsv2-removeinvalidcertificatefrompersonalstore
     */
    readonly removeInvalidCertificateFromPersonalStore?: boolean | cdk.IResolvable;

    /**
     * Require user interaction when the subject is enrolled and the private key associated with the certificate is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-template-enrollmentflagsv2.html#cfn-pcaconnectorad-template-enrollmentflagsv2-userinteractionrequired
     */
    readonly userInteractionRequired?: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnTemplate`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcaconnectorad-template.html
 */
export interface CfnTemplateProps {
  /**
   * The Amazon Resource Name (ARN) that was returned when you called [CreateConnector](https://docs.aws.amazon.com/pca-connector-ad/latest/APIReference/API_CreateConnector.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcaconnectorad-template.html#cfn-pcaconnectorad-template-connectorarn
   */
  readonly connectorArn: string;

  /**
   * Template configuration to define the information included in certificates.
   *
   * Define certificate validity and renewal periods, certificate request handling and enrollment options, key usage extensions, application policies, and cryptography settings.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcaconnectorad-template.html#cfn-pcaconnectorad-template-definition
   */
  readonly definition: cdk.IResolvable | CfnTemplate.TemplateDefinitionProperty;

  /**
   * Name of the templates.
   *
   * Template names must be unique.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcaconnectorad-template.html#cfn-pcaconnectorad-template-name
   */
  readonly name: string;

  /**
   * This setting allows the major version of a template to be increased automatically.
   *
   * All members of Active Directory groups that are allowed to enroll with a template will receive a new certificate issued using that template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcaconnectorad-template.html#cfn-pcaconnectorad-template-reenrollallcertificateholders
   */
  readonly reenrollAllCertificateHolders?: boolean | cdk.IResolvable;

  /**
   * Metadata assigned to a template consisting of a key-value pair.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcaconnectorad-template.html#cfn-pcaconnectorad-template-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `SubjectNameFlagsV4Property`
 *
 * @param properties - the TypeScript properties of a `SubjectNameFlagsV4Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplateSubjectNameFlagsV4PropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("requireCommonName", cdk.validateBoolean)(properties.requireCommonName));
  errors.collect(cdk.propertyValidator("requireDirectoryPath", cdk.validateBoolean)(properties.requireDirectoryPath));
  errors.collect(cdk.propertyValidator("requireDnsAsCn", cdk.validateBoolean)(properties.requireDnsAsCn));
  errors.collect(cdk.propertyValidator("requireEmail", cdk.validateBoolean)(properties.requireEmail));
  errors.collect(cdk.propertyValidator("sanRequireDirectoryGuid", cdk.validateBoolean)(properties.sanRequireDirectoryGuid));
  errors.collect(cdk.propertyValidator("sanRequireDns", cdk.validateBoolean)(properties.sanRequireDns));
  errors.collect(cdk.propertyValidator("sanRequireDomainDns", cdk.validateBoolean)(properties.sanRequireDomainDns));
  errors.collect(cdk.propertyValidator("sanRequireEmail", cdk.validateBoolean)(properties.sanRequireEmail));
  errors.collect(cdk.propertyValidator("sanRequireSpn", cdk.validateBoolean)(properties.sanRequireSpn));
  errors.collect(cdk.propertyValidator("sanRequireUpn", cdk.validateBoolean)(properties.sanRequireUpn));
  return errors.wrap("supplied properties not correct for \"SubjectNameFlagsV4Property\"");
}

// @ts-ignore TS6133
function convertCfnTemplateSubjectNameFlagsV4PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplateSubjectNameFlagsV4PropertyValidator(properties).assertSuccess();
  return {
    "RequireCommonName": cdk.booleanToCloudFormation(properties.requireCommonName),
    "RequireDirectoryPath": cdk.booleanToCloudFormation(properties.requireDirectoryPath),
    "RequireDnsAsCn": cdk.booleanToCloudFormation(properties.requireDnsAsCn),
    "RequireEmail": cdk.booleanToCloudFormation(properties.requireEmail),
    "SanRequireDirectoryGuid": cdk.booleanToCloudFormation(properties.sanRequireDirectoryGuid),
    "SanRequireDns": cdk.booleanToCloudFormation(properties.sanRequireDns),
    "SanRequireDomainDns": cdk.booleanToCloudFormation(properties.sanRequireDomainDns),
    "SanRequireEmail": cdk.booleanToCloudFormation(properties.sanRequireEmail),
    "SanRequireSpn": cdk.booleanToCloudFormation(properties.sanRequireSpn),
    "SanRequireUpn": cdk.booleanToCloudFormation(properties.sanRequireUpn)
  };
}

// @ts-ignore TS6133
function CfnTemplateSubjectNameFlagsV4PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTemplate.SubjectNameFlagsV4Property> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.SubjectNameFlagsV4Property>();
  ret.addPropertyResult("requireCommonName", "RequireCommonName", (properties.RequireCommonName != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RequireCommonName) : undefined));
  ret.addPropertyResult("requireDirectoryPath", "RequireDirectoryPath", (properties.RequireDirectoryPath != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RequireDirectoryPath) : undefined));
  ret.addPropertyResult("requireDnsAsCn", "RequireDnsAsCn", (properties.RequireDnsAsCn != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RequireDnsAsCn) : undefined));
  ret.addPropertyResult("requireEmail", "RequireEmail", (properties.RequireEmail != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RequireEmail) : undefined));
  ret.addPropertyResult("sanRequireDirectoryGuid", "SanRequireDirectoryGuid", (properties.SanRequireDirectoryGuid != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SanRequireDirectoryGuid) : undefined));
  ret.addPropertyResult("sanRequireDns", "SanRequireDns", (properties.SanRequireDns != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SanRequireDns) : undefined));
  ret.addPropertyResult("sanRequireDomainDns", "SanRequireDomainDns", (properties.SanRequireDomainDns != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SanRequireDomainDns) : undefined));
  ret.addPropertyResult("sanRequireEmail", "SanRequireEmail", (properties.SanRequireEmail != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SanRequireEmail) : undefined));
  ret.addPropertyResult("sanRequireSpn", "SanRequireSpn", (properties.SanRequireSpn != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SanRequireSpn) : undefined));
  ret.addPropertyResult("sanRequireUpn", "SanRequireUpn", (properties.SanRequireUpn != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SanRequireUpn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PrivateKeyFlagsV4Property`
 *
 * @param properties - the TypeScript properties of a `PrivateKeyFlagsV4Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplatePrivateKeyFlagsV4PropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clientVersion", cdk.requiredValidator)(properties.clientVersion));
  errors.collect(cdk.propertyValidator("clientVersion", cdk.validateString)(properties.clientVersion));
  errors.collect(cdk.propertyValidator("exportableKey", cdk.validateBoolean)(properties.exportableKey));
  errors.collect(cdk.propertyValidator("requireAlternateSignatureAlgorithm", cdk.validateBoolean)(properties.requireAlternateSignatureAlgorithm));
  errors.collect(cdk.propertyValidator("requireSameKeyRenewal", cdk.validateBoolean)(properties.requireSameKeyRenewal));
  errors.collect(cdk.propertyValidator("strongKeyProtectionRequired", cdk.validateBoolean)(properties.strongKeyProtectionRequired));
  errors.collect(cdk.propertyValidator("useLegacyProvider", cdk.validateBoolean)(properties.useLegacyProvider));
  return errors.wrap("supplied properties not correct for \"PrivateKeyFlagsV4Property\"");
}

// @ts-ignore TS6133
function convertCfnTemplatePrivateKeyFlagsV4PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplatePrivateKeyFlagsV4PropertyValidator(properties).assertSuccess();
  return {
    "ClientVersion": cdk.stringToCloudFormation(properties.clientVersion),
    "ExportableKey": cdk.booleanToCloudFormation(properties.exportableKey),
    "RequireAlternateSignatureAlgorithm": cdk.booleanToCloudFormation(properties.requireAlternateSignatureAlgorithm),
    "RequireSameKeyRenewal": cdk.booleanToCloudFormation(properties.requireSameKeyRenewal),
    "StrongKeyProtectionRequired": cdk.booleanToCloudFormation(properties.strongKeyProtectionRequired),
    "UseLegacyProvider": cdk.booleanToCloudFormation(properties.useLegacyProvider)
  };
}

// @ts-ignore TS6133
function CfnTemplatePrivateKeyFlagsV4PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTemplate.PrivateKeyFlagsV4Property> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.PrivateKeyFlagsV4Property>();
  ret.addPropertyResult("clientVersion", "ClientVersion", (properties.ClientVersion != null ? cfn_parse.FromCloudFormation.getString(properties.ClientVersion) : undefined));
  ret.addPropertyResult("exportableKey", "ExportableKey", (properties.ExportableKey != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ExportableKey) : undefined));
  ret.addPropertyResult("requireAlternateSignatureAlgorithm", "RequireAlternateSignatureAlgorithm", (properties.RequireAlternateSignatureAlgorithm != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RequireAlternateSignatureAlgorithm) : undefined));
  ret.addPropertyResult("requireSameKeyRenewal", "RequireSameKeyRenewal", (properties.RequireSameKeyRenewal != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RequireSameKeyRenewal) : undefined));
  ret.addPropertyResult("strongKeyProtectionRequired", "StrongKeyProtectionRequired", (properties.StrongKeyProtectionRequired != null ? cfn_parse.FromCloudFormation.getBoolean(properties.StrongKeyProtectionRequired) : undefined));
  ret.addPropertyResult("useLegacyProvider", "UseLegacyProvider", (properties.UseLegacyProvider != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseLegacyProvider) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `KeyUsagePropertyFlagsProperty`
 *
 * @param properties - the TypeScript properties of a `KeyUsagePropertyFlagsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplateKeyUsagePropertyFlagsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("decrypt", cdk.validateBoolean)(properties.decrypt));
  errors.collect(cdk.propertyValidator("keyAgreement", cdk.validateBoolean)(properties.keyAgreement));
  errors.collect(cdk.propertyValidator("sign", cdk.validateBoolean)(properties.sign));
  return errors.wrap("supplied properties not correct for \"KeyUsagePropertyFlagsProperty\"");
}

// @ts-ignore TS6133
function convertCfnTemplateKeyUsagePropertyFlagsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplateKeyUsagePropertyFlagsPropertyValidator(properties).assertSuccess();
  return {
    "Decrypt": cdk.booleanToCloudFormation(properties.decrypt),
    "KeyAgreement": cdk.booleanToCloudFormation(properties.keyAgreement),
    "Sign": cdk.booleanToCloudFormation(properties.sign)
  };
}

// @ts-ignore TS6133
function CfnTemplateKeyUsagePropertyFlagsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTemplate.KeyUsagePropertyFlagsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.KeyUsagePropertyFlagsProperty>();
  ret.addPropertyResult("decrypt", "Decrypt", (properties.Decrypt != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Decrypt) : undefined));
  ret.addPropertyResult("keyAgreement", "KeyAgreement", (properties.KeyAgreement != null ? cfn_parse.FromCloudFormation.getBoolean(properties.KeyAgreement) : undefined));
  ret.addPropertyResult("sign", "Sign", (properties.Sign != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Sign) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `KeyUsagePropertyProperty`
 *
 * @param properties - the TypeScript properties of a `KeyUsagePropertyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplateKeyUsagePropertyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("propertyFlags", CfnTemplateKeyUsagePropertyFlagsPropertyValidator)(properties.propertyFlags));
  errors.collect(cdk.propertyValidator("propertyType", cdk.validateString)(properties.propertyType));
  return errors.wrap("supplied properties not correct for \"KeyUsagePropertyProperty\"");
}

// @ts-ignore TS6133
function convertCfnTemplateKeyUsagePropertyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplateKeyUsagePropertyPropertyValidator(properties).assertSuccess();
  return {
    "PropertyFlags": convertCfnTemplateKeyUsagePropertyFlagsPropertyToCloudFormation(properties.propertyFlags),
    "PropertyType": cdk.stringToCloudFormation(properties.propertyType)
  };
}

// @ts-ignore TS6133
function CfnTemplateKeyUsagePropertyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTemplate.KeyUsagePropertyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.KeyUsagePropertyProperty>();
  ret.addPropertyResult("propertyFlags", "PropertyFlags", (properties.PropertyFlags != null ? CfnTemplateKeyUsagePropertyFlagsPropertyFromCloudFormation(properties.PropertyFlags) : undefined));
  ret.addPropertyResult("propertyType", "PropertyType", (properties.PropertyType != null ? cfn_parse.FromCloudFormation.getString(properties.PropertyType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PrivateKeyAttributesV4Property`
 *
 * @param properties - the TypeScript properties of a `PrivateKeyAttributesV4Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplatePrivateKeyAttributesV4PropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("algorithm", cdk.validateString)(properties.algorithm));
  errors.collect(cdk.propertyValidator("cryptoProviders", cdk.listValidator(cdk.validateString))(properties.cryptoProviders));
  errors.collect(cdk.propertyValidator("keySpec", cdk.requiredValidator)(properties.keySpec));
  errors.collect(cdk.propertyValidator("keySpec", cdk.validateString)(properties.keySpec));
  errors.collect(cdk.propertyValidator("keyUsageProperty", CfnTemplateKeyUsagePropertyPropertyValidator)(properties.keyUsageProperty));
  errors.collect(cdk.propertyValidator("minimalKeyLength", cdk.requiredValidator)(properties.minimalKeyLength));
  errors.collect(cdk.propertyValidator("minimalKeyLength", cdk.validateNumber)(properties.minimalKeyLength));
  return errors.wrap("supplied properties not correct for \"PrivateKeyAttributesV4Property\"");
}

// @ts-ignore TS6133
function convertCfnTemplatePrivateKeyAttributesV4PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplatePrivateKeyAttributesV4PropertyValidator(properties).assertSuccess();
  return {
    "Algorithm": cdk.stringToCloudFormation(properties.algorithm),
    "CryptoProviders": cdk.listMapper(cdk.stringToCloudFormation)(properties.cryptoProviders),
    "KeySpec": cdk.stringToCloudFormation(properties.keySpec),
    "KeyUsageProperty": convertCfnTemplateKeyUsagePropertyPropertyToCloudFormation(properties.keyUsageProperty),
    "MinimalKeyLength": cdk.numberToCloudFormation(properties.minimalKeyLength)
  };
}

// @ts-ignore TS6133
function CfnTemplatePrivateKeyAttributesV4PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTemplate.PrivateKeyAttributesV4Property> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.PrivateKeyAttributesV4Property>();
  ret.addPropertyResult("algorithm", "Algorithm", (properties.Algorithm != null ? cfn_parse.FromCloudFormation.getString(properties.Algorithm) : undefined));
  ret.addPropertyResult("cryptoProviders", "CryptoProviders", (properties.CryptoProviders != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.CryptoProviders) : undefined));
  ret.addPropertyResult("keySpec", "KeySpec", (properties.KeySpec != null ? cfn_parse.FromCloudFormation.getString(properties.KeySpec) : undefined));
  ret.addPropertyResult("keyUsageProperty", "KeyUsageProperty", (properties.KeyUsageProperty != null ? CfnTemplateKeyUsagePropertyPropertyFromCloudFormation(properties.KeyUsageProperty) : undefined));
  ret.addPropertyResult("minimalKeyLength", "MinimalKeyLength", (properties.MinimalKeyLength != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinimalKeyLength) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GeneralFlagsV4Property`
 *
 * @param properties - the TypeScript properties of a `GeneralFlagsV4Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplateGeneralFlagsV4PropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoEnrollment", cdk.validateBoolean)(properties.autoEnrollment));
  errors.collect(cdk.propertyValidator("machineType", cdk.validateBoolean)(properties.machineType));
  return errors.wrap("supplied properties not correct for \"GeneralFlagsV4Property\"");
}

// @ts-ignore TS6133
function convertCfnTemplateGeneralFlagsV4PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplateGeneralFlagsV4PropertyValidator(properties).assertSuccess();
  return {
    "AutoEnrollment": cdk.booleanToCloudFormation(properties.autoEnrollment),
    "MachineType": cdk.booleanToCloudFormation(properties.machineType)
  };
}

// @ts-ignore TS6133
function CfnTemplateGeneralFlagsV4PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTemplate.GeneralFlagsV4Property | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.GeneralFlagsV4Property>();
  ret.addPropertyResult("autoEnrollment", "AutoEnrollment", (properties.AutoEnrollment != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoEnrollment) : undefined));
  ret.addPropertyResult("machineType", "MachineType", (properties.MachineType != null ? cfn_parse.FromCloudFormation.getBoolean(properties.MachineType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ValidityPeriodProperty`
 *
 * @param properties - the TypeScript properties of a `ValidityPeriodProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplateValidityPeriodPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("period", cdk.requiredValidator)(properties.period));
  errors.collect(cdk.propertyValidator("period", cdk.validateNumber)(properties.period));
  errors.collect(cdk.propertyValidator("periodType", cdk.requiredValidator)(properties.periodType));
  errors.collect(cdk.propertyValidator("periodType", cdk.validateString)(properties.periodType));
  return errors.wrap("supplied properties not correct for \"ValidityPeriodProperty\"");
}

// @ts-ignore TS6133
function convertCfnTemplateValidityPeriodPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplateValidityPeriodPropertyValidator(properties).assertSuccess();
  return {
    "Period": cdk.numberToCloudFormation(properties.period),
    "PeriodType": cdk.stringToCloudFormation(properties.periodType)
  };
}

// @ts-ignore TS6133
function CfnTemplateValidityPeriodPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTemplate.ValidityPeriodProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.ValidityPeriodProperty>();
  ret.addPropertyResult("period", "Period", (properties.Period != null ? cfn_parse.FromCloudFormation.getNumber(properties.Period) : undefined));
  ret.addPropertyResult("periodType", "PeriodType", (properties.PeriodType != null ? cfn_parse.FromCloudFormation.getString(properties.PeriodType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CertificateValidityProperty`
 *
 * @param properties - the TypeScript properties of a `CertificateValidityProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplateCertificateValidityPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("renewalPeriod", cdk.requiredValidator)(properties.renewalPeriod));
  errors.collect(cdk.propertyValidator("renewalPeriod", CfnTemplateValidityPeriodPropertyValidator)(properties.renewalPeriod));
  errors.collect(cdk.propertyValidator("validityPeriod", cdk.requiredValidator)(properties.validityPeriod));
  errors.collect(cdk.propertyValidator("validityPeriod", CfnTemplateValidityPeriodPropertyValidator)(properties.validityPeriod));
  return errors.wrap("supplied properties not correct for \"CertificateValidityProperty\"");
}

// @ts-ignore TS6133
function convertCfnTemplateCertificateValidityPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplateCertificateValidityPropertyValidator(properties).assertSuccess();
  return {
    "RenewalPeriod": convertCfnTemplateValidityPeriodPropertyToCloudFormation(properties.renewalPeriod),
    "ValidityPeriod": convertCfnTemplateValidityPeriodPropertyToCloudFormation(properties.validityPeriod)
  };
}

// @ts-ignore TS6133
function CfnTemplateCertificateValidityPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTemplate.CertificateValidityProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.CertificateValidityProperty>();
  ret.addPropertyResult("renewalPeriod", "RenewalPeriod", (properties.RenewalPeriod != null ? CfnTemplateValidityPeriodPropertyFromCloudFormation(properties.RenewalPeriod) : undefined));
  ret.addPropertyResult("validityPeriod", "ValidityPeriod", (properties.ValidityPeriod != null ? CfnTemplateValidityPeriodPropertyFromCloudFormation(properties.ValidityPeriod) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ApplicationPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `ApplicationPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplateApplicationPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("policyObjectIdentifier", cdk.validateString)(properties.policyObjectIdentifier));
  errors.collect(cdk.propertyValidator("policyType", cdk.validateString)(properties.policyType));
  return errors.wrap("supplied properties not correct for \"ApplicationPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnTemplateApplicationPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplateApplicationPolicyPropertyValidator(properties).assertSuccess();
  return {
    "PolicyObjectIdentifier": cdk.stringToCloudFormation(properties.policyObjectIdentifier),
    "PolicyType": cdk.stringToCloudFormation(properties.policyType)
  };
}

// @ts-ignore TS6133
function CfnTemplateApplicationPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTemplate.ApplicationPolicyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.ApplicationPolicyProperty>();
  ret.addPropertyResult("policyObjectIdentifier", "PolicyObjectIdentifier", (properties.PolicyObjectIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyObjectIdentifier) : undefined));
  ret.addPropertyResult("policyType", "PolicyType", (properties.PolicyType != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ApplicationPoliciesProperty`
 *
 * @param properties - the TypeScript properties of a `ApplicationPoliciesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplateApplicationPoliciesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("critical", cdk.validateBoolean)(properties.critical));
  errors.collect(cdk.propertyValidator("policies", cdk.requiredValidator)(properties.policies));
  errors.collect(cdk.propertyValidator("policies", cdk.listValidator(CfnTemplateApplicationPolicyPropertyValidator))(properties.policies));
  return errors.wrap("supplied properties not correct for \"ApplicationPoliciesProperty\"");
}

// @ts-ignore TS6133
function convertCfnTemplateApplicationPoliciesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplateApplicationPoliciesPropertyValidator(properties).assertSuccess();
  return {
    "Critical": cdk.booleanToCloudFormation(properties.critical),
    "Policies": cdk.listMapper(convertCfnTemplateApplicationPolicyPropertyToCloudFormation)(properties.policies)
  };
}

// @ts-ignore TS6133
function CfnTemplateApplicationPoliciesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTemplate.ApplicationPoliciesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.ApplicationPoliciesProperty>();
  ret.addPropertyResult("critical", "Critical", (properties.Critical != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Critical) : undefined));
  ret.addPropertyResult("policies", "Policies", (properties.Policies != null ? cfn_parse.FromCloudFormation.getArray(CfnTemplateApplicationPolicyPropertyFromCloudFormation)(properties.Policies) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `KeyUsageFlagsProperty`
 *
 * @param properties - the TypeScript properties of a `KeyUsageFlagsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplateKeyUsageFlagsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataEncipherment", cdk.validateBoolean)(properties.dataEncipherment));
  errors.collect(cdk.propertyValidator("digitalSignature", cdk.validateBoolean)(properties.digitalSignature));
  errors.collect(cdk.propertyValidator("keyAgreement", cdk.validateBoolean)(properties.keyAgreement));
  errors.collect(cdk.propertyValidator("keyEncipherment", cdk.validateBoolean)(properties.keyEncipherment));
  errors.collect(cdk.propertyValidator("nonRepudiation", cdk.validateBoolean)(properties.nonRepudiation));
  return errors.wrap("supplied properties not correct for \"KeyUsageFlagsProperty\"");
}

// @ts-ignore TS6133
function convertCfnTemplateKeyUsageFlagsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplateKeyUsageFlagsPropertyValidator(properties).assertSuccess();
  return {
    "DataEncipherment": cdk.booleanToCloudFormation(properties.dataEncipherment),
    "DigitalSignature": cdk.booleanToCloudFormation(properties.digitalSignature),
    "KeyAgreement": cdk.booleanToCloudFormation(properties.keyAgreement),
    "KeyEncipherment": cdk.booleanToCloudFormation(properties.keyEncipherment),
    "NonRepudiation": cdk.booleanToCloudFormation(properties.nonRepudiation)
  };
}

// @ts-ignore TS6133
function CfnTemplateKeyUsageFlagsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTemplate.KeyUsageFlagsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.KeyUsageFlagsProperty>();
  ret.addPropertyResult("dataEncipherment", "DataEncipherment", (properties.DataEncipherment != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DataEncipherment) : undefined));
  ret.addPropertyResult("digitalSignature", "DigitalSignature", (properties.DigitalSignature != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DigitalSignature) : undefined));
  ret.addPropertyResult("keyAgreement", "KeyAgreement", (properties.KeyAgreement != null ? cfn_parse.FromCloudFormation.getBoolean(properties.KeyAgreement) : undefined));
  ret.addPropertyResult("keyEncipherment", "KeyEncipherment", (properties.KeyEncipherment != null ? cfn_parse.FromCloudFormation.getBoolean(properties.KeyEncipherment) : undefined));
  ret.addPropertyResult("nonRepudiation", "NonRepudiation", (properties.NonRepudiation != null ? cfn_parse.FromCloudFormation.getBoolean(properties.NonRepudiation) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `KeyUsageProperty`
 *
 * @param properties - the TypeScript properties of a `KeyUsageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplateKeyUsagePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("critical", cdk.validateBoolean)(properties.critical));
  errors.collect(cdk.propertyValidator("usageFlags", cdk.requiredValidator)(properties.usageFlags));
  errors.collect(cdk.propertyValidator("usageFlags", CfnTemplateKeyUsageFlagsPropertyValidator)(properties.usageFlags));
  return errors.wrap("supplied properties not correct for \"KeyUsageProperty\"");
}

// @ts-ignore TS6133
function convertCfnTemplateKeyUsagePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplateKeyUsagePropertyValidator(properties).assertSuccess();
  return {
    "Critical": cdk.booleanToCloudFormation(properties.critical),
    "UsageFlags": convertCfnTemplateKeyUsageFlagsPropertyToCloudFormation(properties.usageFlags)
  };
}

// @ts-ignore TS6133
function CfnTemplateKeyUsagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTemplate.KeyUsageProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.KeyUsageProperty>();
  ret.addPropertyResult("critical", "Critical", (properties.Critical != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Critical) : undefined));
  ret.addPropertyResult("usageFlags", "UsageFlags", (properties.UsageFlags != null ? CfnTemplateKeyUsageFlagsPropertyFromCloudFormation(properties.UsageFlags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ExtensionsV4Property`
 *
 * @param properties - the TypeScript properties of a `ExtensionsV4Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplateExtensionsV4PropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationPolicies", CfnTemplateApplicationPoliciesPropertyValidator)(properties.applicationPolicies));
  errors.collect(cdk.propertyValidator("keyUsage", cdk.requiredValidator)(properties.keyUsage));
  errors.collect(cdk.propertyValidator("keyUsage", CfnTemplateKeyUsagePropertyValidator)(properties.keyUsage));
  return errors.wrap("supplied properties not correct for \"ExtensionsV4Property\"");
}

// @ts-ignore TS6133
function convertCfnTemplateExtensionsV4PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplateExtensionsV4PropertyValidator(properties).assertSuccess();
  return {
    "ApplicationPolicies": convertCfnTemplateApplicationPoliciesPropertyToCloudFormation(properties.applicationPolicies),
    "KeyUsage": convertCfnTemplateKeyUsagePropertyToCloudFormation(properties.keyUsage)
  };
}

// @ts-ignore TS6133
function CfnTemplateExtensionsV4PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTemplate.ExtensionsV4Property | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.ExtensionsV4Property>();
  ret.addPropertyResult("applicationPolicies", "ApplicationPolicies", (properties.ApplicationPolicies != null ? CfnTemplateApplicationPoliciesPropertyFromCloudFormation(properties.ApplicationPolicies) : undefined));
  ret.addPropertyResult("keyUsage", "KeyUsage", (properties.KeyUsage != null ? CfnTemplateKeyUsagePropertyFromCloudFormation(properties.KeyUsage) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EnrollmentFlagsV4Property`
 *
 * @param properties - the TypeScript properties of a `EnrollmentFlagsV4Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplateEnrollmentFlagsV4PropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enableKeyReuseOnNtTokenKeysetStorageFull", cdk.validateBoolean)(properties.enableKeyReuseOnNtTokenKeysetStorageFull));
  errors.collect(cdk.propertyValidator("includeSymmetricAlgorithms", cdk.validateBoolean)(properties.includeSymmetricAlgorithms));
  errors.collect(cdk.propertyValidator("noSecurityExtension", cdk.validateBoolean)(properties.noSecurityExtension));
  errors.collect(cdk.propertyValidator("removeInvalidCertificateFromPersonalStore", cdk.validateBoolean)(properties.removeInvalidCertificateFromPersonalStore));
  errors.collect(cdk.propertyValidator("userInteractionRequired", cdk.validateBoolean)(properties.userInteractionRequired));
  return errors.wrap("supplied properties not correct for \"EnrollmentFlagsV4Property\"");
}

// @ts-ignore TS6133
function convertCfnTemplateEnrollmentFlagsV4PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplateEnrollmentFlagsV4PropertyValidator(properties).assertSuccess();
  return {
    "EnableKeyReuseOnNtTokenKeysetStorageFull": cdk.booleanToCloudFormation(properties.enableKeyReuseOnNtTokenKeysetStorageFull),
    "IncludeSymmetricAlgorithms": cdk.booleanToCloudFormation(properties.includeSymmetricAlgorithms),
    "NoSecurityExtension": cdk.booleanToCloudFormation(properties.noSecurityExtension),
    "RemoveInvalidCertificateFromPersonalStore": cdk.booleanToCloudFormation(properties.removeInvalidCertificateFromPersonalStore),
    "UserInteractionRequired": cdk.booleanToCloudFormation(properties.userInteractionRequired)
  };
}

// @ts-ignore TS6133
function CfnTemplateEnrollmentFlagsV4PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTemplate.EnrollmentFlagsV4Property | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.EnrollmentFlagsV4Property>();
  ret.addPropertyResult("enableKeyReuseOnNtTokenKeysetStorageFull", "EnableKeyReuseOnNtTokenKeysetStorageFull", (properties.EnableKeyReuseOnNtTokenKeysetStorageFull != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableKeyReuseOnNtTokenKeysetStorageFull) : undefined));
  ret.addPropertyResult("includeSymmetricAlgorithms", "IncludeSymmetricAlgorithms", (properties.IncludeSymmetricAlgorithms != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeSymmetricAlgorithms) : undefined));
  ret.addPropertyResult("noSecurityExtension", "NoSecurityExtension", (properties.NoSecurityExtension != null ? cfn_parse.FromCloudFormation.getBoolean(properties.NoSecurityExtension) : undefined));
  ret.addPropertyResult("removeInvalidCertificateFromPersonalStore", "RemoveInvalidCertificateFromPersonalStore", (properties.RemoveInvalidCertificateFromPersonalStore != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RemoveInvalidCertificateFromPersonalStore) : undefined));
  ret.addPropertyResult("userInteractionRequired", "UserInteractionRequired", (properties.UserInteractionRequired != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UserInteractionRequired) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TemplateV4Property`
 *
 * @param properties - the TypeScript properties of a `TemplateV4Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplateTemplateV4PropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificateValidity", cdk.requiredValidator)(properties.certificateValidity));
  errors.collect(cdk.propertyValidator("certificateValidity", CfnTemplateCertificateValidityPropertyValidator)(properties.certificateValidity));
  errors.collect(cdk.propertyValidator("enrollmentFlags", cdk.requiredValidator)(properties.enrollmentFlags));
  errors.collect(cdk.propertyValidator("enrollmentFlags", CfnTemplateEnrollmentFlagsV4PropertyValidator)(properties.enrollmentFlags));
  errors.collect(cdk.propertyValidator("extensions", cdk.requiredValidator)(properties.extensions));
  errors.collect(cdk.propertyValidator("extensions", CfnTemplateExtensionsV4PropertyValidator)(properties.extensions));
  errors.collect(cdk.propertyValidator("generalFlags", cdk.requiredValidator)(properties.generalFlags));
  errors.collect(cdk.propertyValidator("generalFlags", CfnTemplateGeneralFlagsV4PropertyValidator)(properties.generalFlags));
  errors.collect(cdk.propertyValidator("hashAlgorithm", cdk.validateString)(properties.hashAlgorithm));
  errors.collect(cdk.propertyValidator("privateKeyAttributes", cdk.requiredValidator)(properties.privateKeyAttributes));
  errors.collect(cdk.propertyValidator("privateKeyAttributes", CfnTemplatePrivateKeyAttributesV4PropertyValidator)(properties.privateKeyAttributes));
  errors.collect(cdk.propertyValidator("privateKeyFlags", cdk.requiredValidator)(properties.privateKeyFlags));
  errors.collect(cdk.propertyValidator("privateKeyFlags", CfnTemplatePrivateKeyFlagsV4PropertyValidator)(properties.privateKeyFlags));
  errors.collect(cdk.propertyValidator("subjectNameFlags", cdk.requiredValidator)(properties.subjectNameFlags));
  errors.collect(cdk.propertyValidator("subjectNameFlags", CfnTemplateSubjectNameFlagsV4PropertyValidator)(properties.subjectNameFlags));
  errors.collect(cdk.propertyValidator("supersededTemplates", cdk.listValidator(cdk.validateString))(properties.supersededTemplates));
  return errors.wrap("supplied properties not correct for \"TemplateV4Property\"");
}

// @ts-ignore TS6133
function convertCfnTemplateTemplateV4PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplateTemplateV4PropertyValidator(properties).assertSuccess();
  return {
    "CertificateValidity": convertCfnTemplateCertificateValidityPropertyToCloudFormation(properties.certificateValidity),
    "EnrollmentFlags": convertCfnTemplateEnrollmentFlagsV4PropertyToCloudFormation(properties.enrollmentFlags),
    "Extensions": convertCfnTemplateExtensionsV4PropertyToCloudFormation(properties.extensions),
    "GeneralFlags": convertCfnTemplateGeneralFlagsV4PropertyToCloudFormation(properties.generalFlags),
    "HashAlgorithm": cdk.stringToCloudFormation(properties.hashAlgorithm),
    "PrivateKeyAttributes": convertCfnTemplatePrivateKeyAttributesV4PropertyToCloudFormation(properties.privateKeyAttributes),
    "PrivateKeyFlags": convertCfnTemplatePrivateKeyFlagsV4PropertyToCloudFormation(properties.privateKeyFlags),
    "SubjectNameFlags": convertCfnTemplateSubjectNameFlagsV4PropertyToCloudFormation(properties.subjectNameFlags),
    "SupersededTemplates": cdk.listMapper(cdk.stringToCloudFormation)(properties.supersededTemplates)
  };
}

// @ts-ignore TS6133
function CfnTemplateTemplateV4PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTemplate.TemplateV4Property> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.TemplateV4Property>();
  ret.addPropertyResult("certificateValidity", "CertificateValidity", (properties.CertificateValidity != null ? CfnTemplateCertificateValidityPropertyFromCloudFormation(properties.CertificateValidity) : undefined));
  ret.addPropertyResult("enrollmentFlags", "EnrollmentFlags", (properties.EnrollmentFlags != null ? CfnTemplateEnrollmentFlagsV4PropertyFromCloudFormation(properties.EnrollmentFlags) : undefined));
  ret.addPropertyResult("extensions", "Extensions", (properties.Extensions != null ? CfnTemplateExtensionsV4PropertyFromCloudFormation(properties.Extensions) : undefined));
  ret.addPropertyResult("generalFlags", "GeneralFlags", (properties.GeneralFlags != null ? CfnTemplateGeneralFlagsV4PropertyFromCloudFormation(properties.GeneralFlags) : undefined));
  ret.addPropertyResult("hashAlgorithm", "HashAlgorithm", (properties.HashAlgorithm != null ? cfn_parse.FromCloudFormation.getString(properties.HashAlgorithm) : undefined));
  ret.addPropertyResult("privateKeyAttributes", "PrivateKeyAttributes", (properties.PrivateKeyAttributes != null ? CfnTemplatePrivateKeyAttributesV4PropertyFromCloudFormation(properties.PrivateKeyAttributes) : undefined));
  ret.addPropertyResult("privateKeyFlags", "PrivateKeyFlags", (properties.PrivateKeyFlags != null ? CfnTemplatePrivateKeyFlagsV4PropertyFromCloudFormation(properties.PrivateKeyFlags) : undefined));
  ret.addPropertyResult("subjectNameFlags", "SubjectNameFlags", (properties.SubjectNameFlags != null ? CfnTemplateSubjectNameFlagsV4PropertyFromCloudFormation(properties.SubjectNameFlags) : undefined));
  ret.addPropertyResult("supersededTemplates", "SupersededTemplates", (properties.SupersededTemplates != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SupersededTemplates) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SubjectNameFlagsV3Property`
 *
 * @param properties - the TypeScript properties of a `SubjectNameFlagsV3Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplateSubjectNameFlagsV3PropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("requireCommonName", cdk.validateBoolean)(properties.requireCommonName));
  errors.collect(cdk.propertyValidator("requireDirectoryPath", cdk.validateBoolean)(properties.requireDirectoryPath));
  errors.collect(cdk.propertyValidator("requireDnsAsCn", cdk.validateBoolean)(properties.requireDnsAsCn));
  errors.collect(cdk.propertyValidator("requireEmail", cdk.validateBoolean)(properties.requireEmail));
  errors.collect(cdk.propertyValidator("sanRequireDirectoryGuid", cdk.validateBoolean)(properties.sanRequireDirectoryGuid));
  errors.collect(cdk.propertyValidator("sanRequireDns", cdk.validateBoolean)(properties.sanRequireDns));
  errors.collect(cdk.propertyValidator("sanRequireDomainDns", cdk.validateBoolean)(properties.sanRequireDomainDns));
  errors.collect(cdk.propertyValidator("sanRequireEmail", cdk.validateBoolean)(properties.sanRequireEmail));
  errors.collect(cdk.propertyValidator("sanRequireSpn", cdk.validateBoolean)(properties.sanRequireSpn));
  errors.collect(cdk.propertyValidator("sanRequireUpn", cdk.validateBoolean)(properties.sanRequireUpn));
  return errors.wrap("supplied properties not correct for \"SubjectNameFlagsV3Property\"");
}

// @ts-ignore TS6133
function convertCfnTemplateSubjectNameFlagsV3PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplateSubjectNameFlagsV3PropertyValidator(properties).assertSuccess();
  return {
    "RequireCommonName": cdk.booleanToCloudFormation(properties.requireCommonName),
    "RequireDirectoryPath": cdk.booleanToCloudFormation(properties.requireDirectoryPath),
    "RequireDnsAsCn": cdk.booleanToCloudFormation(properties.requireDnsAsCn),
    "RequireEmail": cdk.booleanToCloudFormation(properties.requireEmail),
    "SanRequireDirectoryGuid": cdk.booleanToCloudFormation(properties.sanRequireDirectoryGuid),
    "SanRequireDns": cdk.booleanToCloudFormation(properties.sanRequireDns),
    "SanRequireDomainDns": cdk.booleanToCloudFormation(properties.sanRequireDomainDns),
    "SanRequireEmail": cdk.booleanToCloudFormation(properties.sanRequireEmail),
    "SanRequireSpn": cdk.booleanToCloudFormation(properties.sanRequireSpn),
    "SanRequireUpn": cdk.booleanToCloudFormation(properties.sanRequireUpn)
  };
}

// @ts-ignore TS6133
function CfnTemplateSubjectNameFlagsV3PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTemplate.SubjectNameFlagsV3Property> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.SubjectNameFlagsV3Property>();
  ret.addPropertyResult("requireCommonName", "RequireCommonName", (properties.RequireCommonName != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RequireCommonName) : undefined));
  ret.addPropertyResult("requireDirectoryPath", "RequireDirectoryPath", (properties.RequireDirectoryPath != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RequireDirectoryPath) : undefined));
  ret.addPropertyResult("requireDnsAsCn", "RequireDnsAsCn", (properties.RequireDnsAsCn != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RequireDnsAsCn) : undefined));
  ret.addPropertyResult("requireEmail", "RequireEmail", (properties.RequireEmail != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RequireEmail) : undefined));
  ret.addPropertyResult("sanRequireDirectoryGuid", "SanRequireDirectoryGuid", (properties.SanRequireDirectoryGuid != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SanRequireDirectoryGuid) : undefined));
  ret.addPropertyResult("sanRequireDns", "SanRequireDns", (properties.SanRequireDns != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SanRequireDns) : undefined));
  ret.addPropertyResult("sanRequireDomainDns", "SanRequireDomainDns", (properties.SanRequireDomainDns != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SanRequireDomainDns) : undefined));
  ret.addPropertyResult("sanRequireEmail", "SanRequireEmail", (properties.SanRequireEmail != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SanRequireEmail) : undefined));
  ret.addPropertyResult("sanRequireSpn", "SanRequireSpn", (properties.SanRequireSpn != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SanRequireSpn) : undefined));
  ret.addPropertyResult("sanRequireUpn", "SanRequireUpn", (properties.SanRequireUpn != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SanRequireUpn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PrivateKeyFlagsV3Property`
 *
 * @param properties - the TypeScript properties of a `PrivateKeyFlagsV3Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplatePrivateKeyFlagsV3PropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clientVersion", cdk.requiredValidator)(properties.clientVersion));
  errors.collect(cdk.propertyValidator("clientVersion", cdk.validateString)(properties.clientVersion));
  errors.collect(cdk.propertyValidator("exportableKey", cdk.validateBoolean)(properties.exportableKey));
  errors.collect(cdk.propertyValidator("requireAlternateSignatureAlgorithm", cdk.validateBoolean)(properties.requireAlternateSignatureAlgorithm));
  errors.collect(cdk.propertyValidator("strongKeyProtectionRequired", cdk.validateBoolean)(properties.strongKeyProtectionRequired));
  return errors.wrap("supplied properties not correct for \"PrivateKeyFlagsV3Property\"");
}

// @ts-ignore TS6133
function convertCfnTemplatePrivateKeyFlagsV3PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplatePrivateKeyFlagsV3PropertyValidator(properties).assertSuccess();
  return {
    "ClientVersion": cdk.stringToCloudFormation(properties.clientVersion),
    "ExportableKey": cdk.booleanToCloudFormation(properties.exportableKey),
    "RequireAlternateSignatureAlgorithm": cdk.booleanToCloudFormation(properties.requireAlternateSignatureAlgorithm),
    "StrongKeyProtectionRequired": cdk.booleanToCloudFormation(properties.strongKeyProtectionRequired)
  };
}

// @ts-ignore TS6133
function CfnTemplatePrivateKeyFlagsV3PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTemplate.PrivateKeyFlagsV3Property> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.PrivateKeyFlagsV3Property>();
  ret.addPropertyResult("clientVersion", "ClientVersion", (properties.ClientVersion != null ? cfn_parse.FromCloudFormation.getString(properties.ClientVersion) : undefined));
  ret.addPropertyResult("exportableKey", "ExportableKey", (properties.ExportableKey != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ExportableKey) : undefined));
  ret.addPropertyResult("requireAlternateSignatureAlgorithm", "RequireAlternateSignatureAlgorithm", (properties.RequireAlternateSignatureAlgorithm != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RequireAlternateSignatureAlgorithm) : undefined));
  ret.addPropertyResult("strongKeyProtectionRequired", "StrongKeyProtectionRequired", (properties.StrongKeyProtectionRequired != null ? cfn_parse.FromCloudFormation.getBoolean(properties.StrongKeyProtectionRequired) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PrivateKeyAttributesV3Property`
 *
 * @param properties - the TypeScript properties of a `PrivateKeyAttributesV3Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplatePrivateKeyAttributesV3PropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("algorithm", cdk.requiredValidator)(properties.algorithm));
  errors.collect(cdk.propertyValidator("algorithm", cdk.validateString)(properties.algorithm));
  errors.collect(cdk.propertyValidator("cryptoProviders", cdk.listValidator(cdk.validateString))(properties.cryptoProviders));
  errors.collect(cdk.propertyValidator("keySpec", cdk.requiredValidator)(properties.keySpec));
  errors.collect(cdk.propertyValidator("keySpec", cdk.validateString)(properties.keySpec));
  errors.collect(cdk.propertyValidator("keyUsageProperty", cdk.requiredValidator)(properties.keyUsageProperty));
  errors.collect(cdk.propertyValidator("keyUsageProperty", CfnTemplateKeyUsagePropertyPropertyValidator)(properties.keyUsageProperty));
  errors.collect(cdk.propertyValidator("minimalKeyLength", cdk.requiredValidator)(properties.minimalKeyLength));
  errors.collect(cdk.propertyValidator("minimalKeyLength", cdk.validateNumber)(properties.minimalKeyLength));
  return errors.wrap("supplied properties not correct for \"PrivateKeyAttributesV3Property\"");
}

// @ts-ignore TS6133
function convertCfnTemplatePrivateKeyAttributesV3PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplatePrivateKeyAttributesV3PropertyValidator(properties).assertSuccess();
  return {
    "Algorithm": cdk.stringToCloudFormation(properties.algorithm),
    "CryptoProviders": cdk.listMapper(cdk.stringToCloudFormation)(properties.cryptoProviders),
    "KeySpec": cdk.stringToCloudFormation(properties.keySpec),
    "KeyUsageProperty": convertCfnTemplateKeyUsagePropertyPropertyToCloudFormation(properties.keyUsageProperty),
    "MinimalKeyLength": cdk.numberToCloudFormation(properties.minimalKeyLength)
  };
}

// @ts-ignore TS6133
function CfnTemplatePrivateKeyAttributesV3PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTemplate.PrivateKeyAttributesV3Property> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.PrivateKeyAttributesV3Property>();
  ret.addPropertyResult("algorithm", "Algorithm", (properties.Algorithm != null ? cfn_parse.FromCloudFormation.getString(properties.Algorithm) : undefined));
  ret.addPropertyResult("cryptoProviders", "CryptoProviders", (properties.CryptoProviders != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.CryptoProviders) : undefined));
  ret.addPropertyResult("keySpec", "KeySpec", (properties.KeySpec != null ? cfn_parse.FromCloudFormation.getString(properties.KeySpec) : undefined));
  ret.addPropertyResult("keyUsageProperty", "KeyUsageProperty", (properties.KeyUsageProperty != null ? CfnTemplateKeyUsagePropertyPropertyFromCloudFormation(properties.KeyUsageProperty) : undefined));
  ret.addPropertyResult("minimalKeyLength", "MinimalKeyLength", (properties.MinimalKeyLength != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinimalKeyLength) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GeneralFlagsV3Property`
 *
 * @param properties - the TypeScript properties of a `GeneralFlagsV3Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplateGeneralFlagsV3PropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoEnrollment", cdk.validateBoolean)(properties.autoEnrollment));
  errors.collect(cdk.propertyValidator("machineType", cdk.validateBoolean)(properties.machineType));
  return errors.wrap("supplied properties not correct for \"GeneralFlagsV3Property\"");
}

// @ts-ignore TS6133
function convertCfnTemplateGeneralFlagsV3PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplateGeneralFlagsV3PropertyValidator(properties).assertSuccess();
  return {
    "AutoEnrollment": cdk.booleanToCloudFormation(properties.autoEnrollment),
    "MachineType": cdk.booleanToCloudFormation(properties.machineType)
  };
}

// @ts-ignore TS6133
function CfnTemplateGeneralFlagsV3PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTemplate.GeneralFlagsV3Property | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.GeneralFlagsV3Property>();
  ret.addPropertyResult("autoEnrollment", "AutoEnrollment", (properties.AutoEnrollment != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoEnrollment) : undefined));
  ret.addPropertyResult("machineType", "MachineType", (properties.MachineType != null ? cfn_parse.FromCloudFormation.getBoolean(properties.MachineType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ExtensionsV3Property`
 *
 * @param properties - the TypeScript properties of a `ExtensionsV3Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplateExtensionsV3PropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationPolicies", CfnTemplateApplicationPoliciesPropertyValidator)(properties.applicationPolicies));
  errors.collect(cdk.propertyValidator("keyUsage", cdk.requiredValidator)(properties.keyUsage));
  errors.collect(cdk.propertyValidator("keyUsage", CfnTemplateKeyUsagePropertyValidator)(properties.keyUsage));
  return errors.wrap("supplied properties not correct for \"ExtensionsV3Property\"");
}

// @ts-ignore TS6133
function convertCfnTemplateExtensionsV3PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplateExtensionsV3PropertyValidator(properties).assertSuccess();
  return {
    "ApplicationPolicies": convertCfnTemplateApplicationPoliciesPropertyToCloudFormation(properties.applicationPolicies),
    "KeyUsage": convertCfnTemplateKeyUsagePropertyToCloudFormation(properties.keyUsage)
  };
}

// @ts-ignore TS6133
function CfnTemplateExtensionsV3PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTemplate.ExtensionsV3Property | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.ExtensionsV3Property>();
  ret.addPropertyResult("applicationPolicies", "ApplicationPolicies", (properties.ApplicationPolicies != null ? CfnTemplateApplicationPoliciesPropertyFromCloudFormation(properties.ApplicationPolicies) : undefined));
  ret.addPropertyResult("keyUsage", "KeyUsage", (properties.KeyUsage != null ? CfnTemplateKeyUsagePropertyFromCloudFormation(properties.KeyUsage) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EnrollmentFlagsV3Property`
 *
 * @param properties - the TypeScript properties of a `EnrollmentFlagsV3Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplateEnrollmentFlagsV3PropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enableKeyReuseOnNtTokenKeysetStorageFull", cdk.validateBoolean)(properties.enableKeyReuseOnNtTokenKeysetStorageFull));
  errors.collect(cdk.propertyValidator("includeSymmetricAlgorithms", cdk.validateBoolean)(properties.includeSymmetricAlgorithms));
  errors.collect(cdk.propertyValidator("noSecurityExtension", cdk.validateBoolean)(properties.noSecurityExtension));
  errors.collect(cdk.propertyValidator("removeInvalidCertificateFromPersonalStore", cdk.validateBoolean)(properties.removeInvalidCertificateFromPersonalStore));
  errors.collect(cdk.propertyValidator("userInteractionRequired", cdk.validateBoolean)(properties.userInteractionRequired));
  return errors.wrap("supplied properties not correct for \"EnrollmentFlagsV3Property\"");
}

// @ts-ignore TS6133
function convertCfnTemplateEnrollmentFlagsV3PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplateEnrollmentFlagsV3PropertyValidator(properties).assertSuccess();
  return {
    "EnableKeyReuseOnNtTokenKeysetStorageFull": cdk.booleanToCloudFormation(properties.enableKeyReuseOnNtTokenKeysetStorageFull),
    "IncludeSymmetricAlgorithms": cdk.booleanToCloudFormation(properties.includeSymmetricAlgorithms),
    "NoSecurityExtension": cdk.booleanToCloudFormation(properties.noSecurityExtension),
    "RemoveInvalidCertificateFromPersonalStore": cdk.booleanToCloudFormation(properties.removeInvalidCertificateFromPersonalStore),
    "UserInteractionRequired": cdk.booleanToCloudFormation(properties.userInteractionRequired)
  };
}

// @ts-ignore TS6133
function CfnTemplateEnrollmentFlagsV3PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTemplate.EnrollmentFlagsV3Property | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.EnrollmentFlagsV3Property>();
  ret.addPropertyResult("enableKeyReuseOnNtTokenKeysetStorageFull", "EnableKeyReuseOnNtTokenKeysetStorageFull", (properties.EnableKeyReuseOnNtTokenKeysetStorageFull != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableKeyReuseOnNtTokenKeysetStorageFull) : undefined));
  ret.addPropertyResult("includeSymmetricAlgorithms", "IncludeSymmetricAlgorithms", (properties.IncludeSymmetricAlgorithms != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeSymmetricAlgorithms) : undefined));
  ret.addPropertyResult("noSecurityExtension", "NoSecurityExtension", (properties.NoSecurityExtension != null ? cfn_parse.FromCloudFormation.getBoolean(properties.NoSecurityExtension) : undefined));
  ret.addPropertyResult("removeInvalidCertificateFromPersonalStore", "RemoveInvalidCertificateFromPersonalStore", (properties.RemoveInvalidCertificateFromPersonalStore != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RemoveInvalidCertificateFromPersonalStore) : undefined));
  ret.addPropertyResult("userInteractionRequired", "UserInteractionRequired", (properties.UserInteractionRequired != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UserInteractionRequired) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TemplateV3Property`
 *
 * @param properties - the TypeScript properties of a `TemplateV3Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplateTemplateV3PropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificateValidity", cdk.requiredValidator)(properties.certificateValidity));
  errors.collect(cdk.propertyValidator("certificateValidity", CfnTemplateCertificateValidityPropertyValidator)(properties.certificateValidity));
  errors.collect(cdk.propertyValidator("enrollmentFlags", cdk.requiredValidator)(properties.enrollmentFlags));
  errors.collect(cdk.propertyValidator("enrollmentFlags", CfnTemplateEnrollmentFlagsV3PropertyValidator)(properties.enrollmentFlags));
  errors.collect(cdk.propertyValidator("extensions", cdk.requiredValidator)(properties.extensions));
  errors.collect(cdk.propertyValidator("extensions", CfnTemplateExtensionsV3PropertyValidator)(properties.extensions));
  errors.collect(cdk.propertyValidator("generalFlags", cdk.requiredValidator)(properties.generalFlags));
  errors.collect(cdk.propertyValidator("generalFlags", CfnTemplateGeneralFlagsV3PropertyValidator)(properties.generalFlags));
  errors.collect(cdk.propertyValidator("hashAlgorithm", cdk.requiredValidator)(properties.hashAlgorithm));
  errors.collect(cdk.propertyValidator("hashAlgorithm", cdk.validateString)(properties.hashAlgorithm));
  errors.collect(cdk.propertyValidator("privateKeyAttributes", cdk.requiredValidator)(properties.privateKeyAttributes));
  errors.collect(cdk.propertyValidator("privateKeyAttributes", CfnTemplatePrivateKeyAttributesV3PropertyValidator)(properties.privateKeyAttributes));
  errors.collect(cdk.propertyValidator("privateKeyFlags", cdk.requiredValidator)(properties.privateKeyFlags));
  errors.collect(cdk.propertyValidator("privateKeyFlags", CfnTemplatePrivateKeyFlagsV3PropertyValidator)(properties.privateKeyFlags));
  errors.collect(cdk.propertyValidator("subjectNameFlags", cdk.requiredValidator)(properties.subjectNameFlags));
  errors.collect(cdk.propertyValidator("subjectNameFlags", CfnTemplateSubjectNameFlagsV3PropertyValidator)(properties.subjectNameFlags));
  errors.collect(cdk.propertyValidator("supersededTemplates", cdk.listValidator(cdk.validateString))(properties.supersededTemplates));
  return errors.wrap("supplied properties not correct for \"TemplateV3Property\"");
}

// @ts-ignore TS6133
function convertCfnTemplateTemplateV3PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplateTemplateV3PropertyValidator(properties).assertSuccess();
  return {
    "CertificateValidity": convertCfnTemplateCertificateValidityPropertyToCloudFormation(properties.certificateValidity),
    "EnrollmentFlags": convertCfnTemplateEnrollmentFlagsV3PropertyToCloudFormation(properties.enrollmentFlags),
    "Extensions": convertCfnTemplateExtensionsV3PropertyToCloudFormation(properties.extensions),
    "GeneralFlags": convertCfnTemplateGeneralFlagsV3PropertyToCloudFormation(properties.generalFlags),
    "HashAlgorithm": cdk.stringToCloudFormation(properties.hashAlgorithm),
    "PrivateKeyAttributes": convertCfnTemplatePrivateKeyAttributesV3PropertyToCloudFormation(properties.privateKeyAttributes),
    "PrivateKeyFlags": convertCfnTemplatePrivateKeyFlagsV3PropertyToCloudFormation(properties.privateKeyFlags),
    "SubjectNameFlags": convertCfnTemplateSubjectNameFlagsV3PropertyToCloudFormation(properties.subjectNameFlags),
    "SupersededTemplates": cdk.listMapper(cdk.stringToCloudFormation)(properties.supersededTemplates)
  };
}

// @ts-ignore TS6133
function CfnTemplateTemplateV3PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTemplate.TemplateV3Property> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.TemplateV3Property>();
  ret.addPropertyResult("certificateValidity", "CertificateValidity", (properties.CertificateValidity != null ? CfnTemplateCertificateValidityPropertyFromCloudFormation(properties.CertificateValidity) : undefined));
  ret.addPropertyResult("enrollmentFlags", "EnrollmentFlags", (properties.EnrollmentFlags != null ? CfnTemplateEnrollmentFlagsV3PropertyFromCloudFormation(properties.EnrollmentFlags) : undefined));
  ret.addPropertyResult("extensions", "Extensions", (properties.Extensions != null ? CfnTemplateExtensionsV3PropertyFromCloudFormation(properties.Extensions) : undefined));
  ret.addPropertyResult("generalFlags", "GeneralFlags", (properties.GeneralFlags != null ? CfnTemplateGeneralFlagsV3PropertyFromCloudFormation(properties.GeneralFlags) : undefined));
  ret.addPropertyResult("hashAlgorithm", "HashAlgorithm", (properties.HashAlgorithm != null ? cfn_parse.FromCloudFormation.getString(properties.HashAlgorithm) : undefined));
  ret.addPropertyResult("privateKeyAttributes", "PrivateKeyAttributes", (properties.PrivateKeyAttributes != null ? CfnTemplatePrivateKeyAttributesV3PropertyFromCloudFormation(properties.PrivateKeyAttributes) : undefined));
  ret.addPropertyResult("privateKeyFlags", "PrivateKeyFlags", (properties.PrivateKeyFlags != null ? CfnTemplatePrivateKeyFlagsV3PropertyFromCloudFormation(properties.PrivateKeyFlags) : undefined));
  ret.addPropertyResult("subjectNameFlags", "SubjectNameFlags", (properties.SubjectNameFlags != null ? CfnTemplateSubjectNameFlagsV3PropertyFromCloudFormation(properties.SubjectNameFlags) : undefined));
  ret.addPropertyResult("supersededTemplates", "SupersededTemplates", (properties.SupersededTemplates != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SupersededTemplates) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SubjectNameFlagsV2Property`
 *
 * @param properties - the TypeScript properties of a `SubjectNameFlagsV2Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplateSubjectNameFlagsV2PropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("requireCommonName", cdk.validateBoolean)(properties.requireCommonName));
  errors.collect(cdk.propertyValidator("requireDirectoryPath", cdk.validateBoolean)(properties.requireDirectoryPath));
  errors.collect(cdk.propertyValidator("requireDnsAsCn", cdk.validateBoolean)(properties.requireDnsAsCn));
  errors.collect(cdk.propertyValidator("requireEmail", cdk.validateBoolean)(properties.requireEmail));
  errors.collect(cdk.propertyValidator("sanRequireDirectoryGuid", cdk.validateBoolean)(properties.sanRequireDirectoryGuid));
  errors.collect(cdk.propertyValidator("sanRequireDns", cdk.validateBoolean)(properties.sanRequireDns));
  errors.collect(cdk.propertyValidator("sanRequireDomainDns", cdk.validateBoolean)(properties.sanRequireDomainDns));
  errors.collect(cdk.propertyValidator("sanRequireEmail", cdk.validateBoolean)(properties.sanRequireEmail));
  errors.collect(cdk.propertyValidator("sanRequireSpn", cdk.validateBoolean)(properties.sanRequireSpn));
  errors.collect(cdk.propertyValidator("sanRequireUpn", cdk.validateBoolean)(properties.sanRequireUpn));
  return errors.wrap("supplied properties not correct for \"SubjectNameFlagsV2Property\"");
}

// @ts-ignore TS6133
function convertCfnTemplateSubjectNameFlagsV2PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplateSubjectNameFlagsV2PropertyValidator(properties).assertSuccess();
  return {
    "RequireCommonName": cdk.booleanToCloudFormation(properties.requireCommonName),
    "RequireDirectoryPath": cdk.booleanToCloudFormation(properties.requireDirectoryPath),
    "RequireDnsAsCn": cdk.booleanToCloudFormation(properties.requireDnsAsCn),
    "RequireEmail": cdk.booleanToCloudFormation(properties.requireEmail),
    "SanRequireDirectoryGuid": cdk.booleanToCloudFormation(properties.sanRequireDirectoryGuid),
    "SanRequireDns": cdk.booleanToCloudFormation(properties.sanRequireDns),
    "SanRequireDomainDns": cdk.booleanToCloudFormation(properties.sanRequireDomainDns),
    "SanRequireEmail": cdk.booleanToCloudFormation(properties.sanRequireEmail),
    "SanRequireSpn": cdk.booleanToCloudFormation(properties.sanRequireSpn),
    "SanRequireUpn": cdk.booleanToCloudFormation(properties.sanRequireUpn)
  };
}

// @ts-ignore TS6133
function CfnTemplateSubjectNameFlagsV2PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTemplate.SubjectNameFlagsV2Property> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.SubjectNameFlagsV2Property>();
  ret.addPropertyResult("requireCommonName", "RequireCommonName", (properties.RequireCommonName != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RequireCommonName) : undefined));
  ret.addPropertyResult("requireDirectoryPath", "RequireDirectoryPath", (properties.RequireDirectoryPath != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RequireDirectoryPath) : undefined));
  ret.addPropertyResult("requireDnsAsCn", "RequireDnsAsCn", (properties.RequireDnsAsCn != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RequireDnsAsCn) : undefined));
  ret.addPropertyResult("requireEmail", "RequireEmail", (properties.RequireEmail != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RequireEmail) : undefined));
  ret.addPropertyResult("sanRequireDirectoryGuid", "SanRequireDirectoryGuid", (properties.SanRequireDirectoryGuid != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SanRequireDirectoryGuid) : undefined));
  ret.addPropertyResult("sanRequireDns", "SanRequireDns", (properties.SanRequireDns != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SanRequireDns) : undefined));
  ret.addPropertyResult("sanRequireDomainDns", "SanRequireDomainDns", (properties.SanRequireDomainDns != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SanRequireDomainDns) : undefined));
  ret.addPropertyResult("sanRequireEmail", "SanRequireEmail", (properties.SanRequireEmail != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SanRequireEmail) : undefined));
  ret.addPropertyResult("sanRequireSpn", "SanRequireSpn", (properties.SanRequireSpn != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SanRequireSpn) : undefined));
  ret.addPropertyResult("sanRequireUpn", "SanRequireUpn", (properties.SanRequireUpn != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SanRequireUpn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PrivateKeyFlagsV2Property`
 *
 * @param properties - the TypeScript properties of a `PrivateKeyFlagsV2Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplatePrivateKeyFlagsV2PropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clientVersion", cdk.requiredValidator)(properties.clientVersion));
  errors.collect(cdk.propertyValidator("clientVersion", cdk.validateString)(properties.clientVersion));
  errors.collect(cdk.propertyValidator("exportableKey", cdk.validateBoolean)(properties.exportableKey));
  errors.collect(cdk.propertyValidator("strongKeyProtectionRequired", cdk.validateBoolean)(properties.strongKeyProtectionRequired));
  return errors.wrap("supplied properties not correct for \"PrivateKeyFlagsV2Property\"");
}

// @ts-ignore TS6133
function convertCfnTemplatePrivateKeyFlagsV2PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplatePrivateKeyFlagsV2PropertyValidator(properties).assertSuccess();
  return {
    "ClientVersion": cdk.stringToCloudFormation(properties.clientVersion),
    "ExportableKey": cdk.booleanToCloudFormation(properties.exportableKey),
    "StrongKeyProtectionRequired": cdk.booleanToCloudFormation(properties.strongKeyProtectionRequired)
  };
}

// @ts-ignore TS6133
function CfnTemplatePrivateKeyFlagsV2PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTemplate.PrivateKeyFlagsV2Property> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.PrivateKeyFlagsV2Property>();
  ret.addPropertyResult("clientVersion", "ClientVersion", (properties.ClientVersion != null ? cfn_parse.FromCloudFormation.getString(properties.ClientVersion) : undefined));
  ret.addPropertyResult("exportableKey", "ExportableKey", (properties.ExportableKey != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ExportableKey) : undefined));
  ret.addPropertyResult("strongKeyProtectionRequired", "StrongKeyProtectionRequired", (properties.StrongKeyProtectionRequired != null ? cfn_parse.FromCloudFormation.getBoolean(properties.StrongKeyProtectionRequired) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PrivateKeyAttributesV2Property`
 *
 * @param properties - the TypeScript properties of a `PrivateKeyAttributesV2Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplatePrivateKeyAttributesV2PropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cryptoProviders", cdk.listValidator(cdk.validateString))(properties.cryptoProviders));
  errors.collect(cdk.propertyValidator("keySpec", cdk.requiredValidator)(properties.keySpec));
  errors.collect(cdk.propertyValidator("keySpec", cdk.validateString)(properties.keySpec));
  errors.collect(cdk.propertyValidator("minimalKeyLength", cdk.requiredValidator)(properties.minimalKeyLength));
  errors.collect(cdk.propertyValidator("minimalKeyLength", cdk.validateNumber)(properties.minimalKeyLength));
  return errors.wrap("supplied properties not correct for \"PrivateKeyAttributesV2Property\"");
}

// @ts-ignore TS6133
function convertCfnTemplatePrivateKeyAttributesV2PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplatePrivateKeyAttributesV2PropertyValidator(properties).assertSuccess();
  return {
    "CryptoProviders": cdk.listMapper(cdk.stringToCloudFormation)(properties.cryptoProviders),
    "KeySpec": cdk.stringToCloudFormation(properties.keySpec),
    "MinimalKeyLength": cdk.numberToCloudFormation(properties.minimalKeyLength)
  };
}

// @ts-ignore TS6133
function CfnTemplatePrivateKeyAttributesV2PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTemplate.PrivateKeyAttributesV2Property> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.PrivateKeyAttributesV2Property>();
  ret.addPropertyResult("cryptoProviders", "CryptoProviders", (properties.CryptoProviders != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.CryptoProviders) : undefined));
  ret.addPropertyResult("keySpec", "KeySpec", (properties.KeySpec != null ? cfn_parse.FromCloudFormation.getString(properties.KeySpec) : undefined));
  ret.addPropertyResult("minimalKeyLength", "MinimalKeyLength", (properties.MinimalKeyLength != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinimalKeyLength) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GeneralFlagsV2Property`
 *
 * @param properties - the TypeScript properties of a `GeneralFlagsV2Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplateGeneralFlagsV2PropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoEnrollment", cdk.validateBoolean)(properties.autoEnrollment));
  errors.collect(cdk.propertyValidator("machineType", cdk.validateBoolean)(properties.machineType));
  return errors.wrap("supplied properties not correct for \"GeneralFlagsV2Property\"");
}

// @ts-ignore TS6133
function convertCfnTemplateGeneralFlagsV2PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplateGeneralFlagsV2PropertyValidator(properties).assertSuccess();
  return {
    "AutoEnrollment": cdk.booleanToCloudFormation(properties.autoEnrollment),
    "MachineType": cdk.booleanToCloudFormation(properties.machineType)
  };
}

// @ts-ignore TS6133
function CfnTemplateGeneralFlagsV2PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTemplate.GeneralFlagsV2Property | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.GeneralFlagsV2Property>();
  ret.addPropertyResult("autoEnrollment", "AutoEnrollment", (properties.AutoEnrollment != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoEnrollment) : undefined));
  ret.addPropertyResult("machineType", "MachineType", (properties.MachineType != null ? cfn_parse.FromCloudFormation.getBoolean(properties.MachineType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ExtensionsV2Property`
 *
 * @param properties - the TypeScript properties of a `ExtensionsV2Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplateExtensionsV2PropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationPolicies", CfnTemplateApplicationPoliciesPropertyValidator)(properties.applicationPolicies));
  errors.collect(cdk.propertyValidator("keyUsage", cdk.requiredValidator)(properties.keyUsage));
  errors.collect(cdk.propertyValidator("keyUsage", CfnTemplateKeyUsagePropertyValidator)(properties.keyUsage));
  return errors.wrap("supplied properties not correct for \"ExtensionsV2Property\"");
}

// @ts-ignore TS6133
function convertCfnTemplateExtensionsV2PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplateExtensionsV2PropertyValidator(properties).assertSuccess();
  return {
    "ApplicationPolicies": convertCfnTemplateApplicationPoliciesPropertyToCloudFormation(properties.applicationPolicies),
    "KeyUsage": convertCfnTemplateKeyUsagePropertyToCloudFormation(properties.keyUsage)
  };
}

// @ts-ignore TS6133
function CfnTemplateExtensionsV2PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTemplate.ExtensionsV2Property | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.ExtensionsV2Property>();
  ret.addPropertyResult("applicationPolicies", "ApplicationPolicies", (properties.ApplicationPolicies != null ? CfnTemplateApplicationPoliciesPropertyFromCloudFormation(properties.ApplicationPolicies) : undefined));
  ret.addPropertyResult("keyUsage", "KeyUsage", (properties.KeyUsage != null ? CfnTemplateKeyUsagePropertyFromCloudFormation(properties.KeyUsage) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EnrollmentFlagsV2Property`
 *
 * @param properties - the TypeScript properties of a `EnrollmentFlagsV2Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplateEnrollmentFlagsV2PropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enableKeyReuseOnNtTokenKeysetStorageFull", cdk.validateBoolean)(properties.enableKeyReuseOnNtTokenKeysetStorageFull));
  errors.collect(cdk.propertyValidator("includeSymmetricAlgorithms", cdk.validateBoolean)(properties.includeSymmetricAlgorithms));
  errors.collect(cdk.propertyValidator("noSecurityExtension", cdk.validateBoolean)(properties.noSecurityExtension));
  errors.collect(cdk.propertyValidator("removeInvalidCertificateFromPersonalStore", cdk.validateBoolean)(properties.removeInvalidCertificateFromPersonalStore));
  errors.collect(cdk.propertyValidator("userInteractionRequired", cdk.validateBoolean)(properties.userInteractionRequired));
  return errors.wrap("supplied properties not correct for \"EnrollmentFlagsV2Property\"");
}

// @ts-ignore TS6133
function convertCfnTemplateEnrollmentFlagsV2PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplateEnrollmentFlagsV2PropertyValidator(properties).assertSuccess();
  return {
    "EnableKeyReuseOnNtTokenKeysetStorageFull": cdk.booleanToCloudFormation(properties.enableKeyReuseOnNtTokenKeysetStorageFull),
    "IncludeSymmetricAlgorithms": cdk.booleanToCloudFormation(properties.includeSymmetricAlgorithms),
    "NoSecurityExtension": cdk.booleanToCloudFormation(properties.noSecurityExtension),
    "RemoveInvalidCertificateFromPersonalStore": cdk.booleanToCloudFormation(properties.removeInvalidCertificateFromPersonalStore),
    "UserInteractionRequired": cdk.booleanToCloudFormation(properties.userInteractionRequired)
  };
}

// @ts-ignore TS6133
function CfnTemplateEnrollmentFlagsV2PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTemplate.EnrollmentFlagsV2Property | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.EnrollmentFlagsV2Property>();
  ret.addPropertyResult("enableKeyReuseOnNtTokenKeysetStorageFull", "EnableKeyReuseOnNtTokenKeysetStorageFull", (properties.EnableKeyReuseOnNtTokenKeysetStorageFull != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableKeyReuseOnNtTokenKeysetStorageFull) : undefined));
  ret.addPropertyResult("includeSymmetricAlgorithms", "IncludeSymmetricAlgorithms", (properties.IncludeSymmetricAlgorithms != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeSymmetricAlgorithms) : undefined));
  ret.addPropertyResult("noSecurityExtension", "NoSecurityExtension", (properties.NoSecurityExtension != null ? cfn_parse.FromCloudFormation.getBoolean(properties.NoSecurityExtension) : undefined));
  ret.addPropertyResult("removeInvalidCertificateFromPersonalStore", "RemoveInvalidCertificateFromPersonalStore", (properties.RemoveInvalidCertificateFromPersonalStore != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RemoveInvalidCertificateFromPersonalStore) : undefined));
  ret.addPropertyResult("userInteractionRequired", "UserInteractionRequired", (properties.UserInteractionRequired != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UserInteractionRequired) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TemplateV2Property`
 *
 * @param properties - the TypeScript properties of a `TemplateV2Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplateTemplateV2PropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificateValidity", cdk.requiredValidator)(properties.certificateValidity));
  errors.collect(cdk.propertyValidator("certificateValidity", CfnTemplateCertificateValidityPropertyValidator)(properties.certificateValidity));
  errors.collect(cdk.propertyValidator("enrollmentFlags", cdk.requiredValidator)(properties.enrollmentFlags));
  errors.collect(cdk.propertyValidator("enrollmentFlags", CfnTemplateEnrollmentFlagsV2PropertyValidator)(properties.enrollmentFlags));
  errors.collect(cdk.propertyValidator("extensions", cdk.requiredValidator)(properties.extensions));
  errors.collect(cdk.propertyValidator("extensions", CfnTemplateExtensionsV2PropertyValidator)(properties.extensions));
  errors.collect(cdk.propertyValidator("generalFlags", cdk.requiredValidator)(properties.generalFlags));
  errors.collect(cdk.propertyValidator("generalFlags", CfnTemplateGeneralFlagsV2PropertyValidator)(properties.generalFlags));
  errors.collect(cdk.propertyValidator("privateKeyAttributes", cdk.requiredValidator)(properties.privateKeyAttributes));
  errors.collect(cdk.propertyValidator("privateKeyAttributes", CfnTemplatePrivateKeyAttributesV2PropertyValidator)(properties.privateKeyAttributes));
  errors.collect(cdk.propertyValidator("privateKeyFlags", cdk.requiredValidator)(properties.privateKeyFlags));
  errors.collect(cdk.propertyValidator("privateKeyFlags", CfnTemplatePrivateKeyFlagsV2PropertyValidator)(properties.privateKeyFlags));
  errors.collect(cdk.propertyValidator("subjectNameFlags", cdk.requiredValidator)(properties.subjectNameFlags));
  errors.collect(cdk.propertyValidator("subjectNameFlags", CfnTemplateSubjectNameFlagsV2PropertyValidator)(properties.subjectNameFlags));
  errors.collect(cdk.propertyValidator("supersededTemplates", cdk.listValidator(cdk.validateString))(properties.supersededTemplates));
  return errors.wrap("supplied properties not correct for \"TemplateV2Property\"");
}

// @ts-ignore TS6133
function convertCfnTemplateTemplateV2PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplateTemplateV2PropertyValidator(properties).assertSuccess();
  return {
    "CertificateValidity": convertCfnTemplateCertificateValidityPropertyToCloudFormation(properties.certificateValidity),
    "EnrollmentFlags": convertCfnTemplateEnrollmentFlagsV2PropertyToCloudFormation(properties.enrollmentFlags),
    "Extensions": convertCfnTemplateExtensionsV2PropertyToCloudFormation(properties.extensions),
    "GeneralFlags": convertCfnTemplateGeneralFlagsV2PropertyToCloudFormation(properties.generalFlags),
    "PrivateKeyAttributes": convertCfnTemplatePrivateKeyAttributesV2PropertyToCloudFormation(properties.privateKeyAttributes),
    "PrivateKeyFlags": convertCfnTemplatePrivateKeyFlagsV2PropertyToCloudFormation(properties.privateKeyFlags),
    "SubjectNameFlags": convertCfnTemplateSubjectNameFlagsV2PropertyToCloudFormation(properties.subjectNameFlags),
    "SupersededTemplates": cdk.listMapper(cdk.stringToCloudFormation)(properties.supersededTemplates)
  };
}

// @ts-ignore TS6133
function CfnTemplateTemplateV2PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTemplate.TemplateV2Property> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.TemplateV2Property>();
  ret.addPropertyResult("certificateValidity", "CertificateValidity", (properties.CertificateValidity != null ? CfnTemplateCertificateValidityPropertyFromCloudFormation(properties.CertificateValidity) : undefined));
  ret.addPropertyResult("enrollmentFlags", "EnrollmentFlags", (properties.EnrollmentFlags != null ? CfnTemplateEnrollmentFlagsV2PropertyFromCloudFormation(properties.EnrollmentFlags) : undefined));
  ret.addPropertyResult("extensions", "Extensions", (properties.Extensions != null ? CfnTemplateExtensionsV2PropertyFromCloudFormation(properties.Extensions) : undefined));
  ret.addPropertyResult("generalFlags", "GeneralFlags", (properties.GeneralFlags != null ? CfnTemplateGeneralFlagsV2PropertyFromCloudFormation(properties.GeneralFlags) : undefined));
  ret.addPropertyResult("privateKeyAttributes", "PrivateKeyAttributes", (properties.PrivateKeyAttributes != null ? CfnTemplatePrivateKeyAttributesV2PropertyFromCloudFormation(properties.PrivateKeyAttributes) : undefined));
  ret.addPropertyResult("privateKeyFlags", "PrivateKeyFlags", (properties.PrivateKeyFlags != null ? CfnTemplatePrivateKeyFlagsV2PropertyFromCloudFormation(properties.PrivateKeyFlags) : undefined));
  ret.addPropertyResult("subjectNameFlags", "SubjectNameFlags", (properties.SubjectNameFlags != null ? CfnTemplateSubjectNameFlagsV2PropertyFromCloudFormation(properties.SubjectNameFlags) : undefined));
  ret.addPropertyResult("supersededTemplates", "SupersededTemplates", (properties.SupersededTemplates != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SupersededTemplates) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TemplateDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `TemplateDefinitionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplateTemplateDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("templateV2", CfnTemplateTemplateV2PropertyValidator)(properties.templateV2));
  errors.collect(cdk.propertyValidator("templateV3", CfnTemplateTemplateV3PropertyValidator)(properties.templateV3));
  errors.collect(cdk.propertyValidator("templateV4", CfnTemplateTemplateV4PropertyValidator)(properties.templateV4));
  return errors.wrap("supplied properties not correct for \"TemplateDefinitionProperty\"");
}

// @ts-ignore TS6133
function convertCfnTemplateTemplateDefinitionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplateTemplateDefinitionPropertyValidator(properties).assertSuccess();
  return {
    "TemplateV2": convertCfnTemplateTemplateV2PropertyToCloudFormation(properties.templateV2),
    "TemplateV3": convertCfnTemplateTemplateV3PropertyToCloudFormation(properties.templateV3),
    "TemplateV4": convertCfnTemplateTemplateV4PropertyToCloudFormation(properties.templateV4)
  };
}

// @ts-ignore TS6133
function CfnTemplateTemplateDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTemplate.TemplateDefinitionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.TemplateDefinitionProperty>();
  ret.addPropertyResult("templateV2", "TemplateV2", (properties.TemplateV2 != null ? CfnTemplateTemplateV2PropertyFromCloudFormation(properties.TemplateV2) : undefined));
  ret.addPropertyResult("templateV3", "TemplateV3", (properties.TemplateV3 != null ? CfnTemplateTemplateV3PropertyFromCloudFormation(properties.TemplateV3) : undefined));
  ret.addPropertyResult("templateV4", "TemplateV4", (properties.TemplateV4 != null ? CfnTemplateTemplateV4PropertyFromCloudFormation(properties.TemplateV4) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnTemplateProps`
 *
 * @param properties - the TypeScript properties of a `CfnTemplateProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplatePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectorArn", cdk.requiredValidator)(properties.connectorArn));
  errors.collect(cdk.propertyValidator("connectorArn", cdk.validateString)(properties.connectorArn));
  errors.collect(cdk.propertyValidator("definition", cdk.requiredValidator)(properties.definition));
  errors.collect(cdk.propertyValidator("definition", CfnTemplateTemplateDefinitionPropertyValidator)(properties.definition));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("reenrollAllCertificateHolders", cdk.validateBoolean)(properties.reenrollAllCertificateHolders));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnTemplateProps\"");
}

// @ts-ignore TS6133
function convertCfnTemplatePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplatePropsValidator(properties).assertSuccess();
  return {
    "ConnectorArn": cdk.stringToCloudFormation(properties.connectorArn),
    "Definition": convertCfnTemplateTemplateDefinitionPropertyToCloudFormation(properties.definition),
    "Name": cdk.stringToCloudFormation(properties.name),
    "ReenrollAllCertificateHolders": cdk.booleanToCloudFormation(properties.reenrollAllCertificateHolders),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnTemplatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTemplateProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplateProps>();
  ret.addPropertyResult("connectorArn", "ConnectorArn", (properties.ConnectorArn != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectorArn) : undefined));
  ret.addPropertyResult("definition", "Definition", (properties.Definition != null ? CfnTemplateTemplateDefinitionPropertyFromCloudFormation(properties.Definition) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("reenrollAllCertificateHolders", "ReenrollAllCertificateHolders", (properties.ReenrollAllCertificateHolders != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ReenrollAllCertificateHolders) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Create a group access control entry.
 *
 * Allow or deny Active Directory groups from enrolling and/or autoenrolling with the template based on the group security identifiers (SIDs).
 *
 * @cloudformationResource AWS::PCAConnectorAD::TemplateGroupAccessControlEntry
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcaconnectorad-templategroupaccesscontrolentry.html
 */
export class CfnTemplateGroupAccessControlEntry extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::PCAConnectorAD::TemplateGroupAccessControlEntry";

  /**
   * Build a CfnTemplateGroupAccessControlEntry from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTemplateGroupAccessControlEntry {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTemplateGroupAccessControlEntryPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTemplateGroupAccessControlEntry(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Permissions to allow or deny an Active Directory group to enroll or autoenroll certificates issued against a template.
   */
  public accessRights: CfnTemplateGroupAccessControlEntry.AccessRightsProperty | cdk.IResolvable;

  /**
   * Name of the Active Directory group.
   */
  public groupDisplayName: string;

  /**
   * Security identifier (SID) of the group object from Active Directory.
   */
  public groupSecurityIdentifier?: string;

  /**
   * The Amazon Resource Name (ARN) that was returned when you called [CreateTemplate](https://docs.aws.amazon.com/pca-connector-ad/latest/APIReference/API_CreateTemplate.html) .
   */
  public templateArn?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTemplateGroupAccessControlEntryProps) {
    super(scope, id, {
      "type": CfnTemplateGroupAccessControlEntry.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "accessRights", this);
    cdk.requireProperty(props, "groupDisplayName", this);

    this.accessRights = props.accessRights;
    this.groupDisplayName = props.groupDisplayName;
    this.groupSecurityIdentifier = props.groupSecurityIdentifier;
    this.templateArn = props.templateArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accessRights": this.accessRights,
      "groupDisplayName": this.groupDisplayName,
      "groupSecurityIdentifier": this.groupSecurityIdentifier,
      "templateArn": this.templateArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTemplateGroupAccessControlEntry.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTemplateGroupAccessControlEntryPropsToCloudFormation(props);
  }
}

export namespace CfnTemplateGroupAccessControlEntry {
  /**
   * Allow or deny permissions for an Active Directory group to enroll or autoenroll certificates for a template.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-templategroupaccesscontrolentry-accessrights.html
   */
  export interface AccessRightsProperty {
    /**
     * Allow or deny an Active Directory group from autoenrolling certificates issued against a template.
     *
     * The Active Directory group must be allowed to enroll to allow autoenrollment
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-templategroupaccesscontrolentry-accessrights.html#cfn-pcaconnectorad-templategroupaccesscontrolentry-accessrights-autoenroll
     */
    readonly autoEnroll?: string;

    /**
     * Allow or deny an Active Directory group from enrolling certificates issued against a template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pcaconnectorad-templategroupaccesscontrolentry-accessrights.html#cfn-pcaconnectorad-templategroupaccesscontrolentry-accessrights-enroll
     */
    readonly enroll?: string;
  }
}

/**
 * Properties for defining a `CfnTemplateGroupAccessControlEntry`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcaconnectorad-templategroupaccesscontrolentry.html
 */
export interface CfnTemplateGroupAccessControlEntryProps {
  /**
   * Permissions to allow or deny an Active Directory group to enroll or autoenroll certificates issued against a template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcaconnectorad-templategroupaccesscontrolentry.html#cfn-pcaconnectorad-templategroupaccesscontrolentry-accessrights
   */
  readonly accessRights: CfnTemplateGroupAccessControlEntry.AccessRightsProperty | cdk.IResolvable;

  /**
   * Name of the Active Directory group.
   *
   * This name does not need to match the group name in Active Directory.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcaconnectorad-templategroupaccesscontrolentry.html#cfn-pcaconnectorad-templategroupaccesscontrolentry-groupdisplayname
   */
  readonly groupDisplayName: string;

  /**
   * Security identifier (SID) of the group object from Active Directory.
   *
   * The SID starts with "S-".
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcaconnectorad-templategroupaccesscontrolentry.html#cfn-pcaconnectorad-templategroupaccesscontrolentry-groupsecurityidentifier
   */
  readonly groupSecurityIdentifier?: string;

  /**
   * The Amazon Resource Name (ARN) that was returned when you called [CreateTemplate](https://docs.aws.amazon.com/pca-connector-ad/latest/APIReference/API_CreateTemplate.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pcaconnectorad-templategroupaccesscontrolentry.html#cfn-pcaconnectorad-templategroupaccesscontrolentry-templatearn
   */
  readonly templateArn?: string;
}

/**
 * Determine whether the given properties match those of a `AccessRightsProperty`
 *
 * @param properties - the TypeScript properties of a `AccessRightsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplateGroupAccessControlEntryAccessRightsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoEnroll", cdk.validateString)(properties.autoEnroll));
  errors.collect(cdk.propertyValidator("enroll", cdk.validateString)(properties.enroll));
  return errors.wrap("supplied properties not correct for \"AccessRightsProperty\"");
}

// @ts-ignore TS6133
function convertCfnTemplateGroupAccessControlEntryAccessRightsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplateGroupAccessControlEntryAccessRightsPropertyValidator(properties).assertSuccess();
  return {
    "AutoEnroll": cdk.stringToCloudFormation(properties.autoEnroll),
    "Enroll": cdk.stringToCloudFormation(properties.enroll)
  };
}

// @ts-ignore TS6133
function CfnTemplateGroupAccessControlEntryAccessRightsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTemplateGroupAccessControlEntry.AccessRightsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplateGroupAccessControlEntry.AccessRightsProperty>();
  ret.addPropertyResult("autoEnroll", "AutoEnroll", (properties.AutoEnroll != null ? cfn_parse.FromCloudFormation.getString(properties.AutoEnroll) : undefined));
  ret.addPropertyResult("enroll", "Enroll", (properties.Enroll != null ? cfn_parse.FromCloudFormation.getString(properties.Enroll) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnTemplateGroupAccessControlEntryProps`
 *
 * @param properties - the TypeScript properties of a `CfnTemplateGroupAccessControlEntryProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplateGroupAccessControlEntryPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessRights", cdk.requiredValidator)(properties.accessRights));
  errors.collect(cdk.propertyValidator("accessRights", CfnTemplateGroupAccessControlEntryAccessRightsPropertyValidator)(properties.accessRights));
  errors.collect(cdk.propertyValidator("groupDisplayName", cdk.requiredValidator)(properties.groupDisplayName));
  errors.collect(cdk.propertyValidator("groupDisplayName", cdk.validateString)(properties.groupDisplayName));
  errors.collect(cdk.propertyValidator("groupSecurityIdentifier", cdk.validateString)(properties.groupSecurityIdentifier));
  errors.collect(cdk.propertyValidator("templateArn", cdk.validateString)(properties.templateArn));
  return errors.wrap("supplied properties not correct for \"CfnTemplateGroupAccessControlEntryProps\"");
}

// @ts-ignore TS6133
function convertCfnTemplateGroupAccessControlEntryPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplateGroupAccessControlEntryPropsValidator(properties).assertSuccess();
  return {
    "AccessRights": convertCfnTemplateGroupAccessControlEntryAccessRightsPropertyToCloudFormation(properties.accessRights),
    "GroupDisplayName": cdk.stringToCloudFormation(properties.groupDisplayName),
    "GroupSecurityIdentifier": cdk.stringToCloudFormation(properties.groupSecurityIdentifier),
    "TemplateArn": cdk.stringToCloudFormation(properties.templateArn)
  };
}

// @ts-ignore TS6133
function CfnTemplateGroupAccessControlEntryPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTemplateGroupAccessControlEntryProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplateGroupAccessControlEntryProps>();
  ret.addPropertyResult("accessRights", "AccessRights", (properties.AccessRights != null ? CfnTemplateGroupAccessControlEntryAccessRightsPropertyFromCloudFormation(properties.AccessRights) : undefined));
  ret.addPropertyResult("groupDisplayName", "GroupDisplayName", (properties.GroupDisplayName != null ? cfn_parse.FromCloudFormation.getString(properties.GroupDisplayName) : undefined));
  ret.addPropertyResult("groupSecurityIdentifier", "GroupSecurityIdentifier", (properties.GroupSecurityIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.GroupSecurityIdentifier) : undefined));
  ret.addPropertyResult("templateArn", "TemplateArn", (properties.TemplateArn != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}