import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Key } from 'aws-cdk-lib/aws-kms';
import { ClientAuthentication, Cluster, KafkaVersion } from '../lib';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new Stack(app, 'ScramSecretUserKeyTestStack');

const vpc = new Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

// Customer-provided KMS key for SASL/SCRAM authentication (BYOK).
const key = new Key(stack, 'SaslScramKey', {
  description: 'Customer-provided key for MSK SASL/SCRAM secrets',
  removalPolicy: RemovalPolicy.DESTROY,
});

const cluster = new Cluster(stack, 'Cluster', {
  vpc,
  clusterName: 'integ-test-user-key',
  kafkaVersion: KafkaVersion.V3_5_1,
  removalPolicy: RemovalPolicy.DESTROY,
  clientAuthentication: ClientAuthentication.sasl({ scram: true, key }),
});

// This must succeed using the provided key (previously threw MissingAuthenticationKmsKey).
cluster.addUser('integ-user-1');

const integTest = new IntegTest(app, 'ScramSecretUserKeyIntegTest', {
  testCases: [stack],
});

const scramSecrets = integTest.assertions.awsApiCall('Kafka', 'listScramSecrets', {
  ClusterArn: cluster.clusterArn,
});
scramSecrets.expect(ExpectedResult.objectLike({
  SecretArnList: [
    Match.stringLikeRegexp(`arn:aws:secretsmanager:${stack.region}:${stack.account}:secret:AmazonMSK_integ-test-user-key_integ-user-1-.*`),
  ],
}));
