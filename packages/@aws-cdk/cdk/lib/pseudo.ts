import { CfnReference } from './cfn-reference';
import { Construct } from './construct';
import { Token } from './token';

const AWS_ACCOUNTID = 'AWS::AccountId';
const AWS_URLSUFFIX = 'AWS::URLSuffix';
const AWS_NOTIFICATIONARNS = 'AWS::NotificationARNs';
const AWS_PARTITION = 'AWS::Partition';
const AWS_REGION = 'AWS::Region';
const AWS_STACKID = 'AWS::StackId';
const AWS_STACKNAME = 'AWS::StackName';
const AWS_NOVALUE = 'AWS::NoValue';

/**
 * Accessor for pseudo parameters
 *
 * Since pseudo parameters need to be anchored to a stack somewhere in the
 * construct tree, this class takes an scope parameter; the pseudo parameter
 * values can be obtained as properties from an scoped object.
 */
export class Aws {
  private constructor() {
  }

  public static get accountId(): string {
    return new UnscopedPseudo(AWS_ACCOUNTID).toString();
  }

  public static get urlSuffix(): string {
    return new UnscopedPseudo(AWS_URLSUFFIX).toString();
  }

  public static get notificationArns(): string[] {
    return new UnscopedPseudo(AWS_NOTIFICATIONARNS).toList();
  }

  public static get partition(): string {
    return new UnscopedPseudo(AWS_PARTITION).toString();
  }

  public static get region(): string {
    return new UnscopedPseudo(AWS_REGION).toString();
  }

  public static get stackId(): string {
    return new UnscopedPseudo(AWS_STACKID).toString();
  }

  public static get stackName(): string {
    return new UnscopedPseudo(AWS_STACKNAME).toString();
  }

  public static get noValue(): string {
    return new UnscopedPseudo(AWS_NOVALUE).toString();
  }
}

/**
 * Accessor for scoped pseudo parameters
 *
 * These pseudo parameters are anchored to a stack somewhere in the construct
 * tree, and their values will be exported automatically.
 */
export class ScopedAws {
  constructor(private readonly scope: Construct) {
  }

  public get accountId(): string {
    return CfnReference.forPseudo(AWS_ACCOUNTID, this.scope).toString();
  }

  public get urlSuffix(): string {
    return CfnReference.forPseudo(AWS_URLSUFFIX, this.scope).toString();
  }

  public get notificationArns(): string[] {
    return CfnReference.forPseudo(AWS_NOTIFICATIONARNS, this.scope).toList();
  }

  public get partition(): string {
    return CfnReference.forPseudo(AWS_PARTITION, this.scope).toString();
  }

  public get region(): string {
    return CfnReference.forPseudo(AWS_REGION, this.scope).toString();
  }

  public get stackId(): string {
    return CfnReference.forPseudo(AWS_STACKID, this.scope).toString();
  }

  public get stackName(): string {
    return CfnReference.forPseudo(AWS_STACKNAME, this.scope).toString();
  }
}

class UnscopedPseudo extends Token {
  constructor(name: string) {
    super({ Ref: name }, name);
  }
}