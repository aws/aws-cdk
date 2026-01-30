import { Construct } from 'constructs';
import { CfnLogGroup, ILogGroup } from '../../aws-logs';
import { IBucket } from '../../aws-s3';
import { Arn, Stack, UnscopedValidationError, Token } from '../../core';

/**
 * Configuration returned by data protection policy binding
 */
export interface DataProtectionPolicyConfig {
  /**
   * The name of the data protection policy
   */
  readonly name: string;

  /**
   * The description of the data protection policy
   */
  readonly description: string;

  /**
   * The version of the data protection policy
   */
  readonly version: string;

  /**
   * The policy statements for the data protection policy
   */
  readonly statement: any[];

  /**
   * The configuration for custom data identifiers
   */
  readonly configuration: any;
}

/**
 * Represents a data protection policy that can be applied to SNS topics
 */
export interface IDataProtectionPolicy {
  /**
   * Binds this data protection policy to a construct scope
   * @internal
   */
  _bind(scope: Construct): DataProtectionPolicyConfig;
}

const IS_DATA_PROTECTION_POLICY = Symbol.for('@aws-cdk/aws-sns.DataProtectionPolicy');

/**
 * Creates a data protection policy for SNS topics.
 */
export class DataProtectionPolicy implements IDataProtectionPolicy {
  /**
   * Check if the given object is a DataProtectionPolicy
   */
  public static isDataProtectionPolicy(x: any): x is DataProtectionPolicy {
    return x != null && typeof x === 'object' && IS_DATA_PROTECTION_POLICY in x;
  }
  private readonly dataProtectionPolicyProps: DataProtectionPolicyProps;

  constructor(props: DataProtectionPolicyProps) {
    if (props.identifiers.length == 0) {
      throw new UnscopedValidationError('DataIdentifier cannot be empty');
    }

    Object.defineProperty(this, IS_DATA_PROTECTION_POLICY, { value: true });

    this.dataProtectionPolicyProps = props;
  }

  /**
   * @internal
   */
  public _bind(scope: Construct): DataProtectionPolicyConfig {
    const name = this.dataProtectionPolicyProps.name || 'data-protection-policy-cdk';
    const description = this.dataProtectionPolicyProps.description || 'cdk generated data protection policy';
    const version = '2021-06-01';

    const findingsDestination: any = {};
    if (this.dataProtectionPolicyProps.logGroupAuditDestination) {
      const logGroup = this.dataProtectionPolicyProps.logGroupAuditDestination;
      const logGroupName = logGroup.logGroupName;

      // Try to get the actual log group name for validation
      // The logGroupName property on ILogGroup is often a token, but we can try to
      // access the underlying CfnLogGroup's logGroupName property which may be literal
      let nameToValidate: string | undefined;
      const defaultChild = logGroup.node.defaultChild;
      if (defaultChild && 'logGroupName' in defaultChild) {
        const cfnLogGroupName = (defaultChild as CfnLogGroup).logGroupName;
        if (cfnLogGroupName && !Token.isUnresolved(cfnLogGroupName)) {
          nameToValidate = cfnLogGroupName;
        }
      }

      // Validate the log group name prefix if we have a concrete name
      if (nameToValidate && !nameToValidate.startsWith('/aws/vendedlogs/')) {
        throw new UnscopedValidationError(`CloudWatch log group for SNS data protection policy audit destination must start with '/aws/vendedlogs/', got: ${nameToValidate}`);
      }
      findingsDestination.CloudWatchLogs = {
        LogGroup: logGroupName,
      };
    }

    if (this.dataProtectionPolicyProps.s3BucketAuditDestination) {
      findingsDestination.S3 = {
        Bucket: this.dataProtectionPolicyProps.s3BucketAuditDestination.bucketName,
      };
    }

    if (this.dataProtectionPolicyProps.deliveryStreamNameAuditDestination) {
      findingsDestination.Firehose = {
        DeliveryStream: this.dataProtectionPolicyProps.deliveryStreamNameAuditDestination,
      };
    }

    // Get the partition from the scope to support GovCloud and China regions
    const partition = Stack.of(scope).partition;

    const identifiers: string[] = [];
    const customDataIdentifiers = [];
    for (let identifier of this.dataProtectionPolicyProps.identifiers) {
      if (identifier instanceof CustomDataIdentifier) {
        identifiers.push(identifier.name);
        customDataIdentifiers.push({
          Name: identifier.name,
          Regex: identifier.regex,
        });
      } else {
        // Build ARN using the correct partition for the deployment region
        // This ensures the policy works in GovCloud (aws-us-gov) and China (aws-cn) regions
        if (Token.isUnresolved(partition)) {
          // When partition is a token (unknown at synth time), use Fn.join to construct the ARN
          identifiers.push(Arn.format({
            partition,
            service: 'dataprotection',
            region: '',
            account: 'aws',
            resource: 'data-identifier',
            resourceName: identifier.name,
          }, Stack.of(scope)));
        } else {
          // When partition is known (e.g., 'aws', 'aws-cn', 'aws-us-gov'), use literal string
          identifiers.push(`arn:${partition}:dataprotection::aws:data-identifier/${identifier.name}`);
        }
      }
    }

    const statement = [
      {
        Sid: 'audit-statement-cdk',
        DataIdentifier: identifiers,
        DataDirection: 'Inbound',
        Principal: ['*'],
        Operation: {
          Audit: {
            SampleRate: 99,
            FindingsDestination: findingsDestination,
          },
        },
      },
      {
        Sid: 'redact-statement-cdk',
        DataIdentifier: identifiers,
        DataDirection: 'Inbound',
        Principal: ['*'],
        Operation: {
          Deidentify: {
            MaskConfig: {},
          },
        },
      },
    ];

    const configuration = {
      CustomDataIdentifier: customDataIdentifiers,
    };

    return {
      name,
      description,
      version,
      statement,
      configuration,
    };
  }
}

