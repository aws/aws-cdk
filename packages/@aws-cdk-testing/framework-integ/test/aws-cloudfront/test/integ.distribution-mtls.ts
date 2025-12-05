import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';

/**
 * Integration test for CloudFront Distribution with mTLS (Mutual TLS) authentication.
 *
 * This test:
 * - Creates an S3 bucket and uploads a CA certificate bundle and client certificates
 * - Creates a CloudFront TrustStore using the CA certificate
 * - Creates a CloudFront Distribution with mTLS enabled in optional mode
 * - Deploys test content to the origin bucket
 * - Uses a Lambda function to make an mTLS request and verify the response
 */
class MtlsDistributionStack extends cdk.Stack {
  public readonly distribution: cloudfront.Distribution;
  public readonly certBucket: s3.Bucket;
  public readonly mtlsTestFunction: lambda.IFunction;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const assetsPath = path.join(__dirname, 'integ.distribution-mtls.assets');

    // S3 bucket for TrustStore CA certificate bundle and client certificates
    this.certBucket = new s3.Bucket(this, 'CertBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Deploy CA certificate bundle and client certificates to S3
    const certDeployment = new s3deploy.BucketDeployment(this, 'DeployCerts', {
      sources: [s3deploy.Source.asset(assetsPath, {
        exclude: ['*.ts', '*.html'],
      })],
      destinationBucket: this.certBucket,
      retainOnDelete: false,
    });

    // Create TrustStore using L1 construct (CfnTrustStore)
    const trustStore = new cloudfront.TrustStore(this, 'TrustStore', {
      name: 'integ-test-trust-store',
      caCertificatesBundleS3Location: {
        bucket: this.certBucket,
        key: 'ca-bundle.pem',
      },
    });
    // Ensure certificates are deployed before creating TrustStore
    trustStore.node.addDependency(certDeployment);

    // S3 bucket for CloudFront origin
    const originBucket = new s3.Bucket(this, 'OriginBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Deploy test content to origin bucket
    new s3deploy.BucketDeployment(this, 'DeployContent', {
      sources: [s3deploy.Source.asset(assetsPath, {
        exclude: ['*.ts', '*.pem'],
      })],
      destinationBucket: originBucket,
      retainOnDelete: false,
    });

    // CloudFront Distribution with mTLS enabled
    // Note: mTLS requires HTTPS_ONLY - HTTP is not allowed with ViewerMutualAuthentication
    this.distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(originBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.HTTPS_ONLY,
      },
      viewerMtlsConfig: {
        mode: cloudfront.MtlsMode.REQUIRED,
        trustStore: trustStore,
      },
    });

    // Lambda function to test mTLS request
    this.mtlsTestFunction = new nodejs.NodejsFunction(this, 'MtlsTestFunction', {
      entry: path.join(assetsPath, 'mtls-test-handler.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: cdk.Duration.seconds(30),
      bundling: {
        externalModules: ['@aws-sdk/client-s3'],
      },
    });

    // Grant Lambda permission to read certificates from S3
    this.certBucket.grantRead(this.mtlsTestFunction);
  }
}

const app = new cdk.App();

const testCase = new MtlsDistributionStack(app, 'integ-distribution-mtls');

const test = new integ.IntegTest(app, 'integ-test-distribution-mtls', {
  testCases: [testCase],
});

// Test 1: mTLS request WITH client certificate should return 200
const mtlsWithCertAssertion = test.assertions.invokeFunction({
  functionName: testCase.mtlsTestFunction.functionName,
  payload: JSON.stringify({
    distributionDomainName: testCase.distribution.distributionDomainName,
    certBucket: testCase.certBucket.bucketName,
    useCert: true,
  }),
});

mtlsWithCertAssertion.expect(integ.ExpectedResult.objectLike({
  Payload: integ.Match.stringLikeRegexp('.*"statusCode":200.*'),
}));

// Test 2: mTLS request WITHOUT client certificate should return 403 (mTLS REQUIRED mode)
const mtlsWithoutCertAssertion = test.assertions.invokeFunction({
  functionName: testCase.mtlsTestFunction.functionName,
  payload: JSON.stringify({
    distributionDomainName: testCase.distribution.distributionDomainName,
    certBucket: testCase.certBucket.bucketName,
    useCert: false,
  }),
});

mtlsWithoutCertAssertion.expect(integ.ExpectedResult.objectLike({
  Payload: integ.Match.stringLikeRegexp('.*"statusCode":403.*'),
}));
