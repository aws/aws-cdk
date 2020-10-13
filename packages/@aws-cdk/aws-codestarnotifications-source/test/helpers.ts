import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as notifications from '@aws-cdk/aws-codestarnotifications';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';

export class FakeSnsTopicTarget implements notifications.INotificationTarget {
  constructor(private readonly topic: sns.ITopic) {}

  bind(): notifications.NotificationTargetConfig {
    return {
      targetType: notifications.TargetType.SNS,
      targetAddress: this.topic.topicArn,
    };
  }
}

export interface FakeBuildActionProps extends codepipeline.CommonActionProps {
  input: codepipeline.Artifact;

  output?: codepipeline.Artifact;

  extraInputs?: codepipeline.Artifact[];

  owner?: string;

  role?: iam.IRole;

  account?: string;

  region?: string;

  customConfigKey?: string;
}

export class FakeBuildAction implements codepipeline.IAction {
  public readonly actionProperties: codepipeline.ActionProperties;
  private readonly customConfigKey: string | undefined;

  constructor(props: FakeBuildActionProps) {
    this.actionProperties = {
      ...props,
      category: codepipeline.ActionCategory.BUILD,
      provider: 'Fake',
      artifactBounds: { minInputs: 1, maxInputs: 3, minOutputs: 0, maxOutputs: 1 },
      inputs: [props.input, ...props.extraInputs || []],
      outputs: props.output ? [props.output] : undefined,
    };
    this.customConfigKey = props.customConfigKey;
  }

  public bind(_scope: Construct, _stage: codepipeline.IStage, _options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    return {
      configuration: {
        CustomConfigKey: this.customConfigKey,
      },
    };
  }

  public onStateChange(_name: string, _target?: events.IRuleTarget, _options?: events.RuleProps): events.Rule {
    throw new Error('onStateChange() is not available on FakeBuildAction');
  }
}

export interface IFakeSourceActionVariables {
  readonly firstVariable: string;
}

export interface FakeSourceActionProps extends codepipeline.CommonActionProps {
  readonly output: codepipeline.Artifact;

  readonly extraOutputs?: codepipeline.Artifact[];

  readonly region?: string;
}

export class FakeSourceAction implements codepipeline.IAction {
  public readonly inputs?: codepipeline.Artifact[];
  public readonly outputs?: codepipeline.Artifact[];
  public readonly variables: IFakeSourceActionVariables;

  public readonly actionProperties: codepipeline.ActionProperties;

  constructor(props: FakeSourceActionProps) {
    this.actionProperties = {
      ...props,
      category: codepipeline.ActionCategory.SOURCE,
      provider: 'Fake',
      artifactBounds: { minInputs: 0, maxInputs: 0, minOutputs: 1, maxOutputs: 4 },
      outputs: [props.output, ...props.extraOutputs || []],
    };
    this.variables = {
      firstVariable: cdk.Lazy.stringValue({ produce: () => `#{${this.actionProperties.variablesNamespace}.FirstVariable}` }),
    };
  }

  public bind(_scope: Construct, _stage: codepipeline.IStage, _options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    return {};
  }

  public onStateChange(_name: string, _target?: events.IRuleTarget, _options?: events.RuleProps): events.Rule {
    throw new Error('onStateChange() is not available on FakeSourceAction');
  }
}
