import type { Service, SpecDatabase } from '@aws-cdk/service-spec-types';
import { emptyDatabase } from '@aws-cdk/service-spec-types';
import { TypeScriptRenderer } from '@cdklabs/typewriter';
import { AwsCdkLibBuilder } from '../lib/cdk/aws-cdk-lib';

const renderer = new TypeScriptRenderer();
let db: SpecDatabase;
let service: Service;

beforeEach(() => {
  db = emptyDatabase();

  service = db.allocate('service', {
    name: 'aws-iam',
    shortName: 'iam',
    capitalized: 'IAM',
    cloudFormationNamespace: 'AWS::IAM',
  });
});

test('resource with relationship reference', () => {
  // Target resource
  const targetResource = db.allocate('resource', {
    name: 'Role',
    attributes: {
      RoleArn: {
        type: { type: 'string' },
      },
    },
    properties: {},
    cloudFormationType: 'AWS::IAM::Role',
  });
  db.link('hasResource', service, targetResource);

  // Source resource with relationship
  const sourceResource = db.allocate('resource', {
    name: 'Function',
    attributes: {},
    properties: {
      RoleArn: {
        type: { type: 'string' },
        relationshipRefs: [{
          cloudFormationType: 'AWS::IAM::Role',
          propertyName: 'RoleArn',
        }],
      },
    },
    cloudFormationType: 'AWS::IAM::Function',
  });
  db.link('hasResource', service, sourceResource);

  const module = new AwsCdkLibBuilder({ db }).addService(service).resourcesMod.module;

  const rendered = renderer.render(module);

  expect(rendered).toMatchSnapshot();
});

test('resource with multiple relationship references', () => {
  // Target resource 1
  const roleResource = db.allocate('resource', {
    name: 'Role',
    attributes: {
      RoleArn: {
        type: { type: 'string' },
      },
    },
    properties: {},
    cloudFormationType: 'AWS::IAM::Role',
  });
  db.link('hasResource', service, roleResource);

  // Target resource 2
  const userResource = db.allocate('resource', {
    name: 'User',
    attributes: {
      UserArn: {
        type: { type: 'string' },
      },
    },
    properties: {},
    cloudFormationType: 'AWS::IAM::User',
  });
  db.link('hasResource', service, userResource);

  // Source resource with multiple relationships
  const policyResource = db.allocate('resource', {
    name: 'Policy',
    attributes: {},
    properties: {
      PrincipalArn: {
        type: { type: 'string' },
        relationshipRefs: [
          {
            cloudFormationType: 'AWS::IAM::Role',
            propertyName: 'RoleArn',
          },
          {
            cloudFormationType: 'AWS::IAM::User',
            propertyName: 'UserArn',
          },
        ],
      },
    },
    cloudFormationType: 'AWS::IAM::Policy',
  });
  db.link('hasResource', service, policyResource);

  const module = new AwsCdkLibBuilder({ db }).addService(service).resourcesMod.module;

  const rendered = renderer.render(module);

  expect(rendered).toMatchSnapshot();
});

test('resource with nested relationship requiring flattening', () => {
  // Target resource
  const roleResource = db.allocate('resource', {
    name: 'Role',
    attributes: {
      RoleArn: {
        type: { type: 'string' },
      },
    },
    properties: {},
    cloudFormationType: 'AWS::IAM::Role',
  });
  db.link('hasResource', service, roleResource);

  // Type definition with relationship
  const configType = db.allocate('typeDefinition', {
    name: 'ExecutionConfig',
    properties: {
      RoleArn: {
        type: { type: 'string' },
        relationshipRefs: [{
          cloudFormationType: 'AWS::IAM::Role',
          propertyName: 'RoleArn',
        }],
      },
    },
  });

  // Source resource with nested property
  const taskResource = db.allocate('resource', {
    name: 'Task',
    attributes: {},
    properties: {
      ExecutionConfig: {
        type: { type: 'ref', reference: { $ref: configType.$id } },
      },
    },
    cloudFormationType: 'AWS::IAM::Task',
  });
  db.link('hasResource', service, taskResource);
  db.link('usesType', taskResource, configType);

  const module = new AwsCdkLibBuilder({ db }).addService(service).resourcesMod.module;

  const rendered = renderer.render(module);

  expect(rendered).toMatchSnapshot();
});

