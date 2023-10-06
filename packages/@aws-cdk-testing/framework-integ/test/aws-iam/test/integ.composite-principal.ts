import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';

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
