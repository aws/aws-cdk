import * as crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { Construct } from 'constructs';
import { Annotations, Match, Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as lambda from '../../aws-lambda';
import * as s3 from '../../aws-s3';
import * as s3_assets from '../../aws-s3-assets';
import * as servicecatalog from '../../aws-servicecatalog';
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
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from '../../custom-resources';
import * as cxapi from '../../cx-api';
import type { StackSetProps, StackSetStackProps } from '../lib';
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

  test.each([
    ['an App', (app: App): Construct => app],
    ['a plain construct in an App', (app: App): Construct => new Construct(app, 'Group')],
    ['the root of a Stage', (app: App): Construct => new Stage(app, 'Stage')],
  ])('fails with an error code when a StackSetStack is defined in %s', (_name, scopeOf) => {
    const app = new App();

    expect(() => new StackSetStack(scopeOf(app), 'Stack')).toThrow(expect.objectContaining({
      name: 'StackSetStackMustBeDefinedWithinStack',
      message: expect.stringContaining('define the StackSetStack inside the stack of the StackSets that use it'),
    }));
  });
});

function sha256(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

function readFile(outdir: string, fileName: string): string {
  return fs.readFileSync(path.join(outdir, fileName), 'utf-8');
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

function defaultAssetUrl(hash: string): string {
  return `https://s3.\${AWS::Region}.\${AWS::URLSuffix}/cdk-hnb659fds-assets-\${AWS::AccountId}-\${AWS::Region}/${hash}.json`;
}

function refsOf(value: any): string[] {
  return JSON.stringify(value).match(/"Ref":"[^"]+"/g)?.map((ref) => ref.slice(7, -1)) ?? [];
}

function newStackSet(scope: Construct, id: string, stackSetStack: StackSetStack, props: Partial<StackSetProps> = {}): StackSet {
  return new StackSet(scope, id, {
    stackSetName: id,
    template: StackSetTemplate.fromStackSetStack(stackSetStack),
    capabilities: [CfnCapabilities.ANONYMOUS_IAM],
    ...props,
  });
}

function addLambdaTo(scope: Construct, id: string = 'Lambda') {
  return new lambda.Function(scope, id, {
    runtime: lambda.Runtime.NODEJS_18_X,
    handler: 'index.handler',
    code: lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
  });
}

function withAssetBuckets(stack: Stack, ...names: string[]): StackSetStackProps {
  return {
    assetBuckets: names.map((name, i) => s3.Bucket.fromBucketName(stack, `AssetBucket${i}`, name)),
    assetBucketPrefix: 'prefix',
  };
}

/**
 * The logical IDs of all resources under every bucket deployment in `stack`
 */
function bucketDeploymentResourceIds(stack: Stack): string[] {
  return stack.node.findAll()
    .filter((c) => /-AssetBucketDeployment-\d+$/.test(c.node.id))
    .flatMap((deployment) => deployment.node.findAll())
    .filter(CfnResource.isCfnResource)
    .map((resource) => stack.resolve(resource.logicalId));
}

/**
 * Checks that the template of `consumer` lists the StackSetStack template as an
 * asset, and that its StackSet points at it.
 */
function expectHostedTemplate(assembly: cxapi.CloudAssembly, consumer: Stack, stackSetStack: StackSetStack) {
  const hash = sha256(readFile(assembly.directory, stackSetStack.templateFile));
  for (const stackSet of stackSetResourcesOf(Template.fromStack(consumer))) {
    expect(renderString(stackSet.Properties.TemplateURL)).toEqual(defaultAssetUrl(hash));
  }
  expect(assetManifestOf(assembly, consumer).files[hash].source).toEqual({ path: stackSetStack.templateFile, packaging: 'file' });
  expect(assembly.stacks.map((s) => s.id)).not.toContain(stackSetStack.artifactId);
}

describe('StackSetStack inside the stack of its StackSet', () => {
  test.each([
    ['directly in the stack', (stack: Stack): Construct => stack],
    ['in a plain construct', (stack: Stack): Construct => new Construct(stack, 'Group')],
    ['in a nested stack', (stack: Stack): Construct => new NestedStack(stack, 'Nested')],
    ['in a product stack', (stack: Stack): Construct => new servicecatalog.ProductStack(stack, 'Product')],
    ['in another StackSetStack', (stack: Stack): Construct => new StackSetStack(stack, 'Outer')],
  ])('is hosted by that stack when defined %s', (_name, scopeOf) => {
    const app = new App();
    const stack = new Stack(app, 'Consumer');
    const stackSetStack = new StackSetStack(scopeOf(stack), 'StackSetStack');
    new sns.Topic(stackSetStack, 'Topic');
    newStackSet(stack, 'StackSet', stackSetStack);

    const assembly = app.synth();

    expectHostedTemplate(assembly, stack, stackSetStack);
    const resources = JSON.parse(readFile(assembly.directory, stackSetStack.templateFile)).Resources;
    expect(Object.values(resources).map((resource: any) => resource.Type)).toEqual(['AWS::SNS::Topic']);
  });

  test('is hosted by that stack whatever is added after the StackSet', () => {
    const app = new App();
    const stack = new Stack(app, 'Consumer');
    const stackSetStack = new StackSetStack(stack, 'StackSetStack', withAssetBuckets(stack, 'prefix-us-east-1'));
    newStackSet(stack, 'First', stackSetStack);
    new sns.Topic(stackSetStack, 'Topic');
    addLambdaTo(stackSetStack);
    newStackSet(stack, 'Second', stackSetStack);

    const assembly = app.synth();

    expectHostedTemplate(assembly, stack, stackSetStack);
    const deployments = bucketDeploymentResourceIds(stack);
    expect(deployments.length).toBeGreaterThan(0);
    for (const stackSet of stackSetResourcesOf(Template.fromStack(stack))) {
      expect(stackSet.DependsOn).toEqual(expect.arrayContaining(deployments));
    }
  });

  test.each([
    ['directly in the stack', (stack: Stack): Construct => stack],
    ['in a plain construct', (stack: Stack): Construct => new Construct(stack, 'Group')],
  ])('shared by two StackSets %s gives one template asset and one bucket deployment per asset bucket', (_name, scopeOf) => {
    const app = new App();
    const stack = new Stack(app, 'Consumer');
    const stackSetStack = new LambdaStackSet(scopeOf(stack), 'StackSetStack', withAssetBuckets(stack, 'first-us-east-1', 'second-us-east-1'));
    newStackSet(stack, 'First', stackSetStack);
    newStackSet(stack, 'Second', stackSetStack);

    const assembly = app.synth();

    const template = Template.fromStack(stack);
    const [first, second] = stackSetResourcesOf(template);
    expect(first.Properties.TemplateURL).toEqual(second.Properties.TemplateURL);
    const templateEntries = (Object.values(assetManifestOf(assembly, stack).files) as any[])
      .filter((file) => file.source.path === stackSetStack.templateFile);
    expect(templateEntries).toHaveLength(1);
    template.resourceCountIs('Custom::CDKBucketDeployment', 2);
    const deployments = bucketDeploymentResourceIds(stack);
    expect(first.DependsOn).toEqual(expect.arrayContaining(deployments));
    expect(second.DependsOn).toEqual(expect.arrayContaining(deployments));
  });

  test('gives the same result when validation is skipped', () => {
    const synthUrls = (options: { skipValidation?: boolean }) => {
      const app = new App();
      const stack = new Stack(app, 'Consumer');
      const stackSetStack = new LambdaStackSet(new NestedStack(stack, 'Nested'), 'StackSetStack', withAssetBuckets(stack, 'prefix-us-east-1'));
      newStackSet(stack, 'StackSet', stackSetStack);
      const assembly = app.synth(options);
      return {
        templateUrl: stackSetResourcesOf(Template.fromJSON(JSON.parse(readFile(assembly.directory, stack.templateFile))))[0].Properties.TemplateURL,
        files: Object.values(assetManifestOf(assembly, stack).files).map((file: any) => file.source.path).sort(),
      };
    };

    expect(synthUrls({ skipValidation: true })).toEqual(synthUrls({}));
  });

  test('references the asset parameters of a stack with the legacy synthesizer', () => {
    const app = new App();
    const stack = new Stack(app, 'Consumer', { synthesizer: new LegacyStackSynthesizer() });
    const stackSetStack = new StackSetStack(stack, 'StackSetStack', withAssetBuckets(stack, 'prefix-us-east-1'));
    addLambdaTo(stackSetStack);
    newStackSet(stack, 'StackSet', stackSetStack);

    const assembly = app.synth();

    const template = Template.fromStack(stack).toJSON();
    const parameters = Object.keys(template.Parameters);
    const stackSet = Object.values(template.Resources).find((resource: any) => resource.Type === 'AWS::CloudFormation::StackSet') as any;
    const deployment = Object.values(template.Resources).find((resource: any) => resource.Type === 'Custom::CDKBucketDeployment') as any;
    const templateHash = sha256(readFile(assembly.directory, stackSetStack.templateFile));
    const templateUrlRefs = refsOf(stackSet.Properties.TemplateURL).filter((ref) => !ref.startsWith('AWS::'));
    const sourceRefs = refsOf(deployment.Properties.SourceBucketNames).filter((ref) => !ref.startsWith('AWS::'));
    expect(templateUrlRefs.length).toBeGreaterThan(0);
    expect(templateUrlRefs.every((ref) => ref.startsWith(`AssetParameters${templateHash}`))).toBe(true);
    expect(sourceRefs.length).toBeGreaterThan(0);
    expect([...templateUrlRefs, ...sourceRefs].every((ref) => parameters.includes(ref))).toBe(true);
    expect(JSON.stringify(template)).not.toMatch(/Fn::ImportValue|\$\{Token\[/);
  });

  test('is environment agnostic, also in a Stage with an environment', () => {
    const app = new App();
    const stage = new Stage(app, 'Stage', { env: { account: '123456789012', region: 'us-east-1' } });
    const stack = new Stack(stage, 'Consumer');
    const stackSetStack = new StackSetStack(stack, 'StackSetStack');
    new CfnOutput(stackSetStack, 'Account', { value: stackSetStack.account });
    new CfnOutput(stackSetStack, 'Region', { value: Stack.of(stackSetStack).region });

    app.synth();

    expect(stack.resolve(stackSetStack.account)).toEqual({ Ref: 'AWS::AccountId' });
    expect(stack.resolve(stackSetStack.region)).toEqual({ Ref: 'AWS::Region' });
    const outputs = JSON.parse(readFile(stage.outdir, stackSetStack.templateFile)).Outputs;
    expect(outputs.Account.Value).toEqual({ Ref: 'AWS::AccountId' });
    expect(outputs.Region.Value).toEqual({ Ref: 'AWS::Region' });
  });

  test('is environment agnostic in an environment agnostic app', () => {
    const app = new App();
    const stackSetStack = new StackSetStack(new Stack(app, 'Consumer'), 'StackSetStack');

    expect(Stack.of(stackSetStack).resolve(stackSetStack.account)).toEqual({ Ref: 'AWS::AccountId' });
    expect(Stack.of(stackSetStack).resolve(stackSetStack.region)).toEqual({ Ref: 'AWS::Region' });
  });
});

describe('StackSet outside the stack of its StackSetStack', () => {
  test.each([
    ['another stack', (app: App, _stack: Stack): Construct => new Stack(app, 'Other')],
    ['another stack with an environment', (app: App, _stack: Stack): Construct => new Stack(app, 'Other', { env: { account: '111111111111', region: 'us-east-1' } })],
    ['a nested stack of that stack', (_app: App, stack: Stack): Construct => new NestedStack(stack, 'Nested')],
    ['a StackSetStack in that stack', (_app: App, stack: Stack): Construct => new StackSetStack(stack, 'Other')],
    ['a stack defined inside that stack', (_app: App, stack: Stack): Construct => new Stack(stack, 'Inner')],
  ])('fails with an error code when the StackSet is in %s', (_name, scopeOf) => {
    const app = new App();
    const stack = new Stack(app, 'Consumer');
    const stackSetStack = new StackSetStack(stack, 'StackSetStack');
    const scope = scopeOf(app, stack);

    expect(() => newStackSet(scope, 'StackSet', stackSetStack)).toThrow(expect.objectContaining({
      name: 'StackSetNotInStackOfStackSetStack',
      message: expect.stringMatching(new RegExp(`"${Stack.of(scope).node.path}".*"Consumer"`)),
    }));
  });

  test('fails with an error code also when validation is skipped, for the StackSetStack and the StackSet', () => {
    const app = new App();
    const stack = new Stack(app, 'Consumer');
    const stackSetStack = new StackSetStack(stack, 'StackSetStack');

    expect(() => newStackSet(new Stack(app, 'Other'), 'StackSet', stackSetStack)).toThrow(expect.objectContaining({ name: 'StackSetNotInStackOfStackSetStack' }));
    expect(() => new StackSetStack(app, 'Free')).toThrow(expect.objectContaining({ name: 'StackSetStackMustBeDefinedWithinStack' }));
    new CfnResource(stackSetStack, 'Consumer', { type: 'My::Resource', properties: { V: new CfnResource(new Stack(app, 'Sibling'), 'P', { type: 'My::Producer' }).ref } });
    expect(() => app.synth({ skipValidation: true })).toThrow(expect.objectContaining({ name: 'StackSetStackCrossStackReference' }));
  });
});

describe('references across a StackSetStack boundary', () => {
  function arrange(strength: string) {
    const app = new App({ context: { [cxapi.DEFAULT_CROSS_STACK_REFERENCES]: strength } });
    const stack = new Stack(app, 'Consumer');
    const sibling = new Stack(app, 'Sibling');
    const stackSetStack = new StackSetStack(stack, 'StackSetStack', withAssetBuckets(stack, 'prefix-us-east-1'));
    return { app, stack, sibling, stackSetStack };
  }
  type Arranged = ReturnType<typeof arrange>;
  const refer = (from: Construct, to: Construct) => {
    const producer = new sns.CfnTopic(to, 'Produced');
    new CfnResource(from, 'Consuming', { type: 'My::Resource', properties: { TopicArn: producer.ref } });
  };

  const outbound = /depends on stack .*pass the value as a parameter of the StackSet/;
  const inbound = /is a dependency of stack .*cannot be used outside it/;
  const cases: Array<[string, (a: Arranged) => void, (a: Arranged) => Stack, RegExp]> = [
    ['from the StackSetStack to its stack', (a) => refer(a.stackSetStack, a.stack), (a) => a.stack, outbound],
    ['from its stack to the StackSetStack', (a) => refer(a.stack, a.stackSetStack), (a) => a.stack, inbound],
    ['from the StackSetStack to a sibling stack', (a) => refer(a.stackSetStack, a.sibling), (a) => a.sibling, outbound],
    ['from a sibling stack to the StackSetStack', (a) => refer(a.sibling, a.stackSetStack), (a) => a.sibling, inbound],
    ['from a nested stack of the StackSetStack to its stack', (a) => refer(new NestedStack(a.stackSetStack, 'Nested'), a.stack), (a) => a.stack, outbound],
    ['from a nested stack of the StackSetStack to a sibling stack', (a) => refer(new NestedStack(a.stackSetStack, 'Nested'), a.sibling), (a) => a.sibling, outbound],
  ];

  describe.each(['strong', 'weak'])('with %s references', (strength) => {
    test.each(cases)('fails with an error code for a reference %s', (_name, act, otherOf, direction) => {
      const a = arrange(strength);
      act(a);

      expect(() => a.app.synth()).toThrow(expect.objectContaining({
        name: 'StackSetStackCrossStackReference',
        message: expect.stringMatching(new RegExp(`"Consumer/StackSetStack".*"${otherOf(a).node.path}"`)),
      }));
      expect(() => a.app.synth()).toThrow(direction);
    });
  });

  test.each([
    ['from a sibling stack on the StackSetStack', (a: Arranged) => a.sibling.addStackDependency(a.stackSetStack), inbound],
    ['from the StackSetStack on a sibling stack', (a: Arranged) => a.stackSetStack.addStackDependency(a.sibling), outbound],
  ])('fails with an error code for a stack dependency %s', (_name, act, direction) => {
    const a = arrange('strong');
    act(a);

    expect(() => a.app.synth()).toThrow(expect.objectContaining({ name: 'StackSetStackCrossStackReference' }));
    expect(() => a.app.synth()).toThrow(direction);
  });

  test('allows references inside the StackSetStack, from its nested stacks and to imported values', () => {
    const app = new App();
    const stack = new Stack(app, 'Consumer');
    const stackSetStack = new StackSetStack(stack, 'StackSetStack', withAssetBuckets(stack, 'prefix-us-east-1'));
    newStackSet(stack, 'StackSet', stackSetStack);
    const topic = new sns.CfnTopic(stackSetStack, 'Topic');
    new CfnResource(stackSetStack, 'Local', { type: 'My::Resource', properties: { TopicArn: topic.ref } });
    new CfnResource(new NestedStack(stackSetStack, 'Nested'), 'FromNested', { type: 'My::Resource', properties: { TopicArn: topic.ref } });
    new CfnResource(stackSetStack, 'Imported', { type: 'My::Resource', properties: { Value: Fn.importValue('SomeExport') } });

    const assembly = app.synth();

    const template = Template.fromJSON(JSON.parse(readFile(assembly.directory, stackSetStack.templateFile)));
    template.hasResourceProperties('My::Resource', { TopicArn: { Ref: Match.stringLikeRegexp('^Topic') } });
    template.hasResourceProperties('My::Resource', { Value: { 'Fn::ImportValue': 'SomeExport' } });
  });

  test.each([
    ['its stack has an environment', { account: '111111111111', region: 'us-east-1' }, undefined, false],
    ['a sibling stack has an environment', undefined, { account: '111111111111', region: 'us-east-1' }, true],
  ])('fail with an existing core error, without exports, when %s', (_name, stackEnv, siblingEnv, toSibling) => {
    for (const fromStackSetStack of [true, false]) {
      const app = new App();
      const stack = new Stack(app, 'Consumer', { env: stackEnv });
      const sibling = new Stack(app, 'Sibling', { env: siblingEnv });
      const stackSetStack = new StackSetStack(stack, 'StackSetStack');
      const other = toSibling ? sibling : stack;
      if (fromStackSetStack) {
        refer(stackSetStack, other);
      } else {
        refer(other, stackSetStack);
      }

      expect(() => app.synth()).toThrow(expect.objectContaining({
        name: expect.stringMatching(/^(NoCfnExecutionRoleForCrossAccountRefs|CrossRegionReferencesRequireExplicitRegion)$/),
      }));
      const writtenFiles = fs.existsSync(app.outdir) ? fs.readdirSync(app.outdir).filter((file) => file.endsWith('.json')) : [];
      for (const file of writtenFiles) {
        expect(readFile(app.outdir, file)).not.toMatch(/Fn::ImportValue|Fn::GetStackOutput|PublishGetStackOutputRole/);
      }
    }
  });

  test.each([
    ['another account', { account: '222222222222', region: 'us-east-1' }],
    ['the environment of the Stage', undefined],
  ])('fails with an existing core error when the Stage has an environment and the stack %s', (_name, stackEnv) => {
    const app = new App();
    const stage = new Stage(app, 'Stage', { env: { account: '111111111111', region: 'us-east-1' } });
    const stack = new Stack(stage, 'Consumer', { env: stackEnv });
    const stackSetStack = new StackSetStack(stack, 'StackSetStack');
    refer(stackSetStack, stack);

    expect(() => app.synth()).toThrow(expect.objectContaining({
      name: expect.stringMatching(/^(NoCfnExecutionRoleForCrossAccountRefs|CrossRegionReferencesRequireExplicitRegion)$/),
    }));
  });
});

describe('annotations inside a StackSetStack', () => {
  const warningId = '@aws-cdk/test:stackSetWarning';

  function annotate(construct: Construct) {
    CoreAnnotations.of(construct).addError('an error inside');
    CoreAnnotations.of(construct).addWarningV2(warningId, 'a warning inside');
    CoreAnnotations.of(construct).addInfo('an info inside');
  }

  function metadataOf(assembly: cxapi.CloudAssembly, stack: Stack): Record<string, cxschema.MetadataEntry[]> {
    return JSON.parse(readFile(assembly.directory, `${stack.artifactId}.metadata.json`));
  }

  test.each([
    ['used by a StackSet', true],
    ['not used by any StackSet', false],
  ])('appear in the artifact of its stack when it is %s', (_name, used) => {
    const app = new App();
    const stack = new Stack(app, 'Consumer');
    const stackSetStack = new StackSetStack(new NestedStack(stack, 'Nested'), 'StackSetStack');
    annotate(new sns.Topic(stackSetStack, 'Topic'));
    if (used) {
      newStackSet(stack, 'StackSet', stackSetStack);
    }

    const annotations = Annotations.fromStack(stack);
    annotations.hasError('/Consumer/Nested/StackSetStack/Topic', 'an error inside');
    annotations.hasWarning('/Consumer/Nested/StackSetStack/Topic', Match.stringLikeRegexp('^a warning inside'));
    annotations.hasInfo('/Consumer/Nested/StackSetStack/Topic', 'an info inside');
  });

  test.each([
    ['the construct', (topic: Construct): Construct => topic],
    ['the StackSetStack', (topic: Construct): Construct => topic.node.scope!],
    ['its stack', (topic: Construct): Construct => Stack.of(topic.node.scope!)],
  ])('warnings acknowledged on %s are removed', (_name, acknowledgeOn) => {
    const app = new App();
    const stack = new Stack(app, 'Consumer');
    const topic = new sns.Topic(new StackSetStack(stack, 'StackSetStack'), 'Topic');
    annotate(topic);

    CoreAnnotations.of(acknowledgeOn(topic)).acknowledgeWarning(warningId);

    Annotations.fromStack(stack).hasNoWarning('*', Match.stringLikeRegexp('inside'));
    Annotations.fromStack(stack).hasError('/Consumer/StackSetStack/Topic', 'an error inside');
  });

  test('do not bring logical ids or creation stacks of the StackSetStack into the artifact of its stack', () => {
    const app = new App({ context: { [cxapi.DISABLE_CREATION_STACK_TRACES]: false } });
    const stack = new Stack(app, 'Consumer');
    new sns.Topic(stack, 'Topic');
    const stackSetStack = new StackSetStack(stack, 'StackSetStack');
    new sns.Topic(stackSetStack, 'Topic');
    newStackSet(stack, 'StackSet', stackSetStack);

    const metadata = metadataOf(app.synth(), stack);

    const entryTypesUnder = (prefix: string) => Object.entries(metadata)
      .filter(([key]) => key.startsWith(prefix))
      .flatMap(([, entries]) => entries.map((entry) => entry.type));
    expect(entryTypesUnder('/Consumer/StackSetStack/')).not.toContain(cxschema.ArtifactMetadataEntryType.LOGICAL_ID);
    expect(entryTypesUnder('/Consumer/StackSetStack/')).not.toContain(cxschema.ArtifactMetadataEntryType.CREATION_STACK);
    expect(metadata['/Consumer/Topic/Resource'].map((entry) => entry.type)).toEqual(expect.arrayContaining([
      cxschema.ArtifactMetadataEntryType.LOGICAL_ID,
      cxschema.ArtifactMetadataEntryType.CREATION_STACK,
    ]));
  });
});

describe('a nested stack inside a StackSetStack', () => {
  /**
   * Checks that the StackSets wait for every bucket deployment resource, and that
   * the deployment handler waits for its permissions
   */
  function expectDeploymentsWired(stack: Stack) {
    const template = Template.fromStack(stack);
    const deployments = bucketDeploymentResourceIds(stack);
    expect(deployments.length).toBeGreaterThan(1);
    const stackSets = stackSetResourcesOf(template);
    expect(stackSets.length).toBeGreaterThan(0);
    for (const stackSet of stackSets) {
      expect(stackSet.DependsOn).toEqual(expect.arrayContaining(deployments));
    }

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
    ['one StackSet', 1],
    ['two StackSets', 2],
  ])('makes %s wait for the copies of its template', (_name, count) => {
    const app = new App();
    const stack = new Stack(app, 'Consumer');
    const stackSetStack = new StackSetStack(new Construct(stack, 'Group'), 'StackSetStack', withAssetBuckets(stack, 'prefix-us-east-1'));
    new sns.Topic(new NestedStack(stackSetStack, 'Nested'), 'Topic');
    for (let i = 0; i < count; i++) {
      newStackSet(stack, `StackSet${i}`, stackSetStack);
    }

    expectDeploymentsWired(stack);
  });
});

test('a custom StackSetTemplate that only has a template URL gets no dependencies', () => {
  class UrlTemplate extends StackSetTemplate {
    public readonly templateUrl = 'https://example.com/template.json';
  }
  const app = new App();
  const stack = new Stack(app, 'Consumer');

  new StackSet(stack, 'StackSet', { template: new UrlTemplate(), deploymentType: DeploymentType.serviceManaged() });

  const [stackSet] = stackSetResourcesOf(Template.fromStack(stack));
  expect(stackSet.Properties.TemplateURL).toEqual('https://example.com/template.json');
  expect(stackSet.DependsOn).toBeUndefined();
});
