/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Sets the specified view as the default for the AWS Region in which you call this operation.
 *
 * If a user makes a search query that doesn't explicitly specify the view to use, Resource Explorer chooses this default view automatically for searches performed in this AWS Region .
 *
 * @cloudformationResource AWS::ResourceExplorer2::DefaultViewAssociation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-defaultviewassociation.html
 */
export class CfnDefaultViewAssociation extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ResourceExplorer2::DefaultViewAssociation";

  /**
   * Build a CfnDefaultViewAssociation from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDefaultViewAssociation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The unique identifier of the principal for which the specified view was made the default for the AWS Region that contains the view. For example:
   *
   * `123456789012`
   *
   * @cloudformationAttribute AssociatedAwsPrincipal
   */
  public readonly attrAssociatedAwsPrincipal: string;

  /**
   * The ARN of the view to set as the default for the AWS Region and AWS account in which you call this operation.
   */
  public viewArn: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDefaultViewAssociationProps) {
    super(scope, id, {
      "type": CfnDefaultViewAssociation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "viewArn", this);

    this.attrAssociatedAwsPrincipal = cdk.Token.asString(this.getAtt("AssociatedAwsPrincipal", cdk.ResolutionTypeHint.STRING));
    this.viewArn = props.viewArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "viewArn": this.viewArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDefaultViewAssociation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDefaultViewAssociationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnDefaultViewAssociation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-defaultviewassociation.html
 */
export interface CfnDefaultViewAssociationProps {
  /**
   * The ARN of the view to set as the default for the AWS Region and AWS account in which you call this operation.
   *
   * The specified view must already exist in the specified Region.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-defaultviewassociation.html#cfn-resourceexplorer2-defaultviewassociation-viewarn
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
// @ts-ignore TS6133
function CfnDefaultViewAssociationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("viewArn", cdk.requiredValidator)(properties.viewArn));
  errors.collect(cdk.propertyValidator("viewArn", cdk.validateString)(properties.viewArn));
  return errors.wrap("supplied properties not correct for \"CfnDefaultViewAssociationProps\"");
}

// @ts-ignore TS6133
function convertCfnDefaultViewAssociationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDefaultViewAssociationPropsValidator(properties).assertSuccess();
  return {
    "ViewArn": cdk.stringToCloudFormation(properties.viewArn)
  };
}

// @ts-ignore TS6133
function CfnDefaultViewAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDefaultViewAssociationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDefaultViewAssociationProps>();
  ret.addPropertyResult("viewArn", "ViewArn", (properties.ViewArn != null ? cfn_parse.FromCloudFormation.getString(properties.ViewArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Turns on Resource Explorer in the AWS Region in which you called this operation by creating an index.
 *
 * Resource Explorer begins discovering the resources in this Region and stores the details about the resources in the index so that they can be queried by using the [Search](https://docs.aws.amazon.com/resource-explorer/latest/apireference/API_Search.html) operation.
 *
 * You can create either a local index that returns search results from only the AWS Region in which the index exists, or you can create an aggregator index that returns search results from all AWS Regions in the AWS account .
 *
 * For more details about what happens when you turn on Resource Explorer in an AWS Region , see [Turning on Resource Explorer to index your resources in an AWS Region](https://docs.aws.amazon.com/resource-explorer/latest/userguide/manage-service-activate.html) in the *AWS Resource Explorer User Guide.*
 *
 * If this is the first AWS Region in which you've created an index for Resource Explorer, this operation also creates a service-linked role in your AWS account that allows Resource Explorer to search for your resources and populate the index.
 *
 * @cloudformationResource AWS::ResourceExplorer2::Index
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-index.html
 */
export class CfnIndex extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ResourceExplorer2::Index";

  /**
   * Build a CfnIndex from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnIndex(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the new index for the AWS Region . For example:
   *
   * `arn:aws:resource-explorer-2:us-east-1:123456789012:index/EXAMPLE8-90ab-cdef-fedc-EXAMPLE22222`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Indicates the current state of the index. For example:
   *
   * `CREATING`
   *
   * @cloudformationAttribute IndexState
   */
  public readonly attrIndexState: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The specified tags are attached to only the index created in this AWS Region .
   */
  public tagsRaw?: Record<string, string>;

  /**
   * Specifies the type of the index in this Region.
   */
  public type: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnIndexProps) {
    super(scope, id, {
      "type": CfnIndex.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "type", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrIndexState = cdk.Token.asString(this.getAtt("IndexState", cdk.ResolutionTypeHint.STRING));
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::ResourceExplorer2::Index", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.type = props.type;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "tags": this.tags.renderTags(),
      "type": this.type
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnIndex.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnIndexPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnIndex`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-index.html
 */
export interface CfnIndexProps {
  /**
   * The specified tags are attached to only the index created in this AWS Region .
   *
   * The tags don't attach to any of the resources listed in the index.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-index.html#cfn-resourceexplorer2-index-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * Specifies the type of the index in this Region.
   *
   * For information about the aggregator index and how it differs from a local index, see [Turning on cross-Region search by creating an aggregator index](https://docs.aws.amazon.com/resource-explorer/latest/userguide/manage-aggregator-region.html) in the *AWS Resource Explorer User Guide.* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-index.html#cfn-resourceexplorer2-index-type
   */
  readonly type: string;
}

/**
 * Determine whether the given properties match those of a `CfnIndexProps`
 *
 * @param properties - the TypeScript properties of a `CfnIndexProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIndexPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CfnIndexProps\"");
}

// @ts-ignore TS6133
function convertCfnIndexPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIndexPropsValidator(properties).assertSuccess();
  return {
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnIndexPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIndexProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIndexProps>();
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a view that users can query by using the [Search](https://docs.aws.amazon.com/resource-explorer/latest/apireference/API_Search.html) operation. Results from queries that you make using this view include only resources that match the view's `Filters` .
 *
 * @cloudformationResource AWS::ResourceExplorer2::View
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-view.html
 */
export class CfnView extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ResourceExplorer2::View";

  /**
   * Build a CfnView from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnView(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the new view. For example:
   *
   * `arn:aws:resource-explorer-2:us-east-1:123456789012:view/MyView/EXAMPLE8-90ab-cdef-fedc-EXAMPLE22222`
   *
   * @cloudformationAttribute ViewArn
   */
  public readonly attrViewArn: string;

  /**
   * An array of strings that include search keywords, prefixes, and operators that filter the results that are returned for queries made using this view.
   */
  public filters?: CfnView.FiltersProperty | cdk.IResolvable;

  /**
   * A list of fields that provide additional information about the view.
   */
  public includedProperties?: Array<CfnView.IncludedPropertyProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The root ARN of the account, an organizational unit (OU), or an organization ARN.
   */
  public scope?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Tag key and value pairs that are attached to the view.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * The name of the new view.
   */
  public viewName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnViewProps) {
    super(scope, id, {
      "type": CfnView.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "viewName", this);

    this.attrViewArn = cdk.Token.asString(this.getAtt("ViewArn", cdk.ResolutionTypeHint.STRING));
    this.filters = props.filters;
    this.includedProperties = props.includedProperties;
    this.scope = props.scope;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::ResourceExplorer2::View", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.viewName = props.viewName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "filters": this.filters,
      "includedProperties": this.includedProperties,
      "scope": this.scope,
      "tags": this.tags.renderTags(),
      "viewName": this.viewName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnView.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnViewPropsToCloudFormation(props);
  }
}

export namespace CfnView {
  /**
   * A search filter defines which resources can be part of a search query result set.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resourceexplorer2-view-searchfilter.html
   */
  export interface SearchFilterProperty {
    /**
     * The string that contains the search keywords, prefixes, and operators to control the results that can be returned by a Search operation.
     *
     * For information about the supported syntax, see [Search query reference](https://docs.aws.amazon.com/resource-explorer/latest/userguide/using-search-query-syntax.html) in the *AWS Resource Explorer User Guide* .
     *
     * > This query string in the context of this operation supports only [filter prefixes](https://docs.aws.amazon.com/resource-explorer/latest/userguide/using-search-query-syntax.html#query-syntax-filters) with optional [operators](https://docs.aws.amazon.com/resource-explorer/latest/userguide/using-search-query-syntax.html#query-syntax-operators) . It doesn't support free-form text. For example, the string `region:us* service:ec2 -tag:stage=prod` includes all Amazon EC2 resources in any AWS Region that begin with the letters `us` and are *not* tagged with a key `Stage` that has the value `prod` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resourceexplorer2-view-searchfilter.html#cfn-resourceexplorer2-view-searchfilter-filterstring
     */
    readonly filterString: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resourceexplorer2-view-filters.html
   */
  export interface FiltersProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resourceexplorer2-view-filters.html#cfn-resourceexplorer2-view-filters-filterstring
     */
    readonly filterString: string;
  }

  /**
   * Information about an additional property that describes a resource, that you can optionally include in a view.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resourceexplorer2-view-includedproperty.html
   */
  export interface IncludedPropertyProperty {
    /**
     * The name of the property that is included in this view.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resourceexplorer2-view-includedproperty.html#cfn-resourceexplorer2-view-includedproperty-name
     */
    readonly name: string;
  }
}

/**
 * Properties for defining a `CfnView`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-view.html
 */
export interface CfnViewProps {
  /**
   * An array of strings that include search keywords, prefixes, and operators that filter the results that are returned for queries made using this view.
   *
   * When you use this view in a [Search](https://docs.aws.amazon.com/resource-explorer/latest/apireference/API_Search.html) operation, the filter string is combined with the search's `QueryString` parameter using a logical `AND` operator.
   *
   * For information about the supported syntax, see [Search query reference for Resource Explorer](https://docs.aws.amazon.com/resource-explorer/latest/userguide/using-search-query-syntax.html) in the *AWS Resource Explorer User Guide* .
   *
   * > This query string in the context of this operation supports only [filter prefixes](https://docs.aws.amazon.com/resource-explorer/latest/userguide/using-search-query-syntax.html#query-syntax-filters) with optional [operators](https://docs.aws.amazon.com/resource-explorer/latest/userguide/using-search-query-syntax.html#query-syntax-operators) . It doesn't support free-form text. For example, the string `region:us* service:ec2 -tag:stage=prod` includes all Amazon EC2 resources in any AWS Region that begin with the letters `us` and are *not* tagged with a key `Stage` that has the value `prod` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-view.html#cfn-resourceexplorer2-view-filters
   */
  readonly filters?: CfnView.FiltersProperty | cdk.IResolvable;

  /**
   * A list of fields that provide additional information about the view.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-view.html#cfn-resourceexplorer2-view-includedproperties
   */
  readonly includedProperties?: Array<CfnView.IncludedPropertyProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The root ARN of the account, an organizational unit (OU), or an organization ARN.
   *
   * If left empty, the default is account.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-view.html#cfn-resourceexplorer2-view-scope
   */
  readonly scope?: string;

  /**
   * Tag key and value pairs that are attached to the view.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-view.html#cfn-resourceexplorer2-view-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * The name of the new view.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-resourceexplorer2-view.html#cfn-resourceexplorer2-view-viewname
   */
  readonly viewName: string;
}

/**
 * Determine whether the given properties match those of a `SearchFilterProperty`
 *
 * @param properties - the TypeScript properties of a `SearchFilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnViewSearchFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("filterString", cdk.requiredValidator)(properties.filterString));
  errors.collect(cdk.propertyValidator("filterString", cdk.validateString)(properties.filterString));
  return errors.wrap("supplied properties not correct for \"SearchFilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnViewSearchFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnViewSearchFilterPropertyValidator(properties).assertSuccess();
  return {
    "FilterString": cdk.stringToCloudFormation(properties.filterString)
  };
}

// @ts-ignore TS6133
function CfnViewSearchFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnView.SearchFilterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnView.SearchFilterProperty>();
  ret.addPropertyResult("filterString", "FilterString", (properties.FilterString != null ? cfn_parse.FromCloudFormation.getString(properties.FilterString) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FiltersProperty`
 *
 * @param properties - the TypeScript properties of a `FiltersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnViewFiltersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("filterString", cdk.requiredValidator)(properties.filterString));
  errors.collect(cdk.propertyValidator("filterString", cdk.validateString)(properties.filterString));
  return errors.wrap("supplied properties not correct for \"FiltersProperty\"");
}

// @ts-ignore TS6133
function convertCfnViewFiltersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnViewFiltersPropertyValidator(properties).assertSuccess();
  return {
    "FilterString": cdk.stringToCloudFormation(properties.filterString)
  };
}

// @ts-ignore TS6133
function CfnViewFiltersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnView.FiltersProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnView.FiltersProperty>();
  ret.addPropertyResult("filterString", "FilterString", (properties.FilterString != null ? cfn_parse.FromCloudFormation.getString(properties.FilterString) : undefined));
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
// @ts-ignore TS6133
function CfnViewIncludedPropertyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"IncludedPropertyProperty\"");
}

// @ts-ignore TS6133
function convertCfnViewIncludedPropertyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnViewIncludedPropertyPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnViewIncludedPropertyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnView.IncludedPropertyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnView.IncludedPropertyProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnViewProps`
 *
 * @param properties - the TypeScript properties of a `CfnViewProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnViewPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("filters", CfnViewFiltersPropertyValidator)(properties.filters));
  errors.collect(cdk.propertyValidator("includedProperties", cdk.listValidator(CfnViewIncludedPropertyPropertyValidator))(properties.includedProperties));
  errors.collect(cdk.propertyValidator("scope", cdk.validateString)(properties.scope));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("viewName", cdk.requiredValidator)(properties.viewName));
  errors.collect(cdk.propertyValidator("viewName", cdk.validateString)(properties.viewName));
  return errors.wrap("supplied properties not correct for \"CfnViewProps\"");
}

// @ts-ignore TS6133
function convertCfnViewPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnViewPropsValidator(properties).assertSuccess();
  return {
    "Filters": convertCfnViewFiltersPropertyToCloudFormation(properties.filters),
    "IncludedProperties": cdk.listMapper(convertCfnViewIncludedPropertyPropertyToCloudFormation)(properties.includedProperties),
    "Scope": cdk.stringToCloudFormation(properties.scope),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "ViewName": cdk.stringToCloudFormation(properties.viewName)
  };
}

// @ts-ignore TS6133
function CfnViewPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnViewProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnViewProps>();
  ret.addPropertyResult("filters", "Filters", (properties.Filters != null ? CfnViewFiltersPropertyFromCloudFormation(properties.Filters) : undefined));
  ret.addPropertyResult("includedProperties", "IncludedProperties", (properties.IncludedProperties != null ? cfn_parse.FromCloudFormation.getArray(CfnViewIncludedPropertyPropertyFromCloudFormation)(properties.IncludedProperties) : undefined));
  ret.addPropertyResult("scope", "Scope", (properties.Scope != null ? cfn_parse.FromCloudFormation.getString(properties.Scope) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("viewName", "ViewName", (properties.ViewName != null ? cfn_parse.FromCloudFormation.getString(properties.ViewName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}