test('resource with array of nested properties with relationship', () => {
  // Target resource
  const roleResource = db.allocate('resource', {
    name: 'Role',
    attributes: {
      RoleArn: {
        type: { type: 'string' },
      },
    },
    properties: {},
    cloudFormationType: 'AWS::IAM::Role',
  });
  db.link('hasResource', service, roleResource);

  // Type definition with relationship
  const permissionType = db.allocate('typeDefinition', {
    name: 'Permission',
    properties: {
      RoleArn: {
        type: { type: 'string' },
        relationshipRefs: [{
          cloudFormationType: 'AWS::IAM::Role',
          propertyName: 'RoleArn',
        }],
      },
    },
  });

  // Source resource with array of nested properties
  const resourceResource = db.allocate('resource', {
    name: 'Resource',
    attributes: {},
    properties: {
      Permissions: {
        type: { type: 'array', element: { type: 'ref', reference: { $ref: permissionType.$id } } },
      },
    },
    cloudFormationType: 'AWS::IAM::Resource',
  });
  db.link('hasResource', service, resourceResource);
  db.link('usesType', resourceResource, permissionType);

  const module = new AwsCdkLibBuilder({ db }).addService(service).resourcesMod.module;

  const rendered = renderer.render(module);

  expect(rendered).toMatchSnapshot();
});

test('resource with nested relationship with type history', () => {
  // Target resource
  const roleResource = db.allocate('resource', {
    name: 'Role',
    attributes: {
      RoleArn: {
        type: { type: 'string' },
      },
    },
    properties: {},
    cloudFormationType: 'AWS::IAM::Role',
  });
  db.link('hasResource', service, roleResource);

  // Old type definition
  const oldConfigType = db.allocate('typeDefinition', {
    name: 'OldConfig',
    properties: {
      RoleArn: {
        type: { type: 'string' },
        relationshipRefs: [{
          cloudFormationType: 'AWS::IAM::Role',
          propertyName: 'RoleArn',
        }],
      },
    },
  });

  // New type definition
  const configType = db.allocate('typeDefinition', {
    name: 'Config',
    properties: {
      RoleArn: {
        type: { type: 'string' },
        relationshipRefs: [{
          cloudFormationType: 'AWS::IAM::Role',
          propertyName: 'RoleArn',
        }],
      },
      Timeout: {
        type: { type: 'integer' },
      },
    },
  });

  // Source resource
  const jobResource = db.allocate('resource', {
    name: 'Job',
    attributes: {},
    properties: {
      Config: {
        type: { type: 'ref', reference: { $ref: configType.$id } },
        previousTypes: [{ type: 'ref', reference: { $ref: oldConfigType.$id } }],
      },
    },
    cloudFormationType: 'AWS::IAM::Job',
  });
  db.link('hasResource', service, jobResource);
  db.link('usesType', jobResource, configType);
  db.link('usesType', jobResource, oldConfigType);

  const module = new AwsCdkLibBuilder({ db }).addService(service).resourcesMod.module;

  const rendered = renderer.render(module);

  expect(rendered).toMatchSnapshot();
});

test('relationship have arns appear first in the constructor chain', () => {
  // Target resource
  const roleResource = db.allocate('resource', {
    name: 'Role',
    primaryIdentifier: ['RoleName', 'OtherPrimaryId'],
    attributes: {
      RoleArn: {
        type: { type: 'string' },
      },
    },
    properties: {},
    cloudFormationType: 'AWS::IAM::Role',
  });
  db.link('hasResource', service, roleResource);

  // Source resource with relationship
  const sourceResource = db.allocate('resource', {
    name: 'Function',
    attributes: {},
    properties: {
      RoleArn: {
        type: { type: 'string' },
        relationshipRefs: [{
          cloudFormationType: 'AWS::IAM::Role',
          propertyName: 'RoleName',
        }, {
          cloudFormationType: 'AWS::IAM::Role',
          propertyName: 'RoleArn',
        }, {
          cloudFormationType: 'AWS::IAM::Role',
          propertyName: 'OtherPrimaryId',
        }],
      },
    },
    cloudFormationType: 'AWS::IAM::Function',
  });

  db.link('hasResource', service, sourceResource);

  const module = new AwsCdkLibBuilder({ db }).addService(service).resourcesMod.module;

  const rendered = renderer.render(module);

  const chain = 'this.roleArn = (props.roleArn as iamRefs.IRoleRef)?.roleRef?.roleArn ?? (props.roleArn as iamRefs.IRoleRef)?.roleRef?.roleName ?? (props.roleArn as iamRefs.IRoleRef)?.roleRef?.otherPrimaryId ?? cdk.ensureStringOrUndefined(props.roleArn, "roleArn", "iam.IRoleRef | string")';
  expect(rendered).toContain(chain);
});
