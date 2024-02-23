/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::CodeArtifact::Domain` resource creates an AWS CodeArtifact domain.
 *
 * CodeArtifact *domains* make it easier to manage multiple repositories across an organization. You can use a domain to apply permissions across many repositories owned by different AWS accounts. For more information about domains, see the [Domain concepts information](https://docs.aws.amazon.com/codeartifact/latest/ug/codeartifact-concepts.html#welcome-concepts-domain) in the *CodeArtifact User Guide* . For more information about the `CreateDomain` API, see [CreateDomain](https://docs.aws.amazon.com/codeartifact/latest/APIReference/API_CreateDomain.html) in the *CodeArtifact API Reference* .
 *
 * @cloudformationResource AWS::CodeArtifact::Domain
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-domain.html
 */
export class CfnDomain extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CodeArtifact::Domain";

  /**
   * Build a CfnDomain from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDomain {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDomainPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDomain(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * When you pass the logical ID of this resource, the function returns the Amazon Resource Name (ARN) of the domain.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * When you pass the logical ID of this resource, the function returns the key used to encrypt the domain.
   *
   * @cloudformationAttribute EncryptionKey
   */
  public readonly attrEncryptionKey: string;

  /**
   * When you pass the logical ID of this resource, the function returns the name of the domain.
   *
   * @cloudformationAttribute Name
   */
  public readonly attrName: string;

  /**
   * When you pass the logical ID of this resource, the function returns the 12-digit account number of the AWS account that owns the domain.
   *
   * @cloudformationAttribute Owner
   */
  public readonly attrOwner: string;

  /**
   * A string that specifies the name of the requested domain.
   */
  public domainName: string;

  /**
   * The ARN of an AWS Key Management Service (AWS KMS) key associated with a domain.
   */
  public encryptionKey?: string;

  /**
   * The document that defines the resource policy that is set on a domain.
   */
  public permissionsPolicyDocument?: any | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of tags to be applied to the domain.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDomainProps) {
    super(scope, id, {
      "type": CfnDomain.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "domainName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrEncryptionKey = cdk.Token.asString(this.getAtt("EncryptionKey", cdk.ResolutionTypeHint.STRING));
    this.attrName = cdk.Token.asString(this.getAtt("Name", cdk.ResolutionTypeHint.STRING));
    this.attrOwner = cdk.Token.asString(this.getAtt("Owner", cdk.ResolutionTypeHint.STRING));
    this.domainName = props.domainName;
    this.encryptionKey = props.encryptionKey;
    this.permissionsPolicyDocument = props.permissionsPolicyDocument;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::CodeArtifact::Domain", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "domainName": this.domainName,
      "encryptionKey": this.encryptionKey,
      "permissionsPolicyDocument": this.permissionsPolicyDocument,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDomain.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDomainPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnDomain`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-domain.html
 */
export interface CfnDomainProps {
  /**
   * A string that specifies the name of the requested domain.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-domain.html#cfn-codeartifact-domain-domainname
   */
  readonly domainName: string;

  /**
   * The ARN of an AWS Key Management Service (AWS KMS) key associated with a domain.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-domain.html#cfn-codeartifact-domain-encryptionkey
   */
  readonly encryptionKey?: string;

  /**
   * The document that defines the resource policy that is set on a domain.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-domain.html#cfn-codeartifact-domain-permissionspolicydocument
   */
  readonly permissionsPolicyDocument?: any | cdk.IResolvable;

