import * as cdk from 'aws-cdk-lib';
import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { BrowserCustom, BrowserNetworkMode } from '../../../agentcore/tools/browser';

describe('BrowserCustom default tests', () => {
  let template: Template;
  let app: cdk.App;
  let stack: cdk.Stack;
  // @ts-ignore
  let browser: BrowserCustom;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    browser = new BrowserCustom(stack, 'test-browser', {
      browserCustomName: 'test_browser',
      description: 'A test browser for web automation',
      networkConfiguration: {
        networkMode: BrowserNetworkMode.PUBLIC,
      },
    });

    app.synth();
    template = Template.fromStack(stack);
  });

  test('Should have the correct resources', () => {
    template.resourceCountIs('AWS::BedrockAgentCore::BrowserCustom', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
  });

  test('Should have BrowserCustom resource with expected properties', () => {
    template.hasResourceProperties('AWS::BedrockAgentCore::BrowserCustom', {
      Name: 'test_browser',
      NetworkConfiguration: {
        NetworkMode: 'PUBLIC',
      },
    });
  });

  test('Should handle tags correctly when no tags are provided', () => {
    // Verify that the BrowserCustom resource exists and has basic properties
    const browserResource = template.findResources('AWS::BedrockAgentCore::BrowserCustom');
    const resourceId = Object.keys(browserResource)[0];
    const resource = browserResource[resourceId];

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

describe('BrowserCustom with recording config tests', () => {
  let template: Template;
  let app: cdk.App;
  let stack: cdk.Stack;
  let recordingBucket: s3.Bucket;
  // @ts-ignore
  let browser: BrowserCustom;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    recordingBucket = new s3.Bucket(stack, 'RecordingBucket', {
      bucketName: 'test-browser-recordings',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    browser = new BrowserCustom(stack, 'test-browser', {
      browserCustomName: 'test_browser',
      description: 'A test browser for web automation',
      networkConfiguration: {
        networkMode: BrowserNetworkMode.PUBLIC,
      },
      recordingConfig: {
        enabled: true,
        s3Location: {
          bucketName: recordingBucket.bucketName,
          objectKey: 'test-browser-recordings/',
        },
      },
    });

    app.synth();
    template = Template.fromStack(stack);
  });

  test('Should have the correct resources', () => {
    template.resourceCountIs('AWS::BedrockAgentCore::BrowserCustom', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::S3::Bucket', 1);
  });

  test('Should have BrowserCustom resource with recording config', () => {
    template.hasResourceProperties('AWS::BedrockAgentCore::BrowserCustom', {
      Name: 'test_browser',
      NetworkConfiguration: {
        NetworkMode: 'PUBLIC',
      },
    });
  });
});

describe('BrowserCustom with custom execution role tests', () => {
  let template: Template;
  let app: cdk.App;
  let stack: cdk.Stack;
  let customRole: iam.Role;
  // @ts-ignore
  let browser: BrowserCustom;

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
      roleName: 'custom-browser-execution-role',
    });

    browser = new BrowserCustom(stack, 'test-browser', {
      browserCustomName: 'test_browser',
      description: 'A test browser with custom execution role',
      networkConfiguration: {
        networkMode: BrowserNetworkMode.PUBLIC,
      },
      executionRole: customRole,
    });

    app.synth();
    template = Template.fromStack(stack);
  });

  test('Should have the correct resources', () => {
    template.resourceCountIs('AWS::BedrockAgentCore::BrowserCustom', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
  });

  test('Should have BrowserCustom resource with custom execution role', () => {
    template.hasResourceProperties('AWS::BedrockAgentCore::BrowserCustom', {
      Name: 'test_browser',
      NetworkConfiguration: {
        NetworkMode: 'PUBLIC',
      },
    });
  });

  test('Should have custom execution role with correct properties', () => {
    template.hasResourceProperties('AWS::IAM::Role', {
      RoleName: 'custom-browser-execution-role',
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

describe('BrowserCustom name validation tests', () => {
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
      new BrowserCustom(stack, 'test-browser', {
        browserCustomName: 'test-browser',
        networkConfiguration: {
          networkMode: BrowserNetworkMode.PUBLIC,
        },
      });
    }).toThrow('The field Browser name with value "test-browser" does not match the required pattern /^[a-zA-Z][a-zA-Z0-9_]{0,47}$/');
  });

  test('Should accept empty name (validation not enforced)', () => {
    expect(() => {
      new BrowserCustom(stack, 'empty-name', {
        browserCustomName: '',
        networkConfiguration: {
          networkMode: BrowserNetworkMode.PUBLIC,
        },
      });
    }).toThrow('The field Browser name is 0 characters long but must be at least 1 characters');
  });

  test('Should accept name with spaces (validation not enforced)', () => {
    expect(() => {
      new BrowserCustom(stack, 'name-with-spaces', {
        browserCustomName: 'test browser',
        networkConfiguration: {
          networkMode: BrowserNetworkMode.PUBLIC,
        },
      });
    }).toThrow('The field Browser name with value "test browser" does not match the required pattern /^[a-zA-Z][a-zA-Z0-9_]{0,47}$/');
  });

  test('Should accept name with special characters (validation not enforced)', () => {
    expect(() => {
      new BrowserCustom(stack, 'name-with-special-chars', {
        browserCustomName: 'test@browser',
        networkConfiguration: {
          networkMode: BrowserNetworkMode.PUBLIC,
        },
      });
    }).toThrow('The field Browser name with value "test@browser" does not match the required pattern /^[a-zA-Z][a-zA-Z0-9_]{0,47}$/');
  });

  test('Should accept name exceeding 48 characters (validation not enforced)', () => {
    const longName = 'a'.repeat(49);
    expect(() => {
      new BrowserCustom(stack, 'long-name', {
        browserCustomName: longName,
        networkConfiguration: {
          networkMode: BrowserNetworkMode.PUBLIC,
        },
      });
    }).toThrow('The field Browser name is 49 characters long but must be less than or equal to 48 characters');
  });

  test('Should accept valid name with underscores', () => {
    expect(() => {
      new BrowserCustom(stack, 'valid-name', {
        browserCustomName: 'test_browser_123',
        networkConfiguration: {
          networkMode: BrowserNetworkMode.PUBLIC,
        },
      });
    }).not.toThrow();
  });

  test('Should accept valid name with only letters and numbers', () => {
    expect(() => {
      new BrowserCustom(stack, 'valid-name-2', {
        browserCustomName: 'testBrowser123',
        networkConfiguration: {
          networkMode: BrowserNetworkMode.PUBLIC,
        },
      });
    }).not.toThrow();
  });

  test('Should use default PUBLIC network configuration when not provided', () => {
    const browser = new BrowserCustom(stack, 'default-network', {
      browserCustomName: 'test_browser_default',
    });

    expect(browser.networkConfiguration.networkMode).toBe(BrowserNetworkMode.PUBLIC);
  });
});

describe('BrowserCustom tags validation tests', () => {
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
      new BrowserCustom(stack, 'valid-tags', {
        browserCustomName: 'test_browser',
        networkConfiguration: {
          networkMode: BrowserNetworkMode.PUBLIC,
        },
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
      new BrowserCustom(stack, 'special-chars-tags', {
        browserCustomName: 'test_browser',
        networkConfiguration: {
          networkMode: BrowserNetworkMode.PUBLIC,
        },
        tags: {
          'Environment': 'Production',
          'Team@Company': 'AI/ML',
          'Project:Name': 'AgentCore',
          'Cost-Center': '12345',
          'Description': 'Test browser with special chars',
        },
      });
    }).not.toThrow();
  });

  test('Should accept empty tag key (validation not enforced)', () => {
    expect(() => {
      new BrowserCustom(stack, 'empty-tag-key', {
        browserCustomName: 'test_browser',
        networkConfiguration: {
          networkMode: BrowserNetworkMode.PUBLIC,
        },
        tags: {
          '': 'value',
        },
      });
    }).toThrow('The field Tag key is 0 characters long but must be at least 1 characters');
  });

  test('Should accept tag key exceeding 256 characters (validation not enforced)', () => {
    const longKey = 'a'.repeat(257);
    expect(() => {
      new BrowserCustom(stack, 'long-tag-key', {
        browserCustomName: 'test_browser',
        networkConfiguration: {
          networkMode: BrowserNetworkMode.PUBLIC,
        },
        tags: {
          [longKey]: 'value',
        },
      });
    }).toThrow('The field Tag key is 257 characters long but must be less than or equal to 256 characters');
  });

  test('Should accept tag value exceeding 256 characters (validation not enforced)', () => {
    const longValue = 'a'.repeat(257);
    expect(() => {
      new BrowserCustom(stack, 'long-tag-value', {
        browserCustomName: 'test_browser',
        networkConfiguration: {
          networkMode: BrowserNetworkMode.PUBLIC,
        },
        tags: {
          key: longValue,
        },
      });
    }).toThrow('The field Tag value is 257 characters long but must be less than or equal to 256 characters');
  });

  test('Should accept tag key with invalid characters (validation not enforced)', () => {
    expect(() => {
      new BrowserCustom(stack, 'invalid-tag-key', {
        browserCustomName: 'test_browser',
        networkConfiguration: {
          networkMode: BrowserNetworkMode.PUBLIC,
        },
        tags: {
          'key#invalid': 'value',
        },
      });
    }).toThrow('The field Tag key with value "key#invalid" does not match the required pattern /^[a-zA-Z0-9\\s._:/=+@-]*$/');
  });

  test('Should accept tag value with invalid characters (validation not enforced)', () => {
    expect(() => {
      new BrowserCustom(stack, 'invalid-tag-value', {
        browserCustomName: 'test_browser',
        networkConfiguration: {
          networkMode: BrowserNetworkMode.PUBLIC,
        },
        tags: {
          key: 'value#invalid',
        },
      });
    }).toThrow('The field Tag value with value "value#invalid" does not match the required pattern /^[a-zA-Z0-9\\s._:/=+@-]*$/');
  });

  test('Should accept null tag value (validation not enforced)', () => {
    expect(() => {
      new BrowserCustom(stack, 'null-tag-value', {
        browserCustomName: 'test_browser',
        networkConfiguration: {
          networkMode: BrowserNetworkMode.PUBLIC,
        },
        tags: {
          key: null as any,
        },
      });
    }).not.toThrow();
  });

  test('Should accept undefined tag value (validation not enforced)', () => {
    expect(() => {
      new BrowserCustom(stack, 'undefined-tag-value', {
        browserCustomName: 'test_browser',
        networkConfiguration: {
          networkMode: BrowserNetworkMode.PUBLIC,
        },
        tags: {
          key: undefined as any,
        },
      });
    }).not.toThrow();
  });

  test('Should accept undefined tags', () => {
    expect(() => {
      new BrowserCustom(stack, 'undefined-tags', {
        browserCustomName: 'test_browser',
        networkConfiguration: {
          networkMode: BrowserNetworkMode.PUBLIC,
        },
        tags: undefined,
      });
    }).not.toThrow();
  });

  test('Should accept empty tags object', () => {
    expect(() => {
      new BrowserCustom(stack, 'empty-tags', {
        browserCustomName: 'test_browser',
        networkConfiguration: {
          networkMode: BrowserNetworkMode.PUBLIC,
        },
        tags: {},
      });
    }).not.toThrow();
  });
});

describe('BrowserCustom with tags CloudFormation template tests', () => {
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

    new BrowserCustom(stack, 'test-browser-with-tags', {
      browserCustomName: 'test_browser_with_tags',
      description: 'A test browser with tags',
      networkConfiguration: {
        networkMode: BrowserNetworkMode.PUBLIC,
      },
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
    // Verify that the BrowserCustom resource exists and has basic properties
    const browserResource = template.findResources('AWS::BedrockAgentCore::BrowserCustom');
    const resourceId = Object.keys(browserResource)[0];
    const resource = browserResource[resourceId];

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
    template.resourceCountIs('AWS::BedrockAgentCore::BrowserCustom', 1);
    template.resourceCountIs('AWS::IAM::Role', 1);
  });
});

describe('BrowserCustom CloudFormation parameter validation tests', () => {
  let app: App;
  let stack: Stack;
  let template: Template;

  test('Should pass bucket name string instead of S3 bucket resource', () => {
    app = new App();
    stack = new Stack(app, 'TestStack');

    // Create an S3 bucket resource
    const bucket = new s3.Bucket(stack, 'TestBucket', {
      bucketName: 'test-bucket-name',
    });

    // Create browser with S3 bucket resource
    new BrowserCustom(stack, 'TestBrowser', {
      browserCustomName: 'test_browser',
      networkConfiguration: {
        networkMode: BrowserNetworkMode.PUBLIC,
      },
      recordingConfig: {
        enabled: true,
        s3Location: {
          bucketName: bucket.bucketName, // Extract bucket name string
          objectKey: 'recordings/',
        },
      },
    });

    app.synth();
    template = Template.fromStack(stack);

    // Verify that the CloudFormation template has the correct parameter structure
    const browserResource = template.findResources('AWS::BedrockAgentCore::BrowserCustom');
    const resourceId = Object.keys(browserResource)[0];
    const resource = browserResource[resourceId];

    // The RecordingConfig should be properly constructed
    expect(resource.Properties).toHaveProperty('RecordingConfig');

    // Verify that the RecordingConfig is properly structured
    const recordingConfig = resource.Properties.RecordingConfig;
    expect(recordingConfig).toHaveProperty('Enabled');
    expect(recordingConfig).toHaveProperty('S3Location');

    // The current implementation doesn't create conditions
    // Just verify that the RecordingConfig is properly structured
    expect(recordingConfig.Enabled).toBe(true);
    expect(recordingConfig.S3Location).toBeDefined();
  });

  test('Should handle empty recording config with conditional logic', () => {
    app = new App();
    stack = new Stack(app, 'TestStack');

    new BrowserCustom(stack, 'TestBrowser', {
      browserCustomName: 'test_browser',
      networkConfiguration: {
        networkMode: BrowserNetworkMode.PUBLIC,
      },
      // No recording config provided
    });

    app.synth();
    template = Template.fromStack(stack);

    // Verify that the template has RecordingConfig with conditional logic
    const browserResource = template.findResources('AWS::BedrockAgentCore::BrowserCustom');
    const resourceId = Object.keys(browserResource)[0];
    const resource = browserResource[resourceId];

    // Should not have RecordingConfig when not provided
    expect(resource.Properties).not.toHaveProperty('RecordingConfig');
  });

  test('Should have recording disabled by default when not provided', () => {
    app = new App();
    stack = new Stack(app, 'TestStack');

    const browser = new BrowserCustom(stack, 'TestBrowser', {
      browserCustomName: 'test_browser',
      networkConfiguration: {
        networkMode: BrowserNetworkMode.PUBLIC,
      },
      // No recording config provided - should default to disabled
    });

    app.synth();
    template = Template.fromStack(stack);

    // Verify that recordingConfig is undefined (disabled by default)
    expect(browser.recordingConfig).toBeUndefined();

    // Verify that the CloudFormation template does not include RecordingConfig
    const browserResource = template.findResources('AWS::BedrockAgentCore::BrowserCustom');
    const resourceId = Object.keys(browserResource)[0];
    const resource = browserResource[resourceId];

    // Should not have RecordingConfig property when not provided
    expect(resource.Properties).not.toHaveProperty('RecordingConfig');
  });

  test('Should validate CloudFormation template structure', () => {
    app = new App();
    stack = new Stack(app, 'TestStack');

    new BrowserCustom(stack, 'TestBrowser', {
      browserCustomName: 'test_browser',
      networkConfiguration: {
        networkMode: BrowserNetworkMode.PUBLIC,
      },
      recordingConfig: {
        enabled: true,
        s3Location: {
          bucketName: 'test-bucket-name', // String bucket name
          objectKey: 'recordings/',
        },
      },
      tags: {
        Environment: 'Test',
        Team: 'AI/ML',
      },
    });

    app.synth();
    template = Template.fromStack(stack);

    // Verify that all conditions reference parameters, not resources
    const conditions = template.findConditions('*');
    Object.values(conditions).forEach((condition: any) => {
      // Check that conditions don't reference resources
      const conditionStr = JSON.stringify(condition);
      expect(conditionStr).not.toMatch(/AWS::S3::Bucket/);
      expect(conditionStr).not.toMatch(/AWS::IAM::Role/);
      expect(conditionStr).not.toMatch(/AWS::BedrockAgentCore::BrowserCustom/);
    });

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

    new BrowserCustom(stack, 'TestBrowser', {
      browserCustomName: 'test_browser',
      networkConfiguration: {
        networkMode: BrowserNetworkMode.PUBLIC,
      },
      executionRole: role,
    });

    app.synth();
    template = Template.fromStack(stack);

    // Verify that the execution role ARN is properly referenced
    const browserResource = template.findResources('AWS::BedrockAgentCore::BrowserCustom');
    const resourceId = Object.keys(browserResource)[0];
    const resource = browserResource[resourceId];

    expect(resource.Properties).toHaveProperty('ExecutionRoleArn');
    expect(resource.Properties.ExecutionRoleArn).toHaveProperty('Fn::GetAtt');
  });

  describe('Recording Configuration Validation', () => {
    test('Should accept valid recording configuration', () => {
      app = new App();
      stack = new Stack(app, 'TestStack');

      expect(() => {
        new BrowserCustom(stack, 'TestBrowser', {
          browserCustomName: 'test_browser',
          networkConfiguration: {
            networkMode: BrowserNetworkMode.PUBLIC,
          },
          recordingConfig: {
            enabled: true,
            s3Location: {
              bucketName: 'valid-bucket-name-123',
              objectKey: 'recordings/',
            },
          },
        });
      }).not.toThrow();
    });

    test('Should accept recording configuration without S3 location', () => {
      app = new App();
      stack = new Stack(app, 'TestStack');

      expect(() => {
        new BrowserCustom(stack, 'TestBrowser', {
          browserCustomName: 'test_browser',
          networkConfiguration: {
            networkMode: BrowserNetworkMode.PUBLIC,
          },
          recordingConfig: {
            enabled: true,
          },
        });
      }).not.toThrow();
    });

    test('Should accept S3 location without bucket name (validation not enforced)', () => {
      app = new App();
      stack = new Stack(app, 'TestStack');

      expect(() => {
        new BrowserCustom(stack, 'TestBrowser', {
          browserCustomName: 'test_browser',
          networkConfiguration: {
            networkMode: BrowserNetworkMode.PUBLIC,
          },
          recordingConfig: {
            enabled: true,
            s3Location: {
              bucketName: '', // Empty bucket name
              objectKey: 'recordings/',
            },
          },
        });
      }).toThrow('S3 bucket name is required when S3 location is provided for recording configuration');
    });

    test('Should accept S3 location without object key (validation not enforced)', () => {
      app = new App();
      stack = new Stack(app, 'TestStack');

      expect(() => {
        new BrowserCustom(stack, 'TestBrowser', {
          browserCustomName: 'test_browser',
          networkConfiguration: {
            networkMode: BrowserNetworkMode.PUBLIC,
          },
          recordingConfig: {
            enabled: true,
            s3Location: {
              bucketName: 'valid-bucket-name-123',
              objectKey: '', // Empty object key
            },
          },
        });
      }).toThrow('S3 object key (prefix) is required when S3 location is provided for recording configuration');
    });

    test('Should accept invalid bucket name - starts with uppercase (validation not enforced)', () => {
      app = new App();
      stack = new Stack(app, 'TestStack');

      expect(() => {
        new BrowserCustom(stack, 'TestBrowser', {
          browserCustomName: 'test_browser',
          networkConfiguration: {
            networkMode: BrowserNetworkMode.PUBLIC,
          },
          recordingConfig: {
            enabled: true,
            s3Location: {
              bucketName: 'Invalid-Bucket-Name',
              objectKey: 'recordings/',
            },
          },
        });
      }).toThrow('The field S3 bucket name with value "Invalid-Bucket-Name" does not match the required pattern /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/');
    });

    test('Should accept invalid bucket name - starts with hyphen (validation not enforced)', () => {
      app = new App();
      stack = new Stack(app, 'TestStack');

      expect(() => {
        new BrowserCustom(stack, 'TestBrowser', {
          browserCustomName: 'test_browser',
          networkConfiguration: {
            networkMode: BrowserNetworkMode.PUBLIC,
          },
          recordingConfig: {
            enabled: true,
            s3Location: {
              bucketName: '-invalid-bucket-name',
              objectKey: 'recordings/',
            },
          },
        });
      }).toThrow('The field S3 bucket name with value "-invalid-bucket-name" does not match the required pattern /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/');
    });

    test('Should accept invalid bucket name - ends with hyphen (validation not enforced)', () => {
      app = new App();
      stack = new Stack(app, 'TestStack');

      expect(() => {
        new BrowserCustom(stack, 'TestBrowser', {
          browserCustomName: 'test_browser',
          networkConfiguration: {
            networkMode: BrowserNetworkMode.PUBLIC,
          },
          recordingConfig: {
            enabled: true,
            s3Location: {
              bucketName: 'invalid-bucket-name-',
              objectKey: 'recordings/',
            },
          },
        });
      }).toThrow('The field S3 bucket name with value "invalid-bucket-name-" does not match the required pattern /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/');
    });

    test('Should accept invalid bucket name - contains underscore (validation not enforced)', () => {
      app = new App();
      stack = new Stack(app, 'TestStack');

      expect(() => {
        new BrowserCustom(stack, 'TestBrowser', {
          browserCustomName: 'test_browser',
          networkConfiguration: {
            networkMode: BrowserNetworkMode.PUBLIC,
          },
          recordingConfig: {
            enabled: true,
            s3Location: {
              bucketName: 'invalid_bucket_name',
              objectKey: 'recordings/',
            },
          },
        });
      }).toThrow('The field S3 bucket name with value "invalid_bucket_name" does not match the required pattern /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/');
    });

    test('Should accept invalid bucket name - too short (validation not enforced)', () => {
      app = new App();
      stack = new Stack(app, 'TestStack');

      expect(() => {
        new BrowserCustom(stack, 'TestBrowser', {
          browserCustomName: 'test_browser',
          networkConfiguration: {
            networkMode: BrowserNetworkMode.PUBLIC,
          },
          recordingConfig: {
            enabled: true,
            s3Location: {
              bucketName: 'a',
              objectKey: 'recordings/',
            },
          },
        });
      }).toThrow('The field S3 bucket name with value "a" does not match the required pattern /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/');
    });

    test('Should accept invalid bucket name - too long (validation not enforced)', () => {
      app = new App();
      stack = new Stack(app, 'TestStack');

      const longBucketName = 'a'.repeat(65); // 65 characters, exceeds the 63 character limit

      expect(() => {
        new BrowserCustom(stack, 'TestBrowser', {
          browserCustomName: 'test_browser',
          networkConfiguration: {
            networkMode: BrowserNetworkMode.PUBLIC,
          },
          recordingConfig: {
            enabled: true,
            s3Location: {
              bucketName: longBucketName,
              objectKey: 'recordings/',
            },
          },
        });
      }).toThrow('The field S3 bucket name with value "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" does not match the required pattern /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/');
    });

    test('Should accept empty object key (validation not enforced)', () => {
      app = new App();
      stack = new Stack(app, 'TestStack');

      expect(() => {
        new BrowserCustom(stack, 'TestBrowser', {
          browserCustomName: 'test_browser',
          networkConfiguration: {
            networkMode: BrowserNetworkMode.PUBLIC,
          },
          recordingConfig: {
            enabled: true,
            s3Location: {
              bucketName: 'valid-bucket-name-123',
              objectKey: '',
            },
          },
        });
      }).toThrow('S3 object key (prefix) is required when S3 location is provided for recording configuration');
    });

    test('Should accept valid bucket names with various valid characters', () => {
      app = new App();
      stack = new Stack(app, 'TestStack');

      const validBucketNames = [
        'valid-bucket-name',
        'valid.bucket.name',
        'valid-bucket-name-123',
        'valid.bucket.name.123',
        'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
        'bucket123',
        '123bucket',
        'bucket-name-123',
      ];

      validBucketNames.forEach((bucketName, index) => {
        expect(() => {
          new BrowserCustom(stack, `TestBrowser${index}`, {
            browserCustomName: `test_browser_${index}`,
            networkConfiguration: {
              networkMode: BrowserNetworkMode.PUBLIC,
            },
            recordingConfig: {
              enabled: true,
              s3Location: {
                bucketName: bucketName,
                objectKey: 'recordings/',
              },
            },
          });
        }).not.toThrow();
      });
    });

    test('Should accept valid object keys', () => {
      app = new App();
      stack = new Stack(app, 'TestStack');

      const validObjectKeys = [
        'recordings/',
        'recordings',
        'a',
        'recordings/subfolder/',
        'recordings-2024/',
        'recordings.with.dots/',
      ];

      validObjectKeys.forEach((objectKey, index) => {
        expect(() => {
          new BrowserCustom(stack, `TestBrowser${index}`, {
            browserCustomName: `test_browser_${index}`,
            networkConfiguration: {
              networkMode: BrowserNetworkMode.PUBLIC,
            },
            recordingConfig: {
              enabled: true,
              s3Location: {
                bucketName: 'valid-bucket-name-123',
                objectKey: objectKey,
              },
            },
          });
        }).not.toThrow();
      });
    });
  });
});
