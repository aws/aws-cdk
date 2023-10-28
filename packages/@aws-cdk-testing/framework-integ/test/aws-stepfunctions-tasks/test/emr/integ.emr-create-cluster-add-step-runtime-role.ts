import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/*
 * Create a state machine with an EMR cluster and adds a step that uses a runtime role.
 *
 * Prerequisites:
 * 1. Fill in the instances block for EmrCreateCluster
 * 2. Create the EMR security configuration, see https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-create-security-configuration.html and
 *    https://aws.amazon.com/blogs/big-data/introducing-runtime-roles-for-amazon-emr-steps-use-iam-roles-and-aws-lake-formation-for-access-control-with-amazon-emr/
 * 3. Add the security configuration to EmrCreateCluster
 *
 * Stack verification steps:
 * The generated State Machine can be executed from the CLI (or Step Functions console)
 * and runs with an execution status of `Succeeded`.
 *
 * -- aws stepfunctions start-execution --state-machine-arn <state-machine-arn-from-output> provides execution arn
 * -- aws stepfunctions describe-execution --execution-arn <state-machine-arn-from-output> returns a status of `Succeeded`
 */

const app = new App();
const stack = new Stack(app, 'aws-cdk-emr-add-step-runtime-role');

const createClusterStep = new tasks.EmrCreateCluster(stack, 'EmrCreateCluster', {
  instances: {
    /*
    instanceFleets: [
      {
        instanceFleetType: tasks.EmrCreateCluster.InstanceRoleType.MASTER,
        instanceTypeConfigs: [
          {
            instanceType: 'm5.xlarge',
          },
        ],
        targetOnDemandCapacity: 1,
      },
    ],
    ec2SubnetId: 'subnet-xxxxxx',
    */
  },
  name: 'Cluster',
  releaseLabel: 'emr-6.13.0',
  integrationPattern: sfn.IntegrationPattern.RUN_JOB,
  tags: {
    Key: 'Value',
  },
  //securityConfiguration: 'security-configuration',
  applications: [
    {
      name: 'Spark',
    },
  ],
});

const executionRole = new iam.Role(stack, 'Role', {
  assumedBy: new iam.ArnPrincipal(createClusterStep.clusterRole.roleArn),
});

executionRole.assumeRolePolicy?.addStatements(
  new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    principals: [
      createClusterStep.clusterRole,
    ],
    actions: [
      'sts:SetSourceIdentity',
    ],
  }),
  new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    principals: [
      createClusterStep.clusterRole,
    ],
    actions: [
      'sts:TagSession',
    ],
    conditions: {
      StringEquals: {
        'aws:RequestTag/LakeFormationAuthorizedCaller': 'Amazon EMR',
      },
    },
  }),
);

const addStepStep = new tasks.EmrAddStep(stack, 'EmrAddStep', {
  resultPath: sfn.JsonPath.DISCARD, // pass cluster id to terminate step
  clusterId: sfn.JsonPath.stringAt('$.Cluster.Id'),
  name: 'AddStepRuntimeRoleIntTest',
  jar: 'command-runner.jar',
  args: [
    'spark-example',
    'SparkPi',
    '1',
  ],
  executionRole: executionRole.roleArn,
  actionOnFailure: tasks.ActionOnFailure.TERMINATE_CLUSTER,
});

const terminationStep = new tasks.EmrTerminateCluster(stack, 'EmrTerminateCluster', {
  clusterId: sfn.JsonPath.stringAt('$.Cluster.Id'),
  integrationPattern: sfn.IntegrationPattern.RUN_JOB,
});

const definition = createClusterStep.next(addStepStep).next(terminationStep);

new sfn.StateMachine(stack, 'SM', {
  definition,
});

new IntegTest(app, 'EmrCreateClusterTest', {
  testCases: [stack],
});
