import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { Duration } from '@aws-cdk/core';
import { Construct } from 'constructs';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct as CoreConstruct } from '@aws-cdk/core';
let SDK_METADATA: any = undefined;

/**
 * Represents an assertions provider. The creates a singletone
 * Lambda Function that will create a single function per stack
 * that serves as the custom resource provider for the various
 * assertion providers
 */
export class AssertionsProvider extends CoreConstruct {
  public readonly serviceToken: string;
  private readonly grantPrincipal: iam.IPrincipal;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const handler = new lambda.SingletonFunction(this, 'AssertionsProvider', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda-handler')),
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      uuid: '1488541a-7b23-4664-81b6-9b4408076b81',
      timeout: Duration.minutes(2),
    });

    this.grantPrincipal = handler.grantPrincipal;
    this.serviceToken = handler.functionArn;
  }

  public encode(obj: any): any {
    if (!obj) {
      return obj;
    }
    return JSON.parse(JSON.stringify(obj), (_k, v) => {
      switch (v) {
        case true:
          return 'TRUE:BOOLEAN';
        case false:
          return 'FALSE:BOOLEAN';
        default:
          return v;
      }
    });
  }

  public addPolicyStatementFromSdkCall(service: string, api: string, resources?: string[]): iam.PolicyStatement {
    if (SDK_METADATA === undefined) {
      // eslint-disable-next-line
      SDK_METADATA = require('./sdk-api-metadata.json');
    }
    const srv = service.toLowerCase();
    const iamService = (SDK_METADATA[srv] && SDK_METADATA[srv].prefix) || srv;
    const iamAction = api.charAt(0).toUpperCase() + api.slice(1);
    const statement = new iam.PolicyStatement({
      actions: [`${iamService}:${iamAction}`],
      resources: resources || ['*'],
    });
    this.grantPrincipal.addToPolicy(statement);
    return statement;
  }
}
