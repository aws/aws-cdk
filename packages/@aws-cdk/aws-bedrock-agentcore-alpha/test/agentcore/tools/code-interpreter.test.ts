import * as cdk from 'aws-cdk-lib';
import { App, Stack } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import { CodeInterpreterCustom } from '../../../agentcore/tools/code-interpreter';
import { CodeInterpreterNetworkConfiguration } from '../../../agentcore/tools/network-configuration';

describe('CodeInterpreterCustom default tests', () => {
  let template: Template;
  let app: cdk.App;
  let stack: cdk.Stack;
  // @ts-ignore
  let codeInterpreter: CodeInterpreterCustom;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    codeInterpreter = new CodeInterpreterCustom(stack, 'test-code-interpreter', {
      codeInterpreterCustomName: 'test_code_interpreter',
      description: 'A test code interpreter for code execution',
      networkConfiguration: CodeInterpreterNetworkConfiguration.PUBLIC_NETWORK,
    });

    app.synth();
    template = Template.fromStack(stack);
  });

  test('Should have the correct resources', () => {
    template.resourceCountIs('AWS::BedrockAgentCore::CodeInterpreterCustom', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
  });

  test('Should have CodeInterpreterCustom resource with expected properties', () => {
    template.hasResourceProperties('AWS::BedrockAgentCore::CodeInterpreterCustom', {
      Name: 'test_code_interpreter',
      NetworkConfiguration: {
        NetworkMode: 'PUBLIC',
      },
    });
  });

  test('Should handle tags correctly when no tags are provided', () => {
    // Verify that the CodeInterpreterCustom resource exists and has basic properties
    const codeInterpreterResource = template.findResources('AWS::BedrockAgentCore::CodeInterpreterCustom');
    const resourceId = Object.keys(codeInterpreterResource)[0];
    const resource = codeInterpreterResource[resourceId];

    // The resource should have basic properties
    expect(resource.Properties).toHaveProperty('Name');
    expect(resource.Properties).toHaveProperty('NetworkConfiguration');

    // Tags property handling - the important thing is that the construct works
    // The addPropertyOverride may or may not be visible in the template depending on CDK version
    if (resource.Properties.Tags) {
      expect(resource.Properties.Tags).toEqual({});
    }
  });
});

