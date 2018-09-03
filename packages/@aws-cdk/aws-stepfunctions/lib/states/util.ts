import cdk = require('@aws-cdk/cdk');
import { RetryProps } from "../asl-external-api";

export function renderRetry(retry: RetryProps) {
    return {
        ErrorEquals: retry.errors,
        IntervalSeconds: retry.intervalSeconds,
        MaxAttempts: retry.maxAttempts,
        BackoffRate: retry.backoffRate
    };
}

export function renderRetries(retries: RetryProps[]) {
    return {
        Retry: new cdk.Token(() => retries.length === 0 ? undefined : retries.map(renderRetry))
    };
}
