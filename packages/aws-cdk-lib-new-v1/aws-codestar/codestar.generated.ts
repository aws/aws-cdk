/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::CodeStar::GitHubRepository` resource creates a GitHub repository where users can store source code for use with AWS workflows.
 *
 * You must provide a location for the source code ZIP file in the AWS CloudFormation template, so the code can be uploaded to the created repository. You must have created a personal access token in GitHub to provide in the AWS CloudFormation template. AWS uses this token to connect to GitHub on your behalf. For more information about using a GitHub source repository with AWS CodeStar projects, see [AWS CodeStar Project Files and Resources](https://docs.aws.amazon.com/codestar/latest/userguide/templates.html#templates-whatis) .
 *
 * @cloudformationResource AWS::CodeStar::GitHubRepository
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestar-githubrepository.html
 */
export class CfnGitHubRepository extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CodeStar::GitHubRepository";

  /**
   * Build a CfnGitHubRepository from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGitHubRepository {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnGitHubRepositoryPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnGitHubRepository(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * Information about code to be committed to a repository after it is created in an AWS CloudFormation stack.
   */
  public code?: CfnGitHubRepository.CodeProperty | cdk.IResolvable;

  public connectionArn?: string;

  /**
   * Indicates whether to enable issues for the GitHub repository.
   */
  public enableIssues?: boolean | cdk.IResolvable;

  /**
   * Indicates whether the GitHub repository is a private repository.
   */
  public isPrivate?: boolean | cdk.IResolvable;

  /**
   * The GitHub user's personal access token for the GitHub repository.
   */
  public repositoryAccessToken?: string;

  /**
   * A comment or description about the new repository.
   */
  public repositoryDescription?: string;

  /**
   * The name of the repository you want to create in GitHub with AWS CloudFormation stack creation.
   */
  public repositoryName: string;

  /**
   * The GitHub user name for the owner of the GitHub repository to be created.
   */
  public repositoryOwner: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnGitHubRepositoryProps) {
    super(scope, id, {
      "type": CfnGitHubRepository.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "repositoryName", this);
    cdk.requireProperty(props, "repositoryOwner", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.code = props.code;
    this.connectionArn = props.connectionArn;
    this.enableIssues = props.enableIssues;
    this.isPrivate = props.isPrivate;
    this.repositoryAccessToken = props.repositoryAccessToken;
    this.repositoryDescription = props.repositoryDescription;
    this.repositoryName = props.repositoryName;
    this.repositoryOwner = props.repositoryOwner;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "code": this.code,
      "connectionArn": this.connectionArn,
      "enableIssues": this.enableIssues,
      "isPrivate": this.isPrivate,
      "repositoryAccessToken": this.repositoryAccessToken,
      "repositoryDescription": this.repositoryDescription,
      "repositoryName": this.repositoryName,
      "repositoryOwner": this.repositoryOwner
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnGitHubRepository.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnGitHubRepositoryPropsToCloudFormation(props);
  }
}

export namespace CfnGitHubRepository {
  /**
   * The `Code` property type specifies information about code to be committed.
   *
   * `Code` is a property of the `AWS::CodeStar::GitHubRepository` resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codestar-githubrepository-code.html
   */
  export interface CodeProperty {
    /**
     * Information about the Amazon S3 bucket that contains a ZIP file of code to be committed to the repository.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codestar-githubrepository-code.html#cfn-codestar-githubrepository-code-s3
     */
    readonly s3: cdk.IResolvable | CfnGitHubRepository.S3Property;
  }

  /**
   * The `S3` property type specifies information about the Amazon S3 bucket that contains the code to be committed to the new repository.
   *
   * `S3` is a property of the `AWS::CodeStar::GitHubRepository` resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codestar-githubrepository-s3.html
   */
  export interface S3Property {
    /**
     * The name of the Amazon S3 bucket that contains the ZIP file with the content to be committed to the new repository.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codestar-githubrepository-s3.html#cfn-codestar-githubrepository-s3-bucket
     */
    readonly bucket: string;

    /**
     * The S3 object key or file name for the ZIP file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codestar-githubrepository-s3.html#cfn-codestar-githubrepository-s3-key
     */
    readonly key: string;

    /**
     * The object version of the ZIP file, if versioning is enabled for the Amazon S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codestar-githubrepository-s3.html#cfn-codestar-githubrepository-s3-objectversion
     */
    readonly objectVersion?: string;
  }
}

/**
 * Properties for defining a `CfnGitHubRepository`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestar-githubrepository.html
 */
export interface CfnGitHubRepositoryProps {
  /**
   * Information about code to be committed to a repository after it is created in an AWS CloudFormation stack.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestar-githubrepository.html#cfn-codestar-githubrepository-code
   */
  readonly code?: CfnGitHubRepository.CodeProperty | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestar-githubrepository.html#cfn-codestar-githubrepository-connectionarn
   */
  readonly connectionArn?: string;

  /**
   * Indicates whether to enable issues for the GitHub repository.
   *
   * You can use GitHub issues to track information and bugs for your repository.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestar-githubrepository.html#cfn-codestar-githubrepository-enableissues
   */
  readonly enableIssues?: boolean | cdk.IResolvable;

  /**
   * Indicates whether the GitHub repository is a private repository.
   *
   * If so, you choose who can see and commit to this repository.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestar-githubrepository.html#cfn-codestar-githubrepository-isprivate
   */
  readonly isPrivate?: boolean | cdk.IResolvable;

  /**
   * The GitHub user's personal access token for the GitHub repository.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestar-githubrepository.html#cfn-codestar-githubrepository-repositoryaccesstoken
   */
  readonly repositoryAccessToken?: string;

  /**
   * A comment or description about the new repository.
   *
   * This description is displayed in GitHub after the repository is created.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestar-githubrepository.html#cfn-codestar-githubrepository-repositorydescription
   */
  readonly repositoryDescription?: string;

  /**
   * The name of the repository you want to create in GitHub with AWS CloudFormation stack creation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestar-githubrepository.html#cfn-codestar-githubrepository-repositoryname
   */
  readonly repositoryName: string;

  /**
   * The GitHub user name for the owner of the GitHub repository to be created.
   *
   * If this repository should be owned by a GitHub organization, provide its name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestar-githubrepository.html#cfn-codestar-githubrepository-repositoryowner
   */
  readonly repositoryOwner: string;
}

/**
 * Determine whether the given properties match those of a `S3Property`
 *
 * @param properties - the TypeScript properties of a `S3Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGitHubRepositoryS3PropertyValidator(properties: any): cdk.ValidationResult {
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
function convertCfnGitHubRepositoryS3PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGitHubRepositoryS3PropertyValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "Key": cdk.stringToCloudFormation(properties.key),
    "ObjectVersion": cdk.stringToCloudFormation(properties.objectVersion)
  };
}

