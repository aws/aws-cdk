import { Token } from '../../core';

/**
 * Connection endpoint of a database cluster or instance
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

  constructor(address: string, port: number) {
    this.hostname = address;
    this.port = port;
  }

  /**
   * The combination of "HOSTNAME:PORT" for this endpoint
   */
  public get socketAddress(): string {
    const portDesc = Token.isUnresolved(this.port) ? Token.asString(this.port) : this.port;
    return `${this.hostname}:${portDesc}`;
  }
}
