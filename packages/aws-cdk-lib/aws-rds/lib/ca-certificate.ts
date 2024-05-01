/**
 * The CA certificate used for a DB instance.
 *
 * @see https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html
 */
export class CaCertificate {
  /**
   * rds-ca-2019 certificate authority
   */
  public static readonly RDS_CA_2019 = CaCertificate.of('rds-ca-2019');

  /**
   * rds-ca-ecc384-g1 certificate authority
   */
  public static readonly RDS_CA_ECC384_G1 = CaCertificate.of('rds-ca-ecc384-g1');

  /**
   * rds-ca-rsa2048-g1 certificate authority
   */
  public static readonly RDS_CA_RDS2048_G1 = CaCertificate.of('rds-ca-rsa2048-g1');

  /**
   * rds-ca-rsa4096-g1 certificate authority
   */
  public static readonly RDS_CA_RDS4096_G1 = CaCertificate.of('rds-ca-rsa4096-g1');

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
