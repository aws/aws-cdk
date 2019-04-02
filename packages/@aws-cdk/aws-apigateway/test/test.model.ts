import { expect, haveResource, SynthUtils } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import { JsonSchemaSchema, MockIntegration, Model, RestApi } from '../lib';

export = {
  'minimal setup'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const restApi = new RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
    restApi.root.addMethod('GET'); // needs at least one method

    // WHEN
    new Model(stack, 'test-model', { restApi, contentType: 'application/json', schema: {} });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Model', {
      ContentType: 'application/json',
      Schema: {},
    }));

    test.done();
  },

  'create model with valid JSON schema'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const restApi = new RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
    restApi.root.addMethod('GET'); // needs at least one method

    // WHEN
    const schema = {
      schema: JsonSchemaSchema.draft4,
      title: 'ChocolateBars',
      type: 'array',
      items: {
        type: 'string'
      }
    };
    new Model(stack, 'test-model', { restApi, contentType: 'application/json', schema });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Model', {
      ContentType: 'application/json',
      Schema: {
        $schema: 'http://json-schema.org/draft-04/schema#',
        title: 'ChocolateBars',
        type: 'array',
        items: {
          type: 'string'
        }
      },
    }));

    test.done();
  },

  'create a model with a name and/or description'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const restApi = new RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
    restApi.root.addMethod('GET'); // needs at least one method

    // WHEN
    new Model(stack, 'test-model', {
      restApi,
      contentType: 'application/json',
      schema: {},
      name: 'Gnome',
      description: 'A data model fit for gnomes.',
    });
    new Model(stack, 'test-model-2', {
      restApi,
      contentType: 'application/json',
      schema: {},
      name: 'Tree',
    });
    new Model(stack, 'test-model-three', {
      restApi,
      contentType: 'application/json',
      schema: {},
      description: 'What has eight legs and is sitting on your shoulder?'
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Model', {
      ContentType: 'application/json',
      Schema: {},
      Name: 'Gnome',
      Description: 'A data model fit for gnomes.',
    }));
    expect(stack).to(haveResource('AWS::ApiGateway::Model', {
      ContentType: 'application/json',
      Schema: {},
      Name: 'Tree',
    }));
    expect(stack).to(haveResource('AWS::ApiGateway::Model', {
      ContentType: 'application/json',
      Schema: {},
      Description: 'What has eight legs and is sitting on your shoulder?',
    }));

    test.done();
  },

  'consume model defined in the same stack in a MethodResponse'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const restApi = new RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
    const model = new Model(stack, 'test-model', { restApi, contentType: 'application/json', schema: {} });

    // WHEN
    restApi.root.addMethod('GET', new MockIntegration(), {
      methodResponses: [{
        statusCode: '200',
        responseModels: {
          'application/json': model
        }
      }]
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Model', {
      ContentType: 'application/json',
      Schema: {},
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      MethodResponses: [{
        StatusCode: '200',
        ResponseModels: {
          'application/json': { Ref: 'testmodelModel9B6651C7' }
        }
      }]
    }));

    test.done();
  },

  'can import a model and use it'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const restApi = new RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
    const model = Model.import(stack, 'imported-model', {
      modelId: 'my-magic-model',
    });

    // WHEN
    restApi.root.addMethod('GET', new MockIntegration(), {
      methodResponses: [{
        statusCode: '200',
        responseModels: {
          'application/json': model
        }
      }]
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      MethodResponses: [{
        StatusCode: '200',
        ResponseModels: {
          'application/json': 'my-magic-model'
        }
      }]
    }));

    test.done();
  },

  'can export a model from the created stack'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const restApi = new RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
    restApi.root.addMethod('GET'); // needs at least one method

    // WHEN
    const model = new Model(stack, 'test-model', { restApi, contentType: 'application/json', schema: {} });
    model.export();

    // THEN
    stack.node.prepareTree();
    test.deepEqual(SynthUtils.toCloudFormation(stack).Outputs, {
      testmodelModelId7667010D: {
        Value: { Ref: 'testmodelModel9B6651C7' },
        Export: { Name: 'Stack:testmodelModelId7667010D' }
      }
    });

    test.done();
  },
  'import/export'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const restApi = new RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
    restApi.root.addMethod('GET'); // needs at least one method

    // WHEN
    const imported = Model.import(stack, 'imported-model', {
      modelId: 'my-imported-model',
    });

    const model = new Model(stack, 'test-model', { restApi, contentType: 'application/json', schema: {} });
    const exported = model.export();

    // THEN
    stack.node.prepareTree();
    test.deepEqual(SynthUtils.toCloudFormation(stack).Outputs, {
      testmodelModelId7667010D: {
        Value: { Ref: 'testmodelModel9B6651C7' },
        Export: { Name: 'Stack:testmodelModelId7667010D' }
      }
    });

    test.deepEqual(imported.node.resolve(imported.modelId), 'my-imported-model');
    test.deepEqual(imported.node.resolve(exported), { modelId: { 'Fn::ImportValue': 'Stack:testmodelModelId7667010D' } });
    test.done();
  },

  'can generate an external reference to a model, that can be consumed by another model'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const restApi = new RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
    restApi.root.addMethod('GET'); // needs at least one method

    // WHEN
    const model = new Model(stack, 'test-model', { restApi, contentType: 'application/json', schema: {}, name: 'Test' });

    // THEN
    test.deepEqual(model.node.resolve(model.referenceForSchema), {
      'Fn::Join': [
        '',
        [
          'https://apigateway.',
          { Ref: "AWS::URLSuffix" },
          '/restapis/',
          { Ref: 'testapiD6451F70' },
          '/models/',
          { Ref: 'testmodelModel9B6651C7' },
        ]
      ]
    });
    test.done();
  },
};

/**
 * TODO: Test cases to add
 *
 * can define request model for method with model in stack (when support added for request model)
 * can define request model for method with imported model for imported model (when support added for request model)
 *
 */