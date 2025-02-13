import * as core from 'aws-cdk-lib/core';

export default async () => {
  const app = new core.App({ autoSynth: false });
  new core.Stack(app, 'Stack1');
  new core.Stack(app, 'Stack2');

  return app.synth();
};
