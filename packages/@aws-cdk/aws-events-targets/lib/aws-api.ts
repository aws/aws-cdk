import * as path from 'path';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as SDK from 'aws-sdk';
import { metadata } from './sdk-api-metadata.generated';
import { addLambdaPermission } from './util';

/**
 * AWS SDK service metadata.
 */
export type AwsSdkMetadata = {[key: string]: any};

const awsSdkMetadata: AwsSdkMetadata = metadata;

/**
 * Rule target input for an AwsApi target.
 */
export interface AwsApiInput {
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
   * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html
   *
   * @default - no parameters
   */
  readonly parameters?: any;

  /**
   * The regex pattern to use to catch API errors. The `code` property of the
   * `Error` object will be tested against this pattern. If there is a match an
   * error will not be thrown.
   *
   * @default - do not catch errors
   */
  readonly catchErrorPattern?: string;

  /**
   * API version to use for the service
   *
   * @see https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/locking-api-versions.html
   * @default - use latest available API version
   */
  readonly apiVersion?: string;
}

/**
 * Properties for an AwsApi target.
 */
export interface AwsApiProps extends AwsApiInput {
  /**
   * The IAM policy statement to allow the API call. Use only if
   * resource restriction is needed.
   *
   * @default - extract the permission from the API call
   */
  readonly policyStatement?: iam.PolicyStatement;
}

/**
 * Use an AWS Lambda function that makes API calls as an event rule target.
 */
export class AwsApi implements events.IRuleTarget {
  constructor(private readonly props: AwsApiProps) {}

  /**
   * Returns a RuleTarget that can be used to trigger this AwsApi as a
   * result from an EventBridge event.
   */
  public bind(rule: events.IRule, id?: string): events.RuleTargetConfig {
    const normalizedServiceName = checkServiceAndActionExists(this.props.service, this.props.action);

    const handler = new lambda.SingletonFunction(rule as events.Rule, `${rule.node.id}${id}Handler`, {
      code: lambda.Code.fromAsset(path.join(__dirname, 'aws-api-handler')),
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      uuid: 'b4cf1abd-4e4f-4bc6-9944-1af7ccd9ec37',
      lambdaPurpose: 'AWS',
    });

    if (this.props.policyStatement) {
      handler.addToRolePolicy(this.props.policyStatement);
    } else {
      handler.addToRolePolicy(new iam.PolicyStatement({
        actions: [awsSdkToIamAction(normalizedServiceName, this.props.action)],
        resources: ['*'],
      }));
    }

    // Allow handler to be called from rule
    addLambdaPermission(rule, handler);

    const input: AwsApiInput = {
      service: normalizedServiceName,
      action: this.props.action,
      parameters: this.props.parameters,
      catchErrorPattern: this.props.catchErrorPattern,
      apiVersion: this.props.apiVersion,
    };

    return {
      id: '',
      arn: handler.functionArn,
      input: events.RuleTargetInput.fromObject(input),
      targetResource: handler,
    };
  }
}

/**
 * Transform SDK service/action to IAM action using metadata from aws-sdk module.
 */
function awsSdkToIamAction(service: string, action: string): string {
  const srv = service.toLowerCase();
  const iamService = awsSdkMetadata[srv].prefix || srv;
  const iamAction = action.charAt(0).toUpperCase() + action.slice(1);
  return `${iamService}:${iamAction}`;
}

const sdkDocsUrl = 'https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html';

/**
 * Check that the given service and actions exist in the AWS SDK. If the service name is given in an incorrect case
 * e.g. rds instead of RDS, the normalized service name is returned.
 * @param service Service name
 * @param action Action name
 * @param apiVersion API version
 * @returns Normalized service name
 * @throws {Error} The given service and/or action don't exist
 */
function checkServiceAndActionExists(service: string, action: string, apiVersion?: string): string {
  let sdkService: any;
  let normalizedServiceName: string;

  if ((SDK as any)[service]) {
    sdkService = (SDK as any)[service];
    normalizedServiceName = service;
  } else if ((SDK as any)[service.toUpperCase()]) {
    sdkService = (SDK as any)[service.toUpperCase()];
    normalizedServiceName = service.toUpperCase();
  } else {
    throw new Error(`The service ${service} does not exist, check the list of available services from ${sdkDocsUrl}`);
  }

  const sdkServiceInstance = new sdkService(apiVersion && { apiVersion });
  if (!sdkServiceInstance[action]) {
    throw new Error(`The action ${action} for the service ${service} does not exist, check the list of available \
services and actions from ${sdkDocsUrl}`);
  }

  return normalizedServiceName;
}
