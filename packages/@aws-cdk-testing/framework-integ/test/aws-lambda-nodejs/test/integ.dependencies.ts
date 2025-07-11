/// !cdk-integ *
import * as path from 'path';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

class SdkV3TestStack extends Stack {
  public lambdaFunction: IFunction;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new dynamodb.TableV2(this, 'SdkCallee', {
      tableName: 'external-sdk-table',
      partitionKey: { name: 'call', type: dynamodb.AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // This function uses @aws-sdk/* but it will not be included
    this.lambdaFunction = new lambda.NodejsFunction(this, 'external-sdk-v3', {
      entry: path.join(__dirname, 'integ-handlers/dependencies-sdk-v3.ts'),
      runtime: STANDARD_NODEJS_RUNTIME,
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    // grant the lambda role read/write permissions to our table
    table.grantReadWriteData(this.lambdaFunction);
  }
}

class SdkV3BundledStack extends Stack {
  public lambdaFunction: IFunction;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new dynamodb.TableV2(this, 'SdkCallee', {
      tableName: 'bundle-sdk-table',
      partitionKey: { name: 'call', type: dynamodb.AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // This function uses @aws-sdk/* but it will not be included
    this.lambdaFunction = new lambda.NodejsFunction(this, 'bundle-sdk', {
      entry: path.join(__dirname, 'integ-handlers/dependencies-sdk-v3.ts'),
      runtime: STANDARD_NODEJS_RUNTIME,
      bundling: {
        bundleAwsSDK: true,
      },
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    // grant the lambda role read/write permissions to our table
    table.grantReadWriteData(this.lambdaFunction);
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const sdkV3testCase = new SdkV3TestStack(app, 'cdk-integ-lambda-nodejs-dependencies-for-sdk-v3');
const sdkV3BundledSdk = new SdkV3BundledStack(app, 'cdk-integ-lambda-nodejs-dependencies-for-sdk-v3-bundled');

const integ = new IntegTest(app, 'LambdaDependencies', {
  testCases: [sdkV3testCase, sdkV3BundledSdk],
});

for (const testCase of [sdkV3testCase, sdkV3BundledSdk]) {
  const response = integ.assertions.invokeFunction({
    functionName: testCase.lambdaFunction.functionName,
  });
  response.expect(ExpectedResult.objectLike({
    // expect invoking without error
    StatusCode: 200,
    ExecutedVersion: '$LATEST',
    Payload: 'null',
  }));
}
