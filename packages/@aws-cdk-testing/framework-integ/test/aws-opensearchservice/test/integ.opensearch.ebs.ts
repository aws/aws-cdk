import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const instanceTypes = ['i4g.large.search', 'i4i.xlarge.search', 'r7gd.xlarge.search'];

    instanceTypes.forEach((instanceType, index) => {
      new opensearch.Domain(this, `Domain${index + 1}`, {
        removalPolicy: RemovalPolicy.DESTROY,
        version: opensearch.EngineVersion.OPENSEARCH_2_17,
        // specify the instance type that supports instance store
        capacity: {
          multiAzWithStandbyEnabled: false,
          dataNodeInstanceType: instanceType,
          dataNodes: 1,
        },
        // force ebs configuration to be disabled
        ebs: {
          enabled: false,
        },
      });
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-integ-opensearch-instance-store');

new IntegTest(app, 'Integ', { testCases: [stack] });
