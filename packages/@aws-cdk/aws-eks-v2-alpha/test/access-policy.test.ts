import { Aws } from 'aws-cdk-lib/core';
import { AccessPolicy, AccessPolicyArn, AccessPolicyNameOptions, AccessScopeType } from '../lib';

describe('AccessPolicy', () => {
  describe('fromAccessPolicyName', () => {
    test('creates an AccessPolicy with cluster scope', () => {
      const accessPolicy = AccessPolicy.fromAccessPolicyName('AmazonEKSClusterAdminPolicy', {
        accessScopeType: AccessScopeType.CLUSTER,
      });

      expect(accessPolicy.accessScope).toEqual({
        type: AccessScopeType.CLUSTER,
        namespaces: undefined,
      });
      expect(accessPolicy.policy).toEqual(`arn:${Aws.PARTITION}:eks::aws:cluster-access-policy/AmazonEKSClusterAdminPolicy`);
    });

    test('creates an AccessPolicy with namespace scope', () => {
      const accessPolicy = AccessPolicy.fromAccessPolicyName('AmazonEKSAdminPolicy', {
        accessScopeType: AccessScopeType.NAMESPACE,
      });

      expect(accessPolicy.accessScope).toEqual({
        type: AccessScopeType.NAMESPACE,
        namespaces: undefined,
      });
      expect(accessPolicy.policy).toEqual(`arn:${Aws.PARTITION}:eks::aws:cluster-access-policy/AmazonEKSAdminPolicy`);
    });

    test('creates an AccessPolicy with custom scope', () => {
      const options: AccessPolicyNameOptions = {
        namespaces: ['custom-namespace'],
        accessScopeType: AccessScopeType.NAMESPACE,
      };

      const accessPolicy = AccessPolicy.fromAccessPolicyName('AmazonEKSAdminPolicy', options);

      expect(accessPolicy.accessScope).toEqual({
        type: AccessScopeType.NAMESPACE,
        namespaces: ['custom-namespace'],
      });
      expect(accessPolicy.policy).toEqual(`arn:${Aws.PARTITION}:eks::aws:cluster-access-policy/AmazonEKSAdminPolicy`);
    });
  });

  describe('constructor', () => {
    test('creates an AccessPolicy with the provided props', () => {

      const accessPolicy = new AccessPolicy({
        accessScope: {
          type: AccessScopeType.NAMESPACE,
          namespaces: ['default'],
        },
        policy: AccessPolicyArn.of('mock-policy-name'),
      });

      expect(accessPolicy.accessScope).toEqual({ namespaces: ['default'], type: 'namespace' });
      expect(accessPolicy.policy).toEqual(`arn:${Aws.PARTITION}:eks::aws:cluster-access-policy/mock-policy-name`);
    });
  });
});

describe('AccessPolicyArn', () => {
  describe('static methods', () => {
    test('static property', () => {
      expect(AccessPolicyArn.AMAZON_EKS_ADMIN_POLICY.policyArn).toEqual(`arn:${Aws.PARTITION}:eks::aws:cluster-access-policy/AmazonEKSAdminPolicy`);
      expect(AccessPolicyArn.AMAZON_EKS_CLUSTER_ADMIN_POLICY.policyArn).toEqual(`arn:${Aws.PARTITION}:eks::aws:cluster-access-policy/AmazonEKSClusterAdminPolicy`);
      expect(AccessPolicyArn.AMAZON_EKS_ADMIN_VIEW_POLICY.policyArn).toEqual(`arn:${Aws.PARTITION}:eks::aws:cluster-access-policy/AmazonEKSAdminViewPolicy`);
      expect(AccessPolicyArn.AMAZON_EKS_EDIT_POLICY.policyArn).toEqual(`arn:${Aws.PARTITION}:eks::aws:cluster-access-policy/AmazonEKSEditPolicy`);
      expect(AccessPolicyArn.AMAZON_EKS_VIEW_POLICY.policyArn).toEqual(`arn:${Aws.PARTITION}:eks::aws:cluster-access-policy/AmazonEKSViewPolicy`);
    });

    test('of', () => {
      const policyArn = AccessPolicyArn.of('custom-policy');
      expect(policyArn.policyArn).toEqual(`arn:${Aws.PARTITION}:eks::aws:cluster-access-policy/custom-policy`);
    });
  });

  describe('constructor', () => {
    test('constructs a new AccessPolicyArn instance', () => {
      const policyArn = new AccessPolicyArn('custom-policy');
      expect(policyArn.policyName).toEqual('custom-policy');
      expect(policyArn.policyArn).toEqual(`arn:${Aws.PARTITION}:eks::aws:cluster-access-policy/custom-policy`);
    });
  });
});
