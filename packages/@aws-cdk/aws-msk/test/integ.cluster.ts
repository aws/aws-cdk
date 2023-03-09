import {
  CertificateAuthority,
  CfnCertificate,
  CfnCertificateAuthority,
  CfnCertificateAuthorityActivation,
} from '@aws-cdk/aws-acmpca';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { IntegTest, AssertionsProvider, ExpectedResult } from '@aws-cdk/integ-tests';
import * as msk from '../lib';

const app = new cdk.App();

class FeatureFlagStack extends cdk.Stack {
  public readonly bucketArn: string;
  public readonly bucket: s3.IBucket;
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2 });

    this.bucket = new s3.Bucket(this, 'LoggingBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const cluster = new msk.Cluster(this, 'Cluster', {
      clusterName: 'integ-test',
      kafkaVersion: msk.KafkaVersion.V2_8_1,
      vpc,
      logging: {
        s3: {
          bucket: this.bucket,
        },
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.bucketArn = this.exportValue(this.bucket.bucketArn);
    // Test lazy instance of the AwsCustomResource
    new cdk.CfnOutput(this, 'BootstrapBrokers', { value: cluster.bootstrapBrokersTls });
    new cdk.CfnOutput(this, 'BootstrapBrokers2', { value: cluster.bootstrapBrokersTls });

    // iam authenticated msk cluster integ test
    const cluster2 = new msk.Cluster(this, 'ClusterIAM', {
      clusterName: 'integ-test-iam-auth',
      kafkaVersion: msk.KafkaVersion.V2_8_1,
      vpc,
      logging: {
        s3: {
          bucket: this.bucket,
        },
      },
      encryptionInTransit: {
        clientBroker: msk.ClientBrokerEncryption.TLS,
      },
      clientAuthentication: msk.ClientAuthentication.sasl({
        iam: true,
      }),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Test lazy instance of the AwsCustomResource
    new cdk.CfnOutput(this, 'BootstrapBrokers3', { value: cluster2.bootstrapBrokersSaslIam });

    const certSigningAlgorithm = 'SHA256WITHRSA';
    const privateCA = new CfnCertificateAuthority(
      this,
      'CertificateAuthority',
      {
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
      },
    );

    privateCA.node.addMetadata(
      'Description',
      'Signing authority for Certificates',
    );

    const cert = new CfnCertificate(this, 'Certificate', {
      certificateAuthorityArn: privateCA.attrArn,
      certificateSigningRequest: privateCA.attrCertificateSigningRequest,
      signingAlgorithm: certSigningAlgorithm,
      templateArn: 'arn:aws:acm-pca:::template/RootCACertificate/V1',
      validity: {
        type: 'YEARS',
        value: 1,
      },
    });
    cert.node.addMetadata(
      'Description',
      'Certificate for signing requests from MSK-Cluster',
    );

    // Activating the certificate using the signing cert authority
    const certActivation = new CfnCertificateAuthorityActivation(
      this,
      'CertificateActivation',
      {
        certificateAuthorityArn: privateCA.attrArn,
        certificate: cert.attrCertificate,
      },
    );

    const cluster3 = new msk.Cluster(this, 'ClusterIAMTLS', {
      clusterName: 'integ-test-iam-tls-auth',
      kafkaVersion: msk.KafkaVersion.V2_8_1,
      vpc,
      logging: {
        s3: {
          bucket: this.bucket,
        },
      },
      encryptionInTransit: {
        clientBroker: msk.ClientBrokerEncryption.TLS,
      },
      clientAuthentication: msk.ClientAuthentication.saslTls({
        iam: true,
        certificateAuthorities: [
          CertificateAuthority.fromCertificateAuthorityArn(
            this,
            'PrivateCA',
            privateCA.attrArn,
          ),
        ],
      }),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    cluster3.node.addDependency(certActivation);

    // Test lazy instance of the AwsCustomResource
    new cdk.CfnOutput(this, 'BootstrapBrokers4', { value: cluster3.bootstrapBrokersTls });
    new cdk.CfnOutput(this, 'BootstrapBrokers5', { value: cluster3.bootstrapBrokersSaslIam });

    const cluster4 = new msk.Cluster(this, 'Cluster_V3_1_1', {
      clusterName: 'integ-test-v3-1-1',
      kafkaVersion: msk.KafkaVersion.V3_1_1,
      vpc,
      logging: {
        s3: {
          bucket: this.bucket,
        },
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    new cdk.CfnOutput(this, 'BootstrapBrokers6', { value: cluster4.bootstrapBrokersTls });

    const cluster5 = new msk.Cluster(this, 'Cluster_V3_2_0', {
      clusterName: 'integ-test-v3-2-0',
      kafkaVersion: msk.KafkaVersion.V3_2_0,
      vpc,
      logging: {
        s3: {
          bucket: this.bucket,
        },
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    new cdk.CfnOutput(this, 'BootstrapBrokers7', { value: cluster5.bootstrapBrokersTls });

    const cluster6 = new msk.Cluster(this, 'Cluster_V3_3_1', {
      clusterName: 'integ-test-v3-3-1',
      kafkaVersion: msk.KafkaVersion.V3_3_1,
      vpc,
      logging: {
        s3: {
          bucket: this.bucket,
        },
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    new cdk.CfnOutput(this, 'BootstrapBrokers8', { value: cluster6.bootstrapBrokersTls });

    const cluster7 = new msk.Cluster(this, 'Cluster_V3_3_2', {
      clusterName: 'integ-test-v3-3-2',
      kafkaVersion: msk.KafkaVersion.V3_3_2,
      vpc,
      logging: {
        s3: {
          bucket: this.bucket,
        },
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    new cdk.CfnOutput(this, 'BootstrapBrokers9', { value: cluster7.bootstrapBrokersTls });

  }
}

const stack = new FeatureFlagStack(app, 'aws-cdk-msk-integ');

const integ = new IntegTest(app, 'MskLogging', {
  testCases: [stack],
});

const objects = integ.assertions.awsApiCall('S3', 'listObjectsV2', {
  Bucket: stack.bucket.bucketName,
  MaxKeys: 1,
  Prefix: `AWSLogs/${stack.account}/KafkaBrokerLogs`,
});
const assertionProvider = objects.node.tryFindChild('SdkProvider') as AssertionsProvider;
assertionProvider.addPolicyStatementFromSdkCall('s3', 'ListBucket', [stack.bucketArn]);
assertionProvider.addPolicyStatementFromSdkCall('s3', 'GetObject', [`${stack.bucketArn}/*`]);
assertionProvider.addPolicyStatementFromSdkCall('kafka', 'GetBootstrapBrokers', ['*']);

objects.expect(ExpectedResult.objectLike({
  KeyCount: 1,
}));

app.synth();
