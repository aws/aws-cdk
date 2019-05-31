import { Token } from '@aws-cdk/cdk';

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

  /**
   * The combination of "HOSTNAME:PORT" for this endpoint
   */
  public readonly socketAddress: string;

  constructor(address: string, port: number) {
    this.hostname = address;
    this.port = port;

    const portDesc = Token.isToken(port) ? '{IndirectPort}' : port;
    this.socketAddress = `${address}:${portDesc}`;
  }
}
