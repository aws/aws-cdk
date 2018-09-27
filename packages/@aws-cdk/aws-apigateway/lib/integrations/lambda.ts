import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import { IntegrationOptions } from '../integration';
import { Method } from '../method';
import { AwsIntegration } from './aws';

export interface LambdaIntegrationOptions extends IntegrationOptions {
  /**
   * Use proxy integration or normal (request/response mapping) integration.
   * @default true
   */
  proxy?: boolean;

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
  allowTestInvoke?: boolean;
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
  private readonly handler: lambda.FunctionRef;
  private readonly enableTest: boolean;

  constructor(handler: lambda.FunctionRef, options: LambdaIntegrationOptions = { }) {
    const proxy = options.proxy === undefined ? true : options.proxy;

    super({
      proxy,
      service: 'lambda',
      path: `2015-03-31/functions/${handler.functionArn}/invocations`,
      options
    });

    this.handler = handler;
    this.enableTest = options.allowTestInvoke === undefined ? true : false;
  }

  public bind(method: Method) {
    const principal = new cdk.ServicePrincipal('apigateway.amazonaws.com');

    const desc = `${method.httpMethod}.${method.resource.resourcePath.replace(/\//g, '.')}`;

    this.handler.addPermission(`ApiPermission.${desc}`, {
      principal,
      sourceArn: method.methodArn,
    });

    // add permission to invoke from the console
    if (this.enableTest) {
      this.handler.addPermission(`ApiPermission.Test.${desc}`, {
        principal,
        sourceArn: method.testMethodArn
      });
    }
  }
}
