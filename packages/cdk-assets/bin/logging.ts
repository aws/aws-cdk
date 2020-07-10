import * as fs from 'fs';
import * as path from 'path';

export type LogLevel = 'verbose' | 'info' | 'error';
let logThreshold: LogLevel = 'info';

export const VERSION = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), { encoding: 'utf-8' })).version;

const LOG_LEVELS: Record<LogLevel, number> = {
  verbose: 1,
  info: 2,
  error: 3,
};

export function setLogThreshold(threshold: LogLevel) {
  logThreshold = threshold;
}

export function log(level: LogLevel, message: string) {
  if (LOG_LEVELS[level] >= LOG_LEVELS[logThreshold]) {
    // eslint-disable-next-line no-console
    console.error(`${level.padEnd(7, ' ')}: ${message}`);
  }
}