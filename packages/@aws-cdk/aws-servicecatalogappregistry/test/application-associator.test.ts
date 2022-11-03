import { Annotations, Template } from '@aws-cdk/assertions';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as cdk from '@aws-cdk/core';
import * as codepipeline from '@aws-cdk/pipelines';
import { Construct } from 'constructs';
import * as appreg from '../lib';

describe('Scope based Associations with Application within Same Account', () => {
  let app: cdk.App;
  beforeEach(() => {
    app = new cdk.App({
      context: {
        '@aws-cdk/core:newStyleStackSynthesis': false,
      },
    });
  });
  test('ApplicationAssociator will associate allStacks created inside cdkApp', () => {
    new appreg.ApplicationAssociator(app, 'MyApplication', {
      applications: [appreg.TargetApplication.createApplicationStack({
        applicationName: 'MyAssociatedApplication',
        stackName: 'MyAssociatedApplicationStack',
      })],
    });
    const anotherStack = new AppRegistrySampleStack(app, 'SampleStack');
    Template.fromStack(anotherStack).resourceCountIs('AWS::ServiceCatalogAppRegistry::ResourceAssociation', 1);
    Template.fromStack(anotherStack).hasResourceProperties('AWS::ServiceCatalogAppRegistry::ResourceAssociation', {
      Application: 'MyAssociatedApplication',
      Resource: { Ref: 'AWS::StackId' },
    });
  });
});
describe('Scope based Associations with Application with Cross Region/Account', () => {
  let app: cdk.App;
  beforeEach(() => {
    app = new cdk.App({
      context: {
        '@aws-cdk/core:newStyleStackSynthesis': false,
      },
    });
  });
  test('ApplicationAssociator in cross-account associates all stacks created inside cdk app', () => {
    new appreg.ApplicationAssociator(app, 'MyApplication', {
      applications: [appreg.TargetApplication.createApplicationStack({
        applicationName: 'MyAssociatedApplication',
        stackName: 'MyAssociatedApplicationStack',
      })],
    });
    const firstStack = new cdk.Stack(app, 'testStack', {
      env: { account: 'account2', region: 'region' },
    });
    const nestedStack = new cdk.Stack(firstStack, 'MyFirstStack', {
      env: { account: 'account2', region: 'region' },
    });
    Template.fromStack(firstStack).resourceCountIs('AWS::ServiceCatalogAppRegistry::ResourceAssociation', 1);
    Template.fromStack(nestedStack).resourceCountIs('AWS::ServiceCatalogAppRegistry::ResourceAssociation', 1);
  });

  test('ApplicationAssociator creation failed when neither Application name nor ARN is provided', () => {
    expect(() => {
      new appreg.ApplicationAssociator(app, 'MyApplication', {
        applications: [],
      });
    }).toThrow('Please pass exactly 1 instance of TargetApplication.createApplicationStack() or TargetApplication.existingApplicationFromArn() into the "applications" property');
  });

  test('ApplicationAssociator creation failed when both Application name and ARN is provided', () => {
    expect(() => {
      new appreg.ApplicationAssociator(app, 'MyApplication', {
        applications: [appreg.TargetApplication.existingApplicationFromArn({
          applicationArnValue: 'arn:aws:servicecatalog:us-east-1:482211128593:/applications/0a17wtxeg5vilok0sbxfozwpq9',
        }),
        appreg.TargetApplication.createApplicationStack({
          applicationName: 'MyAssociatedApplication',
        })],
      });
    }).toThrow('Please pass exactly 1 instance of TargetApplication.createApplicationStack() or TargetApplication.existingApplicationFromArn() into the "applications" property');
  });

  test('associate resource on imported application', () => {
    const resource = new cdk.Stack(app, 'MyStack');

    new appreg.ApplicationAssociator(app, 'MyApplication', {
      applications: [appreg.TargetApplication.existingApplicationFromArn({
        applicationArnValue: 'arn:aws:servicecatalog:us-east-1:482211128593:/applications/0a17wtxeg5vilok0sbxfozwpq9',
      })],
    });

    Template.fromStack(resource).hasResourceProperties('AWS::ServiceCatalogAppRegistry::ResourceAssociation', {
      Application: '0a17wtxeg5vilok0sbxfozwpq9',
      Resource: { Ref: 'AWS::StackId' },
    });
  }),

  test('ApplicationAssociator with cross region stacks inside cdkApp throws error', () => {
    new appreg.ApplicationAssociator(app, 'MyApplication', {
      applications: [appreg.TargetApplication.createApplicationStack({
        applicationName: 'MyAssociatedApplication',
        stackName: 'MyAssociatedApplicationStack',
        env: { account: 'account2', region: 'region2' },
      })],
    });

    const crossRegionStack = new cdk.Stack(app, 'crossRegionStack', {
      env: { account: 'account', region: 'region' },
    });
    Annotations.fromStack(crossRegionStack).hasError('*', 'AppRegistry does not support cross region associations. Application region region2, stack region region');
  });

  test('Environment Agnostic ApplicationAssociator with cross region stacks inside cdkApp gives warning', () => {
    new appreg.ApplicationAssociator(app, 'MyApplication', {
      applications: [appreg.TargetApplication.createApplicationStack({
        applicationName: 'MyAssociatedApplication',
        stackName: 'MyAssociatedApplicationStack',
      })],
    });

    const crossRegionStack = new cdk.Stack(app, 'crossRegionStack', {
      env: { account: 'account', region: 'region' },
    });
    Annotations.fromStack(crossRegionStack).hasWarning('*', 'Environment agnostic stack determined, AppRegistry association might not work as expected in case you deploy cross-region or cross-account stack.');
  });

  test('Cdk App Containing Pipeline with stage but stage not associated throws error', () => {
    const application = new appreg.ApplicationAssociator(app, 'MyApplication', {
      applications: [appreg.TargetApplication.createApplicationStack({
        applicationName: 'MyAssociatedApplication',
        stackName: 'MyAssociatedApplicationStack',
      })],
    });
    const pipelineStack = new AppRegistrySampleCodePipelineStack(app, 'PipelineStackA', {
      application: application,
      associateStage: false,
    });
    app.synth();
    Annotations.fromStack(pipelineStack).hasError('*',
      'Associate Stage: SampleStage to ensure all stacks in your cdk app are associated with AppRegistry. You can use ApplicationAssociator.associateStage to associate any stage.');
  });

  test('Cdk App Containing Pipeline with stage and stage associated successfully gets synthesized', () => {
    const application = new appreg.ApplicationAssociator(app, 'MyApplication', {
      applications: [appreg.TargetApplication.createApplicationStack({
        applicationName: 'MyAssociatedApplication',
        stackName: 'MyAssociatedApplicationStack',
      })],
    });
    const pipelineStack = new AppRegistrySampleCodePipelineStack(app, 'PipelineStackA', {
      application: application,
      associateStage: true,
    });
    app.synth();
    Template.fromStack(pipelineStack).resourceCountIs('AWS::ServiceCatalogAppRegistry::ResourceAssociation', 1);
  });
});

