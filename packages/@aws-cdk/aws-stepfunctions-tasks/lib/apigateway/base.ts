import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Construct } from 'constructs';
import { AuthType, CallApiGatewayEndpointBaseProps } from './base-types';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * Base CallApiGatewayEndpoint Task
 * @internal
 */
export abstract class CallApiGatewayEndpointBase extends sfn.TaskStateBase {
  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
  ];

  private readonly baseProps: CallApiGatewayEndpointBaseProps;
  private readonly integrationPattern: sfn.IntegrationPattern;

  protected abstract readonly apiEndpoint: string;
  protected abstract readonly arnForExecuteApi: string;
  protected abstract readonly stageName?: string;

  constructor(scope: Construct, id: string, props: CallApiGatewayEndpointBaseProps) {
    super(scope, id, props);

    this.baseProps = props;
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;
    validatePatternSupported(this.integrationPattern, CallApiGatewayEndpointBase.SUPPORTED_INTEGRATION_PATTERNS);

    if (this.integrationPattern === sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN) {
      if (!sfn.FieldUtils.containsTaskToken(this.baseProps.headers)) {
        throw new Error('Task Token is required in `headers` for WAIT_FOR_TASK_TOKEN pattern. Use JsonPath.taskToken to set the token.');
      }
    }
  }

  /**
   * @internal
   */
  protected _renderTask() {
    return {
      Resource: integrationResourceArn('apigateway', 'invoke', this.integrationPattern),
      Parameters: sfn.FieldUtils.renderObject({
        ApiEndpoint: this.apiEndpoint,
        Method: this.baseProps.method,
        Headers: this.baseProps.headers?.value,
        Stage: this.stageName,
        Path: this.baseProps.apiPath,
        QueryParameters: this.baseProps.queryParameters?.value,
        RequestBody: this.baseProps.requestBody?.value,
        AuthType: this.baseProps.authType ? this.baseProps.authType : 'NO_AUTH',
      }),
    };
  }

  protected createPolicyStatements(): iam.PolicyStatement[] {
    if (this.baseProps.authType === AuthType.NO_AUTH) {
      return [];
    }

    return [
      new iam.PolicyStatement({
        resources: [this.arnForExecuteApi],
        actions: ['execute-api:Invoke'],
      }),
    ];
  }
}
