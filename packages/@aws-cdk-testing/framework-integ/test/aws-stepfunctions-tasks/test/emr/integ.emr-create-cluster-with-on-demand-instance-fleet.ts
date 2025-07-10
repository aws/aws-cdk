import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { EmrCreateCluster } from 'aws-cdk-lib/aws-stepfunctions-tasks';

const app = new App();

const stack = new Stack(app, 'aws-cdk-emr-create-cluster-with-on-demand-instance-fleet');

const step = new EmrCreateCluster(stack, 'EmrCreateCluster', {
  releaseLabel: 'emr-5.36.1',
  instances: {
    instanceFleets: [{
      instanceFleetType: EmrCreateCluster.InstanceRoleType.MASTER,
      instanceTypeConfigs: [{
        instanceType: 'm5.xlarge',
        weightedCapacity: 1,
      }],
      launchSpecifications: {
        onDemandSpecification: {
          allocationStrategy: EmrCreateCluster.OnDemandAllocationStrategy.LOWEST_PRICE,
        },
      },
      name: 'Master',
      targetOnDemandCapacity: 1,
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

app.synth();
