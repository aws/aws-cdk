import * as fs from 'fs';
import * as path from 'path';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import { Annotations } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { Construct } from 'constructs';
import { PHYSICAL_RESOURCE_ID_REFERENCE } from './runtime';

/**
 * Reference to the physical resource id that can be passed to the AWS operation as a parameter.
 */
export class PhysicalResourceIdReference implements cdk.IResolvable {
  public readonly creationStack: string[] = cdk.captureStackTrace();

  /**
   * toJSON serialization to replace `PhysicalResourceIdReference` with a magic string.
   */
  public toJSON() {
    return PHYSICAL_RESOURCE_ID_REFERENCE;
  }

  public resolve(_: cdk.IResolveContext): any {
    return PHYSICAL_RESOURCE_ID_REFERENCE;
  }

  public toString(): string {
    return PHYSICAL_RESOURCE_ID_REFERENCE;
  }
}

/**
 * Physical ID of the custom resource.
 */
export class PhysicalResourceId {

  /**
   * Extract the physical resource id from the path (dot notation) to the data in the API call response.
   */
  public static fromResponse(responsePath: string): PhysicalResourceId {
    return new PhysicalResourceId(responsePath, undefined);
  }

  /**
   * Explicit physical resource id.
   */
  public static of(id: string): PhysicalResourceId {
    return new PhysicalResourceId(undefined, id);
  }

  /**
   * @param responsePath Path to a response data element to be used as the physical id.
   * @param id Literal string to be used as the physical id.
   */
  private constructor(public readonly responsePath?: string, public readonly id?: string) { }
}

/**
 * An AWS SDK call.
 */
export interface AwsSdkCall {
  /**
   * The service to call
   *
   * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html
   */
  readonly service: string;

  /**
   * The service action to call
   *
   * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html
   */
  readonly action: string;

  /**
   * The parameters for the service action
   *
   * @default - no parameters
   * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html
   */
  readonly parameters?: any;

  /**
   * The physical resource id of the custom resource for this call.
   * Mandatory for onCreate call.
   * In onUpdate, you can omit this to passthrough it from request.
   *
   * @default - no physical resource id
   */
  readonly physicalResourceId?: PhysicalResourceId;

  /**
   * The regex pattern to use to catch API errors. The `code` property of the
   * `Error` object will be tested against this pattern. If there is a match an
   * error will not be thrown.
   *
   * @default - do not catch errors
   */
  readonly ignoreErrorCodesMatching?: string;

  /**
   * API version to use for the service
   *
   * @see https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/locking-api-versions.html
   * @default - use latest available API version
   */
  readonly apiVersion?: string;

  /**
   * The region to send service requests to.
   * **Note: Cross-region operations are generally considered an anti-pattern.**
   * **Consider first deploying a stack in that region.**
   *
   * @default - the region where this custom resource is deployed
   */
  readonly region?: string;

  /**
   * Restrict the data returned by the custom resource to a specific path in
   * the API response. Use this to limit the data returned by the custom
   * resource if working with API calls that could potentially result in custom
   * response objects exceeding the hard limit of 4096 bytes.
   *
   * Example for ECS / updateService: 'service.deploymentConfiguration.maximumPercent'
   *
   * @default - return all data
   *
   * @deprecated use outputPaths instead
   */
  readonly outputPath?: string;

  /**
   * Restrict the data returned by the custom resource to specific paths in
   * the API response. Use this to limit the data returned by the custom
   * resource if working with API calls that could potentially result in custom
   * response objects exceeding the hard limit of 4096 bytes.
   *
   * Example for ECS / updateService: ['service.deploymentConfiguration.maximumPercent']
   *
   * @default - return all data
   */
  readonly outputPaths?: string[];

  /**
   * Used for running the SDK calls in underlying lambda with a different role
   * Can be used primarily for cross-account requests to for example connect
   * hostedzone with a shared vpc
   *
   * Example for Route53 / associateVPCWithHostedZone
   *
   * @default - run without assuming role
   */
  readonly assumedRoleArn?: string;
}

/**
 * Options for the auto-generation of policies based on the configured SDK calls.
 */
export interface SdkCallsPolicyOptions {

  /**
   * The resources that the calls will have access to.
   *
   * It is best to use specific resource ARN's when possible. However, you can also use `AwsCustomResourcePolicy.ANY_RESOURCE`
   * to allow access to all resources. For example, when `onCreate` is used to create a resource which you don't
   * know the physical name of in advance.
   *
   * Note that will apply to ALL SDK calls.
   */
  readonly resources: string[]

}

/**
 * The IAM Policy that will be applied to the different calls.
 */
export class AwsCustomResourcePolicy {

