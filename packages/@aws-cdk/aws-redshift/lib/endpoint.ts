import { Token } from '@aws-cdk/core';

/**
 * Connection endpoint of a redshift cluster
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
  public readonly socketAddress: string;

  constructor(address: string, port: number) {
    this.hostname = address;
    this.port = port;

    const portDesc = Token.isUnresolved(port) ? Token.asString(port) : port;
    this.socketAddress = `${address}:${portDesc}`;
  }
}