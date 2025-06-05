import { UnscopedValidationError } from '../../core';

/**
 * Represents the data direction in a data protection policy statement.
 */
export enum DataDirection {
  /**
   * Applies to inbound messages (for Publish API requests).
   */
  INBOUND = 'Inbound',

  /**
   * Applies to outbound messages (for notification deliveries).
   */
  OUTBOUND = 'Outbound',
}

/**
 * Represents an Amazon SNS data identifier for detecting sensitive data.
 */
export interface IDataIdentifier {
  /**
   * Returns the ARN or name of the data identifier.
   */
  readonly identifier: string;
}

/**
 * Represents a predefined AWS managed data identifier for detecting specific types of sensitive data.
 */
export class ManagedDataIdentifier implements IDataIdentifier {
  /**
   * Creates a custom data identifier.
   */
  constructor(private readonly identifierName: string) {}

  /**
   * Returns the identifier ARN format.
   */
  public get identifier(): string {
    // https://docs.aws.amazon.com/sns/latest/dg/sns-message-data-protection-sensitive-data-types-credentials.html
    // eslint-disable-next-line @cdklabs/no-literal-partition
    return `arn:aws:dataprotection::aws:data-identifier/${this.identifierName}`;
  }
}

/**
 * Properties for defining a custom data identifier.
 *
 * https://docs.aws.amazon.com/sns/latest/dg/sns-message-data-protection-custom-data-identifiers.html
 */
export interface CustomDataIdentifierProps {
  /**
   * The name of the custom data identifier.
   * Names have a maximum length of 128 characters and can only contain alphanumeric characters, underscores, and hyphens.
   */
  readonly name: string;

  /**
   * The regular expression that identifies the sensitive data pattern.
   * Regex patterns have a maximum length of 200 characters.
   */
  readonly regex: string;
}

/**
 * Represents a custom data identifier for detecting organization-specific sensitive data patterns.
 *
 * Custom data identifiers in Amazon SNS only support Name and Regex properties.
 */
export class CustomDataIdentifier implements IDataIdentifier {
  /**
   * The name of the custom data identifier.
   */
  public readonly name: string;

  /**
   * The regular expression that identifies the sensitive data pattern.
   */
  public readonly regex: string;

  constructor(props: CustomDataIdentifierProps) {
    this.name = props.name;
    this.regex = props.regex;

    // Validate regex length
    if (this.regex.length > 200) {
      throw new UnscopedValidationError(
        'Custom data identifier regex must be at most 200 characters',
      );
    }

    // Validate name length
    if (this.name.length > 128) {
      throw new UnscopedValidationError(
        'Custom data identifier name must be at most 128 characters',
      );
    }

    // Validate name format (alphanumeric, underscore, hyphen)
    if (!/^[a-zA-Z0-9_-]+$/.test(this.name)) {
      throw new UnscopedValidationError(
        'Custom data identifier name can only contain alphanumeric characters, underscores, and hyphens',
      );
    }

    // Validate regex characters
    const validRegexPattern = /^[a-zA-Z0-9_#=@\/;,\- ^$?\[\]{}\|\\*+.]+$/;
    if (!validRegexPattern.test(this.regex)) {
      throw new UnscopedValidationError(
        'Custom data identifier regex can only contain alphanumeric characters and specific symbols (_, #, =, @, /, ;, ,, -, space) or regex special characters (^, $, ?, [, ], {, }, |, \\, *, +, .)',
      );
    }

    // Validate that custom identifier name doesn't conflict with managed data identifiers
    const managedIdPattern =
      /^(Address|EmailAddress|Name|VehicleIdentificationNumber|PhoneNumber-|DriversLicense-|PassportNumber-|Ssn-|AwsSecretKey|PgpPrivateKey|PkcsPrivateKey|OpenSshPrivateKey|PuttyPrivateKey|IpAddress|CreditCardNumber|CreditCardExpiration|CreditCardSecurityCode|BankAccountNumber-|HealthInsuranceCardNumber-|HealthInsuranceNumber-|HealthcareProcedureCode-|NationalProviderId-|MedicareBeneficiaryNumber-|NationalDrugCode-|DrugEnforcementAgencyNumber-|HealthInsuranceClaimNumber-|NationalInsuranceNumber-|NhsNumber-|PersonalHealthNumber-)/;
    if (managedIdPattern.test(this.name)) {
      throw new UnscopedValidationError(
        'Custom data identifier name cannot match a managed data identifier name',
      );
    }
  }

  /**
   * Returns the name of the custom identifier.
   */
  public get identifier(): string {
    return this.name;
  }

  /**
   * Creates the custom data identifier definition for the policy.
   */
  public toJSON(): any {
    return {
      Name: this.name,
      Regex: this.regex,
    };
  }
}

/**
 * Represents a CloudWatch Logs destination for audit findings.
 */
export interface CloudWatchLogsDestination {
  /**
   * The name of the CloudWatch Logs log group.
   * The name must start with "/aws/vendedlogs/".
   */
  readonly logGroup: string;
}

/**
 * Represents a Firehose destination for audit findings.
 */
export interface FirehoseDestination {
  /**
   * The name of the Firehose delivery stream.
   * The delivery stream must have "Direct PUT" as the source.
   */
  readonly deliveryStream: string;
}

/**
 * Represents an S3 destination for audit findings.
 */
export interface S3Destination {
  /**
   * The name of the S3 bucket.
   */
  readonly bucket: string;
}

/**
 * Represents a destination for audit findings.
 */
export interface AuditDestination {
  /**
   * CloudWatch Logs destination for audit findings.
   * @default - no CloudWatch Logs destination
   */
  readonly cloudWatchLogs?: CloudWatchLogsDestination;

