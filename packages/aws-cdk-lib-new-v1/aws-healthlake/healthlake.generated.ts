/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates a Data Store that can ingest and export FHIR formatted data.
 *
 * > Please note that when a user tries to do an Update operation via CloudFormation, changes to the Data Store name, Type Version, PreloadDataConfig, or SSEConfiguration will delete their existing Data Store for the stack and create a new one. This will lead to potential loss of data.
 *
 * @cloudformationResource AWS::HealthLake::FHIRDatastore
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthlake-fhirdatastore.html
 */
export class CfnFHIRDatastore extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::HealthLake::FHIRDatastore";

  /**
   * Build a CfnFHIRDatastore from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFHIRDatastore {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnFHIRDatastorePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnFHIRDatastore(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The time that a Data Store was created.
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: cdk.IResolvable;

  /**
   * @cloudformationAttribute CreatedAt.Nanos
   */
  public readonly attrCreatedAtNanos: number;

  /**
   * @cloudformationAttribute CreatedAt.Seconds
   */
  public readonly attrCreatedAtSeconds: string;

  /**
   * The Data Store ARN is generated during the creation of the Data Store and can be found in the output from the initial Data Store creation request.
   *
   * @cloudformationAttribute DatastoreArn
   */
  public readonly attrDatastoreArn: string;

  /**
   * The endpoint for the created Data Store.
   *
   * @cloudformationAttribute DatastoreEndpoint
   */
  public readonly attrDatastoreEndpoint: string;

  /**
   * The Amazon generated Data Store id. This id is in the output from the initial Data Store creation call.
   *
   * @cloudformationAttribute DatastoreId
   */
  public readonly attrDatastoreId: string;

  /**
   * The status of the FHIR Data Store. Possible statuses are ‘CREATING’, ‘ACTIVE’, ‘DELETING’, ‘DELETED’.
   *
   * @cloudformationAttribute DatastoreStatus
   */
  public readonly attrDatastoreStatus: string;

  /**
   * The user generated name for the data store.
   */
  public datastoreName?: string;

  /**
   * The FHIR version of the data store.
   */
  public datastoreTypeVersion: string;

  /**
   * The identity provider configuration that you gave when the data store was created.
   */
  public identityProviderConfiguration?: CfnFHIRDatastore.IdentityProviderConfigurationProperty | cdk.IResolvable;

  /**
   * The preloaded data configuration for the data store.
   */
  public preloadDataConfig?: cdk.IResolvable | CfnFHIRDatastore.PreloadDataConfigProperty;

  /**
   * The server-side encryption key configuration for a customer provided encryption key specified for creating a data store.
   */
  public sseConfiguration?: cdk.IResolvable | CfnFHIRDatastore.SseConfigurationProperty;

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
  public constructor(scope: constructs.Construct, id: string, props: CfnFHIRDatastoreProps) {
    super(scope, id, {
      "type": CfnFHIRDatastore.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "datastoreTypeVersion", this);

    this.attrCreatedAt = this.getAtt("CreatedAt");
    this.attrCreatedAtNanos = cdk.Token.asNumber(this.getAtt("CreatedAt.Nanos", cdk.ResolutionTypeHint.NUMBER));
    this.attrCreatedAtSeconds = cdk.Token.asString(this.getAtt("CreatedAt.Seconds", cdk.ResolutionTypeHint.STRING));
    this.attrDatastoreArn = cdk.Token.asString(this.getAtt("DatastoreArn", cdk.ResolutionTypeHint.STRING));
    this.attrDatastoreEndpoint = cdk.Token.asString(this.getAtt("DatastoreEndpoint", cdk.ResolutionTypeHint.STRING));
    this.attrDatastoreId = cdk.Token.asString(this.getAtt("DatastoreId", cdk.ResolutionTypeHint.STRING));
    this.attrDatastoreStatus = cdk.Token.asString(this.getAtt("DatastoreStatus", cdk.ResolutionTypeHint.STRING));
    this.datastoreName = props.datastoreName;
    this.datastoreTypeVersion = props.datastoreTypeVersion;
    this.identityProviderConfiguration = props.identityProviderConfiguration;
    this.preloadDataConfig = props.preloadDataConfig;
    this.sseConfiguration = props.sseConfiguration;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::HealthLake::FHIRDatastore", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "datastoreName": this.datastoreName,
      "datastoreTypeVersion": this.datastoreTypeVersion,
      "identityProviderConfiguration": this.identityProviderConfiguration,
      "preloadDataConfig": this.preloadDataConfig,
      "sseConfiguration": this.sseConfiguration,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnFHIRDatastore.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnFHIRDatastorePropsToCloudFormation(props);
  }
}

