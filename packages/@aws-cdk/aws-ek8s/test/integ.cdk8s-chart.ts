import * as eks from '@aws-cdk/aws-eks';
import * as cdk from '@aws-cdk/core';
import * as cdk8s from 'cdk8s';
import * as kplus from 'cdk8s-plus';
import * as constructs from 'constructs';
import * as ek8s from '../lib';

export class CDK8sChartStack extends cdk.Stack {

  private readonly cluster: eks.ICluster;

  constructor(scope: constructs.Construct, id: string) {
    super(scope, id);

    this.cluster = new eks.Cluster(this, 'Cluster', {
      version: eks.KubernetesVersion.V1_18,
    });

    this.assertSimpleCdk8sChart();

  }

  private assertSimpleCdk8sChart() {

    class Chart extends cdk8s.Chart {
      constructor(scope: constructs.Construct, ns: string, cluster: eks.ICluster) {
        super(scope, ns);

        new kplus.ConfigMap(this, 'config-map', {
          data: {
            clusterName: cluster.clusterName,
          },
        });

      }
    }
    const app = new cdk8s.App();
    const chart = new Chart(app, 'Chart', this.cluster);

    this.cluster.addCdk8sChart('cdk8s-chart', new ek8s.Cdk8sChart(chart));
  }

}

const app = new cdk.App();
new CDK8sChartStack(app, 'aws-cdk-eks-cdk8s-test');

app.synth();