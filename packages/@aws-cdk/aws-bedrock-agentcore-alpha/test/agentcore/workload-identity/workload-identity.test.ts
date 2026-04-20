import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import { WorkloadIdentity } from '../../../lib/workload-identity/workload-identity';

describe('WorkloadIdentity default tests', () => {
  let template: Template;
  let app: cdk.App;
  let stack: cdk.Stack;
  let workloadIdentity: WorkloadIdentity;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    workloadIdentity = new WorkloadIdentity(stack, 'test-workload-identity', {
      workloadIdentityName: 'test_workload_identity',
    });

    app.synth();
    template = Template.fromStack(stack);
  });

  test('Should have the correct resources', () => {
    template.resourceCountIs('AWS::BedrockAgentCore::WorkloadIdentity', 1);
  });

  test('Should have WorkloadIdentity resource with expected properties', () => {
    template.hasResourceProperties('AWS::BedrockAgentCore::WorkloadIdentity', {
      Name: 'test_workload_identity',
    });
  });

  test('Should expose workloadIdentityArn', () => {
    expect(workloadIdentity.workloadIdentityArn).toBeDefined();
  });

  test('Should expose workloadIdentityName', () => {
    expect(workloadIdentity.workloadIdentityName).toBe('test_workload_identity');
  });

  test('Should handle tags correctly when no tags are provided', () => {
    const resource = template.findResources('AWS::BedrockAgentCore::WorkloadIdentity');
    const resourceId = Object.keys(resource)[0];
    const resourceProps = resource[resourceId];

    expect(resourceProps.Properties).toHaveProperty('Name');
  });
});

describe('WorkloadIdentity with OAuth2 return URLs tests', () => {
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

    new WorkloadIdentity(stack, 'test-workload-identity', {
      workloadIdentityName: 'test_workload_identity',
      allowedResourceOauth2ReturnUrls: [
        'https://example.com/callback',
        'https://example.com/auth/callback',
      ],
    });

    app.synth();
    template = Template.fromStack(stack);
  });

  test('Should have AllowedResourceOauth2ReturnUrls property', () => {
    template.hasResourceProperties('AWS::BedrockAgentCore::WorkloadIdentity', {
      Name: 'test_workload_identity',
      AllowedResourceOauth2ReturnUrls: [
        'https://example.com/callback',
        'https://example.com/auth/callback',
      ],
    });
  });
});

describe('WorkloadIdentity with tags tests', () => {
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

    new WorkloadIdentity(stack, 'test-workload-identity-with-tags', {
      workloadIdentityName: 'test_workload_identity_tags',
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
    const resource = template.findResources('AWS::BedrockAgentCore::WorkloadIdentity');
    const resourceId = Object.keys(resource)[0];
    const resourceProps = resource[resourceId];

    expect(resourceProps.Properties).toHaveProperty('Name');

    if (resourceProps.Properties.Tags) {
      expect(resourceProps.Properties.Tags).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ Key: 'Environment', Value: 'Production' }),
          expect.objectContaining({ Key: 'Team', Value: 'AI/ML' }),
          expect.objectContaining({ Key: 'Project', Value: 'AgentCore' }),
        ]),
      );
    }
  });
});

describe('WorkloadIdentity static methods tests', () => {
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

  test('fromWorkloadIdentityAttributes should create a WorkloadIdentity reference from existing attributes', () => {
    const workloadIdentity = WorkloadIdentity.fromWorkloadIdentityAttributes(stack, 'test-wi', {
      workloadIdentityArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:workload-identity-directory/default/workload-identity/test_wi',
      createdTime: '2021-01-01T00:00:00Z',
      lastUpdatedTime: '2021-01-01T00:00:00Z',
    });

    expect(workloadIdentity.workloadIdentityArn).toBe('arn:aws:bedrock-agentcore:us-east-1:123456789012:workload-identity-directory/default/workload-identity/test_wi');
    expect(workloadIdentity.createdTime).toBe('2021-01-01T00:00:00Z');
    expect(workloadIdentity.lastUpdatedTime).toBe('2021-01-01T00:00:00Z');
  });

  test('fromWorkloadIdentityAttributes provides undefined values when not provided', () => {
    const workloadIdentity = WorkloadIdentity.fromWorkloadIdentityAttributes(stack, 'test-wi-2', {
      workloadIdentityArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:workload-identity-directory/default/workload-identity/test_wi',
    });

    expect(workloadIdentity.workloadIdentityArn).toBe('arn:aws:bedrock-agentcore:us-east-1:123456789012:workload-identity-directory/default/workload-identity/test_wi');
    expect(workloadIdentity.createdTime).toBeUndefined();
    expect(workloadIdentity.lastUpdatedTime).toBeUndefined();
  });

  test('fromWorkloadIdentityAttributes should expose workloadIdentityRef', () => {
    const workloadIdentity = WorkloadIdentity.fromWorkloadIdentityAttributes(stack, 'test-wi-3', {
      workloadIdentityArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:workload-identity-directory/default/workload-identity/test_wi',
    });

    expect(workloadIdentity.workloadIdentityRef).toBeDefined();
    expect(workloadIdentity.workloadIdentityRef.workloadIdentityArn).toBe('arn:aws:bedrock-agentcore:us-east-1:123456789012:workload-identity-directory/default/workload-identity/test_wi');
    expect(workloadIdentity.workloadIdentityRef.workloadIdentityName).toBeDefined();
  });
});

