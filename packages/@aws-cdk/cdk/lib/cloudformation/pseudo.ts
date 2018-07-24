import { Token } from '../core/tokens';

export class PseudoParameter extends Token {
    constructor(name: string) {
        super(() => ({ Ref: name }));
    }
}

export class AwsAccountId extends PseudoParameter {
    constructor() {
        super('AWS::AccountId');
    }
}

export class AwsDomainSuffix extends PseudoParameter {
    constructor() {
        super('AWS::DomainSuffix');
    }
}

export class AwsURLSuffix extends PseudoParameter {
    constructor() {
        super('AWS::URLSuffix');
    }
}

export class AwsNotificationARNs extends PseudoParameter {
    constructor() {
        super('AWS::NotificationARNs');
    }
}

export class AwsNoValue extends PseudoParameter {
    constructor() {
        super('AWS::NoValue');
    }
}

export class AwsPartition extends PseudoParameter {
    constructor() {
        super('AWS::Partition');
    }
}

export class AwsRegion extends PseudoParameter {
    constructor() {
        super('AWS::Region');
    }
}

export class AwsStackId extends PseudoParameter {
    constructor() {
        super('AWS::StackId');
    }
}

export class AwsStackName extends PseudoParameter {
    constructor() {
        super('AWS::StackName');
    }
}
