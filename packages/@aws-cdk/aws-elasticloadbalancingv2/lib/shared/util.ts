import { ApplicationProtocol } from './enums';

export type Attributes = {[key: string]: string | undefined};

/**
 * Render an attribute dict to a list of { key, value } pairs
 */
export function renderAttributes(attributes: Attributes) {
  const ret: any[] = [];
  for (const [key, value] of Object.entries(attributes)) {
    if (value !== undefined) {
      ret.push({ key, value });
    }
  }
  return ret;
}

/**
 * Return the appropriate default port for a given protocol
 */
export function defaultPortForProtocol(proto: ApplicationProtocol): number {
  switch (proto) {
    case ApplicationProtocol.HTTP: return 80;
    case ApplicationProtocol.HTTPS: return 443;
    default:
      throw new Error(`Unrecognized protocol: ${proto}`);
  }
}

/**
 * Return the appropriate default protocol for a given port
 */
export function defaultProtocolForPort(port: number): ApplicationProtocol {
  switch (port) {
    case 80:
    case 8000:
    case 8008:
    case 8080:
      return ApplicationProtocol.HTTP;

    case 443:
    case 8443:
      return ApplicationProtocol.HTTPS;

    default:
      throw new Error(`Don't know default protocol for port: ${port}; please supply a protocol`);
  }
}

/**
 * Given a protocol and a port, try to guess the other one if it's undefined
 */
// tslint:disable-next-line:max-line-length
export function determineProtocolAndPort(protocol: ApplicationProtocol | undefined, port: number | undefined): [ApplicationProtocol | undefined, number | undefined] {
  if (protocol === undefined && port === undefined) {
    return [undefined, undefined];
  }

  if (protocol === undefined) { protocol = defaultProtocolForPort(port!); }
  if (port === undefined) { port = defaultPortForProtocol(protocol!); }

  return [protocol, port];
}

/**
 * Helper function to default undefined input props
 */
export function ifUndefined<T>(x: T | undefined, def: T) {
  return x !== undefined ? x : def;
}