/**
 * Properties for creating a data protection policy
 */
export interface DataProtectionPolicyProps {
  /**
   * Name of the data protection policy
   *
   * @default - 'data-protection-policy-cdk'
   */
  readonly name?: string;

  /**
   * Description of the data protection policy
   *
   * @default - 'cdk generated data protection policy'
   */
  readonly description?: string;

  /**
   * List of data protection identifiers.
   *
   * Managed data identifiers must be in the following list: https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL-managed-data-identifiers.html
   * Custom data identifiers must have a valid regex defined: https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL-custom-data-identifiers.html#custom-data-identifiers-constraints
   */
  readonly identifiers: DataIdentifier[];

  /**
   * CloudWatch Logs log group to send audit findings to. The log group must already exist prior to creating the data protection policy.
   *
   * The log group name must start with '/aws/vendedlogs/' as required by AWS for SNS data protection policy audit destinations.
   *
   * @default - no CloudWatch Logs audit destination
   */
  readonly logGroupAuditDestination?: ILogGroup;

  /**
   * S3 bucket to send audit findings to. The bucket must already exist.
   *
   * @default - no S3 bucket audit destination
   */
  readonly s3BucketAuditDestination?: IBucket;

  /**
   * Amazon Data Firehose delivery stream to send audit findings to. The delivery stream must already exist.
   *
   * @default - no firehose delivery stream audit destination
   */
  readonly deliveryStreamNameAuditDestination?: string;
}

/**
 * A data protection identifier. Use the static properties for common identifiers,
 * factory methods for regional identifiers, or the constructor for any AWS managed identifier.
 */
export class DataIdentifier {
  // Core identifiers that don't have regional variants
  /** Address data identifier */
  public static readonly ADDRESS = new DataIdentifier('Address');
  /** AWS Secret Key data identifier */
  public static readonly AWS_SECRET_KEY = new DataIdentifier('AwsSecretKey');
  /** Credit Card Expiration data identifier */
  public static readonly CREDIT_CARD_EXPIRATION = new DataIdentifier('CreditCardExpiration');
  /** Credit Card Number data identifier */
  public static readonly CREDIT_CARD_NUMBER = new DataIdentifier('CreditCardNumber');
  /** Credit Card Security Code data identifier */
  public static readonly CREDIT_CARD_SECURITY_CODE = new DataIdentifier('CreditCardSecurityCode');
  /** Email Address data identifier */
  public static readonly EMAIL_ADDRESS = new DataIdentifier('EmailAddress');
  /** IP Address data identifier */
  public static readonly IP_ADDRESS = new DataIdentifier('IpAddress');
  /** Latitude/Longitude coordinates data identifier */
  public static readonly LAT_LONG = new DataIdentifier('LatLong');
  /** Name data identifier */
  public static readonly NAME = new DataIdentifier('Name');
  /** OpenSSH Private Key data identifier */
  public static readonly OPENSSH_PRIVATE_KEY = new DataIdentifier('OpenSshPrivateKey');
  /** PGP Private Key data identifier */
  public static readonly PGP_PRIVATE_KEY = new DataIdentifier('PgpPrivateKey');
  /** PKCS Private Key data identifier */
  public static readonly PKCS_PRIVATE_KEY = new DataIdentifier('PkcsPrivateKey');
  /** PuTTY Private Key data identifier */
  public static readonly PUTTY_PRIVATE_KEY = new DataIdentifier('PuttyPrivateKey');
  /** Vehicle Identification Number data identifier */
  public static readonly VEHICLE_IDENTIFICATION_NUMBER = new DataIdentifier('VehicleIdentificationNumber');

