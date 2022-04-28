import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import { App, Stack, StackProps } from '@aws-cdk/core';
import { Construct } from 'constructs';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const provider = new iam.SamlProvider(this, 'Provider', {
      metadataDocument: iam.SamlMetadataDocument.fromFile(path.join(__dirname, 'saml-metadata-document.xml')),
    });

    new iam.Role(this, 'Role', {
      assumedBy: new iam.SamlConsolePrincipal(provider),
    });
  }
}

const app = new App();
new TestStack(app, 'cdk-saml-provider');
app.synth();
