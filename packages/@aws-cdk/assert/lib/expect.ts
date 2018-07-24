import cdk = require('@aws-cdk/cdk');
import api = require('@aws-cdk/cx-api');
import { StackInspector } from './inspector';

export function expect(stack: api.SynthesizedStack | cdk.Stack): StackInspector {
    // Can't use 'instanceof' here, that breaks if we have multiple copies
    // of this library.
    const sstack: api.SynthesizedStack = isStackClassInstance(stack) ? {
        name: 'test',
        template: stack.toCloudFormation(),
        metadata: {}
    } : stack;

    return new StackInspector(sstack);
}

function isStackClassInstance(x: api.SynthesizedStack | cdk.Stack): x is cdk.Stack {
    return 'toCloudFormation' in x;
}
