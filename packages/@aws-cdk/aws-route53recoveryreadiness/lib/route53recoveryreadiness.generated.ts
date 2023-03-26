// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:54:04.944Z","fingerprint":"RMKmILY1SsdKtzB1a1CRc13GMIdo/47XlmRv2Ko0wK8="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnCell`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-cell.html
 */
export interface CfnCellProps {

    /**
     * The name of the cell to create.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-cell.html#cfn-route53recoveryreadiness-cell-cellname
     */
    readonly cellName?: string;

    /**
     * A list of cell Amazon Resource Names (ARNs) contained within this cell, for use in nested cells. For example, Availability Zones within specific AWS Regions .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-cell.html#cfn-route53recoveryreadiness-cell-cells
     */
    readonly cells?: string[];

    /**
     * A collection of tags associated with a resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-cell.html#cfn-route53recoveryreadiness-cell-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnCellProps`
 *
 * @param properties - the TypeScript properties of a `CfnCellProps`
 *
 * @returns the result of the validation.
 */
function CfnCellPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cellName', cdk.validateString)(properties.cellName));
    errors.collect(cdk.propertyValidator('cells', cdk.listValidator(cdk.validateString))(properties.cells));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnCellProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::Cell` resource
 *
 * @param properties - the TypeScript properties of a `CfnCellProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::Cell` resource.
 */
// @ts-ignore TS6133
function cfnCellPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnCellPropsValidator(properties).assertSuccess();
    return {
        CellName: cdk.stringToCloudFormation(properties.cellName),
        Cells: cdk.listMapper(cdk.stringToCloudFormation)(properties.cells),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnCellPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCellProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCellProps>();
    ret.addPropertyResult('cellName', 'CellName', properties.CellName != null ? cfn_parse.FromCloudFormation.getString(properties.CellName) : undefined);
    ret.addPropertyResult('cells', 'Cells', properties.Cells != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Cells) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Route53RecoveryReadiness::Cell`
 *
 * Creates a cell in an account.
 *
 * @cloudformationResource AWS::Route53RecoveryReadiness::Cell
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-cell.html
 */
export class CfnCell extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Route53RecoveryReadiness::Cell";

    /**
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
        const ret = new CfnCell(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the cell.
     * @cloudformationAttribute CellArn
     */
    public readonly attrCellArn: string;

    /**
     * The readiness scope for the cell, which can be a cell Amazon Resource Name (ARN) or a recovery group ARN. This is a list but currently can have only one element.
     * @cloudformationAttribute ParentReadinessScopes
     */
    public readonly attrParentReadinessScopes: string[];

    /**
     * The name of the cell to create.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-cell.html#cfn-route53recoveryreadiness-cell-cellname
     */
    public cellName: string | undefined;

    /**
     * A list of cell Amazon Resource Names (ARNs) contained within this cell, for use in nested cells. For example, Availability Zones within specific AWS Regions .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-cell.html#cfn-route53recoveryreadiness-cell-cells
     */
    public cells: string[] | undefined;

    /**
     * A collection of tags associated with a resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-cell.html#cfn-route53recoveryreadiness-cell-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Route53RecoveryReadiness::Cell`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnCellProps = {}) {
        super(scope, id, { type: CfnCell.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrCellArn = cdk.Token.asString(this.getAtt('CellArn', cdk.ResolutionTypeHint.STRING));
        this.attrParentReadinessScopes = cdk.Token.asList(this.getAtt('ParentReadinessScopes', cdk.ResolutionTypeHint.STRING_LIST));

        this.cellName = props.cellName;
        this.cells = props.cells;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Route53RecoveryReadiness::Cell", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnCell.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            cellName: this.cellName,
            cells: this.cells,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnCellPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnReadinessCheck`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-readinesscheck.html
 */
export interface CfnReadinessCheckProps {

    /**
     * The name of the readiness check to create.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-readinesscheck.html#cfn-route53recoveryreadiness-readinesscheck-readinesscheckname
     */
    readonly readinessCheckName?: string;

    /**
     * The name of the resource set to check.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-readinesscheck.html#cfn-route53recoveryreadiness-readinesscheck-resourcesetname
     */
    readonly resourceSetName?: string;

