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
  Stack,
  Stage,
  Token,
  Validations,
} from '../../core';
import type { StackSynthesizer } from '../../core';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from '../../custom-resources';
import * as cxapi from '../../cx-api';
import type { OperationPreferences, StackSetStackProps } from '../lib';
import {
  DeploymentType,
  RegionConcurrencyType,
  StackSet,
  StackSetAccountFilter,
  StackSetConcurrencyMode,
  StackSetFailureTolerance,
  StackSetMaxConcurrency,
  StackSetAutoDeployment,
  StackSetCallAs,
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
    target: StackSetTarget.fromOrganizationalUnits({
      regions: ['us-east-1'],
      organizationalUnits: ['ou-1111111'],
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
        OrganizationalUnitIds: ['ou-1111111'],
        AccountFilterType: 'NONE',
      },
    }],
  });
});

test('service managed stackset with options', () => {
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
      callAs: StackSetCallAs.SELF,
      autoDeployment: StackSetAutoDeployment.disabled(),
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
        OrganizationalUnitIds: ['ou-1111111'],
        AccountFilterType: 'NONE',
      },
    }],
  });
});

describe('service managed stackset auto-deployment', () => {
  test.each([
    ['is not set', undefined, { Enabled: true, RetainStacksOnAccountRemoval: true }],
    ['is enabled()', StackSetAutoDeployment.enabled(), { Enabled: true, RetainStacksOnAccountRemoval: true }],
    [
      'is enabled and retains stacks',
      StackSetAutoDeployment.enabled({ retainStacksOnAccountRemoval: true }),
      { Enabled: true, RetainStacksOnAccountRemoval: true },
    ],
    [
      'is enabled and does not retain stacks',
      StackSetAutoDeployment.enabled({ retainStacksOnAccountRemoval: false }),
      { Enabled: true, RetainStacksOnAccountRemoval: false },
    ],
    ['is disabled', StackSetAutoDeployment.disabled(), { Enabled: false }],
  ])('renders AutoDeployment when it %s', (_description, autoDeployment, expected) => {
    const app = new App();
    const stack = new Stack(app);

    new StackSet(stack, 'StackSet', {
      target: StackSetTarget.fromOrganizationalUnits({
        regions: ['us-east-1'],
        organizationalUnits: ['ou-1111111'],
      }),
      deploymentType: DeploymentType.serviceManaged({ autoDeployment }),
      template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
      AutoDeployment: Match.objectEquals(expected),
    });
  });
});

describe('service managed stackset call-as', () => {
  test.each([
    ['is not set', undefined, 'DELEGATED_ADMIN'],
    ['is DELEGATED_ADMIN', StackSetCallAs.DELEGATED_ADMIN, 'DELEGATED_ADMIN'],
    ['is SELF', StackSetCallAs.SELF, 'SELF'],
    ['is a custom value', StackSetCallAs.of('SELF'), 'SELF'],
  ])('renders CallAs when it %s', (_description, callAs, expected) => {
    const app = new App();
    const stack = new Stack(app);

    new StackSet(stack, 'StackSet', {
      target: StackSetTarget.fromOrganizationalUnits({
        regions: ['us-east-1'],
        organizationalUnits: ['ou-1111111'],
      }),
      deploymentType: DeploymentType.serviceManaged({ callAs }),
      template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
      CallAs: expected,
    });
  });
});

