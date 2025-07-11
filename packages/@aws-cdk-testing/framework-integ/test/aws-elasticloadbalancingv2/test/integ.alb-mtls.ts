import * as path from 'path';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53targets from 'aws-cdk-lib/aws-route53-targets';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';

/**
 * In order to test this you must create certificates, keys and Certificate Revocation List (CRL).
 *
 * 1. Generate root Certificate Authority (CA) certificate and private key (valid for 7 days):
 *    `openssl req -x509 -new -days 7 -keyout rootCA_key.pem -out rootCA_cert.pem`
 *
 * 2. Generate client certificate and private key (valid for 7 days):
 *    `openssl req -x509 -CA rootCA_cert.pem -CAkey rootCA_key.pem -days 7 -new -nodes -keyout client_key.pem -out client_cert.pem`
 *
 * 3. Create OpenSSL configuration file (openssl.cnf):
 * ```
 * cat << EOF > openssl.cnf
 * [ ca ]
 * default_ca = CA_default
 *
 * [ CA_default ]
 * dir = .
 * database = \$dir/index.txt
 * new_certs_dir = \$dir/newcerts
 * certificate = \$dir/rootCA_cert.pem
 * serial = \$dir/serial
 * private_key = \$dir/rootCA_key.pem
 * RANDFILE = \$dir/private/.rand
 * default_crl_days = 30
 * default_md = sha256
 * preserve = no
 * policy = policy_match
 * crl_extensions = crl_ext
 *
 * [ policy_match ]
 * countryName = optional
 * stateOrProvinceName = optional
 * organizationName = optional
 * organizationalUnitName = optional
 * commonName = supplied
 * emailAddress = optional
 *
 * [ crl_ext ]
 * authorityKeyIdentifier=keyid:always
 * EOF
 * ```
 *
 * 4. Generate Certificate Revocation List (CRL) (valid for 30 days):
 *    `openssl ca -config openssl.cnf -gencrl -out crl.pem -crldays 30 -md sha256`
 *
 * 5. Place `rootCA_cert.pem` and `crl.pem` into the `mtls` directory.
 *
 * 6. Perform an HTTPS request using the generated client key and certificate:
 *    `curl https://YOUR-DOMAIN --key client_key.pem --cert client_cert.pem -v`
 */

interface MutualTlsStackProps extends StackProps {
  hostedZoneId: string;
  hostedZoneName: string;
  domainName: string;
}

class MutualTls extends Stack {
  constructor(scope: Construct, id: string, props: MutualTlsStackProps) {
    super(scope, id);

    const bucket = new s3.Bucket(this, 'Bucket', {
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const deploy = new s3deploy.BucketDeployment(this, 'DeployCaCert', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'mtls'))],
      destinationBucket: bucket,
    });

    const vpc = new ec2.Vpc(this, 'Stack');

    const hostedZone = route53.PublicHostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      hostedZoneId: props.hostedZoneId,
      zoneName: props.hostedZoneName,
    });
    const certificate = new acm.Certificate(this, 'Certificate', {
      domainName: props.domainName,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', {
      vpc,
      internetFacing: true,
    });

    const trustStore = new elbv2.TrustStore(this, 'Store', {
      bucket,
      key: 'rootCA_cert.pem',
    });

    trustStore.node.addDependency(deploy);

    const trustStoreRevocation = new elbv2.TrustStoreRevocation(this, 'Revocation', {
      trustStore,
      revocationContents: [
        {
          bucket,
          key: 'crl.pem',
        },
      ],
    });

    trustStoreRevocation.node.addDependency(deploy);

    lb.addListener('Listener', {
      port: 443,
      protocol: elbv2.ApplicationProtocol.HTTPS,
      certificates: [certificate],
      mutualAuthentication: {
        advertiseTrustStoreCaNames: true,
        ignoreClientCertificateExpiry: false,
        mutualAuthenticationMode: elbv2.MutualAuthenticationMode.VERIFY,
        trustStore,
      },
      defaultAction: elbv2.ListenerAction.fixedResponse(200,
        { contentType: 'text/plain', messageBody: 'Success mTLS' }),
    });

    new route53.ARecord(this, 'ARecord', {
      target: route53.RecordTarget.fromAlias(new route53targets.LoadBalancerTarget(lb)),
      zone: hostedZone,
    });
  }
}

/**
 * In order to test this you need to have a valid public hosted zone that you can use
 * to request certificates for.
 *
 */
const hostedZoneId = process.env.CDK_INTEG_HOSTED_ZONE_ID ?? process.env.HOSTED_ZONE_ID;
if (!hostedZoneId) throw new Error('For this test you must provide your own HostedZoneId as an env var "HOSTED_ZONE_ID". See framework-integ/README.md for details.');
const hostedZoneName = process.env.CDK_INTEG_HOSTED_ZONE_NAME ?? process.env.HOSTED_ZONE_NAME;
if (!hostedZoneName) throw new Error('For this test you must provide your own HostedZoneName as an env var "HOSTED_ZONE_NAME". See framework-integ/README.md for details.');
const domainName = process.env.CDK_INTEG_DOMAIN_NAME ?? process.env.DOMAIN_NAME;
if (!domainName) throw new Error('For this test you must provide your own DomainName as an env var "DOMAIN_NAME". See framework-integ/README.md for details.');

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new MutualTls(app, 'alb-mtls-test-stack', {
  hostedZoneId,
  hostedZoneName,
  domainName,
});

new IntegTest(app, 'alb-mtls-integ', {
  testCases: [stack],
  enableLookups: true,
  stackUpdateWorkflow: false,
});
