import { Construct } from 'constructs';
import { CfnReference } from './private/cfn-reference';
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
  public static readonly ACCOUNT_ID = pseudoString(AWS_ACCOUNTID);
  public static readonly URL_SUFFIX = pseudoString(AWS_URLSUFFIX);
  public static readonly NOTIFICATION_ARNS = Token.asList({ Ref: AWS_NOTIFICATIONARNS }, { displayHint: AWS_NOTIFICATIONARNS });
  public static readonly PARTITION = pseudoString(AWS_PARTITION);
  public static readonly REGION = pseudoString(AWS_REGION);
  public static readonly STACK_ID = pseudoString(AWS_STACKID);
  public static readonly STACK_NAME = pseudoString(AWS_STACKNAME);
  public static readonly NO_VALUE = pseudoString(AWS_NOVALUE);

  private constructor() { }
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
    return this.asString(AWS_ACCOUNTID);
  }

  public get urlSuffix(): string {
    return this.asString(AWS_URLSUFFIX);
  }

  public get notificationArns(): string[] {
    return Token.asList(CfnReference.forPseudo(AWS_NOTIFICATIONARNS, this.scope), {
      displayHint: AWS_NOTIFICATIONARNS,
    });
  }

  public get partition(): string {
    return this.asString(AWS_PARTITION);
  }

  public get region(): string {
    return this.asString(AWS_REGION);
  }

  public get stackId(): string {
    return this.asString(AWS_STACKID);
  }

  public get stackName(): string {
    return this.asString(AWS_STACKNAME);
  }

  private asString(name: string) {
    return Token.asString(CfnReference.forPseudo(name, this.scope), { displayHint: name });
  }
}

function pseudoString(name: string): string {
  // we don't want any ':' in the serialized form,
  // as ':' is the ARN separator,
  // and so we don't want ARN components
  // (which these CFN references like AWS::Partition certainly can be)
  // to contain ':'s themselves
  return Token.asString({ Ref: name }, { displayHint: name.replace('::', '.') });
}
