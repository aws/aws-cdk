/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::DirectoryService::MicrosoftAD` resource specifies a Microsoft Active Directory in AWS so that your directory users and groups can access the AWS Management Console and AWS applications using their existing credentials.
 *
 * For more information, see [AWS Managed Microsoft AD](https://docs.aws.amazon.com/directoryservice/latest/admin-guide/directory_microsoft_ad.html) in the *AWS Directory Service Admin Guide* .
 *
 * @cloudformationResource AWS::DirectoryService::MicrosoftAD
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html
 */
export class CfnMicrosoftAD extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DirectoryService::MicrosoftAD";

  /**
   * Build a CfnMicrosoftAD from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMicrosoftAD {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnMicrosoftADPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnMicrosoftAD(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The alias for a directory. For example: `d-12373a053a` or `alias4-mydirectory-12345abcgmzsk` (if you have the `CreateAlias` property set to true).
   *
   * @cloudformationAttribute Alias
   */
  public readonly attrAlias: string;

  /**
   * The IP addresses of the DNS servers for the directory, such as `[ "192.0.2.1", "192.0.2.2" ]` .
   *
   * @cloudformationAttribute DnsIpAddresses
   */
  public readonly attrDnsIpAddresses: Array<string>;

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * Specifies an alias for a directory and assigns the alias to the directory.
   */
  public createAlias?: boolean | cdk.IResolvable;

  /**
   * AWS Managed Microsoft AD is available in two editions: `Standard` and `Enterprise` .
   */
  public edition?: string;

  /**
   * Whether to enable single sign-on for a Microsoft Active Directory in AWS .
   */
  public enableSso?: boolean | cdk.IResolvable;

  /**
   * The fully qualified domain name for the AWS Managed Microsoft AD directory, such as `corp.example.com` . This name will resolve inside your VPC only. It does not need to be publicly resolvable.
   */
  public name: string;

  /**
   * The password for the default administrative user named `Admin` .
   */
  public password: string;

  /**
   * The NetBIOS name for your domain, such as `CORP` .
   */
  public shortName?: string;

  /**
   * Specifies the VPC settings of the Microsoft AD directory server in AWS .
   */
  public vpcSettings: cdk.IResolvable | CfnMicrosoftAD.VpcSettingsProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnMicrosoftADProps) {
    super(scope, id, {
      "type": CfnMicrosoftAD.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "password", this);
    cdk.requireProperty(props, "vpcSettings", this);

    this.attrAlias = cdk.Token.asString(this.getAtt("Alias", cdk.ResolutionTypeHint.STRING));
    this.attrDnsIpAddresses = cdk.Token.asList(this.getAtt("DnsIpAddresses", cdk.ResolutionTypeHint.STRING_LIST));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.createAlias = props.createAlias;
    this.edition = props.edition;
    this.enableSso = props.enableSso;
    this.name = props.name;
    this.password = props.password;
    this.shortName = props.shortName;
    this.vpcSettings = props.vpcSettings;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "createAlias": this.createAlias,
      "edition": this.edition,
      "enableSso": this.enableSso,
      "name": this.name,
      "password": this.password,
      "shortName": this.shortName,
      "vpcSettings": this.vpcSettings
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnMicrosoftAD.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnMicrosoftADPropsToCloudFormation(props);
  }
}

export namespace CfnMicrosoftAD {
  /**
   * Contains VPC information for the [CreateDirectory](https://docs.aws.amazon.com/directoryservice/latest/devguide/API_CreateDirectory.html) or [CreateMicrosoftAD](https://docs.aws.amazon.com/directoryservice/latest/devguide/API_CreateMicrosoftAD.html) operation.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-directoryservice-microsoftad-vpcsettings.html
   */
  export interface VpcSettingsProperty {
    /**
     * The identifiers of the subnets for the directory servers.
     *
     * The two subnets must be in different Availability Zones. AWS Directory Service specifies a directory server and a DNS server in each of these subnets.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-directoryservice-microsoftad-vpcsettings.html#cfn-directoryservice-microsoftad-vpcsettings-subnetids
     */
    readonly subnetIds: Array<string>;

    /**
     * The identifier of the VPC in which to create the directory.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-directoryservice-microsoftad-vpcsettings.html#cfn-directoryservice-microsoftad-vpcsettings-vpcid
     */
    readonly vpcId: string;
  }
}

/**
 * Properties for defining a `CfnMicrosoftAD`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html
 */
export interface CfnMicrosoftADProps {
  /**
   * Specifies an alias for a directory and assigns the alias to the directory.
   *
   * The alias is used to construct the access URL for the directory, such as `http://<alias>.awsapps.com` . By default, AWS CloudFormation does not create an alias.
   *
   * > After an alias has been created, it cannot be deleted or reused, so this operation should only be used when absolutely necessary.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-createalias
   */
  readonly createAlias?: boolean | cdk.IResolvable;

  /**
   * AWS Managed Microsoft AD is available in two editions: `Standard` and `Enterprise` .
   *
   * `Enterprise` is the default.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-edition
   */
  readonly edition?: string;

  /**
   * Whether to enable single sign-on for a Microsoft Active Directory in AWS .
   *
   * Single sign-on allows users in your directory to access certain AWS services from a computer joined to the directory without having to enter their credentials separately. If you don't specify a value, AWS CloudFormation disables single sign-on by default.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-enablesso
   */
  readonly enableSso?: boolean | cdk.IResolvable;

  /**
   * The fully qualified domain name for the AWS Managed Microsoft AD directory, such as `corp.example.com` . This name will resolve inside your VPC only. It does not need to be publicly resolvable.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-name
   */
  readonly name: string;

  /**
   * The password for the default administrative user named `Admin` .
   *
   * If you need to change the password for the administrator account, see the [ResetUserPassword](https://docs.aws.amazon.com/directoryservice/latest/devguide/API_ResetUserPassword.html) API call in the *AWS Directory Service API Reference* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-password
   */
  readonly password: string;

  /**
   * The NetBIOS name for your domain, such as `CORP` .
   *
   * If you don't specify a NetBIOS name, it will default to the first part of your directory DNS. For example, `CORP` for the directory DNS `corp.example.com` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-shortname
   */
  readonly shortName?: string;

  /**
   * Specifies the VPC settings of the Microsoft AD directory server in AWS .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-microsoftad.html#cfn-directoryservice-microsoftad-vpcsettings
   */
  readonly vpcSettings: cdk.IResolvable | CfnMicrosoftAD.VpcSettingsProperty;
}