  /**
   * Firehose destination for audit findings.
   * @default - no Firehose destination
   */
  readonly firehose?: FirehoseDestination;

  /**
   * S3 destination for audit findings.
   * @default - no S3 destination
   */
  readonly s3?: S3Destination;
}

/**
 * Properties for the Audit operation.
 */
export interface AuditOperationProps {
  /**
   * The percentage of messages to sample for audit.
   * Must be an integer between 0-99.
   * @default 99
   */
  readonly sampleRate?: number;

  /**
   * The logging destination when sensitive data is found.
   * @default - no findings destination
   */
  readonly findingsDestination?: AuditDestination;

  /**
   * The logging destination when no sensitive data is found.
   * @default - no findings destination
   */
  readonly noFindingsDestination?: AuditDestination;
}

/**
 * Represents the Audit operation for data protection.
 */
export class AuditOperation {
  /**
   * The percentage of messages to sample for audit.
   */
  public readonly sampleRate?: number;

  /**
   * The logging destination when sensitive data is found.
   */
  public readonly findingsDestination?: AuditDestination;

  /**
   * The logging destination when no sensitive data is found.
   */
  public readonly noFindingsDestination?: AuditDestination;

  constructor(props: AuditOperationProps) {
    this.sampleRate = props.sampleRate ?? 99;
    this.findingsDestination = props.findingsDestination;
    this.noFindingsDestination = props.noFindingsDestination;

    if (this.sampleRate < 0 || this.sampleRate > 99) {
      throw new UnscopedValidationError(
        'Sample rate must be an integer between 0 and 99',
      );
    }

    // Validate CloudWatch log group name pattern if specified
    if (
      this.findingsDestination?.cloudWatchLogs &&
      !this.findingsDestination.cloudWatchLogs.logGroup.startsWith(
        '/aws/vendedlogs/',
      )
    ) {
      throw new UnscopedValidationError(
        'CloudWatch Logs log group name must start with "/aws/vendedlogs/"',
      );
    }

    if (
      this.noFindingsDestination?.cloudWatchLogs &&
      !this.noFindingsDestination.cloudWatchLogs.logGroup.startsWith(
        '/aws/vendedlogs/',
      )
    ) {
      throw new UnscopedValidationError(
        'CloudWatch Logs log group name must start with "/aws/vendedlogs/"',
      );
    }
  }

