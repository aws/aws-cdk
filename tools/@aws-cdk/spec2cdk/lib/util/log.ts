/* eslint-disable no-console */
export function error(...messages: Array<string | number | object>) {
  console.error(...messages);
}

export function info(...messages: Array<string | number | object>) {
  console.info(...messages);
}

export function debug(...messages: Array<string | number | object>) {
  if (process.env.DEBUG) {
    console.debug(...messages);
  }
}

export function time(label: string) {
  console.time(label);
}

export function timeEnd(label: string) {
  console.timeEnd(label);
}
