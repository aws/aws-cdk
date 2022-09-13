import { Pipeline } from '@aws-cdk/aws-codepipeline';
import { IAspect, Stack, Token, Annotations } from '@aws-cdk/core';
import { CodePipeline } from '@aws-cdk/pipelines';
import { IConstruct } from 'constructs';
import { IApplication } from '../application';
import { AutomaticApplication } from '../automatic-application';
import { SharePermission } from '../common';

/**
 * Aspect class, this will visit each node from the provided construct once.
 *
 * For every stack node visited, this class will be responsible to associate
 * the stack to the application.
 */
abstract class StackAssociatorBase implements IAspect {
  protected abstract readonly application: IApplication;
  protected abstract readonly automaticApplication?: AutomaticApplication;

  protected readonly sharedAccounts: Set<string> = new Set();
  protected pipelineStages: Set<string> = new Set();

  public visit(node: IConstruct): void {
    if (node instanceof CodePipeline) {
      this.pipelineStages = this.getPipelineStages(node);
    }

    // verify if a stage in a particular stack is associated to Application.
    if (this.automaticApplication != undefined && node instanceof Pipeline) {
      this.pipelineStages.forEach(( customStage ) => {
        var stageAssociated = this.automaticApplication?.isStageAssociated(customStage, node.stack.stackName);
        if (!stageAssociated) {
          this.error(node, 'Associate Stage: ' + customStage + ' to ensure all stacks in your cdk app are associated with AppRegistry. '
                + 'You can use AutomaticApplication.associateStage to associate any stage.');
        }
      });
    }

    if (Stack.isStack(node)) {
      this.handleCrossRegionStack(node);
      this.handleCrossAccountStack(node);
      this.associate(node);
    }
  }

  /**
   * Associate a stage stack to the given application.
   *
   * @param node A Stage stack.
   */
  private associate(node: Stack): void {
    this.application.associateApplicationWithResource(node);
  }

  /**
   * Adds an error annotation to a node.
   *
   * @param node The scope to add the error to.
   * @param message The error message.
   */
  private error(node: IConstruct, message: string): void {
    Annotations.of(node).addError(message);
  }

  /**
   * Adds a warning annotation to a node.
   *
   * @param node The scope to add the warning to.
   * @param message The error message.
   */
  private warning(node: IConstruct, message: string): void {
    Annotations.of(node).addWarning(message);
  }

  /**
   * Handle cross-region association. AppRegistry do not support
   * cross region association at this moment,
   * If any stack is evaluated as cross-region than that of application,
   * we will throw an error.
   *
   * @param node Cfn stack.
   */
  private handleCrossRegionStack(node: Stack): void {
    if (this.isRegionUnresolved(this.application.env.region, node.region)) {
      this.warning(node, 'Environment agnostic stack determined, AppRegistry association might not work as expected in case you deploy cross-region or cross-account stack.');
      return;
    }

    if (node.region != this.application.env.region) {
      this.error(node, 'AppRegistry does not support cross region associations. Application region '
      + this.application.env.region + ', stack region ' + node.region);
    }
  }

  /**
   * Handle cross-account association.
   * If any stack is evaluated as cross-account than that of application,
   * then we will share the application to the stack owning account.
   *
   * @param node Cfn stack.
   */
  private handleCrossAccountStack(node: Stack): void {
    if (this.isAccountUnresolved(this.application.env.account!, node.account)) {
      this.warning(node, 'Environment agnostic stack determined, AppRegistry association might not work as expected in case you deploy cross-region or cross-account stack.');
      return;
    }

    if (node.account != this.application.env.account && !this.sharedAccounts.has(node.account)) {
      this.application.shareApplication({
        accounts: [node.account],
        sharePermission: SharePermission.ALLOW_ACCESS,
      });

      this.sharedAccounts.add(node.account);
    }
  }

  /**
   * Verifies if application or the visited node is region agnostic.
   *
   * @param applicationRegion Region of the application.
   * @param nodeRegion Region of the visited node.
   */
  private isRegionUnresolved(applicationRegion: string, nodeRegion: string): boolean {
    return Token.isUnresolved(applicationRegion) || Token.isUnresolved(nodeRegion);
  }

  /**
   * Verifies if application or the visited node is account agnostic.
   *
   * @param applicationAccount Account of the application.
   * @param nodeAccount Account of the visited node.
   */
  private isAccountUnresolved(applicationAccount: string, nodeAccount: string): boolean {
    return Token.isUnresolved(applicationAccount) || Token.isUnresolved(nodeAccount);
  }

  /**
   * Get custom defined stage names for the given pipeline.
   *
   * @param pipeline Code Pipeline.
   */
  private getPipelineStages(pipeline: CodePipeline): Set<string> {
    const stageNames = new Set<string>();
    pipeline.waves.forEach( ( wave ) => {
      wave.stages.forEach( ( stage ) => {
        stageNames.add(stage.stageName);
      });
    });

    return stageNames;
  }
}

export class AutomaticApplicationStageStackAssociator extends StackAssociatorBase {
  protected readonly application: IApplication;
  protected readonly automaticApplication?: AutomaticApplication;

  constructor(app: AutomaticApplication) {
    super();
    this.application = app.appRegistryApplication;
    this.automaticApplication = app;
  }
}

export class StageStackAssociator extends StackAssociatorBase {
  protected readonly application: IApplication;
  protected readonly automaticApplication?: AutomaticApplication;

  constructor(app: IApplication) {
    super();
    this.application = app;
  }
}
