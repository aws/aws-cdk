import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const domainProps: opensearch.DomainProps = {
      version: opensearch.EngineVersion.OPENSEARCH_2_13,
      removalPolicy: RemovalPolicy.DESTROY,
      logging: {
        auditLogEnabled: false,
        appLogEnabled: false,
        slowIndexLogEnabled: false,
        slowSearchLogEnabled: false,
      },
      capacity: {
        multiAzWithStandbyEnabled: false,
      },
    };

    new opensearch.Domain(this, 'Domain', domainProps);
  }
}

const app = new App();
new TestStack(app, 'cdk-integ-opensearch-with-logging-disabled');
app.synth();
