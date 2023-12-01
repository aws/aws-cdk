import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { ClientAuthentication, Cluster, KafkaVersion } from '../lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';

const app = new App();

const stack = new Stack(app, 'ScramSecretTestStack');

const vpc = new Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const cluster = new Cluster(stack, 'Cluster', {
  vpc,
  clusterName: 'integ-test',
  kafkaVersion: KafkaVersion.V3_5_1,
  removalPolicy: RemovalPolicy.DESTROY,
  clientAuthentication: ClientAuthentication.sasl({ scram: true }),
});

cluster.addUser('integ-user-1', 'integ-user-2');

const integTest = new IntegTest(app, 'ScramSecretIntegTest', {
  testCases: [stack],
});

const scramSecrets = integTest.assertions.awsApiCall('Kafka', 'listScramSecrets', {
  ClusterArn: cluster.clusterArn,
});
scramSecrets.expect(ExpectedResult.objectLike({
  SecretArnList: [
    Match.stringLikeRegexp(`arn:aws:secretsmanager:${stack.region}:${stack.account}:secret:AmazonMSK_integ-test_integ-user-1-.*`),
    Match.stringLikeRegexp(`arn:aws:secretsmanager:${stack.region}:${stack.account}:secret:AmazonMSK_integ-test_integ-user-2-.*`),
  ],
}));
