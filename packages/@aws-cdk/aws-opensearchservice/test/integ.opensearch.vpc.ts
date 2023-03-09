import * as ec2 from '@aws-cdk/aws-ec2';
import { App, Stack, StackProps, RemovalPolicy, CfnResource } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as opensearch from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const serviceLinkedRole = new CfnResource(this, 'ServiceLinkedRole', {
      type: 'AWS::IAM::ServiceLinkedRole',
      properties: {
        AWSServiceName: 'opensearchservice.amazonaws.com',
        Description: 'Role for OpenSearch VPC Test',
      },
    });

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

    const domain = new opensearch.Domain(this, 'Domain', domainProps);
    domain.node.addDependency(serviceLinkedRole);
  }
}

const app = new App();
const testCase = new TestStack(app, 'cdk-integ-opensearch-vpc');
new integ.IntegTest(app, 'cdk-integ-opensearch-vpc-test', {
  testCases: [testCase],
});
app.synth();
