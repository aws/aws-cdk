import { Construct } from 'constructs';
import { Arn } from './arn';
import { Stack } from './stack';
import { DefaultStackSynthesizer } from './stack-synthesizers';
import { Token } from './token';

export const PERMISSIONS_BOUNDARY_CONTEXT_KEY = '@aws-cdk/core:permissionsBoundary';
/**
 * Options for binding a Permissions Boundary to a construct scope
 */
export interface PermissionsBoundaryBindOptions {}

/**
 * Apply a permissions boundary to all IAM Roles and Users
 * within a specific scope
 */
export abstract class PermissionsBoundary {
  /**
   * The default bootstrap permission boundary
   * {@link DefaultStackSynthesizer.DEFAULT_PERMISSIONS_BOUNDARY_NAME} will be applied
   * to all IAM Roles and Users within the given scope
   *
   * @example
   * declare const app: App;
   * new Stage(app, 'ProdStage', {
   *   permissionsBoundary: PermissionsBoundary.default(),
   * });
   */
  public static default(): PermissionsBoundary {
    return new PermissionsBoundaryManager(DefaultStackSynthesizer.DEFAULT_PERMISSIONS_BOUNDARY_NAME);
  }

  /**
   * Apply a permissions boundary with the given name to all IAM Roles
   * and Users created within a scope. The name can include the '${Qualifier}' string
   * which will be replaced by the stack qualifier.
   *
   * @param name the name of the permissions boundary policy
   *
   * @example
   * declare const app: App;
   * new Stage(app, 'ProdStage', {
   *   permissionsBoundary: PermissionsBoundary.fromName('my-custom-permissions-boundary'),
   * });
   */
  public static fromName(name: string): PermissionsBoundary {
    return new PermissionsBoundaryManager(name);
  }

  /**
   * Apply a permissions boundary with the given ARN to all IAM Roles
   * and Users created within a scope. The ARN can include the '${Qualifier}' string
   * which will be replaced by the stack qualifier.
   h
   * @param arn the ARN of the permissions boundary policy
   *
   * @example
   * declare const app: App;
   * new Stage(app, 'ProdStage', {
   *   permissionsBoundary: PermissionsBoundary.fromArn('arn:aws:iam::${AWS::AccountId}:policy/my-custom-permissions-boundary'),
   * });
   */
  public static fromArn(arn: string): PermissionsBoundary {
    let name;
    if (!Token.isUnresolved(arn)) {
      name = Arn.parse(arn);
    }
    return new PermissionsBoundaryManager(name?.resourceName, arn);
  }

  /**
   * Apply the permission boundary to the given scope
   *
   * Different permission boundaries can be applied to different scopes
   * and the most specific will be applied.
   */
  public abstract bind(scope: Construct, options?: PermissionsBoundaryBindOptions): void;
}

/**
 * Apply a permissions boundary to all IAM Roles and Users
 * within a specific scope
 *
 * A permissions boundary is typically applied at the `Stage` scope.
 * This allows setting different permissions boundaries per Stage. For
 * example, you may _not_ apply a boundary to the `Dev` stage which deploys
 * to a personal dev account, but you _do_ apply the default boundary to the
 * `Prod` stage.
 *
 * It is possible to apply different permissions boundaries to different scopes
 * within your app. In this case the most specifically applied one wins
 *
 * @example
 * // no permissions boundary for dev stage
 * new Stage(app, 'DevStage');
 *
 * // default boundary for prod stage
 * const prodStage = new Stage(app, 'ProdStage', {
 *   permissionsBoundary: PermissionsBoundary.default(),
 * });
 *
 * // overriding the pb applied for this stack
 * new Stack(prodStage, 'ProdStack1', {
 *   permissionsBoundary: PermissionsBoundary.fromName('custom-pb'),
 * });
 *
 * // will inherit the permissions boundary from the stage
 * new Stack(prodStage, 'ProdStack2');
 */
export class PermissionsBoundaryManager extends PermissionsBoundary {
  /**
   * If a permissions boundary has been applied on a scope (includes all parent scopes)
   * then this will return the ARN of the permissions boundary.
   *
   * This will return the permissions boundary that has been applied to the most
   * specific scope.
   *
   * @example
   * declare const app: App
   * const stage = new Stage(app, 'stage', {
   *   permissionsBoundary: PermissionsBoundary.default(),
   * });
   *
   * const stack = new Stack(stage, 'Stack', {
   *   permissionsBoundary: PermissionsBoundary.fromName('some-other-pb'),
   * });
   *
   * PermissionsBoundary.arn(stack) === 'arn:aws:iam::${AWS::AccountId}:policy/some-other-pb';
   *
   * @param scope the construct scope to retrieve the permissions boundary name from
   * @returns the name of the permissions boundary or undefined if not set
   */
  public static arn(scope: Construct): string | undefined {
    const context = scope.node.tryGetContext(PERMISSIONS_BOUNDARY_CONTEXT_KEY);
    if (context && typeof context === 'object') {
      if (context.hasOwnProperty('arn') && context.arn) {
        return context.arn;
      } else if (context.hasOwnProperty('name') && context.name) {
        return Stack.of(scope).formatArn({
          service: 'iam',
          region: '',
          resource: 'policy',
          resourceName: context.name,
        });
      }
    }
    return;
  }


  constructor(private readonly policyName?: string, private readonly policyArn?: string) {
    super();
  }

  public bind(scope: Construct, _options: PermissionsBoundaryBindOptions = {}): void {
    scope.node.setContext(PERMISSIONS_BOUNDARY_CONTEXT_KEY, {
      name: this.policyName,
      arn: this.policyArn,
    });
  }
}
