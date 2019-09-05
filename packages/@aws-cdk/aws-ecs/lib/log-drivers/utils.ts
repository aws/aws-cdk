import { Duration, Token } from '@aws-cdk/core';
import { BaseLogDriverProps } from './base-log-driver';

/**
 * Remove undefined values from a dictionary
 */
export function removeEmpty<T>(x: { [key: string]: (T | undefined | string) }): { [key: string]: string } {
    for (const key of Object.keys(x)) {
      if (!x[key]) {
        delete x[key];
      }
    }
    return x as any;
}

/**
 * Checks that a value is a positive integer
 */
export function ensurePositiveInteger(val: number) {
    if (!Token.isUnresolved(val) && Number.isInteger(val) && val < 0) {
        throw new Error(`\`${val}\` must be a positive integer.`);
    }
}

/**
 * Checks that a value is contained in a range of two other values
 */
export function ensureInRange(val: number, start: number, end: number) {
    if (!Token.isUnresolved(val) && !(val >= start && val <= end)) {
        throw new Error(`\`${val}\` must be within range ${start}:${end}`);
    }
}

export function stringifyOptions(options: { [key: string]: (Duration | string | string[] | number | boolean | undefined) }) {
    const _options: { [key: string]: string } = {};
    const filteredOptions = removeEmpty(options);

    for (const key of Object.keys(filteredOptions)) {
        if (!Token.isUnresolved(filteredOptions.env) && filteredOptions.env && Array.isArray(filteredOptions.env)) {
            _options.env = filteredOptions.env.join(',');
            continue;
        }

        if (!Token.isUnresolved(filteredOptions.labels) && filteredOptions.labels && Array.isArray(filteredOptions.labels)) {
            _options.env = filteredOptions.labels.join(',');
            continue;
        }

        // Convert value to string
        _options[key] = `${filteredOptions[key]}`;
    }

    return _options;
}

export function renderCommonLogDriverOptions(opts: BaseLogDriverProps) {
    return {
          'tag': opts.tag,
          'labels': joinWithCommas(opts.labels),
          'env': joinWithCommas(opts.env),
          'env-regex': opts.envRegex
    };
}

export function joinWithCommas(xs?: string[]): string | undefined {
    return xs && xs.join(',');
}
