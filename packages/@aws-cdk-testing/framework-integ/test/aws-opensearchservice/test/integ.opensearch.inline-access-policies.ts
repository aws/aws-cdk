import type { StackProps } from 'aws-cdk-lib';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import * as cxapi from 'aws-cdk-lib/cx-api';
import type { Construct } from 'constructs';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

/**
 * Integration test for the `@aws-cdk/aws-opensearchservice:inlineAccessPolicies`
 * feature flag.
 *
 * The default `accessPolicies` path emits a `Custom::OpenSearchAccessPolicy`
 * Lambda-backed custom resource that calls `UpdateDomainConfig` after the
 * domain is created. With the feature flag enabled, the policy is written
 * directly onto the L1 `AWS::OpenSearchService::Domain.AccessPolicies`
 * property and no custom resource is synthesized — eliminating the
 * post-create IAM propagation race for `es:UpdateDomainConfig`.
 *
 * Even self-referential policies (e.g. `${domain.domainArn}/*`, used by
 * `useUnsignedBasicAuth`) take the inline path when the domain has a
 * synth-time-resolvable name: the construct rewrites `Fn::GetAtt` against
 * its own logical id into a literal ARN built from the resolved
 * `domainName`. This integ uses `domain.domainArn` directly to exercise
 * that rewrite end-to-end.
 */

class TestStack extends Stack {
  public readonly domainName: string;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.domainName = 'inline-policy-domain';

    const domain = new opensearch.Domain(this, 'domain', {
      domainName: this.domainName,
      version: opensearch.EngineVersion.OPENSEARCH_2_17,
      removalPolicy: RemovalPolicy.DESTROY,
      capacity: { multiAzWithStandbyEnabled: false },
      enforceHttps: true,
    });

    domain.addAccessPolicies(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      principals: [new iam.AccountRootPrincipal()],
      actions: ['es:ESHttp*'],
      // Self-references against the domain's own ARN are rewritten to a literal
      // ARN at synth time and stay on the inline path. Without the rewrite this
      // would have fallen back to the Custom::OpenSearchAccessPolicy resource.
      resources: [`${domain.domainArn}/*`],
    }));
  }
}

const app = new App({
  context: {
    [cxapi.ENABLE_OPENSEARCH_INLINE_ACCESS_POLICIES]: true,
  },
});
const stack = new TestStack(app, 'cdk-integ-opensearch-inline-access-policies');

const integ = new IntegTest(app, 'OpenSearchInlineAccessPoliciesInteg', {
  testCases: [stack],
});

const domainConfig = integ.assertions.awsApiCall('OpenSearch', 'describeDomainConfig', {
  DomainName: stack.domainName,
});

// Confirm the inline access policy was applied at create-time without the
// custom-resource update step.
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

app.synth();
