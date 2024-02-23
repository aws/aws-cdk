/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Accepts an offer to share the specified portfolio.
 *
 * @cloudformationResource AWS::ServiceCatalog::AcceptedPortfolioShare
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-acceptedportfolioshare.html
 */
export class CfnAcceptedPortfolioShare extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ServiceCatalog::AcceptedPortfolioShare";

  /**
   * Build a CfnAcceptedPortfolioShare from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAcceptedPortfolioShare {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAcceptedPortfolioSharePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAcceptedPortfolioShare(scope, id, propsResult.value);
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
   * The language code.
   */
  public acceptLanguage?: string;

  /**
   * The portfolio identifier.
   */
  public portfolioId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAcceptedPortfolioShareProps) {
    super(scope, id, {
      "type": CfnAcceptedPortfolioShare.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "portfolioId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.acceptLanguage = props.acceptLanguage;
    this.portfolioId = props.portfolioId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "acceptLanguage": this.acceptLanguage,
      "portfolioId": this.portfolioId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAcceptedPortfolioShare.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAcceptedPortfolioSharePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnAcceptedPortfolioShare`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-acceptedportfolioshare.html
 */
export interface CfnAcceptedPortfolioShareProps {
  /**
   * The language code.
   *
   * - `jp` - Japanese
   * - `zh` - Chinese
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-acceptedportfolioshare.html#cfn-servicecatalog-acceptedportfolioshare-acceptlanguage
   */
  readonly acceptLanguage?: string;

  /**
   * The portfolio identifier.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-acceptedportfolioshare.html#cfn-servicecatalog-acceptedportfolioshare-portfolioid
   */
  readonly portfolioId: string;
}

/**
 * Determine whether the given properties match those of a `CfnAcceptedPortfolioShareProps`
 *
 * @param properties - the TypeScript properties of a `CfnAcceptedPortfolioShareProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAcceptedPortfolioSharePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("acceptLanguage", cdk.validateString)(properties.acceptLanguage));
  errors.collect(cdk.propertyValidator("portfolioId", cdk.requiredValidator)(properties.portfolioId));
  errors.collect(cdk.propertyValidator("portfolioId", cdk.validateString)(properties.portfolioId));
  return errors.wrap("supplied properties not correct for \"CfnAcceptedPortfolioShareProps\"");
}

// @ts-ignore TS6133
function convertCfnAcceptedPortfolioSharePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAcceptedPortfolioSharePropsValidator(properties).assertSuccess();
  return {
    "AcceptLanguage": cdk.stringToCloudFormation(properties.acceptLanguage),
    "PortfolioId": cdk.stringToCloudFormation(properties.portfolioId)
  };
}

