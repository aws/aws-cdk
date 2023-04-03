import { Duration, SecretValue } from '@aws-cdk/core';
import { BaseLogDriverProps } from './base-log-driver';
import { TaskDefinition } from '../base/task-definition';
import { Secret } from '../container-definition';
import { CfnTaskDefinition } from '../ecs.generated';
/**
 * Remove undefined values from a dictionary
 */
export declare function removeEmpty<T>(x: {
    [key: string]: (T | undefined | string);
}): {
    [key: string]: string;
};
/**
 * Checks that a value is a positive integer
 */
export declare function ensurePositiveInteger(val: number): void;
/**
 * Checks that a value is contained in a range of two other values
 */
export declare function ensureInRange(val: number, start: number, end: number): void;
export declare function stringifyOptions(options: {
    [key: string]: (SecretValue | Duration | string | string[] | number | boolean | undefined);
}): {
    [key: string]: string;
};
export declare function renderCommonLogDriverOptions(opts: BaseLogDriverProps): {
    tag: string | undefined;
    labels: string | undefined;
    env: string | undefined;
    'env-regex': string | undefined;
};
export declare function joinWithCommas(xs?: string[]): string | undefined;
export declare function renderLogDriverSecretOptions(secretValue: {
    [key: string]: Secret;
}, taskDefinition: TaskDefinition): CfnTaskDefinition.SecretProperty[];