describe('WorkloadIdentity name validation tests', () => {
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

  test('Should reject name with hyphen', () => {
    expect(() => {
      new WorkloadIdentity(stack, 'test-wi-hyphen', {
        workloadIdentityName: 'test-workload-identity',
      });
    }).toThrow('The field Workload identity name with value "test-workload-identity" does not match the required pattern /^[a-zA-Z][a-zA-Z0-9_]{0,47}$/');
  });

  test('Should reject empty name', () => {
    expect(() => {
      new WorkloadIdentity(stack, 'empty-name', {
        workloadIdentityName: '',
      });
    }).toThrow('The field Workload identity name is 0 characters long but must be at least 1 characters');
  });

  test('Should reject name with spaces', () => {
    expect(() => {
      new WorkloadIdentity(stack, 'name-with-spaces', {
        workloadIdentityName: 'test workload identity',
      });
    }).toThrow('The field Workload identity name with value "test workload identity" does not match the required pattern /^[a-zA-Z][a-zA-Z0-9_]{0,47}$/');
  });

  test('Should reject name with special characters', () => {
    expect(() => {
      new WorkloadIdentity(stack, 'name-with-special-chars', {
        workloadIdentityName: 'test@workload-identity',
      });
    }).toThrow('The field Workload identity name with value "test@workload-identity" does not match the required pattern /^[a-zA-Z][a-zA-Z0-9_]{0,47}$/');
  });

  test('Should reject name exceeding 48 characters', () => {
    const longName = 'a'.repeat(49);
    expect(() => {
      new WorkloadIdentity(stack, 'long-name', {
        workloadIdentityName: longName,
      });
    }).toThrow('The field Workload identity name is 49 characters long but must be less than or equal to 48 characters');
  });

  test('Should accept valid name with underscores', () => {
    expect(() => {
      new WorkloadIdentity(stack, 'valid-name', {
        workloadIdentityName: 'test_workload_identity_123',
      });
    }).not.toThrow();
  });

  test('Should accept valid name with only letters and numbers', () => {
    expect(() => {
      new WorkloadIdentity(stack, 'valid-name-2', {
        workloadIdentityName: 'testWorkloadIdentity123',
      });
    }).not.toThrow();
  });
});

