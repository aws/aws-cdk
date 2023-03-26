"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnView = exports.CfnIndex = exports.CfnDefaultViewAssociation = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
const cfn_parse = require("@aws-cdk/core/lib/helpers-internal");
/**
 * Determine whether the given properties match those of a `CfnDefaultViewAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnDefaultViewAssociationProps`
 *
 * @returns the result of the validation.
 */
function CfnDefaultViewAssociationPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnDefaultViewAssociationPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnDefaultViewAssociationPropsValidator(properties).assertSuccess();
    return {
        ViewArn: cdk.stringToCloudFormation(properties.viewArn),
    };
}
// @ts-ignore TS6133
function CfnDefaultViewAssociationPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
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
class CfnDefaultViewAssociation extends cdk.CfnResource {
    /**
     * Create a new `AWS::ResourceExplorer2::DefaultViewAssociation`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnDefaultViewAssociation.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_resourceexplorer2_CfnDefaultViewAssociationProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnDefaultViewAssociation);
            }
            throw error;
        }
        cdk.requireProperty(props, 'viewArn', this);
        this.attrAssociatedAwsPrincipal = cdk.Token.asString(this.getAtt('AssociatedAwsPrincipal', cdk.ResolutionTypeHint.STRING));
        this.viewArn = props.viewArn;
    }
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope, id, resourceAttributes, options) {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnDefaultViewAssociationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnDefaultViewAssociation(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnDefaultViewAssociation.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            viewArn: this.viewArn,
        };
    }
    renderProperties(props) {
        return cfnDefaultViewAssociationPropsToCloudFormation(props);
    }
}
exports.CfnDefaultViewAssociation = CfnDefaultViewAssociation;
_a = JSII_RTTI_SYMBOL_1;
CfnDefaultViewAssociation[_a] = { fqn: "@aws-cdk/aws-resourceexplorer2.CfnDefaultViewAssociation", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnDefaultViewAssociation.CFN_RESOURCE_TYPE_NAME = "AWS::ResourceExplorer2::DefaultViewAssociation";
/**
 * Determine whether the given properties match those of a `CfnIndexProps`
 *
 * @param properties - the TypeScript properties of a `CfnIndexProps`
 *
 * @returns the result of the validation.
 */
function CfnIndexPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnIndexPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnIndexPropsValidator(properties).assertSuccess();
    return {
        Type: cdk.stringToCloudFormation(properties.type),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    };
}
// @ts-ignore TS6133
function CfnIndexPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined);
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
class CfnIndex extends cdk.CfnResource {
    /**
     * Create a new `AWS::ResourceExplorer2::Index`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnIndex.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_resourceexplorer2_CfnIndexProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnIndex);
            }
            throw error;
        }
        cdk.requireProperty(props, 'type', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));
        this.attrIndexState = cdk.Token.asString(this.getAtt('IndexState', cdk.ResolutionTypeHint.STRING));
        this.type = props.type;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::ResourceExplorer2::Index", props.tags, { tagPropertyName: 'tags' });
    }
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope, id, resourceAttributes, options) {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnIndexPropsFromCloudFormation(resourceProperties);
        const ret = new CfnIndex(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnIndex.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            type: this.type,
            tags: this.tags.renderTags(),
        };
    }
    renderProperties(props) {
        return cfnIndexPropsToCloudFormation(props);
    }
}
exports.CfnIndex = CfnIndex;
_b = JSII_RTTI_SYMBOL_1;
CfnIndex[_b] = { fqn: "@aws-cdk/aws-resourceexplorer2.CfnIndex", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnIndex.CFN_RESOURCE_TYPE_NAME = "AWS::ResourceExplorer2::Index";
/**
 * Determine whether the given properties match those of a `CfnViewProps`
 *
 * @param properties - the TypeScript properties of a `CfnViewProps`
 *
 * @returns the result of the validation.
 */
function CfnViewPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnViewPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnViewPropsValidator(properties).assertSuccess();
    return {
        ViewName: cdk.stringToCloudFormation(properties.viewName),
        Filters: cfnViewFiltersPropertyToCloudFormation(properties.filters),
        IncludedProperties: cdk.listMapper(cfnViewIncludedPropertyPropertyToCloudFormation)(properties.includedProperties),
        Tags: cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    };
}
// @ts-ignore TS6133
function CfnViewPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('viewName', 'ViewName', cfn_parse.FromCloudFormation.getString(properties.ViewName));
    ret.addPropertyResult('filters', 'Filters', properties.Filters != null ? CfnViewFiltersPropertyFromCloudFormation(properties.Filters) : undefined);
    ret.addPropertyResult('includedProperties', 'IncludedProperties', properties.IncludedProperties != null ? cfn_parse.FromCloudFormation.getArray(CfnViewIncludedPropertyPropertyFromCloudFormation)(properties.IncludedProperties) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined);
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
class CfnView extends cdk.CfnResource {
    /**
     * Create a new `AWS::ResourceExplorer2::View`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnView.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_resourceexplorer2_CfnViewProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnView);
            }
            throw error;
        }
        cdk.requireProperty(props, 'viewName', this);
        this.attrViewArn = cdk.Token.asString(this.getAtt('ViewArn', cdk.ResolutionTypeHint.STRING));
        this.viewName = props.viewName;
        this.filters = props.filters;
        this.includedProperties = props.includedProperties;
        this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::ResourceExplorer2::View", props.tags, { tagPropertyName: 'tags' });
    }
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope, id, resourceAttributes, options) {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnViewPropsFromCloudFormation(resourceProperties);
        const ret = new CfnView(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnView.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            viewName: this.viewName,
            filters: this.filters,
            includedProperties: this.includedProperties,
            tags: this.tags.renderTags(),
        };
    }
    renderProperties(props) {
        return cfnViewPropsToCloudFormation(props);
    }
}
exports.CfnView = CfnView;
_c = JSII_RTTI_SYMBOL_1;
CfnView[_c] = { fqn: "@aws-cdk/aws-resourceexplorer2.CfnView", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnView.CFN_RESOURCE_TYPE_NAME = "AWS::ResourceExplorer2::View";
/**
 * Determine whether the given properties match those of a `FiltersProperty`
 *
 * @param properties - the TypeScript properties of a `FiltersProperty`
 *
 * @returns the result of the validation.
 */
function CfnView_FiltersPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnViewFiltersPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnView_FiltersPropertyValidator(properties).assertSuccess();
    return {
        FilterString: cdk.stringToCloudFormation(properties.filterString),
    };
}
// @ts-ignore TS6133
function CfnViewFiltersPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('filterString', 'FilterString', cfn_parse.FromCloudFormation.getString(properties.FilterString));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
/**
 * Determine whether the given properties match those of a `IncludedPropertyProperty`
 *
 * @param properties - the TypeScript properties of a `IncludedPropertyProperty`
 *
 * @returns the result of the validation.
 */
function CfnView_IncludedPropertyPropertyValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
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
function cfnViewIncludedPropertyPropertyToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnView_IncludedPropertyPropertyValidator(properties).assertSuccess();
    return {
        Name: cdk.stringToCloudFormation(properties.name),
    };
}
// @ts-ignore TS6133
function CfnViewIncludedPropertyPropertyFromCloudFormation(properties) {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('name', 'Name', cfn_parse.FromCloudFormation.getString(properties.Name));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2VleHBsb3JlcjIuZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVzb3VyY2VleHBsb3JlcjIuZ2VuZXJhdGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQVFBLHFDQUFxQztBQUNyQyxnRUFBZ0U7QUFvQmhFOzs7Ozs7R0FNRztBQUNILFNBQVMsdUNBQXVDLENBQUMsVUFBZTtJQUM1RCxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUFFLE9BQU8sR0FBRyxDQUFDLGtCQUFrQixDQUFDO0tBQUU7SUFDbkUsTUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUMzQyxJQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsRUFBRTtRQUNoQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLG9DQUFvQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQy9HO0lBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQzVGLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDekYsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLHNFQUFzRSxDQUFDLENBQUM7QUFDL0YsQ0FBQztBQUVEOzs7Ozs7R0FNRztBQUNILG9CQUFvQjtBQUNwQixTQUFTLDhDQUE4QyxDQUFDLFVBQWU7SUFDbkUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFB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LENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDL0YsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2pELE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDEyLTIwMjMgQW1hem9uLmNvbSwgSW5jLiBvciBpdHMgYWZmaWxpYXRlcy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbi8vIEdlbmVyYXRlZCBmcm9tIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gUmVzb3VyY2UgU3BlY2lmaWNhdGlvblxuLy8gU2VlOiBkb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvY2ZuLXJlc291cmNlLXNwZWNpZmljYXRpb24uaHRtbFxuLy8gQGNmbjJ0czptZXRhQCB7XCJnZW5lcmF0ZWRcIjpcIjIwMjMtMDEtMjJUMDk6NTM6NTcuMzk0WlwiLFwiZmluZ2VycHJpbnRcIjpcImVBSFlsVHhBeGlGNG1pcnd5bWhSaG80dFZoR2Q5eXBONnBxSlBUV0RHaGc9XCJ9XG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi8gLy8gVGhpcyBpcyBnZW5lcmF0ZWQgY29kZSAtIGxpbmUgbGVuZ3RocyBhcmUgZGlmZmljdWx0IHRvIGNvbnRyb2xcblxuaW1wb3J0ICogYXMgY29uc3RydWN0cyBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNmbl9wYXJzZSBmcm9tICdAYXdzLWNkay9jb3JlL2xpYi9oZWxwZXJzLWludGVybmFsJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhIGBDZm5EZWZhdWx0Vmlld0Fzc29jaWF0aW9uYFxuICpcbiAqIEBzdHJ1Y3RcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yZXNvdXJjZWV4cGxvcmVyMi1kZWZhdWx0dmlld2Fzc29jaWF0aW9uLmh0bWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5EZWZhdWx0Vmlld0Fzc29jaWF0aW9uUHJvcHMge1xuXG4gICAgLyoqXG4gICAgICogVGhlIEFSTiBvZiB0aGUgdmlldyB0byBzZXQgYXMgdGhlIGRlZmF1bHQgZm9yIHRoZSBBV1MgUmVnaW9uIGFuZCBBV1MgYWNjb3VudCBpbiB3aGljaCB5b3UgY2FsbCB0aGlzIG9wZXJhdGlvbi4gVGhlIHNwZWNpZmllZCB2aWV3IG11c3QgYWxyZWFkeSBleGlzdCBpbiB0aGUgc3BlY2lmaWVkIFJlZ2lvbi5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXJlc291cmNlZXhwbG9yZXIyLWRlZmF1bHR2aWV3YXNzb2NpYXRpb24uaHRtbCNjZm4tcmVzb3VyY2VleHBsb3JlcjItZGVmYXVsdHZpZXdhc3NvY2lhdGlvbi12aWV3YXJuXG4gICAgICovXG4gICAgcmVhZG9ubHkgdmlld0Fybjogc3RyaW5nO1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENmbkRlZmF1bHRWaWV3QXNzb2NpYXRpb25Qcm9wc2BcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuRGVmYXVsdFZpZXdBc3NvY2lhdGlvblByb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmbkRlZmF1bHRWaWV3QXNzb2NpYXRpb25Qcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3ZpZXdBcm4nLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMudmlld0FybikpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndmlld0FybicsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy52aWV3QXJuKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkNmbkRlZmF1bHRWaWV3QXNzb2NpYXRpb25Qcm9wc1wiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6UmVzb3VyY2VFeHBsb3JlcjI6OkRlZmF1bHRWaWV3QXNzb2NpYXRpb25gIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmbkRlZmF1bHRWaWV3QXNzb2NpYXRpb25Qcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6UmVzb3VyY2VFeHBsb3JlcjI6OkRlZmF1bHRWaWV3QXNzb2NpYXRpb25gIHJlc291cmNlLlxuICovXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gY2ZuRGVmYXVsdFZpZXdBc3NvY2lhdGlvblByb3BzVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBhbnkge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIHByb3BlcnRpZXM7IH1cbiAgICBDZm5EZWZhdWx0Vmlld0Fzc29jaWF0aW9uUHJvcHNWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIFZpZXdBcm46IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMudmlld0FybiksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmbkRlZmF1bHRWaWV3QXNzb2NpYXRpb25Qcm9wc0Zyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmbkRlZmF1bHRWaWV3QXNzb2NpYXRpb25Qcm9wcz4ge1xuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuRGVmYXVsdFZpZXdBc3NvY2lhdGlvblByb3BzPigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgndmlld0FybicsICdWaWV3QXJuJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5WaWV3QXJuKSk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogQSBDbG91ZEZvcm1hdGlvbiBgQVdTOjpSZXNvdXJjZUV4cGxvcmVyMjo6RGVmYXVsdFZpZXdBc3NvY2lhdGlvbmBcbiAqXG4gKiBTZXRzIHRoZSBzcGVjaWZpZWQgdmlldyBhcyB0aGUgZGVmYXVsdCBmb3IgdGhlIEFXUyBSZWdpb24gaW4gd2hpY2ggeW91IGNhbGwgdGhpcyBvcGVyYXRpb24uIElmIGEgdXNlciBtYWtlcyBhIHNlYXJjaCBxdWVyeSB0aGF0IGRvZXNuJ3QgZXhwbGljaXRseSBzcGVjaWZ5IHRoZSB2aWV3IHRvIHVzZSwgUmVzb3VyY2UgRXhwbG9yZXIgY2hvb3NlcyB0aGlzIGRlZmF1bHQgdmlldyBhdXRvbWF0aWNhbGx5IGZvciBzZWFyY2hlcyBwZXJmb3JtZWQgaW4gdGhpcyBBV1MgUmVnaW9uIC5cbiAqXG4gKiBAY2xvdWRmb3JtYXRpb25SZXNvdXJjZSBBV1M6OlJlc291cmNlRXhwbG9yZXIyOjpEZWZhdWx0Vmlld0Fzc29jaWF0aW9uXG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtcmVzb3VyY2VleHBsb3JlcjItZGVmYXVsdHZpZXdhc3NvY2lhdGlvbi5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBDZm5EZWZhdWx0Vmlld0Fzc29jaWF0aW9uIGV4dGVuZHMgY2RrLkNmblJlc291cmNlIGltcGxlbWVudHMgY2RrLklJbnNwZWN0YWJsZSB7XG4gICAgLyoqXG4gICAgICogVGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHR5cGUgbmFtZSBmb3IgdGhpcyByZXNvdXJjZSBjbGFzcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENGTl9SRVNPVVJDRV9UWVBFX05BTUUgPSBcIkFXUzo6UmVzb3VyY2VFeHBsb3JlcjI6OkRlZmF1bHRWaWV3QXNzb2NpYXRpb25cIjtcblxuICAgIC8qKlxuICAgICAqIEEgZmFjdG9yeSBtZXRob2QgdGhhdCBjcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoaXMgY2xhc3MgZnJvbSBhbiBvYmplY3RcbiAgICAgKiBjb250YWluaW5nIHRoZSBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIHRoaXMgcmVzb3VyY2UuXG4gICAgICogVXNlZCBpbiB0aGUgQGF3cy1jZGsvY2xvdWRmb3JtYXRpb24taW5jbHVkZSBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIF9mcm9tQ2xvdWRGb3JtYXRpb24oc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCByZXNvdXJjZUF0dHJpYnV0ZXM6IGFueSwgb3B0aW9uczogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbk9wdGlvbnMpOiBDZm5EZWZhdWx0Vmlld0Fzc29jaWF0aW9uIHtcbiAgICAgICAgcmVzb3VyY2VBdHRyaWJ1dGVzID0gcmVzb3VyY2VBdHRyaWJ1dGVzIHx8IHt9O1xuICAgICAgICBjb25zdCByZXNvdXJjZVByb3BlcnRpZXMgPSBvcHRpb25zLnBhcnNlci5wYXJzZVZhbHVlKHJlc291cmNlQXR0cmlidXRlcy5Qcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcHJvcHNSZXN1bHQgPSBDZm5EZWZhdWx0Vmlld0Fzc29jaWF0aW9uUHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocmVzb3VyY2VQcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IENmbkRlZmF1bHRWaWV3QXNzb2NpYXRpb24oc2NvcGUsIGlkLCBwcm9wc1Jlc3VsdC52YWx1ZSk7XG4gICAgICAgIGZvciAoY29uc3QgW3Byb3BLZXksIHByb3BWYWxdIG9mIE9iamVjdC5lbnRyaWVzKHByb3BzUmVzdWx0LmV4dHJhUHJvcGVydGllcykpICB7XG4gICAgICAgICAgICByZXQuYWRkUHJvcGVydHlPdmVycmlkZShwcm9wS2V5LCBwcm9wVmFsKTtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zLnBhcnNlci5oYW5kbGVBdHRyaWJ1dGVzKHJldCwgcmVzb3VyY2VBdHRyaWJ1dGVzLCBpZCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIHVuaXF1ZSBpZGVudGlmaWVyIG9mIHRoZSBwcmluY2lwYWwgZm9yIHdoaWNoIHRoZSBzcGVjaWZpZWQgdmlldyB3YXMgbWFkZSB0aGUgZGVmYXVsdCBmb3IgdGhlIEFXUyBSZWdpb24gdGhhdCBjb250YWlucyB0aGUgdmlldy4gRm9yIGV4YW1wbGU6XG4gICAgICpcbiAgICAgKiBgMTIzNDU2Nzg5MDEyYFxuICAgICAqIEBjbG91ZGZvcm1hdGlvbkF0dHJpYnV0ZSBBc3NvY2lhdGVkQXdzUHJpbmNpcGFsXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGF0dHJBc3NvY2lhdGVkQXdzUHJpbmNpcGFsOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgQVJOIG9mIHRoZSB2aWV3IHRvIHNldCBhcyB0aGUgZGVmYXVsdCBmb3IgdGhlIEFXUyBSZWdpb24gYW5kIEFXUyBhY2NvdW50IGluIHdoaWNoIHlvdSBjYWxsIHRoaXMgb3BlcmF0aW9uLiBUaGUgc3BlY2lmaWVkIHZpZXcgbXVzdCBhbHJlYWR5IGV4aXN0IGluIHRoZSBzcGVjaWZpZWQgUmVnaW9uLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtcmVzb3VyY2VleHBsb3JlcjItZGVmYXVsdHZpZXdhc3NvY2lhdGlvbi5odG1sI2Nmbi1yZXNvdXJjZWV4cGxvcmVyMi1kZWZhdWx0dmlld2Fzc29jaWF0aW9uLXZpZXdhcm5cbiAgICAgKi9cbiAgICBwdWJsaWMgdmlld0Fybjogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IGBBV1M6OlJlc291cmNlRXhwbG9yZXIyOjpEZWZhdWx0Vmlld0Fzc29jaWF0aW9uYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzY29wZSAtIHNjb3BlIGluIHdoaWNoIHRoaXMgcmVzb3VyY2UgaXMgZGVmaW5lZFxuICAgICAqIEBwYXJhbSBpZCAgICAtIHNjb3BlZCBpZCBvZiB0aGUgcmVzb3VyY2VcbiAgICAgKiBAcGFyYW0gcHJvcHMgLSByZXNvdXJjZSBwcm9wZXJ0aWVzXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2ZuRGVmYXVsdFZpZXdBc3NvY2lhdGlvblByb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgeyB0eXBlOiBDZm5EZWZhdWx0Vmlld0Fzc29jaWF0aW9uLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUsIHByb3BlcnRpZXM6IHByb3BzIH0pO1xuICAgICAgICBjZGsucmVxdWlyZVByb3BlcnR5KHByb3BzLCAndmlld0FybicsIHRoaXMpO1xuICAgICAgICB0aGlzLmF0dHJBc3NvY2lhdGVkQXdzUHJpbmNpcGFsID0gY2RrLlRva2VuLmFzU3RyaW5nKHRoaXMuZ2V0QXR0KCdBc3NvY2lhdGVkQXdzUHJpbmNpcGFsJywgY2RrLlJlc29sdXRpb25UeXBlSGludC5TVFJJTkcpKTtcblxuICAgICAgICB0aGlzLnZpZXdBcm4gPSBwcm9wcy52aWV3QXJuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4YW1pbmVzIHRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBhbmQgZGlzY2xvc2VzIGF0dHJpYnV0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5zcGVjdG9yIC0gdHJlZSBpbnNwZWN0b3IgdG8gY29sbGVjdCBhbmQgcHJvY2VzcyBhdHRyaWJ1dGVzXG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5zcGVjdChpbnNwZWN0b3I6IGNkay5UcmVlSW5zcGVjdG9yKSB7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnR5cGVcIiwgQ2ZuRGVmYXVsdFZpZXdBc3NvY2lhdGlvbi5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FKTtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246cHJvcHNcIiwgdGhpcy5jZm5Qcm9wZXJ0aWVzKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0IGNmblByb3BlcnRpZXMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmlld0FybjogdGhpcy52aWV3QXJuLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCByZW5kZXJQcm9wZXJ0aWVzKHByb3BzOiB7W2tleTogc3RyaW5nXTogYW55fSk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIGNmbkRlZmF1bHRWaWV3QXNzb2NpYXRpb25Qcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcHMpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhIGBDZm5JbmRleGBcbiAqXG4gKiBAc3RydWN0XG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtcmVzb3VyY2VleHBsb3JlcjItaW5kZXguaHRtbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmbkluZGV4UHJvcHMge1xuXG4gICAgLyoqXG4gICAgICogU3BlY2lmaWVzIHRoZSB0eXBlIG9mIHRoZSBpbmRleCBpbiB0aGlzIFJlZ2lvbi4gRm9yIGluZm9ybWF0aW9uIGFib3V0IHRoZSBhZ2dyZWdhdG9yIGluZGV4IGFuZCBob3cgaXQgZGlmZmVycyBmcm9tIGEgbG9jYWwgaW5kZXgsIHNlZSBbVHVybmluZyBvbiBjcm9zcy1SZWdpb24gc2VhcmNoIGJ5IGNyZWF0aW5nIGFuIGFnZ3JlZ2F0b3IgaW5kZXhdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9yZXNvdXJjZS1leHBsb3Jlci9sYXRlc3QvdXNlcmd1aWRlL21hbmFnZS1hZ2dyZWdhdG9yLXJlZ2lvbi5odG1sKSBpbiB0aGUgKkFXUyBSZXNvdXJjZSBFeHBsb3JlciBVc2VyIEd1aWRlLiogLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtcmVzb3VyY2VleHBsb3JlcjItaW5kZXguaHRtbCNjZm4tcmVzb3VyY2VleHBsb3JlcjItaW5kZXgtdHlwZVxuICAgICAqL1xuICAgIHJlYWRvbmx5IHR5cGU6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBzcGVjaWZpZWQgdGFncyBhcmUgYXR0YWNoZWQgdG8gb25seSB0aGUgaW5kZXggY3JlYXRlZCBpbiB0aGlzIEFXUyBSZWdpb24gLiBUaGUgdGFncyBkb24ndCBhdHRhY2ggdG8gYW55IG9mIHRoZSByZXNvdXJjZXMgbGlzdGVkIGluIHRoZSBpbmRleC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXJlc291cmNlZXhwbG9yZXIyLWluZGV4Lmh0bWwjY2ZuLXJlc291cmNlZXhwbG9yZXIyLWluZGV4LXRhZ3NcbiAgICAgKi9cbiAgICByZWFkb25seSB0YWdzPzogeyBba2V5OiBzdHJpbmddOiAoc3RyaW5nKSB9O1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENmbkluZGV4UHJvcHNgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmbkluZGV4UHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuSW5kZXhQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3RhZ3MnLCBjZGsuaGFzaFZhbGlkYXRvcihjZGsudmFsaWRhdGVTdHJpbmcpKShwcm9wZXJ0aWVzLnRhZ3MpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3R5cGUnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMudHlwZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndHlwZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy50eXBlKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkNmbkluZGV4UHJvcHNcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlJlc291cmNlRXhwbG9yZXIyOjpJbmRleGAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuSW5kZXhQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6UmVzb3VyY2VFeHBsb3JlcjI6OkluZGV4YCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmbkluZGV4UHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmbkluZGV4UHJvcHNWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIFR5cGU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMudHlwZSksXG4gICAgICAgIFRhZ3M6IGNkay5oYXNoTWFwcGVyKGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKShwcm9wZXJ0aWVzLnRhZ3MpLFxuICAgIH07XG59XG5cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBDZm5JbmRleFByb3BzRnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuSW5kZXhQcm9wcz4ge1xuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuSW5kZXhQcm9wcz4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3R5cGUnLCAnVHlwZScsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuVHlwZSkpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgndGFncycsICdUYWdzJywgcHJvcGVydGllcy5UYWdzICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldE1hcChjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZykocHJvcGVydGllcy5UYWdzKSA6IHVuZGVmaW5lZCBhcyBhbnkpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIEEgQ2xvdWRGb3JtYXRpb24gYEFXUzo6UmVzb3VyY2VFeHBsb3JlcjI6OkluZGV4YFxuICpcbiAqIFR1cm5zIG9uIFJlc291cmNlIEV4cGxvcmVyIGluIHRoZSBBV1MgUmVnaW9uIGluIHdoaWNoIHlvdSBjYWxsZWQgdGhpcyBvcGVyYXRpb24gYnkgY3JlYXRpbmcgYW4gaW5kZXguIFJlc291cmNlIEV4cGxvcmVyIGJlZ2lucyBkaXNjb3ZlcmluZyB0aGUgcmVzb3VyY2VzIGluIHRoaXMgUmVnaW9uIGFuZCBzdG9yZXMgdGhlIGRldGFpbHMgYWJvdXQgdGhlIHJlc291cmNlcyBpbiB0aGUgaW5kZXggc28gdGhhdCB0aGV5IGNhbiBiZSBxdWVyaWVkIGJ5IHVzaW5nIHRoZSBbU2VhcmNoXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vcmVzb3VyY2UtZXhwbG9yZXIvbGF0ZXN0L0FQSVJlZmVyZW5jZS9BUElfU2VhcmNoLmh0bWwpIG9wZXJhdGlvbi5cbiAqXG4gKiBZb3UgY2FuIGNyZWF0ZSBlaXRoZXIgYSBsb2NhbCBpbmRleCB0aGF0IHJldHVybnMgc2VhcmNoIHJlc3VsdHMgZnJvbSBvbmx5IHRoZSBBV1MgUmVnaW9uIGluIHdoaWNoIHRoZSBpbmRleCBleGlzdHMsIG9yIHlvdSBjYW4gY3JlYXRlIGFuIGFnZ3JlZ2F0b3IgaW5kZXggdGhhdCByZXR1cm5zIHNlYXJjaCByZXN1bHRzIGZyb20gYWxsIEFXUyBSZWdpb25zIGluIHRoZSBBV1MgYWNjb3VudCAuXG4gKlxuICogRm9yIG1vcmUgZGV0YWlscyBhYm91dCB3aGF0IGhhcHBlbnMgd2hlbiB5b3UgdHVybiBvbiBSZXNvdXJjZSBFeHBsb3JlciBpbiBhbiBBV1MgUmVnaW9uICwgc2VlIFtUdXJuaW5nIG9uIFJlc291cmNlIEV4cGxvcmVyIHRvIGluZGV4IHlvdXIgcmVzb3VyY2VzIGluIGFuIEFXUyBSZWdpb25dKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9yZXNvdXJjZS1leHBsb3Jlci9sYXRlc3QvdXNlcmd1aWRlL21hbmFnZS1zZXJ2aWNlLWFjdGl2YXRlLmh0bWwpIGluIHRoZSAqQVdTIFJlc291cmNlIEV4cGxvcmVyIFVzZXIgR3VpZGUuKlxuICpcbiAqIElmIHRoaXMgaXMgdGhlIGZpcnN0IEFXUyBSZWdpb24gaW4gd2hpY2ggeW91J3ZlIGNyZWF0ZWQgYW4gaW5kZXggZm9yIFJlc291cmNlIEV4cGxvcmVyLCB0aGlzIG9wZXJhdGlvbiBhbHNvIGNyZWF0ZXMgYSBzZXJ2aWNlLWxpbmtlZCByb2xlIGluIHlvdXIgQVdTIGFjY291bnQgdGhhdCBhbGxvd3MgUmVzb3VyY2UgRXhwbG9yZXIgdG8gc2VhcmNoIGZvciB5b3VyIHJlc291cmNlcyBhbmQgcG9wdWxhdGUgdGhlIGluZGV4LlxuICpcbiAqID4gVG8gc3VjY2Vzc2Z1bGx5IGNyZWF0ZSBhbiBpbmRleCwgeW91IG11c3QgaGF2ZSBgcmVzb3VyY2UtZXhwbG9yZXItMjpUYWdSZXNvdXJjZWAgcGVybWlzc2lvbiwgZXZlbiBpZiB5b3UgZG9uJ3Qgc3BlY2lmeSB0YWdzIHRvIGJlIGFkZGVkIHRvIHRoZSBpbmRleC5cbiAqXG4gKiBAY2xvdWRmb3JtYXRpb25SZXNvdXJjZSBBV1M6OlJlc291cmNlRXhwbG9yZXIyOjpJbmRleFxuICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICpcbiAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXJlc291cmNlZXhwbG9yZXIyLWluZGV4Lmh0bWxcbiAqL1xuZXhwb3J0IGNsYXNzIENmbkluZGV4IGV4dGVuZHMgY2RrLkNmblJlc291cmNlIGltcGxlbWVudHMgY2RrLklJbnNwZWN0YWJsZSB7XG4gICAgLyoqXG4gICAgICogVGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIHR5cGUgbmFtZSBmb3IgdGhpcyByZXNvdXJjZSBjbGFzcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IENGTl9SRVNPVVJDRV9UWVBFX05BTUUgPSBcIkFXUzo6UmVzb3VyY2VFeHBsb3JlcjI6OkluZGV4XCI7XG5cbiAgICAvKipcbiAgICAgKiBBIGZhY3RvcnkgbWV0aG9kIHRoYXQgY3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGZyb20gYW4gb2JqZWN0XG4gICAgICogY29udGFpbmluZyB0aGUgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiB0aGlzIHJlc291cmNlLlxuICAgICAqIFVzZWQgaW4gdGhlIEBhd3MtY2RrL2Nsb3VkZm9ybWF0aW9uLWluY2x1ZGUgbW9kdWxlLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBfZnJvbUNsb3VkRm9ybWF0aW9uKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcmVzb3VyY2VBdHRyaWJ1dGVzOiBhbnksIG9wdGlvbnM6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25PcHRpb25zKTogQ2ZuSW5kZXgge1xuICAgICAgICByZXNvdXJjZUF0dHJpYnV0ZXMgPSByZXNvdXJjZUF0dHJpYnV0ZXMgfHwge307XG4gICAgICAgIGNvbnN0IHJlc291cmNlUHJvcGVydGllcyA9IG9wdGlvbnMucGFyc2VyLnBhcnNlVmFsdWUocmVzb3VyY2VBdHRyaWJ1dGVzLlByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCBwcm9wc1Jlc3VsdCA9IENmbkluZGV4UHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocmVzb3VyY2VQcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IENmbkluZGV4KHNjb3BlLCBpZCwgcHJvcHNSZXN1bHQudmFsdWUpO1xuICAgICAgICBmb3IgKGNvbnN0IFtwcm9wS2V5LCBwcm9wVmFsXSBvZiBPYmplY3QuZW50cmllcyhwcm9wc1Jlc3VsdC5leHRyYVByb3BlcnRpZXMpKSAge1xuICAgICAgICAgICAgcmV0LmFkZFByb3BlcnR5T3ZlcnJpZGUocHJvcEtleSwgcHJvcFZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy5wYXJzZXIuaGFuZGxlQXR0cmlidXRlcyhyZXQsIHJlc291cmNlQXR0cmlidXRlcywgaWQpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBBUk4gb2YgdGhlIG5ldyBpbmRleCBmb3IgdGhlIEFXUyBSZWdpb24gLiBGb3IgZXhhbXBsZTpcbiAgICAgKlxuICAgICAqIGBhcm46YXdzOnJlc291cmNlLWV4cGxvcmVyLTI6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjppbmRleC9FWEFNUExFOC05MGFiLWNkZWYtZmVkYy1FWEFNUExFMjIyMjJgXG4gICAgICogQGNsb3VkZm9ybWF0aW9uQXR0cmlidXRlIEFyblxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBhdHRyQXJuOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBJbmRpY2F0ZXMgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIGluZGV4LiBGb3IgZXhhbXBsZTpcbiAgICAgKlxuICAgICAqIGBDUkVBVElOR2BcbiAgICAgKiBAY2xvdWRmb3JtYXRpb25BdHRyaWJ1dGUgSW5kZXhTdGF0ZVxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBhdHRySW5kZXhTdGF0ZTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogU3BlY2lmaWVzIHRoZSB0eXBlIG9mIHRoZSBpbmRleCBpbiB0aGlzIFJlZ2lvbi4gRm9yIGluZm9ybWF0aW9uIGFib3V0IHRoZSBhZ2dyZWdhdG9yIGluZGV4IGFuZCBob3cgaXQgZGlmZmVycyBmcm9tIGEgbG9jYWwgaW5kZXgsIHNlZSBbVHVybmluZyBvbiBjcm9zcy1SZWdpb24gc2VhcmNoIGJ5IGNyZWF0aW5nIGFuIGFnZ3JlZ2F0b3IgaW5kZXhdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9yZXNvdXJjZS1leHBsb3Jlci9sYXRlc3QvdXNlcmd1aWRlL21hbmFnZS1hZ2dyZWdhdG9yLXJlZ2lvbi5odG1sKSBpbiB0aGUgKkFXUyBSZXNvdXJjZSBFeHBsb3JlciBVc2VyIEd1aWRlLiogLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtcmVzb3VyY2VleHBsb3JlcjItaW5kZXguaHRtbCNjZm4tcmVzb3VyY2VleHBsb3JlcjItaW5kZXgtdHlwZVxuICAgICAqL1xuICAgIHB1YmxpYyB0eXBlOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgc3BlY2lmaWVkIHRhZ3MgYXJlIGF0dGFjaGVkIHRvIG9ubHkgdGhlIGluZGV4IGNyZWF0ZWQgaW4gdGhpcyBBV1MgUmVnaW9uIC4gVGhlIHRhZ3MgZG9uJ3QgYXR0YWNoIHRvIGFueSBvZiB0aGUgcmVzb3VyY2VzIGxpc3RlZCBpbiB0aGUgaW5kZXguXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yZXNvdXJjZWV4cGxvcmVyMi1pbmRleC5odG1sI2Nmbi1yZXNvdXJjZWV4cGxvcmVyMi1pbmRleC10YWdzXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IHRhZ3M6IGNkay5UYWdNYW5hZ2VyO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IGBBV1M6OlJlc291cmNlRXhwbG9yZXIyOjpJbmRleGAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2NvcGUgLSBzY29wZSBpbiB3aGljaCB0aGlzIHJlc291cmNlIGlzIGRlZmluZWRcbiAgICAgKiBAcGFyYW0gaWQgICAgLSBzY29wZWQgaWQgb2YgdGhlIHJlc291cmNlXG4gICAgICogQHBhcmFtIHByb3BzIC0gcmVzb3VyY2UgcHJvcGVydGllc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENmbkluZGV4UHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCB7IHR5cGU6IENmbkluZGV4LkNGTl9SRVNPVVJDRV9UWVBFX05BTUUsIHByb3BlcnRpZXM6IHByb3BzIH0pO1xuICAgICAgICBjZGsucmVxdWlyZVByb3BlcnR5KHByb3BzLCAndHlwZScsIHRoaXMpO1xuICAgICAgICB0aGlzLmF0dHJBcm4gPSBjZGsuVG9rZW4uYXNTdHJpbmcodGhpcy5nZXRBdHQoJ0FybicsIGNkay5SZXNvbHV0aW9uVHlwZUhpbnQuU1RSSU5HKSk7XG4gICAgICAgIHRoaXMuYXR0ckluZGV4U3RhdGUgPSBjZGsuVG9rZW4uYXNTdHJpbmcodGhpcy5nZXRBdHQoJ0luZGV4U3RhdGUnLCBjZGsuUmVzb2x1dGlvblR5cGVIaW50LlNUUklORykpO1xuXG4gICAgICAgIHRoaXMudHlwZSA9IHByb3BzLnR5cGU7XG4gICAgICAgIHRoaXMudGFncyA9IG5ldyBjZGsuVGFnTWFuYWdlcihjZGsuVGFnVHlwZS5NQVAsIFwiQVdTOjpSZXNvdXJjZUV4cGxvcmVyMjo6SW5kZXhcIiwgcHJvcHMudGFncywgeyB0YWdQcm9wZXJ0eU5hbWU6ICd0YWdzJyB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGFtaW5lcyB0aGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgYW5kIGRpc2Nsb3NlcyBhdHRyaWJ1dGVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIGluc3BlY3RvciAtIHRyZWUgaW5zcGVjdG9yIHRvIGNvbGxlY3QgYW5kIHByb2Nlc3MgYXR0cmlidXRlc1xuICAgICAqXG4gICAgICovXG4gICAgcHVibGljIGluc3BlY3QoaW5zcGVjdG9yOiBjZGsuVHJlZUluc3BlY3Rvcikge1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjp0eXBlXCIsIENmbkluZGV4LkNGTl9SRVNPVVJDRV9UWVBFX05BTUUpO1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjpwcm9wc1wiLCB0aGlzLmNmblByb3BlcnRpZXMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXQgY2ZuUHJvcGVydGllcygpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICAgICAgICB0YWdzOiB0aGlzLnRhZ3MucmVuZGVyVGFncygpLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCByZW5kZXJQcm9wZXJ0aWVzKHByb3BzOiB7W2tleTogc3RyaW5nXTogYW55fSk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIGNmbkluZGV4UHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BzKTtcbiAgICB9XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBgQ2ZuVmlld2BcbiAqXG4gKiBAc3RydWN0XG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtcmVzb3VyY2VleHBsb3JlcjItdmlldy5odG1sXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2ZuVmlld1Byb3BzIHtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBuZXcgdmlldy5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXJlc291cmNlZXhwbG9yZXIyLXZpZXcuaHRtbCNjZm4tcmVzb3VyY2VleHBsb3JlcjItdmlldy12aWV3bmFtZVxuICAgICAqL1xuICAgIHJlYWRvbmx5IHZpZXdOYW1lOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBBbiBhcnJheSBvZiBzdHJpbmdzIHRoYXQgaW5jbHVkZSBzZWFyY2gga2V5d29yZHMsIHByZWZpeGVzLCBhbmQgb3BlcmF0b3JzIHRoYXQgZmlsdGVyIHRoZSByZXN1bHRzIHRoYXQgYXJlIHJldHVybmVkIGZvciBxdWVyaWVzIG1hZGUgdXNpbmcgdGhpcyB2aWV3LiBXaGVuIHlvdSB1c2UgdGhpcyB2aWV3IGluIGEgW1NlYXJjaF0oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3Jlc291cmNlLWV4cGxvcmVyL2xhdGVzdC9BUElSZWZlcmVuY2UvQVBJX1NlYXJjaC5odG1sKSBvcGVyYXRpb24sIHRoZSBmaWx0ZXIgc3RyaW5nIGlzIGNvbWJpbmVkIHdpdGggdGhlIHNlYXJjaCdzIGBRdWVyeVN0cmluZ2AgcGFyYW1ldGVyIHVzaW5nIGEgbG9naWNhbCBgQU5EYCBvcGVyYXRvci5cbiAgICAgKlxuICAgICAqIEZvciBpbmZvcm1hdGlvbiBhYm91dCB0aGUgc3VwcG9ydGVkIHN5bnRheCwgc2VlIFtTZWFyY2ggcXVlcnkgcmVmZXJlbmNlIGZvciBSZXNvdXJjZSBFeHBsb3Jlcl0oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3Jlc291cmNlLWV4cGxvcmVyL2xhdGVzdC91c2VyZ3VpZGUvdXNpbmctc2VhcmNoLXF1ZXJ5LXN5bnRheC5odG1sKSBpbiB0aGUgKkFXUyBSZXNvdXJjZSBFeHBsb3JlciBVc2VyIEd1aWRlKiAuXG4gICAgICpcbiAgICAgKiA+IFRoaXMgcXVlcnkgc3RyaW5nIGluIHRoZSBjb250ZXh0IG9mIHRoaXMgb3BlcmF0aW9uIHN1cHBvcnRzIG9ubHkgW2ZpbHRlciBwcmVmaXhlc10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3Jlc291cmNlLWV4cGxvcmVyL2xhdGVzdC91c2VyZ3VpZGUvdXNpbmctc2VhcmNoLXF1ZXJ5LXN5bnRheC5odG1sI3F1ZXJ5LXN5bnRheC1maWx0ZXJzKSB3aXRoIG9wdGlvbmFsIFtvcGVyYXRvcnNdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9yZXNvdXJjZS1leHBsb3Jlci9sYXRlc3QvdXNlcmd1aWRlL3VzaW5nLXNlYXJjaC1xdWVyeS1zeW50YXguaHRtbCNxdWVyeS1zeW50YXgtb3BlcmF0b3JzKSAuIEl0IGRvZXNuJ3Qgc3VwcG9ydCBmcmVlLWZvcm0gdGV4dC4gRm9yIGV4YW1wbGUsIHRoZSBzdHJpbmcgYHJlZ2lvbjp1cyogc2VydmljZTplYzIgLXRhZzpzdGFnZT1wcm9kYCBpbmNsdWRlcyBhbGwgQW1hem9uIEVDMiByZXNvdXJjZXMgaW4gYW55IEFXUyBSZWdpb24gdGhhdCBiZWdpbiB3aXRoIHRoZSBsZXR0ZXJzIGB1c2AgYW5kIGFyZSAqbm90KiB0YWdnZWQgd2l0aCBhIGtleSBgU3RhZ2VgIHRoYXQgaGFzIHRoZSB2YWx1ZSBgcHJvZGAgLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtcmVzb3VyY2VleHBsb3JlcjItdmlldy5odG1sI2Nmbi1yZXNvdXJjZWV4cGxvcmVyMi12aWV3LWZpbHRlcnNcbiAgICAgKi9cbiAgICByZWFkb25seSBmaWx0ZXJzPzogQ2ZuVmlldy5GaWx0ZXJzUHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU7XG5cbiAgICAvKipcbiAgICAgKiBBIGxpc3Qgb2YgZmllbGRzIHRoYXQgcHJvdmlkZSBhZGRpdGlvbmFsIGluZm9ybWF0aW9uIGFib3V0IHRoZSB2aWV3LlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtcmVzb3VyY2VleHBsb3JlcjItdmlldy5odG1sI2Nmbi1yZXNvdXJjZWV4cGxvcmVyMi12aWV3LWluY2x1ZGVkcHJvcGVydGllc1xuICAgICAqL1xuICAgIHJlYWRvbmx5IGluY2x1ZGVkUHJvcGVydGllcz86IEFycmF5PENmblZpZXcuSW5jbHVkZWRQcm9wZXJ0eVByb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlPiB8IGNkay5JUmVzb2x2YWJsZTtcblxuICAgIC8qKlxuICAgICAqIFRhZyBrZXkgYW5kIHZhbHVlIHBhaXJzIHRoYXQgYXJlIGF0dGFjaGVkIHRvIHRoZSB2aWV3LlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtcmVzb3VyY2VleHBsb3JlcjItdmlldy5odG1sI2Nmbi1yZXNvdXJjZWV4cGxvcmVyMi12aWV3LXRhZ3NcbiAgICAgKi9cbiAgICByZWFkb25seSB0YWdzPzogeyBba2V5OiBzdHJpbmddOiAoc3RyaW5nKSB9O1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENmblZpZXdQcm9wc2BcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuVmlld1Byb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHZhbGlkYXRpb24uXG4gKi9cbmZ1bmN0aW9uIENmblZpZXdQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2ZpbHRlcnMnLCBDZm5WaWV3X0ZpbHRlcnNQcm9wZXJ0eVZhbGlkYXRvcikocHJvcGVydGllcy5maWx0ZXJzKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdpbmNsdWRlZFByb3BlcnRpZXMnLCBjZGsubGlzdFZhbGlkYXRvcihDZm5WaWV3X0luY2x1ZGVkUHJvcGVydHlQcm9wZXJ0eVZhbGlkYXRvcikpKHByb3BlcnRpZXMuaW5jbHVkZWRQcm9wZXJ0aWVzKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd0YWdzJywgY2RrLmhhc2hWYWxpZGF0b3IoY2RrLnZhbGlkYXRlU3RyaW5nKSkocHJvcGVydGllcy50YWdzKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCd2aWV3TmFtZScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy52aWV3TmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndmlld05hbWUnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMudmlld05hbWUpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiQ2ZuVmlld1Byb3BzXCInKTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpSZXNvdXJjZUV4cGxvcmVyMjo6Vmlld2AgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuVmlld1Byb3BzYFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpSZXNvdXJjZUV4cGxvcmVyMjo6Vmlld2AgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5WaWV3UHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmblZpZXdQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgVmlld05hbWU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMudmlld05hbWUpLFxuICAgICAgICBGaWx0ZXJzOiBjZm5WaWV3RmlsdGVyc1Byb3BlcnR5VG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmZpbHRlcnMpLFxuICAgICAgICBJbmNsdWRlZFByb3BlcnRpZXM6IGNkay5saXN0TWFwcGVyKGNmblZpZXdJbmNsdWRlZFByb3BlcnR5UHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKShwcm9wZXJ0aWVzLmluY2x1ZGVkUHJvcGVydGllcyksXG4gICAgICAgIFRhZ3M6IGNkay5oYXNoTWFwcGVyKGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKShwcm9wZXJ0aWVzLnRhZ3MpLFxuICAgIH07XG59XG5cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBDZm5WaWV3UHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5WaWV3UHJvcHM+IHtcbiAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyA9PSBudWxsID8ge30gOiBwcm9wZXJ0aWVzO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBjb25zdCByZXQgPSBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblByb3BlcnR5T2JqZWN0PENmblZpZXdQcm9wcz4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3ZpZXdOYW1lJywgJ1ZpZXdOYW1lJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5WaWV3TmFtZSkpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnZmlsdGVycycsICdGaWx0ZXJzJywgcHJvcGVydGllcy5GaWx0ZXJzICE9IG51bGwgPyBDZm5WaWV3RmlsdGVyc1Byb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuRmlsdGVycykgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnaW5jbHVkZWRQcm9wZXJ0aWVzJywgJ0luY2x1ZGVkUHJvcGVydGllcycsIHByb3BlcnRpZXMuSW5jbHVkZWRQcm9wZXJ0aWVzICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldEFycmF5KENmblZpZXdJbmNsdWRlZFByb3BlcnR5UHJvcGVydHlGcm9tQ2xvdWRGb3JtYXRpb24pKHByb3BlcnRpZXMuSW5jbHVkZWRQcm9wZXJ0aWVzKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCd0YWdzJywgJ1RhZ3MnLCBwcm9wZXJ0aWVzLlRhZ3MgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0TWFwKGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKShwcm9wZXJ0aWVzLlRhZ3MpIDogdW5kZWZpbmVkIGFzIGFueSk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogQSBDbG91ZEZvcm1hdGlvbiBgQVdTOjpSZXNvdXJjZUV4cGxvcmVyMjo6Vmlld2BcbiAqXG4gKiBDcmVhdGVzIGEgdmlldyB0aGF0IHVzZXJzIGNhbiBxdWVyeSBieSB1c2luZyB0aGUgW1NlYXJjaF0oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3Jlc291cmNlLWV4cGxvcmVyL2xhdGVzdC9BUElSZWZlcmVuY2UvQVBJX1NlYXJjaC5odG1sKSBvcGVyYXRpb24uIFJlc3VsdHMgZnJvbSBxdWVyaWVzIHRoYXQgeW91IG1ha2UgdXNpbmcgdGhpcyB2aWV3IGluY2x1ZGUgb25seSByZXNvdXJjZXMgdGhhdCBtYXRjaCB0aGUgdmlldydzIGBGaWx0ZXJzYCAuXG4gKlxuICogPiBUbyBzdWNjZXNzZnVsbHkgY3JlYXRlIGEgdmlldywgeW91IG11c3QgaGF2ZSBgcmVzb3VyY2UtZXhwbG9yZXItMjpUYWdSZXNvdXJjZWAgcGVybWlzc2lvbiwgZXZlbiBpZiB5b3UgZG9uJ3Qgc3BlY2lmeSB0YWdzIHRvIGJlIGFkZGVkIHRvIHRoZSB2aWV3LlxuICpcbiAqIEBjbG91ZGZvcm1hdGlvblJlc291cmNlIEFXUzo6UmVzb3VyY2VFeHBsb3JlcjI6OlZpZXdcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yZXNvdXJjZWV4cGxvcmVyMi12aWV3Lmh0bWxcbiAqL1xuZXhwb3J0IGNsYXNzIENmblZpZXcgZXh0ZW5kcyBjZGsuQ2ZuUmVzb3VyY2UgaW1wbGVtZW50cyBjZGsuSUluc3BlY3RhYmxlIHtcbiAgICAvKipcbiAgICAgKiBUaGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgdHlwZSBuYW1lIGZvciB0aGlzIHJlc291cmNlIGNsYXNzLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSA9IFwiQVdTOjpSZXNvdXJjZUV4cGxvcmVyMjo6Vmlld1wiO1xuXG4gICAgLyoqXG4gICAgICogQSBmYWN0b3J5IG1ldGhvZCB0aGF0IGNyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcyBmcm9tIGFuIG9iamVjdFxuICAgICAqIGNvbnRhaW5pbmcgdGhlIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgdGhpcyByZXNvdXJjZS5cbiAgICAgKiBVc2VkIGluIHRoZSBAYXdzLWNkay9jbG91ZGZvcm1hdGlvbi1pbmNsdWRlIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgX2Zyb21DbG91ZEZvcm1hdGlvbihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHJlc291cmNlQXR0cmlidXRlczogYW55LCBvcHRpb25zOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uT3B0aW9ucyk6IENmblZpZXcge1xuICAgICAgICByZXNvdXJjZUF0dHJpYnV0ZXMgPSByZXNvdXJjZUF0dHJpYnV0ZXMgfHwge307XG4gICAgICAgIGNvbnN0IHJlc291cmNlUHJvcGVydGllcyA9IG9wdGlvbnMucGFyc2VyLnBhcnNlVmFsdWUocmVzb3VyY2VBdHRyaWJ1dGVzLlByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCBwcm9wc1Jlc3VsdCA9IENmblZpZXdQcm9wc0Zyb21DbG91ZEZvcm1hdGlvbihyZXNvdXJjZVByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCByZXQgPSBuZXcgQ2ZuVmlldyhzY29wZSwgaWQsIHByb3BzUmVzdWx0LnZhbHVlKTtcbiAgICAgICAgZm9yIChjb25zdCBbcHJvcEtleSwgcHJvcFZhbF0gb2YgT2JqZWN0LmVudHJpZXMocHJvcHNSZXN1bHQuZXh0cmFQcm9wZXJ0aWVzKSkgIHtcbiAgICAgICAgICAgIHJldC5hZGRQcm9wZXJ0eU92ZXJyaWRlKHByb3BLZXksIHByb3BWYWwpO1xuICAgICAgICB9XG4gICAgICAgIG9wdGlvbnMucGFyc2VyLmhhbmRsZUF0dHJpYnV0ZXMocmV0LCByZXNvdXJjZUF0dHJpYnV0ZXMsIGlkKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgQVJOIG9mIHRoZSBuZXcgdmlldy4gRm9yIGV4YW1wbGU6XG4gICAgICpcbiAgICAgKiBgYXJuOmF3czpyZXNvdXJjZS1leHBsb3Jlci0yOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6dmlldy9NeVZpZXcvRVhBTVBMRTgtOTBhYi1jZGVmLWZlZGMtRVhBTVBMRTIyMjIyYFxuICAgICAqIEBjbG91ZGZvcm1hdGlvbkF0dHJpYnV0ZSBWaWV3QXJuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGF0dHJWaWV3QXJuOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgbmV3IHZpZXcuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yZXNvdXJjZWV4cGxvcmVyMi12aWV3Lmh0bWwjY2ZuLXJlc291cmNlZXhwbG9yZXIyLXZpZXctdmlld25hbWVcbiAgICAgKi9cbiAgICBwdWJsaWMgdmlld05hbWU6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIEFuIGFycmF5IG9mIHN0cmluZ3MgdGhhdCBpbmNsdWRlIHNlYXJjaCBrZXl3b3JkcywgcHJlZml4ZXMsIGFuZCBvcGVyYXRvcnMgdGhhdCBmaWx0ZXIgdGhlIHJlc3VsdHMgdGhhdCBhcmUgcmV0dXJuZWQgZm9yIHF1ZXJpZXMgbWFkZSB1c2luZyB0aGlzIHZpZXcuIFdoZW4geW91IHVzZSB0aGlzIHZpZXcgaW4gYSBbU2VhcmNoXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vcmVzb3VyY2UtZXhwbG9yZXIvbGF0ZXN0L0FQSVJlZmVyZW5jZS9BUElfU2VhcmNoLmh0bWwpIG9wZXJhdGlvbiwgdGhlIGZpbHRlciBzdHJpbmcgaXMgY29tYmluZWQgd2l0aCB0aGUgc2VhcmNoJ3MgYFF1ZXJ5U3RyaW5nYCBwYXJhbWV0ZXIgdXNpbmcgYSBsb2dpY2FsIGBBTkRgIG9wZXJhdG9yLlxuICAgICAqXG4gICAgICogRm9yIGluZm9ybWF0aW9uIGFib3V0IHRoZSBzdXBwb3J0ZWQgc3ludGF4LCBzZWUgW1NlYXJjaCBxdWVyeSByZWZlcmVuY2UgZm9yIFJlc291cmNlIEV4cGxvcmVyXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vcmVzb3VyY2UtZXhwbG9yZXIvbGF0ZXN0L3VzZXJndWlkZS91c2luZy1zZWFyY2gtcXVlcnktc3ludGF4Lmh0bWwpIGluIHRoZSAqQVdTIFJlc291cmNlIEV4cGxvcmVyIFVzZXIgR3VpZGUqIC5cbiAgICAgKlxuICAgICAqID4gVGhpcyBxdWVyeSBzdHJpbmcgaW4gdGhlIGNvbnRleHQgb2YgdGhpcyBvcGVyYXRpb24gc3VwcG9ydHMgb25seSBbZmlsdGVyIHByZWZpeGVzXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vcmVzb3VyY2UtZXhwbG9yZXIvbGF0ZXN0L3VzZXJndWlkZS91c2luZy1zZWFyY2gtcXVlcnktc3ludGF4Lmh0bWwjcXVlcnktc3ludGF4LWZpbHRlcnMpIHdpdGggb3B0aW9uYWwgW29wZXJhdG9yc10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3Jlc291cmNlLWV4cGxvcmVyL2xhdGVzdC91c2VyZ3VpZGUvdXNpbmctc2VhcmNoLXF1ZXJ5LXN5bnRheC5odG1sI3F1ZXJ5LXN5bnRheC1vcGVyYXRvcnMpIC4gSXQgZG9lc24ndCBzdXBwb3J0IGZyZWUtZm9ybSB0ZXh0LiBGb3IgZXhhbXBsZSwgdGhlIHN0cmluZyBgcmVnaW9uOnVzKiBzZXJ2aWNlOmVjMiAtdGFnOnN0YWdlPXByb2RgIGluY2x1ZGVzIGFsbCBBbWF6b24gRUMyIHJlc291cmNlcyBpbiBhbnkgQVdTIFJlZ2lvbiB0aGF0IGJlZ2luIHdpdGggdGhlIGxldHRlcnMgYHVzYCBhbmQgYXJlICpub3QqIHRhZ2dlZCB3aXRoIGEga2V5IGBTdGFnZWAgdGhhdCBoYXMgdGhlIHZhbHVlIGBwcm9kYCAuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yZXNvdXJjZWV4cGxvcmVyMi12aWV3Lmh0bWwjY2ZuLXJlc291cmNlZXhwbG9yZXIyLXZpZXctZmlsdGVyc1xuICAgICAqL1xuICAgIHB1YmxpYyBmaWx0ZXJzOiBDZm5WaWV3LkZpbHRlcnNQcm9wZXJ0eSB8IGNkay5JUmVzb2x2YWJsZSB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIEEgbGlzdCBvZiBmaWVsZHMgdGhhdCBwcm92aWRlIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gYWJvdXQgdGhlIHZpZXcuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yZXNvdXJjZWV4cGxvcmVyMi12aWV3Lmh0bWwjY2ZuLXJlc291cmNlZXhwbG9yZXIyLXZpZXctaW5jbHVkZWRwcm9wZXJ0aWVzXG4gICAgICovXG4gICAgcHVibGljIGluY2x1ZGVkUHJvcGVydGllczogQXJyYXk8Q2ZuVmlldy5JbmNsdWRlZFByb3BlcnR5UHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHwgY2RrLklSZXNvbHZhYmxlIHwgdW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogVGFnIGtleSBhbmQgdmFsdWUgcGFpcnMgdGhhdCBhcmUgYXR0YWNoZWQgdG8gdGhlIHZpZXcuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1yZXNvdXJjZWV4cGxvcmVyMi12aWV3Lmh0bWwjY2ZuLXJlc291cmNlZXhwbG9yZXIyLXZpZXctdGFnc1xuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSB0YWdzOiBjZGsuVGFnTWFuYWdlcjtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBgQVdTOjpSZXNvdXJjZUV4cGxvcmVyMjo6Vmlld2AuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2NvcGUgLSBzY29wZSBpbiB3aGljaCB0aGlzIHJlc291cmNlIGlzIGRlZmluZWRcbiAgICAgKiBAcGFyYW0gaWQgICAgLSBzY29wZWQgaWQgb2YgdGhlIHJlc291cmNlXG4gICAgICogQHBhcmFtIHByb3BzIC0gcmVzb3VyY2UgcHJvcGVydGllc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENmblZpZXdQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHsgdHlwZTogQ2ZuVmlldy5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FLCBwcm9wZXJ0aWVzOiBwcm9wcyB9KTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ3ZpZXdOYW1lJywgdGhpcyk7XG4gICAgICAgIHRoaXMuYXR0clZpZXdBcm4gPSBjZGsuVG9rZW4uYXNTdHJpbmcodGhpcy5nZXRBdHQoJ1ZpZXdBcm4nLCBjZGsuUmVzb2x1dGlvblR5cGVIaW50LlNUUklORykpO1xuXG4gICAgICAgIHRoaXMudmlld05hbWUgPSBwcm9wcy52aWV3TmFtZTtcbiAgICAgICAgdGhpcy5maWx0ZXJzID0gcHJvcHMuZmlsdGVycztcbiAgICAgICAgdGhpcy5pbmNsdWRlZFByb3BlcnRpZXMgPSBwcm9wcy5pbmNsdWRlZFByb3BlcnRpZXM7XG4gICAgICAgIHRoaXMudGFncyA9IG5ldyBjZGsuVGFnTWFuYWdlcihjZGsuVGFnVHlwZS5NQVAsIFwiQVdTOjpSZXNvdXJjZUV4cGxvcmVyMjo6Vmlld1wiLCBwcm9wcy50YWdzLCB7IHRhZ1Byb3BlcnR5TmFtZTogJ3RhZ3MnIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4YW1pbmVzIHRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBhbmQgZGlzY2xvc2VzIGF0dHJpYnV0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5zcGVjdG9yIC0gdHJlZSBpbnNwZWN0b3IgdG8gY29sbGVjdCBhbmQgcHJvY2VzcyBhdHRyaWJ1dGVzXG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5zcGVjdChpbnNwZWN0b3I6IGNkay5UcmVlSW5zcGVjdG9yKSB7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnR5cGVcIiwgQ2ZuVmlldy5DRk5fUkVTT1VSQ0VfVFlQRV9OQU1FKTtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246cHJvcHNcIiwgdGhpcy5jZm5Qcm9wZXJ0aWVzKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZ2V0IGNmblByb3BlcnRpZXMoKTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmlld05hbWU6IHRoaXMudmlld05hbWUsXG4gICAgICAgICAgICBmaWx0ZXJzOiB0aGlzLmZpbHRlcnMsXG4gICAgICAgICAgICBpbmNsdWRlZFByb3BlcnRpZXM6IHRoaXMuaW5jbHVkZWRQcm9wZXJ0aWVzLFxuICAgICAgICAgICAgdGFnczogdGhpcy50YWdzLnJlbmRlclRhZ3MoKSxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcmVuZGVyUHJvcGVydGllcyhwcm9wczoge1trZXk6IHN0cmluZ106IGFueX0pOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiBjZm5WaWV3UHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BzKTtcbiAgICB9XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuVmlldyB7XG4gICAgLyoqXG4gICAgICogQW4gb2JqZWN0IHdpdGggYSBgRmlsdGVyU3RyaW5nYCB0aGF0IHNwZWNpZmllcyB3aGljaCByZXNvdXJjZXMgdG8gaW5jbHVkZSBpbiB0aGUgcmVzdWx0cyBvZiBxdWVyaWVzIG1hZGUgdXNpbmcgdGhpcyB2aWV3LlxuICAgICAqXG4gICAgICogQHN0cnVjdFxuICAgICAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtcmVzb3VyY2VleHBsb3JlcjItdmlldy1maWx0ZXJzLmh0bWxcbiAgICAgKi9cbiAgICBleHBvcnQgaW50ZXJmYWNlIEZpbHRlcnNQcm9wZXJ0eSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBgQ2ZuVmlldy5GaWx0ZXJzUHJvcGVydHkuRmlsdGVyU3RyaW5nYFxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXJlc291cmNlZXhwbG9yZXIyLXZpZXctZmlsdGVycy5odG1sI2Nmbi1yZXNvdXJjZWV4cGxvcmVyMi12aWV3LWZpbHRlcnMtZmlsdGVyc3RyaW5nXG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBmaWx0ZXJTdHJpbmc6IHN0cmluZztcbiAgICB9XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHByb3BlcnRpZXMgbWF0Y2ggdGhvc2Ugb2YgYSBgRmlsdGVyc1Byb3BlcnR5YFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBGaWx0ZXJzUHJvcGVydHlgXG4gKlxuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgdmFsaWRhdGlvbi5cbiAqL1xuZnVuY3Rpb24gQ2ZuVmlld19GaWx0ZXJzUHJvcGVydHlWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdmaWx0ZXJTdHJpbmcnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMuZmlsdGVyU3RyaW5nKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdmaWx0ZXJTdHJpbmcnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuZmlsdGVyU3RyaW5nKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkZpbHRlcnNQcm9wZXJ0eVwiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6UmVzb3VyY2VFeHBsb3JlcjI6OlZpZXcuRmlsdGVyc2AgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgRmlsdGVyc1Byb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpSZXNvdXJjZUV4cGxvcmVyMjo6Vmlldy5GaWx0ZXJzYCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmblZpZXdGaWx0ZXJzUHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmblZpZXdfRmlsdGVyc1Byb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBGaWx0ZXJTdHJpbmc6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuZmlsdGVyU3RyaW5nKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuVmlld0ZpbHRlcnNQcm9wZXJ0eUZyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmblZpZXcuRmlsdGVyc1Byb3BlcnR5IHwgY2RrLklSZXNvbHZhYmxlPiB7XG4gICAgaWYgKGNkay5pc1Jlc29sdmFibGVPYmplY3QocHJvcGVydGllcykpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcyA9PSBudWxsID8ge30gOiBwcm9wZXJ0aWVzO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0KHByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBjb25zdCByZXQgPSBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblByb3BlcnR5T2JqZWN0PENmblZpZXcuRmlsdGVyc1Byb3BlcnR5PigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnZmlsdGVyU3RyaW5nJywgJ0ZpbHRlclN0cmluZycsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuRmlsdGVyU3RyaW5nKSk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ2ZuVmlldyB7XG4gICAgLyoqXG4gICAgICogSW5mb3JtYXRpb24gYWJvdXQgYW4gYWRkaXRpb25hbCBwcm9wZXJ0eSB0aGF0IGRlc2NyaWJlcyBhIHJlc291cmNlLCB0aGF0IHlvdSBjYW4gb3B0aW9uYWxseSBpbmNsdWRlIGluIGEgdmlldy5cbiAgICAgKlxuICAgICAqIEBzdHJ1Y3RcbiAgICAgKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXJlc291cmNlZXhwbG9yZXIyLXZpZXctaW5jbHVkZWRwcm9wZXJ0eS5odG1sXG4gICAgICovXG4gICAgZXhwb3J0IGludGVyZmFjZSBJbmNsdWRlZFByb3BlcnR5UHJvcGVydHkge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IHRoYXQgaXMgaW5jbHVkZWQgaW4gdGhpcyB2aWV3LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLXJlc291cmNlZXhwbG9yZXIyLXZpZXctaW5jbHVkZWRwcm9wZXJ0eS5odG1sI2Nmbi1yZXNvdXJjZWV4cGxvcmVyMi12aWV3LWluY2x1ZGVkcHJvcGVydHktbmFtZVxuICAgICAgICAgKi9cbiAgICAgICAgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBJbmNsdWRlZFByb3BlcnR5UHJvcGVydHlgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYEluY2x1ZGVkUHJvcGVydHlQcm9wZXJ0eWBcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5WaWV3X0luY2x1ZGVkUHJvcGVydHlQcm9wZXJ0eVZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ25hbWUnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMubmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5uYW1lKSk7XG4gICAgcmV0dXJuIGVycm9ycy53cmFwKCdzdXBwbGllZCBwcm9wZXJ0aWVzIG5vdCBjb3JyZWN0IGZvciBcIkluY2x1ZGVkUHJvcGVydHlQcm9wZXJ0eVwiJyk7XG59XG5cbi8qKlxuICogUmVuZGVycyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6UmVzb3VyY2VFeHBsb3JlcjI6OlZpZXcuSW5jbHVkZWRQcm9wZXJ0eWAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgSW5jbHVkZWRQcm9wZXJ0eVByb3BlcnR5YFxuICpcbiAqIEByZXR1cm5zIHRoZSBBV1MgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiBhbiBgQVdTOjpSZXNvdXJjZUV4cGxvcmVyMjo6Vmlldy5JbmNsdWRlZFByb3BlcnR5YCByZXNvdXJjZS5cbiAqL1xuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIGNmblZpZXdJbmNsdWRlZFByb3BlcnR5UHJvcGVydHlUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmblZpZXdfSW5jbHVkZWRQcm9wZXJ0eVByb3BlcnR5VmFsaWRhdG9yKHByb3BlcnRpZXMpLmFzc2VydFN1Y2Nlc3MoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBOYW1lOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLm5hbWUpLFxuICAgIH07XG59XG5cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBDZm5WaWV3SW5jbHVkZWRQcm9wZXJ0eVByb3BlcnR5RnJvbUNsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQ8Q2ZuVmlldy5JbmNsdWRlZFByb3BlcnR5UHJvcGVydHkgfCBjZGsuSVJlc29sdmFibGU+IHtcbiAgICBpZiAoY2RrLmlzUmVzb2x2YWJsZU9iamVjdChwcm9wZXJ0aWVzKSkge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuVmlldy5JbmNsdWRlZFByb3BlcnR5UHJvcGVydHk+KCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCduYW1lJywgJ05hbWUnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLk5hbWUpKTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cbiJdfQ==