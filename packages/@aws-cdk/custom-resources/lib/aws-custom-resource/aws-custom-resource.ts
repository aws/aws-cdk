import { CustomResource, CustomResourceProvider } from '@aws-cdk/aws-cloudformation';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import * as fs from 'fs';
import * as path from 'path';

// don't use "require" since the typescript compiler emits errors since this
// file is not listed in tsconfig.json.
const metadata = JSON.parse(fs.readFileSync(path.join(__dirname, 'sdk-api-metadata.json'), 'utf-8'));

/**
 * AWS SDK service metadata.
 */
export type AwsSdkMetadata = {[key: string]: any};

const awsSdkMetadata: AwsSdkMetadata = metadata;

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
   * @default - no paramters
   * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html
   */
  readonly parameters?: any;

  /**
   * The physical resource id of the custom resource for this call.
   * Mandatory for onCreate or onUpdate calls.
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
   */
  readonly outputPath?: string;
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
   * The policy to apply to the resource.
   *
   * The custom resource also implements `iam.IGrantable`, making it possible
   * to use the `grantXxx()` methods.
   *
   * As this custom resource uses a singleton Lambda function, it's important
   * to note the that function's role will eventually accumulate the
   * permissions/grants from all resources.
   *
   * @see Policy.fromStatements
   * @see Policy.fromSdkCalls
   */
  readonly policy: AwsCustomResourcePolicy;

  /**
   * The execution role for the Lambda function implementing this custom
   * resource provider. This role will apply to all `AwsCustomResource`
   * instances in the stack. The role must be assumable by the
   * `lambda.amazonaws.com` service principal.
   *
   * @default - a new role is created
   */
  readonly role?: iam.IRole;

  /**
   * The timeout for the Lambda function implementing this custom resource.
   *
   * @default Duration.minutes(2)
   */
  readonly timeout?: cdk.Duration

  /**
   * The number of days log events of the Lambda function implementing
   * this custom resource are kept in CloudWatch Logs.
   *
   * @default logs.RetentionDays.INFINITE
   */
  readonly logRetention?: logs.RetentionDays;
}

/**
 * Defines a custom resource that is materialized using specific AWS API calls.
 *
 * Use this to bridge any gap that might exist in the CloudFormation Coverage.
 * You can specify exactly which calls are invoked for the 'CREATE', 'UPDATE' and 'DELETE' life cycle events.
 *
 */
export class AwsCustomResource extends cdk.Construct implements iam.IGrantable {

  private static breakIgnoreErrorsCircuit(sdkCalls: Array<AwsSdkCall | undefined>, caller: string) {

    for (const call of sdkCalls) {
      if (call?.ignoreErrorCodesMatching) {
        throw new Error(`\`${caller}\`` + ' cannot be called along with `ignoreErrorCodesMatching`.');
      }
    }

  }

  public readonly grantPrincipal: iam.IPrincipal;

  private readonly customResource: CustomResource;
  private readonly props: AwsCustomResourceProps;

  // 'props' cannot be optional, even though all its properties are optional.
  // this is because at least one sdk call must be provided.
  constructor(scope: cdk.Construct, id: string, props: AwsCustomResourceProps) {
    super(scope, id);

    if (!props.onCreate && !props.onUpdate && !props.onDelete) {
      throw new Error('At least `onCreate`, `onUpdate` or `onDelete` must be specified.');
    }

    for (const call of [props.onCreate, props.onUpdate]) {
      if (call && !call.physicalResourceId) {
        throw new Error('`physicalResourceId` must be specified for onCreate and onUpdate calls.');
      }
    }

    for (const call of [props.onCreate, props.onUpdate, props.onDelete]) {
      if (call?.physicalResourceId?.responsePath) {
        AwsCustomResource.breakIgnoreErrorsCircuit([call], 'PhysicalResourceId.fromResponse');
      }
    }

    this.props = props;

    const provider = new lambda.SingletonFunction(this, 'Provider', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'runtime')),
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      uuid: '679f53fa-c002-430c-b0da-5b7982bd2287',
      lambdaPurpose: 'AWS',
      timeout: props.timeout || cdk.Duration.minutes(2),
      role: props.role,
      logRetention: props.logRetention,
    });
    this.grantPrincipal = provider.grantPrincipal;

    if (props.policy.statements.length !== 0) {
      // Use custom statements provided by the user
      for (const statement of props.policy.statements) {
        provider.addToRolePolicy(statement);
      }
    } else {
      // Derive statements from AWS SDK calls
      for (const call of [props.onCreate, props.onUpdate, props.onDelete]) {
        if (call) {
          provider.addToRolePolicy(new iam.PolicyStatement({
            actions: [awsSdkToIamAction(call.service, call.action)],
            resources: props.policy.resources
          }));
        }
      }

    }

    const create = props.onCreate || props.onUpdate;
    this.customResource = new CustomResource(this, 'Resource', {
      resourceType: props.resourceType || 'Custom::AWS',
      provider: CustomResourceProvider.fromLambda(provider),
      properties: {
        create: create && encodeBooleans(create),
        update: props.onUpdate && encodeBooleans(props.onUpdate),
        delete: props.onDelete && encodeBooleans(props.onDelete)
      }
    });
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

}

/**
 * Transform SDK service/action to IAM action using metadata from aws-sdk module.
 * Example: CloudWatchLogs with putRetentionPolicy => logs:PutRetentionPolicy
 *
 * TODO: is this mapping correct for all services?
 */
function awsSdkToIamAction(service: string, action: string): string {
  const srv = service.toLowerCase();
  const iamService = (awsSdkMetadata[srv] && awsSdkMetadata[srv].prefix) || srv;
  const iamAction = action.charAt(0).toUpperCase() + action.slice(1);
  return `${iamService}:${iamAction}`;
}

/**
 * Encodes booleans as special strings
 */
function encodeBooleans(object: object) {
  return JSON.parse(JSON.stringify(object), (_k, v) => {
    switch (v) {
      case true:
        return 'TRUE:BOOLEAN';
      case false:
        return 'FALSE:BOOLEAN';
      default:
        return v;
    }
  });
}
