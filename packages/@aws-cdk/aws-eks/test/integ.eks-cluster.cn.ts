import { Vpc } from '@aws-cdk/aws-ec2';
import { App, CfnOutput, Construct, Stack } from '@aws-cdk/core';
import * as eks from '../lib';
import { KubectlLayer } from '../lib/kubectl-layer';

class EksClusterStack extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = new Vpc(this, 'VPC');
    // create a new layer here and expect to have a new lambda layer as serverless application
    // from the SAR in cn-north-1
    new KubectlLayer(this, 'Layer', { version: '2.0.0-beta2'});
    const cluster = new eks.Cluster(this, 'Cluster', { vpc, kubectlEnabled: true, defaultCapacity: 0 });

    new CfnOutput(this, 'ClusterEndpoint', { value: cluster.clusterEndpoint });
    new CfnOutput(this, 'ClusterArn', { value: cluster.clusterArn });
    new CfnOutput(this, 'ClusterCertificateAuthorityData', { value: cluster.clusterCertificateAuthorityData });
    new CfnOutput(this, 'ClusterName', { value: cluster.clusterName });
  }
}

const app = new App();
const stack = new Stack(app, 'eks-integ-cn', { env: { region: 'cn-north-1' }});
new EksClusterStack(stack, 'eks-integ-cn-cluster');

app.synth();
