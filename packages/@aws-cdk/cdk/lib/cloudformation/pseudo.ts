import { CloudFormationToken } from './cloudformation-token';

export class Aws {
  public static get accountId(): string {
    return new AwsAccountId().toString();
  }

  public static get domainSuffix(): string {
    return new AwsDomainSuffix().toString();
  }

  public static get urlSuffix(): string {
    return new AwsURLSuffix().toString();
  }

  public static get notificationARNs(): string[] {
    return new AwsNotificationARNs().toList();
  }

  public static get noValue(): string {
    return new AwsNoValue().toString();
  }

  public static get partition(): string {
    return new AwsPartition().toString();
  }

  public static get region(): string {
    return new AwsRegion().toString();
  }

  public static get stackId(): string {
    return new AwsStackId().toString();
  }

  public static get stackName(): string {
    return new AwsStackName().toString();
  }
}

class PseudoParameter extends CloudFormationToken {
  constructor(name: string) {
    super({ Ref: name }, name);
  }
}

class AwsAccountId extends PseudoParameter {
  constructor() {
    super('AWS::AccountId');
  }
}

class AwsDomainSuffix extends PseudoParameter {
  constructor() {
    super('AWS::DomainSuffix');
  }
}

class AwsURLSuffix extends PseudoParameter {
  constructor() {
    super('AWS::URLSuffix');
  }
}

class AwsNotificationARNs extends PseudoParameter {
  constructor() {
    super('AWS::NotificationARNs');
  }
}

class AwsNoValue extends PseudoParameter {
  constructor() {
    super('AWS::NoValue');
  }
}

class AwsPartition extends PseudoParameter {
  constructor() {
    super('AWS::Partition');
  }
}

class AwsRegion extends PseudoParameter {
  constructor() {
    super('AWS::Region');
  }
}

class AwsStackId extends PseudoParameter {
  constructor() {
    super('AWS::StackId');
  }
}

class AwsStackName extends PseudoParameter {
  constructor() {
    super('AWS::StackName');
  }
}
