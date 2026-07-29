import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'CapacityProviderPropagateTagsStack');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });

new lambda.CapacityProvider(stack, 'CpWithExplicitTags', {
  subnets: vpc.privateSubnets,
  securityGroups: [securityGroup],
  propagateTags: lambda.PropagateTags.explicit({
    Environment: 'Test',
    Project: 'CDK-Integ',
  }),
});

new lambda.CapacityProvider(stack, 'CpWithNone', {
  subnets: vpc.privateSubnets,
  securityGroups: [securityGroup],
  propagateTags: lambda.PropagateTags.none(),
});

new integ.IntegTest(app, 'CapacityProviderPropagateTagsTest', {
  testCases: [stack],
});

// TODO: Uncomment the API assertions below once @aws-sdk/client-lambda is bumped
// to >= 3.1059.0 in this monorepo. The GetCapacityProvider API returns PropagateTags
// in the response, but the current SDK version (3.632.0) lacks the PropagateTags field
// in its response deserializer—so the field is silently dropped. Verified working
// locally with @aws-sdk/client-lambda@3.1059.0.
//
// const getExplicit = test.assertions.awsApiCall('Lambda', 'getCapacityProvider', {
//   CapacityProviderName: cpExplicit.capacityProviderName,
// });
// getExplicit.expect(integ.ExpectedResult.objectLike({
//   CapacityProvider: integ.Match.objectLike({
//     PropagateTags: integ.Match.objectLike({
//       Mode: 'Explicit',
//       ExplicitTags: integ.Match.objectLike({
//         Environment: 'Test',
//       }),
//     }),
//   }),
// })).waitForAssertions({
//   totalTimeout: cdk.Duration.minutes(5),
//   interval: cdk.Duration.seconds(30),
// });
//
// const getNone = test.assertions.awsApiCall('Lambda', 'getCapacityProvider', {
//   CapacityProviderName: cpNone.capacityProviderName,
// });
// getNone.expect(integ.ExpectedResult.objectLike({
//   CapacityProvider: integ.Match.objectLike({
//     PropagateTags: integ.Match.objectLike({
//       Mode: 'None',
//     }),
//   }),
// })).waitForAssertions({
//   totalTimeout: cdk.Duration.minutes(5),
//   interval: cdk.Duration.seconds(30),
// });
