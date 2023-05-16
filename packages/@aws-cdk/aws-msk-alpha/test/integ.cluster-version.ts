import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as msk from '../lib/index';
import { KafkaVersion } from '../lib/index';
import { Construct } from 'constructs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Vpc } from 'aws-cdk-lib/aws-ec2';

const versions: KafkaVersion[] = [
  KafkaVersion.V2_2_1,
  KafkaVersion.V2_3_1,
  KafkaVersion.V2_4_1_1,
  KafkaVersion.V2_5_1,
  KafkaVersion.V2_6_0,
  KafkaVersion.V2_6_1,
  KafkaVersion.V2_6_2,
  KafkaVersion.V2_6_3,
  KafkaVersion.V2_7_0,
  KafkaVersion.V2_7_1,
  KafkaVersion.V2_7_2,
  KafkaVersion.V2_8_0,
  KafkaVersion.V2_8_1,
  KafkaVersion.V3_1_1,
  KafkaVersion.V3_2_0,
  KafkaVersion.V3_3_1,
  KafkaVersion.V3_3_2,
  KafkaVersion.V3_4_0,
];

class KafkaVersionTest extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const vpc = new Vpc(this, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

    versions.forEach(version => {
      const versionName = version.version.replace(/\./g, '-');
      new msk.Cluster(this, `ClusterVersion${versionName}`, {
        clusterName: `cluster-v${versionName}`,
        kafkaVersion: version,
        vpc,
        removalPolicy: RemovalPolicy.DESTROY,
      });
    });
  }
}

const app = new App();
new IntegTest(app, 'KafkaVersionIntegTest', {
  enableLookups: true,
  testCases: [
    new KafkaVersionTest(app, 'KafkaVersionTestStack'),
  ],
});
app.synth();
