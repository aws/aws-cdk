import { Annotations, Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as appreg from '../lib';

describe('Application', () => {
  let stack: cdk.Stack;
  beforeEach(() => {
    const app = new cdk.App({
      context: {
        '@aws-cdk/core:newStyleStackSynthesis': false,
      },
    });
    stack = new cdk.Stack(app);
  });

  test('default application creation', () => {
    new appreg.Application(stack, 'MyApplication', {
      applicationName: 'testApplication',
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyApplication5C63EC1D: {
          Type: 'AWS::ServiceCatalogAppRegistry::Application',
          Properties: {
            Name: 'testApplication',
          },
        },
      },
    });
  }),

  test('application with explicit description', () => {
    const description = 'my test application description';
    const application = new appreg.Application(stack, 'MyApplication', {
      applicationName: 'testApplication',
      description: description,
    });

    expect(application.applicationManagerUrl).toContain('AWS_AppRegistry_Application-testApplication');
    Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalogAppRegistry::Application', {
      Description: description,
    });
  }),

  test('application with application tags', () => {
    const application = new appreg.Application(stack, 'MyApplication', {
      applicationName: 'testApplication',
    });

    cdk.Tags.of(application).add('key1', 'value1');
    cdk.Tags.of(application).add('key2', 'value2');

    Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalogAppRegistry::Application', {
      Tags: {
        key1: 'value1',
        key2: 'value2',
      },
    });
  }),

  test('for an application imported by ARN', () => {
    const application = appreg.Application.fromApplicationArn(stack, 'MyApplication',
      'arn:aws:servicecatalog:us-east-1:123456789012:/applications/0aqmvxvgmry0ecc4mjhwypun6i');

    expect(application.applicationId).toEqual('0aqmvxvgmry0ecc4mjhwypun6i');
  }),

  test('fails for application imported by ARN missing applicationId', () => {
    expect(() => {
      appreg.Application.fromApplicationArn(stack, 'MyApplication',
        'arn:aws:servicecatalog:us-east-1:123456789012:/applications/');
    }).toThrow(/Missing required Application ID from Application ARN:/);
  }),

  test('application created with a token description does not throw validation error and creates', () => {
    const tokenDescription = new cdk.CfnParameter(stack, 'Description');

    new appreg.Application(stack, 'MyApplication', {
      applicationName: 'myApplication',
      description: tokenDescription.valueAsString,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalogAppRegistry::Application', {
      Description: {
        Ref: 'Description',
      },
    });
  }),

  test('application created with a token application name does not throw validation error', () => {
    const tokenApplicationName= new cdk.CfnParameter(stack, 'ApplicationName');

    new appreg.Application(stack, 'MyApplication', {
      applicationName: tokenApplicationName.valueAsString,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalogAppRegistry::Application', {
      Name: {
        Ref: 'ApplicationName',
      },
    });
  }),

  test('fails for application with description length longer than allowed', () => {
    expect(() => {
      new appreg.Application(stack, 'MyApplication', {
        applicationName: 'testApplication',
        description: 'too long description'.repeat(1000),
      });
    }).toThrow(/Invalid application description for resource/);
  }),

  test('fails for application creation with name too short', () => {
    expect(() => {
      new appreg.Application(stack, 'MyApplication', {
        applicationName: '',
      });
    }).toThrow(/Invalid application name for resource/);
  }),

  test('fails for application with name too long', () => {
    expect(() => {
      new appreg.Application(stack, 'MyApplication', {
        applicationName: 'testApplication'.repeat(50),
      });
    }).toThrow(/Invalid application name for resource/);
  }),

  test('fails for application with name of invalid characters', () => {
    expect(() => {
      new appreg.Application(stack, 'MyApplication', {
        applicationName: 'My@ppl!iC@ #',
      });
    }).toThrow(/Invalid application name for resource/);
  });

  describe('Assocations on applications', () => {
    let application: appreg.Application;

    beforeEach(() => {
      application = new appreg.Application(stack, 'MyApplication', {
        applicationName: 'MyApplication',
      });
    });

    test('associate attribute group', () => {
      const attributeGroup = new appreg.AttributeGroup(stack, 'AttributeGroup', {
        attributeGroupName: 'AttributeGroupName',
        attributes: {},
      });

      application.associateAttributeGroup(attributeGroup);

      Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalogAppRegistry::AttributeGroupAssociation', {
        Application: { 'Fn::GetAtt': ['MyApplication5C63EC1D', 'Id'] },
        AttributeGroup: { 'Fn::GetAtt': ['AttributeGroup409C6335', 'Id'] },
      });
    }),

    test('associate new attribute group', () => {
      application.addAttributeGroup('AttributeGroup', {
        attributeGroupName: 'AttributeGroupName',
        attributes: {},
        description: 'Description for Attribute Group',
      });

      Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalogAppRegistry::AttributeGroupAssociation', {
        Application: { 'Fn::GetAtt': ['MyApplication5C63EC1D', 'Id'] },
        AttributeGroup: { 'Fn::GetAtt': ['MyApplicationAttributeGroup0BD166B6', 'Id'] },
      });

      Template.fromStack(stack).templateMatches({
        Resources: {
          MyApplicationAttributeGroup0BD166B6: {
            Type: 'AWS::ServiceCatalogAppRegistry::AttributeGroup',
            Properties: {
              Name: 'AttributeGroupName',
              Attributes: {},
            },
          },
        },
      });
    }),

    test('duplicate attribute group association are idempotent', () => {
      const attributeGroup = new appreg.AttributeGroup(stack, 'AttributeGroup', {
        attributeGroupName: 'attributeGroupName',
        attributes: { key: 'value' },
      });

      // If these were not idempotent, the second call would produce an error for duplicate construct ID.
      application.associateAttributeGroup(attributeGroup);
      application.associateAttributeGroup(attributeGroup);

      Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalogAppRegistry::AttributeGroupAssociation', 1);
    }),

    test('multiple applications and attribute groups can associate', () => {
      const application2 = new appreg.Application(stack, 'MyApplication2', {
        applicationName: 'MyApplication2',
      });

      const attributeGroup1 = new appreg.AttributeGroup(stack, 'AttributeGroup', {
        attributeGroupName: 'attributeGroupName',
        attributes: { key: 'value' },
      });

      const attributeGroup2 = new appreg.AttributeGroup(stack, 'AttributeGroup2', {
        attributeGroupName: 'attributeGroupName2',
        attributes: { key: 'value' },
      });

      application.associateAttributeGroup(attributeGroup1);
      application.associateAttributeGroup(attributeGroup2);

      application2.associateAttributeGroup(attributeGroup1);
      application2.associateAttributeGroup(attributeGroup2);

      Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalogAppRegistry::AttributeGroupAssociation', 4);
    }),

    test('associate resource', () => {
      const resource = new cdk.Stack(stack, 'MyStack');

      application.associateStack(resource);

      Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalogAppRegistry::ResourceAssociation', {
        Application: { 'Fn::GetAtt': ['MyApplication5C63EC1D', 'Id'] },
        Resource: { 'Fn::ImportValue': 'MyStack:ExportsOutputRefAWSStackIdB2DD5BAA' },
      });
    }),

    test('associate resource on imported application', () => {
      const resource = new cdk.Stack(stack, 'MyStack');

      const importedApplication = appreg.Application.fromApplicationArn(stack, 'ImportedApplication',
        'arn:aws:servicecatalog:us-east-1:123456789012:/applications/0bqmvxvgmry0ecc4mjhwypun6i');

      importedApplication.associateStack(resource);

      Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalogAppRegistry::ResourceAssociation', {
        Application: '0bqmvxvgmry0ecc4mjhwypun6i',
        Resource: { 'Fn::ImportValue': 'MyStack:ExportsOutputRefAWSStackIdB2DD5BAA' },
      });
    }),

    test('duplicate resource assocations are idempotent', () => {
      const resource = new cdk.Stack(stack, 'MyStack');

      // If these were not idempotent, the second call would produce an error for duplicate construct ID.
      application.associateStack(resource);
      application.associateStack(resource);

      Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalogAppRegistry::ResourceAssociation', 1);
    });
  });

  describe('Resource sharing of an application', () => {
    let application: appreg.Application;

    beforeEach(() => {
      application = new appreg.Application(stack, 'MyApplication', {
        applicationName: 'MyApplication',
      });
    });

    test('fails for sharing application without principals', () => {
      expect(() => {
        application.shareApplication('MyShareId', {
          name: 'MyShare',
        });
      }).toThrow(/An entity must be provided for the share/);
    });

    test('share application with an organization', () => {
      application.shareApplication('MyShareId', {
        name: 'MyShare',
        organizationArns: ['arn:aws:organizations::123456789012:organization/o-70oi5564q1'],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::RAM::ResourceShare', {
        AllowExternalPrincipals: false,
        Name: 'MyShare',
        Principals: ['arn:aws:organizations::123456789012:organization/o-70oi5564q1'],
        ResourceArns: [{ 'Fn::GetAtt': ['MyApplication5C63EC1D', 'Arn'] }],
        PermissionArns: ['arn:aws:ram::aws:permission/AWSRAMPermissionServiceCatalogAppRegistryApplicationReadOnly'],
      });
    });

    test('share application with an account', () => {
      application.shareApplication('MyShareId', {
        name: 'MyShare',
        accounts: ['123456789012'],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::RAM::ResourceShare', {
        AllowExternalPrincipals: false,
        Name: 'MyShare',
        Principals: ['123456789012'],
        ResourceArns: [{ 'Fn::GetAtt': ['MyApplication5C63EC1D', 'Arn'] }],
        PermissionArns: ['arn:aws:ram::aws:permission/AWSRAMPermissionServiceCatalogAppRegistryApplicationReadOnly'],
      });
    });

    test('share application with an IAM role', () => {
      const myRole = iam.Role.fromRoleArn(stack, 'MyRole', 'arn:aws:iam::123456789012:role/myRole');

      application.shareApplication('MyShareId', {
        name: 'MyShare',
        roles: [myRole],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::RAM::ResourceShare', {
        AllowExternalPrincipals: false,
        Name: 'MyShare',
        Principals: ['arn:aws:iam::123456789012:role/myRole'],
        ResourceArns: [{ 'Fn::GetAtt': ['MyApplication5C63EC1D', 'Arn'] }],
        PermissionArns: ['arn:aws:ram::aws:permission/AWSRAMPermissionServiceCatalogAppRegistryApplicationReadOnly'],
      });
    });

    test('share application with an IAM user', () => {
      const myUser = iam.User.fromUserArn(stack, 'MyUser', 'arn:aws:iam::123456789012:user/myUser');

      application.shareApplication('MyShareId', {
        name: 'MyShare',
        users: [myUser],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::RAM::ResourceShare', {
        AllowExternalPrincipals: false,
        Name: 'MyShare',
        Principals: ['arn:aws:iam::123456789012:user/myUser'],
        ResourceArns: [{ 'Fn::GetAtt': ['MyApplication5C63EC1D', 'Arn'] }],
        PermissionArns: ['arn:aws:ram::aws:permission/AWSRAMPermissionServiceCatalogAppRegistryApplicationReadOnly'],
      });
    });

    test('share application with organization, give explicit read only access to an application', () => {
      application.shareApplication('MyShareId', {
        name: 'MyShare',
        organizationArns: ['arn:aws:organizations::123456789012:organization/o-70oi5564q1'],
        sharePermission: appreg.SharePermission.READ_ONLY,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::RAM::ResourceShare', {
        AllowExternalPrincipals: false,
        Name: 'MyShare',
        Principals: ['arn:aws:organizations::123456789012:organization/o-70oi5564q1'],
        ResourceArns: [{ 'Fn::GetAtt': ['MyApplication5C63EC1D', 'Arn'] }],
        PermissionArns: ['arn:aws:ram::aws:permission/AWSRAMPermissionServiceCatalogAppRegistryApplicationReadOnly'],
      });
    });

    test('share application with organization, allow access to associate resources and attribute group with an application', () => {
      application.shareApplication('MyShareId', {
        name: 'MyShare',
        organizationArns: ['arn:aws:organizations::123456789012:organization/o-70oi5564q1'],
        sharePermission: appreg.SharePermission.ALLOW_ACCESS,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::RAM::ResourceShare', {
        AllowExternalPrincipals: false,
        Name: 'MyShare',
        Principals: ['arn:aws:organizations::123456789012:organization/o-70oi5564q1'],
        ResourceArns: [{ 'Fn::GetAtt': ['MyApplication5C63EC1D', 'Arn'] }],
        PermissionArns: ['arn:aws:ram::aws:permission/AWSRAMPermissionServiceCatalogAppRegistryApplicationAllowAssociation'],
      });
    });
  });
});

