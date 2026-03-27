import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import type { StackProps } from 'aws-cdk-lib';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import type { Construct } from 'constructs';
import * as msk from '../lib/index';
import { KafkaVersion } from '../lib/index';

const storageModeArray: msk.StorageMode[] = [
  msk.StorageMode.TIERED,
  msk.StorageMode.LOCAL,
];

class KafkaStorageModeTest extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const vpc = new Vpc(this, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

    storageModeArray.forEach(sMode => {
      const clusterMode = sMode.toLowerCase();
      new msk.Cluster(this, `storageMode${clusterMode}`, {
        clusterName: `${clusterMode}-cluster`,
        kafkaVersion: KafkaVersion.V3_6_0,
        storageMode: sMode,
        vpc,
        removalPolicy: RemovalPolicy.DESTROY,
      });
    });
  }
}

const app = new App();
const testCase = new KafkaStorageModeTest(app, 'KafkaStorageModeTestStack');
new IntegTest(app, 'KafkaStorageModeIntegTest', { testCases: [testCase] });
app.synth();
