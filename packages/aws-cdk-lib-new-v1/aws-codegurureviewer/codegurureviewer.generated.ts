/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * This resource configures how Amazon CodeGuru Reviewer retrieves the source code to be reviewed.
 *
 * You can use an AWS CloudFormation template to create an association with the following repository types:
 *
 * - AWS CodeCommit - For more information, see [Create an AWS CodeCommit repository association](https://docs.aws.amazon.com/codeguru/latest/reviewer-ug/create-codecommit-association.html) in the *Amazon CodeGuru Reviewer User Guide* .
 * - Bitbucket - For more information, see [Create a Bitbucket repository association](https://docs.aws.amazon.com/codeguru/latest/reviewer-ug/create-bitbucket-association.html) in the *Amazon CodeGuru Reviewer User Guide* .
 * - GitHub Enterprise Server - For more information, see [Create a GitHub Enterprise Server repository association](https://docs.aws.amazon.com/codeguru/latest/reviewer-ug/create-github-enterprise-association.html) in the *Amazon CodeGuru Reviewer User Guide* .
 * - S3Bucket - For more information, see [Create code reviews with GitHub Actions](https://docs.aws.amazon.com/codeguru/latest/reviewer-ug/working-with-cicd.html) in the *Amazon CodeGuru Reviewer User Guide* .
 *
 * > You cannot use a CloudFormation template to create an association with a GitHub repository.
 *
 * @cloudformationResource AWS::CodeGuruReviewer::RepositoryAssociation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codegurureviewer-repositoryassociation.html
 */
export class CfnRepositoryAssociation extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CodeGuruReviewer::RepositoryAssociation";

  /**
   * Build a CfnRepositoryAssociation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRepositoryAssociation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRepositoryAssociationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRepositoryAssociation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the [`RepositoryAssociation`](https://docs.aws.amazon.com/codeguru/latest/reviewer-api/API_RepositoryAssociation.html) object. You can retrieve this ARN by calling `ListRepositories` .
   *
   * @cloudformationAttribute AssociationArn
   */
  public readonly attrAssociationArn: string;

  /**
   * The name of the bucket.
   */
  public bucketName?: string;

  /**
   * The Amazon Resource Name (ARN) of an AWS CodeStar Connections connection.
   */
  public connectionArn?: string;

  /**
   * The name of the repository.
   */
  public name: string;

  /**
   * The owner of the repository.
   */
  public owner?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs used to tag an associated repository.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The type of repository that contains the source code to be reviewed. The valid values are:.
   */
  public type: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRepositoryAssociationProps) {
    super(scope, id, {
      "type": CfnRepositoryAssociation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "type", this);

    this.attrAssociationArn = cdk.Token.asString(this.getAtt("AssociationArn", cdk.ResolutionTypeHint.STRING));
    this.bucketName = props.bucketName;
    this.connectionArn = props.connectionArn;
    this.name = props.name;
    this.owner = props.owner;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::CodeGuruReviewer::RepositoryAssociation", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.type = props.type;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "bucketName": this.bucketName,
      "connectionArn": this.connectionArn,
      "name": this.name,
      "owner": this.owner,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRepositoryAssociation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRepositoryAssociationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnRepositoryAssociation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codegurureviewer-repositoryassociation.html
 */
export interface CfnRepositoryAssociationProps {
  /**
   * The name of the bucket.
   *
   * This is required for your S3Bucket repository. The name must start with the prefix `codeguru-reviewer-*` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codegurureviewer-repositoryassociation.html#cfn-codegurureviewer-repositoryassociation-bucketname
   */
  readonly bucketName?: string;

  /**
   * The Amazon Resource Name (ARN) of an AWS CodeStar Connections connection.
   *
   * Its format is `arn:aws:codestar-connections:region-id:aws-account_id:connection/connection-id` . For more information, see [Connection](https://docs.aws.amazon.com/codestar-connections/latest/APIReference/API_Connection.html) in the *AWS CodeStar Connections API Reference* .
   *
   * `ConnectionArn` must be specified for Bitbucket and GitHub Enterprise Server repositories. It has no effect if it is specified for an AWS CodeCommit repository.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codegurureviewer-repositoryassociation.html#cfn-codegurureviewer-repositoryassociation-connectionarn
   */
  readonly connectionArn?: string;

  /**
   * The name of the repository.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codegurureviewer-repositoryassociation.html#cfn-codegurureviewer-repositoryassociation-name
   */
  readonly name: string;

  /**
   * The owner of the repository.
   *
   * For a GitHub Enterprise Server or Bitbucket repository, this is the username for the account that owns the repository.
   *
   * `Owner` must be specified for Bitbucket and GitHub Enterprise Server repositories. It has no effect if it is specified for an AWS CodeCommit repository.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codegurureviewer-repositoryassociation.html#cfn-codegurureviewer-repositoryassociation-owner
   */
  readonly owner?: string;

  /**
   * An array of key-value pairs used to tag an associated repository.
   *
   * A tag is a custom attribute label with two parts:
   *
   * - A *tag key* (for example, `CostCenter` , `Environment` , `Project` , or `Secret` ). Tag keys are case sensitive.
   * - An optional field known as a *tag value* (for example, `111122223333` , `Production` , or a team name). Omitting the tag value is the same as using an empty string. Like tag keys, tag values are case sensitive.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codegurureviewer-repositoryassociation.html#cfn-codegurureviewer-repositoryassociation-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The type of repository that contains the source code to be reviewed. The valid values are:.
   *
   * - `CodeCommit`
   * - `Bitbucket`
   * - `GitHubEnterpriseServer`
   * - `S3Bucket`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codegurureviewer-repositoryassociation.html#cfn-codegurureviewer-repositoryassociation-type
   */
  readonly type: string;
}

/**
 * Determine whether the given properties match those of a `CfnRepositoryAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnRepositoryAssociationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRepositoryAssociationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketName", cdk.validateString)(properties.bucketName));
  errors.collect(cdk.propertyValidator("connectionArn", cdk.validateString)(properties.connectionArn));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("owner", cdk.validateString)(properties.owner));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CfnRepositoryAssociationProps\"");
}

// @ts-ignore TS6133
function convertCfnRepositoryAssociationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRepositoryAssociationPropsValidator(properties).assertSuccess();
  return {
    "BucketName": cdk.stringToCloudFormation(properties.bucketName),
    "ConnectionArn": cdk.stringToCloudFormation(properties.connectionArn),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Owner": cdk.stringToCloudFormation(properties.owner),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnRepositoryAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRepositoryAssociationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRepositoryAssociationProps>();
  ret.addPropertyResult("bucketName", "BucketName", (properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined));
  ret.addPropertyResult("connectionArn", "ConnectionArn", (properties.ConnectionArn != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectionArn) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("owner", "Owner", (properties.Owner != null ? cfn_parse.FromCloudFormation.getString(properties.Owner) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}