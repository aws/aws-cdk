import { CfnReference } from './cfn-reference';
import { Construct } from './construct';
import { Intrinsic } from './intrinsic';
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
    return Token.encodeAsString(new UnscopedPseudo(AWS_ACCOUNTID));
  }

  public static get urlSuffix(): string {
    return Token.encodeAsString(new UnscopedPseudo(AWS_URLSUFFIX));
  }

  public static get notificationArns(): string[] {
    return Token.encodeAsList(new UnscopedPseudo(AWS_NOTIFICATIONARNS));
  }

  public static get partition(): string {
    return Token.encodeAsString(new UnscopedPseudo(AWS_PARTITION));
  }

  public static get region(): string {
    return Token.encodeAsString(new UnscopedPseudo(AWS_REGION));
  }

  public static get stackId(): string {
    return Token.encodeAsString(new UnscopedPseudo(AWS_STACKID));
  }

  public static get stackName(): string {
    return Token.encodeAsString(new UnscopedPseudo(AWS_STACKNAME));
  }

  public static get noValue(): string {
    return Token.encodeAsString(new UnscopedPseudo(AWS_NOVALUE));
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
    return Token.encodeAsString(CfnReference.forPseudo(AWS_ACCOUNTID, this.scope));
  }

  public get urlSuffix(): string {
    return Token.encodeAsString(CfnReference.forPseudo(AWS_URLSUFFIX, this.scope));
  }

  public get notificationArns(): string[] {
    return Token.encodeAsList(CfnReference.forPseudo(AWS_NOTIFICATIONARNS, this.scope));
  }

  public get partition(): string {
    return Token.encodeAsString(CfnReference.forPseudo(AWS_PARTITION, this.scope));
  }

  public get region(): string {
    return Token.encodeAsString(CfnReference.forPseudo(AWS_REGION, this.scope));
  }

  public get stackId(): string {
    return Token.encodeAsString(CfnReference.forPseudo(AWS_STACKID, this.scope));
  }

  public get stackName(): string {
    return Token.encodeAsString(CfnReference.forPseudo(AWS_STACKNAME, this.scope));
  }
}

class UnscopedPseudo extends Intrinsic {
  constructor(name: string) {
    super({ Ref: name }, { displayHint: name });
  }
}