interface AppRegistrySampleCodePipelineStackProps extends cdk.StackProps {
  application: appreg.ApplicationAssociator;
  associateStage: boolean;
}

class AppRegistrySampleCodePipelineStack extends cdk.Stack {
  public constructor(scope: Construct, id: string, props: AppRegistrySampleCodePipelineStackProps ) {
    super(scope, id, props);
    const repo = new codecommit.Repository(this, 'Repo', {
      repositoryName: 'MyRepo',
    });

    const pipeline = new codepipeline.CodePipeline(this, 'Pipeline', {
      pipelineName: 'MyPipeline',
      synth: new codepipeline.CodeBuildStep('SynthStep', {
        input: codepipeline.CodePipelineSource.codeCommit(repo, 'main'),
        installCommands: [
          'npm install -g aws-cdk',
        ],
        commands: [
          'npm ci',
          'npm run build',
          'npx cdk synth',
        ],
      },
      ),
    });

    const stage = new AppRegistrySampleStage(
      this,
      'SampleStage',
    );

    if (props.associateStage) {
      props.application.associateStage(stage);
    }
    pipeline.addStage(stage);
  }
}

class AppRegistrySampleStage extends cdk.Stage {
  public constructor(scope: Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);
    new AppRegistrySampleStack(this, 'SampleStack', {});
  }
}

class AppRegistrySampleStack extends cdk.Stack {
  public constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
  }
}
