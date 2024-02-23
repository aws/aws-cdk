/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::Cloud9::EnvironmentEC2` resource creates an Amazon EC2 development environment in AWS Cloud9 .
 *
 * For more information, see [Creating an Environment](https://docs.aws.amazon.com/cloud9/latest/user-guide/create-environment.html) in the *AWS Cloud9 User Guide* .
 *
 * @cloudformationResource AWS::Cloud9::EnvironmentEC2
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloud9-environmentec2.html
 */
export class CfnEnvironmentEC2 extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Cloud9::EnvironmentEC2";

  /**
   * Build a CfnEnvironmentEC2 from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEnvironmentEC2 {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnEnvironmentEC2PropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnEnvironmentEC2(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the development environment, such as `arn:aws:cloud9:us-east-2:123456789012:environment:2bc3642873c342e485f7e0c561234567` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The name of the environment.
   *
   * @cloudformationAttribute Name
   */
  public readonly attrName: string;

  /**
   * The number of minutes until the running instance is shut down after the environment was last used.
   */
  public automaticStopTimeMinutes?: number;

  /**
   * The connection type used for connecting to an Amazon EC2 environment.
   */
  public connectionType?: string;

  /**
   * The description of the environment to create.
   */
  public description?: string;

  /**
   * The identifier for the Amazon Machine Image (AMI) that's used to create the EC2 instance.
   */
  public imageId: string;

  /**
   * The type of instance to connect to the environment (for example, `t2.micro` ).
   */
  public instanceType: string;

  /**
   * The name of the environment.
   */
  public name?: string;

  /**
   * The Amazon Resource Name (ARN) of the environment owner.
   */
  public ownerArn?: string;

  /**
   * Any AWS CodeCommit source code repositories to be cloned into the development environment.
   */
  public repositories?: Array<cdk.IResolvable | CfnEnvironmentEC2.RepositoryProperty> | cdk.IResolvable;

  /**
   * The ID of the subnet in Amazon Virtual Private Cloud (Amazon VPC) that AWS Cloud9 will use to communicate with the Amazon Elastic Compute Cloud (Amazon EC2) instance.
   */
  public subnetId?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs that will be associated with the new AWS Cloud9 development environment.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnEnvironmentEC2Props) {
    super(scope, id, {
      "type": CfnEnvironmentEC2.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "imageId", this);
    cdk.requireProperty(props, "instanceType", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrName = cdk.Token.asString(this.getAtt("Name", cdk.ResolutionTypeHint.STRING));
    this.automaticStopTimeMinutes = props.automaticStopTimeMinutes;
    this.connectionType = props.connectionType;
    this.description = props.description;
    this.imageId = props.imageId;
    this.instanceType = props.instanceType;
    this.name = props.name;
    this.ownerArn = props.ownerArn;
    this.repositories = props.repositories;
    this.subnetId = props.subnetId;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Cloud9::EnvironmentEC2", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "automaticStopTimeMinutes": this.automaticStopTimeMinutes,
      "connectionType": this.connectionType,
      "description": this.description,
      "imageId": this.imageId,
      "instanceType": this.instanceType,
      "name": this.name,
      "ownerArn": this.ownerArn,
      "repositories": this.repositories,
      "subnetId": this.subnetId,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnEnvironmentEC2.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnEnvironmentEC2PropsToCloudFormation(props);
  }
}

export namespace CfnEnvironmentEC2 {
  /**
   * The `Repository` property type specifies an AWS CodeCommit source code repository to be cloned into an AWS Cloud9 development environment.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloud9-environmentec2-repository.html
   */
  export interface RepositoryProperty {
    /**
     * The path within the development environment's default file system location to clone the AWS CodeCommit repository into.
     *
     * For example, `/REPOSITORY_NAME` would clone the repository into the `/home/USER_NAME/environment/REPOSITORY_NAME` directory in the environment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloud9-environmentec2-repository.html#cfn-cloud9-environmentec2-repository-pathcomponent
     */
    readonly pathComponent: string;

    /**
     * The clone URL of the AWS CodeCommit repository to be cloned.
     *
     * For example, for an AWS CodeCommit repository this might be `https://git-codecommit.us-east-2.amazonaws.com/v1/repos/REPOSITORY_NAME` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloud9-environmentec2-repository.html#cfn-cloud9-environmentec2-repository-repositoryurl
     */
    readonly repositoryUrl: string;
  }
}

/**
 * Properties for defining a `CfnEnvironmentEC2`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloud9-environmentec2.html
 */
