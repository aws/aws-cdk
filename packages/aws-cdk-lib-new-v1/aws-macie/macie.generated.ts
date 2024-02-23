/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::Macie::AllowList` resource specifies an allow list.
 *
 * In Amazon Macie , an allow list defines specific text or a text pattern for Macie to ignore when it inspects data sources for sensitive data. If data matches text or a text pattern in an allow list, Macie doesn’t report the data in sensitive data findings or sensitive data discovery results, even if the data matches the criteria of a custom data identifier or a managed data identifier. You can create and use allow lists in all the AWS Regions where Macie is currently available except the Asia Pacific (Osaka) Region.
 *
 * Macie supports two types of allow lists:
 *
 * - *Predefined text* - For this type of list ( `S3WordsList` ), you create a line-delimited plaintext file that lists specific text to ignore, and you store the file in an Amazon Simple Storage Service ( Amazon S3 ) bucket. You then configure settings for Macie to access the list in the bucket.
 *
 * This type of list typically contains specific words, phrases, and other kinds of character sequences that aren’t sensitive, aren't likely to change, and don’t necessarily adhere to a common pattern. If you use this type of list, Macie doesn't report occurrences of text that exactly match a complete entry in the list. Macie treats each entry in the list as a string literal value. Matches aren't case sensitive.
 * - *Regular expression* - For this type of list ( `Regex` ), you specify a regular expression that defines a text pattern to ignore. Unlike an allow list with predefined text, you store the regex and all other list settings in Macie .
 *
 * This type of list is helpful if you want to specify text that isn’t sensitive but varies or is likely to change while also adhering to a common pattern. If you use this type of list, Macie doesn't report occurrences of text that completely match the pattern defined by the list.
 *
 * For more information, see [Defining sensitive data exceptions with allow lists](https://docs.aws.amazon.com/macie/latest/user/allow-lists.html) in the *Amazon Macie User Guide* .
 *
 * An `AWS::Macie::Session` resource must exist for an AWS account before you can create an `AWS::Macie::AllowList` resource for the account. Use a [DependsOn attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-dependson.html) to ensure that an `AWS::Macie::Session` resource is created before other Macie resources are created for an account. For example, `"DependsOn": "Session"` .
 *
 * @cloudformationResource AWS::Macie::AllowList
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-allowlist.html
 */
export class CfnAllowList extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Macie::AllowList";

  /**
   * Build a CfnAllowList from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAllowList {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAllowListPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAllowList(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the allow list.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The unique identifier for the allow list.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The current status of the allow list, which indicates whether Amazon Macie can access and use the list's criteria. If the list's criteria specify a regular expression ( `Regex` ), this value is typically `OK` . Macie can compile the expression. If the list's criteria specify an Amazon S3 object ( `S3WordsList` ), possible values are:
   *
   * - `OK` - Macie can retrieve and parse the contents of the object.
   * - `S3_OBJECT_ACCESS_DENIED` - Macie isn't allowed to access the object or the object is encrypted with a customer managed AWS KMS key that Macie isn't allowed to use. Check the bucket policy and other permissions settings for the bucket and the object. If the object is encrypted, also ensure that it's encrypted with a key that Macie is allowed to use.
   * - `S3_OBJECT_EMPTY` - Macie can retrieve the object but the object doesn't contain any content. Ensure that the object contains the correct entries. Also ensure that the list's criteria specify the correct bucket and object names.
   * - `S3_OBJECT_NOT_FOUND` - The object doesn't exist in Amazon S3 . Ensure that the list's criteria specify the correct bucket and object names.
   * - `S3_OBJECT_OVERSIZE` - Macie can retrieve the object. However, the object contains too many entries or its storage size exceeds the quota for an allow list. Try breaking the list into multiple files and ensure that each file doesn't exceed any quotas. Then configure list settings in Macie for each file.
   * - `S3_THROTTLED` - Amazon S3 throttled the request to retrieve the object. Wait a few minutes and then try again.
   * - `S3_USER_ACCESS_DENIED` - Amazon S3 denied the request to retrieve the object. If the specified object exists, you're not allowed to access it or it's encrypted with an AWS KMS key that you're not allowed to use. Work with your AWS administrator to ensure that the list's criteria specify the correct bucket and object names, and you have read access to the bucket and the object. If the object is encrypted, also ensure that it's encrypted with a key that you're allowed to use.
   * - `UNKNOWN_ERROR` - A transient or internal error occurred when Macie attempted to retrieve or parse the object. Wait a few minutes and then try again. A list can also have this status if it's encrypted with a key that Amazon S3 and Macie can't access or use.
   *
   * For more information, see [Allow list options and requirements](https://docs.aws.amazon.com/macie/latest/user/allow-lists-options.html) in the *Amazon Macie User Guide* .
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * The criteria that specify the text or text pattern to ignore.
   */
  public criteria: CfnAllowList.CriteriaProperty | cdk.IResolvable;

  /**
   * A custom description of the allow list.
   */
  public description?: string;

  /**
   * A custom name for the allow list.
   */
  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to the allow list.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAllowListProps) {
    super(scope, id, {
      "type": CfnAllowList.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "criteria", this);
    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.criteria = props.criteria;
    this.description = props.description;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Macie::AllowList", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "criteria": this.criteria,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAllowList.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAllowListPropsToCloudFormation(props);
  }
}

export namespace CfnAllowList {
  /**
   * Specifies the criteria for an allow list, which is a list that defines specific text or a text pattern to ignore when inspecting data sources for sensitive data.
   *
   * The criteria can be:
   *
   * - The location and name of an Amazon Simple Storage Service ( Amazon S3 ) object that lists specific, predefined text to ignore ( `S3WordsList` ), or
   * - A regular expression ( `Regex` ) that defines a text pattern to ignore.
   *
   * The criteria must specify either an S3 object or a regular expression. It can't specify both.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-allowlist-criteria.html
   */
  export interface CriteriaProperty {
    /**
     * The regular expression ( *regex* ) that defines the text pattern to ignore.
     *
     * The expression can contain 1-512 characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-allowlist-criteria.html#cfn-macie-allowlist-criteria-regex
     */
    readonly regex?: string;

    /**
     * The location and name of an Amazon S3 object that lists specific text to ignore.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-allowlist-criteria.html#cfn-macie-allowlist-criteria-s3wordslist
     */
    readonly s3WordsList?: cdk.IResolvable | CfnAllowList.S3WordsListProperty;
  }

  /**
   * Specifies the location and name of an Amazon Simple Storage Service ( Amazon S3 ) object that lists specific, predefined text to ignore when inspecting data sources for sensitive data.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-allowlist-s3wordslist.html
   */
  export interface S3WordsListProperty {
    /**
     * The full name of the S3 bucket that contains the object.
     *
     * This value correlates to the `Name` field of a bucket's properties in Amazon S3 .
     *
     * This value is case sensitive. In addition, don't use wildcard characters or specify partial values for the name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-allowlist-s3wordslist.html#cfn-macie-allowlist-s3wordslist-bucketname
     */
    readonly bucketName: string;

    /**
     * The full name of the S3 object.
     *
     * This value correlates to the `Key` field of an object's properties in Amazon S3 . If the name includes a path, include the complete path. For example, `AllowLists/Macie/MyList.txt` .
     *
     * This value is case sensitive. In addition, don't use wildcard characters or specify partial values for the name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-allowlist-s3wordslist.html#cfn-macie-allowlist-s3wordslist-objectkey
     */
    readonly objectKey: string;
  }
}

/**
 * Properties for defining a `CfnAllowList`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-allowlist.html
 */
export interface CfnAllowListProps {
  /**
   * The criteria that specify the text or text pattern to ignore.
   *
   * The criteria can be the location and name of an Amazon S3 object that lists specific text to ignore ( `S3WordsList` ), or a regular expression ( `Regex` ) that defines a text pattern to ignore.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-allowlist.html#cfn-macie-allowlist-criteria
   */
  readonly criteria: CfnAllowList.CriteriaProperty | cdk.IResolvable;

  /**
   * A custom description of the allow list.
   *
   * The description can contain 1-512 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-allowlist.html#cfn-macie-allowlist-description
   */
  readonly description?: string;

  /**
   * A custom name for the allow list.
   *
   * The name can contain 1-128 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-allowlist.html#cfn-macie-allowlist-name
   */
  readonly name: string;

  /**
   * An array of key-value pairs to apply to the allow list.
   *
   * For more information, see [Resource tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-allowlist.html#cfn-macie-allowlist-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `S3WordsListProperty`
 *
 * @param properties - the TypeScript properties of a `S3WordsListProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAllowListS3WordsListPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketName", cdk.requiredValidator)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketName", cdk.validateString)(properties.bucketName));
  errors.collect(cdk.propertyValidator("objectKey", cdk.requiredValidator)(properties.objectKey));
  errors.collect(cdk.propertyValidator("objectKey", cdk.validateString)(properties.objectKey));
  return errors.wrap("supplied properties not correct for \"S3WordsListProperty\"");
}

