import type { StackProps } from 'aws-cdk-lib';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
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

    // Table with resource policy and feature flag resourcePolicyPerReplica enabled.
    // Replica removed: CloudFormation does not allow creating a replica and setting
    // a resource-based policy in the same stack operation, even when the policy is
    // scoped to the primary region only.
    new dynamodb.TableV2(this, 'TableTestV2-1', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
      resourcePolicy: docu,
    });
  }
}

const stack = new TestStack(app, 'ResourcePolicyTest-v2-FF');

new IntegTest(app, 'table-v2-resource-policy-integ-test', {
  testCases: [stack],
});
