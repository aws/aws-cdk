import fs from 'fs';
import path from 'path';
import { Construct } from 'constructs';
import { Annotations, Match, Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as lambda from '../../aws-lambda';
import * as s3 from '../../aws-s3';
import * as s3_assets from '../../aws-s3-assets';
import {
  Annotations as CoreAnnotations,
  App,
  CfnCapabilities,
  CfnOutput,
  CfnParameter,
  DefaultStackSynthesizer,
  LegacyStackSynthesizer,
  RemovalPolicy,
  Stack,
  Stage,
  Tags,
  Validations,
} from '../../core';
import type { StackSynthesizer } from '../../core';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from '../../custom-resources';
import * as cxapi from '../../cx-api';
import type { StackSetProps } from '../lib';
import {
  DeploymentType,
  NestedStack,
  RegionConcurrencyType,
  StackSet,
  StackSetTarget,
  StackSetTemplate,
} from '../lib';

class LambdaStackSet extends StackSet {
  constructor(scope: Construct, id: string, props?: StackSetProps) {
    super(scope, id, props);

    new lambda.Function(this, 'Lambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
    });

    new lambda.Function(this, 'Lambda2', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
    });
  }
}

/**
 * A StackSet is not a cloud assembly artifact, so read its template file from the assembly
 */
function stackSetTemplateOf(stackSet: StackSet): Template {
  const assembly = Stage.of(stackSet)!.synth();
  return Template.fromJSON(JSON.parse(fs.readFileSync(path.join(assembly.directory, stackSet.templateFile), 'utf-8')));
}

/**
 * The hashes of the template assets of a StackSet in the asset manifest of its host stack
 */
function templateAssetHashes(app: App, hostStack: Stack, stackSet: StackSet): string[] {
  const manifest = JSON.parse(fs.readFileSync(path.join(app.synth().directory, `${hostStack.artifactId}.assets.json`), 'utf-8'));
  return Object.entries(manifest.files)
    .filter(([, file]: [string, any]) => file.source.path === stackSet.templateFile)
    .map(([hash]) => hash);
}

test('default', () => {
  const app = new App();
  const stack = new Stack(app);

  new StackSet(stack, 'StackSet', {
    target: StackSetTarget.fromAccounts({
      regions: ['us-east-1'],
      accounts: ['11111111111'],
      parameterOverrides: {
        Param1: 'Value1',
      },
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
    ManagedExecution: { Active: true },
    PermissionModel: 'SELF_MANAGED',
    TemplateURL: {
      'Fn::Sub': 'https://s3.${AWS::Region}.${AWS::URLSuffix}/cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}/44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a.json',
    },
    StackInstancesGroup: [{
      Regions: ['us-east-1'],
      DeploymentTargets: {
        Accounts: ['11111111111'],
      },
    }],
  });
});

test('stackset with parameters', () => {
  const app = new App();
  const stack = new Stack(app);

  new StackSet(stack, 'StackSet', {
    target: StackSetTarget.fromAccounts({
      regions: ['us-east-1'],
      accounts: ['11111111111'],
    }),
    parameters: {
      Param1: 'Value1',
      Param2: 'Value2',
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
    ManagedExecution: { Active: true },
    PermissionModel: 'SELF_MANAGED',
    Parameters: [{
      ParameterKey: 'Param1',
      ParameterValue: 'Value1',
    }, {
      ParameterKey: 'Param2',
      ParameterValue: 'Value2',
    }],
    StackInstancesGroup: [{
      Regions: ['us-east-1'],
      DeploymentTargets: {
        Accounts: ['11111111111'],
      },
    }],
  });
});

test('self managed stackset creates adminRole by default', () => {
  const app = new App();
  const stack = new Stack(app);

  new StackSet(stack, 'StackSet', {
    target: StackSetTarget.fromAccounts({
      regions: ['us-east-1'],
      accounts: ['11111111111'],
      parameterOverrides: {
        Param1: 'Value1',
      },
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
    ManagedExecution: { Active: true },
    PermissionModel: 'SELF_MANAGED',
    AdministrationRoleARN: { 'Fn::GetAtt': ['StackSetAdminRole60BC89F6', 'Arn'] },
    TemplateURL: {
      'Fn::Sub': 'https://s3.${AWS::Region}.${AWS::URLSuffix}/cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}/44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a.json',
    },
    StackInstancesGroup: [{
      Regions: ['us-east-1'],
      DeploymentTargets: {
        Accounts: ['11111111111'],
      },
    }],
  });
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Effect: 'Allow',
          Principal: { Service: 'cloudformation.amazonaws.com' },
          Action: 'sts:AssumeRole',
        },
      ],
    },
  });
});

test('self managed stackset with disabled regions', () => {
  const app = new App();
  const stack = new Stack(app);

  new StackSet(stack, 'StackSet', {
    target: StackSetTarget.fromAccounts({
      regions: ['us-east-1', 'af-south-1'],
      accounts: ['11111111111'],
      parameterOverrides: {
        Param1: 'Value1',
      },
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
    ManagedExecution: { Active: true },
    PermissionModel: 'SELF_MANAGED',
    AdministrationRoleARN: { 'Fn::GetAtt': ['StackSetAdminRole60BC89F6', 'Arn'] },
    TemplateURL: {
      'Fn::Sub': 'https://s3.${AWS::Region}.${AWS::URLSuffix}/cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}/44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a.json',
    },
    StackInstancesGroup: [{
      Regions: ['us-east-1', 'af-south-1'],
      DeploymentTargets: {
        Accounts: ['11111111111'],
      },
    }],
  });
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Effect: 'Allow',
          Principal: { Service: 'cloudformation.amazonaws.com' },
          Action: 'sts:AssumeRole',
        },
        {
          Effect: 'Allow',
          Principal: { Service: 'cloudformation.af-south-1.amazonaws.com' },
          Action: 'sts:AssumeRole',
        },
      ],
    },
  });
});

test('service managed stackset', () => {
  const app = new App();
  const stack = new Stack(app);

  new StackSet(stack, 'StackSet', {
    target: StackSetTarget.fromAccounts({
      regions: ['us-east-1'],
      accounts: ['11111111111'],
      parameterOverrides: {
        Param1: 'Value1',
      },
    }),
    deploymentType: DeploymentType.serviceManaged(),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
    ManagedExecution: { Active: true },
    PermissionModel: 'SERVICE_MANAGED',
    CallAs: 'DELEGATED_ADMIN',
    AutoDeployment: {
      Enabled: true,
      RetainStacksOnAccountRemoval: true,
    },
    TemplateURL: {
      'Fn::Sub': 'https://s3.${AWS::Region}.${AWS::URLSuffix}/cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}/44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a.json',
    },
    StackInstancesGroup: [{
      ParameterOverrides: [{
        ParameterKey: 'Param1',
        ParameterValue: 'Value1',
      }],
      Regions: ['us-east-1'],
      DeploymentTargets: {
        Accounts: ['11111111111'],
        AccountFilterType: 'INTERSECTION',
      },
    }],
  });
});

