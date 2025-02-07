import * as core from 'aws-cdk-lib/core';

export default async() => {
  const app = new core.App({ autoSynth: false });
  new core.Stack(app, 'Stack1', {
    notificationArns: [
      'arn:aws:sns:us-east-1:1111111111:resource',
      'arn:aws:sns:us-east-1:1111111111:other-resource',
    ],
  });
  return app.synth() as any;
};
