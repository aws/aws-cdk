import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

class PolicyStatementSidStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const role = new Role(this, 'TestRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    role.addToPolicy(new PolicyStatement({
      sid: 'ValidAlphanumericSid',
      actions: ['s3:GetObject'],
      resources: ['*'],
    }));

    role.addToPolicy(new PolicyStatement({
      sid: 'AnotherValidSid123',
      actions: ['dynamodb:PutItem'],
      resources: ['*'],
    }));
  }
}

const app = new App();
new IntegTest(app, 'iam-policy-statement-sid', {
  testCases: [new PolicyStatementSidStack(app, 'PolicyStatementSidStack')],
  diffAssets: true,
});
app.synth();
