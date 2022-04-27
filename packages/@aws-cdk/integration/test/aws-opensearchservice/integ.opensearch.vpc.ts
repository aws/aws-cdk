import * as ec2 from '@aws-cdk/aws-ec2';
import * as opensearch from '@aws-cdk/aws-opensearchservice';
import { App, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import { Construct } from 'constructs';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc');
    const domainProps: opensearch.DomainProps = {
      version: opensearch.EngineVersion.ELASTICSEARCH_7_1,
      removalPolicy: RemovalPolicy.DESTROY,
      vpc,
      zoneAwareness: {
        enabled: true,
      },
      capacity: {
        dataNodes: 2,
      },
    };
    new opensearch.Domain(this, 'Domain', domainProps);
  }
}

const app = new App();
new TestStack(app, 'cdk-integ-opensearch-vpc');
app.synth();
