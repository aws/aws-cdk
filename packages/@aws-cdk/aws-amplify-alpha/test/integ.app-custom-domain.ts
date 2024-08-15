import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as amplify from '../lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

interface TestStackProps extends StackProps {
  hostedZoneId: string;
  hostedZoneName: string;
  domainName: string;
}

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props: TestStackProps) {
    super(scope, id, props);

    const repository = new codecommit.Repository(this, 'Repo', {
      repositoryName: 'integ-amplify-app',
    });

    const app = new amplify.App(this, 'App', {
      sourceCodeProvider: new amplify.CodeCommitSourceCodeProvider({ repository }),
    });

    const prodBranch = app.addBranch('main');
    const devBranch = app.addBranch('dev');

    const hostedZone = route53.PublicHostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      hostedZoneId: props.hostedZoneId,
      zoneName: props.hostedZoneName,
    });

    const customCertificate = new acm.Certificate(this, 'Certificate', {
      domainName: `*.${props.domainName}`,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    const domain = app.addDomain(props.domainName, {
      subDomains: [
        {
          branch: prodBranch,
          prefix: 'prod',
        },
      ],
      customCertificate,
    });
    domain.mapSubDomain(devBranch);
  }
}

/**
 * In order to test this you need to have a valid public hosted zone that you can use
 * to request certificates for.
*/
const hostedZoneId = process.env.CDK_INTEG_HOSTED_ZONE_ID ?? process.env.HOSTED_ZONE_ID;
if (!hostedZoneId) throw new Error('For this test you must provide your own HostedZoneId as an env var "HOSTED_ZONE_ID". See framework-integ/README.md for details.');
const hostedZoneName = process.env.CDK_INTEG_HOSTED_ZONE_NAME ?? process.env.HOSTED_ZONE_NAME;
if (!hostedZoneName) throw new Error('For this test you must provide your own HostedZoneName as an env var "HOSTED_ZONE_NAME". See framework-integ/README.md for details.');
const domainName = process.env.CDK_INTEG_DOMAIN_NAME ?? process.env.DOMAIN_NAME;
if (!domainName) throw new Error('For this test you must provide your own DomainName as an env var "DOMAIN_NAME". See framework-integ/README.md for details.');

const app = new App();
const stack = new TestStack(app, 'cdk-amplify-app-custom-domain', {
  hostedZoneId,
  hostedZoneName,
  domainName,
});

new IntegTest(app, 'amplify-app-custom-domain-integ', {
  testCases: [stack],
  enableLookups: true,
  stackUpdateWorkflow: false,
});
