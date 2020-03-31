import { expect, haveResource } from '@aws-cdk/assert';
import { Schedule } from '@aws-cdk/aws-events';
import { Stack } from "@aws-cdk/core";
import { Test } from 'nodeunit';
import { CloudWatchEventSource } from "../lib/event";
import { TestFunction } from "./test-function";

// tslint:disable:object-literal-key-quotes

export = {
    'sufficiently complex example'(test: Test) {
        const stack = new Stack();
        const fn = new TestFunction(stack, 'Fn');

        // WHEN
        fn.addEventSource(new CloudWatchEventSource({
            schedule: Schedule.cron({
                day: '1',
                year: '*',
                month: '1',
                hour: '1',
                minute: '1'
            })
        }));

        expect(stack).to(haveResource("AWS::Events::Rule", {
            "ScheduleExpression": "cron(1 1 1 1 ? *)",
            "State": "ENABLED",
            "Targets": [
                {
                    "Id": "Target0",
                    "Arn": {
                        "Fn::GetAtt": [
                            "Fn9270CBC0",
                            "Arn"
                        ]
                    }
                }
            ]
        }));

        test.done();
    }
};
