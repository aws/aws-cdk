import { App, CfnOutput, Construct, CustomResource, CustomResourceProvider, CustomResourceProviderRuntime, Stack, Token } from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const provider = new CustomResourceProvider(this, 'MyResourceProvider', {
      codeDirectory: `${__dirname}/custom-resource-provider-fixture`,
      runtime: CustomResourceProviderRuntime.NODEJS_12,
    });

    const cr = new CustomResource(this, 'MyResource', {
      serviceToken: provider.serviceToken,
      properties: {
        physicalResourceId: 'MyPhysicalReflectBack',
        attributes: {
          Attribute1: 'foo',
          Attribute2: 1234,
        },
      },
    });

    new CfnOutput(this, 'Ref', { value: cr.ref });
    new CfnOutput(this, 'GetAtt.Attribute1', { value: Token.asString(cr.getAtt('Attribute1')) });
    new CfnOutput(this, 'GetAtt.Attribute2', { value: Token.asString(cr.getAtt('Attribute2')) });
  }
}

const app = new App();
new TestStack(app, 'custom-resource-test');
app.synth();