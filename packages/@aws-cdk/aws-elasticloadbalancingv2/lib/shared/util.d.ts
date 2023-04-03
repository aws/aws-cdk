import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { ApplicationProtocol, Protocol } from './enums';
export declare type Attributes = {
    [key: string]: string | undefined;
};
/**
 * Render an attribute dict to a list of { key, value } pairs
 */
export declare function renderAttributes(attributes: Attributes): any[];
/**
 * Return the appropriate default port for a given protocol
 */
export declare function defaultPortForProtocol(proto: ApplicationProtocol): number;
/**
 * Return the appropriate default protocol for a given port
 */
export declare function defaultProtocolForPort(port: number): ApplicationProtocol;
/**
 * Given a protocol and a port, try to guess the other one if it's undefined
 */
export declare function determineProtocolAndPort(protocol: ApplicationProtocol | undefined, port: number | undefined): [ApplicationProtocol | undefined, number | undefined];
/**
 * Helper function to default undefined input props
 */
export declare function ifUndefined<T>(x: T | undefined, def: T): T;
/**
 * Helper function for ensuring network listeners and target groups only accept valid
 * protocols.
 */
export declare function validateNetworkProtocol(protocol: Protocol): void;
/**
 * Helper to map a map of tags to cxschema tag format.
 * @internal
 */
export declare function mapTagMapToCxschema(tagMap: Record<string, string>): cxschema.Tag[];
export declare function parseLoadBalancerFullName(arn: string): string;
/**
 * Transforms:
 *
 *   arn:aws:elasticloadbalancing:us-east-1:123456789:targetgroup/my-target-group/da693d633af407a0
 *
 * Into:
 *
 *   targetgroup/my-target-group/da693d633af407a0
 */
export declare function parseTargetGroupFullName(arn: string): string;
