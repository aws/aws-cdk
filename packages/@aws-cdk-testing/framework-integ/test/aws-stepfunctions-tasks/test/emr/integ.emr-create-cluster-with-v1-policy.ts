import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { EmrCreateCluster } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Vpc } from 'aws-cdk-lib/aws-ec2';

/*
 * Creates a state machine that deploys an EMR cluster.
 *
 * Stack verification steps:
 *
 * The generated state machine can be executed from the CLI (or Step Functions console)
 * and runs with an execution status of `Succeeded`.
 *
 * -- aws stepfunctions start-execution --state-machine-arn <state-machine-arn-from-output> provides execution arn
 * -- aws stepfunctions describe-execution --execution-arn <state-machine-arn-from-output> returns a status of `Succeeded`
 *
 * Be sure to terminate the EMR cluster after validation.
 */

const app = new App();

const stack = new Stack(app, 'aws-cdk-emr-create-cluster-v1-policy');
const vpc = new Vpc(stack, 'Vpc', { restrictDefaultSecurityGroup: false });

const step = new EmrCreateCluster(stack, 'EmrCreateCluster', {
  instances: {
    instanceFleets: [
      {
        instanceFleetType: EmrCreateCluster.InstanceRoleType.MASTER,
        instanceTypeConfigs: [
          {
            instanceType: 'm5.xlarge',
          },
        ],
        targetOnDemandCapacity: 1,
      },
    ],
    ec2SubnetId: vpc.publicSubnets[0].subnetId,
  },
  name: 'Cluster',
  releaseLabel: 'emr-6.15.0',
  integrationPattern: sfn.IntegrationPattern.RUN_JOB,
});

new sfn.StateMachine(stack, 'SM', {
  definition: step,
});

new IntegTest(app, 'EmrCreateClusterTest', {
  testCases: [stack],
});

app.synth();