  /**
   * Creates a driver's license data identifier for the specified country.
   * @param country Two-letter country code (e.g., 'US', 'DE', 'GB')
   * @returns DataIdentifier for driver's license in the specified country
   */
  public static driversLicense(country: string): DataIdentifier {
    const validCountries = ['AT', 'AU', 'BE', 'BG', 'CA', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FR', 'GB', 'GR', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK', 'US'];
    const upperCountry = country.toUpperCase();
    if (!validCountries.includes(upperCountry)) {
      throw new UnscopedValidationError(`DriversLicense not supported for country: ${country}. Supported countries: ${validCountries.join(', ')}`);
    }
    return new DataIdentifier(`DriversLicense-${upperCountry}`);
  }

  /**
   * Creates a passport number data identifier for the specified country.
   * @param country Two-letter country code (e.g., 'US', 'CA', 'GB')
   * @returns DataIdentifier for passport number in the specified country
   */
  public static passportNumber(country: string): DataIdentifier {
    const validCountries = ['CA', 'DE', 'ES', 'FR', 'GB', 'IT', 'US'];
    const upperCountry = country.toUpperCase();
    if (!validCountries.includes(upperCountry)) {
      throw new UnscopedValidationError(`PassportNumber not supported for country: ${country}. Supported countries: ${validCountries.join(', ')}`);
    }
    return new DataIdentifier(`PassportNumber-${upperCountry}`);
  }

  /**
   * Creates a phone number data identifier for the specified country.
   * @param country Two-letter country code (e.g., 'US', 'GB', 'DE')
   * @returns DataIdentifier for phone number in the specified country
   */
  public static phoneNumber(country: string): DataIdentifier {
    const validCountries = ['BR', 'DE', 'ES', 'FR', 'GB', 'IT', 'US'];
    const upperCountry = country.toUpperCase();
    if (!validCountries.includes(upperCountry)) {
      throw new UnscopedValidationError(`PhoneNumber not supported for country: ${country}. Supported countries: ${validCountries.join(', ')}`);
    }
    return new DataIdentifier(`PhoneNumber-${upperCountry}`);
  }

  /**
   * Creates a bank account number data identifier for the specified country.
   * @param country Two-letter country code (e.g., 'US', 'DE', 'GB')
   * @returns DataIdentifier for bank account number in the specified country
   */
  public static bankAccountNumber(country: string): DataIdentifier {
    const validCountries = ['DE', 'ES', 'FR', 'GB', 'IT', 'US'];
    const upperCountry = country.toUpperCase();
    if (!validCountries.includes(upperCountry)) {
      throw new UnscopedValidationError(`BankAccountNumber not supported for country: ${country}. Supported countries: ${validCountries.join(', ')}`);
    }
    return new DataIdentifier(`BankAccountNumber-${upperCountry}`);
  }

  /**
   * Creates a social security number data identifier for the specified country.
   * @param country Two-letter country code (e.g., 'US', 'ES')
   * @returns DataIdentifier for social security number in the specified country
   */
  public static socialSecurityNumber(country: string): DataIdentifier {
    const validCountries = ['ES', 'US'];
    const upperCountry = country.toUpperCase();
    if (!validCountries.includes(upperCountry)) {
      throw new UnscopedValidationError(`Social Security Number not supported for country: ${country}. Supported countries: ${validCountries.join(', ')}`);
    }
    return new DataIdentifier(`Ssn-${upperCountry}`);
  }

  /**
   * Creates a tax ID data identifier for the specified country.
   * @param country Two-letter country code (e.g., 'US', 'DE', 'GB')
   * @returns DataIdentifier for tax ID in the specified country
   */
  public static taxId(country: string): DataIdentifier {
    const validCountries = ['DE', 'ES', 'FR', 'GB'];
    const upperCountry = country.toUpperCase();
    if (!validCountries.includes(upperCountry)) {
      throw new UnscopedValidationError(`TaxId not supported for country: ${country}. Supported countries: ${validCountries.join(', ')}`);
    }
    return new DataIdentifier(`TaxId-${upperCountry}`);
  }