/**
 * Determine whether the given properties match those of a `VpcSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `VpcSettingsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMicrosoftADVpcSettingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("subnetIds", cdk.requiredValidator)(properties.subnetIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  errors.collect(cdk.propertyValidator("vpcId", cdk.requiredValidator)(properties.vpcId));
  errors.collect(cdk.propertyValidator("vpcId", cdk.validateString)(properties.vpcId));
  return errors.wrap("supplied properties not correct for \"VpcSettingsProperty\"");
}

// @ts-ignore TS6133
function convertCfnMicrosoftADVpcSettingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMicrosoftADVpcSettingsPropertyValidator(properties).assertSuccess();
  return {
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
    "VpcId": cdk.stringToCloudFormation(properties.vpcId)
  };
}

// @ts-ignore TS6133
function CfnMicrosoftADVpcSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMicrosoftAD.VpcSettingsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMicrosoftAD.VpcSettingsProperty>();
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addPropertyResult("vpcId", "VpcId", (properties.VpcId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnMicrosoftADProps`
 *
 * @param properties - the TypeScript properties of a `CfnMicrosoftADProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMicrosoftADPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("createAlias", cdk.validateBoolean)(properties.createAlias));
  errors.collect(cdk.propertyValidator("edition", cdk.validateString)(properties.edition));
  errors.collect(cdk.propertyValidator("enableSso", cdk.validateBoolean)(properties.enableSso));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("password", cdk.requiredValidator)(properties.password));
  errors.collect(cdk.propertyValidator("password", cdk.validateString)(properties.password));
  errors.collect(cdk.propertyValidator("shortName", cdk.validateString)(properties.shortName));
  errors.collect(cdk.propertyValidator("vpcSettings", cdk.requiredValidator)(properties.vpcSettings));
  errors.collect(cdk.propertyValidator("vpcSettings", CfnMicrosoftADVpcSettingsPropertyValidator)(properties.vpcSettings));
  return errors.wrap("supplied properties not correct for \"CfnMicrosoftADProps\"");
}

// @ts-ignore TS6133
function convertCfnMicrosoftADPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMicrosoftADPropsValidator(properties).assertSuccess();
  return {
    "CreateAlias": cdk.booleanToCloudFormation(properties.createAlias),
    "Edition": cdk.stringToCloudFormation(properties.edition),
    "EnableSso": cdk.booleanToCloudFormation(properties.enableSso),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Password": cdk.stringToCloudFormation(properties.password),
    "ShortName": cdk.stringToCloudFormation(properties.shortName),
    "VpcSettings": convertCfnMicrosoftADVpcSettingsPropertyToCloudFormation(properties.vpcSettings)
  };
}

// @ts-ignore TS6133
function CfnMicrosoftADPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMicrosoftADProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMicrosoftADProps>();
  ret.addPropertyResult("createAlias", "CreateAlias", (properties.CreateAlias != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CreateAlias) : undefined));
  ret.addPropertyResult("edition", "Edition", (properties.Edition != null ? cfn_parse.FromCloudFormation.getString(properties.Edition) : undefined));
  ret.addPropertyResult("enableSso", "EnableSso", (properties.EnableSso != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableSso) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("password", "Password", (properties.Password != null ? cfn_parse.FromCloudFormation.getString(properties.Password) : undefined));
  ret.addPropertyResult("shortName", "ShortName", (properties.ShortName != null ? cfn_parse.FromCloudFormation.getString(properties.ShortName) : undefined));
  ret.addPropertyResult("vpcSettings", "VpcSettings", (properties.VpcSettings != null ? CfnMicrosoftADVpcSettingsPropertyFromCloudFormation(properties.VpcSettings) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::DirectoryService::SimpleAD` resource specifies an AWS Directory Service Simple Active Directory ( Simple AD ) in AWS so that your directory users and groups can access the AWS Management Console and AWS applications using their existing credentials.
 *
 * Simple AD is a Microsoft Active Directory–compatible directory. For more information, see [Simple Active Directory](https://docs.aws.amazon.com/directoryservice/latest/admin-guide/directory_simple_ad.html) in the *AWS Directory Service Admin Guide* .
 *
 * @cloudformationResource AWS::DirectoryService::SimpleAD
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html
 */
