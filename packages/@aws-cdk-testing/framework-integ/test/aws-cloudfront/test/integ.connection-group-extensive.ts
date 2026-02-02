import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-connection-group-extensive');

/* Ensure your AWS account has permissions to create an Anycast static IP list
*  https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/request-static-ips.html
*/
const anycastIpList = new cloudfront.CfnAnycastIpList(stack, 'anycast', {
  ipCount: 21,
  name: 'integlist',
});

new cloudfront.ConnectionGroup(stack, 'connection-group', {
  connectionGroupName: 'test-group',
  enabled: true,
  ipv6Enabled: false,
  anycastIpListId: anycastIpList.attrId,
  tags: [
    { key: 'Environment', value: 'test' },
    { key: 'Project', value: 'my-project' },
  ],
});

new IntegTest(app, 'connection-group-extensive-test', {
  testCases: [stack],
});
