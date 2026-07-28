import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as eks from 'aws-cdk-lib/aws-eks';
import { IAM_OIDC_REJECT_UNAUTHORIZED_CONNECTIONS } from 'aws-cdk-lib/cx-api';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';

const app = new App({
  postCliContext: {
    [IAM_OIDC_REJECT_UNAUTHORIZED_CONNECTIONS]: false,
  },
});
const stack = new Stack(app, 'aws-eks-oidc-provider-test');

// OpenIdConnectProvider uses a custom resource that only needs to extract SSL certificate
// thumbprints via TLS connection. It works with fake cluster IDs (like test2) because
// oidc.eks.us-east-1.amazonaws.com is a real AWS server with valid SSL certificates.
// The Lambda doesn't validate OIDC configuration, only retrieves thumbprints when
// the IAM_OIDC_REJECT_UNAUTHORIZED_CONNECTIONS flag is false.
new eks.OpenIdConnectProvider(stack, 'NoClientsNoThumbprint', {
  url: `https://oidc.eks.${Stack.of(stack).region}.amazonaws.com/id/test2`,
});

const cluster = new eks.Cluster(stack, 'Cluster', {
  ...getClusterVersionConfig(stack, eks.KubernetesVersion.V1_32),
});
// OidcProviderNative uses the native AWS::IAM::OIDCProvider CloudFormation resource
// which validates OIDC providers by fetching /.well-known/openid-configuration.
// Fake cluster IDs return 404 for this endpoint, causing validation to fail.
// eks.OidcProviderNative doesn't expose thumbprints property (unlike iam.OidcProviderNative)
// as there is no use case for using an invalid OIDC issuer URL,
// so we must use a real cluster URL for CloudFormation to successfully validate.
new eks.OidcProviderNative(stack, 'OidcProviderNative', {
  url: cluster.clusterOpenIdConnectIssuerUrl,
});

new integ.IntegTest(app, 'aws-cdk-eks-oidc-provider', {
  testCases: [stack],
});

app.synth();
