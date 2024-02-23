/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Specifies a grant.
 *
 * A grant shares the use of license entitlements with specific AWS accounts . For more information, see [Granted licenses](https://docs.aws.amazon.com/license-manager/latest/userguide/granted-licenses.html) in the *AWS License Manager User Guide* .
 *
 * @cloudformationResource AWS::LicenseManager::Grant
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html
 */
export class CfnGrant extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::LicenseManager::Grant";

  /**
   * Build a CfnGrant from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGrant {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnGrantPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnGrant(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the grant.
   *
   * @cloudformationAttribute GrantArn
   */
  public readonly attrGrantArn: string;

  /**
   * The grant version.
   *
   * @cloudformationAttribute Version
   */
  public readonly attrVersion: string;

  /**
   * Allowed operations for the grant.
   */
  public allowedOperations?: Array<string>;

  /**
   * Grant name.
   */
  public grantName?: string;

  /**
   * Home Region of the grant.
   */
  public homeRegion?: string;

  /**
   * License ARN.
   */
  public licenseArn?: string;

  /**
   * The grant principals. You can specify one of the following as an Amazon Resource Name (ARN):.
   */
  public principals?: Array<string>;

  /**
   * Granted license status.
   */
  public status?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnGrantProps = {}) {
    super(scope, id, {
      "type": CfnGrant.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrGrantArn = cdk.Token.asString(this.getAtt("GrantArn", cdk.ResolutionTypeHint.STRING));
    this.attrVersion = cdk.Token.asString(this.getAtt("Version", cdk.ResolutionTypeHint.STRING));
    this.allowedOperations = props.allowedOperations;
    this.grantName = props.grantName;
    this.homeRegion = props.homeRegion;
    this.licenseArn = props.licenseArn;
    this.principals = props.principals;
    this.status = props.status;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "allowedOperations": this.allowedOperations,
      "grantName": this.grantName,
      "homeRegion": this.homeRegion,
      "licenseArn": this.licenseArn,
      "principals": this.principals,
      "status": this.status
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnGrant.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnGrantPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnGrant`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html
 */
export interface CfnGrantProps {
  /**
   * Allowed operations for the grant.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html#cfn-licensemanager-grant-allowedoperations
   */
  readonly allowedOperations?: Array<string>;

  /**
   * Grant name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html#cfn-licensemanager-grant-grantname
   */
  readonly grantName?: string;

  /**
   * Home Region of the grant.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html#cfn-licensemanager-grant-homeregion
   */
  readonly homeRegion?: string;

  /**
   * License ARN.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html#cfn-licensemanager-grant-licensearn
   */
  readonly licenseArn?: string;

  /**
   * The grant principals. You can specify one of the following as an Amazon Resource Name (ARN):.
   *
   * - An AWS account, which includes only the account specified.
   *
   * - An organizational unit (OU), which includes all accounts in the OU.
   *
   * - An organization, which will include all accounts across your organization.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html#cfn-licensemanager-grant-principals
   */
  readonly principals?: Array<string>;

  /**
   * Granted license status.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html#cfn-licensemanager-grant-status
   */
  readonly status?: string;
}

/**
 * Determine whether the given properties match those of a `CfnGrantProps`
 *
 * @param properties - the TypeScript properties of a `CfnGrantProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGrantPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowedOperations", cdk.listValidator(cdk.validateString))(properties.allowedOperations));
  errors.collect(cdk.propertyValidator("grantName", cdk.validateString)(properties.grantName));
  errors.collect(cdk.propertyValidator("homeRegion", cdk.validateString)(properties.homeRegion));
  errors.collect(cdk.propertyValidator("licenseArn", cdk.validateString)(properties.licenseArn));
  errors.collect(cdk.propertyValidator("principals", cdk.listValidator(cdk.validateString))(properties.principals));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  return errors.wrap("supplied properties not correct for \"CfnGrantProps\"");
}

// @ts-ignore TS6133
function convertCfnGrantPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGrantPropsValidator(properties).assertSuccess();
  return {
    "AllowedOperations": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowedOperations),
    "GrantName": cdk.stringToCloudFormation(properties.grantName),
    "HomeRegion": cdk.stringToCloudFormation(properties.homeRegion),
    "LicenseArn": cdk.stringToCloudFormation(properties.licenseArn),
    "Principals": cdk.listMapper(cdk.stringToCloudFormation)(properties.principals),
    "Status": cdk.stringToCloudFormation(properties.status)
  };
}

