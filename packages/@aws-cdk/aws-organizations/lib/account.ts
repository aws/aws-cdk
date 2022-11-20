import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IOrganizationalUnit } from './organizational-unit';
import { CfnAccount } from './organizations.generated';

export interface IAccount extends IResource {
  readonly accountId: string;
  readonly accountArn: string;
  readonly accountName: string;
  readonly email: string;
}

export interface AccountOptions {
  readonly accountName: string;
  readonly email: string;
  readonly roleName?: string;
}

export interface AccountProps extends AccountOptions {
  readonly parent?: IOrganizationalUnit;
}

abstract class AccountBase extends Resource implements IAccount {
  public abstract readonly accountId: string;
  public abstract readonly accountArn: string;
  public abstract readonly accountName: string;
  public abstract readonly email: string;

  public abstract readonly accountJoinedMethod: string;
  public abstract readonly accountJoinedTimestamp: string;
  public abstract readonly accountStatus: string;
}

export interface AccountAttributes extends AccountOptions {
  readonly accountId: string;
  readonly accountArn: string;

  readonly accountJoinedMethod: string;
  readonly accountJoinedTimestamp: string;
  readonly accountStatus: string;
}

export class Account extends AccountBase {
  public static fromAccountAttributes(scope: Construct, id: string, attrs: AccountAttributes): IAccount {
    class Import extends AccountBase {
      public readonly accountId: string = attrs.accountId;
      public readonly accountArn: string = attrs.accountArn;
      public readonly accountName: string = attrs.accountName;
      public readonly email: string = attrs.email;

      public readonly accountJoinedMethod: string = attrs.accountJoinedMethod;
      public readonly accountJoinedTimestamp: string = attrs.accountJoinedTimestamp;
      public readonly accountStatus: string = attrs.accountStatus;
    }

    return new Import(scope, id);
  };

  public readonly accountId: string;
  public readonly accountArn: string;
  public readonly accountName: string;
  public readonly email: string;

  public readonly accountJoinedMethod: string;
  public readonly accountJoinedTimestamp: string;
  public readonly accountStatus: string;

  public constructor(scope: Construct, id: string, props: AccountProps) {
    super(scope, id);

    const resource = new CfnAccount(this, 'Resource', {
      accountName: props.accountName,
      email: props.email,
      roleName: props.roleName ?? 'OrganizationAccountAccessRole',
      parentIds: props.parent ? [props.parent.organizationalUnitId] : undefined,
    });

    this.accountId = resource.ref;
    this.accountArn = resource.attrArn;
    this.accountName = props.accountName;
    this.email = props.email;

    this.accountJoinedMethod = resource.attrJoinedMethod;
    this.accountJoinedTimestamp = resource.attrJoinedTimestamp;
    this.accountStatus = resource.attrStatus;
  }
}
