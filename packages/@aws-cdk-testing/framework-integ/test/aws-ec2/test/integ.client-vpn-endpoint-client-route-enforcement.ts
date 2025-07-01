import { App, RemovalPolicy, Stack, StackProps, UnscopedValidationError } from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';

/**
 * In order to test this you need to have a valid public hosted zone that you can use
 * to validate the domain identity.
 */
const hostedZoneId = process.env.CDK_INTEG_HOSTED_ZONE_ID ?? process.env.HOSTED_ZONE_ID;
if (!hostedZoneId) throw new UnscopedValidationError('For this test you must provide your own HostedZoneId as an env var "HOSTED_ZONE_ID". See framework-integ/README.md for details.');
const hostedZoneName = process.env.CDK_INTEG_HOSTED_ZONE_NAME ?? process.env.HOSTED_ZONE_NAME;
if (!hostedZoneName) throw new UnscopedValidationError('For this test you must provide your own HostedZoneName as an env var "HOSTED_ZONE_NAME". See framework-integ/README.md for details.');

interface TestStackProps extends StackProps {
  hostedZoneId: string;
  hostedZoneName: string;
}

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props: TestStackProps) {
    super(scope, id, props);

    const hostedZone = route53.PublicHostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      hostedZoneId: props.hostedZoneId,
      zoneName: props.hostedZoneName,
    });

    const serverCertificate = new acm.Certificate(this, 'Certificate', {
      domainName: `server.${props.hostedZoneName}`,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });
    const clientCertificate = new acm.Certificate(this, 'ClientCertificate', {
      domainName: `client.${props.hostedZoneName}`,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 0 });

    const logGroup = new logs.LogGroup(this, 'LogGroup', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    vpc.addClientVpnEndpoint('Endpoint', {
      cidr: '10.100.0.0/16',
      serverCertificateArn: serverCertificate.certificateArn,
      clientCertificateArn: clientCertificate.certificateArn,
      logGroup,
      clientRouteEnforcementOptions: {
        enforced: true,
      },
    });
  }
}

const app = new App();
new IntegTest(app, 'client-vpn-endpoint-integ', {
  testCases: [
    new TestStack(app, 'client-vpn-endpoint-stack', {
      hostedZoneId,
      hostedZoneName,
    }),
  ],
  stackUpdateWorkflow: false,
});
