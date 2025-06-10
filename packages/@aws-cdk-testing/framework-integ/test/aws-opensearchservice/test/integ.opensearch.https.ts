import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

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
  public readonly domain: opensearch.Domain;

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

    this.domain = new opensearch.Domain(this, 'domain', domainProps);
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-integ-opensearch-https');

const integ = new IntegTest(app, 'integ-openseach-https', { testCases: [stack] });

// Assert TLS security policy using AwsApiCall
const describeResponse = integ.assertions.awsApiCall('OpenSearch', 'describeDomain', {
  DomainName: stack.domain.domainName,
});

// Verify domain endpoint configuration
describeResponse.expect(ExpectedResult.objectLike({
  DomainStatus: {
    DomainEndpointOptions: {
      EnforceHTTPS: true,
      TLSSecurityPolicy: 'Policy-Min-TLS-1-2-2019-07',
    },
  },
}));
