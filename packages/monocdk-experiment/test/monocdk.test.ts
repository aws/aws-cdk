import { aws_s3, core } from '../src';

test('do something with mono cdk', () => {
  const app = new core.App();
  const stack = new core.Stack(app, 'MyStack');

  new aws_s3.Bucket(stack, 'MyBucket', {
    encryption: aws_s3.BucketEncryption.KMS
  });

  const asm = app.synth();
  expect(asm.getStackArtifact(stack.artifactId).template).toMatchSnapshot();
});