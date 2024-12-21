import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as acm from 'aws-cdk-lib/aws-acmpca';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');
const vpc = new ec2.Vpc(stack, 'Vpc');
const cluster = new ecs.Cluster(stack, 'EcsCluster', {
  vpc,
  defaultCloudMapNamespace: {
    name: 'api.com',
    useForServiceConnect: true,
  },
});

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');

const ca = acm.CertificateAuthority.fromCertificateAuthorityArn(stack, 'CA',
  'arn:aws:acm-pca:us-east-1:1234567890:certificate-authority/xxxxxx',
);

const kmsKey = new kms.Key(stack, 'KmsKey', {
  enableKeyRotation: true,
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

kmsKey.grant(role, 'kms:GenerateDataKeyPair');

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
          awsPcaAuthorityArn: ca.certificateAuthorityArn,
          role,
          kmsKey,
        },
      },
    ],
  },
});

new integ.IntegTest(app, 'aws-ecs-service-connect-tls-configuration', {
  testCases: [stack],
});

app.synth();
