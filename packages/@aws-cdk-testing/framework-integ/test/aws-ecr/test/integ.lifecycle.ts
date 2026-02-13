import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ecr from 'aws-cdk-lib/aws-ecr';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecr-lifecycle-stack');

// Repository with lifecycle rules using the new options: maxDaysSinceLastPull and action
const repo = new ecr.Repository(stack, 'Repo');
repo.addLifecycleRule({
  description: 'Remove images not pulled in 30 days',
  maxDaysSinceLastPull: cdk.Duration.days(30),
});
repo.addLifecycleRule({
  description: 'Keep only 10 dev images',
  tagPrefixList: ['dev'],
  maxImageCount: 10,
});
repo.addLifecycleRule({
  description: 'Archive old prod images after 60 days',
  tagPrefixList: ['prod'],
  maxImageAge: cdk.Duration.days(60),
  action: ecr.LifecycleAction.TRANSITION,
});

new IntegTest(app, 'cdk-ecr-lifecycle-test', {
  testCases: [stack],
});
