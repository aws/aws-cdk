import { Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import { Stack, Tags } from 'aws-cdk-lib/core';
import * as eks from '../lib';

const CLUSTER_VERSION = eks.KubernetesVersion.V1_25;
const KUBERNETES_MANIFEST_RESOURCE_TYPE = eks.KubernetesManifest.RESOURCE_TYPE;

describe('fargate', () => {
  test('can be added to a cluster', () => {
    // GIVEN
    const stack = new Stack();
    const cluster = new eks.Cluster(stack, 'MyCluster', { version: CLUSTER_VERSION });

    // WHEN
    cluster.addFargateProfile('MyProfile', {
      selectors: [{ namespace: 'default' }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EKS::FargateProfile', {
      ClusterName: { Ref: 'MyCluster4C1BA579' },
      PodExecutionRoleArn: { 'Fn::GetAtt': ['MyClusterfargateprofileMyProfilePodExecutionRole4795C054', 'Arn'] },
      Selectors: [{ Namespace: 'default' }],
    });
  });

  test('supports specifying a profile name', () => {
    // GIVEN
    const stack = new Stack();
    const cluster = new eks.Cluster(stack, 'MyCluster', { version: CLUSTER_VERSION });

    // WHEN
    cluster.addFargateProfile('MyProfile', {
      fargateProfileName: 'MyProfileName',
      selectors: [{ namespace: 'default' }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EKS::FargateProfile', {
      ClusterName: { Ref: 'MyCluster4C1BA579' },
      PodExecutionRoleArn: { 'Fn::GetAtt': ['MyClusterfargateprofileMyProfilePodExecutionRole4795C054', 'Arn'] },
      Selectors: [{ Namespace: 'default' }],
      FargateProfileName: 'MyProfileName',
    });
  });

  test('supports custom execution role', () => {
    // GIVEN
    const stack = new Stack();
    const cluster = new eks.Cluster(stack, 'MyCluster', { version: CLUSTER_VERSION });
    const myRole = new iam.Role(stack, 'MyRole', { assumedBy: new iam.AnyPrincipal() });

    // WHEN
    cluster.addFargateProfile('MyProfile', {
      podExecutionRole: myRole,
      selectors: [{ namespace: 'default' }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EKS::FargateProfile', {
      ClusterName: { Ref: 'MyCluster4C1BA579' },
      PodExecutionRoleArn: { 'Fn::GetAtt': ['MyRoleF48FFE04', 'Arn'] },
      Selectors: [{ Namespace: 'default' }],
    });
  });

  test('supports tags through aspects', () => {
    // GIVEN
    const stack = new Stack();
    const cluster = new eks.Cluster(stack, 'MyCluster', { version: CLUSTER_VERSION });

    // WHEN
    cluster.addFargateProfile('MyProfile', {
      selectors: [{ namespace: 'default' }],
    });

    Tags.of(stack).add('aspectTag', 'hello');
    Tags.of(cluster).add('propTag', '123');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EKS::FargateProfile', {
      Selectors: [{ Namespace: 'default' }],
      ClusterName: { Ref: 'MyCluster4C1BA579' },
      PodExecutionRoleArn: { 'Fn::GetAtt': ['MyClusterfargateprofileMyProfilePodExecutionRole4795C054', 'Arn'] },
      Tags: [
        {
          Key: 'aspectTag',
          Value: 'hello',
        },
        {
          Key: 'propTag',
          Value: '123',
        },
      ],
    });
  });

  test('supports specifying vpc', () => {
    // GIVEN
    const stack = new Stack();
    const cluster = new eks.Cluster(stack, 'MyCluster', { version: CLUSTER_VERSION });
    const vpc = ec2.Vpc.fromVpcAttributes(stack, 'MyVpc', {
      vpcId: 'vpc123',
      availabilityZones: ['az1'],
      privateSubnetIds: ['priv1'],
    });

    // WHEN
    cluster.addFargateProfile('MyProfile', {
      selectors: [{ namespace: 'default' }],
      vpc,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EKS::FargateProfile', {
      ClusterName: { Ref: 'MyCluster4C1BA579' },
      PodExecutionRoleArn: { 'Fn::GetAtt': ['MyClusterfargateprofileMyProfilePodExecutionRole4795C054', 'Arn'] },
      Selectors: [{ Namespace: 'default' }],
      Subnets: ['priv1'],
    });
  });

  test('fails if there are no selectors or if there are more than 5', () => {
    // GIVEN
    const stack = new Stack();
    const cluster = new eks.Cluster(stack, 'MyCluster', { version: CLUSTER_VERSION });

    // THEN
    expect(() => cluster.addFargateProfile('MyProfile', { selectors: [] }));
    expect(() => cluster.addFargateProfile('MyProfile', {
      selectors: [
        { namespace: '1' },
        { namespace: '2' },
        { namespace: '3' },
        { namespace: '4' },
        { namespace: '5' },
        { namespace: '6' },
      ],
    }));
  });

  test('FargateCluster creates an EKS cluster fully managed by Fargate', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new eks.FargateCluster(stack, 'FargateCluster', { version: CLUSTER_VERSION });

    // THEN
    Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-KubernetesPatch', {
      ResourceName: 'deployment/coredns',
      ResourceNamespace: 'kube-system',
      ApplyPatchJson: '{"spec":{"template":{"metadata":{"annotations":{"eks.amazonaws.com/compute-type":"fargate"}}}}}',
      RestorePatchJson: '{"spec":{"template":{"metadata":{"annotations":{"eks.amazonaws.com/compute-type":"ec2"}}}}}',
      ClusterName: {
        Ref: 'FargateCluster7CCD5F93',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::EKS::FargateProfile', {
      ClusterName: {
        Ref: 'FargateCluster7CCD5F93',
      },
      PodExecutionRoleArn: {
        'Fn::GetAtt': [
          'FargateClusterfargateprofiledefaultPodExecutionRole66F2610E',
          'Arn',
        ],
      },
      Selectors: [
        { Namespace: 'default' },
        { Namespace: 'kube-system' },
      ],
    });
  });

  test('can create FargateCluster with a custom profile', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new eks.FargateCluster(stack, 'FargateCluster', {
      defaultProfile: {
        fargateProfileName: 'my-app', selectors: [{ namespace: 'foo' }, { namespace: 'bar' }],
      },
      version: CLUSTER_VERSION,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EKS::FargateProfile', {
      ClusterName: {
        Ref: 'FargateCluster7CCD5F93',
      },
      FargateProfileName: 'my-app',
      PodExecutionRoleArn: {
        'Fn::GetAtt': [
          'FargateClusterfargateprofilemyappPodExecutionRole875B4635',
          'Arn',
        ],
      },
      Selectors: [
        { Namespace: 'foo' },
        { Namespace: 'bar' },
      ],
    });
  });

  test('custom profile name is "custom" if no custom profile name is provided', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new eks.FargateCluster(stack, 'FargateCluster', {
      defaultProfile: {
        selectors: [{ namespace: 'foo' }, { namespace: 'bar' }],
      },
      version: CLUSTER_VERSION,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EKS::FargateProfile', {
      ClusterName: {
        Ref: 'FargateCluster7CCD5F93',
      },
      PodExecutionRoleArn: {
        'Fn::GetAtt': [
          'FargateClusterfargateprofilecustomPodExecutionRoleDB415F19',
          'Arn',
        ],
      },
      Selectors: [
        { Namespace: 'foo' },
        { Namespace: 'bar' },
      ],
    });
  });

  test('multiple Fargate profiles added to a cluster are processed sequentially', () => {
    // GIVEN
    const stack = new Stack();
    const cluster = new eks.Cluster(stack, 'MyCluster', { version: CLUSTER_VERSION });

    // WHEN
    cluster.addFargateProfile('MyProfile1', {
      selectors: [{ namespace: 'namespace1' }],
    });
    cluster.addFargateProfile('MyProfile2', {
      selectors: [{ namespace: 'namespace2' }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EKS::FargateProfile', {
      ClusterName: { Ref: 'MyCluster4C1BA579' },
      PodExecutionRoleArn: { 'Fn::GetAtt': ['MyClusterfargateprofileMyProfile1PodExecutionRole794E9E37', 'Arn'] },
      Selectors: [{ Namespace: 'namespace1' }],
    });
    Template.fromStack(stack).hasResource('AWS::EKS::FargateProfile', {
      Properties: {
        ClusterName: { Ref: 'MyCluster4C1BA579' },
        PodExecutionRoleArn: { 'Fn::GetAtt': ['MyClusterfargateprofileMyProfile2PodExecutionRoleD1151CCF', 'Arn'] },
        Selectors: [{ Namespace: 'namespace2' }],
      },
      DependsOn: [
        'MyClusterfargateprofileMyProfile1PodExecutionRole794E9E37',
        'MyClusterfargateprofileMyProfile1879D501A',
      ],
    });
  });

  test('fargate role is added to RBAC', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new eks.FargateCluster(stack, 'FargateCluster', { version: CLUSTER_VERSION });

    // THEN
    Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-KubernetesResource', {
      Manifest: {
        'Fn::Join': [
          '',
          [
            '[{"apiVersion":"v1","kind":"ConfigMap","metadata":{"name":"aws-auth","namespace":"kube-system","labels":{"aws.cdk.eks/prune-c858eb9c291620a59a3334f61f9b8a259e9786af60":""}},"data":{"mapRoles":"[{\\"rolearn\\":\\"',
            {
              'Fn::GetAtt': [
                'FargateClusterfargateprofiledefaultPodExecutionRole66F2610E',
                'Arn',
              ],
            },
            '\\",\\"username\\":\\"system:node:{{SessionName}}\\",\\"groups\\":[\\"system:bootstrappers\\",\\"system:nodes\\",\\"system:node-proxier\\"]}]","mapUsers":"[]","mapAccounts":"[]"}}]',
          ],
        ],
      },
    });
  });

  test('allow cluster creation role to iam:PassRole on fargate pod execution role', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new eks.FargateCluster(stack, 'FargateCluster', { version: CLUSTER_VERSION });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'iam:PassRole',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                'FargateClusterfargateprofiledefaultPodExecutionRole66F2610E',
                'Arn',
              ],
            },
          },
        ],
      },
    });
  });

  test('supports passing secretsEncryptionKey with FargateCluster', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN

    new eks.FargateCluster(stack, 'FargateCluster', {
      version: CLUSTER_VERSION,
      secretsEncryptionKey: new kms.Key(stack, 'Key'),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
      EncryptionConfig: [{
        Provider: {
          KeyArn: {
            'Fn::GetAtt': [
              'Key961B73FD',
              'Arn',
            ],
          },
        },
        Resources: ['secrets'],
      }],
    });
  });

  test('supports cluster logging with FargateCluster', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN

    new eks.FargateCluster(stack, 'FargateCluster', {
      version: CLUSTER_VERSION,
      clusterLogging: [
        eks.ClusterLoggingTypes.API,
        eks.ClusterLoggingTypes.AUTHENTICATOR,
        eks.ClusterLoggingTypes.SCHEDULER,
      ],
    });

    //THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
      Logging: {
        ClusterLogging: {
          EnabledTypes: [
            { Type: 'api' },
            { Type: 'authenticator' },
            { Type: 'scheduler' },
          ],
        },
      },
    });
  });
});

