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
    if (val && Number.isInteger(val) && val < 0) {
        throw new Error(`\`${val}\` must be a positive integer.`);
    }
}

/**
 * Checks that a value is present in an array
 */
export function ensureInList(val: string, list: string[]) {
    if (val && !(list.includes(val))) {
        throw new Error(`\`${val}\` must be one of ${list.join('|')}`);
    }
}

/**
 * Checks that a value is between a two other values
 */
export function ensureInRange(val: number, start: number, end: number) {
    if (val && !(val > start && val <= end)) {
        throw new Error(`\`${val}\` must be within range ${start}:${end}`);
    }
}

export function stringifyOptions(options: { [key: string]: (string | string[] | number | boolean | undefined) }) {
    let _options: { [key: string]: string } = {}
    const filteredOptions = removeEmpty(options)

    for (const key of Object.keys(filteredOptions)) {
        if (filteredOptions.env && Array.isArray(filteredOptions.env)) {
            _options.env = filteredOptions.env.join(',');
            continue;
        }

        if (filteredOptions.labels && Array.isArray(filteredOptions.labels)) {
            _options.env = filteredOptions.labels.join(',');
            continue;
        }

        // Convert value to string
        _options[key] = `${filteredOptions[key]}`
    }

    return _options
}