export interface CfnEnvironmentEC2Props {
  /**
   * The number of minutes until the running instance is shut down after the environment was last used.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloud9-environmentec2.html#cfn-cloud9-environmentec2-automaticstoptimeminutes
   */
  readonly automaticStopTimeMinutes?: number;

  /**
   * The connection type used for connecting to an Amazon EC2 environment.
   *
   * Valid values are `CONNECT_SSH` (default) and `CONNECT_SSM` (connected through AWS Systems Manager ).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloud9-environmentec2.html#cfn-cloud9-environmentec2-connectiontype
   */
  readonly connectionType?: string;

  /**
   * The description of the environment to create.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloud9-environmentec2.html#cfn-cloud9-environmentec2-description
   */
  readonly description?: string;

  /**
   * The identifier for the Amazon Machine Image (AMI) that's used to create the EC2 instance.
   *
   * To choose an AMI for the instance, you must specify a valid AMI alias or a valid AWS Systems Manager path.
   *
   * From December 04, 2023, you will be required to include the `ImageId` parameter for the `CreateEnvironmentEC2` action. This change will be reflected across all direct methods of communicating with the API, such as AWS SDK, AWS CLI and AWS CloudFormation. This change will only affect direct API consumers, and not AWS Cloud9 console users.
   *
   * From January 22, 2024, Amazon Linux (AL1) will be removed from the list of available image IDs for Cloud9. This is necessary as AL1 will reach the end of maintenance support in December 2023, and as a result will no longer receive security updates. We recommend using Amazon Linux 2023 as the new AMI to create your environment as it is fully supported. This change will only affect direct API consumers, and not AWS Cloud9 console users.
   *
   * Since Ubuntu 18.04 has ended standard support as of May 31, 2023, we recommend you choose Ubuntu 22.04.
   *
   * *AMI aliases*
   *
   * - Amazon Linux (end of maintenance support December 2023): `amazonlinux-1-x86_64`
   * - Amazon Linux 2: `amazonlinux-2-x86_64`
   * - Amazon Linux 2023 (recommended): `amazonlinux-2023-x86_64`
   * - Ubuntu 18.04: `ubuntu-18.04-x86_64`
   * - Ubuntu 22.04: `ubuntu-22.04-x86_64`
   *
   * *SSM paths*
   *
   * - Amazon Linux (end of maintenance support December 2023): `resolve:ssm:/aws/service/cloud9/amis/amazonlinux-1-x86_64`
   * - Amazon Linux 2: `resolve:ssm:/aws/service/cloud9/amis/amazonlinux-2-x86_64`
   * - Amazon Linux 2023 (recommended): `resolve:ssm:/aws/service/cloud9/amis/amazonlinux-2023-x86_64`
   * - Ubuntu 18.04: `resolve:ssm:/aws/service/cloud9/amis/ubuntu-18.04-x86_64`
   * - Ubuntu 22.04: `resolve:ssm:/aws/service/cloud9/amis/ubuntu-22.04-x86_64`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloud9-environmentec2.html#cfn-cloud9-environmentec2-imageid
   */
  readonly imageId: string;

  /**
   * The type of instance to connect to the environment (for example, `t2.micro` ).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloud9-environmentec2.html#cfn-cloud9-environmentec2-instancetype
   */
  readonly instanceType: string;

  /**
   * The name of the environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloud9-environmentec2.html#cfn-cloud9-environmentec2-name
   */
  readonly name?: string;

  /**
   * The Amazon Resource Name (ARN) of the environment owner.
   *
   * This ARN can be the ARN of any AWS Identity and Access Management principal. If this value is not specified, the ARN defaults to this environment's creator.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloud9-environmentec2.html#cfn-cloud9-environmentec2-ownerarn
   */
  readonly ownerArn?: string;

  /**
   * Any AWS CodeCommit source code repositories to be cloned into the development environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloud9-environmentec2.html#cfn-cloud9-environmentec2-repositories
   */
  readonly repositories?: Array<cdk.IResolvable | CfnEnvironmentEC2.RepositoryProperty> | cdk.IResolvable;

  /**
   * The ID of the subnet in Amazon Virtual Private Cloud (Amazon VPC) that AWS Cloud9 will use to communicate with the Amazon Elastic Compute Cloud (Amazon EC2) instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloud9-environmentec2.html#cfn-cloud9-environmentec2-subnetid
   */
  readonly subnetId?: string;

