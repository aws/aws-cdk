const cdk = require('aws-cdk-lib/core');

const stackPrefix = process.env.STACK_NAME_PREFIX;
if (!stackPrefix) {
  throw new Error(`the STACK_NAME_PREFIX environment variable is required`);
}

const app = new cdk.App();
new NoStackApp(app, `${stackPrefix}-no-stack-1`);

app.synth();
