import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as iam from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    new iam.Role(this, 'RoleWithCompositePrincipal', {
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('ec2.amazonaws.com'),
        new iam.AnyPrincipal(),
      ),
    });
  }
}

const app = new cdk.App();

new IntegTest(app, 'iam-integ-composite-principal-test', {
  testCases: [new TestStack(app, 'iam-integ-composite-principal')],
});

app.synth();
