import { App, Stack, StackProps } from 'aws-cdk-lib';
import * as eks from 'aws-cdk-lib/aws-eks';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

interface EksClusterStackProps extends StackProps {
  readonly bootstrapSelfManagedAddons: boolean;
}

class EksClusterStack extends Stack {
  public cluster: eks.Cluster;

  constructor(scope: App, id: string, props: EksClusterStackProps) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', { natGateways: 1 });
    this.cluster = new eks.Cluster(this, 'Cluster', {
      vpc,
      ...getClusterVersionConfig(this, eks.KubernetesVersion.V1_30),
      bootstrapSelfManagedAddons: props.bootstrapSelfManagedAddons,
    });
  }
}

const app = new App();

const enabledStack = new EksClusterStack(app, 'EnabledEksClusterSstack', {
  bootstrapSelfManagedAddons: true,
});
const disabledStack = new EksClusterStack(app, 'DisabledEksClusterStack', {
  bootstrapSelfManagedAddons: false,
});

const integ = new IntegTest(app, 'EksClusterWithSelfManagedAddons', {
  testCases: [enabledStack, disabledStack],
});

const assertion = integ.assertions.awsApiCall('EKS', 'ListAddons', {
  name: disabledStack.cluster.clusterName,
}).expect(ExpectedResult.objectLike({
  addons: ['vpc-cni', 'kube-proxy', 'coredns'],
}));

integ.assertions.awsApiCall('EKS', 'ListAddons', {
  name: enabledStack.cluster.clusterName,
}).expect(ExpectedResult.objectLike({
  addons: [],
}));

assertion.provider.addToRolePolicy({
  Effects: 'Allow',
  Action: ['eks:*'],
  Resource: ['*'],
});
