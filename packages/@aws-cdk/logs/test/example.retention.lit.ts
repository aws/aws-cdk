import { Stack } from '@aws-cdk/core';
import { LogGroup } from '../lib';

const stack = new Stack();

function shortLogGroup() {
    /// !show
    // Configure log group for short retention
    const logGroup = new LogGroup(stack, 'LogGroup', {
        retentionInDays: 7
    });
    /// !hide
    return logGroup;
}

function infiniteLogGroup() {
    /// !show
    // Configure log group for infinite retention
    const logGroup = new LogGroup(stack, 'LogGroup', {
        retentionInDays: Infinity
    });
    /// !hide
    return logGroup;
}

//

Array.isArray(shortLogGroup);
Array.isArray(infiniteLogGroup);