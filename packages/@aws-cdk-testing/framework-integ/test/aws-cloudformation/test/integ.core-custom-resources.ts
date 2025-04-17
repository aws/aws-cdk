/*
 * Stack verification steps:
 * - Deploy with `--no-clean`
 * - Verify that the CloudFormation stack outputs have the following values:
 *   - Ref: "MyPhysicalReflectBack"
 *   - GetAtt.Attribute1: "foo"
 *   - GetAtt.Attribute2: 1234
 */
import { App, CfnOutput, CustomResource, CustomResourceProvider, Stack, Token } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { STANDARD_CUSTOM_RESOURCE_PROVIDER_RUNTIME } from '../../config';

/* eslint-disable @cdklabs/no-core-construct */

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const resourceType = 'Custom::Reflect';
    const lengthyResourceType = 'Custom::Given_Resource_Type_Is_Exactly_Sixty_Characters_Long';

    const serviceToken = CustomResourceProvider.getOrCreate(this, resourceType, {
      codeDirectory: `${__dirname}/core-custom-resource-provider-fixture`,
      runtime: STANDARD_CUSTOM_RESOURCE_PROVIDER_RUNTIME,
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

    new CustomResource(this, 'MyLengthyTypeResource', {
      resourceType: lengthyResourceType,
      serviceToken,
      properties: {
        physicalResourceId: 'MyPhysicalLengthyType',
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
