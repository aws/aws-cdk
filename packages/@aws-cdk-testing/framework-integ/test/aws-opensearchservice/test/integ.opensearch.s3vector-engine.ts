import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  public readonly domainName: string;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const domain = new opensearch.Domain(this, 'Domain', {
      removalPolicy: RemovalPolicy.DESTROY,
      version: opensearch.EngineVersion.OPENSEARCH_2_19,
      s3VectorsEngineEnabled: true,
      capacity: {
        dataNodeInstanceType: 'or1.medium.search',
        multiAzWithStandbyEnabled: false,
        masterNodes: 0,
        dataNodes: 1,
      },
      encryptionAtRest: {
        enabled: true,
      },
      ebs: {
        volumeSize: 30,
        volumeType: ec2.EbsDeviceVolumeType.GP3,
      },
    });

    this.domainName = domain.domainName;
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-integ-opensearch-s3vector-engine');

const integ = new IntegTest(app, 'OpenSearchS3VectorEngineInteg', {
  testCases: [stack],
});

const describeDomain = integ.assertions.awsApiCall('OpenSearch', 'describeDomain', {
  DomainName: stack.domainName,
});

describeDomain.assertAtPath(
  'DomainStatus.AIMLOptions.S3VectorsEngine.Enabled',
  ExpectedResult.exact(true),
);
