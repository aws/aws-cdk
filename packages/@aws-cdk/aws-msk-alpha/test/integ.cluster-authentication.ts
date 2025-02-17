import {
  CertificateAuthority,
  CfnCertificate,
  CfnCertificateAuthority,
  CfnCertificateAuthorityActivation,
} from 'aws-cdk-lib/aws-acmpca';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as msk from '../lib';

const app = new cdk.App();

class MskClusterAuthTestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

    const certSigningAlgorithm = 'SHA256WITHRSA';
    const privateCA = new CfnCertificateAuthority(this, 'CertificateAuthority', {
      keyAlgorithm: 'RSA_2048',
      signingAlgorithm: certSigningAlgorithm,
      keyStorageSecurityStandard: 'FIPS_140_2_LEVEL_3_OR_HIGHER',
      type: 'ROOT',
      subject: {
        commonName: 'MSK Cluster Root CA',
        organization: 'Amazon Web Services',
        organizationalUnit: 'AWS-CDK',
        country: 'DE',
        state: 'Berlin',
        locality: 'Berlin',
      },
    });

    privateCA.node.addMetadata('Description', 'Signing authority for Certificates');

    const cert = new CfnCertificate(this, 'Certificate', {
      certificateAuthorityArn: privateCA.attrArn,
      certificateSigningRequest: privateCA.attrCertificateSigningRequest,
      signingAlgorithm: certSigningAlgorithm,
      templateArn: 'arn:aws:acm-pca:::template/RootCACertificate/V1',
      validity: { type: 'YEARS', value: 1 },
    });
    cert.node.addMetadata('Description', 'Certificate for signing requests from MSK-Cluster');

    // Activating the certificate using the signing cert authority
    const certActivation = new CfnCertificateAuthorityActivation(this, 'CertificateActivation', {
      certificateAuthorityArn: privateCA.attrArn,
      certificate: cert.attrCertificate,
    });

    // SASL/SCRAM, IAM, and TLS authenticated MSK cluster integ test
    const cluster = new msk.Cluster(this, 'Cluster', {
      clusterName: 'integ-test-auth',
      kafkaVersion: msk.KafkaVersion.V3_6_0,
      vpc,
      encryptionInTransit: {
        clientBroker: msk.ClientBrokerEncryption.TLS,
      },
      clientAuthentication: msk.ClientAuthentication.saslTls({
        iam: true,
        scram: true,
        certificateAuthorities: [CertificateAuthority.fromCertificateAuthorityArn(this, 'PrivateCA', privateCA.attrArn)],
      }),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    cluster.node.addDependency(certActivation);
  }
}

const stack = new MskClusterAuthTestStack(app, 'aws-cdk-msk-auth-integ');

new IntegTest(app, 'MskClusterAuth', {
  testCases: [stack],
});

app.synth();