// @ts-ignore TS6133
function CfnGrantPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGrantProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGrantProps>();
  ret.addPropertyResult("allowedOperations", "AllowedOperations", (properties.AllowedOperations != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AllowedOperations) : undefined));
  ret.addPropertyResult("grantName", "GrantName", (properties.GrantName != null ? cfn_parse.FromCloudFormation.getString(properties.GrantName) : undefined));
  ret.addPropertyResult("homeRegion", "HomeRegion", (properties.HomeRegion != null ? cfn_parse.FromCloudFormation.getString(properties.HomeRegion) : undefined));
  ret.addPropertyResult("licenseArn", "LicenseArn", (properties.LicenseArn != null ? cfn_parse.FromCloudFormation.getString(properties.LicenseArn) : undefined));
  ret.addPropertyResult("principals", "Principals", (properties.Principals != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Principals) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a granted license.
 *
 * Granted licenses are licenses for products that your organization purchased from AWS Marketplace or directly from a seller who integrated their software with managed entitlements. For more information, see [Granted licenses](https://docs.aws.amazon.com/license-manager/latest/userguide/granted-licenses.html) in the *AWS License Manager User Guide* .
 *
 * @cloudformationResource AWS::LicenseManager::License
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html
 */
export class CfnLicense extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::LicenseManager::License";

  /**
   * Build a CfnLicense from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLicense {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLicensePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLicense(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the license.
   *
   * @cloudformationAttribute LicenseArn
   */
  public readonly attrLicenseArn: string;

  /**
   * The license version.
   *
   * @cloudformationAttribute Version
   */
  public readonly attrVersion: string;

  /**
   * License beneficiary.
   */
  public beneficiary?: string;

  /**
   * Configuration for consumption of the license.
   */
  public consumptionConfiguration: CfnLicense.ConsumptionConfigurationProperty | cdk.IResolvable;

  /**
   * License entitlements.
   */
  public entitlements: Array<CfnLicense.EntitlementProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Home Region of the license.
   */
  public homeRegion: string;

  /**
   * License issuer.
   */
  public issuer: cdk.IResolvable | CfnLicense.IssuerDataProperty;

  /**
   * License metadata.
   */
  public licenseMetadata?: Array<cdk.IResolvable | CfnLicense.MetadataProperty> | cdk.IResolvable;

  /**
   * License name.
   */
  public licenseName: string;

  /**
   * Product name.
   */
  public productName: string;

  /**
   * Product SKU.
   */
  public productSku?: string;

  /**
   * License status.
   */
  public status?: string;

  /**
   * Date and time range during which the license is valid, in ISO8601-UTC format.
   */
  public validity: cdk.IResolvable | CfnLicense.ValidityDateFormatProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLicenseProps) {
    super(scope, id, {
      "type": CfnLicense.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "consumptionConfiguration", this);
    cdk.requireProperty(props, "entitlements", this);
    cdk.requireProperty(props, "homeRegion", this);
    cdk.requireProperty(props, "issuer", this);
    cdk.requireProperty(props, "licenseName", this);
    cdk.requireProperty(props, "productName", this);
    cdk.requireProperty(props, "validity", this);

    this.attrLicenseArn = cdk.Token.asString(this.getAtt("LicenseArn", cdk.ResolutionTypeHint.STRING));
    this.attrVersion = cdk.Token.asString(this.getAtt("Version", cdk.ResolutionTypeHint.STRING));
    this.beneficiary = props.beneficiary;
    this.consumptionConfiguration = props.consumptionConfiguration;
    this.entitlements = props.entitlements;
    this.homeRegion = props.homeRegion;
    this.issuer = props.issuer;
    this.licenseMetadata = props.licenseMetadata;
    this.licenseName = props.licenseName;
    this.productName = props.productName;
    this.productSku = props.productSku;
    this.status = props.status;
    this.validity = props.validity;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "beneficiary": this.beneficiary,
      "consumptionConfiguration": this.consumptionConfiguration,
      "entitlements": this.entitlements,
      "homeRegion": this.homeRegion,
      "issuer": this.issuer,
      "licenseMetadata": this.licenseMetadata,
      "licenseName": this.licenseName,
      "productName": this.productName,
      "productSku": this.productSku,
      "status": this.status,
      "validity": this.validity
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLicense.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLicensePropsToCloudFormation(props);
  }
}

export namespace CfnLicense {
  /**
   * Details about a consumption configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-consumptionconfiguration.html
   */
  export interface ConsumptionConfigurationProperty {
    /**
     * Details about a borrow configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-consumptionconfiguration.html#cfn-licensemanager-license-consumptionconfiguration-borrowconfiguration
     */
    readonly borrowConfiguration?: CfnLicense.BorrowConfigurationProperty | cdk.IResolvable;

    /**
     * Details about a provisional configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-consumptionconfiguration.html#cfn-licensemanager-license-consumptionconfiguration-provisionalconfiguration
     */
    readonly provisionalConfiguration?: cdk.IResolvable | CfnLicense.ProvisionalConfigurationProperty;

    /**
     * Renewal frequency.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-consumptionconfiguration.html#cfn-licensemanager-license-consumptionconfiguration-renewtype
     */
    readonly renewType?: string;
  }

  /**
   * Details about a borrow configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-borrowconfiguration.html
   */
  export interface BorrowConfigurationProperty {
    /**
     * Indicates whether early check-ins are allowed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-borrowconfiguration.html#cfn-licensemanager-license-borrowconfiguration-allowearlycheckin
     */
    readonly allowEarlyCheckIn: boolean | cdk.IResolvable;

    /**
     * Maximum time for the borrow configuration, in minutes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-borrowconfiguration.html#cfn-licensemanager-license-borrowconfiguration-maxtimetoliveinminutes
     */
    readonly maxTimeToLiveInMinutes: number;
  }

  /**
   * Details about a provisional configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-provisionalconfiguration.html
   */
  export interface ProvisionalConfigurationProperty {
    /**
     * Maximum time for the provisional configuration, in minutes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-provisionalconfiguration.html#cfn-licensemanager-license-provisionalconfiguration-maxtimetoliveinminutes
     */
    readonly maxTimeToLiveInMinutes: number;
  }

  /**
   * Date and time range during which the license is valid, in ISO8601-UTC format.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-validitydateformat.html
   */
  export interface ValidityDateFormatProperty {
    /**
     * Start of the time range.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-validitydateformat.html#cfn-licensemanager-license-validitydateformat-begin
     */
    readonly begin: string;

    /**
     * End of the time range.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-validitydateformat.html#cfn-licensemanager-license-validitydateformat-end
     */
    readonly end: string;
  }

  /**
   * Details associated with the issuer of a license.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-issuerdata.html
   */
  export interface IssuerDataProperty {
    /**
     * Issuer name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-issuerdata.html#cfn-licensemanager-license-issuerdata-name
     */
    readonly name: string;

    /**
     * Asymmetric KMS key from AWS Key Management Service .
     *
     * The KMS key must have a key usage of sign and verify, and support the RSASSA-PSS SHA-256 signing algorithm.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-issuerdata.html#cfn-licensemanager-license-issuerdata-signkey
     */
    readonly signKey?: string;
  }

  /**
   * Describes a resource entitled for use with a license.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-entitlement.html
   */
  export interface EntitlementProperty {
    /**
     * Indicates whether check-ins are allowed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-entitlement.html#cfn-licensemanager-license-entitlement-allowcheckin
     */
    readonly allowCheckIn?: boolean | cdk.IResolvable;

    /**
     * Maximum entitlement count.
     *
     * Use if the unit is not None.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-entitlement.html#cfn-licensemanager-license-entitlement-maxcount
     */
    readonly maxCount?: number;

    /**
     * Entitlement name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-entitlement.html#cfn-licensemanager-license-entitlement-name
     */
    readonly name: string;

    /**
     * Indicates whether overages are allowed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-entitlement.html#cfn-licensemanager-license-entitlement-overage
     */
    readonly overage?: boolean | cdk.IResolvable;

    /**
     * Entitlement unit.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-entitlement.html#cfn-licensemanager-license-entitlement-unit
     */
    readonly unit: string;

    /**
     * Entitlement resource.
     *
     * Use only if the unit is None.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-entitlement.html#cfn-licensemanager-license-entitlement-value
     */
    readonly value?: string;
  }

  /**
   * Describes key/value pairs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-metadata.html
   */
  export interface MetadataProperty {
    /**
     * The key name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-metadata.html#cfn-licensemanager-license-metadata-name
     */
    readonly name: string;

    /**
     * The value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-metadata.html#cfn-licensemanager-license-metadata-value
     */
    readonly value: string;
  }
}

/**
 * Properties for defining a `CfnLicense`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html
 */
export interface CfnLicenseProps {
  /**
   * License beneficiary.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-beneficiary
   */
  readonly beneficiary?: string;

  /**
   * Configuration for consumption of the license.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-consumptionconfiguration
   */
  readonly consumptionConfiguration: CfnLicense.ConsumptionConfigurationProperty | cdk.IResolvable;

  /**
   * License entitlements.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-entitlements
   */
  readonly entitlements: Array<CfnLicense.EntitlementProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Home Region of the license.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-homeregion
   */
  readonly homeRegion: string;

  /**
   * License issuer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-issuer
   */
  readonly issuer: cdk.IResolvable | CfnLicense.IssuerDataProperty;

  /**
   * License metadata.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-licensemetadata
   */
  readonly licenseMetadata?: Array<cdk.IResolvable | CfnLicense.MetadataProperty> | cdk.IResolvable;

  /**
   * License name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-licensename
   */
  readonly licenseName: string;

  /**
   * Product name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-productname
   */
  readonly productName: string;

  /**
   * Product SKU.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-productsku
   */
  readonly productSku?: string;

  /**
   * License status.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-status
   */
  readonly status?: string;

  /**
   * Date and time range during which the license is valid, in ISO8601-UTC format.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-validity
   */
  readonly validity: cdk.IResolvable | CfnLicense.ValidityDateFormatProperty;
}

/**
 * Determine whether the given properties match those of a `BorrowConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `BorrowConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLicenseBorrowConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowEarlyCheckIn", cdk.requiredValidator)(properties.allowEarlyCheckIn));
  errors.collect(cdk.propertyValidator("allowEarlyCheckIn", cdk.validateBoolean)(properties.allowEarlyCheckIn));
  errors.collect(cdk.propertyValidator("maxTimeToLiveInMinutes", cdk.requiredValidator)(properties.maxTimeToLiveInMinutes));
  errors.collect(cdk.propertyValidator("maxTimeToLiveInMinutes", cdk.validateNumber)(properties.maxTimeToLiveInMinutes));
  return errors.wrap("supplied properties not correct for \"BorrowConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnLicenseBorrowConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLicenseBorrowConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AllowEarlyCheckIn": cdk.booleanToCloudFormation(properties.allowEarlyCheckIn),
    "MaxTimeToLiveInMinutes": cdk.numberToCloudFormation(properties.maxTimeToLiveInMinutes)
  };
}

// @ts-ignore TS6133
function CfnLicenseBorrowConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLicense.BorrowConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLicense.BorrowConfigurationProperty>();
  ret.addPropertyResult("allowEarlyCheckIn", "AllowEarlyCheckIn", (properties.AllowEarlyCheckIn != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowEarlyCheckIn) : undefined));
  ret.addPropertyResult("maxTimeToLiveInMinutes", "MaxTimeToLiveInMinutes", (properties.MaxTimeToLiveInMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxTimeToLiveInMinutes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ProvisionalConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ProvisionalConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLicenseProvisionalConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxTimeToLiveInMinutes", cdk.requiredValidator)(properties.maxTimeToLiveInMinutes));
  errors.collect(cdk.propertyValidator("maxTimeToLiveInMinutes", cdk.validateNumber)(properties.maxTimeToLiveInMinutes));
  return errors.wrap("supplied properties not correct for \"ProvisionalConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnLicenseProvisionalConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLicenseProvisionalConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "MaxTimeToLiveInMinutes": cdk.numberToCloudFormation(properties.maxTimeToLiveInMinutes)
  };
}

// @ts-ignore TS6133
function CfnLicenseProvisionalConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLicense.ProvisionalConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLicense.ProvisionalConfigurationProperty>();
  ret.addPropertyResult("maxTimeToLiveInMinutes", "MaxTimeToLiveInMinutes", (properties.MaxTimeToLiveInMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxTimeToLiveInMinutes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConsumptionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ConsumptionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLicenseConsumptionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("borrowConfiguration", CfnLicenseBorrowConfigurationPropertyValidator)(properties.borrowConfiguration));
  errors.collect(cdk.propertyValidator("provisionalConfiguration", CfnLicenseProvisionalConfigurationPropertyValidator)(properties.provisionalConfiguration));
  errors.collect(cdk.propertyValidator("renewType", cdk.validateString)(properties.renewType));
  return errors.wrap("supplied properties not correct for \"ConsumptionConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnLicenseConsumptionConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLicenseConsumptionConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "BorrowConfiguration": convertCfnLicenseBorrowConfigurationPropertyToCloudFormation(properties.borrowConfiguration),
    "ProvisionalConfiguration": convertCfnLicenseProvisionalConfigurationPropertyToCloudFormation(properties.provisionalConfiguration),
    "RenewType": cdk.stringToCloudFormation(properties.renewType)
  };
}

// @ts-ignore TS6133
function CfnLicenseConsumptionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLicense.ConsumptionConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLicense.ConsumptionConfigurationProperty>();
  ret.addPropertyResult("borrowConfiguration", "BorrowConfiguration", (properties.BorrowConfiguration != null ? CfnLicenseBorrowConfigurationPropertyFromCloudFormation(properties.BorrowConfiguration) : undefined));
  ret.addPropertyResult("provisionalConfiguration", "ProvisionalConfiguration", (properties.ProvisionalConfiguration != null ? CfnLicenseProvisionalConfigurationPropertyFromCloudFormation(properties.ProvisionalConfiguration) : undefined));
  ret.addPropertyResult("renewType", "RenewType", (properties.RenewType != null ? cfn_parse.FromCloudFormation.getString(properties.RenewType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ValidityDateFormatProperty`
 *
 * @param properties - the TypeScript properties of a `ValidityDateFormatProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLicenseValidityDateFormatPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("begin", cdk.requiredValidator)(properties.begin));
  errors.collect(cdk.propertyValidator("begin", cdk.validateString)(properties.begin));
  errors.collect(cdk.propertyValidator("end", cdk.requiredValidator)(properties.end));
  errors.collect(cdk.propertyValidator("end", cdk.validateString)(properties.end));
  return errors.wrap("supplied properties not correct for \"ValidityDateFormatProperty\"");
}

// @ts-ignore TS6133
function convertCfnLicenseValidityDateFormatPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLicenseValidityDateFormatPropertyValidator(properties).assertSuccess();
  return {
    "Begin": cdk.stringToCloudFormation(properties.begin),
    "End": cdk.stringToCloudFormation(properties.end)
  };
}

// @ts-ignore TS6133
function CfnLicenseValidityDateFormatPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLicense.ValidityDateFormatProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLicense.ValidityDateFormatProperty>();
  ret.addPropertyResult("begin", "Begin", (properties.Begin != null ? cfn_parse.FromCloudFormation.getString(properties.Begin) : undefined));
  ret.addPropertyResult("end", "End", (properties.End != null ? cfn_parse.FromCloudFormation.getString(properties.End) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IssuerDataProperty`
 *
 * @param properties - the TypeScript properties of a `IssuerDataProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLicenseIssuerDataPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("signKey", cdk.validateString)(properties.signKey));
  return errors.wrap("supplied properties not correct for \"IssuerDataProperty\"");
}

// @ts-ignore TS6133
function convertCfnLicenseIssuerDataPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLicenseIssuerDataPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "SignKey": cdk.stringToCloudFormation(properties.signKey)
  };
}

// @ts-ignore TS6133
function CfnLicenseIssuerDataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLicense.IssuerDataProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLicense.IssuerDataProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("signKey", "SignKey", (properties.SignKey != null ? cfn_parse.FromCloudFormation.getString(properties.SignKey) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EntitlementProperty`
 *
 * @param properties - the TypeScript properties of a `EntitlementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLicenseEntitlementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowCheckIn", cdk.validateBoolean)(properties.allowCheckIn));
  errors.collect(cdk.propertyValidator("maxCount", cdk.validateNumber)(properties.maxCount));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("overage", cdk.validateBoolean)(properties.overage));
  errors.collect(cdk.propertyValidator("unit", cdk.requiredValidator)(properties.unit));
  errors.collect(cdk.propertyValidator("unit", cdk.validateString)(properties.unit));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"EntitlementProperty\"");
}

// @ts-ignore TS6133
function convertCfnLicenseEntitlementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLicenseEntitlementPropertyValidator(properties).assertSuccess();
  return {
    "AllowCheckIn": cdk.booleanToCloudFormation(properties.allowCheckIn),
    "MaxCount": cdk.numberToCloudFormation(properties.maxCount),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Overage": cdk.booleanToCloudFormation(properties.overage),
    "Unit": cdk.stringToCloudFormation(properties.unit),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnLicenseEntitlementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLicense.EntitlementProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLicense.EntitlementProperty>();
  ret.addPropertyResult("allowCheckIn", "AllowCheckIn", (properties.AllowCheckIn != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowCheckIn) : undefined));
  ret.addPropertyResult("maxCount", "MaxCount", (properties.MaxCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxCount) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("overage", "Overage", (properties.Overage != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Overage) : undefined));
  ret.addPropertyResult("unit", "Unit", (properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MetadataProperty`
 *
 * @param properties - the TypeScript properties of a `MetadataProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLicenseMetadataPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"MetadataProperty\"");
}

// @ts-ignore TS6133
function convertCfnLicenseMetadataPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLicenseMetadataPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnLicenseMetadataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLicense.MetadataProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLicense.MetadataProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnLicenseProps`
 *
 * @param properties - the TypeScript properties of a `CfnLicenseProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLicensePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("beneficiary", cdk.validateString)(properties.beneficiary));
  errors.collect(cdk.propertyValidator("consumptionConfiguration", cdk.requiredValidator)(properties.consumptionConfiguration));
  errors.collect(cdk.propertyValidator("consumptionConfiguration", CfnLicenseConsumptionConfigurationPropertyValidator)(properties.consumptionConfiguration));
  errors.collect(cdk.propertyValidator("entitlements", cdk.requiredValidator)(properties.entitlements));
  errors.collect(cdk.propertyValidator("entitlements", cdk.listValidator(CfnLicenseEntitlementPropertyValidator))(properties.entitlements));
  errors.collect(cdk.propertyValidator("homeRegion", cdk.requiredValidator)(properties.homeRegion));
  errors.collect(cdk.propertyValidator("homeRegion", cdk.validateString)(properties.homeRegion));
  errors.collect(cdk.propertyValidator("issuer", cdk.requiredValidator)(properties.issuer));
  errors.collect(cdk.propertyValidator("issuer", CfnLicenseIssuerDataPropertyValidator)(properties.issuer));
  errors.collect(cdk.propertyValidator("licenseMetadata", cdk.listValidator(CfnLicenseMetadataPropertyValidator))(properties.licenseMetadata));
  errors.collect(cdk.propertyValidator("licenseName", cdk.requiredValidator)(properties.licenseName));
  errors.collect(cdk.propertyValidator("licenseName", cdk.validateString)(properties.licenseName));
  errors.collect(cdk.propertyValidator("productName", cdk.requiredValidator)(properties.productName));
  errors.collect(cdk.propertyValidator("productName", cdk.validateString)(properties.productName));
  errors.collect(cdk.propertyValidator("productSku", cdk.validateString)(properties.productSku));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  errors.collect(cdk.propertyValidator("validity", cdk.requiredValidator)(properties.validity));
  errors.collect(cdk.propertyValidator("validity", CfnLicenseValidityDateFormatPropertyValidator)(properties.validity));
  return errors.wrap("supplied properties not correct for \"CfnLicenseProps\"");
}

// @ts-ignore TS6133
function convertCfnLicensePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLicensePropsValidator(properties).assertSuccess();
  return {
    "Beneficiary": cdk.stringToCloudFormation(properties.beneficiary),
    "ConsumptionConfiguration": convertCfnLicenseConsumptionConfigurationPropertyToCloudFormation(properties.consumptionConfiguration),
    "Entitlements": cdk.listMapper(convertCfnLicenseEntitlementPropertyToCloudFormation)(properties.entitlements),
    "HomeRegion": cdk.stringToCloudFormation(properties.homeRegion),
    "Issuer": convertCfnLicenseIssuerDataPropertyToCloudFormation(properties.issuer),
    "LicenseMetadata": cdk.listMapper(convertCfnLicenseMetadataPropertyToCloudFormation)(properties.licenseMetadata),
    "LicenseName": cdk.stringToCloudFormation(properties.licenseName),
    "ProductName": cdk.stringToCloudFormation(properties.productName),
    "ProductSKU": cdk.stringToCloudFormation(properties.productSku),
    "Status": cdk.stringToCloudFormation(properties.status),
    "Validity": convertCfnLicenseValidityDateFormatPropertyToCloudFormation(properties.validity)
  };
}

// @ts-ignore TS6133
function CfnLicensePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLicenseProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLicenseProps>();
  ret.addPropertyResult("beneficiary", "Beneficiary", (properties.Beneficiary != null ? cfn_parse.FromCloudFormation.getString(properties.Beneficiary) : undefined));
  ret.addPropertyResult("consumptionConfiguration", "ConsumptionConfiguration", (properties.ConsumptionConfiguration != null ? CfnLicenseConsumptionConfigurationPropertyFromCloudFormation(properties.ConsumptionConfiguration) : undefined));
  ret.addPropertyResult("entitlements", "Entitlements", (properties.Entitlements != null ? cfn_parse.FromCloudFormation.getArray(CfnLicenseEntitlementPropertyFromCloudFormation)(properties.Entitlements) : undefined));
  ret.addPropertyResult("homeRegion", "HomeRegion", (properties.HomeRegion != null ? cfn_parse.FromCloudFormation.getString(properties.HomeRegion) : undefined));
  ret.addPropertyResult("issuer", "Issuer", (properties.Issuer != null ? CfnLicenseIssuerDataPropertyFromCloudFormation(properties.Issuer) : undefined));
  ret.addPropertyResult("licenseMetadata", "LicenseMetadata", (properties.LicenseMetadata != null ? cfn_parse.FromCloudFormation.getArray(CfnLicenseMetadataPropertyFromCloudFormation)(properties.LicenseMetadata) : undefined));
  ret.addPropertyResult("licenseName", "LicenseName", (properties.LicenseName != null ? cfn_parse.FromCloudFormation.getString(properties.LicenseName) : undefined));
  ret.addPropertyResult("productName", "ProductName", (properties.ProductName != null ? cfn_parse.FromCloudFormation.getString(properties.ProductName) : undefined));
  ret.addPropertyResult("productSku", "ProductSKU", (properties.ProductSKU != null ? cfn_parse.FromCloudFormation.getString(properties.ProductSKU) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addPropertyResult("validity", "Validity", (properties.Validity != null ? CfnLicenseValidityDateFormatPropertyFromCloudFormation(properties.Validity) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}