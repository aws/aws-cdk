import ec2 = require('@aws-cdk/aws-ec2');
import { App, Construct, Stack, StackProps } from '@aws-cdk/core';
import { Cluster } from '../lib';

const env = {
  region: process.env.CDK_DEFAULT_REGION,
  account: process.env.CDK_DEFAULT_ACCOUNT
};

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id, { env });
  }
}

class VpcStack extends TestStack {
  public readonly vpc: ec2.Vpc;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.vpc = new ec2.Vpc(this, 'vpc', { maxAzs: 2 });
  }
}

class ClusterStack extends TestStack {
  public readonly cluster: Cluster;
  public readonly instanceRoleExportName: string;

  constructor(scope: Construct, id: string, props: StackProps & { vpc: ec2.Vpc }) {
    super(scope, id);

    this.cluster = new Cluster(this, 'cluster', { vpc: props.vpc });
    this.cluster.addCapacity('Nodes', {
      instanceType: new ec2.InstanceType('t2.medium'),
      desiredCapacity: 3,
    });

    this.cluster.addManifest('hello-kubernetes',
      {
        apiVersion: "v1",
        kind: "Service",
        metadata: { name: "hello-kubernetes" },
        spec: {
          type: "LoadBalancer",
          ports: [ { port: 80, targetPort: 8080 } ],
          selector: { app: "hello-kubernetes" }
        }
      },
      {
        apiVersion: "apps/v1",
        kind: "Deployment",
        metadata: { name: "hello-kubernetes" },
        spec: {
          replicas: 1,
          selector: { matchLabels: { app: "hello-kubernetes" } },
          template: {
            metadata: {
              labels: { app: "hello-kubernetes" }
            },
            spec: {
              containers: [
                {
                  name: "hello-kubernetes",
                  image: "paulbouwer/hello-kubernetes:1.5",
                  ports: [ { containerPort: 8080 } ]
                }
              ]
            }
          }
        }
      }
    );
  }
}

const app = new App();

const vpcStack = new VpcStack(app, 'k8s-vpc');

new ClusterStack(app, 'k8s-cluster', { vpc: vpcStack.vpc });

app.synth();
