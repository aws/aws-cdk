import ec2 = require('@aws-cdk/aws-ec2');
import { App, Construct, Stack, StackProps } from '@aws-cdk/core';
import dax = require('../lib');

class DaxStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc');

    new dax.Cluster(this, 'MyCluster', {
      nodeType: "dax.t2.large",
      replicationFactor: 1,
      vpc,
    });
  }
}

const app = new App();
new DaxStack(app, 'MyStack');
app.synth();