  /**
   * Use this constant to configure access to any resource.
   */
  public static readonly ANY_RESOURCE = ['*'];

  /**
   * Explicit IAM Policy Statements.
   *
   * @param statements the statements to propagate to the SDK calls.
   */
  public static fromStatements(statements: iam.PolicyStatement[]) {
    return new AwsCustomResourcePolicy(statements, undefined);
  }

  /**
   * Generate IAM Policy Statements from the configured SDK calls.
   *
   * Each SDK call with be translated to an IAM Policy Statement in the form of: `call.service:call.action` (e.g `s3:PutObject`).
   *
   * This policy generator assumes the IAM policy name has the same name as the API
   * call. This is true in 99% of cases, but there are exceptions (for example,
   * S3's `PutBucketLifecycleConfiguration` requires
   * `s3:PutLifecycleConfiguration` permissions, Lambda's `Invoke` requires
   * `lambda:InvokeFunction` permissions). Use `fromStatements` if you want to
   * do a call that requires different IAM action names.
   *
   * @param options options for the policy generation
   */
  public static fromSdkCalls(options: SdkCallsPolicyOptions) {
    return new AwsCustomResourcePolicy([], options.resources);
  }

  /**
   * @param statements statements for explicit policy.
   * @param resources resources for auto-generated from SDK calls.
   */
  private constructor(public readonly statements: iam.PolicyStatement[], public readonly resources?: string[]) {}
}

/**
 * Properties for AwsCustomResource.
 *
 * Note that at least onCreate, onUpdate or onDelete must be specified.
 */
export interface AwsCustomResourceProps {
  /**
   * Cloudformation Resource type.
   *
   * @default - Custom::AWS
   */
  readonly resourceType?: string;

  /**
   * The AWS SDK call to make when the resource is created.
   *
   * @default - the call when the resource is updated
   */
  readonly onCreate?: AwsSdkCall;

  /**
   * The AWS SDK call to make when the resource is updated
   *
   * @default - no call
   */
  readonly onUpdate?: AwsSdkCall;

  /**
   * The AWS SDK call to make when the resource is deleted
   *
   * @default - no call
   */
  readonly onDelete?: AwsSdkCall;

  /**
   * The policy that will be added to the execution role of the Lambda
   * function implementing this custom resource provider.
   *
   * The custom resource also implements `iam.IGrantable`, making it possible
   * to use the `grantXxx()` methods.
   *
   * As this custom resource uses a singleton Lambda function, it's important
   * to note the that function's role will eventually accumulate the
   * permissions/grants from all resources.
   *
   * Note that a policy must be specified if `role` is not provided, as
   * by default a new role is created which requires policy changes to access
   * resources.
   *
   * @default - no policy added
   *
   * @see Policy.fromStatements
   * @see Policy.fromSdkCalls
   */
  readonly policy?: AwsCustomResourcePolicy;

  /**
   * The execution role for the singleton Lambda function implementing this custom
   * resource provider. This role will apply to all `AwsCustomResource`
   * instances in the stack. The role must be assumable by the
   * `lambda.amazonaws.com` service principal.
   *
   * @default - a new role is created
   */
  readonly role?: iam.IRole;

  /**
   * The timeout for the singleton Lambda function implementing this custom resource.
   *
   * @default Duration.minutes(2)
   */
  readonly timeout?: cdk.Duration

  /**
   * The number of days log events of the singleton Lambda function implementing
   * this custom resource are kept in CloudWatch Logs.
   *
   * @default logs.RetentionDays.INFINITE
   */
  readonly logRetention?: logs.RetentionDays;

  /**
   * Whether to install the latest AWS SDK v2.
   *
   * If not specified, this uses whatever JavaScript SDK version is the default in
   * AWS Lambda at the time of execution.
   *
   * Otherwise, installs the latest version from 'npmjs.com'. The installation takes
   * around 60 seconds and requires internet connectivity.
   *
   * The default can be controlled using the context key
   * `@aws-cdk/customresources:installLatestAwsSdkDefault` is.
   *
   * @default - The value of `@aws-cdk/customresources:installLatestAwsSdkDefault`, otherwise `true`
   */
  readonly installLatestAwsSdk?: boolean;

  /**
   * A name for the singleton Lambda function implementing this custom resource.
   * The function name will remain the same after the first AwsCustomResource is created in a stack.
   *
   * @default - AWS CloudFormation generates a unique physical ID and uses that
   * ID for the function's name. For more information, see Name Type.
   */
  readonly functionName?: string;

  /**
   * The vpc to provision the lambda function in.
   *
   * @default - the function is not provisioned inside a vpc.
   */
  readonly vpc?: ec2.IVpc;

