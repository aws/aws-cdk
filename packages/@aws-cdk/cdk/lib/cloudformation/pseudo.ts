import { Construct } from '../core/construct';
import { Token } from '../core/tokens';
import { StackAwareToken } from './cloudformation-token';

export class PseudoParameter extends StackAwareToken {
  constructor(name: string, anchor?: Construct) {
      super({ Ref: name }, name, anchor);
  }
}

export class AwsAccountId extends PseudoParameter {
  constructor(anchor: Construct) {
    super('AWS::AccountId', anchor);
  }
}

export class AwsDomainSuffix extends PseudoParameter {
  constructor(anchor: Construct) {
    super('AWS::DomainSuffix', anchor);
  }
}

export class AwsURLSuffix extends PseudoParameter {
  constructor(anchor: Construct) {
    super('AWS::URLSuffix', anchor);
  }
}

export class AwsNotificationARNs extends PseudoParameter {
  constructor(anchor: Construct) {
    super('AWS::NotificationARNs', anchor);
  }
}

export class AwsNoValue extends Token {
  constructor() {
    super({ Ref:  'AWS::NoValue' });
  }
}

export class AwsPartition extends PseudoParameter {
  constructor(anchor: Construct) {
    super('AWS::Partition', anchor);
  }
}

export class AwsRegion extends PseudoParameter {
  constructor(anchor: Construct | undefined) {
    super('AWS::Region', anchor);
  }
}

export class AwsStackId extends PseudoParameter {
  constructor(anchor: Construct) {
    super('AWS::StackId', anchor);
  }
}

export class AwsStackName extends PseudoParameter {
  constructor(anchor: Construct) {
    super('AWS::StackName', anchor);
  }
}
