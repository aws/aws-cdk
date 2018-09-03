import { Construct, Output } from '@aws-cdk/cdk';
import { RuleArn } from './events.generated';

export interface EventRuleRefProps {
    /**
     * The value of the event rule Amazon Resource Name (ARN), such as
     * arn:aws:events:us-east-2:123456789012:rule/example.
     */
    eventRuleArn: RuleArn;
}

export abstract class EventRuleRef extends Construct {

    /**
     * Imports a rule by ARN into this stack.
     */
    public static import(parent: Construct, name: string, props: EventRuleRefProps): EventRuleRef {
        return new ImportedEventRule(parent, name, props);
    }

    /**
     * The value of the event rule Amazon Resource Name (ARN), such as
     * arn:aws:events:us-east-2:123456789012:rule/example.
     */
    public abstract readonly ruleArn: RuleArn;

    /**
     * Exports this rule resource from this stack and returns an import token.
     */
    public export(): EventRuleRefProps {
        return {
            eventRuleArn: new RuleArn(new Output(this, 'RuleArn', { value: this.ruleArn }).makeImportValue())
        };
    }
}

class ImportedEventRule extends EventRuleRef {
    public readonly ruleArn: RuleArn;

    constructor(parent: Construct, name: string, props: EventRuleRefProps) {
        super(parent, name);

        this.ruleArn = props.eventRuleArn;
    }
}