test('service managed stackset with options', () => {
  const app = new App();
  const stack = new Stack(app);

  new StackSet(stack, 'StackSet', {
    target: StackSetTarget.fromAccounts({
      regions: ['us-east-1'],
      accounts: ['11111111111'],
      parameterOverrides: {
        Param1: 'Value1',
      },
    }),
    deploymentType: DeploymentType.serviceManaged({
      delegatedAdmin: false,
      autoDeployEnabled: false,
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
    ManagedExecution: { Active: true },
    PermissionModel: 'SERVICE_MANAGED',
    CallAs: 'SELF',
    AutoDeployment: {
      Enabled: false,
    },
    TemplateURL: {
      'Fn::Sub': 'https://s3.${AWS::Region}.${AWS::URLSuffix}/cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}/44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a.json',
    },
    StackInstancesGroup: [{
      Regions: ['us-east-1'],
      DeploymentTargets: {
        Accounts: ['11111111111'],
        AccountFilterType: 'INTERSECTION',
      },
    }],
  });
});

test('service managed stackset throws error if autoDeployRetainStacks is provided and autoDeploy is disabled', () => {
  const app = new App();
  const stack = new Stack(app);

  expect(() => {
    new StackSet(stack, 'StackSet', {
      target: StackSetTarget.fromAccounts({
        regions: ['us-east-1'],
        accounts: ['11111111111'],
        parameterOverrides: {
          Param1: 'Value1',
        },
      }),
      deploymentType: DeploymentType.serviceManaged({
        delegatedAdmin: false,
        autoDeployEnabled: false,
        autoDeployRetainStacks: true,
      }),
    });
  }).toThrow(/autoDeployRetainStacks only applies if autoDeploy is enabled/);
});

test('fromOrganizations default', () => {
  const app = new App();
  const stack = new Stack(app);

  new StackSet(stack, 'StackSet', {
    target: StackSetTarget.fromOrganizationalUnits({
      regions: ['us-east-1'],
      organizationalUnits: ['ou-1111111'],
      parameterOverrides: {
        Param1: 'Value1',
      },
    }),
    deploymentType: DeploymentType.serviceManaged({
      delegatedAdmin: false,
      autoDeployEnabled: false,
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
    ManagedExecution: { Active: true },
    PermissionModel: 'SERVICE_MANAGED',
    CallAs: 'SELF',
    AutoDeployment: {
      Enabled: false,
    },
    TemplateURL: {
      'Fn::Sub': 'https://s3.${AWS::Region}.${AWS::URLSuffix}/cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}/44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a.json',
    },
    StackInstancesGroup: [{
      Regions: ['us-east-1'],
      DeploymentTargets: {
        AccountFilterType: 'NONE',
      },
    }],
  });
});

test('fromOrganizations with intersectionAccounts', () => {
  const app = new App();
  const stack = new Stack(app);

  new StackSet(stack, 'StackSet', {
    target: StackSetTarget.fromOrganizationalUnits({
      regions: ['us-east-1'],
      organizationalUnits: ['ou-1111111'],
      intersectionAccounts: ['222222222222', '333333333333'],
    }),
    deploymentType: DeploymentType.serviceManaged({
      delegatedAdmin: false,
      autoDeployEnabled: false,
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
    StackInstancesGroup: [{
      Regions: ['us-east-1'],
      DeploymentTargets: {
        AccountFilterType: 'INTERSECTION',
        OrganizationalUnitIds: ['ou-1111111'],
        Accounts: ['222222222222', '333333333333'],
      },
    }],
  });
});

test('fromOrganizations with additionalAccounts', () => {
  const app = new App();
  const stack = new Stack(app);

  new StackSet(stack, 'StackSet', {
    target: StackSetTarget.fromOrganizationalUnits({
      regions: ['us-east-1'],
      organizationalUnits: ['ou-1111111'],
      additionalAccounts: ['222222222222', '333333333333'],
    }),
    deploymentType: DeploymentType.serviceManaged({
      delegatedAdmin: false,
      autoDeployEnabled: false,
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
    StackInstancesGroup: [{
      Regions: ['us-east-1'],
      DeploymentTargets: {
        AccountFilterType: 'UNION',
        OrganizationalUnitIds: ['ou-1111111'],
        Accounts: ['222222222222', '333333333333'],
      },
    }],
  });
});

test('fromOrganizations with excludeAccounts', () => {
  const app = new App();
  const stack = new Stack(app);

  new StackSet(stack, 'StackSet', {
    target: StackSetTarget.fromOrganizationalUnits({
      regions: ['us-east-1'],
      organizationalUnits: ['ou-1111111'],
      excludeAccounts: ['222222222222', '333333333333'],
    }),
    deploymentType: DeploymentType.serviceManaged({
      delegatedAdmin: false,
      autoDeployEnabled: false,
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
    StackInstancesGroup: [{
      Regions: ['us-east-1'],
      DeploymentTargets: {
        AccountFilterType: 'DIFFERENCE',
        OrganizationalUnitIds: ['ou-1111111'],
        Accounts: ['222222222222', '333333333333'],
      },
    }],
  });
});

test('fromOrganizations throws when intersectionAccounts and excludeAccounts are both specified', () => {
  const app = new App();
  const stack = new Stack(app);

  expect(() => {
    new StackSet(stack, 'StackSet', {
      target: StackSetTarget.fromOrganizationalUnits({
        regions: ['us-east-1'],
        organizationalUnits: ['ou-1111111'],
        intersectionAccounts: ['222222222222'],
        excludeAccounts: ['333333333333'],
      }),
      deploymentType: DeploymentType.serviceManaged({
        delegatedAdmin: false,
        autoDeployEnabled: false,
      }),
    });
  }).toThrow(/specify at most one of 'additionalAccounts', 'excludeAccounts', or 'intersectionAccounts'/);
});

test('fromOrganizations throws when intersectionAccounts and additionalAccounts are both specified', () => {
  const app = new App();
  const stack = new Stack(app);

  expect(() => {
    new StackSet(stack, 'StackSet', {
      target: StackSetTarget.fromOrganizationalUnits({
        regions: ['us-east-1'],
        organizationalUnits: ['ou-1111111'],
        intersectionAccounts: ['222222222222'],
        additionalAccounts: ['333333333333'],
      }),
      deploymentType: DeploymentType.serviceManaged({
        delegatedAdmin: false,
        autoDeployEnabled: false,
      }),
    });
  }).toThrow(/specify at most one of 'additionalAccounts', 'excludeAccounts', or 'intersectionAccounts'/);
});

test('fromOrganizations throws when all three account filters are specified', () => {
  const app = new App();
  const stack = new Stack(app);

  expect(() => {
    new StackSet(stack, 'StackSet', {
      target: StackSetTarget.fromOrganizationalUnits({
        regions: ['us-east-1'],
        organizationalUnits: ['ou-1111111'],
        intersectionAccounts: ['111111111111'],
        excludeAccounts: ['222222222222'],
        additionalAccounts: ['333333333333'],
      }),
      deploymentType: DeploymentType.serviceManaged({
        delegatedAdmin: false,
        autoDeployEnabled: false,
      }),
    });
  }).toThrow(/specify at most one of 'additionalAccounts', 'excludeAccounts', or 'intersectionAccounts'/);
});

test('has IAM capabilities', () => {
  const app = new App();
  const stack = new Stack(app);

  new StackSet(stack, 'StackSet', {
    target: StackSetTarget.fromAccounts({
      regions: ['us-east-1'],
      accounts: ['11111111111'],
      parameterOverrides: {
        Param1: 'Value1',
      },
    }),
    capabilities: [CfnCapabilities.ANONYMOUS_IAM, CfnCapabilities.NAMED_IAM],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
    ManagedExecution: { Active: true },
    PermissionModel: 'SELF_MANAGED',
    TemplateURL: {
      'Fn::Sub': 'https://s3.${AWS::Region}.${AWS::URLSuffix}/cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}/44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a.json',
    },
    StackInstancesGroup: [{
      Regions: ['us-east-1'],
      DeploymentTargets: {
        Accounts: ['11111111111'],
      },
    }],
    Capabilities: [
      'CAPABILITY_IAM',
      'CAPABILITY_NAMED_IAM',
    ],
  });
});

test('requires asset bucket to be passed', () => {
  const app = new App();
  const stack = new Stack(app);

  expect(() => {
    new LambdaStackSet(stack, 'StackSet', {
      target: StackSetTarget.fromAccounts({
        regions: ['us-east-1'],
        accounts: ['11111111111'],
      }),
      capabilities: [CfnCapabilities.ANONYMOUS_IAM, CfnCapabilities.NAMED_IAM],
    });
  }).toThrow('an asset bucket must be provided to use file assets, set \'assetBuckets\' in the StackSet props');
});

test('test lambda assets with one asset bucket', () => {
  const app = new App({
    context: {
      [cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT]: true,
    },
  });
  const stack = new Stack(app);
  new LambdaStackSet(stack, 'StackSet', {
    assetBuckets: [s3.Bucket.fromBucketName(stack, 'AssetBucket', 'integ-assets')],
    assetBucketPrefix: 'prefix',
    target: StackSetTarget.fromAccounts({
      regions: ['us-east-1'],
      accounts: ['11111111111'],
      parameterOverrides: {
        Param1: 'Value1',
      },
    }),
    capabilities: [CfnCapabilities.ANONYMOUS_IAM, CfnCapabilities.NAMED_IAM],
  });

  Template.fromStack(stack).resourceCountIs('Custom::CDKBucketDeployment', 1);
});

test('test lambda assets with two asset buckets', () => {
  const app = new App({
    context: {
      [cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT]: true,
    },
  });
  const stack = new Stack(app);
  new LambdaStackSet(stack, 'StackSet', {
    assetBuckets: [s3.Bucket.fromBucketName(stack, 'AssetBucket', 'integ-assets'), s3.Bucket.fromBucketName(stack, 'AssetBucket2', 'integ-assets2')],
    assetBucketPrefix: 'prefix',
    target: StackSetTarget.fromAccounts({
      regions: ['us-east-1'],
      accounts: ['11111111111'],
      parameterOverrides: {
        Param1: 'Value1',
      },
    }),
    capabilities: [CfnCapabilities.ANONYMOUS_IAM, CfnCapabilities.NAMED_IAM],
  });

  Template.fromStack(stack).resourceCountIs('Custom::CDKBucketDeployment', 2);
});

test('stackset without target', () => {
  const app = new App();
  const stack = new Stack(app);

  new StackSet(stack, 'StackSet', {
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
    ManagedExecution: { Active: true },
    PermissionModel: 'SELF_MANAGED',
    TemplateURL: {
      'Fn::Sub': 'https://s3.${AWS::Region}.${AWS::URLSuffix}/cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}/44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a.json',
    },
  });

  // No StackInstancesGroup should be present when no target is provided
  const template = Template.fromStack(stack);
  const stackSets = template.findResources('AWS::CloudFormation::StackSet');
  const stackSetResource = Object.values(stackSets)[0];
  expect(stackSetResource.Properties.StackInstancesGroup).toEqual([]);
});

test('stackset without target then addTarget', () => {
  const app = new App();
  const stack = new Stack(app);

  const stackSet = new StackSet(stack, 'StackSet', {
  });

  stackSet.addTarget(StackSetTarget.fromAccounts({
    regions: ['us-east-1'],
    accounts: ['11111111111'],
  }));

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
    ManagedExecution: { Active: true },
    PermissionModel: 'SELF_MANAGED',
    StackInstancesGroup: [{
      Regions: ['us-east-1'],
      DeploymentTargets: {
        Accounts: ['11111111111'],
      },
    }],
  });
});

test('passes operation preferences', () => {
  const app = new App();
  const stack = new Stack(app);

  new StackSet(stack, 'StackSet', {
    target: StackSetTarget.fromAccounts({
      regions: ['us-east-1'],
      accounts: ['11111111111'],
      parameterOverrides: {
        Param1: 'Value1',
      },
    }),
    operationPreferences: {
      // In reality, you would not set all of these at once, but it allows us to test all the properties in one test case
      regionConcurrencyType: RegionConcurrencyType.PARALLEL,
      regionOrder: ['us-east-1', 'us-west-2'],
      maxConcurrentPercentage: 50,
      maxConcurrentCount: 5,
      failureTolerancePercentage: 10,
      failureToleranceCount: 1,
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
    ManagedExecution: { Active: true },
    PermissionModel: 'SELF_MANAGED',
    OperationPreferences: {
      RegionConcurrencyType: 'PARALLEL',
      RegionOrder: ['us-east-1', 'us-west-2'],
      MaxConcurrentPercentage: 50,
      MaxConcurrentCount: 5,
      FailureTolerancePercentage: 10,
      FailureToleranceCount: 1,
    },
    TemplateURL: {
      'Fn::Sub': 'https://s3.${AWS::Region}.${AWS::URLSuffix}/cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}/44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a.json',
    },
    StackInstancesGroup: [{
      Regions: ['us-east-1'],
      DeploymentTargets: {
        Accounts: ['11111111111'],
      },
    }],
  });
});

test.each([
  ['SEQUENTIAL', RegionConcurrencyType.SEQUENTIAL],
  ['PARALLEL', RegionConcurrencyType.PARALLEL],
])('renders the %s region concurrency type', (expected, regionConcurrencyType) => {
  const app = new App();
  const stack = new Stack(app);

  new StackSet(stack, 'StackSet', {
    operationPreferences: { regionConcurrencyType },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
    OperationPreferences: { RegionConcurrencyType: expected },
  });
});

test('passes a custom region concurrency type from of() through to the template', () => {
  const app = new App();
  const stack = new Stack(app);

  new StackSet(stack, 'StackSet', {
    operationPreferences: { regionConcurrencyType: RegionConcurrencyType.of('CUSTOM') },
  });
  Validations.of(stack).acknowledge({ id: 'CloudFormation-Validate::W3030', reason: 'of() accepts values newer than the CloudFormation schema' });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
    OperationPreferences: { RegionConcurrencyType: 'CUSTOM' },
  });
});

test('omits operation preferences when none of its fields are set', () => {
  const app = new App();
  const stack = new Stack(app);

  new StackSet(stack, 'StackSet', {
    operationPreferences: {},
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
    OperationPreferences: Match.absent(),
  });
});

test('empty additionalAccounts renders AccountFilterType NONE', () => {
  const app = new App();
  const stack = new Stack(app);

  new StackSet(stack, 'StackSet', {
    target: StackSetTarget.fromOrganizationalUnits({
      regions: ['us-east-1'],
      organizationalUnits: ['ou-1111111'],
      additionalAccounts: [],
    }),
    deploymentType: DeploymentType.serviceManaged(),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
    StackInstancesGroup: [{
      Regions: ['us-east-1'],
      DeploymentTargets: {
        AccountFilterType: 'NONE',
        OrganizationalUnitIds: ['ou-1111111'],
      },
    }],
  });
});

test('empty excludeAccounts renders AccountFilterType NONE', () => {
  const app = new App();
  const stack = new Stack(app);

  new StackSet(stack, 'StackSet', {
    target: StackSetTarget.fromOrganizationalUnits({
      regions: ['us-east-1'],
      organizationalUnits: ['ou-1111111'],
      excludeAccounts: [],
    }),
    deploymentType: DeploymentType.serviceManaged(),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
    StackInstancesGroup: [{
      Regions: ['us-east-1'],
      DeploymentTargets: {
        AccountFilterType: 'NONE',
        OrganizationalUnitIds: ['ou-1111111'],
      },
    }],
  });
});

test('empty intersectionAccounts renders AccountFilterType NONE', () => {
  const app = new App();
  const stack = new Stack(app);

  new StackSet(stack, 'StackSet', {
    target: StackSetTarget.fromOrganizationalUnits({
      regions: ['us-east-1'],
      organizationalUnits: ['ou-1111111'],
      intersectionAccounts: [],
    }),
    deploymentType: DeploymentType.serviceManaged(),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
    StackInstancesGroup: [{
      Regions: ['us-east-1'],
      DeploymentTargets: {
        AccountFilterType: 'NONE',
        OrganizationalUnitIds: ['ou-1111111'],
      },
    }],
  });
});

test('fromAccounts with empty array throws', () => {
  const app = new App();
  const stack = new Stack(app);

  expect(() => {
    new StackSet(stack, 'StackSet', {
      target: StackSetTarget.fromAccounts({
        regions: ['us-east-1'],
        accounts: [],
      }),
    });
  }).toThrow('fromAccounts requires at least one account');
});

test('test stackset depends on role', () => {
  const app = new App();
  const stack = new Stack(app);

  new StackSet(stack, 'StackSet', {
    target: StackSetTarget.fromAccounts({
      regions: ['us-east-1'],
      accounts: ['11111111111'],
      parameterOverrides: {
        Param1: 'Value1',
      },
    }),
  });

  Template.fromStack(stack).hasResource('AWS::CloudFormation::StackSet', {
    DependsOn: ['StackSetAdminRoleDefaultPolicyA86F14C6', 'StackSetAdminRole60BC89F6'],
  });
});

test('self managed stackset depends on the policy added to a supplied admin role', () => {
  const app = new App();
  const stack = new Stack(app);
  const adminRole = iam.Role.fromRoleArn(stack, 'AdminRole', 'arn:aws:iam::123456789012:role/StackSetAdmin');

  new StackSet(stack, 'StackSet', {
    deploymentType: DeploymentType.selfManaged({ adminRole }),
  });

  const template = Template.fromStack(stack);
  template.hasResource('AWS::CloudFormation::StackSet', {
    DependsOn: ['AdminRolePolicyB2FE8449'],
  });
});

test('self managed stackset uses partition-aware ARN for execution role', () => {
  const app = new App();
  const stack = new Stack(app);

  new StackSet(stack, 'StackSet', {
    target: StackSetTarget.fromAccounts({
      regions: ['us-east-1'],
      accounts: ['11111111111'],
    }),
  });

  // For env-agnostic stacks, formatArn produces a Fn::Join with AWS::Partition
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Effect: 'Allow',
          Action: 'sts:AssumeRole',
          Resource: {
            'Fn::Join': [
              '',
              [
                'arn:',
                { Ref: 'AWS::Partition' },
                ':iam::*:role/AWSCloudFormationStackSetExecutionRole',
              ],
            ],
          },
        },
      ],
    },
  });
});

test('self managed stackset with custom execution role name uses partition-aware ARN', () => {
  const app = new App();
  const stack = new Stack(app);

  new StackSet(stack, 'StackSet', {
    target: StackSetTarget.fromAccounts({
      regions: ['us-east-1'],
      accounts: ['11111111111'],
    }),
    deploymentType: DeploymentType.selfManaged({
      executionRoleName: 'CustomExecutionRole',
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Effect: 'Allow',
          Action: 'sts:AssumeRole',
          Resource: {
            'Fn::Join': [
              '',
              ['arn:', { Ref: 'AWS::Partition' }, ':iam::*:role/CustomExecutionRole'],
            ],
          },
        },
      ],
    },
  });
});

test('GovCloud partition - self managed stackset with specific environment', () => {
  const app = new App({
    context: {
      [cxapi.ENABLE_PARTITION_LITERALS]: true,
    },
  });
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '111111111111',
      region: 'us-gov-west-1',
    },
  });

  new StackSet(stack, 'StackSet', {
    target: StackSetTarget.fromAccounts({
      regions: ['us-gov-west-1'],
      accounts: ['11111111111'],
    }),
  });

  // Verify that the ARN uses the correct partition for GovCloud (aws-us-gov)
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Effect: 'Allow',
          Action: 'sts:AssumeRole',
          Resource: 'arn:aws-us-gov:iam::*:role/AWSCloudFormationStackSetExecutionRole',
        },
      ],
    },
  });
});

