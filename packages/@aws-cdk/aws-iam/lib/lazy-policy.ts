import { Aws, CfnRefElement, Construct, Lazy, Resource } from '@aws-cdk/core';
import { IGroup } from './group';
import { CfnPolicy } from './iam.generated';
import { IPolicy, Policy, PolicyProps } from './policy';
import { PolicyStatement } from './policy-statement';
import { IRole } from './role';
import { IUser } from './user';

export class LazyPolicy extends Resource implements IPolicy {
  // private readonly scope: Construct;
  // private readonly id: string;
  private readonly policyProps?: PolicyProps;
  private readonly statements: PolicyStatement[];

  private policy?: Policy;

  constructor(scope: Construct, id: string, policyProps: PolicyProps | undefined) {
    super(scope, id);

    // this.scope = scope;
    // this.id = id;
    this.policyProps = policyProps;
    this.statements = (policyProps && policyProps.statements) || [];

    const self = this;
    class CustomCfnPolicy extends CfnPolicy {
      constructor(s: Construct, i: string) {
        super(s, i, {
          groups: [],
          roles: [],
          users: [],
          policyName: self.policyName,
          policyDocument: {},
        });
      }

      public get ref(): string {
        return Lazy.stringValue({ produce: () => {
          if (self.policy) {
            return (self.policy.node.defaultChild as CfnRefElement).ref;
          } else {
            return Aws.NO_VALUE;
          }
        }});
      }

      public get logicalId(): string {
        return Lazy.stringValue({ produce: () => {
          if (self.policy) {
            return (self.policy.node.defaultChild as CfnRefElement).logicalId;
          } else {
            return Aws.NO_VALUE;
          }
        }});
      }
    }
    this.node.defaultChild = new CustomCfnPolicy(this, 'Resource');
  }

  // public get node(): ConstructNode {
  //   if (this.policy) {
  //     return this.policy.node;
  //   } else {
  //     // omit the getter to not fall into an endless loop
  //     return (this as any).node;
  //   }
  // }

  public get policyName(): string {
    return Lazy.stringValue({ produce: () => {
      if (this.policy) {
        return this.policy.policyName;
      } else {
        return Aws.NO_VALUE;
      }
    }});
  }

  public addStatements(...statements: PolicyStatement[]): void {
    this.statements.push(...statements);
  }

  public attachToGroup(group: IGroup): void {
    this.instantiate().attachToGroup(group);
  }

  public attachToRole(role: IRole): void {
    this.instantiate().attachToRole(role);
  }

  public attachToUser(user: IUser): void {
    this.instantiate().attachToUser(user);
  }

  private instantiate(): Policy {
    if (!this.policy) {
      // this.policy = new Policy(this.scope, this.id, {
      this.policy = new Policy(this, 'Default', {
        statements: this.statements,
        ...this.policyProps,
      });

      this.node.defaultChild = this.policy.node.defaultChild;
    }

    return this.policy;
  }

  // private get isInstantiated(): boolean {
  //   return !!this.policy;
  // }
}
