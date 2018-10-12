import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import { LambdaIntegration } from './integrations';
import { RestApi, RestApiProps } from './restapi';

export interface LambdaRestApiProps {
  /**
   * The default Lambda function that handles all requests from this API.
   *
   * This handler will be used as a the default integration for all methods in
   * this API, unless specified otherwise in `addMethod`.
   */
  handler: lambda.Function;

  /**
   * An API path for a greedy proxy with an "ANY" method, which will route all
   * requests under that path to the defined handler.
   *
   * If not defined, you will need to explicitly define the API model using
   * `addResource` and `addMethod` (or `addProxy`).
   *
   * @default undefined
   */
  proxyPath?: string;

  /**
   * Further customization of the REST API.
   *
   * @default defaults
   */
  options?: RestApiProps;
}

/**
 * Defines an API Gateway REST API with AWS Lambda proxy integration.
 *
 * Use the `proxyPath` property to define a greedy proxy ("{proxy+}") and "ANY"
 * method from the specified path. If not defined, you will need to explicity
 * add resources and methods to the API.
 */
export class LambdaRestApi extends RestApi {
  constructor(parent: cdk.Construct, id: string, props: LambdaRestApiProps) {
    if (props.options && props.options.defaultIntegration) {
      throw new Error(`Cannot specify "options.defaultIntegration" since Lambda integration is automatically defined`);
    }

    super(parent, id, {
      defaultIntegration: new LambdaIntegration(props.handler),
      ...props.options
    });

    // if proxyPath is specified, add a proxy at the specified path
    // we will need to create all resources along the path.
    const proxyPath = props.proxyPath;
    if (proxyPath) {
      const route = proxyPath.split('/').filter(x => x);
      let curr = this.root;
      for (const part of route) {
        curr = curr.addResource(part);
      }
      curr.addProxy();
    }
  }
}