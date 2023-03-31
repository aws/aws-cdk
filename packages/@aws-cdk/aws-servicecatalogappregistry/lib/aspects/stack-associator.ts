import { IAspect, Stack, Stage, Annotations, Names } from '@aws-cdk/core';
import { IConstruct } from 'constructs';
import { IApplication } from '../application';
import { ApplicationAssociator } from '../application-associator';
import { hashValues, SharePermission } from '../common';
import { isRegionUnresolved, isAccountUnresolved } from '../private/utils';

export interface StackAssociatorBaseProps {
  /**
  * Indicates if the target Application should be shared with the cross-account stack owners and then
  * associated with the cross-account stacks.
  *
  * @default - false
  */
  readonly associateCrossAccountStacks?: boolean;
}

/**
 * Aspect class, this will visit each node from the provided construct once.
 *
 * For every stack node visited, this class will be responsible to associate
 * the stack to the application.
 */
abstract class StackAssociatorBase implements IAspect {
  protected abstract readonly application: IApplication;
  protected abstract readonly applicationAssociator?: ApplicationAssociator;
  protected readonly associateCrossAccountStacks?: boolean;

  protected readonly sharedAccounts: Set<string> = new Set();

  constructor(props?: StackAssociatorBaseProps) {
    this.associateCrossAccountStacks = props?.associateCrossAccountStacks ?? false;
  }

  public visit(node: IConstruct): void {
    // verify if a stage in a particular stack is associated to Application.
    node.node.children.forEach((childNode) => {
      if (Stage.isStage(childNode)) {
        var stageAssociated = this.applicationAssociator?.isStageAssociated(childNode);
        if (stageAssociated === false) {
          this.warning(childNode, 'Associate Stage: ' + childNode.stageName + ' to ensure all stacks in your cdk app are associated with AppRegistry. '
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
    if (!isRegionUnresolved(this.application.env.region, node.region)
      && node.account != this.application.env.account
      && !this.associateCrossAccountStacks) {
      // Skip association when cross-account sharing/association is not enabled.
      // A warning will have been displayed as part of `handleCrossAccountStack()`.
      return;
    }
    this.application.associateApplicationWithStack(node);
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
      this.warning(node, 'AppRegistry does not support cross region associations, deployment might fail if there is cross region stacks in the app. Application region '
      + this.application.env.region + ', stack region ' + node.region);
    }
  }

  /**
   * Handle cross-account association.
   * If any stack is evaluated as cross-account than that of application, and cross-account option is enabled,
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
      if (this.associateCrossAccountStacks) {
        const shareId = `ApplicationShare${hashValues(Names.nodeUniqueId(this.application.node), Names.nodeUniqueId(node.node))}`;
        this.application.shareApplication(shareId, {
          name: shareId,
          accounts: [node.account],
          sharePermission: SharePermission.ALLOW_ACCESS,
        });

        this.sharedAccounts.add(node.account);
      } else {
        this.warning(node, 'Cross-account stack detected but application sharing and association will be skipped because cross-account option is not enabled.');
        return;
      }
    }
  }
}

export class CheckedStageStackAssociator extends StackAssociatorBase {
  protected readonly application: IApplication;
  protected readonly applicationAssociator?: ApplicationAssociator;

  constructor(app: ApplicationAssociator, props?: StackAssociatorBaseProps) {
    super(props);
    this.application = app.appRegistryApplication;
    this.applicationAssociator = app;
  }
}

export class StageStackAssociator extends StackAssociatorBase {
  protected readonly application: IApplication;
  protected readonly applicationAssociator?: ApplicationAssociator;

  constructor(app: IApplication, props?: StackAssociatorBaseProps) {
    super(props);
    this.application = app;
  }
}