// @ts-ignore TS6133
function CfnGitHubRepositoryS3PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnGitHubRepository.S3Property> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGitHubRepository.S3Property>();
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
function CfnGitHubRepositoryCodePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("s3", cdk.requiredValidator)(properties.s3));
  errors.collect(cdk.propertyValidator("s3", CfnGitHubRepositoryS3PropertyValidator)(properties.s3));
  return errors.wrap("supplied properties not correct for \"CodeProperty\"");
}

// @ts-ignore TS6133
function convertCfnGitHubRepositoryCodePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGitHubRepositoryCodePropertyValidator(properties).assertSuccess();
  return {
    "S3": convertCfnGitHubRepositoryS3PropertyToCloudFormation(properties.s3)
  };
}

// @ts-ignore TS6133
function CfnGitHubRepositoryCodePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGitHubRepository.CodeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGitHubRepository.CodeProperty>();
  ret.addPropertyResult("s3", "S3", (properties.S3 != null ? CfnGitHubRepositoryS3PropertyFromCloudFormation(properties.S3) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnGitHubRepositoryProps`
 *
 * @param properties - the TypeScript properties of a `CfnGitHubRepositoryProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGitHubRepositoryPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("code", CfnGitHubRepositoryCodePropertyValidator)(properties.code));
  errors.collect(cdk.propertyValidator("connectionArn", cdk.validateString)(properties.connectionArn));
  errors.collect(cdk.propertyValidator("enableIssues", cdk.validateBoolean)(properties.enableIssues));
  errors.collect(cdk.propertyValidator("isPrivate", cdk.validateBoolean)(properties.isPrivate));
  errors.collect(cdk.propertyValidator("repositoryAccessToken", cdk.validateString)(properties.repositoryAccessToken));
  errors.collect(cdk.propertyValidator("repositoryDescription", cdk.validateString)(properties.repositoryDescription));
  errors.collect(cdk.propertyValidator("repositoryName", cdk.requiredValidator)(properties.repositoryName));
  errors.collect(cdk.propertyValidator("repositoryName", cdk.validateString)(properties.repositoryName));
  errors.collect(cdk.propertyValidator("repositoryOwner", cdk.requiredValidator)(properties.repositoryOwner));
  errors.collect(cdk.propertyValidator("repositoryOwner", cdk.validateString)(properties.repositoryOwner));
  return errors.wrap("supplied properties not correct for \"CfnGitHubRepositoryProps\"");
}