test('self managed stackset renders neither AutoDeployment nor CallAs', () => {
  const app = new App();
  const stack = new Stack(app);

  new StackSet(stack, 'StackSet', {
    target: StackSetTarget.fromAccounts({
      regions: ['us-east-1'],
      accounts: ['11111111111'],
    }),
    deploymentType: DeploymentType.selfManaged(),
    template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
    PermissionModel: 'SELF_MANAGED',
    AutoDeployment: Match.absent(),
    CallAs: Match.absent(),
  });
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
      callAs: StackSetCallAs.SELF,
      autoDeployment: StackSetAutoDeployment.disabled(),
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

describe('organizational unit account filters', () => {
  function deploymentTargetsOf(accountFilter?: StackSetAccountFilter) {
    const app = new App();
    const stack = new Stack(app);
    new StackSet(stack, 'StackSet', {
      target: StackSetTarget.fromOrganizationalUnits({
        regions: ['us-east-1'],
        organizationalUnits: ['ou-1111111'],
        accountFilter,
      }),
      deploymentType: DeploymentType.serviceManaged(),
      template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
    });
    const stackSets = Template.fromStack(stack).findResources('AWS::CloudFormation::StackSet');
    return Object.values(stackSets)[0].Properties.StackInstancesGroup[0].DeploymentTargets;
  }

  test.each([
    ['no filter', undefined, { OrganizationalUnitIds: ['ou-1111111'], AccountFilterType: 'NONE' }],
    ['intersection', StackSetAccountFilter.intersection(['222222222222', '333333333333']), {
      OrganizationalUnitIds: ['ou-1111111'],
      AccountFilterType: 'INTERSECTION',
      Accounts: ['222222222222', '333333333333'],
    }],
    ['difference', StackSetAccountFilter.difference(['222222222222', '333333333333']), {
      OrganizationalUnitIds: ['ou-1111111'],
      AccountFilterType: 'DIFFERENCE',
      Accounts: ['222222222222', '333333333333'],
    }],
  ])('%s renders the matching account filter type', (_name, accountFilter, expected) => {
    expect(deploymentTargetsOf(accountFilter)).toEqual(expected);
  });

  test.each([
    ['intersection', StackSetAccountFilter.intersection],
    ['difference', StackSetAccountFilter.difference],
  ])('%s accepts a tokenized account list', (_name, factory) => {
    const app = new App();
    const stack = new Stack(app);
    const accounts = new CfnParameter(stack, 'Accounts', { type: 'CommaDelimitedList' }).valueAsList;
    new StackSet(stack, 'StackSet', {
      target: StackSetTarget.fromOrganizationalUnits({
        regions: ['us-east-1'],
        organizationalUnits: ['ou-1111111'],
        accountFilter: factory(accounts),
      }),
      deploymentType: DeploymentType.serviceManaged(),
      template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
    });

    expect(Token.isUnresolved(accounts)).toBe(true);
    Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
      StackInstancesGroup: [{
        DeploymentTargets: {
          OrganizationalUnitIds: ['ou-1111111'],
          Accounts: { Ref: 'Accounts' },
        },
      }],
    });
  });

  test('fromOrganizationalUnits accepts a tokenized organizational unit list', () => {
    const app = new App();
    const stack = new Stack(app);
    const organizationalUnits = new CfnParameter(stack, 'OrganizationalUnits', { type: 'CommaDelimitedList' }).valueAsList;
    new StackSet(stack, 'StackSet', {
      target: StackSetTarget.fromOrganizationalUnits({
        regions: ['us-east-1'],
        organizationalUnits,
      }),
      deploymentType: DeploymentType.serviceManaged(),
      template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
    });

    expect(Token.isUnresolved(organizationalUnits)).toBe(true);
    Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
      StackInstancesGroup: [{
        DeploymentTargets: {
          OrganizationalUnitIds: { Ref: 'OrganizationalUnits' },
          AccountFilterType: 'NONE',
        },
      }],
    });
  });

  test('a service managed StackSet renders an organizational unit target added with addTarget', () => {
    const app = new App();
    const stack = new Stack(app);
    const stackSet = new StackSet(stack, 'StackSet', {
      target: StackSetTarget.fromOrganizationalUnits({
        regions: ['us-east-1'],
        organizationalUnits: ['ou-1111111'],
      }),
      deploymentType: DeploymentType.serviceManaged(),
      template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
    });

    stackSet.addTarget(StackSetTarget.fromOrganizationalUnits({
      regions: ['us-west-2'],
      organizationalUnits: ['ou-2222222'],
      accountFilter: StackSetAccountFilter.intersection(['333333333333']),
    }));

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
      StackInstancesGroup: [
        {
          Regions: ['us-east-1'],
          DeploymentTargets: { OrganizationalUnitIds: ['ou-1111111'], AccountFilterType: 'NONE' },
        },
        {
          Regions: ['us-west-2'],
          DeploymentTargets: {
            OrganizationalUnitIds: ['ou-2222222'],
            AccountFilterType: 'INTERSECTION',
            Accounts: ['333333333333'],
          },
        },
      ],
    });
  });
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
      regionConcurrencyType: RegionConcurrencyType.PARALLEL,
      regionOrder: ['us-east-1', 'us-west-2'],
      maxConcurrency: StackSetMaxConcurrency.percentage(50),
      failureTolerance: StackSetFailureTolerance.count(1),
      concurrencyMode: StackSetConcurrencyMode.SOFT_FAILURE_TOLERANCE,
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
    ManagedExecution: { Active: true },
    PermissionModel: 'SELF_MANAGED',
    OperationPreferences: {
      RegionConcurrencyType: 'PARALLEL',
      RegionOrder: ['us-east-1', 'us-west-2'],
      MaxConcurrentPercentage: 50,
      FailureToleranceCount: 1,
      ConcurrencyMode: 'SOFT_FAILURE_TOLERANCE',
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

describe('StackSet operation preferences values', () => {
  function renderOperationPreferences(operationPreferences: OperationPreferences) {
    const app = new App();
    const stack = new Stack(app);

    new StackSet(stack, 'StackSet', {
      template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
      operationPreferences,
    });
    return stack;
  }

  test.each([
    ['count', StackSetFailureTolerance.count(2), { FailureToleranceCount: 2, FailureTolerancePercentage: Match.absent() }],
    ['percentage', StackSetFailureTolerance.percentage(25), { FailureTolerancePercentage: 25, FailureToleranceCount: Match.absent() }],
  ])('renders only the failure tolerance %s key', (_kind, failureTolerance, expected) => {
    const stack = renderOperationPreferences({ failureTolerance });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
      OperationPreferences: expected,
    });
  });

  test.each([
    ['count', StackSetMaxConcurrency.count(3), { MaxConcurrentCount: 3, MaxConcurrentPercentage: Match.absent() }],
    ['percentage', StackSetMaxConcurrency.percentage(40), { MaxConcurrentPercentage: 40, MaxConcurrentCount: Match.absent() }],
  ])('renders only the max concurrency %s key', (_kind, maxConcurrency, expected) => {
    const stack = renderOperationPreferences({ maxConcurrency });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
      OperationPreferences: expected,
    });
  });

  test.each([
    ['STRICT_FAILURE_TOLERANCE', StackSetConcurrencyMode.STRICT_FAILURE_TOLERANCE],
    ['SOFT_FAILURE_TOLERANCE', StackSetConcurrencyMode.SOFT_FAILURE_TOLERANCE],
  ])('renders the %s concurrency mode', (expected, concurrencyMode) => {
    const stack = renderOperationPreferences({ concurrencyMode });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
      OperationPreferences: { ConcurrencyMode: expected },
    });
  });

  test('passes a custom concurrency mode from of() through to the template', () => {
    const stack = renderOperationPreferences({ concurrencyMode: StackSetConcurrencyMode.of('CUSTOM') });
    Validations.of(stack).acknowledge({ id: 'CloudFormation-Validate::W3030', reason: 'of() accepts values newer than the CloudFormation schema' });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
      OperationPreferences: { ConcurrencyMode: 'CUSTOM' },
    });
  });

  test.each([
    ['failure tolerance count 0', () => ({ failureTolerance: StackSetFailureTolerance.count(0) }), { FailureToleranceCount: 0 }],
    ['failure tolerance percentage 0', () => ({ failureTolerance: StackSetFailureTolerance.percentage(0) }), { FailureTolerancePercentage: 0 }],
    ['failure tolerance percentage 100', () => ({ failureTolerance: StackSetFailureTolerance.percentage(100) }), { FailureTolerancePercentage: 100 }],
    ['max concurrency count 1', () => ({ maxConcurrency: StackSetMaxConcurrency.count(1) }), { MaxConcurrentCount: 1 }],
    ['max concurrency percentage 1', () => ({ maxConcurrency: StackSetMaxConcurrency.percentage(1) }), { MaxConcurrentPercentage: 1 }],
    ['max concurrency percentage 100', () => ({ maxConcurrency: StackSetMaxConcurrency.percentage(100) }), { MaxConcurrentPercentage: 100 }],
  ])('accepts the boundary value %s', (_kind, operationPreferences, expected) => {
    const stack = renderOperationPreferences(operationPreferences());

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
      OperationPreferences: expected,
    });
  });

  test.each([
    ['failure tolerance count', (value: number) => ({ failureTolerance: StackSetFailureTolerance.count(value) }), 'FailureToleranceCount'],
    ['failure tolerance percentage', (value: number) => ({ failureTolerance: StackSetFailureTolerance.percentage(value) }), 'FailureTolerancePercentage'],
    ['max concurrency count', (value: number) => ({ maxConcurrency: StackSetMaxConcurrency.count(value) }), 'MaxConcurrentCount'],
    ['max concurrency percentage', (value: number) => ({ maxConcurrency: StackSetMaxConcurrency.percentage(value) }), 'MaxConcurrentPercentage'],
  ])('accepts a token for the %s', (_kind, operationPreferences, key) => {
    const app = new App();
    const stack = new Stack(app);
    const value = new CfnParameter(stack, 'Value', { type: 'Number' });

    new StackSet(stack, 'StackSet', {
      template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
      operationPreferences: operationPreferences(Token.asNumber(value.valueAsNumber)),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
      OperationPreferences: { [key]: { Ref: 'Value' } },
    });
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
    new LambdaStackSet(stack, 'AssetStack', {
      assetBuckets: [s3.Bucket.fromBucketName(stack, 'AssetBucket', 'imported-us-east-1')],
      assetBucketPrefix: 'imported',
    });

    Annotations.fromStack(stack).hasWarning('/Default', Match.stringLikeRegexp(
      '^Bucket Policy Permissions cannot be added to referenced Bucket.*\\[ack: @aws-cdk/aws-cloudformation:stackSetAssetsBucketPermissions\\]',
    ));
  });

  test('the referenced asset bucket warning can be acknowledged on the parent stack', () => {
    const app = new App();
    const stack = new Stack(app);
    new LambdaStackSet(stack, 'AssetStack', {
      assetBuckets: [s3.Bucket.fromBucketName(stack, 'AssetBucket', 'imported-us-east-1')],
      assetBucketPrefix: 'imported',
    });

    CoreAnnotations.of(stack).acknowledgeWarning('@aws-cdk/aws-cloudformation:stackSetAssetsBucketPermissions');

    Annotations.fromStack(stack).hasNoWarning('*', Match.stringLikeRegexp('Bucket Policy Permissions'));
  });
});

