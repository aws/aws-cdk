import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/core');
import path = require('path');
import { IntegrationOptions } from '../integration';
import { Method } from '../method';
import { AwsIntegration } from './aws';

export interface LambdaIntegrationOptions extends IntegrationOptions {
  /**
   * Use proxy integration or normal (request/response mapping) integration.
   * @default true
   */
  readonly proxy?: boolean;

  /**
   * Allow invoking method from AWS Console UI (for testing purposes).
   *
   * This will add another permission to the AWS Lambda resource policy which
   * will allow the `test-invoke-stage` stage to invoke this handler. If this
   * is set to `false`, the function will only be usable from the deployment
   * endpoint.
   *
   * @default true
   */
  readonly allowTestInvoke?: boolean;

  /**
   * Asynchronously invoke the AWS Lambda function.
   *
   * API Gateway will invoke the AWS Lambda function and reply immediately
   * with a HTTP 202 status code. The event received by the function will
   * be the same as for normal proxy (raw request as-is). Unlike normal
   * proxy, there are no requirements on the output format of the function.
   *
   * @default false
   */
  readonly asyncProxy?: boolean;
}

/**
 * Integrates an AWS Lambda function to an API Gateway method.
 *
 * @example
 *
 *    const handler = new lambda.Function(this, 'MyFunction', ...);
 *    api.addMethod('GET', new LambdaIntegration(handler));
 *
 */
export class LambdaIntegration extends AwsIntegration {
  private readonly handler: lambda.IFunction;
  private readonly enableTest: boolean;

  constructor(handler: lambda.IFunction, options: LambdaIntegrationOptions = { }) {
    const proxy = options.proxy === undefined ? true : options.proxy;

    if (options.asyncProxy && !proxy) {
      throw new Error('Cannot use `asyncProxy` when `proxy` is set to `false`');
    }

    let apiHandler = handler;
    if (proxy && options.asyncProxy) {
      apiHandler = new lambda.SingletonFunction(cdk.Stack.of(handler), 'AsyncProxy', {
        code: lambda.Code.fromAsset(path.join(__dirname, 'async-proxy-handler')),
        runtime: lambda.Runtime.NODEJS_10_X,
        handler: 'index.handler',
        uuid: '9d748b00-3bcb-4d8d-9ff1-906c16a98164',
        lambdaPurpose: 'AsyncProxy',
        environment: {
          TARGET_FUNCTION_NAME: handler.functionName
        }
      });
      handler.grantInvoke(apiHandler);
    }

    super({
      proxy,
      service: 'lambda',
      path: `2015-03-31/functions/${apiHandler.functionArn}/invocations`,
      options
    });

    this.handler = apiHandler;
    this.enableTest = options.allowTestInvoke === undefined ? true : false;
  }

  public bind(method: Method) {
    super.bind(method);
    const principal = new iam.ServicePrincipal('apigateway.amazonaws.com');

    const desc = `${method.restApi.node.uniqueId}.${method.httpMethod}.${method.resource.path.replace(/\//g, '.')}`;

    this.handler.addPermission(`ApiPermission.${desc}`, {
      principal,
      scope: method,
      sourceArn: method.methodArn,
    });

    // add permission to invoke from the console
    if (this.enableTest) {
      this.handler.addPermission(`ApiPermission.Test.${desc}`, {
        principal,
        scope: method,
        sourceArn: method.testMethodArn,
      });
    }
  }
}