    /**
     * A collection of tags associated with a resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-readinesscheck.html#cfn-route53recoveryreadiness-readinesscheck-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnReadinessCheckProps`
 *
 * @param properties - the TypeScript properties of a `CfnReadinessCheckProps`
 *
 * @returns the result of the validation.
 */
function CfnReadinessCheckPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('readinessCheckName', cdk.validateString)(properties.readinessCheckName));
    errors.collect(cdk.propertyValidator('resourceSetName', cdk.validateString)(properties.resourceSetName));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnReadinessCheckProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::ReadinessCheck` resource
 *
 * @param properties - the TypeScript properties of a `CfnReadinessCheckProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::ReadinessCheck` resource.
 */
// @ts-ignore TS6133
function cfnReadinessCheckPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnReadinessCheckPropsValidator(properties).assertSuccess();
    return {
        ReadinessCheckName: cdk.stringToCloudFormation(properties.readinessCheckName),
        ResourceSetName: cdk.stringToCloudFormation(properties.resourceSetName),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnReadinessCheckPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReadinessCheckProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReadinessCheckProps>();
    ret.addPropertyResult('readinessCheckName', 'ReadinessCheckName', properties.ReadinessCheckName != null ? cfn_parse.FromCloudFormation.getString(properties.ReadinessCheckName) : undefined);
    ret.addPropertyResult('resourceSetName', 'ResourceSetName', properties.ResourceSetName != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceSetName) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Route53RecoveryReadiness::ReadinessCheck`
 *
 * Creates a readiness check in an account. A readiness check monitors a resource set in your application, such as a set of Amazon Aurora instances, that Application Recovery Controller is auditing recovery readiness for. The audits run once every minute on every resource that's associated with a readiness check.
 *
 * @cloudformationResource AWS::Route53RecoveryReadiness::ReadinessCheck
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-readinesscheck.html
 */
export class CfnReadinessCheck extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Route53RecoveryReadiness::ReadinessCheck";

    /**
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
        const ret = new CfnReadinessCheck(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the readiness check.
     * @cloudformationAttribute ReadinessCheckArn
     */
    public readonly attrReadinessCheckArn: string;

    /**
     * The name of the readiness check to create.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-readinesscheck.html#cfn-route53recoveryreadiness-readinesscheck-readinesscheckname
     */
    public readinessCheckName: string | undefined;

    /**
     * The name of the resource set to check.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-readinesscheck.html#cfn-route53recoveryreadiness-readinesscheck-resourcesetname
     */
    public resourceSetName: string | undefined;

    /**
     * A collection of tags associated with a resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-readinesscheck.html#cfn-route53recoveryreadiness-readinesscheck-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Route53RecoveryReadiness::ReadinessCheck`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnReadinessCheckProps = {}) {
        super(scope, id, { type: CfnReadinessCheck.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrReadinessCheckArn = cdk.Token.asString(this.getAtt('ReadinessCheckArn', cdk.ResolutionTypeHint.STRING));

        this.readinessCheckName = props.readinessCheckName;
        this.resourceSetName = props.resourceSetName;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Route53RecoveryReadiness::ReadinessCheck", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnReadinessCheck.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            readinessCheckName: this.readinessCheckName,
            resourceSetName: this.resourceSetName,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnReadinessCheckPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnRecoveryGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-recoverygroup.html
 */
export interface CfnRecoveryGroupProps {

    /**
     * A list of the cell Amazon Resource Names (ARNs) in the recovery group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-recoverygroup.html#cfn-route53recoveryreadiness-recoverygroup-cells
     */
    readonly cells?: string[];

    /**
     * The name of the recovery group to create.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-recoverygroup.html#cfn-route53recoveryreadiness-recoverygroup-recoverygroupname
     */
    readonly recoveryGroupName?: string;

