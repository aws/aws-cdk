import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-ecs:removeDefaultDeploymentAlarm': true,
  },
});
const stack = new cdk.Stack(app, 'integ-managedinstances-capacity-reservations');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const cluster = new ecs.Cluster(stack, 'ManagedInstancesCluster', {
  vpc,
  enableFargateCapacityProviders: true,
});

const securityGroup = new ec2.SecurityGroup(stack, 'ManagedInstancesSecurityGroup', {
  vpc,
  description: 'Security group for ManagedInstances capacity provider instances',
  allowAllOutbound: true,
});

// Use the RESERVED capacity option type with a Capacity Reservation preference.
//
// RESERVATIONS_EXCLUDED is used here so the test deploys without depending on a
// pre-existing Capacity Reservation resource group in the test account. The
// reservationGroupArn path is covered by unit tests, since exercising it requires
// a Capacity Reservation resource group that matches the instance requirements.
const miCapacityProvider = new ecs.ManagedInstancesCapacityProvider(stack, 'ManagedInstancesCapacityProvider', {
  capacityOptionType: ecs.CapacityOptionType.RESERVED,
  capacityReservations: {
    reservationPreference: ecs.ReservationPreference.RESERVATIONS_EXCLUDED,
  },
  subnets: vpc.privateSubnets,
  securityGroups: [securityGroup],
  instanceRequirements: {
    vCpuCountMin: 1,
    memoryMin: cdk.Size.gibibytes(2),
  },
});

cluster.addManagedInstancesCapacityProvider(miCapacityProvider);

const integTest = new integ.IntegTest(app, 'ManagedInstancesCapacityReservations', {
  testCases: [stack],
  cdkCommandOptions: {
    destroy: {
      // https://github.com/aws/aws-cdk/issues/36071
      expectError: true,
    },
  },
});

integTest.assertions.awsApiCall('ECS', 'describeCapacityProviders', {
  capacityProviders: [miCapacityProvider.capacityProviderName],
}).expect(integ.ExpectedResult.objectLike({
  capacityProviders: [
    integ.Match.objectLike({
      managedInstancesProvider: integ.Match.objectLike({
        instanceLaunchTemplate: integ.Match.objectLike({
          capacityOptionType: 'RESERVED',
          capacityReservations: {
            reservationPreference: 'RESERVATIONS_EXCLUDED',
          },
        }),
      }),
    }),
  ],
}));
