import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as msk from '../lib/index';
import { KafkaVersion } from '../lib/index';
import { Construct } from 'constructs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Vpc } from 'aws-cdk-lib/aws-ec2';

const storageModeArray: msk.StorageMode[] = [
  msk.StorageMode.TIERED,
  msk.StorageMode.LOCAL,
];

class KafkaStorageModeTest extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const vpc = new Vpc(this, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

    storageModeArray.forEach(sMode => {
      const clusterMode = sMode.toLowerCase();
      new msk.Cluster(this, `storageMode${clusterMode}`, {
        clusterName: `${clusterMode}-cluster`,
        kafkaVersion: KafkaVersion.V2_8_2_TIERED,
        storageMode: sMode,
        vpc,
        removalPolicy: RemovalPolicy.DESTROY,
      });
    });
  }
}

const app = new App();
new IntegTest(app, 'KafkaStorageModeTest', {
  enableLookups: true,
  testCases: [
    new KafkaStorageModeTest(app, 'KafkaStorageModeTestStack'),
  ],
});
app.synth();
