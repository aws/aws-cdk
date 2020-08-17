import { EbsDeviceVolumeType } from '@aws-cdk/aws-ec2';
import { App, Construct, Stack, StackProps } from '@aws-cdk/core';
import * as es from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new es.Domain(this, 'Domain', {
      version: es.ElasticsearchVersion.V7_1,
      clusterConfig: {
        masterNodes: 3,
        masterNodeInstanceType: 'm5.large.elasticsearch',
        dataNodes: 3,
        dataNodeInstanceType: 'm5.large.elasticsearch',
      },
      ebs: {
        volumeSize: 10,
        volumeType: EbsDeviceVolumeType.GENERAL_PURPOSE_SSD,
      },
      logging: {
        slowSearchLogEnabled: true,
        appLogEnabled: true,
      },
      nodeToNodeEncryption: true,
      encryptionAtRest: {
        enabled: true,
      },
    });
  }
}

const app = new App();
new TestStack(app, 'cdk-integ-elasticsearch');
app.synth();
