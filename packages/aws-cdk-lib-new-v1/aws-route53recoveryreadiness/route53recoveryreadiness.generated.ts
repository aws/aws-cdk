/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates a cell in recovery group in Amazon Route 53 Application Recovery Controller.
 *
 * A cell in Route 53 ARC represents replicas or independent units of failover in your application. It groups within it all the AWS resources that are necessary for your application to run independently. Typically, you would have define one set of resources in a primary cell and another set in a standby cell in your recovery group.
 *
 * After you set up the cells for your application, you can create readiness checks in Route 53 ARC to continually audit readiness for AWS resource quotas, capacity, network routing policies, and other predefined rules.
 *
 * You can set up notifications about changes that would affect your ability to fail over to a replica and recover. However, you should make decisions about whether to fail away from or to a replica based on your monitoring and health check systems. You should consider readiness checks as a complementary service to those systems.
 *
 * Route 53 ARC Readiness supports us-east-1 and us-west-2 AWS Regions only.
 *
 * @cloudformationResource AWS::Route53RecoveryReadiness::Cell
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-cell.html
 */
export class CfnCell extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Route53RecoveryReadiness::Cell";

  /**
   * Build a CfnCell from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCell {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnCellPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCell(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the cell.
   *
   * @cloudformationAttribute CellArn
   */
  public readonly attrCellArn: string;

  /**
   * The readiness scope for the cell, which can be the Amazon Resource Name (ARN) of a cell or the ARN of a recovery group. Although this is a list, it can currently have only one element.
   *
   * @cloudformationAttribute ParentReadinessScopes
   */
  public readonly attrParentReadinessScopes: Array<string>;

  /**
   * The name of the cell to create.
   */
  public cellName?: string;

  /**
   * A list of cell Amazon Resource Names (ARNs) contained within this cell, for use in nested cells.
   */
  public cells?: Array<string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A collection of tags associated with a resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCellProps = {}) {
    super(scope, id, {
      "type": CfnCell.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrCellArn = cdk.Token.asString(this.getAtt("CellArn", cdk.ResolutionTypeHint.STRING));
    this.attrParentReadinessScopes = cdk.Token.asList(this.getAtt("ParentReadinessScopes", cdk.ResolutionTypeHint.STRING_LIST));
    this.cellName = props.cellName;
    this.cells = props.cells;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Route53RecoveryReadiness::Cell", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "cellName": this.cellName,
      "cells": this.cells,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCell.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCellPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnCell`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-cell.html
 */
export interface CfnCellProps {
  /**
   * The name of the cell to create.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-cell.html#cfn-route53recoveryreadiness-cell-cellname
   */
  readonly cellName?: string;

  /**
   * A list of cell Amazon Resource Names (ARNs) contained within this cell, for use in nested cells.
   *
   * For example, Availability Zones within specific AWS Regions .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-cell.html#cfn-route53recoveryreadiness-cell-cells
   */
  readonly cells?: Array<string>;

  /**
   * A collection of tags associated with a resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-cell.html#cfn-route53recoveryreadiness-cell-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnCellProps`
 *
 * @param properties - the TypeScript properties of a `CfnCellProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCellPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cellName", cdk.validateString)(properties.cellName));
  errors.collect(cdk.propertyValidator("cells", cdk.listValidator(cdk.validateString))(properties.cells));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnCellProps\"");
}

// @ts-ignore TS6133
function convertCfnCellPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCellPropsValidator(properties).assertSuccess();
  return {
    "CellName": cdk.stringToCloudFormation(properties.cellName),
    "Cells": cdk.listMapper(cdk.stringToCloudFormation)(properties.cells),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnCellPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCellProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCellProps>();
  ret.addPropertyResult("cellName", "CellName", (properties.CellName != null ? cfn_parse.FromCloudFormation.getString(properties.CellName) : undefined));
  ret.addPropertyResult("cells", "Cells", (properties.Cells != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Cells) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a readiness check in Amazon Route 53 Application Recovery Controller.
 *
 * A readiness check continually monitors a resource set in your application, such as a set of Amazon Aurora instances, that Route 53 ARC is auditing recovery readiness for. The audits run once every minute on every resource that's associated with a readiness check.
 *
 * Every resource type has a set of rules associated with it that Route 53 ARC uses to audit resources for readiness. For more information, see [Readiness rules descriptions](https://docs.aws.amazon.com/r53recovery/latest/dg/recovery-readiness.rules-resources.html) in the Amazon Route 53 Application Recovery Controller Developer Guide.
 *
 * Route 53 ARC Readiness supports us-east-1 and us-west-2 AWS Regions only.
 *
 * @cloudformationResource AWS::Route53RecoveryReadiness::ReadinessCheck
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-readinesscheck.html
 */
export class CfnReadinessCheck extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Route53RecoveryReadiness::ReadinessCheck";

  /**
   * Build a CfnReadinessCheck from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnReadinessCheck {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnReadinessCheckPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnReadinessCheck(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the readiness check.
   *
   * @cloudformationAttribute ReadinessCheckArn
   */
  public readonly attrReadinessCheckArn: string;

  /**
   * The name of the readiness check to create.
   */
  public readinessCheckName?: string;

  /**
   * The name of the resource set to check.
   */
  public resourceSetName?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A collection of tags associated with a resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnReadinessCheckProps = {}) {
    super(scope, id, {
      "type": CfnReadinessCheck.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrReadinessCheckArn = cdk.Token.asString(this.getAtt("ReadinessCheckArn", cdk.ResolutionTypeHint.STRING));
    this.readinessCheckName = props.readinessCheckName;
    this.resourceSetName = props.resourceSetName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Route53RecoveryReadiness::ReadinessCheck", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "readinessCheckName": this.readinessCheckName,
      "resourceSetName": this.resourceSetName,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnReadinessCheck.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnReadinessCheckPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnReadinessCheck`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-readinesscheck.html
 */
export interface CfnReadinessCheckProps {
  /**
   * The name of the readiness check to create.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-readinesscheck.html#cfn-route53recoveryreadiness-readinesscheck-readinesscheckname
   */
  readonly readinessCheckName?: string;

  /**
   * The name of the resource set to check.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-readinesscheck.html#cfn-route53recoveryreadiness-readinesscheck-resourcesetname
   */
  readonly resourceSetName?: string;

  /**
   * A collection of tags associated with a resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-readinesscheck.html#cfn-route53recoveryreadiness-readinesscheck-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnReadinessCheckProps`
 *
 * @param properties - the TypeScript properties of a `CfnReadinessCheckProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnReadinessCheckPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("readinessCheckName", cdk.validateString)(properties.readinessCheckName));
  errors.collect(cdk.propertyValidator("resourceSetName", cdk.validateString)(properties.resourceSetName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnReadinessCheckProps\"");
}

// @ts-ignore TS6133
function convertCfnReadinessCheckPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReadinessCheckPropsValidator(properties).assertSuccess();
  return {
    "ReadinessCheckName": cdk.stringToCloudFormation(properties.readinessCheckName),
    "ResourceSetName": cdk.stringToCloudFormation(properties.resourceSetName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnReadinessCheckPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReadinessCheckProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReadinessCheckProps>();
  ret.addPropertyResult("readinessCheckName", "ReadinessCheckName", (properties.ReadinessCheckName != null ? cfn_parse.FromCloudFormation.getString(properties.ReadinessCheckName) : undefined));
  ret.addPropertyResult("resourceSetName", "ResourceSetName", (properties.ResourceSetName != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceSetName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a recovery group in Amazon Route 53 Application Recovery Controller.
 *
 * A recovery group represents your application. It typically consists of two or more cells that are replicas of each other in terms of resources and functionality, so that you can fail over from one to the other, for example, from one Region to another. You create recovery groups so you can use readiness checks to audit resources in your application.
 *
 * For more information, see [Readiness checks, resource sets, and readiness scopes](https://docs.aws.amazon.com/r53recovery/latest/dg/recovery-readiness.recovery-groups.readiness-scope.html) in the Amazon Route 53 Application Recovery Controller Developer Guide.
 *
 * Route 53 ARC Readiness supports us-east-1 and us-west-2 AWS Regions only.
 *
 * @cloudformationResource AWS::Route53RecoveryReadiness::RecoveryGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-recoverygroup.html
 */
export class CfnRecoveryGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Route53RecoveryReadiness::RecoveryGroup";

  /**
   * Build a CfnRecoveryGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRecoveryGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRecoveryGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRecoveryGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the recovery group.
   *
   * @cloudformationAttribute RecoveryGroupArn
   */
  public readonly attrRecoveryGroupArn: string;

  /**
   * A list of the cell Amazon Resource Names (ARNs) in the recovery group.
   */
  public cells?: Array<string>;

  /**
   * The name of the recovery group to create.
   */
  public recoveryGroupName?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A collection of tags associated with a resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRecoveryGroupProps = {}) {
    super(scope, id, {
      "type": CfnRecoveryGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrRecoveryGroupArn = cdk.Token.asString(this.getAtt("RecoveryGroupArn", cdk.ResolutionTypeHint.STRING));
    this.cells = props.cells;
    this.recoveryGroupName = props.recoveryGroupName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Route53RecoveryReadiness::RecoveryGroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "cells": this.cells,
      "recoveryGroupName": this.recoveryGroupName,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRecoveryGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRecoveryGroupPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnRecoveryGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-recoverygroup.html
 */
export interface CfnRecoveryGroupProps {
  /**
   * A list of the cell Amazon Resource Names (ARNs) in the recovery group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-recoverygroup.html#cfn-route53recoveryreadiness-recoverygroup-cells
   */
  readonly cells?: Array<string>;

  /**
   * The name of the recovery group to create.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-recoverygroup.html#cfn-route53recoveryreadiness-recoverygroup-recoverygroupname
   */
  readonly recoveryGroupName?: string;

  /**
   * A collection of tags associated with a resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-recoverygroup.html#cfn-route53recoveryreadiness-recoverygroup-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnRecoveryGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnRecoveryGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRecoveryGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cells", cdk.listValidator(cdk.validateString))(properties.cells));
  errors.collect(cdk.propertyValidator("recoveryGroupName", cdk.validateString)(properties.recoveryGroupName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnRecoveryGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnRecoveryGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRecoveryGroupPropsValidator(properties).assertSuccess();
  return {
    "Cells": cdk.listMapper(cdk.stringToCloudFormation)(properties.cells),
    "RecoveryGroupName": cdk.stringToCloudFormation(properties.recoveryGroupName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnRecoveryGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRecoveryGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRecoveryGroupProps>();
  ret.addPropertyResult("cells", "Cells", (properties.Cells != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Cells) : undefined));
  ret.addPropertyResult("recoveryGroupName", "RecoveryGroupName", (properties.RecoveryGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.RecoveryGroupName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a resource set in Amazon Route 53 Application Recovery Controller.
 *
 * A resource set is a set of resources of one type, such as Network Load Balancers, that span multiple cells. You can associate a resource set with a readiness check to have Route 53 ARC continually monitor the resources in the set for failover readiness.
 *
 * You typically create a resource set and a readiness check for each supported type of AWS resource in your application.
 *
 * For more information, see [Readiness checks, resource sets, and readiness scopes](https://docs.aws.amazon.com/r53recovery/latest/dg/recovery-readiness.recovery-groups.readiness-scope.html) in the Amazon Route 53 Application Recovery Controller Developer Guide.
 *
 * Route 53 ARC Readiness supports us-east-1 and us-west-2 AWS Regions only.
 *
 * @cloudformationResource AWS::Route53RecoveryReadiness::ResourceSet
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-resourceset.html
 */
export class CfnResourceSet extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Route53RecoveryReadiness::ResourceSet";

  /**
   * Build a CfnResourceSet from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResourceSet {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnResourceSetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnResourceSet(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the resource set.
   *
   * @cloudformationAttribute ResourceSetArn
   */
  public readonly attrResourceSetArn: string;

  /**
   * A list of resource objects in the resource set.
   */
  public resources: Array<cdk.IResolvable | CfnResourceSet.ResourceProperty> | cdk.IResolvable;

  /**
   * The name of the resource set to create.
   */
  public resourceSetName?: string;

  /**
   * The resource type of the resources in the resource set. Enter one of the following values for resource type:.
   */
  public resourceSetType: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A tag to associate with the parameters for a resource set.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnResourceSetProps) {
    super(scope, id, {
      "type": CfnResourceSet.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "resources", this);
    cdk.requireProperty(props, "resourceSetType", this);

    this.attrResourceSetArn = cdk.Token.asString(this.getAtt("ResourceSetArn", cdk.ResolutionTypeHint.STRING));
    this.resources = props.resources;
    this.resourceSetName = props.resourceSetName;
    this.resourceSetType = props.resourceSetType;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Route53RecoveryReadiness::ResourceSet", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "resources": this.resources,
      "resourceSetName": this.resourceSetName,
      "resourceSetType": this.resourceSetType,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnResourceSet.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnResourceSetPropsToCloudFormation(props);
  }
}

export namespace CfnResourceSet {
  /**
   * The resource element of a resource set.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-resource.html
   */
  export interface ResourceProperty {
    /**
     * The component identifier of the resource, generated when DNS target resource is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-resource.html#cfn-route53recoveryreadiness-resourceset-resource-componentid
     */
    readonly componentId?: string;

    /**
     * A component for DNS/routing control readiness checks.
     *
     * This is a required setting when `ResourceSet` `ResourceSetType` is set to `AWS::Route53RecoveryReadiness::DNSTargetResource` . Do not set it for any other `ResourceSetType` setting.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-resource.html#cfn-route53recoveryreadiness-resourceset-resource-dnstargetresource
     */
    readonly dnsTargetResource?: CfnResourceSet.DNSTargetResourceProperty | cdk.IResolvable;

    /**
     * The recovery group Amazon Resource Name (ARN) or the cell ARN that the readiness checks for this resource set are scoped to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-resource.html#cfn-route53recoveryreadiness-resourceset-resource-readinessscopes
     */
    readonly readinessScopes?: Array<string>;

    /**
     * The Amazon Resource Name (ARN) of the AWS resource.
     *
     * This is a required setting for all `ResourceSet` `ResourceSetType` settings except `AWS::Route53RecoveryReadiness::DNSTargetResource` . Do not set this when `ResourceSetType` is set to `AWS::Route53RecoveryReadiness::DNSTargetResource` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-resource.html#cfn-route53recoveryreadiness-resourceset-resource-resourcearn
     */
    readonly resourceArn?: string;
  }

  /**
   * A component for DNS/routing control readiness checks and architecture checks.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-dnstargetresource.html
   */
  export interface DNSTargetResourceProperty {
    /**
     * The domain name that acts as an ingress point to a portion of the customer application.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-dnstargetresource.html#cfn-route53recoveryreadiness-resourceset-dnstargetresource-domainname
     */
    readonly domainName?: string;

    /**
     * The hosted zone Amazon Resource Name (ARN) that contains the DNS record with the provided name of the target resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-dnstargetresource.html#cfn-route53recoveryreadiness-resourceset-dnstargetresource-hostedzonearn
     */
    readonly hostedZoneArn?: string;

    /**
     * The Amazon Route 53 record set ID that uniquely identifies a DNS record, given a name and a type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-dnstargetresource.html#cfn-route53recoveryreadiness-resourceset-dnstargetresource-recordsetid
     */
    readonly recordSetId?: string;

    /**
     * The type of DNS record of the target resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-dnstargetresource.html#cfn-route53recoveryreadiness-resourceset-dnstargetresource-recordtype
     */
    readonly recordType?: string;

    /**
     * The target resource that the Route 53 record points to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-dnstargetresource.html#cfn-route53recoveryreadiness-resourceset-dnstargetresource-targetresource
     */
    readonly targetResource?: cdk.IResolvable | CfnResourceSet.TargetResourceProperty;
  }

  /**
   * The target resource that the Route 53 record points to.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-targetresource.html
   */
  export interface TargetResourceProperty {
    /**
     * The Network Load Balancer resource that a DNS target resource points to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-targetresource.html#cfn-route53recoveryreadiness-resourceset-targetresource-nlbresource
     */
    readonly nlbResource?: cdk.IResolvable | CfnResourceSet.NLBResourceProperty;

    /**
     * The Route 53 resource that a DNS target resource record points to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-targetresource.html#cfn-route53recoveryreadiness-resourceset-targetresource-r53resource
     */
    readonly r53Resource?: cdk.IResolvable | CfnResourceSet.R53ResourceRecordProperty;
  }

  /**
   * The Amazon Route 53 resource that a DNS target resource record points to.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-r53resourcerecord.html
   */
  export interface R53ResourceRecordProperty {
    /**
     * The DNS target domain name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-r53resourcerecord.html#cfn-route53recoveryreadiness-resourceset-r53resourcerecord-domainname
     */
    readonly domainName?: string;

    /**
     * The Amazon Route 53 Resource Record Set ID.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-r53resourcerecord.html#cfn-route53recoveryreadiness-resourceset-r53resourcerecord-recordsetid
     */
    readonly recordSetId?: string;
  }

  /**
   * The Network Load Balancer resource that a DNS target resource points to.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-nlbresource.html
   */
  export interface NLBResourceProperty {
    /**
     * The Network Load Balancer resource Amazon Resource Name (ARN).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-nlbresource.html#cfn-route53recoveryreadiness-resourceset-nlbresource-arn
     */
    readonly arn?: string;
  }
}

/**
 * Properties for defining a `CfnResourceSet`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-resourceset.html
 */
export interface CfnResourceSetProps {
  /**
   * A list of resource objects in the resource set.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-resourceset.html#cfn-route53recoveryreadiness-resourceset-resources
   */
  readonly resources: Array<cdk.IResolvable | CfnResourceSet.ResourceProperty> | cdk.IResolvable;

  /**
   * The name of the resource set to create.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-resourceset.html#cfn-route53recoveryreadiness-resourceset-resourcesetname
   */
  readonly resourceSetName?: string;

  /**
   * The resource type of the resources in the resource set. Enter one of the following values for resource type:.
   *
   * AWS::ApiGateway::Stage, AWS::ApiGatewayV2::Stage, AWS::AutoScaling::AutoScalingGroup, AWS::CloudWatch::Alarm, AWS::EC2::CustomerGateway, AWS::DynamoDB::Table, AWS::EC2::Volume, AWS::ElasticLoadBalancing::LoadBalancer, AWS::ElasticLoadBalancingV2::LoadBalancer, AWS::Lambda::Function, AWS::MSK::Cluster, AWS::RDS::DBCluster, AWS::Route53::HealthCheck, AWS::SQS::Queue, AWS::SNS::Topic, AWS::SNS::Subscription, AWS::EC2::VPC, AWS::EC2::VPNConnection, AWS::EC2::VPNGateway, AWS::Route53RecoveryReadiness::DNSTargetResource.
   *
   * Note that AWS::Route53RecoveryReadiness::DNSTargetResource is only used for this setting. It isn't an actual AWS CloudFormation resource type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-resourceset.html#cfn-route53recoveryreadiness-resourceset-resourcesettype
   */
  readonly resourceSetType: string;

  /**
   * A tag to associate with the parameters for a resource set.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-resourceset.html#cfn-route53recoveryreadiness-resourceset-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `R53ResourceRecordProperty`
 *
 * @param properties - the TypeScript properties of a `R53ResourceRecordProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceSetR53ResourceRecordPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("domainName", cdk.validateString)(properties.domainName));
  errors.collect(cdk.propertyValidator("recordSetId", cdk.validateString)(properties.recordSetId));
  return errors.wrap("supplied properties not correct for \"R53ResourceRecordProperty\"");
}

// @ts-ignore TS6133
function convertCfnResourceSetR53ResourceRecordPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceSetR53ResourceRecordPropertyValidator(properties).assertSuccess();
  return {
    "DomainName": cdk.stringToCloudFormation(properties.domainName),
    "RecordSetId": cdk.stringToCloudFormation(properties.recordSetId)
  };
}

// @ts-ignore TS6133
function CfnResourceSetR53ResourceRecordPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResourceSet.R53ResourceRecordProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceSet.R53ResourceRecordProperty>();
  ret.addPropertyResult("domainName", "DomainName", (properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined));
  ret.addPropertyResult("recordSetId", "RecordSetId", (properties.RecordSetId != null ? cfn_parse.FromCloudFormation.getString(properties.RecordSetId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NLBResourceProperty`
 *
 * @param properties - the TypeScript properties of a `NLBResourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceSetNLBResourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("arn", cdk.validateString)(properties.arn));
  return errors.wrap("supplied properties not correct for \"NLBResourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnResourceSetNLBResourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceSetNLBResourcePropertyValidator(properties).assertSuccess();
  return {
    "Arn": cdk.stringToCloudFormation(properties.arn)
  };
}

// @ts-ignore TS6133
function CfnResourceSetNLBResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResourceSet.NLBResourceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceSet.NLBResourceProperty>();
  ret.addPropertyResult("arn", "Arn", (properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TargetResourceProperty`
 *
 * @param properties - the TypeScript properties of a `TargetResourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceSetTargetResourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("nlbResource", CfnResourceSetNLBResourcePropertyValidator)(properties.nlbResource));
  errors.collect(cdk.propertyValidator("r53Resource", CfnResourceSetR53ResourceRecordPropertyValidator)(properties.r53Resource));
  return errors.wrap("supplied properties not correct for \"TargetResourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnResourceSetTargetResourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceSetTargetResourcePropertyValidator(properties).assertSuccess();
  return {
    "NLBResource": convertCfnResourceSetNLBResourcePropertyToCloudFormation(properties.nlbResource),
    "R53Resource": convertCfnResourceSetR53ResourceRecordPropertyToCloudFormation(properties.r53Resource)
  };
}

// @ts-ignore TS6133
function CfnResourceSetTargetResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResourceSet.TargetResourceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceSet.TargetResourceProperty>();
  ret.addPropertyResult("nlbResource", "NLBResource", (properties.NLBResource != null ? CfnResourceSetNLBResourcePropertyFromCloudFormation(properties.NLBResource) : undefined));
  ret.addPropertyResult("r53Resource", "R53Resource", (properties.R53Resource != null ? CfnResourceSetR53ResourceRecordPropertyFromCloudFormation(properties.R53Resource) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DNSTargetResourceProperty`
 *
 * @param properties - the TypeScript properties of a `DNSTargetResourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceSetDNSTargetResourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("domainName", cdk.validateString)(properties.domainName));
  errors.collect(cdk.propertyValidator("hostedZoneArn", cdk.validateString)(properties.hostedZoneArn));
  errors.collect(cdk.propertyValidator("recordSetId", cdk.validateString)(properties.recordSetId));
  errors.collect(cdk.propertyValidator("recordType", cdk.validateString)(properties.recordType));
  errors.collect(cdk.propertyValidator("targetResource", CfnResourceSetTargetResourcePropertyValidator)(properties.targetResource));
  return errors.wrap("supplied properties not correct for \"DNSTargetResourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnResourceSetDNSTargetResourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceSetDNSTargetResourcePropertyValidator(properties).assertSuccess();
  return {
    "DomainName": cdk.stringToCloudFormation(properties.domainName),
    "HostedZoneArn": cdk.stringToCloudFormation(properties.hostedZoneArn),
    "RecordSetId": cdk.stringToCloudFormation(properties.recordSetId),
    "RecordType": cdk.stringToCloudFormation(properties.recordType),
    "TargetResource": convertCfnResourceSetTargetResourcePropertyToCloudFormation(properties.targetResource)
  };
}

// @ts-ignore TS6133
function CfnResourceSetDNSTargetResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceSet.DNSTargetResourceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceSet.DNSTargetResourceProperty>();
  ret.addPropertyResult("domainName", "DomainName", (properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined));
  ret.addPropertyResult("hostedZoneArn", "HostedZoneArn", (properties.HostedZoneArn != null ? cfn_parse.FromCloudFormation.getString(properties.HostedZoneArn) : undefined));
  ret.addPropertyResult("recordSetId", "RecordSetId", (properties.RecordSetId != null ? cfn_parse.FromCloudFormation.getString(properties.RecordSetId) : undefined));
  ret.addPropertyResult("recordType", "RecordType", (properties.RecordType != null ? cfn_parse.FromCloudFormation.getString(properties.RecordType) : undefined));
  ret.addPropertyResult("targetResource", "TargetResource", (properties.TargetResource != null ? CfnResourceSetTargetResourcePropertyFromCloudFormation(properties.TargetResource) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResourceProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceSetResourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("componentId", cdk.validateString)(properties.componentId));
  errors.collect(cdk.propertyValidator("dnsTargetResource", CfnResourceSetDNSTargetResourcePropertyValidator)(properties.dnsTargetResource));
  errors.collect(cdk.propertyValidator("readinessScopes", cdk.listValidator(cdk.validateString))(properties.readinessScopes));
  errors.collect(cdk.propertyValidator("resourceArn", cdk.validateString)(properties.resourceArn));
  return errors.wrap("supplied properties not correct for \"ResourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnResourceSetResourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceSetResourcePropertyValidator(properties).assertSuccess();
  return {
    "ComponentId": cdk.stringToCloudFormation(properties.componentId),
    "DnsTargetResource": convertCfnResourceSetDNSTargetResourcePropertyToCloudFormation(properties.dnsTargetResource),
    "ReadinessScopes": cdk.listMapper(cdk.stringToCloudFormation)(properties.readinessScopes),
    "ResourceArn": cdk.stringToCloudFormation(properties.resourceArn)
  };
}

// @ts-ignore TS6133
function CfnResourceSetResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResourceSet.ResourceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceSet.ResourceProperty>();
  ret.addPropertyResult("componentId", "ComponentId", (properties.ComponentId != null ? cfn_parse.FromCloudFormation.getString(properties.ComponentId) : undefined));
  ret.addPropertyResult("dnsTargetResource", "DnsTargetResource", (properties.DnsTargetResource != null ? CfnResourceSetDNSTargetResourcePropertyFromCloudFormation(properties.DnsTargetResource) : undefined));
  ret.addPropertyResult("readinessScopes", "ReadinessScopes", (properties.ReadinessScopes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ReadinessScopes) : undefined));
  ret.addPropertyResult("resourceArn", "ResourceArn", (properties.ResourceArn != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnResourceSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnResourceSetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceSetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("resourceSetName", cdk.validateString)(properties.resourceSetName));
  errors.collect(cdk.propertyValidator("resourceSetType", cdk.requiredValidator)(properties.resourceSetType));
  errors.collect(cdk.propertyValidator("resourceSetType", cdk.validateString)(properties.resourceSetType));
  errors.collect(cdk.propertyValidator("resources", cdk.requiredValidator)(properties.resources));
  errors.collect(cdk.propertyValidator("resources", cdk.listValidator(CfnResourceSetResourcePropertyValidator))(properties.resources));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnResourceSetProps\"");
}

// @ts-ignore TS6133
function convertCfnResourceSetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceSetPropsValidator(properties).assertSuccess();
  return {
    "ResourceSetName": cdk.stringToCloudFormation(properties.resourceSetName),
    "ResourceSetType": cdk.stringToCloudFormation(properties.resourceSetType),
    "Resources": cdk.listMapper(convertCfnResourceSetResourcePropertyToCloudFormation)(properties.resources),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnResourceSetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceSetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceSetProps>();
  ret.addPropertyResult("resources", "Resources", (properties.Resources != null ? cfn_parse.FromCloudFormation.getArray(CfnResourceSetResourcePropertyFromCloudFormation)(properties.Resources) : undefined));
  ret.addPropertyResult("resourceSetName", "ResourceSetName", (properties.ResourceSetName != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceSetName) : undefined));
  ret.addPropertyResult("resourceSetType", "ResourceSetType", (properties.ResourceSetType != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceSetType) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}