  /**
   * Creates a national identification number data identifier for the specified country.
   * @param country Two-letter country code (e.g., 'DE', 'ES', 'IT')
   * @returns DataIdentifier for national identification number in the specified country
   */
  public static nationalId(country: string): DataIdentifier {
    const validCountries = ['DE', 'ES', 'IT'];
    const upperCountry = country.toUpperCase();
    if (!validCountries.includes(upperCountry)) {
      throw new UnscopedValidationError(`NationalIdentificationNumber not supported for country: ${country}. Supported countries: ${validCountries.join(', ')}`);
    }
    return new DataIdentifier(`NationalIdentificationNumber-${upperCountry}`);
  }

  /**
   * Creates any AWS managed data identifier by name.
   * Use this method for identifiers not covered by static properties or factory methods.
   * @param identifierName The AWS managed data identifier name (e.g., 'NhsNumber-GB', 'ElectoralRollNumber-GB')
   * @returns DataIdentifier for the specified AWS managed identifier
   */
  public static managed(identifierName: string): DataIdentifier {
    if (!identifierName || identifierName.trim().length === 0) {
      throw new UnscopedValidationError('AWS managed data identifier name cannot be empty');
    }
    return new DataIdentifier(identifierName.trim());
  }

  /**
   * Create a managed data identifier not in the list of static members. This is used to maintain forward compatibility, in case a new managed identifier is supported but not updated in CDK yet.
   * @param name - name of the identifier.
   */
  constructor(public readonly name: string) { }

  /**
   * String representation of a DataIdentifier
   *
   * @returns the name of the data identifier
   */
  public toString(): string {
    return this.name;
  }
}

/**
 * A custom data identifier. Include a custom data identifier name and regular expression in the JSON policy used to define the data protection policy.
 */
export class CustomDataIdentifier extends DataIdentifier {
  /**
   * List of managed data identifier names that cannot be used for custom identifiers.
   * This includes both static identifiers and base names used by factory methods.
   */
  private static readonly MANAGED_IDENTIFIER_NAMES = new Set([
    // Static identifiers
    'Address',
    'AwsSecretKey',
    'CreditCardExpiration',
    'CreditCardNumber',
    'CreditCardSecurityCode',
    'EmailAddress',
    'IpAddress',
    'LatLong',
    'Name',
    'OpenSshPrivateKey',
    'PgpPrivateKey',
    'PkcsPrivateKey',
    'PuttyPrivateKey',
    'VehicleIdentificationNumber',
  ]);

  /**
   * Prefixes used by managed data identifiers with regional variants.
   */
  private static readonly MANAGED_IDENTIFIER_PREFIXES = [
    'DriversLicense-',
    'PassportNumber-',
    'PhoneNumber-',
    'BankAccountNumber-',
    'Ssn-',
    'TaxId-',
    'NationalIdentificationNumber-',
  ];

  /**
   * Create a custom data identifier.
   * @param name - the name of the custom data identifier. This cannot share the same name as a managed data identifier.
   * @param regex - the regular expression to detect and mask log events for.
   */
  constructor(public readonly name: string, public readonly regex: string) {
    super(name);

    if (!name || name.trim().length === 0) {
      throw new UnscopedValidationError('Custom data identifier name cannot be empty');
    }

    if (!regex || regex.trim().length === 0) {
      throw new UnscopedValidationError('Custom data identifier regex cannot be empty');
    }

    // Validate that the custom identifier name doesn't conflict with managed identifiers
    if (CustomDataIdentifier.MANAGED_IDENTIFIER_NAMES.has(name)) {
      throw new UnscopedValidationError(`Custom data identifier name '${name}' conflicts with a managed data identifier. Choose a different name.`);
    }

    // Check for conflicts with regional managed identifiers (e.g., DriversLicense-US)
    for (const prefix of CustomDataIdentifier.MANAGED_IDENTIFIER_PREFIXES) {
      if (name.startsWith(prefix)) {
        throw new UnscopedValidationError(`Custom data identifier name '${name}' conflicts with a managed data identifier pattern '${prefix}*'. Choose a different name.`);
      }
    }
  }

  /**
   * String representation of a CustomDataIdentifier
   * @returns the name and RegEx of the custom data identifier
   */
  public toString(): string {
    return `${this.name}: ${this.regex}`;
  }
}