// @ts-ignore TS6133
function convertCfnGitHubRepositoryPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGitHubRepositoryPropsValidator(properties).assertSuccess();
  return {
    "Code": convertCfnGitHubRepositoryCodePropertyToCloudFormation(properties.code),
    "ConnectionArn": cdk.stringToCloudFormation(properties.connectionArn),
    "EnableIssues": cdk.booleanToCloudFormation(properties.enableIssues),
    "IsPrivate": cdk.booleanToCloudFormation(properties.isPrivate),
    "RepositoryAccessToken": cdk.stringToCloudFormation(properties.repositoryAccessToken),
    "RepositoryDescription": cdk.stringToCloudFormation(properties.repositoryDescription),
    "RepositoryName": cdk.stringToCloudFormation(properties.repositoryName),
    "RepositoryOwner": cdk.stringToCloudFormation(properties.repositoryOwner)
  };
}

// @ts-ignore TS6133
function CfnGitHubRepositoryPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGitHubRepositoryProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGitHubRepositoryProps>();
  ret.addPropertyResult("code", "Code", (properties.Code != null ? CfnGitHubRepositoryCodePropertyFromCloudFormation(properties.Code) : undefined));
  ret.addPropertyResult("connectionArn", "ConnectionArn", (properties.ConnectionArn != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectionArn) : undefined));
  ret.addPropertyResult("enableIssues", "EnableIssues", (properties.EnableIssues != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableIssues) : undefined));
  ret.addPropertyResult("isPrivate", "IsPrivate", (properties.IsPrivate != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsPrivate) : undefined));
  ret.addPropertyResult("repositoryAccessToken", "RepositoryAccessToken", (properties.RepositoryAccessToken != null ? cfn_parse.FromCloudFormation.getString(properties.RepositoryAccessToken) : undefined));
  ret.addPropertyResult("repositoryDescription", "RepositoryDescription", (properties.RepositoryDescription != null ? cfn_parse.FromCloudFormation.getString(properties.RepositoryDescription) : undefined));
  ret.addPropertyResult("repositoryName", "RepositoryName", (properties.RepositoryName != null ? cfn_parse.FromCloudFormation.getString(properties.RepositoryName) : undefined));
  ret.addPropertyResult("repositoryOwner", "RepositoryOwner", (properties.RepositoryOwner != null ? cfn_parse.FromCloudFormation.getString(properties.RepositoryOwner) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}