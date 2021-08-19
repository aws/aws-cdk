import * as eks from '@aws-cdk/aws-eks';
import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import {
  Classification, VirtualClusterInput, EksClusterInput, EmrContainersDeleteVirtualCluster,
  EmrContainersEksCreateVirtualCluster, EmrContainersStartJobRun, ReleaseLabel,
} from '../../lib';

/**
 * Stack verification steps:
 * Everything in the link below must be setup before running the state machine.
 * @see https://docs.aws.amazon.com/emr/latest/EMR-on-EKS-DevelopmentGuide/setting-up.html
 *
 * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * aws stepfunctions describe-execution --execution-arn <exection-arn generated before> : should return status as SUCCEEDED
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-emr-containers-all-services-integ');

const eksCluster = eks.Cluster.fromClusterAttributes(stack, 'EKS Cluster', {
  clusterName: 'test-eks',
});

const createVirtualCluster = new EmrContainersEksCreateVirtualCluster(stack, 'Create a virtual Cluster', {
  eksNamespace: 'spark2',
  eksCluster: EksClusterInput.fromCluster(eksCluster),
  resultPath: '$.cluster',
});

const startJobRunJob = new EmrContainersStartJobRun(stack, 'Start a Job Run', {
  virtualCluster: VirtualClusterInput.fromTaskInput(sfn.TaskInput.fromJsonPathAt('$.cluster.Id')),
  releaseLabel: ReleaseLabel.EMR_6_2_0,
  jobName: 'EMR-Containers-Job',
  executionRole: iam.Role.fromRoleArn(stack, 'Job-Execution-Role', 'arn:aws:iam::070850498885:role/Job-Execution-Role'),
  jobDriver: {
    sparkSubmitJobDriver: {
      entryPoint: sfn.TaskInput.fromText('local:///usr/lib/spark/examples/src/main/python/pi.py'),
      entryPointArguments: sfn.TaskInput.fromObject(['2']),
      sparkSubmitParameters: '--conf spark.driver.memory=512M --conf spark.kubernetes.driver.request.cores=0.2 --conf spark.kubernetes.executor.request.cores=0.2 --conf spark.sql.shuffle.partitions=60 --conf spark.dynamicAllocation.enabled=false',
    },
  },
  monitoring: {
    logging: true,
    persistentAppUI: true,
  },
  applicationConfig: [{
    classification: Classification.SPARK_DEFAULTS,
    properties: {
      'spark.executor.instances': '1',
      'spark.executor.memory': '512M',
    },
  }],
  resultPath: '$.job',
});


const deleteVirtualCluster = new EmrContainersDeleteVirtualCluster(stack, 'Delete a Virtual Cluster', {
  virtualClusterId: sfn.TaskInput.fromJsonPathAt('$.job.VirtualClusterId'),
});

const chain = sfn.Chain
  .start(createVirtualCluster)
  .next(startJobRunJob)
  .next(deleteVirtualCluster);

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definition: chain,
  timeout: cdk.Duration.minutes(20),
});

new cdk.CfnOutput(stack, 'stateMachineArn', {
  value: sm.stateMachineArn,
});


app.synth();