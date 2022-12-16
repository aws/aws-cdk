/// !cdk-integ pragma:disable-update-workflow
import { App, Stack, StackProps } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as eks from '../lib';
import { ICluster, KubernetesManifest } from '../lib';


class EksClusterCreateKubectlProviderStack extends Stack {

  cluster: ICluster;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    this.cluster = eks.Cluster.fromClusterAttributes(this, 'Cluster', {
      clusterName: 'cluster',
      createKubectlProvider: true,
      kubectlRoleArn: 'arn:aws:iam::123456789012:role/kubectl-role',
    });
  };
}

interface EksClusterShareKubectlProviderStackProps extends StackProps {
  cluster: ICluster
}

class EksClusterShareKubectlProviderStack extends Stack {

  constructor(scope: App, id: string, props: EksClusterShareKubectlProviderStackProps) {
    super(scope, id, props);

    new KubernetesManifest(this, 'TestManifest', {
      cluster: props.cluster,
      manifest: [{}],
    });
  };
}


const app = new App();

const stackCluster = new EksClusterCreateKubectlProviderStack(app, 'aws-cdk-eks-cluster-imported-cluster-create-kubectlprovider-test', {});
const stackManifest = new EksClusterShareKubectlProviderStack(app, 'aws-cdk-eks-cluster-share-kubectlprovider-test', {
  cluster: stackCluster.cluster,
});

new integ.IntegTest(app, 'aws-cdk-eks-cluster-create-kubectlprovider', {
  testCases: [stackCluster, stackManifest],
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: true,
      },
    },
  },
});

app.synth();
