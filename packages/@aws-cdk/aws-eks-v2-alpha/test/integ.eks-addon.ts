import * as integ from '@aws-cdk/integ-tests-alpha';
import { KubectlV33Layer } from '@aws-cdk/lambda-layer-kubectl-v33';
import { App, Stack } from 'aws-cdk-lib';
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
      assumedBy: new iam.ServicePrincipal('pods.eks.amazonaws.com').withSessionTags(),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonEBSCSIDriverPolicy'),
      ],
    });

    new eks.Addon(this, 'AddonPodIdentityAssociation', {
      addonName: 'aws-ebs-csi-driver',
      cluster,
      preserveOnDelete: true,
      namespace: 'kube-system',
      podIdentityAssociations: [{
        addonRole: testRole,
        serviceAccount: 'ebs-csi-controller-sa',
      }],
      resolveConflicts: eks.ResolveConflictsType.NONE,
    });

    // test for additional Addon parameters(serviceAccountRole)
    const irsaServiceAccount = new eks.ServiceAccount(this, 'ServiceAccount', {
      cluster: cluster,
      name: 'efs-csi-controller-sa',
      identityType: eks.IdentityType.IRSA,
      namespace: 'kube-system',
    });
    irsaServiceAccount.role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonEFSCSIDriverPolicy'),
    );
    new eks.Addon(this, 'AddonServiceAccountRole', {
      addonName: 'aws-efs-csi-driver',
      cluster,
      serviceAccountRole: irsaServiceAccount.role,
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