// @ts-ignore TS6133
function convertCfnAllowListS3WordsListPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAllowListS3WordsListPropertyValidator(properties).assertSuccess();
  return {
    "BucketName": cdk.stringToCloudFormation(properties.bucketName),
    "ObjectKey": cdk.stringToCloudFormation(properties.objectKey)
  };
}

// @ts-ignore TS6133
function CfnAllowListS3WordsListPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAllowList.S3WordsListProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAllowList.S3WordsListProperty>();
  ret.addPropertyResult("bucketName", "BucketName", (properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined));
  ret.addPropertyResult("objectKey", "ObjectKey", (properties.ObjectKey != null ? cfn_parse.FromCloudFormation.getString(properties.ObjectKey) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CriteriaProperty`
 *
 * @param properties - the TypeScript properties of a `CriteriaProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAllowListCriteriaPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("regex", cdk.validateString)(properties.regex));
  errors.collect(cdk.propertyValidator("s3WordsList", CfnAllowListS3WordsListPropertyValidator)(properties.s3WordsList));
  return errors.wrap("supplied properties not correct for \"CriteriaProperty\"");
}

// @ts-ignore TS6133
function convertCfnAllowListCriteriaPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAllowListCriteriaPropertyValidator(properties).assertSuccess();
  return {
    "Regex": cdk.stringToCloudFormation(properties.regex),
    "S3WordsList": convertCfnAllowListS3WordsListPropertyToCloudFormation(properties.s3WordsList)
  };
}