export class CfnSimpleAD extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DirectoryService::SimpleAD";

  /**
   * Build a CfnSimpleAD from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSimpleAD {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSimpleADPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSimpleAD(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The alias for a directory. For example: `d-12373a053a` or `alias4-mydirectory-12345abcgmzsk` (if you have the `CreateAlias` property set to true).
   *
   * @cloudformationAttribute Alias
   */
  public readonly attrAlias: string;

  /**
   * The unique identifier for a directory.
   *
   * @cloudformationAttribute DirectoryId
   */
  public readonly attrDirectoryId: string;

  /**
   * The IP addresses of the DNS servers for the directory, such as `[ "172.31.3.154", "172.31.63.203" ]` .
   *
   * @cloudformationAttribute DnsIpAddresses
   */
  public readonly attrDnsIpAddresses: Array<string>;

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * If set to `true` , specifies an alias for a directory and assigns the alias to the directory.
   */
  public createAlias?: boolean | cdk.IResolvable;

  /**
   * A description for the directory.
   */
  public description?: string;

  /**
   * Whether to enable single sign-on for a directory.
   */
  public enableSso?: boolean | cdk.IResolvable;

  /**
   * The fully qualified name for the directory, such as `corp.example.com` .
   */
  public name: string;

  /**
   * The password for the directory administrator.
   */
  public password?: string;

  /**
   * The NetBIOS name of the directory, such as `CORP` .
   */
  public shortName?: string;

  /**
   * The size of the directory.
   */
  public size: string;

  /**
   * A [DirectoryVpcSettings](https://docs.aws.amazon.com/directoryservice/latest/devguide/API_DirectoryVpcSettings.html) object that contains additional information for the operation.
   */
  public vpcSettings: cdk.IResolvable | CfnSimpleAD.VpcSettingsProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSimpleADProps) {
    super(scope, id, {
      "type": CfnSimpleAD.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "size", this);
    cdk.requireProperty(props, "vpcSettings", this);

    this.attrAlias = cdk.Token.asString(this.getAtt("Alias", cdk.ResolutionTypeHint.STRING));
    this.attrDirectoryId = cdk.Token.asString(this.getAtt("DirectoryId", cdk.ResolutionTypeHint.STRING));
    this.attrDnsIpAddresses = cdk.Token.asList(this.getAtt("DnsIpAddresses", cdk.ResolutionTypeHint.STRING_LIST));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.createAlias = props.createAlias;
    this.description = props.description;
    this.enableSso = props.enableSso;
    this.name = props.name;
    this.password = props.password;
    this.shortName = props.shortName;
    this.size = props.size;
    this.vpcSettings = props.vpcSettings;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "createAlias": this.createAlias,
      "description": this.description,
      "enableSso": this.enableSso,
      "name": this.name,
      "password": this.password,
      "shortName": this.shortName,
      "size": this.size,
      "vpcSettings": this.vpcSettings
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSimpleAD.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSimpleADPropsToCloudFormation(props);
  }
}

