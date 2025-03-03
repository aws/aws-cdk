import { EbsDeviceVolumeType } from 'aws-cdk-lib/aws-ec2';
import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const domainProps: opensearch.DomainProps = {
      removalPolicy: RemovalPolicy.DESTROY,
      version: opensearch.EngineVersion.OPENSEARCH_2_15,
      ebs: {
        volumeSize: 10,
        volumeType: EbsDeviceVolumeType.GP3,
      },
      capacity: {
        multiAzWithStandbyEnabled: false,
        masterNodes: 3,
        dataNodes: 2,
        nodeOptions: [
          {
            nodeType: opensearch.NodeType.COORDINATOR,
            nodeConfig: {
              enabled: true,
              count: 2,
              type: 'm5.large.search',
            },
          },
        ],
      },
      zoneAwareness: {
        enabled: true,
        availabilityZoneCount: 2,
      },
    };

    new opensearch.Domain(this, 'Domain1', domainProps);
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-integ-os-nodeoptions');

new IntegTest(app, 'OpenSearchNodeOptionsInteg', {
  testCases: [stack],
  diffAssets: true,
});
app.synth();