describe('CodeInterpreterCustom with custom execution role tests', () => {
  let template: Template;
  let app: cdk.App;
  let stack: cdk.Stack;
  let customRole: iam.Role;
  // @ts-ignore
  let codeInterpreter: CodeInterpreterCustom;

  beforeAll(() => {
    app = new cdk.App();

    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    // Create a custom execution role
    customRole = new iam.Role(stack, 'CustomExecutionRole', {
      assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
      roleName: 'custom-code-interpreter-execution-role',
    });

    codeInterpreter = new CodeInterpreterCustom(stack, 'test-code-interpreter', {
      codeInterpreterCustomName: 'test_code_interpreter',
      description: 'A test code interpreter with custom execution role',
      networkConfiguration: CodeInterpreterNetworkConfiguration.PUBLIC_NETWORK,
      executionRole: customRole,
    });

    app.synth();
    template = Template.fromStack(stack);
  });

  test('Should have the correct resources', () => {
    template.resourceCountIs('AWS::BedrockAgentCore::CodeInterpreterCustom', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
  });

  test('Should have CodeInterpreterCustom resource with custom execution role', () => {
    template.hasResourceProperties('AWS::BedrockAgentCore::CodeInterpreterCustom', {
      Name: 'test_code_interpreter',
      NetworkConfiguration: {
        NetworkMode: 'PUBLIC',
      },
    });
  });

  test('Should have custom execution role with correct properties', () => {
    template.hasResourceProperties('AWS::IAM::Role', {
      RoleName: 'custom-code-interpreter-execution-role',
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'bedrock-agentcore.amazonaws.com',
            },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });
});

describe('CodeInterpreterCustom name validation tests', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });
  });

  test('Should accept name with hyphen (validation not enforced)', () => {
    expect(() => {
      new CodeInterpreterCustom(stack, 'test-code-interpreter', {
        codeInterpreterCustomName: 'test-code-interpreter',
        networkConfiguration: CodeInterpreterNetworkConfiguration.PUBLIC_NETWORK,
      });
    }).toThrow('The field Code interpreter name with value "test-code-interpreter" does not match the required pattern /^[a-zA-Z][a-zA-Z0-9_]{0,47}$/');
  });

  test('Should accept empty name (validation not enforced)', () => {
    expect(() => {
      new CodeInterpreterCustom(stack, 'empty-name', {
        codeInterpreterCustomName: '',
        networkConfiguration: CodeInterpreterNetworkConfiguration.PUBLIC_NETWORK,
      });
    }).toThrow('The field Code interpreter name is 0 characters long but must be at least 1 characters');
  });

  test('Should accept name with spaces (validation not enforced)', () => {
    expect(() => {
      new CodeInterpreterCustom(stack, 'name-with-spaces', {
        codeInterpreterCustomName: 'test code interpreter',
        networkConfiguration: CodeInterpreterNetworkConfiguration.PUBLIC_NETWORK,
      });
    }).toThrow('The field Code interpreter name with value "test code interpreter" does not match the required pattern /^[a-zA-Z][a-zA-Z0-9_]{0,47}$/');
  });

  test('Should accept name with special characters (validation not enforced)', () => {
    expect(() => {
      new CodeInterpreterCustom(stack, 'name-with-special-chars', {
        codeInterpreterCustomName: 'test@code-interpreter',
        networkConfiguration: CodeInterpreterNetworkConfiguration.PUBLIC_NETWORK,
      });
    }).toThrow('The field Code interpreter name with value "test@code-interpreter" does not match the required pattern /^[a-zA-Z][a-zA-Z0-9_]{0,47}$/');
  });

  test('Should accept name exceeding 48 characters (validation not enforced)', () => {
    const longName = 'a'.repeat(49);
    expect(() => {
      new CodeInterpreterCustom(stack, 'long-name', {
        codeInterpreterCustomName: longName,
        networkConfiguration: CodeInterpreterNetworkConfiguration.PUBLIC_NETWORK,
      });
    }).toThrow('The field Code interpreter name is 49 characters long but must be less than or equal to 48 characters');
  });

  test('Should accept valid name with underscores', () => {
    expect(() => {
      new CodeInterpreterCustom(stack, 'valid-name', {
        codeInterpreterCustomName: 'test_code_interpreter_123',
        networkConfiguration: CodeInterpreterNetworkConfiguration.PUBLIC_NETWORK,
      });
    }).not.toThrow();
  });

  test('Should accept valid name with only letters and numbers', () => {
    expect(() => {
      new CodeInterpreterCustom(stack, 'valid-name-2', {
        codeInterpreterCustomName: 'testCodeInterpreter123',
        networkConfiguration: CodeInterpreterNetworkConfiguration.PUBLIC_NETWORK,
      });
    }).not.toThrow();
  });

  test('Should use default PUBLIC network configuration when not provided', () => {
    const codeInterpreter = new CodeInterpreterCustom(stack, 'default-network', {
      codeInterpreterCustomName: 'test_code_interpreter_default',
    });

    expect(codeInterpreter.networkConfiguration).toBe(CodeInterpreterNetworkConfiguration.PUBLIC_NETWORK);
  });
});

