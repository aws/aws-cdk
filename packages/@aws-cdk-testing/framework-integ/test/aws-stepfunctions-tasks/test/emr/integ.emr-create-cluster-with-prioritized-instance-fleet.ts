import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { EmrCreateCluster } from 'aws-cdk-lib/aws-stepfunctions-tasks';

const app = new App();

const stack = new Stack(app, 'aws-cdk-emr-create-cluster-with-prioritized-instance-fleet');

const step = new EmrCreateCluster(stack, 'EmrCreateCluster', {
  releaseLabel: 'emr-5.36.1',
  instances: {
    instanceFleets: [{
      instanceFleetType: EmrCreateCluster.InstanceRoleType.CORE,
      instanceTypeConfigs: [{
        instanceType: 'm5.large',
        priority: 0,
        weightedCapacity: 1,
      }, {
        instanceType: 'm5.xlarge',
        priority: 1,
        weightedCapacity: 2,
      }],
      launchSpecifications: {
        onDemandSpecification: {
          allocationStrategy: EmrCreateCluster.OnDemandAllocationStrategy.PRIORITIZED,
        },
      },
      name: 'Core',
      targetOnDemandCapacity: 2,
    }],
  },
  name: 'PrioritizedCluster',
  integrationPattern: sfn.IntegrationPattern.RUN_JOB,
});

new sfn.StateMachine(stack, 'SM', {
  definition: step,
});

new IntegTest(app, 'EmrCreateClusterPrioritizedTest', {
  testCases: [stack],
});

app.synth();
