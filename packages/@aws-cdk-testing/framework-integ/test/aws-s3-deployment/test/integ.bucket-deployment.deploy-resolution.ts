import { App, Stack, NestedStack, StackProps, NestedStackProps } from 'aws-cdk-lib';
import { UserPool, IUserPool } from 'aws-cdk-lib/aws-cognito';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';

class ResourceNestedStack extends NestedStack {
  userPool: UserPool
  constructor (scope: Construct, id: string, props?: NestedStackProps) {
    super(scope, id, props);
    this.userPool = new UserPool(this, 'UserPool');
  }
}

interface DeploymentNestedStackProps extends NestedStackProps {
  userPool: IUserPool
}
class DeploymentNestedStack extends NestedStack {
  constructor (scope: Construct, id: string, props: DeploymentNestedStackProps) {
    super(scope, id, props);
    const bucket = new Bucket(this, 'Bucket');
    new BucketDeployment(this, 'Deployment', {
      destinationBucket: bucket,
      sources: [
        Source.jsonData('appconfig.json', { userPoolId: props.userPool.userPoolId }),
      ],
    });
  }
}
class MainStack extends Stack {
  constructor (scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const resourceNestedStack = new ResourceNestedStack(this, 'ResourceNestedStack');
    new DeploymentNestedStack(this, 'DeploymentNestedStack', { userPool: resourceNestedStack.userPool });
  }
}

const app = new App();

new IntegTest(app, 'Integration', {
  testCases: [
    new MainStack(app, 'MainStack'),
  ],
});