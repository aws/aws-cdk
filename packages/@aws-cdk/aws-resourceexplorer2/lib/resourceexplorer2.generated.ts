// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:53:57.394Z","fingerprint":"eAHYlTxAxiF4mirwymhRho4tVhGd9ypN6pqJPTWDGhg="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnDefaultViewAssociation`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-defaultviewassociation.html
 */
export interface CfnDefaultViewAssociationProps {

    /**
     * The ARN of the view to set as the default for the AWS Region and AWS account in which you call this operation. The specified view must already exist in the specified Region.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-defaultviewassociation.html#cfn-resourceexplorer2-defaultviewassociation-viewarn
     */
    readonly viewArn: string;
}

/**
 * Determine whether the given properties match those of a `CfnDefaultViewAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnDefaultViewAssociationProps`
 *
 * @returns the result of the validation.
 */
function CfnDefaultViewAssociationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('viewArn', cdk.requiredValidator)(properties.viewArn));
    errors.collect(cdk.propertyValidator('viewArn', cdk.validateString)(properties.viewArn));
    return errors.wrap('supplied properties not correct for "CfnDefaultViewAssociationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ResourceExplorer2::DefaultViewAssociation` resource
 *
 * @param properties - the TypeScript properties of a `CfnDefaultViewAssociationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ResourceExplorer2::DefaultViewAssociation` resource.
 */
// @ts-ignore TS6133
function cfnDefaultViewAssociationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnDefaultViewAssociationPropsValidator(properties).assertSuccess();
    return {
        ViewArn: cdk.stringToCloudFormation(properties.viewArn),
    };
}

