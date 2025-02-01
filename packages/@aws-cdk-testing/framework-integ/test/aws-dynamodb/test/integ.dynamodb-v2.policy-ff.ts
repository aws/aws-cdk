import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-dynamodb:resourcePolicyPerReplica': true,
  },
});

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const docu = new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          actions: ['dynamodb:*'],
          principals: [new iam.AccountRootPrincipal()],
          resources: ['*'],
        }),
      ],
    });

    // table with resource policy
    new dynamodb.TableV2(this, 'TableTestV2-1', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
      resourcePolicy: docu,
      replicas: [{
        region: 'eu-west-2',
      }],
    });
  }
}

const stack = new TestStack(app, 'ResourcePolicyTest-v2-FF', { env: { region: 'eu-west-1' } });

new IntegTest(app, 'table-v2-resource-policy-integ-test', {
  testCases: [stack],
});
