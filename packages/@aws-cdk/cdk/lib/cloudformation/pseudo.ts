import { Construct } from '../core/construct';
import { Token } from '../core/tokens';
import { CfnReference } from './tokens';

/**
 * Accessor for pseudo parameters
 *
 * Since pseudo parameters need to be anchored to a stack somewhere in the
 * construct tree, this class takes an anchor parameter; the pseudo parameter
 * values can be obtained as properties from an anchored object.
 */
export class Aws {
  constructor(private readonly anchor: Construct) {
  }

  public get accountId(): string {
    return new AwsAccountId(this.anchor).toString();
  }

  public get urlSuffix(): string {
    return new AwsURLSuffix(this.anchor).toString();
  }

  public get notificationArns(): string[] {
    return new AwsNotificationARNs(this.anchor).toList();
  }

  public get partition(): string {
    return new AwsPartition(this.anchor).toString();
  }

  public get region(): string {
    return new AwsRegion(this.anchor).toString();
  }

  public get stackId(): string {
    return new AwsStackId(this.anchor).toString();
  }

  public get stackName(): string {
    return new AwsStackName(this.anchor).toString();
  }
}

class PseudoParameter extends CfnReference {
  constructor(name: string, anchor: Construct) {
      super({ Ref: name }, name, anchor);
  }
}

class AwsAccountId extends PseudoParameter {
  constructor(anchor: Construct) {
    super('AWS::AccountId', anchor);
  }
}

class AwsURLSuffix extends PseudoParameter {
  constructor(anchor: Construct) {
    super('AWS::URLSuffix', anchor);
  }
}

class AwsNotificationARNs extends PseudoParameter {
  constructor(anchor: Construct) {
    super('AWS::NotificationARNs', anchor);
  }
}

export class AwsNoValue extends Token {
  constructor() {
    super({ Ref:  'AWS::NoValue' });
  }
}

class AwsPartition extends PseudoParameter {
  constructor(anchor: Construct) {
    super('AWS::Partition', anchor);
  }
}

class AwsRegion extends PseudoParameter {
  constructor(anchor: Construct) {
    super('AWS::Region', anchor);
  }
}

class AwsStackId extends PseudoParameter {
  constructor(anchor: Construct) {
    super('AWS::StackId', anchor);
  }
}

class AwsStackName extends PseudoParameter {
  constructor(anchor: Construct) {
    super('AWS::StackName', anchor);
  }
}
