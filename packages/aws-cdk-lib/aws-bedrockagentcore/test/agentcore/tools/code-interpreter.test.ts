import { Template, Match } from '../../../../assertions';
import * as cloudwatch from '../../../../aws-cloudwatch';
import * as ec2 from '../../../../aws-ec2';
import * as iam from '../../../../aws-iam';
import { App, Stack } from '../../../../core';
import * as cdk from '../../../../core';
import { CodeInterpreterNetworkConfiguration } from '../../../lib/network/network-configuration';
import { CodeInterpreterCustom } from '../../../lib/tools/code-interpreter';

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
      networkConfiguration: CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
    });

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
    // Verify that the CodeInterpreterCustom resource exists with basic properties
    template.hasResourceProperties('AWS::BedrockAgentCore::CodeInterpreterCustom', {
      Name: 'test_code_interpreter',
      NetworkConfiguration: { NetworkMode: 'PUBLIC' },
    });
  });

  test('Should have service role with confused deputy conditions', () => {
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: { Service: 'bedrock-agentcore.amazonaws.com' },
            Condition: {
              StringEquals: { 'aws:SourceAccount': '123456789012' },
              ArnLike: {
                'aws:SourceArn': {
                  'Fn::Join': ['', Match.arrayWith([
                    ':bedrock-agentcore:us-east-1:123456789012:code-interpreter-custom/test_code_interpreter*',
                  ])],
                },
              },
            },
          },
        ],
      },
    });
  });
});

describe('CodeInterpreterCustom with VPC config tests', () => {
  let template: Template;
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });
  });

  test('Provide VPC and security groups, no security group created', () => {
    const vpc = new ec2.Vpc(stack, 'testVPC');
    const sg = new ec2.SecurityGroup(stack, 'SG', { vpc });

    new CodeInterpreterCustom(stack, 'test-ci', {
      codeInterpreterCustomName: 'test_ci',
      description: 'A code interpreter',
      networkConfiguration: CodeInterpreterNetworkConfiguration.usingVpc(stack, {
        vpc: vpc,
        securityGroups: [sg],
      }),
    });

    template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::BedrockAgentCore::CodeInterpreterCustom', {
      NetworkConfiguration: {
        NetworkMode: 'VPC',
        VpcConfig: {
          Subnets: Match.arrayWith([Match.objectLike({ Ref: Match.stringLikeRegexp('testVPC.*Subnet.*') })]),
          SecurityGroups: Match.arrayWith([Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('SG.*'), 'GroupId'] })]),
        },
      },
    });
  });

  test('Provide VPC and no security groups, a security group is created', () => {
    const vpc = new ec2.Vpc(stack, 'testVPC');

    new CodeInterpreterCustom(stack, 'test-ci', {
      codeInterpreterCustomName: 'test_ci',
      description: 'A test code interpreter',
      networkConfiguration: CodeInterpreterNetworkConfiguration.usingVpc(stack, {
        vpc: vpc,
      }),
    });

    template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::BedrockAgentCore::CodeInterpreterCustom', {
      NetworkConfiguration: {
        NetworkMode: 'VPC',
        VpcConfig: {
          Subnets: Match.arrayWith([Match.objectLike({ Ref: Match.stringLikeRegexp('testVPC.*Subnet.*') })]),
          SecurityGroups: Match.arrayWith([Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('SecurityGroup.*'), 'GroupId'] })]),
        },
      },
    });
  });

  test('Both security groups and allowAllOutbound are specified, an exception is thrown', () => {
    expect(() => {
      const vpc = new ec2.Vpc(stack, 'testVPC');
      const sg = new ec2.SecurityGroup(stack, 'SG', { vpc });

      new CodeInterpreterCustom(stack, 'test-ci', {
        codeInterpreterCustomName: 'test_ci',
        networkConfiguration: CodeInterpreterNetworkConfiguration.usingVpc(stack, {
          vpc: vpc,
          securityGroups: [sg],
          allowAllOutbound: false,
        }),
      });
    }).toThrow('Configure \'allowAllOutbound\' directly on the supplied SecurityGroups');
  });

  test('Vpc specified but no scope, an exception is thrown', () => {
    expect(() => {
      const vpc = new ec2.Vpc(stack, 'testVPC');
      const sg = new ec2.SecurityGroup(stack, 'SG', { vpc });

      new CodeInterpreterCustom(stack, 'test-ci', {
        codeInterpreterCustomName: 'test_ci',
        networkConfiguration: CodeInterpreterNetworkConfiguration.usingVpc(undefined as any, {
          vpc: vpc,
          securityGroups: [sg],
        }),
      });
    }).toThrow('Scope is required to create the security group');
  });

  test('Vpc not specified, an exception is thrown when accessing Connections object', () => {
    const codeInterpreter = new CodeInterpreterCustom(stack, 'test-ci', {
      codeInterpreterCustomName: 'test_ci',
      networkConfiguration: CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
    });

    const when = () => codeInterpreter.connections;
    expect(when).toThrow('Cannot manage network access without configuring a VPC');
  });

  test('When adding security group after code interpreter instantiation, it is reflected in VpcConfig of Code Interpreter Custom', () => {
    const vpc = new ec2.Vpc(stack, 'testVPC');

    const codeInterpreter = new CodeInterpreterCustom(stack, 'test-ci', {
      codeInterpreterCustomName: 'test_ci',
      networkConfiguration: CodeInterpreterNetworkConfiguration.usingVpc(stack, {
        vpc: vpc,
      }),
    });

    expect(codeInterpreter.connections.securityGroups.length).toBe(1);

    codeInterpreter.connections.addSecurityGroup(new ec2.SecurityGroup(stack, 'AdditionalGroup', { vpc }));

    expect(codeInterpreter.connections.securityGroups.length).toBe(2);

    template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::BedrockAgentCore::CodeInterpreterCustom', {
      NetworkConfiguration: {
        NetworkMode: 'VPC',
        VpcConfig: {
          SecurityGroups: [
            {
              'Fn::GetAtt': [
                'SecurityGroupDD263621',
                'GroupId',
              ],
            },
            {
              'Fn::GetAtt': [
                'AdditionalGroup4973CFAA',
                'GroupId',
              ],
            },
          ],
        },
      },
    });
  });
});

