import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/**
 * After deploying this test, you can verify that the OpenSearch domain using:
 *
 * $ aws es describe-elasticsearch-domain \
 * --region us-east-1 \
 * --domain-name DOMAIN_NAME \
 * --query 'DomainStatus.DomainEndpointOptions' \
 * --output json
 */

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // deploy opensearch domain with minimal configuration
    const domainProps: opensearch.DomainProps = {
      version: opensearch.EngineVersion.OPENSEARCH_2_17,
      removalPolicy: RemovalPolicy.DESTROY,
      capacity: {
        multiAzWithStandbyEnabled: false,
      },
      enforceHttps: true,
    };

    new opensearch.Domain(this, 'domain', domainProps);
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-integ-opensearch-https');

new IntegTest(app, 'integ-openseach-https', { testCases: [stack] });
