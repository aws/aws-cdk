import { KubectlV31Layer } from '@aws-cdk/lambda-layer-kubectl-v31';
import { testFixture } from './util';
import { Template } from '../../assertions';
import * as iam from '../../aws-iam';
import { App, Stack } from '../../core';
import * as eks from '../lib';
import { Cluster, KubernetesVersion } from '../lib';

describe('service account', () => {
  describe('add Service Account', () => {
    test('should have unique resource name', () => {
      // WHEN
      const app = new App();
      const stack = new Stack(app, 'Stack');
      const cluster = new Cluster(stack, 'Cluster', {
        version: KubernetesVersion.V1_30,
        kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer'),
      });
      cluster.addServiceAccount('MyServiceAccount');

      // THEN
      expect(() => cluster.addServiceAccount('MyServiceAccount')).toThrow();
    });

    test('addServiceAccount for imported cluster', () => {
      const { stack } = testFixture();
      const oidcProvider = new iam.OpenIdConnectProvider(stack, 'ClusterOpenIdConnectProvider', {
        url: 'oidc_issuer',
      });
      const cluster = eks.Cluster.fromClusterAttributes(stack, 'Cluster', {
        clusterName: 'Cluster',
        openIdConnectProvider: oidcProvider,
        kubectlRoleArn: 'arn:aws:iam::123456:role/service-role/k8sservicerole',
      });

      cluster.addServiceAccount('MyServiceAccount');

      Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
        ServiceToken: {
          'Fn::GetAtt': [
            'StackClusterF0EB02FAKubectlProviderNestedStackStackClusterF0EB02FAKubectlProviderNestedStackResource739D12C4',
            'Outputs.StackStackClusterF0EB02FAKubectlProviderframeworkonEvent8377F076Arn',
          ],
        },
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
      // WHEN
      const app = new App();
      const stack = new Stack(app, 'Stack');
      const cluster = new Cluster(stack, 'Cluster', {
        version: KubernetesVersion.V1_30,
        kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer'),
      });

      expect(() => cluster.addServiceAccount('InvalidServiceAccount', {
        name: 'XXX',
      }))
      // THEN
        .toThrow(RangeError);
    });

    test('throw error if ends with dot', () => {
      // WHEN
      const app = new App();
      const stack = new Stack(app, 'Stack');
      const cluster = new Cluster(stack, 'Cluster', {
        version: KubernetesVersion.V1_30,
        kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer'),
      });

      expect(() => cluster.addServiceAccount('InvalidServiceAccount', {
        name: 'test.',
      }))
      // THEN
        .toThrow(RangeError);
    });

    test('dot in the name is allowed', () => {
      // GIVEN
      const app = new App();
      const stack = new Stack(app, 'Stack');
      const cluster = new Cluster(stack, 'Cluster', {
        version: KubernetesVersion.V1_30,
        kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer'),
      });
      const valueWithDot = 'test.name';

      // WHEN
      const sa = cluster.addServiceAccount('InvalidServiceAccount', {
        name: valueWithDot,
      });

      // THEN
      expect(sa.serviceAccountName).toEqual(valueWithDot);
    });

    test('throw error if name is too long', () => {
      // WHEN
      const app = new App();
      const stack = new Stack(app, 'Stack');
      const cluster = new Cluster(stack, 'Cluster', {
        version: KubernetesVersion.V1_30,
        kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer'),
      });

      expect(() => cluster.addServiceAccount('InvalidServiceAccount', {
        name: 'x'.repeat(255),
      }))
      // THEN
        .toThrow(RangeError);
    });
  });

  describe('Service Account namespace must follow Kubernetes spec', () => {
    test('throw error on capital letters', () => {
      // WHEN
      const app = new App();
      const stack = new Stack(app, 'Stack');
      const cluster = new Cluster(stack, 'Cluster', {
        version: KubernetesVersion.V1_30,
        kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer'),
      });

      expect(() => cluster.addServiceAccount('InvalidServiceAccount', {
        namespace: 'XXX',
      }))

      // THEN
        .toThrow(RangeError);
    });

    test('throw error if ends with dot', () => {
      // WHEN
      const app = new App();
      const stack = new Stack(app, 'Stack');
      const cluster = new Cluster(stack, 'Cluster', {
        version: KubernetesVersion.V1_30,
        kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer'),
      });

      expect(() => cluster.addServiceAccount('InvalidServiceAccount', {
        namespace: 'test.',
      }))
      // THEN
        .toThrow(RangeError);
    });

    test('throw error if dot is in the name', () => {
      // GIVEN
      const valueWithDot = 'test.name';
      const app = new App();
      const stack = new Stack(app, 'Stack');
      const cluster = new Cluster(stack, 'Cluster', {
        version: KubernetesVersion.V1_30,
        kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer'),
      });

      // WHEN
      expect(() => cluster.addServiceAccount('InvalidServiceAccount', {
        namespace: valueWithDot,
      }))
      // THEN
        .toThrow(RangeError);
    });

    test('throw error if name is too long', () => {
      // GIVEN
      const app = new App();
      const stack = new Stack(app, 'Stack');
      const cluster = new Cluster(stack, 'Cluster', {
        version: KubernetesVersion.V1_30,
        kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer'),
      });

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
      const app = new App();
      const stack = new Stack(app, 'Stack');
      const cluster = new Cluster(stack, 'Cluster', {
        version: KubernetesVersion.V1_30,
        kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer'),
      });

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
        ClusterName: { Ref: 'Cluster9EE0221C' },
      });
      // should have pod identity association
      t.hasResourceProperties('AWS::EKS::PodIdentityAssociation', {
        ClusterName: { Ref: 'Cluster9EE0221C' },
        Namespace: 'default',
        RoleArn: { 'Fn::GetAtt': ['MyServiceAccountRoleB41709FF', 'Arn'] },
        ServiceAccount: 'stackmyserviceaccount58b9529e',
      });
      // should not create OpenIdConnectProvider
      t.resourceCountIs('Custom::AWSCDKOpenIdConnectProvider', 0);
    });
    test('throw error when adding service account to Fargate cluster', () => {
      // GIVEN
      const app = new App();
      const stack = new Stack(app, 'Stack');
      const fargateCluster = new eks.FargateCluster(stack, 'FargateCluster', {
        version: eks.KubernetesVersion.V1_25,
        kubectlLayer: new KubectlV31Layer(stack, 'FargateKubectlLayer'),
      });

      // WHEN
      expect(() => fargateCluster.addServiceAccount('MyServiceAccount', {
        identityType: eks.IdentityType.POD_IDENTITY,
      })).toThrow(
        'Pod Identity is not supported in Fargate. Use IRSA identity type instead.',
      );
    });
  });
  describe('Service Account with eks.IdentityType.IRSA', () => {
    test('default', () => {
      // GIVEN
      const app = new App();
      const stack = new Stack(app, 'Stack');
      const cluster = new Cluster(stack, 'Cluster', {
        version: KubernetesVersion.V1_30,
        kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer'),
      });

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

  describe('Service Account with eks.IdentityType.NONE', () => {
    test('should not create IAM role or AWS resources', () => {
      // GIVEN
      const app = new App();
      const stack = new Stack(app, 'Stack');
      const cluster = new Cluster(stack, 'Cluster', {
        version: KubernetesVersion.V1_30,
        kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer'),
      });

      // WHEN
      const serviceAccount = new eks.ServiceAccount(stack, 'MyServiceAccount', {
        cluster,
        identityType: eks.IdentityType.NONE,
      });
      const t = Template.fromStack(stack);

      // THEN
      // Verify that no ServiceAccount-specific IAM role is created
      // The cluster itself creates roles, but ServiceAccount should not create additional ones
      const roles = t.findResources('AWS::IAM::Role');
      const serviceAccountRoles = Object.keys(roles).filter(key =>
        key.includes('MyServiceAccount') && key.includes('Role'),
      );
      expect(serviceAccountRoles).toHaveLength(0);
      // should not create OpenIdConnectProvider
      t.resourceCountIs('Custom::AWSCDKOpenIdConnectProvider', 0);
      // should not have pod identity association
      t.resourceCountIs('AWS::EKS::PodIdentityAssociation', 0);
      // should not have eks pod identity agent addon
      t.resourcePropertiesCountIs('AWS::EKS::Addon', {
        AddonName: 'eks-pod-identity-agent',
      }, 0);

      // ServiceAccount should have undefined role
      expect(serviceAccount.role).toBeUndefined();

      // Should create Kubernetes ServiceAccount manifest without role-arn annotation
      const manifests = t.findResources(eks.KubernetesManifest.RESOURCE_TYPE);
      const serviceAccountManifests = Object.values(manifests).filter((manifest: any) =>
        manifest.Properties.Manifest &&
        (typeof manifest.Properties.Manifest === 'string'
          ? manifest.Properties.Manifest.includes('"kind":"ServiceAccount"')
          : JSON.stringify(manifest.Properties.Manifest).includes('"kind":"ServiceAccount"')),
      );
      expect(serviceAccountManifests).toHaveLength(1);

      // Verify the manifest doesn't contain role-arn annotation
      const manifestContent = serviceAccountManifests[0] as any;
      const manifestStr = typeof manifestContent.Properties.Manifest === 'string'
        ? manifestContent.Properties.Manifest
        : JSON.stringify(manifestContent.Properties.Manifest);
      expect(manifestStr).not.toContain('eks.amazonaws.com/role-arn');
    });

    test('should handle addToPrincipalPolicy gracefully', () => {
      // GIVEN
      const app = new App();
      const stack = new Stack(app, 'Stack');
      const cluster = new Cluster(stack, 'Cluster', {
        version: KubernetesVersion.V1_30,
        kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer'),
      });

      // WHEN
      const serviceAccount = new eks.ServiceAccount(stack, 'MyServiceAccount', {
        cluster,
        identityType: eks.IdentityType.NONE,
      });

      // THEN
      // Adding policy should return false since there's no role
      const result = serviceAccount.addToPrincipalPolicy(new iam.PolicyStatement({
        actions: ['s3:GetObject'],
        resources: ['*'],
      }));
      expect(result.statementAdded).toBe(false);
    });

    test('should work with custom annotations and labels', () => {
      // GIVEN
      const app = new App();
      const stack = new Stack(app, 'Stack');
      const cluster = new Cluster(stack, 'Cluster', {
        version: KubernetesVersion.V1_30,
        kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer'),
      });

      // WHEN
      new eks.ServiceAccount(stack, 'MyServiceAccount', {
        cluster,
        identityType: eks.IdentityType.NONE,
        annotations: {
          'custom.annotation/key': 'custom-value',
        },
        labels: {
          'custom.label/key': 'custom-value',
        },
      });
      const t = Template.fromStack(stack);

      // THEN
      // Should include custom annotations and labels but not role-arn
      const manifests = t.findResources(eks.KubernetesManifest.RESOURCE_TYPE);
      const serviceAccountManifests = Object.values(manifests).filter((manifest: any) =>
        manifest.Properties.Manifest &&
        (typeof manifest.Properties.Manifest === 'string'
          ? manifest.Properties.Manifest.includes('"kind":"ServiceAccount"')
          : JSON.stringify(manifest.Properties.Manifest).includes('"kind":"ServiceAccount"')),
      );
      expect(serviceAccountManifests).toHaveLength(1);

      const manifestContent = serviceAccountManifests[0] as any;
      const manifestStr = typeof manifestContent.Properties.Manifest === 'string'
        ? manifestContent.Properties.Manifest
        : JSON.stringify(manifestContent.Properties.Manifest);

      // Should contain custom annotations and labels
      expect(manifestStr).toContain('custom.annotation/key":"custom-value');
      expect(manifestStr).toContain('custom.label/key":"custom-value');
      // Should not contain role-arn annotation
      expect(manifestStr).not.toContain('eks.amazonaws.com/role-arn');
    });

    test('should work with Fargate cluster', () => {
      // GIVEN
      const app = new App();
      const stack = new Stack(app, 'Stack');
      const fargateCluster = new eks.FargateCluster(stack, 'FargateCluster', {
        version: eks.KubernetesVersion.V1_25,
        kubectlLayer: new KubectlV31Layer(stack, 'FargateKubectlLayer'),
      });

      // WHEN & THEN
      // Should not throw error when using NONE identity type with Fargate
      expect(() => fargateCluster.addServiceAccount('MyServiceAccount', {
        identityType: eks.IdentityType.NONE,
      })).not.toThrow();
    });
  });
});
