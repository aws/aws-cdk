import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAudf8/iNkQgdvjEdm6xYS
JAyxd/kGTbJfQNg9YhInb7TSm0dGu0yx8yZ3fnpmxuRPqJIlaVr+fT4YRl71gEYa
dlhHmnVegyPNjP9dNqZ7zwNqMEPOPnS/NOHbJj1KYKpn1f8pPNycQ5MQCntKGnSj
6fc+nbcC0joDvGz80xuy1W4hLV9oC9c3GT26xfZb2jy9MVtA3cppNuTwqrFi3t6e
0iGpraxZlT5wewjZLpQkngqYr6s3aucPAZVsGTEYPo4nD5mswmtZOm+tgcOrivtD
/3sD/qZLQ6c5siqyS8aTraD6y+VXugujfarTU65IeZ6QAUbLMsWuZOIi5Jn8zAwx
NQIDAQAB
-----END PUBLIC KEY-----`;

class PublicKeyStableCallerReferenceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a PublicKey with the stable caller reference feature flag enabled
    const publicKeyWithStableRef = new cloudfront.PublicKey(this, 'PublicKeyWithStableRef', {
      encodedKey: publicKey,
      publicKeyName: 'stable-caller-ref-key',
      comment: 'Public key with stable caller reference',
    });

    // Create a KeyGroup using the public key
    new cloudfront.KeyGroup(this, 'KeyGroupWithStableRef', {
      items: [publicKeyWithStableRef],
      keyGroupName: 'stable-caller-ref-key-group',
      comment: 'Key group using stable caller reference public key',
    });

    // Output the public key ID for verification
    new cdk.CfnOutput(this, 'PublicKeyId', {
      value: publicKeyWithStableRef.publicKeyId,
      description: 'ID of the public key with stable caller reference',
    });
  }
}

const app = new cdk.App();

const stack = new PublicKeyStableCallerReferenceStack(app, 'PublicKeyStableCallerReferenceStack', {
  env: {
    region: 'us-east-1', // CloudFront resources must be in us-east-1
  },
});

new IntegTest(app, 'PublicKeyStableCallerReferenceTest', {
  testCases: [stack],
  diffAssets: true,
});
