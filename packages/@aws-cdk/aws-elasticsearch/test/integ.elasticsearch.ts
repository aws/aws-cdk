import { EbsDeviceVolumeType } from '@aws-cdk/aws-ec2';
import { App, Construct, Stack, StackProps } from '@aws-cdk/core';
import * as es from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new es.Domain(this, 'Domain', {
      elasticsearchVersion: es.ElasticsearchVersion.ES_VERSION_7_1,
      clusterConfig: {
        masterNodes: 3,
        masterNodeInstanceType: 'm4.large.elasticsearch',
        dataNodes: 3,
        dataNodeInstanceType: 'm4.large.elasticsearch',
      },
      ebsOptions: {
        volumeSize: 10,
        volumeType: EbsDeviceVolumeType.GENERAL_PURPOSE_SSD,
      },
      logPublishingOptions: {
        slowSearchLogEnabed: true,
        appLogEnabled: true,
      },
      nodeToNodeEncryptionEnabled: true,
      encryptionAtRestOptions: {
        enabled: true,
      },
    });
  }
}

const app = new App();
new TestStack(app, 'cdk-integ-elasticsearch');
app.synth();
