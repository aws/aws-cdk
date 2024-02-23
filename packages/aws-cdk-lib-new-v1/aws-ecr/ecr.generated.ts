/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::ECR::PublicRepository` resource specifies an Amazon Elastic Container Registry Public (Amazon ECR Public) repository, where users can push and pull Docker images, Open Container Initiative (OCI) images, and OCI compatible artifacts.
 *
 * For more information, see [Amazon ECR public repositories](https://docs.aws.amazon.com/AmazonECR/latest/public/public-repositories.html) in the *Amazon ECR Public User Guide* .
 *
 * @cloudformationResource AWS::ECR::PublicRepository
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-publicrepository.html
 */
export class CfnPublicRepository extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ECR::PublicRepository";

  /**
   * Build a CfnPublicRepository from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPublicRepository {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPublicRepositoryPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPublicRepository(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the Amazon Resource Name (ARN) for the specified `AWS::ECR::PublicRepository` resource. For example, `arn:aws:ecr-public:: *123456789012* :repository/ *test-repository*` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The details about the repository that are publicly visible in the Amazon ECR Public Gallery.
   */
  public repositoryCatalogData?: any | cdk.IResolvable;

  /**
   * The name to use for the public repository.
   */
  public repositoryName?: string;

  /**
   * The JSON repository policy text to apply to the public repository.
   */
  public repositoryPolicyText?: any | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPublicRepositoryProps = {}) {
    super(scope, id, {
      "type": CfnPublicRepository.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.repositoryCatalogData = props.repositoryCatalogData;
    this.repositoryName = props.repositoryName;
    this.repositoryPolicyText = props.repositoryPolicyText;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ECR::PublicRepository", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "repositoryCatalogData": this.repositoryCatalogData,
      "repositoryName": this.repositoryName,
      "repositoryPolicyText": this.repositoryPolicyText,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPublicRepository.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPublicRepositoryPropsToCloudFormation(props);
  }
}

export namespace CfnPublicRepository {
  /**
   * The details about the repository that are publicly visible in the Amazon ECR Public Gallery.
   *
   * For more information, see [Amazon ECR Public repository catalog data](https://docs.aws.amazon.com/AmazonECR/latest/public/public-repository-catalog-data.html) in the *Amazon ECR Public User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-publicrepository-repositorycatalogdata.html
   */
  export interface RepositoryCatalogDataProperty {
    /**
     * The longform description of the contents of the repository.
     *
     * This text appears in the repository details on the Amazon ECR Public Gallery.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-publicrepository-repositorycatalogdata.html#cfn-ecr-publicrepository-repositorycatalogdata-abouttext
     */
    readonly aboutText?: string;

    /**
     * The architecture tags that are associated with the repository.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-publicrepository-repositorycatalogdata.html#cfn-ecr-publicrepository-repositorycatalogdata-architectures
     */
    readonly architectures?: Array<string>;

    /**
     * The operating system tags that are associated with the repository.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-publicrepository-repositorycatalogdata.html#cfn-ecr-publicrepository-repositorycatalogdata-operatingsystems
     */
    readonly operatingSystems?: Array<string>;

    /**
     * The short description of the repository.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-publicrepository-repositorycatalogdata.html#cfn-ecr-publicrepository-repositorycatalogdata-repositorydescription
     */
    readonly repositoryDescription?: string;

    /**
     * The longform usage details of the contents of the repository.
     *
     * The usage text provides context for users of the repository.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-publicrepository-repositorycatalogdata.html#cfn-ecr-publicrepository-repositorycatalogdata-usagetext
     */
    readonly usageText?: string;
  }
}

/**
 * Properties for defining a `CfnPublicRepository`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-publicrepository.html
 */
export interface CfnPublicRepositoryProps {
  /**
   * The details about the repository that are publicly visible in the Amazon ECR Public Gallery.
   *
   * For more information, see [Amazon ECR Public repository catalog data](https://docs.aws.amazon.com/AmazonECR/latest/public/public-repository-catalog-data.html) in the *Amazon ECR Public User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-publicrepository.html#cfn-ecr-publicrepository-repositorycatalogdata
   */
  readonly repositoryCatalogData?: any | cdk.IResolvable;

  /**
   * The name to use for the public repository.
   *
   * The repository name may be specified on its own (such as `nginx-web-app` ) or it can be prepended with a namespace to group the repository into a category (such as `project-a/nginx-web-app` ). If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the repository name. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
   *
   * > If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-publicrepository.html#cfn-ecr-publicrepository-repositoryname
   */
  readonly repositoryName?: string;

  /**
   * The JSON repository policy text to apply to the public repository.
   *
   * For more information, see [Amazon ECR Public repository policies](https://docs.aws.amazon.com/AmazonECR/latest/public/public-repository-policies.html) in the *Amazon ECR Public User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-publicrepository.html#cfn-ecr-publicrepository-repositorypolicytext
   */
  readonly repositoryPolicyText?: any | cdk.IResolvable;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-publicrepository.html#cfn-ecr-publicrepository-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `RepositoryCatalogDataProperty`
 *
 * @param properties - the TypeScript properties of a `RepositoryCatalogDataProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPublicRepositoryRepositoryCatalogDataPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("aboutText", cdk.validateString)(properties.aboutText));
  errors.collect(cdk.propertyValidator("architectures", cdk.listValidator(cdk.validateString))(properties.architectures));
  errors.collect(cdk.propertyValidator("operatingSystems", cdk.listValidator(cdk.validateString))(properties.operatingSystems));
  errors.collect(cdk.propertyValidator("repositoryDescription", cdk.validateString)(properties.repositoryDescription));
  errors.collect(cdk.propertyValidator("usageText", cdk.validateString)(properties.usageText));
  return errors.wrap("supplied properties not correct for \"RepositoryCatalogDataProperty\"");
}

