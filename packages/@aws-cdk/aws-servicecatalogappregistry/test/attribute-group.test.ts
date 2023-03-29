import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as appreg from '../lib';

describe('Attribute Group', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    const app = new cdk.App({
      context: {
        '@aws-cdk/core:newStyleStackSynthesis': false,
      },
    });
    stack = new cdk.Stack(app);
  });

  test('default attribute group creation', () => {
    new appreg.AttributeGroup(stack, 'MyAttributeGroup', {
      attributeGroupName: 'testAttributeGroup',
      attributes: {
        key: 'value',
      },
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyAttributeGroup99099500: {
          Type: 'AWS::ServiceCatalogAppRegistry::AttributeGroup',
          Properties: {
            Name: 'testAttributeGroup',
            Attributes: {
              key: 'value',
            },
          },
        },
      },
    });
  }),

  test('attribute group with explicit description', () => {
    const description = 'my test attribute group description';
    new appreg.AttributeGroup(stack, 'MyAttributeGroup', {
      attributeGroupName: 'testAttributeGroup',
      attributes: {
        key: 'value',
      },
      description: description,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalogAppRegistry::AttributeGroup', {
      Description: description,
    });
  }),

  test('Attribute group with tags', () => {
    const attributeGroup = new appreg.AttributeGroup(stack, 'MyAttributeGroup', {
      attributeGroupName: 'testAttributeGroup',
      attributes: {
        key: 'value',
      },
    });

    cdk.Tags.of(attributeGroup).add('key1', 'value1');
    cdk.Tags.of(attributeGroup).add('key2', 'value2');

    Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalogAppRegistry::AttributeGroup', {
      Tags: {
        key1: 'value1',
        key2: 'value2',
      },
    });
  }),

  test('for an attribute group imported by ARN', () => {
    const attributeGroup = appreg.AttributeGroup.fromAttributeGroupArn(stack, 'MyAttributeGroup',
      'arn:aws:servicecatalog:us-east-1:123456789012:/attribute-groups/0aqmvxvgmry0ecc4mjhwypun6i');
    expect(attributeGroup.attributeGroupId).toEqual('0aqmvxvgmry0ecc4mjhwypun6i');
  }),

  test('fails for attribute group imported by ARN missing attributeGroupId', () => {
    expect(() => {
      appreg.AttributeGroup.fromAttributeGroupArn(stack, 'MyAttributeGroup',
        'arn:aws:servicecatalog:us-east-1:123456789012:/attribute-groups/');
    }).toThrow(/Missing required Attribute Group ID from Attribute Group ARN:/);
  }),

  test('attribute group created with a token description does not throw validation error and creates', () => {
    const tokenDescription = new cdk.CfnParameter(stack, 'Description');

    new appreg.AttributeGroup(stack, 'MyAttributeGroup', {
      attributeGroupName: 'testAttributeGroup',
      attributes: {
        key: 'value',
      },
      description: tokenDescription.valueAsString,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalogAppRegistry::AttributeGroup', {
      Description: {
        Ref: 'Description',
      },
    });
  }),

  test('attribute group created with a token attribute group name does not throw validation error', () => {
    const tokenAttributeGroupName = new cdk.CfnParameter(stack, 'AttributeGroupName');

    new appreg.AttributeGroup(stack, 'MyAttributeGroup', {
      attributeGroupName: tokenAttributeGroupName.valueAsString,
      attributes: {
        key: 'value',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalogAppRegistry::AttributeGroup', {
      Name: {
        Ref: 'AttributeGroupName',
      },
    });
  }),

  test('fails for attribute group with description length longer than allowed', () => {
    expect(() => {
      new appreg.AttributeGroup(stack, 'MyAttributeGroup', {
        attributeGroupName: 'testAttributeGroup',
        attributes: {
          key: 'value',
        },
        description: 'too long attribute description'.repeat(1000),
      });
    }).toThrow(/Invalid attribute group description for resource/);
  }),

  test('fails for attribute group creation with name too short', () => {
    expect(() => {
      new appreg.AttributeGroup(stack, 'MyAttributeGroup', {
        attributeGroupName: '',
        attributes: {
          key: 'value',
        },
      });
    }).toThrow(/Invalid attribute group name for resource/);
  }),

  test('fails for attribute group with name too long', () => {
    expect(() => {
      new appreg.AttributeGroup(stack, 'MyAttributeGroup', {
        attributeGroupName: 'testAttributeNameTooLong'.repeat(50),
        attributes: {
          key: 'value',
        },
      });
    }).toThrow(/Invalid attribute group name for resource/);
  }),

  test('fails for attribute group name with name of invalid characters', () => {
    expect(() => {
      new appreg.AttributeGroup(stack, 'MyAttributeGroup', {
        attributeGroupName: '@ttR!8Ut3 Gr0uP',
        attributes: {
          key: 'value',
        },
      });
    }).toThrow(/Invalid attribute group name for resource/);
  });

  test('attribute group created with empty attributes', () => {
    new appreg.AttributeGroup(stack, 'MyAttributeGroup', {
      attributeGroupName: 'testAttributeGroup',
      attributes: {},
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalogAppRegistry::AttributeGroup', {
      Attributes: {},
    });
  });

  describe('Associate application to an attribute group', () => {
    let attributeGroup: appreg.AttributeGroup;

    beforeEach(() => {
      attributeGroup = new appreg.AttributeGroup(stack, 'MyAttributeGroupForAssociation', {
        attributeGroupName: 'MyAttributeGroupForAssociation',
        attributes: {},
      });
    });

    test('Associate an application to an attribute group', () => {
      const application = new appreg.Application(stack, 'MyApplication', {
        applicationName: 'MyTestApplication',
      });
      attributeGroup.associateWith(application);
      Template.fromStack(stack).hasResourceProperties('AWS::ServiceCatalogAppRegistry::AttributeGroupAssociation', {
        Application: { 'Fn::GetAtt': ['MyApplication5C63EC1D', 'Id'] },
        AttributeGroup: { 'Fn::GetAtt': ['MyAttributeGroupForAssociation6B3E1329', 'Id'] },
      });

    });

  });

  describe('Resource sharing of an attribute group', () => {
    let attributeGroup: appreg.AttributeGroup;

    beforeEach(() => {
      attributeGroup = new appreg.AttributeGroup(stack, 'MyAttributeGroup', {
        attributeGroupName: 'MyAttributeGroup',
        attributes: {},
      });
    });

    test('fails for sharing attribute group without principals', () => {
      expect(() => {
        attributeGroup.shareAttributeGroup('MyShareId', {
          name: 'MyShare',
        });
      }).toThrow(/An entity must be provided for the share/);
    });

    test('share attribute group with an organization', () => {
      attributeGroup.shareAttributeGroup('MyShareId', {
        name: 'MyShare',
        organizationArns: ['arn:aws:organizations::123456789012:organization/o-70oi5564q1'],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::RAM::ResourceShare', {
        AllowExternalPrincipals: false,
        Name: 'MyShare',
        Principals: ['arn:aws:organizations::123456789012:organization/o-70oi5564q1'],
        ResourceArns: [{ 'Fn::GetAtt': ['MyAttributeGroup99099500', 'Arn'] }],
        PermissionArns: ['arn:aws:ram::aws:permission/AWSRAMPermissionServiceCatalogAppRegistryAttributeGroupReadOnly'],
      });
    });

    test('share attribute group with an account', () => {
      attributeGroup.shareAttributeGroup('MyShareId', {
        name: 'MyShare',
        accounts: ['123456789012'],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::RAM::ResourceShare', {
        AllowExternalPrincipals: false,
        Name: 'MyShare',
        Principals: ['123456789012'],
        ResourceArns: [{ 'Fn::GetAtt': ['MyAttributeGroup99099500', 'Arn'] }],
        PermissionArns: ['arn:aws:ram::aws:permission/AWSRAMPermissionServiceCatalogAppRegistryAttributeGroupReadOnly'],
      });
    });

    test('share attribute group with an IAM role', () => {
      const myRole = iam.Role.fromRoleArn(stack, 'MyRole', 'arn:aws:iam::123456789012:role/myRole');

      attributeGroup.shareAttributeGroup('MyShareId', {
        name: 'MyShare',
        roles: [myRole],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::RAM::ResourceShare', {
        AllowExternalPrincipals: false,
        Name: 'MyShare',
        Principals: ['arn:aws:iam::123456789012:role/myRole'],
        ResourceArns: [{ 'Fn::GetAtt': ['MyAttributeGroup99099500', 'Arn'] }],
        PermissionArns: ['arn:aws:ram::aws:permission/AWSRAMPermissionServiceCatalogAppRegistryAttributeGroupReadOnly'],
      });
    });

    test('share attribute group with an IAM user', () => {
      const myUser = iam.User.fromUserArn(stack, 'MyUser', 'arn:aws:iam::123456789012:user/myUser');

      attributeGroup.shareAttributeGroup('MyShareId', {
        name: 'MyShare',
        users: [myUser],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::RAM::ResourceShare', {
        AllowExternalPrincipals: false,
        Name: 'MyShare',
        Principals: ['arn:aws:iam::123456789012:user/myUser'],
        ResourceArns: [{ 'Fn::GetAtt': ['MyAttributeGroup99099500', 'Arn'] }],
        PermissionArns: ['arn:aws:ram::aws:permission/AWSRAMPermissionServiceCatalogAppRegistryAttributeGroupReadOnly'],
      });
    });

    test('share attribute group with organization, give explicit read only access to the attribute group', () => {
      attributeGroup.shareAttributeGroup('MyShareId', {
        name: 'MyShare',
        organizationArns: ['arn:aws:organizations::123456789012:organization/o-70oi5564q1'],
        sharePermission: appreg.SharePermission.READ_ONLY,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::RAM::ResourceShare', {
        AllowExternalPrincipals: false,
        Name: 'MyShare',
        Principals: ['arn:aws:organizations::123456789012:organization/o-70oi5564q1'],
        ResourceArns: [{ 'Fn::GetAtt': ['MyAttributeGroup99099500', 'Arn'] }],
        PermissionArns: ['arn:aws:ram::aws:permission/AWSRAMPermissionServiceCatalogAppRegistryAttributeGroupReadOnly'],
      });
    });

    test('share attribute group with organization, give access to mutate attribute groups', () => {
      attributeGroup.shareAttributeGroup('MyShareId', {
        name: 'MyShare',
        organizationArns: ['arn:aws:organizations::123456789012:organization/o-70oi5564q1'],
        sharePermission: appreg.SharePermission.ALLOW_ACCESS,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::RAM::ResourceShare', {
        AllowExternalPrincipals: false,
        Name: 'MyShare',
        Principals: ['arn:aws:organizations::123456789012:organization/o-70oi5564q1'],
        ResourceArns: [{ 'Fn::GetAtt': ['MyAttributeGroup99099500', 'Arn'] }],
        PermissionArns: ['arn:aws:ram::aws:permission/AWSRAMPermissionServiceCatalogAppRegistryAttributeGroupAllowAssociation'],
      });
    });
  });
});
