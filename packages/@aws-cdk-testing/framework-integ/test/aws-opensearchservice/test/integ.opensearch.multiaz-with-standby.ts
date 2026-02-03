import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { EbsDeviceVolumeType } from 'aws-cdk-lib/aws-ec2';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();

const stack = new Stack(app, 'cdk-integ-opensearch-multiaz-with-standby');

const domainProps: opensearch.DomainProps = {
  removalPolicy: RemovalPolicy.DESTROY,
  version: opensearch.EngineVersion.OPENSEARCH_1_3,
  ebs: {
    volumeSize: 10,
    volumeType: EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3,
  },
  zoneAwareness: {
    enabled: true,
    availabilityZoneCount: 3,
  },
  capacity: {
    multiAzWithStandbyEnabled: true,
    masterNodes: 3,
    dataNodes: 3,
  },
};

new opensearch.Domain(stack, 'Domain', domainProps);

new IntegTest(app, 'IntegOpenSearchMultiAzWithStandby', { testCases: [stack] });

app.synth();