// @ts-ignore TS6133
function convertCfnPublicRepositoryRepositoryCatalogDataPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPublicRepositoryRepositoryCatalogDataPropertyValidator(properties).assertSuccess();
  return {
    "AboutText": cdk.stringToCloudFormation(properties.aboutText),
    "Architectures": cdk.listMapper(cdk.stringToCloudFormation)(properties.architectures),
    "OperatingSystems": cdk.listMapper(cdk.stringToCloudFormation)(properties.operatingSystems),
    "RepositoryDescription": cdk.stringToCloudFormation(properties.repositoryDescription),
    "UsageText": cdk.stringToCloudFormation(properties.usageText)
  };
}

// @ts-ignore TS6133
function CfnPublicRepositoryRepositoryCatalogDataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPublicRepository.RepositoryCatalogDataProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPublicRepository.RepositoryCatalogDataProperty>();
  ret.addPropertyResult("aboutText", "AboutText", (properties.AboutText != null ? cfn_parse.FromCloudFormation.getString(properties.AboutText) : undefined));
  ret.addPropertyResult("architectures", "Architectures", (properties.Architectures != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Architectures) : undefined));
  ret.addPropertyResult("operatingSystems", "OperatingSystems", (properties.OperatingSystems != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.OperatingSystems) : undefined));
  ret.addPropertyResult("repositoryDescription", "RepositoryDescription", (properties.RepositoryDescription != null ? cfn_parse.FromCloudFormation.getString(properties.RepositoryDescription) : undefined));
  ret.addPropertyResult("usageText", "UsageText", (properties.UsageText != null ? cfn_parse.FromCloudFormation.getString(properties.UsageText) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnPublicRepositoryProps`
 *
 * @param properties - the TypeScript properties of a `CfnPublicRepositoryProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPublicRepositoryPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("repositoryCatalogData", cdk.validateObject)(properties.repositoryCatalogData));
  errors.collect(cdk.propertyValidator("repositoryName", cdk.validateString)(properties.repositoryName));
  errors.collect(cdk.propertyValidator("repositoryPolicyText", cdk.validateObject)(properties.repositoryPolicyText));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnPublicRepositoryProps\"");
}

