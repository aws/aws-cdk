import type { StackProps } from 'aws-cdk-lib';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Table with grantReadWriteData to a ServicePrincipal
    // The grant is dropped (no ResourcePolicy created) without causing deployment failure.
    const table1 = new dynamodb.Table(this, 'GrantDropTable', {
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    });
    table1.grantReadWriteData(new iam.ServicePrincipal('bedrock.amazonaws.com'));

    // TableV2 with grantReadWriteData to a ServicePrincipal
    const table2 = new dynamodb.TableV2(this, 'GrantDropTableV2', {
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    });
    table2.grantWriteData(new iam.ServicePrincipal('bedrock.amazonaws.com'));

    // Using addToResourcePolicy with supported service principal to produce a valid ResourcePolicy
    const table3 = new dynamodb.Table(this, 'Table3', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    });
    table3.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['dynamodb:ReadDataForReplication', 'dynamodb:WriteDataForReplication', 'dynamodb:ReplicateSettings'],
      principals: [new iam.ServicePrincipal('replication.dynamodb.amazonaws.com')],
      resources: ['*'],
      conditions: {
        StringEquals: { 'aws:SourceAccount': Stack.of(this).account },
      },
    }));
  }
}

const app = new App();
const stack = new TestStack(app, 'grant-service-principal-test-stack');

new IntegTest(app, 'grant-service-principal-integ-test', {
  testCases: [stack],
});
