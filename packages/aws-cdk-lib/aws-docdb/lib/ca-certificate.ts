/**
 * The CA certificate used for a DB instance.
 *
 * @see https://docs.aws.amazon.com/documentdb/latest/developerguide/ca_cert_rotation.html
 */
export class CaCertificate {
  /**
   * rds-ca-2019 certificate authority
   */
  public static readonly RDS_CA_2019 = new CaCertificate('rds-ca-2019');

  /**
   * rds-ca-rsa2048-g1 certificate authority
   */
  public static readonly RDS_CA_RSA2048_G1 = new CaCertificate('rds-ca-rsa2048-g1');

  /**
   * rds-ca-rsa4096-g1 certificate authority
   */
  public static readonly RDS_CA_RSA4096_G1 = new CaCertificate('rds-ca-rsa4096-g1');

  /**
   * Custom CA certificate
   *
   * @param identifier - CA certificate identifier
   */
  public static of(identifier: string) {
    return new CaCertificate(identifier);
  }

  /**
   * @param identifier - CA certificate identifier
   */
  private constructor(private readonly identifier: string) { }

  /**
   * Returns the CA certificate identifier as a string
   */
  public toString(): string {
    return this.identifier;
  }
}