    /**
     * A collection of tags associated with a resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-recoverygroup.html#cfn-route53recoveryreadiness-recoverygroup-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnRecoveryGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnRecoveryGroupProps`
 *
 * @returns the result of the validation.
 */
function CfnRecoveryGroupPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('cells', cdk.listValidator(cdk.validateString))(properties.cells));
    errors.collect(cdk.propertyValidator('recoveryGroupName', cdk.validateString)(properties.recoveryGroupName));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnRecoveryGroupProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::RecoveryGroup` resource
 *
 * @param properties - the TypeScript properties of a `CfnRecoveryGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::RecoveryGroup` resource.
 */
// @ts-ignore TS6133
function cfnRecoveryGroupPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnRecoveryGroupPropsValidator(properties).assertSuccess();
    return {
        Cells: cdk.listMapper(cdk.stringToCloudFormation)(properties.cells),
        RecoveryGroupName: cdk.stringToCloudFormation(properties.recoveryGroupName),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnRecoveryGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRecoveryGroupProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRecoveryGroupProps>();
    ret.addPropertyResult('cells', 'Cells', properties.Cells != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Cells) : undefined);
    ret.addPropertyResult('recoveryGroupName', 'RecoveryGroupName', properties.RecoveryGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.RecoveryGroupName) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Route53RecoveryReadiness::RecoveryGroup`
 *
 * Creates a recovery group in an account. A recovery group corresponds to an application and includes a list of the cells that make up the application.
 *
 * @cloudformationResource AWS::Route53RecoveryReadiness::RecoveryGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-recoverygroup.html
 */
export class CfnRecoveryGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Route53RecoveryReadiness::RecoveryGroup";

    /**
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
        const ret = new CfnRecoveryGroup(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the recovery group.
     * @cloudformationAttribute RecoveryGroupArn
     */
    public readonly attrRecoveryGroupArn: string;

    /**
     * A list of the cell Amazon Resource Names (ARNs) in the recovery group.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-recoverygroup.html#cfn-route53recoveryreadiness-recoverygroup-cells
     */
    public cells: string[] | undefined;

    /**
     * The name of the recovery group to create.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-recoverygroup.html#cfn-route53recoveryreadiness-recoverygroup-recoverygroupname
     */
    public recoveryGroupName: string | undefined;

    /**
     * A collection of tags associated with a resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-recoverygroup.html#cfn-route53recoveryreadiness-recoverygroup-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Route53RecoveryReadiness::RecoveryGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnRecoveryGroupProps = {}) {
        super(scope, id, { type: CfnRecoveryGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrRecoveryGroupArn = cdk.Token.asString(this.getAtt('RecoveryGroupArn', cdk.ResolutionTypeHint.STRING));

        this.cells = props.cells;
        this.recoveryGroupName = props.recoveryGroupName;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Route53RecoveryReadiness::RecoveryGroup", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnRecoveryGroup.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            cells: this.cells,
            recoveryGroupName: this.recoveryGroupName,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnRecoveryGroupPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnResourceSet`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-resourceset.html
 */
export interface CfnResourceSetProps {

    /**
     * A list of resource objects in the resource set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-resourceset.html#cfn-route53recoveryreadiness-resourceset-resources
     */
    readonly resources: Array<CfnResourceSet.ResourceProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The resource type of the resources in the resource set. Enter one of the following values for resource type:
     *
     * AWS::AutoScaling::AutoScalingGroup, AWS::CloudWatch::Alarm, AWS::EC2::CustomerGateway, AWS::DynamoDB::Table, AWS::EC2::Volume, AWS::ElasticLoadBalancing::LoadBalancer, AWS::ElasticLoadBalancingV2::LoadBalancer, AWS::MSK::Cluster, AWS::RDS::DBCluster, AWS::Route53::HealthCheck, AWS::SQS::Queue, AWS::SNS::Topic, AWS::SNS::Subscription, AWS::EC2::VPC, AWS::EC2::VPNConnection, AWS::EC2::VPNGateway, AWS::Route53RecoveryReadiness::DNSTargetResource.
     *
     * Note that AWS::Route53RecoveryReadiness::DNSTargetResource is only used for this setting. It isn't an actual AWS CloudFormation resource type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-resourceset.html#cfn-route53recoveryreadiness-resourceset-resourcesettype
     */
    readonly resourceSetType: string;

    /**
     * The name of the resource set to create.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-resourceset.html#cfn-route53recoveryreadiness-resourceset-resourcesetname
     */
    readonly resourceSetName?: string;