  /**
   * A list of tags to be applied to the domain.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-domain.html#cfn-codeartifact-domain-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnDomainProps`
 *
 * @param properties - the TypeScript properties of a `CfnDomainProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDomainPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("domainName", cdk.requiredValidator)(properties.domainName));
  errors.collect(cdk.propertyValidator("domainName", cdk.validateString)(properties.domainName));
  errors.collect(cdk.propertyValidator("encryptionKey", cdk.validateString)(properties.encryptionKey));
  errors.collect(cdk.propertyValidator("permissionsPolicyDocument", cdk.validateObject)(properties.permissionsPolicyDocument));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDomainProps\"");
}

// @ts-ignore TS6133
function convertCfnDomainPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDomainPropsValidator(properties).assertSuccess();
  return {
    "DomainName": cdk.stringToCloudFormation(properties.domainName),
    "EncryptionKey": cdk.stringToCloudFormation(properties.encryptionKey),
    "PermissionsPolicyDocument": cdk.objectToCloudFormation(properties.permissionsPolicyDocument),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDomainPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDomainProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDomainProps>();
  ret.addPropertyResult("domainName", "DomainName", (properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined));
  ret.addPropertyResult("encryptionKey", "EncryptionKey", (properties.EncryptionKey != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionKey) : undefined));
  ret.addPropertyResult("permissionsPolicyDocument", "PermissionsPolicyDocument", (properties.PermissionsPolicyDocument != null ? cfn_parse.FromCloudFormation.getAny(properties.PermissionsPolicyDocument) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::CodeArtifact::Repository` resource creates an AWS CodeArtifact repository.
 *
 * CodeArtifact *repositories* contain a set of package versions. For more information about repositories, see the [Repository concepts information](https://docs.aws.amazon.com/codeartifact/latest/ug/codeartifact-concepts.html#welcome-concepts-repository) in the *CodeArtifact User Guide* . For more information about the `CreateRepository` API, see [CreateRepository](https://docs.aws.amazon.com/codeartifact/latest/APIReference/API_CreateRepository.html) in the *CodeArtifact API Reference* .
 *
 * @cloudformationResource AWS::CodeArtifact::Repository
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html
 */
export class CfnRepository extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CodeArtifact::Repository";

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
   * When you pass the logical ID of this resource, the function returns the domain name that contains the repository.
   *
   * @cloudformationAttribute DomainName
   */
  public readonly attrDomainName: string;

  /**
   * When you pass the logical ID of this resource, the function returns the 12-digit account number of the AWS account that owns the domain that contains the repository.
   *
   * @cloudformationAttribute DomainOwner
   */
  public readonly attrDomainOwner: string;

  /**
   * When you pass the logical ID of this resource, the function returns the name of the repository.
   *
   * @cloudformationAttribute Name
   */
  public readonly attrName: string;

  /**
   * A text description of the repository.
   */
  public description?: string;

  /**
   * The name of the domain that contains the repository.
   */
  public domainName: string;

  /**
   * The 12-digit account ID of the AWS account that owns the domain.
   */
  public domainOwner?: string;

  /**
   * An array of external connections associated with the repository.
   */
  public externalConnections?: Array<string>;

  /**
   * The document that defines the resource policy that is set on a repository.
   */
  public permissionsPolicyDocument?: any | cdk.IResolvable;

  /**
   * The name of an upstream repository.
   */
  public repositoryName: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of tags to be applied to the repository.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * A list of upstream repositories to associate with the repository.
   */
  public upstreams?: Array<string>;

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

