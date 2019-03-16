import apigw = require('@aws-cdk/aws-apigateway');
import lambda = require('@aws-cdk/aws-lambda');

export class ApiEventSource implements lambda.IEventSource {
  constructor(private readonly method: string, private readonly path: string, private readonly options?: apigw.MethodOptions) {
    if (!path.startsWith('/')) {
      throw new Error(`Path must start with "/": ${path}`);
    }
  }

  public bind(target: lambda.FunctionBase): void {
    const id = 'ApiEventSourceA7A86A4F';
    let api = target.node.tryFindChild(id) as apigw.RestApi;
    if (!api) {
      api = new apigw.RestApi(target, id, {
        defaultIntegration: new apigw.LambdaIntegration(target),
      });
    }

    const resource = api.root.resourceForPath(this.path);
    resource.addMethod(this.method, undefined, this.options);
  }
}