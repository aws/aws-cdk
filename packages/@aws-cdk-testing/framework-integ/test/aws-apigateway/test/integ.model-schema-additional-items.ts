import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const api = new apigateway.RestApi(this, 'model-schema-api', {
      restApiName: 'Model Schema Test API',
    });

    // Create a minimal schema that uses additionalItems
    const schema: apigateway.JsonSchema = {
      type: apigateway.JsonSchemaType.OBJECT,
      required: ['tags'],
      properties: {
        tags: {
          type: apigateway.JsonSchemaType.ARRAY,
          items: [
            { type: apigateway.JsonSchemaType.STRING, enum: ['primary'] },
            { type: apigateway.JsonSchemaType.STRING, enum: ['secondary'] },
          ],
          additionalItems: {
            type: apigateway.JsonSchemaType.STRING,
            pattern: '^[a-z0-9-]+$',
          },
          minItems: 1,
          maxItems: 5,
        },
      },
    };

    // Create the model using our schema
    const model = api.addModel('TagsModel', {
      contentType: 'application/json',
      modelName: 'Tags',
      schema: schema,
    });

    // Add a validator that requires the request body to match our model
    const validator = api.addRequestValidator('TagsValidator', {
      requestValidatorName: 'TagsValidator',
      validateRequestBody: true,
    });

    // Add a POST method that uses the model and validator
    api.root.addMethod('POST', new apigateway.MockIntegration({
      integrationResponses: [{
        statusCode: '200',
      }],
      requestTemplates: {
        'application/json': '{ "statusCode": 200 }',
      },
    }), {
      requestValidator: validator,
      requestModels: {
        'application/json': model,
      },
      methodResponses: [{
        statusCode: '200',
      }],
    });
  }
}

const app = new cdk.App();
const stack = new TestStack(app, 'model-schema-additional-items-test');
new IntegTest(app, 'ModelSchemaAdditionalItemsTest', {
  testCases: [stack],
});
app.synth();