export namespace CfnFHIRDatastore {
  /**
   * The identity provider configuration that you gave when the data store was created.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-identityproviderconfiguration.html
   */
  export interface IdentityProviderConfigurationProperty {
    /**
     * The authorization strategy that you selected when you created the data store.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-identityproviderconfiguration.html#cfn-healthlake-fhirdatastore-identityproviderconfiguration-authorizationstrategy
     */
    readonly authorizationStrategy: string;

    /**
     * If you enabled fine-grained authorization when you created the data store.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-identityproviderconfiguration.html#cfn-healthlake-fhirdatastore-identityproviderconfiguration-finegrainedauthorizationenabled
     */
    readonly fineGrainedAuthorizationEnabled?: boolean | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the Lambda function that you want to use to decode the access token created by the authorization server.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-identityproviderconfiguration.html#cfn-healthlake-fhirdatastore-identityproviderconfiguration-idplambdaarn
     */
    readonly idpLambdaArn?: string;

    /**
     * The JSON metadata elements that you want to use in your identity provider configuration.
     *
     * Required elements are listed based on the launch specification of the SMART application. For more information on all possible elements, see [Metadata](https://docs.aws.amazon.com/https://build.fhir.org/ig/HL7/smart-app-launch/conformance.html#metadata) in SMART's App Launch specification.
     *
     * `authorization_endpoint` : The URL to the OAuth2 authorization endpoint.
     *
     * `grant_types_supported` : An array of grant types that are supported at the token endpoint. You must provide at least one grant type option. Valid options are `authorization_code` and `client_credentials` .
     *
     * `token_endpoint` : The URL to the OAuth2 token endpoint.
     *
     * `capabilities` : An array of strings of the SMART capabilities that the authorization server supports.
     *
     * `code_challenge_methods_supported` : An array of strings of supported PKCE code challenge methods. You must include the `S256` method in the array of PKCE code challenge methods.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-identityproviderconfiguration.html#cfn-healthlake-fhirdatastore-identityproviderconfiguration-metadata
     */
    readonly metadata?: string;
  }

  /**
   * Optional parameter to preload data upon creation of the data store.
   *
   * Currently, the only supported preloaded data is synthetic data generated from Synthea.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-preloaddataconfig.html
   */
  export interface PreloadDataConfigProperty {
    /**
     * The type of preloaded data.
     *
     * Only Synthea preloaded data is supported.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-preloaddataconfig.html#cfn-healthlake-fhirdatastore-preloaddataconfig-preloaddatatype
     */
    readonly preloadDataType: string;
  }

  /**
   * The server-side encryption key configuration for a customer provided encryption key.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-sseconfiguration.html
   */
  export interface SseConfigurationProperty {
    /**
     * The server-side encryption key configuration for a customer provided encryption key (CMK).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-sseconfiguration.html#cfn-healthlake-fhirdatastore-sseconfiguration-kmsencryptionconfig
     */
    readonly kmsEncryptionConfig: cdk.IResolvable | CfnFHIRDatastore.KmsEncryptionConfigProperty;
  }

  /**
   * The customer-managed-key(CMK) used when creating a Data Store.
   *
   * If a customer owned key is not specified, an Amazon owned key will be used for encryption.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-kmsencryptionconfig.html
   */
  export interface KmsEncryptionConfigProperty {
    /**
     * The type of customer-managed-key(CMK) used for encryption.
     *
     * The two types of supported CMKs are customer owned CMKs and Amazon owned CMKs. For more information on CMK types, see [KmsEncryptionConfig](https://docs.aws.amazon.com/healthlake/latest/APIReference/API_KmsEncryptionConfig.html#HealthLake-Type-KmsEncryptionConfig-CmkType) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-kmsencryptionconfig.html#cfn-healthlake-fhirdatastore-kmsencryptionconfig-cmktype
     */
    readonly cmkType: string;

