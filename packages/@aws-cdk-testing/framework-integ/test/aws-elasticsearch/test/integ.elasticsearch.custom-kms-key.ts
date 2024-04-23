import { EbsDeviceVolumeType } from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as es from 'aws-cdk-lib/aws-elasticsearch';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const key = new kms.Key(this, 'Key');

    const domainProps: es.DomainProps = {
      removalPolicy: RemovalPolicy.DESTROY,
      version: es.ElasticsearchVersion.V7_1,
      ebs: {
        volumeSize: 10,
        volumeType: EbsDeviceVolumeType.GENERAL_PURPOSE_SSD,
      },
      logging: {
        slowSearchLogEnabled: true,
        appLogEnabled: true,
      },
      nodeToNodeEncryption: true,
      encryptionAtRest: {
        enabled: true,
        kmsKey: key,
      },
      // test the access policies custom resource works
      accessPolicies: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['es:ESHttp*'],
          principals: [new iam.AccountRootPrincipal()],
          resources: ['*'],
        }),
      ],
    };

    new es.Domain(this, 'Domain', domainProps);
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-integ-elasticsearch-custom-kms-key');

const integTest = new IntegTest(app, 'ElasticsearchCustomKmsInteg', {
  testCases: [stack],
  diffAssets: true,
});
const resourcePolicies = integTest.assertions.awsApiCall('CloudWatchLogs', 'describeResourcePolicies');
// asserting that AwsCustomResource used for CloudWatchLogs putResourcePolicy correctly adds resource policy name and document
resourcePolicies.expect(ExpectedResult.objectLike({
  resourcePolicies: Match.arrayWith([
    Match.objectLike({
      policyName: 'ESLogPolicyc82ca7bfe2f2589b859ebab89e88da2efd284adfad',
      policyDocument: Match.serializedJson(Match.objectLike({
        Version: '2012-10-17',
        Statement: [{
          Effect: 'Allow',
          Principal: {
            Service: 'es.amazonaws.com',
          },
          Action: [
            'logs:PutLogEvents',
            'logs:CreateLogStream',
          ],
          Resource: [
            Match.stringLikeRegexp('arn:aws:logs:.*:.*:log-group:cdk-integ-elasticsearch-custom-kms-key-DomainSlowSearchLogs.*'),
            Match.stringLikeRegexp('arn:aws:logs:.*:.*:log-group:cdk-integ-elasticsearch-custom-kms-key-DomainAppLogs.*'),
          ],
        }],
      })),
    }),
  ]),
}));
app.synth();