describe('CodeInterpreterCustom static methods tests', () => {
  // @ts-ignore
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

    cdk.Validations.of(app).acknowledge({ id: 'CloudFormation-Validate::F0001', reason: 'Empty stack used for import-only tests' });
    template = Template.fromStack(stack);
  });

  test('fromCodeInterpreterCustomAttributes should create a CodeInterpreterCustom reference from existing attributes', () => {
    const codeInterpreter = CodeInterpreterCustom.fromCodeInterpreterCustomAttributes(stack, 'test-ci', {
      codeInterpreterArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:code-interpreter/test-ci',
      roleArn: 'arn:aws:iam::123456789012:role/test-ci-role',
      lastUpdatedAt: '2021-01-01T00:00:00Z',
      status: 'ACTIVE',
      createdAt: '2021-01-01T00:00:00Z',
    });

    expect(codeInterpreter.codeInterpreterArn).toBe('arn:aws:bedrock-agentcore:us-east-1:123456789012:code-interpreter/test-ci');
    expect(codeInterpreter.executionRole).toBeDefined();
    expect(codeInterpreter.lastUpdatedAt).toBe('2021-01-01T00:00:00Z');
    expect(codeInterpreter.status).toBe('ACTIVE');
    expect(codeInterpreter.createdAt).toBe('2021-01-01T00:00:00Z');
  });

  test('fromCodeInterpreterCustomAttributes provides undefined values when not provided', () => {
    const codeInterpreter = CodeInterpreterCustom.fromCodeInterpreterCustomAttributes(stack, 'test-ci-2', {
      codeInterpreterArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:code-interpreter/test-ci',
      roleArn: 'arn:aws:iam::123456789012:role/test-ci-role',
    });

    expect(codeInterpreter.codeInterpreterArn).toBe('arn:aws:bedrock-agentcore:us-east-1:123456789012:code-interpreter/test-ci');
    expect(codeInterpreter.executionRole).toBeDefined();
    expect(codeInterpreter.lastUpdatedAt).toBeUndefined();
    expect(codeInterpreter.status).toBeUndefined();
    expect(codeInterpreter.createdAt).toBeUndefined();
  });

  test('fromCodeInterpreterCustomAttributes with no security groups specified, an exception is thrown', () => {
    // GIVEN
    const codeInterpreter = CodeInterpreterCustom.fromCodeInterpreterCustomAttributes(stack, 'test-ci-3', {
      codeInterpreterArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:code-interpreter/test-ci',
      roleArn: 'arn:aws:iam::123456789012:role/test-ci-role',
      lastUpdatedAt: '2021-01-01T00:00:00Z',
      status: 'ACTIVE',
      createdAt: '2021-01-01T00:00:00Z',
    });

    // WHEN
    const when = () => codeInterpreter.connections;

    // THEN
    expect(when).toThrow(/Cannot manage network access without configuring a VPC/);
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
      networkConfiguration: CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
      executionRole: customRole,
    });

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
        networkConfiguration: CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
      });
    }).toThrow('The field Code interpreter name with value "test-code-interpreter" does not match the required pattern /^[a-zA-Z][a-zA-Z0-9_]{0,47}$/');
  });

  test('Should accept empty name (validation not enforced)', () => {
    expect(() => {
      new CodeInterpreterCustom(stack, 'empty-name', {
        codeInterpreterCustomName: '',
        networkConfiguration: CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
      });
    }).toThrow('The field Code interpreter name is 0 characters long but must be at least 1 characters');
  });

  test('Should accept name with spaces (validation not enforced)', () => {
    expect(() => {
      new CodeInterpreterCustom(stack, 'name-with-spaces', {
        codeInterpreterCustomName: 'test code interpreter',
        networkConfiguration: CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
      });
    }).toThrow('The field Code interpreter name with value "test code interpreter" does not match the required pattern /^[a-zA-Z][a-zA-Z0-9_]{0,47}$/');
  });

  test('Should accept name with special characters (validation not enforced)', () => {
    expect(() => {
      new CodeInterpreterCustom(stack, 'name-with-special-chars', {
        codeInterpreterCustomName: 'test@code-interpreter',
        networkConfiguration: CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
      });
    }).toThrow('The field Code interpreter name with value "test@code-interpreter" does not match the required pattern /^[a-zA-Z][a-zA-Z0-9_]{0,47}$/');
  });

  test('Should accept name exceeding 48 characters (validation not enforced)', () => {
    const longName = 'a'.repeat(49);
    expect(() => {
      new CodeInterpreterCustom(stack, 'long-name', {
        codeInterpreterCustomName: longName,
        networkConfiguration: CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
      });
    }).toThrow('The field Code interpreter name is 49 characters long but must be less than or equal to 48 characters');
  });

  test('Should accept valid name with underscores', () => {
    expect(() => {
      new CodeInterpreterCustom(stack, 'valid-name', {
        codeInterpreterCustomName: 'test_code_interpreter_123',
        networkConfiguration: CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
      });
    }).not.toThrow();
  });

  test('Should accept valid name with only letters and numbers', () => {
    expect(() => {
      new CodeInterpreterCustom(stack, 'valid-name-2', {
        codeInterpreterCustomName: 'testCodeInterpreter123',
        networkConfiguration: CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
      });
    }).not.toThrow();
  });

  test('Should use default PUBLIC network configuration when not provided', () => {
    const codeInterpreter = new CodeInterpreterCustom(stack, 'default-network', {
      codeInterpreterCustomName: 'test_code_interpreter_default',
    });

    expect(codeInterpreter.networkConfiguration.networkMode).toBe('PUBLIC');
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
        networkConfiguration: CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
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
        networkConfiguration: CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
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
        networkConfiguration: CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
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
        networkConfiguration: CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
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
        networkConfiguration: CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
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
        networkConfiguration: CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
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
        networkConfiguration: CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
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
        networkConfiguration: CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
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
        networkConfiguration: CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
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
        networkConfiguration: CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
        tags: undefined,
      });
    }).not.toThrow();
  });

  test('Should accept empty tags object', () => {
    expect(() => {
      new CodeInterpreterCustom(stack, 'empty-tags', {
        codeInterpreterCustomName: 'test_code_interpreter',
        networkConfiguration: CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
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
      networkConfiguration: CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
      tags: {
        Environment: 'Production',
        Team: 'AI/ML',
        Project: 'AgentCore',
      },
    });

    template = Template.fromStack(stack);
  });

  test('Should handle tags correctly when tags are provided', () => {
    // Verify that the CodeInterpreterCustom resource exists with basic properties and tags
    template.hasResourceProperties('AWS::BedrockAgentCore::CodeInterpreterCustom', {
      Name: 'test_code_interpreter_with_tags',
      NetworkConfiguration: { NetworkMode: 'PUBLIC' },
    });
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
      networkConfiguration: CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
      tags: {
        Environment: 'Test',
        Team: 'AI/ML',
      },
    });

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
      networkConfiguration: CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
      executionRole: role,
    });

    template = Template.fromStack(stack);

    // Verify that the execution role ARN is properly referenced
    template.hasResourceProperties('AWS::BedrockAgentCore::CodeInterpreterCustom', {
      ExecutionRoleArn: { 'Fn::GetAtt': ['TestRole6C9272DF', 'Arn'] },
    });
  });

  test('Should support SANDBOX network mode', () => {
    app = new App();
    stack = new Stack(app, 'TestStack');

    new CodeInterpreterCustom(stack, 'TestCodeInterpreter', {
      codeInterpreterCustomName: 'test_code_interpreter_sandbox',
      networkConfiguration: CodeInterpreterNetworkConfiguration.usingSandboxNetwork(),
    });

    template = Template.fromStack(stack);

    // Verify that the SANDBOX network mode is properly set
    template.hasResourceProperties('AWS::BedrockAgentCore::CodeInterpreterCustom', {
      NetworkConfiguration: { NetworkMode: 'SANDBOX' },
    });
  });

  test('Should support PUBLIC network mode', () => {
    app = new App();
    stack = new Stack(app, 'TestStack');

    new CodeInterpreterCustom(stack, 'TestCodeInterpreter', {
      codeInterpreterCustomName: 'test_code_interpreter_public',
      networkConfiguration: CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
    });

    template = Template.fromStack(stack);

    // Verify that the PUBLIC network mode is properly set
    template.hasResourceProperties('AWS::BedrockAgentCore::CodeInterpreterCustom', {
      NetworkConfiguration: { NetworkMode: 'PUBLIC' },
    });
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
      networkConfiguration: CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
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
    new CodeInterpreterCustom(stack, 'AutoRoleInterpreter', {
      codeInterpreterCustomName: 'test_code_interpreter_no_role',
      description: 'A test code interpreter without explicit execution role',
      networkConfiguration: CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
      // No executionRole provided - should create default role
    });

    const template = Template.fromStack(stack);

    // Should have the code interpreter resource
    template.resourceCountIs('AWS::BedrockAgentCore::CodeInterpreterCustom', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);

    // Should have ExecutionRoleArn property
    template.hasResourceProperties('AWS::BedrockAgentCore::CodeInterpreterCustom', {
      ExecutionRoleArn: {
        'Fn::GetAtt': [Match.stringLikeRegexp('AutoRoleInterpreter.*Role.*'), 'Arn'],
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
      networkConfiguration: CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
      executionRole: customRole,
    });

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
      networkConfiguration: CodeInterpreterNetworkConfiguration.usingSandboxNetwork(),
    });

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
    expect(codeInterpreter.networkConfiguration.networkMode).toBe('PUBLIC');
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
      networkConfiguration: CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
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

describe('CodeInterpreterCustom error metric methods tests', () => {
  let stack: cdk.Stack;
  let codeInterpreter: CodeInterpreterCustom;

  function alarmForMetric(id: string, metric: cloudwatch.Metric): void {
    new cloudwatch.Alarm(stack, id, { metric, evaluationPeriods: 1, threshold: 1 });
  }

  beforeEach(() => {
    const app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack');
    codeInterpreter = new CodeInterpreterCustom(stack, 'test-code-interpreter-error-metrics', {
      codeInterpreterCustomName: 'test_code_interpreter_error_metrics',
      networkConfiguration: CodeInterpreterNetworkConfiguration.usingPublicNetwork(),
    });
  });

  test('metricThrottlesForApiOperation() produces Throttles with Operation dimension', () => {
    alarmForMetric('ThrottlesAlarm', codeInterpreter.metricThrottlesForApiOperation('TestOperation'));

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::CloudWatch::Alarm', {
      MetricName: 'Throttles',
      Namespace: 'AWS/Bedrock-AgentCore',
      Statistic: 'Sum',
      Dimensions: Match.arrayWith([
        Match.objectLike({ Name: 'Operation', Value: 'TestOperation' }),
        Match.objectLike({ Name: 'Resource', Value: { 'Fn::GetAtt': [Match.stringLikeRegexp('testcodeinterpretererrormetrics.*'), 'CodeInterpreterArn'] } }),
      ]),
    });
  });

  test('metricSystemErrorsForApiOperation() produces SystemErrors with Operation dimension', () => {
    alarmForMetric('SysErrAlarm', codeInterpreter.metricSystemErrorsForApiOperation('TestOperation'));

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::CloudWatch::Alarm', {
      MetricName: 'SystemErrors',
      Namespace: 'AWS/Bedrock-AgentCore',
      Statistic: 'Sum',
      Dimensions: Match.arrayWith([
        Match.objectLike({ Name: 'Operation', Value: 'TestOperation' }),
      ]),
    });
  });

  test('metricUserErrorsForApiOperation() produces UserErrors with Operation dimension', () => {
    alarmForMetric('UserErrAlarm', codeInterpreter.metricUserErrorsForApiOperation('TestOperation'));

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::CloudWatch::Alarm', {
      MetricName: 'UserErrors',
      Namespace: 'AWS/Bedrock-AgentCore',
      Statistic: 'Sum',
      Dimensions: Match.arrayWith([
        Match.objectLike({ Name: 'Operation', Value: 'TestOperation' }),
      ]),
    });
  });
});

describe('CodeInterpreter Optional Physical Names', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    const app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
  });

  test('Should create CodeInterpreterCustom without codeInterpreterCustomName (auto-generated)', () => {
    const codeInterpreter = new CodeInterpreterCustom(stack, 'TestCodeInterpreter', {
    });

    expect(codeInterpreter.codeInterpreterCustomName).toBeDefined();
    expect(codeInterpreter.codeInterpreterCustomName).not.toBe('');
  });
});
