import { Lazy } from '@aws-cdk/core';
import { IPolicy, Policy } from './policy';

export class LazyPolicy extends Policy implements IPolicy {
  private _policyName!: string;

  public get policyName(): string {
    return Lazy.stringValue({ produce: () => {
      if (this.isAttached) {
        return super.policyName;
      } else {
        return this._policyName;
      }
    }});
  }

  public set policyName(value: string) {
    this._policyName = value;
  }

  public get ref(): string {
    return Lazy.stringValue({ produce: () => {
      if (this.isAttached) {
        return super.policyName;
      } else {
        throw Error('Cannot get ref of unattached/empty LazyPolicy');
      }
    }});
  }

  protected prepare() {
    if (!this.isMeaningful) {
      this.node.deleteChild('Resource');
    }
  }

  protected validate(): string[] {
    // Inherited validate would validate that we are attached and
    // have statements. This version of policy does not validate that,
    // it just won't render.
    return [];
  }

  private get isMeaningful() {
    return this.document.statementCount > 0 && this.isAttached;
  }
}