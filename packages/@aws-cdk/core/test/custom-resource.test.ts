import { nodeunitShim, Test } from 'nodeunit-shim';
import { CustomResource, RemovalPolicy, Stack } from '../lib';
import { toCloudFormation } from './util';

nodeunitShim({
  'simple case provider identified by service token'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new CustomResource(stack, 'MyCustomResource', {
      serviceToken: 'MyServiceToken',
      properties: {
        Prop1: 'boo',
        Prop2: 'bar',
      },
    });

    // THEN
    test.deepEqual(toCloudFormation(stack), {
      Resources: {
        MyCustomResource: {
          Type: 'AWS::CloudFormation::CustomResource',
          Properties: {
            ServiceToken: 'MyServiceToken',
            Prop1: 'boo',
            Prop2: 'bar',
          },
          UpdateReplacePolicy: 'Delete',
          DeletionPolicy: 'Delete',
        },
      },
    });
    test.done();
  },

  'resource type can be specified'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new CustomResource(stack, 'MyCustomResource', {
      serviceToken: 'MyServiceToken',
      resourceType: 'Custom::MyResourceType',
    });

    // THEN
    test.deepEqual(toCloudFormation(stack), {
      Resources: {
        MyCustomResource: {
          Type: 'Custom::MyResourceType',
          Properties: {
            ServiceToken: 'MyServiceToken',
          },
          UpdateReplacePolicy: 'Delete',
          DeletionPolicy: 'Delete',
        },
      },
    });
    test.done();
  },

  'removal policy'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new CustomResource(stack, 'MyCustomResource', {
      serviceToken: 'MyServiceToken',
      removalPolicy: RemovalPolicy.RETAIN,
    });

    // THEN
    test.deepEqual(toCloudFormation(stack), {
      Resources: {
        MyCustomResource: {
          Type: 'AWS::CloudFormation::CustomResource',
          Properties: {
            ServiceToken: 'MyServiceToken',
          },
          UpdateReplacePolicy: 'Retain',
          DeletionPolicy: 'Retain',
        },
      },
    });
    test.done();
  },

  'resource type must begin with "Custom::"'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // THEN
    test.throws(() => new CustomResource(stack, 'MyCustomResource', {
      resourceType: 'MyResourceType',
      serviceToken: 'FooBar',
    }), /Custom resource type must begin with "Custom::"/);

    test.done();
  },

  'properties can be pascal-cased'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new CustomResource(stack, 'MyCustomResource', {
      serviceToken: 'MyServiceToken',
      pascalCaseProperties: true,
      properties: {
        prop1: 'boo',
        boom: {
          onlyFirstLevel: 1234,
        },
      },
    });

    // THEN
    test.deepEqual(toCloudFormation(stack), {
      Resources: {
        MyCustomResource: {
          Type: 'AWS::CloudFormation::CustomResource',
          Properties: {
            ServiceToken: 'MyServiceToken',
            Prop1: 'boo',
            Boom: {
              onlyFirstLevel: 1234,
            },
          },
          UpdateReplacePolicy: 'Delete',
          DeletionPolicy: 'Delete',
        },
      },
    });
    test.done();
  },

  'pascal-casing of props is disabled by default'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new CustomResource(stack, 'MyCustomResource', {
      serviceToken: 'MyServiceToken',
      properties: {
        prop1: 'boo',
        boom: {
          onlyFirstLevel: 1234,
        },
      },
    });

    // THEN
    test.deepEqual(toCloudFormation(stack), {
      Resources: {
        MyCustomResource: {
          Type: 'AWS::CloudFormation::CustomResource',
          Properties: {
            ServiceToken: 'MyServiceToken',
            prop1: 'boo',
            boom: {
              onlyFirstLevel: 1234,
            },
          },
          UpdateReplacePolicy: 'Delete',
          DeletionPolicy: 'Delete',
        },
      },
    });
    test.done();
  },

});
