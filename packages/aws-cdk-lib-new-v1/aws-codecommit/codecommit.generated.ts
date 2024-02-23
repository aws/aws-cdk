/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates a new, empty repository.
 *
 * @cloudformationResource AWS::CodeCommit::Repository
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codecommit-repository.html
 */
export class CfnRepository extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CodeCommit::Repository";

  /**
   * Build a CfnRepository from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRepository {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRepositoryPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRepository(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * When you pass the logical ID of this resource, the function returns the Amazon Resource Name (ARN) of the repository.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * When you pass the logical ID of this resource, the function returns the URL to use for cloning the repository over HTTPS.
   *
   * @cloudformationAttribute CloneUrlHttp
   */
  public readonly attrCloneUrlHttp: string;

  /**
   * When you pass the logical ID of this resource, the function returns the URL to use for cloning the repository over SSH.
   *
   * @cloudformationAttribute CloneUrlSsh
   */
  public readonly attrCloneUrlSsh: string;

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * When you pass the logical ID of this resource, the function returns the repository's name.
   *
   * @cloudformationAttribute Name
   */
  public readonly attrName: string;

  /**
   * Information about code to be committed to a repository after it is created in an AWS CloudFormation stack.
   */
  public code?: CfnRepository.CodeProperty | cdk.IResolvable;

  /**
   * The ID of the AWS Key Management Service encryption key used to encrypt and decrypt the repository.
   */
  public kmsKeyId?: string;

  /**
   * A comment or description about the new repository.
   */
  public repositoryDescription?: string;

  /**
   * The name of the new repository to be created.
   */
  public repositoryName: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * One or more tag key-value pairs to use when tagging this repository.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The JSON block of configuration information for each trigger.
   */
  public triggers?: Array<cdk.IResolvable | CfnRepository.RepositoryTriggerProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRepositoryProps) {
    super(scope, id, {
      "type": CfnRepository.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "repositoryName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCloneUrlHttp = cdk.Token.asString(this.getAtt("CloneUrlHttp", cdk.ResolutionTypeHint.STRING));
    this.attrCloneUrlSsh = cdk.Token.asString(this.getAtt("CloneUrlSsh", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrName = cdk.Token.asString(this.getAtt("Name", cdk.ResolutionTypeHint.STRING));
    this.code = props.code;
    this.kmsKeyId = props.kmsKeyId;
    this.repositoryDescription = props.repositoryDescription;
    this.repositoryName = props.repositoryName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::CodeCommit::Repository", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.triggers = props.triggers;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "code": this.code,
      "kmsKeyId": this.kmsKeyId,
      "repositoryDescription": this.repositoryDescription,
      "repositoryName": this.repositoryName,
      "tags": this.tags.renderTags(),
      "triggers": this.triggers
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRepository.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRepositoryPropsToCloudFormation(props);
  }
}

export namespace CfnRepository {
  /**
   * Information about a trigger for a repository.
   *
   * > If you want to receive notifications about repository events, consider using notifications instead of triggers. For more information, see [Configuring notifications for repository events](https://docs.aws.amazon.com/codecommit/latest/userguide/how-to-repository-email.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codecommit-repository-repositorytrigger.html
   */
  export interface RepositoryTriggerProperty {
    /**
     * The branches to be included in the trigger configuration.
     *
     * If you specify an empty array, the trigger applies to all branches.
     *
     * > Although no content is required in the array, you must include the array itself.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codecommit-repository-repositorytrigger.html#cfn-codecommit-repository-repositorytrigger-branches
     */
    readonly branches?: Array<string>;

    /**
     * Any custom data associated with the trigger to be included in the information sent to the target of the trigger.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codecommit-repository-repositorytrigger.html#cfn-codecommit-repository-repositorytrigger-customdata
     */
    readonly customData?: string;

    /**
     * The ARN of the resource that is the target for a trigger (for example, the ARN of a topic in Amazon SNS).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codecommit-repository-repositorytrigger.html#cfn-codecommit-repository-repositorytrigger-destinationarn
     */
    readonly destinationArn: string;

    /**
     * The repository events that cause the trigger to run actions in another service, such as sending a notification through Amazon SNS.
     *
     * > The valid value "all" cannot be used with any other values.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codecommit-repository-repositorytrigger.html#cfn-codecommit-repository-repositorytrigger-events
     */
    readonly events: Array<string>;

    /**
     * The name of the trigger.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codecommit-repository-repositorytrigger.html#cfn-codecommit-repository-repositorytrigger-name
     */
    readonly name: string;
  }

  /**
   * Information about code to be committed.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codecommit-repository-code.html
   */
  export interface CodeProperty {
    /**
     * Optional.
     *
     * Specifies a branch name to be used as the default branch when importing code into a repository on initial creation. If this property is not set, the name *main* will be used for the default branch for the repository. Changes to this property are ignored after initial resource creation. We recommend using this parameter to set the name to *main* to align with the default behavior of CodeCommit unless another name is needed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codecommit-repository-code.html#cfn-codecommit-repository-code-branchname
     */
    readonly branchName?: string;

    /**
     * Information about the Amazon S3 bucket that contains a ZIP file of code to be committed to the repository.
     *
     * Changes to this property are ignored after initial resource creation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codecommit-repository-code.html#cfn-codecommit-repository-code-s3
     */
    readonly s3: cdk.IResolvable | CfnRepository.S3Property;
  }

  /**
   * Information about the Amazon S3 bucket that contains the code that will be committed to the new repository.
   *
   * Changes to this property are ignored after initial resource creation.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codecommit-repository-s3.html
   */
  export interface S3Property {
    /**
     * The name of the Amazon S3 bucket that contains the ZIP file with the content that will be committed to the new repository.
     *
     * This can be specified using the name of the bucket in the AWS account . Changes to this property are ignored after initial resource creation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codecommit-repository-s3.html#cfn-codecommit-repository-s3-bucket
     */
    readonly bucket: string;

    /**
     * The key to use for accessing the Amazon S3 bucket.
     *
     * Changes to this property are ignored after initial resource creation. For more information, see [Creating object key names](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html) and [Uploading objects](https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html) in the Amazon S3 User Guide.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codecommit-repository-s3.html#cfn-codecommit-repository-s3-key
     */
    readonly key: string;

    /**
     * The object version of the ZIP file, if versioning is enabled for the Amazon S3 bucket.
     *
     * Changes to this property are ignored after initial resource creation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codecommit-repository-s3.html#cfn-codecommit-repository-s3-objectversion
     */
    readonly objectVersion?: string;
  }
}

/**
 * Properties for defining a `CfnRepository`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codecommit-repository.html
 */
export interface CfnRepositoryProps {
  /**
   * Information about code to be committed to a repository after it is created in an AWS CloudFormation stack.
   *
   * Information about code is only used in resource creation. Updates to a stack will not reflect changes made to code properties after initial resource creation.
   *
   * > You can only use this property to add code when creating a repository with a AWS CloudFormation template at creation time. This property cannot be used for updating code to an existing repository.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codecommit-repository.html#cfn-codecommit-repository-code
   */
  readonly code?: CfnRepository.CodeProperty | cdk.IResolvable;

  /**
   * The ID of the AWS Key Management Service encryption key used to encrypt and decrypt the repository.
   *
   * > The input can be the full ARN, the key ID, or the key alias. For more information, see [Finding the key ID and key ARN](https://docs.aws.amazon.com/kms/latest/developerguide/find-cmk-id-arn.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codecommit-repository.html#cfn-codecommit-repository-kmskeyid
   */
  readonly kmsKeyId?: string;

  /**
   * A comment or description about the new repository.
   *
   * > The description field for a repository accepts all HTML characters and all valid Unicode characters. Applications that do not HTML-encode the description and display it in a webpage can expose users to potentially malicious code. Make sure that you HTML-encode the description field in any application that uses this API to display the repository description on a webpage.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codecommit-repository.html#cfn-codecommit-repository-repositorydescription
   */
  readonly repositoryDescription?: string;

  /**
   * The name of the new repository to be created.
   *
   * > The repository name must be unique across the calling AWS account . Repository names are limited to 100 alphanumeric, dash, and underscore characters, and cannot include certain characters. For more information about the limits on repository names, see [Quotas](https://docs.aws.amazon.com/codecommit/latest/userguide/limits.html) in the *AWS CodeCommit User Guide* . The suffix .git is prohibited.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codecommit-repository.html#cfn-codecommit-repository-repositoryname
   */
  readonly repositoryName: string;

  /**
   * One or more tag key-value pairs to use when tagging this repository.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codecommit-repository.html#cfn-codecommit-repository-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The JSON block of configuration information for each trigger.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codecommit-repository.html#cfn-codecommit-repository-triggers
   */
  readonly triggers?: Array<cdk.IResolvable | CfnRepository.RepositoryTriggerProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `RepositoryTriggerProperty`
 *
 * @param properties - the TypeScript properties of a `RepositoryTriggerProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRepositoryRepositoryTriggerPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("branches", cdk.listValidator(cdk.validateString))(properties.branches));
  errors.collect(cdk.propertyValidator("customData", cdk.validateString)(properties.customData));
  errors.collect(cdk.propertyValidator("destinationArn", cdk.requiredValidator)(properties.destinationArn));
  errors.collect(cdk.propertyValidator("destinationArn", cdk.validateString)(properties.destinationArn));
  errors.collect(cdk.propertyValidator("events", cdk.requiredValidator)(properties.events));
  errors.collect(cdk.propertyValidator("events", cdk.listValidator(cdk.validateString))(properties.events));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"RepositoryTriggerProperty\"");
}

// @ts-ignore TS6133
function convertCfnRepositoryRepositoryTriggerPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRepositoryRepositoryTriggerPropertyValidator(properties).assertSuccess();
  return {
    "Branches": cdk.listMapper(cdk.stringToCloudFormation)(properties.branches),
    "CustomData": cdk.stringToCloudFormation(properties.customData),
    "DestinationArn": cdk.stringToCloudFormation(properties.destinationArn),
    "Events": cdk.listMapper(cdk.stringToCloudFormation)(properties.events),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnRepositoryRepositoryTriggerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRepository.RepositoryTriggerProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRepository.RepositoryTriggerProperty>();
  ret.addPropertyResult("branches", "Branches", (properties.Branches != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Branches) : undefined));
  ret.addPropertyResult("customData", "CustomData", (properties.CustomData != null ? cfn_parse.FromCloudFormation.getString(properties.CustomData) : undefined));
  ret.addPropertyResult("destinationArn", "DestinationArn", (properties.DestinationArn != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationArn) : undefined));
  ret.addPropertyResult("events", "Events", (properties.Events != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Events) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3Property`
 *
 * @param properties - the TypeScript properties of a `S3Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRepositoryS3PropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.requiredValidator)(properties.bucket));
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("objectVersion", cdk.validateString)(properties.objectVersion));
  return errors.wrap("supplied properties not correct for \"S3Property\"");
}

// @ts-ignore TS6133
function convertCfnRepositoryS3PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRepositoryS3PropertyValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "Key": cdk.stringToCloudFormation(properties.key),
    "ObjectVersion": cdk.stringToCloudFormation(properties.objectVersion)
  };
}

// @ts-ignore TS6133
function CfnRepositoryS3PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRepository.S3Property> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRepository.S3Property>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("objectVersion", "ObjectVersion", (properties.ObjectVersion != null ? cfn_parse.FromCloudFormation.getString(properties.ObjectVersion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CodeProperty`
 *
 * @param properties - the TypeScript properties of a `CodeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRepositoryCodePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("branchName", cdk.validateString)(properties.branchName));
  errors.collect(cdk.propertyValidator("s3", cdk.requiredValidator)(properties.s3));
  errors.collect(cdk.propertyValidator("s3", CfnRepositoryS3PropertyValidator)(properties.s3));
  return errors.wrap("supplied properties not correct for \"CodeProperty\"");
}

// @ts-ignore TS6133
function convertCfnRepositoryCodePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRepositoryCodePropertyValidator(properties).assertSuccess();
  return {
    "BranchName": cdk.stringToCloudFormation(properties.branchName),
    "S3": convertCfnRepositoryS3PropertyToCloudFormation(properties.s3)
  };
}

// @ts-ignore TS6133
function CfnRepositoryCodePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRepository.CodeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRepository.CodeProperty>();
  ret.addPropertyResult("branchName", "BranchName", (properties.BranchName != null ? cfn_parse.FromCloudFormation.getString(properties.BranchName) : undefined));
  ret.addPropertyResult("s3", "S3", (properties.S3 != null ? CfnRepositoryS3PropertyFromCloudFormation(properties.S3) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnRepositoryProps`
 *
 * @param properties - the TypeScript properties of a `CfnRepositoryProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRepositoryPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("code", CfnRepositoryCodePropertyValidator)(properties.code));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("repositoryDescription", cdk.validateString)(properties.repositoryDescription));
  errors.collect(cdk.propertyValidator("repositoryName", cdk.requiredValidator)(properties.repositoryName));
  errors.collect(cdk.propertyValidator("repositoryName", cdk.validateString)(properties.repositoryName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("triggers", cdk.listValidator(CfnRepositoryRepositoryTriggerPropertyValidator))(properties.triggers));
  return errors.wrap("supplied properties not correct for \"CfnRepositoryProps\"");
}

// @ts-ignore TS6133
function convertCfnRepositoryPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRepositoryPropsValidator(properties).assertSuccess();
  return {
    "Code": convertCfnRepositoryCodePropertyToCloudFormation(properties.code),
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "RepositoryDescription": cdk.stringToCloudFormation(properties.repositoryDescription),
    "RepositoryName": cdk.stringToCloudFormation(properties.repositoryName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Triggers": cdk.listMapper(convertCfnRepositoryRepositoryTriggerPropertyToCloudFormation)(properties.triggers)
  };
}

// @ts-ignore TS6133
function CfnRepositoryPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRepositoryProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRepositoryProps>();
  ret.addPropertyResult("code", "Code", (properties.Code != null ? CfnRepositoryCodePropertyFromCloudFormation(properties.Code) : undefined));
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("repositoryDescription", "RepositoryDescription", (properties.RepositoryDescription != null ? cfn_parse.FromCloudFormation.getString(properties.RepositoryDescription) : undefined));
  ret.addPropertyResult("repositoryName", "RepositoryName", (properties.RepositoryName != null ? cfn_parse.FromCloudFormation.getString(properties.RepositoryName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("triggers", "Triggers", (properties.Triggers != null ? cfn_parse.FromCloudFormation.getArray(CfnRepositoryRepositoryTriggerPropertyFromCloudFormation)(properties.Triggers) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}