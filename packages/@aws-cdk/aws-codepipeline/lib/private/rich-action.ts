import { IAction } from '../action';

/**
 * Helper routines to work with Actions
 *
 * Can't put these on Action themselves since we only have an interface
 * and every library would need to reimplement everything (there is no
 * `ActionBase`).
 *
 * So here go the members that should have gone onto the Action class
 * but can't.
 *
 * It was probably my own idea but I don't want it anymore:
 * https://github.com/aws/aws-cdk/issues/10393
 */
export class RichAction {
  constructor(private readonly action: IAction) {
  }

  /**
   * The account this action wants to run in
   *
   * `undefined` if no sources of accounts have been configured.
   */
  public get account(): string | undefined {
    return this.action.actionProperties.role?.env.account
      ?? this.action.actionProperties?.resource?.env.account
      ?? this.action.actionProperties.account;
  }

  /**
   * The region this action wants to run in
   *
   * `undefined` if no sources of regions have been configured.
   */
  public get region(): string | undefined {
    return this.action.actionProperties.resource?.env.region
      ?? this.action.actionProperties.region;
  }
}