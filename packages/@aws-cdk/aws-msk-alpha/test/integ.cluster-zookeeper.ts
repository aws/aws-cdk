import { App, RemovalPolicy, Stack, CfnOutput } from 'aws-cdk-lib';
import * as msk from '../lib/index';
import { Construct } from 'constructs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Vpc } from 'aws-cdk-lib/aws-ec2';

/*
 * Stack verification steps:
 *
 * -- the zookeeper string is returned as a cfnoutput to the console
 */

class KafkaZookeeperTest extends Stack {
  public readonly zookeeperConnection: string;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    const vpc = new Vpc(this, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

    const cluster = new msk.Cluster(this, 'ClusterZookeeper', {
      clusterName: 'cluster-zookeeper',
      kafkaVersion: msk.KafkaVersion.V3_4_0,
      vpc,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.zookeeperConnection = cluster.zookeeperConnectionString;

    new CfnOutput(this, 'Zookeeper', {
      value: this.zookeeperConnection,
    });
  }
}

const app = new App();
const testCase = new KafkaZookeeperTest(app, 'KafkaZookeeperTestStack');
new IntegTest(app, 'KafkaZookeeperIntegTest', {
  testCases: [testCase],
});

app.synth();