describe('Scope based Associations with Application within Same Account', () => {
  let stack: cdk.Stack;
  let app: cdk.App;
  beforeEach(() => {
    app = new cdk.App({
      context: {
        '@aws-cdk/core:newStyleStackSynthesis': false,
      },
    });
    stack = new cdk.Stack(app, 'cdkApplication');
  });

  test('Associate Stage in same account will associate allStacks Inside it', () => {
    const application = new appreg.Application(stack, 'MyApplication', {
      applicationName: 'MyApplication',
    });
    const stage = new cdk.Stage(stack, 'MyStage');
    const stageStack = new cdk.Stack(stage, 'MyStack');
    application.associateAllStacksInScope(stage);
    expect(stageStack.stackName).toEqual('MyStage-MyStack');
    Template.fromStack(stageStack).hasResourceProperties('AWS::ServiceCatalogAppRegistry::ResourceAssociation', {
      Application: 'MyApplication',
      Resource: { Ref: 'AWS::StackId' },
    });
  });


  test('Associate Stack in same account will associate allStacks Inside it', () => {
    const application = new appreg.Application(stack, 'MyApplication', {
      applicationName: 'MyApplication',
    });

    const anotherStack = new AppRegistrySampleStack(app, 'SampleStack');
    application.associateAllStacksInScope(app);
    Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalogAppRegistry::ResourceAssociation', 1);
    Template.fromStack(anotherStack).resourceCountIs('AWS::ServiceCatalogAppRegistry::ResourceAssociation', 1);
    Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalogAppRegistry::ResourceAssociation', {
      Application: { 'Fn::GetAtt': ['MyApplication5C63EC1D', 'Id'] },
      Resource: { Ref: 'AWS::StackId' },
    });
    Template.fromStack(anotherStack).hasResourceProperties('AWS::ServiceCatalogAppRegistry::ResourceAssociation', {
      Application: 'MyApplication',
      Resource: { Ref: 'AWS::StackId' },
    });
  });
});