    /**
     * The KMS encryption key id/alias used to encrypt the data store contents at rest.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-kmsencryptionconfig.html#cfn-healthlake-fhirdatastore-kmsencryptionconfig-kmskeyid
     */
    readonly kmsKeyId?: string;
  }

  /**
   * The time that a Data Store was created.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-createdat.html
   */
  export interface CreatedAtProperty {
    /**
     * Nanoseconds.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-createdat.html#cfn-healthlake-fhirdatastore-createdat-nanos
     */
    readonly nanos: number;

    /**
     * Seconds since epoch.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-createdat.html#cfn-healthlake-fhirdatastore-createdat-seconds
     */
    readonly seconds: string;
  }
}

/**
 * Properties for defining a `CfnFHIRDatastore`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthlake-fhirdatastore.html
 */
export interface CfnFHIRDatastoreProps {
  /**
   * The user generated name for the data store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthlake-fhirdatastore.html#cfn-healthlake-fhirdatastore-datastorename
   */
  readonly datastoreName?: string;

  /**
   * The FHIR version of the data store.
   *
   * The only supported version is R4.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthlake-fhirdatastore.html#cfn-healthlake-fhirdatastore-datastoretypeversion
   */
  readonly datastoreTypeVersion: string;

  /**
   * The identity provider configuration that you gave when the data store was created.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthlake-fhirdatastore.html#cfn-healthlake-fhirdatastore-identityproviderconfiguration
   */
  readonly identityProviderConfiguration?: CfnFHIRDatastore.IdentityProviderConfigurationProperty | cdk.IResolvable;

  /**
   * The preloaded data configuration for the data store.
   *
   * Only data preloaded from Synthea is supported.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthlake-fhirdatastore.html#cfn-healthlake-fhirdatastore-preloaddataconfig
   */
  readonly preloadDataConfig?: cdk.IResolvable | CfnFHIRDatastore.PreloadDataConfigProperty;

  /**
   * The server-side encryption key configuration for a customer provided encryption key specified for creating a data store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthlake-fhirdatastore.html#cfn-healthlake-fhirdatastore-sseconfiguration
   */
  readonly sseConfiguration?: cdk.IResolvable | CfnFHIRDatastore.SseConfigurationProperty;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthlake-fhirdatastore.html#cfn-healthlake-fhirdatastore-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `IdentityProviderConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `IdentityProviderConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFHIRDatastoreIdentityProviderConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authorizationStrategy", cdk.requiredValidator)(properties.authorizationStrategy));
  errors.collect(cdk.propertyValidator("authorizationStrategy", cdk.validateString)(properties.authorizationStrategy));
  errors.collect(cdk.propertyValidator("fineGrainedAuthorizationEnabled", cdk.validateBoolean)(properties.fineGrainedAuthorizationEnabled));
  errors.collect(cdk.propertyValidator("idpLambdaArn", cdk.validateString)(properties.idpLambdaArn));
  errors.collect(cdk.propertyValidator("metadata", cdk.validateString)(properties.metadata));
  return errors.wrap("supplied properties not correct for \"IdentityProviderConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnFHIRDatastoreIdentityProviderConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFHIRDatastoreIdentityProviderConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AuthorizationStrategy": cdk.stringToCloudFormation(properties.authorizationStrategy),
    "FineGrainedAuthorizationEnabled": cdk.booleanToCloudFormation(properties.fineGrainedAuthorizationEnabled),
    "IdpLambdaArn": cdk.stringToCloudFormation(properties.idpLambdaArn),
    "Metadata": cdk.stringToCloudFormation(properties.metadata)
  };
}

