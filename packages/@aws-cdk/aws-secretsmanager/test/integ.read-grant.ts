import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { App, Stack, StackProps } from '@aws-cdk/core';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as secretsmanager from '../lib';


class TestReadGrantStack extends Stack {
  public readonly fn: lambda.Function;
  public readonly secret: secretsmanager.Secret;
  public readonly key: kms.Key;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.key = new kms.Key(this, 'Key', { removalPolicy: cdk.RemovalPolicy.DESTROY });
    this.secret = new secretsmanager.Secret(this, 'Secret', {
      encryptionKey: this.key,
    });

    this.fn = new lambda.Function(this, 'Read', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'index.lambda_handler',
      code: lambda.Code.fromInline(`import boto3
def lambda_handler(event, context):
      secret_name = "` + this.secret.secretName + `"
      boto3.session.Session().client(service_name='secretsmanager').get_secret_value(SecretId=secret_name)
      `),
    });

    this.secret.grantRead(new iam.Role(this, 'SecretsMngrIntegTestRole', {
      assumedBy: new iam.ServicePrincipal('lambda'),
    }));
  }
}

const app = new App();
const readPermissionsStack = new TestReadGrantStack(app, 'aws-cdk-kms-managed-secret-read-only');

// Test
const testCase = new IntegTest(app, 'SecretsManagerPermissionsTest', {
  testCases: [readPermissionsStack],
});

const readLambdaInvocation = testCase.assertions.invokeFunction({
  functionName: readPermissionsStack.fn.functionName,
});

readLambdaInvocation.expect(ExpectedResult.objectLike({
  StatusCode: 200,
}));