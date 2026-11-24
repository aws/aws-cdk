import { Annotations, App, CfnOutput, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import { Domain, IdentityProvider } from 'aws-cdk-lib/aws-cloudwatch';

const app = new App();
const stack = new Stack(app, 'OmniDomainIntegStack');

// An account has at most one CloudWatch Omni domain across all Regions. Deploy this test into an
// account without a domain, and not at the same time as another CloudWatch Omni integration test.
const domain = new Domain(stack, 'Domain', {
  domainName: 'cdk-integ-omni-domain',
  identityProviders: [IdentityProvider.IAM],
  removalPolicy: RemovalPolicy.DESTROY,
  tags: { Purpose: 'integ-test' },
});

new CfnOutput(stack, 'DomainId', { value: domain.domainId });
new CfnOutput(stack, 'DomainEndpointUrl', { value: domain.domainEndpointUrl! });

const integ = new IntegTest(app, 'OmniDomainInteg', {
  testCases: [stack],
  regions: ['us-east-1'],
});
Annotations.of(integ).acknowledgeWarning('@aws-cdk/core:crossStackReferencesDefaultStrong',
  'the assertion stack reads the domain ARN through a strong cross-stack reference');

const getDomain = integ.assertions
  .awsApiCall('CloudControl', 'getResource', {
    TypeName: 'AWS::CloudWatch::Domain',
    Identifier: domain.domainArn,
  });
getDomain.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['cloudformation:GetResource', 'cloudwatch:GetDomain', 'cloudwatch:ListTagsForResource'],
  Resource: ['*'],
});
getDomain.expect(ExpectedResult.objectLike({
  ResourceDescription: {
    Properties: Match.serializedJson(Match.objectLike({
      Name: 'cdk-integ-omni-domain',
      IdentityProviders: ['IAM'],
      Status: 'ACTIVE',
    })),
  },
}));
