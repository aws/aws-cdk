import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as sns from 'aws-cdk-lib/aws-sns';

/*
 * A grant that adds a statement to a key policy can be used as a dependency.
 * Each topic depends on the key that holds the statement.
 */

const app = new App();
const stack = new Stack(app, 'aws-cdk-kms-key-grant-dependency');

function newCfnKey(id: string): kms.CfnKey {
  const key = new kms.CfnKey(stack, id, {
    pendingWindowInDays: 7,
    keyPolicy: {
      Version: '2012-10-17',
      Statement: [{
        Effect: 'Allow',
        Principal: { AWS: `arn:${stack.partition}:iam::${stack.account}:root` },
        Action: 'kms:*',
        Resource: '*',
      }],
    },
  });
  key.applyRemovalPolicy(RemovalPolicy.DESTROY);
  return key;
}

const snsPrincipal = new iam.ServicePrincipal('sns.amazonaws.com');

// L2 Key: a service principal is granted through the key policy
const key = new kms.Key(stack, 'Key', { removalPolicy: RemovalPolicy.DESTROY });
const keyTopic = new sns.Topic(stack, 'KeyTopic');
key.grantDecrypt(snsPrincipal).applyBefore(keyTopic);

// L1 CfnKey: KeyGrants always adds the statement to the key policy
const cfnKey = newCfnKey('CfnKey');
const role = new iam.Role(stack, 'Role', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
});
const cfnKeyTopic = new sns.Topic(stack, 'CfnKeyTopic');
cfnKeyTopic.node.addDependency(kms.KeyGrants.fromKey(cfnKey).decrypt(role));

// Key.fromCfnKey(): the statement is added to the policy of the CfnKey
const importedCfnKey = newCfnKey('ImportedCfnKey');
const fromCfnKeyTopic = new sns.Topic(stack, 'FromCfnKeyTopic');
kms.Key.fromCfnKey(importedCfnKey).grantDecrypt(snsPrincipal).applyBefore(fromCfnKeyTopic);

const integ = new IntegTest(app, 'KeyGrantDependencyIntegTest', {
  testCases: [stack],
});

const decryptStatement = (principal: Record<string, unknown>) => ExpectedResult.objectLike({
  Policy: Match.serializedJson(Match.objectLike({
    Statement: Match.arrayWith([Match.objectLike({ Action: 'kms:Decrypt', Principal: principal })]),
  })),
});

integ.assertions.awsApiCall('KMS', 'getKeyPolicy', { KeyId: key.keyId, PolicyName: 'default' })
  .expect(decryptStatement({ Service: 'sns.amazonaws.com' }));
integ.assertions.awsApiCall('KMS', 'getKeyPolicy', { KeyId: cfnKey.ref, PolicyName: 'default' })
  .expect(decryptStatement({ AWS: role.roleArn }));
integ.assertions.awsApiCall('KMS', 'getKeyPolicy', { KeyId: importedCfnKey.ref, PolicyName: 'default' })
  .expect(decryptStatement({ Service: 'sns.amazonaws.com' }));
