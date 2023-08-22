import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import { EbsDeviceVolumeType } from 'aws-cdk-lib/aws-ec2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // deploy the latest opensearch domain with minimal configuration
    // required for gp3 volumes
    const domainProps: opensearch.DomainProps = {
      removalPolicy: RemovalPolicy.DESTROY,
      version: opensearch.EngineVersion.OPENSEARCH_2_5,
      ebs: {
        volumeSize: 30,
        volumeType: EbsDeviceVolumeType.GP3,
        throughput: 125,
        iops: 3000,
      },
    };

    new opensearch.Domain(this, 'Domain', domainProps);
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-integ-opensearch-gp3');

new IntegTest(app, 'Integ', { testCases: [stack] });
