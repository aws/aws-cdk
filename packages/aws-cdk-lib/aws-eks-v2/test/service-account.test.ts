import { testFixture, testFixtureCluster } from './util';
import { Match, Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as cdk from '../../core';
import * as eks from '../lib';

describe('service account', () => {
  describe('add Service Account', () => {
    test('defaults should have default namespace and lowercase unique id', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.ServiceAccount(stack, 'MyServiceAccount', { cluster });

      // THEN
      Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
        ServiceToken: {
          'Fn::GetAtt': [
            'ClusterKubectlProviderframeworkonEvent68E0CF80',
            'Arn',
          ],
        },
        Manifest: {
          'Fn::Join': [
            '',
            [
              '[{\"apiVersion\":\"v1\",\"kind\":\"ServiceAccount\",\"metadata\":{\"name\":\"stackmyserviceaccount58b9529e\",\"namespace\":\"default\",\"labels\":{\"app.kubernetes.io/name\":\"stackmyserviceaccount58b9529e\"},\"annotations\":{\"eks.amazonaws.com/role-arn\":\"',
              {
                'Fn::GetAtt': [
                  'MyServiceAccountRoleB41709FF',
                  'Arn',
                ],
              },
              '\"}}}]',
            ],
          ],
        },
      });
      Template.fromStack(stack).hasResourceProperties(iam.CfnRole.CFN_RESOURCE_TYPE_NAME, {
        AssumeRolePolicyDocument: {
          Statement: [
            {
              Action: 'sts:AssumeRoleWithWebIdentity',
              Effect: 'Allow',
              Principal: {
                Federated: {
                  Ref: 'ClusterOpenIdConnectProviderE7EB0530',
                },
              },
              Condition: {
                StringEquals: {
                  'Fn::GetAtt': [
                    'MyServiceAccountConditionJson1ED3BC54',
                    'Value',
                  ],
                },
              },
            },
          ],
          Version: '2012-10-17',
        },
      });
    });

    test('it is possible to add annotations and labels', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.ServiceAccount(stack, 'MyServiceAccount', {
        cluster,
        annotations: {
          'eks.amazonaws.com/sts-regional-endpoints': 'false',
        },
        labels: {
          'some-label': 'with-some-value',
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
        ServiceToken: {
          'Fn::GetAtt': [
            'ClusterKubectlProviderframeworkonEvent68E0CF80',
            'Arn',
          ],
        },
        Manifest: {
          'Fn::Join': [
            '',
            [
              '[{\"apiVersion\":\"v1\",\"kind\":\"ServiceAccount\",\"metadata\":{\"name\":\"stackmyserviceaccount58b9529e\",\"namespace\":\"default\",\"labels\":{\"app.kubernetes.io/name\":\"stackmyserviceaccount58b9529e\",\"some-label\":\"with-some-value\"},\"annotations\":{\"eks.amazonaws.com/role-arn\":\"',
              {
                'Fn::GetAtt': [
                  'MyServiceAccountRoleB41709FF',
                  'Arn',
                ],
              },
              '\",\"eks.amazonaws.com/sts-regional-endpoints\":\"false\"}}}]',
            ],
          ],
        },
      });
      Template.fromStack(stack).hasResourceProperties(iam.CfnRole.CFN_RESOURCE_TYPE_NAME, {
        AssumeRolePolicyDocument: {
          Statement: [
            {
              Action: 'sts:AssumeRoleWithWebIdentity',
              Effect: 'Allow',
              Principal: {
                Federated: {
                  Ref: 'ClusterOpenIdConnectProviderE7EB0530',
                },
              },
              Condition: {
                StringEquals: {
                  'Fn::GetAtt': [
                    'MyServiceAccountConditionJson1ED3BC54',
                    'Value',
                  ],
                },
              },
            },
          ],
          Version: '2012-10-17',
        },
      });
    });

    test('should have allow multiple services accounts', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      cluster.addServiceAccount('MyServiceAccount');
      cluster.addServiceAccount('MyOtherServiceAccount');

      // THEN
      Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
        ServiceToken: {
          'Fn::GetAtt': [
            'ClusterKubectlProviderframeworkonEvent68E0CF80',
            'Arn',
          ],
        },
        Manifest: {
          'Fn::Join': [
            '',
            [
              '[{\"apiVersion\":\"v1\",\"kind\":\"ServiceAccount\",\"metadata\":{\"name\":\"stackclustermyotherserviceaccounta472761a\",\"namespace\":\"default\",\"labels\":{\"app.kubernetes.io/name\":\"stackclustermyotherserviceaccounta472761a\"},\"annotations\":{\"eks.amazonaws.com/role-arn\":\"',
              {
                'Fn::GetAtt': [
                  'ClusterMyOtherServiceAccountRole764583C5',
                  'Arn',
                ],
              },
              '\"}}}]',
            ],
          ],
        },
      });
    });

    test('should have unique resource name', () => {
      // GIVEN
      const { cluster } = testFixtureCluster();

      // WHEN
      cluster.addServiceAccount('MyServiceAccount');

      // THEN
      expect(() => cluster.addServiceAccount('MyServiceAccount')).toThrow();
    });

    test('addServiceAccount for imported cluster', () => {
      const { stack } = testFixture();
      const oidcProvider = new iam.OpenIdConnectProvider(stack, 'ClusterOpenIdConnectProvider', {
        url: 'oidc_issuer',
      });
      const handlerRole = iam.Role.fromRoleArn(stack, 'HandlerRole', 'arn:aws:iam::123456789012:role/lambda-role');

      const kubectlProvider = eks.KubectlProvider.fromKubectlProviderAttributes(stack, 'KubectlProvider', {
        serviceToken: 'arn:aws:lambda:us-east-2:123456789012:function:myfunc',
        role: handlerRole,
      });

      const cluster = eks.Cluster.fromClusterAttributes(stack, 'Cluster', {
        clusterName: 'Cluster',
        openIdConnectProvider: oidcProvider,
        kubectlProvider: kubectlProvider,
      });

      cluster.addServiceAccount('MyServiceAccount');

      Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
        ServiceToken: 'arn:aws:lambda:us-east-2:123456789012:function:myfunc',
        PruneLabel: 'aws.cdk.eks/prune-c8d8e1722a4f3ed332f8ac74cb3d962f01fbb62291',
        Manifest: {
          'Fn::Join': [
            '',
            [
              '[{"apiVersion":"v1","kind":"ServiceAccount","metadata":{"name":"stackclustermyserviceaccount373b933c","namespace":"default","labels":{"aws.cdk.eks/prune-c8d8e1722a4f3ed332f8ac74cb3d962f01fbb62291":"","app.kubernetes.io/name":"stackclustermyserviceaccount373b933c"},"annotations":{"eks.amazonaws.com/role-arn":"',
              {
                'Fn::GetAtt': [
                  'ClusterMyServiceAccountRole85337B29',
                  'Arn',
                ],
              },
              '"}}}]',
            ],
          ],
        },
      });

      Template.fromStack(stack).hasResourceProperties(iam.CfnRole.CFN_RESOURCE_TYPE_NAME, {
        AssumeRolePolicyDocument: {
          Statement: [
            {
              Action: 'sts:AssumeRoleWithWebIdentity',
              Condition: {
                StringEquals: {
                  'Fn::GetAtt': [
                    'ClusterMyServiceAccountConditionJson671C0633',
                    'Value',
                  ],
                },
              },
              Effect: 'Allow',
              Principal: {
                Federated: {
                  Ref: 'ClusterOpenIdConnectProviderA8B8E987',
                },
              },
            },
          ],
          Version: '2012-10-17',
        },
      });
    });
  });

  describe('Service Account name must follow Kubernetes spec', () => {
    test('throw error on capital letters', () => {
      // GIVEN
      const { cluster } = testFixtureCluster();

      // WHEN
      expect(() => cluster.addServiceAccount('InvalidServiceAccount', {
        name: 'XXX',
      }))
      // THEN
        .toThrow(RangeError);
    });

    test('throw error if ends with dot', () => {
      // GIVEN
      const { cluster } = testFixtureCluster();

      // WHEN
      expect(() => cluster.addServiceAccount('InvalidServiceAccount', {
        name: 'test.',
      }))
      // THEN
        .toThrow(RangeError);
    });

    test('dot in the name is allowed', () => {
      // GIVEN
      const { cluster } = testFixtureCluster();
      const valueWithDot = 'test.name';

      // WHEN
      const sa = cluster.addServiceAccount('InvalidServiceAccount', {
        name: valueWithDot,
      });

      // THEN
      expect(sa.serviceAccountName).toEqual(valueWithDot);
    });

    test('throw error if name is too long', () => {
      // GIVEN
      const { cluster } = testFixtureCluster();

      // WHEN
      expect(() => cluster.addServiceAccount('InvalidServiceAccount', {
        name: 'x'.repeat(255),
      }))
      // THEN
        .toThrow(RangeError);
    });
  });

  describe('Service Account namespace must follow Kubernetes spec', () => {
    test('throw error on capital letters', () => {
      // GIVEN
      const { cluster } = testFixtureCluster();

      // WHEN
      expect(() => cluster.addServiceAccount('InvalidServiceAccount', {
        namespace: 'XXX',
      }))
      // THEN
        .toThrow(RangeError);
    });

    test('throw error if ends with dot', () => {
      // GIVEN
      const { cluster } = testFixtureCluster();

      // WHEN
      expect(() => cluster.addServiceAccount('InvalidServiceAccount', {
        namespace: 'test.',
      }))
      // THEN
        .toThrow(RangeError);
    });

    test('throw error if dot is in the name', () => {
      // GIVEN
      const { cluster } = testFixtureCluster();
      const valueWithDot = 'test.name';

      // WHEN
      expect(() => cluster.addServiceAccount('InvalidServiceAccount', {
        namespace: valueWithDot,
      }))
      // THEN
        .toThrow(RangeError);
    });

    test('throw error if name is too long', () => {
      // GIVEN
      const { cluster } = testFixtureCluster();

      // WHEN
      expect(() => cluster.addServiceAccount('InvalidServiceAccount', {
        namespace: 'x'.repeat(65),
      }))
      // THEN
        .toThrow(RangeError);
    });
  });

  describe('Service Account with eks.IdentityType.POD_IDENTITY', () => {
    test('default', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.ServiceAccount(stack, 'MyServiceAccount', {
        cluster,
        identityType: eks.IdentityType.POD_IDENTITY,
      });
      const t = Template.fromStack(stack);

      // THEN
      // should create an IAM role with correct assume role policy
      t.hasResourceProperties('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
          Statement: [
            { Action: 'sts:AssumeRole', Effect: 'Allow', Principal: { Service: 'pods.eks.amazonaws.com' } },
            { Action: ['sts:AssumeRole', 'sts:TagSession'], Effect: 'Allow', Principal: { Service: 'pods.eks.amazonaws.com' } },
          ],
        },
      });
      // should have a eks pod identity agent addon
      t.hasResourceProperties('AWS::EKS::Addon', {
        AddonName: 'eks-pod-identity-agent',
        ClusterName: { Ref: 'ClusterEB0386A7' },
      });
      // should have pod identity association
      t.hasResourceProperties('AWS::EKS::PodIdentityAssociation', {
        ClusterName: { Ref: 'ClusterEB0386A7' },
        Namespace: 'default',
        RoleArn: { 'Fn::GetAtt': ['MyServiceAccountRoleB41709FF', 'Arn'] },
        ServiceAccount: 'stackmyserviceaccount58b9529e',
      });
      // should not create OpenIdConnectProvider
      t.resourceCountIs('Custom::AWSCDKOpenIdConnectProvider', 0);
    });

    test('uses provided role when role prop is specified', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();
      const existingRole = new iam.Role(stack, 'ExistingRole', {
        assumedBy: new iam.ServicePrincipal('pods.eks.amazonaws.com'),
      });

      // WHEN
      new eks.ServiceAccount(stack, 'MyServiceAccount', {
        cluster,
        identityType: eks.IdentityType.POD_IDENTITY,
        role: existingRole,
      });
      const t = Template.fromStack(stack);

      // THEN
      // the provided role ARN should be used in PodIdentityAssociation
      t.hasResourceProperties('AWS::EKS::PodIdentityAssociation', {
        ClusterName: { Ref: 'ClusterEB0386A7' },
        Namespace: 'default',
        RoleArn: { 'Fn::GetAtt': ['ExistingRole5EDF2D93', 'Arn'] },
        ServiceAccount: 'stackmyserviceaccount58b9529e',
      });
      // no auto-generated IAM role for ServiceAccount should exist
      // the auto-generated role has a statement with sts:TagSession; ExistingRole does not
      t.resourcePropertiesCountIs('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
          Statement: Match.arrayWith([
            Match.objectLike({ Action: Match.arrayWith(['sts:TagSession']), Principal: { Service: 'pods.eks.amazonaws.com' } }),
          ]),
        },
      }, 0);
      // the Pod Identity Agent addon should be created
      t.hasResourceProperties('AWS::EKS::Addon', {
        AddonName: 'eks-pod-identity-agent',
      });
    });

    test('throws if role is specified with IRSA identity type', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();
      const existingRole = new iam.Role(stack, 'ExistingRole', {
        assumedBy: new iam.ServicePrincipal('pods.eks.amazonaws.com'),
      });

      // WHEN / THEN
      expect(() => new eks.ServiceAccount(stack, 'MyServiceAccount', {
        cluster,
        identityType: eks.IdentityType.IRSA,
        role: existingRole,
      })).toThrow('The `role` option is only valid when `identityType` is `IdentityType.POD_IDENTITY`.');
    });

    test('throws if role is specified with default identity type (IRSA)', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();
      const existingRole = new iam.Role(stack, 'ExistingRole', {
        assumedBy: new iam.ServicePrincipal('pods.eks.amazonaws.com'),
      });

      // WHEN / THEN
      expect(() => new eks.ServiceAccount(stack, 'MyServiceAccount', {
        cluster,
        // identityType is not specified, defaults to IRSA
        role: existingRole,
      })).toThrow('The `role` option is only valid when `identityType` is `IdentityType.POD_IDENTITY`.');
    });

    test('sa.role getter returns the provided L2 role', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();
      const existingRole = new iam.Role(stack, 'ExistingRole', {
        assumedBy: new iam.ServicePrincipal('pods.eks.amazonaws.com'),
      });

      // WHEN
      const sa = new eks.ServiceAccount(stack, 'MyServiceAccount', {
        cluster,
        identityType: eks.IdentityType.POD_IDENTITY,
        role: existingRole,
      });

      // THEN: the getter should return the provided L2 role as-is
      expect(sa.role).toBe(existingRole);
    });

    test('ServiceAccount creation succeeds when L1 CfnRole is provided, but sa.role getter throws', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();
      const cfnRole = new iam.CfnRole(stack, 'CfnRole', {
        assumeRolePolicyDocument: {
          Statement: [{
            Action: ['sts:AssumeRole', 'sts:TagSession'],
            Effect: 'Allow',
            Principal: { Service: 'pods.eks.amazonaws.com' },
          }],
        },
      });

      // WHEN: ServiceAccount creation itself should succeed (no error in constructor)
      const sa = new eks.ServiceAccount(stack, 'MyServiceAccount', {
        cluster,
        identityType: eks.IdentityType.POD_IDENTITY,
        role: cfnRole,
      });

      // THEN: PodIdentityAssociation should be created successfully
      Template.fromStack(stack).hasResourceProperties('AWS::EKS::PodIdentityAssociation', {
        ClusterName: { Ref: 'ClusterEB0386A7' },
        Namespace: 'default',
        ServiceAccount: 'stackmyserviceaccount58b9529e',
      });

      // THEN: accessing sa.role should throw in the getter
      expect(() => sa.role).toThrow(
        'The provided role is not an instance of IRole.',
      );
    });

    test('sa.role getter returns auto-generated role when no role prop is provided with POD_IDENTITY', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      const sa = new eks.ServiceAccount(stack, 'MyServiceAccount', {
        cluster,
        identityType: eks.IdentityType.POD_IDENTITY,
      });

      // THEN: the getter should return an IRole
      expect(sa.role).toBeDefined();
      // addToPrincipalPolicy should be callable (functioning as IRole)
      expect(() => sa.addToPrincipalPolicy(
        new iam.PolicyStatement({ actions: ['s3:GetObject'], resources: ['*'] }),
      )).not.toThrow();
    });
  });

  describe('Service Account with eks.IdentityType.IRSA', () => {
    test('default', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.ServiceAccount(stack, 'MyServiceAccount', {
        cluster,
        identityType: eks.IdentityType.IRSA,
      });
      const t = Template.fromStack(stack);

      // THEN
      // should create an IAM role with correct assume role policy
      t.hasResourceProperties('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
          Statement: [
            {
              Action: 'sts:AssumeRoleWithWebIdentity',
              Condition: { StringEquals: { 'Fn::GetAtt': ['MyServiceAccountConditionJson1ED3BC54', 'Value'] } },
              Effect: 'Allow',
              Principal: { Federated: { Ref: 'ClusterOpenIdConnectProviderE7EB0530' } },
            },
          ],
        },
      });

      // should create an OpenIdConnectProvider
      t.resourceCountIs('Custom::AWSCDKOpenIdConnectProvider', 1);
      // should not have any eks pod identity agent addon
      t.resourcePropertiesCountIs('AWS::EKS::Addon', {
        AddonName: 'eks-pod-identity-agent',
      }, 0);
      // should not have pod identity association
      t.resourceCountIs('AWS::EKS::PodIdentityAssociation', 0);
    });
  });

  describe('Service Account with overwrite option', () => {
    test('should pass overwrite to KubernetesManifest', () => {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.ServiceAccount(stack, 'MyServiceAccount', {
        cluster,
        overwriteServiceAccount: true,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
        Overwrite: true,
      });
    });
  });

  test('supports custom removal policy with IRSA', () => {
    const { stack, cluster } = testFixtureCluster();

    new eks.ServiceAccount(stack, 'MyServiceAccount', {
      cluster,
      identityType: eks.IdentityType.IRSA,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    Template.fromStack(stack).hasResource(eks.KubernetesManifest.RESOURCE_TYPE, {
      DeletionPolicy: 'Retain',
    });
    Template.fromStack(stack).hasResource('AWS::IAM::Role', {
      DeletionPolicy: 'Retain',
    });
    Template.fromStack(stack).hasResource('Custom::AWSCDKCfnJson', {
      DeletionPolicy: 'Retain',
    });
  });

  test('supports custom removal policy with POD_IDENTITY', () => {
    const { stack, cluster } = testFixtureCluster();

    new eks.ServiceAccount(stack, 'MyServiceAccount', {
      cluster,
      identityType: eks.IdentityType.POD_IDENTITY,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    Template.fromStack(stack).hasResource(eks.KubernetesManifest.RESOURCE_TYPE, {
      DeletionPolicy: 'Retain',
    });
    Template.fromStack(stack).hasResource('AWS::IAM::Role', {
      DeletionPolicy: 'Retain',
    });
    Template.fromStack(stack).hasResource('AWS::EKS::PodIdentityAssociation', {
      DeletionPolicy: 'Retain',
    });
  });
});
