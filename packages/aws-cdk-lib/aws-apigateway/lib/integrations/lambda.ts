import { AwsIntegration } from './aws';
import * as iam from '../../../aws-iam';
import * as lambda from '../../../aws-lambda';
import { Lazy, Names, Token } from '../../../core';
import { IntegrationConfig, IntegrationOptions } from '../integration';
import { Method } from '../method';

// The maximum number of individual method-scoped lambda permissions to be added before they are
// consolidated into a single permission scoped to the API
const LAMBDA_PERMISSION_CONSOLIDATION_THRESHOLD = 10;

export interface LambdaIntegrationOptions extends IntegrationOptions {
  /**
   * Use proxy integration or normal (request/response mapping) integration.
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-output-format
   *
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
}

/**
 * Integrates an AWS Lambda function to an API Gateway method.
 *
 * @example
 *
 *    declare const resource: apigateway.Resource;
 *    declare const handler: lambda.Function;
 *    resource.addMethod('GET', new apigateway.LambdaIntegration(handler));
 *
 */
export class LambdaIntegration extends AwsIntegration {
  private readonly handler: lambda.IFunction;
  private readonly enableTest: boolean;

  constructor(handler: lambda.IFunction, options: LambdaIntegrationOptions = { }) {
    const proxy = options.proxy ?? true;

    super({
      proxy,
      service: 'lambda',
      path: `2015-03-31/functions/${handler.functionArn}/invocations`,
      options,
    });

    this.handler = handler;
    this.enableTest = options.allowTestInvoke ?? true;
  }

  public bind(method: Method): IntegrationConfig {
    const bindResult = super.bind(method);
    const principal = new iam.ServicePrincipal('apigateway.amazonaws.com');

    // Permission prefix is unique to the handler and the api
    const descPrefix = `${Names.nodeUniqueId(this.handler.node)}.${Names.nodeUniqueId(method.api.node)}`;
    const desc = `${descPrefix}.${method.httpMethod}.${method.resource.path.replace(/\//g, '.')}`;

    // Find any existing permissions for this handler and this API
    const otherHandlerPermissions = method.api.node.findAll()
      .filter(c => c instanceof lambda.CfnPermission && (
        c.node.id.startsWith(`ApiPermission.${descPrefix}.`)
        || c.node.id.startsWith(`ApiPermission.Test.${descPrefix}.`)));

    const consolidatedPermisson = method.api.node.findAll()
      .find(c => c instanceof lambda.CfnPermission && c.node.id.startsWith(`ApiPermission.Any.${descPrefix}`));

    if (otherHandlerPermissions.length >= LAMBDA_PERMISSION_CONSOLIDATION_THRESHOLD) {
      // If there are existing permissions, remove them in favour of a single permission scoped only to the API
      otherHandlerPermissions.forEach(permission => permission.node.scope?.node?.tryRemoveChild?.(permission.node.id));
      this.handler.addPermission(`ApiPermission.Any.${descPrefix}`, {
        principal,
        scope: method.api,
        sourceArn: Lazy.string({ produce: () => method.api.arnForExecuteApi() }),
      });
    } else if (!consolidatedPermisson) {
      // No other permissions exist, so scope the permission to the specific method
      this.handler.addPermission(`ApiPermission.${desc}`, {
        principal,
        scope: method,
        sourceArn: Lazy.string({ produce: () => method.methodArn }),
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

    let functionName;

    if (this.handler instanceof lambda.Function) {
      // if not imported, extract the name from the CFN layer to reach
      // the literal value if it is given (rather than a token)
      functionName = (this.handler.node.defaultChild as lambda.CfnFunction).functionName;
    } else {
      // imported, just take the function name.
      functionName = this.handler.functionName;
    }

    let deploymentToken;
    if (!Token.isUnresolved(functionName)) {
      deploymentToken = JSON.stringify({ functionName });
    }
    return {
      ...bindResult,
      deploymentToken,
    };
  }
}