export namespace CfnSimpleAD {
  /**
   * Contains VPC information for the [CreateDirectory](https://docs.aws.amazon.com/directoryservice/latest/devguide/API_CreateDirectory.html) or [CreateMicrosoftAD](https://docs.aws.amazon.com/directoryservice/latest/devguide/API_CreateMicrosoftAD.html) operation.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-directoryservice-simplead-vpcsettings.html
   */
  export interface VpcSettingsProperty {
    /**
     * The identifiers of the subnets for the directory servers.
     *
     * The two subnets must be in different Availability Zones. AWS Directory Service specifies a directory server and a DNS server in each of these subnets.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-directoryservice-simplead-vpcsettings.html#cfn-directoryservice-simplead-vpcsettings-subnetids
     */
    readonly subnetIds: Array<string>;

    /**
     * The identifier of the VPC in which to create the directory.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-directoryservice-simplead-vpcsettings.html#cfn-directoryservice-simplead-vpcsettings-vpcid
     */
    readonly vpcId: string;
  }
}

/**
 * Properties for defining a `CfnSimpleAD`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html
 */
export interface CfnSimpleADProps {
  /**
   * If set to `true` , specifies an alias for a directory and assigns the alias to the directory.
   *
   * The alias is used to construct the access URL for the directory, such as `http://<alias>.awsapps.com` . By default, this property is set to `false` .
   *
   * > After an alias has been created, it cannot be deleted or reused, so this operation should only be used when absolutely necessary.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-createalias
   */
  readonly createAlias?: boolean | cdk.IResolvable;

  /**
   * A description for the directory.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-description
   */
  readonly description?: string;

  /**
   * Whether to enable single sign-on for a directory.
   *
   * If you don't specify a value, AWS CloudFormation disables single sign-on by default.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-enablesso
   */
  readonly enableSso?: boolean | cdk.IResolvable;

  /**
   * The fully qualified name for the directory, such as `corp.example.com` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-name
   */
  readonly name: string;

  /**
   * The password for the directory administrator.
   *
   * The directory creation process creates a directory administrator account with the user name `Administrator` and this password.
   *
   * If you need to change the password for the administrator account, see the [ResetUserPassword](https://docs.aws.amazon.com/directoryservice/latest/devguide/API_ResetUserPassword.html) API call in the *AWS Directory Service API Reference* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-password
   */
  readonly password?: string;

  /**
   * The NetBIOS name of the directory, such as `CORP` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-shortname
   */
  readonly shortName?: string;

