import { RetryProps } from "../asl-external-api";
import { Transition } from "../asl-internal-api";

export function renderNextEnd(transitions: Transition[]) {
    if (transitions.some(t => t.annotation !== undefined)) {
        throw new Error('renderNextEnd() can only be used on default transitions');
    }

    return {
        Next: transitions.length > 0 ? transitions[0].targetState.stateId : undefined,
        End: transitions.length > 0 ? undefined : true,
    };
}

export function renderRetry(retry: RetryProps) {
    return {
        ErrorEquals: retry.errors,
        IntervalSeconds: retry.intervalSeconds,
        MaxAttempts: retry.maxAttempts,
        BackoffRate: retry.backoffRate
    };
}