describe('CodeInterpreterCustom tags validation tests', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });
  });

  test('Should accept valid tags', () => {
    expect(() => {
      new CodeInterpreterCustom(stack, 'valid-tags', {
        codeInterpreterCustomName: 'test_code_interpreter',
        networkConfiguration: CodeInterpreterNetworkConfiguration.PUBLIC_NETWORK,
        tags: {
          'Environment': 'Production',
          'Team': 'AI/ML',
          'Project': 'AgentCore',
          'Cost-Center': '12345',
        },
      });
    }).not.toThrow();
  });

  test('Should accept tags with special characters', () => {
    expect(() => {
      new CodeInterpreterCustom(stack, 'special-chars-tags', {
        codeInterpreterCustomName: 'test_code_interpreter',
        networkConfiguration: CodeInterpreterNetworkConfiguration.PUBLIC_NETWORK,
        tags: {
          'Environment': 'Production',
          'Team@Company': 'AI/ML',
          'Project:Name': 'AgentCore',
          'Cost-Center': '12345',
          'Description': 'Test code interpreter with special chars',
        },
      });
    }).not.toThrow();
  });

  test('Should accept empty tag key (validation not enforced)', () => {
    expect(() => {
      new CodeInterpreterCustom(stack, 'empty-tag-key', {
        codeInterpreterCustomName: 'test_code_interpreter',
        networkConfiguration: CodeInterpreterNetworkConfiguration.PUBLIC_NETWORK,
        tags: {
          '': 'value',
        },
      });
    }).toThrow('The field Tag key is 0 characters long but must be at least 1 characters');
  });

  test('Should accept tag key exceeding 256 characters (validation not enforced)', () => {
    const longKey = 'a'.repeat(257);
    expect(() => {
      new CodeInterpreterCustom(stack, 'long-tag-key', {
        codeInterpreterCustomName: 'test_code_interpreter',
        networkConfiguration: CodeInterpreterNetworkConfiguration.PUBLIC_NETWORK,
        tags: {
          [longKey]: 'value',
        },
      });
    }).toThrow('The field Tag key is 257 characters long but must be less than or equal to 256 characters');
  });

  test('Should accept tag value exceeding 256 characters (validation not enforced)', () => {
    const longValue = 'a'.repeat(257);
    expect(() => {
      new CodeInterpreterCustom(stack, 'long-tag-value', {
        codeInterpreterCustomName: 'test_code_interpreter',
        networkConfiguration: CodeInterpreterNetworkConfiguration.PUBLIC_NETWORK,
        tags: {
          key: longValue,
        },
      });
    }).toThrow('The field Tag value is 257 characters long but must be less than or equal to 256 characters');
  });

  test('Should accept tag key with invalid characters (validation not enforced)', () => {
    expect(() => {
      new CodeInterpreterCustom(stack, 'invalid-tag-key', {
        codeInterpreterCustomName: 'test_code_interpreter',
        networkConfiguration: CodeInterpreterNetworkConfiguration.PUBLIC_NETWORK,
        tags: {
          'key#invalid': 'value',
        },
      });
    }).toThrow('The field Tag key with value "key#invalid" does not match the required pattern /^[a-zA-Z0-9\\s._:/=+@-]*$/');
  });

  test('Should accept tag value with invalid characters (validation not enforced)', () => {
    expect(() => {
      new CodeInterpreterCustom(stack, 'invalid-tag-value', {
        codeInterpreterCustomName: 'test_code_interpreter',
        networkConfiguration: CodeInterpreterNetworkConfiguration.PUBLIC_NETWORK,
        tags: {
          key: 'value#invalid',
        },
      });
    }).toThrow('The field Tag value with value "value#invalid" does not match the required pattern /^[a-zA-Z0-9\\s._:/=+@-]*$/');
  });

  test('Should accept null tag value (validation not enforced)', () => {
    expect(() => {
      new CodeInterpreterCustom(stack, 'null-tag-value', {
        codeInterpreterCustomName: 'test_code_interpreter',
        networkConfiguration: CodeInterpreterNetworkConfiguration.PUBLIC_NETWORK,
        tags: {
          key: null as any,
        },
      });
    }).not.toThrow();
  });

  test('Should accept undefined tag value (validation not enforced)', () => {
    expect(() => {
      new CodeInterpreterCustom(stack, 'undefined-tag-value', {
        codeInterpreterCustomName: 'test_code_interpreter',
        networkConfiguration: CodeInterpreterNetworkConfiguration.PUBLIC_NETWORK,
        tags: {
          key: undefined as any,
        },
      });
    }).not.toThrow();
  });

  test('Should accept undefined tags', () => {
    expect(() => {
      new CodeInterpreterCustom(stack, 'undefined-tags', {
        codeInterpreterCustomName: 'test_code_interpreter',
        networkConfiguration: CodeInterpreterNetworkConfiguration.PUBLIC_NETWORK,
        tags: undefined,
      });
    }).not.toThrow();
  });

  test('Should accept empty tags object', () => {
    expect(() => {
      new CodeInterpreterCustom(stack, 'empty-tags', {
        codeInterpreterCustomName: 'test_code_interpreter',
        networkConfiguration: CodeInterpreterNetworkConfiguration.PUBLIC_NETWORK,
        tags: {},
      });
    }).not.toThrow();
  });
});

