import * as path from 'path';
import * as logs from 'aws-cdk-lib/aws-logs';
import { App, CustomResource, CustomResourceProvider, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';
import { STANDARD_CUSTOM_RESOURCE_PROVIDER_RUNTIME } from '../../config';

/**********************************************************************************************************************
 *
 *    Warning! This test case can not be deployed!
 *
 *    Save yourself some time and move on.
 *    The latest given reason is:
 *    - 2023-08-30: Required cert files are missing, when re-instated failing because certs are expired
 *                  Generating to cert files will likely resolve this, @mrgrain
 *
 *********************************************************************************************************************/

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

    // Import server and client certificates in ACM
    const certificates = new ImportCertificates(this, 'ImportCertificates');

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 0 });
    vpc.node.addDependency(certificates); // ensure certificates are deleted last, when not in use anymore

    const logGroup = new logs.LogGroup(this, 'LogGroup', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    vpc.addClientVpnEndpoint('Endpoint', {
      cidr: '10.100.0.0/16',
      serverCertificateArn: certificates.serverCertificateArn,
      clientCertificateArn: certificates.clientCertificateArn,
      logGroup,
    });
  }
}

const IMPORT_CERTIFICATES_RESOURCE_TYPE = 'Custom::ACMImportCertificates';

class ImportCertificates extends Construct {
  public readonly serverCertificateArn: string;
  public readonly clientCertificateArn: string;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const serviceToken = CustomResourceProvider.getOrCreate(this, IMPORT_CERTIFICATES_RESOURCE_TYPE, {
      codeDirectory: path.join(__dirname, 'import-certificates-handler'),
      runtime: STANDARD_CUSTOM_RESOURCE_PROVIDER_RUNTIME,
      policyStatements: [{
        Effect: 'Allow',
        Action: ['acm:ImportCertificate', 'acm:DeleteCertificate'],
        Resource: '*',
      }],
    });

    const createCertificates = new CustomResource(this, 'CreateCertificates', {
      resourceType: IMPORT_CERTIFICATES_RESOURCE_TYPE,
      serviceToken,
    });
    this.serverCertificateArn = createCertificates.getAttString('ClientCertificateArn');
    this.clientCertificateArn = createCertificates.getAttString('ServerCertificateArn');

    new CustomResource(this, 'DeleteCertificates', {
      resourceType: IMPORT_CERTIFICATES_RESOURCE_TYPE,
      serviceToken,
      properties: {
        ServerCertificateArn: this.serverCertificateArn,
        ClientCertificateArn: this.clientCertificateArn,
      },
    });
  }
}

const app = new App();
new TestStack(app, 'cdk-ec2-client-vpn-endpoint');
app.synth();
