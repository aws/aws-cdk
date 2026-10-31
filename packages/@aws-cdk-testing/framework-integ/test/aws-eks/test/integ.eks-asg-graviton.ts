import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, CfnOutput, Duration, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';
import * as eks from 'aws-cdk-lib/aws-eks';

/**
 * Integration test for self-managed capacity on a newer Graviton family
 * (`addAutoScalingGroupCapacity` with `m7g.large`).
 *
 * Graviton3 families were missing from the old prefix list, so they got the
 * x86_64 Amazon Linux 2 AMI and the instances could not boot. The cluster has
 * no other capacity, and a Job that selects `kubernetes.io/arch: arm64` must
 * complete, which only happens once an m7g instance has booted the arm64 AMI
 * and registered with the cluster.
 *
 * Pinned to Kubernetes 1.32, the last version with Amazon Linux 2 AMIs.
 */
class EksAsgGravitonStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', {
      natGateways: 1,
      restrictDefaultSecurityGroup: false,
    });

    const cluster = new eks.Cluster(this, 'Cluster', {
      vpc,
      defaultCapacity: 0,
      ...getClusterVersionConfig(this, eks.KubernetesVersion.V1_32),
    });

    const nodes = cluster.addAutoScalingGroupCapacity('GravitonNodes', {
      instanceType: new ec2.InstanceType('m7g.large'),
      minCapacity: 1,
      maxCapacity: 1,
    });

    const probe = cluster.addManifest('NodeJoinProbe', {
      apiVersion: 'batch/v1',
      kind: 'Job',
      metadata: { name: 'graviton-node-join-probe', namespace: 'default' },
      spec: {
        backoffLimit: 6,
        template: {
          spec: {
            restartPolicy: 'Never',
            nodeSelector: { 'kubernetes.io/arch': 'arm64' },
            containers: [{
              name: 'probe',
              image: 'public.ecr.aws/docker/library/busybox:1.36',
              command: ['sh', '-c', 'uname -m'],
            }],
          },
        },
      },
    });
    probe.node.addDependency(nodes);

    // Resolves only after the Job has succeeded on an arm64 node.
    const succeeded = new eks.KubernetesObjectValue(this, 'NodeJoinProbeSucceeded', {
      cluster,
      objectType: 'job',
      objectName: 'graviton-node-join-probe',
      jsonPath: '.status.succeeded',
      timeout: Duration.minutes(15),
    });
    succeeded.node.addDependency(probe);

    new CfnOutput(this, 'NodeJoinProbeSucceededCount', { value: succeeded.value });
  }
}

const app = new App();
const stack = new EksAsgGravitonStack(app, 'aws-cdk-eks-asg-graviton-test');

const test = new integ.IntegTest(app, 'aws-cdk-eks-asg-graviton', {
  testCases: [stack],
  diffAssets: false,
});

// Fails the run unless the probe output reports exactly one completed pod.
test.assertions.awsApiCall('CloudFormation', 'describeStacks', {
  StackName: stack.stackName,
}).expect(integ.ExpectedResult.objectLike({
  Stacks: integ.Match.arrayWith([
    integ.Match.objectLike({
      Outputs: integ.Match.arrayWith([
        integ.Match.objectLike({
          OutputKey: 'NodeJoinProbeSucceededCount',
          OutputValue: '1',
        }),
      ]),
    }),
  ]),
}));
