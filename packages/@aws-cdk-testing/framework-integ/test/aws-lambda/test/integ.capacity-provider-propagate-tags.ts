import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'CapacityProviderPropagateTagsStack');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });

const cpExplicit = new lambda.CapacityProvider(stack, 'CpWithExplicitTags', {
  subnets: vpc.privateSubnets,
  securityGroups: [securityGroup],
  propagateTags: lambda.PropagateTags.explicit({
    Environment: 'Test',
    Project: 'CDK-Integ',
  }),
});

const cpNone = new lambda.CapacityProvider(stack, 'CpWithNone', {
  subnets: vpc.privateSubnets,
  securityGroups: [securityGroup],
  propagateTags: lambda.PropagateTags.none(),
});

const test = new integ.IntegTest(app, 'CapacityProviderPropagateTagsTest', {
  testCases: [stack],
});

// API assertions: verify PropagateTags config landed correctly in the deployment
const getExplicit = test.assertions.awsApiCall('Lambda', 'getCapacityProvider', {
  CapacityProviderName: cpExplicit.capacityProviderName,
});
getExplicit.assertAtPath('PropagateTags.Mode', integ.ExpectedResult.stringLikeRegexp('Explicit'));
getExplicit.assertAtPath('PropagateTags.ExplicitTags[0].Key', integ.ExpectedResult.stringLikeRegexp('Environment'));
getExplicit.assertAtPath('PropagateTags.ExplicitTags[0].Value', integ.ExpectedResult.stringLikeRegexp('Test'));

const getNone = test.assertions.awsApiCall('Lambda', 'getCapacityProvider', {
  CapacityProviderName: cpNone.capacityProviderName,
});
getNone.assertAtPath('PropagateTags.Mode', integ.ExpectedResult.stringLikeRegexp('None'));
