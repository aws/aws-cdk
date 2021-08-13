import {
  countResources,
  expect as expectCDK,
  haveResourceLike,
} from '@aws-cdk/assert-internal';
import '@aws-cdk/assert-internal/jest';
import * as cdk from '@aws-cdk/core';
import * as sinon from 'sinon';
import {
  CfnLaunchTemplate,
  Instance,
  InstanceImdsAspect,
  InstanceType,
  LaunchTemplate,
  LaunchTemplateImdsAspect,
  MachineImage,
  Vpc,
} from '../../lib';

describe('ImdsAspect', () => {
  let app: cdk.App;
  let stack: cdk.Stack;
  let vpc: Vpc;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'Stack');
    vpc = new Vpc(stack, 'Vpc');
  });

  test('suppresses warnings', () => {
    // GIVEN
    const aspect = new LaunchTemplateImdsAspect({
      enableImdsV1: true,
      suppressWarnings: true,
    });
    const errmsg = 'ERROR';
    const stub = sinon.stub(aspect, 'visit').callsFake((node) => {
      // @ts-ignore
      aspect.warn(node, errmsg);
    });
    const construct = new cdk.Construct(stack, 'Construct');

    // WHEN
    aspect.visit(construct);

    // THEN
    expect(stub.calledOnce).toBeTruthy();
    expect(construct.node.metadataEntry).not.toContainEqual({
      data: expect.stringContaining(errmsg),
      type: 'aws:cdk:warning',
      trace: undefined,
    });
  });

  describe('InstanceImdsAspect', () => {
    test.each([
      [true],
      [false],
    ])('toggles IMDSv1 (enabled=%s)', (enableImdsV1: boolean) => {
      // GIVEN
      const instance = new Instance(stack, 'Instance', {
        vpc,
        instanceType: new InstanceType('t2.micro'),
        machineImage: MachineImage.latestAmazonLinux(),
      });
      const aspect = new InstanceImdsAspect({ enableImdsV1 });

      // WHEN
      aspect.visit(instance);

      // THEN
      const launchTemplate = instance.node.tryFindChild('LaunchTemplate') as LaunchTemplate;
      expect(launchTemplate).toBeDefined();
      expectCDK(stack).to(haveResourceLike('AWS::EC2::LaunchTemplate', {
        LaunchTemplateName: stack.resolve(launchTemplate.launchTemplateName),
        LaunchTemplateData: {
          MetadataOptions: {
            HttpTokens: enableImdsV1 ? 'optional' : 'required',
          },
        },
      }));
      expectCDK(stack).to(haveResourceLike('AWS::EC2::Instance', {
        LaunchTemplate: {
          LaunchTemplateName: stack.resolve(launchTemplate.launchTemplateName),
        },
      }));
    });

    test('does not toggle when Instance has a LaunchTemplate', () => {
      // GIVEN
      const instance = new Instance(stack, 'Instance', {
        vpc,
        instanceType: new InstanceType('t2.micro'),
        machineImage: MachineImage.latestAmazonLinux(),
      });
      instance.instance.launchTemplate = {
        launchTemplateName: 'name',
        version: 'version',
      };
      const aspect = new InstanceImdsAspect({ enableImdsV1: false });

      // WHEN
      aspect.visit(instance);

      // THEN
      // Aspect normally creates a LaunchTemplate for the Instance to toggle IMDSv1,
      // so we can assert that one was not created
      expectCDK(stack).to(countResources('AWS::EC2::LaunchTemplate', 0));
      expect(instance.node.metadataEntry).toContainEqual({
        data: expect.stringContaining('Cannot toggle IMDSv1 because this Instance is associated with an existing Launch Template.'),
        type: 'aws:cdk:warning',
        trace: undefined,
      });
    });

    test('suppresses Launch Template warnings', () => {
      // GIVEN
      const instance = new Instance(stack, 'Instance', {
        vpc,
        instanceType: new InstanceType('t2.micro'),
        machineImage: MachineImage.latestAmazonLinux(),
      });
      instance.instance.launchTemplate = {
        launchTemplateName: 'name',
        version: 'version',
      };
      const aspect = new InstanceImdsAspect({
        enableImdsV1: false,
        suppressLaunchTemplateWarning: true,
      });

      // WHEN
      aspect.visit(instance);

      // THEN
      expect(instance.node.metadataEntry).not.toContainEqual({
        data: expect.stringContaining('Cannot toggle IMDSv1 because this Instance is associated with an existing Launch Template.'),
        type: 'aws:cdk:warning',
        trace: undefined,
      });
    });
  });

  describe('LaunchTemplateImdsAspect', () => {
    test('warns when CfnLaunchTemplate cannot be found', () => {
      // GIVEN
      const launchTemplate = new LaunchTemplate(stack, 'LaunchTemplate');
      launchTemplate.node.tryRemoveChild('Resource');
      const aspect = new LaunchTemplateImdsAspect({ enableImdsV1: false });

      // WHEN
      aspect.visit(launchTemplate);

      // THEN
      expect(launchTemplate.node.metadataEntry).toContainEqual({
        data: expect.stringContaining('CfnLaunchTemplate cannot be found because the LaunchTemplate construct implementation has changed.'),
        type: 'aws:cdk:warning',
        trace: undefined,
      });
    });

    test('warns when LaunchTemplateData is a CDK token', () => {
      // GIVEN
      const launchTemplate = new LaunchTemplate(stack, 'LaunchTemplate');
      const cfnLaunchTemplate = launchTemplate.node.tryFindChild('Resource') as CfnLaunchTemplate;
      cfnLaunchTemplate.launchTemplateData = fakeToken();
      const aspect = new LaunchTemplateImdsAspect({ enableImdsV1: false });

      // WHEN
      aspect.visit(launchTemplate);

      // THEN
      expect(launchTemplate.node.metadataEntry).toContainEqual({
        data: expect.stringContaining('LaunchTemplateData is a CDK token.'),
        type: 'aws:cdk:warning',
        trace: undefined,
      });
    });

    test('warns when MetadataOptions is a CDK token', () => {
      // GIVEN
      const launchTemplate = new LaunchTemplate(stack, 'LaunchTemplate');
      const cfnLaunchTemplate = launchTemplate.node.tryFindChild('Resource') as CfnLaunchTemplate;
      cfnLaunchTemplate.launchTemplateData = {
        metadataOptions: fakeToken(),
      } as CfnLaunchTemplate.LaunchTemplateDataProperty;
      const aspect = new LaunchTemplateImdsAspect({ enableImdsV1: false });

      // WHEN
      aspect.visit(launchTemplate);

      // THEN
      expect(launchTemplate.node.metadataEntry).toContainEqual({
        data: expect.stringContaining('LaunchTemplateData.MetadataOptions is a CDK token.'),
        type: 'aws:cdk:warning',
        trace: undefined,
      });
    });

    test.each([
      [true],
      [false],
    ])('toggles IMDSv1 (enabled=%s)', (enableImdsV1: boolean) => {
      // GIVEN
      const launchTemplate = new LaunchTemplate(stack, 'LaunchTemplate');
      const aspect = new LaunchTemplateImdsAspect({ enableImdsV1 });

      // WHEN
      aspect.visit(launchTemplate);

      // THEN
      expectCDK(stack).to(haveResourceLike('AWS::EC2::LaunchTemplate', {
        LaunchTemplateData: {
          MetadataOptions: {
            HttpTokens: enableImdsV1 ? 'optional' : 'required',
          },
        },
      }));
    });
  });
});

function fakeToken(): cdk.IResolvable {
  return {
    creationStack: [],
    resolve: (_c) => {},
    toString: () => '',
  };
}
