import { Construct } from '../core/construct';
import { Token } from '../core/tokens';
import { CfnReference } from '../core/tokens/cfn-tokens';

/**
 * Accessor for pseudo parameters
 *
 * Since pseudo parameters need to be anchored to a stack somewhere in the
 * construct tree, this class takes an scope parameter; the pseudo parameter
 * values can be obtained as properties from an scoped object.
 */
export class Aws {
  constructor(private readonly scope: Construct) {
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

class PseudoParameter extends CfnReference {
  constructor(name: string, scope: Construct) {
      super({ Ref: name }, name, scope);
  }
}

class AwsAccountId extends PseudoParameter {
  constructor(scope: Construct) {
    super('AWS::AccountId', scope);
  }
}

class AwsURLSuffix extends PseudoParameter {
  constructor(scope: Construct) {
    super('AWS::URLSuffix', scope);
  }
}

class AwsNotificationARNs extends PseudoParameter {
  constructor(scope: Construct) {
    super('AWS::NotificationARNs', scope);
  }
}

export class AwsNoValue extends Token {
  constructor() {
    super({ Ref:  'AWS::NoValue' });
  }
}

class AwsPartition extends PseudoParameter {
  constructor(scope: Construct) {
    super('AWS::Partition', scope);
  }
}

class AwsRegion extends PseudoParameter {
  constructor(scope: Construct) {
    super('AWS::Region', scope);
  }
}

class AwsStackId extends PseudoParameter {
  constructor(scope: Construct) {
    super('AWS::StackId', scope);
  }
}

class AwsStackName extends PseudoParameter {
  constructor(scope: Construct) {
    super('AWS::StackName', scope);
  }
}
