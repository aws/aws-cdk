import cdk = require('@aws-cdk/core');
import eks = require('../lib');
import { TestStack } from './util';

class EksClusterAutoscalerStack extends TestStack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const cluster = new eks.Cluster(this, 'Cluster', { defaultCapacity: 3 });

    new eks.KubernetesClusterAutoscaler(this, 'ClusterAutoscaler', {
      cluster,
      nodeGroups: [cluster.defaultCapacity!]
    });

  }
}

const app = new cdk.App();
new EksClusterAutoscalerStack(app, 'k8s-cluster-autoscaler');
app.synth();