test('lambda asset bucket name resolves the region dynamically in the stackset template', () => {
  const app = new App({
    context: {
      [cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT]: true,
    },
  });
  const stage = new Stage(app, 'Stage', { env: { account: '123456789012', region: 'us-east-1' } });
  const stack = new Stack(stage, 'Parent');
  const lambdaStack = new LambdaStackSet(stack, 'StackSet', {
    assetBuckets: [s3.Bucket.fromBucketName(stack, 'AssetBucket', 'prefix-us-east-1')],
    assetBucketPrefix: 'prefix',
    target: StackSetTarget.fromAccounts({
      regions: ['us-east-1'],
      accounts: ['11111111111'],
    }),
    capabilities: [CfnCapabilities.ANONYMOUS_IAM, CfnCapabilities.NAMED_IAM],
  });

  stackSetTemplateOf(lambdaStack).hasResourceProperties('AWS::Lambda::Function', {
    Code: {
      S3Bucket: {
        'Fn::Join': ['-', ['prefix', { Ref: 'AWS::Region' }]],
      },
    },
  });
});

test('lambda asset is staged to the parent asset bucket and copied via bucket deployment', () => {
  const app = new App({
    context: {
      [cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT]: true,
    },
  });
  const stack = new Stack(app);
  new LambdaStackSet(stack, 'StackSet', {
    assetBuckets: [s3.Bucket.fromBucketName(stack, 'AssetBucket', 'integ-assets')],
    assetBucketPrefix: 'prefix',
    target: StackSetTarget.fromAccounts({
      regions: ['us-east-1'],
      accounts: ['11111111111'],
    }),
    capabilities: [CfnCapabilities.ANONYMOUS_IAM, CfnCapabilities.NAMED_IAM],
  });

  Template.fromStack(stack).hasResourceProperties('Custom::CDKBucketDeployment', {
    SourceBucketNames: [
      { 'Fn::Sub': 'cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}' },
    ],
    DestinationBucketName: 'integ-assets',
  });
});

