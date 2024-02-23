/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::QLDB::Ledger` resource specifies a new Amazon Quantum Ledger Database (Amazon QLDB) ledger in your AWS account .
 *
 * Amazon QLDB is a fully managed ledger database that provides a transparent, immutable, and cryptographically verifiable transaction log owned by a central trusted authority. You can use QLDB to track all application data changes, and maintain a complete and verifiable history of changes over time.
 *
 * For more information, see [CreateLedger](https://docs.aws.amazon.com/qldb/latest/developerguide/API_CreateLedger.html) in the *Amazon QLDB API Reference* .
 *
 * @cloudformationResource AWS::QLDB::Ledger
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-ledger.html
 */
export class CfnLedger extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::QLDB::Ledger";

  /**
   * Build a CfnLedger from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLedger {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLedgerPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLedger(scope, id, propsResult.value);
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
   * Specifies whether the ledger is protected from being deleted by any user.
   */
  public deletionProtection?: boolean | cdk.IResolvable;

  /**
   * The key in AWS Key Management Service ( AWS KMS ) to use for encryption of data at rest in the ledger.
   */
  public kmsKey?: string;

  /**
   * The name of the ledger that you want to create.
   */
  public name?: string;

  /**
   * The permissions mode to assign to the ledger that you want to create.
   */
  public permissionsMode: string;

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
  public constructor(scope: constructs.Construct, id: string, props: CfnLedgerProps) {
    super(scope, id, {
      "type": CfnLedger.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "permissionsMode", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.deletionProtection = props.deletionProtection;
    this.kmsKey = props.kmsKey;
    this.name = props.name;
    this.permissionsMode = props.permissionsMode;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::QLDB::Ledger", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    if ((this.node.scope != null && cdk.Resource.isResource(this.node.scope))) {
      this.node.addValidation({
        "validate": () => ((this.cfnOptions.deletionPolicy === undefined) ? ["'AWS::QLDB::Ledger' is a stateful resource type, and you must specify a Removal Policy for it. Call 'resource.applyRemovalPolicy()'."] : [])
      });
    }
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "deletionProtection": this.deletionProtection,
      "kmsKey": this.kmsKey,
      "name": this.name,
      "permissionsMode": this.permissionsMode,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLedger.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLedgerPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnLedger`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-ledger.html
 */
export interface CfnLedgerProps {
  /**
   * Specifies whether the ledger is protected from being deleted by any user.
   *
   * If not defined during ledger creation, this feature is enabled ( `true` ) by default.
   *
   * If deletion protection is enabled, you must first disable it before you can delete the ledger. You can disable it by calling the `UpdateLedger` operation to set this parameter to `false` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-ledger.html#cfn-qldb-ledger-deletionprotection
   */
  readonly deletionProtection?: boolean | cdk.IResolvable;

  /**
   * The key in AWS Key Management Service ( AWS KMS ) to use for encryption of data at rest in the ledger.
   *
   * For more information, see [Encryption at rest](https://docs.aws.amazon.com/qldb/latest/developerguide/encryption-at-rest.html) in the *Amazon QLDB Developer Guide* .
   *
   * Use one of the following options to specify this parameter:
   *
   * - `AWS_OWNED_KMS_KEY` : Use an AWS KMS key that is owned and managed by AWS on your behalf.
   * - *Undefined* : By default, use an AWS owned KMS key.
   * - *A valid symmetric customer managed KMS key* : Use the specified symmetric encryption KMS key in your account that you create, own, and manage.
   *
   * Amazon QLDB does not support asymmetric keys. For more information, see [Using symmetric and asymmetric keys](https://docs.aws.amazon.com/kms/latest/developerguide/symmetric-asymmetric.html) in the *AWS Key Management Service Developer Guide* .
   *
   * To specify a customer managed KMS key, you can use its key ID, Amazon Resource Name (ARN), alias name, or alias ARN. When using an alias name, prefix it with `"alias/"` . To specify a key in a different AWS account , you must use the key ARN or alias ARN.
   *
   * For example:
   *
   * - Key ID: `1234abcd-12ab-34cd-56ef-1234567890ab`
   * - Key ARN: `arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab`
   * - Alias name: `alias/ExampleAlias`
   * - Alias ARN: `arn:aws:kms:us-east-2:111122223333:alias/ExampleAlias`
   *
   * For more information, see [Key identifiers (KeyId)](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#key-id) in the *AWS Key Management Service Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-ledger.html#cfn-qldb-ledger-kmskey
   */
  readonly kmsKey?: string;