  /**
   * An array of key-value pairs that will be associated with the new AWS Cloud9 development environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloud9-environmentec2.html#cfn-cloud9-environmentec2-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `RepositoryProperty`
 *
 * @param properties - the TypeScript properties of a `RepositoryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEnvironmentEC2RepositoryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("pathComponent", cdk.requiredValidator)(properties.pathComponent));
  errors.collect(cdk.propertyValidator("pathComponent", cdk.validateString)(properties.pathComponent));
  errors.collect(cdk.propertyValidator("repositoryUrl", cdk.requiredValidator)(properties.repositoryUrl));
  errors.collect(cdk.propertyValidator("repositoryUrl", cdk.validateString)(properties.repositoryUrl));
  return errors.wrap("supplied properties not correct for \"RepositoryProperty\"");
}

// @ts-ignore TS6133
function convertCfnEnvironmentEC2RepositoryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEnvironmentEC2RepositoryPropertyValidator(properties).assertSuccess();
  return {
    "PathComponent": cdk.stringToCloudFormation(properties.pathComponent),
    "RepositoryUrl": cdk.stringToCloudFormation(properties.repositoryUrl)
  };
}

// @ts-ignore TS6133
function CfnEnvironmentEC2RepositoryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnEnvironmentEC2.RepositoryProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironmentEC2.RepositoryProperty>();
  ret.addPropertyResult("pathComponent", "PathComponent", (properties.PathComponent != null ? cfn_parse.FromCloudFormation.getString(properties.PathComponent) : undefined));
  ret.addPropertyResult("repositoryUrl", "RepositoryUrl", (properties.RepositoryUrl != null ? cfn_parse.FromCloudFormation.getString(properties.RepositoryUrl) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnEnvironmentEC2Props`
 *
 * @param properties - the TypeScript properties of a `CfnEnvironmentEC2Props`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEnvironmentEC2PropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("automaticStopTimeMinutes", cdk.validateNumber)(properties.automaticStopTimeMinutes));
  errors.collect(cdk.propertyValidator("connectionType", cdk.validateString)(properties.connectionType));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("imageId", cdk.requiredValidator)(properties.imageId));
  errors.collect(cdk.propertyValidator("imageId", cdk.validateString)(properties.imageId));
  errors.collect(cdk.propertyValidator("instanceType", cdk.requiredValidator)(properties.instanceType));
  errors.collect(cdk.propertyValidator("instanceType", cdk.validateString)(properties.instanceType));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("ownerArn", cdk.validateString)(properties.ownerArn));
  errors.collect(cdk.propertyValidator("repositories", cdk.listValidator(CfnEnvironmentEC2RepositoryPropertyValidator))(properties.repositories));
  errors.collect(cdk.propertyValidator("subnetId", cdk.validateString)(properties.subnetId));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnEnvironmentEC2Props\"");
}

// @ts-ignore TS6133
function convertCfnEnvironmentEC2PropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEnvironmentEC2PropsValidator(properties).assertSuccess();
  return {
    "AutomaticStopTimeMinutes": cdk.numberToCloudFormation(properties.automaticStopTimeMinutes),
    "ConnectionType": cdk.stringToCloudFormation(properties.connectionType),
    "Description": cdk.stringToCloudFormation(properties.description),
    "ImageId": cdk.stringToCloudFormation(properties.imageId),
    "InstanceType": cdk.stringToCloudFormation(properties.instanceType),
    "Name": cdk.stringToCloudFormation(properties.name),
    "OwnerArn": cdk.stringToCloudFormation(properties.ownerArn),
    "Repositories": cdk.listMapper(convertCfnEnvironmentEC2RepositoryPropertyToCloudFormation)(properties.repositories),
    "SubnetId": cdk.stringToCloudFormation(properties.subnetId),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnEnvironmentEC2PropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEnvironmentEC2Props | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironmentEC2Props>();
  ret.addPropertyResult("automaticStopTimeMinutes", "AutomaticStopTimeMinutes", (properties.AutomaticStopTimeMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.AutomaticStopTimeMinutes) : undefined));
  ret.addPropertyResult("connectionType", "ConnectionType", (properties.ConnectionType != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectionType) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("imageId", "ImageId", (properties.ImageId != null ? cfn_parse.FromCloudFormation.getString(properties.ImageId) : undefined));
  ret.addPropertyResult("instanceType", "InstanceType", (properties.InstanceType != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceType) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("ownerArn", "OwnerArn", (properties.OwnerArn != null ? cfn_parse.FromCloudFormation.getString(properties.OwnerArn) : undefined));
  ret.addPropertyResult("repositories", "Repositories", (properties.Repositories != null ? cfn_parse.FromCloudFormation.getArray(CfnEnvironmentEC2RepositoryPropertyFromCloudFormation)(properties.Repositories) : undefined));
  ret.addPropertyResult("subnetId", "SubnetId", (properties.SubnetId != null ? cfn_parse.FromCloudFormation.getString(properties.SubnetId) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}