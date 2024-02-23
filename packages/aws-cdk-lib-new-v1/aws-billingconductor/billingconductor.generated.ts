/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates a billing group that resembles a consolidated billing family that AWS charges, based off of the predefined pricing plan computation.
 *
 * @cloudformationResource AWS::BillingConductor::BillingGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-billinggroup.html
 */
export class CfnBillingGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::BillingConductor::BillingGroup";

  /**
   * Build a CfnBillingGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBillingGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnBillingGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnBillingGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the created billing group.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The time the billing group was created.
   *
   * @cloudformationAttribute CreationTime
   */
  public readonly attrCreationTime: number;

  /**
   * The most recent time the billing group was modified.
   *
   * @cloudformationAttribute LastModifiedTime
   */
  public readonly attrLastModifiedTime: number;

  /**
   * The number of accounts in the particular billing group.
   *
   * @cloudformationAttribute Size
   */
  public readonly attrSize: number;

  /**
   * The billing group status. Only one of the valid values can be used.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * The reason why the billing group is in its current status.
   *
   * @cloudformationAttribute StatusReason
   */
  public readonly attrStatusReason: string;

  /**
   * The set of accounts that will be under the billing group.
   */
  public accountGrouping: CfnBillingGroup.AccountGroupingProperty | cdk.IResolvable;

  /**
   * The preferences and settings that will be used to compute the AWS charges for a billing group.
   */
  public computationPreference: CfnBillingGroup.ComputationPreferenceProperty | cdk.IResolvable;

  /**
   * The description of the billing group.
   */
  public description?: string;

  /**
   * The billing group's name.
   */
  public name: string;

  /**
   * The account ID that serves as the main account in a billing group.
   */
  public primaryAccountId: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A map that contains tag keys and tag values that are attached to a billing group.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnBillingGroupProps) {
    super(scope, id, {
      "type": CfnBillingGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "accountGrouping", this);
    cdk.requireProperty(props, "computationPreference", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "primaryAccountId", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreationTime = cdk.Token.asNumber(this.getAtt("CreationTime", cdk.ResolutionTypeHint.NUMBER));
    this.attrLastModifiedTime = cdk.Token.asNumber(this.getAtt("LastModifiedTime", cdk.ResolutionTypeHint.NUMBER));
    this.attrSize = cdk.Token.asNumber(this.getAtt("Size", cdk.ResolutionTypeHint.NUMBER));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.attrStatusReason = cdk.Token.asString(this.getAtt("StatusReason", cdk.ResolutionTypeHint.STRING));
    this.accountGrouping = props.accountGrouping;
    this.computationPreference = props.computationPreference;
    this.description = props.description;
    this.name = props.name;
    this.primaryAccountId = props.primaryAccountId;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::BillingConductor::BillingGroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accountGrouping": this.accountGrouping,
      "computationPreference": this.computationPreference,
      "description": this.description,
      "name": this.name,
      "primaryAccountId": this.primaryAccountId,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnBillingGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnBillingGroupPropsToCloudFormation(props);
  }
}

export namespace CfnBillingGroup {
  /**
   * The preferences and settings that will be used to compute the AWS charges for a billing group.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-billinggroup-computationpreference.html
   */
  export interface ComputationPreferenceProperty {
    /**
     * The Amazon Resource Name (ARN) of the pricing plan used to compute the AWS charges for a billing group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-billinggroup-computationpreference.html#cfn-billingconductor-billinggroup-computationpreference-pricingplanarn
     */
    readonly pricingPlanArn: string;
  }

  /**
   * The set of accounts that will be under the billing group.
   *
   * The set of accounts resemble the linked accounts in a consolidated billing family.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-billinggroup-accountgrouping.html
   */
  export interface AccountGroupingProperty {
    /**
     * Specifies if this billing group will automatically associate newly added AWS accounts that join your consolidated billing family.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-billinggroup-accountgrouping.html#cfn-billingconductor-billinggroup-accountgrouping-autoassociate
     */
    readonly autoAssociate?: boolean | cdk.IResolvable;

    /**
     * The account IDs that make up the billing group.
     *
     * Account IDs must be a part of the consolidated billing family, and not associated with another billing group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-billinggroup-accountgrouping.html#cfn-billingconductor-billinggroup-accountgrouping-linkedaccountids
     */
    readonly linkedAccountIds: Array<string>;
  }
}

/**
 * Properties for defining a `CfnBillingGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-billinggroup.html
 */
export interface CfnBillingGroupProps {
  /**
   * The set of accounts that will be under the billing group.
   *
   * The set of accounts resemble the linked accounts in a consolidated billing family.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-billinggroup.html#cfn-billingconductor-billinggroup-accountgrouping
   */
  readonly accountGrouping: CfnBillingGroup.AccountGroupingProperty | cdk.IResolvable;

  /**
   * The preferences and settings that will be used to compute the AWS charges for a billing group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-billinggroup.html#cfn-billingconductor-billinggroup-computationpreference
   */
  readonly computationPreference: CfnBillingGroup.ComputationPreferenceProperty | cdk.IResolvable;

  /**
   * The description of the billing group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-billinggroup.html#cfn-billingconductor-billinggroup-description
   */
  readonly description?: string;

  /**
   * The billing group's name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-billinggroup.html#cfn-billingconductor-billinggroup-name
   */
  readonly name: string;

  /**
   * The account ID that serves as the main account in a billing group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-billinggroup.html#cfn-billingconductor-billinggroup-primaryaccountid
   */
  readonly primaryAccountId: string;

  /**
   * A map that contains tag keys and tag values that are attached to a billing group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-billinggroup.html#cfn-billingconductor-billinggroup-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `ComputationPreferenceProperty`
 *
 * @param properties - the TypeScript properties of a `ComputationPreferenceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBillingGroupComputationPreferencePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("pricingPlanArn", cdk.requiredValidator)(properties.pricingPlanArn));
  errors.collect(cdk.propertyValidator("pricingPlanArn", cdk.validateString)(properties.pricingPlanArn));
  return errors.wrap("supplied properties not correct for \"ComputationPreferenceProperty\"");
}

// @ts-ignore TS6133
function convertCfnBillingGroupComputationPreferencePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBillingGroupComputationPreferencePropertyValidator(properties).assertSuccess();
  return {
    "PricingPlanArn": cdk.stringToCloudFormation(properties.pricingPlanArn)
  };
}

// @ts-ignore TS6133
function CfnBillingGroupComputationPreferencePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBillingGroup.ComputationPreferenceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBillingGroup.ComputationPreferenceProperty>();
  ret.addPropertyResult("pricingPlanArn", "PricingPlanArn", (properties.PricingPlanArn != null ? cfn_parse.FromCloudFormation.getString(properties.PricingPlanArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AccountGroupingProperty`
 *
 * @param properties - the TypeScript properties of a `AccountGroupingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBillingGroupAccountGroupingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoAssociate", cdk.validateBoolean)(properties.autoAssociate));
  errors.collect(cdk.propertyValidator("linkedAccountIds", cdk.requiredValidator)(properties.linkedAccountIds));
  errors.collect(cdk.propertyValidator("linkedAccountIds", cdk.listValidator(cdk.validateString))(properties.linkedAccountIds));
  return errors.wrap("supplied properties not correct for \"AccountGroupingProperty\"");
}

// @ts-ignore TS6133
function convertCfnBillingGroupAccountGroupingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBillingGroupAccountGroupingPropertyValidator(properties).assertSuccess();
  return {
    "AutoAssociate": cdk.booleanToCloudFormation(properties.autoAssociate),
    "LinkedAccountIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.linkedAccountIds)
  };
}

// @ts-ignore TS6133
function CfnBillingGroupAccountGroupingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBillingGroup.AccountGroupingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBillingGroup.AccountGroupingProperty>();
  ret.addPropertyResult("autoAssociate", "AutoAssociate", (properties.AutoAssociate != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoAssociate) : undefined));
  ret.addPropertyResult("linkedAccountIds", "LinkedAccountIds", (properties.LinkedAccountIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.LinkedAccountIds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnBillingGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnBillingGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBillingGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accountGrouping", cdk.requiredValidator)(properties.accountGrouping));
  errors.collect(cdk.propertyValidator("accountGrouping", CfnBillingGroupAccountGroupingPropertyValidator)(properties.accountGrouping));
  errors.collect(cdk.propertyValidator("computationPreference", cdk.requiredValidator)(properties.computationPreference));
  errors.collect(cdk.propertyValidator("computationPreference", CfnBillingGroupComputationPreferencePropertyValidator)(properties.computationPreference));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("primaryAccountId", cdk.requiredValidator)(properties.primaryAccountId));
  errors.collect(cdk.propertyValidator("primaryAccountId", cdk.validateString)(properties.primaryAccountId));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnBillingGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnBillingGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBillingGroupPropsValidator(properties).assertSuccess();
  return {
    "AccountGrouping": convertCfnBillingGroupAccountGroupingPropertyToCloudFormation(properties.accountGrouping),
    "ComputationPreference": convertCfnBillingGroupComputationPreferencePropertyToCloudFormation(properties.computationPreference),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "PrimaryAccountId": cdk.stringToCloudFormation(properties.primaryAccountId),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnBillingGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBillingGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBillingGroupProps>();
  ret.addPropertyResult("accountGrouping", "AccountGrouping", (properties.AccountGrouping != null ? CfnBillingGroupAccountGroupingPropertyFromCloudFormation(properties.AccountGrouping) : undefined));
  ret.addPropertyResult("computationPreference", "ComputationPreference", (properties.ComputationPreference != null ? CfnBillingGroupComputationPreferencePropertyFromCloudFormation(properties.ComputationPreference) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("primaryAccountId", "PrimaryAccountId", (properties.PrimaryAccountId != null ? cfn_parse.FromCloudFormation.getString(properties.PrimaryAccountId) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a custom line item that can be used to create a one-time or recurring, fixed or percentage-based charge that you can apply to a single billing group.
 *
 * You can apply custom line items to the current or previous billing period. You can create either a fee or a discount custom line item.
 *
 * @cloudformationResource AWS::BillingConductor::CustomLineItem
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-customlineitem.html
 */
export class CfnCustomLineItem extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::BillingConductor::CustomLineItem";

  /**
   * Build a CfnCustomLineItem from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCustomLineItem {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnCustomLineItemPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCustomLineItem(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) that references the billing group where the custom line item applies to.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The number of resources that are associated to the custom line item.
   *
   * @cloudformationAttribute AssociationSize
   */
  public readonly attrAssociationSize: number;

  /**
   * The time created.
   *
   * @cloudformationAttribute CreationTime
   */
  public readonly attrCreationTime: number;

  /**
   * The custom line item's charge value currency. Only one of the valid values can be used.
   *
   * @cloudformationAttribute CurrencyCode
   */
  public readonly attrCurrencyCode: string;

  /**
   * The most recent time the custom line item was modified.
   *
   * @cloudformationAttribute LastModifiedTime
   */
  public readonly attrLastModifiedTime: number;

  /**
   * The product code associated with the custom line item.
   *
   * @cloudformationAttribute ProductCode
   */
  public readonly attrProductCode: string;

  /**
   * The AWS account in which this custom line item will be applied to.
   */
  public accountId?: string;

  /**
   * The Amazon Resource Name (ARN) that references the billing group where the custom line item applies to.
   */
  public billingGroupArn: string;

  /**
   * A time range for which the custom line item is effective.
   */
  public billingPeriodRange?: CfnCustomLineItem.BillingPeriodRangeProperty | cdk.IResolvable;

  /**
   * The charge details of a custom line item.
   */
  public customLineItemChargeDetails?: CfnCustomLineItem.CustomLineItemChargeDetailsProperty | cdk.IResolvable;

  /**
   * The custom line item's description.
   */
  public description?: string;

  /**
   * The custom line item's name.
   */
  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A map that contains tag keys and tag values that are attached to a custom line item.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCustomLineItemProps) {
    super(scope, id, {
      "type": CfnCustomLineItem.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "billingGroupArn", this);
    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrAssociationSize = cdk.Token.asNumber(this.getAtt("AssociationSize", cdk.ResolutionTypeHint.NUMBER));
    this.attrCreationTime = cdk.Token.asNumber(this.getAtt("CreationTime", cdk.ResolutionTypeHint.NUMBER));
    this.attrCurrencyCode = cdk.Token.asString(this.getAtt("CurrencyCode", cdk.ResolutionTypeHint.STRING));
    this.attrLastModifiedTime = cdk.Token.asNumber(this.getAtt("LastModifiedTime", cdk.ResolutionTypeHint.NUMBER));
    this.attrProductCode = cdk.Token.asString(this.getAtt("ProductCode", cdk.ResolutionTypeHint.STRING));
    this.accountId = props.accountId;
    this.billingGroupArn = props.billingGroupArn;
    this.billingPeriodRange = props.billingPeriodRange;
    this.customLineItemChargeDetails = props.customLineItemChargeDetails;
    this.description = props.description;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::BillingConductor::CustomLineItem", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accountId": this.accountId,
      "billingGroupArn": this.billingGroupArn,
      "billingPeriodRange": this.billingPeriodRange,
      "customLineItemChargeDetails": this.customLineItemChargeDetails,
      "description": this.description,
      "name": this.name,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCustomLineItem.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCustomLineItemPropsToCloudFormation(props);
  }
}

export namespace CfnCustomLineItem {
  /**
   * The billing period range in which the custom line item request will be applied.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-billingperiodrange.html
   */
  export interface BillingPeriodRangeProperty {
    /**
     * The exclusive end billing period that defines a billing period range where a custom line is applied.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-billingperiodrange.html#cfn-billingconductor-customlineitem-billingperiodrange-exclusiveendbillingperiod
     */
    readonly exclusiveEndBillingPeriod?: string;

    /**
     * The inclusive start billing period that defines a billing period range where a custom line is applied.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-billingperiodrange.html#cfn-billingconductor-customlineitem-billingperiodrange-inclusivestartbillingperiod
     */
    readonly inclusiveStartBillingPeriod?: string;
  }

  /**
   * The charge details of a custom line item.
   *
   * It should contain only one of `Flat` or `Percentage` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-customlineitemchargedetails.html
   */
  export interface CustomLineItemChargeDetailsProperty {
    /**
     * A `CustomLineItemFlatChargeDetails` that describes the charge details of a flat custom line item.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-customlineitemchargedetails.html#cfn-billingconductor-customlineitem-customlineitemchargedetails-flat
     */
    readonly flat?: CfnCustomLineItem.CustomLineItemFlatChargeDetailsProperty | cdk.IResolvable;

    /**
     * A representation of the line item filter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-customlineitemchargedetails.html#cfn-billingconductor-customlineitem-customlineitemchargedetails-lineitemfilters
     */
    readonly lineItemFilters?: Array<cdk.IResolvable | CfnCustomLineItem.LineItemFilterProperty> | cdk.IResolvable;

    /**
     * A `CustomLineItemPercentageChargeDetails` that describes the charge details of a percentage custom line item.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-customlineitemchargedetails.html#cfn-billingconductor-customlineitem-customlineitemchargedetails-percentage
     */
    readonly percentage?: CfnCustomLineItem.CustomLineItemPercentageChargeDetailsProperty | cdk.IResolvable;

    /**
     * The type of the custom line item that indicates whether the charge is a fee or credit.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-customlineitemchargedetails.html#cfn-billingconductor-customlineitem-customlineitemchargedetails-type
     */
    readonly type: string;
  }

  /**
   * A representation of the line item filter for your custom line item.
   *
   * You can use line item filters to include or exclude specific resource values from the billing group's total cost. For example, if you create a custom line item and you want to filter out a value, such as Savings Plan discounts, you can update `LineItemFilter` to exclude it.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-lineitemfilter.html
   */
  export interface LineItemFilterProperty {
    /**
     * The attribute of the line item filter.
     *
     * This specifies what attribute that you can filter on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-lineitemfilter.html#cfn-billingconductor-customlineitem-lineitemfilter-attribute
     */
    readonly attribute: string;

    /**
     * The match criteria of the line item filter.
     *
     * This parameter specifies whether not to include the resource value from the billing group total cost.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-lineitemfilter.html#cfn-billingconductor-customlineitem-lineitemfilter-matchoption
     */
    readonly matchOption: string;

    /**
     * The values of the line item filter.
     *
     * This specifies the values to filter on. Currently, you can only exclude Savings Plan discounts.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-lineitemfilter.html#cfn-billingconductor-customlineitem-lineitemfilter-values
     */
    readonly values: Array<string>;
  }

  /**
   * A representation of the charge details associated with a percentage custom line item.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-customlineitempercentagechargedetails.html
   */
  export interface CustomLineItemPercentageChargeDetailsProperty {
    /**
     * A list of resource ARNs to associate to the percentage custom line item.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-customlineitempercentagechargedetails.html#cfn-billingconductor-customlineitem-customlineitempercentagechargedetails-childassociatedresources
     */
    readonly childAssociatedResources?: Array<string>;

    /**
     * The custom line item's percentage value.
     *
     * This will be multiplied against the combined value of its associated resources to determine its charge value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-customlineitempercentagechargedetails.html#cfn-billingconductor-customlineitem-customlineitempercentagechargedetails-percentagevalue
     */
    readonly percentageValue: number;
  }

  /**
   * The charge details of a custom line item.
   *
   * It should contain only one of `Flat` or `Percentage` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-customlineitemflatchargedetails.html
   */
  export interface CustomLineItemFlatChargeDetailsProperty {
    /**
     * The custom line item's fixed charge value in USD.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-customlineitem-customlineitemflatchargedetails.html#cfn-billingconductor-customlineitem-customlineitemflatchargedetails-chargevalue
     */
    readonly chargeValue: number;
  }
}

/**
 * Properties for defining a `CfnCustomLineItem`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-customlineitem.html
 */
export interface CfnCustomLineItemProps {
  /**
   * The AWS account in which this custom line item will be applied to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-customlineitem.html#cfn-billingconductor-customlineitem-accountid
   */
  readonly accountId?: string;

  /**
   * The Amazon Resource Name (ARN) that references the billing group where the custom line item applies to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-customlineitem.html#cfn-billingconductor-customlineitem-billinggrouparn
   */
  readonly billingGroupArn: string;

  /**
   * A time range for which the custom line item is effective.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-customlineitem.html#cfn-billingconductor-customlineitem-billingperiodrange
   */
  readonly billingPeriodRange?: CfnCustomLineItem.BillingPeriodRangeProperty | cdk.IResolvable;

  /**
   * The charge details of a custom line item.
   *
   * It should contain only one of `Flat` or `Percentage` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-customlineitem.html#cfn-billingconductor-customlineitem-customlineitemchargedetails
   */
  readonly customLineItemChargeDetails?: CfnCustomLineItem.CustomLineItemChargeDetailsProperty | cdk.IResolvable;

  /**
   * The custom line item's description.
   *
   * This is shown on the Bills page in association with the charge value.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-customlineitem.html#cfn-billingconductor-customlineitem-description
   */
  readonly description?: string;

  /**
   * The custom line item's name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-customlineitem.html#cfn-billingconductor-customlineitem-name
   */
  readonly name: string;

  /**
   * A map that contains tag keys and tag values that are attached to a custom line item.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-customlineitem.html#cfn-billingconductor-customlineitem-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `BillingPeriodRangeProperty`
 *
 * @param properties - the TypeScript properties of a `BillingPeriodRangeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCustomLineItemBillingPeriodRangePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("exclusiveEndBillingPeriod", cdk.validateString)(properties.exclusiveEndBillingPeriod));
  errors.collect(cdk.propertyValidator("inclusiveStartBillingPeriod", cdk.validateString)(properties.inclusiveStartBillingPeriod));
  return errors.wrap("supplied properties not correct for \"BillingPeriodRangeProperty\"");
}

// @ts-ignore TS6133
function convertCfnCustomLineItemBillingPeriodRangePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCustomLineItemBillingPeriodRangePropertyValidator(properties).assertSuccess();
  return {
    "ExclusiveEndBillingPeriod": cdk.stringToCloudFormation(properties.exclusiveEndBillingPeriod),
    "InclusiveStartBillingPeriod": cdk.stringToCloudFormation(properties.inclusiveStartBillingPeriod)
  };
}

// @ts-ignore TS6133
function CfnCustomLineItemBillingPeriodRangePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCustomLineItem.BillingPeriodRangeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCustomLineItem.BillingPeriodRangeProperty>();
  ret.addPropertyResult("exclusiveEndBillingPeriod", "ExclusiveEndBillingPeriod", (properties.ExclusiveEndBillingPeriod != null ? cfn_parse.FromCloudFormation.getString(properties.ExclusiveEndBillingPeriod) : undefined));
  ret.addPropertyResult("inclusiveStartBillingPeriod", "InclusiveStartBillingPeriod", (properties.InclusiveStartBillingPeriod != null ? cfn_parse.FromCloudFormation.getString(properties.InclusiveStartBillingPeriod) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LineItemFilterProperty`
 *
 * @param properties - the TypeScript properties of a `LineItemFilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCustomLineItemLineItemFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attribute", cdk.requiredValidator)(properties.attribute));
  errors.collect(cdk.propertyValidator("attribute", cdk.validateString)(properties.attribute));
  errors.collect(cdk.propertyValidator("matchOption", cdk.requiredValidator)(properties.matchOption));
  errors.collect(cdk.propertyValidator("matchOption", cdk.validateString)(properties.matchOption));
  errors.collect(cdk.propertyValidator("values", cdk.requiredValidator)(properties.values));
  errors.collect(cdk.propertyValidator("values", cdk.listValidator(cdk.validateString))(properties.values));
  return errors.wrap("supplied properties not correct for \"LineItemFilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnCustomLineItemLineItemFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCustomLineItemLineItemFilterPropertyValidator(properties).assertSuccess();
  return {
    "Attribute": cdk.stringToCloudFormation(properties.attribute),
    "MatchOption": cdk.stringToCloudFormation(properties.matchOption),
    "Values": cdk.listMapper(cdk.stringToCloudFormation)(properties.values)
  };
}

// @ts-ignore TS6133
function CfnCustomLineItemLineItemFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCustomLineItem.LineItemFilterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCustomLineItem.LineItemFilterProperty>();
  ret.addPropertyResult("attribute", "Attribute", (properties.Attribute != null ? cfn_parse.FromCloudFormation.getString(properties.Attribute) : undefined));
  ret.addPropertyResult("matchOption", "MatchOption", (properties.MatchOption != null ? cfn_parse.FromCloudFormation.getString(properties.MatchOption) : undefined));
  ret.addPropertyResult("values", "Values", (properties.Values != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Values) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomLineItemPercentageChargeDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `CustomLineItemPercentageChargeDetailsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCustomLineItemCustomLineItemPercentageChargeDetailsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("childAssociatedResources", cdk.listValidator(cdk.validateString))(properties.childAssociatedResources));
  errors.collect(cdk.propertyValidator("percentageValue", cdk.requiredValidator)(properties.percentageValue));
  errors.collect(cdk.propertyValidator("percentageValue", cdk.validateNumber)(properties.percentageValue));
  return errors.wrap("supplied properties not correct for \"CustomLineItemPercentageChargeDetailsProperty\"");
}

// @ts-ignore TS6133
function convertCfnCustomLineItemCustomLineItemPercentageChargeDetailsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCustomLineItemCustomLineItemPercentageChargeDetailsPropertyValidator(properties).assertSuccess();
  return {
    "ChildAssociatedResources": cdk.listMapper(cdk.stringToCloudFormation)(properties.childAssociatedResources),
    "PercentageValue": cdk.numberToCloudFormation(properties.percentageValue)
  };
}

// @ts-ignore TS6133
function CfnCustomLineItemCustomLineItemPercentageChargeDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCustomLineItem.CustomLineItemPercentageChargeDetailsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCustomLineItem.CustomLineItemPercentageChargeDetailsProperty>();
  ret.addPropertyResult("childAssociatedResources", "ChildAssociatedResources", (properties.ChildAssociatedResources != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ChildAssociatedResources) : undefined));
  ret.addPropertyResult("percentageValue", "PercentageValue", (properties.PercentageValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.PercentageValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomLineItemFlatChargeDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `CustomLineItemFlatChargeDetailsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCustomLineItemCustomLineItemFlatChargeDetailsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("chargeValue", cdk.requiredValidator)(properties.chargeValue));
  errors.collect(cdk.propertyValidator("chargeValue", cdk.validateNumber)(properties.chargeValue));
  return errors.wrap("supplied properties not correct for \"CustomLineItemFlatChargeDetailsProperty\"");
}

// @ts-ignore TS6133
function convertCfnCustomLineItemCustomLineItemFlatChargeDetailsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCustomLineItemCustomLineItemFlatChargeDetailsPropertyValidator(properties).assertSuccess();
  return {
    "ChargeValue": cdk.numberToCloudFormation(properties.chargeValue)
  };
}

// @ts-ignore TS6133
function CfnCustomLineItemCustomLineItemFlatChargeDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCustomLineItem.CustomLineItemFlatChargeDetailsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCustomLineItem.CustomLineItemFlatChargeDetailsProperty>();
  ret.addPropertyResult("chargeValue", "ChargeValue", (properties.ChargeValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.ChargeValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomLineItemChargeDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `CustomLineItemChargeDetailsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCustomLineItemCustomLineItemChargeDetailsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("flat", CfnCustomLineItemCustomLineItemFlatChargeDetailsPropertyValidator)(properties.flat));
  errors.collect(cdk.propertyValidator("lineItemFilters", cdk.listValidator(CfnCustomLineItemLineItemFilterPropertyValidator))(properties.lineItemFilters));
  errors.collect(cdk.propertyValidator("percentage", CfnCustomLineItemCustomLineItemPercentageChargeDetailsPropertyValidator)(properties.percentage));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CustomLineItemChargeDetailsProperty\"");
}

// @ts-ignore TS6133
function convertCfnCustomLineItemCustomLineItemChargeDetailsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCustomLineItemCustomLineItemChargeDetailsPropertyValidator(properties).assertSuccess();
  return {
    "Flat": convertCfnCustomLineItemCustomLineItemFlatChargeDetailsPropertyToCloudFormation(properties.flat),
    "LineItemFilters": cdk.listMapper(convertCfnCustomLineItemLineItemFilterPropertyToCloudFormation)(properties.lineItemFilters),
    "Percentage": convertCfnCustomLineItemCustomLineItemPercentageChargeDetailsPropertyToCloudFormation(properties.percentage),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnCustomLineItemCustomLineItemChargeDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCustomLineItem.CustomLineItemChargeDetailsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCustomLineItem.CustomLineItemChargeDetailsProperty>();
  ret.addPropertyResult("flat", "Flat", (properties.Flat != null ? CfnCustomLineItemCustomLineItemFlatChargeDetailsPropertyFromCloudFormation(properties.Flat) : undefined));
  ret.addPropertyResult("lineItemFilters", "LineItemFilters", (properties.LineItemFilters != null ? cfn_parse.FromCloudFormation.getArray(CfnCustomLineItemLineItemFilterPropertyFromCloudFormation)(properties.LineItemFilters) : undefined));
  ret.addPropertyResult("percentage", "Percentage", (properties.Percentage != null ? CfnCustomLineItemCustomLineItemPercentageChargeDetailsPropertyFromCloudFormation(properties.Percentage) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnCustomLineItemProps`
 *
 * @param properties - the TypeScript properties of a `CfnCustomLineItemProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCustomLineItemPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accountId", cdk.validateString)(properties.accountId));
  errors.collect(cdk.propertyValidator("billingGroupArn", cdk.requiredValidator)(properties.billingGroupArn));
  errors.collect(cdk.propertyValidator("billingGroupArn", cdk.validateString)(properties.billingGroupArn));
  errors.collect(cdk.propertyValidator("billingPeriodRange", CfnCustomLineItemBillingPeriodRangePropertyValidator)(properties.billingPeriodRange));
  errors.collect(cdk.propertyValidator("customLineItemChargeDetails", CfnCustomLineItemCustomLineItemChargeDetailsPropertyValidator)(properties.customLineItemChargeDetails));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnCustomLineItemProps\"");
}

// @ts-ignore TS6133
function convertCfnCustomLineItemPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCustomLineItemPropsValidator(properties).assertSuccess();
  return {
    "AccountId": cdk.stringToCloudFormation(properties.accountId),
    "BillingGroupArn": cdk.stringToCloudFormation(properties.billingGroupArn),
    "BillingPeriodRange": convertCfnCustomLineItemBillingPeriodRangePropertyToCloudFormation(properties.billingPeriodRange),
    "CustomLineItemChargeDetails": convertCfnCustomLineItemCustomLineItemChargeDetailsPropertyToCloudFormation(properties.customLineItemChargeDetails),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnCustomLineItemPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCustomLineItemProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCustomLineItemProps>();
  ret.addPropertyResult("accountId", "AccountId", (properties.AccountId != null ? cfn_parse.FromCloudFormation.getString(properties.AccountId) : undefined));
  ret.addPropertyResult("billingGroupArn", "BillingGroupArn", (properties.BillingGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.BillingGroupArn) : undefined));
  ret.addPropertyResult("billingPeriodRange", "BillingPeriodRange", (properties.BillingPeriodRange != null ? CfnCustomLineItemBillingPeriodRangePropertyFromCloudFormation(properties.BillingPeriodRange) : undefined));
  ret.addPropertyResult("customLineItemChargeDetails", "CustomLineItemChargeDetails", (properties.CustomLineItemChargeDetails != null ? CfnCustomLineItemCustomLineItemChargeDetailsPropertyFromCloudFormation(properties.CustomLineItemChargeDetails) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a pricing plan that is used for computing AWS charges for billing groups.
 *
 * @cloudformationResource AWS::BillingConductor::PricingPlan
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingplan.html
 */
export class CfnPricingPlan extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::BillingConductor::PricingPlan";

  /**
   * Build a CfnPricingPlan from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPricingPlan {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPricingPlanPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPricingPlan(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the created pricing plan.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The time the pricing plan was created.
   *
   * @cloudformationAttribute CreationTime
   */
  public readonly attrCreationTime: number;

  /**
   * The most recent time the pricing plan was modified.
   *
   * @cloudformationAttribute LastModifiedTime
   */
  public readonly attrLastModifiedTime: number;

  /**
   * The pricing rules count currently associated with this pricing plan list element.
   *
   * @cloudformationAttribute Size
   */
  public readonly attrSize: number;

  /**
   * The pricing plan description.
   */
  public description?: string;

  /**
   * The name of a pricing plan.
   */
  public name: string;

  /**
   * The `PricingRuleArns` that are associated with the Pricing Plan.
   */
  public pricingRuleArns?: Array<string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A map that contains tag keys and tag values that are attached to a pricing plan.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPricingPlanProps) {
    super(scope, id, {
      "type": CfnPricingPlan.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreationTime = cdk.Token.asNumber(this.getAtt("CreationTime", cdk.ResolutionTypeHint.NUMBER));
    this.attrLastModifiedTime = cdk.Token.asNumber(this.getAtt("LastModifiedTime", cdk.ResolutionTypeHint.NUMBER));
    this.attrSize = cdk.Token.asNumber(this.getAtt("Size", cdk.ResolutionTypeHint.NUMBER));
    this.description = props.description;
    this.name = props.name;
    this.pricingRuleArns = props.pricingRuleArns;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::BillingConductor::PricingPlan", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "name": this.name,
      "pricingRuleArns": this.pricingRuleArns,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPricingPlan.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPricingPlanPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnPricingPlan`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingplan.html
 */
export interface CfnPricingPlanProps {
  /**
   * The pricing plan description.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingplan.html#cfn-billingconductor-pricingplan-description
   */
  readonly description?: string;

  /**
   * The name of a pricing plan.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingplan.html#cfn-billingconductor-pricingplan-name
   */
  readonly name: string;

  /**
   * The `PricingRuleArns` that are associated with the Pricing Plan.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingplan.html#cfn-billingconductor-pricingplan-pricingrulearns
   */
  readonly pricingRuleArns?: Array<string>;

  /**
   * A map that contains tag keys and tag values that are attached to a pricing plan.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingplan.html#cfn-billingconductor-pricingplan-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnPricingPlanProps`
 *
 * @param properties - the TypeScript properties of a `CfnPricingPlanProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPricingPlanPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("pricingRuleArns", cdk.listValidator(cdk.validateString))(properties.pricingRuleArns));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnPricingPlanProps\"");
}

// @ts-ignore TS6133
function convertCfnPricingPlanPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPricingPlanPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "PricingRuleArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.pricingRuleArns),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnPricingPlanPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPricingPlanProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPricingPlanProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("pricingRuleArns", "PricingRuleArns", (properties.PricingRuleArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.PricingRuleArns) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a pricing rule which can be associated with a pricing plan, or a set of pricing plans.
 *
 * @cloudformationResource AWS::BillingConductor::PricingRule
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html
 */
export class CfnPricingRule extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::BillingConductor::PricingRule";

  /**
   * Build a CfnPricingRule from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPricingRule {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPricingRulePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPricingRule(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) used to uniquely identify a pricing rule.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The pricing plans count that this pricing rule is associated with.
   *
   * @cloudformationAttribute AssociatedPricingPlanCount
   */
  public readonly attrAssociatedPricingPlanCount: number;

  /**
   * The time the pricing rule was created.
   *
   * @cloudformationAttribute CreationTime
   */
  public readonly attrCreationTime: number;

  /**
   * The most recent time the pricing rule was modified.
   *
   * @cloudformationAttribute LastModifiedTime
   */
  public readonly attrLastModifiedTime: number;

  /**
   * The seller of services provided by AWS , their affiliates, or third-party providers selling services via AWS Marketplace .
   */
  public billingEntity?: string;

  /**
   * The pricing rule description.
   */
  public description?: string;

  /**
   * A percentage modifier applied on the public pricing rates.
   */
  public modifierPercentage?: number;

  /**
   * The name of a pricing rule.
   */
  public name: string;

  /**
   * Operation is the specific AWS action covered by this line item.
   */
  public operation?: string;

  /**
   * The scope of pricing rule that indicates if it's globally applicable or service-specific.
   */
  public scope: string;

  /**
   * If the `Scope` attribute is `SERVICE` , this attribute indicates which service the `PricingRule` is applicable for.
   */
  public service?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A map that contains tag keys and tag values that are attached to a pricing rule.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The set of tiering configurations for the pricing rule.
   */
  public tiering?: cdk.IResolvable | CfnPricingRule.TieringProperty;

  /**
   * The type of pricing rule.
   */
  public type: string;

  /**
   * Usage Type is the unit that each service uses to measure the usage of a specific type of resource.
   */
  public usageType?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPricingRuleProps) {
    super(scope, id, {
      "type": CfnPricingRule.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "scope", this);
    cdk.requireProperty(props, "type", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrAssociatedPricingPlanCount = cdk.Token.asNumber(this.getAtt("AssociatedPricingPlanCount", cdk.ResolutionTypeHint.NUMBER));
    this.attrCreationTime = cdk.Token.asNumber(this.getAtt("CreationTime", cdk.ResolutionTypeHint.NUMBER));
    this.attrLastModifiedTime = cdk.Token.asNumber(this.getAtt("LastModifiedTime", cdk.ResolutionTypeHint.NUMBER));
    this.billingEntity = props.billingEntity;
    this.description = props.description;
    this.modifierPercentage = props.modifierPercentage;
    this.name = props.name;
    this.operation = props.operation;
    this.scope = props.scope;
    this.service = props.service;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::BillingConductor::PricingRule", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.tiering = props.tiering;
    this.type = props.type;
    this.usageType = props.usageType;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "billingEntity": this.billingEntity,
      "description": this.description,
      "modifierPercentage": this.modifierPercentage,
      "name": this.name,
      "operation": this.operation,
      "scope": this.scope,
      "service": this.service,
      "tags": this.tags.renderTags(),
      "tiering": this.tiering,
      "type": this.type,
      "usageType": this.usageType
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPricingRule.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPricingRulePropsToCloudFormation(props);
  }
}

export namespace CfnPricingRule {
  /**
   * The set of tiering configurations for the pricing rule.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-pricingrule-tiering.html
   */
  export interface TieringProperty {
    /**
     * The possible AWS Free Tier configurations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-pricingrule-tiering.html#cfn-billingconductor-pricingrule-tiering-freetier
     */
    readonly freeTier?: CfnPricingRule.FreeTierProperty | cdk.IResolvable;
  }

  /**
   * The possible AWS Free Tier configurations.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-pricingrule-freetier.html
   */
  export interface FreeTierProperty {
    /**
     * Activate or deactivate AWS Free Tier.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-billingconductor-pricingrule-freetier.html#cfn-billingconductor-pricingrule-freetier-activated
     */
    readonly activated: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnPricingRule`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html
 */
export interface CfnPricingRuleProps {
  /**
   * The seller of services provided by AWS , their affiliates, or third-party providers selling services via AWS Marketplace .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-billingentity
   */
  readonly billingEntity?: string;

  /**
   * The pricing rule description.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-description
   */
  readonly description?: string;

  /**
   * A percentage modifier applied on the public pricing rates.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-modifierpercentage
   */
  readonly modifierPercentage?: number;

  /**
   * The name of a pricing rule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-name
   */
  readonly name: string;

  /**
   * Operation is the specific AWS action covered by this line item.
   *
   * This describes the specific usage of the line item.
   *
   * If the `Scope` attribute is set to `SKU` , this attribute indicates which operation the `PricingRule` is modifying. For example, a value of `RunInstances:0202` indicates the operation of running an Amazon EC2 instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-operation
   */
  readonly operation?: string;

  /**
   * The scope of pricing rule that indicates if it's globally applicable or service-specific.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-scope
   */
  readonly scope: string;

  /**
   * If the `Scope` attribute is `SERVICE` , this attribute indicates which service the `PricingRule` is applicable for.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-service
   */
  readonly service?: string;

  /**
   * A map that contains tag keys and tag values that are attached to a pricing rule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The set of tiering configurations for the pricing rule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-tiering
   */
  readonly tiering?: cdk.IResolvable | CfnPricingRule.TieringProperty;

  /**
   * The type of pricing rule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-type
   */
  readonly type: string;

  /**
   * Usage Type is the unit that each service uses to measure the usage of a specific type of resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-billingconductor-pricingrule.html#cfn-billingconductor-pricingrule-usagetype
   */
  readonly usageType?: string;
}

/**
 * Determine whether the given properties match those of a `FreeTierProperty`
 *
 * @param properties - the TypeScript properties of a `FreeTierProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPricingRuleFreeTierPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("activated", cdk.requiredValidator)(properties.activated));
  errors.collect(cdk.propertyValidator("activated", cdk.validateBoolean)(properties.activated));
  return errors.wrap("supplied properties not correct for \"FreeTierProperty\"");
}

// @ts-ignore TS6133
function convertCfnPricingRuleFreeTierPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPricingRuleFreeTierPropertyValidator(properties).assertSuccess();
  return {
    "Activated": cdk.booleanToCloudFormation(properties.activated)
  };
}

// @ts-ignore TS6133
function CfnPricingRuleFreeTierPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPricingRule.FreeTierProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPricingRule.FreeTierProperty>();
  ret.addPropertyResult("activated", "Activated", (properties.Activated != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Activated) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TieringProperty`
 *
 * @param properties - the TypeScript properties of a `TieringProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPricingRuleTieringPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("freeTier", CfnPricingRuleFreeTierPropertyValidator)(properties.freeTier));
  return errors.wrap("supplied properties not correct for \"TieringProperty\"");
}

// @ts-ignore TS6133
function convertCfnPricingRuleTieringPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPricingRuleTieringPropertyValidator(properties).assertSuccess();
  return {
    "FreeTier": convertCfnPricingRuleFreeTierPropertyToCloudFormation(properties.freeTier)
  };
}

// @ts-ignore TS6133
function CfnPricingRuleTieringPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPricingRule.TieringProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPricingRule.TieringProperty>();
  ret.addPropertyResult("freeTier", "FreeTier", (properties.FreeTier != null ? CfnPricingRuleFreeTierPropertyFromCloudFormation(properties.FreeTier) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnPricingRuleProps`
 *
 * @param properties - the TypeScript properties of a `CfnPricingRuleProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPricingRulePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("billingEntity", cdk.validateString)(properties.billingEntity));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("modifierPercentage", cdk.validateNumber)(properties.modifierPercentage));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("operation", cdk.validateString)(properties.operation));
  errors.collect(cdk.propertyValidator("scope", cdk.requiredValidator)(properties.scope));
  errors.collect(cdk.propertyValidator("scope", cdk.validateString)(properties.scope));
  errors.collect(cdk.propertyValidator("service", cdk.validateString)(properties.service));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("tiering", CfnPricingRuleTieringPropertyValidator)(properties.tiering));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("usageType", cdk.validateString)(properties.usageType));
  return errors.wrap("supplied properties not correct for \"CfnPricingRuleProps\"");
}

// @ts-ignore TS6133
function convertCfnPricingRulePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPricingRulePropsValidator(properties).assertSuccess();
  return {
    "BillingEntity": cdk.stringToCloudFormation(properties.billingEntity),
    "Description": cdk.stringToCloudFormation(properties.description),
    "ModifierPercentage": cdk.numberToCloudFormation(properties.modifierPercentage),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Operation": cdk.stringToCloudFormation(properties.operation),
    "Scope": cdk.stringToCloudFormation(properties.scope),
    "Service": cdk.stringToCloudFormation(properties.service),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Tiering": convertCfnPricingRuleTieringPropertyToCloudFormation(properties.tiering),
    "Type": cdk.stringToCloudFormation(properties.type),
    "UsageType": cdk.stringToCloudFormation(properties.usageType)
  };
}

// @ts-ignore TS6133
function CfnPricingRulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPricingRuleProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPricingRuleProps>();
  ret.addPropertyResult("billingEntity", "BillingEntity", (properties.BillingEntity != null ? cfn_parse.FromCloudFormation.getString(properties.BillingEntity) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("modifierPercentage", "ModifierPercentage", (properties.ModifierPercentage != null ? cfn_parse.FromCloudFormation.getNumber(properties.ModifierPercentage) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("operation", "Operation", (properties.Operation != null ? cfn_parse.FromCloudFormation.getString(properties.Operation) : undefined));
  ret.addPropertyResult("scope", "Scope", (properties.Scope != null ? cfn_parse.FromCloudFormation.getString(properties.Scope) : undefined));
  ret.addPropertyResult("service", "Service", (properties.Service != null ? cfn_parse.FromCloudFormation.getString(properties.Service) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("tiering", "Tiering", (properties.Tiering != null ? CfnPricingRuleTieringPropertyFromCloudFormation(properties.Tiering) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("usageType", "UsageType", (properties.UsageType != null ? cfn_parse.FromCloudFormation.getString(properties.UsageType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}