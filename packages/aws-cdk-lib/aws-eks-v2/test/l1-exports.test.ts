import * as eks from '../lib';

test('L1 constructs are exported from aws-eks-v2', () => {
  expect(eks.CfnAddon).toBeDefined();
  expect(eks.CfnAccessEntry).toBeDefined();
  expect(eks.CfnCapability).toBeDefined();
  expect(eks.CfnCluster).toBeDefined();
  expect(eks.CfnFargateProfile).toBeDefined();
  expect(eks.CfnIdentityProviderConfig).toBeDefined();
  expect(eks.CfnNodegroup).toBeDefined();
  expect(eks.CfnPodIdentityAssociation).toBeDefined();
});