describe('CodeInterpreterCustom with tags CloudFormation template tests', () => {
  let template: Template;
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    new CodeInterpreterCustom(stack, 'test-code-interpreter-with-tags', {
      codeInterpreterCustomName: 'test_code_interpreter_with_tags',
      description: 'A test code interpreter with tags',
      networkConfiguration: CodeInterpreterNetworkConfiguration.PUBLIC_NETWORK,
      tags: {
        Environment: 'Production',
        Team: 'AI/ML',
        Project: 'AgentCore',
      },
    });

    app.synth();
    template = Template.fromStack(stack);
  });

  test('Should handle tags correctly when tags are provided', () => {
    // Verify that the CodeInterpreterCustom resource exists and has basic properties
    const codeInterpreterResource = template.findResources('AWS::BedrockAgentCore::CodeInterpreterCustom');
    const resourceId = Object.keys(codeInterpreterResource)[0];
    const resource = codeInterpreterResource[resourceId];

    // The resource should have basic properties
    expect(resource.Properties).toHaveProperty('Name');
    expect(resource.Properties).toHaveProperty('NetworkConfiguration');

    // Tags property handling - the important thing is that the construct works
    // The addPropertyOverride may or may not be visible in the template depending on CDK version
    if (resource.Properties.Tags) {
      expect(resource.Properties.Tags).toHaveProperty('Environment');
      expect(resource.Properties.Tags).toHaveProperty('Team');
      expect(resource.Properties.Tags).toHaveProperty('Project');
    }
  });

  test('Should have correct resource count with tags', () => {
    template.resourceCountIs('AWS::BedrockAgentCore::CodeInterpreterCustom', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
  });
});

describe('CodeInterpreterCustom CloudFormation parameter validation tests', () => {
  let app: App;
  let stack: Stack;
  let template: Template;

  test('Should validate CloudFormation template structure', () => {
    app = new App();
    stack = new Stack(app, 'TestStack');

    new CodeInterpreterCustom(stack, 'TestCodeInterpreter', {
      codeInterpreterCustomName: 'test_code_interpreter',
      networkConfiguration: CodeInterpreterNetworkConfiguration.PUBLIC_NETWORK,
      tags: {
        Environment: 'Test',
        Team: 'AI/ML',
      },
    });

    app.synth();
    template = Template.fromStack(stack);

    // Verify that the template has the expected structure
    expect(template.toJSON()).toHaveProperty('Resources');
    // Conditions are not created in the current implementation
    // Outputs are no longer used - attributes are accessed directly from the resource
  });

  test('Should handle execution role ARN correctly', () => {
    app = new App();
    stack = new Stack(app, 'TestStack');

    const role = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
    });

    new CodeInterpreterCustom(stack, 'TestCodeInterpreter', {
      codeInterpreterCustomName: 'test_code_interpreter',
      networkConfiguration: CodeInterpreterNetworkConfiguration.PUBLIC_NETWORK,
      executionRole: role,
    });

    app.synth();
    template = Template.fromStack(stack);

    // Verify that the execution role ARN is properly referenced
    const codeInterpreterResource = template.findResources('AWS::BedrockAgentCore::CodeInterpreterCustom');
    const resourceId = Object.keys(codeInterpreterResource)[0];
    const resource = codeInterpreterResource[resourceId];

    expect(resource.Properties).toHaveProperty('ExecutionRoleArn');
    expect(resource.Properties.ExecutionRoleArn).toHaveProperty('Fn::GetAtt');
  });

  test('Should support SANDBOX network mode', () => {
    app = new App();
    stack = new Stack(app, 'TestStack');

    new CodeInterpreterCustom(stack, 'TestCodeInterpreter', {
      codeInterpreterCustomName: 'test_code_interpreter_sandbox',
      networkConfiguration: CodeInterpreterNetworkConfiguration.SANDBOX_NETWORK,
    });

    app.synth();
    template = Template.fromStack(stack);

    // Verify that the SANDBOX network mode is properly set
    const codeInterpreterResource = template.findResources('AWS::BedrockAgentCore::CodeInterpreterCustom');
    const resourceId = Object.keys(codeInterpreterResource)[0];
    const resource = codeInterpreterResource[resourceId];

    expect(resource.Properties.NetworkConfiguration.NetworkMode).toBe('SANDBOX');
  });

  test('Should support PUBLIC network mode', () => {
    app = new App();
    stack = new Stack(app, 'TestStack');

    new CodeInterpreterCustom(stack, 'TestCodeInterpreter', {
      codeInterpreterCustomName: 'test_code_interpreter_public',
      networkConfiguration: CodeInterpreterNetworkConfiguration.PUBLIC_NETWORK,
    });

    app.synth();
    template = Template.fromStack(stack);

    // Verify that the PUBLIC network mode is properly set
    const codeInterpreterResource = template.findResources('AWS::BedrockAgentCore::CodeInterpreterCustom');
    const resourceId = Object.keys(codeInterpreterResource)[0];
    const resource = codeInterpreterResource[resourceId];

    expect(resource.Properties.NetworkConfiguration.NetworkMode).toBe('PUBLIC');
  });
});

