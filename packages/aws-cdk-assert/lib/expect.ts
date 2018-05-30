import { Stack } from 'aws-cdk';
import * as api from 'aws-cdk-cx-api';
import { StackInspector } from './inspector';

export function expect(stack: api.SynthesizedStack | Stack): StackInspector {
    const sstack: api.SynthesizedStack = stack instanceof Stack ? {
        name: 'test',
        template: stack.toCloudFormation(),
        metadata: {}
    } : stack;

    return new StackInspector(sstack);
}