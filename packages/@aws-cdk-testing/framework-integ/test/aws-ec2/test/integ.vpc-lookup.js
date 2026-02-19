"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const ec2 = require("aws-cdk-lib/aws-ec2");
const cx_api_1 = require("aws-cdk-lib/cx-api");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'StackUnderTest', {
    env: {
        account: process.env.AWS_ACCOUNT_ID ?? process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.AWS_REGION ?? process.env.CDK_DEFAULT_REGION,
    },
});
stack.node.setContext(cx_api_1.EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);
const vpcFromLookup = ec2.Vpc.fromLookup(stack, 'VpcFromLookup', {
    isDefault: true,
});
new cdk.CfnOutput(stack, 'OutputFromLookup', {
    value: `Region fromLookup: ${vpcFromLookup.env.region}`,
});
new integ_tests_alpha_1.IntegTest(app, 'VpcLookupTest', {
    testCases: [stack],
    regions: ['us-east-1'],
});
