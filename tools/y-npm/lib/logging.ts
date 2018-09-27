import { blue, green, red, yellow } from 'colors/safe';

const prefix = `[${green('y-npm')}|${blue(process.pid.toString())}]`;
let verbose: boolean = false;

export function setVerbose(newVerbose: boolean) {
  verbose = newVerbose;
}

export function debug(message: string) {
  if (!verbose) { return; }
  print(message);
}

export function error(message: string) {
  return print(red(message));
}

export function warning(message: string) {
  return print(yellow(message));
}

function print(message: string) {
  process.stderr.write(`${prefix} ${message}\n`);
}