describe('FargateCluster authentication mode', () => {
  test.each([
    [eks.AuthenticationMode.API, 0],
    [eks.AuthenticationMode.API_AND_CONFIG_MAP, 1],
    [eks.AuthenticationMode.CONFIG_MAP, 1],
    [undefined, 1],
  ])('creates correct number of AwsAuth resources for mode %p', (authenticationMode, expectedResourceCount) => {
    const stack = new Stack();

    new eks.FargateCluster(stack, 'Cluster', {
      version: CLUSTER_VERSION,
      authenticationMode,
    });

    const template = Template.fromStack(stack);
    template.resourceCountIs(KUBERNETES_MANIFEST_RESOURCE_TYPE, expectedResourceCount);

    if (expectedResourceCount > 0) {
      template.hasResourceProperties(KUBERNETES_MANIFEST_RESOURCE_TYPE, {
        Manifest: {
          'Fn::Join': [
            '',
            [
              '[{"apiVersion":"v1","kind":"ConfigMap","metadata":{"name":"aws-auth","namespace":"kube-system","labels":{"aws.cdk.eks/prune-c89d3ef2163dfb30f38b127f20b71024bf7995ca21":""}},"data":{"mapRoles":"[{\\"rolearn\\":\\"',
              {
                'Fn::GetAtt': [
                  'ClusterfargateprofiledefaultPodExecutionRole09952CFF',
                  'Arn',
                ],
              },
              '\\",\\"username\\":\\"system:node:{{SessionName}}\\",\\"groups\\":[\\"system:bootstrappers\\",\\"system:nodes\\",\\"system:node-proxier\\"]}]","mapUsers":"[]","mapAccounts":"[]"}}]',
            ],
          ],
        },
      });
    }
  });
});
