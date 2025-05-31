import { EbsDeviceVolumeType } from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as es from 'aws-cdk-lib/aws-elasticsearch';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

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
      },
      advancedOptions: {
        'rest.action.multi.allow_explicit_index': 'false',
        'indices.fielddata.cache.size': '25',
        'indices.query.bool.max_clause_count': '2048',
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

    // create 2 elasticsearch domains to ensure that Cloudwatch Log Group policy names dont conflict
    new es.Domain(this, 'Domain1', domainProps);
    new es.Domain(this, 'Domain2', domainProps);
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
new TestStack(app, 'cdk-integ-elasticsearch');
app.synth();
