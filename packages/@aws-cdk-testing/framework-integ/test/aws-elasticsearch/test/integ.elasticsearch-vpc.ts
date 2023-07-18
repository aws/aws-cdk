import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, Stack, StackProps, RemovalPolicy, CfnResource } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as es from 'aws-cdk-lib/aws-elasticsearch';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const serviceLinkedRole = new CfnResource(this, 'ServiceLinkedRole', {
      type: 'AWS::IAM::ServiceLinkedRole',
      properties: {
        AWSServiceName: 'es.amazonaws.com',
        Description: 'Role for ElasticSearch VPC Test',
      },
    });

    const vpc = new ec2.Vpc(this, 'Vpc', { restrictDefaultSecurityGroup: false });
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
    const domain = new es.Domain(this, 'Domain', domainProps);
    domain.node.addDependency(serviceLinkedRole);
  }
}

const app = new App();
const testCase = new TestStack(app, 'cdk-integ-elasticsearch-vpc');
new integ.IntegTest(app, 'cdk-integ-elasticsearch-vpc-test', {
  testCases: [testCase],
});
app.synth();