describe('Scope based Associations with Application with Cross Region/Account', () => {
  let stack: cdk.Stack;
  let app: cdk.App;
  beforeEach(() => {
    app = new cdk.App({
      context: {
        '@aws-cdk/core:newStyleStackSynthesis': false,
      },
    });
    stack = new cdk.Stack(app, 'CdkApplication', {
      env: { account: 'account', region: 'region' },
    });
  });

  test('associateAllStacksInScope in cross-account associates all stacks from the context passed', () => {
    const application = new appreg.Application(stack, 'MyApplication', {
      applicationName: 'MyApplication',
    });
    const firstStack = new cdk.Stack(app, 'testStack', {
      env: { account: 'account2', region: 'region' },
    });
    const nestedStack = new cdk.Stack(firstStack, 'MyFirstStack', {
      env: { account: 'account2', region: 'region' },
    });
    application.associateAllStacksInScope(app);
    Template.fromStack(stack).resourceCountIs('AWS::ServiceCatalogAppRegistry::ResourceAssociation', 1);
    Template.fromStack(firstStack).resourceCountIs('AWS::ServiceCatalogAppRegistry::ResourceAssociation', 1);
    Template.fromStack(nestedStack).resourceCountIs('AWS::ServiceCatalogAppRegistry::ResourceAssociation', 1);
  });

  test('Associate Stage in cross account association will associate allStacks Inside it', () => {
    const application = new appreg.Application(stack, 'MyApplication', {
      applicationName: 'MyApplication',
    });
    const stage = new cdk.Stage(app, 'MyStage', {
      env: { account: 'account2', region: 'region' },
    });
    const stageStack = new cdk.Stack(stage, 'MyStack');
    application.associateAllStacksInScope(stage);
    Template.fromStack(stageStack).resourceCountIs('AWS::ServiceCatalogAppRegistry::ResourceAssociation', 1);
    Template.fromStack(stageStack).hasResourceProperties('AWS::ServiceCatalogAppRegistry::ResourceAssociation', {
      Application: 'MyApplication',
      Resource: { Ref: 'AWS::StackId' },
    });
  });

  test('Associate Stage in cross region throw error', () => {
    const application = new appreg.Application(stack, 'MyApplication', {
      applicationName: 'MyApplication',
    });
    const stage = new cdk.Stage(stack, 'MyStage', {
      env: { account: 'account1', region: 'region1' },
    });
    const stageStack = new cdk.Stack(stage, 'MyStack');
    application.associateAllStacksInScope(stage);
    Annotations.fromStack(stageStack).hasWarning('*',
      'AppRegistry does not support cross region associations, deployment might fail if there is cross region stacks in the app.'
          + ' Application region region, stack region region1');
  });
});

