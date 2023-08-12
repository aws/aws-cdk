import * as path from 'path';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'cdk-opensearch-advancedsecurity-with-saml');

const user = new iam.User(stack, 'User');

const metadataDocument = iam.SamlMetadataDocument.fromFile(path.join(__dirname, 'saml-metadata-document.xml'));

new opensearch.Domain(stack, 'Domain', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  version: opensearch.EngineVersion.ELASTICSEARCH_7_1,
  fineGrainedAccessControl: {
    masterUserArn: user.userArn,
    samlAuthenticationEnabled: true,
    samlAuthenticationOptions: {
      idpEntityId: 'entity-id',
      idpMetadataContent: metadataDocument.xml,
      masterBackendRole: 'backend-role',
      masterUserName: 'master-username',
    },
  },
  encryptionAtRest: {
    enabled: true,
  },
  nodeToNodeEncryption: true,
  enforceHttps: true,
  capacity: {
    multiAzWithStandbyEnabled: false,
  },
});

new integ.IntegTest(app, 'integ-opensearch-advancedsecurity-with-saml', {
  testCases: [stack],
});

app.synth();
