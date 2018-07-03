import { Stack } from '@aws-cdk/core';
import * as api from '@aws-cdk/cx-api';
import { StackInspector } from './inspector';

export function expect(stack: api.SynthesizedStack | Stack): StackInspector {
    // Can't use 'instanceof' here, that breaks if we have multiple copies
    // of this library.
    const sstack: api.SynthesizedStack = isStackClassInstance(stack) ? {
        name: 'test',
        template: stack.toCloudFormation(),
        metadata: {}
    } : stack;

    return new StackInspector(sstack);
}

function isStackClassInstance(x: api.SynthesizedStack | Stack): x is Stack {
    return 'toCloudFormation' in x;
}