  /**
   * The name of the ledger that you want to create.
   *
   * The name must be unique among all of the ledgers in your AWS account in the current Region.
   *
   * Naming constraints for ledger names are defined in [Quotas in Amazon QLDB](https://docs.aws.amazon.com/qldb/latest/developerguide/limits.html#limits.naming) in the *Amazon QLDB Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-ledger.html#cfn-qldb-ledger-name
   */
  readonly name?: string;

  /**
   * The permissions mode to assign to the ledger that you want to create.
   *
   * This parameter can have one of the following values:
   *
   * - `ALLOW_ALL` : A legacy permissions mode that enables access control with API-level granularity for ledgers.
   *
   * This mode allows users who have the `SendCommand` API permission for this ledger to run all PartiQL commands (hence, `ALLOW_ALL` ) on any tables in the specified ledger. This mode disregards any table-level or command-level IAM permissions policies that you create for the ledger.
   * - `STANDARD` : ( *Recommended* ) A permissions mode that enables access control with finer granularity for ledgers, tables, and PartiQL commands.
   *
   * By default, this mode denies all user requests to run any PartiQL commands on any tables in this ledger. To allow PartiQL commands to run, you must create IAM permissions policies for specific table resources and PartiQL actions, in addition to the `SendCommand` API permission for the ledger. For information, see [Getting started with the standard permissions mode](https://docs.aws.amazon.com/qldb/latest/developerguide/getting-started-standard-mode.html) in the *Amazon QLDB Developer Guide* .
   *
   * > We strongly recommend using the `STANDARD` permissions mode to maximize the security of your ledger data.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-ledger.html#cfn-qldb-ledger-permissionsmode
   */
  readonly permissionsMode: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-ledger.html#cfn-qldb-ledger-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnLedgerProps`
 *
 * @param properties - the TypeScript properties of a `CfnLedgerProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLedgerPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deletionProtection", cdk.validateBoolean)(properties.deletionProtection));
  errors.collect(cdk.propertyValidator("kmsKey", cdk.validateString)(properties.kmsKey));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("permissionsMode", cdk.requiredValidator)(properties.permissionsMode));
  errors.collect(cdk.propertyValidator("permissionsMode", cdk.validateString)(properties.permissionsMode));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnLedgerProps\"");
}

// @ts-ignore TS6133
function convertCfnLedgerPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLedgerPropsValidator(properties).assertSuccess();
  return {
    "DeletionProtection": cdk.booleanToCloudFormation(properties.deletionProtection),
    "KmsKey": cdk.stringToCloudFormation(properties.kmsKey),
    "Name": cdk.stringToCloudFormation(properties.name),
    "PermissionsMode": cdk.stringToCloudFormation(properties.permissionsMode),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnLedgerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLedgerProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLedgerProps>();
  ret.addPropertyResult("deletionProtection", "DeletionProtection", (properties.DeletionProtection != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeletionProtection) : undefined));
  ret.addPropertyResult("kmsKey", "KmsKey", (properties.KmsKey != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKey) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("permissionsMode", "PermissionsMode", (properties.PermissionsMode != null ? cfn_parse.FromCloudFormation.getString(properties.PermissionsMode) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::QLDB::Stream` resource specifies a journal stream for a given Amazon Quantum Ledger Database (Amazon QLDB) ledger.
 *
 * The stream captures every document revision that is committed to the ledger's journal and delivers the data to a specified Amazon Kinesis Data Streams resource.
 *
 * For more information, see [StreamJournalToKinesis](https://docs.aws.amazon.com/qldb/latest/developerguide/API_StreamJournalToKinesis.html) in the *Amazon QLDB API Reference* .
 *
 * @cloudformationResource AWS::QLDB::Stream
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-stream.html
 */
export class CfnStream extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::QLDB::Stream";

  /**
   * Build a CfnStream from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStream {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnStreamPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnStream(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the QLDB journal stream. For example: `arn:aws:qldb:us-east-1:123456789012:stream/exampleLedger/IiPT4brpZCqCq3f4MTHbYy` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The unique ID that QLDB assigns to each QLDB journal stream. For example: `IiPT4brpZCqCq3f4MTHbYy` .
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The exclusive date and time that specifies when the stream ends.
   */
  public exclusiveEndTime?: string;

  /**
   * The inclusive start date and time from which to start streaming journal data.
   */
  public inclusiveStartTime: string;

  /**
   * The configuration settings of the Kinesis Data Streams destination for your stream request.
   */
  public kinesisConfiguration: cdk.IResolvable | CfnStream.KinesisConfigurationProperty;

  /**
   * The name of the ledger.
   */
  public ledgerName: string;

  /**
   * The Amazon Resource Name (ARN) of the IAM role that grants QLDB permissions for a journal stream to write data records to a Kinesis Data Streams resource.
   */
  public roleArn: string;

  /**
   * The name that you want to assign to the QLDB journal stream.
   */
  public streamName: string;

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
  public constructor(scope: constructs.Construct, id: string, props: CfnStreamProps) {
    super(scope, id, {
      "type": CfnStream.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "inclusiveStartTime", this);
    cdk.requireProperty(props, "kinesisConfiguration", this);
    cdk.requireProperty(props, "ledgerName", this);
    cdk.requireProperty(props, "roleArn", this);
    cdk.requireProperty(props, "streamName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.exclusiveEndTime = props.exclusiveEndTime;
    this.inclusiveStartTime = props.inclusiveStartTime;
    this.kinesisConfiguration = props.kinesisConfiguration;
    this.ledgerName = props.ledgerName;
    this.roleArn = props.roleArn;
    this.streamName = props.streamName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::QLDB::Stream", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "exclusiveEndTime": this.exclusiveEndTime,
      "inclusiveStartTime": this.inclusiveStartTime,
      "kinesisConfiguration": this.kinesisConfiguration,
      "ledgerName": this.ledgerName,
      "roleArn": this.roleArn,
      "streamName": this.streamName,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnStream.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnStreamPropsToCloudFormation(props);
  }
}

export namespace CfnStream {
  /**
   * The configuration settings of the Amazon Kinesis Data Streams destination for an Amazon QLDB journal stream.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-qldb-stream-kinesisconfiguration.html
   */
  export interface KinesisConfigurationProperty {
    /**
     * Enables QLDB to publish multiple data records in a single Kinesis Data Streams record, increasing the number of records sent per API call.
     *
     * Default: `True`
     *
     * > Record aggregation has important implications for processing records and requires de-aggregation in your stream consumer. To learn more, see [KPL Key Concepts](https://docs.aws.amazon.com/streams/latest/dev/kinesis-kpl-concepts.html) and [Consumer De-aggregation](https://docs.aws.amazon.com/streams/latest/dev/kinesis-kpl-consumer-deaggregation.html) in the *Amazon Kinesis Data Streams Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-qldb-stream-kinesisconfiguration.html#cfn-qldb-stream-kinesisconfiguration-aggregationenabled
     */
    readonly aggregationEnabled?: boolean | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the Kinesis Data Streams resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-qldb-stream-kinesisconfiguration.html#cfn-qldb-stream-kinesisconfiguration-streamarn
     */
    readonly streamArn?: string;
  }
}

/**
 * Properties for defining a `CfnStream`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-stream.html
 */
export interface CfnStreamProps {
  /**
   * The exclusive date and time that specifies when the stream ends.
   *
   * If you don't define this parameter, the stream runs indefinitely until you cancel it.
   *
   * The `ExclusiveEndTime` must be in `ISO 8601` date and time format and in Universal Coordinated Time (UTC). For example: `2019-06-13T21:36:34Z` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-stream.html#cfn-qldb-stream-exclusiveendtime
   */
  readonly exclusiveEndTime?: string;

  /**
   * The inclusive start date and time from which to start streaming journal data.
   *
   * This parameter must be in `ISO 8601` date and time format and in Universal Coordinated Time (UTC). For example: `2019-06-13T21:36:34Z` .
   *
   * The `InclusiveStartTime` cannot be in the future and must be before `ExclusiveEndTime` .
   *
   * If you provide an `InclusiveStartTime` that is before the ledger's `CreationDateTime` , QLDB effectively defaults it to the ledger's `CreationDateTime` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-stream.html#cfn-qldb-stream-inclusivestarttime
   */
  readonly inclusiveStartTime: string;

  /**
   * The configuration settings of the Kinesis Data Streams destination for your stream request.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-stream.html#cfn-qldb-stream-kinesisconfiguration
   */
  readonly kinesisConfiguration: cdk.IResolvable | CfnStream.KinesisConfigurationProperty;

  /**
   * The name of the ledger.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-stream.html#cfn-qldb-stream-ledgername
   */
  readonly ledgerName: string;

  /**
   * The Amazon Resource Name (ARN) of the IAM role that grants QLDB permissions for a journal stream to write data records to a Kinesis Data Streams resource.
   *
   * To pass a role to QLDB when requesting a journal stream, you must have permissions to perform the `iam:PassRole` action on the IAM role resource. This is required for all journal stream requests.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-stream.html#cfn-qldb-stream-rolearn
   */
  readonly roleArn: string;

  /**
   * The name that you want to assign to the QLDB journal stream.
   *
   * User-defined names can help identify and indicate the purpose of a stream.
   *
   * Your stream name must be unique among other *active* streams for a given ledger. Stream names have the same naming constraints as ledger names, as defined in [Quotas in Amazon QLDB](https://docs.aws.amazon.com/qldb/latest/developerguide/limits.html#limits.naming) in the *Amazon QLDB Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-stream.html#cfn-qldb-stream-streamname
   */
  readonly streamName: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-qldb-stream.html#cfn-qldb-stream-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `KinesisConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStreamKinesisConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("aggregationEnabled", cdk.validateBoolean)(properties.aggregationEnabled));
  errors.collect(cdk.propertyValidator("streamArn", cdk.validateString)(properties.streamArn));
  return errors.wrap("supplied properties not correct for \"KinesisConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnStreamKinesisConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStreamKinesisConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AggregationEnabled": cdk.booleanToCloudFormation(properties.aggregationEnabled),
    "StreamArn": cdk.stringToCloudFormation(properties.streamArn)
  };
}

// @ts-ignore TS6133
function CfnStreamKinesisConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStream.KinesisConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStream.KinesisConfigurationProperty>();
  ret.addPropertyResult("aggregationEnabled", "AggregationEnabled", (properties.AggregationEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AggregationEnabled) : undefined));
  ret.addPropertyResult("streamArn", "StreamArn", (properties.StreamArn != null ? cfn_parse.FromCloudFormation.getString(properties.StreamArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnStreamProps`
 *
 * @param properties - the TypeScript properties of a `CfnStreamProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStreamPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("exclusiveEndTime", cdk.validateString)(properties.exclusiveEndTime));
  errors.collect(cdk.propertyValidator("inclusiveStartTime", cdk.requiredValidator)(properties.inclusiveStartTime));
  errors.collect(cdk.propertyValidator("inclusiveStartTime", cdk.validateString)(properties.inclusiveStartTime));
  errors.collect(cdk.propertyValidator("kinesisConfiguration", cdk.requiredValidator)(properties.kinesisConfiguration));
  errors.collect(cdk.propertyValidator("kinesisConfiguration", CfnStreamKinesisConfigurationPropertyValidator)(properties.kinesisConfiguration));
  errors.collect(cdk.propertyValidator("ledgerName", cdk.requiredValidator)(properties.ledgerName));
  errors.collect(cdk.propertyValidator("ledgerName", cdk.validateString)(properties.ledgerName));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("streamName", cdk.requiredValidator)(properties.streamName));
  errors.collect(cdk.propertyValidator("streamName", cdk.validateString)(properties.streamName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnStreamProps\"");
}

// @ts-ignore TS6133
function convertCfnStreamPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStreamPropsValidator(properties).assertSuccess();
  return {
    "ExclusiveEndTime": cdk.stringToCloudFormation(properties.exclusiveEndTime),
    "InclusiveStartTime": cdk.stringToCloudFormation(properties.inclusiveStartTime),
    "KinesisConfiguration": convertCfnStreamKinesisConfigurationPropertyToCloudFormation(properties.kinesisConfiguration),
    "LedgerName": cdk.stringToCloudFormation(properties.ledgerName),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "StreamName": cdk.stringToCloudFormation(properties.streamName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnStreamPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStreamProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStreamProps>();
  ret.addPropertyResult("exclusiveEndTime", "ExclusiveEndTime", (properties.ExclusiveEndTime != null ? cfn_parse.FromCloudFormation.getString(properties.ExclusiveEndTime) : undefined));
  ret.addPropertyResult("inclusiveStartTime", "InclusiveStartTime", (properties.InclusiveStartTime != null ? cfn_parse.FromCloudFormation.getString(properties.InclusiveStartTime) : undefined));
  ret.addPropertyResult("kinesisConfiguration", "KinesisConfiguration", (properties.KinesisConfiguration != null ? CfnStreamKinesisConfigurationPropertyFromCloudFormation(properties.KinesisConfiguration) : undefined));
  ret.addPropertyResult("ledgerName", "LedgerName", (properties.LedgerName != null ? cfn_parse.FromCloudFormation.getString(properties.LedgerName) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("streamName", "StreamName", (properties.StreamName != null ? cfn_parse.FromCloudFormation.getString(properties.StreamName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}