// @ts-ignore TS6133
function CfnDefaultViewAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDefaultViewAssociationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDefaultViewAssociationProps>();
    ret.addPropertyResult('viewArn', 'ViewArn', cfn_parse.FromCloudFormation.getString(properties.ViewArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ResourceExplorer2::DefaultViewAssociation`
 *
 * Sets the specified view as the default for the AWS Region in which you call this operation. If a user makes a search query that doesn't explicitly specify the view to use, Resource Explorer chooses this default view automatically for searches performed in this AWS Region .
 *
 * @cloudformationResource AWS::ResourceExplorer2::DefaultViewAssociation
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-defaultviewassociation.html
 */
export class CfnDefaultViewAssociation extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ResourceExplorer2::DefaultViewAssociation";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDefaultViewAssociation {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDefaultViewAssociationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnDefaultViewAssociation(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The unique identifier of the principal for which the specified view was made the default for the AWS Region that contains the view. For example:
     *
     * `123456789012`
     * @cloudformationAttribute AssociatedAwsPrincipal
     */
    public readonly attrAssociatedAwsPrincipal: string;

    /**
     * The ARN of the view to set as the default for the AWS Region and AWS account in which you call this operation. The specified view must already exist in the specified Region.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-defaultviewassociation.html#cfn-resourceexplorer2-defaultviewassociation-viewarn
     */
    public viewArn: string;

    /**
     * Create a new `AWS::ResourceExplorer2::DefaultViewAssociation`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnDefaultViewAssociationProps) {
        super(scope, id, { type: CfnDefaultViewAssociation.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'viewArn', this);
        this.attrAssociatedAwsPrincipal = cdk.Token.asString(this.getAtt('AssociatedAwsPrincipal', cdk.ResolutionTypeHint.STRING));

        this.viewArn = props.viewArn;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDefaultViewAssociation.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            viewArn: this.viewArn,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnDefaultViewAssociationPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnIndex`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-index.html
 */
export interface CfnIndexProps {

    /**
     * Specifies the type of the index in this Region. For information about the aggregator index and how it differs from a local index, see [Turning on cross-Region search by creating an aggregator index](https://docs.aws.amazon.com/resource-explorer/latest/userguide/manage-aggregator-region.html) in the *AWS Resource Explorer User Guide.* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-index.html#cfn-resourceexplorer2-index-type
     */
    readonly type: string;

    /**
     * The specified tags are attached to only the index created in this AWS Region . The tags don't attach to any of the resources listed in the index.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-index.html#cfn-resourceexplorer2-index-tags
     */
    readonly tags?: { [key: string]: (string) };
}

/**
 * Determine whether the given properties match those of a `CfnIndexProps`
 *
 * @param properties - the TypeScript properties of a `CfnIndexProps`
 *
 * @returns the result of the validation.
 */
function CfnIndexPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "CfnIndexProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ResourceExplorer2::Index` resource
 *
 * @param properties - the TypeScript properties of a `CfnIndexProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ResourceExplorer2::Index` resource.
 */
// @ts-ignore TS6133
function cfnIndexPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnIndexPropsValidator(properties).assertSuccess();
    return {
        Type: cdk.stringToCloudFormation(properties.type),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnIndexPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIndexProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIndexProps>();
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ResourceExplorer2::Index`
 *
 * Turns on Resource Explorer in the AWS Region in which you called this operation by creating an index. Resource Explorer begins discovering the resources in this Region and stores the details about the resources in the index so that they can be queried by using the [Search](https://docs.aws.amazon.com/resource-explorer/latest/APIReference/API_Search.html) operation.
 *
 * You can create either a local index that returns search results from only the AWS Region in which the index exists, or you can create an aggregator index that returns search results from all AWS Regions in the AWS account .
 *
 * For more details about what happens when you turn on Resource Explorer in an AWS Region , see [Turning on Resource Explorer to index your resources in an AWS Region](https://docs.aws.amazon.com/resource-explorer/latest/userguide/manage-service-activate.html) in the *AWS Resource Explorer User Guide.*
 *
 * If this is the first AWS Region in which you've created an index for Resource Explorer, this operation also creates a service-linked role in your AWS account that allows Resource Explorer to search for your resources and populate the index.
 *
 * > To successfully create an index, you must have `resource-explorer-2:TagResource` permission, even if you don't specify tags to be added to the index.
 *
 * @cloudformationResource AWS::ResourceExplorer2::Index
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-index.html
 */
export class CfnIndex extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ResourceExplorer2::Index";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnIndex {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnIndexPropsFromCloudFormation(resourceProperties);
        const ret = new CfnIndex(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the new index for the AWS Region . For example:
     *
     * `arn:aws:resource-explorer-2:us-east-1:123456789012:index/EXAMPLE8-90ab-cdef-fedc-EXAMPLE22222`
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * Indicates the current state of the index. For example:
     *
     * `CREATING`
     * @cloudformationAttribute IndexState
     */
    public readonly attrIndexState: string;

    /**
     * Specifies the type of the index in this Region. For information about the aggregator index and how it differs from a local index, see [Turning on cross-Region search by creating an aggregator index](https://docs.aws.amazon.com/resource-explorer/latest/userguide/manage-aggregator-region.html) in the *AWS Resource Explorer User Guide.* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-index.html#cfn-resourceexplorer2-index-type
     */
    public type: string;

    /**
     * The specified tags are attached to only the index created in this AWS Region . The tags don't attach to any of the resources listed in the index.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-index.html#cfn-resourceexplorer2-index-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::ResourceExplorer2::Index`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnIndexProps) {
        super(scope, id, { type: CfnIndex.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'type', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrIndexState = cdk.Token.asString(this.getAtt('IndexState', cdk.ResolutionTypeHint.STRING));

        this.type = props.type;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::ResourceExplorer2::Index", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnIndex.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            type: this.type,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnIndexPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnView`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-view.html
 */
export interface CfnViewProps {

    /**
     * The name of the new view.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-view.html#cfn-resourceexplorer2-view-viewname
     */
    readonly viewName: string;

    /**
     * An array of strings that include search keywords, prefixes, and operators that filter the results that are returned for queries made using this view. When you use this view in a [Search](https://docs.aws.amazon.com/resource-explorer/latest/APIReference/API_Search.html) operation, the filter string is combined with the search's `QueryString` parameter using a logical `AND` operator.
     *
     * For information about the supported syntax, see [Search query reference for Resource Explorer](https://docs.aws.amazon.com/resource-explorer/latest/userguide/using-search-query-syntax.html) in the *AWS Resource Explorer User Guide* .
     *
     * > This query string in the context of this operation supports only [filter prefixes](https://docs.aws.amazon.com/resource-explorer/latest/userguide/using-search-query-syntax.html#query-syntax-filters) with optional [operators](https://docs.aws.amazon.com/resource-explorer/latest/userguide/using-search-query-syntax.html#query-syntax-operators) . It doesn't support free-form text. For example, the string `region:us* service:ec2 -tag:stage=prod` includes all Amazon EC2 resources in any AWS Region that begin with the letters `us` and are *not* tagged with a key `Stage` that has the value `prod` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-view.html#cfn-resourceexplorer2-view-filters
     */
    readonly filters?: CfnView.FiltersProperty | cdk.IResolvable;

    /**
     * A list of fields that provide additional information about the view.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-view.html#cfn-resourceexplorer2-view-includedproperties
     */
    readonly includedProperties?: Array<CfnView.IncludedPropertyProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Tag key and value pairs that are attached to the view.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-view.html#cfn-resourceexplorer2-view-tags
     */
    readonly tags?: { [key: string]: (string) };
}

/**
 * Determine whether the given properties match those of a `CfnViewProps`
 *
 * @param properties - the TypeScript properties of a `CfnViewProps`
 *
 * @returns the result of the validation.
 */
function CfnViewPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('filters', CfnView_FiltersPropertyValidator)(properties.filters));
    errors.collect(cdk.propertyValidator('includedProperties', cdk.listValidator(CfnView_IncludedPropertyPropertyValidator))(properties.includedProperties));
    errors.collect(cdk.propertyValidator('tags', cdk.hashValidator(cdk.validateString))(properties.tags));
    errors.collect(cdk.propertyValidator('viewName', cdk.requiredValidator)(properties.viewName));
    errors.collect(cdk.propertyValidator('viewName', cdk.validateString)(properties.viewName));
    return errors.wrap('supplied properties not correct for "CfnViewProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ResourceExplorer2::View` resource
 *
 * @param properties - the TypeScript properties of a `CfnViewProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ResourceExplorer2::View` resource.
 */
// @ts-ignore TS6133
function cfnViewPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnViewPropsValidator(properties).assertSuccess();
    return {
        ViewName: cdk.stringToCloudFormation(properties.viewName),
        Filters: cfnViewFiltersPropertyToCloudFormation(properties.filters),
        IncludedProperties: cdk.listMapper(cfnViewIncludedPropertyPropertyToCloudFormation)(properties.includedProperties),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    };
}

// @ts-ignore TS6133
function CfnViewPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnViewProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnViewProps>();
    ret.addPropertyResult('viewName', 'ViewName', cfn_parse.FromCloudFormation.getString(properties.ViewName));
    ret.addPropertyResult('filters', 'Filters', properties.Filters != null ? CfnViewFiltersPropertyFromCloudFormation(properties.Filters) : undefined);
    ret.addPropertyResult('includedProperties', 'IncludedProperties', properties.IncludedProperties != null ? cfn_parse.FromCloudFormation.getArray(CfnViewIncludedPropertyPropertyFromCloudFormation)(properties.IncludedProperties) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined as any);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::ResourceExplorer2::View`
 *
 * Creates a view that users can query by using the [Search](https://docs.aws.amazon.com/resource-explorer/latest/APIReference/API_Search.html) operation. Results from queries that you make using this view include only resources that match the view's `Filters` .
 *
 * > To successfully create a view, you must have `resource-explorer-2:TagResource` permission, even if you don't specify tags to be added to the view.
 *
 * @cloudformationResource AWS::ResourceExplorer2::View
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-view.html
 */
export class CfnView extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ResourceExplorer2::View";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnView {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnViewPropsFromCloudFormation(resourceProperties);
        const ret = new CfnView(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ARN of the new view. For example:
     *
     * `arn:aws:resource-explorer-2:us-east-1:123456789012:view/MyView/EXAMPLE8-90ab-cdef-fedc-EXAMPLE22222`
     * @cloudformationAttribute ViewArn
     */
    public readonly attrViewArn: string;

    /**
     * The name of the new view.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-view.html#cfn-resourceexplorer2-view-viewname
     */
    public viewName: string;

    /**
     * An array of strings that include search keywords, prefixes, and operators that filter the results that are returned for queries made using this view. When you use this view in a [Search](https://docs.aws.amazon.com/resource-explorer/latest/APIReference/API_Search.html) operation, the filter string is combined with the search's `QueryString` parameter using a logical `AND` operator.
     *
     * For information about the supported syntax, see [Search query reference for Resource Explorer](https://docs.aws.amazon.com/resource-explorer/latest/userguide/using-search-query-syntax.html) in the *AWS Resource Explorer User Guide* .
     *
     * > This query string in the context of this operation supports only [filter prefixes](https://docs.aws.amazon.com/resource-explorer/latest/userguide/using-search-query-syntax.html#query-syntax-filters) with optional [operators](https://docs.aws.amazon.com/resource-explorer/latest/userguide/using-search-query-syntax.html#query-syntax-operators) . It doesn't support free-form text. For example, the string `region:us* service:ec2 -tag:stage=prod` includes all Amazon EC2 resources in any AWS Region that begin with the letters `us` and are *not* tagged with a key `Stage` that has the value `prod` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-view.html#cfn-resourceexplorer2-view-filters
     */
    public filters: CfnView.FiltersProperty | cdk.IResolvable | undefined;

    /**
     * A list of fields that provide additional information about the view.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-view.html#cfn-resourceexplorer2-view-includedproperties
     */
    public includedProperties: Array<CfnView.IncludedPropertyProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * Tag key and value pairs that are attached to the view.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-view.html#cfn-resourceexplorer2-view-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * Create a new `AWS::ResourceExplorer2::View`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnViewProps) {
        super(scope, id, { type: CfnView.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'viewName', this);
        this.attrViewArn = cdk.Token.asString(this.getAtt('ViewArn', cdk.ResolutionTypeHint.STRING));

        this.viewName = props.viewName;
        this.filters = props.filters;
        this.includedProperties = props.includedProperties;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::ResourceExplorer2::View", props.tags, { tagPropertyName: 'tags' });
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnView.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            viewName: this.viewName,
            filters: this.filters,
            includedProperties: this.includedProperties,
            tags: this.tags.renderTags(),
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnViewPropsToCloudFormation(props);
    }
}

export namespace CfnView {
    /**
     * An object with a `FilterString` that specifies which resources to include in the results of queries made using this view.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resourceexplorer2-view-filters.html
     */
    export interface FiltersProperty {
        /**
         * `CfnView.FiltersProperty.FilterString`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resourceexplorer2-view-filters.html#cfn-resourceexplorer2-view-filters-filterstring
         */
        readonly filterString: string;
    }
}

/**
 * Determine whether the given properties match those of a `FiltersProperty`
 *
 * @param properties - the TypeScript properties of a `FiltersProperty`
 *
 * @returns the result of the validation.
 */
function CfnView_FiltersPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('filterString', cdk.requiredValidator)(properties.filterString));
    errors.collect(cdk.propertyValidator('filterString', cdk.validateString)(properties.filterString));
    return errors.wrap('supplied properties not correct for "FiltersProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ResourceExplorer2::View.Filters` resource
 *
 * @param properties - the TypeScript properties of a `FiltersProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ResourceExplorer2::View.Filters` resource.
 */
// @ts-ignore TS6133
function cfnViewFiltersPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnView_FiltersPropertyValidator(properties).assertSuccess();
    return {
        FilterString: cdk.stringToCloudFormation(properties.filterString),
    };
}

// @ts-ignore TS6133
function CfnViewFiltersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnView.FiltersProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnView.FiltersProperty>();
    ret.addPropertyResult('filterString', 'FilterString', cfn_parse.FromCloudFormation.getString(properties.FilterString));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnView {
    /**
     * Information about an additional property that describes a resource, that you can optionally include in a view.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resourceexplorer2-view-includedproperty.html
     */
    export interface IncludedPropertyProperty {
        /**
         * The name of the property that is included in this view.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resourceexplorer2-view-includedproperty.html#cfn-resourceexplorer2-view-includedproperty-name
         */
        readonly name: string;
    }
}

/**
 * Determine whether the given properties match those of a `IncludedPropertyProperty`
 *
 * @param properties - the TypeScript properties of a `IncludedPropertyProperty`
 *
 * @returns the result of the validation.
 */
function CfnView_IncludedPropertyPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('name', cdk.requiredValidator)(properties.name));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    return errors.wrap('supplied properties not correct for "IncludedPropertyProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ResourceExplorer2::View.IncludedProperty` resource
 *
 * @param properties - the TypeScript properties of a `IncludedPropertyProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ResourceExplorer2::View.IncludedProperty` resource.
 */
// @ts-ignore TS6133
function cfnViewIncludedPropertyPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnView_IncludedPropertyPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
    };
}

// @ts-ignore TS6133
function CfnViewIncludedPropertyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnView.IncludedPropertyProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnView.IncludedPropertyProperty>();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
