import { Construct } from '../core/construct';
import { Token } from '../core/tokens';
import { StackAwareToken } from './cloudformation-token';

export class PseudoParameter extends StackAwareToken {
  constructor(anchor: Construct | undefined, name: string) {
      super(anchor, { Ref: name }, name);
  }
}

export class AwsAccountId extends PseudoParameter {
  constructor(anchor: Construct) {
    super(anchor, 'AWS::AccountId');
  }
}

export class AwsDomainSuffix extends PseudoParameter {
  constructor(anchor: Construct) {
    super(anchor, 'AWS::DomainSuffix');
  }
}

export class AwsURLSuffix extends PseudoParameter {
  constructor(anchor: Construct) {
    super(anchor, 'AWS::URLSuffix');
  }
}

export class AwsNotificationARNs extends PseudoParameter {
  constructor(anchor: Construct) {
    super(anchor, 'AWS::NotificationARNs');
  }
}

export class AwsNoValue extends Token {
  constructor() {
    super({ Ref:  'AWS::NoValue' });
  }
}

export class AwsPartition extends PseudoParameter {
  constructor(anchor: Construct) {
    super(anchor, 'AWS::Partition');
  }
}

export class AwsRegion extends PseudoParameter {
  constructor(anchor: Construct | undefined) {
    super(anchor, 'AWS::Region');
  }
}

export class AwsStackId extends PseudoParameter {
  constructor(anchor: Construct) {
    super(anchor, 'AWS::StackId');
  }
}

export class AwsStackName extends PseudoParameter {
  constructor(anchor: Construct) {
    super(anchor, 'AWS::StackName');
  }
}