  /**
   * Creates the audit operation object for the policy.
   */
  public toJSON(): any {
    const audit: any = {
      SampleRate: this.sampleRate?.toString(),
    };

    if (this.findingsDestination) {
      const findingsDestination: any = {};

      if (this.findingsDestination.cloudWatchLogs) {
        findingsDestination.CloudWatchLogs = {
          LogGroup: this.findingsDestination.cloudWatchLogs.logGroup,
        };
      }

      if (this.findingsDestination.firehose) {
        findingsDestination.Firehose = {
          DeliveryStream: this.findingsDestination.firehose.deliveryStream,
        };
      }

      if (this.findingsDestination.s3) {
        findingsDestination.S3 = {
          Bucket: this.findingsDestination.s3.bucket,
        };
      }

      if (Object.keys(findingsDestination).length > 0) {
        audit.FindingsDestination = findingsDestination;
      }
    }

    if (this.noFindingsDestination) {
      const noFindingsDestination: any = {};

      if (this.noFindingsDestination.cloudWatchLogs) {
        noFindingsDestination.CloudWatchLogs = {
          LogGroup: this.noFindingsDestination.cloudWatchLogs.logGroup,
        };
      }

      if (this.noFindingsDestination.firehose) {
        noFindingsDestination.Firehose = {
          DeliveryStream: this.noFindingsDestination.firehose.deliveryStream,
        };
      }

      if (this.noFindingsDestination.s3) {
        noFindingsDestination.S3 = {
          Bucket: this.noFindingsDestination.s3.bucket,
        };
      }

      if (Object.keys(noFindingsDestination).length > 0) {
        audit.NoFindingsDestination = noFindingsDestination;
      }
    }

    return { Audit: audit };
  }
}

/**
 * Properties for MaskOperation.
 */
export interface MaskOperationProps {
  /**
   * The character to use for masking sensitive data.
   * @default '*'
   */
  readonly maskWithCharacter?: string;
}

/**
 * Represents the mask operation for deidentifying sensitive data.
 */
export class MaskOperation {
  /**
   * Valid characters that can be used for masking.
   */
  private static readonly VALID_MASK_CHARACTERS = [
    '*',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    ' ',
    '!',
    '$',
    '%',
    '&',
    '(',
    ')',
    '+',
    ',',
    '-',
    '.',
    '/',
    '\\',
    ':',
    ';',
    '<',
    '=',
    '>',
    '@',
    '[',
    ']',
    '^',
    '_',
    '`',
    '|',
    '~',
    '#',
  ];

  /**
   * The character to use for masking sensitive data.
   */
  public readonly maskWithCharacter: string;

  constructor(props: MaskOperationProps = {}) {
    this.maskWithCharacter = props.maskWithCharacter ?? '*';

    if (!MaskOperation.VALID_MASK_CHARACTERS.includes(this.maskWithCharacter)) {
      throw new UnscopedValidationError(
        `Invalid mask character. Valid characters are: ${MaskOperation.VALID_MASK_CHARACTERS.join(
          ', ',
        )}`,
      );
    }
  }

  /**
   * Creates the mask operation object for the policy.
   */
  public toJSON(): any {
    return {
      Deidentify: {
        MaskConfig: {
          MaskWithCharacter: this.maskWithCharacter,
        },
      },
    };
  }
}

/**
 * Represents the redact operation for deidentifying sensitive data.
 */
export class RedactOperation {
  /**
   * Creates the redact operation object for the policy.
   */
  public toJSON(): any {
    return {
      Deidentify: {
        RedactConfig: {},
      },
    };
  }
}

/**
 * Represents the deny operation to block messages with sensitive data.
 */
export class DenyOperation {
  /**
   * Creates the deny operation object for the policy.
   */
  public toJSON(): any {
    return { Deny: {} };
  }
}

/**
 * Type union of all possible data protection operations.
 */
export type DataProtectionOperation =
  | AuditOperation
  | MaskOperation
  | RedactOperation
  | DenyOperation;

/**
 * Represents a statement in a data protection policy.
 */
export interface DataProtectionPolicyStatementProps {
  /**
   * Optional identifier for the statement.
   * @default - No statement ID
   */
  readonly sid?: string;

  /**
   * The direction of data flow to apply the policy to.
   */
  readonly dataDirection: DataDirection;

