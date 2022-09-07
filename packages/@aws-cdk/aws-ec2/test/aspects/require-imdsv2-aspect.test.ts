import { Annotations, Template, Match } from '@aws-cdk/assertions';
import { testFutureBehavior } from '@aws-cdk/cdk-build-tools';
import * as cdk from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { Construct } from 'constructs';
import {
  CfnLaunchTemplate,
  Instance,
  InstanceRequireImdsv2Aspect,
  InstanceType,
  LaunchTemplate,
  LaunchTemplateRequireImdsv2Aspect,
  MachineImage,
  Vpc,
} from '../../lib';

describe('RequireImdsv2Aspect', () => {
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
    const aspect = new LaunchTemplateRequireImdsv2Aspect({
      suppressWarnings: true,
    });
    const errmsg = 'ERROR';
    const visitMock = jest.spyOn(aspect, 'visit').mockImplementation((node) => {
      // @ts-ignore
      aspect.warn(node, errmsg);
    });
    const construct = new Construct(stack, 'Construct');

    // WHEN
    aspect.visit(construct);

    // THEN
    expect(visitMock).toHaveBeenCalled();
    Annotations.fromStack(stack).hasNoWarning('/Stack/Construct', errmsg);
  });

  describe('InstanceRequireImdsv2Aspect', () => {
    test('requires IMDSv2', () => {
      // GIVEN
      const instance = new Instance(stack, 'Instance', {
        vpc,
        instanceType: new InstanceType('t2.micro'),
        machineImage: MachineImage.latestAmazonLinux(),
      });
      const aspect = new InstanceRequireImdsv2Aspect();

      // WHEN
      cdk.Aspects.of(stack).add(aspect);
      app.synth();

      // THEN
      const launchTemplate = instance.node.tryFindChild('LaunchTemplate') as LaunchTemplate;
      expect(launchTemplate).toBeDefined();
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
        LaunchTemplateName: stack.resolve(launchTemplate.launchTemplateName),
        LaunchTemplateData: {
          MetadataOptions: {
            HttpTokens: 'required',
          },
        },
      });
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
        LaunchTemplate: {
          LaunchTemplateName: stack.resolve(launchTemplate.launchTemplateName),
        },
      });
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
      const aspect = new InstanceRequireImdsv2Aspect();

      // WHEN
      cdk.Aspects.of(stack).add(aspect);

      // THEN
      // Aspect normally creates a LaunchTemplate for the Instance to toggle IMDSv1,
      // so we can assert that one was not created
      Template.fromStack(stack).resourceCountIs('AWS::EC2::LaunchTemplate', 0);
      Annotations.fromStack(stack).hasWarning('/Stack/Instance', Match.stringLikeRegexp('.*Cannot toggle IMDSv1 because this Instance is associated with an existing Launch Template.'));
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
      const aspect = new InstanceRequireImdsv2Aspect({
        suppressLaunchTemplateWarning: true,
      });

      // WHEN
      aspect.visit(instance);

      // THEN
      Annotations.fromStack(stack).hasNoWarning('/Stack/Instance', 'Cannot toggle IMDSv1 because this Instance is associated with an existing Launch Template.');
    });

    testFutureBehavior('launch template name is unique with feature flag', { [cxapi.EC2_UNIQUE_IMDSV2_LAUNCH_TEMPLATE_NAME]: true }, cdk.App, (app2) => {
      // GIVEN
      const otherStack = new cdk.Stack(app2, 'OtherStack');
      const otherVpc = new Vpc(otherStack, 'OtherVpc');
      const otherInstance = new Instance(otherStack, 'OtherInstance', {
        vpc: otherVpc,
        instanceType: new InstanceType('t2.micro'),
        machineImage: MachineImage.latestAmazonLinux(),
      });
      const imdsv2Stack = new cdk.Stack(app2, 'RequireImdsv2Stack');
      const imdsv2Vpc = new Vpc(imdsv2Stack, 'Vpc');
      const instance = new Instance(imdsv2Stack, 'Instance', {
        vpc: imdsv2Vpc,
        instanceType: new InstanceType('t2.micro'),
        machineImage: MachineImage.latestAmazonLinux(),
      });
      const aspect = new InstanceRequireImdsv2Aspect();

      // WHEN
      cdk.Aspects.of(imdsv2Stack).add(aspect);
      cdk.Aspects.of(otherStack).add(aspect);
      app2.synth();

      // THEN
      const launchTemplate = instance.node.tryFindChild('LaunchTemplate') as LaunchTemplate;
      const otherLaunchTemplate = otherInstance.node.tryFindChild('LaunchTemplate') as LaunchTemplate;
      expect(launchTemplate).toBeDefined();
      expect(otherLaunchTemplate).toBeDefined();
      expect(launchTemplate.launchTemplateName !== otherLaunchTemplate.launchTemplateName);
    });
  });

  describe('LaunchTemplateRequireImdsv2Aspect', () => {
    test('warns when LaunchTemplateData is a CDK token', () => {
      // GIVEN
      const launchTemplate = new LaunchTemplate(stack, 'LaunchTemplate');
      const cfnLaunchTemplate = launchTemplate.node.tryFindChild('Resource') as CfnLaunchTemplate;
      cfnLaunchTemplate.launchTemplateData = cdk.Token.asAny({
        kernelId: 'asfd',
      } as CfnLaunchTemplate.LaunchTemplateDataProperty);
      const aspect = new LaunchTemplateRequireImdsv2Aspect();

      // WHEN
      aspect.visit(launchTemplate);

      // THEN
      Annotations.fromStack(stack).hasWarning('/Stack/LaunchTemplate', Match.stringLikeRegexp('.*LaunchTemplateData is a CDK token.'));
    });

    test('warns when MetadataOptions is a CDK token', () => {
      // GIVEN
      const launchTemplate = new LaunchTemplate(stack, 'LaunchTemplate');
      const cfnLaunchTemplate = launchTemplate.node.tryFindChild('Resource') as CfnLaunchTemplate;
      cfnLaunchTemplate.launchTemplateData = {
        metadataOptions: cdk.Token.asAny({
          httpEndpoint: 'http://bla',
        } as CfnLaunchTemplate.MetadataOptionsProperty),
      } as CfnLaunchTemplate.LaunchTemplateDataProperty;
      const aspect = new LaunchTemplateRequireImdsv2Aspect();

      // WHEN
      aspect.visit(launchTemplate);

      // THEN
      Annotations.fromStack(stack).hasWarning('/Stack/LaunchTemplate', Match.stringLikeRegexp('.*LaunchTemplateData.MetadataOptions is a CDK token.'));
    });

    test('requires IMDSv2', () => {
      // GIVEN
      new LaunchTemplate(stack, 'LaunchTemplate');
      const aspect = new LaunchTemplateRequireImdsv2Aspect();

      // WHEN
      cdk.Aspects.of(stack).add(aspect);

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
        LaunchTemplateData: {
          MetadataOptions: {
            HttpTokens: 'required',
          },
        },
      });
    });
  });
});