// @ts-ignore TS6133
function CfnAllowListCriteriaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAllowList.CriteriaProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAllowList.CriteriaProperty>();
  ret.addPropertyResult("regex", "Regex", (properties.Regex != null ? cfn_parse.FromCloudFormation.getString(properties.Regex) : undefined));
  ret.addPropertyResult("s3WordsList", "S3WordsList", (properties.S3WordsList != null ? CfnAllowListS3WordsListPropertyFromCloudFormation(properties.S3WordsList) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnAllowListProps`
 *
 * @param properties - the TypeScript properties of a `CfnAllowListProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAllowListPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("criteria", cdk.requiredValidator)(properties.criteria));
  errors.collect(cdk.propertyValidator("criteria", CfnAllowListCriteriaPropertyValidator)(properties.criteria));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnAllowListProps\"");
}

// @ts-ignore TS6133
function convertCfnAllowListPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAllowListPropsValidator(properties).assertSuccess();
  return {
    "Criteria": convertCfnAllowListCriteriaPropertyToCloudFormation(properties.criteria),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnAllowListPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAllowListProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAllowListProps>();
  ret.addPropertyResult("criteria", "Criteria", (properties.Criteria != null ? CfnAllowListCriteriaPropertyFromCloudFormation(properties.Criteria) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Macie::CustomDataIdentifier` resource specifies a custom data identifier.
 *
 * A *custom data identifier* is a set of custom criteria for Amazon Macie to use when it inspects data sources for sensitive data. The criteria consist of a regular expression ( *regex* ) that defines a text pattern to match and, optionally, character sequences and a proximity rule that refine the results. The character sequences can be:
 *
 * - *Keywords* , which are words or phrases that must be in proximity of text that matches the regex, or
 * - *Ignore words* , which are words or phrases to exclude from the results.
 *
 * By using custom data identifiers, you can supplement the managed data identifiers that Macie provides and detect sensitive data that reflects your particular scenarios, intellectual property, or proprietary data. For more information, see [Building custom data identifiers](https://docs.aws.amazon.com/macie/latest/user/custom-data-identifiers.html) in the *Amazon Macie User Guide* .
 *
 * An `AWS::Macie::Session` resource must exist for an AWS account before you can create an `AWS::Macie::CustomDataIdentifier` resource for the account. Use a [DependsOn attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-dependson.html) to ensure that an `AWS::Macie::Session` resource is created before other Macie resources are created for an account. For example, `"DependsOn": "Session"` .
 *
 * @cloudformationResource AWS::Macie::CustomDataIdentifier
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-customdataidentifier.html
 */
export class CfnCustomDataIdentifier extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Macie::CustomDataIdentifier";

  /**
   * Build a CfnCustomDataIdentifier from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCustomDataIdentifier {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnCustomDataIdentifierPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCustomDataIdentifier(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the custom data identifier.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The unique identifier for the custom data identifier.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * A custom description of the custom data identifier. The description can contain 1-512 characters.
   */
  public description?: string;

  /**
   * An array of character sequences ( *ignore words* ) to exclude from the results.
   */
  public ignoreWords?: Array<string>;

  /**
   * An array of character sequences ( *keywords* ), one of which must precede and be in proximity ( `MaximumMatchDistance` ) of the regular expression ( `Regex` ) to match.
   */
  public keywords?: Array<string>;

  /**
   * The maximum number of characters that can exist between the end of at least one complete character sequence specified by the `Keywords` array and the end of text that matches the regular expression ( `Regex` ).
   */
  public maximumMatchDistance?: number;

  /**
   * A custom name for the custom data identifier. The name can contain 1-128 characters.
   */
  public name: string;

  /**
   * The regular expression ( *regex* ) that defines the text pattern to match.
   */
  public regex: string;

  /**
   * An array of key-value pairs to apply to the custom data identifier.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCustomDataIdentifierProps) {
    super(scope, id, {
      "type": CfnCustomDataIdentifier.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "regex", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.ignoreWords = props.ignoreWords;
    this.keywords = props.keywords;
    this.maximumMatchDistance = props.maximumMatchDistance;
    this.name = props.name;
    this.regex = props.regex;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "ignoreWords": this.ignoreWords,
      "keywords": this.keywords,
      "maximumMatchDistance": this.maximumMatchDistance,
      "name": this.name,
      "regex": this.regex,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCustomDataIdentifier.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCustomDataIdentifierPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnCustomDataIdentifier`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-customdataidentifier.html
 */
export interface CfnCustomDataIdentifierProps {
  /**
   * A custom description of the custom data identifier. The description can contain 1-512 characters.
   *
   * Avoid including sensitive data in the description. Users of the account might be able to see the description, depending on the actions that they're allowed to perform in Amazon Macie .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-customdataidentifier.html#cfn-macie-customdataidentifier-description
   */
  readonly description?: string;

  /**
   * An array of character sequences ( *ignore words* ) to exclude from the results.
   *
   * If text matches the regular expression ( `Regex` ) but it contains a string in this array, Amazon Macie ignores the text and doesn't include it in the results.
   *
   * The array can contain 1-10 ignore words. Each ignore word can contain 4-90 UTF-8 characters. Ignore words are case sensitive.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-customdataidentifier.html#cfn-macie-customdataidentifier-ignorewords
   */
  readonly ignoreWords?: Array<string>;

  /**
   * An array of character sequences ( *keywords* ), one of which must precede and be in proximity ( `MaximumMatchDistance` ) of the regular expression ( `Regex` ) to match.
   *
   * The array can contain 1-50 keywords. Each keyword can contain 3-90 UTF-8 characters. Keywords aren't case sensitive.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-customdataidentifier.html#cfn-macie-customdataidentifier-keywords
   */
  readonly keywords?: Array<string>;

  /**
   * The maximum number of characters that can exist between the end of at least one complete character sequence specified by the `Keywords` array and the end of text that matches the regular expression ( `Regex` ).
   *
   * If a complete keyword precedes all the text that matches the regular expression and the keyword is within the specified distance, Amazon Macie includes the result.
   *
   * The distance can be 1-300 characters. The default value is 50.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-customdataidentifier.html#cfn-macie-customdataidentifier-maximummatchdistance
   */
  readonly maximumMatchDistance?: number;

  /**
   * A custom name for the custom data identifier. The name can contain 1-128 characters.
   *
   * Avoid including sensitive data in the name of a custom data identifier. Users of the account might be able to see the name, depending on the actions that they're allowed to perform in Amazon Macie .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-customdataidentifier.html#cfn-macie-customdataidentifier-name
   */
  readonly name: string;

  /**
   * The regular expression ( *regex* ) that defines the text pattern to match.
   *
   * The expression can contain 1-512 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-customdataidentifier.html#cfn-macie-customdataidentifier-regex
   */
  readonly regex: string;

  /**
   * An array of key-value pairs to apply to the custom data identifier.
   *
   * For more information, see [Resource tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-customdataidentifier.html#cfn-macie-customdataidentifier-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnCustomDataIdentifierProps`
 *
 * @param properties - the TypeScript properties of a `CfnCustomDataIdentifierProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCustomDataIdentifierPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("ignoreWords", cdk.listValidator(cdk.validateString))(properties.ignoreWords));
  errors.collect(cdk.propertyValidator("keywords", cdk.listValidator(cdk.validateString))(properties.keywords));
  errors.collect(cdk.propertyValidator("maximumMatchDistance", cdk.validateNumber)(properties.maximumMatchDistance));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("regex", cdk.requiredValidator)(properties.regex));
  errors.collect(cdk.propertyValidator("regex", cdk.validateString)(properties.regex));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnCustomDataIdentifierProps\"");
}

// @ts-ignore TS6133
function convertCfnCustomDataIdentifierPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCustomDataIdentifierPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "IgnoreWords": cdk.listMapper(cdk.stringToCloudFormation)(properties.ignoreWords),
    "Keywords": cdk.listMapper(cdk.stringToCloudFormation)(properties.keywords),
    "MaximumMatchDistance": cdk.numberToCloudFormation(properties.maximumMatchDistance),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Regex": cdk.stringToCloudFormation(properties.regex),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnCustomDataIdentifierPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCustomDataIdentifierProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCustomDataIdentifierProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("ignoreWords", "IgnoreWords", (properties.IgnoreWords != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IgnoreWords) : undefined));
  ret.addPropertyResult("keywords", "Keywords", (properties.Keywords != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Keywords) : undefined));
  ret.addPropertyResult("maximumMatchDistance", "MaximumMatchDistance", (properties.MaximumMatchDistance != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumMatchDistance) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("regex", "Regex", (properties.Regex != null ? cfn_parse.FromCloudFormation.getString(properties.Regex) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Macie::FindingsFilter` resource specifies a findings filter.
 *
 * In Amazon Macie , a *findings filter* , also referred to as a *filter rule* , is a set of custom criteria that specifies which findings to include or exclude from the results of a query for findings. The criteria can help you identify and focus on findings that have specific characteristics, such as severity, type, or the name of an affected AWS resource. You can also configure a findings filter to suppress (automatically archive) findings that match the filter's criteria. For more information, see [Filtering findings](https://docs.aws.amazon.com/macie/latest/user/findings-filter-overview.html) in the *Amazon Macie User Guide* .
 *
 * An `AWS::Macie::Session` resource must exist for an AWS account before you can create an `AWS::Macie::FindingsFilter` resource for the account. Use a [DependsOn attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-dependson.html) to ensure that an `AWS::Macie::Session` resource is created before other Macie resources are created for an account. For example, `"DependsOn": "Session"` .
 *
 * @cloudformationResource AWS::Macie::FindingsFilter
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-findingsfilter.html
 */
export class CfnFindingsFilter extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Macie::FindingsFilter";

  /**
   * Build a CfnFindingsFilter from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFindingsFilter {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnFindingsFilterPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnFindingsFilter(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the findings filter.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * @cloudformationAttribute FindingsFilterListItems
   */
  public readonly attrFindingsFilterListItems: cdk.IResolvable;

  /**
   * The unique identifier for the findings filter.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The action to perform on findings that match the filter criteria ( `FindingCriteria` ). Valid values are:.
   */
  public action?: string;

  /**
   * A custom description of the findings filter. The description can contain 1-512 characters.
   */
  public description?: string;

  /**
   * The criteria to use to filter findings.
   */
  public findingCriteria: CfnFindingsFilter.FindingCriteriaProperty | cdk.IResolvable;

  /**
   * A custom name for the findings filter. The name can contain 3-64 characters.
   */
  public name: string;

  /**
   * The position of the findings filter in the list of saved filter rules on the Amazon Macie console.
   */
  public position?: number;

  /**
   * An array of key-value pairs to apply to the findings filter.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnFindingsFilterProps) {
    super(scope, id, {
      "type": CfnFindingsFilter.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "findingCriteria", this);
    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrFindingsFilterListItems = this.getAtt("FindingsFilterListItems");
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.action = props.action;
    this.description = props.description;
    this.findingCriteria = props.findingCriteria;
    this.name = props.name;
    this.position = props.position;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "action": this.action,
      "description": this.description,
      "findingCriteria": this.findingCriteria,
      "name": this.name,
      "position": this.position,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnFindingsFilter.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnFindingsFilterPropsToCloudFormation(props);
  }
}

export namespace CfnFindingsFilter {
  /**
   * Specifies, as a map, one or more property-based conditions for a findings filter.
   *
   * A *findings filter* , also referred to as a *filter rule* , is a set of custom criteria that specifies which findings to include or exclude from the results of a query for findings. You can also configure a findings filter to suppress (automatically archive) findings that match the filter's criteria. For more information, see [Filtering findings](https://docs.aws.amazon.com/macie/latest/user/findings-filter-overview.html) in the *Amazon Macie User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-findingsfilter-findingcriteria.html
   */
  export interface FindingCriteriaProperty {
    /**
     * Specifies a condition that defines the property, operator, and one or more values to use to filter the results.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-findingsfilter-findingcriteria.html#cfn-macie-findingsfilter-findingcriteria-criterion
     */
    readonly criterion?: cdk.IResolvable | Record<string, CfnFindingsFilter.CriterionAdditionalPropertiesProperty | cdk.IResolvable>;
  }

  /**
   * Specifies a condition that defines the property, operator, and one or more values to use in a findings filter.
   *
   * A *findings filter* , also referred to as a *filter rule* , is a set of custom criteria that specifies which findings to include or exclude from the results of a query for findings. You can also configure a findings filter to suppress (automatically archive) findings that match the filter's criteria. For more information, see [Filtering findings](https://docs.aws.amazon.com/macie/latest/user/findings-filter-overview.html) in the *Amazon Macie User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-findingsfilter-criterionadditionalproperties.html
   */
  export interface CriterionAdditionalPropertiesProperty {
    /**
     * The value for the specified property matches (equals) the specified value.
     *
     * If you specify multiple values, Amazon Macie uses OR logic to join the values.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-findingsfilter-criterionadditionalproperties.html#cfn-macie-findingsfilter-criterionadditionalproperties-eq
     */
    readonly eq?: Array<string>;

    /**
     * The value for the specified property is greater than the specified value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-findingsfilter-criterionadditionalproperties.html#cfn-macie-findingsfilter-criterionadditionalproperties-gt
     */
    readonly gt?: number;

    /**
     * The value for the specified property is greater than or equal to the specified value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-findingsfilter-criterionadditionalproperties.html#cfn-macie-findingsfilter-criterionadditionalproperties-gte
     */
    readonly gte?: number;

    /**
     * The value for the specified property is less than the specified value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-findingsfilter-criterionadditionalproperties.html#cfn-macie-findingsfilter-criterionadditionalproperties-lt
     */
    readonly lt?: number;

    /**
     * The value for the specified property is less than or equal to the specified value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-findingsfilter-criterionadditionalproperties.html#cfn-macie-findingsfilter-criterionadditionalproperties-lte
     */
    readonly lte?: number;

    /**
     * The value for the specified property doesn't match (doesn't equal) the specified value.
     *
     * If you specify multiple values, Amazon Macie uses OR logic to join the values.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-findingsfilter-criterionadditionalproperties.html#cfn-macie-findingsfilter-criterionadditionalproperties-neq
     */
    readonly neq?: Array<string>;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-findingsfilter-findingsfilterlistitem.html
   */
  export interface FindingsFilterListItemProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-findingsfilter-findingsfilterlistitem.html#cfn-macie-findingsfilter-findingsfilterlistitem-id
     */
    readonly id?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-macie-findingsfilter-findingsfilterlistitem.html#cfn-macie-findingsfilter-findingsfilterlistitem-name
     */
    readonly name?: string;
  }
}

/**
 * Properties for defining a `CfnFindingsFilter`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-findingsfilter.html
 */
export interface CfnFindingsFilterProps {
  /**
   * The action to perform on findings that match the filter criteria ( `FindingCriteria` ). Valid values are:.
   *
   * - `ARCHIVE` - Suppress (automatically archive) the findings.
   * - `NOOP` - Don't perform any action on the findings.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-findingsfilter.html#cfn-macie-findingsfilter-action
   */
  readonly action?: string;

  /**
   * A custom description of the findings filter. The description can contain 1-512 characters.
   *
   * Avoid including sensitive data in the description. Users of the account might be able to see the description, depending on the actions that they're allowed to perform in Amazon Macie .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-findingsfilter.html#cfn-macie-findingsfilter-description
   */
  readonly description?: string;

  /**
   * The criteria to use to filter findings.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-findingsfilter.html#cfn-macie-findingsfilter-findingcriteria
   */
  readonly findingCriteria: CfnFindingsFilter.FindingCriteriaProperty | cdk.IResolvable;

  /**
   * A custom name for the findings filter. The name can contain 3-64 characters.
   *
   * Avoid including sensitive data in the name. Users of the account might be able to see the name, depending on the actions that they're allowed to perform in Amazon Macie .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-findingsfilter.html#cfn-macie-findingsfilter-name
   */
  readonly name: string;

  /**
   * The position of the findings filter in the list of saved filter rules on the Amazon Macie console.
   *
   * This value also determines the order in which the filter is applied to findings, relative to other filters that are also applied to findings.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-findingsfilter.html#cfn-macie-findingsfilter-position
   */
  readonly position?: number;

  /**
   * An array of key-value pairs to apply to the findings filter.
   *
   * For more information, see [Resource tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-findingsfilter.html#cfn-macie-findingsfilter-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CriterionAdditionalPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `CriterionAdditionalPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFindingsFilterCriterionAdditionalPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("eq", cdk.listValidator(cdk.validateString))(properties.eq));
  errors.collect(cdk.propertyValidator("gt", cdk.validateNumber)(properties.gt));
  errors.collect(cdk.propertyValidator("gte", cdk.validateNumber)(properties.gte));
  errors.collect(cdk.propertyValidator("lt", cdk.validateNumber)(properties.lt));
  errors.collect(cdk.propertyValidator("lte", cdk.validateNumber)(properties.lte));
  errors.collect(cdk.propertyValidator("neq", cdk.listValidator(cdk.validateString))(properties.neq));
  return errors.wrap("supplied properties not correct for \"CriterionAdditionalPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnFindingsFilterCriterionAdditionalPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFindingsFilterCriterionAdditionalPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "eq": cdk.listMapper(cdk.stringToCloudFormation)(properties.eq),
    "gt": cdk.numberToCloudFormation(properties.gt),
    "gte": cdk.numberToCloudFormation(properties.gte),
    "lt": cdk.numberToCloudFormation(properties.lt),
    "lte": cdk.numberToCloudFormation(properties.lte),
    "neq": cdk.listMapper(cdk.stringToCloudFormation)(properties.neq)
  };
}

// @ts-ignore TS6133
function CfnFindingsFilterCriterionAdditionalPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFindingsFilter.CriterionAdditionalPropertiesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFindingsFilter.CriterionAdditionalPropertiesProperty>();
  ret.addPropertyResult("eq", "eq", (properties.eq != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.eq) : undefined));
  ret.addPropertyResult("gt", "gt", (properties.gt != null ? cfn_parse.FromCloudFormation.getNumber(properties.gt) : undefined));
  ret.addPropertyResult("gte", "gte", (properties.gte != null ? cfn_parse.FromCloudFormation.getNumber(properties.gte) : undefined));
  ret.addPropertyResult("lt", "lt", (properties.lt != null ? cfn_parse.FromCloudFormation.getNumber(properties.lt) : undefined));
  ret.addPropertyResult("lte", "lte", (properties.lte != null ? cfn_parse.FromCloudFormation.getNumber(properties.lte) : undefined));
  ret.addPropertyResult("neq", "neq", (properties.neq != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.neq) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FindingCriteriaProperty`
 *
 * @param properties - the TypeScript properties of a `FindingCriteriaProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFindingsFilterFindingCriteriaPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("criterion", cdk.hashValidator(CfnFindingsFilterCriterionAdditionalPropertiesPropertyValidator))(properties.criterion));
  return errors.wrap("supplied properties not correct for \"FindingCriteriaProperty\"");
}

// @ts-ignore TS6133
function convertCfnFindingsFilterFindingCriteriaPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFindingsFilterFindingCriteriaPropertyValidator(properties).assertSuccess();
  return {
    "Criterion": cdk.hashMapper(convertCfnFindingsFilterCriterionAdditionalPropertiesPropertyToCloudFormation)(properties.criterion)
  };
}

// @ts-ignore TS6133
function CfnFindingsFilterFindingCriteriaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFindingsFilter.FindingCriteriaProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFindingsFilter.FindingCriteriaProperty>();
  ret.addPropertyResult("criterion", "Criterion", (properties.Criterion != null ? cfn_parse.FromCloudFormation.getMap(CfnFindingsFilterCriterionAdditionalPropertiesPropertyFromCloudFormation)(properties.Criterion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnFindingsFilterProps`
 *
 * @param properties - the TypeScript properties of a `CfnFindingsFilterProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFindingsFilterPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.validateString)(properties.action));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("findingCriteria", cdk.requiredValidator)(properties.findingCriteria));
  errors.collect(cdk.propertyValidator("findingCriteria", CfnFindingsFilterFindingCriteriaPropertyValidator)(properties.findingCriteria));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("position", cdk.validateNumber)(properties.position));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnFindingsFilterProps\"");
}

// @ts-ignore TS6133
function convertCfnFindingsFilterPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFindingsFilterPropsValidator(properties).assertSuccess();
  return {
    "Action": cdk.stringToCloudFormation(properties.action),
    "Description": cdk.stringToCloudFormation(properties.description),
    "FindingCriteria": convertCfnFindingsFilterFindingCriteriaPropertyToCloudFormation(properties.findingCriteria),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Position": cdk.numberToCloudFormation(properties.position),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnFindingsFilterPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFindingsFilterProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFindingsFilterProps>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? cfn_parse.FromCloudFormation.getString(properties.Action) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("findingCriteria", "FindingCriteria", (properties.FindingCriteria != null ? CfnFindingsFilterFindingCriteriaPropertyFromCloudFormation(properties.FindingCriteria) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("position", "Position", (properties.Position != null ? cfn_parse.FromCloudFormation.getNumber(properties.Position) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FindingsFilterListItemProperty`
 *
 * @param properties - the TypeScript properties of a `FindingsFilterListItemProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFindingsFilterFindingsFilterListItemPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"FindingsFilterListItemProperty\"");
}

// @ts-ignore TS6133
function convertCfnFindingsFilterFindingsFilterListItemPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFindingsFilterFindingsFilterListItemPropertyValidator(properties).assertSuccess();
  return {
    "Id": cdk.stringToCloudFormation(properties.id),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnFindingsFilterFindingsFilterListItemPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFindingsFilter.FindingsFilterListItemProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFindingsFilter.FindingsFilterListItemProperty>();
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Macie::Session` resource represents the Amazon Macie service and certain configuration settings for an Amazon Macie account in a specific AWS Region .
 *
 * It enables Macie to become operational for a specific account in a specific Region. An account can have only one session in each Region.
 *
 * You must create an `AWS::Macie::Session` resource for an account before you can create other types of resources for the account. Use a [DependsOn attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-dependson.html) to ensure that an `AWS::Macie::Session` resource is created before other Macie resources are created for an account. For example, `"DependsOn": "Session"` .
 *
 * @cloudformationResource AWS::Macie::Session
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-session.html
 */
export class CfnSession extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Macie::Session";

  /**
   * Build a CfnSession from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSession {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSessionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSession(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The account ID for the AWS account in which the Amazon Macie session is created.
   *
   * @cloudformationAttribute AwsAccountId
   */
  public readonly attrAwsAccountId: string;

  /**
   * The Amazon Resource Name (ARN) of the service-linked role that allows Amazon Macie to monitor and analyze data in AWS resources for the account.
   *
   * @cloudformationAttribute ServiceRole
   */
  public readonly attrServiceRole: string;

  /**
   * Specifies how often Amazon Macie publishes updates to policy findings for the account.
   */
  public findingPublishingFrequency?: string;

  /**
   * The status of Amazon Macie for the account.
   */
  public status?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSessionProps = {}) {
    super(scope, id, {
      "type": CfnSession.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrAwsAccountId = cdk.Token.asString(this.getAtt("AwsAccountId", cdk.ResolutionTypeHint.STRING));
    this.attrServiceRole = cdk.Token.asString(this.getAtt("ServiceRole", cdk.ResolutionTypeHint.STRING));
    this.findingPublishingFrequency = props.findingPublishingFrequency;
    this.status = props.status;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "findingPublishingFrequency": this.findingPublishingFrequency,
      "status": this.status
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSession.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSessionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnSession`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-session.html
 */
export interface CfnSessionProps {
  /**
   * Specifies how often Amazon Macie publishes updates to policy findings for the account.
   *
   * This includes publishing updates to AWS Security Hub and Amazon EventBridge (formerly Amazon CloudWatch Events ). Valid values are:
   *
   * - FIFTEEN_MINUTES
   * - ONE_HOUR
   * - SIX_HOURS
   *
   * @default - "SIX_HOURS"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-session.html#cfn-macie-session-findingpublishingfrequency
   */
  readonly findingPublishingFrequency?: string;

  /**
   * The status of Amazon Macie for the account.
   *
   * Valid values are: `ENABLED` , start or resume all Macie activities for the account; and, `PAUSED` , suspend all Macie activities for the account.
   *
   * @default - "ENABLED"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-macie-session.html#cfn-macie-session-status
   */
  readonly status?: string;
}

/**
 * Determine whether the given properties match those of a `CfnSessionProps`
 *
 * @param properties - the TypeScript properties of a `CfnSessionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSessionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("findingPublishingFrequency", cdk.validateString)(properties.findingPublishingFrequency));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  return errors.wrap("supplied properties not correct for \"CfnSessionProps\"");
}

// @ts-ignore TS6133
function convertCfnSessionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSessionPropsValidator(properties).assertSuccess();
  return {
    "FindingPublishingFrequency": cdk.stringToCloudFormation(properties.findingPublishingFrequency),
    "Status": cdk.stringToCloudFormation(properties.status)
  };
}

// @ts-ignore TS6133
function CfnSessionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSessionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSessionProps>();
  ret.addPropertyResult("findingPublishingFrequency", "FindingPublishingFrequency", (properties.FindingPublishingFrequency != null ? cfn_parse.FromCloudFormation.getString(properties.FindingPublishingFrequency) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}