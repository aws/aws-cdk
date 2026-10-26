import * as crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { Construct } from 'constructs';
import { Annotations, Match, Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as lambda from '../../aws-lambda';
import * as s3 from '../../aws-s3';
import * as s3_assets from '../../aws-s3-assets';
import * as sns from '../../aws-sns';
import * as cxschema from '../../cloud-assembly-schema';
import {
  Annotations as CoreAnnotations,
  App,
  CfnCapabilities,
  CfnOutput,
  CfnParameter,
  CfnResource,
  DefaultStackSynthesizer,
  Fn,
  LegacyStackSynthesizer,
  NestedStack,
  Stack,
  Stage,
  Validations,
} from '../../core';
import type { StackSynthesizer } from '../../core';
import { lit } from '../../core/lib/private/literal-string';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from '../../custom-resources';
import * as cxapi from '../../cx-api';
import type { StackSetStackProps } from '../lib';
import {
  DeploymentType,
  RegionConcurrencyType,
  StackSet,
  StackSetTarget,
  StackSetTemplate,
  StackSetStack,
} from '../lib';

class LambdaStackSet extends StackSetStack {
  constructor(scope: Construct, id: string, props?: StackSetStackProps) {
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
    template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
    template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
    template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
    ManagedExecution: { Active: true },
    PermissionModel: 'SELF_MANAGED',
    AdministrationRoleARN: { 'Fn::GetAtt': ['StackSetAdminRoleFDB48078', 'Arn'] },
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
    template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
    ManagedExecution: { Active: true },
    PermissionModel: 'SELF_MANAGED',
    AdministrationRoleARN: { 'Fn::GetAtt': ['StackSetAdminRoleFDB48078', 'Arn'] },
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
    template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
    template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
      template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
    template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
    template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
    template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
    template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
      template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
      template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
      template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
    template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
    const lambdaStack = new LambdaStackSet(stack, 'LambdaStack');
    new StackSet(stack, 'StackSet', {
      target: StackSetTarget.fromAccounts({
        regions: ['us-east-1'],
        accounts: ['11111111111'],
      }),
      template: StackSetTemplate.fromStackSetStack(new StackSetStack(lambdaStack, 'LambdaStack')),
      capabilities: [CfnCapabilities.ANONYMOUS_IAM, CfnCapabilities.NAMED_IAM],
    });
  }).toThrow('an asset bucket must be provided to use file assets, set \'assetBuckets\' in the StackSetStack props');
});