  /**
   * Which subnets from the VPC to place the lambda function in.
   *
   * Only used if 'vpc' is supplied. Note: internet access for Lambdas
   * requires a NAT gateway, so picking Public subnets is not allowed.
   *
   * @default - the Vpc default strategy if not specified
   */
  readonly vpcSubnets?: ec2.SubnetSelection;
}

/**
 * Defines a custom resource that is materialized using specific AWS API calls. These calls are created using
 * a singleton Lambda function.
 *
 * Use this to bridge any gap that might exist in the CloudFormation Coverage.
 * You can specify exactly which calls are invoked for the 'CREATE', 'UPDATE' and 'DELETE' life cycle events.
 *
 */
export class AwsCustomResource extends Construct implements iam.IGrantable {
  /**
   * The uuid of the custom resource provider singleton lambda function.
   */
  public static readonly PROVIDER_FUNCTION_UUID = '679f53fa-c002-430c-b0da-5b7982bd2287';

  private static breakIgnoreErrorsCircuit(sdkCalls: Array<AwsSdkCall | undefined>, caller: string) {

    for (const call of sdkCalls) {
      if (call?.ignoreErrorCodesMatching) {
        throw new Error(`\`${caller}\`` + ' cannot be called along with `ignoreErrorCodesMatching`.');
      }
    }

  }

  public readonly grantPrincipal: iam.IPrincipal;

  private readonly customResource: cdk.CustomResource;
  private readonly props: AwsCustomResourceProps;

  // 'props' cannot be optional, even though all its properties are optional.
  // this is because at least one sdk call must be provided.
  constructor(scope: Construct, id: string, props: AwsCustomResourceProps) {
    super(scope, id);

    if (!props.onCreate && !props.onUpdate && !props.onDelete) {
      throw new Error('At least `onCreate`, `onUpdate` or `onDelete` must be specified.');
    }

    if (!props.role && !props.policy) {
      throw new Error('At least one of `policy` or `role` (or both) must be specified.');
    }

    if (props.onCreate && !props.onCreate.physicalResourceId) {
      throw new Error("'physicalResourceId' must be specified for 'onCreate' call.");
    }

    if (!props.onCreate && props.onUpdate && !props.onUpdate.physicalResourceId) {
      throw new Error("'physicalResourceId' must be specified for 'onUpdate' call when 'onCreate' is omitted.");
    }

    for (const call of [props.onCreate, props.onUpdate, props.onDelete]) {
      if (call?.physicalResourceId?.responsePath) {
        AwsCustomResource.breakIgnoreErrorsCircuit([call], 'PhysicalResourceId.fromResponse');
      }
    }

    if (includesPhysicalResourceIdRef(props.onCreate?.parameters)) {
      throw new Error('`PhysicalResourceIdReference` must not be specified in `onCreate` parameters.');
    }

    this.props = props;

    const provider = new lambda.SingletonFunction(this, 'Provider', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'runtime'), {
        exclude: ['*.ts'],
      }),
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      uuid: AwsCustomResource.PROVIDER_FUNCTION_UUID,
      lambdaPurpose: 'AWS',
      timeout: props.timeout || cdk.Duration.minutes(2),
      role: props.role,
      logRetention: props.logRetention,
      functionName: props.functionName,
      vpc: props.vpc,
      vpcSubnets: props.vpcSubnets,
    });
    this.grantPrincipal = provider.grantPrincipal;

    const installLatestAwsSdk = (props.installLatestAwsSdk
      ?? this.node.tryGetContext(cxapi.AWS_CUSTOM_RESOURCE_LATEST_SDK_DEFAULT)
      ?? true);

    if (installLatestAwsSdk && props.installLatestAwsSdk === undefined) {
      // This is dangerous. Add a warning.
      Annotations.of(this).addWarning([
        'installLatestAwsSdk was not specified, and defaults to true. You probably do not want this.',
        `Set the global context flag \'${cxapi.AWS_CUSTOM_RESOURCE_LATEST_SDK_DEFAULT}\' to false to switch this behavior off project-wide,`,
        'or set the property explicitly to true if you know you need to call APIs that are not in Lambda\'s built-in SDK version.',
      ].join(' '));
    }

    const create = props.onCreate || props.onUpdate;
    this.customResource = new cdk.CustomResource(this, 'Resource', {
      resourceType: props.resourceType || 'Custom::AWS',
      serviceToken: provider.functionArn,
      pascalCaseProperties: true,
      properties: {
        create: create && this.encodeJson(create),
        update: props.onUpdate && this.encodeJson(props.onUpdate),
        delete: props.onDelete && this.encodeJson(props.onDelete),
        installLatestAwsSdk,
      },
    });

    // Create the policy statements for the custom resource function role, or use the user-provided ones
    if (props.policy) {
      const statements = [];
      if (props.policy.statements.length !== 0) {
        // Use custom statements provided by the user
        for (const statement of props.policy.statements) {
          statements.push(statement);
        }
      } else {
        // Derive statements from AWS SDK calls
        for (const call of [props.onCreate, props.onUpdate, props.onDelete]) {
          if (call && call.assumedRoleArn == null) {
            const statement = new iam.PolicyStatement({
              actions: [awsSdkToIamAction(call.service, call.action)],
              resources: props.policy.resources,
            });
            statements.push(statement);
          } else if (call && call.assumedRoleArn != null) {
            const statement = new iam.PolicyStatement({
              actions: ['sts:AssumeRole'],
              resources: [call.assumedRoleArn],
            });
            statements.push(statement);
          }
        }
      }
      const policy = new iam.Policy(this, 'CustomResourcePolicy', {
        statements: statements,
      });
      if (provider.role !== undefined) {
        policy.attachToRole(provider.role);
      }

      // If the policy was deleted first, then the function might lose permissions to delete the custom resource
      // This is here so that the policy doesn't get removed before onDelete is called
      this.customResource.node.addDependency(policy);
    }
  }

  /**
   * Returns response data for the AWS SDK call.
   *
   * Example for S3 / listBucket : 'Buckets.0.Name'
   *
   * Use `Token.asXxx` to encode the returned `Reference` as a specific type or
   * use the convenience `getDataString` for string attributes.
   *
   * Note that you cannot use this method if `ignoreErrorCodesMatching`
   * is configured for any of the SDK calls. This is because in such a case,
   * the response data might not exist, and will cause a CloudFormation deploy time error.
   *
   * @param dataPath the path to the data
   */
  public getResponseFieldReference(dataPath: string) {
    AwsCustomResource.breakIgnoreErrorsCircuit([this.props.onCreate, this.props.onUpdate], 'getData');
    return this.customResource.getAtt(dataPath);
  }

  /**
   * Returns response data for the AWS SDK call as string.
   *
   * Example for S3 / listBucket : 'Buckets.0.Name'
   *
   * Note that you cannot use this method if `ignoreErrorCodesMatching`
   * is configured for any of the SDK calls. This is because in such a case,
   * the response data might not exist, and will cause a CloudFormation deploy time error.
   *
   * @param dataPath the path to the data
   */
  public getResponseField(dataPath: string): string {
    AwsCustomResource.breakIgnoreErrorsCircuit([this.props.onCreate, this.props.onUpdate], 'getDataString');
    return this.customResource.getAttString(dataPath);
  }

  private encodeJson(obj: any) {
    return cdk.Lazy.uncachedString({ produce: () => cdk.Stack.of(this).toJsonString(obj) });
  }
}