    cdk.requireProperty(props, "domainName", this);
    cdk.requireProperty(props, "repositoryName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrDomainName = cdk.Token.asString(this.getAtt("DomainName", cdk.ResolutionTypeHint.STRING));
    this.attrDomainOwner = cdk.Token.asString(this.getAtt("DomainOwner", cdk.ResolutionTypeHint.STRING));
    this.attrName = cdk.Token.asString(this.getAtt("Name", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.domainName = props.domainName;
    this.domainOwner = props.domainOwner;
    this.externalConnections = props.externalConnections;
    this.permissionsPolicyDocument = props.permissionsPolicyDocument;
    this.repositoryName = props.repositoryName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::CodeArtifact::Repository", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.upstreams = props.upstreams;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "domainName": this.domainName,
      "domainOwner": this.domainOwner,
      "externalConnections": this.externalConnections,
      "permissionsPolicyDocument": this.permissionsPolicyDocument,
      "repositoryName": this.repositoryName,
      "tags": this.tags.renderTags(),
      "upstreams": this.upstreams
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

/**
 * Properties for defining a `CfnRepository`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html
 */
export interface CfnRepositoryProps {
  /**
   * A text description of the repository.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html#cfn-codeartifact-repository-description
   */
  readonly description?: string;

  /**
   * The name of the domain that contains the repository.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html#cfn-codeartifact-repository-domainname
   */
  readonly domainName: string;

  /**
   * The 12-digit account ID of the AWS account that owns the domain.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html#cfn-codeartifact-repository-domainowner
   */
  readonly domainOwner?: string;

  /**
   * An array of external connections associated with the repository.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html#cfn-codeartifact-repository-externalconnections
   */
  readonly externalConnections?: Array<string>;

  /**
   * The document that defines the resource policy that is set on a repository.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html#cfn-codeartifact-repository-permissionspolicydocument
   */
  readonly permissionsPolicyDocument?: any | cdk.IResolvable;

  /**
   * The name of an upstream repository.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html#cfn-codeartifact-repository-repositoryname
   */
  readonly repositoryName: string;

  /**
   * A list of tags to be applied to the repository.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html#cfn-codeartifact-repository-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * A list of upstream repositories to associate with the repository.
   *
   * The order of the upstream repositories in the list determines their priority order when AWS CodeArtifact looks for a requested package version. For more information, see [Working with upstream repositories](https://docs.aws.amazon.com/codeartifact/latest/ug/repos-upstream.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html#cfn-codeartifact-repository-upstreams
   */
  readonly upstreams?: Array<string>;
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
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("domainName", cdk.requiredValidator)(properties.domainName));
  errors.collect(cdk.propertyValidator("domainName", cdk.validateString)(properties.domainName));
  errors.collect(cdk.propertyValidator("domainOwner", cdk.validateString)(properties.domainOwner));
  errors.collect(cdk.propertyValidator("externalConnections", cdk.listValidator(cdk.validateString))(properties.externalConnections));
  errors.collect(cdk.propertyValidator("permissionsPolicyDocument", cdk.validateObject)(properties.permissionsPolicyDocument));
  errors.collect(cdk.propertyValidator("repositoryName", cdk.requiredValidator)(properties.repositoryName));
  errors.collect(cdk.propertyValidator("repositoryName", cdk.validateString)(properties.repositoryName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("upstreams", cdk.listValidator(cdk.validateString))(properties.upstreams));
  return errors.wrap("supplied properties not correct for \"CfnRepositoryProps\"");
}

// @ts-ignore TS6133
function convertCfnRepositoryPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRepositoryPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "DomainName": cdk.stringToCloudFormation(properties.domainName),
    "DomainOwner": cdk.stringToCloudFormation(properties.domainOwner),
    "ExternalConnections": cdk.listMapper(cdk.stringToCloudFormation)(properties.externalConnections),
    "PermissionsPolicyDocument": cdk.objectToCloudFormation(properties.permissionsPolicyDocument),
    "RepositoryName": cdk.stringToCloudFormation(properties.repositoryName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Upstreams": cdk.listMapper(cdk.stringToCloudFormation)(properties.upstreams)
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
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("domainName", "DomainName", (properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined));
  ret.addPropertyResult("domainOwner", "DomainOwner", (properties.DomainOwner != null ? cfn_parse.FromCloudFormation.getString(properties.DomainOwner) : undefined));
  ret.addPropertyResult("externalConnections", "ExternalConnections", (properties.ExternalConnections != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExternalConnections) : undefined));
  ret.addPropertyResult("permissionsPolicyDocument", "PermissionsPolicyDocument", (properties.PermissionsPolicyDocument != null ? cfn_parse.FromCloudFormation.getAny(properties.PermissionsPolicyDocument) : undefined));
  ret.addPropertyResult("repositoryName", "RepositoryName", (properties.RepositoryName != null ? cfn_parse.FromCloudFormation.getString(properties.RepositoryName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("upstreams", "Upstreams", (properties.Upstreams != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Upstreams) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}