describe('WorkloadIdentity tags validation tests', () => {
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
      new WorkloadIdentity(stack, 'valid-tags', {
        workloadIdentityName: 'test_workload_identity',
        tags: {
          'Environment': 'Production',
          'Team': 'AI/ML',
          'Project': 'AgentCore',
          'Cost-Center': '12345',
        },
      });
    }).not.toThrow();
  });

  test('Should reject empty tag key', () => {
    expect(() => {
      new WorkloadIdentity(stack, 'empty-tag-key', {
        workloadIdentityName: 'test_workload_identity',
        tags: {
          '': 'value',
        },
      });
    }).toThrow('The field Tag key is 0 characters long but must be at least 1 characters');
  });

  test('Should reject tag key exceeding 256 characters', () => {
    const longKey = 'a'.repeat(257);
    expect(() => {
      new WorkloadIdentity(stack, 'long-tag-key', {
        workloadIdentityName: 'test_workload_identity',
        tags: {
          [longKey]: 'value',
        },
      });
    }).toThrow('The field Tag key is 257 characters long but must be less than or equal to 256 characters');
  });

  test('Should reject tag value exceeding 256 characters', () => {
    const longValue = 'a'.repeat(257);
    expect(() => {
      new WorkloadIdentity(stack, 'long-tag-value', {
        workloadIdentityName: 'test_workload_identity',
        tags: {
          key: longValue,
        },
      });
    }).toThrow('The field Tag value is 257 characters long but must be less than or equal to 256 characters');
  });

  test('Should reject tag key with invalid characters', () => {
    expect(() => {
      new WorkloadIdentity(stack, 'invalid-tag-key', {
        workloadIdentityName: 'test_workload_identity',
        tags: {
          'key#invalid': 'value',
        },
      });
    }).toThrow('The field Tag key with value "key#invalid" does not match the required pattern /^[a-zA-Z0-9\\s._:/=+@-]*$/');
  });

  test('Should reject tag value with invalid characters', () => {
    expect(() => {
      new WorkloadIdentity(stack, 'invalid-tag-value', {
        workloadIdentityName: 'test_workload_identity',
        tags: {
          key: 'value#invalid',
        },
      });
    }).toThrow('The field Tag value with value "value#invalid" does not match the required pattern /^[a-zA-Z0-9\\s._:/=+@-]*$/');
  });

  test('Should accept undefined tags', () => {
    expect(() => {
      new WorkloadIdentity(stack, 'undefined-tags', {
        workloadIdentityName: 'test_workload_identity',
        tags: undefined,
      });
    }).not.toThrow();
  });

  test('Should accept empty tags object', () => {
    expect(() => {
      new WorkloadIdentity(stack, 'empty-tags', {
        workloadIdentityName: 'test_workload_identity',
        tags: {},
      });
    }).not.toThrow();
  });
});

describe('WorkloadIdentity grant method tests', () => {
  let app: cdk.App;
  let stack: cdk.Stack;
  let workloadIdentity: WorkloadIdentity;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    workloadIdentity = new WorkloadIdentity(stack, 'test-workload-identity', {
      workloadIdentityName: 'test_workload_identity',
    });
  });

  test('Should grant custom actions to IAM principal', () => {
    const user = new iam.User(stack, 'TestUser');
    const grant = workloadIdentity.grant(user, 'bedrock-agentcore:GetWorkloadIdentity');

    expect(grant).toBeDefined();
    expect(grant.success).toBe(true);
    expect(grant.principalStatements).toBeDefined();
    expect(grant.principalStatements.length).toBeGreaterThan(0);
  });

  test('Should grant access token permissions to IAM principal', () => {
    const user = new iam.User(stack, 'TestUser2');
    const grant = workloadIdentity.grantGetAccessToken(user);

    expect(grant).toBeDefined();
    expect(grant.success).toBe(true);
    expect(grant.principalStatements).toBeDefined();
    expect(grant.principalStatements.length).toBeGreaterThan(0);
  });

  test('Should grant read permissions to IAM principal', () => {
    const user = new iam.User(stack, 'TestUser3');
    const grant = workloadIdentity.grantRead(user);

    expect(grant).toBeDefined();
    expect(grant.success).toBe(true);
    expect(grant.principalStatements).toBeDefined();
    expect(grant.principalStatements.length).toBeGreaterThan(0);
  });

  test('Should grant admin permissions to IAM principal', () => {
    const user = new iam.User(stack, 'TestUser4');
    const grant = workloadIdentity.grantAdmin(user);

    expect(grant).toBeDefined();
    expect(grant.success).toBe(true);
    expect(grant.principalStatements).toBeDefined();
    expect(grant.principalStatements.length).toBeGreaterThan(0);
  });

  test('Should grant permissions to IAM role', () => {
    const role = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('bedrock.amazonaws.com'),
    });

    const grant = workloadIdentity.grantRead(role);

    expect(grant).toBeDefined();
    expect(grant.success).toBe(true);
    expect(grant.principalStatements).toBeDefined();
    expect(grant.principalStatements.length).toBeGreaterThan(0);
  });

  test('Should grant access token permissions with correct actions', () => {
    const user = new iam.User(stack, 'TestUser5');
    const grant = workloadIdentity.grantGetAccessToken(user);

    expect(grant).toBeDefined();
    expect(grant.success).toBe(true);

    const statement = grant.principalStatements[0];
    expect(statement).toBeDefined();
    const actions = statement.actions;
    expect(actions).toContain('bedrock-agentcore:GetWorkloadAccessToken');
    expect(actions).toContain('bedrock-agentcore:GetWorkloadAccessTokenForJWT');
    expect(actions).toContain('bedrock-agentcore:GetWorkloadAccessTokenForUserId');
  });

  test('Should grant admin permissions with correct actions', () => {
    const user = new iam.User(stack, 'TestUser6');
    const grant = workloadIdentity.grantAdmin(user);

    expect(grant).toBeDefined();
    expect(grant.success).toBe(true);

    const statement = grant.principalStatements[0];
    expect(statement).toBeDefined();
    const actions = statement.actions;
    expect(actions).toContain('bedrock-agentcore:CreateWorkloadIdentity');
    expect(actions).toContain('bedrock-agentcore:GetWorkloadIdentity');
    expect(actions).toContain('bedrock-agentcore:UpdateWorkloadIdentity');
    expect(actions).toContain('bedrock-agentcore:DeleteWorkloadIdentity');
    expect(actions).toContain('bedrock-agentcore:ListWorkloadIdentities');
  });
});

