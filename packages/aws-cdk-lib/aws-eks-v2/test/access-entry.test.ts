import { Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as cdk from '../../core';
import { App, Stack } from '../../core';
import type { AccessEntryProps, IAccessPolicy } from '../lib';
import {
  AccessEntry, AccessEntryType,
  AccessScopeType, Cluster, AccessPolicy, KubernetesVersion,
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
      // Determine if this type should have access policies
      const restrictedTypes = [AccessEntryType.EC2, AccessEntryType.HYBRID_LINUX, AccessEntryType.HYPERPOD_LINUX];
      const accessPolicies = restrictedTypes.includes(accessEntryType) ? [] : mockAccessPolicies;

      // WHEN
      new AccessEntry(stack, `AccessEntry-${accessEntryType}`, {
        cluster,
        accessPolicies,
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

    Template.fromStack(stack).resourceCountIs('AWS::EKS::AccessEntry', 0);
  });

  test('applies removal policy', () => {
    new AccessEntry(stack, 'AccessEntry', {
      cluster,
      principal: 'arn:aws:iam::123456789012:role/TestRole',
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      accessPolicies: [],
    });

    Template.fromStack(stack).hasResource('AWS::EKS::AccessEntry', {
      DeletionPolicy: 'Retain',
    });
  });

  describe('validation', () => {
    test.each([AccessEntryType.EC2, AccessEntryType.HYBRID_LINUX, AccessEntryType.HYPERPOD_LINUX])(
      'throws error when %s type has access policies',
      (accessEntryType) => {
        // WHEN & THEN
        expect(() => {
          new AccessEntry(stack, `AccessEntry-${accessEntryType}`, {
            cluster,
            accessPolicies: mockAccessPolicies,
            principal: 'mock-principal-arn',
            accessEntryType,
          });
        }).toThrow(`Access entry type '${accessEntryType}' cannot have access policies attached. Use AccessEntryType.STANDARD for access entries that require policies.`);
      },
    );

    test.each([AccessEntryType.EC2, AccessEntryType.HYBRID_LINUX, AccessEntryType.HYPERPOD_LINUX])(
      'allows %s type with empty access policies',
      (accessEntryType) => {
        // WHEN
        new AccessEntry(stack, `AccessEntry-${accessEntryType}`, {
          cluster,
          accessPolicies: [],
          principal: 'mock-principal-arn',
          accessEntryType,
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::EKS::AccessEntry', {
          ClusterName: { Ref: 'ClusterEB0386A7' },
          PrincipalArn: 'mock-principal-arn',
          Type: accessEntryType,
          AccessPolicies: [],
        });
      },
    );

    test.each([AccessEntryType.STANDARD, AccessEntryType.FARGATE_LINUX, AccessEntryType.EC2_LINUX, AccessEntryType.EC2_WINDOWS])(
      'allows %s type with access policies',
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

    test.each([AccessEntryType.EC2, AccessEntryType.HYBRID_LINUX, AccessEntryType.HYPERPOD_LINUX])(
      'throws error when adding policies to %s type via addAccessPolicies()',
      (accessEntryType) => {
        // GIVEN
        const accessEntry = new AccessEntry(stack, `AccessEntry-${accessEntryType}`, {
          cluster,
          accessPolicies: [],
          principal: 'mock-principal-arn',
          accessEntryType,
        });

        const newAccessPolicy = AccessPolicy.fromAccessPolicyName('AmazonEKSClusterAdminPolicy', {
          accessScopeType: AccessScopeType.CLUSTER,
        });

        // WHEN & THEN
        expect(() => {
          accessEntry.addAccessPolicies([newAccessPolicy]);
        }).toThrow(`Access entry type '${accessEntryType}' cannot have access policies attached. Use AccessEntryType.STANDARD for access entries that require policies.`);
      },
    );

    test.each([AccessEntryType.STANDARD, AccessEntryType.FARGATE_LINUX, AccessEntryType.EC2_LINUX, AccessEntryType.EC2_WINDOWS])(
      'allows adding policies to %s type via addAccessPolicies()',
      (accessEntryType) => {
        // GIVEN
        const accessEntry = new AccessEntry(stack, `AccessEntry-${accessEntryType}`, {
          cluster,
          accessPolicies: [],
          principal: 'mock-principal-arn',
          accessEntryType,
        });

        const newAccessPolicy = AccessPolicy.fromAccessPolicyName('AmazonEKSClusterAdminPolicy', {
          accessScopeType: AccessScopeType.CLUSTER,
        });

        // WHEN
        accessEntry.addAccessPolicies([newAccessPolicy]);

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::EKS::AccessEntry', {
          ClusterName: { Ref: 'ClusterEB0386A7' },
          PrincipalArn: 'mock-principal-arn',
          Type: accessEntryType,
          AccessPolicies: [
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
      },
    );
  });

  describe('iamPrincipal', () => {
    test('creates an AccessEntry with an IAM role', () => {
      // GIVEN
      const role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.ServicePrincipal('eks.amazonaws.com'),
      });

      // WHEN
      new AccessEntry(stack, 'AccessEntry', {
        cluster,
        accessPolicies: mockAccessPolicies,
        iamPrincipal: role,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EKS::AccessEntry', {
        ClusterName: { Ref: 'ClusterEB0386A7' },
        PrincipalArn: stack.resolve(role.roleArn),
      });
    });

    test('creates an AccessEntry with an IAM user', () => {
      // GIVEN
      const user = new iam.User(stack, 'User');

      // WHEN
      new AccessEntry(stack, 'AccessEntry', {
        cluster,
        accessPolicies: mockAccessPolicies,
        iamPrincipal: user,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EKS::AccessEntry', {
        ClusterName: { Ref: 'ClusterEB0386A7' },
        PrincipalArn: stack.resolve(user.userArn),
      });
    });

    test('throws error when both iamPrincipal and principal are specified', () => {
      // GIVEN
      const role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.ServicePrincipal('eks.amazonaws.com'),
      });

      // WHEN & THEN
      expect(() => {
        new AccessEntry(stack, 'AccessEntry', {
          cluster,
          accessPolicies: mockAccessPolicies,
          iamPrincipal: role,
          principal: 'mock-principal-arn',
        });
      }).toThrow('Only one of `iamPrincipal` or `principal` can be specified, not both.');
    });

    test('throws error when neither iamPrincipal nor principal is specified', () => {
      // WHEN & THEN
      expect(() => {
        new AccessEntry(stack, 'AccessEntry', {
          cluster,
          accessPolicies: mockAccessPolicies,
        });
      }).toThrow('Either `iamPrincipal` or `principal` must be specified.');
    });

    test('throws error when iamPrincipal is not a role or user', () => {
      // GIVEN - ServicePrincipal implements IPrincipal but has no roleArn/userArn
      const servicePrincipal = new iam.ServicePrincipal('eks.amazonaws.com');

      // WHEN & THEN
      expect(() => {
        new AccessEntry(stack, 'AccessEntry', {
          cluster,
          accessPolicies: mockAccessPolicies,
          iamPrincipal: servicePrincipal,
        });
      }).toThrow('Cannot determine the ARN from the provided `iamPrincipal`.');
    });
  });
});
