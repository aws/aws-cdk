import { App, Stack } from 'aws-cdk-lib';
import { ClientAuthentication, Cluster, KafkaVersion } from '../lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();

const stack = new Stack(app, 'ScramSecretTestStack');

const vpc = new Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const cluster = new Cluster(stack, 'Cluster', {
  clusterName: 'integ-test',
  kafkaVersion: KafkaVersion.V3_4_0,
  vpc,
  clientAuthentication: ClientAuthentication.sasl({ scram: true }),
});

cluster.addUser('integ-user-1', 'integ-user-2');

const integTest = new IntegTest(app, 'ScramSecretIntegTest', {
  testCases: [new Stack(app, 'ScramSecretTestStack')],
});

integTest.assertions.awsApiCall('Kafka', 'listScramSecrets', {
  ClusterArn: cluster.clusterArn,
});
