import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as route53 from 'aws-cdk-lib/aws-route53';
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

    const [prodBranch, devBranch] = ['main', 'dev'].map(branchName => app.addBranch(branchName));

    const hostedZone = route53.PublicHostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      hostedZoneId: props.hostedZoneId,
      zoneName: props.hostedZoneName,
    });

    const customCertificate = new acm.Certificate(this, 'Certificate', {
      domainName: `*.${props.domainName}`,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    const domain = app.addDomain(props.domainName, {
      subDomains: [{ branch: prodBranch, prefix: 'prod' }],
      customCertificate,
    });
    domain.mapSubDomain(devBranch);
  }
}

function getEnvVar(name: string, fallbackName?: string): string {
  const value = process.env[name] || (fallbackName ? process.env[fallbackName] : undefined);
  if (!value) throw new Error(`Environment variable ${name} is required.`);
  return value;
}

const app = new App();
const stack = new TestStack(app, 'cdk-amplify-app-custom-domain', {
  hostedZoneId: getEnvVar('CDK_INTEG_HOSTED_ZONE_ID', 'HOSTED_ZONE_ID'),
  hostedZoneName: getEnvVar('CDK_INTEG_HOSTED_ZONE_NAME', 'HOSTED_ZONE_NAME'),
  domainName: getEnvVar('CDK_INTEG_DOMAIN_NAME', 'DOMAIN_NAME'),
});

new IntegTest(app, 'amplify-app-custom-domain-integ', {
  testCases: [stack],
  enableLookups: true,
  stackUpdateWorkflow: false,
});
