import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { App, Size, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { EmrCreateCluster } from 'aws-cdk-lib/aws-stepfunctions-tasks';

const app = new App();

const stack = new Stack(app, 'aws-cdk-emr-create-cluster');

const step = new EmrCreateCluster(stack, 'EmrCreateCluster', {
  instances: {
    instanceFleets: [{
      instanceFleetType: EmrCreateCluster.InstanceRoleType.MASTER,
      instanceTypeConfigs: [{
        bidPrice: '1',
        bidPriceAsPercentageOfOnDemandPrice: 1,
        configurations: [{
          classification: 'Classification',
          properties: {
            Key: 'Value',
          },
        }],
        ebsConfiguration: {
          ebsBlockDeviceConfigs: [{
            volumeSpecification: {
              iops: 1,
              volumeSize: Size.gibibytes(1),
              volumeType: EmrCreateCluster.EbsBlockDeviceVolumeType.STANDARD,
            },
            volumesPerInstance: 1,
          }],
          ebsOptimized: true,
        },
        instanceType: 'm5.xlarge',
        weightedCapacity: 1,
      }],
      launchSpecifications: {
        onDemandSpecification: {
          allocationStrategy: EmrCreateCluster.OnDemandAllocationStrategy.LOWEST_PRICE,
          capacityReservationOptions: {
            capacityReservationPreference: EmrCreateCluster.CapacityReservationPreference.OPEN,
            // CfnCapacityReservation???
            // capacityReservationResourceGroupArn: 'arn:aws:resource-groups:us-east-1:123456789012:group/my-cr-group',
            usageStrategy: EmrCreateCluster.UsageStrategy.USE_CAPACITY_RESERVATIONS_FIRST,
          },
        },
        spotSpecification: {
          allocationStrategy: EmrCreateCluster.SpotAllocationStrategy.CAPACITY_OPTIMIZED,
          blockDurationMinutes: 1,
          timeoutAction: EmrCreateCluster.SpotTimeoutAction.TERMINATE_CLUSTER,
          timeoutDurationMinutes: 1,
        },
      },
      name: 'Master',
      targetOnDemandCapacity: 1,
      targetSpotCapacity: 1,
    }],
  },
  name: 'Cluster',
  integrationPattern: sfn.IntegrationPattern.RUN_JOB,
  tags: {
    Key: 'Value',
  },
});

new sfn.StateMachine(stack, 'SM', {
  definition: step,
});

new IntegTest(app, 'EmrCreateClusterTest', {
  testCases: [stack],
});