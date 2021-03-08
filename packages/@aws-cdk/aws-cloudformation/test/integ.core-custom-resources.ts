/// !cdk-integ pragma:ignore-assets
/*
 * Stack verification steps:
 * - Deploy with `--no-clean`
 * - Verify that the CloudFormation stack outputs have the following values:
 *   - Ref: "MyPhysicalReflectBack"
 *   - GetAtt.Attribute1: "foo"
 *   - GetAtt.Attribute2: 1234
 */
import { App, CfnOutput, CustomResource, CustomResourceProvider, CustomResourceProviderRuntime, Stack, Token } from '@aws-cdk/core';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/* eslint-disable cdk/no-core-construct */

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const resourceType = 'Custom::Reflect';

    const serviceToken = CustomResourceProvider.getOrCreate(this, resourceType, {
      codeDirectory: `${__dirname}/core-custom-resource-provider-fixture`,
      runtime: CustomResourceProviderRuntime.NODEJS_12_X,
      description: 'veni vidi vici',
    });

    const cr = new CustomResource(this, 'MyResource', {
      resourceType,
      serviceToken,
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
