import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { TestOrigin } from './test-origin';

const app = new App();
const stack = new Stack(app, 'cloudfront-waf-protection', {
  env: { region: 'us-east-1' },
});

new cloudfront.Distribution(stack, 'Distro', {
  defaultBehavior: { origin: new TestOrigin('www.example.com') },
  enableWafCoreProtections: true,
});

new IntegTest(app, 'integ-cloudfront-waf-protection-test', {
  testCases: [stack],
});

app.synth();