describe('StackSet template asset object keys', () => {
  interface AssetKeysOptions {
    readonly synthesizer?: StackSynthesizer;
    readonly context?: Record<string, unknown>;
    readonly addAssets: (scope: Construct) => void;
  }

  function addLambda(scope: Construct, id: string, code: lambda.Code) {
    new lambda.Function(scope, id, {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code,
    });
  }

  function synthAssetKeys(options: AssetKeysOptions) {
    const app = new App({ context: options.context });
    const stack = new Stack(app, 'Parent', { synthesizer: options.synthesizer });
    const stackSet = new StackSet(stack, 'StackSet', {
      assetBuckets: [s3.Bucket.fromBucketName(stack, 'AssetBucket', 'prefix-us-east-1')],
      assetBucketPrefix: 'prefix',
      target: StackSetTarget.fromAccounts({
        regions: ['us-east-1'],
        accounts: ['11111111111'],
      }),
      capabilities: [CfnCapabilities.ANONYMOUS_IAM],
    });

    options.addAssets(stackSet);

    app.synth();
    const stackSetTemplate = JSON.parse(
      fs.readFileSync(path.join(Stage.of(stack)!.outdir, stackSet.templateFile), 'utf-8'),
    );
    const templateKeys = [
      ...Object.values(Template.fromJSON(stackSetTemplate).findResources('AWS::Lambda::Function'))
        .map((resource) => resource.Properties.Code.S3Key),
      ...Object.values(stackSetTemplate.Outputs ?? {}).map((output: any) => output.Value),
    ];
    const parentTemplate = Template.fromStack(stack);
    const sourceKeys = Object.values(parentTemplate.findResources('Custom::CDKBucketDeployment'))
      .flatMap((resource) => resource.Properties.SourceObjectKeys);

    return { templateKeys, sourceKeys, parentTemplate };
  }

  // The handler (extract: false) writes each source object under its file name only
  function expectKeysMatchCopiedFileNames(templateKeys: string[], sourceKeys: string[]) {
    expect(templateKeys.length).toBeGreaterThan(0);
    expect([...templateKeys].sort()).toEqual(sourceKeys.map((key) => path.posix.basename(key)).sort());
  }

  test.each([
    ['no bucket prefix', new DefaultStackSynthesizer()],
    ['a bucket prefix with a slash', new DefaultStackSynthesizer({ bucketPrefix: 'assets/' })],
    ['a bucket with deploy-time/ prefix', new DefaultStackSynthesizer({ bucketPrefix: 'deploy-time/' })],
    ['a bucket prefix without a slash', new DefaultStackSynthesizer({ bucketPrefix: 'myapp-' })],
  ])('reference the file names the bucket deployment copies to, with %s', (_name, synthesizer) => {
    const { templateKeys, sourceKeys } = synthAssetKeys({
      synthesizer,
      addAssets: (scope) => {
        addLambda(scope, 'Lambda', lambda.Code.fromAsset(path.join(__dirname, 'lambda'), { assetHash: 'custom-hash' }));
        const script = new s3_assets.Asset(scope, 'Script', { path: path.join(__dirname, 'stackset-script', 'script.py') });
        new CfnOutput(scope, 'ScriptKey', { value: script.s3ObjectKey });
      },
    });

    expect(sourceKeys).toHaveLength(2);
    expectKeysMatchCopiedFileNames(templateKeys, sourceKeys);
    expect(templateKeys.some((key: string) => key.endsWith('.py'))).toBe(true);
  });

  test('reference the file names the bucket deployment copies to, with an AwsCustomResource handler', () => {
    const { templateKeys, sourceKeys } = synthAssetKeys({
      addAssets: (scope) => {
        addLambda(scope, 'Lambda', lambda.Code.fromAsset(path.join(__dirname, 'lambda'), { assetHash: 'custom-hash' }));
        new AwsCustomResource(scope, 'CustomResource', {
          onCreate: {
            service: 'S3',
            action: 'listBuckets',
            physicalResourceId: PhysicalResourceId.of('id'),
          },
          policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
        });
      },
    });

    expect(sourceKeys).toHaveLength(2);
    expectKeysMatchCopiedFileNames(templateKeys, sourceKeys);
  });

  test('reference the file names the bucket deployment copies to, with asset staging disabled', () => {
    const { templateKeys, sourceKeys } = synthAssetKeys({
      context: { [cxapi.DISABLE_ASSET_STAGING_CONTEXT]: true },
      addAssets: (scope) => addLambda(scope, 'Lambda', lambda.Code.fromAsset(path.join(__dirname, 'lambda'))),
    });

    expectKeysMatchCopiedFileNames(templateKeys, sourceKeys);
  });

  test('reference the file names the bucket deployment copies to, with bundling skipped', () => {
    const { templateKeys, sourceKeys } = synthAssetKeys({
      context: { [cxapi.BUNDLING_STACKS]: [] },
      addAssets: (scope) => addLambda(scope, 'Lambda', lambda.Code.fromAsset(path.join(__dirname, 'lambda'), {
        bundling: {
          image: lambda.Runtime.NODEJS_18_X.bundlingImage,
          command: ['bash', '-c', 'cp -r /asset-input/. /asset-output'],
        },
      })),
    });

    expectKeysMatchCopiedFileNames(templateKeys, sourceKeys);
  });
});

