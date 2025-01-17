import * as core from 'aws-cdk-lib/core';

export default async () => {
  const app = new core.App();
  new core.Stack(app, 'Stack1');
  new core.Stack(app, 'Stack2');

  // @todo fix api
  return app.synth() as any;
};
