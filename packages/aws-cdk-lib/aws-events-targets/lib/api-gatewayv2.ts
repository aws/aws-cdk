import { ApiGatewayProps } from './api-gateway';
import { addToDeadLetterQueueResourcePolicy, bindBaseTargetConfig, singletonEventRole } from './util';
import * as apigwv2 from '../../aws-apigatewayv2';
import * as events from '../../aws-events';
import * as iam from '../../aws-iam';

/**
 * Use an API Gateway V2 HTTP APIs as a target for Amazon EventBridge rules.
 */
export class ApiGatewayV2 implements events.IRuleTarget {
  private readonly _httpApi: apigwv2.IHttpApi;

  /**
   * @param httpApi - IHttpApi implementation to use as event target
   * @param props - Properties to configure the APIGateway target
   */
  constructor(httpApi: apigwv2.IHttpApi, private readonly props?: ApiGatewayProps) {
    this._httpApi = httpApi;
  }

  /**
   * Returns the target IHttpApi
   */
  public get iHttpApi(): apigwv2.IHttpApi {
    return this._httpApi;
  }

  /**
   * Returns a RuleTarget that can be used to trigger this API Gateway HTTP APIs
   * as a result from an EventBridge event.
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-use-resource-based.html#eb-api-gateway-permissions
   */
  public bind(rule: events.IRule, _id?: string): events.RuleTargetConfig {
    if (this.props?.deadLetterQueue) {
      addToDeadLetterQueueResourcePolicy(rule, this.props.deadLetterQueue);
    }

    const wildcardCountsInPath = this.props?.path?.match( /\*/g )?.length ?? 0;
    if (wildcardCountsInPath !== (this.props?.pathParameterValues || []).length) {
      throw new Error('The number of wildcards in the path does not match the number of path pathParameterValues.');
    }

    const httpApiArn = this._httpApi.arnForExecuteApi(
      this.props?.method,
      this.props?.path || '/',
      this.props?.stage || this._httpApi.defaultStage?.stageName,
    );

    const role = this.props?.eventRole || singletonEventRole(this._httpApi);
    role.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: [httpApiArn],
      actions: [
        'execute-api:Invoke',
        'execute-api:ManageConnections',
      ],
    }));

    return {
      ...(this.props ? bindBaseTargetConfig(this.props) : {}),
      arn: httpApiArn,
      role,
      deadLetterConfig: this.props?.deadLetterQueue && { arn: this.props.deadLetterQueue?.queueArn },
      input: this.props?.postBody,
      targetResource: this._httpApi,
      httpParameters: {
        headerParameters: this.props?.headerParameters,
        queryStringParameters: this.props?.queryStringParameters,
        pathParameterValues: this.props?.pathParameterValues,
      },
    };
  }
}
