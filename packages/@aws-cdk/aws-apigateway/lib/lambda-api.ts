import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import { LambdaIntegration } from './integrations';
import { Method } from './method';
import { ProxyResource, Resource } from './resource';
import { RestApi, RestApiProps } from './restapi';

export interface LambdaRestApiProps {
  /**
   * The default Lambda function that handles all requests from this API.
   *
   * This handler will be used as a the default integration for all methods in
   * this API, unless specified otherwise in `addMethod`.
   */
  readonly handler: lambda.IFunction;

  /**
   * If true, route all requests to the Lambda Function
   *
   * If set to false, you will need to explicitly define the API model using
   * `addResource` and `addMethod` (or `addProxy`).
   *
   * @default true
   */
  readonly proxy?: boolean;

  /**
   * Further customization of the REST API.
   *
   * @default defaults
   */
  readonly options?: RestApiProps;
}

/**
 * Defines an API Gateway REST API with AWS Lambda proxy integration.
 *
 * Use the `proxyPath` property to define a greedy proxy ("{proxy+}") and "ANY"
 * method from the specified path. If not defined, you will need to explicity
 * add resources and methods to the API.
 */
export class LambdaRestApi extends RestApi {
  constructor(scope: cdk.Construct, id: string, props: LambdaRestApiProps) {
    if (props.options && props.options.defaultIntegration) {
      throw new Error(`Cannot specify "options.defaultIntegration" since Lambda integration is automatically defined`);
    }

    super(scope, id, {
      defaultIntegration: new LambdaIntegration(props.handler),
      ...props.options
    });

    if (props.proxy !== false) {
      this.root.addProxy();

      // Make sure users cannot call any other resource adding function
      this.root.addResource = addResourceThrows;
      this.root.addMethod = addMethodThrows;
      this.root.addProxy = addProxyThrows;
    }
  }
}

function addResourceThrows(): Resource {
  throw new Error(`Cannot call 'addResource' on a proxying LambdaRestApi; set 'proxy' to false`);
}

function addMethodThrows(): Method {
  throw new Error(`Cannot call 'addMethod' on a proxying LambdaRestApi; set 'proxy' to false`);
}

function addProxyThrows(): ProxyResource {
  throw new Error(`Cannot call 'addProxy' on a proxying LambdaRestApi; set 'proxy' to false`);
}