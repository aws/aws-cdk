import { App, Stack, NestedStack, StackProps, NestedStackProps } from 'aws-cdk-lib';
import { UserPool, IUserPool } from 'aws-cdk-lib/aws-cognito';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';

class ResourceNestedStack extends NestedStack {
  userPool: UserPool;
  constructor (scope: Construct, id: string, props: NestedStackProps = {}) {
    super(scope, id, props);
    this.userPool = new UserPool(this, 'UserPool');
  }
}

interface DeploymentNestedStackProps extends NestedStackProps {
  userPool: IUserPool;
}

class DeploymentNestedStack extends NestedStack {
  bucket: Bucket;
  constructor (scope: Construct, id: string, props: DeploymentNestedStackProps) {
    super(scope, id, props);
    this.bucket = new Bucket(this, 'Bucket');
    new BucketDeployment(this, 'Deployment', {
      destinationBucket: this.bucket,
      sources: [
        Source.jsonData('appconfig.json', { userPoolId: props.userPool.userPoolId }),
      ],
    });
  }
}

class MainStack extends Stack {
  resourceNestedStack: ResourceNestedStack;
  deploymentNestedStack: DeploymentNestedStack;

  constructor (scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);
    this.resourceNestedStack = new ResourceNestedStack(this, 'ResourceNestedStack');
    this.deploymentNestedStack = new DeploymentNestedStack(this, 'DeploymentNestedStack', { userPool: this.resourceNestedStack.userPool });
  }
}

const app = new App();
const stack = new MainStack(app, 'MainStack');

const integTest = new integ.IntegTest(app, 'integ-cross-nested-stack-source', {
  testCases: [stack],
});

integTest.assertions.awsApiCall('S3', 'getObject', {
  Bucket: stack.deploymentNestedStack.bucket.bucketName,
  Key: 'appconfig.json',
}).expect(ExpectedResult.objectLike({
  Body: JSON.stringify({ userPoolId: stack.resourceNestedStack.userPool.userPoolId }),
}));
