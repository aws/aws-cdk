/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates or updates a canary.
 *
 * Canaries are scripts that monitor your endpoints and APIs from the outside-in. Canaries help you check the availability and latency of your web services and troubleshoot anomalies by investigating load time data, screenshots of the UI, logs, and metrics. You can set up a canary to run continuously or just once.
 *
 * To create canaries, you must have the `CloudWatchSyntheticsFullAccess` policy. If you are creating a new IAM role for the canary, you also need the the `iam:CreateRole` , `iam:CreatePolicy` and `iam:AttachRolePolicy` permissions. For more information, see [Necessary Roles and Permissions](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Roles) .
 *
 * Do not include secrets or proprietary information in your canary names. The canary name makes up part of the Amazon Resource Name (ARN) for the canary, and the ARN is included in outbound calls over the internet. For more information, see [Security Considerations for Synthetics Canaries](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/servicelens_canaries_security.html) .
 *
 * @cloudformationResource AWS::Synthetics::Canary
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-synthetics-canary.html
 */
export class CfnCanary extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Synthetics::Canary";

  /**
   * Build a CfnCanary from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCanary {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnCanaryPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCanary(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Code.SourceLocationArn
   */
  public readonly attrCodeSourceLocationArn: string;

  /**
   * The ID of the canary.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The state of the canary. For example, `RUNNING` .
   *
   * @cloudformationAttribute State
   */
  public readonly attrState: string;

  /**
   * A structure that contains the configuration for canary artifacts, including the encryption-at-rest settings for artifacts that the canary uploads to Amazon S3.
   */
  public artifactConfig?: CfnCanary.ArtifactConfigProperty | cdk.IResolvable;

  /**
   * The location in Amazon S3 where Synthetics stores artifacts from the runs of this canary.
   */
  public artifactS3Location: string;

  /**
   * Use this structure to input your script code for the canary.
   */
  public code: CfnCanary.CodeProperty | cdk.IResolvable;

  /**
   * Deletes associated lambda resources created by Synthetics if set to True.
   *
   * @deprecated this property has been deprecated
   */
  public deleteLambdaResourcesOnCanaryDeletion?: boolean | cdk.IResolvable;

  /**
   * The ARN of the IAM role to be used to run the canary.
   */
  public executionRoleArn: string;

  /**
   * The number of days to retain data about failed runs of this canary.
   */
  public failureRetentionPeriod?: number;

  /**
   * The name for this canary.
   */
  public name: string;

  /**
   * A structure that contains input information for a canary run.
   */
  public runConfig?: cdk.IResolvable | CfnCanary.RunConfigProperty;

  /**
   * Specifies the runtime version to use for the canary.
   */
  public runtimeVersion: string;

  /**
   * A structure that contains information about how often the canary is to run, and when these runs are to stop.
   */
  public schedule: cdk.IResolvable | CfnCanary.ScheduleProperty;

  /**
   * Specify TRUE to have the canary start making runs immediately after it is created.
   */
  public startCanaryAfterCreation?: boolean | cdk.IResolvable;

  /**
   * The number of days to retain data about successful runs of this canary.
   */
  public successRetentionPeriod?: number;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The list of key-value pairs that are associated with the canary.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * If this canary performs visual monitoring by comparing screenshots, this structure contains the ID of the canary run to use as the baseline for screenshots, and the coordinates of any parts of the screen to ignore during the visual monitoring comparison.
   */
  public visualReference?: cdk.IResolvable | CfnCanary.VisualReferenceProperty;

  /**
   * If this canary is to test an endpoint in a VPC, this structure contains information about the subnet and security groups of the VPC endpoint.
   */
  public vpcConfig?: cdk.IResolvable | CfnCanary.VPCConfigProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCanaryProps) {
    super(scope, id, {
      "type": CfnCanary.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "artifactS3Location", this);
    cdk.requireProperty(props, "code", this);
    cdk.requireProperty(props, "executionRoleArn", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "runtimeVersion", this);
    cdk.requireProperty(props, "schedule", this);

    this.attrCodeSourceLocationArn = cdk.Token.asString(this.getAtt("Code.SourceLocationArn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrState = cdk.Token.asString(this.getAtt("State", cdk.ResolutionTypeHint.STRING));
    this.artifactConfig = props.artifactConfig;
    this.artifactS3Location = props.artifactS3Location;
    this.code = props.code;
    this.deleteLambdaResourcesOnCanaryDeletion = props.deleteLambdaResourcesOnCanaryDeletion;
    this.executionRoleArn = props.executionRoleArn;
    this.failureRetentionPeriod = props.failureRetentionPeriod;
    this.name = props.name;
    this.runConfig = props.runConfig;
    this.runtimeVersion = props.runtimeVersion;
    this.schedule = props.schedule;
    this.startCanaryAfterCreation = props.startCanaryAfterCreation;
    this.successRetentionPeriod = props.successRetentionPeriod;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Synthetics::Canary", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.visualReference = props.visualReference;
    this.vpcConfig = props.vpcConfig;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "artifactConfig": this.artifactConfig,
      "artifactS3Location": this.artifactS3Location,
      "code": this.code,
      "deleteLambdaResourcesOnCanaryDeletion": this.deleteLambdaResourcesOnCanaryDeletion,
      "executionRoleArn": this.executionRoleArn,
      "failureRetentionPeriod": this.failureRetentionPeriod,
      "name": this.name,
      "runConfig": this.runConfig,
      "runtimeVersion": this.runtimeVersion,
      "schedule": this.schedule,
      "startCanaryAfterCreation": this.startCanaryAfterCreation,
      "successRetentionPeriod": this.successRetentionPeriod,
      "tags": this.tags.renderTags(),
      "visualReference": this.visualReference,
      "vpcConfig": this.vpcConfig
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCanary.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCanaryPropsToCloudFormation(props);
  }
}

export namespace CfnCanary {
  /**
   * Defines the screenshots to use as the baseline for comparisons during visual monitoring comparisons during future runs of this canary.
   *
   * If you omit this parameter, no changes are made to any baseline screenshots that the canary might be using already.
   *
   * Visual monitoring is supported only on canaries running the *syn-puppeteer-node-3.2* runtime or later. For more information, see [Visual monitoring](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Library_SyntheticsLogger_VisualTesting.html) and [Visual monitoring blueprint](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Blueprints_VisualTesting.html)
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-synthetics-canary-visualreference.html
   */
  export interface VisualReferenceProperty {
    /**
     * Specifies which canary run to use the screenshots from as the baseline for future visual monitoring with this canary.
     *
     * Valid values are `nextrun` to use the screenshots from the next run after this update is made, `lastrun` to use the screenshots from the most recent run before this update was made, or the value of `Id` in the [CanaryRun](https://docs.aws.amazon.com/AmazonSynthetics/latest/APIReference/API_CanaryRun.html) from any past run of this canary.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-synthetics-canary-visualreference.html#cfn-synthetics-canary-visualreference-basecanaryrunid
     */
    readonly baseCanaryRunId: string;

    /**
     * An array of screenshots that are used as the baseline for comparisons during visual monitoring.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-synthetics-canary-visualreference.html#cfn-synthetics-canary-visualreference-basescreenshots
     */
    readonly baseScreenshots?: Array<CfnCanary.BaseScreenshotProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * A structure representing a screenshot that is used as a baseline during visual monitoring comparisons made by the canary.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-synthetics-canary-basescreenshot.html
   */
  export interface BaseScreenshotProperty {
    /**
     * Coordinates that define the part of a screen to ignore during screenshot comparisons.
     *
     * To obtain the coordinates to use here, use the CloudWatch console to draw the boundaries on the screen. For more information, see [Edit or delete a canary](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/synthetics_canaries_deletion.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-synthetics-canary-basescreenshot.html#cfn-synthetics-canary-basescreenshot-ignorecoordinates
     */
    readonly ignoreCoordinates?: Array<string>;

    /**
     * The name of the screenshot.
     *
     * This is generated the first time the canary is run after the `UpdateCanary` operation that specified for this canary to perform visual monitoring.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-synthetics-canary-basescreenshot.html#cfn-synthetics-canary-basescreenshot-screenshotname
     */
    readonly screenshotName: string;
  }

  /**
   * A structure that contains the configuration for canary artifacts, including the encryption-at-rest settings for artifacts that the canary uploads to Amazon S3 .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-synthetics-canary-artifactconfig.html
   */
  export interface ArtifactConfigProperty {
    /**
     * A structure that contains the configuration of the encryption-at-rest settings for artifacts that the canary uploads to Amazon S3 .
     *
     * Artifact encryption functionality is available only for canaries that use Synthetics runtime version syn-nodejs-puppeteer-3.3 or later. For more information, see [Encrypting canary artifacts](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_artifact_encryption.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-synthetics-canary-artifactconfig.html#cfn-synthetics-canary-artifactconfig-s3encryption
     */
    readonly s3Encryption?: cdk.IResolvable | CfnCanary.S3EncryptionProperty;
  }

  /**
   * A structure that contains the configuration of the encryption-at-rest settings for artifacts that the canary uploads to Amazon S3 .
   *
   * Artifact encryption functionality is available only for canaries that use Synthetics runtime version syn-nodejs-puppeteer-3.3 or later. For more information, see [Encrypting canary artifacts](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_artifact_encryption.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-synthetics-canary-s3encryption.html
   */
  export interface S3EncryptionProperty {
    /**
     * The encryption method to use for artifacts created by this canary.
     *
     * Specify `SSE_S3` to use server-side encryption (SSE) with an Amazon S3-managed key. Specify `SSE-KMS` to use server-side encryption with a customer-managed AWS KMS key.
     *
     * If you omit this parameter, an AWS -managed AWS KMS key is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-synthetics-canary-s3encryption.html#cfn-synthetics-canary-s3encryption-encryptionmode
     */
    readonly encryptionMode?: string;

    /**
     * The ARN of the customer-managed AWS KMS key to use, if you specify `SSE-KMS` for `EncryptionMode`.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-synthetics-canary-s3encryption.html#cfn-synthetics-canary-s3encryption-kmskeyarn
     */
    readonly kmsKeyArn?: string;
  }

  /**
   * If this canary is to test an endpoint in a VPC, this structure contains information about the subnet and security groups of the VPC endpoint.
   *
   * For more information, see [Running a Canary in a VPC](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_VPC.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-synthetics-canary-vpcconfig.html
   */
  export interface VPCConfigProperty {
    /**
     * The IDs of the security groups for this canary.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-synthetics-canary-vpcconfig.html#cfn-synthetics-canary-vpcconfig-securitygroupids
     */
    readonly securityGroupIds: Array<string>;

    /**
     * The IDs of the subnets where this canary is to run.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-synthetics-canary-vpcconfig.html#cfn-synthetics-canary-vpcconfig-subnetids
     */
    readonly subnetIds: Array<string>;

    /**
     * The ID of the VPC where this canary is to run.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-synthetics-canary-vpcconfig.html#cfn-synthetics-canary-vpcconfig-vpcid
     */
    readonly vpcId?: string;
  }

  /**
   * A structure that contains input information for a canary run.
   *
   * This structure is required.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-synthetics-canary-runconfig.html
   */
  export interface RunConfigProperty {
    /**
     * Specifies whether this canary is to use active AWS X-Ray tracing when it runs.
     *
     * Active tracing enables this canary run to be displayed in the ServiceLens and X-Ray service maps even if the canary does not hit an endpoint that has X-Ray tracing enabled. Using X-Ray tracing incurs charges. For more information, see [Canaries and X-Ray tracing](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_tracing.html) .
     *
     * You can enable active tracing only for canaries that use version `syn-nodejs-2.0` or later for their canary runtime.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-synthetics-canary-runconfig.html#cfn-synthetics-canary-runconfig-activetracing
     */
    readonly activeTracing?: boolean | cdk.IResolvable;

    /**
     * Specifies the keys and values to use for any environment variables used in the canary script.
     *
     * Use the following format:
     *
     * { "key1" : "value1", "key2" : "value2", ...}
     *
     * Keys must start with a letter and be at least two characters. The total size of your environment variables cannot exceed 4 KB. You can't specify any Lambda reserved environment variables as the keys for your environment variables. For more information about reserved keys, see [Runtime environment variables](https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html#configuration-envvars-runtime) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-synthetics-canary-runconfig.html#cfn-synthetics-canary-runconfig-environmentvariables
     */
    readonly environmentVariables?: cdk.IResolvable | Record<string, string>;

    /**
     * The maximum amount of memory that the canary can use while running.
     *
     * This value must be a multiple of 64. The range is 960 to 3008.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-synthetics-canary-runconfig.html#cfn-synthetics-canary-runconfig-memoryinmb
     */
    readonly memoryInMb?: number;

    /**
     * How long the canary is allowed to run before it must stop.
     *
     * You can't set this time to be longer than the frequency of the runs of this canary.
     *
     * If you omit this field, the frequency of the canary is used as this value, up to a maximum of 900 seconds.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-synthetics-canary-runconfig.html#cfn-synthetics-canary-runconfig-timeoutinseconds
     */
    readonly timeoutInSeconds?: number;
  }

  /**
   * Use this structure to input your script code for the canary.
   *
   * This structure contains the Lambda handler with the location where the canary should start running the script. If the script is stored in an S3 bucket, the bucket name, key, and version are also included. If the script is passed into the canary directly, the script code is contained in the value of `Script` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-synthetics-canary-code.html
   */
  export interface CodeProperty {
    /**
     * The entry point to use for the source code when running the canary.
     *
     * For canaries that use the `syn-python-selenium-1.0` runtime or a `syn-nodejs.puppeteer` runtime earlier than `syn-nodejs.puppeteer-3.4` , the handler must be specified as `*fileName* .handler` . For `syn-python-selenium-1.1` , `syn-nodejs.puppeteer-3.4` , and later runtimes, the handler can be specified as `*fileName* . *functionName*` , or you can specify a folder where canary scripts reside as `*folder* / *fileName* . *functionName*` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-synthetics-canary-code.html#cfn-synthetics-canary-code-handler
     */
    readonly handler: string;

    /**
     * If your canary script is located in S3, specify the bucket name here.
     *
     * The bucket must already exist.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-synthetics-canary-code.html#cfn-synthetics-canary-code-s3bucket
     */
    readonly s3Bucket?: string;

    /**
     * The S3 key of your script.
     *
     * For more information, see [Working with Amazon S3 Objects](https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingObjects.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-synthetics-canary-code.html#cfn-synthetics-canary-code-s3key
     */
    readonly s3Key?: string;

    /**
     * The S3 version ID of your script.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-synthetics-canary-code.html#cfn-synthetics-canary-code-s3objectversion
     */
    readonly s3ObjectVersion?: string;

    /**
     * If you input your canary script directly into the canary instead of referring to an S3 location, the value of this parameter is the script in plain text.
     *
     * It can be up to 5 MB.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-synthetics-canary-code.html#cfn-synthetics-canary-code-script
     */
    readonly script?: string;

    /**
     * The ARN of the Lambda layer where Synthetics stores the canary script code.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-synthetics-canary-code.html#cfn-synthetics-canary-code-sourcelocationarn
     */
    readonly sourceLocationArn?: string;
  }

  /**
   * This structure specifies how often a canary is to make runs and the date and time when it should stop making runs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-synthetics-canary-schedule.html
   */
  export interface ScheduleProperty {
    /**
     * How long, in seconds, for the canary to continue making regular runs according to the schedule in the `Expression` value.
     *
     * If you specify 0, the canary continues making runs until you stop it. If you omit this field, the default of 0 is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-synthetics-canary-schedule.html#cfn-synthetics-canary-schedule-durationinseconds
     */
    readonly durationInSeconds?: string;

    /**
     * A `rate` expression or a `cron` expression that defines how often the canary is to run.
     *
     * For a rate expression, The syntax is `rate( *number unit* )` . *unit* can be `minute` , `minutes` , or `hour` .
     *
     * For example, `rate(1 minute)` runs the canary once a minute, `rate(10 minutes)` runs it once every 10 minutes, and `rate(1 hour)` runs it once every hour. You can specify a frequency between `rate(1 minute)` and `rate(1 hour)` .
     *
     * Specifying `rate(0 minute)` or `rate(0 hour)` is a special value that causes the canary to run only once when it is started.
     *
     * Use `cron( *expression* )` to specify a cron expression. You can't schedule a canary to wait for more than a year before running. For information about the syntax for cron expressions, see [Scheduling canary runs using cron](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_cron.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-synthetics-canary-schedule.html#cfn-synthetics-canary-schedule-expression
     */
    readonly expression: string;
  }
}

/**
 * Properties for defining a `CfnCanary`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-synthetics-canary.html
 */
export interface CfnCanaryProps {
  /**
   * A structure that contains the configuration for canary artifacts, including the encryption-at-rest settings for artifacts that the canary uploads to Amazon S3.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-synthetics-canary.html#cfn-synthetics-canary-artifactconfig
   */
  readonly artifactConfig?: CfnCanary.ArtifactConfigProperty | cdk.IResolvable;

  /**
   * The location in Amazon S3 where Synthetics stores artifacts from the runs of this canary.
   *
   * Artifacts include the log file, screenshots, and HAR files. Specify the full location path, including `s3://` at the beginning of the path.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-synthetics-canary.html#cfn-synthetics-canary-artifacts3location
   */
  readonly artifactS3Location: string;

  /**
   * Use this structure to input your script code for the canary.
   *
   * This structure contains the Lambda handler with the location where the canary should start running the script. If the script is stored in an S3 bucket, the bucket name, key, and version are also included. If the script is passed into the canary directly, the script code is contained in the value of `Script` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-synthetics-canary.html#cfn-synthetics-canary-code
   */
  readonly code: CfnCanary.CodeProperty | cdk.IResolvable;

  /**
   * Deletes associated lambda resources created by Synthetics if set to True.
   *
   * Default is False
   *
   * @deprecated this property has been deprecated
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-synthetics-canary.html#cfn-synthetics-canary-deletelambdaresourcesoncanarydeletion
   */
  readonly deleteLambdaResourcesOnCanaryDeletion?: boolean | cdk.IResolvable;

  /**
   * The ARN of the IAM role to be used to run the canary.
   *
   * This role must already exist, and must include `lambda.amazonaws.com` as a principal in the trust policy. The role must also have the following permissions:
   *
   * - `s3:PutObject`
   * - `s3:GetBucketLocation`
   * - `s3:ListAllMyBuckets`
   * - `cloudwatch:PutMetricData`
   * - `logs:CreateLogGroup`
   * - `logs:CreateLogStream`
   * - `logs:PutLogEvents`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-synthetics-canary.html#cfn-synthetics-canary-executionrolearn
   */
  readonly executionRoleArn: string;

  /**
   * The number of days to retain data about failed runs of this canary.
   *
   * If you omit this field, the default of 31 days is used. The valid range is 1 to 455 days.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-synthetics-canary.html#cfn-synthetics-canary-failureretentionperiod
   */
  readonly failureRetentionPeriod?: number;

  /**
   * The name for this canary.
   *
   * Be sure to give it a descriptive name that distinguishes it from other canaries in your account.
   *
   * Do not include secrets or proprietary information in your canary names. The canary name makes up part of the canary ARN, and the ARN is included in outbound calls over the internet. For more information, see [Security Considerations for Synthetics Canaries](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/servicelens_canaries_security.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-synthetics-canary.html#cfn-synthetics-canary-name
   */
  readonly name: string;

  /**
   * A structure that contains input information for a canary run.
   *
   * If you omit this structure, the frequency of the canary is used as canary's timeout value, up to a maximum of 900 seconds.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-synthetics-canary.html#cfn-synthetics-canary-runconfig
   */
  readonly runConfig?: cdk.IResolvable | CfnCanary.RunConfigProperty;

  /**
   * Specifies the runtime version to use for the canary.
   *
   * For more information about runtime versions, see [Canary Runtime Versions](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Library.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-synthetics-canary.html#cfn-synthetics-canary-runtimeversion
   */
  readonly runtimeVersion: string;

  /**
   * A structure that contains information about how often the canary is to run, and when these runs are to stop.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-synthetics-canary.html#cfn-synthetics-canary-schedule
   */
  readonly schedule: cdk.IResolvable | CfnCanary.ScheduleProperty;

  /**
   * Specify TRUE to have the canary start making runs immediately after it is created.
   *
   * A canary that you create using CloudFormation can't be used to monitor the CloudFormation stack that creates the canary or to roll back that stack if there is a failure.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-synthetics-canary.html#cfn-synthetics-canary-startcanaryaftercreation
   */
  readonly startCanaryAfterCreation?: boolean | cdk.IResolvable;

  /**
   * The number of days to retain data about successful runs of this canary.
   *
   * If you omit this field, the default of 31 days is used. The valid range is 1 to 455 days.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-synthetics-canary.html#cfn-synthetics-canary-successretentionperiod
   */
  readonly successRetentionPeriod?: number;

  /**
   * The list of key-value pairs that are associated with the canary.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-synthetics-canary.html#cfn-synthetics-canary-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * If this canary performs visual monitoring by comparing screenshots, this structure contains the ID of the canary run to use as the baseline for screenshots, and the coordinates of any parts of the screen to ignore during the visual monitoring comparison.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-synthetics-canary.html#cfn-synthetics-canary-visualreference
   */
  readonly visualReference?: cdk.IResolvable | CfnCanary.VisualReferenceProperty;

  /**
   * If this canary is to test an endpoint in a VPC, this structure contains information about the subnet and security groups of the VPC endpoint.
   *
   * For more information, see [Running a Canary in a VPC](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_VPC.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-synthetics-canary.html#cfn-synthetics-canary-vpcconfig
   */
  readonly vpcConfig?: cdk.IResolvable | CfnCanary.VPCConfigProperty;
}

/**
 * Determine whether the given properties match those of a `BaseScreenshotProperty`
 *
 * @param properties - the TypeScript properties of a `BaseScreenshotProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCanaryBaseScreenshotPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ignoreCoordinates", cdk.listValidator(cdk.validateString))(properties.ignoreCoordinates));
  errors.collect(cdk.propertyValidator("screenshotName", cdk.requiredValidator)(properties.screenshotName));
  errors.collect(cdk.propertyValidator("screenshotName", cdk.validateString)(properties.screenshotName));
  return errors.wrap("supplied properties not correct for \"BaseScreenshotProperty\"");
}

// @ts-ignore TS6133
function convertCfnCanaryBaseScreenshotPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCanaryBaseScreenshotPropertyValidator(properties).assertSuccess();
  return {
    "IgnoreCoordinates": cdk.listMapper(cdk.stringToCloudFormation)(properties.ignoreCoordinates),
    "ScreenshotName": cdk.stringToCloudFormation(properties.screenshotName)
  };
}

// @ts-ignore TS6133
function CfnCanaryBaseScreenshotPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCanary.BaseScreenshotProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCanary.BaseScreenshotProperty>();
  ret.addPropertyResult("ignoreCoordinates", "IgnoreCoordinates", (properties.IgnoreCoordinates != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IgnoreCoordinates) : undefined));
  ret.addPropertyResult("screenshotName", "ScreenshotName", (properties.ScreenshotName != null ? cfn_parse.FromCloudFormation.getString(properties.ScreenshotName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VisualReferenceProperty`
 *
 * @param properties - the TypeScript properties of a `VisualReferenceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCanaryVisualReferencePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("baseCanaryRunId", cdk.requiredValidator)(properties.baseCanaryRunId));
  errors.collect(cdk.propertyValidator("baseCanaryRunId", cdk.validateString)(properties.baseCanaryRunId));
  errors.collect(cdk.propertyValidator("baseScreenshots", cdk.listValidator(CfnCanaryBaseScreenshotPropertyValidator))(properties.baseScreenshots));
  return errors.wrap("supplied properties not correct for \"VisualReferenceProperty\"");
}

// @ts-ignore TS6133
function convertCfnCanaryVisualReferencePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCanaryVisualReferencePropertyValidator(properties).assertSuccess();
  return {
    "BaseCanaryRunId": cdk.stringToCloudFormation(properties.baseCanaryRunId),
    "BaseScreenshots": cdk.listMapper(convertCfnCanaryBaseScreenshotPropertyToCloudFormation)(properties.baseScreenshots)
  };
}

// @ts-ignore TS6133
function CfnCanaryVisualReferencePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCanary.VisualReferenceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCanary.VisualReferenceProperty>();
  ret.addPropertyResult("baseCanaryRunId", "BaseCanaryRunId", (properties.BaseCanaryRunId != null ? cfn_parse.FromCloudFormation.getString(properties.BaseCanaryRunId) : undefined));
  ret.addPropertyResult("baseScreenshots", "BaseScreenshots", (properties.BaseScreenshots != null ? cfn_parse.FromCloudFormation.getArray(CfnCanaryBaseScreenshotPropertyFromCloudFormation)(properties.BaseScreenshots) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3EncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `S3EncryptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCanaryS3EncryptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("encryptionMode", cdk.validateString)(properties.encryptionMode));
  errors.collect(cdk.propertyValidator("kmsKeyArn", cdk.validateString)(properties.kmsKeyArn));
  return errors.wrap("supplied properties not correct for \"S3EncryptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnCanaryS3EncryptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCanaryS3EncryptionPropertyValidator(properties).assertSuccess();
  return {
    "EncryptionMode": cdk.stringToCloudFormation(properties.encryptionMode),
    "KmsKeyArn": cdk.stringToCloudFormation(properties.kmsKeyArn)
  };
}

// @ts-ignore TS6133
function CfnCanaryS3EncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCanary.S3EncryptionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCanary.S3EncryptionProperty>();
  ret.addPropertyResult("encryptionMode", "EncryptionMode", (properties.EncryptionMode != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionMode) : undefined));
  ret.addPropertyResult("kmsKeyArn", "KmsKeyArn", (properties.KmsKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ArtifactConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ArtifactConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCanaryArtifactConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("s3Encryption", CfnCanaryS3EncryptionPropertyValidator)(properties.s3Encryption));
  return errors.wrap("supplied properties not correct for \"ArtifactConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnCanaryArtifactConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCanaryArtifactConfigPropertyValidator(properties).assertSuccess();
  return {
    "S3Encryption": convertCfnCanaryS3EncryptionPropertyToCloudFormation(properties.s3Encryption)
  };
}

// @ts-ignore TS6133
function CfnCanaryArtifactConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCanary.ArtifactConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCanary.ArtifactConfigProperty>();
  ret.addPropertyResult("s3Encryption", "S3Encryption", (properties.S3Encryption != null ? CfnCanaryS3EncryptionPropertyFromCloudFormation(properties.S3Encryption) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VPCConfigProperty`
 *
 * @param properties - the TypeScript properties of a `VPCConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCanaryVPCConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.requiredValidator)(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.requiredValidator)(properties.subnetIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  errors.collect(cdk.propertyValidator("vpcId", cdk.validateString)(properties.vpcId));
  return errors.wrap("supplied properties not correct for \"VPCConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnCanaryVPCConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCanaryVPCConfigPropertyValidator(properties).assertSuccess();
  return {
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds),
    "VpcId": cdk.stringToCloudFormation(properties.vpcId)
  };
}

// @ts-ignore TS6133
function CfnCanaryVPCConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCanary.VPCConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCanary.VPCConfigProperty>();
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addPropertyResult("vpcId", "VpcId", (properties.VpcId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RunConfigProperty`
 *
 * @param properties - the TypeScript properties of a `RunConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCanaryRunConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("activeTracing", cdk.validateBoolean)(properties.activeTracing));
  errors.collect(cdk.propertyValidator("environmentVariables", cdk.hashValidator(cdk.validateString))(properties.environmentVariables));
  errors.collect(cdk.propertyValidator("memoryInMb", cdk.validateNumber)(properties.memoryInMb));
  errors.collect(cdk.propertyValidator("timeoutInSeconds", cdk.validateNumber)(properties.timeoutInSeconds));
  return errors.wrap("supplied properties not correct for \"RunConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnCanaryRunConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCanaryRunConfigPropertyValidator(properties).assertSuccess();
  return {
    "ActiveTracing": cdk.booleanToCloudFormation(properties.activeTracing),
    "EnvironmentVariables": cdk.hashMapper(cdk.stringToCloudFormation)(properties.environmentVariables),
    "MemoryInMB": cdk.numberToCloudFormation(properties.memoryInMb),
    "TimeoutInSeconds": cdk.numberToCloudFormation(properties.timeoutInSeconds)
  };
}

// @ts-ignore TS6133
function CfnCanaryRunConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCanary.RunConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCanary.RunConfigProperty>();
  ret.addPropertyResult("activeTracing", "ActiveTracing", (properties.ActiveTracing != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ActiveTracing) : undefined));
  ret.addPropertyResult("environmentVariables", "EnvironmentVariables", (properties.EnvironmentVariables != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.EnvironmentVariables) : undefined));
  ret.addPropertyResult("memoryInMb", "MemoryInMB", (properties.MemoryInMB != null ? cfn_parse.FromCloudFormation.getNumber(properties.MemoryInMB) : undefined));
  ret.addPropertyResult("timeoutInSeconds", "TimeoutInSeconds", (properties.TimeoutInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutInSeconds) : undefined));
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
function CfnCanaryCodePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("handler", cdk.requiredValidator)(properties.handler));
  errors.collect(cdk.propertyValidator("handler", cdk.validateString)(properties.handler));
  errors.collect(cdk.propertyValidator("s3Bucket", cdk.validateString)(properties.s3Bucket));
  errors.collect(cdk.propertyValidator("s3Key", cdk.validateString)(properties.s3Key));
  errors.collect(cdk.propertyValidator("s3ObjectVersion", cdk.validateString)(properties.s3ObjectVersion));
  errors.collect(cdk.propertyValidator("script", cdk.validateString)(properties.script));
  errors.collect(cdk.propertyValidator("sourceLocationArn", cdk.validateString)(properties.sourceLocationArn));
  return errors.wrap("supplied properties not correct for \"CodeProperty\"");
}

// @ts-ignore TS6133
function convertCfnCanaryCodePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCanaryCodePropertyValidator(properties).assertSuccess();
  return {
    "Handler": cdk.stringToCloudFormation(properties.handler),
    "S3Bucket": cdk.stringToCloudFormation(properties.s3Bucket),
    "S3Key": cdk.stringToCloudFormation(properties.s3Key),
    "S3ObjectVersion": cdk.stringToCloudFormation(properties.s3ObjectVersion),
    "Script": cdk.stringToCloudFormation(properties.script),
    "SourceLocationArn": cdk.stringToCloudFormation(properties.sourceLocationArn)
  };
}

// @ts-ignore TS6133
function CfnCanaryCodePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCanary.CodeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCanary.CodeProperty>();
  ret.addPropertyResult("handler", "Handler", (properties.Handler != null ? cfn_parse.FromCloudFormation.getString(properties.Handler) : undefined));
  ret.addPropertyResult("s3Bucket", "S3Bucket", (properties.S3Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.S3Bucket) : undefined));
  ret.addPropertyResult("s3Key", "S3Key", (properties.S3Key != null ? cfn_parse.FromCloudFormation.getString(properties.S3Key) : undefined));
  ret.addPropertyResult("s3ObjectVersion", "S3ObjectVersion", (properties.S3ObjectVersion != null ? cfn_parse.FromCloudFormation.getString(properties.S3ObjectVersion) : undefined));
  ret.addPropertyResult("script", "Script", (properties.Script != null ? cfn_parse.FromCloudFormation.getString(properties.Script) : undefined));
  ret.addPropertyResult("sourceLocationArn", "SourceLocationArn", (properties.SourceLocationArn != null ? cfn_parse.FromCloudFormation.getString(properties.SourceLocationArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScheduleProperty`
 *
 * @param properties - the TypeScript properties of a `ScheduleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCanarySchedulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("durationInSeconds", cdk.validateString)(properties.durationInSeconds));
  errors.collect(cdk.propertyValidator("expression", cdk.requiredValidator)(properties.expression));
  errors.collect(cdk.propertyValidator("expression", cdk.validateString)(properties.expression));
  return errors.wrap("supplied properties not correct for \"ScheduleProperty\"");
}

// @ts-ignore TS6133
function convertCfnCanarySchedulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCanarySchedulePropertyValidator(properties).assertSuccess();
  return {
    "DurationInSeconds": cdk.stringToCloudFormation(properties.durationInSeconds),
    "Expression": cdk.stringToCloudFormation(properties.expression)
  };
}

// @ts-ignore TS6133
function CfnCanarySchedulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCanary.ScheduleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCanary.ScheduleProperty>();
  ret.addPropertyResult("durationInSeconds", "DurationInSeconds", (properties.DurationInSeconds != null ? cfn_parse.FromCloudFormation.getString(properties.DurationInSeconds) : undefined));
  ret.addPropertyResult("expression", "Expression", (properties.Expression != null ? cfn_parse.FromCloudFormation.getString(properties.Expression) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnCanaryProps`
 *
 * @param properties - the TypeScript properties of a `CfnCanaryProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCanaryPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("artifactConfig", CfnCanaryArtifactConfigPropertyValidator)(properties.artifactConfig));
  errors.collect(cdk.propertyValidator("artifactS3Location", cdk.requiredValidator)(properties.artifactS3Location));
  errors.collect(cdk.propertyValidator("artifactS3Location", cdk.validateString)(properties.artifactS3Location));
  errors.collect(cdk.propertyValidator("code", cdk.requiredValidator)(properties.code));
  errors.collect(cdk.propertyValidator("code", CfnCanaryCodePropertyValidator)(properties.code));
  errors.collect(cdk.propertyValidator("deleteLambdaResourcesOnCanaryDeletion", cdk.validateBoolean)(properties.deleteLambdaResourcesOnCanaryDeletion));
  errors.collect(cdk.propertyValidator("executionRoleArn", cdk.requiredValidator)(properties.executionRoleArn));
  errors.collect(cdk.propertyValidator("executionRoleArn", cdk.validateString)(properties.executionRoleArn));
  errors.collect(cdk.propertyValidator("failureRetentionPeriod", cdk.validateNumber)(properties.failureRetentionPeriod));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("runConfig", CfnCanaryRunConfigPropertyValidator)(properties.runConfig));
  errors.collect(cdk.propertyValidator("runtimeVersion", cdk.requiredValidator)(properties.runtimeVersion));
  errors.collect(cdk.propertyValidator("runtimeVersion", cdk.validateString)(properties.runtimeVersion));
  errors.collect(cdk.propertyValidator("schedule", cdk.requiredValidator)(properties.schedule));
  errors.collect(cdk.propertyValidator("schedule", CfnCanarySchedulePropertyValidator)(properties.schedule));
  errors.collect(cdk.propertyValidator("startCanaryAfterCreation", cdk.validateBoolean)(properties.startCanaryAfterCreation));
  errors.collect(cdk.propertyValidator("successRetentionPeriod", cdk.validateNumber)(properties.successRetentionPeriod));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("vpcConfig", CfnCanaryVPCConfigPropertyValidator)(properties.vpcConfig));
  errors.collect(cdk.propertyValidator("visualReference", CfnCanaryVisualReferencePropertyValidator)(properties.visualReference));
  return errors.wrap("supplied properties not correct for \"CfnCanaryProps\"");
}

// @ts-ignore TS6133
function convertCfnCanaryPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCanaryPropsValidator(properties).assertSuccess();
  return {
    "ArtifactConfig": convertCfnCanaryArtifactConfigPropertyToCloudFormation(properties.artifactConfig),
    "ArtifactS3Location": cdk.stringToCloudFormation(properties.artifactS3Location),
    "Code": convertCfnCanaryCodePropertyToCloudFormation(properties.code),
    "DeleteLambdaResourcesOnCanaryDeletion": cdk.booleanToCloudFormation(properties.deleteLambdaResourcesOnCanaryDeletion),
    "ExecutionRoleArn": cdk.stringToCloudFormation(properties.executionRoleArn),
    "FailureRetentionPeriod": cdk.numberToCloudFormation(properties.failureRetentionPeriod),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RunConfig": convertCfnCanaryRunConfigPropertyToCloudFormation(properties.runConfig),
    "RuntimeVersion": cdk.stringToCloudFormation(properties.runtimeVersion),
    "Schedule": convertCfnCanarySchedulePropertyToCloudFormation(properties.schedule),
    "StartCanaryAfterCreation": cdk.booleanToCloudFormation(properties.startCanaryAfterCreation),
    "SuccessRetentionPeriod": cdk.numberToCloudFormation(properties.successRetentionPeriod),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VPCConfig": convertCfnCanaryVPCConfigPropertyToCloudFormation(properties.vpcConfig),
    "VisualReference": convertCfnCanaryVisualReferencePropertyToCloudFormation(properties.visualReference)
  };
}

// @ts-ignore TS6133
function CfnCanaryPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCanaryProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCanaryProps>();
  ret.addPropertyResult("artifactConfig", "ArtifactConfig", (properties.ArtifactConfig != null ? CfnCanaryArtifactConfigPropertyFromCloudFormation(properties.ArtifactConfig) : undefined));
  ret.addPropertyResult("artifactS3Location", "ArtifactS3Location", (properties.ArtifactS3Location != null ? cfn_parse.FromCloudFormation.getString(properties.ArtifactS3Location) : undefined));
  ret.addPropertyResult("code", "Code", (properties.Code != null ? CfnCanaryCodePropertyFromCloudFormation(properties.Code) : undefined));
  ret.addPropertyResult("deleteLambdaResourcesOnCanaryDeletion", "DeleteLambdaResourcesOnCanaryDeletion", (properties.DeleteLambdaResourcesOnCanaryDeletion != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeleteLambdaResourcesOnCanaryDeletion) : undefined));
  ret.addPropertyResult("executionRoleArn", "ExecutionRoleArn", (properties.ExecutionRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ExecutionRoleArn) : undefined));
  ret.addPropertyResult("failureRetentionPeriod", "FailureRetentionPeriod", (properties.FailureRetentionPeriod != null ? cfn_parse.FromCloudFormation.getNumber(properties.FailureRetentionPeriod) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("runConfig", "RunConfig", (properties.RunConfig != null ? CfnCanaryRunConfigPropertyFromCloudFormation(properties.RunConfig) : undefined));
  ret.addPropertyResult("runtimeVersion", "RuntimeVersion", (properties.RuntimeVersion != null ? cfn_parse.FromCloudFormation.getString(properties.RuntimeVersion) : undefined));
  ret.addPropertyResult("schedule", "Schedule", (properties.Schedule != null ? CfnCanarySchedulePropertyFromCloudFormation(properties.Schedule) : undefined));
  ret.addPropertyResult("startCanaryAfterCreation", "StartCanaryAfterCreation", (properties.StartCanaryAfterCreation != null ? cfn_parse.FromCloudFormation.getBoolean(properties.StartCanaryAfterCreation) : undefined));
  ret.addPropertyResult("successRetentionPeriod", "SuccessRetentionPeriod", (properties.SuccessRetentionPeriod != null ? cfn_parse.FromCloudFormation.getNumber(properties.SuccessRetentionPeriod) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("visualReference", "VisualReference", (properties.VisualReference != null ? CfnCanaryVisualReferencePropertyFromCloudFormation(properties.VisualReference) : undefined));
  ret.addPropertyResult("vpcConfig", "VPCConfig", (properties.VPCConfig != null ? CfnCanaryVPCConfigPropertyFromCloudFormation(properties.VPCConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates or updates a group which you can use to associate canaries with each other, including cross-Region canaries.
 *
 * Using groups can help you with managing and automating your canaries, and you can also view aggregated run results and statistics for all canaries in a group.
 *
 * Groups are global resources. When you create a group, it is replicated across all AWS Regions, and you can add canaries from any Region to it, and view it in any Region. Although the group ARN format reflects the Region name where it was created, a group is not constrained to any Region. This means that you can put canaries from multiple Regions into the same group, and then use that group to view and manage all of those canaries in a single view.
 *
 * Each group can contain as many as 10 canaries. You can have as many as 20 groups in your account. Any single canary can be a member of up to 10 groups.
 *
 * @cloudformationResource AWS::Synthetics::Group
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-synthetics-group.html
 */
export class CfnGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Synthetics::Group";

  /**
   * Build a CfnGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Id of the group.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * A name for the group. It can include any Unicode characters.
   */
  public name: string;

  /**
   * The ARNs of the canaries that you want to associate with this group.
   */
  public resourceArns?: Array<string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The list of key-value pairs that are associated with the group.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnGroupProps) {
    super(scope, id, {
      "type": CfnGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.name = props.name;
    this.resourceArns = props.resourceArns;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Synthetics::Group", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "name": this.name,
      "resourceArns": this.resourceArns,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnGroupPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-synthetics-group.html
 */
export interface CfnGroupProps {
  /**
   * A name for the group. It can include any Unicode characters.
   *
   * The names for all groups in your account, across all Regions, must be unique.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-synthetics-group.html#cfn-synthetics-group-name
   */
  readonly name: string;

  /**
   * The ARNs of the canaries that you want to associate with this group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-synthetics-group.html#cfn-synthetics-group-resourcearns
   */
  readonly resourceArns?: Array<string>;

  /**
   * The list of key-value pairs that are associated with the group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-synthetics-group.html#cfn-synthetics-group-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("resourceArns", cdk.listValidator(cdk.validateString))(properties.resourceArns));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnGroupPropsValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "ResourceArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.resourceArns),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnGroupProps>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("resourceArns", "ResourceArns", (properties.ResourceArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ResourceArns) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}