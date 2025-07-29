import { FunctionParameter, Function, FunctionSchema, ParameterType, RequireConfirmation } from '../../../bedrock/agents/function-schema';
import { ValidationError } from '../../../bedrock/agents/validation-helpers';

describe('FunctionParameter', () => {
  test('constructs with minimal properties', () => {
    const param = new FunctionParameter({
      type: ParameterType.STRING,
    });

    expect(param.type).toEqual(ParameterType.STRING);
    expect(param.required).toEqual(true);
    expect(param.description).toBeUndefined();
  });

  test('constructs with all properties', () => {
    const param = new FunctionParameter({
      type: ParameterType.NUMBER,
      required: false,
      description: 'A test parameter',
    });

    expect(param.type).toEqual(ParameterType.NUMBER);
    expect(param.required).toEqual(false);
    expect(param.description).toEqual('A test parameter');
  });

  test('validates description length', () => {
    // Create a description that exceeds the max length of 500
    const longDescription = 'a'.repeat(501);

    expect(() => {
      new FunctionParameter({
        type: ParameterType.STRING,
        description: longDescription,
      });
    }).toThrow(ValidationError);
  });

  test('renders correctly', () => {
    const param = new FunctionParameter({
      type: ParameterType.BOOLEAN,
      required: false,
      description: 'A boolean parameter',
    });

    const rendered = param._render();
    expect(rendered).toEqual({
      type: ParameterType.BOOLEAN,
      required: false,
      description: 'A boolean parameter',
    });
  });

  test('renders without description', () => {
    const param = new FunctionParameter({
      type: ParameterType.INTEGER,
      required: true,
    });

    const rendered = param._render();
    expect(rendered).toEqual({
      type: ParameterType.INTEGER,
      required: true,
      description: undefined,
    });
  });
});

describe('Function', () => {
  test('constructs with minimal properties', () => {
    const func = new Function({
      name: 'testFunction',
      description: 'A test function',
    });

    expect(func.name).toEqual('testFunction');
    expect(func.description).toEqual('A test function');
    expect(func.parameters).toEqual({});
    expect(func.requireConfirmation).toEqual(RequireConfirmation.DISABLED);
  });

  test('constructs with all properties', () => {
    const func = new Function({
      name: 'testFunction',
      description: 'A test function',
      parameters: {
        param1: {
          type: ParameterType.STRING,
          required: true,
          description: 'A string parameter',
        },
        param2: {
          type: ParameterType.NUMBER,
          required: false,
        },
      },
      requireConfirmation: RequireConfirmation.ENABLED,
    });

    expect(func.name).toEqual('testFunction');
    expect(func.description).toEqual('A test function');
    expect(Object.keys(func.parameters)).toEqual(['param1', 'param2']);
    expect(func.parameters.param1.type).toEqual(ParameterType.STRING);
    expect(func.parameters.param2.required).toEqual(false);
    expect(func.requireConfirmation).toEqual(RequireConfirmation.ENABLED);
  });

  test('validates function name length', () => {
    // Create a name that exceeds the max length of 100
    const longName = 'a'.repeat(101);

    expect(() => {
      new Function({
        name: longName,
        description: 'A test function',
      });
    }).toThrow(ValidationError);
  });

  test('validates function description length', () => {
    // Create a description that exceeds the max length of 500
    const longDescription = 'a'.repeat(501);

    expect(() => {
      new Function({
        name: 'testFunction',
        description: longDescription,
      });
    }).toThrow(ValidationError);
  });

  test('validates parameter name length', () => {
    // Create a parameter name that exceeds the max length of 100
    const longParamName = 'a'.repeat(101);

    expect(() => {
      new Function({
        name: 'testFunction',
        description: 'A test function',
        parameters: {
          [longParamName]: {
            type: ParameterType.STRING,
          },
        },
      });
    }).toThrow(ValidationError);
  });

  test('renders correctly with parameters', () => {
    const func = new Function({
      name: 'testFunction',
      description: 'A test function',
      parameters: {
        param1: {
          type: ParameterType.STRING,
          description: 'A string parameter',
        },
        param2: {
          type: ParameterType.BOOLEAN,
          required: false,
        },
      },
      requireConfirmation: RequireConfirmation.ENABLED,
    });

    const rendered = func._render();
    expect(rendered).toEqual({
      name: 'testFunction',
      description: 'A test function',
      parameters: {
        param1: {
          type: ParameterType.STRING,
          required: true,
          description: 'A string parameter',
        },
        param2: {
          type: ParameterType.BOOLEAN,
          required: false,
          description: undefined,
        },
      },
      requireConfirmation: RequireConfirmation.ENABLED,
    });
  });

  test('renders correctly without parameters', () => {
    const func = new Function({
      name: 'testFunction',
      description: 'A test function',
    });

    const rendered = func._render();
    expect(rendered).toEqual({
      name: 'testFunction',
      description: 'A test function',
      parameters: {},
      requireConfirmation: RequireConfirmation.DISABLED,
    });
  });
});

describe('FunctionSchema', () => {
  test('constructs with functions', () => {
    const schema = new FunctionSchema({
      functions: [
        {
          name: 'function1',
          description: 'First test function',
        },
        {
          name: 'function2',
          description: 'Second test function',
          parameters: {
            param1: {
              type: ParameterType.STRING,
            },
          },
        },
      ],
    });

    expect(schema.functions.length).toEqual(2);
    expect(schema.functions[0].name).toEqual('function1');
    expect(schema.functions[1].name).toEqual('function2');
  });

  test('throws error when no functions provided', () => {
    expect(() => {
      new FunctionSchema({
        functions: [],
      });
    }).toThrow(ValidationError);
  });

  test('renders correctly', () => {
    const schema = new FunctionSchema({
      functions: [
        {
          name: 'function1',
          description: 'First test function',
        },
        {
          name: 'function2',
          description: 'Second test function',
          parameters: {
            param1: {
              type: ParameterType.STRING,
            },
          },
          requireConfirmation: RequireConfirmation.ENABLED,
        },
      ],
    });

    const rendered = schema._render();
    expect(rendered).toEqual({
      functions: [
        {
          name: 'function1',
          description: 'First test function',
          parameters: {},
          requireConfirmation: RequireConfirmation.DISABLED,
        },
        {
          name: 'function2',
          description: 'Second test function',
          parameters: {
            param1: {
              type: ParameterType.STRING,
              required: true,
              description: undefined,
            },
          },
          requireConfirmation: RequireConfirmation.ENABLED,
        },
      ],
    });
  });

  test('handles undefined functions array', () => {
    expect(() => {
      new FunctionSchema({
        functions: undefined as any,
      });
    }).toThrow(ValidationError);
  });
});
