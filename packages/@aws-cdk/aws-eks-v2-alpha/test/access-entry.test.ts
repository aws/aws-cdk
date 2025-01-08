import { Template } from 'aws-cdk-lib/assertions';
import { App, Stack } from 'aws-cdk-lib/core';
import {
  AccessEntry, AccessEntryProps, AccessEntryType,
  AccessScopeType, IAccessPolicy, Cluster, AccessPolicy, KubernetesVersion, AuthenticationMode,
} from '../lib';

describe('AccessEntry', () => {
  let app: App;
  let stack: Stack;
  let cluster: Cluster;
  let mockAccessPolicies: IAccessPolicy[];
  let mockProps: AccessEntryProps;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'test-stack');
    cluster = new Cluster(stack, 'Cluster', {
      version: KubernetesVersion.V1_29,
      authenticationMode: AuthenticationMode.API,
    });

    mockAccessPolicies = [
      {
        accessScope: {
          type: AccessScopeType.NAMESPACE,
          namespaces: ['default'],
        },
        policy: 'mock-policy-arn',
      },
    ];

    mockProps = {
      cluster,
      accessPolicies: mockAccessPolicies,
      principal: 'mock-principal-arn',
    };
  });

  test('creates a new AccessEntry', () => {
    // WHEN
    new AccessEntry(stack, 'AccessEntry', {
      cluster,
      accessPolicies: mockAccessPolicies,
      principal: 'mock-principal-arn',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EKS::AccessEntry', {
      ClusterName: { Ref: 'ClusterEB0386A7' },
      PrincipalArn: 'mock-principal-arn',
      AccessPolicies: [
        {
          AccessScope: {
            Namespaces: ['default'],
            Type: 'namespace',
          },
          PolicyArn: 'mock-policy-arn',
        },
      ],
    });
  });

  test.each(Object.values(AccessEntryType))(
    'creates a new AccessEntry for AccessEntryType %s',
    (accessEntryType) => {
      // WHEN
      new AccessEntry(stack, `AccessEntry-${accessEntryType}`, {
        cluster,
        accessPolicies: mockAccessPolicies,
        principal: 'mock-principal-arn',
        accessEntryType,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EKS::AccessEntry', {
        ClusterName: { Ref: 'ClusterEB0386A7' },
        PrincipalArn: 'mock-principal-arn',
        Type: accessEntryType,
      });
    },
  );

  test('adds new access policies with addAccessPolicies()', () => {
    // GIVEN
    const accessEntry = new AccessEntry(stack, 'AccessEntry', mockProps);
    const newAccessPolicy = AccessPolicy.fromAccessPolicyName('AmazonEKSClusterAdminPolicy', {
      accessScopeType: AccessScopeType.CLUSTER,
    });
    // WHEN
    accessEntry.addAccessPolicies([newAccessPolicy]);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EKS::AccessEntry', {
      ClusterName: { Ref: 'ClusterEB0386A7' },
      PrincipalArn: mockProps.principal,
      AccessPolicies: [
        { PolicyArn: mockProps.accessPolicies[0].policy },
        {
          AccessScope: {
            Type: 'cluster',
          },
          PolicyArn: {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':eks::aws:cluster-access-policy/AmazonEKSClusterAdminPolicy',
              ],
            ],
          },
        },
      ],
    });
  });

  test('imports an AccessEntry from attributes', () => {
    // GIVEN
    const importedAccessEntryName = 'imported-access-entry-name';
    const importedAccessEntryArn = 'imported-access-entry-arn';

    // WHEN
    const importedAccessEntry = AccessEntry.fromAccessEntryAttributes(stack, 'ImportedAccessEntry', {
      accessEntryName: importedAccessEntryName,
      accessEntryArn: importedAccessEntryArn,
    });

    // THEN
    expect(importedAccessEntry.accessEntryName).toEqual(importedAccessEntryName);
    expect(importedAccessEntry.accessEntryArn).toEqual(importedAccessEntryArn);

    Template.fromStack(stack).resourceCountIs('AWS::EKS::AccessEntry', 1);
  });
});
