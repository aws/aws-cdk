import { toCloudFormation } from './util';
import { Annotations } from '../../assertions';
import { CfnParameter, CustomResource, Duration, RemovalPolicy, Stack } from '../lib';

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

  test('set serviceTimeout', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new CustomResource(stack, 'MyCustomResource', {
      serviceToken: 'MyServiceToken',
      serviceTimeout: Duration.seconds(60),
    });

    // THEN
    expect(toCloudFormation(stack)).toEqual({
      Resources: {
        MyCustomResource: {
          Type: 'AWS::CloudFormation::CustomResource',
          Properties: {
            ServiceToken: 'MyServiceToken',
            ServiceTimeout: '60',
          },
          UpdateReplacePolicy: 'Delete',
          DeletionPolicy: 'Delete',
        },
      },
    });
  });

  test('set serviceTimeout with token as seconds', () => {
    // GIVEN
    const stack = new Stack();
    const durToken = new CfnParameter(stack, 'MyParameter', {
      type: 'Number',
      default: 60,
    });

    // WHEN
    new CustomResource(stack, 'MyCustomResource', {
      serviceToken: 'MyServiceToken',
      serviceTimeout: Duration.seconds(durToken.valueAsNumber),
    });

    // THEN
    expect(toCloudFormation(stack)).toEqual({
      Parameters: {
        MyParameter: {
          Default: 60,
          Type: 'Number',
        },
      },
      Resources: {
        MyCustomResource: {
          Type: 'AWS::CloudFormation::CustomResource',
          Properties: {
            ServiceToken: 'MyServiceToken',
            ServiceTimeout: {
              Ref: 'MyParameter',
            },
          },
          UpdateReplacePolicy: 'Delete',
          DeletionPolicy: 'Delete',
        },
      },
    });
  });

  test('throws error when serviceTimeout is set with token as units other than seconds', () => {
    // GIVEN
    const stack = new Stack();
    const durToken = new CfnParameter(stack, 'MyParameter', {
      type: 'Number',
      default: 60,
    });

    // WHEN
    expect(() => {
      new CustomResource(stack, 'MyCustomResource', {
        serviceToken: 'MyServiceToken',
        serviceTimeout: Duration.minutes(durToken.valueAsNumber),
      });
    }).toThrow('Duration must be specified as \'Duration.seconds()\' here since its value comes from a token and cannot be converted (got Duration.minutes)');
  });

  test.each([0, 4000])('throw an error when serviceTimeout is set to %d seconds.', (invalidSeconds: number) => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    expect(() => {
      new CustomResource(stack, 'MyCustomResource', {
        serviceToken: 'MyServiceToken',
        serviceTimeout: Duration.seconds(invalidSeconds),
      });
    }).toThrow(`serviceTimeout must either be between 1 and 3600 seconds, got ${invalidSeconds}`);
  });

  test('send warning if customResource construct property key is added to properties', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new CustomResource(stack, 'MyCustomResource', {
      serviceToken: 'MyServiceToken',
      properties: {
        ServiceToken: 'RepeatedToken', // this is repeated because serviceToken prop above will resolve as property ServiceToken
      },
    });

    // THEN
    Annotations.fromStack(stack).hasWarning('/Default/MyCustomResource', 'The following keys will be overwritten as they exist in the \'properties\' prop. Keys found: ServiceToken [ack: @aws-cdk/core:customResourcePropConflict]');
  });
});
