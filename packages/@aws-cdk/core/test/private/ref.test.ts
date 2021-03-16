import * as s3 from '@aws-cdk/aws-s3';
import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import { App, Construct, Stack, StackProps, CfnOutput } from '../../lib';

interface extraProps extends StackProps {
  otherProp: s3.Bucket;
}

class StackOne extends Stack {
  bucket: s3.Bucket;
  constructor(scope: Construct, id: string, props?: extraProps) {
    super(scope, id, props);
    this.bucket = new s3.Bucket(this, 'bucket');
  }
}
class StackTwo extends Stack {
  bucket: s3.IBucket;
  constructor(scope: Construct, id: string, props: extraProps) {
    super(scope, id, props);
    this.bucket = s3.Bucket.fromBucketName(this, 'bucket', props.otherProp.bucketName);
  }
}

test('Cross stack references create Parameters', () => {
  const app = new App();
  // WHEN
  const stackOne = new StackOne(app, 'MyTestStackOne');
  const stackTwo = new StackTwo(app, 'MyTestStackTwo', { otherProp: stackOne.bucket });
  new CfnOutput(stackTwo, 'TestOutput', { value: stackTwo.bucket.bucketArn });
  // THEN
  expectCDK(stackOne).to(haveResource('AWS::SSM::Parameter'));
});
