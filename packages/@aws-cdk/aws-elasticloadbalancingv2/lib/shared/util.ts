import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { Arn, ArnFormat, Fn, Token } from '@aws-cdk/core';
import { ApplicationProtocol, Protocol } from './enums';

export type Attributes = { [key: string]: string | undefined };

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
// eslint-disable-next-line max-len
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
  return x ?? def;
}

/**
 * Helper function for ensuring network listeners and target groups only accept valid
 * protocols.
 */
export function validateNetworkProtocol(protocol: Protocol) {
  const NLB_PROTOCOLS = [Protocol.TCP, Protocol.TLS, Protocol.UDP, Protocol.TCP_UDP];

  if (NLB_PROTOCOLS.indexOf(protocol) === -1) {
    throw new Error(`The protocol must be one of ${NLB_PROTOCOLS.join(', ')}. Found ${protocol}`);
  }
}

/**
 * Helper to map a map of tags to cxschema tag format.
 * @internal
 */
export function mapTagMapToCxschema(tagMap: Record<string, string>): cxschema.Tag[] {
  return Object.entries(tagMap)
    .map(([key, value]) => ({ key, value }));
}

export function parseLoadBalancerFullName(arn: string): string {
  if (Token.isUnresolved(arn)) {
    // Unfortunately it is not possible to use Arn.split() because the ARNs have this shape:
    //
    //   arn:...:loadbalancer/net/my-load-balancer/123456
    //
    // And the way that Arn.split() handles this situation is not enough to obtain the full name
    const arnParts = Fn.split('/', arn);
    return `${Fn.select(1, arnParts)}/${Fn.select(2, arnParts)}/${Fn.select(3, arnParts)}`;
  } else {
    const arnComponents = Arn.split(arn, ArnFormat.SLASH_RESOURCE_NAME);
    const resourceName = arnComponents.resourceName;
    if (!resourceName) {
      throw new Error(`Provided ARN does not belong to a load balancer: ${arn}`);
    }
    return resourceName;
  }
}

/**
 * Transforms:
 *
 *   arn:aws:elasticloadbalancing:us-east-1:123456789:targetgroup/my-target-group/da693d633af407a0
 *
 * Into:
 *
 *   targetgroup/my-target-group/da693d633af407a0
 */
export function parseTargetGroupFullName(arn: string): string {
  const arnComponents = Arn.split(arn, ArnFormat.NO_RESOURCE_NAME);
  const resource = arnComponents.resource;
  if (!resource) {
    throw new Error(`Provided ARN does not belong to a target group: ${arn}`);
  }
  return resource;
}
