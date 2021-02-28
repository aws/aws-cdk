import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Construct } from 'constructs';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';
import { AuthType, BaseInvokeApiGatewayApiProps } from './base-types';

/**
 * Base ApiGateway Invoke Task
 * @internal
 */
export abstract class BaseInvokeApiGatewayApi extends sfn.TaskStateBase {
  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
  ];

  private readonly baseProps: BaseInvokeApiGatewayApiProps;
  private readonly integrationPattern: sfn.IntegrationPattern;

  protected abstract readonly apiEndpoint: string;
  protected abstract readonly arnForExecuteApi: string;
  protected abstract readonly stageName?: string;

  constructor(scope: Construct, id: string, props: BaseInvokeApiGatewayApiProps) {
    super(scope, id, props);

    this.baseProps = props;
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;
    validatePatternSupported(this.integrationPattern, BaseInvokeApiGatewayApi.SUPPORTED_INTEGRATION_PATTERNS);
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
        Path: this.baseProps.path,
        QueryParameters: this.baseProps.queryParameters?.value,
        RequestBody: this.baseProps.requestBody?.value,
        AuthType: this.baseProps.authType ? this.baseProps.authType : 'NO_AUTH',
      }),
    };
  }

  protected createPolicyStatements(): iam.PolicyStatement[] {
    if (this.baseProps.authType === AuthType.IAM_ROLE) {
      return [
        new iam.PolicyStatement({
          resources: [this.arnForExecuteApi],
          actions: ['ExecuteAPI:Invoke'],
        }),
      ];
    } else if (this.baseProps.authType === AuthType.RESOURCE_POLICY) {
      if (!sfn.FieldUtils.containsTaskToken(this.baseProps.headers)) {
        throw new Error('Task Token is required in `headers` Use JsonPath.taskToken to set the token.');
      }
      return [
        new iam.PolicyStatement({
          resources: [this.arnForExecuteApi],
          actions: ['ExecuteAPI:Invoke'],
          conditions: {
            StringEquals: {
              'aws:SourceArn': '*',
            },
          },
        }),
      ];
    }
    return [];
  }
}