test('test lambda assets with one asset bucket', () => {
  const app = new App({
    context: {
      [cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT]: true,
    },
  });
  const stack = new Stack(app);
  const lambdaStack = new LambdaStackSet(stack, 'LambdaStack', {
    assetBuckets: [s3.Bucket.fromBucketName(stack, 'AssetBucket', 'integ-assets')],
    assetBucketPrefix: 'prefix',
  });

  new StackSet(stack, 'StackSet', {
    target: StackSetTarget.fromAccounts({
      regions: ['us-east-1'],
      accounts: ['11111111111'],
      parameterOverrides: {
        Param1: 'Value1',
      },
    }),
    template: StackSetTemplate.fromStackSetStack(lambdaStack),
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
  const lambdaStack = new LambdaStackSet(stack, 'LambdaStack', {
    assetBuckets: [s3.Bucket.fromBucketName(stack, 'AssetBucket', 'integ-assets'), s3.Bucket.fromBucketName(stack, 'AssetBucket2', 'integ-assets2')],
    assetBucketPrefix: 'prefix',
  });

  new StackSet(stack, 'StackSet', {
    target: StackSetTarget.fromAccounts({
      regions: ['us-east-1'],
      accounts: ['11111111111'],
      parameterOverrides: {
        Param1: 'Value1',
      },
    }),
    template: StackSetTemplate.fromStackSetStack(lambdaStack),
    capabilities: [CfnCapabilities.ANONYMOUS_IAM, CfnCapabilities.NAMED_IAM],
  });

  Template.fromStack(stack).resourceCountIs('Custom::CDKBucketDeployment', 2);
});

test('stackset without target', () => {
  const app = new App();
  const stack = new Stack(app);

  new StackSet(stack, 'StackSet', {
    template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
    template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
    template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
    template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
    template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
    template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
    template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
    template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
    template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
      template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
    template: StackSetTemplate.fromStackSetStack(
      new StackSetStack(stack, 'Stack'),
    ),
  });

  Template.fromStack(stack).hasResource('AWS::CloudFormation::StackSet', {
    DependsOn: ['StackSetAdminRoleDefaultPolicy96A312F6', 'StackSetAdminRoleFDB48078'],
  });
});

test('self managed stackset depends on the policy added to a supplied admin role', () => {
  const app = new App();
  const stack = new Stack(app);
  const adminRole = iam.Role.fromRoleArn(stack, 'AdminRole', 'arn:aws:iam::123456789012:role/StackSetAdmin');

  new StackSet(stack, 'StackSet', {
    template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
    template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
    template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
    template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
  const lambdaStack = new LambdaStackSet(stack, 'LambdaStack', {
    assetBuckets: [s3.Bucket.fromBucketName(stack, 'AssetBucket', 'prefix-us-east-1')],
    assetBucketPrefix: 'prefix',
  });

  new StackSet(stack, 'StackSet', {
    target: StackSetTarget.fromAccounts({
      regions: ['us-east-1'],
      accounts: ['11111111111'],
    }),
    template: StackSetTemplate.fromStackSetStack(lambdaStack),
    capabilities: [CfnCapabilities.ANONYMOUS_IAM, CfnCapabilities.NAMED_IAM],
  });

  app.synth();
  const stackSetTemplate = JSON.parse(
    fs.readFileSync(path.join(stage.outdir, lambdaStack.templateFile), 'utf-8'),
  );

  Template.fromJSON(stackSetTemplate).hasResourceProperties('AWS::Lambda::Function', {
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
  const lambdaStack = new LambdaStackSet(stack, 'LambdaStack', {
    assetBuckets: [s3.Bucket.fromBucketName(stack, 'AssetBucket', 'integ-assets')],
    assetBucketPrefix: 'prefix',
  });

  new StackSet(stack, 'StackSet', {
    target: StackSetTarget.fromAccounts({
      regions: ['us-east-1'],
      accounts: ['11111111111'],
    }),
    template: StackSetTemplate.fromStackSetStack(lambdaStack),
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
    const stackSetStack = new StackSetStack(stack, 'AssetStack', {
      assetBuckets: [s3.Bucket.fromBucketName(stack, 'AssetBucket', 'prefix-us-east-1')],
      assetBucketPrefix: 'prefix',
    });

    options.addAssets(stackSetStack);

    new StackSet(stack, 'StackSet', {
      target: StackSetTarget.fromAccounts({
        regions: ['us-east-1'],
        accounts: ['11111111111'],
      }),
      template: StackSetTemplate.fromStackSetStack(stackSetStack),
      capabilities: [CfnCapabilities.ANONYMOUS_IAM],
    });

    app.synth();
    const stackSetTemplate = JSON.parse(
      fs.readFileSync(path.join(Stage.of(stack)!.outdir, stackSetStack.templateFile), 'utf-8'),
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
    const first = new LambdaStackSet(stack, 'First', {
      assetBuckets: [s3.Bucket.fromBucketName(stack, 'FirstBucket', 'first-us-east-1')],
      assetBucketPrefix: 'first',
    });
    const second = new LambdaStackSet(stack, 'Second', {
      assetBuckets: [s3.Bucket.fromBucketName(stack, 'SecondBucket', 'second-us-east-1')],
      assetBucketPrefix: 'second',
    });

    new StackSet(stack, 'FirstStackSet', {
      stackSetName: 'first',
      deploymentType: DeploymentType.serviceManaged(),
      template: StackSetTemplate.fromStackSetStack(first),
      capabilities: [CfnCapabilities.ANONYMOUS_IAM],
    });
    new StackSet(stack, 'SecondStackSet', {
      stackSetName: 'second',
      deploymentType: DeploymentType.serviceManaged(),
      template: StackSetTemplate.fromStackSetStack(second),
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
    const stackSetStack = new StackSetStack(stack, 'AssetStack', {
      assetBuckets: [s3.Bucket.fromBucketName(stack, 'AssetBucket', 'late-us-east-1')],
      assetBucketPrefix: 'late',
    });

    new StackSet(stack, 'StackSet', {
      stackSetName: 'late',
      template: StackSetTemplate.fromStackSetStack(stackSetStack),
      capabilities: [CfnCapabilities.ANONYMOUS_IAM],
    });
    new lambda.Function(stackSetStack, 'Lambda', {
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
    const stackSetStack = new LambdaStackSet(stack, 'AssetStack', {
      assetBuckets: [s3.Bucket.fromBucketName(stack, 'AssetBucket', 'nested-us-east-1')],
      assetBucketPrefix: 'nested',
    });

    new StackSet(new Construct(stack, 'Group'), 'StackSet', {
      stackSetName: 'nested',
      template: StackSetTemplate.fromStackSetStack(stackSetStack),
      capabilities: [CfnCapabilities.ANONYMOUS_IAM],
    });

    const template = Template.fromStack(stack);
    expect(dependsOnOf(template, 'nested')).toContain(bucketDeploymentIdFor(template, 'nested-us-east-1'));
  });

  test('warns with an acknowledgeable id when an asset bucket is referenced', () => {
    const app = new App();
    const stack = new Stack(app);
    const stackSetStack = new LambdaStackSet(stack, 'AssetStack', {
      assetBuckets: [s3.Bucket.fromBucketName(stack, 'AssetBucket', 'imported-us-east-1')],
      assetBucketPrefix: 'imported',
    });
    newStackSet(stack, 'StackSet', stackSetStack);

    Annotations.fromStack(stack).hasWarning('/Default', Match.stringLikeRegexp(
      '^Bucket Policy Permissions cannot be added to referenced Bucket.*\\[ack: @aws-cdk/aws-cloudformation:stackSetAssetsBucketPermissions\\]',
    ));
  });

  test('the referenced asset bucket warning can be acknowledged on the parent stack', () => {
    const app = new App();
    const stack = new Stack(app);
    const stackSetStack = new LambdaStackSet(stack, 'AssetStack', {
      assetBuckets: [s3.Bucket.fromBucketName(stack, 'AssetBucket', 'imported-us-east-1')],
      assetBucketPrefix: 'imported',
    });
    newStackSet(stack, 'StackSet', stackSetStack);

    CoreAnnotations.of(stack).acknowledgeWarning('@aws-cdk/aws-cloudformation:stackSetAssetsBucketPermissions');

    Annotations.fromStack(stack).hasNoWarning('*', Match.stringLikeRegexp('Bucket Policy Permissions'));
  });

  test('the referenced asset bucket warning is on the stack of the StackSet and can be acknowledged there', () => {
    const app = new App();
    const scope = new Stack(app, 'Scope');
    const stackSetStack = new LambdaStackSet(scope, 'AssetStack', {
      assetBuckets: [s3.Bucket.fromBucketName(scope, 'AssetBucket', 'imported-us-east-1')],
      assetBucketPrefix: 'imported',
    });
    const first = new Stack(app, 'First');
    const second = new Stack(app, 'Second');
    newStackSet(first, 'StackSet', stackSetStack);
    newStackSet(second, 'StackSet', stackSetStack);

    CoreAnnotations.of(second).acknowledgeWarning('@aws-cdk/aws-cloudformation:stackSetAssetsBucketPermissions');

    Annotations.fromStack(first).hasWarning('/First', Match.stringLikeRegexp('^Bucket Policy Permissions cannot be added'));
    Annotations.fromStack(second).hasNoWarning('*', Match.stringLikeRegexp('Bucket Policy Permissions'));
    Annotations.fromStack(scope).hasNoWarning('*', Match.stringLikeRegexp('Bucket Policy Permissions'));
  });

  test.each([
    ['their stack', (_app: App, stack: Stack): Construct => stack],
    ['the App', (app: App): Construct => app],
  ])('depends on bucket deployments for assets added after the StackSet is created, with the StackSetStack in %s', (_name, scopeOf) => {
    const app = new App();
    const stack = new Stack(app, 'Consumer');
    const other = new Stack(app, 'Other');
    const stackSetStack = new StackSetStack(scopeOf(app, stack), 'AssetStack', {
      assetBuckets: [s3.Bucket.fromBucketName(stack, 'AssetBucket', 'late-us-east-1')],
      assetBucketPrefix: 'late',
    });
    newStackSet(stack, 'late', stackSetStack);
    newStackSet(other, 'other', stackSetStack);
    addLambdaTo(stackSetStack);

    for (const [consumer, name] of [[stack, 'late'], [other, 'other']] as const) {
      const template = Template.fromStack(consumer);
      expect(dependsOnOf(template, name)).toContain(bucketDeploymentIdFor(template, 'late-us-east-1'));
    }
  });
});

describe('StackSet self managed admin role', () => {
  test('is created within the StackSet scope', () => {
    const app = new App();
    const stack = new Stack(app);

    const stackSet = new StackSet(stack, 'StackSet', {
      template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
    });

    expect(stackSet.node.tryFindChild('AdminRole')).toBe(stackSet.role);
    expect(stack.node.tryFindChild('AdminRole')).toBeUndefined();
  });

  test('two self managed StackSets in one scope each get their own admin role', () => {
    const app = new App();
    const stack = new Stack(app);

    new StackSet(stack, 'First', {
      template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'FirstStack')),
    });
    new StackSet(stack, 'Second', {
      template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'SecondStack')),
    });

    Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 2);
  });

  test('trusts CloudFormation only for StackSets in the same account', () => {
    const app = new App();
    const stack = new Stack(app);

    new StackSet(stack, 'StackSet', {
      template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
      template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
      template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
      template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
      template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
      template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
    template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
  });

  expect(stack.resolve(stackSet.stackSetRef.stackSetId)).toEqual({ Ref: 'StackSet6E6355CF' });
});

test('stackSetId is the StackSetId attribute of the StackSet resource', () => {
  const app = new App();
  const stack = new Stack(app);

  const stackSet = new StackSet(stack, 'StackSet', {
    template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
  });

  expect(stack.resolve(stackSet.stackSetId)).toEqual({ 'Fn::GetAtt': ['StackSet6E6355CF', 'StackSetId'] });
});

test('a service managed StackSet has no role', () => {
  const app = new App();
  const stack = new Stack(app);

  const stackSet = new StackSet(stack, 'StackSet', {
    deploymentType: DeploymentType.serviceManaged(),
    template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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
    template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
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

test('fromStackSetStack returns a StackSetTemplate instance', () => {
  const app = new App();
  const stack = new Stack(app);

  const template = StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack'));

  expect(template).toBeInstanceOf(StackSetTemplate);
});

describe('StackSet validation errors', () => {
  function templateIn(stack: Stack) {
    return StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack'));
  }

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
      template: templateIn(stack),
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
      template: templateIn(stack),
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
      message: 'an asset bucket must be provided to use file assets, set \'assetBuckets\' in the StackSetStack props',
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
      message: 'an asset bucket prefix must be provided to use file assets, set \'assetBucketPrefix\' in the StackSetStack props',
      constructPath: 'Default/LambdaStack',
    }));
  });

  test('fails with an error code when a file asset has no file name', () => {
    const app = new App();
    const stack = new Stack(app);
    const stackSetStack = new StackSetStack(stack, 'AssetStack', {
      assetBuckets: [s3.Bucket.fromBucketName(stack, 'AssetBucket', 'prefix-us-east-1')],
      assetBucketPrefix: 'prefix',
    });

    expect(() => stackSetStack.synthesizer.addFileAsset({ sourceHash: 'hash' })).toThrow(expect.objectContaining({
      name: 'AssetFileNameRequired',
      message: 'asset filename is undefined',
      constructPath: 'Default/AssetStack',
    }));
  });

  test('fails with an error code when a docker image asset is used', () => {
    const app = new App();
    const stack = new Stack(app);
    const stackSetStack = new StackSetStack(stack, 'AssetStack');

    expect(() => stackSetStack.synthesizer.addDockerImageAsset({ sourceHash: 'hash', directoryName: 'dir' })).toThrow(expect.objectContaining({
      name: 'DockerAssetsNotSupported',
      message: 'docker image assets are not supported in StackSet stacks',
      constructPath: 'Default/AssetStack',
    }));
  });
});

function sha256(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

function readFile(outdir: string, fileName: string): string {
  return fs.readFileSync(path.join(outdir, fileName), 'utf-8');
}

function stackSetTemplateHash(outdir: string, stackSetStack: StackSetStack): string {
  return sha256(readFile(outdir, stackSetStack.templateFile));
}

function assetManifestOf(assembly: cxapi.CloudAssembly, stack: Stack): any {
  return JSON.parse(readFile(assembly.directory, `${stack.artifactId}.assets.json`));
}

/**
 * Render a CloudFormation string expression as one string, with `${Ref}` placeholders
 */
function renderString(value: any): string {
  if (typeof value === 'string') {
    return value;
  }
  if (value.Ref) {
    return `\${${value.Ref}}`;
  }
  if (value['Fn::Sub']) {
    return value['Fn::Sub'];
  }
  if (value['Fn::Join']) {
    const [separator, parts] = value['Fn::Join'];
    return parts.map(renderString).join(separator);
  }
  throw new Error(`cannot render ${JSON.stringify(value)}`);
}

function stackSetResourcesOf(template: Template): any[] {
  return Object.values(template.findResources('AWS::CloudFormation::StackSet'));
}

function templateUrlOf(template: Template): string {
  const stackSets = stackSetResourcesOf(template);
  expect(stackSets).toHaveLength(1);
  return renderString(stackSets[0].Properties.TemplateURL);
}

function bucketDeploymentIdsOf(template: Template): string[] {
  return Object.keys(template.findResources('Custom::CDKBucketDeployment'));
}

function defaultAssetUrl(account: string, region: string, hash: string): string {
  return `https://s3.${region}.\${AWS::URLSuffix}/cdk-hnb659fds-assets-${account}-${region}/${hash}.json`;
}

function stackArtifactDependencies(assembly: cxapi.CloudAssembly, stack: Stack): string[] {
  const stackIds = new Set(assembly.stacks.map((s) => s.id));
  return assembly.getStackArtifact(stack.artifactId).dependencies.map((d) => d.id).filter((id) => stackIds.has(id));
}

function newStackSet(scope: Construct, id: string, stackSetStack: StackSetStack): StackSet {
  return new StackSet(scope, id, {
    stackSetName: id,
    template: StackSetTemplate.fromStackSetStack(stackSetStack),
    capabilities: [CfnCapabilities.ANONYMOUS_IAM],
  });
}

function addLambdaTo(scope: Construct, id: string = 'Lambda') {
  return new lambda.Function(scope, id, {
    runtime: lambda.Runtime.NODEJS_18_X,
    handler: 'index.handler',
    code: lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
  });
}

describe('StackSetStack scope', () => {
  test.each([
    ['an App', (app: App) => app],
    ['a plain construct', (app: App) => new Construct(app, 'Group')],
    ['a stack that does not consume it', (app: App) => new Stack(app, 'Other')],
  ])('can be %s and is consumed by a StackSet in a regular stack', (_name, scopeOf) => {
    const app = new App();
    const consumer = new Stack(app, 'Consumer');
    const stackSetStack = new StackSetStack(scopeOf(app), 'StackSetStack');
    new sns.Topic(stackSetStack, 'Topic');
    newStackSet(consumer, 'StackSet', stackSetStack);

    const assembly = app.synth();

    const hash = stackSetTemplateHash(assembly.directory, stackSetStack);
    const resources = JSON.parse(readFile(assembly.directory, stackSetStack.templateFile)).Resources;
    expect(Object.values(resources).map((resource: any) => resource.Type)).toEqual(['AWS::SNS::Topic']);
    expect(assembly.stacks.map((s) => s.id)).not.toContain(stackSetStack.artifactId);
    expect(templateUrlOf(Template.fromStack(consumer))).toEqual(defaultAssetUrl('${AWS::AccountId}', '${AWS::Region}', hash));
  });

  test('can be the root of a Stage and its template is written to the outdir of the Stage', () => {
    const app = new App();
    const stage = new Stage(app, 'Stage');
    const consumer = new Stack(stage, 'Consumer');
    const stackSetStack = new StackSetStack(stage, 'StackSetStack');
    newStackSet(consumer, 'StackSet', stackSetStack);

    const assembly = app.synth();

    expect(fs.existsSync(path.join(assembly.directory, stackSetStack.templateFile))).toBe(false);
    const hash = stackSetTemplateHash(stage.outdir, stackSetStack);
    expect(templateUrlOf(Template.fromStack(consumer))).toEqual(defaultAssetUrl('${AWS::AccountId}', '${AWS::Region}', hash));
  });

  test('can be inside another StackSetStack, which gets none of its resources', () => {
    const app = new App();
    const consumer = new Stack(app, 'Consumer');
    const outer = new StackSetStack(app, 'Outer');
    const inner = new StackSetStack(outer, 'Inner');
    new sns.Topic(inner, 'Topic');
    newStackSet(consumer, 'OuterStackSet', outer);
    newStackSet(consumer, 'InnerStackSet', inner);

    const assembly = app.synth();

    Template.fromJSON(JSON.parse(readFile(assembly.directory, outer.templateFile))).resourceCountIs('AWS::SNS::Topic', 0);
    Template.fromJSON(JSON.parse(readFile(assembly.directory, inner.templateFile))).resourceCountIs('AWS::SNS::Topic', 1);
  });
});

describe('StackSetStack template asset', () => {
  test.each([
    ['the consumer stack is created first', true],
    ['the StackSetStack is created first', false],
  ])('is hosted by the consuming stack when %s', (_name, consumerFirst) => {
    const app = new App();
    let consumer: Stack | undefined = consumerFirst ? new Stack(app, 'Consumer') : undefined;
    const scope = new Stack(app, 'Scope');
    const stackSetStack = new StackSetStack(scope, 'StackSetStack');
    new sns.Topic(stackSetStack, 'Topic');
    consumer = consumer ?? new Stack(app, 'Consumer');
    newStackSet(consumer, 'StackSet', stackSetStack);

    const assembly = app.synth();

    const hash = stackSetTemplateHash(assembly.directory, stackSetStack);
    expect(templateUrlOf(Template.fromStack(consumer))).toEqual(defaultAssetUrl('${AWS::AccountId}', '${AWS::Region}', hash));
    expect(assetManifestOf(assembly, consumer).files[hash].source).toEqual({ path: stackSetStack.templateFile, packaging: 'file' });
    expect(assetManifestOf(assembly, scope).files[hash]).toBeUndefined();
  });

  test('keeps the hash of the written template after a forced re-synth', () => {
    const app = new App();
    const consumer = new Stack(app, 'Consumer');
    const stackSetStack = new StackSetStack(app, 'StackSetStack');
    new sns.Topic(stackSetStack, 'Topic');
    newStackSet(consumer, 'StackSet', stackSetStack);
    app.synth();
    new sns.Topic(stackSetStack, 'AddedAfterSynth');

    const assembly = app.synth({ force: true });

    const hash = stackSetTemplateHash(assembly.directory, stackSetStack);
    expect(templateUrlOf(Template.fromStack(consumer))).toEqual(defaultAssetUrl('${AWS::AccountId}', '${AWS::Region}', hash));
    expect(assetManifestOf(assembly, consumer).files[hash].source.path).toEqual(stackSetStack.templateFile);
  });

  test('is written without being hosted anywhere when no StackSet consumes it', () => {
    const app = new App();
    const scope = new Stack(app, 'Scope');
    const stackSetStack = new LambdaStackSet(scope, 'StackSetStack', {
      assetBuckets: [s3.Bucket.fromBucketName(scope, 'AssetBucket', 'prefix-us-east-1')],
      assetBucketPrefix: 'prefix',
    });

    const assembly = app.synth();

    expect(fs.existsSync(path.join(assembly.directory, stackSetStack.templateFile))).toBe(true);
    const manifestFiles = Object.values(assetManifestOf(assembly, scope).files) as any[];
    expect(manifestFiles.map((file) => file.source.path)).toEqual([`${scope.artifactId}.template.json`]);
    Template.fromStack(scope).resourceCountIs('Custom::CDKBucketDeployment', 0);
    expect(Annotations.fromStack(scope).findWarning('*', Match.stringLikeRegexp('.*'))).toEqual([]);
  });
});

describe('a StackSetStack shared by stacks in different environments', () => {
  const envB = { account: '222222222222', region: 'us-west-2' };
  const envC = { account: '333333333333', region: 'eu-west-1' };

  test.each([
    ['a stack', (app: App) => new Stack(app, 'A', { env: { account: '111111111111', region: 'us-east-1' } })],
    ['the App', (app: App) => app],
  ])('scoped in %s gives each consumer stack its own template asset and bucket deployments', (_name, scopeOf) => {
    const app = new App();
    const scope = scopeOf(app);
    const stackSetStack = new StackSetStack(scope, 'StackSetStack', {
      assetBuckets: [s3.Bucket.fromBucketName(new Stack(app, 'Buckets'), 'AssetBucket', 'prefix-us-east-1')],
      assetBucketPrefix: 'prefix',
    });
    addLambdaTo(stackSetStack);
    const b = new Stack(app, 'B', { env: envB });
    const c = new Stack(app, 'C', { env: envC });
    newStackSet(b, 'StackSet', stackSetStack);
    newStackSet(c, 'StackSet', stackSetStack);

    const assembly = app.synth();

    const hash = stackSetTemplateHash(assembly.directory, stackSetStack);
    for (const [consumer, env] of [[b, envB], [c, envC]] as const) {
      const template = Template.fromStack(consumer);
      const bucket = `cdk-hnb659fds-assets-${env.account}-${env.region}`;
      expect(templateUrlOf(template)).toEqual(defaultAssetUrl(env.account, env.region, hash));
      expect(Object.values(assetManifestOf(assembly, consumer).files[hash].destinations)).toEqual([
        expect.objectContaining({ bucketName: bucket, objectKey: `${hash}.json`, region: env.region }),
      ]);

      const deployments = bucketDeploymentIdsOf(template);
      expect(deployments).toHaveLength(1);
      template.hasResourceProperties('Custom::CDKBucketDeployment', {
        SourceBucketNames: [bucket],
        DestinationBucketName: 'prefix-us-east-1',
      });
      const dependsOn: string[] = stackSetResourcesOf(template)[0].DependsOn;
      expect(dependsOn).toEqual(expect.arrayContaining(deployments));
      expect(dependsOn.filter((id) => !template.toJSON().Resources[id])).toEqual([]);
      expect(stackArtifactDependencies(assembly, consumer)).toEqual([]);
    }
    if (Stack.isStack(scope)) {
      Template.fromStack(scope).resourceCountIs('Custom::CDKBucketDeployment', 0);
      expect(assetManifestOf(assembly, scope).files[hash]).toBeUndefined();
    }
  });
});

describe('two StackSets in one stack sharing a StackSetStack', () => {
  test.each([
    ['the App', (_app: App, stack: Stack): Construct => stack.node.root],
    ['their stack', (_app: App, stack: Stack): Construct => stack],
  ])('scoped in %s share one template asset and one bucket deployment per asset bucket', (_name, scopeOf) => {
    const app = new App();
    const stack = new Stack(app, 'Consumer');
    const stackSetStack = new LambdaStackSet(scopeOf(app, stack), 'StackSetStack', {
      assetBuckets: [
        s3.Bucket.fromBucketName(stack, 'AssetBucket', 'first-us-east-1'),
        s3.Bucket.fromBucketName(stack, 'AssetBucket2', 'second-us-east-1'),
      ],
      assetBucketPrefix: 'prefix',
    });
    newStackSet(stack, 'First', stackSetStack);
    newStackSet(stack, 'Second', stackSetStack);

    const assembly = app.synth();

    const template = Template.fromStack(stack);
    const [first, second] = stackSetResourcesOf(template);
    expect(first.Properties.TemplateURL).toEqual(second.Properties.TemplateURL);
    const templateEntries = (Object.values(assetManifestOf(assembly, stack).files) as any[])
      .filter((file) => file.source.path === stackSetStack.templateFile);
    expect(templateEntries).toHaveLength(1);
    const deployments = bucketDeploymentIdsOf(template);
    expect(deployments).toHaveLength(2);
    expect(first.DependsOn).toEqual(expect.arrayContaining(deployments));
    expect(second.DependsOn).toEqual(expect.arrayContaining(deployments));
  });
});

describe('StackSetStack placement rules', () => {
  test('fails with an error code when the StackSet is in a different Stage', () => {
    const app = new App();
    const stackSetStack = new StackSetStack(app, 'StackSetStack');
    const consumer = new Stack(new Stage(app, 'Stage'), 'Consumer');

    expect(() => newStackSet(consumer, 'StackSet', stackSetStack)).toThrow(expect.objectContaining({
      name: 'StackSetStackInDifferentStage',
      constructPath: 'Stage/Consumer/StackSet',
    }));
  });

  test('a StackSet in the Stage of the StackSetStack synthesizes into that Stage', () => {
    const app = new App();
    const stage = new Stage(app, 'Stage');
    const stackSetStack = new StackSetStack(new Stack(stage, 'Scope'), 'StackSetStack');
    const consumer = new Stack(stage, 'Consumer');
    newStackSet(consumer, 'StackSet', stackSetStack);

    app.synth();

    const hash = stackSetTemplateHash(stage.outdir, stackSetStack);
    expect(templateUrlOf(Template.fromStack(consumer))).toEqual(defaultAssetUrl('${AWS::AccountId}', '${AWS::Region}', hash));
  });

  test('fails with an error code when the StackSet is inside a StackSetStack', () => {
    const app = new App();
    const outer = new StackSetStack(app, 'Outer');
    const stackSetStack = new StackSetStack(app, 'StackSetStack');

    expect(() => newStackSet(outer, 'StackSet', stackSetStack)).toThrow(expect.objectContaining({
      name: 'StackSetInStackSetStack',
      constructPath: 'Outer/StackSet',
    }));
  });

  test('fails with an error code when the StackSet is inside a nested stack of a StackSetStack', () => {
    const app = new App();
    const outer = new StackSetStack(app, 'Outer');
    const nested = new NestedStack(outer, 'Nested');
    const stackSetStack = new StackSetStack(app, 'StackSetStack');

    expect(() => newStackSet(nested, 'StackSet', stackSetStack)).toThrow(expect.objectContaining({
      name: 'StackSetInStackSetStack',
      constructPath: 'Outer/Nested/StackSet',
    }));
  });

  test('fails with an error code when the StackSet uses the template of its own StackSetStack', () => {
    const app = new App();
    const stackSetStack = new StackSetStack(app, 'StackSetStack');

    expect(() => newStackSet(stackSetStack, 'StackSet', stackSetStack)).toThrow(expect.objectContaining({
      name: 'StackSetInStackSetStack',
    }));
  });
});

describe('StackSetStack file asset object keys across consumer stacks', () => {
  function templateKeysOf(outdir: string, stackSetStack: StackSetStack): string[] {
    const template = Template.fromJSON(JSON.parse(readFile(outdir, stackSetStack.templateFile)));
    return Object.values(template.findResources('AWS::Lambda::Function')).map((resource) => resource.Properties.Code.S3Key);
  }

  function copiedFileNamesOf(stack: Stack): string[] {
    return Object.values(Template.fromStack(stack).findResources('Custom::CDKBucketDeployment'))
      .flatMap((resource) => resource.Properties.SourceObjectKeys)
      .map((key: any) => typeof key === 'string' ? path.posix.basename(key) : key);
  }

  function appScopedStackSetStack(app: App) {
    return new StackSetStack(app, 'StackSetStack', {
      assetBuckets: [s3.Bucket.fromBucketName(new Stack(app, 'Buckets'), 'AssetBucket', 'prefix-us-east-1')],
      assetBucketPrefix: 'prefix',
    });
  }

  test('reference the file names a default and a legacy consumer stack copy to', () => {
    const app = new App();
    const stackSetStack = appScopedStackSetStack(app);
    addLambdaTo(stackSetStack);
    const defaultConsumer = new Stack(app, 'Default', { synthesizer: new DefaultStackSynthesizer({ bucketPrefix: 'assets/' }) });
    const legacyConsumer = new Stack(app, 'Legacy', { synthesizer: new LegacyStackSynthesizer() });
    newStackSet(defaultConsumer, 'StackSet', stackSetStack);
    newStackSet(legacyConsumer, 'StackSet', stackSetStack);

    const assembly = app.synth();

    const [templateKey] = templateKeysOf(assembly.directory, stackSetStack);
    expect(copiedFileNamesOf(defaultConsumer)).toEqual([templateKey]);
    const legacyAsset = assembly.getStackArtifact(legacyConsumer.artifactId).assets
      .find((asset) => asset.packaging === 'zip') as cxschema.FileAssetMetadataEntry;
    expect(templateKey).toEqual(`${legacyAsset.sourceHash}.zip`);
  });

  test('fails with an error code at the second StackSet when consumer stacks would copy an asset under different file names', () => {
    const app = new App();
    const stackSetStack = appScopedStackSetStack(app);
    addLambdaTo(stackSetStack);
    newStackSet(new Stack(app, 'First', { synthesizer: new DefaultStackSynthesizer({ bucketPrefix: 'first-' }) }), 'StackSet', stackSetStack);
    const second = new Stack(app, 'Second', { synthesizer: new DefaultStackSynthesizer({ bucketPrefix: 'second-' }) });

    expect(() => newStackSet(second, 'StackSet', stackSetStack)).toThrow(expect.objectContaining({
      name: 'StackSetAssetObjectKeyMismatch',
      constructPath: 'StackSetStack',
    }));
  });

  test('fails with an error code at the asset when consumer stacks would copy it under different file names', () => {
    const app = new App();
    const stackSetStack = appScopedStackSetStack(app);
    newStackSet(new Stack(app, 'First', { synthesizer: new DefaultStackSynthesizer({ bucketPrefix: 'first-' }) }), 'StackSet', stackSetStack);
    newStackSet(new Stack(app, 'Second', { synthesizer: new DefaultStackSynthesizer({ bucketPrefix: 'second-' }) }), 'StackSet', stackSetStack);

    expect(() => addLambdaTo(stackSetStack)).toThrow(expect.objectContaining({
      name: 'StackSetAssetObjectKeyMismatch',
    }));
  });

  test('take the file name of the consumer stack bucket prefix when it has no slash', () => {
    const app = new App();
    const stackSetStack = appScopedStackSetStack(app);
    const consumer = new Stack(app, 'Consumer', { synthesizer: new DefaultStackSynthesizer({ bucketPrefix: 'myapp-' }) });
    addLambdaTo(stackSetStack);
    newStackSet(consumer, 'StackSet', stackSetStack);

    const assembly = app.synth();

    const templateKeys = templateKeysOf(assembly.directory, stackSetStack);
    expect(templateKeys[0]).toMatch(/^myapp-/);
    expect(copiedFileNamesOf(consumer)).toEqual(templateKeys);
  });
});

describe('StackSetStack consumed by a stack with the legacy synthesizer', () => {
  test('references the asset parameters of that stack only', () => {
    const app = new App();
    const consumer = new Stack(app, 'Consumer', { synthesizer: new LegacyStackSynthesizer() });
    const stackSetStack = new StackSetStack(app, 'StackSetStack', {
      assetBuckets: [s3.Bucket.fromBucketName(consumer, 'AssetBucket', 'prefix-us-east-1')],
      assetBucketPrefix: 'prefix',
    });
    addLambdaTo(stackSetStack);
    newStackSet(consumer, 'StackSet', stackSetStack);

    const assembly = app.synth();

    const template = Template.fromStack(consumer).toJSON();
    const parameters = Object.keys(template.Parameters);
    const stackSet = Object.values(template.Resources).find((resource: any) => resource.Type === 'AWS::CloudFormation::StackSet') as any;
    const deployment = Object.values(template.Resources).find((resource: any) => resource.Type === 'Custom::CDKBucketDeployment') as any;
    const templateUrlRefs = refsOf(stackSet.Properties.TemplateURL).filter((ref) => ref.startsWith('AssetParameters'));
    const sourceRefs = refsOf(deployment.Properties.SourceBucketNames).filter((ref) => ref.startsWith('AssetParameters'));

    const templateHash = stackSetTemplateHash(assembly.directory, stackSetStack);
    expect(templateUrlRefs.length).toBeGreaterThan(0);
    expect(templateUrlRefs.every((ref) => ref.startsWith(`AssetParameters${templateHash}`))).toBe(true);
    expect(sourceRefs.length).toBeGreaterThan(0);
    expect([...templateUrlRefs, ...sourceRefs].every((ref) => parameters.includes(ref))).toBe(true);
    expect(JSON.stringify(template)).not.toMatch(/Fn::ImportValue|\$\{Token\[/);
  });
});

describe('references across a StackSetStack boundary', () => {
  type ScopeOf = (app: App, other: Stack) => Construct;
  const scopes: Array<[string, ScopeOf]> = [
    ['under the other stack', (_app, other) => other],
    ['at App scope', (app) => app],
  ];
  const envs: Array<[string, { account: string; region: string } | undefined]> = [
    ['an environment-agnostic', undefined],
    ['an explicit-environment', { account: '111111111111', region: 'us-east-1' }],
  ];
  const strengths = ['strong', 'weak'];

  function arrange(scopeOf: ScopeOf, env: { account: string; region: string } | undefined, strength: string) {
    const app = new App({ context: { [cxapi.DEFAULT_CROSS_STACK_REFERENCES]: strength } });
    const other = new Stack(app, 'Other', { env });
    const stackSetStack = new StackSetStack(scopeOf(app, other), 'StackSetStack');
    newStackSet(new Stack(app, 'Consumer', { env }), 'StackSet', stackSetStack);
    return { app, other, stackSetStack };
  }

  describe.each(scopes)('with the StackSetStack %s', (_scope, scopeOf) => {
    describe.each(envs)('and %s other stack', (_env, env) => {
      test.each(strengths)('fails with an error code for a %s reference from the StackSetStack', (strength) => {
        const { app, other, stackSetStack } = arrange(scopeOf, env, strength);
        const topic = new sns.CfnTopic(other, 'Topic');
        new CfnResource(stackSetStack, 'Consumer', { type: 'My::Resource', properties: { TopicArn: topic.ref } });

        expect(() => app.synth()).toThrow(expect.objectContaining({
          name: 'StackSetStackCrossStackReference',
          message: expect.stringContaining(topic.node.path),
        }));
      });

      test.each(strengths)('fails with an error code for a %s reference to the StackSetStack', (strength) => {
        const { app, other, stackSetStack } = arrange(scopeOf, env, strength);
        const topic = new sns.CfnTopic(stackSetStack, 'Topic');
        new CfnResource(other, 'Consumer', { type: 'My::Resource', properties: { TopicName: topic.attrTopicName } });

        expect(() => app.synth()).toThrow(expect.objectContaining({
          name: 'StackSetStackCrossStackReference',
          message: expect.stringContaining(topic.node.path),
        }));
      });
    });
  });

  test('fails with an error code for a reference from a nested stack of the StackSetStack to another stack', () => {
    const { app, other, stackSetStack } = arrange((a) => a, undefined, 'strong');
    const topic = new sns.CfnTopic(other, 'Topic');
    new CfnResource(new NestedStack(stackSetStack, 'Nested'), 'Consumer', { type: 'My::Resource', properties: { TopicArn: topic.ref } });

    expect(() => app.synth()).toThrow(expect.objectContaining({ name: 'StackSetStackCrossStackReference' }));
  });

  test('allows references inside the StackSetStack, from its nested stacks and to imported values', () => {
    const app = new App();
    const consumer = new Stack(app, 'Consumer');
    const stackSetStack = new StackSetStack(app, 'StackSetStack', {
      assetBuckets: [s3.Bucket.fromBucketName(consumer, 'AssetBucket', 'prefix-us-east-1')],
      assetBucketPrefix: 'prefix',
    });
    newStackSet(consumer, 'StackSet', stackSetStack);
    const topic = new sns.CfnTopic(stackSetStack, 'Topic');
    new CfnResource(stackSetStack, 'Local', { type: 'My::Resource', properties: { TopicArn: topic.ref } });
    new CfnResource(new NestedStack(stackSetStack, 'Nested'), 'FromNested', { type: 'My::Resource', properties: { TopicArn: topic.ref } });
    new CfnResource(stackSetStack, 'Imported', { type: 'My::Resource', properties: { Value: Fn.importValue('SomeExport') } });

    const assembly = app.synth();

    const template = Template.fromJSON(JSON.parse(readFile(assembly.directory, stackSetStack.templateFile)));
    template.hasResourceProperties('My::Resource', { TopicArn: { Ref: Match.stringLikeRegexp('^Topic') } });
    template.hasResourceProperties('My::Resource', { Value: { 'Fn::ImportValue': 'SomeExport' } });
  });
});

/**
 * The asset hash that `stack`, a top-level stack, records for the file `fileName`
 */
function recordedAssetHashOf(assembly: cxapi.CloudAssembly, stack: Stack, fileName: string): string {
  const artifact = assembly.getStackArtifact(stack.artifactId);
  const legacyAsset = artifact.assets.find((asset) => asset.path === fileName);
  if (legacyAsset) {
    return legacyAsset.sourceHash;
  }
  const entries = Object.entries(assetManifestOf(assembly, stack).files)
    .filter(([, file]: [string, any]) => file.source.path === fileName);
  expect(entries).toHaveLength(1);
  return entries[0][0];
}

/**
 * The hash of a nested stack template, which nested stacks compute over compact JSON
 */
function nestedTemplateHash(outdir: string, fileName: string): string {
  return sha256(JSON.stringify(JSON.parse(readFile(outdir, fileName))));
}

function refsOf(value: any): string[] {
  return JSON.stringify(value).match(/"Ref":"[^"]+"/g)?.map((ref) => ref.slice(7, -1)) ?? [];
}

const synthesizers: Array<[string, () => StackSynthesizer]> = [
  ['the default synthesizer', () => new DefaultStackSynthesizer()],
  ['the legacy synthesizer', () => new LegacyStackSynthesizer()],
];

describe('a StackSet in a nested stack', () => {
  test.each(synthesizers)('gets the URL of a StackSetStack created after the nested stack, with %s', (_name, synthesizer) => {
    const app = new App();
    const top = new Stack(app, 'Top', { synthesizer: synthesizer() });
    const nested = new NestedStack(top, 'Nested');
    const stackSetStack = new StackSetStack(app, 'StackSetStack');
    new sns.Topic(stackSetStack, 'Topic');
    newStackSet(nested, 'StackSet', stackSetStack);

    const assembly = app.synth();

    const nestedTemplate = JSON.parse(readFile(assembly.directory, nested.templateFile));
    const stackSet = stackSetResourcesOf(Template.fromJSON(nestedTemplate))[0];
    const urlRefs = refsOf(stackSet.Properties.TemplateURL).filter((ref) => !ref.startsWith('AWS::'));
    expect(urlRefs.every((ref) => ref in (nestedTemplate.Parameters ?? {}))).toBe(true);
    expect(JSON.stringify(stackSet.Properties.TemplateURL)).not.toMatch(/unresolved|\$\{Token\[/);
    if (urlRefs.length === 0) {
      const hash = stackSetTemplateHash(assembly.directory, stackSetStack);
      expect(renderString(stackSet.Properties.TemplateURL)).toEqual(defaultAssetUrl('${AWS::AccountId}', '${AWS::Region}', hash));
    }
    expect(recordedAssetHashOf(assembly, top, nested.templateFile)).toEqual(nestedTemplateHash(assembly.directory, nested.templateFile));
  });
});

describe('a nested stack inside a StackSetStack', () => {
  function stackSetStackWithNestedStack(scope: Construct, bucketScope: Stack) {
    const stackSetStack = new StackSetStack(scope, 'StackSetStack', {
      assetBuckets: [s3.Bucket.fromBucketName(bucketScope, 'AssetBucket', 'prefix-us-east-1')],
      assetBucketPrefix: 'prefix',
    });
    new sns.Topic(new NestedStack(stackSetStack, 'Nested'), 'Topic');
    return stackSetStack;
  }

  /**
   * Checks that the StackSet in `template` waits for the bucket deployments there, and that their handler waits for its permissions
   */
  function expectDeploymentsWired(template: Template) {
    const resources = template.toJSON().Resources;
    const deployments = bucketDeploymentIdsOf(template);
    expect(deployments).toHaveLength(1);
    const dependsOn: string[] = stackSetResourcesOf(template)[0].DependsOn;
    expect(dependsOn).toEqual(expect.arrayContaining(deployments));
    expect(dependsOn.filter((id) => !resources[id])).toEqual([]);

    const handlers = Object.values(template.findResources('AWS::Lambda::Function'));
    expect(handlers).toHaveLength(1);
    const roleId = handlers[0].Properties.Role['Fn::GetAtt'][0];
    const policyIds = Object.entries(template.findResources('AWS::IAM::Policy'))
      .filter(([, policy]) => JSON.stringify(policy.Properties.Roles) === JSON.stringify([{ Ref: roleId }]))
      .map(([id]) => id);
    expect(policyIds).toHaveLength(1);
    expect(handlers[0].DependsOn).toEqual(expect.arrayContaining([roleId, ...policyIds]));
  }

  test.each([
    ['under the consumer stack', (_app: App, consumer: Stack): Construct => consumer],
    ['at App scope', (app: App): Construct => app],
  ])('makes the StackSet wait for the copies of its template, with the StackSetStack %s', (_name, scopeOf) => {
    const app = new App();
    const consumer = new Stack(app, 'Consumer');
    const stackSetStack = stackSetStackWithNestedStack(scopeOf(app, consumer), consumer);
    newStackSet(consumer, 'StackSet', stackSetStack);

    expectDeploymentsWired(Template.fromStack(consumer));
  });

  test('makes each StackSet wait for the copies in its own stack', () => {
    const app = new App();
    const first = new Stack(app, 'First');
    const second = new Stack(app, 'Second');
    const stackSetStack = stackSetStackWithNestedStack(app, new Stack(app, 'Buckets'));
    newStackSet(first, 'StackSet', stackSetStack);
    newStackSet(second, 'StackSet', stackSetStack);

    expectDeploymentsWired(Template.fromStack(first));
    expectDeploymentsWired(Template.fromStack(second));
  });

  test.each(synthesizers)('makes a StackSet in a nested stack wait for the copies there, with %s', (_name, synthesizer) => {
    const app = new App();
    const top = new Stack(app, 'Top', { synthesizer: synthesizer() });
    const host = new NestedStack(top, 'Host');
    const stackSetStack = stackSetStackWithNestedStack(app, top);
    newStackSet(host, 'StackSet', stackSetStack);

    const assembly = app.synth();

    const hostTemplate = JSON.parse(readFile(assembly.directory, host.templateFile));
    expectDeploymentsWired(Template.fromJSON(hostTemplate));
    const unknownRefs = refsOf(hostTemplate.Resources).filter((ref) => !ref.startsWith('AWS::') && !(ref in hostTemplate.Resources) && !(ref in (hostTemplate.Parameters ?? {})));
    expect(unknownRefs).toEqual([]);
    expect(recordedAssetHashOf(assembly, top, host.templateFile)).toEqual(nestedTemplateHash(assembly.directory, host.templateFile));
  });
});

describe('annotations inside a StackSetStack', () => {
  const warningId = '@aws-cdk/test:stackSetWarning';

  function annotate(construct: Construct) {
    CoreAnnotations.of(construct).addError('an error inside');
    CoreAnnotations.of(construct).addWarningV2(warningId, 'a warning inside');
    CoreAnnotations.of(construct).addInfo('an info inside');
  }

  function expectAnnotations(stack: Stack, constructPath: string) {
    const annotations = Annotations.fromStack(stack);
    annotations.hasError(constructPath, 'an error inside');
    annotations.hasWarning(constructPath, Match.stringLikeRegexp('^a warning inside'));
    annotations.hasInfo(constructPath, 'an info inside');
  }

  function expectNoAnnotations(stack: Stack) {
    const annotations = Annotations.fromStack(stack);
    annotations.hasNoError('*', Match.stringLikeRegexp('inside'));
    annotations.hasNoWarning('*', Match.stringLikeRegexp('inside'));
    annotations.hasNoInfo('*', Match.stringLikeRegexp('inside'));
  }

  function metadataTypesUnder(assembly: cxapi.CloudAssembly, stack: Stack, constructPath: string): string[] {
    const metadata: Record<string, cxschema.MetadataEntry[]> = JSON.parse(readFile(assembly.directory, `${stack.artifactId}.metadata.json`));
    return Object.entries(metadata)
      .filter(([key]) => key === constructPath || key.startsWith(`${constructPath}/`))
      .flatMap(([, entries]) => entries.map((entry) => entry.type));
  }

  test('appear in each consumer stack and not in a non-consuming parent stack', () => {
    const app = new App();
    const parent = new Stack(app, 'Parent');
    const stackSetStack = new StackSetStack(parent, 'StackSetStack');
    const topic = new sns.Topic(stackSetStack, 'Topic');
    annotate(topic);
    const first = new Stack(app, 'First');
    const second = new Stack(app, 'Second');
    newStackSet(first, 'StackSet', stackSetStack);
    newStackSet(second, 'StackSet', stackSetStack);

    expectAnnotations(first, '/Parent/StackSetStack/Topic');
    expectAnnotations(second, '/Parent/StackSetStack/Topic');
    expectNoAnnotations(parent);
  });

  test('appear in a consumer stack when the StackSetStack is at App scope', () => {
    const app = new App();
    const stackSetStack = new StackSetStack(app, 'StackSetStack');
    annotate(stackSetStack);
    const consumer = new Stack(app, 'Consumer');
    newStackSet(consumer, 'StackSet', stackSetStack);

    expectAnnotations(consumer, '/StackSetStack');
  });

  test('appear in the top-level stack of a nested stack that consumes the StackSetStack', () => {
    const app = new App();
    const stackSetStack = new StackSetStack(app, 'StackSetStack');
    annotate(new sns.Topic(stackSetStack, 'Topic'));
    const top = new Stack(app, 'Top');
    newStackSet(new NestedStack(top, 'Nested'), 'StackSet', stackSetStack);

    expectAnnotations(top, '/StackSetStack/Topic');
  });

  test('appear in a consumer stack when added in a nested stack of the StackSetStack', () => {
    const app = new App();
    const consumer = new Stack(app, 'Consumer');
    const stackSetStack = new StackSetStack(app, 'StackSetStack', {
      assetBuckets: [s3.Bucket.fromBucketName(consumer, 'AssetBucket', 'prefix-us-east-1')],
      assetBucketPrefix: 'prefix',
    });
    annotate(new sns.Topic(new NestedStack(stackSetStack, 'Nested'), 'Topic'));
    newStackSet(consumer, 'StackSet', stackSetStack);

    expectAnnotations(consumer, '/StackSetStack/Nested/Topic');
  });

  test('are copied with the error code of an error, and without other metadata of the StackSetStack', () => {
    const app = new App({ context: { [cxapi.DISABLE_CREATION_STACK_TRACES]: false } });
    const stackSetStack = new StackSetStack(app, 'StackSetStack');
    const topic = new sns.Topic(stackSetStack, 'Topic');
    CoreAnnotations.of(topic)._addTrackableError(lit`MyErrorCode`, 'an error inside');
    const consumer = new Stack(app, 'Consumer');
    newStackSet(consumer, 'StackSet', stackSetStack);

    const assembly = app.synth();

    expect(topic.node.defaultChild!.node.metadata.map((entry) => entry.type)).toContain(cxschema.ArtifactMetadataEntryType.LOGICAL_ID);
    expect(new Set(metadataTypesUnder(assembly, consumer, '/StackSetStack'))).toEqual(new Set(['aws:cdk:error', 'aws:cdk:error-code']));
    Annotations.fromStack(consumer).hasError('/StackSetStack/Topic', 'an error inside');
  });

  test('of a StackSetStack without a consumer appear nowhere', () => {
    const app = new App();
    const parent = new Stack(app, 'Parent');
    annotate(new StackSetStack(parent, 'StackSetStack'));

    expectNoAnnotations(parent);
  });

  test.each([
    ['the StackSetStack', (stackSetStack: StackSetStack): Construct => stackSetStack],
    ['an ancestor of the StackSetStack', (stackSetStack: StackSetStack): Construct => stackSetStack.node.scope!],
    ['the construct with the warning', (stackSetStack: StackSetStack): Construct => stackSetStack.node.findChild('Topic')],
  ])('warnings acknowledged on %s are removed from every consumer stack', (_name, acknowledgeOn) => {
    const app = new App();
    const stackSetStack = new StackSetStack(new Construct(app, 'Group'), 'StackSetStack');
    annotate(new sns.Topic(stackSetStack, 'Topic'));
    const first = new Stack(app, 'First');
    const second = new Stack(app, 'Second');
    newStackSet(first, 'StackSet', stackSetStack);
    newStackSet(second, 'StackSet', stackSetStack);

    CoreAnnotations.of(acknowledgeOn(stackSetStack)).acknowledgeWarning(warningId);

    for (const consumer of [first, second]) {
      Annotations.fromStack(consumer).hasNoWarning('*', Match.stringLikeRegexp('inside'));
      Annotations.fromStack(consumer).hasError('/Group/StackSetStack/Topic', 'an error inside');
    }
  });

  test('warnings acknowledged on a consumer stack that is not an ancestor remain', () => {
    const app = new App();
    const stackSetStack = new StackSetStack(app, 'StackSetStack');
    annotate(stackSetStack);
    const consumer = new Stack(app, 'Consumer');
    newStackSet(consumer, 'StackSet', stackSetStack);

    CoreAnnotations.of(consumer).acknowledgeWarning(warningId);

    Annotations.fromStack(consumer).hasWarning('/StackSetStack', Match.stringLikeRegexp('^a warning inside'));
  });
});
