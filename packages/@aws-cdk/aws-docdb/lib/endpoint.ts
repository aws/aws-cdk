import { Token } from '@aws-cdk/core';

/**
 * Connection endpoint of a database cluster or instance
 *
 * Consists of a combination of hostname and port.
 */
export class Endpoint {
  /**
   * The minimum port value
   */
  private static readonly MIN_PORT = 1;

  /**
   * The maximum port value
   */
  private static readonly MAX_PORT = 65535;

  /**
   * Determines if a port is valid
   *
   * @param port: The port number
   * @returns boolean whether the port is valid
   */
  private static isValidPort(port: number): boolean {
    return Number.isInteger(port) && port >= Endpoint.MIN_PORT && port <= Endpoint.MAX_PORT;
  }

  /**
   * The hostname of the endpoint
   */
  public readonly hostname: string;

  /**
   * The port number of the endpoint.
   *
   * This can potentially be a CDK token. If you need to embed the port in a string (e.g. instance user data script),
   * use `Endpoint.portAsString`.
   */
  public readonly port: number;

  /**
   * The combination of ``HOSTNAME:PORT`` for this endpoint.
   */
  public readonly socketAddress: string;

  /**
   * Constructs an Endpoint instance.
   *
   * @param address - The hostname or address of the endpoint
   * @param port - The port number of the endpoint
   */
  constructor(address: string, port: number) {
    if (!Token.isUnresolved(port) && !Endpoint.isValidPort(port)) {
      throw new Error(`Port must be an integer between [${Endpoint.MIN_PORT}, ${Endpoint.MAX_PORT}] but got: ${port}`);
    }

    this.hostname = address;
    this.port = port;

    const portDesc = Token.isUnresolved(port) ? Token.asString(port) : port;
    this.socketAddress = `${address}:${portDesc}`;
  }

  /**
   * Returns the port number as a string representation that can be used for embedding within other strings.
   *
   * This is intended to deal with CDK's token system. Numeric CDK tokens are not expanded when their string
   * representation is embedded in a string. This function returns the port either as an unresolved string token or
   * as a resolved string representation of the port value.
   *
   * @returns {string} An (un)resolved string representation of the endpoint's port number
   */
  public portAsString(): string {
    if (Token.isUnresolved(this.port)) {
      return Token.asString(this.port);
    } else {
      return this.port.toString();
    }
  }
}
