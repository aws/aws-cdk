import * as iam from '@aws-cdk/aws-iam';
import { App, Stack } from '@aws-cdk/core';
import { Stream } from '../lib';

const app = new App();
const stack = new Stack(app, 'integ-kinesis-stream');

const role = new iam.Role(stack, 'UserRole', {
  assumedBy: new iam.AccountRootPrincipal(),
});

const stream = new Stream(stack, 'myStream');

stream.grantReadWrite(role);