/**
 * AWS SDK service metadata.
 */
export type AwsSdkMetadata = {[key: string]: any};

/**
 * Gets awsSdkMetaData from file or from cache
 */
let getAwsSdkMetadata = (() => {
  let _awsSdkMetadata: AwsSdkMetadata;
  return function () {
    if (_awsSdkMetadata) {
      return _awsSdkMetadata;
    } else {
      return _awsSdkMetadata = JSON.parse(fs.readFileSync(path.join(__dirname, 'sdk-api-metadata.json'), 'utf-8'));
    }
  };
})();

/**
 * Returns true if `obj` includes a `PhysicalResourceIdReference` in one of the
 * values.
 * @param obj Any object.
 */
function includesPhysicalResourceIdRef(obj: any | undefined) {
  if (obj === undefined) {
    return false;
  }

  let foundRef = false;

  // we use JSON.stringify as a way to traverse all values in the object.
  JSON.stringify(obj, (_, v) => {
    if (v === PHYSICAL_RESOURCE_ID_REFERENCE) {
      foundRef = true;
    }

    return v;
  });

  return foundRef;
}

/**
 * Transform SDK service/action to IAM action using metadata from aws-sdk module.
 * Example: CloudWatchLogs with putRetentionPolicy => logs:PutRetentionPolicy
 *
 * TODO: is this mapping correct for all services?
 */
function awsSdkToIamAction(service: string, action: string): string {
  const srv = service.toLowerCase();
  const awsSdkMetadata = getAwsSdkMetadata();
  const iamService = (awsSdkMetadata[srv] && awsSdkMetadata[srv].prefix) || srv;
  const iamAction = action.charAt(0).toUpperCase() + action.slice(1);
  return `${iamService}:${iamAction}`;
}