describe('StackSet self managed admin role', () => {
  test('is created within the StackSet scope', () => {
    const app = new App();
    const stack = new Stack(app);

    const stackSet = new StackSet(stack, 'StackSet', {
      template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
    });

    expect(stackSet.adminRole).toBeDefined();
    expect(stackSet.node.tryFindChild('AdminRole')).toBe(stackSet.adminRole);
    expect(stack.node.tryFindChild('AdminRole')).toBeUndefined();
  });

  test('adminRole is the supplied admin role', () => {
    const app = new App();
    const stack = new Stack(app);
    const adminRole = iam.Role.fromRoleArn(stack, 'AdminRole', 'arn:aws:iam::123456789012:role/StackSetAdmin');

    const stackSet = new StackSet(stack, 'StackSet', {
      template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
      deploymentType: DeploymentType.selfManaged({ adminRole }),
    });

    expect(stackSet.adminRole).toBe(adminRole);
    expect(stackSet.node.tryFindChild('AdminRole')).toBeUndefined();
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

test('a service managed StackSet has no admin role', () => {
  const app = new App();
  const stack = new Stack(app);

  const stackSet = new StackSet(stack, 'StackSet', {
    target: StackSetTarget.fromOrganizationalUnits({
      regions: ['us-east-1'],
      organizationalUnits: ['ou-1111111'],
    }),
    deploymentType: DeploymentType.serviceManaged(),
    template: StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack')),
  });

  expect(stackSet.adminRole).toBeUndefined();
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

  test('fromStackSetId returns a StackSet with the given id and no admin role', () => {
    const stack = new Stack();

    const imported = StackSet.fromStackSetId(stack, 'Imported', stackSetId);

    expect(imported.stackSetId).toEqual(stackSetId);
    expect(imported.stackSetRef.stackSetId).toEqual(stackSetId);
    expect(imported).not.toHaveProperty('adminRole');
  });

  test('fromStackSetArn takes the id, account and region from the ARN', () => {
    const stack = new Stack();

    const imported = StackSet.fromStackSetArn(stack, 'Imported',
      `arn:aws:cloudformation:us-west-2:123456789012:stackset/${stackSetId}`);

    expect(imported.stackSetId).toEqual(stackSetId);
    expect(imported.stackSetRef.stackSetId).toEqual(stackSetId);
    expect(imported.env).toEqual({ account: '123456789012', region: 'us-west-2' });
    expect(imported).not.toHaveProperty('adminRole');
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

describe('StackSet validation errors', () => {
  function templateIn(stack: Stack) {
    return StackSetTemplate.fromStackSetStack(new StackSetStack(stack, 'Stack'));
  }

  test.each([
    [-1, 'StackSetFailureToleranceCountInvalid', 'failure tolerance count must be an integer greater than or equal to 0, got -1', (value: number) => StackSetFailureTolerance.count(value)],
    [1.5, 'StackSetFailureToleranceCountInvalid', 'failure tolerance count must be an integer greater than or equal to 0, got 1.5', (value: number) => StackSetFailureTolerance.count(value)],
    [-1, 'StackSetFailureTolerancePercentageInvalid', 'failure tolerance percentage must be an integer from 0 to 100, got -1', (value: number) => StackSetFailureTolerance.percentage(value)],
    [101, 'StackSetFailureTolerancePercentageInvalid', 'failure tolerance percentage must be an integer from 0 to 100, got 101', (value: number) => StackSetFailureTolerance.percentage(value)],
    [12.5, 'StackSetFailureTolerancePercentageInvalid', 'failure tolerance percentage must be an integer from 0 to 100, got 12.5', (value: number) => StackSetFailureTolerance.percentage(value)],
    [0, 'StackSetMaxConcurrencyCountInvalid', 'max concurrency count must be an integer greater than or equal to 1, got 0', (value: number) => StackSetMaxConcurrency.count(value)],
    [2.5, 'StackSetMaxConcurrencyCountInvalid', 'max concurrency count must be an integer greater than or equal to 1, got 2.5', (value: number) => StackSetMaxConcurrency.count(value)],
    [0, 'StackSetMaxConcurrencyPercentageInvalid', 'max concurrency percentage must be an integer from 1 to 100, got 0', (value: number) => StackSetMaxConcurrency.percentage(value)],
    [101, 'StackSetMaxConcurrencyPercentageInvalid', 'max concurrency percentage must be an integer from 1 to 100, got 101', (value: number) => StackSetMaxConcurrency.percentage(value)],
  ])('fails with an error code when the operation preference value is %d (%s)', (value, name, message, factory) => {
    expect(() => factory(value)).toThrow(expect.objectContaining({ name, message }));
  });

  test('fails with an error code when fromAccounts has no accounts', () => {
    expect(() => StackSetTarget.fromAccounts({ regions: ['us-east-1'], accounts: [] })).toThrow(expect.objectContaining({
      name: 'StackSetAccountsRequired',
      message: 'fromAccounts requires at least one account',
    }));
  });

  test.each([
    ['no', []],
    ['a missing list of', undefined as unknown as string[]],
  ])('fails with an error code when fromOrganizationalUnits has %s organizational units', (_name, organizationalUnits) => {
    expect(() => StackSetTarget.fromOrganizationalUnits({ regions: ['us-east-1'], organizationalUnits })).toThrow(expect.objectContaining({
      name: 'StackSetOrganizationalUnitsRequired',
      message: 'fromOrganizationalUnits requires at least one organizational unit',
    }));
  });

  test.each([
    ['intersection', StackSetAccountFilter.intersection],
    ['difference', StackSetAccountFilter.difference],
  ])('fails with an error code when the %s account filter has no accounts', (name, factory) => {
    expect(() => factory([])).toThrow(expect.objectContaining({
      name: 'StackSetAccountFilterAccountsRequired',
      message: `StackSetAccountFilter.${name}() requires at least one account, omit 'accountFilter' to deploy to every account in the organizational units`,
    }));
  });

  const organizationalUnitsTarget = () => StackSetTarget.fromOrganizationalUnits({
    regions: ['us-east-1'],
    organizationalUnits: ['ou-1111111'],
  });
  const accountsTarget = () => StackSetTarget.fromAccounts({
    regions: ['us-east-1'],
    accounts: ['111111111111'],
  });
  const selfManagedCannotHaveOrganizationalUnits = expect.objectContaining({
    name: 'StackSetSelfManagedCannotHaveOrganizationalUnits',
    message: 'a self managed StackSet cannot deploy to organizational units ["ou-1111111"], set \'deploymentType: DeploymentType.serviceManaged\' or use StackSetTarget.fromAccounts',
    constructPath: 'Default/StackSet',
  });
  const serviceManagedRequiresOrganizationalUnits = expect.objectContaining({
    name: 'StackSetServiceManagedRequiresOrganizationalUnits',
    message: 'a service managed StackSet cannot deploy without organizational units, use StackSetTarget.fromOrganizationalUnits or set \'deploymentType: DeploymentType.selfManaged\'',
    constructPath: 'Default/StackSet',
  });

  test.each([
    ['the default', undefined],
    ['an explicit self managed', DeploymentType.selfManaged()],
  ])('fails with an error code when %s deployment type gets an organizational unit target prop', (_name, deploymentType) => {
    const app = new App();
    const stack = new Stack(app);

    expect(() => new StackSet(stack, 'StackSet', {
      deploymentType,
      target: organizationalUnitsTarget(),
      template: templateIn(stack),
    })).toThrow(selfManagedCannotHaveOrganizationalUnits);
  });

  test.each([
    ['the default', undefined],
    ['an explicit self managed', DeploymentType.selfManaged()],
  ])('fails with an error code when %s deployment type gets an organizational unit target from addTarget', (_name, deploymentType) => {
    const app = new App();
    const stack = new Stack(app);
    const stackSet = new StackSet(stack, 'StackSet', {
      deploymentType,
      template: templateIn(stack),
    });

    expect(() => stackSet.addTarget(organizationalUnitsTarget())).toThrow(selfManagedCannotHaveOrganizationalUnits);
  });

  test('fails with an error code when a service managed StackSet gets an accounts target prop', () => {
    const app = new App();
    const stack = new Stack(app);

    expect(() => new StackSet(stack, 'StackSet', {
      deploymentType: DeploymentType.serviceManaged(),
      target: accountsTarget(),
      template: templateIn(stack),
    })).toThrow(serviceManagedRequiresOrganizationalUnits);
  });

  test('fails with an error code when a service managed StackSet gets an accounts target from addTarget', () => {
    const app = new App();
    const stack = new Stack(app);
    const stackSet = new StackSet(stack, 'StackSet', {
      deploymentType: DeploymentType.serviceManaged(),
      template: templateIn(stack),
    });

    expect(() => stackSet.addTarget(accountsTarget())).toThrow(serviceManagedRequiresOrganizationalUnits);
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

  test('fails with an error code when a StackSetStack is not defined within a stack', () => {
    const app = new App();

    expect(() => new StackSetStack(app, 'Stack')).toThrow(expect.objectContaining({
      name: 'StackSetStackMustBeDefinedWithinStack',
      message: 'a StackSetStack must be defined within the scope of another non-stackset stack',
    }));
  });
});
