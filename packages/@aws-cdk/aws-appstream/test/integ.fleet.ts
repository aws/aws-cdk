import * as cdk from '@aws-cdk/core';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests';
import * as appstream from '../lib';

/*
 * Before this test can run you need to visit the AppStream console once and click fleets.
 * This will create the necessary AmazonAppStreamServiceAccess service role.
 *
 * Stack verification steps:
 * * aws appstream describe-fleets --region us-east-1
 * The command should return a json with an array Fleets containing one with a Name MyFleet and a State of RUNNING.
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-appstream-fleet');

const fleet = new appstream.CfnFleet(stack, 'MyFleet', {
  instanceType: 'stream.standard.small',
  name: 'MyFleet',
  computeCapacity: {
    desiredInstances: 1,
  },
  imageName: 'AppStream-AmazonLinux2-09-21-2022',
});
fleet.cfnOptions.creationPolicy = {
  startFleet: true,
};

const testCase = new IntegTest(app, 'fleet-test', {
  testCases: [stack],
});

const describe = testCase.assertions.awsApiCall('AppStream', 'describeFleets', {
  Names: [fleet.ref],
});

// assert the results
describe.expect(ExpectedResult.objectLike({
  Fleets: [{
    State: 'RUNNING',
  }],
}));

app.synth();