// @ts-ignore TS6133
function CfnFHIRDatastoreIdentityProviderConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFHIRDatastore.IdentityProviderConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFHIRDatastore.IdentityProviderConfigurationProperty>();
  ret.addPropertyResult("authorizationStrategy", "AuthorizationStrategy", (properties.AuthorizationStrategy != null ? cfn_parse.FromCloudFormation.getString(properties.AuthorizationStrategy) : undefined));
  ret.addPropertyResult("fineGrainedAuthorizationEnabled", "FineGrainedAuthorizationEnabled", (properties.FineGrainedAuthorizationEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.FineGrainedAuthorizationEnabled) : undefined));
  ret.addPropertyResult("idpLambdaArn", "IdpLambdaArn", (properties.IdpLambdaArn != null ? cfn_parse.FromCloudFormation.getString(properties.IdpLambdaArn) : undefined));
  ret.addPropertyResult("metadata", "Metadata", (properties.Metadata != null ? cfn_parse.FromCloudFormation.getString(properties.Metadata) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PreloadDataConfigProperty`
 *
 * @param properties - the TypeScript properties of a `PreloadDataConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFHIRDatastorePreloadDataConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("preloadDataType", cdk.requiredValidator)(properties.preloadDataType));
  errors.collect(cdk.propertyValidator("preloadDataType", cdk.validateString)(properties.preloadDataType));
  return errors.wrap("supplied properties not correct for \"PreloadDataConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFHIRDatastorePreloadDataConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFHIRDatastorePreloadDataConfigPropertyValidator(properties).assertSuccess();
  return {
    "PreloadDataType": cdk.stringToCloudFormation(properties.preloadDataType)
  };
}

// @ts-ignore TS6133
function CfnFHIRDatastorePreloadDataConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFHIRDatastore.PreloadDataConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFHIRDatastore.PreloadDataConfigProperty>();
  ret.addPropertyResult("preloadDataType", "PreloadDataType", (properties.PreloadDataType != null ? cfn_parse.FromCloudFormation.getString(properties.PreloadDataType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `KmsEncryptionConfigProperty`
 *
 * @param properties - the TypeScript properties of a `KmsEncryptionConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFHIRDatastoreKmsEncryptionConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cmkType", cdk.requiredValidator)(properties.cmkType));
  errors.collect(cdk.propertyValidator("cmkType", cdk.validateString)(properties.cmkType));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  return errors.wrap("supplied properties not correct for \"KmsEncryptionConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFHIRDatastoreKmsEncryptionConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFHIRDatastoreKmsEncryptionConfigPropertyValidator(properties).assertSuccess();
  return {
    "CmkType": cdk.stringToCloudFormation(properties.cmkType),
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId)
  };
}

// @ts-ignore TS6133
function CfnFHIRDatastoreKmsEncryptionConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFHIRDatastore.KmsEncryptionConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFHIRDatastore.KmsEncryptionConfigProperty>();
  ret.addPropertyResult("cmkType", "CmkType", (properties.CmkType != null ? cfn_parse.FromCloudFormation.getString(properties.CmkType) : undefined));
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SseConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SseConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFHIRDatastoreSseConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("kmsEncryptionConfig", cdk.requiredValidator)(properties.kmsEncryptionConfig));
  errors.collect(cdk.propertyValidator("kmsEncryptionConfig", CfnFHIRDatastoreKmsEncryptionConfigPropertyValidator)(properties.kmsEncryptionConfig));
  return errors.wrap("supplied properties not correct for \"SseConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnFHIRDatastoreSseConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFHIRDatastoreSseConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "KmsEncryptionConfig": convertCfnFHIRDatastoreKmsEncryptionConfigPropertyToCloudFormation(properties.kmsEncryptionConfig)
  };
}

// @ts-ignore TS6133
function CfnFHIRDatastoreSseConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFHIRDatastore.SseConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFHIRDatastore.SseConfigurationProperty>();
  ret.addPropertyResult("kmsEncryptionConfig", "KmsEncryptionConfig", (properties.KmsEncryptionConfig != null ? CfnFHIRDatastoreKmsEncryptionConfigPropertyFromCloudFormation(properties.KmsEncryptionConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CreatedAtProperty`
 *
 * @param properties - the TypeScript properties of a `CreatedAtProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFHIRDatastoreCreatedAtPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("nanos", cdk.requiredValidator)(properties.nanos));
  errors.collect(cdk.propertyValidator("nanos", cdk.validateNumber)(properties.nanos));
  errors.collect(cdk.propertyValidator("seconds", cdk.requiredValidator)(properties.seconds));
  errors.collect(cdk.propertyValidator("seconds", cdk.validateString)(properties.seconds));
  return errors.wrap("supplied properties not correct for \"CreatedAtProperty\"");
}

// @ts-ignore TS6133
function convertCfnFHIRDatastoreCreatedAtPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFHIRDatastoreCreatedAtPropertyValidator(properties).assertSuccess();
  return {
    "Nanos": cdk.numberToCloudFormation(properties.nanos),
    "Seconds": cdk.stringToCloudFormation(properties.seconds)
  };
}

// @ts-ignore TS6133
function CfnFHIRDatastoreCreatedAtPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFHIRDatastore.CreatedAtProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFHIRDatastore.CreatedAtProperty>();
  ret.addPropertyResult("nanos", "Nanos", (properties.Nanos != null ? cfn_parse.FromCloudFormation.getNumber(properties.Nanos) : undefined));
  ret.addPropertyResult("seconds", "Seconds", (properties.Seconds != null ? cfn_parse.FromCloudFormation.getString(properties.Seconds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnFHIRDatastoreProps`
 *
 * @param properties - the TypeScript properties of a `CfnFHIRDatastoreProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFHIRDatastorePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("datastoreName", cdk.validateString)(properties.datastoreName));
  errors.collect(cdk.propertyValidator("datastoreTypeVersion", cdk.requiredValidator)(properties.datastoreTypeVersion));
  errors.collect(cdk.propertyValidator("datastoreTypeVersion", cdk.validateString)(properties.datastoreTypeVersion));
  errors.collect(cdk.propertyValidator("identityProviderConfiguration", CfnFHIRDatastoreIdentityProviderConfigurationPropertyValidator)(properties.identityProviderConfiguration));
  errors.collect(cdk.propertyValidator("preloadDataConfig", CfnFHIRDatastorePreloadDataConfigPropertyValidator)(properties.preloadDataConfig));
  errors.collect(cdk.propertyValidator("sseConfiguration", CfnFHIRDatastoreSseConfigurationPropertyValidator)(properties.sseConfiguration));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnFHIRDatastoreProps\"");
}

// @ts-ignore TS6133
function convertCfnFHIRDatastorePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFHIRDatastorePropsValidator(properties).assertSuccess();
  return {
    "DatastoreName": cdk.stringToCloudFormation(properties.datastoreName),
    "DatastoreTypeVersion": cdk.stringToCloudFormation(properties.datastoreTypeVersion),
    "IdentityProviderConfiguration": convertCfnFHIRDatastoreIdentityProviderConfigurationPropertyToCloudFormation(properties.identityProviderConfiguration),
    "PreloadDataConfig": convertCfnFHIRDatastorePreloadDataConfigPropertyToCloudFormation(properties.preloadDataConfig),
    "SseConfiguration": convertCfnFHIRDatastoreSseConfigurationPropertyToCloudFormation(properties.sseConfiguration),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnFHIRDatastorePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFHIRDatastoreProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFHIRDatastoreProps>();
  ret.addPropertyResult("datastoreName", "DatastoreName", (properties.DatastoreName != null ? cfn_parse.FromCloudFormation.getString(properties.DatastoreName) : undefined));
  ret.addPropertyResult("datastoreTypeVersion", "DatastoreTypeVersion", (properties.DatastoreTypeVersion != null ? cfn_parse.FromCloudFormation.getString(properties.DatastoreTypeVersion) : undefined));
  ret.addPropertyResult("identityProviderConfiguration", "IdentityProviderConfiguration", (properties.IdentityProviderConfiguration != null ? CfnFHIRDatastoreIdentityProviderConfigurationPropertyFromCloudFormation(properties.IdentityProviderConfiguration) : undefined));
  ret.addPropertyResult("preloadDataConfig", "PreloadDataConfig", (properties.PreloadDataConfig != null ? CfnFHIRDatastorePreloadDataConfigPropertyFromCloudFormation(properties.PreloadDataConfig) : undefined));
  ret.addPropertyResult("sseConfiguration", "SseConfiguration", (properties.SseConfiguration != null ? CfnFHIRDatastoreSseConfigurationPropertyFromCloudFormation(properties.SseConfiguration) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}