describe('StackSet asset bucket deployment dependencies', () => {
  function bucketDeploymentIdFor(template: Template, destinationBucketName: string): string {
    const deployments = template.findResources('Custom::CDKBucketDeployment', {
      Properties: { DestinationBucketName: destinationBucketName },
    });
    const ids = Object.keys(deployments);
    expect(ids).toHaveLength(1);
    return ids[0];
  }

  function dependsOnOf(template: Template, stackSetName: string): string[] {
    const stackSets = template.findResources('AWS::CloudFormation::StackSet', {
      Properties: { StackSetName: stackSetName },
    });
    const resources = Object.values(stackSets);
    expect(resources).toHaveLength(1);
    return resources[0].DependsOn ?? [];
  }

  test('each StackSet depends only on the bucket deployments of its own template', () => {
    const app = new App();
    const stack = new Stack(app);
    new LambdaStackSet(stack, 'FirstStackSet', {
      assetBuckets: [s3.Bucket.fromBucketName(stack, 'FirstBucket', 'first-us-east-1')],
      assetBucketPrefix: 'first',
      stackSetName: 'first',
      deploymentType: DeploymentType.serviceManaged(),
      capabilities: [CfnCapabilities.ANONYMOUS_IAM],
    });
    new LambdaStackSet(stack, 'SecondStackSet', {
      assetBuckets: [s3.Bucket.fromBucketName(stack, 'SecondBucket', 'second-us-east-1')],
      assetBucketPrefix: 'second',
      stackSetName: 'second',
      deploymentType: DeploymentType.serviceManaged(),
      capabilities: [CfnCapabilities.ANONYMOUS_IAM],
    });

    const template = Template.fromStack(stack);
    const firstDeployment = bucketDeploymentIdFor(template, 'first-us-east-1');
    const secondDeployment = bucketDeploymentIdFor(template, 'second-us-east-1');
    const firstDependsOn = dependsOnOf(template, 'first');
    const secondDependsOn = dependsOnOf(template, 'second');

    expect(firstDependsOn).toContain(firstDeployment);
    expect(firstDependsOn).not.toContain(secondDeployment);
    expect(secondDependsOn).toContain(secondDeployment);
    expect(secondDependsOn).not.toContain(firstDeployment);
  });

  test('depends on bucket deployments for assets added after the StackSet is created', () => {
    const app = new App();
    const stack = new Stack(app);
    const stackSet = new StackSet(stack, 'StackSet', {
      assetBuckets: [s3.Bucket.fromBucketName(stack, 'AssetBucket', 'late-us-east-1')],
      assetBucketPrefix: 'late',
      stackSetName: 'late',
      capabilities: [CfnCapabilities.ANONYMOUS_IAM],
    });
    new lambda.Function(stackSet, 'Lambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
    });

    const template = Template.fromStack(stack);
    expect(dependsOnOf(template, 'late')).toContain(bucketDeploymentIdFor(template, 'late-us-east-1'));
  });

  test('a StackSet in a nested scope depends on the bucket deployments of its template', () => {
    const app = new App();
    const stack = new Stack(app);
    new LambdaStackSet(new Construct(stack, 'Group'), 'StackSet', {
      assetBuckets: [s3.Bucket.fromBucketName(stack, 'AssetBucket', 'nested-us-east-1')],
      assetBucketPrefix: 'nested',
      stackSetName: 'nested',
      capabilities: [CfnCapabilities.ANONYMOUS_IAM],
    });

    const template = Template.fromStack(stack);
    expect(dependsOnOf(template, 'nested')).toContain(bucketDeploymentIdFor(template, 'nested-us-east-1'));
  });

  function stackSetWithImportedAssetBucket() {
    const app = new App();
    const stack = new Stack(app);
    new LambdaStackSet(stack, 'StackSet', {
      assetBuckets: [s3.Bucket.fromBucketName(stack, 'AssetBucket', 'imported-us-east-1')],
      assetBucketPrefix: 'imported',
      capabilities: [CfnCapabilities.ANONYMOUS_IAM],
    });
    return stack;
  }

  test('warns on the host stack with an acknowledgeable id when an asset bucket is referenced', () => {
    const stack = stackSetWithImportedAssetBucket();

    Annotations.fromStack(stack).hasWarning('/Default', Match.stringLikeRegexp(
      '^Bucket Policy Permissions cannot be added to referenced Bucket.*\\[ack: @aws-cdk/aws-cloudformation:stackSetAssetsBucketPermissions\\]',
    ));
  });

  test('the referenced asset bucket warning can be acknowledged on the host stack', () => {
    const stack = stackSetWithImportedAssetBucket();

    CoreAnnotations.of(stack).acknowledgeWarning('@aws-cdk/aws-cloudformation:stackSetAssetsBucketPermissions');

    Annotations.fromStack(stack).hasNoWarning('*', Match.stringLikeRegexp('Bucket Policy Permissions'));
  });
});

describe('StackSet self managed admin role', () => {
  test('is created next to the StackSet, in the stack that contains it', () => {
    const app = new App();
    const stack = new Stack(app);

    const stackSet = new StackSet(stack, 'StackSet');

    expect(stack.node.tryFindChild('StackSet.AdminRole')).toBe(stackSet.role);
    expect(stackSet.node.tryFindChild('AdminRole')).toBeUndefined();
  });

  test('two self managed StackSets in one scope each get their own admin role', () => {
    const app = new App();
    const stack = new Stack(app);

    new StackSet(stack, 'First', {
    });
    new StackSet(stack, 'Second', {
    });

    Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 2);
  });

  test('trusts CloudFormation only for StackSets in the same account', () => {
    const app = new App();
    const stack = new Stack(app);

    new StackSet(stack, 'StackSet', {
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [{
          Effect: 'Allow',
          Principal: { Service: 'cloudformation.amazonaws.com' },
          Action: 'sts:AssumeRole',
          Condition: {
            StringEquals: { 'aws:SourceAccount': { Ref: 'AWS::AccountId' } },
            ArnLike: {
              'aws:SourceArn': {
                'Fn::Join': ['', [
                  'arn:', { Ref: 'AWS::Partition' }, ':cloudformation:*:', { Ref: 'AWS::AccountId' }, ':stackset/*',
                ]],
              },
            },
          },
        }],
      },
    });
  });

  test('trust conditions use the partition and account of the stack environment', () => {
    const app = new App({ context: { [cxapi.ENABLE_PARTITION_LITERALS]: true } });
    const stack = new Stack(app, 'TestStack', { env: { account: '111111111111', region: 'us-gov-west-1' } });

    new StackSet(stack, 'StackSet', {
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [{
          Effect: 'Allow',
          Principal: { Service: 'cloudformation.amazonaws.com' },
          Action: 'sts:AssumeRole',
          Condition: {
            StringEquals: { 'aws:SourceAccount': '111111111111' },
            ArnLike: { 'aws:SourceArn': 'arn:aws-us-gov:cloudformation:*:111111111111:stackset/*' },
          },
        }],
      },
    });
  });

  test('trust statements for opt-in region principals carry the same conditions', () => {
    const app = new App({ context: { [cxapi.ENABLE_PARTITION_LITERALS]: true } });
    const stack = new Stack(app, 'TestStack', { env: { account: '111111111111', region: 'us-east-1' } });

    new StackSet(stack, 'StackSet', {
      target: StackSetTarget.fromAccounts({
        regions: ['us-east-1', 'af-south-1'],
        accounts: ['11111111111'],
      }),
    });

    const condition = {
      StringEquals: { 'aws:SourceAccount': '111111111111' },
      ArnLike: { 'aws:SourceArn': 'arn:aws:cloudformation:*:111111111111:stackset/*' },
    };
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Effect: 'Allow',
            Principal: { Service: 'cloudformation.amazonaws.com' },
            Action: 'sts:AssumeRole',
            Condition: condition,
          },
          {
            Effect: 'Allow',
            Principal: { Service: 'cloudformation.af-south-1.amazonaws.com' },
            Action: 'sts:AssumeRole',
            Condition: condition,
          },
        ],
      },
    });
  });

  test('the trust policy of a supplied admin role gets no conditions added', () => {
    const app = new App();
    const stack = new Stack(app);
    const adminRole = new iam.Role(stack, 'CustomAdminRole', {
      assumedBy: new iam.ServicePrincipal('cloudformation.amazonaws.com'),
    });

    new StackSet(stack, 'StackSet', {
      deploymentType: DeploymentType.selfManaged({ adminRole }),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [{
          Effect: 'Allow',
          Principal: { Service: 'cloudformation.amazonaws.com' },
          Action: 'sts:AssumeRole',
          Condition: Match.absent(),
        }],
      },
    });
  });

  test('a supplied admin role gets the execution role policy and conditioned trust for opt-in regions', () => {
    const app = new App({ context: { [cxapi.ENABLE_PARTITION_LITERALS]: true } });
    const stack = new Stack(app, 'TestStack', { env: { account: '111111111111', region: 'us-east-1' } });
    const adminRole = new iam.Role(stack, 'CustomAdminRole', {
      assumedBy: new iam.ServicePrincipal('cloudformation.amazonaws.com'),
    });

    new StackSet(stack, 'StackSet', {
      target: StackSetTarget.fromAccounts({
        regions: ['us-east-1', 'af-south-1'],
        accounts: ['11111111111'],
      }),
      deploymentType: DeploymentType.selfManaged({ adminRole }),
    });

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::IAM::Role', 1);
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Effect: 'Allow',
            Principal: { Service: 'cloudformation.amazonaws.com' },
            Action: 'sts:AssumeRole',
            Condition: Match.absent(),
          },
          {
            Effect: 'Allow',
            Principal: { Service: 'cloudformation.af-south-1.amazonaws.com' },
            Action: 'sts:AssumeRole',
            Condition: {
              StringEquals: { 'aws:SourceAccount': '111111111111' },
              ArnLike: { 'aws:SourceArn': 'arn:aws:cloudformation:*:111111111111:stackset/*' },
            },
          },
        ],
      },
    });
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [{
          Effect: 'Allow',
          Action: 'sts:AssumeRole',
          Resource: 'arn:aws:iam::*:role/AWSCloudFormationStackSetExecutionRole',
        }],
      },
      Roles: [{ Ref: stack.getLogicalId(adminRole.node.defaultChild as iam.CfnRole) }],
    });
  });

  test('an imported admin role gets the execution role policy but no trust statements for opt-in regions', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack', { env: { account: '111111111111', region: 'us-east-1' } });
    const adminRole = iam.Role.fromRoleArn(stack, 'AdminRole', 'arn:aws:iam::111111111111:role/StackSetAdmin');

    new StackSet(stack, 'StackSet', {
      target: StackSetTarget.fromAccounts({
        regions: ['us-east-1', 'af-south-1'],
        accounts: ['11111111111'],
      }),
      deploymentType: DeploymentType.selfManaged({ adminRole }),
    });

    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::IAM::Role', 0);
    template.hasResourceProperties('AWS::IAM::Policy', {
      Roles: ['StackSetAdmin'],
    });
  });
});

