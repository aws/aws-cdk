import { Duration } from '@aws-cdk/core';
export declare function calculateRetryPolicy(props?: {
    totalTimeout?: Duration;
    queryInterval?: Duration;
}): {
    maxAttempts: number;
    interval: Duration;
    backoffRate: number;
};