describe('Conditional nested stack Associations with Application within Same Account', () => {
  let app: cdk.App;
  beforeEach(() => {
    app = new cdk.App({
      context: {
        '@aws-cdk/core:newStyleStackSynthesis': false,
      },
    });
  });

  test('Associate conditional nested stack with application', () => {
    const stack = new MainStack(app, 'cdkApplication');
    const application = new appreg.Application(stack, 'MyApplication', {
      applicationName: 'MyApplication',
    });
    application.associateApplicationWithStack(stack);
    application.associateApplicationWithStack(stack.nestedStack);
    Template.fromStack(stack.nestedStack).hasResource('AWS::ServiceCatalogAppRegistry::ResourceAssociation', {
      Properties: {
        Application: 'MyApplication',
        Resource: { Ref: 'AWS::StackId' },
        ResourceType: 'CFN_STACK',
      },
    });
    Template.fromStack(stack.nestedStack).hasCondition('ShouldCreateStackCondition', {
      'Fn::Equals': ['us-east-1'],
    });
  });

});


class AppRegistrySampleStack extends cdk.Stack {
  public constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
  }
}

class MainStack extends cdk.Stack {
  public readonly nestedStack: cdk.Stack;
  public constructor(parent: cdk.App, id: string, props?: cdk.StackProps) {
    super(parent, id, props);
    this.nestedStack = new AppRegistryNestedStack(this, 'nested-stack');
  }
}

class AppRegistryNestedStack extends cdk.NestedStack {
  public constructor(scope: Construct, id: string, props?: cdk.NestedStackProps) {
    super(scope, id, props);

    const shouldCreateStack = new cdk.CfnCondition(this, 'ShouldCreateStackCondition', {
      expression: cdk.Fn.conditionEquals(process.env.CDK_DEFAULT_REGION, 'us-east-1'),
    });
    (this.nestedStackResource as cdk.CfnStack).cfnOptions.condition = shouldCreateStack;
  }
}