  /**
   * The data identifiers to detect.
   */
  readonly dataIdentifiers: IDataIdentifier[];

  /**
   * The principals to apply the policy to.
   * @default '*' (all principals)
   */
  readonly principals?: string[];

  /**
   * The operation to perform when sensitive data is detected.
   */
  readonly operation: DataProtectionOperation;
}

/**
 * Represents a statement in a data protection policy.
 */
export class DataProtectionPolicyStatement {
  /**
   * Optional identifier for the statement.
   */
  public readonly sid?: string;

  /**
   * The direction of data flow to apply the policy to.
   */
  public readonly dataDirection: DataDirection;

  /**
   * The data identifiers to detect.
   */
  public readonly dataIdentifiers: IDataIdentifier[];

  /**
   * The principals to apply the policy to.
   */
  public readonly principals: string[];

  /**
   * The operation to perform when sensitive data is detected.
   */
  public readonly operation: DataProtectionOperation;

  constructor(props: DataProtectionPolicyStatementProps) {
    this.sid = props.sid;
    this.dataDirection = props.dataDirection;
    this.dataIdentifiers = props.dataIdentifiers;
    this.principals = props.principals ?? ['*'];
    this.operation = props.operation;
  }

  /**
   * Creates the statement object for the policy.
   */
  public toJSON(): any {
    const statement: any = {
      DataDirection: this.dataDirection,
      Principal: this.principals,
      DataIdentifier: this.dataIdentifiers.map(
        (identifier) => identifier.identifier,
      ),
      Operation: this.operation.toJSON(),
    };

    if (this.sid) {
      statement.Sid = this.sid;
    }

    return statement;
  }
}

/**
 * Properties for creating a data protection policy.
 */
export interface DataProtectionPolicyProps {
  /**
   * The name of the data protection policy.
   *
   * This is a friendly identifier for the policy.
   */
  readonly name: string;

  /**
   * Description of the data protection policy.
   * @default - No description
   */
  readonly description?: string;

  /**
   * The version of the data protection policy.
   * The current value should be '2021-06-01'.
   * @default '2021-06-01'
   */
  readonly version?: string;

  /**
   * Statements for the data protection policy.
   *
   * Each statement defines a rule to detect and handle sensitive data.
   * A policy can have multiple statements for different data types and operations.
   */
  readonly statements: DataProtectionPolicyStatement[];
}

/**
 * Represents a data protection policy for an SNS topic.
 *
 * Message Data Protection policies allow you to define rules to detect and handle
 * sensitive data in your SNS messages. You can configure the policy to:
 *
 * - Audit: Log sensitive data detections to CloudWatch, S3, or Firehose
 * - Mask: Replace sensitive data with a character like '*'
 * - Redact: Remove sensitive data completely
 * - Deny: Block messages containing sensitive data
 *
 * Each policy consists of one or more statements that define what data to protect and
 * what action to take when that data is detected. Policies can use both AWS managed data
 * identifiers for common sensitive data patterns and custom data identifiers for your
 * organization-specific patterns.
 *
 * @see https://docs.aws.amazon.com/sns/latest/dg/message-data-protection.html
 * @see https://docs.aws.amazon.com/sns/latest/dg/sns-message-data-protection-policies.html
 */
export class DataProtectionPolicy {
  /**
   * The name of the data protection policy.
   */
  public readonly name: string;

  /**
   * Description of the data protection policy.
   */
  public readonly description?: string;

  /**
   * The version of the data protection policy.
   */
  public readonly version: string;

  /**
   * Statements for the data protection policy.
   */
  public readonly statements: DataProtectionPolicyStatement[];

  /**
   * Custom data identifiers in the policy.
   */
  private readonly customDataIdentifiers: CustomDataIdentifier[];

  constructor(props: DataProtectionPolicyProps) {
    this.name = props.name;
    this.description = props.description;
    this.version = props.version ?? '2021-06-01';
    this.statements = props.statements;

    // Collect custom data identifiers from statements
    this.customDataIdentifiers = this.statements
      .flatMap((statement) => statement.dataIdentifiers)
      .filter(
        (dataIdentifier): dataIdentifier is CustomDataIdentifier =>
          dataIdentifier instanceof CustomDataIdentifier,
      );

    // Validate audit statement count
    const auditStatements = this.statements.filter(
      (statement) => statement.operation instanceof AuditOperation,
    );

    if (auditStatements.length > 1) {
      throw new UnscopedValidationError(
        'A data protection policy can only have one audit statement',
      );
    }
  }

