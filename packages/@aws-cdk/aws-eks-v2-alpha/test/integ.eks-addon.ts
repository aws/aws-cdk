import * as integ from '@aws-cdk/integ-tests-alpha';
import { KubectlV33Layer } from '@aws-cdk/lambda-layer-kubectl-v33';
import { App, Stack, Fn } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as eks from '../lib';

class EksClusterStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', { natGateways: 1 });
    const cluster = new eks.Cluster(this, 'Cluster', {
      vpc,
      version: eks.KubernetesVersion.V1_33,
      kubectlProviderOptions: {
        kubectlLayer: new KubectlV33Layer(this, 'kubectlLayer'),
      },
    });

    new eks.Addon(this, 'Addon', {
      addonName: 'coredns',
      cluster,
      preserveOnDelete: true,
      configurationValues: {
        replicaCount: 2,
      },
    });

    // test for additional Addon parameters(namespace, podIdentityAssociations, resolveConflicts)
    const testRole = new iam.Role(this, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('pods.eks.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonEBSCSIDriverPolicy'),
      ],
    });

    new eks.Addon(this, 'AddonPodIdentityAssociation', {
      addonName: 'aws-ebs-csi-driver',
      cluster,
      preserveOnDelete: true,
      configurationValues: {
        replicaCount: 2,
      },
      namespace: 'kube-system',
      podIdentityAssociations: [{
        addonRole: testRole,
        serviceAccount: 'ebs-csi-controller-sa',
      }],
      resolveConflicts: eks.ResolveConflictsType.NONE,
    });

    // test for additional Addon parameters
    const irsaRole = new iam.Role(this, 'IrsaTestRole', {
      assumedBy: new iam.FederatedPrincipal(
        cluster.openIdConnectProvider.openIdConnectProviderArn,
        {
          StringEquals: Fn.toJsonString({
            [`${cluster.openIdConnectProvider.openIdConnectProviderIssuer}:sub`]: 'system:serviceaccount:kube-system:snapshot-controller',
          }),
        },
        'sts:AssumeRoleWithWebIdentity',
      ),
    });
    irsaRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonEBSCSIDriverPolicy'),
    );
    new eks.Addon(this, 'AddonServiceAccountRole', {
      addonName: 'aws-snapshot-controller',
      cluster,
      serviceAccountRole: irsaRole,
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new EksClusterStack(app, 'EksClusterWithAddonStack');
new integ.IntegTest(app, 'EksClusterwithAddon', {
  testCases: [stack],
});
