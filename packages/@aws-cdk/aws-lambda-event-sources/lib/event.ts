import {Rule, RuleProps} from "@aws-cdk/aws-events";
import {LambdaFunction} from "@aws-cdk/aws-events-targets";
import {IEventSource, IFunction} from "@aws-cdk/aws-lambda";

import {Stack} from "@aws-cdk/core";

interface CloudWatchEventSourceProps extends RuleProps {
}

export class CloudWatchEventSource implements IEventSource {
    constructor(private props: CloudWatchEventSourceProps) {}

    /**
     * Binds a CloudWatch Events Rule with the given IFunction
     * @param target The IFunction to trigger with the event
     */
    public bind(target: IFunction): void {
        const stack = Stack.of(target);
        new Rule(stack, `${target.node.uniqueId}:ScheduleRule`, {
            ...this.props,
            targets: [...(this.props?.targets || []), new LambdaFunction(target)],
        });
    }
}