describe('WorkloadIdentity tags edge case tests', () => {
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

  test('Should accept null tag value', () => {
    expect(() => {
      new WorkloadIdentity(stack, 'null-tag-value', {
        workloadIdentityName: 'test_workload_identity',
        tags: {
          key: null as any,
        },
      });
    }).not.toThrow();
  });

  test('Should accept undefined tag value', () => {
    expect(() => {
      new WorkloadIdentity(stack, 'undefined-tag-value', {
        workloadIdentityName: 'test_workload_identity',
        tags: {
          key: undefined as any,
        },
      });
    }).not.toThrow();
  });

  test('Should accept tags with special characters in values', () => {
    expect(() => {
      new WorkloadIdentity(stack, 'special-chars-tags', {
        workloadIdentityName: 'test_workload_identity',
        tags: {
          'Environment': 'Production',
          'Team@Company': 'AI/ML',
          'Project:Name': 'AgentCore',
        },
      });
    }).not.toThrow();
  });
});

describe('WorkloadIdentity with Token values tests', () => {
  test('Should accept token-based name without validation errors', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    const param = new cdk.CfnParameter(stack, 'WIName', {
      type: 'String',
      default: 'my_workload_identity',
    });

    expect(() => {
      new WorkloadIdentity(stack, 'token-name', {
        workloadIdentityName: param.valueAsString,
      });
    }).not.toThrow();
  });
});

describe('WorkloadIdentity renderTags tests', () => {
  test('Should not include tags when none provided', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack');

    new WorkloadIdentity(stack, 'NoTagsWI', {
      workloadIdentityName: 'test_wi',
    });

    app.synth();
    const template = Template.fromStack(stack);

    const resource = template.findResources('AWS::BedrockAgentCore::WorkloadIdentity');
    const resourceId = Object.keys(resource)[0];
    const resourceProps = resource[resourceId];

    // Tags should not be present or should be undefined
    expect(resourceProps.Properties.Tags).toBeUndefined();
  });

  test('Should not include tags when empty object provided', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack');

    new WorkloadIdentity(stack, 'EmptyTagsWI', {
      workloadIdentityName: 'test_wi',
      tags: {},
    });

    app.synth();
    const template = Template.fromStack(stack);

    const resource = template.findResources('AWS::BedrockAgentCore::WorkloadIdentity');
    const resourceId = Object.keys(resource)[0];
    const resourceProps = resource[resourceId];

    expect(resourceProps.Properties.Tags).toBeUndefined();
  });
});

describe('WorkloadIdentity auto-generated name tests', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    const app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
  });

  test('Should create WorkloadIdentity without workloadIdentityName (auto-generated)', () => {
    const workloadIdentity = new WorkloadIdentity(stack, 'TestWorkloadIdentity', {
    });

    expect(workloadIdentity.workloadIdentityName).toBeDefined();
    expect(workloadIdentity.workloadIdentityName).not.toBe('');
  });
});

describe('WorkloadIdentity CloudFormation template tests', () => {
  test('Should validate CloudFormation template structure', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack');

    new WorkloadIdentity(stack, 'TestWorkloadIdentity', {
      workloadIdentityName: 'test_workload_identity',
      tags: {
        Environment: 'Test',
        Team: 'AI/ML',
      },
    });

    app.synth();
    const template = Template.fromStack(stack);

    expect(template.toJSON()).toHaveProperty('Resources');
  });

  test('Should create no IAM roles (WorkloadIdentity has no execution role)', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack');

    new WorkloadIdentity(stack, 'TestWorkloadIdentity', {
      workloadIdentityName: 'test_workload_identity',
    });

    app.synth();
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::BedrockAgentCore::WorkloadIdentity', 1);
    template.resourceCountIs('AWS::IAM::Role', 0);
  });
});
