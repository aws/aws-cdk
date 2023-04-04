import { toCloudFormation } from './util';
import { CustomResource, RemovalPolicy, Stack } from '../lib';

describe('custom resource', () => {
  test('simple case provider identified by service token', () => {
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
    expect(toCloudFormation(stack)).toEqual({
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
  });

  test('resource type can be specified', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new CustomResource(stack, 'MyCustomResource', {
      serviceToken: 'MyServiceToken',
      resourceType: 'Custom::MyResourceType',
    });

    // THEN
    expect(toCloudFormation(stack)).toEqual({
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
  });

  test('removal policy', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new CustomResource(stack, 'MyCustomResource', {
      serviceToken: 'MyServiceToken',
      removalPolicy: RemovalPolicy.RETAIN,
    });

    // THEN
    expect(toCloudFormation(stack)).toEqual({
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
  });

  test('resource type must begin with "Custom::"', () => {
    // GIVEN
    const stack = new Stack();

    // THEN
    expect(() => new CustomResource(stack, 'MyCustomResource', {
      resourceType: 'MyResourceType',
      serviceToken: 'FooBar',
    })).toThrow(/Custom resource type must begin with "Custom::"/);
  });

  test('Custom resource type length must be less than 60 characters', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    expect(() => new CustomResource(stack, 'MyCustomResource', {
      resourceType: 'Custom::Adding_An_Additional_Fifty_Three_Characters_For_Error',
      serviceToken: 'FooBar',
      // THEN
    })).toThrow(/Custom resource type length > 60/);
  });

  test('properties can be pascal-cased', () => {
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
    expect(toCloudFormation(stack)).toEqual({
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
  });

  test('pascal-casing of props is disabled by default', () => {
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
    expect(toCloudFormation(stack)).toEqual({
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
  });
});
