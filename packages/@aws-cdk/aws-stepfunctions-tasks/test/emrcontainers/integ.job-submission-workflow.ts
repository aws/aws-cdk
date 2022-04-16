/// !cdk-integ pragma:disable-update-workflow
import * as ec2 from '@aws-cdk/aws-ec2';
import * as eks from '@aws-cdk/aws-eks';
import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import {
  Classification, VirtualClusterInput, EksClusterInput, EmrContainersDeleteVirtualCluster,
  EmrContainersCreateVirtualCluster, EmrContainersStartJobRun, ReleaseLabel,
} from '../../lib';

/**
 * Stack verification steps:
 * Everything in the links below must be setup for the EKS Cluster and Execution Role before running the state machine.
 * @see https://docs.aws.amazon.com/emr/latest/EMR-on-EKS-DevelopmentGuide/setting-up-cluster-access.html
 * @see https://docs.aws.amazon.com/emr/latest/EMR-on-EKS-DevelopmentGuide/setting-up-enable-IAM.html
 * @see https://docs.aws.amazon.com/emr/latest/EMR-on-EKS-DevelopmentGuide/setting-up-trust-policy.html
 *
 * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * aws stepfunctions describe-execution --execution-arn <exection-arn generated before> : should return status as SUCCEEDED
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-emr-containers-all-services-integ');

const eksCluster = new eks.Cluster(stack, 'integration-test-eks-cluster', {
  version: eks.KubernetesVersion.V1_21,
  defaultCapacity: 3,
  defaultCapacityInstance: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.XLARGE),
});

const jobExecutionRole = new iam.Role(stack, 'JobExecutionRole', {
  assumedBy: new iam.CompositePrincipal(
    new iam.ServicePrincipal('emr-containers.amazonaws.com'),
    new iam.ServicePrincipal('states.amazonaws.com'),
  ),
});

const createVirtualCluster = new EmrContainersCreateVirtualCluster(stack, 'Create a virtual Cluster', {
  virtualClusterName: 'Virtual-Cluster-Name',
  eksCluster: EksClusterInput.fromCluster(eksCluster),
  resultPath: '$.cluster',
});

const startJobRun = new EmrContainersStartJobRun(stack, 'Start a Job Run', {
  virtualCluster: VirtualClusterInput.fromTaskInput(sfn.TaskInput.fromJsonPathAt('$.cluster.Id')),
  releaseLabel: ReleaseLabel.EMR_6_2_0,
  jobName: 'EMR-Containers-Job',
  executionRole: iam.Role.fromRoleArn(stack, 'Job-Execution-Role', jobExecutionRole.roleArn),
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
  .next(startJobRun)
  .next(deleteVirtualCluster);

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definition: chain,
  timeout: cdk.Duration.minutes(20),
});

new cdk.CfnOutput(stack, 'stateMachineArn', {
  value: sm.stateMachineArn,
});


app.synth();
