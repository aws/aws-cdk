import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { UserPool, UserPoolGroup } from 'aws-cdk-lib/aws-cognito';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const userPool = new UserPool(this, 'UserPool', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const role = new Role(this, 'Role', {
      assumedBy: new ServicePrincipal('cognito-idp.amazonaws.com'),
    });

    new UserPoolGroup(this, 'UserPoolGroup', {
      userPool: userPool,
      groupName: 'test-group',
      description: 'My user pool group',
      precedence: 1,
      role,
    });

    userPool.addGroup('AnotherUserPoolGroup', {});
  }
}

const app = new App();
const stack = new TestStack(app, 'user-pool-group-stack');

new IntegTest(app, 'integ-user-pool-group', {
  testCases: [stack],
});
