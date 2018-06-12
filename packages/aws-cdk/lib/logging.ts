import * as colors from 'colors/safe';
import { format } from 'util';

// tslint:disable:no-console the whole point of those methods is precisely to output to the console...

let isVerbose = false;

export function setVerbose(enabled = true) {
    isVerbose = enabled;
}

export function error(fmt: string, ...args: any[]) {
    console.error(colors.red(format(fmt, ...args)));
}

export function debug(fmt: string, ...args: any[]) {
    if (isVerbose) {
        console.error(colors.gray(format(fmt, ...args)));
    }
}

export function highlight(fmt: string, ...args: any[]) {
    console.error(colors.bold(colors.white(format(fmt, ...args))));
}

export function success(fmt: string, ...args: any[]) {
    console.error(colors.green(format(fmt, ...args)));
}

export function warning(fmt: string, ...args: any[]) {
    console.error(colors.yellow(format(fmt, ...args)));
}

export function print(fmt: string, ...args: any[]) {
    console.error(colors.white(format(fmt, ...args)));
}

export function data(fmt: string, ...args: any[]) {
    console.log(format(fmt, ...args));
}

type LoggerFunction = (fmt: string, ...args: any[]) => void;

/**
 * Create a logger output that features a constant prefix string.
 *
 * @param prefixString the prefix string to be appended before any log entry.
 * @param fn     the logger function to be used (typically one of the other functions in this module)
 *
 * @returns a new LoggerFunction.
 */
export function prefix(prefixString: string, fn: LoggerFunction): LoggerFunction {
    return (fmt: string, ...args: any[]) => fn(`%s ${fmt}`, prefixString, ...args);
}
