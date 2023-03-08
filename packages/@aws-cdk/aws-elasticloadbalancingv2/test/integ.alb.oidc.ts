import * as ec2 from '@aws-cdk/aws-ec2';
import { App, CfnOutput, SecretValue, Stack } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as elbv2 from '../lib';

// This test can only be run as a dry-run at this time due to requiring a certificate
class AlbOidcStack extends Stack {

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Stack', {
      maxAzs: 2,
    });

    const certificate: elbv2.IListenerCertificate = {
      certificateArn: process.env.SELF_SIGNED_CERT_ARN ?? '',
    };

    const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', {
      vpc,
      internetFacing: true,
    });

    lb.addListener('Listener', {
      protocol: elbv2.ApplicationProtocol.HTTPS,
      certificates: [certificate],
      defaultAction: elbv2.ListenerAction.authenticateOidc({
        authorizationEndpoint: 'https://examle.com/authorize',
        clientId: 'client-id',
        clientSecret: SecretValue.unsafePlainText('client-secret'),
        issuer: 'https://examle.com',
        tokenEndpoint: 'https://examle.com/token',
        userInfoEndpoint: 'https://examle.com/userinfo',
        next: elbv2.ListenerAction.fixedResponse(200, {
          contentType: 'text/plain',
          messageBody: 'Authenticated',
        }),
      }),
    });

    new CfnOutput(this, 'DNS', {
      value: lb.loadBalancerDnsName,
    });
  }
}

const app = new App();
const testCase = new AlbOidcStack(app, 'IntegAlbOidc');
new integ.IntegTest(app, 'IntegTestAlbOidc', {
  testCases: [testCase],
});

app.synth();