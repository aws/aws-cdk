import { Construct } from '../core/construct';
import { Token } from '../core/tokens';
import { Reference } from './reference';

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
    return new AwsAccountId(undefined).toString();
  }

  public static get urlSuffix(): string {
    return new AwsURLSuffix(undefined).toString();
  }

  public static get notificationArns(): string[] {
    return new AwsNotificationARNs(undefined).toList();
  }

  public static get partition(): string {
    return new AwsPartition(undefined).toString();
  }

  public static get region(): string {
    return new AwsRegion(undefined).toString();
  }

  public static get stackId(): string {
    return new AwsStackId(undefined).toString();
  }

  public static get stackName(): string {
    return new AwsStackName(undefined).toString();
  }

  public static get noValue(): string {
    return new AwsNoValue().toString();
  }
}

/**
 * Accessor for scoped pseudo parameters
 *
 * These pseudo parameters are anchored to a stack somewhere in the construct
 * tree, and their values will be exported automatically.
 */
export class ScopedAws {
  constructor(private readonly scope?: Construct) {
  }

  public get accountId(): string {
    return new AwsAccountId(this.scope).toString();
  }

  public get urlSuffix(): string {
    return new AwsURLSuffix(this.scope).toString();
  }

  public get notificationArns(): string[] {
    return new AwsNotificationARNs(this.scope).toList();
  }

  public get partition(): string {
    return new AwsPartition(this.scope).toString();
  }

  public get region(): string {
    return new AwsRegion(this.scope).toString();
  }

  public get stackId(): string {
    return new AwsStackId(this.scope).toString();
  }

  public get stackName(): string {
    return new AwsStackName(this.scope).toString();
  }
}

class PseudoParameter extends Reference {
  constructor(name: string, scope: Construct | undefined) {
      super({ Ref: name }, name, scope);
  }
}

class AwsAccountId extends PseudoParameter {
  constructor(scope: Construct | undefined) {
    super('AWS::AccountId', scope);
  }
}

class AwsURLSuffix extends PseudoParameter {
  constructor(scope: Construct | undefined) {
    super('AWS::URLSuffix', scope);
  }
}

class AwsNotificationARNs extends PseudoParameter {
  constructor(scope: Construct | undefined) {
    super('AWS::NotificationARNs', scope);
  }
}

export class AwsNoValue extends Token {
  constructor() {
    super({ Ref:  'AWS::NoValue' });
  }
}

class AwsPartition extends PseudoParameter {
  constructor(scope: Construct | undefined) {
    super('AWS::Partition', scope);
  }
}

class AwsRegion extends PseudoParameter {
  constructor(scope: Construct | undefined) {
    super('AWS::Region', scope);
  }
}

class AwsStackId extends PseudoParameter {
  constructor(scope: Construct | undefined) {
    super('AWS::StackId', scope);
  }
}

class AwsStackName extends PseudoParameter {
  constructor(scope: Construct | undefined) {
    super('AWS::StackName', scope);
  }
}