  /**
   * Creates the data protection policy document.
   */
  public toJSON(): any {
    const policy: any = {
      Name: this.name,
      Version: this.version,
      Statement: this.statements.map((statement) => statement.toJSON()),
    };

    if (this.description) {
      policy.Description = this.description;
    }

    // Format custom data identifiers according to AWS documentation
    if (this.customDataIdentifiers.length > 0) {
      // Maximum of 10 custom data identifiers per policy
      if (this.customDataIdentifiers.length > 10) {
        throw new UnscopedValidationError(
          'A maximum of 10 custom data identifiers are supported per data protection policy',
        );
      }

      policy.Configuration = {
        CustomDataIdentifier: this.customDataIdentifiers.map((identifier) =>
          identifier.toJSON(),
        ),
      };
    }

    return policy;
  }

  /**
   * Returns the policy document as a string.
   */
  public toString(): string {
    return JSON.stringify(this.toJSON());
  }
}

/**
 * Collection of AWS managed data identifiers for credentials.
 *
 * Based on AWS documentation: https://docs.aws.amazon.com/sns/latest/dg/sns-message-data-protection-sensitive-data-types-credentials.html
 */
export class CredentialsIdentifiers {
  /**
   * Detects AWS secret keys.
   */
  public static readonly AWS_SECRET_KEY = new ManagedDataIdentifier(
    'AwsSecretKey',
  );

  /**
   * Detects PGP private keys.
   */
  public static readonly PGP_PRIVATE_KEY = new ManagedDataIdentifier(
    'PgpPrivateKey',
  );

  /**
   * Detects private keys.
   */
  public static readonly PRIVATE_KEY = new ManagedDataIdentifier(
    'PkcsPrivateKey',
  );

  /**
   * Detects OpenSSH private keys.
   */
  public static readonly OPENSSH_PRIVATE_KEY = new ManagedDataIdentifier(
    'OpenSshPrivateKey',
  );

  /**
   * Detects PuTTY private keys.
   */
  public static readonly PUTTY_PRIVATE_KEY = new ManagedDataIdentifier(
    'PuttyPrivateKey',
  );
}

/**
 * Collection of AWS managed data identifiers for device-related information.
 *
 * Based on AWS documentation: https://docs.aws.amazon.com/sns/latest/dg/sns-message-data-protection-sensitive-data-types-devices.html
 */
export class DeviceIdentifiers {
  /**
   * Detects IP addresses.
   */
  public static readonly IP_ADDRESS = new ManagedDataIdentifier('IpAddress');
}

/**
 * Collection of AWS managed data identifiers for financial information.
 */
export class FinancialIdentifiers {
  /**
   * Detects credit card numbers.
   */
  public static readonly CREDIT_CARD_NUMBER = new ManagedDataIdentifier(
    'CreditCardNumber',
  );

  /**
   * Detects credit card expiration dates.
   */
  public static readonly CREDIT_CARD_EXPIRATION = new ManagedDataIdentifier(
    'CreditCardExpiration',
  );

  /**
   * Detects credit card security codes (CVV).
   */
  public static readonly CREDIT_CARD_CVV = new ManagedDataIdentifier(
    'CreditCardSecurityCode',
  );

  /**
   * Detects bank account numbers.
   * @param country Two-letter country code (e.g., 'US', 'GB')
   */
  public static bankAccountNumber(country: string): ManagedDataIdentifier {
    return new ManagedDataIdentifier(`BankAccountNumber-${country}`);
  }
}

/**
 * Collection of AWS managed data identifiers for Protected Health Information (PHI).
 */
export class HealthIdentifiers {
  /**
   * Detects health insurance card numbers (EU).
   */
  public static readonly HEALTH_INSURANCE_CARD_NUMBER_EU =
    new ManagedDataIdentifier('HealthInsuranceCardNumber-EU');

