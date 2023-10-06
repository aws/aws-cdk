import * as iam from 'aws-cdk-lib/aws-iam';
import { App, Stack } from 'aws-cdk-lib';
import { Stream } from 'aws-cdk-lib/aws-kinesis';

const app = new App();
const stack = new Stack(app, 'integ-kinesis-stream');

const role = new iam.Role(stack, 'UserRole', {
  assumedBy: new iam.AccountRootPrincipal(),
});

const stream = new Stream(stack, 'myStream');

stream.grantReadWrite(role);
