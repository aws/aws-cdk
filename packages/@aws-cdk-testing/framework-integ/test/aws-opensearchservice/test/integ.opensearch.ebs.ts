import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // deploy the latest opensearch domain with instance store only (no EBS)
    const domainProps: opensearch.DomainProps = {
      removalPolicy: RemovalPolicy.DESTROY,
      version: opensearch.EngineVersion.OPENSEARCH_2_5,
      // specify the instance type that supports instance store
      capacity: {
        multiAzWithStandbyEnabled: false,
        dataNodeInstanceType: 'i4g.large.search',
        dataNodes: 1,
      },
      // force ebs configuration to be disabled
      ebs: {
        enabled: false,
      },
    };

    new opensearch.Domain(this, 'Domain', domainProps);
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-integ-opensearch-instance-store');

new IntegTest(app, 'Integ', { testCases: [stack] });