    /**
     * A tag to associate with the parameters for a resource set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-resourceset.html#cfn-route53recoveryreadiness-resourceset-tags
     */
    readonly tags?: cdk.CfnTag[];
}

/**
 * Determine whether the given properties match those of a `CfnResourceSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnResourceSetProps`
 *
 * @returns the result of the validation.
 */
function CfnResourceSetPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('resourceSetName', cdk.validateString)(properties.resourceSetName));
    errors.collect(cdk.propertyValidator('resourceSetType', cdk.requiredValidator)(properties.resourceSetType));
    errors.collect(cdk.propertyValidator('resourceSetType', cdk.validateString)(properties.resourceSetType));
    errors.collect(cdk.propertyValidator('resources', cdk.requiredValidator)(properties.resources));
    errors.collect(cdk.propertyValidator('resources', cdk.listValidator(CfnResourceSet_ResourcePropertyValidator))(properties.resources));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    return errors.wrap('supplied properties not correct for "CfnResourceSetProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::ResourceSet` resource
 *
 * @param properties - the TypeScript properties of a `CfnResourceSetProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::ResourceSet` resource.
 */
// @ts-ignore TS6133
function cfnResourceSetPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResourceSetPropsValidator(properties).assertSuccess();
    return {
        Resources: cdk.listMapper(cfnResourceSetResourcePropertyToCloudFormation)(properties.resources),
        ResourceSetType: cdk.stringToCloudFormation(properties.resourceSetType),
        ResourceSetName: cdk.stringToCloudFormation(properties.resourceSetName),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnResourceSetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceSetProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceSetProps>();
    ret.addPropertyResult('resources', 'Resources', cfn_parse.FromCloudFormation.getArray(CfnResourceSetResourcePropertyFromCloudFormation)(properties.Resources));
    ret.addPropertyResult('resourceSetType', 'ResourceSetType', cfn_parse.FromCloudFormation.getString(properties.ResourceSetType));
    ret.addPropertyResult('resourceSetName', 'ResourceSetName', properties.ResourceSetName != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceSetName) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Route53RecoveryReadiness::ResourceSet`
 *
 * Creates a resource set. A resource set is a set of resources of one type that span multiple cells. You can associate a resource set with a readiness check to monitor the resources for failover readiness.
 *
 * @cloudformationResource AWS::Route53RecoveryReadiness::ResourceSet
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-resourceset.html
 */
export class CfnResourceSet extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Route53RecoveryReadiness::ResourceSet";

    /**
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
        const ret = new CfnResourceSet(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the resource set.
     * @cloudformationAttribute ResourceSetArn
     */
    public readonly attrResourceSetArn: string;

    /**
     * A list of resource objects in the resource set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-resourceset.html#cfn-route53recoveryreadiness-resourceset-resources
     */
    public resources: Array<CfnResourceSet.ResourceProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The resource type of the resources in the resource set. Enter one of the following values for resource type:
     *
     * AWS::AutoScaling::AutoScalingGroup, AWS::CloudWatch::Alarm, AWS::EC2::CustomerGateway, AWS::DynamoDB::Table, AWS::EC2::Volume, AWS::ElasticLoadBalancing::LoadBalancer, AWS::ElasticLoadBalancingV2::LoadBalancer, AWS::MSK::Cluster, AWS::RDS::DBCluster, AWS::Route53::HealthCheck, AWS::SQS::Queue, AWS::SNS::Topic, AWS::SNS::Subscription, AWS::EC2::VPC, AWS::EC2::VPNConnection, AWS::EC2::VPNGateway, AWS::Route53RecoveryReadiness::DNSTargetResource.
     *
     * Note that AWS::Route53RecoveryReadiness::DNSTargetResource is only used for this setting. It isn't an actual AWS CloudFormation resource type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-resourceset.html#cfn-route53recoveryreadiness-resourceset-resourcesettype
     */
    public resourceSetType: string;

    /**
     * The name of the resource set to create.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-resourceset.html#cfn-route53recoveryreadiness-resourceset-resourcesetname
     */
    public resourceSetName: string | undefined;

    /**
     * A tag to associate with the parameters for a resource set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53recoveryreadiness-resourceset.html#cfn-route53recoveryreadiness-resourceset-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::Route53RecoveryReadiness::ResourceSet`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnResourceSetProps) {
        super(scope, id, { type: CfnResourceSet.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'resourceSetType', this);
        cdk.requireProperty(props, 'resources', this);
        this.attrResourceSetArn = cdk.Token.asString(this.getAtt('ResourceSetArn', cdk.ResolutionTypeHint.STRING));

        this.resources = props.resources;
        this.resourceSetType = props.resourceSetType;
        this.resourceSetName = props.resourceSetName;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Route53RecoveryReadiness::ResourceSet", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnResourceSet.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            resources: this.resources,
            resourceSetType: this.resourceSetType,
            resourceSetName: this.resourceSetName,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnResourceSetPropsToCloudFormation(props);
    }
}

export namespace CfnResourceSet {
    /**
     * A component for DNS/routing control readiness checks and architecture checks.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-dnstargetresource.html
     */
    export interface DNSTargetResourceProperty {
        /**
         * The domain name that acts as an ingress point to a portion of the customer application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-dnstargetresource.html#cfn-route53recoveryreadiness-resourceset-dnstargetresource-domainname
         */
        readonly domainName?: string;
        /**
         * The hosted zone Amazon Resource Name (ARN) that contains the DNS record with the provided name of the target resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-dnstargetresource.html#cfn-route53recoveryreadiness-resourceset-dnstargetresource-hostedzonearn
         */
        readonly hostedZoneArn?: string;
        /**
         * The Route 53 record set ID that uniquely identifies a DNS record, given a name and a type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-dnstargetresource.html#cfn-route53recoveryreadiness-resourceset-dnstargetresource-recordsetid
         */
        readonly recordSetId?: string;
        /**
         * The type of DNS record of the target resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-dnstargetresource.html#cfn-route53recoveryreadiness-resourceset-dnstargetresource-recordtype
         */
        readonly recordType?: string;
        /**
         * The target resource that the Route 53 record points to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-dnstargetresource.html#cfn-route53recoveryreadiness-resourceset-dnstargetresource-targetresource
         */
        readonly targetResource?: CfnResourceSet.TargetResourceProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `DNSTargetResourceProperty`
 *
 * @param properties - the TypeScript properties of a `DNSTargetResourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnResourceSet_DNSTargetResourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('domainName', cdk.validateString)(properties.domainName));
    errors.collect(cdk.propertyValidator('hostedZoneArn', cdk.validateString)(properties.hostedZoneArn));
    errors.collect(cdk.propertyValidator('recordSetId', cdk.validateString)(properties.recordSetId));
    errors.collect(cdk.propertyValidator('recordType', cdk.validateString)(properties.recordType));
    errors.collect(cdk.propertyValidator('targetResource', CfnResourceSet_TargetResourcePropertyValidator)(properties.targetResource));
    return errors.wrap('supplied properties not correct for "DNSTargetResourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::ResourceSet.DNSTargetResource` resource
 *
 * @param properties - the TypeScript properties of a `DNSTargetResourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::ResourceSet.DNSTargetResource` resource.
 */
// @ts-ignore TS6133
function cfnResourceSetDNSTargetResourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResourceSet_DNSTargetResourcePropertyValidator(properties).assertSuccess();
    return {
        DomainName: cdk.stringToCloudFormation(properties.domainName),
        HostedZoneArn: cdk.stringToCloudFormation(properties.hostedZoneArn),
        RecordSetId: cdk.stringToCloudFormation(properties.recordSetId),
        RecordType: cdk.stringToCloudFormation(properties.recordType),
        TargetResource: cfnResourceSetTargetResourcePropertyToCloudFormation(properties.targetResource),
    };
}

// @ts-ignore TS6133
function CfnResourceSetDNSTargetResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceSet.DNSTargetResourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceSet.DNSTargetResourceProperty>();
    ret.addPropertyResult('domainName', 'DomainName', properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined);
    ret.addPropertyResult('hostedZoneArn', 'HostedZoneArn', properties.HostedZoneArn != null ? cfn_parse.FromCloudFormation.getString(properties.HostedZoneArn) : undefined);
    ret.addPropertyResult('recordSetId', 'RecordSetId', properties.RecordSetId != null ? cfn_parse.FromCloudFormation.getString(properties.RecordSetId) : undefined);
    ret.addPropertyResult('recordType', 'RecordType', properties.RecordType != null ? cfn_parse.FromCloudFormation.getString(properties.RecordType) : undefined);
    ret.addPropertyResult('targetResource', 'TargetResource', properties.TargetResource != null ? CfnResourceSetTargetResourcePropertyFromCloudFormation(properties.TargetResource) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResourceSet {
    /**
     * The Network Load Balancer resource that a DNS target resource points to.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-nlbresource.html
     */
    export interface NLBResourceProperty {
        /**
         * The Network Load Balancer resource Amazon Resource Name (ARN).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-nlbresource.html#cfn-route53recoveryreadiness-resourceset-nlbresource-arn
         */
        readonly arn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `NLBResourceProperty`
 *
 * @param properties - the TypeScript properties of a `NLBResourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnResourceSet_NLBResourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('arn', cdk.validateString)(properties.arn));
    return errors.wrap('supplied properties not correct for "NLBResourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::ResourceSet.NLBResource` resource
 *
 * @param properties - the TypeScript properties of a `NLBResourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::ResourceSet.NLBResource` resource.
 */
// @ts-ignore TS6133
function cfnResourceSetNLBResourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResourceSet_NLBResourcePropertyValidator(properties).assertSuccess();
    return {
        Arn: cdk.stringToCloudFormation(properties.arn),
    };
}

// @ts-ignore TS6133
function CfnResourceSetNLBResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceSet.NLBResourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceSet.NLBResourceProperty>();
    ret.addPropertyResult('arn', 'Arn', properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResourceSet {
    /**
     * The Route 53 resource that a DNS target resource record points to.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-r53resourcerecord.html
     */
    export interface R53ResourceRecordProperty {
        /**
         * The DNS target domain name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-r53resourcerecord.html#cfn-route53recoveryreadiness-resourceset-r53resourcerecord-domainname
         */
        readonly domainName?: string;
        /**
         * The Route 53 Resource Record Set ID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-r53resourcerecord.html#cfn-route53recoveryreadiness-resourceset-r53resourcerecord-recordsetid
         */
        readonly recordSetId?: string;
    }
}

/**
 * Determine whether the given properties match those of a `R53ResourceRecordProperty`
 *
 * @param properties - the TypeScript properties of a `R53ResourceRecordProperty`
 *
 * @returns the result of the validation.
 */
function CfnResourceSet_R53ResourceRecordPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('domainName', cdk.validateString)(properties.domainName));
    errors.collect(cdk.propertyValidator('recordSetId', cdk.validateString)(properties.recordSetId));
    return errors.wrap('supplied properties not correct for "R53ResourceRecordProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::ResourceSet.R53ResourceRecord` resource
 *
 * @param properties - the TypeScript properties of a `R53ResourceRecordProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::ResourceSet.R53ResourceRecord` resource.
 */
// @ts-ignore TS6133
function cfnResourceSetR53ResourceRecordPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResourceSet_R53ResourceRecordPropertyValidator(properties).assertSuccess();
    return {
        DomainName: cdk.stringToCloudFormation(properties.domainName),
        RecordSetId: cdk.stringToCloudFormation(properties.recordSetId),
    };
}

// @ts-ignore TS6133
function CfnResourceSetR53ResourceRecordPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceSet.R53ResourceRecordProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceSet.R53ResourceRecordProperty>();
    ret.addPropertyResult('domainName', 'DomainName', properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined);
    ret.addPropertyResult('recordSetId', 'RecordSetId', properties.RecordSetId != null ? cfn_parse.FromCloudFormation.getString(properties.RecordSetId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResourceSet {
    /**
     * The resource element of a resource set.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-resource.html
     */
    export interface ResourceProperty {
        /**
         * The component identifier of the resource, generated when DNS target resource is used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-resource.html#cfn-route53recoveryreadiness-resourceset-resource-componentid
         */
        readonly componentId?: string;
        /**
         * A component for DNS/routing control readiness checks. This is a required setting when `ResourceSet` `ResourceSetType` is set to `AWS::Route53RecoveryReadiness::DNSTargetResource` . Do not set it for any other `ResourceSetType` setting.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-resource.html#cfn-route53recoveryreadiness-resourceset-resource-dnstargetresource
         */
        readonly dnsTargetResource?: CfnResourceSet.DNSTargetResourceProperty | cdk.IResolvable;
        /**
         * The recovery group Amazon Resource Name (ARN) or the cell ARN that the readiness checks for this resource set are scoped to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-resource.html#cfn-route53recoveryreadiness-resourceset-resource-readinessscopes
         */
        readonly readinessScopes?: string[];
        /**
         * The Amazon Resource Name (ARN) of the AWS resource. This is a required setting for all `ResourceSet` `ResourceSetType` settings except `AWS::Route53RecoveryReadiness::DNSTargetResource` . Do not set this when `ResourceSetType` is set to `AWS::Route53RecoveryReadiness::DNSTargetResource` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-resource.html#cfn-route53recoveryreadiness-resourceset-resource-resourcearn
         */
        readonly resourceArn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `ResourceProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnResourceSet_ResourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('componentId', cdk.validateString)(properties.componentId));
    errors.collect(cdk.propertyValidator('dnsTargetResource', CfnResourceSet_DNSTargetResourcePropertyValidator)(properties.dnsTargetResource));
    errors.collect(cdk.propertyValidator('readinessScopes', cdk.listValidator(cdk.validateString))(properties.readinessScopes));
    errors.collect(cdk.propertyValidator('resourceArn', cdk.validateString)(properties.resourceArn));
    return errors.wrap('supplied properties not correct for "ResourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::ResourceSet.Resource` resource
 *
 * @param properties - the TypeScript properties of a `ResourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::ResourceSet.Resource` resource.
 */
// @ts-ignore TS6133
function cfnResourceSetResourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResourceSet_ResourcePropertyValidator(properties).assertSuccess();
    return {
        ComponentId: cdk.stringToCloudFormation(properties.componentId),
        DnsTargetResource: cfnResourceSetDNSTargetResourcePropertyToCloudFormation(properties.dnsTargetResource),
        ReadinessScopes: cdk.listMapper(cdk.stringToCloudFormation)(properties.readinessScopes),
        ResourceArn: cdk.stringToCloudFormation(properties.resourceArn),
    };
}

// @ts-ignore TS6133
function CfnResourceSetResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceSet.ResourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceSet.ResourceProperty>();
    ret.addPropertyResult('componentId', 'ComponentId', properties.ComponentId != null ? cfn_parse.FromCloudFormation.getString(properties.ComponentId) : undefined);
    ret.addPropertyResult('dnsTargetResource', 'DnsTargetResource', properties.DnsTargetResource != null ? CfnResourceSetDNSTargetResourcePropertyFromCloudFormation(properties.DnsTargetResource) : undefined);
    ret.addPropertyResult('readinessScopes', 'ReadinessScopes', properties.ReadinessScopes != null ? cfn_parse.FromCloudFormation.getStringArray(properties.ReadinessScopes) : undefined);
    ret.addPropertyResult('resourceArn', 'ResourceArn', properties.ResourceArn != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnResourceSet {
    /**
     * The target resource that the Route 53 record points to.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-targetresource.html
     */
    export interface TargetResourceProperty {
        /**
         * The Network Load Balancer resource that a DNS target resource points to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-targetresource.html#cfn-route53recoveryreadiness-resourceset-targetresource-nlbresource
         */
        readonly nlbResource?: CfnResourceSet.NLBResourceProperty | cdk.IResolvable;
        /**
         * The Route 53 resource that a DNS target resource record points to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53recoveryreadiness-resourceset-targetresource.html#cfn-route53recoveryreadiness-resourceset-targetresource-r53resource
         */
        readonly r53Resource?: CfnResourceSet.R53ResourceRecordProperty | cdk.IResolvable;
    }
}

/**
 * Determine whether the given properties match those of a `TargetResourceProperty`
 *
 * @param properties - the TypeScript properties of a `TargetResourceProperty`
 *
 * @returns the result of the validation.
 */
function CfnResourceSet_TargetResourcePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('nlbResource', CfnResourceSet_NLBResourcePropertyValidator)(properties.nlbResource));
    errors.collect(cdk.propertyValidator('r53Resource', CfnResourceSet_R53ResourceRecordPropertyValidator)(properties.r53Resource));
    return errors.wrap('supplied properties not correct for "TargetResourceProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::ResourceSet.TargetResource` resource
 *
 * @param properties - the TypeScript properties of a `TargetResourceProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Route53RecoveryReadiness::ResourceSet.TargetResource` resource.
 */
// @ts-ignore TS6133
function cfnResourceSetTargetResourcePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnResourceSet_TargetResourcePropertyValidator(properties).assertSuccess();
    return {
        NLBResource: cfnResourceSetNLBResourcePropertyToCloudFormation(properties.nlbResource),
        R53Resource: cfnResourceSetR53ResourceRecordPropertyToCloudFormation(properties.r53Resource),
    };
}

// @ts-ignore TS6133
function CfnResourceSetTargetResourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceSet.TargetResourceProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceSet.TargetResourceProperty>();
    ret.addPropertyResult('nlbResource', 'NLBResource', properties.NLBResource != null ? CfnResourceSetNLBResourcePropertyFromCloudFormation(properties.NLBResource) : undefined);
    ret.addPropertyResult('r53Resource', 'R53Resource', properties.R53Resource != null ? CfnResourceSetR53ResourceRecordPropertyFromCloudFormation(properties.R53Resource) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
