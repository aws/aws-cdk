import * as ec2 from '@aws-cdk/aws-ec2';
import * as eks from '@aws-cdk/aws-eks';
import { AwsAuthMapping } from '@aws-cdk/aws-eks';
import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { Aws } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { EmrContainersStartJobRun, ReleaseLabel, VirtualClusterInput } from '../../lib';

/**
 * Stack verification steps:
 * Everything in the link below must be setup before running the state machine.
 * @see https://docs.aws.amazon.com/emr/latest/EMR-on-EKS-DevelopmentGuide/setting-up-enable-IAM.html
 * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * aws stepfunctions describe-execution --execution-arn <exection-arn generated before> : should return status as SUCCEEDED
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-tasks-emr-containers-start-job-run-test');

const eksCluster = new eks.Cluster(stack, 'integration-test-eks-cluster', {
  version: eks.KubernetesVersion.V1_21,
  defaultCapacity: 3,
  defaultCapacityInstance: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.XLARGE),
});

const virtualCluster = new cdk.CfnResource(stack, 'Virtual Cluster', {
  type: 'AWS::EMRContainers::VirtualCluster',
  properties: {
    ContainerProvider: {
      Id: eksCluster.clusterName,
      Info: {
        EksInfo: {
          Namespace: 'default',
        },
      },
      Type: 'EKS',
    },
    Name: 'Virtual-Cluster-Name',
  },
});

const emrRole = eksCluster.addManifest('emrRole', {
  apiVersion: 'rbac.authorization.k8s.io/v1',
  kind: 'Role',
  metadata: { name: 'emr-containers', namespace: 'default' },
  rules: [
    { apiGroups: [''], resources: ['namespaces'], verbs: ['get'] },
    { apiGroups: [''], resources: ['serviceaccounts', 'services', 'configmaps', 'events', 'pods', 'pods/log'], verbs: ['get', 'list', 'watch', 'describe', 'create', 'edit', 'delete', 'deletecollection', 'annotate', 'patch', 'label'] },
    { apiGroups: [''], resources: ['secrets'], verbs: ['create', 'patch', 'delete', 'watch'] },
    { apiGroups: ['apps'], resources: ['statefulsets', 'deployments'], verbs: ['get', 'list', 'watch', 'describe', 'create', 'edit', 'delete', 'annotate', 'patch', 'label'] },
    { apiGroups: ['batch'], resources: ['jobs'], verbs: ['get', 'list', 'watch', 'describe', 'create', 'edit', 'delete', 'annotate', 'patch', 'label'] },
    { apiGroups: ['extensions'], resources: ['ingresses'], verbs: ['get', 'list', 'watch', 'describe', 'create', 'edit', 'delete', 'annotate', 'patch', 'label'] },
    { apiGroups: ['rbac.authorization.k8s.io'], resources: ['roles', 'rolebindings'], verbs: ['get', 'list', 'watch', 'describe', 'create', 'edit', 'delete', 'deletecollection', 'annotate', 'patch', 'label'] },
  ],
});

const emrRoleBind = eksCluster.addManifest('emrRoleBind', {
  apiVersion: 'rbac.authorization.k8s.io/v1',
  kind: 'RoleBinding',
  metadata: { name: 'emr-containers', namespace: 'default' },
  subjects: [{ kind: 'User', name: 'emr-containers', apiGroup: 'rbac.authorization.k8s.io' }],
  roleRef: { kind: 'Role', name: 'emr-containers', apiGroup: 'rbac.authorization.k8s.io' },
});

emrRoleBind.node.addDependency(emrRole);

const emrServiceRole = iam.Role.fromRoleArn(stack, 'emrServiceRole', 'arn:aws:iam::'+Aws.ACCOUNT_ID+':role/AWSServiceRoleForAmazonEMRContainers');
const authMapping: AwsAuthMapping = { groups: [], username: 'emr-containers' };
eksCluster.awsAuth.addRoleMapping(emrServiceRole, authMapping);

virtualCluster.node.addDependency(emrRoleBind);
virtualCluster.node.addDependency(eksCluster.awsAuth);

const startJobRunJob = new EmrContainersStartJobRun(stack, 'Start a Job Run', {
  virtualCluster: VirtualClusterInput.fromVirtualClusterId(virtualCluster.getAtt('Id').toString()),
  releaseLabel: ReleaseLabel.EMR_6_2_0,
  jobName: 'EMR-Containers-Job',
  jobDriver: {
    sparkSubmitJobDriver: {
      entryPoint: sfn.TaskInput.fromText('local:///usr/lib/spark/examples/src/main/python/pi.py'),
      entryPointArguments: sfn.TaskInput.fromObject(['2']),
      sparkSubmitParameters: '--conf spark.driver.memory=512M --conf spark.kubernetes.driver.request.cores=0.2 --conf spark.kubernetes.executor.request.cores=0.2 --conf spark.sql.shuffle.partitions=60 --conf spark.dynamicAllocation.enabled=false',
    },
  },
});

const chain = sfn.Chain.start(startJobRunJob);

const sm = new sfn.StateMachine(stack, 'StateMachine', {
  definition: chain,
  timeout: cdk.Duration.seconds(1000),
});

new cdk.CfnOutput(stack, 'stateMachineArn', {
  value: sm.stateMachineArn,
});

new integ.IntegTest(app, 'aws-stepfunctions-tasks-emr-containers-start-job-run', {
  testCases: [stack],
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: true,
      },
    },
  },
});

app.synth();