  /**
   * Detects health insurance numbers (FR).
   */
  public static readonly HEALTH_INSURANCE_NUMBER_FR = new ManagedDataIdentifier(
    'HealthInsuranceNumber-FR',
  );

  /**
   * Detects healthcare common procedure coding system (HCPCS) codes (US).
   */
  public static readonly HEALTHCARE_PROCEDURE_CODE_US =
    new ManagedDataIdentifier('HealthcareProcedureCode-US');

  /**
   * Detects National Provider Identifier (NPI) numbers (US).
   */
  public static readonly NATIONAL_PROVIDER_ID_US = new ManagedDataIdentifier(
    'NationalProviderId-US',
  );

  /**
   * Detects Medicare Beneficiary Numbers (MBN) (US).
   */
  public static readonly MEDICARE_BENEFICIARY_NUMBER_US =
    new ManagedDataIdentifier('MedicareBeneficiaryNumber-US');

  /**
   * Detects National Drug Codes (NDC) (US).
   */
  public static readonly NATIONAL_DRUG_CODE_US = new ManagedDataIdentifier(
    'NationalDrugCode-US',
  );

  /**
   * Detects Drug Enforcement Agency Numbers (US).
   */
  public static readonly DRUG_ENFORCEMENT_AGENCY_NUMBER_US =
    new ManagedDataIdentifier('DrugEnforcementAgencyNumber-US');

  /**
   * Detects Health Insurance Claim Numbers (US).
   */
  public static readonly HEALTH_INSURANCE_CLAIM_NUMBER_US =
    new ManagedDataIdentifier('HealthInsuranceClaimNumber-US');

  /**
   * Detects National Insurance Numbers (GB).
   */
  public static readonly NATIONAL_INSURANCE_NUMBER_GB =
    new ManagedDataIdentifier('NationalInsuranceNumber-GB');

  /**
   * Detects NHS Numbers (GB).
   */
  public static readonly NHS_NUMBER_GB = new ManagedDataIdentifier(
    'NhsNumber-GB',
  );

  /**
   * Detects Personal Health Numbers (CA).
   */
  public static readonly PERSONAL_HEALTH_NUMBER_CA = new ManagedDataIdentifier(
    'PersonalHealthNumber-CA',
  );
}

/**
 * Collection of AWS managed data identifiers for Personally Identifiable Information (PII).
 */
export class PersonalIdentifiers {
  /**
   * Detects postal addresses.
   */
  public static readonly ADDRESS = new ManagedDataIdentifier('Address');

  /**
   * Detects email addresses.
   */
  public static readonly EMAIL_ADDRESS = new ManagedDataIdentifier(
    'EmailAddress',
  );

  /**
   * Detects full names of individuals.
   */
  public static readonly NAME = new ManagedDataIdentifier('Name');

  /**
   * Detects vehicle identification numbers (VIN).
   */
  public static readonly VEHICLE_IDENTIFICATION_NUMBER =
    new ManagedDataIdentifier('VehicleIdentificationNumber');

  /**
   * Detects phone numbers.
   * @param country Two-letter country code (e.g., 'US', 'GB')
   */
  public static phoneNumber(country: string): ManagedDataIdentifier {
    return new ManagedDataIdentifier(`PhoneNumber-${country}`);
  }

  /**
   * Detects driver's license numbers.
   * @param country Two-letter country code (e.g., 'US', 'GB')
   */
  public static driversLicense(country: string): ManagedDataIdentifier {
    return new ManagedDataIdentifier(`DriversLicense-${country}`);
  }

  /**
   * Detects passport numbers.
   * @param country Two-letter country code (e.g., 'US', 'GB')
   */
  public static passportNumber(country: string): ManagedDataIdentifier {
    return new ManagedDataIdentifier(`PassportNumber-${country}`);
  }

  /**
   * Detects Social Security Numbers (SSN).
   * @param country Two-letter country code (e.g., 'US')
   */
  public static ssn(country: string): ManagedDataIdentifier {
    return new ManagedDataIdentifier(`Ssn-${country}`);
  }
}
