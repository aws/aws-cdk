import { Token } from 'aws-cdk-lib/core';
import { memoizedGetter } from 'aws-cdk-lib/core/lib/helpers-internal';

/**
 * Connection endpoint of a neptune cluster or instance
 *
 * Consists of a combination of hostname and port.
 */
export class Endpoint {
  /**
   * The hostname of the endpoint
   */
  public readonly hostname: string;

  /**
   * The port of the endpoint
   */
  public readonly port: number;

  /**
   * The combination of "HOSTNAME:PORT" for this endpoint
   */
  @memoizedGetter
  public get socketAddress(): string {
    const portDesc = Token.isUnresolved(this.port) ? Token.asString(this.port) : this.port;
    return `${this.hostname}:${portDesc}`;
  }

  constructor(address: string, port: number) {
    this.hostname = address;
    this.port = port;
  }
}
