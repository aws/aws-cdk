import { addToDeadLetterQueueResourcePolicy, bindBaseTargetConfig, singletonEventRole, TargetBaseProps } from './util';
import * as api from '../../aws-apigateway';
import * as events from '../../aws-events';
import * as iam from '../../aws-iam';

/**
 * Customize the API Gateway Event Target
 */
export interface ApiGatewayProps extends TargetBaseProps {

  /**
   * The method for api resource invoked by the rule.
   *
   * @default '*' that treated as ANY
   */
  readonly method?: string;

  /**
   * The api resource invoked by the rule.
   * We can use wildcards('*') to specify the path. In that case,
   * an equal number of real values must be specified for pathParameterValues.
   *
   * @default '/'
   */
  readonly path?: string;

  /**
   * The deploy stage of api gateway invoked by the rule.
   *
   * @default the value of deploymentStage.stageName of target api gateway.
   */
  readonly stage?: string;

  /**
   * The headers to be set when requesting API
   *
   * @default no header parameters
   */
  readonly headerParameters?: { [key: string]: (string) };

  /**
   * The path parameter values to be used to
   * populate to wildcards("*") of requesting api path
   *
   * @default no path parameters
   */
  readonly pathParameterValues?: string[];

  /**
   * The query parameters to be set when requesting API.
   *
   * @default no querystring parameters
   */
  readonly queryStringParameters?: { [key: string]: (string) };

  /**
   * This will be the post request body send to the API.
   *
   * @default the entire EventBridge event
   */
  readonly postBody?: events.RuleTargetInput;

  /**
   * The role to assume before invoking the target
   * (i.e., the pipeline) when the given rule is triggered.
   *
   * @default - a new role will be created
   */
  readonly eventRole?: iam.IRole;
}

/**
 * Use an API Gateway REST APIs as a target for Amazon EventBridge rules.
 */
export class ApiGateway implements events.IRuleTarget {
  private readonly _restApi: api.IRestApi;

  /**
   * @param restApi - IRestApi implementation to use as event target
   * @param props - Properties to configure the APIGateway target
   */
  constructor(restApi: api.IRestApi, private readonly props?: ApiGatewayProps) {
    this._restApi = restApi;
  }

  /**
   * @deprecated Use the `iRestApi` getter instead
   */
  public get restApi(): api.RestApi {
    if (!api.RestApi.isRestApi(this._restApi)) {
      throw new Error('The iRestApi is not a RestApi construct, and cannot be retrieved this way.');
    }
    return this._restApi;
  }

  /**
   * Returns the target IRestApi
   */
  public get iRestApi(): api.IRestApi {
    return this._restApi;
  }

  /**
   * Returns a RuleTarget that can be used to trigger this API Gateway REST APIs
   * as a result from an EventBridge event.
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/resource-based-policies-eventbridge.html#sqs-permissions
   */
  public bind(rule: events.IRule, _id?: string): events.RuleTargetConfig {
    if (this.props?.deadLetterQueue) {
      addToDeadLetterQueueResourcePolicy(rule, this.props.deadLetterQueue);
    }

    const wildcardCountsInPath = this.props?.path?.match( /\*/g )?.length ?? 0;
    if (wildcardCountsInPath !== (this.props?.pathParameterValues || []).length) {
      throw new Error('The number of wildcards in the path does not match the number of path pathParameterValues.');
    }

    const restApiArn = this._restApi.arnForExecuteApi(
      this.props?.method,
      this.props?.path || '/',
      this.props?.stage || this._restApi.deploymentStage.stageName,
    );

    const role = this.props?.eventRole || singletonEventRole(this._restApi);
    role.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: [restApiArn],
      actions: [
        'execute-api:Invoke',
        'execute-api:ManageConnections',
      ],
    }));

    return {
      ...(this.props ? bindBaseTargetConfig(this.props) : {}),
      arn: restApiArn,
      role,
      deadLetterConfig: this.props?.deadLetterQueue && { arn: this.props.deadLetterQueue?.queueArn },
      input: this.props?.postBody,
      targetResource: this._restApi,
      httpParameters: {
        headerParameters: this.props?.headerParameters,
        queryStringParameters: this.props?.queryStringParameters,
        pathParameterValues: this.props?.pathParameterValues,
      },
    };
  }
}

