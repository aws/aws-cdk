import * as s3 from 'aws-cdk-lib/aws-s3';
import * as core from 'aws-cdk-lib/core';

export default async () => {
  const app = new core.App({ autoSynth: false });
  const stack = new core.Stack(app, 'Stack1');
  new s3.Bucket(stack, 'MyBucket');
  return app.synth();
};
