import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import type { StackProps } from 'aws-cdk-lib';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import type { Construct } from 'constructs';
import * as msk from '../lib/index';
import { KafkaVersion } from '../lib/index';

const versions: KafkaVersion[] = [
  KafkaVersion.V3_4_0,
  KafkaVersion.V3_5_1,
  KafkaVersion.V3_6_0,
  KafkaVersion.V3_7_X,
  KafkaVersion.V3_7_X_KRAFT,
  KafkaVersion.V3_8_X,
  KafkaVersion.V3_8_X_KRAFT,
  KafkaVersion.V3_9_X,
  KafkaVersion.V3_9_X_KRAFT,
  KafkaVersion.V4_0_X_KRAFT,
  KafkaVersion.V4_1_X_KRAFT,
];

class KafkaVersionTest extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
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
  testCases: [
    new KafkaVersionTest(app, 'KafkaVersionTestStack'),
  ],
});
