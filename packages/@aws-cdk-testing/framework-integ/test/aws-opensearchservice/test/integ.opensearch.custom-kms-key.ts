import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  public readonly domainName: string;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const key = new kms.Key(this, 'Key');

    const domainProps: opensearch.DomainProps = {
      removalPolicy: RemovalPolicy.DESTROY,
      version: opensearch.EngineVersion.ELASTICSEARCH_7_1,
      encryptionAtRest: {
        enabled: true,
        kmsKey: key,
      },
      accessPolicies: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['es:ESHttp*'],
          principals: [new iam.AccountRootPrincipal()],
          resources: ['*'],
        }),
      ],
      capacity: {
        multiAzWithStandbyEnabled: false,
      },
    };

    const domain = new opensearch.Domain(this, 'Domain', domainProps);
    this.domainName = domain.domainName;
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new TestStack(app, 'cdk-integ-opensearch-custom-kms-key');

const integ = new IntegTest(app, 'OpenSearchCustomKmsInteg', {
  testCases: [stack],
  diffAssets: true,
});
const domainConfig = integ.assertions.awsApiCall('OpenSearch', 'describeDomainConfig', {
  DomainName: stack.domainName,
});
// asserting that OpenSearchAccessPolicy for open search correctly updates the domain config with
// defined access policies
domainConfig.assertAtPath(
  'DomainConfig.AccessPolicies.Options.Version',
  ExpectedResult.stringLikeRegexp('^2012-10-17$'),
);
domainConfig.assertAtPath(
  'DomainConfig.AccessPolicies.Options.Statement.0.Effect',
  ExpectedResult.stringLikeRegexp('^Allow$'),
);
domainConfig.assertAtPath(
  'DomainConfig.AccessPolicies.Options.Statement.0.Principal.AWS',
  ExpectedResult.stringLikeRegexp('^arn:aws:iam::.*:root$'),
);
domainConfig.assertAtPath(
  'DomainConfig.AccessPolicies.Options.Statement.0.Action',
  ExpectedResult.stringLikeRegexp('^es:ESHttp[*]$'),
);
domainConfig.assertAtPath(
  'DomainConfig.AccessPolicies.Options.Statement.0.Resource',
  ExpectedResult.stringLikeRegexp('^[*]$'),
);
app.synth();