  /**
   * The size of the directory.
   *
   * For valid values, see [CreateDirectory](https://docs.aws.amazon.com/directoryservice/latest/devguide/API_CreateDirectory.html) in the *AWS Directory Service API Reference* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-size
   */
  readonly size: string;

  /**
   * A [DirectoryVpcSettings](https://docs.aws.amazon.com/directoryservice/latest/devguide/API_DirectoryVpcSettings.html) object that contains additional information for the operation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-directoryservice-simplead.html#cfn-directoryservice-simplead-vpcsettings
   */
  readonly vpcSettings: cdk.IResolvable | CfnSimpleAD.VpcSettingsProperty;
}

/**
 * Determine whether the given properties match those of a `VpcSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `VpcSettingsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSimpleADVpcSettingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("subnetIds", cdk.requiredValidator)(properties.subnetIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  errors.collect(cdk.propertyValidator("vpcId", cdk.requiredValidator)(properties.vpcId));
  errors.collect(cdk.propertyValidator("vpcId", cdk.validateString)(properties.vpcId));
  return errors.wrap("supplied properties not correct for \"VpcSettingsProperty\"");
}

// @ts-ignore TS6133
function convertCfnSimpleADVpcSettingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSimpleADVpcSettingsPropertyValidator(properties).assertSuccess();
  return {
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
    "VpcId": cdk.stringToCloudFormation(properties.vpcId)
  };
}

// @ts-ignore TS6133
function CfnSimpleADVpcSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSimpleAD.VpcSettingsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSimpleAD.VpcSettingsProperty>();
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addPropertyResult("vpcId", "VpcId", (properties.VpcId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnSimpleADProps`
 *
 * @param properties - the TypeScript properties of a `CfnSimpleADProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSimpleADPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("createAlias", cdk.validateBoolean)(properties.createAlias));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("enableSso", cdk.validateBoolean)(properties.enableSso));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("password", cdk.validateString)(properties.password));
  errors.collect(cdk.propertyValidator("shortName", cdk.validateString)(properties.shortName));
  errors.collect(cdk.propertyValidator("size", cdk.requiredValidator)(properties.size));
  errors.collect(cdk.propertyValidator("size", cdk.validateString)(properties.size));
  errors.collect(cdk.propertyValidator("vpcSettings", cdk.requiredValidator)(properties.vpcSettings));
  errors.collect(cdk.propertyValidator("vpcSettings", CfnSimpleADVpcSettingsPropertyValidator)(properties.vpcSettings));
  return errors.wrap("supplied properties not correct for \"CfnSimpleADProps\"");
}

// @ts-ignore TS6133
function convertCfnSimpleADPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSimpleADPropsValidator(properties).assertSuccess();
  return {
    "CreateAlias": cdk.booleanToCloudFormation(properties.createAlias),
    "Description": cdk.stringToCloudFormation(properties.description),
    "EnableSso": cdk.booleanToCloudFormation(properties.enableSso),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Password": cdk.stringToCloudFormation(properties.password),
    "ShortName": cdk.stringToCloudFormation(properties.shortName),
    "Size": cdk.stringToCloudFormation(properties.size),
    "VpcSettings": convertCfnSimpleADVpcSettingsPropertyToCloudFormation(properties.vpcSettings)
  };
}

// @ts-ignore TS6133
function CfnSimpleADPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSimpleADProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSimpleADProps>();
  ret.addPropertyResult("createAlias", "CreateAlias", (properties.CreateAlias != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CreateAlias) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("enableSso", "EnableSso", (properties.EnableSso != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableSso) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("password", "Password", (properties.Password != null ? cfn_parse.FromCloudFormation.getString(properties.Password) : undefined));
  ret.addPropertyResult("shortName", "ShortName", (properties.ShortName != null ? cfn_parse.FromCloudFormation.getString(properties.ShortName) : undefined));
  ret.addPropertyResult("size", "Size", (properties.Size != null ? cfn_parse.FromCloudFormation.getString(properties.Size) : undefined));
  ret.addPropertyResult("vpcSettings", "VpcSettings", (properties.VpcSettings != null ? CfnSimpleADVpcSettingsPropertyFromCloudFormation(properties.VpcSettings) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}