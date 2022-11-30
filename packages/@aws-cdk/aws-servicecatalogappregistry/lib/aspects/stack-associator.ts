import { IAspect, Stack, Stage, Annotations } from '@aws-cdk/core';
import { IConstruct } from 'constructs';
import { IApplication } from '../application';
import { ApplicationAssociator } from '../application-associator';
import { SharePermission } from '../common';
import { isRegionUnresolved, isAccountUnresolved } from '../private/utils';

/**
 * Aspect class, this will visit each node from the provided construct once.
 *
 * For every stack node visited, this class will be responsible to associate
 * the stack to the application.
 */
abstract class StackAssociatorBase implements IAspect {
  protected abstract readonly application: IApplication;
  protected abstract readonly applicationAssociator?: ApplicationAssociator;

  protected readonly sharedAccounts: Set<string> = new Set();

  public visit(node: IConstruct): void {
    // verify if a stage in a particular stack is associated to Application.
    node.node.children.forEach((childNode) => {
      if (Stage.isStage(childNode)) {
        var stageAssociated = this.applicationAssociator?.isStageAssociated(childNode);
        if (stageAssociated === false) {
          this.error(childNode, 'Associate Stage: ' + childNode.stageName + ' to ensure all stacks in your cdk app are associated with AppRegistry. '
                        + 'You can use ApplicationAssociator.associateStage to associate any stage.');
        }
      }
    });

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
    this.application.associateApplicationWithStack(node);
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
    if (isRegionUnresolved(this.application.env.region, node.region)) {
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
    if (isAccountUnresolved(this.application.env.account!, node.account)) {
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
}

export class CheckedStageStackAssociator extends StackAssociatorBase {
  protected readonly application: IApplication;
  protected readonly applicationAssociator?: ApplicationAssociator;

  constructor(app: ApplicationAssociator) {
    super();
    this.application = app.appRegistryApplication();
    this.applicationAssociator = app;
  }
}

export class StageStackAssociator extends StackAssociatorBase {
  protected readonly application: IApplication;
  protected readonly applicationAssociator?: ApplicationAssociator;

  constructor(app: IApplication) {
    super();
    this.application = app;
  }
}
