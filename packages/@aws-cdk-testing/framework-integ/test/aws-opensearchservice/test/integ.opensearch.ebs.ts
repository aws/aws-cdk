import type { StackProps } from 'aws-cdk-lib';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const instanceTypes = ['i4g.large.search', 'i4i.xlarge.search', 'r7gd.xlarge.search', 'r8gd.medium.search'];

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

// These instance types (i4g, i4i, r7gd, r8gd) are not available in all regions.
// Verified via: aws opensearch list-instance-type-details --engine-version OpenSearch_2.17 --region <region>
// Regions with all 4 types: us-east-1, us-east-2, us-west-2, eu-west-1, ca-central-1
new IntegTest(app, 'Integ', {
  testCases: [stack],
  regions: ['us-east-1', 'us-east-2', 'us-west-2', 'eu-west-1', 'ca-central-1'],
});