test('stackSetRef references the StackSet resource', () => {
  const app = new App();
  const stack = new Stack(app);

  const stackSet = new StackSet(stack, 'StackSet', {
  });

  expect(stack.resolve(stackSet.stackSetRef.stackSetId)).toEqual({ Ref: 'StackSetResource' });
});

test('stackSetId is the StackSetId attribute of the StackSet resource', () => {
  const app = new App();
  const stack = new Stack(app);

  const stackSet = new StackSet(stack, 'StackSet', {
  });

  expect(stack.resolve(stackSet.stackSetId)).toEqual({ 'Fn::GetAtt': ['StackSetResource', 'StackSetId'] });
});

test('a service managed StackSet has no role', () => {
  const app = new App();
  const stack = new Stack(app);

  const stackSet = new StackSet(stack, 'StackSet', {
    deploymentType: DeploymentType.serviceManaged(),
  });

  expect(stackSet.role).toBeUndefined();
});

test('a tokenized target region gets no opt-in region trust statement', () => {
  const app = new App();
  const stack = new Stack(app);
  const region = new CfnParameter(stack, 'TargetRegion').valueAsString;

  new StackSet(stack, 'StackSet', {
    target: StackSetTarget.fromAccounts({
      regions: [region],
      accounts: ['11111111111'],
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [Match.objectLike({ Principal: { Service: 'cloudformation.amazonaws.com' } })],
    },
  });
});

describe('importing a StackSet', () => {
  const stackSetId = 'my-stackset:2f0a8b4c-1234-5678-9abc-def012345678';

  test('fromStackSetId returns a StackSet with the given id and no role', () => {
    const stack = new Stack();

    const imported = StackSet.fromStackSetId(stack, 'Imported', stackSetId);

    expect(imported.stackSetId).toEqual(stackSetId);
    expect(imported.stackSetRef.stackSetId).toEqual(stackSetId);
    expect(imported.role).toBeUndefined();
  });

  test('fromStackSetArn takes the id, account and region from the ARN', () => {
    const stack = new Stack();

    const imported = StackSet.fromStackSetArn(stack, 'Imported',
      `arn:aws:cloudformation:us-west-2:123456789012:stackset/${stackSetId}`);

    expect(imported.stackSetId).toEqual(stackSetId);
    expect(imported.stackSetRef.stackSetId).toEqual(stackSetId);
    expect(imported.env).toEqual({ account: '123456789012', region: 'us-west-2' });
    expect(imported.role).toBeUndefined();
  });

  test('fromStackSetArn resolves the id of a tokenized ARN at deploy time', () => {
    const stack = new Stack();
    const stackSetArn = new CfnParameter(stack, 'StackSetArn').valueAsString;

    const imported = StackSet.fromStackSetArn(stack, 'Imported', stackSetArn);

    expect(stack.resolve(imported.stackSetId)).toEqual({
      'Fn::Select': [1, { 'Fn::Split': [':stackset/', { Ref: 'StackSetArn' }] }],
    });
  });

  test('fails when fromStackSetArn gets the ARN of another resource type', () => {
    const stack = new Stack();

    expect(() => StackSet.fromStackSetArn(stack, 'Imported',
      'arn:aws:cloudformation:us-west-2:123456789012:stack/my-stack/2f0a8b4c-1234-5678-9abc-def012345678'))
      .toThrow(/Expected resource type 'stackset' in ARN, got 'stack'/);
  });
});

describe('StackSetTemplate.fromUrl', () => {
  test('uses the given URL as the template URL', () => {
    const app = new App();
    const stack = new Stack(app);

    new StackSet(stack, 'StackSet', {
      template: StackSetTemplate.fromUrl('https://s3.amazonaws.com/my-bucket/template.json'),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
      TemplateURL: 'https://s3.amazonaws.com/my-bucket/template.json',
    });
  });

  test('adds no dependencies to a service managed StackSet', () => {
    const app = new App();
    const stack = new Stack(app);

    new StackSet(stack, 'StackSet', {
      deploymentType: DeploymentType.serviceManaged(),
      template: StackSetTemplate.fromUrl('https://s3.amazonaws.com/my-bucket/template.json'),
    });

    Template.fromStack(stack).hasResource('AWS::CloudFormation::StackSet', {
      DependsOn: Match.absent(),
    });
  });
});

describe('StackSetTemplate.fromAsset', () => {
  const templatePath = path.join(__dirname, 'stackset-template', 'template.json');

  test('uploads the template as an asset of the stack that contains the StackSet', () => {
    const app = new App();
    const stack = new Stack(app, 'Admin');

    const stackSet = new StackSet(stack, 'StackSet', {
      template: StackSetTemplate.fromAsset(templatePath),
    });

    const assetManifest = JSON.parse(fs.readFileSync(path.join(app.synth().directory, 'Admin.assets.json'), 'utf-8'));
    const [assetHash] = Object.entries(assetManifest.files)
      .filter(([, file]: [string, any]) => file.source.path.endsWith('.json') && file.source.packaging === 'file')
      .map(([hash]) => hash);
    expect(assetHash).toBeDefined();
    Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
      TemplateURL: {
        'Fn::Sub': `https://s3.\${AWS::Region}.\${AWS::URLSuffix}/cdk-hnb659fds-assets-\${AWS::AccountId}-\${AWS::Region}/${assetHash}.json`,
      },
    });
    expect(templateAssetHashes(app, stack, stackSet)).toHaveLength(0);
  });

  test('can be used by several StackSets', () => {
    const app = new App();
    const stack = new Stack(app);
    const template = StackSetTemplate.fromAsset(templatePath);

    new StackSet(stack, 'First', { template });
    new StackSet(stack, 'Second', { template });

    Template.fromStack(stack).resourceCountIs('AWS::CloudFormation::StackSet', 2);
  });

  test('fails when a StackSet with a template also contains resources', () => {
    const app = new App();
    const stack = new Stack(app);
    const stackSet = new StackSet(stack, 'StackSet', { template: StackSetTemplate.fromAsset(templatePath) });
    new iam.Role(stackSet, 'Role', { assumedBy: new iam.AccountRootPrincipal() });

    expect(() => app.synth()).toThrow(/a StackSet with a 'template' must not contain resources/);
  });
});

describe('StackSet placement', () => {
  test.each([
    ['a Stack', (stack: Stack) => stack],
    ['a construct within a Stack', (stack: Stack) => new Construct(stack, 'Group')],
    ['a NestedStack', (stack: Stack) => new NestedStack(stack, 'Nested')],
  ])('can be defined in %s, which deploys the StackSet resource', (_name, scopeOf) => {
    const app = new App();
    const stack = new Stack(app, 'Admin');
    const scope = scopeOf(stack);
    const stackSet = new StackSet(scope, 'StackSet');

    expect(Stack.of(stackSet.node.defaultChild!)).toBe(Stack.of(scope));
    expect(stackSet.stack).toBe(Stack.of(scope));
    expect(stackSet.node.defaultChild!.node.path).toBe(`${scope.node.path}/StackSet.Resource`);
  });

  test.each([
    ['an App', (app: App) => app],
    ['a Stage', (app: App) => new Stage(app, 'Stage')],
  ])('fails with an error code when defined directly in %s', (_name, scopeOf) => {
    const app = new App();

    expect(() => new StackSet(scopeOf(app), 'StackSet')).toThrow(expect.objectContaining({
      name: 'StackSetMustBeDefinedWithinStack',
      message: 'a StackSet must be defined within the scope of a Stack',
    }));
  });

  test('creates the resources that deploy the StackSet next to it, with its ID as a prefix', () => {
    const app = new App();
    const stack = new Stack(app, 'Admin');
    new LambdaStackSet(stack, 'Baseline', {
      assetBuckets: [s3.Bucket.fromBucketName(stack, 'AssetBucket', 'prefix-us-east-1')],
      assetBucketPrefix: 'prefix',
    });

    const children = stack.node.children.map((child) => child.node.id);
    expect(children).toEqual(expect.arrayContaining([
      'Baseline',
      'Baseline.Resource',
      'Baseline.AdminRole',
      'Baseline.HostAssetBucket',
      'Baseline.AssetBucketDeployment0',
    ]));
  });

  test('a StackSet is not a deployable artifact', () => {
    const app = new App();
    new StackSet(new Stack(app, 'Admin'), 'StackSet');

    expect(app.synth().stacks.map((s) => s.stackName)).toEqual(['Admin']);
  });

  test('isStackSet', () => {
    const app = new App();
    const stack = new Stack(app);

    expect(StackSet.isStackSet(new StackSet(stack, 'StackSet'))).toBe(true);
    expect(StackSet.isStackSet(stack)).toBe(false);
  });
});