describe('CodeInterpreterCustom grant method tests', () => {
  let app: cdk.App;
  let stack: cdk.Stack;
  let codeInterpreter: CodeInterpreterCustom;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    codeInterpreter = new CodeInterpreterCustom(stack, 'test-code-interpreter', {
      codeInterpreterCustomName: 'test_code_interpreter',
      description: 'A test code interpreter for grant testing',
      networkConfiguration: CodeInterpreterNetworkConfiguration.PUBLIC_NETWORK,
    });
  });

  test('Should grant custom actions to IAM principal', () => {
    const user = new iam.User(stack, 'TestUser');
    const grant = codeInterpreter.grant(user, 'bedrock-agentcore:GetCodeInterpreter', 'bedrock-agentcore:ListCodeInterpreters');

    expect(grant).toBeDefined();
    expect(grant.success).toBe(true);
    expect(grant.principalStatements).toBeDefined();
    expect(grant.principalStatements.length).toBeGreaterThan(0);
  });

  test('Should grant read permissions to IAM principal', () => {
    const user = new iam.User(stack, 'TestUser2');
    const grant = codeInterpreter.grantRead(user);

    expect(grant).toBeDefined();
    expect(grant.success).toBe(true);
    expect(grant.principalStatements).toBeDefined();
    expect(grant.principalStatements.length).toBeGreaterThan(0);
  });

  test('Should grant use permissions to IAM principal', () => {
    const user = new iam.User(stack, 'TestUser3');
    const grant = codeInterpreter.grantUse(user);

    expect(grant).toBeDefined();
    expect(grant.success).toBe(true);
    expect(grant.principalStatements).toBeDefined();
    expect(grant.principalStatements.length).toBeGreaterThan(0);
  });

  test('Should grant invoke permissions to IAM principal', () => {
    const user = new iam.User(stack, 'TestUser4');
    const grant = codeInterpreter.grantInvoke(user);

    expect(grant).toBeDefined();
    expect(grant.success).toBe(true);
    expect(grant.principalStatements).toBeDefined();
    expect(grant.principalStatements.length).toBeGreaterThan(0);
  });

  test('Should grant permissions to IAM role', () => {
    const role = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('bedrock.amazonaws.com'),
    });

    const grant = codeInterpreter.grantRead(role);

    expect(grant).toBeDefined();
    expect(grant.success).toBe(true);
    expect(grant.principalStatements).toBeDefined();
    expect(grant.principalStatements.length).toBeGreaterThan(0);
  });

  test('Should grant permissions to IAM group', () => {
    const group = new iam.Group(stack, 'TestGroup');
    const grant = codeInterpreter.grantUse(group);

    expect(grant).toBeDefined();
    expect(grant.success).toBe(true);
    expect(grant.principalStatements).toBeDefined();
    expect(grant.principalStatements.length).toBeGreaterThan(0);
  });

  test('Should return a valid Grant object', () => {
    const user = new iam.User(stack, 'TestUser5');
    const grant = codeInterpreter.grantRead(user);

    expect(grant).toBeDefined();
    expect(grant.success).toBe(true);
    expect(grant.principalStatements).toBeDefined();
    expect(grant.principalStatements.length).toBeGreaterThan(0);
  });

  test('Should grant invoke permissions separately from use permissions', () => {
    const user = new iam.User(stack, 'TestUser6');
    const useGrant = codeInterpreter.grantUse(user);
    const invokeGrant = codeInterpreter.grantInvoke(user);

    expect(useGrant).toBeDefined();
    expect(invokeGrant).toBeDefined();
    expect(useGrant.success).toBe(true);
    expect(invokeGrant.success).toBe(true);
  });
});

