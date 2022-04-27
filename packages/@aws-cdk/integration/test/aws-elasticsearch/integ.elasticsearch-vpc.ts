import * as ec2 from '@aws-cdk/aws-ec2';
import * as es from '@aws-cdk/aws-elasticsearch';
import { App, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import { Construct } from 'constructs';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc');
    const domainProps: es.DomainProps = {
      version: es.ElasticsearchVersion.V7_1,
      removalPolicy: RemovalPolicy.DESTROY,
      vpc,
      zoneAwareness: {
        enabled: true,
      },
      capacity: {
        dataNodes: 2,
      },
    };
    new es.Domain(this, 'Domain', domainProps);
  }
}

const app = new App();
new TestStack(app, 'cdk-integ-elasticsearch-vpc');
app.synth();
