import fs from 'fs';
import path from 'path';
import { Construct } from 'constructs';
import { Annotations, Match, Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as lambda from '../../aws-lambda';
import * as organizations from '../../aws-organizations';
import * as s3 from '../../aws-s3';
import * as sns from '../../aws-sns';
import * as core from '../../core';
import {
  Annotations as CoreAnnotations,
  App,
  CfnCapabilities,
  CfnOutput,
  CfnParameter,
  LegacyStackSynthesizer,
  NestedStack,
  RemovalPolicy,
  Stack,
  Stage,
  Token,
  Tags,
  Validations,
} from '../../core';
import * as cxapi from '../../cx-api';
import type { OperationPreferences, StackSetProps } from '../lib';
import {
  DeploymentType,
  RegionConcurrencyType,
  StackSet,
  StackSetAccountFilter,
  StackSetAssetBuckets,
  StackSetConcurrencyMode,
  StackSetFailureTolerance,
  StackSetMaxConcurrency,
  StackSetAutoDeployment,
  StackSetCallAs,
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
 * The hashes of the template assets of a StackSet in the asset manifest of its host stack
 */
function templateAssetHashes(app: App, hostStack: Stack, stackSet: StackSet): string[] {
  const manifest = JSON.parse(fs.readFileSync(path.join(app.synth().directory, `${hostStack.artifactId}.assets.json`), 'utf-8'));
  return Object.entries(manifest.files)
    .filter(([, file]: [string, any]) => file.source.path === stackSet.templateFile)
    .map(([hash]) => hash);
}

test('stackset with parameters', () => {
  const app = new App();
  const stack = new Stack(app);

  new StackSet(stack, 'StackSet', {
    targets: [StackSetTarget.fromAccounts({
      regions: ['us-east-1'],
      accounts: ['11111111111'],
    })],
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

test('a default StackSet is self managed, with an admin role', () => {
  const app = new App();
  const stack = new Stack(app);

  new StackSet(stack, 'StackSet', {
    targets: [StackSetTarget.fromAccounts({
      regions: ['us-east-1'],
      accounts: ['11111111111'],
      parameterOverrides: {
        Param1: 'Value1',
      },
    })],
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
    targets: [StackSetTarget.fromAccounts({
      regions: ['us-east-1', 'af-south-1'],
      accounts: ['11111111111'],
      parameterOverrides: {
        Param1: 'Value1',
      },
    })],
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
    targets: [StackSetTarget.fromOrganizationalUnits({
      regions: ['us-east-1'],
      organizationalUnits: ['ou-1111111'],
      parameterOverrides: {
        Param1: 'Value1',
      },
    })],
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
        OrganizationalUnitIds: ['ou-1111111'],
        AccountFilterType: 'NONE',
      },
    }],
  });
});

test('renders callAs and autoDeployment set together', () => {
  const app = new App();
  const stack = new Stack(app);

  new StackSet(stack, 'StackSet', {
    targets: [StackSetTarget.fromOrganizationalUnits({
      regions: ['us-east-1'],
      organizationalUnits: ['ou-1111111'],
    })],
    deploymentType: DeploymentType.serviceManaged({
      callAs: StackSetCallAs.SELF,
      autoDeployment: StackSetAutoDeployment.disabled(),
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
    CallAs: 'SELF',
    AutoDeployment: Match.objectEquals({ Enabled: false }),
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
      targets: [StackSetTarget.fromOrganizationalUnits({
        regions: ['us-east-1'],
        organizationalUnits: ['ou-1111111'],
      })],
      deploymentType: DeploymentType.serviceManaged({ autoDeployment }),
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
    ['is a custom value', StackSetCallAs.of('CUSTOM_VALUE'), 'CUSTOM_VALUE'],
  ])('renders CallAs when it %s', (_description, callAs, expected) => {
    const app = new App();
    const stack = new Stack(app);

    new StackSet(stack, 'StackSet', {
      targets: [StackSetTarget.fromOrganizationalUnits({
        regions: ['us-east-1'],
        organizationalUnits: ['ou-1111111'],
      })],
      deploymentType: DeploymentType.serviceManaged({ callAs }),
    });
    Validations.of(stack).acknowledge({ id: 'CloudFormation-Validate::W3030', reason: 'of() accepts values newer than the CloudFormation schema' });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
      CallAs: expected,
    });
  });
});

test('self managed stackset renders neither AutoDeployment nor CallAs', () => {
  const app = new App();
  const stack = new Stack(app);

  new StackSet(stack, 'StackSet', {
    targets: [StackSetTarget.fromAccounts({
      regions: ['us-east-1'],
      accounts: ['11111111111'],
    })],
    deploymentType: DeploymentType.selfManaged(),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
    PermissionModel: 'SELF_MANAGED',
    AutoDeployment: Match.absent(),
    CallAs: Match.absent(),
  });
});

describe('organizational unit account filters', () => {
  function deploymentTargetsOf(accountFilter?: StackSetAccountFilter) {
    const app = new App();
    const stack = new Stack(app);
    new StackSet(stack, 'StackSet', {
      targets: [StackSetTarget.fromOrganizationalUnits({
        regions: ['us-east-1'],
        organizationalUnits: ['ou-1111111'],
        accountFilter,
      })],
      deploymentType: DeploymentType.serviceManaged(),
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
      targets: [StackSetTarget.fromOrganizationalUnits({
        regions: ['us-east-1'],
        organizationalUnits: ['ou-1111111'],
        accountFilter: factory(accounts),
      })],
      deploymentType: DeploymentType.serviceManaged(),
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

  test('fromOrganizationalUnits deploys to the organization root ID', () => {
    const app = new App();
    const stack = new Stack(app);
    new StackSet(stack, 'StackSet', {
      targets: [StackSetTarget.fromOrganizationalUnits({
        regions: ['us-east-1'],
        organizationalUnits: ['r-a1b2'],
      })],
      deploymentType: DeploymentType.serviceManaged(),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
      StackInstancesGroup: [{
        DeploymentTargets: {
          OrganizationalUnitIds: ['r-a1b2'],
          AccountFilterType: 'NONE',
        },
      }],
    });
  });

  test('fromOrganizationalUnits renders the ID of an organizational unit created in the app', () => {
    const app = new App();
    const stack = new Stack(app);
    const organizationalUnit = new organizations.CfnOrganizationalUnit(stack, 'OrganizationalUnit', {
      name: 'Workloads',
      parentId: 'r-a1b2',
    });
    new StackSet(stack, 'StackSet', {
      targets: [StackSetTarget.fromOrganizationalUnits({
        regions: ['us-east-1'],
        organizationalUnits: [organizationalUnit.attrId],
      })],
      deploymentType: DeploymentType.serviceManaged(),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
      StackInstancesGroup: [{
        DeploymentTargets: {
          OrganizationalUnitIds: [{ 'Fn::GetAtt': [stack.getLogicalId(organizationalUnit), 'Id'] }],
          AccountFilterType: 'NONE',
        },
      }],
    });
  });

  test('a service managed StackSet renders an organizational unit target added with addTarget', () => {
    const app = new App();
    const stack = new Stack(app);
    const stackSet = new StackSet(stack, 'StackSet', {
      targets: [StackSetTarget.fromOrganizationalUnits({
        regions: ['us-east-1'],
        organizationalUnits: ['ou-1111111'],
      })],
      deploymentType: DeploymentType.serviceManaged(),
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
    targets: [StackSetTarget.fromAccounts({
      regions: ['us-east-1'],
      accounts: ['11111111111'],
      parameterOverrides: {
        Param1: 'Value1',
      },
    })],
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
    StackInstancesGroup: Match.absent(),
  });
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

describe('generated StackSet name', () => {
  function generatedNameOf(scopeOf: (stack: Stack) => Construct) {
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    new StackSet(scopeOf(stack), 'StackSet', {});
    const stackSets = Template.fromStack(stack).findResources('AWS::CloudFormation::StackSet');
    return Object.values(stackSets)[0].Properties.StackSetName;
  }

  test('is derived from the construct path when stackSetName is not set', () => {
    expect(generatedNameOf((stack) => stack)).toEqual('MyStackStackSet88E170D0');
  });

  test('is at most 128 characters for a long construct path', () => {
    const name = generatedNameOf((stack) => {
      let scope: Construct = stack;
      for (let i = 0; i < 3; i++) {
        scope = new Construct(scope, `Level${i}${'x'.repeat(60)}`);
      }
      return scope;
    });

    expect(name.length).toBeLessThanOrEqual(128);
    expect(name).toMatch(/^[a-zA-Z][a-zA-Z0-9-]{0,127}$/);
  });
});

describe('StackSet targets prop', () => {
  function stackInstancesGroupOf(stack: Stack) {
    const stackSets = Template.fromStack(stack).findResources('AWS::CloudFormation::StackSet');
    return Object.values(stackSets)[0].Properties.StackInstancesGroup;
  }

  test('renders one group of stack instances per accounts target, in order', () => {
    const app = new App();
    const stack = new Stack(app);

    new StackSet(stack, 'StackSet', {
      targets: [
        StackSetTarget.fromAccounts({
          regions: ['us-east-1'],
          accounts: ['111111111111'],
          parameterOverrides: { Param1: 'Value1' },
        }),
        StackSetTarget.fromAccounts({
          regions: ['eu-west-1', 'us-west-2'],
          accounts: ['222222222222', '333333333333'],
        }),
      ],
    });

    expect(stackInstancesGroupOf(stack)).toEqual([
      {
        Regions: ['us-east-1'],
        DeploymentTargets: { Accounts: ['111111111111'] },
        ParameterOverrides: [{ ParameterKey: 'Param1', ParameterValue: 'Value1' }],
      },
      {
        Regions: ['eu-west-1', 'us-west-2'],
        DeploymentTargets: { Accounts: ['222222222222', '333333333333'] },
      },
    ]);
  });

  test('renders one group of stack instances per organizational unit target, in order', () => {
    const app = new App();
    const stack = new Stack(app);

    new StackSet(stack, 'StackSet', {
      targets: [
        StackSetTarget.fromOrganizationalUnits({
          regions: ['us-east-1'],
          organizationalUnits: ['ou-1111111'],
        }),
        StackSetTarget.fromOrganizationalUnits({
          regions: ['us-west-2'],
          organizationalUnits: ['ou-2222222'],
          accountFilter: StackSetAccountFilter.difference(['333333333333']),
          parameterOverrides: { Param1: 'Value1' },
        }),
      ],
      deploymentType: DeploymentType.serviceManaged(),
    });

    expect(stackInstancesGroupOf(stack)).toEqual([
      {
        Regions: ['us-east-1'],
        DeploymentTargets: { OrganizationalUnitIds: ['ou-1111111'], AccountFilterType: 'NONE' },
      },
      {
        Regions: ['us-west-2'],
        DeploymentTargets: {
          OrganizationalUnitIds: ['ou-2222222'],
          AccountFilterType: 'DIFFERENCE',
          Accounts: ['333333333333'],
        },
        ParameterOverrides: [{ ParameterKey: 'Param1', ParameterValue: 'Value1' }],
      },
    ]);
  });

  test('renders targets from the targets prop before targets added with addTarget', () => {
    const app = new App();
    const stack = new Stack(app);

    const stackSet = new StackSet(stack, 'StackSet', {
      targets: [StackSetTarget.fromAccounts({ regions: ['us-east-1'], accounts: ['111111111111'] })],
    });
    stackSet.addTarget(StackSetTarget.fromAccounts({ regions: ['us-west-2'], accounts: ['222222222222'] }));

    expect(stackInstancesGroupOf(stack)).toEqual([
      { Regions: ['us-east-1'], DeploymentTargets: { Accounts: ['111111111111'] } },
      { Regions: ['us-west-2'], DeploymentTargets: { Accounts: ['222222222222'] } },
    ]);
  });

  test('an empty targets prop renders no stack instances', () => {
    const app = new App();
    const stack = new Stack(app);

    new StackSet(stack, 'StackSet', {
      targets: [],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
      StackInstancesGroup: Match.absent(),
    });
  });
});

test('passes operation preferences', () => {
  const app = new App();
  const stack = new Stack(app);

  new StackSet(stack, 'StackSet', {
    targets: [StackSetTarget.fromAccounts({
      regions: ['us-east-1'],
      accounts: ['11111111111'],
      parameterOverrides: {
        Param1: 'Value1',
      },
    })],
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

describe('StackSet operation preferences values', () => {
  function renderOperationPreferences(operationPreferences: OperationPreferences) {
    const app = new App();
    const stack = new Stack(app);

    new StackSet(stack, 'StackSet', {
      operationPreferences,
    });
    return stack;
  }

  test.each([
    ['failure tolerance count', { failureTolerance: StackSetFailureTolerance.count(2) }, { FailureToleranceCount: 2, FailureTolerancePercentage: Match.absent() }],
    ['failure tolerance percentage', { failureTolerance: StackSetFailureTolerance.percentage(25) }, { FailureTolerancePercentage: 25, FailureToleranceCount: Match.absent() }],
    ['max concurrency count', { maxConcurrency: StackSetMaxConcurrency.count(3) }, { MaxConcurrentCount: 3, MaxConcurrentPercentage: Match.absent() }],
    ['max concurrency percentage', { maxConcurrency: StackSetMaxConcurrency.percentage(40) }, { MaxConcurrentPercentage: 40, MaxConcurrentCount: Match.absent() }],
  ])('renders only the %s key', (_kind, operationPreferences: OperationPreferences, expected) => {
    const stack = renderOperationPreferences(operationPreferences);

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
    operationPreferences: {},
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
    OperationPreferences: Match.absent(),
  });
});

test('test stackset depends on role', () => {
  const app = new App();
  const stack = new Stack(app);

  new StackSet(stack, 'StackSet', {
    targets: [StackSetTarget.fromAccounts({
      regions: ['us-east-1'],
      accounts: ['11111111111'],
      parameterOverrides: {
        Param1: 'Value1',
      },
    })],
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

test.each([
  ['the default', undefined, Match.absent(), 'AWSCloudFormationStackSetExecutionRole'],
  ['a custom', 'CustomExecutionRole', 'CustomExecutionRole', 'CustomExecutionRole'],
])('a self managed StackSet with %s execution role name grants a partition-aware execution role ARN', (_name, executionRoleName, expectedExecutionRoleName, expectedRoleName) => {
  const app = new App();
  const stack = new Stack(app);

  new StackSet(stack, 'StackSet', {
    targets: [StackSetTarget.fromAccounts({
      regions: ['us-east-1'],
      accounts: ['11111111111'],
    })],
    deploymentType: DeploymentType.selfManaged({ executionRoleName }),
  });

  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::CloudFormation::StackSet', {
    ExecutionRoleName: expectedExecutionRoleName,
  });
  // For env-agnostic stacks, formatArn produces a Fn::Join with AWS::Partition
  template.hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Effect: 'Allow',
          Action: 'sts:AssumeRole',
          Resource: {
            'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, `:iam::*:role/${expectedRoleName}`]],
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
    targets: [StackSetTarget.fromAccounts({
      regions: ['us-gov-west-1'],
      accounts: ['11111111111'],
    })],
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

describe('Template.fromStack with a StackSet', () => {
  test('returns the template of the StackSet, not of the stack that contains it', () => {
    const app = new App();
    const stack = new Stack(app, 'Host');
    const stackSet = new StackSet(stack, 'StackSet');
    new s3.Bucket(stackSet, 'Bucket');

    Template.fromStack(stackSet).resourceCountIs('AWS::S3::Bucket', 1);
    Template.fromStack(stackSet).resourceCountIs('AWS::CloudFormation::StackSet', 0);
    Template.fromStack(stack).resourceCountIs('AWS::S3::Bucket', 0);
    Template.fromStack(stack).resourceCountIs('AWS::CloudFormation::StackSet', 1);
  });

  test('returns the template of a StackSet in a nested stack', () => {
    const app = new App();
    const nested = new NestedStack(new Stack(app, 'Host'), 'Nested');
    const stackSet = new StackSet(nested, 'StackSet');
    new s3.Bucket(stackSet, 'Bucket');

    Template.fromStack(stackSet).resourceCountIs('AWS::S3::Bucket', 1);
    Template.fromStack(nested).resourceCountIs('AWS::CloudFormation::StackSet', 1);
  });
});

describe('StackSet self managed admin role', () => {
  test('is created next to the StackSet, in the stack that contains it', () => {
    const app = new App();
    const stack = new Stack(app);

    const stackSet = new StackSet(stack, 'StackSet');

    expect(stackSet.adminRole).toBeDefined();
    expect(stack.node.tryFindChild('StackSet.AdminRole')).toBe(stackSet.adminRole);
    expect(stackSet.node.tryFindChild('AdminRole')).toBeUndefined();
  });

  test('adminRole is the supplied admin role', () => {
    const app = new App();
    const stack = new Stack(app);
    const adminRole = iam.Role.fromRoleArn(stack, 'AdminRole', 'arn:aws:iam::123456789012:role/StackSetAdmin');

    const stackSet = new StackSet(stack, 'StackSet', {
      deploymentType: DeploymentType.selfManaged({ adminRole }),
    });

    expect(stackSet.adminRole).toBe(adminRole);
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
      targets: [StackSetTarget.fromAccounts({
        regions: ['us-east-1', 'af-south-1'],
        accounts: ['11111111111'],
      })],
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

  test('each target in the targets prop gets trust for its opt-in regions', () => {
    const app = new App({ context: { [cxapi.ENABLE_PARTITION_LITERALS]: true } });
    const stack = new Stack(app, 'TestStack', { env: { account: '111111111111', region: 'us-east-1' } });

    new StackSet(stack, 'StackSet', {
      targets: [
        StackSetTarget.fromAccounts({ regions: ['us-east-1'], accounts: ['111111111111'] }),
        StackSetTarget.fromAccounts({ regions: ['ap-east-1'], accounts: ['222222222222'] }),
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: Match.arrayWith([{
          Effect: 'Allow',
          Principal: { Service: 'cloudformation.ap-east-1.amazonaws.com' },
          Action: 'sts:AssumeRole',
          Condition: {
            StringEquals: { 'aws:SourceAccount': '111111111111' },
            ArnLike: { 'aws:SourceArn': 'arn:aws:cloudformation:*:111111111111:stackset/*' },
          },
        }]),
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
      targets: [StackSetTarget.fromAccounts({
        regions: ['us-east-1', 'af-south-1'],
        accounts: ['11111111111'],
      })],
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
      targets: [StackSetTarget.fromAccounts({
        regions: ['us-east-1', 'af-south-1'],
        accounts: ['11111111111'],
      })],
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

test('a service managed StackSet has no admin role', () => {
  const app = new App();
  const stack = new Stack(app);

  const stackSet = new StackSet(stack, 'StackSet', {
    targets: [StackSetTarget.fromOrganizationalUnits({
      regions: ['us-east-1'],
      organizationalUnits: ['ou-1111111'],
    })],
    deploymentType: DeploymentType.serviceManaged(),
  });

  expect(stackSet.adminRole).toBeUndefined();
});

test('a tokenized target region gets no opt-in region trust statement', () => {
  const app = new App();
  const stack = new Stack(app);
  const region = new CfnParameter(stack, 'TargetRegion').valueAsString;

  new StackSet(stack, 'StackSet', {
    targets: [StackSetTarget.fromAccounts({
      regions: [region],
      accounts: ['11111111111'],
    })],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [Match.objectLike({ Principal: { Service: 'cloudformation.amazonaws.com' } })],
    },
  });
});

describe('tokenized target lists', () => {
  test.each([
    [
      'fromAccounts accepts a tokenized region list',
      (list: string[]) => StackSetTarget.fromAccounts({ regions: list, accounts: ['111111111111'] }),
      undefined,
      { Regions: { Ref: 'List' }, DeploymentTargets: { Accounts: ['111111111111'] } },
    ],
    [
      'fromOrganizationalUnits accepts a tokenized region list',
      (list: string[]) => StackSetTarget.fromOrganizationalUnits({ regions: list, organizationalUnits: ['ou-1111111'] }),
      DeploymentType.serviceManaged(),
      { Regions: { Ref: 'List' }, DeploymentTargets: { OrganizationalUnitIds: ['ou-1111111'], AccountFilterType: 'NONE' } },
    ],
    [
      'fromAccounts accepts a tokenized account list',
      (list: string[]) => StackSetTarget.fromAccounts({ regions: ['us-east-1'], accounts: list }),
      undefined,
      { Regions: ['us-east-1'], DeploymentTargets: { Accounts: { Ref: 'List' } } },
    ],
    [
      'fromOrganizationalUnits accepts a tokenized organizational unit list',
      (list: string[]) => StackSetTarget.fromOrganizationalUnits({ regions: ['us-east-1'], organizationalUnits: list }),
      DeploymentType.serviceManaged(),
      { DeploymentTargets: { OrganizationalUnitIds: { Ref: 'List' }, AccountFilterType: 'NONE' } },
    ],
  ])('%s', (_name, targetOf, deploymentType, expectedGroup) => {
    const app = new App();
    const stack = new Stack(app);
    const list = new CfnParameter(stack, 'List', { type: 'CommaDelimitedList' }).valueAsList;

    new StackSet(stack, 'StackSet', {
      targets: [targetOf(list)],
      deploymentType,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
      StackInstancesGroup: [expectedGroup],
    });
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

  test('synthesizes with version reporting enabled', () => {
    const app = new App({ context: { [cxapi.ANALYTICS_REPORTING_ENABLED_CONTEXT]: true } });
    const stack = new Stack(app);
    const stackSet = new StackSet(stack, 'StackSet', {
      template: StackSetTemplate.fromUrl('https://s3.amazonaws.com/my-bucket/template.json'),
    });

    expect(() => app.synth()).not.toThrow();
    expect(stackSet.node.tryFindChild('CDKMetadata')).toBeUndefined();
  });

  test('a StackSet that defines its own template gets version reporting', () => {
    const app = new App({ context: { [cxapi.ANALYTICS_REPORTING_ENABLED_CONTEXT]: true } });
    const stack = new Stack(app);
    const stackSet = new StackSet(stack, 'StackSet');
    new iam.Role(stackSet, 'Role', { assumedBy: new iam.AccountRootPrincipal() });

    app.synth();

    expect(stackSet.node.tryFindChild('CDKMetadata')).toBeDefined();
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
      assetBuckets: StackSetAssetBuckets.fromRegionalBuckets({ 'us-east-1': s3.Bucket.fromBucketName(stack, 'AssetBucket', 'prefix-us-east-1') }),
    });

    const children = stack.node.children.map((child) => child.node.id);
    expect(children).toEqual(expect.arrayContaining([
      'Baseline',
      'Baseline.Resource',
      'Baseline.AdminRole',
      'Baseline.Assets',
    ]));
    expect(children).not.toContain('Baseline.HostAssetBucket');
    expect(children).not.toContain('Baseline.AssetBucketDeployment0');
    expect(stack.node.findChild('Baseline.Assets').node.children.map((child) => child.node.id)).toEqual([
      'HostAssetBucket',
      'us-east-1',
    ]);
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

    Template.fromStack(stackSet).resourceCountIs('AWS::IAM::Role', 1);
  });
});

describe('StackSet environment', () => {
  test('the template is environment agnostic even when its stage has an environment', () => {
    const app = new App();
    const stage = new Stage(app, 'Stage', { env: { account: '111111111111', region: 'us-east-1' } });
    const stackSet = new StackSet(new Stack(stage, 'Host'), 'StackSet');
    new iam.Role(stackSet, 'Role', { assumedBy: new iam.AccountRootPrincipal() });

    Template.fromStack(stackSet).hasResourceProperties('AWS::IAM::Role', {
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
  test('the description is the description of the StackSet, not of its template', () => {
    const app = new App();
    const stack = new Stack(app);
    const stackSet = new StackSet(stack, 'StackSet', { description: 'Security baseline' });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', { Description: 'Security baseline' });
    expect(Template.fromStack(stackSet).toJSON().Description).toBeUndefined();
  });

  test.each([0, 1025])('fails with an error code when the description has %d characters', (length) => {
    const app = new App();
    const stack = new Stack(app);

    expect(() => new StackSet(stack, 'StackSet', { description: 'a'.repeat(length) })).toThrow(expect.objectContaining({
      name: 'StackSetDescriptionLength',
      message: `a StackSet description must be 1 to 1024 characters long, got ${length} characters, change 'description' or omit it`,
    }));
  });

  test('accepts a description of 1024 characters', () => {
    const app = new App();
    const stack = new Stack(app);
    const description = 'a'.repeat(1024);
    new StackSet(stack, 'StackSet', { description });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', { Description: description });
  });

  test('does not check the length of a tokenized description', () => {
    const app = new App();
    const stack = new Stack(app);
    const suffix = new CfnParameter(stack, 'DescriptionSuffix').valueAsString;
    // longer than 1024 characters while unresolved, so only a token check lets it through
    const description = `${'a'.repeat(1020)}${suffix}`;
    new StackSet(stack, 'StackSet', { description });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
      Description: { 'Fn::Join': ['', ['a'.repeat(1020), { Ref: 'DescriptionSuffix' }]] },
    });
  });

  test('the description of its template is set with templateOptions', () => {
    const app = new App();
    const stack = new Stack(app);
    const stackSet = new StackSet(stack, 'StackSet');
    stackSet.templateOptions.description = 'Security baseline template';

    expect(Template.fromStack(stackSet).toJSON().Description).toEqual('Security baseline template');
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
    Template.fromStack(stackSet).hasResourceProperties('AWS::S3::Bucket', {
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

    const template = Template.fromStack(stackSet).toJSON();
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
    const [parameterName] = Object.keys(Template.fromStack(stackSet).toJSON().Parameters);

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

describe('StackSet references to resources of a stack with an environment', () => {
  function stackWithAuditRole() {
    const app = new App();
    const stack = new Stack(app, 'Admin', { env: { account: '111111111111', region: 'us-east-1' } });
    const auditRole = new iam.Role(stack, 'AuditRole', { assumedBy: new iam.AccountRootPrincipal() });
    return { stack, auditRole };
  }

  function auditRoleResource(stack: Stack) {
    const roles = Template.fromStack(stack).findResources('AWS::IAM::Role', { Properties: { AssumeRolePolicyDocument: Match.anyValue() } });
    const [[logicalId, role]] = Object.entries(roles).filter(([id]) => id.startsWith('AuditRole'));
    return { logicalId, role };
  }

  test('the ARN of a role is passed as a StackSet parameter, without a generated role name', () => {
    const { stack, auditRole } = stackWithAuditRole();
    const stackSet = new StackSet(stack, 'StackSet');
    new CfnOutput(stackSet, 'AuditRoleArn', { value: auditRole.roleArn });

    const template = Template.fromStack(stackSet).toJSON();
    const [parameterName] = Object.keys(template.Parameters);
    expect(template.Outputs.AuditRoleArn.Value).toEqual({ Ref: parameterName });
    const { logicalId, role } = auditRoleResource(stack);
    Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
      Parameters: [{ ParameterKey: parameterName, ParameterValue: { 'Fn::GetAtt': [logicalId, 'Arn'] } }],
    });
    expect(role.Properties.RoleName).toBeUndefined();
  });

  test('the name of a role is passed as a StackSet parameter, without a generated role name', () => {
    const { stack, auditRole } = stackWithAuditRole();
    const stackSet = new StackSet(stack, 'StackSet');
    new CfnOutput(stackSet, 'AuditRoleName', { value: auditRole.roleName });

    const template = Template.fromStack(stackSet).toJSON();
    const [parameterName] = Object.keys(template.Parameters);
    expect(template.Outputs.AuditRoleName.Value).toEqual({ Ref: parameterName });
    const { logicalId, role } = auditRoleResource(stack);
    Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
      Parameters: [{ ParameterKey: parameterName, ParameterValue: { Ref: logicalId } }],
    });
    expect(role.Properties.RoleName).toBeUndefined();
  });

  test('the ARN of a role is passed through the StackSet to a nested stack in it', () => {
    const { stack, auditRole } = stackWithAuditRole();
    const stackSet = new StackSet(stack, 'StackSet', {
      assetBuckets: StackSetAssetBuckets.fromRegionalBuckets({ 'us-east-1': s3.Bucket.fromBucketName(stack, 'AssetBucket', 'prefix-us-east-1') }),
    });
    const nested = new core.NestedStack(stackSet, 'Nested');
    new CfnOutput(nested, 'AuditRoleArn', { value: auditRole.roleArn });

    const [stackSetParameter] = Object.keys(Template.fromStack(stackSet).toJSON().Parameters);
    const { logicalId, role } = auditRoleResource(stack);
    Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
      Parameters: [{ ParameterKey: stackSetParameter, ParameterValue: { 'Fn::GetAtt': [logicalId, 'Arn'] } }],
    });
    expect(role.Properties.RoleName).toBeUndefined();
  });
});

describe('StackSet dependencies', () => {
  function stackSetResourceId(template: Template, stackSetId: string): string {
    const [logicalId] = Object.keys(template.findResources('AWS::CloudFormation::StackSet'))
      .filter((id) => id.startsWith(stackSetId));
    return logicalId;
  }

  test('a resource of the StackSet that depends on a resource of its containing stack makes the StackSet depend on it', () => {
    const app = new App();
    const stack = new Stack(app, 'Admin');
    const hostTopic = new sns.Topic(stack, 'HostTopic');
    const stackSet = new StackSet(stack, 'StackSet');
    new sns.Topic(stackSet, 'Topic').node.addDependency(hostTopic);

    const template = Template.fromStack(stack);
    const [hostTopicId] = Object.keys(template.findResources('AWS::SNS::Topic'));
    expect(template.toJSON().Resources[stackSetResourceId(template, 'StackSet')].DependsOn).toContain(hostTopicId);
  });

  test('a resource of the containing stack that depends on a resource of the StackSet depends on the StackSet', () => {
    const app = new App();
    const stack = new Stack(app, 'Admin');
    const stackSet = new StackSet(stack, 'StackSet');
    const topic = new sns.Topic(stackSet, 'Topic');
    new sns.Topic(stack, 'HostTopic').node.addDependency(topic);

    const template = Template.fromStack(stack);
    const [hostTopic] = Object.values(template.findResources('AWS::SNS::Topic'));
    expect(hostTopic.DependsOn).toEqual([stackSetResourceId(template, 'StackSet')]);
  });

  test('a resource of a StackSet that depends on a resource of another StackSet makes the StackSets depend on each other', () => {
    const app = new App();
    const stack = new Stack(app, 'Admin');
    const first = new StackSet(stack, 'First');
    const second = new StackSet(stack, 'Second');
    const firstTopic = new sns.Topic(first, 'Topic');
    new sns.Topic(second, 'Topic').node.addDependency(firstTopic);

    const template = Template.fromStack(stack);
    expect(template.toJSON().Resources[stackSetResourceId(template, 'Second')].DependsOn)
      .toContain(stackSetResourceId(template, 'First'));
  });

  test('a resource of the StackSet that depends on a resource of another stack makes the containing stack depend on it', () => {
    const app = new App();
    const other = new Stack(app, 'Other');
    const otherTopic = new sns.Topic(other, 'OtherTopic');
    const stack = new Stack(app, 'Admin');
    const stackSet = new StackSet(stack, 'StackSet');
    new sns.Topic(stackSet, 'Topic').node.addDependency(otherTopic);

    // construct dependencies are applied when the app is synthesized
    expect(app.synth().getStackByName('Admin').dependencies.map((d) => d.id)).toContain('Other');
    expect(stack.dependencies).toContain(other);
  });
});

describe('nested stacks in a StackSet', () => {
  function stackSetWithNestedStack() {
    const app = new App();
    const stack = new Stack(app, 'Admin');
    const stackSet = new StackSet(stack, 'StackSet', {
      assetBuckets: StackSetAssetBuckets.fromRegionalBuckets({ 'us-east-1': s3.Bucket.fromBucketName(stack, 'AssetBucket', 'prefix-us-east-1') }),
    });
    const nested = new NestedStack(stackSet, 'Nested');
    return { app, stack, stackSet, nested };
  }

  test('a nested stack in the StackSet references the copied template through the mapping', () => {
    const { stack, stackSet, nested } = stackSetWithNestedStack();
    new iam.Role(nested, 'Role', { assumedBy: new iam.AccountRootPrincipal() });

    const nestedStackResource = Object.values(Template.fromStack(stackSet).findResources('AWS::CloudFormation::Stack'))[0];
    expect(nestedStackResource.Properties.TemplateURL).toEqual({
      'Fn::Join': ['', [
        'https://s3.', { Ref: 'AWS::Region' }, '.', { Ref: 'AWS::URLSuffix' }, '/',
        { 'Fn::FindInMap': ['StackSetAssetBuckets', { Ref: 'AWS::Region' }, 'BucketName'] },
        `/cdk-stackset-assets/${copiedTemplateKey(stack)}`,
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

    const stackSetTemplate = Template.fromStack(stackSet).toJSON();
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

  test.each([
    ['no', []],
    ['a missing list of', undefined as unknown as string[]],
    ['a null list of', null as unknown as string[]],
  ])('fails with an error code when fromAccounts has %s accounts', (_name, accounts) => {
    expect(() => StackSetTarget.fromAccounts({ regions: ['us-east-1'], accounts })).toThrow(expect.objectContaining({
      name: 'StackSetAccountsRequired',
      message: 'fromAccounts requires at least one account, set `accounts` to the account IDs to deploy to',
    }));
  });

  test.each([
    ['fromAccounts', 'no', []],
    ['fromAccounts', 'a missing list of', undefined as unknown as string[]],
    ['fromAccounts', 'a null list of', null as unknown as string[]],
    ['fromOrganizationalUnits', 'no', []],
    ['fromOrganizationalUnits', 'a missing list of', undefined as unknown as string[]],
    ['fromOrganizationalUnits', 'a null list of', null as unknown as string[]],
  ])('fails with an error code when %s has %s regions', (factory, _name, regions) => {
    const createTarget = factory === 'fromAccounts'
      ? () => StackSetTarget.fromAccounts({ regions, accounts: ['111111111111'] })
      : () => StackSetTarget.fromOrganizationalUnits({ regions, organizationalUnits: ['ou-1111111'] });

    expect(createTarget).toThrow(expect.objectContaining({
      name: 'StackSetRegionsRequired',
      message: `${factory} requires at least one region, set \`regions\` to the regions to deploy to`,
    }));
  });

  test.each([
    ['no', []],
    ['a missing list of', undefined as unknown as string[]],
    ['a null list of', null as unknown as string[]],
  ])('fails with an error code when fromOrganizationalUnits has %s organizational units', (_name, organizationalUnits) => {
    expect(() => StackSetTarget.fromOrganizationalUnits({ regions: ['us-east-1'], organizationalUnits })).toThrow(expect.objectContaining({
      name: 'StackSetOrganizationalUnitsRequired',
      message: 'fromOrganizationalUnits requires at least one organizational unit, set `organizationalUnits` to the OUs to deploy to',
    }));
  });

  test.each([
    ['intersection', StackSetAccountFilter.intersection],
    ['difference', StackSetAccountFilter.difference],
  ])('fails with an error code when the %s account filter has no accounts', (_name, factory) => {
    expect(() => factory([])).toThrow(expect.objectContaining({
      name: 'StackSetAccountFilterAccountsRequired',
      message: "StackSetAccountFilter requires at least one account, omit 'accountFilter' to deploy to every account in the organizational units",
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
  ])('fails with an error code when %s deployment type gets an organizational unit target in the targets prop', (_name, deploymentType) => {
    const app = new App();
    const stack = new Stack(app);

    expect(() => new StackSet(stack, 'StackSet', {
      deploymentType,
      targets: [organizationalUnitsTarget()],
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
    });

    expect(() => stackSet.addTarget(organizationalUnitsTarget())).toThrow(selfManagedCannotHaveOrganizationalUnits);
  });

  test('fails with an error code when a service managed StackSet gets an accounts target in the targets prop', () => {
    const app = new App();
    const stack = new Stack(app);

    expect(() => new StackSet(stack, 'StackSet', {
      deploymentType: DeploymentType.serviceManaged(),
      targets: [accountsTarget()],
    })).toThrow(serviceManagedRequiresOrganizationalUnits);
  });

  test('fails with an error code when a service managed StackSet gets an accounts target from addTarget', () => {
    const app = new App();
    const stack = new Stack(app);
    const stackSet = new StackSet(stack, 'StackSet', {
      deploymentType: DeploymentType.serviceManaged(),
    });

    expect(() => stackSet.addTarget(accountsTarget())).toThrow(serviceManagedRequiresOrganizationalUnits);
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

  test.each([
    ['only', [CfnCapabilities.NONE]],
    ['with another capability', [CfnCapabilities.NONE, CfnCapabilities.NAMED_IAM]],
  ])('fails with an error code when the capabilities contain CfnCapabilities.NONE %s', (_name, capabilities) => {
    const app = new App();
    const stack = new Stack(app);

    expect(() => new StackSet(stack, 'StackSet', { capabilities })).toThrow(expect.objectContaining({
      name: 'StackSetCapabilityNoneNotSupported',
      message: 'a StackSet does not accept CfnCapabilities.NONE, remove it from \'capabilities\'',
      constructPath: 'Default/StackSet',
    }));
  });

  test('renders the capabilities when they do not contain CfnCapabilities.NONE', () => {
    const app = new App();
    const stack = new Stack(app);

    new StackSet(stack, 'StackSet', { capabilities: [CfnCapabilities.ANONYMOUS_IAM, CfnCapabilities.NAMED_IAM] });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::StackSet', {
      Capabilities: ['CAPABILITY_IAM', 'CAPABILITY_NAMED_IAM'],
    });
  });

  test('accepts a tokenized capabilities list and a tokenized capability', () => {
    const app = new App();
    const stack = new Stack(app);
    const list = new CfnParameter(stack, 'Capabilities', { type: 'CommaDelimitedList' }).valueAsList as CfnCapabilities[];
    const element = new CfnParameter(stack, 'Capability').valueAsString as CfnCapabilities;

    new StackSet(stack, 'ListStackSet', { capabilities: list });
    new StackSet(stack, 'ElementStackSet', { capabilities: [element] });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::CloudFormation::StackSet', { Capabilities: { Ref: 'Capabilities' } });
    template.hasResourceProperties('AWS::CloudFormation::StackSet', { Capabilities: [{ Ref: 'Capability' }] });
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

  test('fails with an error code when a file asset has no file name', () => {
    const app = new App();
    const stack = new Stack(app);
    const stackSet = new StackSet(stack, 'AssetStack', {
      assetBuckets: StackSetAssetBuckets.fromRegionalBuckets({ 'us-east-1': s3.Bucket.fromBucketName(stack, 'AssetBucket', 'prefix-us-east-1') }),
    });

    expect(() => stackSet.synthesizer.addFileAsset({ sourceHash: 'hash', executable: ['build.sh'] })).toThrow(expect.objectContaining({
      name: 'AssetFileNameRequired',
      message: 'asset filename is required',
    }));
  });

  test('fails with an error code when a docker image asset is used', () => {
    const app = new App();
    const stackSet = new StackSet(new Stack(app), 'AssetStack');

    expect(() => stackSet.synthesizer.addDockerImageAsset({ sourceHash: 'hash', directoryName: 'dir' })).toThrow(expect.objectContaining({
      name: 'DockerAssetsNotSupported',
      message: 'docker image assets are not supported in StackSets',
    }));
  });
});