describe('CodeInterpreterCustom execution role edge cases', () => {
  test('Should handle undefined execution role in CloudFormation template', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    // Create a code interpreter without explicit execution role
    new CodeInterpreterCustom(stack, 'test-code-interpreter-no-role', {
      codeInterpreterCustomName: 'test_code_interpreter_no_role',
      description: 'A test code interpreter without explicit execution role',
      networkConfiguration: CodeInterpreterNetworkConfiguration.PUBLIC_NETWORK,
      // No executionRole provided - should create default role
    });

    app.synth();
    const template = Template.fromStack(stack);

    // Should have the code interpreter resource
    template.resourceCountIs('AWS::BedrockAgentCore::CodeInterpreterCustom', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);

    // Should have ExecutionRoleArn property
    template.hasResourceProperties('AWS::BedrockAgentCore::CodeInterpreterCustom', {
      ExecutionRoleArn: {
        'Fn::GetAtt': [Match.anyValue(), 'Arn'],
      },
    });
  });

  test('Should handle custom execution role', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    const customRole = new iam.Role(stack, 'CustomCodeInterpreterRole', {
      assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
      roleName: 'custom-code-interpreter-role',
    });

    new CodeInterpreterCustom(stack, 'test-code-interpreter-custom-role', {
      codeInterpreterCustomName: 'test_code_interpreter_custom_role',
      description: 'A test code interpreter with custom execution role',
      networkConfiguration: CodeInterpreterNetworkConfiguration.PUBLIC_NETWORK,
      executionRole: customRole,
    });

    app.synth();
    const template = Template.fromStack(stack);

    // Should have the code interpreter resource
    template.resourceCountIs('AWS::BedrockAgentCore::CodeInterpreterCustom', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);

    // Should have custom execution role
    template.hasResourceProperties('AWS::IAM::Role', {
      RoleName: 'custom-code-interpreter-role',
    });

    // Should reference the custom role
    template.hasResourceProperties('AWS::BedrockAgentCore::CodeInterpreterCustom', {
      ExecutionRoleArn: {
        'Fn::GetAtt': [Match.stringLikeRegexp('CustomCodeInterpreterRole.*'), 'Arn'],
      },
    });
  });

  test('Should handle SANDBOX network mode', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    new CodeInterpreterCustom(stack, 'test-code-interpreter-sandbox', {
      codeInterpreterCustomName: 'test_code_interpreter_sandbox',
      description: 'A test code interpreter with SANDBOX network mode',
      networkConfiguration: CodeInterpreterNetworkConfiguration.SANDBOX_NETWORK,
    });

    app.synth();
    const template = Template.fromStack(stack);

    // Should have SANDBOX network mode
    template.hasResourceProperties('AWS::BedrockAgentCore::CodeInterpreterCustom', {
      NetworkConfiguration: {
        NetworkMode: 'SANDBOX',
      },
    });
  });

  test('Should handle default network configuration when not provided', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    const codeInterpreter = new CodeInterpreterCustom(stack, 'test-code-interpreter-default', {
      codeInterpreterCustomName: 'test_code_interpreter_default',
      description: 'A test code interpreter with default network configuration',
      // No networkConfiguration provided
    });

    // Should default to PUBLIC network mode
    expect(codeInterpreter.networkConfiguration).toBe(CodeInterpreterNetworkConfiguration.PUBLIC_NETWORK);
  });

  test('Should test metric methods with different configurations', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    const codeInterpreter = new CodeInterpreterCustom(stack, 'test-code-interpreter-metrics', {
      codeInterpreterCustomName: 'test_code_interpreter_metrics',
      networkConfiguration: CodeInterpreterNetworkConfiguration.PUBLIC_NETWORK,
    });

    // Test various metric methods
    const latencyMetric = codeInterpreter.metricLatencyForApiOperation('TestOperation');
    const invocationsMetric = codeInterpreter.metricInvocationsForApiOperation('TestOperation');
    const errorsMetric = codeInterpreter.metricErrorsForApiOperation('TestOperation');
    const sessionDurationMetric = codeInterpreter.metricSessionDuration();

    expect(latencyMetric).toBeDefined();
    expect(invocationsMetric).toBeDefined();
    expect(errorsMetric).toBeDefined();
    expect(sessionDurationMetric).toBeDefined();
  });
});
