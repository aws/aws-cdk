import * as route53 from '@aws-cdk/aws-route53';
import { App, CfnOutput, Construct, Stack } from '@aws-cdk/core';
import * as acm from '../lib';

class AcmStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    /// !show
    const exampleCom = new route53.HostedZone(this, 'ExampleCom', {
      zoneName: 'example.com',
    });

    const exampleNet = new route53.HostedZone(this, 'ExampelNet', {
      zoneName: 'example.net',
    });

    const cert = new acm.Certificate(this, 'Certificate', {
      domainName: 'test.example.com',
      subjectAlternativeNames: ['cool.example.com', 'test.example.net'],
      validation: acm.CertificateValidation.fromDnsMultiZone({
        'text.example.com': exampleCom,
        'cool.example.com': exampleCom,
        'test.example.net': exampleNet,
      }),
    });
    /// !hide

    new CfnOutput(this, 'Output', {
      value: cert.certificateArn,
    });
  }
}

const app = new App();
new AcmStack(app, 'AcmStack');
app.synth();
