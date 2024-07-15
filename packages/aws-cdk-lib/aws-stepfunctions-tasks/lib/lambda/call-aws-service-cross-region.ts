import { Construct } from 'constructs';
import * as iam from '../../../aws-iam';
import { IFunction } from '../../../aws-lambda';
import * as sfn from '../../../aws-stepfunctions';
import { Token, Duration } from '../../../core';
import { CrossRegionAwsSdkSingletonFunction } from '../../../custom-resource-handlers/dist/aws-stepfunctions-tasks/cross-region-aws-sdk-provider.generated';

/**
 * Properties for calling an AWS service's API action from your
 * state machine across regions.
 */
export interface CallAwsServiceCrossRegionProps extends sfn.TaskStateBaseProps {
  /**
   * The AWS service to call in AWS SDK for JavaScript v3 format.
   *
   * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/
   * @example 's3'
   */
  readonly service: string;

  /**
   * The API action to call.
   *
   * Use camelCase.
   */
  readonly action: string;

  /**
   * Parameters for the API action call in AWS SDK for JavaScript v3 format.
   *
   * @default - no parameters
   */
  readonly parameters?: { [key: string]: any };

  /**
   * The resources for the IAM statement that will be added to the Lambda
   * function role's policy to allow the state machine to make the API call.
   */
  readonly iamResources: string[];

  /**
   * The action for the IAM statement that will be added to the Lambda
   * function role's policy to allow the state machine to make the API call.
   *
   * By default the action for this IAM statement will be `service:action`.
   *
   * Use in the case where the IAM action name does not match with the
   * API service/action name, e.g. `s3:ListBuckets` requires `s3:ListAllMyBuckets`.
   *
   * @default - service:action
   */
  readonly iamAction?: string;

  /**
   * Additional IAM statements that will be added to the state machine
   * role's policy.
   *
   * Use in the case where the call requires more than a single statement to
   * be executed, e.g. `rekognition:detectLabels` requires also S3 permissions
   * to read the object on which it must act.
   *
   * @default - no additional statements are added
   */
  readonly additionalIamStatements?: iam.PolicyStatement[];

  /**
   * The AWS region to call this AWS API for.
   * @example 'us-east-1'
   */
  readonly region: string;

  /**
   * The AWS API endpoint.
   *
   * @default Do not override API endpoint.
   */
  readonly endpoint?: string;

  /**
   * Whether to retry on the backend Lambda service exceptions.
   *
   * This handles `Lambda.ServiceException`, `Lambda.AWSLambdaException`,
   * `Lambda.SdkClientException`, and `Lambda.ClientExecutionTimeoutException`
   * with an interval of 2 seconds, a back-off rate
   * of 2 and 6 maximum attempts.
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/bp-lambda-serviceexception.html
   *
   * @default true
   */
  readonly retryOnServiceExceptions?: boolean;
}

/**
 * A Step Functions task to call an AWS service API across regions.
 *
 * This task creates a Lambda function to call cross-region AWS API and invokes it.
 */
export class CallAwsServiceCrossRegion extends sfn.TaskStateBase {
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];
  protected readonly lambdaFunction: IFunction;

  constructor(scope: Construct, id: string, private readonly props: CallAwsServiceCrossRegionProps) {
    super(scope, id, props);

    if (props.integrationPattern === sfn.IntegrationPattern.RUN_JOB) {
      throw new Error('The RUN_JOB integration pattern is not supported for CallAwsService');
    }
    if (!Token.isUnresolved(props.action) && !props.action.startsWith(props.action[0]?.toLowerCase())) {
      throw new Error(`action must be camelCase, got: ${props.action}`);
    }

    // props.service expects a service name in the AWS SDK for JavaScript v3 format.
    // In some services, this format differs from the one used in IAM.
    // We try to automatically convert those formats here (not exhaustive though).
    // Users can set iamAction property to override IAM service name if necessary.
    const iamServiceMap: Record<string, string> = {
      'sfn': 'states',
      'cloudwatch-logs': 'logs',
      'mwaa': 'airflow',
    };
    const iamService = iamServiceMap[props.service] ?? props.service;

    this.lambdaFunction = new CrossRegionAwsSdkSingletonFunction(this, 'Handler', {
      uuid: '8a0c93f3-dbef-4b71-ac13-7aaf2048ce7e',
      lambdaPurpose: 'CrossRegionAwsSdk',
      timeout: Duration.seconds(30),
    });

    [
      new iam.PolicyStatement({
        resources: props.iamResources,
        // The prefix and the action name are case insensitive
        // https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_action.html
        actions: [props.iamAction ?? `${iamService}:${props.action}`],
      }),
      ...(props.additionalIamStatements ?? []),
    ].forEach((policy) => this.lambdaFunction.addToRolePolicy(policy));

    this.taskPolicies = [
      new iam.PolicyStatement({
        resources: this.lambdaFunction.resourceArnsForGrantInvoke,
        actions: ['lambda:InvokeFunction'],
      }),
    ];

    if (props.retryOnServiceExceptions ?? true) {
      // Best practice from https://docs.aws.amazon.com/step-functions/latest/dg/bp-lambda-serviceexception.html
      this.addRetry({
        errors: ['Lambda.ClientExecutionTimeoutException', 'Lambda.ServiceException', 'Lambda.AWSLambdaException', 'Lambda.SdkClientException'],
        interval: Duration.seconds(2),
        maxAttempts: 6,
        backoffRate: 2,
      });
    }
  }

  /**
   * Provides the Lambda Invoke service integration task configuration
   *
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: this.lambdaFunction.functionArn,
      Parameters: sfn.FieldUtils.renderObject({
        region: this.props.region,
        endpoint: this.props.endpoint,
        action: this.props.action,
        service: this.props.service,
        parameters: this.props.parameters,
      }),
    };
  }
}
