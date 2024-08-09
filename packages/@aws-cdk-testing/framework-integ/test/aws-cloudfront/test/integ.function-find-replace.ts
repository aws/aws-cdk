import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { App, Stack, type StackProps } from 'aws-cdk-lib';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { TestOrigin } from './test-origin';

/*
 * Stack verification steps:
 * * aws lambda invoke --function-name <deployed fn name> response.json
 */

class TestStack extends Stack {
  readonly kvsData = [
    { key: 'key1', value: 'value1' },
    { key: 'key2', value: 'value2' },
  ];

  readonly integrationTestFunctioName: string;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const store = new cloudfront.KeyValueStore(this, 'KeyValueStore', {
      source: cloudfront.ImportSource.fromInline(JSON.stringify({ data: this.kvsData })),
    });

    const code = (`
      import cf from 'cloudfront';
      const kvsId = "%KVS_ID%";
      const kvsHandle = cf.kvs(kvsId);
      async function handler(event) {
        const meta = await kvsHandle.meta()
        const keyCount = meta.keyCount;
        return {
          statusCode: 200, statusDescription: 'OK',
          headers: { 'content-type': { value: 'application/json' } },  
          body: JSON.stringify({ keyCount }),
        };
      }
    `);

    const func = new cloudfront.Function(this, 'Function', {
      keyValueStore: store,
      code: cloudfront.FunctionCode.fromInline(code, {
        findReplace: [{ find: '%KVS_ID%', replace: store.keyValueStoreId }],
      }),
    });

    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new TestOrigin('www.example.com'),
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        functionAssociations: [{
          function: func,
          eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
        }],
      },
    });

    const integrationTest = new lambda.Function(this, 'IntegrationTest', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      environment: { DISTRIBUTION_DOMAIN_NAME: distribution.distributionDomainName },
      code: lambda.Code.fromInline(`exports.handler = async (event) => {
        const distributionDomainName = process.env.DISTRIBUTION_DOMAIN_NAME;
        const response = await fetch(\`https://\${ distributionDomainName }/\`);
        return await response.json();
      }`),
    });
    this.integrationTestFunctioName = integrationTest.functionName;
  }
}

const app = new App();
const stack = new TestStack(app, 'aws-cdk-cloudfront-function-find-replace');
const integ = new IntegTest(app, 'CloudFrontFunctionFindReplace', { testCases: [stack] });

const invoke = integ.assertions.invokeFunction({ functionName: stack.integrationTestFunctioName });
invoke.expect(ExpectedResult.objectLike({
  ExecutedVersion: '$LATEST',
  StatusCode: 200,
  Payload: JSON.stringify({ keyCount: stack.kvsData.length }),
}));