describe('StackSet template asset', () => {
  function templateUrlOf(stack: Stack): any {
    const [stackSet] = Object.values(Template.fromStack(stack).findResources('AWS::CloudFormation::StackSet'));
    return stackSet.Properties.TemplateURL;
  }

  test('is uploaded by the stack that contains the StackSet', () => {
    const app = new App();
    const stack = new Stack(app, 'Admin');
    const stackSet = new StackSet(stack, 'StackSet');
    new iam.Role(stackSet, 'Role', { assumedBy: new iam.AccountRootPrincipal() });

    const [templateHash] = templateAssetHashes(app, stack, stackSet);
    expect(templateHash).toBeDefined();
    expect(templateUrlOf(stack)).toEqual({
      'Fn::Sub': `https://s3.\${AWS::Region}.\${AWS::URLSuffix}/cdk-hnb659fds-assets-\${AWS::AccountId}-\${AWS::Region}/${templateHash}.json`,
    });
  });

  test('changes the template URL when the template changes', () => {
    function synthTemplateUrl(roles: number) {
      const app = new App();
      const stack = new Stack(app, 'Admin');
      const stackSet = new StackSet(stack, 'StackSet');
      for (let i = 0; i < roles; i++) {
        new iam.Role(stackSet, `Role${i}`, { assumedBy: new iam.AccountRootPrincipal() });
      }
      return templateUrlOf(stack);
    }

    expect(synthTemplateUrl(1)).not.toEqual(synthTemplateUrl(2));
  });

  test('changes the template of a nested stack that contains the StackSet when the StackSet template changes', () => {
    function synthNestedTemplateHash(roles: number) {
      const app = new App();
      const stack = new Stack(app, 'Admin');
      const nested = new NestedStack(stack, 'Nested');
      const stackSet = new StackSet(nested, 'StackSet');
      for (let i = 0; i < roles; i++) {
        new iam.Role(stackSet, `Role${i}`, { assumedBy: new iam.AccountRootPrincipal() });
      }
      const manifest = JSON.parse(fs.readFileSync(path.join(app.synth().directory, 'Admin.assets.json'), 'utf-8'));
      return Object.entries(manifest.files).find(([, file]: [string, any]) => file.source.path === nested.templateFile)![0];
    }

    expect(synthNestedTemplateHash(1)).not.toEqual(synthNestedTemplateHash(2));
  });

  test('works with a host stack that uses the legacy synthesizer, through a nested stack', () => {
    const app = new App();
    const stack = new Stack(app, 'Admin', { synthesizer: new LegacyStackSynthesizer() });
    const nested = new NestedStack(stack, 'Nested');
    const stackSet = new StackSet(nested, 'StackSet');
    new iam.Role(stackSet, 'Role', { assumedBy: new iam.AccountRootPrincipal() });

    const assembly = app.synth();
    const nestedTemplate = JSON.parse(fs.readFileSync(path.join(assembly.directory, nested.templateFile), 'utf-8'));
    // the legacy synthesizer records assets in the metadata of the stack artifact
    const [templateHash] = assembly.getStackByName('Admin').assets
      .filter((asset: any) => asset.path === stackSet.templateFile)
      .map((asset: any) => asset.sourceHash);
    expect(templateHash).toBeDefined();
    expect(Object.keys(Template.fromStack(stack).toJSON().Parameters)).toEqual(expect.arrayContaining([
      expect.stringMatching(`^AssetParameters${templateHash}S3Bucket`),
    ]));
    expect(Object.keys(nestedTemplate.Parameters)).toEqual(expect.arrayContaining([
      expect.stringMatching(`^referencetoAdminAssetParameters${templateHash}S3Bucket`),
    ]));
  });

  test('is written to the cloud assembly', () => {
    const app = new App();
    const stackSet = new StackSet(new Stack(app, 'Admin'), 'StackSet');
    new iam.Role(stackSet, 'Role', { assumedBy: new iam.AccountRootPrincipal() });

    stackSetTemplateOf(stackSet).resourceCountIs('AWS::IAM::Role', 1);
  });
});

describe('StackSet environment', () => {
  test('the template is environment agnostic even when its stage has an environment', () => {
    const app = new App();
    const stage = new Stage(app, 'Stage', { env: { account: '111111111111', region: 'us-east-1' } });
    const stackSet = new StackSet(new Stack(stage, 'Host'), 'StackSet');
    new iam.Role(stackSet, 'Role', { assumedBy: new iam.AccountRootPrincipal() });

    stackSetTemplateOf(stackSet).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [{
          Principal: {
            AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']] },
          },
        }],
      },
    });
  });

  test('env and stack are those of the StackSet resource, in the stack that contains it', () => {
    const app = new App();
    const host = new Stack(app, 'Host', { env: { account: '111111111111', region: 'us-east-1' } });
    const stackSet = new StackSet(host, 'StackSet');

    expect(stackSet.stack).toBe(host);
    expect(stackSet.env).toEqual({ account: '111111111111', region: 'us-east-1' });
    expect(stackSet.resolve(stackSet.region)).toEqual({ Ref: 'AWS::Region' });
  });
});

describe('StackSet description and tags', () => {
  test('the description is the description of the StackSet and of its template', () => {
    const app = new App();
    const stack = new Stack(app);
    const stackSet = new StackSet(stack, 'StackSet', { description: 'Security baseline' });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', { Description: 'Security baseline' });
    expect(stackSetTemplateOf(stackSet).toJSON().Description).toEqual('Security baseline');
  });

  test('tags of the StackSet are tags of the StackSet resource and of its resources', () => {
    const app = new App();
    const stack = new Stack(app);
    const stackSet = new StackSet(stack, 'StackSet');
    new s3.Bucket(stackSet, 'Bucket');
    Tags.of(stackSet).add('team', 'security');

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
      Tags: [{ Key: 'team', Value: 'security' }],
    });
    stackSetTemplateOf(stackSet).hasResourceProperties('AWS::S3::Bucket', {
      Tags: [{ Key: 'team', Value: 'security' }],
    });
  });

  test('applyRemovalPolicy applies to the StackSet resource', () => {
    const app = new App();
    const stack = new Stack(app);
    const stackSet = new StackSet(stack, 'StackSet');

    stackSet.applyRemovalPolicy(RemovalPolicy.RETAIN);

    Template.fromStack(stack).hasResource('AWS::CloudFormation::StackSet', { DeletionPolicy: 'Retain' });
  });
});

describe('StackSet references to other stacks', () => {
  test('a value of the stack that contains the StackSet is passed as a StackSet parameter', () => {
    const app = new App();
    const stack = new Stack(app, 'Admin');
    const auditRole = new iam.Role(stack, 'AuditRole', { assumedBy: new iam.AccountRootPrincipal() });
    const stackSet = new StackSet(stack, 'StackSet', { parameters: { Environment: 'prod' } });
    new CfnOutput(stackSet, 'AuditRoleArn', { value: auditRole.roleArn });

    const template = stackSetTemplateOf(stackSet).toJSON();
    const [parameterName] = Object.keys(template.Parameters);
    expect(template.Parameters[parameterName]).toEqual({ Type: 'String' });
    expect(template.Outputs.AuditRoleArn.Value).toEqual({ Ref: parameterName });
    Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
      Parameters: [
        { ParameterKey: 'Environment', ParameterValue: 'prod' },
        { ParameterKey: parameterName, ParameterValue: { 'Fn::GetAtt': [Match.stringLikeRegexp('^AuditRole'), 'Arn'] } },
      ],
    });
  });

  test('a value of another stack is imported by the stack that contains the StackSet', () => {
    const app = new App();
    const other = new Stack(app, 'Other');
    const topic = new CfnParameter(other, 'Topic');
    const stack = new Stack(app, 'Admin');
    const stackSet = new StackSet(stack, 'StackSet');
    new CfnOutput(stackSet, 'TopicName', { value: topic.valueAsString });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
      Parameters: [{ ParameterKey: Match.anyValue(), ParameterValue: { 'Fn::ImportValue': Match.stringLikeRegexp('^Other:') } }],
    });
    expect(stack.dependencies).toContain(other);
  });

  test('fails when another stack references a resource of the StackSet', () => {
    const app = new App();
    const stack = new Stack(app, 'Admin');
    const stackSet = new StackSet(stack, 'StackSet');
    const role = new iam.Role(stackSet, 'Role', { assumedBy: new iam.AccountRootPrincipal() });
    new CfnOutput(stack, 'RoleArn', { value: role.roleArn });

    expect(() => app.synth()).toThrow(expect.objectContaining({
      name: 'CrossStackReferenceNotSupported',
      message: expect.stringContaining('the producer stack "Admin/StackSet" does not support cross-stack references'),
    }));
  });

  test('fails when a StackSet parameter has the name of a parameter passed for a reference', () => {
    const app = new App();
    const stack = new Stack(app, 'Admin');
    const auditRole = new iam.Role(stack, 'AuditRole', { assumedBy: new iam.AccountRootPrincipal() });
    const stackSet = new StackSet(stack, 'StackSet');
    new CfnOutput(stackSet, 'AuditRoleArn', { value: auditRole.roleArn });
    const [parameterName] = Object.keys(stackSetTemplateOf(stackSet).toJSON().Parameters);

    const conflictingApp = new App();
    const conflictingStack = new Stack(conflictingApp, 'Admin');
    const conflictingRole = new iam.Role(conflictingStack, 'AuditRole', { assumedBy: new iam.AccountRootPrincipal() });
    const conflicting = new StackSet(conflictingStack, 'StackSet', { parameters: { [parameterName]: 'value' } });
    new CfnOutput(conflicting, 'AuditRoleArn', { value: conflictingRole.roleArn });

    expect(() => conflictingApp.synth()).toThrow(expect.objectContaining({
      name: 'StackSetParameterConflict',
    }));
  });
});

