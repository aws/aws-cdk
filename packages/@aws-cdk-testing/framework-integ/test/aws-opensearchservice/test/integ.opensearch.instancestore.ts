import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // deploy the latest OpenSearch domain with minimal configuration
    // required for r7gd instance
    const domainProps: opensearch.DomainProps = {
      removalPolicy: RemovalPolicy.DESTROY,
      version: opensearch.EngineVersion.OPENSEARCH_2_15,
      capacity: {
        dataNodes: 2,
        dataNodeInstanceType: 'r7gd.medium.search',
        multiAzWithStandbyEnabled: false,
      },
      ebs: {
        enabled: false,
      },
      zoneAwareness: {
        enabled: true,
        availabilityZoneCount: 2,
      },
    };

    new opensearch.Domain(this, 'Domain', domainProps);
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-integ-opensearch-instancestore');

new IntegTest(app, 'Integ', { testCases: [stack] });
