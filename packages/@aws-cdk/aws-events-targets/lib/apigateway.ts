import * as apigateway from '@aws-cdk/aws-apigateway';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import { singletonEventRole } from './util';

/**
 * Customize the API Gateway Event Target
 */
export interface ApiGatewayProps {
  /**
   * Method name
   *
   * @default `*`
   */
  readonly method?: string;

  /**
   * Resource path
   *
   * @default `*`
   */
  readonly path?: string;

  /**
   * Stage name
   *
   * @default `*`
   */
  readonly stage?: string;

  /**
   * Header, Path, and Querystring parameters
   *
   * @default no parameters set
   */
  readonly httpParameters?: events.CfnRule.HttpParametersProperty;

  /**
   * The payload to send to API Gateway
   *
   * @default The event bridge payload
   */
  readonly input?: events.RuleTargetInput;
}

/**
 * Use API Gateway as a target for AWS EventBridge event rules.
 *
 * @example
 *
 *    // add API Gateway as a Target for a Rule
 *    myEventBridgeRule.addTarget(
 *        new ApiGateway(RestApi.fromRestApiId(this, 'RestApi', YOUR_REST_API_ID), {
 *            path: '/v1/*',
 *            method: 'PUT',
 *            stage: 'prod',
 *            input: RuleTargetInput.fromObject({
 *                foo: EventField.fromPath('$.detail.bar'),
 *                timestamp: EventField.time,
 *            }),
 *            httpParameters: {
 *                pathParameterValues: ['$.detail.id'],
 *            },
 *        }),
 *    );
 *
 */
export class ApiGateway implements events.IRuleTarget {
  constructor(private readonly apiGateway: apigateway.IRestApi, private readonly props: ApiGatewayProps = {}) {}

  /**
   * Returns a RuleTarget that can be used to trigger this API Gateway as a
   * result from an EventBridge event.
   */
  public bind(_rule: events.IRule, _id?: string): events.RuleTargetConfig {
    const executeArn = this.apiGateway.arnForExecuteApi(
      this.props.method,
      this.props.path,
      this.props.stage,
    );

    return {
      id: '',
      arn: executeArn,
      role: singletonEventRole(this.apiGateway, [
        new iam.PolicyStatement({
          actions: ['execute-api:Invoke'],
          resources: [executeArn],
        }),
      ]),
      input: this.props.input,
      targetResource: this.apiGateway,
      httpParameters: this.props.httpParameters,
    };
  }
}