describe('nested stacks in a StackSet', () => {
  function stackSetWithNestedStack() {
    const app = new App();
    const stack = new Stack(app, 'Admin');
    const stackSet = new StackSet(stack, 'StackSet', {
      assetBuckets: [s3.Bucket.fromBucketName(stack, 'AssetBucket', 'prefix-us-east-1')],
      assetBucketPrefix: 'prefix',
    });
    const nested = new NestedStack(stackSet, 'Nested');
    return { app, stack, stackSet, nested };
  }

  test('the nested template is copied to the asset bucket of each region', () => {
    const { stack, stackSet, nested } = stackSetWithNestedStack();
    new iam.Role(nested, 'Role', { assumedBy: new iam.AccountRootPrincipal() });

    const nestedStackResource = Object.values(stackSetTemplateOf(stackSet).findResources('AWS::CloudFormation::Stack'))[0];
    expect(nestedStackResource.Properties.TemplateURL).toEqual({
      'Fn::Join': ['', [
        'https://s3.', { Ref: 'AWS::Region' }, '.', { Ref: 'AWS::URLSuffix' }, '/',
        { 'Fn::Join': ['-', ['prefix', { Ref: 'AWS::Region' }]] },
        `/${copiedTemplateKey(stack)}`,
      ]],
    });
  });

  /**
   * The object key of the template the copy job copies to the asset bucket
   */
  function copiedTemplateKey(stack: Stack): string {
    const [copy] = Object.values(Template.fromStack(stack).findResources('Custom::CDKBucketDeployment', {
      Properties: { DestinationBucketName: 'prefix-us-east-1' },
    }));
    const [key] = copy.Properties.SourceObjectKeys;
    expect(key).toMatch(/^[0-9a-f]{64}\.json$/);
    return key;
  }

  test('a value of the stack that contains the StackSet is passed through the StackSet and the nested stack', () => {
    const { stack, stackSet, nested } = stackSetWithNestedStack();
    const auditRole = new iam.Role(stack, 'AuditRole', { assumedBy: new iam.AccountRootPrincipal() });
    new CfnOutput(nested, 'AuditRoleArn', { value: auditRole.roleArn });

    const stackSetTemplate = stackSetTemplateOf(stackSet).toJSON();
    const [stackSetParameter] = Object.keys(stackSetTemplate.Parameters);
    const nestedStackResource: any = Object.values(stackSetTemplate.Resources).find((r: any) => r.Type === 'AWS::CloudFormation::Stack');
    expect(Object.values(nestedStackResource.Properties.Parameters)).toEqual([{ Ref: stackSetParameter }]);
    Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
      Parameters: [{ ParameterKey: stackSetParameter, ParameterValue: { 'Fn::GetAtt': [Match.stringLikeRegexp('^AuditRole'), 'Arn'] } }],
    });
  });

  test('fails without asset buckets', () => {
    const app = new App();
    const stackSet = new StackSet(new Stack(app, 'Admin'), 'StackSet');
    new NestedStack(stackSet, 'Nested');

    expect(() => app.synth()).toThrow(expect.objectContaining({ name: 'AssetBucketRequired' }));
  });
});

describe('StackSet annotations', () => {
  test('warnings of constructs in the StackSet are reported by the stack that contains it', () => {
    const app = new App();
    const stack = new Stack(app, 'Admin');
    const stackSet = new StackSet(stack, 'StackSet');
    CoreAnnotations.of(new Construct(stackSet, 'Inner')).addWarningV2('test:warning', 'inside the StackSet');

    Annotations.fromStack(stack).hasWarning('/Admin/StackSet/Inner', Match.stringLikeRegexp('inside the StackSet'));
  });
});

describe('StackSet validation errors', () => {
  test('fails with an error code when fromAccounts has no accounts', () => {
    expect(() => StackSetTarget.fromAccounts({ regions: ['us-east-1'], accounts: [] })).toThrow(expect.objectContaining({
      name: 'StackSetAccountsRequired',
      message: 'fromAccounts requires at least one account',
    }));
  });

  test('fails with an error code when more than one account filter is specified', () => {
    expect(() => StackSetTarget.fromOrganizationalUnits({
      regions: ['us-east-1'],
      organizationalUnits: ['ou-1111111'],
      additionalAccounts: ['111111111111'],
      excludeAccounts: ['222222222222'],
    })).toThrow(expect.objectContaining({
      name: 'StackSetAccountFiltersMutuallyExclusive',
      message: "specify at most one of 'additionalAccounts', 'excludeAccounts', or 'intersectionAccounts'",
    }));
  });

  test('fails with an error code when autoDeployRetainStacks is set without autoDeploy', () => {
    const app = new App();
    const stack = new Stack(app);

    expect(() => new StackSet(stack, 'StackSet', {
      deploymentType: DeploymentType.serviceManaged({ autoDeployEnabled: false, autoDeployRetainStacks: true }),
    })).toThrow(expect.objectContaining({
      name: 'StackSetAutoDeployRetainStacksRequiresAutoDeploy',
      message: 'autoDeployRetainStacks only applies if autoDeploy is enabled',
      constructPath: 'Default/StackSet',
    }));
  });

  test('fails with an error code when a service managed StackSet uses AUTO_EXPAND', () => {
    const app = new App();
    const stack = new Stack(app);

    expect(() => new StackSet(stack, 'StackSet', {
      deploymentType: DeploymentType.serviceManaged(),
      capabilities: [CfnCapabilities.AUTO_EXPAND],
    })).toThrow(expect.objectContaining({
      name: 'StackSetAutoExpandNotSupported',
      message: 'service managed stacksets do not currently support the "AUTO_EXPAND" capability',
      constructPath: 'Default/StackSet',
    }));
  });

  test('fails with an error code when a file asset is used without asset buckets', () => {
    const app = new App();
    const stack = new Stack(app);

    expect(() => new LambdaStackSet(stack, 'LambdaStack')).toThrow(expect.objectContaining({
      name: 'AssetBucketRequired',
      message: 'an asset bucket must be provided to use file assets, set \'assetBuckets\' in the StackSet props',
      constructPath: 'Default/LambdaStack',
    }));
  });

  test('fails with an error code when a file asset is used without an asset bucket prefix', () => {
    const app = new App();
    const stack = new Stack(app);

    expect(() => new LambdaStackSet(stack, 'LambdaStack', {
      assetBuckets: [s3.Bucket.fromBucketName(stack, 'AssetBucket', 'prefix-us-east-1')],
    })).toThrow(expect.objectContaining({
      name: 'AssetBucketPrefixRequired',
      message: 'an asset bucket prefix must be provided to use file assets, set \'assetBucketPrefix\' in the StackSet props',
      constructPath: 'Default/LambdaStack',
    }));
  });

  test('fails with an error code when a file asset has no file name', () => {
    const app = new App();
    const stack = new Stack(app);
    const stackSet = new StackSet(stack, 'AssetStack', {
      assetBuckets: [s3.Bucket.fromBucketName(stack, 'AssetBucket', 'prefix-us-east-1')],
      assetBucketPrefix: 'prefix',
    });

    expect(() => stackSet.synthesizer.addFileAsset({ sourceHash: 'hash' })).toThrow(expect.objectContaining({
      name: 'AssetFileNameRequired',
      message: 'asset filename is undefined',
      constructPath: 'Default/AssetStack',
    }));
  });

  test('fails with an error code when a docker image asset is used', () => {
    const app = new App();
    const stackSet = new StackSet(new Stack(app), 'AssetStack');

    expect(() => stackSet.synthesizer.addDockerImageAsset({ sourceHash: 'hash', directoryName: 'dir' })).toThrow(expect.objectContaining({
      name: 'DockerAssetsNotSupported',
      message: 'docker image assets are not supported in StackSets',
      constructPath: 'Default/AssetStack',
    }));
  });
});
