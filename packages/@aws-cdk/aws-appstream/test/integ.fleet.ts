import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as appstream from '../lib';

/*
 * Before this test can run you need to visit the AppStream console once and click fleets.
 * This will create the necessary service role.
 *
 * Stack verification steps:
 * * aws appstream describe-fleets --region us-east-1
 * The command should return a json with an array Fleets containing one with a Name MyFleet and a State of RUNNING.
 */

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const fleet = new appstream.CfnFleet(this, 'MyFleet', {
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
    // the following code is commented because the AmazonAppStreamServiceAccess might already exist in the account
    // const role = new iam.Role(this, "AmazonAppStreamServiceAccess", {
    //   assumedBy: new iam.ServicePrincipal("appstream.amazonaws.com"),
    //   managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonAppStreamServiceAccess')],
    //   roleName: "AmazonAppStreamServiceAccess",
    //   path: "/service-role/",
    // });
    // fleet.node.addDependency(role);
  }
}

const testCase = new TestStack(app, 'integ-appstream-fleet');

new IntegTest(app, 'fleet-test', {
  testCases: [testCase],
});