// @ts-ignore TS6133
function convertCfnPublicRepositoryPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPublicRepositoryPropsValidator(properties).assertSuccess();
  return {
    "RepositoryCatalogData": cdk.objectToCloudFormation(properties.repositoryCatalogData),
    "RepositoryName": cdk.stringToCloudFormation(properties.repositoryName),
    "RepositoryPolicyText": cdk.objectToCloudFormation(properties.repositoryPolicyText),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnPublicRepositoryPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPublicRepositoryProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPublicRepositoryProps>();
  ret.addPropertyResult("repositoryCatalogData", "RepositoryCatalogData", (properties.RepositoryCatalogData != null ? cfn_parse.FromCloudFormation.getAny(properties.RepositoryCatalogData) : undefined));
  ret.addPropertyResult("repositoryName", "RepositoryName", (properties.RepositoryName != null ? cfn_parse.FromCloudFormation.getString(properties.RepositoryName) : undefined));
  ret.addPropertyResult("repositoryPolicyText", "RepositoryPolicyText", (properties.RepositoryPolicyText != null ? cfn_parse.FromCloudFormation.getAny(properties.RepositoryPolicyText) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ECR::PullThroughCacheRule` resource creates or updates a pull through cache rule.
 *
 * A pull through cache rule provides a way to cache images from an upstream registry in your Amazon ECR private registry.
 *
 * @cloudformationResource AWS::ECR::PullThroughCacheRule
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-pullthroughcacherule.html
 */
export class CfnPullThroughCacheRule extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ECR::PullThroughCacheRule";

  /**
   * Build a CfnPullThroughCacheRule from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPullThroughCacheRule {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPullThroughCacheRulePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPullThroughCacheRule(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the Secrets Manager secret associated with the pull through cache rule.
   */
  public credentialArn?: string;

  /**
   * The Amazon ECR repository prefix associated with the pull through cache rule.
   */
  public ecrRepositoryPrefix?: string;

  /**
   * The name of the upstream source registry associated with the pull through cache rule.
   */
  public upstreamRegistry?: string;

  /**
   * The upstream registry URL associated with the pull through cache rule.
   */
  public upstreamRegistryUrl?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPullThroughCacheRuleProps = {}) {
    super(scope, id, {
      "type": CfnPullThroughCacheRule.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.credentialArn = props.credentialArn;
    this.ecrRepositoryPrefix = props.ecrRepositoryPrefix;
    this.upstreamRegistry = props.upstreamRegistry;
    this.upstreamRegistryUrl = props.upstreamRegistryUrl;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "credentialArn": this.credentialArn,
      "ecrRepositoryPrefix": this.ecrRepositoryPrefix,
      "upstreamRegistry": this.upstreamRegistry,
      "upstreamRegistryUrl": this.upstreamRegistryUrl
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPullThroughCacheRule.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPullThroughCacheRulePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnPullThroughCacheRule`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-pullthroughcacherule.html
 */
export interface CfnPullThroughCacheRuleProps {
  /**
   * The ARN of the Secrets Manager secret associated with the pull through cache rule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-pullthroughcacherule.html#cfn-ecr-pullthroughcacherule-credentialarn
   */
  readonly credentialArn?: string;

  /**
   * The Amazon ECR repository prefix associated with the pull through cache rule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-pullthroughcacherule.html#cfn-ecr-pullthroughcacherule-ecrrepositoryprefix
   */
  readonly ecrRepositoryPrefix?: string;

  /**
   * The name of the upstream source registry associated with the pull through cache rule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-pullthroughcacherule.html#cfn-ecr-pullthroughcacherule-upstreamregistry
   */
  readonly upstreamRegistry?: string;

  /**
   * The upstream registry URL associated with the pull through cache rule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-pullthroughcacherule.html#cfn-ecr-pullthroughcacherule-upstreamregistryurl
   */
  readonly upstreamRegistryUrl?: string;
}

/**
 * Determine whether the given properties match those of a `CfnPullThroughCacheRuleProps`
 *
 * @param properties - the TypeScript properties of a `CfnPullThroughCacheRuleProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPullThroughCacheRulePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("credentialArn", cdk.validateString)(properties.credentialArn));
  errors.collect(cdk.propertyValidator("ecrRepositoryPrefix", cdk.validateString)(properties.ecrRepositoryPrefix));
  errors.collect(cdk.propertyValidator("upstreamRegistry", cdk.validateString)(properties.upstreamRegistry));
  errors.collect(cdk.propertyValidator("upstreamRegistryUrl", cdk.validateString)(properties.upstreamRegistryUrl));
  return errors.wrap("supplied properties not correct for \"CfnPullThroughCacheRuleProps\"");
}

// @ts-ignore TS6133
function convertCfnPullThroughCacheRulePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPullThroughCacheRulePropsValidator(properties).assertSuccess();
  return {
    "CredentialArn": cdk.stringToCloudFormation(properties.credentialArn),
    "EcrRepositoryPrefix": cdk.stringToCloudFormation(properties.ecrRepositoryPrefix),
    "UpstreamRegistry": cdk.stringToCloudFormation(properties.upstreamRegistry),
    "UpstreamRegistryUrl": cdk.stringToCloudFormation(properties.upstreamRegistryUrl)
  };
}

// @ts-ignore TS6133
function CfnPullThroughCacheRulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPullThroughCacheRuleProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPullThroughCacheRuleProps>();
  ret.addPropertyResult("credentialArn", "CredentialArn", (properties.CredentialArn != null ? cfn_parse.FromCloudFormation.getString(properties.CredentialArn) : undefined));
  ret.addPropertyResult("ecrRepositoryPrefix", "EcrRepositoryPrefix", (properties.EcrRepositoryPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.EcrRepositoryPrefix) : undefined));
  ret.addPropertyResult("upstreamRegistry", "UpstreamRegistry", (properties.UpstreamRegistry != null ? cfn_parse.FromCloudFormation.getString(properties.UpstreamRegistry) : undefined));
  ret.addPropertyResult("upstreamRegistryUrl", "UpstreamRegistryUrl", (properties.UpstreamRegistryUrl != null ? cfn_parse.FromCloudFormation.getString(properties.UpstreamRegistryUrl) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ECR::RegistryPolicy` resource creates or updates the permissions policy for a private registry.
 *
 * A private registry policy is used to specify permissions for another AWS account and is used when configuring cross-account replication. For more information, see [Registry permissions](https://docs.aws.amazon.com/AmazonECR/latest/userguide/registry-permissions.html) in the *Amazon Elastic Container Registry User Guide* .
 *
 * @cloudformationResource AWS::ECR::RegistryPolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-registrypolicy.html
 */
export class CfnRegistryPolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ECR::RegistryPolicy";

  /**
   * Build a CfnRegistryPolicy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRegistryPolicy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRegistryPolicyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRegistryPolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The account ID of the private registry the policy is associated with.
   *
   * @cloudformationAttribute RegistryId
   */
  public readonly attrRegistryId: string;

  /**
   * The JSON policy text for your registry.
   */
  public policyText: any | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRegistryPolicyProps) {
    super(scope, id, {
      "type": CfnRegistryPolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "policyText", this);

    this.attrRegistryId = cdk.Token.asString(this.getAtt("RegistryId", cdk.ResolutionTypeHint.STRING));
    this.policyText = props.policyText;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "policyText": this.policyText
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRegistryPolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRegistryPolicyPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnRegistryPolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-registrypolicy.html
 */
export interface CfnRegistryPolicyProps {
  /**
   * The JSON policy text for your registry.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-registrypolicy.html#cfn-ecr-registrypolicy-policytext
   */
  readonly policyText: any | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnRegistryPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnRegistryPolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRegistryPolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("policyText", cdk.requiredValidator)(properties.policyText));
  errors.collect(cdk.propertyValidator("policyText", cdk.validateObject)(properties.policyText));
  return errors.wrap("supplied properties not correct for \"CfnRegistryPolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnRegistryPolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRegistryPolicyPropsValidator(properties).assertSuccess();
  return {
    "PolicyText": cdk.objectToCloudFormation(properties.policyText)
  };
}

// @ts-ignore TS6133
function CfnRegistryPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRegistryPolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRegistryPolicyProps>();
  ret.addPropertyResult("policyText", "PolicyText", (properties.PolicyText != null ? cfn_parse.FromCloudFormation.getAny(properties.PolicyText) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ECR::ReplicationConfiguration` resource creates or updates the replication configuration for a private registry.
 *
 * The first time a replication configuration is applied to a private registry, a service-linked IAM role is created in your account for the replication process. For more information, see [Using Service-Linked Roles for Amazon ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/using-service-linked-roles.html) in the *Amazon Elastic Container Registry User Guide* .
 *
 * > When configuring cross-account replication, the destination account must grant the source account permission to replicate. This permission is controlled using a private registry permissions policy. For more information, see `AWS::ECR::RegistryPolicy` .
 *
 * @cloudformationResource AWS::ECR::ReplicationConfiguration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-replicationconfiguration.html
 */
export class CfnReplicationConfiguration extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ECR::ReplicationConfiguration";

  /**
   * Build a CfnReplicationConfiguration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnReplicationConfiguration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnReplicationConfigurationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnReplicationConfiguration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The account ID of the destination registry.
   *
   * @cloudformationAttribute RegistryId
   */
  public readonly attrRegistryId: string;

  /**
   * The replication configuration for a registry.
   */
  public replicationConfiguration: cdk.IResolvable | CfnReplicationConfiguration.ReplicationConfigurationProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnReplicationConfigurationProps) {
    super(scope, id, {
      "type": CfnReplicationConfiguration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "replicationConfiguration", this);

    this.attrRegistryId = cdk.Token.asString(this.getAtt("RegistryId", cdk.ResolutionTypeHint.STRING));
    this.replicationConfiguration = props.replicationConfiguration;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "replicationConfiguration": this.replicationConfiguration
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnReplicationConfiguration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnReplicationConfigurationPropsToCloudFormation(props);
  }
}

export namespace CfnReplicationConfiguration {
  /**
   * The replication configuration for a registry.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-replicationconfiguration-replicationconfiguration.html
   */
  export interface ReplicationConfigurationProperty {
    /**
     * An array of objects representing the replication destinations and repository filters for a replication configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-replicationconfiguration-replicationconfiguration.html#cfn-ecr-replicationconfiguration-replicationconfiguration-rules
     */
    readonly rules: Array<cdk.IResolvable | CfnReplicationConfiguration.ReplicationRuleProperty> | cdk.IResolvable;
  }

  /**
   * An array of objects representing the replication destinations and repository filters for a replication configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-replicationconfiguration-replicationrule.html
   */
  export interface ReplicationRuleProperty {
    /**
     * An array of objects representing the destination for a replication rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-replicationconfiguration-replicationrule.html#cfn-ecr-replicationconfiguration-replicationrule-destinations
     */
    readonly destinations: Array<cdk.IResolvable | CfnReplicationConfiguration.ReplicationDestinationProperty> | cdk.IResolvable;

    /**
     * An array of objects representing the filters for a replication rule.
     *
     * Specifying a repository filter for a replication rule provides a method for controlling which repositories in a private registry are replicated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-replicationconfiguration-replicationrule.html#cfn-ecr-replicationconfiguration-replicationrule-repositoryfilters
     */
    readonly repositoryFilters?: Array<cdk.IResolvable | CfnReplicationConfiguration.RepositoryFilterProperty> | cdk.IResolvable;
  }

  /**
   * The filter settings used with image replication.
   *
   * Specifying a repository filter to a replication rule provides a method for controlling which repositories in a private registry are replicated. If no filters are added, the contents of all repositories are replicated.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-replicationconfiguration-repositoryfilter.html
   */
  export interface RepositoryFilterProperty {
    /**
     * The repository filter details.
     *
     * When the `PREFIX_MATCH` filter type is specified, this value is required and should be the repository name prefix to configure replication for.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-replicationconfiguration-repositoryfilter.html#cfn-ecr-replicationconfiguration-repositoryfilter-filter
     */
    readonly filter: string;

    /**
     * The repository filter type.
     *
     * The only supported value is `PREFIX_MATCH` , which is a repository name prefix specified with the `filter` parameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-replicationconfiguration-repositoryfilter.html#cfn-ecr-replicationconfiguration-repositoryfilter-filtertype
     */
    readonly filterType: string;
  }

  /**
   * An array of objects representing the destination for a replication rule.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-replicationconfiguration-replicationdestination.html
   */
  export interface ReplicationDestinationProperty {
    /**
     * The Region to replicate to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-replicationconfiguration-replicationdestination.html#cfn-ecr-replicationconfiguration-replicationdestination-region
     */
    readonly region: string;

    /**
     * The AWS account ID of the Amazon ECR private registry to replicate to.
     *
     * When configuring cross-Region replication within your own registry, specify your own account ID.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-replicationconfiguration-replicationdestination.html#cfn-ecr-replicationconfiguration-replicationdestination-registryid
     */
    readonly registryId: string;
  }
}

/**
 * Properties for defining a `CfnReplicationConfiguration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-replicationconfiguration.html
 */
export interface CfnReplicationConfigurationProps {
  /**
   * The replication configuration for a registry.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-replicationconfiguration.html#cfn-ecr-replicationconfiguration-replicationconfiguration
   */
  readonly replicationConfiguration: cdk.IResolvable | CfnReplicationConfiguration.ReplicationConfigurationProperty;
}

/**
 * Determine whether the given properties match those of a `RepositoryFilterProperty`
 *
 * @param properties - the TypeScript properties of a `RepositoryFilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnReplicationConfigurationRepositoryFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("filter", cdk.requiredValidator)(properties.filter));
  errors.collect(cdk.propertyValidator("filter", cdk.validateString)(properties.filter));
  errors.collect(cdk.propertyValidator("filterType", cdk.requiredValidator)(properties.filterType));
  errors.collect(cdk.propertyValidator("filterType", cdk.validateString)(properties.filterType));
  return errors.wrap("supplied properties not correct for \"RepositoryFilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnReplicationConfigurationRepositoryFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReplicationConfigurationRepositoryFilterPropertyValidator(properties).assertSuccess();
  return {
    "Filter": cdk.stringToCloudFormation(properties.filter),
    "FilterType": cdk.stringToCloudFormation(properties.filterType)
  };
}

// @ts-ignore TS6133
function CfnReplicationConfigurationRepositoryFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnReplicationConfiguration.RepositoryFilterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReplicationConfiguration.RepositoryFilterProperty>();
  ret.addPropertyResult("filter", "Filter", (properties.Filter != null ? cfn_parse.FromCloudFormation.getString(properties.Filter) : undefined));
  ret.addPropertyResult("filterType", "FilterType", (properties.FilterType != null ? cfn_parse.FromCloudFormation.getString(properties.FilterType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ReplicationDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicationDestinationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnReplicationConfigurationReplicationDestinationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("region", cdk.requiredValidator)(properties.region));
  errors.collect(cdk.propertyValidator("region", cdk.validateString)(properties.region));
  errors.collect(cdk.propertyValidator("registryId", cdk.requiredValidator)(properties.registryId));
  errors.collect(cdk.propertyValidator("registryId", cdk.validateString)(properties.registryId));
  return errors.wrap("supplied properties not correct for \"ReplicationDestinationProperty\"");
}

// @ts-ignore TS6133
function convertCfnReplicationConfigurationReplicationDestinationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReplicationConfigurationReplicationDestinationPropertyValidator(properties).assertSuccess();
  return {
    "Region": cdk.stringToCloudFormation(properties.region),
    "RegistryId": cdk.stringToCloudFormation(properties.registryId)
  };
}

// @ts-ignore TS6133
function CfnReplicationConfigurationReplicationDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnReplicationConfiguration.ReplicationDestinationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReplicationConfiguration.ReplicationDestinationProperty>();
  ret.addPropertyResult("region", "Region", (properties.Region != null ? cfn_parse.FromCloudFormation.getString(properties.Region) : undefined));
  ret.addPropertyResult("registryId", "RegistryId", (properties.RegistryId != null ? cfn_parse.FromCloudFormation.getString(properties.RegistryId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ReplicationRuleProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicationRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnReplicationConfigurationReplicationRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destinations", cdk.requiredValidator)(properties.destinations));
  errors.collect(cdk.propertyValidator("destinations", cdk.listValidator(CfnReplicationConfigurationReplicationDestinationPropertyValidator))(properties.destinations));
  errors.collect(cdk.propertyValidator("repositoryFilters", cdk.listValidator(CfnReplicationConfigurationRepositoryFilterPropertyValidator))(properties.repositoryFilters));
  return errors.wrap("supplied properties not correct for \"ReplicationRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnReplicationConfigurationReplicationRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReplicationConfigurationReplicationRulePropertyValidator(properties).assertSuccess();
  return {
    "Destinations": cdk.listMapper(convertCfnReplicationConfigurationReplicationDestinationPropertyToCloudFormation)(properties.destinations),
    "RepositoryFilters": cdk.listMapper(convertCfnReplicationConfigurationRepositoryFilterPropertyToCloudFormation)(properties.repositoryFilters)
  };
}

// @ts-ignore TS6133
function CfnReplicationConfigurationReplicationRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnReplicationConfiguration.ReplicationRuleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReplicationConfiguration.ReplicationRuleProperty>();
  ret.addPropertyResult("destinations", "Destinations", (properties.Destinations != null ? cfn_parse.FromCloudFormation.getArray(CfnReplicationConfigurationReplicationDestinationPropertyFromCloudFormation)(properties.Destinations) : undefined));
  ret.addPropertyResult("repositoryFilters", "RepositoryFilters", (properties.RepositoryFilters != null ? cfn_parse.FromCloudFormation.getArray(CfnReplicationConfigurationRepositoryFilterPropertyFromCloudFormation)(properties.RepositoryFilters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ReplicationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnReplicationConfigurationReplicationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("rules", cdk.requiredValidator)(properties.rules));
  errors.collect(cdk.propertyValidator("rules", cdk.listValidator(CfnReplicationConfigurationReplicationRulePropertyValidator))(properties.rules));
  return errors.wrap("supplied properties not correct for \"ReplicationConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnReplicationConfigurationReplicationConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReplicationConfigurationReplicationConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Rules": cdk.listMapper(convertCfnReplicationConfigurationReplicationRulePropertyToCloudFormation)(properties.rules)
  };
}

// @ts-ignore TS6133
function CfnReplicationConfigurationReplicationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnReplicationConfiguration.ReplicationConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReplicationConfiguration.ReplicationConfigurationProperty>();
  ret.addPropertyResult("rules", "Rules", (properties.Rules != null ? cfn_parse.FromCloudFormation.getArray(CfnReplicationConfigurationReplicationRulePropertyFromCloudFormation)(properties.Rules) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnReplicationConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnReplicationConfigurationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnReplicationConfigurationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("replicationConfiguration", cdk.requiredValidator)(properties.replicationConfiguration));
  errors.collect(cdk.propertyValidator("replicationConfiguration", CfnReplicationConfigurationReplicationConfigurationPropertyValidator)(properties.replicationConfiguration));
  return errors.wrap("supplied properties not correct for \"CfnReplicationConfigurationProps\"");
}

// @ts-ignore TS6133
function convertCfnReplicationConfigurationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReplicationConfigurationPropsValidator(properties).assertSuccess();
  return {
    "ReplicationConfiguration": convertCfnReplicationConfigurationReplicationConfigurationPropertyToCloudFormation(properties.replicationConfiguration)
  };
}

// @ts-ignore TS6133
function CfnReplicationConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReplicationConfigurationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReplicationConfigurationProps>();
  ret.addPropertyResult("replicationConfiguration", "ReplicationConfiguration", (properties.ReplicationConfiguration != null ? CfnReplicationConfigurationReplicationConfigurationPropertyFromCloudFormation(properties.ReplicationConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::ECR::Repository` resource specifies an Amazon Elastic Container Registry (Amazon ECR) repository, where users can push and pull Docker images, Open Container Initiative (OCI) images, and OCI compatible artifacts.
 *
 * For more information, see [Amazon ECR private repositories](https://docs.aws.amazon.com/AmazonECR/latest/userguide/Repositories.html) in the *Amazon ECR User Guide* .
 *
 * @cloudformationResource AWS::ECR::Repository
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-repository.html
 */
export class CfnRepository extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ECR::Repository";

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
   * Returns the Amazon Resource Name (ARN) for the specified `AWS::ECR::Repository` resource. For example, `arn:aws:ecr: *eu-west-1* : *123456789012* :repository/ *test-repository*` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Returns the URI for the specified `AWS::ECR::Repository` resource. For example, `*123456789012* .dkr.ecr. *us-west-2* .amazonaws.com/repository` .
   *
   * @cloudformationAttribute RepositoryUri
   */
  public readonly attrRepositoryUri: string;

  /**
   * If true, deleting the repository force deletes the contents of the repository.
   */
  public emptyOnDelete?: boolean | cdk.IResolvable;

  /**
   * The encryption configuration for the repository.
   */
  public encryptionConfiguration?: CfnRepository.EncryptionConfigurationProperty | cdk.IResolvable;

  /**
   * The image scanning configuration for the repository.
   */
  public imageScanningConfiguration?: CfnRepository.ImageScanningConfigurationProperty | cdk.IResolvable;

  /**
   * The tag mutability setting for the repository.
   */
  public imageTagMutability?: string;

  /**
   * Creates or updates a lifecycle policy.
   */
  public lifecyclePolicy?: cdk.IResolvable | CfnRepository.LifecyclePolicyProperty;

  /**
   * The name to use for the repository.
   */
  public repositoryName?: string;

  /**
   * The JSON repository policy text to apply to the repository.
   */
  public repositoryPolicyText?: any | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRepositoryProps = {}) {
    super(scope, id, {
      "type": CfnRepository.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrRepositoryUri = cdk.Token.asString(this.getAtt("RepositoryUri", cdk.ResolutionTypeHint.STRING));
    this.emptyOnDelete = props.emptyOnDelete;
    this.encryptionConfiguration = props.encryptionConfiguration;
    this.imageScanningConfiguration = props.imageScanningConfiguration;
    this.imageTagMutability = props.imageTagMutability;
    this.lifecyclePolicy = props.lifecyclePolicy;
    this.repositoryName = props.repositoryName;
    this.repositoryPolicyText = props.repositoryPolicyText;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ECR::Repository", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "emptyOnDelete": this.emptyOnDelete,
      "encryptionConfiguration": this.encryptionConfiguration,
      "imageScanningConfiguration": this.imageScanningConfiguration,
      "imageTagMutability": this.imageTagMutability,
      "lifecyclePolicy": this.lifecyclePolicy,
      "repositoryName": this.repositoryName,
      "repositoryPolicyText": this.repositoryPolicyText,
      "tags": this.tags.renderTags()
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
   * The image scanning configuration for a repository.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-repository-imagescanningconfiguration.html
   */
  export interface ImageScanningConfigurationProperty {
    /**
     * The setting that determines whether images are scanned after being pushed to a repository.
     *
     * If set to `true` , images will be scanned after being pushed. If this parameter is not specified, it will default to `false` and images will not be scanned unless a scan is manually started.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-repository-imagescanningconfiguration.html#cfn-ecr-repository-imagescanningconfiguration-scanonpush
     */
    readonly scanOnPush?: boolean | cdk.IResolvable;
  }

  /**
   * The encryption configuration for the repository. This determines how the contents of your repository are encrypted at rest.
   *
   * By default, when no encryption configuration is set or the `AES256` encryption type is used, Amazon ECR uses server-side encryption with Amazon S3-managed encryption keys which encrypts your data at rest using an AES-256 encryption algorithm. This does not require any action on your part.
   *
   * For more control over the encryption of the contents of your repository, you can use server-side encryption with AWS Key Management Service key stored in AWS Key Management Service ( AWS KMS ) to encrypt your images. For more information, see [Amazon ECR encryption at rest](https://docs.aws.amazon.com/AmazonECR/latest/userguide/encryption-at-rest.html) in the *Amazon Elastic Container Registry User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-repository-encryptionconfiguration.html
   */
  export interface EncryptionConfigurationProperty {
    /**
     * The encryption type to use.
     *
     * If you use the `KMS` encryption type, the contents of the repository will be encrypted using server-side encryption with AWS Key Management Service key stored in AWS KMS . When you use AWS KMS to encrypt your data, you can either use the default AWS managed AWS KMS key for Amazon ECR, or specify your own AWS KMS key, which you already created. For more information, see [Protecting data using server-side encryption with an AWS KMS key stored in AWS Key Management Service (SSE-KMS)](https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingKMSEncryption.html) in the *Amazon Simple Storage Service Console Developer Guide* .
     *
     * If you use the `AES256` encryption type, Amazon ECR uses server-side encryption with Amazon S3-managed encryption keys which encrypts the images in the repository using an AES-256 encryption algorithm. For more information, see [Protecting data using server-side encryption with Amazon S3-managed encryption keys (SSE-S3)](https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingServerSideEncryption.html) in the *Amazon Simple Storage Service Console Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-repository-encryptionconfiguration.html#cfn-ecr-repository-encryptionconfiguration-encryptiontype
     */
    readonly encryptionType: string;

    /**
     * If you use the `KMS` encryption type, specify the AWS KMS key to use for encryption.
     *
     * The alias, key ID, or full ARN of the AWS KMS key can be specified. The key must exist in the same Region as the repository. If no key is specified, the default AWS managed AWS KMS key for Amazon ECR will be used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-repository-encryptionconfiguration.html#cfn-ecr-repository-encryptionconfiguration-kmskey
     */
    readonly kmsKey?: string;
  }

  /**
   * The `LifecyclePolicy` property type specifies a lifecycle policy.
   *
   * For information about lifecycle policy syntax, see [Lifecycle policy template](https://docs.aws.amazon.com/AmazonECR/latest/userguide/LifecyclePolicies.html) in the *Amazon ECR User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-repository-lifecyclepolicy.html
   */
  export interface LifecyclePolicyProperty {
    /**
     * The JSON repository policy text to apply to the repository.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-repository-lifecyclepolicy.html#cfn-ecr-repository-lifecyclepolicy-lifecyclepolicytext
     */
    readonly lifecyclePolicyText?: string;

    /**
     * The AWS account ID associated with the registry that contains the repository.
     *
     * If you do not specify a registry, the default registry is assumed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecr-repository-lifecyclepolicy.html#cfn-ecr-repository-lifecyclepolicy-registryid
     */
    readonly registryId?: string;
  }
}

/**
 * Properties for defining a `CfnRepository`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-repository.html
 */
export interface CfnRepositoryProps {
  /**
   * If true, deleting the repository force deletes the contents of the repository.
   *
   * If false, the repository must be empty before attempting to delete it.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-repository.html#cfn-ecr-repository-emptyondelete
   */
  readonly emptyOnDelete?: boolean | cdk.IResolvable;

  /**
   * The encryption configuration for the repository.
   *
   * This determines how the contents of your repository are encrypted at rest.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-repository.html#cfn-ecr-repository-encryptionconfiguration
   */
  readonly encryptionConfiguration?: CfnRepository.EncryptionConfigurationProperty | cdk.IResolvable;

  /**
   * The image scanning configuration for the repository.
   *
   * This determines whether images are scanned for known vulnerabilities after being pushed to the repository.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-repository.html#cfn-ecr-repository-imagescanningconfiguration
   */
  readonly imageScanningConfiguration?: CfnRepository.ImageScanningConfigurationProperty | cdk.IResolvable;

  /**
   * The tag mutability setting for the repository.
   *
   * If this parameter is omitted, the default setting of `MUTABLE` will be used which will allow image tags to be overwritten. If `IMMUTABLE` is specified, all image tags within the repository will be immutable which will prevent them from being overwritten.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-repository.html#cfn-ecr-repository-imagetagmutability
   */
  readonly imageTagMutability?: string;

  /**
   * Creates or updates a lifecycle policy.
   *
   * For information about lifecycle policy syntax, see [Lifecycle policy template](https://docs.aws.amazon.com/AmazonECR/latest/userguide/LifecyclePolicies.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-repository.html#cfn-ecr-repository-lifecyclepolicy
   */
  readonly lifecyclePolicy?: cdk.IResolvable | CfnRepository.LifecyclePolicyProperty;

  /**
   * The name to use for the repository.
   *
   * The repository name may be specified on its own (such as `nginx-web-app` ) or it can be prepended with a namespace to group the repository into a category (such as `project-a/nginx-web-app` ). If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the repository name. For more information, see [Name type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
   *
   * The repository name must start with a letter and can only contain lowercase letters, numbers, hyphens, underscores, and forward slashes.
   *
   * > If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-repository.html#cfn-ecr-repository-repositoryname
   */
  readonly repositoryName?: string;

  /**
   * The JSON repository policy text to apply to the repository.
   *
   * For more information, see [Amazon ECR repository policies](https://docs.aws.amazon.com/AmazonECR/latest/userguide/repository-policy-examples.html) in the *Amazon Elastic Container Registry User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-repository.html#cfn-ecr-repository-repositorypolicytext
   */
  readonly repositoryPolicyText?: any | cdk.IResolvable;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecr-repository.html#cfn-ecr-repository-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `ImageScanningConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ImageScanningConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRepositoryImageScanningConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("scanOnPush", cdk.validateBoolean)(properties.scanOnPush));
  return errors.wrap("supplied properties not correct for \"ImageScanningConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnRepositoryImageScanningConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRepositoryImageScanningConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ScanOnPush": cdk.booleanToCloudFormation(properties.scanOnPush)
  };
}

// @ts-ignore TS6133
function CfnRepositoryImageScanningConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRepository.ImageScanningConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRepository.ImageScanningConfigurationProperty>();
  ret.addPropertyResult("scanOnPush", "ScanOnPush", (properties.ScanOnPush != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ScanOnPush) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EncryptionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRepositoryEncryptionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("encryptionType", cdk.requiredValidator)(properties.encryptionType));
  errors.collect(cdk.propertyValidator("encryptionType", cdk.validateString)(properties.encryptionType));
  errors.collect(cdk.propertyValidator("kmsKey", cdk.validateString)(properties.kmsKey));
  return errors.wrap("supplied properties not correct for \"EncryptionConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnRepositoryEncryptionConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRepositoryEncryptionConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "EncryptionType": cdk.stringToCloudFormation(properties.encryptionType),
    "KmsKey": cdk.stringToCloudFormation(properties.kmsKey)
  };
}

// @ts-ignore TS6133
function CfnRepositoryEncryptionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRepository.EncryptionConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRepository.EncryptionConfigurationProperty>();
  ret.addPropertyResult("encryptionType", "EncryptionType", (properties.EncryptionType != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionType) : undefined));
  ret.addPropertyResult("kmsKey", "KmsKey", (properties.KmsKey != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKey) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LifecyclePolicyProperty`
 *
 * @param properties - the TypeScript properties of a `LifecyclePolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRepositoryLifecyclePolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("lifecyclePolicyText", cdk.validateString)(properties.lifecyclePolicyText));
  errors.collect(cdk.propertyValidator("registryId", cdk.validateString)(properties.registryId));
  return errors.wrap("supplied properties not correct for \"LifecyclePolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnRepositoryLifecyclePolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRepositoryLifecyclePolicyPropertyValidator(properties).assertSuccess();
  return {
    "LifecyclePolicyText": cdk.stringToCloudFormation(properties.lifecyclePolicyText),
    "RegistryId": cdk.stringToCloudFormation(properties.registryId)
  };
}

// @ts-ignore TS6133
function CfnRepositoryLifecyclePolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRepository.LifecyclePolicyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRepository.LifecyclePolicyProperty>();
  ret.addPropertyResult("lifecyclePolicyText", "LifecyclePolicyText", (properties.LifecyclePolicyText != null ? cfn_parse.FromCloudFormation.getString(properties.LifecyclePolicyText) : undefined));
  ret.addPropertyResult("registryId", "RegistryId", (properties.RegistryId != null ? cfn_parse.FromCloudFormation.getString(properties.RegistryId) : undefined));
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
  errors.collect(cdk.propertyValidator("emptyOnDelete", cdk.validateBoolean)(properties.emptyOnDelete));
  errors.collect(cdk.propertyValidator("encryptionConfiguration", CfnRepositoryEncryptionConfigurationPropertyValidator)(properties.encryptionConfiguration));
  errors.collect(cdk.propertyValidator("imageScanningConfiguration", CfnRepositoryImageScanningConfigurationPropertyValidator)(properties.imageScanningConfiguration));
  errors.collect(cdk.propertyValidator("imageTagMutability", cdk.validateString)(properties.imageTagMutability));
  errors.collect(cdk.propertyValidator("lifecyclePolicy", CfnRepositoryLifecyclePolicyPropertyValidator)(properties.lifecyclePolicy));
  errors.collect(cdk.propertyValidator("repositoryName", cdk.validateString)(properties.repositoryName));
  errors.collect(cdk.propertyValidator("repositoryPolicyText", cdk.validateObject)(properties.repositoryPolicyText));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnRepositoryProps\"");
}

// @ts-ignore TS6133
function convertCfnRepositoryPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRepositoryPropsValidator(properties).assertSuccess();
  return {
    "EmptyOnDelete": cdk.booleanToCloudFormation(properties.emptyOnDelete),
    "EncryptionConfiguration": convertCfnRepositoryEncryptionConfigurationPropertyToCloudFormation(properties.encryptionConfiguration),
    "ImageScanningConfiguration": convertCfnRepositoryImageScanningConfigurationPropertyToCloudFormation(properties.imageScanningConfiguration),
    "ImageTagMutability": cdk.stringToCloudFormation(properties.imageTagMutability),
    "LifecyclePolicy": convertCfnRepositoryLifecyclePolicyPropertyToCloudFormation(properties.lifecyclePolicy),
    "RepositoryName": cdk.stringToCloudFormation(properties.repositoryName),
    "RepositoryPolicyText": cdk.objectToCloudFormation(properties.repositoryPolicyText),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
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
  ret.addPropertyResult("emptyOnDelete", "EmptyOnDelete", (properties.EmptyOnDelete != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EmptyOnDelete) : undefined));
  ret.addPropertyResult("encryptionConfiguration", "EncryptionConfiguration", (properties.EncryptionConfiguration != null ? CfnRepositoryEncryptionConfigurationPropertyFromCloudFormation(properties.EncryptionConfiguration) : undefined));
  ret.addPropertyResult("imageScanningConfiguration", "ImageScanningConfiguration", (properties.ImageScanningConfiguration != null ? CfnRepositoryImageScanningConfigurationPropertyFromCloudFormation(properties.ImageScanningConfiguration) : undefined));
  ret.addPropertyResult("imageTagMutability", "ImageTagMutability", (properties.ImageTagMutability != null ? cfn_parse.FromCloudFormation.getString(properties.ImageTagMutability) : undefined));
  ret.addPropertyResult("lifecyclePolicy", "LifecyclePolicy", (properties.LifecyclePolicy != null ? CfnRepositoryLifecyclePolicyPropertyFromCloudFormation(properties.LifecyclePolicy) : undefined));
  ret.addPropertyResult("repositoryName", "RepositoryName", (properties.RepositoryName != null ? cfn_parse.FromCloudFormation.getString(properties.RepositoryName) : undefined));
  ret.addPropertyResult("repositoryPolicyText", "RepositoryPolicyText", (properties.RepositoryPolicyText != null ? cfn_parse.FromCloudFormation.getAny(properties.RepositoryPolicyText) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}