// @ts-ignore TS6133
function CfnAcceptedPortfolioSharePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAcceptedPortfolioShareProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAcceptedPortfolioShareProps>();
  ret.addPropertyResult("acceptLanguage", "AcceptLanguage", (properties.AcceptLanguage != null ? cfn_parse.FromCloudFormation.getString(properties.AcceptLanguage) : undefined));
  ret.addPropertyResult("portfolioId", "PortfolioId", (properties.PortfolioId != null ? cfn_parse.FromCloudFormation.getString(properties.PortfolioId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a product.
 *
 * @cloudformationResource AWS::ServiceCatalog::CloudFormationProduct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html
 */
export class CfnCloudFormationProduct extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ServiceCatalog::CloudFormationProduct";

  /**
   * Build a CfnCloudFormationProduct from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCloudFormationProduct {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnCloudFormationProductPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCloudFormationProduct(scope, id, propsResult.value);
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
   * The name of the product.
   *
   * @cloudformationAttribute ProductName
   */
  public readonly attrProductName: string;

  /**
   * The IDs of the provisioning artifacts.
   *
   * @cloudformationAttribute ProvisioningArtifactIds
   */
  public readonly attrProvisioningArtifactIds: string;

  /**
   * The names of the provisioning artifacts.
   *
   * @cloudformationAttribute ProvisioningArtifactNames
   */
  public readonly attrProvisioningArtifactNames: string;

  /**
   * The language code.
   */
  public acceptLanguage?: string;

  /**
   * The description of the product.
   */
  public description?: string;

  /**
   * The distributor of the product.
   */
  public distributor?: string;

  /**
   * The name of the product.
   */
  public name: string;

  /**
   * The owner of the product.
   */
  public owner: string;

  /**
   * The type of product.
   */
  public productType?: string;

  /**
   * The configuration of the provisioning artifact (also known as a version).
   */
  public provisioningArtifactParameters?: Array<cdk.IResolvable | CfnCloudFormationProduct.ProvisioningArtifactPropertiesProperty> | cdk.IResolvable;

  /**
   * This property is turned off by default.
   */
  public replaceProvisioningArtifacts?: boolean | cdk.IResolvable;

  /**
   * A top level `ProductViewDetail` response containing details about the product’s connection.
   */
  public sourceConnection?: cdk.IResolvable | CfnCloudFormationProduct.SourceConnectionProperty;

  /**
   * The support information about the product.
   */
  public supportDescription?: string;

  /**
   * The contact email for product support.
   */
  public supportEmail?: string;

  /**
   * The contact URL for product support.
   */
  public supportUrl?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * One or more tags.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCloudFormationProductProps) {
    super(scope, id, {
      "type": CfnCloudFormationProduct.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "owner", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrProductName = cdk.Token.asString(this.getAtt("ProductName", cdk.ResolutionTypeHint.STRING));
    this.attrProvisioningArtifactIds = cdk.Token.asString(this.getAtt("ProvisioningArtifactIds", cdk.ResolutionTypeHint.STRING));
    this.attrProvisioningArtifactNames = cdk.Token.asString(this.getAtt("ProvisioningArtifactNames", cdk.ResolutionTypeHint.STRING));
    this.acceptLanguage = props.acceptLanguage;
    this.description = props.description;
    this.distributor = props.distributor;
    this.name = props.name;
    this.owner = props.owner;
    this.productType = props.productType;
    this.provisioningArtifactParameters = props.provisioningArtifactParameters;
    this.replaceProvisioningArtifacts = props.replaceProvisioningArtifacts;
    this.sourceConnection = props.sourceConnection;
    this.supportDescription = props.supportDescription;
    this.supportEmail = props.supportEmail;
    this.supportUrl = props.supportUrl;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ServiceCatalog::CloudFormationProduct", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "acceptLanguage": this.acceptLanguage,
      "description": this.description,
      "distributor": this.distributor,
      "name": this.name,
      "owner": this.owner,
      "productType": this.productType,
      "provisioningArtifactParameters": this.provisioningArtifactParameters,
      "replaceProvisioningArtifacts": this.replaceProvisioningArtifacts,
      "sourceConnection": this.sourceConnection,
      "supportDescription": this.supportDescription,
      "supportEmail": this.supportEmail,
      "supportUrl": this.supportUrl,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCloudFormationProduct.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCloudFormationProductPropsToCloudFormation(props);
  }
}

export namespace CfnCloudFormationProduct {
  /**
   * A top level `ProductViewDetail` response containing details about the product’s connection.
   *
   * AWS Service Catalog returns this field for the `CreateProduct` , `UpdateProduct` , `DescribeProductAsAdmin` , and `SearchProductAsAdmin` APIs. This response contains the same fields as the `ConnectionParameters` request, with the addition of the `LastSync` response.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationproduct-sourceconnection.html
   */
  export interface SourceConnectionProperty {
    /**
     * The connection details based on the connection `Type` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationproduct-sourceconnection.html#cfn-servicecatalog-cloudformationproduct-sourceconnection-connectionparameters
     */
    readonly connectionParameters: CfnCloudFormationProduct.ConnectionParametersProperty | cdk.IResolvable;

    /**
     * The only supported `SourceConnection` type is Codestar.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationproduct-sourceconnection.html#cfn-servicecatalog-cloudformationproduct-sourceconnection-type
     */
    readonly type: string;
  }

  /**
   * Provides connection details.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationproduct-connectionparameters.html
   */
  export interface ConnectionParametersProperty {
    /**
     * Provides `ConnectionType` details.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationproduct-connectionparameters.html#cfn-servicecatalog-cloudformationproduct-connectionparameters-codestar
     */
    readonly codeStar?: CfnCloudFormationProduct.CodeStarParametersProperty | cdk.IResolvable;
  }

  /**
   * The subtype containing details about the Codestar connection `Type` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationproduct-codestarparameters.html
   */
  export interface CodeStarParametersProperty {
    /**
     * The absolute path wehre the artifact resides within the repo and branch, formatted as "folder/file.json.".
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationproduct-codestarparameters.html#cfn-servicecatalog-cloudformationproduct-codestarparameters-artifactpath
     */
    readonly artifactPath: string;

    /**
     * The specific branch where the artifact resides.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationproduct-codestarparameters.html#cfn-servicecatalog-cloudformationproduct-codestarparameters-branch
     */
    readonly branch: string;

    /**
     * The CodeStar ARN, which is the connection between AWS Service Catalog and the external repository.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationproduct-codestarparameters.html#cfn-servicecatalog-cloudformationproduct-codestarparameters-connectionarn
     */
    readonly connectionArn: string;

    /**
     * The specific repository where the product’s artifact-to-be-synced resides, formatted as "Account/Repo.".
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationproduct-codestarparameters.html#cfn-servicecatalog-cloudformationproduct-codestarparameters-repository
     */
    readonly repository: string;
  }

  /**
   * Information about a provisioning artifact (also known as a version) for a product.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationproduct-provisioningartifactproperties.html
   */
  export interface ProvisioningArtifactPropertiesProperty {
    /**
     * The description of the provisioning artifact, including how it differs from the previous provisioning artifact.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationproduct-provisioningartifactproperties.html#cfn-servicecatalog-cloudformationproduct-provisioningartifactproperties-description
     */
    readonly description?: string;

    /**
     * If set to true, AWS Service Catalog stops validating the specified provisioning artifact even if it is invalid.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationproduct-provisioningartifactproperties.html#cfn-servicecatalog-cloudformationproduct-provisioningartifactproperties-disabletemplatevalidation
     */
    readonly disableTemplateValidation?: boolean | cdk.IResolvable;

    /**
     * Specify the template source with one of the following options, but not both.
     *
     * Keys accepted: [ `LoadTemplateFromURL` , `ImportFromPhysicalId` ]
     *
     * The URL of the AWS CloudFormation template in Amazon S3 in JSON format. Specify the URL in JSON format as follows:
     *
     * `"LoadTemplateFromURL": "https://s3.amazonaws.com/cf-templates-ozkq9d3hgiq2-us-east-1/..."`
     *
     * `ImportFromPhysicalId` : The physical id of the resource that contains the template. Currently only supports AWS CloudFormation stack arn. Specify the physical id in JSON format as follows: `ImportFromPhysicalId: “arn:aws:cloudformation:[us-east-1]:[accountId]:stack/[StackName]/[resourceId]`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationproduct-provisioningartifactproperties.html#cfn-servicecatalog-cloudformationproduct-provisioningartifactproperties-info
     */
    readonly info: any | cdk.IResolvable;

    /**
     * The name of the provisioning artifact (for example, v1 v2beta).
     *
     * No spaces are allowed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationproduct-provisioningartifactproperties.html#cfn-servicecatalog-cloudformationproduct-provisioningartifactproperties-name
     */
    readonly name?: string;

    /**
     * The type of provisioning artifact.
     *
     * - `CLOUD_FORMATION_TEMPLATE` - AWS CloudFormation template
     * - `TERRAFORM_OPEN_SOURCE` - Terraform Open Source configuration file
     * - `TERRAFORM_CLOUD` - Terraform Cloud configuration file
     * - `EXTERNAL` - External configuration file
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationproduct-provisioningartifactproperties.html#cfn-servicecatalog-cloudformationproduct-provisioningartifactproperties-type
     */
    readonly type?: string;
  }
}

/**
 * Properties for defining a `CfnCloudFormationProduct`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html
 */
export interface CfnCloudFormationProductProps {
  /**
   * The language code.
   *
   * - `jp` - Japanese
   * - `zh` - Chinese
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-acceptlanguage
   */
  readonly acceptLanguage?: string;

  /**
   * The description of the product.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-description
   */
  readonly description?: string;

  /**
   * The distributor of the product.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-distributor
   */
  readonly distributor?: string;

  /**
   * The name of the product.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-name
   */
  readonly name: string;

  /**
   * The owner of the product.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-owner
   */
  readonly owner: string;

  /**
   * The type of product.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-producttype
   */
  readonly productType?: string;

  /**
   * The configuration of the provisioning artifact (also known as a version).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-provisioningartifactparameters
   */
  readonly provisioningArtifactParameters?: Array<cdk.IResolvable | CfnCloudFormationProduct.ProvisioningArtifactPropertiesProperty> | cdk.IResolvable;

  /**
   * This property is turned off by default.
   *
   * If turned off, you can update provisioning artifacts or product attributes (such as description, distributor, name, owner, and more) and the associated provisioning artifacts will retain the same unique identifier. Provisioning artifacts are matched within the CloudFormationProduct resource, and only those that have been updated will be changed. Provisioning artifacts are matched by a combinaton of provisioning artifact template URL and name.
   *
   * If turned on, provisioning artifacts will be given a new unique identifier when you update the product or provisioning artifacts.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-replaceprovisioningartifacts
   */
  readonly replaceProvisioningArtifacts?: boolean | cdk.IResolvable;

  /**
   * A top level `ProductViewDetail` response containing details about the product’s connection.
   *
   * AWS Service Catalog returns this field for the `CreateProduct` , `UpdateProduct` , `DescribeProductAsAdmin` , and `SearchProductAsAdmin` APIs. This response contains the same fields as the `ConnectionParameters` request, with the addition of the `LastSync` response.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-sourceconnection
   */
  readonly sourceConnection?: cdk.IResolvable | CfnCloudFormationProduct.SourceConnectionProperty;

  /**
   * The support information about the product.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-supportdescription
   */
  readonly supportDescription?: string;

  /**
   * The contact email for product support.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-supportemail
   */
  readonly supportEmail?: string;

  /**
   * The contact URL for product support.
   *
   * `^https?:\/\//` / is the pattern used to validate SupportUrl.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-supporturl
   */
  readonly supportUrl?: string;

  /**
   * One or more tags.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html#cfn-servicecatalog-cloudformationproduct-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CodeStarParametersProperty`
 *
 * @param properties - the TypeScript properties of a `CodeStarParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCloudFormationProductCodeStarParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("artifactPath", cdk.requiredValidator)(properties.artifactPath));
  errors.collect(cdk.propertyValidator("artifactPath", cdk.validateString)(properties.artifactPath));
  errors.collect(cdk.propertyValidator("branch", cdk.requiredValidator)(properties.branch));
  errors.collect(cdk.propertyValidator("branch", cdk.validateString)(properties.branch));
  errors.collect(cdk.propertyValidator("connectionArn", cdk.requiredValidator)(properties.connectionArn));
  errors.collect(cdk.propertyValidator("connectionArn", cdk.validateString)(properties.connectionArn));
  errors.collect(cdk.propertyValidator("repository", cdk.requiredValidator)(properties.repository));
  errors.collect(cdk.propertyValidator("repository", cdk.validateString)(properties.repository));
  return errors.wrap("supplied properties not correct for \"CodeStarParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnCloudFormationProductCodeStarParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCloudFormationProductCodeStarParametersPropertyValidator(properties).assertSuccess();
  return {
    "ArtifactPath": cdk.stringToCloudFormation(properties.artifactPath),
    "Branch": cdk.stringToCloudFormation(properties.branch),
    "ConnectionArn": cdk.stringToCloudFormation(properties.connectionArn),
    "Repository": cdk.stringToCloudFormation(properties.repository)
  };
}

// @ts-ignore TS6133
function CfnCloudFormationProductCodeStarParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCloudFormationProduct.CodeStarParametersProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCloudFormationProduct.CodeStarParametersProperty>();
  ret.addPropertyResult("artifactPath", "ArtifactPath", (properties.ArtifactPath != null ? cfn_parse.FromCloudFormation.getString(properties.ArtifactPath) : undefined));
  ret.addPropertyResult("branch", "Branch", (properties.Branch != null ? cfn_parse.FromCloudFormation.getString(properties.Branch) : undefined));
  ret.addPropertyResult("connectionArn", "ConnectionArn", (properties.ConnectionArn != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectionArn) : undefined));
  ret.addPropertyResult("repository", "Repository", (properties.Repository != null ? cfn_parse.FromCloudFormation.getString(properties.Repository) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConnectionParametersProperty`
 *
 * @param properties - the TypeScript properties of a `ConnectionParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCloudFormationProductConnectionParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("codeStar", CfnCloudFormationProductCodeStarParametersPropertyValidator)(properties.codeStar));
  return errors.wrap("supplied properties not correct for \"ConnectionParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnCloudFormationProductConnectionParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCloudFormationProductConnectionParametersPropertyValidator(properties).assertSuccess();
  return {
    "CodeStar": convertCfnCloudFormationProductCodeStarParametersPropertyToCloudFormation(properties.codeStar)
  };
}

// @ts-ignore TS6133
function CfnCloudFormationProductConnectionParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCloudFormationProduct.ConnectionParametersProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCloudFormationProduct.ConnectionParametersProperty>();
  ret.addPropertyResult("codeStar", "CodeStar", (properties.CodeStar != null ? CfnCloudFormationProductCodeStarParametersPropertyFromCloudFormation(properties.CodeStar) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SourceConnectionProperty`
 *
 * @param properties - the TypeScript properties of a `SourceConnectionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCloudFormationProductSourceConnectionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectionParameters", cdk.requiredValidator)(properties.connectionParameters));
  errors.collect(cdk.propertyValidator("connectionParameters", CfnCloudFormationProductConnectionParametersPropertyValidator)(properties.connectionParameters));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"SourceConnectionProperty\"");
}

// @ts-ignore TS6133
function convertCfnCloudFormationProductSourceConnectionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCloudFormationProductSourceConnectionPropertyValidator(properties).assertSuccess();
  return {
    "ConnectionParameters": convertCfnCloudFormationProductConnectionParametersPropertyToCloudFormation(properties.connectionParameters),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnCloudFormationProductSourceConnectionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCloudFormationProduct.SourceConnectionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCloudFormationProduct.SourceConnectionProperty>();
  ret.addPropertyResult("connectionParameters", "ConnectionParameters", (properties.ConnectionParameters != null ? CfnCloudFormationProductConnectionParametersPropertyFromCloudFormation(properties.ConnectionParameters) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ProvisioningArtifactPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `ProvisioningArtifactPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCloudFormationProductProvisioningArtifactPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("disableTemplateValidation", cdk.validateBoolean)(properties.disableTemplateValidation));
  errors.collect(cdk.propertyValidator("info", cdk.requiredValidator)(properties.info));
  errors.collect(cdk.propertyValidator("info", cdk.validateObject)(properties.info));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"ProvisioningArtifactPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnCloudFormationProductProvisioningArtifactPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCloudFormationProductProvisioningArtifactPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "DisableTemplateValidation": cdk.booleanToCloudFormation(properties.disableTemplateValidation),
    "Info": cdk.objectToCloudFormation(properties.info),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnCloudFormationProductProvisioningArtifactPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCloudFormationProduct.ProvisioningArtifactPropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCloudFormationProduct.ProvisioningArtifactPropertiesProperty>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("disableTemplateValidation", "DisableTemplateValidation", (properties.DisableTemplateValidation != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DisableTemplateValidation) : undefined));
  ret.addPropertyResult("info", "Info", (properties.Info != null ? cfn_parse.FromCloudFormation.getAny(properties.Info) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnCloudFormationProductProps`
 *
 * @param properties - the TypeScript properties of a `CfnCloudFormationProductProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCloudFormationProductPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("acceptLanguage", cdk.validateString)(properties.acceptLanguage));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("distributor", cdk.validateString)(properties.distributor));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("owner", cdk.requiredValidator)(properties.owner));
  errors.collect(cdk.propertyValidator("owner", cdk.validateString)(properties.owner));
  errors.collect(cdk.propertyValidator("productType", cdk.validateString)(properties.productType));
  errors.collect(cdk.propertyValidator("provisioningArtifactParameters", cdk.listValidator(CfnCloudFormationProductProvisioningArtifactPropertiesPropertyValidator))(properties.provisioningArtifactParameters));
  errors.collect(cdk.propertyValidator("replaceProvisioningArtifacts", cdk.validateBoolean)(properties.replaceProvisioningArtifacts));
  errors.collect(cdk.propertyValidator("sourceConnection", CfnCloudFormationProductSourceConnectionPropertyValidator)(properties.sourceConnection));
  errors.collect(cdk.propertyValidator("supportDescription", cdk.validateString)(properties.supportDescription));
  errors.collect(cdk.propertyValidator("supportEmail", cdk.validateString)(properties.supportEmail));
  errors.collect(cdk.propertyValidator("supportUrl", cdk.validateString)(properties.supportUrl));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnCloudFormationProductProps\"");
}

// @ts-ignore TS6133
function convertCfnCloudFormationProductPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCloudFormationProductPropsValidator(properties).assertSuccess();
  return {
    "AcceptLanguage": cdk.stringToCloudFormation(properties.acceptLanguage),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Distributor": cdk.stringToCloudFormation(properties.distributor),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Owner": cdk.stringToCloudFormation(properties.owner),
    "ProductType": cdk.stringToCloudFormation(properties.productType),
    "ProvisioningArtifactParameters": cdk.listMapper(convertCfnCloudFormationProductProvisioningArtifactPropertiesPropertyToCloudFormation)(properties.provisioningArtifactParameters),
    "ReplaceProvisioningArtifacts": cdk.booleanToCloudFormation(properties.replaceProvisioningArtifacts),
    "SourceConnection": convertCfnCloudFormationProductSourceConnectionPropertyToCloudFormation(properties.sourceConnection),
    "SupportDescription": cdk.stringToCloudFormation(properties.supportDescription),
    "SupportEmail": cdk.stringToCloudFormation(properties.supportEmail),
    "SupportUrl": cdk.stringToCloudFormation(properties.supportUrl),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnCloudFormationProductPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCloudFormationProductProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCloudFormationProductProps>();
  ret.addPropertyResult("acceptLanguage", "AcceptLanguage", (properties.AcceptLanguage != null ? cfn_parse.FromCloudFormation.getString(properties.AcceptLanguage) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("distributor", "Distributor", (properties.Distributor != null ? cfn_parse.FromCloudFormation.getString(properties.Distributor) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("owner", "Owner", (properties.Owner != null ? cfn_parse.FromCloudFormation.getString(properties.Owner) : undefined));
  ret.addPropertyResult("productType", "ProductType", (properties.ProductType != null ? cfn_parse.FromCloudFormation.getString(properties.ProductType) : undefined));
  ret.addPropertyResult("provisioningArtifactParameters", "ProvisioningArtifactParameters", (properties.ProvisioningArtifactParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnCloudFormationProductProvisioningArtifactPropertiesPropertyFromCloudFormation)(properties.ProvisioningArtifactParameters) : undefined));
  ret.addPropertyResult("replaceProvisioningArtifacts", "ReplaceProvisioningArtifacts", (properties.ReplaceProvisioningArtifacts != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ReplaceProvisioningArtifacts) : undefined));
  ret.addPropertyResult("sourceConnection", "SourceConnection", (properties.SourceConnection != null ? CfnCloudFormationProductSourceConnectionPropertyFromCloudFormation(properties.SourceConnection) : undefined));
  ret.addPropertyResult("supportDescription", "SupportDescription", (properties.SupportDescription != null ? cfn_parse.FromCloudFormation.getString(properties.SupportDescription) : undefined));
  ret.addPropertyResult("supportEmail", "SupportEmail", (properties.SupportEmail != null ? cfn_parse.FromCloudFormation.getString(properties.SupportEmail) : undefined));
  ret.addPropertyResult("supportUrl", "SupportUrl", (properties.SupportUrl != null ? cfn_parse.FromCloudFormation.getString(properties.SupportUrl) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Provisions the specified product.
 *
 * A provisioned product is a resourced instance of a product. For example, provisioning a product based on a AWS CloudFormation template launches a AWS CloudFormation stack and its underlying resources. You can check the status of this request using [DescribeRecord](https://docs.aws.amazon.com/servicecatalog/latest/dg/API_DescribeRecord.html) .
 *
 * If the request contains a tag key with an empty list of values, there is a tag conflict for that key. Do not include conflicted keys as tags, or this causes the error "Parameter validation failed: Missing required parameter in Tags[ *N* ]: *Value* ".
 *
 * @cloudformationResource AWS::ServiceCatalog::CloudFormationProvisionedProduct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html
 */
export class CfnCloudFormationProvisionedProduct extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ServiceCatalog::CloudFormationProvisionedProduct";

  /**
   * Build a CfnCloudFormationProvisionedProduct from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCloudFormationProvisionedProduct {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnCloudFormationProvisionedProductPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCloudFormationProvisionedProduct(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute CloudformationStackArn
   */
  public readonly attrCloudformationStackArn: string;

  /**
   * List of key-value pair outputs.
   *
   * @cloudformationAttribute Outputs
   */
  public readonly attrOutputs: cdk.IResolvable;

  /**
   * The ID of the provisioned product.
   *
   * @cloudformationAttribute ProvisionedProductId
   */
  public readonly attrProvisionedProductId: string;

  /**
   * The ID of the record, such as `rec-rjeatvy434trk` .
   *
   * @cloudformationAttribute RecordId
   */
  public readonly attrRecordId: string;

  /**
   * The language code.
   */
  public acceptLanguage?: string;

  /**
   * Passed to AWS CloudFormation .
   */
  public notificationArns?: Array<string>;

  /**
   * The path identifier of the product.
   */
  public pathId?: string;

  /**
   * The name of the path.
   */
  public pathName?: string;

  /**
   * The product identifier.
   */
  public productId?: string;

  /**
   * The name of the Service Catalog product.
   */
  public productName?: string;

  /**
   * A user-friendly name for the provisioned product.
   */
  public provisionedProductName?: string;

  /**
   * The identifier of the provisioning artifact (also known as a version).
   */
  public provisioningArtifactId?: string;

  /**
   * The name of the provisioning artifact (also known as a version) for the product.
   */
  public provisioningArtifactName?: string;

  /**
   * Parameters specified by the administrator that are required for provisioning the product.
   */
  public provisioningParameters?: Array<cdk.IResolvable | CfnCloudFormationProvisionedProduct.ProvisioningParameterProperty> | cdk.IResolvable;

  /**
   * StackSet preferences that are required for provisioning the product or updating a provisioned product.
   */
  public provisioningPreferences?: cdk.IResolvable | CfnCloudFormationProvisionedProduct.ProvisioningPreferencesProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * One or more tags.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCloudFormationProvisionedProductProps = {}) {
    super(scope, id, {
      "type": CfnCloudFormationProvisionedProduct.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrCloudformationStackArn = cdk.Token.asString(this.getAtt("CloudformationStackArn", cdk.ResolutionTypeHint.STRING));
    this.attrOutputs = this.getAtt("Outputs");
    this.attrProvisionedProductId = cdk.Token.asString(this.getAtt("ProvisionedProductId", cdk.ResolutionTypeHint.STRING));
    this.attrRecordId = cdk.Token.asString(this.getAtt("RecordId", cdk.ResolutionTypeHint.STRING));
    this.acceptLanguage = props.acceptLanguage;
    this.notificationArns = props.notificationArns;
    this.pathId = props.pathId;
    this.pathName = props.pathName;
    this.productId = props.productId;
    this.productName = props.productName;
    this.provisionedProductName = props.provisionedProductName;
    this.provisioningArtifactId = props.provisioningArtifactId;
    this.provisioningArtifactName = props.provisioningArtifactName;
    this.provisioningParameters = props.provisioningParameters;
    this.provisioningPreferences = props.provisioningPreferences;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ServiceCatalog::CloudFormationProvisionedProduct", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "acceptLanguage": this.acceptLanguage,
      "notificationArns": this.notificationArns,
      "pathId": this.pathId,
      "pathName": this.pathName,
      "productId": this.productId,
      "productName": this.productName,
      "provisionedProductName": this.provisionedProductName,
      "provisioningArtifactId": this.provisioningArtifactId,
      "provisioningArtifactName": this.provisioningArtifactName,
      "provisioningParameters": this.provisioningParameters,
      "provisioningPreferences": this.provisioningPreferences,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCloudFormationProvisionedProduct.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCloudFormationProvisionedProductPropsToCloudFormation(props);
  }
}

export namespace CfnCloudFormationProvisionedProduct {
  /**
   * Information about a parameter used to provision a product.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationprovisionedproduct-provisioningparameter.html
   */
  export interface ProvisioningParameterProperty {
    /**
     * The parameter key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationprovisionedproduct-provisioningparameter.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisioningparameter-key
     */
    readonly key: string;

    /**
     * The parameter value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationprovisionedproduct-provisioningparameter.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisioningparameter-value
     */
    readonly value: string;
  }

  /**
   * The user-defined preferences that will be applied when updating a provisioned product.
   *
   * Not all preferences are applicable to all provisioned product type
   *
   * One or more AWS accounts that will have access to the provisioned product.
   *
   * Applicable only to a `CFN_STACKSET` provisioned product type.
   *
   * The AWS accounts specified should be within the list of accounts in the `STACKSET` constraint. To get the list of accounts in the `STACKSET` constraint, use the `DescribeProvisioningParameters` operation.
   *
   * If no values are specified, the default value is all accounts from the `STACKSET` constraint.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationprovisionedproduct-provisioningpreferences.html
   */
  export interface ProvisioningPreferencesProperty {
    /**
     * One or more AWS accounts where the provisioned product will be available.
     *
     * Applicable only to a `CFN_STACKSET` provisioned product type.
     *
     * The specified accounts should be within the list of accounts from the `STACKSET` constraint. To get the list of accounts in the `STACKSET` constraint, use the `DescribeProvisioningParameters` operation.
     *
     * If no values are specified, the default value is all acounts from the `STACKSET` constraint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationprovisionedproduct-provisioningpreferences.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisioningpreferences-stacksetaccounts
     */
    readonly stackSetAccounts?: Array<string>;

    /**
     * The number of accounts, per Region, for which this operation can fail before AWS Service Catalog stops the operation in that Region.
     *
     * If the operation is stopped in a Region, AWS Service Catalog doesn't attempt the operation in any subsequent Regions.
     *
     * Applicable only to a `CFN_STACKSET` provisioned product type.
     *
     * Conditional: You must specify either `StackSetFailureToleranceCount` or `StackSetFailureTolerancePercentage` , but not both.
     *
     * The default value is `0` if no value is specified.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationprovisionedproduct-provisioningpreferences.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisioningpreferences-stacksetfailuretolerancecount
     */
    readonly stackSetFailureToleranceCount?: number;

    /**
     * The percentage of accounts, per Region, for which this stack operation can fail before AWS Service Catalog stops the operation in that Region.
     *
     * If the operation is stopped in a Region, AWS Service Catalog doesn't attempt the operation in any subsequent Regions.
     *
     * When calculating the number of accounts based on the specified percentage, AWS Service Catalog rounds down to the next whole number.
     *
     * Applicable only to a `CFN_STACKSET` provisioned product type.
     *
     * Conditional: You must specify either `StackSetFailureToleranceCount` or `StackSetFailureTolerancePercentage` , but not both.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationprovisionedproduct-provisioningpreferences.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisioningpreferences-stacksetfailuretolerancepercentage
     */
    readonly stackSetFailureTolerancePercentage?: number;

    /**
     * The maximum number of accounts in which to perform this operation at one time.
     *
     * This is dependent on the value of `StackSetFailureToleranceCount` . `StackSetMaxConcurrentCount` is at most one more than the `StackSetFailureToleranceCount` .
     *
     * Note that this setting lets you specify the maximum for operations. For large deployments, under certain circumstances the actual number of accounts acted upon concurrently may be lower due to service throttling.
     *
     * Applicable only to a `CFN_STACKSET` provisioned product type.
     *
     * Conditional: You must specify either `StackSetMaxConcurrentCount` or `StackSetMaxConcurrentPercentage` , but not both.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationprovisionedproduct-provisioningpreferences.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisioningpreferences-stacksetmaxconcurrencycount
     */
    readonly stackSetMaxConcurrencyCount?: number;

    /**
     * The maximum percentage of accounts in which to perform this operation at one time.
     *
     * When calculating the number of accounts based on the specified percentage, AWS Service Catalog rounds down to the next whole number. This is true except in cases where rounding down would result is zero. In this case, AWS Service Catalog sets the number as `1` instead.
     *
     * Note that this setting lets you specify the maximum for operations. For large deployments, under certain circumstances the actual number of accounts acted upon concurrently may be lower due to service throttling.
     *
     * Applicable only to a `CFN_STACKSET` provisioned product type.
     *
     * Conditional: You must specify either `StackSetMaxConcurrentCount` or `StackSetMaxConcurrentPercentage` , but not both.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationprovisionedproduct-provisioningpreferences.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisioningpreferences-stacksetmaxconcurrencypercentage
     */
    readonly stackSetMaxConcurrencyPercentage?: number;

    /**
     * Determines what action AWS Service Catalog performs to a stack set or a stack instance represented by the provisioned product.
     *
     * The default value is `UPDATE` if nothing is specified.
     *
     * Applicable only to a `CFN_STACKSET` provisioned product type.
     *
     * - **CREATE** - Creates a new stack instance in the stack set represented by the provisioned product. In this case, only new stack instances are created based on accounts and Regions; if new ProductId or ProvisioningArtifactID are passed, they will be ignored.
     * - **UPDATE** - Updates the stack set represented by the provisioned product and also its stack instances.
     * - **DELETE** - Deletes a stack instance in the stack set represented by the provisioned product.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationprovisionedproduct-provisioningpreferences.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisioningpreferences-stacksetoperationtype
     */
    readonly stackSetOperationType?: string;

    /**
     * One or more AWS Regions where the provisioned product will be available.
     *
     * Applicable only to a `CFN_STACKSET` provisioned product type.
     *
     * The specified Regions should be within the list of Regions from the `STACKSET` constraint. To get the list of Regions in the `STACKSET` constraint, use the `DescribeProvisioningParameters` operation.
     *
     * If no values are specified, the default value is all Regions from the `STACKSET` constraint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-cloudformationprovisionedproduct-provisioningpreferences.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisioningpreferences-stacksetregions
     */
    readonly stackSetRegions?: Array<string>;
  }
}

/**
 * Properties for defining a `CfnCloudFormationProvisionedProduct`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html
 */
export interface CfnCloudFormationProvisionedProductProps {
  /**
   * The language code.
   *
   * - `jp` - Japanese
   * - `zh` - Chinese
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-acceptlanguage
   */
  readonly acceptLanguage?: string;

  /**
   * Passed to AWS CloudFormation .
   *
   * The SNS topic ARNs to which to publish stack-related events.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-notificationarns
   */
  readonly notificationArns?: Array<string>;

  /**
   * The path identifier of the product.
   *
   * This value is optional if the product has a default path, and required if the product has more than one path. To list the paths for a product, use [ListLaunchPaths](https://docs.aws.amazon.com/servicecatalog/latest/dg/API_ListLaunchPaths.html) .
   *
   * > You must provide the name or ID, but not both.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-pathid
   */
  readonly pathId?: string;

  /**
   * The name of the path.
   *
   * This value is optional if the product has a default path, and required if the product has more than one path. To list the paths for a product, use [ListLaunchPaths](https://docs.aws.amazon.com/servicecatalog/latest/dg/API_ListLaunchPaths.html) .
   *
   * > You must provide the name or ID, but not both.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-pathname
   */
  readonly pathName?: string;

  /**
   * The product identifier.
   *
   * > You must specify either the ID or the name of the product, but not both.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-productid
   */
  readonly productId?: string;

  /**
   * The name of the Service Catalog product.
   *
   * Each time a stack is created or updated, if `ProductName` is provided it will successfully resolve to `ProductId` as long as only one product exists in the account or Region with that `ProductName` .
   *
   * > You must specify either the name or the ID of the product, but not both.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-productname
   */
  readonly productName?: string;

  /**
   * A user-friendly name for the provisioned product.
   *
   * This value must be unique for the AWS account and cannot be updated after the product is provisioned.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisionedproductname
   */
  readonly provisionedProductName?: string;

  /**
   * The identifier of the provisioning artifact (also known as a version).
   *
   * > You must specify either the ID or the name of the provisioning artifact, but not both.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisioningartifactid
   */
  readonly provisioningArtifactId?: string;

  /**
   * The name of the provisioning artifact (also known as a version) for the product.
   *
   * This name must be unique for the product.
   *
   * > You must specify either the name or the ID of the provisioning artifact, but not both. You must also specify either the name or the ID of the product, but not both.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisioningartifactname
   */
  readonly provisioningArtifactName?: string;

  /**
   * Parameters specified by the administrator that are required for provisioning the product.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisioningparameters
   */
  readonly provisioningParameters?: Array<cdk.IResolvable | CfnCloudFormationProvisionedProduct.ProvisioningParameterProperty> | cdk.IResolvable;

  /**
   * StackSet preferences that are required for provisioning the product or updating a provisioned product.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-provisioningpreferences
   */
  readonly provisioningPreferences?: cdk.IResolvable | CfnCloudFormationProvisionedProduct.ProvisioningPreferencesProperty;

  /**
   * One or more tags.
   *
   * > Requires the provisioned product to have an [ResourceUpdateConstraint](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-resourceupdateconstraint.html) resource with `TagUpdatesOnProvisionedProduct` set to `ALLOWED` to allow tag updates. If `RESOURCE_UPDATE` constraint is not present, tags updates are ignored.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html#cfn-servicecatalog-cloudformationprovisionedproduct-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `ProvisioningParameterProperty`
 *
 * @param properties - the TypeScript properties of a `ProvisioningParameterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCloudFormationProvisionedProductProvisioningParameterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"ProvisioningParameterProperty\"");
}

// @ts-ignore TS6133
function convertCfnCloudFormationProvisionedProductProvisioningParameterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCloudFormationProvisionedProductProvisioningParameterPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnCloudFormationProvisionedProductProvisioningParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCloudFormationProvisionedProduct.ProvisioningParameterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCloudFormationProvisionedProduct.ProvisioningParameterProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ProvisioningPreferencesProperty`
 *
 * @param properties - the TypeScript properties of a `ProvisioningPreferencesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCloudFormationProvisionedProductProvisioningPreferencesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("stackSetAccounts", cdk.listValidator(cdk.validateString))(properties.stackSetAccounts));
  errors.collect(cdk.propertyValidator("stackSetFailureToleranceCount", cdk.validateNumber)(properties.stackSetFailureToleranceCount));
  errors.collect(cdk.propertyValidator("stackSetFailureTolerancePercentage", cdk.validateNumber)(properties.stackSetFailureTolerancePercentage));
  errors.collect(cdk.propertyValidator("stackSetMaxConcurrencyCount", cdk.validateNumber)(properties.stackSetMaxConcurrencyCount));
  errors.collect(cdk.propertyValidator("stackSetMaxConcurrencyPercentage", cdk.validateNumber)(properties.stackSetMaxConcurrencyPercentage));
  errors.collect(cdk.propertyValidator("stackSetOperationType", cdk.validateString)(properties.stackSetOperationType));
  errors.collect(cdk.propertyValidator("stackSetRegions", cdk.listValidator(cdk.validateString))(properties.stackSetRegions));
  return errors.wrap("supplied properties not correct for \"ProvisioningPreferencesProperty\"");
}

// @ts-ignore TS6133
function convertCfnCloudFormationProvisionedProductProvisioningPreferencesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCloudFormationProvisionedProductProvisioningPreferencesPropertyValidator(properties).assertSuccess();
  return {
    "StackSetAccounts": cdk.listMapper(cdk.stringToCloudFormation)(properties.stackSetAccounts),
    "StackSetFailureToleranceCount": cdk.numberToCloudFormation(properties.stackSetFailureToleranceCount),
    "StackSetFailureTolerancePercentage": cdk.numberToCloudFormation(properties.stackSetFailureTolerancePercentage),
    "StackSetMaxConcurrencyCount": cdk.numberToCloudFormation(properties.stackSetMaxConcurrencyCount),
    "StackSetMaxConcurrencyPercentage": cdk.numberToCloudFormation(properties.stackSetMaxConcurrencyPercentage),
    "StackSetOperationType": cdk.stringToCloudFormation(properties.stackSetOperationType),
    "StackSetRegions": cdk.listMapper(cdk.stringToCloudFormation)(properties.stackSetRegions)
  };
}

// @ts-ignore TS6133
function CfnCloudFormationProvisionedProductProvisioningPreferencesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCloudFormationProvisionedProduct.ProvisioningPreferencesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCloudFormationProvisionedProduct.ProvisioningPreferencesProperty>();
  ret.addPropertyResult("stackSetAccounts", "StackSetAccounts", (properties.StackSetAccounts != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.StackSetAccounts) : undefined));
  ret.addPropertyResult("stackSetFailureToleranceCount", "StackSetFailureToleranceCount", (properties.StackSetFailureToleranceCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.StackSetFailureToleranceCount) : undefined));
  ret.addPropertyResult("stackSetFailureTolerancePercentage", "StackSetFailureTolerancePercentage", (properties.StackSetFailureTolerancePercentage != null ? cfn_parse.FromCloudFormation.getNumber(properties.StackSetFailureTolerancePercentage) : undefined));
  ret.addPropertyResult("stackSetMaxConcurrencyCount", "StackSetMaxConcurrencyCount", (properties.StackSetMaxConcurrencyCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.StackSetMaxConcurrencyCount) : undefined));
  ret.addPropertyResult("stackSetMaxConcurrencyPercentage", "StackSetMaxConcurrencyPercentage", (properties.StackSetMaxConcurrencyPercentage != null ? cfn_parse.FromCloudFormation.getNumber(properties.StackSetMaxConcurrencyPercentage) : undefined));
  ret.addPropertyResult("stackSetOperationType", "StackSetOperationType", (properties.StackSetOperationType != null ? cfn_parse.FromCloudFormation.getString(properties.StackSetOperationType) : undefined));
  ret.addPropertyResult("stackSetRegions", "StackSetRegions", (properties.StackSetRegions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.StackSetRegions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnCloudFormationProvisionedProductProps`
 *
 * @param properties - the TypeScript properties of a `CfnCloudFormationProvisionedProductProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCloudFormationProvisionedProductPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("acceptLanguage", cdk.validateString)(properties.acceptLanguage));
  errors.collect(cdk.propertyValidator("notificationArns", cdk.listValidator(cdk.validateString))(properties.notificationArns));
  errors.collect(cdk.propertyValidator("pathId", cdk.validateString)(properties.pathId));
  errors.collect(cdk.propertyValidator("pathName", cdk.validateString)(properties.pathName));
  errors.collect(cdk.propertyValidator("productId", cdk.validateString)(properties.productId));
  errors.collect(cdk.propertyValidator("productName", cdk.validateString)(properties.productName));
  errors.collect(cdk.propertyValidator("provisionedProductName", cdk.validateString)(properties.provisionedProductName));
  errors.collect(cdk.propertyValidator("provisioningArtifactId", cdk.validateString)(properties.provisioningArtifactId));
  errors.collect(cdk.propertyValidator("provisioningArtifactName", cdk.validateString)(properties.provisioningArtifactName));
  errors.collect(cdk.propertyValidator("provisioningParameters", cdk.listValidator(CfnCloudFormationProvisionedProductProvisioningParameterPropertyValidator))(properties.provisioningParameters));
  errors.collect(cdk.propertyValidator("provisioningPreferences", CfnCloudFormationProvisionedProductProvisioningPreferencesPropertyValidator)(properties.provisioningPreferences));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnCloudFormationProvisionedProductProps\"");
}

// @ts-ignore TS6133
function convertCfnCloudFormationProvisionedProductPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCloudFormationProvisionedProductPropsValidator(properties).assertSuccess();
  return {
    "AcceptLanguage": cdk.stringToCloudFormation(properties.acceptLanguage),
    "NotificationArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.notificationArns),
    "PathId": cdk.stringToCloudFormation(properties.pathId),
    "PathName": cdk.stringToCloudFormation(properties.pathName),
    "ProductId": cdk.stringToCloudFormation(properties.productId),
    "ProductName": cdk.stringToCloudFormation(properties.productName),
    "ProvisionedProductName": cdk.stringToCloudFormation(properties.provisionedProductName),
    "ProvisioningArtifactId": cdk.stringToCloudFormation(properties.provisioningArtifactId),
    "ProvisioningArtifactName": cdk.stringToCloudFormation(properties.provisioningArtifactName),
    "ProvisioningParameters": cdk.listMapper(convertCfnCloudFormationProvisionedProductProvisioningParameterPropertyToCloudFormation)(properties.provisioningParameters),
    "ProvisioningPreferences": convertCfnCloudFormationProvisionedProductProvisioningPreferencesPropertyToCloudFormation(properties.provisioningPreferences),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnCloudFormationProvisionedProductPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCloudFormationProvisionedProductProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCloudFormationProvisionedProductProps>();
  ret.addPropertyResult("acceptLanguage", "AcceptLanguage", (properties.AcceptLanguage != null ? cfn_parse.FromCloudFormation.getString(properties.AcceptLanguage) : undefined));
  ret.addPropertyResult("notificationArns", "NotificationArns", (properties.NotificationArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.NotificationArns) : undefined));
  ret.addPropertyResult("pathId", "PathId", (properties.PathId != null ? cfn_parse.FromCloudFormation.getString(properties.PathId) : undefined));
  ret.addPropertyResult("pathName", "PathName", (properties.PathName != null ? cfn_parse.FromCloudFormation.getString(properties.PathName) : undefined));
  ret.addPropertyResult("productId", "ProductId", (properties.ProductId != null ? cfn_parse.FromCloudFormation.getString(properties.ProductId) : undefined));
  ret.addPropertyResult("productName", "ProductName", (properties.ProductName != null ? cfn_parse.FromCloudFormation.getString(properties.ProductName) : undefined));
  ret.addPropertyResult("provisionedProductName", "ProvisionedProductName", (properties.ProvisionedProductName != null ? cfn_parse.FromCloudFormation.getString(properties.ProvisionedProductName) : undefined));
  ret.addPropertyResult("provisioningArtifactId", "ProvisioningArtifactId", (properties.ProvisioningArtifactId != null ? cfn_parse.FromCloudFormation.getString(properties.ProvisioningArtifactId) : undefined));
  ret.addPropertyResult("provisioningArtifactName", "ProvisioningArtifactName", (properties.ProvisioningArtifactName != null ? cfn_parse.FromCloudFormation.getString(properties.ProvisioningArtifactName) : undefined));
  ret.addPropertyResult("provisioningParameters", "ProvisioningParameters", (properties.ProvisioningParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnCloudFormationProvisionedProductProvisioningParameterPropertyFromCloudFormation)(properties.ProvisioningParameters) : undefined));
  ret.addPropertyResult("provisioningPreferences", "ProvisioningPreferences", (properties.ProvisioningPreferences != null ? CfnCloudFormationProvisionedProductProvisioningPreferencesPropertyFromCloudFormation(properties.ProvisioningPreferences) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a notification constraint.
 *
 * @cloudformationResource AWS::ServiceCatalog::LaunchNotificationConstraint
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchnotificationconstraint.html
 */
export class CfnLaunchNotificationConstraint extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ServiceCatalog::LaunchNotificationConstraint";

  /**
   * Build a CfnLaunchNotificationConstraint from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLaunchNotificationConstraint {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLaunchNotificationConstraintPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLaunchNotificationConstraint(scope, id, propsResult.value);
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
   * The language code.
   */
  public acceptLanguage?: string;

  /**
   * The description of the constraint.
   */
  public description?: string;

  /**
   * The notification ARNs.
   */
  public notificationArns: Array<string>;

  /**
   * The portfolio identifier.
   */
  public portfolioId: string;

  /**
   * The product identifier.
   */
  public productId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLaunchNotificationConstraintProps) {
    super(scope, id, {
      "type": CfnLaunchNotificationConstraint.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "notificationArns", this);
    cdk.requireProperty(props, "portfolioId", this);
    cdk.requireProperty(props, "productId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.acceptLanguage = props.acceptLanguage;
    this.description = props.description;
    this.notificationArns = props.notificationArns;
    this.portfolioId = props.portfolioId;
    this.productId = props.productId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "acceptLanguage": this.acceptLanguage,
      "description": this.description,
      "notificationArns": this.notificationArns,
      "portfolioId": this.portfolioId,
      "productId": this.productId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLaunchNotificationConstraint.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLaunchNotificationConstraintPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnLaunchNotificationConstraint`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchnotificationconstraint.html
 */
export interface CfnLaunchNotificationConstraintProps {
  /**
   * The language code.
   *
   * - `jp` - Japanese
   * - `zh` - Chinese
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchnotificationconstraint.html#cfn-servicecatalog-launchnotificationconstraint-acceptlanguage
   */
  readonly acceptLanguage?: string;

  /**
   * The description of the constraint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchnotificationconstraint.html#cfn-servicecatalog-launchnotificationconstraint-description
   */
  readonly description?: string;

  /**
   * The notification ARNs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchnotificationconstraint.html#cfn-servicecatalog-launchnotificationconstraint-notificationarns
   */
  readonly notificationArns: Array<string>;

  /**
   * The portfolio identifier.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchnotificationconstraint.html#cfn-servicecatalog-launchnotificationconstraint-portfolioid
   */
  readonly portfolioId: string;

  /**
   * The product identifier.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchnotificationconstraint.html#cfn-servicecatalog-launchnotificationconstraint-productid
   */
  readonly productId: string;
}

/**
 * Determine whether the given properties match those of a `CfnLaunchNotificationConstraintProps`
 *
 * @param properties - the TypeScript properties of a `CfnLaunchNotificationConstraintProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLaunchNotificationConstraintPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("acceptLanguage", cdk.validateString)(properties.acceptLanguage));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("notificationArns", cdk.requiredValidator)(properties.notificationArns));
  errors.collect(cdk.propertyValidator("notificationArns", cdk.listValidator(cdk.validateString))(properties.notificationArns));
  errors.collect(cdk.propertyValidator("portfolioId", cdk.requiredValidator)(properties.portfolioId));
  errors.collect(cdk.propertyValidator("portfolioId", cdk.validateString)(properties.portfolioId));
  errors.collect(cdk.propertyValidator("productId", cdk.requiredValidator)(properties.productId));
  errors.collect(cdk.propertyValidator("productId", cdk.validateString)(properties.productId));
  return errors.wrap("supplied properties not correct for \"CfnLaunchNotificationConstraintProps\"");
}

// @ts-ignore TS6133
function convertCfnLaunchNotificationConstraintPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLaunchNotificationConstraintPropsValidator(properties).assertSuccess();
  return {
    "AcceptLanguage": cdk.stringToCloudFormation(properties.acceptLanguage),
    "Description": cdk.stringToCloudFormation(properties.description),
    "NotificationArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.notificationArns),
    "PortfolioId": cdk.stringToCloudFormation(properties.portfolioId),
    "ProductId": cdk.stringToCloudFormation(properties.productId)
  };
}

// @ts-ignore TS6133
function CfnLaunchNotificationConstraintPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLaunchNotificationConstraintProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLaunchNotificationConstraintProps>();
  ret.addPropertyResult("acceptLanguage", "AcceptLanguage", (properties.AcceptLanguage != null ? cfn_parse.FromCloudFormation.getString(properties.AcceptLanguage) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("notificationArns", "NotificationArns", (properties.NotificationArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.NotificationArns) : undefined));
  ret.addPropertyResult("portfolioId", "PortfolioId", (properties.PortfolioId != null ? cfn_parse.FromCloudFormation.getString(properties.PortfolioId) : undefined));
  ret.addPropertyResult("productId", "ProductId", (properties.ProductId != null ? cfn_parse.FromCloudFormation.getString(properties.ProductId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a launch constraint.
 *
 * @cloudformationResource AWS::ServiceCatalog::LaunchRoleConstraint
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchroleconstraint.html
 */
export class CfnLaunchRoleConstraint extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ServiceCatalog::LaunchRoleConstraint";

  /**
   * Build a CfnLaunchRoleConstraint from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLaunchRoleConstraint {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLaunchRoleConstraintPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLaunchRoleConstraint(scope, id, propsResult.value);
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
   * The language code.
   */
  public acceptLanguage?: string;

  /**
   * The description of the constraint.
   */
  public description?: string;

  /**
   * You are required to specify either the `RoleArn` or the `LocalRoleName` but can't use both.
   */
  public localRoleName?: string;

  /**
   * The portfolio identifier.
   */
  public portfolioId: string;

  /**
   * The product identifier.
   */
  public productId: string;

  /**
   * The ARN of the launch role.
   */
  public roleArn?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLaunchRoleConstraintProps) {
    super(scope, id, {
      "type": CfnLaunchRoleConstraint.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "portfolioId", this);
    cdk.requireProperty(props, "productId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.acceptLanguage = props.acceptLanguage;
    this.description = props.description;
    this.localRoleName = props.localRoleName;
    this.portfolioId = props.portfolioId;
    this.productId = props.productId;
    this.roleArn = props.roleArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "acceptLanguage": this.acceptLanguage,
      "description": this.description,
      "localRoleName": this.localRoleName,
      "portfolioId": this.portfolioId,
      "productId": this.productId,
      "roleArn": this.roleArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLaunchRoleConstraint.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLaunchRoleConstraintPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnLaunchRoleConstraint`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchroleconstraint.html
 */
export interface CfnLaunchRoleConstraintProps {
  /**
   * The language code.
   *
   * - `jp` - Japanese
   * - `zh` - Chinese
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchroleconstraint.html#cfn-servicecatalog-launchroleconstraint-acceptlanguage
   */
  readonly acceptLanguage?: string;

  /**
   * The description of the constraint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchroleconstraint.html#cfn-servicecatalog-launchroleconstraint-description
   */
  readonly description?: string;

  /**
   * You are required to specify either the `RoleArn` or the `LocalRoleName` but can't use both.
   *
   * If you specify the `LocalRoleName` property, when an account uses the launch constraint, the IAM role with that name in the account will be used. This allows launch-role constraints to be account-agnostic so the administrator can create fewer resources per shared account.
   *
   * The given role name must exist in the account used to create the launch constraint and the account of the user who launches a product with this launch constraint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchroleconstraint.html#cfn-servicecatalog-launchroleconstraint-localrolename
   */
  readonly localRoleName?: string;

  /**
   * The portfolio identifier.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchroleconstraint.html#cfn-servicecatalog-launchroleconstraint-portfolioid
   */
  readonly portfolioId: string;

  /**
   * The product identifier.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchroleconstraint.html#cfn-servicecatalog-launchroleconstraint-productid
   */
  readonly productId: string;

  /**
   * The ARN of the launch role.
   *
   * You are required to specify `RoleArn` or `LocalRoleName` but can't use both.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchroleconstraint.html#cfn-servicecatalog-launchroleconstraint-rolearn
   */
  readonly roleArn?: string;
}

/**
 * Determine whether the given properties match those of a `CfnLaunchRoleConstraintProps`
 *
 * @param properties - the TypeScript properties of a `CfnLaunchRoleConstraintProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLaunchRoleConstraintPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("acceptLanguage", cdk.validateString)(properties.acceptLanguage));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("localRoleName", cdk.validateString)(properties.localRoleName));
  errors.collect(cdk.propertyValidator("portfolioId", cdk.requiredValidator)(properties.portfolioId));
  errors.collect(cdk.propertyValidator("portfolioId", cdk.validateString)(properties.portfolioId));
  errors.collect(cdk.propertyValidator("productId", cdk.requiredValidator)(properties.productId));
  errors.collect(cdk.propertyValidator("productId", cdk.validateString)(properties.productId));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"CfnLaunchRoleConstraintProps\"");
}

// @ts-ignore TS6133
function convertCfnLaunchRoleConstraintPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLaunchRoleConstraintPropsValidator(properties).assertSuccess();
  return {
    "AcceptLanguage": cdk.stringToCloudFormation(properties.acceptLanguage),
    "Description": cdk.stringToCloudFormation(properties.description),
    "LocalRoleName": cdk.stringToCloudFormation(properties.localRoleName),
    "PortfolioId": cdk.stringToCloudFormation(properties.portfolioId),
    "ProductId": cdk.stringToCloudFormation(properties.productId),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnLaunchRoleConstraintPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLaunchRoleConstraintProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLaunchRoleConstraintProps>();
  ret.addPropertyResult("acceptLanguage", "AcceptLanguage", (properties.AcceptLanguage != null ? cfn_parse.FromCloudFormation.getString(properties.AcceptLanguage) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("localRoleName", "LocalRoleName", (properties.LocalRoleName != null ? cfn_parse.FromCloudFormation.getString(properties.LocalRoleName) : undefined));
  ret.addPropertyResult("portfolioId", "PortfolioId", (properties.PortfolioId != null ? cfn_parse.FromCloudFormation.getString(properties.PortfolioId) : undefined));
  ret.addPropertyResult("productId", "ProductId", (properties.ProductId != null ? cfn_parse.FromCloudFormation.getString(properties.ProductId) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a template constraint.
 *
 * @cloudformationResource AWS::ServiceCatalog::LaunchTemplateConstraint
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchtemplateconstraint.html
 */
export class CfnLaunchTemplateConstraint extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ServiceCatalog::LaunchTemplateConstraint";

  /**
   * Build a CfnLaunchTemplateConstraint from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLaunchTemplateConstraint {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLaunchTemplateConstraintPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLaunchTemplateConstraint(scope, id, propsResult.value);
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
   * The language code.
   */
  public acceptLanguage?: string;

  /**
   * The description of the constraint.
   */
  public description?: string;

  /**
   * The portfolio identifier.
   */
  public portfolioId: string;

  /**
   * The product identifier.
   */
  public productId: string;

  /**
   * The constraint rules.
   */
  public rules: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLaunchTemplateConstraintProps) {
    super(scope, id, {
      "type": CfnLaunchTemplateConstraint.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "portfolioId", this);
    cdk.requireProperty(props, "productId", this);
    cdk.requireProperty(props, "rules", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.acceptLanguage = props.acceptLanguage;
    this.description = props.description;
    this.portfolioId = props.portfolioId;
    this.productId = props.productId;
    this.rules = props.rules;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "acceptLanguage": this.acceptLanguage,
      "description": this.description,
      "portfolioId": this.portfolioId,
      "productId": this.productId,
      "rules": this.rules
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLaunchTemplateConstraint.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLaunchTemplateConstraintPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnLaunchTemplateConstraint`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchtemplateconstraint.html
 */
export interface CfnLaunchTemplateConstraintProps {
  /**
   * The language code.
   *
   * - `jp` - Japanese
   * - `zh` - Chinese
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchtemplateconstraint.html#cfn-servicecatalog-launchtemplateconstraint-acceptlanguage
   */
  readonly acceptLanguage?: string;

  /**
   * The description of the constraint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchtemplateconstraint.html#cfn-servicecatalog-launchtemplateconstraint-description
   */
  readonly description?: string;

  /**
   * The portfolio identifier.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchtemplateconstraint.html#cfn-servicecatalog-launchtemplateconstraint-portfolioid
   */
  readonly portfolioId: string;

  /**
   * The product identifier.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchtemplateconstraint.html#cfn-servicecatalog-launchtemplateconstraint-productid
   */
  readonly productId: string;

  /**
   * The constraint rules.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-launchtemplateconstraint.html#cfn-servicecatalog-launchtemplateconstraint-rules
   */
  readonly rules: string;
}

/**
 * Determine whether the given properties match those of a `CfnLaunchTemplateConstraintProps`
 *
 * @param properties - the TypeScript properties of a `CfnLaunchTemplateConstraintProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLaunchTemplateConstraintPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("acceptLanguage", cdk.validateString)(properties.acceptLanguage));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("portfolioId", cdk.requiredValidator)(properties.portfolioId));
  errors.collect(cdk.propertyValidator("portfolioId", cdk.validateString)(properties.portfolioId));
  errors.collect(cdk.propertyValidator("productId", cdk.requiredValidator)(properties.productId));
  errors.collect(cdk.propertyValidator("productId", cdk.validateString)(properties.productId));
  errors.collect(cdk.propertyValidator("rules", cdk.requiredValidator)(properties.rules));
  errors.collect(cdk.propertyValidator("rules", cdk.validateString)(properties.rules));
  return errors.wrap("supplied properties not correct for \"CfnLaunchTemplateConstraintProps\"");
}

// @ts-ignore TS6133
function convertCfnLaunchTemplateConstraintPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLaunchTemplateConstraintPropsValidator(properties).assertSuccess();
  return {
    "AcceptLanguage": cdk.stringToCloudFormation(properties.acceptLanguage),
    "Description": cdk.stringToCloudFormation(properties.description),
    "PortfolioId": cdk.stringToCloudFormation(properties.portfolioId),
    "ProductId": cdk.stringToCloudFormation(properties.productId),
    "Rules": cdk.stringToCloudFormation(properties.rules)
  };
}

// @ts-ignore TS6133
function CfnLaunchTemplateConstraintPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLaunchTemplateConstraintProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLaunchTemplateConstraintProps>();
  ret.addPropertyResult("acceptLanguage", "AcceptLanguage", (properties.AcceptLanguage != null ? cfn_parse.FromCloudFormation.getString(properties.AcceptLanguage) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("portfolioId", "PortfolioId", (properties.PortfolioId != null ? cfn_parse.FromCloudFormation.getString(properties.PortfolioId) : undefined));
  ret.addPropertyResult("productId", "ProductId", (properties.ProductId != null ? cfn_parse.FromCloudFormation.getString(properties.ProductId) : undefined));
  ret.addPropertyResult("rules", "Rules", (properties.Rules != null ? cfn_parse.FromCloudFormation.getString(properties.Rules) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a portfolio.
 *
 * @cloudformationResource AWS::ServiceCatalog::Portfolio
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolio.html
 */
export class CfnPortfolio extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ServiceCatalog::Portfolio";

  /**
   * Build a CfnPortfolio from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPortfolio {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPortfolioPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPortfolio(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The portfolio identifier.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The name of the portfolio.
   *
   * @cloudformationAttribute PortfolioName
   */
  public readonly attrPortfolioName: string;

  /**
   * The language code.
   */
  public acceptLanguage?: string;

  /**
   * The description of the portfolio.
   */
  public description?: string;

  /**
   * The name to use for display purposes.
   */
  public displayName: string;

  /**
   * The name of the portfolio provider.
   */
  public providerName: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * One or more tags.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPortfolioProps) {
    super(scope, id, {
      "type": CfnPortfolio.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "displayName", this);
    cdk.requireProperty(props, "providerName", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrPortfolioName = cdk.Token.asString(this.getAtt("PortfolioName", cdk.ResolutionTypeHint.STRING));
    this.acceptLanguage = props.acceptLanguage;
    this.description = props.description;
    this.displayName = props.displayName;
    this.providerName = props.providerName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ServiceCatalog::Portfolio", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "acceptLanguage": this.acceptLanguage,
      "description": this.description,
      "displayName": this.displayName,
      "providerName": this.providerName,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPortfolio.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPortfolioPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnPortfolio`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolio.html
 */
export interface CfnPortfolioProps {
  /**
   * The language code.
   *
   * - `jp` - Japanese
   * - `zh` - Chinese
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolio.html#cfn-servicecatalog-portfolio-acceptlanguage
   */
  readonly acceptLanguage?: string;

  /**
   * The description of the portfolio.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolio.html#cfn-servicecatalog-portfolio-description
   */
  readonly description?: string;

  /**
   * The name to use for display purposes.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolio.html#cfn-servicecatalog-portfolio-displayname
   */
  readonly displayName: string;

  /**
   * The name of the portfolio provider.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolio.html#cfn-servicecatalog-portfolio-providername
   */
  readonly providerName: string;

  /**
   * One or more tags.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolio.html#cfn-servicecatalog-portfolio-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnPortfolioProps`
 *
 * @param properties - the TypeScript properties of a `CfnPortfolioProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPortfolioPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("acceptLanguage", cdk.validateString)(properties.acceptLanguage));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("displayName", cdk.requiredValidator)(properties.displayName));
  errors.collect(cdk.propertyValidator("displayName", cdk.validateString)(properties.displayName));
  errors.collect(cdk.propertyValidator("providerName", cdk.requiredValidator)(properties.providerName));
  errors.collect(cdk.propertyValidator("providerName", cdk.validateString)(properties.providerName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnPortfolioProps\"");
}

// @ts-ignore TS6133
function convertCfnPortfolioPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPortfolioPropsValidator(properties).assertSuccess();
  return {
    "AcceptLanguage": cdk.stringToCloudFormation(properties.acceptLanguage),
    "Description": cdk.stringToCloudFormation(properties.description),
    "DisplayName": cdk.stringToCloudFormation(properties.displayName),
    "ProviderName": cdk.stringToCloudFormation(properties.providerName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnPortfolioPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPortfolioProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPortfolioProps>();
  ret.addPropertyResult("acceptLanguage", "AcceptLanguage", (properties.AcceptLanguage != null ? cfn_parse.FromCloudFormation.getString(properties.AcceptLanguage) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("displayName", "DisplayName", (properties.DisplayName != null ? cfn_parse.FromCloudFormation.getString(properties.DisplayName) : undefined));
  ret.addPropertyResult("providerName", "ProviderName", (properties.ProviderName != null ? cfn_parse.FromCloudFormation.getString(properties.ProviderName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Associates the specified principal ARN with the specified portfolio.
 *
 * @cloudformationResource AWS::ServiceCatalog::PortfolioPrincipalAssociation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioprincipalassociation.html
 */
export class CfnPortfolioPrincipalAssociation extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ServiceCatalog::PortfolioPrincipalAssociation";

  /**
   * Build a CfnPortfolioPrincipalAssociation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPortfolioPrincipalAssociation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPortfolioPrincipalAssociationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPortfolioPrincipalAssociation(scope, id, propsResult.value);
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
   * The language code.
   */
  public acceptLanguage?: string;

  /**
   * The portfolio identifier.
   */
  public portfolioId: string;

  /**
   * The ARN of the principal ( IAM user, role, or group).
   */
  public principalArn: string;

  /**
   * The principal type.
   */
  public principalType: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPortfolioPrincipalAssociationProps) {
    super(scope, id, {
      "type": CfnPortfolioPrincipalAssociation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "portfolioId", this);
    cdk.requireProperty(props, "principalArn", this);
    cdk.requireProperty(props, "principalType", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.acceptLanguage = props.acceptLanguage;
    this.portfolioId = props.portfolioId;
    this.principalArn = props.principalArn;
    this.principalType = props.principalType;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "acceptLanguage": this.acceptLanguage,
      "portfolioId": this.portfolioId,
      "principalArn": this.principalArn,
      "principalType": this.principalType
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPortfolioPrincipalAssociation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPortfolioPrincipalAssociationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnPortfolioPrincipalAssociation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioprincipalassociation.html
 */
export interface CfnPortfolioPrincipalAssociationProps {
  /**
   * The language code.
   *
   * - `jp` - Japanese
   * - `zh` - Chinese
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioprincipalassociation.html#cfn-servicecatalog-portfolioprincipalassociation-acceptlanguage
   */
  readonly acceptLanguage?: string;

  /**
   * The portfolio identifier.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioprincipalassociation.html#cfn-servicecatalog-portfolioprincipalassociation-portfolioid
   */
  readonly portfolioId: string;

  /**
   * The ARN of the principal ( IAM user, role, or group).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioprincipalassociation.html#cfn-servicecatalog-portfolioprincipalassociation-principalarn
   */
  readonly principalArn: string;

  /**
   * The principal type.
   *
   * The supported values are `IAM` and `IAM_PATTERN` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioprincipalassociation.html#cfn-servicecatalog-portfolioprincipalassociation-principaltype
   */
  readonly principalType: string;
}

/**
 * Determine whether the given properties match those of a `CfnPortfolioPrincipalAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnPortfolioPrincipalAssociationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPortfolioPrincipalAssociationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("acceptLanguage", cdk.validateString)(properties.acceptLanguage));
  errors.collect(cdk.propertyValidator("portfolioId", cdk.requiredValidator)(properties.portfolioId));
  errors.collect(cdk.propertyValidator("portfolioId", cdk.validateString)(properties.portfolioId));
  errors.collect(cdk.propertyValidator("principalArn", cdk.requiredValidator)(properties.principalArn));
  errors.collect(cdk.propertyValidator("principalArn", cdk.validateString)(properties.principalArn));
  errors.collect(cdk.propertyValidator("principalType", cdk.requiredValidator)(properties.principalType));
  errors.collect(cdk.propertyValidator("principalType", cdk.validateString)(properties.principalType));
  return errors.wrap("supplied properties not correct for \"CfnPortfolioPrincipalAssociationProps\"");
}

// @ts-ignore TS6133
function convertCfnPortfolioPrincipalAssociationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPortfolioPrincipalAssociationPropsValidator(properties).assertSuccess();
  return {
    "AcceptLanguage": cdk.stringToCloudFormation(properties.acceptLanguage),
    "PortfolioId": cdk.stringToCloudFormation(properties.portfolioId),
    "PrincipalARN": cdk.stringToCloudFormation(properties.principalArn),
    "PrincipalType": cdk.stringToCloudFormation(properties.principalType)
  };
}

// @ts-ignore TS6133
function CfnPortfolioPrincipalAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPortfolioPrincipalAssociationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPortfolioPrincipalAssociationProps>();
  ret.addPropertyResult("acceptLanguage", "AcceptLanguage", (properties.AcceptLanguage != null ? cfn_parse.FromCloudFormation.getString(properties.AcceptLanguage) : undefined));
  ret.addPropertyResult("portfolioId", "PortfolioId", (properties.PortfolioId != null ? cfn_parse.FromCloudFormation.getString(properties.PortfolioId) : undefined));
  ret.addPropertyResult("principalArn", "PrincipalARN", (properties.PrincipalARN != null ? cfn_parse.FromCloudFormation.getString(properties.PrincipalARN) : undefined));
  ret.addPropertyResult("principalType", "PrincipalType", (properties.PrincipalType != null ? cfn_parse.FromCloudFormation.getString(properties.PrincipalType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Associates the specified product with the specified portfolio.
 *
 * A delegated admin is authorized to invoke this command.
 *
 * @cloudformationResource AWS::ServiceCatalog::PortfolioProductAssociation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioproductassociation.html
 */
export class CfnPortfolioProductAssociation extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ServiceCatalog::PortfolioProductAssociation";

  /**
   * Build a CfnPortfolioProductAssociation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPortfolioProductAssociation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPortfolioProductAssociationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPortfolioProductAssociation(scope, id, propsResult.value);
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
   * The language code.
   */
  public acceptLanguage?: string;

  /**
   * The portfolio identifier.
   */
  public portfolioId: string;

  /**
   * The product identifier.
   */
  public productId: string;

  /**
   * The identifier of the source portfolio.
   */
  public sourcePortfolioId?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPortfolioProductAssociationProps) {
    super(scope, id, {
      "type": CfnPortfolioProductAssociation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "portfolioId", this);
    cdk.requireProperty(props, "productId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.acceptLanguage = props.acceptLanguage;
    this.portfolioId = props.portfolioId;
    this.productId = props.productId;
    this.sourcePortfolioId = props.sourcePortfolioId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "acceptLanguage": this.acceptLanguage,
      "portfolioId": this.portfolioId,
      "productId": this.productId,
      "sourcePortfolioId": this.sourcePortfolioId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPortfolioProductAssociation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPortfolioProductAssociationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnPortfolioProductAssociation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioproductassociation.html
 */
export interface CfnPortfolioProductAssociationProps {
  /**
   * The language code.
   *
   * - `jp` - Japanese
   * - `zh` - Chinese
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioproductassociation.html#cfn-servicecatalog-portfolioproductassociation-acceptlanguage
   */
  readonly acceptLanguage?: string;

  /**
   * The portfolio identifier.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioproductassociation.html#cfn-servicecatalog-portfolioproductassociation-portfolioid
   */
  readonly portfolioId: string;

  /**
   * The product identifier.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioproductassociation.html#cfn-servicecatalog-portfolioproductassociation-productid
   */
  readonly productId: string;

  /**
   * The identifier of the source portfolio.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioproductassociation.html#cfn-servicecatalog-portfolioproductassociation-sourceportfolioid
   */
  readonly sourcePortfolioId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnPortfolioProductAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnPortfolioProductAssociationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPortfolioProductAssociationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("acceptLanguage", cdk.validateString)(properties.acceptLanguage));
  errors.collect(cdk.propertyValidator("portfolioId", cdk.requiredValidator)(properties.portfolioId));
  errors.collect(cdk.propertyValidator("portfolioId", cdk.validateString)(properties.portfolioId));
  errors.collect(cdk.propertyValidator("productId", cdk.requiredValidator)(properties.productId));
  errors.collect(cdk.propertyValidator("productId", cdk.validateString)(properties.productId));
  errors.collect(cdk.propertyValidator("sourcePortfolioId", cdk.validateString)(properties.sourcePortfolioId));
  return errors.wrap("supplied properties not correct for \"CfnPortfolioProductAssociationProps\"");
}

// @ts-ignore TS6133
function convertCfnPortfolioProductAssociationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPortfolioProductAssociationPropsValidator(properties).assertSuccess();
  return {
    "AcceptLanguage": cdk.stringToCloudFormation(properties.acceptLanguage),
    "PortfolioId": cdk.stringToCloudFormation(properties.portfolioId),
    "ProductId": cdk.stringToCloudFormation(properties.productId),
    "SourcePortfolioId": cdk.stringToCloudFormation(properties.sourcePortfolioId)
  };
}

// @ts-ignore TS6133
function CfnPortfolioProductAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPortfolioProductAssociationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPortfolioProductAssociationProps>();
  ret.addPropertyResult("acceptLanguage", "AcceptLanguage", (properties.AcceptLanguage != null ? cfn_parse.FromCloudFormation.getString(properties.AcceptLanguage) : undefined));
  ret.addPropertyResult("portfolioId", "PortfolioId", (properties.PortfolioId != null ? cfn_parse.FromCloudFormation.getString(properties.PortfolioId) : undefined));
  ret.addPropertyResult("productId", "ProductId", (properties.ProductId != null ? cfn_parse.FromCloudFormation.getString(properties.ProductId) : undefined));
  ret.addPropertyResult("sourcePortfolioId", "SourcePortfolioId", (properties.SourcePortfolioId != null ? cfn_parse.FromCloudFormation.getString(properties.SourcePortfolioId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Shares the specified portfolio with the specified account.
 *
 * @cloudformationResource AWS::ServiceCatalog::PortfolioShare
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioshare.html
 */
export class CfnPortfolioShare extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ServiceCatalog::PortfolioShare";

  /**
   * Build a CfnPortfolioShare from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPortfolioShare {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPortfolioSharePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPortfolioShare(scope, id, propsResult.value);
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
   * The language code.
   */
  public acceptLanguage?: string;

  /**
   * The AWS account ID.
   */
  public accountId: string;

  /**
   * The portfolio identifier.
   */
  public portfolioId: string;

  /**
   * Indicates whether TagOptions sharing is enabled or disabled for the portfolio share.
   */
  public shareTagOptions?: boolean | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPortfolioShareProps) {
    super(scope, id, {
      "type": CfnPortfolioShare.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "accountId", this);
    cdk.requireProperty(props, "portfolioId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.acceptLanguage = props.acceptLanguage;
    this.accountId = props.accountId;
    this.portfolioId = props.portfolioId;
    this.shareTagOptions = props.shareTagOptions;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "acceptLanguage": this.acceptLanguage,
      "accountId": this.accountId,
      "portfolioId": this.portfolioId,
      "shareTagOptions": this.shareTagOptions
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPortfolioShare.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPortfolioSharePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnPortfolioShare`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioshare.html
 */
export interface CfnPortfolioShareProps {
  /**
   * The language code.
   *
   * - `jp` - Japanese
   * - `zh` - Chinese
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioshare.html#cfn-servicecatalog-portfolioshare-acceptlanguage
   */
  readonly acceptLanguage?: string;

  /**
   * The AWS account ID.
   *
   * For example, `123456789012` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioshare.html#cfn-servicecatalog-portfolioshare-accountid
   */
  readonly accountId: string;

  /**
   * The portfolio identifier.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioshare.html#cfn-servicecatalog-portfolioshare-portfolioid
   */
  readonly portfolioId: string;

  /**
   * Indicates whether TagOptions sharing is enabled or disabled for the portfolio share.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-portfolioshare.html#cfn-servicecatalog-portfolioshare-sharetagoptions
   */
  readonly shareTagOptions?: boolean | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnPortfolioShareProps`
 *
 * @param properties - the TypeScript properties of a `CfnPortfolioShareProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPortfolioSharePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("acceptLanguage", cdk.validateString)(properties.acceptLanguage));
  errors.collect(cdk.propertyValidator("accountId", cdk.requiredValidator)(properties.accountId));
  errors.collect(cdk.propertyValidator("accountId", cdk.validateString)(properties.accountId));
  errors.collect(cdk.propertyValidator("portfolioId", cdk.requiredValidator)(properties.portfolioId));
  errors.collect(cdk.propertyValidator("portfolioId", cdk.validateString)(properties.portfolioId));
  errors.collect(cdk.propertyValidator("shareTagOptions", cdk.validateBoolean)(properties.shareTagOptions));
  return errors.wrap("supplied properties not correct for \"CfnPortfolioShareProps\"");
}

// @ts-ignore TS6133
function convertCfnPortfolioSharePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPortfolioSharePropsValidator(properties).assertSuccess();
  return {
    "AcceptLanguage": cdk.stringToCloudFormation(properties.acceptLanguage),
    "AccountId": cdk.stringToCloudFormation(properties.accountId),
    "PortfolioId": cdk.stringToCloudFormation(properties.portfolioId),
    "ShareTagOptions": cdk.booleanToCloudFormation(properties.shareTagOptions)
  };
}

// @ts-ignore TS6133
function CfnPortfolioSharePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPortfolioShareProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPortfolioShareProps>();
  ret.addPropertyResult("acceptLanguage", "AcceptLanguage", (properties.AcceptLanguage != null ? cfn_parse.FromCloudFormation.getString(properties.AcceptLanguage) : undefined));
  ret.addPropertyResult("accountId", "AccountId", (properties.AccountId != null ? cfn_parse.FromCloudFormation.getString(properties.AccountId) : undefined));
  ret.addPropertyResult("portfolioId", "PortfolioId", (properties.PortfolioId != null ? cfn_parse.FromCloudFormation.getString(properties.PortfolioId) : undefined));
  ret.addPropertyResult("shareTagOptions", "ShareTagOptions", (properties.ShareTagOptions != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ShareTagOptions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a `RESOURCE_UPDATE` constraint.
 *
 * @cloudformationResource AWS::ServiceCatalog::ResourceUpdateConstraint
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-resourceupdateconstraint.html
 */
export class CfnResourceUpdateConstraint extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ServiceCatalog::ResourceUpdateConstraint";

  /**
   * Build a CfnResourceUpdateConstraint from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResourceUpdateConstraint {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnResourceUpdateConstraintPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnResourceUpdateConstraint(scope, id, propsResult.value);
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
   * The language code.
   */
  public acceptLanguage?: string;

  /**
   * The description of the constraint.
   */
  public description?: string;

  /**
   * The portfolio identifier.
   */
  public portfolioId: string;

  /**
   * The product identifier.
   */
  public productId: string;

  /**
   * If set to `ALLOWED` , lets users change tags in a [CloudFormationProvisionedProduct](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html) resource.
   */
  public tagUpdateOnProvisionedProduct: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnResourceUpdateConstraintProps) {
    super(scope, id, {
      "type": CfnResourceUpdateConstraint.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "portfolioId", this);
    cdk.requireProperty(props, "productId", this);
    cdk.requireProperty(props, "tagUpdateOnProvisionedProduct", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.acceptLanguage = props.acceptLanguage;
    this.description = props.description;
    this.portfolioId = props.portfolioId;
    this.productId = props.productId;
    this.tagUpdateOnProvisionedProduct = props.tagUpdateOnProvisionedProduct;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "acceptLanguage": this.acceptLanguage,
      "description": this.description,
      "portfolioId": this.portfolioId,
      "productId": this.productId,
      "tagUpdateOnProvisionedProduct": this.tagUpdateOnProvisionedProduct
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnResourceUpdateConstraint.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnResourceUpdateConstraintPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnResourceUpdateConstraint`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-resourceupdateconstraint.html
 */
export interface CfnResourceUpdateConstraintProps {
  /**
   * The language code.
   *
   * - `jp` - Japanese
   * - `zh` - Chinese
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-resourceupdateconstraint.html#cfn-servicecatalog-resourceupdateconstraint-acceptlanguage
   */
  readonly acceptLanguage?: string;

  /**
   * The description of the constraint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-resourceupdateconstraint.html#cfn-servicecatalog-resourceupdateconstraint-description
   */
  readonly description?: string;

  /**
   * The portfolio identifier.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-resourceupdateconstraint.html#cfn-servicecatalog-resourceupdateconstraint-portfolioid
   */
  readonly portfolioId: string;

  /**
   * The product identifier.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-resourceupdateconstraint.html#cfn-servicecatalog-resourceupdateconstraint-productid
   */
  readonly productId: string;

  /**
   * If set to `ALLOWED` , lets users change tags in a [CloudFormationProvisionedProduct](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html) resource.
   *
   * If set to `NOT_ALLOWED` , prevents users from changing tags in a [CloudFormationProvisionedProduct](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html) resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-resourceupdateconstraint.html#cfn-servicecatalog-resourceupdateconstraint-tagupdateonprovisionedproduct
   */
  readonly tagUpdateOnProvisionedProduct: string;
}

/**
 * Determine whether the given properties match those of a `CfnResourceUpdateConstraintProps`
 *
 * @param properties - the TypeScript properties of a `CfnResourceUpdateConstraintProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResourceUpdateConstraintPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("acceptLanguage", cdk.validateString)(properties.acceptLanguage));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("portfolioId", cdk.requiredValidator)(properties.portfolioId));
  errors.collect(cdk.propertyValidator("portfolioId", cdk.validateString)(properties.portfolioId));
  errors.collect(cdk.propertyValidator("productId", cdk.requiredValidator)(properties.productId));
  errors.collect(cdk.propertyValidator("productId", cdk.validateString)(properties.productId));
  errors.collect(cdk.propertyValidator("tagUpdateOnProvisionedProduct", cdk.requiredValidator)(properties.tagUpdateOnProvisionedProduct));
  errors.collect(cdk.propertyValidator("tagUpdateOnProvisionedProduct", cdk.validateString)(properties.tagUpdateOnProvisionedProduct));
  return errors.wrap("supplied properties not correct for \"CfnResourceUpdateConstraintProps\"");
}

// @ts-ignore TS6133
function convertCfnResourceUpdateConstraintPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResourceUpdateConstraintPropsValidator(properties).assertSuccess();
  return {
    "AcceptLanguage": cdk.stringToCloudFormation(properties.acceptLanguage),
    "Description": cdk.stringToCloudFormation(properties.description),
    "PortfolioId": cdk.stringToCloudFormation(properties.portfolioId),
    "ProductId": cdk.stringToCloudFormation(properties.productId),
    "TagUpdateOnProvisionedProduct": cdk.stringToCloudFormation(properties.tagUpdateOnProvisionedProduct)
  };
}

// @ts-ignore TS6133
function CfnResourceUpdateConstraintPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResourceUpdateConstraintProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResourceUpdateConstraintProps>();
  ret.addPropertyResult("acceptLanguage", "AcceptLanguage", (properties.AcceptLanguage != null ? cfn_parse.FromCloudFormation.getString(properties.AcceptLanguage) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("portfolioId", "PortfolioId", (properties.PortfolioId != null ? cfn_parse.FromCloudFormation.getString(properties.PortfolioId) : undefined));
  ret.addPropertyResult("productId", "ProductId", (properties.ProductId != null ? cfn_parse.FromCloudFormation.getString(properties.ProductId) : undefined));
  ret.addPropertyResult("tagUpdateOnProvisionedProduct", "TagUpdateOnProvisionedProduct", (properties.TagUpdateOnProvisionedProduct != null ? cfn_parse.FromCloudFormation.getString(properties.TagUpdateOnProvisionedProduct) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a self-service action.
 *
 * @cloudformationResource AWS::ServiceCatalog::ServiceAction
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-serviceaction.html
 */
export class CfnServiceAction extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ServiceCatalog::ServiceAction";

  /**
   * Build a CfnServiceAction from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnServiceAction {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnServiceActionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnServiceAction(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The self-service action identifier. For example, `act-fs7abcd89wxyz` .
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The language code.
   */
  public acceptLanguage?: string;

  /**
   * A map that defines the self-service action.
   */
  public definition: Array<CfnServiceAction.DefinitionParameterProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The self-service action definition type.
   */
  public definitionType: string;

  /**
   * The self-service action description.
   */
  public description?: string;

  /**
   * The self-service action name.
   */
  public name: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnServiceActionProps) {
    super(scope, id, {
      "type": CfnServiceAction.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "definition", this);
    cdk.requireProperty(props, "definitionType", this);
    cdk.requireProperty(props, "name", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.acceptLanguage = props.acceptLanguage;
    this.definition = props.definition;
    this.definitionType = props.definitionType;
    this.description = props.description;
    this.name = props.name;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "acceptLanguage": this.acceptLanguage,
      "definition": this.definition,
      "definitionType": this.definitionType,
      "description": this.description,
      "name": this.name
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnServiceAction.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnServiceActionPropsToCloudFormation(props);
  }
}

export namespace CfnServiceAction {
  /**
   * The list of parameters in JSON format.
   *
   * For example: `[{\"Name\":\"InstanceId\",\"Type\":\"TARGET\"}] or [{\"Name\":\"InstanceId\",\"Type\":\"TEXT_VALUE\"}]` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-serviceaction-definitionparameter.html
   */
  export interface DefinitionParameterProperty {
    /**
     * The parameter key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-serviceaction-definitionparameter.html#cfn-servicecatalog-serviceaction-definitionparameter-key
     */
    readonly key: string;

    /**
     * The value of the parameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicecatalog-serviceaction-definitionparameter.html#cfn-servicecatalog-serviceaction-definitionparameter-value
     */
    readonly value: string;
  }
}

/**
 * Properties for defining a `CfnServiceAction`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-serviceaction.html
 */
export interface CfnServiceActionProps {
  /**
   * The language code.
   *
   * - `en` - English (default)
   * - `jp` - Japanese
   * - `zh` - Chinese
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-serviceaction.html#cfn-servicecatalog-serviceaction-acceptlanguage
   */
  readonly acceptLanguage?: string;

  /**
   * A map that defines the self-service action.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-serviceaction.html#cfn-servicecatalog-serviceaction-definition
   */
  readonly definition: Array<CfnServiceAction.DefinitionParameterProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The self-service action definition type.
   *
   * For example, `SSM_AUTOMATION` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-serviceaction.html#cfn-servicecatalog-serviceaction-definitiontype
   */
  readonly definitionType: string;

  /**
   * The self-service action description.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-serviceaction.html#cfn-servicecatalog-serviceaction-description
   */
  readonly description?: string;

  /**
   * The self-service action name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-serviceaction.html#cfn-servicecatalog-serviceaction-name
   */
  readonly name: string;
}

/**
 * Determine whether the given properties match those of a `DefinitionParameterProperty`
 *
 * @param properties - the TypeScript properties of a `DefinitionParameterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceActionDefinitionParameterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"DefinitionParameterProperty\"");
}

// @ts-ignore TS6133
function convertCfnServiceActionDefinitionParameterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceActionDefinitionParameterPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnServiceActionDefinitionParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnServiceAction.DefinitionParameterProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServiceAction.DefinitionParameterProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnServiceActionProps`
 *
 * @param properties - the TypeScript properties of a `CfnServiceActionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceActionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("acceptLanguage", cdk.validateString)(properties.acceptLanguage));
  errors.collect(cdk.propertyValidator("definition", cdk.requiredValidator)(properties.definition));
  errors.collect(cdk.propertyValidator("definition", cdk.listValidator(CfnServiceActionDefinitionParameterPropertyValidator))(properties.definition));
  errors.collect(cdk.propertyValidator("definitionType", cdk.requiredValidator)(properties.definitionType));
  errors.collect(cdk.propertyValidator("definitionType", cdk.validateString)(properties.definitionType));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"CfnServiceActionProps\"");
}

// @ts-ignore TS6133
function convertCfnServiceActionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceActionPropsValidator(properties).assertSuccess();
  return {
    "AcceptLanguage": cdk.stringToCloudFormation(properties.acceptLanguage),
    "Definition": cdk.listMapper(convertCfnServiceActionDefinitionParameterPropertyToCloudFormation)(properties.definition),
    "DefinitionType": cdk.stringToCloudFormation(properties.definitionType),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnServiceActionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnServiceActionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServiceActionProps>();
  ret.addPropertyResult("acceptLanguage", "AcceptLanguage", (properties.AcceptLanguage != null ? cfn_parse.FromCloudFormation.getString(properties.AcceptLanguage) : undefined));
  ret.addPropertyResult("definition", "Definition", (properties.Definition != null ? cfn_parse.FromCloudFormation.getArray(CfnServiceActionDefinitionParameterPropertyFromCloudFormation)(properties.Definition) : undefined));
  ret.addPropertyResult("definitionType", "DefinitionType", (properties.DefinitionType != null ? cfn_parse.FromCloudFormation.getString(properties.DefinitionType) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * A self-service action association consisting of the Action ID, the Product ID, and the Provisioning Artifact ID.
 *
 * @cloudformationResource AWS::ServiceCatalog::ServiceActionAssociation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-serviceactionassociation.html
 */
export class CfnServiceActionAssociation extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ServiceCatalog::ServiceActionAssociation";

  /**
   * Build a CfnServiceActionAssociation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnServiceActionAssociation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnServiceActionAssociationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnServiceActionAssociation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The product identifier.
   */
  public productId: string;

  /**
   * The identifier of the provisioning artifact.
   */
  public provisioningArtifactId: string;

  /**
   * The self-service action identifier.
   */
  public serviceActionId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnServiceActionAssociationProps) {
    super(scope, id, {
      "type": CfnServiceActionAssociation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "productId", this);
    cdk.requireProperty(props, "provisioningArtifactId", this);
    cdk.requireProperty(props, "serviceActionId", this);

    this.productId = props.productId;
    this.provisioningArtifactId = props.provisioningArtifactId;
    this.serviceActionId = props.serviceActionId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "productId": this.productId,
      "provisioningArtifactId": this.provisioningArtifactId,
      "serviceActionId": this.serviceActionId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnServiceActionAssociation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnServiceActionAssociationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnServiceActionAssociation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-serviceactionassociation.html
 */
export interface CfnServiceActionAssociationProps {
  /**
   * The product identifier.
   *
   * For example, `prod-abcdzk7xy33qa` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-serviceactionassociation.html#cfn-servicecatalog-serviceactionassociation-productid
   */
  readonly productId: string;

  /**
   * The identifier of the provisioning artifact.
   *
   * For example, `pa-4abcdjnxjj6ne` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-serviceactionassociation.html#cfn-servicecatalog-serviceactionassociation-provisioningartifactid
   */
  readonly provisioningArtifactId: string;

  /**
   * The self-service action identifier.
   *
   * For example, `act-fs7abcd89wxyz` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-serviceactionassociation.html#cfn-servicecatalog-serviceactionassociation-serviceactionid
   */
  readonly serviceActionId: string;
}

/**
 * Determine whether the given properties match those of a `CfnServiceActionAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnServiceActionAssociationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnServiceActionAssociationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("productId", cdk.requiredValidator)(properties.productId));
  errors.collect(cdk.propertyValidator("productId", cdk.validateString)(properties.productId));
  errors.collect(cdk.propertyValidator("provisioningArtifactId", cdk.requiredValidator)(properties.provisioningArtifactId));
  errors.collect(cdk.propertyValidator("provisioningArtifactId", cdk.validateString)(properties.provisioningArtifactId));
  errors.collect(cdk.propertyValidator("serviceActionId", cdk.requiredValidator)(properties.serviceActionId));
  errors.collect(cdk.propertyValidator("serviceActionId", cdk.validateString)(properties.serviceActionId));
  return errors.wrap("supplied properties not correct for \"CfnServiceActionAssociationProps\"");
}

// @ts-ignore TS6133
function convertCfnServiceActionAssociationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnServiceActionAssociationPropsValidator(properties).assertSuccess();
  return {
    "ProductId": cdk.stringToCloudFormation(properties.productId),
    "ProvisioningArtifactId": cdk.stringToCloudFormation(properties.provisioningArtifactId),
    "ServiceActionId": cdk.stringToCloudFormation(properties.serviceActionId)
  };
}

// @ts-ignore TS6133
function CfnServiceActionAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnServiceActionAssociationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnServiceActionAssociationProps>();
  ret.addPropertyResult("productId", "ProductId", (properties.ProductId != null ? cfn_parse.FromCloudFormation.getString(properties.ProductId) : undefined));
  ret.addPropertyResult("provisioningArtifactId", "ProvisioningArtifactId", (properties.ProvisioningArtifactId != null ? cfn_parse.FromCloudFormation.getString(properties.ProvisioningArtifactId) : undefined));
  ret.addPropertyResult("serviceActionId", "ServiceActionId", (properties.ServiceActionId != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceActionId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a StackSet constraint.
 *
 * @cloudformationResource AWS::ServiceCatalog::StackSetConstraint
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-stacksetconstraint.html
 */
export class CfnStackSetConstraint extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ServiceCatalog::StackSetConstraint";

  /**
   * Build a CfnStackSetConstraint from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStackSetConstraint {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnStackSetConstraintPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnStackSetConstraint(scope, id, propsResult.value);
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
   * The language code.
   */
  public acceptLanguage?: string;

  /**
   * One or more AWS accounts that will have access to the provisioned product.
   */
  public accountList: Array<string>;

  /**
   * AdminRole ARN.
   */
  public adminRole: string;

  /**
   * The description of the constraint.
   */
  public description: string;

  /**
   * ExecutionRole name.
   */
  public executionRole: string;

  /**
   * The portfolio identifier.
   */
  public portfolioId: string;

  /**
   * The product identifier.
   */
  public productId: string;

  /**
   * One or more AWS Regions where the provisioned product will be available.
   */
  public regionList: Array<string>;

  /**
   * Permission to create, update, and delete stack instances.
   */
  public stackInstanceControl: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnStackSetConstraintProps) {
    super(scope, id, {
      "type": CfnStackSetConstraint.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "accountList", this);
    cdk.requireProperty(props, "adminRole", this);
    cdk.requireProperty(props, "description", this);
    cdk.requireProperty(props, "executionRole", this);
    cdk.requireProperty(props, "portfolioId", this);
    cdk.requireProperty(props, "productId", this);
    cdk.requireProperty(props, "regionList", this);
    cdk.requireProperty(props, "stackInstanceControl", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.acceptLanguage = props.acceptLanguage;
    this.accountList = props.accountList;
    this.adminRole = props.adminRole;
    this.description = props.description;
    this.executionRole = props.executionRole;
    this.portfolioId = props.portfolioId;
    this.productId = props.productId;
    this.regionList = props.regionList;
    this.stackInstanceControl = props.stackInstanceControl;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "acceptLanguage": this.acceptLanguage,
      "accountList": this.accountList,
      "adminRole": this.adminRole,
      "description": this.description,
      "executionRole": this.executionRole,
      "portfolioId": this.portfolioId,
      "productId": this.productId,
      "regionList": this.regionList,
      "stackInstanceControl": this.stackInstanceControl
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnStackSetConstraint.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnStackSetConstraintPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnStackSetConstraint`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-stacksetconstraint.html
 */
export interface CfnStackSetConstraintProps {
  /**
   * The language code.
   *
   * - `jp` - Japanese
   * - `zh` - Chinese
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-stacksetconstraint.html#cfn-servicecatalog-stacksetconstraint-acceptlanguage
   */
  readonly acceptLanguage?: string;

  /**
   * One or more AWS accounts that will have access to the provisioned product.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-stacksetconstraint.html#cfn-servicecatalog-stacksetconstraint-accountlist
   */
  readonly accountList: Array<string>;

  /**
   * AdminRole ARN.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-stacksetconstraint.html#cfn-servicecatalog-stacksetconstraint-adminrole
   */
  readonly adminRole: string;

  /**
   * The description of the constraint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-stacksetconstraint.html#cfn-servicecatalog-stacksetconstraint-description
   */
  readonly description: string;

  /**
   * ExecutionRole name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-stacksetconstraint.html#cfn-servicecatalog-stacksetconstraint-executionrole
   */
  readonly executionRole: string;

  /**
   * The portfolio identifier.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-stacksetconstraint.html#cfn-servicecatalog-stacksetconstraint-portfolioid
   */
  readonly portfolioId: string;

  /**
   * The product identifier.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-stacksetconstraint.html#cfn-servicecatalog-stacksetconstraint-productid
   */
  readonly productId: string;

  /**
   * One or more AWS Regions where the provisioned product will be available.
   *
   * Applicable only to a `CFN_STACKSET` provisioned product type.
   *
   * The specified Regions should be within the list of Regions from the `STACKSET` constraint. To get the list of Regions in the `STACKSET` constraint, use the `DescribeProvisioningParameters` operation.
   *
   * If no values are specified, the default value is all Regions from the `STACKSET` constraint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-stacksetconstraint.html#cfn-servicecatalog-stacksetconstraint-regionlist
   */
  readonly regionList: Array<string>;

  /**
   * Permission to create, update, and delete stack instances.
   *
   * Choose from ALLOWED and NOT_ALLOWED.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-stacksetconstraint.html#cfn-servicecatalog-stacksetconstraint-stackinstancecontrol
   */
  readonly stackInstanceControl: string;
}

/**
 * Determine whether the given properties match those of a `CfnStackSetConstraintProps`
 *
 * @param properties - the TypeScript properties of a `CfnStackSetConstraintProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStackSetConstraintPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("acceptLanguage", cdk.validateString)(properties.acceptLanguage));
  errors.collect(cdk.propertyValidator("accountList", cdk.requiredValidator)(properties.accountList));
  errors.collect(cdk.propertyValidator("accountList", cdk.listValidator(cdk.validateString))(properties.accountList));
  errors.collect(cdk.propertyValidator("adminRole", cdk.requiredValidator)(properties.adminRole));
  errors.collect(cdk.propertyValidator("adminRole", cdk.validateString)(properties.adminRole));
  errors.collect(cdk.propertyValidator("description", cdk.requiredValidator)(properties.description));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("executionRole", cdk.requiredValidator)(properties.executionRole));
  errors.collect(cdk.propertyValidator("executionRole", cdk.validateString)(properties.executionRole));
  errors.collect(cdk.propertyValidator("portfolioId", cdk.requiredValidator)(properties.portfolioId));
  errors.collect(cdk.propertyValidator("portfolioId", cdk.validateString)(properties.portfolioId));
  errors.collect(cdk.propertyValidator("productId", cdk.requiredValidator)(properties.productId));
  errors.collect(cdk.propertyValidator("productId", cdk.validateString)(properties.productId));
  errors.collect(cdk.propertyValidator("regionList", cdk.requiredValidator)(properties.regionList));
  errors.collect(cdk.propertyValidator("regionList", cdk.listValidator(cdk.validateString))(properties.regionList));
  errors.collect(cdk.propertyValidator("stackInstanceControl", cdk.requiredValidator)(properties.stackInstanceControl));
  errors.collect(cdk.propertyValidator("stackInstanceControl", cdk.validateString)(properties.stackInstanceControl));
  return errors.wrap("supplied properties not correct for \"CfnStackSetConstraintProps\"");
}

// @ts-ignore TS6133
function convertCfnStackSetConstraintPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStackSetConstraintPropsValidator(properties).assertSuccess();
  return {
    "AcceptLanguage": cdk.stringToCloudFormation(properties.acceptLanguage),
    "AccountList": cdk.listMapper(cdk.stringToCloudFormation)(properties.accountList),
    "AdminRole": cdk.stringToCloudFormation(properties.adminRole),
    "Description": cdk.stringToCloudFormation(properties.description),
    "ExecutionRole": cdk.stringToCloudFormation(properties.executionRole),
    "PortfolioId": cdk.stringToCloudFormation(properties.portfolioId),
    "ProductId": cdk.stringToCloudFormation(properties.productId),
    "RegionList": cdk.listMapper(cdk.stringToCloudFormation)(properties.regionList),
    "StackInstanceControl": cdk.stringToCloudFormation(properties.stackInstanceControl)
  };
}

// @ts-ignore TS6133
function CfnStackSetConstraintPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStackSetConstraintProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStackSetConstraintProps>();
  ret.addPropertyResult("acceptLanguage", "AcceptLanguage", (properties.AcceptLanguage != null ? cfn_parse.FromCloudFormation.getString(properties.AcceptLanguage) : undefined));
  ret.addPropertyResult("accountList", "AccountList", (properties.AccountList != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AccountList) : undefined));
  ret.addPropertyResult("adminRole", "AdminRole", (properties.AdminRole != null ? cfn_parse.FromCloudFormation.getString(properties.AdminRole) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("executionRole", "ExecutionRole", (properties.ExecutionRole != null ? cfn_parse.FromCloudFormation.getString(properties.ExecutionRole) : undefined));
  ret.addPropertyResult("portfolioId", "PortfolioId", (properties.PortfolioId != null ? cfn_parse.FromCloudFormation.getString(properties.PortfolioId) : undefined));
  ret.addPropertyResult("productId", "ProductId", (properties.ProductId != null ? cfn_parse.FromCloudFormation.getString(properties.ProductId) : undefined));
  ret.addPropertyResult("regionList", "RegionList", (properties.RegionList != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.RegionList) : undefined));
  ret.addPropertyResult("stackInstanceControl", "StackInstanceControl", (properties.StackInstanceControl != null ? cfn_parse.FromCloudFormation.getString(properties.StackInstanceControl) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a TagOption.
 *
 * A TagOption is a key-value pair managed by AWS Service Catalog that serves as a template for creating an AWS tag.
 *
 * @cloudformationResource AWS::ServiceCatalog::TagOption
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-tagoption.html
 */
export class CfnTagOption extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ServiceCatalog::TagOption";

  /**
   * Build a CfnTagOption from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTagOption {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTagOptionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTagOption(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The TagOption identifier.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The TagOption active state.
   */
  public active?: boolean | cdk.IResolvable;

  /**
   * The TagOption key.
   */
  public key: string;

  /**
   * The TagOption value.
   */
  public value: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTagOptionProps) {
    super(scope, id, {
      "type": CfnTagOption.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "key", this);
    cdk.requireProperty(props, "value", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.active = props.active;
    this.key = props.key;
    this.value = props.value;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "active": this.active,
      "key": this.key,
      "value": this.value
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTagOption.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTagOptionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnTagOption`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-tagoption.html
 */
export interface CfnTagOptionProps {
  /**
   * The TagOption active state.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-tagoption.html#cfn-servicecatalog-tagoption-active
   */
  readonly active?: boolean | cdk.IResolvable;

  /**
   * The TagOption key.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-tagoption.html#cfn-servicecatalog-tagoption-key
   */
  readonly key: string;

  /**
   * The TagOption value.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-tagoption.html#cfn-servicecatalog-tagoption-value
   */
  readonly value: string;
}

/**
 * Determine whether the given properties match those of a `CfnTagOptionProps`
 *
 * @param properties - the TypeScript properties of a `CfnTagOptionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTagOptionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("active", cdk.validateBoolean)(properties.active));
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"CfnTagOptionProps\"");
}

// @ts-ignore TS6133
function convertCfnTagOptionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTagOptionPropsValidator(properties).assertSuccess();
  return {
    "Active": cdk.booleanToCloudFormation(properties.active),
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnTagOptionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTagOptionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTagOptionProps>();
  ret.addPropertyResult("active", "Active", (properties.Active != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Active) : undefined));
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Associate the specified TagOption with the specified portfolio or product.
 *
 * @cloudformationResource AWS::ServiceCatalog::TagOptionAssociation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-tagoptionassociation.html
 */
export class CfnTagOptionAssociation extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ServiceCatalog::TagOptionAssociation";

  /**
   * Build a CfnTagOptionAssociation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTagOptionAssociation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTagOptionAssociationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTagOptionAssociation(scope, id, propsResult.value);
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
   * The resource identifier.
   */
  public resourceId: string;

  /**
   * The TagOption identifier.
   */
  public tagOptionId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTagOptionAssociationProps) {
    super(scope, id, {
      "type": CfnTagOptionAssociation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "resourceId", this);
    cdk.requireProperty(props, "tagOptionId", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.resourceId = props.resourceId;
    this.tagOptionId = props.tagOptionId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "resourceId": this.resourceId,
      "tagOptionId": this.tagOptionId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTagOptionAssociation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTagOptionAssociationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnTagOptionAssociation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-tagoptionassociation.html
 */
export interface CfnTagOptionAssociationProps {
  /**
   * The resource identifier.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-tagoptionassociation.html#cfn-servicecatalog-tagoptionassociation-resourceid
   */
  readonly resourceId: string;

  /**
   * The TagOption identifier.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-tagoptionassociation.html#cfn-servicecatalog-tagoptionassociation-tagoptionid
   */
  readonly tagOptionId: string;
}

/**
 * Determine whether the given properties match those of a `CfnTagOptionAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnTagOptionAssociationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTagOptionAssociationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("resourceId", cdk.requiredValidator)(properties.resourceId));
  errors.collect(cdk.propertyValidator("resourceId", cdk.validateString)(properties.resourceId));
  errors.collect(cdk.propertyValidator("tagOptionId", cdk.requiredValidator)(properties.tagOptionId));
  errors.collect(cdk.propertyValidator("tagOptionId", cdk.validateString)(properties.tagOptionId));
  return errors.wrap("supplied properties not correct for \"CfnTagOptionAssociationProps\"");
}

// @ts-ignore TS6133
function convertCfnTagOptionAssociationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTagOptionAssociationPropsValidator(properties).assertSuccess();
  return {
    "ResourceId": cdk.stringToCloudFormation(properties.resourceId),
    "TagOptionId": cdk.stringToCloudFormation(properties.tagOptionId)
  };
}

// @ts-ignore TS6133
function CfnTagOptionAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTagOptionAssociationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTagOptionAssociationProps>();
  ret.addPropertyResult("resourceId", "ResourceId", (properties.ResourceId != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceId) : undefined));
  ret.addPropertyResult("tagOptionId", "TagOptionId", (properties.TagOptionId != null ? cfn_parse.FromCloudFormation.getString(properties.TagOptionId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}