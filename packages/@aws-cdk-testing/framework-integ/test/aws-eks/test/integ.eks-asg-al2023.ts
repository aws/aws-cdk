import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, CfnOutput, Duration, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';
import * as eks from 'aws-cdk-lib/aws-eks';

/**
 * Integration test for self-managed Amazon Linux 2023 capacity
 * (`addAutoScalingGroupCapacity` with `MachineImageType.AMAZON_LINUX_2023`).
 *
 * The cluster has no other capacity. A Job pinned to the AL2023 nodes must
 * complete, which only happens once an instance has bootstrapped with
 * nodeadm and registered with the cluster.
 *
 * Pinned to Kubernetes 1.33, the first version without Amazon Linux 2 AMIs.
 */
class EksAsgAl2023Stack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', {
      natGateways: 1,
      restrictDefaultSecurityGroup: false,
    });

    const cluster = new eks.Cluster(this, 'Cluster', {
      vpc,
      defaultCapacity: 0,
      serviceIpv4Cidr: '172.20.0.0/16',
      ...getClusterVersionConfig(this, eks.KubernetesVersion.V1_33),
    });

    const nodes = cluster.addAutoScalingGroupCapacity('AL2023Nodes', {
      instanceType: new ec2.InstanceType('m5.large'),
      machineImageType: eks.MachineImageType.AMAZON_LINUX_2023,
      minCapacity: 1,
      maxCapacity: 1,
    });

    const probe = cluster.addManifest('NodeJoinProbe', {
      apiVersion: 'batch/v1',
      kind: 'Job',
      metadata: { name: 'al2023-node-join-probe', namespace: 'default' },
      spec: {
        backoffLimit: 6,
        template: {
          spec: {
            restartPolicy: 'Never',
            nodeSelector: { lifecycle: 'OnDemand' },
            containers: [{
              name: 'probe',
              image: 'public.ecr.aws/docker/library/busybox:1.36',
              command: ['sh', '-c', 'echo node joined'],
            }],
          },
        },
      },
    });
    probe.node.addDependency(nodes);

    // Resolves only after the Job has succeeded on an AL2023 node.
    const succeeded = new eks.KubernetesObjectValue(this, 'NodeJoinProbeSucceeded', {
      cluster,
      objectType: 'job',
      objectName: 'al2023-node-join-probe',
      jsonPath: '.status.succeeded',
      timeout: Duration.minutes(15),
    });
    succeeded.node.addDependency(probe);

    new CfnOutput(this, 'NodeJoinProbeSucceededCount', { value: succeeded.value });
  }
}

const app = new App();
const stack = new EksAsgAl2023Stack(app, 'aws-cdk-eks-asg-al2023-test');

new integ.IntegTest(app, 'aws-cdk-eks-asg-al2023', {
  testCases: [stack],
  diffAssets: false,
});
