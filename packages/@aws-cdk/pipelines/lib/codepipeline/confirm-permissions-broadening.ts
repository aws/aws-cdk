import { IStage } from '@aws-cdk/aws-codepipeline';
import * as cpa from '@aws-cdk/aws-codepipeline-actions';
import * as sns from '@aws-cdk/aws-sns';
import { Stage } from '@aws-cdk/core';
import { Node } from 'constructs';
import { CodePipeline } from './codepipeline';
import { CodePipelineActionFactoryResult, ICodePipelineActionFactory, ProduceActionOptions } from './codepipeline-action-factory';
import { Step } from '../blueprint';
import { ApplicationSecurityCheck } from '../private/application-security-check';

/**
 * Properties for a `PermissionsBroadeningCheck`
 */
export interface PermissionsBroadeningCheckProps {
  /**
   * The CDK Stage object to check the stacks of
   *
   * This should be the same Stage object you are passing to `addStage()`.
   */
  readonly stage: Stage;

  /**
   * Topic to send notifications when a human needs to give manual confirmation
   *
   * @default - no notification
   */
  readonly notificationTopic?: sns.ITopic
}

/**
 * Pause the pipeline if a deployment would add IAM permissions or Security Group rules
 *
 * This step is only supported in CodePipeline pipelines.
 */
export class ConfirmPermissionsBroadening extends Step implements ICodePipelineActionFactory {
  constructor(id: string, private readonly props: PermissionsBroadeningCheckProps) {
    super(id);
  }

  public produceAction(stage: IStage, options: ProduceActionOptions): CodePipelineActionFactoryResult {
    const sec = this.getOrCreateSecCheck(options.pipeline);
    this.props.notificationTopic?.grantPublish(sec.cdkDiffProject);

    const variablesNamespace = Node.of(this.props.stage).addr;

    const approveActionName = `${options.actionName}.Confirm`;
    stage.addAction(new cpa.CodeBuildAction({
      runOrder: options.runOrder,
      actionName: `${options.actionName}.Check`,
      input: options.artifacts.toCodePipeline(options.pipeline.cloudAssemblyFileSet),
      project: sec.cdkDiffProject,
      variablesNamespace,
      environmentVariables: {
        STAGE_PATH: { value: Node.of(this.props.stage).path },
        STAGE_NAME: { value: stage.stageName },
        ACTION_NAME: { value: approveActionName },
        ...this.props.notificationTopic ? {
          NOTIFICATION_ARN: { value: this.props.notificationTopic.topicArn },
          NOTIFICATION_SUBJECT: { value: `Confirm permission broadening in ${this.props.stage.stageName}` },
        } : {},
      },
    }));

    stage.addAction(new cpa.ManualApprovalAction({
      actionName: approveActionName,
      runOrder: options.runOrder + 1,
      additionalInformation: `#{${variablesNamespace}.MESSAGE}`,
      externalEntityLink: `#{${variablesNamespace}.LINK}`,
    }));

    return { runOrdersConsumed: 2 };
  }

  private getOrCreateSecCheck(pipeline: CodePipeline): ApplicationSecurityCheck {
    const id = 'PipelinesSecurityCheck';
    const existing = Node.of(pipeline).tryFindChild(id);
    if (existing) {
      if (!(existing instanceof ApplicationSecurityCheck)) {
        throw new Error(`Expected '${Node.of(existing).path}' to be 'ApplicationSecurityCheck' but was '${existing}'`);
      }
      return existing;
    }

    return new ApplicationSecurityCheck(pipeline, id, {
      codePipeline: pipeline.pipeline,
    });
  }
}