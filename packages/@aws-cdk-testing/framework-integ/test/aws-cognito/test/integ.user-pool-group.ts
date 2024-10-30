import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { UserPool, UserPoolGroup } from 'aws-cdk-lib/aws-cognito';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

class TestStack extends Stack {
  public readonly userPool: UserPool;
  public readonly userPoolGroup: UserPoolGroup;
  public readonly anotherUserPoolGroup: UserPoolGroup;
  public readonly role: Role;
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const userPool = new UserPool(this, 'UserPool', {
      removalPolicy: RemovalPolicy.DESTROY,
    });
    this.userPool = userPool;

    const role = new Role(this, 'Role', {
      assumedBy: new ServicePrincipal('cognito-idp.amazonaws.com'),
    });
    this.role = role;

    const userPoolGroup = new UserPoolGroup(this, 'UserPoolGroup', {
      userPool: userPool,
      groupName: 'test-group',
      description: 'My user pool group',
      precedence: 1,
      role,
    });
    this.userPoolGroup = userPoolGroup;

    const anotherUserPoolGroup = userPool.addGroup('AnotherUserPoolGroup', {});
    this.anotherUserPoolGroup = anotherUserPoolGroup;
  }
}

const app = new App();
const stack = new TestStack(app, 'user-pool-group-stack');

const test = new IntegTest(app, 'integ-user-pool-group', {
  testCases: [stack],
});

test.assertions.awsApiCall('cognito-identity-provider', 'ListGroupsCommand', { UserPoolId: stack.userPool.userPoolId })
  .expect(ExpectedResult.objectLike({
    Groups: [
      {
        GroupName: stack.userPoolGroup.groupName,
        UserPoolId: stack.userPool.userPoolId,
        Precedence: 1,
        Description: 'My user pool group',
        RoleArn: stack.role.roleArn,
      },
      {
        GroupName: stack.anotherUserPoolGroup.groupName,
        UserPoolId: stack.userPool.userPoolId,
      },
    ],
  }));
