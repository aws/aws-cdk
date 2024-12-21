import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as acm from 'aws-cdk-lib/aws-acmpca';
import * as servicediscovery from 'aws-cdk-lib/aws-servicediscovery';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs');
const vpc = new ec2.Vpc(stack, 'Vpc');
const cluster = new ecs.Cluster(stack, 'EcsCluster', {
  vpc,
});

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');

const namespace = new servicediscovery.PrivateDnsNamespace(stack, 'ns', {
  name: 'foobar.com',
  vpc,
});

const certificateAuthority = acm.CertificateAuthority.fromCertificateAuthorityArn(stack, 'PrivateCA',
  // 'arn:aws:acm-pca:us-east-1:123456789012:certificate-authority/123456789012',
  'arn:aws:acm-pca:ap-northeast-1:852045161734:certificate-authority/96c220ca-4b5b-4e6c-8420-67df70c822b2',
);

const kmsKey = new kms.Key(stack, 'KmsKey', {
  enableKeyRotation: true,
  enabled: true,
});
kmsKey.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

taskDefinition.addContainer('container', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  portMappings: [
    {
      name: 'api',
      containerPort: 80,
    },
  ],
});

const role = new iam.Role(stack, 'Role', {
  assumedBy: new iam.ServicePrincipal('ecs.amazonaws.com'),
  managedPolicies: [
    iam.ManagedPolicy.fromAwsManagedPolicyName('AWSPrivateCAFullAccess'),
  ],
});
role.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
role.addToPolicy(new iam.PolicyStatement({
  actions: ['secretsmanager:*'],
  resources: ['*'],
}));

kmsKey.grant(role, 'kms:*');

new ecs.FargateService(stack, 'FargateService', {
  cluster,
  taskDefinition,
  serviceConnectConfiguration: {
    services: [
      {
        portMappingName: 'api',
        dnsName: 'api',
        port: 80,
        tls: {
          awsPcaAuthorityArn: certificateAuthority.certificateAuthorityArn,
          role,
          kmsKey,
        },
      },
    ],
    namespace: namespace.namespaceArn,
  },
  minHealthyPercent: 0,
  maxHealthyPercent: 100,
});

new integ.IntegTest(app, 'aws-ecs-service-connect-tls-configuration', {
  testCases: [stack],
});

app.synth();
