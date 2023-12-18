import { metadata } from './sdk-api-metadata.generated';
import { addLambdaPermission } from './util';
import * as events from '../../aws-events';
import * as iam from '../../aws-iam';
import * as lambda from '../../aws-lambda';
import { Annotations, Duration } from '../../core';
import { AwsApiSingletonFunction } from '../../custom-resource-handlers/dist/aws-events-targets/aws-api-provider.generated';

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
   * @deprecated the handler code was migrated to AWS SDK for JavaScript v3, which does not support this feature anymore
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
    const handler = new AwsApiSingletonFunction(rule as events.Rule, `${rule.node.id}${id}Handler`, {
      timeout: Duration.seconds(60),
      memorySize: 256,
      uuid: 'b4cf1abd-4e4f-4bc6-9944-1af7ccd9ec37',
      lambdaPurpose: 'AWS',
    });

    checkServiceExists(this.props.service, handler);

    if (this.props.policyStatement) {
      handler.addToRolePolicy(this.props.policyStatement);
    } else {
      handler.addToRolePolicy(new iam.PolicyStatement({
        actions: [awsSdkToIamAction(this.props.service, this.props.action)],
        resources: ['*'],
      }));
    }

    // Allow handler to be called from rule
    addLambdaPermission(rule, handler);

    const input: AwsApiInput = {
      service: this.props.service,
      action: this.props.action,
      parameters: this.props.parameters,
      catchErrorPattern: this.props.catchErrorPattern,
      apiVersion: this.props.apiVersion,
    };

    return {
      arn: handler.functionArn,
      input: events.RuleTargetInput.fromObject(input),
      targetResource: handler,
    };
  }
}

/**
 * Check if the given service exists in the AWS SDK. If not, a warning will be raised.
 * @param service Service name
 */
function checkServiceExists(service: string, handler: lambda.SingletonFunction) {
  const sdkService = awsSdkMetadata[service.toLowerCase()];
  if (!sdkService) {
    Annotations.of(handler).addWarningV2(`@aws-cdk/aws-events-targets:${service}DoesNotExist`, `Service ${service} does not exist in the AWS SDK. Check the list of available \
services and actions from https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html`);
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
