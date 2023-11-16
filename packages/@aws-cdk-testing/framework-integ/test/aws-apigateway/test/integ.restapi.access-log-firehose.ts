import * as iam from 'aws-cdk-lib/aws-iam';
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

class RestApiAccessLogFirehoseTest extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const testFormat = apigateway.AccessLogFormat.custom(JSON.stringify({
      requestId: apigateway.AccessLogField.contextRequestId(),
      sourceIp: apigateway.AccessLogField.contextIdentitySourceIp(),
      method: apigateway.AccessLogField.contextHttpMethod(),
      callerAccountId: apigateway.AccessLogField.contextCallerAccountId(),
      ownerAccountId: apigateway.AccessLogField.contextOwnerAccountId(),
      userContext: {
        sub: apigateway.AccessLogField.contextAuthorizerClaims('sub'),
        email: apigateway.AccessLogField.contextAuthorizerClaims('email'),
      },
      clientCertPem: apigateway.AccessLogField.contextIdentityClientCertPem(),
      subjectDN: apigateway.AccessLogField.contextIdentityClientCertSubjectDN(),
      issunerDN: apigateway.AccessLogField.contextIdentityClientCertIssunerDN(),
      serialNumber: apigateway.AccessLogField.contextIdentityClientCertSerialNumber(),
      validityNotBefore: apigateway.AccessLogField.contextIdentityClientCertValidityNotBefore(),
      validityNotAfter: apigateway.AccessLogField.contextIdentityClientCertValidityNotAfter(),
    }));

    const destinationBucket = new s3.Bucket(this, 'Bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const deliveryStreamRole = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
    });

    const stream = new firehose.CfnDeliveryStream(this, 'MyStream', {
      deliveryStreamName: 'amazon-apigateway-delivery-stream',
      s3DestinationConfiguration: {
        bucketArn: destinationBucket.bucketArn,
        roleArn: deliveryStreamRole.roleArn,
      },
    });

    const api = new apigateway.RestApi(this, 'MyApi', {
      cloudWatchRole: true,
      deployOptions: {
        accessLogDestination: new apigateway.FirehoseLogDestination(stream),
        accessLogFormat: testFormat,
      },
    });
    api.root.addMethod('GET');
  }
}

const app = new cdk.App();

const stack = new RestApiAccessLogFirehoseTest(app, 'test-apigateway-access-logs-firehose');
new IntegTest(app, 'apigateway-access-logs-firehose', {
  testCases: [stack],
});

app.synth();
